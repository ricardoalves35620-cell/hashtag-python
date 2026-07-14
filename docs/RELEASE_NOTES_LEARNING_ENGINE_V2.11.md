# Learning Engine V2.11 — Foundation hardening

## Why this release exists

The V2.10 audit showed that the curriculum structure was strong, but early phases still allowed too much success through visible examples alone. V2.11 converts that backlog into concrete learning evidence.

## Changes

- Phases 1–27 now contain at least two behaviorally graded practice activities.
- Phases 9–27 receive a separate transfer challenge with a visible contract and a materially different hidden case.
- Every foundation exam includes hidden evidence and still totals exactly 100 points.
- Early input exercises receive suggested values that actually produce the published output.
- Hints use progressive layers: recall the model, locate the next structural step, then test a boundary without revealing the final solution.
- The Phase 12 portfolio mini-project now proves both a normal portfolio and a no-approved edge dataset.
- The first four learning journeys are corrected to match the actual sequence: first output, operators, variables, then user input.
- Phase 17 exam structure checks now match CSV parsing instead of incorrectly requiring file opening.

## Pedagogical rule

Visible output explains the contract. Hidden evidence checks whether the learner implemented the rule. The hidden check must not require a concept that has not yet been taught.

## Compatibility

No database migration is required. Existing progress remains valid. New or reset attempts use the hardened exercises and exams.
