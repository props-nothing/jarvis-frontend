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
| Tool discovery and per-task model routing are built | `ROADMAP.md`, ADR-0176 and ADR-0196 |
| ACP/Codex tasks are built; console sign-in/cancellation need verification | `ROADMAP.md` snapshot 2026-10-13 |
| Windows and Ubuntu have end-to-end evidence; other targets need clean-machine checks | Platform documentation and this site's `docs/DEPLOY.md` |

## Deliberately illustrative

- The terminal session and the approval card are illustrations and are labelled as such. The model name, folder and tool wording are examples, not captured output.
- The face uses the actual HUD's canonical MediaPipe geometry, but is a decorative website scene, not a live daemon, microphone or model session. Pointer response and animation do not indicate assistant activity.
- Static console screenshots and their social metadata were removed in the 2026-10-13 redesign.

## Not claimed

General telephony availability, desktop app, signed installers, prebuilt downloads, a hosted service, any assistant benchmark or performance figure. Owner outbound-call evidence is distinguished from broader unverified call paths. No licence decision was made here.
