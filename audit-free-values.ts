import { ALL_PHASES } from './src/data/phases'

/**
 * Finds exercises that invite the learner to choose a value ("any name", "qualquer
 * número", "your own") and then grade against one specific choice. Those exercises
 * fail correct work. The fix is to mark the varying part of sampleOutput with a
 * {{placeholder}}, which turns it into a wildcard in every grading layer.
 */
const INVITES = /\b(any |qualquer |seu |sua |your own|de sua escolha|à sua escolha|escolha )/i
const EXACT = new Set(['equals', 'equals_any'])

const MAX = Number(process.argv[2] ?? 27)
let flagged = 0

for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  for (const ex of phase.exercises) {
    const visible = [
      ex.description?.en, ex.description?.pt,
      ...(ex.hints || []).flatMap(h => [h.en, h.pt]),
      typeof ex.starterCode === 'string' ? ex.starterCode : (ex.starterCode as any)?.en,
    ].filter(Boolean).join(' ')

    if (!INVITES.test(visible)) continue

    const exactChecks = (ex.grading?.tests || []).flatMap(t =>
      (t.checks || []).filter(c => EXACT.has(String(c.type))))
    if (exactChecks.length === 0) continue

    const sample = ex.sampleOutput?.en || ''
    if (sample.includes('{{')) continue   // already marked as varying

    const sentence = visible.split(/(?<=[.!?\n])/).find(part => INVITES.test(part)) || ''
    console.log(`p${phase.id} ${ex.id}`)
    console.log(`   invite : ${sentence.trim().slice(0, 110)}`)
    console.log(`   grades : ${JSON.stringify(String(exactChecks[0].value).slice(0, 60))}`)
    flagged++
  }
}
console.log(`\n${flagged} exercises invite a free value and then require one specific answer`)
