
// Reliable cross-browser scroll to top
// iOS Safari ignores scrollTo({ behavior: 'instant' }) sometimes
export function scrollToTop(delay = 0) {
  const doScroll = () => {
    const el = document.getElementById('main-scroll')
    if (el) {
      el.scrollTop = 0
    }
    window.scrollTo(0, 0)
  }
  if (delay > 0) {
    setTimeout(doScroll, delay)
  } else {
    doScroll()
  }
}
