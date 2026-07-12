import { describe, expect, it } from 'vitest'
import { estimateWeightMemoryGb, recommendLocalModel } from './aiPlanner'

describe('local AI planner', () => {
  it('estimates raw quantized weight memory', () => {
    expect(estimateWeightMemoryGb(7, 4)).toBe(3.5)
    expect(estimateWeightMemoryGb(13, 8)).toBe(13)
  })

  it('rejects invalid model sizes', () => {
    expect(() => estimateWeightMemoryGb(0, 4)).toThrow()
  })

  it('recommends a range from usable memory', () => {
    expect(recommendLocalModel(8, 0).tier).toBe('small')
    expect(recommendLocalModel(32, 12).tier).toBe('medium')
    expect(recommendLocalModel(64, 24).tier).toBe('large')
  })
})
