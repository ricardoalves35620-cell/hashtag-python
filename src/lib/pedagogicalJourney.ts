import type { Bilingual, LessonBlock, Phase } from '../data/types'

export type LessonUnitKind = 'intuition' | 'logic' | 'python' | 'debug' | 'practice' | 'mastery'

export interface LessonUnit {
  id: string
  kind: LessonUnitKind
  icon: string
  title: Bilingual
  purpose: Bilingual
  blocks: LessonBlock[]
  checkpoint: Bilingual
  checkpointPlaceholder: Bilingual
}

const text = (en: string, pt: string): LessonBlock => ({ type: 'text', content: { en, pt } })
const heading = (en: string, pt: string): LessonBlock => ({ type: 'heading', content: { en, pt } })
const tip = (en: string, pt: string): LessonBlock => ({ type: 'tip', content: { en, pt } })
const warning = (en: string, pt: string): LessonBlock => ({ type: 'warning', content: { en, pt } })

function select(blocks: LessonBlock[], predicate: (block: LessonBlock) => boolean) {
  return blocks.filter(predicate)
}

function withoutCode(blocks: LessonBlock[]) {
  return blocks.filter(block => block.type !== 'code')
}

function codeBlocks(blocks: LessonBlock[]) {
  return select(blocks, block => block.type === 'code')
}

function warningBlocks(blocks: LessonBlock[]) {
  return select(blocks, block => block.type === 'warning' || block.type === 'tip')
}

/**
 * Turns every existing phase into a multi-lesson learning journey without
 * discarding its authored material. Existing explanations remain the source,
 * while the journey adds the missing reasoning steps around that material.
 */
