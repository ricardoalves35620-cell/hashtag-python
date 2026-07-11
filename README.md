# Hashtag Python

Aplicação bilíngue para ensinar Python desde conhecimentos digitais básicos até autonomia avançada. O foco principal é Python; IA local é uma especialização opcional posterior.

## Estado desta versão

- 28 fases publicadas: Fase 0 até Fase 27.
- O conteúdo publicado representa a **base de Python**, não a formação avançada completa.
- A tela **Trilhas** separa conteúdo disponível, próxima entrega e módulos planejados.
- A trilha principal continua por Python profissional, Python avançado, engenharia de software e capstones.
- A trilha opcional de IA local começa somente depois dos pré-requisitos de Python.

## Mudanças da revisão 1.2

- Execução Python isolada em Web Worker descartável.
- Timeout real de 6 segundos para interromper loops infinitos.
- Análise estrutural usando a AST do Python.
- Suporte a testes públicos e ocultos com valores não mostrados ao aluno.
- Primeiros testes ocultos de funções aplicados à Fase 13.
- Erros de configuração exibem instruções em vez de tela branca.
- Error Boundary para falhas inesperadas da interface.
- Cache do runtime Pyodide após a primeira carga.
- Vitest com 21 testes automatizados.
- `npm run check` valida typecheck, testes e build.
- Lockfile fixado no registro público do npm.

## Requisitos

- Node.js 22.12 ou superior.
- npm 10 ou superior.
- Projeto Supabase configurado para login e sincronização.

## Instalação

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Preencha `.env.local` com a URL e a chave pública do Supabase antes de testar autenticação. Nunca use uma chave `service_role` no navegador.

## Verificações

```powershell
npm run check
npm audit
```

## Documentação

- `docs/CURRICULUM_STRATEGY.md`: estratégia pedagógica e ordem das futuras entregas.
- `docs/GIT_MIGRATION_WINDOWS.md`: como colocar esta versão limpa em uma nova pasta preservando o Git atual.
- `docs/GRADING_AUTHORING.md`: como criar testes estruturais e testes ocultos de comportamento.
- `docs/RELEASE_NOTES_1.2.md`: alterações e limites conhecidos desta entrega.
- `docs/UPDATE_1.2_WINDOWS.md`: atualização direta do diretório atual no Windows.
