import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './phases'
import { MINI_PROJECTS } from './miniProjects'
import { MILESTONE_PROJECT_PHASE_IDS, PHASE_IDS, phaseCount, phaseHasMiniProject } from './phaseIndex'

/**
 * phaseIndex.ts exists so progress.ts — and therefore AppContext, and therefore the
 * entry chunk — does not have to import the whole curriculum. That only stays safe
 * while the literals below match the real data, so this test is the contract.
 *
 * Importing the heavy modules HERE is fine: tests are not shipped.
 */
describe('phase index mirrors the curriculum', () => {
  it('lists every phase id in curriculum order', () => {
    expect(PHASE_IDS).toEqual(ALL_PHASES.map(phase => phase.id))
  })

  it('agrees on how many phases there are', () => {
    expect(phaseCount()).toBe(ALL_PHASES.length)
    expect(phaseCount()).toBe(69)
  })

  it('lists exactly the phases that close with a mini-project', () => {
    const actual = [...new Set(
      MINI_PROJECTS
        .map(project => project.milestonePhaseId)
        .filter((id): id is number => typeof id === 'number'),
    )].sort((a, b) => a - b)
    expect([...MILESTONE_PROJECT_PHASE_IDS]).toEqual(actual)
  })

  it('answers phaseHasMiniProject the same way the project data does', () => {
    for (const phase of ALL_PHASES) {
      const fromData = MINI_PROJECTS.some(project => project.milestonePhaseId === phase.id)
      expect(
        phaseHasMiniProject(phase.id),
        `phase ${phase.id} disagrees about having a mini-project`,
      ).toBe(fromData)
    }
  })

  it('reports no mini-project for ids outside the curriculum', () => {
    expect(phaseHasMiniProject(-1)).toBe(false)
    expect(phaseHasMiniProject(999)).toBe(false)
  })
})
