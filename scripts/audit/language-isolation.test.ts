import { describe, it, expect } from 'vitest'
import { isEnglishProse, leaksIn } from './language-isolation'

/**
 * A leak detector is only useful if its count is actionable. This one reported 155
 * strings, and a third of them were things that must NOT be translated:
 *
 *   "{name}, {age} anos, {height}m"     Portuguese prose. `name`/`age`/`height` are
 *                                       f-string field names — translating them renames
 *                                       the learner's own variables and breaks the code.
 *   "preencha: >, and, <"               `and` is a Python keyword.
 *   "#{c['id']} {c['client']} ${c['amount']}"
 *                                       dictionary keys inside a format string.
 *
 * Every one of those would have sent someone editing working exercises. So the detector
 * ignores what is inside `{...}` and ignores Python keywords, and this file pins BOTH
 * directions: the false positives stay silent, and the real leaks — the ones an actual
 * learner reported from the running app — still fire.
 */

const REAL_LEAKS = [
  'Queue size: 3',
  'Processing: Alice',
  'Python reads TOP to BOTTOM and stops at the FIRST True.',
  'This runs about 30% of the time',
  'No score recorded for that name yet.',
  'Rank by token overlap, preserve source IDs and refuse without evidence.',
  'Reject empty paths and non-positive context sizes.',
  'the person types: abc, then 7',
  'install the wheel and run smoke tests',
  'minimize the failing case',
]

const MUST_STAY_SILENT = [
  // Portuguese prose whose only English-looking words are f-string field names.
  '{name}, {age} anos, {height}m',
  '{full} tem {age} anos',
  'Daqui a 10 anos: {age + 10}',
  'Ano que vem: {age + 1}',
  'Telefone: {phone}',
  'forma curta: o mesmo que score = score + 5 → 15',
  'preencha: continue enquanto stock >= 15',
  // Python keywords and operators are not English prose.
  'preencha: >, and, <',
  // Format strings made of dictionary keys.
  "#{c['id']} {c['client']} ${c['amount']} [{c['priority']}] {c['status']}",
  '{category}: {value}',
  '{s[\'name\']}: {area:.1f} m² → ${cost}',
]

describe('isEnglishProse', () => {
  it('still fires on prose a Portuguese learner cannot read', () => {
    const missed = REAL_LEAKS.filter(text => !isEnglishProse(text))
    expect(missed).toEqual([])
  })

  it('stays silent on Portuguese prose containing f-string field names', () => {
    const wrong = MUST_STAY_SILENT.filter(text => isEnglishProse(text))
    expect(wrong).toEqual([])
  })

  it('is not silenced by stripping placeholders — English outside them still counts', () => {
    expect(isEnglishProse('Total for {name}: the report is complete')).toBe(true)
  })
})

describe('leaksIn', () => {
  it('reads a comment as prose and a dictionary key as not', () => {
    const code = [
      '# Python reads TOP to BOTTOM and stops at the FIRST True.',
      'print(f"{pedido["cliente"]} tem {age} anos")',
    ].join('\n')
    const leaks = leaksIn('fixture', code)
    expect(leaks.map(leak => leak.kind)).toEqual(['comment'])
  })

  it('reports zero for an asset that is fully Portuguese', () => {
    const code = ['# soma os preços da lista', 'print(f"Total: {total} reais")'].join('\n')
    expect(leaksIn('fixture', code)).toEqual([])
  })
})
