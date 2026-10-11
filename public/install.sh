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
#   JARVIS_INSTALL_RUST  set to 1 to install Rust with rustup when cargo is missing (default: 0)
set -euo pipefail

REPO="${JARVIS_REPO:-https://github.com/props-nothing/jarvisv2.git}"
REF="${JARVIS_REF:-main}"
SRC="${JARVIS_SRC:-$HOME/.local/src/jarvisv2}"
SERVICE="${JARVIS_SERVICE:-1}"

say() { printf '\033[36m▸\033[0m %s\n' "$*"; }
die() { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "$1 is required. $2"; }

# Suggest the right package command for this distribution.
pkg_hint() {
  if [ "$(uname -s)" = "Darwin" ]; then echo "xcode-select --install"
  elif command -v dnf >/dev/null 2>&1; then echo "sudo dnf install -y git gcc make"
  elif command -v apt-get >/dev/null 2>&1; then echo "sudo apt-get install -y git build-essential"
  elif command -v zypper >/dev/null 2>&1; then echo "sudo zypper install -y git gcc make"
  elif command -v pacman >/dev/null 2>&1; then echo "sudo pacman -S --needed git base-devel"
  else echo "install git and a C compiler with your package manager"
  fi
}

case "$(uname -s)" in
  Linux | Darwin) ;;
  *) die "This installer is for macOS and Linux. On Windows use install.ps1." ;;
esac

need git "Try: $(pkg_hint)"
need cc "Try: $(pkg_hint)"

# rustup puts cargo in ~/.cargo/bin, which a fresh shell may not have on PATH yet.
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"
if ! command -v cargo >/dev/null 2>&1; then
  if [ "${JARVIS_INSTALL_RUST:-0}" = "1" ]; then
    need curl "Try: $(pkg_hint)"
    say "Installing Rust with rustup (JARVIS_INSTALL_RUST=1)"
    curl --proto '=https' --tlsv1.2 -fsSL https://sh.rustup.rs | sh -s -- -y --profile minimal
    . "$HOME/.cargo/env"
  else
    die "cargo is required. Install Rust from https://rustup.rs, or re-run with JARVIS_INSTALL_RUST=1 to let this script do it."
  fi
fi

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
