import { describe, expect, it } from 'vitest'
import { findDrift } from './bilingual-drift'

/**
 * Case 1 is the founding case: phase 21 told an English learner the code generates
 * `repair_value` and a Portuguese learner it generates "o dano" — a word that appears
 * nowhere in the starter they were looking at.
 *
 * Everything else here is a shape that must stay quiet, because the two languages are
 * SUPPOSED to differ almost everywhere. Each one produced a false positive during the
 * narrowing from 32 findings to 0.
 */
const drifts = (en: string, pt: string) => Boolean(findDrift('t', en, pt))

describe('bilingual drift', () => {
  it('catches an identifier that became an ordinary noun', () => {
    expect(drifts('random.randint(500, 12000) generates the repair_value',
                  'random.randint(500, 12000) gera o dano')).toBe(true)
  })

  it('catches a number that is only in one language', () => {
    expect(drifts('Create five orders for Alice (12000)', 'Crie cinco pedidos para Alice')).toBe(true)
  })

  it('catches a stdlib call that is only in one language', () => {
    expect(drifts('Use json.dumps() to serialise', 'Use para serializar')).toBe(true)
  })
})

describe('bilingual drift stays quiet where the languages must differ', () => {
  it('accepts Portuguese thousands separators', () => {
    // 5,230 in English is 5.230 in Portuguese. Comparing the strings flags every price.
    expect(drifts('The order is 5,230 dollars', 'O pedido é 5.230 reais')).toBe(false)
  })

  it('accepts Portuguese decimal commas', () => {
    expect(drifts('a rate of 2.4 percent', 'uma taxa de 2,4 por cento')).toBe(false)
  })

  it('accepts translated variable names', () => {
    // client_name / nome_cliente is deliberate: the learner reads code in their language.
    expect(drifts('Store client_name and order_amount', 'Guarde nome_cliente e valor_pedido')).toBe(false)
  })

  it('accepts a translated receiver on an API method', () => {
    // record.copy() vs registro.copy() — the method is API, the variable is translated.
    expect(drifts('Call record.copy() first', 'Chame registro.copy() primeiro')).toBe(false)
  })

  it('accepts translated function names', () => {
    expect(drifts('Write validate_rows() to check', 'Escreva validar_linhas() para checar')).toBe(false)
  })

  it('accepts prose that shares no words at all', () => {
    expect(drifts('Everything you have learned comes together here.',
                  'Tudo o que você aprendeu se junta aqui.')).toBe(false)
  })
})
