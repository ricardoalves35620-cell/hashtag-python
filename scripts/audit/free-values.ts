import { ALL_PHASES } from '../../src/data/phases'

/**
 * Finds exercises that invite the learner to choose a value ("any name", "qualquer
 * número", "your own") and then grade against one specific choice. Those exercises
 * fail correct work. The fix is to mark the varying part of sampleOutput with a
 * {{placeholder}}, which turns it into a wildcard in every grading layer.
 */
/**
 * An invitation is the learner being told to CHOOSE. It is not the word "any".
 *
 * The first version matched /any |seu |sua /, which flagged 57 exercises and was almost
 * entirely wrong. "Raise ValueError when any price is negative" is a rule, not an
 * invitation, and Portuguese "seu preço" is "its price" — a third-person possessive,
 * not "your price". Both meanings share a word with the thing worth finding.
 *
 * So the marker has to be the act of choosing, stated explicitly: a verb that hands the
 * decision to the learner, or a phrase that can only mean free choice.
 */
// `any(` is Python's builtin, not an offer. "any other file" is a rule clause. And
// "any iterable" names an accepted TYPE, where "any name" names a free VALUE — the
// learner chooses the second and never the first.
const TYPE_NOUN = /\bany\s+(iterable|sequence|mapping|object|type|callable|other)\b/i
// "qualquer coisa" is the pronoun "anything", not a value the learner names.
const PRONOUN = /\bqualquer\s+(coisa|uma?|outr[oa])\b/i
// "the full price before any discount" / "without any global" — here "any" means "at
// all", a quantifier. Only a bare "any <noun>" hands the learner the choice.
const QUANTIFIER = /\b(before|after|without|beyond|besides|than|antes de|depois de|sem)\s+(any|qualquer)\b/i
const CHOOSE_EN = /\bany\s+\w+|\byour own\s+\w+/i

// "Validate it with any or a normal loop" names the builtin in prose, with no call
// parentheses to give it away. What follows `any` decides: an offer is always "any
// <noun>", so a function word after it means the sentence is about something else.
const NOT_A_NOUN = /\b(any|qualquer)\s+(or|and|of|to|in|on|at|is|are|was|were|the|a|an|it|that|this|with|from|for|would|will|can|could|does|do|ou|e|de|da|do|dos|das|em|no|na|que|com|para)\b/i
const BUILTIN = /\bany\s*\(|\bany\(\)|\bany\/all\b|\ball\/any\b/i
const CHOOSE_PT = /\bqualquer\s+\w+|\bseu[s]? pr[óo]prio[s]?\s+\w+|\bsua[s]? pr[óo]pria[s]?\s+\w+|\b[àa]\s+sua\s+escolha\b|\bde\s+sua\s+escolha\b|\bque\s+(voc[êe]\s+)?quiser\b/i
const INVITES = new RegExp(`${CHOOSE_EN.source}|${CHOOSE_PT.source}`, 'i')

/**
 * "any" carries both meanings, and the sentence decides which. A conditional or a
 * rejection is a RULE — "raise ValueError if any row is ragged" specifies behaviour. An
 * unconditional "any name" is an OFFER — the learner picks.
 *
 * That distinction, not the presence of a verb, is what separates the 57 findings from
 * the one that mattered. Bare Portuguese "seu"/"sua" is dropped entirely: "seu preço" is
 * "its price", a third-person possessive, and it produced false positives on its own.
 */
/**
 * Negation belongs here too: "Do not hard-code any example value" is a prohibition,
 * the exact opposite of an offer, and on its own it was most of what survived the
 * first narrowing.
 */
const RULE_CONTEXT = /\b(if|when|whenever|unless|raise|reject|refuse|invalid|ignore|skip|error|do not|don't|never|must not|cannot|avoid|without|sem usar|sem|se|quando|caso|gere|rejeite|recuse|inv[áa]lid|n[ãa]o|nunca|evite)\b/i

/**
 * Test sentence by sentence: a rule elsewhere in the description must not excuse a
 * genuine invitation, and an invitation must not be manufactured by words that happen
 * to sit in the same paragraph.
 *
 * Exported so `selftest-free.ts` can hold it to the founding case — `ex3_fill`'s
 * "client_name: any name, as text", graded against "Maria" — while every shape that
 * produced the original 57 stays quiet.
 */
export function findInvitation(visible: string): string | undefined {
  return visible.split(/(?<=[.!?\n])/).find(part =>
    INVITES.test(part)
    && !RULE_CONTEXT.test(part)
    && !TYPE_NOUN.test(part)
    && !PRONOUN.test(part)
    && !QUANTIFIER.test(part)
    && !NOT_A_NOUN.test(part)
    && !BUILTIN.test(part))
}

// `matches` pins output too — it is a pattern, but a pattern the learner's free value
// still has to satisfy. Counting only `equals` made this audit blind to half the
// exercises that could reject a correct answer.
const EXACT = new Set(['equals', 'equals_any', 'matches', 'numeric_equals'])

const MAX = Number(process.argv[2] ?? 27)
let flagged = 0

// Importable: `selftest-free.ts` pulls in findInvitation without triggering the sweep.
const RUN_AS_SCRIPT = /free-values\.ts$/.test(process.argv[1] || '')

for (const phase of RUN_AS_SCRIPT ?  ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id) : []) {
  for (const ex of phase.exercises) {
    const visible = [
      ex.description?.en, ex.description?.pt,
      ...(ex.hints || []).flatMap(h => [h.en, h.pt]),
      typeof ex.starterCode === 'string' ? ex.starterCode : (ex.starterCode as any)?.en,
    ].filter(Boolean).join(' ')

    const invitation = findInvitation(visible)
    if (!invitation) continue

    const exactChecks = (ex.grading?.tests || []).flatMap(t =>
      (t.checks || []).filter(c => EXACT.has(String(c.type))))
    if (exactChecks.length === 0) continue

    const sample = ex.sampleOutput?.en || ''
    if (sample.includes('{{')) continue   // already marked as varying

    const sentence = invitation
    console.log(`p${phase.id} ${ex.id}`)
    console.log(`   invite : ${sentence.trim().slice(0, 110)}`)
    console.log(`   grades : ${JSON.stringify(String(exactChecks[0].value).slice(0, 60))}`)
    flagged++
  }
}
if (RUN_AS_SCRIPT) console.log(`\n${flagged} exercises invite a free value and then require one specific answer`)
if (RUN_AS_SCRIPT && flagged > 0) process.exitCode = 1
