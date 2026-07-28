import { ALL_PHASES } from './src/data/phases'

/**
 * Checks that a rewritten description still asks for the SAME program.
 *
 * A rewrite can be well-formed, use a real id, leak no answer — and still quietly
 * change the task: a different function name, an example that no longer matches the
 * expected output, or an instruction to read input from an exercise that reads none.
 * Those are the failures a format check cannot see, so they are checked here against
 * things that cannot drift: the starter code, the code requirements and the sample.
 */

const MAX = Number(process.argv[2] ?? 68)
type Finding = { id: string; phase: number; kind: string; detail: string }
const findings: Finding[] = []

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  for (const ex of phase.exercises) {
    const en = ex.description?.en || ''
    const pt = ex.description?.pt || ''
    const starter = typeof ex.starterCode === 'string' ? ex.starterCode : (ex.starterCode as any)?.en || ''
    const add = (kind: string, detail: string) => findings.push({ id: ex.id, phase: phase.id, kind, detail })

    if (!en.trim() || !pt.trim()) { add('empty', 'one language is missing'); continue }

    // 1. The function the grader requires must be the function the task names.
    const required = [
      ...((ex.grading?.codeRequirements || []) as any[]),
      ...((ex.grading?.tests || []).flatMap((t: any) => t.codeRequirements || []) as any[]),
    ].filter(r => r.kind === 'function').map(r => String(r.value))
    for (const fn of new Set(required)) {
      if (!en.includes(fn)) add('function-missing', `grader requires ${fn}(), description never names it`)
      else if (!pt.includes(fn)) add('function-missing-pt', `PT description never names ${fn}()`)
    }

    // 2. A function defined in the starter should not be renamed by the description.
    const defined = [...starter.matchAll(/def\s+([a-z_][a-z0-9_]*)\s*\(/gi)].map(m => m[1])
    for (const fn of new Set(defined)) {
      if (required.includes(fn)) continue
      const other = [...en.matchAll(/\b([a-z_][a-z0-9_]{3,})\s*\(/g)].map(m => m[1])
        .filter(n => !defined.includes(n) && !['input', 'print', 'int', 'float', 'str', 'len', 'range', 'sum', 'round'].includes(n))
      if (other.length && !en.includes(fn)) add('function-renamed', `starter defines ${fn}(), description names ${other[0]}()`)
    }

    // 3. An example shown in the description must match the sample output.
    const example = en.split(/example[^\n]*:\s*\n/i)[1]
    if (example && ex.sampleOutput?.en) {
      const shown = example.split('\n').map(l => l.trim()).filter(Boolean)
      const sample = norm(ex.sampleOutput.en)
      const missing = shown.filter(l => !sample.includes(norm(l)))
      if (missing.length === shown.length && shown.length) {
        add('example-mismatch', `example lines appear nowhere in sampleOutput: ${JSON.stringify(missing[0].slice(0, 40))}`)
      }
    }

    // 4. Input: promised but never read, or read but never mentioned.
    const readsInput = /input\s*\(/.test(starter) || ((ex as any).suggestedInputs || []).length > 0
    const promisesInput = /\b(ask for|gather input|prompt the user|read .* from (the )?user|receber os dados|solicite|pergunte)\b/i.test(en + ' ' + pt)
    if (promisesInput && !readsInput && !/_zero$/.test(ex.id)) {
      add('input-added', 'description asks for input, exercise reads none')
    }
    if (readsInput && !promisesInput) {
      add('input-dropped', 'exercise reads input, description never mentions asking')
    }
  }
}

const byKind = new Map<string, Finding[]>()
for (const f of findings) byKind.set(f.kind, [...(byKind.get(f.kind) || []), f])
for (const [kind, list] of [...byKind].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n## ${kind} — ${list.length}`)
  for (const f of list.slice(0, 12)) console.log(`  p${f.phase} ${f.id}: ${f.detail}`)
  if (list.length > 12) console.log(`  … and ${list.length - 12} more`)
}
console.log(`\n${findings.length} possible task drifts across ${ALL_PHASES.filter(p => p.id <= MAX).length} phases`)
