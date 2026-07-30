import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const appVersion = process.env.npm_package_version || 'unknown'
const buildSha = process.env.VITE_BUILD_SHA || process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || 'local'

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __APP_BUILD_SHA__: JSON.stringify(buildSha),
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt': the new worker installs, precaches, and WAITS. serviceWorkerUpdate.ts
      // notices it, UpdateBanner offers it, and the learner picks the moment —
      // applyPendingUpdate() messages skipWaiting and the page reloads onto the new
      // build. Both halves exist and are wired in main.tsx.
      //
      // The history, because each wrong setting was tried for a reason:
      // - 'prompt' with NO prompt wired stranded every open client on the old build
      //   forever (the 2026-07-30 outage: waiting worker + navigateFallback serving a
      //   stale index.html whose chunks the server had dropped).
      // - 'autoUpdate' fixed that by force-activating — and force-RELOADING every open
      //   tab mid-exercise (vite-plugin-pwa reloads on 'activated' in auto mode), while
      //   making onNeedRefresh dead code, so the banner could never show. Measured in
      //   the 2026-07-30 reproduction.
      // 'prompt' with the prompt actually wired is the setting both of those were
      // reaching for. audit:sw holds the built worker to it.
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      // Single source of truth for the manifest. public/manifest.json used to be a
      // second, hand-maintained copy that Vite shipped verbatim; the two had already
      // drifted (lang, description), and it was never precached.
      manifest: {
        // Without `id`, a browser can treat a redeploy as a different app and drop
        // this origin's storage — which here means the learner's progress.
        id: '/',
        name: 'Hashtag Python',
        short_name: 'Python',
        description: 'Learn Python deeply from digital foundations to advanced paths',
        lang: 'pt-BR',
        dir: 'ltr',
        theme_color: '#5b21b6',
        background_color: '#0a0a18',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen'],
        // No orientation lock: it breaks tablet multitasking and stops a learner
        // rotating to get a wider code editor.
        start_url: '/',
        scope: '/',
        categories: ['education', 'productivity'],
        screenshots: [
          {
            src: '/icons/screenshot-mobile.png', sizes: '390x844', type: 'image/png',
            form_factor: 'narrow', label: 'Painel do curso'
          }
        ],
        icons: [
          { src: '/icons/icon-72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icons/icon-96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // The Python runtime is 12 MB and most first visits never run code, so it is
        // fetched on demand and cached by the rule below rather than precached.
        globIgnores: ['**/pyodide/**'],
        // A reload is a navigation request. Without a fallback the service worker has
        // nothing mapped to the URL, so offline the page fails to open at all — even
        // though every asset it needs is already precached.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /\.[^/]+$/],
        /*
         * `skipWaiting: false` + the WIRED prompt is the update policy. The new worker
         * waits until the learner accepts (UpdateBanner → messageSkipWaiting) or every
         * client is gone. The 2026-07-30 outage — waiting worker + navigateFallback
         * serving a stale index.html forever — was skipWaiting:false with NO prompt
         * wired: the waiting half without the telling half. The prompt now exists
         * (main.tsx → installUpdatePrompt → UpdateBanner), so waiting is a choice the
         * learner gets to end, not a dead end.
         *
         * A correction, verified against the built worker and at runtime in the
         * 2026-07-30 reproduction: `cleanupOutdatedCaches` does NOT decide whether a
         * claimed tab keeps its chunks. Workbox's PrecacheController.activate
         * unconditionally deletes every cached URL that is not in the incoming
         * manifest; this flag only removes caches left by OLDER WORKBOX naming
         * schemes. So the moment any new worker activates under a live tab, that
         * tab's not-yet-visited chunks are gone, whatever this flag says. With
         * 'prompt', activation happens at a moment the accepting tab chose — that tab
         * reloads immediately — and any OTHER open tab that trips over the deleted
         * chunks is caught by appUpdate.ts, which spends one recovery reload per
         * build and lets a real failure surface rather than loop.
         */
        cleanupOutdatedCaches: false,
        clientsClaim: true,
        skipWaiting: false,
        runtimeCaching: [
          {
            // Order matters: Workbox matches in registration order, so auth must come
            // first. A cached /auth/v1/* response resurrects a signed-out session and
            // leaves token material on disk — bad on a shared family device.
            urlPattern: /^https:\/\/[^/]+\.supabase\.co\/auth\/v1\/.*/i,
            handler: 'NetworkOnly'
          },
          {
            // Was: every supabase.co path, NetworkFirst, no expiration at all —
            // unbounded growth plus an on-disk cache of authenticated responses.
            urlPattern: /^https:\/\/[^/]+\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'supabase-rest-v1',
              networkTimeoutSeconds: 3,
              // Short on purpose: this cache exists so the app opens offline, not
              // to make it faster online.
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [200] },
              // workbox-build's GenerateSW schema nests this under `options`.
              broadcastUpdate: { options: { headersToCheck: ['content-length', 'etag', 'last-modified'] } }
            }
          },
          {
            // Same origin, because importScripts() across origins returns an opaque
            // response that CacheFirst refuses to store. Under the old CDN rule only
            // three of the five runtime files cached, and offline execution silently
            // relied on the browser's HTTP cache still holding the other two.
            urlPattern: ({ url }) => url.pathname.startsWith('/pyodide/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'pyodide-runtime-v0.25.1',
              // 90 days: the runtime is immutable for a given version, and the cache
              // name carries the version, so a bump gets a fresh cache.
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [200] }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@supabase')) return 'supabase'
          if (id.includes('node_modules/@codemirror') || id.includes('node_modules/codemirror')) return 'editor'
          if (id.includes('node_modules/react')) return 'react'
          // Phase modules share a common factory and cross-reference metadata.
          // Keep them together to avoid circular Rollup chunks while still
          // separating the curriculum from the application shell.
          if (id.includes('/src/data/phases/')) return 'curriculum-content'
          if (id.includes('/src/data/fasttrack')) return 'fasttrack-content'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['pyodide']
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
