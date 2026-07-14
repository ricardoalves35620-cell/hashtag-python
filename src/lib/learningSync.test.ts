import { describe, expect, it } from 'vitest'
import { applyLearningAttempt, createEmptyLearningState } from './learningEngine'
import { chooseNewestLearningState } from './learningSync'

describe('learning-state sync conflict resolution', () => {
  it('merges independent evidence produced on two devices', () => {
    const local = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 1, activity: 'exercise', itemId: 'local', score: 100, passed: true, skillIds: ['syntax-basics'],
    }, 100)
    const remote = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 2, activity: 'quiz', itemId: 'remote', score: 80, passed: true, skillIds: ['variables'],
    }, 200)

    const merged = chooseNewestLearningState(local, remote)
    expect(merged.attempts.map(attempt => attempt.itemId)).toEqual(['local', 'remote'])
    expect(merged.updatedAt).toBeGreaterThanOrEqual(200)
  })

  it('does not duplicate the same attempt after repeated reconciliation', () => {
    const state = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 1, activity: 'exercise', itemId: 'same', score: 100, passed: true,
    }, 100)
    const merged = chooseNewestLearningState(state, state)
    expect(merged.attempts).toHaveLength(1)
  })
})
