import { useEffect, useRef } from "react";

type V3 = [number, number, number];

const CYAN = "94, 227, 255";
const AMBER = "255, 180, 84";

function fibonacciSphere(count: number): V3[] {
  const points: V3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return points;
}

function ring(radius: number, count: number): V3[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return [Math.cos(a) * radius, 0, Math.sin(a) * radius] as V3;
  });
}

function rotate([x, y, z]: V3, rx: number, ry: number, rz: number): V3 {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  let nx = x * cy + z * sy;
  let nz = -x * sy + z * cy;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const ny = y * cx - nz * sx;
  nz = y * sx + nz * cx;
  const cz = Math.cos(rz), sz = Math.sin(rz);
  const fx = nx * cz - ny * sz;
  const fy = nx * sz + ny * cz;
  nx = fx;
  return [nx, fy, nz];
}

/** A rotating holographic head-orb that tilts toward the pointer and "speaks" on hover. */
export default function Orb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sphere = fibonacciSphere(760);
    const rings = [
      { pts: ring(1.32, 160), tilt: [0.5, 0, 0.2] as V3, speed: 0.35, color: CYAN },
      { pts: ring(1.55, 200), tilt: [1.2, 0, -0.4] as V3, speed: -0.22, color: AMBER },
      { pts: ring(1.8, 240), tilt: [-0.35, 0, 0.9] as V3, speed: 0.15, color: CYAN },
    ];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let targetX = 0;
    let targetY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let energy = 0.25;
    let targetEnergy = 0.25;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      const t = now / 1000;
      tiltX += (targetX - tiltX) * 0.06;
      tiltY += (targetY - tiltY) * 0.06;
      energy += (targetEnergy - energy) * 0.05;

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.27;
      const focal = 3.2;

      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 2.4);
      glow.addColorStop(0, `rgba(${CYAN}, ${0.16 + energy * 0.14})`);
      glow.addColorStop(0.5, `rgba(${CYAN}, 0.05)`);
      glow.addColorStop(1, "rgba(2, 6, 12, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const project = (p: V3): [number, number, number] => {
        const [x, y, z] = rotate(p, tiltY * 0.5 + 0.18, t * 0.22 + tiltX * 0.9, 0);
        const k = focal / (focal + z);
        return [cx + x * scale * k, cy + y * scale * k, z];
      };

      for (const p of sphere) {
        const wave = 1 + Math.sin(p[1] * 7 + t * 4.2) * 0.045 * energy + Math.sin(p[0] * 5 - t * 2.6) * 0.02 * energy;
        const [sx, sy, z] = project([p[0] * wave, p[1] * wave, p[2] * wave]);
        const depth = (z + 1) / 2;
        const size = 0.6 + (1 - depth) * 1.5;
        ctx.fillStyle = `rgba(${CYAN}, ${0.12 + (1 - depth) * 0.75})`;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }

      for (let lat = -0.75; lat <= 0.76; lat += 0.25) {
        const radius = Math.sqrt(1 - lat * lat);
        ctx.beginPath();
        for (let i = 0; i <= 72; i++) {
          const a = (i / 72) * Math.PI * 2;
          const [sx, sy] = project([Math.cos(a) * radius, lat, Math.sin(a) * radius]);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = `rgba(${CYAN}, 0.1)`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      for (const r of rings) {
        for (let i = 0; i < r.pts.length; i++) {
          const rotated = rotate(r.pts[i], r.tilt[0], t * r.speed, r.tilt[2]);
          const [sx, sy, z] = project(rotated);
          const depth = (z / 1.8 + 1) / 2;
          const head = (i / r.pts.length + t * 0.12 * Math.sign(r.speed)) % 1;
          const bright = Math.max(0, 1 - Math.abs(head - 0.5) * 2.4);
          ctx.fillStyle = `rgba(${r.color}, ${0.1 + (1 - depth) * 0.4 + bright * 0.4})`;
          ctx.fillRect(sx - 0.8, sy - 0.8, 1.6, 1.6);
        }
      }

      // Core: a small arc-reactor eye that brightens with energy.
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.34);
      core.addColorStop(0, `rgba(255, 255, 255, ${0.55 + energy * 0.4})`);
      core.addColorStop(0.35, `rgba(${CYAN}, ${0.5 + energy * 0.3})`);
      core.addColorStop(1, `rgba(${CYAN}, 0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.34, 0, Math.PI * 2);
      ctx.fill();

      // Voice bars under the head.
      const bars = 32;
      const baseY = cy + scale * 1.95;
      for (let i = 0; i < bars; i++) {
        const x = cx + (i - bars / 2) * 7;
        const h = 3 + (Math.sin(i * 0.7 + t * 5) * 0.5 + 0.5) * (4 + energy * 26) * Math.sin((i / bars) * Math.PI);
        ctx.fillStyle = `rgba(${CYAN}, ${0.25 + energy * 0.5})`;
        ctx.fillRect(x, baseY - h / 2, 2, h);
      }

      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.9;
    };
    const onEnter = () => (targetEnergy = 1);
    const onLeave = () => {
      targetEnergy = 0.25;
      targetX = 0;
      targetY = 0;
    };

    resize();
    raf = requestAnimationFrame(frame);

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    });
    observer.observe(canvas);

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="orb" role="img" aria-label="Animated holographic JARVIS head" />;
}
