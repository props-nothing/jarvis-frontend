#!/usr/bin/env bash
# Real archives/execution with explicit download/signature seams; never installs on the host.
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export INSTALLER=${INSTALLER:-$root/public/install.sh}
fixture=$(mktemp -d)
trap 'rm -rf -- "$fixture"' EXIT
export FIXTURE=$fixture TMPDIR=$fixture/tmp
mkdir -p "$TMPDIR" "$fixture/contents/jarvis-0.1.0-linux-x86_64"
cat > "$fixture/contents/jarvis-0.1.0-linux-x86_64/jarvis" <<'BIN'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$FIXTURE/calls"
case "$1" in
  version) printf 'jarvis-cli %s\n' "${FIXTURE_VERSION:-0.1.0}" ;;
  install)
    [ "${FIXTURE_FAIL_INSTALL:-0}" = 0 ] || exit 17
    [ "$2" = --dir ] && [ "$4" = --no-path ] || exit 18
    mkdir -p "$3"; cp "$0" "$3/jarvis" ;;
  *) exit 19 ;;
esac
BIN
tar -czf "$fixture/good.tar.gz" -C "$fixture/contents" jarvis-0.1.0-linux-x86_64
if command -v sha256sum >/dev/null; then hash=(sha256sum); else hash=(shasum -a 256); fi
sha=$("${hash[@]}" "$fixture/good.tar.gz"); sha=${sha%% *}
tag=ci-a176e79843a22eae2802d97aafba74a0bf6e282f
{
  printf 'JARVIS-RELEASE-1\nrepository=props-nothing/jarvis-core\ntag=%s\ncommit=%s\nversion=0.1.0\n' "$tag" "${tag#ci-}"
  for label in linux-x86_64 linux-aarch64 macos-aarch64 macos-x86_64 windows-x86_64; do
    ext=tar.gz; [ "$label" != windows-x86_64 ] || ext=zip
    printf '%s\tjarvis-0.1.0-%s.%s\t%s\t%s\n' "$label" "$label" "$ext" "$(wc -c < "$fixture/good.tar.gz" | tr -d ' ')" "$sha"
  done
} > "$fixture/good.manifest"
cp "$fixture/good.manifest" "$fixture/manifest"
cat > "$fixture/run.sh" <<'RUN'
source "$INSTALLER"
original_verify=$(declare -f verify_release_signature)
eval "${original_verify/verify_release_signature/real_verify_release_signature}"
verify_release_signature() {
  [ "${FIXTURE_VERIFY_PIN:-0}" != 1 ] || { real_verify_release_signature "$@"; return; }
  printf 'verify\n' >> "$FIXTURE/verified"
  [ "${FIXTURE_FAIL_SIGNATURE:-0}" = 0 ] || die 'fixture signature refused'
}
uname() { if [ "$1" = -s ]; then printf Linux; else printf '%s' "${FIXTURE_ARCH:-x86_64}"; fi; }
download() {
  printf '%s\n' "$1" >> "$FIXTURE/downloads"
  [ "${FIXTURE_FAIL_DOWNLOAD:-0}" = 0 ] || die 'fixture download failed'
  case "$1" in
    */release-manifest.txt) cp "$FIXTURE/manifest" "$2" ;;
    */release-manifest.sigstore.json) printf bundle > "$2" ;;
    */cosign-*) printf untrusted > "$2" ;;
    *) cp "$FIXTURE/good.tar.gz" "$2" ;;
  esac
}
main --dir "$FIXTURE/install here" --no-path "$@"
RUN
run() { bash "$fixture/run.sh" "$@" > "$fixture/output" 2>&1; }
reset_case() { rm -rf "$fixture/install here" "$fixture/calls" "$fixture/downloads" "$fixture/verified"; cp "$fixture/good.manifest" "$fixture/manifest"; }
refused() {
  if run; then cat "$fixture/output"; echo "expected refusal: $1" >&2; exit 1; fi
  grep -qi "$1" "$fixture/output" || { cat "$fixture/output"; exit 1; }
  [ ! -e "$fixture/install here/jarvis" ]
  ! grep -q 'JARVIS is installed' "$fixture/output"
  [ -z "$(ls -A "$TMPDIR")" ]
}
run
[ -f "$fixture/install here/jarvis" ] && [ -f "$fixture/verified" ]
[ "$(wc -l < "$fixture/calls")" -eq 2 ]
grep -q -- '--voice-key-file ABSOLUTE_VOICE_KEY_FILE' "$fixture/output"
grep -q "$tag/jarvis-0.1.0-linux-x86_64.tar.gz" "$fixture/downloads"
if run; then echo 'existing installation replaced' >&2; exit 1; fi
[ "$(wc -l < "$fixture/downloads")" -eq 3 ]
cmp "$fixture/contents/jarvis-0.1.0-linux-x86_64/jarvis" "$fixture/install here/jarvis"
reset_case
export FIXTURE_FAIL_SIGNATURE=1; refused 'signature refused'; unset FIXTURE_FAIL_SIGNATURE
[ ! -e "$fixture/calls" ] && [ "$(wc -l < "$fixture/downloads")" -eq 2 ]
reset_case
export FIXTURE_VERIFY_PIN=1; refused 'verifier checksum mismatch'; unset FIXTURE_VERIFY_PIN
[ ! -e "$fixture/calls" ]
for substitution in 's/repository=props-nothing/repository=foreign/' 's/commit=a/commit=b/' 's/version=0.1.0/version=9.9.9/' 's/tag=ci-a/tag=ci-b/' 's/linux-x86_64/linux-unknown/g'; do
  reset_case; sed "$substitution" "$fixture/good.manifest" > "$fixture/manifest"
  refused manifest; [ ! -e "$fixture/calls" ] && [ "$(wc -l < "$fixture/downloads")" -eq 2 ]
done
reset_case
sed "s/$sha/0000000000000000000000000000000000000000000000000000000000000000/g" "$fixture/good.manifest" > "$fixture/manifest"
refused 'SHA-256 mismatch'; [ ! -e "$fixture/calls" ]
reset_case
export FIXTURE_FAIL_DOWNLOAD=1; refused 'download failed'; unset FIXTURE_FAIL_DOWNLOAD
[ ! -e "$fixture/calls" ]
reset_case
export FIXTURE_VERSION=9.9.9; refused 'version does not match'; unset FIXTURE_VERSION
[ "$(wc -l < "$fixture/calls")" -eq 1 ]
reset_case
export FIXTURE_FAIL_INSTALL=1; refused 'Installation failed'; unset FIXTURE_FAIL_INSTALL
reset_case
export JARVIS_REF=main; refused 'old source installer'; unset JARVIS_REF
[ ! -e "$fixture/downloads" ]
if run "$sha"; then echo 'unsigned override accepted' >&2; exit 1; fi
grep -q 'Unknown option' "$fixture/output"
reset_case
export FIXTURE_ARCH=riscv64; refused 'Unsupported platform'; unset FIXTURE_ARCH
[ ! -e "$fixture/downloads" ]
# Exercise the unmodified downloaded text through stdin. Existing-install refusal
# proves the entry point ran without network or modifying PATH/profile files.
mkdir -p "$fixture/home/.local/share/jarvis"
printf keep > "$fixture/home/.local/share/jarvis/jarvis"
if HOME="$fixture/home" bash < "$INSTALLER" > "$fixture/output" 2>&1; then echo 'stdin entry did not refuse existing install' >&2; exit 1; fi
grep -q 'already exists' "$fixture/output"
[ "$(cat "$fixture/home/.local/share/jarvis/jarvis")" = keep ]
echo 'Signed Bash website fixtures passed.'
