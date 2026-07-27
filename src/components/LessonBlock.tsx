import { useMemo, useState } from 'react'
import VSCodeBlock from './VSCodeBlock'
import GlossaryText from './glossary/GlossaryText'
import LearningCallout from './learning/LearningCallout'
import type { LessonBlock as LessonBlockType, LessonCheckpoint, Lang } from '../data/types'
import { resolveLocalizedCode } from '../lib/localization'
import { personalize } from '../lib/learnerProfile'
import { shuffledIndices } from '../lib/assessmentIntegrity'

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

/** A short beat of doing, placed between code blocks. Not scored: a wrong answer
 *  costs nothing but surfaces the misunderstanding immediately, which is the point. */
function Checkpoint({ checkpoint, lang }: { checkpoint: LessonCheckpoint; lang: Lang }) {
  const [chosen, setChosen] = useState<number | null>(null)
  const answered = chosen !== null
  const correct = chosen === checkpoint.correctIndex
  // Without this the correct answer is always first, since specs author it at index 0.
  const order = useMemo(
    () => shuffledIndices(checkpoint.options.length, 1, checkpoint.code),
    [checkpoint],
  )
  const t = (b: { en: string; pt: string } | undefined) => personalize(b?.[lang] || b?.en || '')

  const prompt = checkpoint.question
    ? t(checkpoint.question)
    : lang === 'en' ? 'What does this print?' : 'O que isto imprime?'

  return (
    <div
      className="rounded-2xl p-4 my-4"
      style={{ background: 'var(--c-purple-f)', border: '1px solid var(--c-purple-dm)' }}
      data-testid="lesson-checkpoint"
    >
      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--c-purple-l)' }}>
        {lang === 'en' ? 'Your turn' : 'Sua vez'}
      </div>

      <VSCodeBlock code={checkpoint.code} />

      <div className="text-sm font-medium mt-3 mb-2" style={{ color: 'var(--c-text)' }}>{prompt}</div>

      <div className="flex flex-col gap-2">
        {order.map(index => {
          const option = checkpoint.options[index]
          const isCorrect = index === checkpoint.correctIndex
          const isChosen = chosen === index
          let background = 'var(--c-bg)'
          let border = 'var(--c-border)'
          let color = 'var(--c-text2)'
          if (answered && isCorrect) { background = 'rgba(22,101,52,0.18)'; border = '#166534'; color = '#86efac' }
          else if (answered && isChosen) { background = 'rgba(239,68,68,0.12)'; border = 'rgba(239,68,68,0.4)'; color = '#fca5a5' }
          return (
            <button
              key={index}
              type="button"
              data-testid="checkpoint-option"
              disabled={answered}
              onClick={() => setChosen(index)}
              className="w-full text-left rounded-xl px-3 py-2 text-sm"
              style={{ background, border: `1px solid ${border}`, color, cursor: answered ? 'default' : 'pointer' }}
            >
              <code>{t(option)}</code>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="text-sm leading-relaxed mt-3" style={{ color: 'var(--c-text2)' }}>
          <span style={{ color: correct ? '#86efac' : '#fca5a5', fontWeight: 600 }}>
            {correct
              ? (lang === 'en' ? 'Correct. ' : 'Correto. ')
              : (lang === 'en' ? 'Not quite. ' : 'Quase. ')}
          </span>
          <GlossaryText text={t(checkpoint.explanation)} lang={lang} />
        </div>
      )}
    </div>
  )
}

export default function LessonBlock({ block, lang }: Props) {
  const t = (b: { en: string; pt: string } | undefined) => personalize(b?.[lang] || b?.en || '')

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

  if (block.type === 'checkpoint') {
    if (!block.checkpoint) return null
    return <Checkpoint checkpoint={block.checkpoint} lang={lang} />
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
        <LearningCallout
          variant={isTip ? 'idea' : 'warning'}
          title={isTip ? (lang === 'en' ? 'Key idea' : 'Ideia principal') : (lang === 'en' ? 'Common mistake' : 'Erro comum')}
        >
          <GlossaryText text={t(block.content)} lang={lang} className="lesson-prose" />
        </LearningCallout>
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
