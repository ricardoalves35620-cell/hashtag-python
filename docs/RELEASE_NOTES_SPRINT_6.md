# Sprint 6 — Cross-device continuity

This sprint makes multi-device study state visible and recoverable.

## Included
- Online/offline detection and a shared synchronization state.
- Header sync indicator for authenticated learners.
- Detailed sync panel and manual retry in Profile.
- Automatic retry when connectivity returns or the app regains focus.
- Progress, learning history and code drafts publish sync events.
- Local-first behavior remains active during outages.
- Last successful synchronization time is stored locally.

## Expected behavior
- Offline work remains available on the current device.
- When the network returns, the app retries cloud reconciliation.
- Completed steps remain monotonic and the best exam score wins.
- The learner can force a refresh from Profile.
