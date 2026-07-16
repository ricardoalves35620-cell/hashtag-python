import type { Bilingual } from './types'

export interface MiniProjectGuideItem {
  label: Bilingual
  meaning: Bilingual
  example: Bilingual
}

export interface MiniProjectImproveChoice {
  title: Bilingual
  change: Bilingual
  example: Bilingual
  why: Bilingual
}

export interface MiniProjectGuide {
  mission: Bilingual
  story: Bilingual
  result: Bilingual
  exactTasks: Bilingual[]
  inputItems: MiniProjectGuideItem[]
  outputItems: MiniProjectGuideItem[]
  understandAnswers: {
    inputs: Bilingual
    output: Bilingual
    rules: Bilingual
    edgeCase: Bilingual
  }
  planSteps: Bilingual[]
  codeWords: Array<{ code: string; meaning: Bilingual }>
  buildHints: Bilingual[]
  sample: {
    title: Bilingual
    inputs: Bilingual[]
    happens: Bilingual[]
    outputs: Bilingual[]
  }
  testPurposes: Record<string, Bilingual>
  improveIntro: Bilingual
  improveChoices: MiniProjectImproveChoice[]
  improveNoteExample: Bilingual
  doNotChange: Bilingual
}

export const MINI_PROJECT_GUIDES: Record<string, MiniProjectGuide> = {
  'damage-estimate': {
    mission: {
      en: 'Make a program that tells an event organizer how much money is still available.',
      pt: 'Faça um programa que diga quanto dinheiro ainda sobra para organizar um evento.',
    },
    story: {
      en: 'Imagine a school party. The organizer has a budget and has already promised to pay some expenses. Your program subtracts the expenses from the budget.',
      pt: 'Imagine uma festa da escola. A pessoa tem um orçamento e já prometeu pagar algumas despesas. Seu programa vai tirar as despesas do orçamento.',
    },
    result: {
      en: 'The screen must show one line with the remaining money, always using two decimal places.',
      pt: 'A tela deve mostrar uma linha com o dinheiro que sobrou, sempre usando duas casas decimais.',
    },
    exactTasks: [
      { en: 'Read the event budget.', pt: 'Leia o orçamento do evento.' },
      { en: 'Read the expenses already committed.', pt: 'Leia as despesas que já foram combinadas.' },
      { en: 'Subtract expenses from the budget.', pt: 'Subtraia as despesas do orçamento.' },
      { en: 'Save the answer in remaining.', pt: 'Guarde a resposta em remaining.' },
      { en: 'Print the answer with two decimal places.', pt: 'Mostre a resposta com duas casas decimais.' },
    ],
    inputItems: [
      { label: { en: 'Budget', pt: 'Orçamento' }, meaning: { en: 'All money available for the event.', pt: 'Todo o dinheiro disponível para o evento.' }, example: { en: '5000', pt: '5000' } },
      { label: { en: 'Expenses', pt: 'Despesas' }, meaning: { en: 'Money that will already be spent.', pt: 'Dinheiro que já será gasto.' }, example: { en: '500', pt: '500' } },
    ],
    outputItems: [
      { label: { en: 'Remaining', pt: 'Saldo' }, meaning: { en: 'Budget minus expenses.', pt: 'Orçamento menos despesas.' }, example: { en: '4500.00', pt: '4500.00' } },
    ],
    understandAnswers: {
      inputs: { en: 'The budget and the committed expenses.', pt: 'O orçamento e as despesas comprometidas.' },
      output: { en: 'The remaining balance with two decimal places.', pt: 'O saldo restante com duas casas decimais.' },
      rules: { en: 'Subtract expenses from the budget.', pt: 'Subtrair as despesas do orçamento.' },
      edgeCase: { en: 'When budget and expenses are equal, the result must be 0.00.', pt: 'Quando orçamento e despesas forem iguais, o resultado deve ser 0.00.' },
    },
    planSteps: [
      { en: 'RECEIVE the budget.', pt: 'RECEBER o orçamento.' },
      { en: 'RECEIVE the expenses.', pt: 'RECEBER as despesas.' },
      { en: 'CALCULATE budget minus expenses.', pt: 'CALCULAR orçamento menos despesas.' },
      { en: 'SHOW the remaining balance with two decimal places.', pt: 'MOSTRAR o saldo com duas casas decimais.' },
    ],
    codeWords: [
      { code: 'budget', meaning: { en: 'all money available', pt: 'todo o dinheiro disponível' } },
      { code: 'expenses', meaning: { en: 'money already committed', pt: 'dinheiro já comprometido' } },
      { code: 'remaining', meaning: { en: 'money left after subtraction', pt: 'dinheiro que sobra depois da subtração' } },
    ],
    buildHints: [
      { en: 'Replace the temporary value 0 with the subtraction budget - expenses.', pt: 'Troque o valor provisório 0 pela subtração budget - expenses.' },
      { en: 'Do not remove float(). It turns typed text into a number with decimals.', pt: 'Não remova float(). Ele transforma o texto digitado em número com decimais.' },
      { en: 'Keep :.2f in the print. It shows exactly two decimal places.', pt: 'Mantenha :.2f no print. Ele mostra exatamente duas casas decimais.' },
    ],
    sample: {
      title: { en: 'Example from beginning to end', pt: 'Exemplo do começo ao fim' },
      inputs: [{ en: 'Budget: 5000', pt: 'Orçamento: 5000' }, { en: 'Expenses: 500', pt: 'Despesas: 500' }],
      happens: [{ en: 'The program calculates 5000 - 500.', pt: 'O programa calcula 5000 - 500.' }],
      outputs: [{ en: 'Remaining: 4500.00', pt: 'Saldo: 4500.00' }],
    },
    testPurposes: {
      'estimate-standard': { en: 'Checks a normal whole-number budget.', pt: 'Confere um orçamento normal com números inteiros.' },
      'estimate-decimal': { en: 'Checks that cents are not lost.', pt: 'Confere se os centavos não são perdidos.' },
      'estimate-equal-values': { en: 'Checks the exact zero limit.', pt: 'Confere o limite em que o saldo é exatamente zero.' },
    },
    improveIntro: {
      en: 'Do not invent a new feature. Make the same program easier for another person to read.',
      pt: 'Não invente uma função nova. Deixe o mesmo programa mais fácil para outra pessoa ler.',
    },
    improveChoices: [
      { title: { en: 'Use a clearer result name', pt: 'Usar um nome mais claro para o resultado' }, change: { en: 'Rename remaining to remaining_budget everywhere.', pt: 'Troque remaining por remaining_budget em todos os lugares.' }, example: { en: 'remaining = ... becomes remaining_budget = ...', pt: 'remaining = ... vira remaining_budget = ...' }, why: { en: 'The name explains what is remaining.', pt: 'O nome explica o que está sobrando.' } },
      { title: { en: 'Separate the three parts', pt: 'Separar as três partes' }, change: { en: 'Add short comments for input, calculation and output.', pt: 'Adicione comentários curtos para entrada, cálculo e saída.' }, example: { en: '# Input\n# Calculation\n# Output', pt: '# Entrada\n# Cálculo\n# Saída' }, why: { en: 'A reader finds each part faster.', pt: 'A pessoa encontra cada parte mais rápido.' } },
      { title: { en: 'Remove a repeated comment', pt: 'Remover um comentário repetido' }, change: { en: 'Remove one comment that only says the same thing as the next line.', pt: 'Remova um comentário que apenas repete o que a próxima linha já mostra.' }, example: { en: 'Remove “calculate the balance” when the line already says budget - expenses.', pt: 'Remova “calcule o saldo” quando a linha já mostra budget - expenses.' }, why: { en: 'Useful comments explain why, not the obvious.', pt: 'Comentários úteis explicam o motivo, não o óbvio.' } },
    ],
    improveNoteExample: { en: 'I renamed remaining to remaining_budget because the new name says exactly what the value means.', pt: 'Eu troquei remaining por remaining_budget porque o novo nome diz exatamente o que o valor significa.' },
    doNotChange: { en: 'Do not change the formula or the words printed in the result.', pt: 'Não altere a fórmula nem as palavras mostradas no resultado.' },
  },

  'claim-queue': {
    mission: {
      en: 'Make a program that reads several shipment values and calculates their count, total and average.',
      pt: 'Faça um programa que leia vários valores de remessas e calcule quantidade, total e média.',
    },
    story: {
      en: 'Imagine boxes arriving at a warehouse. First, someone says how many boxes will arrive. Then the program reads the value of each box, one at a time.',
      pt: 'Imagine caixas chegando a um depósito. Primeiro, alguém informa quantas caixas chegarão. Depois, o programa lê o valor de cada caixa, uma por vez.',
    },
    result: {
      en: 'After reading every shipment, the program shows how many it processed, the sum and the average.',
      pt: 'Depois de ler todas as remessas, o programa mostra quantas processou, a soma e a média.',
    },
    exactTasks: [
      { en: 'Read how many shipments will arrive.', pt: 'Leia quantas remessas vão chegar.' },
      { en: 'Start processed at 0 and total at 0.0.', pt: 'Comece processed em 0 e total em 0.0.' },
      { en: 'Repeat while processed is smaller than quantity.', pt: 'Repita enquanto processed for menor que quantity.' },
      { en: 'Inside the loop, read one value, add it to total and add 1 to processed.', pt: 'Dentro do loop, leia um valor, some ao total e adicione 1 em processed.' },
      { en: 'If at least one shipment was processed, divide total by processed. Otherwise, use 0.0.', pt: 'Se pelo menos uma remessa foi processada, divida total por processed. Caso contrário, use 0.0.' },
      { en: 'Print processed, total and average.', pt: 'Mostre processados, total e média.' },
    ],
    inputItems: [
      { label: { en: 'Quantity', pt: 'Quantidade' }, meaning: { en: 'How many shipment values will be typed next.', pt: 'Quantos valores de remessa serão digitados depois.' }, example: { en: '3', pt: '3' } },
      { label: { en: 'Shipment value', pt: 'Valor da remessa' }, meaning: { en: 'The declared value of one shipment. It repeats.', pt: 'O valor declarado de uma remessa. Ele se repete.' }, example: { en: '1200, then 800, then 2000', pt: '1200, depois 800, depois 2000' } },
    ],
    outputItems: [
      { label: { en: 'Processed', pt: 'Processados' }, meaning: { en: 'How many values were read.', pt: 'Quantos valores foram lidos.' }, example: { en: '3', pt: '3' } },
      { label: { en: 'Total', pt: 'Total' }, meaning: { en: 'All shipment values added together.', pt: 'Todos os valores somados.' }, example: { en: '4000.00', pt: '4000.00' } },
      { label: { en: 'Average', pt: 'Média' }, meaning: { en: 'Total divided by processed.', pt: 'Total dividido por processados.' }, example: { en: '1333.33', pt: '1333.33' } },
    ],
    understandAnswers: {
      inputs: { en: 'First the quantity, then one value for each shipment.', pt: 'Primeiro a quantidade e depois um valor para cada remessa.' },
      output: { en: 'Processed count, total value and average value.', pt: 'Quantidade processada, valor total e valor médio.' },
      rules: { en: 'Repeat exactly quantity times, add each value and increase processed.', pt: 'Repetir exatamente quantity vezes, somar cada valor e aumentar processed.' },
      edgeCase: { en: 'When quantity is 0, do not divide by zero. The average must be 0.0.', pt: 'Quando quantity for 0, não divida por zero. A média deve ser 0.0.' },
    },
    planSteps: [
      { en: 'RECEIVE quantity.', pt: 'RECEBER quantity.' },
      { en: 'START processed at 0 and total at 0.0.', pt: 'COMEÇAR processed em 0 e total em 0.0.' },
      { en: 'WHILE processed is less than quantity, read one amount.', pt: 'ENQUANTO processed for menor que quantity, ler um amount.' },
      { en: 'ADD amount to total.', pt: 'SOMAR amount ao total.' },
      { en: 'ADD 1 to processed.', pt: 'SOMAR 1 em processed.' },
      { en: 'IF processed is greater than 0, calculate total / processed. ELSE use 0.0.', pt: 'SE processed for maior que 0, calcular total / processed. SENÃO usar 0.0.' },
      { en: 'SHOW processed, total and average.', pt: 'MOSTRAR processed, total e average.' },
    ],
    codeWords: [
      { code: 'quantity', meaning: { en: 'how many shipments are expected', pt: 'quantas remessas são esperadas' } },
      { code: 'processed', meaning: { en: 'how many shipments are already done', pt: 'quantas remessas já foram processadas' } },
      { code: 'amount', meaning: { en: 'the value read in the current loop', pt: 'o valor lido na repetição atual' } },
      { code: 'total', meaning: { en: 'the sum collected so far', pt: 'a soma acumulada até agora' } },
      { code: 'average', meaning: { en: 'total divided by processed', pt: 'total dividido por processados' } },
    ],
    buildHints: [
      { en: 'Change while False to a condition that stays true only while there are shipments left.', pt: 'Troque while False por uma condição que fique verdadeira apenas enquanto ainda faltarem remessas.' },
      { en: 'The loop condition can compare processed with quantity.', pt: 'A condição do loop pode comparar processed com quantity.' },
      { en: 'Inside the loop, both total and processed must change. If processed never changes, the loop never ends.', pt: 'Dentro do loop, total e processed precisam mudar. Se processed nunca mudar, o loop nunca termina.' },
      { en: 'Calculate the average only after the loop.', pt: 'Calcule a média somente depois do loop.' },
      { en: 'Use a clear if/else to avoid division by zero.', pt: 'Use um if/else claro para evitar divisão por zero.' },
    ],
    sample: {
      title: { en: 'Example from beginning to end', pt: 'Exemplo do começo ao fim' },
      inputs: [{ en: 'Quantity: 3', pt: 'Quantidade: 3' }, { en: 'Values: 1200, 800, 2000', pt: 'Valores: 1200, 800, 2000' }],
      happens: [
        { en: 'After 1200: processed = 1 and total = 1200.', pt: 'Depois de 1200: processed = 1 e total = 1200.' },
        { en: 'After 800: processed = 2 and total = 2000.', pt: 'Depois de 800: processed = 2 e total = 2000.' },
        { en: 'After 2000: processed = 3 and total = 4000.', pt: 'Depois de 2000: processed = 3 e total = 4000.' },
        { en: 'Average is 4000 / 3 = 1333.33.', pt: 'A média é 4000 / 3 = 1333.33.' },
      ],
      outputs: [{ en: 'Processed: 3', pt: 'Processados: 3' }, { en: 'Total: 4000.00', pt: 'Total: 4000.00' }, { en: 'Average: 1333.33', pt: 'Média: 1333.33' }],
    },
    testPurposes: {
      'queue-three': { en: 'Checks that the loop repeats three times and adds three values.', pt: 'Confere se o loop repete três vezes e soma três valores.' },
      'queue-single': { en: 'Checks the smallest non-empty queue.', pt: 'Confere a menor fila que ainda possui um item.' },
      'queue-zero': { en: 'Checks that an empty queue does not cause division by zero.', pt: 'Confere se uma fila vazia não causa divisão por zero.' },
    },
    improveIntro: {
      en: 'The program already works. Now make one small part easier to understand without changing the answers.',
      pt: 'O programa já funciona. Agora deixe uma pequena parte mais fácil de entender sem mudar as respostas.',
    },
    improveChoices: [
      { title: { en: 'Use a clearer quantity name', pt: 'Usar um nome mais claro para a quantidade' }, change: { en: 'Rename quantity to shipment_count everywhere.', pt: 'Troque quantity por shipment_count em todos os lugares.' }, example: { en: 'while processed < shipment_count:', pt: 'while processed < shipment_count:' }, why: { en: 'The reader immediately knows what is being counted.', pt: 'A pessoa entende na hora o que está sendo contado.' } },
      { title: { en: 'Explain the empty queue', pt: 'Explicar a fila vazia' }, change: { en: 'Use a visible if/else block for the average.', pt: 'Use um bloco if/else visível para a média.' }, example: { en: 'if processed == 0: average = 0.0', pt: 'if processed == 0: average = 0.0' }, why: { en: 'The zero rule becomes easy to find.', pt: 'A regra do zero fica fácil de encontrar.' } },
      { title: { en: 'Group the loop updates', pt: 'Agrupar as mudanças do loop' }, change: { en: 'Keep total += amount and processed += 1 next to each other.', pt: 'Mantenha total += amount e processed += 1 uma perto da outra.' }, example: { en: 'Place both lines directly after reading amount.', pt: 'Coloque as duas linhas logo depois de ler amount.' }, why: { en: 'It is easier to see that every loop makes progress.', pt: 'Fica mais fácil ver que cada repetição avança.' } },
    ],
    improveNoteExample: { en: 'I renamed quantity to shipment_count because the new name explains that it counts shipments.', pt: 'Eu troquei quantity por shipment_count porque o novo nome explica que ele conta remessas.' },
    doNotChange: { en: 'Do not remove the while loop and do not change the printed labels.', pt: 'Não remova o while e não altere os nomes mostrados no resultado.' },
  },

  'portfolio-report': {
    mission: { en: 'Read a group of store orders and make a report with only the approved ones.', pt: 'Leia um grupo de pedidos da loja e faça um relatório somente com os aprovados.' },
    story: { en: 'Each order is one small form with a customer, an amount and a status. Some are approved and some are not.', pt: 'Cada pedido é uma pequena ficha com cliente, valor e status. Alguns são aprovados e outros não.' },
    result: { en: 'Show how many orders were approved, the approved customer names and the approved money total.', pt: 'Mostre quantos pedidos foram aprovados, os nomes dos clientes aprovados e o total de dinheiro aprovado.' },
    exactTasks: [
      { en: 'Read how many orders will be entered.', pt: 'Leia quantos pedidos serão informados.' },
      { en: 'For each order, split customer|amount|status.', pt: 'Para cada pedido, separe cliente|valor|status.' },
      { en: 'Save each order as a dictionary inside a list.', pt: 'Guarde cada pedido como dicionário dentro de uma lista.' },
      { en: 'Use a list comprehension to keep only status approved.', pt: 'Use uma compreensão de lista para manter apenas status approved.' },
      { en: 'Create a list with the approved customer names.', pt: 'Crie uma lista com os nomes dos clientes aprovados.' },
      { en: 'Add the approved amounts.', pt: 'Some os valores aprovados.' },
      { en: 'Print count, names and total.', pt: 'Mostre quantidade, nomes e total.' },
    ],
    inputItems: [
      { label: { en: 'Order quantity', pt: 'Quantidade de pedidos' }, meaning: { en: 'How many order lines will come next.', pt: 'Quantas linhas de pedido virão depois.' }, example: { en: '3', pt: '3' } },
      { label: { en: 'Order line', pt: 'Linha de pedido' }, meaning: { en: 'customer|amount|status', pt: 'cliente|valor|status' }, example: { en: 'Ana|120.50|approved', pt: 'Ana|120.50|approved' } },
    ],
    outputItems: [
      { label: { en: 'Approved', pt: 'Aprovados' }, meaning: { en: 'Number of approved orders.', pt: 'Quantidade de pedidos aprovados.' }, example: { en: '2', pt: '2' } },
      { label: { en: 'Customers', pt: 'Clientes' }, meaning: { en: 'Names from approved orders.', pt: 'Nomes dos pedidos aprovados.' }, example: { en: 'Ana, João', pt: 'Ana, João' } },
      { label: { en: 'Total', pt: 'Total' }, meaning: { en: 'Sum of approved amounts.', pt: 'Soma dos valores aprovados.' }, example: { en: '320.50', pt: '320.50' } },
    ],
    understandAnswers: {
      inputs: { en: 'The order quantity and one customer|amount|status line for each order.', pt: 'A quantidade e uma linha cliente|valor|status para cada pedido.' },
      output: { en: 'Approved count, approved customer names and approved total.', pt: 'Quantidade aprovada, nomes aprovados e total aprovado.' },
      rules: { en: 'Only orders with status approved enter the report.', pt: 'Somente pedidos com status approved entram no relatório.' },
      edgeCase: { en: 'The program must work when no order is approved.', pt: 'O programa precisa funcionar quando nenhum pedido for aprovado.' },
    },
    planSteps: [
      { en: 'RECEIVE the order quantity.', pt: 'RECEBER a quantidade de pedidos.' },
      { en: 'REPEAT quantity times: read and split one order.', pt: 'REPETIR quantity vezes: ler e separar um pedido.' },
      { en: 'STORE each order as a dictionary in orders.', pt: 'GUARDAR cada pedido como dicionário em orders.' },
      { en: 'FILTER approved orders into approved_orders.', pt: 'FILTRAR pedidos aprovados em approved_orders.' },
      { en: 'CREATE customer_names from approved_orders.', pt: 'CRIAR customer_names a partir de approved_orders.' },
      { en: 'SUM approved amounts into approved_total.', pt: 'SOMAR os valores aprovados em approved_total.' },
      { en: 'SHOW count, names and total.', pt: 'MOSTRAR quantidade, nomes e total.' },
    ],
    codeWords: [
      { code: 'orders', meaning: { en: 'all order dictionaries', pt: 'todos os dicionários de pedido' } },
      { code: 'approved_orders', meaning: { en: 'only dictionaries with approved status', pt: 'somente os dicionários com status approved' } },
      { code: 'customer_names', meaning: { en: 'names taken from approved orders', pt: 'nomes retirados dos pedidos aprovados' } },
      { code: 'approved_total', meaning: { en: 'sum of approved amounts', pt: 'soma dos valores aprovados' } },
    ],
    buildHints: [
      { en: 'The first TODO needs a list comprehension that checks order["status"].', pt: 'O primeiro TODO precisa de uma compreensão de lista que confira order["status"].' },
      { en: 'The second TODO takes order["customer"] from every approved order.', pt: 'O segundo TODO pega order["customer"] de cada pedido aprovado.' },
      { en: 'The third TODO can use sum() with order["amount"].', pt: 'O terceiro TODO pode usar sum() com order["amount"].' },
      { en: 'An empty approved list is valid. Its count and sum should be zero.', pt: 'Uma lista vazia de aprovados é válida. Sua quantidade e soma devem ser zero.' },
    ],
    sample: {
      title: { en: 'Example from beginning to end', pt: 'Exemplo do começo ao fim' },
      inputs: [{ en: '3 orders', pt: '3 pedidos' }, { en: 'Ana|120.50|approved', pt: 'Ana|120.50|approved' }, { en: 'Beto|80|denied', pt: 'Beto|80|denied' }, { en: 'João|200|approved', pt: 'João|200|approved' }],
      happens: [{ en: 'The program keeps Ana and João and ignores Beto.', pt: 'O programa mantém Ana e João e ignora Beto.' }, { en: 'It adds 120.50 + 200.', pt: 'Ele soma 120.50 + 200.' }],
      outputs: [{ en: 'Approved: 2', pt: 'Aprovados: 2' }, { en: 'Customers: Ana, João', pt: 'Clientes: Ana, João' }, { en: 'Total: 320.5', pt: 'Total: 320.5' }],
    },
    testPurposes: {
      'portfolio-standard': { en: 'Checks a mix of approved and non-approved orders.', pt: 'Confere uma mistura de pedidos aprovados e não aprovados.' },
      'portfolio-empty': { en: 'Checks that an empty approved result is handled.', pt: 'Confere se o resultado sem aprovados é tratado.' },
      'portfolio-accents-decimals': { en: 'Checks accented names and decimal money.', pt: 'Confere nomes com acento e dinheiro com decimais.' },
    },
    improveIntro: { en: 'Make the report code easier to follow. Keep the same approved orders and totals.', pt: 'Deixe o código do relatório mais fácil de acompanhar. Mantenha os mesmos pedidos e totais.' },
    improveChoices: [
      { title: { en: 'Name the filter rule', pt: 'Dar nome à regra de filtro' }, change: { en: 'Create a small function called is_approved(order).', pt: 'Crie uma pequena função chamada is_approved(order).' }, example: { en: 'def is_approved(order): return order["status"] == "approved"', pt: 'def is_approved(order): return order["status"] == "approved"' }, why: { en: 'The rule can be read like a sentence.', pt: 'A regra pode ser lida como uma frase.' } },
      { title: { en: 'Use clearer collection names', pt: 'Usar nomes mais claros para as coleções' }, change: { en: 'Rename orders to all_orders or customer_names to approved_customer_names.', pt: 'Troque orders por all_orders ou customer_names por approved_customer_names.' }, example: { en: 'approved_customer_names = [...]', pt: 'approved_customer_names = [...]' }, why: { en: 'The name says which records are inside.', pt: 'O nome diz quais registros estão dentro.' } },
      { title: { en: 'Separate report sections', pt: 'Separar as partes do relatório' }, change: { en: 'Add short comments before reading, filtering and printing.', pt: 'Adicione comentários curtos antes de ler, filtrar e mostrar.' }, example: { en: '# Read orders\n# Build report\n# Show result', pt: '# Ler pedidos\n# Montar relatório\n# Mostrar resultado' }, why: { en: 'The three jobs become easy to find.', pt: 'As três tarefas ficam fáceis de encontrar.' } },
    ],
    improveNoteExample: { en: 'I created is_approved because the filter now explains its rule with a clear name.', pt: 'Eu criei is_approved porque o filtro agora explica sua regra com um nome claro.' },
    doNotChange: { en: 'Do not change which status counts as approved or the output labels.', pt: 'Não altere qual status conta como aprovado nem os nomes da saída.' },
  },

  'foundation-claim-desk': {
    mission: { en: 'Build a small text-menu program that saves records, lists them and adds their values.', pt: 'Monte um pequeno programa de menu que salva registros, lista e soma seus valores.' },
    story: { en: 'Think of a notebook controlled by commands. add writes a new record, list reads the notebook, total adds the money and exit closes it.', pt: 'Pense em um caderno controlado por comandos. add escreve um registro, list lê o caderno, total soma o dinheiro e exit fecha o programa.' },
    result: { en: 'The program must respond with exact labels so another program can understand every answer.', pt: 'O programa deve responder com palavras exatas para que outro programa entenda cada resposta.' },
    exactTasks: [
      { en: 'Keep all accepted records in a list of dictionaries.', pt: 'Guarde todos os registros aceitos em uma lista de dicionários.' },
      { en: 'Create functions to find, add, list and total records.', pt: 'Crie funções para buscar, adicionar, listar e somar registros.' },
      { en: 'Use a while loop to keep reading commands.', pt: 'Use um while para continuar lendo comandos.' },
      { en: 'Reject a repeated ID.', pt: 'Rejeite um ID repetido.' },
      { en: 'Catch a money value that is not a number.', pt: 'Trate um valor de dinheiro que não seja número.' },
      { en: 'Print the exact required labels.', pt: 'Mostre exatamente os rótulos pedidos.' },
    ],
    inputItems: [
      { label: { en: 'Command', pt: 'Comando' }, meaning: { en: 'add, list, total or exit.', pt: 'add, list, total ou exit.' }, example: { en: 'add', pt: 'add' } },
      { label: { en: 'Record data', pt: 'Dados do registro' }, meaning: { en: 'After add: ID, client and amount.', pt: 'Depois de add: ID, cliente e valor.' }, example: { en: 'C-1, Ana, 500', pt: 'C-1, Ana, 500' } },
    ],
    outputItems: [
      { label: { en: 'ADDED', pt: 'ADDED' }, meaning: { en: 'The record was saved.', pt: 'O registro foi salvo.' }, example: { en: 'ADDED=C-1', pt: 'ADDED=C-1' } },
      { label: { en: 'CLAIM', pt: 'CLAIM' }, meaning: { en: 'One saved record.', pt: 'Um registro salvo.' }, example: { en: 'CLAIM=C-1|Ana|500.00', pt: 'CLAIM=C-1|Ana|500.00' } },
      { label: { en: 'TOTAL', pt: 'TOTAL' }, meaning: { en: 'Sum of accepted amounts.', pt: 'Soma dos valores aceitos.' }, example: { en: 'TOTAL=500.00', pt: 'TOTAL=500.00' } },
    ],
    understandAnswers: {
      inputs: { en: 'Commands and, after add, an ID, client and amount.', pt: 'Comandos e, depois de add, um ID, cliente e valor.' },
      output: { en: 'Stable lines such as ADDED, CLAIM, TOTAL, DUPLICATE_ID, INVALID_AMOUNT and BYE.', pt: 'Linhas fixas como ADDED, CLAIM, TOTAL, DUPLICATE_ID, INVALID_AMOUNT e BYE.' },
      rules: { en: 'IDs cannot repeat. Invalid amounts are not saved. total adds accepted records.', pt: 'IDs não podem repetir. Valores inválidos não são salvos. total soma os registros aceitos.' },
      edgeCase: { en: 'The program must not crash with invalid money or an empty list.', pt: 'O programa não pode quebrar com dinheiro inválido ou lista vazia.' },
    },
    planSteps: [
      { en: 'CREATE an empty records list.', pt: 'CRIAR uma lista vazia de registros.' },
      { en: 'CREATE one function for each small job.', pt: 'CRIAR uma função para cada tarefa pequena.' },
      { en: 'REPEAT reading commands with while.', pt: 'REPETIR a leitura de comandos com while.' },
      { en: 'IF command is add, read data, validate and save.', pt: 'SE o comando for add, ler dados, validar e salvar.' },
      { en: 'IF command is list, print every saved record.', pt: 'SE o comando for list, mostrar cada registro salvo.' },
      { en: 'IF command is total, add accepted amounts.', pt: 'SE o comando for total, somar os valores aceitos.' },
      { en: 'IF command is exit, print BYE and stop.', pt: 'SE o comando for exit, mostrar BYE e parar.' },
    ],
    codeWords: [
      { code: 'claims', meaning: { en: 'the list that stores accepted records', pt: 'a lista que guarda registros aceitos' } },
      { code: 'find_claim', meaning: { en: 'looks for one ID', pt: 'procura um ID' } },
      { code: 'add_claim', meaning: { en: 'validates and saves one record', pt: 'valida e salva um registro' } },
      { code: 'list_claims', meaning: { en: 'prints every saved record', pt: 'mostra todos os registros salvos' } },
      { code: 'total_claims', meaning: { en: 'adds all accepted amounts', pt: 'soma todos os valores aceitos' } },
    ],
    buildHints: [
      { en: 'Finish one function at a time. Test it mentally before moving to the next.', pt: 'Termine uma função por vez. Faça um teste mental antes de ir para a próxima.' },
      { en: 'Use try/except only around the conversion that can fail.', pt: 'Use try/except apenas ao redor da conversão que pode falhar.' },
      { en: 'The command loop should choose functions, not contain every business rule.', pt: 'O loop de comandos deve escolher funções, não conter todas as regras.' },
      { en: 'Keep the output labels exactly as shown.', pt: 'Mantenha os rótulos de saída exatamente como aparecem.' },
    ],
    sample: {
      title: { en: 'Small command story', pt: 'Pequena história de comandos' },
      inputs: [{ en: 'add → C-1 → Ana → 500', pt: 'add → C-1 → Ana → 500' }, { en: 'list', pt: 'list' }, { en: 'total', pt: 'total' }, { en: 'exit', pt: 'exit' }],
      happens: [{ en: 'The record is saved, listed and included in the total.', pt: 'O registro é salvo, listado e incluído no total.' }],
      outputs: [{ en: 'ADDED=C-1', pt: 'ADDED=C-1' }, { en: 'CLAIM=C-1|Ana|500.00', pt: 'CLAIM=C-1|Ana|500.00' }, { en: 'TOTAL=500.00', pt: 'TOTAL=500.00' }, { en: 'BYE', pt: 'BYE' }],
    },
    testPurposes: {
      'claim-desk-standard': { en: 'Checks normal adding, listing and totaling.', pt: 'Confere adicionar, listar e somar normalmente.' },
      'claim-desk-validation': { en: 'Checks invalid money and a repeated ID.', pt: 'Confere dinheiro inválido e ID repetido.' },
      'claim-desk-empty': { en: 'Checks commands when no record was added.', pt: 'Confere os comandos quando nenhum registro foi adicionado.' },
    },
    improveIntro: { en: 'Choose one small boundary and make it easier to read. Keep every printed label unchanged.', pt: 'Escolha uma pequena parte e deixe mais fácil de ler. Mantenha todos os rótulos impressos.' },
    improveChoices: [
      { title: { en: 'Simplify ID lookup', pt: 'Simplificar a busca por ID' }, change: { en: 'Make find_claim return one clear result and use it everywhere.', pt: 'Faça find_claim retornar um resultado claro e use a função em todos os lugares.' }, example: { en: 'existing = find_claim(claims, claim_id)', pt: 'existing = find_claim(claims, claim_id)' }, why: { en: 'Duplicate checking has one source of truth.', pt: 'A verificação de duplicados fica em um só lugar.' } },
      { title: { en: 'Name the amount conversion', pt: 'Dar nome à conversão do valor' }, change: { en: 'Move text-to-float conversion into a small helper.', pt: 'Mova a conversão de texto para float para uma pequena função.' }, example: { en: 'def parse_amount(text): ...', pt: 'def parse_amount(text): ...' }, why: { en: 'The failure rule becomes easy to test.', pt: 'A regra de falha fica fácil de testar.' } },
      { title: { en: 'Shorten the command loop', pt: 'Encurtar o loop de comandos' }, change: { en: 'Let the loop only read a command and call the correct function.', pt: 'Faça o loop apenas ler um comando e chamar a função certa.' }, example: { en: 'if command == "list": list_claims(claims)', pt: 'if command == "list": list_claims(claims)' }, why: { en: 'The menu becomes easier to scan.', pt: 'O menu fica mais fácil de acompanhar.' } },
    ],
    improveNoteExample: { en: 'I moved amount conversion into parse_amount so invalid-money behavior can be tested in one place.', pt: 'Eu movi a conversão do valor para parse_amount para testar dinheiro inválido em um só lugar.' },
    doNotChange: { en: 'Do not change ADDED, CLAIM, TOTAL, DUPLICATE_ID, INVALID_AMOUNT or BYE.', pt: 'Não altere ADDED, CLAIM, TOTAL, DUPLICATE_ID, INVALID_AMOUNT nem BYE.' },
  },

  'professional-claims-triage': {
    mission: { en: 'Read records, decide their priority and print a safe summary.', pt: 'Leia registros, decida a prioridade e mostre um resumo seguro.' },
    story: { en: 'Think of a sorting table. Each record arrives as id|amount|severity. Your program checks the form, chooses STANDARD or ESCALATE and stores valid records.', pt: 'Pense em uma mesa de triagem. Cada registro chega como id|valor|gravidade. O programa confere a ficha, escolhe STANDARD ou ESCALATE e guarda os registros válidos.' },
    result: { en: 'Print one result for each line and one final summary. Invalid or repeated records must not stop the program.', pt: 'Mostre um resultado para cada linha e um resumo final. Registros inválidos ou repetidos não podem parar o programa.' },
    exactTasks: [
      { en: 'Use a dataclass as the trusted record form.', pt: 'Use uma dataclass como ficha confiável do registro.' },
      { en: 'Split and validate id|amount|severity.', pt: 'Separe e valide id|valor|gravidade.' },
      { en: 'Choose ESCALATE when severity is at least 8 or amount is at least 10000.', pt: 'Escolha ESCALATE quando gravidade for pelo menos 8 ou valor for pelo menos 10000.' },
      { en: 'Reject duplicate IDs.', pt: 'Rejeite IDs duplicados.' },
      { en: 'Log rejected records without printing private details.', pt: 'Registre rejeições sem mostrar detalhes privados.' },
      { en: 'Print the final count, total and escalated count.', pt: 'Mostre quantidade final, total e quantidade escalada.' },
    ],
    inputItems: [
      { label: { en: 'Record', pt: 'Registro' }, meaning: { en: 'id|amount|severity', pt: 'id|valor|gravidade' }, example: { en: 'C-101|1200|3', pt: 'C-101|1200|3' } },
      { label: { en: 'END', pt: 'END' }, meaning: { en: 'Stops the input loop.', pt: 'Encerra o loop de entrada.' }, example: { en: 'END', pt: 'END' } },
    ],
    outputItems: [
      { label: { en: 'CLAIM', pt: 'CLAIM' }, meaning: { en: 'Accepted ID, priority and amount.', pt: 'ID aceito, prioridade e valor.' }, example: { en: 'CLAIM=C-101|STANDARD|1200.00', pt: 'CLAIM=C-101|STANDARD|1200.00' } },
      { label: { en: 'SUMMARY', pt: 'SUMMARY' }, meaning: { en: 'Accepted count, total and escalated count.', pt: 'Quantidade aceita, total e quantidade escalada.' }, example: { en: 'SUMMARY=2|16200.00|1', pt: 'SUMMARY=2|16200.00|1' } },
    ],
    understandAnswers: {
      inputs: { en: 'One id|amount|severity record per line, ending with END.', pt: 'Um registro id|valor|gravidade por linha, terminando com END.' },
      output: { en: 'CLAIM, DUPLICATE, INVALID and SUMMARY lines.', pt: 'Linhas CLAIM, DUPLICATE, INVALID e SUMMARY.' },
      rules: { en: 'Validate values, reject repeated IDs and classify by severity or amount.', pt: 'Validar valores, rejeitar IDs repetidos e classificar por gravidade ou valor.' },
      edgeCase: { en: 'Empty, invalid and duplicate batches must still finish safely.', pt: 'Lotes vazios, inválidos e duplicados precisam terminar com segurança.' },
    },
    planSteps: [
      { en: 'DEFINE the Claim form.', pt: 'DEFINIR a ficha Claim.' },
      { en: 'CREATE a priority function.', pt: 'CRIAR uma função de prioridade.' },
      { en: 'CREATE a parser that validates one line.', pt: 'CRIAR um interpretador que valida uma linha.' },
      { en: 'CREATE a processor that checks duplicate IDs and stores valid records.', pt: 'CRIAR um processador que confere duplicados e salva registros válidos.' },
      { en: 'READ lines until END.', pt: 'LER linhas até END.' },
      { en: 'PRINT the summary.', pt: 'MOSTRAR o resumo.' },
    ],
    codeWords: [
      { code: 'Claim', meaning: { en: 'a trusted package of four related values', pt: 'um pacote confiável com quatro valores relacionados' } },
      { code: 'classify_priority', meaning: { en: 'decides STANDARD or ESCALATE', pt: 'decide STANDARD ou ESCALATE' } },
      { code: 'parse_claim', meaning: { en: 'turns raw text into a checked Claim', pt: 'transforma texto bruto em Claim validado' } },
      { code: 'process_line', meaning: { en: 'handles one line and one possible failure', pt: 'trata uma linha e uma possível falha' } },
      { code: 'logger.warning', meaning: { en: 'records a warning for developers', pt: 'registra um aviso para desenvolvedores' } },
    ],
    buildHints: [
      { en: 'Finish classify_priority first. It has one simple rule.', pt: 'Termine classify_priority primeiro. Ela possui uma regra simples.' },
      { en: 'Then make parse_claim either return a valid Claim or raise ValueError.', pt: 'Depois faça parse_claim retornar um Claim válido ou levantar ValueError.' },
      { en: 'process_line catches the error, checks duplicates, saves and prints.', pt: 'process_line captura o erro, confere duplicados, salva e mostra.' },
      { en: 'main should only control the loop.', pt: 'main deve apenas controlar o loop.' },
    ],
    sample: {
      title: { en: 'Two records', pt: 'Dois registros' },
      inputs: [{ en: 'C-101|1200|3', pt: 'C-101|1200|3' }, { en: 'C-102|15000|5', pt: 'C-102|15000|5' }, { en: 'END', pt: 'END' }],
      happens: [{ en: 'C-101 is STANDARD. C-102 is ESCALATE because 15000 is at least 10000.', pt: 'C-101 é STANDARD. C-102 é ESCALATE porque 15000 é pelo menos 10000.' }],
      outputs: [{ en: 'CLAIM=C-101|STANDARD|1200.00', pt: 'CLAIM=C-101|STANDARD|1200.00' }, { en: 'CLAIM=C-102|ESCALATE|15000.00', pt: 'CLAIM=C-102|ESCALATE|15000.00' }, { en: 'SUMMARY=2|16200.00|1', pt: 'SUMMARY=2|16200.00|1' }],
    },
    testPurposes: {
      'triage-standard': { en: 'Checks one normal and one escalated record.', pt: 'Confere um registro normal e um escalado.' },
      'triage-validation': { en: 'Checks a repeated ID and an invalid number.', pt: 'Confere ID repetido e número inválido.' },
      'triage-empty': { en: 'Checks the summary when nothing is accepted.', pt: 'Confere o resumo quando nada é aceito.' },
    },
    improveIntro: { en: 'Make one function easier to trust. Keep the public output exactly the same.', pt: 'Deixe uma função mais fácil de confiar. Mantenha a saída pública exatamente igual.' },
    improveChoices: [
      { title: { en: 'Clarify validation', pt: 'Deixar a validação clara' }, change: { en: 'Use small named checks inside parse_claim.', pt: 'Use pequenas verificações com nomes dentro de parse_claim.' }, example: { en: 'if not claim_id: raise ValueError("missing id")', pt: 'if not claim_id: raise ValueError("missing id")' }, why: { en: 'Each rejected rule is visible.', pt: 'Cada regra de rejeição fica visível.' } },
      { title: { en: 'Clarify the priority rule', pt: 'Deixar a prioridade clara' }, change: { en: 'Name the two reasons for escalation.', pt: 'Dê nomes aos dois motivos de escalada.' }, example: { en: 'high_severity = severity >= 8', pt: 'high_severity = severity >= 8' }, why: { en: 'The business rule reads like a sentence.', pt: 'A regra de negócio fica parecida com uma frase.' } },
      { title: { en: 'Shorten orchestration', pt: 'Encurtar a orquestração' }, change: { en: 'Keep main limited to reading, stopping and calling process_line.', pt: 'Mantenha main limitada a ler, parar e chamar process_line.' }, example: { en: 'process_line(line, claims)', pt: 'process_line(line, claims)' }, why: { en: 'Business logic stays testable.', pt: 'A lógica de negócio continua testável.' } },
    ],
    improveNoteExample: { en: 'I named the two escalation conditions so a reviewer can see why a record changes priority.', pt: 'Eu dei nome às duas condições de escalada para que uma pessoa veja por que o registro muda de prioridade.' },
    doNotChange: { en: 'Do not change the priority numbers or the CLAIM, DUPLICATE, INVALID and SUMMARY formats.', pt: 'Não altere os números da prioridade nem os formatos CLAIM, DUPLICATE, INVALID e SUMMARY.' },
  },

  'engineering-order-service': {
    mission: { en: 'Build the inner part of an order service that checks, calculates and stores orders.', pt: 'Construa a parte interna de um serviço que confere, calcula e guarda pedidos.' },
    story: { en: 'Imagine a factory line. A raw order enters, one station checks it, another calculates money and another stores the approved result.', pt: 'Imagine uma linha de fábrica. Um pedido bruto entra, uma estação confere, outra calcula o dinheiro e outra guarda o resultado aprovado.' },
    result: { en: 'Every accepted order prints subtotal, tax and total. Bad or repeated orders print a clear failure. The batch ends with a summary.', pt: 'Cada pedido aceito mostra subtotal, imposto e total. Pedidos ruins ou repetidos mostram uma falha clara. O lote termina com um resumo.' },
    exactTasks: [
      { en: 'Represent a checked order with an immutable dataclass.', pt: 'Represente um pedido conferido com uma dataclass imutável.' },
      { en: 'Create a repository interface and an in-memory repository.', pt: 'Crie uma interface de repositório e um repositório em memória.' },
      { en: 'Parse and validate id|quantity|unit_price|tax_rate.', pt: 'Interprete e valide id|quantidade|preço_unitário|taxa.' },
      { en: 'Calculate subtotal, tax and total in a pure function.', pt: 'Calcule subtotal, imposto e total em uma função pura.' },
      { en: 'Reject repeated IDs.', pt: 'Rejeite IDs repetidos.' },
      { en: 'Store only accepted summaries and print the final total.', pt: 'Guarde apenas resumos aceitos e mostre o total final.' },
    ],
    inputItems: [
      { label: { en: 'Order line', pt: 'Linha do pedido' }, meaning: { en: 'id|quantity|unit_price|tax_rate', pt: 'id|quantidade|preço_unitário|taxa' }, example: { en: 'O-101|2|10|0.13', pt: 'O-101|2|10|0.13' } },
      { label: { en: 'END', pt: 'END' }, meaning: { en: 'Finishes the batch.', pt: 'Encerra o lote.' }, example: { en: 'END', pt: 'END' } },
    ],
    outputItems: [
      { label: { en: 'ORDER', pt: 'ORDER' }, meaning: { en: 'id, subtotal, tax and total.', pt: 'id, subtotal, imposto e total.' }, example: { en: 'ORDER=O-101|20.00|2.60|22.60', pt: 'ORDER=O-101|20.00|2.60|22.60' } },
      { label: { en: 'SUMMARY', pt: 'SUMMARY' }, meaning: { en: 'accepted count and grand total.', pt: 'quantidade aceita e total geral.' }, example: { en: 'SUMMARY=1|22.60', pt: 'SUMMARY=1|22.60' } },
    ],
    understandAnswers: {
      inputs: { en: 'One order line with ID, quantity, price and tax rate, ending with END.', pt: 'Uma linha com ID, quantidade, preço e taxa, terminando com END.' },
      output: { en: 'ORDER, INVALID, DUPLICATE, SUMMARY and BYE lines.', pt: 'Linhas ORDER, INVALID, DUPLICATE, SUMMARY e BYE.' },
      rules: { en: 'Validate, calculate money, reject duplicates and store only accepted orders.', pt: 'Validar, calcular dinheiro, rejeitar duplicados e guardar somente pedidos aceitos.' },
      edgeCase: { en: 'Empty, malformed, negative and duplicate orders must be handled.', pt: 'Pedidos vazios, malformados, negativos e duplicados precisam ser tratados.' },
    },
    planSteps: [
      { en: 'DEFINE the Order data form.', pt: 'DEFINIR a ficha Order.' },
      { en: 'BUILD the in-memory repository methods.', pt: 'MONTAR os métodos do repositório em memória.' },
      { en: 'PARSE and validate one line.', pt: 'INTERPRETAR e validar uma linha.' },
      { en: 'CALCULATE subtotal, tax and total.', pt: 'CALCULAR subtotal, imposto e total.' },
      { en: 'PROCESS duplicate, invalid or accepted results.', pt: 'PROCESSAR resultados duplicados, inválidos ou aceitos.' },
      { en: 'READ until END and PRINT the summary and BYE.', pt: 'LER até END e MOSTRAR o resumo e BYE.' },
    ],
    codeWords: [
      { code: 'OrderRepository', meaning: { en: 'a promise describing what storage must do', pt: 'uma promessa que descreve o que o armazenamento deve fazer' } },
      { code: 'InMemoryOrderRepository', meaning: { en: 'a simple dictionary-based storage', pt: 'um armazenamento simples baseado em dicionário' } },
      { code: 'parse_order', meaning: { en: 'turns text into a checked Order', pt: 'transforma texto em Order validado' } },
      { code: 'calculate_totals', meaning: { en: 'does only the money math', pt: 'faz somente a matemática do dinheiro' } },
      { code: 'process_line', meaning: { en: 'connects validation, storage and output', pt: 'liga validação, armazenamento e saída' } },
    ],
    buildHints: [
      { en: 'Complete the repository first: exists, save and values.', pt: 'Complete o repositório primeiro: exists, save e values.' },
      { en: 'Then finish parse_order and calculate_totals separately.', pt: 'Depois termine parse_order e calculate_totals separadamente.' },
      { en: 'process_line should use the other pieces instead of repeating their work.', pt: 'process_line deve usar as outras partes em vez de repetir o trabalho delas.' },
      { en: 'Log only the order ID or failure type, never the full raw line.', pt: 'Registre apenas o ID ou tipo de falha, nunca a linha bruta completa.' },
    ],
    sample: {
      title: { en: 'One accepted order', pt: 'Um pedido aceito' },
      inputs: [{ en: 'O-101|2|10|0.13', pt: 'O-101|2|10|0.13' }, { en: 'END', pt: 'END' }],
      happens: [{ en: 'Subtotal is 2 × 10 = 20. Tax is 20 × 0.13 = 2.60. Total is 22.60.', pt: 'Subtotal é 2 × 10 = 20. Imposto é 20 × 0.13 = 2.60. Total é 22.60.' }],
      outputs: [{ en: 'ORDER=O-101|20.00|2.60|22.60', pt: 'ORDER=O-101|20.00|2.60|22.60' }, { en: 'SUMMARY=1|22.60', pt: 'SUMMARY=1|22.60' }, { en: 'BYE', pt: 'BYE' }],
    },
    testPurposes: {
      'orders-standard': { en: 'Checks two valid orders and money calculations.', pt: 'Confere dois pedidos válidos e os cálculos de dinheiro.' },
      'orders-validation': { en: 'Checks duplicate, negative and malformed orders.', pt: 'Confere pedidos duplicados, negativos e malformados.' },
      'orders-empty': { en: 'Checks an empty batch.', pt: 'Confere um lote vazio.' },
    },
    improveIntro: { en: 'Improve one border between parts. The same inputs must still produce the same public outputs.', pt: 'Melhore uma fronteira entre as partes. As mesmas entradas ainda devem produzir as mesmas saídas públicas.' },
    improveChoices: [
      { title: { en: 'Clarify the repository', pt: 'Deixar o repositório claro' }, change: { en: 'Make save copy the summary and values return safe copies.', pt: 'Faça save copiar o resumo e values retornar cópias seguras.' }, example: { en: 'self._orders[order_id] = dict(summary)', pt: 'self._orders[order_id] = dict(summary)' }, why: { en: 'Outside code cannot secretly change stored data.', pt: 'Código externo não consegue mudar os dados guardados sem querer.' } },
      { title: { en: 'Clarify calculation names', pt: 'Deixar os cálculos claros' }, change: { en: 'Name subtotal and tax before building the result dictionary.', pt: 'Dê nomes a subtotal e tax antes de montar o dicionário.' }, example: { en: 'subtotal = order.quantity * order.unit_price', pt: 'subtotal = order.quantity * order.unit_price' }, why: { en: 'Each formula can be checked alone.', pt: 'Cada fórmula pode ser conferida sozinha.' } },
      { title: { en: 'Clarify validation failures', pt: 'Deixar falhas de validação claras' }, change: { en: 'Use one short validation block for each invalid rule.', pt: 'Use um bloco curto para cada regra inválida.' }, example: { en: 'if quantity <= 0: raise ValueError("quantity")', pt: 'if quantity <= 0: raise ValueError("quantity")' }, why: { en: 'A reviewer sees exactly why the order is rejected.', pt: 'Uma pessoa vê exatamente por que o pedido é rejeitado.' } },
    ],
    improveNoteExample: { en: 'I made the repository store copies so later changes outside the repository cannot alter saved totals.', pt: 'Eu fiz o repositório guardar cópias para que mudanças externas não alterem os totais salvos.' },
    doNotChange: { en: 'Do not change the formulas or ORDER, INVALID, DUPLICATE, SUMMARY and BYE formats.', pt: 'Não altere as fórmulas nem os formatos ORDER, INVALID, DUPLICATE, SUMMARY e BYE.' },
  },

  'data-ml-risk-pipeline': {
    mission: { en: 'Teach a tiny model with training examples, test it with separate examples and report honest scores.', pt: 'Ensine um pequeno modelo com exemplos de treino, teste com exemplos separados e mostre notas honestas.' },
    story: { en: 'Imagine two groups of dots on graph paper. The program finds the middle of each group. A new dot receives the label of the closest middle.', pt: 'Imagine dois grupos de pontos em papel quadriculado. O programa encontra o centro de cada grupo. Um ponto novo recebe o rótulo do centro mais próximo.' },
    result: { en: 'Print one prediction for each TEST row and then accuracy, precision and recall.', pt: 'Mostre uma previsão para cada linha TEST e depois acurácia, precisão e recall.' },
    exactTasks: [
      { en: 'Parse TRAIN and TEST rows into a checked dataclass.', pt: 'Interprete linhas TRAIN e TEST em uma dataclass validada.' },
      { en: 'Use only TRAIN rows to learn min and max values.', pt: 'Use somente linhas TRAIN para aprender mínimos e máximos.' },
      { en: 'Normalize amount and days_open.', pt: 'Normalize amount e days_open.' },
      { en: 'Find one center for label 0 and one for label 1.', pt: 'Encontre um centro para rótulo 0 e outro para rótulo 1.' },
      { en: 'Predict TEST rows by the closest center.', pt: 'Classifique linhas TEST pelo centro mais próximo.' },
      { en: 'Calculate honest metrics using TEST answers only.', pt: 'Calcule métricas honestas usando apenas as respostas TEST.' },
    ],
    inputItems: [
      { label: { en: 'TRAIN row', pt: 'Linha TRAIN' }, meaning: { en: 'An example the model is allowed to learn from.', pt: 'Um exemplo que o modelo pode usar para aprender.' }, example: { en: 'TRAIN|T1|1000|5|0', pt: 'TRAIN|T1|1000|5|0' } },
      { label: { en: 'TEST row', pt: 'Linha TEST' }, meaning: { en: 'A separate example used only to check the model.', pt: 'Um exemplo separado usado apenas para conferir o modelo.' }, example: { en: 'TEST|E1|1500|7|0', pt: 'TEST|E1|1500|7|0' } },
    ],
    outputItems: [
      { label: { en: 'PRED', pt: 'PRED' }, meaning: { en: 'ID, predicted label and true label.', pt: 'ID, rótulo previsto e rótulo real.' }, example: { en: 'PRED=E1|0|0', pt: 'PRED=E1|0|0' } },
      { label: { en: 'METRICS', pt: 'METRICS' }, meaning: { en: 'Correct count, total, accuracy, precision and recall.', pt: 'Acertos, total, acurácia, precisão e recall.' }, example: { en: 'METRICS=2|2|1.00|1.00|1.00', pt: 'METRICS=2|2|1.00|1.00|1.00' } },
    ],
    understandAnswers: {
      inputs: { en: 'TRAIN and TEST rows with ID, amount, days open and label.', pt: 'Linhas TRAIN e TEST com ID, valor, dias abertos e rótulo.' },
      output: { en: 'PRED lines and one final METRICS line.', pt: 'Linhas PRED e uma linha final METRICS.' },
      rules: { en: 'Learn scaling and centers only from TRAIN. Evaluate only with TEST.', pt: 'Aprender escala e centros apenas com TRAIN. Avaliar apenas com TEST.' },
      edgeCase: { en: 'Handle empty TEST data and training without both labels.', pt: 'Tratar TEST vazio e treino sem os dois rótulos.' },
    },
    planSteps: [
      { en: 'PARSE rows into train_rows and test_rows.', pt: 'INTERPRETAR linhas em train_rows e test_rows.' },
      { en: 'FIT the scaler using train_rows only.', pt: 'AJUSTAR o scaler usando somente train_rows.' },
      { en: 'TRANSFORM rows into comparable points.', pt: 'TRANSFORMAR linhas em pontos comparáveis.' },
      { en: 'FIT one centroid for each label.', pt: 'AJUSTAR um centroide para cada rótulo.' },
      { en: 'PREDICT every test row by distance.', pt: 'PREVER cada linha de teste pela distância.' },
      { en: 'COUNT results and PRINT metrics.', pt: 'CONTAR resultados e MOSTRAR métricas.' },
    ],
    codeWords: [
      { code: 'scaler', meaning: { en: 'numbers that put features on a similar scale', pt: 'números que colocam atributos em escala parecida' } },
      { code: 'centroid', meaning: { en: 'the average point of one label group', pt: 'o ponto médio de um grupo de rótulo' } },
      { code: 'predict', meaning: { en: 'chooses the closest centroid', pt: 'escolhe o centroide mais próximo' } },
      { code: 'evaluate', meaning: { en: 'compares predictions with true TEST labels', pt: 'compara previsões com rótulos TEST verdadeiros' } },
      { code: 'leakage', meaning: { en: 'accidentally learning from the answers used for testing', pt: 'aprender sem querer com as respostas usadas no teste' } },
    ],
    buildHints: [
      { en: 'Complete parse_record before any model math.', pt: 'Complete parse_record antes da matemática do modelo.' },
      { en: 'fit_scaler must never read test_rows.', pt: 'fit_scaler nunca deve ler test_rows.' },
      { en: 'When max equals min, use span 1.0 to avoid division by zero.', pt: 'Quando máximo for igual ao mínimo, use span 1.0 para evitar divisão por zero.' },
      { en: 'Build and test transform before centroids and prediction.', pt: 'Monte e teste transform antes de centroides e previsão.' },
      { en: 'For equal distances, return label 0.', pt: 'Para distâncias iguais, retorne rótulo 0.' },
    ],
    sample: {
      title: { en: 'Tiny learning picture', pt: 'Pequena imagem de aprendizado' },
      inputs: [{ en: 'Low-value, few-day TRAIN rows have label 0.', pt: 'Linhas TRAIN de valor baixo e poucos dias têm rótulo 0.' }, { en: 'High-value, many-day TRAIN rows have label 1.', pt: 'Linhas TRAIN de valor alto e muitos dias têm rótulo 1.' }, { en: 'A TEST row near the low group should become 0.', pt: 'Uma linha TEST perto do grupo baixo deve virar 0.' }],
      happens: [{ en: 'The program compares the TEST point with both group centers.', pt: 'O programa compara o ponto TEST com os dois centros dos grupos.' }],
      outputs: [{ en: 'PRED=E1|0|0', pt: 'PRED=E1|0|0' }, { en: 'METRICS shows how well the predictions matched.', pt: 'METRICS mostra o quanto as previsões combinaram.' }],
    },
    testPurposes: {
      'risk-perfect-separation': { en: 'Checks a simple case where both predictions are correct.', pt: 'Confere um caso simples em que as duas previsões estão corretas.' },
      'risk-false-positive': { en: 'Checks whether the metrics change after one wrong positive prediction.', pt: 'Confere se as métricas mudam depois de uma previsão positiva errada.' },
      'risk-invalid-empty-evaluation': { en: 'Checks an invalid row and no valid TEST rows.', pt: 'Confere uma linha inválida e nenhuma linha TEST válida.' },
      'risk-missing-class': { en: 'Checks that training needs examples from both labels.', pt: 'Confere se o treino precisa de exemplos dos dois rótulos.' },
    },
    improveIntro: { en: 'Make one model step easier to inspect. Do not hide the math inside a library.', pt: 'Deixe uma etapa do modelo mais fácil de conferir. Não esconda a matemática dentro de uma biblioteca.' },
    improveChoices: [
      { title: { en: 'Name the distance calculation', pt: 'Dar nome ao cálculo de distância' }, change: { en: 'Create a small distance function used by predict.', pt: 'Crie uma pequena função de distância usada por predict.' }, example: { en: 'def distance(a, b): return math.dist(a, b)', pt: 'def distance(a, b): return math.dist(a, b)' }, why: { en: 'Prediction becomes easier to read and test.', pt: 'A previsão fica mais fácil de ler e testar.' } },
      { title: { en: 'Clarify metric counters', pt: 'Deixar os contadores de métricas claros' }, change: { en: 'Use names such as true_positive and false_positive.', pt: 'Use nomes como true_positive e false_positive.' }, example: { en: 'true_positive += 1', pt: 'true_positive += 1' }, why: { en: 'The formulas explain themselves.', pt: 'As fórmulas se explicam melhor.' } },
      { title: { en: 'Protect training-only learning', pt: 'Proteger o aprendizado apenas com treino' }, change: { en: 'Add a short comment or helper that makes the TRAIN-only boundary obvious.', pt: 'Adicione um comentário curto ou helper que deixe a fronteira TRAIN evidente.' }, example: { en: '# Fit only on training data to prevent leakage', pt: '# Ajustar apenas no treino para evitar vazamento' }, why: { en: 'A reviewer can see that TEST answers are not used for learning.', pt: 'Uma pessoa vê que as respostas TEST não são usadas para aprender.' } },
    ],
    improveNoteExample: { en: 'I extracted distance() so the prediction rule can be tested separately and remains visible.', pt: 'Eu extraí distance() para testar a regra de previsão separadamente e manter a matemática visível.' },
    doNotChange: { en: 'Do not use TEST rows to fit the scaler or centroids, and do not change the output format.', pt: 'Não use linhas TEST para ajustar scaler ou centroides e não altere o formato da saída.' },
  },

  'transformer-attention-inspector': {
    mission: { en: 'Show which words receive the most attention when a query is compared with documents.', pt: 'Mostre quais palavras recebem mais atenção quando uma consulta é comparada com documentos.' },
    story: { en: 'Imagine a flashlight pointing at words. Words that match the query receive more light. The program must show the brightest word and the best document.', pt: 'Imagine uma lanterna apontando para palavras. Palavras parecidas com a consulta recebem mais luz. O programa deve mostrar a palavra mais iluminada e o melhor documento.' },
    result: { en: 'For each valid document, print its top token, attention weight and relevance. Then print the best document.', pt: 'Para cada documento válido, mostre o principal token, peso de atenção e relevância. Depois mostre o melhor documento.' },
    exactTasks: [
      { en: 'Read small two-number embeddings for tokens.', pt: 'Leia pequenos embeddings de dois números para tokens.' },
      { en: 'Read one query token and document token lists.', pt: 'Leia um token de consulta e listas de tokens dos documentos.' },
      { en: 'Calculate a dot-product score for each known token.', pt: 'Calcule um produto escalar para cada token conhecido.' },
      { en: 'Turn scores into stable softmax weights.', pt: 'Transforme pontuações em pesos softmax estáveis.' },
      { en: 'Build a weighted context vector and calculate relevance.', pt: 'Monte um vetor de contexto ponderado e calcule relevância.' },
      { en: 'Print each document result and the best document.', pt: 'Mostre o resultado de cada documento e o melhor documento.' },
    ],
    inputItems: [
      { label: { en: 'EMBED', pt: 'EMBED' }, meaning: { en: 'A token and its two-number position.', pt: 'Um token e sua posição com dois números.' }, example: { en: 'EMBED|python|1|0', pt: 'EMBED|python|1|0' } },
      { label: { en: 'QUERY', pt: 'QUERY' }, meaning: { en: 'The token we are looking for.', pt: 'O token que estamos procurando.' }, example: { en: 'QUERY|python', pt: 'QUERY|python' } },
      { label: { en: 'DOC', pt: 'DOC' }, meaning: { en: 'A document ID and its tokens.', pt: 'Um ID de documento e seus tokens.' }, example: { en: 'DOC|D1|python code', pt: 'DOC|D1|python code' } },
    ],
    outputItems: [
      { label: { en: 'ATTN', pt: 'ATTN' }, meaning: { en: 'Document, top token, weight and relevance.', pt: 'Documento, token principal, peso e relevância.' }, example: { en: 'ATTN=D1|python|0.73|0.81', pt: 'ATTN=D1|python|0.73|0.81' } },
      { label: { en: 'BEST', pt: 'BEST' }, meaning: { en: 'The most relevant document ID.', pt: 'O ID do documento mais relevante.' }, example: { en: 'BEST=D1', pt: 'BEST=D1' } },
    ],
    understandAnswers: {
      inputs: { en: 'Token embeddings, one query token and document token lists.', pt: 'Embeddings de tokens, um token de consulta e listas de tokens de documentos.' },
      output: { en: 'ATTN lines for valid documents and one BEST line.', pt: 'Linhas ATTN para documentos válidos e uma linha BEST.' },
      rules: { en: 'Score tokens, apply stable softmax, build context and rank relevance.', pt: 'Pontuar tokens, aplicar softmax estável, montar contexto e ordenar relevância.' },
      edgeCase: { en: 'Unknown query tokens and documents with no known tokens must be handled honestly.', pt: 'Consultas desconhecidas e documentos sem tokens conhecidos devem ser tratados com honestidade.' },
    },
    planSteps: [
      { en: 'STORE token embeddings.', pt: 'GUARDAR embeddings dos tokens.' },
      { en: 'READ the query and documents.', pt: 'LER a consulta e os documentos.' },
      { en: 'SCORE known document tokens against the query.', pt: 'PONTUAR tokens conhecidos contra a consulta.' },
      { en: 'CONVERT scores into softmax weights.', pt: 'CONVERTER pontuações em pesos softmax.' },
      { en: 'BUILD the weighted context and relevance.', pt: 'MONTAR o contexto ponderado e a relevância.' },
      { en: 'SHOW ATTN for each document and BEST at the end.', pt: 'MOSTRAR ATTN para cada documento e BEST no final.' },
    ],
    codeWords: [
      { code: 'embedding', meaning: { en: 'a small list of numbers representing a token', pt: 'uma pequena lista de números representando um token' } },
      { code: 'dot product', meaning: { en: 'a multiplication-and-sum that measures alignment', pt: 'uma multiplicação e soma que mede alinhamento' } },
      { code: 'softmax', meaning: { en: 'turns scores into weights that add to 1', pt: 'transforma pontuações em pesos que somam 1' } },
      { code: 'context', meaning: { en: 'the weighted mixture of document token vectors', pt: 'a mistura ponderada dos vetores dos tokens do documento' } },
      { code: 'relevance', meaning: { en: 'how well the context matches the query', pt: 'o quanto o contexto combina com a consulta' } },
    ],
    buildHints: [
      { en: 'Test dot product before softmax.', pt: 'Teste o produto escalar antes do softmax.' },
      { en: 'For stable softmax, subtract the largest score before math.exp.', pt: 'Para softmax estável, subtraia a maior pontuação antes de math.exp.' },
      { en: 'Ignore unknown document tokens, but reject a document if none are known.', pt: 'Ignore tokens desconhecidos do documento, mas rejeite o documento se nenhum for conhecido.' },
      { en: 'Stop with MODEL_ERROR when the query itself has no embedding.', pt: 'Pare com MODEL_ERROR quando a própria consulta não tiver embedding.' },
    ],
    sample: {
      title: { en: 'Flashlight example', pt: 'Exemplo da lanterna' },
      inputs: [{ en: 'Query token points toward python.', pt: 'O token de consulta aponta para python.' }, { en: 'D1 contains python and code. D2 contains food.', pt: 'D1 contém python e code. D2 contém food.' }],
      happens: [{ en: 'python receives the strongest score in D1.', pt: 'python recebe a maior pontuação em D1.' }, { en: 'D1 receives greater relevance than D2.', pt: 'D1 recebe relevância maior que D2.' }],
      outputs: [{ en: 'ATTN for each valid document.', pt: 'ATTN para cada documento válido.' }, { en: 'BEST=D1', pt: 'BEST=D1' }],
    },
    testPurposes: {
      'attention-ranking': { en: 'Checks that attention ranks the relevant document first.', pt: 'Confere se a atenção coloca o documento relevante em primeiro.' },
      'attention-unknown-document-token': { en: 'Checks unknown words inside a document.', pt: 'Confere palavras desconhecidas dentro de um documento.' },
      'attention-unknown-query': { en: 'Checks honest failure when the query is unknown.', pt: 'Confere falha honesta quando a consulta é desconhecida.' },
    },
    improveIntro: { en: 'Make one math step easier to inspect. Keep every number and ranking rule the same.', pt: 'Deixe uma etapa matemática mais fácil de conferir. Mantenha os números e regras de ranking.' },
    improveChoices: [
      { title: { en: 'Name the stable softmax steps', pt: 'Dar nome às etapas do softmax estável' }, change: { en: 'Use variables max_score, shifted_scores and denominator.', pt: 'Use variáveis max_score, shifted_scores e denominator.' }, example: { en: 'shifted_scores = [score - max_score for score in scores]', pt: 'shifted_scores = [score - max_score for score in scores]' }, why: { en: 'The safety trick becomes visible.', pt: 'O truque de segurança fica visível.' } },
      { title: { en: 'Separate token filtering', pt: 'Separar o filtro de tokens' }, change: { en: 'Create a helper that returns only known document tokens.', pt: 'Crie uma função que retorne apenas tokens conhecidos.' }, example: { en: 'known_tokens = get_known_tokens(tokens, embeddings)', pt: 'known_tokens = get_known_tokens(tokens, embeddings)' }, why: { en: 'Unknown-token behavior is easy to test.', pt: 'O comportamento de tokens desconhecidos fica fácil de testar.' } },
      { title: { en: 'Separate document ranking', pt: 'Separar o ranking de documentos' }, change: { en: 'Create a function that chooses the best result with the tie rule.', pt: 'Crie uma função que escolha o melhor resultado com a regra de empate.' }, example: { en: 'best = choose_best(results)', pt: 'best = choose_best(results)' }, why: { en: 'The tie rule is no longer hidden inside printing code.', pt: 'A regra de empate deixa de ficar escondida no código de impressão.' } },
    ],
    improveNoteExample: { en: 'I named the softmax steps so a reviewer can see where the largest score is removed before exp.', pt: 'Eu dei nome às etapas do softmax para mostrar onde a maior pontuação é removida antes de exp.' },
    doNotChange: { en: 'Do not replace the attention math with a library call and do not change tie behavior.', pt: 'Não troque a matemática da atenção por uma biblioteca e não altere os empates.' },
  },

  'local-rag-copilot': {
    mission: { en: 'Build a private document helper that finds evidence and refuses to guess.', pt: 'Construa um ajudante privado de documentos que encontra evidências e se recusa a inventar.' },
    story: { en: 'Imagine a careful librarian. It searches only the approved books on its desk. It answers with a sentence it found and shows which page helped. If nothing helps, it says it does not know.', pt: 'Imagine uma bibliotecária cuidadosa. Ela pesquisa somente os livros aprovados sobre a mesa. Responde com uma frase encontrada e mostra qual página ajudou. Se nada ajudar, diz que não sabe.' },
    result: { en: 'Print retrieved evidence, one grounded answer and citations. If evidence is missing, print a clear abstention.', pt: 'Mostre evidências encontradas, uma resposta fundamentada e citações. Se faltar evidência, mostre uma abstenção clara.' },
    exactTasks: [
      { en: 'Store local token embeddings.', pt: 'Guarde embeddings locais dos tokens.' },
      { en: 'Store document chunks with source, ID and text.', pt: 'Guarde trechos com fonte, ID e texto.' },
      { en: 'Tokenize query and chunks the same way.', pt: 'Separe tokens da consulta e dos trechos do mesmo jeito.' },
      { en: 'Build average vectors from known tokens only.', pt: 'Monte vetores médios apenas com tokens conhecidos.' },
      { en: 'Calculate cosine similarity and keep at most two chunks above 0.45.', pt: 'Calcule similaridade de cosseno e mantenha no máximo dois trechos acima de 0.45.' },
      { en: 'Answer with a sentence from the best chunk and cite all retrieved chunks.', pt: 'Responda com uma frase do melhor trecho e cite todos os trechos encontrados.' },
      { en: 'Abstain when the query is unknown or evidence is weak.', pt: 'Abstenha-se quando a consulta for desconhecida ou a evidência for fraca.' },
    ],
    inputItems: [
      { label: { en: 'EMBED', pt: 'EMBED' }, meaning: { en: 'A local token vector.', pt: 'Um vetor local de token.' }, example: { en: 'EMBED|python|1|0', pt: 'EMBED|python|1|0' } },
      { label: { en: 'CHUNK', pt: 'CHUNK' }, meaning: { en: 'source|id|document text', pt: 'fonte|id|texto do documento' }, example: { en: 'CHUNK|guide|1|Python uses indentation.', pt: 'CHUNK|guia|1|Python usa indentação.' } },
      { label: { en: 'QUERY', pt: 'QUERY' }, meaning: { en: 'The question text.', pt: 'O texto da pergunta.' }, example: { en: 'QUERY|python indentation', pt: 'QUERY|python indentação' } },
    ],
    outputItems: [
      { label: { en: 'RETRIEVED', pt: 'RETRIEVED' }, meaning: { en: 'Evidence source, ID and score.', pt: 'Fonte da evidência, ID e pontuação.' }, example: { en: 'RETRIEVED=guide#1|0.92', pt: 'RETRIEVED=guia#1|0.92' } },
      { label: { en: 'ANSWER', pt: 'ANSWER' }, meaning: { en: 'A sentence copied from the best evidence.', pt: 'Uma frase retirada da melhor evidência.' }, example: { en: 'ANSWER=Python uses indentation.', pt: 'ANSWER=Python usa indentação.' } },
      { label: { en: 'CITATIONS', pt: 'CITATIONS' }, meaning: { en: 'Every chunk used by the answer.', pt: 'Todos os trechos usados pela resposta.' }, example: { en: 'CITATIONS=guide#1', pt: 'CITATIONS=guia#1' } },
    ],
    understandAnswers: {
      inputs: { en: 'Local token vectors, document chunks, one query and END.', pt: 'Vetores locais, trechos de documentos, uma consulta e END.' },
      output: { en: 'RETRIEVED, ANSWER and CITATIONS, or an ABSTAIN reason.', pt: 'RETRIEVED, ANSWER e CITATIONS, ou um motivo ABSTAIN.' },
      rules: { en: 'Rank local evidence, answer only from evidence and never invent text.', pt: 'Ordenar evidências locais, responder apenas com evidência e nunca inventar texto.' },
      edgeCase: { en: 'Unknown query words or weak evidence must produce ABSTAIN.', pt: 'Palavras desconhecidas ou evidência fraca devem produzir ABSTAIN.' },
    },
    planSteps: [
      { en: 'READ and validate embeddings, chunks and one query.', pt: 'LER e validar embeddings, trechos e uma consulta.' },
      { en: 'TOKENIZE query and chunk text consistently.', pt: 'SEPARAR tokens da consulta e dos trechos da mesma forma.' },
      { en: 'BUILD average vectors from known tokens.', pt: 'MONTAR vetores médios com tokens conhecidos.' },
      { en: 'SCORE chunks with cosine similarity.', pt: 'PONTUAR trechos com similaridade de cosseno.' },
      { en: 'KEEP at most two chunks with score at least 0.45.', pt: 'MANTER no máximo dois trechos com pontuação de pelo menos 0.45.' },
      { en: 'ANSWER from the best chunk and PRINT citations.', pt: 'RESPONDER a partir do melhor trecho e MOSTRAR citações.' },
      { en: 'ABSTAIN when evidence is not strong enough.', pt: 'ABSTER-SE quando a evidência não for forte o bastante.' },
    ],
    codeWords: [
      { code: 'chunk', meaning: { en: 'a small piece of one local document', pt: 'um pequeno pedaço de um documento local' } },
      { code: 'vector', meaning: { en: 'numbers used to compare meaning', pt: 'números usados para comparar significado' } },
      { code: 'cosine similarity', meaning: { en: 'a score showing how similarly two vectors point', pt: 'uma nota que mostra se dois vetores apontam de forma parecida' } },
      { code: 'retrieval', meaning: { en: 'finding the best evidence before answering', pt: 'encontrar a melhor evidência antes de responder' } },
      { code: 'abstain', meaning: { en: 'say “I do not have enough evidence” instead of guessing', pt: 'dizer “não tenho evidência suficiente” em vez de inventar' } },
    ],
    buildHints: [
      { en: 'Complete parsing and tokenization before vector math.', pt: 'Complete interpretação e tokenização antes da matemática de vetores.' },
      { en: 'Use the same tokenizer for query and chunks.', pt: 'Use o mesmo separador de tokens para consulta e trechos.' },
      { en: 'Protect cosine similarity when a vector length is zero.', pt: 'Proteja a similaridade de cosseno quando um vetor tiver tamanho zero.' },
      { en: 'Sort by score, then use the stated tie rule.', pt: 'Ordene pela pontuação e depois use a regra de empate informada.' },
      { en: 'The answer text must come from a retrieved chunk, not from a new sentence you invent.', pt: 'O texto da resposta precisa vir de um trecho encontrado, não de uma frase nova inventada.' },
    ],
    sample: {
      title: { en: 'Careful librarian example', pt: 'Exemplo da bibliotecária cuidadosa' },
      inputs: [{ en: 'A chunk says “Python uses indentation.”', pt: 'Um trecho diz “Python usa indentação.”' }, { en: 'The query asks about Python indentation.', pt: 'A consulta pergunta sobre indentação em Python.' }],
      happens: [{ en: 'The chunk receives a strong similarity score.', pt: 'O trecho recebe uma pontuação forte de similaridade.' }, { en: 'The answer copies the supported sentence and cites its source.', pt: 'A resposta usa a frase sustentada e cita sua fonte.' }],
      outputs: [{ en: 'RETRIEVED=...', pt: 'RETRIEVED=...' }, { en: 'ANSWER=Python uses indentation.', pt: 'ANSWER=Python usa indentação.' }, { en: 'CITATIONS=...', pt: 'CITATIONS=...' }],
    },
    testPurposes: {
      'rag-grounded-answer': { en: 'Checks one strong piece of evidence and one grounded answer.', pt: 'Confere uma evidência forte e uma resposta fundamentada.' },
      'rag-two-citations': { en: 'Checks that two useful chunks remain visible in citations.', pt: 'Confere se dois trechos úteis continuam visíveis nas citações.' },
      'rag-unknown-query': { en: 'Checks abstention when query words have no vectors.', pt: 'Confere abstenção quando as palavras da consulta não têm vetores.' },
      'rag-no-evidence': { en: 'Checks abstention when documents are unrelated.', pt: 'Confere abstenção quando os documentos não têm relação.' },
    },
    improveIntro: { en: 'Make one trust rule easier to inspect. The helper must still refuse unsupported answers.', pt: 'Deixe uma regra de confiança mais fácil de conferir. O ajudante ainda deve recusar respostas sem apoio.' },
    improveChoices: [
      { title: { en: 'Clarify the evidence threshold', pt: 'Deixar o limite de evidência claro' }, change: { en: 'Name 0.45 as MIN_EVIDENCE_SCORE.', pt: 'Dê ao valor 0.45 o nome MIN_EVIDENCE_SCORE.' }, example: { en: 'MIN_EVIDENCE_SCORE = 0.45', pt: 'MIN_EVIDENCE_SCORE = 0.45' }, why: { en: 'The trust rule is easy to find and review.', pt: 'A regra de confiança fica fácil de encontrar e revisar.' } },
      { title: { en: 'Separate abstention reasons', pt: 'Separar os motivos de abstenção' }, change: { en: 'Use a small function that chooses the correct ABSTAIN reason.', pt: 'Use uma pequena função que escolha o motivo ABSTAIN correto.' }, example: { en: 'def abstention_reason(...): ...', pt: 'def abstention_reason(...): ...' }, why: { en: 'Unknown words and weak evidence stay different.', pt: 'Palavras desconhecidas e evidência fraca continuam diferentes.' } },
      { title: { en: 'Separate citation formatting', pt: 'Separar a formatação das citações' }, change: { en: 'Create a helper that builds source#id labels.', pt: 'Crie uma função que monte rótulos fonte#id.' }, example: { en: 'def citation_id(chunk): return f"{chunk.source}#{chunk.chunk_id}"', pt: 'def citation_id(chunk): return f"{chunk.source}#{chunk.chunk_id}"' }, why: { en: 'All citations use one consistent rule.', pt: 'Todas as citações usam uma única regra.' } },
    ],
    improveNoteExample: { en: 'I named the minimum score so the evidence rule is visible and can be reviewed without searching through the code.', pt: 'Eu dei nome à pontuação mínima para que a regra de evidência fique visível e possa ser revisada sem procurar no código.' },
    doNotChange: { en: 'Do not lower the evidence threshold, invent answer text or remove citations.', pt: 'Não reduza o limite de evidência, não invente texto de resposta e não remova citações.' },
  },
}

export function getMiniProjectGuide(projectId: string) {
  return MINI_PROJECT_GUIDES[projectId]
}
