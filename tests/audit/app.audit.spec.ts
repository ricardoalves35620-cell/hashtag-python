import fs from 'node:fs'
import path from 'node:path'
import { test, expect, type BrowserContext, type Page, type TestInfo } from '@playwright/test'
import { ALL_PHASES } from '../../src/data/phases/index'
import { conciseAssessmentOption } from '../../src/lib/assessmentIntegrity'
import { auditTextsMatch } from '../../src/lib/auditText'

const phaseStart = Math.max(0, Number(process.env.HP_AUDIT_PHASE_START || 0))
const phaseCount = Math.max(1, Number(process.env.HP_AUDIT_PHASE_COUNT || 1))
const phaseIds = Array.from({ length: phaseCount }, (_, index) => phaseStart + index).filter(id => id <= 68)
const language = process.env.HP_AUDIT_LANG === 'en' ? 'en' : 'pt'
const theme = process.env.HP_AUDIT_THEME === 'light' ? 'light' : 'dark'
const auditEmail = process.env.AUDIT_USER_EMAIL?.trim()
const auditPassword = process.env.AUDIT_USER_PASSWORD?.trim()
const configuredBaseURL = (process.env.HP_AUDIT_BASE_URL || process.env.AUDIT_BASE_URL)?.trim()
const requireLogin = process.env.HP_AUDIT_REQUIRE_LOGIN !== 'false'
const cycleNumber = Math.max(1, Number(process.env.HP_AUDIT_CYCLE || 1))
const statusFile = process.env.HP_AUDIT_LIVE_STATUS

interface StepFailure {
  step: string
  message: string
}

