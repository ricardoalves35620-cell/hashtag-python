import { describe, expect, it } from 'vitest'

function buildGlossaryRegex(aliases: string[]) {
  const escaped = aliases.map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  return new RegExp(`(?<![\\p{L}\\p{N}_])(${escaped})(?![\\p{L}\\p{N}_])`, 'giu')
}

describe('glossary word boundaries', () => {
  it('matches file as a complete word', () => {
    expect('open the file'.match(buildGlossaryRegex(['file']))).toEqual(['file'])
  })

  it('does not split filed into file + d', () => {
    expect('claim filed yesterday'.match(buildGlossaryRegex(['file']))).toBeNull()
  })
})
