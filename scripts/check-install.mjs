import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { syntaxChecks } from "./shell-tools.mjs";
import { validateInstallerText } from "./installer-contract.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sh = readFileSync(join(root, "public", "install.sh"), "utf8");
const ps1 = readFileSync(join(root, "public", "install.ps1"), "utf8");
const errors = validateInstallerText(sh, ps1);
for (const [name, text] of [["install.sh", sh], ["install.ps1", ps1]]) {
  if (!text.includes("Setup has not run") || !text.includes("--voice-key-file ABSOLUTE_VOICE_KEY_FILE") || !text.includes("doctor --live")) {
    errors.push(`${name} must print the separate, key-safe setup handoff`);
  }
}

try {
  const shells = syntaxChecks(root);
  const bash = spawnSync(shells.bash, ["-n"], { input: sh, encoding: "utf8", timeout: 10000, windowsHide: true });
  if (bash.error || bash.status !== 0) errors.push(`install.sh syntax: ${bash.error?.message ?? bash.stderr}`);
  else console.log(`install.sh syntax: ok (${shells.bash})`);

  const ps = spawnSync(shells.powershell, ["-NoProfile", "-NonInteractive", "-Command",
    "$tokens=$null;$errors=$null;[void][System.Management.Automation.Language.Parser]::ParseFile($env:JARVIS_CHECK_FILE,[ref]$tokens,[ref]$errors);if($errors){$errors|ForEach-Object{$_.Message};exit 1}",
  ], { encoding: "utf8", timeout: 15000, windowsHide: true,
    env: { ...process.env, JARVIS_CHECK_FILE: join(root, "public", "install.ps1") } });
  if (ps.error || ps.status !== 0) errors.push(`install.ps1 syntax: ${ps.error?.message ?? `${ps.stdout}${ps.stderr}`}`);
  else console.log(`install.ps1 syntax: ok (${shells.powershell})`);
} catch (error) {
  errors.push(error.message);
}

const cli = join(root, "..", "apps", "jarvis-cli", "src", "install.rs");
if (existsSync(cli) && !readFileSync(cli, "utf8").includes('"--service"')) errors.push("jarvis install no longer accepts --service");

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Installer checks passed; neither script was executed.");
}
