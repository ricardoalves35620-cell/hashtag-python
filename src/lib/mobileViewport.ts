export function isEditableElement(target: EventTarget | null): boolean {
  if (!target || typeof (target as Element).closest !== 'function') return false
  return Boolean((target as Element).closest('input, textarea, select, [contenteditable="true"], .cm-content'))
}

/**
 * How many pixels of the layout viewport the virtual keyboard is covering.
 *
 * `100dvh` follows the URL bar, not the keyboard, so the app shell keeps its full
 * height while the keyboard sits on top of the bottom of it. Anything positioned
 * against that bottom edge — the sticky lesson actions, the toast region — ends up
 * underneath the keyboard unless it is offset by this much.
 *
 * offsetTop matters because iOS scrolls the visual viewport within the layout
 * viewport when focusing a field near the bottom; ignoring it overstates the
 * occluded height and leaves the button floating in mid-screen.
 */
export function keyboardInset(layoutHeight: number, viewportHeight: number, offsetTop: number): number {
  const occluded = layoutHeight - viewportHeight - offsetTop
  if (!Number.isFinite(occluded)) return 0
  return Math.max(0, Math.round(occluded))
}

export function isVirtualKeyboardOpen(
  layoutHeight: number,
  viewportHeight: number,
  activeElement: Element | null,
  viewportWidth: number,
): boolean {
  if (viewportWidth > 900) return false
  const focused = isEditableElement(activeElement)
  const lostHeight = layoutHeight - viewportHeight
  return focused && lostHeight > Math.max(140, layoutHeight * 0.18)
}
