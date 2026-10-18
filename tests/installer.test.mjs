import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { findBash, findPowerShell, selectInterpreter } from "../scripts/shell-tools.mjs";
import { validateInstallerText } from "../scripts/installer-contract.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const sh = readFileSync(new URL("../public/install.sh", import.meta.url), "utf8");
const ps = readFileSync(new URL("../public/install.ps1", import.meta.url), "utf8");
const env = { ...process.env };
// PowerShell 7's inherited module path can hide Windows PowerShell 5.1 modules.
delete env.PSModulePath;
for (const key of ["JARVIS_REPO", "JARVIS_REF", "JARVIS_SRC", "JARVIS_SERVICE", "JARVIS_INSTALL_RUST"]) delete env[key];

test("signed Bash bootstrap: real archives, failure ordering and stdin entry", () => {
  const result = spawnSync(findBash(), ["tests/installer-fixtures.sh"], { cwd: root, env, encoding: "utf8", timeout: 120000, windowsHide: true });
  assert.equal(result.status, 0, `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
});

test("signed Windows bootstrap: real ZIPs, failure ordering and Invoke-Expression entry", { skip: process.platform !== "win32" }, () => {
  const result = spawnSync(findPowerShell(), ["-NoProfile", "-NonInteractive", "-File", "tests/installer-fixtures.ps1"], { cwd: root, env, encoding: "utf8", timeout: 120000, windowsHide: true });
  assert.equal(result.status, 0, `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
});

test("both installers pin a signed release and retain the separate setup handoff", () => {
  assert.deepEqual(validateInstallerText(sh, ps), []);
  assert.match(validateInstallerText(sh.replaceAll("\n", "\r\n"), ps).join("\n"), /LF line endings/);
  assert.match(validateInstallerText(sh.replaceAll("--certificate-identity", "--wrong-option"), ps).join("\n"), /certificate-identity/);
  assert.match(validateInstallerText(sh + "\ngit clone untrusted", ps).join("\n"), /signed-only/);
});

test("shell discovery refuses absent or broken interpreters", () => {
  assert.throws(() => selectInterpreter(["missing"], [], () => ({ status: 1 })), /No working shell/);
  assert.equal(selectInterpreter(["broken", "working"], [], (cmd) => ({ status: cmd === "working" ? 0 : 1 })), "working");
});
