import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'
import { installAppUpdateRecovery } from './lib/appUpdate'
import { installOutboxDrain } from './lib/outbox'
import { installUpdatePrompt } from './lib/serviceWorkerUpdate'
import './index.css'

document.documentElement.dataset.appVersion = __APP_VERSION__
document.documentElement.dataset.buildSha = __APP_BUILD_SHA__

// appUpdate.ts was written to recover a tab that is still holding chunk names from
// a build that has since been replaced — but nothing ever imported it, so the
// recovery never ran. With skipWaiting:false there is no other update path.
installAppUpdateRecovery()

// Replays writes that could not reach the server, on reconnect / focus / foreground.
installOutboxDrain()

// Notices a waiting service worker and offers the learner the new build. Without this,
// registerType 'prompt' means a new build waits forever behind an open tab — which is how
// a translation shipped on 2026-07-29 was still not on screen nineteen commits later.
void installUpdatePrompt()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
)
