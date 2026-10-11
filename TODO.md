# TODO

Ledger for the website repository. Owner decisions are marked **needs owner**. Core platform work lives in the main repository's `TODO.md`; items that belong there link to their ID.

## Next, in order

- [ ] **1. Host the site over HTTPS** (**needs owner**: domain or host). Static `dist/`. Serve `install.sh` and `install.ps1` as plain text with no SPA rewrite. Then run `curl -fsSL https://HOST/install.sh | head -n 3` and confirm it prints the shebang. See `docs/DEPLOY.md`.
- [ ] **2. Core: `jarvis stop|restart` and a service that owns the profile.** Found on Ubuntu 24.04; recorded under `P9-022` in the main `TODO.md` with a suggested fix. Not fixed by this repo's author, because the core is being changed by another agent. Until it lands the installers do not start the service by default.
- [ ] **3. Test AlmaLinux 10** (the dnf hint and the rustup path in `install.sh` are unrun on a real box), aarch64 Linux, macOS (`install.sh`) and a clean Windows machine (`install.ps1`). Ubuntu 24.04 x86_64 is done (`docs/DEPLOY.md`).
- [ ] **4. Test with a real model on a server** (install Ollama on the test server, run a chat, `doctor --live`).
- [ ] **5. Replace the illustrative terminal and the decorative head with real captures** of the console (screenshots or a short recording) once a model works.
- [ ] **6. Prebuilt downloads** (**needs owner**: licence; main `P9-004` to `P9-007`). Then switch both installers to download an archive and verify its SHA-256, add a version badge, and make a build-time call to the releases API.

## Polish

- [ ] Approval demo card has dead space between the buttons and the footnote on wide screens.
- [ ] Open Graph share image and a `/docs` page rendered from the main repository's `docs/user`.
- [ ] Make `check-install.mjs` also find Git Bash on Windows for `bash -n` (it skips when only the WSL stub exists).
- [ ] Re-verify every claim in `docs/CONTENT-ACCURACY.md` whenever the main repository's `README.md`, `ROADMAP.md` or `docs/user/platforms.md` changes.

## Done

- [x] Site, install box with OS-aware tabs, installers, docs (`ec6b616`).
- [x] AlmaLinux and RHEL-family hints, optional rustup install (`5373c61`).
- [x] Installer no longer starts the service before first-run setup; Ubuntu 24.04 end-to-end test recorded (`f4430b2`).
