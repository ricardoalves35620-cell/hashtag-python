import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import VSCodeEditor from '../components/VSCodeEditor'
import ErrorExplainer from '../components/ErrorExplainer'
import { explainError } from '../lib/errorExplainer'
import type { ErrorExplanation } from '../lib/errorExplainer'
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
  const [errorExplanation, setErrorExplanation] = useState<ErrorExplanation | null>(null)
  const [showRawError, setShowRawError] = useState(false)

  if (!phase) return null

  const t = {
    en: {
      scenario: 'Scenario', code: 'Code', results: 'Results',
      runTest: 'Run my code', running: 'Running...', loading: 'Loading Python...',
      submit: 'Submit for grading', submitting: 'Grading...',
      requirements: 'Requirements', output: 'Output',
      testInput: 'Test inputs (one per line)',
      passed: '🎉 PASSED — Next phase unlocked!',
      failed: '❌ Not quite — review and try again',
      nextPhase: 'Go to next phase →', tryAgain: '← Try again',
      phase: 'Phase', minScore: 'Minimum 90% to pass',
      tip: '💡 Test your code with "Run my code" first, then submit when ready.',
      testResults: 'Test results', passedLabel: 'passed',
    },
    pt: {
      scenario: 'Cenário', code: 'Código', results: 'Resultados',
      runTest: 'Executar meu código', running: 'Executando...', loading: 'Carregando Python...',
      submit: 'Enviar para correção', submitting: 'Corrigindo...',
      requirements: 'Requisitos', output: 'Saída',
      testInput: 'Entradas de teste (uma por linha)',
      passed: '🎉 APROVADO — Próxima fase desbloqueada!',
      failed: '❌ Não foi dessa vez — revise e tente novamente',
      nextPhase: 'Ir para próxima fase →', tryAgain: '← Tentar novamente',
      phase: 'Fase', minScore: 'Mínimo 90% para passar',
      tip: '💡 Teste com "Executar" primeiro, depois envie quando estiver pronto.',
      testResults: 'Resultados dos testes', passedLabel: 'passaram',
    }
  }[lang]

  const handleRunTest = async () => {
    setRunning(true)
    setTestOutput('')
    setErrorExplanation(null)
    try {
      setPyodideLoading(true)
      const py = await getPyodide()
      setPyodideLoading(false)
      const inputs = testInput.split('\n').map(l => l.trim()).filter(l => l !== '')
      const { output, error } = await runCode(py, code, inputs)
      if (error) {
        setTestOutput(`❌ Error: ${error}\n\n${output}`)
        setErrorExplanation(explainError(error, code))
      } else {
        setTestOutput(output || '(no output)')
        setErrorExplanation(null)
      }
    } catch (e) {
      setTestOutput(`❌ Failed: ${e}`)
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
      document.getElementById('main-scroll')?.scrollTo({ top: 0, behavior: 'instant' })
    } catch (e) {
      console.error(e)
      setResults(null)
      setScore(null)
      setTab('code')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scenario', label: t.scenario },
    { id: 'code', label: t.code },
    { id: 'results', label: t.results },
  ]

  return (
    <Layout
      showBack
      backTo={`/phase/${phase.id}`}
      backLabel={`${t.phase} ${phase.id}`}
      title={`${lang === 'en' ? 'Exam' : 'Exame'} · ${phase.title[lang]}`}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--c-border)', padding: '0 16px' }}>
        {tabs.map(t_ => (
          <button
            key={t_.id}
            onClick={() => {
              setTab(t_.id)
              document.getElementById('main-scroll')?.scrollTo({ top: 0, behavior: 'instant' })
            }}
            style={{
              padding: '10px 16px', fontSize: 14,
              fontWeight: tab === t_.id ? 500 : 400,
              color: tab === t_.id ? 'var(--c-purple-l)' : 'var(--c-muted)',
              borderBottom: `2px solid ${tab === t_.id ? 'var(--c-purple)' : 'transparent'}`,
              background: 'none', border: 'none',
              borderBottomWidth: 2, borderBottomStyle: 'solid',
              borderBottomColor: tab === t_.id ? 'var(--c-purple)' : 'transparent',
              cursor: 'pointer', minHeight: 44,
            }}
          >
            {t_.label}
            {t_.id === 'results' && score !== null && (
              <span style={{
                marginLeft: 6, fontSize: 10, padding: '2px 6px', borderRadius: 10,
                background: score >= 90 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                color: score >= 90 ? '#4ade80' : '#f87171',
              }}>
                {score}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── SCENARIO TAB ── */}
      {tab === 'scenario' && (
        <div style={{ padding: '16px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--c-purple-f)', border: '0.5px solid var(--c-purple-dm)',
            borderRadius: 20, padding: '4px 12px', marginBottom: 14, fontSize: 12,
            color: 'var(--c-purple-l)',
          }}>
            🎯 {t.minScore}
          </div>

          <div style={{
            background: 'var(--c-card)', border: '0.5px solid var(--c-border)',
            borderRadius: 12, padding: 16, marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
              {t.scenario}
            </div>
            <pre style={{
              fontSize: 13, color: 'var(--c-text2)', lineHeight: 1.7,
              whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0,
            }}>
              {phase.exam.scenario[lang]}
            </pre>
          </div>

          <div style={{
            background: 'var(--c-bg)', border: '0.5px solid var(--c-border)',
            borderRadius: 12, padding: 16, marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
              {t.requirements}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {phase.exam.requirements[lang].map((req, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--c-text2)' }}>
                  <span style={{ color: 'var(--c-purple-l)', flexShrink: 0 }}>→</span>
                  {req}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--c-purple-f)', border: '0.5px solid var(--c-purple-dm)',
            borderRadius: 10, padding: 12, marginBottom: 16,
            fontSize: 12, color: 'var(--c-purple-l)', lineHeight: 1.6,
          }}>
            {t.tip}
          </div>

          <button
            onClick={() => setTab('code')}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: 'var(--c-purple)', color: '#fff',
              fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
            }}
          >
            {lang === 'en' ? 'Start coding →' : 'Começar a codificar →'}
          </button>
          <div style={{ height: 16 }} />
        </div>
      )}

      {/* ── CODE TAB ── */}
      {tab === 'code' && (
        <div style={{ padding: '16px' }}>
          {/* VS Code Editor */}
          <VSCodeEditor
            value={code}
            onChange={setCode}
            filename="exam.py"
            height="300px"
            label={lang === 'en' ? 'editable' : 'editável'}
          />

          {/* Test input */}
          <div style={{ marginTop: 12 }}>
            <label style={{
              display: 'block', fontSize: 11, color: 'var(--c-muted)',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6,
            }}>
              {t.testInput}
            </label>
            <textarea
              value={testInput}
              onChange={e => setTestInput(e.target.value)}
              rows={3}
              placeholder={lang === 'en' ? 'Alice\nSmith\n1996\nPython' : 'Alice\nSilva\n1996\nPython'}
              style={{
                width: '100%', background: '#1e1e1e',
                border: '1px solid #3e3e3e', borderRadius: 8,
                padding: '8px 12px', fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                color: '#9cdcfe', outline: 'none', resize: 'none',
              }}
            />
          </div>

          {/* Run */}
          <button
            onClick={handleRunTest}
            disabled={running || pyodideLoading}
            style={{
              width: '100%', marginTop: 10, padding: '12px',
              borderRadius: 10, background: '#1e1e1e',
              border: '1px solid #3e3e3e', color: '#dcdcaa',
              fontSize: 14, fontWeight: 500,
              cursor: running ? 'not-allowed' : 'pointer',
              opacity: running ? 0.6 : 1,
            }}
          >
            {pyodideLoading ? t.loading : running ? t.running : `▶ ${t.runTest}`}
          </button>

          {/* Output / Error Explainer */}
          {testOutput && !errorExplanation && (
            <div style={{
              marginTop: 10, background: '#0d0d0d',
              border: '1px solid #3e3e3e', borderRadius: 8, padding: 14,
            }}>
              <div style={{ fontSize: 11, color: '#858585', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                {t.output}
              </div>
              <pre style={{
                fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                color: '#4ec9b0', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6,
              }}>
                {testOutput}
              </pre>
            </div>
          )}
          {errorExplanation && (
            <div style={{ marginTop: 10 }}>
              <ErrorExplainer
                explanation={errorExplanation}
                lang={lang}
                rawError={testOutput}
                showRaw={showRawError}
                onToggleRaw={() => setShowRawError(r => !r)}
              />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || pyodideLoading}
            style={{
              width: '100%', marginTop: 14, padding: '14px',
              borderRadius: 12, background: 'var(--c-purple)', color: '#fff',
              fontSize: 14, fontWeight: 500, border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? t.submitting : t.submit}
          </button>
          <div style={{ height: 16 }} />
        </div>
      )}

      {/* ── RESULTS TAB ── */}
      {tab === 'results' && (
        <div style={{ padding: '16px' }}>
          {score === null ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--c-muted)', fontSize: 14 }}>
              {lang === 'en' ? 'Submit your code to see results.' : 'Envie seu código para ver os resultados.'}
            </div>
          ) : (
            <>
              {/* Score card */}
              <div style={{
                borderRadius: 16, padding: '28px 20px', textAlign: 'center', marginBottom: 16,
                background: passed ? '#052e16' : '#1f0505',
                border: `1px solid ${passed ? '#166534' : '#7f1d1d'}`,
              }}>
                <div style={{ fontSize: 52, fontFamily: 'monospace', fontWeight: 600, color: '#fff' }}>
                  {score}%
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 500, marginTop: 8,
                  color: passed ? '#4ade80' : '#f87171',
                }}>
                  {passed ? t.passed : t.failed}
                </div>
                <div style={{ marginTop: 12, height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3, transition: 'width 1s ease',
                    width: `${score}%`,
                    background: passed ? '#22c55e' : '#ef4444',
                  }} />
                </div>
              </div>

              {/* Test results list */}
              {results && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--c-muted)', marginBottom: 8 }}>
                    {t.testResults} · {results.filter(r => r.passed).length}/{results.length} {t.passedLabel}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {results.map(result => (
                      <div key={result.id} style={{
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        background: result.passed ? '#0a1a0a' : '#1a0a0a',
                        border: `0.5px solid ${result.passed ? '#1a4a1a' : '#4a1a1a'}`,
                      }}>
                        <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>
                          {result.passed ? '✅' : '❌'}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: 'var(--c-text)' }}>
                            {result.description[lang]}
                          </div>
                          {!result.passed && result.output && (
                            <div style={{ marginTop: 4 }}>
                              <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>
                                {lang === 'en' ? 'Got:' : 'Obteve:'}
                              </span>
                              <span style={{
                                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                                color: '#f48771', marginLeft: 4,
                              }}>
                                {result.output.slice(0, 80)}
                              </span>
                            </div>
                          )}
                          {result.error && (
                            <div style={{
                              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                              color: '#f48771', marginTop: 4,
                            }}>
                              {result.error.slice(0, 100)}
                            </div>
                          )}
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 500, flexShrink: 0,
                          color: result.passed ? '#4ade80' : '#f87171',
                        }}>
                          {result.points}pt
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {passed ? (
                <button
                  onClick={() => navigate(phase.id < 27 ? `/phase/${phase.id + 1}` : '/home')}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12,
                    background: '#166534', color: '#fff',
                    fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                  }}
                >
                  {t.nextPhase}
                </button>
              ) : (
                <button
                  onClick={() => setTab('code')}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12,
                    background: 'var(--c-purple)', color: '#fff',
                    fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer',
                  }}
                >
                  {t.tryAgain}
                </button>
              )}
            </>
          )}
          <div style={{ height: 16 }} />
        </div>
      )}
    </Layout>
  )
}
