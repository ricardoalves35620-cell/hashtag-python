import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('ui class utility', () => {
  it('joins valid classes in order', () => expect(cn('a', 'b', 'c')).toBe('a b c'))
  it('ignores optional false values', () => expect(cn('base', false, undefined, null, 'active')).toBe('base active'))
  it('returns an empty string without classes', () => expect(cn()).toBe(''))
})
