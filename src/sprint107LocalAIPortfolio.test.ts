import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { getMiniProjectForPhase, MINI_PROJECTS, type ProjectCheckpointId } from './data/miniProjects'
import { buildCompletePortfolio, PORTFOLIO_PROJECT_IDS } from './lib/portfolio'
import { createMiniProjectProgress } from './lib/projectProgress'

type Vector = [number, number]
type Chunk = { source: string; chunkId: string; text: string }

function tokenize(text: string) {
  return text.toLowerCase().match(/[a-zà-ÿ0-9_]+/g) || []
}

function averageVector(text: string, embeddings: Map<string, Vector>): Vector | null {
  const vectors = tokenize(text).map(token => embeddings.get(token)).filter((value): value is Vector => Boolean(value))
  if (!vectors.length) return null
  return [
    vectors.reduce((sum, vector) => sum + vector[0], 0) / vectors.length,
    vectors.reduce((sum, vector) => sum + vector[1], 0) / vectors.length,
  ]
}

function cosine(left: Vector, right: Vector) {
  const dot = left[0] * right[0] + left[1] * right[1]
  const leftNorm = Math.sqrt(left[0] ** 2 + left[1] ** 2)
  const rightNorm = Math.sqrt(right[0] ** 2 + right[1] ** 2)
  return leftNorm && rightNorm ? dot / (leftNorm * rightNorm) : 0
}

function simulateLocalRag(inputs: string[]) {
  const embeddings = new Map<string, Vector>()
  const chunks: Chunk[] = []
  let query = ''
  const output: string[] = []

  for (const line of inputs) {
    if (line.toUpperCase() === 'END') break
    const [kind, ...parts] = line.split('|')
    try {
      if (kind === 'EMBED' && parts.length === 3) {
        const x = Number(parts[1])
        const y = Number(parts[2])
        if (!parts[0] || !Number.isFinite(x) || !Number.isFinite(y)) throw new Error()
        embeddings.set(parts[0].toLowerCase(), [x, y])
      } else if (kind === 'CHUNK' && parts.length >= 3) {
        const [source, chunkId, ...text] = parts
        if (!source || !chunkId || !text.join('|').trim()) throw new Error()
        chunks.push({ source, chunkId, text: text.join('|').trim() })
      } else if (kind === 'QUERY' && parts.length >= 1) {
        query = parts.join('|').trim()
      } else {
        throw new Error()
      }
    } catch {
      output.push('INVALID_RECORD')
    }
  }

  const queryVector = averageVector(query, embeddings)
  if (!queryVector) return [...output, 'ABSTAIN=unknown_query_terms']

  const retrieved = chunks
    .map(chunk => {
      const vector = averageVector(chunk.text, embeddings)
      return vector ? { chunk, score: cosine(queryVector, vector) } : null
    })
    .filter((item): item is { chunk: Chunk; score: number } => Boolean(item && item.score >= 0.45))
    .sort((a, b) => b.score - a.score || `${a.chunk.source}#${a.chunk.chunkId}`.localeCompare(`${b.chunk.source}#${b.chunk.chunkId}`))
    .slice(0, 2)

  if (!retrieved.length) return [...output, 'ABSTAIN=no_relevant_evidence']

  for (const item of retrieved) {
    output.push(`RETRIEVED=${item.chunk.source}#${item.chunk.chunkId}|${item.score.toFixed(2)}`)
  }

  const queryTerms = new Set(tokenize(query))
  const sentences = retrieved[0].chunk.text.split(/(?<=[.!?])\s+/).filter(Boolean)
  const answer = [...sentences].sort((a, b) => {
    const overlapA = tokenize(a).filter(token => queryTerms.has(token)).length
    const overlapB = tokenize(b).filter(token => queryTerms.has(token)).length
    return overlapB - overlapA
  })[0]

  if (!answer) return [...output, 'ABSTAIN=no_relevant_evidence']
  output.push(`ANSWER=${answer}`)
  output.push(`CITATIONS=${retrieved.map(item => `${item.chunk.source}#${item.chunk.chunkId}`).join(',')}`)
  return output
}

describe('Sprint 10.7 final local AI capstone and complete portfolio', () => {
  it('adds the final private local RAG project at Phase 68', () => {
    const project = getMiniProjectForPhase(68)
    expect(project?.id).toBe('local-rag-copilot')
    expect(project?.tests).toHaveLength(4)
    expect(project?.requiredImports).toEqual(expect.arrayContaining(['dataclasses', 'math', 're']))
    expect(project?.requiredFunctions).toEqual(expect.arrayContaining([
      'tokenize',
      'average_vector',
      'cosine_similarity',
      'retrieve',
      'grounded_answer',
      'main',
    ]))
    expect(project?.requiredCalls).toEqual(expect.arrayContaining(['math.sqrt', 're.findall']))
    expect(project?.requireMainGuard).toBe(true)
  })

  it('keeps every final RAG input/output contract reproducible', () => {
    const project = getMiniProjectForPhase(68)!
    for (const test of project.tests) {
      expect(simulateLocalRag(test.inputs)).toEqual(test.expectedOutput)
    }
  })

  it('consolidates all six portfolio milestones in normal progression order', () => {
    expect(PORTFOLIO_PROJECT_IDS).toEqual([
      'foundation-claim-desk',
      'professional-claims-triage',
      'engineering-order-service',
      'data-ml-risk-pipeline',
      'transformer-attention-inspector',
      'local-rag-copilot',
    ])
    const milestones = PORTFOLIO_PROJECT_IDS
      .map(id => MINI_PROJECTS.find(project => project.id === id)?.milestonePhaseId)
    expect(milestones).toEqual([27, 39, 53, 60, 64, 68])
  })

  it('exports one complete portfolio assembled from the learner own evidence', () => {
    const entries = PORTFOLIO_PROJECT_IDS.map(id => {
      const project = MINI_PROJECTS.find(candidate => candidate.id === id)!
      const progress = createMiniProjectProgress(project.id, project.starterCode.pt)
      return {
        project,
        progress: {
          ...progress,
          understanding: {
            inputs: 'Entradas definidas por mim.',
            output: 'Saída verificável.',
            rules: 'Regras explícitas.',
            edgeCase: 'Caso limite testado.',
          },
          pseudocode: 'RECEBER\nVALIDAR\nPROCESSAR\nTESTAR',
          code: 'print("evidência")',
          testResults: [{ id: 'evidence', passed: true, details: 'ok' }],
          completedCheckpoints: ['understand', 'plan', 'build', 'test', 'refactor'] as ProjectCheckpointId[],
          completed: true,
        },
      }
    })

    const markdown = buildCompletePortfolio(entries, 'pt')
    expect(markdown).toContain('# Portfólio completo — Hashtag Python')
    expect(markdown).toContain('Artefatos concluídos: 6/6')
    expect(markdown).toContain('Copiloto Privado de Documentos Locais')
    expect(markdown).toContain('Dependência de API externa de IA: nenhuma no capstone final')
    expect(markdown).toContain('```python')
  })

  it('does not introduce an owner unlock path', () => {
    const portfolioSource = readFileSync(new URL('./pages/Portfolio.tsx', import.meta.url), 'utf8')
    expect(portfolioSource).not.toContain('ownerMode')
    expect(portfolioSource).not.toContain('unlockAll')
  })
})
