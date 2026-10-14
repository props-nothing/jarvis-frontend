# JARVIS installer for Windows (PowerShell 5.1+).
#
# There is no public signed binary download. This builds the single `jarvis` program from source
# and then runs `jarvis install`, which copies it to %LOCALAPPDATA%\Programs\JARVIS and sets PATH.
# Rust and C++ build tools are source-only requirements, not requirements to run the installed
# program. Per-user install needs no administrator rights and leaves settings and memory alone.
# Setup is separate: never prompt for keys through this installer's piped stdin.
#
# Environment overrides: JARVIS_REPO, JARVIS_REF, JARVIS_SRC, JARVIS_SERVICE (set to 1 to also start at login; off by
# default because a service started before `jarvis init` runs without the console).
$ErrorActionPreference = 'Stop'

$Repo = if ($env:JARVIS_REPO) { $env:JARVIS_REPO } else { 'https://github.com/props-nothing/jarvis-core.git' }
$Ref = if ($env:JARVIS_REF) { $env:JARVIS_REF } else { 'main' }
$Src = if ($env:JARVIS_SRC) { $env:JARVIS_SRC } else { Join-Path $env:LOCALAPPDATA 'jarvis-core-src' }
$Service = if ($env:JARVIS_SERVICE) { $env:JARVIS_SERVICE } else { '0' }

function CanonicalRepo($url) {
  $url = $url.TrimEnd('/')
  if ($url -ceq 'https://github.com/props-nothing/jarvisv2.git') { return 'https://github.com/props-nothing/jarvis-core.git' }
  return $url
}

function Say($m) { Write-Host "> $m" -ForegroundColor Cyan }
function Need($cmd, $hint) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "$cmd is required. $hint" }
}
function Run($exe, [string[]]$arguments) {
  & $exe @arguments
  if ($LASTEXITCODE -ne 0) { throw "$exe $($arguments -join ' ') failed with exit code $LASTEXITCODE" }
}

if ([Environment]::OSVersion.Platform -ne [PlatformID]::Win32NT) { throw 'This installer is for Windows. On macOS/Linux use install.sh.' }
if ($Service -notin @('0', '1')) { throw 'JARVIS_SERVICE must be 0 or 1.' }
if ($Ref.StartsWith('-')) { throw 'JARVIS_REF must be a branch, tag or commit, not an option.' }

Need 'git' 'Install Git for Windows from https://git-scm.com/download/win and open a new terminal.'

$IsCheckout = Test-Path -LiteralPath (Join-Path $Src '.git')
if ($IsCheckout) {
  $Origin = (Run git @('-C', $Src, 'remote', 'get-url', 'origin')) -join "`n"
  if ((CanonicalRepo $Origin) -cne (CanonicalRepo $Repo)) {
    throw 'Source origin does not match JARVIS_REPO. Choose another JARVIS_SRC; nothing was changed.'
  }
  $Changes = @(Run git @('-C', $Src, 'status', '--porcelain=v1', '--untracked-files=all', '--ignore-submodules=none'))
  if ($Changes.Count -gt 0) {
    throw 'Source has local changes. Save them or choose another JARVIS_SRC; nothing was changed.'
  }
} elseif (Test-Path -LiteralPath $Src) {
  throw 'JARVIS_SRC already exists but is not a Git checkout. Choose another directory; nothing was changed.'
}

Say 'Source install: Rust via rustup and native build tools are required only to build JARVIS.'
$RustHint = 'Install Rust via https://rustup.rs and open a new terminal. The checkout selects its pinned toolchain; an installed JARVIS needs no Rust.'
$BuildToolsHint = 'Install Visual Studio C++ Build Tools with Desktop development with C++ and a Windows SDK, then open a new terminal. See https://rust-lang.github.io/rustup/installation/windows-msvc.html'
Need 'cargo' $RustHint
Need 'rustup' $RustHint

# Ordinary PowerShell need not have cl on PATH; Cargo can discover an installed VS toolchain.
if (-not (Get-Command cl -CommandType Application -ErrorAction SilentlyContinue)) {
  $VsWhere = if (${env:ProgramFiles(x86)}) { Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe' } else { $null }
  $VsInstall = @()
  if ($VsWhere -and (Test-Path -LiteralPath $VsWhere)) {
    $VsInstall = @(Run $VsWhere @('-latest', '-products', '*', '-requires', 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64', '-property', 'installationPath'))
  }
  if ($VsInstall.Count -eq 0) { throw "Windows C++ build tools were not found. $BuildToolsHint" }
}

if ($IsCheckout) {
  Say "Updating source in $Src"
} else {
  Say "Cloning $Repo into $Src"
  Run git @('clone', '--quiet', '--', $Repo, $Src)
}
Run git @('-C', $Src, 'fetch', '--quiet', $Repo, $Ref)
Run git @('-C', $Src, 'checkout', '--quiet', '--detach', 'FETCH_HEAD')

Say "Building jarvis with the checkout's pinned Rust toolchain and Cargo.lock (first build takes a few minutes)"
Push-Location $Src
try { Run cargo @('build', '--release', '-p', 'jarvis-cli', '--locked') }
catch { throw "Source build failed; installation and setup were not run. $BuildToolsHint Check Rust/network access and Cargo.lock; do not remove --locked. $($_.Exception.Message)" }
finally { Pop-Location }

$Bin = Join-Path $Src 'target\release\jarvis.exe'
if (-not (Test-Path $Bin)) { throw "Build finished but $Bin is missing." }

Say 'Installing for the current user'
if ($Service -eq '1') { Run $Bin @('install', '--service') } else { Run $Bin @('install') }

Write-Host ''
Write-Host 'JARVIS is installed. Setup has not run. Open a new terminal and run: jarvis' -ForegroundColor Green
Write-Host '  New setup chooses a model, requires your ElevenLabs API key and asks which folders to grant.'
Write-Host '  Without prompts: jarvis init --base-url URL --model NAME --api-key-file ABSOLUTE_MODEL_KEY_FILE --voice-key-file ABSOLUTE_VOICE_KEY_FILE'
Write-Host '  Use private key files, or a privately supplied ELEVENLABS_API_KEY with --elevenlabs; never put the key value in arguments.'
Write-Host '  Only after setup succeeds: jarvis start; jarvis doctor --live'
Write-Host '  Then, to start it at login: jarvis stop; jarvis service install'
Write-Host '  Remove it again with: jarvis uninstall'
