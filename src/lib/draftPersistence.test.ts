import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/**
 * Found by seeding a saved draft, opening the exercise, and reading it back: the
 * draft was gone, replaced by the starter code, before the editor had even painted.
 *
 * The chain was three links long and every link looked correct on its own:
 *
 *   1. CodeMirror reports docChanged for a programmatic dispatch exactly as it does
 *      for a keystroke, so setting the editor's value announced a learner edit.
 *   2. The page queued that "edit" as a draft — built from `codes`, which still held
 *      the starter because the restore had not run yet.
 *   3. loadLocalDraft serves a queued draft ahead of localStorage (correct on its own:
 *      a pending write is newer than what is on disk). So the restore read back the
 *      starter that step 2 had just queued, and wrote it to storage for good.
 *
 * Net effect: opening an exercise you had already solved destroyed your solution, on
 * this device and then in the cloud. Nothing threw, and nothing in the UI said so.
 */

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('an editor only reports changes the learner actually made', () => {
  for (const file of ['../components/VSCodeEditor.tsx', '../components/CodeEditor.tsx']) {
    describe(file.split('/').pop() ?? file, () => {
      const source = read(file)

      it('marks its own programmatic document writes', () => {
        expect(source).toContain('Annotation')
        expect(source).toContain('const ExternalChange = Annotation.define<boolean>()')
        expect(source).toContain('annotations: ExternalChange.of(true)')
      })

      it('ignores those writes in the update listener', () => {
        expect(source).toContain('update.transactions.some(transaction => transaction.annotation(ExternalChange))')
      })

      it('still reports a real keystroke', () => {
        // The guard must be scoped to annotated transactions, never a blanket mute.
        expect(source).toMatch(/onChangeRef\.current\(/)
      })
    })
  }
})

describe('derived test inputs are not mistaken for the learner typing', () => {
  const inputs = read('../components/TestInputEditor.tsx')
  const exercises = read('../pages/Exercises.tsx')

  it('labels the origin of every reported value', () => {
    expect(inputs).toContain("origin: 'derived' | 'user'")
    expect(inputs).toContain("'derived')")
    expect(inputs).toContain("'user')")
  })

  it('does not persist a draft for a value the learner never entered', () => {
    // This effect re-parses the code for input() prompts and fires on mount, before
    // any saved draft has loaded. Persisting it wrote the starter over saved work on
    // every exercise whose starter calls input().
    expect(exercises).toContain("if (origin === 'derived') return")
  })

  it('does not persist anything before the saved draft has been restored', () => {
    expect(exercises).toContain('if (learnerId && hydratedDraftKey === draftKey) {')
  })
})
