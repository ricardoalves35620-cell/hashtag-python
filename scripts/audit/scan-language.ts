/**
 * Strict language-isolation scanner.
 *
 * Walks every learner-facing string in the curriculum and the UI and reports the two
 * violations that matter:
 *   EN mode  — any Portuguese at all.
 *   PT mode  — any English that is not a reserved word, builtin or API name.
 *
 * Detection is evidence-based, not statistical: a hit needs an unambiguous marker
 * word, so "a", "no", "e" and other words that exist in both languages never trigger
 * anything on their own. That trades a little recall for a report you can act on
 * without re-checking every line by hand.
 */
import { ALL_PHASES } from '../../src/data/phases/index'
import { resolveLocalizedCode } from '../../src/lib/localization'

type Lang = 'en' | 'pt'

// Unambiguous Portuguese. Nothing here is also an English word or a Python token.
const PT_MARKERS = [
  'você', 'voce', 'não', 'nao', 'código', 'codigo', 'saída', 'saida', 'entrada', 'valor',
  'valores', 'variável', 'variavel', 'variáveis', 'linha', 'linhas', 'exercício', 'exercicio',
  'imprima', 'imprimir', 'executar', 'observar', 'notar', 'escreva', 'escrever', 'preencha', 'preencher',
  'altere', 'alterar', 'mude', 'mudar', 'troque', 'trocar', 'adicione', 'adicionar',
  'digite', 'digitar', 'crie', 'criar', 'coloque', 'colocar', 'depois', 'antes', 'agora',
  'aqui', 'então', 'entao', 'porque', 'quando', 'cada', 'entre', 'sobre', 'sempre', 'nunca',
  'apenas', 'também', 'tambem', 'ainda', 'mesmo', 'muito', 'pouco', 'primeiro', 'primeira',
  'último', 'ultimo', 'próximo', 'proximo', 'número', 'numero', 'números', 'numeros',
  'nome', 'nomes', 'texto', 'aspas', 'lista', 'listas', 'dicionário', 'dicionario',
  'função', 'funcao', 'funções', 'funcoes', 'resultado', 'resposta', 'pergunta',
  'usuário', 'usuario', 'arquivo', 'arquivos', 'pasta', 'para', 'com', 'sem', 'que',
  'seu', 'sua', 'seus', 'suas', 'uma', 'umas', 'dois', 'três', 'tres', 'quatro',
  'está', 'esta', 'estão', 'estao', 'ser', 'são', 'sao', 'foi', 'tem', 'faz', 'fazer',
  'usa', 'usar', 'veja', 'ver', 'olhe', 'lembre', 'atenção', 'atencao',
  'pt-token-placeholder',
]

// Unambiguous English. Excludes anything that is a Python keyword or builtin.
const EN_MARKERS = [
  'the', 'and', 'with', 'your', 'this', 'that', 'these', 'those', 'from', 'into', 'each',
  'when', 'then', 'after', 'before', 'must', 'should', 'will', 'would', 'could', 'here',
  'there', 'what', 'which', 'where', 'because', 'about', 'above', 'below', 'again',
  'without', 'inside', 'outside', 'between', 'every', 'always', 'never', 'only', 'also',
  'still', 'same', 'very', 'more', 'less', 'many', 'first', 'last', 'next', 'watch',
  'notice', 'remember', 'keep', 'needs', 'need', 'make', 'makes', 'show', 'shows',
  'goal', 'quotes', 'answer', 'question', 'exercise', 'folder', 'output', 'variable',
  'empty', 'returns', 'expected', 'wrong', 'right', 'correct', 'error', 'errors',
]

/**
 * Identifiers, calls and quoted literals are API references and are allowed in PT.
 * Removing them before the scan is what stops `greet(name, language="en")` from
 * being reported as three English words.
 */
