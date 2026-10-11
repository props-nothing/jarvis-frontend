import { useEffect, useRef, useState } from "react";

type Step =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone?: "ok" | "ask" | "dim" | "tool" };

const script: Step[] = [
  { kind: "cmd", text: "jarvis" },
  { kind: "out", text: "Which model should JARVIS use?  qwen3:14b (found on your Ollama)", tone: "ask" },
  { kind: "out", text: "Folder it may read and write?   ~/notes", tone: "ask" },
  { kind: "out", text: "✓ assistant started in the background", tone: "ok" },
  { kind: "out", text: "✓ console open at http://127.0.0.1:8765/", tone: "ok" },
  { kind: "cmd", text: "jarvis ask summarise today's unread mail and draft replies" },
  { kind: "out", text: "▸ mail search        read-only      allowed", tone: "tool" },
  { kind: "out", text: "▸ mail read ×4       read-only      allowed", tone: "tool" },
  { kind: "out", text: "▸ mail save draft    writes a draft allowed by your policy", tone: "tool" },
  { kind: "out", text: "▸ mail send          reaches another person → waiting for you", tone: "ask" },
  { kind: "cmd", text: "jarvis approvals list" },
  { kind: "out", text: "1 pending: send mail to a contact. Approve in the console, or: jarvis approvals approve", tone: "dim" },
];

export default function Terminal() {
  const [lines, setLines] = useState<{ step: Step; shown: string }[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLines(script.map((step) => ({ step, shown: step.text })));
      return;
    }
    let cancelled = false;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => !cancelled && fn(), ms));
    };

    const run = (index: number) => {
      if (index >= script.length) return;
      const step = script[index];
      if (step.kind === "out") {
        setLines((prev) => [...prev, { step, shown: step.text }]);
        later(step.tone === "tool" ? 420 : 560, () => run(index + 1));
        return;
      }
      setLines((prev) => [...prev, { step, shown: "" }]);
      let i = 0;
      const type = () => {
        i += 1;
        setLines((prev) => prev.map((l, n) => (n === prev.length - 1 ? { ...l, shown: step.text.slice(0, i) } : l)));
        if (i < step.text.length) later(22 + Math.random() * 30, type);
        else later(480, () => run(index + 1));
      };
      later(350, type);
    };
    run(0);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [started]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines]);

  return (
    <div className="term" ref={rootRef}>
      <div className="term__bar">
        <span className="dot dot--r" />
        <span className="dot dot--y" />
        <span className="dot dot--g" />
        <span className="term__title">jarvis — illustrative session</span>
      </div>
      <div className="term__body" ref={bodyRef} aria-label="Illustrative terminal session">
        {lines.map((l, i) =>
          l.step.kind === "cmd" ? (
            <div key={i} className="term__cmd">
              <span className="term__prompt">$</span> {l.shown}
              {i === lines.length - 1 && l.shown.length < l.step.text.length ? <span className="caret" /> : null}
            </div>
          ) : (
            <div key={i} className={`term__out term__out--${l.step.tone ?? "plain"}`}>
              {l.shown}
            </div>
          ),
        )}
        {started && lines.length >= script.length ? <span className="caret caret--idle" /> : null}
      </div>
      <p className="term__foot">Wording is illustrative. Run it yourself to see the real prompts.</p>
    </div>
  );
}
