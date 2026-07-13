import { defineConfig, devices } from '@playwright/test'

const externalBaseURL = (process.env.HP_AUDIT_BASE_URL || process.env.AUDIT_BASE_URL)?.trim()
const resultsOutput = process.env.HP_AUDIT_RESULTS_OUTPUT || 'playwright-report/results.json'
const htmlOutput = process.env.HP_AUDIT_HTML_OUTPUT || 'playwright-report/html'
const artifactsOutput = process.env.HP_AUDIT_ARTIFACTS_OUTPUT || 'test-results'
const headed = process.env.HP_AUDIT_HEADED === 'true'
const slowMo = Math.max(0, Number(process.env.HP_AUDIT_SLOW_MO || 0))

export default defineConfig({
  testDir: './tests/audit',
  outputDir: artifactsOutput,
  timeout: 360_000,
  expect: { timeout: 12_000 },
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: resultsOutput }],
    ['html', { outputFolder: htmlOutput, open: 'never' }],
  ],
  use: {
    baseURL: externalBaseURL || 'http://127.0.0.1:4173',
    headless: !headed,
    launchOptions: slowMo > 0 ? { slowMo } : undefined,
    trace: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 35_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'pt-BR',
  },
  webServer: externalBaseURL ? undefined : {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'iphone-chromium', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'tablet-chromium', use: { ...devices['iPad (gen 7)'], browserName: 'chromium' } },
  ],
})
