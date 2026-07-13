# Sprint 7.1 — Auditor stabilization

## Corrections

- Fixes a Playwright strict-locator false positive caused by selecting both `body` and `main`.
- Runs Node and `npx.cmd` without a Windows shell, avoiding the `C:\Program is not recognized` failure.
- Loads `.env.audit.local` automatically and signs in with the dedicated audit account when credentials are available.
- Creates a timestamped ZIP of the completed report on the Desktop.
- Deduplicates repeated failures by root cause instead of creating one issue per phase.
- Preserves the affected phase/test list in the aggregated issue.
- Continues language/theme/device rotation correctly when resuming a prior audit.
- Strengthens the localization audit for comments that remain in the wrong language.
- Protects Python commands such as `print`, `input`, `while`, and `if` from destructive comment translation.
- Adds manually reviewed bilingual code examples for phases 8 and 9.

## Audit report diagnosis

The first five-cycle report successfully traversed phases 0–9. All ten reported visual issues had one root cause in the auditor itself: a strict Playwright selector matched both `body` and the unique learning `main`. The screenshots showed the lessons rendered; the clipping assertion had not run yet because the test stopped at the selector.
