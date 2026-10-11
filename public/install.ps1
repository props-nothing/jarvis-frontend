# JARVIS installer for Windows (PowerShell 5.1+).
#
# There is no public prebuilt download yet (no licence has been chosen), so this builds the single
# `jarvis` program from source and then runs `jarvis install`, which copies it to
# %LOCALAPPDATA%\Programs\JARVIS and puts it on your PATH. No administrator rights are needed and
# your settings and memory are never touched.
#
# Environment overrides: JARVIS_REPO, JARVIS_REF, JARVIS_SRC, JARVIS_SERVICE (set to 1 to also start at login; off by
# default because a service started before `jarvis init` runs without the console).
$ErrorActionPreference = 'Stop'

$Repo = if ($env:JARVIS_REPO) { $env:JARVIS_REPO } else { 'https://github.com/props-nothing/jarvisv2.git' }
$Ref = if ($env:JARVIS_REF) { $env:JARVIS_REF } else { 'main' }
$Src = if ($env:JARVIS_SRC) { $env:JARVIS_SRC } else { Join-Path $env:LOCALAPPDATA 'jarvisv2-src' }
$Service = if ($env:JARVIS_SERVICE) { $env:JARVIS_SERVICE } else { '0' }

function Say($m) { Write-Host "> $m" -ForegroundColor Cyan }
function Need($cmd, $hint) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "$cmd is required. $hint" }
}
function Run($exe, [string[]]$arguments) {
  & $exe @arguments
  if ($LASTEXITCODE -ne 0) { throw "$exe $($arguments -join ' ') failed with exit code $LASTEXITCODE" }
}

Need 'git' 'Install Git for Windows from https://git-scm.com/download/win and open a new terminal.'
Need 'cargo' 'Install Rust from https://rustup.rs (with the Visual Studio C++ Build Tools) and open a new terminal.'

if (Test-Path (Join-Path $Src '.git')) {
  Say "Updating source in $Src"
  Run git @('-C', $Src, 'fetch', '--quiet', 'origin', $Ref)
  Run git @('-C', $Src, 'checkout', '--quiet', 'FETCH_HEAD')
} else {
  Say "Cloning $Repo into $Src"
  Run git @('clone', '--quiet', $Repo, $Src)
  Run git @('-C', $Src, 'checkout', '--quiet', $Ref)
}

Say 'Building jarvis (first build takes a few minutes)'
Push-Location $Src
try { Run cargo @('build', '--release', '-p', 'jarvis-cli') } finally { Pop-Location }

$Bin = Join-Path $Src 'target\release\jarvis.exe'
if (-not (Test-Path $Bin)) { throw "Build finished but $Bin is missing." }

Say 'Installing for the current user'
if ($Service -eq '1') { Run $Bin @('install', '--service') } else { Run $Bin @('install') }

Write-Host ''
Write-Host 'JARVIS is installed. Open a new terminal and run: jarvis' -ForegroundColor Green
Write-Host '  It asks which model to use, starts in the background and opens the console.'
Write-Host '  Then, to start it at login: jarvis service install'
Write-Host '  Remove it again with: jarvis uninstall'
