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
        // A reload is a navigation request. Without a fallback the service worker has
        // nothing mapped to the URL, so offline the page fails to open at all — even
        // though every asset it needs is already precached.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /\.[^/]+$/],
        // Without these, a deploy leaves the previous index.html in the precache.
        // It then requests asset hashes that no longer exist on the server and the
        // app fails to boot until the user hard-refreshes.
        cleanupOutdatedCaches: true,
        // Do NOT claim open tabs mid-session: the running page still references the
        // previous build's chunks, and taking over deletes them under its feet.
        clientsClaim: false,
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
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/pyodide\/v0\.25\.1\/full\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pyodide-runtime-v0.25.1',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 90 }
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
