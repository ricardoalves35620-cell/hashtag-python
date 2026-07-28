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
