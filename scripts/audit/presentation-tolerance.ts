import { ALL_PHASES } from '../../src/data/phases'

/**
 * Proves, for EVERY exercise in the app, that presentation does not decide the grade.
 *
 * Reported twice from the app on the same exercise: a learner whose loop, total, count
 * and average were all correct was failed first for printing the lines in a different
 * order, then again for `print("label: ", value)` emitting two spaces. Both times the
 * logic was right and the string was not.
 *
 * Four properties per graded exercise, all measured against the real check:
 *
 *   SAMPLE      the authored sample passes its own check  (a sanity anchor)
 *   REORDERED   the same lines in a different order pass
 *   RESPACED    the same lines with doubled spaces pass
 *   WRONG VALUE a changed number still FAILS
 *
 * The last one is what stops this from being "accept everything". Tolerance about
 * presentation is only worth anything if correctness is still enforced.
 */
const PINS = new Set(['matches', 'equals', 'equals_any', 'contains', 'contains_any', 'numeric_equals'])

const reorder = (text: string) => {
  const lines = text.split('\n').filter(Boolean)
  return lines.length < 2 ? text : [lines[lines.length - 1], ...lines.slice(0, -1)].join('\n')
}
const respace = (text: string) => text.split('\n').map(line => line.replace(/: /g, ':  ')).join('\n')
/**
 * A sample with no digits — "🚨 FLAGGED for investigation" — was returned unchanged by a
 * digits-only corruption, so the check "passed" it and the exercise was reported as
 * accepting a wrong value. The instrument was broken, not the exercise.
 */
const corrupt = (text: string) => {
  // EVERY occurrence. ex25_zero prints "#1 Alice $5230" in both its Initial and Final
  // blocks, so corrupting only the first left the second intact and the check passed —
  // which read as the exercise accepting a wrong answer when it does not.
  if (/\d/.test(text)) return text.replace(/\d+/g, match => String(Number(match) + 7))
  return text.replace(/[A-Za-zÀ-ÿ]{4,}/, word => word.split('').reverse().join(''))
}

interface Row { id: string, phase: number, sample: boolean, reordered: boolean, respaced: boolean, wrongFails: boolean }
const rows: Row[] = []

for (const phase of ALL_PHASES) {
  for (const ex of phase.exercises) {
    const sample = ex.sampleOutput?.en?.trim()
    if (!sample || sample.includes('{{')) continue

    // Only the check derived from the learner's OWN printed output. Checks that read the
    // grader's afterCode are not the learner's presentation choice, so order there is
    // meaningful and must stay strict.
    const check = (ex.grading?.tests || [])
      .flatMap(test => (test.checks || []).filter(c => PINS.has(String(c.type)) && (c as { target?: string }).target !== 'test_output'))
      .find(c => String(c.type) === 'matches')
    if (!check) continue

    const pattern = new RegExp(String((check as { value: string }).value))
    rows.push({
      id: ex.id,
      phase: phase.id,
      sample: pattern.test(sample),
      reordered: pattern.test(reorder(sample)),
      respaced: pattern.test(respace(sample)),
      wrongFails: !pattern.test(corrupt(sample)),
    })
  }
}

const bad = rows.filter(r => !r.sample || !r.reordered || !r.respaced || !r.wrongFails)
for (const row of bad) {
  const problems = [
    !row.sample && 'its own sample does not pass',
    !row.reordered && 'fails when the lines are reordered',
    !row.respaced && 'fails on doubled spaces',
    !row.wrongFails && 'ACCEPTS A WRONG VALUE',
  ].filter(Boolean)
  console.log(`p${row.phase} ${row.id}: ${problems.join('; ')}`)
}

console.log(`\n${rows.length} exercises graded on their own printed output`)
console.log(`   sample passes its own check   ${rows.filter(r => r.sample).length}/${rows.length}`)
console.log(`   tolerates a different order   ${rows.filter(r => r.reordered).length}/${rows.length}`)
console.log(`   tolerates doubled spacing     ${rows.filter(r => r.respaced).length}/${rows.length}`)
console.log(`   still rejects a wrong value   ${rows.filter(r => r.wrongFails).length}/${rows.length}`)
if (bad.length) process.exitCode = 1
