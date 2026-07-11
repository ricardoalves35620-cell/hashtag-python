import type { Phase } from '../types'

// BLOCK 3: DATA STRUCTURES (Phases 9-12)
export const phase9: Phase = {
  id: 9,
  title: { en: 'Nested Lists', pt: 'Listas Aninhadas' },
  description: { en: 'Lists inside lists. Store complex data.', pt: 'Listas dentro de listas. Guarde dados complexos.' },
  icon: '📚',
  libraries: [],
  lesson: {
    title: { en: 'Nested Data Structures', pt: 'Estruturas Aninhadas' },
    blocks: [
      { type: 'heading', content: { en: 'Lists of Lists', pt: 'Listas de Listas' } },
      { type: 'text', content: { en: 'Combine lists to organize complex data. Example: damage records with type and amount.', pt: 'Combine listas para organizar dados complexos. Exemplo: registros de danos com tipo e valor.' } },
      { type: 'code', code: `damages = [
  ["bumper", 1200],
  ["hood", 2000],
  ["headlight", 800]
]

for damage in damages:
  print(damage[0], ":", damage[1])` }
    ]
  },
  exercises: [
    { id: 'ex9_1', title: { en: 'Store Damage Data', pt: 'Guardar Dados de Dano' }, description: { en: 'Create nested list of damage items', pt: 'Crie lista aninhada de itens de dano' }, starterCode: `damages = [["bumper", 1200], ["hood", 2000]]\nfor item in damages:\n  print(item[0], ":", item[1])`, hints: [{ en: 'Access with [row][column]', pt: 'Acesse com [linha][coluna]' }] },
    { id: 'ex9_2', title: { en: 'Sum Nested Data', pt: 'Somar Dados Aninhados' }, description: { en: 'Calculate total from nested list', pt: 'Calcule total de lista aninhada' }, starterCode: `damages = [["bumper", 1200], ["hood", 2000], ["light", 800]]\ntotal = 0\nfor damage in damages:\n  total += damage[1]\nprint("Total:", total)`, hints: [{ en: 'Access second element with [1]', pt: 'Acesse segundo elemento com [1]' }] }
  ],
  quiz: [
    { id: 'q9_1', question: { en: 'Access second item of first list?', pt: 'Acesse segundo item da primeira lista?' }, options: [{ en: 'list[0][1]', pt: 'list[0][1]' }, { en: 'list[1][0]', pt: 'list[1][0]' }, { en: 'list[0,1]', pt: 'list[0,1]' }, { en: 'list[1]', pt: 'list[1]' }], correctIndex: 0, explanation: { en: '[0] gets first list, [1] gets second item', pt: '[0] pega primeira lista, [1] pega segundo item' } }
  ],
  exam: {
    title: { en: 'Nested Damages', pt: 'Danos Aninhados' },
    scenario: { en: `Store and sum damage items from nested list.`, pt: `Guarde e some itens de dano de lista aninhada.` },
    requirements: { en: ['Create nested list', 'Loop through', 'Sum values'], pt: ['Crie lista aninhada', 'Loop através', 'Some valores'] },
    starterCode: `damages = [["bumper", 1200], ["hood", 2000], ["light", 800]]\ntotal = 0\nfor d in damages:\n  total += d[1]\nprint("Total:", total)`,
    testCases: [
      { id: 'tc9_1', description: { en: 'Sums to 4000', pt: 'Soma para 4000' }, inputs: [], checks: [{ type: 'contains', value: '4000' }], points: 100 }
    ]
  }
}

