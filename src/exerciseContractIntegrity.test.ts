import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { getPrimaryExerciseInputs, getVisibleExerciseContracts } from './lib/exerciseContract'

const INPUT_CALL = /\binput\s*\(/

describe('visible exercise contracts', () => {
  it('publishes inputs and an expected result for every exercise in both languages', () => {
    for (const phase of ALL_PHASES) {
      for (const exercise of phase.exercises) {
        for (const lang of ['en', 'pt'] as const) {
          const contracts = getVisibleExerciseContracts(exercise, lang)
          expect(contracts.length, `phase ${phase.id} exercise ${exercise.id} (${lang})`).toBeGreaterThan(0)
          for (const contract of contracts) {
            expect(contract.expected.trim(), `phase ${phase.id} exercise ${exercise.id} (${lang})`).not.toBe('')
          }
        }
      }
    }
  })

  it('provides concrete visible input values whenever starter code calls input()', () => {
    for (const phase of ALL_PHASES) {
      for (const exercise of phase.exercises) {
        if (!INPUT_CALL.test(exercise.starterCode)) continue
        expect(getPrimaryExerciseInputs(exercise).length, `phase ${phase.id} exercise ${exercise.id} calls input() without public values`).toBeGreaterThan(0)
      }
    }
  })

  it('does not use a hidden test as the public contract source', () => {
    for (const phase of ALL_PHASES) {
      for (const exercise of phase.exercises) {
        const visible = exercise.grading?.tests?.filter(testCase => !testCase.hidden) || []
        const contracts = getVisibleExerciseContracts(exercise, 'en')
        if (visible.length > 0) {
          expect(contracts.map(contract => contract.id)).toEqual(visible.map(testCase => testCase.id))
        }
      }
    }
  })
})
