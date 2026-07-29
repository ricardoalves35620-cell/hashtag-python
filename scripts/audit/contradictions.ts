import { ALL_PHASES } from '../../src/data/phases/index'
import { resolveLocalizedCode } from '../../src/lib/localization'

/**
 * Finds exercises that contradict themselves.
 *
 * ex6_zero was scored out of 10, with bands at 9 / 7 / 5 and a worked example of 9.2.
 * Its hints said `int(input(...))` — which raises ValueError on 9.2 — and gave
 * thresholds of `>= 90, >= 75, >= 60`, a 0-100 scale. A learner who followed the hints,
 * using the value the task printed, got a crash. In the from-scratch exercise, where
 * hints matter most.
 *
 * 438 tests could not see it. Neither could the content audit, the curriculum audit or
 * the v11 gate: every one of them checks a field against a rule, and this is a field
 * disagreeing with another field.
 *
 * Precision over recall, deliberately. A checker that cries wolf gets ignored, then
 * gets continue-on-error, then gets deleted — which is the exact fate of the 160
 * warnings the content audit already prints.
 *
 *   npx tsx scripts/audit/contradictions.ts
 */

interface Finding {
  phase: number
  exercise: string
  rule: string
  detail: string
}

const findings: Finding[] = []
const add = (phase: number, exercise: string, rule: string, detail: string) =>
  findings.push({ phase, exercise, rule, detail })

const bothLangs = (value?: { en?: string; pt?: string }) => `${value?.en ?? ''}\n${value?.pt ?? ''}`

for (const phase of ALL_PHASES as any[]) {
  for (const exercise of phase.exercises ?? []) {
    const id = exercise.id
    const starter = resolveLocalizedCode(exercise.starterCode, 'en')
    const description = bothLangs(exercise.description)
    const hints = (exercise.hints ?? []).map((h: any) => bothLangs(h)).join('\n')
    const sample = bothLangs(exercise.sampleOutput)
    const said = `${description}\n${hints}`

    const tests = exercise.grading?.tests ?? []
    const suppliedInputs = [
      ...(exercise.suggestedInputs ?? []),
      ...tests.flatMap((t: any) => t.inputs ?? []),
    ]

    // ── 1. A solution that follows the guidance cannot pass ────────────────────
    //
    // The starter has no input(), the grading supplies no values, but the learner is
    // told to read input(). A correct solution then dies with EOFError before printing
    // anything — and the learner has no way to tell that from their own mistake.
    const starterReadsInput = /\binput\s*\(/.test(starter)
    const guidanceSaysInput = /\binput\s*\(/.test(hints)
    if (guidanceSaysInput && !starterReadsInput && suppliedInputs.length === 0 && tests.length > 0) {
      add(phase.id, id, 'input-with-no-values',
        'a hint tells the learner to use input(), the starter has none, and grading supplies no values — a correct solution fails with EOFError')
    }

    // ── 2. int() against an example that is not an integer ────────────────────
    if (/\bint\s*\(\s*input/.test(said)) {
      const decimals = [...`${description}\n${sample}`.matchAll(/\b\d+\.\d+\b/g)].map(m => m[0])
      if (decimals.length) {
        add(phase.id, id, 'int-against-a-decimal',
          `guidance says int(input(...)) but the task shows ${decimals[0]} — int("${decimals[0]}") raises ValueError`)
      }
    }

    // ── 3. Thresholds in the hints that appear nowhere in the task ─────────────
    //
    // How a 0-100 scale ended up in an exercise scored out of 10. Only comparison
    // thresholds count: a bare number in prose is usually an example, not a rule.
    const hintThresholds = [...hints.matchAll(/[<>]=?\s*(\d{1,4})\b/g)].map(m => m[1])
    if (hintThresholds.length) {
      const taskNumbers = new Set([...`${description}\n${starter}\n${sample}`.matchAll(/\b\d+(?:\.\d+)?\b/g)].map(m => m[0]))
      const orphans = [...new Set(hintThresholds)].filter(n => !taskNumbers.has(n))
      // Two or more is a different scale; one is usually a typo or an aside.
      if (orphans.length >= 2) {
        add(phase.id, id, 'thresholds-not-in-the-task',
          `hints compare against ${orphans.join(', ')}, none of which appear in the task, starter or sample output`)
      }
    }

    // ── 4. A hint assigns to a name the exercise does not have ────────────────
    //
    // Narrowed hard after the first run: matching any identifier followed by `(` or `=`
    // flagged setdefault, rstrip, isinstance, fromisoformat, randint — every one of them
    // a Python name the hint is legitimately TEACHING. Fourteen findings, fourteen false
    // positives. A checker with that precision gets ignored and then deleted.
    //
    // Only an assignment counts now: `long_songs = ...` in a hint, with no long_songs
    // anywhere in the exercise, is a rename that updated the starter and not the hint.
    // A call is teaching; an assignment is naming.
    const hintAssignments = [...hints.matchAll(/(?:^|\n)\s*(?:[A-Za-z\u00C0-\u017F ]*?:\s*)?\b([a-z_][a-z0-9_]{3,})\s*=(?!=)/g)].map(m => m[1])
    const present = new Set(
      [...`${starter}\n${description}\n${sample}`.matchAll(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g)].map(m => m[0]),
    )
    const missing = [...new Set(hintAssignments)].filter(name => !present.has(name))
    if (missing.length) {
      add(phase.id, id, 'hint-assigns-a-name-the-exercise-lacks',
        `hints assign to ${missing.join(', ')}, which appear nowhere in the starter, task or sample output`)
    }

    // ── 5. The task promises output the sample does not show ──────────────────
    //
    // "prints exactly five lines" against a three-line sample. The count is authored in
    // prose and the sample is authored separately, so they drift.
    const promised = `${description}`.match(/\b(?:exactly|prints?)\s+(\w+)\s+lines?\b/i)?.[1]
    const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }
    const promisedCount = promised ? (words[promised.toLowerCase()] ?? Number(promised)) : NaN
    if (Number.isFinite(promisedCount) && sample.trim()) {
      const actual = (exercise.sampleOutput?.en ?? '').split('\n').filter((l: string) => l.trim()).length
      if (actual > 0 && actual !== promisedCount) {
        add(phase.id, id, 'line-count-disagrees-with-the-sample',
          `the task promises ${promisedCount} lines, the sample output has ${actual}`)
      }
    }
  }
}

const byRule = findings.reduce<Record<string, number>>((acc, f) => ({ ...acc, [f.rule]: (acc[f.rule] ?? 0) + 1 }), {})
console.log(`\nSelf-contradicting exercises: ${findings.length}\n`)
for (const [rule, count] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(3)}  ${rule}`)
}
console.log()
for (const f of findings.sort((a, b) => a.phase - b.phase)) {
  console.log(`phase ${String(f.phase).padStart(2)} · ${f.exercise.padEnd(24)} ${f.rule}`)
  console.log(`         ${f.detail}`)
}

process.exitCode = findings.length ? 1 : 0
