# Hashtag Python

Aplicação bilíngue para ensinar Python desde conhecimentos digitais básicos até autonomia avançada. O foco principal é Python; IA local é uma especialização opcional posterior.

## Estado desta versão

- 28 fases publicadas: Fase 0 até Fase 27.
- O conteúdo publicado representa a **base de Python**, não a formação avançada completa.
- A tela **Trilhas** separa conteúdo disponível, próxima entrega e módulos planejados.
- A trilha principal continua por Python profissional, Python avançado, engenharia de software e capstones.
- A trilha opcional de IA local começa somente depois dos pré-requisitos de Python.

## Mudanças da revisão 1.3

- Catálogo de 17 habilidades cobrindo todas as fases publicadas.
- Diagnóstico inicial de dez conceitos, sem bloquear o curso.
- Domínio calculado por habilidade a partir de exercícios, quizzes, exames e revisões.
- Histórico local das últimas 500 tentativas por usuário.
- Dicas progressivas, reveladas uma por vez.
- Revisão espaçada em ciclos de 1, 3, 7, 14, 30 e 60 dias.
- Respostas incorretas entram na fila de revisão no mesmo dia.
- Painel de aprendizagem com domínio médio, lacunas e histórico.
- Recomendações de revisão na Home.
- Nova aba **Progresso** na navegação principal.
- 29 testes automatizados.

## Base técnica da revisão 1.2

- Execução Python isolada em Web Worker descartável.
- Timeout real de 6 segundos para interromper loops infinitos.
- Análise estrutural usando a AST do Python.
- Suporte a testes públicos e ocultos.
- Error Boundary e tela de configuração em vez de tela branca.
- Cache do runtime Pyodide após a primeira carga.
- `npm run check` valida tipagem, testes e build.
- Lockfile fixado no registro público do npm.

## Persistência adaptativa

O progresso formal das fases continua no Supabase. O diagnóstico, domínio por habilidade, histórico adaptativo e agenda de revisão da v1.3 ficam salvos localmente por usuário no navegador. A sincronização multi-dispositivo dessa camada será uma migração posterior, sem bloquear este deploy.

## Requisitos

- Node.js 22.12 ou superior.
- npm 10 ou superior.
- Projeto Supabase configurado para login e sincronização do progresso formal.

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
- `docs/GRADING_AUTHORING.md`: criação de testes estruturais e ocultos.
- `docs/RELEASE_NOTES_1.2.md`: motor isolado e avaliador verificado.
- `docs/RELEASE_NOTES_1.3.md`: aprendizagem adaptativa e revisão espaçada.
