# Sprint 10.3 — Visible exercise contracts

Every exercise now publishes the same visible input/output contract used by its grader.

- Concrete input values are displayed, or the screen states that no input is required.
- Expected output is displayed before execution for all 207 exercises.
- Visible grading cases and `sampleOutput` share one resolver.
- The input editor loads values from the visible grading case when no separate suggestion exists.
- Hidden tests remain private.
- The curriculum quality gate blocks future exercises with missing bilingual output or missing public input values.
- Generated curriculum and pedagogy reports are ignored by Git so they do not block the Windows updater.
