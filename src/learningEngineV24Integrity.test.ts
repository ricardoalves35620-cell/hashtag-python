import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { MINI_PROJECTS, getMiniProjectForPhase } from './data/miniProjects'

function expectedNumbers(projectId: string) {
  const project = MINI_PROJECTS.find(item => item.id === projectId)
  if (!project) throw new Error(`Missing project ${projectId}`)
  return project.tests.flatMap(test => test.expectedOutput)
}

describe('Learning Engine V2.4 professional mini-projects', () => {
  it('keeps the original block projects and allows later integrators', () => {
    const milestones = MINI_PROJECTS.map(project => project.milestonePhaseId)
    expect(milestones).toEqual(expect.arrayContaining([4, 7, 12]))
    for (const phaseId of [4, 7, 12]) expect(getMiniProjectForPhase(phaseId)).toBeDefined()
  })

  it('uses suggested inputs that mathematically produce the advertised evidence', () => {
    const estimate = MINI_PROJECTS.find(project => project.id === 'damage-estimate')!
    const firstEstimate = Number(estimate.tests[0].inputs[0]) - Number(estimate.tests[0].inputs[1])
    const secondEstimate = Number(estimate.tests[1].inputs[0]) - Number(estimate.tests[1].inputs[1])
    expect(firstEstimate.toFixed(2)).toBe('4500.00')
    expect(secondEstimate.toFixed(2)).toBe('2550.25')
    expect(expectedNumbers('damage-estimate')).toContain('4500.00')
    expect(expectedNumbers('damage-estimate')).toContain('2550.25')

    const queue = MINI_PROJECTS.find(project => project.id === 'claim-queue')!
    const values = queue.tests[0].inputs.slice(1).map(Number)
    expect(values.reduce((sum, value) => sum + value, 0).toFixed(2)).toBe('4000.00')
    expect((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)).toBe('1333.33')

    expect(expectedNumbers('portfolio-report')).toEqual(expect.arrayContaining(['2', 'Ana', 'Carla', '8300']))
  })

  it('requires the professional cycle and more than one behavior test where input varies', () => {
    for (const project of MINI_PROJECTS) {
      expect(project.requirements.en.length).toBeGreaterThanOrEqual(4)
      expect(project.requirements.pt.length).toBe(project.requirements.en.length)
      expect(project.refactorOptions.length).toBeGreaterThanOrEqual(3)
      expect(project.accomplishment.length).toBeGreaterThanOrEqual(3)
      expect(project.starterCode.en).toContain('TODO')
      expect(project.starterCode.pt).toContain('TODO')
    }
    expect(MINI_PROJECTS.find(project => project.id === 'damage-estimate')?.tests.length).toBeGreaterThanOrEqual(3)
    expect(MINI_PROJECTS.find(project => project.id === 'claim-queue')?.tests.length).toBeGreaterThanOrEqual(3)
    expect(MINI_PROJECTS.find(project => project.id === 'portfolio-report')?.tests.length).toBeGreaterThanOrEqual(3)
    expect(MINI_PROJECTS.find(project => project.id === 'foundation-claim-desk')?.tests.length).toBeGreaterThanOrEqual(3)
  })

  it('wires the project route, five checkpoints, persistence and reset', () => {
    const app = readFileSync(resolve('src/App.tsx'), 'utf8')
    const page = readFileSync(resolve('src/pages/MiniProject.tsx'), 'utf8')
    const progress = readFileSync(resolve('src/lib/projectProgress.ts'), 'utf8')
    const reset = readFileSync(resolve('src/lib/resetLearningProgress.ts'), 'utf8')
    const sql = readFileSync(resolve('supabase/learning-project-progress.sql'), 'utf8')

    expect(app).toContain('/mini-project/:projectId')
    for (const checkpoint of ['understand', 'plan', 'build', 'test', 'refactor']) expect(page).toContain(`'${checkpoint}'`)
    expect(page).toContain('runTests')
    expect(progress).toContain('hp_mini_project_v1_')
    expect(progress).toContain('learning_project_progress')
    expect(reset).toContain('learning_project_progress')
    expect(reset).toContain('hp_mini_project_')
    expect(sql).toContain('primary key (user_id, project_id)')
    expect(sql).toContain('project_done boolean')
    expect(sql).toContain('auth.uid() = user_id')
  })
})
