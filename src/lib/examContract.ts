import type { Check, Exam, Lang, TestCase } from '../data/types'

export type ExpectedContractKind = 'exact' | 'required' | 'alternatives' | 'pattern' | 'behavior'

export interface VisibleExamContract {
  id: string
  description: string
  inputs: string[]
  inputMap: Array<{ label: string; value: string }>
  expected: string
  kind: ExpectedContractKind
}

function valuesOf(check: Check) {
  if (Array.isArray(check.value)) return check.value.map(String)
  if (check.value === undefined) return []
  return [String(check.value)]
}

function describeCheck(check: Check, lang: Lang): { text: string; kind: ExpectedContractKind } | null {
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
      return values[0] ? { text: lang === 'pt' ? `Quantidade esperada de linhas: ${values[0]}` : `Expected number of lines: ${values[0]}`, kind: 'behavior' } : null
    case 'not_contains':
      return values[0] ? { text: lang === 'pt' ? `Não deve incluir: ${values[0]}` : `Must not include: ${values[0]}`, kind: 'behavior' } : null
    case 'no_error':
      return { text: lang === 'pt' ? 'O programa deve terminar sem erros.' : 'The program must finish without errors.', kind: 'behavior' }
    default:
      return null
  }
}

function caseInputs(testCase: TestCase) {
  return testCase.inputs.map(String)
}

function caseInputMap(testCase: TestCase) {
  return Object.entries(testCase.inputMap || {}).map(([label, value]) => ({ label, value: String(value) }))
}

function inputKey(testCase: TestCase) {
  return JSON.stringify({ inputs: caseInputs(testCase), inputMap: caseInputMap(testCase) })
}

function combineKind(kinds: ExpectedContractKind[]): ExpectedContractKind {
  if (kinds.every(kind => kind === 'exact')) return 'exact'
  if (kinds.some(kind => kind === 'alternatives')) return 'alternatives'
  if (kinds.some(kind => kind === 'pattern')) return 'pattern'
  if (kinds.some(kind => kind === 'required')) return 'required'
  return 'behavior'
}

export function getVisibleExamContracts(exam: Exam, lang: Lang): VisibleExamContract[] {
  const visibleCases = exam.testCases.filter(testCase => !testCase.hidden)
  const first = visibleCases[0]

  if (exam.expectedOutput?.[lang]) {
    return [{
      id: 'exam-expected-output',
      description: lang === 'pt' ? 'Resultado visível principal' : 'Main visible result',
      inputs: first ? caseInputs(first) : [],
      inputMap: first ? caseInputMap(first) : [],
      expected: exam.expectedOutput[lang].trim(),
      kind: 'exact',
    }]
  }

  const groups = new Map<string, TestCase[]>()
  for (const testCase of visibleCases) {
    const key = inputKey(testCase)
    groups.set(key, [...(groups.get(key) || []), testCase])
  }

  return [...groups.values()].map((testCases, groupIndex) => {
    const canonical = testCases.find(testCase => testCase.expectedOutput?.[lang])
    const firstCase = testCases[0]

    if (canonical?.expectedOutput?.[lang]) {
      return {
        id: canonical.id,
        description: canonical.description[lang],
        inputs: caseInputs(canonical),
        inputMap: caseInputMap(canonical),
        expected: canonical.expectedOutput[lang].trim(),
        kind: 'exact',
      }
    }

    const described = testCases
      .flatMap(testCase => testCase.checks)
      .map(check => describeCheck(check, lang))
      .filter((item): item is { text: string; kind: ExpectedContractKind } => Boolean(item))

    return {
      id: `visible-contract-${groupIndex}`,
      description: testCases.length === 1
        ? firstCase.description[lang]
        : (lang === 'pt' ? 'Resultado esperado para o cenário visível' : 'Expected result for the visible scenario'),
      inputs: caseInputs(firstCase),
      inputMap: caseInputMap(firstCase),
      expected: described.length
        ? described.map(item => item.text).join('\n')
        : (lang === 'pt' ? 'O resultado deve cumprir todos os requisitos visíveis deste cenário.' : 'The result must satisfy every visible requirement in this scenario.'),
      kind: combineKind(described.map(item => item.kind)),
    }
  })
}
