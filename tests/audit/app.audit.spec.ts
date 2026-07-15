import fs from 'node:fs'
import path from 'node:path'
import { test, expect, type BrowserContext, type Page, type TestInfo } from '@playwright/test'
import { ALL_PHASES } from '../../src/data/phases/index'
import { conciseAssessmentOption } from '../../src/lib/assessmentIntegrity'
import { auditTextsMatch } from '../../src/lib/auditText'
import { getPedagogicalJourney } from '../../src/lib/pedagogicalJourney'

const phaseStart = Math.max(0, Number(process.env.HP_AUDIT_PHASE_START || 0))
const phaseCount = Math.max(1, Number(process.env.HP_AUDIT_PHASE_COUNT || 1))
const explicitPhaseIds = (process.env.HP_AUDIT_PHASE_IDS || '')
  .split(',')
  .map(value => Number(value.trim()))
  .filter(value => Number.isInteger(value) && value >= 0 && value <= 68)
const phaseIds = explicitPhaseIds.length > 0
  ? Array.from(new Set(explicitPhaseIds))
  : Array.from({ length: phaseCount }, (_, index) => phaseStart + index).filter(id => id <= 68)
const language = process.env.HP_AUDIT_LANG === 'en' ? 'en' : 'pt'
const theme = process.env.HP_AUDIT_THEME === 'light' ? 'light' : 'dark'
const requestedDepth = process.env.HP_AUDIT_DEPTH
const auditDepth: 'smoke' | 'standard' | 'deep' = requestedDepth === 'smoke' || requestedDepth === 'standard' ? requestedDepth : 'deep'
const auditMode = process.env.HP_AUDIT_MODE || 'full'
const authStorageState = process.env.HP_AUDIT_STORAGE_STATE?.trim()
const auditEmail = process.env.AUDIT_USER_EMAIL?.trim()
const auditPassword = process.env.AUDIT_USER_PASSWORD?.trim()
const configuredBaseURL = (process.env.HP_AUDIT_BASE_URL || process.env.AUDIT_BASE_URL)?.trim()
const requireLogin = process.env.HP_AUDIT_REQUIRE_LOGIN !== 'false'
const expectedAppVersion = process.env.HP_AUDIT_EXPECT_VERSION?.trim()
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

