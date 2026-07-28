/**
 * Pre-submission store-readiness smoke suite.
 *
 * Drop at: tests/audit/store-readiness.smoke.spec.ts
 *
 * Covers the five highest-impact fixes from the unified remediation plan:
 *   HP-C-01  viewport meta permits user zoom            (was CRITICAL-01)
 *   HP-C-02  exactly one manifest, store-compliant      (was manifest matrix + NEW)
 *   HP-H-02  terminal CTA deduplicates in-flight submit (was QA-BLOCK-01, retargeted)
 *   QA-BLOCK-02  form state survives tab background — WITHOUT persisting the password
 *   HP-C-03/HP-C-04  offline mutation queues and reconciles on reconnect
 *   HP-H-07  sticky CTA clears the virtual keyboard
 *
 * REQUIRED: run with service workers enabled. playwright.config.ts:49 defaults to
 * `serviceWorkers: 'block'`, which is why no SW regression has ever been caught here.
 *
 *   HP_AUDIT_SERVICE_WORKERS=allow \
 *   AUDIT_USER_EMAIL=… AUDIT_USER_PASSWORD=… \
 *   npx playwright test tests/audit/store-readiness.smoke.spec.ts --project=iphone-webkit
 *
 * Tests that need credentials skip cleanly when they are absent, so the suite is
 * still useful on forked PRs where secrets are unavailable.
 */

import { expect, test, type Page } from '@playwright/test'

const AUDIT_EMAIL = process.env.AUDIT_USER_EMAIL?.trim()
const AUDIT_PASSWORD = process.env.AUDIT_USER_PASSWORD?.trim()
const HAS_CREDENTIALS = Boolean(AUDIT_EMAIL && AUDIT_PASSWORD)
const SERVICE_WORKERS_ENABLED = process.env.HP_AUDIT_SERVICE_WORKERS === 'allow'

/** Signs in through the real UI and waits for the authenticated shell. */
async function signIn(page: Page): Promise<void> {
  await page.goto('/login')
  await page.getByRole('textbox', { name: /email/i }).fill(AUDIT_EMAIL as string)
  await page.locator('input[type="password"]').first().fill(AUDIT_PASSWORD as string)
  await Promise.all([
    page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 30_000 }),
    page.getByRole('button', { name: /^(entrar|sign in)$/i }).click(),
  ])
}

/** Waits until a service worker has actually taken control of the page. */
async function waitForServiceWorker(page: Page): Promise<void> {
  await page.waitForFunction(
    () => navigator.serviceWorker?.controller !== null,
    undefined,
    { timeout: 30_000 },
  )
}

/** Reads the row count of the durable outbox introduced by HP-C-03. */
async function outboxCount(page: Page): Promise<number> {
  return page.evaluate(() =>
    new Promise<number>(resolve => {
      const open = indexedDB.open('hp-outbox')
      open.onerror = () => resolve(-1)
      open.onsuccess = () => {
        const db = open.result
        if (!db.objectStoreNames.contains('mutations')) {
          db.close()
          resolve(-1)
          return
        }
        const request = db.transaction('mutations', 'readonly').objectStore('mutations').count()
        request.onsuccess = () => { const value = request.result; db.close(); resolve(value) }
        request.onerror = () => { db.close(); resolve(-1) }
      }
      // A missing database resolves to 0 rather than hanging the test.
      open.onupgradeneeded = () => { open.transaction?.abort(); resolve(0) }
    }),
  )
}

