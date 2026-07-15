import type { Bilingual, CodeRequirement, Exercise, LessonBlock, Phase, TestCase } from '../types'

const b = (en: string, pt: string): Bilingual => ({ en, pt })
const heading = (en: string, pt: string): LessonBlock => ({ type: 'heading', content: b(en, pt) })
const text = (en: string, pt: string): LessonBlock => ({ type: 'text', content: b(en, pt) })
const code = (en: string, pt: string): LessonBlock => ({ type: 'code', code: b(en, pt), language: 'python' })
const warning = (en: string, pt: string): LessonBlock => ({ type: 'warning', content: b(en, pt) })
const tip = (en: string, pt: string): LessonBlock => ({ type: 'tip', content: b(en, pt) })

function exactTest(
  id: string,
  description: Bilingual,
  afterCode: string,
  expected: Bilingual,
  points: number,
  requirements: CodeRequirement[],
  hidden = false,
): TestCase {
  return {
    id,
    description,
    expectedOutput: expected,
    inputs: [],
    afterCode,
    checks: [
      { type: 'no_error' },
      { type: 'equals_any', value: Array.from(new Set([expected.en, expected.pt])), target: 'test_output', textMode: 'normalized' },
    ],
    points,
    hidden,
    codeRequirements: requirements,
  }
}

function exercise(
  id: string,
  title: Bilingual,
  description: Bilingual,
  starterCode: string,
  sampleOutput: Bilingual,
  hints: Bilingual[],
  requirements: CodeRequirement[],
  publicTest: TestCase,
  hiddenTest: TestCase,
  difficulty: Exercise['difficulty'],
  objective: Bilingual,
  workplaceContext: Bilingual,
  successCriteria: { en: string[]; pt: string[] },
  commonMistakes: { en: string[]; pt: string[] },
): Exercise {
  return {
    id,
    title,
    description,
    starterCode,
    hints,
    sampleOutput,
    grading: {
      tests: [publicTest, hiddenTest],
      codeRequirements: requirements,
      timeoutMs: 3000,
    },
    objective,
    difficulty,
    estimatedMinutes: difficulty === 'guided' ? 12 : difficulty === 'challenge' ? 30 : 20,
    skillIds: [],
    successCriteria,
    commonMistakes,
    workplaceContext,
  }
}

const phase9Requirements: CodeRequirement[] = [
  { kind: 'function', value: 'cell_at' },
  { kind: 'node', value: 'Subscript', minCount: 2 },
]

