import { describe, expect, it } from 'vitest'
import {
  completeBaseZeroModule, createBaseZeroState, isBaseZeroComplete, scoreClassification,
  evaluateInstallSequence, scoreHardware, setReadinessScore, validateFileChallenge, validateInstallSequence,
} from './baseZero'

describe('Base Zero learning engine', () => {
  it('validates the target folder and Python filename', () => {
    expect(validateFileChallenge('ProjetosPython', 'meu_primeiro.py')).toBe(true)
    expect(validateFileChallenge('Projetos Python', 'meu_primeiro.txt')).toBe(false)
  })

  it('requires installation steps in the safe order', () => {
    expect(validateInstallSequence(['download', 'open', 'path', 'install', 'verify'])).toBe(true)
    expect(validateInstallSequence(['open', 'download', 'path', 'install', 'verify'])).toBe(false)
  })

  it('explains the first incorrect installation position', () => {
    const result = evaluateInstallSequence(['download', 'open', 'install', 'path', 'verify'])
    expect(result.correct).toBe(false)
    expect(result.correctPositions).toBe(3)
    expect(result.firstWrongIndex).toBe(2)
    expect(result.expected[2]).toBe('path')
    expect(result.received[2]).toBe('install')
  })

  it('scores local and cloud classification', () => {
    expect(scoreClassification({
      'downloads-folder': 'local', 'google-drive': 'cloud', 'desktop-file': 'local', 'onedrive-web': 'cloud',
    })).toBe(100)
  })

  it('scores hardware matching', () => {
    expect(scoreHardware({ calculate: 'cpu', temporary: 'ram', permanent: 'storage', parallel: 'gpu' })).toBe(100)
  })

  it('tracks completion and readiness', () => {
    let state = createBaseZeroState()
    for (const id of ['files', 'downloads', 'local-cloud', 'terminal', 'hardware'] as const) state = completeBaseZeroModule(state, id)
    state = setReadinessScore(state, 82)
    expect(isBaseZeroComplete(state)).toBe(true)
    expect(state.readinessScore).toBe(82)
  })
})
