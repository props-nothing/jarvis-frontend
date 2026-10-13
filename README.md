# JARVIS web

The public site and install page for [JARVIS](https://github.com/props-nothing/jarvis-core), the local-first personal AI operating system. Live at [jarvisd.dev](https://www.jarvisd.dev/).
This folder is its own git repository, separate from the Rust platform repository it sits in.

- **Stack:** Vite, React 19, TypeScript, plain CSS, named Lucide icons and a lazy Three.js face scene. The mask uses the same official canonical geometry as the JARVIS HUD, with a static canvas fallback. No external asset requests or model connection.
- **Install commands:** the page shows `curl … | bash`, `irm … | iex` and a from-source tab. The commands use whichever host serves the site, and `public/install.sh` and `public/install.ps1` are served from the same host.
- **Honest by design:** there is no public prebuilt download and no licence yet, so the installers build from source and the page says so. See [docs/CONTENT-ACCURACY.md](docs/CONTENT-ACCURACY.md).

## Run

Use Node.js 24 or newer. Installer validation also needs Bash (Git Bash on Windows) and PowerShell (`pwsh` on Linux/macOS, Windows PowerShell 5.1 on Windows). Missing interpreters fail checks rather than silently skipping them; `JARVIS_BASH` and `JARVIS_POWERSHELL` can select explicit executable paths.

```text
npm ci
npm run dev            # http://localhost:5173
npm run build          # typecheck and production build into dist/
npm run check:install  # parse both installers without executing them
npm test               # offline real-Git regressions; no Rust build or service install
```

[Frontend checks](.github/workflows/checks.yml) run on native Ubuntu, macOS and Windows runners. The tests use disposable repositories, a stand-in build command and an inert test executable; they do not claim a clean-machine JARVIS install on every OS.

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
scripts/           installer contract and shell-discovery checks
tests/             built-in Node regression tests
src/installCommands.ts   platform-aware clone and install commands
src/content.ts     all copy that states a fact about JARVIS
src/config.ts      repository and documentation URLs
src/assets/        pinned canonical face geometry (Apache-2.0)
src/components/    JarvisMask, InstallBox, Terminal, ApprovalDemo, Pipeline, Architecture
public/licenses/   third-party attribution and license texts
```

## Licence

None chosen yet, matching the JARVIS repository's status. Do not redistribute until the owner decides.
