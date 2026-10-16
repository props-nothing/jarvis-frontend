# Plan

## Goals

1. Make a visitor understand in ten seconds what JARVIS is and why it is safe to leave running.
2. Get them from the page to a working `jarvis` with one copied command.
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
| `curl -fsSL <host>/install.sh \| bash` | Works once the site is hosted | Clones, `cargo build --release -p jarvis-cli`, `jarvis install`; `JARVIS_SERVICE=1` adds `--service` (off by default, see "Server test findings" in DEPLOY.md) |
| `irm <host>/install.ps1 \| iex` | Same | Windows, per-user, no administrator rights |
| From source | Works now | Plain git and cargo commands, no hosting needed |
| Prebuilt archive | Not published | Apache-2.0 is selected; dependency notices, signing/notarization and clean-machine checks remain ([P9-017b], [P9-004 to P9-007]). Switch the scripts only after a verified release exists |

The scripts never use `sudo`, never run as administrator and never touch settings or memory. `scripts/check-install.mjs` fails closed on missing safety properties.

## Milestones

1. **M1 (done):** scaffold, content, hero, install box, scripts, docs.
2. **M2 (partly delivered):** the site and scripts are hosted, and an Ubuntu 24.04 source-install run is recorded in [DEPLOY.md](DEPLOY.md). Clean macOS, Windows, other Linux distributions and aarch64 acceptance remain open; frontend CI fixtures do not close those gates.
3. **M3:** when releases exist, add a download tab with checksums and a version badge fetched at build time.
4. **M4 (revised 2026-10-13):** the actual HUD face geometry replaces the decorative orb; the screenshot section and asset are removed. Illustrative examples remain clearly labelled and never simulate a live assistant connection.
5. **M5:** a docs section rendered from the main repository's `docs/user`.

## Risks

- Copy drifts from the product. Mitigation: all factual copy lives in `src/content.ts` and is mapped to sources in CONTENT-ACCURACY.md.
- `curl | bash` is a trust trade-off. Mitigation: the script is short, readable, source-build only and linked from the page.
