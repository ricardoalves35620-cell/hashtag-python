# Release 1.1 — base limpa e nova estratégia

## Produto

- Nova tela **Trilhas** com formação principal em Python e especialização opcional em IA local.
- O app agora diferencia claramente conteúdo disponível, próxima entrega e conteúdo planejado.
- As 28 fases atuais foram reposicionadas honestamente como base publicada.
- FastTrack passou a ser apresentado como orientação, não como formação completa.

## Aprendizagem

- Exercícios exigem execução válida antes de avançar.
- Saídas esperadas são verificadas em português ou inglês quando disponíveis.
- Placeholders não preenchidos impedem a validação.
- Quiz exige 80% e permite nova tentativa.
- Exame continua exigindo 90%.
- Verificação estrutural reduz exames aprovados por simples impressão de palavras esperadas.

## Correções

- Fase 0 desbloqueada.
- Totais dinâmicos com `ALL_PHASES.length`.
- Próxima fase dinâmica; ao concluir a última fase, o aluno vai para o roadmap.
- Rotas de onboarding e redefinição de senha conectadas.
- Listener de visibilidade da Home limpo corretamente.
- Navegação inferior corrigida para safe area.

## Engenharia

- Projeto duplicado removido.
- Arquivos antigos e backups removidos.
- Node 22.12 definido em `engines` e `.nvmrc`.
- Vite atualizado para a linha 7.
- Bundle separado em React, Supabase, editor, FastTrack e conteúdo das fases.
- `npm run typecheck`, `npm run build` e `npm audit` aprovados.

## Limites conhecidos

- Pyodide ainda é baixado de CDN e não possui timeout real em Worker.
- A validação atual é uma camada inicial; testes ocultos por exercício continuam no backlog.
- A formação profissional e avançada está no roadmap, mas ainda precisa ser produzida.
