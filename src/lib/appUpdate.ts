/**
 * Recovery from a mid-session deployment.
 *
 * The app code-splits, so screens load as chunks on demand. When a new build ships
 * while a tab is open, the running page still holds the old chunk names. Those files
 * no longer exist, Cloudflare's SPA fallback answers with index.html, and the browser
 * reports "Failed to load module script … MIME type text/html". The app appears to
 * crash even though nothing is broken — it is simply looking for a build that moved.
 *
 * Vite raises `vite:preloadError` for precisely this. Reloading once picks up the new
 * index.html and the matching chunks. The session flag stops a reload loop if the
 * failure is something else, in which case the original error is left to surface.
 */

const RELOAD_FLAG = 'hp_recovered_from_stale_build'

function recoverOnce(reason: string) {
  if (typeof window === 'undefined') return
  try {
    if (sessionStorage.getItem(RELOAD_FLAG)) return
    sessionStorage.setItem(RELOAD_FLAG, reason)
  } catch {
    // Storage blocked — better to reload than to leave a blank screen.
  }
  window.location.reload()
}

export function installAppUpdateRecovery() {
  if (typeof window === 'undefined') return

  window.addEventListener('vite:preloadError', event => {
    event.preventDefault()
    recoverOnce('preload')
  })

  // A fresh load that succeeds clears the flag, so a future deploy can recover again.
  window.addEventListener('load', () => {
    try {
      sessionStorage.removeItem(RELOAD_FLAG)
    } catch {
      // ignore
    }
  })
}
