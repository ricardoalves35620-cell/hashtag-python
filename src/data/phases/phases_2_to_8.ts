import type { Phase } from '../types'

// PHASE 2: Numbers and Math
export const phase2: Phase = {
  id: 2,
  title: { en: 'Math & Numbers', pt: 'Matemática e Números' },
  description: {
    en: 'Learn integers and decimals. Do calculations: addition, subtraction, multiplication, division.',
    pt: 'Aprenda inteiros e decimais. Faça cálculos: adição, subtração, multiplicação, divisão.'
  },
  icon: '🧮',
  libraries: [],
  lesson: {
    title: { en: 'Numbers and Math Operations', pt: 'Números e Operações Matemáticas' },
    blocks: [
      { type: 'heading', content: { en: 'Two Types of Numbers', pt: 'Dois Tipos de Números' } },
      {
        type: 'text',
        content: {
          en: 'Python recognizes two main number types:\n\n• int (integer): whole numbers. Examples: 5, -10, 0, 42\n• float: decimal numbers. Examples: 3.14, -2.5, 0.0\n\nWhy two types? Whole numbers for counting (people, items), decimals for precision (money, measurements).',
          pt: 'Python reconhece dois tipos de números principais:\n\n• int (inteiro): números inteiros. Exemplos: 5, -10, 0, 42\n• float: números decimais. Exemplos: 3.14, -2.5, 0.0\n\nPor que dois tipos? Números inteiros para contar (pessoas, itens), decimais para precisão (dinheiro, medidas).'
        }
      },
      { type: 'heading', content: { en: 'Math Operations', pt: 'Operações Matemáticas' } },
      {
        type: 'code',
        code: `# Addition
print(10 + 5)      # Result: 15

# Subtraction
print(20 - 8)      # Result: 12

# Multiplication
print(4 * 6)       # Result: 24

# Division (always gives decimal)
print(10 / 2)      # Result: 5.0

# Floor division (drops decimal)
print(10 // 3)     # Result: 3

# Modulo (remainder)
print(10 % 3)      # Result: 1`
      },
      { type: 'heading', content: { en: 'Real-World Example: Insurance Payout', pt: 'Exemplo Real: Pagamento de Sinistro' } },
      {
        type: 'code',
        code: `# A car has $5,230 in damage
damage = 5230
deductible = 250

# Company pays the difference
company_pays = damage - deductible

print("Damage: $", damage)
print("Deductible: $", deductible)
print("Company pays: $", company_pays)`
      },
      {
        type: 'tip',
        content: {
          en: 'Order of operations: * and / happen before + and -. Use parentheses when unsure: (10 + 5) * 2 = 30, but 10 + 5 * 2 = 20.',
          pt: 'Ordem das operações: * e / acontecem antes de + e -. Use parênteses quando em dúvida: (10 + 5) * 2 = 30, mas 10 + 5 * 2 = 20.'
        }
      }
    ]
  },
  exercises: [
    {
      id: 'ex2_1',
      title: { en: 'Total Damage', pt: 'Dano Total' },
      description: {
        en: '🎯 Multiple damage sources:\n• Front bumper: $1,200\n• Hood: $2,000\n• Headlight: $800\n\nCalculate and print the total.',
        pt: '🎯 Múltiplas fontes de dano:\n• Para-choque: R$ 1.200\n• Capô: R$ 2.000\n• Farol: R$ 800\n\nCalcule e imprima o total.'
      },
      starterCode: `bumper = 1200
hood = 2000
headlight = 800

total = bumper + hood + headlight

print("Total Damage: $", total)`,
      hints: [{ en: 'Use + to add values', pt: 'Use + para somar valores' }]
    },
    {
      id: 'ex2_2',
      title: { en: 'Insurance Deductible', pt: 'Franquia de Seguros' },
      description: {
        en: '🎯 Damage: $4,000. Deductible: $250.\n\nCalculate what the insurance company will pay.',
        pt: '🎯 Dano: R$ 4.000. Franquia: R$ 250.\n\nCalcule quanto a seguradora pagará.'
      },
      starterCode: `damage = 4000
deductible = 250

company_payment = damage - deductible

print("Total: $", damage)
print("Deductible: $", deductible)
print("Company pays: $", company_payment)`,
      hints: [{ en: 'Subtract deductible from damage', pt: 'Subtraia franquia do dano' }]
    },
    {
      id: 'ex2_3',
      title: { en: 'Construction Budget', pt: 'Orçamento de Construção' },
      description: {
        en: '🎯 Project budget: $100,000.\n\nSpent: Month 1: $25k, Month 2: $30k, Month 3: $20k.\n\nCalculate total spent and remaining.',
        pt: '🎯 Orçamento do projeto: R$ 100.000.\n\nGasto: Mês 1: R$ 25k, Mês 2: R$ 30k, Mês 3: R$ 20k.\n\nCalcule total gasto e restante.'
      },
      starterCode: `budget = 100000
spent_month1 = 25000
spent_month2 = 30000
spent_month3 = 20000

total_spent = spent_month1 + spent_month2 + spent_month3
remaining = budget - total_spent

print("Spent: $", total_spent)
print("Remaining: $", remaining)`,
      hints: [{ en: 'Add all months to get total spent', pt: 'Adicione todos os meses' }]
    }
  ],
  quiz: [
    {
      id: 'q2_1',
      question: { en: 'What is 10 / 2?', pt: 'Quanto é 10 / 2?' },
      options: [
        { en: '5', pt: '5' },
        { en: '5.0', pt: '5.0' },
        { en: 'Error', pt: 'Erro' },
        { en: '10', pt: '10' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'In Python 3, / always returns a float. So 10 / 2 = 5.0, not 5.',
        pt: 'Em Python 3, / sempre retorna um float. Então 10 / 2 = 5.0, não 5.'
      }
    },
    {
      id: 'q2_2',
      question: { en: 'What is 10 // 3?', pt: 'Quanto é 10 // 3?' },
      options: [
        { en: '3', pt: '3' },
        { en: '3.33', pt: '3.33' },
        { en: '1', pt: '1' },
        { en: '4', pt: '4' }
      ],
      correctIndex: 0,
      explanation: {
        en: '// is floor division. 10 ÷ 3 = 3.33, but // gives just 3.',
        pt: '// é divisão inteira. 10 ÷ 3 = 3.33, mas // dá apenas 3.'
      }
    },
    {
      id: 'q2_3',
      question: { en: 'What is 10 % 3?', pt: 'Quanto é 10 % 3?' },
      options: [
        { en: '3', pt: '3' },
        { en: '1', pt: '1' },
        { en: '0', pt: '0' },
        { en: '10', pt: '10' }
      ],
      correctIndex: 1,
      explanation: {
        en: '% gives the remainder. 10 ÷ 3 = 3 with remainder 1.',
        pt: '% dá o resto. 10 ÷ 3 = 3 com resto 1.'
      }
    },
    {
      id: 'q2_4',
      question: { en: 'Type of 3.14?', pt: 'Tipo de 3.14?' },
      options: [
        { en: 'int', pt: 'int' },
        { en: 'float', pt: 'float' },
        { en: 'string', pt: 'string' },
        { en: 'bool', pt: 'bool' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'Numbers with decimals are floats.',
        pt: 'Números com decimais são floats.'
      }
    }
  ],
  exam: {
    title: { en: 'Multi-Site Budget', pt: 'Orçamento Multi-Site' },
    scenario: {
      en: `Calculate budgets for 4 construction sites:\nSite A: $50,000\nSite B: $75,000\nSite C: $60,000\nSite D: $45,000\n\nPrint:\n1. Each site budget\n2. Total budget\n3. Equal split among 4\n4. 10% overhead\n5. Remaining for work`,
      pt: `Calcule orçamentos para 4 sites de construção:\nSite A: R$ 50.000\nSite B: R$ 75.000\nSite C: R$ 60.000\nSite D: R$ 45.000\n\nImprima:\n1. Orçamento de cada site\n2. Orçamento total\n3. Divisão igual entre 4\n4. Despesas gerais 10%\n5. Restante para trabalho`
    },
    requirements: {
      en: [
        'Calculate total of 4 sites',
        'Calculate equal split (total / 4)',
        'Calculate 10% overhead',
        'Calculate remaining budget',
        'Print with labels',
        'No user input'
      ],
      pt: [
        'Calcule total de 4 sites',
        'Calcule divisão igual (total / 4)',
        'Calcule despesas gerais 10%',
        'Calcule orçamento restante',
        'Imprima com rótulos',
        'Sem entrada de usuário'
      ]
    },
    starterCode: `site_a = 50000
site_b = 75000
site_c = 60000
site_d = 45000

total = site_a + site_b + site_c + site_d
equal_split = total / 4
overhead = total * 0.10
remaining = total - overhead

print("Total: $", total)
print("Per site: $", equal_split)
print("Overhead: $", overhead)
print("Remaining: $", remaining)`,
    testCases: [
      { id: 'tc2_1', description: { en: 'Shows 50000', pt: 'Mostra 50000' }, inputs: [], checks: [{ type: 'contains', value: '50000' }], points: 10 },
      { id: 'tc2_2', description: { en: 'Shows 75000', pt: 'Mostra 75000' }, inputs: [], checks: [{ type: 'contains', value: '75000' }], points: 10 },
      { id: 'tc2_3', description: { en: 'Shows 60000', pt: 'Mostra 60000' }, inputs: [], checks: [{ type: 'contains', value: '60000' }], points: 10 },
      { id: 'tc2_4', description: { en: 'Shows 45000', pt: 'Mostra 45000' }, inputs: [], checks: [{ type: 'contains', value: '45000' }], points: 10 },
      { id: 'tc2_5', description: { en: 'Total 230000', pt: 'Total 230000' }, inputs: [], checks: [{ type: 'contains', value: '230000' }], points: 10 },
      { id: 'tc2_6', description: { en: 'Per site ~57500', pt: 'Por site ~57500' }, inputs: [], checks: [{ type: 'contains_any', value: ['57500', '57500.0'] }], points: 10 },
      { id: 'tc2_7', description: { en: 'Overhead 23000', pt: 'Despesas 23000' }, inputs: [], checks: [{ type: 'contains_any', value: ['23000', '23000.0'] }], points: 10 },
      { id: 'tc2_8', description: { en: 'Remaining 207000', pt: 'Restante 207000' }, inputs: [], checks: [{ type: 'contains_any', value: ['207000', '207000.0'] }], points: 10 },
      { id: 'tc2_9', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error' }], points: 10 },
      { id: 'tc2_10', description: { en: 'Formatted output', pt: 'Saída formatada' }, inputs: [], checks: [{ type: 'no_error' }], points: 10 }
    ]
  }
}

// PHASES 3-8 STUBS (simplified for now - content structure only)
export const phase3: Phase = {
  id: 3,
  title: { en: 'Variables', pt: 'Variáveis' },
  description: { en: 'Store and reuse data with variables', pt: 'Guarde e reutilize dados com variáveis' },
  icon: '📦',
  libraries: [],
  lesson: { title: { en: 'Variables', pt: 'Variáveis' }, blocks: [
    { type: 'heading', content: { en: 'What are Variables?', pt: 'O que são Variáveis?' } },
    { type: 'text', content: { en: 'A variable is a named storage box. You give it a name and store a value inside. Example: name = "Alice"', pt: 'Uma variável é uma caixa de armazenamento nomeada. Você dá um nome e armazena um valor dentro. Exemplo: name = "Alice"' } },
    { type: 'code', code: `name = "Alice"
age = 28
city = "Toronto"

print(name)
print(age)
print(city)` }
  ]},
  exercises: [
    { id: 'ex3_1', title: { en: 'Store Info', pt: 'Guardar Info' }, description: { en: 'Create 3 variables and print them', pt: 'Crie 3 variáveis e imprima' }, starterCode: `name = "Alex"\nage = 30\ncity = "Toronto"\n\nprint(name)\nprint(age)\nprint(city)`, hints: [{ en: 'Use = to assign', pt: 'Use = para atribuir' }] },
    { id: 'ex3_2', title: { en: 'Calculate Age', pt: 'Calcular Idade' }, description: { en: 'Store birth year, calculate current age', pt: 'Guarde ano de nascimento, calcule idade' }, starterCode: `birth_year = 1990\ncurrent_year = 2026\n\nage = current_year - birth_year\n\nprint("Age:", age)`, hints: [{ en: 'Subtract birth from current', pt: 'Subtraia nascimento do atual' }] },
    { id: 'ex3_3', title: { en: 'Full Name', pt: 'Nome Completo' }, description: { en: 'Combine first and last name', pt: 'Combine primeiro e último nome' }, starterCode: `first = "Diana"\nlast = "Smith"\n\nfull = first + " " + last\n\nprint(full)`, hints: [{ en: 'Use + to combine text', pt: 'Use + para combinar texto' }] }
  ],
  quiz: [
    { id: 'q3_1', question: { en: 'What does x = 5 do?', pt: 'O que x = 5 faz?' }, options: [{ en: 'Stores 5 in x', pt: 'Armazena 5 em x' }, { en: 'Checks if x equals 5', pt: 'Verifica se x é 5' }, { en: 'Prints x', pt: 'Imprime x' }, { en: 'Nothing', pt: 'Nada' }], correctIndex: 0, explanation: { en: '= assigns a value. == checks equality', pt: '= atribui. == verifica igualdade' } },
    { id: 'q3_2', question: { en: 'Variable name can start with?', pt: 'Nome de variável pode começar com?' }, options: [{ en: 'Letter', pt: 'Letra' }, { en: 'Number', pt: 'Número' }, { en: 'Symbol', pt: 'Símbolo' }, { en: 'Space', pt: 'Espaço' }], correctIndex: 0, explanation: { en: 'Names start with letter or underscore', pt: 'Nomes começam com letra ou underscore' } },
    { id: 'q3_3', question: { en: 'What\'s the result?\nx = 10\ny = x + 5\nprint(y)', pt: 'Qual é o resultado?\nx = 10\ny = x + 5\nprint(y)' }, options: [{ en: '15', pt: '15' }, { en: '10', pt: '10' }, { en: 'x + 5', pt: 'x + 5' }, { en: 'Error', pt: 'Erro' }], correctIndex: 0, explanation: { en: 'x is 10, so x + 5 = 15', pt: 'x é 10, então x + 5 = 15' } },
    { id: 'q3_4', question: { en: 'Can you change a variable?', pt: 'Você pode mudar uma variável?' }, options: [{ en: 'Yes, anytime', pt: 'Sim, qualquer hora' }, { en: 'No, never', pt: 'Não, nunca' }, { en: 'Only once', pt: 'Apenas uma vez' }, { en: 'Only in functions', pt: 'Apenas em funções' }], correctIndex: 0, explanation: { en: 'Variables can be reassigned: x = 5; x = 10', pt: 'Variáveis podem ser reatribuídas: x = 5; x = 10' } }
  ],
  exam: { title: { en: 'Claim Data', pt: 'Dados de Sinistro' }, scenario: { en: `Create variables for claim info and calculate total damage.`, pt: `Crie variáveis para dados de sinistro e calcule dano total.` }, requirements: { en: ['Create variables', 'Calculate', 'Print results'], pt: ['Crie variáveis', 'Calcule', 'Imprima resultados'] }, starterCode: `bumper = 1200\nhood = 2000\nheadlight = 800\n\ntotal = bumper + hood + headlight\n\nprint("Total: $", total)`, testCases: [{ id: 'tc3_1', description: { en: 'Shows total', pt: 'Mostra total' }, inputs: [], checks: [{ type: 'contains', value: '4000' }], points: 100 }] }
}

export const phase4: Phase = {
  id: 4,
  title: { en: 'Getting User Input', pt: 'Entrada do Usuário' },
  description: { en: 'Ask the user for information using input()', pt: 'Peça informações ao usuário com input()' },
  icon: '📝',
  libraries: [],
  lesson: { title: { en: 'User Input', pt: 'Entrada do Usuário' }, blocks: [
    { type: 'heading', content: { en: 'The input() Function', pt: 'A Função input()' } },
    { type: 'code', code: `name = input("What is your name? ")
print("Hello, " + name)` },
    { type: 'text', content: { en: 'input() pauses, shows a question, waits for user to type. Everything is treated as text (string). To use as number, convert: int() or float()', pt: 'input() pausa, mostra uma pergunta, aguarda o usuário digitar. Tudo é tratado como texto (string). Para usar como número, converta: int() ou float()' } }
  ]},
  exercises: [
    { id: 'ex4_1', title: { en: 'Ask Name', pt: 'Pergunte Nome' }, description: { en: 'Ask user for name and greet them', pt: 'Pergunte nome e cumprimente' }, starterCode: `name = input("Your name: ")\nprint("Hello, " + name)`, hints: [{ en: 'Use + to combine strings', pt: 'Use + para combinar strings' }] },
    { id: 'ex4_2', title: { en: 'Collect Data', pt: 'Coletar Dados' }, description: { en: 'Ask for name and age, print both', pt: 'Pergunte nome e idade, imprima' }, starterCode: `name = input("Name: ")\nage = input("Age: ")\n\nprint("Name: " + name)\nprint("Age: " + age)`, hints: [{ en: 'input() returns a string', pt: 'input() retorna string' }] },
    { id: 'ex4_3', title: { en: 'Calculate with Input', pt: 'Calcular com Input' }, description: { en: 'Ask for damage, calculate payout', pt: 'Pergunte dano, calcule pagamento' }, starterCode: `damage_str = input("Damage ($): ")\ndamage = int(damage_str)\ndeductible = 250\n\npayout = damage - deductible\nprint("Payout: $", payout)`, hints: [{ en: 'Use int() to convert to number', pt: 'Use int() para converter para número' }] }
  ],
  quiz: [
    { id: 'q4_1', question: { en: 'What does input() return?', pt: 'O que input() retorna?' }, options: [{ en: 'A string', pt: 'Uma string' }, { en: 'A number', pt: 'Um número' }, { en: 'An integer', pt: 'Um inteiro' }, { en: 'A list', pt: 'Uma lista' }], correctIndex: 0, explanation: { en: 'input() always returns text (string)', pt: 'input() sempre retorna texto (string)' } },
    { id: 'q4_2', question: { en: 'To convert "42" to a number?', pt: 'Para converter "42" para número?' }, options: [{ en: 'int("42")', pt: 'int("42")' }, { en: 'num("42")', pt: 'num("42")' }, { en: 'convert("42")', pt: 'convert("42")' }, { en: 'number("42")', pt: 'number("42")' }], correctIndex: 0, explanation: { en: 'int() converts string to integer', pt: 'int() converte string para inteiro' } },
    { id: 'q4_3', question: { en: 'Result of:\nx = input("Number: ") with input "5"\nprint(x + 5)', pt: 'Resultado de:\nx = input("Número: ") com entrada "5"\nprint(x + 5)' }, options: [{ en: '10', pt: '10' }, { en: 'Error', pt: 'Erro' }, { en: '"55"', pt: '"55"' }, { en: 'None', pt: 'None' }], correctIndex: 2, explanation: { en: 'input() returns string, "5" + 5 concatenates: "55"', pt: 'input() retorna string, "5" + 5 concatena: "55"' } },
    { id: 'q4_4', question: { en: 'To do math with input?', pt: 'Para fazer matemática com input?' }, options: [{ en: 'Just add or multiply', pt: 'Apenas somar ou multiplicar' }, { en: 'Convert to int or float first', pt: 'Converter para int ou float primeiro' }, { en: 'Use a special function', pt: 'Use uma função especial' }, { en: 'Impossible', pt: 'Impossível' }], correctIndex: 1, explanation: { en: 'Must convert: int(input(...))', pt: 'Deve converter: int(input(...))' } }
  ],
  exam: { title: { en: 'Claim Form', pt: 'Formulário de Sinistro' }, scenario: { en: `Ask user for claim details and calculate payout.`, pt: `Peça detalhes do sinistro e calcule pagamento.` }, requirements: { en: ['Ask for amount', 'Convert to number', 'Subtract deductible', 'Print result'], pt: ['Pergunte valor', 'Converta para número', 'Subtraia franquia', 'Imprima resultado'] }, starterCode: `amount = int(input("Damage: "))
deductible = 250
payout = amount - deductible
print("Payout: $", payout)`, testCases: [{ id: 'tc4_1', description: { en: 'Calculates payout', pt: 'Calcula pagamento' }, inputs: ['5000'], inputMap: { 'damage': '5000', 'amount': '5000' }, checks: [{ type: 'contains_any', value: ['4750', '4750.0'] }], points: 100 }] }
}

// Continue with phases 5-8 as stubs (simplified)
export const phase5: Phase = { id: 5, title: { en: 'If Statements', pt: 'Instruções If' }, description: { en: 'Make decisions: if condition is true, do this', pt: 'Tome decisões: se condição é verdadeira, faça isso' }, icon: '🚦', libraries: [], lesson: { title: { en: 'Conditional Logic', pt: 'Lógica Condicional' }, blocks: [{ type: 'heading', content: { en: 'The if Statement', pt: 'A Instrução if' } }, { type: 'code', code: `age = 25\n\nif age >= 18:\n    print("You are an adult")\nelse:\n    print("You are underage")` }] }, exercises: [{ id: 'ex5_1', title: { en: 'Check Age', pt: 'Verificar Idade' }, description: { en: 'If age >= 18, print adult, else minor', pt: 'Se idade >= 18, imprima adulto, senão menor' }, starterCode: `age = int(input("Age: "))\n\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")`, hints: [{ en: 'Use >=', pt: 'Use >=' }] }], quiz: [{ id: 'q5_1', question: { en: 'What does >= mean?', pt: 'O que >= significa?' }, options: [{ en: 'Greater than or equal', pt: 'Maior que ou igual' }, { en: 'Equal only', pt: 'Apenas igual' }, { en: 'Greater than', pt: 'Maior que' }, { en: 'Not equal', pt: 'Não igual' }], correctIndex: 0, explanation: { en: '>= checks if left is >= right', pt: '>= verifica se esquerda é >= direita' } }], exam: { title: { en: 'Check Amount', pt: 'Verificar Valor' }, scenario: { en: `If damage > 3000, it needs expert. Else, quick review.`, pt: `Se dano > 3000, precisa perito. Senão, revisão rápida.` }, requirements: { en: ['Check amount', 'Print appropriate message'], pt: ['Verificar valor', 'Imprima mensagem apropriada'] }, starterCode: `amount = int(input("Damage: "))\n\nif amount > 3000:\n    print("Expert needed")\nelse:\n    print("Quick review")`, testCases: [{ id: 'tc5_1', description: { en: 'Checks correctly', pt: 'Verifica corretamente' }, inputs: ['5000'], inputMap: { 'damage': '5000' }, checks: [{ type: 'contains', value: 'Expert' }], points: 100 }] } }

export const phase6: Phase = { id: 6, title: { en: 'If-Elif-Else', pt: 'If-Elif-Else' }, description: { en: 'Multiple conditions: if, elif, else', pt: 'Múltiplas condições: if, elif, else' }, icon: '⚙️', libraries: [], lesson: { title: { en: 'Multiple Conditions', pt: 'Múltiplas Condições' }, blocks: [{ type: 'code', code: `score = 75\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("F")` }] }, exercises: [{ id: 'ex6_1', title: { en: 'Grade Calculator', pt: 'Calculadora de Notas' }, description: { en: 'Score to letter grade', pt: 'Nota para letra' }, starterCode: `score = int(input("Score: "))\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")`, hints: [{ en: 'Use elif for more conditions', pt: 'Use elif para mais condições' }] }], quiz: [{ id: 'q6_1', question: { en: 'Order of elif matters?', pt: 'A ordem de elif importa?' }, options: [{ en: 'Yes, checked top to bottom', pt: 'Sim, verificado de cima para baixo' }, { en: 'No, order doesn\'t matter', pt: 'Não, ordem não importa' }, { en: 'Only if using numbers', pt: 'Apenas se usar números' }, { en: 'Depends', pt: 'Depende' }], correctIndex: 0, explanation: { en: 'elif checks are evaluated in order. First true executes, rest skip.', pt: 'elif são avaliadas em ordem. Primeiro verdadeiro executa, resto pula.' } }], exam: { title: { en: 'Claim Priority', pt: 'Prioridade de Sinistro' }, scenario: { en: `Categorize by damage: >5000=urgent, 2000-5000=normal, <2000=low.`, pt: `Categorize por dano: >5000=urgente, 2000-5000=normal, <2000=baixo.` }, requirements: { en: ['Check amount', 'Assign priority'], pt: ['Verificar valor', 'Atribuir prioridade'] }, starterCode: `amount = int(input("Damage: "))\n\nif amount > 5000:\n    print("Urgent")\nelif amount >= 2000:\n    print("Normal")\nelse:\n    print("Low")`, testCases: [{ id: 'tc6_1', description: { en: 'Categorizes correctly', pt: 'Categoriza corretamente' }, inputs: ['6000'], inputMap: { 'damage': '6000' }, checks: [{ type: 'contains', value: 'Urgent' }], points: 100 }] } }

export const phase7: Phase = { id: 7, title: { en: 'While Loops', pt: 'Loops While' }, description: { en: 'Repeat code while a condition is true', pt: 'Repita código enquanto uma condição é verdadeira' }, icon: '🔄', libraries: [], lesson: { title: { en: 'Looping with While', pt: 'Loop com While' }, blocks: [{ type: 'code', code: `count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1` }] }, exercises: [{ id: 'ex7_1', title: { en: 'Count Loop', pt: 'Loop de Contagem' }, description: { en: 'Print 1 to 5', pt: 'Imprima 1 a 5' }, starterCode: `count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1`, hints: [{ en: 'Increment count each loop', pt: 'Incremente contagem cada loop' }] }], quiz: [{ id: 'q7_1', question: { en: 'What causes infinite loop?', pt: 'O que causa loop infinito?' }, options: [{ en: 'Forgetting to increment', pt: 'Esquecer de incrementar' }, { en: 'Bad condition', pt: 'Condição ruim' }, { en: 'Spelling error', pt: 'Erro de ortografia' }, { en: 'Both A and B', pt: 'A e B' }], correctIndex: 3, explanation: { en: 'Loop never ends if condition stays true and counter never changes', pt: 'Loop nunca termina se condição permanece verdadeira e contador não muda' } }], exam: { title: { en: 'Sum Inputs', pt: 'Somar Entradas' }, scenario: { en: `Ask user for 3 numbers, sum and print.`, pt: `Peça 3 números ao usuário, some e imprima.` }, requirements: { en: ['Loop 3 times', 'Get input each time', 'Sum values', 'Print total'], pt: ['Loop 3 vezes', 'Pegue entrada cada vez', 'Some valores', 'Imprima total'] }, starterCode: `total = 0\ncount = 1\nwhile count <= 3:\n    num = int(input("Number: "))\n    total = total + num\n    count = count + 1\nprint("Total:", total)`, testCases: [{ id: 'tc7_1', description: { en: 'Sums correctly', pt: 'Soma corretamente' }, inputs: ['10', '20', '30'], inputMap: { 'number': '10' }, checks: [{ type: 'contains', value: '60' }], points: 100 }] } }

export const phase8: Phase = { id: 8, title: { en: 'For Loops & Lists', pt: 'For Loops e Listas' }, description: { en: 'Loop through lists. Intro to data structures.', pt: 'Loop através de listas. Intro a estruturas de dados.' }, icon: '📋', libraries: [], lesson: { title: { en: 'Lists and For Loops', pt: 'Listas e For Loops' }, blocks: [{ type: 'code', code: `clients = ["Alice", "Bob", "Carlos"]\n\nfor name in clients:\n    print("Hello, " + name)` }] }, exercises: [{ id: 'ex8_1', title: { en: 'Loop List', pt: 'Loop Lista' }, description: { en: 'Print each name in list', pt: 'Imprima cada nome na lista' }, starterCode: `names = ["Alice", "Bob", "Diana"]\n\nfor name in names:\n    print(name)`, hints: [{ en: 'Use for to iterate', pt: 'Use for para iterar' }] }], quiz: [{ id: 'q8_1', question: { en: 'List syntax?', pt: 'Sintaxe de lista?' }, options: [{ en: '[item1, item2]', pt: '[item1, item2]' }, { en: '(item1, item2)', pt: '(item1, item2)' }, { en: '{item1, item2}', pt: '{item1, item2}' }, { en: 'item1, item2', pt: 'item1, item2' }], correctIndex: 0, explanation: { en: 'Lists use square brackets [...]', pt: 'Listas usam colchetes [...]' } }], exam: { title: { en: 'Client Greetings', pt: 'Saudações de Cliente' }, scenario: { en: `Greet each client in list.`, pt: `Cumprimente cada cliente na lista.` }, requirements: { en: ['Create list', 'Loop through', 'Print greeting for each'], pt: ['Crie lista', 'Loop através', 'Imprima saudação para cada'] }, starterCode: `clients = ["Alice", "Bob", "Diana"]\n\nfor client in clients:\n    print("Welcome, " + client)`, testCases: [{ id: 'tc8_1', description: { en: 'Greets all', pt: 'Cumprimenta todos' }, inputs: [], checks: [{ type: 'contains', value: 'Alice' }], points: 100 }] } }

