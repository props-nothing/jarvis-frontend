export function validateInstallerText(sh, ps1) {
  const errors = [];
  if (sh.includes("\r")) errors.push("install.sh must use LF line endings");
  if (!sh.startsWith("#!/usr/bin/env bash\n")) errors.push("install.sh needs a bash shebang");
  if (!/^set -euo pipefail$/m.test(sh)) errors.push("install.sh must set -euo pipefail");
  if (!/^\$ErrorActionPreference = 'Stop'\r?$/m.test(ps1)) errors.push("install.ps1 must stop on errors");
  for (const [name, text] of [["install.sh", sh], ["install.ps1", ps1]]) {
    if (!text.includes("https://github.com/props-nothing/jarvis-core.git")) errors.push(`${name} must default to the official repository`);
    if (!text.includes("--porcelain=v1")) errors.push(`${name} must inspect local source changes`);
    if (!text.includes("--detach") || !text.includes("FETCH_HEAD")) errors.push(`${name} must build the fetched revision`);
  }
  return errors;
}
