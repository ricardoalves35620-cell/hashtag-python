import { describe, expect, it } from 'vitest'
import {
  AUDIT_ENVIRONMENT_COUNT,
  PHASE_COUNT,
  SMART_SENTINEL_PHASES,
  buildAuditPlan,
} from '../audit/audit-plan'

describe('adaptive overnight audit plan', () => {
  it('covers every phase in three core environments and every environment with sentinels', () => {
    const plan = buildAuditPlan('smart', 3, 0)
    const environments = new Set(plan.map(entry => entry.environmentIndex))
    expect(environments.size).toBe(AUDIT_ENVIRONMENT_COUNT)

    const phaseVisitsByEnvironment = new Map<number, Set<number>>()
    for (const entry of plan) {
      const phases = phaseVisitsByEnvironment.get(entry.environmentIndex) || new Set<number>()
      entry.phaseIds.forEach(phaseId => phases.add(phaseId))
      phaseVisitsByEnvironment.set(entry.environmentIndex, phases)
    }

    const fullEnvironments = [...phaseVisitsByEnvironment.values()].filter(phases => phases.size === PHASE_COUNT)
    expect(fullEnvironments).toHaveLength(3)
    for (const phases of phaseVisitsByEnvironment.values()) {
      SMART_SENTINEL_PHASES.forEach(phaseId => expect(phases.has(phaseId)).toBe(true))
    }
  })

  it('interleaves environments so the first round covers the complete matrix', () => {
    const plan = buildAuditPlan('smart', 3, 0)
    expect(new Set(plan.slice(0, 12).map(entry => entry.environmentIndex)).size).toBe(12)
  })

  it('keeps full mode exhaustive and smoke mode compact', () => {
    const full = buildAuditPlan('full', 3, 0)
    expect(full.reduce((total, entry) => total + entry.phaseIds.length, 0)).toBe(PHASE_COUNT * AUDIT_ENVIRONMENT_COUNT)

    const smoke = buildAuditPlan('smoke', 5, 0)
    expect(smoke).toHaveLength(AUDIT_ENVIRONMENT_COUNT)
    expect(smoke.every(entry => entry.depth === 'smoke')).toBe(true)
  })
})
