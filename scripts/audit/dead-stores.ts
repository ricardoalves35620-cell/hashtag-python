import { ALL_PHASES } from '../../src/data/phases'

/**
 * Finds a value that is computed and then immediately thrown away.
 *
 * Phase 27's capstone had this in three places:
 *
 *     total = sum(c["amount"] for c in db)
 *     total = sum(c["total"] for c in db)
 *     print(f"Orders:{len(db)} | Amount:${total:,} | Total:${total:,}")
 *
 * The gross sum is computed, discarded, and both labels print the net. The stated
 * example output said $23,300 and $22,550; the code printed $22,550 twice. A learner
 * doing exactly what the page told them to do — "run it as-is" — saw output that did
 * not match the page, and had no way to know which one was lying.
 *
 * The rule is deliberately narrow: two assignments to the same name on adjacent lines,
 * same indentation, where the second does not read the first. That is the exact shape
 * of the bug and essentially cannot fire on correct code. A broader "assigned twice
 * without an intervening read" rule flags every accumulator in every loop, and a
 * checker that cries wolf is a checker that gets switched off.
 */
export interface DeadStore { name: string, first: string, second: string }

const ASSIGN = /^(\s*)([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/
const CONTRAST = /\u2705|\u274c|\bfix\b|\bmistake\b|\bwrong\b|\bright\b|\bcorrect\b|\bbetter\b|\binstead\b|\bcerto\b|\berrado\b|\bem vez\b/i

export function findDeadStores(code: string): DeadStore[] {
  const lines = code.split('\n')
  const found: DeadStore[] = []

  for (let i = 0; i < lines.length - 1; i++) {
    const a = ASSIGN.exec(lines[i])
    if (!a) continue

    // Allow blank lines and comments between the two, nothing else — except a comment
    // that marks a deliberate before/after contrast. Phase 4 teaches int(input()) by
    // showing the broken line first and overwriting it under a "\u2705 FIX:" heading. That
    // rewrite is the lesson, not a bug.
    let j = i + 1
    let contrast = false
    while (j < lines.length && /^\s*(#.*)?$/.test(lines[j])) {
      if (CONTRAST.test(lines[j])) contrast = true
      j++
    }
    if (contrast) continue
    if (j >= lines.length) break

    const b = ASSIGN.exec(lines[j])
    if (!b) continue

    const [, indentA, nameA] = a
    const [, indentB, nameB, rhsB] = b
    if (nameA !== nameB || indentA !== indentB) continue

    // `total = total + x` reads the first value, so nothing was lost.
    //
    // String literals must come out first. The founding case is
    //     total = sum(c["amount"] for c in db)
    //     total = sum(c["total"] for c in db)
    // where the dictionary KEY "total" is not a read of the VARIABLE total. Testing the
    // raw right-hand side made this detector blind to the exact bug it was written for,
    // and the sweep printed a confident 0.
    const rhsCode = rhsB.replace(/"[^"]*"|'[^']*'/g, '')
    if (new RegExp(`\\b${nameA}\\b`).test(rhsCode)) continue

    found.push({ name: nameA, first: lines[i].trim(), second: lines[j].trim() })
  }
  return found
}

function codeStrings(): Array<{ where: string, code: string }> {
  const out: Array<{ where: string, code: string }> = []
  const push = (where: string, code: unknown) => {
    if (typeof code === 'string') out.push({ where, code })
    else if (code && typeof code === 'object') {
      for (const lang of ['en', 'pt'] as const) {
        const value = (code as Record<string, unknown>)[lang]
        if (typeof value === 'string') out.push({ where: `${where} [${lang}]`, code: value })
      }
    }
  }
  for (const phase of ALL_PHASES) {
    for (const [n, block] of (phase.lesson?.blocks || []).entries()) {
      if (block.type === 'code') push(`p${phase.id} lesson block ${n}`, block.code)
      if (block.type === 'checkpoint' && block.checkpoint) push(`p${phase.id} checkpoint ${n}`, block.checkpoint.code)
    }
    for (const ex of phase.exercises) {
      push(`p${phase.id} ${ex.id} starter`, ex.starterCode)
      // A behaviour reference is executed to PRODUCE the expected values. A dead
      // store in one silently corrupts every case derived from it, and no learner
      // ever sees the code to notice.
      if (ex.behaviour) push(`p${phase.id} ${ex.id} behaviour reference`, ex.behaviour.reference)
    }
    if (phase.exam?.starterCode) push(`p${phase.id} exam starter`, phase.exam.starterCode)
  }
  return out
}

const RUN_AS_SCRIPT = /dead-stores\.ts$/.test(process.argv[1] || '')
let flagged = 0

for (const { where, code } of RUN_AS_SCRIPT ? codeStrings() : []) {
  for (const store of findDeadStores(code)) {
    console.log(`${where}`)
    console.log(`   ${store.first}`)
    console.log(`   ${store.second}   <- overwrites "${store.name}" before it is read`)
    flagged++
  }
}
if (RUN_AS_SCRIPT) console.log(`\n${flagged} values computed and thrown away`)
if (RUN_AS_SCRIPT && flagged > 0) process.exitCode = 1
