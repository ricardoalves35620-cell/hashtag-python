export function canScrollElement(element: HTMLElement, deltaY: number): boolean {
  if (element.scrollHeight <= element.clientHeight + 1) return false
  if (deltaY < 0) return element.scrollTop > 0
  if (deltaY > 0) return element.scrollTop + element.clientHeight < element.scrollHeight - 1
  return false
}

export function findScrollableAncestor(target: EventTarget | null, boundary: HTMLElement, deltaY: number): HTMLElement | null {
  let current = target instanceof HTMLElement ? target : null
  while (current && current !== boundary) {
    const style = window.getComputedStyle(current)
    const overflowY = style.overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && canScrollElement(current, deltaY)) {
      return current
    }
    current = current.parentElement
  }
  return null
}

export function shouldRouteWheelToMain(event: WheelEvent, shell: HTMLElement, main: HTMLElement): boolean {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) return false
  if (!Number.isFinite(event.deltaY) || event.deltaY === 0) return false
  if (event.target === main || main.contains(event.target as Node)) {
    const nested = findScrollableAncestor(event.target, main, event.deltaY)
    return nested === null
  }
  return shell.contains(event.target as Node)
}
