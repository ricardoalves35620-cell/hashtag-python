import { test, expect, type Page } from '@playwright/test'

const phaseStart = Number(process.env.HP_AUDIT_PHASE_START || 0)
const phaseCount = Math.max(1, Number(process.env.HP_AUDIT_PHASE_COUNT || 2))
const phaseIds = Array.from({ length: phaseCount }, (_, index) => phaseStart + index).filter(id => id <= 68)
const language = process.env.HP_AUDIT_LANG === 'en' ? 'en' : 'pt'
const theme = process.env.HP_AUDIT_THEME === 'light' ? 'light' : 'dark'

async function enterAsGuest(page: Page) {
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('hp_guest_mode', 'true')
    localStorage.setItem('hp_lang', language)
    localStorage.setItem('hp_theme', theme)
    localStorage.setItem('hp_onboarding_done_guest', 'true')
  }, { language, theme })
  await page.goto('/')
  await page.waitForLoadState('networkidle').catch(() => undefined)
}

async function assertNoHorizontalOverflow(page: Page) {
  const result = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(result.scrollWidth, `horizontal overflow: ${result.scrollWidth}px > ${result.clientWidth}px`).toBeLessThanOrEqual(result.clientWidth + 2)
}

async function assertNoFatalConsole(page: Page, errors: string[]) {
  const fatal = errors.filter(message => !/favicon|ResizeObserver|supabase|network|Failed to fetch/i.test(message))
  expect(fatal, fatal.join('\n')).toEqual([])
}

test.describe('Hashtag Python audit', () => {
  test('core shell, language, theme and responsive layout', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('pageerror', error => consoleErrors.push(error.message))

    await enterAsGuest(page)
    await expect(page.locator('body')).toBeVisible()
    await assertNoHorizontalOverflow(page)
    await assertNoFatalConsole(page, consoleErrors)
  })

  for (const phaseId of phaseIds) {
    test(`phase ${phaseId}: overview and lesson render without clipping`, async ({ page }) => {
      const consoleErrors: string[] = []
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
      page.on('pageerror', error => consoleErrors.push(error.message))

      await enterAsGuest(page)
      await page.goto(`/phase/${phaseId}`)
      await page.waitForLoadState('networkidle').catch(() => undefined)
      await expect(page.locator('body')).toBeVisible()
      await assertNoHorizontalOverflow(page)

      await page.goto(`/phase/${phaseId}/lesson`)
      await page.waitForLoadState('networkidle').catch(() => undefined)
      await expect(page.locator('main, [role="main"], body')).toBeVisible()
      await assertNoHorizontalOverflow(page)

      const codeBlocks = page.locator('pre, .cm-editor, [data-code-block], code')
      if (await codeBlocks.count()) {
        const first = codeBlocks.first()
        await expect(first).toBeVisible()
      }
      await assertNoFatalConsole(page, consoleErrors)
    })
  }
})
