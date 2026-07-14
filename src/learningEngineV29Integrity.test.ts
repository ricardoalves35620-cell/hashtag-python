import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { getPedagogicalJourney, isLearningEngineV2Migrated } from './lib/pedagogicalJourney'

function journeyText(phaseId: number, lang: 'en' | 'pt' = 'pt') {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  expect(phase).toBeDefined()
  return getPedagogicalJourney(phase!)
    .flatMap(unit => [
      unit.title[lang],
      unit.purpose[lang],
      unit.checkpoint[lang],
      ...unit.blocks.map(block => block.content?.[lang] || ''),
    ])
    .join(' ')
    .toLocaleLowerCase()
}

describe('Learning Engine V2.9 data and local AI migration', () => {
  it('ships a hand-authored reasoning blueprint for every registered phase', () => {
    expect(ALL_PHASES).toHaveLength(69)
    for (const phase of ALL_PHASES) expect(isLearningEngineV2Migrated(phase.id), `phase ${phase.id}`).toBe(true)
  })

  it('gives phases 54–68 concept-specific mental models instead of generic migration copy', () => {
    const expectedPhrases: Record<number, string> = {
      54: 'mapa numérico',
      55: 'bloco de memória tipado',
      56: 'dados brutos são evidência',
      57: 'raciocínio disciplinado sob incerteza',
      58: 'separe antes de aprender',
      59: 'linha de regressão é uma hipótese',
      60: 'o limiar é decisão de negócio',
      61: 'rede neural é uma composição',
      62: 'treino em pytorch é um sistema com estados',
      63: 'tokenizador é um acordo reversível',
      64: 'cada token decide o que precisa',
      65: 'modelo local é um orçamento',
      66: 'ferramenta é permissão',
      67: 'rag separa recuperação de evidência',
      68: 'produto de ia útil é um sistema completo de evidências',
    }

    for (const [phaseId, phrase] of Object.entries(expectedPhrases)) {
      const authored = journeyText(Number(phaseId))
      expect(authored, `phase ${phaseId}`).toContain(phrase)
      expect(authored).not.toContain('trate isso como um problema para raciocinar')
      expect(authored).not.toContain('entrada → guardar → processar → decidir/repetir → saída')
    }
  })

  it('keeps the local-AI path grounded in privacy, evaluation and bounded authority', () => {
    const localRuntime = journeyText(65)
    const tools = journeyText(66)
    const rag = journeyText(67)
    const capstone = journeyText(68)

    expect(localRuntime).toContain('licença')
    expect(localRuntime).toContain('hardware')
    expect(tools).toContain('menor capacidade possível')
    expect(tools).toContain('confirmação')
    expect(rag).toContain('citações')
    expect(rag).toContain('evidência')
    expect(capstone).toContain('sem api externa')
    expect(capstone).toContain('limitações')
  })

  it('preserves the correct AI track and stage boundaries', () => {
    for (const phase of ALL_PHASES.filter(item => item.id >= 54)) {
      expect(phase.track).toBe('ai-local')
      expect(phase.labPath).toBe('/ai-lab')
      expect(phase.stage).toMatch(/^ai-(data|deep|local)$/)
    }
  })
})
