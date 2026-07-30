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
      // 'autoUpdate' FORCES skipWaiting:true and clientsClaim:true in the generated
      // service worker, silently overriding the two options set under `workbox` below —
      // including the one whose comment says "Do NOT claim open tabs mid-session".
      //
      // The result is the failure that comment describes: a new build activates under a
      // running tab, cleanupOutdatedCaches deletes the chunks that tab is still holding,
      // the next lazy import 404s, and the learner gets "Algo interrompeu a aula" on
      // reload. Reported from the app as happening often.
      //
      // 'prompt' respects them: the new worker waits until the old page is gone.
      // 'autoUpdate' so the waiting worker actually activates. With
      // cleanupOutdatedCaches now false, activating no longer strands a live tab.
      registerType: 'autoUpdate',
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
         * These two settings were in opposition, and the deadlock between them took the
         * site down on 2026-07-30.
         *
         * `navigateFallback` above means EVERY navigation is answered from the worker's
         * precache — including an OAuth redirect back to /#access_token=... So whichever
         * index.html the ACTIVE worker precached is the index.html the app boots from.
         *
         * `skipWaiting: false` means a new worker never becomes active while any client
         * exists. On an installed app that is close to never. So the active worker stayed
         * on an old generation, kept serving its old index.html, and that file asked for
         * asset hashes that later deploys had removed from the server. Every navigation
         * died on `Failed to load module script … MIME type "text/html"`, while
         * Ctrl+Shift+R — which bypasses the worker — reached the real index and booted
         * fine. That asymmetry is the signature, and it is what the reporter saw: the
         * login page appeared on a hard reload and the redirect after login went blank.
         *
         * `skipWaiting: false` was chosen for a real reason — taking over a live tab while
         * `cleanupOutdatedCaches` deletes the chunks it is still holding produces the
         * "Algo interrompeu a aula" crash. But the cause of THAT is the cleanup, not the
         * takeover. So: take over promptly, and stop deleting the old build's chunks. A
         * tab mid-lesson keeps the files it is using, and the next navigation gets the
         * new build. Neither failure remains available.
         *
         * The cost is precache growth across deploys, which Workbox bounds by revision
         * and which is a far smaller price than an app that cannot start.
         */
        cleanupOutdatedCaches: false,
        clientsClaim: true,
        skipWaiting: true,
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
