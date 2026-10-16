# Content accuracy

Every factual statement on the site must agree with reachable JARVIS code, not just its design docs. Reviewed **2026-10-16**, core baseline `b930f73` plus the review-correction working tree: current MCP credentials/OAuth, contact deletion, in-place coding delivery and recorded acceptance were checked alongside the earlier tool contracts. The preserved macOS fixture repair does not establish a successful native rerun. Provider/browser and clean-machine gaps remain explicit. When these sources change, update `src/content.ts`, `src/App.tsx` and the content regressions.

| Claim on the site | Source in the JARVIS repository |
| --- | --- |
| One program; `jarvis daemon` is the same file | `README.md`, `docs/user/quick-start.md` |
| Console on `127.0.0.1:8765`, no public port, SSH tunnel on servers | `README.md`, `docs/user/platforms.md` |
| `jarvis`, `ask`, `hud`, `doctor --live`, `approvals`, `cancel`, `keys`, `mcp`, `service install`, `eval`, `install`, `uninstall` | `apps/jarvis-cli/src/main.rs` usage text, `docs/user/quick-start.md` |
| `jarvis install [--dir] [--service]` copies to the user's folder, adds to PATH, no admin rights | `apps/jarvis-cli/src/install.rs`, quick-start |
| Build command `cargo build --release -p jarvis-cli` | quick-start |
| Models: Ollama, OpenAI, Gemini, Anthropic compatible, any OpenAI-compatible, fallback provider | `README.md` |
| Files, documents, OCR, web, Gmail, Calendar, projects, digest, push | `README.md` |
| Browser and docs lookup; acting asks by default, not regardless of owner permission settings; web search needs a key | `docs/user/abilities.md`, `apps/jarvisd/src/lib.rs` search composition, `mcp_abilities.rs` and workspace policy |
| Schedules, triggers, sub-agents; container execution is optional and needs Docker/configuration | `README.md`, `ROADMAP.md`, `apps/jarvisd/src/lib.rs` tool composition |
| Restart recovery starts one new continuation for eligible recent requests; it is not exact replay or a general durable workflow engine | `apps/jarvisd/src/resume.rs`, `lib.rs` recovery/composition; at most three continuations, newest requests within two hours, never recursive |
| Single-file recovery, Gmail Trash and Google reauthorization | `crates/jarvis-tools/src/files.rs` delete contract, daemon composition, `apps/jarvisd/src/google_tools.rs` trash contract; `docs/user/files.md`, `google.md`, `TODO.md` P11-025 |
| New XLSX/CSV/DOCX/PDF and existing XLSX literal-cell editing | `apps/jarvisd/src/document_write_tool.rs`, `xlsx_workbook.rs`, `lib.rs`; formula/protected/macro/signed targets refused, no formula calculation |
| Contact CSV import/merge preserves suppression; authorized deletion removes the record and its suppression | `docs/user/contacts.md`, ADR-0218, `apps/jarvisd/src/contacts_tool.rs`, `crates/jarvis-storage/src/contact_repository.rs`; normal deterministic policy decides whether approval is needed |
| MCP named local/remote credentials and pre-registered browser OAuth exist, with remaining provider acceptance | `docs/user/mcp.md`, `connections.md`, ADR-0216/0217/0219/0220; private profile files, one-time app registration and explicit restart for tool registration; automatic client registration/hot apply remain open |
| Browser voice, wake word, interruption, spoken stop, ElevenLabs optional; browser support/services are not offline local speech | `apps/jarvisd/src/hud/hud.js` browser speech APIs, `ROADMAP.md` hallmarks table and `docs/user/settings.md` |
| Telegram built and configured in Settings | `ROADMAP.md` item 5 |
| Connect apps: Claude Code, Cursor, VS Code, scripts | `ROADMAP.md` item 2b, `docs/user/connect-apps.md` |
| Policy pipeline (schema, authentication, authorization, risk, approval, timeout, idempotency, audit) | `AGENTS.md` architecture boundaries |
| Approvals are one yes or no | ADR-0136 |
| Platform status table | `docs/user/platforms.md` |
| Original platform and website code/docs: Apache-2.0; third-party terms separate; no published/signed downloads yet | Core `LICENSE`, `NOTICE`, workspace Cargo metadata, website `LICENSE`, `NOTICE`, npm metadata and served `/licenses/jarvis.txt`; core `P9-017b` |
| Roadmap columns, reviewed 2026-10-16 | `ROADMAP.md`, current acceptance ledger `TODO.md`, `docs/user/code-agents.md`, `docs/user/phone.md` |
| Tool discovery and per-task model routing are built | `ROADMAP.md`, ADR-0176 and ADR-0196 |
| ACP jobs default in-place with optional worktrees, independent checks and managed previews; host processes are not sandboxed | `docs/user/code-agents.md`, ADR-0222/0224, `code_delegate_async.rs`, `code_delegate.rs`; real Codex dependency-install check is recorded, while full website/browser delivery, sign-in and real-agent cancellation remain unverified |
| Full-text knowledge search is a delivered first slice | `TODO.md` P11-014, `docs/user/files.md`; vector retrieval is not claimed |
| Owner outbound calls have owner-reported evidence, not general telephony verification | `TODO.md` item 10, `docs/user/phone.md` |
| Local voice, desktop, distribution, server profile and multi-step workflows remain unshipped or deferred | `ROADMAP.md`, `TODO.md` parked scope and distribution gates |
| Windows and Ubuntu have end-to-end evidence; other targets need clean-machine checks | Platform documentation and this site's `docs/DEPLOY.md` |

## Deliberately illustrative

- Email, research and file workflows are illustrative, not captured output or a live assistant session. Messages, folders, sources and outcomes are example data. There is no model, account or filesystem connection.
- Approval examples share the workflow state machine: approval gates cannot be passed by a timer; denial, pause, stop and switching examples cannot create an external effect. These presentation tests are not proof of Rust policy enforcement.
- The policy-gate inspector explains the documented order. It does not execute tools or grant permissions.
- The FAQ section, its data, navigation entry and styles have been removed. Privacy and source-install caveats remain in the trust/install sections and footer.
- The face uses the actual HUD's canonical MediaPipe geometry, but is a decorative website scene, not a live daemon, microphone or model session. Pointer response and animation do not indicate assistant activity.
- Static console screenshots and their social metadata were removed in the 2026-10-13 redesign.

## Not claimed

General telephony availability, desktop app, signed installers, published prebuilt downloads, a hosted service, any assistant benchmark or performance figure. Owner outbound-call evidence is distinguished from broader unverified call paths. Selecting Apache-2.0 does not complete distribution gates, relicense third-party code or grant rights to the removed CC BY-NC 4.0 prototype.
