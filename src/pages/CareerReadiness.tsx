import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { Card, Badge, Progress, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'

interface Milestone {
  id: string
  title: { en: string; pt: string }
  description: { en: string; pt: string }
  phaseIds: number[]
  evidence: { en: string[]; pt: string[] }
  project: { en: string; pt: string }
}

const MILESTONES: Milestone[] = [
  {
    id: 'foundations',
    title: { en: 'Python foundations', pt: 'Fundamentos de Python' },
    description: { en: 'Write small programs with control flow, collections, functions and files.', pt: 'Escrever programas pequenos com fluxo de controle, coleções, funções e arquivos.' },
    phaseIds: Array.from({ length: 28 }, (_, index) => index),
    evidence: {
      en: ['Explain variables, conditions, loops and functions without notes.', 'Build a CLI program that validates input and saves data.', 'Read a traceback and repair a common failure.'],
      pt: ['Explicar variáveis, condições, loops e funções sem consultar anotações.', 'Construir um programa CLI que valide entradas e salve dados.', 'Ler um traceback e corrigir uma falha comum.'],
    },
    project: { en: 'Personal finance or inventory CLI', pt: 'CLI de finanças pessoais ou estoque' },
  },
  {
    id: 'professional',
    title: { en: 'Professional Python', pt: 'Python profissional' },
    description: { en: 'Organize, test, document and version multi-file projects.', pt: 'Organizar, testar, documentar e versionar projetos com vários arquivos.' },
    phaseIds: Array.from({ length: 12 }, (_, index) => index + 28),
    evidence: {
      en: ['Use venv, pip and requirements files.', 'Write automated tests and meaningful commits.', 'Design classes and modules around clear responsibilities.'],
      pt: ['Usar venv, pip e arquivos de dependências.', 'Escrever testes automatizados e commits claros.', 'Projetar classes e módulos com responsabilidades claras.'],
    },
    project: { en: 'Tested multi-module application', pt: 'Aplicação multi-módulo com testes' },
  },
  {
    id: 'engineering',
    title: { en: 'Advanced engineering', pt: 'Engenharia avançada' },
    description: { en: 'Work with APIs, SQL, concurrency, performance and delivery.', pt: 'Trabalhar com APIs, SQL, concorrência, performance e entrega.' },
    phaseIds: Array.from({ length: 14 }, (_, index) => index + 40),
    evidence: {
      en: ['Build a reliable API boundary.', 'Persist data with transactions and constraints.', 'Profile a bottleneck and justify an optimization.'],
      pt: ['Construir uma fronteira de API confiável.', 'Persistir dados com transações e constraints.', 'Medir um gargalo e justificar uma otimização.'],
    },
    project: { en: 'Production-style service or automation', pt: 'Serviço ou automação com padrão de produção' },
  },
  {
    id: 'ai',
    title: { en: 'Optional local AI path', pt: 'Trilha opcional de IA local' },
    description: { en: 'Use Python for data, machine learning and private local AI systems.', pt: 'Usar Python para dados, machine learning e sistemas privados de IA local.' },
    phaseIds: Array.from({ length: 15 }, (_, index) => index + 54),
    evidence: {
      en: ['Prepare and evaluate a dataset without leakage.', 'Explain training, embeddings and retrieval.', 'Build a local document assistant with cited sources.'],
      pt: ['Preparar e avaliar um dataset sem vazamento.', 'Explicar treino, embeddings e recuperação.', 'Construir um assistente local de documentos com fontes citadas.'],
    },
    project: { en: 'Private local document copilot', pt: 'Copiloto local privado de documentos' },
  },
]

export default function CareerReadiness() {
  const { lang, progress } = useApp()
  const navigate = useNavigate()
  const passed = new Set(progress.filter(item => item.exam_passed).map(item => item.phase_id))
  const allPhaseIds = new Set(ALL_PHASES.map(phase => phase.id))

  return (
    <Layout showBack backTo="/progress" title={lang === 'en' ? 'Career readiness' : 'Preparação para o mercado'}>
      <div className="page-shell space-y-4">
        <Card padding="lg">
          <Badge variant="primary">{lang === 'en' ? 'Evidence, not completion clicks' : 'Evidência, não apenas cliques'}</Badge>
          <h1 className="mt-3 text-h2 font-semibold text-ink">{lang === 'en' ? 'Your path to job-ready Python' : 'Seu caminho até Python para o mercado'}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-secondary">
            {lang === 'en'
              ? 'A phase is useful only when you can demonstrate the skill in a project, explain your decisions and reproduce the result without copying the lesson.'
              : 'Uma fase só tem valor quando você consegue demonstrar a habilidade em um projeto, explicar suas decisões e reproduzir o resultado sem copiar a aula.'}
          </p>
        </Card>

        {MILESTONES.map(milestone => {
          const relevant = milestone.phaseIds.filter(id => allPhaseIds.has(id))
          const completed = relevant.filter(id => passed.has(id)).length
          const percent = relevant.length ? Math.round((completed / relevant.length) * 100) : 0
          const nextPhase = relevant.find(id => !passed.has(id))
          return (
            <Card key={milestone.id} padding="lg" className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-title font-semibold text-ink">{milestone.title[lang]}</h2>
                  <p className="mt-1 text-sm leading-6 text-ink-secondary">{milestone.description[lang]}</p>
                </div>
                <Badge variant={percent === 100 ? 'success' : percent >= 50 ? 'warning' : 'neutral'}>{percent}%</Badge>
              </div>
              <Progress value={percent} label={`${completed}/${relevant.length}`} />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted">{lang === 'en' ? 'Evidence you should produce' : 'Evidências que você deve produzir'}</div>
                  <ul className="mt-2 space-y-2 text-sm text-ink-secondary">{milestone.evidence[lang].map(item => <li key={item} className="flex gap-2"><span className="text-success">✓</span><span>{item}</span></li>)}</ul>
                </div>
                <div className="rounded-xl border border-line bg-canvas p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted">{lang === 'en' ? 'Portfolio project' : 'Projeto de portfólio'}</div>
                  <div className="mt-2 font-semibold text-ink">{milestone.project[lang]}</div>
                  <p className="mt-2 text-sm leading-6 text-ink-secondary">{lang === 'en' ? 'Publish the README, tests, screenshots and a short explanation of trade-offs.' : 'Publique README, testes, imagens e uma explicação curta das decisões e concessões.'}</p>
                </div>
              </div>
              {nextPhase !== undefined && <Button onClick={() => navigate(`/phase/${nextPhase}`)}>{lang === 'en' ? `Continue at phase ${nextPhase}` : `Continuar na fase ${nextPhase}`}</Button>}
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}
