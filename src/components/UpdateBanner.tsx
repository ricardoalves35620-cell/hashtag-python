import { useEffect, useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { onUpdateAvailable, applyPendingUpdate } from '../lib/serviceWorkerUpdate'

/**
 * "A new version is ready" — the one thing that was missing between a deploy and a learner.
 *
 * Deliberately a prompt and not an automatic reload: taking over mid-exercise would discard
 * whatever is in the editor. The learner picks the moment.
 */
export default function UpdateBanner() {
  const { lang } = useApp()
  const [available, setAvailable] = useState(false)

  useEffect(() => onUpdateAvailable(setAvailable), [])

  if (!available) return null

  return (
    <div className="hp-update-banner" role="status">
      <span>{lang === 'en' ? 'A new version is ready.' : 'Uma nova versão está pronta.'}</span>
      <button type="button" onClick={applyPendingUpdate}>
        {lang === 'en' ? 'Update now' : 'Atualizar agora'}
      </button>
      <button type="button" className="hp-update-banner__later" onClick={() => setAvailable(false)}>
        {lang === 'en' ? 'Later' : 'Depois'}
      </button>
    </div>
  )
}
