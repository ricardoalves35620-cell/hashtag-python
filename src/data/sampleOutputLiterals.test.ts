import { describe, it, expect } from 'vitest'
import { ALL_PHASES } from './phases'

/**
 * `sampleOutput` is graded. Prose in it becomes a requirement.
 *
 * Phases 23 and 25 wrote an ellipsis to mean "and the rest of the rows here":
 *
 *     Invalid: ... — try again
 *     Initial:
 *     #1 Alice $5230
 *     ...
 *     Final:
 *
 * `samplePattern()` in foundationHardening turns every non-empty line into a lookahead the
 * learner's output must satisfy, so both exercises silently required the learner to print
 * three literal dots. Neither could be passed by a correct solution, and both had shipped.
 *
 * The rule: every line of a sampleOutput is a line the program really prints. If something
 * is variable or elided, it belongs in the description, which is prose and is not graded.
 */

const ELISION = /(^|\s)\.\.\.(\s|$)|…|<\.\.\.>|\[\.\.\.\]/

interface Sample { where: string, text: string }

function samples(): Sample[] {
  const found: Sample[] = []
  for (const phase of ALL_PHASES) {
    for (const exercise of phase.exercises) {
      const sample = exercise.sampleOutput
      if (!sample) continue
      for (const lang of ['en', 'pt'] as const) {
        const text = typeof sample === 'string' ? sample : sample[lang]
        if (text) found.push({ where: `p${phase.id} ${exercise.id}.${lang}`, text })
      }
    }
  }
  return found
}

describe('sampleOutput is output, not prose', () => {
  it('fires on the elisions that caused this test to exist', () => {
    // A guard reporting zero proves nothing until it has been shown to report one.
    expect(ELISION.test('Invalid: ... — try again')).toBe(true)
    expect(ELISION.test('#1 Alice $5230\n...\nFinal:')).toBe(true)
    // …and stays quiet on output that legitimately contains dots.
    expect(ELISION.test('Total: $4,750.00')).toBe(false)
    expect(ELISION.test('Average: 244.29 seconds')).toBe(false)
  })

  it('no sampleOutput elides a line the learner is then required to print', () => {
    const offenders = samples()
      .filter(sample => sample.text.split('\n').some(line => ELISION.test(line)))
      .map(sample => `${sample.where}: ${JSON.stringify(sample.text.slice(0, 60))}`)
    expect(offenders).toEqual([])
  })
})
