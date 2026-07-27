import { ALL_PHASES } from './src/data/phases'
import { getPedagogicalJourney } from './src/lib/pedagogicalJourney'

/**
 * Guards the learning-journey view, which reassembles each lesson into stages.
 * Reassembly can silently drop or duplicate content, and the learner then sees a
 * section title with nothing under it — or the same title twice.
 */
const MAX = Number(process.argv[2] ?? 27)
let orphans = 0, dupes = 0, empty = 0

for (const phase of ALL_PHASES.filter(p => p.id <= MAX).sort((a, b) => a.id - b.id)) {
  const authored = new Set(
    phase.lesson.blocks.filter(b => b.type === 'heading').map(b => b.content?.en || ''),
  )
  const shown = new Set<string>()

  for (const unit of getPedagogicalJourney(phase)) {
    if (unit.blocks.length === 0) {
      console.log(`p${phase.id} stage ${unit.id}: no blocks at all`)
      empty++
    }
    const seen = new Set<string>()
    for (let i = 0; i < unit.blocks.length; i++) {
      const block = unit.blocks[i]
      if (block.type !== 'heading') continue
      const label = block.content?.en || ''
      shown.add(label)
      if (seen.has(label)) { console.log(`p${phase.id} stage ${unit.id}: duplicate heading "${label}"`); dupes++ }
      seen.add(label)
      const next = unit.blocks[i + 1]
      if (!next || next.type === 'heading') { console.log(`p${phase.id} stage ${unit.id}: "${label}" has nothing under it`); orphans++ }
    }
  }

  for (const label of authored) {
    if (!shown.has(label)) console.log(`p${phase.id}: authored section "${label}" never appears in the journey`)
  }
}
console.log(`\norphans ${orphans} | duplicates ${dupes} | empty stages ${empty}`)
