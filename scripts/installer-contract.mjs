import { readFileSync } from "node:fs";
export const release = JSON.parse(readFileSync(new URL("./installer-release.json", import.meta.url), "utf8"));

export function validateInstallerText(sh, ps1) {
  const errors = [];
  if (sh.includes("\r")) errors.push("install.sh must use LF line endings");
  if (!sh.startsWith("#!/usr/bin/env bash\n")) errors.push("install.sh needs a bash shebang");
  if (!/^set -euo pipefail$/m.test(sh)) errors.push("install.sh must set -euo pipefail");
  if (!/^\$ErrorActionPreference = 'Stop'\r?$/m.test(ps1)) errors.push("install.ps1 must stop on errors");
  if (release.tag !== `ci-${release.sourceCommit}` || !/^[0-9a-f]{40}$/.test(release.sourceCommit)) errors.push("release must pin the source commit");
  for (const [name, text] of [["install.sh", sh], ["install.ps1", ps1]]) {
    if (!text.includes(release.tag) || !text.includes(`'${release.version}'`)) errors.push(`${name} must use the reviewed release pin`);
    for (const required of ["https://github.com/props-nothing/jarvis-core/releases/download/", "--certificate-identity", "--certificate-oidc-issuer", "https://token.actions.githubusercontent.com", "Signature verifier checksum mismatch", "SHA-256 mismatch", "already exists", "Setup has not run", "--voice-key-file ABSOLUTE_VOICE_KEY_FILE", "doctor --live"]) {
      if (!text.includes(required)) errors.push(`${name} missing ${required}`);
    }
    if (/cargo build|git clone|Unsigned prebuilt|releases\/latest/.test(text)) errors.push(`${name} must stay pinned and signed-only`);
  }
  return errors;
}
