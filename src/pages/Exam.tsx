import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import CodeEditor from '../components/CodeEditor'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { saveExamScore } from '../lib/progress'
import { getPyodide, runCode, runExam, type TestResult } from '../lib/pyodide'

type Tab = 'scenario' | 'code' | 'results'

export default function Exam() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user, refreshProgress, progress } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))

  const phaseProgress = progress.find(p => p.phase_id === Number(id))

  const [tab, setTab] = useState<Tab>('scenario')
  const [code, setCode] = useState(phase?.exam.starterCode || '')
  const [testOutput, setTestOutput] = useState('')
  const [testInput, setTestInput] = useState('')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [score, setScore] = useState<number | null>(phaseProgress?.exam_score ?? null)
  const [passed, setPassed] = useState(phaseProgress?.exam_passed ?? false)

  if (!phase) return null

  const t = {
    en: {
      scenario: 'Scenario', code: 'Code', results: 'Results',
      runTest: 'Run my code', running: 'Running...', loading: 'Loading Python...',
      submit: 'Submit for grading', submitting: 'Grading...',
      requirements: 'Requirements', output: 'Output',
      testInput: 'Test inputs (one per line)',
      passed: 'PASSED — Next phase unlocked!', failed: 'Not quite — review and try again',
      nextPhase: 'Go to next phase →', tryAgain: 'Try again',
      phase: 'Phase', minScore: 'Minimum 90% to pass',
      tip: '💡 Test your code with "Run my code" first, then submit when ready.'
    },
    pt: {
      scenario: 'Cenário', code: 'Código', results: 'Resultados',
      runTest: 'Executar meu código', running: 'Executando...', loading: 'Carregando Python...',
      submit: 'Enviar para correção', submitting: 'Corrigindo...',
      requirements: 'Requisitos', output: 'Saída',
      testInput: 'Entradas de teste (uma por linha)',
      passed: 'APROVADO — Próxima fase desbloqueada!', failed: 'Não foi dessa vez — revise e tente novamente',
      nextPhase: 'Ir para próxima fase →', tryAgain: 'Tentar novamente',
      phase: 'Fase', minScore: 'Mínimo 90% para passar',
      tip: '💡 Teste seu código com "Executar" primeiro, depois envie quando estiver pronto.'
    }
  }[lang]

  const handleRunTest = async () => {
    setRunning(true)
    setTestOutput('')
    try {
      setPyodideLoading(true)
      const py = await getPyodide()
      setPyodideLoading(false)
      const inputs = testInput.split('\n').filter(l => l.trim())
      const { output, error } = await runCode(py, code, inputs)
      setTestOutput(error ? `Error: ${error}\n\n${output}` : output || '(no output)')
    } catch (e) {
      setTestOutput(`Failed: ${e}`)
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    try {
      setPyodideLoading(true)
      const py = await getPyodide()
      setPyodideLoading(false)

      const { results: testResults, score: finalScore } = await runExam(py, code, phase.exam.testCases)
      setResults(testResults)
      setScore(finalScore)
      const didPass = finalScore >= 90
      setPassed(didPass)

      await saveExamScore(user.id, phase.id, finalScore)
      await refreshProgress()
      setTab('results')
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scenario', label: t.scenario },
    { id: 'code', label: t.code },
    { id: 'results', label: t.results }
  ]

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.phase} ${phase.id}`}
      title={`${lang === 'en' ? 'Exam' : 'Exame'} · ${phase.title[lang]}`}
    >
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex border-b border-border px-4 pt-3 gap-0">
          {tabs.map(t_ => (
            <button
              key={t_.id}
              onClick={() => setTab(t_.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t_.id
                  ? 'border-purple-DEFAULT text-purple-light'
                  : 'border-transparent text-muted hover:text-white'
              }`}
            >
              {t_.label}
              {t_.id === 'results' && score !== null && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${score >= 90 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                  {score}%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Scenario tab */}
        {tab === 'scenario' && (
          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#1a1040] text-purple-light border border-purple-dim px-3 py-1 rounded-full">
                🎯 {t.minScore}
              </span>
            </div>

            <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4">
              <div className="text-xs text-muted mb-2 uppercase tracking-wide">{t.scenario}</div>
              <pre className="text-sm text-[#b0b0d0] leading-relaxed whitespace-pre-wrap font-sans">
                {phase.exam.scenario[lang]}
              </pre>
            </div>

            <div className="bg-[#0a0a18] border border-border rounded-xl p-4">
              <div className="text-xs text-muted mb-3 uppercase tracking-wide">{t.requirements}</div>
              <ul className="space-y-2">
                {phase.exam.requirements[lang].map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#b0b0d0]">
                    <span className="text-purple-light mt-0.5 flex-shrink-0">→</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-muted bg-purple-faint border border-purple-dim rounded-xl p-3 leading-relaxed">
              {t.tip}
            </div>

            <button
              onClick={() => setTab('code')}
              className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
            >
              {lang === 'en' ? 'Start coding →' : 'Começar a codificar →'}
            </button>
          </div>
        )}

        {/* Code tab */}
        {tab === 'code' && (
          <div className="p-4 space-y-3 flex flex-col flex-1">
            <CodeEditor value={code} onChange={setCode} height="280px" />

            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">{t.testInput}</label>
              <textarea
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
                placeholder={lang === 'en' ? 'Alice\nSmith\n1990\nPython' : 'Maria\nSilva\n1995\nPython'}
                rows={3}
                className="w-full bg-[#0d0d1f] border border-[#1e1e40] rounded-xl px-3 py-2 text-sm font-mono text-[#a78bfa] placeholder:text-muted focus:outline-none focus:border-purple-DEFAULT resize-none"
              />
            </div>

            <button
              onClick={handleRunTest}
              disabled={running || pyodideLoading}
              className="w-full bg-[#0d0d1f] hover:bg-purple-faint border border-[#1e1e40] hover:border-purple-dim text-purple-light font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {pyodideLoading ? t.loading : running ? t.running : `▶ ${t.runTest}`}
            </button>

            {testOutput && (
              <div className="bg-[#040410] border border-[#1e1e40] rounded-xl p-3">
                <div className="text-xs text-muted mb-2 uppercase tracking-wide">{t.output}</div>
                <pre className={`text-sm font-mono whitespace-pre-wrap ${testOutput.startsWith('Error') ? 'text-red-400' : 'text-green-300'}`}>
                  {testOutput}
                </pre>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={submitting || pyodideLoading}
                className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? t.submitting : t.submit}
              </button>
            </div>
          </div>
        )}

        {/* Results tab */}
        {tab === 'results' && (
          <div className="p-4 space-y-4 overflow-y-auto">
            {score === null ? (
              <div className="text-center text-muted text-sm py-8">
                {lang === 'en' ? 'Submit your code to see results.' : 'Envie seu código para ver os resultados.'}
              </div>
            ) : (
              <>
                {/* Score card */}
                <div className={`rounded-xl border p-6 text-center ${passed ? 'bg-[#052e16] border-green-700' : 'bg-[#1f0505] border-red-900'}`}>
                  <div className="text-5xl font-mono font-medium text-white mb-1">{score}%</div>
                  <div className={`text-sm font-medium mt-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                    {passed ? t.passed : t.failed}
                  </div>
                  <div className="mt-3 h-2 bg-[#0a0a18] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                {/* Test cases */}
                {results && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted uppercase tracking-wide">
                      {lang === 'en' ? 'Test results' : 'Resultados dos testes'} · {results.filter(r => r.passed).length}/{results.length} {lang === 'en' ? 'passed' : 'passaram'}
                    </div>
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className={`rounded-xl border p-3 flex items-start gap-3 ${result.passed ? 'bg-[#0a1a0a] border-[#1a4a1a]' : 'bg-[#1a0a0a] border-[#4a1a1a]'}`}
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">{result.passed ? '✅' : '❌'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white">{result.description[lang]}</div>
                          {!result.passed && result.output && (
                            <div className="mt-1">
                              <span className="text-xs text-muted">{lang === 'en' ? 'Got:' : 'Obteve:'} </span>
                              <span className="text-xs font-mono text-red-300">{result.output.slice(0, 80)}</span>
                            </div>
                          )}
                          {result.error && (
                            <div className="text-xs text-red-400 mt-1 font-mono">{result.error.slice(0, 100)}</div>
                          )}
                        </div>
                        <span className={`text-xs font-medium flex-shrink-0 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {result.points}pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {passed ? (
                  <button
                    onClick={() => navigate(phase.id < 10 ? `/phase/${phase.id + 1}` : '/home')}
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
                  >
                    {t.nextPhase}
                  </button>
                ) : (
                  <button
                    onClick={() => setTab('code')}
                    className="w-full bg-purple-DEFAULT hover:bg-purple-dark text-white font-medium py-3.5 rounded-xl text-sm transition-colors"
                  >
                    {t.tryAgain}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
