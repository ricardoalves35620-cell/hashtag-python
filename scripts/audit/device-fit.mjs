import { chromium } from '@playwright/test'

/**
 * Does the app fit the device it is on?
 *
 * Reported from an iPhone: the bottom menu floated well above the bottom of the screen,
 * with page content visible in the gap underneath it. The cause was the home-indicator
 * inset being applied OUTSIDE the bar —
 *
 *   .hp-bottom-nav { bottom: 0; padding-bottom: max(var(--safe-bottom), 8px) }
 *
 * so the fixed wrapper reached the screen edge but its visible bar stopped 34px short,
 * and the page scrolled through the transparent strip. The inset belongs inside the bar:
 * the background covers the indicator, the labels sit above it.
 *
 * The second half of the same bug was quieter. `--app-nav-height` was the constant 76px
 * while the bar really occupied 66px + 34px, so every page reserved 24px less room than
 * the nav takes and the nav covered the last lines of the code editor.
 *
 * Chromium has no home indicator, so the inset is injected the way iOS reports it. That
 * tests the layout arithmetic, which is where the defect was — it cannot test WebKit.
 *
 *   npm run audit:device-fit
 */

const BASE = process.env.HP_BASE || 'http://127.0.0.1:4173'

const DEVICES = [
  { name: 'iPhone 15 Pro Max', width: 430, height: 932, inset: 34 },
  { name: 'iPhone 15',         width: 393, height: 852, inset: 34 },
  { name: 'iPhone 13 mini',    width: 375, height: 812, inset: 34 },
  { name: 'iPhone SE',         width: 375, height: 667, inset: 0 },
  { name: 'iPad mini',         width: 744, height: 1133, inset: 20 },
  { name: 'phone landscape',   width: 852, height: 393, inset: 21 },
]

const ROUTES = ['/', '/roadmap', '/progress', '/profile', '/phase/8/exercises']

const problems = []
const browser = await chromium.launch({
  executablePath: process.env.HP_CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

for (const device of DEVICES) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: 3, isMobile: true, hasTouch: true,
  })
  const page = await context.newPage()

  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  await page.locator('.hp-guest-entry').click().catch(() => {})
  await page.waitForTimeout(1500)
  if (page.url().includes('/onboarding')) {
    await page.locator('button').first().click().catch(() => {})
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: /Build my starting path|Montar meu caminho/i }).click().catch(() => {})
    await page.waitForTimeout(2000)
  }

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {})
    await page.waitForTimeout(1400)
    await page.addStyleTag({ content: `:root { --safe-bottom: ${device.inset}px; }` })
    await page.waitForTimeout(300)

    const measured = await page.evaluate(() => {
      const inner = document.querySelector('.hp-bottom-nav__inner')
      const label = document.querySelector('.hp-bottom-nav__label')
      const content = document.querySelector('.hp-main__content')
      if (!inner || !content) return null
      const bar = inner.getBoundingClientRect()
      const styles = getComputedStyle(content)
      return {
        viewportHeight: window.innerHeight,
        barBottom: Math.round(bar.bottom),
        barTop: Math.round(bar.top),
        labelBottom: label ? Math.round(label.getBoundingClientRect().bottom) : null,
        reserved: Math.round(parseFloat(styles.paddingBottom)),
      }
    })
    if (!measured) continue

    const where = `${device.name} ${route}`
    const strip = measured.viewportHeight - measured.barBottom
    if (strip > 1) {
      problems.push(`${where}: ${strip}px of screen below the menu bar — it does not reach the bottom`)
    }
    // The labels must clear the home indicator, or the gesture area sits on top of them.
    if (measured.labelBottom !== null) {
      const clearance = measured.viewportHeight - measured.labelBottom
      if (clearance < device.inset) {
        problems.push(`${where}: labels clear the home indicator by ${clearance}px, need ${device.inset}px`)
      }
    }
    // And the page must reserve at least the room the bar occupies, or the bar covers the
    // last thing on the page — which is the Run button on an exercise.
    const occupied = measured.viewportHeight - measured.barTop
    if (measured.reserved < occupied) {
      problems.push(`${where}: page reserves ${measured.reserved}px but the menu occupies ${occupied}px`)
    }
  }

  await context.close()
}

await browser.close()

for (const problem of problems) console.log(`  ${problem}`)
console.log(problems.length
  ? `\n${problems.length} layout problems across ${DEVICES.length} device sizes`
  : `the menu reaches the bottom edge and clears the home indicator on all ${DEVICES.length} device sizes`)
process.exitCode = problems.length ? 1 : 0
