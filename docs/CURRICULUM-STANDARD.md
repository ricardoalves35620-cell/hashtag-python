# The standard a phase must meet

Phases 0–20 are held to everything below. Phases 21–68 are not yet. This document exists
so that bringing them up means following a procedure rather than remembering a
conversation.

Every rule here was written after a real defect. The defect is named in each case,
because a rule without its reason gets deleted by the next person who finds it
inconvenient.

---

## Four rules that produced almost every fix

### 1. Fix the class, never the instance

A bug report is a sample, not the bug. `dano` (damage) was found in phase 21, fixed in
phases 21 and 27, and left in the **fifty-two** places in `phases_2_to_8.ts` that nobody
had swept. The learner then hit it again in phase 8's exam.

Before fixing what was reported, count how many times it occurs. Fix all of them, then
add a check so the count cannot grow again.

### 2. Verify the instrument before believing the number

A checker reporting `0` is worthless until it has been shown to report `1`. Every checker
in `scripts/audit/` has been run against a deliberately broken input, and the broken run
is recorded in its commit message.

This is not paranoia. In this repository:

- the free-value detector had doubled backslashes, so its English half matched a literal
  `\b` and scanned nothing — while reporting a plausible 57
- the dead-store detector was blind to its own founding case, because `sum(c["total"])`
  contains the string `total` and it read that as a use of the variable
- the presentation checker reported two exercises accepting wrong answers; both were the
  checker (a digits-only corruption left `🚨 FLAGGED for investigation` unchanged)
- the service-worker guard passed the broken build, because its regex matched its own
  explanatory comment instead of the setting
- `audit:learner` and `audit:pt-grading` read two files that **nothing in the repository
  wrote**. They existed on one machine because a one-off command had made them there. On
  any other machine the learner agent submitted no solutions at all and reported that every
  graded exercise was fine
- the same agent, pointed at a build with no Supabase config, walked a "configuration
  required" screen for ten minutes per exercise and reported nothing: the screen has
  plenty of text, so the render check passed, and each poll for a missing editor waited
  out Playwright's 30-second default
- the leak detector's own `readable()` passed a character RANGE to `str.strip`, which takes
  a SET, so it stripped three characters and reported zero on the exercise it was written
  for

### 3. Derive expected values by execution; never type them

Every `sampleOutput`, every pinned expectation, every checkpoint answer is produced by
running a reference solution. Typed expectations are how `Running: {{file}}` and a stale
`Queue size: 3` reached learners, how the phase 27 capstone promised `$23,300` while
printing `$22,550`, and how `ex7_zero` demanded a total of `10200` from inputs summing to
`11000` — an exercise that could not be passed.

`scripts/audit/reference_solutions.py` holds one solution per exercise. Each is written
**from the task's stated rules**, never from the expectation it is checked against. That
distinction is the whole method: if a solution that follows the description fails, the
exercise has a requirement it never disclosed.

### 4. Check the running app, not the source

Seven checkers all reported zero while every correct answer in twelve phases was being
marked incomplete. The exercise data was right; the app was wrong. Twenty minutes of
using it found what none of them could see.

`npm run audit:learner` drives the real UI. Anything about rendering, grading feedback,
service workers or offline behaviour must be verified there.

---

## The checks, and what each one proves

Run everything: `npm run audit:content:extra`

| command | proves |
| --- | --- |
| `audit:content:expectations` | every pinned expectation is producible by a real solution |
| `audit:content:parity` | every graded exercise is verified by execution, and no structural requirement is undisclosed |
| `audit:content:cheat` | no exercise accepts a hard-coded answer |
| `audit:presentation` | print order and spacing do not decide the grade, while a wrong value still fails |
| `audit:content:free-values` | no exercise invites a free value then grades one specific answer |
| `audit:content:dead-stores` | no value is computed and thrown away |
| `audit:content:drift` | the two languages state the same facts |
| `audit:language` | no English prose reaches a Portuguese learner |
| `audit:pt-grading` | a translated exercise still passes when solved in Portuguese |
| `audit:sw` | the built service worker matches the update policy in the config |
| `audit:learner` | a correct solution passes end to end in the real UI, **in both languages** |
| `audit:offline` | every route survives a reload with no network, and says it is offline |
| `audit:content:described` | the task and the sampleOutput promise what the program prints, in both languages |
| `audit:portunol` | no comment reaches a learner in neither language |

---

## Procedure for bringing a new phase range up to standard

Work in this order. Each step depends on the one before it.

**1. Write a reference solution for every graded exercise.**
Into `scripts/audit/reference_solutions.py`, from the task description only. Do not read
the expectation first. Run `npm run audit:content:expectations`; every mismatch is either
a wrong expectation or an undisclosed requirement, and both need a human decision.

**2. Close the disclosure gaps.**
`npm run audit:content:parity` lists structural requirements the task never mentions.
Decide per case: either state it in the task, in both languages, or remove the
requirement. Prefer removing it when it is incidental to what the phase teaches —
`p15-transfer` and `p16-transfer` demanded f-strings in phases about docstrings and scope.

**3. Prove a hard-coded answer fails.**
`npm run audit:content:cheat`. Phases 9–20 stop cheats with a second test case; phases
0–8 stop them with structural requirements. Either is fine. Neither is not.

