# Learning Engine V2.10 — Curriculum Audit Standard

The curriculum gate evaluates the experience learners actually receive after the Learning Engine V2 migration. It does not infer depth from the number of legacy lesson blocks.

## Blocking conditions

A release is blocked when the audit finds a contradiction or missing foundation that may directly mislead a learner:

- duplicated or missing phase IDs;
- a phase using the generic journey fallback;
- missing or reordered reasoning stages;
- missing English or Portuguese core content;
- a Python translation stage without worked code;
- an exam without a visible expected-output contract;
- expected output that fails the same checks used by the grader;
- a mastery-gating mini project with an incomplete contract.

High, medium, and low findings are retained as a backlog. They do not disappear merely because the release gate passes.

## Phase dimensions

Every phase receives scores for:

1. Journey
2. Clarity
3. Practice
4. Assessment
5. Feedback
6. Progression
7. Localization
8. Project evidence
9. Shared learning experience

The report contains the weighted score, classification, dimensions, strengths, findings, and metrics for every phase.

## Commands

```powershell
npm run audit:curriculum
```

Artifacts:

```text
curriculum-audit-report/CURRICULUM_AUDIT.md
curriculum-audit-report/curriculum-audit.json
curriculum-audit-report/phase-matrix.csv
curriculum-audit-report/audit-manifest.json
```

The backward-compatible `npm run audit:pedagogy` command runs the same V2.10 audit.

## Quality gate

`npm run quality:gate` runs type checking, tests, production build, bilingual content checks, the curriculum audit, and the dependency audit.

The Windows and scheduled overnight auditors include the curriculum report in the compact ZIP. This lets the deep browser run verify behavior while the static curriculum gate verifies authored content and contracts.

## Interpretation

- 90–100: release-ready
- 80–89: minor review
- 65–79: important review
- 0–64: critical

A high score is not proof of learning. Static auditing cannot measure retention, confidence calibration, transfer to a novel project, or whether a real beginner understands an explanation. Those questions require learner observation and longitudinal data.
