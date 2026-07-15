param(
  [int]$Hours = 8,
  [int]$Batch = 3,
  [string]$Url = "",
  [switch]$Continue,
  [switch]$Visible,
  [int]$EnvironmentOffset = 0
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if ($Hours -le 0) { throw "Hours deve ser maior que zero." }
if ($Batch -le 0) { throw "Batch deve ser maior que zero." }

$minutes = $Hours * 60
$argsList = @(
  "-Mode", "Smart",
  "-Minutes", "$minutes",
  "-Batch", "$Batch",
  "-NoOpen",
  "-EnvironmentOffset", "$EnvironmentOffset"
)

if ($Url) { $argsList += @("-Url", $Url) }
if ($Visible) { $argsList += "-Visible" }
if ($Continue) { $argsList += "-Continue" } else { $argsList += "-Fresh" }

Write-Host "Hashtag Python — auditoria noturna inteligente" -ForegroundColor Cyan
Write-Host "Janela máxima: $Hours hora(s) | lote: $Batch fase(s) | modo: Smart"
Write-Host "O modo Smart cobre todas as fases em ambientes principais, usa sentinelas na matriz completa e confirma somente erros novos." -ForegroundColor DarkGray

& (Join-Path $PSScriptRoot "run-auditor.ps1") @argsList
exit $LASTEXITCODE
