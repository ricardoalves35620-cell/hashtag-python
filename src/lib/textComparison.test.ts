import { describe, expect, it } from 'vitest'
import { checkText, normalizeAssessmentText } from './pyodide'

describe('human-facing text comparison', () => {
  it('ignores Portuguese accents, case and repeated whitespace by default', () => {
    expect(checkText('  JOÃO   está aprovado  ', {
      type: 'equals',
      value: 'Joao esta aprovado',
    })).toBe(true)
  })

  it('accepts accent variations in contains checks', () => {
    expect(checkText('Situação: nível crítico', {
      type: 'contains',
      value: 'situacao: nivel critico',
    })).toBe(true)
  })

  it('accepts only a complete match when one of several exact forms is allowed', () => {
    expect(checkText('450.0', { type: 'equals_any', value: ['450', '450.0'] })).toBe(true)
    expect(checkText('Payout: 450.0', { type: 'equals_any', value: ['450', '450.0'] })).toBe(false)
  })

  it('keeps strict accent comparison when exact mode is requested', () => {
    expect(checkText('voce', {
      type: 'equals',
      value: 'você',
      textMode: 'exact',
    })).toBe(false)
  })

  it('normalizes cedilla and combining accents', () => {
    expect(normalizeAssessmentText('AÇÃO')).toBe('acao')
  })
})
