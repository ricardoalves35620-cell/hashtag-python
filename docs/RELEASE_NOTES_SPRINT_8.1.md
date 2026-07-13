# Sprint 8.1 — Release gate and continuous quality

## Added

- GitHub Actions quality gate.
- Scheduled authenticated production audit.
- Daily rotation through 12 audit environments.
- Compact CI artifacts.
- Machine-readable audit gate.
- Build version and commit metadata.
- Release checklist.
- Dependabot configuration.

## Auditor reliability

- deterministic CodeMirror bridge;
- direct local-storage draft verification;
- quiz ID fallback;
- blocked service workers;
- one transient retry;
- final retry result classification;
- safe screenshot attachments;
- compact report by default;
- `-DetailedReport` opt-in;
- deployed version mismatch fails early.

## Validation target

Run a fresh 69-cycle audit after deployment. The report must show version `8.1.0`.