export const phase10: Phase = {
  id: 10,
  title: { en: 'Dictionaries', pt: 'Dicionários' },
  description: { en: 'Key-value pairs. Named data access.', pt: 'Pares chave-valor. Acesso de dados nomeado.' },
  icon: '🗝️',
  libraries: [],
  lesson: {
    title: { en: 'Dictionaries', pt: 'Dicionários' },
    blocks: [
      { type: 'code', code: `claim = {
  "number": 2501,
  "type": "collision",
  "damage": 5230
}

print(claim["number"])
print(claim["type"])` }
    ]
  },
  exercises: [
    { id: 'ex10_1', title: { en: 'Create Dict', pt: 'Criar Dicionário' }, description: { en: 'Store claim data in dict', pt: 'Guarde dados de sinistro em dicionário' }, starterCode: `claim = {"id": 2501, "type": "collision", "damage": 5230}\nprint(claim["id"])\nprint(claim["type"])`, hints: [{ en: 'Use {} for dict, [] to access', pt: 'Use {} para dict, [] para acessar' }] }
  ],
  quiz: [
    { id: 'q10_1', question: { en: 'Dict access syntax?', pt: 'Sintaxe de acesso de dict?' }, options: [{ en: 'dict["key"]', pt: 'dict["key"]' }, { en: 'dict[key]', pt: 'dict[key]' }, { en: 'dict.key', pt: 'dict.key' }, { en: 'dict(key)', pt: 'dict(key)' }], correctIndex: 0, explanation: { en: 'Keys are strings in quotes', pt: 'Chaves são strings entre aspas' } }
  ],
  exam: {
    title: { en: 'Claim Dict', pt: 'Dicionário de Sinistro' },
    scenario: { en: `Create and access claim dictionary.`, pt: `Crie e acesse dicionário de sinistro.` },
    requirements: { en: ['Create dict', 'Access values', 'Print'], pt: ['Crie dict', 'Acesse valores', 'Imprima'] },
    starterCode: `claim = {"id": 2501, "type": "collision", "damage": 5230, "deductible": 250}\npayout = claim["damage"] - claim["deductible"]\nprint("Payout:", payout)`,
    testCases: [
      { id: 'tc10_1', description: { en: 'Calculates payout', pt: 'Calcula pagamento' }, inputs: [], checks: [{ type: 'contains', value: '4980' }], points: 100 }
    ]
  }
}

export const phase11: Phase = {
  id: 11,
  title: { en: 'List of Dicts', pt: 'Lista de Dicionários' },
  description: { en: 'Combine lists and dicts for rich data.', pt: 'Combine listas e dicts para dados ricos.' },
  icon: '🎯',
  libraries: [],
  lesson: {
    title: { en: 'Complex Data Structures', pt: 'Estruturas de Dados Complexas' },
    blocks: [
      { type: 'code', code: `claims = [
  {"id": 2501, "damage": 5230},
  {"id": 2502, "damage": 1200},
  {"id": 2503, "damage": 8500}
]

for claim in claims:
  print(claim["id"], ":", claim["damage"])` }
    ]
  },
  exercises: [
    { id: 'ex11_1', title: { en: 'List of Dicts', pt: 'Lista de Dicts' }, description: { en: 'Create and loop', pt: 'Crie e faça loop' }, starterCode: `claims = [{"id": 1, "damage": 1000}, {"id": 2, "damage": 2000}]\nfor c in claims:\n  print(c["id"], ":", c["damage"])`, hints: [{ en: 'Dict in a list', pt: 'Dict em uma lista' }] }
  ],
  quiz: [],
  exam: {
    title: { en: 'Multi Claims', pt: 'Múltiplos Sinistros' },
    scenario: { en: `Store multiple claims in list of dicts.`, pt: `Guarde múltiplos sinistros em lista de dicts.` },
    requirements: { en: ['List of dicts', 'Loop', 'Sum damage'], pt: ['Lista de dicts', 'Loop', 'Some danos'] },
    starterCode: `claims = [{"id": 1, "damage": 1000}, {"id": 2, "damage": 2000}]\ntotal = 0\nfor c in claims:\n  total += c["damage"]\nprint("Total:", total)`,
    testCases: [
      { id: 'tc11_1', description: { en: 'Sums damages', pt: 'Soma danos' }, inputs: [], checks: [{ type: 'contains', value: '3000' }], points: 100 }
    ]
  }
}

