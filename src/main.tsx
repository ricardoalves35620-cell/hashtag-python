import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'
import './index.css'

// Build metadata must never prevent the learning experience from starting.
// Vite exposes safe fallbacks in development and injects release values in CI.
document.documentElement.dataset.appVersion = import.meta.env.VITE_APP_VERSION || 'dev'
document.documentElement.dataset.buildSha = import.meta.env.VITE_APP_BUILD_SHA || 'local'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
)
