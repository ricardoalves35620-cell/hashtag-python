import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { MINI_PROJECTS } from './data/miniProjects'
import { MINI_PROJECT_GUIDES } from './data/miniProjectGuides'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('plain-language mini-project instructions', () => {
  it('provides a complete bilingual guide for every published mini-project', () => {
    expect(Object.keys(MINI_PROJECT_GUIDES).sort()).toEqual(MINI_PROJECTS.map(project => project.id).sort())

    for (const project of MINI_PROJECTS) {
      const guide = MINI_PROJECT_GUIDES[project.id]
      expect(guide, project.id).toBeTruthy()
      expect(guide.mission.en.length, project.id).toBeGreaterThan(25)
      expect(guide.mission.pt.length, project.id).toBeGreaterThan(25)
      expect(guide.story.en.length, project.id).toBeGreaterThan(40)
      expect(guide.story.pt.length, project.id).toBeGreaterThan(40)
      expect(guide.exactTasks.length, project.id).toBeGreaterThanOrEqual(4)
      expect(guide.planSteps.length, project.id).toBeGreaterThanOrEqual(4)
      expect(guide.buildHints.length, project.id).toBeGreaterThanOrEqual(3)
      expect(guide.inputItems.length, project.id).toBeGreaterThan(0)
      expect(guide.outputItems.length, project.id).toBeGreaterThan(0)
      expect(guide.codeWords.length, project.id).toBeGreaterThanOrEqual(3)
      expect(guide.improveChoices.length, project.id).toBeGreaterThanOrEqual(3)
      expect(guide.improveNoteExample.en.length, project.id).toBeGreaterThan(30)
      expect(guide.improveNoteExample.pt.length, project.id).toBeGreaterThan(30)
    }
  })

  it('explains the purpose of every automated project scenario', () => {
    for (const project of MINI_PROJECTS) {
      const guide = MINI_PROJECT_GUIDES[project.id]
      for (const test of project.tests) {
        expect(guide.testPurposes[test.id]?.en.length, `${project.id}:${test.id}`).toBeGreaterThan(20)
        expect(guide.testPurposes[test.id]?.pt.length, `${project.id}:${test.id}`).toBeGreaterThan(20)
      }
    }
  })

  it('gives the phase 7 learner an explicit loop recipe and zero-division rule', () => {
    const guide = MINI_PROJECT_GUIDES['claim-queue']
    const portuguesePlan = guide.planSteps.map(step => step.pt).join(' ')
    const portugueseHints = guide.buildHints.map(step => step.pt).join(' ')

    expect(portuguesePlan).toContain('processed')
    expect(portuguesePlan).toContain('quantity')
    expect(portuguesePlan).toContain('total / processed')
    expect(portugueseHints).toContain('divisão por zero')
  })

  it('renders guided answers, guided planning, build vocabulary, test purposes and explicit final choices', () => {
    const page = read('./pages/MiniProject.tsx')
    const panels = read('./components/learning/MiniProjectGuidePanels.tsx')

    expect(page).toContain('MiniProjectMissionBrief')
    expect(page).toContain('MiniProjectGuidedPlan')
    expect(page).toContain('MiniProjectBuildGuide')
    expect(page).toContain('MiniProjectTestPurpose')
    expect(page).toContain('MiniProjectImprovementGuide')
    expect(panels).toContain('project-child-friendly-brief')
    expect(panels).toContain('project-explicit-improvement-choices')
    expect(panels).toContain('What the code names mean')
    expect(panels).toContain('O que os nomes do código significam')
  })
})
