# Sprint 9.2 — Learning journeys, not phase clicking

## Purpose

The course now treats each phase as a competency module rather than a single lesson screen. Every one of the 69 phases is presented as six connected lessons:

1. Understand the problem
2. Solve it without code
3. Translate the logic into Python
4. Break it and debug it
5. Prepare for deliberate practice
6. Explain and transfer

Each lesson requires a short reasoning checkpoint. The checkpoint is stored locally and exists to make the learner articulate the reasoning before moving forward; it is not auto-graded for wording.

## Reset progress

The Profile page now has a destructive reset action with explicit typed confirmation. It removes cloud and local learning data while preserving account identity, language, theme and editor preferences.

Cloud data removed:
- `user_progress`
- `learning_states`
- `code_drafts`
- `exam_drafts`
- `user_fasttrack`

Local learning records, drafts, reflections, labs and exam states are removed as well.
