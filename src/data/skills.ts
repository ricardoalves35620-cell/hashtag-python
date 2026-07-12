import type { Bilingual } from './types'

export type SkillCategory = 'digital' | 'fundamentals' | 'problem-solving' | 'professional' | 'advanced' | 'engineering' | 'ai'

export interface SkillDefinition {
  id: string
  title: Bilingual
  description: Bilingual
  category: SkillCategory
  phaseIds: number[]
}

export const SKILLS: SkillDefinition[] = [
  {
    id: 'digital.basics', category: 'digital', phaseIds: [0],
    title: { en: 'Digital foundations', pt: 'Fundamentos digitais' },
    description: { en: 'Files, folders, tools and where code runs.', pt: 'Arquivos, pastas, ferramentas e onde o código é executado.' },
  },
  {
    id: 'python.output', category: 'fundamentals', phaseIds: [1],
    title: { en: 'Output and print', pt: 'Saída e print' },
    description: { en: 'Show information clearly with print().', pt: 'Mostrar informações claramente com print().' },
  },
  {
    id: 'python.operators', category: 'fundamentals', phaseIds: [2],
    title: { en: 'Operators and calculations', pt: 'Operadores e cálculos' },
    description: { en: 'Use arithmetic and comparison operators correctly.', pt: 'Usar operadores aritméticos e de comparação corretamente.' },
  },
  {
    id: 'python.variables', category: 'fundamentals', phaseIds: [3],
    title: { en: 'Variables and types', pt: 'Variáveis e tipos' },
    description: { en: 'Store, name and transform values.', pt: 'Armazenar, nomear e transformar valores.' },
  },
  {
    id: 'python.input', category: 'fundamentals', phaseIds: [4],
    title: { en: 'Input and conversion', pt: 'Entrada e conversão' },
    description: { en: 'Read user input and convert it safely.', pt: 'Ler entradas do usuário e convertê-las com segurança.' },
  },
  {
    id: 'python.conditionals', category: 'problem-solving', phaseIds: [5, 6],
    title: { en: 'Decisions', pt: 'Decisões' },
    description: { en: 'Model choices with if, elif and else.', pt: 'Modelar escolhas com if, elif e else.' },
  },
  {
    id: 'python.while', category: 'problem-solving', phaseIds: [7],
    title: { en: 'While loops', pt: 'Loops while' },
    description: { en: 'Repeat while a condition remains true.', pt: 'Repetir enquanto uma condição permanecer verdadeira.' },
  },
  {
    id: 'python.for', category: 'problem-solving', phaseIds: [8],
    title: { en: 'For loops', pt: 'Loops for' },
    description: { en: 'Process collections item by item.', pt: 'Processar coleções item por item.' },
  },
  {
    id: 'python.lists', category: 'fundamentals', phaseIds: [9],
    title: { en: 'Lists', pt: 'Listas' },
    description: { en: 'Store and modify ordered collections.', pt: 'Armazenar e modificar coleções ordenadas.' },
  },
  {
    id: 'python.dictionaries', category: 'fundamentals', phaseIds: [10],
    title: { en: 'Dictionaries', pt: 'Dicionários' },
    description: { en: 'Represent structured key-value data.', pt: 'Representar dados estruturados em chave e valor.' },
  },
  {
    id: 'python.collections', category: 'fundamentals', phaseIds: [11, 12],
    title: { en: 'Collections and comprehensions', pt: 'Coleções e comprehensions' },
    description: { en: 'Combine collections and transform data concisely.', pt: 'Combinar coleções e transformar dados de forma concisa.' },
  },
  {
    id: 'python.functions', category: 'problem-solving', phaseIds: [13, 14, 15, 16],
    title: { en: 'Functions', pt: 'Funções' },
    description: { en: 'Decompose problems into reusable functions.', pt: 'Dividir problemas em funções reutilizáveis.' },
  },
  {
    id: 'python.files', category: 'fundamentals', phaseIds: [17, 18],
    title: { en: 'Files', pt: 'Arquivos' },
    description: { en: 'Read, write and protect file operations.', pt: 'Ler, gravar e proteger operações com arquivos.' },
  },
  {
    id: 'python.json', category: 'fundamentals', phaseIds: [19],
    title: { en: 'JSON data', pt: 'Dados JSON' },
    description: { en: 'Serialize and deserialize structured data.', pt: 'Serializar e desserializar dados estruturados.' },
  },
  {
    id: 'python.standard-library', category: 'fundamentals', phaseIds: [20, 21, 22],
    title: { en: 'Standard library', pt: 'Biblioteca padrão' },
    description: { en: 'Use date, random and math modules responsibly.', pt: 'Usar os módulos date, random e math corretamente.' },
  },
  {
    id: 'python.errors', category: 'problem-solving', phaseIds: [23],
    title: { en: 'Errors and recovery', pt: 'Erros e recuperação' },
    description: { en: 'Understand failures and recover with try/except.', pt: 'Entender falhas e recuperar com try/except.' },
  },
  {
    id: 'python.projects', category: 'problem-solving', phaseIds: [24, 25, 26, 27],
    title: { en: 'Project integration', pt: 'Integração em projetos' },
    description: { en: 'Combine several concepts in complete programs.', pt: 'Combinar vários conceitos em programas completos.' },
  },
  {
    id: 'professional.projects', category: 'professional', phaseIds: [28, 31, 39],
    title: { en: 'Project architecture', pt: 'Arquitetura de projetos' },
    description: { en: 'Structure multi-file projects around clear responsibilities.', pt: 'Estruturar projetos multi-arquivo com responsabilidades claras.' },
  },
  {
    id: 'professional.dependencies', category: 'professional', phaseIds: [29],
    title: { en: 'Environments and dependencies', pt: 'Ambientes e dependências' },
    description: { en: 'Create reproducible isolated environments.', pt: 'Criar ambientes isolados e reproduzíveis.' },
  },
  {
    id: 'professional.modules', category: 'professional', phaseIds: [30, 31, 32],
    title: { en: 'Modules, packages and CLI', pt: 'Módulos, pacotes e CLI' },
    description: { en: 'Design importable modules and stable command interfaces.', pt: 'Projetar módulos importáveis e interfaces de comando estáveis.' },
  },
  {
    id: 'professional.git', category: 'professional', phaseIds: [33],
    title: { en: 'Git workflow', pt: 'Fluxo Git' },
    description: { en: 'Create reviewable and reversible change history.', pt: 'Criar histórico revisável e reversível.' },
  },
  {
    id: 'professional.testing', category: 'professional', phaseIds: [34, 35],
    title: { en: 'Testing and debugging', pt: 'Testes e depuração' },
    description: { en: 'Build evidence and diagnose failures systematically.', pt: 'Construir evidência e diagnosticar falhas sistematicamente.' },
  },
  {
    id: 'professional.quality', category: 'professional', phaseIds: [36, 37],
    title: { en: 'Logging, configuration and typing', pt: 'Logging, configuração e tipos' },
    description: { en: 'Make contracts and operational behavior visible.', pt: 'Tornar contratos e comportamento operacional visíveis.' },
  },
  {
    id: 'professional.oop', category: 'professional', phaseIds: [38, 39],
    title: { en: 'Object design and integration', pt: 'Design de objetos e integração' },
    description: { en: 'Protect invariants and combine professional practices.', pt: 'Proteger invariantes e combinar práticas profissionais.' },
  },
  {
    id: 'advanced.iteration', category: 'advanced', phaseIds: [40, 41],
    title: { en: 'Iteration and lazy pipelines', pt: 'Iteração e pipelines lazy' },
    description: { en: 'Build iterators and generators for streaming work.', pt: 'Criar iteradores e generators para processamento em fluxo.' },
  },
  {
    id: 'advanced.metaprogramming', category: 'advanced', phaseIds: [42, 43, 44],
    title: { en: 'Decorators and Python protocols', pt: 'Decorators e protocolos Python' },
    description: { en: 'Wrap behavior, manage resources and integrate with the data model.', pt: 'Envolver comportamento, gerenciar recursos e integrar ao modelo de dados.' },
  },
  {
    id: 'advanced.typing', category: 'advanced', phaseIds: [45],
    title: { en: 'Protocols and generics', pt: 'Protocols e generics' },
    description: { en: 'Describe behavior-based contracts with advanced typing.', pt: 'Descrever contratos por comportamento com tipagem avançada.' },
  },
  {
    id: 'advanced.concurrency', category: 'advanced', phaseIds: [46, 47],
    title: { en: 'Async and concurrency', pt: 'Async e concorrência' },
    description: { en: 'Choose and control asynchronous, threaded and process work.', pt: 'Escolher e controlar trabalho assíncrono, threads e processos.' },
  },
  {
    id: 'engineering.performance', category: 'engineering', phaseIds: [48],
    title: { en: 'Performance engineering', pt: 'Engenharia de desempenho' },
    description: { en: 'Profile bottlenecks and design safe caches.', pt: 'Medir gargalos e projetar caches seguros.' },
  },
  {
    id: 'engineering.persistence', category: 'engineering', phaseIds: [49],
    title: { en: 'SQL and transactions', pt: 'SQL e transações' },
    description: { en: 'Persist data with constraints, parameters and atomic changes.', pt: 'Persistir dados com constraints, parâmetros e mudanças atômicas.' },
  },
  {
    id: 'engineering.apis', category: 'engineering', phaseIds: [50],
    title: { en: 'HTTP and API contracts', pt: 'HTTP e contratos de API' },
    description: { en: 'Design resilient boundaries for remote communication.', pt: 'Projetar fronteiras resilientes para comunicação remota.' },
  },
  {
    id: 'engineering.architecture', category: 'engineering', phaseIds: [51, 53],
    title: { en: 'Architecture and security', pt: 'Arquitetura e segurança' },
    description: { en: 'Separate policy from infrastructure and protect trust boundaries.', pt: 'Separar política de infraestrutura e proteger fronteiras de confiança.' },
  },
  {
    id: 'engineering.delivery', category: 'engineering', phaseIds: [52, 53],
    title: { en: 'Packaging and delivery', pt: 'Empacotamento e entrega' },
    description: { en: 'Build repeatable artifacts and automated release evidence.', pt: 'Construir artefatos repetíveis e evidência automatizada de release.' },
  },
  {
    id: 'ai.math-data', category: 'ai', phaseIds: [54, 55, 56, 57],
    title: { en: 'Math and data foundations', pt: 'Fundamentos de matemática e dados' },
    description: { en: 'Use vectors, arrays, tables, statistics and data-quality checks for AI work.', pt: 'Usar vetores, arrays, tabelas, estatística e verificações de qualidade em projetos de IA.' },
  },
  {
    id: 'ai.machine-learning', category: 'ai', phaseIds: [58, 59, 60],
    title: { en: 'Machine-learning workflow', pt: 'Fluxo de Machine Learning' },
    description: { en: 'Split data, train classical models and evaluate them without leakage.', pt: 'Separar dados, treinar modelos clássicos e avaliá-los sem vazamento.' },
  },
  {
    id: 'ai.neural-networks', category: 'ai', phaseIds: [61, 62],
    title: { en: 'Neural networks', pt: 'Redes neurais' },
    description: { en: 'Understand differentiable models, training loops and PyTorch system concepts.', pt: 'Entender modelos diferenciáveis, loops de treino e conceitos de sistemas PyTorch.' },
  },
  {
    id: 'ai.language-models', category: 'ai', phaseIds: [63, 64],
    title: { en: 'Language models and transformers', pt: 'Modelos de linguagem e Transformers' },
    description: { en: 'Represent text with tokens and embeddings and reason about attention.', pt: 'Representar texto com tokens e embeddings e raciocinar sobre attention.' },
  },
  {
    id: 'ai.local-runtime', category: 'ai', phaseIds: [65, 66],
    title: { en: 'Local model runtime', pt: 'Runtime de modelos locais' },
    description: { en: 'Select, quantify and operate open models on local hardware.', pt: 'Selecionar, quantizar e operar modelos abertos em hardware local.' },
  },
  {
    id: 'ai.rag-evaluation', category: 'ai', phaseIds: [67, 68],
    title: { en: 'RAG, evaluation and product delivery', pt: 'RAG, avaliação e entrega de produto' },
    description: { en: 'Build grounded retrieval systems, test quality and package a private local assistant.', pt: 'Construir sistemas fundamentados em recuperação, testar qualidade e empacotar um assistente local privado.' },
  },
]

const SKILL_BY_ID = new Map(SKILLS.map(skill => [skill.id, skill]))

export function getSkill(skillId: string) {
  return SKILL_BY_ID.get(skillId)
}

export function getSkillsForPhase(phaseId: number): string[] {
  return SKILLS.filter(skill => skill.phaseIds.includes(phaseId)).map(skill => skill.id)
}
