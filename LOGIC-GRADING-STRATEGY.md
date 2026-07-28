# Task 2 — Grading the logic instead of the letters

Hashtag Python · 28 July 2026

## First, a correction to the premise

> "Currently, answers are checked for exact text/string matches."

Only half true, and the half that is false changes the plan.

`public/python.worker.js` already parses the learner's submission with Python's own
`ast` module and returns a structured analysis: node counts by type, every call name,
every import, every assigned name, per-function argument lists, which names each
function actually reads, literal return values, docstring presence, and `__main__` guard
detection. `meetsCodeRequirement` in `src/lib/pyodide.ts:347` evaluates
`codeRequirements` against it — `node:For`, `node:Try`, `function:name`, `import:json`,
`call:print`, `assignment:total`.

There is even anti-fraud: `detectHardcodedAnswer` catches a function that never reads
its own arguments and returns the expected literal.

**So the AST layer you were going to build is built.** What is missing is narrower and
more specific:

1. **The output check is still a string comparison.** `outputSimilarity` compares the
   learner's printed text to one authored `sampleOutput`.
2. **When nothing pins the output, the check degrades to "did it print anything"** — the
   bug fixed earlier today, where `3435` was reported as ✓ *Produces the required
   result*.
3. **There is exactly one observation per exercise.** One input, one expected output.
   Nothing tests a boundary, an empty input, or a value the author did not think of.
4. **The reference answer is authored prose, not executable.** Nothing verifies that the
   `sampleOutput` an author typed is what a correct solution actually produces — which
   is precisely how `Running: {{file}}` and `Queue size: 3` shipped.

Reframing accordingly: this is not "add AST parsing", it is **"replace the single
authored string with a reference implementation and a set of observations."**

---

## 1. Is it feasible?

Yes, and cheaply — because the hard parts already exist. You have a sandboxed CPython in
a Web Worker with a time budget, an AST analysis pipeline, and a check-result model
(`ValidationItem` with `label / passed / why / fix / concept`) that already renders good
feedback. What is needed is a new *source* of `passed`, not a new architecture.

The honest limit: this works for **code**. It does not work for the reflection and
journal prose the app also collects, and I will argue below that you should not try to
grade that at all.

---

## 2. Three approaches, compared for *this* stack

### A. Reference-implementation behavioural testing (sandboxed execution)

Run the learner's code and a hidden reference over a set of inputs; compare results
structurally.

**Pros**
- Accepts *any* correct implementation. A list comprehension, an explicit loop, and a
  version with Portuguese variable names all pass, because behaviour is identical.
- Expected values are **derived, not authored** — an author cannot typo them, and cannot
  forget to update them when the spec changes. This structurally prevents the
  `Queue size: 3` class of bug.
- Runs entirely in the existing Pyodide worker: offline, no API key, no latency, no cost,
  no new data processor under LGPD.
- Deterministic. Same submission, same verdict, always.
- Feedback is naturally specific: *"input 10000 — expected URGENT, you got CRITICAL."*

**Cons**
- Someone must write a reference per exercise (~5 lines) and choose cases.
- The reference ships in the bundle, so it is readable by a determined learner. It is a
  pedagogical aid, not a security boundary.
- Vulnerable to lookup tables if the case list is short — mitigated by the AST layer you
  already have.

### B. Extended AST / structural matching only

Grade purely on the shape of the code: "uses a `for`", "calls `sum`", "has a `try`".

**Pros** — already implemented; instant; no execution needed.

**Cons** — it is fundamentally the wrong tool for correctness. It cannot distinguish
`amount > 10000` from `amount >= 10000`, which is the single most common beginner error
in phases 5 and 6. And pushed further it becomes *prescriptive*: requiring `node:For`
fails a learner who correctly used a comprehension. Structure checks answer "did you
practise the technique this phase teaches", which is a real and separate question, and
they should stay scoped to that.

### C. LLM evaluation with a structured JSON schema

Send code plus rubric to a model; get back `{passed, reason}`.

**Pros** — handles conceptual prose; needs no reference; can explain *why* in natural
language.

**Cons, in the order that matters for this app**
- **It breaks the offline promise.** Running code offline after the first load is a
  feature you have already engineered for and advertise on the loading screen.
- **LGPD.** Learner-authored code sent to a third party is a new processing purpose and
  a new sub-processor. That is a consent and DPA question, not an engineering one.
- **Non-determinism.** Two identical submissions can get different verdicts. For a
  learner this is indistinguishable from the app being broken.
