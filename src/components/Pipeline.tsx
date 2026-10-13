import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight, Braces, Brain, FileCheck2, Fingerprint, KeyRound, ShieldCheck, TriangleAlert, UserCheck, Zap } from "lucide-react";
import { pipeline } from "../content";

const gateIcons = [Braces, Fingerprint, KeyRound, TriangleAlert, UserCheck, Zap, FileCheck2];

export default function Pipeline() {
  const [active, setActive] = useState(4);
  const id = useId();
  const tabs = useRef<HTMLDivElement>(null);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % pipeline.length; break;
      case "ArrowLeft": next = (index + pipeline.length - 1) % pipeline.length; break;
      case "Home": next = 0; break;
      case "End": next = pipeline.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActive(next);
    (tabs.current?.children[next] as HTMLButtonElement)?.focus();
  };

  return (
    <div className="policy">
      <div className="policy__flow" aria-label="Models request; Rust policy authorizes; tools execute">
        <div className="policy__endpoint policy__endpoint--request">
          <Brain size={32} strokeWidth={1.3} aria-hidden />
          <strong>Model intent</strong>
          <span>A request. Not a permission.</span>
        </div>
        <div className="policy__boundary">
          <ShieldCheck size={52} strokeWidth={1.1} aria-hidden />
          <div><span>Authority boundary</span><strong>Rust policy</strong><p>Your grants. Your decision.</p></div>
        </div>
        <div className="policy__endpoint policy__endpoint--effect">
          <FileCheck2 size={32} strokeWidth={1.3} aria-hidden />
          <strong>Authorized effect</strong>
          <span>Scoped execution. Recorded outcome.</span>
        </div>
        <ArrowRight className="policy__arrow policy__arrow--first" size={20} aria-hidden />
        <ArrowRight className="policy__arrow policy__arrow--last" size={20} aria-hidden />
      </div>
      <div className="policy__gates" ref={tabs} role="tablist" aria-label="Policy gates">
        {pipeline.map((gate, index) => {
          const Icon = gateIcons[index];
          return (
            <button key={gate.step} type="button" role="tab" id={`${id}-gate-${index}`} aria-selected={active === index}
              aria-controls={`${id}-detail`} tabIndex={active === index ? 0 : -1} className="policy__gate"
              onClick={() => setActive(index)} onKeyDown={(event) => onKey(event, index)}>
              <span className="policy__gate-top"><span>{String(index + 1).padStart(2, "0")}</span><Icon size={20} strokeWidth={1.5} aria-hidden /></span>
              <strong>{gate.step}</strong><small>{gate.note}</small>
            </button>
          );
        })}
      </div>
      <div className="policy__detail" id={`${id}-detail`} role="tabpanel" aria-labelledby={`${id}-gate-${active}`} tabIndex={0}>
        <span className="policy__detail-index" aria-hidden>{String(active + 1).padStart(2, "0")}</span>
        <div><h3>{pipeline[active].step}</h3><p>{pipeline[active].detail}</p></div>
        <span className="policy__rule"><ShieldCheck size={16} aria-hidden /> No effect before authorization</span>
      </div>
    </div>
  );
}
