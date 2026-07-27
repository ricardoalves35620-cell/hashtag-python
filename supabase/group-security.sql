-- Run this in Supabase → SQL Editor
--
-- Closes an open read policy on family_groups. Before this migration the policy was
-- `for select using (true)`, so any authenticated user could read every group row —
-- including invite_code — and join any family's group.
--
-- Joining by code still has to work for people who are not members yet, so the lookup
-- moves into a SECURITY DEFINER function instead of an open table read.
--
-- Apply this BEFORE deploying the matching Group.tsx change, or joining breaks.

-- ── Private helper schema (not exposed through PostgREST) ──
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Membership check runs as owner so it can read family_members without tripping
-- the RLS policy on family_members itself (which would recurse).
create or replace function private.is_group_member(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.family_members
    where group_id = target_group_id
      and user_id = auth.uid()
  );
$$;

-- ── family_groups: members and owners only ──
drop policy if exists "read groups" on public.family_groups;
drop policy if exists "members read own group" on public.family_groups;

create policy "members read own group"
on public.family_groups for select
to authenticated
using (
  created_by = auth.uid()
  or private.is_group_member(id)
);

-- ── Join by invite code, without exposing the table ──
-- Returns the group id on success. Raises a clean error the UI can show otherwise.
create or replace function public.join_family_group(code text, member_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_group_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select id into target_group_id
  from public.family_groups
  where invite_code = upper(trim(code));

  if target_group_id is null then
    raise exception 'invite code not found' using errcode = 'P0002';
  end if;

  insert into public.family_members (group_id, user_id, display_name)
  values (target_group_id, auth.uid(), coalesce(nullif(trim(member_name), ''), 'User'));

  return target_group_id;
exception
  when unique_violation then
    raise exception 'already a member' using errcode = '23505';
end;
$$;

revoke all on function public.join_family_group(text, text) from public, anon;
grant execute on function public.join_family_group(text, text) to authenticated;

-- ── 5. Table privileges (defence in depth) ──
-- RLS decides which ROWS are visible. Grants decide which VERBS are possible at all.
-- Strip the blanket privileges first, then hand back only what the app actually uses.
revoke all on table public.user_progress, public.family_groups, public.family_members from anon, authenticated;

-- user_progress: read, upsert (insert + update) and delete for the reset feature.
grant select, insert, update, delete on table public.user_progress to authenticated;

-- family_groups: read own group, create a group. Joining goes through the RPC.
grant select, insert on table public.family_groups to authenticated;

-- family_members: read the member list, insert on join.
grant select, insert on table public.family_members to authenticated;
