export type InstallTab = "unix" | "windows" | "source";

export function isWindows(userAgent: string): boolean {
  return /Windows/i.test(userAgent);
}

export function installCommands(origin: string, repo: string, windows: boolean): Record<InstallTab, string> {
  return {
    unix: `curl -fsSL ${origin}/install.sh | bash`,
    windows: `irm ${origin}/install.ps1 | iex`,
    source: [
      `git clone ${repo}`,
      "cd jarvis-core",
      "cargo build --release -p jarvis-cli",
      windows ? ".\\target\\release\\jarvis.exe install" : "./target/release/jarvis install",
    ].join("\n"),
  };
}
