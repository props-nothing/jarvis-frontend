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
| Hero | Headline, one-line install with OS-aware tabs, animated holographic head |
| Stats | Four true facts: one program, 127.0.0.1, SQLite, 190+ ADRs |
| See it work | Scripted terminal session and an interactive approval card |
| Capabilities | Nine cards, each backed by a documented feature |
| Trust | Animated seven-gate pipeline and four guarantees |
| Architecture | Clients, `jarvisd`, adapters, data. Planned parts drawn dashed |
| Install | Three steps, handy commands, headless-server tunnel, platform status |
| Roadmap | Working, in the queue, planned |
| FAQ | Download availability, models, safety, privacy, remote access |

## Install strategy

| Method | State | Notes |
| --- | --- | --- |
| `curl -fsSL <host>/install.sh \| bash` | Works once the site is hosted | Clones, `cargo build --release -p jarvis-cli`, `jarvis install`; `JARVIS_SERVICE=1` adds `--service` (off by default, see "Server test findings" in DEPLOY.md) |
| `irm <host>/install.ps1 \| iex` | Same | Windows, per-user, no administrator rights |
| From source | Works now | Plain git and cargo commands, no hosting needed |
| Prebuilt archive | Blocked | Needs a licence ([P9-004 to P9-007]); switch the scripts to download and verify the SHA-256 when it exists |

The scripts never use `sudo`, never run as administrator and never touch settings or memory. `scripts/check-install.mjs` fails closed on missing safety properties.

## Milestones

1. **M1 (done):** scaffold, content, hero, install box, scripts, docs.
2. **M2:** host the site and the scripts; verify `install.sh` on a clean Linux and macOS machine and `install.ps1` on a clean Windows machine (not yet run end to end).
3. **M3:** when releases exist, add a download tab with checksums and a version badge fetched at build time.
4. **M4:** screenshots or a recording of the real console replace the illustrative terminal.
5. **M5:** a docs section rendered from the main repository's `docs/user`.

## Risks

- Copy drifts from the product. Mitigation: all factual copy lives in `src/content.ts` and is mapped to sources in CONTENT-ACCURACY.md.
- `curl | bash` is a trust trade-off. Mitigation: the script is short, readable, source-build only and linked from the page.
