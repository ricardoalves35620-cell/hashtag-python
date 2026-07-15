import { describe, expect, it } from 'vitest'
import type { Exercise } from '../data/types'
import { baseValidation, outputSimilarity, validateExamStructure } from './learningValidation'
import type { PythonAnalysis } from './pyodide'

const analysis = (overrides: Partial<PythonAnalysis> = {}): PythonAnalysis => ({
  nodeCounts: {},
  calls: [],
  functionNames: [],
  imports: [],
  assignedNames: [],
  literalPrintCalls: 0,
  literalPrintValues: [],
  functionDetails: [],
  docstringFunctions: [],
  hasMainGuard: false,
  ...overrides,
})

describe('baseValidation', () => {
  it('rejects untouched placeholders', () => {
    expect(baseValidation('value = ___', 'pt').passed).toBe(false)
  })

  it('accepts meaningful code', () => {
    expect(baseValidation('total = 2 + 3\nprint(total)', 'pt').passed).toBe(true)
  })
})

describe('outputSimilarity', () => {
  const exercise: Exercise = {
    id: 'personalized',
    title: { en: 'Test', pt: 'Teste' },
    description: { en: '', pt: '' },
    starterCode: '',
    hints: [],
    sampleOutput: {
      en: 'Welcome to Python!\nMy name is Alice\nMy age is 28\nIn 10 years I will be 38\nProgram complete!',
      pt: 'Bem-vindo ao Python!\nMeu nome é Alice\nMinha idade é 28\nEm 10 anos terei 38\nPrograma concluído!',
    },
  }

  it('allows a personalized line while preserving the required result', () => {
    const result = outputSimilarity(exercise, 'en', 'Welcome to Python!\nMy name is Ricardo\nMy age is 28\nIn 10 years I will be 38\nProgram complete!')
    expect(result.passed).toBe(true)
  })

  it('rejects output missing required numeric results', () => {
    const result = outputSimilarity(exercise, 'en', 'Welcome to Python!\nMy name is Ricardo\nProgram complete!')
    expect(result.passed).toBe(false)
  })
})

describe('validateExamStructure', () => {
  it('checks parsed structures rather than keywords in comments', () => {
    const result = validateExamStructure(7, analysis({ nodeCounts: {} }), 'en')
    expect(result.passed).toBe(false)
  })

  it('accepts the required AST node', () => {
    const result = validateExamStructure(7, analysis({ nodeCounts: { While: 1 } }), 'en')
    expect(result.passed).toBe(true)
  })

  it('requires a real function docstring in phase 15', () => {
    const withoutDocstring = validateExamStructure(15, analysis({ nodeCounts: { FunctionDef: 1 } }), 'en')
    const withDocstring = validateExamStructure(15, analysis({ nodeCounts: { FunctionDef: 1 }, docstringFunctions: ['calculate'] }), 'en')
    expect(withoutDocstring.passed).toBe(false)
    expect(withDocstring.passed).toBe(true)
  })
})
