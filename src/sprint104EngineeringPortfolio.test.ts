import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getMiniProjectForPhase, MINI_PROJECTS } from './data/miniProjects'

const root = fileURLToPath(new URL('.', import.meta.url))

function source(path: string) {
  return readFileSync(new URL(path, `file://${root}/`), 'utf8')
}

type Summary = { subtotal: number; tax: number; total: number }

function simulateOrderService(inputs: string[]) {
  const orders = new Map<string, Summary>()
  const output: string[] = []

  for (const raw of inputs) {
    if (raw.toUpperCase() === 'END') break
    const [orderId = 'UNKNOWN', quantityText = '', priceText = '', taxText = ''] = raw.split('|').map(value => value.trim())

    if (orders.has(orderId)) {
      output.push(`DUPLICATE=${orderId}`)
      continue
    }

    const quantity = Number(quantityText)
    const unitPrice = Number(priceText)
    const taxRate = Number(taxText)
    const valid = Boolean(orderId)
      && Number.isInteger(quantity)
      && quantity > 0
      && Number.isFinite(unitPrice)
      && unitPrice >= 0
      && Number.isFinite(taxRate)
      && taxRate >= 0

    if (!valid) {
      output.push(`INVALID=${orderId || 'UNKNOWN'}`)
      continue
    }

    const subtotal = Math.round(quantity * unitPrice * 100) / 100
    const tax = Math.round(subtotal * taxRate * 100) / 100
    const total = Math.round((subtotal + tax) * 100) / 100
    orders.set(orderId, { subtotal, tax, total })
    output.push(`ORDER=${orderId}|${subtotal.toFixed(2)}|${tax.toFixed(2)}|${total.toFixed(2)}`)
  }

  const grandTotal = [...orders.values()].reduce((sum, order) => sum + order.total, 0)
  output.push(`SUMMARY=${orders.size}|${grandTotal.toFixed(2)}`)
  output.push('BYE')
  return output
}

describe('Sprint 10.4 advanced engineering portfolio', () => {
  it('adds an engineering integrator at the Phase 53 milestone', () => {
    const project = getMiniProjectForPhase(53)
    expect(project?.id).toBe('engineering-order-service')
    expect(project?.tests).toHaveLength(3)
    expect(project?.requiredNodes).toEqual(expect.arrayContaining(['ClassDef', 'Try', 'While', 'AnnAssign', 'Raise']))
    expect(project?.requiredImports).toEqual(expect.arrayContaining(['dataclasses', 'logging', 'typing']))
    expect(project?.requiredFunctions).toEqual(expect.arrayContaining(['parse_order', 'calculate_totals', 'process_line', 'print_summary', 'main']))
    expect(project?.requiredCalls).toContain('logger.warning')
    expect(project?.requireMainGuard).toBe(true)
  })

  it('keeps all published input/output examples mathematically consistent', () => {
    const project = getMiniProjectForPhase(53)
    expect(project).toBeDefined()
    for (const test of project!.tests) {
      expect(simulateOrderService(test.inputs)).toEqual(test.expectedOutput)
    }
  })

  it('keeps portfolio IDs and milestone phases unique', () => {
    expect(new Set(MINI_PROJECTS.map(project => project.id)).size).toBe(MINI_PROJECTS.length)
    expect(new Set(MINI_PROJECTS.map(project => project.milestonePhaseId)).size).toBe(MINI_PROJECTS.length)
  })

  it('adds the third artifact without bypassing normal progression', () => {
    const portfolio = source('pages/Portfolio.tsx')
    expect(portfolio).toContain("'engineering-order-service'")
    expect(portfolio).toContain('project.milestonePhaseId === 39')
    expect(portfolio).toContain('t.engineering')
    expect(portfolio).toContain("getPhaseStatus(progress, project.milestonePhaseId) !== 'locked'")
    expect(portfolio).not.toContain('unlockAll')
    expect(portfolio).not.toContain('admin')
  })
})
