# Sprint 9.1 — Pedagogical Quality Baseline

Sprint 9 begins the curriculum-quality phase. The app already verifies technical behavior; this release adds a deterministic pedagogical audit for all 69 phases.

## What the audit evaluates

- meaningful bilingual phase purpose;
- lesson depth and worked-code coverage;
- common mistakes and professional best practices;
- at least three levels of deliberate practice;
- an active first exercise that requires prediction, modification and explanation;
- behavioral grading for independent exercises;
- progressive hints;
- quiz breadth and explanatory feedback;
- visible and hidden exam scenarios;
- core bilingual completeness.

## Commands

```bash
npm run audit:pedagogy
```

Outputs:

- `pedagogy-report/PEDAGOGY_AUDIT.md`
- `pedagogy-report/pedagogy-audit.json`

The quality gate now runs this audit automatically. Sprint 9.1 intentionally reports weaknesses instead of mass-rewriting the curriculum. Subsequent Sprint 9 packages use the ranked backlog to improve phase groups without hiding the baseline.
