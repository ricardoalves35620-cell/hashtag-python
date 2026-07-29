import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolveLocalizedCode } from '../../src/lib/localization'

/**
 * Emits the Portuguese form of every reference solution.
 *
 * `described-output.py` compares what a task PROMISES against what the program PRINTS, and
 * for a fill-in-the-blank exercise the starter cannot be run — it still has `___` in it.
 * The reference solution can. But the reference is stored in English, and the learner's
 * console speaks Portuguese, so the comparison needs both forms of the same program.
 *
 * That gap is not cosmetic: phases 7 and 8 promised "Order 1: 45 cups left" to a learner
 * whose code prints "Pedido 1: 45 copos restantes", and it survived every check because
 * the only runnable version of the exercise was in one language.
 *
 *   python3 scripts/audit/dump-references.py && tsx scripts/audit/localize-references.ts
 */

const SOURCE = process.env.HP_REFERENCES || '/tmp/references.json'
const DESTINATION = process.env.HP_REFERENCES_PT || '/tmp/references.pt.json'

if (!existsSync(SOURCE)) {
  console.error(`no reference solutions at ${SOURCE} — run: python3 scripts/audit/dump-references.py`)
  process.exit(1)
}

const references: Record<string, string> = JSON.parse(readFileSync(SOURCE, 'utf8'))
const localized = Object.fromEntries(
  Object.entries(references).map(([id, code]) => [id, resolveLocalizedCode(code, 'pt')]),
)

writeFileSync(DESTINATION, JSON.stringify(localized, null, 1))
const changed = Object.keys(references).filter(id => references[id] !== localized[id]).length
console.log(`${Object.keys(localized).length} references -> ${DESTINATION} (${changed} differ from the English)`)
