import { useState, useEffect } from 'react'
import { scrollToTop } from '../lib/scroll'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import VSCodeEditor from '../components/VSCodeEditor'
import TestInputEditor from '../components/TestInputEditor'
import ErrorExplainer from '../components/ErrorExplainer'
import { explainError } from '../lib/errorExplainer'
import type { ErrorExplanation } from '../lib/errorExplainer'
import { useApp } from '../contexts/AppContext'
import { ALL_PHASES } from '../data/phases'
import { saveExamScore } from '../lib/progress'
import { loadExamDraft, saveExamDraft, clearExamDraft } from '../lib/examDraft'
import LessonBlock from '../components/LessonBlock'
import { analyzeCode, preparePythonEngine, runCode, runExam, type TestResult } from '../lib/pyodide'
import { validateExamStructure } from '../lib/learningValidation'
import { getSkillsForPhase } from '../data/skills'
import { extractErrorCategory } from '../lib/learningEngine'

type Tab = 'scenario' | 'code' | 'results'

export default function Exam() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, user, refreshProgress, progress, recordLearningAttempt } = useApp()
  const phase = ALL_PHASES.find(p => p.id === Number(id))
  const phaseProgress = progress.find(p => p.phase_id === Number(id))

  const [tab, setTab] = useState<Tab>('scenario')
  const [code, setCode] = useState(phase?.exam.starterCode || '')
  const [draftLoaded, setDraftLoaded] = useState(false)

  // Load saved draft on mount — restores code across devices/sessions
  useEffect(() => {
    if (!user || !phase) return
    loadExamDraft(user.id, phase.id, phase.exam.starterCode).then(draft => {
      setCode(draft)
      setDraftLoaded(true)
    })
  }, [user, phase?.id])

  // Auto-save draft as user types (debounced inside saveExamDraft)
  useEffect(() => {
    if (!user || !phase || !draftLoaded) return
    saveExamDraft(user.id, phase.id, code)
  }, [code, user, phase?.id, draftLoaded])
  const [testOutput, setTestOutput] = useState('')
  const [testInput, setTestInput] = useState('')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [score, setScore] = useState<number | null>(phaseProgress?.exam_score ?? null)
  const [passed, setPassed] = useState(phaseProgress?.exam_passed ?? false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showScenario, setShowScenario] = useState(false)
  const [showReference, setShowReference] = useState(false)
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
      await preparePythonEngine()
      setPyodideLoading(false)
      const inputs = testInput.split('\n').map(line => line.trim()).filter(line => line !== '')
      const { output, error } = await runCode(code, inputs)
      if (error) {
        setTestOutput(`❌ Error: ${error}\n\n${output}`)
        setErrorExplanation(explainError(error, code))
      } else {
        setTestOutput(output || '(no output)')
        setErrorExplanation(null)
      }
    } catch (error) {
      setTestOutput(`❌ Failed: ${error}`)
    } finally {
      setRunning(false)
      setPyodideLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      setPyodideLoading(true)
      await preparePythonEngine()
      const analysis = await analyzeCode(code)
      setPyodideLoading(false)

      const structure = validateExamStructure(phase.id, analysis, lang)
      if (!structure.passed) {
        setSubmitError((lang === 'en' ? 'Structure check: ' : 'Verificação de estrutura: ') + structure.message)
        recordLearningAttempt({
          phaseId: phase.id,
          activity: 'exam',
          itemId: `phase-${phase.id}-exam`,
          skillIds: getSkillsForPhase(phase.id),
          score: 0,
          passed: false,
          errorCategory: 'StructureError',
        })
        setTab('code')
        scrollToTop()
        return
      }

      const examResult = await runExam(code, phase.exam.testCases)
      const testResults = examResult.results
      const finalScore = examResult.score

      setResults(testResults)
      setScore(finalScore)
      const didPass = finalScore >= 90
      setPassed(didPass)
      recordLearningAttempt({
        phaseId: phase.id,
        activity: 'exam',
        itemId: `phase-${phase.id}-exam`,
        skillIds: getSkillsForPhase(phase.id),
        score: finalScore,
        passed: didPass,
        errorCategory: testResults.find(result => result.error)?.error
          ? extractErrorCategory(testResults.find(result => result.error)?.error)
          : null,
      })
      setTab('results')
      scrollToTop()
      if (didPass) clearExamDraft(user.id, phase.id)

      try {
        await saveExamScore(user.id, phase.id, finalScore)
        await refreshProgress()
      } catch (error) {
        console.error('Save failed:', error)
        setSubmitError(lang === 'en'
          ? '⚠️ Results shown but failed to save. Check connection.'
          : '⚠️ Resultados exibidos, mas falha ao salvar. Verifique conexão.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      recordLearningAttempt({
        phaseId: phase.id,
        activity: 'exam',
        itemId: `phase-${phase.id}-exam`,
        skillIds: getSkillsForPhase(phase.id),
        score: 0,
        passed: false,
        errorCategory: extractErrorCategory(message),
      })
      setSubmitError((lang === 'en' ? 'Error while grading: ' : 'Erro na correção: ') + message)
    } finally {
      setSubmitting(false)
      setPyodideLoading(false)
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
              scrollToTop()
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

          {/* Fixed values notice */}
          <div style={{
            background: '#1a1200', border: '1px solid #92400e',
            borderRadius: 10, padding: 14, marginBottom: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 8 }}>
              ⚠️ {lang === 'en' ? 'Grading uses fixed test values' : 'A correção usa valores fixos'}
            </div>
            <p style={{ fontSize: 13, color: '#fde68a', margin: '0 0 8px', lineHeight: 1.6 }}>
              {lang === 'en'
                ? 'When you click "Submit for grading", your code runs automatically with the values shown in the test inputs box. Your logic must work correctly with those exact values.'
                : 'Ao clicar em "Enviar para correção", seu código roda automaticamente com os valores mostrados na caixa de entradas de teste. Sua lógica precisa funcionar corretamente com esses valores exatos.'}
            </p>
            <div style={{
              background: '#0f0a00', borderRadius: 8, padding: '8px 12px',
              fontSize: 12, color: '#86efac', fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 8, lineHeight: 1.8,
            }}>
              {lang === 'en' ? '▶ Run my code' : '▶ Executar meu código'} → {lang === 'en' ? 'uses YOUR inputs (test freely with any values)' : 'usa SUAS entradas (teste livremente com qualquer valor)'}
              <br />
              {lang === 'en' ? '✓ Submit for grading' : '✓ Enviar para correção'} → {lang === 'en' ? 'uses FIXED inputs from this scenario' : 'usa as entradas FIXAS deste cenário'}
            </div>
            <p style={{ fontSize: 12, color: '#d97706', margin: 0, lineHeight: 1.5 }}>
              💡 {lang === 'en'
                ? 'Want to test with your own name or data? Use "Run my code" — change the test inputs freely. Just make sure your logic also works with the scenario values before submitting.'
                : 'Quer testar com seu nome ou dados próprios? Use "Executar meu código" — mude as entradas livremente. Só garanta que sua lógica também funciona com os valores do enunciado antes de enviar.'}
            </p>
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
          {/* Collapsible scenario + reference panels */}
          <div style={{ marginBottom: 10, display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setShowScenario(s => !s); setShowReference(false) }}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                background: showScenario ? 'var(--c-purple-dm)' : 'var(--c-card)',
                border: '0.5px solid var(--c-border)',
                color: showScenario ? 'var(--c-purple-l)' : 'var(--c-text2)', fontSize: 13, cursor: 'pointer',
              }}
            >
              📋 {lang === 'en' ? 'Scenario' : 'Cenário'}
            </button>
            <button
              onClick={() => { setShowReference(r => !r); setShowScenario(false) }}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                background: showReference ? 'var(--c-purple-dm)' : 'var(--c-card)',
                border: '0.5px solid var(--c-border)',
                color: showReference ? 'var(--c-purple-l)' : 'var(--c-text2)', fontSize: 13, cursor: 'pointer',
              }}
            >
              📖 {lang === 'en' ? 'Lesson reference' : 'Consultar aula'}
            </button>
          </div>

          {/* Reference panel — shows the phase's lesson content without leaving the exam */}
          {showReference && (
            <div style={{
              marginBottom: 10, background: 'var(--c-card)',
              border: '0.5px solid var(--c-border)', borderRadius: 10, padding: 14,
              maxHeight: 400, overflowY: 'auto',
            }}>
              <div style={{ fontSize: 12, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                {lang === 'en' ? `${phase.title.en} — lesson content` : `${phase.title.pt} — conteúdo da aula`}
              </div>
              {phase.lesson.blocks.map((block, i) => (
                <LessonBlock key={i} block={block} lang={lang} />
              ))}
            </div>
          )}

          {showScenario && (
              <div style={{
                marginTop: 6, background: 'var(--c-card)',
                border: '0.5px solid var(--c-border)', borderRadius: 10, padding: 14,
              }}>
                <div style={{ fontSize: 12, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  {lang === 'en' ? 'What to build:' : 'O que construir:'}
                </div>
                <pre style={{ fontSize: 12, color: 'var(--c-text2)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '0 0 12px', lineHeight: 1.6 }}>
                  {phase.exam.scenario[lang]}
                </pre>
                <div style={{ fontSize: 12, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  {lang === 'en' ? 'Requirements:' : 'Requisitos:'}
                </div>
                {phase.exam.requirements[lang].map((req, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--c-text2)', marginBottom: 4 }}>
                    <span style={{ color: 'var(--c-purple-l)', flexShrink: 0 }}>→</span>{req}
                  </div>
                ))}
              </div>
            )}

          {/* VS Code Editor */}
          <VSCodeEditor
            value={code}
            onChange={setCode}
            filename="exam.py"
            height="300px"
            label={lang === 'en' ? 'editable' : 'editável'}
          />

          {/* Fixed grading values — read only */}
          <div style={{
            marginTop: 12, background: '#0f1a2e',
            border: '1px solid #1e3a5f', borderRadius: 8, padding: '10px 14px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#7dd3fc', marginBottom: 6 }}>
              🔒 {lang === 'en' ? 'Grading inputs (fixed — cannot change):' : 'Entradas da correção (fixas — não altere):'}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#93c5fd', lineHeight: 1.8 }}>
              {phase.exam.testCases[0]?.inputs.length > 0
                ? phase.exam.testCases[0].inputs.map((v, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: '#475569', minWidth: 16 }}>{i + 1}.</span>
                      <span>{v}</span>
                    </div>
                  ))
                : <span style={{ color: '#475569' }}>{lang === 'en' ? '(no inputs needed)' : '(sem entradas necessárias)'}</span>
              }
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>
              {lang === 'en'
                ? '↑ "Submit for grading" always uses these values. Use "Run my code" below to test with your own inputs.'
                : '↑ "Enviar para correção" sempre usa esses valores. Use "Executar meu código" abaixo para testar com suas próprias entradas.'}
            </div>
          </div>

          {/* Custom test inputs for "Run my code" only */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              {lang === 'en' ? '▶ Your test inputs (for "Run my code" only):' : '▶ Suas entradas (somente para "Executar"):'}
            </div>
            <TestInputEditor
              code={code}
              value={testInput}
              onChange={setTestInput}
              lang={lang}
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

          {/* Submit error */}
          {submitError && (
            <div style={{
              marginTop: 10, background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 8, padding: '12px 14px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f87171', marginBottom: 4 }}>
                {lang === 'en' ? '❌ Submission failed' : '❌ Envio falhou'}
              </div>
              <div style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.6 }}>{submitError}</div>
              <div style={{ fontSize: 11, color: '#f87171', marginTop: 6 }}>
                {lang === 'en'
                  ? 'Check your code for syntax errors, then try again. Use "▶ Run my code" first to test.'
                  : 'Verifique erros de sintaxe no código e tente novamente. Use "▶ Executar" primeiro para testar.'}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={() => { setSubmitError(null); handleSubmit() }}
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
                          <div style={{ fontSize: 13, color: 'var(--c-text)', marginBottom: 4 }}>
                            {result.hidden ? (lang === 'en' ? '🔒 Hidden behavior test' : '🔒 Teste oculto de comportamento') : result.description[lang]}
                          </div>
                          {!result.passed && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {result.error ? (
                                <>
                                  <div style={{ fontSize: 10, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {lang === 'en' ? '⚡ Error in your code:' : '⚡ Erro no código:'}
                                  </div>
                                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#f48771', background: '#1a0505', borderRadius: 4, padding: '6px 8px', wordBreak: 'break-all' }}>
                                    {result.error.slice(0, 200)}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div style={{ fontSize: 10, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {result.hidden ? (lang === 'en' ? '🔒 Hidden test failed' : '🔒 Teste oculto falhou') : (lang === 'en' ? '📤 Your output:' : '📤 Sua saída:')}
                                  </div>
                                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#fca5a5', background: '#1a0505', borderRadius: 4, padding: '6px 8px', maxHeight: 80, overflowY: 'auto' }}>
                                    {result.hidden ? (lang === 'en' ? 'The hidden values are not shown. Review the requirement and make the logic general.' : 'Os valores ocultos não são exibidos. Revise o requisito e torne a lógica geral.') : (result.output ? result.output.slice(0, 300) : (lang === 'en' ? '(no output produced)' : '(nenhuma saída produzida)'))}
                                  </div>
                                  <div style={{ fontSize: 11, color: '#fbbf24', lineHeight: 1.5 }}>
                                    💡 {result.hidden ? (lang === 'en' ? 'Avoid fixed answers; make the solution work for other values.' : 'Evite respostas fixas; faça a solução funcionar com outros valores.') : <>{lang === 'en' ? 'This test checked: ' : 'Este teste verificou: '}<em>{result.description[lang]}</em></>}
                                  </div>
                                </>
                              )}
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
                  onClick={() => {
                    const index = ALL_PHASES.findIndex(item => item.id === phase.id)
                    const next = ALL_PHASES[index + 1]
                    navigate(next ? `/phase/${next.id}` : '/roadmap')
                  }}
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
