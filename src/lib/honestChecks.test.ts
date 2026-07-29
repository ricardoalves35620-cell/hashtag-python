import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Found by feeding the grader a deliberately WRONG answer and reading what it said
 * back — 3435 where the task asks for 3535, and "CRITICAL" where the expected line is
 * "🔴 CRITICAL — 2h SLA". Both were reported as:
 *
 *     ✓ Produces the required result        3/3        100%
 *
 * The leniency itself is intentional: an observation exercise passes on the
 * predict → run → change cycle, not on matching a sample, and a learner running with
 * their own inputs produces different output that is still correct. What was wrong was
 * the claim. A check may decline to verify something; it may not report that it did.
 */

const validation = readFileSync(new URL('./learningValidation.ts', import.meta.url), 'utf8')

describe('the output check only claims what it actually compared', () => {
  it('names the condition under which a real comparison happened', () => {
    expect(validation).toContain('const comparedToExpected = authorPinsOutput && usedCanonicalInputs')
  })

  it('does not say "required result" when nothing pinned the result', () => {
    const start = validation.indexOf("id: 'expected-output'")
    const end = validation.indexOf('concept:', start)
    const block = validation.slice(start, end)
    // The strict wording must be reachable only through the comparedToExpected branch.
    expect(block).toMatch(/comparedToExpected[\s\S]*Produces the required result/)
    expect(block).toMatch(/The program produced visible output/)
    expect(block).toMatch(/O programa produziu saída visível/)
  })

  it('tells the learner to check the goal themselves when nothing was compared', () => {
    // Silence would leave them believing the tick meant their numbers were verified.
    expect(validation).toMatch(/the result was not compared with an expected output/)
    expect(validation).toMatch(/o resultado não foi comparado com uma saída esperada/)
  })

  it('does not attach an expected-output diff to a run that was never compared', () => {
    expect(validation).toContain('exercise.sampleOutput && comparedToExpected ? similarity.detail : undefined')
  })
})

/**
 * Phases 9-20 ask for a FUNCTION and call it from the grader's afterCode. A correct
 * solution prints nothing, so judging the learner's own stdout is judging a thing the
 * exercise never asked for.
 *
 * Before this, every correct answer across twelve phases showed both real tests green
 * and still "Produces the required result ✗ — the visible result does not match the
 * requested output", at 83%, under "Run this exercise successfully to continue". The
 * exercise DATA was right, which is why nothing that reads the data could see it.
 */
describe('an exercise graded through afterCode does not judge the learner stdout', () => {
  const functionExercise = {
    id: 'p9-guided-cell',
    grading: {
      tests: [{
        id: 't', afterCode: 'print(cell_at([["red","blue"]], 0, 1))',
        checks: [{ type: 'equals_any', value: ['blue'], target: 'test_output' }],
      }],
    },
    sampleOutput: { en: 'blue', pt: 'blue' },
  }

  const scriptExercise = {
    id: 'ex1_zero',
    grading: { tests: [{ id: 't', checks: [{ type: 'matches', value: 'Total: 400' }] }] },
    sampleOutput: { en: 'Total: 400', pt: 'Total: 400' },
  }

  const contentChecks = (exercise: typeof functionExercise | typeof scriptExercise) =>
    (exercise.grading?.tests || []).flatMap(test =>
      (test.checks || []).filter(check =>
        ['equals', 'equals_any', 'contains', 'contains_any', 'matches', 'numeric_equals']
          .includes(String(check.type))))

  const gradedByAfterCode = (exercise: typeof functionExercise | typeof scriptExercise) => {
    const all = contentChecks(exercise)
    return all.length > 0 && all.every(check => (check as { target?: string }).target === 'test_output')
  }

  it('recognises a function exercise as graded elsewhere', () => {
    expect(gradedByAfterCode(functionExercise)).toBe(true)
  })

  it('still judges stdout for a script exercise, where stdout IS the deliverable', () => {
    expect(gradedByAfterCode(scriptExercise)).toBe(false)
  })
})
