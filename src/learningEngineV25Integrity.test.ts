import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('Learning Engine V2.5 educational workspace', () => {
  it('uses a responsive journey rail and sticky navigation in lessons', () => {
    const lesson = read('./pages/Lesson.tsx')
    expect(lesson).toContain('LearningStageRail')
    expect(lesson).toContain('StickyLearningActions')
    expect(lesson).toContain('learning-workspace__grid')
    expect(lesson).toContain("scrollToTop()")
    expect(lesson).toContain('optional-learning-journal')
  })

  it('presents phase progress as a learning path rather than a click list', () => {
    const overview = read('./pages/PhaseOverview.tsx')
    expect(overview).toContain('phase-path')
    expect(overview).toContain('Progress here measures evidence of learning—not clicks.')
    expect(overview).toContain('O progresso aqui mede evidências de aprendizagem — não cliques.')
    expect(overview).toContain('Professional mini-project')
  })

  it('reuses the professional checkpoint rail inside mini-projects', () => {
    const project = read('./pages/MiniProject.tsx')
    expect(project).toContain('LearningStageRail')
    expect(project).toContain('StickyLearningActions')
    expect(project).toContain('project-workspace-v25')
  })

  it('defines semantic learning callouts and desktop reading layout', () => {
    const css = read('./index.css')
    expect(css).toContain('.learning-callout')
    expect(css).toContain('.learning-reading-column')
    expect(css).toContain('@media (min-width: 960px)')
    expect(css).toContain('.sticky-learning-actions')
  })
})
