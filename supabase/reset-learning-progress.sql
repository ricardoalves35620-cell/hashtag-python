-- Sprint 9.2 — allow authenticated learners to delete only their own learning data.
-- Run once in Supabase → SQL Editor before using Profile → Reset progress.

alter table if exists public.user_progress enable row level security;
drop policy if exists "users delete own progress" on public.user_progress;
create policy "users delete own progress"
on public.user_progress for delete
to authenticated
using (auth.uid() = user_id);

alter table if exists public.learning_states enable row level security;
drop policy if exists "Users delete own learning state" on public.learning_states;
create policy "Users delete own learning state"
on public.learning_states for delete
to authenticated
using (auth.uid() = user_id);

alter table if exists public.code_drafts enable row level security;
drop policy if exists "Users delete own code drafts" on public.code_drafts;
create policy "Users delete own code drafts"
on public.code_drafts for delete
to authenticated
using (auth.uid() = user_id);

-- exam_drafts and user_fasttrack already use FOR ALL in the standard schema,
-- but these explicit policies also support installations created from older scripts.
alter table if exists public.exam_drafts enable row level security;
drop policy if exists "Users delete own exam drafts" on public.exam_drafts;
create policy "Users delete own exam drafts"
on public.exam_drafts for delete
to authenticated
using (auth.uid() = user_id);

alter table if exists public.user_fasttrack enable row level security;
drop policy if exists "Users delete own fasttrack" on public.user_fasttrack;
create policy "Users delete own fasttrack"
on public.user_fasttrack for delete
to authenticated
using (auth.uid() = user_id);
