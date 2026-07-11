import { describe, expect, it } from 'vitest'
import { createEmptyLearningState } from './learningEngine'
import { chooseNewestLearningState } from './learningSync'

describe('learning-state sync conflict resolution', () => {
  it('keeps the newest state', () => {
    const local = { ...createEmptyLearningState(), updatedAt: 200 }
    const remote = { ...createEmptyLearningState(), updatedAt: 100 }
    expect(chooseNewestLearningState(local, remote)).toBe(local)
    expect(chooseNewestLearningState(remote, local)).toBe(local)
  })
})
