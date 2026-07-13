import { defineConfig, devices } from '@playwright/test'

const externalBaseURL = process.env.HP_AUDIT_BASE_URL?.trim()

export default defineConfig({
  testDir: './tests/audit',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['html', { outputFolder: 'playwright-report/html', open: 'never' }],
  ],
  use: {
    baseURL: externalBaseURL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
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