function log(message: string) {
  console.log(`[auditor] ${message}`)
  if (statusFile) {
    fs.mkdirSync(path.dirname(statusFile), { recursive: true })
    fs.writeFileSync(statusFile, `${new Date().toISOString()}\nCycle ${cycleNumber}\n${message}\n`, 'utf8')
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function setAuditPreferences(page: Page) {
  await page.addInitScript(({ language, theme }) => {
    localStorage.setItem('hp_lang', language)
    localStorage.setItem('hp_theme', theme)
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

async function authenticate(page: Page, testInfo: TestInfo) {
  await setAuditPreferences(page)

  if (!auditEmail || !auditPassword) {
    if (requireLogin) throw new Error('Audit credentials were not received by Playwright. Check .env.audit.local.')
    throw new Error('Guest fallback is disabled for the deep quality auditor.')
  }

  log(`Opening login page for ${auditEmail}`)
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await assertExpectedOrigin(page)

  // An existing authenticated session redirects away from /login.
  if (!page.url().endsWith('/login')) {
    log('Existing authenticated session detected')
  } else {
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
      page.waitForURL(url => url.pathname !== '/login', { timeout: 25_000 }),
      loginError.waitFor({ state: 'visible', timeout: 25_000 }).then(async () => {
        const message = (await loginError.textContent())?.trim() || 'Unknown login error'
        throw new Error(`Audit login failed: ${message}`)
      }),
    ])
  }

  await page.evaluate(() => {
    localStorage.setItem('hp_onboarding_done', 'course')
    localStorage.removeItem('hp_guest_mode')
    localStorage.removeItem('hp_guest_transfer_pending')
    localStorage.removeItem('hp_guest_migrate_to')
    localStorage.removeItem('hp_onboarding_done_guest')
  })

  log('Verifying authenticated session on Profile')
  await page.goto('/profile', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/profile$/)
  await assertExpectedOrigin(page)

  const profileEmail = page.locator('input[type="email"]').first()
  await expect(profileEmail, 'Profile email did not render after login').toBeVisible({ timeout: 20_000 })
  await expect(profileEmail, 'Audit account session was not established').toHaveValue(auditEmail)
  await expect(page.getByText(/Perfil visitante|Visitor profile/i)).toHaveCount(0)

  await testInfo.attach('authenticated-session', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  })
  log(`Login confirmed: ${auditEmail}`)
}

async function assertAppMainVisible(page: Page) {
  const configurationError = page.getByText(/CONFIGURAÇÃO NECESSÁRIA|CONFIGURATION REQUIRED/i)
  if (await configurationError.count()) {
    throw new Error('The auditor opened an app build without valid Supabase configuration.')
  }
  await assertExpectedOrigin(page)
  await expect(page.locator('main#main-scroll'), 'The main learning area did not render').toBeVisible({ timeout: 20_000 })
}

async function assertNoHorizontalOverflow(page: Page) {
  const result = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(result.scrollWidth, `horizontal overflow: ${result.scrollWidth}px > ${result.clientWidth}px`).toBeLessThanOrEqual(result.clientWidth + 3)
}

async function assertCodeBlocksFit(page: Page) {
  const violations = await page.locator('pre, .cm-editor, [data-code-block], .hp-code-editor').evaluateAll(nodes => {
    const viewport = document.documentElement.clientWidth
    return nodes.map((node, index) => {
      const rect = node.getBoundingClientRect()
      return { index, left: rect.left, right: rect.right, width: rect.width, viewport }
    }).filter(item => item.left < -3 || item.right > item.viewport + 3)
  })
  expect(violations, `Code block clipping: ${JSON.stringify(violations)}`).toEqual([])
}

async function replaceEditorCode(page: Page, code: string) {
  const editor = page.locator('.cm-content[contenteditable="true"]').first()
  await expect(editor, 'Editable CodeMirror surface not found').toBeVisible({ timeout: 15_000 })
  await editor.click()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText(code)
}

async function readEditorCode(page: Page) {
  const editor = page.locator('.cm-content[contenteditable="true"]').first()
  await expect(editor).toBeVisible()
  return (await editor.innerText()).replace(/\u00a0/g, ' ')
}

async function visibleButtonByName(page: Page, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const buttons = page.getByRole('button', { name: pattern })
    const count = await buttons.count()
    for (let index = 0; index < count; index += 1) {
      const button = buttons.nth(index)
      if (await button.isVisible()) return button
    }
  }
  return null
}

async function clickFirstVisible(page: Page, patterns: RegExp[]) {
  const button = await visibleButtonByName(page, patterns)
  if (!button) throw new Error(`No visible button matched: ${patterns.map(item => item.source).join(' | ')}`)
  await button.click()
}

async function getExerciseRunButton(page: Page) {
  const stable = page.getByTestId('exercise-run-button').first()
  if (await stable.count() && await stable.isVisible()) return stable

  const fallback = await visibleButtonByName(page, [/Executar e validar|Run and validate/i])
  if (fallback) return fallback

  throw new Error('Exercise run button did not render')
}

async function runExerciseAndWait(page: Page) {
  const feedback = page.getByTestId('exercise-feedback')
  const output = page.getByTestId('exercise-output')
  const button = await getExerciseRunButton(page)

  await button.click()

  await expect.poll(async () => {
    const current = await getExerciseRunButton(page).catch(() => null)
    if (!current) return false
    const text = (await current.innerText()).trim()
    return (await current.isEnabled()) && /Executar e validar|Run and validate/i.test(text)
  }, {
    timeout: 75_000,
    message: 'Exercise execution did not finish or restore the run button',
  }).toBe(true)

  await expect.poll(async () => {
    const feedbackText = await feedback.innerText().catch(() => '')
    const outputVisible = await output.isVisible().catch(() => false)
    return feedbackText.trim().length > 0 || outputVisible
  }, {
    timeout: 10_000,
    message: 'Exercise finished but did not render fresh feedback',
  }).toBe(true)
}

async function findQuizOptionByOriginalIndex(page: Page, originalIndex: number) {
  const stable = page.locator(`[data-testid="quiz-option"][data-option-index="${originalIndex}"]`).first()
  if (await stable.count() && await stable.isVisible()) return stable

  throw new Error(`Quiz option with original index ${originalIndex} did not render`)
}

async function answerQuizCorrectly(page: Page, phaseId: number) {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  if (!phase || phase.quiz.length === 0) return

  log(`Phase ${phaseId}: answering ${phase.quiz.length} quiz questions`)
  for (let index = 0; index < phase.quiz.length; index += 1) {
    const question = page.getByTestId('quiz-question')
    await expect(question, 'Quiz question did not render').toBeVisible({ timeout: 12_000 })

    const questionId = await question.getAttribute('data-question-id')
    const currentQuestion = phase.quiz.find(item => item.id === questionId)
    if (!currentQuestion) {
      const questionText = await question.innerText()
      throw new Error(`Could not identify the current quiz question for phase ${phaseId}: id=${questionId || 'missing'} text=${questionText}`)
    }

    const expected = conciseAssessmentOption(currentQuestion.options[currentQuestion.correctIndex][language])
    const optionButton = await findQuizOptionByOriginalIndex(page, currentQuestion.correctIndex)
    await optionButton.click()

    const feedback = page.getByTestId('quiz-feedback')
    await expect(feedback, 'Quiz feedback did not render after selecting an option').toBeVisible({ timeout: 12_000 })
    await expect(feedback, `The auditor selected an incorrect option instead of: ${expected}`).toContainText(
      language === 'pt' ? /Correto!/i : /Correct!/i,
    )

    const next = page.getByTestId('quiz-next')
    if (await next.count() && await next.isVisible()) await next.click()
    else {
      await clickFirstVisible(page, [
        /Próxima questão|Next question/i,
        /Sua pontuação|Your score/i,
      ])
    }
  }

  await expect(page.getByText(/100%/).first(), 'Quiz did not finish with 100%').toBeVisible({ timeout: 15_000 })
}

async function safeStep(
  page: Page,
  testInfo: TestInfo,
  failures: StepFailure[],
  name: string,
  action: () => Promise<void>,
) {
  log(name)
  try {
    await test.step(name, action)
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error)
    failures.push({ step: name, message })
    console.error(`[auditor] STEP FAILED: ${name}\n${message}`)
    await testInfo.attach(`failure-${failures.length}-${name.replace(/[^a-z0-9]+/gi, '-').slice(0, 60)}`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    })
  }
}

