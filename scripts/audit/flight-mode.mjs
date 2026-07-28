import { chromium } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { basename } from 'node:path'

/**
 * The aeroplane test.
 *
 * Nothing in this repository has ever verified the one thing the app promises on its
 * own loading screen: "After this, running code works offline." Every offline test so
 * far has checked that the shell opens and that writes queue — not that a learner can
 * actually run Python with no network.
 *
 * This does the real sequence: install the service worker, warm the runtime, go
 * offline, reload, and try to learn.
 *
 *   node scripts/audit/flight-mode.mjs [--guest]
 */

const BASE = 'http://127.0.0.1:4173'
const PYODIDE_DIR = '/tmp/pyo/node_modules/pyodide'
const GUEST = process.argv.includes('--guest')
const TYPES = { '.js': 'application/javascript', '.json': 'application/json', '.wasm': 'application/wasm' }

// --disk-cache-size=1 makes the browser's ordinary HTTP cache useless. Without it a
// pass proves nothing: the runtime was reachable offline from the HTTP cache even when
// the service worker had stored only three of its five files.
const NO_HTTP_CACHE = process.argv.includes('--no-http-cache')
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: NO_HTTP_CACHE ? ['--disk-cache-size=1', '--media-cache-size=1'] : [],
})
const ctx = await browser.newContext({ viewport: { width: 1000, height: 1100 }, locale: 'en-US', serviceWorkers: 'allow' })

// The runtime is served from our own origin now, so nothing needs intercepting — which
// is the point: what this test exercises is exactly what a learner's browser does.

const page = await ctx.newPage()
const say = (label, value) => console.log(`${label.padEnd(46)} ${value}`)

const EMAIL = process.env.AUDIT_USER_EMAIL || 'teste@hashtagpython.com'
const PASSWORD = process.env.AUDIT_USER_PASSWORD || 'testehashtagpython'

async function enter() {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)
  if (GUEST) {
    await page.locator('.hp-guest-entry').click().catch(() => {})
  } else if (await page.getByRole('textbox', { name: /email/i }).count()) {
    // Signing in for real: the question this answers is whether a session survives
    // hours with no network, since /auth/v1/* is deliberately NetworkOnly.
    await page.getByRole('textbox', { name: /email/i }).fill(EMAIL)
    await page.locator('input[type="password"]').first().fill(PASSWORD)
    await page.getByRole('button', { name: /^(entrar|sign in)$/i }).click()
    await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 30_000 }).catch(() => {})
  }
  await page.waitForTimeout(1500)
}

async function runPython(phase, exerciseTab, waitMs) {
  await page.goto(`${BASE}/phase/${phase}/exercises`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)
  if (exerciseTab) {
    await page.locator('button').filter({ hasText: /^Exercise\s*\d+$/ }).nth(exerciseTab).click().catch(() => {})
    await page.waitForTimeout(2000)
  }
  const prediction = page.getByTestId('exercise-prediction')
  if (await prediction.count()) {
    await prediction.fill('I expect the values to print in order.')
    await page.getByTestId('exercise-change-plan').fill('one value')
    await page.waitForTimeout(400)
  }
  await page.getByTestId('exercise-run-button').click().catch(() => {})
  await page.waitForTimeout(waitMs)
  const output = await page.locator('[data-testid="exercise-output"] pre').innerText().catch(() => '')
  const unavailable = await page.locator('[data-testid="python-unavailable"]').count()
  return { output: output.trim(), unavailable: unavailable > 0 }
}

console.log(`\n=== FLIGHT MODE — ${GUEST ? 'guest' : 'signed in'}${NO_HTTP_CACHE ? ', HTTP cache disabled' : ''} ===\n`)

// 1. First visit. clientsClaim is false, so the worker installs but does not control
//    this page yet — which is exactly the state a learner is in after one visit.
await enter()
const swAfterFirst = await page.evaluate(() => Boolean(navigator.serviceWorker.controller))
say('service worker controlling after 1st visit', swAfterFirst)

// 2. Reload, which is when it takes over.
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2500)
if (GUEST) await page.locator('.hp-guest-entry').click().catch(() => {})
await page.waitForTimeout(1200)
const swAfterReload = await page.evaluate(() => Boolean(navigator.serviceWorker.controller))
say('service worker controlling after reload', swAfterReload)

// 3. Warm the runtime while still online.
const warm = await runPython(1, 0, 75000)
say('python runs ONLINE', warm.output ? 'yes' : `NO (${warm.unavailable ? 'runtime unavailable panel' : 'no output'})`)
if (warm.output) console.log(`   output: ${JSON.stringify(warm.output.slice(0, 60))}`)

const runtimeCached = await page.evaluate(async () => {
  const names = await caches.keys()
  const pyodide = names.find(n => n.includes('pyodide'))
  if (!pyodide) return []
  return (await (await caches.open(pyodide)).keys()).map(r => r.url.split('/').pop())
})
// All five, or offline execution is relying on the browser's HTTP cache — which it is
// free to evict, and which is how this passed before while being broken.
say('runtime files in the service-worker cache', `${runtimeCached.length}/5`)
console.log(`   ${runtimeCached.join(', ')}`)

// 4. Take off.
await ctx.setOffline(true)
say('network', 'OFFLINE')

// 5. The learner reopens the app at 30,000 feet.
await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {})
await page.waitForTimeout(3000)
const bodyOffline = await page.locator('body').innerText().catch(() => '')
say('app shell opens offline', bodyOffline.length > 200 ? 'yes' : `NO (${bodyOffline.length} chars)`)

const offlineRun = await runPython(2, 0, 60000)
say('PYTHON RUNS OFFLINE', offlineRun.output ? 'YES' : `NO (${offlineRun.unavailable ? 'runtime unavailable panel' : 'no output'})`)
if (offlineRun.output) console.log(`   output: ${JSON.stringify(offlineRun.output.slice(0, 80))}`)

// 6. A different phase the learner has never opened — the curriculum is in the bundle,
//    so this should work even though nothing about it was visited online.
const unseen = await runPython(3, 0, 45000)
say('an unvisited phase works offline', unseen.output ? 'YES' : 'NO')

const stillSignedIn = await page.evaluate(() => Object.keys(localStorage).some(k => k.includes('auth-token')))
say('session still present offline', GUEST ? 'n/a (guest)' : stillSignedIn)

console.log()
await browser.close()
