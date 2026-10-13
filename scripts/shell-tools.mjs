import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

export function selectInterpreter(candidates, probe, run = spawnSync) {
  for (const command of [...new Set(candidates.filter(Boolean))]) {
    const result = run(command, probe, { encoding: "utf8", timeout: 10000, windowsHide: true });
    if (!result.error && result.status === 0) return command;
  }
  throw new Error(`No working shell found (${candidates.filter(Boolean).join(", ")}). Install it or set the explicit shell override.`);
}

export function findBash(env = process.env, platform = process.platform, run = spawnSync) {
  if (env.JARVIS_BASH) return selectInterpreter([env.JARVIS_BASH], ["--version"], run);
  const candidates = [];
  if (platform === "win32") {
    for (const base of [env.ProgramFiles, env["ProgramFiles(x86)"], env.LOCALAPPDATA && join(env.LOCALAPPDATA, "Programs")]) {
      if (base) candidates.push(join(base, "Git", "bin", "bash.exe"));
    }
    const git = run("where.exe", ["git"], { encoding: "utf8", windowsHide: true, timeout: 10000 });
    for (const path of (git.stdout ?? "").trim().split(/\r?\n/).filter(Boolean)) {
      candidates.push(resolve(dirname(path), "..", "bin", "bash.exe"));
    }
  }
  candidates.push("bash");
  // A WSL launcher with no installed distro does not pass this probe.
  return selectInterpreter(candidates, ["-c", "exit 0"], run);
}

export function findPowerShell(env = process.env, platform = process.platform, run = spawnSync) {
  const candidates = env.JARVIS_POWERSHELL
    ? [env.JARVIS_POWERSHELL]
    : platform === "win32"
      ? [env.SystemRoot && join(env.SystemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe"), "pwsh", "powershell"]
      : ["pwsh"];
  return selectInterpreter(candidates, ["-NoProfile", "-NonInteractive", "-Command", "exit 0"], run);
}

export function syntaxChecks(root, env = process.env) {
  const publicDir = join(root, "public");
  if (!existsSync(publicDir)) throw new Error(`Installer directory missing: ${publicDir}`);
  return { bash: findBash(env), powershell: findPowerShell(env) };
}
