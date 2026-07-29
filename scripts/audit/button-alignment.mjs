import { chromium } from '@playwright/test'

/**
 * Finds action rows whose buttons do not line up.
 *
 * The reported case: the exercise screen put three children into a two-column grid, so
 * Run landed in the narrow right column and Reset wrapped onto a second row at full
 * width. Two actions, two different widths, two different rows.
 *
 * That shape cannot be found by reading the JSX — a grid with three children is legal
 * and usually intentional. It has to be measured after layout, which is what this does:
 * for every element that directly contains two or more buttons, it reads their rendered
 * boxes and flags a group that wraps onto multiple rows with unequal widths.
 *
 * Deliberately NOT flagged:
 *   toolbars and chip rows      many small buttons wrapping is the design
 *   groups that wrap evenly     equal widths across rows is a grid doing its job
 *   single-row groups           whatever their widths, they are aligned
 *
 *   node scripts/audit/button-alignment.mjs
 */

const BASE = 'http://127.0.0.1:4173'
const ROUTES = [
  '/', '/base-zero', '/progress', '/profile', '/review', '/roadmap', '/career',
  '/fasttrack', '/portfolio', '/diagnostic', '/engineering-lab', '/ai-lab',
  '/project-lab', '/phase/1', '/phase/1/lesson', '/phase/1/exercises', '/phase/1/quiz',
  '/phase/9/exercises', '/phase/9/exam', '/phase/17/exercises', '/phase/20/exercises',
]

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, locale: 'pt-BR' })
const page = await context.newPage()

await page.goto(BASE, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1500)
const email = page.getByRole('textbox', { name: /email/i })
if (await email.count()) {
  await email.fill(process.env.AUDIT_USER_EMAIL || 'teste@hashtagpython.com')
  await page.locator('input[type="password"]').first().fill(process.env.AUDIT_USER_PASSWORD || 'testehashtagpython')
  await page.getByRole('button', { name: /^(entrar|sign in)$/i }).click().catch(() => {})
  await page.waitForTimeout(4000)
}

let flagged = 0
for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {})
  await page.waitForTimeout(2200)

  const problems = await page.evaluate(() => {
    const found = []
    const parents = new Set()
    for (const button of document.querySelectorAll('button')) {
      if (button.parentElement) parents.add(button.parentElement)
    }
    for (const parent of parents) {
      const buttons = [...parent.children].filter(child => child.tagName === 'BUTTON')
      if (buttons.length < 2 || buttons.length > 4) continue        // toolbars wrap by design

      const boxes = buttons.map(button => {
        const rect = button.getBoundingClientRect()
        return { top: Math.round(rect.top), width: Math.round(rect.width), label: (button.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 28) }
      }).filter(box => box.width > 0)
      if (boxes.length < 2) continue

      const rows = new Set(boxes.map(box => box.top))
      if (rows.size === 1) continue                                  // one row: aligned

      const widths = [...new Set(boxes.map(box => box.width))]
      const spread = Math.max(...widths) - Math.min(...widths)
      if (spread <= 4) continue                                      // wraps evenly

      found.push({
        rows: rows.size,
        spread,
        buttons: boxes.map(box => `${box.label || '(icon)'}=${box.width}px@y${box.top}`),
      })
    }
    return found
  })

  for (const problem of problems) {
    console.log(`${route}`)
    console.log(`   ${problem.rows} rows, widths differ by ${problem.spread}px`)
    console.log(`   ${problem.buttons.join('  |  ')}`)
    flagged++
  }
}

console.log(`\n${flagged} action rows wrap onto multiple rows with unequal widths`)
await browser.close()
process.exitCode = flagged ? 1 : 0
