param(
  [int]$Cycles = 0,
  [int]$Minutes = 0,
  [int]$Batch = 1,
  [string]$Url = "",
  [switch]$Fresh,
  [switch]$Continue,
  [switch]$NoOpen
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Read-PositiveInteger {
  param(
    [string]$Prompt,
    [int]$DefaultValue
  )

  while ($true) {
    $answer = Read-Host "$Prompt [$DefaultValue]"
    if ([string]::IsNullOrWhiteSpace($answer)) { return $DefaultValue }

    $parsed = 0
    if ([int]::TryParse($answer, [ref]$parsed) -and $parsed -gt 0) {
      return $parsed
    }

    Write-Host "Digite um número inteiro maior que zero." -ForegroundColor Yellow
  }
}

function Write-RunSummary {
  param(
    [string]$Status,
    [int]$RequestedCycles,
    [int]$BatchSize,
    [string]$Target,
    [datetime]$StartedAt,
    [string]$ReportZip
  )

  $summaryDir = Join-Path $PSScriptRoot "playwright-report\autopilot"
  New-Item -ItemType Directory -Path $summaryDir -Force | Out-Null
  $summaryFile = Join-Path $summaryDir "last-run.txt"
  $finishedAt = Get-Date

  @(
    "Hashtag Python Auditor"
    "Status: $Status"
    "Started: $($StartedAt.ToString('s'))"
    "Finished: $($finishedAt.ToString('s'))"
    "Requested cycles: $RequestedCycles"
    "Phases per cycle: $BatchSize"
    "Target: $Target"
    "Report ZIP: $ReportZip"
  ) | Set-Content -Path $summaryFile -Encoding UTF8
}

function Export-AuditReport {
  param([string]$DestinationZip)

  $reportRoot = Join-Path $PSScriptRoot "playwright-report"
  if (-not (Test-Path $reportRoot)) {
    New-Item -ItemType Directory -Path $reportRoot -Force | Out-Null
    "Nenhum relatório foi produzido." | Set-Content (Join-Path $reportRoot "README.txt") -Encoding UTF8
  }

  Remove-Item $DestinationZip -Force -ErrorAction SilentlyContinue
  Compress-Archive `
    -Path (Join-Path $reportRoot "*") `
    -DestinationPath $DestinationZip `
    -Force

  Write-Host "" 
  Write-Host "ZIP do relatório pronto:" -ForegroundColor Green
  Write-Host $DestinationZip -ForegroundColor Green
}

$startedAt = Get-Date
$desktop = [Environment]::GetFolderPath("Desktop")
$reportZip = Join-Path $desktop "hashtag-python-audit-report.zip"
$runStatus = "Concluído"

try {
  $envFile = Join-Path $PSScriptRoot ".env.audit.local"
  if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
      if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        [Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), "Process")
      }
    }
  }

  if (-not $Url -and $env:AUDIT_BASE_URL) { $Url = $env:AUDIT_BASE_URL }
  if (-not $Url) { $Url = "https://www.hashtagpython.com" }

  if ($Cycles -le 0) {
    Write-Host "" 
    Write-Host "Hashtag Python Auditor Autopilot" -ForegroundColor Cyan
    $Cycles = Read-PositiveInteger -Prompt "Quantos ciclos deseja executar?" -DefaultValue 20
  }

  if ($Batch -le 0) { $Batch = 1 }

  if ($Continue -and $Fresh) {
    throw "Use apenas -Fresh ou -Continue, não os dois juntos."
  }

  # O modo simples inicia uma auditoria nova. Use -Continue para retomar a anterior.
  if (-not $Continue) { $Fresh = $true }

  Write-Host "" 
  Write-Host "Hashtag Python Auditor Autopilot" -ForegroundColor Cyan
  Write-Host "Cycles: $Cycles | Phases per cycle: $Batch"
  if ($Minutes -gt 0) { Write-Host "Maximum minutes: $Minutes" }
  else { Write-Host "Time limit: none (ends after the requested cycles)" }
  Write-Host "Target: $Url"
  if ($env:AUDIT_USER_EMAIL) { Write-Host "Audit account: $($env:AUDIT_USER_EMAIL)" }
  else { Write-Host "Audit mode: guest" }
  Write-Host "Report ZIP: $reportZip"

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

  $argsList = @(
    "audit/autopilot.ts",
    "--cycles", "$Cycles",
    "--minutes", "$Minutes",
    "--batch", "$Batch",
    "--url", $Url
  )
  if ($Fresh) { $argsList += "--fresh" }

  npx tsx @argsList
  if ($LASTEXITCODE -ne 0) {
    $runStatus = "Finalizado com erro do auditor"
    throw "Auditor ended with an unexpected error"
  }
}
catch {
  $runStatus = "Finalizado com erro: $($_.Exception.Message)"
  Write-Host "" 
  Write-Host $runStatus -ForegroundColor Red
}
finally {
  try {
    Write-RunSummary `
      -Status $runStatus `
      -RequestedCycles $Cycles `
      -BatchSize $Batch `
      -Target $Url `
      -StartedAt $startedAt `
      -ReportZip $reportZip

    Export-AuditReport -DestinationZip $reportZip

    $report = Join-Path $PSScriptRoot "playwright-report\autopilot\index.html"
    if ((Test-Path $report) -and -not $NoOpen) {
      Start-Process $report
    }
  }
  catch {
    Write-Host "Não foi possível compactar o relatório: $($_.Exception.Message)" -ForegroundColor Red
  }
}
