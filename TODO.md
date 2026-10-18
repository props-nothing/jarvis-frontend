# TODO

Ledger for the website repository. Owner decisions are marked **needs owner**. Core platform work lives in the main repository's `TODO.md`; items that belong there link to their ID.

## Owner-selected hero refresh (2026-10-18)

- [x] Enlarge the face on desktop/mobile; replace pointer tracking with autonomous movement and a click/keyboard energy response; remove face badges, pause/greeting controls, repeated ownership copy, duplicate installers and the entire workflow-demo section. Nineteen frontend tests, production build, installer syntax, documentation links and Chromium responsive/motion/fallback checks pass; see `docs/DESIGN.md` for evidence and the separate proposed multipage structure. Native-device verification and deployment remain open.

## Owner-selected multipage structure (2026-10-18)

- [x] Inner-page refinement: command-first Install, shorter Product and Integrations summaries, plain-language How it works, and a compact Roadmap. Detailed requirements and capability limits remain in accessible disclosures. All 22 frontend tests, build, HTTP contracts, documentation/whitespace checks and responsive/keyboard checks pass. Core baseline also passes: formatting, strict Clippy and 3,305 tests with 8 ignored. See `docs/DESIGN.md`; deployment remains open.

- [x] Follow-up: place a compact installer directly beneath the hero text, with only macOS/Linux and Windows tabs, one command and copy. No explanatory note or multiline source tab on home. Keyboard/copy and 320–1440 pixel layout checks pass; focused tests, TypeScript/build and production URL checks pass. The detailed Install guide and big animated face remain.

- [x] Implement Home, Product, Integrations, How it works, Install and Roadmap as real document URLs. Preserve the large autonomous face, reduce the homepage to three use cases and a manual film, use quieter reading layouts, and retain capability limits and installer contracts. Unique metadata/sitemap, historical section redirects, mobile/keyboard navigation, refresh/history and all six layouts at 320–1440 pixels are verified.
- [x] Pass all 22 frontend tests, TypeScript/production build, local HTTP page/asset/404/installer-byte checks, installer syntax, documentation links and whitespace checks. Required core baseline also passes: formatting, strict Clippy and 3,304 tests with 8 ignored. See `docs/DESIGN.md` and `docs/research/integrations/multipage-site.md`.
- [ ] Native Safari/iOS/Android verification, pushed CI and deployment of this multipage revision.

## Owner-selected signed website default (2026-10-18)

- [x] Replace default source builders with pinned signed-only downloads, preserve the explicit source tab and separate setup, and update current copy/contracts.
- [x] Pass Bash/Windows PowerShell archive fixtures, both parsers, 19 frontend tests, production build, signature-guard falsification and real isolated Windows public installation without development tools on PATH.
- [x] Run the new website revision's native CI and deploy it; verify hosted script bytes and content types. All seven jobs in [run 39131200970](https://github.com/props-nothing/jarvis-frontend/actions/runs/39131200970) passed before deployment `11d7a1f`; both hosted installers match Git checkout bytes and are served as plain text with nosniff. [Deployment evidence](docs/DEPLOY.md#signed-default-revision-2026-10-18). Clean-machine onboarding/logon and native certificates remain core gates.

## Next, in order

- [ ] **1. Core: stop, restart and `service install` when a daemon already owns the profile.** Found on Ubuntu 24.04 (three variants), recorded under `P9-022` in the main `TODO.md` with a suggested fix. This remains core lifecycle acceptance (`P9-003`/`P9-022`); the new active-work stop/restart guard does not establish service-ownership handoff. Installers leave service startup opt-in; the page still says to run `jarvis stop` before `jarvis service install`.
- [ ] **2. Test AlmaLinux 10** (the dnf hint and the rustup path in `install.sh` are unrun on a real box; the rustup path is verified on Ubuntu), aarch64 Linux, macOS (`install.sh`) and a clean Windows machine (`install.ps1`).
- [x] **3. Mask-led website redesign and complete frontend review.** Replaced the decorative orb with the official HUD face geometry, removed the screenshot section/asset/social references, redesigned desktop/mobile layouts, fixed motion and interaction risks and reconciled platform/roadmap claims. 24 Node tests, typecheck/build, installer syntax contracts and integrated Chromium checks pass; native mobile/Safari and live deployment are not claimed. See `docs/DESIGN.md` and `docs/PROJECT-REVIEW.md`.
- [x] **4. Website binary-download acceptance:** signed-only implementation, native website CI and production byte/header verification are complete as recorded above. Clean-machine lifecycle remains separate. Source-build implementation notes below are dated history.

## Polish

- [x] The hero uses the actual canonical HUD face with autonomous movement, click/keyboard energy response, reduced-motion handling and static fallback. Desktop/mobile screenshots and nonblank canvas checks pass.
- [x] Canonical Open Graph/Twitter metadata remains configured; screenshot-dependent previews are removed in the local redesign.
- [ ] Verify the redesigned site on native Safari/iOS and Android devices, then deploy it. The optional face scene adds about 153 kB gzip; retain that budget explicitly.
- [ ] A `/docs` page rendered from the main repository's `docs/user`.
- [x] Syntax validation now finds working Git Bash on Windows, rejects broken/missing interpreters, and parses both scripts without executing them.
- [ ] Re-verify every claim in `docs/CONTENT-ACCURACY.md` whenever the main repository's `README.md`, `ROADMAP.md` or `docs/user/platforms.md` changes. The website face is decorative, not a live assistant connection.

