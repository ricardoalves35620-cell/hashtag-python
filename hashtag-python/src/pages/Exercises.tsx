import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CodeEditor from '../components/CodeEditor'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { markStepDone } from '../lib/progress'
import { getPyodide, runCode } from '../lib/pyodide'

export default function Exercises() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user, refreshProgress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))

  const [activeEx, setActiveEx] = useState(0)
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    phase?.exercises.forEach(ex => { initial[ex.id] = ex.starterCode })
    return initial
  })
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [hintsShown, setHintsShown] = useState<Record<string, boolean>>({})
  const [customInput, setCustomInput] = useState('')

  if (!phase || phase.exercises.length === 0) {
    return (
      <Layout showBack backTo={`/phase/${phase?.id}`}>
        <div className="p-4 text-muted text-sm">{lang === 'en' ? 'No exercises yet — coming soon!' : 'Ainda sem exercícios — em breve!'}</div>
      </Layout>
    )
  }

  const exercise = phase.exercises[activeEx]

  const handleRun = async () => {
    setRunning(true)
    setOutput('')
    try {
      setPyodideLoading(true)
      const py = await getPyodide()
      setPyodideLoading(false)
      const inputs = customInput.split('\n').filter(l => l.trim())
      const { output: out, error } = await runCode(py, codes[exercise.id], inputs)
      setOutput(error ? `❌ Error: ${error}\n\n${out}` : out || '(no output)')
    } catch (e) {
      setOutput(`Failed to run: ${e}`)
    } finally {
      setRunning(false)
    }
  }

  const handleComplete = async () => {
    if (!user) return
    await markStepDone(user.id, phase.id, 'exercises')
    await refreshProgress()
    navigate(`/phase/${phase.id}/quiz`)
  }

  const t = {
    en: {
      exercise: 'Exercise', of: 'of', run: 'Run Code', running: 'Running...',
      loading: 'Loading Python...', hint: 'Show hint', output: 'Output',
      input: 'Simulated inputs (one per line)', complete: 'All done → Mini-test',
      phase: 'Phase'
    },
    pt: {
      exercise: 'Exercício', of: 'de', run: 'Executar Código', running: 'Executando...',
      loading: 'Carregando Python...', hint: 'Mostrar dica', output: 'Saída',
      input: 'Entradas simuladas (uma por linha)', complete: 'Concluir → Mini-teste',
      phase: 'Fase'
    }
  }[lang]

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.phase} ${phase.id}`}
      title={`${t.exercise} · ${phase.title[lang]}`}
    >
      <div className="p-4 space-y-4">
        {/* Exercise tabs */}
        <div className="flex gap-2">
          {phase.exercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setActiveEx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                i === activeEx
                  ? 'bg-purple-DEFAULT text-white'
                  : 'bg-card border border-border text-muted hover:text-white'
              }`}
            >
              {t.exercise} {i + 1}
            </button>
          ))}
        </div>

        {/* Exercise description */}
        <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4">
          <h2 className="text-sm font-medium text-white mb-2">{exercise.title[lang]}</h2>
          <p className="text-sm text-[#8888aa] leading-relaxed">{exercise.description[lang]}</p>

          {exercise.sampleOutput && (
            <div className="mt-3 bg-[#0a0a18] rounded-lg p-3">
              <div className="text-xs text-muted mb-1">{lang === 'en' ? 'Expected output:' : 'Saída esperada:'}</div>
              <pre className="text-xs font-mono text-green-400">{exercise.sampleOutput[lang]}</pre>
            </div>
          )}
        </div>

        {/* Code editor */}
        <div>
          <CodeEditor
            value={codes[exercise.id]}
            onChange={(val) => setCodes(prev => ({ ...prev, [exercise.id]: val }))}
            height="240px"
          />
        </div>

        {/* Custom input */}
        <div>
          <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">{t.input}</label>
          <textarea
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            placeholder="Alice&#10;25&#10;Toronto"
            rows={3}
            className="w-full bg-[#0d0d1f] border border-[#1e1e40] rounded-xl px-3 py-2 text-sm font-mono text-[#a78bfa] placeholder:text-muted focus:outline-none focus:border-purple-DEFAULT resize-none"
          />
        </div>

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={running || pyodideLoading}
          className="w-full bg-[#0d0d1f] hover:bg-purple-faint border border-[#1e1e40] hover:border-purple-dim text-purple-light font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {pyodideLoading ? t.loading : running ? t.running : `▶ ${t.run}`}
        </button>

        {/* Output */}
        {output && (
          <div className="bg-[#040410] border border-[#1e1e40] rounded-xl p-4">
            <div className="text-xs text-muted mb-2 uppercase tracking-wide">{t.output}</div>
            <pre className={`text-sm font-mono whitespace-pre-wrap ${output.startsWith('❌') ? 'text-red-400' : 'text-green-300'}`}>
              {output}
            </pre>
          </div>
        )}

        {/* Hints */}
        {exercise.hints.length > 0 && (
          <div>
            <button
              onClick={() => setHintsShown(prev => ({ ...prev, [exercise.id]: !prev[exercise.id] }))}
              className="text-xs text-purple-light hover:text-white transition-colors"
            >
              💡 {hintsShown[exercise.id] ? (lang === 'en' ? 'Hide hints' : 'Esconder dicas') : t.hint}
            </button>
            {hintsShown[exercise.id] && (
              <div className="mt-2 space-y-2">
                {exercise.hints.map((hint, i) => (
                  <div key={i} className="text-xs bg-purple-faint border border-purple-dim rounded-lg px-3 py-2 text-purple-light">
                    {hint[lang]}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Complete */}
        {activeEx === phase.exercises.length - 1 && (
          <div className="pt-2">
            <button
              onClick={handleComplete}
              className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
            >
              {t.complete}
            </button>
          </div>
        )}

        {activeEx < phase.exercises.length - 1 && (
          <button
            onClick={() => setActiveEx(i => i + 1)}
            className="w-full bg-card border border-border text-white font-medium py-3 rounded-xl text-sm hover:border-purple-dim transition-colors"
          >
            {lang === 'en' ? 'Next exercise →' : 'Próximo exercício →'}
          </button>
        )}

        <div className="h-4" />
      </div>
    </Layout>
  )
}