async function scanSupportingRoute(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded' })
  await assertAppMainVisible(page)
  await assertNoHorizontalOverflow(page)
}

async function exerciseDiagnostics(page: Page, phaseId: number) {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  if (!phase || phase.exercises.length === 0) return

  await page.goto(`/phase/${phaseId}/exercises`, { waitUntil: 'domcontentloaded' })
  await assertAppMainVisible(page)
  await assertNoHorizontalOverflow(page)
  await assertCodeBlocksFit(page)

  const original = await readEditorCode(page)

  const hint = page.getByRole('button', { name: /Revelar primeira dica|Reveal first hint/i }).first()
  if (await hint.count()) {
    await hint.click()
    await expect(page.getByText(/Dica 1|Hint 1/i).first()).toBeVisible()
  }

  log(`Phase ${phaseId}: testing syntax-error feedback`)
  await replaceEditorCode(page, 'print(')
  await runExerciseAndWait(page)
  await expect(page.locator('main#main-scroll')).toContainText(/SyntaxError|erro de sintaxe|syntax/i)

  log(`Phase ${phaseId}: testing placeholder detection inside a comment`)
  await replaceEditorCode(page, '# ___ comentário legítimo do auditor\nprint("audit")')
  await runExerciseAndWait(page)
  const body = await page.locator('main#main-scroll').innerText()
  expect(body).not.toMatch(/lacuna.*não preenchida|unfilled placeholder/i)

  if (cycleNumber % 12 === 0) {
    log(`Phase ${phaseId}: testing infinite-loop timeout`)
    await replaceEditorCode(page, 'while True:\n    pass')
    await runExerciseAndWait(page)
    await expect.poll(async () => (await page.locator('main#main-scroll').innerText()), {
      timeout: 20_000,
      message: 'Timeout feedback was not rendered',
    }).toMatch(/tempo|timeout|time limit|loop infinito|infinite loop/i)
  }

  const draftMarker = `# hp-audit-draft-${phaseId}-${cycleNumber}`
  const markedDraft = `${draftMarker}\n${original}`
  await replaceEditorCode(page, markedDraft)

  const draftStatus = page.getByTestId('draft-status')
  await expect.poll(async () => {
    const text = await draftStatus.innerText().catch(() => '')
    return /Salvo|Saved/i.test(text)
  }, {
    timeout: 12_000,
    message: 'Exercise draft was not acknowledged as saved before reload',
  }).toBe(true)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await assertAppMainVisible(page)

  await expect.poll(async () => await readEditorCode(page), {
    timeout: 15_000,
    message: 'Exercise draft did not survive reload',
  }).toContain(draftMarker)

  // Restore the original draft so the audit account does not accumulate markers.
  await replaceEditorCode(page, original)
  await expect.poll(async () => {
    const text = await draftStatus.innerText().catch(() => '')
    return /Salvo|Saved/i.test(text)
  }, {
    timeout: 12_000,
    message: 'Exercise draft cleanup was not saved',
  }).toBe(true)
}

