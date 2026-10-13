---
integration: frontend-github-actions
status: researched
last_verified: 2026-10-13
selected_spec_version: GitHub Actions workflow YAML
selected_sdk: actions/checkout v6 and actions/setup-node v6 (commit pinned)
---

# Frontend regression CI

## Scope

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

No hosted result is claimed until the workflow actually finishes. Native clean-machine Rust builds and service-manager ownership still need their separate acceptance evidence. Vercel's independent deployment is not gated by this workflow unless the owner enables that integration policy.
