import { ALL_PHASES } from './src/data/phases'

// Words that would tell a learner a structure is expected, in either language.
const HINTS: Record<string, RegExp> = {
  BinOp: /calcul|soma|sum|arithmetic|conta|\+|operator|operador/i,
  Assign: /variable|variável|variavel|store|guard|atribu/i,
  If: /\bif\b|condi|decis/i,
  While: /\bwhile\b|loop|repeat|repet/i,
  For: /\bfor\b|loop|percorr|iterat|each|cada/i,
  List: /\blist\b|lista/i,
  Dict: /dictionar|dicion/i,
  ListComp: /comprehension|compreens/i,
  FunctionDef: /\bdef\b|function|função|funcao/i,
  Return: /\breturn\b|retorn/i,
  Try: /try|except|error|erro/i,
  With: /\bwith\b|open|arquivo|file/i,
  Compare: /compar|>|<|==|maior|menor/i,
}

type Item = { id: string; text: string; reqs: { kind: string; value: string }[] }
let flagged = 0
for (const phase of ALL_PHASES.filter(p => p.id <= 27).sort((a, b) => a.id - b.id)) {
  const items: Item[] = []
  for (const ex of phase.exercises) {
    items.push({
      id: `exercise ${ex.id}`,
      text: [ex.description?.en, ex.description?.pt, ex.objective?.en, ex.objective?.pt,
             ...(ex.hints || []).flatMap(h => [h.en, h.pt]),
             ...(ex.successCriteria?.en || []), ...(ex.successCriteria?.pt || []),
             typeof ex.starterCode === 'string' ? ex.starterCode : (ex.starterCode as any)?.en].filter(Boolean).join(' '),
      reqs: (ex.grading?.codeRequirements || []) as any,
    })
  }
  if (phase.exam) {
    const exam: any = phase.exam
    items.push({
      id: 'exam',
      text: [exam.description?.en, exam.description?.pt, exam.instructions?.en, exam.instructions?.pt,
             ...(exam.testCases || []).flatMap((t: any) => [t.description?.en, t.description?.pt]),
             typeof exam.starterCode === 'string' ? exam.starterCode : exam.starterCode?.en].filter(Boolean).join(' '),
      reqs: [...(exam.codeRequirements || []), ...((exam.testCases || []).flatMap((t: any) => t.codeRequirements || []))],
    })
  }
  for (const item of items) {
    for (const r of item.reqs) {
      if (r.kind !== 'node') continue
      // Only structures a learner could sidestep while still producing right-looking
      // output. Return/FunctionDef/Assign are implied by the task and cannot be faked.
      if (!['BinOp', 'If', 'For', 'While', 'Try', 'ListComp'].includes(r.value)) continue
      const probe = HINTS[r.value]
      if (!probe) continue
      if (!probe.test(item.text)) {
        console.log(`p${phase.id} ${item.id}: requires ${r.value} but nothing visible mentions it`)
        flagged++
      }
    }
  }
}
console.log(`\n${flagged} exercises/exams demand a structure the learner is never told about`)