async function examDiagnostics(page: Page, phaseId: number) {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  if (!phase) return

  await page.goto(`/phase/${phaseId}/exam`, { waitUntil: 'domcontentloaded' })
  await assertAppMainVisible(page)
  await assertNoHorizontalOverflow(page)
  await clickFirstVisible(page, [/^Código$/i, /^Code$/i, /Começar a codificar|Start coding/i])

  const original = await readEditorCode(page)

  log(`Phase ${phaseId}: checking exam runtime error explanation`)
  await replaceEditorCode(page, 'print(undefined_audit_name)')
  await clickFirstVisible(page, [/Executar meu código|Run my code|^▶.*Executar|^▶.*Run/i])
  await expect.poll(async () => await page.locator('main#main-scroll').innerText(), {
    timeout: 60_000,
    message: 'Exam did not show runtime feedback',
  }).toMatch(/NameError|não existe|not defined|erro|error/i)

  await replaceEditorCode(page, original)
  log(`Phase ${phaseId}: submitting starter code to inspect pedagogical feedback`)
  await clickFirstVisible(page, [/Enviar para correção|Submit for grading/i])
  await expect.poll(async () => await page.locator('main#main-scroll').innerText(), {
    timeout: 60_000,
    message: 'Exam submission did not produce feedback',
  }).toMatch(/Resultados|Results|Verificação de estrutura|Structure check|Envio falhou|Submission failed|%/i)
}

async function globalRouteDiagnostics(page: Page) {
  const routes = ['/progress', '/roadmap', '/fasttrack', '/career', '/visualizer', '/project-lab', '/engineering-lab', '/ai-lab']
  const route = routes[(cycleNumber - 1) % routes.length]
  log(`Scanning supporting route ${route}`)
  await scanSupportingRoute(page, route)
}

async function sessionRecoveryDiagnostics(page: Page) {
  log('Checking authenticated session after reload')
  await page.goto('/profile', { waitUntil: 'domcontentloaded' })
  await page.reload({ waitUntil: 'domcontentloaded' })
  const profileEmail = page.locator('input[type="email"]').first()
  await expect(profileEmail).toHaveValue(auditEmail || '')
}

async function clearServiceWorkerNoise(context: BrowserContext) {
  // Keep service workers enabled because the app is a PWA, but grant no special permissions.
  await context.clearPermissions()
}

test.describe('Hashtag Python deep audit', () => {
  test('authenticated deep learning journey continues after individual failures', async ({ page, context }, testInfo) => {
    test.setTimeout(360_000)
    const failures: StepFailure[] = []
    const consoleErrors: string[] = []
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('pageerror', error => consoleErrors.push(error.message))

    await clearServiceWorkerNoise(context)
    await safeStep(page, testInfo, failures, 'Authenticate dedicated audit account', async () => authenticate(page, testInfo))

    for (const phaseId of phaseIds) {
      await safeStep(page, testInfo, failures, `Phase ${phaseId}: overview`, async () => {
        await page.goto(`/phase/${phaseId}`, { waitUntil: 'domcontentloaded' })
        await assertAppMainVisible(page)
        await assertNoHorizontalOverflow(page)
      })

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: complete lesson and inspect code blocks`, async () => {
        await page.goto(`/phase/${phaseId}/lesson`, { waitUntil: 'domcontentloaded' })
        await assertAppMainVisible(page)
        await assertNoHorizontalOverflow(page)
        await assertCodeBlocksFit(page)
        await page.locator('main#main-scroll').evaluate(node => { node.scrollTop = node.scrollHeight })
        const complete = page.getByRole('button', { name: /Concluir Aula|Complete Lesson/i }).first()
        await expect(complete).toBeVisible()
        await complete.click()
        await expect(page).toHaveURL(new RegExp(`/phase/${phaseId}/exercises`))
      })

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: exercise editor, errors, draft and layout`, async () => exerciseDiagnostics(page, phaseId))

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: shuffled quiz with correct answers`, async () => {
        await page.goto(`/phase/${phaseId}/quiz`, { waitUntil: 'domcontentloaded' })
        await assertAppMainVisible(page)
        await answerQuizCorrectly(page, phaseId)
      })

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: exam execution and pedagogical feedback`, async () => examDiagnostics(page, phaseId))
    }

    await safeStep(page, testInfo, failures, 'Supporting route and responsive shell', async () => globalRouteDiagnostics(page))
    await safeStep(page, testInfo, failures, 'Authenticated session recovery', async () => sessionRecoveryDiagnostics(page))
    await safeStep(page, testInfo, failures, 'No fatal browser errors', async () => {
      const fatal = consoleErrors.filter(message => !/favicon|ResizeObserver|supabase|network|Failed to fetch|AbortError/i.test(message))
      expect(fatal, fatal.join('\n')).toEqual([])
    })

    await testInfo.attach('deep-audit-summary', {
      body: Buffer.from(JSON.stringify({ cycleNumber, phaseIds, language, theme, failures }, null, 2)),
      contentType: 'application/json',
    })

    if (failures.length > 0) {
      throw new Error(`${failures.length} deep-audit step(s) failed:\n${failures.map(item => `- ${item.step}: ${item.message.split('\n')[0]}`).join('\n')}`)
    }
  })
})
