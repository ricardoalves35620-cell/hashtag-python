# Hashtag Python

Aplicação bilíngue para ensinar Python desde conhecimento zero de computador até autonomia avançada em engenharia de software. O foco principal é Python. A construção de IA local é uma especialização opcional, liberada depois da formação principal.

## Estado da versão 4.0

- **69 fases publicadas:** Fase 0 até Fase 68.
- **Trilha obrigatória de Python:** fases 0–53.
- **Trilha opcional de IA local:** fases 54–68.
- Laboratórios práticos para projetos profissionais, engenharia e IA local.
- Avaliação por execução, estrutura do código, testes públicos e testes ocultos.
- Domínio por habilidade, histórico de tentativas e revisão espaçada.

## Formação principal em Python

### Base e fundamentos — fases 0–27

- alfabetização digital;
- sintaxe, tipos, decisões, loops e coleções;
- funções, arquivos, JSON e biblioteca padrão;
- projetos completos de consolidação.

### Python profissional — fases 28–39

- estrutura de projetos;
- ambientes virtuais e dependências;
- módulos, pacotes, CLI e imports;
- Git;
- pytest e debugging;
- logging, configuração e tipagem;
- orientação a objetos e `dataclasses`;
- capstone profissional.

### Python avançado e engenharia — fases 40–53

- iteradores, generators, closures e decorators;
- context managers e modelo de dados;
- protocols e generics;
- `asyncio`, threads e processos;
- profiling, caching e desempenho;
- SQL e transações;
- HTTP e contratos de API;
- arquitetura, segurança, packaging e CI;
- capstone de domínio.

## Especialização opcional em IA local — fases 54–68

- matemática, NumPy, Pandas, estatística e qualidade de dados;
- Machine Learning clássico e avaliação;
- redes neurais e sistemas de treino com PyTorch;
- tokenização, embeddings, attention e Transformers;
- modelos abertos, licenças, GGUF e quantização;
- inferência local, RAG e avaliação;
- capstone: copiloto privado de documentos com fontes.

A trilha não depende de OpenAI, Anthropic ou outra API paga. Exercícios compatíveis rodam no navegador. PyTorch, GPU e modelos locais reais exigem prática em um ambiente Python desktop, indicada claramente nas fases correspondentes.

## Laboratórios

- `/project-lab`: estrutura de projetos, comandos, testes e commits.
- `/engineering-lab`: arquitetura, persistência, APIs, segurança e entrega.
- `/ai-lab`: planejamento de hardware, memória de pesos, arquitetura RAG e checklist do produto local.

## Base técnica

- React, TypeScript e Vite.
- Execução Python isolada em Web Worker descartável.
- Timeout real para interromper loops infinitos.
- Pyodide com carregamento automático de NumPy/Pandas quando importados.
- Análise estrutural usando a AST do Python.
- Testes públicos e ocultos.
- Error Boundary e tela de configuração em vez de tela branca.
- PWA com cache do runtime Pyodide.
- Supabase para autenticação e sincronização de usuários cadastrados.
- Modo visitante com progresso local.

## Persistência

O progresso das fases usa Supabase para usuários autenticados e armazenamento local para visitantes. A camada adaptativa funciona localmente por padrão.

Para sincronizar diagnóstico, domínio, tentativas e revisões entre dispositivos, execute:

```text
supabase/learning-states.sql
```

A aplicação continua funcionando se essa tabela opcional ainda não tiver sido criada.

## Requisitos

- Node.js 22.12 ou superior.
- npm 10 ou superior.
- Projeto Supabase configurado para autenticação e sincronização de usuários cadastrados.

## Instalação

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Preencha `.env.local` com a URL e a chave pública do Supabase. Nunca use `service_role` ou outra chave secreta no navegador.

## Verificações

```powershell
npm run check
npm audit
```

## Documentação

- `docs/CURRICULUM_STRATEGY.md`: estratégia pedagógica e arquitetura das trilhas.
- `docs/GRADING_AUTHORING.md`: criação de testes estruturais e ocultos.
- `docs/RELEASE_NOTES_1.2.md`: motor isolado e avaliador verificado.
- `docs/RELEASE_NOTES_1.3.md`: aprendizagem adaptativa e revisão espaçada.
- `docs/RELEASE_NOTES_1.4.md`: Base Zero e alfabetização digital.
- `docs/RELEASE_NOTES_2.0.md`: Python profissional.
- `docs/RELEASE_NOTES_3.0.md`: Python avançado e engenharia.
- `docs/RELEASE_NOTES_4.0.md`: dados, Machine Learning e IA local.
