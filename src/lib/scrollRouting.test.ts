import { describe, expect, it } from 'vitest'
import { canScrollElement } from './scrollRouting'

describe('scroll routing', () => {
  function element(scrollTop: number, clientHeight: number, scrollHeight: number) {
    return { scrollTop, clientHeight, scrollHeight } as HTMLElement
  }

  it('detects available downward scrolling', () => {
    expect(canScrollElement(element(0, 500, 1000), 120)).toBe(true)
    expect(canScrollElement(element(500, 500, 1000), 120)).toBe(false)
  })

  it('detects available upward scrolling', () => {
    expect(canScrollElement(element(20, 500, 1000), -120)).toBe(true)
    expect(canScrollElement(element(0, 500, 1000), -120)).toBe(false)
  })

  it('does not treat non-overflowing content as scrollable', () => {
    expect(canScrollElement(element(0, 500, 500), 120)).toBe(false)
  })
})
