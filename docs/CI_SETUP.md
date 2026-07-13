# GitHub Actions setup

Sprint 8.1 adds two workflows.

## Quality Gate

Runs on every push and pull request to `main`.

After the first successful run, configure branch protection for `main` and require:

`Typecheck, tests, build and content audit`

## Nightly Deep Audit

Create these repository Actions secrets:

- `AUDIT_USER_EMAIL`
- `AUDIT_USER_PASSWORD`

Use the dedicated audit account. Never commit these values.

The scheduled job runs 69 cycles and rotates one of the 12 device, language and theme environments each day. The artifact is compact by default.

```powershell
.\run-auditor.ps1 -Cycles 69 -DetailedReport
```

Use the command above only when videos and traces are required.

## Recommended repository settings

1. Require a pull request before merging to `main`.
2. Require the Quality Gate status.
3. Require branches to be up to date.
4. Block force pushes and deletion of `main`.
5. Enable Dependabot alerts and security updates.
