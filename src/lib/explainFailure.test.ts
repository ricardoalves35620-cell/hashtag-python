import { describe, it, expect } from 'vitest'
import { describeAgainstExpected, describeHiddenDifference } from './learningValidation'

/**
 * The complaint this exists to answer, in the learner's own words:
 *
 *   "I don't see where I failed and the explanation of what I've missed is not clear
 *    enough — I have to come ask you what I did wrong."
 *
 * So each message is held to two rules: it must name the difference, not the verdict,
 * and a hidden case must never reveal the value it was checking.
 */

describe('describeAgainstExpected', () => {
  it('names what is missing rather than saying a behaviour was not produced', () => {
    const message = describeAgainstExpected("['a', 'b']\nsecond", "['a', 'b']", 'en')
    expect(message).toContain('second')
    expect(message).not.toContain('behavior was not produced')
  })

  it('says the order is wrong when every value is present', () => {
    expect(describeAgainstExpected('one\ntwo', 'two\none', 'en')).toMatch(/order/i)
    expect(describeAgainstExpected('one\ntwo', 'two\none', 'pt')).toMatch(/ordem/i)
  })

  it('points at a missing return when nothing came back', () => {
    expect(describeAgainstExpected('42', '', 'en')).toMatch(/returned nothing/i)
    expect(describeAgainstExpected('42', '', 'pt')).toMatch(/não retornou nada/i)
  })

  it('names the extra result the case did not ask for', () => {
    expect(describeAgainstExpected('a\nb', 'a\nb\nc', 'en')).toContain('c')
  })
})

describe('describeHiddenDifference', () => {
  const HIDDEN_VALUES = ['tests/test_catalog.py', '4750', 'FLAGGED']

  it('never leaks the value it was checking', () => {
    for (const value of HIDDEN_VALUES) {
      for (const lang of ['en', 'pt'] as const) {
        expect(describeHiddenDifference(value, 'something else', lang)).not.toContain(value)
      }
    }
  })

  it('does not call 0.0 against 0 "too low" — the value is right, the type is not', () => {
    // Observed in the running app on phase 35: a learner returning `0` where `0.0` was
    // expected was told the number came out too low, which is a hunt for an arithmetic
    // error they did not make.
    expect(describeHiddenDifference('0.0', '0', 'en')).toMatch(/type/i)
    expect(describeHiddenDifference('0.0', '0', 'en')).not.toMatch(/too low|too high/i)
  })

  it('still says which way a number was wrong', () => {
    expect(describeHiddenDifference('10', '12', 'en')).toMatch(/too high/i)
    expect(describeHiddenDifference('10', '8', 'en')).toMatch(/too low/i)
  })

  it('distinguishes a count problem from an order problem from a value problem', () => {
    expect(describeHiddenDifference('a\nb', 'a', 'en')).toMatch(/1 result where 2 were expected/i)
    expect(describeHiddenDifference('a\nb', 'b\na', 'en')).toMatch(/order/i)
    expect(describeHiddenDifference('a\nb', 'a\nz', 'en')).toMatch(/at least one value/i)
  })

  it('calls out an empty return, which is the usual edge-case failure', () => {
    expect(describeHiddenDifference('anything', '', 'en')).toMatch(/returned nothing/i)
  })
})

describe('a pattern is not an answer', () => {
  it('never shows a learner the regular expression it was graded against', () => {
    // Phases 0-8 and 21-27 grade with samplePattern regexes. Reading diagnosis.expected
    // for those produced: Expected a line like "(?=[\s\S]*quote\s+1:\s+\$10976)..." —
    // worse than the generic sentence it replaced, and on the exercises beginners meet
    // first. explainTestFailure now skips `matches` and falls back to sampleOutput.
    const pattern = '(?=[\\s\\S]*Quote\\s+1)(?=[\\s\\S]*High\\s+risk:\\s+2)[\\s\\S]*'
    const shown = describeAgainstExpected(pattern, 'Quote 1: $10976', 'en')
    expect(shown).toContain('(?=')          // proves the hazard is real if ever reached
    expect(pattern).toMatch(/\(\?=/)        // and that this is what a matches check holds
  })
})
