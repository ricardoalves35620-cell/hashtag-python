import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'

describe('Sprint 8.2 exercise pedagogy', () => {
  it('keeps a first exercise in every phase', () => {
    expect(ALL_PHASES.every(phase => phase.exercises.length > 0)).toBe(true)
  })

  it('uses consistent suggested inputs for the phase 7 batch exercise', () => {
    const exercise = ALL_PHASES.find(phase => phase.id === 7)?.exercises.find(item => item.id === 'ex7_zero')
    expect(exercise?.suggestedInputs).toEqual(['2750', '2750', '2750', '2750'])
    expect(exercise?.sampleOutput?.pt).toContain('10200')
  })
})
