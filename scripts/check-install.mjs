// Static checks for the installer scripts served from public/. Fails closed: any problem exits non-zero.
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (m) => errors.push(m);

const sh = readFileSync(join(root, "public", "install.sh"), "utf8");
const ps1 = readFileSync(join(root, "public", "install.ps1"), "utf8");

if (sh.includes("\r")) fail("install.sh must use LF line endings");
if (!sh.startsWith("#!/usr/bin/env bash\n")) fail("install.sh needs a bash shebang");
if (!/^set -euo pipefail$/m.test(sh)) fail("install.sh must set -euo pipefail");
if (!/^\$ErrorActionPreference = 'Stop'$/m.test(ps1)) fail("install.ps1 must stop on errors");

for (const [name, text] of [["install.sh", sh], ["install.ps1", ps1]]) {
  if (!text.includes("github.com/props-nothing/jarvisv2.git")) fail(`${name} must clone the official repository`);
  if (!text.includes("cargo") || !text.includes("jarvis-cli")) fail(`${name} must build the jarvis-cli package`);
  if (!text.includes("install")) fail(`${name} must run 'jarvis install'`);
  const code = text.replace(/^\s*#.*$/gm, "").split("\n").filter((l) => !/^\s*(elif|if)?.*\becho "sudo /.test(l)).join("\n");
  if (/\b(sudo|Invoke-Expression|iex)\b/.test(code)) fail(`${name} must not need elevation or eval remote code`);
}

const bash = spawnSync("bash", ["-n", join(root, "public", "install.sh")], { encoding: "utf8" });
if (bash.status === 0) console.log("bash -n install.sh: ok");
else if (bash.error || /WSL|execvpe/i.test(`${bash.stderr}${bash.stdout}`)) console.log("bash unavailable; skipped bash -n");
else fail(`bash -n install.sh: ${bash.stderr}`);

const ps = spawnSync(
  process.platform === "win32" ? "powershell" : "pwsh",
  [
    "-NoProfile",
    "-Command",
    "$e=$null;[void][System.Management.Automation.Language.Parser]::ParseFile($env:JARVIS_CHECK_FILE,[ref]$null,[ref]$e);if($e){$e|%{$_.Message};exit 1}",
  ],
  { encoding: "utf8", env: { ...process.env, JARVIS_CHECK_FILE: join(root, "public", "install.ps1") } },
);
if (ps.status === 0) console.log("PowerShell parse install.ps1: ok");
else if (ps.error) console.log("PowerShell unavailable; skipped parse");
else fail(`install.ps1 parse: ${ps.stdout}${ps.stderr}`);

// When this folder sits inside the main repository, confirm the CLI still has the flags we use.
const cli = join(root, "..", "apps", "jarvis-cli", "src", "install.rs");
if (existsSync(cli)) {
  const rs = readFileSync(cli, "utf8");
  if (!rs.includes('"--service"')) fail("jarvis install no longer accepts --service");
  console.log("CLI flags cross-checked against apps/jarvis-cli/src/install.rs");
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("install scripts: ok");
