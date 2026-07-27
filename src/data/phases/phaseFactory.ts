import type { Bilingual, CodeRequirement, Phase, PhaseStage, CurriculumTrack } from '../types'

export interface ChallengeSpec {
  functionName: string
  starterCode: string
  publicAfterCode: string
  publicExpected: string
  hiddenAfterCode: string
  hiddenExpected: string
  requirements?: CodeRequirement[]
  timeoutMs?: number
}

export interface ConceptPhaseSpec {
  id: number
  title: Bilingual
  description: Bilingual
  icon: string
  libraries?: string[]
  track?: CurriculumTrack
  stage: PhaseStage
  estimatedHours: number
  desktopRequired?: boolean
  labPath?: string
  concept: Bilingual
  why: Bilingual
  mentalModel: Bilingual
  workflow: Bilingual
  exampleCode: string
  exampleOutput: Bilingual
  professionalCode: string
  commonMistake: Bilingual
  bestPractice: Bilingual
  outcomes: { en: string[]; pt: string[] }
  practice: ChallengeSpec
  /** Optional genuinely different challenge. When absent, no third exercise is generated
   *  rather than duplicating the practice task. */
  transfer?: ChallengeSpec
  exam: ChallengeSpec
  quizPurpose: Bilingual
  quizBestPractice: Bilingual
  quizAvoid: Bilingual
}

function lines(items: string[]) {
  return items.map(item => `• ${item}`).join('\n')
}

function makeTests(prefix: string, challenge: ChallengeSpec) {
  const requirements = challenge.requirements || [{ kind: 'function', value: challenge.functionName } as CodeRequirement]
  return [
    {
      id: `${prefix}-public`,
      description: { en: 'Works for the visible professional scenario', pt: 'Funciona no cenário profissional visível' },
      expectedOutput: { en: challenge.publicExpected, pt: challenge.publicExpected },
      inputs: [],
      checks: [{ type: 'equals' as const, value: challenge.publicExpected, target: 'test_output' as const, textMode: 'normalized' as const }],
      points: 50,
      afterCode: challenge.publicAfterCode,
      codeRequirements: requirements,
      timeoutMs: challenge.timeoutMs,
    },
    {
      id: `${prefix}-hidden`,
      description: { en: 'Generalizes to a different hidden scenario', pt: 'Generaliza para um cenário oculto diferente' },
      expectedOutput: { en: challenge.hiddenExpected, pt: challenge.hiddenExpected },
      inputs: [],
      checks: [{ type: 'equals' as const, value: challenge.hiddenExpected, target: 'test_output' as const, textMode: 'normalized' as const }],
      points: 50,
      afterCode: challenge.hiddenAfterCode,
      codeRequirements: requirements,
      timeoutMs: challenge.timeoutMs,
      hidden: true,
    },
  ]
}

/** Pulls plausible wrong answers from other phases in the same batch. A statement that is
 *  true elsewhere but wrong here forces the learner to know THIS concept, unlike a joke
 *  option that can be eliminated without understanding anything. */
function distractorsFrom(
  siblings: ConceptPhaseSpec[],
  self: ConceptPhaseSpec,
  pick: (spec: ConceptPhaseSpec) => Bilingual,
  fallback: Bilingual[],
): Bilingual[] {
  const correct = pick(self).en.trim()
  const seen = new Set<string>([correct])
  const pool: Bilingual[] = []
  const others = siblings.filter(item => item.id !== self.id)

  // Rotate the start position by phase id so neighbouring phases don't share
  // the same three wrong answers, then take the first distinct ones.
  const start = others.length > 0 ? Math.abs(self.id) % others.length : 0
  for (let step = 0; step < others.length && pool.length < 3; step++) {
    const candidate = pick(others[(start + step) % others.length])
    const key = candidate.en.trim()
    if (seen.has(key)) continue
    seen.add(key)
    pool.push(candidate)
  }

  return pool.length === 3 ? pool : fallback
}