- **Cost and latency** on every Run press, for a free-tier product.
- **False positives are the dangerous direction.** An LLM asked "is this correct?" is
  agreeable; it will pass subtly wrong code. You saw today what a false ✓ does.

### The scoring

| | Correctness | Offline | Deterministic | LGPD | Authoring cost | Feedback quality |
|---|---|---|---|---|---|---|
| **A. Reference + cases** | ●●● | ●●● | ●●● | ●●● | ●● | ●●● |
| **B. AST only** | ● | ●●● | ●●● | ●●● | ●●● | ●● |
| **C. LLM** | ●● | ○ | ● | ● | ●●● | ●●● |

---

## 3. Recommendation

**Adopt A as the correctness layer. Keep B, scoped to "did you practise the technique".
Do not adopt C for grading code.**

Concretely: a check passes when

```
behaviour matches the reference on every case
  AND the structural requirements for the phase are met
  AND the anti-hardcoding heuristics do not fire
```

Three layers, each answering a different question — *is it right*, *did you practise the
thing*, *did you actually solve it* — instead of one string comparison pretending to
answer all three.

**On conceptual/prose answers:** do not grade them. The reflection and journal fields are
valuable *because* they are unjudged; a beginner who suspects their explanation is being
scored writes less honestly. If you eventually want feedback there, the right shape is a
Supabase Edge Function behind an explicit opt-in, returning a *comment*, never a
pass/fail — and it should never gate progression. That keeps the offline core intact and
keeps learner code out of a third party by default.

---

## 4. Implementation

Working prototype in `prototype/`. It runs on CPython, which is what Pyodide is, so it
transfers to the worker unchanged.

```
prototype/behaviour_harness.py   the grader
prototype/demo.py                a phase 9 function exercise
prototype/demo_beginner.py       a phase 6 print/input exercise
```

### Actual output — `python3 demo.py`

```
PASS  canonical — matches the reference exactly                    6/6
PASS  different shape, same logic (comprehension)                  6/6
PASS  different names, early continue, still correct               6/6

FAIL  subtly wrong — discount applied once, not per row            2/6
      × the worked example: expected 7700, got 8000
      × a case you have not seen: expected 20, got 25

FAIL  hardcoded to the visible example                             1/6
      structure: approved_total never reads its own arguments,
                 so it returns the same thing for every input

FAIL  lookup table dressed up as logic                             4/6
      × a case you have not seen: expected 100, got 0
```

Three structurally different correct answers pass. Three wrong ones fail, each with a
reason a learner can act on. Note the last: it passed 4 of 6 behavioural cases and was
still caught, by the branch-count heuristic.

### Actual output — `python3 demo_beginner.py`

Most of your course is top-level code that prints, so this matters more:

```
PASS  correct                                                       7/7
PASS  correct, written with a different but equivalent structure    7/7
FAIL  off-by-one: uses >= where the spec says >                     5/7
      × input 10000 (exactly the top boundary)
          expected: 🟠 URGENT — 4h SLA
          you got : 🔴 CRITICAL — 2h SLA
```

The second submission renames the variable to Portuguese, inverts the branch structure
and rewrites every threshold — and passes. The third differs from the reference by two
characters and fails, on a boundary case the learner never saw. No string comparison can
tell those two apart.

### The core, abbreviated

```python
def grade(learner_source, reference_source, entry, cases, mode="return"):
    # The reference runs in the same sandbox as the learner, so the expected answer is
    # derived rather than authored. An author who changes the spec cannot forget to
    # update the expected output — there isn't one.
    results = []
    for case in cases:
        expected = run_once(reference_source, entry, case)
        actual   = run_once(learner_source,  entry, case)
        passed, reason = compare(expected, actual, mode)
        results.append(CaseResult(case, expected, actual, passed, reason))
    return results
```

Two details that are not incidental:

```python
def _sandbox_globals(stdin):
    # A fresh namespace per case, plus a seeded random and a scripted input(). Without
    # those, a correct solution using random or input fails intermittently — the worst
    # kind of grading bug, because the learner cannot reproduce it.
```

```python
def equivalent(a, b, tolerance=1e-9):
    # Structural equality with the two exceptions that generate the most false
    # negatives: float noise, and dict/set ordering.
```

### Authoring shape

