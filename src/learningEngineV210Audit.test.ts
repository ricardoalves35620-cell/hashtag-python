import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { auditCurriculum, auditPhaseCurriculum } from './lib/curriculumAudit'
import { getPedagogicalBlueprintStatus, getPedagogicalJourney } from './lib/pedagogicalJourney'
import { getVisibleExamContracts } from './lib/examContract'

const expectedKinds = [
  'challenge', 'intuition', 'decomposition', 'flow', 'pseudocode',
  'python', 'walkthrough', 'debug', 'practice', 'transfer',
]

describe('Learning Engine V2.10 curriculum audit', () => {
  it('audits all 69 phases using the real ten-stage journey', () => {
    expect(ALL_PHASES).toHaveLength(69)
    for (const phase of ALL_PHASES) {
      expect(getPedagogicalBlueprintStatus(phase).authored).toBe(true)
      expect(getPedagogicalJourney(phase).map(unit => unit.kind)).toEqual(expectedKinds)
    }
  })

  it('keeps the release gate free of learner-misleading contradictions', () => {
    const report = auditCurriculum(ALL_PHASES)
    expect(report.summary.authoredJourneys).toBe(69)
    expect(report.summary.visibleExamContracts).toBe(69)
    expect(report.summary.blockingIssues).toBe(0)
    expect(report.qualityGate.passed).toBe(true)
  })

  it('shows an English and Portuguese expected-output contract for every exam', () => {
    for (const phase of ALL_PHASES) {
      expect(getVisibleExamContracts(phase.exam, 'en').length).toBeGreaterThan(0)
      expect(getVisibleExamContracts(phase.exam, 'pt').length).toBeGreaterThan(0)
      expect(getVisibleExamContracts(phase.exam, 'en').every(item => item.expected.trim().length > 0)).toBe(true)
      expect(getVisibleExamContracts(phase.exam, 'pt').every(item => item.expected.trim().length > 0)).toBe(true)
    }
  })

  it('does not confuse a short legacy lesson with a missing Learning Engine journey', () => {
    const phase15 = ALL_PHASES.find(phase => phase.id === 15)
    expect(phase15).toBeDefined()
    const audit = auditPhaseCurriculum(phase15!)
    expect(audit.metrics.authoredJourney).toBe(true)
    expect(audit.metrics.journeyUnits).toBe(10)
    expect(audit.issues.some(item => item.id.includes('short-lesson'))).toBe(false)
  })

  it('reports a clean baseline while still detecting a deliberately weakened phase', () => {
    const report = auditCurriculum(ALL_PHASES)
    expect(report.summary.issueCount).toBe(0)
    expect(report.summary.averageScore).toBe(100)

    const weakenedPhase = structuredClone(ALL_PHASES.find(phase => phase.id === 1)!)
    weakenedPhase.exercises[0].hints = weakenedPhase.exercises[0].hints.slice(0, 1)

    const weakenedAudit = auditPhaseCurriculum(weakenedPhase)
    expect(weakenedAudit.issues.some(item => item.id.includes('single-hint'))).toBe(true)
  })
})
