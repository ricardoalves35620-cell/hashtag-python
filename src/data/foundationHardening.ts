import type { Bilingual, Check, CodeRequirement, Exercise, Phase, TestCase } from './types'

const PHASE_REQUIREMENTS: Record<number, CodeRequirement[]> = {
  1: [{ kind: 'call', value: 'print', minCount: 3 }],
  2: [{ kind: 'node', value: 'BinOp', minCount: 2 }],
  3: [{ kind: 'node', value: 'Assign', minCount: 2 }],
  4: [{ kind: 'call', value: 'input' }],
  5: [{ kind: 'node', value: 'If' }],
  6: [{ kind: 'node', value: 'If', minCount: 2 }],
  7: [{ kind: 'node', value: 'While' }],
  8: [{ kind: 'node', value: 'For' }],
  9: [{ kind: 'node', value: 'List' }, { kind: 'node', value: 'For' }],
  10: [{ kind: 'node', value: 'Dict' }],
  11: [{ kind: 'node', value: 'List' }, { kind: 'node', value: 'Dict' }],
  12: [{ kind: 'node', value: 'ListComp' }],
  13: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Return' }],
  14: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Return' }],
  15: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Return' }],
  16: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Return' }],
  17: [{ kind: 'call', value: 'split' }, { kind: 'node', value: 'For' }],
  18: [{ kind: 'call', value: 'open' }],
  19: [{ kind: 'import', value: 'json' }],
  20: [{ kind: 'import', value: 'datetime' }],
  21: [{ kind: 'import', value: 'random' }],
  22: [{ kind: 'import', value: 'math' }],
  23: [{ kind: 'node', value: 'Try' }],
  24: [{ kind: 'node', value: 'FunctionDef' }],
  25: [{ kind: 'node', value: 'FunctionDef' }],
  26: [{ kind: 'node', value: 'For' }],
  27: [{ kind: 'node', value: 'FunctionDef' }, { kind: 'node', value: 'Try' }],
}

const SUGGESTED_INPUTS: Record<string, string[]> = {
  ex4_guided: ['25'],
  ex4_fill: ['Maria', '35', '1.68', '555-1234'],
  ex5_guided: ['8000'],
  ex5_fill: ['8000', '10'],
  ex6_guided: ['15000'],
  ex6_fill: ['24'],
  ex23_zero: ['abc', '5000'],
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values))
}

function meaningfulLines(value: string) {
  return value
    .replace(/\r/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length >= 2 && !line.includes('...') && !line.includes('…'))
}

/** Turns a sample containing {{placeholders}} into a pattern, so the parts the learner
 *  chooses are wildcards and only the fixed parts are enforced. */
function samplePattern(text: string): string {
  return text
    .trim()
    .split(/\{\{[^}]*\}\}/)
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, match => '\\' + match))
    .join('.+')
}

function exerciseChecks(output: Bilingual): Check[] {
  const accepted = unique([output.en.trim(), output.pt.trim()].filter(Boolean))

  // An exercise that invites "any name, any age" must not be graded against one
  // specific name. Marking the varying part in the sample makes it a wildcard here,
  // in the visible contract, and in the output-similarity check alike.
  if (accepted.some(value => value.includes('{{'))) {
    return [
      { type: 'no_error' },
      {
        type: 'matches',
        value: samplePattern(accepted[0]),
        label: {
          en: 'Produces the expected output, with your own values where the sample shows them',
          pt: 'Produz a saída esperada, com os seus valores onde a amostra os indica',
        },
      },
    ]
  }

  // Never demand that the expected text be the ENTIRE output. input() echoes its
  // prompts, a from-scratch exercise writes its own prompts the starter never shows,
  // and a learner may leave a debug print behind. All of those are correct answers
  // that whole-output equality rejects. Requiring the expected block to be PRESENT
  // still catches every wrong value, which is the thing worth catching.
  return [
    { type: 'no_error' },
    {
      type: 'matches',
      value: accepted.map(samplePattern).join('|'),
      label: {
        en: 'Produces the expected result (input prompts may appear before it)',
        pt: 'Produz o resultado esperado (as perguntas do input podem aparecer antes)',
      },
    },
  ]
}

function ensureProgressiveHints(exercise: Exercise, phase: Phase, index: number) {
  const additions: Bilingual[] = [
    {
      en: `Restate the contract: what enters, what must leave, and which ${phase.title.en.toLowerCase()} rule connects them.`,
      pt: `Reescreva o contrato: o que entra, o que precisa sair e qual regra de ${phase.title.pt.toLowerCase()} conecta os dois.`,
    },
    {
      en: 'Test the smallest useful part first. Change one thing, run again, and use the first incorrect line as evidence.',
      pt: 'Teste primeiro a menor parte útil. Mude uma coisa, execute de novo e use a primeira linha incorreta como evidência.',
    },
    {
      en: index === 0
        ? 'Before running, predict one exact value or line. After running, explain why it matched or differed.'
        : 'Compare your result with the visible contract, then invent one different input or edge case before submitting.',
      pt: index === 0
        ? 'Antes de executar, preveja um valor ou linha exata. Depois, explique por que coincidiu ou foi diferente.'
        : 'Compare seu resultado com o contrato visível e invente uma entrada ou caso limite diferente antes de enviar.',
    },
  ]

  for (const hint of additions) {
    if (exercise.hints.length >= 3) break
    if (!exercise.hints.some(existing => existing.en === hint.en || existing.pt === hint.pt)) exercise.hints.push(hint)
  }
}