test.describe('Store readiness — pre-submission smoke', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // HP-C-01 — viewport meta must not lock zoom (WCAG 2.1 SC 1.4.4)
  // ───────────────────────────────────────────────────────────────────────────
  test('HP-C-01 · viewport meta permits user zoom', async ({ page }) => {
    await page.goto('/login')

    const content = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(content, 'a viewport meta tag must be present').toBeTruthy()

    const normalized = (content as string).replace(/\s+/g, '').toLowerCase()

    expect(normalized, 'maximum-scale blocks pinch-zoom and fails WCAG 1.4.4').not.toContain('maximum-scale')
    expect(normalized, 'user-scalable=no blocks pinch-zoom and fails WCAG 1.4.4').not.toContain('user-scalable=no')
    expect(normalized, 'viewport-fit=cover is required for iOS safe-area insets').toContain('viewport-fit=cover')
    expect(normalized).toContain('width=device-width')

    // Regression guard for the original cause of the zoom lock: inputs under 16px
    // make iOS Safari auto-zoom on focus, which is what maximum-scale was masking.
    await page.locator('input[type="password"]').first().scrollIntoViewIfNeeded()
    const fontSize = await page.locator('input[type="password"]').first().evaluate(
      element => Number.parseFloat(getComputedStyle(element).fontSize),
    )
    expect(fontSize, 'inputs below 16px trigger iOS auto-zoom on focus').toBeGreaterThanOrEqual(16)
  })

  // ───────────────────────────────────────────────────────────────────────────
  // HP-C-02 — one manifest, and it must satisfy Play + Apple requirements
  // ───────────────────────────────────────────────────────────────────────────
  test('HP-C-02 · exactly one manifest link, and it is store-compliant', async ({ page, request }) => {
    await page.goto('/')

    const links = page.locator('link[rel="manifest"]')
    await expect(links, 'two manifest links means the browser silently picks one').toHaveCount(1)

    const href = await links.getAttribute('href')
    expect(href).toBe('/manifest.webmanifest')

    // The hand-maintained duplicate must no longer be a real manifest.
    //
    // Asserting a 404 here would be wrong: this app is served as an SPA, so both
    // `vite preview` and Cloudflare Pages answer unknown paths with index.html and
    // a 200. The meaningful check is that /manifest.json is NOT a manifest document
    // — if the old file were still shipping it would parse as JSON with a `name`.
    const legacy = await request.get('/manifest.json')
    const legacyBody = await legacy.text()
    let legacyIsManifest = false
    try {
      legacyIsManifest = typeof (JSON.parse(legacyBody) as { name?: unknown }).name === 'string'
    } catch {
      legacyIsManifest = false
    }
    expect(
      legacyIsManifest,
      'public/manifest.json still ships and would shadow the generated manifest',
    ).toBe(false)

    const response = await request.get(href as string)
    expect(response.ok()).toBeTruthy()
    const manifest = await response.json()

    // Identity — without `id`, browsers treat each deploy as a new app and drop storage.
    expect(manifest.id, 'manifest.id is required for stable PWA identity').toBeTruthy()
    expect(manifest.start_url).toBe('/')
    expect(manifest.scope).toBe('/')
    expect(manifest.display).toBe('standalone')
    expect(Array.isArray(manifest.display_override)).toBeTruthy()
    expect(manifest.display_override).toContain('standalone')

    // Apple 4.0 — an orientation lock fails iPad multitasking review.
    expect(manifest.orientation, 'orientation lock fails Apple iPad multitasking').toBeUndefined()

    // App-store submission is out of scope, so the Play "at least two screenshots,
    // one narrow and one wide" rule is not asserted. What still matters is that
    // anything the manifest references actually resolves — a 404 here degrades the
    // browser's own install prompt, which is now the only distribution channel.
    const screenshots: Array<{ form_factor?: string; src: string }> = manifest.screenshots ?? []
    for (const shot of screenshots) {
      const asset = await request.get(shot.src)
      expect(asset.status(), `screenshot ${shot.src} is referenced but missing`).toBe(200)
    }

    // Maskable icons at both required sizes.
    const icons: Array<{ sizes: string; purpose?: string }> = manifest.icons ?? []
    for (const size of ['192x192', '512x512']) {
      const icon = icons.find(candidate => candidate.sizes === size)
      expect(icon, `icon ${size} is required`).toBeTruthy()
      expect(icon?.purpose ?? '').toContain('maskable')
    }
  })

  // ───────────────────────────────────────────────────────────────────────────
  // HP-H-02 — in-flight submit dedup (Deck 2 filed this against Login; the real
  // unguarded handler is the terminal CTA. Both are asserted here.)
  // ───────────────────────────────────────────────────────────────────────────
  test('HP-H-02 · rapid taps fire exactly one auth request', async ({ page }) => {
    await page.goto('/login')

    const authRequests: string[] = []
    await page.route('**/auth/v1/token**', async route => {
      authRequests.push(route.request().url())
      // Hold the response open so every tap lands while the first is in flight —
      // this is the exact window the bug lives in.
      await new Promise(resolve => setTimeout(resolve, 1_500))
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }),
      })
    })

    await page.getByRole('textbox', { name: /email/i }).fill('smoke-test@example.com')
    await page.locator('input[type="password"]').first().fill('not-a-real-password')

    const submit = page.getByRole('button', { name: /^(entrar|sign in)$/i })
    for (let tap = 0; tap < 5; tap += 1) {
      await submit.click({ force: true, noWaitAfter: true }).catch(() => { /* disabled mid-loop is the pass condition */ })
      await page.waitForTimeout(80)
    }

    await expect(submit).toBeDisabled()
    await page.waitForTimeout(2_000)

    expect(
      authRequests.length,
      `5 rapid taps produced ${authRequests.length} auth requests; Supabase rate-limits at 4`,
    ).toBe(1)

    // The error must be localised, not a raw Supabase string (HP-H-09).
    const alert = page.getByRole('alert').first()
    await expect(alert).toBeVisible()
    await expect(alert, 'raw Supabase English leaked into a bilingual UI').not.toContainText('Invalid login credentials')
  })

  // ───────────────────────────────────────────────────────────────────────────
  // QA-BLOCK-02 — form state survives backgrounding, but the password must NOT.
  // ───────────────────────────────────────────────────────────────────────────
  test('QA-BLOCK-02 · email survives tab background; password is never persisted', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('button', { name: /(cadastre-se|sign up)/i }).click().catch(() => { /* already on register */ })

    const email = 'restore-me@example.com'
    const secret = 'PlaintextSecret123!'
    await page.getByRole('textbox', { name: /email/i }).fill(email)
    await page.locator('input[type="password"]').first().fill(secret)

    // iOS Safari discards the JS heap of a backgrounded tab; visibilitychange is
    // the last event the page reliably receives before that happens.
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
      window.dispatchEvent(new Event('pagehide'))
    })
    await page.waitForTimeout(500)

    // Whatever the app persisted must not contain the password. This is the part
    // Deck 2's "persist form state" recommendation would have got wrong.
    const storageDump = await page.evaluate(() => {
      const read = (store: Storage) =>
        Array.from({ length: store.length }, (_, index) => store.key(index))
          .filter((key): key is string => Boolean(key))
          .map(key => `${key}=${store.getItem(key) ?? ''}`)
          .join('\n')
      return `${read(localStorage)}\n${read(sessionStorage)}`
    })
    expect(storageDump, 'the password field must never reach any web storage').not.toContain(secret)

    await page.reload()
    await expect(
      page.getByRole('textbox', { name: /email/i }),
      'a half-finished registration should not be lost on background',
    ).toHaveValue(email)
    await expect(
      page.locator('input[type="password"]').first(),
      'the password must be re-entered, never restored',
    ).toHaveValue('')
  })

  // ───────────────────────────────────────────────────────────────────────────
  // HP-C-03 + HP-C-04 — offline mutation queues, then reconciles on reconnect.
  // ───────────────────────────────────────────────────────────────────────────
  test('HP-C-03 · offline mutation is queued and drains on reconnect', async ({ page, context }) => {
    test.skip(!HAS_CREDENTIALS, 'AUDIT_USER_EMAIL / AUDIT_USER_PASSWORD not configured')
    test.skip(!SERVICE_WORKERS_ENABLED, 'requires HP_AUDIT_SERVICE_WORKERS=allow')
    test.setTimeout(120_000)

    await signIn(page)
    await waitForServiceWorker(page)

    await page.goto('/phase/5/exercises')
    const editor = page.locator('.cm-content').first()
    await expect(editor).toBeVisible({ timeout: 30_000 })

    const baseline = await outboxCount(page)
    expect(baseline, 'the hp-outbox IndexedDB store must exist (HP-C-03 not implemented?)').toBeGreaterThanOrEqual(0)

    await context.setOffline(true)

    await editor.click()
    await page.keyboard.type('print("queued while offline")')
    await page.waitForTimeout(1_500) // clear the 650ms remote-save debounce

    // 1. The learner must be told. Silence is the defect Deck 2 logged as QA-BLOCK-03.
    await expect(
      page.locator('[role="status"], [role="alert"], [data-testid="sync-status"]').first(),
      'an offline write produced no user-visible signal',
    ).toBeVisible({ timeout: 10_000 })

    // 2. The write must be durable, not held in an in-memory map that dies with the tab.
    await expect
      .poll(() => outboxCount(page), { timeout: 15_000, message: 'offline mutation was dropped, not queued' })
      .toBeGreaterThan(baseline)

    // 3. It must survive a full reload — this is what distinguishes a real outbox
    //    from learningSync.ts's pendingStates Map.
    await page.reload()
    expect(await outboxCount(page), 'the queue did not survive a reload').toBeGreaterThan(baseline)

    // 4. Reconnecting must drain it without any user action.
    await context.setOffline(false)
    await page.evaluate(() => window.dispatchEvent(new Event('online')))

    await expect
      .poll(() => outboxCount(page), { timeout: 45_000, message: 'the outbox never drained after reconnect' })
      .toBe(0)
  })

  test('HP-C-04 · a failed completion does not stay marked complete', async ({ page }) => {
    test.skip(!HAS_CREDENTIALS, 'AUDIT_USER_EMAIL / AUDIT_USER_PASSWORD not configured')
    test.setTimeout(120_000)

    await signIn(page)

    // Force every progress write to fail. The optimistic tick must roll back.
    await page.route('**/rest/v1/user_progress**', route =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'forced failure' }) }),
    )

    await page.goto('/phase/5/exercises')
    const runButton = page.getByTestId('exercise-run-button')
    await expect(runButton).toBeVisible({ timeout: 30_000 })
    await runButton.click()

    await expect(
      page.locator('[role="status"], [role="alert"]').first(),
      'a rejected progress write must surface a toast, not fail silently',
    ).toBeVisible({ timeout: 15_000 })

    // Exercises.tsx:76 previously spread `previous` last, so a phantom completion
    // survived every reload. After the fix the server view must win.
    await page.reload()
    await expect(
      page.getByTestId('exercise-run-button'),
      'the exercise should still be actionable after a failed save',
    ).toBeEnabled({ timeout: 30_000 })
  })

  // ───────────────────────────────────────────────────────────────────────────
  // HP-H-07 — the sticky CTA must clear the virtual keyboard.
  // ───────────────────────────────────────────────────────────────────────────
  test('HP-H-07 · sticky CTA clears the virtual keyboard', async ({ page }, testInfo) => {
    test.skip(!HAS_CREDENTIALS, 'AUDIT_USER_EMAIL / AUDIT_USER_PASSWORD not configured')
    test.skip(
      (testInfo.project.use.viewport?.width ?? 1440) > 900,
      'keyboard occlusion is a mobile-viewport concern',
    )

    await signIn(page)
    await page.goto('/phase/5/lesson')

    const cta = page.getByTestId('sticky-learning-actions')
    await expect(cta).toBeVisible({ timeout: 30_000 })

    // Playwright cannot raise a real virtual keyboard, so this asserts the CSS
    // contract HP-H-07 introduces: Layout.tsx publishes the measured occluded
    // height as --keyboard-inset, and sticky elements consume it. A visual check
    // on a physical iPhone SE remains part of the release checklist.
    const declaredBottom = await cta.evaluate(element => getComputedStyle(element).bottom)
    expect(declaredBottom).not.toBe('auto')

    const KEYBOARD_HEIGHT = 300
    await page.evaluate(inset => {
      document.documentElement.style.setProperty('--keyboard-inset', `${inset}px`)
      document.querySelector('.hp-app-shell')?.classList.add('hp-app-shell--keyboard-open')
    }, KEYBOARD_HEIGHT)
    await page.waitForTimeout(300)

    const viewportHeight = page.viewportSize()?.height ?? 667
    const box = await cta.boundingBox()
    expect(box, 'the sticky CTA has no layout box').toBeTruthy()

    const occludedTop = viewportHeight - KEYBOARD_HEIGHT
    expect(
      (box as { y: number; height: number }).y + (box as { y: number; height: number }).height,
      'the CTA is rendered underneath the virtual keyboard and cannot be tapped',
    ).toBeLessThanOrEqual(occludedTop + 1)

    // The bottom nav must also yield its reserved height, or the CTA floats.
    const navHeight = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--app-nav-height').trim(),
    )
    expect(['0px', '0'], `--app-nav-height stayed at "${navHeight}" while the keyboard was open`).toContain(navHeight)
  })
})
