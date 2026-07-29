import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from '../data/phases'
import { shuffledIndices } from './assessmentIntegrity'
import { HARDWARE_ANSWERS, LOCAL_CLOUD_ANSWERS } from './baseZero'

/**
 * Can a learner score full marks by position alone, without reading?
 *
 * The authored data is heavily skewed — 227 of 252 quiz answers and 95 of 95 checkpoint
 * answers are option 1 — which looks alarming and is not, because the quiz and lesson
 * checkpoints shuffle per question before rendering. That is worth pinning: the skew is
 * harmless ONLY while the shuffle exists, and a future change that drops it would hand
 * every answer away with nothing failing.
 *
 * The Base Zero hardware match was the one place with no shuffle. Its four prompts ran
 * CPU, RAM, storage, GPU above a dropdown listing CPU, RAM, storage, GPU.
 */
describe('answers cannot be found by position', () => {
  it('spreads the correct quiz answer across every display position', () => {
    const counts = new Map<number, number>()
    for (const phase of ALL_PHASES) {
      for (const question of phase.quiz || []) {
        const order = shuffledIndices(question.options.length, 1, question.id)
        const at = order.indexOf(question.correctIndex)
        counts.set(at, (counts.get(at) || 0) + 1)
      }
    }
    const total = [...counts.values()].reduce((sum, n) => sum + n, 0)
    // No position may hold more than half the answers. Authored data sits at 90% on
    // option 1; anything near that here means the shuffle stopped working.
    for (const [, n] of counts) expect(n / total).toBeLessThan(0.5)
    expect(counts.size).toBeGreaterThan(1)
  })

  it('spreads the correct checkpoint answer too', () => {
    const counts = new Map<number, number>()
    for (const phase of ALL_PHASES) {
      for (const block of phase.lesson?.blocks || []) {
        if (block.type !== 'checkpoint' || !block.checkpoint) continue
        const order = shuffledIndices(block.checkpoint.options.length, 1, block.checkpoint.code)
        const at = order.indexOf(block.checkpoint.correctIndex)
        counts.set(at, (counts.get(at) || 0) + 1)
      }
    }
    const total = [...counts.values()].reduce((sum, n) => sum + n, 0)
    for (const [, n] of counts) expect(n / total).toBeLessThan(0.5)
  })

  it('gives the hardware match a different option order in every dropdown', () => {
    const rows = Object.keys(HARDWARE_ANSWERS)
    const orders = rows.map(id => shuffledIndices(4, 1, `hardware-${id}`).join(','))
    expect(new Set(orders).size).toBe(rows.length)
  })

  it('never lets "pick the nth option in the nth box" score the hardware match', () => {
    const choices = ['cpu', 'ram', 'storage', 'gpu']
    const rows = Object.keys(HARDWARE_ANSWERS)
    const byPosition = Object.fromEntries(rows.map((id, index) => {
      const order = shuffledIndices(4, 1, `hardware-${id}`)
      return [id, choices[order[index]]]
    }))
    const correct = rows.filter(id => byPosition[id] === HARDWARE_ANSWERS[id]).length
    expect(correct).toBeLessThan(rows.length)
  })

  it('does not let a single alternating guess pass the local/cloud sort', () => {
    const ids = ['downloads-folder', 'google-drive', 'onedrive-web', 'desktop-file']
    for (const start of ['local', 'cloud'] as const) {
      const guess = ids.map((_, index) =>
        index % 2 === 0 ? start : (start === 'local' ? 'cloud' : 'local'))
      const correct = ids.filter((id, index) => LOCAL_CLOUD_ANSWERS[id] === guess[index]).length
      expect(correct).toBeLessThan(ids.length)
    }
  })
})
