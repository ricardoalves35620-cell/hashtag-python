import { test, expect, type Page, type TestInfo } from '@playwright/test'

const phaseStart = Number(process.env.HP_AUDIT_PHASE_START || 0)
const phaseCount = Math.max(1, Number(process.env.HP_AUDIT_PHASE_COUNT || 2))
const phaseIds = Array.from({ length: phaseCount }, (_, index) => phaseStart + index).filter(id => id <= 68)
const language = process.env.HP_AUDIT_LANG === 'en' ? 'en' : 'pt'
const theme = process.env.HP_AUDIT_THEME === 'light' ? 'light' : 'dark'
const auditEmail = process.env.AUDIT_USER_EMAIL?.trim()
const auditPassword = process.env.AUDIT_USER_PASSWORD?.trim()
const configuredBaseURL = (process.env.HP_AUDIT_BASE_URL || process.env.AUDIT_BASE_URL)?.trim()
const requireLogin = process.env.HP_AUDIT_REQUIRE_LOGIN !== 'false'

function log(message: string) {
  console.log(`[auditor] ${message}`)
}

async function setAuditPreferences(page: Page) {
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('hp_lang', language)
    localStorage.setItem('hp_theme', theme)

    // A quality audit must never silently inherit visitor mode.
    localStorage.removeItem('hp_guest_mode')
    localStorage.removeItem('hp_guest_transfer_pending')
    localStorage.removeItem('hp_guest_migrate_to')
    localStorage.removeItem('hp_onboarding_done_guest')
  }, { language, theme })
}

async function assertExpectedOrigin(page: Page) {
  if (!configuredBaseURL) return
  const expectedOrigin = new URL(configuredBaseURL).origin
  const actualOrigin = new URL(page.url()).origin
  expect(actualOrigin, `Auditor navigated to ${actualOrigin}, expected ${expectedOrigin}`).toBe(expectedOrigin)
}

async function enterForAudit(page: Page, testInfo: TestInfo) {
  await test.step('Authenticate the dedicated audit account', async () => {
    await setAuditPreferences(page)

    if (!auditEmail || !auditPassword) {
      if (requireLogin) {
        throw new Error('Audit credentials were not received by Playwright. Check .env.audit.local and restart the auditor.')
      }
      throw new Error('Guest fallback is disabled for the quality auditor.')
    }

    log(`Opening login page for ${auditEmail}`)
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    await assertExpectedOrigin(page)

    const email = page.locator('input[type="email"]').first()
    const password = page.locator('input[type="password"]').first()
    const submit = page.locator('form button[type="submit"]').first()

    await expect(email, 'Audit login email field was not found').toBeVisible()
    await expect(password, 'Audit login password field was not found').toBeVisible()
    await expect(submit, 'Audit login submit button was not found').toBeEnabled()

    await email.fill(auditEmail)
    await password.fill(auditPassword)
    log('Submitting credentials')
    await submit.click()

    const loginError = page.locator('[role="alert"]').first()
    await Promise.race([
      page.waitForURL(url => url.pathname !== '/login', { timeout: 20_000 }),
      loginError.waitFor({ state: 'visible', timeout: 20_000 }).then(async () => {
        const message = (await loginError.textContent())?.trim() || 'Unknown login error'
        throw new Error(`Audit login failed: ${message}`)
      }),
    ])

    // Avoid the first-run redirect for the dedicated test account while keeping
    // the production onboarding flow untouched for real students.
    await page.evaluate(() => {
      localStorage.setItem('hp_onboarding_done', 'course')
      localStorage.removeItem('hp_guest_mode')
      localStorage.removeItem('hp_guest_transfer_pending')
      localStorage.removeItem('hp_guest_migrate_to')
      localStorage.removeItem('hp_onboarding_done_guest')
    })

    log('Verifying the authenticated session on Profile')
    await page.goto('/profile', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/profile$/)
    await assertExpectedOrigin(page)

    const profileEmail = page.locator('input[type="email"]').first()
    await expect(profileEmail, 'The profile email field did not render after login').toBeVisible({ timeout: 15_000 })
    await expect(profileEmail, 'The audit account session was not established').toHaveValue(auditEmail)
    await expect(page.getByText(/Perfil visitante|Visitor profile/i)).toHaveCount(0)

    await testInfo.attach('authenticated-session', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    })
    log(`Login confirmed: ${auditEmail}`)
  })
}

async function assertAppMainVisible(page: Page) {
  const configurationError = page.getByText(/CONFIGURAÇÃO NECESSÁRIA|CONFIGURATION REQUIRED/i)
  if (await configurationError.count()) {
    throw new Error('The auditor opened an app build without valid Supabase configuration. Check AUDIT_BASE_URL/HP_AUDIT_BASE_URL and the deployed environment.')
  }

  await assertExpectedOrigin(page)

  const main = page.locator('main#main-scroll')
  await expect(main, 'The main learning area did not render').toBeVisible({ timeout: 15_000 })
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
  test('dedicated audit account can sign in', async ({ page }, testInfo) => {
    await enterForAudit(page, testInfo)
    await assertAppMainVisible(page)
  })

  test('core shell, language, theme and responsive layout', async ({ page }, testInfo) => {
    const consoleErrors: string[] = []
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('pageerror', error => consoleErrors.push(error.message))

    await enterForAudit(page, testInfo)
    log('Checking the authenticated profile shell')
    await assertAppMainVisible(page)
    await assertNoHorizontalOverflow(page)
    await assertNoFatalConsole(page, consoleErrors)
  })

  for (const phaseId of phaseIds) {
    test(`phase ${phaseId}: overview and lesson render without clipping`, async ({ page }, testInfo) => {
      const consoleErrors: string[] = []
      page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
      page.on('pageerror', error => consoleErrors.push(error.message))

      await enterForAudit(page, testInfo)

      await test.step(`Open phase ${phaseId} overview`, async () => {
        log(`Opening phase ${phaseId} overview`)
        await page.goto(`/phase/${phaseId}`, { waitUntil: 'domcontentloaded' })
        await assertAppMainVisible(page)
        await assertNoHorizontalOverflow(page)
      })

      await test.step(`Open phase ${phaseId} lesson`, async () => {
        log(`Opening phase ${phaseId} lesson`)
        await page.goto(`/phase/${phaseId}/lesson`, { waitUntil: 'domcontentloaded' })
        await assertAppMainVisible(page)
        await assertNoHorizontalOverflow(page)

        const codeBlocks = page.locator('pre, .cm-editor, [data-code-block]')
        if (await codeBlocks.count()) {
          await expect(codeBlocks.first()).toBeVisible()
        }
      })

      await assertNoFatalConsole(page, consoleErrors)
    })
  }
})
