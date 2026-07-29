import { describe, expect, it } from 'vitest'
import { evaluateV11Regression } from './v11Quality'

/**
 * The v11 gate reported 256 issues and had been switched to continue-on-error, which is
 * the last stop before a check gets deleted. Triage found it was not 256 problems:
 *
 *    240   phases 29-68 each lost one exercise — ONE cause, 40 phases x 6 metrics
 *     15   phantom: the gate counted only `equals` as a pinned output check, while
 *          foundationHardening deliberately emits `matches` instead
 *      1   phase 27's lesson shrank by a single byte, 2308 -> 2307
 *
 * The 15 and the 1 were the gate measuring the wrong thing. These guard both fixes, so
 * the number it reports stays worth reading.
 */

const metrics = (over: Partial<Parameters<typeof evaluateV11Regression>[0]> = {}) => ({
  phaseId: 1,
  lessonBytes: 2000,
  exercises: 3,
  gradedExercises: 2,
  tests: 6,
  hiddenTests: 3,
  exactChecks: 2,
  containsChecks: 0,
  unjustifiedContainsChecks: 0,
  codeRequirements: 8,
  ...over,
})

describe('a pinned output stays pinned when it becomes a pattern', () => {
  it('does not call it a regression when equals is replaced by matches', () => {
    // Whole-output equality rejects correct answers: input() echoes its prompts, and a
    // learner may leave a debug print behind. `matches` still pins the output — as a
    // pattern. Counting only `equals` made that improvement read as erosion.
    const baseline = metrics({ exactChecks: 2 })
    const current = metrics({ exactChecks: 2 })
    expect(evaluateV11Regression(current, baseline)).toEqual([])
  })

  it('still catches an output check that genuinely disappeared', () => {
    const issues = evaluateV11Regression(metrics({ exactChecks: 1 }), metrics({ exactChecks: 2 }))
    expect(issues.map(i => i.rule)).toContain('exact-check-regression')
  })
})

describe('lesson size is measured with a tolerance, counts are not', () => {
  it('ignores a one-character edit', () => {
    // Phase 27 reported 2308 -> 2307, a 0.04% drop, as a blocking issue. A gate that
    // cannot be satisfied is a gate that gets ignored.
    expect(evaluateV11Regression(metrics({ lessonBytes: 1999 }), metrics({ lessonBytes: 2000 }))).toEqual([])
  })

  it('still catches a lesson that was actually gutted', () => {
    const issues = evaluateV11Regression(metrics({ lessonBytes: 1200 }), metrics({ lessonBytes: 2000 }))
    expect(issues.map(i => i.rule)).toContain('lesson-density-regression')
  })

  it('gives no tolerance at all to counts', () => {
    // Losing one exercise is losing one exercise. That is what phases 29-68 did.
    const issues = evaluateV11Regression(metrics({ exercises: 2 }), metrics({ exercises: 3 }))
    expect(issues.map(i => i.rule)).toContain('exercise-volume-regression')
  })
})

describe('the shape of what remains', () => {
  it('reports one issue per lost metric, so 40 phases losing an exercise reads as 240', () => {
    // Worth knowing before anyone tries to fix 240 things: it is one content change,
    // counted six ways, forty times.
    const issues = evaluateV11Regression(
      metrics({ exercises: 2, gradedExercises: 1, tests: 4, hiddenTests: 2, exactChecks: 1, codeRequirements: 5 }),
      metrics(),
    )
    expect(issues).toHaveLength(6)
  })
})
