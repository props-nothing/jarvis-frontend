# Plan

## Goals

1. Make a visitor understand in ten seconds what JARVIS is and why it is safe to leave running.
2. Give them a clear signed installer and a separate setup handoff; keep source-build prerequisites and the required model/ElevenLabs checks explicit.
3. Never claim something the platform does not do.

## Non-goals

No accounts, analytics, tracking, cookies or third-party fonts and scripts. The site practises the local-first stance it describes. No backend.

## Page structure (implemented locally, 2026-10-18)

| Page | Purpose |
| --- | --- |
| `/` | Large autonomous face, concise intro, compact tabbed one-line installer, three use cases, manual film and deeper links |
| `/product` | Twelve capabilities grouped into everyday work, knowledge and automation, with their limits |
| `/integrations` | Google, Telegram, models, voice, MCP and experimental coding; connection types and setup limits |
| `/how-it-works` | Plain-language introduction, keyboard-accessible policy inspector and architecture |
| `/install` | One installer, prerequisites, first run, commands/server disclosures and platform evidence |
| `/roadmap` | Dated evidence review: available, experimental, next and deliberately deferred |

Native document links connect six Vite HTML entries. Metadata and sitemap come from
`src/site.ts`; the face belongs only to the homepage. See [the design and
verification record](DESIGN.md) and [build contract](research/integrations/multipage-site.md).

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
3. **M3 (deployed, 2026-10-18):** signed-only website installers pin an accepted public release. All seven native website jobs and hosted byte/header checks pass; [delivery evidence](DEPLOY.md#signed-default-revision-2026-10-18) is separate from clean-machine onboarding. Source installation remains explicit.
4. **M4 (revised 2026-10-13):** the actual HUD face geometry replaces the decorative orb; the screenshot section and asset are removed. Illustrative examples remain clearly labelled and never simulate a live assistant connection.
5. **M5:** a docs section rendered from the main repository's `docs/user`.

## Risks

- Copy drifts from the product. Mitigation: preserve the capability/platform evidence in `src/content.ts` and review page-specific summaries against CONTENT-ACCURACY.md.
- `curl | bash` is a trust trade-off. Mitigation: scripts are inspectable, pinned to a reviewed release and verify publisher signatures before execution; the website HTTPS origin remains the bootstrap trust root.
