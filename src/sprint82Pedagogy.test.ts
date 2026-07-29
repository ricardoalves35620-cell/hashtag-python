import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'

describe('Sprint 8.2 exercise pedagogy', () => {
  it('keeps a first exercise in every phase', () => {
    expect(ALL_PHASES.every(phase => phase.exercises.length > 0)).toBe(true)
  })

  /**
   * This test used to assert two literals side by side — suggestedInputs of 2750 four
   * times, and a sample output containing 10200 — and called that consistent. Four
   * orders of 2750 come to 11000. The exercise demanded an output its own inputs could
   * not produce, and the test that was supposed to catch that pinned it in place.
   *
   * A snapshot of two values cannot notice they disagree. So assert the relationship:
   * whatever the inputs are, their sum is the total the task promises.
   */
  it('suggests inputs that actually add up to the total in the sample output', () => {
    const exercise = ALL_PHASES.find(phase => phase.id === 7)?.exercises.find(item => item.id === 'ex7_zero')
    const inputs = exercise?.suggestedInputs ?? []
    expect(inputs.length).toBeGreaterThan(0)

    const total = inputs.reduce((sum, value) => sum + Number(value), 0)
    const average = total / inputs.length

    for (const lang of ['en', 'pt'] as const) {
      const sample = exercise?.sampleOutput?.[lang] ?? ''
      expect(sample, `${lang} sample must show the total the inputs produce`).toContain(String(total))
      expect(sample, `${lang} sample must show the average the inputs produce`).toContain(String(average))
    }
  })
})
