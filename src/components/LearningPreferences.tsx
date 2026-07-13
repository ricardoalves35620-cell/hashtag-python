import { useEffect, useState } from 'react'
import { loadJournalPreferences, saveJournalPreferences, type JournalPreferences } from '../lib/learningJournal'
import type { Lang } from '../data/types'

export default function LearningPreferences({ lang }: { lang: Lang }) {
  const [prefs, setPrefs] = useState<JournalPreferences>(() => loadJournalPreferences())
  useEffect(() => saveJournalPreferences(prefs), [prefs])
  const copy = lang === 'pt' ? {
    title: 'Como você prefere aprender', desc: 'Estas opções personalizam a experiência. Nenhuma reflexão opcional bloqueia seu progresso.',
    showJournal: 'Mostrar Diário do Programador', showDetailedExplanations: 'Mostrar explicações detalhadas',
    showFlowcharts: 'Mostrar fluxogramas', showPseudocode: 'Mostrar pseudocódigo', showExtraChallenges: 'Mostrar desafios extras',
  } : {
    title: 'How you prefer to learn', desc: 'These options personalize the experience. Optional reflections never block progress.',
    showJournal: 'Show Programmer Journal', showDetailedExplanations: 'Show detailed explanations',
    showFlowcharts: 'Show flowcharts', showPseudocode: 'Show pseudocode', showExtraChallenges: 'Show extra challenges',
  }
  const keys = Object.keys(prefs) as (keyof JournalPreferences)[]
  return <section className="rounded-2xl p-4 space-y-3" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
    <div><h2 className="font-semibold" style={{ color: 'var(--c-text)' }}>{copy.title}</h2><p className="text-sm mt-1" style={{ color: 'var(--c-text2)' }}>{copy.desc}</p></div>
    {keys.map(key => <label key={key} className="flex items-center justify-between gap-4 rounded-xl p-3" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)' }}>
      <span className="text-sm" style={{ color: 'var(--c-text)' }}>{copy[key]}</span>
      <input type="checkbox" checked={prefs[key]} onChange={e => setPrefs(current => ({ ...current, [key]: e.target.checked }))} />
    </label>)}
  </section>
}
