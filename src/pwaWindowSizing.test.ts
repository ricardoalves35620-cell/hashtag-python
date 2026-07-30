import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

/**
 * The two legacy Apple meta tags must not come back.
 *
 * On iOS 26 they half-apply: content draws under the status bar, so
 * env(safe-area-inset-top) reports 59px, but the standalone window is CREATED 59px short
 * and anchored at the top. That leaves a dead strip below the layout viewport which
 * `position: fixed` cannot reach — the bottom bar appears to float above the screen edge
 * and no amount of CSS fixes it, because the window itself is the wrong size.
 *
 * Standalone mode comes from the manifest instead. This is pinned because the tags look
 * like the obvious thing to add back the next time someone wants an app-like status bar.
 */

const html = readFileSync('index.html', 'utf8')

describe('standalone window sizing on iOS', () => {
  it('does not declare the legacy Apple standalone metas', () => {
    const active = html
      .replace(/<!--[\s\S]*?-->/g, '')            // the comment explaining why they are gone
      .match(/<meta[^>]*apple-mobile-web-app-(capable|status-bar-style)[^>]*>/g)
    expect(active).toBeNull()
  })

  it('still asks for the full screen area, or every env() inset reads 0', () => {
    expect(html).toMatch(/name="viewport"[^>]*viewport-fit=cover/)
  })

  it('keeps the harmless title tag', () => {
    expect(html).toMatch(/apple-mobile-web-app-title/)
  })
})
