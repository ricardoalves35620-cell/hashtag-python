import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

const edgeFunction = source('../supabase/functions/delete-account/index.ts')
const client = source('./lib/deleteAccount.ts')
const profile = source('./pages/Profile.tsx')
const migration = source('../supabase/account-deletion.sql')

/**
 * LGPD Art. 18, VI — the right to elimination. This is a legal obligation for a
 * pt-BR product independent of any app store, so these guards exist to stop the
 * flow being quietly broken or narrowed later.
 */
describe('account deletion — reachable in-app', () => {
  it('offers deletion from the profile screen, not via support', () => {
    expect(profile).toContain('data-testid="delete-account-open"')
    expect(profile).toContain('handleDeleteAccount')
  })

  it('requires a typed confirmation in both languages', () => {
    expect(profile).toContain("lang === 'pt' ? 'EXCLUIR' : 'DELETE'")
    expect(profile).toContain('data-testid="delete-account-confirmation"')
  })

  it('explains what survives, so the warning is not misleading', () => {
    // A family group outlives its creator by design; saying "everything is erased"
    // would be false.
    expect(profile).toMatch(/family group you started stays/i)
    expect(profile).toMatch(/grupo da fam[ií]lia/i)
  })
})

describe('account deletion — a caller can only delete themselves', () => {
  it('takes the user id from the verified token, never the request body', () => {
    expect(edgeFunction).toContain('caller.auth.getUser()')
    expect(edgeFunction).toContain('admin.auth.admin.deleteUser(user.id)')
    // If the function ever read an id from the payload, the service role would
    // happily delete any account on request.
    expect(edgeFunction).not.toMatch(/req\.json\(\)/)
    expect(edgeFunction).not.toMatch(/body\.(user_?[Ii]d)/)
  })

  it('rejects a request with no bearer token', () => {
    expect(edgeFunction).toContain("startsWith('Bearer ')")
    expect(edgeFunction).toContain("json({ error: 'missing_token' }, 401)")
    expect(edgeFunction).toContain("json({ error: 'invalid_token' }, 401)")
  })

  it('identifies the caller with the anon key, not the service role', () => {
    // Building the identifying client with the service key would make getUser()
    // meaningless and hand every caller full privileges.
    const callerBlock = edgeFunction.slice(edgeFunction.indexOf('const caller'), edgeFunction.indexOf('const { data: userData'))
    expect(callerBlock).toContain('anonKey')
    expect(callerBlock).not.toContain('serviceKey')
  })

  it('removes stored avatars, which no table cascade covers', () => {
    expect(edgeFunction).toContain("storage.from('avatars').remove")
  })
})

describe('account deletion — client side', () => {
  it('clears this device and drops the session after the server confirms', () => {
    expect(client).toContain('clearLocalLearningData()')
    expect(client).toContain('auth.signOut()')
    // Order matters: local teardown must not run before the server says it is done.
    expect(client.indexOf('functions.invoke')).toBeLessThan(client.indexOf('clearLocalLearningData()'))
  })

  it('treats a missing deleted flag as a failure rather than success', () => {
    expect(client).toContain('if (!data?.deleted)')
  })
})

describe('account deletion — schema can actually support it', () => {
  it('documents why family_groups is SET NULL rather than CASCADE', () => {
    // Cascading there would abort the whole deletion, because
    // family_members.group_id is NO ACTION.
    expect(migration).toContain('on delete set null')
    expect(migration).toMatch(/family_members\.group_id is ON DELETE NO ACTION/)
  })

  it('cascades every table that holds only this learner\'s rows', () => {
    for (const table of ['user_progress', 'exam_drafts', 'user_fasttrack', 'family_members']) {
      expect(migration, `${table} must cascade`).toContain(`alter table public.${table}`)
    }
    expect(migration.match(/on delete cascade/g)?.length).toBeGreaterThanOrEqual(4)
  })
})
