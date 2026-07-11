# Migrar o Git atual para uma pasta limpa no Windows

Este processo preserva o histórico, branch e remote do repositório antigo, mas usa somente os arquivos limpos deste ZIP.

## 1. Feche VS Code e servidores do projeto antigo

No terminal antigo, encerre `npm run dev` com `Ctrl+C`.

## 2. Extraia o ZIP em uma nova pasta

Exemplo:

```powershell
$old = "C:\Projetos\hashtag-python"
$new = "C:\Projetos\hashtag-python-clean"
$zip = "$env:USERPROFILE\Downloads\hashtag-python-clean.zip"

New-Item -ItemType Directory -Force -Path $new | Out-Null
Expand-Archive -Path $zip -DestinationPath $new -Force
```

Se o ZIP criar uma subpasta `hashtag-python`, use essa subpasta como `$new`.

## 3. Copie somente os metadados do Git

```powershell
Copy-Item -Path "$old\.git" -Destination "$new\.git" -Recurse -Force
```

Não copie `node_modules`, `dist` nem a pasta duplicada antiga.

## 4. Copie o `.env` separadamente, caso exista

```powershell
if (Test-Path "$old\.env") {
  Copy-Item "$old\.env" "$new\.env" -Force
}
```

Nunca envie o `.env` para o Git.

## 5. Confirme o repositório

```powershell
Set-Location $new
git status
git branch --show-current
git remote -v
```

É esperado que `git status` mostre exclusões da estrutura antiga e adições da nova estrutura.

## 6. Instale e valide

```powershell
node --version
npm install
npm run typecheck
npm run build
```

A versão do Node deve ser 22.12.0 ou superior.

## 7. Registre a limpeza

```powershell
git add -A
git commit -m "refactor: clean project and introduce curriculum paths"
git push origin main
```

## 8. Só depois remova a pasta antiga

Use a pasta antiga como backup até confirmar que o app abre, o build passa e o push aparece no GitHub.
