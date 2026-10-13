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

Need 'cargo' 'Install Rust from https://rustup.rs (with the Visual Studio C++ Build Tools) and open a new terminal.'

if ($IsCheckout) {
  Say "Updating source in $Src"
} else {
  Say "Cloning $Repo into $Src"
  Run git @('clone', '--quiet', '--', $Repo, $Src)
}
Run git @('-C', $Src, 'fetch', '--quiet', $Repo, $Ref)
Run git @('-C', $Src, 'checkout', '--quiet', '--detach', 'FETCH_HEAD')

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
Write-Host '  Then, to start it at login: jarvis stop; jarvis service install'
Write-Host '  Remove it again with: jarvis uninstall'
