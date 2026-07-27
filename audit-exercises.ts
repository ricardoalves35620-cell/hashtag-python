import { ALL_PHASES } from './src/data/phases'

// Mirrors learnerProfile.personalize() for the default (no profile) case.
const personalize = (t: string) => t
  .replace(/\{\{\s*folder\s*\}\}/g, 'ProjetosPython')
  .replace(/\{\{\s*file\s*\}\}/g, 'meu_primeiro.py')
  .replace(/,?\s*\{\{\s*name\s*\}\}/g, '')

// Faithful reimplementation of pyodide.ts checkText + learningValidation.outputSimilarity,
// so an exercise's own sample output can be tested against its own grading.
function normalizeAssessmentText(value: string, opts?: { caseSensitive?: boolean; compact?: boolean }) {
  let n = value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim()
  if (!opts?.caseSensitive) n = n.toLowerCase()
  n = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (opts?.compact) n = n.replace(/[^a-zA-Z0-9]+/g, '')
  return n
}
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
    case 'no_error': return true
    case 'line_count': return raw.split('\n').filter(Boolean).length === Number(check.value)
    default: return true
  }
}
const meaningful = (s: string) => s.replace(/\r/g, '').split('\n').map(l => l.trim().toLowerCase()).filter(Boolean)

const MAX = Number(process.argv[2] ?? 10)
let problems = 0
for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  const found: string[] = []
  for (const ex of phase.exercises) {
    const sample = ex.sampleOutput?.en ? personalize(ex.sampleOutput.en) : undefined
    const tests = ex.grading?.tests || []

    // (a) The VISIBLE contract: the first test with no inputs is what the learner is
    //     shown as the expected result. Its checks must accept the published sample.
    const visible = tests.find(t => !t.inputs || t.inputs.length === 0)
    if (sample && visible) {
      for (const c of (visible.checks || [])) {
        if (c.target && c.target !== 'test_output') continue
        if (!checkText(sample, c)) {
          found.push(`${ex.id}: published sample does not satisfy its own visible check -> ${c.type} ${JSON.stringify(c.value)}`)
        }
      }
    }

    // (b) Contradictions inside one test case: two exact checks demanding different text.
    for (const t of tests) {
      const exact = (t.checks || []).filter((c: any) => c.type === 'equals' || c.type === 'equals_any')
      if (exact.length > 1) {
        const sets = exact.map((c: any) => new Set((Array.isArray(c.value) ? c.value : [c.value]).map(String)))
        const intersect = [...sets[0]].filter(v => sets.every(s => s.has(v)))
        if (intersect.length === 0) {
          found.push(`${ex.id}/${t.id}: two exact checks that cannot both pass`)
        }
      }
    }

    // (c) A graded exercise with no published expected result.
    if (tests.length && !sample) found.push(`${ex.id}: graded but shows the learner no expected output`)
  }
  if (found.length) {
    problems += found.length
    console.log(`\nPHASE ${phase.id} — ${phase.title.en}`)
    for (const f of found) console.log('   ' + f)
  }
}
console.log(`\n${problems} blockers across phases 0-${MAX}`)
