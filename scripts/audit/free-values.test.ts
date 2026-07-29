import { describe, expect, it } from 'vitest'
import { findInvitation } from './free-values'

/**
 * The detector went 57 -> 45 -> 5 -> 1. Every narrowing step is a chance to narrow past
 * the thing worth finding, so each case below is a real sentence from the curriculum,
 * paired with whether it is an OFFER (the learner picks a value) or not.
 *
 * Case 1 is the founding case: ex3_fill tells the learner to invent a client name, then
 * grades the output against "Maria". If this stops firing, the checker is worthless no
 * matter how few false positives it reports.
 */
const CASES: Array<[boolean, string, string]> = [
  [true,  'the founding case (ex3_fill)', 'Blank 1 — client_name: any name, as text (needs quotes)'],
  [true,  'explicit free choice',          'Print a greeting using your own name.'],
  [true,  'Portuguese free choice',        'Escolha qualquer cidade e mostre o resultado.'],
  [true,  'choice, spelled out',           'Use um nome que você quiser no lugar do exemplo.'],

  [false, 'a rule, not an offer',          'Raise ValueError if any price is negative.'],
  [false, 'a prohibition',                 'Do not hard-code any example value.'],
  [false, 'names an accepted TYPE',        'The function accepts any iterable of strings.'],
  [false, "Python's any() builtin",        'Validate the collection first with any or a normal loop.'],
  [false, 'any() with parentheses',        'Use any(row) to check whether the row has data.'],
  [false, 'Portuguese negation',           'Não use qualquer valor fixo no código.'],
  [false, 'Portuguese third-person "seu"', 'Some o valor de cada item com seu preço unitário.'],
  [false, 'a rule clause in Portuguese',   'Rejeite qualquer linha que esteja incompleta.'],

  // Surfaced the moment the doubled-backslash bug was fixed and the English half woke up.
  [false, 'the pronoun "anything" (p10)',   'Encontre chaves desconhecidas antes de atualizar qualquer coisa.'],
  [false, 'any() builtin, in Portuguese',   'Valide a coleção primeiro com any ou loop normal.'],
  [false, 'a prohibition with "without"',   '- Return the final total without using any global variable'],
  [false, '"any" as a quantifier (p4)',      '- The full price before any discount'],
]

describe('the free-value detector', () => {
  it.each(CASES)('%s: %s', (expected, _label, text) => {
    expect(Boolean(findInvitation(text))).toBe(expected)
  })
})
