import { ALL_PHASES } from '../../src/data/phases'
import { resolveLocalizedCode } from '../../src/lib/localization'

/**
 * Finds learner-facing prose that is shown to BOTH languages, and is therefore wrong
 * for one of them.
 *
 * The rule this enforces needs no language detection, which is what makes it reliable:
 * a code asset stored as a plain string is rendered identically in EN and PT. So any
 * natural-language prose inside it — a `#` comment, a printed string — is by definition
 * untranslated for one audience. Either it is bilingual, or it contains no prose.
 *
 * That is exactly what a Portuguese learner hits in phase 8: they run the exercise and
 * the console answers "Queue size: 3 / Processing: Alice / Queue complete!". The code is
 * correct. The language is not theirs.
 *
 * Deliberately NOT flagged, because they are the same in every language:
 *   keywords and builtins        for, in, print, len, range
 *   identifiers                  queue, total, client_name
 *   API and module names         json.dumps, datetime, .strip()
 *
 *   npm run audit:language
 */

export interface Leak { where: string, kind: 'comment' | 'output', text: string }

/** Words that are spelled the same in both languages, so their presence proves nothing. */
const NEUTRAL = /^[\s\d\W]*$|^(python|ok|status|total|import|def|print|input|json|csv|api|id|url|cpu|ram|gpu|ssd|sku|http|utf|true|false|none|error|debug)[\s\W]*$/i

/** A Portuguese marker: accents, or a word that only exists in Portuguese. */
const PORTUGUESE = /[áàâãéêíóôõúüç]|\b(voc[êe]|para|com|uma?|dos?|das?|não|são|est[áa]|ser[áa]|cada|pelo|pela|seus?|suas?|mais|nome|valor|lista|fila|total de|preço|quantidade|arquivo|linha|erro|nota|aluno|pedido|cliente|entrada|sa[íi]da|resultado|c[óo]digo|que|mesm[oa]|forma|curta|enquanto|preencha|tem|anos?|quando|ent[ãa]o|isso|apenas|sempre|nunca|tamb[ée]m|aqui|agora|depois|antes|sobre|entre|muito|pode|deve|veja|exemplo|primeiro|[úu]ltimo|ainda|quebra|retorna|imprime|mostra|guarda|escolhe|verifica|cria)\b/i

/**
 * An English marker: a word that does not occur in ordinary Portuguese.
 *
 * Deliberately excludes homographs — `do`, `no`, `a`, `e`, `os`, `use`, `real`, `total`,
 * `normal`, `local`, `final` all mean something in Portuguese too, and every one of them
 * would turn a Portuguese sentence into a reported leak.
 *
 * `complete` and `data` were in this list and had to come out. "🟡 Complete — entenda
 * sombreamento" and "Interprete a data inicial" are both Portuguese: `complete` is the
 * imperative of *completar* and `data` is the word for *date*. Six findings in phases
 * 16-20 were this, and acting on them would have replaced correct Portuguese with
 * different correct Portuguese for no reason.
 */
const ENGLISH = /\b(the|and|for each|with|from|your|you|this|that|size|processing|queue|price|amount|name|list|file|line|row|value|score|total revenue|report|coffee|songs|sold|left|order|cups|member|client|full|pay|saves|next|year|phone|age|years|keeps|files|temporary|working|executes|instructions|graphics|storage|highly|recommended|watching|average|enjoy|movie|sorry|young|film|flagged|investigation|passed|fraud|check|restock|needed|big|stock|start|system|new|long|to|of|are|was|were|been|being|has|have|had|will|would|should|must|each|every|only|still|then|than|into|without|when|what|which|who|how|why|there|they|them|their|its|both|other|another|same|whole|empty|missing|wrong|useless|reader|downloaded|disconnected|network|model|index|goes|going|comes|works|worked|does|did|makes|made|gets|adds|needs|wants|calls|called|takes|gives|finds|knows|thinks|looks|fails|stops|changes|counts|runs|running|reads|writes|shows|keeps|used|uses)\b/i

