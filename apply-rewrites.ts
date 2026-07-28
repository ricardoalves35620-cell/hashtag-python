/**
 * Applies rewritten descriptions produced by the GEMINI-PROMPT format.
 *
 *   npx tsx apply-rewrites.ts rewrites.txt          # check only, changes nothing
 *   npx tsx apply-rewrites.ts rewrites.txt --write  # apply
 *
 * Every id is verified against the real curriculum before anything is written,
 * so a batch that invents ids or drops exercises is rejected rather than applied.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { ALL_PHASES } from './src/data/phases'

const file = process.argv[2]
const write = process.argv.includes('--write')
if (!file) { console.error('usage: tsx apply-rewrites.ts <rewrites.txt> [--write]'); process.exit(1) }

const known = new Set(ALL_PHASES.flatMap(p => p.exercises.map(e => e.id)))
// The export labels an exam "EXAM (phase 4)". Accept that, and map it to the phase.
const examId = (id: string) => {
  const m = /^EXAM\s*\(phase\s*(\d+)\)$/i.exec(id.trim())
  return m ? Number(m[1]) : null
}
const examPhases = new Set(ALL_PHASES.filter(p => p.exam).map(p => p.id))
const raw = readFileSync(file, 'utf8')

const blocks = [...raw.matchAll(/===EXERCISE===\s*\nid:\s*(.+?)\s*\n---EN---\s*\n([\s\S]*?)\n---PT---\s*\n([\s\S]*?)\n===END===/g)]
if (!blocks.length) { console.error('No blocks found. Check the output used the ===EXERCISE=== format.'); process.exit(1) }

const problems: string[] = []
const ok: { id: string; en: string; pt: string }[] = []

for (const [, id, en, pt] of blocks) {
  const trimmedEn = en.trim(), trimmedPt = pt.trim()
  const phaseForExam = examId(id)
  if (phaseForExam !== null) {
    if (!examPhases.has(phaseForExam)) { problems.push(`${id}: phase ${phaseForExam} has no exam`); continue }
  } else if (!known.has(id)) {
    problems.push(`${id}: not a real exercise id`); continue
  }
  if (!trimmedEn || !trimmedPt) { problems.push(`${id}: one language is empty`); continue }
  // The app prints this text literally, so markdown would be shown to the learner.
  for (const [label, text] of [['EN', trimmedEn], ['PT', trimmedPt]] as const) {
    // '***' appears as a redacted value in some exercises, so require markdown bold
    // to actually wrap something before flagging it.
    if (/\*\*\S[^\n]*?\S\*\*|^#{1,6}\s|`/m.test(text)) problems.push(`${id} (${label}): contains markdown syntax`)
    if (/\b(Line|Linha)\s*\d+\s*[:\-]/.test(text)) problems.push(`${id} (${label}): dictates line by line`)
    if (/\b[a-z_]{2,}\s*=\s*(input|float|int|str)\s*\(/.test(text)) problems.push(`${id} (${label}): shows an assignment`)
    if (/print\s*\(\s*f?["']/.test(text)) problems.push(`${id} (${label}): shows a print statement`)
  }
  ok.push({ id, en: trimmedEn, pt: trimmedPt })
}

const seen = new Set(ok.map(o => o.id))
console.log(`${blocks.length} blocks parsed | ${ok.length} valid | ${problems.length} problems`)
for (const p of problems) console.log('  ✗', p)

if (!write) { console.log('\nDry run. Re-run with --write to apply.'); process.exit(problems.length ? 1 : 0) }
if (problems.length) { console.error('\nRefusing to write while problems remain.'); process.exit(1) }

const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
const dir = 'src/data/phases'
let applied = 0

/** v11 phase files pass the description as the second b(en, pt) after the id. */
function replaceHelperDescription(text: string, id: string, en: string, pt: string): string | null {
  let at = text.indexOf(`'${id}',`)
  if (at < 0) at = text.indexOf(`"${id}",`)
  if (at < 0) return null
  // Some phase files quote with ', others with " — accept either.
  const bCall = /b\(\s*(['"])((?:(?!\1)[^\\]|\\.)*)\1\s*,\s*(['"])((?:(?!\3)[^\\]|\\.)*)\3\s*\)/g
  bCall.lastIndex = at
  const title = bCall.exec(text)
  if (!title || title.index - at > 400) return null
  const desc = bCall.exec(text)
  if (!desc || desc.index - title.index > 600) return null
  return text.slice(0, desc.index) + `b('${esc(en)}', '${esc(pt)}')` + text.slice(desc.index + desc[0].length)
}

/** Some files write `description: b('en', 'pt')` instead of an object literal. */
function replaceDescriptionCall(text: string, id: string, en: string, pt: string): string | null {
  const at = text.indexOf(`id: '${id}'`)
  if (at < 0) return null
  const call = /description:\s*b\(\s*(['"])((?:(?!\1)[^\\]|\\.)*)\1\s*,\s*(['"])((?:(?!\3)[^\\]|\\.)*)\3\s*\)/g
  call.lastIndex = at
  const m = call.exec(text)
  if (!m || m.index - at > 700) return null
  return text.slice(0, m.index) + `description: b('${esc(en)}', '${esc(pt)}')` + text.slice(m.index + m[0].length)
}

function splitExam(text: string) {
  const lines = text.split('\n').map(l => l.trim())
  const goal = lines.find(Boolean) || ''
  const requirements = lines
    .filter(l => /^[-•]/.test(l))
    .map(l => l.replace(/^[-•]\s*/, ''))
  return { goal, requirements }
}

for (const name of readdirSync(dir).filter(f => f.endsWith('.ts'))) {
  const path = `${dir}/${name}`
  let text = readFileSync(path, 'utf8')
  let touched = false
  for (const entry of ok) {
    const phaseForExam = examId(entry.id)
    if (phaseForExam !== null) {
      const en = splitExam(entry.en), pt = splitExam(entry.pt)
      const marker = new RegExp(`export const phase${phaseForExam}: Phase = \\{`)
      const start = text.search(marker)
      if (start < 0) continue
      const examAt = text.indexOf('exam: {', start)
      if (examAt < 0) continue
      const scen = /scenario: \{\s*en: '((?:[^'\\]|\\.)*)',\s*pt: '((?:[^'\\]|\\.)*)',?\s*\}/s.exec(text.slice(examAt))
      if (!scen) continue
      const at2 = examAt + scen.index
      text = text.slice(0, at2) + `scenario: { en: '${esc(en.goal)}', pt: '${esc(pt.goal)}' }` + text.slice(at2 + scen[0].length)
      const req = /requirements: \{\s*en: \[[^\]]*\],\s*pt: \[[^\]]*\],?\s*\}/s.exec(text.slice(examAt))
      if (req && en.requirements.length && pt.requirements.length) {
        const list = (items: string[]) => items.map(i => `'${esc(i)}'`).join(', ')
        const at3 = examAt + req.index
        text = text.slice(0, at3) + `requirements: { en: [${list(en.requirements)}], pt: [${list(pt.requirements)}] }` + text.slice(at3 + req[0].length)
      }
      touched = true; applied++; seen.delete(entry.id)
      continue
    }
    const at = text.indexOf(`id: '${entry.id}'`)
    if (at < 0) {
      const viaHelper = replaceHelperDescription(text, entry.id, entry.en, entry.pt)
      if (viaHelper) { text = viaHelper; touched = true; applied++; seen.delete(entry.id) }
      continue
    }
    {
      const viaCall = replaceDescriptionCall(text, entry.id, entry.en, entry.pt)
      if (viaCall) { text = viaCall; touched = true; applied++; seen.delete(entry.id); continue }
    }
    const from = text.indexOf('description: {', at)
    if (from < 0 || from - at > 900) continue
    const m = /description: \{\s*en: '((?:[^'\\]|\\.)*)',\s*pt: '((?:[^'\\]|\\.)*)',?\s*\}/s.exec(text.slice(from))
    if (!m || m.index !== 0) continue
    const replacement = `description: {\n        en: '${esc(entry.en)}',\n        pt: '${esc(entry.pt)}'\n      }`
    text = text.slice(0, from) + replacement + text.slice(from + m[0].length)
    touched = true
    applied++
    seen.delete(entry.id)
  }
  if (touched) writeFileSync(path, text, 'utf8')
}

console.log(`applied ${applied} descriptions`)
if (seen.size) console.log('not found in any file:', [...seen].join(', '))
