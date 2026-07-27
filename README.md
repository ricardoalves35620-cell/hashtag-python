# Hashtag Python

Aplicação bilíngue para aprender Python desde o primeiro contato com um computador até desenvolvimento profissional, engenharia e uma especialização opcional em IA local.

Versão atual: **10.25.0**

## O que o aluno encontra

- 54 fases na formação principal, da Fase 0 à Fase 53.
- 15 fases opcionais de dados e IA local, da Fase 54 à Fase 68.
- Aulas guiadas, prática deliberada, quiz, avaliação por execução e mini projetos.
- Python executado no navegador em um Web Worker isolado, com interrupção de loops infinitos.
- Progresso local no modo visitante e sincronização opcional para contas cadastradas.
- Interface em português e inglês.

## Começar

Requisitos: Node.js 22.12 ou superior e npm 10 ou superior.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

O Supabase é opcional para desenvolvimento e uso local. Sem configuração, a aplicação abre em modo visitante e salva o progresso somente no aparelho.

Para habilitar login, grupos e sincronização, preencha `.env.local`:

```text
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

Use apenas uma chave publicável ou a chave `anon` legada no navegador. Nunca coloque `service_role` ou outra chave secreta em variáveis `VITE_*`.

## Banco de dados

Para um projeto novo, execute no SQL Editor, nesta ordem:

1. `supabase/schema.sql`
2. `supabase/schema-groups.sql`
3. Os demais arquivos `supabase/*.sql` usados pelas funcionalidades desejadas.

Para um projeto que já utilizava os schemas anteriores, aplique também a migration em `supabase/migrations/`. Ela protege códigos de convite, remove escrita de pontuação pelo navegador, corrige as políticas recursivas e configura views e permissões explícitas.

Depois de aplicar mudanças no banco, rode os Advisors de segurança e desempenho no Supabase e valide criação, entrada e leitura de um grupo com dois usuários de teste.

## Verificações

```powershell
npm run typecheck
npm run test
npm run build
npm run audit:curriculum
npm run audit:v11:gate
npm audit
```

O gate completo usado antes de uma release é:

```powershell
npm run quality:gate
```

## Estrutura essencial

- `src/pages/`: telas e fluxos de aprendizagem.
- `src/components/`: componentes visuais e guardas de navegação.
- `src/data/phases/`: conteúdo curricular por bloco de fases.
- `src/lib/`: progresso, avaliação, sincronização e regras pedagógicas.
- `supabase/`: schemas e migrations.
- `audit/`: verificações automáticas de conteúdo e currículo.
- `docs/`: estratégia curricular, design, autoria de avaliações e histórico detalhado.

## Documentos principais

- `docs/CURRICULUM_STRATEGY.md`: organização das trilhas e princípios pedagógicos.
- `docs/CURRICULUM_AUDIT_STANDARD.md`: o que bloqueia ou não uma release.
- `docs/GRADING_AUTHORING.md`: como criar exercícios e avaliações verificáveis.
- `docs/DESIGN_SYSTEM.md`: componentes, tipografia, cores e acessibilidade.
- `docs/CI_SETUP.md`: configuração das verificações contínuas.
- `CHANGELOG.md`: histórico consolidado de versões.

## Princípios do produto

- Uma próxima ação clara vale mais do que muitas opções concorrendo pela atenção.
- A exploração da aula e a evidência de domínio são medidas diferentes.
- Fases, práticas e avaliações bloqueadas não podem ser abertas por URL direta.
- Termos técnicos são apresentados em linguagem comum antes do jargão.
- O modo visitante precisa continuar útil mesmo sem serviços externos.
