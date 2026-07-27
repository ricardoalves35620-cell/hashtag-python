import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(path, 'utf8').toLowerCase()

describe('Supabase group security', () => {
  it('keeps invite codes behind authenticated group RPCs', () => {
    const schema = read('supabase/schema.sql')
    const groupPage = read('src/pages/Group.tsx')

    expect(schema).not.toContain('for select using (true)')
    expect(schema).toContain('private.is_group_member')
    expect(schema).toContain('public.join_family_group')
    expect(schema).toContain('revoke all on table public.user_progress, public.family_groups, public.family_members')
    expect(groupPage).toContain(".rpc('join_family_group'")
    expect(groupPage).not.toContain(".eq('invite_code'")
  })

  it('does not let a browser award challenge points', () => {
    const groups = read('supabase/schema-groups.sql')

    expect(groups).not.toContain('create policy "challenge_attempts_insert"')
    expect(groups).toContain('private.normalize_challenge_attempt')
    expect(groups).toContain('grant select on table public.challenge_attempts to authenticated')
    expect(groups).not.toContain('grant select, insert on table public.challenge_attempts')
  })

  it('runs public views with the caller permissions and pins privileged search paths', () => {
    const groups = read('supabase/schema-groups.sql')
    const migration = read('supabase/migrations/20260722051609_secure_group_access.sql')

    expect(groups.match(/security_invoker = true/g)).toHaveLength(2)
    expect(groups).toContain("security definer set search_path = ''")
    expect(migration).toContain('alter view public.group_challenges_latest set (security_invoker = true)')
    expect(migration).toContain('revoke all on function private.update_group_ranking() from public')
  })
})