export const phase9: Phase = {
  id: 9,
  title: b('Nested Lists', 'Listas Aninhadas'),
  description: b(
    'Represent tables, grids and matrices with lists inside lists, then navigate and validate their rows safely.',
    'Represente tabelas, grades e matrizes com listas dentro de listas, depois navegue e valide suas linhas com segurança.',
  ),
  icon: '🗂️',
  libraries: [],
  track: 'core',
  stage: 'base',
  estimatedHours: 6,
  lesson: {
    title: b('Nested lists: from rows to reliable tables', 'Listas aninhadas: de linhas a tabelas confiáveis'),
    blocks: [
      heading('🌍 World hook — Python tables before Pandas', '🌍 Gancho do mundo real — tabelas Python antes do Pandas'),
      text(
        'Before a team introduces a database or Pandas, small programs often receive data as rows: a game board, a restaurant menu, a classroom grade sheet, a delivery route or a matrix of sensor readings. A nested list is the first structure that lets you model rows and columns without learning a new library. In production code it appears in imported CSV data, test fixtures, image pixels, board games and algorithms that compare one row with another. The syntax is simple, but the professional skill is understanding the shape of the data and refusing to guess what each position means.',
        'Antes de uma equipe introduzir banco de dados ou Pandas, programas pequenos normalmente recebem dados em linhas: tabuleiro de jogo, cardápio de restaurante, planilha de notas, rota de entregas ou matriz de sensores. Uma lista aninhada é a primeira estrutura que permite modelar linhas e colunas sem aprender uma biblioteca nova. Em código de produção ela aparece em dados importados de CSV, dados de teste, pixels de imagens, jogos de tabuleiro e algoritmos que comparam linhas. A sintaxe é simples, mas a habilidade profissional é entender o formato dos dados e não adivinhar o significado de cada posição.',
      ),
      text(
        'A nested list has an outer list and one or more inner lists. The outer index selects a row. The second index selects a value inside that row. Reading table[2][1] means: first obtain row 2, then obtain column 1 from that row. Python evaluates those two operations in sequence. This mental step matters because an IndexError may come from the missing row or from a row that is shorter than expected.',
        'Uma lista aninhada possui uma lista externa e uma ou mais listas internas. O índice externo seleciona uma linha. O segundo índice seleciona um valor dentro dessa linha. Ler tabela[2][1] significa: primeiro obtenha a linha 2, depois obtenha a coluna 1 dessa linha. Python avalia essas duas operações em sequência. Esse passo mental importa porque um IndexError pode vir da linha inexistente ou de uma linha menor que o esperado.',
      ),
      heading('🧩 Physical analogy — a cabinet with drawers', '🧩 Analogia física — um armário com gavetas'),
      text(
        'Imagine a cabinet. The cabinet itself is the outer list. Each drawer is an inner list. A label such as drawer 0 identifies which drawer to open; a second number identifies which compartment inside that drawer to inspect. Opening cabinet[1][2] is not one magical jump. It is two actions: open drawer 1, then inspect compartment 2. If drawer 1 has only two compartments, compartment 2 does not exist because counting begins at zero.',
        'Imagine um armário. O próprio armário é a lista externa. Cada gaveta é uma lista interna. Um rótulo como gaveta 0 identifica qual gaveta abrir; um segundo número identifica qual compartimento dentro dela consultar. Abrir armario[1][2] não é um salto mágico. São duas ações: abrir a gaveta 1 e depois consultar o compartimento 2. Se a gaveta 1 possui apenas dois compartimentos, o compartimento 2 não existe porque a contagem começa em zero.',
      ),
      text(
        'The analogy also explains data shape. A rectangular cabinet has the same number of compartments in every drawer. A ragged cabinet has drawers with different sizes. Python allows both. Your program must decide whether ragged rows are valid or an error. That decision belongs in the contract of the function, not in a comment added after a failure.',
        'A analogia também explica o formato dos dados. Um armário retangular possui a mesma quantidade de compartimentos em todas as gavetas. Um armário irregular possui gavetas de tamanhos diferentes. Python permite os dois. Seu programa precisa decidir se linhas irregulares são válidas ou um erro. Essa decisão pertence ao contrato da função, não a um comentário adicionado depois de uma falha.',
      ),
      heading('🐍 Fundamentals 1 — build and inspect the shape', '🐍 Fundamentos 1 — construa e inspecione o formato'),
      code(
        `# A small cinema seating map: 1 means occupied, 0 means free.
seats = [
    [1, 0, 0, 1],
    [1, 1, 0, 0],
    [0, 0, 0, 1],
]

print(len(seats))       # number of rows: 3
print(len(seats[0]))    # columns in the first row: 4
print(seats[1])         # complete second row
print(seats[1][2])      # row 1, column 2 -> 0`,
        `# Um pequeno mapa de assentos: 1 significa ocupado, 0 significa livre.
assentos = [
    [1, 0, 0, 1],
    [1, 1, 0, 0],
    [0, 0, 0, 1],
]

print(len(assentos))       # quantidade de linhas: 3
print(len(assentos[0]))    # colunas na primeira linha: 4
print(assentos[1])         # segunda linha completa
print(assentos[1][2])      # linha 1, coluna 2 -> 0`,
      ),
      text(
        'Always write the shape beside sample data when positions carry meaning. Here every row is a cinema row and every column is a seat. In less obvious data, create named constants such as NAME = 0 and SCORE = 1, or move to dictionaries in the next phase. Nested lists are useful, but numeric positions become fragile when the record has many fields.',
        'Sempre escreva o formato ao lado dos dados de exemplo quando as posições possuem significado. Aqui cada lista interna é uma fileira do cinema e cada coluna é um assento. Em dados menos óbvios, crie constantes como NOME = 0 e NOTA = 1, ou avance para dicionários na próxima fase. Listas aninhadas são úteis, mas posições numéricas ficam frágeis quando o registro possui muitos campos.',
      ),
      heading('🐍 Fundamentals 2 — loop through rows and cells', '🐍 Fundamentos 2 — percorra linhas e células'),
      code(
        `temperatures = [
    [18, 20, 22],
    [17, 19, 21],
]

for day_index, day in enumerate(temperatures):
    print("day", day_index)
    for hour_index, value in enumerate(day):
        print(" hour", hour_index, "=", value)`,
        `temperaturas = [
    [18, 20, 22],
    [17, 19, 21],
]

for indice_dia, dia in enumerate(temperaturas):
    print("dia", indice_dia)
    for indice_hora, valor in enumerate(dia):
        print(" hora", indice_hora, "=", valor)`,
      ),
      text(
        'The outer loop receives one complete row. The inner loop receives one cell from that row. Name variables according to the level they represent: table, row and cell are clearer than x, y and z. enumerate is useful when the position itself matters, but avoid it when you need only the value. Every extra index is another opportunity to confuse row and column.',
        'O loop externo recebe uma linha completa. O loop interno recebe uma célula daquela linha. Nomeie variáveis de acordo com o nível representado: tabela, linha e celula são mais claros que x, y e z. enumerate é útil quando a posição importa, mas evite quando você precisa apenas do valor. Cada índice extra é outra oportunidade de confundir linha e coluna.',
      ),
      heading('🐍 Fundamentals 3 — calculate without changing the source', '🐍 Fundamentos 3 — calcule sem alterar a origem'),
      code(
        `orders = [
    ["A-10", 3, 12.50],
    ["B-20", 1, 99.00],
    ["C-30", 4, 8.00],
]

total = 0.0
for order in orders:
    quantity = order[1]
    unit_price = order[2]
    total += quantity * unit_price

print(round(total, 2))  # 168.5
print(orders[0])        # source row was not changed`,
        `pedidos = [
    ["A-10", 3, 12.50],
    ["B-20", 1, 99.00],
    ["C-30", 4, 8.00],
]

total = 0.0
for pedido in pedidos:
    quantidade = pedido[1]
    preco_unitario = pedido[2]
    total += quantidade * preco_unitario

print(round(total, 2))  # 168.5
print(pedidos[0])       # a linha original não foi alterada`,
      ),
      text(
        'A reliable calculation reads from the input and stores the result in a new accumulator. Mutating the original rows may surprise other parts of the program. When mutation is required, make it explicit in the function name or return a copied table. A beginner often changes order[2] to hold a subtotal and later wonders why the original price disappeared.',
        'Um cálculo confiável lê a entrada e guarda o resultado em um novo acumulador. Alterar as linhas originais pode surpreender outras partes do programa. Quando a mutação for necessária, deixe isso explícito no nome da função ou retorne uma cópia da tabela. Um iniciante frequentemente altera pedido[2] para guardar um subtotal e depois não entende por que o preço original desapareceu.',
      ),
      heading('🏗️ Real scenario 1 — restaurant prep matrix', '🏗️ Cenário real 1 — matriz de preparo de restaurante'),
      text(
        'A kitchen tracks ingredient quantities by recipe. Each row contains recipe name, portions requested and minutes per portion. The program must calculate workload and flag recipes that exceed the current preparation window. This is a good nested-list problem because every row has the same compact shape and the calculation is position based.',
        'Uma cozinha acompanha quantidades por receita. Cada linha contém nome da receita, porções solicitadas e minutos por porção. O programa precisa calcular a carga de trabalho e sinalizar receitas que ultrapassam a janela atual de preparo. Esse é um bom problema de lista aninhada porque todas as linhas possuem o mesmo formato compacto e o cálculo depende das posições.',
      ),
      code(
        `recipes = [
    ["pasta", 8, 6],
    ["soup", 5, 4],
    ["dessert", 12, 3],
]

for recipe in recipes:
    name, portions, minutes_each = recipe
    workload = portions * minutes_each
    status = "review" if workload > 40 else "scheduled"
    print(name, workload, status)`,
        `receitas = [
    ["massa", 8, 6],
    ["sopa", 5, 4],
    ["sobremesa", 12, 3],
]

for receita in receitas:
    nome, porcoes, minutos_por_porcao = receita
    carga = porcoes * minutos_por_porcao
    status = "revisar" if carga > 40 else "agendado"
    print(nome, carga, status)`,
      ),
      text(
        'Unpacking gives names to positions and makes the rule readable. It also validates row length: a row with too few or too many items raises ValueError during unpacking. That failure is useful evidence that the imported table does not match the promised schema.',
        'O desempacotamento dá nomes às posições e torna a regra legível. Ele também valida o tamanho da linha: uma linha com itens de menos ou de mais gera ValueError durante o desempacotamento. Essa falha é uma evidência útil de que a tabela importada não corresponde ao formato prometido.',
      ),
      heading('🏗️ Real scenario 2 — construction material grid', '🏗️ Cenário real 2 — grade de materiais da construção'),
      text(
        'A site stores deliveries as [material, expected, received]. The program reports shortages without modifying the delivery sheet. Negative received quantities are invalid and should be rejected before the shortage is calculated. This adds a professional boundary: data structures do not remove the need for validation.',
        'Uma obra armazena entregas como [material, esperado, recebido]. O programa informa faltas sem alterar a planilha de entrega. Quantidades recebidas negativas são inválidas e precisam ser rejeitadas antes do cálculo. Isso adiciona uma fronteira profissional: estruturas de dados não eliminam a necessidade de validação.',
      ),
      code(
        `deliveries = [
    ["cement", 120, 118],
    ["brick", 2000, 1850],
    ["steel", 40, 40],
]

for material, expected, received in deliveries:
    if received < 0:
        raise ValueError("received quantity cannot be negative")
    shortage = max(expected - received, 0)
    print(material, shortage)`,
        `entregas = [
    ["cimento", 120, 118],
    ["tijolo", 2000, 1850],
    ["aco", 40, 40],
]

for material, esperado, recebido in entregas:
    if recebido < 0:
        raise ValueError("quantidade recebida não pode ser negativa")
    falta = max(esperado - recebido, 0)
    print(material, falta)`,
      ),
      heading('⚠️ Common errors and the real Python message', '⚠️ Erros comuns e a mensagem real do Python'),
      warning(
        '1) IndexError: list index out of range — you selected a row or column that does not exist. Print len(table) and len(row) before guessing.\n\n2) TypeError: list indices must be integers or slices, not str — you tried table["name"]. A nested list uses numeric positions; named keys belong to dictionaries.\n\n3) ValueError: not enough values to unpack — an imported row has fewer fields than the contract. Validate row length or reject the malformed data.\n\n4) Accidental aliasing — grid = [[0] * 3] * 3 reuses the same inner list three times. Changing one row changes all rows. Build independent rows with [[0] * 3 for _ in range(3)].',
        '1) IndexError: list index out of range — você selecionou uma linha ou coluna inexistente. Imprima len(tabela) e len(linha) antes de adivinhar.\n\n2) TypeError: list indices must be integers or slices, not str — você tentou tabela["nome"]. Lista aninhada usa posições numéricas; chaves nomeadas pertencem a dicionários.\n\n3) ValueError: not enough values to unpack — uma linha importada possui menos campos que o contrato. Valide o tamanho ou rejeite o dado malformado.\n\n4) Compartilhamento acidental — grade = [[0] * 3] * 3 reutiliza a mesma lista interna três vezes. Alterar uma linha altera todas. Construa linhas independentes com [[0] * 3 for _ in range(3)].',
      ),
      heading('💡 Pro tip — make the shape executable', '💡 Dica pro — torne o formato executável'),
      tip(
        'Write small validation functions such as validate_rows(rows, expected_columns). A comment can become outdated; a validation function fails at the boundary and tells you which row broke the contract. For important records, dictionaries or typed objects are usually safer than many numeric positions. Nested lists remain excellent for true grids and matrices.',
        'Escreva pequenas funções de validação como validar_linhas(linhas, colunas_esperadas). Um comentário pode ficar desatualizado; uma função de validação falha na fronteira e informa qual linha quebrou o contrato. Para registros importantes, dicionários ou objetos tipados normalmente são mais seguros que muitas posições numéricas. Listas aninhadas continuam excelentes para grades e matrizes reais.',
      ),
      heading('📋 Recap and bridge to dictionaries', '📋 Resumo e ponte para dicionários'),
      text(
        'You can now describe a nested list as an outer collection of rows, follow two indexes one step at a time, traverse rows and cells, unpack fixed-shape rows, detect ragged data and avoid accidental mutation. Use nested lists when position is genuinely meaningful, such as a board or matrix. In the next phase, dictionaries replace mysterious positions with named keys, making business records easier to read and change.',
        'Agora você consegue descrever uma lista aninhada como coleção externa de linhas, seguir dois índices um passo por vez, percorrer linhas e células, desempacotar linhas de formato fixo, detectar dados irregulares e evitar mutação acidental. Use listas aninhadas quando a posição realmente possui significado, como tabuleiro ou matriz. Na próxima fase, dicionários substituem posições misteriosas por chaves nomeadas, deixando registros de negócio mais fáceis de ler e alterar.',
      ),
    ],
  },
  exercises: [
    exercise(
      'p9-guided-cell',
      b('🟢 Guided — read one cell safely', '🟢 Guiado — leia uma célula com segurança'),
      b('Complete cell_at so it returns the value at the requested row and column.', 'Complete cell_at para retornar o valor da linha e coluna solicitadas.'),
      `def cell_at(table, row, column):
    # First select the row, then select the column.
    return table[___][___]`,
      b('blue', 'blue'),
      [
        b('Replace the first blank with row and the second with column.', 'Substitua a primeira lacuna por row e a segunda por column.'),
        b('Read table[row] first; its result is another list.', 'Leia table[row] primeiro; o resultado é outra lista.'),
        b('Do not print the sample answer. Return the selected value.', 'Não imprima a resposta do exemplo. Retorne o valor selecionado.'),
      ],
      phase9Requirements,
      exactTest('p9-guided-visible', b('Reads a normal rectangular table', 'Lê uma tabela retangular normal'), `print(cell_at([["red", "blue"], ["green", "yellow"]], 0, 1))`, b('blue', 'blue'), 60, phase9Requirements),
      exactTest('p9-guided-hidden-accent', b('Preserves an accented value in another position', 'Preserva um valor acentuado em outra posição'), `print(cell_at([["cafe"], ["ação"]], 1, 0))`, b('ação', 'ação'), 40, phase9Requirements, true),
      'guided',
      b('Follow two indexes in the correct order.', 'Seguir dois índices na ordem correta.'),
      b('Reading a cell from an imported grid or test fixture.', 'Leitura de uma célula de uma grade importada ou dado de teste.'),
      { en: ['Returns instead of printing', 'Uses row and column parameters', 'Works with text values'], pt: ['Retorna em vez de imprimir', 'Usa os parâmetros de linha e coluna', 'Funciona com valores de texto'] },
      { en: ['Swapping row and column', 'Using a string key', 'Hardcoding blue'], pt: ['Trocar linha e coluna', 'Usar uma chave de texto', 'Fixar azul no código'] },
    ),
    exercise(
      'p9-complete-column',
      b('🟡 Complete — collect one column', '🟡 Complete — colete uma coluna'),
      b('Finish column_values. It must return a new list containing one selected column from every row.', 'Termine column_values. Ela deve retornar uma nova lista com a coluna selecionada de cada linha.'),
      `def column_values(table, column):
    values = []
    for row in table:
        # Add the selected cell from this row.
        ___
    return values`,
      b("['Ana', 'Beto', 'Caio']", "['Ana', 'Beto', 'Caio']"),
      [
        b('Inside the loop, row is one inner list.', 'Dentro do loop, row é uma lista interna.'),
        b('Append row[column], not table[column].', 'Adicione row[column], não table[column].'),
        b('An empty table should naturally return an empty list.', 'Uma tabela vazia deve retornar naturalmente uma lista vazia.'),
      ],
      [{ kind: 'function', value: 'column_values' }, { kind: 'node', value: 'For' }, { kind: 'call', value: 'append' }],
      exactTest('p9-column-visible', b('Collects names from three rows', 'Coleta nomes de três linhas'), `print(column_values([[1, "Ana"], [2, "Beto"], [3, "Caio"]], 1))`, b("['Ana', 'Beto', 'Caio']", "['Ana', 'Beto', 'Caio']"), 60, [{ kind: 'function', value: 'column_values' }, { kind: 'node', value: 'For' }, { kind: 'call', value: 'append' }]),
      exactTest('p9-column-hidden-empty', b('Handles an empty table', 'Trata uma tabela vazia'), `print(column_values([], 0))`, b('[]', '[]'), 40, [{ kind: 'function', value: 'column_values' }, { kind: 'node', value: 'For' }], true),
      'independent',
      b('Traverse every row without changing the original table.', 'Percorrer todas as linhas sem alterar a tabela original.'),
      b('Extracting a field from rows loaded from a CSV file.', 'Extração de um campo de linhas carregadas de CSV.'),
      { en: ['Creates a new result list', 'Visits every row', 'Returns [] for empty input'], pt: ['Cria uma nova lista de resultado', 'Visita todas as linhas', 'Retorna [] para entrada vazia'] },
      { en: ['Indexing the outer table instead of the current row', 'Returning inside the loop', 'Mutating source rows'], pt: ['Indexar a tabela externa em vez da linha atual', 'Retornar dentro do loop', 'Alterar as linhas de origem'] },
    ),
    exercise(
      'p9-zero-approved-total',
      b('🔴 From scratch — calculate from structured rows', '🔴 Do zero — calcule com linhas estruturadas'),
      b('Create approved_total(rows, deductible). Rows use [name, amount, status]. Sum max(amount - deductible, 0) only for approved rows.', 'Crie approved_total(rows, deductible). As linhas usam [nome, valor, status]. Some max(valor - franquia, 0) apenas para linhas aprovadas.'),
      `def approved_total(rows, deductible):
    # Write the complete solution.
    pass`,
      b('7700', '7700'),
      [
        b('Start total at zero before the loop.', 'Comece total em zero antes do loop.'),
        b('Unpack each row into name, amount and status.', 'Desempacote cada linha em nome, valor e status.'),
        b('Use max so a small amount never creates a negative contribution.', 'Use max para um valor pequeno nunca criar contribuição negativa.'),
      ],
      [{ kind: 'function', value: 'approved_total' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }, { kind: 'node', value: 'Return' }],
      exactTest('p9-total-visible', b('Calculates two approved rows', 'Calcula duas linhas aprovadas'), `print(approved_total([["Ana", 3200, "approved"], ["Beto", 900, "pending"], ["Caio", 5100, "approved"]], 300))`, b('7700', '7700'), 60, [{ kind: 'function', value: 'approved_total' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }]),
      exactTest('p9-total-hidden-large', b('Generalizes to a large value and protects the lower boundary', 'Generaliza para valor grande e protege o limite inferior'), `print(approved_total([["Mega", 1000000, "approved"], ["Small", 100, "approved"]], 250))`, b('999750', '999750'), 40, [{ kind: 'function', value: 'approved_total' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }], true),
      'independent',
      b('Combine row unpacking, filtering and accumulation.', 'Combinar desempacotamento, filtro e acumulação.'),
      b('Calculating totals from compact imported records.', 'Cálculo de totais a partir de registros compactos importados.'),
      { en: ['Uses every parameter', 'Filters by status', 'Never adds a negative payout'], pt: ['Usa todos os parâmetros', 'Filtra pelo status', 'Nunca soma pagamento negativo'] },
      { en: ['Subtracting deductible from pending rows', 'Returning after the first row', 'Hardcoding 7700'], pt: ['Subtrair franquia de linhas pendentes', 'Retornar após a primeira linha', 'Fixar 7700 no código'] },
    ),
    exercise(
      'p9-transfer',
      b('🟣 Challenge — transpose a rectangular grid', '🟣 Desafio — transponha uma grade retangular'),
      b('Write transpose_grid(grid). Rows become columns. Return [] for an empty grid and raise ValueError("ragged grid") when row lengths differ.', 'Escreva transpose_grid(grid). Linhas viram colunas. Retorne [] para grade vazia e gere ValueError("ragged grid") quando os tamanhos das linhas forem diferentes.'),
      `def transpose_grid(grid):
    # Validate the shape, then build a new nested list.
    pass`,
      b('[[1, 4], [2, 5], [3, 6]]', '[[1, 4], [2, 5], [3, 6]]'),
      [
        b('If grid is empty, return [] before reading grid[0].', 'Se grid estiver vazia, retorne [] antes de ler grid[0].'),
        b('Compare every row length with len(grid[0]).', 'Compare o tamanho de cada linha com len(grid[0]).'),
        b('For each column index, collect that cell from every row.', 'Para cada índice de coluna, colete essa célula de todas as linhas.'),
      ],
      [{ kind: 'function', value: 'transpose_grid' }, { kind: 'node', value: 'For', minCount: 2 }, { kind: 'node', value: 'If' }, { kind: 'node', value: 'Raise' }],
      exactTest('p9-transpose-visible', b('Transposes a two by three grid', 'Transpõe uma grade dois por três'), `print(transpose_grid([[1, 2, 3], [4, 5, 6]]))`, b('[[1, 4], [2, 5], [3, 6]]', '[[1, 4], [2, 5], [3, 6]]'), 60, [{ kind: 'function', value: 'transpose_grid' }, { kind: 'node', value: 'For', minCount: 2 }]),
      exactTest('p9-transpose-hidden-ragged', b('Rejects rows with different lengths', 'Rejeita linhas com tamanhos diferentes'), `try:
    transpose_grid([[1, 2], [3]])
except ValueError as error:
    print(error)`, b('ragged grid', 'ragged grid'), 40, [{ kind: 'function', value: 'transpose_grid' }, { kind: 'node', value: 'Raise' }], true),
      'challenge',
      b('Validate a two-dimensional contract before transforming data.', 'Validar um contrato bidimensional antes de transformar dados.'),
      b('Rotating a grid, matrix or imported report for another consumer.', 'Rotação de grade, matriz ou relatório importado para outro consumidor.'),
      { en: ['Returns a new grid', 'Handles empty input', 'Rejects ragged rows'], pt: ['Retorna uma nova grade', 'Trata entrada vazia', 'Rejeita linhas irregulares'] },
      { en: ['Reading grid[0] before the empty check', 'Reusing the same output row', 'Silently dropping cells'], pt: ['Ler grid[0] antes de verificar vazio', 'Reutilizar a mesma linha de saída', 'Descartar células silenciosamente'] },
    ),
  ],
  quiz: [
    { id: 'q9-v11-1', question: b('For table = [[10, 20], [30, 40]], what does table[1][0] return?', 'Para table = [[10, 20], [30, 40]], o que table[1][0] retorna?'), options: [b('30', '30'), b('20', '20'), b('[30, 40]', '[30, 40]'), b('40', '40')], correctIndex: 0, explanation: b('table[1] selects the second row [30, 40]; [0] then selects its first value, 30.', 'table[1] seleciona a segunda linha [30, 40]; [0] então seleciona seu primeiro valor, 30.') },
    { id: 'q9-v11-2', question: b('Why can [[0] * 3] * 3 be dangerous?', 'Por que [[0] * 3] * 3 pode ser perigoso?'), options: [b('All rows reference the same inner list', 'Todas as linhas referenciam a mesma lista interna'), b('It creates a tuple', 'Ele cria uma tupla'), b('Python limits grids to two rows', 'Python limita grades a duas linhas'), b('Multiplication removes zeros', 'A multiplicação remove zeros')], correctIndex: 0, explanation: b('The outer multiplication repeats references to one inner list. Mutating one row therefore appears in every row.', 'A multiplicação externa repete referências para uma única lista interna. Alterar uma linha aparece em todas.') },
    { id: 'q9-v11-3', question: b('What does unpacking name, amount, status = row validate?', 'O que o desempacotamento nome, valor, status = linha valida?'), options: [b('That the row has exactly three values', 'Que a linha possui exatamente três valores'), b('That every value is text', 'Que todo valor é texto'), b('That the table is sorted', 'Que a tabela está ordenada'), b('That amount is positive', 'Que valor é positivo')], correctIndex: 0, explanation: b('Sequence unpacking requires the number of values to match the number of target variables. Types and business rules still need separate validation.', 'O desempacotamento exige que a quantidade de valores corresponda às variáveis. Tipos e regras de negócio ainda precisam de validação separada.') },
    { id: 'q9-v11-4', question: b('When is a dictionary usually safer than a nested list row?', 'Quando um dicionário normalmente é mais seguro que uma linha de lista aninhada?'), options: [b('When fields have business names and may evolve', 'Quando os campos possuem nomes de negócio e podem evoluir'), b('When making a true pixel grid', 'Ao criar uma grade real de pixels'), b('When every row is only coordinates', 'Quando toda linha possui apenas coordenadas'), b('Never; lists are always safer', 'Nunca; listas são sempre mais seguras')], correctIndex: 0, explanation: b('Named fields reduce dependence on mysterious numeric positions and make schema changes easier to review.', 'Campos nomeados reduzem dependência de posições numéricas misteriosas e facilitam revisar mudanças de formato.') },
  ],
  exam: {
    title: b('Delivery matrix report', 'Relatório de matriz de entregas'),
    scenario: b('Build a reusable summary for rows in the shape [route, planned, delivered]. Reject negative quantities, count complete routes and return total missing packages.', 'Crie um resumo reutilizável para linhas no formato [rota, planejado, entregue]. Rejeite quantidades negativas, conte rotas completas e retorne o total de pacotes faltantes.'),
    requirements: {
      en: ['Define delivery_summary(rows)', 'Use a loop and unpack every row', 'Raise ValueError("negative quantity") for negative planned or delivered values', 'A route is complete when delivered is at least planned', 'Return [complete_routes, missing_packages]'],
      pt: ['Defina delivery_summary(rows)', 'Use um loop e desempacote cada linha', 'Gere ValueError("negative quantity") para valores planejados ou entregues negativos', 'Uma rota está completa quando entregue é pelo menos planejado', 'Retorne [rotas_completas, pacotes_faltando]'],
    },
    starterCode: `def delivery_summary(rows):
    # Return [complete_routes, missing_packages].
    pass`,
    expectedOutput: b('[2, 3]', '[2, 3]'),
    testCases: [
      exactTest('p9-exam-visible', b('Summarizes normal delivery rows', 'Resume linhas normais de entrega'), `print(delivery_summary([["north", 10, 10], ["south", 8, 5], ["east", 4, 6]]))`, b('[2, 3]', '[2, 3]'), 60, [{ kind: 'function', value: 'delivery_summary' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }]),
      exactTest('p9-exam-empty', b('Returns zero totals for an empty table', 'Retorna totais zero para tabela vazia'), `print(delivery_summary([]))`, b('[0, 0]', '[0, 0]'), 20, [{ kind: 'function', value: 'delivery_summary' }, { kind: 'node', value: 'Return' }], true),
      exactTest('p9-exam-negative', b('Rejects a negative quantity', 'Rejeita quantidade negativa'), `try:
    delivery_summary([["invalid", 5, -1]])
except ValueError as error:
    print(error)`, b('negative quantity', 'negative quantity'), 20, [{ kind: 'function', value: 'delivery_summary' }, { kind: 'node', value: 'Raise' }], true),
    ],
  },
}