## Done

- [x] **2026-10-17 lifecycle release follow-up:** core `dd65479d988ebf7caa9bddfb803c13cae1b0ddbf` includes the cancellation and process-ownership changes. All ten [native CI jobs](https://github.com/props-nothing/jarvis-core/actions/runs/38976054653), including the three native coding lifecycle gates, passed; all five [package jobs and automatic publication](https://github.com/props-nothing/jarvis-core/actions/runs/38977383098) passed. The public prerelease has the exact tag target and ten assets with verified checksums and matching public downloads. Four native archive smokes passed; Intel macOS was cross-built with its runtime smoke skipped. Earlier c48 evidence below is preserved. Fresh agent sign-in, other-agent/platform cancellation, complete website delivery, signing and clean-machine installation remain separate gates. This follow-up changes only the three release documents; source installers and their default ref remain unchanged. Validation: all 11 Markdown files and 18 local links passed the core documentation checker with zero errors; whitespace checks passed. The final diff contains only these three documents.

- [x] **2026-10-16 release and cancellation evidence update:** the c48 public unsigned prerelease supersedes the earlier unpublished-download status. Native CI and package checks passed for that revision; Intel macOS was cross-built without a runtime smoke. A separate later Windows test with `codex-acp 2.2.2` passed real cancellation and descendant cleanup using existing authentication. Fresh sign-in, other agents/platforms, clean-machine installation and complete website delivery remain open. This updates the evidence below without changing its historical results; see the [current core acceptance ledger](https://github.com/props-nothing/jarvis-core/blob/main/TODO.md). Frontend validation: all 38 Node tests passed, followed by 14 focused tests and a fresh TypeScript/production build after the final wording change; installer syntax/contracts, all 11 Markdown files and whitespace checks passed. The existing optional face chunk remains about 153 kB gzip with Vite's size advisory. No deployment or native-device verification is claimed.

- [x] **2026-10-16 capability reconciliation:** MCP named keys/pre-registered OAuth, policy-controlled contact/suppression deletion and current in-place coding/check/preview behavior replace outdated claims. Native macOS and aarch64 acceptance remain pending. README links now work from this separate repository. Validation: all 38 Node tests, installer syntax/contracts, TypeScript and production build passed; all 11 Markdown files passed the core repository's offline link checker. The existing optional face chunk remains about 153 kB gzip and triggers Vite's size advisory. Deployment and native-device checks remain open.

- [x] **2026-10-14 frontend/code and open-source reconciliation:** checked claims against actual core composition/tool contracts and delivery ledger; added cleanup, XLSX editing, contacts and experimental coding review; narrowed MCP, restart and browser-approval claims. Original website/platform code/docs use Apache-2.0; third-party/prototype terms remain separate. `node --test tests/design.test.mjs tests/install-commands.test.mjs` (14 passed), `npm run check:install`, `npm run build`, core license/metadata and disposable archive-notice contracts passed. Integrated Chromium: all 12 cards and the license link rendered with no runtime errors or horizontal overflow at 320–1440 px; license HTTP 200. The full `npm test` attempt hit concurrent installer-fixture `tmpdir` errors, reported to that session; not claimed passing here. Deployment and native-device checks remain open.
- [x] Follow-up: FAQ removed; evidence-dated four-state roadmap, Rust architecture blueprint, accessible trust-gate inspector, connected three-workflow mission demo and mobile-menu fixes. Focused reducer/menu tests and integrated Chromium interactions/layout checks pass. These examples perform no provider or filesystem operations; deployment and native-device checks remain open.
- [x] Repository rename to `props-nothing/jarvis-core`: current links, source commands and defaults; an explicitly reused old official checkout is supported without rewriting origin.
- [x] Source-install reruns refuse dirty/foreign trees; fetch failures and invalid opt-in flags fail closed. 21 local real-Git/shell/command tests pass, including Windows PowerShell execution with inert fixtures (not a clean-machine Rust build).
- [x] Keyboard install tabs, clipboard failure/race feedback, skip link, responsive mobile navigation and reduced-motion canvas resize are fixed. Browser regression checks pass at 320–1440 px.
- [x] SHA-pinned frontend CI passes on native Ubuntu 24.04, macOS 15 and Windows 2025 ([run 38466482868](https://github.com/props-nothing/jarvis-frontend/actions/runs/38466482868), `062d9fa`). This does not complete clean-machine installation testing.
- [x] Hosted at `https://www.jarvisd.dev/` on Vercel; apex redirects to `www`; canonical/social metadata, sitemap, security.txt and hardened response headers are deployed. Both installers are served as plain text.
- [x] Site, install box with OS-aware tabs, installers, docs (`ec6b616`).
- [x] AlmaLinux and RHEL-family hints, optional rustup install (`5373c61`).
- [x] Installer no longer starts the service before first-run setup; Ubuntu 24.04 end-to-end test recorded (`f4430b2`).
- [x] `curl | bash` path tested from a local static server on Ubuntu 24.04.
- [x] Real model test: Ollama + `qwen2.5:1.5b` on the Ubuntu server, a completed run in 26 s on one CPU.
- [x] Historical real console capture and approval-card alignment; the capture was retired by the 2026-10-13 redesign.
