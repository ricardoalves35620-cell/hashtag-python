-- Run this in Supabase → SQL Editor
--
-- One place for everything a learner types or earns: exercises passed, checkpoint
-- answers, predictions, plans. One row per learner per key, so two devices editing
-- different things never overwrite each other, and the newest write wins per key.
--
-- Local storage stays as a synchronous cache for rendering; this is the source of truth.

create table if not exists public.learner_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

create index if not exists learner_state_user_idx on public.learner_state (user_id);

alter table public.learner_state enable row level security;

drop policy if exists "read own learner state" on public.learner_state;
create policy "read own learner state"
on public.learner_state for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "insert own learner state" on public.learner_state;
create policy "insert own learner state"
on public.learner_state for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "update own learner state" on public.learner_state;
create policy "update own learner state"
on public.learner_state for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Required, or "Reset progress" silently leaves everything behind: a DELETE with no
-- permissive policy removes zero rows and reports no error.
drop policy if exists "delete own learner state" on public.learner_state;
create policy "delete own learner state"
on public.learner_state for delete
to authenticated
using (auth.uid() = user_id);

revoke all on table public.learner_state from anon, authenticated;
grant select, insert, update, delete on table public.learner_state to authenticated;
