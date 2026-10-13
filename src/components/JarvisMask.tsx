import { useEffect, useRef } from "react";
import {
  BufferGeometry, Group, Mesh, MeshBasicMaterial, OrthographicCamera,
  Scene, WebGLRenderer, DoubleSide,
} from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import faceSource from "../assets/canonical-face.obj?raw";

export default function JarvisMask({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLCanvasElement>(null);
  const syncRef = useRef<(() => void) | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!canvas || !fallback) return;

    const parsed = new OBJLoader().parse(faceSource);
    const source = parsed.children.find((child): child is Mesh<BufferGeometry> => child instanceof Mesh);
    if (!source) return;
    const geometry = source.geometry;
    geometry.center();
    const originalMaterials = Array.isArray(source.material) ? source.material : [source.material];
    originalMaterials.forEach((material) => material.dispose());

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { horizontal: 0, vertical: 0 };
    let visible = true;
    let contextLost = false;
    let width = 1;
    let height = 1;
    let lastFrame = 0;
    let elapsed = 0;
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
      const scale = Math.min(height / 23, width / 20);
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
    const camera = new OrthographicCamera(-12, 12, 11.5, -11.5, 0.1, 100);
    camera.position.z = 40;
    const face = new Group();
    const surface = new MeshBasicMaterial({ color: 0x071310, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: 1 });
    const wire = new MeshBasicMaterial({ color: 0x68e7e0, wireframe: true, transparent: true, opacity: 0.62 });
    face.add(new Mesh(geometry, surface), new Mesh(geometry, wire));
    face.rotation.set(-0.04, -0.12, 0);
    scene.add(face);

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
      if (!motion.matches && !pausedRef.current) {
        elapsed += delta;
        const smoothing = 1 - Math.exp(-delta * 5);
        const horizontal = -0.12 + Math.sin(elapsed * 0.45) * 0.1 + pointer.horizontal;
        const vertical = -0.04 + Math.sin(elapsed * 0.6) * 0.025 + pointer.vertical;
        face.rotation.y += (horizontal - face.rotation.y) * smoothing;
        face.rotation.x += (vertical - face.rotation.x) * smoothing;
      }
      renderer.render(scene, camera);
    };

    const sync = () => {
      if (!renderer || contextLost) return;
      lastFrame = 0;
      renderer.setAnimationLoop(null);
      render(performance.now());
      if (visible && !document.hidden && !motion.matches && !pausedRef.current) {
        renderer.setAnimationLoop(render);
      }
    };
    syncRef.current = sync;

    const resize = () => {
      const bounds = canvas.parentElement!.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      paintFallback();
      if (renderer && !contextLost) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);
        const halfWidth = 11.5 * width / height;
        camera.left = -halfWidth;
        camera.right = halfWidth;
        camera.updateProjectionMatrix();
        sync();
      }
    };
    const move = (event: PointerEvent) => {
      if (motion.matches || pausedRef.current || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointer.horizontal = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.45;
      pointer.vertical = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.18;
    };
    const leave = () => { pointer.horizontal = 0; pointer.vertical = 0; };
    const lose = () => {
      contextLost = true;
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
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("webglcontextlost", lose);
    canvas.addEventListener("webglcontextrestored", restore);

    return () => {
      syncRef.current = null;
      renderer?.setAnimationLoop(null);
      resizeObserver.disconnect();
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("webglcontextlost", lose);
      canvas.removeEventListener("webglcontextrestored", restore);
      geometry.dispose();
      surface.dispose();
      wire.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="mask__canvas" role="img" aria-label="JARVIS holographic face, using the console's canonical face mesh" />
      <canvas ref={fallbackRef} className="mask__canvas" hidden role="img" aria-label="JARVIS holographic face" />
    </>
  );
}