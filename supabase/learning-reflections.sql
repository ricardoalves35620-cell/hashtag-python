create table if not exists public.learning_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phase_id integer not null,
  unit_id text not null,
  language text not null check (language in ('en', 'pt')),
  content text not null default '',
  skipped boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, phase_id, unit_id)
);

alter table public.learning_reflections enable row level security;

create policy "Students manage own reflections"
on public.learning_reflections
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace view public.learning_reflection_insights as
select
  phase_id,
  unit_id,
  language,
  count(*) as response_count,
  count(*) filter (where skipped) as skipped_count,
  round(avg(length(content))) as average_length,
  max(updated_at) as last_response_at
from public.learning_reflections
group by phase_id, unit_id, language;

revoke all on public.learning_reflection_insights from anon, authenticated;
-- Grant this view only to a dedicated service role or admin backend.
