# JARVIS web

The public site and install page for [JARVIS](https://github.com/props-nothing/jarvis-core), the local-first personal AI operating system. Live at [jarvisd.dev](https://www.jarvisd.dev/).
This folder is its own git repository, separate from the Rust platform repository it sits in.

- **Stack:** Vite, React 19, TypeScript, plain CSS, named Lucide icons and a lazy Three.js face scene. The mask uses the same official canonical geometry as the JARVIS HUD, with a static canvas fallback. A self-hosted, lazily loaded film shows one request across every capability, rendered from the console's own face and mission-view code and labelled as a visualization. No external asset requests or model connection.
- **Install commands:** the page shows `curl … | bash`, `irm … | iex` and a from-source tab. The commands use whichever host serves the site, and `public/install.sh` and `public/install.ps1` are served from the same host.
- **Honest by design:** original platform and website code are Apache-2.0 licensed. The [public unsigned lifecycle prerelease](https://github.com/props-nothing/jarvis-core/releases/tag/ci-dd65479d988ebf7caa9bddfb803c13cae1b0ddbf) has verified archives and checksums; a generated dependency-license inventory, signing/notarization and clean-machine checks remain gates. Website installers still build from source. See [docs/CONTENT-ACCURACY.md](docs/CONTENT-ACCURACY.md).

## Run

Use Node.js 24 or newer. Installer validation also needs Bash (Git Bash on Windows) and PowerShell (`pwsh` on Linux/macOS, Windows PowerShell 5.1 on Windows). Missing interpreters fail checks rather than silently skipping them; `JARVIS_BASH` and `JARVIS_POWERSHELL` can select explicit executable paths.

```text
npm ci
npm run dev            # http://localhost:5173
npm run build          # typecheck and production build into dist/
npm run check:install  # parse both installers without executing them
npm test               # offline real-Git regressions; no Rust build or service install
```

[Frontend checks](.github/workflows/checks.yml) run on native Ubuntu, macOS and Windows runners. The tests use disposable repositories inside this folder, a stand-in build command and an inert test executable; they do not claim a clean-machine JARVIS install on every OS.

## Source install prerequisites

All three install tabs build from source with the checkout's pinned Rust toolchain and `Cargo.lock` (`--locked`), then run `jarvis install`. Git and Rust via rustup are needed to build, not to run the installed executable. Native tools are Xcode command-line tools on macOS, `build-essential` on Ubuntu, or Visual Studio C++ Build Tools plus a Windows SDK on Windows. See the [platform prerequisite commands](https://github.com/props-nothing/jarvis-core/blob/main/docs/development/getting-started.md#build-from-source) and [research evidence](https://github.com/props-nothing/jarvis-core/blob/main/docs/research/integrations/source-install-prerequisites.md).

Scripts refuse dirty or foreign source checkouts and never install system packages. The existing Bash `JARVIS_INSTALL_RUST=1` override explicitly opts into per-user rustup installation; it is off by default. Services are also off by default. A normal Windows terminal may use Visual Studio discovery instead of having `cl` on PATH; Cargo remains the definitive SDK/linker check.

Setup is not run inside the installer. In a new terminal run `jarvis`, choose a model, supply the required ElevenLabs API key privately and grant only the folders you choose. Piped/scripted installs print explicit `jarvis init` instructions using absolute key-file paths, followed by `jarvis start` and `jarvis doctor --live` only after setup succeeds. Do not put key values in command arguments. No published signed binary download or clean-machine platform verification is implied.

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
src/content.ts     all copy that states a fact about JARVIS
src/config.ts      repository and documentation URLs
src/assets/        pinned canonical face geometry (Apache-2.0)
src/components/    JarvisMask, Film, InstallBox, Terminal, ApprovalDemo, Pipeline, Architecture
public/licenses/   third-party attribution and license texts
```

## Licence

Original website code and documentation are open source under the [Apache License 2.0](LICENSE), matching the platform. Commercial use, modification and redistribution are permitted subject to its terms. Preserve [NOTICE](NOTICE) and the licenses in [public/licenses/](public/licenses/). React/React DOM/Scheduler, Three.js, Lucide and MediaPipe retain their respective licenses. No rights to the former CC BY-NC 4.0 Python prototype are granted.
