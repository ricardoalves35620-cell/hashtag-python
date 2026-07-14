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
  refactorOptions: Bilingual[]
  accomplishment: Bilingual[]
}

export const MINI_PROJECTS: MiniProject[] = [
  {
    id: 'damage-estimate',
    milestonePhaseId: 4,
    icon: '🧾',
    title: { en: 'Damage Estimate', pt: 'Estimativa de Danos' },
    subtitle: { en: 'Turn raw input into a reliable calculation.', pt: 'Transforme entradas brutas em um cálculo confiável.' },
    scenario: {
      en: 'A field adjuster enters a damage estimate and a deductible. Build a small program that calculates and displays the estimated payout.',
      pt: 'Um regulador informa a estimativa do dano e a franquia. Construa um pequeno programa que calcule e mostre o pagamento estimado.',
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
      en: ['Ask for damage', 'Ask for deductible', 'Calculate damage minus deductible', 'Print Payout with two decimal places'],
      pt: ['Peça o valor do dano', 'Peça a franquia', 'Calcule dano menos franquia', 'Mostre Pagamento com duas casas decimais'],
    },
    inputContract: { en: 'Two numbers: damage and deductible.', pt: 'Dois números: dano e franquia.' },
    outputContract: { en: 'A line containing Payout and the calculated amount.', pt: 'Uma linha contendo Pagamento e o valor calculado.' },
    ruleContract: { en: 'payout = damage - deductible', pt: 'pagamento = dano - franquia' },
    edgeCases: { en: 'Use decimal values and verify that conversion happens before subtraction.', pt: 'Use valores decimais e confirme que a conversão acontece antes da subtração.' },
    starterCode: {
      en: `# Project: Damage Estimate\n# Build each step from the contract above.\n\ndamage = float(input("Damage: "))\ndeductible = float(input("Deductible: "))\n\n# TODO: calculate payout\npayout = 0\n\n# TODO: display the result with two decimal places\nprint(f"Payout: {payout:.2f}")`,
      pt: `# Projeto: Estimativa de Danos\n# Construa cada passo usando o contrato acima.\n\ndamage = float(input("Dano: "))\ndeductible = float(input("Franquia: "))\n\n# TODO: calcule o pagamento\npayout = 0\n\n# TODO: mostre o resultado com duas casas decimais\nprint(f"Pagamento: {payout:.2f}")`,
    },
    tests: [
      { id: 'estimate-standard', title: { en: 'Standard estimate', pt: 'Estimativa padrão' }, inputs: ['5000', '500'], expectedOutput: ['4500.00'] },
      { id: 'estimate-decimal', title: { en: 'Decimal estimate', pt: 'Estimativa decimal' }, inputs: ['2750.50', '200.25'], expectedOutput: ['2550.25'] },
    ],
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
    icon: '🔁',
    title: { en: 'Claim Queue Processor', pt: 'Processador de Fila de Sinistros' },
    subtitle: { en: 'Control repetition with explicit state and a stopping condition.', pt: 'Controle repetição com estado explícito e condição de parada.' },
    scenario: {
      en: 'A team receives a known number of claim estimates. Process every amount, then report how many were processed, the total, and the average.',
      pt: 'Uma equipe recebe uma quantidade conhecida de estimativas de sinistro. Processe cada valor e informe quantidade processada, total e média.',
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
      en: ['Ask how many claims will be processed', 'Use while', 'Read one amount per repetition', 'Update count and total', 'Print count, total, and average'],
      pt: ['Pergunte quantos sinistros serão processados', 'Use while', 'Leia um valor por repetição', 'Atualize quantidade e total', 'Mostre quantidade, total e média'],
    },
    inputContract: { en: 'First the number of claims, followed by one amount for each claim.', pt: 'Primeiro a quantidade de sinistros, seguida de um valor para cada sinistro.' },
    outputContract: { en: 'Processed, Total, and Average.', pt: 'Processados, Total e Média.' },
    ruleContract: { en: 'Repeat exactly the requested number of times and update the counter every time.', pt: 'Repita exatamente a quantidade solicitada e atualize o contador em toda repetição.' },
    edgeCases: { en: 'Avoid division by zero when the requested quantity is zero.', pt: 'Evite divisão por zero quando a quantidade solicitada for zero.' },
    starterCode: {
      en: `# Project: Claim Queue Processor\nquantity = int(input("How many claims? "))\nprocessed = 0\ntotal = 0.0\n\n# TODO: repeat until every claim has been processed\nwhile False:\n    amount = float(input("Claim amount: "))\n    # TODO: update total and processed\n\n# TODO: protect the average when quantity is zero\naverage = 0.0\n\nprint("Processed:", processed)\nprint(f"Total: {total:.2f}")\nprint(f"Average: {average:.2f}")`,
      pt: `# Projeto: Processador de Fila de Sinistros\nquantity = int(input("Quantos sinistros? "))\nprocessed = 0\ntotal = 0.0\n\n# TODO: repita até processar todos os sinistros\nwhile False:\n    amount = float(input("Valor do sinistro: "))\n    # TODO: atualize total e processados\n\n# TODO: proteja a média quando a quantidade for zero\naverage = 0.0\n\nprint("Processados:", processed)\nprint(f"Total: {total:.2f}")\nprint(f"Média: {average:.2f}")`,
    },
    tests: [
      { id: 'queue-three', title: { en: 'Three claims', pt: 'Três sinistros' }, inputs: ['3', '1200', '800', '2000'], expectedOutput: ['3', '4000.00', '1333.33'] },
      { id: 'queue-zero', title: { en: 'Empty queue', pt: 'Fila vazia' }, inputs: ['0'], expectedOutput: ['0', '0.00'] },
    ],
    requiredNodes: ['While'],
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
    icon: '📊',
    title: { en: 'Claims Portfolio Report', pt: 'Relatório de Carteira de Sinistros' },
    subtitle: { en: 'Transform structured data into a useful report.', pt: 'Transforme dados estruturados em um relatório útil.' },
    scenario: {
      en: 'A manager needs a report containing only approved claims, their client names, and the total approved amount.',
      pt: 'Um gestor precisa de um relatório contendo apenas sinistros aprovados, os nomes dos clientes e o valor total aprovado.',
    },
    professionalContext: {
      en: 'Real applications receive collections of records. Professional code first understands one record, then applies the same rule to the whole collection.',
      pt: 'Aplicações reais recebem coleções de registros. Código profissional primeiro entende um registro e depois aplica a mesma regra à coleção inteira.',
    },
    estimatedMinutes: 70,
    skills: [
      { en: 'list of dictionaries', pt: 'lista de dicionários' },
      { en: 'filtering', pt: 'filtragem' },
      { en: 'list comprehension', pt: 'compreensão de listas' },
      { en: 'aggregation', pt: 'agregação' },
    ],
    requirements: {
      en: ['Keep the provided records', 'Create approved_claims with a list comprehension', 'Create client_names', 'Calculate approved_total', 'Print count, clients, and total', 'Repeat the same rule for the provided no-approved edge dataset'],
      pt: ['Mantenha os registros fornecidos', 'Crie approved_claims com compreensão de lista', 'Crie client_names', 'Calcule approved_total', 'Mostre quantidade, clientes e total', 'Repita a mesma regra para o conjunto limite sem aprovados'],
    },
    inputContract: { en: 'A list where each dictionary follows the same record contract.', pt: 'Uma lista em que cada dicionário segue o mesmo contrato de registro.' },
    outputContract: { en: 'Approved count, client names, and approved total.', pt: 'Quantidade aprovada, nomes dos clientes e total aprovado.' },
    ruleContract: { en: 'Include only records whose status equals approved.', pt: 'Inclua somente registros cujo status seja approved.' },
    edgeCases: { en: 'The supplied edge dataset contains no approved record. It must produce count 0 and total 0 without special hard-coded output.', pt: 'O conjunto limite fornecido não contém registro aprovado. Ele deve produzir quantidade 0 e total 0 sem saída fixa especial.' },
    starterCode: {
      en: `# Project: Claims Portfolio Report
claims = [
    {"client": "Ana", "amount": 3200, "status": "approved"},
    {"client": "Bruno", "amount": 1800, "status": "pending"},
    {"client": "Carla", "amount": 5100, "status": "approved"},
    {"client": "Diego", "amount": 900, "status": "rejected"},
]

# TODO: filter approved records with a list comprehension
approved_claims = []

# TODO: derive the client-name list
client_names = []

# TODO: calculate the total approved amount
approved_total = 0

print("Approved:", len(approved_claims))
print("Clients:", ", ".join(client_names))
print("Total:", approved_total)

# Edge evidence: apply the same rule when nothing is approved.
edge_claims = [
    {"client": "Eva", "amount": 1200, "status": "pending"},
    {"client": "Felipe", "amount": 900, "status": "rejected"},
]
edge_approved = []  # TODO: use the same list-comprehension rule
edge_total = 0      # TODO: aggregate the approved edge records
print(f"EDGE_APPROVED={len(edge_approved)}")
print(f"EDGE_TOTAL={edge_total}")`,
      pt: `# Projeto: Relatório de Carteira de Sinistros
claims = [
    {"client": "Ana", "amount": 3200, "status": "approved"},
    {"client": "Bruno", "amount": 1800, "status": "pending"},
    {"client": "Carla", "amount": 5100, "status": "approved"},
    {"client": "Diego", "amount": 900, "status": "rejected"},
]

# TODO: filtre registros aprovados com compreensão de lista
approved_claims = []

# TODO: derive a lista de nomes dos clientes
client_names = []

# TODO: calcule o valor total aprovado
approved_total = 0

print("Aprovados:", len(approved_claims))
print("Clientes:", ", ".join(client_names))
print("Total:", approved_total)

# Evidência limite: aplique a mesma regra quando não houver aprovados.
edge_claims = [
    {"client": "Eva", "amount": 1200, "status": "pending"},
    {"client": "Felipe", "amount": 900, "status": "rejected"},
]
edge_approved = []  # TODO: use a mesma regra de compreensão de lista
edge_total = 0      # TODO: agregue os registros aprovados do caso limite
print(f"EDGE_APPROVED={len(edge_approved)}")
print(f"EDGE_TOTAL={edge_total}")`,
    },
    tests: [
      { id: 'portfolio-authored', title: { en: 'Provided portfolio', pt: 'Carteira fornecida' }, inputs: [], expectedOutput: ['2', 'Ana', 'Carla', '8300'] },
      { id: 'portfolio-empty', title: { en: 'No-approved edge dataset', pt: 'Conjunto limite sem aprovados' }, inputs: [], expectedOutput: ['EDGE_APPROVED=0', 'EDGE_TOTAL=0'] },
    ],
    requiredNodes: ['ListComp'],
    refactorOptions: [
      { en: 'Use the record keys consistently.', pt: 'Use as chaves do registro de forma consistente.' },
      { en: 'Separate filtering, transformation, and aggregation.', pt: 'Separe filtragem, transformação e agregação.' },
      { en: 'Avoid repeating the same filter rule.', pt: 'Evite repetir a mesma regra de filtragem.' },
      { en: 'Keep the final report readable.', pt: 'Mantenha o relatório final legível.' },
    ],
    accomplishment: [
      { en: 'read a collection of structured records', pt: 'ler uma coleção de registros estruturados' },
      { en: 'filter and transform data intentionally', pt: 'filtrar e transformar dados intencionalmente' },
      { en: 'produce a report from business rules', pt: 'produzir um relatório a partir de regras de negócio' },
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
    ],
    requiredNodes: ['FunctionDef', 'While', 'Try'],
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
  }
]

export function getMiniProject(projectId: string) {
  return MINI_PROJECTS.find(project => project.id === projectId)
}

export function getMiniProjectForPhase(phaseId: number) {
  return MINI_PROJECTS.find(project => project.milestonePhaseId === phaseId)
}
