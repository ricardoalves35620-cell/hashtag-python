import VSCodeBlock from './VSCodeBlock'
import type { LessonBlock as LessonBlockType, Lang } from '../data/types'

interface Props {
  block: LessonBlockType
  lang: Lang
}

export default function LessonBlock({ block, lang }: Props) {
  const t = (b: { en: string; pt: string } | undefined) => b?.[lang] || ''

  if (block.type === 'heading') {
    return (
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--c-text)', marginTop: 24, marginBottom: 8 }}>
        {t(block.content)}
      </h2>
    )
  }

  if (block.type === 'text') {
    return (
      <div
        className="lesson-prose"
        style={{ color: 'var(--c-text2)', lineHeight: 1.7, fontSize: 15 }}
        dangerouslySetInnerHTML={{ __html: t(block.content) }}
      />
    )
  }

  if (block.type === 'code') {
    return <VSCodeBlock code={block.code || ''} />
  }

  if (block.type === 'video') {
    const videoId = extractYouTubeId(block.videoUrl || '')
    return (
      <div style={{ margin: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            fontSize: 10, background: 'var(--c-purple-dm)', color: 'var(--c-purple-l)',
            padding: '3px 8px', borderRadius: 20, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            Video · {block.videoDuration}
          </span>
          <span style={{ fontSize: 13, color: 'var(--c-muted)' }}>{t(block.videoTitle)}</span>
        </div>
        {videoId ? (
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '0.5px solid var(--c-border)', aspectRatio: '16/9' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={t(block.videoTitle)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
          </div>
        ) : (
          <a href={block.videoUrl} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--c-card)', border: '0.5px solid var(--c-border)',
              borderRadius: 10, padding: 14, textDecoration: 'none',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--c-purple-d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M6 3.5l7 4.5-7 4.5z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-purple-l)' }}>{t(block.videoTitle)}</div>
              <div style={{ fontSize: 11, color: 'var(--c-muted)', marginTop: 2 }}>
                {lang === 'en' ? 'Watch on YouTube' : 'Assistir no YouTube'} · {block.videoDuration}
              </div>
            </div>
          </a>
        )}
      </div>
    )
  }

  if (block.type === 'tip') {
    return (
      <div style={{
        display: 'flex', gap: 10,
        background: '#0a1f0a', border: '1px solid #1a4a1a',
        borderRadius: 10, padding: 14, margin: '10px 0'
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
        <div
          className="lesson-prose"
          style={{ fontSize: 13, color: '#86efac', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: t(block.content) }}
        />
      </div>
    )
  }

  if (block.type === 'warning') {
    return (
      <div style={{
        display: 'flex', gap: 10,
        background: '#1f1000', border: '1px solid #4a2a00',
        borderRadius: 10, padding: 14, margin: '10px 0'
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
        <div
          className="lesson-prose"
          style={{ fontSize: 13, color: '#fbbf24', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: t(block.content) }}
        />
      </div>
    )
  }

  return null
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match?.[1] || null
}