const phase10DictRequirements: CodeRequirement[] = [
  { kind: 'function', value: 'product_label' },
  { kind: 'node', value: 'Subscript' },
]

export const phase10: Phase = {
  id: 10,
  title: b('Dictionaries', 'Dicionários'),
  description: b('Model records with named keys, update them deliberately and handle missing information without hiding data errors.', 'Modele registros com chaves nomeadas, atualize-os de forma deliberada e trate informações ausentes sem esconder erros de dados.'),
  icon: '📖',
  libraries: [],
  track: 'core',
  stage: 'base',
  estimatedHours: 6,
  lesson: {
    title: b('Dictionaries: readable records and explicit contracts', 'Dicionários: registros legíveis e contratos explícitos'),
    blocks: [
      heading('🌍 World hook — the shape of messages and configuration', '🌍 Gancho do mundo real — o formato de mensagens e configurações'),
      text(
        'Modern applications exchange named data. A weather response has temperature, city and timestamp. A game profile has player, level and inventory. A configuration file has language, theme and retry limit. Dictionaries model these records directly: each key names a meaning and each value stores the current data. They are the foundation of JSON, API responses, document databases and many test fixtures.',
        'Aplicações modernas trocam dados nomeados. Uma resposta de clima possui temperatura, cidade e horário. Um perfil de jogo possui jogador, nível e inventário. Um arquivo de configuração possui idioma, tema e limite de tentativas. Dicionários modelam esses registros diretamente: cada chave nomeia um significado e cada valor guarda o dado atual. Eles são a base de JSON, respostas de API, bancos de documentos e muitos dados de teste.',
      ),
      text(
        'A dictionary is not merely a list with words instead of numbers. It represents a mapping: one unique key points to one value. Keys are commonly strings, but immutable values such as numbers and tuples can also be keys. Values may be any Python object, including lists and other dictionaries. The professional decision is choosing stable, descriptive keys and defining which keys are required or optional.',
        'Um dicionário não é apenas uma lista com palavras no lugar de números. Ele representa um mapeamento: uma chave única aponta para um valor. Chaves normalmente são textos, mas valores imutáveis como números e tuplas também podem ser chaves. Valores podem ser qualquer objeto Python, inclusive listas e outros dicionários. A decisão profissional é escolher chaves estáveis e descritivas e definir quais são obrigatórias ou opcionais.',
      ),
      heading('🧩 Physical analogy — labeled lockers', '🧩 Analogia física — armários etiquetados'),
      text(
        'Imagine a wall of lockers. A key label such as employee_id opens exactly one locker and reveals its value. You do not count from the left; you ask for the labeled locker. Assigning dictionary["status"] = "ready" replaces what is inside the status locker. Deleting the key removes the locker from the current map. Asking for an absent required key with square brackets raises KeyError, which is often the correct signal that the record violated its contract.',
        'Imagine uma parede de armários. Uma etiqueta como id_funcionario abre exatamente um armário e revela seu valor. Você não conta da esquerda; solicita o armário etiquetado. Atribuir dicionario["status"] = "pronto" substitui o conteúdo do armário status. Excluir a chave remove esse armário do mapa atual. Solicitar uma chave obrigatória ausente com colchetes gera KeyError, muitas vezes o sinal correto de que o registro quebrou seu contrato.',
      ),
      text(
        'The get method is like asking a receptionist: if the locker does not exist, return a chosen fallback instead of raising an error. That is useful only for genuinely optional data. Using get for every field can silently turn corrupted records into incorrect calculations. Required data should normally use brackets or explicit validation.',
        'O método get é como perguntar a uma recepcionista: se o armário não existe, retorne um valor alternativo em vez de gerar erro. Isso é útil apenas para dados realmente opcionais. Usar get em todos os campos pode transformar registros corrompidos em cálculos incorretos sem aviso. Dados obrigatórios normalmente devem usar colchetes ou validação explícita.',
      ),
      heading('🐍 Fundamentals 1 — create and read named values', '🐍 Fundamentos 1 — crie e leia valores nomeados'),
      code(
        `book = {
    "title": "Clean Code",
    "pages": 464,
    "available": True,
}

print(book["title"])
print(book["pages"])
print(book.get("language", "unknown"))`,
        `livro = {
    "titulo": "Código Limpo",
    "paginas": 464,
    "disponivel": True,
}

print(livro["titulo"])
print(livro["paginas"])
print(livro.get("idioma", "desconhecido"))`,
      ),
      text(
        'Keys are case sensitive: "title" and "Title" are different. Prefer one naming convention, usually lowercase snake_case. A consistent schema lets functions and tests agree. If external data uses another convention, normalize it once at the boundary instead of scattering multiple spellings through the program.',
        'Chaves diferenciam maiúsculas de minúsculas: "titulo" e "Titulo" são diferentes. Prefira uma convenção, normalmente snake_case em minúsculas. Um formato consistente permite que funções e testes concordem. Se dados externos usam outra convenção, normalize uma vez na fronteira em vez de espalhar grafias diferentes pelo programa.',
      ),
      heading('🐍 Fundamentals 2 — update, add and copy', '🐍 Fundamentos 2 — atualize, adicione e copie'),
      code(
        `profile = {"name": "Maya", "level": 4}
profile["level"] = 5          # update an existing key
profile["premium"] = True     # add a new key

snapshot = profile.copy()     # shallow independent dictionary
snapshot["level"] = 6

print(profile)
print(snapshot)`,
        `perfil = {"nome": "Maya", "nivel": 4}
perfil["nivel"] = 5          # atualiza uma chave existente
perfil["premium"] = True     # adiciona uma nova chave

foto = perfil.copy()          # dicionário superficial independente
foto["nivel"] = 6

print(perfil)
print(foto)`,
      ),
      text(
        'Assignment does not copy: backup = profile creates a second name for the same dictionary. Changing backup then changes profile. copy creates a new outer dictionary, but nested lists or dictionaries are still shared. Later you will learn deeper copying strategies. For now, recognize whether your function promises to mutate the input or return a changed copy.',
        'Atribuição não copia: backup = perfil cria um segundo nome para o mesmo dicionário. Alterar backup então altera perfil. copy cria um novo dicionário externo, mas listas ou dicionários internos ainda são compartilhados. Depois você aprenderá estratégias de cópia profunda. Por enquanto, reconheça se sua função promete alterar a entrada ou retornar uma cópia modificada.',
      ),
      heading('🐍 Fundamentals 3 — iterate over keys and values', '🐍 Fundamentos 3 — percorra chaves e valores'),
      code(
        `stock = {"rice": 12, "beans": 8, "oil": 3}

for product, quantity in stock.items():
    status = "low" if quantity < 5 else "ok"
    print(product, quantity, status)

print(list(stock.keys()))
print(sum(stock.values()))`,
        `estoque = {"arroz": 12, "feijao": 8, "oleo": 3}

for produto, quantidade in estoque.items():
    status = "baixo" if quantidade < 5 else "ok"
    print(produto, quantidade, status)

print(list(estoque.keys()))
print(sum(estoque.values()))`,
      ),
      text(
        'Iterating directly over a dictionary yields keys. items yields key-value pairs. values yields only values. Choose the method that matches the contract instead of repeatedly indexing the dictionary inside the loop. Do not add or remove keys while iterating over the same dictionary; create a list of changes first or iterate over list(dictionary.items()).',
        'Percorrer diretamente um dicionário produz chaves. items produz pares chave-valor. values produz apenas valores. Escolha o método que corresponde ao contrato em vez de indexar repetidamente o dicionário dentro do loop. Não adicione nem remova chaves enquanto percorre o mesmo dicionário; crie uma lista de alterações primeiro ou percorra list(dicionario.items()).',
      ),
      heading('🏗️ Real scenario 1 — e-commerce product record', '🏗️ Cenário real 1 — registro de produto de e-commerce'),
      text(
        'An online shop receives a product record with required sku, name, price and stock, plus an optional discount. The calculation must reject negative prices and stock, then return a new summary without mutating the imported record. Named keys make the business rule visible and easier to review than positions 0, 1, 2 and 3.',
        'Uma loja online recebe um registro de produto com sku, nome, preço e estoque obrigatórios, além de desconto opcional. O cálculo precisa rejeitar preço e estoque negativos e retornar um novo resumo sem alterar o registro importado. Chaves nomeadas deixam a regra visível e mais fácil de revisar que posições 0, 1, 2 e 3.',
      ),
      code(
        `product = {
    "sku": "KB-10",
    "name": "Keyboard",
    "price": 80.0,
    "stock": 7,
    "discount": 0.10,
}

if product["price"] < 0 or product["stock"] < 0:
    raise ValueError("negative product value")

final_price = product["price"] * (1 - product.get("discount", 0))
summary = {
    "sku": product["sku"],
    "available": product["stock"] > 0,
    "final_price": round(final_price, 2),
}
print(summary)`,
        `produto = {
    "sku": "TC-10",
    "nome": "Teclado",
    "preco": 80.0,
    "estoque": 7,
    "desconto": 0.10,
}

if produto["preco"] < 0 or produto["estoque"] < 0:
    raise ValueError("valor negativo no produto")

preco_final = produto["preco"] * (1 - produto.get("desconto", 0))
resumo = {
    "sku": produto["sku"],
    "disponivel": produto["estoque"] > 0,
    "preco_final": round(preco_final, 2),
}
print(resumo)`,
      ),
      heading('🏗️ Real scenario 2 — administrative health appointment', '🏗️ Cenário real 2 — agendamento administrativo de saúde'),
      text(
        'A scheduling system stores administrative data only: appointment id, patient display name, time and confirmation status. The program updates confirmation in a copied record and keeps the original event for audit history. No sensitive clinical information is needed to learn the structure.',
        'Um sistema de agenda armazena apenas dados administrativos: id do atendimento, nome de exibição, horário e status de confirmação. O programa atualiza a confirmação em uma cópia e mantém o evento original para histórico de auditoria. Nenhuma informação clínica sensível é necessária para aprender a estrutura.',
      ),
      code(
        `appointment = {
    "id": "A-204",
    "display_name": "João S.",
    "time": "14:30",
    "confirmed": False,
}

updated = appointment.copy()
updated["confirmed"] = True
updated["confirmation_channel"] = "sms"

print(appointment["confirmed"])  # False
print(updated["confirmed"])      # True`,
        `agendamento = {
    "id": "A-204",
    "nome_exibicao": "João S.",
    "horario": "14:30",
    "confirmado": False,
}

atualizado = agendamento.copy()
atualizado["confirmado"] = True
atualizado["canal_confirmacao"] = "sms"

print(agendamento["confirmado"])  # False
print(atualizado["confirmado"])   # True`,
      ),
      heading('⚠️ Common errors and the real Python message', '⚠️ Erros comuns e a mensagem real do Python'),
      warning(
        '1) KeyError: "price" — a required key is absent or misspelled. Inspect available keys and validate the schema; do not hide the error with an unrelated default.\n\n2) TypeError: unhashable type: list — a mutable list was used as a key. Use an immutable key such as a string or tuple.\n\n3) RuntimeError: dictionary changed size during iteration — keys were added or removed while looping. Collect changes first.\n\n4) Aliasing — copy = original was mistaken for a copy. Both names point to the same dictionary. Use original.copy() when a separate outer record is required.',
        '1) KeyError: "preco" — uma chave obrigatória está ausente ou escrita de forma diferente. Inspecione as chaves disponíveis e valide o formato; não esconda o erro com um padrão sem relação.\n\n2) TypeError: unhashable type: list — uma lista mutável foi usada como chave. Use chave imutável como texto ou tupla.\n\n3) RuntimeError: dictionary changed size during iteration — chaves foram adicionadas ou removidas durante o loop. Colete as mudanças primeiro.\n\n4) Compartilhamento — copia = original foi confundido com cópia. Os dois nomes apontam para o mesmo dicionário. Use original.copy() quando precisar de outro registro externo.',
      ),
      heading('💡 Pro tip — define required and optional keys', '💡 Dica pro — defina chaves obrigatórias e opcionais'),
      tip(
        'Write the record contract before the calculation. Required keys should fail clearly when missing; optional keys should have documented defaults. A small validator can compute missing = required - record.keys() and raise a precise ValueError. This turns an accidental KeyError deep inside a calculation into a useful boundary message.',
        'Escreva o contrato do registro antes do cálculo. Chaves obrigatórias devem falhar claramente quando ausentes; chaves opcionais precisam de padrões documentados. Um pequeno validador pode calcular ausentes = obrigatorias - registro.keys() e gerar um ValueError preciso. Isso transforma um KeyError acidental dentro do cálculo em uma mensagem útil na fronteira.',
      ),
      heading('📋 Recap and bridge to lists of dictionaries', '📋 Resumo e ponte para listas de dicionários'),
      text(
        'You can now create readable records, distinguish required access from optional get, update keys, copy an outer dictionary, iterate with items and recognize common schema failures. One dictionary represents one record. Real applications normally contain many records, so the next phase combines a list for ordering with dictionaries for named fields.',
        'Agora você consegue criar registros legíveis, diferenciar acesso obrigatório de get opcional, atualizar chaves, copiar um dicionário externo, percorrer com items e reconhecer falhas comuns de formato. Um dicionário representa um registro. Aplicações reais normalmente possuem muitos registros, então a próxima fase combina uma lista para ordem com dicionários para campos nomeados.',
      ),
    ],
  },
  exercises: [
    exercise(
      'p10-guided-label',
      b('🟢 Guided — read named fields', '🟢 Guiado — leia campos nomeados'),
      b('Complete product_label to return "SKU - name" using dictionary keys.', 'Complete product_label para retornar "SKU - nome" usando chaves do dicionário.'),
      `def product_label(product):
    return product[___] + " - " + product[___]`,
      b('KB-10 - Keyboard', 'KB-10 - Keyboard'),
      [b('Use the string keys "sku" and "name".', 'Use as chaves de texto "sku" e "name".'), b('The function must use the received record.', 'A função precisa usar o registro recebido.'), b('Return the text; do not print a fixed example.', 'Retorne o texto; não imprima um exemplo fixo.')],
      phase10DictRequirements,
      exactTest('p10-label-visible', b('Formats a normal product', 'Formata um produto normal'), `print(product_label({"sku": "KB-10", "name": "Keyboard"}))`, b('KB-10 - Keyboard', 'KB-10 - Keyboard'), 60, phase10DictRequirements),
      exactTest('p10-label-hidden-accent', b('Preserves accented text', 'Preserva texto acentuado'), `print(product_label({"sku": "CF-1", "name": "Café"}))`, b('CF-1 - Café', 'CF-1 - Café'), 40, phase10DictRequirements, true),
      'guided',
      b('Access dictionary data by meaning instead of position.', 'Acessar dados do dicionário pelo significado em vez da posição.'),
      b('Building labels for products, tickets or media items.', 'Criação de rótulos para produtos, chamados ou itens de mídia.'),
      { en: ['Uses sku and name keys', 'Preserves text exactly', 'Returns a value'], pt: ['Usa as chaves sku e name', 'Preserva o texto exatamente', 'Retorna um valor'] },
      { en: ['Using indexes 0 and 1', 'Misspelling a key', 'Hardcoding the sample'], pt: ['Usar índices 0 e 1', 'Escrever uma chave incorreta', 'Fixar o exemplo'] },
    ),
    exercise(
      'p10-complete-stock',
      b('🟡 Complete — return an updated copy', '🟡 Complete — retorne uma cópia atualizada'),
      b('Finish sell_units. It must reject negative sold values, keep the original dictionary unchanged and never let stock go below zero.', 'Termine sell_units. Ela deve rejeitar venda negativa, manter o dicionário original intacto e nunca deixar o estoque abaixo de zero.'),
      `def sell_units(product, sold):
    if sold < 0:
        raise ValueError("negative sale")
    updated = ___
    updated["stock"] = max(updated["stock"] - sold, 0)
    return updated`,
      b("{'sku': 'A1', 'stock': 2}", "{'sku': 'A1', 'stock': 2}"),
      [b('Use product.copy() to create the outer copy.', 'Use product.copy() para criar a cópia externa.'), b('Only updated should receive the new stock.', 'Apenas updated deve receber o novo estoque.'), b('The hidden test checks the original record after the call.', 'O teste oculto verifica o registro original após a chamada.')],
      [{ kind: 'function', value: 'sell_units' }, { kind: 'call', value: 'copy' }, { kind: 'node', value: 'If' }, { kind: 'node', value: 'Raise' }],
      exactTest('p10-stock-visible', b('Updates stock in a returned copy', 'Atualiza estoque em uma cópia retornada'), `item = {"sku": "A1", "stock": 5}
print(sell_units(item, 3))`, b("{'sku': 'A1', 'stock': 2}", "{'sku': 'A1', 'stock': 2}"), 60, [{ kind: 'function', value: 'sell_units' }, { kind: 'call', value: 'copy' }]),
      exactTest('p10-stock-hidden-original', b('Protects original data and lower boundary', 'Protege dados originais e limite inferior'), `item = {"sku": "B2", "stock": 2}
print(sell_units(item, 10))
print(item)`, b("{'sku': 'B2', 'stock': 0}\n{'sku': 'B2', 'stock': 2}", "{'sku': 'B2', 'stock': 0}\n{'sku': 'B2', 'stock': 2}"), 40, [{ kind: 'function', value: 'sell_units' }, { kind: 'call', value: 'copy' }], true),
      'independent',
      b('Separate mutation of a copy from mutation of the source.', 'Separar mutação de uma cópia da mutação da origem.'),
      b('Applying inventory changes while preserving an imported snapshot.', 'Aplicação de mudanças de estoque preservando um retrato importado.'),
      { en: ['Raises for negative sold', 'Returns a new dictionary', 'Keeps stock non-negative'], pt: ['Gera erro para venda negativa', 'Retorna novo dicionário', 'Mantém estoque não negativo'] },
      { en: ['Using updated = product', 'Changing product directly', 'Allowing negative stock'], pt: ['Usar updated = product', 'Alterar product diretamente', 'Permitir estoque negativo'] },
    ),
    exercise(
      'p10-zero-required',
      b('🔴 From scratch — validate a dictionary contract', '🔴 Do zero — valide um contrato de dicionário'),
      b('Write calculate_total(order). Required keys are quantity and unit_price. Discount is optional and defaults to zero. Raise ValueError("missing keys") when required data is absent and ValueError("negative value") for negative numeric data.', 'Escreva calculate_total(order). As chaves obrigatórias são quantity e unit_price. Discount é opcional e vale zero por padrão. Gere ValueError("missing keys") quando faltar dado obrigatório e ValueError("negative value") para dado numérico negativo.'),
      `def calculate_total(order):
    pass`,
      b('45.0', '45.0'),
      [b('Build a set of required keys and compare it with order.keys().', 'Crie um conjunto de chaves obrigatórias e compare com order.keys().'), b('Read discount with get only after required keys are validated.', 'Leia discount com get somente após validar as chaves obrigatórias.'), b('Return quantity * unit_price * (1 - discount), rounded to two decimals.', 'Retorne quantity * unit_price * (1 - discount), arredondado em duas casas.')],
      [{ kind: 'function', value: 'calculate_total' }, { kind: 'node', value: 'If', minCount: 2 }, { kind: 'node', value: 'Raise' }, { kind: 'call', value: 'get' }],
      exactTest('p10-total-visible', b('Calculates an order with discount', 'Calcula um pedido com desconto'), `print(calculate_total({"quantity": 5, "unit_price": 10, "discount": 0.10}))`, b('45.0', '45.0'), 60, [{ kind: 'function', value: 'calculate_total' }, { kind: 'call', value: 'get' }, { kind: 'node', value: 'If' }]),
      exactTest('p10-total-hidden-missing', b('Rejects a missing required key', 'Rejeita uma chave obrigatória ausente'), `try:
    calculate_total({"quantity": 5})
except ValueError as error:
    print(error)`, b('missing keys', 'missing keys'), 40, [{ kind: 'function', value: 'calculate_total' }, { kind: 'node', value: 'Raise' }], true),
      'independent',
      b('Distinguish required keys from optional defaults.', 'Distinguir chaves obrigatórias de padrões opcionais.'),
      b('Validating orders or configuration records at an application boundary.', 'Validação de pedidos ou registros de configuração na fronteira da aplicação.'),
      { en: ['Validates schema before math', 'Uses optional discount safely', 'Rejects negatives'], pt: ['Valida o formato antes do cálculo', 'Usa desconto opcional com segurança', 'Rejeita negativos'] },
      { en: ['Using get for required fields', 'Treating missing data as zero', 'Ignoring negative discount'], pt: ['Usar get para campos obrigatórios', 'Tratar dado ausente como zero', 'Ignorar desconto negativo'] },
    ),
    exercise(
      'p10-transfer',
      b('🟣 Challenge — merge settings with an allow-list', '🟣 Desafio — combine configurações com lista permitida'),
      b('Write merge_settings(base, changes, allowed). Return a copied dictionary with only allowed keys applied. Raise ValueError("unknown setting") when changes contains any key outside allowed.', 'Escreva merge_settings(base, changes, allowed). Retorne uma cópia com apenas chaves permitidas aplicadas. Gere ValueError("unknown setting") quando changes contiver chave fora de allowed.'),
      `def merge_settings(base, changes, allowed):
    pass`,
      b("{'language': 'pt', 'theme': 'dark'}", "{'language': 'pt', 'theme': 'dark'}"),
      [b('Find unknown keys before updating anything.', 'Encontre chaves desconhecidas antes de atualizar qualquer coisa.'), b('Use a copy so a failed or successful merge does not mutate base.', 'Use uma cópia para uma combinação com falha ou sucesso não alterar base.'), b('dict.update can apply all validated changes.', 'dict.update pode aplicar todas as mudanças validadas.')],
      [{ kind: 'function', value: 'merge_settings' }, { kind: 'call', value: 'copy' }, { kind: 'call', value: 'update' }, { kind: 'node', value: 'Raise' }],
      exactTest('p10-merge-visible', b('Applies allowed settings', 'Aplica configurações permitidas'), `base = {"language": "en", "theme": "light"}
print(merge_settings(base, {"language": "pt", "theme": "dark"}, {"language", "theme"}))`, b("{'language': 'pt', 'theme': 'dark'}", "{'language': 'pt', 'theme': 'dark'}"), 60, [{ kind: 'function', value: 'merge_settings' }, { kind: 'call', value: 'copy' }, { kind: 'call', value: 'update' }]),
      exactTest('p10-merge-hidden-unknown', b('Rejects an unknown setting and keeps base unchanged', 'Rejeita configuração desconhecida e mantém base intacta'), `base = {"theme": "light"}
try:
    merge_settings(base, {"admin": True}, {"theme"})
except ValueError as error:
    print(error)
print(base)`, b("unknown setting\n{'theme': 'light'}", "unknown setting\n{'theme': 'light'}"), 40, [{ kind: 'function', value: 'merge_settings' }, { kind: 'node', value: 'Raise' }], true),
      'challenge',
      b('Protect configuration schemas from unexpected keys.', 'Proteger formatos de configuração contra chaves inesperadas.'),
      b('Applying user preferences or deployment settings safely.', 'Aplicação segura de preferências de usuário ou configurações de deploy.'),
      { en: ['Validates all changes first', 'Returns a copy', 'Applies only allowed keys'], pt: ['Valida todas as mudanças primeiro', 'Retorna uma cópia', 'Aplica apenas chaves permitidas'] },
      { en: ['Partially mutating before validation', 'Silently accepting unknown keys', 'Returning the original object'], pt: ['Alterar parcialmente antes de validar', 'Aceitar chaves desconhecidas silenciosamente', 'Retornar o objeto original'] },
    ),
  ],
  quiz: [
    { id: 'q10-v11-1', question: b('Which access is best for a required key named price?', 'Qual acesso é melhor para uma chave obrigatória chamada price?'), options: [b('record["price"]', 'record["price"]'), b('record.get("price", 0)', 'record.get("price", 0)'), b('record[0]', 'record[0]'), b('record.price', 'record.price')], correctIndex: 0, explanation: b('Square brackets fail clearly with KeyError when required data is missing. A zero default could hide a broken record.', 'Colchetes falham claramente com KeyError quando falta dado obrigatório. Um padrão zero poderia esconder um registro quebrado.') },
    { id: 'q10-v11-2', question: b('What does copy = original do for a dictionary?', 'O que copy = original faz para um dicionário?'), options: [b('Creates another reference to the same dictionary', 'Cria outra referência para o mesmo dicionário'), b('Creates a deep copy', 'Cria uma cópia profunda'), b('Converts it to JSON', 'Converte para JSON'), b('Freezes the dictionary', 'Congela o dicionário')], correctIndex: 0, explanation: b('Assignment binds another name to the same object. Use original.copy() for a separate outer dictionary.', 'A atribuição liga outro nome ao mesmo objeto. Use original.copy() para um dicionário externo separado.') },
    { id: 'q10-v11-3', question: b('What does for key, value in record.items() provide?', 'O que for key, value in record.items() fornece?'), options: [b('Each key-value pair', 'Cada par chave-valor'), b('Only values', 'Apenas valores'), b('Numeric positions', 'Posições numéricas'), b('A sorted copy', 'Uma cópia ordenada')], correctIndex: 0, explanation: b('items returns a dynamic view of key-value pairs. It does not sort or copy the dictionary.', 'items retorna uma visão dinâmica dos pares chave-valor. Ele não ordena nem copia o dicionário.') },
    { id: 'q10-v11-4', question: b('When is get appropriate?', 'Quando get é apropriado?'), options: [b('When the key is optional and the default is part of the contract', 'Quando a chave é opcional e o padrão faz parte do contrato'), b('For every required key', 'Para toda chave obrigatória'), b('Only for numeric keys', 'Apenas para chaves numéricas'), b('To mutate a value', 'Para alterar um valor')], correctIndex: 0, explanation: b('get expresses optional data with a documented fallback. Required fields should be validated or accessed directly.', 'get expressa dado opcional com alternativa documentada. Campos obrigatórios devem ser validados ou acessados diretamente.') },
  ],
  exam: {
    title: b('Media subscription record', 'Registro de assinatura de mídia'),
    scenario: b('Build subscription_summary(record). Validate required keys user, monthly_price and months. Coupon is optional. Return a new dictionary and never mutate the source.', 'Crie subscription_summary(record). Valide as chaves obrigatórias user, monthly_price e months. Coupon é opcional. Retorne novo dicionário e nunca altere a origem.'),
    requirements: {
      en: ['Raise ValueError("missing keys") when a required key is absent', 'Raise ValueError("negative value") for negative monthly_price, months or coupon', 'Use coupon default 0', 'Final total cannot be negative', 'Return keys user, months and total in that order'],
      pt: ['Gere ValueError("missing keys") quando faltar chave obrigatória', 'Gere ValueError("negative value") para monthly_price, months ou coupon negativos', 'Use coupon padrão 0', 'O total final não pode ser negativo', 'Retorne as chaves user, months e total nessa ordem'],
    },
    starterCode: `def subscription_summary(record):
    pass`,
    expectedOutput: b("{'user': 'Lia', 'months': 3, 'total': 50}", "{'user': 'Lia', 'months': 3, 'total': 50}"),
    testCases: [
      exactTest('p10-exam-visible', b('Calculates a subscription with coupon', 'Calcula assinatura com cupom'), `source = {"user": "Lia", "monthly_price": 20, "months": 3, "coupon": 10}
print(subscription_summary(source))
print(source)`, b("{'user': 'Lia', 'months': 3, 'total': 50}\n{'user': 'Lia', 'monthly_price': 20, 'months': 3, 'coupon': 10}", "{'user': 'Lia', 'months': 3, 'total': 50}\n{'user': 'Lia', 'monthly_price': 20, 'months': 3, 'coupon': 10}"), 60, [{ kind: 'function', value: 'subscription_summary' }, { kind: 'node', value: 'Dict' }, { kind: 'call', value: 'get' }]),
      exactTest('p10-exam-missing', b('Rejects missing required data', 'Rejeita dado obrigatório ausente'), `try:
    subscription_summary({"user": "Lia", "months": 3})
except ValueError as error:
    print(error)`, b('missing keys', 'missing keys'), 20, [{ kind: 'function', value: 'subscription_summary' }, { kind: 'node', value: 'Raise' }], true),
      exactTest('p10-exam-large', b('Generalizes to a large total', 'Generaliza para total grande'), `print(subscription_summary({"user": "Studio", "monthly_price": 100000, "months": 12}))`, b("{'user': 'Studio', 'months': 12, 'total': 1200000}", "{'user': 'Studio', 'months': 12, 'total': 1200000}"), 20, [{ kind: 'function', value: 'subscription_summary' }, { kind: 'node', value: 'Dict' }], true),
    ],
  },
}

