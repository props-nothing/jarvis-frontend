import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Check, Copy } from "lucide-react";
import { REPO_GIT_URL, REPO_URL, siteOrigin } from "../config";
import { installCommands, isWindows } from "../installCommands";
import type { InstallTab } from "../installCommands";

function windowsHost(): boolean {
  return typeof navigator !== "undefined" && isWindows(navigator.userAgent);
}

export function useInstallCommands() {
  return useMemo(() => installCommands(siteOrigin(), REPO_GIT_URL, windowsHost()), []);
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const focused = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    area.setAttribute("aria-hidden", "true");
    document.body.appendChild(area);
    try {
      area.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      area.remove();
      focused?.focus({ preventScroll: true });
    }
  }
}

const tabs: { id: InstallTab; label: string }[] = [
  { id: "unix", label: "macOS / Linux" },
  { id: "windows", label: "Windows" },
  { id: "source", label: "From source" },
];

export default function InstallBox({ compact = false }: { compact?: boolean }) {
  const commands = useInstallCommands();
  const id = useId();
  const [tab, setTab] = useState<InstallTab>(() => windowsHost() ? "windows" : "unix");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  const request = useRef(0);

  useEffect(() => () => {
    window.clearTimeout(timer.current);
    request.current += 1;
  }, []);

  const selectTab = (next: InstallTab) => {
    window.clearTimeout(timer.current);
    request.current += 1;
    setCopyState("idle");
    setTab(next);
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % tabs.length; break;
      case "ArrowLeft": next = (index + tabs.length - 1) % tabs.length; break;
      case "Home": next = 0; break;
      case "End": next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectTab(tabs[next].id);
    (event.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
  };

  const copy = async () => {
    window.clearTimeout(timer.current);
    const current = ++request.current;
    const ok = await copyText(commands[tab]);
    if (request.current !== current) return;
    setCopyState(ok ? "copied" : "failed");
    if (ok) timer.current = window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const prompt = tab === "windows" || (tab === "source" && windowsHost()) ? "PS>" : "$";

  return (
    <div className={`install ${compact ? "install--compact" : ""}`}>
      <div className="install__tabs" role="tablist" aria-label="Install method">
        {tabs.map((t, index) => (
          <button
            key={t.id}
            id={`${id}-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`${id}-panel`}
            tabIndex={tab === t.id ? 0 : -1}
            className={`install__tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => selectTab(t.id)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="install__body" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`} tabIndex={0}>
        <pre className="install__code" aria-label="Install command">
          {commands[tab].split("\n").map((line, i) => (
            <span key={i} className="install__line">
              <span className="install__prompt">{prompt}</span> {line}
            </span>
          ))}
        </pre>
        <button type="button" className="install__copy" onClick={copy} aria-label="Copy install command" title="Copy install command">
          {copyState === "copied" ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
        </button>
      </div>
      <p className="install__feedback" role="status">
        {copyState === "copied" ? "Install command copied." : copyState === "failed" ? "Clipboard unavailable. Select and copy the command above." : ""}
      </p>
      <p className="install__note">
        Builds from source (needs Git, Rust and C/C++ build tools). Then run <code>jarvis</code>.{" "}
        <a href={tab === "source" ? REPO_URL : `${siteOrigin()}/install.${tab === "windows" ? "ps1" : "sh"}`} target="_blank" rel="noreferrer">
          {tab === "source" ? "View source" : "Inspect installer"}
        </a>
      </p>
    </div>
  );
}
