create table if not exists public.learning_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phase_id integer not null,
  unit_id text not null,
  prompt text not null,
  response text not null,
  language text not null check (language in ('en','pt')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, phase_id, unit_id)
);

alter table public.learning_journal_entries enable row level security;

drop policy if exists "Learners manage own journal" on public.learning_journal_entries;
create policy "Learners manage own journal" on public.learning_journal_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Developer/admin review requires app_metadata.role = 'admin'. Keep this role server-controlled.
drop policy if exists "Admins review learning journal" on public.learning_journal_entries;
create policy "Admins review learning journal" on public.learning_journal_entries
for select using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create index if not exists learning_journal_phase_idx on public.learning_journal_entries (phase_id, unit_id, updated_at desc);
