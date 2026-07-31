# Runs the learner agent locally and leaves a report to hand back for review.
#
#   .\run-learner.ps1                      # every phase, English and Portuguese (~90 min)
#   .\run-learner.ps1 -Phases 0-20         # a range
#   .\run-learner.ps1 -Phases 40-68 -Langs pt
#   .\run-learner.ps1 -SkipBuild           # reuse the last build in dist/
#
# The report is appended after EVERY phase, so interrupting with Ctrl+C still
# leaves audit-reports/learner-agent.md worth reading. When it finishes, send
# back audit-reports/learner-agent.md (and .json if there were findings).
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
# whose last npm install predates that devDependency fails with "pyodide not
# installed" — seen on the owner's machine 2026-07-30. npm ci also picks up any
# lockfile changes a pull just brought in.
if (-not (Test-Path "node_modules\pyodide")) {
  Write-Host "node_modules is missing pyodide - running npm ci once..."
  npm ci
  if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
}

if (-not $SkipBuild) {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "build failed" }
}

# Playwright launches its own managed Chromium — no path guessing (the first
# version walked ms-playwright folder names and broke on layout differences).
# install is a fast no-op when the browser is already present.
npx playwright install chromium
if ($LASTEXITCODE -ne 0) { throw "playwright install failed" }

# Serve the production build the way learners get it. --strictPort so a stale
# server on 4173 fails loudly instead of silently testing an old build.
$preview = Start-Process -FilePath "cmd.exe" `
  -ArgumentList "/c", "npx vite preview --port 4173 --strictPort" `
  -PassThru -WindowStyle Hidden
try {
  $up = $false
  foreach ($i in 1..60) {
    try {
      $null = Invoke-WebRequest "http://127.0.0.1:4173/" -UseBasicParsing -TimeoutSec 2
      $up = $true; break
    } catch { Start-Sleep -Milliseconds 500 }
  }
  if (-not $up) { throw "preview server did not answer on 4173 - is something else using the port?" }

  $env:HP_BASE = "http://127.0.0.1:4173"
  npm run audit:learner -- --phases=$Phases --langs=$Langs
  $agentExit = $LASTEXITCODE
}
finally {
  # /T takes the node child down with the cmd wrapper; Stop-Process alone leaves
  # it holding the port and the NEXT run's --strictPort refuses to start.
  taskkill /PID $preview.Id /T /F 2>$null | Out-Null
}

Write-Host ""
Write-Host "================ learner run finished (exit $agentExit) ================"
if (Test-Path "audit-reports\learner-agent.md") {
  Get-Content "audit-reports\learner-agent.md" -TotalCount 8
  Write-Host ""
  Write-Host "Full report: audit-reports\learner-agent.md"
  Write-Host "Findings JSON: audit-reports\learner-agent.json"
  Write-Host "Send the .md back for review (plus the .json when there are findings)."
} else {
  Write-Host "No report was written - the run failed before the first phase. Scroll up for the error."
}
exit $agentExit
