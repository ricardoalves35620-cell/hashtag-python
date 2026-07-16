import type { Bilingual } from './types'

export type ProjectCheckpointId = 'understand' | 'plan' | 'build' | 'test' | 'refactor'

export interface MiniProjectTest {
  id: string
  title: Bilingual
  inputs: string[]
  expectedOutput: string[]
}

export interface MiniProject {
  id: string
  milestonePhaseId: number
  icon: string
  title: Bilingual
  subtitle: Bilingual
  scenario: Bilingual
  professionalContext: Bilingual
  estimatedMinutes: number
  skills: Bilingual[]
  requirements: { en: string[]; pt: string[] }
  inputContract: Bilingual
  outputContract: Bilingual
  ruleContract: Bilingual
  edgeCases: Bilingual
  starterCode: Bilingual
  tests: MiniProjectTest[]
  requiredNodes?: string[]
  requiredImports?: string[]
  requiredFunctions?: string[]
  requiredCalls?: string[]
  requireMainGuard?: boolean
  refactorGoal: Bilingual
  refactorEvidence: Bilingual
  refactorOptions: Bilingual[]
  accomplishment: Bilingual[]
}

export const MINI_PROJECTS: MiniProject[] = [
  {
    id: 'damage-estimate',
    milestonePhaseId: 4,
    icon: '🎟️',
    title: { en: 'Event Budget Balance', pt: 'Saldo do Orçamento de Evento' },
    subtitle: { en: 'Turn raw input into a reliable calculation.', pt: 'Transforme entradas brutas em um cálculo confiável.' },
    scenario: {
      en: 'An event organizer enters the available budget and the expenses already committed. Build a small program that calculates and displays the remaining balance.',
      pt: 'Uma pessoa organizando um evento informa o orçamento disponível e as despesas já comprometidas. Construa um pequeno programa que calcule e mostre o saldo restante.',
    },
    professionalContext: {
      en: 'This is the smallest version of a business rule: receive data, transform it, and present a result that another person can verify.',
      pt: 'Esta é a menor versão de uma regra de negócio: receber dados, transformá-los e apresentar um resultado que outra pessoa consiga verificar.',
    },
    estimatedMinutes: 35,
    skills: [
      { en: 'meaningful variables', pt: 'variáveis significativas' },
      { en: 'numeric input conversion', pt: 'conversão de entrada numérica' },
      { en: 'business-rule calculation', pt: 'cálculo de regra de negócio' },
      { en: 'formatted output', pt: 'saída formatada' },
    ],
    requirements: {
      en: ['Ask for the event budget', 'Ask for committed expenses', 'Calculate budget minus expenses', 'Print Remaining with two decimal places'],
      pt: ['Peça o orçamento do evento', 'Peça as despesas comprometidas', 'Calcule orçamento menos despesas', 'Mostre Saldo com duas casas decimais'],
    },
    inputContract: { en: 'Two numbers: available budget and committed expenses.', pt: 'Dois números: orçamento disponível e despesas comprometidas.' },
    outputContract: { en: 'A line containing Remaining and the calculated balance.', pt: 'Uma linha contendo Saldo e o valor calculado.' },
    ruleContract: { en: 'remaining = budget - expenses', pt: 'saldo = orçamento - despesas' },
    edgeCases: { en: 'Use decimal values and verify that conversion happens before subtraction.', pt: 'Use valores decimais e confirme que a conversão acontece antes da subtração.' },
    starterCode: {
      en: `# Project: Event Budget Balance\n# Build each step from the contract above.\n\nbudget = float(input("Budget: "))\nexpenses = float(input("Committed expenses: "))\n\n# TODO: calculate the remaining balance\nremaining = 0\n\n# TODO: display the result with two decimal places\nprint(f"Remaining: {remaining:.2f}")`,
      pt: `# Projeto: Saldo do Orçamento de Evento\n# Construa cada passo usando o contrato acima.\n\nbudget = float(input("Orçamento: "))\nexpenses = float(input("Despesas comprometidas: "))\n\n# TODO: calcule o saldo restante\nremaining = 0\n\n# TODO: mostre o resultado com duas casas decimais\nprint(f"Saldo: {remaining:.2f}")`,
    },
    tests: [
      { id: 'estimate-standard', title: { en: 'Standard event budget', pt: 'Orçamento padrão de evento' }, inputs: ['5000', '500'], expectedOutput: ['4500.00'] },
      { id: 'estimate-decimal', title: { en: 'Decimal expenses', pt: 'Despesas decimais' }, inputs: ['2750.50', '200.25'], expectedOutput: ['2550.25'] },
      { id: 'estimate-equal-values', title: { en: 'Equal values boundary', pt: 'Limite com valores iguais' }, inputs: ['500', '500'], expectedOutput: ['0.00'] },
    ],
    refactorGoal: {
      en: 'Improve the calculation program without changing its verified results. Prefer clearer business names, visible input/calculation/output sections, or removal of a comment that only repeats the code.',
      pt: 'Melhore o programa de cálculo sem alterar os resultados já comprovados. Prefira nomes de negócio mais claros, seções visíveis de entrada/cálculo/saída ou remova um comentário que apenas repete o código.',
    },
    refactorEvidence: {
      en: 'Your final code must differ from the tested version, your note must explain the reason, and every budget scenario must still pass.',
      pt: 'O código final precisa ser diferente da versão testada, sua nota deve explicar o motivo e todos os cenários de orçamento precisam continuar aprovados.',
    },
    refactorOptions: [
      { en: 'Use names that explain the business meaning.', pt: 'Use nomes que expliquem o significado de negócio.' },
      { en: 'Keep input, calculation, and output in visible sections.', pt: 'Mantenha entrada, cálculo e saída em seções visíveis.' },
      { en: 'Remove comments that only repeat the code.', pt: 'Remova comentários que apenas repetem o código.' },
      { en: 'Format the result consistently.', pt: 'Formate o resultado de forma consistente.' },
    ],
    accomplishment: [
      { en: 'translate a written formula into Python', pt: 'traduzir uma fórmula escrita para Python' },
      { en: 'convert user input before calculating', pt: 'converter a entrada antes de calcular' },
      { en: 'verify a result with more than one test', pt: 'verificar um resultado com mais de um teste' },
    ],
  },
  {
    id: 'claim-queue',
    milestonePhaseId: 7,
    icon: '📦',
    title: { en: 'Shipment Queue Processor', pt: 'Processador de Fila de Remessas' },
    subtitle: { en: 'Control repetition with explicit state and a stopping condition.', pt: 'Controle repetição com estado explícito e condição de parada.' },
    scenario: {
      en: 'A distribution center receives a known number of shipment values. Process every shipment, then report how many were processed, the total declared value, and the average.',
      pt: 'Um centro de distribuição recebe uma quantidade conhecida de valores de remessas. Processe cada remessa e informe quantidade processada, valor total declarado e média.',
    },
    professionalContext: {
      en: 'Batch processing appears in imports, billing, claims, reports, queues, and background jobs. The loop must change state and must finish.',
      pt: 'Processamento em lote aparece em importações, cobranças, sinistros, relatórios, filas e tarefas em segundo plano. O loop precisa alterar o estado e terminar.',
    },
    estimatedMinutes: 55,
    skills: [
      { en: 'while-loop state', pt: 'estado de loop while' },
      { en: 'counter and accumulator', pt: 'contador e acumulador' },
      { en: 'stopping condition', pt: 'condição de parada' },
      { en: 'average calculation', pt: 'cálculo de média' },
    ],
    requirements: {
      en: ['Ask how many shipments will be processed', 'Use while', 'Read one shipment value per repetition', 'Update count and total', 'Print count, total, and average'],
      pt: ['Pergunte quantas remessas serão processadas', 'Use while', 'Leia um valor de remessa por repetição', 'Atualize quantidade e total', 'Mostre quantidade, total e média'],
    },
    inputContract: { en: 'First the number of shipments, followed by one declared value for each shipment.', pt: 'Primeiro a quantidade de remessas, seguida de um valor declarado para cada remessa.' },
    outputContract: { en: 'Processed, Total, and Average.', pt: 'Processados, Total e Média.' },
    ruleContract: { en: 'Repeat exactly the requested number of times and update the counter every time.', pt: 'Repita exatamente a quantidade solicitada e atualize o contador em toda repetição.' },
    edgeCases: { en: 'Avoid division by zero when the requested quantity is zero.', pt: 'Evite divisão por zero quando a quantidade solicitada for zero.' },
    starterCode: {
      en: `# Project: Shipment Queue Processor\nquantity = int(input("How many shipments? "))\nprocessed = 0\ntotal = 0.0\n\n# TODO: repeat until every shipment has been processed\nwhile False:\n    amount = float(input("Shipment value: "))\n    # TODO: update total and processed\n\n# TODO: protect the average when quantity is zero\naverage = 0.0\n\nprint("Processed:", processed)\nprint(f"Total: {total:.2f}")\nprint(f"Average: {average:.2f}")`,
      pt: `# Projeto: Processador de Fila de Remessas\nquantity = int(input("Quantas remessas? "))\nprocessed = 0\ntotal = 0.0\n\n# TODO: repita até processar todas as remessas\nwhile False:\n    amount = float(input("Valor da remessa: "))\n    # TODO: atualize total e processados\n\n# TODO: proteja a média quando a quantidade for zero\naverage = 0.0\n\nprint("Processados:", processed)\nprint(f"Total: {total:.2f}")\nprint(f"Média: {average:.2f}")`,
    },
    tests: [
      { id: 'queue-three', title: { en: 'Three shipments', pt: 'Três remessas' }, inputs: ['3', '1200', '800', '2000'], expectedOutput: ['3', '4000.00', '1333.33'] },
      { id: 'queue-single', title: { en: 'Single-item queue', pt: 'Fila com um item' }, inputs: ['1', '375.50'], expectedOutput: ['1', '375.50', '375.50'] },
      { id: 'queue-zero', title: { en: 'Empty queue', pt: 'Fila vazia' }, inputs: ['0'], expectedOutput: ['0', '0.00'] },
    ],
    requiredNodes: ['While'],
    refactorGoal: {
      en: 'Make the loop easier to trust. Improve the stopping condition, keep the counter and accumulator together, or make the empty-queue rule explicit.',
      pt: 'Torne o loop mais fácil de confiar. Melhore a condição de parada, mantenha contador e acumulador juntos ou deixe explícita a regra da fila vazia.',
    },
    refactorEvidence: {
      en: 'The revised code must visibly change, the explanation must name the loop risk reduced, and normal, single-item, and empty queues must all pass.',
      pt: 'O código revisado precisa mudar de forma visível, a explicação deve citar o risco reduzido no loop e as filas normal, com um item e vazia precisam passar.',
    },
    refactorOptions: [
      { en: 'Make the stopping condition readable without mental calculation.', pt: 'Deixe a condição de parada legível sem cálculo mental.' },
      { en: 'Keep the state update together inside the loop.', pt: 'Mantenha a atualização do estado reunida dentro do loop.' },
      { en: 'Handle the zero-quantity case explicitly.', pt: 'Trate explicitamente o caso de quantidade zero.' },
      { en: 'Use one responsibility per section.', pt: 'Use uma responsabilidade por seção.' },
    ],
    accomplishment: [
      { en: 'design a loop that is guaranteed to finish', pt: 'projetar um loop com término garantido' },
      { en: 'maintain a counter and accumulator', pt: 'manter contador e acumulador' },
      { en: 'test normal and empty batches', pt: 'testar lotes normais e vazios' },
    ],
  },
  {
    id: 'portfolio-report',
    milestonePhaseId: 12,
    icon: '🛒',
    title: { en: 'E-commerce Order Report', pt: 'Relatório de Pedidos do E-commerce' },
    subtitle: { en: 'Transform structured records into a useful report.', pt: 'Transforme registros estruturados em um relatório útil.' },
    scenario: {
      en: 'An online store receives a small batch of orders. Build a report containing only approved orders, their customer names, and the approved revenue.',
      pt: 'Uma loja online recebe um pequeno lote de pedidos. Construa um relatório contendo apenas pedidos aprovados, os nomes dos clientes e a receita aprovada.',
    },
    professionalContext: {
      en: 'Real applications receive collections of records. Professional code understands one record contract, applies the same rule to the whole collection, and also behaves correctly when the result is empty.',
      pt: 'Aplicações reais recebem coleções de registros. Código profissional entende o contrato de um registro, aplica a mesma regra à coleção inteira e também funciona quando o resultado fica vazio.',
    },
    estimatedMinutes: 75,
    skills: [
      { en: 'list of dictionaries', pt: 'lista de dicionários' },
      { en: 'input-driven records', pt: 'registros recebidos por entrada' },
      { en: 'list comprehension', pt: 'compreensão de listas' },
      { en: 'filtering and aggregation', pt: 'filtragem e agregação' },
    ],
    requirements: {
      en: ['Read the number of orders', 'Read customer|amount|status for every order', 'Store every order as a dictionary', 'Create approved_orders with a list comprehension', 'Create customer_names', 'Calculate approved_total', 'Print approved count, customers, and total'],
      pt: ['Leia a quantidade de pedidos', 'Leia cliente|valor|status para cada pedido', 'Guarde cada pedido como dicionário', 'Crie approved_orders com compreensão de lista', 'Crie customer_names', 'Calcule approved_total', 'Mostre quantidade aprovada, clientes e total'],
    },
    inputContract: { en: 'First an integer quantity, then one customer|amount|status line for each order.', pt: 'Primeiro uma quantidade inteira e depois uma linha cliente|valor|status para cada pedido.' },
    outputContract: { en: 'Approved count, customer names, and approved total.', pt: 'Quantidade aprovada, nomes dos clientes e total aprovado.' },
    ruleContract: { en: 'Include only records whose status equals approved. The same code must handle any valid batch.', pt: 'Inclua somente registros cujo status seja approved. O mesmo código precisa tratar qualquer lote válido.' },
    edgeCases: { en: 'Prove a batch with no approved order and a batch with accented names and decimal amounts.', pt: 'Comprove um lote sem pedido aprovado e outro com nomes acentuados e valores decimais.' },
    starterCode: {
      en: `# Project: E-commerce Order Report
quantity = int(input("How many orders? "))
orders = []

for _ in range(quantity):
    customer, amount_text, status = input("Order: ").strip().split("|")
    orders.append({
        "customer": customer,
        "amount": float(amount_text),
        "status": status,
    })

# TODO: filter approved records with a list comprehension
approved_orders = []

# TODO: derive the approved customer-name list
customer_names = []

# TODO: calculate approved revenue
approved_total = 0

print("Approved:", len(approved_orders))
print("Customers:", ", ".join(customer_names))
print("Total:", approved_total)`,
      pt: `# Projeto: Relatório de Pedidos do E-commerce
quantity = int(input("Quantos pedidos? "))
orders = []

for _ in range(quantity):
    customer, amount_text, status = input("Pedido: ").strip().split("|")
    orders.append({
        "customer": customer,
        "amount": float(amount_text),
        "status": status,
    })

# TODO: filtre registros aprovados com compreensão de lista
approved_orders = []

# TODO: derive a lista de clientes aprovados
customer_names = []

# TODO: calcule a receita aprovada
approved_total = 0

print("Aprovados:", len(approved_orders))
print("Clientes:", ", ".join(customer_names))
print("Total:", approved_total)`,
    },
    tests: [
      {
        id: 'portfolio-standard',
        title: { en: 'Mixed order batch', pt: 'Lote misto de pedidos' },
        inputs: ['4', 'Ana|3200|approved', 'Bruno|1800|pending', 'Carla|5100|approved', 'Diego|900|rejected'],
        expectedOutput: ['2', 'Ana', 'Carla', '8300'],
      },
      {
        id: 'portfolio-empty',
        title: { en: 'No approved orders', pt: 'Nenhum pedido aprovado' },
        inputs: ['2', 'Eva|1200|pending', 'Felipe|900|rejected'],
        expectedOutput: ['0', 'Total: 0'],
      },
      {
        id: 'portfolio-accents-decimals',
        title: { en: 'Accented names and decimal amounts', pt: 'Nomes acentuados e valores decimais' },
        inputs: ['3', 'João|120.50|approved', 'Lívia|230|approved', 'Mário|50|pending'],
        expectedOutput: ['2', 'João', 'Lívia', '350.5'],
      },
    ],
    requiredNodes: ['ListComp', 'For'],
    refactorGoal: {
      en: 'Reduce duplication between filtering, name extraction, and aggregation while keeping the report contract readable.',
      pt: 'Reduza repetição entre filtragem, extração de nomes e agregação, mantendo o contrato do relatório legível.',
    },
    refactorEvidence: {
      en: 'The improvement must be visible in the code, explained in your own words, and all datasets—including no approved records—must still pass.',
      pt: 'A melhoria precisa aparecer no código, ser explicada com suas palavras e todos os conjuntos — inclusive sem registros aprovados — devem continuar aprovados.',
    },
    refactorOptions: [
      { en: 'Use the record keys consistently.', pt: 'Use as chaves do registro de forma consistente.' },
      { en: 'Separate input, filtering, transformation, and aggregation.', pt: 'Separe entrada, filtragem, transformação e agregação.' },
      { en: 'Avoid repeating the approved-status rule.', pt: 'Evite repetir a regra de status aprovado.' },
      { en: 'Keep the final report readable.', pt: 'Mantenha o relatório final legível.' },
    ],
    accomplishment: [
      { en: 'read structured records from real input', pt: 'ler registros estruturados de entradas reais' },
      { en: 'filter and transform data intentionally', pt: 'filtrar e transformar dados intencionalmente' },
      { en: 'prove behavior with normal, empty, and accented datasets', pt: 'comprovar comportamento com conjuntos normal, vazio e acentuado' },
    ],
  },
  {
    id: 'foundation-claim-desk',
    milestonePhaseId: 27,
    icon: '🗂️',
    title: { en: 'Claim Desk CLI', pt: 'Central de Sinistros CLI' },
    subtitle: {
      en: 'Combine the whole Python foundation in one auditable command-line program.',
      pt: 'Combine toda a base de Python em um programa de terminal que pode ser auditado.',
    },
    scenario: {
      en: 'A small claims team needs a terminal program to register claims, prevent duplicate identifiers, list records, calculate the total amount and survive invalid numeric input.',
      pt: 'Uma pequena equipe de sinistros precisa de um programa de terminal para cadastrar sinistros, impedir identificadores duplicados, listar registros, calcular o valor total e sobreviver a entradas numéricas inválidas.',
    },
    professionalContext: {
      en: 'This project combines decomposition, functions, collections, loops, validation, exceptions and a stable output contract. It is the first portfolio evidence that you can turn a written problem into a tested program.',
      pt: 'Este projeto combina decomposição, funções, coleções, loops, validação, exceções e um contrato de saída estável. É a primeira evidência de portfólio de que você consegue transformar um problema escrito em um programa testado.',
    },
    estimatedMinutes: 120,
    skills: [
      { en: 'problem decomposition', pt: 'decomposição de problemas' },
      { en: 'functions and collections', pt: 'funções e coleções' },
      { en: 'input validation and exceptions', pt: 'validação de entrada e exceções' },
      { en: 'behavioral testing', pt: 'testes de comportamento' },
      { en: 'clear output contracts', pt: 'contratos de saída claros' },
    ],
    requirements: {
      en: [
        'Keep claims in a list of dictionaries',
        'Create functions to find, add, list and total claims',
        'Use a while loop for the command menu',
        'Reject duplicate claim IDs',
        'Handle an invalid amount without crashing',
        'Print the stable labels required by the visible tests',
      ],
      pt: [
        'Guarde os sinistros em uma lista de dicionários',
        'Crie funções para localizar, adicionar, listar e totalizar sinistros',
        'Use um loop while para o menu de comandos',
        'Rejeite identificadores de sinistro duplicados',
        'Trate um valor inválido sem encerrar o programa',
        'Imprima os rótulos estáveis exigidos pelos testes visíveis',
      ],
    },
    inputContract: {
      en: 'Commands arrive one per line. add is followed by claim ID, client and amount. list and total need no additional values. exit finishes the program.',
      pt: 'Os comandos chegam um por linha. add é seguido por ID do sinistro, cliente e valor. list e total não precisam de valores adicionais. exit encerra o programa.',
    },
    outputContract: {
      en: 'Use ADDED=<id>, CLAIM=<id>|<client>|<amount>, TOTAL=<amount>, DUPLICATE_ID, INVALID_AMOUNT and BYE.',
      pt: 'Use ADDED=<id>, CLAIM=<id>|<cliente>|<valor>, TOTAL=<valor>, DUPLICATE_ID, INVALID_AMOUNT e BYE.',
    },
    ruleContract: {
      en: 'An ID is unique. Invalid amounts are not added. The total is the sum of every accepted claim amount.',
      pt: 'Um ID é único. Valores inválidos não são adicionados. O total é a soma dos valores de todos os sinistros aceitos.',
    },
    edgeCases: {
      en: 'Test an invalid amount, a duplicate ID and an empty or partially filled registry.',
      pt: 'Teste um valor inválido, um ID duplicado e um cadastro vazio ou parcialmente preenchido.',
    },
    starterCode: {
      en: `# Portfolio project: Claim Desk CLI
# Build the missing behavior from the contract before changing the output labels.

claims = []


def find_claim(claims, claim_id):
    # TODO: return the matching record or None
    return None


def add_claim(claims, claim_id, client, amount_text):
    # TODO: reject a duplicate ID
    # TODO: convert amount_text with try/except
    # TODO: append a dictionary when the data is valid
    return False


def list_claims(claims):
    # TODO: print one CLAIM= line for every record
    pass


def total_claims(claims):
    # TODO: return the sum of all amounts
    return 0.0


while True:
    command = input("Command: ").strip().lower()

    if command == "add":
        claim_id = input("Claim ID: ").strip()
        client = input("Client: ").strip()
        amount_text = input("Amount: ").strip()
        add_claim(claims, claim_id, client, amount_text)
    elif command == "list":
        list_claims(claims)
    elif command == "total":
        print(f"TOTAL={total_claims(claims):.2f}")
    elif command == "exit":
        print("BYE")
        break
    else:
        print("UNKNOWN_COMMAND")`,
      pt: `# Projeto de portfólio: Central de Sinistros CLI
# Construa o comportamento ausente a partir do contrato antes de alterar os rótulos de saída.

claims = []


def find_claim(claims, claim_id):
    # TODO: retorne o registro correspondente ou None
    return None


def add_claim(claims, claim_id, client, amount_text):
    # TODO: rejeite um ID duplicado
    # TODO: converta amount_text usando try/except
    # TODO: adicione um dicionário quando os dados forem válidos
    return False


def list_claims(claims):
    # TODO: imprima uma linha CLAIM= para cada registro
    pass


def total_claims(claims):
    # TODO: retorne a soma de todos os valores
    return 0.0


while True:
    command = input("Comando: ").strip().lower()

    if command == "add":
        claim_id = input("ID do sinistro: ").strip()
        client = input("Cliente: ").strip()
        amount_text = input("Valor: ").strip()
        add_claim(claims, claim_id, client, amount_text)
    elif command == "list":
        list_claims(claims)
    elif command == "total":
        print(f"TOTAL={total_claims(claims):.2f}")
    elif command == "exit":
        print("BYE")
        break
    else:
        print("UNKNOWN_COMMAND")`,
    },
    tests: [
      {
        id: 'claim-desk-standard',
        title: { en: 'Two accepted claims', pt: 'Dois sinistros aceitos' },
        inputs: ['add', 'C-101', 'Ana', '1200', 'add', 'C-102', 'Bruno', '800', 'list', 'total', 'exit'],
        expectedOutput: ['ADDED=C-101', 'ADDED=C-102', 'CLAIM=C-101|Ana|1200.00', 'CLAIM=C-102|Bruno|800.00', 'TOTAL=2000.00', 'BYE'],
      },
      {
        id: 'claim-desk-validation',
        title: { en: 'Invalid amount and duplicate ID', pt: 'Valor inválido e ID duplicado' },
        inputs: ['add', 'C-201', 'Carla', 'oops', 'add', 'C-201', 'Carla', '500', 'add', 'C-201', 'Duplicado', '700', 'total', 'exit'],
        expectedOutput: ['INVALID_AMOUNT', 'ADDED=C-201', 'DUPLICATE_ID', 'TOTAL=500.00', 'BYE'],
      },
      {
        id: 'claim-desk-empty',
        title: { en: 'Empty registry', pt: 'Cadastro vazio' },
        inputs: ['list', 'total', 'exit'],
        expectedOutput: ['TOTAL=0.00', 'BYE'],
      },
    ],
    requiredNodes: ['FunctionDef', 'While', 'Try'],
    refactorGoal: {
      en: 'Improve one boundary of the command-line application: lookup, validation, command handling, or reporting. Do not change the public output labels.',
      pt: 'Melhore uma fronteira do aplicativo de terminal: busca, validação, tratamento de comandos ou relatório. Não altere os rótulos públicos de saída.',
    },
    refactorEvidence: {
      en: 'Your code and explanation must show the chosen boundary became clearer, and normal, invalid, duplicate, and empty-registry behavior must remain green.',
      pt: 'O código e a explicação precisam mostrar que a fronteira escolhida ficou mais clara, e os comportamentos normal, inválido, duplicado e cadastro vazio devem permanecer verdes.',
    },
    refactorOptions: [
      { en: 'Give every function one clear responsibility.', pt: 'Dê a cada função uma responsabilidade clara.' },
      { en: 'Use names that reveal the business meaning.', pt: 'Use nomes que revelem o significado de negócio.' },
      { en: 'Avoid duplicating the lookup rule.', pt: 'Evite duplicar a regra de busca.' },
      { en: 'Keep the command loop short by delegating work to functions.', pt: 'Mantenha o loop de comandos curto delegando trabalho às funções.' },
      { en: 'Add comments only where a decision is not obvious.', pt: 'Adicione comentários apenas quando uma decisão não for óbvia.' },
    ],
    accomplishment: [
      { en: 'turn a business brief into a program contract', pt: 'transformar um briefing de negócio em contrato de programa' },
      { en: 'combine functions, loops, lists, dictionaries and exceptions', pt: 'combinar funções, loops, listas, dicionários e exceções' },
      { en: 'prove behavior with normal and failure scenarios', pt: 'comprovar comportamento com cenários normais e de falha' },
      { en: 'produce a portfolio-ready README from your own work', pt: 'produzir um README de portfólio a partir do próprio trabalho' },
    ],
  },
  {
    id: 'professional-claims-triage',
    milestonePhaseId: 39,
    icon: '🏗️',
    title: { en: 'Claims Triage Service', pt: 'Serviço de Triagem de Sinistros' },
    subtitle: {
      en: 'Build a maintainable command-line service with domain modeling, validation, logging and repeatable tests.',
      pt: 'Construa um serviço de terminal sustentável com modelagem de domínio, validação, logging e testes repetíveis.',
    },
    scenario: {
      en: 'A claims operation receives one claim per line. The service must validate the record, reject duplicate IDs, classify priority, preserve accepted claims and produce an auditable summary.',
      pt: 'Uma operação de sinistros recebe um registro por linha. O serviço precisa validar o registro, rejeitar IDs duplicados, classificar a prioridade, preservar os sinistros aceitos e produzir um resumo auditável.',
    },
    professionalContext: {
      en: 'This project represents the boundary between raw external data and trusted domain objects. It combines dataclasses, type hints, focused functions, logging, exception handling, a thin CLI and a main guard.',
      pt: 'Este projeto representa a fronteira entre dados externos brutos e objetos de domínio confiáveis. Ele combina dataclasses, type hints, funções focadas, logging, tratamento de exceções, uma CLI fina e main guard.',
    },
    estimatedMinutes: 180,
    skills: [
      { en: 'domain modeling with dataclasses', pt: 'modelagem de domínio com dataclasses' },
      { en: 'typed boundaries and validation', pt: 'fronteiras tipadas e validação' },
      { en: 'separation of domain and CLI logic', pt: 'separação entre domínio e CLI' },
      { en: 'structured logging and error recovery', pt: 'logging estruturado e recuperação de erros' },
      { en: 'repeatable behavior tests', pt: 'testes de comportamento repetíveis' },
    ],
    requirements: {
      en: [
        'Represent an accepted claim with a dataclass',
        'Parse records in the format id|amount|severity',
        'Reject invalid amounts and severity values without crashing',
        'Reject duplicate claim IDs',
        'Classify as ESCALATE when severity is at least 8 or amount is at least 10000',
        'Keep the command-line loop thin by delegating work to functions',
        'Configure and use the logging module',
        'Run the CLI through an if __name__ == "__main__" guard',
        'Print the stable output contract used by the visible tests',
      ],
      pt: [
        'Represente um sinistro aceito com uma dataclass',
        'Interprete registros no formato id|valor|gravidade',
        'Rejeite valores e gravidades inválidos sem encerrar o programa',
        'Rejeite IDs de sinistro duplicados',
        'Classifique como ESCALATE quando a gravidade for pelo menos 8 ou o valor for pelo menos 10000',
        'Mantenha o loop da CLI curto delegando trabalho para funções',
        'Configure e use o módulo logging',
        'Execute a CLI por um guard if __name__ == "__main__"',
        'Imprima o contrato de saída estável usado pelos testes visíveis',
      ],
    },
    inputContract: {
      en: 'One record per line using id|amount|severity. END finishes the batch.',
      pt: 'Um registro por linha usando id|valor|gravidade. END encerra o lote.',
    },
    outputContract: {
      en: 'Use CLAIM=<id>|<priority>|<amount>, DUPLICATE=<id>, INVALID=<id> and SUMMARY=<accepted>|<total>|<escalated>.',
      pt: 'Use CLAIM=<id>|<prioridade>|<valor>, DUPLICATE=<id>, INVALID=<id> e SUMMARY=<aceitos>|<total>|<escalados>.',
    },
    ruleContract: {
      en: 'IDs are unique. Amount must be positive. Severity must be an integer from 1 to 10. ESCALATE applies when severity >= 8 or amount >= 10000; otherwise use STANDARD.',
      pt: 'IDs são únicos. O valor precisa ser positivo. A gravidade precisa ser um inteiro de 1 a 10. ESCALATE se aplica quando gravidade >= 8 ou valor >= 10000; caso contrário use STANDARD.',
    },
    edgeCases: {
      en: 'Prove the empty batch, invalid numeric input and duplicate-ID behavior in addition to the normal case.',
      pt: 'Comprove o lote vazio, a entrada numérica inválida e o comportamento de ID duplicado além do caso normal.',
    },
    starterCode: {
      en: `# Portfolio project: Claims Triage Service
# Keep the output labels unchanged because they are the public service contract.

from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(message)s")
logger = logging.getLogger("claims-triage")


@dataclass(frozen=True)
class Claim:
    claim_id: str
    amount: float
    severity: int
    priority: str


def classify_priority(amount: float, severity: int) -> str:
    # TODO: return ESCALATE or STANDARD from the business rule
    return "STANDARD"


def parse_claim(line: str) -> Claim:
    # TODO: split id|amount|severity, validate values and return Claim
    raise NotImplementedError


def process_line(line: str, claims: dict[str, Claim]) -> None:
    # TODO: reject duplicates, parse safely, store the claim and print CLAIM=...
    pass


def print_summary(claims: dict[str, Claim]) -> None:
    # TODO: print accepted count, total amount and escalated count
    pass


def main() -> None:
    claims: dict[str, Claim] = {}

    while True:
        line = input("Claim: ").strip()
        if line.upper() == "END":
            break
        process_line(line, claims)

    print_summary(claims)


if __name__ == "__main__":
    main()`,
      pt: `# Projeto de portfólio: Serviço de Triagem de Sinistros
# Não altere os rótulos de saída, pois eles são o contrato público do serviço.

from dataclasses import dataclass
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(message)s")
logger = logging.getLogger("claims-triage")


@dataclass(frozen=True)
class Claim:
    claim_id: str
    amount: float
    severity: int
    priority: str


def classify_priority(amount: float, severity: int) -> str:
    # TODO: retorne ESCALATE ou STANDARD usando a regra de negócio
    return "STANDARD"


def parse_claim(line: str) -> Claim:
    # TODO: separe id|valor|gravidade, valide os dados e retorne Claim
    raise NotImplementedError


def process_line(line: str, claims: dict[str, Claim]) -> None:
    # TODO: rejeite duplicados, interprete com segurança, salve e imprima CLAIM=...
    pass


def print_summary(claims: dict[str, Claim]) -> None:
    # TODO: mostre quantidade aceita, valor total e quantidade escalada
    pass


def main() -> None:
    claims: dict[str, Claim] = {}

    while True:
        line = input("Sinistro: ").strip()
        if line.upper() == "END":
            break
        process_line(line, claims)

    print_summary(claims)


if __name__ == "__main__":
    main()`,
    },
    tests: [
      {
        id: 'triage-standard',
        title: { en: 'Standard and escalated claims', pt: 'Sinistros padrão e escalado' },
        inputs: ['C-101|1200|3', 'C-102|15000|5', 'END'],
        expectedOutput: ['CLAIM=C-101|STANDARD|1200.00', 'CLAIM=C-102|ESCALATE|15000.00', 'SUMMARY=2|16200.00|1'],
      },
      {
        id: 'triage-validation',
        title: { en: 'Invalid record and duplicate ID', pt: 'Registro inválido e ID duplicado' },
        inputs: ['C-201|500|9', 'C-201|700|2', 'C-202|oops|4', 'END'],
        expectedOutput: ['CLAIM=C-201|ESCALATE|500.00', 'DUPLICATE=C-201', 'INVALID=C-202', 'SUMMARY=1|500.00|1'],
      },
      {
        id: 'triage-empty',
        title: { en: 'Empty batch', pt: 'Lote vazio' },
        inputs: ['END'],
        expectedOutput: ['SUMMARY=0|0.00|0'],
      },
    ],
    requiredNodes: ['ClassDef', 'Try', 'While', 'AnnAssign'],
    requiredImports: ['dataclasses', 'logging'],
    requiredFunctions: ['classify_priority', 'parse_claim', 'process_line', 'print_summary', 'main'],
    requiredCalls: ['logger.warning'],
    requireMainGuard: true,
    refactorGoal: {
      en: 'Improve one professional boundary—parsing, domain classification, logging, storage, or orchestration—without changing the public service contract.',
      pt: 'Melhore uma fronteira profissional — interpretação, classificação de domínio, logging, armazenamento ou orquestração — sem alterar o contrato público do serviço.',
    },
    refactorEvidence: {
      en: 'The final code must differ from the verified baseline, the note must defend the trade-off, and normal, invalid, duplicate, and empty batches must still pass.',
      pt: 'O código final precisa diferir da base verificada, a nota deve defender a decisão e os lotes normal, inválido, duplicado e vazio devem continuar passando.',
    },
    refactorOptions: [
      { en: 'Keep parsing, domain rules, storage and presentation in separate functions.', pt: 'Mantenha interpretação, regras de domínio, armazenamento e apresentação em funções separadas.' },
      { en: 'Use precise type hints at every public boundary.', pt: 'Use type hints precisos em toda fronteira pública.' },
      { en: 'Log rejected records without exposing sensitive claim details.', pt: 'Registre rejeições sem expor detalhes sensíveis do sinistro.' },
      { en: 'Make validation errors explicit and easy to test.', pt: 'Torne os erros de validação explícitos e fáceis de testar.' },
      { en: 'Keep main focused on orchestration rather than business rules.', pt: 'Mantenha main focada em orquestração, não em regras de negócio.' },
    ],
    accomplishment: [
      { en: 'model trusted domain data with a dataclass', pt: 'modelar dados de domínio confiáveis com uma dataclass' },
      { en: 'separate CLI input from testable business rules', pt: 'separar entrada da CLI de regras de negócio testáveis' },
      { en: 'combine type hints, logging, validation and exception handling', pt: 'combinar type hints, logging, validação e tratamento de exceções' },
      { en: 'prove normal, failure and empty-batch behavior', pt: 'comprovar comportamento normal, de falha e de lote vazio' },
      { en: 'produce a second portfolio artifact from your own implementation', pt: 'produzir um segundo artefato de portfólio a partir da própria implementação' },
    ],
  },
  {
    id: 'engineering-order-service',
    milestonePhaseId: 53,
    icon: '⚙️',
    title: { en: 'Order Processing Service Core', pt: 'Núcleo de Serviço de Pedidos' },
    subtitle: {
      en: 'Design a production-style core with explicit contracts, replaceable persistence and auditable failures.',
      pt: 'Projete um núcleo com padrão de produção, contratos explícitos, persistência substituível e falhas auditáveis.',
    },
    scenario: {
      en: 'An operations team receives order lines from an external system. Build a service core that validates each order, calculates tax, prevents duplicates, stores accepted summaries and publishes a stable final report.',
      pt: 'Uma equipe operacional recebe linhas de pedidos de um sistema externo. Construa um núcleo de serviço que valide cada pedido, calcule imposto, impeça duplicados, armazene resumos aceitos e publique um relatório final estável.',
    },
    professionalContext: {
      en: 'This milestone connects advanced Python to software engineering: a pure calculation core, typed domain values, an explicit repository boundary, safe logging and a CLI adapter that can be replaced later.',
      pt: 'Este marco conecta Python avançado à engenharia de software: núcleo puro de cálculo, valores de domínio tipados, fronteira explícita de repositório, logging seguro e um adaptador de terminal que poderá ser substituído.',
    },
    estimatedMinutes: 180,
    skills: [
      { en: 'typed domain modeling', pt: 'modelagem de domínio tipada' },
      { en: 'pure business-rule functions', pt: 'funções puras de regra de negócio' },
      { en: 'repository boundaries and protocols', pt: 'fronteiras de repositório e protocols' },
      { en: 'validation and failure semantics', pt: 'validação e semântica de falhas' },
      { en: 'logging without sensitive payloads', pt: 'logging sem dados sensíveis' },
      { en: 'reproducible acceptance tests', pt: 'testes de aceitação reproduzíveis' },
    ],
    requirements: {
      en: [
        'Represent a validated order with a frozen dataclass',
        'Define a repository protocol and an in-memory implementation',
        'Parse order_id|quantity|unit_price|tax_rate safely',
        'Reject missing IDs, non-positive quantity, negative price and negative tax rate',
        'Keep calculation separate from input and storage',
        'Reject duplicate order IDs',
        'Log invalid and duplicate events without logging the full external line',
        'Print the exact stable ORDER, INVALID, DUPLICATE, SUMMARY and BYE contracts',
      ],
      pt: [
        'Represente um pedido validado com uma dataclass imutável',
        'Defina um protocol de repositório e uma implementação em memória',
        'Interprete order_id|quantity|unit_price|tax_rate com segurança',
        'Rejeite ID ausente, quantidade não positiva, preço negativo e taxa negativa',
        'Mantenha cálculo separado de entrada e armazenamento',
        'Rejeite IDs de pedido duplicados',
        'Registre eventos inválidos e duplicados sem incluir a linha externa completa',
        'Imprima os contratos estáveis ORDER, INVALID, DUPLICATE, SUMMARY e BYE',
      ],
    },
    inputContract: {
      en: 'One order per line as order_id|quantity|unit_price|tax_rate. END finishes the batch.',
      pt: 'Um pedido por linha no formato order_id|quantity|unit_price|tax_rate. END encerra o lote.',
    },
    outputContract: {
      en: 'Accepted orders use ORDER=<id>|<subtotal>|<tax>|<total>. Failures use INVALID=<id> or DUPLICATE=<id>. Finish with SUMMARY=<count>|<grand_total> and BYE.',
      pt: 'Pedidos aceitos usam ORDER=<id>|<subtotal>|<imposto>|<total>. Falhas usam INVALID=<id> ou DUPLICATE=<id>. Termine com SUMMARY=<quantidade>|<total_geral> e BYE.',
    },
    ruleContract: {
      en: 'subtotal = quantity × unit_price; tax = subtotal × tax_rate; total = subtotal + tax. Round monetary output to two decimal places. Only accepted orders affect the summary.',
      pt: 'subtotal = quantidade × preço_unitário; imposto = subtotal × taxa; total = subtotal + imposto. Formate valores monetários com duas casas. Apenas pedidos aceitos entram no resumo.',
    },
    edgeCases: {
      en: 'Prove empty input, duplicate IDs, malformed numbers, non-positive quantities and negative financial values.',
      pt: 'Comprove lote vazio, IDs duplicados, números malformados, quantidades não positivas e valores financeiros negativos.',
    },
    starterCode: {
      en: `# Portfolio project: Order Processing Service Core
from dataclasses import dataclass
import logging
from typing import Protocol

logger = logging.getLogger("orders")


@dataclass(frozen=True)
class Order:
    order_id: str
    quantity: int
    unit_price: float
    tax_rate: float


class OrderRepository(Protocol):
    def exists(self, order_id: str) -> bool: ...
    def save(self, order_id: str, summary: dict[str, float]) -> None: ...
    def values(self) -> list[dict[str, float]]: ...


class InMemoryOrderRepository:
    def __init__(self) -> None:
        self._orders: dict[str, dict[str, float]] = {}

    def exists(self, order_id: str) -> bool:
        # TODO: report whether the ID is already stored
        return False

    def save(self, order_id: str, summary: dict[str, float]) -> None:
        # TODO: store a copy of the calculated summary
        pass

    def values(self) -> list[dict[str, float]]:
        # TODO: return every stored summary
        return []


def parse_order(line: str) -> Order:
    # TODO: split order_id|quantity|unit_price|tax_rate
    # TODO: convert values and raise ValueError for invalid business data
    raise NotImplementedError


def calculate_totals(order: Order) -> dict[str, float]:
    # TODO: calculate subtotal, tax and total as a pure function
    return {"subtotal": 0.0, "tax": 0.0, "total": 0.0}


def process_line(line: str, repository: OrderRepository) -> None:
    # TODO: reject duplicates, parse safely, save and print ORDER=...
    pass


def print_summary(repository: OrderRepository) -> None:
    # TODO: print accepted count and grand total
    pass


def main() -> None:
    repository = InMemoryOrderRepository()

    while True:
        line = input("Order: ").strip()
        if line.upper() == "END":
            break
        process_line(line, repository)

    print_summary(repository)
    print("BYE")


if __name__ == "__main__":
    main()`,
      pt: `# Projeto de portfólio: Núcleo de Serviço de Pedidos
from dataclasses import dataclass
import logging
from typing import Protocol

logger = logging.getLogger("orders")


@dataclass(frozen=True)
class Order:
    order_id: str
    quantity: int
    unit_price: float
    tax_rate: float


class OrderRepository(Protocol):
    def exists(self, order_id: str) -> bool: ...
    def save(self, order_id: str, summary: dict[str, float]) -> None: ...
    def values(self) -> list[dict[str, float]]: ...


class InMemoryOrderRepository:
    def __init__(self) -> None:
        self._orders: dict[str, dict[str, float]] = {}

    def exists(self, order_id: str) -> bool:
        # TODO: informe se o ID já está armazenado
        return False

    def save(self, order_id: str, summary: dict[str, float]) -> None:
        # TODO: armazene uma cópia do resumo calculado
        pass

    def values(self) -> list[dict[str, float]]:
        # TODO: retorne todos os resumos armazenados
        return []


def parse_order(line: str) -> Order:
    # TODO: separe order_id|quantity|unit_price|tax_rate
    # TODO: converta os valores e levante ValueError para dados inválidos
    raise NotImplementedError


def calculate_totals(order: Order) -> dict[str, float]:
    # TODO: calcule subtotal, imposto e total como função pura
    return {"subtotal": 0.0, "tax": 0.0, "total": 0.0}


def process_line(line: str, repository: OrderRepository) -> None:
    # TODO: rejeite duplicados, interprete com segurança, salve e imprima ORDER=...
    pass


def print_summary(repository: OrderRepository) -> None:
    # TODO: mostre quantidade aceita e total geral
    pass


def main() -> None:
    repository = InMemoryOrderRepository()

    while True:
        line = input("Pedido: ").strip()
        if line.upper() == "END":
            break
        process_line(line, repository)

    print_summary(repository)
    print("BYE")


if __name__ == "__main__":
    main()`,
    },
    tests: [
      {
        id: 'orders-standard',
        title: { en: 'Two accepted orders', pt: 'Dois pedidos aceitos' },
        inputs: ['O-101|2|10|0.13', 'O-102|1|5.5|0.10', 'END'],
        expectedOutput: [
          'ORDER=O-101|20.00|2.60|22.60',
          'ORDER=O-102|5.50|0.55|6.05',
          'SUMMARY=2|28.65',
          'BYE',
        ],
      },
      {
        id: 'orders-validation',
        title: { en: 'Duplicate and invalid orders', pt: 'Pedidos duplicados e inválidos' },
        inputs: ['O-201|3|2.5|0.10', 'O-201|1|9|0.10', 'O-202|-1|10|0.13', 'O-203|abc|10|0.13', 'END'],
        expectedOutput: [
          'ORDER=O-201|7.50|0.75|8.25',
          'DUPLICATE=O-201',
          'INVALID=O-202',
          'INVALID=O-203',
          'SUMMARY=1|8.25',
          'BYE',
        ],
      },
      {
        id: 'orders-empty',
        title: { en: 'Empty batch', pt: 'Lote vazio' },
        inputs: ['END'],
        expectedOutput: ['SUMMARY=0|0.00', 'BYE'],
      },
    ],
    requiredNodes: ['ClassDef', 'Try', 'While', 'AnnAssign', 'Raise'],
    requiredImports: ['dataclasses', 'logging', 'typing'],
    requiredFunctions: ['parse_order', 'calculate_totals', 'process_line', 'print_summary', 'main'],
    requiredCalls: ['logger.warning'],
    requireMainGuard: true,
    refactorGoal: {
      en: 'Improve one engineering boundary such as the pure calculation, repository protocol, validation mapping, or safe logging while preserving replaceability.',
      pt: 'Melhore uma fronteira de engenharia, como cálculo puro, protocol de repositório, mapeamento de validação ou logging seguro, preservando a substituição dos componentes.',
    },
    refactorEvidence: {
      en: 'Explain the design improvement, change the code, and prove accepted, duplicate, invalid, and empty order batches still satisfy the same contract.',
      pt: 'Explique a melhoria de design, altere o código e comprove que lotes aceitos, duplicados, inválidos e vazios continuam obedecendo ao mesmo contrato.',
    },
    refactorOptions: [
      { en: 'Keep parsing, calculation, persistence and presentation in separate boundaries.', pt: 'Mantenha interpretação, cálculo, persistência e apresentação em fronteiras separadas.' },
      { en: 'Make every validation failure explicit and covered by an acceptance case.', pt: 'Torne toda falha de validação explícita e coberta por um caso de aceitação.' },
      { en: 'Depend on the repository protocol instead of the concrete in-memory class.', pt: 'Dependa do protocol de repositório, não da classe concreta em memória.' },
      { en: 'Keep calculation pure so it can be tested without input, storage or logging.', pt: 'Mantenha o cálculo puro para testá-lo sem entrada, armazenamento ou logging.' },
      { en: 'Log only event type and safe identifiers, never the full external payload.', pt: 'Registre apenas o tipo de evento e identificadores seguros, nunca o payload externo completo.' },
      { en: 'Explain one architecture trade-off in the exported README.', pt: 'Explique uma decisão arquitetural no README exportado.' },
    ],
    accomplishment: [
      { en: 'model immutable trusted domain data', pt: 'modelar dados de domínio confiáveis e imutáveis' },
      { en: 'separate a pure business core from external adapters', pt: 'separar núcleo puro de negócio de adaptadores externos' },
      { en: 'use a protocol to make persistence replaceable', pt: 'usar protocol para tornar a persistência substituível' },
      { en: 'define stable success and failure contracts', pt: 'definir contratos estáveis de sucesso e falha' },
      { en: 'prove normal, invalid, duplicate and empty behavior', pt: 'comprovar comportamentos normal, inválido, duplicado e vazio' },
      { en: 'produce an engineering portfolio artifact you can defend', pt: 'produzir um artefato de engenharia que você consegue defender' },
    ],
  },
  {
    id: 'data-ml-risk-pipeline',
    milestonePhaseId: 60,
    icon: '📈',
    title: { en: 'Claim Risk Classification Pipeline', pt: 'Pipeline de Classificação de Risco de Sinistros' },
    subtitle: {
      en: 'Build and evaluate a small classification pipeline without hiding the data flow behind a library.',
      pt: 'Construa e avalie um pequeno pipeline de classificação sem esconder o fluxo dos dados atrás de uma biblioteca.',
    },
    scenario: {
      en: 'A claims analytics team has labeled historical records and a separate evaluation set. Build a reproducible pipeline that validates rows, fits preprocessing only on training data, learns class centroids, predicts the evaluation rows and reports honest metrics.',
      pt: 'Uma equipe de análise de sinistros possui registros históricos rotulados e um conjunto separado de avaliação. Construa um pipeline reproduzível que valide linhas, ajuste o pré-processamento apenas nos dados de treino, aprenda centroides por classe, faça previsões e publique métricas honestas.',
    },
    professionalContext: {
      en: 'A model is more than a prediction formula. Professional ML separates training from evaluation, prevents leakage, records the contract and reports what the metrics actually measure.',
      pt: 'Um modelo é mais do que uma fórmula de previsão. Machine Learning profissional separa treino de avaliação, evita vazamento, registra o contrato e informa o que as métricas realmente medem.',
    },
    estimatedMinutes: 210,
    skills: [
      { en: 'dataset contracts and validation', pt: 'contratos e validação de dados' },
      { en: 'train/evaluation separation', pt: 'separação entre treino e avaliação' },
      { en: 'feature scaling without leakage', pt: 'normalização de atributos sem vazamento' },
      { en: 'nearest-centroid classification', pt: 'classificação por centroide mais próximo' },
      { en: 'accuracy, precision and recall', pt: 'acurácia, precisão e recall' },
      { en: 'reproducible model evaluation', pt: 'avaliação reproduzível de modelos' },
    ],
    requirements: {
      en: [
        'Represent every validated row with a dataclass',
        'Parse TRAIN|id|amount|days_open|label and TEST|id|amount|days_open|label',
        'Reject invalid identifiers, negative values and labels outside 0 or 1',
        'Fit min/max feature scaling using training rows only',
        'Fit one centroid for label 0 and one centroid for label 1',
        'Predict each TEST row by the closest centroid',
        'Print PRED=<id>|<predicted>|<actual> for every evaluation row',
        'Print METRICS=<correct>|<total>|<accuracy>|<precision>|<recall>',
        'Protect empty evaluation sets and missing training classes',
      ],
      pt: [
        'Represente cada linha validada com uma dataclass',
        'Interprete TRAIN|id|amount|days_open|label e TEST|id|amount|days_open|label',
        'Rejeite identificadores inválidos, valores negativos e rótulos fora de 0 ou 1',
        'Ajuste a normalização min/max usando somente as linhas de treino',
        'Ajuste um centroide para o rótulo 0 e outro para o rótulo 1',
        'Classifique cada linha TEST pelo centroide mais próximo',
        'Imprima PRED=<id>|<previsto>|<real> para cada linha de avaliação',
        'Imprima METRICS=<corretos>|<total>|<acurácia>|<precisão>|<recall>',
        'Proteja conjunto de avaliação vazio e classes ausentes no treino',
      ],
    },
    inputContract: {
      en: 'Rows begin with TRAIN or TEST, followed by id|amount|days_open|label. END finishes the dataset.',
      pt: 'Cada linha começa com TRAIN ou TEST, seguida de id|amount|days_open|label. END encerra o conjunto.',
    },
    outputContract: {
      en: 'Invalid rows use INVALID=<id>. Predictions use PRED=<id>|<predicted>|<actual>. The final line reports METRICS=<correct>|<total>|<accuracy>|<precision>|<recall>. A training set without both labels reports MODEL_ERROR=need_both_labels.',
      pt: 'Linhas inválidas usam INVALID=<id>. Previsões usam PRED=<id>|<previsto>|<real>. A linha final informa METRICS=<corretos>|<total>|<acurácia>|<precisão>|<recall>. Treino sem as duas classes informa MODEL_ERROR=need_both_labels.',
    },
    ruleContract: {
      en: 'Calculate scaling ranges and class centroids only from TRAIN rows. Use normalized amount and days_open. Choose label 0 when both distances are equal. Metrics use the TEST labels only.',
      pt: 'Calcule intervalos de normalização e centroides somente com linhas TRAIN. Use amount e days_open normalizados. Escolha o rótulo 0 quando as distâncias forem iguais. As métricas usam somente os rótulos TEST.',
    },
    edgeCases: {
      en: 'Prove empty evaluation data, invalid rows, zero feature ranges and a training set that does not contain both labels.',
      pt: 'Comprove avaliação vazia, linhas inválidas, atributos sem variação e treino que não contenha os dois rótulos.',
    },
    starterCode: {
      en: `# Portfolio project: Claim Risk Classification Pipeline
from dataclasses import dataclass
import math


@dataclass(frozen=True)
class ClaimRow:
    split: str
    claim_id: str
    amount: float
    days_open: float
    label: int


def parse_record(line: str) -> ClaimRow:
    # TODO: parse SPLIT|id|amount|days_open|label
    # TODO: validate split, identifier, non-negative features and binary label
    raise NotImplementedError


def fit_scaler(train_rows: list[ClaimRow]) -> dict[str, float]:
    # TODO: calculate min and max from TRAIN rows only
    # Use a span of 1.0 when a feature has no variation.
    return {"amount_min": 0.0, "amount_span": 1.0, "days_min": 0.0, "days_span": 1.0}


def transform(row: ClaimRow, scaler: dict[str, float]) -> tuple[float, float]:
    # TODO: apply the training scaler to one row
    return (0.0, 0.0)


def fit_centroids(train_rows: list[ClaimRow], scaler: dict[str, float]) -> dict[int, tuple[float, float]]:
    # TODO: average the normalized vectors separately for labels 0 and 1
    return {}


def predict(row: ClaimRow, scaler: dict[str, float], centroids: dict[int, tuple[float, float]]) -> int:
    # TODO: compare Euclidean distances to both centroids
    return 0


def evaluate(test_rows: list[ClaimRow], scaler: dict[str, float], centroids: dict[int, tuple[float, float]]) -> None:
    # TODO: print every PRED line and the final METRICS line
    pass


def main() -> None:
    train_rows: list[ClaimRow] = []
    test_rows: list[ClaimRow] = []

    while True:
        line = input("Record: ").strip()
        if line.upper() == "END":
            break
        try:
            row = parse_record(line)
        except ValueError:
            parts = line.split("|")
            claim_id = parts[1].strip() if len(parts) > 1 and parts[1].strip() else "UNKNOWN"
            print(f"INVALID={claim_id}")
            continue

        if row.split == "TRAIN":
            train_rows.append(row)
        else:
            test_rows.append(row)

    scaler = fit_scaler(train_rows)
    centroids = fit_centroids(train_rows, scaler)
    if 0 not in centroids or 1 not in centroids:
        print("MODEL_ERROR=need_both_labels")
        return
    evaluate(test_rows, scaler, centroids)


if __name__ == "__main__":
    main()`,
      pt: `# Projeto de portfólio: Pipeline de Classificação de Risco
from dataclasses import dataclass
import math


@dataclass(frozen=True)
class ClaimRow:
    split: str
    claim_id: str
    amount: float
    days_open: float
    label: int


def parse_record(line: str) -> ClaimRow:
    # TODO: interprete SPLIT|id|amount|days_open|label
    # TODO: valide divisão, identificador, atributos não negativos e rótulo binário
    raise NotImplementedError


def fit_scaler(train_rows: list[ClaimRow]) -> dict[str, float]:
    # TODO: calcule mínimo e máximo usando somente as linhas TRAIN
    # Use span 1.0 quando um atributo não tiver variação.
    return {"amount_min": 0.0, "amount_span": 1.0, "days_min": 0.0, "days_span": 1.0}


def transform(row: ClaimRow, scaler: dict[str, float]) -> tuple[float, float]:
    # TODO: aplique a normalização de treino em uma linha
    return (0.0, 0.0)


def fit_centroids(train_rows: list[ClaimRow], scaler: dict[str, float]) -> dict[int, tuple[float, float]]:
    # TODO: calcule a média dos vetores normalizados separadamente para rótulos 0 e 1
    return {}


def predict(row: ClaimRow, scaler: dict[str, float], centroids: dict[int, tuple[float, float]]) -> int:
    # TODO: compare as distâncias euclidianas aos dois centroides
    return 0


def evaluate(test_rows: list[ClaimRow], scaler: dict[str, float], centroids: dict[int, tuple[float, float]]) -> None:
    # TODO: imprima cada linha PRED e a linha final METRICS
    pass


def main() -> None:
    train_rows: list[ClaimRow] = []
    test_rows: list[ClaimRow] = []

    while True:
        line = input("Registro: ").strip()
        if line.upper() == "END":
            break
        try:
            row = parse_record(line)
        except ValueError:
            parts = line.split("|")
            claim_id = parts[1].strip() if len(parts) > 1 and parts[1].strip() else "UNKNOWN"
            print(f"INVALID={claim_id}")
            continue

        if row.split == "TRAIN":
            train_rows.append(row)
        else:
            test_rows.append(row)

    scaler = fit_scaler(train_rows)
    centroids = fit_centroids(train_rows, scaler)
    if 0 not in centroids or 1 not in centroids:
        print("MODEL_ERROR=need_both_labels")
        return
    evaluate(test_rows, scaler, centroids)


if __name__ == "__main__":
    main()`,
    },
    tests: [
      {
        id: 'risk-perfect-separation',
        title: { en: 'Separated evaluation examples', pt: 'Exemplos de avaliação separados' },
        inputs: [
          'TRAIN|T1|1000|5|0',
          'TRAIN|T2|2000|10|0',
          'TRAIN|T3|9000|40|1',
          'TRAIN|T4|11000|50|1',
          'TEST|E1|1500|7|0',
          'TEST|E2|10000|45|1',
          'END',
        ],
        expectedOutput: [
          'PRED=E1|0|0',
          'PRED=E2|1|1',
          'METRICS=2|2|1.00|1.00|1.00',
        ],
      },
      {
        id: 'risk-false-positive',
        title: { en: 'A false positive changes the metrics', pt: 'Um falso positivo altera as métricas' },
        inputs: [
          'TRAIN|T1|1000|5|0',
          'TRAIN|T2|2000|10|0',
          'TRAIN|T3|9000|40|1',
          'TRAIN|T4|11000|50|1',
          'TEST|E3|7000|25|0',
          'TEST|E4|8500|35|1',
          'END',
        ],
        expectedOutput: [
          'PRED=E3|1|0',
          'PRED=E4|1|1',
          'METRICS=1|2|0.50|0.50|1.00',
        ],
      },
      {
        id: 'risk-invalid-empty-evaluation',
        title: { en: 'Invalid row and empty evaluation set', pt: 'Linha inválida e avaliação vazia' },
        inputs: [
          'TRAIN|T1|1000|5|0',
          'TRAIN|T2|2000|10|0',
          'TRAIN|T3|9000|40|1',
          'TRAIN|T4|11000|50|1',
          'TEST|BAD|-1|10|0',
          'END',
        ],
        expectedOutput: [
          'INVALID=BAD',
          'METRICS=0|0|0.00|0.00|0.00',
        ],
      },
      {
        id: 'risk-missing-class',
        title: { en: 'Training data missing one class', pt: 'Treino sem uma das classes' },
        inputs: [
          'TRAIN|T1|1000|5|0',
          'TRAIN|T2|1200|7|0',
          'TEST|E1|1100|6|0',
          'END',
        ],
        expectedOutput: ['MODEL_ERROR=need_both_labels'],
      },
    ],
    requiredNodes: ['ClassDef', 'Try', 'While', 'AnnAssign', 'Raise'],
    requiredImports: ['dataclasses', 'math'],
    requiredFunctions: ['parse_record', 'fit_scaler', 'transform', 'fit_centroids', 'predict', 'evaluate', 'main'],
    requireMainGuard: true,
    refactorGoal: {
      en: 'Improve reproducibility or auditability without introducing data leakage. Focus on validation, training-only preprocessing, metric calculation, or naming of model state.',
      pt: 'Melhore reprodutibilidade ou auditabilidade sem introduzir vazamento de dados. Foque validação, pré-processamento apenas no treino, cálculo de métricas ou nomes do estado do modelo.',
    },
    refactorEvidence: {
      en: 'The code must change, the note must state how leakage or metric confusion was reduced, and every evaluation scenario must still pass.',
      pt: 'O código precisa mudar, a nota deve dizer como reduziu vazamento ou confusão de métricas e todos os cenários de avaliação devem continuar passando.',
    },
    refactorOptions: [
      { en: 'Keep parsing, preprocessing, model fitting, prediction and evaluation in separate functions.', pt: 'Mantenha interpretação, pré-processamento, ajuste, previsão e avaliação em funções separadas.' },
      { en: 'Make the training-only fit boundary impossible to confuse with evaluation.', pt: 'Deixe impossível confundir o ajuste feito no treino com a avaliação.' },
      { en: 'Name every metric component so precision and recall can be audited.', pt: 'Nomeie cada componente das métricas para que precisão e recall possam ser auditados.' },
      { en: 'Protect zero denominators explicitly instead of relying on exceptions.', pt: 'Proteja denominadores zero explicitamente em vez de depender de exceções.' },
      { en: 'Document why a nearest-centroid baseline is useful and what it cannot model.', pt: 'Documente por que um baseline de centroide é útil e o que ele não consegue modelar.' },
      { en: 'Explain how you verified that preprocessing did not inspect TEST rows.', pt: 'Explique como você confirmou que o pré-processamento não examinou linhas TEST.' },
    ],
    accomplishment: [
      { en: 'define and validate a machine-learning dataset contract', pt: 'definir e validar o contrato de um conjunto de Machine Learning' },
      { en: 'separate model fitting from honest evaluation', pt: 'separar ajuste do modelo de uma avaliação honesta' },
      { en: 'prevent preprocessing leakage', pt: 'evitar vazamento no pré-processamento' },
      { en: 'implement a classifier from vector distances', pt: 'implementar um classificador usando distâncias entre vetores' },
      { en: 'calculate accuracy, precision and recall safely', pt: 'calcular acurácia, precisão e recall com segurança' },
      { en: 'produce a data and ML portfolio artifact you can explain', pt: 'produzir um artefato de dados e ML que você consegue explicar' },
    ],
  },
  {
    id: 'transformer-attention-inspector',
    milestonePhaseId: 64,
    icon: '🧠',
    title: { en: 'Transformer Attention Inspector', pt: 'Inspetor de Atenção de Transformers' },
    subtitle: {
      en: 'Implement token embeddings, stable softmax attention and evidence-based document ranking.',
      pt: 'Implemente embeddings de tokens, atenção softmax estável e ranqueamento de documentos baseado em evidências.',
    },
    scenario: {
      en: 'A local document assistant must explain which token received the most attention and which short document best matches a query. Build the attention core without using an external AI API.',
      pt: 'Um assistente local de documentos precisa explicar qual token recebeu mais atenção e qual documento curto combina melhor com uma consulta. Construa o núcleo de atenção sem usar API externa de IA.',
    },
    professionalContext: {
      en: 'Transformers are built from explicit numerical operations. This project makes embeddings, dot-product scores, stable softmax, weighted context and ranking visible enough to audit.',
      pt: 'Transformers são construídos com operações numéricas explícitas. Este projeto torna embeddings, produtos escalares, softmax estável, contexto ponderado e ranqueamento visíveis para auditoria.',
    },
    estimatedMinutes: 210,
    skills: [
      { en: 'tokenization contracts', pt: 'contratos de tokenização' },
      { en: 'embedding vectors', pt: 'vetores de embedding' },
      { en: 'dot-product attention', pt: 'atenção por produto escalar' },
      { en: 'numerically stable softmax', pt: 'softmax numericamente estável' },
      { en: 'weighted context vectors', pt: 'vetores de contexto ponderados' },
      { en: 'transparent ranking', pt: 'ranqueamento transparente' },
    ],
    requirements: {
      en: [
        'Represent each document with a dataclass',
        'Parse EMBED|token|x|y, QUERY|token and DOC|id|space separated tokens',
        'Reject malformed embeddings and documents with no known tokens',
        'Calculate query-token dot products',
        'Implement stable softmax by subtracting the largest score before exp',
        'Calculate a weighted context vector for each document',
        'Print the highest-attention token, its weight and document relevance',
        'Print the document with the highest relevance',
        'Report MODEL_ERROR=unknown_query when the query token has no embedding',
      ],
      pt: [
        'Represente cada documento com uma dataclass',
        'Interprete EMBED|token|x|y, QUERY|token e DOC|id|tokens separados por espaço',
        'Rejeite embeddings malformados e documentos sem tokens conhecidos',
        'Calcule produtos escalares entre consulta e tokens',
        'Implemente softmax estável subtraindo a maior pontuação antes de exp',
        'Calcule um vetor de contexto ponderado para cada documento',
        'Mostre o token com maior atenção, seu peso e a relevância do documento',
        'Mostre o documento com maior relevância',
        'Informe MODEL_ERROR=unknown_query quando a consulta não possuir embedding',
      ],
    },
    inputContract: {
      en: 'First define embeddings with EMBED|token|x|y, then one QUERY|token, then DOC|id|token token. END finishes the batch.',
      pt: 'Primeiro defina embeddings com EMBED|token|x|y, depois uma QUERY|token e então DOC|id|token token. END encerra o lote.',
    },
    outputContract: {
      en: 'Each valid document prints ATTN=<id>|<top_token>|<weight>|<relevance>. Invalid documents print INVALID_DOC=<id>. The best valid document prints BEST=<id>.',
      pt: 'Cada documento válido imprime ATTN=<id>|<token_principal>|<peso>|<relevância>. Documentos inválidos imprimem INVALID_DOC=<id>. O melhor documento válido imprime BEST=<id>.',
    },
    ruleContract: {
      en: 'Score each known token with dot(query, token). Apply stable softmax to the scores. The context is the weighted sum of token embeddings. Relevance is dot(query, context). Ties keep the first token and then the lexicographically smallest document id.',
      pt: 'Pontue cada token conhecido com dot(consulta, token). Aplique softmax estável. O contexto é a soma ponderada dos embeddings. A relevância é dot(consulta, contexto). Empates mantêm o primeiro token e depois o menor ID de documento em ordem alfabética.',
    },
    edgeCases: {
      en: 'Test unknown document tokens, a query token without an embedding, repeated tokens and equal relevance scores.',
      pt: 'Teste tokens desconhecidos no documento, consulta sem embedding, tokens repetidos e relevâncias empatadas.',
    },
    starterCode: {
      en: `# Portfolio project: Transformer Attention Inspector
from dataclasses import dataclass
import math


@dataclass(frozen=True)
class Document:
    doc_id: str
    tokens: list[str]


def dot(left: tuple[float, float], right: tuple[float, float]) -> float:
    # TODO: return the vector dot product
    return 0.0


def softmax(scores: list[float]) -> list[float]:
    # TODO: subtract max(scores) before math.exp for numerical stability
    return []


def attend(document: Document, query: tuple[float, float], embeddings: dict[str, tuple[float, float]]):
    # TODO: keep only known tokens
    # TODO: score, normalize, build context and relevance
    # Return (top_token, top_weight, relevance) or None
    return None


def main() -> None:
    embeddings: dict[str, tuple[float, float]] = {}
    query_token = ""
    documents: list[Document] = []

    while True:
        line = input("Record: ").strip()
        if line.upper() == "END":
            break
        try:
            kind, payload = line.split("|", 1)
            kind = kind.upper()
            if kind == "EMBED":
                token, x, y = payload.split("|")
                embeddings[token.strip()] = (float(x), float(y))
            elif kind == "QUERY":
                query_token = payload.strip()
            elif kind == "DOC":
                doc_id, text = payload.split("|", 1)
                documents.append(Document(doc_id.strip(), text.split()))
            else:
                raise ValueError
        except (ValueError, TypeError):
            print("INVALID_RECORD")

    if query_token not in embeddings:
        print("MODEL_ERROR=unknown_query")
        return

    query = embeddings[query_token]
    ranked: list[tuple[float, str]] = []
    for document in documents:
        result = attend(document, query, embeddings)
        if result is None:
            print(f"INVALID_DOC={document.doc_id}")
            continue
        top_token, top_weight, relevance = result
        print(f"ATTN={document.doc_id}|{top_token}|{top_weight:.2f}|{relevance:.2f}")
        ranked.append((relevance, document.doc_id))

    if ranked:
        best_id = sorted(ranked, key=lambda item: (-item[0], item[1]))[0][1]
        print(f"BEST={best_id}")


if __name__ == "__main__":
    main()`,
      pt: `# Projeto de portfólio: Inspetor de Atenção de Transformers
from dataclasses import dataclass
import math


@dataclass(frozen=True)
class Document:
    doc_id: str
    tokens: list[str]


def dot(left: tuple[float, float], right: tuple[float, float]) -> float:
    # TODO: retorne o produto escalar dos vetores
    return 0.0


def softmax(scores: list[float]) -> list[float]:
    # TODO: subtraia max(scores) antes de math.exp para estabilidade numérica
    return []


def attend(document: Document, query: tuple[float, float], embeddings: dict[str, tuple[float, float]]):
    # TODO: mantenha somente tokens conhecidos
    # TODO: pontue, normalize, construa contexto e relevância
    # Retorne (top_token, top_weight, relevance) ou None
    return None


def main() -> None:
    embeddings: dict[str, tuple[float, float]] = {}
    query_token = ""
    documents: list[Document] = []

    while True:
        line = input("Registro: ").strip()
        if line.upper() == "END":
            break
        try:
            kind, payload = line.split("|", 1)
            kind = kind.upper()
            if kind == "EMBED":
                token, x, y = payload.split("|")
                embeddings[token.strip()] = (float(x), float(y))
            elif kind == "QUERY":
                query_token = payload.strip()
            elif kind == "DOC":
                doc_id, text = payload.split("|", 1)
                documents.append(Document(doc_id.strip(), text.split()))
            else:
                raise ValueError
        except (ValueError, TypeError):
            print("INVALID_RECORD")

    if query_token not in embeddings:
        print("MODEL_ERROR=unknown_query")
        return

    query = embeddings[query_token]
    ranked: list[tuple[float, str]] = []
    for document in documents:
        result = attend(document, query, embeddings)
        if result is None:
            print(f"INVALID_DOC={document.doc_id}")
            continue
        top_token, top_weight, relevance = result
        print(f"ATTN={document.doc_id}|{top_token}|{top_weight:.2f}|{relevance:.2f}")
        ranked.append((relevance, document.doc_id))

    if ranked:
        best_id = sorted(ranked, key=lambda item: (-item[0], item[1]))[0][1]
        print(f"BEST={best_id}")


if __name__ == "__main__":
    main()`,
    },
    tests: [
      {
        id: 'attention-ranking',
        title: { en: 'Attention separates relevant documents', pt: 'A atenção separa documentos relevantes' },
        inputs: [
          'EMBED|urgent|1|0',
          'EMBED|payment|0.8|0.2',
          'EMBED|routine|0|1',
          'EMBED|note|0.2|0.8',
          'QUERY|urgent',
          'DOC|D1|urgent payment',
          'DOC|D2|routine note',
          'END',
        ],
        expectedOutput: [
          'ATTN=D1|urgent|0.55|0.91',
          'ATTN=D2|note|0.55|0.11',
          'BEST=D1',
        ],
      },
      {
        id: 'attention-unknown-document-token',
        title: { en: 'Unknown document tokens are handled', pt: 'Tokens desconhecidos no documento são tratados' },
        inputs: [
          'EMBED|a|1|0',
          'EMBED|b|0|1',
          'QUERY|a',
          'DOC|D1|missing unknown',
          'DOC|D2|a a',
          'END',
        ],
        expectedOutput: [
          'INVALID_DOC=D1',
          'ATTN=D2|a|0.50|1.00',
          'BEST=D2',
        ],
      },
      {
        id: 'attention-unknown-query',
        title: { en: 'Unknown query stops the model honestly', pt: 'Consulta desconhecida interrompe o modelo com honestidade' },
        inputs: [
          'EMBED|known|1|0',
          'QUERY|missing',
          'DOC|D1|known',
          'END',
        ],
        expectedOutput: ['MODEL_ERROR=unknown_query'],
      },
    ],
    requiredNodes: ['ClassDef', 'FunctionDef', 'Try', 'While', 'For'],
    requiredImports: ['dataclasses', 'math'],
    requiredFunctions: ['dot', 'softmax', 'attend', 'main'],
    requiredCalls: ['math.exp'],
    requireMainGuard: true,
    refactorGoal: {
      en: 'Improve the separation between token handling, tensor construction, attention calculation, and ranking without hiding the math.',
      pt: 'Melhore a separação entre tratamento de tokens, construção de tensores, cálculo de atenção e ranking sem esconder a matemática.',
    },
    refactorEvidence: {
      en: 'The refactor must be explained, the code must differ from the baseline, and ranking, unknown-token, and unknown-query scenarios must remain correct.',
      pt: 'A refatoração precisa ser explicada, o código deve diferir da base e os cenários de ranking, token desconhecido e consulta desconhecida devem continuar corretos.',
    },
    refactorOptions: [
      { en: 'Keep parsing separate from numerical attention calculations.', pt: 'Mantenha interpretação separada dos cálculos numéricos de atenção.' },
      { en: 'Give dot, softmax and attention one testable responsibility each.', pt: 'Dê a dot, softmax e atenção uma responsabilidade testável para cada.' },
      { en: 'Explain why subtracting the maximum score protects softmax.', pt: 'Explique por que subtrair a maior pontuação protege o softmax.' },
      { en: 'Make unknown-token behavior explicit instead of silently inventing vectors.', pt: 'Torne explícito o comportamento de tokens desconhecidos em vez de inventar vetores silenciosamente.' },
      { en: 'Document that this is one attention head with tiny authored embeddings, not a complete language model.', pt: 'Documente que isto é uma cabeça de atenção com embeddings pequenos, não um modelo de linguagem completo.' },
      { en: 'Explain how the printed evidence makes the ranking auditable.', pt: 'Explique como as evidências impressas tornam o ranqueamento auditável.' },
    ],
    accomplishment: [
      { en: 'turn tokens into vectors using an explicit embedding table', pt: 'transformar tokens em vetores usando uma tabela explícita de embeddings' },
      { en: 'calculate dot-product attention and stable softmax', pt: 'calcular atenção por produto escalar e softmax estável' },
      { en: 'build a weighted context vector', pt: 'construir um vetor de contexto ponderado' },
      { en: 'rank documents with visible numerical evidence', pt: 'ranquear documentos com evidência numérica visível' },
      { en: 'handle unknown tokens without hallucinating data', pt: 'tratar tokens desconhecidos sem inventar dados' },
      { en: 'produce a neural-NLP portfolio artifact you can explain line by line', pt: 'produzir um artefato de NLP neural que você consegue explicar linha por linha' },
    ],

  },
  {
    id: 'local-rag-copilot',
    milestonePhaseId: 68,
    icon: '🧭',
    title: { en: 'Private Local Document Copilot', pt: 'Copiloto Privado de Documentos Locais' },
    subtitle: {
      en: 'Build an auditable retrieval and grounded-answer core without an external AI API.',
      pt: 'Construa um núcleo auditável de recuperação e resposta fundamentada sem API externa de IA.',
    },
    scenario: {
      en: 'A private assistant must answer questions using only approved local documents. Build the retrieval core, show the evidence used and abstain when the documents do not support an answer.',
      pt: 'Um assistente privado precisa responder usando somente documentos locais aprovados. Construa o núcleo de recuperação, mostre as evidências usadas e se abstenha quando os documentos não sustentarem uma resposta.',
    },
    professionalContext: {
      en: 'A trustworthy RAG system is not merely a chat screen. It needs explicit ingestion, vectorization, retrieval, ranking, grounded output, citations, abstention and tests that expose unsupported answers.',
      pt: 'Um sistema RAG confiável não é apenas uma tela de chat. Ele precisa de ingestão explícita, vetorização, recuperação, ranqueamento, saída fundamentada, citações, abstenção e testes que exponham respostas sem suporte.',
    },
    estimatedMinutes: 300,
    skills: [
      { en: 'private document ingestion', pt: 'ingestão de documentos privados' },
      { en: 'token-based vectorization', pt: 'vetorização baseada em tokens' },
      { en: 'cosine similarity retrieval', pt: 'recuperação por similaridade de cosseno' },
      { en: 'grounded extractive answers', pt: 'respostas extrativas fundamentadas' },
      { en: 'citations and abstention', pt: 'citações e abstenção' },
      { en: 'offline-first AI architecture', pt: 'arquitetura de IA offline-first' },
    ],
    requirements: {
      en: [
        'Represent document chunks with an immutable dataclass',
        'Parse EMBED|token|x|y, CHUNK|source|id|text and QUERY|text records',
        'Tokenize text consistently before vectorization',
        'Build vectors only from explicitly known local embeddings',
        'Calculate cosine similarity safely',
        'Retrieve the best supported chunks with a minimum evidence threshold',
        'Print each retrieved citation and its score',
        'Create an answer only from a retrieved sentence',
        'Print all citations used by the answer',
        'Abstain when query terms are unknown or no chunk reaches the evidence threshold',
        'Do not call an external AI API',
      ],
      pt: [
        'Represente trechos de documentos com uma dataclass imutável',
        'Interprete registros EMBED|token|x|y, CHUNK|fonte|id|texto e QUERY|texto',
        'Tokenize os textos de forma consistente antes da vetorização',
        'Construa vetores somente com embeddings locais conhecidos',
        'Calcule similaridade de cosseno com segurança',
        'Recupere os melhores trechos acima de um limite mínimo de evidência',
        'Mostre cada citação recuperada e sua pontuação',
        'Crie uma resposta somente a partir de uma frase recuperada',
        'Mostre todas as citações usadas pela resposta',
        'Abstenha-se quando os termos da consulta forem desconhecidos ou não houver evidência suficiente',
        'Não chame API externa de IA',
      ],
    },
    inputContract: {
      en: 'Define local token vectors with EMBED|token|x|y, add chunks with CHUNK|source|id|text, provide one QUERY|text and finish with END.',
      pt: 'Defina vetores locais com EMBED|token|x|y, adicione trechos com CHUNK|fonte|id|texto, informe uma QUERY|texto e finalize com END.',
    },
    outputContract: {
      en: 'Supported queries print RETRIEVED=<source>#<id>|<score>, then ANSWER=<sentence> and CITATIONS=<source>#<id>. Unsupported queries print ABSTAIN=unknown_query_terms or ABSTAIN=no_relevant_evidence.',
      pt: 'Consultas sustentadas imprimem RETRIEVED=<fonte>#<id>|<pontuação>, depois ANSWER=<frase> e CITATIONS=<fonte>#<id>. Consultas sem suporte imprimem ABSTAIN=unknown_query_terms ou ABSTAIN=no_relevant_evidence.',
    },
    ruleContract: {
      en: 'Average known token vectors for the query and each chunk. Rank chunks by cosine similarity, keep at most two with score >= 0.45, answer with a sentence from the best chunk and cite every retrieved chunk. Never invent text that is absent from the evidence.',
      pt: 'Calcule a média dos vetores conhecidos da consulta e de cada trecho. Ordene por similaridade de cosseno, mantenha no máximo dois com pontuação >= 0,45, responda com uma frase do melhor trecho e cite todos os trechos recuperados. Nunca invente texto ausente das evidências.',
    },
    edgeCases: {
      en: 'Test unknown query terms, unrelated documents, malformed records, empty vectors, tied scores and chunks containing only unknown tokens.',
      pt: 'Teste termos desconhecidos na consulta, documentos não relacionados, registros malformados, vetores vazios, empates e trechos contendo apenas tokens desconhecidos.',
    },
    starterCode: {
      en: `# Final portfolio capstone: Private Local Document Copilot
from dataclasses import dataclass
import math
import re


@dataclass(frozen=True)
class Chunk:
    source: str
    chunk_id: str
    text: str


def tokenize(text: str) -> list[str]:
    # TODO: return normalized words using re.findall
    return []


def average_vector(text: str, embeddings: dict[str, tuple[float, float]]):
    # TODO: average only the vectors of known tokens
    # Return None when the text has no known token
    return None


def cosine_similarity(left: tuple[float, float], right: tuple[float, float]) -> float:
    # TODO: calculate dot product and vector norms with math.sqrt
    # Return 0.0 when one norm is zero
    return 0.0


def retrieve(
    query_text: str,
    chunks: list[Chunk],
    embeddings: dict[str, tuple[float, float]],
    top_k: int = 2,
    min_score: float = 0.45,
):
    # TODO: vectorize query and chunks
    # TODO: keep supported chunks, sort by score and citation
    return []


def grounded_answer(query_text: str, retrieved):
    # TODO: choose a sentence that exists in the best retrieved chunk
    # Never invent a sentence that is absent from the document
    return None


def main() -> None:
    embeddings: dict[str, tuple[float, float]] = {}
    chunks: list[Chunk] = []
    query_text = ""

    while True:
        line = input("Record: ").strip()
        if line.upper() == "END":
            break
        try:
            kind, payload = line.split("|", 1)
            kind = kind.upper()
            if kind == "EMBED":
                token, x, y = payload.split("|")
                embeddings[token.strip().lower()] = (float(x), float(y))
            elif kind == "CHUNK":
                source, chunk_id, chunk_text = payload.split("|", 2)
                chunks.append(Chunk(source.strip(), chunk_id.strip(), chunk_text.strip()))
            elif kind == "QUERY":
                query_text = payload.strip()
            else:
                raise ValueError
        except (ValueError, TypeError):
            print("INVALID_RECORD")

    query_vector = average_vector(query_text, embeddings)
    if query_vector is None:
        print("ABSTAIN=unknown_query_terms")
        return

    retrieved = retrieve(query_text, chunks, embeddings)
    if not retrieved:
        print("ABSTAIN=no_relevant_evidence")
        return

    for score, chunk in retrieved:
        print(f"RETRIEVED={chunk.source}#{chunk.chunk_id}|{score:.2f}")

    answer = grounded_answer(query_text, retrieved)
    if not answer:
        print("ABSTAIN=no_relevant_evidence")
        return

    print(f"ANSWER={answer}")
    citations = ",".join(f"{chunk.source}#{chunk.chunk_id}" for _, chunk in retrieved)
    print(f"CITATIONS={citations}")


if __name__ == "__main__":
    main()`,
      pt: `# Capstone final do portfólio: Copiloto Privado de Documentos Locais
from dataclasses import dataclass
import math
import re


@dataclass(frozen=True)
class Chunk:
    source: str
    chunk_id: str
    text: str


def tokenize(text: str) -> list[str]:
    # TODO: retorne palavras normalizadas usando re.findall
    return []


def average_vector(text: str, embeddings: dict[str, tuple[float, float]]):
    # TODO: calcule a média somente dos vetores de tokens conhecidos
    # Retorne None quando o texto não tiver token conhecido
    return None


def cosine_similarity(left: tuple[float, float], right: tuple[float, float]) -> float:
    # TODO: calcule produto escalar e normas com math.sqrt
    # Retorne 0.0 quando uma norma for zero
    return 0.0


def retrieve(
    query_text: str,
    chunks: list[Chunk],
    embeddings: dict[str, tuple[float, float]],
    top_k: int = 2,
    min_score: float = 0.45,
):
    # TODO: vetorize a consulta e os trechos
    # TODO: mantenha trechos sustentados e ordene por pontuação e citação
    return []


def grounded_answer(query_text: str, retrieved):
    # TODO: escolha uma frase que exista no melhor trecho recuperado
    # Nunca invente uma frase ausente do documento
    return None


def main() -> None:
    embeddings: dict[str, tuple[float, float]] = {}
    chunks: list[Chunk] = []
    query_text = ""

    while True:
        line = input("Registro: ").strip()
        if line.upper() == "END":
            break
        try:
            kind, payload = line.split("|", 1)
            kind = kind.upper()
            if kind == "EMBED":
                token, x, y = payload.split("|")
                embeddings[token.strip().lower()] = (float(x), float(y))
            elif kind == "CHUNK":
                source, chunk_id, chunk_text = payload.split("|", 2)
                chunks.append(Chunk(source.strip(), chunk_id.strip(), chunk_text.strip()))
            elif kind == "QUERY":
                query_text = payload.strip()
            else:
                raise ValueError
        except (ValueError, TypeError):
            print("INVALID_RECORD")

    query_vector = average_vector(query_text, embeddings)
    if query_vector is None:
        print("ABSTAIN=unknown_query_terms")
        return

    retrieved = retrieve(query_text, chunks, embeddings)
    if not retrieved:
        print("ABSTAIN=no_relevant_evidence")
        return

    for score, chunk in retrieved:
        print(f"RETRIEVED={chunk.source}#{chunk.chunk_id}|{score:.2f}")

    answer = grounded_answer(query_text, retrieved)
    if not answer:
        print("ABSTAIN=no_relevant_evidence")
        return

    print(f"ANSWER={answer}")
    citations = ",".join(f"{chunk.source}#{chunk.chunk_id}" for _, chunk in retrieved)
    print(f"CITATIONS={citations}")


if __name__ == "__main__":
    main()`,
    },
    tests: [
      {
        id: 'rag-grounded-answer',
        title: { en: 'Grounded answer with one strong citation', pt: 'Resposta fundamentada com uma citação forte' },
        inputs: [
          'EMBED|water|1|0',
          'EMBED|damage|0.9|0.1',
          'EMBED|fire|0|1',
          'EMBED|smoke|0.1|0.9',
          'CHUNK|policy.md|1|Water damage is covered after the deductible.',
          'CHUNK|policy.md|2|Fire and smoke require emergency reporting.',
          'QUERY|water damage',
          'END',
        ],
        expectedOutput: [
          'RETRIEVED=policy.md#1|1.00',
          'ANSWER=Water damage is covered after the deductible.',
          'CITATIONS=policy.md#1',
        ],
      },
      {
        id: 'rag-two-citations',
        title: { en: 'Two relevant chunks remain auditable', pt: 'Dois trechos relevantes permanecem auditáveis' },
        inputs: [
          'EMBED|invoice|1|0',
          'EMBED|payment|0.9|0.1',
          'EMBED|deadline|0.8|0.2',
          'EMBED|late|0.7|0.3',
          'EMBED|service|0.6|0.4',
          'EMBED|weather|0|1',
          'CHUNK|billing.md|1|Invoice payment deadline is thirty days.',
          'CHUNK|billing.md|2|Late payment may pause service.',
          'CHUNK|weather.md|1|Weather alerts are updated hourly.',
          'QUERY|payment deadline',
          'END',
        ],
        expectedOutput: [
          'RETRIEVED=billing.md#1|1.00',
          'RETRIEVED=billing.md#2|0.98',
          'ANSWER=Invoice payment deadline is thirty days.',
          'CITATIONS=billing.md#1,billing.md#2',
        ],
      },
      {
        id: 'rag-unknown-query',
        title: { en: 'Unknown query terms cause honest abstention', pt: 'Termos desconhecidos causam abstenção honesta' },
        inputs: [
          'EMBED|known|1|0',
          'CHUNK|notes.md|1|Known facts are local.',
          'QUERY|missing token',
          'END',
        ],
        expectedOutput: ['ABSTAIN=unknown_query_terms'],
      },
      {
        id: 'rag-no-evidence',
        title: { en: 'Unrelated evidence is rejected', pt: 'Evidência não relacionada é rejeitada' },
        inputs: [
          'EMBED|water|1|0',
          'EMBED|fire|0|1',
          'CHUNK|fire.md|1|Fire response starts immediately.',
          'QUERY|water',
          'END',
        ],
        expectedOutput: ['ABSTAIN=no_relevant_evidence'],
      },
    ],
    requiredNodes: ['ClassDef', 'FunctionDef', 'Try', 'While', 'For', 'If'],
    requiredImports: ['dataclasses', 'math', 're'],
    requiredFunctions: ['tokenize', 'average_vector', 'cosine_similarity', 'retrieve', 'grounded_answer', 'main'],
    requiredCalls: ['math.sqrt', 're.findall'],
    requireMainGuard: true,
    refactorGoal: {
      en: 'Improve one trustworthy-RAG boundary: chunk validation, retrieval scoring, citation formatting, abstention, or orchestration.',
      pt: 'Melhore uma fronteira de RAG confiável: validação de trechos, pontuação de busca, formatação de citações, abstenção ou orquestração.',
    },
    refactorEvidence: {
      en: 'Describe why the change makes answers easier to audit, modify the code, and keep grounded, multi-citation, unknown-query, and no-evidence scenarios green.',
      pt: 'Descreva por que a mudança deixa as respostas mais auditáveis, altere o código e mantenha verdes os cenários fundamentado, múltiplas citações, consulta desconhecida e ausência de evidência.',
    },
    refactorOptions: [
      { en: 'Keep ingestion, vectorization, retrieval and answer construction in separate functions.', pt: 'Mantenha ingestão, vetorização, recuperação e construção da resposta em funções separadas.' },
      { en: 'Explain the evidence threshold and make it configurable.', pt: 'Explique o limite de evidência e torne-o configurável.' },
      { en: 'Guarantee that every answer sentence exists in a retrieved chunk.', pt: 'Garanta que toda frase de resposta exista em um trecho recuperado.' },
      { en: 'Keep citations deterministic when scores are tied.', pt: 'Mantenha citações determinísticas quando houver empate.' },
      { en: 'Document that the browser project implements the RAG core, while a local model can be attached later.', pt: 'Documente que o projeto no navegador implementa o núcleo RAG e que um modelo local pode ser conectado depois.' },
      { en: 'Add a fixed evaluation set before changing embeddings, thresholds or ranking rules.', pt: 'Adicione um conjunto fixo de avaliação antes de alterar embeddings, limites ou regras de ranqueamento.' },
    ],
    accomplishment: [
      { en: 'ingest private local document chunks through an explicit contract', pt: 'ingerir trechos de documentos privados por um contrato explícito' },
      { en: 'vectorize queries and evidence without an external API', pt: 'vetorizar consultas e evidências sem API externa' },
      { en: 'retrieve and rank evidence with cosine similarity', pt: 'recuperar e ranquear evidências por similaridade de cosseno' },
      { en: 'produce grounded answers with visible citations', pt: 'produzir respostas fundamentadas com citações visíveis' },
      { en: 'abstain instead of hallucinating unsupported information', pt: 'abster-se em vez de inventar informação sem suporte' },
      { en: 'complete a portfolio that spans Python foundations through local AI', pt: 'concluir um portfólio que vai dos fundamentos de Python até IA local' },
    ],
  }


]

export function getMiniProject(projectId: string) {
  return MINI_PROJECTS.find(project => project.id === projectId)
}

export function getMiniProjectForPhase(phaseId: number) {
  return MINI_PROJECTS.find(project => project.milestonePhaseId === phaseId)
}
