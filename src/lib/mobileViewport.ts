export function isEditableElement(target: EventTarget | null): boolean {
  if (!target || typeof (target as Element).closest !== 'function') return false
  return Boolean((target as Element).closest('input, textarea, select, [contenteditable="true"], .cm-content'))
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
