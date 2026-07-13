param(
  [int]$Cycles = 0,
  [int]$Minutes = 0,
  [int]$Batch = 1,
  [string]$Url = "",
  [switch]$Fresh,
  [switch]$Continue,
  [switch]$NoOpen,
  [switch]$Visible,
  [int]$SlowMo = 0
)

$ErrorActionPreference = "Stop"
$AuditorVersion = "7.7.0"

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class AuditPower {
  [DllImport("kernel32.dll")]
  public static extern uint SetThreadExecutionState(uint esFlags);
}
"@ -ErrorAction SilentlyContinue

[uint32]$ES_CONTINUOUS = 2147483648
[uint32]$ES_SYSTEM_REQUIRED = 1
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

function Read-YesNo {
  param(
    [string]$Prompt,
    [bool]$DefaultValue
  )

  $defaultLabel = if ($DefaultValue) { "S" } else { "N" }
  while ($true) {
    $answer = Read-Host "$Prompt [${defaultLabel}]"
    if ([string]::IsNullOrWhiteSpace($answer)) { return $DefaultValue }
    if ($answer -in @("S", "s", "Y", "y")) { return $true }
    if ($answer -in @("N", "n")) { return $false }
    Write-Host "Responda S ou N." -ForegroundColor Yellow
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
    "Version: $AuditorVersion"
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
  $autopilotRoot = Join-Path $reportRoot "autopilot"
  if (Test-Path $autopilotRoot) {
    Compress-Archive `
      -Path (Join-Path $autopilotRoot "*") `
      -DestinationPath $DestinationZip `
      -Force
  } else {
    Compress-Archive `
      -Path (Join-Path $reportRoot "*") `
      -DestinationPath $DestinationZip `
      -Force
  }

  Write-Host "" 
  Write-Host "ZIP do relatório pronto:" -ForegroundColor Green
  Write-Host $DestinationZip -ForegroundColor Green
}

$startedAt = Get-Date
$desktop = [Environment]::GetFolderPath("Desktop")
$reportZip = Join-Path $desktop "hashtag-python-audit-report.zip"
$runStatus = "Concluído"

try {
  [AuditPower]::SetThreadExecutionState([uint32]($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED)) | Out-Null
  Write-Host "Suspensão automática bloqueada durante a auditoria." -ForegroundColor DarkGray

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

  if (-not $env:AUDIT_USER_EMAIL -or -not $env:AUDIT_USER_PASSWORD) {
    throw "Credenciais de auditoria ausentes. Verifique .env.audit.local antes de iniciar."
  }

  $interactiveLaunch = $Cycles -le 0
  if ($interactiveLaunch) {
    Write-Host "" 
    Write-Host "Hashtag Python Auditor Autopilot" -ForegroundColor Cyan
    Write-Host "69 ciclos = 1 volta completa; 414 ciclos = 6 voltas (aprox. 4-6 horas)." -ForegroundColor DarkGray
    $Cycles = Read-PositiveInteger -Prompt "Quantos ciclos deseja executar?" -DefaultValue 414
    $defaultVisible = $Cycles -le 5
    $Visible = Read-YesNo -Prompt "Deseja acompanhar o navegador na tela?" -DefaultValue $defaultVisible
    if ($Visible -and $SlowMo -le 0) {
      $SlowMo = Read-PositiveInteger -Prompt "Pausa entre ações em milissegundos" -DefaultValue 350
    }
  }

  if ($Batch -le 0) { $Batch = 1 }
  if ($Batch -gt 1) { Write-Host "Para auditoria profunda, Batch=1 é recomendado." -ForegroundColor Yellow }

  if ($Continue -and $Fresh) {
    throw "Use apenas -Fresh ou -Continue, não os dois juntos."
  }

  # O modo simples inicia uma auditoria nova. Use -Continue para retomar a anterior.
  if (-not $Continue) { $Fresh = $true }

  Write-Host "" 
  Write-Host "Hashtag Python Auditor Autopilot v$AuditorVersion" -ForegroundColor Cyan
  Write-Host "Cycles: $Cycles | Phases per cycle: $Batch | Curriculum passes: $([Math]::Round(($Cycles * $Batch) / 69, 1))"
  if ($Minutes -gt 0) { Write-Host "Maximum minutes: $Minutes" }
  else { Write-Host "Time limit: none (ends after the requested cycles)" }
  Write-Host "Target: $Url"
  Write-Host "Audit account: $($env:AUDIT_USER_EMAIL)"
  Write-Host "Browser: $(if ($Visible) { 'visible' } else { 'headless' })$(if ($Visible -and $SlowMo -gt 0) { " · slow motion ${SlowMo}ms" } else { '' })"
  Write-Host "Report ZIP: $reportZip"

  $env:HP_AUDIT_REQUIRE_LOGIN = "true"
  $env:HP_AUDIT_HEADED = if ($Visible) { "true" } else { "false" }
  $env:HP_AUDIT_SLOW_MO = [string]([Math]::Max(0, $SlowMo))

  $auditSpec = Join-Path $PSScriptRoot "tests\audit\app.audit.spec.ts"
  if (-not (Test-Path $auditSpec)) { throw "Arquivo de auditoria não encontrado: $auditSpec" }
  $auditSpecText = Get-Content $auditSpec -Raw
  if ($auditSpecText -notmatch "deep learning journey" -or $auditSpecText -notmatch "exercise editor, errors, draft and layout") {
    throw "Auditor desatualizado: fluxo profundo 7.6 não encontrado. Instale o patch mais recente."
  }

  $autopilotFile = Join-Path $PSScriptRoot "audit\autopilot.ts"
  if (-not (Test-Path $autopilotFile)) { throw "Arquivo do Autopilot não encontrado: $autopilotFile" }
  $autopilotText = Get-Content $autopilotFile -Raw
  if ($autopilotText -notmatch "HP_AUDIT_RESULTS_OUTPUT" -or $autopilotText -notmatch "fileIsFresh" -or $autopilotText -notmatch "HP_AUDIT_CYCLE") {
    throw "Autopilot desatualizado: recursos profundos/frescos não encontrados. Instale o patch 7.6 ou superior."
  }

  if (-not (Test-Path "node_modules")) {
    npm ci
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
  }

  $nodeCommand = (Get-Command node -ErrorAction Stop).Source
  $playwrightCli = Join-Path $PSScriptRoot "node_modules\@playwright\test\cli.js"
  $tsxCli = Join-Path $PSScriptRoot "node_modules\tsx\dist\cli.mjs"

  if (-not (Test-Path $playwrightCli)) { throw "Playwright CLI não encontrado: $playwrightCli" }
  if (-not (Test-Path $tsxCli)) { throw "tsx CLI não encontrado: $tsxCli" }

  $browserPath = Join-Path $env:LOCALAPPDATA "ms-playwright"
  if (-not (Test-Path $browserPath)) {
    Write-Host "Installing Playwright Chromium (first run only)..." -ForegroundColor Yellow
    & $nodeCommand $playwrightCli install chromium
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

  & $nodeCommand $tsxCli @argsList
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
  [AuditPower]::SetThreadExecutionState($ES_CONTINUOUS) | Out-Null
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
