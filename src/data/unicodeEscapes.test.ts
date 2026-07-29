import { describe, it, expect } from 'vitest'
import { ALL_PHASES } from './phases'

/**
 * A `\U0001f6a8` written inside a TypeScript template literal is not an escape TS knows,
 * so it silently becomes the letters `U0001f6a8` — the backslash is dropped and no error
 * is raised anywhere.
 *
 * Phase 5's behaviour reference printed `U0001f6a8 FLAGGED for investigation` because of
 * this. The exercise graded a learner against that string, so a correct solution printing
 * `🚨 FLAGGED for investigation` was told:
 *
 *     we expected: U0001f6a8 FLAGGED for investigation
 *     you produced: 🚨 FLAGGED for investigation
 *
 * which is unanswerable — there is no way to type the thing it is asking for. Emoji go in
 * the data as characters, not as escapes.
 */

const LOST_ESCAPE = /\bU[0-9a-fA-F]{8}\b|\bu[0-9a-fA-F]{4}\b/

function codeAssets(): Array<{ where: string, code: string }> {
  const out: Array<{ where: string, code: string }> = []
  const push = (where: string, value: unknown) => {
    if (typeof value === 'string') out.push({ where, code: value })
    else if (value && typeof value === 'object') {
      const bilingual = value as { en?: string, pt?: string }
      if (bilingual.en) out.push({ where: `${where}.en`, code: bilingual.en })
      if (bilingual.pt) out.push({ where: `${where}.pt`, code: bilingual.pt })
    }
  }
  for (const phase of ALL_PHASES) {
    for (const [n, block] of (phase.lesson?.blocks || []).entries()) {
      push(`p${phase.id} lesson block ${n}`, (block as { code?: unknown }).code)
    }
    for (const exercise of phase.exercises) {
      push(`p${phase.id} ${exercise.id} starter`, exercise.starterCode)
      push(`p${phase.id} ${exercise.id} sampleOutput`, exercise.sampleOutput)
      const behaviour = (exercise as { behaviour?: { reference?: unknown } }).behaviour
      if (behaviour) push(`p${phase.id} ${exercise.id} behaviour.reference`, behaviour.reference)
    }
    push(`p${phase.id} exam starter`, phase.exam?.starterCode)
  }
  return out
}

describe('unicode escapes in curriculum data', () => {
  it('fires on the string that caused this test to exist', () => {
    // A guard reporting zero proves nothing until it has been shown to report one.
    expect(LOST_ESCAPE.test('print("U0001f6a8 FLAGGED for investigation")')).toBe(true)
    expect(LOST_ESCAPE.test('print("🚨 FLAGGED for investigation")')).toBe(false)
  })

  it('no code asset carries an escape the template literal already ate', () => {
    const broken = codeAssets()
      .filter(asset => LOST_ESCAPE.test(asset.code))
      .map(asset => `${asset.where}: ${asset.code.match(LOST_ESCAPE)?.[0]}`)
    expect(broken).toEqual([])
  })
})
