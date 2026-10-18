param([string]$Installer = (Join-Path $PSScriptRoot '..\public\install.ps1'))
$ErrorActionPreference = 'Stop'
. $Installer
$realVerify = ${function:Test-JarvisReleaseSignature}
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$testRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\')
$fixture = Join-Path $testRoot ('jarvis-website-test-' + [Guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Path $fixture
$target = Join-Path $fixture 'install here'
$script:archiveFixture = Join-Path $fixture 'good.zip'
$tag = 'ci-a176e79843a22eae2802d97aafba74a0bf6e282f'
$script:calls = @(); $script:downloads = @(); $script:stages = @()
$script:version = '0.1.0'
function Assert($Condition, $Message) { if (-not $Condition) { throw "Assertion failed: $Message" } }
function Invoke-JarvisDownload([string]$Url, [string]$Destination) {
    $script:downloads += $Url; $script:stages += [IO.Path]::GetDirectoryName($Destination)
    if ($script:failDownload) { throw 'fixture download failed' }
    if ($Url.EndsWith('/release-manifest.txt')) { [IO.File]::WriteAllText($Destination, $script:manifest) }
    elseif ($Url.EndsWith('/release-manifest.sigstore.json')) { [IO.File]::WriteAllText($Destination, 'bundle') }
    elseif ($Url.EndsWith('/cosign-windows-amd64.exe')) { [IO.File]::WriteAllText($Destination, 'untrusted') }
    else { Copy-Item -LiteralPath $script:archiveFixture -Destination $Destination }
}
function Test-JarvisReleaseSignature([string]$Stage, [string]$ReleaseTag) {
    if ($script:verifyPin) { & $realVerify $Stage $ReleaseTag; return }
    $script:verified = $true
    if ($script:failSignature) { throw 'fixture signature refused' }
}
function Invoke-JarvisProgram([string]$Program, [string[]]$Arguments) {
    Assert (([IO.File]::ReadAllText($Program)) -ceq 'inert fixture') 'only the selected ZIP member is executed'
    $script:calls += ,$Arguments
    if ($Arguments[0] -eq 'version') { return "jarvis-cli $script:version" }
    Assert ($Arguments[0] -eq 'install' -and $Arguments[-1] -eq '--no-path') 'only no-PATH installation; no setup or service'
    if ($script:failInstall) { throw 'fixture install failed' }
    $null = New-Item -ItemType Directory -Path $Arguments[2] -Force
    Copy-Item -LiteralPath $Program -Destination (Join-Path $Arguments[2] 'jarvis.exe')
}
function Refused([string]$Expected) {
    $caught = $false
    try { Install-JarvisPrebuilt $target $true }
    catch { $caught = $true; Assert ($_.Exception.Message -match $Expected) "expected $Expected, received $($_.Exception.Message)" }
    Assert $caught "expected refusal: $Expected"
    Assert (-not (Test-Path -LiteralPath (Join-Path $target 'jarvis.exe'))) 'failure did not install'
}
try {
    $zip = [IO.Compression.ZipFile]::Open($script:archiveFixture, [IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($name in @('jarvis-0.1.0-windows-x86_64/jarvis.exe', '../../outside')) {
            $stream = $zip.CreateEntry($name).Open()
            try { $bytes = [Text.Encoding]::UTF8.GetBytes('inert fixture'); $stream.Write($bytes, 0, $bytes.Length) } finally { $stream.Dispose() }
        }
    } finally { $zip.Dispose() }
    $sha = (Get-FileHash -LiteralPath $script:archiveFixture).Hash.ToLowerInvariant()
    $rows = @('JARVIS-RELEASE-1', 'repository=props-nothing/jarvis-core', "tag=$tag", "commit=$($tag.Substring(3))", 'version=0.1.0')
    foreach ($label in @('linux-x86_64', 'linux-aarch64', 'macos-aarch64', 'macos-x86_64', 'windows-x86_64')) {
        $ext = if ($label.StartsWith('windows-')) { 'zip' } else { 'tar.gz' }
        $rows += "$label`tjarvis-0.1.0-$label.$ext`t$((Get-Item -LiteralPath $script:archiveFixture).Length)`t$sha"
    }
    $goodManifest = ($rows -join "`n") + "`n"; $script:manifest = $goodManifest
    Install-JarvisPrebuilt $target $true
    Assert ($script:verified -and $script:calls.Count -eq 2 -and $script:downloads.Count -eq 3) 'signature then version and install'
    Assert ($script:downloads[-1] -ceq "https://github.com/props-nothing/jarvis-core/releases/download/$tag/jarvis-0.1.0-windows-x86_64.zip") 'exact pinned archive'
    Assert (-not (Test-Path -LiteralPath (Join-Path $fixture 'outside'))) 'archive traversal ignored'
    $caught = $false
    try { Install-JarvisPrebuilt $target $true } catch { $caught = $_.Exception.Message -match 'already exists' }
    Assert ($caught -and $script:downloads.Count -eq 3) 'repeat refused before network'
    Assert (([IO.File]::ReadAllText((Join-Path $target 'jarvis.exe'))) -ceq 'inert fixture') 'existing bytes preserved'
    Remove-Item -LiteralPath (Join-Path $target 'jarvis.exe')
    $script:calls = @(); $script:downloads = @()
    $script:failSignature = $true; Refused 'signature refused'; $script:failSignature = $false
    Assert ($script:calls.Count -eq 0 -and $script:downloads.Count -eq 2) 'signature refusal precedes archive'
    $script:verifyPin = $true; Refused 'verifier checksum mismatch'; $script:verifyPin = $false
    Assert ($script:calls.Count -eq 0) 'untrusted verifier never executed'
    foreach ($change in @(@('repository=props-nothing', 'repository=foreign'), @('tag=ci-a', 'tag=ci-b'), @('commit=a', 'commit=b'), @('version=0.1.0', 'version=9.9.9'), @('linux-x86_64', 'linux-unknown'))) {
        $script:downloads = @(); $script:manifest = $goodManifest.Replace($change[0], $change[1]); Refused 'manifest'
        Assert ($script:calls.Count -eq 0 -and $script:downloads.Count -eq 2) 'manifest refusal precedes archive'
    }
    $script:manifest = $goodManifest.Replace($sha, ('0' * 64)); Refused 'SHA-256 mismatch'
    Assert ($script:calls.Count -eq 0) 'corrupt archive never executes'
    $script:manifest = $goodManifest
    $script:failDownload = $true; Refused 'download failed'; $script:failDownload = $false
    $script:version = '9.9.9'; Refused 'version does not match'; $script:version = '0.1.0'
    Assert ($script:calls.Count -eq 1) 'wrong version never installs'
    $script:failInstall = $true; Refused 'install failed'; $script:failInstall = $false
    $script:downloads = @(); $env:JARVIS_REF = 'main'; Refused 'old source installer'; Remove-Item Env:JARVIS_REF
    Assert ($script:downloads.Count -eq 0) 'legacy override fails before network'
    $caught = $false
    try { & $Installer -Sha256 $sha } catch { $caught = $_.Exception.Message -match 'parameter' }
    Assert $caught 'unsigned override unavailable'
    foreach ($stage in $script:stages) { Assert (-not (Test-Path -LiteralPath $stage)) 'staging cleaned after all outcomes' }
    # Unmodified website text through its advertised Invoke-Expression entry.
    # A fresh LOCALAPPDATA containing an existing executable guarantees no PATH write.
    $env:LOCALAPPDATA = Join-Path $fixture 'local'
    $existing = Join-Path $env:LOCALAPPDATA 'Programs\JARVIS'
    $null = New-Item -ItemType Directory -Path $existing -Force
    [IO.File]::WriteAllText((Join-Path $existing 'jarvis.exe'), 'keep')
    $caught = $false
    try { Get-Content -Raw -LiteralPath $Installer | Invoke-Expression } catch { $caught = $_.Exception.Message -match 'already exists' }
    Assert $caught 'Invoke-Expression runs pinned installer and refuses existing installation'
    Assert (([IO.File]::ReadAllText((Join-Path $existing 'jarvis.exe'))) -ceq 'keep') 'piped entry preserves existing bytes'
    Write-Host 'Signed Windows website fixtures passed.'
} finally {
    $resolved = [IO.Path]::GetFullPath($fixture)
    if ([IO.Path]::GetDirectoryName($resolved) -cne $testRoot -or [IO.Path]::GetFileName($resolved) -notmatch '\Ajarvis-website-test-[0-9a-f]{32}\z') { throw 'Unexpected fixture cleanup path.' }
    Remove-Item -LiteralPath $resolved -Recurse -Force
}
