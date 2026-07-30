/**
 * Lets a new build actually reach the learner.
 *
 * `registerType: 'prompt'` in vite.config.ts is the right choice and was made for a real
 * reason: with `autoUpdate`, a new worker activates under a running tab, cleanupOutdatedCaches
 * deletes the chunks that tab is still holding, and the next lazy import 404s — the
 * "Algo interrompeu a aula" crash reported from the app.
 *
 * But 'prompt' only means the new worker WAITS. Something has to tell it to take over, and
 * nothing ever did. So a new build reached a learner only if they closed every tab and every
 * installed window — which on an installed app means swiping it out of the app switcher, not
 * backgrounding it.
 *
 * The cost of that was measured rather than guessed. A translation shipped on 2026-07-29
 * was still not on screen a day and nineteen commits later: the app was showing
 * "# Construa your dashboard:" while the repository had said "# Monte seu painel:" the whole
 * time. Every fix in between was equally invisible.
 *
 * This is the missing half: notice the waiting worker, tell the learner, and hand over only
 * when they say so — so the takeover happens at a moment they chose, not under their feet
 * mid-exercise.
 */

type UpdateListener = (available: boolean) => void

const listeners = new Set<UpdateListener>()
let updateAvailable = false
let applyUpdate: (() => void) | null = null

function announce(available: boolean) {
  updateAvailable = available
  for (const listener of listeners) listener(available)
}

export function onUpdateAvailable(listener: UpdateListener): () => void {
  listeners.add(listener)
  listener(updateAvailable)
  return () => listeners.delete(listener)
}

/** Hand over to the waiting worker and reload onto the new build. */
export function applyPendingUpdate() {
  applyUpdate?.()
}

export async function installUpdatePrompt() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  try {
    // Imported lazily and guarded: the virtual module only exists in a PWA build, and a
    // failure here must never stop the app from starting.
    const { registerSW } = await import('virtual:pwa-register')
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        applyUpdate = () => updateSW(true)
        announce(true)
      },
    })
  } catch {
    // No service worker in this build (dev, or tests). Nothing to prompt about.
  }
}

/** Exposed for the test: resets module state between cases. */
export function resetUpdateStateForTests() {
  listeners.clear()
  updateAvailable = false
  applyUpdate = null
}
