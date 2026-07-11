# Hashtag Python

Aplicação bilíngue para ensinar Python desde conhecimento zero de computador até autonomia avançada. O foco principal é Python; IA local é uma especialização opcional depois da formação principal.

## Estado desta versão

- 28 fases publicadas: Fase 0 até Fase 27.
- O conteúdo publicado ainda representa a base de Python, não a formação avançada completa.
- A tela **Trilhas** separa o que já está disponível da formação profissional, avançada e das especializações futuras.
- A especialização de IA local começa apenas depois dos pré-requisitos de Python, dados e engenharia de software.

## Mudanças da versão 1.4

- Onboarding baseado na experiência real do aluno com computadores.
- Modo visitante sem cadastro obrigatório.
- Progresso local completo para visitantes.
- Migração do progresso ao criar uma conta.
- Base Zero interativa com arquivos, pastas, downloads, nuvem, terminal e hardware.
- Teste de preparo digital para alunos que podem pular os simuladores.
- Fase 0 refeita para combinar com a nova estratégia.
- Glossário clicável dentro das aulas.
- Botão **Não entendi** com explicação alternativa.
- Laboratório visual de variáveis, condições e loops.
- Sincronização opcional da aprendizagem adaptativa pelo Supabase.
- 35 testes automatizados.

## Base técnica

- Execução Python isolada em Web Worker descartável.
- Timeout real de 6 segundos para interromper loops infinitos.
- Análise estrutural usando a AST do Python.
- Testes públicos e ocultos.
- Diagnóstico, domínio por habilidade e revisão espaçada.
- Error Boundary e tela de configuração em vez de tela branca.
- Cache do runtime Pyodide após a primeira carga.
- Lockfile fixado no registro público do npm.

## Persistência

O progresso das fases usa Supabase para usuários autenticados e armazenamento local para visitantes. A camada adaptativa funciona localmente por padrão.

Para sincronizá-la entre dispositivos, execute:

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

- `docs/CURRICULUM_STRATEGY.md`: estratégia pedagógica e ordem das futuras entregas.
- `docs/GRADING_AUTHORING.md`: criação de testes estruturais e ocultos.
- `docs/RELEASE_NOTES_1.2.md`: motor isolado e avaliador verificado.
- `docs/RELEASE_NOTES_1.3.md`: aprendizagem adaptativa e revisão espaçada.
- `docs/RELEASE_NOTES_1.4.md`: Base Zero e alfabetização digital.
- `docs/UPDATE_1.4_WINDOWS.md`: atualização da versão no Windows.
