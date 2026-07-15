param(
  [int]$Cycles = 0,
  [int]$Minutes = 0,
  [int]$Batch = 0,
  [ValidateSet("Smart", "Full", "Smoke")]
  [string]$Mode = "Smart",
  [string]$Url = "",
  [switch]$Fresh,
  [switch]$Continue,
  [switch]$NoOpen,
  [switch]$Visible,
  [int]$SlowMo = 0,
  [int]$EnvironmentOffset = 0,
  [switch]$DetailedReport,
  [switch]$ForceBrowserInstall
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$versionFile = Join-Path $PSScriptRoot "audit\auditor-version.txt"
$AuditorVersion = if (Test-Path $versionFile) { (Get-Content $versionFile -Raw).Trim() } else { "8.5.0" }

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

function Read-PositiveInteger {
  param([string]$Prompt, [int]$DefaultValue)
  while ($true) {
    $answer = Read-Host "$Prompt [$DefaultValue]"
    if ([string]::IsNullOrWhiteSpace($answer)) { return $DefaultValue }
    $parsed = 0
    if ([int]::TryParse($answer, [ref]$parsed) -and $parsed -gt 0) { return $parsed }
    Write-Host "Digite um número inteiro maior que zero." -ForegroundColor Yellow
  }
}

function Read-YesNo {
  param([string]$Prompt, [bool]$DefaultValue)
  $defaultLabel = if ($DefaultValue) { "S" } else { "N" }
  while ($true) {
    $answer = Read-Host "$Prompt [${defaultLabel}]"
    if ([string]::IsNullOrWhiteSpace($answer)) { return $DefaultValue }
    if ($answer -in @("S", "s", "Y", "y")) { return $true }
    if ($answer -in @("N", "n")) { return $false }
    Write-Host "Responda S ou N." -ForegroundColor Yellow
  }
}

function Get-AuditState {
  $stateFile = Join-Path $PSScriptRoot "playwright-report\autopilot\state.json"
  if (-not (Test-Path $stateFile)) { return $null }
  try { return Get-Content $stateFile -Raw -Encoding UTF8 | ConvertFrom-Json }
  catch { return $null }
}

function Write-RunSummary {
  param(
    [string]$Status,
    [int]$RequestedCycles,
    [int]$BatchSize,
    [string]$Target,
    [datetime]$StartedAt,
    [string]$ReportZip,
    [string]$ReportMode,
    [int]$EnvironmentOffset,
    [string]$AuditMode
  )

  $summaryDir = Join-Path $PSScriptRoot "playwright-report\autopilot"
  New-Item -ItemType Directory -Path $summaryDir -Force | Out-Null
  $summaryFile = Join-Path $summaryDir "last-run.txt"
  $finishedAt = Get-Date
  $state = Get-AuditState
  $actualTotal = if ($state -and $state.cycles) { @($state.cycles).Count } else { 0 }
  $runCompleted = if ($state -and $state.lastRun) { [int]$state.lastRun.completedCycles } else { 0 }
  $runRequested = if ($state -and $state.lastRun) { [int]$state.lastRun.requestedCycles } else { $RequestedCycles }
  $stopReason = if ($state -and $state.lastRun) { [string]$state.lastRun.stopReason } else { "state-unavailable" }
  $stateStatus = if ($state) { [string]$state.status } else { "unknown" }
  $phaseVisits = if ($state) { [int]$state.phaseVisits } else { 0 }
  $planCursor = if ($state -and $state.plan) { [int]$state.plan.cursor } else { 0 }
  $planEntries = if ($state -and $state.plan -and $state.plan.entries) { @($state.plan.entries).Count } else { 0 }
  $pendingConfirmations = if ($state -and $state.focusQueue) { @($state.focusQueue).Count } else { 0 }

  @(
    "Hashtag Python Auditor"
    "Version: $AuditorVersion"
    "Status: $Status"
    "State status: $stateStatus"
    "Started: $($StartedAt.ToString('s'))"
    "Finished: $($finishedAt.ToString('s'))"
    "Requested cycles in this run: $runRequested"
    "Completed cycles in this run: $runCompleted"
    "Total stored cycles: $actualTotal"
    "Total phase visits: $phaseVisits"
    "Stop reason: $stopReason"
    "Phases per cycle: $BatchSize"
    "Target: $Target"
    "Environment offset: $EnvironmentOffset"
    "Audit mode: $AuditMode"
    "Plan progress: $planCursor/$planEntries"
    "Pending confirmations: $pendingConfirmations"
    "Report mode: $ReportMode"
    "Report ZIP: $ReportZip"
  ) | Set-Content -Path $summaryFile -Encoding UTF8
}

function Compress-Folder {
  param([string]$SourceFolder, [string]$DestinationZip)
  Remove-Item $DestinationZip -Force -ErrorAction SilentlyContinue
  $tar = Join-Path $env:SystemRoot "System32\tar.exe"
  if (Test-Path $tar) {
    & $tar -a -c -f $DestinationZip -C $SourceFolder .
    if ($LASTEXITCODE -ne 0) { throw "tar.exe não conseguiu compactar o relatório (código $LASTEXITCODE)." }
  }
  else {
    Compress-Archive -Path (Join-Path $SourceFolder "*") -DestinationPath $DestinationZip -Force
  }
}

function Export-AuditReport {
  param([string]$DestinationZip, [bool]$IncludeDetailed)

  $sourceRoot = Join-Path $PSScriptRoot "playwright-report\autopilot"
  if (-not (Test-Path $sourceRoot)) {
    New-Item -ItemType Directory -Path $sourceRoot -Force | Out-Null
    "Nenhum relatório foi produzido." | Set-Content (Join-Path $sourceRoot "README.txt") -Encoding UTF8
  }

  if ($IncludeDetailed) {
    Compress-Folder -SourceFolder $sourceRoot -DestinationZip $DestinationZip
  }
  else {
    $staging = Join-Path $env:TEMP ("hashtag-python-audit-slim-" + [guid]::NewGuid().ToString("N"))
    try {
      $nodeCommand = (Get-Command node -ErrorAction Stop).Source
      & $nodeCommand "scripts/audit/create-slim-report.mjs" $sourceRoot $staging
      if ($LASTEXITCODE -ne 0) { throw "O gerador do relatório slim terminou com código $LASTEXITCODE." }
      Compress-Folder -SourceFolder $staging -DestinationZip $DestinationZip
    }
    finally {
      Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
    }
  }

  $zipInfo = Get-Item $DestinationZip
  $mode = if ($IncludeDetailed) { "detalhado" } else { "slim" }
  Write-Host ""
  Write-Host "ZIP do relatório $mode pronto:" -ForegroundColor Green
  Write-Host $DestinationZip -ForegroundColor Green
  Write-Host ("Tamanho: {0:N2} MB" -f ($zipInfo.Length / 1MB)) -ForegroundColor DarkGray
}

$startedAt = Get-Date
$desktop = [Environment]::GetFolderPath("Desktop")
$reportName = if ($DetailedReport) { "hashtag-python-audit-report-detailed.zip" } else { "hashtag-python-audit-report-slim.zip" }
$reportZip = Join-Path $desktop $reportName
$runStatus = "Não iniciado"

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

  if (-not $PSBoundParameters.ContainsKey("Mode") -and $Cycles -ge 828) {
    $Mode = "Full"
    Write-Host "Comando antigo de 828 ciclos detectado; usando Mode=Full para compatibilidade." -ForegroundColor Yellow
  }

  $package = Get-Content (Join-Path $PSScriptRoot "package.json") -Raw | ConvertFrom-Json
  $env:HP_AUDIT_EXPECT_VERSION = [string]$package.version
  $env:HP_AUDIT_RETRIES = if ($Mode -eq "Full") { "1" } else { "0" }
  $env:HP_AUDIT_DETAILED = if ($DetailedReport) { "true" } else { "false" }
  $env:HP_AUDIT_SERVICE_WORKERS = "block"
  $env:HP_AUDIT_MODE = $Mode.ToLowerInvariant()

  if ($Batch -le 0) {
    $Batch = switch ($Mode) {
      "Full" { 1 }
      "Smoke" { 5 }
      default { 3 }
    }
  }

  if ($Cycles -lt 0) { throw "Cycles não pode ser negativo." }
  if ($Visible -and $SlowMo -le 0) { $SlowMo = 250 }
  if ($EnvironmentOffset -lt 0) { $EnvironmentOffset = 0 }
  $EnvironmentOffset = $EnvironmentOffset % 12
  if ($Continue -and $Fresh) { throw "Use apenas -Fresh ou -Continue, não os dois juntos." }
  if (-not $Continue) { $Fresh = $true }

  Write-Host ""
  Write-Host "Hashtag Python Auditor Autopilot v$AuditorVersion" -ForegroundColor Cyan
  $cycleLabel = if ($Cycles -eq 0) { "automatic plan" } else { "$Cycles maximum" }
  Write-Host "Mode: $Mode | Cycles: $cycleLabel | Phases per cycle: $Batch"
  if ($Minutes -gt 0) { Write-Host "Maximum minutes: $Minutes" } else { Write-Host "Time limit: none" }
  Write-Host "Target: $Url"
  Write-Host "Expected deployed version: $($env:HP_AUDIT_EXPECT_VERSION)"
  Write-Host "Environment matrix: 12 combinations across desktop Chromium + iPhone/iPad WebKit"
  if ($Mode -eq "Smart") { Write-Host "Smart coverage: 3 complete curriculum environments + deep sentinel phases in all others + automatic confirmation of new errors." -ForegroundColor DarkGray }
  elseif ($Mode -eq "Smoke") { Write-Host "Smoke coverage: five representative phases across all 12 environments." -ForegroundColor DarkGray }
  else { Write-Host "Full coverage: every phase in all 12 environments." -ForegroundColor DarkGray }
  Write-Host "Report ZIP: $reportZip ($(if ($DetailedReport) { 'detailed' } else { 'slim' }))"

  $env:HP_AUDIT_REQUIRE_LOGIN = "true"
  $env:HP_AUDIT_HEADED = if ($Visible) { "true" } else { "false" }
  $env:HP_AUDIT_SLOW_MO = [string]([Math]::Max(0, $SlowMo))

  $auditSpec = Join-Path $PSScriptRoot "tests\audit\app.audit.spec.ts"
  $autopilotFile = Join-Path $PSScriptRoot "audit\autopilot.ts"
  if (-not (Test-Path $auditSpec)) { throw "Arquivo de auditoria não encontrado: $auditSpec" }
  if (-not (Test-Path $autopilotFile)) { throw "Arquivo do Autopilot não encontrado: $autopilotFile" }
  $auditSpecText = Get-Content $auditSpec -Raw
  if ($auditSpecText -notmatch "completeLessonJourney" -or $auditSpecText -notmatch "prepareExerciseThinking" -or $auditSpecText -notmatch "HP_AUDIT_DEPTH") {
    throw "Auditor desatualizado: o fluxo adaptativo V8.5 não foi encontrado."
  }
  $autopilotText = Get-Content $autopilotFile -Raw
  if ($autopilotText -notmatch "buildAuditPlan" -or $autopilotText -notmatch "confirm-new-issue" -or $autopilotText -notmatch "phaseVisits") {
    throw "Autopilot desatualizado: planejamento inteligente V8.5 não foi encontrado."
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

  $playwrightCache = Join-Path $env:LOCALAPPDATA "ms-playwright"
  $hasChromium = (Test-Path $playwrightCache) -and @(Get-ChildItem $playwrightCache -Directory -Filter "chromium-*" -ErrorAction SilentlyContinue).Count -gt 0
  $hasWebKit = (Test-Path $playwrightCache) -and @(Get-ChildItem $playwrightCache -Directory -Filter "webkit-*" -ErrorAction SilentlyContinue).Count -gt 0
  if ($ForceBrowserInstall -or -not ($hasChromium -and $hasWebKit)) {
    Write-Host "Instalando/verificando Chromium e WebKit do Playwright..." -ForegroundColor Yellow
    & $nodeCommand $playwrightCli install chromium webkit
    if ($LASTEXITCODE -ne 0) { throw "Não foi possível instalar/verificar Chromium e WebKit." }
  }
  else {
    Write-Host "Chromium e WebKit já estão instalados; verificação demorada ignorada." -ForegroundColor DarkGray
  }

  $env:HP_CURRICULUM_AUDIT_OUTPUT_DIR = Join-Path $PSScriptRoot "playwright-report\autopilot\curriculum-audit"
  Write-Host "Running curriculum gate..." -ForegroundColor Cyan
  & $nodeCommand $tsxCli "audit/curriculum-audit.ts"
  if ($LASTEXITCODE -ne 0) { throw "A auditoria curricular encontrou uma contradição bloqueadora." }

  $argsList = @(
    "audit/autopilot.ts",
    "--cycles", "$Cycles",
    "--mode", $Mode.ToLowerInvariant(),
    "--minutes", "$Minutes",
    "--batch", "$Batch",
    "--url", $Url,
    "--environment-offset", "$EnvironmentOffset"
  )
  if ($Fresh) { $argsList += "--fresh" }

  & $nodeCommand $tsxCli @argsList
  if ($LASTEXITCODE -ne 0) { throw "O processo do auditor terminou inesperadamente com código $LASTEXITCODE." }

  $state = Get-AuditState
  if (-not $state -or -not $state.lastRun) { throw "O auditor terminou sem registrar o estado da execução." }
  $completed = [int]$state.lastRun.completedCycles
  $requested = [int]$state.lastRun.requestedCycles
  if ($state.lastRun.status -eq "completed" -and $completed -eq $requested) {
    $runStatus = "Concluído ($completed/$requested ciclos)"
  }
  else {
    $runStatus = "Interrompido ($completed/$requested ciclos; motivo: $($state.lastRun.stopReason))"
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
    Write-RunSummary -Status $runStatus -RequestedCycles $Cycles -BatchSize $Batch -Target $Url -StartedAt $startedAt -ReportZip $reportZip -ReportMode $(if ($DetailedReport) { "detailed" } else { "slim" }) -EnvironmentOffset $EnvironmentOffset -AuditMode $Mode
    Export-AuditReport -DestinationZip $reportZip -IncludeDetailed:$DetailedReport
    $report = Join-Path $PSScriptRoot "playwright-report\autopilot\index.html"
    if ((Test-Path $report) -and -not $NoOpen) { Start-Process $report }
  }
  catch {
    Write-Host "Não foi possível compactar o relatório: $($_.Exception.Message)" -ForegroundColor Red
  }
}
