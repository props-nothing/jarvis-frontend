import { ArrowRight } from "lucide-react";
import Section from "../components/Section";
import { QUICK_START_URL } from "../config";

const integrations = [
  { name: "Google", kind: "Built-in connection", description: "Gmail and Calendar, connected from Settings.", detail: "Work with mail, drafts, attachments and events. Sending asks first. Gmail Trash requires a new sign-in for existing accounts to grant the additional scope." },
  { name: "Telegram", kind: "Built-in connection", description: "Conversations and approval decisions from your phone.", detail: "Configure it in Settings. No tunnel or public daemon port is needed; messages and decisions travel through Telegram." },
  { name: "Models", kind: "Configurable provider", description: "A local or hosted OpenAI-compatible model.", detail: "Choose your model during setup. Hosted providers receive the context needed to answer; availability and capability depend on the provider and model you select." },
  { name: "Voice", kind: "Optional adapter", description: "Browser speech with optional ElevenLabs synthesis.", detail: "Browser push-to-talk, a wake word and interruptible answers. Recognition depends on browser support and may use its speech service. This is not offline local voice." },
  { name: "MCP tools", kind: "Optional adapter", description: "Connect local or remote tool servers.", detail: "Manage servers in Settings with named keys or browser sign-in through a registered provider app. Compatibility must be verified for each provider; approvals remain with you." },
  { name: "Coding agents", kind: "Experimental", description: "Background coding jobs through ACP.", detail: "Permitted folders, optional Git worktrees and independent checks. Host processes are not a sandbox. Fresh sign-in, other-agent/platform cancellation and full website delivery still need proof." },
];

export default function Integrations() {
  return <Section pageHeading id="integrations" title="Your tools, connected." lede="Start with a model. Add the connections you use, when you need them.">
    <div className="integration-list">
      {integrations.map((item) => <article className="integration" key={item.name}>
        <header><h2>{item.name}</h2><span className="integration__kind">{item.kind}</span></header>
        <div><p className="integration__summary">{item.description}</p>
          <details className="disclosure integration__details">
            <summary>{item.kind === "Experimental" ? "Current limits" : "Setup and permissions"}<span className="sr-only"> for {item.name}</span></summary>
            <p>{item.detail}</p>
          </details>
        </div>
      </article>)}
    </div>
    <div className="page-next"><p>Manage your connections in Settings.</p><a className="text-link" href={QUICK_START_URL} target="_blank" rel="noreferrer">Read the setup guide <ArrowRight size={16} aria-hidden /></a></div>
  </Section>;
}
