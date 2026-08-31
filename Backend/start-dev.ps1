<#
    start-dev.ps1 - Smart Cafeteria Backend dev runner

    Prevents the "restart repeatedly" infinite loop by:
      1. Cleanly terminating EVERY process already occupying the backend port
         (PORT from .env, default 5000) BEFORE starting a new server,
         including any stale nodemon / `npm run dev` watcher that might keep
         respawning servers to fight over the port.
      2. Starting the backend under nodemon with a scoped, debounced file
         watcher (see nodemon.json) that excludes logs/ and node_modules/ so
         log/output writes never trigger a restart.

    Usage:
      powershell -ExecutionPolicy Bypass -File start-dev.ps1     (nodemon watch)
      powershell -ExecutionPolicy Bypass -File start-dev.ps1 -NoWatch
#>
[CmdletBinding()]
param(
    [switch]$NoWatch
)

$ErrorActionPreference = 'Stop'

# Keep the working directory stable regardless of where the script is invoked from.
$script:BackendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $script:BackendDir

# Record the PIDs this script directly spawns / manages so we never kill ourselves.
$script:MyDescendants = @()

# Backend port is defined in .env (PORT). Default matches Backend/.env.
$script:TargetPort = 5000
if (Test-Path -LiteralPath (Join-Path $script:BackendDir '.env')) {
    try {
        $envLine = Get-Content -LiteralPath (Join-Path $script:BackendDir '.env') |
            Where-Object { $_ -match '^\s*PORT\s*=' } | Select-Object -First 1
        if ($envLine -match '^\s*PORT\s*=\s*(\d+)') {
            $script:TargetPort = [int]$Matches[1]
        }
    } catch {
        Write-Warning "Could not parse PORT from .env; defaulting to 5000."
    }
}
if ($script:TargetPort -lt 1 -or $script:TargetPort -gt 65535) {
    $script:TargetPort = 5000
}

function Get-DescendantPids {
    param([int[]]$RootPids)
    $allParents = @{}
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | ForEach-Object {
        $allParents[$_.ProcessId] = $_.ParentProcessId
    }
    $result = [System.Collections.Generic.HashSet[int]]::new()
    $queue = [System.Collections.Generic.Queue[int]]::new()
    foreach ($r in $RootPids) { if ($r) { $queue.Enqueue($r) } }
    while ($queue.Count -gt 0) {
        $cur = $queue.Dequeue()
        if (-not $result.Add($cur)) { continue }
        foreach ($pair in $allParents.GetEnumerator()) {
            if ($pair.Value -eq $cur) { $queue.Enqueue($pair.Key) }
        }
    }
    return [int[]]@($result)
}

function Stop-ProcessCleanly {
    param([int[]]$Pids, [string]$Reason)
    foreach ($p in $Pids) {
        if (-not $p -or $p -eq $PID) { continue }
        Write-Host "[dev] Terminating PID $p ($Reason)..."
        Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
    }
}

function Stop-PortAndWatchers {
    param([int]$Port)

    # 1) Kill anything currently listening on the backend port.
    $listenerPids = @()
    $listeners = @(Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
    foreach ($listener in $listeners) {
        $ownerPid = $listener.OwningProcess
        if ($ownerPid -and $ownerPid -ne $PID) { $listenerPids += [int]$ownerPid }
    }
    $listenerPids = @($listenerPids | Select-Object -Unique)
    if ($listenerPids.Count -gt 0) {
        Stop-ProcessCleanly -Pids $listenerPids -Reason "port $Port listener"
    }

    # 2) Kill stale nodemon / `npm run dev` watchers for THIS project that could
    #    otherwise keep respawning servers and cause the restart loop.
    $script:BackendExe = Join-Path $script:BackendDir 'server.js'
    $watcherPids = @()
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | ForEach-Object {
        $cmd = [string]$_.CommandLine
        if ($cmd -match 'nodemon' -or $cmd -match 'npm' ) {
            if ($cmd -match [regex]::Escape($script:BackendDir) -or $cmd -match 'server\.js') {
                $watcherPids += [int]$_.ProcessId
            }
        }
    }
    $watcherPids = @($watcherPids | Select-Object -Unique)
    if ($watcherPids.Count -gt 0) {
        # Also kill everything spawned under the watchers so a single orphaned
        # `node server.js` can no longer hold the port.
        $all = Get-DescendantPids -RootPids $watcherPids
        Stop-ProcessCleanly -Pids $all -Reason "stale dev watcher / child"
    }

    Start-Sleep -Milliseconds 800
}

Write-Host "[dev] Backend dir: $script:BackendDir"
Write-Host "[dev] Preparing port $script:TargetPort (terminating existing listeners and stale watchers)..."
Stop-PortAndWatchers -Port $script:TargetPort
Start-Sleep -Milliseconds 500

# Confirm the port is actually free before we bind, to avoid EADDRINUSE loops.
$stillListening = @(Get-NetTCPConnection -LocalPort $script:TargetPort -State Listen -ErrorAction SilentlyContinue)
if ($stillListening.Count -gt 0) {
    Write-Error "Port $script:TargetPort is still occupied and could not be freed. Aborting to avoid a restart loop."
    exit 1
}
Write-Host "[dev] Port $script:TargetPort is free."

# Resolve the project-local nodemon binary so the script does not depend on a
# global install (or the caller's PATH) to run the watcher. Falls back to a
# bare `nodemon` if the local binary cannot be located.
$script:NodemonCmd = $null
foreach ($cand in @(
        (Join-Path $script:BackendDir 'node_modules\.bin\nodemon.cmd'),
        (Join-Path $script:BackendDir 'node_modules\.bin\nodemon'),
        (Join-Path $script:BackendDir 'node_modules\nodemon\bin\nodemon.js')
    )) {
    if (Test-Path -LiteralPath $cand) { $script:NodemonCmd = $cand; break }
}

if ($NoWatch) {
    Write-Host "[dev] Starting backend WITHOUT file watching (node server.js)..."
    node server.js
}
else {
    if ($script:NodemonCmd) {
        Write-Host "[dev] Starting backend with nodemon (port $script:TargetPort, debounced 1.5s, logs/ & node_modules/ excluded)..."
        Write-Host "[dev] nodemon binary: $script:NodemonCmd"
        if ($script:NodemonCmd -like '*.js') {
            node $script:NodemonCmd server.js
        } else {
            & $script:NodemonCmd server.js
        }
    }
    else {
        Write-Warning "Local nodemon not found; falling back to global 'nodemon'. Run 'npm install' in Backend/ to fix."
        nodemon server.js
    }
}
