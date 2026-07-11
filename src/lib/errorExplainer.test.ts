import { describe, expect, it } from 'vitest'
import { explainError } from './errorExplainer'

describe('isolated worker errors', () => {
  it('uses the student line reported by the worker', () => {
    const result = explainError("NameError: name 'totl' is not defined (line 2)", 'total = 10\nprint(totl)')
    expect(result.line).toBe(2)
    expect(result.badCode).toBe('print(totl)')
  })

  it('explains execution timeouts', () => {
    const result = explainError('TimeoutError: Your program exceeded the execution time limit.', 'while True:\n    pass')
    expect(result.type).toBe('TimeoutError')
    expect(result.title.pt).toContain('tempo')
  })
})
