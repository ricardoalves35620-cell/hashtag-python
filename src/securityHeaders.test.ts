import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const headers = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8')

function directive(name: string): string {
  const policy = headers.match(/Content-Security-Policy(?:-Report-Only)?:(.+)/)?.[1] ?? ''
  const found = policy.split(';').map(part => part.trim()).find(part => part.startsWith(`${name} `))
  return found ?? ''
}

/**
 * A CSP that blocks the app is worse than no CSP, because it fails in production
 * where nobody is watching the console. These assertions pin the sources the app
 * genuinely needs, so a future tightening pass cannot silently remove one.
 */
describe('content security policy', () => {
  it('ships as Report-Only until a clean cycle proves it safe', () => {
    // Pyodide is the entire product. Enforcing before reading real violation
    // reports risks shipping an app that cannot run Python.
    expect(headers).toContain('Content-Security-Policy-Report-Only:')
    expect(headers).not.toMatch(/\n\s*Content-Security-Policy:/)
  })

  it('allows the Pyodide runtime and WebAssembly', () => {
    // public/python.worker.js:5 importScripts() from this origin.
    expect(directive('script-src')).toContain('https://cdn.jsdelivr.net')
    expect(directive('script-src')).toContain("'wasm-unsafe-eval'")
    expect(directive('worker-src')).toContain('blob:')
  })

  it('allows Supabase REST and the realtime websocket', () => {
    // A policy that forgets wss:// silently kills cross-device sync.
    expect(directive('connect-src')).toContain('https://*.supabase.co')
    expect(directive('connect-src')).toContain('wss://*.supabase.co')
  })

  it('allows lesson video embeds and the webfont', () => {
    expect(directive('frame-src')).toContain('https://www.youtube.com')
    expect(directive('style-src')).toContain('https://fonts.googleapis.com')
    expect(directive('font-src')).toContain('https://fonts.gstatic.com')
  })

  it('still locks down the directives that cost nothing to enforce', () => {
    expect(directive('object-src')).toContain("'none'")
    expect(directive('frame-ancestors')).toContain("'none'")
    expect(directive('base-uri')).toContain("'self'")
    expect(directive('form-action')).toContain("'self'")
  })

  it('sets the headers that need no rollout period', () => {
    expect(headers).toContain('X-Content-Type-Options: nosniff')
    expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin')
    expect(headers).toContain('Strict-Transport-Security:')
    expect(headers).toContain('Permissions-Policy:')
  })

  it('points cache rules at the generated manifest', () => {
    // public/manifest.json is no longer linked by anything.
    expect(headers).toContain('/manifest.webmanifest')
  })
})
