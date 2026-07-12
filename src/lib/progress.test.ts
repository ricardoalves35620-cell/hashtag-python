import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from '../data/phases'
import type { UserProgress } from '../data/types'
import { getOverallProgress, getPhaseStatus, mergeProgress } from './progress'

const row = (phaseId: number, passed: boolean): UserProgress => ({
  phase_id: phaseId,
  lesson_done: true,
  exercises_done: true,
  quiz_done: true,
  exam_done: true,
  exam_score: passed ? 90 : 50,
  exam_passed: passed,
})

describe('phase progression', () => {
  it('keeps the first published phase accessible', () => {
    expect(getPhaseStatus([], ALL_PHASES[0].id)).toBe('active')
  })

  it('unlocks only after the preceding exam is passed', () => {
    const first = ALL_PHASES[0].id
    const second = ALL_PHASES[1].id
    expect(getPhaseStatus([row(first, false)], second)).toBe('locked')
    expect(getPhaseStatus([row(first, true)], second)).toBe('active')
  })

  it('calculates progress from the live curriculum length', () => {
    expect(getOverallProgress([row(ALL_PHASES[0].id, true)])).toBe(Math.round(100 / ALL_PHASES.length))
  })

  it('keeps completed steps and the best exam score when devices disagree', () => {
    const remote: UserProgress = {
      phase_id: 2,
      user_id: 'user-1',
      lesson_done: true,
      exercises_done: true,
      quiz_done: true,
      exam_done: true,
      exam_score: 92,
      exam_passed: true,
    }
    const local: UserProgress = {
      phase_id: 2,
      user_id: 'user-1',
      lesson_done: true,
      exercises_done: false,
      quiz_done: false,
      exam_done: true,
      exam_score: 70,
      exam_passed: false,
    }

    expect(mergeProgress([remote], [local])[0]).toMatchObject({
      lesson_done: true,
      exercises_done: true,
      quiz_done: true,
      exam_done: true,
      exam_score: 92,
      exam_passed: true,
    })
  })
})
