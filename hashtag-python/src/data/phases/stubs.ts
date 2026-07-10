import type { Phase } from '../types'

const stub = (id: number, title: { en: string; pt: string }, description: { en: string; pt: string }, icon: string, libraries: string[] = []): Phase => ({
  id,
  title,
  description,
  icon,
  libraries,
  lesson: { title: { en: 'Coming Soon', pt: 'Em Breve' }, blocks: [{ type: 'text', content: { en: 'This phase is being prepared. Complete the previous phases first!', pt: 'Esta fase está sendo preparada. Complete as fases anteriores primeiro!' } }] },
  exercises: [],
  quiz: [],
  exam: {
    title: { en: 'Exam', pt: 'Exame' },
    scenario: { en: 'Coming soon', pt: 'Em breve' },
    requirements: { en: [], pt: [] },
    starterCode: '# Coming soon\n',
    testCases: []
  }
})

export const phase3 = stub(3,
  { en: 'Loops', pt: 'Loops' },
  { en: 'Automate repetitive tasks with for and while loops.', pt: 'Automatize tarefas repetitivas com loops for e while.' },
  '🔁'
)

export const phase4 = stub(4,
  { en: 'Functions', pt: 'Funções' },
  { en: 'Write reusable, organized code with functions.', pt: 'Escreva código reutilizável e organizado com funções.' },
  '🧩'
)

export const phase5 = stub(5,
  { en: 'Lists & Dictionaries', pt: 'Listas e Dicionários' },
  { en: 'Manage collections of data efficiently.', pt: 'Gerencie coleções de dados de forma eficiente.' },
  '📦'
)

export const phase6 = stub(6,
  { en: 'Files & Error Handling', pt: 'Arquivos e Tratamento de Erros' },
  { en: 'Read/write files and handle errors gracefully.', pt: 'Leia/escreva arquivos e trate erros com elegância.' },
  '📂',
  ['os', 'pathlib']
)

export const phase7 = stub(7,
  { en: 'External Libraries', pt: 'Bibliotecas Externas' },
  { en: 'Use requests and pandas to work with real data.', pt: 'Use requests e pandas para trabalhar com dados reais.' },
  '📡',
  ['requests', 'pandas']
)

export const phase8 = stub(8,
  { en: 'Data Visualization', pt: 'Visualização de Dados' },
  { en: 'Create charts and graphs with matplotlib.', pt: 'Crie gráficos com matplotlib.' },
  '📊',
  ['matplotlib', 'seaborn']
)

export const phase9 = stub(9,
  { en: 'Automation', pt: 'Automação' },
  { en: 'Automate Excel files and scheduled tasks.', pt: 'Automatize arquivos Excel e tarefas agendadas.' },
  '⚙️',
  ['openpyxl', 'schedule']
)

export const phase10 = stub(10,
  { en: 'Final Project', pt: 'Projeto Final' },
  { en: 'Build a complete mini-system using everything you learned.', pt: 'Construa um mini-sistema completo usando tudo que aprendeu.' },
  '🏆'
)
