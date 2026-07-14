import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getMiniProjectForPhase, MINI_PROJECTS } from './data/miniProjects'

const root = fileURLToPath(new URL('.', import.meta.url))

function source(path: string) {
  return readFileSync(new URL(path, `file://${root}/`), 'utf8')
}

type Row = { split: 'TRAIN' | 'TEST'; id: string; amount: number; days: number; label: 0 | 1 }

function simulateRiskPipeline(inputs: string[]) {
  const train: Row[] = []
  const test: Row[] = []
  const output: string[] = []

  for (const raw of inputs) {
    if (raw.toUpperCase() === 'END') break
    const parts = raw.split('|').map(value => value.trim())
    const id = parts[1] || 'UNKNOWN'
    const amount = Number(parts[2])
    const days = Number(parts[3])
    const label = Number(parts[4])
    const split = parts[0]
    const valid = parts.length === 5
      && (split === 'TRAIN' || split === 'TEST')
      && Boolean(parts[1])
      && Number.isFinite(amount)
      && amount >= 0
      && Number.isFinite(days)
      && days >= 0
      && (label === 0 || label === 1)

    if (!valid) {
      output.push(`INVALID=${id}`)
      continue
    }

    const row: Row = { split, id, amount, days, label } as Row
    if (row.split === 'TRAIN') train.push(row)
    else test.push(row)
  }

  const labels = new Set(train.map(row => row.label))
  if (!labels.has(0) || !labels.has(1)) {
    output.push('MODEL_ERROR=need_both_labels')
    return output
  }

  const amountMin = Math.min(...train.map(row => row.amount))
  const amountMax = Math.max(...train.map(row => row.amount))
  const daysMin = Math.min(...train.map(row => row.days))
  const daysMax = Math.max(...train.map(row => row.days))
  const amountSpan = amountMax - amountMin || 1
  const daysSpan = daysMax - daysMin || 1
  const transform = (row: Row): [number, number] => [
    (row.amount - amountMin) / amountSpan,
    (row.days - daysMin) / daysSpan,
  ]
  const centroids = new Map<0 | 1, [number, number]>()

  for (const label of [0, 1] as const) {
    const vectors = train.filter(row => row.label === label).map(transform)
    centroids.set(label, [
      vectors.reduce((sum, vector) => sum + vector[0], 0) / vectors.length,
      vectors.reduce((sum, vector) => sum + vector[1], 0) / vectors.length,
    ])
  }

  let correct = 0
  let truePositive = 0
  let falsePositive = 0
  let falseNegative = 0

  for (const row of test) {
    const vector = transform(row)
    const distance = (centroid: [number, number]) => Math.hypot(vector[0] - centroid[0], vector[1] - centroid[1])
    const predicted: 0 | 1 = distance(centroids.get(0)!) <= distance(centroids.get(1)!) ? 0 : 1
    output.push(`PRED=${row.id}|${predicted}|${row.label}`)
    if (predicted === row.label) correct += 1
    if (predicted === 1 && row.label === 1) truePositive += 1
    if (predicted === 1 && row.label === 0) falsePositive += 1
    if (predicted === 0 && row.label === 1) falseNegative += 1
  }

  const total = test.length
  const accuracy = total ? correct / total : 0
  const precision = truePositive + falsePositive ? truePositive / (truePositive + falsePositive) : 0
  const recall = truePositive + falseNegative ? truePositive / (truePositive + falseNegative) : 0
  output.push(`METRICS=${correct}|${total}|${accuracy.toFixed(2)}|${precision.toFixed(2)}|${recall.toFixed(2)}`)
  return output
}

describe('Sprint 10.5 data and machine learning portfolio', () => {
  it('adds a data and ML integrator at the Phase 60 milestone', () => {
    const project = getMiniProjectForPhase(60)
    expect(project?.id).toBe('data-ml-risk-pipeline')
    expect(project?.tests).toHaveLength(4)
    expect(project?.requiredNodes).toEqual(expect.arrayContaining(['ClassDef', 'Try', 'While', 'AnnAssign', 'Raise']))
    expect(project?.requiredImports).toEqual(expect.arrayContaining(['dataclasses', 'math']))
    expect(project?.requiredFunctions).toEqual(expect.arrayContaining([
      'parse_record',
      'fit_scaler',
      'transform',
      'fit_centroids',
      'predict',
      'evaluate',
      'main',
    ]))
    expect(project?.requireMainGuard).toBe(true)
  })

  it('keeps every published data/ML input and output contract reproducible', () => {
    const project = getMiniProjectForPhase(60)
    expect(project).toBeDefined()
    for (const test of project!.tests) {
      expect(simulateRiskPipeline(test.inputs)).toEqual(test.expectedOutput)
    }
  })

  it('keeps portfolio IDs and milestone phases unique', () => {
    expect(new Set(MINI_PROJECTS.map(project => project.id)).size).toBe(MINI_PROJECTS.length)
    expect(new Set(MINI_PROJECTS.map(project => project.milestonePhaseId)).size).toBe(MINI_PROJECTS.length)
  })

  it('adds the fourth artifact without exposing locked course content', () => {
    const portfolio = source('pages/Portfolio.tsx')
    expect(portfolio).toContain("'data-ml-risk-pipeline'")
    expect(portfolio).toContain('project.milestonePhaseId === 53')
    expect(portfolio).toContain('t.dataMl')
    expect(portfolio).toContain("getPhaseStatus(progress, project.milestonePhaseId) !== 'locked'")
    expect(portfolio).not.toContain('unlockAll')
    expect(portfolio).not.toContain('ownerMode')
  })
})
