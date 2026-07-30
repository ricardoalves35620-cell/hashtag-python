import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { describeAgainstExpected, describeHiddenDifference } from './learningValidation'

/**
 * Coverage, not correctness: how many of the app's REAL expectations can still only
 * produce "one of the expected behaviors was not produced"?
 *
 * explainFailure.test.ts pins the describers against hand-written pairs. This runs them
 * against every pinned expectation in the curriculum, mutated the way a learner actually
 * gets things wrong — reordered, a line short, a number off by one, nothing returned —
 * and fails if any of them still lands on the generic sentence.
 *
 * Needs .audit-cache/exercises.json, which `npm run audit:content:expectations` writes.
 * Skips rather than fails when it is absent, because a missing cache is not a defect in
 * the app — but it says so, instead of quietly passing.
 */

const CACHE = '.audit-cache/exercises.json'
const GENERIC = /expected behaviors was not produced|comportamentos esperados não foi produzido|another valid input|outra entrada válida/i

const MUTATIONS: Array<[string, (value: string) => string]> = [
  ['reordered', value => value.split('\n').reverse().join('\n')],
  ['a line short', value => value.split('\n').slice(0, -1).join('\n')],
  ['a number off by one', value => value.replace(/-?\d+/, match => String(Number(match) + 1))],
  ['nothing returned', () => ''],
]

describe('every real expectation can explain its own failure', () => {
  it('never falls back to the generic sentence', () => {
    if (!existsSync(CACHE)) {
      console.warn(`${CACHE} missing — run npm run audit:content:expectations first`)
      return
    }
    const exercises = JSON.parse(readFileSync(CACHE, 'utf8'))
    const weak: string[] = []
    let checked = 0

    for (const exercise of exercises) {
      for (const test of exercise.tests || []) {
        const pinned = (test.checks || []).find(
          (check: { type: string, value: unknown }) =>
            ['equals', 'contains'].includes(check.type) && typeof check.value === 'string')
        if (!pinned) continue
        for (const [name, mutate] of MUTATIONS) {
          const actual = mutate(String(pinned.value))
          if (actual === String(pinned.value)) continue
          checked += 1
          const message = test.hidden
            ? describeHiddenDifference(String(pinned.value), actual, 'en')
            : describeAgainstExpected(String(pinned.value), actual, 'en')
          if (GENERIC.test(message)) weak.push(`p${exercise.phase} ${exercise.id} (${name})`)
        }
      }
    }

    console.log(`${checked} failure messages generated from real expectations`)
    expect([...new Set(weak)]).toEqual([])
  })
})
