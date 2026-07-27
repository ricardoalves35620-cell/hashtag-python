-- Secure group discovery, membership checks, shared progress and challenge
-- scoring for projects that already ran schema.sql and schema-groups.sql.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_group_member(target_group_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.family_members
    where group_id = target_group_id and user_id = (select auth.uid())
  );
$$;

create or replace function private.shares_group_with(target_user_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.family_members mine
    join public.family_members theirs on theirs.group_id = mine.group_id
    where mine.user_id = (select auth.uid()) and theirs.user_id = target_user_id
  );
$$;

create or replace function private.create_family_group(group_name text, member_display_name text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  new_group_id uuid;
  generated_code text;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if exists (select 1 from public.family_members where user_id = current_user_id) then
    raise exception 'User already belongs to a group' using errcode = '23505';
  end if;
  if length(trim(group_name)) not between 2 and 80
    or length(trim(member_display_name)) not between 1 and 80 then
    raise exception 'Invalid group or display name' using errcode = '22023';
  end if;

  generated_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  insert into public.family_groups (name, created_by, invite_code)
  values (trim(group_name), current_user_id, generated_code)
  returning id into new_group_id;
  insert into public.family_members (group_id, user_id, display_name)
  values (new_group_id, current_user_id, trim(member_display_name));
  return new_group_id;
end;
$$;

create or replace function private.join_family_group(invitation_code text, member_display_name text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  target_group_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if exists (select 1 from public.family_members where user_id = current_user_id) then
    raise exception 'User already belongs to a group' using errcode = '23505';
  end if;
  if length(trim(member_display_name)) not between 1 and 80 then
    raise exception 'Invalid display name' using errcode = '22023';
  end if;

  select id into target_group_id from public.family_groups
  where invite_code = upper(trim(invitation_code));
  if target_group_id is null then
    raise exception 'Invitation code not found' using errcode = 'P0002';
  end if;

  insert into public.family_members (group_id, user_id, display_name)
  values (target_group_id, current_user_id, trim(member_display_name));
  return target_group_id;
end;
$$;

create or replace function public.create_family_group(group_name text, member_display_name text)
returns uuid language sql security invoker set search_path = ''
as $$ select private.create_family_group(group_name, member_display_name) $$;

create or replace function public.join_family_group(invitation_code text, member_display_name text)
returns uuid language sql security invoker set search_path = ''
as $$ select private.join_family_group(invitation_code, member_display_name) $$;

revoke all on function private.is_group_member(uuid) from public;
revoke all on function private.shares_group_with(uuid) from public;
revoke all on function private.create_family_group(text, text) from public;
revoke all on function private.join_family_group(text, text) from public;
grant execute on function private.is_group_member(uuid) to authenticated;
grant execute on function private.shares_group_with(uuid) to authenticated;
grant execute on function private.create_family_group(text, text) to authenticated;
grant execute on function private.join_family_group(text, text) to authenticated;
revoke all on function public.create_family_group(text, text) from public, anon;
revoke all on function public.join_family_group(text, text) from public, anon;
grant execute on function public.create_family_group(text, text) to authenticated;
grant execute on function public.join_family_group(text, text) to authenticated;

drop policy if exists "own progress" on public.user_progress;
drop policy if exists "progress_select" on public.user_progress;
drop policy if exists "progress_insert" on public.user_progress;
drop policy if exists "progress_update" on public.user_progress;
drop policy if exists "progress_delete" on public.user_progress;
create policy "progress_select" on public.user_progress for select to authenticated
  using ((select auth.uid()) = user_id or private.shares_group_with(user_id));
create policy "progress_insert" on public.user_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "progress_update" on public.user_progress for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "progress_delete" on public.user_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "read groups" on public.family_groups;
drop policy if exists "create groups" on public.family_groups;
drop policy if exists "groups_select" on public.family_groups;
create policy "groups_select" on public.family_groups for select to authenticated
  using (created_by = (select auth.uid()) or private.is_group_member(id));

drop policy if exists "see own group members" on public.family_members;
drop policy if exists "join group" on public.family_members;
drop policy if exists "members_select" on public.family_members;
create policy "members_select" on public.family_members for select to authenticated
  using (private.is_group_member(group_id));

revoke all on table public.user_progress, public.family_groups, public.family_members from anon, authenticated;
grant select, insert, update, delete on table public.user_progress to authenticated;
grant select on table public.family_groups, public.family_members to authenticated;

drop policy if exists "challenges_select" on public.challenges;
drop policy if exists "challenges_insert" on public.challenges;
drop policy if exists "challenges_update" on public.challenges;
drop policy if exists "challenges_delete" on public.challenges;
create policy "challenges_select" on public.challenges for select to authenticated
  using (private.is_group_member(group_id));
create policy "challenges_insert" on public.challenges for insert to authenticated
  with check (
    private.is_group_member(group_id) and created_by = (select auth.uid())
    and points = case level when 'easy' then 10 when 'medium' then 25 when 'hard' then 50 end
  );
create policy "challenges_update" on public.challenges for update to authenticated
  using (created_by = (select auth.uid()) and private.is_group_member(group_id))
  with check (
    created_by = (select auth.uid()) and private.is_group_member(group_id)
    and points = case level when 'easy' then 10 when 'medium' then 25 when 'hard' then 50 end
  );
create policy "challenges_delete" on public.challenges for delete to authenticated
  using (created_by = (select auth.uid()) and private.is_group_member(group_id));

drop policy if exists "challenge_attempts_select" on public.challenge_attempts;
drop policy if exists "challenge_attempts_insert" on public.challenge_attempts;
create policy "challenge_attempts_select" on public.challenge_attempts for select to authenticated
  using (
    user_id = (select auth.uid()) or challenge_id in (
      select id from public.challenges where private.is_group_member(group_id)
    )
  );

drop policy if exists "help_requests_select" on public.help_requests;
drop policy if exists "help_requests_insert" on public.help_requests;
drop policy if exists "help_requests_update" on public.help_requests;
create policy "help_requests_select" on public.help_requests for select to authenticated
  using (user_id = (select auth.uid()) or private.is_group_member(group_id));
create policy "help_requests_insert" on public.help_requests for insert to authenticated
  with check (private.is_group_member(group_id) and user_id = (select auth.uid()));
create policy "help_requests_update" on public.help_requests for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and private.is_group_member(group_id));

drop policy if exists "help_comments_select" on public.help_comments;
drop policy if exists "help_comments_insert" on public.help_comments;
create policy "help_comments_select" on public.help_comments for select to authenticated
  using (help_request_id in (select id from public.help_requests where private.is_group_member(group_id)));
create policy "help_comments_insert" on public.help_comments for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and help_request_id in (select id from public.help_requests where private.is_group_member(group_id))
  );

