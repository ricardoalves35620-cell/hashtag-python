import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import {
  getPedagogicalJourney,
  isLearningEngineV2Migrated,
} from './lib/pedagogicalJourney'

function portugueseJourneyText(phaseId: number) {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  expect(phase).toBeDefined()

  return getPedagogicalJourney(phase!)
    .flatMap(unit => unit.blocks)
    .map(block => block.content?.pt || '')
    .join(' ')
    .toLowerCase()
}

describe('Learning Engine V2.6 foundation completion', () => {
  it('ships dedicated reasoning blueprints for every foundation phase', () => {
    for (let phaseId = 0; phaseId <= 27; phaseId += 1) {
      expect(isLearningEngineV2Migrated(phaseId)).toBe(true)
    }

    expect(isLearningEngineV2Migrated(28)).toBe(false)
  })

  it('gives phases 13–27 a concept-specific mental model', () => {
    const expectedPhrases: Record<number, string> = {
      13: 'responsabilidade',
      14: 'argumentos',
      15: 'docstring',
      16: 'variável vive em uma sala',
      17: 'contexto de abertura',
      18: 'modo correto',
      19: 'texto json',
      20: 'timedelta',
      21: 'seed',
      22: 'unidades',
      23: 'try',
      24: 'uma conversa',
      25: 'identidade',
      26: 'denominadores',
      27: 'critérios de aceitação',
    }

    for (const [phaseIdText, phrase] of Object.entries(expectedPhrases)) {
      expect(portugueseJourneyText(Number(phaseIdText))).toContain(phrase)
    }
  })

  it('does not use the generic migration copy in the remaining foundation phases', () => {
    for (let phaseId = 13; phaseId <= 27; phaseId += 1) {
      const authored = portugueseJourneyText(phaseId)
      expect(authored).not.toContain('trate isso como um problema para raciocinar')
      expect(authored).not.toContain('antes do python, descreva o que uma pessoa precisaria')
    }
  })

  it('teaches project phases as complete development workflows', () => {
    const requiredTerms: Record<number, string[]> = {
      24: ['menu', 'validar', 'testar'],
      25: ['criar', 'atualizar', 'excluir'],
      26: ['limpar', 'agregar', 'limitações'],
      27: ['arquitetura', 'persistência', 'documentar'],
    }

    for (const [phaseIdText, terms] of Object.entries(requiredTerms)) {
      const authored = portugueseJourneyText(Number(phaseIdText))
      for (const term of terms) expect(authored).toContain(term)
    }
  })
})
