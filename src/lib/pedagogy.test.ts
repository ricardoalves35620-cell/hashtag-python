import { describe, expect, it } from 'vitest'
import { getExercisePedagogy } from './pedagogy'
import type { Phase } from '../data/types'

const phase: Phase = {
  id: 99,
  title: { en: 'Test', pt: 'Teste' }, description: { en: 'Test', pt: 'Teste' }, icon: 'T', libraries: [], stage: 'professional', estimatedHours: 1,
  lesson: { title: { en: 'Test', pt: 'Teste' }, blocks: [] },
  exercises: [{ id: 'e1', title: { en: 'E', pt: 'E' }, description: { en: 'Do it', pt: 'Faça' }, starterCode: 'print(1)', hints: [], sampleOutput: { en: '1', pt: '1' } }],
  quiz: [], exam: { title: { en: 'E', pt: 'E' }, scenario: { en: 'S', pt: 'S' }, requirements: { en: [], pt: [] }, starterCode: '', testCases: [] },
}

describe('exercise pedagogy', () => {
  it('creates useful defaults for legacy exercises', () => {
    const result = getExercisePedagogy(phase, phase.exercises[0], 0, 'pt')
    expect(result.difficulty).toBe('guided')
    expect(result.estimatedMinutes).toBeGreaterThan(0)
    expect(result.successCriteria.join(' ')).toContain('resultado')
    expect(result.commonMistakes.length).toBeGreaterThan(1)
  })

  it('respects authored metadata', () => {
    const exercise = { ...phase.exercises[0], estimatedMinutes: 25, difficulty: 'challenge' as const, objective: { en: 'Custom', pt: 'Personalizado' } }
    const result = getExercisePedagogy({ ...phase, exercises: [exercise] }, exercise, 0, 'pt')
    expect(result.estimatedMinutes).toBe(25)
    expect(result.difficulty).toBe('challenge')
    expect(result.objective).toBe('Personalizado')
  })
})
