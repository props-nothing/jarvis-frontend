# Signed website installation

Verified contract: 2026-10-18 UTC. Implemented from core bootstrap revision
`a176e79843a22eae2802d97aafba74a0bf6e282f`, package 0.1.0, JARVIS-RELEASE-1 and
SHA-256-pinned Cosign 3.1.3. No SDK or dependency upgrade.

The [core research record](https://github.com/props-nothing/jarvis-core/blob/main/docs/research/integrations/website-signed-install.md)
records the controlling contract and unresolved gates. Official sources checked:
[GitHub exact release links](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases),
[curl bounds and transport](https://curl.se/docs/manpage.html),
[Sigstore verification](https://docs.sigstore.dev/cosign/verifying/verify/),
[Cosign 3.1.3](https://github.com/sigstore/cosign/releases/tag/v3.1.3), and
[PowerShell expression execution](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-expression?view=powershell-5.1).
GitHub's llms.txt could not be read by the browser; official docs were used.
No relevant contract change observed from the pinned core implementation.

## Boundaries

Anonymous HTTPS GET downloads only; no account, scopes, keys, SDK, webhook or
pagination. Requests disclose ordinary network metadata to GitHub/Sigstore, never
profile contents or provider keys. No paid API calls. Manifest/bundle sizes are
capped at 8 KiB/1 MiB; archives at 256 MiB. Transfers require curl >=8.4, TLS,
HTTPS-only redirects (five maximum), a 15-second connection deadline and 120-second
total deadline. Cosign verification has a two-minute deadline and isolated public
trust cache. Archive decompression/extraction retains core bounds.

The scripts require the pinned commit/tag/version, exact publisher workflow and
GitHub OIDC issuer, then the archive hash and executable version. Every failure
stops the install. No automatic retry, mutable latest lookup, unsigned option,
source-build fallback, setup, service startup or existing-binary replacement.
Only From source compiles. User settings/memory stay with the Rust program.

The HTTPS website and embedded verifier hashes remain trust roots. Publisher
verification is separate from Authenticode/notarization. Native certificates,
complete notices/SBOM and clean-machine onboarding/logon remain open. Intel macOS
is cross-built; its runtime acceptance is not inferred from Apple silicon tests.

## Verification and maintenance

`npm test` runs real archive fixtures on Bash and Windows PowerShell, including
signature/verifier/manifest/hash/version refusals, install errors, existing-file
preservation, cleanup and piped entry. Copies with the signature call removed
fail those assertions; production scripts stay unchanged during falsification.
`npm run test:install:live` exercises the real signed public archive with a fresh
profile, no PATH modification and developer tools hidden from PATH. Local Windows
passed; native website CI for Windows/macOS/Linux x86_64/ARM64 is configured but
not yet run for this revision. Production deployment is also separate.

Update `public/install.sh`, `public/install.ps1` and
`scripts/installer-release.json` together after reviewing a newly accepted public
release. Compare the embedded bootstrap with the selected core revision, including
any security corrections; run fixture and native live tests before deploying.
The release record is a build/test consistency check, not downloaded runtime policy.
