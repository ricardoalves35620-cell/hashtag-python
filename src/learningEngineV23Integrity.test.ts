import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { getPedagogicalJourney, isFoundationV2Migrated } from './lib/pedagogicalJourney'

describe('Learning Engine V2.3 curriculum migration', () => {
  it('keeps the dedicated phase 0–12 reasoning blueprints intact', () => {
    for (let phaseId = 0; phaseId <= 12; phaseId += 1) {
      expect(isFoundationV2Migrated(phaseId)).toBe(true)
    }
  })

  it('gives phases 5–12 concept-specific mental models instead of generic copy', () => {
    const expectedPhrases: Record<number, string> = {
      5: 'dois caminhos',
      6: 'mais de dois resultados',
      7: 'estado que muda',
      8: 'coleção conhecida',
      9: 'dois níveis',
      10: 'chave',
      11: 'muitos registros',
      12: 'nova lista',
    }

    for (const [idText, phrase] of Object.entries(expectedPhrases)) {
      const phase = ALL_PHASES.find(item => item.id === Number(idText))
      expect(phase).toBeDefined()
      const journey = getPedagogicalJourney(phase!)
      const authored = journey.flatMap(unit => unit.blocks)
        .map(block => typeof block.content === 'string' ? block.content : block.content?.pt || '')
        .join(' ')
        .toLowerCase()
      expect(authored).toContain(phrase.toLowerCase())
    }
  })

  it('teaches a complete reasoning contract before Python in every migrated phase', () => {
    for (const phase of ALL_PHASES.filter(item => item.id >= 5 && item.id <= 12)) {
      const units = getPedagogicalJourney(phase)
      const pythonIndex = units.findIndex(unit => unit.kind === 'python')
      expect(pythonIndex).toBeGreaterThanOrEqual(5)
      expect(units.slice(0, pythonIndex).every(unit => unit.blocks.length >= 2)).toBe(true)
      expect(units.find(unit => unit.kind === 'debug')?.blocks.length).toBeGreaterThanOrEqual(2)
      expect(units.find(unit => unit.kind === 'transfer')?.checkpoint.pt.length).toBeGreaterThan(40)
    }
  })
})
