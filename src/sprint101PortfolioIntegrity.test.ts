import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { MINI_PROJECTS, getMiniProjectForPhase } from './data/miniProjects'

const root = fileURLToPath(new URL('.', import.meta.url))

function source(path: string) {
  return readFileSync(new URL(path, `file://${root}/`), 'utf8')
}

describe('Sprint 10.1 foundation portfolio', () => {
  it('adds a real integrator at the end of the foundation path', () => {
    const project = getMiniProjectForPhase(27)
    expect(project?.id).toBe('foundation-claim-desk')
    expect(project?.tests).toHaveLength(2)
    expect(project?.requiredNodes).toEqual(expect.arrayContaining(['FunctionDef', 'While', 'Try']))
    expect(project?.tests[0].expectedOutput).toContain('TOTAL=2000.00')
    expect(project?.tests[1].expectedOutput).toEqual(expect.arrayContaining(['INVALID_AMOUNT', 'DUPLICATE_ID']))
  })

  it('keeps project identifiers unique', () => {
    const ids = MINI_PROJECTS.map(project => project.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('exposes portfolio evidence without bypassing normal progression', () => {
    const portfolio = source('pages/Portfolio.tsx')
    expect(portfolio).toContain("'foundation-claim-desk'")
    expect(portfolio).toContain('progress.find(row => row.phase_id === project.milestonePhaseId)')
    expect(portfolio).toContain('{!examPassed ? (')
    expect(portfolio).toContain('!examPassed && canOpenPhase')
    expect(portfolio).toContain('navigate(`/phase/${project.milestonePhaseId}`)')
    expect(portfolio).not.toContain('unlockAll')
    expect(portfolio).not.toContain('admin')
  })

  it('exports a README containing planning, implementation and test evidence', () => {
    const portfolio = source('pages/Portfolio.tsx')
    expect(portfolio).toContain('buildReadme')
    expect(portfolio).toContain('progress.understanding.inputs')
    expect(portfolio).toContain('progress.pseudocode')
    expect(portfolio).toContain('progress.code')
    expect(portfolio).toContain('testEvidence(progress)')
  })

  it('registers the private portfolio route', () => {
    const app = source('App.tsx')
    expect(app).toContain("import Portfolio from './pages/Portfolio'")
    expect(app).toContain('path="/portfolio"')
    expect(app).toContain('<PrivateRoute><Portfolio /></PrivateRoute>')
  })
})
