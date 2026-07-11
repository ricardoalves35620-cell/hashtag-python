-- Optional cross-device sync for adaptive learning state (v1.4)
create table if not exists public.learning_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learning_states enable row level security;

drop policy if exists "Users read own learning state" on public.learning_states;
create policy "Users read own learning state"
on public.learning_states for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own learning state" on public.learning_states;
create policy "Users insert own learning state"
on public.learning_states for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update own learning state" on public.learning_states;
create policy "Users update own learning state"
on public.learning_states for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
