# Sprint 7 — Quality Auditor

## Purpose

The auditor repeatedly scans the product without stopping at the first failure. Every issue receives a stable fingerprint. If the same problem appears again, the next cycle records another occurrence but treats it as already known, then continues to new phases, languages, themes and viewports.

## Layers

1. **Content/localization audit** — checks 69 phases for missing translations, mixed-language comments and translated Python syntax.
2. **Visual E2E audit** — Playwright opens guest flows on phone, tablet and desktop; checks rendering, horizontal overflow and fatal browser errors.
3. **Autopilot aggregation** — rotates phase batches, PT/EN, light/dark and device profiles; deduplicates failures and generates one cumulative HTML report.

## Important behavior

- A failed cycle never stops the overnight run.
- Repeated failures are counted as known issues and do not block discovery.
- State is stored in `playwright-report/autopilot/state.json`, so a later run resumes from the next phase.
- `--fresh` removes previous findings and starts a clean campaign.
- Creating `.autopilot-stop-after-cycle` requests a graceful stop.

## Reports

- `playwright-report/autopilot/index.html` — cumulative overnight report.
- `playwright-report/autopilot/state.json` — machine-readable state and deduplicated findings.
- `playwright-report/html/index.html` — Playwright report for the latest visual cycle.
- traces, screenshots and videos are retained for failed visual tests.

## Current limitations

- The first visual run requires downloading Playwright Chromium.
- Account-only synchronization scenarios still require a dedicated QA account; guest mode covers the complete public learning shell.
- Localization heuristics intentionally report suspects for human review. They do not automatically rewrite all 69 phases.
