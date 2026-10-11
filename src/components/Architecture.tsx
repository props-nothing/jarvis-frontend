type Node = { name: string; planned?: boolean };

const clients: Node[] = [
  { name: "CLI" },
  { name: "Browser console" },
  { name: "Telegram" },
  { name: "MCP clients" },
  { name: "Desktop app", planned: true },
  { name: "Phone calls", planned: true },
];

const core = [
  "Gateway · auth · HTTP / SSE",
  "Policy · approvals",
  "Tool gateway",
  "Memory · context",
  "Schedules · triggers",
  "Audit · usage",
];

const adapters: Node[] = [
  { name: "Models" },
  { name: "MCP servers" },
  { name: "Gmail · Calendar" },
  { name: "Sandbox" },
  { name: "Agent runtimes (ACP)", planned: true },
];

function Chip({ node }: { node: Node }) {
  return <span className={`chip ${node.planned ? "chip--planned" : ""}`}>{node.name}</span>;
}

export default function Architecture() {
  return (
    <div className="arch" aria-label="Architecture overview">
      <div className="arch__layer">
        <h4>Clients</h4>
        <div className="arch__chips">
          {clients.map((c) => (
            <Chip key={c.name} node={c} />
          ))}
        </div>
      </div>
      <div className="arch__wire" aria-hidden />
      <div className="arch__layer arch__layer--core">
        <h4>
          jarvisd <small>the trusted control plane (Rust)</small>
        </h4>
        <div className="arch__grid">
          {core.map((c) => (
            <div key={c} className="arch__cell">
              {c}
            </div>
          ))}
        </div>
      </div>
      <div className="arch__split">
        <div className="arch__wire" aria-hidden />
        <div className="arch__wire" aria-hidden />
      </div>
      <div className="arch__row">
        <div className="arch__layer">
          <h4>Replaceable adapters</h4>
          <div className="arch__chips">
            {adapters.map((c) => (
              <Chip key={c.name} node={c} />
            ))}
          </div>
        </div>
        <div className="arch__layer">
          <h4>Your data, on your machine</h4>
          <div className="arch__chips">
            <Chip node={{ name: "SQLite" }} />
            <Chip node={{ name: "Private key files" }} />
            <Chip node={{ name: "PostgreSQL + pgvector (server)", planned: true }} />
          </div>
        </div>
      </div>
      <p className="arch__legend">
        <span className="chip">Built</span> <span className="chip chip--planned">Planned</span>
      </p>
    </div>
  );
}
