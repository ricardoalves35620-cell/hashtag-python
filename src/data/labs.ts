import type { Bilingual } from './types'

export interface LabMission {
  id: string
  title: Bilingual
  objective: Bilingual
  command: string
  explanation: Bilingual
  expectedToken: string
}

export const PROJECT_LAB_MISSIONS: LabMission[] = [
  {
    id: 'mkdir', command: 'mkdir finance-cli', expectedToken: 'finance-cli',
    title: { en: 'Create the project boundary', pt: 'Crie a fronteira do projeto' },
    objective: { en: 'Create one dedicated folder instead of scattering files on the desktop.', pt: 'Crie uma pasta dedicada em vez de espalhar arquivos na área de trabalho.' },
    explanation: { en: 'A project folder is the unit you version, test, document and move between machines.', pt: 'A pasta do projeto é a unidade que você versiona, testa, documenta e move entre máquinas.' },
  },
  {
    id: 'venv', command: 'python -m venv .venv', expectedToken: '.venv',
    title: { en: 'Create an isolated environment', pt: 'Crie um ambiente isolado' },
    objective: { en: 'Give the project a private Python package environment.', pt: 'Dê ao projeto um ambiente privado de pacotes Python.' },
    explanation: { en: 'The environment prevents dependency changes in one project from breaking another.', pt: 'O ambiente impede que dependências de um projeto quebrem outro.' },
  },
  {
    id: 'layout', command: 'mkdir src tests', expectedToken: 'src',
    title: { en: 'Separate product and verification', pt: 'Separe produto e verificação' },
    objective: { en: 'Create src for application code and tests for executable requirements.', pt: 'Crie src para o código e tests para requisitos executáveis.' },
    explanation: { en: 'The separation makes responsibilities visible and prevents test files from becoming production modules.', pt: 'A separação torna responsabilidades visíveis e evita que testes virem módulos de produção.' },
  },
  {
    id: 'install', command: 'python -m pip install pytest', expectedToken: 'pytest',
    title: { en: 'Install the test runner', pt: 'Instale o executor de testes' },
    objective: { en: 'Install a direct development dependency inside the active environment.', pt: 'Instale uma dependência de desenvolvimento no ambiente ativo.' },
    explanation: { en: 'Using python -m pip ties pip to the exact Python interpreter you intend to use.', pt: 'Usar python -m pip liga o pip ao interpretador Python correto.' },
  },
  {
    id: 'test', command: 'python -m pytest', expectedToken: 'pytest',
    title: { en: 'Run the evidence', pt: 'Execute a evidência' },
    objective: { en: 'Run all tests before creating a checkpoint.', pt: 'Execute todos os testes antes de criar um checkpoint.' },
    explanation: { en: 'A green test run is evidence that known behavior survived the change.', pt: 'Testes verdes são evidência de que o comportamento conhecido sobreviveu à mudança.' },
  },
  {
    id: 'git-init', command: 'git init', expectedToken: 'git init',
    title: { en: 'Start change history', pt: 'Inicie o histórico' },
    objective: { en: 'Create a repository only at the project root.', pt: 'Crie um repositório apenas na raiz do projeto.' },
    explanation: { en: 'One repository should describe one coherent project boundary.', pt: 'Um repositório deve descrever uma fronteira coerente de projeto.' },
  },
  {
    id: 'review', command: 'git diff --staged', expectedToken: '--staged',
    title: { en: 'Review before committing', pt: 'Revise antes do commit' },
    objective: { en: 'Inspect exactly what will enter history.', pt: 'Inspecione exatamente o que entrará no histórico.' },
    explanation: { en: 'Review catches secrets, generated files and unrelated changes before they become permanent history.', pt: 'A revisão encontra segredos, arquivos gerados e mudanças não relacionadas antes do histórico permanente.' },
  },
  {
    id: 'commit', command: 'git commit -m "feat: add finance summary"', expectedToken: 'feat:',
    title: { en: 'Create a coherent checkpoint', pt: 'Crie um checkpoint coerente' },
    objective: { en: 'Describe the behavior added, not merely that files changed.', pt: 'Descreva o comportamento adicionado, não apenas que arquivos mudaram.' },
    explanation: { en: 'A useful message helps a future reader understand why the change exists.', pt: 'Uma mensagem útil ajuda a entender por que a mudança existe.' },
  },
]

export interface ArchitectureChallenge {
  id: string
  title: Bilingual
  scenario: Bilingual
  options: Bilingual[]
  correctIndex: number
  explanation: Bilingual
}

