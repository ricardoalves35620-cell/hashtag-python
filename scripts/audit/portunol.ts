import { ALL_PHASES } from '../../src/data/phases'
import { resolveLocalizedCode } from '../../src/lib/localization'
import { isEnglishProse } from './language-isolation'

/**
 * Finds comments that come out as neither language.
 *
 * `audit:language` reported zero for phases 0-20 while a learner was reading
 *
 *     # Construa the laço:
 *     # the usuário types 30
 *     # Client profile com calculations.
 *
 * and it was right to, by its own rule: those lines carry Portuguese markers, so they are
 * not "English shown to a Portuguese learner". They are worse. A learner who knows no
 * English can decode a fully English sentence with a dictionary; a sentence in no language
 * teaches them that the app is broken.
 *
 * They come from the word-level fallback in `translateCommentToPt`. When a comment has no
 * exact entry, a list of phrase rules rewrites the words it recognises and leaves the rest
 * standing. That fallback is useful — it is the difference between a partly translated
 * course and an English one — but every line it touches is a line an author still owes an
 * exact translation, and nothing was counting them.
 *
 * A comment is flagged when it carries markers of BOTH languages. That is deliberately
 * narrow: it cannot catch a bad translation, only a half-finished one.
 *
 *   npm run audit:portunol
 */

const PORTUGUESE_MARKER = /[áàâãéêíóôõúüç]|\b(voc[êe]|para|com|uma?|n[ãa]o|s[ãa]o|est[áa]|cada|nunca|sempre|apenas|ent[ãa]o|enquanto|preencha|mostra|imprime|retorna|guarda|cria|verifica|escolhe|quebra|mesm[oa]|forma|depois|antes|entre|sobre|muito|pode|deve|veja|exemplo|primeiro|[úu]ltimo|ainda|tem|anos?|isso|aqui|agora|quando|tamb[ée]m|usu[áa]rio|c[óo]digo|la[çc]o|n[úu]mero|texto|correto)\b/i

export interface Mixed { where: string, text: string }

/**
 * Words that are code, not prose, however English they look.
 *
 * `# preencha: >, and, <` names a Python operator. `# preencha: continue enquanto
 * stock >= 15` names a keyword and the learner's own variable. Both were reported as
 * half-translated, and "fixing" either one means editing a comment that is already
 * correct — or worse, renaming a variable the exercise depends on.
 *
 * Keywords are a fixed list. Identifiers are read from the surrounding code, which is why
 * this takes the whole asset rather than a line: `stock` is neutral in the exercise that
 * declares it and English prose anywhere else.
 */
const PY_KEYWORD = /\b(and|or|not|if|elif|else|for|while|in|is|def|return|continue|break|pass|class|try|except|finally|raise|with|as|from|import|lambda|global|None|True|False|print|input|len|range|str|int|float|list|dict|set|tuple|sum|min|max|sorted|round|open|type|append|self|None)\b/gi

function identifiers(code: string): Set<string> {
  const names = new Set<string>()
  for (const line of code.split('\n')) {
    const at = line.indexOf('#')
    const source = at < 0 ? line : line.slice(0, at)
    for (const match of source.matchAll(/[A-Za-z_][A-Za-z_0-9]*/g)) names.add(match[0].toLowerCase())
  }
  return names
}

export function isHalfTranslated(text: string, neutral: Set<string> = new Set()): boolean {
  if (text.trim().length < 12) return false
  if (!PORTUGUESE_MARKER.test(text)) return false
  // Remove what is already Portuguese; whatever English survives is the unfinished part.
  const english = text
    .replace(new RegExp(PORTUGUESE_MARKER, 'gi'), ' ')
    .replace(PY_KEYWORD, ' ')
    .replace(/[A-Za-z_][A-Za-z_0-9]*/g, word => (neutral.has(word.toLowerCase()) ? ' ' : word))
  return isEnglishProse(english)
}

export function mixedIn(where: string, code: string): Mixed[] {
  const found: Mixed[] = []
  const neutral = identifiers(code)
  for (const line of code.split('\n')) {
    const at = line.indexOf('#')
    if (at < 0) continue
    const before = line.slice(0, at)
    const quotes = (before.match(/"/g) || []).length + (before.match(/'/g) || []).length
    if (quotes % 2 === 1) continue                 // a '#' inside a string is not a comment
    const text = line.slice(at + 1).trim()
    if (isHalfTranslated(text, neutral)) found.push({ where, text })
  }
  return found
}

const RUN_AS_SCRIPT = /portunol\.ts$/.test(process.argv[1] || '')

if (RUN_AS_SCRIPT) {
  const LIMIT = Number(process.argv.find(a => a.startsWith('--through='))?.split('=')[1] ?? 68)
  const found: Mixed[] = []
  const scan = (where: string, value: unknown) => {
    if (typeof value === 'string') found.push(...mixedIn(where, resolveLocalizedCode(value, 'pt')))
  }

  for (const phase of ALL_PHASES.filter(p => p.id <= LIMIT)) {
    for (const [n, block] of (phase.lesson?.blocks || []).entries()) {
      scan(`p${phase.id} lesson block ${n}`, (block as { code?: unknown }).code)
      scan(`p${phase.id} checkpoint ${n}`, (block as { checkpoint?: { code?: unknown } }).checkpoint?.code)
    }
    for (const exercise of phase.exercises) scan(`p${phase.id} ${exercise.id}`, exercise.starterCode)
    scan(`p${phase.id} exam`, phase.exam?.starterCode)
  }

  const seen = new Set<string>()
  for (const item of found) {
    if (seen.has(item.text)) continue
    seen.add(item.text)
    console.log(`  ${item.where.padEnd(26)} ${item.text}`)
  }

  console.log(seen.size
    ? `\n${seen.size} comments reach a Portuguese learner in neither language — add exact entries to exactPt`
    : `no half-translated comments through phase ${LIMIT}`)
  process.exitCode = seen.size ? 1 : 0
}
