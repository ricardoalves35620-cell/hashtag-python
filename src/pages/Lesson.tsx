import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LessonBlock from '../components/LessonBlock'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))

  if (!phase) return null

  // Stub phase check - show coming soon
  const isStub = phase.lesson.blocks.length <= 2 && 
    phase.lesson.blocks.some(b => b.content?.en?.includes('being prepared'))

  const handleComplete = async () => {
    if (!user) return
    await markStepDone(user.id, phase.id, 'lesson')
    await refreshProgress()
    navigate(`/phase/${phase.id}/exercises`)
  }

  const t = {
    en: { complete: 'Complete Lesson →', progress: 'Lesson', of: 'Phase' },
    pt: { complete: 'Concluir Aula →', progress: 'Aula', of: 'Fase' }
  }[lang]

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.of} ${phase.id}`}
      title={`${t.progress} · ${phase.title[lang]}`}
    >
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">{phase.icon}</div>
          <h1 className="text-lg font-medium text-white">{phase.lesson.title[lang]}</h1>
        </div>

        {isStub && (
          <div style={{ background: '#1a1040', border: '1px solid var(--c-purple-dm)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--c-purple-l)', marginBottom: 6 }}>
              {lang === 'en' ? '🚧 Content in preparation' : '🚧 Conteúdo em preparação'}
            </div>
            <p style={{ fontSize: 13, color: 'var(--c-text2)', margin: 0, lineHeight: 1.6 }}>
              {lang === 'en'
                ? 'Complete the previous phases first. This phase will be unlocked as you progress.'
                : 'Complete as fases anteriores primeiro. Esta fase será desbloqueada conforme você avança.'}
            </p>
          </div>
        )}
        {phase.lesson.blocks.map((block, i) => (
          <LessonBlock key={i} block={block} lang={lang} />
        ))}

        <div className="pt-4">
          <button
            onClick={handleComplete}
            className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
          >
            {t.complete}
          </button>
        </div>
        <div className="h-4" />
      </div>
    </Layout>
  )
}
