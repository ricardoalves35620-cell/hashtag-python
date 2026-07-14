# Hashtag Python

**Versão atual: 10.16.0 — Sprint 10.5: projeto integrador de Dados e Machine Learning.**

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


## Learning Engine V2.4

Os blocos de fundamentos agora terminam em mini projetos com cinco checkpoints: entender, planejar, implementar, testar e refatorar. As entradas sugeridas são as mesmas usadas na validação, e um único exemplo nunca é tratado como prova suficiente.

Para sincronizar mini projetos entre dispositivos, execute:

```text
supabase/learning-project-progress.sql
```

Detalhes: `docs/RELEASE_NOTES_LEARNING_ENGINE_V2.4.md`.


## Learning Engine V2.6

As fases 0–27 da trilha de fundamentos agora possuem roteiros pedagógicos escritos individualmente. Funções, parâmetros, documentação, escopo, arquivos, JSON, datas, biblioteca padrão, tratamento de erros e os quatro projetos de consolidação ensinam o caminho mental antes da sintaxe.

A progressão normal foi preservada: não existe atalho de proprietário ou administrador para abrir fases bloqueadas. A auditoria integral continua sendo responsabilidade dos agentes automatizados.

Detalhes: `docs/RELEASE_NOTES_LEARNING_ENGINE_V2.6.md`.

## Learning Engine V2.7

As fases 28–39 da trilha Python profissional agora possuem roteiros pedagógicos escritos individualmente. O aluno aprende por que projetos são divididos, como ambientes e imports funcionam, como uma CLI se torna uma fronteira, como Git registra intenção, como testes produzem evidência e como tipos, logging, depuração e composição sustentam software modificável.

A progressão normal continua preservada. Não há desbloqueio de proprietário; os agentes automatizados auditam o conteúdo ainda bloqueado para o aluno.

Detalhes: `docs/RELEASE_NOTES_LEARNING_ENGINE_V2.7.md`.

## Learning Engine V2.11

As fases 1–27 agora exigem evidência de comportamento em pelo menos duas práticas. As fases 9–27 incluem um desafio separado de transferência com caso visível e caso oculto diferente. Todos os exames de fundamentos preservam contrato visível, total de 100 pontos e uma verificação oculta adequada ao conhecimento já ensinado.

As primeiras jornadas também foram corrigidas para acompanhar a sequência real: saída com `print()`, operadores, variáveis e entrada do usuário.

Detalhes: `docs/RELEASE_NOTES_LEARNING_ENGINE_V2.11.md`.

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


## Current foundation release

Foundation 1.6 adds final motion polish, accessible loading and success feedback, and reliable mouse, trackpad and touch scrolling.

## Sprint 3 — Localization quality

Portuguese and English now share the same localization architecture. Python comments are localized for Portuguese learners, Phase 5 was manually revised in both languages, glossary terms only match complete words, and automated tests verify bilingual content completeness. See `docs/LOCALIZATION_GUIDE.md`.


## Sprint 7.3

Auditor provenance checks and bilingual fixes for phases 1–4. See `docs/RELEASE_NOTES_SPRINT_7_3.md`.


## Qualidade contínua

```powershell
npm run quality:gate
```

Validação local compacta:

```powershell
.\run-auditor.ps1 -Cycles 69 -NoOpen
```

Use `-DetailedReport` somente quando vídeos e traces forem necessários.

Configuração: `docs/CI_SETUP.md`  
Critérios de release: `docs/RELEASE_READINESS.md`


## Learning Engine V2.9

As fases 54–68 agora possuem jornadas individuais para matemática de IA, NumPy, Pandas, estatística, fluxo de Machine Learning, regressão, classificação, redes neurais, PyTorch, tokenização, Transformers, modelos locais, ferramentas seguras, RAG e o capstone de copiloto privado.

A trilha de IA mantém a filosofia do projeto: primeiro compreender os dados, contratos, riscos e evidências; depois usar bibliotecas ou modelos. O capstone continua sem depender de uma API externa de modelo.

Detalhes: `docs/RELEASE_NOTES_LEARNING_ENGINE_V2.9.md`.

## Learning Engine V2.8

As fases 40–53 agora possuem roteiros individuais para Python avançado e engenharia. Todo exame mostra entradas visíveis e saída ou comportamento esperado antes da correção. Casos ocultos continuam protegidos. O contrato publicado é auditado contra os mesmos checks do validador.

Detalhes: `docs/RELEASE_NOTES_LEARNING_ENGINE_V2.8.md`.


## Learning Engine V2.10

A auditoria pedagógica antiga foi substituída por um gate que entende as dez etapas reais da jornada, contratos visíveis de exame, prática verificada, generalização, progressão, projetos e conteúdo bilíngue. O relatório não esconde melhorias pendentes: apenas contradições capazes de enganar o aluno bloqueiam uma release.

Execute:

```powershell
npm run audit:curriculum
```

Detalhes: `docs/RELEASE_NOTES_LEARNING_ENGINE_V2.10.md` e `docs/CURRICULUM_AUDIT_STANDARD.md`.

## Sprint 10.1 — projeto integrador e portfólio

A Fase 27 agora termina com o projeto **Central de Sinistros CLI**. O projeto exige planejamento, funções, coleções, loop de comandos, validação, tratamento de exceções, testes normais e testes de falha. Depois de concluído, o aluno pode abrir `/portfolio` e exportar um README criado a partir do próprio planejamento, código e evidências de teste. A progressão normal do curso continua preservada.

## Sprint 10.2 — projeto integrador de Python profissional

A Fase 39 agora termina em um serviço de triagem de sinistros que combina `dataclass`, type hints, logging, validação, exceções, funções focadas, CLI e `if __name__ == "__main__"`. O portfólio passa a reunir dois artefatos gerados a partir do planejamento, código, testes e refatorações do próprio aluno.

O segundo artefato permanece oculto até a Fase 39 ficar disponível pela progressão normal.

Detalhes: `docs/RELEASE_NOTES_SPRINT_10.2.md`.

## Sprint 10.6

Adds the Phase 64 Transformer Attention portfolio integrator and cross-device synchronization V2 for learning history, journey progress, journals, projects, exam drafts and account preferences. Run `supabase/cross-device-sync-v2.sql` after deployment.
