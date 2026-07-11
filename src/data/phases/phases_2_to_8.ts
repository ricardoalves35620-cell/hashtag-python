import type { Phase } from '../types'

// ============================================================================
// PHASES 2-8 — CONTEÚDO RICO COM CENÁRIOS REAIS
// Designer Instrucional Sênior: analogias cotidianas + dados reais de mercado
// ============================================================================

export const phase2: Phase = {
  id: 2,
  title: { en: 'Math & Numbers', pt: 'Matemática e Números' },
  description: {
    en: 'Do real calculations: insurance payouts, construction budgets, and more.',
    pt: 'Faça cálculos reais: pagamentos de seguros, orçamentos de construção e mais.'
  },
  icon: '🧮',
  libraries: [],
  lesson: {
    title: { en: 'Python as Your Calculator', pt: 'Python como sua Calculadora' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Did you know?', pt: '🌍 Você sabia?' } },
      {
        type: 'text',
        content: {
          en: 'NASA used Python to calculate the trajectory of the Mars rover. 🚀\nEvery app you use — from Uber calculating your fare to banks checking your balance — uses the same math operations you\'ll learn right now.',
          pt: 'A NASA usou Python para calcular a trajetória do rover em Marte. 🚀\nTodo app que você usa — do Uber calculando sua tarifa até bancos verificando seu saldo — usa as mesmas operações que você aprenderá agora.'
        }
      },
      { type: 'heading', content: { en: '🧩 Think of it like a calculator', pt: '🧩 Pense como uma calculadora' } },
      {
        type: 'text',
        content: {
          en: 'Python is just a super-powered calculator.\nYou type a math problem → it gives the answer.\nThe only difference: you can SAVE the answer in a variable and reuse it.',
          pt: 'Python é uma calculadora super poderosa.\nVocê digita um problema matemático → ele dá a resposta.\nA única diferença: você pode SALVAR a resposta em uma variável e reusar.'
        }
      },
      {
        type: 'code',
        code: `# The 5 math operators in Python
print(10 + 3)   # Addition → 13
print(10 - 3)   # Subtraction → 7
print(10 * 3)   # Multiplication → 30
print(10 / 3)   # Division → 3.333...
print(10 // 3)  # Floor division → 3 (no decimal)
print(10 % 3)   # Modulo (remainder) → 1`
      },
      { type: 'heading', content: { en: '🛠️ Real Example: Insurance Payout', pt: '🛠️ Exemplo Real: Pagamento de Sinistro' } },
      {
        type: 'text',
        content: {
          en: 'A customer claims $5,230 for water damage.\n🔸 Deductible: $250 (customer pays this)\n🔸 Coverage: 80% of the rest\n\nLet\'s calculate step by step:',
          pt: 'Um cliente reclama R$ 5.230 por dano de água.\n🔸 Franquia: R$ 250 (o cliente paga)\n🔸 Cobertura: 80% do restante\n\nVamos calcular passo a passo:'
        }
      },
      {
        type: 'code',
        code: `claim = 5230      # Total damage claimed
deductible = 250  # Customer pays this

after_deductible = claim - deductible   # = 4980
payout = after_deductible * 0.80        # = 3984.0

print("Company pays:", payout)  # 3984.0`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Order matters! * and / happen BEFORE + and -.\nUse parentheses ( ) to control order: (2 + 3) * 4 = 20, but 2 + 3 * 4 = 14.',
          pt: '💡 A ordem importa! * e / acontecem ANTES de + e -.\nUse parênteses ( ) para controlar a ordem: (2 + 3) * 4 = 20, mas 2 + 3 * 4 = 14.'
        }
      }
    ]
  },
  exercises: [
    {
      id: 'ex2_1',
      title: { en: 'Calculate Total Damage', pt: 'Calcular Dano Total' },
      description: {
        en: '🎯 A car accident caused 3 types of damage:\n• Front bumper: $1,200\n• Hood: $2,000\n• Headlight: $800\n\nAdd them up and print the total.',
        pt: '🎯 Um acidente causou 3 tipos de dano:\n• Para-choque: R$ 1.200\n• Capô: R$ 2.000\n• Farol: R$ 800\n\nSome tudo e imprima o total.'
      },
      starterCode: `bumper = 1200
hood = 2000
headlight = 800

total = bumper + hood + headlight

print("Total Damage: $", total)`,
      hints: [{ en: 'Use + to add all three values together', pt: 'Use + para somar os três valores' }]
    },
    {
      id: 'ex2_2',
      title: { en: 'Insurance Deductible', pt: 'Franquia do Seguro' },
      description: {
        en: '🎯 Damage: $4,000. Deductible: $250.\nCalculate what insurance pays (damage - deductible).\nThen apply 75% coverage.',
        pt: '🎯 Dano: R$ 4.000. Franquia: R$ 250.\nCalcule o que o seguro paga (dano - franquia).\nDepois aplique 75% de cobertura.'
      },
      starterCode: `damage = 4000
deductible = 250

after_deductible = damage - deductible
payout = after_deductible * 0.75

print("After deductible:", after_deductible)
print("Company pays:", payout)`,
      hints: [
        { en: 'Subtract deductible first, then multiply by 0.75', pt: 'Subtraia a franquia primeiro, depois multiplique por 0.75' }
      ]
    },
    {
      id: 'ex2_3',
      title: { en: 'Construction Budget', pt: 'Orçamento de Construção' },
      description: {
        en: '🎯 A renovation has a $150,000 budget:\n• Materials: 40%\n• Labor: 35%\n• Equipment: 15%\n• Admin: 10%\n\nCalculate each category.',
        pt: '🎯 Uma reforma tem orçamento de R$ 150.000:\n• Materiais: 40%\n• Mão de obra: 35%\n• Equipamento: 15%\n• Admin: 10%\n\nCalcule cada categoria.'
      },
      starterCode: `budget = 150000

materials  = budget * 0.40
labor      = budget * 0.35
equipment  = budget * 0.15
admin      = budget * 0.10

print("Materials:", materials)
print("Labor:", labor)
print("Equipment:", equipment)
print("Admin:", admin)`,
      hints: [{ en: 'Multiply budget by each percentage as a decimal', pt: 'Multiplique o orçamento por cada percentual como decimal' }]
    }
  ],
  quiz: [
    {
      id: 'q2_1',
      question: { en: 'What does 10 // 3 return?', pt: 'O que 10 // 3 retorna?' },
      options: [
        { en: '3.33', pt: '3.33' },
        { en: '3', pt: '3' },
        { en: '1', pt: '1' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 1,
      explanation: { en: '// is floor division — it drops the decimal. 10 ÷ 3 = 3.33, floor = 3', pt: '// é divisão inteira — descarta o decimal. 10 ÷ 3 = 3.33, inteiro = 3' }
    },
    {
      id: 'q2_2',
      question: { en: 'Result of: 5000 * 0.80?', pt: 'Resultado de: 5000 * 0.80?' },
      options: [
        { en: '4000.0', pt: '4000.0' },
        { en: '400.0', pt: '400.0' },
        { en: '0.80', pt: '0.80' },
        { en: '5000.80', pt: '5000.80' }
      ],
      correctIndex: 0,
      explanation: { en: '5000 × 0.80 = 4000. This is how 80% coverage is applied.', pt: '5000 × 0.80 = 4000. Assim se aplica cobertura de 80%.' }
    },
    {
      id: 'q2_3',
      question: { en: 'What does % do in Python?', pt: 'O que % faz no Python?' },
      options: [
        { en: 'Calculates percentage', pt: 'Calcula percentagem' },
        { en: 'Returns the remainder of division', pt: 'Retorna o resto da divisão' },
        { en: 'Converts to percent', pt: 'Converte para percent' },
        { en: 'Modifies a variable', pt: 'Modifica uma variável' }
      ],
      correctIndex: 1,
      explanation: { en: '% is modulo — returns remainder. 10 % 3 = 1 because 10 = 3×3 + 1', pt: '% é módulo — retorna o resto. 10 % 3 = 1 porque 10 = 3×3 + 1' }
    },
    {
      id: 'q2_4',
      question: { en: 'Result of (2 + 3) * 4?', pt: 'Resultado de (2 + 3) * 4?' },
      options: [
        { en: '14', pt: '14' },
        { en: '20', pt: '20' },
        { en: '24', pt: '24' },
        { en: '10', pt: '10' }
      ],
      correctIndex: 1,
      explanation: { en: 'Parentheses first: (2+3)=5, then 5×4=20', pt: 'Parênteses primeiro: (2+3)=5, depois 5×4=20' }
    }
  ],
  exam: {
    title: { en: 'Multi-Site Budget', pt: 'Orçamento Multi-Site' },
    scenario: {
      en: 'You are managing 4 renovation sites. Calculate the budget split and report.',
      pt: 'Você gerencia 4 obras. Calcule a divisão de orçamento e faça o relatório.'
    },
    requirements: {
      en: ['Print budget for each site', 'Calculate total', 'Calculate average per site', 'Calculate 10% overhead', 'Show remaining after overhead'],
      pt: ['Imprima orçamento de cada site', 'Calcule total', 'Calcule média por site', 'Calcule 10% de overhead', 'Mostre restante após overhead']
    },
    starterCode: `site1 = 50000
site2 = 75000
site3 = 60000
site4 = 45000

total = site1 + site2 + site3 + site4
average = total / 4
overhead = total * 0.10
remaining = total - overhead

print(site1)
print(site2)
print(site3)
print(site4)
print(total)
print(average)
print(overhead)
print(remaining)`,
    testCases: [
      { id: 'tc2_1', description: { en: 'Shows 50000', pt: 'Mostra 50000' }, inputs: [], checks: [{ type: 'contains', value: '50000' }], points: 10 },
      { id: 'tc2_2', description: { en: 'Shows 75000', pt: 'Mostra 75000' }, inputs: [], checks: [{ type: 'contains', value: '75000' }], points: 10 },
      { id: 'tc2_3', description: { en: 'Shows 60000', pt: 'Mostra 60000' }, inputs: [], checks: [{ type: 'contains', value: '60000' }], points: 10 },
      { id: 'tc2_4', description: { en: 'Shows 45000', pt: 'Mostra 45000' }, inputs: [], checks: [{ type: 'contains', value: '45000' }], points: 10 },
      { id: 'tc2_5', description: { en: 'Total 230000', pt: 'Total 230000' }, inputs: [], checks: [{ type: 'contains', value: '230000' }], points: 10 },
      { id: 'tc2_6', description: { en: 'Average ~57500', pt: 'Média ~57500' }, inputs: [], checks: [{ type: 'contains_any', value: ['57500', '57500.0'] }], points: 10 },
      { id: 'tc2_7', description: { en: 'Overhead 23000', pt: 'Overhead 23000' }, inputs: [], checks: [{ type: 'contains_any', value: ['23000', '23000.0'] }], points: 10 },
      { id: 'tc2_8', description: { en: 'Remaining 207000', pt: 'Restante 207000' }, inputs: [], checks: [{ type: 'contains_any', value: ['207000', '207000.0'] }], points: 10 },
      { id: 'tc2_9', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 },
      { id: 'tc2_10', description: { en: 'All values printed', pt: 'Todos os valores impressos' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 }
    ]
  }
}

export const phase3: Phase = {
  id: 3,
  title: { en: 'Variables', pt: 'Variáveis' },
  description: {
    en: 'Store and reuse information. The building block of every program.',
    pt: 'Armazene e reutilize informações. O bloco fundamental de todo programa.'
  },
  icon: '📦',
  libraries: [],
  lesson: {
    title: { en: 'Variables: Labelled Boxes', pt: 'Variáveis: Caixas com Etiqueta' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Did you know?', pt: '🌍 Você sabia?' } },
      {
        type: 'text',
        content: {
          en: 'Every app you use stores thousands of variables.\nYour name in WhatsApp? A variable.\nYour Instagram follower count? A variable.\nYour Uber ETA? Calculated using variables. 📱',
          pt: 'Todo app que você usa armazena milhares de variáveis.\nSeu nome no WhatsApp? Uma variável.\nSeus seguidores no Instagram? Uma variável.\nSeu tempo estimado no Uber? Calculado com variáveis. 📱'
        }
      },
      { type: 'heading', content: { en: '🧩 Shoe box analogy', pt: '🧩 Analogia da caixa de sapato' } },
      {
        type: 'text',
        content: {
          en: 'Imagine a shelf of labelled shoe boxes:\n📦 Box labelled "name" → contains "Alice"\n📦 Box labelled "age" → contains 28\n📦 Box labelled "city" → contains "Toronto"\n\nA variable is exactly that: a labelled box that holds a value.',
          pt: 'Imagine uma prateleira de caixas de sapato etiquetadas:\n📦 Caixa "nome" → contém "Alice"\n📦 Caixa "idade" → contém 28\n📦 Caixa "cidade" → contém "Toronto"\n\nUma variável é exatamente isso: uma caixa etiquetada que guarda um valor.'
        }
      },
      {
        type: 'code',
        code: `# Create a variable: box_label = value
name = "Alice"      # Text always goes in quotes
age = 28            # Numbers never use quotes
city = "Toronto"    # Another text value

# Read what's in the box
print(name)   # Alice
print(age)    # 28
print(city)   # Toronto`
      },
      { type: 'heading', content: { en: '🔄 You can change the value anytime', pt: '🔄 Você pode mudar o valor a qualquer hora' } },
      {
        type: 'code',
        code: `score = 0        # Start at zero
score = score + 10  # Add 10 points
score = score + 5   # Add 5 more

print(score)  # 15`
      },
      {
        type: 'tip',
        content: {
          en: '📏 Naming rules:\n✅ use_underscores  ✅ camelCase  ✅ name1\n❌ 1name  ❌ my-name  ❌ my name (no spaces!)',
          pt: '📏 Regras de nomenclatura:\n✅ use_underscores  ✅ camelCase  ✅ nome1\n❌ 1nome  ❌ meu-nome  ❌ meu nome (sem espaços!)'
        }
      }
    ]
  },
  exercises: [
    {
      id: 'ex3_1',
      title: { en: 'Store Client Info', pt: 'Guardar Info do Cliente' },
      description: {
        en: '🎯 A new insurance client just called.\nStore their info:\n• name = "Carlos Mendes"\n• age = 42\n• city = "São Paulo"\n\nPrint each one.',
        pt: '🎯 Um novo cliente de seguro ligou.\nGuarde as informações:\n• nome = "Carlos Mendes"\n• idade = 42\n• cidade = "São Paulo"\n\nImprima cada um.'
      },
      starterCode: `name = "Carlos Mendes"
age = 42
city = "São Paulo"

print(name)
print(age)
print(city)`,
      hints: [{ en: 'Text values need quotes, numbers don\'t', pt: 'Valores de texto precisam de aspas, números não' }]
    },
    {
      id: 'ex3_2',
      title: { en: 'Calculate Years Active', pt: 'Calcular Anos de Atividade' },
      description: {
        en: '🎯 A policy started in 2018.\nThe current year is 2026.\nCalculate how many years it has been active.',
        pt: '🎯 Uma apólice foi criada em 2018.\nO ano atual é 2026.\nCalcule há quantos anos está ativa.'
      },
      starterCode: `start_year = 2018
current_year = 2026

years_active = current_year - start_year

print("Years active:", years_active)`,
      hints: [{ en: 'Subtract start year from current year', pt: 'Subtraia o ano de início do ano atual' }]
    },
    {
      id: 'ex3_3',
      title: { en: 'Build a Full Name', pt: 'Construir Nome Completo' },
      description: {
        en: '🎯 Combine first and last name into one variable.\n• first = "Ana"\n• last = "Costa"\n• full = first + " " + last',
        pt: '🎯 Combine primeiro e último nome em uma variável.\n• primeiro = "Ana"\n• ultimo = "Costa"\n• completo = primeiro + " " + ultimo'
      },
      starterCode: `first = "Ana"
last = "Costa"

full = first + " " + last

print(full)`,
      hints: [{ en: 'Use + to join strings. Don\'t forget the space in " "', pt: 'Use + para juntar strings. Não esqueça o espaço em " "' }]
    }
  ],
  quiz: [
    {
      id: 'q3_1',
      question: { en: 'What does x = 5 do?', pt: 'O que x = 5 faz?' },
      options: [
        { en: 'Stores the value 5 in x', pt: 'Armazena o valor 5 em x' },
        { en: 'Checks if x equals 5', pt: 'Verifica se x é igual a 5' },
        { en: 'Prints the number 5', pt: 'Imprime o número 5' },
        { en: 'Nothing', pt: 'Nada' }
      ],
      correctIndex: 0,
      explanation: { en: '= is assignment. It puts the value on the right into the box on the left. == is for checking equality.', pt: '= é atribuição. Coloca o valor da direita na caixa da esquerda. == é para verificar igualdade.' }
    },
    {
      id: 'q3_2',
      question: { en: 'Which variable name is VALID?', pt: 'Qual nome de variável é VÁLIDO?' },
      options: [
        { en: 'client_name', pt: 'client_name' },
        { en: '2client', pt: '2client' },
        { en: 'client-name', pt: 'client-name' },
        { en: 'client name', pt: 'client name' }
      ],
      correctIndex: 0,
      explanation: { en: 'Variable names must start with a letter or underscore. No spaces or hyphens allowed.', pt: 'Nomes de variáveis devem começar com letra ou underscore. Sem espaços ou hífens.' }
    },
    {
      id: 'q3_3',
      question: { en: 'x = 10\ny = x + 5\nprint(y) → result?', pt: 'x = 10\ny = x + 5\nprint(y) → resultado?' },
      options: [
        { en: '15', pt: '15' },
        { en: '10', pt: '10' },
        { en: 'x + 5', pt: 'x + 5' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 0,
      explanation: { en: 'x holds 10, so x + 5 = 15. y stores 15.', pt: 'x guarda 10, então x + 5 = 15. y armazena 15.' }
    },
    {
      id: 'q3_4',
      question: { en: 'Can you reassign a variable?', pt: 'Você pode reatribuir uma variável?' },
      options: [
        { en: 'Yes, anytime', pt: 'Sim, a qualquer hora' },
        { en: 'No, never', pt: 'Não, nunca' },
        { en: 'Only once after creation', pt: 'Apenas uma vez após criação' },
        { en: 'Only inside functions', pt: 'Apenas dentro de funções' }
      ],
      correctIndex: 0,
      explanation: { en: 'Variables can be reassigned freely. score = 0, then score = 100 — totally valid!', pt: 'Variáveis podem ser reatribuídas livremente. score = 0, depois score = 100 — totalmente válido!' }
    }
  ],
  exam: {
    title: { en: 'Client File', pt: 'Ficha do Cliente' },
    scenario: {
      en: 'Create a complete client profile for a new insurance policy. Store all info in variables and calculate the annual premium.',
      pt: 'Crie um perfil completo de cliente para uma nova apólice. Armazene tudo em variáveis e calcule o prêmio anual.'
    },
    requirements: {
      en: ['Store client name, age and city', 'Store monthly premium (R$450)', 'Calculate annual premium (monthly * 12)', 'Print all values'],
      pt: ['Armazene nome, idade e cidade do cliente', 'Armazene prêmio mensal (R$450)', 'Calcule prêmio anual (mensal * 12)', 'Imprima todos os valores']
    },
    starterCode: `name = "João Silva"
age = 35
city = "Curitiba"
monthly_premium = 450

annual_premium = monthly_premium * 12

print(name)
print(age)
print(city)
print(monthly_premium)
print(annual_premium)`,
    testCases: [
      { id: 'tc3_1', description: { en: 'Shows client name', pt: 'Mostra nome do cliente' }, inputs: [], checks: [{ type: 'contains', value: 'João' }], points: 20 },
      { id: 'tc3_2', description: { en: 'Shows age', pt: 'Mostra idade' }, inputs: [], checks: [{ type: 'contains', value: '35' }], points: 20 },
      { id: 'tc3_3', description: { en: 'Annual premium = 5400', pt: 'Prêmio anual = 5400' }, inputs: [], checks: [{ type: 'contains', value: '5400' }], points: 40 },
      { id: 'tc3_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

export const phase4: Phase = {
  id: 4,
  title: { en: 'Getting User Input', pt: 'Entrada do Usuário' },
  description: {
    en: 'Make your programs interactive — ask the user for information.',
    pt: 'Torne seus programas interativos — peça informações ao usuário.'
  },
  icon: '⌨️',
  libraries: [],
  lesson: {
    title: { en: 'Talking to Your Program', pt: 'Conversando com seu Programa' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Did you know?', pt: '🌍 Você sabia?' } },
      {
        type: 'text',
        content: {
          en: 'Every form you fill online — Google sign-in, bank transfer, delivery address — uses the same concept as input().\nThe website asks → you type → the program uses your answer. 💻',
          pt: 'Todo formulário online — login do Google, transferência bancária, endereço de entrega — usa o mesmo conceito do input().\nO site pergunta → você digita → o programa usa sua resposta. 💻'
        }
      },
      { type: 'heading', content: { en: '🧩 Like a receptionist', pt: '🧩 Como uma recepcionista' } },
      {
        type: 'text',
        content: {
          en: 'Imagine a receptionist at an insurance office:\n"What\'s your name?" → she writes it down\n"What happened?" → she writes it down\n"How much was the damage?" → she writes it down\n\ninput() does exactly that — it asks and stores the answer.',
          pt: 'Imagine uma recepcionista num escritório de seguros:\n"Qual é o seu nome?" → ela anota\n"O que aconteceu?" → ela anota\n"Qual foi o valor do dano?" → ela anota\n\ninput() faz exatamente isso — pergunta e armazena a resposta.'
        }
      },
      {
        type: 'code',
        code: `# input() always returns TEXT (string)
name = input("What is your name? ")
print("Hello,", name)

# To use as a NUMBER, convert with int() or float()
damage_str = input("Damage amount: $")
damage = int(damage_str)      # now it's a number

deductible = 250
payout = damage - deductible
print("Company pays: $", payout)`
      },
      {
        type: 'warning',
        content: {
          en: '⚠️ IMPORTANT: input() ALWAYS returns text.\nIf you want to do math, you MUST convert:\n• int(input(...)) → whole number\n• float(input(...)) → decimal number',
          pt: '⚠️ IMPORTANTE: input() SEMPRE retorna texto.\nSe quiser fazer matemática, DEVE converter:\n• int(input(...)) → número inteiro\n• float(input(...)) → número decimal'
        }
      }
    ]
  },
  exercises: [
    {
      id: 'ex4_1',
      title: { en: 'Greet the Client', pt: 'Cumprimentar o Cliente' },
      description: {
        en: '🎯 Ask the user for their name and greet them.\n"What is your name?" → "Hello, [name]! Welcome."',
        pt: '🎯 Pergunte o nome do usuário e cumprimente.\n"Qual é o seu nome?" → "Olá, [nome]! Bem-vindo."'
      },
      starterCode: `name = input("What is your name? ")
print("Hello, " + name + "! Welcome.")`,
      hints: [{ en: 'Use + to join strings in the print', pt: 'Use + para juntar strings no print' }]
    },
    {
      id: 'ex4_2',
      title: { en: 'Collect Client Data', pt: 'Coletar Dados do Cliente' },
      description: {
        en: '🎯 Ask for name and city, then print a summary:\n"Client: [name] | City: [city]"',
        pt: '🎯 Pergunte nome e cidade, depois imprima um resumo:\n"Cliente: [nome] | Cidade: [cidade]"'
      },
      starterCode: `name = input("Client name: ")
city = input("City: ")

print("Client:", name, "| City:", city)`,
      hints: [{ en: 'You can pass multiple values to print() separated by commas', pt: 'Você pode passar múltiplos valores para print() separados por vírgulas' }]
    },
    {
      id: 'ex4_3',
      title: { en: 'Calculate with Input', pt: 'Calcular com Input' },
      description: {
        en: '🎯 Ask for the damage amount, convert to number,\nthen calculate payout (damage - 250 deductible).',
        pt: '🎯 Pergunte o valor do dano, converta para número,\ndepois calcule o pagamento (dano - 250 de franquia).'
      },
      starterCode: `damage = int(input("Damage amount: $"))
deductible = 250

payout = damage - deductible

print("Payout: $", payout)`,
      hints: [
        { en: 'Wrap input() with int() to convert to number', pt: 'Envolva input() com int() para converter para número' },
        { en: 'int(input("Damage: ")) — this asks AND converts in one line', pt: 'int(input("Dano: ")) — pergunta E converte em uma linha' }
      ]
    }
  ],
  quiz: [
    {
      id: 'q4_1',
      question: { en: 'What type does input() always return?', pt: 'Que tipo input() sempre retorna?' },
      options: [
        { en: 'String (text)', pt: 'String (texto)' },
        { en: 'Integer', pt: 'Inteiro' },
        { en: 'Float', pt: 'Float' },
        { en: 'Whatever you type', pt: 'O que você digitar' }
      ],
      correctIndex: 0,
      explanation: { en: 'input() ALWAYS returns a string, even if you type a number. Always convert when you need math.', pt: 'input() SEMPRE retorna string, mesmo se você digitar número. Sempre converta quando precisar de matemática.' }
    },
    {
      id: 'q4_2',
      question: { en: 'How to convert "42" (text) to the number 42?', pt: 'Como converter "42" (texto) para o número 42?' },
      options: [
        { en: 'int("42")', pt: 'int("42")' },
        { en: 'num("42")', pt: 'num("42")' },
        { en: 'convert("42")', pt: 'convert("42")' },
        { en: 'to_int("42")', pt: 'to_int("42")' }
      ],
      correctIndex: 0,
      explanation: { en: 'int() converts a string that looks like a whole number into an actual integer.', pt: 'int() converte uma string que parece número inteiro em um inteiro de verdade.' }
    },
    {
      id: 'q4_3',
      question: { en: 'x = input("Number: ") with input "5"\nprint(x + 5) → result?', pt: 'x = input("Número: ") com entrada "5"\nprint(x + 5) → resultado?' },
      options: [
        { en: '10', pt: '10' },
        { en: 'Error', pt: 'Erro' },
        { en: '"55"', pt: '"55"' },
        { en: '5', pt: '5' }
      ],
      correctIndex: 1,
      explanation: { en: 'Error! You can\'t add text + number. input() returned "5" (string), and "5" + 5 fails. Use int(input(...)) to fix it.', pt: 'Erro! Não pode somar texto + número. input() retornou "5" (string), e "5" + 5 falha. Use int(input(...)) para resolver.' }
    },
    {
      id: 'q4_4',
      question: { en: 'To do math with user input, you MUST:', pt: 'Para fazer matemática com input do usuário, você DEVE:' },
      options: [
        { en: 'Convert with int() or float()', pt: 'Converter com int() ou float()' },
        { en: 'Just use it directly', pt: 'Usar diretamente' },
        { en: 'Use a special math() function', pt: 'Usar uma função math() especial' },
        { en: 'It\'s impossible', pt: 'É impossível' }
      ],
      correctIndex: 0,
      explanation: { en: 'Always convert: int(input("Value: ")) or float(input("Value: ")) before doing math.', pt: 'Sempre converta: int(input("Valor: ")) ou float(input("Valor: ")) antes de fazer matemática.' }
    }
  ],
  exam: {
    title: { en: 'Insurance Claim Form', pt: 'Formulário de Sinistro' },
    scenario: {
      en: 'Build a mini claim intake form. Ask for the damage amount, apply a $250 deductible, and show the final payout.',
      pt: 'Construa um mini formulário de sinistro. Pergunte o valor do dano, aplique R$250 de franquia e mostre o pagamento final.'
    },
    requirements: {
      en: ['Ask for client name', 'Ask for damage amount (convert to number)', 'Subtract $250 deductible', 'Print name and payout'],
      pt: ['Pergunte o nome do cliente', 'Pergunte o valor do dano (converta para número)', 'Subtraia R$250 de franquia', 'Imprima nome e pagamento']
    },
    starterCode: `name = input("Client name: ")
damage = int(input("Damage amount: $"))
deductible = 250

payout = damage - deductible

print("Client:", name)
print("Payout: $", payout)`,
    testCases: [
      { id: 'tc4_1', description: { en: 'Calculates payout correctly', pt: 'Calcula pagamento corretamente' }, inputs: ['Maria Silva', '5000'], inputMap: { 'name': 'Maria Silva', 'damage': '5000' }, checks: [{ type: 'contains_any', value: ['4750', '4750.0'] }], points: 50 },
      { id: 'tc4_2', description: { en: 'Shows client name', pt: 'Mostra nome do cliente' }, inputs: ['Maria Silva', '5000'], inputMap: { 'name': 'Maria Silva', 'damage': '5000' }, checks: [{ type: 'contains', value: 'Maria' }], points: 30 },
      { id: 'tc4_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['Test', '1000'], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

export const phase5: Phase = {
  id: 5,
  title: { en: 'If Statements', pt: 'Condições If' },
  description: {
    en: 'Make your program smart — take different actions based on conditions.',
    pt: 'Torne seu programa inteligente — tome ações diferentes baseadas em condições.'
  },
  icon: '🚦',
  libraries: [],
  lesson: {
    title: { en: 'Teaching Your Program to Decide', pt: 'Ensinando seu Programa a Decidir' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Did you know?', pt: '🌍 Você sabia?' } },
      {
        type: 'text',
        content: {
          en: 'Netflix decides what to recommend you using if statements.\n"IF user watched 3 thrillers → recommend more thrillers"\nIF statements power every recommendation, fraud alert, and spam filter on the internet. 🎬',
          pt: 'A Netflix decide o que recomendar para você usando if.\n"SE usuário assistiu 3 thrillers → recomendar mais thrillers"\nIF statements alimentam toda recomendação, alerta de fraude e filtro de spam na internet. 🎬'
        }
      },
      { type: 'heading', content: { en: '🧩 Like a traffic light', pt: '🧩 Como um semáforo' } },
      {
        type: 'text',
        content: {
          en: 'A traffic light has one rule:\n🔴 IF color is red → STOP\n🟢 IF color is green → GO\n\nYour program works the same:\nIF condition is true → do this\nELSE → do that',
          pt: 'Um semáforo tem uma regra:\n🔴 SE cor é vermelho → PARE\n🟢 SE cor é verde → PASSE\n\nSeu programa funciona igual:\nSE condição é verdadeira → faça isso\nSENÃO → faça aquilo'
        }
      },
      {
        type: 'code',
        code: `damage = 8000
deductible = 250

if damage > 5000:
    print("HIGH PRIORITY claim")
    print("Send expert adjuster")
else:
    print("Standard claim")
    print("Process normally")`
      },
      { type: 'heading', content: { en: '📐 Comparison operators', pt: '📐 Operadores de comparação' } },
      {
        type: 'code',
        code: `# These return True or False
x = 10

print(x > 5)    # True  — greater than
print(x < 5)    # False — less than
print(x >= 10)  # True  — greater than OR equal
print(x <= 10)  # True  — less than OR equal
print(x == 10)  # True  — exactly equal
print(x != 5)   # True  — NOT equal`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Note the indentation (4 spaces or 1 Tab).\nPython REQUIRES it. The indented code belongs to the if block.',
          pt: '💡 Note a indentação (4 espaços ou 1 Tab).\nPython EXIGE isso. O código indentado pertence ao bloco if.'
        }
      }
    ]
  },
  exercises: [
    {
      id: 'ex5_1',
      title: { en: 'Check Claim Priority', pt: 'Verificar Prioridade do Sinistro' },
      description: {
        en: '🎯 If damage > $3,000 → print "High priority"\nOtherwise → print "Standard review"',
        pt: '🎯 Se dano > R$3.000 → imprima "Alta prioridade"\nSenão → imprima "Revisão padrão"'
      },
      starterCode: `damage = int(input("Damage amount: $"))

if damage > 3000:
    print("High priority")
else:
    print("Standard review")`,
      hints: [{ en: 'The if condition goes after the colon :', pt: 'A condição do if fica após os dois pontos :' }]
    },
    {
      id: 'ex5_2',
      title: { en: 'Check Coverage Limit', pt: 'Verificar Limite de Cobertura' },
      description: {
        en: '🎯 Policy limit is $10,000.\nIf payout > limit → pay the limit\nOtherwise → pay the calculated amount',
        pt: '🎯 Limite da apólice é R$10.000.\nSe pagamento > limite → pague o limite\nSenão → pague o valor calculado'
      },
      starterCode: `payout = 12000
limit = 10000

if payout > limit:
    actual_payout = limit
    print("Capped at limit: $", actual_payout)
else:
    actual_payout = payout
    print("Full payout: $", actual_payout)`,
      hints: [{ en: 'Compare payout with limit using >', pt: 'Compare pagamento com limite usando >' }]
    },
    {
      id: 'ex5_3',
      title: { en: 'Fraud Alert', pt: 'Alerta de Fraude' },
      description: {
        en: '🎯 If a claim is filed within 7 days of the policy starting, flag it.\nDays since policy start: ask the user.',
        pt: '🎯 Se um sinistro for aberto em menos de 7 dias após a apólice, sinalize.\nDias desde o início da apólice: pergunte ao usuário.'
      },
      starterCode: `days = int(input("Days since policy start: "))

if days < 7:
    print("⚠️ FRAUD ALERT: Claim too soon after policy start")
else:
    print("✅ Claim timing is normal")`,
      hints: [{ en: 'Use < to check if days is less than 7', pt: 'Use < para verificar se dias é menor que 7' }]
    }
  ],
  quiz: [
    {
      id: 'q5_1',
      question: { en: 'What does >= mean?', pt: 'O que >= significa?' },
      options: [
        { en: 'Greater than or equal to', pt: 'Maior que ou igual a' },
        { en: 'Equal only', pt: 'Apenas igual' },
        { en: 'Greater than only', pt: 'Apenas maior que' },
        { en: 'Not equal', pt: 'Não igual' }
      ],
      correctIndex: 0,
      explanation: { en: '>= is True when the left side is greater than OR equal to the right. 10 >= 10 is True.', pt: '>= é True quando o lado esquerdo é maior que OU igual ao direito. 10 >= 10 é True.' }
    },
    {
      id: 'q5_2',
      question: { en: 'What does the ELSE block run?', pt: 'Quando o bloco ELSE executa?' },
      options: [
        { en: 'When the IF condition is False', pt: 'Quando a condição IF é False' },
        { en: 'When the IF condition is True', pt: 'Quando a condição IF é True' },
        { en: 'Always', pt: 'Sempre' },
        { en: 'Never', pt: 'Nunca' }
      ],
      correctIndex: 0,
      explanation: { en: 'else runs ONLY when the if condition is False. If the if runs, else is skipped.', pt: 'else executa SOMENTE quando a condição if é False. Se o if executa, o else é pulado.' }
    },
    {
      id: 'q5_3',
      question: { en: 'What\'s wrong with this:\nif x > 5\n  print("big")', pt: 'O que está errado:\nif x > 5\n  print("big")' },
      options: [
        { en: 'Missing colon after condition', pt: 'Faltando dois pontos após a condição' },
        { en: 'Wrong indentation', pt: 'Indentação errada' },
        { en: 'x is not defined', pt: 'x não está definido' },
        { en: 'Nothing is wrong', pt: 'Nada está errado' }
      ],
      correctIndex: 0,
      explanation: { en: 'if statements require a colon : at the end. Correct: if x > 5:', pt: 'Instruções if precisam de dois pontos : no final. Correto: if x > 5:' }
    },
    {
      id: 'q5_4',
      question: { en: 'x = 15\nif x == 10:\n  print("ten")\nWhat prints?', pt: 'x = 15\nif x == 10:\n  print("dez")\nO que imprime?' },
      options: [
        { en: 'ten', pt: 'dez' },
        { en: 'Nothing', pt: 'Nada' },
        { en: '15', pt: '15' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 1,
      explanation: { en: '15 == 10 is False, so the if block is skipped. Nothing prints because there\'s no else.', pt: '15 == 10 é False, então o bloco if é pulado. Nada imprime porque não há else.' }
    }
  ],
  exam: {
    title: { en: 'Smart Claim Checker', pt: 'Verificador Inteligente' },
    scenario: {
      en: 'Build a claim validation system. Check if the claim amount is within limits and assign a status.',
      pt: 'Construa um sistema de validação de sinistros. Verifique se o valor está dentro dos limites e atribua um status.'
    },
    requirements: {
      en: ['Ask for damage amount', 'If > $10,000 → print "Exceeds limit - requires approval"', 'Else → print "Within coverage - processing"'],
      pt: ['Pergunte o valor do dano', 'Se > R$10.000 → imprima "Excede limite - requer aprovação"', 'Senão → imprima "Dentro da cobertura - processando"']
    },
    starterCode: `damage = int(input("Damage amount: $"))

if damage > 10000:
    print("Exceeds limit - requires approval")
else:
    print("Within coverage - processing")`,
    testCases: [
      { id: 'tc5_1', description: { en: 'High amount triggers alert', pt: 'Valor alto aciona alerta' }, inputs: ['15000'], checks: [{ type: 'contains', value: 'approval' }], points: 40 },
      { id: 'tc5_2', description: { en: 'Normal amount processes', pt: 'Valor normal processa' }, inputs: ['5000'], checks: [{ type: 'contains', value: 'processing' }], points: 40 },
      { id: 'tc5_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['1000'], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

export const phase6: Phase = {
  id: 6,
  title: { en: 'If-Elif-Else', pt: 'If-Elif-Else' },
  description: {
    en: 'Handle multiple conditions — beyond just True or False.',
    pt: 'Lide com múltiplas condições — além de só Verdadeiro ou Falso.'
  },
  icon: '⚙️',
  libraries: [],
  lesson: {
    title: { en: 'Multiple Paths', pt: 'Múltiplos Caminhos' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Did you know?', pt: '🌍 Você sabia?' } },
      {
        type: 'text',
        content: {
          en: 'Uber uses elif to calculate your price tier:\n• Under 2km → standard fare\n• 2-10km → slightly higher\n• Over 10km → long distance rate\n• Surge pricing? Even more conditions! 🚗',
          pt: 'O Uber usa elif para calcular sua faixa de preço:\n• Menos de 2km → tarifa padrão\n• 2-10km → um pouco maior\n• Mais de 10km → taxa de longa distância\n• Preço dinâmico? Ainda mais condições! 🚗'
        }
      },
      { type: 'heading', content: { en: '🧩 Like a sorting machine', pt: '🧩 Como uma máquina classificadora' } },
      {
        type: 'text',
        content: {
          en: 'Imagine a factory conveyor belt that sorts items:\n📦 Heavy item → goes to Dock A\n📦 Medium item → goes to Dock B\n📦 Light item → goes to Dock C\n📦 Anything else → rejected\n\nelif adds as many "sorting points" as you need.',
          pt: 'Imagine uma esteira de fábrica que classifica itens:\n📦 Item pesado → vai para Doca A\n📦 Item médio → vai para Doca B\n📦 Item leve → vai para Doca C\n📦 Qualquer outro → rejeitado\n\nelif adiciona quantos "pontos de classificação" você precisar.'
        }
      },
      {
        type: 'code',
        code: `damage = 4500

if damage > 10000:
    priority = "Critical"
    response_hours = 2
elif damage > 5000:
    priority = "Urgent"
    response_hours = 4
elif damage > 1000:
    priority = "Normal"
    response_hours = 24
else:
    priority = "Low"
    response_hours = 72

print("Priority:", priority)
print("Respond within:", response_hours, "hours")`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Python checks conditions TOP TO BOTTOM and stops at the FIRST True one.\nOrder matters! Put the most specific conditions first.',
          pt: '💡 Python verifica condições DE CIMA PARA BAIXO e para na PRIMEIRA verdadeira.\nA ordem importa! Coloque as condições mais específicas primeiro.'
        }
      }
    ]
  },
  exercises: [
    {
      id: 'ex6_1',
      title: { en: 'Grade Calculator', pt: 'Calculadora de Notas' },
      description: {
        en: '🎯 Convert score to letter grade:\n90-100 → A\n80-89 → B\n70-79 → C\nBelow 70 → F',
        pt: '🎯 Converta nota para letra:\n90-100 → A\n80-89 → B\n70-79 → C\nAbaixo de 70 → F'
      },
      starterCode: `score = int(input("Score (0-100): "))

if score >= 90:
    print("Grade: A — Excellent!")
elif score >= 80:
    print("Grade: B — Great!")
elif score >= 70:
    print("Grade: C — Good")
else:
    print("Grade: F — Study more!")`,
      hints: [{ en: 'Start with the highest condition first (>= 90), then go down', pt: 'Comece com a condição mais alta primeiro (>= 90), depois desça' }]
    },
    {
      id: 'ex6_2',
      title: { en: 'Claim Category', pt: 'Categoria do Sinistro' },
      description: {
        en: '🎯 Categorize claims by damage:\n> $5,000 → "Major"\n$1,000-$5,000 → "Moderate"\n< $1,000 → "Minor"',
        pt: '🎯 Categorize sinistros por dano:\n> R$5.000 → "Major"\nR$1.000-R$5.000 → "Moderate"\n< R$1.000 → "Minor"'
      },
      starterCode: `damage = int(input("Damage amount: $"))

if damage > 5000:
    print("Major claim — send senior adjuster")
elif damage >= 1000:
    print("Moderate claim — standard process")
else:
    print("Minor claim — self-service portal")`,
      hints: [{ en: 'The elif catches the middle range automatically', pt: 'O elif captura o intervalo do meio automaticamente' }]
    }
  ],
  quiz: [
    {
      id: 'q6_1',
      question: { en: 'Does the ORDER of elif conditions matter?', pt: 'A ORDEM das condições elif importa?' },
      options: [
        { en: 'Yes — checked top to bottom, first True wins', pt: 'Sim — verificado de cima para baixo, primeiro True vence' },
        { en: 'No — all conditions are checked', pt: 'Não — todas as condições são verificadas' },
        { en: 'Only for numbers', pt: 'Apenas para números' },
        { en: 'Python sorts them automatically', pt: 'Python as ordena automaticamente' }
      ],
      correctIndex: 0,
      explanation: { en: 'Python stops at the FIRST True condition. Put the most specific first, most general (else) last.', pt: 'Python para na PRIMEIRA condição True. Coloque as mais específicas primeiro, a mais geral (else) por último.' }
    },
    {
      id: 'q6_2',
      question: { en: 'score = 85\nif score >= 90:\n   print("A")\nelif score >= 80:\n   print("B")\nWhat prints?', pt: 'score = 85\nif score >= 90:\n   print("A")\nelif score >= 80:\n   print("B")\nO que imprime?' },
      options: [
        { en: 'A', pt: 'A' },
        { en: 'B', pt: 'B' },
        { en: 'A and B', pt: 'A e B' },
        { en: 'Nothing', pt: 'Nada' }
      ],
      correctIndex: 1,
      explanation: { en: '85 >= 90 is False → skip. 85 >= 80 is True → print "B". Done.', pt: '85 >= 90 é False → pula. 85 >= 80 é True → imprime "B". Fim.' }
    },
    {
      id: 'q6_3',
      question: { en: 'Is else required at the end of if-elif?', pt: 'else é obrigatório no final de if-elif?' },
      options: [
        { en: 'No, it\'s optional', pt: 'Não, é opcional' },
        { en: 'Yes, always required', pt: 'Sim, sempre obrigatório' },
        { en: 'Only with more than 2 elif', pt: 'Apenas com mais de 2 elif' },
        { en: 'Depends on Python version', pt: 'Depende da versão do Python' }
      ],
      correctIndex: 0,
      explanation: { en: 'else is optional. If no condition is True and there\'s no else, nothing happens — and that\'s fine!', pt: 'else é opcional. Se nenhuma condição é True e não há else, nada acontece — e tudo bem!' }
    },
    {
      id: 'q6_4',
      question: { en: 'How many elif blocks can you have?', pt: 'Quantos blocos elif você pode ter?' },
      options: [
        { en: 'As many as you need', pt: 'Quantos precisar' },
        { en: 'Maximum 3', pt: 'Máximo 3' },
        { en: 'Maximum 10', pt: 'Máximo 10' },
        { en: 'Only 1', pt: 'Apenas 1' }
      ],
      correctIndex: 0,
      explanation: { en: 'You can have unlimited elif blocks. Build as many conditions as your logic needs.', pt: 'Você pode ter blocos elif ilimitados. Construa quantas condições sua lógica precisar.' }
    }
  ],
  exam: {
    title: { en: 'Claim Priority System', pt: 'Sistema de Prioridade de Sinistros' },
    scenario: {
      en: 'Build a full triage system. Categorize claims into 4 priority levels based on damage amount.',
      pt: 'Construa um sistema completo de triagem. Categorize sinistros em 4 níveis de prioridade baseados no valor do dano.'
    },
    requirements: {
      en: ['Ask for damage amount', '>$10k = Critical (2hr SLA)', '$5k-$10k = Urgent (4hr SLA)', '$1k-$5k = Normal (24hr SLA)', '<$1k = Low (72hr SLA)'],
      pt: ['Pergunte o valor do dano', '>R$10k = Crítico (SLA 2h)', 'R$5k-R$10k = Urgente (SLA 4h)', 'R$1k-R$5k = Normal (SLA 24h)', '<R$1k = Baixo (SLA 72h)']
    },
    starterCode: `damage = int(input("Damage amount: $"))

if damage > 10000:
    print("CRITICAL — respond in 2 hours")
elif damage > 5000:
    print("URGENT — respond in 4 hours")
elif damage >= 1000:
    print("NORMAL — respond in 24 hours")
else:
    print("LOW — respond in 72 hours")`,
    testCases: [
      { id: 'tc6_1', description: { en: 'Critical level', pt: 'Nível crítico' }, inputs: ['15000'], checks: [{ type: 'contains', value: 'CRITICAL' }], points: 25 },
      { id: 'tc6_2', description: { en: 'Urgent level', pt: 'Nível urgente' }, inputs: ['7000'], checks: [{ type: 'contains', value: 'URGENT' }], points: 25 },
      { id: 'tc6_3', description: { en: 'Normal level', pt: 'Nível normal' }, inputs: ['2000'], checks: [{ type: 'contains', value: 'NORMAL' }], points: 25 },
      { id: 'tc6_4', description: { en: 'Low level', pt: 'Nível baixo' }, inputs: ['500'], checks: [{ type: 'contains', value: 'LOW' }], points: 25 }
    ]
  }
}

export const phase7: Phase = {
  id: 7,
  title: { en: 'While Loops', pt: 'Loops While' },
  description: {
    en: 'Repeat actions automatically — stop only when a condition changes.',
    pt: 'Repita ações automaticamente — pare apenas quando uma condição mudar.'
  },
  icon: '🔄',
  libraries: [],
  lesson: {
    title: { en: 'The Loop That Keeps Going', pt: 'O Loop que Continua' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Did you know?', pt: '🌍 Você sabia?' } },
      {
        type: 'text',
        content: {
          en: 'Instagram\'s notification system runs a while loop 24/7:\n"WHILE server is running → check for new likes → send notifications"\n\nThat same loop has been running non-stop since 2010. 📱',
          pt: 'O sistema de notificação do Instagram roda um while loop 24/7:\n"ENQUANTO servidor estiver rodando → verificar novos likes → enviar notificações"\n\nEsse mesmo loop roda ininterruptamente desde 2010. 📱'
        }
      },
      { type: 'heading', content: { en: '🧩 Like a factory assembly line', pt: '🧩 Como uma linha de montagem' } },
      {
        type: 'text',
        content: {
          en: 'A factory assembly line:\n🏭 WHILE there are cars to paint → paint one → move to next\n🏭 STOP when the last car is done\n\nWhile loop = repeat until condition becomes False.',
          pt: 'Uma linha de montagem de fábrica:\n🏭 ENQUANTO houver carros para pintar → pinta um → move para o próximo\n🏭 PARA quando o último carro estiver pronto\n\nLoop while = repete até a condição se tornar False.'
        }
      },
      {
        type: 'code',
        code: `# Process 5 claims, one at a time
claim_count = 1

while claim_count <= 5:
    print("Processing claim #", claim_count)
    claim_count = claim_count + 1  # IMPORTANT: move forward!

print("All claims processed!")`
      },
      {
        type: 'warning',
        content: {
          en: '⚠️ INFINITE LOOP danger!\nIf you forget to change the counter, the loop NEVER stops.\nAlways make sure something inside the loop brings you closer to False.',
          pt: '⚠️ Perigo de LOOP INFINITO!\nSe esquecer de mudar o contador, o loop NUNCA para.\nSempre certifique-se que algo dentro do loop te aproxima de False.'
        }
      },
      {
        type: 'code',
        code: `# Shorthand: count += 1 means count = count + 1
total = 0
count = 1

while count <= 3:
    value = int(input("Enter amount: "))
    total += value   # same as: total = total + value
    count += 1       # same as: count = count + 1

print("Total collected:", total)`
      }
    ]
  },
  exercises: [
    {
      id: 'ex7_1',
      title: { en: 'Count Down', pt: 'Contagem Regressiva' },
      description: {
        en: '🎯 Count from 5 down to 1, then print "Done!"',
        pt: '🎯 Conte de 5 até 1, depois imprima "Pronto!"'
      },
      starterCode: `count = 5

while count >= 1:
    print(count)
    count -= 1

print("Done!")`,
      hints: [{ en: 'Use -= to decrease the counter each loop', pt: 'Use -= para diminuir o contador a cada loop' }]
    },
    {
      id: 'ex7_2',
      title: { en: 'Sum 3 Claims', pt: 'Somar 3 Sinistros' },
      description: {
        en: '🎯 Ask user to enter 3 damage amounts.\nAdd them all up and print the total.',
        pt: '🎯 Peça ao usuário 3 valores de dano.\nSome tudo e imprima o total.'
      },
      starterCode: `total = 0
count = 1

while count <= 3:
    damage = int(input("Damage #" + str(count) + ": $"))
    total += damage
    count += 1

print("Total damage: $", total)`,
      hints: [{ en: 'Use str(count) to convert count to text for the message', pt: 'Use str(count) para converter contador em texto para a mensagem' }]
    }
  ],
  quiz: [
    {
      id: 'q7_1',
      question: { en: 'What causes an infinite loop?', pt: 'O que causa um loop infinito?' },
      options: [
        { en: 'The condition never becomes False', pt: 'A condição nunca se torna False' },
        { en: 'Too many iterations', pt: 'Muitas iterações' },
        { en: 'Forgetting print()', pt: 'Esquecer print()' },
        { en: 'Wrong indentation', pt: 'Indentação errada' }
      ],
      correctIndex: 0,
      explanation: { en: 'If the while condition never becomes False (e.g., you forget to increment), the loop runs forever.', pt: 'Se a condição while nunca se torna False (ex: esquecer de incrementar), o loop roda para sempre.' }
    },
    {
      id: 'q7_2',
      question: { en: 'What does count += 1 mean?', pt: 'O que count += 1 significa?' },
      options: [
        { en: 'count = count + 1', pt: 'count = count + 1' },
        { en: 'count = 1', pt: 'count = 1' },
        { en: 'Add count to 1', pt: 'Adicione count a 1' },
        { en: 'Check if count equals 1', pt: 'Verifique se count é 1' }
      ],
      correctIndex: 0,
      explanation: { en: '+= is a shorthand. count += 1 is the same as count = count + 1. Saves typing!', pt: '+= é atalho. count += 1 é o mesmo que count = count + 1. Economiza digitação!' }
    },
    {
      id: 'q7_3',
      question: { en: 'count = 1\nwhile count < 3:\n  count += 1\nprint(count) → result?', pt: 'count = 1\nwhile count < 3:\n  count += 1\nprint(count) → resultado?' },
      options: [
        { en: '2', pt: '2' },
        { en: '3', pt: '3' },
        { en: '1', pt: '1' },
        { en: 'Infinite loop', pt: 'Loop infinito' }
      ],
      correctIndex: 1,
      explanation: { en: 'count goes: 1→2→3. When count=3, 3<3 is False, loop stops. print(3).', pt: 'count vai: 1→2→3. Quando count=3, 3<3 é False, loop para. print(3).' }
    },
    {
      id: 'q7_4',
      question: { en: 'When does a while loop stop?', pt: 'Quando um loop while para?' },
      options: [
        { en: 'When the condition becomes False', pt: 'Quando a condição se torna False' },
        { en: 'After 10 iterations', pt: 'Após 10 iterações' },
        { en: 'When print() is called', pt: 'Quando print() é chamado' },
        { en: 'At the end of the file', pt: 'No final do arquivo' }
      ],
      correctIndex: 0,
      explanation: { en: 'A while loop keeps running as long as its condition is True. It stops the moment the condition becomes False.', pt: 'Um loop while continua rodando enquanto sua condição é True. Para no momento em que a condição se torna False.' }
    }
  ],
  exam: {
    title: { en: 'Batch Claim Processor', pt: 'Processador em Lote' },
    scenario: {
      en: 'Process a batch of 5 claims. For each one, get the damage amount, subtract $250 deductible, and add to the total payout. Print the grand total.',
      pt: 'Processe um lote de 5 sinistros. Para cada um, obtenha o valor do dano, subtraia R$250 de franquia e adicione ao total. Imprima o total geral.'
    },
    requirements: {
      en: ['Loop exactly 5 times', 'Ask for damage each iteration', 'Subtract $250 deductible', 'Accumulate total', 'Print final total'],
      pt: ['Loop exatamente 5 vezes', 'Pergunte o dano em cada iteração', 'Subtraia R$250 de franquia', 'Acumule o total', 'Imprima o total final']
    },
    starterCode: `total_payout = 0
count = 1
deductible = 250

while count <= 5:
    damage = int(input("Claim #" + str(count) + " damage: $"))
    payout = damage - deductible
    total_payout += payout
    count += 1

print("Total payout: $", total_payout)`,
    testCases: [
      { id: 'tc7_1', description: { en: 'Processes 5 inputs', pt: 'Processa 5 entradas' }, inputs: ['1000', '2000', '3000', '4000', '5000'], checks: [{ type: 'contains', value: '13750' }], points: 50 },
      { id: 'tc7_2', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['100', '200', '300', '400', '500'], checks: [{ type: 'no_error', value: '' }], points: 30 },
      { id: 'tc7_3', description: { en: 'Shows total', pt: 'Mostra total' }, inputs: ['500', '500', '500', '500', '500'], checks: [{ type: 'contains', value: '1250' }], points: 20 }
    ]
  }
}

export const phase8: Phase = {
  id: 8,
  title: { en: 'For Loops & Lists', pt: 'For Loops e Listas' },
  description: {
    en: 'Store collections of data and process them automatically.',
    pt: 'Armazene coleções de dados e processe-as automaticamente.'
  },
  icon: '📋',
  libraries: [],
  lesson: {
    title: { en: 'Collections + Automation', pt: 'Coleções + Automação' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Did you know?', pt: '🌍 Você sabia?' } },
      {
        type: 'text',
        content: {
          en: 'Spotify has 600 million users in a list.\nEvery morning, Python loops through ALL of them:\n"for user in all_users: send daily playlist"\n\nLists + for loops = the backbone of data processing. 🎵',
          pt: 'O Spotify tem 600 milhões de usuários em uma lista.\nToda manhã, Python percorre TODOS eles:\n"for usuario in todos_usuarios: enviar playlist diária"\n\nListas + for loops = a espinha dorsal do processamento de dados. 🎵'
        }
      },
      { type: 'heading', content: { en: '🧩 Like a shopping list', pt: '🧩 Como uma lista de compras' } },
      {
        type: 'text',
        content: {
          en: 'A shopping list:\n📝 [milk, eggs, bread, coffee]\n\nYou go through the list one item at a time.\nFor loops do exactly that — go through a list, one item at a time.',
          pt: 'Uma lista de compras:\n📝 [leite, ovos, pão, café]\n\nVocê percorre a lista um item por vez.\nFor loops fazem exatamente isso — percorrem uma lista, um item por vez.'
        }
      },
      {
        type: 'code',
        code: `# A list of claims to process
claims = [1200, 4500, 8000, 250, 3100]

# for loop: go through each item
for damage in claims:
    payout = damage - 250
    print("Damage:", damage, "→ Payout:", payout)`
      },
      { type: 'heading', content: { en: 'List operations', pt: 'Operações de lista' } },
      {
        type: 'code',
        code: `clients = ["Alice", "Bob", "Carlos"]

# Access by position (starts at 0!)
print(clients[0])   # Alice
print(clients[1])   # Bob
print(clients[2])   # Carlos

# Add to list
clients.append("Diana")
print(clients)  # ["Alice", "Bob", "Carlos", "Diana"]

# Count items
print(len(clients))  # 4`
      },
      {
        type: 'tip',
        content: {
          en: '📍 Lists start at index 0!\nFirst item = [0], second = [1], third = [2]\nThis trips up every beginner — but you\'ll get used to it.',
          pt: '📍 Listas começam no índice 0!\nPrimeiro item = [0], segundo = [1], terceiro = [2]\nIsso confunde todo iniciante — mas você se acostuma.'
        }
      }
    ]
  },
  exercises: [
    {
      id: 'ex8_1',
      title: { en: 'Greet All Clients', pt: 'Cumprimentar Todos os Clientes' },
      description: {
        en: '🎯 Loop through the client list and greet each one:\n"Hello, [name]! Your claim is being processed."',
        pt: '🎯 Percorra a lista de clientes e cumprimente cada um:\n"Olá, [nome]! Seu sinistro está sendo processado."'
      },
      starterCode: `clients = ["Alice", "Bob", "Carlos", "Diana"]

for name in clients:
    print("Hello, " + name + "! Your claim is being processed.")`,
      hints: [{ en: 'The variable after "for" holds each item one at a time', pt: 'A variável após "for" guarda cada item um de cada vez' }]
    },
    {
      id: 'ex8_2',
      title: { en: 'Calculate Total Payout', pt: 'Calcular Pagamento Total' },
      description: {
        en: '🎯 You have a list of damages. Calculate the total payout for all claims (subtract $250 deductible from each).',
        pt: '🎯 Você tem uma lista de danos. Calcule o pagamento total (subtraia R$250 de franquia de cada um).'
      },
      starterCode: `damages = [1200, 4500, 8000, 3100, 650]
total_payout = 0

for damage in damages:
    payout = damage - 250
    total_payout += payout

print("Total payout: $", total_payout)`,
      hints: [
        { en: 'Use += to add to the total inside the loop', pt: 'Use += para adicionar ao total dentro do loop' }
      ]
    },
    {
      id: 'ex8_3',
      title: { en: 'Build a Client List', pt: 'Construir Lista de Clientes' },
      description: {
        en: '🎯 Start with an empty list.\nAsk for 3 client names (loop 3 times) and add each to the list.\nThen print the full list.',
        pt: '🎯 Comece com uma lista vazia.\nPergunte 3 nomes de clientes (loop 3 vezes) e adicione cada um à lista.\nDepois imprima a lista completa.'
      },
      starterCode: `clients = []
count = 1

while count <= 3:
    name = input("Client " + str(count) + " name: ")
    clients.append(name)
    count += 1

print("All clients:", clients)`,
      hints: [{ en: 'Use list.append(item) to add an item to a list', pt: 'Use lista.append(item) para adicionar um item à lista' }]
    }
  ],
  quiz: [
    {
      id: 'q8_1',
      question: { en: 'How do you create a list in Python?', pt: 'Como criar uma lista em Python?' },
      options: [
        { en: '[item1, item2, item3]', pt: '[item1, item2, item3]' },
        { en: '(item1, item2, item3)', pt: '(item1, item2, item3)' },
        { en: '{item1, item2, item3}', pt: '{item1, item2, item3}' },
        { en: 'list(item1, item2)', pt: 'list(item1, item2)' }
      ],
      correctIndex: 0,
      explanation: { en: 'Lists use square brackets [ ]. Parentheses ( ) = tuple, curly braces { } = set or dict.', pt: 'Listas usam colchetes [ ]. Parênteses ( ) = tupla, chaves { } = set ou dict.' }
    },
    {
      id: 'q8_2',
      question: { en: 'items = ["a", "b", "c"]\nWhat is items[1]?', pt: 'items = ["a", "b", "c"]\nQual é items[1]?' },
      options: [
        { en: '"b"', pt: '"b"' },
        { en: '"a"', pt: '"a"' },
        { en: '"c"', pt: '"c"' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 0,
      explanation: { en: 'Lists start at index 0. items[0]="a", items[1]="b", items[2]="c".', pt: 'Listas começam no índice 0. items[0]="a", items[1]="b", items[2]="c".' }
    },
    {
      id: 'q8_3',
      question: { en: 'How to add "Diana" to: names = ["Alice"]?', pt: 'Como adicionar "Diana" a: nomes = ["Alice"]?' },
      options: [
        { en: 'names.append("Diana")', pt: 'nomes.append("Diana")' },
        { en: 'names.add("Diana")', pt: 'nomes.add("Diana")' },
        { en: 'names + "Diana"', pt: 'nomes + "Diana"' },
        { en: 'names.push("Diana")', pt: 'nomes.push("Diana")' }
      ],
      correctIndex: 0,
      explanation: { en: '.append() adds one item to the END of a list. That\'s the standard way.', pt: '.append() adiciona um item no FINAL da lista. Esse é o jeito padrão.' }
    },
    {
      id: 'q8_4',
      question: { en: 'nums = [10, 20, 30]\nfor n in nums:\n  print(n)\nHow many lines print?', pt: 'nums = [10, 20, 30]\nfor n in nums:\n  print(n)\nQuantas linhas imprimem?' },
      options: [
        { en: '3', pt: '3' },
        { en: '1', pt: '1' },
        { en: '0', pt: '0' },
        { en: '10', pt: '10' }
      ],
      correctIndex: 0,
      explanation: { en: 'The for loop runs once for each item in the list. 3 items = 3 prints.', pt: 'O loop for roda uma vez para cada item da lista. 3 itens = 3 prints.' }
    }
  ],
  exam: {
    title: { en: 'Client Greeting System', pt: 'Sistema de Saudação de Clientes' },
    scenario: {
      en: 'You have a list of insurance clients who just filed claims. Loop through and greet each one, show their payout estimate.',
      pt: 'Você tem uma lista de clientes que abriram sinistros. Percorra e cumprimente cada um, mostrando a estimativa de pagamento.'
    },
    requirements: {
      en: ['Create a list of at least 3 client names', 'Loop through the list', 'Print a greeting for each client', 'No errors'],
      pt: ['Crie uma lista com ao menos 3 nomes', 'Percorra a lista', 'Imprima saudação para cada cliente', 'Sem erros']
    },
    starterCode: `clients = ["Alice Souza", "Bob Santos", "Diana Costa"]

for client in clients:
    print("Hello, " + client + " — your claim is being processed.")`,
    testCases: [
      { id: 'tc8_1', description: { en: 'Greets Alice', pt: 'Cumprimenta Alice' }, inputs: [], checks: [{ type: 'contains', value: 'Alice' }], points: 30 },
      { id: 'tc8_2', description: { en: 'Greets Bob', pt: 'Cumprimenta Bob' }, inputs: [], checks: [{ type: 'contains', value: 'Bob' }], points: 30 },
      { id: 'tc8_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 40 }
    ]
  }
}
