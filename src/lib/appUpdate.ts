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
 * index.html and the matching chunks.
 *
 * The first version of this file had two defects, both measured in the 2026-07-30
 * reproduction (Playwright driving two real builds through a deploy):
 *
 * - It called `event.preventDefault()`, which swallowed the real rejection. The
 *   preload helper then resolved `undefined`, React.lazy read `.default` of it, and
 *   whenever the reload guard held, the boundary reported "Cannot read properties of
 *   undefined (reading 'default')" instead of the chunk failure. The comment that
 *   promised "the original error is left to surface" was false.
 * - Its `load` listener cleared the one-shot guard on every successful page load. When
 *   the reload landed on a page that still could not fetch the chunk — a controlling
 *   service worker serving a stale index.html, the exact state of the 2026-07-30
 *   outage — the guard re-armed each cycle: an infinite reload loop, the crash screen
 *   flashing every ~600 ms, 136 events in five seconds.
 *
 * The rewrite spends one reload PER BUILD instead. The flag records the build sha that
 * already tried: landing on a new build changes the sha and re-arms recovery for the
 * next deploy with no listener needed; landing on the same build proves the reload
 * fetched nothing new, so the second failure surfaces instead of looping. And nothing
 * is swallowed — the true error always reaches the boundary, which shows a calm
 * "updating" screen while a recovery reload is in flight (isRecoveryReloadPending)
 * and the real failure when it is not.
 */

const RELOAD_FLAG = 'hp_recovered_from_stale_build'

function currentBuildSha(): string {
  // `typeof` keeps this safe where the define is absent (vitest runs in node).
  return typeof __APP_BUILD_SHA__ === 'string' ? __APP_BUILD_SHA__ : 'unknown'
}

export type RecoveryPlan = 'reload' | 'surface'

/**
 * The whole policy, as a pure function so the test can hold it still:
 * reload exactly once per build, and never offline — offline, every chunk outside
 * the service-worker cache is unreachable, so a reload re-runs the same failing
 * import and looks like a crash loop (it is exactly what pressing F5 on a plane
 * produces).
 */
export function planRecovery(input: {
  online: boolean
  currentSha: string
  recoveredSha: string | null
}): RecoveryPlan {
  if (!input.online) return 'surface'
  if (input.recoveredSha === input.currentSha) return 'surface'
  return 'reload'
}

let reloadPending = false

/**
 * True from the moment a recovery reload is requested until the navigation commits.
 * location.reload() is not instant: React keeps rendering for a few hundred
 * milliseconds, the failed lazy route rejects, and the error boundary fires. The
 * boundary consults this to show "updating…" for that window instead of flashing
 * "Algo interrompeu a aula" at a learner who is about to land on the fixed build.
 */
export function isRecoveryReloadPending(): boolean {
  return reloadPending
}

export function installAppUpdateRecovery() {
  if (typeof window === 'undefined') return

  window.addEventListener('vite:preloadError', () => {
    // Deliberately NO event.preventDefault(): Vite rethrows, React.lazy rejects with
    // the real error, and the boundary decides what to show. Recovery only schedules
    // the reload; it never hides what happened.
    if (reloadPending) return // several chunks can fail in one render pass; one reload is enough

    let recoveredSha: string | null = null
    try {
      recoveredSha = sessionStorage.getItem(RELOAD_FLAG)
    } catch {
      // Storage blocked: recover anyway; the in-memory latch above still prevents
      // multiple reloads from a single page.
    }
    const online = typeof navigator === 'undefined' || navigator.onLine !== false
    if (planRecovery({ online, currentSha: currentBuildSha(), recoveredSha }) !== 'reload') return

    reloadPending = true
    try {
      sessionStorage.setItem(RELOAD_FLAG, currentBuildSha())
    } catch {
      // Without the flag the guard is memory-only; a persistent failure will show
      // the boundary on the reloaded page's own attempt rather than loop silently.
    }
    window.location.reload()
  })
}
