import { describe, expect, it } from 'vitest'
import { ALL_PHASES } from './data/phases'
import { getVisibleExamContracts } from './lib/examContract'
import { checkText } from './lib/pyodide'
import { getPedagogicalJourney, isLearningEngineV2Migrated } from './lib/pedagogicalJourney'

function journeyText(phaseId: number, lang: 'en' | 'pt' = 'pt') {
  const phase = ALL_PHASES.find(item => item.id === phaseId)
  expect(phase).toBeDefined()
  return getPedagogicalJourney(phase!)
    .flatMap(unit => [unit.title[lang], unit.purpose[lang], unit.checkpoint[lang], ...unit.blocks.map(block => block.content?.[lang] || '')])
    .join(' ')
    .toLocaleLowerCase()
}

describe('Learning Engine V2.8 advanced Python and transparent exam contracts', () => {
  it('ships a dedicated reasoning blueprint for every phase through engineering', () => {
    for (let phaseId = 0; phaseId <= 53; phaseId += 1) expect(isLearningEngineV2Migrated(phaseId)).toBe(true)
    expect(isLearningEngineV2Migrated(54)).toBe(false)
  })

  it('gives phases 40–53 concept-specific mental models instead of generic migration copy', () => {
    const expectedPhrases: Record<number, string> = {
      40: 'dispensador', 41: 'linha de montagem', 42: 'invólucro controlado', 43: 'promessa com entrada e saída',
      44: 'pedidos a métodos com contratos precisos', 45: 'menor capacidade', 46: 'fila de tarefas',
      47: 'estado compartilhado mais seguro', 48: 'trabalho de desempenho é experimento',
      49: 'promessa de tudo ou nada', 50: 'contrato através da rede', 51: 'decisão de confiança',
      52: 'cadeia de evidências', 53: 'argumento de design apoiado por evidência executável',
    }
    for (const [phaseId, phrase] of Object.entries(expectedPhrases)) {
      const authored = journeyText(Number(phaseId))
      expect(authored).toContain(phrase)
      expect(authored).not.toContain('trate isso como um problema para raciocinar')
      expect(authored).not.toContain('entrada → guardar → processar → decidir/repetir → saída')
    }
  })

  it('always exposes a visible expected-result contract without revealing hidden cases', () => {
    for (const phase of ALL_PHASES) {
      const hiddenIds = new Set(phase.exam.testCases.filter(testCase => testCase.hidden).map(testCase => testCase.id))
      for (const lang of ['en', 'pt'] as const) {
        const contracts = getVisibleExamContracts(phase.exam, lang)
        expect(contracts.length, `phase ${phase.id} ${lang}`).toBeGreaterThan(0)
        expect(contracts.every(contract => contract.expected.trim().length > 0)).toBe(true)
        expect(contracts.every(contract => !hiddenIds.has(contract.id))).toBe(true)
      }
    }
  })

  it('verifies every canonical visible output against the same checks used for grading', () => {
    for (const phase of ALL_PHASES) {
      for (const testCase of phase.exam.testCases.filter(item => !item.hidden)) {
        const canonical = testCase.expectedOutput?.en || phase.exam.expectedOutput?.en
        if (!canonical) continue
        for (const check of testCase.checks) {
          expect(checkText(canonical, check), `phase ${phase.id}, test ${testCase.id}, ${check.type}`).toBe(true)
        }
      }
    }
  })

  it('accepts harmless company-name spacing while keeping the complete required name', () => {
    const phaseOne = ALL_PHASES.find(phase => phase.id === 1)!
    const check = phaseOne.exam.testCases.find(testCase => testCase.id === 'tc1_1')!.checks[0]
    expect(checkText('ClaimPro Insurance', check)).toBe(true)
    expect(checkText('Claim Pro Insurance', check)).toBe(true)
    expect(checkText('CLAIM-PRO INSURANCE', check)).toBe(true)
    expect(checkText('Claim Pro', check)).toBe(false)
  })
})
