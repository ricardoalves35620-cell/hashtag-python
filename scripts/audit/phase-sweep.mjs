import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'

/**
 * Opens every screen of every phase and reports the ones that are broken.
 *
 * Every real bug found this week came from driving the app, not from reading it: the
 * {{file}} leak, the draft-loss chain, "Produces the required result" on a wrong answer,
 * Python not caching offline. The static audits found almost nothing by comparison.
 *
 * This is the cheap version of that: no solving, no grading — just open all 69 phases
 * × 4 screens and look for a page that crashed, rendered nothing, leaked a template
 * token, or lost its controls. It is the difference between "phase 34 is fine" and
 * "nobody has ever opened phase 34".
 *
 *   node scripts/audit/phase-sweep.mjs [--phases 0-27]
 */

const BASE = 'http://127.0.0.1:4173'
const arg = process.argv.indexOf('--phases')
const [from, to] = arg > -1 ? process.argv[arg + 1].split('-').map(Number) : [0, 68]

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await browser.newContext({ viewport: { width: 1000, height: 1100 }, locale: 'en-US' })
const page = await ctx.newPage()

const consoleErrors = []
page.on('pageerror', error => consoleErrors.push(String(error).slice(0, 200)))
page.on('console', message => {
  if (message.type() !== 'error') return
  const text = message.text()
  // A blocked request is this sandbox, not the app.
  if (/Failed to load resource|ERR_/.test(text)) return
  consoleErrors.push(text.slice(0, 200))
})

await page.goto(BASE, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1500)
await page.locator('.hp-guest-entry').click().catch(() => {})
await page.waitForTimeout(1500)

// Everything the shell renders on every route: nav, language toggle, skip link. Body
// text minus this is the page's own content.
const CHROME = /Skip to content|Course|Paths|FastTrack|Progress|Perfil|Perfil|Profile|\bEN\b|\bPT\b|Knowledge check · \d+% required|Question \d+ of \d+/g

const problems = []
const flag = (route, kind, detail) => problems.push({ route, kind, detail })

for (let phase = from; phase <= to; phase += 1) {
  for (const screen of ['lesson', 'exercises', 'quiz', 'exam']) {
    const route = `/phase/${phase}/${screen}`
    consoleErrors.length = 0
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' }).catch(() => {})
    await page.waitForTimeout(1400)

    const body = await page.locator('body').innerText().catch(() => '')

    // Redirected away entirely — usually a phase id that does not exist.
    if (!page.url().includes(`/phase/${phase}`)) { flag(route, 'redirected', page.url().replace(BASE, '')); continue }

    if (/Something went wrong|Algo deu errado|Unexpected Application Error/i.test(body)) {
      flag(route, 'error boundary', body.slice(0, 120).replace(/\n+/g, ' '))
      continue
    }
    // Measured against the actual chrome rather than a guessed character count. A
    // threshold of 220 flagged five perfectly good quiz screens whose questions were
    // simply short — the same cries-wolf failure this file's header warns about, made
    // by this file on its first run.
    const content = body.replace(CHROME, '').trim()
    if (content.length < 40) { flag(route, 'blank', `${content.length} chars of content`); continue }

    const braces = body.match(/\{\{[^}]{1,30}\}\}/g)
    if (braces) flag(route, 'template token on screen', [...new Set(braces)].join(' '))

    if (screen === 'exercises' && !(await page.getByTestId('exercise-run-button').count())) {
      flag(route, 'no Run button', 'the learner cannot run anything here')
    }
    // A quiz needs answerable options. Requiring a literal "?" flagged five valid
    // questions — "input() ALWAYS returns:" is a question without one.
    if (screen === 'quiz' && !/\bA\.|\b1\./.test(body)) {
      flag(route, 'quiz has no options', body.slice(0, 100).replace(/\n+/g, ' '))
    }

    if (consoleErrors.length) flag(route, 'console error', consoleErrors[0])
  }
  if (phase % 10 === 0) console.log(`  …phase ${phase}`)
}

console.log(`\nScreens checked: ${(to - from + 1) * 4}`)
console.log(`Problems: ${problems.length}\n`)
const byKind = problems.reduce((acc, p) => ({ ...acc, [p.kind]: (acc[p.kind] ?? 0) + 1 }), {})
for (const [kind, n] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${kind}`)
console.log()
for (const p of problems) console.log(`${p.route.padEnd(26)} ${p.kind.padEnd(26)} ${p.detail}`)

writeFileSync('/home/claude/phase-sweep.json', JSON.stringify(problems, null, 2))
await browser.close()
process.exitCode = problems.length ? 1 : 0
