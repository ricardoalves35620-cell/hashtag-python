-- Run this in Supabase → SQL Editor, on the Hashtag Python project.
--
-- NOT APPLIED AUTOMATICALLY. The Supabase connector on this account exposes only
-- two projects — chao-do-boi and claim-navigator — and neither contains
-- learner_state. The Hashtag Python project is not connected, so this was left
-- for you to run rather than guessed at.
--
-- ── What this fixes ──────────────────────────────────────────────────────────
--
-- syncedStore.pushToCloud writes `updated_at` from the *client* clock:
--
--     { user_id, key, value, updated_at: new Date().toISOString() }
--
-- Two devices editing the same key therefore resolve by whichever device has the
-- faster clock, not by which write actually happened last. A phone running a few
-- minutes ahead wins every conflict forever, silently discarding work done on the
-- laptop. Clock skew of minutes is normal on consumer devices.
--
-- A trigger-maintained server timestamp plus a monotonic revision counter gives a
-- trustworthy ordering, and gives the client something to show a learner when two
-- devices genuinely diverge.
--
-- Additive and idempotent: no column is dropped, no row is rewritten. Existing
-- rows get server_updated_at = now() and revision = 0 on first touch.

alter table public.learner_state
  add column if not exists server_updated_at timestamptz not null default now();

alter table public.learner_state
  add column if not exists revision bigint not null default 0;

-- The client may send whatever updated_at it likes; these two columns are written
-- only here, so they cannot be spoofed by a device with a wrong clock.
create or replace function public.bump_learner_state_revision()
returns trigger
language plpgsql
as $$
begin
  new.server_updated_at := now();
  new.revision := coalesce(old.revision, 0) + 1;
  return new;
end;
$$;

drop trigger if exists learner_state_revision on public.learner_state;
create trigger learner_state_revision
  before insert or update on public.learner_state
  for each row execute function public.bump_learner_state_revision();

-- Lets hydrateState() fetch only what changed since the device last synced,
-- instead of pulling every key on every auth state change.
create index if not exists learner_state_user_server_updated_idx
  on public.learner_state (user_id, server_updated_at desc);

-- ── After applying ───────────────────────────────────────────────────────────
--
-- In src/lib/syncedStore.ts, hydrateState() currently selects `updated_at`:
--
--     .select('key, value, updated_at')
--
-- Change it to the server-authoritative column once this migration is live:
--
--     .select('key, value, server_updated_at, revision')
--
-- and compare against server_updated_at in shouldTakeRemoteValue(). The client
-- column is left in place so the app keeps working before and after, in either
-- order — deploy and migration do not have to be simultaneous.
