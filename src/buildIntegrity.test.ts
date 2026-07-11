import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('deployment integrity', () => {
  it('keeps the npm lockfile on the public registry', () => {
    const lock = readFileSync('package-lock.json', 'utf8')
    expect(lock).not.toContain('internal.api.openai.org')
    expect(lock).not.toContain('applied-caas-gateway')
    expect(lock).toContain('https://registry.npmjs.org/')
  })

  it('ships the isolated Python worker', () => {
    const worker = readFileSync('public/python.worker.js', 'utf8')
    expect(worker).toContain('self.onmessage')
    expect(worker).toContain('student_code.py')
  })

  it('forces npm to use the public registry', () => {
    expect(readFileSync('.npmrc', 'utf8').trim()).toBe('registry=https://registry.npmjs.org/')
  })
})
