import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import LessonBlock from '../components/LessonBlock'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'
import GlossaryPanel from '../components/glossary/GlossaryPanel'
import LearningCallout from '../components/learning/LearningCallout'
import LearningHero from '../components/learning/LearningHero'
import LearningStageRail from '../components/learning/LearningStageRail'
import StickyLearningActions from '../components/learning/StickyLearningActions'
import {
  getPedagogicalJourney,
  loadLessonReflection,
  saveLessonReflection,
} from '../lib/pedagogicalJourney'
import { fetchJournalEntry, hydrateJourneyProgress, loadJournalPreferences, loadJourneyProgress, markJourneyUnitVisited, saveJournalEntry } from '../lib/learningJournal'
import { scrollToTop } from '../lib/scroll'

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { lang, learnerId, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))
  const requestedUnit = Number(searchParams.get('unit') || '0')
  const [reflection, setReflection] = useState('')
  const [visitedUnits, setVisitedUnits] = useState<string[]>([])
  const [journalVisible, setJournalVisible] = useState(() => loadJournalPreferences().showJournal)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const journalSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const journey = useMemo(() => phase ? getPedagogicalJourney(phase) : [], [phase])
  const unitIndex = Math.min(Math.max(Number.isFinite(requestedUnit) ? requestedUnit : 0, 0), Math.max(journey.length - 1, 0))
  const unit = journey[unitIndex]

  useEffect(() => {
    if (!phase || !unit || !learnerId) {
      setReflection('')
      return
    }
    const localReflection = loadLessonReflection(learnerId, phase.id, unit.id)
    setReflection(localReflection)
    const stored = loadJourneyProgress(learnerId, phase.id)
    const visited = markJourneyUnitVisited(learnerId, phase.id, unit.id)
    setVisitedUnits(Array.from(new Set([...stored, ...visited])))
    setJournalVisible(loadJournalPreferences().showJournal)

    if (learnerId !== 'guest') {
      void hydrateJourneyProgress(learnerId, phase.id).then(setVisitedUnits)
      void fetchJournalEntry(learnerId, phase.id, unit.id).then(remote => {
        if (!remote.trim() || localReflection.trim()) return
        saveLessonReflection(learnerId, phase.id, unit.id, remote)
        setReflection(remote)
      })
    }
  }, [learnerId, phase, unit])

  if (!phase || !unit) return null

  const goToUnit = (next: number) => {
    const bounded = Math.min(Math.max(next, 0), journey.length - 1)
    setSearchParams({ unit: String(bounded) })
    requestAnimationFrame(() => {
      scrollToTop()
      setTimeout(() => titleRef.current?.focus({ preventScroll: true }), 0)
    })
  }

  const persistReflection = (value: string) => {
    setReflection(value)
    if (!learnerId) return
    saveLessonReflection(learnerId, phase.id, unit.id, value)
    if (journalSyncTimer.current) clearTimeout(journalSyncTimer.current)
    if (!value.trim() || learnerId === 'guest') return
    journalSyncTimer.current = setTimeout(() => {
      void saveJournalEntry({
        userId: learnerId,
        phaseId: phase.id,
        unitId: unit.id,
        prompt: unit.checkpoint[lang],
        response: value,
        language: lang,
      })
    }, 900)
  }

  const syncOptionalReflection = () => {
    if (!learnerId || !reflection.trim()) return
    void saveJournalEntry({
      userId: learnerId,
      phaseId: phase.id,
      unitId: unit.id,
      prompt: unit.checkpoint[lang],
      response: reflection,
      language: lang,
    })
  }

  const handleNext = async () => {
    syncOptionalReflection()
    if (unitIndex < journey.length - 1) {
      goToUnit(unitIndex + 1)
      return
    }
    if (!learnerId) return
    await markStepDone(learnerId, phase.id, 'lesson')
    await refreshProgress()
    scrollToTop()
    navigate(`/phase/${phase.id}/exercises`)
  }

  const t = {
    en: {
      of: 'Phase', journey: 'Learning journey', previous: 'Previous lesson', next: 'Next lesson',
      complete: 'Complete journey and practice →', lesson: 'learning step', lessons: 'learning steps',
      optional: 'Programmer Journal', skip: 'Hide for now', completed: 'of the journey explored',
      progress: 'Journey progress', journalBadge: 'Optional', journalHelp: 'Use this space when writing helps you organize your reasoning. Leaving it empty never blocks your progress.',
      currentGoal: 'Your goal in this step', professionalHabit: 'Professional habit', professionalText: 'Do not rush to the final code. First make the problem, data and decision visible. Experienced developers reduce uncertainty before they type.',
      visited: 'visited', openGlossary: 'Open glossary', navigation: 'Journey map',
    },
    pt: {
      of: 'Fase', journey: 'Jornada de aprendizagem', previous: 'Aula anterior', next: 'Próxima aula',
      complete: 'Concluir jornada e praticar →', lesson: 'etapa de aprendizagem', lessons: 'etapas de aprendizagem',
      optional: 'Diário do Programador', skip: 'Ocultar por agora', completed: 'da jornada explorada',
      progress: 'Progresso da jornada', journalBadge: 'Opcional', journalHelp: 'Use este espaço quando escrever ajudar a organizar seu raciocínio. Deixar vazio nunca bloqueia seu progresso.',
      currentGoal: 'Seu objetivo nesta etapa', professionalHabit: 'Hábito profissional', professionalText: 'Não corra para o código final. Primeiro torne visíveis o problema, os dados e a decisão. Desenvolvedores experientes reduzem a incerteza antes de digitar.',
      visited: 'visitadas', openGlossary: 'Abrir glossário', navigation: 'Mapa da jornada',
    },
  }[lang]

  const visitedSet = new Set(visitedUnits)
  const progressPercent = Math.round((visitedSet.size / journey.length) * 100)
  const stageItems = journey.map((item, index) => ({
    id: item.id,
    icon: item.icon,
    title: item.title[lang].replace(/^\d+\.\s*/, ''),
    description: item.purpose[lang],
    active: item.id === unit.id,
    done: visitedSet.has(item.id) && item.id !== unit.id,
    available: visitedSet.has(item.id) || index <= unitIndex,
  }))

  const openStage = (stageId: string) => {
    const index = journey.findIndex(item => item.id === stageId)
    if (index >= 0) goToUnit(index)
  }

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.of} ${phase.id}`}
      title={`${t.journey} · ${phase.title[lang]}`}
    >
      <div className="learning-workspace">
        <div className="learning-workspace__grid">
          <aside className="learning-workspace__aside">
            <LearningStageRail
              items={stageItems}
              currentId={unit.id}
              onSelect={openStage}
              label={t.navigation}
              compactLabel={t.journey}
            />
          </aside>

          <main className="learning-reading-column" data-testid="learning-engine-v25">
            <div className="learning-content-stack">
              <LearningHero
                eyebrow={`${t.of} ${phase.id} · ${phase.title[lang]}`}
                title={unit.title[lang].replace(/^\d+\.\s*/, '')}
                description={unit.purpose[lang]}
                icon={unit.icon}
                current={unitIndex + 1}
                total={journey.length}
                progress={progressPercent}
                progressLabel={t.progress}
                secondaryLabel={`${visitedSet.size}/${journey.length} ${journey.length === 1 ? t.lesson : t.lessons} ${t.visited} · ${progressPercent}% ${t.completed}`}
                action={<GlossaryPanel lang={lang} />}
                titleRef={titleRef}
              />

              <LearningCallout variant="idea" title={t.currentGoal}>
                {unit.checkpoint[lang]}
              </LearningCallout>

              <article className="learning-content-card learning-content-stack" aria-labelledby="lesson-content-title">
                <span id="lesson-content-title" className="sr-only">{unit.title[lang]}</span>
                {unit.blocks.map((block, index) => <LessonBlock key={`${unit.id}-${index}`} block={block} lang={lang} />)}
              </article>

              <LearningCallout variant="professional" title={t.professionalHabit}>
                {t.professionalText}
              </LearningCallout>

              {journalVisible && (
                <section className="learning-journal-card" data-testid="optional-learning-journal">
                  <div className="learning-journal-card__header">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-semibold m-0" style={{ color: 'var(--c-text)' }}>{t.optional}</h2>
                        <span className="learning-journal-card__optional">{t.journalBadge}</span>
                      </div>
                      <p className="text-xs mt-2 mb-0 leading-relaxed" style={{ color: 'var(--c-muted)' }}>{t.journalHelp}</p>
                    </div>
                    <button type="button" onClick={() => setJournalVisible(false)} className="text-xs underline" style={{ color: 'var(--c-muted)', background: 'none', border: 0 }}>{t.skip}</button>
                  </div>
                  <p className="text-sm leading-relaxed mt-4 mb-3 font-medium" style={{ color: 'var(--c-text2)' }}>{unit.checkpoint[lang]}</p>
                  <textarea
                    value={reflection}
                    onChange={event => persistReflection(event.target.value)}
                    placeholder={unit.checkpointPlaceholder[lang]}
                    rows={5}
                    className="w-full rounded-xl p-3 text-sm leading-relaxed resize-y"
                    style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)', minHeight: 120 }}
                    data-testid="lesson-reflection"
                  />
                  <div className="flex justify-between gap-3 mt-2 text-xs" style={{ color: 'var(--c-muted)' }}>
                    <span>{t.journalHelp}</span>
                    <span aria-label={`${reflection.trim().length} characters`}>{reflection.trim().length}</span>
                  </div>
                </section>
              )}

              <StickyLearningActions
                status={`${unitIndex + 1}/${journey.length}`}
                previous={(
                  <button
                    type="button"
                    onClick={() => goToUnit(unitIndex - 1)}
                    disabled={unitIndex === 0}
                    className="rounded-xl py-3 px-4 text-sm font-semibold"
                    style={{ border: '1px solid var(--c-border)', background: 'var(--c-card)', color: 'var(--c-text2)' }}
                  >
                    ← {t.previous}
                  </button>
                )}
                next={(
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-xl py-3 px-4 text-sm font-semibold text-white"
                    style={{ border: 'none', background: 'var(--c-purple)', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' }}
                    data-testid="lesson-next"
                  >
                    {unitIndex === journey.length - 1 ? t.complete : `${t.next} →`}
                  </button>
                )}
              />
              <div className="h-4" />
            </div>
          </main>
        </div>
      </div>
    </Layout>
  )
}
