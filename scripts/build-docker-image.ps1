[CmdletBinding()]
param(
    [string] $Container,
    [string] $BaseImage,
    [string] $Tag,
    [string] $ZarrViewerWheel,
    [switch] $WithWorkflowSkills,
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
if (-not $Tag) { $Tag = "$currentImage-analysis" }

$containerConfigs = Get-PluginConfigs $Container
$imageConfigs = Get-PluginConfigs $BaseImage -Image
$configsAddedByThisImage = @("90-omero-analysis.omero")
$missingConfigs = @($containerConfigs | Where-Object {
    $_ -notin $imageConfigs -and $_ -notin $configsAddedByThisImage
})
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
        $buildDirectory = Join-Path $RepoRoot "build"
        if (Test-Path -LiteralPath $buildDirectory) {
            Remove-Item -LiteralPath $buildDirectory -Recurse -Force
        }
        & $python -m build --wheel
        if ($LASTEXITCODE -ne 0) { throw "Wheel build failed." }
    } finally { Pop-Location }
}
$wheel = Get-ChildItem (Join-Path $RepoRoot "dist\omero_analysis-*.whl") | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $wheel) { throw "No Analysis wheel exists in dist." }
& $python (Join-Path $RepoRoot "scripts\verify_wheel.py") $wheel.FullName
if ($LASTEXITCODE -ne 0) { throw "Wheel verification failed." }
$wheelhouse = Join-Path $RepoRoot "dist\wheelhouse"
$wheelhouseArguments = @(
    (Join-Path $RepoRoot "scripts\build_companion_wheelhouse.py"),
    "--plugin-wheel", $wheel.FullName,
    "--output", $wheelhouse
)
if ($WithWorkflowSkills) { $wheelhouseArguments += "--with-workflow-skills" }
if (-not $ZarrViewerWheel) {
    $siblingDist = Join-Path (Split-Path -Parent $RepoRoot) "OMERO.ZarrViewer\dist"
    if (Test-Path $siblingDist) {
        $ZarrViewerWheel = Get-ChildItem (Join-Path $siblingDist "biomero_zarr_viewer-0.4.*.whl") |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1 -ExpandProperty FullName
    }
}
if ($ZarrViewerWheel) {
    $resolvedZarrViewerWheel = (Resolve-Path $ZarrViewerWheel).Path
    $wheelhouseArguments += @("--application-wheel", $resolvedZarrViewerWheel)
}
& $python @wheelhouseArguments
if ($LASTEXITCODE -ne 0) { throw "Offline companion wheelhouse build failed." }

docker build `
    --build-arg "OMERO_WEB_IMAGE=$BaseImage" `
    --file docker/Dockerfile.omeroweb `
    --tag $Tag `
    $RepoRoot
if ($LASTEXITCODE -ne 0) { throw "Docker image build failed." }
Write-Host "Built $Tag on top of $BaseImage without dropping existing baked-in plugins."
