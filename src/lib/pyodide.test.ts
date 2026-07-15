import { describe, expect, it } from 'vitest'
import { detectHardcodedAnswer, meetsCodeRequirement, type PythonAnalysis } from './pyodide'

const sample: PythonAnalysis = {
  nodeCounts: { FunctionDef: 2, Return: 1, For: 1 },
  calls: ['print', 'math.sqrt'],
  functionNames: ['calculate', 'main'],
  imports: ['math'],
  assignedNames: ['total'],
  literalPrintCalls: 0,
  literalPrintValues: [],
  functionDetails: [],
  docstringFunctions: ['calculate'],
  hasMainGuard: true,
}

describe('meetsCodeRequirement', () => {
  it('validates AST node counts', () => {
    expect(meetsCodeRequirement(sample, { kind: 'node', value: 'FunctionDef', minCount: 2 })).toBe(true)
    expect(meetsCodeRequirement(sample, { kind: 'node', value: 'Return', minCount: 2 })).toBe(false)
  })

  it('validates calls, imports, functions and assignments', () => {
    expect(meetsCodeRequirement(sample, { kind: 'call', value: 'sqrt' })).toBe(true)
    expect(meetsCodeRequirement(sample, { kind: 'import', value: 'math' })).toBe(true)
    expect(meetsCodeRequirement(sample, { kind: 'function', value: 'calculate' })).toBe(true)
    expect(meetsCodeRequirement(sample, { kind: 'assignment', value: 'total' })).toBe(true)
    expect(meetsCodeRequirement(sample, { kind: 'main_guard', value: '__name__' })).toBe(true)
  })
})


describe('detectHardcodedAnswer', () => {
  it('rejects printing the expected literal when a required call is missing', () => {
    const finding = detectHardcodedAnswer({
      ...sample,
      calls: ['print'],
      literalPrintCalls: 1,
      literalPrintValues: ['42'],
    }, {
      id: 'literal-print',
      description: { en: 'Calculate', pt: 'Calcule' },
      inputs: [],
      checks: [{ type: 'equals', value: '42' }],
      points: 100,
      codeRequirements: [{ kind: 'call', value: 'calculate' }],
    })

    expect(finding).toEqual({ kind: 'literal_print', expected: '42', requiredName: 'calculate' })
  })

  it('rejects a function that ignores its arguments and returns the visible answer', () => {
    const finding = detectHardcodedAnswer({
      ...sample,
      functionDetails: [{
        name: 'total_price',
        arguments: ['price', 'quantity'],
        loadedNames: [],
        returnLiterals: ['100'],
      }],
    }, {
      id: 'constant-function',
      description: { en: 'Calculate', pt: 'Calcule' },
      inputs: [],
      checks: [{ type: 'equals_any', value: ['100', '100.0'], target: 'test_output' }],
      points: 100,
      codeRequirements: [{ kind: 'function', value: 'total_price' }],
    })

    expect(finding).toEqual({ kind: 'constant_function', expected: '100', requiredName: 'total_price' })
  })

  it('allows literal branches when the function actually uses its inputs', () => {
    const finding = detectHardcodedAnswer({
      ...sample,
      functionDetails: [{
        name: 'priority',
        arguments: ['amount'],
        loadedNames: ['amount'],
        returnLiterals: ['Critical', 'Normal'],
      }],
    }, {
      id: 'classification',
      description: { en: 'Classify', pt: 'Classifique' },
      inputs: [],
      checks: [{ type: 'equals', value: 'Critical', target: 'test_output' }],
      points: 100,
      codeRequirements: [{ kind: 'function', value: 'priority' }],
    })

    expect(finding).toBeNull()
  })
})
