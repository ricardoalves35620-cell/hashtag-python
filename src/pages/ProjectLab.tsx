import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { PROJECT_LAB_MISSIONS } from '../data/labs'
import { useApp } from '../contexts/AppContext'

const STORAGE_KEY = 'hp_project_lab_v2'

function loadDone(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function ProjectLab() {
  const { lang } = useApp()
  const [done, setDone] = useState<string[]>(loadDone)
  const [activeId, setActiveId] = useState(() => PROJECT_LAB_MISSIONS.find(item => !done.includes(item.id))?.id || PROJECT_LAB_MISSIONS[0].id)
  const [command, setCommand] = useState('')
  const [feedback, setFeedback] = useState('')
  const mission = PROJECT_LAB_MISSIONS.find(item => item.id === activeId) || PROJECT_LAB_MISSIONS[0]
  const progress = Math.round((done.length / PROJECT_LAB_MISSIONS.length) * 100)
  const tree = useMemo(() => [
    'finance-cli/',
    '├── .venv/',
    '├── src/',
    '│   └── finance_cli/',
    '│       ├── __init__.py',
    '│       ├── domain.py',
    '│       ├── service.py',
    '│       └── cli.py',
    '├── tests/',
    '│   ├── test_domain.py',
    '│   └── test_service.py',
    '├── pyproject.toml',
    '├── README.md',
    '└── .gitignore',
  ], [])

  const submit = () => {
    const normalized = command.trim().toLowerCase()
    if (!normalized.includes(mission.expectedToken.toLowerCase())) {
      setFeedback(lang === 'en' ? 'Not yet. Read the objective and compare the command with the expected workflow.' : 'Ainda não. Leia o objetivo e compare o comando com o fluxo esperado.')
      return
    }
    const next = Array.from(new Set([...done, mission.id]))
    setDone(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setFeedback(lang === 'en' ? 'Correct. Explain what changed before moving on.' : 'Correto. Explique o que mudou antes de avançar.')
    setCommand('')
    const nextMission = PROJECT_LAB_MISSIONS.find(item => !next.includes(item.id))
    if (nextMission) window.setTimeout(() => { setActiveId(nextMission.id); setFeedback('') }, 700)
  }

  return (
    <Layout showBack backTo="/" backLabel={lang === 'en' ? 'Course' : 'Curso'} title={lang === 'en' ? 'Professional Project Lab' : 'Laboratório de Projeto Profissional'}>
      <div className="p-4 space-y-4">
        <section className="rounded-2xl p-5" style={{ background: 'linear-gradient(145deg, var(--c-purple-f), var(--c-card))', border: '1px solid var(--c-purple-dm)' }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-purple-l)' }}>v2.0 · Project Lab</div>
          <h1 className="text-xl font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{lang === 'en' ? 'Build the habits behind a real Python repository' : 'Construa os hábitos de um repositório Python real'}</h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{lang === 'en' ? 'This simulator does not pretend the browser is your operating system. It rehearses the exact workflow, while the lessons explain how to repeat it in Windows, macOS or Linux.' : 'Este simulador não finge que o navegador é seu sistema operacional. Ele ensaia o fluxo exato, enquanto as aulas mostram como repetir no Windows, macOS ou Linux.'}</p>
          <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: 'var(--c-bg)' }}><div className="h-full" style={{ width: `${progress}%`, background: 'var(--c-purple)' }} /></div>
          <div className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>{done.length}/{PROJECT_LAB_MISSIONS.length} · {progress}%</div>
        </section>

        <div className="grid md:grid-cols-2 gap-4">
          <section className="rounded-xl p-4" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}>
            <div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? 'Target repository' : 'Repositório alvo'}</div>
            <pre className="text-xs leading-6 overflow-x-auto" style={{ color: 'var(--c-text2)' }}>{tree.join('\n')}</pre>
          </section>

          <section className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? 'Current mission' : 'Missão atual'}</div>
            <h2 className="text-base font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{mission.title[lang]}</h2>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{mission.objective[lang]}</p>
            <div className="rounded-lg p-3 mt-3 text-xs leading-relaxed" style={{ background: 'var(--c-purple-f)', color: 'var(--c-purple-l)' }}>{mission.explanation[lang]}</div>
            <label className="block text-xs mt-4 mb-2" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? 'Type the command you would execute' : 'Digite o comando que executaria'}</label>
            <div className="flex gap-2">
              <input value={command} onChange={event => setCommand(event.target.value)} onKeyDown={event => event.key === 'Enter' && submit()} className="flex-1 rounded-lg px-3 py-2 font-mono text-sm" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }} placeholder="$ ..." />
              <button onClick={submit} className="rounded-lg px-4 text-sm font-medium text-white" style={{ background: 'var(--c-purple)' }}>{lang === 'en' ? 'Check' : 'Verificar'}</button>
            </div>
            {feedback && <div className="text-xs mt-3" style={{ color: feedback.startsWith('Correct') || feedback.startsWith('Correto') ? '#4ade80' : '#f8d477' }}>{feedback}</div>}
            <button onClick={() => setCommand(mission.command)} className="text-xs mt-3" style={{ color: 'var(--c-muted)', background: 'none', border: 'none' }}>{lang === 'en' ? 'Reveal command after trying' : 'Revelar comando depois de tentar'}</button>
          </section>
        </div>

        <section className="space-y-2">
          {PROJECT_LAB_MISSIONS.map((item, index) => (
            <button key={item.id} onClick={() => { setActiveId(item.id); setFeedback(''); setCommand('') }} className="w-full rounded-xl p-3 flex items-center gap-3 text-left" style={{ background: item.id === activeId ? 'var(--c-purple-f)' : 'var(--c-card)', border: `1px solid ${item.id === activeId ? 'var(--c-purple)' : 'var(--c-border)'}` }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: done.includes(item.id) ? 'rgba(34,197,94,.14)' : 'var(--c-bg)', color: done.includes(item.id) ? '#4ade80' : 'var(--c-muted)' }}>{done.includes(item.id) ? '✓' : index + 1}</span>
              <span className="flex-1"><span className="block text-sm font-medium" style={{ color: 'var(--c-text)' }}>{item.title[lang]}</span><span className="text-xs font-mono" style={{ color: 'var(--c-muted)' }}>{item.command}</span></span>
            </button>
          ))}
        </section>
      </div>
    </Layout>
  )
}
