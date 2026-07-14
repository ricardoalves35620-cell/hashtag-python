-- Hashtag Python · Cross-device sync V2
-- Run once in Supabase SQL Editor after deploying Sprint 10.6.

create table if not exists public.learning_journey_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  phase_id integer not null,
  visited_units text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, phase_id)
);

alter table public.learning_journey_progress enable row level security;

drop policy if exists "Users read own journey progress" on public.learning_journey_progress;
create policy "Users read own journey progress"
on public.learning_journey_progress for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own journey progress" on public.learning_journey_progress;
create policy "Users insert own journey progress"
on public.learning_journey_progress for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update own journey progress" on public.learning_journey_progress;
create policy "Users update own journey progress"
on public.learning_journey_progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users delete own journey progress" on public.learning_journey_progress;
create policy "Users delete own journey progress"
on public.learning_journey_progress for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists learning_journey_progress_updated_idx
on public.learning_journey_progress (user_id, updated_at desc);

-- The following tables are already created by earlier Hashtag Python migrations.
-- Realtime makes another open device refresh immediately; focus and periodic
-- reconciliation remain as fallbacks when Realtime is unavailable.
do $$
begin
  alter publication supabase_realtime add table public.user_progress;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.learning_states;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.learning_project_progress;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.learning_journey_progress;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.learning_journal_entries;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.code_drafts;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.exam_drafts;
exception when duplicate_object then null;
end $$;
