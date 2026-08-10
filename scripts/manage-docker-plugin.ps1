[CmdletBinding()]
param(
    [Parameter(Mandatory, Position = 0)]
    [ValidateSet("install", "update", "remove", "status")]
    [string] $Action,
    [string] $Container,
    [switch] $SkipBuild,
    [switch] $SkipFrontend,
    [switch] $SkipRuntime,
    [switch] $NoRestart
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$ContainerPython = "/opt/omero/web/venv3/bin/python"
$ContainerOmero = "/opt/omero/web/venv3/bin/omero"
$ContainerConfig = "/opt/omero/web/config/90-omero-analysis.omero"
$ContainerCleanup = "/startup/49-omero-analysis-cleanup.py"
$ContainerNavigation = "/startup/51-omero-analysis-navigation.py"
$ContainerStatic = "/opt/omero/web/OMERO.web/var/static/omero_analysis"
$PackageName = "omero-analysis"
$JupyterConfig = "/opt/omero/web/config/90-omero-jupyterlite.omero"
$JupyterStatic = "/opt/omero/web/OMERO.web/var/static/omero_jupyterlite"
$JupyterPackage = "omero-jupyterlite"

function Resolve-WebContainer {
    if ($Container) {
        $running = docker inspect --format "{{.State.Running}}" $Container 2>$null
        if ($LASTEXITCODE -ne 0 -or $running -ne "true") { throw "Container '$Container' is not running." }
        return $Container
    }
    $matches = @(docker ps --filter "label=com.docker.compose.service=omeroweb" --format "{{.Names}}") | Where-Object { $_ }
    if ($matches.Count -ne 1) { throw "Expected one running 'omeroweb' Compose service; found $($matches.Count). Use -Container." }
    return ($matches | Select-Object -First 1)
}

function Host-Python {
    $venv = Join-Path $RepoRoot ".venv\Scripts\python.exe"
    if (Test-Path $venv) { return $venv }
    return (Get-Command python -ErrorAction Stop).Source
}

function Build-Wheel {
    $python = Host-Python
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
            if ($LASTEXITCODE -ne 0) { throw "Frontend/runtime validation failed." }
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
    $verification = & $python (Join-Path $RepoRoot "scripts\verify_wheel.py") $wheel.FullName
    if ($LASTEXITCODE -ne 0) { throw "Wheel verification failed." }
    $verification | Write-Host
    return $wheel
}

function Invoke-OptionalPipUninstall([string] $Distribution) {
    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        docker exec --user root $Container $ContainerPython -m pip uninstall -y $Distribution *> $null
        $status = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $previousPreference
    }
    if ($status -ne 0) { throw "Failed to uninstall optional distribution $Distribution." }
}

function Restart-Web([bool] $ExpectActive) {
    if ($NoRestart) { Write-Warning "Restart deferred; the change is not active."; return }
    docker restart $Container | Out-Null
    $deadline = (Get-Date).AddSeconds(90)
    do {
        Start-Sleep -Seconds 2
        $previousPreference = $ErrorActionPreference
        try {
            $ErrorActionPreference = "Continue"
            docker exec $Container $ContainerOmero web status *> $null
            $webStatus = $LASTEXITCODE
        } finally {
            $ErrorActionPreference = $previousPreference
        }
        if ($webStatus -eq 0) {
            $apps = docker exec $Container $ContainerOmero config get omero.web.apps 2>$null
            if (($apps -match "omero_analysis") -eq $ExpectActive) { return }
        }
    } while ((Get-Date) -lt $deadline)
    throw "OMERO.web did not reach the expected plugin state within 90 seconds."
}

function Show-Status {
    $version = docker exec $Container $ContainerPython -c "import importlib.metadata as m; print(m.version('$PackageName'))" 2>$null
    Write-Host $(if ($LASTEXITCODE -eq 0) { "Package: installed ($version)" } else { "Package: not installed" })
    $catalogVersion = docker exec $Container $ContainerPython -c "import importlib.metadata as m; print(m.version('biomero-workflow-skills'))" 2>$null
    Write-Host $(if ($LASTEXITCODE -eq 0) { "Workflow skills (optional): installed ($catalogVersion)" } else { "Workflow skills (optional): not installed" })
    $apps = docker exec $Container $ContainerOmero config get omero.web.apps 2>$null
    Write-Host $(if ($apps -match "omero_analysis") { "OMERO.web: app active" } else { "OMERO.web: app inactive" })
    $jupyter = docker exec $Container $ContainerPython -c "import importlib.metadata as m; print(next((d.version for d in m.distributions() if (d.metadata.get('Name') or '').lower() == '$JupyterPackage'), ''))"
    Write-Host $(if ($jupyter -or $apps -match "omero_jupyterlite") {
        "JupyterLite: removal incomplete"
    } else {
        "JupyterLite: removed"
    })
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "Docker CLI was not found." }
$Container = Resolve-WebContainer
switch ($Action) {
    "status" { Show-Status }
    { $_ -in @("install", "update") } {
        $wheel = Build-Wheel
        docker exec --user root $Container rm -f $JupyterConfig
        docker exec --user root $Container rm -rf $JupyterStatic
        Invoke-OptionalPipUninstall $JupyterPackage
        $remote = "/tmp/omero-analysis-wheelhouse"
        docker exec --user root $Container rm -rf $remote
        docker exec --user root $Container mkdir -p $remote
        docker cp $wheel.FullName "${Container}:$remote/$($wheel.Name)"
        docker exec --user root $Container $ContainerPython -m pip install `
            --no-index --find-links $remote --upgrade --force-reinstall --no-deps `
            "$remote/$($wheel.Name)"
        if ($LASTEXITCODE -ne 0) { throw "Offline plugin installation failed." }
        docker cp (Join-Path $RepoRoot "docker\49-omero-analysis-cleanup.py") "${Container}:$ContainerCleanup"
        docker exec --user root $Container chmod 0755 $ContainerCleanup
        docker cp (Join-Path $RepoRoot "docker\51-omero-analysis-navigation.py") "${Container}:$ContainerNavigation"
        docker exec --user root $Container chmod 0755 $ContainerNavigation
        docker cp (Join-Path $RepoRoot "docker\90-omero-analysis.omero") "${Container}:$ContainerConfig"
        docker exec --user root $Container chmod 0644 $ContainerConfig
        docker exec --user root $Container rm -rf $ContainerStatic
        docker exec --user root $Container rm -rf $remote
        Restart-Web $true
        Show-Status
    }
    "remove" {
        docker exec --user root $Container rm -f $ContainerConfig
        docker exec --user root $Container rm -f $ContainerNavigation
        docker exec --user root $Container $ContainerPython -m pip uninstall -y $PackageName
        docker exec --user root $Container rm -rf $ContainerStatic
        Restart-Web $false
        Show-Status
    }
}
