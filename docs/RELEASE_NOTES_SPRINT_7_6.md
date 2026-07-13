# Sprint 7.6 — Deep Overnight Auditor

The auditor now performs a deep authenticated journey for one curriculum phase per cycle.

Each cycle validates:

- dedicated-account login and session recovery;
- phase overview and lesson completion;
- lesson scrolling, code-block clipping and horizontal overflow;
- editable exercise code, syntax-error feedback, placeholder handling and draft reload;
- periodic infinite-loop timeout behavior;
- randomized quiz completion using the real correct answers;
- exam runtime-error and submission feedback;
- one rotating supporting route such as Progress, Roadmap, FastTrack or labs;
- fatal browser console errors.

Individual step failures are collected instead of aborting the rest of the cycle. The cycle fails only after all planned steps have run, so a problem found early does not prevent deeper coverage.

The interactive runner defaults to 69 cycles, keeps Windows awake, prints live actions and ETA, and overwrites the desktop report ZIP at the end.
