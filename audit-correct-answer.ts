import { ALL_PHASES } from './src/data/phases'

/**
 * The audit that matters: would a CORRECT answer pass?
 *
 * Every grading bug found by hand had the same shape — a learner produced the right
 * result and the app said no. Structural audits miss those, because the exercise is
 * internally consistent; it is the grading CHAIN that rejects a good answer.
 *
 * So this replays the chain. The published sample output is what a correct solution
 * prints, so it is fed through every layer the real grader applies: each authored
 * check, and the expected-output similarity test. For exercises that read input(),
 * the prompts are prepended first, because that is what the console really contains.
 */

// ── mirrors of the real comparison logic ────────────────────────────────────
/** Mirrors learnerProfile.personalize() for a learner who has set nothing. */
const personalize = (t: string) => t
  .replace(/\{\{\s*folder\s*\}\}/g, 'ProjetosPython')
  .replace(/\{\{\s*file\s*\}\}/g, 'meu_primeiro.py')
  .replace(/,?\s*\{\{\s*name\s*\}\}/g, '')
function normalizeAssessmentText(value: string, opts?: { caseSensitive?: boolean; compact?: boolean }) {
  let n = value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim()
  if (!opts?.caseSensitive) n = n.toLowerCase()
  n = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (opts?.compact) n = n.replace(/[^a-zA-Z0-9]+/g, '')
  return n
}
const norm = (v: string) => normalizeAssessmentText(v.replace(/['"]/g, ''))
const lines = (v: string) => v.split('\n').map(l => norm(l)).filter(l => l && !l.includes('...') && !l.includes('…'))

function checkText(raw: string, check: any): boolean {
  const cs = !!check.caseSensitive
  const compact = check.textMode === 'compact'
  const candidate = normalizeAssessmentText(raw, { caseSensitive: cs, compact })
  const values = (Array.isArray(check.value) ? check.value : [check.value])
    .map((v: any) => normalizeAssessmentText(String(v), { caseSensitive: cs, compact }))
  switch (check.type) {
    case 'equals': return candidate === values[0]
    case 'equals_any': return values.includes(candidate)
    case 'contains': return candidate.includes(values[0])
    case 'contains_any': return values.some((v: string) => candidate.includes(v))
    case 'not_contains': return !candidate.includes(values[0])
    case 'matches': try { return new RegExp(String(check.value), cs ? '' : 'i').test(raw) } catch { return false }
    case 'numeric_equals': return Math.abs(parseFloat(candidate) - parseFloat(values[0])) < 1e-9
    case 'line_count': return raw.split('\n').filter(Boolean).length === Number(check.value)
    case 'no_error': return true
    default: return true
  }
}

function similarityPasses(sample: string, actual: string): boolean {
  const out = norm(actual)
  const expected = (sample || '').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean)
  if (!expected.length) return true
  const matched = expected.filter(rawLine => {
    const line = norm(rawLine)
    if (!line) return true
    if (!line.includes('{{')) return out.includes(line)
    const pattern = line.split(/\{\{[^}]*\}\}/)
      .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, m => '\\' + m)).join('.+')
    try { return new RegExp(pattern, 'i').test(out) } catch { return out.includes(line) }
  }).length
  const threshold = expected.length <= 2 ? 1 : 0.75
  return matched / expected.length >= threshold
}

/** What the console really holds: input() echoes "prompt value" for each answer. */
function simulateConsole(exercise: any, sample: string): string {
  const starter = String(exercise.starterCode || '')
  const prompts = [...starter.matchAll(/input\s*\(\s*["']([^"']*)["']/g)].map(m => m[1])
  const supplied: string[] = (exercise as any).suggestedInputs || []
  if (!prompts.length) return sample
  const echoed = prompts.map((p, i) => `${p}${supplied[i] ?? ''}`).join('\n')
  return `${echoed}\n${sample}`
}

const MAX = Number(process.argv[2] ?? 27)
let broken = 0

for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  for (const ex of phase.exercises) {
    const sample = ex.sampleOutput?.en ? personalize(ex.sampleOutput.en) : undefined
    if (!sample) continue
    const console_ = simulateConsole(ex, sample)

    for (const test of (ex.grading?.tests || [])) {
      // Hidden tests deliberately use OTHER inputs and expect another result, so the
      // visible sample says nothing about them. Only the visible contract is comparable.
      if ((test as any).hidden || /hidden/i.test(String(test.id))) continue
      if ((test as any).afterCode || (test.inputs || []).length > 0) continue
      for (const check of (test.checks || [])) {
        if (check.target && check.target !== 'test_output') continue
        if (!checkText(console_, check)) {
          console.log(`p${phase.id} ${ex.id} / ${test.id}: a correct answer FAILS ${check.type} ${JSON.stringify(String(check.value).slice(0, 45))}`)
          broken++
        }
      }
    }
    if (!similarityPasses(sample, console_)) {
      console.log(`p${phase.id} ${ex.id}: a correct answer FAILS the expected-output check`)
      broken++
    }
  }
}
console.log(`\n${broken} places where a correct answer would be rejected`)
