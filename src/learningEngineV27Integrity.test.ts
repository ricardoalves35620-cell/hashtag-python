import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import {
  getPedagogicalJourney,
  isLearningEngineV2Migrated,
} from './lib/pedagogicalJourney'

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

describe('Learning Engine V2.7 professional Python migration', () => {
  it('ships a dedicated reasoning blueprint for every phase through Professional Python', () => {
    for (let phaseId = 0; phaseId <= 39; phaseId += 1) {
      expect(isLearningEngineV2Migrated(phaseId)).toBe(true)
    }

  })

  it('gives phases 28–39 concept-specific professional mental models', () => {
    const expectedPhrases: Record<number, string> = {
      28: 'oficina por responsabilidade',
      29: 'caixa de ferramentas privada',
      30: 'fronteira com nome',
      31: 'bairro com nome',
      32: 'linha de comando como uma api',
      33: 'checkpoints intencionais',
      34: 'evidência executável',
      35: 'testar hipóteses',
      36: 'evento de log é um fato',
      37: 'promessa para pessoas e ferramentas',
      38: 'composição significa',
      39: 'fronteiras substituíveis',
    }

    for (const [phaseIdText, phrase] of Object.entries(expectedPhrases)) {
      expect(journeyText(Number(phaseIdText))).toContain(phrase)
    }
  })

  it('removes generic migration copy from the Professional Python phases', () => {
    for (let phaseId = 28; phaseId <= 39; phaseId += 1) {
      const authored = journeyText(phaseId)
      expect(authored).not.toContain('trate isso como um problema para raciocinar')
      expect(authored).not.toContain('antes do python, descreva o que uma pessoa precisaria')
      expect(authored).not.toContain('entrada → guardar → processar → decidir/repetir → saída')
    }
  })

  it('teaches a complete professional workflow before syntax in every migrated phase', () => {
    for (const phase of ALL_PHASES.filter(item => item.id >= 28 && item.id <= 39)) {
      const units = getPedagogicalJourney(phase)
      const pythonIndex = units.findIndex(unit => unit.kind === 'python')

      expect(units).toHaveLength(10)
      expect(pythonIndex).toBe(5)
      expect(units.slice(0, pythonIndex).every(unit => unit.blocks.length >= 2)).toBe(true)
      expect(units.find(unit => unit.kind === 'debug')?.blocks.length).toBeGreaterThanOrEqual(3)
      expect(units.find(unit => unit.kind === 'transfer')?.checkpoint.pt.length).toBeGreaterThan(50)
    }
  })

  it('makes the professional capstone cover reproducibility, boundaries and evidence', () => {
    const capstone = journeyText(39)
    for (const term of ['critérios de aceitação', 'pacote src', 'testar', 'persistência substituível', 'instalação limpa', 'documentar']) {
      expect(capstone).toContain(term)
    }
  })

  it('keeps professional phases on the normal locked progression', () => {
    const professional = ALL_PHASES.filter(phase => phase.id >= 28 && phase.id <= 39)
    expect(professional).toHaveLength(12)
    expect(professional.every(phase => phase.stage === 'professional')).toBe(true)
    expect(professional.every(phase => phase.track === 'core')).toBe(true)
  })
})
