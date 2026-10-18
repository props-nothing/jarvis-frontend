import { useEffect, useRef } from "react";
import {
  BufferAttribute, BufferGeometry, Group, Mesh, MeshBasicMaterial, OrthographicCamera,
  Scene, WebGLRenderer, DoubleSide, DynamicDrawUsage, Points, PointsMaterial, AdditiveBlending,
} from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import faceSource from "../assets/canonical-face.obj?raw";

export default function JarvisMask() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLCanvasElement>(null);
  const interactRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !fallback) return;
    const button = canvas.parentElement as HTMLButtonElement;

    const parsed = new OBJLoader().parse(faceSource);
    const source = parsed.children.find((child): child is Mesh<BufferGeometry> => child instanceof Mesh);
    if (!source) return;
    const geometry = source.geometry;
    geometry.computeBoundingBox();
    const centerY = (geometry.boundingBox!.min.y + geometry.boundingBox!.max.y) / 2;
    geometry.center();
    const positions = geometry.getAttribute("position") as BufferAttribute;
    positions.setUsage(DynamicDrawUsage);
    const resting = Float32Array.from(positions.array);
    // Smooth local weights keep shared triangle vertices together while blinking.
    const eyelids = new Float32Array(positions.count);
    const brows = new Float32Array(positions.count);
    const jaw = new Float32Array(positions.count);
    const colors = new BufferAttribute(new Float32Array(positions.count * 3), 3).setUsage(DynamicDrawUsage);
    geometry.setAttribute("color", colors);
    for (let index = 0; index < positions.count; index += 1) {
      const x = Math.abs(positions.getX(index));
      const y = positions.getY(index) + centerY;
      eyelids[index] = Math.exp(-(((x - 3.15) / 1.3) ** 4) - ((y - 2.7) / 0.65) ** 4);
      brows[index] = Math.exp(-(((x - 3.1) / 1.6) ** 4) - ((y - 4.15) / 0.7) ** 4);
      jaw[index] = Math.max(0, Math.min(1, (-y - 3.8) / 3));
      colors.setXYZ(index, 0.16 + eyelids[index] * 0.65, 0.5 + eyelids[index] * 0.4, 0.56 + eyelids[index] * 0.4);
    }
    const originalMaterials = Array.isArray(source.material) ? source.material : [source.material];
    originalMaterials.forEach((material) => material.dispose());

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let contextLost = false;
    let width = 1;
    let height = 1;
    let lastFrame = 0;
    let elapsed = 0;
    let reactionStart = -10;
    let renderer: WebGLRenderer | null = null;

    const paintFallback = () => {
      const context = fallback.getContext("2d");
      if (!context) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      fallback.width = Math.round(width * ratio);
      fallback.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const vertices = geometry.getAttribute("position");
      const scale = Math.min(height / 21, width / 18);
      context.strokeStyle = "rgba(104, 231, 224, 0.65)";
      context.lineWidth = 0.65;
      context.beginPath();
      for (let triangle = 0; triangle < vertices.count; triangle += 3) {
        for (let corner = 0; corner <= 3; corner += 1) {
          const index = triangle + corner % 3;
          const horizontal = width / 2 + vertices.getX(index) * scale;
          const vertical = height / 2 - vertices.getY(index) * scale;
          if (corner === 0) context.moveTo(horizontal, vertical);
          else context.lineTo(horizontal, vertical);
        }
      }
      context.stroke();
    };

    const scene = new Scene();
    const camera = new OrthographicCamera(-12, 12, 10.5, -10.5, 0.1, 100);
    camera.position.z = 40;
    const face = new Group();
    const surface = new MeshBasicMaterial({ color: 0x030d10, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: 1 });
    const wire = new MeshBasicMaterial({ vertexColors: true, wireframe: true, transparent: true, opacity: 0.8 });
    const nodes = new PointsMaterial({ color: 0xb2fffa, size: 1.3, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.65, blending: AdditiveBlending, depthWrite: false });
    face.add(new Mesh(geometry, surface), new Mesh(geometry, wire), new Points(geometry, nodes));
    face.rotation.set(-0.04, -0.12, 0);
    scene.add(face);

    // Sparse fragments give the hologram depth without a texture or postprocessing pass.
    const fragments = new BufferGeometry();
    const fragmentPositions = new BufferAttribute(new Float32Array(144 * 3), 3).setUsage(DynamicDrawUsage);
    fragments.setAttribute("position", fragmentPositions);
    const fragmentMaterial = new PointsMaterial({ color: 0x71e9ed, size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0.48, blending: AdditiveBlending, depthWrite: false });
    const cloud = new Points(fragments, fragmentMaterial);
    cloud.frustumCulled = false;
    scene.add(cloud);
    const updateFragments = (time: number, energy: number) => {
      for (let index = 0; index < fragmentPositions.count; index += 1) {
        const angle = index * 2.39996 + time * (0.025 + index % 3 * 0.012);
        const radius = 1 + (index % 7) * 0.035 + energy * 0.1;
        fragmentPositions.setXYZ(index,
          Math.cos(angle) * 7.7 * radius,
          Math.sin(angle) * 8.7 * radius,
          Math.sin(index * 1.73 + time * 0.18) * 3 - 1);
      }
      fragmentPositions.needsUpdate = true;
    };
    updateFragments(0, 0);

    try {
      const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power" });
      if (context) renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    } catch {
      renderer = null;
    }

    const render = (now: number) => {
      if (!renderer || contextLost) return;
      const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
      lastFrame = now;
      if (!motion.matches) {
        elapsed += delta;
        const smoothing = 1 - Math.exp(-delta * 4);
        const reactionAge = elapsed - reactionStart;
        const reaction = Math.min(Math.max(reactionAge / 3, 0), 1);
        const acknowledgement = Math.sin(reaction * Math.PI) ** 2;
        const horizontal = (Math.sin(elapsed * 0.42) * 0.48 + Math.sin(elapsed * 0.17 + 1) * 0.16) * (1 - acknowledgement);
        const vertical = -0.04 + Math.sin(elapsed * 0.57) * 0.1 - Math.sin(reaction * Math.PI * 2) * acknowledgement * 0.26;
        face.rotation.y += (horizontal - face.rotation.y) * smoothing;
        face.rotation.x += (vertical - face.rotation.x) * smoothing;
        face.rotation.z = Math.sin(elapsed * 0.31) * 0.045 * (1 - acknowledgement);
        face.position.y = Math.sin(elapsed * 1.15) * 0.14;
        face.scale.setScalar(1 + acknowledgement * 0.035);
        const blinkPhase = elapsed % 11.8;
        const blink = Math.max(0, 1 - Math.abs(blinkPhase - 3.1) / 0.14, 1 - Math.abs(blinkPhase - 8.4) / 0.17);
        const curiosity = Math.max(0, Math.sin(elapsed * 0.7)) ** 6;
        const scanY = 10 - (elapsed * 2.4) % 21;
        const pulseRadius = reactionAge * 8;
        for (let index = 0; index < positions.count; index += 1) {
          const y = resting[index * 3 + 1];
          const x = resting[index * 3];
          positions.setY(index, y + (2.7 - centerY - y) * eyelids[index] * blink * 0.95
            + brows[index] * (acknowledgement * 0.45 + curiosity * 0.2)
            - jaw[index] * (curiosity * 0.16 + acknowledgement * 0.22));
          const sweep = Math.exp(-((y - scanY) ** 2) * 1.8);
          const pulse = reactionAge < 3 ? Math.exp(-((Math.hypot(x, y - 2) - pulseRadius) ** 2) * 0.6) : 0;
          const eye = eyelids[index] * (1 - blink) * (0.45 + curiosity * 0.2);
          const light = sweep * 0.45 + pulse * 0.65 + acknowledgement * 0.12;
          colors.setXYZ(index, Math.min(1, 0.12 + eye + light), Math.min(1, 0.42 + eye + light), Math.min(1, 0.5 + eye + light));
        }
        positions.needsUpdate = true;
        colors.needsUpdate = true;
        wire.opacity = 0.8 + acknowledgement * 0.2;
        nodes.size = 1.3 + acknowledgement * 0.9;
        fragmentMaterial.opacity = 0.36 + acknowledgement * 0.32;
        updateFragments(elapsed, acknowledgement);
      }
      renderer.render(scene, camera);
    };

    const sync = () => {
      button.disabled = motion.matches || !renderer || contextLost;
      if (!renderer || contextLost) return;
      lastFrame = 0;
      renderer.setAnimationLoop(null);
      render(performance.now());
      if (visible && !document.hidden && !motion.matches) {
        renderer.setAnimationLoop(render);
      }
    };
    interactRef.current = () => {
      if (!motion.matches) reactionStart = elapsed;
    };

    const resize = () => {
      const bounds = canvas.parentElement!.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      paintFallback();
      if (renderer && !contextLost) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);
        const halfHeight = Math.max(10.5, 9 * height / width);
        const halfWidth = halfHeight * width / height;
        camera.left = -halfWidth;
        camera.right = halfWidth;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
        sync();
      }
    };
    const lose = () => {
      contextLost = true;
      button.disabled = true;
      renderer?.setAnimationLoop(null);
      canvas.hidden = true;
      fallback.hidden = false;
      paintFallback();
    };
    const restore = () => {
      contextLost = false;
      canvas.hidden = false;
      fallback.hidden = true;
      resize();
    };

    canvas.hidden = !renderer;
    fallback.hidden = Boolean(renderer);
    button.disabled = motion.matches || !renderer;
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement!);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas.parentElement!);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    canvas.addEventListener("webglcontextlost", lose);
    canvas.addEventListener("webglcontextrestored", restore);

    return () => {
      interactRef.current = null;
      renderer?.setAnimationLoop(null);
      resizeObserver.disconnect();
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", lose);
      canvas.removeEventListener("webglcontextrestored", restore);
      geometry.dispose();
      surface.dispose();
      wire.dispose();
      nodes.dispose();
      fragments.dispose();
      fragmentMaterial.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <button type="button" className="mask__interact" aria-label="Animate JARVIS" onClick={() => interactRef.current?.()}>
      <canvas ref={canvasRef} className="mask__canvas" aria-hidden />
      <canvas ref={fallbackRef} className="mask__canvas" hidden aria-hidden />
    </button>
  );
}
