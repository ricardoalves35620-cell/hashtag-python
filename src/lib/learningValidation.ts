import type { CodeRequirement, Exercise, Lang } from '../data/types'
import { meetsCodeRequirement, runCode, runExam, type PythonAnalysis, type TestResult } from './pyodide'

export interface ValidationItem {
  id: string
  label: string
  passed: boolean
  hidden: boolean
  detail?: string
}

export interface ExerciseGrade {
  passed: boolean
  message: string
  output: string
  error: string | null
  timedOut: boolean
  checks: ValidationItem[]
}

function normalize(value: string) {
  return value
    .replace(/\r/g, '')
    .replace(/['"]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .toLowerCase()
}

function meaningfulLines(value: string) {
  return value
    .split('\n')
    .map(line => normalize(line))
    .filter(line => line && !line.includes('...') && !line.includes('…'))
}

export function outputSimilarity(exercise: Exercise, lang: Lang, output: string) {
  if (!exercise.sampleOutput) return { passed: true, detail: '' }

  const normalizedOutput = normalize(output)
  const languages: Lang[] = lang === 'en' ? ['en', 'pt'] : ['pt', 'en']
  const scores = languages.map(language => {
    const expected = meaningfulLines(exercise.sampleOutput![language])
    if (expected.length === 0) return 1
    const matched = expected.filter(line => normalizedOutput.includes(line)).length
    return matched / expected.length
  })

  const numericTokens = Array.from(new Set(
    languages.flatMap(language => exercise.sampleOutput![language].match(/-?\d+(?:[.,]\d+)?/g) || [])
  ))
  const hasNumbers = numericTokens.every(token => normalizedOutput.includes(token.replace(',', '.')) || normalizedOutput.includes(token))
  const bestScore = Math.max(...scores)
  const threshold = meaningfulLines(exercise.sampleOutput[lang]).length <= 2 ? 1 : 0.75

  return {
    passed: bestScore >= threshold && hasNumbers,
    detail: `${Math.round(bestScore * 100)}%`,
  }
}

export function baseValidation(code: string, lang: Lang): { passed: boolean; message: string } {
  const meaningfulCode = code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))

  if (meaningfulCode.length === 0 || meaningfulCode.every(line => line === 'pass')) {
    return { passed: false, message: lang === 'en' ? 'Write a solution before continuing.' : 'Escreva uma solução antes de continuar.' }
  }

  if (/___|\bTODO\b|YOUR CODE HERE/i.test(code)) {
    return { passed: false, message: lang === 'en' ? 'Complete every placeholder before continuing.' : 'Complete todos os espaços antes de continuar.' }
  }

  return { passed: true, message: '' }
}

const PHASE_REQUIREMENTS: Record<number, CodeRequirement[]> = {
  1: [{ kind: 'call', value: 'print' }],
  2: [{ kind: 'node', value: 'BinOp' }],
  3: [{ kind: 'node', value: 'Assign' }],
  4: [{ kind: 'call', value: 'input' }],
  5: [{ kind: 'node', value: 'If' }],
  6: [{ kind: 'node', value: 'If' }],
  7: [{ kind: 'node', value: 'While' }],
  8: [{ kind: 'node', value: 'For' }],
  9: [{ kind: 'node', value: 'List' }],
  10: [{ kind: 'node', value: 'Dict' }],
  11: [{ kind: 'node', value: 'List' }, { kind: 'node', value: 'Dict' }],
  12: [{ kind: 'node', value: 'ListComp' }],
  13: [{ kind: 'node', value: 'FunctionDef' }],
  14: [{ kind: 'node', value: 'FunctionDef' }],
  15: [{ kind: 'node', value: 'FunctionDef' }],
  16: [{ kind: 'node', value: 'FunctionDef' }],
  17: [{ kind: 'call', value: 'open' }],
  18: [{ kind: 'call', value: 'open' }],
  19: [{ kind: 'import', value: 'json' }],
  20: [{ kind: 'import', value: 'datetime' }],
  21: [{ kind: 'import', value: 'random' }],
  22: [{ kind: 'import', value: 'math' }],
  23: [{ kind: 'node', value: 'Try' }],
  24: [{ kind: 'node', value: 'FunctionDef' }],
  25: [{ kind: 'node', value: 'FunctionDef' }],
  27: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Try' }],
}

