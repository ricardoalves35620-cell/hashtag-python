import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from '../data/phases'
import { getPedagogicalJourney } from './pedagogicalJourney'

describe('multi-lesson pedagogy for every phase', () => {
  it('gives all 69 phases a six-lesson reasoning journey', () => {
    expect(ALL_PHASES).toHaveLength(69)
    for (const phase of ALL_PHASES) {
      const journey = getPedagogicalJourney(phase)
      expect(journey).toHaveLength(6)
      expect(journey.map(unit => unit.kind)).toEqual([
        'intuition', 'logic', 'python', 'debug', 'practice', 'mastery',
      ])
      expect(journey.every(unit => unit.blocks.length >= 2)).toBe(true)
      expect(journey.every(unit => unit.checkpoint.en.length > 20 && unit.checkpoint.pt.length > 20)).toBe(true)
    }
  })

  it('preserves authored code inside the Python lesson', () => {
    for (const phase of ALL_PHASES) {
      const authoredCode = phase.lesson.blocks.filter(block => block.type === 'code')
      const pythonLesson = getPedagogicalJourney(phase).find(unit => unit.kind === 'python')
      expect(pythonLesson).toBeDefined()
      expect(pythonLesson!.blocks.filter(block => block.type === 'code')).toHaveLength(authoredCode.length)
    }
  })
})
