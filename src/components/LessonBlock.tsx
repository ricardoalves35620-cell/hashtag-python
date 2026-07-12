import { useState } from 'react'
import VSCodeBlock from './VSCodeBlock'
import GlossaryText from './glossary/GlossaryText'
import type { LessonBlock as LessonBlockType, Lang } from '../data/types'
import { resolveLocalizedCode } from '../lib/localization'

interface Props {
  block: LessonBlockType
  lang: Lang
}

function AlternateExplanation({ block, lang }: Props) {
  const [open, setOpen] = useState(false)
  const fallback = lang === 'en'
    ? 'Try this approach: identify the one new idea, say it in your own words, then test the smallest example before continuing.'
    : 'Tente assim: identifique a única ideia nova, explique com suas palavras e depois teste o menor exemplo possível antes de continuar.'
  const text = block.alternate?.[lang] || fallback

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="text-xs px-3 py-2 rounded-lg"
        style={{ background: 'var(--c-bg)', color: 'var(--c-purple-l)', border: '1px solid var(--c-border)' }}
      >
        {open ? '✓ ' : '🤔 '}{lang === 'en' ? (open ? 'Got it — hide' : "I didn't understand") : (open ? 'Entendi — ocultar' : 'Não entendi')}
      </button>
      {open && (
        <div className="rounded-xl p-3 mt-2 text-sm leading-relaxed" style={{ background: 'var(--c-purple-f)', color: 'var(--c-text2)', border: '1px solid var(--c-purple-dm)' }}>
          <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--c-purple-l)' }}>{lang === 'en' ? 'Another way to see it' : 'Outra forma de entender'}</div>
          <GlossaryText text={text} lang={lang} />
        </div>
      )}
    </div>
  )
}

export default function LessonBlock({ block, lang }: Props) {
  const t = (b: { en: string; pt: string } | undefined) => b?.[lang] || b?.en || ''

  if (block.type === 'heading') {
    return (
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--c-text)', marginTop: 24, marginBottom: 8 }}>
        <GlossaryText text={t(block.content)} lang={lang} />
      </h2>
    )
  }

  if (block.type === 'text') {
    return (
      <div>
        <GlossaryText text={t(block.content)} lang={lang} className="lesson-prose" style={{ color: 'var(--c-text2)', lineHeight: 1.7, fontSize: 15 }} />
        <AlternateExplanation block={block} lang={lang} />
      </div>
    )
  }

  if (block.type === 'code') {
    return <VSCodeBlock code={resolveLocalizedCode(block.code, lang)} />
  }

  if (block.type === 'video') {
    const videoId = extractYouTubeId(block.videoUrl || '')
    return (
      <div style={{ margin: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 10, background: 'var(--c-purple-dm)', color: 'var(--c-purple-l)', padding: '3px 8px', borderRadius: 20, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {lang === 'en' ? 'Video' : 'Vídeo'} · {block.videoDuration}
          </span>
          <span style={{ fontSize: 13, color: 'var(--c-muted)' }}>{t(block.videoTitle)}</span>
        </div>
        {videoId ? (
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '0.5px solid var(--c-border)', aspectRatio: '16/9' }}>
            <iframe src={`https://www.youtube.com/embed/${videoId}`} title={t(block.videoTitle)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>
        ) : (
          <a href={block.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--c-card)', border: '0.5px solid var(--c-border)', borderRadius: 10, padding: 14, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--c-purple-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M6 3.5l7 4.5-7 4.5z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-purple-l)' }}>{t(block.videoTitle)}</div>
              <div style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 2 }}>{lang === 'en' ? 'Watch on YouTube' : 'Assistir no YouTube'} · {block.videoDuration}</div>
            </div>
          </a>
        )}
      </div>
    )
  }

  if (block.type === 'tip' || block.type === 'warning') {
    const isTip = block.type === 'tip'
    return (
      <div>
        <div style={{ display: 'flex', gap: 10, background: isTip ? '#0a1f0a' : '#1f1000', border: `1px solid ${isTip ? '#1a4a1a' : '#4a2a00'}`, borderRadius: 10, padding: 14, margin: '10px 0' }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{isTip ? '💡' : '⚠️'}</span>
          <GlossaryText text={t(block.content)} lang={lang} className="lesson-prose" style={{ fontSize: 13, color: isTip ? '#86efac' : '#fbbf24', lineHeight: 1.6 }} />
        </div>
        <AlternateExplanation block={block} lang={lang} />
      </div>
    )
  }

  return null
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match?.[1] || null
}
