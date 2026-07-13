# Sprint 7.4 — Fresh Results and Per-Cycle Evidence

## Why this patch exists

The Sprint 7.3 report proved that the wrapper was running as version 7.3, but the Autopilot was still reading an older shared `results.json`. The five requested cycles completed in only a few seconds and repeated a Playwright failure generated ten minutes before the run.

## Changes

- Every cycle now receives its own directory under `playwright-report/autopilot/cycles/`.
- Playwright writes cycle-specific JSON, HTML, screenshots, video and traces.
- Shared stale `playwright-report/results.json` is no longer used by the Autopilot.
- A result is accepted only when its file modification time is newer than the Playwright process start time.
- Playwright is launched through Node and the local CLI, without `npx` or shell path parsing.
- If Playwright cannot start or does not create fresh JSON, the report records a `playwright-runner` issue instead of recycling an old failure.
- Content-audit launch failures are reported separately.
- Cycle rows now show device, process exit codes, result freshness and actual duration.
- The aggregate report includes a run ID, target URL and auditor version.
- The PowerShell launcher refuses to run an older Autopilot without the freshness guard.

## Expected behavior

A real visual cycle should usually take seconds rather than zero seconds. Test failures may return a non-zero Playwright exit code while still producing a fresh JSON report; those failures are parsed normally. Runner failures are distinguished from application failures.

## Report structure

```text
playwright-report/
  autopilot/
    index.html
    state.json
    cycles/
      cycle-001/
        content.json
        results.json
        html/
        artifacts/
```
