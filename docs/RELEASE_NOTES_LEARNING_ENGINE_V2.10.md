# Learning Engine V2.10 — Integral curriculum audit

## Purpose

The old pedagogy audit still scored the legacy lesson block count. After the ten-stage Learning Engine migration, that produced misleading results: a phase could have a complete authored journey and still be marked critical because its original lesson was short.

V2.10 replaces that audit with a curriculum gate that understands the current product.

## What is audited

- all 69 individually authored reasoning journeys;
- canonical order of the ten learning stages;
- beginner-facing clarity in English and Portuguese;
- deliberate practice and exercise-specific grading;
- progressive hints and quiz explanations;
- visible exam inputs and expected outputs;
- agreement between published output and grader checks;
- hidden generalization cases;
- skill mapping and track ranges;
- mini-project contracts, test evidence, edge cases, and refactoring;
- shared guarantees such as optional journals and top-of-page lesson navigation.

## Honest release policy

Only contradictions and missing foundations block the release. Improvement findings remain in the report as a prioritized backlog. The audit does not claim that automated checks prove perfect teaching.

## Generated evidence

The report includes Markdown, JSON, CSV, and a small manifest. GitHub Actions uploads the evidence on every push and pull request. The overnight audit ZIP also contains the curriculum report.

## Current baseline

At package validation time:

- 69/69 phases had authored ten-stage journeys;
- 69/69 phases had visible bilingual exam contracts;
- no blocking contradiction was found;
- the report kept real improvement work visible, especially behavioral exercise grading and hidden generalization in early phases.

The baseline is generated again after installation; it is not hard-coded as a permanent claim.
