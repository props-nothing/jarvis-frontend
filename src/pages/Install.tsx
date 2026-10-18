import Section from "../components/Section";
import InstallBox from "../components/InstallBox";
import { platforms } from "../content";
import { PLATFORMS_URL, QUICK_START_URL } from "../config";

const commands: [string, string][] = [
  ["jarvis", "First run: set up, start and open the console"],
  ["jarvis ask <task>", "Give it a job from the terminal"],
  ["jarvis hud", "Open the console in your browser"],
  ["jarvis doctor --live", "Check the model, the key and your folders"],
  ["jarvis approvals list", "See what is waiting for your yes or no"],
  ["jarvis cancel", "The kill switch for running work"],
  ["jarvis keys set voice --from-env ELEVENLABS_API_KEY", "Add a natural voice"],
  ["jarvis mcp list", "Abilities and where each one stands"],
  ["jarvis stop", "Stop the manually started daemon before installing its service"],
  ["jarvis service install", "Install per-user startup; service behavior depends on the OS"],
  ["jarvis eval run evals/basics.toml", "Measure a change to a prompt, tool or model"],
];

export default function Install() {
  return <Section pageHeading id="install" title="Install JARVIS."
    lede="Run one command. Then choose your model and open the console.">
      <InstallBox compact />
      <ol className="steps">
        <li className="step">
          <div>
            <h2>Open a new terminal. Run JARVIS.</h2>
            <pre className="code">
              <span className="install__prompt">$</span> jarvis
            </pre>
            <p>Setup asks for your model, an ElevenLabs API key and the folders JARVIS can use. It then opens the console. Later runs skip setup.</p>
          </div>
        </li>
        <li className="step">
          <div>
            <h2>Give it something to do.</h2>
            <p>Ask in the console, or send a task from your terminal.</p>
            <pre className="code">
              <span className="install__prompt">$</span> jarvis ask summarise this folder and list open questions
            </pre>
          </div>
        </li>
      </ol>

      <section className="install-help" aria-labelledby="install-help-heading">
      <h2 id="install-help-heading">Help & options</h2>
      <details className="disclosure" id="troubleshooting"><summary>Check your setup</summary><p>Run <code>jarvis doctor --live</code> to check your model connection, key and folders.</p><p><a href={QUICK_START_URL} target="_blank" rel="noreferrer">Read the setup guide</a></p></details>
      <details className="disclosure" id="startup"><summary>Start JARVIS at login</summary><p>Run <code>jarvis stop</code>, then <code>jarvis service install</code>. Startup is optional; service handoff still needs broader platform verification.</p></details>
      <details className="disclosure" id="platforms"><summary>Platform support</summary><div className="platforms">
        {platforms.map((p) => (
          <div key={p.os} className="platform">
            <strong>{p.os}</strong>
            <span className={`status status--${p.level}`}>{p.state}</span>
            <small>{p.service}</small>
          </div>
        ))}
        <p className="platforms__note">Windows and Ubuntu 24.04 have recorded end-to-end runs. Other Linux distributions, architectures and macOS still need clean-machine verification; CI alone is not that proof. <a href={PLATFORMS_URL} target="_blank" rel="noreferrer">Platform details</a></p>
      </div></details>
      <details className="disclosure" id="commands">
        <summary>Handy commands</summary>
        <div className="cmds__grid">
          {commands.map(([c, d]) => (
            <div key={c} className="cmd">
              <code>{c}</code>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </details>

      <details className="disclosure" id="server"><summary>Run on a headless server</summary><div className="server">
        <div>
          <p>
            JARVIS only listens on <code>127.0.0.1</code> on purpose. Reach the console through an SSH tunnel and never
            forward the port to the internet.
          </p>
        </div>
        <pre className="code">
          <span className="install__prompt">$</span> ssh -L 8765:127.0.0.1:8765 me@your-server{"\n"}
          <span className="install__prompt">$</span> jarvis hud --print-url   <span className="dim"># on the server</span>
        </pre>
      </div>

      </details>
      </section>
    </Section>;
}
