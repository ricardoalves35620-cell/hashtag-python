param(
  [int]$Cycles = 45,
  [int]$Minutes = 240,
  [int]$Batch = 2,
  [string]$Url = "",
  [switch]$Fresh
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Hashtag Python Auditor Autopilot" -ForegroundColor Cyan
Write-Host "Cycles: $Cycles | Max minutes: $Minutes | Phases per cycle: $Batch"
if ($Url) { Write-Host "Target: $Url" }
else { Write-Host "Target: local preview (requires .env.local)" }

if (-not (Test-Path "node_modules")) {
  npm ci
  if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
}

$browserPath = Join-Path $env:LOCALAPPDATA "ms-playwright"
if (-not (Test-Path $browserPath)) {
  Write-Host "Installing Playwright Chromium (first run only)..." -ForegroundColor Yellow
  npx playwright install chromium
  if ($LASTEXITCODE -ne 0) { throw "Could not install Playwright Chromium" }
}

$argsList = @("audit/autopilot.ts", "--cycles", "$Cycles", "--minutes", "$Minutes", "--batch", "$Batch")
if ($Url) { $argsList += @("--url", $Url) }
if ($Fresh) { $argsList += "--fresh" }

npx tsx @argsList
if ($LASTEXITCODE -ne 0) { throw "Auditor ended with an unexpected error" }

$report = Join-Path $PSScriptRoot "playwright-report\autopilot\index.html"
if (Test-Path $report) {
  Write-Host "Report ready: $report" -ForegroundColor Green
  Start-Process $report
}
