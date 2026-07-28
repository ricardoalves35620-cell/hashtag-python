/**
 * A local stand-in for Supabase, good enough to run the credential-gated smoke tests.
 *
 * Why this exists: three CI failures in a row were in tests that SKIP without
 * credentials, so they had never executed anywhere — not locally, not in CI. Each one
 * cost a full round-trip to discover. A test that skips is not a test that passes, and
 * the only way to stop guessing is to make it run.
 *
 * This sandbox has no route to supabase.co. Rather than mock inside the spec — which
 * would change what CI exercises — the app is built pointing at this server.
 * src/lib/config.ts already permits an http:// URL on localhost, so nothing in the app
 * has to know.
 *
 * Faithful where it matters: real JWT shape, real session envelope, PostgREST status
 * codes and Prefer handling. Not faithful about RLS, cascades or realtime — anything
 * depending on those still needs a networked run.
 *
 *   node scripts/audit/supabase-stub.mjs --port 54321
 */
import { createServer } from 'node:http'

const PORT = Number(process.argv[process.argv.indexOf('--port') + 1] || 54321)
/**
 * --forgetful makes every GET return an empty set, as a real backend does for a learner
 * whose notes were never synced. Reads-back-what-you-wrote is the FRIENDLIER case, and
 * testing only the friendly case is how HP-C-04 passed here and failed in CI.
 */
const FORGETFUL = process.argv.includes('--forgetful')
const USER_ID = '00000000-0000-4000-8000-000000000001'
const EMAIL = process.env.AUDIT_USER_EMAIL || 'teste@hashtagpython.com'
const PASSWORD = process.env.AUDIT_USER_PASSWORD || 'testehashtagpython'

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
function jwt() {
  const now = Math.floor(Date.now() / 1000)
  // Not signed — nothing here verifies it, and a real signature would imply this is a
  // security boundary. It is not.
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({
    sub: USER_ID, email: EMAIL, role: 'authenticated', aud: 'authenticated',
    iat: now, exp: now + 3600, session_id: 'stub-session',
  })}.stub-signature`
}

const user = () => ({
  id: USER_ID, aud: 'authenticated', role: 'authenticated', email: EMAIL,
  email_confirmed_at: '2026-01-01T00:00:00Z', phone: '', confirmed_at: '2026-01-01T00:00:00Z',
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { display_name: 'Audit User' },
  identities: [], created_at: '2026-01-01T00:00:00Z', updated_at: new Date().toISOString(),
})

const session = () => ({
  access_token: jwt(), token_type: 'bearer', expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'stub-refresh', user: user(),
})

/** Rows written by the app, so a read after a write returns what was written. */
const tables = new Map()
const rowsOf = (t) => tables.get(t) || (tables.set(t, []), tables.get(t))

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  'Access-Control-Expose-Headers': 'content-range',
}
const send = (res, status, body, extra = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS, ...extra })
  res.end(body === undefined ? '' : JSON.stringify(body))
}

createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204)

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  let raw = ''
  req.on('data', c => { raw += c })
  req.on('end', () => {
    const body = raw ? JSON.parse(raw) : {}
    const path = url.pathname

    // ── auth ────────────────────────────────────────────────────────────────
    if (path === '/auth/v1/token') {
      const grant = url.searchParams.get('grant_type')
      if (grant === 'refresh_token') return send(res, 200, session())
      const ok = body.email === EMAIL && body.password === PASSWORD
      // The real message, so the app's authError mapping is exercised, not bypassed.
      return ok
        ? send(res, 200, session())
        : send(res, 400, { error: 'invalid_grant', error_description: 'Invalid login credentials', message: 'Invalid login credentials' })
    }
    if (path === '/auth/v1/user') {
      if (req.method === 'PUT') return send(res, 200, user())
      return send(res, 200, user())
    }
    if (path === '/auth/v1/logout') return send(res, 204)
    if (path.startsWith('/auth/v1/')) return send(res, 200, {})

    // ── PostgREST ───────────────────────────────────────────────────────────
    if (path.startsWith('/rest/v1/')) {
      const table = path.slice('/rest/v1/'.length)
      const rows = rowsOf(table)
      if (req.method === 'GET') {
        if (FORGETFUL) return send(res, 200, [], { 'Content-Range': '*/0' })
        return send(res, 200, rows, { 'Content-Range': `0-${Math.max(rows.length - 1, 0)}/${rows.length}` })
      }
      if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
        const incoming = Array.isArray(body) ? body : [body]
        for (const row of incoming) rows.push({ ...row, user_id: row.user_id ?? USER_ID })
        const prefer = String(req.headers.prefer || '')
        // supabase-js sends Prefer: return=minimal unless .select() is chained.
        return prefer.includes('return=minimal') ? send(res, 201, undefined) : send(res, 201, incoming)
      }
      if (req.method === 'DELETE') { tables.set(table, []); return send(res, 204) }
    }

    // ── everything else ─────────────────────────────────────────────────────
    if (path.startsWith('/functions/v1/')) return send(res, 200, { ok: true })
    if (path.startsWith('/realtime/')) return send(res, 404, {})
    return send(res, 200, {})
  })
}).listen(PORT, '127.0.0.1', () => {
  console.log(`supabase stub on http://127.0.0.1:${PORT}  (user ${EMAIL})`)
})
