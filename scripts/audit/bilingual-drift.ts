import { ALL_PHASES } from '../../src/data/phases'

/**
 * Finds places where the English and Portuguese versions of the same text state
 * DIFFERENT facts.
 *
 * The language audit already checks which language a string is in. That is a different
 * property, and only this one protects the learner. Phase 27's task said the member
 * pays a "dano" — damage — where English said "amount", and phase 9's said the learner
 * generates a "dano" where English names a variable `repair_value`. Both are in the
 * right language. Both teach something the other language does not.
 *
 * Prose is not comparable across languages, so this compares only the parts that must
 * survive translation unchanged:
 *
 *   numbers        "12000" is 12000 in both languages
 *   identifiers    `repair_value` is a name in the program, not a word to translate
 *   calls          random.randint(...) is API syntax
 *
 * A number present in one language and absent in the other is a divergence no matter
 * how good the prose is. That is a narrow rule on purpose — the two texts legitimately
 * differ everywhere else, and a checker that says so is useless.
 */
export interface Drift { where: string, onlyEn: string[], onlyPt: string[] }

const NUMBER = /(?<![\w.])\d[\d.,]*(?![\w])/g
const IDENTIFIER = /\b[a-zA-Zà-úÀ-Ú][a-zA-Z0-9à-úÀ-Ú]*(?:_[a-zA-Z0-9à-úÀ-Ú]+)+\b/g
const CALL = /\b[A-Za-z_][\w.]*(?=\()/g

/**
 * Portuguese writes 5.230 where English writes 5,230, and 2,4 where English writes 2.4.
 * Comparing the strings flags every price in the curriculum. Comparing the digits alone
 * survives both conventions, at the cost of not distinguishing 2.4 from 24 — a trade
 * worth making, because the alternative is a checker nobody can read.
 */
function digitsOf(text: string): string[] {
  return [...text.matchAll(NUMBER)].map(match => match[0].replace(/[.,]/g, '')).filter(Boolean)
}

/**
 * Variable names ARE translated on purpose: an English learner sees `client_name` and a
 * Portuguese learner sees `nome_cliente`. So the names cannot be compared — but their
 * COUNT can. Phase 9 says "random.randint(500, 12000) generates the repair_value" in
 * English and "gera o dano" in Portuguese: one identifier became a plain noun, and the
 * Portuguese learner is never told there is a variable there at all.
 */
function identifierCount(text: string): number {
  return [...text.matchAll(IDENTIFIER)].length
}

/**
 * Calls need three different treatments, because only some of them are API.
 *
 *   json.dumps()      a stdlib module — identical in every language
 *   record.copy()     the RECEIVER is a translated variable (registro.copy()), the
 *                     method is API. Compare the method, ignore the receiver.
 *   validate_rows()   a function the curriculum defines and translates on purpose
 *                     (validar_linhas). Comparable by count, never by name.
 *   print(), len()    builtins, which are never translated
 */
const STDLIB = new Set(['random', 'json', 'datetime', 'math', 'os', 'sys', 're', 'csv', 'time',
  'collections', 'pathlib', 'statistics', 'itertools', 'string', 'decimal', 'sqlite3'])
const BUILTINS = new Set(['print', 'len', 'int', 'float', 'str', 'input', 'range', 'sum', 'min',
  'max', 'sorted', 'list', 'dict', 'set', 'tuple', 'abs', 'round', 'enumerate', 'zip', 'open',
  'type', 'isinstance', 'any', 'all', 'bool', 'map', 'filter', 'reversed', 'format'])

function apiCalls(text: string): string[] {
  const out: string[] = []
  for (const match of text.matchAll(CALL)) {
    const name = match[0]
    if (name.includes('.')) {
      const head = name.split('.')[0]
      out.push(STDLIB.has(head) ? name : name.split('.').pop()!)
    } else if (BUILTINS.has(name)) {
      out.push(name)
    }
  }
  return out
}

function counted(values: string[]): Map<string, number> {
  const out = new Map<string, number>()
  for (const value of values) out.set(value, (out.get(value) || 0) + 1)
  return out
}

function missing(left: string[], right: string[]): string[] {
  const other = counted(right)
  const out: string[] = []
  for (const value of left) {
    const seen = other.get(value) || 0
    if (seen === 0) out.push(value)
    else other.set(value, seen - 1)
  }
  return out
}

/**
 * Portuguese domain words that only make sense if the English says the same thing.
 *
 * The curriculum began as an insurance-claims theme. The English was later rewritten to
 * neutral wording — "amount", "order" — and the Portuguese was not: 70 places still said
 * "dano" (damage) where the English said "amount", and the variable on screen was
 * `amount`. A Portuguese learner was reading about damages while looking at code about
 * amounts, with nothing connecting the two.
 *
 * Comparing numbers, calls and identifier counts cannot see this: both sides are fluent,
 * well-formed, and about different things. Each entry says "this Portuguese word is only
 * correct when the English carries this meaning".
 */
const FALSE_FRIENDS: Array<{ pt: RegExp, en: RegExp, why: string }> = [
  { pt: /\bdanos?\b/i, en: /\bdamage/i, why: '"dano" is damage; the English says amount' },
  { pt: /\bsinistros?\b/i, en: /\bclaim/i, why: '"sinistro" is an insurance claim' },
  { pt: /\bap[óo]lices?\b/i, en: /\bpolic/i, why: '"apólice" is an insurance policy' },
  { pt: /\breembolsos?\b/i, en: /\brefund/i, why: '"reembolso" is a refund' },
  // "pagamento" is a payment. Eleven places used it where the English said REFUND —
  // a different transaction, and the one the exercise is about. Payroll, subscription
  // and advance payments are real payments, so the English side accepts those too.
  { pt: /\bpagamentos?\b/i, en: /\bpay(ment|ments|ing|roll)?\b|\bpaid\b|\bpays\b/i,
    why: '"pagamento" is a payment; check whether the English says refund' },
  { pt: /\breparos?\b/i, en: /\brepair/i, why: '"reparo" is a repair' },
]

export function findDrift(where: string, en: string, pt: string): Drift | null {
  const onlyEn = missing(digitsOf(en), digitsOf(pt))
  const onlyPt = missing(digitsOf(pt), digitsOf(en))

  for (const name of missing(apiCalls(en), apiCalls(pt))) onlyEn.push(`${name}()`)
  for (const name of missing(apiCalls(pt), apiCalls(en))) onlyPt.push(`${name}()`)

  for (const friend of FALSE_FRIENDS) {
    if (friend.pt.test(pt) && !friend.en.test(en)) onlyPt.push(friend.why)
  }

  const enNames = identifierCount(en), ptNames = identifierCount(pt)
  if (enNames !== ptNames) {
    const label = `${enNames} identifier(s) vs ${ptNames}`
    ;(enNames > ptNames ? onlyEn : onlyPt).push(label)
  }

  if (!onlyEn.length && !onlyPt.length) return null
  return { where, onlyEn, onlyPt }
}

function pairs(): Array<{ where: string, en: string, pt: string }> {
  const out: Array<{ where: string, en: string, pt: string }> = []
  const add = (where: string, value: unknown) => {
    const pair = value as { en?: string, pt?: string } | undefined
    if (pair?.en && pair?.pt) out.push({ where, en: pair.en, pt: pair.pt })
  }
  for (const phase of ALL_PHASES) {
    add(`p${phase.id} title`, phase.title)
    add(`p${phase.id} description`, phase.description)
    for (const [n, block] of (phase.lesson?.blocks || []).entries()) add(`p${phase.id} lesson block ${n}`, block.content)
    for (const ex of phase.exercises) {
      add(`p${phase.id} ${ex.id} description`, ex.description)
      add(`p${phase.id} ${ex.id} sampleOutput`, ex.sampleOutput)
      for (const [n, hint] of (ex.hints || []).entries()) add(`p${phase.id} ${ex.id} hint ${n}`, hint)
    }
    if (phase.exam) {
      add(`p${phase.id} exam scenario`, phase.exam.scenario)
      const requirements = phase.exam.requirements as { en?: string[], pt?: string[] } | undefined
      if (requirements?.en && requirements?.pt) {
        out.push({ where: `p${phase.id} exam requirements`, en: requirements.en.join(' '), pt: requirements.pt.join(' ') })
      }
    }
  }
  return out
}

/**
 * Divergences that are deliberate, each with the reason it cannot simply be fixed.
 *
 * An allowlist rots into a list of bugs nobody looks at, so this one is checked in both
 * directions: an entry that no longer drifts is reported as stale and must be deleted.
 * The list can only shrink by accident, never grow by it.
 */
const ACCEPTED = new Map<string, string>([
  ['p3 lesson block 3',
    'EN teaches the is_ prefix for booleans (is_approved); PT idiom drops it (aprovado). '
    + 'Renaming the PT one would teach a convention Portuguese code does not use.'],
  ['p3 exam requirements',
    'EN uses `discounted`, PT uses `com_desconto`. The exam grader accepts BOTH by name '
    + '(`"discounted" in dir() else com_desconto`), so renaming either breaks grading.'],
])

const RUN_AS_SCRIPT = /bilingual-drift\.ts$/.test(process.argv[1] || '')
let flagged = 0
const unusedExceptions = new Set(ACCEPTED.keys())

for (const { where, en, pt } of RUN_AS_SCRIPT ? pairs() : []) {
  const drift = findDrift(where, en, pt)
  if (!drift) continue
  if (ACCEPTED.has(where)) { unusedExceptions.delete(where); continue }
  console.log(where)
  if (drift.onlyEn.length) console.log(`   only in en : ${drift.onlyEn.join(', ')}`)
  if (drift.onlyPt.length) console.log(`   only in pt : ${drift.onlyPt.join(', ')}`)
  flagged++
}
if (RUN_AS_SCRIPT) {
  for (const stale of unusedExceptions) {
    console.log(`STALE EXCEPTION  ${stale} no longer drifts — delete it from ACCEPTED`)
    flagged++
  }
  console.log(`\n${flagged} texts state different facts in the two languages (${ACCEPTED.size} accepted)`)
}
if (RUN_AS_SCRIPT && flagged > 0) process.exitCode = 1
