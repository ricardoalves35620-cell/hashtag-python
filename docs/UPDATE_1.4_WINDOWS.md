# Atualização 1.4 no Windows

Pare o servidor antes de substituir os arquivos.

```powershell
$project = "C:\Users\Ricar\OneDrive\Área de Trabalho\Hashtag Python Learning\hashtag-python"
$zip = "$env:USERPROFILE\Downloads\hashtag-python-v1.4.zip"

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Expand-Archive -Path $zip -DestinationPath $project -Force
Set-Location $project
npm ci
npm run check
npm audit
npm run dev
```

O ZIP não contém `.git`, `node_modules`, `dist` ou arquivos `.env`.

## Sincronização adaptativa

Para sincronizar a aprendizagem adaptativa entre dispositivos, execute o conteúdo de:

```text
supabase/learning-states.sql
```

no SQL Editor do projeto Supabase.
