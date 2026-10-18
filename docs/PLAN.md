# Plan

## Goals

1. Make a visitor understand in ten seconds what JARVIS is and why it is safe to leave running.
2. Give them a clear source-install command and a separate setup handoff; document build prerequisites and the required model/ElevenLabs checks before calling the assistant ready.
3. Never claim something the platform does not do.

## Non-goals

No accounts, analytics, tracking, cookies or third-party fonts and scripts. The site practises the local-first stance it describes. No backend.

## Page structure (single page)

| Section | Purpose |
| --- | --- |
| Hero | JARVIS name over an unframed canonical HUD face, primary install/docs actions |
| Quick install | OS-aware commands, clipboard feedback and source-install prerequisites |
| Principles | Your machine, model, memory and decision |
| See it work | Three illustrative mission workflows with trace inspection, pause/resume/stop, connected approvals and outcome previews |
| Capabilities | Twelve cards, checked against reachable tool code; coding delegation is labelled experimental |
| Trust | Keyboard-accessible seven-gate inspector and four ownership guarantees |
| Architecture | Rust-centered system blueprint; available interfaces, replaceable adapters, local data and explicit experimental/unshipped states |
| Install | Three steps, handy commands, headless-server tunnel, platform status |
| Roadmap | Dated evidence review: available, experimental, next and deliberately deferred |

## Install strategy

| Method | State | Notes |
| --- | --- | --- |
| Default Unix/Windows commands | Pinned signed prerelease; deployment/native website acceptance tracked separately | Verify publisher, manifest and archive before per-user installation; no source build or service startup |
| From source | Explicit alternative | Git, pinned Rust toolchain and native build tools; locked build |
| Prebuilt archive | Signed release a176e79, version 0.1.0 | Native certificates, complete dependency notices/SBOM and clean-machine acceptance remain separate |

The scripts never use `sudo`, never request administrator elevation and never touch settings or memory. `scripts/check-install.mjs` fails closed on missing safety properties.

## Milestones

1. **M1 (done):** scaffold, content, hero, install box, scripts, docs.
2. **M2 (partly delivered):** the site and scripts are hosted, and an Ubuntu 24.04 source-install run is recorded in [DEPLOY.md](DEPLOY.md). Clean macOS, Windows, other Linux distributions and aarch64 acceptance remain open; frontend CI fixtures do not close those gates.
3. **M3 (implemented locally, 2026-10-18):** signed-only website installers pin an accepted public release. Native website CI and deployment remain separate evidence; source installation remains explicit.
4. **M4 (revised 2026-10-13):** the actual HUD face geometry replaces the decorative orb; the screenshot section and asset are removed. Illustrative examples remain clearly labelled and never simulate a live assistant connection.
5. **M5:** a docs section rendered from the main repository's `docs/user`.

## Risks

- Copy drifts from the product. Mitigation: all factual copy lives in `src/content.ts` and is mapped to sources in CONTENT-ACCURACY.md.
- `curl | bash` is a trust trade-off. Mitigation: scripts are inspectable, pinned to a reviewed release and verify publisher signatures before execution; the website HTTPS origin remains the bootstrap trust root.
