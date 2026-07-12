$source = (Get-Location).Path
$parent = Split-Path $source -Parent
$name = Split-Path $source -Leaf
$zip = Join-Path $parent "$name-source.zip"
$staging = Join-Path $parent "$name-package-temp"

Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $zip -Force -ErrorAction SilentlyContinue
robocopy $source $staging /E /XD ".git" "node_modules" "dist" ".vite" /XF ".env" ".env.local" ".env.production" "*.log"
if ($LASTEXITCODE -ge 8) { throw "Robocopy failed with code $LASTEXITCODE" }
Compress-Archive -Path "$staging\*" -DestinationPath $zip -CompressionLevel Optimal
Remove-Item $staging -Recurse -Force
Write-Host "ZIP criado em: $zip"