export const phase12: Phase = {
  id: 12,
  title: { en: 'List Comprehension', pt: 'Compreensão de Listas' },
  description: { en: 'Transform data elegantly. Pythonic way.', pt: 'Transforme dados elegantemente. Forma Pythônica.' },
  icon: '✨',
  libraries: [],
  lesson: { title: { en: 'Comprehensions', pt: 'Compreensões' }, blocks: [{ type: 'code', code: `numbers = [1, 2, 3, 4, 5]\ndoubled = [x * 2 for x in numbers]\nprint(doubled)  # [2, 4, 6, 8, 10]` }] },
  exercises: [
    { id: 'ex12_1', title: { en: 'Double Numbers', pt: 'Dobrar Números' }, description: { en: 'Use comprehension', pt: 'Use compreensão' }, starterCode: `nums = [1, 2, 3]\ndoubled = [x * 2 for x in nums]\nprint(doubled)`, hints: [{ en: '[expr for x in list]', pt: '[expr for x in list]' }] }
  ],
  quiz: [],
  exam: {
    title: { en: 'Filter & Transform', pt: 'Filtrar e Transformar' },
    scenario: { en: `Apply discount to damage amounts.`, pt: `Aplique desconto aos valores de dano.` },
    requirements: { en: ['Create list', 'Use comprehension', 'Calculate'], pt: ['Crie lista', 'Use compreensão', 'Calcule'] },
    starterCode: `damages = [1000, 2000, 500]\npayouts = [d - 250 for d in damages]\nprint(payouts)`,
    testCases: [
      { id: 'tc12_1', description: { en: 'Applies deductible', pt: 'Aplica franquia' }, inputs: [], checks: [{ type: 'contains', value: '750' }], points: 100 }
    ]
  }
}

// BLOCK 4: FUNCTIONS (Phases 13-16)
export const phase13: Phase = {
  id: 13,
  title: { en: 'Creating Functions', pt: 'Criando Funções' },
  description: { en: 'Reusable code blocks. DRY principle.', pt: 'Blocos de código reutilizáveis. Princípio DRY.' },
  icon: '🔧',
  libraries: [],
  lesson: { title: { en: 'Functions', pt: 'Funções' }, blocks: [{ type: 'code', code: `def calculate_payout(damage, deductible):\n  return damage - deductible\n\nresult = calculate_payout(5000, 250)\nprint(result)` }] },
  exercises: [
    { id: 'ex13_1', title: { en: 'Simple Function', pt: 'Função Simples' }, description: { en: 'Create and call', pt: 'Crie e chame' }, starterCode: `def greet(name):\n  print("Hello, " + name)\n\ngreet("Alice")\ngreet("Bob")`, hints: [{ en: 'def defines function', pt: 'def define função' }] }
  ],
  quiz: [],
  exam: { title: { en: 'Payout Function', pt: 'Função de Pagamento' }, scenario: { en: `Create function to calculate payout.`, pt: `Crie função para calcular pagamento.` }, requirements: { en: ['Define function', 'Take parameters', 'Return result', 'Call it'], pt: ['Define função', 'Pegue parâmetros', 'Retorne resultado', 'Chame-a'] }, starterCode: `def payout(damage, deductible):\n  return damage - deductible\n\nprint(payout(5000, 250))`, testCases: [{ id: 'tc13_1', description: { en: 'Function works', pt: 'Função funciona' }, inputs: [], checks: [{ type: 'contains', value: '4750' }], points: 100 }] }
}

