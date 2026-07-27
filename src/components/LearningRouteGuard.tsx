import { useNavigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import Layout from './Layout'
import { Button, Card } from './ui'
import { useApp } from '../contexts/AppContext'
import { PHASE_IDS, PROJECT_PHASE_BY_ID } from '../data/progressionCatalog'
import { canAccessLearningStep, type LearningStep } from '../lib/learningAccess'

interface Props {
  step: LearningStep
  children: ReactNode
}

function requiredPreviousStep(step: LearningStep, lang: 'en' | 'pt') {
  const labels = {
    lesson: { en: 'the previous phase', pt: 'a fase anterior' },
    exercises: { en: 'the learning journey', pt: 'a jornada de aprendizagem' },
    quiz: { en: 'the practice activities', pt: 'as atividades práticas' },
    exam: { en: 'the knowledge check', pt: 'a verificação de conhecimento' },
    project: { en: 'the competency assessment', pt: 'a avaliação de competência' },
    overview: { en: 'the previous phase', pt: 'a fase anterior' },
  }
  return labels[step][lang]
}

export default function LearningRouteGuard({ step, children }: Props) {
  const params = useParams()
  const navigate = useNavigate()
  const { lang, progress } = useApp()
  const phaseId = step === 'project'
    ? PROJECT_PHASE_BY_ID[params.projectId || '']
    : Number(params.id)
  const phaseExists = Number.isInteger(phaseId) && PHASE_IDS.includes(phaseId)
  const allowed = canAccessLearningStep(step, phaseId, progress)

  if (allowed) return <>{children}</>

  const t = lang === 'pt' ? {
    title: phaseExists ? 'Esta etapa ainda não está disponível' : 'Etapa não encontrada',
    description: phaseExists
      ? `Conclua ${requiredPreviousStep(step, lang)} primeiro. Assim o curso mantém uma sequência clara e você não precisa adivinhar o que estudar.`
      : 'O endereço não corresponde a uma fase ou projeto deste curso.',
    action: phaseExists ? 'Voltar para a próxima etapa válida' : 'Voltar ao início',
  } : {
    title: phaseExists ? 'This step is not available yet' : 'Learning step not found',
    description: phaseExists
      ? `Complete ${requiredPreviousStep(step, lang)} first. This keeps the course sequence clear, so you never have to guess what to study.`
      : 'This address does not match a phase or project in this course.',
    action: phaseExists ? 'Return to the next available step' : 'Return home',
  }

  return (
    <Layout showBack backTo="/" backLabel={lang === 'pt' ? 'Início' : 'Home'} hideNav>
      <div className="mx-auto max-w-lg px-4 py-12">
        <Card variant="raised" padding="lg" className="text-center">
          <div className="text-4xl" aria-hidden="true">{phaseExists ? '🧭' : '🔎'}</div>
          <h1 className="mt-4 text-xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-muted">{t.description}</p>
          <Button className="mt-5" fullWidth onClick={() => navigate(phaseExists ? `/phase/${phaseId}` : '/', { replace: true })}>
            {t.action}
          </Button>
        </Card>
      </div>
    </Layout>
  )
}
