import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { findBash, findPowerShell, selectInterpreter } from "../scripts/shell-tools.mjs";
import { validateInstallerText } from "../scripts/installer-contract.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bash = findBash();
const powershell = findPowerShell();
const sh = readFileSync(join(root, "public", "install.sh"), "utf8");
const ps1 = readFileSync(join(root, "public", "install.ps1"), "utf8");

function command(exe, args, options = {}) {
  const result = spawnSync(exe, args, { encoding: "utf8", timeout: 30000, windowsHide: true, ...options });
  assert.equal(result.status, 0, `${exe}: ${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim();
}

function fixture(t) {
  const base = mkdtempSync(join(root, ".installer-test-"));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const remote = join(base, "remote");
  const source = join(base, "checkout with spaces");
  const home = join(base, "home");
  mkdirSync(remote); mkdirSync(home);
  command("git", ["init", "-q", "-b", "main", remote]);
  const git = (...args) => command("git", ["-C", remote, ...args]);
  git("config", "user.email", "test@example.invalid");
  git("config", "user.name", "Installer test");
  writeFileSync(join(remote, ".gitignore"), "/target/\n");
  writeFileSync(join(remote, "source.txt"), "first\n");
  git("add", "."); git("commit", "-q", "-m", "first");
  const first = git("rev-parse", "HEAD");
  git("tag", "v-fixture");
  const repo = pathToFileURL(remote).href;
  const log = join(base, "effects.log");
  const env = { ...process.env, HOME: home, USERPROFILE: home, JARVIS_REPO: repo, JARVIS_SRC: source,
    JARVIS_REF: "main", JARVIS_SERVICE: "0", JARVIS_INSTALL_RUST: "0", JARVIS_TEST_LOG: log,
    JARVIS_TEST_BUILD_FAILURE: "0", JARVIS_TEST_INSTALL_FAILURE: "0", JARVIS_TEST_MISSING: "",
    JARVIS_TEST_OS: "Linux", JARVIS_TEST_DEVELOPER_TOOLS_FAILURE: "0", JARVIS_TEST_VS_DISCOVERY: "",
    "ProgramFiles(x86)": join(base, "Program Files (x86)") };
  return { base, source, remote, git, first, repo, log, env,
    checkout: () => command("git", ["clone", "-q", repo, source]),
    head: () => command("git", ["-C", source, "rev-parse", "HEAD"]),
    effects: () => existsSync(log) ? readFileSync(log, "utf8") : "" };
}

const bashHarness = String.raw`
if command -v cygpath >/dev/null 2>&1; then
  export JARVIS_SRC="$(cygpath -u "$JARVIS_SRC")" HOME="$(cygpath -u "$HOME")"
  export JARVIS_TEST_INSTALLER="$(cygpath -u "$JARVIS_TEST_INSTALLER")"
  export JARVIS_TEST_LOG="$(cygpath -u "$JARVIS_TEST_LOG")"
fi
uname() { printf '%s\n' "$JARVIS_TEST_OS"; }
cc() { :; }
rustup() { :; }
xcode-select() { [ "$JARVIS_TEST_DEVELOPER_TOOLS_FAILURE" != 1 ]; }
apt-get() { :; }
command() {
  if [ "$1" = -v ] && [ "$2" = "$JARVIS_TEST_MISSING" ]; then return 1; fi
  builtin command "$@"
}
cargo() {
  printf 'build %s\n' "$*" >> "$JARVIS_TEST_LOG"
  [ "$JARVIS_TEST_BUILD_FAILURE" = 1 ] && return 42
  mkdir -p target/release
  cat > target/release/jarvis <<'BIN'
#!/usr/bin/env bash
printf 'binary %s\n' "$*" >> "$JARVIS_TEST_LOG"
[ "$JARVIS_TEST_INSTALL_FAILURE" = 1 ] && exit 43
exit 0
BIN
  chmod +x target/release/jarvis
}
. "$JARVIS_TEST_INSTALLER"
`;

// A tiny native test executable records installer arguments; it never installs anything.
const nativeFixtureSource = `using System; using System.IO; public class InstallerFixture {
 public static int Main(string[] args) {
  if (args.Length > 0 && args[0] == "-latest") {
   if (Environment.GetEnvironmentVariable("JARVIS_TEST_VS_DISCOVERY") == "installed") Console.WriteLine("fixture C++ installation");
   return 0;
  }
  File.AppendAllText(Environment.GetEnvironmentVariable("JARVIS_TEST_LOG"), "binary " + string.Join(" ", args) + "\\n");
  return Environment.GetEnvironmentVariable("JARVIS_TEST_INSTALL_FAILURE") == "1" ? 43 : 0;
 }
}`;

function runInstaller(kind, f, overrides = {}) {
  const env = { ...f.env, ...overrides, JARVIS_TEST_INSTALLER: join(root, "public", kind === "bash" ? "install.sh" : "install.ps1") };
  if (kind === "bash") return spawnSync(bash, ["-s"], { input: bashHarness, cwd: f.base, env, encoding: "utf8", timeout: 30000 });
  const fixtureExe = join(f.base, "fixture.exe");
  const fixtureCs = join(f.base, "fixture.cs");
  if (!existsSync(fixtureExe)) {
    writeFileSync(fixtureCs, nativeFixtureSource);
    command(powershell, ["-NoProfile", "-NonInteractive", "-Command",
      "Add-Type -TypeDefinition ([IO.File]::ReadAllText($env:JARVIS_TEST_CS)) -OutputAssembly $env:JARVIS_TEST_EXE -OutputType ConsoleApplication"],
      { env: { ...env, JARVIS_TEST_CS: fixtureCs, JARVIS_TEST_EXE: fixtureExe } });
  }
  if (env.JARVIS_TEST_VS_DISCOVERY) {
    const vsDir = join(env["ProgramFiles(x86)"], "Microsoft Visual Studio", "Installer");
    mkdirSync(vsDir, { recursive: true });
    copyFileSync(fixtureExe, join(vsDir, "vswhere.exe"));
  }
  const harness = join(f.base, "run.ps1");
  writeFileSync(harness, `
$ErrorActionPreference = 'Stop'
function rustup { }
function cl { }
function Get-Command {
  param([string]$Name, [string]$ErrorAction)
  Write-Host "fixture lookup: name=$Name missing=$env:JARVIS_TEST_MISSING"
  if ($Name -eq $env:JARVIS_TEST_MISSING) { return }
  Microsoft.PowerShell.Core\\Get-Command -Name $Name -ErrorAction SilentlyContinue
}
function cargo {
  [IO.File]::AppendAllText($env:JARVIS_TEST_LOG, "build $($args -join ' ')
")
  if ($env:JARVIS_TEST_BUILD_FAILURE -eq '1') { $global:LASTEXITCODE = 42; return }
  New-Item -ItemType Directory -Path 'target\\release' -Force | Out-Null
  Copy-Item -LiteralPath $env:JARVIS_TEST_EXE -Destination 'target\\release\\jarvis.exe' -Force
  $global:LASTEXITCODE = 0
}
try { & $env:JARVIS_TEST_INSTALLER; exit 0 } catch { Write-Output $_.Exception.Message; exit 1 }
`);
  return spawnSync(powershell, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", harness], {
    cwd: f.base, env: { ...env, JARVIS_TEST_EXE: fixtureExe }, encoding: "utf8", timeout: 30000 });
}

for (const kind of ["bash", ...(process.platform === "win32" ? ["powershell"] : [])]) {
  test(`${kind}: fresh clone, rerun, branch update and pinned tag/commit`, (t) => {
    const f = fixture(t);
    let result = runInstaller(kind, f);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(f.head(), f.first);
    assert.match(f.effects(), /build build --release -p jarvis-cli --locked\r?\n/);
    assert.match(f.effects(), /binary install\r?\n/);
    assert.doesNotMatch(f.effects(), /--service/);
    assert.match(result.stdout, /Setup has not run/);
    assert.match(result.stdout, /jarvis init .*--voice-key-file ABSOLUTE_VOICE_KEY_FILE/);
    assert.match(result.stdout, /Only after setup succeeds: jarvis start/);
    assert.match(result.stdout, /jarvis doctor --live/);
    assert.doesNotMatch(f.effects(), /binary (?:init|start|doctor)/);
    writeFileSync(join(f.remote, "source.txt"), "second\n");
    f.git("add", "."); f.git("commit", "-q", "-m", "second");
    const second = f.git("rev-parse", "HEAD");
    result = runInstaller(kind, f);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(f.head(), second);
    for (const ref of ["v-fixture", second]) {
      result = runInstaller(kind, f, { JARVIS_REF: ref });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(f.head(), ref === "v-fixture" ? f.first : second);
    }
    assert.equal(runInstaller(kind, f, { JARVIS_SERVICE: "1" }).status, 0);
    assert.match(f.effects(), /binary install --service/);
  });

  for (const mode of ["unstaged", "staged", "untracked"]) {
    test(`${kind}: refuses ${mode} changes without modifying or building them`, (t) => {
      const f = fixture(t); f.checkout();
      const file = join(f.source, mode === "untracked" ? "notes.txt" : "source.txt");
      writeFileSync(file, "owner's work\n");
      if (mode === "staged") command("git", ["-C", f.source, "add", "source.txt"]);
      const result = runInstaller(kind, f);
      assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /local changes/);
      assert.equal(readFileSync(file, "utf8"), "owner's work\n");
      assert.equal(f.head(), f.first);
      assert.equal(f.effects(), "");
    });
  }

  test(`${kind}: refuses a foreign origin, nonrepository directory and missing ref`, (t) => {
    const f = fixture(t); f.checkout();
    command("git", ["-C", f.source, "remote", "set-url", "origin", "https://example.invalid/not-jarvis.git"]);
    let result = runInstaller(kind, f);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /origin does not match/);
    assert.equal(f.effects(), "");
    assert.equal(f.head(), f.first);
    const nonrepo = join(f.base, "personal files"); mkdirSync(nonrepo);
    const note = join(nonrepo, "notes.txt"); writeFileSync(note, "keep");
    result = runInstaller(kind, f, { JARVIS_SRC: nonrepo });
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(note, "utf8"), "keep");
    command("git", ["-C", f.source, "remote", "set-url", "origin", f.repo]);
    result = runInstaller(kind, f, { JARVIS_REF: "not-a-ref" });
    assert.notEqual(result.status, 0);
    assert.equal(f.effects(), "");
    assert.equal(f.head(), f.first);
  });

  test(`${kind}: accepts the renamed official origin without rewriting it`, (t) => {
    const f = fixture(t); f.checkout();
    const oldOrigin = "https://github.com/props-nothing/jarvisv2.git";
    const newOrigin = "https://github.com/props-nothing/jarvis-core.git";
    command("git", ["-C", f.source, "remote", "set-url", "origin", oldOrigin]);
    // Redirect only the new URL to the local fixture; fetching the old origin would fail offline.
    command("git", ["-C", f.source, "config", `url.${f.repo}.insteadOf`, newOrigin]);
    const result = runInstaller(kind, f, { JARVIS_REPO: newOrigin });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(command("git", ["-C", f.source, "config", "remote.origin.url"]), oldOrigin);
    assert.equal(f.head(), f.first);
    assert.match(f.effects(), /binary install/);
  });

  test(`${kind}: invalid options cannot activate a service or build`, (t) => {
    const f = fixture(t);
    for (const overrides of [{ JARVIS_SERVICE: "yes" }, { JARVIS_REF: "--all" }, ...(kind === "bash" ? [{ JARVIS_INSTALL_RUST: "yes" }] : [])]) {
      const result = runInstaller(kind, f, overrides);
      assert.notEqual(result.status, 0);
      assert.equal(f.effects(), "");
      assert.equal(existsSync(f.source), false);
    }
  });

  test(`${kind}: missing source prerequisites fail before clone or build`, (t) => {
    const f = fixture(t);
    for (const missing of ["cargo", "rustup", kind === "bash" ? "cc" : "cl"]) {
      const result = runInstaller(kind, f, { JARVIS_TEST_MISSING: missing });
      assert.notEqual(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stdout + result.stderr, missing === "cl" ? /Windows C\+\+ build tools/ : missing === "cc" ? /build-essential/ : /rustup/);
      assert.equal(f.effects(), "");
      assert.equal(existsSync(f.source), false);
    }
  });

  test(`${kind}: piped handoff neither exposes keys nor runs setup`, (t) => {
    const f = fixture(t);
    const result = runInstaller(kind, f, { ELEVENLABS_API_KEY: "fixture-private-voice-value" });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /requires your ElevenLabs API key/);
    assert.match(result.stdout, /--voice-key-file ABSOLUTE_VOICE_KEY_FILE/);
    assert.doesNotMatch(result.stdout + result.stderr, /fixture-private-voice-value/);
    assert.doesNotMatch(f.effects(), /binary (?:init|start|doctor)/);
  });

  test(`${kind}: build and install errors do not report success`, (t) => {
    const f = fixture(t);
    let result = runInstaller(kind, f, { JARVIS_TEST_BUILD_FAILURE: "1" });
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stdout, /JARVIS is installed/);
    assert.match(result.stdout + result.stderr, /Source build failed/);
    assert.doesNotMatch(f.effects(), /binary/);
    result = runInstaller(kind, f, { JARVIS_TEST_INSTALL_FAILURE: "1" });
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stdout, /JARVIS is installed/);
  });
}

test("bash: macOS developer tools must be selected before cloning", (t) => {
  const f = fixture(t);
  let result = runInstaller("bash", f, { JARVIS_TEST_OS: "Darwin", JARVIS_TEST_DEVELOPER_TOOLS_FAILURE: "1" });
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /xcode-select --install/);
  assert.equal(existsSync(f.source), false);
  assert.equal(f.effects(), "");
  result = runInstaller("bash", f, { JARVIS_TEST_OS: "Darwin" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(f.effects(), /--locked/);
});

if (process.platform === "win32") {
  test("powershell: discover C++ outside PATH and refuse an empty VS locator result", (t) => {
    const f = fixture(t);
    let result = runInstaller("powershell", f, { JARVIS_TEST_MISSING: "cl", JARVIS_TEST_VS_DISCOVERY: "empty" });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /Windows C\+\+ build tools/);
    assert.equal(existsSync(f.source), false);
    assert.equal(f.effects(), "");
    result = runInstaller("powershell", f, { JARVIS_TEST_MISSING: "cl", JARVIS_TEST_VS_DISCOVERY: "installed" });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(f.effects(), /--locked/);
  });
}

test("syntax and contract checks reject broken files instead of silently skipping", (t) => {
  assert.deepEqual(validateInstallerText(sh, ps1), []);
  assert.match(validateInstallerText(sh.replaceAll("\n", "\r\n"), ps1).join("\n"), /LF line endings/);
  const brokenSh = spawnSync(bash, ["-n"], { input: "if then\n", encoding: "utf8" });
  assert.notEqual(brokenSh.status, 0);
  const f = fixture(t);
  const brokenPs = join(f.base, "broken.ps1"); writeFileSync(brokenPs, "if ( {");
  const result = spawnSync(powershell, ["-NoProfile", "-NonInteractive", "-Command",
    "$t=$null;$e=$null;[void][System.Management.Automation.Language.Parser]::ParseFile($env:BROKEN_FILE,[ref]$t,[ref]$e);if($e){exit 1}"],
    { env: { ...process.env, BROKEN_FILE: brokenPs }, encoding: "utf8" });
  assert.notEqual(result.status, 0);
});

test("shell discovery bypasses broken WSL and refuses missing or broken overrides", () => {
  const attempted = [];
  const run = (command) => {
    attempted.push(command);
    return { status: command === "working-bash" ? 0 : 1, stdout: "", stderr: "no interpreter" };
  };
  assert.equal(selectInterpreter(["broken-wsl", "working-bash"], ["-c", "exit 0"], run), "working-bash");
  assert.deepEqual(attempted, ["broken-wsl", "working-bash"]);
  assert.throws(() => findBash({ JARVIS_BASH: "broken-wsl" }, "win32", run), /No working shell/);
  assert.throws(() => selectInterpreter(["missing"], [], () => ({ error: new Error("ENOENT") })), /No working shell/);
});
