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

if (-not $SkipBuild) {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "build failed" }
}

# The agent's default executable path is the cloud sandbox's Linux Chromium.
# On Windows, point HP_CHROMIUM at the Playwright-managed browser instead.
function Find-Chromium {
  $root = Join-Path $env:LOCALAPPDATA "ms-playwright"
  if (-not (Test-Path $root)) { return $null }
  Get-ChildItem $root -Directory -Filter "chromium-*" |
    Sort-Object Name -Descending |
    ForEach-Object { Join-Path $_.FullName "chrome-win\chrome.exe" } |
    Where-Object { Test-Path $_ } |
    Select-Object -First 1
}
$chrome = Find-Chromium
if (-not $chrome) {
  Write-Host "Playwright Chromium not found - installing once..."
  npx playwright install chromium
  $chrome = Find-Chromium
  if (-not $chrome) { throw "could not find Chromium even after playwright install" }
}
$env:HP_CHROMIUM = $chrome
Write-Host "Chromium: $chrome"

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
