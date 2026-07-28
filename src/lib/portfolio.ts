import type { MiniProject } from '../data/miniProjects'
import type { MiniProjectProgress } from './projectProgress'

export const PORTFOLIO_PROJECT_IDS = [
  'foundation-order-desk',
  'professional-orders-triage',
  'engineering-order-service',
  'data-ml-risk-pipeline',
  'transformer-attention-inspector',
  'local-rag-copilot',
] as const

export function safePortfolioFilename(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function testEvidence(progress: MiniProjectProgress) {
  if (!progress.testResults.length) return '- No test evidence recorded.'
  return progress.testResults
    .map(result => `- ${result.passed ? 'PASS' : 'FAIL'} — ${result.id}`)
    .join('\n')
}

export function buildPortfolioReadme(project: MiniProject, progress: MiniProjectProgress, lang: 'en' | 'pt') {
  const isPt = lang === 'pt'
  return `# ${project.title[lang]}

${project.subtitle[lang]}

## ${isPt ? 'Problema' : 'Problem'}

${project.scenario[lang]}

## ${isPt ? 'Contrato que defini' : 'Contract I defined'}

### ${isPt ? 'Entradas' : 'Inputs'}
${progress.understanding.inputs || project.inputContract[lang]}

### ${isPt ? 'Saída' : 'Output'}
${progress.understanding.output || project.outputContract[lang]}

### ${isPt ? 'Regras' : 'Rules'}
${progress.understanding.rules || project.ruleContract[lang]}

### ${isPt ? 'Caso limite' : 'Edge case'}
${progress.understanding.edgeCase || project.edgeCases[lang]}

## ${isPt ? 'Planejamento em pseudocódigo' : 'Pseudocode plan'}

\`\`\`text
${progress.pseudocode.trim() || (isPt ? 'Planejamento não registrado neste aparelho.' : 'Plan not recorded on this device.')}
\`\`\`

## ${isPt ? 'Implementação' : 'Implementation'}

\`\`\`python
${progress.code.trim()}
\`\`\`

## ${isPt ? 'Evidências de teste' : 'Test evidence'}

${testEvidence(progress)}

## ${isPt ? 'Habilidades demonstradas' : 'Demonstrated skills'}

${project.accomplishment.map(item => `- ${item[lang]}`).join('\n')}

## ${isPt ? 'Decisões de melhoria' : 'Improvement decisions'}

${progress.selectedRefactors.length
    ? progress.selectedRefactors.map(index => `- ${project.refactorOptions[index]?.[lang] || index}`).join('\n')
    : `- ${isPt ? 'Nenhuma decisão registrada neste aparelho.' : 'No decision recorded on this device.'}`}

---
${isPt
    ? 'Projeto produzido no Hashtag Python como evidência de domínio comprovado.'
    : 'Project produced in Hashtag Python as evidence of demonstrated mastery.'}
`
}

export function buildCompletePortfolio(
  entries: Array<{ project: MiniProject; progress: MiniProjectProgress }>,
  lang: 'en' | 'pt',
) {
  const isPt = lang === 'pt'
  const completed = entries.filter(entry => entry.progress.completed)
  const title = isPt ? 'Portfólio completo — Hashtag Python' : 'Complete portfolio — Hashtag Python'
  const indexTitle = isPt ? 'Índice de artefatos' : 'Artifact index'
  const intro = isPt
    ? 'Este documento reúne evidências produzidas durante a progressão normal do curso. Cada artefato contém planejamento, implementação, testes e decisões de melhoria.'
    : 'This document combines evidence produced through the normal course progression. Every artifact contains planning, implementation, tests and improvement decisions.'

  const index = completed
    .map((entry, itemIndex) => `${itemIndex + 1}. ${entry.project.title[lang]} — ${isPt ? 'Fase' : 'Phase'} ${entry.project.milestonePhaseId}`)
    .join('\n')

  const artifacts = completed
    .map(entry => buildPortfolioReadme(entry.project, entry.progress, lang))
    .join('\n\n---\n\n')

  return `# ${title}

${intro}

## ${indexTitle}

${index}

## ${isPt ? 'Resumo' : 'Summary'}

- ${isPt ? 'Artefatos concluídos' : 'Completed artifacts'}: ${completed.length}/${entries.length}
- ${isPt ? 'Abrangência' : 'Coverage'}: ${isPt ? 'fundamentos, Python profissional, engenharia, dados, redes neurais e IA local' : 'foundations, professional Python, engineering, data, neural networks and local AI'}
- ${isPt ? 'Dependência de API externa de IA' : 'External AI API dependency'}: ${isPt ? 'nenhuma no capstone final' : 'none in the final capstone'}

---

${artifacts}
`
}
