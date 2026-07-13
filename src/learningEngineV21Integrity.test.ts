import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { getPedagogicalJourney, isFoundationV2Migrated } from './lib/pedagogicalJourney'

describe('Learning Engine V2.1 integrity', () => {
  it('uses the reasoning-first sequence in every phase', () => {
    for (const phase of ALL_PHASES) {
      const units = getPedagogicalJourney(phase)
      expect(units.map(unit => unit.kind)).toEqual([
        'challenge', 'intuition', 'decomposition', 'flow', 'pseudocode',
        'python', 'walkthrough', 'debug', 'practice', 'transfer',
      ])
      expect(units.every(unit => unit.checkpoint.pt.length > 30)).toBe(true)
    }
  })

  it('ships dedicated learning blueprints for the first five phases', () => {
    for (const phaseId of [0, 1, 2, 3, 4]) expect(isFoundationV2Migrated(phaseId)).toBe(true)
    expect(isFoundationV2Migrated(5)).toBe(false)
  })

  it('preserves all authored code in the Python translation step', () => {
    for (const phase of ALL_PHASES) {
      const expected = phase.lesson.blocks.filter(block => block.type === 'code').length
      const pythonUnit = getPedagogicalJourney(phase).find(unit => unit.kind === 'python')
      expect(pythonUnit?.blocks.filter(block => block.type === 'code')).toHaveLength(expected)
    }
  })
})
