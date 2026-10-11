import { useEffect, useState } from "react";
import Orb from "./components/Orb";
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

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <a className="nav__brand" href="#top" aria-label="JARVIS home">
        <span className="nav__mark" aria-hidden />
        JARVIS
      </a>
      <nav className="nav__links" aria-label="Sections">
        <a href="#console">Console</a>
        <a href="#capabilities">Capabilities</a>
        <a href="#trust">Trust</a>
        <a href="#architecture">Architecture</a>
        <a href="#install">Install</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a className="btn btn--ghost btn--sm" href={REPO_URL} target="_blank" rel="noreferrer">
        GitHub ↗
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <a className="badge" href={ROADMAP_URL} target="_blank" rel="noreferrer">
          <span className="badge__dot" /> Working-assistant stage · open on GitHub <span aria-hidden>→</span>
        </a>
        <h1>
          The AI that works <span className="grad">for you</span>.
          <br />
          On your machine.
        </h1>
        <p className="hero__lede">
          JARVIS is a personal AI operating system: one program that reasons, remembers, uses your tools and keeps working
          while you are away. <strong>Models suggest. Policy decides. You approve.</strong>
        </p>
        <InstallBox />
        <div className="hero__cta">
          <a className="btn btn--solid" href="#install">
            Get started
          </a>
          <a className="btn btn--ghost" href={QUICK_START_URL} target="_blank" rel="noreferrer">
            Read the quick start
          </a>
        </div>
      </div>
      <div className="hero__visual">
        <Orb />
        <div className="hud hud--tl">127.0.0.1:8765</div>
        <div className="hud hud--tr">LOCAL-FIRST</div>
        <div className="hud hud--bl">POLICY: ENFORCED</div>
        <div className="hud hud--br">AUDIT: ON</div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    ["1", "program to install"],
    ["127.0.0.1", "listens locally by default"],
    ["SQLite", "no infrastructure fleet"],
    ["190+", "architecture decision records"],
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
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));

    const glow = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    };
    document.addEventListener("pointermove", glow);
    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", glow);
    };
  }, []);

  return (
    <>
      <div className="bg-grid" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Stats />

        <Section
          id="demo"
          eyebrow="See it work"
          title={
            <>
              Ask in plain words. <span className="grad">Watch every step.</span>
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
          id="console"
          eyebrow="The real thing"
          title={
            <>
              This is the <span className="grad">actual console</span>.
            </>
          }
          lede="Not a mock-up. A screenshot of jarvis hud, linked to a daemon on a fresh Ubuntu 24.04 server, answering through a 1.5-billion-parameter model that runs locally on a single CPU core."
        >
          <figure className="shot" data-reveal>
            <div className="shot__bar">
              <span className="dot dot--r" />
              <span className="dot dot--y" />
              <span className="dot dot--g" />
              <span className="term__title">127.0.0.1:8765 — through an SSH tunnel</span>
            </div>
            <img
              src="/console.jpg"
              width={1440}
              height={900}
              loading="lazy"
              alt="The JARVIS console: a wireframe face on the left and a chat on the right where the user asks what JARVIS is and it answers."
            />
            <figcaption>
              The face reacts while JARVIS thinks, speaks and listens. Beside it, a live feed of the sources it reads and the tools it calls, and the
              approvals waiting for you. Model: qwen2.5:1.5b through Ollama, CPU only, so the reply took about 25 seconds; a larger model or a GPU is the usual setup.
            </figcaption>
          </figure>
        </Section>

        <Section
          id="capabilities"
          eyebrow="What it does today"
          title="A real assistant, not a chat box."
          lede="Everything on this page is built and runs end to end against a local or hosted model. What is not built yet is on the roadmap."
        >
          <div className="cards">
            {features.map((f, i) => (
              <article key={f.title} className="card" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                <div className="card__top">
                  <span className="card__icon" aria-hidden>
                    {f.icon}
                  </span>
                  <span className="pill">{f.tag}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="trust"
          eyebrow="Trust by design"
          title={
            <>
              The model can <span className="grad">ask</span>. Only policy can <span className="grad">allow</span>.
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
              From zero to <span className="grad">talking</span> in three steps.
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
              Honest status: only Windows has been used end to end by a person so far. Linux and macOS are built and tested
              in CI; treat your first run there as a test.{" "}
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
            Ready to meet <span className="grad">your</span> JARVIS?
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
