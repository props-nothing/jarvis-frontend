import Section from "../components/Section";
import Pipeline from "../components/Pipeline";
import Architecture from "../components/Architecture";
import { ADR_URL, ARCHITECTURE_URL } from "../config";

export default function HowItWorks() {
  return <Section pageHeading id="trust" title="From a request to a result."
    lede="You set the task and the permissions. JARVIS works within them.">
    <ol className="how-steps">
      <li><h2>You ask.</h2><p>Describe the job. The model uses the available context to propose actions.</p></li>
      <li><h2>JARVIS checks.</h2><p>Rust policy checks access and risk. When an action needs approval, you answer yes or no.</p></li>
      <li><h2>The tools act.</h2><p>Approved actions run within their scope. JARVIS records the outcome for you to inspect.</p></li>
    </ol>
    <details className="disclosure technical-detail">
      <summary>Explore the policy checks</summary>
      <Pipeline />
    </details>

    <section className="reading-section" aria-labelledby="control-heading">
      <h2 id="control-heading">You stay in the loop.</h2>
      <div className="trust">
        <div className="trust__item"><h3>A simple yes or no</h3><p>Approve from an authenticated console, command or voice surface. No extra codes or devices.</p></div>
        <div className="trust__item"><h3>Stop when you need to</h3><p>Use the console stop control, <code>jarvis cancel</code>, or say “Jarvis, stop” in browser voice.</p></div>
        <div className="trust__item"><h3>Content cannot grant access</h3><p>A page, email or tool result cannot widen permissions or approve an action on your behalf.</p></div>
        <div className="trust__item"><h3>Know where your data goes</h3><p>Memory and audit stay in local SQLite. Cloud models and services receive the data needed for the connections you enable.</p></div>
      </div>
    </section>

    <section className="reading-section" id="architecture" aria-labelledby="architecture-heading">
      <h2 id="architecture-heading">One core. Your choice of tools.</h2>
      <p className="reading-intro">A native Rust service holds permissions, memory and history. Models, voice providers and tool connections can be replaced.</p>
      <details className="disclosure technical-detail"><summary>See the architecture</summary><Architecture /></details>
      <p className="more">
        <a href={ARCHITECTURE_URL} target="_blank" rel="noreferrer">Architecture overview</a>
        <a href={ADR_URL} target="_blank" rel="noreferrer">Decision records</a>
      </p>
    </section>
  </Section>;
}
