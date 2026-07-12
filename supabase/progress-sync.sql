-- Hashtag Python · reliable progress and exam synchronization
-- Run once in Supabase SQL Editor.

alter table public.user_progress
  add column if not exists exam_done boolean default false,
  add column if not exists exam_score integer default null,
  add column if not exists exam_passed boolean default false,
  add column if not exists updated_at timestamptz default now();

create unique index if not exists user_progress_user_phase_key
  on public.user_progress (user_id, phase_id);

alter table public.user_progress enable row level security;

drop policy if exists "own progress" on public.user_progress;
drop policy if exists "users select own progress" on public.user_progress;
drop policy if exists "users insert own progress" on public.user_progress;
drop policy if exists "users update own progress" on public.user_progress;

create policy "users select own progress" on public.user_progress
  for select using (auth.uid() = user_id);

create policy "users insert own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);

create policy "users update own progress" on public.user_progress
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_user_progress_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_progress_updated_at on public.user_progress;
create trigger set_user_progress_updated_at
before update on public.user_progress
for each row execute function public.set_user_progress_updated_at();

-- Realtime improves cross-device refresh. The app also refreshes on focus as fallback.
do $$
begin
  alter publication supabase_realtime add table public.user_progress;
exception
  when duplicate_object then null;
end $$;
