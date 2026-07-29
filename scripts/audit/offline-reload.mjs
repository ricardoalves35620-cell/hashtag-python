import { chromium } from '@playwright/test'

/**
 * Reproduces the two offline defects reported from the app:
 *
 *   1. Nothing tells the learner the app is offline.
 *   2. Open online -> go offline -> press F5 -> the app crashes.
 *
 * flight-mode.mjs already covered "offline reload" and passed, so this exists to find
 * what that missed. The difference that matters is being SIGNED IN: a guest has no
 * session to refresh, and /auth/v1/* is deliberately NetworkOnly.
 *
 *   node scripts/audit/offline-reload.mjs [--guest]
 */

const BASE = 'http://127.0.0.1:4173'
const GUEST = process.argv.includes('--guest')
const EMAIL = process.env.AUDIT_USER_EMAIL || 'teste@hashtagpython.com'
const PASSWORD = process.env.AUDIT_USER_PASSWORD || 'testehashtagpython'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, locale: 'pt-BR', serviceWorkers: 'allow' })
const page = await context.newPage()

const errors = []
page.on('pageerror', error => errors.push(`pageerror: ${error.message.split('\n')[0].slice(0, 200)}`))
page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text().slice(0, 200)}`) })

const say = (label, value) => console.log(`${label.padEnd(46)} ${value}`)
const visibleText = async () => (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').trim()

await page.goto(BASE, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2000)

if (GUEST) {
  await page.locator('.hp-guest-entry').click().catch(() => {})
} else {
  const email = page.getByRole('textbox', { name: /email/i })
  if (await email.count()) {
    await email.fill(EMAIL)
    await page.locator('input[type="password"]').first().fill(PASSWORD)
    await page.getByRole('button', { name: /^(entrar|sign in)$/i }).click().catch(() => {})
    await page.waitForTimeout(4000)
  }
}
await page.waitForTimeout(2000)
say(GUEST ? 'entered as guest' : 'signed in', page.url().replace(BASE, '') || '/')

// Warm the runtime and the routes the learner will actually reload on.
await page.goto(`${BASE}/phase/1/exercises`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(6000)

for (let attempt = 0; attempt < 30; attempt++) {
  const ready = await page.evaluate(() => navigator.serviceWorker?.controller !== null)
  if (ready) break
  await page.waitForTimeout(500)
}
say('service worker controlling', await page.evaluate(() => navigator.serviceWorker?.controller !== null))

errors.length = 0
await context.setOffline(true)
say('network', 'OFFLINE')

// (1) does anything on screen say so?
await page.waitForTimeout(3000)
const offlineNotice = /^offline$/i.test((await page.locator('.hp-sync-chip__label').first().innerText().catch(() => '')).trim())
say('screen tells the learner they are offline', offlineNotice ? 'yes' : 'NO')

// (2) the reported crash: F5 while offline, on EVERY route — including ones never
// visited before the network went away, since that is what a learner does after
// closing the laptop lid on one page and opening the app on another.
const ROUTES = [
  // Every real route in App.tsx. An earlier version of this list invented /course and
  // /paths, which do not exist — the app correctly showed nothing and the check read it
  // as a missing indicator. Checking the app against routes it does not have is how a
  // harness invents bugs.
  '/', '/base-zero', '/progress', '/profile', '/review', '/roadmap', '/career',
  '/fasttrack', '/portfolio', '/group', '/diagnostic', '/engineering-lab', '/ai-lab',
  '/project-lab', '/visualizer',
  '/phase/1', '/phase/1/lesson', '/phase/1/exercises', '/phase/1/quiz',
  '/phase/9/lesson', '/phase/9/exercises', '/phase/9/quiz', '/phase/9/exam',
  '/phase/17/lesson', '/phase/20/exercises', '/phase/27/lesson',
]

const CRASH = /algo interrompeu|something interrupted|algo deu errado|something went wrong|unexpected error|application error/i

let crashed = 0
let silent = 0
console.log('')
for (const route of ROUTES) {
  errors.length = 0
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {})
  await page.waitForTimeout(2500)
  const text = await visibleText()
  const blank = text.length < 40
  const broke = blank || CRASH.test(text)
  const chip = await page.locator('.hp-sync-chip__label').first().innerText().catch(() => '')
  const notice = /^offline$/i.test(chip.trim())
  if (broke) crashed++
  if (!notice) silent++
  const status = broke ? (blank ? 'BLANK PAGE' : 'ERROR SCREEN') : 'ok'
  const landed = page.url().replace(BASE, '') || '/'
  const where = landed === route ? '' : ` -> ${landed}`
  console.log(`  ${route.padEnd(24)} ${status.padEnd(13)} ${(notice ? 'offline shown' : 'no offline notice').padEnd(18)}${where}`)
  if (broke) {
    console.log(`      ${JSON.stringify(text.slice(0, 150))}`)
    for (const error of [...new Set(errors)].slice(0, 3)) console.log(`      ${error}`)
  }
}
console.log(`\n${crashed} of ${ROUTES.length} routes break when reloaded offline`)
console.log(`${silent} of ${ROUTES.length} routes never tell the learner they are offline`)
const text = await visibleText()

if (errors.length) {
  console.log('\nerrors captured while offline:')
  for (const error of [...new Set(errors)].slice(0, 12)) console.log(`   ${error}`)
}

await page.screenshot({ path: '/tmp/offline-reload.png' })
await browser.close()
process.exitCode = crashed > 0 ? 1 : 0
