param(
    [string]$Name = "analysis-query-crash-gate",
    [Parameter(Mandatory=$true)][string]$Address,
    [Parameter(Mandatory=$true)][string]$Gateway
)
$ErrorActionPreference = "Stop"
if ($Name -ne "analysis-query-crash-gate") { throw "Only the disposable gate VM is supported" }
if (Get-VM -Name $Name -ErrorAction SilentlyContinue) { throw "Gate VM already exists; inspect it before reuse" }
$gateRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot "../.local-query-gates/vm"))
New-Item -ItemType Directory -Force -Path $gateRoot | Out-Null
$python = Join-Path $PSScriptRoot "../.venv/Scripts/python.exe"
& $python (Join-Path $PSScriptRoot "prepare_query_gate_vm.py") --directory $gateRoot --address $Address --gateway $Gateway
if ($LASTEXITCODE) { throw "Image preparation failed" }
# Conversion and ISO generation happen in a disposable tooling container.
docker run --rm --mount "type=bind,src=$gateRoot,dst=/gate" ubuntu:24.04 sh -c 'apt-get update -qq && apt-get install -y -qq qemu-utils cloud-image-utils > /tmp/packages.log && qemu-img convert -O vhdx /gate/cloud.img /gate/system.vhdx && cloud-localds --network-config=/gate/network-config /gate/seed.iso /gate/user-data /gate/meta-data'
if ($LASTEXITCODE) { throw "Image conversion failed" }
Resize-VHD -Path (Join-Path $gateRoot "system.vhdx") -SizeBytes 64GB
New-VM -Name $Name -Generation 2 -MemoryStartupBytes 8GB -VHDPath (Join-Path $gateRoot "system.vhdx") -SwitchName "Default Switch" -Path $gateRoot | Out-Null
Set-VMProcessor -VMName $Name -Count 4 -ExposeVirtualizationExtensions $true
Set-VMFirmware -VMName $Name -EnableSecureBoot Off
Set-VM -Name $Name -AutomaticStartAction Nothing -AutomaticStopAction ShutDown
Set-VM -Name $Name -AutomaticCheckpointsEnabled $false
Set-VMMemory -VMName $Name -DynamicMemoryEnabled $false -StartupBytes 8GB
Add-VMDvdDrive -VMName $Name -Path (Join-Path $gateRoot "seed.iso")
Start-VM -Name $Name
Write-Output "Disposable VM started. Run bootstrap_query_gate_vm.py --host $($Address.Split('/')[0]) after SSH becomes ready."
