import type { Bilingual, LessonBlock, Phase } from '../data/types'

export type LessonUnitKind =
  | 'challenge'
  | 'intuition'
  | 'decomposition'
  | 'flow'
  | 'pseudocode'
  | 'python'
  | 'walkthrough'
  | 'debug'
  | 'practice'
  | 'transfer'

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

interface PhaseBlueprint {
  situation: Bilingual
  humanReasoning: Bilingual
  decomposition: Bilingual
  flow: Bilingual
  pseudocode: Bilingual
  expertLens: Bilingual
  likelyFailure: Bilingual
  transferPrompt: Bilingual
}

const text = (en: string, pt: string): LessonBlock => ({ type: 'text', content: { en, pt } })
const heading = (en: string, pt: string): LessonBlock => ({ type: 'heading', content: { en, pt } })
const tip = (en: string, pt: string): LessonBlock => ({ type: 'tip', content: { en, pt } })
const warning = (en: string, pt: string): LessonBlock => ({ type: 'warning', content: { en, pt } })

const FOUNDATION_BLUEPRINTS: Record<number, PhaseBlueprint> = {
  0: {
    situation: { en: 'You have never programmed before. Your first job is not to memorize commands; it is to understand that a program is a sequence of precise instructions.', pt: 'Você nunca programou antes. Seu primeiro trabalho não é decorar comandos; é entender que um programa é uma sequência de instruções precisas.' },
    humanReasoning: { en: 'When giving directions to another person, vague steps may still work. A computer cannot guess. Every action and value must be explicit.', pt: 'Ao orientar outra pessoa, passos vagos talvez funcionem. Um computador não adivinha. Cada ação e cada valor precisam estar explícitos.' },
    decomposition: { en: 'Choose one tiny result, identify what must happen before it, and order the instructions from first to last.', pt: 'Escolha um resultado pequeno, identifique o que precisa acontecer antes dele e ordene as instruções do primeiro ao último passo.' },
    flow: { en: 'START → instruction → visible result → END', pt: 'INÍCIO → instrução → resultado visível → FIM' },
    pseudocode: { en: 'SHOW a message\nEND', pt: 'MOSTRAR uma mensagem\nFIM' },
    expertLens: { en: 'An experienced developer reduces uncertainty before typing. They ask what the program must do and how they will know it worked.', pt: 'Um desenvolvedor experiente reduz a incerteza antes de digitar. Ele pergunta o que o programa precisa fazer e como saberá que funcionou.' },
    likelyFailure: { en: 'Typing characters without understanding the instruction boundary, then changing several things at once.', pt: 'Digitar caracteres sem entender onde a instrução começa e termina e depois alterar várias coisas ao mesmo tempo.' },
    transferPrompt: { en: 'Describe another daily task that could be written as exact instructions.', pt: 'Descreva outra tarefa diária que poderia ser escrita como instruções exatas.' },
  },
  1: {
    situation: { en: 'A program must remember information such as a name, quantity, price, or status while it runs.', pt: 'Um programa precisa lembrar informações como nome, quantidade, preço ou status enquanto executa.' },
    humanReasoning: { en: 'Humans label information mentally. In a program, a variable is the label attached to a value.', pt: 'Pessoas rotulam informações mentalmente. Em um programa, uma variável é o rótulo ligado a um valor.' },
    decomposition: { en: 'Identify the value, choose a meaningful name, store the value, then use the name instead of repeating the raw value.', pt: 'Identifique o valor, escolha um nome significativo, guarde o valor e use o nome em vez de repetir o valor bruto.' },
    flow: { en: 'value → named variable → operation or display', pt: 'valor → variável com nome → operação ou exibição' },
    pseudocode: { en: 'STORE the value using a meaningful name\nUSE the stored value\nSHOW the result', pt: 'GUARDAR o valor usando um nome significativo\nUSAR o valor guardado\nMOSTRAR o resultado' },
    expertLens: { en: 'A good name explains meaning. It should answer “what does this value represent?” without needing a comment.', pt: 'Um bom nome explica significado. Ele deve responder “o que este valor representa?” sem depender de comentário.' },
    likelyFailure: { en: 'Using a variable before creating it, or replacing its value when the intention was to update it.', pt: 'Usar uma variável antes de criá-la ou substituir o valor quando a intenção era atualizá-lo.' },
    transferPrompt: { en: 'Choose information from a real form and decide which variables would store it.', pt: 'Escolha informações de um formulário real e decida quais variáveis as guardariam.' },
  },
  2: {
    situation: { en: 'A program receives text and numbers from a person and must turn that raw input into useful data.', pt: 'Um programa recebe textos e números de uma pessoa e precisa transformar essa entrada bruta em dados úteis.' },
    humanReasoning: { en: 'A person understands that “25” may mean a number. Python receives input as text, so the program must decide when conversion is necessary.', pt: 'Uma pessoa entende que “25” pode ser um número. Python recebe input como texto, então o programa precisa decidir quando converter.' },
    decomposition: { en: 'Ask for one value, inspect what type is needed, convert only when necessary, then use the converted value.', pt: 'Peça um valor, identifique qual tipo é necessário, converta apenas quando preciso e use o valor convertido.' },
    flow: { en: 'user input → text → optional conversion → calculation → output', pt: 'entrada do usuário → texto → conversão opcional → cálculo → saída' },
    pseudocode: { en: 'ASK for the value\nCONVERT it to the required type\nUSE it\nSHOW the result', pt: 'PEDIR o valor\nCONVERTER para o tipo necessário\nUSAR o valor\nMOSTRAR o resultado' },
    expertLens: { en: 'Never convert by habit. Decide the type from the operation the program must perform.', pt: 'Nunca converta por hábito. Decida o tipo a partir da operação que o programa precisa realizar.' },
    likelyFailure: { en: 'Trying to add text to a number or trusting user input without checking what arrived.', pt: 'Tentar somar texto com número ou confiar na entrada sem verificar o que chegou.' },
    transferPrompt: { en: 'Describe a form field that should remain text and another that must become a number.', pt: 'Descreva um campo de formulário que deve continuar texto e outro que precisa virar número.' },
  },
  3: {
    situation: { en: 'A program often needs to calculate, compare, or combine values to produce a decision or result.', pt: 'Um programa frequentemente precisa calcular, comparar ou combinar valores para produzir uma decisão ou resultado.' },
    humanReasoning: { en: 'Operators express relationships: add, subtract, compare, combine conditions, or update an existing value.', pt: 'Operadores expressam relações: somar, subtrair, comparar, combinar condições ou atualizar um valor existente.' },
    decomposition: { en: 'Write the rule in words, identify the operands, choose the operator that matches the rule, then verify precedence.', pt: 'Escreva a regra em palavras, identifique os operandos, escolha o operador correspondente e verifique a precedência.' },
    flow: { en: 'values → operator → result → validation', pt: 'valores → operador → resultado → validação' },
    pseudocode: { en: 'GET the values\nAPPLY the stated rule\nSTORE the result\nCHECK whether it makes sense', pt: 'OBTER os valores\nAPLICAR a regra informada\nGUARDAR o resultado\nVERIFICAR se faz sentido' },
    expertLens: { en: 'Experienced developers make precedence obvious with small expressions and parentheses when ambiguity is possible.', pt: 'Desenvolvedores experientes deixam a precedência óbvia com expressões pequenas e parênteses quando houver ambiguidade.' },
    likelyFailure: { en: 'Choosing an operator because it looks familiar instead of matching it to the business rule.', pt: 'Escolher um operador por parecer familiar, em vez de relacioná-lo à regra do problema.' },
    transferPrompt: { en: 'Turn a discount or deductible rule into a plain-language expression.', pt: 'Transforme uma regra de desconto ou franquia em uma expressão escrita em linguagem comum.' },
  },
  4: {
    situation: { en: 'The program must choose different actions depending on facts such as age, value, status, or availability.', pt: 'O programa precisa escolher ações diferentes dependendo de fatos como idade, valor, status ou disponibilidade.' },
    humanReasoning: { en: 'A decision has a question, possible answers, and one action for each relevant answer.', pt: 'Uma decisão tem uma pergunta, respostas possíveis e uma ação para cada resposta relevante.' },
    decomposition: { en: 'Write the decision as a yes/no question, define the true path, define the false path, then cover boundary values.', pt: 'Escreva a decisão como uma pergunta de sim/não, defina o caminho verdadeiro, o falso e cubra os valores de limite.' },
    flow: { en: 'condition? → YES: action A | NO: action B → continue', pt: 'condição? → SIM: ação A | NÃO: ação B → continuar' },
    pseudocode: { en: 'IF the condition is true\n  DO the first action\nOTHERWISE\n  DO the alternative action', pt: 'SE a condição for verdadeira\n  FAZER a primeira ação\nSENÃO\n  FAZER a ação alternativa' },
    expertLens: { en: 'The hardest part is usually not writing if. It is defining the condition precisely and testing the boundary.', pt: 'A parte mais difícil normalmente não é escrever if. É definir a condição com precisão e testar o limite.' },
    likelyFailure: { en: 'Using greater-than when the rule includes equality, or leaving a possible path undefined.', pt: 'Usar maior que quando a regra inclui igualdade ou deixar um caminho possível sem definição.' },
    transferPrompt: { en: 'Create a decision rule with one important boundary value and explain both outcomes.', pt: 'Crie uma regra de decisão com um valor de limite importante e explique os dois resultados.' },
  },
}

