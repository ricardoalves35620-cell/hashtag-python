import { test, expect, type Page } from '@playwright/test'

const phaseStart = Number(process.env.HP_AUDIT_PHASE_START || 0)
const phaseCount = Math.max(1, Number(process.env.HP_AUDIT_PHASE_COUNT || 2))
const phaseIds = Array.from({ length: phaseCount }, (_, index) => phaseStart + index).filter(id => id <= 68)
const language = process.env.HP_AUDIT_LANG === 'en' ? 'en' : 'pt'
const theme = process.env.HP_AUDIT_THEME === 'light' ? 'light' : 'dark'
const auditEmail = process.env.AUDIT_USER_EMAIL?.trim()
const auditPassword = process.env.AUDIT_USER_PASSWORD?.trim()
const configuredBaseURL = (process.env.HP_AUDIT_BASE_URL || process.env.AUDIT_BASE_URL)?.trim()

async function setAuditPreferences(page: Page) {
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('hp_lang', language)
    localStorage.setItem('hp_theme', theme)
  }, { language, theme })
}

async function enterForAudit(page: Page) {
  await setAuditPreferences(page)

  if (auditEmail && auditPassword) {
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')

    const email = page.locator('input[type="email"]').first()
    const password = page.locator('input[type="password"]').first()
    await expect(email, 'Audit login email field was not found').toBeVisible()
    await expect(password, 'Audit login password field was not found').toBeVisible()
    await email.fill(auditEmail)
    await password.fill(auditPassword)
    await page.locator('form button[type="submit"]').first().click()
    await page.waitForFunction(() => window.location.pathname !== '/login', undefined, { timeout: 20_000 })
    await page.waitForLoadState('networkidle').catch(() => undefined)
    return
  }

  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('hp_guest_mode', 'true')
    localStorage.setItem('hp_lang', language)
    localStorage.setItem('hp_theme', theme)
    localStorage.setItem('hp_onboarding_done_guest', 'true')
  }, { language, theme })
  await page.goto('/')
  await page.waitForLoadState('networkidle').catch(() => undefined)
}

async function assertAppMainVisible(page: Page) {
  const configurationError = page.getByText(/CONFIGURAÇÃO NECESSÁRIA|CONFIGURATION REQUIRED/i)
  if (await configurationError.count()) {
    throw new Error('The auditor opened an app build without valid Supabase configuration. Check AUDIT_BASE_URL/HP_AUDIT_BASE_URL and the deployed environment.')
  }

  if (configuredBaseURL) {
    const expectedOrigin = new URL(configuredBaseURL).origin
    const actualOrigin = new URL(page.url()).origin
    expect(actualOrigin, `Auditor navigated to ${actualOrigin}, expected ${expectedOrigin}`).toBe(expectedOrigin)
  }

  const main = page.locator('main#main-scroll')
  await expect(main, 'The main learning area did not render').toBeVisible()
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

    await enterForAudit(page)
    await assertAppMainVisible(page)
    await assertNoHorizontalOverflow(page)
    await assertNoFatalConsole(page, consoleErrors)
  })

  for (const phaseId of phaseIds) {
    test(`phase ${phaseId}: overview and lesson render without clipping`, async ({ page }) => {
      const consoleErrors: string[] = []
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
      page.on('pageerror', error => consoleErrors.push(error.message))

      await enterForAudit(page)
      await page.goto(`/phase/${phaseId}`)
      await page.waitForLoadState('networkidle').catch(() => undefined)
      await assertAppMainVisible(page)
      await assertNoHorizontalOverflow(page)

      await page.goto(`/phase/${phaseId}/lesson`)
      await page.waitForLoadState('networkidle').catch(() => undefined)
      await assertAppMainVisible(page)
      await assertNoHorizontalOverflow(page)

      const codeBlocks = page.locator('pre, .cm-editor, [data-code-block]')
      if (await codeBlocks.count()) {
        await expect(codeBlocks.first()).toBeVisible()
      }
      await assertNoFatalConsole(page, consoleErrors)
    })
  }
})
