# Foundation Sprint 1.4 — Pedagogical feedback and progress sync

## Feedback

Every failed exam verification now explains:

1. What the learner got right.
2. What needs correction.
3. Why it happened.
4. How to fix it.

Public checks can show expected versus actual output. Hidden checks remain private but explain the underlying concept, such as hard-coded values or insufficient generalization.

## Progress synchronization

- Exam completion is saved locally before the network request.
- Cloud and local progress are reconciled with monotonic rules.
- Completed steps never revert to incomplete.
- The highest exam score wins.
- Failed syncs are retried on focus, visibility change, and later progress refreshes.
- Supabase Realtime refreshes progress between devices when enabled.
- Exam pages update when remote progress arrives after the page has already mounted.

Run `supabase/progress-sync.sql` once to ensure columns, RLS, updated timestamps, uniqueness, and Realtime publication are configured.