function stripCodeReferences(text: string): string {
  return text
    .replace(/`[^`]*`/g, ' ')
    .replace(/"[^"]*"/g, ' ')
    .replace(/'[^']*'/g, ' ')
    .replace(/\b[A-Za-z_][A-Za-z0-9_]*\s*\(/g, ' ')
    .replace(/\b[A-Za-z_]*_[A-Za-z0-9_]*\b/g, ' ')
    .replace(/\b[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*\b/g, ' ')
}

// Reserved words, builtins, method names and API syntax — permitted in PT mode.
const ALLOWED_IN_PT = new Set([
  'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass', 'return', 'def',
  'class', 'import', 'as', 'try', 'except', 'finally', 'raise', 'with', 'lambda',
  'and', 'or', 'not', 'in', 'is', 'none', 'true', 'false', 'global', 'nonlocal',
  'yield', 'assert', 'del', 'from',
  'print', 'input', 'int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple',
  'len', 'sum', 'min', 'max', 'abs', 'round', 'sorted', 'reversed', 'range', 'enumerate',
  'zip', 'map', 'filter', 'open', 'type', 'format', 'append', 'extend', 'insert',
  'remove', 'pop', 'clear', 'index', 'count', 'sort', 'reverse', 'keys', 'values',
  'items', 'get', 'update', 'split', 'join', 'strip', 'replace', 'upper', 'lower',
  'title', 'startswith', 'endswith', 'find', 'json', 'datetime', 'random', 'math',
  'self', 'init', 'main', 'args', 'kwargs', 'none', 'null', 'true', 'false',
])

const words = (text: string) => (text.toLowerCase().match(/[a-zà-ÿ_]+/gi) || [])

function portugueseHits(text: string): string[] {
  const found = new Set<string>()
  for (const w of words(text)) if (PT_MARKERS.includes(w)) found.add(w)
  // Portuguese-only characters are conclusive on their own.
  for (const m of text.match(/[ãõçáéíóúâêôàÃÕÇÁÉÍÓÚÂÊÔÀ]/g) || []) found.add(`«${m}»`)
  return [...found]
}

function englishHits(text: string): string[] {
  const found = new Set<string>()
  for (const w of words(stripCodeReferences(text))) {
    if (ALLOWED_IN_PT.has(w)) continue
    if (EN_MARKERS.includes(w)) found.add(w)
  }
  return [...found]
}

interface Violation {
  mode: Lang
  where: string
  field: string
  hits: string[]
  text: string
}
const violations: Violation[] = []

function check(where: string, field: string, en: string | undefined, pt: string | undefined) {
  if (en) {
    const hits = portugueseHits(en)
    if (hits.length) violations.push({ mode: 'en', where, field, hits, text: en })
  }
  if (pt) {
    const hits = englishHits(pt)
    if (hits.length) violations.push({ mode: 'pt', where, field, hits, text: pt })
  }
}

/** Only the # comments — the code itself is expected to be English in both modes. */
function commentsOf(code: string): string {
  return code
    .split('\n')
    .map(line => {
      const i = line.indexOf('#')
      return i >= 0 ? line.slice(i + 1) : ''
    })
    .join('\n')
    .trim()
}

for (const phase of ALL_PHASES as any[]) {
  const p = `phase ${phase.id}`
  check(p, 'phase.title', phase.title?.en, phase.title?.pt)
  check(p, 'phase.description', phase.description?.en, phase.description?.pt)

  for (const block of phase.lesson?.blocks || []) {
    if (block.content) check(p, `lesson.${block.type}`, block.content.en, block.content.pt)
    if (typeof block.code === 'string') {
      const c = commentsOf(block.code)
      if (c) check(p, 'lesson.code#comments', c, commentsOf(resolveLocalizedCode(block.code, 'pt')))
    }
    if (block.checkpoint) {
      check(p, 'checkpoint.explanation', block.checkpoint.explanation?.en, block.checkpoint.explanation?.pt)
      for (const o of block.checkpoint.options || []) check(p, 'checkpoint.option', o.en, o.pt)
    }
  }

  for (const ex of phase.exercises || []) {
    const w = `${p} · ${ex.id}`
    check(w, 'title', ex.title?.en, ex.title?.pt)
    check(w, 'description', ex.description?.en, ex.description?.pt)
    check(w, 'sampleOutput', ex.sampleOutput?.en, ex.sampleOutput?.pt)
    for (const h of ex.hints || []) check(w, 'hint', h?.en, h?.pt)

    const enCode = resolveLocalizedCode(ex.starterCode, 'en')
    const ptCode = resolveLocalizedCode(ex.starterCode, 'pt')
    const enComments = commentsOf(enCode)
    const ptComments = commentsOf(ptCode)
    if (enComments || ptComments) check(w, 'starterCode#comments', enComments, ptComments)
  }

  for (const test of phase.exam?.testCases || []) {
    check(p, 'exam.testCase', test.description?.en, test.description?.pt)
  }
  check(p, 'exam.title', phase.exam?.title?.en, phase.exam?.title?.pt)
  check(p, 'exam.description', phase.exam?.description?.en, phase.exam?.description?.pt)
}

const byMode = { en: violations.filter(v => v.mode === 'en'), pt: violations.filter(v => v.mode === 'pt') }
console.log(`\n===== EN mode: Portuguese found in ${byMode.en.length} strings =====`)
for (const v of byMode.en.slice(0, 60)) {
  console.log(`\n[${v.where}] ${v.field}\n  markers: ${v.hits.slice(0, 8).join(', ')}\n  ${JSON.stringify(v.text.slice(0, 240))}`)
}
console.log(`\n\n===== PT mode: English found in ${byMode.pt.length} strings =====`)
for (const v of byMode.pt.slice(0, 60)) {
  console.log(`\n[${v.where}] ${v.field}\n  markers: ${v.hits.slice(0, 8).join(', ')}\n  ${JSON.stringify(v.text.slice(0, 240))}`)
}

console.log('\n\n===== field summary =====')
for (const mode of ['en', 'pt'] as Lang[]) {
  const counts: Record<string, number> = {}
  for (const v of byMode[mode]) counts[v.field] = (counts[v.field] || 0) + 1
  console.log(mode, JSON.stringify(counts, null, 1))
}
