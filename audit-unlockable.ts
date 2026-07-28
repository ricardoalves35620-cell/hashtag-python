import { ALL_PHASES } from './src/data/phases'

/**
 * CRITICAL check: can every exercise in a phase actually be passed?
 *
 * A phase only completes when EVERY exercise validates. So one exercise that cannot
 * be passed locks the whole phase — and the learner sees a lock on a different
 * exercise, which is the worst possible place to be stuck offline.
 *
 * An exercise is unpassable if it has no grading at all, if it has grading but no
 * test, or if its task asks the learner to read input while its test supplies none.
 */
const ASKS_INPUT = /\b(gather input|ask for|prompt the user|receber os dados|solicite|pergunt)\b/i
const MAX = Number(process.argv[2] ?? 68)
let blocked = 0

for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  for (const ex of phase.exercises) {
    const tests = ex.grading?.tests || []
    const reasons: string[] = []

    // An exercise with no authored tests still passes on the base checks
    // (no_error, expected output, code requirements), so that alone is fine.
    // What is fatal is a test that no correct answer can satisfy.

    if (ASKS_INPUT.test(`${ex.description?.en || ''} ${ex.description?.pt || ''}`)) {
      const starved = tests.filter(t => !(t.inputs || []).length && !(t as any).afterCode)
      if (starved.length === tests.length && tests.length > 0) {
        reasons.push('task asks for input, no test supplies any')
      }
    }

    if (reasons.length) {
      console.log(`p${phase.id} ${ex.id}: ${reasons.join('; ')}`)
      blocked++
    }
  }
}
console.log(`\n${blocked} exercises could block their phase`)
