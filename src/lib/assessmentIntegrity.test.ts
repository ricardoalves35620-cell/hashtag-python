import { describe, expect, it } from 'vitest'
import {
  conciseAssessmentOption,
  correctDisplayPosition,
  shuffledCopy,
  shuffledIndices,
} from './assessmentIntegrity'

describe('assessment integrity', () => {
  it('keeps a stable order for the same attempt seed', () => {
    expect(shuffledIndices(4, 1234, 'q1')).toEqual(shuffledIndices(4, 1234, 'q1'))
  })

  it('does not preserve authored order for multi-option questions', () => {
    expect(shuffledIndices(4, 1234, 'q1')).not.toEqual([0, 1, 2, 3])
  })

  it('moves the correct answer across positions over different attempts', () => {
    const positions = new Set<number>()
    for (let seed = 1; seed <= 20; seed += 1) {
      positions.add(correctDisplayPosition(shuffledIndices(4, seed, 'same-question'), 0))
    }
    expect(positions.size).toBeGreaterThanOrEqual(3)
  })

  it('shuffles question order without mutating the source', () => {
    const source = ['a', 'b', 'c', 'd']
    const shuffled = shuffledCopy(source, 77, 'questions')
    expect(source).toEqual(['a', 'b', 'c', 'd'])
    expect(shuffled).not.toEqual(source)
    expect([...shuffled].sort()).toEqual(source)
  })

  it('removes explanatory text that creates a longest-answer clue', () => {
    expect(conciseAssessmentOption('14 — multiplication runs first')).toBe('14')
    expect(conciseAssessmentOption('5.0 (division always gives decimal)')).toBe('5.0')
  })

  it('does not shorten code calls or meaningful parentheses', () => {
    expect(conciseAssessmentOption('names.append("Eva")')).toBe('names.append("Eva")')
    expect(conciseAssessmentOption('(2 + 3) * 4')).toBe('(2 + 3) * 4')
  })
})
