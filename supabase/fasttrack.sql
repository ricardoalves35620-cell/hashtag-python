-- Run this in Supabase → SQL Editor

-- FastTrack progress table (one row per completed day per user)
create table if not exists user_fasttrack (
  user_id uuid references auth.users not null,
  day_id  integer not null,
  completed_at timestamptz default now(),
  primary key (user_id, day_id)
);

alter table user_fasttrack enable row level security;

-- Users can only read/write their own fasttrack progress
create policy "own fasttrack" on user_fasttrack
  for all using (auth.uid() = user_id);
