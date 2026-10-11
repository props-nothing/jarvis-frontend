import { useEffect, useState } from "react";
import { pipeline } from "../content";

export default function Pipeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((n) => (n + 1) % pipeline.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pipeline" role="list" aria-label="Every tool call passes these gates">
      <div className="pipeline__model" role="listitem">
        <span className="pill">Model</span>
        <strong>requests an effect</strong>
      </div>
      {pipeline.map((p, i) => (
        <div
          key={p.step}
          role="listitem"
          className={`pipeline__step ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
          onMouseEnter={() => setActive(i)}
        >
          <span className="pipeline__n">{String(i + 1).padStart(2, "0")}</span>
          <strong>{p.step}</strong>
          <small>{p.note}</small>
        </div>
      ))}
    </div>
  );
}
