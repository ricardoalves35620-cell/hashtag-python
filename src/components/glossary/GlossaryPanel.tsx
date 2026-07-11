import { useMemo, useState } from 'react'
import { GLOSSARY } from '../../data/glossary'
import type { Lang } from '../../data/types'

export default function GlossaryPanel({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return GLOSSARY
    return GLOSSARY.filter(entry => `${entry.term[lang]} ${entry.definition[lang]} ${entry.aliases[lang]}`.toLocaleLowerCase().includes(normalized))
  }, [query, lang])

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--c-purple-f)', color: 'var(--c-purple-l)', border: '1px solid var(--c-purple-dm)' }}>
        📖 {lang === 'en' ? 'Glossary' : 'Glossário'}
      </button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'var(--c-bg)', overflowY: 'auto' }}>
          <div className="max-w-lg md:max-w-2xl mx-auto p-4" style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)', paddingBottom: 32 }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-purple-l)' }}>{lang === 'en' ? 'Reference' : 'Referência'}</div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{lang === 'en' ? 'Python glossary' : 'Glossário de Python'}</h2>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', width: 40, height: 40, borderRadius: 12 }}>✕</button>
            </div>
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder={lang === 'en' ? 'Search a term...' : 'Buscar um termo...'} className="w-full rounded-xl px-4 py-3 mb-4" style={{ background: 'var(--c-card)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }} />
            <div className="space-y-3">
              {filtered.map(entry => (
                <div key={entry.id} className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                  <div className="font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{entry.term[lang]}</div>
                  <div className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{entry.definition[lang]}</div>
                  {entry.example && <div className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>{entry.example[lang]}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
