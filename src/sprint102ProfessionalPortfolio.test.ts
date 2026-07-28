import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getMiniProjectForPhase, MINI_PROJECTS } from './data/miniProjects'

const root = fileURLToPath(new URL('.', import.meta.url))

function source(path: string) {
  return readFileSync(new URL(path, `file://${root}/`), 'utf8')
}

function simulateTriage(inputs: string[]) {
  const orders = new Map<string, { amount: number; priority: 'STANDARD' | 'ESCALATE' }>()
  const output: string[] = []

  for (const raw of inputs) {
    if (raw.toUpperCase() === 'END') break
    const [orderId = 'UNKNOWN', amountText = '', severityText = ''] = raw.split('|')

    if (orders.has(orderId)) {
      output.push(`DUPLICATE=${orderId}`)
      continue
    }

    const amount = Number(amountText)
    const severity = Number(severityText)
    if (!orderId || !Number.isFinite(amount) || amount <= 0 || !Number.isInteger(severity) || severity < 1 || severity > 10) {
      output.push(`INVALID=${orderId || 'UNKNOWN'}`)
      continue
    }

    const priority = severity >= 8 || amount >= 10_000 ? 'ESCALATE' : 'STANDARD'
    orders.set(orderId, { amount, priority })
    output.push(`ORDER=${orderId}|${priority}|${amount.toFixed(2)}`)
  }

  const values = [...orders.values()]
  const total = values.reduce((sum, order) => sum + order.amount, 0)
  const escalated = values.filter(order => order.priority === 'ESCALATE').length
  output.push(`SUMMARY=${values.length}|${total.toFixed(2)}|${escalated}`)
  return output
}

describe('Sprint 10.2 professional portfolio', () => {
  it('adds a professional integrator at Phase 39', () => {
    const project = getMiniProjectForPhase(39)
    expect(project?.id).toBe('professional-claims-triage')
    expect(project?.tests).toHaveLength(3)
    expect(project?.requiredNodes).toEqual(expect.arrayContaining(['ClassDef', 'Try', 'While', 'AnnAssign']))
    expect(project?.requiredImports).toEqual(expect.arrayContaining(['dataclasses', 'logging']))
    expect(project?.requiredFunctions).toEqual(expect.arrayContaining(['parse_order', 'process_line', 'print_summary', 'main']))
    expect(project?.requiredCalls).toEqual(expect.arrayContaining(['logger.warning']))
    expect(project?.requireMainGuard).toBe(true)
  })

  it('keeps every published test contract consistent with the business rules', () => {
    const project = getMiniProjectForPhase(39)
    expect(project).toBeDefined()
    for (const test of project!.tests) {
      expect(simulateTriage(test.inputs)).toEqual(test.expectedOutput)
    }
  })

  it('keeps milestone project IDs and phase assignments unique', () => {
    const ids = MINI_PROJECTS.map(project => project.id)
    const milestones = MINI_PROJECTS.map(project => project.milestonePhaseId)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(milestones).size).toBe(milestones.length)
  })

  it('supports structural requirements beyond AST node names', () => {
    const miniProjectPage = source('pages/MiniProject.tsx')
    expect(miniProjectPage).toContain('project.requiredImports')
    expect(miniProjectPage).toContain('project.requiredFunctions')
    expect(miniProjectPage).toContain('project.requiredCalls')
    expect(miniProjectPage).toContain('project.requireMainGuard')
    expect(miniProjectPage).toContain('structurePass')
  })

  it('shows the professional artifact only after normal progression reaches its milestone', () => {
    const portfolio = source('pages/Portfolio.tsx')
    const portfolioModel = source('lib/portfolio.ts')
    expect(portfolioModel).toContain("'professional-claims-triage'")
    expect(portfolio).toContain("getPhaseStatus(progress, project.milestonePhaseId) !== 'locked'")
    expect(portfolio).toContain("project.milestonePhaseId === 27")
    expect(portfolio).not.toContain('unlockAll')
    expect(portfolio).not.toContain('admin')
  })

  it('prevents a locked portfolio card from navigating directly to a future phase', () => {
    const portfolio = source('pages/Portfolio.tsx')
    expect(portfolio).toContain('!examPassed && canOpenPhase')
    expect(portfolio).toContain('navigate(`/phase/${project.milestonePhaseId}`)')
  })
})