export const phase14: Phase = {
  id: 14,
  title: { en: 'Function Parameters', pt: 'Parâmetros de Função' },
  description: { en: 'Default values, named arguments.', pt: 'Valores padrão, argumentos nomeados.' },
  icon: '⚙️',
  libraries: [],
  lesson: { title: { en: 'Advanced Parameters', pt: 'Parâmetros Avançados' }, blocks: [{ type: 'code', code: `def payout(damage, deductible=250):\n  return damage - deductible\n\nprint(payout(5000))        # Uses default 250\nprint(payout(5000, 100))   # Uses 100` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Default Payout', pt: 'Pagamento Padrão' }, scenario: { en: `Function with default deductible.`, pt: `Função com franquia padrão.` }, requirements: { en: ['Default parameter', 'Works with and without'], pt: ['Parâmetro padrão', 'Funciona com e sem'] }, starterCode: `def payout(damage, deductible=250):\n  return damage - deductible\n\nprint(payout(5000))\nprint(payout(3000, 100))`, testCases: [{ id: 'tc14_1', description: { en: 'Uses defaults', pt: 'Usa padrões' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase15: Phase = {
  id: 15,
  title: { en: 'Docstrings', pt: 'Docstrings' },
  description: { en: 'Document your functions. Help others.', pt: 'Documente suas funções. Ajude outros.' },
  icon: '📖',
  libraries: [],
  lesson: { title: { en: 'Function Documentation', pt: 'Documentação de Função' }, blocks: [{ type: 'code', code: `def calculate_payout(damage, deductible):\n  \"\"\"Calculate insurance payout.\n  Args: damage (int), deductible (int)\n  Returns: int - amount company pays\"\"\"\n  return damage - deductible` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Documented Function', pt: 'Função Documentada' }, scenario: { en: `Add docstring to function.`, pt: `Adicione docstring à função.` }, requirements: { en: ['Function', 'Docstring'], pt: ['Função', 'Docstring'] }, starterCode: `def calculate_payout(damage, deductible):\n  \"\"\"Your docstring here.\"\"\"\n  return damage - deductible\n\nprint(calculate_payout(5000, 250))`, testCases: [{ id: 'tc15_1', description: { en: 'Has docstring', pt: 'Tem docstring' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase16: Phase = {
  id: 16,
  title: { en: 'Scope', pt: 'Escopo' },
  description: { en: 'Local vs global variables.', pt: 'Variáveis locais vs globais.' },
  icon: '📍',
  libraries: [],
  lesson: { title: { en: 'Variable Scope', pt: 'Escopo de Variável' }, blocks: [{ type: 'code', code: `total = 0  # Global\n\ndef add(amount):\n  global total\n  total += amount\n\nadd(100)\nprint(total)  # 100` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Scope Practice', pt: 'Prática de Escopo' }, scenario: { en: `Understand local and global.`, pt: `Entenda local e global.` }, requirements: { en: ['Local variables', 'Global if needed'], pt: ['Variáveis locais', 'Global se necessário'] }, starterCode: `total = 0\n\ndef add(x):\n  global total\n  total += x\n\nadd(50)\nprint(total)`, testCases: [{ id: 'tc16_1', description: { en: 'Scope works', pt: 'Escopo funciona' }, inputs: [], checks: [{ type: 'contains', value: '50' }], points: 100 }] }
}

// BLOCK 5: I/O & LIBS (Phases 17-23)
export const phase17: Phase = {
  id: 17,
  title: { en: 'Reading Files', pt: 'Lendo Arquivos' },
  description: { en: 'Load data from .txt files.', pt: 'Carregue dados de arquivos .txt.' },
  icon: '📄',
  libraries: [],
  lesson: { title: { en: 'File I/O', pt: 'I/O de Arquivo' }, blocks: [{ type: 'code', code: `with open("data.txt", "r") as f:\n  lines = f.readlines()\n  for line in lines:\n    print(line)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Read File', pt: 'Ler Arquivo' }, scenario: { en: `Read and process file lines.`, pt: `Leia e processe linhas de arquivo.` }, requirements: { en: ['Open file', 'Read lines', 'Process'], pt: ['Abra arquivo', 'Leia linhas', 'Processe'] }, starterCode: `with open("claims.txt", "r") as f:\n  for line in f:\n    print(line)`, testCases: [{ id: 'tc17_1', description: { en: 'Reads file', pt: 'Lê arquivo' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase18: Phase = {
  id: 18,
  title: { en: 'Writing Files', pt: 'Escrevendo Arquivos' },
  description: { en: 'Save data to files. Persistence.', pt: 'Salve dados em arquivos. Persistência.' },
  icon: '💾',
  libraries: [],
  lesson: { title: { en: 'File Writing', pt: 'Escrita de Arquivo' }, blocks: [{ type: 'code', code: `with open("report.txt", "w") as f:\n  f.write("Claim #2501\\n")\n  f.write("Damage: $5,000\\n")` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Save Report', pt: 'Salvar Relatório' }, scenario: { en: `Write data to file.`, pt: `Escreva dados em arquivo.` }, requirements: { en: ['Open for writing', 'Write lines', 'Close'], pt: ['Abra para escrita', 'Escreva linhas', 'Feche'] }, starterCode: `with open("output.txt", "w") as f:\n  f.write("Line 1\\n")\n  f.write("Line 2\\n")`, testCases: [{ id: 'tc18_1', description: { en: 'Writes file', pt: 'Escreve arquivo' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase19: Phase = {
  id: 19,
  title: { en: 'JSON Data', pt: 'Dados JSON' },
  description: { en: 'Read/write JSON. Structured data.', pt: 'Leia/escreva JSON. Dados estruturados.' },
  icon: '📊',
  libraries: ['json'],
  lesson: { title: { en: 'JSON Format', pt: 'Formato JSON' }, blocks: [{ type: 'code', code: `import json\n\ndata = {"id": 2501, "damage": 5000}\njson_str = json.dumps(data)\nprint(json_str)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'JSON I/O', pt: 'I/O JSON' }, scenario: { en: `Read/write JSON data.`, pt: `Leia/escreva dados JSON.` }, requirements: { en: ['Import json', 'dumps/loads', 'File ops'], pt: ['Importe json', 'dumps/loads', 'Operações de arquivo'] }, starterCode: `import json\n\ndata = {"id": 1, "name": "Alice"}\nwith open("data.json", "w") as f:\n  json.dump(data, f)`, testCases: [{ id: 'tc19_1', description: { en: 'JSON works', pt: 'JSON funciona' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase20: Phase = {
  id: 20,
  title: { en: 'DateTime', pt: 'DateTime' },
  description: { en: 'Work with dates and times.', pt: 'Trabalhe com datas e horas.' },
  icon: '🕐',
  libraries: ['datetime'],
  lesson: { title: { en: 'Date & Time', pt: 'Data e Hora' }, blocks: [{ type: 'code', code: `from datetime import datetime\n\nnow = datetime.now()\nprint(now)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Date Calc', pt: 'Cálculo de Data' }, scenario: { en: `Calculate days between dates.`, pt: `Calcule dias entre datas.` }, requirements: { en: ['Import datetime', 'Create dates', 'Calculate diff'], pt: ['Importe datetime', 'Crie datas', 'Calcule diff'] }, starterCode: `from datetime import datetime\n\ndate1 = datetime(2026, 1, 1)\ndate2 = datetime(2026, 7, 13)\ndiff = date2 - date1\nprint(diff.days)`, testCases: [{ id: 'tc20_1', description: { en: 'Calculates days', pt: 'Calcula dias' }, inputs: [], checks: [{ type: 'contains', value: '194' }], points: 100 }] }
}

export const phase21: Phase = {
  id: 21,
  title: { en: 'Random', pt: 'Aleatório' },
  description: { en: 'Generate random values. Simulations.', pt: 'Gere valores aleatórios. Simulações.' },
  icon: '🎲',
  libraries: ['random'],
  lesson: { title: { en: 'Random Module', pt: 'Módulo Random' }, blocks: [{ type: 'code', code: `import random\n\nnum = random.randint(1, 100)\nprint(num)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Random Sim', pt: 'Simulação Aleatória' }, scenario: { en: `Simulate random claim selection.`, pt: `Simule seleção aleatória de sinistro.` }, requirements: { en: ['Import random', 'Generate values', 'Use in logic'], pt: ['Importe random', 'Gere valores', 'Use em lógica'] }, starterCode: `import random\n\nclients = ["Alice", "Bob", "Diana"]\nselected = random.choice(clients)\nprint(selected)`, testCases: [{ id: 'tc21_1', description: { en: 'Chooses randomly', pt: 'Escolhe aleatoriamente' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase22: Phase = {
  id: 22,
  title: { en: 'Math Lib', pt: 'Biblioteca Math' },
  description: { en: 'Advanced math functions.', pt: 'Funções de matemática avançada.' },
  icon: '✖️',
  libraries: ['math'],
  lesson: { title: { en: 'Math Functions', pt: 'Funções Matemáticas' }, blocks: [{ type: 'code', code: `import math\n\nprint(math.sqrt(16))   # 4\nprint(math.ceil(4.2))  # 5\nprint(math.floor(4.8)) # 4` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Math Ops', pt: 'Operações Math' }, scenario: { en: `Use math functions in calculations.`, pt: `Use funções de math em cálculos.` }, requirements: { en: ['Import math', 'Use functions', 'Calculate'], pt: ['Importe math', 'Use funções', 'Calcule'] }, starterCode: `import math\n\narea = math.sqrt(100)\nprint(area)`, testCases: [{ id: 'tc22_1', description: { en: 'Math works', pt: 'Math funciona' }, inputs: [], checks: [{ type: 'contains', value: '10' }], points: 100 }] }
}

export const phase23: Phase = {
  id: 23,
  title: { en: 'Error Handling', pt: 'Tratamento de Erro' },
  description: { en: 'Try-except blocks. Graceful failures.', pt: 'Blocos try-except. Falhas graciosas.' },
  icon: '🛡️',
  libraries: [],
  lesson: { title: { en: 'Exception Handling', pt: 'Tratamento de Exceção' }, blocks: [{ type: 'code', code: `try:\n  num = int(input("Number: "))\nexcept ValueError:\n  print("Invalid input")` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Safe Input', pt: 'Entrada Segura' }, scenario: { en: `Handle invalid input safely.`, pt: `Trate entrada inválida com segurança.` }, requirements: { en: ['Try-except block', 'Catch errors', 'Recover gracefully'], pt: ['Bloco try-except', 'Capture erros', 'Recupere graciosamente'] }, starterCode: `try:\n  damage = int(input("Damage: "))\n  print("Damage:", damage)\nexcept ValueError:\n  print("Please enter a number")`, testCases: [{ id: 'tc23_1', description: { en: 'Handles errors', pt: 'Trata erros' }, inputs: ['abc'], inputMap: { 'damage': 'abc' }, checks: [{ type: 'contains', value: 'number' }], points: 100 }] }
}

// BLOCK 6: PROJECTS (Phases 24-27)
export const phase24: Phase = {
  id: 24,
  title: { en: 'Project: Calculator', pt: 'Projeto: Calculadora' },
  description: { en: 'Integrated project. Real-world app.', pt: 'Projeto integrado. Aplicação real.' },
  icon: '🧮',
  libraries: [],
  lesson: { title: { en: 'Calculator Project', pt: 'Projeto Calculadora' }, blocks: [{ type: 'text', content: { en: 'Build a damage calculator for insurance claims', pt: 'Crie uma calculadora de dano para sinistros de seguros' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Damage Calculator', pt: 'Calculadora de Dano' }, scenario: { en: `Calculate payout from damages and deductible.`, pt: `Calcule pagamento de danos e franquia.` }, requirements: { en: ['Functions', 'Input/output', 'Math', 'Error handling'], pt: ['Funções', 'Entrada/saída', 'Matemática', 'Tratamento de erro'] }, starterCode: `def calculate_payout(damage, deductible):\n  return damage - deductible\n\nprint("Insurance Calculator")\ndamage = int(input("Damage ($): "))\npayout = calculate_payout(damage, 250)\nprint("Payout: $", payout)`, testCases: [{ id: 'tc24_1', description: { en: 'Full project works', pt: 'Projeto completo funciona' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase25: Phase = {
  id: 25,
  title: { en: 'Project: CRUD', pt: 'Projeto: CRUD' },
  description: { en: 'Create, Read, Update, Delete data.', pt: 'Criar, Ler, Atualizar, Deletar dados.' },
  icon: '📋',
  libraries: [],
  lesson: { title: { en: 'CRUD Operations', pt: 'Operações CRUD' }, blocks: [{ type: 'text', content: { en: 'Build a claims manager', pt: 'Crie um gerenciador de sinistros' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Claims Manager', pt: 'Gerenciador de Sinistros' }, scenario: { en: `Manage list of claims with add, view, update.`, pt: `Gerencie lista de sinistros com adicionar, visualizar, atualizar.` }, requirements: { en: ['List operations', 'Functions', 'User interface'], pt: ['Operações de lista', 'Funções', 'Interface do usuário'] }, starterCode: `claims = []\n\ndef add_claim(claim_id, damage):\n  claims.append({"id": claim_id, "damage": damage})\n\nadd_claim(2501, 5000)\nprint(claims)`, testCases: [{ id: 'tc25_1', description: { en: 'CRUD works', pt: 'CRUD funciona' }, inputs: [], checks: [{ type: 'contains', value: '2501' }], points: 100 }] }
}

export const phase26: Phase = {
  id: 26,
  title: { en: 'Project: Data Analysis', pt: 'Projeto: Análise de Dados' },
  description: { en: 'Read, analyze, report on data.', pt: 'Leia, analise, relate sobre dados.' },
  icon: '📈',
  libraries: [],
  lesson: { title: { en: 'Data Analysis', pt: 'Análise de Dados' }, blocks: [{ type: 'text', content: { en: 'Analyze claims data for insights', pt: 'Analise dados de sinistros para insights' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Analysis Report', pt: 'Relatório de Análise' }, scenario: { en: `Generate statistics from claims data.`, pt: `Gere estatísticas de dados de sinistros.` }, requirements: { en: ['Data loading', 'Calculations', 'Reporting'], pt: ['Carregamento de dados', 'Cálculos', 'Relatório'] }, starterCode: `damages = [1000, 2500, 5000, 3000, 1500]\naverage = sum(damages) / len(damages)\nmax_damage = max(damages)\nmin_damage = min(damages)\nprint("Average:", average, "Max:", max_damage, "Min:", min_damage)`, testCases: [{ id: 'tc26_1', description: { en: 'Analysis works', pt: 'Análise funciona' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase27: Phase = {
  id: 27,
  title: { en: 'Capstone: Full System', pt: 'Capstone: Sistema Completo' },
  description: { en: 'Integrate everything. Final project.', pt: 'Integre tudo. Projeto final.' },
  icon: '🏆',
  libraries: [],
  lesson: { title: { en: 'System Integration', pt: 'Integração de Sistema' }, blocks: [{ type: 'text', content: { en: 'Build a complete claims processing system', pt: 'Crie um sistema completo de processamento de sinistros' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Full System', pt: 'Sistema Completo' }, scenario: { en: `Create interactive menu-driven claims system.`, pt: `Crie sistema de sinistros acionado por menu interativo.` }, requirements: { en: ['Menu loop', 'Full CRUD', 'File I/O', 'Error handling', 'Functions'], pt: ['Loop de menu', 'CRUD completo', 'I/O de arquivo', 'Tratamento de erro', 'Funções'] }, starterCode: `# Claims System\ndef show_menu():\n  print("1. Add Claim")\n  print("2. View Claims")\n  print("3. Exit")\n\nwhile True:\n  show_menu()\n  choice = input("Choice: ")\n  if choice == "3":\n    break`, testCases: [{ id: 'tc27_1', description: { en: 'System runs', pt: 'Sistema roda' }, inputs: ['3'], inputMap: { 'choice': '3' }, checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

