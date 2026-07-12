create table if not exists public.code_drafts (
  user_id uuid not null references auth.users(id) on delete cascade,
  phase_id integer not null,
  exercise_id text not null,
  code text not null default '',
  input_values text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, phase_id, exercise_id)
);

alter table public.code_drafts enable row level security;

drop policy if exists "Users read own code drafts" on public.code_drafts;
create policy "Users read own code drafts" on public.code_drafts
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own code drafts" on public.code_drafts;
create policy "Users insert own code drafts" on public.code_drafts
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own code drafts" on public.code_drafts;
create policy "Users update own code drafts" on public.code_drafts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
