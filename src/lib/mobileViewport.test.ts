import { describe, expect, it } from 'vitest'
import { isVirtualKeyboardOpen } from './mobileViewport'

const editable = { closest: () => ({}) } as unknown as Element
const ordinary = { closest: () => null } as unknown as Element

describe('mobile viewport', () => {
  it('detects a mobile keyboard when an editor is focused and viewport shrinks', () => {
    expect(isVirtualKeyboardOpen(800, 480, editable, 390)).toBe(true)
  })

  it('does not hide navigation for ordinary mobile viewport changes', () => {
    expect(isVirtualKeyboardOpen(800, 620, ordinary, 390)).toBe(false)
  })

  it('does not treat desktop resizing as a virtual keyboard', () => {
    expect(isVirtualKeyboardOpen(900, 500, editable, 1200)).toBe(false)
  })
})
