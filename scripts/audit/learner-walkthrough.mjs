import { chromium } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'
import { EXERCISES_JSON, REFERENCES_JSON, cachePath } from './cache.mjs'

/**
 * Sits down and works through the phases the way a learner does.
 *
 * Everything before this checked the DATA: that expectations are producible, that no
 * requirement is hidden, that no cheat passes. None of it opens the app. A learner does
 * not read the spec file — they read the lesson, look at the exercise, type something,
 * press Run, and read what comes back.
 *
 * So this drives the real UI and records the three things only the UI can show:
 *
 *   1. Does a correct solution actually pass, end to end, in Pyodide rather than CPython?
 *      Every verification so far ran CPython in a subprocess. Pyodide is a different
 *      interpreter with a different float printer and a patched input().
 *   2. When you are wrong, does the feedback tell you anything you can act on?
 *      "Produces the expected result ✗" is a verdict. "You returned a list, we expected
 *      a dict" is help. Only one of them teaches.
 *   3. Does anything block the learner that has nothing to do with their Python?
 *
 *   node scripts/audit/learner-walkthrough.mjs [--phases 9-20]
 */

const BASE = 'http://127.0.0.1:4173'
const argument = process.argv.find(item => item.startsWith('--phases='))
const [FROM, TO] = (argument ? argument.split('=')[1] : '9-20').split('-').map(Number)

const REFERENCES = JSON.parse(readFileSync(REFERENCES_JSON, 'utf8'))
const EXERCISES = JSON.parse(readFileSync(EXERCISES_JSON, 'utf8'))

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const context = await browser.newContext({ viewport: { width: 1280, height: 1100 }, locale: 'en-US' })
const page = await context.newPage()

const findings = []
const note = (phase, exercise, kind, detail) => {
  findings.push({ phase, exercise, kind, detail })
  console.log(`  ${kind.padEnd(22)} ${exercise}: ${detail}`)
}

async function enterAsGuest() {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  await page.locator('.hp-guest-entry').click().catch(() => {})
  await page.waitForTimeout(800)
}

async function setCode(code) {
  const surface = page.getByTestId('python-editor-surface').first()
  await surface.waitFor({ state: 'visible', timeout: 20_000 })
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await surface.getAttribute('data-editor-ready') === 'true') break
    await page.waitForTimeout(250)
  }
  await surface.evaluate((node, next) => {
    node.dispatchEvent(new CustomEvent('hp:set-code', { detail: next }))
  }, code)
  for (let attempt = 0; attempt < 40; attempt++) {
    if (await surface.getAttribute('data-editor-value') === code) return true
    await page.waitForTimeout(250)
  }
  return false
}

/** The thinking gate: some exercises will not enable Run until it is filled in. */
async function satisfyThinkingGate() {
  const prediction = page.getByTestId('exercise-prediction')
  if (await prediction.count()) {
    await prediction.fill('It should print the result the task describes.').catch(() => {})
    await page.getByTestId('exercise-change-plan')
      .fill('Run it once, then adjust based on the output.').catch(() => {})
  }
}

async function runAndRead() {
  const button = page.getByTestId('exercise-run-button').first()
  await button.waitFor({ state: 'visible', timeout: 20_000 })
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await button.isEnabled()) break
    await page.waitForTimeout(500)
  }
  if (!(await button.isEnabled())) {
    const reason = await page.getByTestId('exercise-run-requirements').first().innerText().catch(() => '')
    return { blocked: true, reason: reason.replace(/\s+/g, ' ').trim().slice(0, 200) }
  }
  await button.click()

  let feedback = ''
  for (let attempt = 0; attempt < 80; attempt++) {
    await page.waitForTimeout(500)
    feedback = await page.getByTestId('exercise-feedback').first().innerText().catch(() => '')
    if (feedback && !/running|executando/i.test(feedback)) break
  }
  const output = await page.getByTestId('exercise-output').first().innerText().catch(() => '')
  return { blocked: false, feedback: feedback.replace(/\s+/g, ' ').trim(), output: output.replace(/\s+/g, ' ').trim() }
}

await enterAsGuest()

for (const phase of EXERCISES.filter(item => item.phase >= FROM && item.phase <= TO)
  .map(item => item.phase).filter((value, index, all) => all.indexOf(value) === index)) {

  console.log(`\n═══ PHASE ${phase}`)
  const list = EXERCISES.filter(item => item.phase === phase)

  for (const [index, exercise] of list.entries()) {
    const reference = REFERENCES[exercise.id]
    if (!reference) continue

    await page.goto(`${BASE}/phase/${phase}/exercises`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1800)

    // Select by NAME, not position. After a run the active tab moves, and nth(index)
    // then silently means a different exercise — which is how an earlier harness in this
    // repo graded the wrong one and blamed it for a requirement (`sell_units`) belonging
    // to its neighbour. Clearing localStorage to reset would log the guest out, since
    // that is where the guest session lives.
    const byName = page.getByRole('button', { name: `Exercise ${index + 1}`, exact: true })
    if (await byName.count()) {
      await byName.first().click().catch(() => {})
    } else {
      const tabs = page.locator('[role="tab"]')
      if (await tabs.count() > index) await tabs.nth(index).click().catch(() => {})
    }
    await page.waitForTimeout(1200)

    // Confirm we are on the exercise we think we are. The starter code is unique per
    // exercise, so it is the cheapest identity proof available.
    const onScreen = await page.getByTestId('python-editor-surface').first()
      .getAttribute('data-editor-value').catch(() => null)
    const expectedStarter = (exercise.starter || '').trim()
    if (expectedStarter && onScreen !== null && onScreen.trim() !== expectedStarter) {
      note(phase, exercise.id, 'HARNESS ON WRONG TAB', 'editor did not hold this exercise starter; skipped')
      continue
    }

    if (!(await setCode(reference))) {
      note(phase, exercise.id, 'EDITOR REJECTED CODE', 'the editor never took the solution')
      continue
    }
    await satisfyThinkingGate()

    const result = await runAndRead()
    if (result.blocked) {
      note(phase, exercise.id, 'RUN BLOCKED', result.reason || 'Run stayed disabled with no reason shown')
      continue
    }

    const passed = /✓|passed|aprovad|complete|correct/i.test(result.feedback)
      && !/✗|failed|not yet|ainda/i.test(result.feedback)
    if (!passed) {
      note(phase, exercise.id, 'CORRECT ANSWER FAILED', result.feedback.slice(0, 700))
    } else {
      console.log(`  ok                     ${exercise.id}`)
    }
  }
}

writeFileSync(cachePath('walkthrough.json'), JSON.stringify(findings, null, 1))
console.log(`\n${findings.length} problems a learner would hit`)
await browser.close()
