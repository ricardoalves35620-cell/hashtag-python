# Sprint 7.8 — Overnight audit fixes

## Product fixes

- Exercise code is persisted to local storage immediately after every edit.
- Slow cloud draft responses can no longer overwrite newer user input.
- Local and cloud hydration now respect edit timestamps.
- Starter-code restoration uses the selected language.
- Duplicate attempt IDs were removed.
- Quiz questions expose stable IDs.
- Quiz options expose their original indices.
- Confirmed Portuguese localization issues from the overnight report were corrected.

## Auditor fixes

- Draft persistence uses a unique marker and waits for an explicit saved state.
- Quiz answering uses stable IDs and original option indices, not localized text.
- 828 cycles now cover the complete device × language × theme matrix.
- Deduplicated issues keep a list of all affected phases.
- Large reports are compressed with streaming `tar.exe` on Windows.
- The default interactive overnight run is 828 cycles.

## Validation

- TypeScript approved.
- 88 automated tests approved.
- Production build approved.
- npm audit: zero vulnerabilities.
- Static localization audit: zero findings across 69 phases.
