import { describe, expect, it, vi } from 'vitest'
import { ALL_PHASES } from '../data/phases'
import { getSkillsForPhase, SKILLS } from '../data/skills'
import {
  applyLearningAttempt,
  applyLearningAttempts,
  buildDiagnosticQueue,
  buildReviewQueue,
  createEmptyLearningState,
  getDueSkillStates,
  getLearningSummary,
  markDiagnosticComplete,
} from './learningEngine'

describe('learning engine', () => {
  it('maps every published phase to at least one skill', () => {
    for (const phase of ALL_PHASES) {
      expect(getSkillsForPhase(phase.id), `phase ${phase.id}`).not.toHaveLength(0)
    }
  })

  it('keeps unique skill identifiers', () => {
    expect(new Set(SKILLS.map(skill => skill.id)).size).toBe(SKILLS.length)
  })

  it('updates mastery and schedules spaced review', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const now = new Date('2026-07-11T12:00:00Z').getTime()
    const next = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 3,
      activity: 'exercise',
      itemId: 'variables-1',
      score: 100,
      passed: true,
      hintsUsed: 1,
    }, now)

    const state = next.skills['python.variables']
    expect(state.mastery).toBe(96)
    expect(state.attempts).toBe(1)
    expect(state.streak).toBe(1)
    expect(state.intervalDays).toBe(1)
    expect(state.nextReviewAt).toBe(now + 24 * 60 * 60 * 1000)
    vi.restoreAllMocks()
  })

  it('resets the review streak after a failed attempt', () => {
    const now = Date.now()
    let state = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 5, activity: 'quiz', itemId: 'q1', score: 100, passed: true,
    }, now)
    state = applyLearningAttempt(state, {
      phaseId: 5, activity: 'review', itemId: 'r1', score: 0, passed: false,
    }, now + 1000)

    expect(state.skills['python.conditionals'].streak).toBe(0)
    expect(state.skills['python.conditionals'].intervalDays).toBe(0)
    expect(state.skills['python.conditionals'].mastery).toBeLessThan(100)
  })

  it('returns due skills only after their review date', () => {
    const now = Date.now()
    const state = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 8, activity: 'exercise', itemId: 'for-1', score: 100, passed: true,
    }, now)
    expect(getDueSkillStates(state, now)).toHaveLength(0)
    expect(getDueSkillStates(state, now + 2 * 24 * 60 * 60 * 1000)).toHaveLength(1)
  })

  it('creates a diagnostic that covers distinct early skills', () => {
    const queue = buildDiagnosticQueue(ALL_PHASES)
    expect(queue).toHaveLength(10)
    expect(new Set(queue.map(item => item.skillId)).size).toBe(10)
  })

  it('builds reviews from weak or due skills', () => {
    const now = Date.now()
    const state = applyLearningAttempts(createEmptyLearningState(), [
      { phaseId: 1, activity: 'diagnostic', itemId: 'one', score: 0, passed: false },
      { phaseId: 3, activity: 'diagnostic', itemId: 'two', score: 100, passed: true },
    ], now)
    const queue = buildReviewQueue(state, ALL_PHASES, 4, now)
    expect(queue.length).toBeGreaterThan(0)
    expect(queue[0].skillId).toBe('python.output')
  })

  it('tracks diagnostic completion and summary totals', () => {
    const now = Date.now()
    let state = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 1, activity: 'diagnostic', itemId: 'd1', score: 100, passed: true,
    }, now)
    state = markDiagnosticComplete(state, now + 1)
    const summary = getLearningSummary(state)
    expect(state.diagnosticCompletedAt).toBe(now + 1)
    expect(summary.practicedSkills).toBe(1)
    expect(summary.totalAttempts).toBe(1)
    expect(summary.averageMastery).toBe(100)
  })
})
