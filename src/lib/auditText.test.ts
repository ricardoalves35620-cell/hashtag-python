import { describe, expect, it } from 'vitest'
import { auditTextsMatch, normalizeAuditText, stripAssessmentChoiceLabel } from './auditText'

describe('audit text helpers', () => {
  it('removes only the visible assessment letter prefix', () => {
    expect(stripAssessmentChoiceLabel('D. 10')).toBe('10')
    expect(stripAssessmentChoiceLabel('A) "10"')).toBe('"10"')
  })

  it('distinguishes quoted and unquoted answers', () => {
    expect(auditTextsMatch('D. 10', '10')).toBe(true)
    expect(auditTextsMatch('A. "10"', '10')).toBe(false)
  })

  it('normalizes whitespace without weakening answer meaning', () => {
    expect(normalizeAuditText('  names.append("Eva")  ')).toBe('names.append("Eva")')
    expect(auditTextsMatch('B.   3 + 7', '3 + 7')).toBe(true)
  })
})
