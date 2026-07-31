# Runs the learner agent locally and leaves a report to hand back for review.
#
#   .\run-learner.ps1                      # every phase, English then Portuguese
#   .\run-learner.ps1 -Phases 0-20         # a range
#   .\run-learner.ps1 -Phases 40-68 -Langs pt
#   .\run-learner.ps1 -SkipBuild           # reuse the last build in dist/
#
# This wrapper does ONLY the things Node cannot: pull, install, build, browser.
# Everything else — the server, the credential loading, the agent, the cleanup —
# lives in scripts/audit/run-learner.mjs, which runs identically on Windows and
# Linux and is tested end-to-end before it ships. The first version of this file
# orchestrated all of that in PowerShell and failed three different ways on this
# machine, because PowerShell here cannot be tested where the repo is maintained.
#
# The report lands in audit-reports\learner-agent.md, appended after every phase,
# so interrupting with Ctrl+C still leaves something worth reading.
param(
  [string]$Phases = "0-68",
  [string]$Langs = "en,pt",
  [switch]$SkipBuild
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

if (-not $SkipBuild) {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "build failed" }
}

# Playwright launches its own managed Chromium; install is a fast no-op when present.
npx playwright install chromium
if ($LASTEXITCODE -ne 0) { throw "playwright install failed" }

node scripts\audit\run-learner.mjs --phases=$Phases --langs=$Langs
exit $LASTEXITCODE
