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
      en: ['Keep the provided records', 'Create approved_claims with a list comprehension', 'Create client_names', 'Calculate approved_total', 'Print count, clients, and total'],
      pt: ['Mantenha os registros fornecidos', 'Crie approved_claims com compreensão de lista', 'Crie client_names', 'Calcule approved_total', 'Mostre quantidade, clientes e total'],
    },
    inputContract: { en: 'A list where each dictionary follows the same record contract.', pt: 'Uma lista em que cada dicionário segue o mesmo contrato de registro.' },
    outputContract: { en: 'Approved count, client names, and approved total.', pt: 'Quantidade aprovada, nomes dos clientes e total aprovado.' },
    ruleContract: { en: 'Include only records whose status equals approved.', pt: 'Inclua somente registros cujo status seja approved.' },
    edgeCases: { en: 'The result must still work when no record is approved.', pt: 'O resultado precisa funcionar mesmo quando nenhum registro for aprovado.' },
    starterCode: {
      en: `# Project: Claims Portfolio Report\nclaims = [\n    {"client": "Ana", "amount": 3200, "status": "approved"},\n    {"client": "Bruno", "amount": 1800, "status": "pending"},\n    {"client": "Carla", "amount": 5100, "status": "approved"},\n    {"client": "Diego", "amount": 900, "status": "rejected"},\n]\n\n# TODO: filter approved records with a list comprehension\napproved_claims = []\n\n# TODO: derive the client-name list\nclient_names = []\n\n# TODO: calculate the total approved amount\napproved_total = 0\n\nprint("Approved:", len(approved_claims))\nprint("Clients:", ", ".join(client_names))\nprint("Total:", approved_total)`,
      pt: `# Projeto: Relatório de Carteira de Sinistros\nclaims = [\n    {"client": "Ana", "amount": 3200, "status": "approved"},\n    {"client": "Bruno", "amount": 1800, "status": "pending"},\n    {"client": "Carla", "amount": 5100, "status": "approved"},\n    {"client": "Diego", "amount": 900, "status": "rejected"},\n]\n\n# TODO: filtre os registros aprovados com compreensão de lista\napproved_claims = []\n\n# TODO: derive a lista de nomes dos clientes\nclient_names = []\n\n# TODO: calcule o valor total aprovado\napproved_total = 0\n\nprint("Aprovados:", len(approved_claims))\nprint("Clientes:", ", ".join(client_names))\nprint("Total:", approved_total)`,
    },
    tests: [
      { id: 'portfolio-authored', title: { en: 'Provided portfolio', pt: 'Carteira fornecida' }, inputs: [], expectedOutput: ['2', 'Ana', 'Carla', '8300'] },
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
]

export function getMiniProject(projectId: string) {
  return MINI_PROJECTS.find(project => project.id === projectId)
}

export function getMiniProjectForPhase(phaseId: number) {
  return MINI_PROJECTS.find(project => project.milestonePhaseId === phaseId)
}
