import { describe, expect, it } from 'vitest'
import { calculateGamification } from './gamification'
import { createEmptyLearningState } from './learningEngine'

describe('gamification', () => {
  it('starts at level one', () => {
    expect(calculateGamification(createEmptyLearningState()).level).toBe(1)
  })

  it('awards more xp for passed exams', () => {
    const state = createEmptyLearningState()
    state.attempts.push({ id: '1', phaseId: 1, activity: 'exam', itemId: 'exam', skillIds: [], score: 100, passed: true, errorCategory: null, timestamp: Date.now(), hintsUsed: 0 })
    const summary = calculateGamification(state)
    expect(summary.xp).toBeGreaterThanOrEqual(50)
    expect(summary.badges).toContain('perfect-exam')
  })
})
