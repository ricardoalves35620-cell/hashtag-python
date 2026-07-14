import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getMiniProjectForPhase, MINI_PROJECTS } from './data/miniProjects'
import { createEmptyLearningState, applyLearningAttempt } from './lib/learningEngine'
import { chooseNewestLearningState } from './lib/learningSync'

const root = fileURLToPath(new URL('.', import.meta.url))
const source = (path: string) => readFileSync(new URL(path, `file://${root}/`), 'utf8')

type Vector = [number, number]

function simulateAttention(inputs: string[]) {
  const embeddings = new Map<string, Vector>()
  let queryToken = ''
  const documents: Array<{ id: string; tokens: string[] }> = []
  const output: string[] = []

  for (const line of inputs) {
    if (line.toUpperCase() === 'END') break
    const [kind, ...parts] = line.split('|')
    if (kind === 'EMBED' && parts.length === 3) {
      const x = Number(parts[1])
      const y = Number(parts[2])
      if (parts[0] && Number.isFinite(x) && Number.isFinite(y)) embeddings.set(parts[0], [x, y])
      else output.push('INVALID_RECORD')
    } else if (kind === 'QUERY' && parts.length === 1) {
      queryToken = parts[0]
    } else if (kind === 'DOC' && parts.length === 2) {
      documents.push({ id: parts[0], tokens: parts[1].split(/\s+/).filter(Boolean) })
    } else {
      output.push('INVALID_RECORD')
    }
  }

  const query = embeddings.get(queryToken)
  if (!query) return [...output, 'MODEL_ERROR=unknown_query']

  const ranked: Array<[number, string]> = []
  for (const document of documents) {
    const known = document.tokens.filter(token => embeddings.has(token))
    if (!known.length) {
      output.push(`INVALID_DOC=${document.id}`)
      continue
    }
    const scores = known.map(token => {
      const vector = embeddings.get(token)!
      return query[0] * vector[0] + query[1] * vector[1]
    })
    const max = Math.max(...scores)
    const exponentials = scores.map(score => Math.exp(score - max))
    const total = exponentials.reduce((sum, value) => sum + value, 0)
    const weights = exponentials.map(value => value / total)
    const context: Vector = [0, 0]
    known.forEach((token, index) => {
      const vector = embeddings.get(token)!
      context[0] += weights[index] * vector[0]
      context[1] += weights[index] * vector[1]
    })
    const relevance = query[0] * context[0] + query[1] * context[1]
    const topIndex = weights.indexOf(Math.max(...weights))
    output.push(`ATTN=${document.id}|${known[topIndex]}|${weights[topIndex].toFixed(2)}|${relevance.toFixed(2)}`)
    ranked.push([relevance, document.id])
  }

  if (ranked.length) {
    ranked.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]))
    output.push(`BEST=${ranked[0][1]}`)
  }
  return output
}

describe('Sprint 10.6 neural portfolio and cross-device synchronization', () => {
  it('adds a neural/Transformer integrator at Phase 64', () => {
    const project = getMiniProjectForPhase(64)
    expect(project?.id).toBe('transformer-attention-inspector')
    expect(project?.tests).toHaveLength(3)
    expect(project?.requiredImports).toEqual(expect.arrayContaining(['dataclasses', 'math']))
    expect(project?.requiredFunctions).toEqual(expect.arrayContaining(['dot', 'softmax', 'attend', 'main']))
    expect(project?.requiredCalls).toContain('math.exp')
    expect(project?.requireMainGuard).toBe(true)
  })

  it('keeps every attention input/output contract reproducible', () => {
    const project = getMiniProjectForPhase(64)!
    for (const test of project.tests) expect(simulateAttention(test.inputs)).toEqual(test.expectedOutput)
  })

  it('merges learning attempts from separate devices instead of choosing one whole snapshot', () => {
    const deviceA = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 1, activity: 'exercise', itemId: 'a', score: 100, passed: true, skillIds: ['syntax-basics'],
    }, 100)
    const deviceB = applyLearningAttempt(createEmptyLearningState(), {
      phaseId: 2, activity: 'quiz', itemId: 'b', score: 80, passed: true, skillIds: ['variables'],
    }, 200)
    const merged = chooseNewestLearningState(deviceA, deviceB)
    expect(merged.attempts.map(attempt => attempt.itemId)).toEqual(['a', 'b'])
    expect(Object.keys(merged.skills)).toEqual(expect.arrayContaining(['syntax-basics', 'variables']))
  })

  it('adds realtime and journey synchronization without an owner unlock mode', () => {
    const appContext = source('contexts/AppContext.tsx')
    const lesson = source('pages/Lesson.tsx')
    const projectProgress = source('lib/projectProgress.ts')
    const sql = readFileSync(new URL('../supabase/cross-device-sync-v2.sql', import.meta.url), 'utf8')
    const portfolio = source('pages/Portfolio.tsx')

    expect(appContext).toContain("table: 'learning_states'")
    expect(appContext).toContain('syncLearningStateNow')
    expect(lesson).toContain('hydrateJourneyProgress')
    expect(lesson).toContain('fetchJournalEntry')
    expect(projectProgress).toContain('scheduleProjectProgressSync')
    expect(sql).toContain('learning_journey_progress')
    expect(sql).toContain('alter publication supabase_realtime add table public.learning_states')
    expect(portfolio).toContain('t.neural')
    expect(new Set(MINI_PROJECTS.map(project => project.milestonePhaseId)).size).toBe(MINI_PROJECTS.length)
    expect(portfolio).not.toContain('ownerMode')
    expect(portfolio).not.toContain('unlockAll')
  })
})
