import { useApp } from '../contexts/AppContext'
import { formatLastSync } from '../lib/syncStatus'
import { Button } from './ui'

export default function SyncStatusIndicator({ compact = false }: { compact?: boolean }) {
  const { lang, user, isGuest, syncSnapshot, syncNow } = useApp()
  if (isGuest || !user) return null

  const copy = {
    en: {
      offline: 'Offline', syncing: 'Syncing', synced: 'Synced', pending: 'Waiting to sync', error: 'Sync issue', retry: 'Sync now', last: 'Last sync',
    },
    pt: {
      offline: 'Offline', syncing: 'Sincronizando', synced: 'Sincronizado', pending: 'Aguardando sincronização', error: 'Problema de sincronização', retry: 'Sincronizar agora', last: 'Última sincronização',
    },
  }[lang]
  const labels = {
    offline: copy.offline,
    syncing: copy.syncing,
    synced: copy.synced,
    pending: copy.pending,
    error: copy.error,
  }
  const tone = syncSnapshot.state === 'synced' ? 'success' : syncSnapshot.state === 'error' ? 'danger' : syncSnapshot.state === 'offline' || syncSnapshot.state === 'pending' ? 'warning' : 'info'

  if (compact) {
    return (
      <button type="button" className={`hp-sync-chip hp-sync-chip--${tone}`} onClick={() => void syncNow()} title={`${labels[syncSnapshot.state]} · ${formatLastSync(syncSnapshot.lastSyncedAt, lang)}`}>
        <span className="hp-sync-chip__dot" aria-hidden="true" />
        <span className="hp-sync-chip__label">{labels[syncSnapshot.state]}</span>
      </button>
    )
  }

  return (
    <section className={`hp-sync-panel hp-sync-panel--${tone}`} aria-live="polite">
      <div>
        <strong>{labels[syncSnapshot.state]}</strong>
        <p>{syncSnapshot.message || `${copy.last}: ${formatLastSync(syncSnapshot.lastSyncedAt, lang)}`}</p>
      </div>
      <Button size="sm" variant="secondary" onClick={() => void syncNow()} loading={syncSnapshot.state === 'syncing'}>
        {copy.retry}
      </Button>
    </section>
  )
}
