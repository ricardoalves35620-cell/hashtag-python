import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from '../data/phases/index'
import { normaliseOutput, outputsMatch } from './behaviourGrading'

/**
 * The behavioural-grading pilot. These guard the two things that would make it worse
 * than what it replaces: failing a correct answer, and gating a learner on an
 * experiment.
 */

describe('what counts as the same output', () => {
  it('ignores trailing spaces and blank lines', () => {
    // Invisible on screen. Failing a beginner for them teaches nothing.
    expect(outputsMatch('Fee: 1600.0   \n\n', 'Fee: 1600.0')).toBe(true)
  })

  it('does not ignore a different value', () => {
    expect(outputsMatch('Fee: 1600.0', 'Fee: 2200.0')).toBe(false)
  })

  it('does not ignore a different label', () => {
    // The label is part of what the exercise asks for.
    expect(outputsMatch('Fee: 1600.0', 'Taxa: 1600.0')).toBe(false)
  })

  it('does not ignore case', () => {
    expect(outputsMatch('Fee: 1600.0', 'fee: 1600.0')).toBe(false)
  })

  it('keeps interior blank lines out of the comparison but not interior content', () => {
    expect(normaliseOutput('a\n\n\nb')).toBe('a\nb')
    expect(outputsMatch('a\n\nb', 'a\nb')).toBe(true)
    expect(outputsMatch('a\nb', 'b\na')).toBe(false)
  })
})

describe('the pilot cannot fail a learner', () => {
  const validation = readFileSync(new URL('./learningValidation.ts', import.meta.url), 'utf8')

  it('reports as a hidden check, so it stays out of the pass ratio', () => {
    const start = validation.indexOf("id: 'behaviour-pilot'")
    expect(start).toBeGreaterThan(-1)
    const block = validation.slice(start, validation.indexOf('concept:', start))
    expect(block).toContain('hidden: true')
  })

  it('swallows its own errors rather than blocking a run', () => {
    // A broken experiment must never be the reason a learner cannot continue.
    const start = validation.indexOf('if (exercise.behaviour')
    const block = validation.slice(start, start + 900)
    expect(block).toMatch(/try \{[\s\S]*gradeBehaviour[\s\S]*\} catch/)
    expect(block).toContain('report = null')
  })

  it('says nothing at all when the runtime never loaded', () => {
    // Nothing was assessed, so nothing may be claimed — the same rule the output check
    // now follows after it reported "Produces the required result" on a wrong answer.
    expect(validation).toContain('!report.runtimeUnavailable && report.results.length > 0')
  })
})

describe('the pilot is scoped to exercises it can actually judge', () => {
  const phase6 = (ALL_PHASES as any[]).find(phase => phase.id === 6)

  it('leaves the observation exercise alone', () => {
    // "Run it and try different values" invites exploration. Comparing output to a
    // reference would fail a learner who added a print() while exploring.
    const guided = phase6.exercises.find((e: any) => e.id === 'ex6_guided')
    expect(guided.behaviour, 'an observation exercise has no single correct behaviour').toBeUndefined()
  })

  it('leaves the from-scratch exercise alone until it takes an input', () => {
    // "Store a rating score" means the learner picks the value, so there is exactly one
    // behaviour and it is theirs. A reference storing 9.2 fails everyone who stored 8.
    const zero = phase6.exercises.find((e: any) => e.id === 'ex6_zero')
    expect(zero.behaviour).toBeUndefined()
  })

  it('keeps ex6_zero internally consistent, since its hints contradicted its task', () => {
    // Hint 2 gave 0-100 thresholds (>= 90, >= 75, >= 60) for a task scored out of 10,
    // and hint 1 said int() for an example of 9.2 — int("9.2") raises ValueError. A
    // learner following both got a crash, in the hardest exercise of the phase.
    const zero = phase6.exercises.find((e: any) => e.id === 'ex6_zero')
    const hints = zero.hints.map((h: any) => h.en).join(' ')
    expect(hints).not.toMatch(/>=\s*90|>=\s*75|>=\s*60/)
    expect(hints).not.toContain('int(input')
    expect(hints).toMatch(/score >= 9/)
  })
})

describe('the phase 6 pilot exercise', () => {
  const exercise = (ALL_PHASES as any[])
    .find(phase => phase.id === 6)
    ?.exercises.find((item: any) => item.id === 'ex6_fill')

  it('exists and carries a behaviour spec', () => {
    expect(exercise?.behaviour).toBeTruthy()
  })

  it('tests every bracket boundary, which is where < and <= diverge', () => {
    const inputs = exercise.behaviour.cases.flatMap((c: any) => c.inputs ?? [])
    // The exercise has brackets at 21, 26 and 60. An off-by-one is invisible on any
    // other value, so a case list without these proves nothing.
    for (const boundary of ['21', '26', '60']) {
      expect(inputs, `no case exercises the boundary at ${boundary}`).toContain(boundary)
    }
  })

  it('keeps all but one case hidden', () => {
    const visible = exercise.behaviour.cases.filter((c: any) => c.visible)
    expect(visible).toHaveLength(1)
    expect(visible[0].inputs).toEqual(['25']) // the value the task itself shows
  })

  it('labels every case in both languages', () => {
    for (const item of exercise.behaviour.cases) {
      expect(item.label.en?.length, 'a hidden failure names its case, so it needs a label').toBeGreaterThan(3)
      expect(item.label.pt?.length).toBeGreaterThan(3)
    }
  })

  it('has a reference that solves the exercise rather than restating the starter', () => {
    // The starter contains blanks; a reference that still had them would grade nothing.
    expect(exercise.behaviour.reference).not.toContain('___')
    expect(exercise.behaviour.reference).toContain('elif')
  })
})
