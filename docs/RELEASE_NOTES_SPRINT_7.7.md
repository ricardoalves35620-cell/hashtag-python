# Sprint 7.7 — Auditor reliability after deep-cycle report

## Report reviewed

The 7.6 report proved that authentication, lesson navigation, responsive checks, supporting routes, session recovery and the first complete deep cycle were working. It also exposed two auditor defects in phase 1:

1. The exercise auditor treated generic page text such as “Error” as fresh execution feedback. It started the next scenario while Pyodide was still running, so the run button was temporarily replaced by its loading label.
2. The quiz auditor used a partial regular-expression match. The expected answer `10` matched the distractor `"10"` before the exact answer `10`.

Neither failure demonstrated an application defect. Both were defects in how the auditor observed the application.

## Changes

- Exercise execution now waits for the run button to return to its enabled idle state.
- Exercise feedback must be produced by the current run through dedicated UI markers.
- Stable test identifiers were added to the exercise run button, exercise feedback, exercise output, quiz question, quiz options, quiz feedback and quiz next button.
- Quiz alternatives are compared as exact normalized answers after removing only their visible A/B/C/D label.
- Quoted and unquoted answers remain distinct.
- Added unit tests for quiz-option matching.
- Auditor version advanced to 7.7.0.
- Interactive overnight default changed to 414 cycles, approximately six complete curriculum passes.

## Recommended overnight run

Use 414 cycles for roughly four to six hours, depending on browser, network and Pyodide load time. Every pass rotates language, theme and viewport combinations while known issues remain deduplicated.
