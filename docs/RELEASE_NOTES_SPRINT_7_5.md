# Sprint 7.5 — Login proof and visible auditor

- Requires the dedicated audit account; visitor fallback is disabled.
- Clears stale guest flags before every login.
- Verifies the authenticated email on Profile before auditing phases.
- Saves an authenticated-session screenshot in every Playwright result.
- Adds an explicit login test to every cycle.
- Adds visible browser mode with configurable slow motion for short diagnostics.
- Keeps headless mode for long overnight runs.
- Prints each action (login, profile, phase overview and lesson) in the terminal.
