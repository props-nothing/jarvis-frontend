import { useEffect, useId, useReducer, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowRight, Check, CheckCircle2, Circle, Cpu, FileText, FolderOpen, Globe, Mail, OctagonX, Pause, Play, RotateCcw, ShieldCheck } from "lucide-react";
import ApprovalDemo from "./ApprovalDemo";
import { demoReducer, demoScenarios, initialDemoState } from "../demoFlow";

const icons = [Mail, Globe, FolderOpen];
const statusLabels = { ready: "Ready", running: "Working", paused: "Paused", approval: "Your decision", completed: "Example complete", denied: "Declined", stopped: "Stopped" };

export default function WorkflowDemo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const id = useId();
  const tabs = useRef<HTMLDivElement>(null);
  const outcome = useRef<HTMLDivElement>(null);
  const scenario = demoScenarios.find((entry) => entry.id === state.scenarioId)!;
  const inspected = scenario.steps[state.viewedStep ?? Math.min(state.step, scenario.steps.length - 1)];
  const active = ["running", "paused", "approval"].includes(state.status);
  const finished = ["completed", "denied", "stopped"].includes(state.status);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (state.status !== "running") return;
    const timer = window.setTimeout(() => dispatch({ type: "tick", runId: state.runId, step: state.step }), reducedMotion ? 40 : 780);
    return () => window.clearTimeout(timer);
  }, [state.status, state.step, state.runId, reducedMotion]);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % demoScenarios.length; break;
      case "ArrowLeft": next = (index + demoScenarios.length - 1) % demoScenarios.length; break;
      case "Home": next = 0; break;
      case "End": next = demoScenarios.length - 1; break;
      default: return;
    }
    event.preventDefault();
    dispatch({ type: "select", scenarioId: demoScenarios[next].id });
    (tabs.current?.children[next] as HTMLButtonElement)?.focus();
  };
  const run = () => dispatch({ type: state.status === "running" ? "pause" : state.status === "paused" ? "resume" : "start" });
  const decide = (type: "approve" | "deny") => {
    dispatch({ type });
    outcome.current?.focus({ preventScroll: true });
  };
  const RunIcon = state.status === "running" ? Pause : state.status === "approval" ? ShieldCheck : finished ? RotateCcw : Play;
  const runLabel = state.status === "running" ? "Pause" : state.status === "paused" ? "Resume" : state.status === "approval" ? "Your decision" : finished ? "Replay" : "Run demo";
  const runName = state.status === "running" ? "Pause example workflow" : state.status === "paused" ? "Resume example workflow" : state.status === "approval" ? "Awaiting example approval" : finished ? "Replay example workflow" : "Run example workflow";

  return (
    <div className={`mission mission--${state.status}`}>
      <div className="mission__header">
        <div className="mission__identity"><Cpu size={20} strokeWidth={1.3} aria-hidden /><span translate="no">jarvis</span><span className="mission__demo-label">Illustrative demo</span></div>
        <div className="mission__controls">
          <span className="mission__status" role="status">{statusLabels[state.status]}</span>
          <button type="button" className="icon-button" aria-label="Stop example workflow" title="Stop example workflow" disabled={!active} onClick={() => dispatch({ type: "stop" })}><OctagonX size={17} aria-hidden /></button>
          <button type="button" className="icon-button" aria-label="Reset example workflow" title="Reset example workflow" disabled={state.status === "ready"} onClick={() => dispatch({ type: "select", scenarioId: state.scenarioId })}><RotateCcw size={17} aria-hidden /></button>
        </div>
      </div>
      <div className="mission__tabs" ref={tabs} role="tablist" aria-label="Example workflows">
        {demoScenarios.map((entry, index) => {
          const Icon = icons[index];
          return <button key={entry.id} type="button" role="tab" id={`${id}-${entry.id}`} aria-controls={`${id}-panel`} aria-selected={entry.id === state.scenarioId}
            tabIndex={entry.id === state.scenarioId ? 0 : -1} onClick={() => dispatch({ type: "select", scenarioId: entry.id })} onKeyDown={(event) => onTabKey(event, index)}>
            <Icon size={18} strokeWidth={1.4} aria-hidden /> {entry.label}
          </button>;
        })}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${state.scenarioId}`}>
        <div className="mission__prompt"><div><span className="mission__label">The task</span><p>{scenario.prompt}</p></div>
          <button type="button" className="btn btn--solid mission__run" aria-label={runName} disabled={state.status === "approval"} onClick={run}><RunIcon size={16} aria-hidden /> {runLabel}</button>
        </div>
        <div className="mission__progress" role="progressbar" aria-label="Example workflow progress" aria-valuemin={0} aria-valuemax={scenario.steps.length} aria-valuenow={state.step}>
          {scenario.steps.map((step, index) => <span key={step.title} className={index < state.step ? "is-done" : index === state.step && active ? "is-current" : ""} />)}
        </div>
        <div className="mission__workspace">
          <div className="mission__activity">
            <div className="mission__pane-head"><h3>Mission trace</h3><span>{state.step} / {scenario.steps.length} steps</span></div>
            <ol className="mission__steps">
              {scenario.steps.map((step, index) => {
                const done = index < state.step;
                const current = index === state.step && state.status !== "ready";
                const StepIcon = done ? CheckCircle2 : current && state.status === "approval" ? ShieldCheck : Circle;
                return <li key={step.title} className={`${done ? "is-done" : ""} ${current ? "is-current" : ""}`}>
                  <button type="button" aria-label={`Inspect step ${index + 1}: ${step.title}`} aria-pressed={state.viewedStep === index}
                    disabled={index > state.step} onClick={() => dispatch({ type: "inspect", step: index })}>
                    <StepIcon size={21} strokeWidth={1.3} aria-hidden /><span><strong>{step.title}</strong><small>{step.policy}</small></span>
                    <span className="mission__step-number">{String(index + 1).padStart(2, "0")}</span>
                  </button>
                </li>;
              })}
            </ol>
            <div className="mission__inspection"><span className="mission__label">Example context</span><p>{inspected.detail}</p><ul>{inspected.sources.map((source) => <li key={source}><FileText size={14} aria-hidden /><span>{source}</span></li>)}</ul></div>
          </div>
          <div className="mission__outcome" ref={outcome} role="region" aria-labelledby={`${id}-outcome`} tabIndex={-1}>
            <div className="mission__pane-head"><h3 id={`${id}-outcome`}>Outcome preview</h3><ShieldCheck size={18} aria-hidden /></div>
            {state.status === "approval" && scenario.approval ? <ApprovalDemo question={scenario.approval.ask} detail={scenario.approval.detail}
              onApprove={() => decide("approve")} onDeny={() => decide("deny")} /> :
              state.status === "completed" ? <div className="mission__result"><CheckCircle2 size={38} strokeWidth={1.2} aria-hidden /><h4>{scenario.result.title}</h4><ul>{scenario.result.lines.map((line) => <li key={line}><Check size={15} aria-hidden /><span>{line}</span></li>)}</ul></div> :
              state.status === "denied" || state.status === "stopped" ? <div className="mission__result mission__result--held"><OctagonX size={38} strokeWidth={1.2} aria-hidden /><h4>{state.status === "denied" ? "Your no is the end of it." : "Stopped. Still your call."}</h4><p>{state.status === "denied" ? "The final example action was declined. It would not be executed." : "This example stopped before completion. No further steps will advance."}</p></div> :
              <div className="mission__result mission__result--pending"><Cpu size={38} strokeWidth={1.2} aria-hidden /><h4>{state.status === "ready" ? "A task, not another chat thread." : state.status === "paused" ? "Paused at your command." : scenario.steps[state.step].title}</h4><p>{state.status === "ready" ? "A scoped plan, visible context and a clear outcome. Consequential example actions wait for your decision." : state.status === "paused" ? "The example holds its place until you resume or stop it." : scenario.steps[state.step].detail}</p><span className="mission__boundary-note"><ShieldCheck size={16} aria-hidden /> Policy stays between intent and effect.</span></div>}
          </div>
        </div>
      </div>
      <div className="mission__footer"><span>Illustrative workflows. No model, account or filesystem is connected.</span><span><ArrowRight size={14} aria-hidden /> Your assistant. Your decision.</span></div>
    </div>
  );
}
