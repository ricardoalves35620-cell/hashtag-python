import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['tests/audit/**', 'node_modules/**', 'dist/**', 'playwright-report/**'],
  },
})
