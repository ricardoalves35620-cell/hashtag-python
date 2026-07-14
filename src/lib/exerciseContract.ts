import type { Check, Exercise, Lang, TestCase } from '../data/types'

export type ExerciseContractKind = 'exact' | 'required' | 'alternatives' | 'pattern' | 'behavior'

export interface VisibleExerciseContract {
  id: string
  description: string
  inputs: string[]
  expected: string
  kind: ExerciseContractKind
}

function valuesOf(check: Check) {
  if (Array.isArray(check.value)) return check.value.map(String)
  if (check.value === undefined) return []
  return [String(check.value)]
}

function describeCheck(check: Check, lang: Lang): { text: string; kind: ExerciseContractKind } | null {
  const values = valuesOf(check)
  switch (check.type) {
    case 'contains':
      return values[0] ? { text: lang === 'pt' ? `Deve incluir: ${values[0]}` : `Must include: ${values[0]}`, kind: 'required' } : null
    case 'contains_any':
      return values.length ? {
        text: lang === 'pt' ? `Deve incluir uma destas formas: ${values.join(' OU ')}` : `Must include one of these forms: ${values.join(' OR ')}`,
        kind: 'alternatives',
      } : null
    case 'equals':
    case 'numeric_equals':
      return values[0] ? { text: values[0], kind: 'exact' } : null
    case 'matches':
      return values[0] ? { text: lang === 'pt' ? `Formato esperado: ${values[0]}` : `Expected format: ${values[0]}`, kind: 'pattern' } : null
    case 'line_count':
      return values[0] ? {
        text: lang === 'pt' ? `A saída deve ter ${values[0]} linha(s).` : `The output must have ${values[0]} line(s).`,
        kind: 'behavior',
      } : null
    case 'not_contains':
      return values[0] ? { text: lang === 'pt' ? `Não deve incluir: ${values[0]}` : `Must not include: ${values[0]}`, kind: 'behavior' } : null
    case 'no_error':
      return { text: lang === 'pt' ? 'O programa deve terminar sem erros.' : 'The program must finish without errors.', kind: 'behavior' }
    default:
      return null
  }
}

function combineKind(kinds: ExerciseContractKind[]): ExerciseContractKind {
  if (kinds.length > 0 && kinds.every(kind => kind === 'exact')) return 'exact'
  if (kinds.some(kind => kind === 'alternatives')) return 'alternatives'
  if (kinds.some(kind => kind === 'pattern')) return 'pattern'
  if (kinds.some(kind => kind === 'required')) return 'required'
  return 'behavior'
}

function expectedForCase(testCase: TestCase, exercise: Exercise, lang: Lang) {
  if (testCase.expectedOutput?.[lang]?.trim()) {
    return { expected: testCase.expectedOutput[lang].trim(), kind: 'exact' as const }
  }
  if (exercise.sampleOutput?.[lang]?.trim()) {
    return { expected: exercise.sampleOutput[lang].trim(), kind: 'exact' as const }
  }

  const described = testCase.checks
    .map(check => describeCheck(check, lang))
    .filter((item): item is { text: string; kind: ExerciseContractKind } => Boolean(item))

  return {
    expected: described.length
      ? described.map(item => item.text).join('\n')
      : (lang === 'pt'
          ? 'A saída deve cumprir todos os requisitos visíveis deste exercício.'
          : 'The output must satisfy every visible requirement in this exercise.'),
    kind: combineKind(described.map(item => item.kind)),
  }
}

export function getPrimaryExerciseInputs(exercise: Exercise) {
  if (exercise.suggestedInputs?.length) return exercise.suggestedInputs.map(String)
  const visibleCase = exercise.grading?.tests?.find(testCase => !testCase.hidden)
  return visibleCase?.inputs?.map(String) || []
}

export function getVisibleExerciseContracts(exercise: Exercise, lang: Lang): VisibleExerciseContract[] {
  const visibleCases = exercise.grading?.tests?.filter(testCase => !testCase.hidden) || []

  if (visibleCases.length > 0) {
    return visibleCases.map(testCase => {
      const contract = expectedForCase(testCase, exercise, lang)
      return {
        id: testCase.id,
        description: testCase.description[lang],
        inputs: (exercise.suggestedInputs?.length ? exercise.suggestedInputs : testCase.inputs).map(String),
        expected: contract.expected,
        kind: contract.kind,
      }
    })
  }

  return [{
    id: `${exercise.id}-contract`,
    description: lang === 'pt' ? 'Resultado visível deste exercício' : 'Visible result for this exercise',
    inputs: (exercise.suggestedInputs || []).map(String),
    expected: exercise.sampleOutput?.[lang]?.trim() || (lang === 'pt'
      ? 'O programa deve terminar sem erros e produzir o comportamento descrito no enunciado.'
      : 'The program must finish without errors and produce the behavior described in the instructions.'),
    kind: exercise.sampleOutput?.[lang]?.trim() ? 'exact' : 'behavior',
  }]
}
