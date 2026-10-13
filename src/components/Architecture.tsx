import { Activity, Brain, Code2, Cpu, Database, FileKey2, Globe, KeyRound, Layers3, ListChecks, Mail, Mic, Monitor, Network, Phone, Plug, Send, ShieldCheck, TerminalSquare, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ArchitectureNode = { name: string; note: string; icon: LucideIcon; status?: "experimental" };

const clients = [
  { name: "Console", icon: Monitor }, { name: "CLI", icon: TerminalSquare },
  { name: "Telegram", icon: Send }, { name: "Connected apps", icon: Plug },
];
const reasoning: ArchitectureNode[] = [
  { name: "Models", note: "Local or hosted. Replaceable.", icon: Brain },
  { name: "ACP agents", note: "Worktrees, not OS isolation. Codex tasks verified; sign-in and cancellation checks remain.", icon: Code2, status: "experimental" },
  { name: "Phone provider", note: "Owner reports working outbound calls. Broader paths need proof.", icon: Phone, status: "experimental" },
];
const capabilities: ArchitectureNode[] = [
  { name: "MCP servers", note: "Tools through open protocols", icon: Plug },
  { name: "Google & web", note: "Mail, calendar and browser", icon: Mail },
  { name: "Sandbox workers", note: "Disposable code execution", icon: Layers3 },
];
const core = [
  { name: "Identity & gateway", icon: KeyRound }, { name: "Policy & approvals", icon: ShieldCheck },
  { name: "Tools & native runs", icon: Network }, { name: "Memory & context", icon: Brain },
  { name: "Schedules & triggers", icon: Workflow }, { name: "Audit & usage", icon: ListChecks },
];

function AdapterNodes({ nodes }: { nodes: ArchitectureNode[] }) {
  return <ul className="arch__nodes">{nodes.map(({ name, note, icon: Icon, status }) => (
    <li key={name} className={`arch__node ${status ? "arch__node--experimental" : ""}`}>
      <Icon size={24} strokeWidth={1.3} aria-hidden />
      <div><strong>{name}</strong>{status ? <span className="arch__status">Experimental</span> : null}<p>{note}</p></div>
    </li>
  ))}</ul>;
}

export default function Architecture() {
  return (
    <figure className="arch" aria-label="JARVIS local-first system architecture">
      <div className="arch__ports" aria-label="Available interfaces">
        {clients.map(({ name, icon: Icon }) => <div className="arch__port" key={name}><Icon size={22} strokeWidth={1.4} aria-hidden /><span>{name}</span></div>)}
      </div>
      <div className="arch__ingress"><span>Authenticated requests</span></div>
      <div className="arch__system">
        <div className="arch__adapters arch__adapters--reasoning"><h3>Replaceable intelligence</h3><AdapterNodes nodes={reasoning} /></div>
        <div className="arch__core">
          <div className="arch__core-head"><Cpu size={40} strokeWidth={1.1} aria-hidden /><span>Rust control plane</span><h3 translate="no">jarvisd</h3><p>One authority. Every surface.</p></div>
          <ul className="arch__modules">{core.map(({ name, icon: Icon }) => <li key={name}><Icon size={18} strokeWidth={1.4} aria-hidden /><span>{name}</span></li>)}</ul>
          <div className="arch__core-foot"><ShieldCheck size={16} aria-hidden /> Models never own permission</div>
        </div>
        <div className="arch__adapters arch__adapters--tools"><h3>Replaceable capabilities</h3><AdapterNodes nodes={capabilities} /></div>
      </div>
      <div className="arch__storage-line" aria-hidden />
      <div className="arch__storage">
        <div><Database size={25} strokeWidth={1.4} aria-hidden /><strong>Local SQLite</strong><span>Memory, runs, approvals, audit</span></div>
        <div><FileKey2 size={25} strokeWidth={1.4} aria-hidden /><strong>Private profile files</strong><span>Configuration and credentials</span></div>
        <div><Activity size={25} strokeWidth={1.4} aria-hidden /><strong>Inspectable state</strong><span>Your evidence, not a provider's history</span></div>
      </div>
      <figcaption className="arch__future">
        <span>Not shipped</span>
        <span><Monitor size={14} aria-hidden /> Desktop client</span>
        <span><Mic size={14} aria-hidden /> Browser-independent local voice</span>
        <span><Globe size={14} aria-hidden /> Server / multi-device profile</span>
      </figcaption>
    </figure>
  );
}
