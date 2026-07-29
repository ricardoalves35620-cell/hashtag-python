import { resolveLocalizedCode } from '../lib/localization'
import type { Bilingual, Check, CodeRequirement, Exercise, Phase, TestCase } from './types'

const PHASE_REQUIREMENTS: Record<number, CodeRequirement[]> = {
  // Phase 1's only requirement was `print` three times, which a program that prints
  // the answers as literals satisfies exactly. Both phase 1 tasks state the
  // arithmetic — the starter shows `___ + 12`, and ex1_zero says "the total revenue
  // calculated by Python (80 multiplied by 5)" — so requiring one operation asks
  // for nothing the learner was not already told to do, and no correct answer can
  // fail it. cheat-resistance.py is what found the hole.
  1: [{ kind: 'call', value: 'print', minCount: 3 }, { kind: 'node', value: 'BinOp' }],
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
  // From-scratch exercises: the learner writes the input() calls, so the starter
  // contains none and the count guard below cannot infer them. Values come from the
  // example in each task description.
  ex4_zero: ['Alex', '80.0', '6'],
  ex5_zero: ['20'],
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
/**
 * Requires every expected LINE to appear — in any order, with any spacing.
 *
 * It used to escape the whole sample block, newlines included, so the three lines had to
 * arrive contiguous and in exactly the authored order. A learner whose loop, total,
 * count and average were all correct was failed for printing "Long songs" before
 * "Total time", and for `print("...: ", count)` emitting two spaces where the sample has
 * one. Neither is the thing any of these exercises teaches.
 *
 * A wrong VALUE still fails: each line is matched in full, so 1700 does not satisfy
 * 1710. What no longer fails is the order you chose to print them in.
 */
function samplePattern(text: string): string {
  const linePattern = (line: string) => line
    .split(/\{\{[^}]*\}\}/)
    .map(part => part
      .replace(/[.*+?^${}()|[\]\\]/g, match => '\\' + match)
      .replace(/\s+/g, '\\s+'))
    .join('.+')

  const lines = text.trim().split('\n').map(line => line.trim()).filter(Boolean)
  if (lines.length <= 1) return linePattern(text.trim())
  return lines.map(line => `(?=[\\s\\S]*${linePattern(line)})`).join('') + '[\\s\\S]*'
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
        // Every accepted language, not just the first. This branch built the pattern
        // from accepted[0] alone — the English sample — so once the Portuguese version
        // of an exercise printed Portuguese, the only correct answer a Portuguese
        // learner could give was rejected. The branch below already joins them.
        value: accepted.map(samplePattern).join('|'),
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
  const inputCount = (resolveLocalizedCode(exercise.starterCode, 'en').match(/\binput\s*\(/g) || []).length
  if (inputCount > inputs.length) return

  // A from-scratch exercise writes its own input() calls, so the starter count is 0
  // and tells us nothing. If the TASK asks the learner to gather input and we have
  // none to supply, a graded run would feed empty strings and fail every correct
  // answer — so leave the grading alone rather than build a test that cannot pass.
  const asksForInput = /\b(gather input|ask for|prompt the user|receber os dados|solicite|pergunt)\b/i
    .test(`${exercise.description?.en || ''} ${exercise.description?.pt || ''}`)
  if (asksForInput && inputs.length === 0) return

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
    description: { en: 'Goal:\nComplete approved_total so that it does the following.\nWrite transpose_grid(grid). Convert rows into columns so that each original row becomes a column in the result. Return an empty list for an empty grid, and raise ValueError("ragged grid") when rows have different lengths.\n\nProgram requirements\n\n1. Validate\n- Return [] immediately if the grid is empty\n- Raise ValueError("ragged grid") if any row has a different length than the first row\n\n2. Calculate\n- Build a new nested list where each new row collects one cell from every original row at the same column index\n- Return the transposed grid\n\nExample, transposing a 3-by-2 grid:\n[[1, 4], [2, 5], [3, 6]]', pt: 'Objetivo:\nComplete approved_total para fazer o seguinte.\nEscreva transpose_grid(grid). Converta linhas em colunas de modo que cada linha original vire uma coluna no resultado. Retorne uma lista vazia para grade vazia e gere ValueError("ragged grid") quando as linhas tiverem tamanhos diferentes.\n\nRequisitos do programa\n\n1. Validar\n- Retorne [] imediatamente se a grade estiver vazia\n- Gere ValueError("ragged grid") se alguma linha tiver tamanho diferente da primeira\n\n2. Calcular\n- Construa uma nova lista aninhada onde cada nova linha coleta uma célula de cada linha original no mesmo índice de coluna\n- Retorne a grade transposta\n\nExemplo, transpondo uma grade 3 por 2:\n[[1, 4], [2, 5], [3, 6]]' },
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
    description: { en: 'Goal:\nComplete order_total so that it does the following.\nWrite merge_settings(base, changes, allowed). Return a copy of the base dictionary with only the changes that belong to the allowed list applied to it.\n\nProgram requirements\n\n1. Validate\n- Raise ValueError("unknown setting") when changes contains any key not present in allowed\n\n2. Calculate\n- Create a copy of base\n- Apply only the validated changes to the copy\n- Return the resulting dictionary\n\nExample, merging language and theme changes with allowed keys language and theme:\n{\'language\': \'pt\', \'theme\': \'dark\'}', pt: 'Objetivo:\nComplete order_total para fazer o seguinte.\nEscreva merge_settings(base, changes, allowed). Retorne uma cópia do dicionário base com apenas as mudanças pertencentes à lista permitida aplicadas a ela.\n\nRequisitos do programa\n\n1. Validar\n- Gere ValueError("unknown setting") quando changes contiver alguma chave fora de allowed\n\n2. Calcular\n- Crie uma cópia de base\n- Aplique apenas as mudanças validadas à cópia\n- Retorne o dicionário resultante\n\nExemplo, combinando mudanças de language e theme com chaves permitidas language e theme:\n{\'language\': \'pt\', \'theme\': \'dark\'}' },
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
    description: { en: 'Goal:\nComplete approved_members so that it does the following.\nWrite group_titles_by_category(items). Return a dictionary where each key is a category and each value is a list of titles in input order.\n\nProgram requirements\n\n1. Validate\n- Raise ValueError("missing keys") when a record lacks the required category or title keys\n\n2. Calculate\n- Group titles under their respective category\n- Categories should appear in first-seen order\n- Titles within each category should keep their original input order\n\nExample, grouping items from categories game and movie:\n{\'game\': [\'Portal\', \'Celeste\'], \'movie\': [\'Coco\']}', pt: 'Objetivo:\nComplete approved_members para fazer o seguinte.\nEscreva group_titles_by_category(items). Retorne um dicionário onde cada chave é uma categoria e cada valor é uma lista de títulos na ordem de entrada.\n\nRequisitos do programa\n\n1. Validar\n- Gere ValueError("missing keys") quando um registro não tiver as chaves obrigatórias category ou title\n\n2. Calcular\n- Agrupe títulos sob suas respectivas categorias\n- Categorias devem aparecer na ordem da primeira aparição\n- Títulos dentro de cada categoria devem manter a ordem original de entrada\n\nExemplo, agrupando itens das categorias game e movie:\n{\'game\': [\'Portal\', \'Celeste\'], \'movie\': [\'Coco\']}' },
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
    description: { en: 'Goal:\nComplete high_values so that it does the following.\nWrite positive_cells(grid). Use one nested list comprehension to flatten the entire grid and return only the values greater than zero.\n\nProgram requirements\n\n1. Validate\n- Raise ValueError("non-numeric cell") if any cell is not an int or float\n\n2. Calculate\n- Iterate through every row, then through every cell in the row\n- Keep only values greater than zero\n- Return them as a flat list\n\nExample, for a grid with positive and non-positive values:\n[1, 3, 5]', pt: 'Objetivo:\nComplete high_values para fazer o seguinte.\nEscreva positive_cells(grid). Use uma compreensão de lista aninhada para achatar toda a grade e retornar apenas os valores maiores que zero.\n\nRequisitos do programa\n\n1. Validar\n- Gere ValueError("non-numeric cell") se alguma célula não for int ou float\n\n2. Calcular\n- Percorra cada linha e depois cada célula dentro dela\n- Mantenha apenas valores maiores que zero\n- Retorne-os como uma lista plana\n\nExemplo, para uma grade com valores positivos e não positivos:\n[1, 3, 5]' },
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
    description: { en: 'Goal:\nComplete net_total so that it does the following.\nWrite two functions that work together: net_hours(entries) and workload_label(hours).\n\nnet_hours(entries)\n\nProgram requirements\n\n- Each entry is a pair [planned, blocked]\n- Reject any negative planned or blocked value by raising ValueError\n- Return the total planned hours minus the total blocked hours\n\nworkload_label(hours)\n- Return "light" when hours is below 20\n- Return "balanced" when hours is from 20 through 40\n- Return "heavy" when hours is above 40\n\nExample, calling net_hours with entries [[40, 2], [8, 1], [15, 0]] then passing the result to workload_label:\n36\nbalanced', pt: 'Objetivo:\nComplete net_total para fazer o seguinte.\nEscreva duas funções que trabalham juntas: net_hours(entries) e workload_label(hours).\n\nnet_hours(entries)\n\nRequisitos do programa\n\n- Cada entrada é um par [planejado, bloqueado]\n- Rejeite qualquer valor planejado ou bloqueado negativo gerando ValueError\n- Retorne o total de horas planejadas menos o total de horas bloqueadas\n\nworkload_label(hours)\n- Retorne "light" quando hours for abaixo de 20\n- Retorne "balanced" quando hours for de 20 até 40\n- Retorne "heavy" quando hours for acima de 40\n\nExemplo, chamando net_hours com entries [[40, 2], [8, 1], [15, 0]] e passando o resultado para workload_label:\n36\nbalanced' },
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
    description: { en: 'Goal:\nComplete service_fee so that it does the following.\nWrite export_name(base, extension="csv", *, compressed=False). Build a safe filename for data export.\n\nProgram requirements\n\n1. Validate\n- Strip surrounding spaces from base\n- Raise ValueError if base is empty after stripping\n- Raise ValueError if extension is not csv or json\n\n2. Calculate\n- Combine the cleaned base name with the extension, separated by a dot\n- Append ".gz" when compressed is True\n- Return the filename\n\nExample, calling export_name("report  ", compressed=True):\nreport.csv.gz', pt: 'Objetivo:\nComplete service_fee para fazer o seguinte.\nEscreva export_name(base, extension="csv", *, compressed=False). Construa um nome de arquivo seguro para exportação de dados.\n\nRequisitos do programa\n\n1. Validar\n- Remova espaços externos de base\n- Gere ValueError se base estiver vazio após remover espaços\n- Gere ValueError se extension não for csv ou json\n\n2. Calcular\n- Combine o nome base limpo com a extensão, separados por ponto\n- Adicione ".gz" quando compressed for True\n- Retorne o nome do arquivo\n\nExemplo, chamando export_name("report  ", compressed=True):\nreport.csv.gz' },
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
    description: { en: 'Goal:\nComplete classify_amount so that it does the following.\nWrite format_distance(km) with a docstring that includes an executable example.\n\nProgram requirements\n\n1. Document\n- The docstring must contain the exact text format_distance(1.5) as an example\n- Include an Example section in the docstring\n\n2. Validate\n- Raise ValueError for negative km values\n\n3. Calculate\n- Return the distance formatted with two decimal places followed by " km"\n\nExample:\nTrue\n1.50 km', pt: 'Objetivo:\nComplete classify_amount para fazer o seguinte.\nEscreva format_distance(km) com uma docstring que inclua um exemplo executável.\n\nRequisitos do programa\n\n1. Documentar\n- A docstring deve conter o texto exato format_distance(1.5) como exemplo\n- Inclua uma seção Example na docstring\n\n2. Validar\n- Gere ValueError para valores de km negativos\n\n3. Calcular\n- Retorne a distância formatada com duas casas decimais seguida de " km"\n\nExemplo:\nTrue\n1.50 km' },
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
    description: { en: 'Goal:\nComplete accumulate_totals so that it does the following.\nWrite make_prefix(prefix). It returns an inner function label(value) that creates prefixed messages.\n\nProgram requirements\n\n1. Validate\n- Strip surrounding spaces from prefix\n- Raise ValueError when the cleaned prefix is empty\n\n2. Calculate\n- Define an inner function label(value) that returns the prefix followed by a colon, a space and the value\n- Return the inner function without calling it\n\nExample, creating a prefix with "INFO" and labeling "started":\nINFO: started', pt: 'Objetivo:\nComplete accumulate_totals para fazer o seguinte.\nEscreva make_prefix(prefix). Ela retorna uma função interna label(value) que cria mensagens com prefixo.\n\nRequisitos do programa\n\n1. Validar\n- Remova espaços externos de prefix\n- Gere ValueError quando o prefixo limpo estiver vazio\n\n2. Calcular\n- Defina uma função interna label(value) que retorne o prefixo seguido de dois-pontos, um espaço e o valor\n- Retorne a função interna sem chamá-la\n\nExemplo, criando um prefixo com "INFO" e rotulando "started":\nINFO: started' },
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
    description: { en: 'Goal:\nComplete approved_csv_total so that it does the following.\nCreate a function that loads tasks from a UTF-8 text file. Each non-empty line has two fields separated by a semicolon: the task title and its priority.\n\nProgram requirements\n\n1. Read and parse\n- Open the file and skip empty lines\n- Split each line by semicolon into exactly two fields\n- The priority must be an integer between 1 and 5\n- Build a dictionary with keys title and priority for each valid line\n\n2. Sort and return\n- Return the list of dictionaries sorted first by priority, then by title\n\nExample, for a file with the lines "Revisão;2" and "Deploy;1":\n[{\'title\': \'Deploy\', \'priority\': 1}, {\'title\': \'Revisão\', \'priority\': 2}]', pt: 'Objetivo:\nComplete approved_csv_total para fazer o seguinte.\nCrie uma função que carrega tarefas de um arquivo de texto UTF-8. Cada linha não vazia contém dois campos separados por ponto e vírgula: o título da tarefa e sua prioridade.\n\nRequisitos do programa\n\n1. Ler e interpretar\n- Abra o arquivo e ignore as linhas vazias\n- Divida cada linha pelo ponto e vírgula em exatamente dois campos\n- A prioridade deve ser um inteiro entre 1 e 5\n- Monte um dicionário com as chaves title e priority para cada linha válida\n\n2. Ordenar e retornar\n- Retorne a lista de dicionários ordenada primeiro por prioridade, depois por título\n\nExemplo, para um arquivo com as linhas "Revisão;2" e "Deploy;1":\n[{\'title\': \'Deploy\', \'priority\': 1}, {\'title\': \'Revisão\', \'priority\': 2}]' },
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
    description: { en: 'Goal:\nComplete write_order_report so that it does the following.\nCreate a function that saves text to a file atomically. Write the content to a temporary file first, then replace the original destination so that no partially written file can remain.\n\nProgram requirements\n\n1. Write\n- Write the UTF-8 text to a temporary file at path + \'.tmp\'\n- Replace the original file with the temporary one using os.replace\n\n2. Return\n- The final size in bytes of the UTF-8 encoded content\n\nExample, for saving the text "new state":\nThe function returns 9, the file contains "new state", and the temporary file no longer exists.', pt: 'Objetivo:\nComplete write_order_report para fazer o seguinte.\nCrie uma função que salva texto em um arquivo de forma atômica. Grave o conteúdo em um arquivo temporário primeiro e depois substitua o destino original para que nenhum arquivo parcialmente escrito permaneça.\n\nRequisitos do programa\n\n1. Escrever\n- Grave o texto UTF-8 em um arquivo temporário no caminho path + \'.tmp\'\n- Substitua o arquivo original pelo temporário usando os.replace\n\n2. Retornar\n- O tamanho final em bytes do conteúdo codificado em UTF-8\n\nExemplo, para salvar o texto "new state":\nA função retorna 9, o arquivo contém "new state" e o arquivo temporário não existe mais.' },
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
    description: { en: 'Goal:\nComplete decode_order so that it does the following.\nCreate a function that updates a JSON file with a new key-value pair.\n\nProgram requirements\n\n1. Read\n- Open the file and load its contents as a JSON object, which must be a dictionary\n\n2. Update\n- Set the given key to the given value in the dictionary\n\n3. Write and return\n- Save the dictionary back to the same file as deterministic UTF-8 JSON — compact, with sorted keys and no extra whitespace\n- Return the number of keys in the updated dictionary\n\nExample, updating key "theme" to "dark" in a file that originally had language "pt-BR":\n2\n{"language":"pt-BR","theme":"dark"}', pt: 'Objetivo:\nComplete decode_order para fazer o seguinte.\nCrie uma função que atualiza um arquivo JSON com um novo par chave-valor.\n\nRequisitos do programa\n\n1. Ler\n- Abra o arquivo e carregue seu conteúdo como um objeto JSON, que deve ser um dicionário\n\n2. Atualizar\n- Defina a chave informada com o valor informado no dicionário\n\n3. Salvar e retornar\n- Grave o dicionário de volta no mesmo arquivo como JSON UTF-8 determinístico — compacto, com chaves ordenadas e sem espaços extras\n- Retorne o número de chaves do dicionário atualizado\n\nExemplo, atualizando a chave "theme" para "dark" em um arquivo que originalmente tinha language "pt-BR":\n2\n{"language":"pt-BR","theme":"dark"}' },
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
    description: { en: 'Goal:\nComplete days_open so that it does the following.\nCreate a function that generates a schedule of ISO dates by applying a list of day offsets to a start date.\n\nProgram requirements\n\n1. Parse and validate\n- Convert the start date from YYYY-MM-DD format\n- For each offset, reject booleans, negative values and non-integer values\n- Accept only non-negative integers\n\n2. Calculate\n- For each valid offset, add that many days to the start date\n- Return the resulting dates as ISO strings in the original order\n\nExample, from "2026-07-15" with offsets 0, 1, and 30:\n[\'2026-07-15\', \'2026-07-16\', \'2026-08-14\']', pt: 'Objetivo:\nComplete days_open para fazer o seguinte.\nCrie uma função que gera um cronograma de datas ISO aplicando uma lista de deslocamentos em dias a uma data inicial.\n\nRequisitos do programa\n\n1. Interpretar e validar\n- Converta a data inicial do formato YYYY-MM-DD\n- Para cada deslocamento, rejeite booleanos, valores negativos e valores que não sejam inteiros\n- Aceite apenas inteiros não negativos\n\n2. Calcular\n- Para cada deslocamento válido, some essa quantidade de dias à data inicial\n- Retorne as datas resultantes como strings ISO na ordem original\n\nExemplo, a partir de "2026-07-15" com deslocamentos 0, 1 e 30:\n[\'2026-07-15\', \'2026-07-16\', \'2026-08-14\']' },
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
    description: { en: 'Goal:\nComplete draw_numbers so that it does the following.\nCreate a function that draws random integers using a local random generator seeded with the given value. This avoids changing the global random state.\n\nProgram requirements\n\n1. Setup\n- Create a local random generator from the supplied seed\n\n2. Generate\n- Produce the requested number of random integers, each between 1 and 10 inclusive\n- Collect them into a list\n\n3. Return\n- The list of integers, which will be empty if count is zero\n\nExample, with seed 42 and count 3:\n[2, 1, 5]', pt: 'Objetivo:\nComplete draw_numbers para fazer o seguinte.\nCrie uma função que sorteia inteiros aleatórios usando um gerador local de random inicializado com o valor fornecido. Isso evita alterar o estado global de random.\n\nRequisitos do programa\n\n1. Configurar\n- Crie um gerador local de random a partir da seed informada\n\n2. Gerar\n- Produza a quantidade solicitada de inteiros aleatórios, cada um entre 1 e 10 inclusive\n- Colete-os em uma lista\n\n3. Retornar\n- A lista de inteiros, que estará vazia se count for zero\n\nExemplo, com seed 42 e count 3:\n[2, 1, 5]' },
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
    description: { en: 'Goal:\nComplete circle_area so that it does the following.\nCreate a function that calculates the area of a circle and returns it rounded to two decimal places.\n\nProgram requirements\n\n1. Validate\n- Reject a negative radius by raising ValueError\n\n2. Calculate\n- Compute the area using the mathematical constant pi multiplied by the radius squared\n- Round the result to two decimal places\n\n3. Return\n- The rounded area\n\nExample, for radius 5:\n78.54', pt: 'Objetivo:\nComplete circle_area para fazer o seguinte.\nCrie uma função que calcula a área de um círculo e retorna o valor arredondado em duas casas decimais.\n\nRequisitos do programa\n\n1. Validar\n- Rejeite um raio negativo gerando ValueError\n\n2. Calcular\n- Calcule a área usando a constante matemática pi multiplicada pelo raio ao quadrado\n- Arredonde o resultado para duas casas decimais\n\n3. Retornar\n- A área arredondada\n\nExemplo, para raio 5:\n78.54' },
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
    description: { en: 'Goal:\nComplete safe_total so that it does the following.\nCreate a function that safely converts a raw amount value and returns the subscription total.\n\nProgram requirements\n\n1. Convert and validate\n- Attempt to convert the raw input to an integer\n- If the conversion fails, return None\n- If the converted value is not positive, return None\n\n2. Calculate\n- Subtract the discount amount of 250 from the valid amount value\n- Return the resulting total\n\nExample, for raw input "5000":\n4750', pt: 'Objetivo:\nComplete safe_total para fazer o seguinte.\nCrie uma função que converte com segurança um valor bruto de dano e retorna o pagamento do seguro.\n\nRequisitos do programa\n\n1. Converter e validar\n- Tente converter a entrada bruta para inteiro\n- Se a conversão falhar, retorne None\n- Se o valor convertido não for positivo, retorne None\n\n2. Calcular\n- Subtraia o valor do desconto de 250 do dano válido\n- Retorne o pagamento resultante\n\nExemplo, para entrada bruta "5000":\n4750' },
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
    description: { en: 'Goal:\nComplete calculate so that it does the following.\nCreate a calculator function that performs basic arithmetic with proper error handling.\n\nProgram requirements\n\n1. Supported operations\n- Addition, subtraction, multiplication and division\n\n2. Validate\n- Reject division by zero by raising ValueError with the message "Cannot divide by zero"\n- Reject any operator that is not one of the four supported ones by raising ValueError\n\n3. Return\n- The numerical result of the calculation\n\nExample, for 10 "+" 5 the result is 15, and for 20 "/" 4 the result is 5.0:\n15\n5.0', pt: 'Objetivo:\nComplete calculate para fazer o seguinte.\nCrie uma função de calculadora que realiza operações aritméticas básicas com tratamento de erros adequado.\n\nRequisitos do programa\n\n1. Operações suportadas\n- Adição, subtração, multiplicação e divisão\n\n2. Validar\n- Rejeite divisão por zero gerando ValueError com a mensagem "Cannot divide by zero"\n- Rejeite qualquer operador que não seja um dos quatro suportados gerando ValueError\n\n3. Retornar\n- O resultado numérico do cálculo\n\nExemplo, para 10 "+" 5 o resultado é 15, e para 20 "/" 4 o resultado é 5.0:\n15\n5.0' },
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
    description: { en: 'Goal:\nComplete update_amount so that it does the following.\nWrite a function that updates the amount value of a single order in a list of order records. When a order with the given id exists, change its amount and return True. When no order matches the id, leave the list unchanged and return False.\n\nExample, for a order with id 1 and amount updated to 900:\nTrue\n900', pt: 'Objetivo:\nComplete update_amount para fazer o seguinte.\nEscreva uma função que atualize o valor de dano de um único pedido em uma lista de registros. Quando existir um pedido com o id fornecido, altere seu dano e retorne True. Quando nenhum pedido corresponder ao id, mantenha a lista intacta e retorne False.\n\nExemplo, para um pedido com id 1 e dano atualizado para 900:\nTrue\n900' },
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
    description: { en: 'Goal:\nComplete summarize_values so that it does the following.\nWrite a function that receives a list of numeric values and returns a dictionary with the total, average, minimum and maximum. If the list is empty, raise a ValueError.\n\nExample, for the values [10, 20, 30]:\n{\'total\': 60, \'average\': 20.0, \'minimum\': 10, \'maximum\': 30}', pt: 'Objetivo:\nComplete summarize_values para fazer o seguinte.\nEscreva uma função que receba uma lista de valores numéricos e retorne um dicionário com o total, a média, o mínimo e o máximo. Se a lista estiver vazia, levante um ValueError.\n\nExemplo, para os valores [10, 20, 30]:\n{\'total\': 60, \'average\': 20.0, \'minimum\': 10, \'maximum\': 30}' },
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
    description: { en: 'Goal:\nComplete register_order so that it does the following.\nWrite a function that registers a new order. It receives a client name, a raw amount value and a discount amount (default 250). Convert the raw amount to a number, validate it is positive, calculate the total by subtracting the discount, and return a dictionary with the client, amount and total. Return None if the amount is invalid or not positive.\n\nExample, for client "Ana" with raw amount "5000":\n{\'client\': \'Ana\', \'amount\': 5000, \'total\': 4750}', pt: 'Objetivo:\nComplete register_order para fazer o seguinte.\nEscreva uma função que registre um novo pedido. Ela recebe um nome de cliente, um valor de dano bruto e um valor de desconto (padrão 250). Converta o dano bruto para número, valide que é positivo, calcule o total subtraindo a desconto e retorne um dicionário com o cliente, o dano e o total. Retorne None se o dano for inválido ou não positivo.\n\nExemplo, para a cliente "Ana" com dano bruto "5000":\n{\'client\': \'Ana\', \'amount\': 5000, \'total\': 4750}' },
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
