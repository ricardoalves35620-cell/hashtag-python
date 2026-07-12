import type { ErrorExplanation } from '../lib/errorExplainer'
import type { Lang } from '../data/types'

interface Props {
  explanation: ErrorExplanation
  lang: Lang
  rawError: string
  showRaw: boolean
  onToggleRaw: () => void
}

export default function ErrorExplainer({ explanation, lang, rawError, showRaw, onToggleRaw }: Props) {
  const t = {
    en: { where: 'Where', why: 'What happened', fix: 'How to fix', tip: 'Pro tip', raw: 'Show raw error', hideRaw: 'Hide raw error' },
    pt: { where: 'Onde', why: 'O que aconteceu', fix: 'Como corrigir', tip: 'Dica pro', raw: 'Ver erro completo', hideRaw: 'Esconder erro' }
  }[lang]

  const errorColor = 'var(--c-danger-text)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Error header ── */}
      <div style={{
        background: 'var(--c-danger-bg)',
        border: '1px solid var(--c-danger-border)',
        borderRadius: '10px 10px 0 0',
        padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>❌</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: errorColor }}>
            {explanation.title[lang]}
          </div>
          <div style={{ fontSize: 12, color: 'var(--c-danger-text)', marginTop: 3 }}>
            {explanation.type} · {explanation.where[lang]}
          </div>
        </div>
      </div>

      {/* ── Explanation card ── */}
      <div style={{
        background: 'var(--c-danger-bg)',
        border: '1px solid var(--c-danger-border)',
        borderTop: 'none',
        borderRadius: '0 0 10px 10px',
        padding: '14px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>

        {/* Problematic code */}
        {explanation.badCode && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--c-danger-text)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              {lang === 'en' ? '⚠️ Problematic line' : '⚠️ Linha problemática'}
            </div>
            <div style={{
              background: '#0d0d0d', borderRadius: 6, padding: '8px 12px',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              color: 'var(--c-danger-text)', border: '1px solid var(--c-danger-border)',
            }}>
              {explanation.badCode}
            </div>
          </div>
        )}

        {/* Why */}
        <div>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
            ❓ {t.why}
          </div>
          <p style={{ fontSize: 13, color: 'var(--c-danger-text)', lineHeight: 1.6, margin: 0 }}>
            {explanation.why[lang]}
          </p>
        </div>

        {/* How to fix */}
        <div style={{ background: 'var(--c-success-bg)', border: '1px solid var(--c-success-border)', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--c-success-strong)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            ✅ {t.fix}
          </div>
          <pre style={{
            fontSize: 13, color: 'var(--c-success-text)', lineHeight: 1.7,
            margin: 0, whiteSpace: 'pre-wrap',
            fontFamily: explanation.fix[lang].includes('\n  ') ? "'JetBrains Mono', monospace" : 'inherit',
          }}>
            {explanation.fix[lang]}
          </pre>
        </div>

        {/* Tip */}
        <div style={{ display: 'flex', gap: 8, background: '#1a1040', border: '1px solid #2d1b69', borderRadius: 8, padding: 12 }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: 12, color: '#a78bfa', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#c4b5fd' }}>{t.tip}:</strong>{' '}
            {explanation.tip[lang]}
          </p>
        </div>

        {/* Raw error toggle */}
        <button
          onClick={onToggleRaw}
          style={{
            background: 'none', border: 'none', padding: 0,
            color: 'var(--c-danger-text)', fontSize: 12, cursor: 'pointer',
            textDecoration: 'underline', textAlign: 'left',
          }}
        >
          {showRaw ? t.hideRaw : t.raw}
        </button>

        {showRaw && (
          <div style={{
            background: '#0d0d0d', borderRadius: 6, padding: '10px 12px',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: '#858585', border: '1px solid #3e3e3e', maxHeight: 160, overflowY: 'auto',
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{rawError}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
