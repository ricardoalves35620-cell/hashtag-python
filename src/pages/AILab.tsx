import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { useApp } from '../contexts/AppContext'
import { estimateWeightMemoryGb, recommendLocalModel } from '../lib/aiPlanner'

const CHECKLIST_KEY = 'hp_ai_lab_v4_checklist'
const CHECKLIST = [
  { id: 'license', en: 'Verify model and dataset licenses', pt: 'Verificar licenças do modelo e datasets' },
  { id: 'hardware', en: 'Benchmark exact model, quantization and context on target hardware', pt: 'Testar modelo, quantização e contexto no hardware alvo' },
  { id: 'offline', en: 'Run with network disconnected after required downloads', pt: 'Rodar sem internet após downloads necessários' },
  { id: 'retrieval', en: 'Measure retrieval recall before judging generated answers', pt: 'Medir recall da recuperação antes de julgar respostas' },
  { id: 'citations', en: 'Return source identifiers for factual answers', pt: 'Retornar identificadores de fonte em respostas factuais' },
  { id: 'refusal', en: 'Refuse or state uncertainty when evidence is insufficient', pt: 'Recusar ou declarar incerteza sem evidência suficiente' },
  { id: 'tools', en: 'Allowlist tools and confirm destructive actions', pt: 'Permitir ferramentas específicas e confirmar ações destrutivas' },
  { id: 'evaluation', en: 'Keep a fixed regression evaluation set', pt: 'Manter conjunto fixo de avaliação de regressão' },
]

