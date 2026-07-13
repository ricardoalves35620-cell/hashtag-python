-- Learning Engine V2.4 — local-first mini-project workflow with cross-device sync.
-- Run once in Supabase → SQL Editor.


-- Mini-project completion is part of phase mastery.
alter table if exists public.user_progress
add column if not exists project_done boolean not null default false;

create table if not exists public.learning_project_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  state jsonb not null default '{}'::jsonb,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, project_id)
);

alter table public.learning_project_progress enable row level security;

drop policy if exists "Users read own mini projects" on public.learning_project_progress;
create policy "Users read own mini projects"
on public.learning_project_progress for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users create own mini projects" on public.learning_project_progress;
create policy "Users create own mini projects"
on public.learning_project_progress for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update own mini projects" on public.learning_project_progress;
create policy "Users update own mini projects"
on public.learning_project_progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users delete own mini projects" on public.learning_project_progress;
create policy "Users delete own mini projects"
on public.learning_project_progress for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists learning_project_progress_updated_idx
on public.learning_project_progress (user_id, updated_at desc);