const practiceClosing: Record<string, Bilingual> = {
  base: {
    en: 'Predict the result before running. Change one value. Run again. Explain why it changed.',
    pt: 'Preveja o resultado antes de executar. Mude um valor. Execute de novo. Explique por que mudou.',
  },
  professional: {
    en: 'Write the failing case first, then the fix. Ask what a reviewer would question, and answer it in the code.',
    pt: 'Escreva primeiro o caso que falha, depois a correção. Pergunte o que um revisor questionaria e responda no código.',
  },
  advanced: {
    en: 'Reason about cost and limits before optimising. Measure, change one thing, measure again.',
    pt: 'Pense em custo e limites antes de otimizar. Meça, mude uma coisa, meça de novo.',
  },
  engineering: {
    en: 'Design the interface before the implementation. Then break your own assumptions and see what holds.',
    pt: 'Projete a interface antes da implementação. Depois quebre suas suposições e veja o que resiste.',
  },
  'ai-data': {
    en: 'Check shapes and units by hand on a tiny example before trusting any library output.',
    pt: 'Confira dimensões e unidades à mão em um exemplo pequeno antes de confiar na biblioteca.',
  },
  'ai-deep': {
    en: 'Inspect intermediate values, not just the final number. Most errors hide in the middle.',
    pt: 'Inspecione valores intermediários, não só o número final. A maioria dos erros se esconde no meio.',
  },
  'ai-local': {
    en: 'Run it once end to end before improving anything. A working baseline beats a clever guess.',
    pt: 'Rode tudo de ponta a ponta antes de melhorar. Uma base funcionando vale mais que um palpite esperto.',
  },
}

