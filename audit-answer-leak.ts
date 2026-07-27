import { ALL_PHASES } from './src/data/phases'

/**
 * Finds exercise descriptions that hand over the answer instead of setting the task.
 * A description should say WHAT to achieve; the learner derives the code. When it
 * spells out "Line 4: total = monthly * months", there is nothing left to work out.
 */
const LEAKS: [string, RegExp][] = [
  ['line-by-line dictation', /\b(Line|Linha)\s*\d+\s*[:\-]/],
  ['assignment shown',      /\b[a-z_]{2,}\s*=\s*(input|float|int|str)\s*\(/],
  ['print statement shown', /print\s*\(\s*f?["']/],
  ['formula shown',         /\b[a-z_]{2,}\s*=\s*[a-z_]{2,}\s*[*+\-/]\s*[a-z_0-9.]{1,}/],
]

const MAX = Number(process.argv[2] ?? 27)
let total = 0
for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  for (const ex of phase.exercises) {
    const text = [ex.description?.en, ex.description?.pt].filter(Boolean).join(' ')
    const hits = LEAKS.filter(([, re]) => re.test(text)).map(([name]) => name)
    if (!hits.length) continue
    total++
    console.log(`p${String(phase.id).padStart(2)} ${ex.id.padEnd(22)} ${hits.join(', ')}`)
  }
}
console.log(`\n${total} exercise descriptions reveal the answer`)
