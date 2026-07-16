import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('Sprint 10.3 audit and learning-flow stabilization', () => {
  it('exposes a deterministic CodeMirror value to automation', () => {
    const editor = read('./components/VSCodeEditor.tsx')
    const audit = read('../tests/audit/app.audit.spec.ts')
    expect(editor).toContain('data-editor-value')
    expect(editor).toContain('container.dataset.editorValue = nextValue')
    expect(audit).toContain("getAttribute('data-editor-value')")
    expect(audit).not.toContain("innerText()).replace(/\\u00a0/g")
  })

  it('explains exactly how to unlock the guided exercise run', () => {
    const exercises = read('./pages/Exercises.tsx')
    expect(exercises).toContain('exercise-run-requirements')
    expect(exercises).toContain('exercise-prediction')
    expect(exercises).toContain('exercise-change-plan')
    expect(exercises).toContain('Prediction and change plan completed')
    expect(exercises).toContain('Previsão e plano preenchidos')
  })

  it('teaches the multiple-test checkpoint with numbered actions and a recovery path', () => {
    const project = read('./pages/MiniProject.tsx')
    expect(project).toContain('project-test-checkpoint')
    expect(project).toContain('Valores digitados no input(), na ordem')
    expect(project).toContain('Why try more than one example?')
    expect(project).toContain('Por que tentar mais de um exemplo?')
    expect(project).toContain("openCheckpoint('build')")
  })

  it('keeps fixed actions above navigation and hides navigation cleanly for the virtual keyboard', () => {
    const css = read('./index.css')
    expect(css).toContain('bottom: calc(var(--app-nav-height) + max(var(--safe-bottom), .5rem))')
    expect(css).toContain('.hp-app-shell--keyboard-open .hp-main__content')
    expect(css).not.toContain('.hp-app-shell--keyboard-open .hp-main-scroll')
    expect(css).toContain('--desktop-rail-width: 104px')
  })

  it('creates a compact report by stripping repeated screenshots and local paths', () => {
    const slim = read('../scripts/audit/create-slim-report.mjs')
    expect(slim).toContain('representativeCycles')
    expect(slim).toContain('Screenshot body removed from non-representative cycle')
    expect(slim).toContain('Local artifact path is not portable')
    expect(slim).toContain('slim-manifest.json')
  })
})
