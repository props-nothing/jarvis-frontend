import assert from "node:assert/strict";
import { test } from "node:test";
import { installCommands, isWindows } from "../src/installCommands.ts";
import { SITE_URL, REPO_GIT_URL, siteOrigin } from "../src/config.ts";

test("public install commands follow the serving origin", () => {
  const commands = installCommands(SITE_URL, REPO_GIT_URL, false);
  assert.equal(commands.unix, "curl -fsSL https://www.jarvisd.dev/install.sh | bash");
  assert.equal(commands.windows, "irm https://www.jarvisd.dev/install.ps1 | iex");
  assert.equal(installCommands("http://localhost:5199", REPO_GIT_URL, false).unix,
    "curl -fsSL http://localhost:5199/install.sh | bash");
});

test("from-source command uses the native program path, without starting a service", () => {
  const unix = installCommands(SITE_URL, REPO_GIT_URL, false).source;
  const windows = installCommands(SITE_URL, REPO_GIT_URL, true).source;
  assert.match(unix, /\.\/target\/release\/jarvis install$/);
  assert.match(windows, /\.\\target\\release\\jarvis\.exe install$/);
  for (const command of [unix, windows]) {
    assert.match(command, /git clone https:\/\/github.com\/props-nothing\/jarvis-core\.git\ncd jarvis-core\n/);
    assert.match(command, /cargo build --release -p jarvis-cli/);
    assert.doesNotMatch(command, /--service/);
  }
});

test("OS detection and server-side origin have real fallbacks", () => {
  assert.equal(isWindows("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), true);
  assert.equal(isWindows("Mozilla/5.0 (Macintosh; Intel Mac OS X)"), false);
  assert.equal(isWindows(""), false);
  assert.equal(siteOrigin(), SITE_URL);
});