```ts
interface BehaviourSpec {
  entry?: string          // omit for top-level print exercises
  reference: string       // the hidden correct solution
  mode: 'return' | 'print'
  cases: Array<{
    args?: unknown[]
    stdin?: string[]
    label: { en: string; pt: string }
    visible?: boolean     // shown in the contract panel; the rest stay hidden
  }>
}
```

`visible: true` cases feed the **What your program should show** panel — which means
that panel stops being authored prose and becomes generated from a real run. The
`{{file}}` leak and the seven vague `sampleOutput` fields both disappear as categories,
not as individual fixes.

### Wiring into what exists

`gradeExercise` in `src/lib/learningValidation.ts` gains one branch before the existing
similarity check:

```ts
if (exercise.behaviour) {
  const results = await runBehaviourSpec(exercise.behaviour, learnerCode)
  const failed = results.filter(r => !r.passed)
  checks.push({
    id: 'behaviour',
    label: lang === 'en' ? 'Works on every case, not just the example'
                         : 'Funciona em todos os casos, não só no exemplo',
    passed: failed.length === 0,
    why: failed[0] && (failed[0].case.visible
      ? describeVisible(failed[0], lang)
      : describeHidden(failed[0], lang)),   // never leaks the hidden input
    concept: lang === 'en' ? 'Correctness' : 'Correção',
  })
}
```

Everything downstream — the feedback panel, the `satisfied` framing, the attempt
recorder, the skill model — consumes `ValidationItem` and needs no change.

---

## 5. Edge cases, and what I would get wrong first

| Risk | Why it bites | Handling |
|---|---|---|
| **Non-determinism** (`random`, `datetime`, `set` iteration) | Correct code fails on one run and passes the next. Unreproducible for the learner. | Seeded RNG and frozen clock injected per case; ordering-insensitive comparison for sets and dicts. Both in the prototype. |
| **Floating point** | `0.1 + 0.2 != 0.3`. Phase 22's compound-interest exercise is exactly this. | `math.isclose` with tolerance, in `equivalent()`. |
| **Infinite loops** | Phase 7 is `while` loops; a beginner's first one often does not terminate. | The worker already enforces `timeoutMs` (2500, 3500 for phases 7 and 23). A timeout must report *"your loop did not finish"*, never *"wrong answer"*. |
| **Case-list runtime** | 7 cases × 2 runs = 14 executions per press. | Pyodide is already warm; each case is milliseconds. Cap at ~10 cases and measure. Add a budget check to `scripts/audit/`. |
| **Lookup tables** | Behavioural testing alone is fooled when cases are few. | Branch-count and argument-read heuristics (in the prototype), plus your existing `detectHardcodedAnswer`. |
| **Leaking hidden cases in feedback** | Naming the failing input turns hidden cases into visible ones. | `visible` flag; hidden failures say *"a case you have not seen"* and name the concept, not the value. |
| **A wrong reference** | The reference becomes the spec. A bug in it fails everyone. | The reference must be exercised by CI against the exercise's own visible expectations. This is a real risk and the main reason to migrate gradually. |
| **`print` vs `return`** | Beginners print; later phases return. Grading the wrong one fails correct code. | Explicit `mode` per exercise, and `print` mode normalises trailing whitespace and blank lines. |

**The false-positive/false-negative trade** is worth stating plainly. Behavioural testing
moves errors from *false positives* (today: wrong answers marked ✓) to *false negatives*
(a correct answer failing a case the author specified badly). That is the right
direction — a false negative is visible, reportable and fixable; a false positive teaches
a beginner something wrong and is invisible to everyone. But it means **a badly chosen
case is now a bug that blocks learners**, so cases need the same review as content.

---

## 6. Migration I would actually run

1. **One phase.** Phase 6 (`if/elif/else`) — boundary-heavy, where string matching is
   weakest and the win is most visible. Ship behind a flag; keep the old check running in
   parallel and log disagreements.
2. **Read the disagreements for a week.** Every case where the two graders differ is
   either a bug in the reference or a bug in the old `sampleOutput`. Both are worth
   knowing before scaling.
3. **Phases 1–8**, where beginners are most fragile and the exercises are smallest.
4. **Function-based phases 9+**, where `mode: 'return'` is a cleaner fit than print
   comparison.
5. **Generate the visible contract from the reference run** and delete `sampleOutput` as
   an authored field. That is when the class of content bug found this week stops being
   possible.

Do not start at step 5. The reference-vs-old-check disagreement log in step 2 is the
cheapest bug-finding instrument in this whole plan, and skipping it wastes it.
