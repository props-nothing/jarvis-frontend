import { lazy, Suspense, useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, Brain, CalendarDays, Code2, FileText, Globe, Mic, Pause, Play, Plug, Send, ShieldCheck, TerminalSquare } from "lucide-react";
import Nav from "./components/Nav";
import InstallBox from "./components/InstallBox";
import Terminal from "./components/Terminal";
import ApprovalDemo from "./components/ApprovalDemo";
import Pipeline from "./components/Pipeline";
import Architecture from "./components/Architecture";
import { faqs, features, platforms, roadmap } from "./content";
import {
  ADR_URL,
  ARCHITECTURE_URL,
  DOCS_URL,
  PLATFORMS_URL,
  QUICK_START_URL,
  REPO_URL,
  ROADMAP_URL,
  SECURITY_URL,
} from "./config";

const JarvisMask = lazy(() => import("./components/JarvisMask"));
const featureIcons = [FileText, Globe, CalendarDays, TerminalSquare, Code2, Mic, Brain, Plug, Send];

const commands: [string, string][] = [
  ["jarvis", "First run: set up, start and open the console"],
  ["jarvis ask <task>", "Give it a job from the terminal"],
  ["jarvis hud", "Open the console in your browser"],
  ["jarvis doctor --live", "Check the model, the key and your folders"],
  ["jarvis approvals list", "See what is waiting for your yes or no"],
  ["jarvis cancel", "The kill switch for running work"],
  ["jarvis keys set voice --from-env ELEVENLABS_API_KEY", "Add a natural voice"],
  ["jarvis mcp list", "Abilities and where each one stands"],
  ["jarvis stop && jarvis service install", "Start at login and restart if it stops"],
  ["jarvis eval run evals/basics.toml", "Measure a change to a prompt, tool or model"],
];

