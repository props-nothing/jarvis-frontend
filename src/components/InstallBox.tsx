import { useMemo, useState } from "react";
import { REPO_GIT_URL, siteOrigin } from "../config";

type TabId = "unix" | "windows" | "source";

function detectTab(): TabId {
  if (typeof navigator === "undefined") return "unix";
  return /Windows/i.test(navigator.userAgent) ? "windows" : "unix";
}

export function useInstallCommands() {
  return useMemo(() => {
    const origin = siteOrigin();
    return {
      unix: `curl -fsSL ${origin}/install.sh | bash`,
      windows: `irm ${origin}/install.ps1 | iex`,
      source: [
        `git clone ${REPO_GIT_URL}`,
        "cd jarvisv2",
        "cargo build --release -p jarvis-cli",
        "./target/release/jarvis install --service",
      ].join("\n"),
    } satisfies Record<TabId, string>;
  }, []);
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

const tabs: { id: TabId; label: string }[] = [
  { id: "unix", label: "macOS / Linux" },
  { id: "windows", label: "Windows" },
  { id: "source", label: "From source" },
];

export default function InstallBox({ compact = false }: { compact?: boolean }) {
  const commands = useInstallCommands();
  const [tab, setTab] = useState<TabId>(detectTab);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (await copyText(commands[tab])) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const prompt = tab === "windows" ? "PS>" : "$";

  return (
    <div className={`install ${compact ? "install--compact" : ""}`}>
      <div className="install__tabs" role="tablist" aria-label="Install method">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`install__tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="install__body">
        <pre className="install__code" aria-label="Install command">
          {commands[tab].split("\n").map((line, i) => (
            <span key={i} className="install__line">
              <span className="install__prompt">{prompt}</span> {line}
            </span>
          ))}
        </pre>
        <button className="install__copy" onClick={copy} aria-live="polite">
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <p className="install__note">
        Builds one program from source for now (needs <code>git</code> and Rust). Prebuilt signed downloads arrive with the
        first public release. Then run <code>jarvis</code>.
      </p>
    </div>
  );
}
