import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Copies the Pyodide runtime into public/ so it is served from our own origin.
 *
 * It used to load from cdn.jsdelivr.net, and the app promises on its own loading screen
 * that "after this, running code works offline". It did not, reliably:
 *
 *   five files are fetched   pyodide.js, pyodide.asm.js, pyodide.asm.wasm,
 *                            pyodide-lock.json, python_stdlib.zip
 *   three end up cached      the two missing ones are pulled by importScripts() inside
 *                            the worker, which produces an opaque cross-origin response
 *                            that the service worker's CacheFirst rule will not store
 *
 * So offline execution depended on the browser's ordinary HTTP cache still holding two
 * files it is free to evict at any time. It works until it doesn't, and the moment it
 * doesn't is a flight.
 *
 * Same-origin responses are not opaque, so all five cache. It also removes a hard
 * dependency on a third-party CDN for the one feature the whole app is built around.
 *
 * The CORE files are NOT committed — they come from the pinned devDependency, and the
 * copy runs before every build. The scientific-package wheels below ARE committed
 * (vendor/pyodide-wheels), because the devDependency does not contain them.
 */

const VERSION = '0.25.1'
const FILES = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'pyodide-lock.json', 'python_stdlib.zip']

const from = 'node_modules/pyodide'
const to = join('public', 'pyodide', `v${VERSION}`, 'full')

if (!existsSync(from)) {
  console.error(`pyodide not installed. Run: npm install`)
  process.exit(1)
}

mkdirSync(to, { recursive: true })
let bytes = 0
for (const name of FILES) {
  const source = join(from, name)
  if (!existsSync(source)) {
    console.error(`missing ${source} — is the pinned pyodide version still ${VERSION}?`)
    process.exit(1)
  }
  copyFileSync(source, join(to, name))
  bytes += statSync(source).size
}

/**
 * Scientific-package wheels, vendored in the repository.
 *
 * The worker's loadPackagesFromImports() resolves package files RELATIVE TO the
 * same-origin indexURL — and the npm pyodide package ships NONE of them. So the
 * comment in python.worker.js promising that "lessons using NumPy/Pandas work"
 * was false in every deploy that ever shipped: the wheel fetch 404'd into the
 * SPA fallback and the learner got ModuleNotFoundError. Found 2026-07-30 by
 * audit:learner running phase 55 in the real browser; every source-level
 * checker passed, because CPython has real numpy.
 *
 * The wheels live in vendor/pyodide-wheels (sha256-verified against
 * pyodide-lock.json when they were vendored, from the pyodide 0.25.1 GitHub
 * release) rather than being fetched at build time: a deploy must not depend
 * on a third-party CDN being up, which is the same reasoning that moved the
 * core runtime off jsdelivr in the first place.
 */
const wheelsFrom = join('vendor', 'pyodide-wheels')
const wheels = existsSync(wheelsFrom) ? readdirSync(wheelsFrom).filter(name => name.endsWith('.whl')) : []
if (!wheels.length) {
  console.error(`no wheels in ${wheelsFrom} — phase 55/56 (NumPy/Pandas) cannot run in the browser without them`)
  process.exit(1)
}
for (const name of wheels) {
  copyFileSync(join(wheelsFrom, name), join(to, name))
  bytes += statSync(join(wheelsFrom, name)).size
}
console.log(`pyodide ${VERSION}: ${FILES.length} core files + ${wheels.length} wheels, ${(bytes / 1048576).toFixed(1)} MB -> ${to}`)
