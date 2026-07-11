import type { Bilingual } from './types'

export type SkillCategory = 'digital' | 'fundamentals' | 'problem-solving'

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
]

const SKILL_BY_ID = new Map(SKILLS.map(skill => [skill.id, skill]))

export function getSkill(skillId: string) {
  return SKILL_BY_ID.get(skillId)
}

export function getSkillsForPhase(phaseId: number): string[] {
  return SKILLS.filter(skill => skill.phaseIds.includes(phaseId)).map(skill => skill.id)
}
