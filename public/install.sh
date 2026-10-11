#!/usr/bin/env bash
# JARVIS installer for macOS and Linux.
#
# There is no public prebuilt download yet (no licence has been chosen), so this builds the single
# `jarvis` program from source and then runs `jarvis install`, which copies it to your own folder and
# puts it on your PATH. It needs no administrator rights and never touches your settings or memory.
#
# Environment overrides:
#   JARVIS_REPO     git URL to clone      (default: https://github.com/props-nothing/jarvisv2.git)
#   JARVIS_REF      branch, tag or commit (default: main)
#   JARVIS_SRC      where the source lives (default: ~/.local/src/jarvisv2)
#   JARVIS_SERVICE  set to 0 to skip starting at login (default: 1)
set -euo pipefail

REPO="${JARVIS_REPO:-https://github.com/props-nothing/jarvisv2.git}"
REF="${JARVIS_REF:-main}"
SRC="${JARVIS_SRC:-$HOME/.local/src/jarvisv2}"
SERVICE="${JARVIS_SERVICE:-1}"

say() { printf '\033[36m▸\033[0m %s\n' "$*"; }
die() { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "$1 is required. $2"; }

case "$(uname -s)" in
  Linux | Darwin) ;;
  *) die "This installer is for macOS and Linux. On Windows use install.ps1." ;;
esac

need git "Install it with your package manager (macOS: xcode-select --install)."
need cargo "Install Rust from https://rustup.rs and open a new terminal."
need cc "Install a C compiler (macOS: xcode-select --install; Debian/Ubuntu: apt install build-essential)."

if [ -d "$SRC/.git" ]; then
  say "Updating source in $SRC"
  git -C "$SRC" fetch --quiet origin "$REF" || die "Could not fetch $REF from $REPO."
  git -C "$SRC" checkout --quiet FETCH_HEAD
else
  say "Cloning $REPO into $SRC"
  mkdir -p "$(dirname "$SRC")"
  git clone --quiet "$REPO" "$SRC"
  git -C "$SRC" checkout --quiet "$REF" || die "Could not check out $REF."
fi

say "Building jarvis (first build takes a few minutes)"
(cd "$SRC" && cargo build --release -p jarvis-cli)

BIN="$SRC/target/release/jarvis"
[ -x "$BIN" ] || die "Build finished but $BIN is missing."

say "Installing for the current user"
if [ "$SERVICE" = "0" ]; then
  "$BIN" install
else
  "$BIN" install --service
fi

printf '\n\033[32m✓ JARVIS is installed.\033[0m Open a new terminal and run: jarvis\n'
printf '  It asks which model to use, starts in the background and opens the console.\n'
printf '  Remove it again with: jarvis uninstall\n'
