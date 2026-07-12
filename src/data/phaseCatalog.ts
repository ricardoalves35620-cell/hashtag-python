import type { Bilingual, Phase, PhaseStage } from './types'

export interface PhaseGroup {
  id: PhaseStage
  title: Bilingual
  subtitle: Bilingual
  icon: string
  track: 'core' | 'ai-local'
  phaseRange: [number, number]
  labPath?: string
}

export const PHASE_GROUPS: PhaseGroup[] = [
  {
    id: 'base', icon: '🐍', track: 'core', phaseRange: [0, 27],
    title: { en: 'Python foundations', pt: 'Fundamentos de Python' },
    subtitle: { en: 'Digital basics, syntax, logic, data and complete foundation projects.', pt: 'Base digital, sintaxe, lógica, dados e projetos completos de fundamentos.' },
  },
  {
    id: 'professional', icon: '🛠️', track: 'core', phaseRange: [28, 39], labPath: '/project-lab',
    title: { en: 'Professional Python', pt: 'Python profissional' },
    subtitle: { en: 'Projects, environments, packages, Git, tests, typing and object design.', pt: 'Projetos, ambientes, pacotes, Git, testes, tipos e design de objetos.' },
  },
  {
    id: 'advanced', icon: '⚙️', track: 'core', phaseRange: [40, 47], labPath: '/engineering-lab',
    title: { en: 'Advanced Python', pt: 'Python avançado' },
    subtitle: { en: 'Protocols, generators, decorators, async, concurrency and performance.', pt: 'Protocolos, generators, decorators, async, concorrência e desempenho.' },
  },
  {
    id: 'engineering', icon: '🏭', track: 'core', phaseRange: [48, 53], labPath: '/engineering-lab',
    title: { en: 'Software engineering', pt: 'Engenharia de software' },
    subtitle: { en: 'Databases, APIs, architecture, security, packaging and mastery capstone.', pt: 'Bancos, APIs, arquitetura, segurança, empacotamento e capstone de domínio.' },
  },
  {
    id: 'ai-data', icon: '📊', track: 'ai-local', phaseRange: [54, 60], labPath: '/ai-lab',
    title: { en: 'Data and machine learning', pt: 'Dados e Machine Learning' },
    subtitle: { en: 'Math, NumPy, Pandas, statistics and classical ML.', pt: 'Matemática, NumPy, Pandas, estatística e ML clássico.' },
  },
  {
    id: 'ai-deep', icon: '🧠', track: 'ai-local', phaseRange: [61, 64], labPath: '/ai-lab',
    title: { en: 'Neural networks and language', pt: 'Redes neurais e linguagem' },
    subtitle: { en: 'Neural networks, PyTorch concepts, tokenization and transformers.', pt: 'Redes neurais, conceitos de PyTorch, tokenização e Transformers.' },
  },
  {
    id: 'ai-local', icon: '🤖', track: 'ai-local', phaseRange: [65, 68], labPath: '/ai-lab',
    title: { en: 'Local AI engineering', pt: 'Engenharia de IA local' },
    subtitle: { en: 'Local models, RAG, evaluation, LoRA and an offline capstone.', pt: 'Modelos locais, RAG, avaliação, LoRA e capstone offline.' },
  },
]

export function inferPhaseStage(phase: Phase): PhaseStage {
  if (phase.stage) return phase.stage
  if (phase.id <= 27) return 'base'
  if (phase.id <= 39) return 'professional'
  if (phase.id <= 47) return 'advanced'
  if (phase.id <= 53) return 'engineering'
  if (phase.id <= 60) return 'ai-data'
  if (phase.id <= 64) return 'ai-deep'
  return 'ai-local'
}

export function phasesForGroup(phases: Phase[], groupId: PhaseStage) {
  return phases.filter(phase => inferPhaseStage(phase) === groupId)
}

export function getPhaseGroup(groupId: PhaseStage) {
  return PHASE_GROUPS.find(group => group.id === groupId)
}
