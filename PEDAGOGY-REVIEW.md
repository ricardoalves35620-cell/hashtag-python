# Can a total beginner follow these exercises?

Hashtag Python — learner-side review, 28 July 2026

## How this was done

You asked me to answer without reading the code and without using the source to pass
the tests. So I didn't. I opened the app in a phone-sized browser, entered as a guest,
picked the onboarding profile *"I still get lost with files, folders, downloads"*, and
read nine exercises across phases 0, 1, 2, 3, 4 and 5 exactly as they appear on screen
— every hint revealed, both languages. I only went to the source afterwards, to fix
what I'd found.

That constraint mattered. The bug below is invisible from the source and invisible to
the test suite. It is only visible if you look at the screen.

---

## The answer, in one line

**Yes for the exercises themselves. No for the frame around them.** The per-exercise
instructions are unusually well written for beginners. The reusable copy wrapped around
every exercise was written by someone who already programs, and it is the first thing a
beginner reads.

---

## 1. The bug: your first exercise taught template syntax

The very first exercise in the curriculum — the first Python a new learner ever sees —
told them to expect this output:

```
Running: {{file}}
Python is ready
```

The starter code above it says `file_name = "meu_primeiro.py"`. So the screen showed a
beginner a variable holding `meu_primeiro.py`, and then told them the correct answer
was `{{file}}`. Someone who has never written code has no way to know which of those
two is a lie.

`{{file}}` is a template token. Authored content stores it so the content audits keep
seeing one canonical wording, and every surface substitutes it at render time — except
this panel, which is the one a beginner reads most literally, because it is the thing
they are trying to reproduce.

Nothing errored. No test failed. 380 tests were green over it.

**Fixed.** It now reads `Running: meu_primeiro.py`, in both languages, and two new tests
guard it: a token nobody knows how to substitute now fails the build, and so does a
contract field rendered raw. The same hole in the exam panel is closed too, even though
no exam authors a placeholder today.

---

## 2. What is genuinely good — and I want to be specific, because it's the part worth protecting

The per-exercise writing anticipates the beginner's actual confusion instead of
restating the task.

**Phase 0, exercise 2:**

> Fill in the two blanks with the correct text values.
> Blank 1 — `python_extension`: the file extension used by Python programs
> Blank 2 — `long_term_files`: the name of the long-term location where files are kept
> **Both values are text and need quotes.**

That last sentence is the single most common first-week error in Python, pre-empted
before it happens. Most courses let you fail first.

**Phase 3, exercise 1** explains `+=` as *"watch how a running total changes"* and then
shows the exact five lines of output including the one the learner has to add. Concept,
mechanism and target in three sentences.

**The hints escalate properly** rather than repeating the question:

> Hint 1 — Before running, predict the two lines you expect to see. This turns execution into a test of your reasoning.
> Hint 2 — The variable `file_name` stores text. The first print combines a label with that stored value.
> Hint 3 — After the first run, change only the filename text, run again, and confirm which part of the output changed.

Hint 1 is strategy, hint 2 is the concept, hint 3 is the mechanical step. That's a
deliberate ladder, not three ways of saying the same thing. Whoever wrote this knew
what they were doing.

---

## 3. Where it fails a beginner — and why the structure guarantees it

Across nine exercises I found only **three distinct variants** of the framing copy. It
is phase-level boilerplate, so it *cannot* be exercise-specific — which means whatever
is wrong with it is wrong on every single screen, including screen one.

Here is what a learner who just told you they get lost with files and folders read,
above their first line of Python:

| On screen | The problem |
|---|---|
| "Ignoring the first useful **traceback** line." | Never defined. Never will be, at this stage. |
| "a **call to** print()" | "Call" is not being used in its English sense. |
| "This is the **canonical** expected form." | A word most native speakers don't use. |
| "**Visible exercise contract**" | "Contract" here means a spec, not an agreement. |
| "Finish without **syntax or runtime** errors." | Two error taxonomies, before the first error. |

