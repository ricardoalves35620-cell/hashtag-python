# Runs the learner agent locally and leaves a report to hand back for review.
#
#   .\run-learner.ps1                      # every phase, English then Portuguese
#   .\run-learner.ps1 -Phases 0-20         # a range
#   .\run-learner.ps1 -Phases 40-68 -Langs pt
#   .\run-learner.ps1 -SkipBuild           # reuse the last build in dist/
#   .\run-learner.ps1 -Headed              # visible browser: watch the learner work
#
# This wrapper does ONLY the three things Node cannot: git pull, npm ci, and the
# Playwright browser install. Everything else — the BUILD (pointed at the right
# backend), the Supabase stub, the server, credential loading, the agent, the
# cleanup — lives in scripts/audit/run-learner.mjs, which runs identically on
# Windows and Linux and is tested end-to-end before it ships. Earlier versions
# orchestrated all of that in PowerShell and failed four different ways on this
# machine, because PowerShell here cannot be run where the repo is maintained.
#
# The build lives in the .mjs on purpose: a signed-in run must build against the
# audit backend, and only the .mjs knows whether that is the local Supabase stub
# or a real one. This is why the wrapper no longer builds.
#
# The report lands in audit-reports\learner-agent.md, appended after every phase,
# so interrupting with Ctrl+C still leaves something worth reading.
param(
  [string]$Phases = "0-68",
  [string]$Langs = "en,pt",
  [switch]$SkipBuild,
  [switch]$Headed
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

git pull --ff-only
if ($LASTEXITCODE -ne 0) { throw "git pull failed - resolve local state first" }

# The prebuild copies the Pyodide runtime out of node_modules/pyodide. A checkout
# whose last npm install predates that devDependency fails before the first phase.
if (-not (Test-Path "node_modules\pyodide")) {
  Write-Host "node_modules is missing pyodide - running npm ci once..."
  npm ci
  if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
}

# Playwright launches its own managed Chromium; install is a fast no-op when present.
npx playwright install chromium
if ($LASTEXITCODE -ne 0) { throw "playwright install failed" }

$extra = @()
if ($Headed) { $extra += "--headed" }
if ($SkipBuild) { $extra += "--skip-build" }
node scripts\audit\run-learner.mjs --phases=$Phases --langs=$Langs @extra
exit $LASTEXITCODE
