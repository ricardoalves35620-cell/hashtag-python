import { ALL_PHASES } from '../../src/data/phases'
import { writeFileSync } from 'node:fs'
import { resolveLocalizedCode } from '../../src/lib/localization'
// @ts-expect-error - plain .mjs helper shared with the Node-only checkers
import { EXERCISES_JSON } from './cache.mjs'

/**
 * Exports every exercise in phases 0-20 with the facts the parity report needs:
 * what is graded, how it is graded, and how much the learner was told.
 */
const out = ALL_PHASES
  .filter(phase => phase.id <= 20)
  .sort((a, b) => a.id - b.id)
  .flatMap(phase => phase.exercises.map(ex => ({
    phase: phase.id,
    id: ex.id,
    difficulty: ex.difficulty ?? null,
    desc: ex.description.en,
    descPt: ex.description.pt,
    starter: resolveLocalizedCode(ex.starterCode as never, 'en'),
    // The PORTUGUESE learner's starter, resolved the way the app renders it. Without it a
    // checker can only compare English against English and never sees that the two
    // languages run different programs.
    starterPt: resolveLocalizedCode(ex.starterCode as never, 'pt'),
    sample: ex.sampleOutput?.en,
    samplePt: ex.sampleOutput?.pt,
    hints: (ex.hints || []).map(h => h.en),
    behaviourCases: ex.behaviour ? ex.behaviour.cases.length : 0,
    behaviourReference: ex.behaviour
      ? (typeof ex.behaviour.reference === 'string' ? ex.behaviour.reference : ex.behaviour.reference.en)
      : null,
    codeRequirements: (ex.grading?.codeRequirements || []).map(r => ({ kind: r.kind, value: String(r.value) })),
    tests: (ex.grading?.tests || []).map(test => ({
      hidden: !!test.hidden,
      inputs: test.inputs || [],
      afterCode: (test as { afterCode?: string }).afterCode ?? null,
      // Requirements live at BOTH levels. ex7_zero declares its `While` only on the
      // test, so reading the exercise level alone under-reports the guard rails and
      // makes an exercise look weaker than it is.
      codeRequirements: ((test as { codeRequirements?: Array<{ kind: string, value: unknown }> }).codeRequirements || [])
        .map(r => ({ kind: r.kind, value: String(r.value) })),
      checks: (test.checks || []).map(check => ({
        type: String(check.type),
        value: (check as { value?: unknown }).value ?? null,
      })),
    })),
  })))

/*
 * Writes the file itself rather than relying on `> /tmp/ex0_20.json` in package.json.
 * Shell redirection to a POSIX path does not survive Windows, where npm runs scripts
 * through cmd.exe and `/tmp/...` lands on C:\tmp if it lands anywhere — which is why six
 * audit commands could not run on the machine this project is developed on.
 */
writeFileSync(EXERCISES_JSON, JSON.stringify(out, null, 1), 'utf8')
console.log(`${out.length} exercises -> ${EXERCISES_JSON}`)