async function attachScreenshotSafely(page: Page, testInfo: TestInfo, name: string) {
  try {
    await testInfo.attach(name, {
      body: await page.screenshot({ fullPage: true, timeout: 15_000 }),
      contentType: 'image/png',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await testInfo.attach(`${name}-unavailable`, {
      body: Buffer.from(`Screenshot unavailable: ${message}`),
      contentType: 'text/plain',
    })
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

  log(`Checking reusable authenticated session for ${auditEmail}`)
  await page.goto('/profile', { waitUntil: 'domcontentloaded' })
  await assertExpectedOrigin(page)

  let profileEmail = page.locator('input[type="email"]').first()
  let sessionReady = false
  if (!page.url().endsWith('/login') && await profileEmail.count()) {
    sessionReady = await profileEmail.isVisible().catch(() => false)
      && (await profileEmail.inputValue().catch(() => '')) === auditEmail
  }

  if (!sessionReady) {
    log(`Opening login page for ${auditEmail}`)
    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    await assertExpectedOrigin(page)

    if (page.url().endsWith('/login')) {
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

    await page.goto('/profile', { waitUntil: 'domcontentloaded' })
    await assertExpectedOrigin(page)
    profileEmail = page.locator('input[type="email"]').first()
  } else {
    log('Reusable authenticated session detected')
  }

  await page.evaluate(() => {
    localStorage.setItem('hp_onboarding_done', 'course')
    localStorage.removeItem('hp_guest_mode')
    localStorage.removeItem('hp_guest_transfer_pending')
    localStorage.removeItem('hp_guest_migrate_to')
    localStorage.removeItem('hp_onboarding_done_guest')
  })

  await expect(page).toHaveURL(/\/profile$/)
  await expect(profileEmail, 'Profile email did not render after login').toBeVisible({ timeout: 20_000 })
  await expect(profileEmail, 'Audit account session was not established').toHaveValue(auditEmail)
  await expect(page.getByText(/Perfil visitante|Visitor profile/i)).toHaveCount(0)

  if (authStorageState) {
    fs.mkdirSync(path.dirname(authStorageState), { recursive: true })
    await page.context().storageState({ path: authStorageState })
  }

  if (expectedAppVersion) {
    const deployedVersion = await page.evaluate(() => document.documentElement.dataset.appVersion || '')
    expect(
      deployedVersion,
      `Deployed app version ${deployedVersion || 'missing'} does not match auditor source ${expectedAppVersion}. Wait for deployment before auditing.`,
    ).toBe(expectedAppVersion)
  }

  if (process.env.HP_AUDIT_DETAILED === 'true' || cycleNumber === 1) {
    await attachScreenshotSafely(page, testInfo, 'authenticated-session')
  }
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
  const surface = page.getByTestId('python-editor-surface').first()
  await expect(surface, 'Stable CodeMirror surface not found').toBeVisible({ timeout: 15_000 })
  await expect(surface, 'CodeMirror automation bridge did not become ready').toHaveAttribute('data-editor-ready', 'true')

  await surface.evaluate((node, nextCode) => {
    node.dispatchEvent(new CustomEvent('hp:set-code', { detail: nextCode }))
  }, code)

  await expect.poll(async () => await readEditorCode(page), {
    timeout: 12_000,
    message: 'CodeMirror did not apply the requested code',
  }).toBe(code)
}

async function readEditorCode(page: Page) {
  const surface = page.getByTestId('python-editor-surface').first()
  await expect(surface, 'Stable CodeMirror surface not found').toBeVisible()
  const value = await surface.getAttribute('data-editor-value')
  if (value === null) throw new Error('CodeMirror did not expose its deterministic editor value')
  return value
}

async function prepareExerciseThinking(page: Page) {
  const prediction = page.getByTestId('exercise-prediction')
  const changePlan = page.getByTestId('exercise-change-plan')

  await expect(prediction, 'Prediction field did not render for the guided first exercise').toBeVisible()
  await prediction.fill(language === 'pt'
    ? 'O código deve executar e mostrar o resultado planejado para este exercício.'
    : 'The code should run and display the result planned for this exercise.')
  await expect(changePlan, 'Change-plan field did not render for the guided first exercise').toBeVisible()
  await changePlan.fill(language === 'pt' ? 'Alterar uma linha após observar a primeira execução.' : 'Change one line after observing the first run.')

  const button = await getExerciseRunButton(page)
  await expect(button, 'Exercise Run remained disabled after the required thinking steps').toBeEnabled()
}

async function completeLessonJourney(page: Page, phaseId: number) {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  if (!phase) throw new Error(`Phase ${phaseId} was not found`)
  const journey = getPedagogicalJourney(phase)

  await page.goto(`/phase/${phaseId}/lesson`, { waitUntil: 'domcontentloaded' })
  await assertAppMainVisible(page)

  for (let unitIndex = 0; unitIndex < journey.length; unitIndex += 1) {
    await assertNoHorizontalOverflow(page)
    await assertCodeBlocksFit(page)

    const main = page.locator('main#main-scroll')
    await main.evaluate(node => { node.scrollTop = node.scrollHeight })
    const next = page.getByTestId('lesson-next')
    await expect(next, `Lesson action did not render for unit ${unitIndex + 1}/${journey.length}`).toBeVisible()

    if (unitIndex === journey.length - 1) {
      await next.click()
      await expect(page).toHaveURL(new RegExp(`/phase/${phaseId}/exercises`), { timeout: 20_000 })
      return
    }

    await next.click()
    await expect(page).toHaveURL(new RegExp(`/phase/${phaseId}/lesson\?unit=${unitIndex + 1}(?:&|$)`))
    await expect.poll(async () => await main.evaluate(node => node.scrollTop), {
      timeout: 5_000,
      message: `Lesson ${unitIndex + 2} did not return the main learning area to the top`,
    }).toBeLessThanOrEqual(120)
  }
}

async function inspectLessonEntry(page: Page, phaseId: number) {
  await page.goto(`/phase/${phaseId}/lesson`, { waitUntil: 'domcontentloaded' })
  await assertAppMainVisible(page)
  await assertNoHorizontalOverflow(page)
  await assertCodeBlocksFit(page)
  await expect(page.getByTestId('lesson-next'), 'Lesson action did not render in smoke mode').toBeVisible()
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

async function answerQuizCorrectly(page: Page, phaseId: number, maxQuestions?: number) {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  if (!phase || phase.quiz.length === 0) return

  const questionsToAnswer = Math.min(phase.quiz.length, maxQuestions || phase.quiz.length)
  log(`Phase ${phaseId}: answering ${questionsToAnswer}/${phase.quiz.length} quiz questions`)
  for (let index = 0; index < questionsToAnswer; index += 1) {
    const question = page.getByTestId('quiz-question')
    await expect(question, 'Quiz question did not render').toBeVisible({ timeout: 12_000 })

    const questionId = await question.getAttribute('data-question-id')
    const questionText = await question.innerText()
    const currentQuestion =
      phase.quiz.find(item => item.id === questionId) ||
      phase.quiz.find(item => auditTextsMatch(item.question[language], questionText))

    if (!currentQuestion) {
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

    if (index < questionsToAnswer - 1) {
      const next = page.getByTestId('quiz-next')
      if (await next.count() && await next.isVisible()) await next.click()
      else await clickFirstVisible(page, [/Próxima questão|Next question/i])
    }
  }

  if (questionsToAnswer === phase.quiz.length) {
    const finalAction = page.getByTestId('quiz-next')
    if (await finalAction.count() && await finalAction.isVisible()) await finalAction.click()
    await expect(page.getByText(/100%/).first(), 'Quiz did not finish with 100%').toBeVisible({ timeout: 15_000 })
  }
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
    await attachScreenshotSafely(
      page,
      testInfo,
      `failure-${failures.length}-${name.replace(/[^a-z0-9]+/gi, '-').slice(0, 60)}`,
    )
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

  await prepareExerciseThinking(page)
  const original = await readEditorCode(page)

  log(`Phase ${phaseId}: completing the required observation run`)
  await runExerciseAndWait(page)
  await expect(page.getByTestId('exercise-feedback')).toContainText(/Observação concluída|Observation complete/i)

  if (auditDepth === 'smoke') return

  const diagnosticVariant = (phaseId + cycleNumber) % 3
  const testSyntax = auditDepth === 'deep' || diagnosticVariant === 0
  const testPlaceholder = auditDepth === 'deep' || diagnosticVariant === 1
  const testDraft = auditDepth === 'deep' || diagnosticVariant === 2

  if (auditDepth === 'deep') {
    const hint = page.getByRole('button', { name: /Revelar primeira dica|Reveal first hint/i }).first()
    if (await hint.count()) {
      await hint.click()
      await expect(page.getByText(/Dica 1|Hint 1/i).first()).toBeVisible()
    }
  }

  if (testSyntax) {
    log(`Phase ${phaseId}: testing syntax-error feedback`)
    await replaceEditorCode(page, 'print(')
    await runExerciseAndWait(page)
    await expect(page.locator('main#main-scroll')).toContainText(/SyntaxError|erro de sintaxe|syntax/i)
  }

  if (testPlaceholder) {
    log(`Phase ${phaseId}: testing placeholder detection inside a comment`)
    await replaceEditorCode(page, '# ___ comentário legítimo do auditor\nprint("audit")')
    await runExerciseAndWait(page)
    const body = await page.locator('main#main-scroll').innerText()
    expect(body).not.toMatch(/lacuna.*não preenchida|unfilled placeholder/i)
  }

  if (auditDepth === 'deep' && cycleNumber % 12 === 0) {
    log(`Phase ${phaseId}: testing infinite-loop timeout`)
    await replaceEditorCode(page, 'while True:\n    pass')
    await runExerciseAndWait(page)
    await expect.poll(async () => (await page.locator('main#main-scroll').innerText()), {
      timeout: 20_000,
      message: 'Timeout feedback was not rendered',
    }).toMatch(/tempo|timeout|time limit|loop infinito|infinite loop/i)
  }

  if (testDraft) {
    const draftMarker = `# hp-audit-draft-${phaseId}-${cycleNumber}`
    const markedDraft = `${draftMarker}\n${original}`
    await replaceEditorCode(page, markedDraft)

    const draftStatus = page.getByTestId('draft-status')
    await expect.poll(async () => {
      const statusText = await draftStatus.innerText().catch(() => '')
      const localCopyContainsMarker = await page.evaluate(marker => {
        return Object.keys(localStorage)
          .filter(key => key.startsWith('hp_code_draft_v1:'))
          .some(key => localStorage.getItem(key)?.includes(marker))
      }, draftMarker)
      return /Salvo|Saved/i.test(statusText) && localCopyContainsMarker
    }, {
      timeout: 15_000,
      message: 'Exercise draft was not acknowledged and persisted locally before reload',
    }).toBe(true)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await assertAppMainVisible(page)

    await expect.poll(async () => await readEditorCode(page), {
      timeout: 20_000,
      message: 'Exercise draft did not survive reload',
    }).toContain(draftMarker)

    await replaceEditorCode(page, original)
    await expect.poll(async () => {
      const currentStatus = await page.getByTestId('draft-status').innerText().catch(() => '')
      const markerStillStored = await page.evaluate(marker => {
        return Object.keys(localStorage)
          .filter(key => key.startsWith('hp_code_draft_v1:'))
          .some(key => localStorage.getItem(key)?.includes(marker))
      }, draftMarker)
      return /Salvo|Saved/i.test(currentStatus) && !markerStillStored
    }, {
      timeout: 15_000,
      message: 'Exercise draft cleanup was not persisted',
    }).toBe(true)
  } else {
    await replaceEditorCode(page, original)
  }
}

async function examDiagnostics(page: Page, phaseId: number) {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  if (!phase) return

  await page.goto(`/phase/${phaseId}/exam`, { waitUntil: 'domcontentloaded' })
  await assertAppMainVisible(page)
  await assertNoHorizontalOverflow(page)
  await clickFirstVisible(page, [/^Código$/i, /^Code$/i, /Começar a codificar|Start coding/i])

  const original = await readEditorCode(page)
  if (auditDepth === 'smoke') return

  log(`Phase ${phaseId}: checking exam runtime error explanation`)
  await replaceEditorCode(page, 'print(undefined_audit_name)')
  await clickFirstVisible(page, [/Executar meu código|Run my code|^▶.*Executar|^▶.*Run/i])
  await expect.poll(async () => await page.locator('main#main-scroll').innerText(), {
    timeout: 60_000,
    message: 'Exam did not show runtime feedback',
  }).toMatch(/NameError|não existe|not defined|erro|error/i)

  await replaceEditorCode(page, original)
  if (auditDepth !== 'deep') return

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
  // Deterministic audits block service workers in Playwright config.
  await context.clearPermissions()
}

test.describe('Hashtag Python adaptive audit', () => {
  test('authenticated learning journey continues after individual failures', async ({ page, context }, testInfo) => {
    const perPhaseBudget = auditDepth === 'smoke' ? 90_000 : auditDepth === 'standard' ? 210_000 : 360_000
    test.setTimeout(Math.max(600_000, 180_000 + phaseIds.length * perPhaseBudget))
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

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: lesson journey and code layout`, async () => {
        if (auditDepth === 'smoke') await inspectLessonEntry(page, phaseId)
        else await completeLessonJourney(page, phaseId)
      })

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: exercise ${auditDepth} diagnostics`, async () => exerciseDiagnostics(page, phaseId))

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: shuffled quiz integrity`, async () => {
        await page.goto(`/phase/${phaseId}/quiz`, { waitUntil: 'domcontentloaded' })
        await assertAppMainVisible(page)
        await answerQuizCorrectly(page, phaseId, auditDepth === 'smoke' ? 1 : undefined)
      })

      await safeStep(page, testInfo, failures, `Phase ${phaseId}: exam ${auditDepth} diagnostics`, async () => examDiagnostics(page, phaseId))
    }

    await safeStep(page, testInfo, failures, 'Supporting route and responsive shell', async () => globalRouteDiagnostics(page))
    await safeStep(page, testInfo, failures, 'Authenticated session recovery', async () => sessionRecoveryDiagnostics(page))
    await safeStep(page, testInfo, failures, 'No fatal browser errors', async () => {
      const fatal = consoleErrors.filter(message => !/favicon|ResizeObserver|supabase|network|Failed to fetch|AbortError/i.test(message))
      expect(fatal, fatal.join('\n')).toEqual([])
    })

    await testInfo.attach('deep-audit-summary', {
      body: Buffer.from(JSON.stringify({ cycleNumber, phaseIds, language, theme, depth: auditDepth, mode: auditMode, failures }, null, 2)),
      contentType: 'application/json',
    })

    if (failures.length > 0) {
      throw new Error(`${failures.length} audit step(s) failed:\n${failures.map(item => `- ${item.step}: ${item.message.split('\n')[0]}`).join('\n')}`)
    }
  })
})
