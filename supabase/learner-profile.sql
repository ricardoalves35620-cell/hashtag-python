-- Run this in Supabase → SQL Editor
--
-- Stores the names a learner chooses in Base Zero (their project folder and first
-- Python file) plus an optional display name, so every lesson and exercise can
-- refer to THEIR work instead of a generic example — on every device they use.

create table if not exists public.learner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  folder_name text not null default '',
  file_name text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.learner_profiles enable row level security;

-- One row per learner, readable and writable only by that learner.
drop policy if exists "read own learner profile" on public.learner_profiles;
create policy "read own learner profile"
on public.learner_profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "insert own learner profile" on public.learner_profiles;
create policy "insert own learner profile"
on public.learner_profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "update own learner profile" on public.learner_profiles;
create policy "update own learner profile"
on public.learner_profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Required, or "Reset progress" silently leaves the profile behind: a DELETE with
-- no permissive policy removes zero rows and reports no error.
drop policy if exists "delete own learner profile" on public.learner_profiles;
create policy "delete own learner profile"
on public.learner_profiles for delete
to authenticated
using (auth.uid() = user_id);

-- Same defence in depth as the other tables: no blanket privileges, then only the
-- verbs the app actually uses.
revoke all on table public.learner_profiles from anon, authenticated;
grant select, insert, update, delete on table public.learner_profiles to authenticated;
