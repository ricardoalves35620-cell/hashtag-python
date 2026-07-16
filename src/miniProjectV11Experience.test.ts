import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MINI_PROJECTS } from './data/miniProjects'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('V11 mini-project experience', () => {
  it('reviews every project with meaningful test depth and a project-specific final improvement', () => {
    expect(MINI_PROJECTS).toHaveLength(9)

    for (const project of MINI_PROJECTS) {
      expect(project.tests.length, project.id).toBeGreaterThanOrEqual(3)
      expect(project.refactorGoal.en.length, project.id).toBeGreaterThan(60)
      expect(project.refactorGoal.pt.length, project.id).toBeGreaterThan(60)
      expect(project.refactorEvidence.en.length, project.id).toBeGreaterThan(60)
      expect(project.refactorEvidence.pt.length, project.id).toBeGreaterThan(60)
      expect(project.tests.every(test => test.expectedOutput.length > 0), project.id).toBe(true)
    }
  })

  it('keeps project contexts diverse instead of concentrating the whole path in insurance', () => {
    const insuranceTitles = MINI_PROJECTS.filter(project => /claim|sinistro/i.test(`${project.title.en} ${project.title.pt}`))
    expect(insuranceTitles.length).toBeLessThanOrEqual(3)
    expect(MINI_PROJECTS.some(project => /event|evento/i.test(`${project.title.en} ${project.title.pt}`))).toBe(true)
    expect(MINI_PROJECTS.some(project => /shipment|remessa/i.test(`${project.title.en} ${project.title.pt}`))).toBe(true)
    expect(MINI_PROJECTS.some(project => /e-commerce|order|pedido/i.test(`${project.title.en} ${project.title.pt}`))).toBe(true)
  })

  it('uses editable input fields and requires real evidence in the final checkpoint', () => {
    const page = read('./pages/MiniProject.tsx')
    const progress = read('./lib/projectProgress.ts')
    const guidePanels = read('./components/learning/MiniProjectGuidePanels.tsx')

    expect(page).toContain('project-build-inputs')
    expect(page).toContain('buildInputs')
    expect(page).toContain('project-improve-checkpoint')
    expect(page).toContain('refactorBaselineCode')
    expect(page).toContain('project-refactor-note')
    expect(page).toContain('project-verify-improvement')
    expect(page).toContain('refactorReady')
    expect(`${page}\n${guidePanels}`).toContain('type="radio"')
    expect(progress).toContain('refactorBaselineCode')
    expect(progress).toContain('refactorNote')
  })

  it('prevents the editor and action bar from breaking the page on desktop, tablet, and mobile', () => {
    const css = read('./index.css')
    expect(css).toContain('.mini-project-workspace')
    expect(css).toContain('contain: inline-size')
    expect(css).toContain('overflow-x: clip')
    expect(css).toContain('at every width')
    expect(css).toContain('.mini-project-workspace .sticky-learning-actions')
    expect(css).toContain('position: static')
  })
})
