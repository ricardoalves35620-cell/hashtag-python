/**
 * Reliable cross-browser scroll to top.
 *
 * Two iOS Safari quirks are being worked around here:
 *   - `scrollTo({ behavior: 'instant' })` is sometimes ignored outright.
 *   - Setting scrollTop during the same frame as a route change is discarded,
 *     because the new view has not been laid out yet. Deferring to the next
 *     animation frame is what makes it stick.
 *
 * The scroll container id matches `.hp-main` in Layout.tsx. It is looked up per
 * call rather than cached because route changes replace the element.
 */

const SCROLL_CONTAINER_ID = 'main-scroll'

function scrollNow() {
  const container = document.getElementById(SCROLL_CONTAINER_ID)
  if (container) container.scrollTop = 0
  // Some routes render outside the shell (login, reset-password), where the
  // window itself is the scroller.
  window.scrollTo(0, 0)
}

export function scrollToTop(delay = 0) {
  if (typeof document === 'undefined') return

  const run = () => {
    if (typeof requestAnimationFrame === 'function') {
      // Wait for the incoming route to lay out, then scroll.
      requestAnimationFrame(scrollNow)
    } else {
      scrollNow()
    }
  }

  if (delay > 0) window.setTimeout(run, delay)
  else run()
}
