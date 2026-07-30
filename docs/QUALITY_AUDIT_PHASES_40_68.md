# Phases 40–68: expectations verified by execution (2026-07-30)

58 graded exercises had no reference solution; nothing had ever proved their
expectations reachable. All 58 references now exist in
`scripts/audit/reference_solutions.py`, written from the task statements only
(description + starter docstring + codeRequirements), with the expectations
withheld from the authors. `audit:content:expectations --through=68`: 297
graded test-runs, 286 reproduced, 11 not.

The handoff predicted the yield ("assume the 21–27 rate continues until it
stops"): it continued. Two kinds of finding, different severities.

## Undisclosed requirements (10 exercises — references updated, task text must catch up)

The pinned test demands something the task never states. The reference was
updated to the revealed contract (each carries a `# Revealed by the pinned
test` comment), so these now verify — but a learner still meets the
requirement with no warning. Each needs its task text (both languages) to
state the contract:

| exercise | what the test reveals that the task never says |
| --- | --- |
| p44-practice | `combine_money([])` must be `Money(0, 'CAD')` |
| p48-transfer | the "underlying work" squares its argument |
| p50-practice | result's `error` key holds the message pulled from the payload, not the payload |
| p52-practice | returns `{"ready": bool, "failures": [names in canonical order]}` — docstring implies a bare bool |
| p53-practice | orders are `{quantity, unit_price}` dicts; returns a dict with rounded `total` |
| p56-practice | returns a list of plain records, not a DataFrame; "invalid" = non-numeric amount |
| p62-transfer | returns a LIST of averages in epoch order, not a mapping |
| p67-practice | chunks are space-joined strings; the trailing shorter chunk is kept |
| p67-transfer | the trailing shorter chunk is kept |
| p68-practice | passages carry `source` (not `id`); always returns a dict — the docstring's "insufficient evidence" is not a return value |

## Unpassable or self-contradictory (7 exercises — RESOLVED 2026-07-30, owner said "go ahead")

A solution that follows the task's own words could not pass. All seven are now
fixed; every new expected value was DERIVED by running the reference, never
typed. The first fix attempt used `contains` and was correctly rejected by two
guards (`v11GradingHardening` bans partial contains on migrated phases;
`audit:content` demands bilingual justification) — the shipped fix keeps
`equals` and changes the GRADER-OWNED afterCode to print an unambiguous
contract instead: p43 no longer prints the (unspecified) yield value; p49
prints `"WHERE status = ?" in sql` plus the params tuple; p66 prints argv
membership booleans so the command format stays the learner's choice. p47,
p48, p51 and p58 got full derived expectations following their own stated
text.

Five are one defect class: **`equals` used on a fragment of the output** — the
check compares the WHOLE stdout to a substring of it, so no output can ever
match (the same class as the "a pattern is not an answer" fix, from the other
direction):

- **p43-practice** — afterCode prints the yielded value and the events list;
  expected `equals 'enter'` / `equals 'exit'`. Likely meant `contains`.
- **p49-practice** — test 0 prints the `(sql, params)` tuple; expected
  `equals 'WHERE status = ?'`. Test 1 (`[1]` == params) passes. Likely `contains`.
- **p51-practice** — test 1 prints the redacted dict AND `original["password"]`;
  expected `equals 'p'`. The non-mutation proof needs `contains` or a
  full-output expectation.
- **p66-practice** — prints the command list (a `List` node is REQUIRED);
  expected `equals '127.0.0.1'` / `equals '4096'`. No list prints as a bare
  fragment. Likely `contains`.
- **p58-practice** — expected `'[8, 9]'` / `'[4]'` is only the LAST of the
  three slices the docstring demands ("return train, validation and test
  slices"). Either the expectation should be the full tuple (derive by
  execution) or the task should ask for only the test slice.

Two contradict their own statements:

- **p48-practice** — docstring: "Return squared results AND number of unique
  computations." Expected: `'2'` / `'0'` — the count alone. One of them lies.
  (p48-transfer pins the tuple form, so the docstring is probably right and
  the expectation wrong.)
- **p47-transfer** — docstring commands order-given greedy ("give each NEXT
  item to whichever worker currently has the least"), which yields `[13, 5]`
  for `[5, 3, 2, 8]` across 2 workers. Expected `[10, 8]` requires sorting
  the items descending first (LPT). State the sort, or re-derive the
  expectation from the stated algorithm.

## Decision needed

Per CURRICULUM-STANDARD: expectations are corrected by DERIVING from a
reference run, never by typing; disclosure gaps are fixed in the task text in
both languages, then `audit:pt-grading` and `audit:content:described` prove
the translation didn't break anything. The 7 above are blocked on choosing,
per exercise, which side is lying — checks (`equals`→`contains` or re-derived
full output) or task text.

## Resolution log (2026-07-30)

All 17 findings closed at the grading layer: 297/297 graded test-runs now
reproduce by execution, 544/544 unit tests green, content and curriculum
audits pass. STILL OPEN: the 10 disclosure gaps above are fixed only in the
references — each task text still owes the learner the disclosure, in both
languages, and `audit:content:parity` remains the checker that tracks it.

## audit:learner, phases 40-68, both languages (2026-07-30)

First graded browser pass over this range: 174 exercise runs through the real
editor and real Pyodide. Three failures, all invisible to every source-level
checker because CPython is not the runtime learners get:

- **p46 (asyncio)** — the grader ran afterCode through a plain exec() under
  Pyodide's already-running webloop, where asyncio.run() raises and every
  run_until_complete() variant returns a pending task (all three measured
  against real Pyodide 0.25.1). The worker now compiles afterCode with
  top-level await allowed and awaits the resulting coroutine; the CPython
  verifier mirrors the same semantics via asyncio.run. The first version of
  the fix shipped a backtick inside the worker's template literal and killed
  every run — caught because the fix was re-verified in the browser instead
  of assumed.
- **p55 (NumPy) / p56 (Pandas)** — loadPackagesFromImports() resolves wheels
  relative to the same-origin indexURL, and no deploy ever shipped any: the
  npm pyodide package contains zero wheels, so every import numpy in
  production 404'd into ModuleNotFoundError since the phases existed. The
  five wheels (numpy, pandas, python-dateutil, pytz, six — the lock's full
  dependency closure) are now vendored in vendor/pyodide-wheels,
  sha256-verified against pyodide-lock.json, and copied next to the runtime
  by scripts/copy-pyodide.mjs on every build.

After the fixes: phases 46, 55, 56 re-run clean in the app in both languages.
Full range: 174/174 runs clean.
