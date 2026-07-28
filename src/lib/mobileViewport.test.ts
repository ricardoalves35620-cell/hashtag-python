import { describe, expect, it } from 'vitest'
import { isVirtualKeyboardOpen, keyboardInset } from './mobileViewport'

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

/**
 * The sticky "Submit & Save" button is positioned against the bottom of the app
 * shell. 100dvh does not shrink for the keyboard, so without this offset the button
 * renders underneath it and cannot be tapped — on an iPhone SE that means a learner
 * cannot submit an exercise at all.
 */
describe('keyboard inset', () => {
  it('measures the occluded height on a keyboard-open iPhone SE', () => {
    // 667pt layout, visual viewport shrunk to 367 by a ~300pt keyboard.
    expect(keyboardInset(667, 367, 0)).toBe(300)
  })

  it('subtracts the visual viewport scroll offset', () => {
    // iOS scrolls the visual viewport when focusing a field near the bottom.
    // Ignoring offsetTop overstates the keyboard and leaves the button mid-screen.
    expect(keyboardInset(667, 367, 60)).toBe(240)
  })

  it('is zero when nothing is covering the viewport', () => {
    expect(keyboardInset(667, 667, 0)).toBe(0)
  })

  it('never returns a negative offset', () => {
    // Safari briefly reports a visual viewport taller than the layout viewport
    // during the URL-bar collapse animation.
    expect(keyboardInset(667, 700, 0)).toBe(0)
  })

  it('rounds to whole pixels for a stable CSS value', () => {
    // These land in a CSS custom property written on every viewport scroll event;
    // sub-pixel churn would thrash style recalculation.
    expect(keyboardInset(667.4, 367.1, 0)).toBe(300)
    expect(Number.isInteger(keyboardInset(667.5, 366.9, 0.3))).toBe(true)
  })

  it('degrades to zero rather than NaN on a viewport that reports nothing', () => {
    expect(keyboardInset(Number.NaN, 367, 0)).toBe(0)
  })
})