function comments(code: string): string[] {
  return code.split('\n')
    .map(line => {
      const at = line.indexOf('#')
      if (at === -1) return ''
      // A '#' inside a string literal is not a comment.
      const before = line.slice(0, at)
      const quotes = (before.match(/"/g) || []).length + (before.match(/'/g) || []).length
      return quotes % 2 === 1 ? '' : line.slice(at + 1).trim()
    })
    .filter(Boolean)
}

/**
 * Only PROSE counts. A quoted string in Python is usually not something a learner reads:
 *
 *   product["price"]              a dictionary key — translating it breaks the program
 *   open("data.txt")              a filename
 *   raise ValueError("negative price")
 *                                 a contract value. The task tells the learner to raise
 *                                 exactly that text, and the grader pins it, so it is an
 *                                 identifier that happens to be spelled in English.
 *
 * Requiring more than one word removes the keys and filenames; the context checks remove
 * the rest. Proposing any of them for translation would have broken working exercises.
 */
const KEY_CONTEXT = /\[\s*$|\.get\(\s*$|\braise\s+\w*Error\(\s*$|\bin\s+$/
const FILENAME = /^[\w./-]+\.\w{1,5}$/

function literals(code: string): string[] {
  const found: string[] = []
  for (const match of code.matchAll(/"([^"\n]{3,})"|'([^'\n]{3,})'/g)) {
    const text = (match[1] ?? match[2]).trim()
    if (!text || !text.includes(' ')) continue          // one word: a key, not a sentence
    if (FILENAME.test(text)) continue
    const before = code.slice(0, match.index ?? 0)
    const line = before.slice(before.lastIndexOf('\n') + 1)
    if (KEY_CONTEXT.test(line)) continue
    found.push(text)
  }
  return found
}

function prose(text: string): boolean {
  if (NEUTRAL.test(text)) return false
  if (!/[a-z]{3}/i.test(text)) return false
  return true
}

/**
 * Everything inside `{...}` is the learner's own code, not prose.
 *
 * `f"{name}, {age} anos, {height}m"` is Portuguese. It was reported as an English leak
 * because `name`, `age` and `height` are English words — but they are f-string FIELD
 * NAMES, bound to variables in the surrounding program. "Translating" them renames the
 * learner's variables and breaks the exercise. Same for the dictionary keys in
 * `f"#{c['id']} {c['client']}"`.
 *
 * Python keywords are deliberately NOT stripped. An earlier version removed them, and it
 * silenced two real leaks — "Reject empty paths and non-positive context sizes." and
 * "Rank by token overlap, preserve source IDs and refuse without evidence." — because the
 * only English marker either one carried was the word "and". `and`, `or`, `not`, `in`,
 * `for`, `while` are Python keywords *and* ordinary English function words, and the
 * second reading is the one that matters here. Portuguese strings that contain them are
 * protected by their Portuguese markers instead: `# preencha: >, and, <` is silent
 * because of "preencha", not because of "and".
 *
 * This is a narrowing, so it is pinned in both directions by language-isolation.test.ts:
 * the strings below must stay silent, and the leaks a learner actually reported from the
 * running app must still fire.
 */
function proseOnly(text: string): string {
  return text
    .replace(/\{[^{}]*\}/g, ' ')   // f-string fields: identifiers and expressions
    .replace(/%[-+ #0]*\d*(?:\.\d+)?[sdifgex]/gi, ' ')  // %-format specs
}

/** Prose that reads as English and carries no Portuguese marker. */
export function isEnglishProse(text: string): boolean {
  if (!prose(text)) return false
  if (PORTUGUESE.test(text)) return false
  // The Portuguese check reads the WHOLE string — an accent inside a placeholder still
  // proves the author wrote Portuguese — but the English check reads only the prose.
  const readable = proseOnly(text)
  if (!prose(readable)) return false
  return ENGLISH.test(readable)
}

export function leaksIn(where: string, code: string): Leak[] {
  const found: Leak[] = []
  for (const comment of comments(code)) {
    if (isEnglishProse(comment)) found.push({ where, kind: 'comment', text: comment })
  }
  for (const literal of literals(code)) {
    if (isEnglishProse(literal)) found.push({ where, kind: 'output', text: literal })
  }
  return found
}

/** Code assets rendered identically to both audiences. A bilingual one is fine. */
function sharedCode(): Array<{ where: string, code: string }> {
  const out: Array<{ where: string, code: string }> = []
  // Measure what the LEARNER sees, not what the data holds. localizePythonComments
  // already translates a large dictionary of comments at render time, so auditing the
  // raw string counts strings that are in fact translated — the same mistake as reading
  // the spec instead of opening the app.
  const push = (where: string, value: unknown) => {
    if (typeof value === 'string') out.push({ where, code: resolveLocalizedCode(value, 'pt') })
  }
  for (const phase of ALL_PHASES) {
    for (const [n, block] of (phase.lesson?.blocks || []).entries()) {
      if (block.type === 'code') push(`p${phase.id} lesson block ${n}`, block.code)
      if (block.type === 'checkpoint' && block.checkpoint) push(`p${phase.id} checkpoint ${n}`, block.checkpoint.code)
    }
    for (const ex of phase.exercises) push(`p${phase.id} ${ex.id} starter`, ex.starterCode)
    if (phase.exam?.starterCode) push(`p${phase.id} exam starter`, phase.exam.starterCode)
  }
  return out
}

const RUN_AS_SCRIPT = /language-isolation\.ts$/.test(process.argv[1] || '')

if (RUN_AS_SCRIPT) {
  const assets = sharedCode()
  const leaks = assets.flatMap(asset => leaksIn(asset.where, asset.code))
  const byAsset = new Map<string, Leak[]>()
  for (const leak of leaks) {
    if (!byAsset.has(leak.where)) byAsset.set(leak.where, [])
    byAsset.get(leak.where)!.push(leak)
  }

  for (const [where, items] of byAsset) {
    console.log(where)
    for (const item of items.slice(0, 4)) console.log(`   ${item.kind.padEnd(7)} ${JSON.stringify(item.text.slice(0, 78))}`)
    if (items.length > 4) console.log(`   ... and ${items.length - 4} more`)
  }

  console.log(`\n${byAsset.size} of ${assets.length} shared code assets show English prose to a Portuguese learner`)
  console.log(`${leaks.length} individual strings`)
}
