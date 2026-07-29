import { readFileSync } from 'node:fs'

/**
 * Asserts the GENERATED service worker matches the update policy the config asks for.
 *
 * vite.config.ts set `clientsClaim: false` and `skipWaiting: false` under `workbox`,
 * with a comment explaining why:
 *
 *   "Do NOT claim open tabs mid-session: the running page still references the previous
 *    build's chunks, and taking over deletes them under its feet."
 *
 * The plugin-level `registerType: 'autoUpdate'`, twelve lines above, forces both to true
 * and says nothing. The generated worker called self.skipWaiting() and clientsClaim()
 * unconditionally, so every deploy activated under any open tab, cleanupOutdatedCaches
 * deleted the chunks that tab was still holding, and the next lazy import 404'd. The
 * learner saw "Algo interrompeu a aula." on reload — reported from the app as frequent.
 *
 * A comment cannot enforce anything. This can: it reads the built worker and fails if it
 * does something the config says it must not.
 *
 *   npm run audit:sw
 */

const config = readFileSync('vite.config.ts', 'utf8')
const worker = readFileSync('dist/sw.js', 'utf8')

/**
 * Read the OPTION, never the prose around it. The first version matched
 * `${name}:\\s*(true|false)` anywhere in the file and hit this very file's own comment —
 * "'autoUpdate' FORCES skipWaiting:true" — so the guard concluded skipWaiting was meant
 * to be true and passed a build that did exactly what it was written to prevent.
 */
const configured = name => {
  const line = config.split('\n')
    .map(text => text.trim())
    .filter(text => !text.startsWith('//') && !text.startsWith('*'))
    .find(text => new RegExp(`^${name}:\\s*(true|false)\\s*,?$`).test(text))
  return /:\s*true/.test(line || '')
}

// A skipWaiting inside a message listener is the WAITING pattern: the worker takes over
// only when something explicitly asks it to. An unconditional call at the top level is
// the opposite, so the two must be told apart rather than grepped for together.
const unconditionalSkipWaiting = /(?<!message[\s\S]{0,200})\bself\.skipWaiting\(\)/.test(
  worker.replace(/self\.addEventListener\("message"[\s\S]{0,200}?\)\}\)/g, ''),
)
const claimsClients = /\bclientsClaim\(\)/.test(worker)

const problems = []
if (!configured('skipWaiting') && unconditionalSkipWaiting) {
  problems.push('config says skipWaiting: false, but the built worker calls self.skipWaiting() unconditionally')
}
if (!configured('clientsClaim') && claimsClients) {
  problems.push('config says clientsClaim: false, but the built worker calls clientsClaim()')
}

for (const problem of problems) console.log(`  ${problem}`)
console.log(problems.length
  ? `\n${problems.length} service-worker settings are overridden without saying so — check registerType`
  : 'the built service worker matches the update policy in vite.config.ts')

process.exitCode = problems.length ? 1 : 0
