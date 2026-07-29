import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'

/**
 * A checkpoint is the only place in a lesson where the learner has to commit to an
 * answer before being shown one. Every phase had at least one except phase 27 — the
 * foundation capstone, the single phase where consolidating is the entire point.
 *
 * Phase 0 is the onboarding tour and has no lesson to check, so it is excluded by name
 * rather than by a rule that would quietly excuse the next phase to lose one.
 */
describe('every teaching phase makes the learner commit to an answer', () => {
  const withoutCheckpoints = ALL_PHASES
    .filter(phase => phase.id !== 0)
    .filter(phase => (phase.lesson?.blocks || []).every(block => block.type !== 'checkpoint'))
    .map(phase => phase.id)

  it('has no phase whose lesson is read-only', () => {
    expect(withoutCheckpoints).toEqual([])
  })
})

describe('a checkpoint is answerable', () => {
  const checkpoints = ALL_PHASES.flatMap(phase =>
    (phase.lesson?.blocks || [])
      .filter(block => block.type === 'checkpoint' && block.checkpoint)
      .map((block, index) => ({ id: `p${phase.id} #${index}`, checkpoint: block.checkpoint! })))

  it('points correctIndex at a real option, and offers a real choice', () => {
    const broken = checkpoints.filter(({ checkpoint }) =>
      checkpoint.options.length < 2
      || checkpoint.correctIndex < 0
      || checkpoint.correctIndex >= checkpoint.options.length)
    expect(broken.map(b => b.id)).toEqual([])
  })

  it('never repeats an option, in either language', () => {
    // Two identical options mean one of them is unanswerable.
    const duplicated = checkpoints.filter(({ checkpoint }) =>
      new Set(checkpoint.options.map(o => o.en)).size !== checkpoint.options.length
      || new Set(checkpoint.options.map(o => o.pt)).size !== checkpoint.options.length)
    expect(duplicated.map(d => d.id)).toEqual([])
  })

  it('explains itself in both languages', () => {
    const silent = checkpoints.filter(({ checkpoint }) =>
      !checkpoint.explanation?.en?.trim() || !checkpoint.explanation?.pt?.trim())
    expect(silent.map(s => s.id)).toEqual([])
  })
})
