# Sprint 7.3 — Auditor provenance and localization fixes

## Report review

The uploaded audit report was produced by an older auditor build. It still used the ambiguous selector `main, [role="main"], body`, launched the local preview server instead of the configured production URL, and rendered the missing-Supabase configuration page.

## Changes

- Added auditor version `7.3.0` to console output, state, HTML report and run summary.
- Added a preflight check that refuses to run when the obsolete selector is present.
- Uses `HP_AUDIT_BASE_URL` or `AUDIT_BASE_URL` consistently and verifies the browser origin.
- Reports a clear failure when the app opens without valid Supabase configuration.
- Corrected bilingual code blocks reported in phases 1–4.
- Phase 0–4 localization audit now completes with zero findings.

## Validation

- TypeScript passed.
- 76 tests passed.
- Production build passed.
- npm audit found zero vulnerabilities.