const REQUIREMENT_LABELS: Record<string, { en: string; pt: string }> = {
  'call:print': { en: 'Uses print() to produce the result', pt: 'Usa print() para produzir o resultado' },
  'call:input': { en: 'Reads data with input()', pt: 'Lê dados com input()' },
  'call:open': { en: 'Uses Python file handling', pt: 'Usa manipulação de arquivos do Python' },
  'node:BinOp': { en: 'Performs a real calculation', pt: 'Realiza um cálculo de verdade' },
  'node:Assign': { en: 'Stores values in variables', pt: 'Armazena valores em variáveis' },
  'node:If': { en: 'Makes a decision with if', pt: 'Toma uma decisão com if' },
  'node:While': { en: 'Uses a while loop', pt: 'Usa um loop while' },
  'node:For': { en: 'Uses a for loop', pt: 'Usa um loop for' },
  'node:List': { en: 'Uses a list', pt: 'Usa uma lista' },
  'node:Dict': { en: 'Uses a dictionary', pt: 'Usa um dicionário' },
  'node:ListComp': { en: 'Uses a list comprehension', pt: 'Usa uma compreensão de lista' },
  'node:FunctionDef': { en: 'Defines a function', pt: 'Define uma função' },
  'node:Return': { en: 'Returns a value', pt: 'Retorna um valor' },
  'node:Try': { en: 'Handles errors with try/except', pt: 'Trata erros com try/except' },
  'import:json': { en: 'Imports and uses json', pt: 'Importa e usa json' },
  'import:datetime': { en: 'Imports date and time tools', pt: 'Importa ferramentas de data e hora' },
  'import:random': { en: 'Imports random', pt: 'Importa random' },
  'import:math': { en: 'Imports math', pt: 'Importa math' },
}

function requirementLabel(requirement: CodeRequirement, lang: Lang) {
  return REQUIREMENT_LABELS[`${requirement.kind}:${requirement.value}`]?.[lang]
    || (lang === 'en' ? `Uses required structure: ${requirement.value}` : `Usa a estrutura exigida: ${requirement.value}`)
}

export async function gradeExercise(
  exercise: Exercise,
  phaseId: number,
  lang: Lang,
  code: string,
  inputs: string[]
): Promise<ExerciseGrade> {
  const base = baseValidation(code, lang)
  if (!base.passed) {
    return { passed: false, message: base.message, output: '', error: null, timedOut: false, checks: [] }
  }

  const run = await runCode(code, inputs, undefined, { timeoutMs: exercise.grading?.timeoutMs })
  const checks: ValidationItem[] = [
    {
      id: 'execution',
      label: lang === 'en' ? 'Program finishes without an error' : 'O programa termina sem erro',
      passed: !run.error,
      hidden: false,
      detail: run.timedOut ? (lang === 'en' ? 'Time limit exceeded' : 'Tempo limite excedido') : undefined,
    },
  ]

  if (!run.error) {
    const similarity = outputSimilarity(exercise, lang, run.output)
    checks.push({
      id: 'expected-output',
      label: lang === 'en' ? 'Produces the required result' : 'Produz o resultado solicitado',
      passed: similarity.passed,
      hidden: false,
      detail: exercise.sampleOutput ? similarity.detail : undefined,
    })
  }

  const requirements = exercise.grading?.codeRequirements || PHASE_REQUIREMENTS[phaseId] || []
  for (const requirement of requirements) {
    checks.push({
      id: `structure-${requirement.kind}-${requirement.value}`,
      label: requirementLabel(requirement, lang),
      passed: meetsCodeRequirement(run.analysis, requirement),
      hidden: true,
    })
  }

  if (phaseId === 15) {
    checks.push({
      id: 'structure-docstring',
      label: lang === 'en' ? 'Documents a function with a real docstring' : 'Documenta uma função com uma docstring real',
      passed: Boolean(run.analysis?.docstringFunctions.length),
      hidden: true,
    })
  }

  let explicitResults: TestResult[] = []
  if (!run.error && exercise.grading?.tests?.length) {
    const graded = await runExam(code, exercise.grading.tests)
    explicitResults = graded.results
    for (const result of explicitResults) {
      checks.push({
        id: `test-${result.id}`,
        label: result.hidden
          ? (lang === 'en' ? 'Passes a hidden behavior test' : 'Passa em um teste oculto de comportamento')
          : result.description[lang],
        passed: result.passed,
        hidden: result.hidden,
      })
    }
  }

  const passed = checks.length > 0 && checks.every(check => check.passed)
  const failedCount = checks.filter(check => !check.passed).length
  const message = passed
    ? (lang === 'en' ? 'Exercise validated by behavior and code structure.' : 'Exercício validado pelo comportamento e pela estrutura do código.')
    : (lang === 'en'
      ? `${failedCount} validation check${failedCount === 1 ? '' : 's'} still need attention.`
      : `${failedCount} verificação${failedCount === 1 ? '' : 'ões'} ainda precisa${failedCount === 1 ? '' : 'm'} de atenção.`)

  return {
    passed,
    message,
    output: run.output,
    error: run.error || run.testError,
    timedOut: run.timedOut || explicitResults.some(result => result.timedOut),
    checks,
  }
}

