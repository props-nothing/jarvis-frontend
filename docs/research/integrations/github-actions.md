---
integration: frontend-github-actions
status: researched
last_verified: 2026-10-18
selected_spec_version: GitHub Actions workflow YAML
selected_sdk: actions/checkout v6 and actions/setup-node v6 (commit pinned)
---

# Frontend regression CI

## Scope

2026-10-18 continuation: the owner requested direct pushes to main, native website
CI, fixes and production deployment only after success. The signed-install job now
tests the exact public pin on Windows x86_64, macOS ARM64 and Linux x86_64/ARM64;
the three existing build/fixture jobs remain. Unlike the historical source fixtures
below, these four jobs contact public GitHub/Sigstore endpoints without credentials.

Official contracts refreshed 2026-10-18 UTC:

- [GitHub workflow runs](https://docs.github.com/en/rest/actions/workflow-runs?apiVersion=2022-11-28)
  provides public read-only run/job status for the exact commit (REST version
  2022-11-28 remains accepted; current examples advertise 2026-03-10).
- [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration)
  documents `git.deploymentEnabled.main=false`: a commit on that branch does not
  create an automatic deployment. Other project settings remain unchanged.
- [Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github)
  and [official index](https://vercel.com/llms.txt) establish production deployment
  from the configured production branch. No SDK or dependency change.

Operational sequence: push the candidate on main with an explicit deployment hold,
wait for all seven jobs at that SHA, fix failures on main, then remove only the hold
to publish the tested application through the existing integration. No new branch
or release-discovery API is introduced. Git push uses the existing scoped GitHub
credential; public CI reads require none. No secret is logged or committed. The hold
must be removed after success; failure leaves the existing production site intact.
GitHub/Vercel concurrency and billing remain account-dependent. Verify the deployed
script bytes and content types, and record the final commit/run URLs.

Run the website build, shell syntax checks and offline installer tests on native Windows, Ubuntu and macOS runners. No release, deployment API, cloud account, paid model or credential is required.

## Official sources (accessed 2026-10-13 UTC)

- Docs index: https://docs.github.com/llms.txt
- Workflow reference: https://docs.github.com/api/article/body?pathname=/en/actions/reference/workflows-and-actions/workflow-syntax
- Checkout README/release notes: https://raw.githubusercontent.com/actions/checkout/main/README.md
- Selected checkout contract: https://raw.githubusercontent.com/actions/checkout/d23441a48e516b6c34aea4fa41551a30e30af803/action.yml
- Node setup README/release notes: https://raw.githubusercontent.com/actions/setup-node/main/README.md
- Selected setup-node contract: https://raw.githubusercontent.com/actions/setup-node/249970729cb0ef3589644e2896645e5dc5ba9c38/action.yml
- macOS tool inventory: https://raw.githubusercontent.com/actions/runner-images/main/images/macos/macos-15-Readme.md (Bash 3.2, Git, Node 24 cache and PowerShell 7.6 present).

Pins resolved directly from the official repositories' `refs/tags/v6` during this task. Current README also mentions v7; we use the inspected v6 pins, not floating tags. Both chosen actions run on Node 24, so use GitHub-hosted modern images, not an unspecified self-hosted runner.

## Contract, auth and limits

Workflows in `.github/workflows` trigger on push to main and ordinary pull_request (never pull_request_target). Checkout uses the platform token with `contents: read`, `persist-credentials: false`. setup-node selects Node 24; caching is disabled. Tests use only local temporary Git repositories and native shells; no service or real account is contacted. The job has a 10-minute ceiling and independent platform failures (`fail-fast: false`). GitHub billing/concurrency depends on repository/account plan; no external paid infrastructure is provisioned.

No pagination, webhooks, retry of effects, storage semantics or JARVIS authority changes. The trust boundary is the normal unprivileged PR runner, not the daemon. Test fixtures never contain secrets. No third-party implementation is copied.

## Decisions and verification

Use explicit OS labels, SHA-pinned actions and native built-in Node tests; do not add packages or upload native builds. Windows tests exercise the PowerShell installer with a disposable executable; Bash tests use real Git and a stand-in cargo, so green CI does not prove a full JARVIS install or service activation on that OS.

Cheapest falsification: introduce broken shell syntax or a dirty temporary checkout and require a failing test. Run `npm run check:install`, `npm test`, `npm run build` locally, then inspect each hosted job after pushing. Missing interpreters must be errors rather than skipped green results.

## Unresolved

Native clean-machine Rust builds and service-manager ownership still need their separate acceptance evidence. Vercel's independent deployment is not gated by this workflow unless the owner enables that integration policy.

## Verification log

2026-10-18: all seven jobs in [run 39131200970](https://github.com/props-nothing/jarvis-frontend/actions/runs/39131200970) passed for `66915f1` with production held. The hold-only removal `11d7a1f` deployed successfully through the existing Vercel integration. Both production scripts match checkout bytes after the repository's declared line-ending filters; response headers and built JavaScript/CSS are verified. See [deployment evidence](../../DEPLOY.md#signed-default-revision-2026-10-18). All changes were pushed directly to main; no branch or PR was created. Future pushes still require deliberate CI-before-deploy coordination; this temporary hold is not a permanent Vercel deployment gate.

2026-10-13: [run 38466482868](https://github.com/props-nothing/jarvis-frontend/actions/runs/38466482868) for commit `062d9fa` completed successfully on all three runners (Windows 2025, Ubuntu 24.04, macOS 15). Each job ran `npm ci`, `npm run check:install`, `npm test`, and `npm run build`. This proves the fixture/syntax/build contracts, not a full native JARVIS installation.
