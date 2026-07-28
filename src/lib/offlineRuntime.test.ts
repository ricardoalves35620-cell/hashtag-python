import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * The app tells the learner, on its own loading screen, "After this, running code works
 * offline." Until now that was not reliably true.
 *
 * Pyodide loaded from cdn.jsdelivr.net. Five files are fetched, but only three ended up
 * in the service worker's cache: `pyodide.js` and `pyodide.asm.js` are pulled by
 * importScripts() inside the worker, which produces an opaque cross-origin response
 * that a CacheFirst rule will not store.
 *
 * So offline execution depended on the browser's ordinary HTTP cache still holding two
 * files it may evict at any moment. It passed every offline test in this repository,
 * because those tests checked that the shell opened and that writes queued — never that
 * Python actually ran with the network off.
 *
 * Serving the runtime from our own origin makes the responses non-opaque, so all five
 * cache. Verified end to end in scripts/audit/flight-mode.mjs, with the browser's HTTP
 * cache disabled so only the service worker can be responsible.
 */

const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')

describe('the Python runtime is served from our own origin', () => {
  const worker = read('../../public/python.worker.js')

  it('does not fetch the runtime from a CDN', () => {
    // Also removes a hard third-party dependency for the one feature the app is built
    // around — a blocked CDN used to mean no Python at all.
    expect(worker).not.toContain('cdn.jsdelivr.net')
  })

  it('uses a same-origin path', () => {
    expect(worker).toMatch(/const PYODIDE_BASE = `\/pyodide\/v\$\{PYODIDE_VERSION\}\/full\/`/)
  })
})

describe('the service worker can actually cache it', () => {
  const config = read('../../vite.config.ts')

  it('matches the runtime by same-origin pathname', () => {
    expect(config).toContain("url.pathname.startsWith('/pyodide/')")
    expect(config).toContain("handler: 'CacheFirst'")
  })

  it('keeps 12 MB out of the precache, so a first visit stays small', () => {
    // Precaching it would make every first load download Python whether or not the
    // learner ever runs code.
    expect(config).toContain("globIgnores: ['**/pyodide/**']")
  })
})

describe('the runtime is reproducible rather than committed', () => {
  const pkg = JSON.parse(read('../../package.json'))

  it('pins the version it copies', () => {
    expect(pkg.devDependencies?.pyodide, 'pyodide must be a pinned dependency').toBeTruthy()
  })

  it('copies before every build, so a fresh clone works', () => {
    expect(pkg.scripts?.prebuild).toContain('copy-pyodide')
  })

  it('copies the version the worker asks for', () => {
    const worker = read('../../public/python.worker.js')
    const wanted = worker.match(/const PYODIDE_VERSION = '([\d.]+)'/)?.[1]
    const copier = read('../../scripts/copy-pyodide.mjs')
    // A mismatch here means the worker requests a path the copier never wrote, and
    // Python fails to load with a 404 that looks like a network problem.
    expect(copier).toContain(`const VERSION = '${wanted}'`)
    expect(pkg.devDependencies.pyodide).toContain(wanted as string)
  })
})
