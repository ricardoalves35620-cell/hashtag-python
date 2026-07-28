import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
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
 * The files are NOT committed — they come from the pinned devDependency, and the copy
 * runs before every build.
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
console.log(`pyodide ${VERSION}: ${FILES.length} files, ${(bytes / 1048576).toFixed(1)} MB -> ${to}`)
