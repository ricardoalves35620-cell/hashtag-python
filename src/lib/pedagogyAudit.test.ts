import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from '../data/phases/index'
import { auditCurriculumPedagogy, auditPhasePedagogy } from './pedagogyAudit'

describe('pedagogy audit', () => {
  it('audits all 69 phases deterministically', () => {
    const report = auditCurriculumPedagogy(ALL_PHASES)
    expect(report.summary.totalPhases).toBe(69)
    expect(report.phases).toHaveLength(69)
    expect(report.phases.map(phase => phase.phaseId)).toEqual(Array.from({ length: 69 }, (_, index) => index))
  })

  it('flags a passive first exercise', () => {
    const phase = structuredClone(ALL_PHASES[1])
    phase.exercises[0].description = {
      en: 'Run the ready code.',
      pt: 'Execute o código pronto.',
    }
    phase.exercises[0].hints = []
    const result = auditPhasePedagogy(phase)
    expect(result.issues.some(item => item.id.endsWith('passive-first-exercise'))).toBe(true)
  })

  it('requires exam generalization through hidden tests', () => {
    const phase = structuredClone(ALL_PHASES[1])
    phase.exam.testCases = phase.exam.testCases.map(test => ({ ...test, hidden: false })).slice(0, 1)
    const result = auditPhasePedagogy(phase)
    expect(result.issues.some(item => item.id.endsWith('weak-exam'))).toBe(true)
    expect(result.issues.some(item => item.id.endsWith('no-hidden-exam-test'))).toBe(true)
  })
})