export function getPedagogicalJourney(phase: Phase): LessonUnit[] {
  const authored = phase.lesson.blocks
  const authoredText = withoutCode(authored)
  const authoredCode = codeBlocks(authored)
  const authoredWarnings = warningBlocks(authored)
  const concept = phase.title

  return [
    {
      id: 'intuition',
      kind: 'intuition',
      icon: '🌎',
      title: { en: '1. Understand the problem', pt: '1. Entenda o problema' },
      purpose: {
        en: `Build an intuitive reason for using ${concept.en} before seeing syntax.`,
        pt: `Construa uma razão intuitiva para usar ${concept.pt} antes de ver sintaxe.`,
      },
      blocks: [
        heading('Start with the real problem', 'Comece pelo problema real'),
        text(
          `Before thinking about Python, describe the job that must be done. ${phase.description.en}`,
          `Antes de pensar em Python, descreva o trabalho que precisa ser feito. ${phase.description.pt}`,
        ),
        text(
          'A programmer does not begin by guessing commands. A programmer first identifies the information available, the result required, and the rule that connects them.',
          'Um programador não começa tentando adivinhar comandos. Primeiro identifica as informações disponíveis, o resultado desejado e a regra que liga uma coisa à outra.',
        ),
        ...authoredText.slice(0, Math.max(2, Math.ceil(authoredText.length / 3))),
      ],
      checkpoint: {
        en: 'Explain the problem in your own words without using Python vocabulary. What information enters, and what result must leave?',
        pt: 'Explique o problema com suas palavras, sem usar vocabulário de Python. Que informação entra e que resultado precisa sair?',
      },
      checkpointPlaceholder: {
        en: 'Example: I receive several values, apply one rule to each, and produce a final total...',
        pt: 'Exemplo: eu recebo vários valores, aplico uma regra em cada um e produzo um total final...',
      },
    },
    {
      id: 'logic',
      kind: 'logic',
      icon: '🧠',
      title: { en: '2. Solve it without code', pt: '2. Resolva sem código' },
      purpose: {
        en: 'Turn the problem into an ordered sequence that a computer can follow.',
        pt: 'Transforme o problema em uma sequência ordenada que um computador consiga seguir.',
      },
      blocks: [
        heading('Think like a programmer', 'Pense como um programador'),
        text(
          'Write the solution as tiny actions. Each action must be unambiguous. If a human could interpret the step in two different ways, the computer will not know what you meant.',
          'Escreva a solução como pequenas ações. Cada ação precisa ser inequívoca. Se uma pessoa puder interpretar o passo de duas maneiras, o computador não saberá o que você quis dizer.',
        ),
        heading('A reusable reasoning checklist', 'Checklist de raciocínio reutilizável'),
        text(
          '1. What data do I already have?\n2. What data must I ask for?\n3. What must be stored?\n4. What decision or repetition is required?\n5. What must be returned or displayed?\n6. When should the process stop?',
          '1. Que dados eu já tenho?\n2. Que dados preciso pedir?\n3. O que precisa ser guardado?\n4. Que decisão ou repetição é necessária?\n5. O que precisa ser retornado ou exibido?\n6. Quando o processo deve terminar?',
        ),
        tip(
          'Use plain language or pseudocode first. Python is the translation step, not the thinking step.',
          'Use linguagem comum ou pseudocódigo primeiro. Python é a etapa de tradução, não a etapa de raciocínio.',
        ),
      ],
      checkpoint: {
        en: 'Write the solution as 3–7 ordered steps in plain language. Do not write Python yet.',
        pt: 'Escreva a solução como 3–7 passos ordenados em linguagem comum. Ainda não escreva Python.',
      },
      checkpointPlaceholder: {
        en: '1. Receive...\n2. Store...\n3. Repeat or decide...\n4. Show...',
        pt: '1. Receber...\n2. Guardar...\n3. Repetir ou decidir...\n4. Mostrar...',
      },
    },
    {
      id: 'python',
      kind: 'python',
      icon: '🐍',
      title: { en: '3. Translate the logic into Python', pt: '3. Traduza a lógica para Python' },
      purpose: {
        en: 'Connect every important line of code to a reasoning step.',
        pt: 'Ligue cada linha importante do código a uma etapa do raciocínio.',
      },
      blocks: [
        heading('From decisions to syntax', 'Das decisões para a sintaxe'),
        text(
          'Now compare the ordered steps with the code. For every line, ask: which step does this implement, what value changes, and why is this line placed here instead of somewhere else?',
          'Agora compare os passos ordenados com o código. Em cada linha, pergunte: qual passo ela implementa, que valor muda e por que esta linha fica aqui em vez de em outro lugar?',
        ),
        ...authoredCode,
        ...authoredText.slice(Math.max(2, Math.ceil(authoredText.length / 3)), Math.max(4, Math.ceil((authoredText.length * 2) / 3))),
        tip(
          'Read code from top to bottom and track the state of each variable. Do not memorize the final shape of the code.',
          'Leia o código de cima para baixo e acompanhe o estado de cada variável. Não memorize apenas o formato final do código.',
        ),
      ],
      checkpoint: {
        en: 'Choose one important line and explain: what must already be true before it runs, what it changes, and what would break if it were removed.',
        pt: 'Escolha uma linha importante e explique: o que precisa ser verdade antes de ela rodar, o que ela muda e o que quebraria se fosse removida.',
      },
      checkpointPlaceholder: {
        en: 'This line exists because... Before it runs... After it runs... Without it...',
        pt: 'Esta linha existe porque... Antes dela rodar... Depois dela rodar... Sem ela...',
      },
    },
    {
      id: 'debug',
      kind: 'debug',
      icon: '🐞',
      title: { en: '4. Break it and debug it', pt: '4. Quebre e depure' },
      purpose: {
        en: 'Learn what failures reveal about the logic instead of fearing errors.',
        pt: 'Aprenda o que as falhas revelam sobre a lógica, em vez de ter medo dos erros.',
      },
      blocks: [
        heading('Errors are evidence', 'Erros são evidências'),
        text(
          'A traceback is not a verdict. It is a report showing where Python could no longer follow your instructions. Read the last line first, find the referenced line, then compare the program state with what you expected.',
          'Um traceback não é uma sentença. É um relatório mostrando onde o Python deixou de conseguir seguir suas instruções. Leia primeiro a última linha, encontre a linha indicada e compare o estado do programa com o que você esperava.',
        ),
        ...authoredWarnings,
        warning(
          'Change one thing at a time. If you change several lines together, you lose the evidence that tells you which change fixed or caused the problem.',
          'Mude uma coisa por vez. Se alterar várias linhas juntas, você perde a evidência que mostra qual mudança corrigiu ou causou o problema.',
        ),
      ],
      checkpoint: {
        en: 'Describe one realistic mistake for this concept, the symptom it creates, and the first place you would inspect.',
        pt: 'Descreva um erro realista neste conceito, o sintoma que ele causa e o primeiro lugar que você verificaria.',
      },
      checkpointPlaceholder: {
        en: 'Mistake... Symptom... First check...',
        pt: 'Erro... Sintoma... Primeira verificação...',
      },
    },
    {
      id: 'practice',
      kind: 'practice',
      icon: '🛠️',
      title: { en: '5. Prepare for deliberate practice', pt: '5. Prepare-se para a prática deliberada' },
      purpose: {
        en: 'Plan before opening the exercise editor, so practice tests reasoning rather than guessing.',
        pt: 'Planeje antes de abrir o editor, para que a prática teste raciocínio em vez de adivinhação.',
      },
      blocks: [
        heading('Your plan before typing', 'Seu plano antes de digitar'),
        text(
          'For the exercises, first identify the contract: inputs, output, rules, exceptional cases, and stopping condition. Then choose names that describe meaning. Only after that should you write Python.',
          'Nos exercícios, primeiro identifique o contrato: entradas, saída, regras, casos excepcionais e condição de parada. Depois escolha nomes que descrevam significado. Só então escreva Python.',
        ),
        text(
          `This phase contains ${phase.exercises.length} exercises. The goal is not to clear them quickly. The goal is to be able to explain the plan before coding and defend the result after the tests run.`,
          `Esta fase contém ${phase.exercises.length} exercícios. O objetivo não é eliminá-los rapidamente. O objetivo é conseguir explicar o plano antes de programar e defender o resultado depois que os testes rodarem.`,
        ),
        tip(
          'Before using a hint, write what you already know and the exact point where your reasoning stops. This turns a hint into learning instead of copying.',
          'Antes de usar uma dica, escreva o que você já sabe e o ponto exato onde seu raciocínio para. Isso transforma a dica em aprendizado, em vez de cópia.',
        ),
      ],
      checkpoint: {
        en: 'Describe your plan for the first exercise: inputs, expected output, rule, and one edge case.',
        pt: 'Descreva seu plano para o primeiro exercício: entradas, saída esperada, regra e um caso limite.',
      },
      checkpointPlaceholder: {
        en: 'Inputs... Output... Rule... Edge case...',
        pt: 'Entradas... Saída... Regra... Caso limite...',
      },
    },
    {
      id: 'mastery',
      kind: 'mastery',
      icon: '🎯',
      title: { en: '6. Explain and transfer', pt: '6. Explique e transfira' },
      purpose: {
        en: 'Prove understanding by applying the same idea in a different situation.',
        pt: 'Comprove entendimento aplicando a mesma ideia em uma situação diferente.',
      },
      blocks: [
        heading('Mastery is transfer', 'Domínio é transferência'),
        text(
          'You understand a concept when you can recognize where it applies, build a solution without copying the lesson, explain your decisions, and adapt the solution when the data or rules change.',
          'Você entende um conceito quando consegue reconhecer onde ele se aplica, construir uma solução sem copiar a aula, explicar suas decisões e adaptar a solução quando os dados ou as regras mudam.',
        ),
        ...authoredText.slice(Math.max(4, Math.ceil((authoredText.length * 2) / 3))),
        heading('Before continuing', 'Antes de continuar'),
        text(
          'Do not continue because the button is available. Continue when you can retell the logic without looking, predict how a small change affects the program, and describe one situation where this concept should not be used.',
          'Não continue porque o botão está disponível. Continue quando conseguir recontar a lógica sem olhar, prever como uma pequena mudança afeta o programa e descrever uma situação em que este conceito não deveria ser usado.',
        ),
      ],
      checkpoint: {
        en: `Invent a different real-world problem where ${concept.en} helps. Explain why it fits and what would be different from the lesson example.`,
        pt: `Invente outro problema real em que ${concept.pt} ajude. Explique por que ele se encaixa e o que seria diferente do exemplo da aula.`,
      },
      checkpointPlaceholder: {
        en: 'A different situation would be... It fits because... I would change...',
        pt: 'Uma situação diferente seria... Ela se encaixa porque... Eu mudaria...',
      },
    },
  ]
}

export function lessonReflectionKey(learnerId: string, phaseId: number, unitId: string) {
  return `hp_lesson_reflection_v1_${learnerId}_${phaseId}_${unitId}`
}

export function loadLessonReflection(learnerId: string, phaseId: number, unitId: string) {
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(lessonReflectionKey(learnerId, phaseId, unitId)) || ''
}

export function saveLessonReflection(learnerId: string, phaseId: number, unitId: string, value: string) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(lessonReflectionKey(learnerId, phaseId, unitId), value)
}

export function completedLessonUnits(learnerId: string, phase: Phase) {
  return getPedagogicalJourney(phase).filter(unit => loadLessonReflection(learnerId, phase.id, unit.id).trim().length >= 12).length
}
