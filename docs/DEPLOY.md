# Deploy

The output is static: `npm run build` writes `dist/`, which includes `install.sh` and `install.ps1` copied from `public/`.

Any static host works (Cloudflare Pages, Netlify, GitHub Pages, S3 + CDN, nginx).

## Requirements

- Serve over HTTPS. The install commands embed the page's own origin, so `curl … | bash` is only as safe as the transport.
- Serve `install.sh` as `text/plain` or `text/x-shellscript` and `install.ps1` as `text/plain`, with no HTML fallback for those two paths. A single-page-app rewrite must not catch them.
- Keep `.sh` files LF (`.gitattributes` enforces it). A CRLF script fails under bash.

## Before publishing

```text
npm run build
npm run check:install
curl -fsSL https://YOUR-HOST/install.sh | head -n 3     # must print the bash shebang, not HTML
```

Ubuntu 24.04 has been run end to end (see below). Still to do: AlmaLinux, macOS and Windows clean-machine runs, and `install.sh` through `curl | bash` from the hosted site.

## Server test findings (Ubuntu 24.04.5, 1 vCPU, 4 GB, fresh non-root user, 2026-10-11)

Run end to end with `JARVIS_INSTALL_RUST=1 bash install.sh`:

| Step | Result |
| --- | --- |
| Prerequisites | Needed `build-essential` first; `git` and `curl` were present. The script's hint names the right command |
| rustup install | Worked (Rust 1.99.0 stable; the repo's `rust-toolchain.toml` pins 1.98.1 and rustup fetches it as needed) |
| Clone and `cargo build --release -p jarvis-cli` | Worked, 10 min 41 s on 1 vCPU. A rebuild is seconds |
| `jarvis install` | Installed to `~/.local/share/jarvis`, linked in `~/.local/bin` |
| `jarvis init`, `start`, `service install` | Worked. One daemon, systemd user unit active, lingering enabled, console answers HTTP 200 on `127.0.0.1:8765` |
| SSH tunnel from another computer | Console reached through `ssh -L`. The port was not reachable from outside |
| `jarvis doctor --live` | Ran. Reported the model unreachable, which is correct: no model server was installed |

Findings that changed the installer:

1. **`install --service` before `init` leaves a broken daemon.** The unit started with no configuration (`http_port=0`), and `jarvis restart` then failed with "another jarvisd process already owns this profile". The installer no longer starts the service by default (`JARVIS_SERVICE=1` opts in), and tells the user to run `jarvis service install` after the first run. Running `jarvis start` and then `jarvis service install` was verified to adopt a single daemon. Recommended fix in the platform repository: `jarvis restart` should defer to the systemd, launchd or Run-entry owner, and a service started without configuration should not be left running.
2. A non-interactive `su -` has no user systemd bus, so `systemctl --user` fails there. A real SSH login works.
3. `~/.local/bin` is on the PATH only from the next login.

Not tested: an actual model (no Ollama on the server), `jarvis hud` with a display, AlmaLinux, macOS, Windows.

## Pinning a release

`JARVIS_REF` selects a branch, tag or commit and defaults to `main`. `JARVIS_INSTALL_RUST=1` lets `install.sh` install Rust with rustup when `cargo` is missing (for example on a fresh AlmaLinux or other RHEL-family server); otherwise it stops and says what to install. Missing `git` or a C compiler produces the matching `dnf`, `apt-get`, `zypper` or `pacman` command as a hint; the script never runs `sudo` itself. Once tagged releases exist, change the default to the latest tag and, when prebuilt archives are public, switch the scripts to download and verify the SHA-256 instead of building.
