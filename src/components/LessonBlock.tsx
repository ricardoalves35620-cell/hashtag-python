import type { LessonBlock as LessonBlockType, Lang } from '../data/types'

interface Props {
  block: LessonBlockType
  lang: Lang
}

export default function LessonBlock({ block, lang }: Props) {
  const t = (b: { en: string; pt: string } | undefined) => b?.[lang] || ''

  if (block.type === 'heading') {
    return (
      <h2 className="text-xl font-medium text-white mt-6 mb-2">
        {t(block.content)}
      </h2>
    )
  }

  if (block.type === 'text') {
    return (
      <div
        className="lesson-prose text-[#b0b0d0] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: t(block.content) }}
      />
    )
  }

  if (block.type === 'code') {
    return (
      <div className="bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4 my-3 overflow-x-auto">
        <pre className="font-mono text-sm text-[#a78bfa] leading-relaxed whitespace-pre">
          {block.code}
        </pre>
      </div>
    )
  }

  if (block.type === 'video') {
    const videoId = extractYouTubeId(block.videoUrl || '')
    return (
      <div className="my-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] bg-[#2d1b69] text-purple-light px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
            Video · {block.videoDuration}
          </span>
          <span className="text-sm text-[#8888aa]">{t(block.videoTitle)}</span>
        </div>
        {videoId ? (
          <div className="rounded-xl overflow-hidden border border-[#1e1e40]" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={t(block.videoTitle)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <a
            href={block.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#0d0d1f] border border-[#1e1e40] rounded-xl p-4 hover:border-purple-dim transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-purple-dark flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M6 3.5l7 4.5-7 4.5z"/></svg>
            </div>
            <div>
              <div className="text-sm font-medium text-purple-light">{t(block.videoTitle)}</div>
              <div className="text-xs text-muted mt-0.5">{lang === 'en' ? 'Watch on YouTube' : 'Assistir no YouTube'} · {block.videoDuration}</div>
            </div>
          </a>
        )}
      </div>
    )
  }

  if (block.type === 'tip') {
    return (
      <div className="flex gap-3 bg-[#0a1f0a] border border-[#1a4a1a] rounded-xl p-4 my-3">
        <span className="text-green-400 mt-0.5 flex-shrink-0">💡</span>
        <div
          className="text-sm text-green-200 leading-relaxed lesson-prose"
          dangerouslySetInnerHTML={{ __html: t(block.content) }}
        />
      </div>
    )
  }

  if (block.type === 'warning') {
    return (
      <div className="flex gap-3 bg-[#1f1000] border border-[#4a2a00] rounded-xl p-4 my-3">
        <span className="text-amber-400 mt-0.5 flex-shrink-0">⚠️</span>
        <div
          className="text-sm text-amber-200 leading-relaxed lesson-prose"
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
