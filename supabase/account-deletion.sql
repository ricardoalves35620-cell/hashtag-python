-- Account deletion — APPLIED 2026-07-28 as migration `account_deletion_cascades`.
-- Kept here so the repository records what the database actually does.
--
-- ── Why this was needed ──────────────────────────────────────────────────────
--
-- LGPD Art. 18, VI gives a learner the right to have their personal data
-- eliminated. Before this migration that was impossible: five foreign keys to
-- auth.users were ON DELETE NO ACTION, so `auth.admin.deleteUser()` raised a
-- foreign key violation for any learner who had ever recorded progress.
--
--   user_progress.user_id        NO ACTION   (6 live rows — every real learner)
--   exam_drafts.user_id          NO ACTION
--   user_fasttrack.user_id       NO ACTION
--   family_members.user_id       NO ACTION
--   family_groups.created_by     NO ACTION
--
-- Note the drift: supabase/schema.sql already declared ON DELETE CASCADE for
-- family_groups and family_members. `create table if not exists` never re-applies
-- a changed constraint, so the checked-in schema and the live database had
-- disagreed silently since those tables were first created.
--
-- ── Why family_groups is SET NULL and not CASCADE ────────────────────────────
--
-- Two reasons, and the second is fatal on its own:
--
--   1. A family group is not the creator's personal data. The other members'
--      progress lives in it, so erasing one person must not delete the group.
--   2. family_members.group_id is ON DELETE NO ACTION. Cascading a user deletion
--      into family_groups would try to delete a group that still has member rows
--      pointing at it, violating that constraint and aborting the entire deletion.
--      Account deletion would fail for any group creator with a family.
--
-- created_by is written once on insert (Group.tsx:120) and is never used for
-- authorization, so a null creator is safe for the application.

alter table public.user_progress   drop constraint user_progress_user_id_fkey;
alter table public.user_progress   add  constraint user_progress_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.exam_drafts     drop constraint exam_drafts_user_id_fkey;
alter table public.exam_drafts     add  constraint exam_drafts_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.user_fasttrack  drop constraint user_fasttrack_user_id_fkey;
alter table public.user_fasttrack  add  constraint user_fasttrack_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.family_members  drop constraint family_members_user_id_fkey;
alter table public.family_members  add  constraint family_members_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.family_groups   alter column created_by drop not null;
alter table public.family_groups   drop constraint family_groups_created_by_fkey;
alter table public.family_groups   add  constraint family_groups_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

-- ── Verify ───────────────────────────────────────────────────────────────────
-- Expect every public FK to auth.users to read CASCADE, except family_groups
-- .created_by which reads SET NULL.
--
--   select c.conrelid::regclass::text as child_table, a.attname,
--          case c.confdeltype when 'c' then 'CASCADE' when 'a' then 'NO ACTION'
--               when 'n' then 'SET NULL' end as on_delete
--   from pg_constraint c
--   join unnest(c.conkey) with ordinality as k(attnum, ord) on true
--   join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k.attnum
--   where c.contype = 'f' and c.confrelid = 'auth.users'::regclass
--     and c.connamespace = 'public'::regnamespace
--   order by on_delete, child_table;
--
-- The deletion itself runs in supabase/functions/delete-account/index.ts, which is
-- deployed with verify_jwt: true and reads the user id from the token only.
