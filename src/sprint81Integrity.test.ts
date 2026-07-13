import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('sprint 8.1 continuous quality gate', () => {
  it('publishes build provenance for production audit checks', () => {
    const vite = readFileSync('vite.config.ts', 'utf8')
    const main = readFileSync('src/main.tsx', 'utf8')
    const audit = readFileSync('tests/audit/app.audit.spec.ts', 'utf8')
    expect(vite).toContain('__APP_VERSION__')
    expect(main).toContain('dataset.appVersion')
    expect(audit).toContain('HP_AUDIT_EXPECT_VERSION')
  })

  it('uses deterministic editor and draft persistence checks', () => {
    const editor = readFileSync('src/components/VSCodeEditor.tsx', 'utf8')
    const audit = readFileSync('tests/audit/app.audit.spec.ts', 'utf8')
    expect(editor).toContain("addEventListener('hp:set-code'")
    expect(editor).toContain('data-testid="python-editor-surface"')
    expect(audit).toContain("dispatchEvent(new CustomEvent('hp:set-code'")
    expect(audit).toContain("key.startsWith('hp_code_draft_v1:')")
  })

  it('keeps CI and nightly audits in version control', () => {
    const quality = readFileSync('.github/workflows/quality-gate.yml', 'utf8')
    const nightly = readFileSync('.github/workflows/nightly-deep-audit.yml', 'utf8')
    expect(quality).toContain('npm run typecheck')
    expect(nightly).toContain('npm run audit:autopilot')
    expect(nightly).toContain('npm run audit:state')
    expect(nightly).toContain('actions/upload-artifact@v6')
  })

  it('exports compact reports and source archives by default', () => {
    const runner = readFileSync('run-auditor.ps1', 'utf8')
    const packager = readFileSync('package-project.ps1', 'utf8')
    expect(runner).toContain('hashtag-python-audit-slim')
    expect(runner).toContain('[switch]$DetailedReport')
    expect(packager).toContain('git archive')
  })
})
