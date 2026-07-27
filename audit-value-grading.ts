import { ALL_PHASES } from './src/data/phases'

/**
 * Finds tests that grade a VALUE the learner chose rather than the LOGIC they wrote.
 *
 * A test is safe when it supplies its own data — an afterCode that calls the function
 * with fixed arguments, or fixed stdin inputs. It is over-constrained when the whole
 * output comes from the learner's own script AND the expected text contains a value
 * the exercise never gave them. Then any other reasonable choice fails.
 */
const CONTENT = new Set(['equals', 'equals_any', 'contains', 'contains_any'])
const MAX = Number(process.argv[2] ?? 27)
let flagged = 0

for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  const items: { id: string; starter: string; tests: any[] }[] = []
  for (const ex of phase.exercises) {
    items.push({
      id: `exercise ${ex.id}`,
      starter: [
        typeof ex.starterCode === 'string' ? ex.starterCode : (ex.starterCode as any)?.en || '',
        ex.description?.en, ex.description?.pt, ex.objective?.en, ex.objective?.pt,
        ...(ex.hints || []).flatMap(h => [h.en, h.pt]),
      ].filter(Boolean).join(' '),
      tests: ex.grading?.tests || [],
    })
  }
  const exam: any = phase.exam
  if (exam) items.push({
    id: 'exam',
    starter: [
      String(exam.starterCode || ''), exam.scenario?.en, exam.scenario?.pt,
      ...(exam.requirements?.en || []), ...(exam.requirements?.pt || []),
    ].filter(Boolean).join(' '),
    tests: exam.testCases || [],
  })

  for (const item of items) {
    for (const test of item.tests) {
      const suppliesOwnData = Boolean(test.afterCode) || (test.inputs || []).length > 0
      if (suppliesOwnData) continue
      for (const check of (test.checks || [])) {
        if (!CONTENT.has(String(check.type))) continue
        const values = (Array.isArray(check.value) ? check.value : [check.value]).map(String)
        for (const value of values) {
          // tokens the learner would have had to invent, because the starter never shows them
          const tokens = value.match(/[A-Za-zÀ-ÿ]{3,}|\d+(?:\.\d+)?/g) || []
          const invented = tokens.filter(t => !item.starter.includes(t))
          if (invented.length && tokens.length && invented.length === tokens.length) {
            console.log(`p${phase.id} ${item.id} / ${test.id}: expects ${JSON.stringify(value.slice(0, 45))} — not given in the starter`)
            flagged++
          }
        }
      }
    }
  }
}
console.log(`\n${flagged} tests grade a value the learner was never given`)
