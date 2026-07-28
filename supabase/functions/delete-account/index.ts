import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

/**
 * Permanently deletes the CALLING learner's account.
 *
 * LGPD Art. 18, VI gives a data subject the right to have their personal data
 * eliminated. The anon client cannot delete an auth user, so this runs with the
 * service role - which means the identity check below is the only thing standing
 * between a request and someone else's account.
 *
 * The user id is taken from the verified JWT, never from the request body. There
 * is deliberately no way for a caller to name a different account.
 *
 * All public tables cascade from auth.users (migration: account_deletion_cascades),
 * so removing the auth user removes this learner's rows atomically.
 * family_groups.created_by is ON DELETE SET NULL on purpose: a family's shared
 * group is not the departing member's personal data and must survive.
 *
 * Deployed with verify_jwt: true.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'missing_token' }, 401)

  const url = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

  // Identify the caller using THEIR token, not the service role.
  const caller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userError } = await caller.auth.getUser()
  const user = userData?.user
  if (userError || !user) return json({ error: 'invalid_token' }, 401)

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // Stored avatars are not covered by the table cascades.
  const avatarPaths = ['jpg', 'jpeg', 'png', 'gif', 'webp'].map(ext => user.id + '/avatar.' + ext)
  try {
    await admin.storage.from('avatars').remove(avatarPaths)
  } catch {
    // A missing avatar must never block an erasure request.
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    console.error('delete-account failed', user.id, deleteError.message)
    return json({ error: 'delete_failed', message: deleteError.message }, 500)
  }

  console.log('delete-account completed', user.id)
  return json({ deleted: true }, 200)
})
