import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Runs every graded exercise AS A PORTUGUESE LEARNER SEES IT, and checks it still passes.
 *
 * Translating a printed string changes what the program outputs. The graders accept both
 * languages — exerciseChecks() builds its pattern from sampleOutput.en AND sampleOutput.pt
 * — so a translated program passes only while those two agree with the translation. This
 * is what proves they do.
 *
 * Without it, translating the app is a coin flip: the learner reads Portuguese and is
 * then failed for producing it.
 *
 *   node scripts/audit/pt-grading.mjs
 */

const REFERENCES = JSON.parse(readFileSync('/tmp/references.json', 'utf8'))
const EXERCISES = JSON.parse(readFileSync('/tmp/ex0_20.json', 'utf8'))
const PT_CODE = JSON.parse(readFileSync('/tmp/pt-code.json', 'utf8'))

const PINS = new Set(['equals', 'equals_any', 'matches', 'numeric_equals', 'contains', 'contains_any'])
const normalise = text => (text || '').replace(/\r/g, '').split('\n').map(l => l.trimEnd()).filter(l => l.trim()).join('\n').trim()

function run(code, inputs) {
  try {
    writeFileSync('/tmp/pt-run.py', code)
    return { out: execFileSync('python3', ['/tmp/pt-run.py'], { input: inputs.join('\n') + '\n', encoding: 'utf8', timeout: 15000 }), error: null }
  } catch (error) {
    return { out: null, error: String(error.stderr || error.message).trim().split('\n').pop() }
  }
}

const values = check => Array.isArray(check.value) ? check.value.map(String) : [String(check.value)]

function passes(check, output) {
  if (check.type === 'no_error') return true
  if (check.type === 'matches') return new RegExp(values(check)[0]).test(output)
  if (check.type === 'contains' || check.type === 'contains_any') return values(check).some(v => output.includes(v))
  return values(check).map(normalise).includes(normalise(output))
}

let checked = 0, failed = 0
for (const exercise of EXERCISES) {
  if (exercise.phase > 8) continue
  const reference = REFERENCES[exercise.id]
  const pt = PT_CODE[exercise.id]
  if (!reference || pt === undefined) continue
  if (pt === reference) continue                      // nothing translated: nothing to prove

  for (const test of exercise.tests) {
    const pins = test.checks.filter(check => PINS.has(check.type))
    if (!pins.length) continue
    checked++
    const { out, error } = run(pt + (test.afterCode ? '\n' + test.afterCode : ''), test.inputs)
    if (error) {
      console.log(`p${exercise.phase} ${exercise.id}  the Portuguese version RAISED ${error}`)
      failed++
      continue
    }
    const broken = pins.filter(check => !passes(check, out))
    if (broken.length) {
      console.log(`p${exercise.phase} ${exercise.id}`)
      console.log(`   the Portuguese learner produces : ${JSON.stringify(normalise(out).slice(0, 120))}`)
      console.log(`   but the check still expects     : ${JSON.stringify(values(broken[0])[0].slice(0, 120))}`)
      console.log(`   fix: translate sampleOutput.pt to match what the translated code prints`)
      failed++
    }
  }
}

console.log(`\n${checked} graded tests run in Portuguese, ${failed} now fail`)
process.exitCode = failed ? 1 : 0