function Hero() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="hero" id="top">
      <div className="hero__visual">
        <div className="hero__mask">
          <Suspense fallback={<div className="mask__loading" aria-hidden /> }>
            <JarvisMask paused={paused} />
          </Suspense>
        </div>
        <div className="hud hud--tl"><ShieldCheck size={16} aria-hidden /> Owner-controlled</div>
        <div className="hud hud--tr"><span className="badge__dot" /> Local-first</div>
        <div className="hero__signal" aria-hidden>
          {Array.from({ length: 31 }, (_, index) => <span key={index} style={{ height: `${4 + Math.sin(index * 1.8) ** 2 * 15}px` }} />)}
        </div>
        <button type="button" className="icon-button mask__pause" aria-label={paused ? "Resume face animation" : "Pause face animation"}
          title={paused ? "Resume face animation" : "Pause face animation"} aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
        </button>
      </div>
      <div className="hero__copy">
        <h1 translate="no">JARVIS<span className="hero__period">.</span></h1>
        <p className="hero__tagline">Your own intelligence. Your rules.</p>
        <p className="hero__lede">
          An assistant that remembers, takes action, and keeps working.<br className="desktop-break" />
          On your machine. With your models. Always under your control.
        </p>
        <div className="hero__cta">
          <a className="btn btn--solid" href="#install">
            Install JARVIS <ArrowDown size={17} aria-hidden />
          </a>
          <a className="btn btn--ghost" href={QUICK_START_URL} target="_blank" rel="noreferrer">
            <BookOpen size={17} aria-hidden /> Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    ["Your machine", "Local state. No hosted control plane."],
    ["Your model", "Local or hosted. Switch at any time."],
    ["Your memory", "Inspect it. Correct it. Forget it."],
    ["Your decision", "Models suggest. You stay in charge."],
  ];
  return (
    <section className="stats" data-reveal>
      {items.map(([big, small]) => (
        <div key={small} className="stat">
          <strong>{big}</strong>
          <span>{small}</span>
        </div>
      ))}
    </section>
  );
}

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="section" id={id}>
      <div className="section__head" data-reveal>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="bg-grid" aria-hidden />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <section className="quick-install" aria-label="Quick install">
          <InstallBox />
          <a className="hero__source" href={REPO_URL} target="_blank" rel="noreferrer">Built in Rust. Developed in the open. <ArrowRight size={14} aria-hidden /></a>
        </section>
        <Stats />

        <Section
          id="demo"
          eyebrow="See it work"
          title={
            <>
              Less chatting. More doing.
            </>
          }
          lede="Everything JARVIS reads and every tool it calls shows up live in the console. Anything that matters waits for your yes or no."
        >
          <div className="split" data-reveal>
            <Terminal />
            <ApprovalDemo />
          </div>
        </Section>

        <Section
          id="capabilities"
          eyebrow="What it does today"
          title="A real assistant, not a chat box."
          lede="Put your files, research, calendar and projects to work. Choose what JARVIS can access, and approve the actions that matter."
        >
          <div className="cards">
            {features.map((f, index) => {
              const Icon = featureIcons[index];
              return <article key={f.title} className="card">
                <div className="card__top">
                  <span className="card__icon" aria-hidden>
                    <Icon size={24} strokeWidth={1.5} />
                  </span>
                  <span className="pill">{f.tag}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>;
            })}
          </div>
        </Section>

        <Section
          id="trust"
          eyebrow="Trust by design"
          title={
            <>
              Powerful by default.<br /> Accountable by design.
            </>
          }
          lede="An assistant you can leave alone is one you can audit. Permissions, approvals, memory and workflow state belong to JARVIS, never to a model."
        >
          <div data-reveal>
            <Pipeline />
          </div>
          <div className="trust" data-reveal>
            <div className="trust__item">
              <h3>Approvals stay light</h3>
              <p>One click, one command or one spoken word from any surface you hold the credential for. Policy decides what is asked, so it asks less, not more.</p>
            </div>
            <div className="trust__item">
              <h3>Kill switch</h3>
              <p>
                <code>jarvis cancel</code> stops running work. A stop that would interrupt tasks is refused unless you force it.
              </p>
            </div>
            <div className="trust__item">
              <h3>Untrusted by default</h3>
              <p>Web pages and tool output are information, never instructions. Tool programs start with a small environment and never see your keys.</p>
            </div>
            <div className="trust__item">
              <h3>Local keys, local state</h3>
              <p>Keys live in private files, never printed or sent to the browser. State is SQLite on your machine. The console only listens on 127.0.0.1.</p>
            </div>
          </div>
        </Section>

        <Section
          id="architecture"
          eyebrow="Architecture"
          title="Rust owns the authority. Everything else is replaceable."
          lede="Models, agent frameworks, voice providers and tools are adapters behind explicit ports. Swap one and nothing you own is lost."
        >
          <div data-reveal>
            <Architecture />
          </div>
          <p className="more" data-reveal>
            <a href={ARCHITECTURE_URL} target="_blank" rel="noreferrer">
              Read the architecture overview →
            </a>{" "}
            <a href={ADR_URL} target="_blank" rel="noreferrer">
              Browse the decision records →
            </a>
          </p>
        </Section>

        <Section
          id="install"
          eyebrow="Install"
          title={
            <>
              Make it yours.
            </>
          }
          lede="You need a model: Ollama on this machine is the easiest, or any OpenAI-compatible key. Docker (code sandbox) and Node.js (built-in browser) are optional."
        >
          <ol className="steps">
            <li className="step" data-reveal>
              <span className="step__n">1</span>
              <div>
                <h3>Install</h3>
                <InstallBox compact />
              </div>
            </li>
            <li className="step" data-reveal>
              <span className="step__n">2</span>
              <div>
                <h3>Run it</h3>
                <pre className="code">
                  <span className="install__prompt">$</span> jarvis
                </pre>
                <p>
                  It asks which model and which folder, starts in the background and opens the console in your browser,
                  already signed in. Later runs skip the questions.
                </p>
              </div>
            </li>
            <li className="step" data-reveal>
              <span className="step__n">3</span>
              <div>
                <h3>Give it a job</h3>
                <pre className="code">
                  <span className="install__prompt">$</span> jarvis ask summarise this folder and list open questions
                </pre>
                <p>
                  Or talk to it in the console. To have it start at login, run <code>jarvis stop</code> and then{" "}
                  <code>jarvis service install</code>.
                </p>
              </div>
            </li>
          </ol>

          <div className="cmds" data-reveal>
            <h3>Handy commands</h3>
            <div className="cmds__grid">
              {commands.map(([c, d]) => (
                <div key={c} className="cmd">
                  <code>{c}</code>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="server" data-reveal>
            <div>
              <h3>On a headless server?</h3>
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

          <div className="platforms" data-reveal>
            {platforms.map((p) => (
              <div key={p.os} className="platform">
                <strong>{p.os}</strong>
                <span className={`status status--${p.level}`}>{p.state}</span>
                <small>{p.service}</small>
              </div>
            ))}
            <p className="platforms__note">
              Windows and Ubuntu 24.04 have recorded end-to-end runs. Other Linux distributions, architectures and macOS
              still need clean-machine verification; CI alone is not that proof.{" "}
              <a href={PLATFORMS_URL} target="_blank" rel="noreferrer">
                Platform details →
              </a>
            </p>
          </div>
        </Section>

        <Section
          id="roadmap"
          eyebrow="Roadmap"
          title="Built in the open, in order of risk."
          lede="Each phase leaves a runnable slice. Here is where things stand."
        >
          <div className="road">
            {roadmap.map((col) => (
              <div key={col.status} className={`road__col road__col--${col.status}`} data-reveal>
                <h3>
                  <span className="road__dot" /> {col.label}
                </h3>
                <ul>
                  {col.items.map((it) => (
                    <li key={it.name}>
                      <strong>{it.name}</strong>
                      <span>{it.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="more" data-reveal>
            <a href={ROADMAP_URL} target="_blank" rel="noreferrer">
              Full roadmap →
            </a>
          </p>
        </Section>

        <Section id="faq" eyebrow="FAQ" title="Straight answers.">
          <div className="faq" data-reveal>
            {faqs.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <section className="final" data-reveal>
          <h2>
            Your next assistant<br /> should answer to you.
          </h2>
          <InstallBox compact />
          <div className="hero__cta">
            <a className="btn btn--solid" href={REPO_URL} target="_blank" rel="noreferrer">
              Star on GitHub
            </a>
            <a className="btn btn--ghost" href={DOCS_URL} target="_blank" rel="noreferrer">
              Documentation
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>JARVIS</strong>
          <p>A local-first personal AI operating system. No licence has been chosen yet; distribution is paused until the owner decides.</p>
        </div>
        <nav aria-label="Footer">
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={DOCS_URL} target="_blank" rel="noreferrer">Docs</a>
          <a href={SECURITY_URL} target="_blank" rel="noreferrer">Security</a>
          <a href={ROADMAP_URL} target="_blank" rel="noreferrer">Roadmap</a>
        </nav>
      </footer>
    </>
  );
}
