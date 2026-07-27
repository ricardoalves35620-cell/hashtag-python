import { describe, expect, it } from 'vitest'
import type { UserProgress } from '../data/types'
import { canAccessLearningStep } from './learningAccess'

function row(phaseId: number, patch: Partial<UserProgress> = {}): UserProgress {
  return {
    user_id: 'learner', phase_id: phaseId,
    lesson_done: false, exercises_done: false, quiz_done: false,
    exam_done: false, exam_score: null, exam_passed: false, project_done: false,
    ...patch,
  }
}

describe('learning route access', () => {
  it('opens only the first phase when there is no progress', () => {
    expect(canAccessLearningStep('overview', 0, [])).toBe(true)
    expect(canAccessLearningStep('lesson', 0, [])).toBe(true)
    expect(canAccessLearningStep('overview', 1, [])).toBe(false)
  })

  it('requires every step in order', () => {
    const lesson = [row(0, { lesson_done: true })]
    expect(canAccessLearningStep('exercises', 0, lesson)).toBe(true)
    expect(canAccessLearningStep('quiz', 0, lesson)).toBe(false)

    const practice = [row(0, { lesson_done: true, exercises_done: true })]
    expect(canAccessLearningStep('quiz', 0, practice)).toBe(true)
    expect(canAccessLearningStep('exam', 0, practice)).toBe(false)

    const quiz = [row(0, { lesson_done: true, exercises_done: true, quiz_done: true })]
    expect(canAccessLearningStep('exam', 0, quiz)).toBe(true)
  })

  it('opens a mini-project only after its assessment passes', () => {
    const beforeExam = [row(3, { exam_passed: true }), row(4, { quiz_done: true })]
    expect(canAccessLearningStep('project', 4, beforeExam)).toBe(false)

    const afterExam = [row(3, { exam_passed: true }), row(4, { quiz_done: true, exam_passed: true })]
    expect(canAccessLearningStep('project', 4, afterExam)).toBe(true)
  })
})
