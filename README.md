# JARVIS web

The public site and install page for [JARVIS](https://github.com/props-nothing/jarvis-core), the local-first personal AI operating system. Live at [jarvisd.dev](https://www.jarvisd.dev/).
This folder is its own git repository, separate from the Rust platform repository it sits in.

- **Stack:** Vite, React 19, TypeScript, plain CSS, named Lucide icons and a lazy Three.js face scene. The mask uses the same official canonical geometry as the JARVIS HUD, with a static canvas fallback. A self-hosted, lazily loaded film shows one request across every capability, rendered from the console's own face and mission-view code and labelled as a visualization. No external asset requests or model connection.
- **Install commands:** the page shows `curl … | bash`, `irm … | iex` and a from-source tab. The commands use whichever host serves the site, and `public/install.sh` and `public/install.ps1` are served from the same host.
- **Signed default:** both website scripts pin public prerelease `ci-a176e79843a22eae2802d97aafba74a0bf6e282f` (0.1.0), verify its publisher signature and archive hash, and install without Git, Rust, Node or Python. All seven native website jobs passed before production deployment; hosted installer bytes and headers are verified in [the deployment record](docs/DEPLOY.md#signed-default-revision-2026-10-18). Native OS signing/notarization, complete notices/SBOM and clean-machine acceptance remain separate. See [the installer contract](docs/research/integrations/signed-install.md).

## Run

Use Node.js 24 or newer. Installer validation also needs Bash (Git Bash on Windows) and PowerShell (`pwsh` on Linux/macOS, Windows PowerShell 5.1 on Windows). Missing interpreters fail checks rather than silently skipping them; `JARVIS_BASH` and `JARVIS_POWERSHELL` can select explicit executable paths.

```text
npm ci
npm run dev            # http://localhost:5173
npm run build          # typecheck and production build into dist/
npm run check:pages    # production URLs, metadata, assets, 404 and installer bytes
npm run generate:pages # after editing the public page catalog
npm run check:install  # parse both installers without executing them
npm test               # offline signed-installer/archive fixtures; no host installation
npm run test:install:live # real public release, isolated install/profile and restricted PATH
```

[Frontend checks](.github/workflows/checks.yml) run syntax, fixture tests and builds on native Ubuntu, macOS and Windows. A separate four-platform job runs the pinned public installer on Windows x86_64, macOS ARM64 and Linux x86_64/ARM64 with developer tools hidden from PATH. Hosted checks are not clean-machine or live-provider onboarding acceptance.

## Public pages

Home keeps the animated face, a compact tabbed one-line installer, three practical use cases and a film that loads only after an explicit play action. The quick installer has no explanation text; source installation and setup guidance live on Install. Product, Integrations, How it works, Install and Roadmap have their own URLs and reading layouts. Docs links to the core documentation.

Inner pages use compact headings and short summaries. Install leads with the command; requirements, platform support and advanced options expand on request. Product limits, integration setup, policy/architecture inspectors and roadmap evidence remain in native keyboard-accessible disclosures.

The six HTML documents and sitemap are generated from `src/site.ts`. Each document loads its own React entry from `src/entries/`; only home imports the face. Vite uses MPA mode and Vercel's existing clean URLs. Direct loads and refreshes work without a catch-all rewrite. Historical homepage section links redirect to the relevant page, including architecture/trust fragments. Run `npm run generate:pages` after changing metadata; builds reject stale generated files.

## Installation contract

Default tabs download a fixed signed prerelease with curl >=8.4 and native OS utilities. No source checkout, compiler, runtime SDK, administrator elevation, setup prompts or service startup is involved. Signature, publisher identity, manifest selectors and archive bytes are checked before execution. An existing installation is refused without replacing it; use the [core update guide](https://github.com/props-nothing/jarvis-core/blob/main/docs/operations/binary-update.md) to update.

Download/review the script to use Bash `--dir ABSOLUTE_DIR --no-path` or PowerShell `-Dir ABSOLUTE_DIR -NoPath`. There is no unsigned mode or mutable latest release. Legacy `JARVIS_REPO`, `JARVIS_REF`, `JARVIS_SRC`, `JARVIS_SERVICE` and `JARVIS_INSTALL_RUST` overrides are refused; unset them for signed installation or use From source. Maintainers update both script pins and `scripts/installer-release.json` together, then run the native/public acceptance jobs before deployment.

Only the From source tab requires Git, Rust via rustup and native build tools. It builds the checkout with Cargo.lock (`--locked`) and invokes the per-user installer.

Setup remains separate. Open a new terminal, run `jarvis`, choose a model, supply the required ElevenLabs key privately and grant folders. The bootstrap prints a noninteractive key-file example; start the daemon and run `doctor --live` only after setup succeeds. Installation success alone is not provider acceptance.

## Docs

| Document | What it covers |
| --- | --- |
| [TODO.md](TODO.md) | What is next, what is blocked on the owner, what is done |
| [docs/PROJECT-REVIEW.md](docs/PROJECT-REVIEW.md) | What JARVIS is, what works today, who the site speaks to |
| [docs/PLAN.md](docs/PLAN.md) | Goals, page structure, install strategy, milestones |
| [docs/DESIGN.md](docs/DESIGN.md) | Visual language, motion, accessibility, performance |
| [docs/CONTENT-ACCURACY.md](docs/CONTENT-ACCURACY.md) | Where each claim comes from, and what must change when JARVIS changes |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Hosting the site and the installer scripts |

## Layout

```text
public/            install.sh, install.ps1, favicon
public/media/      the capability film (1080p, 720p) and its poster
scripts/           installer contract and shell-discovery checks
tests/             built-in Node regression tests
src/installCommands.ts   platform-aware clone and install commands
src/content.ts     capability, roadmap, platform and film evidence
src/site.ts        public page catalog and historical anchor destinations
src/entries/       separate entry points for the six HTML documents
src/pages/         Home, Product, Integrations, HowItWorks, Install, Roadmap
src/config.ts      repository and documentation URLs
src/assets/        pinned canonical face geometry (Apache-2.0)
src/components/    shared navigation/sections, JarvisMask, Film, InstallBox, Pipeline, Architecture
public/licenses/   third-party attribution and license texts
```

## Licence

Original website code and documentation are open source under the [Apache License 2.0](LICENSE), matching the platform. Commercial use, modification and redistribution are permitted subject to its terms. Preserve [NOTICE](NOTICE) and the licenses in [public/licenses/](public/licenses/). React/React DOM/Scheduler, Three.js, Lucide and MediaPipe retain their respective licenses. No rights to the former CC BY-NC 4.0 Python prototype are granted.
