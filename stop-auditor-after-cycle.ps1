Set-Location $PSScriptRoot
New-Item -ItemType File -Path ".autopilot-stop-after-cycle" -Force | Out-Null
Write-Host "The auditor will stop safely after the current cycle." -ForegroundColor Yellow
