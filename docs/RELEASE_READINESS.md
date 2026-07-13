# Release readiness gate

## Required on every change

- `npm ci`
- `npm run quality:gate`
- no committed `.env` files or audit credentials
- production build succeeds
- content audit has no errors
- unit and integrity tests pass

## Required before a release

- one fresh 69-cycle deep audit passes against the exact deployed version
- no loss of authenticated progress or code drafts
- no unresolved critical or high-severity issue
- login, lesson, exercise, quiz and exam flow pass
- compact report is attached
- rollback commit or previous deployment is known

## Required before calling the product stable

- all 12 device, language and theme environments have passed
- nightly audit remains green for seven scheduled runs
- accessibility audit is complete
- curriculum and assessment review is complete
