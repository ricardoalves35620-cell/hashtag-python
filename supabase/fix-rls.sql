-- Run this in Supabase → SQL Editor if exam submission is failing with 400 errors

-- ── Fix user_progress RLS ──
drop policy if exists "own progress" on user_progress;
drop policy if exists "users select own progress" on user_progress;
drop policy if exists "users insert own progress" on user_progress;
drop policy if exists "users update own progress" on user_progress;

create policy "users select own progress" on user_progress
  for select using (auth.uid() = user_id);

create policy "users insert own progress" on user_progress
  for insert with check (auth.uid() = user_id);

create policy "users update own progress" on user_progress
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Create user_fasttrack if not exists ──
create table if not exists user_fasttrack (
  user_id uuid references auth.users not null,
  day_id  integer not null,
  completed_at timestamptz default now(),
  primary key (user_id, day_id)
);

alter table user_fasttrack enable row level security;

drop policy if exists "own fasttrack" on user_fasttrack;
create policy "own fasttrack" on user_fasttrack
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
