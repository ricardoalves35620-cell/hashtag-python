# Atualizar o projeto atual para a versão 1.2

Diretório usado pelo projeto:

```text
C:\Users\Ricar\OneDrive\Área de Trabalho\Hashtag Python Learning\hashtag-python
```

O ZIP da versão 1.2 contém os arquivos do projeto diretamente na raiz. Ele pode ser extraído sobre o diretório atual com `-Force`.

```powershell
$project = "C:\Users\Ricar\OneDrive\Área de Trabalho\Hashtag Python Learning\hashtag-python"
$zip = "$env:USERPROFILE\Downloads\hashtag-python-v1.2.zip"

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Expand-Archive -Path $zip -DestinationPath $project -Force
Set-Location $project

npm ci
npm run check
npm audit
npm run dev
```

O arquivo `.env.local` não está no ZIP e não será substituído.

Depois da validação:

```powershell
git add -A
git commit -m "feat: add isolated Python runtime and verified grading"
git push origin main
```