drop policy if exists "group_rankings_select" on public.group_rankings;
create policy "group_rankings_select" on public.group_rankings for select to authenticated
  using (private.is_group_member(group_id));
drop policy if exists "group_badges_select" on public.group_badges;
create policy "group_badges_select" on public.group_badges for select to authenticated
  using (private.is_group_member(group_id));

create or replace function private.normalize_challenge_attempt()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare trusted_points integer;
begin
  select points into trusted_points from public.challenges where id = new.challenge_id;
  new.points_earned := case when new.passed then coalesce(trusted_points, 0) else 0 end;
  return new;
end;
$$;

create or replace function private.update_group_ranking()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.passed and new.points_earned > 0 and (
    select count(*) from public.challenge_attempts
    where challenge_id = new.challenge_id and user_id = new.user_id and passed
  ) = 1 then
    insert into public.group_rankings (group_id, user_id, display_name, total_points, challenges_completed)
    select c.group_id, new.user_id, fm.display_name, new.points_earned, 1
    from public.challenges c
    join public.family_members fm on fm.user_id = new.user_id and fm.group_id = c.group_id
    where c.id = new.challenge_id
    on conflict (group_id, user_id) do update set
      total_points = group_rankings.total_points + new.points_earned,
      challenges_completed = group_rankings.challenges_completed + 1,
      updated_at = now();
  end if;
  return new;
end;
$$;

create or replace function private.update_help_request_status()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.help_requests set status = 'helping'
  where id = new.help_request_id and status = 'open';
  return new;
end;
$$;

drop trigger if exists trg_normalize_challenge_attempt on public.challenge_attempts;
create trigger trg_normalize_challenge_attempt before insert on public.challenge_attempts
for each row execute function private.normalize_challenge_attempt();
drop trigger if exists trg_update_ranking on public.challenge_attempts;
create trigger trg_update_ranking after insert on public.challenge_attempts
for each row execute function private.update_group_ranking();
drop trigger if exists trg_help_request_status on public.help_comments;
create trigger trg_help_request_status after insert on public.help_comments
for each row execute function private.update_help_request_status();

drop function if exists public.update_group_ranking();
drop function if exists public.update_help_request_status();

alter view public.group_challenges_latest set (security_invoker = true);
alter view public.group_leaderboards set (security_invoker = true);

revoke all on table public.challenges, public.challenge_attempts, public.help_requests,
  public.help_comments, public.group_rankings, public.group_badges from anon, authenticated;
grant select, insert, update, delete on table public.challenges to authenticated;
grant select on table public.challenge_attempts to authenticated;
grant select, insert, update on table public.help_requests to authenticated;
grant select, insert on table public.help_comments to authenticated;
grant select on table public.group_rankings, public.group_badges to authenticated;
revoke all on table public.group_challenges_latest, public.group_leaderboards from anon, authenticated;
grant select on table public.group_challenges_latest, public.group_leaderboards to authenticated;

revoke all on function private.normalize_challenge_attempt() from public;
revoke all on function private.update_group_ranking() from public;
revoke all on function private.update_help_request_status() from public;