export const phase11: Phase = {
  id: 11,
  title: b('Lists of Dictionaries', 'Listas de Dicionários'),
  description: b('Store many readable records, filter them without mutation and build indexes and summaries for real application data.', 'Armazene muitos registros legíveis, filtre sem mutação e crie índices e resumos para dados reais de aplicações.'),
  icon: '🗃️',
  libraries: [],
  track: 'core',
  stage: 'base',
  estimatedHours: 7,
  lesson: {
    title: b('Lists of dictionaries: the universal record collection', 'Listas de dicionários: a coleção universal de registros'),
    blocks: [
      heading('🌍 World hook — API responses, tables and search results', '🌍 Gancho do mundo real — respostas de API, tabelas e buscas'),
      text(
        'A single dictionary describes one record. Applications need collections: products in a cart, students in a class, deliveries on a route, support tickets in a queue and movies in a catalog. A list of dictionaries preserves order while every dictionary gives fields meaningful names. This is one of the most common structures returned by JSON APIs and read from databases.',
        'Um único dicionário descreve um registro. Aplicações precisam de coleções: produtos no carrinho, estudantes em uma turma, entregas em uma rota, chamados em uma fila e filmes em um catálogo. Uma lista de dicionários preserva a ordem enquanto cada dicionário dá nomes significativos aos campos. Essa é uma das estruturas mais comuns retornadas por APIs JSON e lidas de bancos de dados.',
      ),
      text(
        'The outer list answers questions about the collection: how many records exist, what is the first record, which records match a condition. Each inner dictionary answers questions about one record: what is its id, status, price or owner. Keep those levels separate in your mental model. Many bugs happen when code treats the list as if it had a status key or treats one dictionary as if it were the whole collection.',
        'A lista externa responde perguntas sobre a coleção: quantos registros existem, qual é o primeiro, quais atendem a uma condição. Cada dicionário interno responde perguntas sobre um registro: qual é seu id, status, preço ou responsável. Mantenha esses níveis separados no modelo mental. Muitos bugs acontecem quando o código trata a lista como se tivesse uma chave status ou trata um dicionário como se fosse a coleção inteira.',
      ),
      heading('🧩 Physical analogy — a stack of labeled forms', '🧩 Analogia física — uma pilha de formulários etiquetados'),
      text(
        'Imagine a stack of completed forms. The stack is the list; one form is a dictionary; field labels are keys; filled answers are values. You can walk through the stack, inspect each form, place selected forms in a new stack or build an alphabetical index. Removing or rewriting fields on the original form changes the source record, so analytical functions should usually create new output structures.',
        'Imagine uma pilha de formulários preenchidos. A pilha é a lista; um formulário é um dicionário; os rótulos dos campos são chaves; as respostas preenchidas são valores. Você pode percorrer a pilha, inspecionar cada formulário, colocar selecionados em uma nova pilha ou criar um índice alfabético. Remover ou reescrever campos no formulário original altera o registro de origem, então funções analíticas normalmente devem criar novas estruturas de saída.',
      ),
      text(
        'A collection also needs an identity rule. If each record has a unique id, you can find or index records reliably. Names are rarely safe identifiers because they may repeat or change. Professional code defines whether duplicate ids are rejected, replaced or grouped. Silent duplication creates confusing reports.',
        'Uma coleção também precisa de regra de identidade. Se cada registro possui id único, você consegue localizar ou indexar com segurança. Nomes raramente são identificadores seguros porque podem repetir ou mudar. Código profissional define se ids duplicados são rejeitados, substituídos ou agrupados. Duplicação silenciosa cria relatórios confusos.',
      ),
      heading('🐍 Fundamentals 1 — create and inspect records', '🐍 Fundamentos 1 — crie e inspecione registros'),
      code(
        `movies = [
    {"id": 1, "title": "Arrival", "rating": 8.0},
    {"id": 2, "title": "Coco", "rating": 8.4},
    {"id": 3, "title": "Moon", "rating": 7.8},
]

print(len(movies))
print(movies[0])
print(movies[0]["title"])`,
        `filmes = [
    {"id": 1, "titulo": "A Chegada", "nota": 8.0},
    {"id": 2, "titulo": "Viva", "nota": 8.4},
    {"id": 3, "titulo": "Lunar", "nota": 7.8},
]

print(len(filmes))
print(filmes[0])
print(filmes[0]["titulo"])`,
      ),
      text(
        'The expression movies[0]["title"] has the same two-step logic as nested lists: first select one record by list index, then select one field by dictionary key. Unlike nested lists, field order is not the contract. A record remains readable even when another field is inserted.',
        'A expressão filmes[0]["titulo"] possui a mesma lógica de dois passos das listas aninhadas: primeiro selecione um registro pelo índice da lista, depois um campo pela chave do dicionário. Diferente de listas aninhadas, a ordem dos campos não é o contrato. Um registro continua legível mesmo quando outro campo é inserido.',
      ),
      heading('🐍 Fundamentals 2 — filter into a new collection', '🐍 Fundamentos 2 — filtre para uma nova coleção'),
      code(
        `tickets = [
    {"id": 10, "status": "open", "priority": 2},
    {"id": 11, "status": "closed", "priority": 1},
    {"id": 12, "status": "open", "priority": 3},
]

open_tickets = []
for ticket in tickets:
    if ticket["status"] == "open":
        open_tickets.append(ticket.copy())

print(open_tickets)`,
        `chamados = [
    {"id": 10, "status": "aberto", "prioridade": 2},
    {"id": 11, "status": "fechado", "prioridade": 1},
    {"id": 12, "status": "aberto", "prioridade": 3},
]

chamados_abertos = []
for chamado in chamados:
    if chamado["status"] == "aberto":
        chamados_abertos.append(chamado.copy())

print(chamados_abertos)`,
      ),
      text(
        'Appending ticket without copying is fine when the result is read-only, but the original and filtered list then contain references to the same dictionaries. If later code updates a filtered record, the source changes too. Decide whether sharing is intended. A safe teaching default for independent output is to append a copy.',
        'Adicionar chamado sem copiar é aceitável quando o resultado será somente leitura, mas a lista original e a filtrada passam a conter referências aos mesmos dicionários. Se outro código atualizar um registro filtrado, a origem também muda. Decida se o compartilhamento é intencional. Um padrão didático seguro para saída independente é adicionar uma cópia.',
      ),
      heading('🐍 Fundamentals 3 — aggregate and build an index', '🐍 Fundamentos 3 — agregue e crie um índice'),
      code(
        `products = [
    {"sku": "A", "price": 10, "stock": 3},
    {"sku": "B", "price": 25, "stock": 2},
]

inventory_value = 0
by_sku = {}
for product in products:
    inventory_value += product["price"] * product["stock"]
    if product["sku"] in by_sku:
        raise ValueError("duplicate sku")
    by_sku[product["sku"]] = product.copy()

print(inventory_value)
print(by_sku["B"])`,
        `produtos = [
    {"sku": "A", "preco": 10, "estoque": 3},
    {"sku": "B", "preco": 25, "estoque": 2},
]

valor_estoque = 0
por_sku = {}
for produto in produtos:
    valor_estoque += produto["preco"] * produto["estoque"]
    if produto["sku"] in por_sku:
        raise ValueError("sku duplicado")
    por_sku[produto["sku"]] = produto.copy()

print(valor_estoque)
print(por_sku["B"])`,
      ),
      text(
        'The list is good for ordered traversal; the index dictionary is good for fast lookup by a unique key. Building both is common. The duplicate check protects identity. Without it, a later record silently overwrites an earlier one in the index while both remain in the list.',
        'A lista é boa para percurso ordenado; o dicionário de índice é bom para busca rápida por chave única. Construir ambos é comum. A verificação de duplicidade protege a identidade. Sem ela, um registro posterior substitui silenciosamente o anterior no índice enquanto ambos continuam na lista.',
      ),
      heading('🏗️ Real scenario 1 — education progress dashboard', '🏗️ Cenário real 1 — painel de progresso educacional'),
      text(
        'A learning platform receives records with student, completed lessons and target lessons. The report calculates completion percentage, preserves accented names and flags students who need support. The source records stay unchanged because another part of the application may still need raw counts.',
        'Uma plataforma de ensino recebe registros com estudante, aulas concluídas e meta de aulas. O relatório calcula percentual, preserva nomes acentuados e sinaliza estudantes que precisam de apoio. Os registros de origem permanecem intactos porque outra parte da aplicação ainda pode precisar das contagens brutas.',
      ),
      code(
        `students = [
    {"student": "João", "done": 8, "target": 10},
    {"student": "Maya", "done": 3, "target": 10},
]

report = []
for student in students:
    if student["target"] <= 0:
        raise ValueError("invalid target")
    percent = round(student["done"] / student["target"] * 100)
    report.append({
        "student": student["student"],
        "percent": percent,
        "support": percent < 60,
    })

print(report)`,
        `estudantes = [
    {"estudante": "João", "concluidas": 8, "meta": 10},
    {"estudante": "Maya", "concluidas": 3, "meta": 10},
]

relatorio = []
for estudante in estudantes:
    if estudante["meta"] <= 0:
        raise ValueError("meta inválida")
    percentual = round(estudante["concluidas"] / estudante["meta"] * 100)
    relatorio.append({
        "estudante": estudante["estudante"],
        "percentual": percentual,
        "apoio": percentual < 60,
    })

print(relatorio)`,
      ),
      heading('🏗️ Real scenario 2 — insurance intake queue', '🏗️ Cenário real 2 — fila de entrada de seguros'),
      text(
        'An intake queue contains administrative claim records. The program selects open high-priority records and creates a small operational view. The new list should not expose unnecessary fields. This is also a security habit: return only the information the next step needs.',
        'Uma fila de entrada contém registros administrativos de sinistros. O programa seleciona registros abertos de alta prioridade e cria uma pequena visão operacional. A nova lista não deve expor campos desnecessários. Isso também é hábito de segurança: retorne apenas a informação necessária para a próxima etapa.',
      ),
      code(
        `claims = [
    {"id": 101, "client": "Ana", "status": "open", "priority": 3, "notes": "..."},
    {"id": 102, "client": "Beto", "status": "closed", "priority": 3, "notes": "..."},
    {"id": 103, "client": "Caio", "status": "open", "priority": 1, "notes": "..."},
]

queue = []
for claim in claims:
    if claim["status"] == "open" and claim["priority"] >= 3:
        queue.append({"id": claim["id"], "client": claim["client"]})

print(queue)`,
        `sinistros = [
    {"id": 101, "cliente": "Ana", "status": "aberto", "prioridade": 3, "notas": "..."},
    {"id": 102, "cliente": "Beto", "status": "fechado", "prioridade": 3, "notas": "..."},
    {"id": 103, "cliente": "Caio", "status": "aberto", "prioridade": 1, "notas": "..."},
]

fila = []
for sinistro in sinistros:
    if sinistro["status"] == "aberto" and sinistro["prioridade"] >= 3:
        fila.append({"id": sinistro["id"], "cliente": sinistro["cliente"]})

print(fila)`,
      ),
      heading('⚠️ Common errors and the real Python message', '⚠️ Erros comuns e a mensagem real do Python'),
      warning(
        '1) TypeError: list indices must be integers or slices, not str — code used records["status"]. Select one dictionary first or loop through the list.\n\n2) KeyError — one record has a different schema. Validate required keys for every record, not only the first.\n\n3) Duplicate identity silently overwritten — building by_id without checking duplicates loses one record in the index.\n\n4) Accidental shared mutation — filtered.append(record) shares the same dictionary. Use record.copy() when independent output is required.\n\n5) return inside the loop — only the first record is processed. Return after the collection has been built.',
        '1) TypeError: list indices must be integers or slices, not str — o código usou registros["status"]. Selecione um dicionário primeiro ou percorra a lista.\n\n2) KeyError — um registro possui formato diferente. Valide chaves obrigatórias em todos os registros, não apenas no primeiro.\n\n3) Identidade duplicada substituída silenciosamente — criar por_id sem verificar duplicados perde um registro no índice.\n\n4) Mutação compartilhada acidental — filtrados.append(registro) compartilha o mesmo dicionário. Use registro.copy() quando precisar de saída independente.\n\n5) return dentro do loop — apenas o primeiro registro é processado. Retorne depois de construir a coleção.',
      ),
      heading('💡 Pro tip — create small collection functions', '💡 Dica pro — crie pequenas funções de coleção'),
      tip(
        'Separate selection, transformation and aggregation when the rule becomes long. A function select_open(records) can return matching records; summarize(records) can calculate totals; index_by_id(records) can enforce uniqueness. Small pure functions are easier to test with empty lists, accented text, negative values and large collections.',
        'Separe seleção, transformação e agregação quando a regra ficar longa. Uma função selecionar_abertos(registros) pode retornar correspondências; resumir(registros) pode calcular totais; indexar_por_id(registros) pode aplicar unicidade. Funções puras pequenas são mais fáceis de testar com listas vazias, textos acentuados, valores negativos e coleções grandes.',
      ),
      heading('📋 Recap and bridge to list comprehensions', '📋 Resumo e ponte para compreensões de lista'),
      text(
        'You can now distinguish collection-level operations from record-level access, filter into independent results, aggregate numeric fields, build indexes and protect unique identifiers. Many of these loops follow a compact pattern: create a new list by transforming or selecting each item. The next phase introduces list comprehensions for those clear, single-purpose transformations while keeping normal loops for complex logic.',
        'Agora você consegue distinguir operações da coleção de acesso ao registro, filtrar para resultados independentes, agregar campos numéricos, criar índices e proteger identificadores únicos. Muitos desses loops seguem um padrão compacto: criar nova lista transformando ou selecionando cada item. A próxima fase apresenta compreensões de lista para transformações claras e de propósito único, mantendo loops normais para lógica complexa.',
      ),
    ],
  },
  exercises: [
    exercise(
      'p11-guided-active',
      b('🟢 Guided — select names from records', '🟢 Guiado — selecione nomes dos registros'),
      b('Complete active_names to return the name from every record whose active field is True.', 'Complete active_names para retornar o nome de todo registro cujo campo active é True.'),
      `def active_names(records):
    names = []
    for record in records:
        if record[___]:
            names.append(record[___])
    return names`,
      b("['Ana', 'João']", "['Ana', 'João']"),
      [b('The condition reads the "active" key.', 'A condição lê a chave "active".'), b('Append the value from the "name" key.', 'Adicione o valor da chave "name".'), b('Return after the loop so every record is inspected.', 'Retorne após o loop para inspecionar todos os registros.')],
      [{ kind: 'function', value: 'active_names' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }, { kind: 'call', value: 'append' }],
      exactTest('p11-active-visible', b('Selects active names', 'Seleciona nomes ativos'), `print(active_names([{"name": "Ana", "active": True}, {"name": "Beto", "active": False}, {"name": "João", "active": True}]))`, b("['Ana', 'João']", "['Ana', 'João']"), 60, [{ kind: 'function', value: 'active_names' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'If' }]),
      exactTest('p11-active-hidden-empty', b('Handles an empty collection', 'Trata coleção vazia'), `print(active_names([]))`, b('[]', '[]'), 40, [{ kind: 'function', value: 'active_names' }, { kind: 'node', value: 'For' }], true),
      'guided',
      b('Filter a collection and read one named field.', 'Filtrar uma coleção e ler um campo nomeado.'),
      b('Selecting active accounts, products or subscriptions.', 'Seleção de contas, produtos ou assinaturas ativas.'),
      { en: ['Inspects each record', 'Preserves input order', 'Handles empty input'], pt: ['Inspeciona cada registro', 'Preserva a ordem de entrada', 'Trata entrada vazia'] },
      { en: ['Indexing the list with a string', 'Appending the whole record', 'Returning inside the loop'], pt: ['Indexar a lista com texto', 'Adicionar o registro inteiro', 'Retornar dentro do loop'] },
    ),
    exercise(
      'p11-complete-inventory',
      b('🟡 Complete — aggregate record fields', '🟡 Complete — agregue campos dos registros'),
      b('Finish inventory_value. Reject negative price or stock and return the total price * stock across all products.', 'Termine inventory_value. Rejeite preço ou estoque negativo e retorne o total de preço * estoque de todos os produtos.'),
      `def inventory_value(products):
    total = 0
    for product in products:
        if product["price"] < 0 or product["stock"] < 0:
            ___
        total += ___
    return total`,
      b('80', '80'),
      [b('Raise ValueError("negative product") for invalid numeric data.', 'Gere ValueError("negative product") para dado numérico inválido.'), b('One product contributes price multiplied by stock.', 'Um produto contribui com preço multiplicado por estoque.'), b('An empty list should return the initial total zero.', 'Uma lista vazia deve retornar o total inicial zero.')],
      [{ kind: 'function', value: 'inventory_value' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'Raise' }, { kind: 'node', value: 'BinOp' }],
      exactTest('p11-inventory-visible', b('Calculates normal inventory value', 'Calcula valor normal de estoque'), `print(inventory_value([{"price": 10, "stock": 3}, {"price": 25, "stock": 2}]))`, b('80', '80'), 60, [{ kind: 'function', value: 'inventory_value' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'BinOp' }]),
      exactTest('p11-inventory-hidden-negative', b('Rejects a negative field', 'Rejeita campo negativo'), `try:
    inventory_value([{"price": -1, "stock": 4}])
except ValueError as error:
    print(error)`, b('negative product', 'negative product'), 40, [{ kind: 'function', value: 'inventory_value' }, { kind: 'node', value: 'Raise' }], true),
      'independent',
      b('Aggregate many records while validating each one.', 'Agregar muitos registros validando cada um.'),
      b('Calculating inventory, revenue or workload from record collections.', 'Cálculo de estoque, receita ou carga de trabalho de coleções de registros.'),
      { en: ['Validates every record', 'Returns zero for empty input', 'Uses price and stock'], pt: ['Valida todo registro', 'Retorna zero para entrada vazia', 'Usa preço e estoque'] },
      { en: ['Checking only the first record', 'Summing price without stock', 'Ignoring negative data'], pt: ['Verificar apenas o primeiro registro', 'Somar preço sem estoque', 'Ignorar dado negativo'] },
    ),
    exercise(
      'p11-zero-index',
      b('🔴 From scratch — build a unique index', '🔴 Do zero — crie um índice único'),
      b('Write index_by_id(records). Return a dictionary mapping each id to an independent copy of its record. Raise ValueError("duplicate id") when an id repeats.', 'Escreva index_by_id(records). Retorne um dicionário que mapeia cada id para uma cópia independente do registro. Gere ValueError("duplicate id") quando um id repetir.'),
      `def index_by_id(records):
    pass`,
      b("{1: {'id': 1, 'name': 'Ana'}, 2: {'id': 2, 'name': 'Beto'}}", "{1: {'id': 1, 'name': 'Ana'}, 2: {'id': 2, 'name': 'Beto'}}"),
      [b('Create an empty dictionary before the loop.', 'Crie um dicionário vazio antes do loop.'), b('Check record["id"] in the index before assignment.', 'Verifique record["id"] no índice antes da atribuição.'), b('Store record.copy() to avoid shared outer mutation.', 'Armazene record.copy() para evitar mutação externa compartilhada.')],
      [{ kind: 'function', value: 'index_by_id' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'Dict' }, { kind: 'call', value: 'copy' }, { kind: 'node', value: 'Raise' }],
      exactTest('p11-index-visible', b('Indexes two unique records', 'Indexa dois registros únicos'), `print(index_by_id([{"id": 1, "name": "Ana"}, {"id": 2, "name": "Beto"}]))`, b("{1: {'id': 1, 'name': 'Ana'}, 2: {'id': 2, 'name': 'Beto'}}", "{1: {'id': 1, 'name': 'Ana'}, 2: {'id': 2, 'name': 'Beto'}}"), 60, [{ kind: 'function', value: 'index_by_id' }, { kind: 'node', value: 'For' }, { kind: 'call', value: 'copy' }]),
      exactTest('p11-index-hidden-duplicate', b('Rejects duplicate identity', 'Rejeita identidade duplicada'), `try:
    index_by_id([{"id": 7, "name": "A"}, {"id": 7, "name": "B"}])
except ValueError as error:
    print(error)`, b('duplicate id', 'duplicate id'), 40, [{ kind: 'function', value: 'index_by_id' }, { kind: 'node', value: 'Raise' }], true),
      'independent',
      b('Convert an ordered collection into a validated lookup index.', 'Converter coleção ordenada em índice de busca validado.'),
      b('Indexing users, products, tickets or shipments by stable identity.', 'Indexação de usuários, produtos, chamados ou entregas por identidade estável.'),
      { en: ['Rejects duplicates', 'Copies records', 'Returns {} for empty input'], pt: ['Rejeita duplicados', 'Copia registros', 'Retorna {} para entrada vazia'] },
      { en: ['Silently overwriting duplicate ids', 'Using name as identity', 'Sharing source dictionaries'], pt: ['Substituir ids duplicados silenciosamente', 'Usar nome como identidade', 'Compartilhar dicionários de origem'] },
    ),
    exercise(
      'p11-transfer',
      b('🟣 Challenge — group records without losing order', '🟣 Desafio — agrupe registros sem perder a ordem'),
      b('Write group_titles_by_category(items). Return a dictionary whose keys are categories in first-seen order and values are title lists in input order. Required keys are category and title.', 'Escreva group_titles_by_category(items). Retorne um dicionário cujas chaves são categorias na ordem da primeira aparição e valores são listas de títulos na ordem de entrada. As chaves obrigatórias são category e title.'),
      `def group_titles_by_category(items):
    pass`,
      b("{'game': ['Portal', 'Celeste'], 'movie': ['Coco']}", "{'game': ['Portal', 'Celeste'], 'movie': ['Coco']}"),
      [b('Use setdefault(category, []) to create each group once.', 'Use setdefault(category, []) para criar cada grupo uma vez.'), b('Append each title to its category list.', 'Adicione cada título à lista de sua categoria.'), b('Raise ValueError("missing keys") before accessing an incomplete record.', 'Gere ValueError("missing keys") antes de acessar registro incompleto.')],
      [{ kind: 'function', value: 'group_titles_by_category' }, { kind: 'node', value: 'For' }, { kind: 'call', value: 'setdefault' }, { kind: 'call', value: 'append' }, { kind: 'node', value: 'Raise' }],
      exactTest('p11-group-visible', b('Groups mixed media records', 'Agrupa registros mistos de mídia'), `print(group_titles_by_category([{"category": "game", "title": "Portal"}, {"category": "movie", "title": "Coco"}, {"category": "game", "title": "Celeste"}]))`, b("{'game': ['Portal', 'Celeste'], 'movie': ['Coco']}", "{'game': ['Portal', 'Celeste'], 'movie': ['Coco']}"), 60, [{ kind: 'function', value: 'group_titles_by_category' }, { kind: 'call', value: 'setdefault' }, { kind: 'call', value: 'append' }]),
      exactTest('p11-group-hidden-accent', b('Preserves accented category and title', 'Preserva categoria e título acentuados'), `print(group_titles_by_category([{"category": "música", "title": "Canção"}]))`, b("{'música': ['Canção']}", "{'música': ['Canção']}"), 40, [{ kind: 'function', value: 'group_titles_by_category' }, { kind: 'node', value: 'For' }], true),
      'challenge',
      b('Group many records while preserving deterministic order.', 'Agrupar muitos registros preservando ordem determinística.'),
      b('Creating catalog sections, restaurant menus or dashboard groups.', 'Criação de seções de catálogo, cardápios ou grupos de painel.'),
      { en: ['Preserves first-seen category order', 'Preserves title order', 'Validates required keys'], pt: ['Preserva ordem da primeira categoria', 'Preserva ordem dos títulos', 'Valida chaves obrigatórias'] },
      { en: ['Overwriting a group on every item', 'Using a set and losing order', 'Ignoring malformed records'], pt: ['Substituir grupo a cada item', 'Usar set e perder ordem', 'Ignorar registros malformados'] },
    ),
  ],
  quiz: [
    { id: 'q11-v11-1', question: b('In records[2]["status"], what does records[2] produce?', 'Em records[2]["status"], o que records[2] produz?'), options: [b('The third dictionary', 'O terceiro dicionário'), b('The status of every record', 'O status de todos os registros'), b('The second key', 'A segunda chave'), b('A copy of the list', 'Uma cópia da lista')], correctIndex: 0, explanation: b('The list index selects one record first. The string key then selects a field from that dictionary.', 'O índice da lista seleciona primeiro um registro. A chave de texto então seleciona um campo desse dicionário.') },
    { id: 'q11-v11-2', question: b('Why check duplicate ids while building an index?', 'Por que verificar ids duplicados ao criar um índice?'), options: [b('A later record would silently overwrite an earlier one', 'Um registro posterior substituiria silenciosamente o anterior'), b('Dictionaries cannot contain numbers', 'Dicionários não podem conter números'), b('Lists automatically remove duplicates', 'Listas removem duplicados automaticamente'), b('It makes sorting possible', 'Isso torna ordenação possível')], correctIndex: 0, explanation: b('Dictionary keys are unique. Assigning the same id again replaces the previous indexed value unless the code rejects it.', 'Chaves de dicionário são únicas. Atribuir o mesmo id novamente substitui o valor anterior do índice se o código não rejeitar.') },
    { id: 'q11-v11-3', question: b('What is the risk of filtered.append(record)?', 'Qual é o risco de filtered.append(record)?'), options: [b('Both collections reference the same dictionary', 'As duas coleções referenciam o mesmo dicionário'), b('The record becomes a tuple', 'O registro vira tupla'), b('The list is sorted', 'A lista é ordenada'), b('The keys are deleted', 'As chaves são excluídas')], correctIndex: 0, explanation: b('Appending a dictionary stores its reference. Mutating it through either collection affects the same object.', 'Adicionar um dicionário armazena sua referência. Alterá-lo por qualquer coleção afeta o mesmo objeto.') },
    { id: 'q11-v11-4', question: b('Where should return usually appear when building a result from every record?', 'Onde return normalmente deve aparecer ao construir resultado de todos os registros?'), options: [b('After the loop', 'Depois do loop'), b('Inside the first if', 'Dentro do primeiro if'), b('Before the result list', 'Antes da lista de resultado'), b('It is never needed', 'Nunca é necessário')], correctIndex: 0, explanation: b('Returning inside the loop stops after the first processed record. Return after the collection is complete.', 'Retornar dentro do loop interrompe após o primeiro registro. Retorne depois que a coleção estiver completa.') },
  ],
  exam: {
    title: b('Restaurant order dashboard', 'Painel de pedidos do restaurante'),
    scenario: b('Build order_dashboard(orders). Validate ids and numeric values, calculate paid revenue, list pending customer names and preserve the input records.', 'Crie order_dashboard(orders). Valide ids e valores numéricos, calcule receita paga, liste nomes pendentes e preserve os registros de entrada.'),
    requirements: {
      en: ['Each record requires id, customer, total and status', 'Reject duplicate id with ValueError("duplicate id")', 'Reject negative total with ValueError("negative total")', 'Paid revenue includes only status == "paid"', 'Return {"paid_revenue": value, "pending_customers": list} in that key order'],
      pt: ['Cada registro exige id, customer, total e status', 'Rejeite id duplicado com ValueError("duplicate id")', 'Rejeite total negativo com ValueError("negative total")', 'Receita paga inclui apenas status == "paid"', 'Retorne {"paid_revenue": valor, "pending_customers": lista} nessa ordem de chaves'],
    },
    starterCode: `def order_dashboard(orders):
    pass`,
    expectedOutput: b("{'paid_revenue': 75, 'pending_customers': ['João']}", "{'paid_revenue': 75, 'pending_customers': ['João']}"),
    testCases: [
      exactTest('p11-exam-visible', b('Builds revenue and pending list', 'Cria receita e lista pendente'), `orders = [{"id": 1, "customer": "Ana", "total": 30, "status": "paid"}, {"id": 2, "customer": "João", "total": 20, "status": "pending"}, {"id": 3, "customer": "Lia", "total": 45, "status": "paid"}]
print(order_dashboard(orders))
print(orders[0]["total"])`, b("{'paid_revenue': 75, 'pending_customers': ['João']}\n30", "{'paid_revenue': 75, 'pending_customers': ['João']}\n30"), 60, [{ kind: 'function', value: 'order_dashboard' }, { kind: 'node', value: 'For' }, { kind: 'node', value: 'Dict' }]),
      exactTest('p11-exam-empty', b('Handles no orders', 'Trata ausência de pedidos'), `print(order_dashboard([]))`, b("{'paid_revenue': 0, 'pending_customers': []}", "{'paid_revenue': 0, 'pending_customers': []}"), 20, [{ kind: 'function', value: 'order_dashboard' }, { kind: 'node', value: 'Return' }], true),
      exactTest('p11-exam-duplicate', b('Rejects duplicate order identity', 'Rejeita identidade duplicada de pedido'), `try:
    order_dashboard([{"id": 1, "customer": "A", "total": 1, "status": "paid"}, {"id": 1, "customer": "B", "total": 2, "status": "paid"}])
except ValueError as error:
    print(error)`, b('duplicate id', 'duplicate id'), 20, [{ kind: 'function', value: 'order_dashboard' }, { kind: 'node', value: 'Raise' }], true),
    ],
  },
}

