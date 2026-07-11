# Hashtag Python

Aplicação bilíngue para ensinar Python desde conhecimentos digitais básicos até autonomia avançada. O foco principal é Python; IA local é uma especialização opcional posterior.

## Estado desta versão

- 28 fases publicadas: Fase 0 até Fase 27.
- O conteúdo publicado representa a **base de Python**, não a formação avançada completa.
- A tela **Trilhas** separa conteúdo disponível, próxima entrega e módulos planejados.
- A trilha principal continua por Python profissional, Python avançado, engenharia de software e capstones.
- A trilha opcional de IA local começa somente depois dos pré-requisitos de Python.

## Mudanças da revisão 1.1

- Fase 0 desbloqueada corretamente.
- Contadores usam `ALL_PHASES.length`; não existem mais totais fixos em 27.
- Fases só desbloqueiam com exame aprovado em 90%.
- Exercícios precisam ser executados e validados antes de concluir.
- Verificação de conhecimento exige 80% e permite tentar novamente.
- Exames possuem uma verificação estrutural inicial para reduzir respostas impressas e fixas.
- Rotas de onboarding e recuperação de senha conectadas.
- Novo mapa de formação profunda e especialização em IA local.
- Estrutura do pacote limpa: sem `.git`, `node_modules` ou projeto duplicado.

## Requisitos

- Node.js 22.12 ou superior.
- npm 10 ou superior.
- Projeto Supabase configurado para login e sincronização.

## Instalação

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Preencha `.env` com as chaves do Supabase antes de testar autenticação.

## Verificações

```powershell
npm run typecheck
npm run build
```

## Documentação

- `docs/CURRICULUM_STRATEGY.md`: estratégia pedagógica e ordem das futuras entregas.
- `docs/GIT_MIGRATION_WINDOWS.md`: como colocar esta versão limpa em uma nova pasta preservando o Git atual.
