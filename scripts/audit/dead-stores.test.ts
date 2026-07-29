import { describe, expect, it } from 'vitest'
import { findDeadStores } from './dead-stores'

/**
 * Case 1 is the founding case: phase 27's capstone printed the same total twice while
 * telling the learner to expect two different numbers. Case 2 is the shape that must
 * stay quiet — phase 4 teaches conversion by writing the broken line and then fixing it.
 */
describe('dead-store detector', () => {
  it('catches the phase 27 capstone bug', () => {
    const found = findDeadStores([
      '    total = sum(c["amount"] for c in db)',
      '    total = sum(c["total"] for c in db)',
      '    print(total)',
    ].join('\n'))
    expect(found).toHaveLength(1)
    expect(found[0].name).toBe('total')
  })

  it('leaves a deliberate before/after contrast alone', () => {
    expect(findDeadStores([
      '# ❌ MISTAKE: math on unconverted input',
      'x = input("Number: ")',
      '',
      '# ✅ FIX:',
      'x = int(input("Number: "))',
    ].join('\n'))).toEqual([])
  })

  it('leaves an accumulator alone — the second read the first', () => {
    expect(findDeadStores('total = 0\ntotal = total + 5')).toEqual([])
  })

  it('leaves a loop body alone — different indentation', () => {
    expect(findDeadStores('total = 0\nfor c in db:\n    total = total + c')).toEqual([])
  })

  it('does not confuse == with =', () => {
    expect(findDeadStores('found = a == b\nfound = c == d')).toHaveLength(1)
  })
})

describe('a string literal is not a read', () => {
  it('still fires when the discarded name appears as a dict key', () => {
    // This is how the detector first missed its own founding case.
    const found = findDeadStores('total = sum(c["amount"] for c in db)\ntotal = sum(c["total"] for c in db)')
    expect(found).toHaveLength(1)
  })
})
