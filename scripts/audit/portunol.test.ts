import { describe, it, expect } from 'vitest'
import { isHalfTranslated, mixedIn } from './portunol'

/**
 * The instrument before the number. This checker's whole value is that it fires on lines
 * the other two miss — `audit:language` sees Portuguese in them and `audit:content:drift`
 * sees one string with no counterpart — so it has to be shown catching real ones.
 *
 * Every string in HALF_TRANSLATED was read off the running app by
 * `npx tsx scripts/audit/portunol.ts` before any of them was fixed.
 */

const HALF_TRANSLATED = [
  'Construa the laço:',
  'the usuário types 30',
  'Client profile com calculations.',
  'The model nunca executes arbitrary Python directly.',
  'Shared mutation: redesign primeiro, lock somente the smallest critical section',
  'Wrap each in try/except com the CORRETO exception:',
  '4  — tie goes to the even número',
]

const FINISHED = [
  // Fully Portuguese.
  'Construa o laço:',
  'o usuário digita 30',
  'Perfil do cliente com cálculos.',
  'soma os preços da lista',
  // Fully English — wrong for a PT learner, but that is audit:language's finding, not this
  // one. Two checkers reporting the same line twice makes both harder to act on.
  'Python reads TOP to BOTTOM and stops at the FIRST True.',
  'Rank by token overlap, preserve source IDs and refuse without evidence.',
  // Identifiers and keywords are language-neutral, however they are mixed.
  'print(total)',
  'use for e in range(10)',
]

describe('isHalfTranslated', () => {
  it('fires on every mixed comment found in the running app', () => {
    expect(HALF_TRANSLATED.filter(text => !isHalfTranslated(text))).toEqual([])
  })

  it('stays silent on comments that are finished in either language', () => {
    expect(FINISHED.filter(text => isHalfTranslated(text))).toEqual([])
  })
})

describe('mixedIn', () => {
  it('reads comments and ignores a # inside a string', () => {
    const code = ['# Construa the laço:', 'print("# the usuário types 30")'].join('\n')
    expect(mixedIn('fixture', code).map(item => item.text)).toEqual(['Construa the laço:'])
  })

  it('does not report a comment naming a Python keyword or the exercise\'s own variable', () => {
    const code = [
      'if amount ___ 5000:    # preencha: >, and, <',
      'while stock >= 15:     # preencha: continue enquanto stock >= 15',
      '    stock = stock - 1',
    ].join('\n')
    expect(mixedIn('fixture', code)).toEqual([])
  })

  it('still reports real English prose in the same asset', () => {
    const code = ['stock = 10', '# guarda o stock and useless to a reader'].join('\n')
    expect(mixedIn('fixture', code).map(item => item.text))
      .toEqual(['guarda o stock and useless to a reader'])
  })
})
