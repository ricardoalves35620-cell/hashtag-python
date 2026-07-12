import { Fragment, useMemo, useState } from 'react'
import { glossaryAliases, type GlossaryEntry } from '../../data/glossary'
import type { Lang } from '../../data/types'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function GlossaryText({ text, lang, className, style }: { text: string; lang: Lang; className?: string; style?: React.CSSProperties }) {
  const [selected, setSelected] = useState<GlossaryEntry | null>(null)
  const aliases = useMemo(() => glossaryAliases(lang), [lang])
  const aliasMap = useMemo(() => new Map(aliases.map(item => [item.alias.toLocaleLowerCase(), item.entry])), [aliases])
  const regex = useMemo(() => {
    const source = aliases.map(item => escapeRegExp(item.alias)).join('|')
    return new RegExp(`(?<![\\p{L}\\p{N}_])(${source})(?![\\p{L}\\p{N}_])`, 'giu')
  }, [aliases])
  const parts = useMemo(() => text.split(regex), [text, regex])

  return (
    <>
      <div className={className} style={{ ...style, whiteSpace: 'pre-line' }}>
        {parts.map((part, index) => {
          const entry = aliasMap.get(part.toLocaleLowerCase())
          if (!entry) return <Fragment key={index}>{part}</Fragment>
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(entry)}
              title={lang === 'en' ? 'Open glossary definition' : 'Abrir definição no glossário'}
              style={{ color: 'inherit', textDecoration: 'underline dotted', textUnderlineOffset: 3, background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'help' }}
            >
              {part}
            </button>
          )
        })}
      </div>
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, zIndex: 1500, background: 'rgba(0,0,0,.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 16 }}>
          <div onClick={event => event.stopPropagation()} style={{ width: '100%', maxWidth: 520, background: 'var(--c-card)', border: '1px solid var(--c-border)', borderRadius: 18, padding: 20, marginBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-purple-l)' }}>{lang === 'en' ? 'Glossary' : 'Glossário'}</div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{selected.term[lang]}</h3>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-muted)', width: 36, height: 36, borderRadius: 10 }}>✕</button>
            </div>
            <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--c-text2)' }}>{selected.definition[lang]}</p>
            {selected.example && <div className="text-sm rounded-xl p-3 mt-3" style={{ background: 'var(--c-bg)', color: 'var(--c-muted)' }}>💡 {selected.example[lang]}</div>}
          </div>
        </div>
      )}
    </>
  )
}