function loadChecklist(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function AILab() {
  const { lang } = useApp()
  const [ram, setRam] = useState(16)
  const [vram, setVram] = useState(0)
  const [parameters, setParameters] = useState(7)
  const [bits, setBits] = useState(4)
  const [checked, setChecked] = useState<string[]>(loadChecklist)
  const recommendation = useMemo(() => recommendLocalModel(ram, vram), [ram, vram])
  const weightMemory = useMemo(() => {
    try { return estimateWeightMemoryGb(parameters, bits) } catch { return 0 }
  }, [parameters, bits])
  const checklistProgress = Math.round((checked.length / CHECKLIST.length) * 100)

  const toggle = (id: string) => {
    const next = checked.includes(id) ? checked.filter(item => item !== id) : [...checked, id]
    setChecked(next)
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next))
  }

  const t = {
    en: {
      title: 'Local AI Lab', heading: 'Plan an AI system that stays on your machine',
      intro: 'This planner estimates a realistic starting point. It is not a guarantee: runtime, context, operating system and application memory change the result.',
      hardware: 'Hardware planner', ram: 'System RAM (GB)', vram: 'Dedicated VRAM (GB)', result: 'Recommended starting range',
      weights: 'Raw model weight estimate', params: 'Parameters (billions)', bitWidth: 'Bits per weight', estimated: 'estimated weight storage',
      architecture: 'Private document copilot architecture', checklist: 'Release evidence checklist', complete: 'complete',
      note: 'No paid external AI API is required. Downloads, local HTTP calls and open-source runtimes are allowed; private documents remain on the computer unless the user explicitly exports them.',
    },
    pt: {
      title: 'Laboratório de IA Local', heading: 'Planeje uma IA que permanece na sua máquina',
      intro: 'Este planejador estima um ponto inicial realista. Não é garantia: runtime, contexto, sistema operacional e memória do aplicativo mudam o resultado.',
      hardware: 'Planejador de hardware', ram: 'RAM do sistema (GB)', vram: 'VRAM dedicada (GB)', result: 'Faixa inicial recomendada',
      weights: 'Estimativa dos pesos do modelo', params: 'Parâmetros (bilhões)', bitWidth: 'Bits por peso', estimated: 'armazenamento estimado dos pesos',
      architecture: 'Arquitetura do copiloto privado de documentos', checklist: 'Checklist de evidência para release', complete: 'concluído',
      note: 'Nenhuma API externa paga de IA é necessária. Downloads, HTTP local e runtimes open source são permitidos; documentos privados permanecem no computador salvo exportação explícita do usuário.',
    },
  }[lang]

  const architecture = [
    { icon: '📄', en: 'Local files', pt: 'Arquivos locais', detailEn: 'PDF, TXT, CSV, Markdown', detailPt: 'PDF, TXT, CSV, Markdown' },
    { icon: '✂️', en: 'Deterministic ingestion', pt: 'Ingestão determinística', detailEn: 'parse, clean, chunk, source IDs', detailPt: 'ler, limpar, dividir, IDs de fonte' },
    { icon: '🔎', en: 'Local retrieval', pt: 'Recuperação local', detailEn: 'embeddings + index', detailPt: 'embeddings + índice' },
    { icon: '🤖', en: 'Local model runtime', pt: 'Runtime de modelo local', detailEn: 'GGUF + llama.cpp/Ollama', detailPt: 'GGUF + llama.cpp/Ollama' },
    { icon: '✅', en: 'Grounded response', pt: 'Resposta fundamentada', detailEn: 'answer + citations + uncertainty', detailPt: 'resposta + citações + incerteza' },
  ]

  return (
    <Layout showBack backTo="/" backLabel={lang === 'en' ? 'Course' : 'Curso'} title={t.title}>
      <div className="p-4 space-y-4">
        <section className="rounded-2xl p-5" style={{ background: 'linear-gradient(145deg, #10251d, var(--c-card))', border: '1px solid #256b4b' }}>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#6ee7b7' }}>v4.0 · Local AI Path</div>
          <h1 className="text-xl font-semibold mt-1" style={{ color: 'var(--c-text)' }}>{t.heading}</h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{t.intro}</p>
          <div className="rounded-xl p-3 mt-4 text-xs leading-relaxed" style={{ background: 'rgba(16,185,129,.08)', border: '1px solid #256b4b', color: '#a7f3d0' }}>{t.note}</div>
        </section>

        <section className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <h2 className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>🖥️ {t.hardware}</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="text-xs" style={{ color: 'var(--c-muted)' }}>{t.ram}<input type="number" min="1" value={ram} onChange={event => setRam(Number(event.target.value))} className="w-full rounded-lg px-3 py-2 mt-1 text-sm" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }} /></label>
            <label className="text-xs" style={{ color: 'var(--c-muted)' }}>{t.vram}<input type="number" min="0" value={vram} onChange={event => setVram(Number(event.target.value))} className="w-full rounded-lg px-3 py-2 mt-1 text-sm" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }} /></label>
          </div>
          <div className="rounded-xl p-4 mt-4" style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--c-muted)' }}>{t.result}</div>
            <div className="text-lg font-semibold mt-1" style={{ color: 'var(--c-purple-l)' }}>{recommendation.modelRange} · {recommendation.quantization}</div>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--c-text2)' }}>{recommendation.explanation}</p>
            <div className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? `Keep at least ${recommendation.minimumFreeGb} GB free for the operating system and application.` : `Mantenha pelo menos ${recommendation.minimumFreeGb} GB livres para sistema e aplicativo.`}</div>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: 'var(--c-code-bg)', border: '1px solid var(--c-border)' }}>
          <h2 className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>💾 {t.weights}</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="text-xs" style={{ color: 'var(--c-muted)' }}>{t.params}<input type="number" min="0.1" step="0.1" value={parameters} onChange={event => setParameters(Number(event.target.value))} className="w-full rounded-lg px-3 py-2 mt-1 text-sm" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }} /></label>
            <label className="text-xs" style={{ color: 'var(--c-muted)' }}>{t.bitWidth}<select value={bits} onChange={event => setBits(Number(event.target.value))} className="w-full rounded-lg px-3 py-2 mt-1 text-sm" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }}><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option><option value={8}>8</option><option value={16}>16</option></select></label>
          </div>
          <div className="text-center py-5"><div className="text-3xl font-semibold" style={{ color: '#6ee7b7' }}>{weightMemory.toFixed(2)} GB</div><div className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>{t.estimated} · {lang === 'en' ? 'runtime and context need additional memory' : 'runtime e contexto precisam de memória adicional'}</div></div>
        </section>

        <section className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--c-text)' }}>🏗️ {t.architecture}</h2>
          <div className="space-y-2">
            {architecture.map((item, index) => <div key={item.en} className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--c-bg)' }}>{item.icon}</div><div className="flex-1"><div className="text-sm font-medium" style={{ color: 'var(--c-text)' }}>{lang === 'en' ? item.en : item.pt}</div><div className="text-xs" style={{ color: 'var(--c-muted)' }}>{lang === 'en' ? item.detailEn : item.detailPt}</div></div>{index < architecture.length - 1 && <span style={{ color: 'var(--c-purple-l)' }}>↓</span>}</div>)}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="flex justify-between items-center"><h2 className="text-base font-semibold" style={{ color: 'var(--c-text)' }}>✅ {t.checklist}</h2><span className="text-xs" style={{ color: '#6ee7b7' }}>{checklistProgress}% {t.complete}</span></div>
          <div className="h-2 rounded-full overflow-hidden mt-3" style={{ background: 'var(--c-bg)' }}><div className="h-full" style={{ width: `${checklistProgress}%`, background: '#10b981' }} /></div>
          <div className="space-y-2 mt-4">{CHECKLIST.map(item => <label key={item.id} className="flex gap-3 items-start rounded-lg p-3 cursor-pointer" style={{ background: checked.includes(item.id) ? 'rgba(16,185,129,.08)' : 'var(--c-bg)', border: `1px solid ${checked.includes(item.id) ? '#256b4b' : 'var(--c-border)'}` }}><input type="checkbox" checked={checked.includes(item.id)} onChange={() => toggle(item.id)} className="mt-0.5" /><span className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{lang === 'en' ? item.en : item.pt}</span></label>)}</div>
        </section>
      </div>
    </Layout>
  )
}
