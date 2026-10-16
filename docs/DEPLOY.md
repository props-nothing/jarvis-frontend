# Deploy

The production site is **https://www.jarvisd.dev/** on Vercel. The apex `https://jarvisd.dev/` redirects permanently to `www`. Vercel DNS uses `ns1.vercel-dns.com` and `ns2.vercel-dns.com`; the GitHub repository is connected so a push to `main` deploys production.

The output is static: `npm run build` writes `dist/`, which includes `install.sh` and `install.ps1` copied from `public/`. `vercel.json` forces both installers to `text/plain; charset=utf-8`, prevents MIME sniffing, and adds security headers to all responses.

## Requirements

- Serve over HTTPS. The install commands embed the page's own origin, so `curl … | bash` is only as safe as the transport.
- Serve `install.sh` as `text/plain` or `text/x-shellscript` and `install.ps1` as `text/plain`, with no HTML fallback for those two paths. A single-page-app rewrite must not catch them.
- Keep `.sh` files LF (`.gitattributes` enforces it). A CRLF script fails under bash.

## Before publishing

```text
npm run build
npm run check:install
npm test
curl -fsSL https://YOUR-HOST/install.sh | head -n 3     # must print the bash shebang, not HTML
```

Ubuntu 24.04 has been run end to end (see below). Still to do: AlmaLinux, macOS and Windows clean-machine runs, and `install.sh` through `curl | bash` from the hosted site.

## Server test findings (Ubuntu 24.04.5, 1 vCPU, 4 GB, fresh non-root user, 2026-10-11)

These are the observations from the dated source-install run, retained unchanged below. Later setup policy requires an ElevenLabs TTS key/test for new profiles; this earlier run does not prove that new onboarding flow. Track current core lifecycle repairs and remaining clean-machine acceptance in the [core backlog](https://github.com/props-nothing/jarvis-core/blob/main/TODO.md), rather than inferring current failures from this historical run.

Run end to end with `JARVIS_INSTALL_RUST=1 bash install.sh`:

| Step | Result |
| --- | --- |
| Prerequisites | Needed `build-essential` first; `git` and `curl` were present. The script's hint names the right command |
| rustup install | Worked (Rust 1.99.0 stable; the repo's `rust-toolchain.toml` pins 1.98.1 and rustup fetches it as needed) |
| Clone and `cargo build --release -p jarvis-cli` | Worked, 10 min 41 s on 1 vCPU. A rebuild is seconds |
| `jarvis install` | Installed to `~/.local/share/jarvis`, linked in `~/.local/bin` |
| `jarvis init`, `start`, `service install` | `init` and `start` worked and the console answers HTTP 200 on `127.0.0.1:8765`. `service install` while a `jarvis start` daemon was running did **not** work cleanly: see finding 4 |
| SSH tunnel from another computer | Console reached through `ssh -L`. The port was not reachable from outside |
| `jarvis doctor --live` | Ran. Reported the model unreachable, which is correct: no model server was installed |

Findings that changed the installer:

1. **`install --service` before `init` leaves a broken daemon.** The unit started with no configuration (`http_port=0`), and `jarvis restart` then failed with "another jarvisd process already owns this profile". The installer no longer starts the service by default (`JARVIS_SERVICE=1` opts in), and tells the user to run `jarvis stop` and then `jarvis service install` after the first run. Recommended fix in the platform repository: `jarvis restart` should defer to the systemd, launchd or Run-entry owner, and a service started without configuration should not be left running.
2. A non-interactive `su -` has no user systemd bus, so `systemctl --user` fails there. A real SSH login works.
3. `~/.local/bin` is on the PATH only from the next login.
4. **`service install` while a `jarvis start` daemon is running leaves the unit crash-looping.** The singleton refuses the second daemon every 3 seconds (1972 restarts after about two hours) while the manual daemon keeps serving. `jarvis stop` lets systemd take over, which then worked: console 200, doctor ok. My first test reported "one active daemon" because I looked at the wrong moment; this entry replaces that claim. Logged for the core as part of `P9-022`.
5. With the local Ollama (`ollama pull qwen2.5:1.5b`), `jarvis init` with no `--base-url` finds it; passing `--base-url http://localhost:11434/v1` is treated as a hosted provider and demands `--api-key-file`. `jarvis ask` then completed a real run in 26 s on one CPU.

Not tested: `jarvis hud` with a display, AlmaLinux, aarch64, macOS, Windows.

## Safe reruns and the repository rename

The source repository is now `https://github.com/props-nothing/jarvis-core`. Fresh installs clone to `~/.local/src/jarvis-core` (Unix) or `%LOCALAPPDATA%\jarvis-core-src` (Windows). Existing installations and their memory/configuration are not deleted or moved. To reuse an older source directory, set `JARVIS_SRC` explicitly. The previous official HTTPS Git origin is accepted as an alias, but the installer fetches the configured new URL without rewriting your origin.

On a rerun both scripts refuse staged, unstaged or untracked source changes, a mismatched origin, or an existing non-Git directory before fetching/building. Save your changes or choose another source directory. Ignored build outputs are allowed. Branches, tags and commits are fetched explicitly and built from detached `FETCH_HEAD`; a failed fetch never builds a stale checkout. Only `0` and `1` are valid opt-in flags.

`npm test` exercises these contracts with real Git and disposable build/install fixtures on Windows (including both shells); CI additionally checks native macOS/Ubuntu. This is separate from the full Rust build/service evidence above. Bash discovery prefers working Git Bash over the Windows WSL stub, and both shell syntax checks are mandatory.

## Website validation (2026-10-13)

- `npm run check:install`: both real shell parsers passed, with no skipped interpreter.
- `npm test`: 21 Windows-local tests passed, including native PowerShell fixtures, Git Bash, the repository rename and destructive-update refusal.
- `npm run build`: passed.
- [Native CI run 38466482868](https://github.com/props-nothing/jarvis-frontend/actions/runs/38466482868): Ubuntu 24.04, Windows 2025 and macOS 15 all passed the same checks/build (PowerShell installer execution fixtures run only on Windows).
- Browser checks against both the local build and `https://www.jarvisd.dev/`: keyboard tabs/focus, unique panels, successful/denied/stale clipboard requests, mobile menu/Escape/link close, 320/390/768/1024/1440 px without horizontal overflow, and reduced-motion canvas resize. No page or console errors observed.
- Production `install.sh` contains the new repository and guards, uses LF line endings, and is served as actual script text. Download verification does not execute the production installer on this workstation.

## Pinning a release

`JARVIS_REF` selects a branch, tag or commit and defaults to `main`. `JARVIS_INSTALL_RUST=1` lets `install.sh` install Rust with rustup when `cargo` is missing (for example on a fresh AlmaLinux or other RHEL-family server); otherwise it stops and says what to install. Missing `git` or a C compiler produces the matching `dnf`, `apt-get`, `zypper` or `pacman` command as a hint; the script never runs `sudo` itself.

Verified 2026-10-16: [c48 is a public unsigned prerelease](https://github.com/props-nothing/jarvis-core/releases/tag/ci-c48da8880e20304da4b13e4016d896ad22fc2e04). Its native CI, five package jobs, exact tag target and all ten public assets/checksums passed verification; Intel macOS was cross-built without a runtime smoke. This is separate from the historical source-install and browser evidence above. A generated dependency-license inventory, signing/notarization and clean-machine checks remain distribution gates. Both website scripts continue to build from source with `JARVIS_REF=main`; archive installation and any default-version change require their own accepted implementation.
