import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './phases'

describe('published curriculum integrity', () => {
  it('has unique phase and exercise identifiers', () => {
    const phaseIds = ALL_PHASES.map(phase => phase.id)
    const exerciseIds = ALL_PHASES.flatMap(phase => phase.exercises.map(exercise => `${phase.id}:${exercise.id}`))
    expect(new Set(phaseIds).size).toBe(phaseIds.length)
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length)
  })

  it('gives every published exam at least one weighted test', () => {
    for (const phase of ALL_PHASES) {
      expect(phase.exam.testCases.length, `phase ${phase.id}`).toBeGreaterThan(0)
      expect(phase.exam.testCases.reduce((sum, test) => sum + test.points, 0), `phase ${phase.id}`).toBeGreaterThan(0)
    }
  })

  it('contains at least one explicit hidden behavior test', () => {
    const hiddenTests = ALL_PHASES.flatMap(phase =>
      phase.exercises.flatMap(exercise => exercise.grading?.tests?.filter(test => test.hidden) || [])
    )
    expect(hiddenTests.length).toBeGreaterThan(0)
  })

  it('does not publish empty exercises', () => {
    for (const phase of ALL_PHASES) {
      for (const exercise of phase.exercises) {
        expect(exercise.starterCode.trim().length, `${phase.id}:${exercise.id}`).toBeGreaterThan(0)
      }
    }
  })
  it('publishes the complete core and optional local-AI paths through phase 68', () => {
    expect(ALL_PHASES.map(phase => phase.id)).toEqual(Array.from({ length: 69 }, (_, index) => index))
    expect(ALL_PHASES.filter(phase => phase.stage === 'professional').length).toBe(12)
    expect(ALL_PHASES.filter(phase => phase.stage === 'advanced').length).toBe(8)
    expect(ALL_PHASES.filter(phase => phase.stage === 'engineering').length).toBe(6)
    expect(ALL_PHASES.filter(phase => phase.stage === 'ai-data').length).toBe(7)
    expect(ALL_PHASES.filter(phase => phase.stage === 'ai-deep').length).toBe(4)
    expect(ALL_PHASES.filter(phase => phase.stage === 'ai-local').length).toBe(4)
  })

})
