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
