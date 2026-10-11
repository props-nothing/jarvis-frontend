# JARVIS web

The public site and install page for [JARVIS](https://github.com/props-nothing/jarvisv2), the local-first personal AI operating system.
This folder is its own git repository, separate from the Rust platform repository it sits in.

- **Stack:** Vite, React 19, TypeScript, plain CSS. No runtime dependency except React. The hero head is a hand-written canvas animation.
- **Install commands:** the page shows `curl … | bash`, `irm … | iex` and a from-source tab. The commands use whichever host serves the site, and `public/install.sh` and `public/install.ps1` are served from the same host.
- **Honest by design:** there is no public prebuilt download and no licence yet, so the installers build from source and the page says so. See [docs/CONTENT-ACCURACY.md](docs/CONTENT-ACCURACY.md).

## Run

```text
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck and production build into dist/
npm run check:install  # static checks of the installer scripts
```

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
scripts/           check-install.mjs
src/content.ts     all copy that states a fact about JARVIS
src/config.ts      repository and documentation URLs
src/components/    Orb, InstallBox, Terminal, ApprovalDemo, Pipeline, Architecture
```

## Licence

None chosen yet, matching the JARVIS repository's status. Do not redistribute until the owner decides.