export function createConceptPhase(spec: ConceptPhaseSpec, siblings: ConceptPhaseSpec[] = [spec]): Phase {
  const practiceRequirements = spec.practice.requirements || [{ kind: 'function', value: spec.practice.functionName } as CodeRequirement]
  const examRequirements = spec.exam.requirements || [{ kind: 'function', value: spec.exam.functionName } as CodeRequirement]

  return {
    id: spec.id,
    title: spec.title,
    description: spec.description,
    icon: spec.icon,
    libraries: spec.libraries || [],
    track: spec.track || 'core',
    stage: spec.stage,
    estimatedHours: spec.estimatedHours,
    desktopRequired: spec.desktopRequired,
    labPath: spec.labPath,
    lesson: {
      title: spec.title,
      blocks: [
        { type: 'heading', content: { en: `Why ${spec.concept.en} matters`, pt: `Por que ${spec.concept.pt} importa` } },
        { type: 'text', content: spec.why },
        { type: 'heading', content: { en: 'Mental model', pt: 'Modelo mental' } },
        { type: 'text', content: spec.mentalModel },
        { type: 'code', code: spec.exampleCode },
        { type: 'heading', content: { en: 'Professional workflow', pt: 'Fluxo profissional' } },
        { type: 'text', content: spec.workflow },
        { type: 'code', code: spec.professionalCode },
        { type: 'warning', content: spec.commonMistake },
        { type: 'tip', content: spec.bestPractice },
        { type: 'heading', content: { en: 'What mastery looks like', pt: 'Como é o domínio real' } },
        { type: 'text', content: { en: lines(spec.outcomes.en), pt: lines(spec.outcomes.pt) } },
        { type: 'heading', content: { en: 'Deliberate practice', pt: 'Prática deliberada' } },
        { type: 'text', content: practiceClosing[spec.stage] || practiceClosing.base },
      ],
    },
    exercises: [
      {
        id: `p${spec.id}-observe`,
        title: { en: 'Predict, run, change and explain', pt: 'Preveja, execute, mude e explique' },
        description: {
          en: 'Read every line first. Record your prediction, run the code, change one meaningful value or operator, run again, and explain why the result changed.',
          pt: 'Leia cada linha primeiro. Registre sua previsão, execute, mude um valor ou operador relevante, execute novamente e explique por que o resultado mudou.'
        },
        starterCode: spec.exampleCode,
        hints: [
          { en: 'Say the result out loud before clicking Run.', pt: 'Diga o resultado em voz alta antes de clicar em Executar.' },
          { en: 'Change only one thing at a time.', pt: 'Mude apenas uma coisa por vez.' },
        ],
        sampleOutput: spec.exampleOutput,
      },
      {
        id: `p${spec.id}-practice`,
        title: { en: 'Implement the core behavior', pt: 'Implemente o comportamento central' },
        description: {
          en: `Complete ${spec.practice.functionName} so it works for visible and hidden data. Do not hard-code the example.`,
          pt: `Complete ${spec.practice.functionName} para funcionar com dados visíveis e ocultos. Não fixe a resposta do exemplo.`
        },
        starterCode: spec.practice.starterCode,
        hints: [
          { en: `Start by defining the contract of ${spec.practice.functionName}: inputs, output and failure cases.`, pt: `Comece definindo o contrato de ${spec.practice.functionName}: entradas, saída e falhas.` },
          spec.bestPractice,
          { en: 'Use the visible case, then invent a different case before submitting.', pt: 'Use o caso visível e depois invente outro caso antes de enviar.' },
        ],
        grading: {
          tests: makeTests(`p${spec.id}-practice`, spec.practice),
          codeRequirements: practiceRequirements,
          timeoutMs: spec.practice.timeoutMs,
        },
      },
      ...(spec.transfer ? [{
        id: `p${spec.id}-transfer`,
        title: { en: 'Transfer to a new situation', pt: 'Transfira para uma situação nova' },
        description: {
          en: `Apply the same idea to a different problem. Complete ${spec.transfer.functionName}. Reusing the previous solution unchanged will not pass.`,
          pt: `Aplique a mesma ideia a outro problema. Complete ${spec.transfer.functionName}. Reaproveitar a solução anterior sem mudanças não passa.`
        },
        starterCode: spec.transfer.starterCode,
        difficulty: 'challenge' as const,
        hints: [
          { en: 'Name what the two problems have in common before writing code.', pt: 'Diga o que os dois problemas têm em comum antes de escrever código.' },
          spec.bestPractice,
        ],
        grading: {
          tests: makeTests(`p${spec.id}-transfer`, spec.transfer),
          codeRequirements: spec.transfer.requirements || [{ kind: 'function', value: spec.transfer.functionName } as CodeRequirement],
          timeoutMs: spec.transfer.timeoutMs,
        },
      }] : []),
    ],
    quiz: [
      {
        id: `p${spec.id}-q1`,
        question: { en: `What is the main purpose of ${spec.concept.en}?`, pt: `Qual é o objetivo principal de ${spec.concept.pt}?` },
        options: [
          spec.quizPurpose,
          ...distractorsFrom(siblings, spec, item => item.quizPurpose, [
            { en: 'Make the file longer without changing behavior', pt: 'Deixar o arquivo maior sem mudar o comportamento' },
            { en: 'Avoid understanding the problem', pt: 'Evitar entender o problema' },
            { en: 'Replace tests with visual inspection', pt: 'Substituir testes por inspeção visual' },
          ]),
        ],
        correctIndex: 0,
        explanation: spec.why,
      },
      {
        id: `p${spec.id}-q2`,
        question: { en: 'Which choice reflects professional practice?', pt: 'Qual escolha representa prática profissional?' },
        options: [
          spec.quizBestPractice,
          ...distractorsFrom(siblings, spec, item => item.quizBestPractice, [
            { en: 'Copy a result that only works for the example', pt: 'Copiar um resultado que só funciona no exemplo' },
            { en: 'Ignore errors until production', pt: 'Ignorar erros até produção' },
            { en: 'Use unclear names to type less', pt: 'Usar nomes confusos para digitar menos' },
          ]),
        ],
        correctIndex: 0,
        explanation: spec.bestPractice,
      },
      {
        id: `p${spec.id}-q3`,
        question: { en: 'What should you avoid?', pt: 'O que deve ser evitado?' },
        options: [
          spec.quizAvoid,
          ...distractorsFrom(siblings, spec, item => item.quizAvoid, [
            { en: 'Testing more than one input', pt: 'Testar mais de uma entrada' },
            { en: 'Reading documentation', pt: 'Ler documentação' },
            { en: 'Explaining a design decision', pt: 'Explicar uma decisão de design' },
          ]),
        ],
        correctIndex: 0,
        explanation: spec.commonMistake,
      },
    ],
    exam: {
      title: { en: `${spec.title.en} applied challenge`, pt: `Desafio aplicado: ${spec.title.pt}` },
      scenario: {
        en: `You are improving a real Python project. Implement ${spec.exam.functionName} with behavior that remains correct for new data, not only the visible example.`,
        pt: `Você está melhorando um projeto Python real. Implemente ${spec.exam.functionName} com comportamento correto para novos dados, não apenas para o exemplo visível.`
      },
      requirements: {
        en: [
          `Implement ${spec.exam.functionName} using the concept from this phase.`,
          'Return data instead of printing a fixed answer.',
          'Handle the edge cases implied by the function contract.',
          'Keep the solution readable enough to explain in a code review.',
        ],
        pt: [
          `Implemente ${spec.exam.functionName} usando o conceito desta fase.`,
          'Retorne dados em vez de imprimir uma resposta fixa.',
          'Trate os casos extremos implícitos no contrato da função.',
          'Mantenha a solução legível para explicá-la em uma revisão de código.',
        ],
      },
      starterCode: spec.exam.starterCode,
      testCases: makeTests(`p${spec.id}-exam`, { ...spec.exam, requirements: examRequirements }),
    },
  }
}

export function createConceptPhases(specs: ConceptPhaseSpec[]): Phase[] {
  return specs.map(spec => createConceptPhase(spec, specs))
}
