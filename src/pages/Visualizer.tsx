import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import GlossaryPanel from '../components/glossary/GlossaryPanel'
import GlossaryText from '../components/glossary/GlossaryText'
import { VISUAL_SCENARIOS } from '../data/visualizer'
import { useApp } from '../contexts/AppContext'

export default function Visualizer() {
  const { lang } = useApp()
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const scenario = VISUAL_SCENARIOS[scenarioIndex]
  const step = scenario.steps[stepIndex]

  const selectScenario = (index: number) => { setScenarioIndex(index); setStepIndex(0); setPlaying(false) }

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= scenario.steps.length - 1) { setPlaying(false); return }
    const timer = window.setTimeout(() => setStepIndex(value => value + 1), 1100)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, scenario.steps.length])

  return (
    <Layout showBack backTo="/base-zero" title={lang === 'en' ? 'Visual Python Lab' : 'Laboratório Visual de Python'}>
      <div className="p-4 space-y-4">
        <div className="rounded-2xl p-4" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
          <div className="flex items-start justify-between gap-3">
            <div><div className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-purple-l)' }}>{lang === 'en' ? 'Execution model' : 'Modelo de execução'}</div><h1 className="text-xl font-semibold" style={{ color: 'var(--c-text)' }}>{lang === 'en' ? 'See Python think, one line at a time' : 'Veja o Python pensar, linha por linha'}</h1></div>
            <GlossaryPanel lang={lang} />
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--c-text2)' }}>{lang === 'en' ? 'Use Previous and Next. Watch the active line, memory and output change together.' : 'Use Anterior e Próximo. Observe a linha ativa, a memória e a saída mudarem juntas.'}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {VISUAL_SCENARIOS.map((item, index) => <button key={item.id} onClick={() => selectScenario(index)} className="rounded-xl p-3 text-center text-xs" style={{ background: scenarioIndex === index ? 'var(--c-purple-dm)' : 'var(--c-card)', color: scenarioIndex === index ? 'var(--c-purple-l)' : 'var(--c-muted)', border: '1px solid var(--c-border)' }}><div className="text-xl mb-1">{item.icon}</div>{item.title[lang]}</button>)}
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--c-border)', background: 'var(--c-code-bg)' }}>
          <div className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--c-text)', borderBottom: '1px solid var(--c-border)' }}>{scenario.icon} {scenario.title[lang]}</div>
          <div className="font-mono text-sm py-2">
            {scenario.code.map((line, index) => <div key={`${line}-${index}`} className="px-4 py-2 flex gap-3" style={{ background: step.line === index ? 'var(--c-purple-dm)' : 'transparent', color: step.line === index ? 'var(--c-purple-l)' : 'var(--c-text2)' }}><span style={{ color: 'var(--c-dimmer)', width: 18, textAlign: 'right' }}>{index + 1}</span><span style={{ whiteSpace: 'pre' }}>{line}</span></div>)}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}><div className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--c-purple-l)' }}>{lang === 'en' ? `Step ${stepIndex + 1} of ${scenario.steps.length}` : `Passo ${stepIndex + 1} de ${scenario.steps.length}`}</div><GlossaryText text={step.explanation[lang]} lang={lang} className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }} /></div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}><div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>🧠 {lang === 'en' ? 'Memory' : 'Memória'}</div>{Object.keys(step.memory).length ? Object.entries(step.memory).map(([name, value]) => <div key={name} className="flex justify-between rounded-lg px-3 py-2 mb-2 font-mono text-sm" style={{ background: 'var(--c-bg)' }}><span style={{ color: 'var(--c-purple-l)' }}>{name}</span><span style={{ color: 'var(--c-text)' }}>{value}</span></div>) : <div className="text-sm" style={{ color: 'var(--c-dimmer)' }}>—</div>}</div>
          <div className="rounded-xl p-4" style={{ background: '#050510', border: '1px solid var(--c-border)' }}><div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--c-muted)' }}>▶ {lang === 'en' ? 'Output' : 'Saída'}</div><div className="font-mono text-sm whitespace-pre-line" style={{ color: '#a7f3d0', minHeight: 36 }}>{step.output.join('\n') || (lang === 'en' ? '(nothing yet)' : '(nada ainda)')}</div></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => { setPlaying(false); setStepIndex(value => Math.max(0, value - 1)) }} disabled={stepIndex === 0} className="rounded-xl py-3 text-sm disabled:opacity-30" style={{ background: 'var(--c-card)', color: 'var(--c-text)', border: '1px solid var(--c-border)' }}>← {lang === 'en' ? 'Previous' : 'Anterior'}</button>
          <button onClick={() => { if (stepIndex === scenario.steps.length - 1) setStepIndex(0); setPlaying(value => !value) }} className="rounded-xl py-3 text-sm font-semibold" style={{ background: 'var(--c-purple-f)', color: 'var(--c-purple-l)', border: '1px solid var(--c-purple-dm)' }}>{playing ? '⏸ ' + (lang === 'en' ? 'Pause' : 'Pausar') : '▶ ' + (lang === 'en' ? 'Auto' : 'Automático')}</button>
          <button onClick={() => { setPlaying(false); setStepIndex(value => Math.min(scenario.steps.length - 1, value + 1)) }} disabled={stepIndex === scenario.steps.length - 1} className="rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-30" style={{ background: 'var(--c-purple)' }}>{lang === 'en' ? 'Next' : 'Próximo'} →</button>
        </div>
      </div>
    </Layout>
  )
}
