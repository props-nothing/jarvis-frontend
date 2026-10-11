# Content accuracy

Every factual statement on the site comes from the JARVIS repository. When these sources change, update `src/content.ts` and the matching copy in `src/App.tsx`.

| Claim on the site | Source in the JARVIS repository |
| --- | --- |
| One program; `jarvis daemon` is the same file | `README.md`, `docs/user/quick-start.md` |
| Console on `127.0.0.1:8765`, no public port, SSH tunnel on servers | `README.md`, `docs/user/platforms.md` |
| `jarvis`, `ask`, `hud`, `doctor --live`, `approvals`, `cancel`, `keys`, `mcp`, `service install`, `eval`, `install`, `uninstall` | `apps/jarvis-cli/src/main.rs` usage text, `docs/user/quick-start.md` |
| `jarvis install [--dir] [--service]` copies to the user's folder, adds to PATH, no admin rights | `apps/jarvis-cli/src/install.rs`, quick-start |
| Build command `cargo build --release -p jarvis-cli` | quick-start |
| Models: Ollama, OpenAI, Gemini, Anthropic compatible, any OpenAI-compatible, fallback provider | `README.md` |
| Files, documents, OCR, web, Gmail, Calendar, projects, digest, push | `README.md` |
| Browser and docs lookup abilities; clicking and typing ask first | `docs/user/abilities.md` |
| Schedules, triggers, sub-agents, container code, shell held by default | `README.md`, `ROADMAP.md` |
| Voice: push-to-talk, wake word, interruption, spoken stop, ElevenLabs optional | `ROADMAP.md` hallmarks table |
| Telegram built and configured in Settings | `ROADMAP.md` item 5 |
| Connect apps: Claude Code, Cursor, VS Code, scripts | `ROADMAP.md` item 2b, `docs/user/connect-apps.md` |
| Policy pipeline (schema, authentication, authorization, risk, approval, timeout, idempotency, audit) | `AGENTS.md` architecture boundaries |
| Approvals are one yes or no | ADR-0136 |
| Platform status table | `docs/user/platforms.md` |
| No licence, no public downloads, no signed installers | `README.md` licence status, `docs/user/platforms.md` known gaps |
| Roadmap columns | `ROADMAP.md` |
| 190+ architecture decision records | count of files in `docs/adr` (195 on 2026-10-11) |

## Deliberately illustrative

- The terminal session and the approval card are illustrations and are labelled as such. The model name, folder and tool wording are examples, not captured output.
- The orb is decorative; it is not a rendering of the console's head.

## Not claimed

Telephony, desktop app, signed installers, prebuilt downloads, a hosted service, any benchmark or performance figure.
