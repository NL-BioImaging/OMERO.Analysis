[CmdletBinding()]
param(
    [string] $Container,
    [string] $BaseImage,
    [string] $Tag,
    [switch] $SkipBuild,
    [switch] $SkipFrontend,
    [switch] $SkipRuntime
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

function Resolve-WebContainer {
    if ($Container) {
        $running = docker inspect --format "{{.State.Running}}" $Container 2>$null
        if ($LASTEXITCODE -ne 0 -or $running -ne "true") {
            throw "OMERO.web container '$Container' is not running."
        }
        return $Container
    }
    $matches = @(docker ps --filter "label=com.docker.compose.service=omeroweb" --format "{{.Names}}") | Where-Object { $_ }
    if ($matches.Count -ne 1) {
        throw "Expected one running Compose service named 'omeroweb'; found $($matches.Count). Use -Container."
    }
    return ($matches | Select-Object -First 1)
}

function Get-HostPython {
    $venvPython = Join-Path $RepoRoot ".venv\Scripts\python.exe"
    if (Test-Path $venvPython) { return $venvPython }
    $python = Get-Command python -ErrorAction SilentlyContinue
    if (-not $python) { throw "Python was not found." }
    return $python.Source
}

function Get-PluginConfigs([string] $Name, [switch] $Image) {
    $command = 'for f in /opt/omero/web/config/*.omero; do [ -e "$f" ] && basename "$f"; done'
    if ($Image) {
        docker image inspect $Name *> $null
        if ($LASTEXITCODE -ne 0) { throw "Base image '$Name' was not found." }
        return @(& docker run --rm --entrypoint sh $Name -c $command 2>$null) | Where-Object { $_ }
    }
    return @(& docker exec $Name sh -c $command 2>$null) | Where-Object { $_ }
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "Docker CLI was not found." }
$Container = Resolve-WebContainer
$currentImage = (& docker inspect --format "{{.Config.Image}}" $Container).Trim()
if (-not $BaseImage) { $BaseImage = $currentImage }
if (-not $Tag) { $Tag = "$currentImage-analysis-chat" }

$containerConfigs = Get-PluginConfigs $Container
$imageConfigs = Get-PluginConfigs $BaseImage -Image
$missingConfigs = @($containerConfigs | Where-Object { $_ -notin $imageConfigs })
if ($missingConfigs.Count) {
    throw "Refusing to build from '$BaseImage'; it would drop container-only plugin configurations:`n  $($missingConfigs -join "`n  ")"
}

$python = Get-HostPython
if (-not $SkipBuild) {
    Push-Location $RepoRoot
    try {
        if ($SkipFrontend) {
            & $python scripts/build_frontend.py --validate-only
        } else {
            $arguments = @("scripts/build_frontend.py", "--skip-install")
            if ($SkipRuntime) { $arguments += "--skip-runtime" }
            & $python @arguments
        }
        if ($LASTEXITCODE -ne 0) { throw "Frontend/runtime build failed." }
        & $python -m build --wheel --no-isolation
        if ($LASTEXITCODE -ne 0) { throw "Wheel build failed." }
    } finally { Pop-Location }
}
$wheel = Get-ChildItem (Join-Path $RepoRoot "dist\omero_analysis_chat-*.whl") | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $wheel) { throw "No Analysis Chat wheel exists in dist." }
& $python (Join-Path $RepoRoot "scripts\verify_wheel.py") $wheel.FullName
if ($LASTEXITCODE -ne 0) { throw "Wheel verification failed." }

docker build `
    --build-arg "OMERO_WEB_IMAGE=$BaseImage" `
    --build-arg "ANALYSIS_CHAT_WHEEL=dist/$($wheel.Name)" `
    --file docker/Dockerfile.omeroweb `
    --tag $Tag `
    $RepoRoot
if ($LASTEXITCODE -ne 0) { throw "Docker image build failed." }
Write-Host "Built $Tag on top of $BaseImage without dropping existing baked-in plugins."

