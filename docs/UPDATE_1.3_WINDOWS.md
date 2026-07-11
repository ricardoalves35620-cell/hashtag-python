# Atualizar para a v1.3 no Windows

Diretório esperado:

```text
C:\Users\Ricar\OneDrive\Área de Trabalho\Hashtag Python Learning\hashtag-python
```

Pare o servidor e execute no PowerShell:

```powershell
$project = "C:\Users\Ricar\OneDrive\Área de Trabalho\Hashtag Python Learning\hashtag-python"
$zip = "$env:USERPROFILE\Downloads\hashtag-python-v1.3.zip"

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Set-Location $project

$obsolete = @(
  ".\hashtag-python",
  ".\src\pages\Family.tsx",
  ".\src\pages\Family.tsx.bak",
  ".\src\data\fasttrack_day1.ts",
  ".\src\data\phases\phase2.ts",
  ".\src\data\phases\phase3.ts",
  ".\src\data\phases\phase4.ts",
  ".\src\data\phases\phase5.ts",
  ".\src\data\phases\phase6.ts",
  ".\src\data\phases\phase7.ts",
  ".\src\data\phases\phase8.ts",
  ".\src\data\phases\stubs.ts",
  ".\SUBSTITUICAO_INTELIGENTE.txt",
  ".\audit.py"
)

foreach ($item in $obsolete) {
  Remove-Item $item -Recurse -Force -ErrorAction SilentlyContinue
}

Expand-Archive -Path $zip -DestinationPath $project -Force
npm ci
npm run check
npm audit
npm run dev
```

O ZIP não contém `.git`, `.env.local`, `node_modules` nem `dist`.