export const phase12: Phase = {
  id: 12,
  title: b('List Comprehensions', 'Compreensões de Lista'),
  description: b('Express clear transformations and filters as new lists while knowing when a normal loop is safer and easier to debug.', 'Expresse transformações e filtros claros como novas listas, sabendo quando um loop normal é mais seguro e fácil de depurar.'),
  icon: '⚡',
  libraries: [],
  track: 'core',
  stage: 'base',
  estimatedHours: 7,
  lesson: {
    title: b('List comprehensions: concise transformations without mystery', 'Compreensões de lista: transformações concisas sem mistério'),
    blocks: [
      heading('🌍 World hook — cleaning and selecting data everywhere', '🌍 Gancho do mundo real — limpeza e seleção de dados em todo lugar'),
      text(
        'Applications repeatedly create a new list from an existing iterable: normalize search terms, convert prices, select available products, extract ids or flatten a small grid. A list comprehension gives Python a compact notation for this exact pattern. It is not automatically faster, smarter or more professional than a loop. Its value is expressing one simple transformation or filter in a readable line.',
        'Aplicações repetidamente criam uma nova lista a partir de um iterável existente: normalizar termos de busca, converter preços, selecionar produtos disponíveis, extrair ids ou achatar uma pequena grade. Uma compreensão de lista oferece ao Python uma notação compacta para esse padrão exato. Ela não é automaticamente mais rápida, inteligente ou profissional que um loop. Seu valor é expressar uma transformação ou filtro simples em uma linha legível.',
      ),
      text(
        'Every comprehension can be expanded into a normal loop. If you cannot explain the expanded loop, the compressed form is premature. Read a comprehension from left to right in three questions: what value enters the new list, where each source item comes from, and which condition allows it through. Parentheses and brackets matter: square brackets build a list; parentheses usually build a generator expression, a later topic.',
        'Toda compreensão pode ser expandida para um loop normal. Se você não consegue explicar o loop expandido, a forma compacta é prematura. Leia uma compreensão da esquerda para a direita com três perguntas: qual valor entra na nova lista, de onde vem cada item e qual condição permite sua passagem. Parênteses e colchetes importam: colchetes criam lista; parênteses normalmente criam expressão geradora, assunto posterior.',
      ),
      heading('🧩 Physical analogy — a conveyor belt with one clear station', '🧩 Analogia física — uma esteira com uma estação clara'),
      text(
        'Imagine items moving along a conveyor belt. A transformation station changes every item, such as trimming a label. A gate may discard items that fail a condition. The output box is a brand-new list. If the line requires several stations, exception handling, logging and state updates, the conveyor diagram becomes confusing. That is the moment to return to a normal loop with named steps.',
        'Imagine itens passando por uma esteira. Uma estação de transformação altera cada item, como remover espaços de um rótulo. Uma barreira pode descartar itens que falham numa condição. A caixa de saída é uma lista nova. Se a linha exige várias estações, tratamento de erro, logs e atualização de estado, o diagrama fica confuso. Esse é o momento de voltar ao loop normal com passos nomeados.',
      ),
      text(
        'The source list is not mutated by the comprehension. The values inside may still be shared objects, however. [record for record in records] creates a new outer list containing the same dictionaries. Use record.copy() in the expression when independent outer records are required.',
        'A lista de origem não é alterada pela compreensão. Porém, os valores internos ainda podem ser objetos compartilhados. [registro for registro in registros] cria nova lista externa contendo os mesmos dicionários. Use registro.copy() na expressão quando precisar de registros externos independentes.',
      ),
      heading('🐍 Fundamentals 1 — transform every item', '🐍 Fundamentos 1 — transforme todo item'),
      code(
        `prices = [10, 25, 8]

# Expanded loop
with_tax_loop = []
for price in prices:
    with_tax_loop.append(round(price * 1.13, 2))

# Equivalent comprehension
with_tax = [round(price * 1.13, 2) for price in prices]

print(with_tax_loop)
print(with_tax)`,
        `precos = [10, 25, 8]

# Loop expandido
com_imposto_loop = []
for preco in precos:
    com_imposto_loop.append(round(preco * 1.13, 2))

# Compreensão equivalente
com_imposto = [round(preco * 1.13, 2) for preco in precos]

print(com_imposto_loop)
print(com_imposto)`,
      ),
      text(
        'The expression round(price * 1.13, 2) is what enters the new list. The clause for price in prices supplies each source item. There is no filter, so the output length equals the input length. Keep transformations free of unrelated side effects: printing or changing external state inside a comprehension is difficult to read and test.',
        'A expressão round(preco * 1.13, 2) é o que entra na nova lista. A cláusula for preco in precos fornece cada item de origem. Não há filtro, então o tamanho da saída é igual ao da entrada. Mantenha transformações livres de efeitos externos sem relação: imprimir ou alterar estado externo dentro de uma compreensão é difícil de ler e testar.',
      ),
      heading('🐍 Fundamentals 2 — filter items', '🐍 Fundamentos 2 — filtre itens'),
      code(
        `scores = [42, 81, 67, 95, 50]
passing = [score for score in scores if score >= 60]
print(passing)  # [81, 67, 95]`,
        `notas = [42, 81, 67, 95, 50]
aprovadas = [nota for nota in notas if nota >= 60]
print(aprovadas)  # [81, 67, 95]`,
      ),
      text(
        'The condition appears after the for clause and decides whether the current item is included. The expression may be the original item or a transformed value. Be precise about > versus >= and about truthy shortcuts. if name removes empty strings but also accepts whitespace-only strings; if name.strip() expresses the cleaner contract.',
        'A condição aparece depois da cláusula for e decide se o item atual entra. A expressão pode ser o item original ou um valor transformado. Seja preciso sobre > versus >= e sobre atalhos de valores verdadeiros. if nome remove textos vazios, mas aceita textos apenas com espaços; if nome.strip() expressa o contrato mais limpo.',
      ),
      heading('🐍 Fundamentals 3 — transform and filter records', '🐍 Fundamentos 3 — transforme e filtre registros'),
      code(
        `products = [
    {"name": "Mouse", "stock": 3},
    {"name": "Monitor", "stock": 0},
    {"name": "Café", "stock": 5},
]

available_names = [
    product["name"].strip()
    for product in products
    if product["stock"] > 0
]
print(available_names)`,
        `produtos = [
    {"nome": "Mouse", "estoque": 3},
    {"nome": "Monitor", "estoque": 0},
    {"nome": "Café", "estoque": 5},
]

nomes_disponiveis = [
    produto["nome"].strip()
    for produto in produtos
    if produto["estoque"] > 0
]
print(nomes_disponiveis)`,
      ),
      text(
        'Multiline formatting is still one comprehension and is often clearer than forcing a long expression onto one line. The expression, for clause and condition are visually separated. Complexity is not measured by line count; it is measured by how much a reader must remember at once.',
        'A formatação em várias linhas ainda é uma única compreensão e normalmente fica mais clara que forçar uma expressão longa numa linha. A expressão, a cláusula for e a condição ficam separadas visualmente. Complexidade não é medida por quantidade de linhas; é medida por quanto o leitor precisa lembrar ao mesmo tempo.',
      ),
      heading('🐍 Fundamentals 4 — nested comprehension carefully', '🐍 Fundamentos 4 — compreensão aninhada com cuidado'),
      code(
        `grid = [[1, 2], [3, 4], [5]]
flat = [cell for row in grid for cell in row]
print(flat)  # [1, 2, 3, 4, 5]`,
        `grade = [[1, 2], [3, 4], [5]]
achatada = [celula for linha in grade for celula in linha]
print(achatada)  # [1, 2, 3, 4, 5]`,
      ),
      text(
        'The for clauses keep the same order as the expanded loops: for row in grid is outer, then for cell in row is inner. Nested comprehensions are acceptable for a small flattening rule. If conditions appear at both levels or the expression becomes long, expand it to loops and name intermediate decisions.',
        'As cláusulas for mantêm a mesma ordem dos loops expandidos: for linha in grade é externo, depois for celula in linha é interno. Compreensões aninhadas são aceitáveis para uma regra pequena de achatamento. Se condições aparecem nos dois níveis ou a expressão fica longa, expanda para loops e nomeie decisões intermediárias.',
      ),
      heading('🏗️ Real scenario 1 — normalize restaurant menu search', '🏗️ Cenário real 1 — normalize busca de cardápio'),
      text(
        'A search feature receives menu labels with inconsistent spaces and capitalization. It needs normalized non-empty terms while preserving accented characters. A comprehension clearly expresses trim, filter and lowercase in one deterministic transformation.',
        'Uma busca recebe rótulos de cardápio com espaços e maiúsculas inconsistentes. Ela precisa de termos normalizados e não vazios, preservando caracteres acentuados. Uma compreensão expressa claramente remover espaços, filtrar e converter para minúsculas numa transformação determinística.',
      ),
      code(
        `labels = ["  Café ", "", " PÃO de queijo ", "   "]
terms = [label.strip().lower() for label in labels if label.strip()]
print(terms)  # ['café', 'pão de queijo']`,
        `rotulos = ["  Café ", "", " PÃO de queijo ", "   "]
termos = [rotulo.strip().lower() for rotulo in rotulos if rotulo.strip()]
print(termos)  # ['café', 'pão de queijo']`,
      ),
      heading('🏗️ Real scenario 2 — sports training thresholds', '🏗️ Cenário real 2 — limites de treino esportivo'),
      text(
        'A training app stores session durations and needs minutes above a configurable threshold converted to rounded hours. Negative durations are invalid and must be checked before the comprehension. This demonstrates an important pattern: validate complex collection rules first, then use a comprehension for the simple transformation.',
        'Um aplicativo de treino armazena durações e precisa converter para horas arredondadas as sessões acima de um limite configurável. Durações negativas são inválidas e precisam ser verificadas antes da compreensão. Isso demonstra um padrão importante: valide regras complexas da coleção primeiro, depois use compreensão para a transformação simples.',
      ),
      code(
        `minutes = [20, 75, 45, 120]
if any(value < 0 for value in minutes):
    raise ValueError("negative duration")

long_hours = [round(value / 60, 2) for value in minutes if value >= 60]
print(long_hours)  # [1.25, 2.0]`,
        `minutos = [20, 75, 45, 120]
if any(valor < 0 for valor in minutos):
    raise ValueError("duração negativa")

horas_longas = [round(valor / 60, 2) for valor in minutos if valor >= 60]
print(horas_longas)  # [1.25, 2.0]`,
      ),
      heading('⚠️ Common errors and the real Python message', '⚠️ Erros comuns e a mensagem real do Python'),
      warning(
        '1) SyntaxError: expected else after if expression — an inline conditional value such as x if condition needs else. A filter condition at the end does not.\n\n2) NameError — the expression uses a variable before its for clause introduces it, or uses a misspelled loop variable.\n\n3) Wrong clause order in nested comprehensions — write clauses in the same order as expanded loops.\n\n4) Side effects hidden inside the expression — append, print or mutation makes the compact line difficult to reason about. Use a normal loop.\n\n5) Shared inner objects — [record for record in records] copies only the outer list, not each dictionary.',
        '1) SyntaxError: expected else after if expression — um valor condicional como x if condicao precisa de else. Uma condição de filtro no final não precisa.\n\n2) NameError — a expressão usa variável antes de sua cláusula for apresentá-la, ou usa nome incorreto.\n\n3) Ordem errada em compreensões aninhadas — escreva cláusulas na mesma ordem dos loops expandidos.\n\n4) Efeitos escondidos na expressão — append, print ou mutação tornam a linha compacta difícil de entender. Use loop normal.\n\n5) Objetos internos compartilhados — [registro for registro in registros] copia apenas a lista externa, não cada dicionário.',
      ),
      heading('💡 Pro tip — readability is the rule, not one line', '💡 Dica pro — legibilidade é a regra, não uma linha'),
      tip(
        'Use a comprehension when the transformation can be described in one short sentence. If you need multiple branches, error recovery, logging or state shared between items, write a loop. Multiline comprehensions are encouraged when they expose expression, source and filter clearly. Code review should optimize understanding, not the number of lines.',
        'Use compreensão quando a transformação pode ser descrita em uma frase curta. Se você precisa de vários caminhos, recuperação de erro, logs ou estado compartilhado entre itens, escreva um loop. Compreensões em várias linhas são recomendadas quando deixam expressão, origem e filtro claros. Revisão de código deve otimizar entendimento, não quantidade de linhas.',
      ),
      heading('📋 Recap and bridge to functions', '📋 Resumo e ponte para funções'),
      text(
        'You can now translate loops into comprehensions, identify expression, source and filter, format long comprehensions, flatten small nested data and recognize when a normal loop is clearer. Comprehensions create new lists, but inner mutable objects may still be shared. In the next phase, functions package these transformations behind explicit inputs and return values so they can be reused and tested independently.',
        'Agora você consegue traduzir loops em compreensões, identificar expressão, origem e filtro, formatar compreensões longas, achatar pequenos dados aninhados e reconhecer quando um loop normal é mais claro. Compreensões criam novas listas, mas objetos internos mutáveis ainda podem ser compartilhados. Na próxima fase, funções empacotam essas transformações com entradas e retornos explícitos para reutilização e teste independente.',
      ),
    ],
  },
  exercises: [
    exercise(
      'p12-guided-even-squares',
      b('🟢 Guided — transform and filter numbers', '🟢 Guiado — transforme e filtre números'),
      b('Complete even_squares with one list comprehension that returns the square of every even number.', 'Complete even_squares com uma compreensão de lista que retorna o quadrado de todo número par.'),
      `def even_squares(values):
    return [___ for value in values if ___]`,
      b('[4, 16, 36]', '[4, 16, 36]'),
      [b('The expression is value ** 2.', 'A expressão é value ** 2.'), b('A number is even when value % 2 == 0.', 'Um número é par quando value % 2 == 0.'), b('Use the parameter values; do not recreate the visible list.', 'Use o parâmetro values; não recrie a lista visível.')],
      [{ kind: 'function', value: 'even_squares' }, { kind: 'node', value: 'ListComp' }, { kind: 'node', value: 'BinOp', minCount: 2 }],
      exactTest('p12-even-visible', b('Squares visible even values', 'Eleva valores pares visíveis ao quadrado'), `print(even_squares([1, 2, 4, 5, 6]))`, b('[4, 16, 36]', '[4, 16, 36]'), 60, [{ kind: 'function', value: 'even_squares' }, { kind: 'node', value: 'ListComp' }]),
      exactTest('p12-even-hidden-negative', b('Handles negative even numbers', 'Trata números pares negativos'), `print(even_squares([-4, -3, 0]))`, b('[16, 0]', '[16, 0]'), 40, [{ kind: 'function', value: 'even_squares' }, { kind: 'node', value: 'ListComp' }], true),
      'guided',
      b('Identify expression, source and filter in one comprehension.', 'Identificar expressão, origem e filtro em uma compreensão.'),
      b('Preparing numeric data for reports or visualizations.', 'Preparação de dados numéricos para relatórios ou visualizações.'),
      { en: ['Uses one list comprehension', 'Preserves source order', 'Handles negative and zero'], pt: ['Usa uma compreensão de lista', 'Preserva ordem de origem', 'Trata negativos e zero'] },
      { en: ['Returning original even values', 'Testing odd instead of even', 'Hardcoding output'], pt: ['Retornar pares originais', 'Testar ímpar em vez de par', 'Fixar a saída'] },
    ),
    exercise(
      'p12-complete-names',
      b('🟡 Complete — normalize non-empty names', '🟡 Complete — normalize nomes não vazios'),
      b('Finish clean_names. Strip surrounding spaces, discard blank names and return lowercase values while preserving accents.', 'Termine clean_names. Remova espaços externos, descarte nomes vazios e retorne valores em minúsculas preservando acentos.'),
      `def clean_names(names):
    return [
        name.___().___()
        for name in names
        if name.___()
    ]`,
      b("['ana', 'joão']", "['ana', 'joão']"),
      [b('Use strip before lower.', 'Use strip antes de lower.'), b('The filter should also use strip so whitespace-only values are removed.', 'O filtro também deve usar strip para remover valores apenas com espaços.'), b('Python lower preserves accented characters.', 'lower do Python preserva caracteres acentuados.')],
      [{ kind: 'function', value: 'clean_names' }, { kind: 'node', value: 'ListComp' }, { kind: 'call', value: 'strip', minCount: 2 }, { kind: 'call', value: 'lower' }],
      exactTest('p12-names-visible', b('Normalizes names and removes blanks', 'Normaliza nomes e remove vazios'), `print(clean_names([" Ana ", "", " JOÃO ", "   "]))`, b("['ana', 'joão']", "['ana', 'joão']"), 60, [{ kind: 'function', value: 'clean_names' }, { kind: 'node', value: 'ListComp' }, { kind: 'call', value: 'strip' }]),
      exactTest('p12-names-hidden-accent', b('Preserves another accented name', 'Preserva outro nome acentuado'), `print(clean_names([" ÉRICA "]))`, b("['érica']", "['érica']"), 40, [{ kind: 'function', value: 'clean_names' }, { kind: 'node', value: 'ListComp' }, { kind: 'call', value: 'lower' }], true),
      'independent',
      b('Combine normalization and filtering without losing text information.', 'Combinar normalização e filtro sem perder informação textual.'),
      b('Cleaning imported names, labels or search terms.', 'Limpeza de nomes, rótulos ou termos de busca importados.'),
      { en: ['Removes blanks', 'Preserves accents', 'Does not mutate input'], pt: ['Remove vazios', 'Preserva acentos', 'Não altera a entrada'] },
      { en: ['Filtering before strip', 'Calling lower on the list', 'Removing accented letters'], pt: ['Filtrar antes de strip', 'Chamar lower na lista', 'Remover letras acentuadas'] },
    ),
    exercise(
      'p12-zero-products',
      b('🔴 From scratch — select and project records', '🔴 Do zero — selecione e projete registros'),
      b('Write available_labels(products). Use one list comprehension to return "sku:name" for records with stock > 0. Raise ValueError("negative stock") before the comprehension if any stock is negative.', 'Escreva available_labels(products). Use uma compreensão para retornar "sku:name" de registros com stock > 0. Gere ValueError("negative stock") antes da compreensão se qualquer estoque for negativo.'),
      `def available_labels(products):
    pass`,
      b("['A:Mouse', 'C:Café']", "['A:Mouse', 'C:Café']"),
      [b('Validate the collection first with any or a normal loop.', 'Valide a coleção primeiro com any ou loop normal.'), b('The comprehension expression can use an f-string.', 'A expressão da compreensão pode usar f-string.'), b('The final filter is product["stock"] > 0.', 'O filtro final é product["stock"] > 0.')],
      [{ kind: 'function', value: 'available_labels' }, { kind: 'node', value: 'ListComp' }, { kind: 'node', value: 'Raise' }, { kind: 'node', value: 'JoinedStr' }],
      exactTest('p12-products-visible', b('Selects available product labels', 'Seleciona rótulos de produtos disponíveis'), `print(available_labels([{"sku": "A", "name": "Mouse", "stock": 2}, {"sku": "B", "name": "Monitor", "stock": 0}, {"sku": "C", "name": "Café", "stock": 1}]))`, b("['A:Mouse', 'C:Café']", "['A:Mouse', 'C:Café']"), 60, [{ kind: 'function', value: 'available_labels' }, { kind: 'node', value: 'ListComp' }, { kind: 'node', value: 'JoinedStr' }]),
      exactTest('p12-products-hidden-negative', b('Rejects negative stock before projection', 'Rejeita estoque negativo antes da projeção'), `try:
    available_labels([{"sku": "X", "name": "Invalid", "stock": -1}])
except ValueError as error:
    print(error)`, b('negative stock', 'negative stock'), 40, [{ kind: 'function', value: 'available_labels' }, { kind: 'node', value: 'Raise' }], true),
      'independent',
      b('Validate complex rules separately, then use a clear comprehension.', 'Validar regras complexas separadamente e depois usar compreensão clara.'),
      b('Creating compact labels for catalogs and inventory screens.', 'Criação de rótulos compactos para catálogos e telas de estoque.'),
      { en: ['Validates all stocks', 'Uses one list comprehension for output', 'Preserves accented names'], pt: ['Valida todos os estoques', 'Usa uma compreensão para a saída', 'Preserva nomes acentuados'] },
      { en: ['Hiding validation inside a long expression', 'Including zero stock', 'Returning full records'], pt: ['Esconder validação numa expressão longa', 'Incluir estoque zero', 'Retornar registros completos'] },
    ),
    exercise(
      'p12-transfer',
      b('🟣 Challenge — flatten and filter a grid', '🟣 Desafio — achate e filtre uma grade'),
      b('Write positive_cells(grid). Use one nested list comprehension to flatten the grid and return only values greater than zero. Every cell must be int or float; otherwise raise ValueError("non-numeric cell").', 'Escreva positive_cells(grid). Use uma compreensão aninhada para achatar a grade e retornar apenas valores maiores que zero. Toda célula deve ser int ou float; caso contrário gere ValueError("non-numeric cell").'),
      `def positive_cells(grid):
    pass`,
      b('[1, 3, 5]', '[1, 3, 5]'),
      [b('Validate cells before constructing the result.', 'Valide as células antes de construir o resultado.'), b('Nested clauses follow the expanded loop order: for row, then for cell.', 'Cláusulas aninhadas seguem a ordem do loop expandido: for row, depois for cell.'), b('The filter cell > 0 comes last.', 'O filtro cell > 0 vem por último.')],
      [{ kind: 'function', value: 'positive_cells' }, { kind: 'node', value: 'ListComp' }, { kind: 'node', value: 'comprehension', minCount: 2 }, { kind: 'node', value: 'Raise' }],
      exactTest('p12-flat-visible', b('Flattens and keeps positive cells', 'Achata e mantém células positivas'), `print(positive_cells([[1, -2], [0, 3], [5]]))`, b('[1, 3, 5]', '[1, 3, 5]'), 60, [{ kind: 'function', value: 'positive_cells' }, { kind: 'node', value: 'ListComp' }]),
      exactTest('p12-flat-hidden-invalid', b('Rejects a non-numeric cell', 'Rejeita célula não numérica'), `try:
    positive_cells([[1], ["bad"]])
except ValueError as error:
    print(error)`, b('non-numeric cell', 'non-numeric cell'), 40, [{ kind: 'function', value: 'positive_cells' }, { kind: 'node', value: 'Raise' }], true),
      'challenge',
      b('Translate nested loops into a readable nested comprehension after validation.', 'Traduzir loops aninhados para compreensão legível após validação.'),
      b('Flattening small matrices, sensor batches or game boards.', 'Achatamento de pequenas matrizes, lotes de sensores ou tabuleiros.'),
      { en: ['Uses nested comprehension', 'Returns [] for empty grid', 'Rejects non-numeric cells'], pt: ['Usa compreensão aninhada', 'Retorna [] para grade vazia', 'Rejeita células não numéricas'] },
      { en: ['Reversing clause order', 'Filtering rows instead of cells', 'Skipping validation'], pt: ['Inverter ordem das cláusulas', 'Filtrar linhas em vez de células', 'Pular validação'] },
    ),
  ],
  quiz: [
    { id: 'q12-v11-1', question: b('In [x * 2 for x in values if x > 0], what enters the new list?', 'Em [x * 2 for x in values if x > 0], o que entra na nova lista?'), options: [b('x * 2 for each positive x', 'x * 2 para cada x positivo'), b('Every original x', 'Todo x original'), b('Only the condition result', 'Apenas o resultado da condição'), b('The values list itself', 'A própria lista values')], correctIndex: 0, explanation: b('The first expression creates the output value. The final if controls which source items reach it.', 'A primeira expressão cria o valor de saída. O if final controla quais itens de origem chegam até ela.') },
    { id: 'q12-v11-2', question: b('Which comprehension matches nested loops for row in grid, then for cell in row?', 'Qual compreensão corresponde aos loops for row in grid e depois for cell in row?'), options: [b('[cell for row in grid for cell in row]', '[cell for row in grid for cell in row]'), b('[cell for cell in row for row in grid]', '[cell for cell in row for row in grid]'), b('[row for cell in row]', '[row for cell in row]'), b('[grid for row in cell]', '[grid for row in cell]')], correctIndex: 0, explanation: b('Comprehension clauses preserve the order of the expanded loops: outer row loop first, inner cell loop second.', 'As cláusulas preservam a ordem dos loops expandidos: loop externo de linha primeiro, interno de célula depois.') },
    { id: 'q12-v11-3', question: b('When should you prefer a normal loop?', 'Quando você deve preferir um loop normal?'), options: [b('When logic needs several branches, logging or error recovery', 'Quando a lógica precisa de vários caminhos, logs ou recuperação de erro'), b('Whenever output is a list', 'Sempre que a saída for lista'), b('Only when input is empty', 'Apenas quando a entrada estiver vazia'), b('Never; comprehensions are always better', 'Nunca; compreensões são sempre melhores')], correctIndex: 0, explanation: b('A normal loop gives complex decisions names and visible steps. Concision is not useful when it hides behavior.', 'Um loop normal dá nomes e passos visíveis a decisões complexas. Concisão não ajuda quando esconde comportamento.') },
    { id: 'q12-v11-4', question: b('Does [record for record in records] copy each dictionary?', 'A expressão [record for record in records] copia cada dicionário?'), options: [b('No, it creates a new list with the same dictionary references', 'Não, ela cria nova lista com as mesmas referências de dicionário'), b('Yes, it performs a deep copy', 'Sim, ela realiza cópia profunda'), b('Yes, but removes keys', 'Sim, mas remove chaves'), b('It returns a tuple', 'Ela retorna uma tupla')], correctIndex: 0, explanation: b('The outer list is new, but each element is the original dictionary unless the expression uses record.copy().', 'A lista externa é nova, mas cada elemento é o dicionário original, a menos que a expressão use record.copy().') },
  ],
  exam: {
    title: b('Personal finance transaction cleanup', 'Limpeza de transações de finanças pessoais'),
    scenario: b('Build clean_expenses(transactions, minimum). Validate records, then use list comprehensions to return rounded expense amounts at or above minimum and the normalized unique categories in first-seen order.', 'Crie clean_expenses(transactions, minimum). Valide registros e depois use compreensões para retornar valores de despesas arredondados a partir do mínimo e categorias únicas normalizadas na ordem da primeira aparição.'),
    requirements: {
      en: ['Each record requires amount, category and type', 'Raise ValueError("negative amount") for negative amount', 'Expenses use type == "expense" and amount >= minimum', 'Return [expense_amounts, categories]', 'Use at least one list comprehension for expense_amounts'],
      pt: ['Cada registro exige amount, category e type', 'Gere ValueError("negative amount") para valor negativo', 'Despesas usam type == "expense" e amount >= minimum', 'Retorne [valores_despesa, categorias]', 'Use pelo menos uma compreensão para valores_despesa'],
    },
    starterCode: `def clean_expenses(transactions, minimum):
    pass`,
    expectedOutput: b("[[35.5, 100], ['food', 'rent']]", "[[35.5, 100], ['food', 'rent']]"),
    testCases: [
      exactTest('p12-exam-visible', b('Filters amounts and normalizes categories', 'Filtra valores e normaliza categorias'), `data = [{"amount": 35.5, "category": " Food ", "type": "expense"}, {"amount": 20, "category": "salary", "type": "income"}, {"amount": 100, "category": "Rent", "type": "expense"}, {"amount": 5, "category": "food", "type": "expense"}]
print(clean_expenses(data, 10))`, b("[[35.5, 100], ['food', 'rent']]", "[[35.5, 100], ['food', 'rent']]"), 60, [{ kind: 'function', value: 'clean_expenses' }, { kind: 'node', value: 'ListComp' }, { kind: 'call', value: 'strip' }, { kind: 'call', value: 'lower' }]),
      exactTest('p12-exam-empty', b('Handles empty transaction data', 'Trata dados de transação vazios'), `print(clean_expenses([], 0))`, b('[[], []]', '[[], []]'), 20, [{ kind: 'function', value: 'clean_expenses' }, { kind: 'node', value: 'ListComp' }], true),
      exactTest('p12-exam-negative', b('Rejects negative amount', 'Rejeita valor negativo'), `try:
    clean_expenses([{"amount": -1, "category": "fee", "type": "expense"}], 0)
except ValueError as error:
    print(error)`, b('negative amount', 'negative amount'), 20, [{ kind: 'function', value: 'clean_expenses' }, { kind: 'node', value: 'Raise' }], true),
    ],
  },
}