**4. Translate, then prove the translation did not break grading.**
Add exact entries to `exactPt` (comments) and `literalPt` (printed strings) in
`src/lib/localization.ts`. Never rely on the word-level fallback: an unlisted comment
becomes Portuñol — *"Build the 4-tier waterfall (highest primeiro!)"* — which is worse
than plain English.

Translating printed output changes what a program prints, so `sampleOutput.pt` must be
updated to match, **derived by running the translated reference**. `npm run
audit:pt-grading` runs every graded exercise as a Portuguese learner and fails if it no
longer passes.

**4b. Re-derive every promised output, then prove it.**
Adding one entry to `literalPt` changes what every program containing that string prints,
which makes the task text quoting that output stale from that moment on. That is how
"Queue size: 3" survived in phase 8's task while the code printed "Tamanho da fila: 3".

```
python3 scripts/audit/retranslate-outputs.py --dry-run   # preview
python3 scripts/audit/retranslate-outputs.py             # rewrite from execution
npm run audit:content:described                          # prove it
```

`retranslate-outputs.py` never invents Portuguese: it substitutes a line one run printed
for the line the other run printed in the same position. A string with no `literalPt` entry
produces identical runs, no pair, and no edit — so an untranslated exercise stays visibly
untranslated instead of quietly half-fixed.

**4c. Read what the checker could NOT read.**
`audit:content:described` prints the exercises it skipped. A coverage number that hides its
own gaps is how phases 7 and 8 passed while promising the wrong output in both languages:
every `_fill` exercise was skipped because its starter still contains `___`, and nobody had
written the reference solution that would have let it run.

**5. Check the two languages say the same thing.**
`npm run audit:content:drift`. Being in the right language and saying the right thing are
different properties; only the second one protects the learner. The false-friend rules in
that file exist because the curriculum began as an insurance-claims theme, the English was
rewritten to neutral wording, and the Portuguese was not.

**6. Work through the phases in the browser, in both languages.**

```
npm run audit:learner                 # every phase, English and Portuguese
npm run audit:learner -- --phases=0-8 # a range
npm run audit:learner -- --langs=pt   # one language
```

This is the step that finds what the others cannot, and it is the only one that reads the
app the way a learner does. It writes `audit-reports/learner-agent.md` after every phase,
so an interrupted run is still worth reading, and it never stops at the first problem — it
records and continues to the end.

Each language gets its own fresh session with nothing unlocked. That is not tidiness:
sharing a session means the second language starts with exercises already completed, the
app re-selects the first incomplete one, and the run silently grades the wrong exercise.
Learner progress is cleared when the run finishes, so re-running is the same experiment
rather than a continuation of the last one.

Phases with no reference solution are not skipped. They are opened, rendered and read —
does the page load, does the editor hold the right starter, is the visible text in the
learner's language — so phases 21–68 are covered today and graduate to full grading as
references are written for them.

---

## Grading principles

**Logic outranks presentation.** A learner who computes the right answer and prints it in
a different order, or with different spacing, has solved the exercise. `samplePattern`
requires each expected line to appear somewhere, in any order, with flexible whitespace.
A wrong *value* still fails.

The tolerance applies to checks built from the learner's own `sampleOutput`, where print
order is their choice. It does **not** apply to checks reading the grader's `afterCode` —
`p10-complete-stock` prints the updated record and then the original to prove the copy
happened, and there the sequence is the behaviour under test.

**A failure message must name the difference.** "Expected X, got Y" is useless when X and
Y differ by one word at the end. `describeLineDifference` reports the missing tail, the
extra tail, or the point of divergence. When every expected line is present, it says the
order is wrong rather than claiming a visible line is absent.

**A check may be lenient; it may never claim to have verified what it did not read.** The
`expected-output` check is skipped entirely for exercises graded through `afterCode`,
because there the learner's stdout was never the deliverable. Skipped, not passed — a
green tick for something unexamined is the same lie in the other direction.

**Answers must not be findable by position.** The quiz and lesson checkpoints shuffle per
question. The authored data is skewed — 227 of 252 quiz answers are option 1 — which is
harmless only while that shuffle exists, so `answerPosition.test.ts` pins it.

---

## What is still open

- **155 English strings** still reach a Portuguese learner: 0 in phases 0–20, the rest in
  21–68. `npm run audit:language` counts them down.
- **Behavioural grading is built, fixed and still hidden.** It evaluates logic by running
  a reference against inputs the grader controls, which is what actually diagnoses *"your
  loop is right but you divided by 7 instead of `len(songs)`"*. Its blocker is structural:
  an exercise with no `input()` has exactly one behaviour and it is whatever the learner
  chose to print. Widening it means giving those exercises inputs — a curriculum change,
  not a checker change.
- **Multi-case grading in phases 0–8**: 5 of 18, for the same reason. Reported by
  `audit:content:parity`, deliberately not gated.
- **`audit:learner` has only been run over a few phases.** A full bilingual pass is
  roughly 69 phases × ~3 exercises × 2 languages at ~15s each, so it is an hours-long
  run best done in ranges. Its first findings on phases 1–2 were all real: sample outputs
  shown in English to a Portuguese learner, and a half-translated comment reading
  `# preencha: subtract`.
