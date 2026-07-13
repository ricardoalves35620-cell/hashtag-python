$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$insideGit = git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0 -or $insideGit.Trim() -ne "true") {
  throw "Esta pasta não é um repositório Git válido."
}

$status = git status --porcelain
if ($status) {
  Write-Host "Existem alterações locais ainda não commitadas:" -ForegroundColor Yellow
  $status | ForEach-Object { Write-Host $_ }
  throw "Faça commit das alterações antes de gerar o ZIP do projeto."
}

$desktop = [Environment]::GetFolderPath("Desktop")
$zip = Join-Path $desktop "hashtag-python-source.zip"
Remove-Item $zip -Force -ErrorAction SilentlyContinue

git archive --format=zip --output=$zip HEAD
if ($LASTEXITCODE -ne 0) {
  throw "git archive não conseguiu gerar o ZIP."
}

$file = Get-Item $zip
Write-Host ""
Write-Host "ZIP limpo criado:" -ForegroundColor Green
Write-Host $file.FullName
Write-Host ("Tamanho: {0:N2} MB" -f ($file.Length / 1MB)) -ForegroundColor DarkGray
