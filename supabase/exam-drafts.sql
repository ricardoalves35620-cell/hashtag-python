-- Run this in Supabase → SQL Editor
-- Persists exam code drafts across devices (auto-saved as user types)

create table if not exists exam_drafts (
  user_id uuid references auth.users not null,
  phase_id integer not null,
  code text not null default '',
  updated_at timestamptz default now(),
  primary key (user_id, phase_id)
);

alter table exam_drafts enable row level security;

drop policy if exists "own exam drafts" on exam_drafts;
create policy "own exam drafts" on exam_drafts
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