function genericBlueprint(phase: Phase): PhaseBlueprint {
  const concept = phase.title
  return {
    situation: {
      en: `${phase.description.en} Treat this as a problem to reason about, not a code shape to memorize.`,
      pt: `${phase.description.pt} Trate isso como um problema para raciocinar, não como um formato de código para decorar.`,
    },
    humanReasoning: {
      en: `Before Python, describe what a person would need to know and do to solve a problem involving ${concept.en}.`,
      pt: `Antes do Python, descreva o que uma pessoa precisaria saber e fazer para resolver um problema envolvendo ${concept.pt}.`,
    },
    decomposition: {
      en: 'Separate the problem into inputs, state to store, rules, decisions or repetitions, output, and stopping condition.',
      pt: 'Separe o problema em entradas, estado a guardar, regras, decisões ou repetições, saída e condição de parada.',
    },
    flow: { en: 'INPUT → STORE → PROCESS → DECIDE/REPEAT → OUTPUT', pt: 'ENTRADA → GUARDAR → PROCESSAR → DECIDIR/REPETIR → SAÍDA' },
    pseudocode: { en: 'RECEIVE the required data\nAPPLY one rule at a time\nVERIFY the result\nRETURN or SHOW the result', pt: 'RECEBER os dados necessários\nAPLICAR uma regra por vez\nVERIFICAR o resultado\nRETORNAR ou MOSTRAR o resultado' },
    expertLens: {
      en: 'An experienced developer makes the data flow and contract clear before choosing syntax or libraries.',
      pt: 'Um desenvolvedor experiente deixa claros o fluxo de dados e o contrato antes de escolher sintaxe ou bibliotecas.',
    },
    likelyFailure: {
      en: 'Starting with syntax before the problem, then patching the code until one example happens to work.',
      pt: 'Começar pela sintaxe antes do problema e remendar o código até que um exemplo funcione por acaso.',
    },
    transferPrompt: {
      en: `Invent a different problem where ${concept.en} would be useful and explain why.`,
      pt: `Invente outro problema em que ${concept.pt} seria útil e explique por quê.`,
    },
  }
}