export const ENGINEERING_LAB_CHALLENGES: ArchitectureChallenge[] = [
  {
    id: 'async-choice',
    title: { en: 'Choose a concurrency model', pt: 'Escolha um modelo de concorrência' },
    scenario: { en: 'A service must wait for 500 independent HTTP responses. Each response takes 100–800 ms and CPU work is tiny.', pt: 'Um serviço precisa esperar 500 respostas HTTP independentes. Cada uma leva 100–800 ms e o uso de CPU é mínimo.' },
    options: [
      { en: 'Use asyncio with bounded concurrency and timeouts', pt: 'Usar asyncio com concorrência limitada e timeouts' },
      { en: 'Start 500 CPU processes', pt: 'Iniciar 500 processos de CPU' },
      { en: 'Run requests one by one forever', pt: 'Executar requisições uma por vez para sempre' },
      { en: 'Share one mutable global result without synchronization', pt: 'Compartilhar um resultado global mutável sem sincronização' },
    ],
    correctIndex: 0,
    explanation: { en: 'The workload is dominated by waiting. Asyncio can coordinate many pending operations, but concurrency should still be bounded and every call needs a deadline.', pt: 'A carga é dominada por espera. Asyncio coordena muitas operações pendentes, mas a concorrência deve ser limitada e toda chamada precisa de prazo.' },
  },
  {
    id: 'sql-boundary',
    title: { en: 'Protect a database boundary', pt: 'Proteja uma fronteira de banco' },
    scenario: { en: 'A search endpoint receives a status value from the URL and queries SQLite.', pt: 'Um endpoint de busca recebe um status pela URL e consulta SQLite.' },
    options: [
      { en: 'Use a parameter placeholder and pass status separately', pt: 'Usar placeholder e passar status separadamente' },
      { en: 'Insert the status with an f-string', pt: 'Inserir o status com f-string' },
      { en: 'Remove quotes from the input and trust it', pt: 'Remover aspas da entrada e confiar' },
      { en: 'Log the entire authorization header before the query', pt: 'Registrar todo o header de autorização antes da query' },
    ],
    correctIndex: 0,
    explanation: { en: 'Parameterized values prevent SQL injection and keep query structure separate from data.', pt: 'Valores parametrizados evitam SQL injection e mantêm estrutura da consulta separada dos dados.' },
  },
  {
    id: 'cache-key',
    title: { en: 'Design a safe cache key', pt: 'Projete uma chave de cache segura' },
    scenario: { en: 'A report result depends on account_id, month and currency.', pt: 'Um relatório depende de account_id, mês e moeda.' },
    options: [
      { en: 'Use all three values and define expiration or invalidation', pt: 'Usar os três valores e definir expiração ou invalidação' },
      { en: 'Cache only by month', pt: 'Cachear apenas pelo mês' },
      { en: 'Cache every result forever', pt: 'Cachear todo resultado para sempre' },
      { en: 'Use the user name as the only key', pt: 'Usar apenas o nome do usuário como chave' },
    ],
    correctIndex: 0,
    explanation: { en: 'An incomplete key can return one account or currency to another request. Cache lifetime must match how the underlying data changes.', pt: 'Chave incompleta pode devolver conta ou moeda errada. A vida do cache deve acompanhar a mudança dos dados.' },
  },
  {
    id: 'service-boundary',
    title: { en: 'Separate policy from infrastructure', pt: 'Separe política de infraestrutura' },
    scenario: { en: 'A claim approval rule currently imports the web framework request and writes directly to the database.', pt: 'Uma regra de aprovação importa o request do framework e grava diretamente no banco.' },
    options: [
      { en: 'Move the approval rule into a pure domain function and inject a repository at the application boundary', pt: 'Mover a regra para função de domínio pura e injetar repositório na fronteira da aplicação' },
      { en: 'Pass the request object deeper into every class', pt: 'Passar o request mais fundo em todas as classes' },
      { en: 'Add more global variables', pt: 'Adicionar mais variáveis globais' },
      { en: 'Hide the database call inside a decorator with no tests', pt: 'Esconder o banco em decorator sem testes' },
    ],
    correctIndex: 0,
    explanation: { en: 'The domain should express policy with ordinary values. Infrastructure adapters translate and persist at the edges.', pt: 'O domínio deve expressar política com valores comuns. Adaptadores traduzem e persistem nas bordas.' },
  },
  {
    id: 'release-gate',
    title: { en: 'Choose a release gate', pt: 'Escolha um gate de release' },
    scenario: { en: 'Tests passed locally, but the build artifact has never been installed in a clean environment.', pt: 'Testes passaram localmente, mas o artefato nunca foi instalado em ambiente limpo.' },
    options: [
      { en: 'Build in CI, install the artifact in a clean job and run smoke tests before publishing', pt: 'Fazer build no CI, instalar o artefato em job limpo e rodar smoke tests antes de publicar' },
      { en: 'Publish directly from the developer laptop', pt: 'Publicar direto do notebook do desenvolvedor' },
      { en: 'Skip the build because source tests passed', pt: 'Pular o build porque testes do fonte passaram' },
      { en: 'Reuse an unknown cache and assume it is correct', pt: 'Reusar cache desconhecido e assumir que está correto' },
    ],
    correctIndex: 0,
    explanation: { en: 'The artifact is what users receive. It needs independent verification in a reproducible environment.', pt: 'O artefato é o que usuários recebem. Ele precisa de validação independente em ambiente reproduzível.' },
  },
]
