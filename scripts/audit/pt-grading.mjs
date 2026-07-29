import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { EXERCISES_JSON, REFERENCES_JSON, REFERENCES_PT_JSON, cachePath } from './cache.mjs'
import { findPython } from './python.mjs'

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

const REFERENCES = JSON.parse(readFileSync(REFERENCES_JSON, 'utf8'))
const EXERCISES = JSON.parse(readFileSync(EXERCISES_JSON, 'utf8'))
/**
 * The Portuguese form of each reference, produced by localize-references.ts.
 *
 * This used to read /tmp/pt-code.json, which NOTHING in the repository wrote — it existed
 * on one machine because a one-off command had made it there. Anywhere else the script
 * crashed on a missing file, or worse, would have compared nothing.
 */
const PT_CODE = JSON.parse(readFileSync(process.env.HP_REFERENCES_PT || REFERENCES_PT_JSON, 'utf8'))

const PYTHON = findPython()
if (!PYTHON) {
  console.error('no working Python found (tried python3, python, py -3) — see scripts/audit/python.mjs')
  process.exit(1)
}

const PINS = new Set(['equals', 'equals_any', 'matches', 'numeric_equals', 'contains', 'contains_any'])
const normalise = text => (text || '').replace(/\r/g, '').split('\n').map(l => l.trimEnd()).filter(l => l.trim()).join('\n').trim()

function run(code, inputs) {
  try {
    const scriptPath = cachePath('pt-run.py')
    writeFileSync(scriptPath, code, 'utf8')
    // `python3` is not a command on Windows — see python.mjs. Resolved once, at the top.
    return { out: execFileSync(PYTHON.command, [...PYTHON.prefix, scriptPath], { input: inputs.join('\n') + '\n', encoding: 'utf8', timeout: 15000, env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONUTF8: '1' } }), error: null }
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
  // Phases 9-20 used to be skipped outright. They are graded the same way and translated
  // the same way, so a translation could break them and this would still report success.
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

console.log(`\n${checked} graded tests run in Portuguese across phases 0-20, ${failed} now fail`)
process.exitCode = failed ? 1 : 0
