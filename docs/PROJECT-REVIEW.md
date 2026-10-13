# Project review: what JARVIS is

Reviewed 2026-10-11 from the main repository (`README.md`, `ROADMAP.md`, `docs/architecture/overview.md`, `docs/user/*`, `apps/jarvis-cli/src`).

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

Public downloads, signed installers, any licence, a Tauri desktop client, telephony, local speech, coding agents over ACP, the server profile. Only Windows has been run end to end by a person; Linux and macOS are built and tested in CI.

## Consequences for the website

1. The most important claim is trust, not capability: "models suggest, policy decides, you approve".
2. Install commands must be real. They build from source today; prebuilt binaries come after a licence decision.
3. Platform status is stated plainly.
4. Visual language reuses the console's palette (deep navy, cyan, amber) so the site and product feel like one thing.
5. Comparable reference: openclaw.ai (hero, one-line install, feature grid). We match that structure and add the trust pipeline, which is what sets JARVIS apart.