function authoredText(blocks: LessonBlock[]) {
  return blocks.filter(block => block.type !== 'code')
}

function authoredCode(blocks: LessonBlock[]) {
  return blocks.filter(block => block.type === 'code')
}

function authoredWarnings(blocks: LessonBlock[]) {
  return blocks.filter(block => block.type === 'warning' || block.type === 'tip')
}

/** Learning Engine V2.1: every phase follows the same reasoning-first contract.
 * Foundation phases 0–4 have hand-authored blueprints; later phases use the
 * same engine with their existing authored content until their dedicated migration.
 */
export function getPedagogicalJourney(phase: Phase): LessonUnit[] {
  const blueprint = FOUNDATION_BLUEPRINTS[phase.id] || genericBlueprint(phase)
  const blocks = phase.lesson.blocks
  const sourceText = authoredText(blocks)
  const sourceCode = authoredCode(blocks)
  const warnings = authoredWarnings(blocks)
  const concept = phase.title

  return [
    {
      id: 'challenge', kind: 'challenge', icon: '🎯',
      title: { en: '1. The challenge', pt: '1. O desafio' },
      purpose: { en: 'Know what must be solved before seeing a solution.', pt: 'Entenda o que precisa ser resolvido antes de ver uma solução.' },
      blocks: [
        heading('Do not start with code', 'Não comece pelo código'),
        text(blueprint.situation.en, blueprint.situation.pt),
        tip('Your first answer may be incomplete. The goal is to expose your current model before the lesson changes it.', 'Sua primeira resposta pode estar incompleta. O objetivo é revelar seu modelo atual antes que a aula o transforme.'),
      ],
      checkpoint: { en: 'What exactly must the program accomplish? State the result without mentioning Python commands.', pt: 'O que exatamente o programa precisa realizar? Declare o resultado sem mencionar comandos de Python.' },
      checkpointPlaceholder: { en: 'The program must receive..., apply..., and produce...', pt: 'O programa precisa receber..., aplicar... e produzir...' },
    },
    {
      id: 'intuition', kind: 'intuition', icon: '🌎',
      title: { en: '2. Human intuition', pt: '2. Intuição humana' },
      purpose: { en: 'Solve the idea as a person before asking a computer to do it.', pt: 'Resolva a ideia como pessoa antes de pedir que o computador faça.' },
      blocks: [
        heading('How would a person solve it?', 'Como uma pessoa resolveria?'),
        text(blueprint.humanReasoning.en, blueprint.humanReasoning.pt),
        ...sourceText.slice(0, Math.max(1, Math.ceil(sourceText.length / 4))),
      ],
      checkpoint: { en: 'Explain how you would solve one example using paper, speech, or a calculator—without code.', pt: 'Explique como resolveria um exemplo usando papel, fala ou calculadora — sem código.' },
      checkpointPlaceholder: { en: 'First I would... Then... I would know I am done when...', pt: 'Primeiro eu... Depois... Eu saberia que terminei quando...' },
    },
    {
      id: 'decomposition', kind: 'decomposition', icon: '🧩',
      title: { en: '3. Break the problem down', pt: '3. Divida o problema' },
      purpose: { en: 'Turn a vague task into small, testable responsibilities.', pt: 'Transforme uma tarefa vaga em responsabilidades pequenas e testáveis.' },
      blocks: [
        heading('A program is built from responsibilities', 'Um programa é construído com responsabilidades'),
        text(blueprint.decomposition.en, blueprint.decomposition.pt),
        text('Ask: What enters? What must be remembered? What rule changes the data? What leaves? What can go wrong?', 'Pergunte: O que entra? O que precisa ser lembrado? Qual regra altera os dados? O que sai? O que pode dar errado?'),
        tip(blueprint.expertLens.en, blueprint.expertLens.pt),
      ],
      checkpoint: { en: 'List the inputs, stored state, rules, output, and one edge case for this problem.', pt: 'Liste as entradas, o estado guardado, as regras, a saída e um caso limite deste problema.' },
      checkpointPlaceholder: { en: 'Inputs: ...\nState: ...\nRules: ...\nOutput: ...\nEdge case: ...', pt: 'Entradas: ...\nEstado: ...\nRegras: ...\nSaída: ...\nCaso limite: ...' },
    },
    {
      id: 'flow', kind: 'flow', icon: '🗺️',
      title: { en: '4. See the data flow', pt: '4. Veja o fluxo dos dados' },
      purpose: { en: 'Follow information through the solution before writing syntax.', pt: 'Acompanhe a informação pela solução antes de escrever sintaxe.' },
      blocks: [
        heading('The route taken by the data', 'O caminho percorrido pelos dados'),
        text(blueprint.flow.en, blueprint.flow.pt),
        text('At each arrow, ask what changed. If nothing changed, ask why that step exists. If something changed, name the old and new state.', 'Em cada seta, pergunte o que mudou. Se nada mudou, pergunte por que o passo existe. Se algo mudou, nomeie o estado anterior e o novo.'),
      ],
      checkpoint: { en: 'Rewrite the flow and describe what changes at each arrow.', pt: 'Reescreva o fluxo e descreva o que muda em cada seta.' },
      checkpointPlaceholder: { en: 'Input → ... because ... → output', pt: 'Entrada → ... porque ... → saída' },
    },
    {
      id: 'pseudocode', kind: 'pseudocode', icon: '✍️',
      title: { en: '5. Write pseudocode', pt: '5. Escreva pseudocódigo' },
      purpose: { en: 'Express the solution precisely without being blocked by Python syntax.', pt: 'Expresse a solução com precisão sem ficar bloqueado pela sintaxe do Python.' },
      blocks: [
        heading('Logic before syntax', 'Lógica antes da sintaxe'),
        text(blueprint.pseudocode.en, blueprint.pseudocode.pt),
        tip('Pseudocode is not fake code to memorize. It is a promise: every step must later have a clear implementation and a way to verify it.', 'Pseudocódigo não é código falso para decorar. É um compromisso: cada passo precisa ter uma implementação clara e uma forma de verificação.'),
      ],
      checkpoint: { en: 'Write your own pseudocode in 3–8 ordered steps. Include decisions or repetition only when the problem requires them.', pt: 'Escreva seu pseudocódigo em 3–8 passos ordenados. Inclua decisões ou repetição somente quando o problema exigir.' },
      checkpointPlaceholder: { en: 'RECEIVE...\nSTORE...\nIF/WHILE...\nSHOW...', pt: 'RECEBER...\nGUARDAR...\nSE/ENQUANTO...\nMOSTRAR...' },
    },
    {
      id: 'python', kind: 'python', icon: '🐍',
      title: { en: '6. Translate into Python', pt: '6. Traduza para Python' },
      purpose: { en: 'Map each reasoning step to Python deliberately.', pt: 'Relacione cada passo do raciocínio ao Python de forma deliberada.' },
      blocks: [
        heading('Now syntax has a reason to exist', 'Agora a sintaxe tem motivo para existir'),
        text('Read the code from top to bottom. For every important line, identify the pseudocode step it implements and the program state before and after it runs.', 'Leia o código de cima para baixo. Para cada linha importante, identifique o passo do pseudocódigo que ela implementa e o estado do programa antes e depois da execução.'),
        ...sourceCode,
        ...sourceText.slice(Math.max(1, Math.ceil(sourceText.length / 4)), Math.max(2, Math.ceil(sourceText.length / 2))),
      ],
      checkpoint: { en: 'Select one line and explain which pseudocode step it implements, what it reads, and what it changes.', pt: 'Escolha uma linha e explique qual passo do pseudocódigo ela implementa, o que lê e o que altera.' },
      checkpointPlaceholder: { en: 'This line implements... It reads... It changes...', pt: 'Esta linha implementa... Ela lê... Ela altera...' },
    },
    {
      id: 'walkthrough', kind: 'walkthrough', icon: '🔍',
      title: { en: '7. Trace it line by line', pt: '7. Acompanhe linha por linha' },
      purpose: { en: 'Build a mental model of execution instead of recognizing code by appearance.', pt: 'Construa um modelo mental da execução, em vez de reconhecer código pela aparência.' },
      blocks: [
        heading('Freeze the program after each step', 'Congele o programa depois de cada passo'),
        text('Create a small trace table. Record the current line, relevant variable values, decision result, and visible output. This is how you turn invisible execution into evidence.', 'Crie uma pequena tabela de rastreamento. Registre a linha atual, os valores relevantes, o resultado da decisão e a saída visível. Assim você transforma execução invisível em evidência.'),
        ...sourceText.slice(Math.max(2, Math.ceil(sourceText.length / 2)), Math.max(3, Math.ceil((sourceText.length * 3) / 4))),
        tip(blueprint.expertLens.en, blueprint.expertLens.pt),
      ],
      checkpoint: { en: 'Trace one example for at least three execution steps. Show how one value changes.', pt: 'Rastreie um exemplo por pelo menos três passos de execução. Mostre como um valor muda.' },
      checkpointPlaceholder: { en: 'Step 1: ...\nStep 2: ...\nStep 3: ...', pt: 'Passo 1: ...\nPasso 2: ...\nPasso 3: ...' },
    },
    {
      id: 'debug', kind: 'debug', icon: '🐞',
      title: { en: '8. Break and debug it', pt: '8. Quebre e depure' },
      purpose: { en: 'Use failures to test and correct the mental model.', pt: 'Use falhas para testar e corrigir o modelo mental.' },
      blocks: [
        heading('A bug is a mismatch between expectation and reality', 'Um bug é a diferença entre expectativa e realidade'),
        text(blueprint.likelyFailure.en, blueprint.likelyFailure.pt),
        ...warnings,
        warning('Change one thing at a time. Predict what the change should affect before running again.', 'Mude uma coisa por vez. Preveja o que a alteração deve afetar antes de executar novamente.'),
      ],
      checkpoint: { en: 'Describe one bug, the observable symptom, your hypothesis, and the smallest test that could confirm it.', pt: 'Descreva um bug, o sintoma observável, sua hipótese e o menor teste capaz de confirmá-la.' },
      checkpointPlaceholder: { en: 'Symptom... Hypothesis... Small test...', pt: 'Sintoma... Hipótese... Teste pequeno...' },
    },
    {
      id: 'practice', kind: 'practice', icon: '🛠️',
      title: { en: '9. Plan deliberate practice', pt: '9. Planeje a prática deliberada' },
      purpose: { en: 'Enter the editor with a plan, not with guesses.', pt: 'Entre no editor com um plano, não com adivinhações.' },
      blocks: [
        heading('The editor is where you test reasoning', 'O editor é onde você testa o raciocínio'),
        text(`This phase has ${phase.exercises.length} exercises. Before each one, restate its contract: inputs, output, rules, edge cases, and evidence of correctness.`, `Esta fase tem ${phase.exercises.length} exercícios. Antes de cada um, reformule o contrato: entradas, saída, regras, casos limite e evidência de correção.`),
        tip('Use a hint only after writing exactly where your reasoning stopped. Copying removes the evidence needed to learn.', 'Use uma dica somente depois de escrever exatamente onde seu raciocínio parou. Copiar remove a evidência necessária para aprender.'),
      ],
      checkpoint: { en: 'Plan the first exercise: contract, approach, first test, and expected result.', pt: 'Planeje o primeiro exercício: contrato, abordagem, primeiro teste e resultado esperado.' },
      checkpointPlaceholder: { en: 'Contract...\nApproach...\nFirst test...\nExpected result...', pt: 'Contrato...\nAbordagem...\nPrimeiro teste...\nResultado esperado...' },
    },
    {
      id: 'transfer', kind: 'transfer', icon: '🚀',
      title: { en: '10. Explain and transfer', pt: '10. Explique e transfira' },
      purpose: { en: 'Prove that the idea can leave the lesson example.', pt: 'Comprove que a ideia consegue sair do exemplo da aula.' },
      blocks: [
        heading('Passing is not mastery', 'Passar não é dominar'),
        text('Mastery means you can rebuild the reasoning without looking, explain why the solution works, reject an unsuitable approach, and adapt the idea to new data or rules.', 'Domínio significa reconstruir o raciocínio sem olhar, explicar por que a solução funciona, rejeitar uma abordagem inadequada e adaptar a ideia a novos dados ou regras.'),
        ...sourceText.slice(Math.max(3, Math.ceil((sourceText.length * 3) / 4))),
        text(blueprint.transferPrompt.en, blueprint.transferPrompt.pt),
      ],
      checkpoint: { en: `Create a different problem involving ${concept.en}. Explain the shared reasoning and what must change.`, pt: `Crie outro problema envolvendo ${concept.pt}. Explique o raciocínio compartilhado e o que precisa mudar.` },
      checkpointPlaceholder: { en: 'New problem...\nSame reasoning...\nWhat changes...', pt: 'Novo problema...\nMesmo raciocínio...\nO que muda...' },
    },
  ]
}

export function lessonReflectionKey(learnerId: string, phaseId: number, unitId: string) {
  return `hp_lesson_reflection_v2_${learnerId}_${phaseId}_${unitId}`
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

export function isFoundationV2Migrated(phaseId: number) {
  return Object.prototype.hasOwnProperty.call(FOUNDATION_BLUEPRINTS, phaseId)
}
