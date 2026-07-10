-- Run this in Supabase → SQL Editor

-- 1. User progress table
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  phase_id integer not null,
  lesson_done boolean default false,
  exercises_done boolean default false,
  quiz_done boolean default false,
  exam_done boolean default false,
  exam_score integer default null,
  exam_passed boolean default false,
  updated_at timestamptz default now(),
  unique(user_id, phase_id)
);

-- 2. Family groups
create table if not exists family_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users not null,
  invite_code text unique not null,
  created_at timestamptz default now()
);

-- 3. Family members
create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references family_groups not null,
  user_id uuid references auth.users not null,
  display_name text not null,
  joined_at timestamptz default now(),
  unique(group_id, user_id)
);

-- 4. Row Level Security

alter table user_progress enable row level security;
alter table family_groups enable row level security;
alter table family_members enable row level security;

-- user_progress: users can read/write their own progress
create policy "own progress" on user_progress
  for all using (auth.uid() = user_id);

-- family_groups: anyone can read groups (for joining), owners can write
create policy "read groups" on family_groups
  for select using (true);

create policy "create groups" on family_groups
  for insert with check (auth.uid() = created_by);

-- family_members: members can see their own group
create policy "see own group members" on family_members
  for select using (
    group_id in (
      select group_id from family_members where user_id = auth.uid()
    )
  );

create policy "join group" on family_members
  for insert with check (auth.uid() = user_id);
