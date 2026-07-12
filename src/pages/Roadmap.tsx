import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { CURRICULUM_PATHS, type CurriculumPathId, type CurriculumStatus } from '../data/curriculum'

function statusLabel(status: CurriculumStatus, lang: 'en' | 'pt') {
  if (status === 'available') return lang === 'en' ? 'Available now' : 'Disponível agora'
  if (status === 'next') return lang === 'en' ? 'Next to build' : 'Próxima entrega'
  return lang === 'en' ? 'Planned' : 'Planejado'
}

export default function Roadmap() {
  const { lang } = useApp()
  const [activePath, setActivePath] = useState<CurriculumPathId>('core')
  const path = useMemo(() => CURRICULUM_PATHS.find(item => item.id === activePath)!, [activePath])

  const t = {
    en: {
      title: 'Learning paths', heading: 'A complete path, without false promises',
      intro: 'The complete Python spine and the optional local-AI specialization are now published. The map makes prerequisites and realistic desktop practice explicit.',
      required: 'Mandatory', optional: 'Optional specialization', hours: 'estimated hours',
      phases: 'phases', outcomes: 'You will be able to',
      honesty: 'The web app teaches, evaluates and simulates the complete path. PyTorch training and local model execution still require a desktop Python environment and suitable hardware; no paid AI API is required.'
    },
    pt: {
      title: 'Trilhas', heading: 'Um caminho completo, sem promessas falsas',
      intro: 'A espinha dorsal completa de Python e a especialização opcional em IA local estão publicadas. O mapa deixa claros os pré-requisitos e a prática real necessária no computador.',
      required: 'Obrigatória', optional: 'Especialização opcional', hours: 'horas estimadas',
      phases: 'fases', outcomes: 'Ao terminar, você poderá',
      honesty: 'O app web ensina, avalia e simula o caminho completo. Treino com PyTorch e execução de modelos locais ainda exigem um ambiente Python desktop e hardware adequado; nenhuma API paga de IA é necessária.'
    }
  }[lang]

  return (
    <Layout title={t.title}>
      <div className="p-4 space-y-4">
        <section className="rounded-2xl p-5" style={{ background: 'linear-gradient(145deg, var(--c-purple-f), var(--c-card))', border: '1px solid var(--c-purple-dm)' }}>
          <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--c-purple-l)' }}>#Python Roadmap</div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--c-text)' }}>{t.heading}</h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.intro}</p>
        </section>

        <div className="grid grid-cols-2 gap-2">
          {CURRICULUM_PATHS.map(item => {
            const selected = item.id === activePath
            return (
              <button
                key={item.id}
                onClick={() => setActivePath(item.id)}
                className="rounded-xl p-3 text-left"
                style={{
                  background: selected ? 'var(--c-purple-dm)' : 'var(--c-card)',
                  border: selected ? '1px solid var(--c-purple)' : '1px solid var(--c-border)',
                  color: selected ? 'var(--c-purple-l)' : 'var(--c-text2)'
                }}
              >
                <div className="text-xs font-medium mb-1">{item.required ? `🎓 ${t.required}` : `🤖 ${t.optional}`}</div>
                <div className="text-sm font-semibold">{item.title[lang]}</div>
              </button>
            )
          })}
        </div>

        <section className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--c-muted)' }}>{path.subtitle[lang]}</div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--c-text)' }}>{path.title[lang]}</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{path.description[lang]}</p>
          <Link
            to={path.id === 'ai-local' ? '/ai-lab' : '/engineering-lab'}
            className="inline-flex mt-4 rounded-lg px-3 py-2 text-xs font-medium"
            style={{ background: 'var(--c-purple-dm)', color: 'var(--c-purple-l)', border: '1px solid var(--c-purple)' }}
          >
            {path.id === 'ai-local'
              ? (lang === 'en' ? 'Open Local AI Lab →' : 'Abrir Laboratório de IA Local →')
              : (lang === 'en' ? 'Open Engineering Lab →' : 'Abrir Laboratório de Engenharia →')}
          </Link>
        </section>

        <div className="space-y-3">
          {path.stages.map((stage, index) => {
            const available = stage.status === 'available'
            const next = stage.status === 'next'
            return (
              <article key={stage.id} className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: `1px solid ${available ? '#1f6f45' : next ? 'var(--c-purple)' : 'var(--c-border)'}` }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-mono font-semibold" style={{ background: available ? 'rgba(34,197,94,.14)' : next ? 'var(--c-purple-dm)' : 'var(--c-bg)', color: available ? '#4ade80' : next ? 'var(--c-purple-l)' : 'var(--c-muted)' }}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{stage.title[lang]}</h3>
                      <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: available ? 'rgba(34,197,94,.12)' : next ? 'var(--c-purple-dm)' : 'var(--c-bg)', color: available ? '#4ade80' : next ? 'var(--c-purple-l)' : 'var(--c-muted)' }}>
                        {statusLabel(stage.status, lang)}
                      </span>
                    </div>
                    <div className="text-[11px] mb-2" style={{ color: 'var(--c-muted)' }}>
                      {stage.phaseRange && `${t.phases} ${stage.phaseRange[0]}–${stage.phaseRange[1]} · `}
                      {stage.estimatedHours} {t.hours}
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--c-text2)' }}>{stage.description[lang]}</p>
                    <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--c-muted)' }}>{t.outcomes}</div>
                    <div className="space-y-1">
                      {stage.outcomes[lang].map(outcome => (
                        <div key={outcome} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--c-text2)' }}>
                          <span style={{ color: available ? '#4ade80' : 'var(--c-purple-l)' }}>→</span>
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: '#2a1d05', border: '1px solid #6b4d12', color: '#f8d477' }}>
          <strong>{lang === 'en' ? 'Important:' : 'Importante:'}</strong> {t.honesty}
        </div>
      </div>
    </Layout>
  )
}
