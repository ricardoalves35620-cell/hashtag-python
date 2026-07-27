import { test, expect, type Page } from '@playwright/test'

/**
 * Regression cover for the reset-progress flow.
 *
 * The bug this exists to catch: the Profile "Reset progress" button was wired
 * straight to a local-only wipe, so the confirmation modal was unreachable and
 * the cloud delete never ran. A test that opened the modal directly would have
 * passed. This one starts where the user starts — the Profile page.
 *
 * By default the spec stops short of actually deleting anything. It verifies the
 * modal is reachable and the typed guard works, which is what regressed. Set
 * HP_RESET_DESTRUCTIVE=true to run the full delete, and only ever point that at a
 * throwaway account.
 */

const language = process.env.HP_AUDIT_LANG === 'en' ? 'en' : 'pt'
const theme = process.env.HP_AUDIT_THEME === 'light' ? 'light' : 'dark'
const auditEmail = process.env.AUDIT_USER_EMAIL?.trim()
const auditPassword = process.env.AUDIT_USER_PASSWORD?.trim()
const destructive = process.env.HP_RESET_DESTRUCTIVE === 'true'

const confirmWord = language === 'pt' ? 'RESETAR' : 'RESET'
const confirmButtonName = /Apagar progresso e recome|Delete progress and start over/i
const cancelButtonName = /Manter meu progresso|Keep my progress/i

async function signIn(page: Page) {
  if (!auditEmail || !auditPassword) {
    throw new Error('Set AUDIT_USER_EMAIL and AUDIT_USER_PASSWORD before running this spec.')
  }

  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('hp_lang', language)
    localStorage.setItem('hp_theme', theme)
    localStorage.setItem('hp_onboarding_done', 'course')
    localStorage.removeItem('hp_guest_mode')
  }, { language, theme })

  // Go to /login first and decide from the DOM, not the URL. The app redirects
  // unauthenticated users client-side once Supabase resolves the session, so
  // checking page.url() right after a goto races that redirect.
  await page.goto('/login', { waitUntil: 'domcontentloaded' })

  const password = page.locator('input[type="password"]').first()
  const needsLogin = await password.isVisible({ timeout: 15_000 }).catch(() => false)

  if (needsLogin) {
    await page.locator('input[type="email"]').first().fill(auditEmail)
    await password.fill(auditPassword)
    await page.locator('form button[type="submit"]').first().click()

    const loginError = page.locator('[role="alert"]').first()
    await Promise.race([
      page.waitForURL(url => !url.pathname.endsWith('/login'), { timeout: 25_000 }),
      loginError.waitFor({ state: 'visible', timeout: 25_000 }).then(async () => {
        throw new Error(`Login failed: ${(await loginError.textContent())?.trim() || 'unknown error'}`)
      }),
    ])
  }

  await page.goto('/profile', { waitUntil: 'domcontentloaded' })

  await expect(
    page.locator('input[type="email"]').first(),
    'Session was not established on the profile page',
  ).toHaveValue(auditEmail, { timeout: 20_000 })
}

test.describe('Reset learning progress', () => {
  test('the reset button opens the confirmation modal', async ({ page }) => {
    await signIn(page)

    const openButton = page.getByTestId('reset-progress-open')
    await expect(openButton, 'Reset button is missing from the profile page').toBeVisible()

    // Regression assertion: the modal must not already be on screen, and the
    // button must be what brings it up. This is the exact failure mode of the bug.
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await openButton.click()
    await expect(page.getByRole('dialog'), 'Reset button did not open the confirmation modal').toBeVisible()
    await expect(page.getByTestId('reset-progress-confirmation')).toBeVisible()
  })

  test('the confirm button stays disabled until the guard word is typed', async ({ page }) => {
    await signIn(page)
    await page.getByTestId('reset-progress-open').click()

    const dialog = page.getByRole('dialog')
    const input = page.getByTestId('reset-progress-confirmation')
    const confirm = dialog.getByRole('button', { name: confirmButtonName })

    await expect(confirm, 'Confirm was enabled with an empty input').toBeDisabled()

    await input.fill('nope')
    await expect(confirm, 'Confirm was enabled with the wrong word').toBeDisabled()

    await input.fill(confirmWord.toLowerCase())
    await expect(confirm, 'The guard should be case-insensitive').toBeEnabled()

    await input.fill(confirmWord)
    await expect(confirm).toBeEnabled()
  })

  test('cancelling leaves progress untouched', async ({ page }) => {
    await signIn(page)
    await page.getByTestId('reset-progress-open').click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: cancelButtonName }).click()

    await expect(dialog).toHaveCount(0)
    await expect(page).toHaveURL(/\/profile$/)
  })

  test('confirming resets progress and returns to phase 0', async ({ page }) => {
    test.skip(!destructive, 'Destructive run disabled. Set HP_RESET_DESTRUCTIVE=true on a throwaway account.')

    await signIn(page)
    await page.getByTestId('reset-progress-open').click()

    const dialog = page.getByRole('dialog')
    await page.getByTestId('reset-progress-confirmation').fill(confirmWord)
    await dialog.getByRole('button', { name: confirmButtonName }).click()

    // A failure here surfaces as an inline error rather than a navigation —
    // most likely a missing RLS delete policy on one of the progress tables.
    await expect(page.locator('[role="alert"]'), 'Reset reported an error').toHaveCount(0)
    await page.waitForURL(/\/phase\/0/, { timeout: 30_000 })

    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(
      page.getByText('🔒').first(),
      'Phase 0 should never render as locked after a reset',
    ).toHaveCount(0)
  })
})
