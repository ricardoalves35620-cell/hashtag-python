import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import LessonBlock from '../components/LessonBlock'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'
import GlossaryPanel from '../components/glossary/GlossaryPanel'
import {
  getPedagogicalJourney,
  loadLessonReflection,
  saveLessonReflection,
} from '../lib/pedagogicalJourney'
import { loadJournalPreferences, loadJourneyProgress, markJourneyUnitVisited, saveJournalEntry } from '../lib/learningJournal'

export default function Lesson() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { lang, learnerId, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))
  const requestedUnit = Number(searchParams.get('unit') || '0')
  const [reflection, setReflection] = useState('')
  const [validationMessage, setValidationMessage] = useState('')
  const [visitedUnits, setVisitedUnits] = useState<string[]>([])
  const [journalVisible, setJournalVisible] = useState(() => loadJournalPreferences().showJournal)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const journey = useMemo(() => phase ? getPedagogicalJourney(phase) : [], [phase])
  const unitIndex = Math.min(Math.max(Number.isFinite(requestedUnit) ? requestedUnit : 0, 0), Math.max(journey.length - 1, 0))
  const unit = journey[unitIndex]

  useEffect(() => {
    if (!phase || !unit || !learnerId) {
      setReflection('')
      return
    }
    setReflection(loadLessonReflection(learnerId, phase.id, unit.id))
    setVisitedUnits(markJourneyUnitVisited(learnerId, phase.id, unit.id))
    setJournalVisible(loadJournalPreferences().showJournal)
    setValidationMessage('')
  }, [learnerId, phase, unit])

  if (!phase || !unit) return null

  const goToUnit = (next: number) => {
    setSearchParams({ unit: String(next) })
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
      document.scrollingElement?.scrollTo({ top: 0, behavior: 'auto' })
      setTimeout(() => titleRef.current?.focus({ preventScroll: true }), 0)
    })
  }

  const persistReflection = (value: string) => {
    setReflection(value)
    if (learnerId) saveLessonReflection(learnerId, phase.id, unit.id, value)
  }

  const syncOptionalReflection = () => {
    if (!learnerId || !reflection.trim()) return
    void saveJournalEntry({
      userId: learnerId, phaseId: phase.id, unitId: unit.id,
      prompt: unit.checkpoint[lang], response: reflection, language: lang,
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
    navigate(`/phase/${phase.id}/exercises`)
  }

  const t = {
    en: {
      of: 'Phase', journey: 'Learning journey', previous: 'Previous lesson', next: 'Next lesson',
      complete: 'Complete learning journey →', checkpoint: 'Reasoning checkpoint',
      saved: 'Optional — saved on this device', lesson: 'learning step', lessons: 'learning steps',
      optional: 'Optional Programmer Journal', skip: 'Skip for now', completed: 'journey completed',
    },
    pt: {
      of: 'Fase', journey: 'Jornada de aprendizagem', previous: 'Aula anterior', next: 'Próxima aula',
      complete: 'Concluir jornada de aprendizagem →', checkpoint: 'Parada de raciocínio',
      saved: 'Opcional — salvo neste aparelho', lesson: 'etapa de aprendizagem', lessons: 'etapas de aprendizagem',
      optional: 'Diário do Programador — opcional', skip: 'Pular por agora', completed: 'da jornada concluída',
    },
  }[lang]

  const progressPercent = Math.round((visitedUnits.length / journey.length) * 100)

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.of} ${phase.id}`}
      title={`${t.journey} · ${phase.title[lang]}`}
    >
      <div className="p-4 space-y-4">
        <div className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="flex items-start gap-3">
            <div className="text-3xl" aria-hidden="true">{unit.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs mb-1" style={{ color: 'var(--c-muted)' }}>
                {unitIndex + 1}/{journey.length} {journey.length === 1 ? t.lesson : t.lessons}
              </div>
              <h1 ref={titleRef} tabIndex={-1} className="text-lg font-semibold outline-none" style={{ color: 'var(--c-text)' }}>{unit.title[lang]}</h1>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{unit.purpose[lang]}</p>
            </div>
            <GlossaryPanel lang={lang} />
          </div>
          <div className="flex justify-between gap-3 mt-4 text-xs" style={{ color: 'var(--c-muted)' }}><span>{visitedUnits.length}/{journey.length}</span><span>{progressPercent}% {t.completed}</span></div>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progressPercent}%`, background: 'var(--c-purple)' }} />
          </div>
          <div className="grid gap-1 mt-3" style={{ gridTemplateColumns: `repeat(${Math.min(journey.length, 5)}, minmax(0, 1fr))` }} aria-label={t.journey}>
            {journey.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => index <= unitIndex && goToUnit(index)}
                disabled={index > unitIndex}
                title={item.title[lang]}
                className="rounded-lg py-2 text-xs"
                style={{
                  border: '1px solid var(--c-border)',
                  background: index === unitIndex ? 'var(--c-purple-dm)' : index < unitIndex ? 'var(--c-card2)' : 'var(--c-bg)',
                  color: index <= unitIndex ? 'var(--c-text)' : 'var(--c-dimmer)',
                  cursor: index <= unitIndex ? 'pointer' : 'not-allowed',
                }}
              >
                {index < unitIndex ? '✓' : index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {unit.blocks.map((block, index) => <LessonBlock key={`${unit.id}-${index}`} block={block} lang={lang} />)}
        </div>

        {journalVisible && <section className="rounded-xl p-4" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
          <div className="flex items-center justify-between gap-3 mb-2"><div className="text-sm font-semibold" style={{ color: 'var(--c-purple-l)' }}>{t.optional}</div><button type="button" onClick={() => setJournalVisible(false)} className="text-xs underline" style={{ color: 'var(--c-muted)' }}>{t.skip}</button></div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--c-text2)' }}>{unit.checkpoint[lang]}</p>
          <textarea
            value={reflection}
            onChange={event => persistReflection(event.target.value)}
            placeholder={unit.checkpointPlaceholder[lang]}
            rows={5}
            className="w-full rounded-xl p-3 text-sm leading-relaxed resize-y"
            style={{ background: 'var(--c-bg)', color: 'var(--c-text)', border: '1px solid var(--c-border)', minHeight: 120 }}
            data-testid="lesson-reflection"
          />
          <div className="flex justify-between gap-3 mt-2 text-xs" style={{ color: validationMessage ? '#fca5a5' : 'var(--c-muted)' }}>
            <span>{validationMessage || t.saved}</span>
            <span>{reflection.trim().length}</span>
          </div>
        </section>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => goToUnit(unitIndex - 1)}
            disabled={unitIndex === 0}
            className="rounded-xl py-3 px-4 text-sm font-semibold"
            style={{
              border: '1px solid var(--c-border)', background: 'var(--c-card)', color: 'var(--c-text2)',
              opacity: unitIndex === 0 ? 0.45 : 1,
            }}
          >
            ← {t.previous}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl py-3 px-4 text-sm font-semibold text-white"
            style={{ border: 'none', background: 'var(--c-purple)', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' }}
            data-testid="lesson-next"
          >
            {unitIndex === journey.length - 1 ? t.complete : `${t.next} →`}
          </button>
        </div>
        <div className="h-4" />
      </div>
    </Layout>
  )
}
