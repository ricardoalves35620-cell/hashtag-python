import { describe, expect, it } from 'vitest'
import { meetsCodeRequirement, type PythonAnalysis } from './pyodide'

const sample: PythonAnalysis = {
  nodeCounts: { FunctionDef: 2, Return: 1, For: 1 },
  calls: ['print', 'math.sqrt'],
  functionNames: ['calculate', 'main'],
  imports: ['math'],
  assignedNames: ['total'],
  literalPrintCalls: 0,
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