interface StructureRule {
  requirements: CodeRequirement[]
  message: { en: string; pt: string }
  extra?: (analysis: PythonAnalysis) => boolean
}

const EXAM_STRUCTURE_RULES: Record<number, StructureRule> = {
  4: { requirements: [{ kind: 'call', value: 'input' }], message: { en: 'Use input() as required by this phase.', pt: 'Use input() como exigido nesta fase.' } },
  5: { requirements: [{ kind: 'node', value: 'If' }], message: { en: 'Your solution must make a real decision.', pt: 'Sua solução precisa tomar uma decisão real.' } },
  6: { requirements: [{ kind: 'node', value: 'If', minCount: 2 }], message: { en: 'Represent multiple decision paths, including elif.', pt: 'Represente vários caminhos de decisão, incluindo elif.' } },
  7: { requirements: [{ kind: 'node', value: 'While' }], message: { en: 'Use a while loop in this exam.', pt: 'Use um loop while neste exame.' } },
  8: { requirements: [{ kind: 'node', value: 'For' }], message: { en: 'Use a for loop to process the collection.', pt: 'Use um loop for para processar a coleção.' } },
  10: { requirements: [{ kind: 'node', value: 'Dict' }], message: { en: 'Represent the data with a dictionary.', pt: 'Represente os dados com um dicionário.' } },
  12: { requirements: [{ kind: 'node', value: 'ListComp' }], message: { en: 'Use a real list comprehension.', pt: 'Use uma compreensão de lista real.' } },
  13: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'Create and call a function instead of printing fixed answers.', pt: 'Crie e chame uma função em vez de imprimir respostas fixas.' } },
  15: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'Create a documented function.', pt: 'Crie uma função documentada.' }, extra: analysis => analysis.docstringFunctions.length > 0 },
  17: { requirements: [{ kind: 'call', value: 'open' }], message: { en: 'Use Python file handling in this exam.', pt: 'Use manipulação de arquivos Python neste exame.' } },
  18: { requirements: [{ kind: 'call', value: 'open' }], message: { en: 'Use Python file handling in this exam.', pt: 'Use manipulação de arquivos Python neste exame.' } },
  19: { requirements: [{ kind: 'import', value: 'json' }], message: { en: 'Use the json module as required.', pt: 'Use o módulo json como exigido.' } },
  20: { requirements: [{ kind: 'import', value: 'datetime' }], message: { en: 'Use the datetime tools taught in this phase.', pt: 'Use as ferramentas de data e hora ensinadas nesta fase.' } },
  21: { requirements: [{ kind: 'import', value: 'random' }], message: { en: 'Use the random module as required.', pt: 'Use o módulo random como exigido.' } },
  22: { requirements: [{ kind: 'import', value: 'math' }], message: { en: 'Use the math module as required.', pt: 'Use o módulo math como exigido.' } },
  23: { requirements: [{ kind: 'node', value: 'Try' }], message: { en: 'Handle failures with try/except.', pt: 'Trate falhas com try/except.' } },
  24: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'The project must be organized into functions.', pt: 'O projeto precisa estar organizado em funções.' } },
  25: { requirements: [{ kind: 'node', value: 'FunctionDef' }], message: { en: 'Use functions for the CRUD project.', pt: 'Use funções no projeto CRUD.' } },
  27: { requirements: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Try' }], message: { en: 'The capstone must use functions and error handling.', pt: 'O capstone precisa usar funções e tratamento de erros.' } },
}

export function validateExamStructure(phaseId: number, analysis: PythonAnalysis | null, lang: Lang) {
  const rule = EXAM_STRUCTURE_RULES[phaseId]
  if (!rule) return { passed: true, message: '' }
  if (!analysis) return { passed: false, message: lang === 'en' ? 'The code could not be analyzed.' : 'O código não pôde ser analisado.' }

  const passed = rule.requirements.every(requirement => meetsCodeRequirement(analysis, requirement))
    && (rule.extra ? rule.extra(analysis) : true)
  return { passed, message: passed ? '' : rule.message[lang] }
}