None of these break anything. They just quietly tell a beginner that this is not for
them. This is the well-documented failure mode where domain vocabulary that reads as
neutral to the author reads as a gate to the reader — and the finding that consistently
surprises people is that plain language doesn't only help novices, it measurably
[improves comprehension for experts too](https://www.nngroup.com/videos/plain-language-for-experts/).
Nobody is on the other side of this trade.

**Changed today**, in both languages:

```
"a call to print()"                → "that you use print()"
"the canonical expected form"      → "exactly what we expect to see on screen"
"Visible exercise contract"        → "What your program should show"
"Ignoring the first useful         → "Skipping the error message instead of
 traceback line"                       reading which line it points at"
```

The last one is a curriculum-level string (`base` stage), so it changes for every
beginner phase. A test now fails if the word *traceback* reappears in beginner copy.
Introduce it deliberately, later, when you're teaching it — not as an aside on day one.

---

## 4. A second thing the screen showed that the source hides

On phases 0 and 1, the panel headed **Expected output** shows real output in terminal
green. On phase 3 it shows this, in the same green, in the same monospace box:

> The program must finish without errors and produce the behavior described in the instructions.

A learner who has spent two phases learning that this box contains text to reproduce
now has a sentence in it. That is a trained expectation being broken by the app itself.

The cause: `ex2_guided` through `ex8_guided` — the **guided opener of every phase from
2 to 8**, i.e. exactly the exercise where a beginner most needs to see the target —
author no `sampleOutput`, so the contract falls back to prose.

**Half of this I fixed**: prose is now shown as prose, under *"What counts as done"*,
not as fake output.

**Half of it is yours to decide.** Those seven exercises *do* state their expected
output — it's sitting in the goal text right above the panel. Moving it into
`sampleOutput` would let the panel show it. But that also adds an output-matching check
to the grader, and for exercises where the learner supplies their own values, a
carelessly authored sample turns a correct answer into a failure. That is the worst bug
you can ship to a beginner, so I did not do it blind for seven exercises I would then be
guessing at.

This is also, I think, the concrete face of the "256 v11 gate issues" sitting in your
backlog as *exact-check-regression, phases 1–8 dropped from 2 exact output checks to 0*.
It isn't an abstract audit number. It's the expected-output box going vague at exactly
the point in the course where a beginner is most fragile.

---

## 4b. What verifying §4 turned up — the worst bug of the whole effort

You asked me to fix what I'd found, so I went to close §4 properly: author the
missing outputs, then prove a correct solution still passes by running it through the
real grader in a browser rather than trusting my reading of the code.

To do that I had to seed a solution into the editor. It kept coming back as starter
code. That was not my harness.

**Opening an exercise destroyed the code you had saved in it.** Every exercise, both
editors, silently, before the screen even painted. Three links, each defensible alone:

1. CodeMirror reports `docChanged` for a programmatic write exactly as it does for a
   keystroke — so setting the editor's value (switching tabs, restoring a draft)
   announced the incoming text as *your* edit.
2. The page queued that "edit" as a draft, built from state that still held the
   starter, because the restore hadn't run yet.
3. `loadLocalDraft` serves a queued draft ahead of localStorage — correct on its own,
   a pending write really is newer than disk — so the restore read back the starter
   that step 2 had just queued, and committed it. Then synced it to the cloud.

A learner who solved phase 4, closed the tab and came back found the starter code.
Nothing threw. No test failed. It would look, from your side, like they never did it.

Both editors now mark their own writes and ignore them; only a keystroke counts as an
edit. `TestInputEditor` had the same shape — it re-parses your code for `input()`
prompts and reported that on mount — so derived values are labelled and no longer
persisted, and nothing is written before the saved draft has loaded. Verified on both
paths that used to lose work.

**Then the negative test found a second one.** I fed the grader a deliberately wrong
answer — `3435` where the task asks for `3535`. It replied:

> ✓ Produces the required result   3/3   100%

The leniency is deliberate and should stay: an observation exercise passes on the
predict → run → change cycle, not on matching a sample. What was wrong is the
sentence. Being told your result is the required one is a reason to stop checking, so
a wrong answer gets confirmed by the app and carried forward. The strict wording is
now reachable only when a comparison actually happened; otherwise the check says what
it did — *the program produced visible output* — and tells the learner this step
wasn't compared, so they should check it against the goal themselves.

I'd flag the pattern more than the two bugs. Both, plus the `{{file}}` leak and the
"Validated / Why it failed" contradiction from earlier, are the same failure: **a
component reporting something it didn't do.** The editor reported an edit nobody made.
The check reported a comparison it never ran. The panel reported an expected output it
hadn't substituted. Your test suite can't catch these, because in every case the code
does exactly what it says — the lie is in what reaches the learner.

## 4c. On §4's original recommendation — I was half wrong

I wrote that filling in the seven missing `sampleOutput` fields "changes what the
grader enforces" and was therefore your call. That was wrong, and I could have known
by reading twenty lines further: `applyFoundationHardening` runs
`if (index > 0) ensureExerciseGrading(...)`. The guided exercise is index 0, so its
`sampleOutput` is **display only** and cannot tighten grading at all.

Four of the seven are now filled in, each verified end-to-end with a modified
solution. The remaining three (ex2, ex7, ex8) really do vary with a value the learner
picks, so they keep the behaviour wording — which §4's fix already made honest.

## 5. Two things I'd push back on, that are yours to overrule

**The predict-gate on exercise 1.** Run is disabled until the learner writes a
prediction of at least 10 characters and describes one change of at least 3. The
pedagogy is sound — predict-then-observe is one of the better-evidenced moves in
science and programming education, and it's the correct antidote to
run-and-hope. But on phase 0 you are asking someone to predict the behaviour of
notation they have never seen, before they are allowed to find out what it does. For a
confident learner that is productive friction. For the person who told you they get
lost with downloads, a disabled button on screen one is a plausible place to quit.

I would not remove it. I would consider letting the *first* exercise of the whole course
run once, then gate the prediction on the second run onward. You'd keep the habit and
lose the cold-start wall. Worth an A/B rather than my opinion — I have no data on your
funnel and you may well already know that drop-off is elsewhere.

**"Why this matters at work."** Every exercise, from the first one, justifies itself in
career terms. That's a real motivator for a career-changer, and I assume that's your
audience. But it appears before the learner has any evidence they can do this at all,
and for someone learning out of curiosity it's a persistent reminder that they're in
the wrong room. Consider making that line stage-dependent: it fits the `professional`
stage perfectly and sits oddly on `base`.

Both of these are product judgement calls, not defects. I'm flagging them because you
asked me to find the blind spots, and "the copy is technically correct" is exactly where
blind spots live.

---

## 6. One thing I found while fixing the rest

The app defaults to **English** for a learner who has never chosen a language. Your own
configuration screen and crash screen both default to **Portuguese**. So a learner on a
Brazilian phone could be told about a problem in Portuguese and then taught in English.

Given the brand, I read the English default as an oversight rather than a decision. It
now follows the device language when nobody has chosen; an explicit choice and an
account-level preference both still win, and the toggle stays on the login screen. If
that's wrong and you deliberately want English-first, it's one line in
`src/contexts/AppContext.tsx` — `initialLang()`.

---

## What changed today

| Change | Kind |
|---|---|
| Opening an exercise no longer overwrites your saved code | **Data loss** |
| A check no longer claims to have verified what it never read | **Correctness** |
| `{{file}}` no longer reaches the learner (exercise + exam panels) | Bug fix |
| Guided opener of phases 2-8 shows its expected output again (4 of 7) | Content |
| 3 descriptions that disagreed with their own code | Content |
| Prose no longer styled as program output | Bug fix |
| Beginner jargon replaced in 4 shared strings, both languages | Copy |
| Language follows the device when unset | Bug fix |
| Regression tests for all of the above | Guard |

407 tests green, typecheck clean, build clean, first-paint payload 136.7 kB gzip —
within budget. The two data bugs were found and fixed in a real browser with a real
Python runtime, and re-verified there after the fix, in both directions: a correct
answer still validates, a wrong one still gets rejected with a usable diagnostic.

## Still open, and needing you

1. **Deploying.** I cannot reach Cloudflare from here: `api.cloudflare.com` is blocked
   at the sandbox proxy, and the Cloudflare access granted to this session covers
   Workers, D1, KV, R2 and Hyperdrive but exposes no Pages tooling. Everything is
   committed and on your disk; the push is yours, or give me a GitHub token and I'll do it.
2. **`.github/workflows/quality-gate.yml`** — protected path, needs pasting by hand.
3. **One manual account-deletion run** against the live backend, and a physical iPhone
   keyboard check. My sandbox has no route to `supabase.co`, so those two are the only
   claims in this whole effort I cannot make myself.

---

### Sources

- [Plain Language For Everyone, Even Experts — Nielsen Norman Group](https://www.nngroup.com/videos/plain-language-for-experts/)
- [Sweller, Cognitive Architecture and Instructional Design: 20 Years Later — *Educational Psychology Review*, 2019](https://link.springer.com/article/10.1007/s10648-019-09465-5)
- [Special Issue on Cognitive Load Theory: Editorial — *Educational Psychology Review*, 2019](https://link.springer.com/article/10.1007/s10648-019-09474-4)
