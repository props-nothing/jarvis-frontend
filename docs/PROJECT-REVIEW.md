# Project review: what JARVIS is

Product scope reconciled 2026-10-16 against the main repository's architecture, requirements, delivery ledger and actual daemon/tool code (core baseline `b930f73` plus the review-correction working tree). Website design and interaction review: [DESIGN.md](DESIGN.md).

Release/cancellation evidence updated later on 2026-10-16 from the [core acceptance ledger](https://github.com/props-nothing/jarvis-core/blob/main/TODO.md): the [unsigned c48 prerelease](https://github.com/props-nothing/jarvis-core/releases/tag/ci-c48da8880e20304da4b13e4016d896ad22fc2e04) has verified public archives. A separate later Windows `codex-acp 2.2.2` cancellation test passed; it does not imply that the new lifecycle changes are in c48.

## One sentence

JARVIS is an open-source, installable personal AI service that reasons, remembers, uses tools, schedules work and reacts to events, controlled by deterministic policy and owner approvals rather than by the model. A general multi-step workflow engine remains deferred.

## Shape of the product

- **One native program.** `jarvis` is the CLI and, as `jarvis daemon`, the background daemon (`jarvisd`). Written in Rust.
- **Local-first.** SQLite by default; keys in private files; the HTTP console binds `127.0.0.1:8765`. PostgreSQL + pgvector is the planned server backend.
- **Browser console** (`jarvis hud`): a holographic head that speaks and listens, a live mission view of sources read and tools called, approval buttons, and every setting.
- **Models are adapters.** Any OpenAI-compatible endpoint (Ollama local or cloud, OpenAI, Gemini, Anthropic compatible, others) with an optional fallback provider.
- **Trust boundary.** The model may request an effect; Rust policy decides. JARVIS-owned tools use the canonical validation/authorization/approval pipeline. Native runs have durable tool/audit records; direct external MCP calls still lack that complete durable lifecycle. Approved ACP agents and managed processes execute on the host; JARVIS does not intercept every native agent tool or sandbox those processes. Approvals remain one yes or no ([ADR-0136](https://github.com/props-nothing/jarvis-core/blob/main/docs/adr/0136-an-approval-is-a-yes-or-no-from-the-owner.md)).

## What works today

Granted-folder files and documents (OCR needs Tesseract), new document creation and bounded existing-XLSX cell editing, recoverable single-file and Gmail trash, contact CSV import/merge with suppression preserved, web search with a key and fetch, a browser/docs lookup (MCP needs Node), Gmail and Calendar, project caps/digests, schedules/triggers, sub-agents, optional Docker code execution, approved memory/skills, browser voice, Telegram, authenticated MCP app access, cancellation, audit, token accounting and evaluations. Authorized contact deletion removes its suppression under normal policy. MCP has named keys and pre-registered OAuth; provider/browser acceptance remains open. Coding jobs default in-place, with optional worktrees, independent checks, skill bundles and managed previews. Restart recovery starts bounded new continuations, not exact replay.

## What does not exist yet

Signed installers, a Tauri desktop client, browser-independent local speech and the server profile. Public unsigned prerelease archives exist; a generated dependency-license inventory, signing/notarization and clean-machine release verification remain. ACP/Codex tasks have recorded dependency-install and Windows `codex-acp 2.2.2` cancellation evidence using existing authentication; fresh console sign-in, other-agent/platform cancellation and complete website delivery still need live verification. Owner outbound calls have reported evidence, but broader call paths remain unverified. Windows and Ubuntu 24.04 have end-to-end records. Native CI passed for c48; Intel macOS was cross-built without a runtime smoke, and clean-machine tests remain open.

## Consequences for the website

1. The most important claim is trust, not capability: "models suggest, policy decides, you approve".
2. Install commands must be real. They still build from source; Apache-2.0 is selected but signed public binaries need the remaining release gates.
3. Platform status is stated plainly.
4. The site uses the actual HUD face geometry over graphite, with cyan, white, amber and red accents. Screenshot-dependent presentation is removed.
5. Comparable reference: openclaw.ai for direct installation and concrete capabilities. JARVIS retains its own identity and owner-policy story.

## Frontend Review Findings

Fixed in this redesign, ordered by impact:

- Narrow/short-view layout pushed installation out of view. Explicit phone and landscape sizing now preserves the next-section hint without horizontal overflow.
- The old Console navigation target would become stale after screenshot removal. Every navigation target now has a checked section ID.
- Screenshot assets and social metadata contradicted the requested presentation. Both references and the binary capture are removed.
- Decorative continuous animations lacked user controls. The face has pause/reduced-motion/visibility gates; terminal replay is opt-in; the pipeline is static.
- Approval success text could imply a real external effect. Results now describe what JARVIS would do and remain labelled as a demo.
- Platform and roadmap claims had drifted. The page now distinguishes recorded delivery, live verification gaps and planned work.

Residual risks: the optional Three.js scene adds about 153 kB gzip; integrated Chromium checks do not establish native Safari/iOS or Android behavior; public signed distribution and clean-machine installer gates are not completed by a website redesign. No Rust authority, provider protocol or installer execution behavior was changed.

Installer update, 2026-10-18: production uses pinned signed prebuilt installers. Local shell fixtures, all seven native website jobs and hosted byte/header verification pass; see [deployment evidence](DEPLOY.md#signed-default-revision-2026-10-18). Source-installer statements in the dated review above describe the earlier revision. See [signed installation](research/integrations/signed-install.md).
