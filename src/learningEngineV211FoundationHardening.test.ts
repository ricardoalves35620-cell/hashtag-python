import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { getMiniProjectForPhase } from './data/miniProjects'
import { getPedagogicalBlueprintStatus } from './lib/pedagogicalJourney'

const foundations = ALL_PHASES.filter(phase => phase.id >= 1 && phase.id <= 27)

describe('Learning Engine V2.11 foundation hardening', () => {
  it('keeps all 27 foundation phases and gives each one meaningful practice depth', () => {
    expect(foundations).toHaveLength(27)
    for (const phase of foundations) {
      expect(phase.exercises.length, `phase ${phase.id}`).toBeGreaterThanOrEqual(3)
      const graded = phase.exercises.filter(exercise => (exercise.grading?.tests?.length || 0) > 0)
      expect(graded.length, `phase ${phase.id}`).toBeGreaterThanOrEqual(2)
      for (const exercise of phase.exercises) {
        expect(exercise.hints.length, `${phase.id}/${exercise.id}`).toBeGreaterThanOrEqual(2)
      }
    }
  })

  it('adds a materially different transfer challenge to phases 9 through 27', () => {
    for (const phase of foundations.filter(item => item.id >= 9)) {
      const challenge = phase.exercises.find(exercise => exercise.id === `p${phase.id}-transfer`)
      expect(challenge, `phase ${phase.id}`).toBeDefined()
      expect(challenge?.difficulty).toBe('challenge')
      expect(challenge?.grading?.tests?.some(test => test.hidden)).toBe(true)
      expect(challenge?.grading?.tests?.some(test => !test.hidden)).toBe(true)
    }
  })

  it('uses visible and hidden exam evidence while keeping scoring understandable', () => {
    for (const phase of foundations) {
      expect(phase.exam.testCases.some(test => !test.hidden), `visible phase ${phase.id}`).toBe(true)
      expect(phase.exam.testCases.some(test => test.hidden), `hidden phase ${phase.id}`).toBe(true)
      expect(phase.exam.testCases.reduce((sum, test) => sum + test.points, 0), `points phase ${phase.id}`).toBe(100)
    }
  })

  it('provides exact suggested inputs for early input exercises', () => {
    const expected: Record<string, string[]> = {
      ex4_guided: ['25'],
      ex4_fill: ['Maria', '35', '1.68', '555-1234'],
      ex5_guided: ['8000'],
      ex5_fill: ['8000', '10'],
      ex6_guided: ['15000'],
      ex6_fill: ['24'],
      ex23_zero: ['abc', '5000'],
    }
    for (const [id, inputs] of Object.entries(expected)) {
      const exercise = foundations.flatMap(phase => phase.exercises).find(item => item.id === id)
      expect(exercise?.suggestedInputs, id).toEqual(inputs)
    }
  })

  it('aligns the first four authored journeys with their actual phase concepts', () => {
    const checks = [
      [1, 'print()'],
      [2, 'operators'],
      [3, 'variable'],
      [4, 'input()'],
    ] as const
    for (const [phaseId, token] of checks) {
      const phase = ALL_PHASES.find(item => item.id === phaseId)!
      const status = getPedagogicalBlueprintStatus(phase)
      expect(JSON.stringify(status.blueprint).toLowerCase(), `phase ${phaseId}`).toContain(token.toLowerCase())
    }
  })

  it('gives the Phase 12 mini-project separate normal and edge evidence', () => {
    const project = getMiniProjectForPhase(12)
    expect(project?.tests.length).toBeGreaterThanOrEqual(2)
    expect(project?.tests.some(test => test.id === 'portfolio-empty')).toBe(true)
    expect(project?.starterCode.en).toContain('EDGE_APPROVED')
    expect(project?.starterCode.pt).toContain('EDGE_APPROVED')
  })
})