function ensureExerciseGrading(phase: Phase, exercise: Exercise) {
  if (exercise.grading?.tests?.length || !exercise.sampleOutput) return
  const inputs = exercise.suggestedInputs || SUGGESTED_INPUTS[exercise.id] || []
  const inputCount = (exercise.starterCode.match(/\binput\s*\(/g) || []).length
  if (inputCount > inputs.length) return

  exercise.suggestedInputs ||= inputs.length ? inputs : undefined
  exercise.grading = {
    tests: [{
      id: `${exercise.id}-visible-contract`,
      description: {
        en: 'Produces the complete visible behavior, not only a fragment',
        pt: 'Produz o comportamento visível completo, não apenas um fragmento',
      },
      expectedOutput: exercise.sampleOutput,
      inputs,
      checks: exerciseChecks(exercise.sampleOutput),
      points: 100,
      codeRequirements: PHASE_REQUIREMENTS[phase.id],
    }],
    codeRequirements: PHASE_REQUIREMENTS[phase.id],
    timeoutMs: phase.id === 7 || phase.id === 23 ? 3500 : 2500,
  }
}

interface TransferChallengeSpec {
  functionName: string
  title: Bilingual
  description: Bilingual
  starterCode: string
  publicAfterCode: string
  publicExpected: string
  hiddenAfterCode: string
  hiddenExpected: string
  requirements?: CodeRequirement[]
  setupCode?: string
  hints: Bilingual[]
}

const TRANSFER_CHALLENGES: Record<number, TransferChallengeSpec> = {
  9: {
    functionName: 'approved_total',
    title: { en: 'Transfer: a different nested table', pt: 'Transferência: outra tabela aninhada' },
    description: { en: 'Goal:\nComplete approved_total so that it does the following.\nWrite transpose_grid(grid).\n\nProgram requirements\n\n1. Build the result\n- Rows become columns.\n\n2. Validate\n- Return [] for an empty grid and raise ValueError("ragged grid") when row lengths differ.\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n[[1, 4], [2, 5], [3, 6]]', pt: 'Objetivo:\nComplete approved_total para fazer o seguinte.\nEscreva transpose_grid(grid).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Linhas viram colunas.\n\n2. Validar\n- Retorne [] para grade vazia e gere ValueError("ragged grid") quando os tamanhos das linhas forem diferentes.\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n[[1, 4], [2, 5], [3, 6]]' },
    starterCode: `def approved_total(orders, discount):\n    # Inspect one row, filter by status, accumulate the total.\n    pass`,
    publicAfterCode: `print(approved_total([["Ana", 3200, "approved"], ["Beto", 900, "pending"], ["Caio", 5100, "approved"]], 300))`,
    publicExpected: '7700',
    hiddenAfterCode: `print(approved_total([["Ana", 3200, "pending"], ["Beto", 900, "rejected"]], 300))`,
    hiddenExpected: '0',
    requirements: [{ kind: 'function', value: 'approved_total' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }],
    hints: [
      { en: 'Write the shape of one row before indexing it.', pt: 'Escreva o formato de uma linha antes de acessar posições.' },
      { en: 'Initialize the total before the loop and update it only for approved rows.', pt: 'Inicialize o total antes do loop e atualize apenas nas linhas aprovadas.' },
      { en: 'An empty match should naturally leave the accumulator at zero.', pt: 'Nenhuma correspondência deve naturalmente deixar o acumulador em zero.' },
    ],
  },
  10: {
    functionName: 'order_total',
    title: { en: 'Transfer: enforce a dictionary contract', pt: 'Transferência: aplique um contrato de dicionário' },
    description: { en: 'Goal:\nComplete order_total so that it does the following.\nWrite merge_settings(base, changes, allowed).\n\nProgram requirements\n\n1. Build the result\n- Return a copied dictionary with only allowed keys applied.\n\n2. Validate\n- Raise ValueError("unknown setting") when changes contains any key outside allowed.\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n{\'language\': \'pt\', \'theme\': \'dark\'}', pt: 'Objetivo:\nComplete order_total para fazer o seguinte.\nEscreva merge_settings(base, changes, allowed).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Retorne uma cópia com apenas chaves permitidas aplicadas.\n\n2. Validar\n- Gere ValueError("unknown setting") quando changes contiver chave fora de allowed.\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n{\'language\': \'pt\', \'theme\': \'dark\'}' },
    starterCode: `def order_total(order):\n    # Required keys: amount and discount.\n    pass`,
    publicAfterCode: `print(order_total({"amount": 4800, "discount": 300}))`,
    publicExpected: '4500',
    hiddenAfterCode: `print(order_total({"amount": 200, "discount": 500}))`,
    hiddenExpected: '0',
    requirements: [{ kind: 'function', value: 'order_total' }],
    hints: [
      { en: 'Read values by key, not by numeric position.', pt: 'Leia valores pela chave, não por posição numérica.' },
      { en: 'Calculate amount minus discount once and give that result a name.', pt: 'Calcule dano menos desconto uma vez e dê um nome ao resultado.' },
      { en: 'max(result, 0) is one clear way to protect the lower boundary.', pt: 'max(resultado, 0) é uma forma clara de proteger o limite inferior.' },
    ],
  },
  11: {
    functionName: 'approved_members',
    title: { en: 'Transfer: select records from a collection', pt: 'Transferência: selecione registros de uma coleção' },
    description: { en: 'Goal:\nComplete approved_members so that it does the following.\nWrite group_titles_by_category(items).\n\nProgram requirements\n\n1. Build the result\n- Return a dictionary whose keys are categories in first-seen order and values are title lists in input order.\n\n2. Validate\n- Required keys are category and title.\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n{\'game\': [\'Portal\', \'Celeste\'], \'movie\': [\'Coco\']}', pt: 'Objetivo:\nComplete approved_members para fazer o seguinte.\nEscreva group_titles_by_category(items).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Retorne um dicionário cujas chaves são categorias na ordem da primeira aparição e valores são listas de títulos na ordem de entrada.\n\n2. Validar\n- As chaves obrigatórias são category e title.\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n{\'game\': [\'Portal\', \'Celeste\'], \'movie\': [\'Coco\']}' },
    starterCode: `def approved_members(orders):\n    names = []\n    # Inspect each record and append only approved client names.\n    return names`,
    publicAfterCode: `print(approved_members([{"client":"Ana","status":"approved"},{"client":"Beto","status":"pending"},{"client":"Carla","status":"approved"}]))`,
    publicExpected: "['Ana', 'Carla']",
    hiddenAfterCode: `print(approved_members([{"client":"Davi","status":"rejected"}]))`,
    hiddenExpected: '[]',
    requirements: [{ kind: 'function', value: 'approved_members' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }],
    hints: [
      { en: 'The loop variable is one dictionary, not the entire list.', pt: 'A variável do loop é um dicionário, não a lista inteira.' },
      { en: 'Check the status before appending the client.', pt: 'Verifique o status antes de adicionar o cliente.' },
      { en: 'Return the accumulated list after the loop ends.', pt: 'Retorne a lista acumulada depois que o loop terminar.' },
    ],
  },
  12: {
    functionName: 'high_values',
    title: { en: 'Transfer: derive a new list', pt: 'Transferência: derive uma nova lista' },
    description: { en: 'Goal:\nComplete high_values so that it does the following.\nWrite positive_cells(grid).\n\nProgram requirements\n\n1. Build the result\n- Use one nested list comprehension to flatten the grid.\n- Return only values greater than zero.\n\n2. Validate\n- Every cell must be int or float.\n- Otherwise raise ValueError("non-numeric cell").\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n[1, 3, 5]', pt: 'Objetivo:\nComplete high_values para fazer o seguinte.\nEscreva positive_cells(grid).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Use uma compreensão aninhada para achatar a grade e retornar apenas valores maiores que zero.\n\n2. Validar\n- Toda célula deve ser int ou float; caso contrário gere ValueError("non-numeric cell").\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n[1, 3, 5]' },
    starterCode: `def high_values(values, threshold):\n    # Build and return one list comprehension.\n    pass`,
    publicAfterCode: `print(high_values([1200, 8000, 4500, 9200], 5000))`,
    publicExpected: '[8000, 9200]',
    hiddenAfterCode: `print(high_values([1, 2, 3], 10))`,
    hiddenExpected: '[]',
    requirements: [{ kind: 'function', value: 'high_values' }, { kind: 'node', value: 'ListComp' }],
    hints: [
      { en: 'Start from the equivalent for loop: inspect one value, keep it only if the condition is true.', pt: 'Comece pelo for equivalente: inspecione um valor e mantenha apenas quando a condição for verdadeira.' },
      { en: 'The expression comes first; the for clause comes next; the optional if comes last.', pt: 'A expressão vem primeiro; o for vem depois; o if opcional vem por último.' },
      { en: 'Use >, not >=, because the contract says strictly above.', pt: 'Use >, não >=, porque o contrato diz estritamente acima.' },
    ],
  },
  13: {
    functionName: 'net_total',
    title: { en: 'Transfer: one function, one responsibility', pt: 'Transferência: uma função, uma responsabilidade' },
    description: { en: 'Goal:\nComplete net_total so that it does the following.\nWrite net_hours(entries) and workload_label(hours). net_hours receives [planned, blocked] pairs, rejects negative values and returns total planned minus blocked. workload_label returns "light", "balanced" or "heavy" for totals below 20, through 40, or above 40.\n\nProgram requirements\n\n1. Build the result\n- Follow the function contract stated in the goal.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n36\nbalanced', pt: 'Objetivo:\nComplete net_total para fazer o seguinte.\nEscreva net_hours(entries) e workload_label(hours). net_hours recebe pares [planejado, bloqueado], rejeita negativos e retorna o total planejado menos o bloqueado. workload_label retorna "light", "balanced" ou "heavy" para totais abaixo de 20, até 40 ou acima de 40.\n\nRequisitos do programa\n\n1. Montar o resultado\n- Siga o contrato da função apresentado no objetivo.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n36\nbalanced' },
    starterCode: `def net_total(amount, discount):\n    # Return a value; do not print a fixed example.\n    pass`,
    publicAfterCode: `print(net_total(5230, 250))`,
    publicExpected: '4980',
    hiddenAfterCode: `print(net_total(200, 500))`,
    hiddenExpected: '0',
    hints: [
      { en: 'The function contract has two inputs and one numeric return value.', pt: 'O contrato da função tem duas entradas e um retorno numérico.' },
      { en: 'Compute the rule inside the function instead of printing the sample answer.', pt: 'Calcule a regra dentro da função em vez de imprimir a resposta do exemplo.' },
      { en: 'Test a discount larger than the amount.', pt: 'Teste uma desconto maior que o dano.' },
    ],
  },
  14: {
    functionName: 'service_fee',
    title: { en: 'Transfer: defaults and named arguments', pt: 'Transferência: padrões e argumentos nomeados' },
    description: { en: 'Goal:\nComplete service_fee so that it does the following.\nWrite export_name(base, extension="csv", *, compressed=False).\n\nProgram requirements\n\n1. Build the result\n- Strip base.\n- Return base.extension or base.extension.gz.\n\n2. Validate\n- Reject an empty base or unsupported extension.\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\nreport.csv.gz', pt: 'Objetivo:\nComplete service_fee para fazer o seguinte.\nEscreva export_name(base, extension="csv", *, compressed=False).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Limpe base.\n- Retorne base.extension ou base.extension.gz.\n\n2. Validar\n- Rejeite base vazio ou extensão não suportada.\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\nreport.csv.gz' },
    starterCode: `def service_fee(amount, rate=0.05):\n    pass`,
    publicAfterCode: `print(service_fee(1000))`,
    publicExpected: '50.0',
    hiddenAfterCode: `print(service_fee(200, rate=0.10))`,
    hiddenExpected: '20.0',
    hints: [
      { en: 'Place the required parameter before the parameter with a default.', pt: 'Coloque o parâmetro obrigatório antes do parâmetro com valor padrão.' },
      { en: 'Return amount multiplied by rate.', pt: 'Retorne valor multiplicado pela taxa.' },
      { en: 'Call the hidden variation mentally with rate=0.10.', pt: 'Simule mentalmente a variação com rate=0.10.' },
    ],
  },
  15: {
    functionName: 'classify_amount',
    title: { en: 'Transfer: document the promise', pt: 'Transferência: documente a promessa' },
    description: { en: 'Goal:\nComplete classify_amount so that it does the following.\nWrite format_distance(km) with a docstring containing the exact example line format_distance(1.5) and return values like "1.50 km".\n\nProgram requirements\n\n1. Validate\n- Reject negative km.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\nTrue\n1.50 km', pt: 'Objetivo:\nComplete classify_amount para fazer o seguinte.\nEscreva format_distance(km) com docstring contendo a linha exata format_distance(1.5) e retorne valores como "1.50 km".\n\nRequisitos do programa\n\n1. Validar\n- Rejeite km negativo.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\nTrue\n1.50 km' },
    starterCode: `def classify_amount(amount):\n    \"\"\"TODO: explain the argument and returned category.\"\"\"\n    pass`,
    publicAfterCode: `print(classify_amount(7000))`,
    publicExpected: 'Urgent',
    hiddenAfterCode: `print(classify_amount(10001))`,
    hiddenExpected: 'Critical',
    hints: [
      { en: 'Define the category boundaries before writing branches.', pt: 'Defina os limites das categorias antes de escrever os caminhos.' },
      { en: 'Check the highest category first.', pt: 'Verifique primeiro a categoria mais alta.' },
      { en: 'The docstring explains what amount means and which string is returned.', pt: 'A docstring explica o que amount significa e qual texto é retornado.' },
    ],
  },
  16: {
    functionName: 'accumulate_totals',
    title: { en: 'Transfer: explicit state instead of globals', pt: 'Transferência: estado explícito em vez de globais' },
    description: { en: 'Goal:\nComplete accumulate_totals so that it does the following.\nWrite make_prefix(prefix).\n\nProgram requirements\n\n1. Build the result\n- Strip prefix.\n- Return an inner function label(value) that returns "prefix: value".\n\n2. Validate\n- Reject an empty value.\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\nINFO: started', pt: 'Objetivo:\nComplete accumulate_totals para fazer o seguinte.\nEscreva make_prefix(prefix).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Limpe prefix.\n- Retorne função interna label(value) que devolve "prefix: value".\n\n2. Validar\n- Rejeite vazio.\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\nINFO: started' },
    starterCode: `def accumulate_totals(orders):\n    total = 0\n    # Each item is (amount, discount).\n    return total`,
    publicAfterCode: `print(accumulate_totals([(1000, 100), (500, 50)]))`,
    publicExpected: '1350',
    hiddenAfterCode: `print(accumulate_totals([]))`,
    hiddenExpected: '0',
    requirements: [{ kind: 'function', value: 'accumulate_totals' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'Return' }],
    hints: [
      { en: 'Initialize total inside the function.', pt: 'Inicialize total dentro da função.' },
      { en: 'For each pair, add amount minus discount.', pt: 'Para cada par, some dano menos desconto.' },
      { en: 'An empty list should return the initial total.', pt: 'Uma lista vazia deve retornar o total inicial.' },
    ],
  },
  17: {
    functionName: 'approved_csv_total',
    title: { en: 'Transfer: parse unfamiliar CSV rows', pt: 'Transferência: interprete outras linhas CSV' },
    description: { en: 'Goal:\nComplete approved_csv_total so that it does the following.\nCreate load_tasks(path).\n\nProgram requirements\n\n1. Build the result\n- Return dictionaries sorted by priority then title.\n\n2. Validate\n- Each non-empty line is title;priority.\n- Priority must be an integer from 1 to 5.\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n[{\'title\': \'Deploy\', \'priority\': 1}, {\'title\': \'Revisão\', \'priority\': 2}]', pt: 'Objetivo:\nComplete approved_csv_total para fazer o seguinte.\nCrie load_tasks(path).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Retorne dicionários ordenados por prioridade e título.\n\n2. Validar\n- Cada linha não vazia é title;priority.\n- Prioridade deve ser inteiro de 1 a 5.\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n[{\'title\': \'Deploy\', \'priority\': 1}, {\'title\': \'Revisão\', \'priority\': 2}]' },
    starterCode: `def approved_csv_total(lines, discount=250):\n    total = 0\n    # Format: id,client,amount,status\n    return total`,
    publicAfterCode: `print(approved_csv_total(["1,Ana,1000,approved", "2,Beto,500,pending", "3,Caio,2000,approved"]))`,
    publicExpected: '2500',
    hiddenAfterCode: `print(approved_csv_total(["1,Ana,1000,rejected"]))`,
    hiddenExpected: '0',
    requirements: [{ kind: 'function', value: 'approved_csv_total' }, { kind: 'call', value: 'split' }, { kind: 'node', value: 'For' }],
    hints: [
      { en: 'Write down the index of id, client, amount, and status.', pt: 'Anote o índice de id, cliente, dano e status.' },
      { en: 'Convert the amount field before subtracting.', pt: 'Converta o campo de dano antes de subtrair.' },
      { en: 'Only approved rows update the accumulator.', pt: 'Somente linhas aprovadas atualizam o acumulador.' },
    ],
  },
  18: {
    functionName: 'write_order_report',
    title: { en: 'Transfer: write and verify a file', pt: 'Transferência: escreva e verifique um arquivo' },
    description: { en: 'Goal:\nComplete write_order_report so that it does the following.\nCreate atomic_save(path, text).\n\nProgram requirements\n\n1. Build the result\n- Write the UTF-8 text to a temporary path ending in .tmp.\n- Then replace the destination atomically.\n- Return the final UTF-8 byte length.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n9\nnew state\nFalse', pt: 'Objetivo:\nComplete write_order_report para fazer o seguinte.\nCrie atomic_save(path, text).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Grave o texto UTF-8 em um caminho temporário terminado em .tmp e depois substitua o destino de forma atômica.\n- Retorne tamanho final em bytes UTF-8.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n9\nnew state\nFalse' },
    starterCode: `def write_order_report(path, orders):\n    # Each order is (id, client, amount).\n    pass`,
    setupCode: `audit_path = "/tmp/hp_order_report.csv"`,
    publicAfterCode: `count = write_order_report(audit_path, [(1, "Ana", 1000), (2, "Beto", 500)])\nprint(count)\nprint(open(audit_path).read())`,
    publicExpected: '2\nid,client,amount\n1,Ana,1000\n2,Beto,500',
    hiddenAfterCode: `count = write_order_report(audit_path, [])\nprint(count)\nprint(open(audit_path).read())`,
    hiddenExpected: '0\nid,client,amount',
    requirements: [{ kind: 'function', value: 'write_order_report' }, { kind: 'call', value: 'open' }, { kind: 'node', value: 'With' }],
    hints: [
      { en: 'Open the path in write mode with a with block.', pt: 'Abra o caminho em modo de escrita usando with.' },
      { en: 'Write the header before iterating over orders.', pt: 'Escreva o cabeçalho antes de percorrer os pedidos.' },
      { en: 'Return len(orders) after the file has been written.', pt: 'Retorne len(orders) depois de gravar o arquivo.' },
    ],
  },
  19: {
    functionName: 'decode_order',
    title: { en: 'Transfer: validate decoded JSON', pt: 'Transferência: valide JSON decodificado' },
    description: { en: 'Goal:\nComplete decode_order so that it does the following.\nCreate update_json_file(path, key, value).\n\nProgram requirements\n\n1. Build the result\n- Load a JSON object, set the key, write deterministic UTF-8 JSON back.\n- Return the number of keys.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n2\n{"language":"pt-BR","theme":"dark"}', pt: 'Objetivo:\nComplete decode_order para fazer o seguinte.\nCrie update_json_file(path, key, value).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Carregue objeto JSON, defina a chave, grave JSON UTF-8 determinístico.\n- Retorne número de chaves.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n2\n{"language":"pt-BR","theme":"dark"}' },
    starterCode: `import json\n\ndef decode_order(raw):\n    pass`,
    publicAfterCode: `print(decode_order('{"amount": 5000, "discount": 250}'))`,
    publicExpected: '4750',
    hiddenAfterCode: `try:\n    decode_order('{"amount": 5000}')\nexcept ValueError:\n    print("invalid contract")`,
    hiddenExpected: 'invalid contract',
    requirements: [{ kind: 'function', value: 'decode_order' }, { kind: 'import', value: 'json' }],
    hints: [
      { en: 'Use json.loads to obtain a dictionary.', pt: 'Use json.loads para obter um dicionário.' },
      { en: 'Check required keys before calculating.', pt: 'Verifique as chaves obrigatórias antes de calcular.' },
      { en: 'Raise ValueError when the decoded record breaks the contract.', pt: 'Lance ValueError quando o registro quebrar o contrato.' },
    ],
  },
  20: {
    functionName: 'days_open',
    title: { en: 'Transfer: calculate elapsed days', pt: 'Transferência: calcule dias decorridos' },
    description: { en: 'Goal:\nComplete days_open so that it does the following.\nCreate schedule_dates(start, offsets).\n\nProgram requirements\n\n1. Build the result\n- Return ISO dates for every non-negative integer offset in original order.\n\n2. Validate\n- Reject booleans, negative or non-integer offsets.\n\n3. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n[\'2026-07-15\', \'2026-07-16\', \'2026-08-14\']', pt: 'Objetivo:\nComplete days_open para fazer o seguinte.\nCrie schedule_dates(start, offsets).\n\nRequisitos do programa\n\n1. Montar o resultado\n- Retorne datas ISO para cada deslocamento inteiro não negativo na ordem original.\n\n2. Validar\n- Rejeite booleanos, negativos ou não inteiros.\n\n3. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n[\'2026-07-15\', \'2026-07-16\', \'2026-08-14\']' },
    starterCode: `from datetime import datetime\n\ndef days_open(opened, today):\n    pass`,
    publicAfterCode: `print(days_open("2026-07-01", "2026-07-11"))`,
    publicExpected: '10',
    hiddenAfterCode: `try:\n    days_open("2026-07-11", "2026-07-01")\nexcept ValueError:\n    print("invalid order")`,
    hiddenExpected: 'invalid order',
    requirements: [{ kind: 'function', value: 'days_open' }, { kind: 'import', value: 'datetime' }],
    hints: [
      { en: 'Parse both strings with the same format.', pt: 'Converta as duas strings usando o mesmo formato.' },
      { en: 'Subtract datetime objects and read .days.', pt: 'Subtraia objetos datetime e leia .days.' },
      { en: 'Validate chronological order before returning.', pt: 'Valide a ordem cronológica antes de retornar.' },
    ],
  },
  21: {
    functionName: 'draw_numbers',
    title: { en: 'Transfer: reproducible randomness', pt: 'Transferência: aleatoriedade reproduzível' },
    description: { en: 'Goal:\nComplete draw_numbers so that it does the following.\nReturn count random integers from 1 to 10 using a local generator created from the supplied seed.\n\nProgram requirements\n\n1. Build the result\n- Follow the function contract stated in the goal.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n[2, 1, 5]', pt: 'Objetivo:\nComplete draw_numbers para fazer o seguinte.\nRetorne count inteiros aleatórios de 1 a 10 usando um gerador local criado a partir da seed informada.\n\nRequisitos do programa\n\n1. Montar o resultado\n- Siga o contrato da função apresentado no objetivo.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n[2, 1, 5]' },
    starterCode: `import random\n\ndef draw_numbers(seed, count):\n    pass`,
    publicAfterCode: `print(draw_numbers(42, 3))`,
    publicExpected: '[2, 1, 5]',
    hiddenAfterCode: `print(draw_numbers(42, 0))`,
    hiddenExpected: '[]',
    requirements: [{ kind: 'function', value: 'draw_numbers' }, { kind: 'import', value: 'random' }],
    hints: [
      { en: 'Create rng = random.Random(seed) instead of changing global state.', pt: 'Crie rng = random.Random(seed) em vez de mudar o estado global.' },
      { en: 'Generate one randint(1, 10) per requested item.', pt: 'Gere um randint(1, 10) por item solicitado.' },
      { en: 'A zero count should return an empty list without special output.', pt: 'Uma contagem zero deve retornar lista vazia sem saída especial.' },
    ],
  },
  22: {
    functionName: 'circle_area',
    title: { en: 'Transfer: formula, units, and rounding', pt: 'Transferência: fórmula, unidades e arredondamento' },
    description: { en: 'Goal:\nComplete circle_area so that it does the following.\nReturn the area of a circle rounded to two decimals.\n\nProgram requirements\n\n1. Validate\n- Reject a negative radius.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n78.54', pt: 'Objetivo:\nComplete circle_area para fazer o seguinte.\nRetorne a área de um círculo arredondada em duas casas.\n\nRequisitos do programa\n\n1. Validar\n- Rejeite raio negativo.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n78.54' },
    starterCode: `import math\n\ndef circle_area(radius):\n    pass`,
    publicAfterCode: `print(circle_area(5))`,
    publicExpected: '78.54',
    hiddenAfterCode: `try:\n    circle_area(-1)\nexcept ValueError:\n    print("invalid radius")`,
    hiddenExpected: 'invalid radius',
    requirements: [{ kind: 'function', value: 'circle_area' }, { kind: 'import', value: 'math' }],
    hints: [
      { en: 'Area is pi multiplied by radius squared.', pt: 'Área é pi multiplicado pelo raio ao quadrado.' },
      { en: 'Validate the unit-bearing input before applying the formula.', pt: 'Valide a entrada com unidade antes de aplicar a fórmula.' },
      { en: 'Use round(result, 2) only at the presentation boundary.', pt: 'Use round(resultado, 2) somente na fronteira de apresentação.' },
    ],
  },
  23: {
    functionName: 'safe_total',
    title: { en: 'Transfer: recover from invalid input', pt: 'Transferência: recupere entrada inválida' },
    description: { en: 'Goal:\nComplete safe_total so that it does the following.\nConvert a raw amount value and return its total.\n\nProgram requirements\n\n1. Validate\n- Return None for invalid or non-positive input using a specific exception handler.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n4750', pt: 'Objetivo:\nComplete safe_total para fazer o seguinte.\nConverta um dano bruto e retorne o pagamento.\n\nRequisitos do programa\n\n1. Validar\n- Retorne None para entrada inválida ou não positiva usando tratamento específico.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n4750' },
    starterCode: `def safe_total(raw, discount=250):\n    pass`,
    publicAfterCode: `print(safe_total("5000"))`,
    publicExpected: '4750',
    hiddenAfterCode: `print(safe_total("not-a-number"))`,
    hiddenExpected: 'None',
    requirements: [{ kind: 'function', value: 'safe_total' }, { kind: 'node', value: 'Try' }],
    hints: [
      { en: 'Put only the risky conversion inside try.', pt: 'Coloque apenas a conversão arriscada dentro do try.' },
      { en: 'Catch ValueError, not every possible exception.', pt: 'Capture ValueError, não toda exceção possível.' },
      { en: 'Check positivity after conversion and return None when the contract is invalid.', pt: 'Verifique se é positivo após converter e retorne None quando o contrato for inválido.' },
    ],
  },
  24: {
    functionName: 'calculate',
    title: { en: 'Transfer: calculator contract and failures', pt: 'Transferência: contrato e falhas da calculadora' },
    description: { en: 'Goal:\nComplete calculate so that it does the following.\nImplement +, -, *, and /.\n\nProgram requirements\n\n1. Validate\n- Reject division by zero and unknown operations with ValueError.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n15\n5.0', pt: 'Objetivo:\nComplete calculate para fazer o seguinte.\nImplemente +, -, * e /.\n\nRequisitos do programa\n\n1. Validar\n- Rejeite divisão por zero e operações desconhecidas com ValueError.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n15\n5.0' },
    starterCode: `def calculate(left, operator, right):\n    pass`,
    publicAfterCode: `print(calculate(10, "+", 5))\nprint(calculate(10, "/", 2))`,
    publicExpected: '15\n5.0',
    hiddenAfterCode: `try:\n    calculate(10, "/", 0)\nexcept ValueError:\n    print("invalid operation")`,
    hiddenExpected: 'invalid operation',
    requirements: [{ kind: 'function', value: 'calculate' }, { kind: 'node', value: 'If' }],
    hints: [
      { en: 'Write one branch per supported operator.', pt: 'Escreva um caminho para cada operador aceito.' },
      { en: 'Validate division by zero before dividing.', pt: 'Valide divisão por zero antes de dividir.' },
      { en: 'Use ValueError for unsupported business input.', pt: 'Use ValueError para entrada de negócio não aceita.' },
    ],
  },
  25: {
    functionName: 'update_amount',
    title: { en: 'Transfer: update one CRUD record', pt: 'Transferência: atualize um registro CRUD' },
    description: { en: 'Goal:\nComplete update_amount so that it does the following.\nUpdate one order by id and return True.\n\nProgram requirements\n\n1. Build the result\n- Return False without modifying anything when the id does not exist.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\nTrue\n900', pt: 'Objetivo:\nComplete update_amount para fazer o seguinte.\nAtualize um pedido pelo id e retorne True.\n\nRequisitos do programa\n\n1. Montar o resultado\n- Retorne False sem modificar nada quando o id não existir.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\nTrue\n900' },
    starterCode: `def update_amount(db, order_id, new_amount):\n    pass`,
    publicAfterCode: `db = [{"id": 1, "amount": 500}]\nprint(update_amount(db, 1, 900))\nprint(db[0]["amount"])`,
    publicExpected: 'True\n900',
    hiddenAfterCode: `db = [{"id": 1, "amount": 500}]\nprint(update_amount(db, 99, 900))\nprint(db[0]["amount"])`,
    hiddenExpected: 'False\n500',
    requirements: [{ kind: 'function', value: 'update_amount' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }],
    hints: [
      { en: 'Search one record at a time and compare ids.', pt: 'Procure um registro por vez e compare os ids.' },
      { en: 'Change the record and return immediately when found.', pt: 'Altere o registro e retorne imediatamente quando encontrar.' },
      { en: 'Return False only after the loop proves that no id matched.', pt: 'Retorne False apenas depois que o loop provar que nenhum id correspondeu.' },
    ],
  },
  26: {
    functionName: 'summarize_values',
    title: { en: 'Transfer: derive evidence from a new dataset', pt: 'Transferência: derive evidências de outro conjunto' },
    description: { en: 'Goal:\nComplete summarize_values so that it does the following.\nReturn total, average, minimum, and maximum in a dictionary.\n\nProgram requirements\n\n1. Validate\n- Reject an empty dataset explicitly.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n{\'total\': 60, \'average\': 20.0, \'minimum\': 10, \'maximum\': 30}', pt: 'Objetivo:\nComplete summarize_values para fazer o seguinte.\nRetorne total, média, mínimo e máximo em um dicionário.\n\nRequisitos do programa\n\n1. Validar\n- Rejeite conjunto vazio explicitamente.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n{\'total\': 60, \'average\': 20.0, \'minimum\': 10, \'maximum\': 30}' },
    starterCode: `def summarize_values(values):\n    pass`,
    publicAfterCode: `print(summarize_values([10, 20, 30]))`,
    publicExpected: "{'total': 60, 'average': 20.0, 'minimum': 10, 'maximum': 30}",
    hiddenAfterCode: `try:\n    summarize_values([])\nexcept ValueError:\n    print("empty dataset")`,
    hiddenExpected: 'empty dataset',
    requirements: [{ kind: 'function', value: 'summarize_values' }, { kind: 'node', value: 'Dict' }],
    hints: [
      { en: 'Validate that at least one value exists before division, min, or max.', pt: 'Valide que existe pelo menos um valor antes de divisão, min ou max.' },
      { en: 'Calculate each metric once and store it under a clear key.', pt: 'Calcule cada métrica uma vez e guarde sob uma chave clara.' },
      { en: 'The result dictionary is the function contract; printing is only for the test call.', pt: 'O dicionário de resultado é o contrato; print serve apenas para a chamada de teste.' },
    ],
  },
  27: {
    functionName: 'register_order',
    title: { en: 'Transfer: capstone boundary', pt: 'Transferência: fronteira do capstone' },
    description: { en: 'Goal:\nComplete register_order so that it does the following.\nValidate raw input, create a order record, and return it.\n\nProgram requirements\n\n1. Validate\n- Invalid or non-positive amount must return None without crashing.\n\n2. Verify\n- Return the requested value in the required shape.\n- Test with the provided example and at least one different valid case.\n\nExample result:\n{\'client\': \'Ana\', \'amount\': 5000, \'total\': 4750}', pt: 'Objetivo:\nComplete register_order para fazer o seguinte.\nValide entrada bruta, crie um registro de pedido e retorne.\n\nRequisitos do programa\n\n1. Validar\n- Dano inválido ou não positivo deve retornar None sem travar.\n\n2. Conferir\n- Retorne o valor solicitado no formato exigido.\n- Teste com o exemplo fornecido e pelo menos um caso válido diferente.\n\nExemplo de resultado:\n{\'client\': \'Ana\', \'amount\': 5000, \'total\': 4750}' },
    starterCode: `def register_order(client, raw_amount, discount=250):\n    pass`,
    publicAfterCode: `print(register_order("Ana", "5000"))`,
    publicExpected: "{'client': 'Ana', 'amount': 5000, 'total': 4750}",
    hiddenAfterCode: `print(register_order("Ana", "invalid"))`,
    hiddenExpected: 'None',
    requirements: [{ kind: 'function', value: 'register_order' }, { kind: 'node', value: 'Try' }, { kind: 'node', value: 'Dict' }],
    hints: [
      { en: 'Convert the raw amount inside a small try block.', pt: 'Converta o dano bruto dentro de um try pequeno.' },
      { en: 'Reject conversion failure and non-positive values before creating the record.', pt: 'Rejeite falha de conversão e valores não positivos antes de criar o registro.' },
      { en: 'Return a dictionary whose keys form a stable contract.', pt: 'Retorne um dicionário cujas chaves formam um contrato estável.' },
    ],
  },
}

function transferExercise(phaseId: number, spec: TransferChallengeSpec): Exercise {
  const requirements = spec.requirements || [{ kind: 'function', value: spec.functionName } as CodeRequirement]
  const makeTest = (kind: 'public' | 'hidden'): TestCase => ({
    id: `p${phaseId}-transfer-${kind}`,
    description: kind === 'public'
      ? { en: 'Works for the visible transfer scenario', pt: 'Funciona no cenário visível de transferência' }
      : { en: 'Generalizes to a different or edge scenario', pt: 'Generaliza para um cenário diferente ou limite' },
    expectedOutput: { en: kind === 'public' ? spec.publicExpected : spec.hiddenExpected, pt: kind === 'public' ? spec.publicExpected : spec.hiddenExpected },
    inputs: [],
    checks: [{ type: 'equals', value: kind === 'public' ? spec.publicExpected : spec.hiddenExpected, target: 'test_output', textMode: 'normalized' }],
    points: 50,
    setupCode: spec.setupCode,
    afterCode: kind === 'public' ? spec.publicAfterCode : spec.hiddenAfterCode,
    codeRequirements: requirements,
    hidden: kind === 'hidden',
  })

  return {
    id: `p${phaseId}-transfer`,
    title: spec.title,
    description: spec.description,
    starterCode: spec.starterCode,
    hints: spec.hints,
    sampleOutput: { en: spec.publicExpected, pt: spec.publicExpected },
    objective: {
      en: 'Apply the phase concept to a new contract instead of reproducing the lesson example.',
      pt: 'Aplique o conceito da fase a um novo contrato em vez de reproduzir o exemplo da aula.',
    },
    difficulty: 'challenge',
    estimatedMinutes: 20,
    successCriteria: {
      en: ['Returns or produces the visible result from the supplied data', 'Also passes a materially different hidden case'],
      pt: ['Retorna ou produz o resultado visível usando os dados fornecidos', 'Também passa em um caso oculto materialmente diferente'],
    },
    commonMistakes: {
      en: ['Hard-coding the visible result', 'Ignoring the empty, invalid, or boundary case'],
      pt: ['Fixar o resultado visível no código', 'Ignorar o caso vazio, inválido ou de limite'],
    },
    workplaceContext: {
      en: 'Professional code is trusted only after the same rule works with data that was not shown in advance.',
      pt: 'Código profissional só é confiável quando a mesma regra funciona com dados não mostrados antecipadamente.',
    },
    grading: {
      tests: [makeTest('public'), makeTest('hidden')],
      codeRequirements: requirements,
      timeoutMs: 3500,
    },
  }
}

function rebalanceVisiblePoints(tests: TestCase[], target: number) {
  if (!tests.length) return
  const current = tests.reduce((sum, test) => sum + Math.max(0, test.points), 0) || tests.length
  let assigned = 0
  tests.forEach((test, index) => {
    const points = index === tests.length - 1
      ? target - assigned
      : Math.max(1, Math.round((Math.max(0, test.points) / current) * target))
    test.points = points
    assigned += points
  })
  if (assigned !== target) tests[tests.length - 1].points += target - assigned
}

function hiddenExamTest(phase: Phase): TestCase {
  const base: TestCase = {
    id: `p${phase.id}-exam-hidden-hardening`,
    description: { en: 'Uses the learned rule rather than a fixed visible answer', pt: 'Usa a regra aprendida em vez de uma resposta visível fixa' },
    inputs: [],
    checks: [{ type: 'no_error' }],
    points: 20,
    hidden: true,
    codeRequirements: PHASE_REQUIREMENTS[phase.id],
  }

  const variants: Partial<Record<number, Partial<TestCase>>> = {
    1: { codeRequirements: [{ kind: 'call', value: 'print', minCount: 5 }, { kind: 'node', value: 'BinOp' }] },
    2: { codeRequirements: [{ kind: 'node', value: 'BinOp', minCount: 4 }, { kind: 'node', value: 'Assign', minCount: 4 }] },
    3: { codeRequirements: [{ kind: 'node', value: 'Assign', minCount: 4 }, { kind: 'node', value: 'BinOp', minCount: 2 }] },
    4: { inputs: ['Test User', '1250', '250'], checks: [{ type: 'contains_any', value: ['850', '850.0'] }] },
    5: { inputs: ['2000', '100'], checks: [{ type: 'contains', value: 'AUTO' }] },
    6: { inputs: ['1000'], checks: [{ type: 'contains', value: 'NORMAL' }] },
    7: { inputs: ['500', '500', '500', '500', '500'], checks: [{ type: 'contains', value: '1000' }, { type: 'contains', value: '200' }] },
    8: { codeRequirements: [{ kind: 'node', value: 'For' }, { kind: 'node', value: 'BinOp' }] },
    9: { codeRequirements: [{ kind: 'node', value: 'List' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }] },
    10: { codeRequirements: [{ kind: 'node', value: 'Dict' }, { kind: 'node', value: 'Subscript', minCount: 3 }] },
    11: { codeRequirements: [{ kind: 'node', value: 'List' }, { kind: 'node', value: 'Dict' }, { kind: 'node', value: 'For' }] },
    12: { codeRequirements: [{ kind: 'node', value: 'ListComp' }, { kind: 'node', value: 'For' }] },
    13: { afterCode: 'print(calculate_total(1000, 100))\nprint(get_priority(2000))', checks: [{ type: 'contains', value: '900', target: 'test_output' }, { type: 'contains', value: 'Normal', target: 'test_output' }] },
    14: { afterCode: 'print(process("Diana", 1000, discount=100, coverage=0.50))', checks: [{ type: 'contains_any', value: ['450', '450.0'], target: 'test_output' }] },
    15: { afterCode: 'print(total(1000, 100))\nprint(priority(10001))', checks: [{ type: 'contains', value: '900', target: 'test_output' }, { type: 'contains', value: 'Critical', target: 'test_output' }], codeRequirements: [{ kind: 'function', value: 'total' }, { kind: 'function', value: 'priority' }] },
    16: { afterCode: 'print(add_to_total(10, 5))\nprint(process_order(1000, 100))', checks: [{ type: 'contains', value: '15', target: 'test_output' }, { type: 'contains', value: '900', target: 'test_output' }] },
    17: { codeRequirements: [{ kind: 'call', value: 'split' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }] },
    18: { afterCode: 'print(open("report.csv").read().splitlines()[0])', checks: [{ type: 'contains', value: 'id,client,amount,total', target: 'test_output' }], codeRequirements: [{ kind: 'call', value: 'open' }, { kind: 'node', value: 'With' }] },
    19: { afterCode: 'print(len(json.load(open("output.json"))))', checks: [{ type: 'contains', value: '4', target: 'test_output' }], codeRequirements: [{ kind: 'import', value: 'json' }, { kind: 'call', value: 'dump' }] },
    20: { codeRequirements: [{ kind: 'import', value: 'datetime' }, { kind: 'node', value: 'BinOp' }, { kind: 'node', value: 'If' }] },
    21: { codeRequirements: [{ kind: 'import', value: 'random' }, { kind: 'call', value: 'seed' }, { kind: 'node', value: 'For' }] },
    22: { codeRequirements: [{ kind: 'import', value: 'math' }, { kind: 'node', value: 'If' }, { kind: 'node', value: 'For' }] },
    23: { codeRequirements: [{ kind: 'node', value: 'Try' }, { kind: 'node', value: 'ExceptHandler' }, { kind: 'node', value: 'For' }] },
    24: { afterCode: 'print(calc_premium(2000, 0.10, 2))', checks: [{ type: 'contains_any', value: ['400', '400.0'], target: 'test_output' }], codeRequirements: [{ kind: 'function', value: 'calc_premium' }, { kind: 'node', value: 'If' }] },
    25: { afterCode: 'audit_db=[]\ncreate(audit_db,"Zoe",1000)\nprint(update(audit_db,1,1500))\nprint(audit_db[0]["amount"])\ndelete(audit_db,1)\nprint(len(audit_db))', checks: [{ type: 'contains', value: '1500', target: 'test_output' }, { type: 'contains', value: '0', target: 'test_output' }], codeRequirements: [{ kind: 'function', value: 'create' }, { kind: 'function', value: 'update' }, { kind: 'function', value: 'delete' }] },
    26: { codeRequirements: [{ kind: 'call', value: 'sum' }, { kind: 'call', value: 'min' }, { kind: 'call', value: 'max' }, { kind: 'node', value: 'For' }] },
    27: { afterCode: 'audit_db=[]\ntry:\n    create_order(audit_db,"Invalid",-1)\nexcept ValueError:\n    print("rejected")\ncreate_order(audit_db,"Valid",1000)\nupdate_status(audit_db,1,"approved")\nprint(audit_db[0]["status"])', checks: [{ type: 'contains', value: 'rejected', target: 'test_output' }, { type: 'contains', value: 'approved', target: 'test_output' }], codeRequirements: [{ kind: 'function', value: 'create_order' }, { kind: 'node', value: 'Try' }] },
  }

  return { ...base, ...(variants[phase.id] || {}) }
}

function expandWeakQuizExplanations(phase: Phase) {
  for (const question of phase.quiz) {
    if (question.explanation.en.trim().length < 70) {
      question.explanation.en = `${question.explanation.en.trim()} The correct option follows the rule taught in this phase; a tempting alternative either changes the data type, skips a required step, or only works for the visible example.`
    }
    if (question.explanation.pt.trim().length < 70) {
      question.explanation.pt = `${question.explanation.pt.trim()} A opção correta segue a regra ensinada nesta fase; uma alternativa tentadora muda o tipo do dado, pula um passo obrigatório ou funciona apenas no exemplo visível.`
    }
  }
}

export function applyFoundationHardening(phases: Phase[]) {
  for (const phase of phases) {
    if (phase.id < 1 || phase.id > 27) continue

    phase.exercises.forEach((exercise, index) => {
      const suggested = SUGGESTED_INPUTS[exercise.id]
      if (suggested && !exercise.suggestedInputs) exercise.suggestedInputs = suggested
      ensureProgressiveHints(exercise, phase, index)
      if (index > 0) ensureExerciseGrading(phase, exercise)
    })

    if (phase.id >= 9 && !phase.exercises.some(exercise => exercise.id === `p${phase.id}-transfer`)) {
      phase.exercises.push(transferExercise(phase.id, TRANSFER_CHALLENGES[phase.id]))
    }

    // Phases 4–6 contain one input-based exercise and one no-input challenge. Both now receive explicit verification.
    if (phase.id >= 4 && phase.id <= 6) {
      phase.exercises.slice(1).forEach(exercise => ensureExerciseGrading(phase, exercise))
    }

    if (!phase.exam.testCases.some(test => test.id === `p${phase.id}-exam-hidden-hardening`)) {
      rebalanceVisiblePoints(phase.exam.testCases, 80)
      phase.exam.testCases.push(hiddenExamTest(phase))
    }

    expandWeakQuizExplanations(phase)
  }
}
