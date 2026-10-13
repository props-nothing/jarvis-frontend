# Project review: what JARVIS is

Product scope reconciled 2026-10-13 against the main repository's architecture, requirements and roadmap. Website design and interaction review: [DESIGN.md](DESIGN.md).

## One sentence

JARVIS is a persistent, installable personal AI service that reasons, remembers, uses tools, runs durable workflows and reacts to events, controlled by deterministic policy and owner approvals rather than by the model.

## Shape of the product

- **One native program.** `jarvis` is the CLI and, as `jarvis daemon`, the background daemon (`jarvisd`). Written in Rust.
- **Local-first.** SQLite by default; keys in private files; the HTTP console binds `127.0.0.1:8765`. PostgreSQL + pgvector is the planned server backend.
- **Browser console** (`jarvis hud`): a holographic head that speaks and listens, a live mission view of sources read and tools called, approval buttons, and every setting.
- **Models are adapters.** Any OpenAI-compatible endpoint (Ollama local or cloud, OpenAI, Gemini, Anthropic compatible, others) with an optional fallback provider.
- **Trust boundary.** The model may request an effect; Rust policy decides. Tool calls pass schema validation, authentication, authorization, risk classification, approval, timeout, execution and audit. Approvals are one yes or no ([ADR-0136](https://github.com/props-nothing/jarvis-core/blob/main/docs/adr/0136-an-approval-is-a-yes-or-no-from-the-owner.md)).

## What works today

Files and documents (incl. OCR), web search and fetch, a built-in browser and docs lookup (MCP), Gmail and Calendar, projects with caps and a digest, schedules and triggers, sub-agents, code in a container, memory and skills proposed by the model and approved by the owner, voice in the browser, Telegram, MCP host and server ("connect apps"), kill switch, audit trail, token accounting, and `jarvis eval`.

## What does not exist yet

Public downloads, signed installers, a distribution licence, a Tauri desktop client, browser-independent local speech and the server profile. ACP/Codex tasks are built with recorded evidence; console sign-in and cancellation need live verification. Owner outbound calls have reported evidence, but broader call paths remain unverified. Windows and Ubuntu 24.04 have end-to-end records; other targets still need clean-machine tests.

## Consequences for the website

1. The most important claim is trust, not capability: "models suggest, policy decides, you approve".
2. Install commands must be real. They build from source today; prebuilt binaries come after a licence decision.
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
