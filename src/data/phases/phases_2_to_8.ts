import type { Phase } from '../types'
import type { Phase } from '../types'

// ============================================================================
// PHASE 2 — Matemática e Operadores
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase2: Phase = {
  id: 2,
  title: { en: 'Math & Operators', pt: 'Matemática e Operadores' },
  description: {
    en: 'Use Python as a calculator — for real insurance and budget calculations.',
    pt: 'Use Python como calculadora — para cálculos reais de seguros e orçamentos.'
  },
  icon: '🧮',
  libraries: [],

  lesson: {
    title: { en: 'Python as a Super Calculator', pt: 'Python como Super Calculadora' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Numbers that move the world', pt: '🌍 Números que movem o mundo' } },
      {
        type: 'text',
        content: {
          en: 'NASA used Python math to land the Mars rover within 2.4 meters of its target — after 470 million km of travel. 🚀\n\nThe same operators you\'ll learn today power banking systems, insurance payouts, and every price you see on an app.',
          pt: 'A NASA usou matemática Python para pousar o rover em Marte com 2,4 metros de precisão — após 470 milhões de km de viagem. 🚀\n\nOs mesmos operadores que você vai aprender hoje alimentam sistemas bancários, pagamentos de seguros e todo preço que você vê num app.'
        }
      },

      { type: 'heading', content: { en: '🧩 Same as your calculator — but saveable', pt: '🧩 Igual sua calculadora — mas salvável' } },
      {
        type: 'text',
        content: {
          en: 'A pocket calculator gives you the answer, then it\'s gone.\nPython gives you the answer AND lets you save it in a variable to use later.\n\nThat\'s the only difference — but it changes everything.',
          pt: 'Uma calculadora de bolso dá a resposta e acabou.\nPython dá a resposta E deixa você salvar numa variável para usar depois.\n\nEssa é a única diferença — mas muda tudo.'
        }
      },

      { type: 'heading', content: { en: '🐍 The 6 operators', pt: '🐍 Os 6 operadores' } },
      {
        type: 'code',
        code: `print(10 + 3)   # Addition       → 13
print(10 - 3)   # Subtraction    → 7
print(10 * 3)   # Multiplication → 30
print(10 / 3)   # Division       → 3.333...
print(10 // 3)  # Floor division → 3  (drops decimal)
print(10 % 3)   # Modulo         → 1  (remainder only)`
      },

      { type: 'heading', content: { en: '🏗️ Real example: insurance payout', pt: '🏗️ Exemplo real: pagamento de sinistro' } },
      {
        type: 'code',
        code: `# Water damage claim
damage    = 5230   # Total damage amount
deductible = 250   # Customer always pays this

# Step 1: subtract deductible
after_ded = damage - deductible      # 4980

# Step 2: apply 80% coverage policy
payout = after_ded * 0.80            # 3984.0

print("Company pays:", payout)        # 3984.0`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Order of operations: * and / happen BEFORE + and -.\nUse parentheses to control: (2 + 3) * 4 = 20, not 14.',
          pt: '💡 Ordem das operações: * e / acontecem ANTES de + e -.\nUse parênteses para controlar: (2 + 3) * 4 = 20, não 14.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex2_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'A roof claim came in for $4,000. Deductible: $300.\nFill in the blank to calculate what the company pays.',
        pt: 'Chegou um sinistro de telhado de R$4.000. Franquia: R$300.\nPreencha a lacuna para calcular o que a empresa paga.'
      },
      starterCode: `damage = 4000
deductible = 300

company_pays = ___   # damage minus deductible

print("Company pays:", company_pays)`,
      hints: [
        { en: 'Use the subtraction operator: damage - deductible', pt: 'Use o operador de subtração: damage - deductible' }
      ],
      sampleOutput: { en: 'Company pays: 3700', pt: 'Company pays: 3700' }
    },
    {
      id: 'ex2_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'A construction project has a $180,000 budget.\nCalculate and print each section:\n• Materials: 40%\n• Labor: 35%\n• Equipment: 15%\n• Admin: 10%',
        pt: 'Uma obra tem orçamento de R$180.000.\nCalcule e imprima cada seção:\n• Materiais: 40%\n• Mão de obra: 35%\n• Equipamento: 15%\n• Admin: 10%'
      },
      starterCode: `budget = 180000

# Calculate each section (hint: 40% = 0.40)
materials  = 
labor      = 
equipment  = 
admin      = 

print("Materials:", materials)
print("Labor:", labor)
print("Equipment:", equipment)
print("Admin:", admin)`,
      hints: [
        { en: 'Multiply budget by 0.40 for 40%', pt: 'Multiplique o orçamento por 0.40 para 40%' },
        { en: 'All 4 percentages should add up to 100% (1.0)', pt: 'Os 4 percentuais devem somar 100% (1.0)' }
      ],
      sampleOutput: { en: 'Materials: 72000.0\nLabor: 63000.0\nEquipment: 27000.0\nAdmin: 18000.0', pt: 'Materials: 72000.0\nLabor: 63000.0\nEquipment: 27000.0\nAdmin: 18000.0' }
    }
  ],

  quiz: [
    {
      id: 'q2_1',
      question: { en: 'What does 10 // 3 return?', pt: 'O que 10 // 3 retorna?' },
      options: [
        { en: '3  (whole number only)', pt: '3  (apenas parte inteira)' },
        { en: '3.33', pt: '3.33' },
        { en: '1', pt: '1' },
        { en: '0', pt: '0' }
      ],
      correctIndex: 0,
      explanation: { en: '// is floor division — it discards the decimal. 10 ÷ 3 = 3.33 → floor = 3.', pt: '// é divisão inteira — descarta o decimal. 10 ÷ 3 = 3.33 → inteiro = 3.' }
    },
    {
      id: 'q2_2',
      question: { en: 'What does 10 % 3 return?', pt: 'O que 10 % 3 retorna?' },
      options: [
        { en: '1  (the remainder)', pt: '1  (o resto)' },
        { en: '3', pt: '3' },
        { en: '0.33', pt: '0.33' },
        { en: '10%', pt: '10%' }
      ],
      correctIndex: 0,
      explanation: { en: '% is modulo — returns only the remainder. 10 = 3×3 + 1, so the remainder is 1.', pt: '% é módulo — retorna apenas o resto. 10 = 3×3 + 1, então o resto é 1.' }
    },
    {
      id: 'q2_3',
      question: { en: 'Result of: (4 + 6) * 2?', pt: 'Resultado de: (4 + 6) * 2?' },
      options: [
        { en: '20', pt: '20' },
        { en: '16', pt: '16' },
        { en: '12', pt: '12' },
        { en: '48', pt: '48' }
      ],
      correctIndex: 0,
      explanation: { en: 'Parentheses first: (4+6)=10, then 10×2=20.', pt: 'Parênteses primeiro: (4+6)=10, depois 10×2=20.' }
    },
    {
      id: 'q2_4',
      question: { en: 'damage = 5000, coverage = 0.80\npayout = damage * coverage → result?', pt: 'damage = 5000, coverage = 0.80\npayout = damage * coverage → resultado?' },
      options: [
        { en: '4000.0', pt: '4000.0' },
        { en: '5000.8', pt: '5000.8' },
        { en: '400.0', pt: '400.0' },
        { en: '0.80', pt: '0.80' }
      ],
      correctIndex: 0,
      explanation: { en: '5000 × 0.80 = 4000.0. This is exactly how 80% insurance coverage is calculated.', pt: '5000 × 0.80 = 4000.0. É exatamente assim que cobertura de 80% é calculada.' }
    }
  ],

  exam: {
    title: { en: 'Multi-Site Budget Report', pt: 'Relatório Multi-Site' },
    scenario: {
      en: 'You\'re managing 4 renovation sites. Build a budget report showing each site\'s allocation, the total, the average, and a 10% contingency reserve.',
      pt: 'Você gerencia 4 obras. Crie um relatório de orçamento com a alocação de cada site, o total, a média e uma reserva de contingência de 10%.'
    },
    requirements: {
      en: ['Print budget for each of the 4 sites', 'Print total (sum of all 4)', 'Print average per site', 'Print 10% contingency reserve', 'Print remaining after reserve'],
      pt: ['Imprima o orçamento de cada um dos 4 sites', 'Imprima o total (soma dos 4)', 'Imprima a média por site', 'Imprima a reserva de contingência de 10%', 'Imprima o restante após a reserva']
    },
    starterCode: `site1 = 50000
site2 = 75000
site3 = 60000
site4 = 45000

total       = site1 + site2 + site3 + site4
average     = total / 4
reserve     = total * 0.10
remaining   = total - reserve

print(site1)
print(site2)
print(site3)
print(site4)
print(total)
print(average)
print(reserve)
print(remaining)`,
    testCases: [
      { id: 'tc2_1', description: { en: 'Shows all 4 sites', pt: 'Mostra os 4 sites' }, inputs: [], checks: [{ type: 'contains', value: '50000' }], points: 10 },
      { id: 'tc2_2', description: { en: 'Shows 75000', pt: 'Mostra 75000' }, inputs: [], checks: [{ type: 'contains', value: '75000' }], points: 10 },
      { id: 'tc2_3', description: { en: 'Total = 230000', pt: 'Total = 230000' }, inputs: [], checks: [{ type: 'contains', value: '230000' }], points: 20 },
      { id: 'tc2_4', description: { en: 'Average = 57500', pt: 'Média = 57500' }, inputs: [], checks: [{ type: 'contains_any', value: ['57500', '57500.0'] }], points: 20 },
      { id: 'tc2_5', description: { en: 'Reserve = 23000', pt: 'Reserva = 23000' }, inputs: [], checks: [{ type: 'contains_any', value: ['23000', '23000.0'] }], points: 20 },
      { id: 'tc2_6', description: { en: 'Remaining = 207000', pt: 'Restante = 207000' }, inputs: [], checks: [{ type: 'contains_any', value: ['207000', '207000.0'] }], points: 10 },
      { id: 'tc2_7', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 }
    ]
  }
}

// ============================================================================
// PHASE 3 — Variáveis
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase3: Phase = {
  id: 3,
  title: { en: 'Variables', pt: 'Variáveis' },
  description: {
    en: 'Store information and reuse it — the building block of every program.',
    pt: 'Armazene informações e as reutilize — o bloco fundamental de todo programa.'
  },
  icon: '📦',
  libraries: [],

  lesson: {
    title: { en: 'Variables: Labelled Boxes', pt: 'Variáveis: Caixas com Etiqueta' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Every app runs on variables', pt: '🌍 Todo app roda com variáveis' } },
      {
        type: 'text',
        content: {
          en: 'Right now, WhatsApp has a variable storing your name.\nInstagram has one for your follower count.\nNetflix has one for what you watched last.\n\nMillions of variables — all created the same way you\'re about to learn.',
          pt: 'Agora mesmo, o WhatsApp tem uma variável com seu nome.\nO Instagram tem uma com seu número de seguidores.\nA Netflix tem uma com o que você assistiu por último.\n\nMilhões de variáveis — todas criadas do mesmo jeito que você vai aprender.'
        }
      },

      { type: 'heading', content: { en: '🧩 A labelled shoe box', pt: '🧩 Uma caixa de sapato etiquetada' } },
      {
        type: 'text',
        content: {
          en: 'Imagine a shelf with labelled boxes:\n📦 "name" box → holds "Alice"\n📦 "age" box → holds 28\n📦 "balance" box → holds 4980.50\n\nA variable = a box with a label.\nYou put something in. You take it out whenever you need.',
          pt: 'Imagine uma prateleira com caixas etiquetadas:\n📦 Caixa "nome" → guarda "Alice"\n📦 Caixa "idade" → guarda 28\n📦 Caixa "saldo" → guarda 4980.50\n\nVariável = caixa com etiqueta.\nVocê coloca algo dentro. Pega quando precisar.'
        }
      },

      { type: 'heading', content: { en: '🐍 Creating and using variables', pt: '🐍 Criando e usando variáveis' } },
      {
        type: 'code',
        code: `# Create a variable: label = value
client_name = "Alice Costa"   # text → needs quotes
claim_amount = 5230            # number → no quotes
is_approved = True             # True or False (no quotes)

# Use variables by typing their label
print(client_name)             # Alice Costa
print(claim_amount)            # 5230
print(is_approved)             # True

# Calculate with them
deductible = 250
payout = claim_amount - deductible
print("Payout:", payout)       # Payout: 4980`
      },
      {
        type: 'tip',
        content: {
          en: '📏 Naming rules:\n✅ client_name  ✅ totalCost  ✅ amount1\n❌ 1name  ❌ client-name  ❌ my name\nNo spaces. No hyphens. Don\'t start with a number.',
          pt: '📏 Regras de nomes:\n✅ nome_cliente  ✅ totalCusto  ✅ valor1\n❌ 1nome  ❌ nome-cliente  ❌ meu nome\nSem espaços. Sem hífens. Não comece com número.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex3_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'A new client just registered. Fill in the variable values below.',
        pt: 'Um novo cliente acabou de se cadastrar. Preencha os valores das variáveis abaixo.'
      },
      starterCode: `# Fill in the blanks with real values:
client_name    = ___        # any name as text
policy_number  = ___        # any number
city           = ___        # any city as text
is_active      = ___        # True or False

print(client_name)
print(policy_number)
print(city)
print(is_active)`,
      hints: [
        { en: 'Text values need quotes: "Maria Silva"', pt: 'Valores de texto precisam de aspas: "Maria Silva"' },
        { en: 'True and False have capital T and F — no quotes', pt: 'True e False têm T e F maiúsculos — sem aspas' }
      ],
      sampleOutput: { en: 'Maria Silva\n10023\nCuritiba\nTrue', pt: 'Maria Silva\n10023\nCuritiba\nTrue' }
    },
    {
      id: 'ex3_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Create a mini client profile:\n• name, age, city (any values you choose)\n• monthly_premium = 450\n• Calculate: annual_premium = monthly * 12\n• Print everything',
        pt: 'Crie um mini perfil de cliente:\n• nome, idade, cidade (valores que você escolher)\n• premium_mensal = 450\n• Calcule: premium_anual = mensal * 12\n• Imprima tudo'
      },
      starterCode: `# Build the client profile:`,
      hints: [
        { en: '5 variables: name, age, city, monthly_premium, annual_premium', pt: '5 variáveis: nome, idade, cidade, premium_mensal, premium_anual' },
        { en: 'Calculate annual: monthly_premium * 12', pt: 'Calcule anual: premium_mensal * 12' }
      ],
      sampleOutput: { en: 'João Silva\n35\nSão Paulo\n450\n5400', pt: 'João Silva\n35\nSão Paulo\n450\n5400' }
    }
  ],

  quiz: [
    {
      id: 'q3_1',
      question: { en: 'What does x = 10 do?', pt: 'O que x = 10 faz?' },
      options: [
        { en: 'Stores the value 10 in a box labelled x', pt: 'Armazena o valor 10 numa caixa chamada x' },
        { en: 'Checks if x equals 10', pt: 'Verifica se x é igual a 10' },
        { en: 'Prints 10 on screen', pt: 'Imprime 10 na tela' },
        { en: 'Does nothing', pt: 'Não faz nada' }
      ],
      correctIndex: 0,
      explanation: { en: '= is assignment — it stores a value. == is comparison — it checks equality. Very different!', pt: '= é atribuição — armazena um valor. == é comparação — verifica igualdade. Muito diferentes!' }
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
      explanation: { en: 'Only letters, numbers, and underscores. Must start with a letter or underscore. No spaces or hyphens.', pt: 'Apenas letras, números e underscores. Deve começar com letra ou underscore. Sem espaços ou hífens.' }
    },
    {
      id: 'q3_3',
      question: { en: 'x = 100\nx = x + 50\nprint(x) → result?', pt: 'x = 100\nx = x + 50\nprint(x) → resultado?' },
      options: [
        { en: '150', pt: '150' },
        { en: '100', pt: '100' },
        { en: '50', pt: '50' },
        { en: 'x + 50', pt: 'x + 50' }
      ],
      correctIndex: 0,
      explanation: { en: 'x starts at 100. Then x = 100 + 50 = 150. Variables can be updated anytime.', pt: 'x começa em 100. Depois x = 100 + 50 = 150. Variáveis podem ser atualizadas a qualquer hora.' }
    },
    {
      id: 'q3_4',
      question: { en: 'What are the 4 basic data types in Python?', pt: 'Quais são os 4 tipos de dados básicos em Python?' },
      options: [
        { en: 'str, int, float, bool', pt: 'str, int, float, bool' },
        { en: 'text, number, decimal, logic', pt: 'texto, número, decimal, lógica' },
        { en: 'string, integer, character, boolean', pt: 'string, inteiro, caractere, booleano' },
        { en: 'word, num, dec, true/false', pt: 'palavra, num, dec, verdadeiro/falso' }
      ],
      correctIndex: 0,
      explanation: { en: 'str (text), int (whole number), float (decimal), bool (True/False). These 4 cover almost everything.', pt: 'str (texto), int (inteiro), float (decimal), bool (True/False). Esses 4 cobrem quase tudo.' }
    }
  ],

  exam: {
    title: { en: 'Client File Creation', pt: 'Criação de Ficha de Cliente' },
    scenario: {
      en: 'First day at the insurance company. Your task: create a digital profile for a new client and calculate their first-year premium.',
      pt: 'Primeiro dia na seguradora. Sua tarefa: criar um perfil digital para um novo cliente e calcular o prêmio do primeiro ano.'
    },
    requirements: {
      en: [
        'Create variable: name = "Ricardo Alves"',
        'Create variable: age = 32',
        'Create variable: city = "Oshawa"',
        'Create variable: monthly_premium = 385',
        'Calculate annual_premium (monthly × 12)',
        'Print all 5 values'
      ],
      pt: [
        'Crie a variável: nome = "Ricardo Alves"',
        'Crie a variável: idade = 32',
        'Crie a variável: cidade = "Oshawa"',
        'Crie a variável: premium_mensal = 385',
        'Calcule premium_anual (mensal × 12)',
        'Imprima todos os 5 valores'
      ]
    },
    starterCode: `# New client profile
name           = 
age            = 
city           = 
monthly_premium = 

annual_premium  = 

print(name)
print(age)
print(city)
print(monthly_premium)
print(annual_premium)`,
    testCases: [
      { id: 'tc3_1', description: { en: 'Shows name', pt: 'Mostra nome' }, inputs: [], checks: [{ type: 'contains', value: 'Ricardo' }], points: 15 },
      { id: 'tc3_2', description: { en: 'Shows age 32', pt: 'Mostra idade 32' }, inputs: [], checks: [{ type: 'contains', value: '32' }], points: 15 },
      { id: 'tc3_3', description: { en: 'Shows city', pt: 'Mostra cidade' }, inputs: [], checks: [{ type: 'contains', value: 'Oshawa' }], points: 15 },
      { id: 'tc3_4', description: { en: 'Annual = 4620', pt: 'Anual = 4620' }, inputs: [], checks: [{ type: 'contains', value: '4620' }], points: 40 },
      { id: 'tc3_5', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 15 }
    ]
  }
}

// ============================================================================
// PHASE 4 — Input do Usuário
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase4: Phase = {
  id: 4,
  title: { en: 'Getting User Input', pt: 'Entrada do Usuário' },
  description: {
    en: 'Make your program interactive — ask and receive answers from users.',
    pt: 'Torne seu programa interativo — pergunte e receba respostas dos usuários.'
  },
  icon: '⌨️',
  libraries: [],

  lesson: {
    title: { en: 'input() — Your Program Asks Questions', pt: 'input() — Seu Programa Faz Perguntas' },
    blocks: [

      { type: 'heading', content: { en: '🌍 The invisible input() in your life', pt: '🌍 O input() invisível na sua vida' } },
      {
        type: 'text',
        content: {
          en: 'Every form you fill online — Google login, bank transfer, delivery address — is input() in disguise.\n\nThe website asks → you type → the program stores your answer and acts on it.\nThat\'s the entire internet, simplified.',
          pt: 'Todo formulário online — login do Google, transferência bancária, endereço de entrega — é input() disfarçado.\n\nO site pergunta → você digita → o programa armazena e age.\nÉ a internet inteira, simplificada.'
        }
      },

      { type: 'heading', content: { en: '🧩 A receptionist taking notes', pt: '🧩 Uma recepcionista anotando' } },
      {
        type: 'text',
        content: {
          en: 'Imagine a receptionist at an insurance office:\n"Your name?" → writes it down\n"Damage amount?" → writes it down\n"When did it happen?" → writes it down\n\ninput() does exactly that — asks, waits, and stores your answer.',
          pt: 'Imagine uma recepcionista numa seguradora:\n"Seu nome?" → anota\n"Valor do dano?" → anota\n"Quando aconteceu?" → anota\n\ninput() faz exatamente isso — pergunta, espera e armazena.'
        }
      },

      { type: 'heading', content: { en: '🐍 How input() works', pt: '🐍 Como input() funciona' } },
      {
        type: 'code',
        code: `# input() always returns TEXT (string)
name = input("Client name: ")
print("Hello,", name)

# ⚠️  To use as a NUMBER, you must convert:
damage_str = input("Damage amount: $")
damage = int(damage_str)       # convert text → whole number

deductible = 250
payout = damage - deductible
print("Company pays: $", payout)`
      },
      {
        type: 'warning',
        content: {
          en: '⚠️ Critical rule: input() ALWAYS returns text.\nIf you try to do math without converting, Python crashes.\nAlways use int() or float() before arithmetic.',
          pt: '⚠️ Regra crítica: input() SEMPRE retorna texto.\nSe tentar fazer matemática sem converter, Python quebra.\nSempre use int() ou float() antes de aritmética.'
        }
      },
      {
        type: 'code',
        code: `# Shorthand: combine input + conversion in one line
age    = int(input("Your age: "))         # whole number
height = float(input("Height in meters: ")) # decimal

# Now you can do math:
print("In 10 years you'll be:", age + 10)`
      }
    ]
  },

  exercises: [
    {
      id: 'ex4_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'The code below asks for a damage amount but is missing the conversion.\nFill in the blank so we can do the math.',
        pt: 'O código abaixo pede um valor de dano mas está faltando a conversão.\nPreencha a lacuna para que possamos fazer a matemática.'
      },
      starterCode: `damage = ___(input("Damage amount: $"))  # convert to integer
deductible = 250

payout = damage - deductible
print("Payout:", payout)`,
      hints: [
        { en: 'Use int() to convert the text to a whole number', pt: 'Use int() para converter o texto em número inteiro' }
      ],
      sampleOutput: { en: 'Payout: 4750', pt: 'Payout: 4750' }
    },
    {
      id: 'ex4_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build a mini claim intake form:\n1. Ask for client name (text)\n2. Ask for damage amount (number)\n3. Subtract $300 deductible\n4. Print: "Client: [name] — Payout: $[amount]"',
        pt: 'Construa um mini formulário de sinistro:\n1. Pergunte o nome do cliente (texto)\n2. Pergunte o valor do dano (número)\n3. Subtraia R$300 de franquia\n4. Imprima: "Cliente: [nome] — Pagamento: R$[valor]"'
      },
      starterCode: `# Mini claim intake form`,
      hints: [
        { en: 'name = input("Client name: ")', pt: 'nome = input("Nome do cliente: ")' },
        { en: 'damage = int(input("Damage: $"))', pt: 'dano = int(input("Dano: R$"))' },
        { en: 'Use print() with multiple values separated by commas', pt: 'Use print() com múltiplos valores separados por vírgulas' }
      ],
      sampleOutput: { en: 'Client: Maria Silva — Payout: $4700', pt: 'Cliente: Maria Silva — Pagamento: R$4700' }
    }
  ],

  quiz: [
    {
      id: 'q4_1',
      question: { en: 'What type does input() ALWAYS return?', pt: 'Que tipo input() SEMPRE retorna?' },
      options: [
        { en: 'str (text)', pt: 'str (texto)' },
        { en: 'int (integer)', pt: 'int (inteiro)' },
        { en: 'Whatever the user types', pt: 'O que o usuário digitar' },
        { en: 'float (decimal)', pt: 'float (decimal)' }
      ],
      correctIndex: 0,
      explanation: { en: 'input() ALWAYS returns str, even if the user types "42". You must convert with int() or float() to do math.', pt: 'input() SEMPRE retorna str, mesmo se o usuário digitar "42". Você deve converter com int() ou float() para fazer matemática.' }
    },
    {
      id: 'q4_2',
      question: { en: 'x = input("Value: ") with input "5"\nprint(x + 5) → what happens?', pt: 'x = input("Valor: ") com entrada "5"\nprint(x + 5) → o que acontece?' },
      options: [
        { en: 'Error — can\'t add text + number', pt: 'Erro — não pode somar texto + número' },
        { en: 'Prints 10', pt: 'Imprime 10' },
        { en: 'Prints "55"', pt: 'Imprime "55"' },
        { en: 'Prints 5', pt: 'Imprime 5' }
      ],
      correctIndex: 0,
      explanation: { en: 'x holds the string "5", not the number 5. "5" + 5 is a TypeError. Fix: x = int(input("Value: "))', pt: 'x guarda a string "5", não o número 5. "5" + 5 é um TypeError. Corrija: x = int(input("Valor: "))' }
    },
    {
      id: 'q4_3',
      question: { en: 'How to ask for a decimal number (like 3.14)?', pt: 'Como pedir um número decimal (como 3.14)?' },
      options: [
        { en: 'float(input("Value: "))', pt: 'float(input("Valor: "))' },
        { en: 'int(input("Value: "))', pt: 'int(input("Valor: "))' },
        { en: 'decimal(input("Value: "))', pt: 'decimal(input("Valor: "))' },
        { en: 'input("Value: ") directly', pt: 'input("Valor: ") diretamente' }
      ],
      correctIndex: 0,
      explanation: { en: 'float() converts text to decimal. int() converts to whole number. For "3.14", you need float().', pt: 'float() converte texto para decimal. int() converte para inteiro. Para "3.14", você precisa de float().' }
    },
    {
      id: 'q4_4',
      question: { en: 'The message inside input() — what does it do?', pt: 'A mensagem dentro de input() — o que ela faz?' },
      options: [
        { en: 'Shows a prompt so the user knows what to type', pt: 'Mostra um prompt para o usuário saber o que digitar' },
        { en: 'Sets a default value', pt: 'Define um valor padrão' },
        { en: 'Required — without it, Python crashes', pt: 'Obrigatória — sem ela, Python quebra' },
        { en: 'Nothing — it\'s just decoration', pt: 'Nada — é só decoração' }
      ],
      correctIndex: 0,
      explanation: { en: 'The message is optional but always recommended. It tells users what to type. input() with no message just shows a blank cursor.', pt: 'A mensagem é opcional mas sempre recomendada. Diz ao usuário o que digitar. input() sem mensagem mostra só um cursor em branco.' }
    }
  ],

  exam: {
    title: { en: 'Interactive Claim Form', pt: 'Formulário Interativo' },
    scenario: {
      en: 'Build an interactive claim intake system. Ask for all details, calculate the payout, and display a summary.',
      pt: 'Construa um sistema interativo de abertura de sinistros. Pergunte todos os detalhes, calcule o pagamento e exiba um resumo.'
    },
    requirements: {
      en: [
        'Ask for client name (text)',
        'Ask for damage amount (convert to number)',
        'Ask for deductible (convert to number)',
        'Calculate: payout = damage - deductible',
        'Print a summary showing name and payout'
      ],
      pt: [
        'Pergunte o nome do cliente (texto)',
        'Pergunte o valor do dano (converta para número)',
        'Pergunte a franquia (converta para número)',
        'Calcule: pagamento = dano - franquia',
        'Imprima um resumo com nome e pagamento'
      ]
    },
    starterCode: `name       = input("Client name: ")
damage     = int(input("Damage amount: $"))
deductible = int(input("Deductible: $"))

payout = damage - deductible

print("Client:", name)
print("Payout: $", payout)`,
    testCases: [
      { id: 'tc4_1', description: { en: 'Correct payout calculation', pt: 'Cálculo de pagamento correto' }, inputs: ['Ana Lima', '5000', '250'], checks: [{ type: 'contains', value: '4750' }], points: 40 },
      { id: 'tc4_2', description: { en: 'Shows client name', pt: 'Mostra nome do cliente' }, inputs: ['Ana Lima', '5000', '250'], checks: [{ type: 'contains', value: 'Ana' }], points: 30 },
      { id: 'tc4_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['Test', '1000', '200'], checks: [{ type: 'no_error', value: '' }], points: 30 }
    ]
  }
}

// ============================================================================
// PHASE 5 — If / Else
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase5: Phase = {
  id: 5,
  title: { en: 'If / Else', pt: 'If / Else' },
  description: {
    en: 'Teach your program to make decisions based on conditions.',
    pt: 'Ensine seu programa a tomar decisões baseadas em condições.'
  },
  icon: '🚦',
  libraries: [],

  lesson: {
    title: { en: 'The Decision Maker', pt: 'O Tomador de Decisões' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Netflix runs on if/else', pt: '🌍 A Netflix roda com if/else' } },
      {
        type: 'text',
        content: {
          en: 'Every recommendation you get from Netflix, Spotify or YouTube is an if/else decision.\n\n"IF user watched 3 thrillers → recommend more thrillers\nELSE → show trending content"\n\n400 million users, billions of if/else decisions per second.',
          pt: 'Toda recomendação que você recebe da Netflix, Spotify ou YouTube é uma decisão if/else.\n\n"SE usuário assistiu 3 thrillers → recomende mais thrillers\nSENÃO → mostre conteúdo em alta"\n\n400 milhões de usuários, bilhões de decisões if/else por segundo.'
        }
      },

      { type: 'heading', content: { en: '🧩 A traffic light', pt: '🧩 Um semáforo' } },
      {
        type: 'text',
        content: {
          en: 'A traffic light has one rule:\n🔴 IF light is red → STOP\n🟢 IF light is green → GO\n\nYour program works exactly like that:\nIF condition is True → do THIS\nELSE → do THAT\n\nOnly ONE path runs. Never both.',
          pt: 'Um semáforo tem uma regra:\n🔴 SE sinal é vermelho → PARE\n🟢 SE sinal é verde → PASSE\n\nSeu programa funciona exatamente assim:\nSE condição é True → faça ISSO\nSENÃO → faça AQUILO\n\nApenas UM caminho roda. Nunca os dois.'
        }
      },

      { type: 'heading', content: { en: '🐍 if/else in Python', pt: '🐍 if/else em Python' } },
      {
        type: 'code',
        code: `damage = 8000

if damage > 5000:
    print("🔴 HIGH PRIORITY")
    print("Send expert adjuster")
else:
    print("🟢 Standard claim")
    print("Process normally")`
      },

      { type: 'heading', content: { en: '📐 Comparison operators', pt: '📐 Operadores de comparação' } },
      {
        type: 'code',
        code: `x = 10

print(x > 5)    # True  — greater than
print(x < 5)    # False — less than
print(x >= 10)  # True  — greater or equal
print(x <= 10)  # True  — less or equal
print(x == 10)  # True  — exactly equal
print(x != 5)   # True  — NOT equal`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Indentation is NOT optional.\nThe 4 spaces before print() tell Python "this belongs to the if block".\nMissing indentation = error.',
          pt: '💡 Indentação NÃO é opcional.\nOs 4 espaços antes de print() dizem ao Python "isto pertence ao bloco if".\nIndentação faltando = erro.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex5_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Complete the condition to flag claims above the coverage limit.',
        pt: 'Complete a condição para sinalizar sinistros acima do limite de cobertura.'
      },
      starterCode: `damage = int(input("Damage: $"))
limit = 10000

if damage ___ limit:        # fill in the operator
    print("⚠️  Exceeds limit — needs approval")
else:
    print("✅ Within coverage")`,
      hints: [
        { en: 'Use > to check if damage is greater than limit', pt: 'Use > para verificar se o dano é maior que o limite' }
      ],
      sampleOutput: { en: '⚠️  Exceeds limit — needs approval', pt: '⚠️  Exceeds limit — needs approval' }
    },
    {
      id: 'ex5_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build a fraud detection check:\n• Ask for days since policy started\n• If less than 30 days → print "⚠️ Fraud risk — escalate"\n• Else → print "✅ Claim timing is normal"',
        pt: 'Construa uma verificação de fraude:\n• Pergunte os dias desde o início da apólice\n• Se menos de 30 dias → imprima "⚠️ Risco de fraude — escale"\n• Senão → imprima "✅ Tempo do sinistro é normal"'
      },
      starterCode: `# Fraud detection check`,
      hints: [
        { en: 'days = int(input("Days since policy start: "))', pt: 'dias = int(input("Dias desde início da apólice: "))' },
        { en: 'Use if days < 30:', pt: 'Use if dias < 30:' }
      ],
      sampleOutput: { en: '⚠️ Fraud risk — escalate', pt: '⚠️ Risco de fraude — escale' }
    }
  ],

  quiz: [
    {
      id: 'q5_1',
      question: { en: 'What does >= mean?', pt: 'O que >= significa?' },
      options: [
        { en: 'Greater than OR equal to', pt: 'Maior que OU igual a' },
        { en: 'Greater than only', pt: 'Apenas maior que' },
        { en: 'Equal to only', pt: 'Apenas igual a' },
        { en: 'Not equal to', pt: 'Não igual a' }
      ],
      correctIndex: 0,
      explanation: { en: '>= is True when left is greater than OR equal to right. So 10 >= 10 is True, and 11 >= 10 is also True.', pt: '>= é True quando a esquerda é maior que OU igual à direita. Então 10 >= 10 é True, e 11 >= 10 também é True.' }
    },
    {
      id: 'q5_2',
      question: { en: 'When does the else block run?', pt: 'Quando o bloco else executa?' },
      options: [
        { en: 'When the if condition is False', pt: 'Quando a condição if é False' },
        { en: 'When the if condition is True', pt: 'Quando a condição if é True' },
        { en: 'Always, no matter what', pt: 'Sempre, independente do que' },
        { en: 'Never — else is just decoration', pt: 'Nunca — else é só decoração' }
      ],
      correctIndex: 0,
      explanation: { en: 'else runs ONLY when the if condition is False. If if runs → else is skipped. They never both run.', pt: 'else executa SOMENTE quando a condição if é False. Se if executa → else é pulado. Os dois nunca rodam juntos.' }
    },
    {
      id: 'q5_3',
      question: { en: 'x = 5\nif x == 10:\n    print("ten")\nWhat happens?', pt: 'x = 5\nif x == 10:\n    print("dez")\nO que acontece?' },
      options: [
        { en: 'Nothing — the condition is False', pt: 'Nada — a condição é False' },
        { en: 'Prints "ten"', pt: 'Imprime "dez"' },
        { en: 'Prints 5', pt: 'Imprime 5' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 0,
      explanation: { en: '5 == 10 is False. The if block is skipped. No else exists, so nothing prints.', pt: '5 == 10 é False. O bloco if é pulado. Não há else, então nada imprime.' }
    },
    {
      id: 'q5_4',
      question: { en: 'What is WRONG with this code?\nif x > 5\n    print("big")', pt: 'O que está ERRADO neste código?\nif x > 5\n    print("grande")' },
      options: [
        { en: 'Missing colon : after the condition', pt: 'Faltando dois pontos : após a condição' },
        { en: 'Wrong indentation', pt: 'Indentação errada' },
        { en: 'x is not defined', pt: 'x não está definido' },
        { en: 'Nothing is wrong', pt: 'Nada está errado' }
      ],
      correctIndex: 0,
      explanation: { en: 'Every if needs a colon at the end: if x > 5: — Without the colon, Python doesn\'t know the condition is over.', pt: 'Todo if precisa de dois pontos no final: if x > 5: — Sem os dois pontos, Python não sabe que a condição terminou.' }
    }
  ],

  exam: {
    title: { en: 'Smart Claim Validator', pt: 'Validador Inteligente de Sinistros' },
    scenario: {
      en: 'Build a claim approval gateway. The system asks for the damage amount and automatically routes it: over $10,000 needs management sign-off; under is automatically approved.',
      pt: 'Construa um gateway de aprovação de sinistros. O sistema pede o valor do dano e encaminha automaticamente: acima de R$10.000 precisa de aprovação gerencial; abaixo é aprovado automaticamente.'
    },
    requirements: {
      en: ['Ask for damage amount', 'If > $10,000 → "REQUIRES MANAGEMENT APPROVAL"', 'Else → "AUTO-APPROVED — processing"'],
      pt: ['Pergunte o valor do dano', 'Se > R$10.000 → "REQUER APROVAÇÃO GERENCIAL"', 'Senão → "APROVADO AUTOMATICAMENTE — processando"']
    },
    starterCode: `damage = int(input("Damage amount: $"))

if damage > 10000:
    print("REQUIRES MANAGEMENT APPROVAL")
else:
    print("AUTO-APPROVED — processing")`,
    testCases: [
      { id: 'tc5_1', description: { en: 'High damage → approval required', pt: 'Dano alto → aprovação necessária' }, inputs: ['15000'], checks: [{ type: 'contains', value: 'APPROVAL' }], points: 35 },
      { id: 'tc5_2', description: { en: 'Normal damage → auto approved', pt: 'Dano normal → aprovado automaticamente' }, inputs: ['3000'], checks: [{ type: 'contains', value: 'AUTO' }], points: 35 },
      { id: 'tc5_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['5000'], checks: [{ type: 'no_error', value: '' }], points: 30 }
    ]
  }
}

// ============================================================================
// PHASE 6 — If / Elif / Else
// TEMPLATE B: Conceito Composto (extends if with multiple branches)
// ============================================================================

export const phase6: Phase = {
  id: 6,
  title: { en: 'If / Elif / Else', pt: 'If / Elif / Else' },
  description: {
    en: 'Handle more than 2 outcomes — the full power of conditional logic.',
    pt: 'Lide com mais de 2 resultados — o poder total da lógica condicional.'
  },
  icon: '⚙️',
  libraries: [],

  lesson: {
    title: { en: 'Multiple Branches', pt: 'Múltiplos Caminhos' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Uber uses elif for every ride price', pt: '🌍 O Uber usa elif para cada preço' } },
      {
        type: 'text',
        content: {
          en: 'Uber calculates your price through a chain of conditions:\n• Under 2km → base fare\n• 2–5km → standard rate\n• 5–15km → medium rate\n• Over 15km → long distance\n• Surge active? → multiply everything\n\nThat\'s elif in production, serving 130 million users.',
          pt: 'O Uber calcula seu preço por uma cadeia de condições:\n• Menos de 2km → tarifa base\n• 2–5km → tarifa padrão\n• 5–15km → tarifa média\n• Mais de 15km → longa distância\n• Surge ativo? → multiplica tudo\n\nIsso é elif em produção, servindo 130 milhões de usuários.'
        }
      },

      // ── ANALOGIA MÃE ──────────────────────────────────────────────────────
      { type: 'heading', content: { en: '🧩 A sorting conveyor belt', pt: '🧩 Uma esteira classificadora' } },
      {
        type: 'text',
        content: {
          en: 'Imagine a factory conveyor belt sorting packages:\n📦 Heavy → Dock A\n📦 Medium → Dock B\n📦 Light → Dock C\n📦 Unknown → Rejected\n\nThe belt checks each condition IN ORDER and stops at the first match.\nelif works exactly the same — top to bottom, first True wins.',
          pt: 'Imagine uma esteira de fábrica classificando pacotes:\n📦 Pesado → Doca A\n📦 Médio → Doca B\n📦 Leve → Doca C\n📦 Desconhecido → Rejeitado\n\nA esteira verifica cada condição EM ORDEM e para no primeiro match.\nelif funciona exatamente assim — de cima para baixo, o primeiro True vence.'
        }
      },

      // ── CÓDIGO PROGRESSIVO (Template B) ───────────────────────────────────
      { type: 'heading', content: { en: '🐍 Step 1 — just if/else (you already know this)', pt: '🐍 Passo 1 — só if/else (você já sabe)' } },
      {
        type: 'code',
        code: `damage = 4500

if damage > 5000:
    print("Urgent")
else:
    print("Normal")   # ← everything else goes here`
      },

      { type: 'heading', content: { en: '🐍 Step 2 — add elif for a middle case', pt: '🐍 Passo 2 — adicione elif para um caso do meio' } },
      {
        type: 'code',
        code: `damage = 4500

if damage > 10000:
    print("Critical")
elif damage > 5000:       # ← new middle case
    print("Urgent")
else:
    print("Normal")`
      },

      { type: 'heading', content: { en: '🐍 Step 3 — full priority system (4 levels)', pt: '🐍 Passo 3 — sistema completo (4 níveis)' } },
      {
        type: 'code',
        code: `damage = 4500

if damage > 10000:
    priority = "Critical"
    sla = "2 hours"
elif damage > 5000:
    priority = "Urgent"
    sla = "4 hours"
elif damage >= 1000:
    priority = "Normal"
    sla = "24 hours"
else:
    priority = "Low"
    sla = "72 hours"

print("Priority:", priority)
print("SLA:", sla)`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Order is critical! Put the MOST SPECIFIC condition first.\nIf you put > 1000 before > 5000, damage of 8000 would match the first condition and never reach "Urgent".',
          pt: '💡 A ordem é crítica! Coloque a condição MAIS ESPECÍFICA primeiro.\nSe colocar > 1000 antes de > 5000, um dano de 8000 corresponderia à primeira condição e nunca chegaria a "Urgent".'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex6_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Complete the missing condition in this grading system.',
        pt: 'Complete a condição faltante neste sistema de notas.'
      },
      starterCode: `score = int(input("Score (0-100): "))

if score >= 90:
    print("A — Excellent!")
elif ___:               # fill in: score >= 80
    print("B — Great!")
elif score >= 70:
    print("C — Good")
else:
    print("F — Try again")`,
      hints: [
        { en: 'The condition should catch scores between 80 and 89', pt: 'A condição deve capturar notas entre 80 e 89' }
      ],
      sampleOutput: { en: 'B — Great!', pt: 'B — Great!' }
    },
    {
      id: 'ex6_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build a 4-tier claim priority router:\n• > $15k → "CRITICAL — CEO alert"\n• > $5k → "URGENT — manager review"\n• > $500 → "NORMAL — standard queue"\n• Anything else → "LOW — self-service portal"',
        pt: 'Construa um roteador de prioridade de 4 níveis:\n• > R$15k → "CRÍTICO — alerta CEO"\n• > R$5k → "URGENTE — revisão gerencial"\n• > R$500 → "NORMAL — fila padrão"\n• Qualquer outro → "BAIXO — portal self-service"'
      },
      starterCode: `damage = int(input("Damage amount: $"))

# Build your 4-tier if/elif/else below:`,
      hints: [
        { en: 'Start with the highest condition: if damage > 15000:', pt: 'Comece com a condição mais alta: if damage > 15000:' },
        { en: 'Use 3 elif blocks + 1 else', pt: 'Use 3 blocos elif + 1 else' }
      ],
      sampleOutput: { en: 'URGENT — manager review', pt: 'URGENTE — revisão gerencial' }
    }
  ],

  quiz: [
    {
      id: 'q6_1',
      question: { en: 'Does the ORDER of elif conditions matter?', pt: 'A ORDEM das condições elif importa?' },
      options: [
        { en: 'Yes — Python checks top to bottom, stops at first True', pt: 'Sim — Python verifica de cima para baixo, para no primeiro True' },
        { en: 'No — Python checks all of them', pt: 'Não — Python verifica todas' },
        { en: 'Only for strings', pt: 'Apenas para strings' },
        { en: 'Python auto-sorts them', pt: 'Python as ordena automaticamente' }
      ],
      correctIndex: 0,
      explanation: { en: 'Python stops at the FIRST True condition. If you put a broad condition first, specific ones below are never reached.', pt: 'Python para na PRIMEIRA condição True. Se colocar uma condição ampla primeiro, as específicas abaixo nunca são alcançadas.' }
    },
    {
      id: 'q6_2',
      question: { en: 'score = 85\nif score >= 90: print("A")\nelif score >= 80: print("B")\nWhat prints?', pt: 'score = 85\nif score >= 90: print("A")\nelif score >= 80: print("B")\nO que imprime?' },
      options: [
        { en: 'B', pt: 'B' },
        { en: 'A', pt: 'A' },
        { en: 'A and B', pt: 'A e B' },
        { en: 'Nothing', pt: 'Nada' }
      ],
      correctIndex: 0,
      explanation: { en: '85 >= 90 is False → skip. 85 >= 80 is True → print "B". Done. Only one block runs.', pt: '85 >= 90 é False → pula. 85 >= 80 é True → imprime "B". Fim. Apenas um bloco roda.' }
    },
    {
      id: 'q6_3',
      question: { en: 'Is else required at the end of if/elif?', pt: 'else é obrigatório no final de if/elif?' },
      options: [
        { en: 'No — it\'s optional', pt: 'Não — é opcional' },
        { en: 'Yes — always required', pt: 'Sim — sempre obrigatório' },
        { en: 'Required only with 3+ elif', pt: 'Obrigatório apenas com 3+ elif' },
        { en: 'Required only for numbers', pt: 'Obrigatório apenas para números' }
      ],
      correctIndex: 0,
      explanation: { en: 'else is optional. If no condition is True and there\'s no else, nothing happens — and that\'s perfectly fine.', pt: 'else é opcional. Se nenhuma condição é True e não há else, nada acontece — e isso é perfeitamente válido.' }
    },
    {
      id: 'q6_4',
      question: { en: 'How many elif blocks can you have?', pt: 'Quantos blocos elif você pode ter?' },
      options: [
        { en: 'As many as needed — no limit', pt: 'Quantos precisar — sem limite' },
        { en: 'Maximum 3', pt: 'Máximo 3' },
        { en: 'Maximum 10', pt: 'Máximo 10' },
        { en: 'Only 1', pt: 'Apenas 1' }
      ],
      correctIndex: 0,
      explanation: { en: 'Python allows unlimited elif blocks. Real apps often have dozens of conditions — all using this same structure.', pt: 'Python permite blocos elif ilimitados. Apps reais frequentemente têm dezenas de condições — todas usando essa mesma estrutura.' }
    }
  ],

  exam: {
    title: { en: 'Full Triage System', pt: 'Sistema Completo de Triagem' },
    scenario: {
      en: 'Build the complete 4-tier triage system for the insurance company. Each level has a different SLA and action required.',
      pt: 'Construa o sistema completo de triagem de 4 níveis para a seguradora. Cada nível tem um SLA diferente e ação requerida.'
    },
    requirements: {
      en: ['>$10k = CRITICAL (2h)', '$5k–$10k = URGENT (4h)', '$1k–$5k = NORMAL (24h)', '<$1k = LOW (72h)'],
      pt: ['>R$10k = CRÍTICO (2h)', 'R$5k–R$10k = URGENTE (4h)', 'R$1k–R$5k = NORMAL (24h)', '<R$1k = BAIXO (72h)']
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
      { id: 'tc6_1', description: { en: 'Critical level triggered', pt: 'Nível crítico acionado' }, inputs: ['15000'], checks: [{ type: 'contains', value: 'CRITICAL' }], points: 25 },
      { id: 'tc6_2', description: { en: 'Urgent level triggered', pt: 'Nível urgente acionado' }, inputs: ['7000'], checks: [{ type: 'contains', value: 'URGENT' }], points: 25 },
      { id: 'tc6_3', description: { en: 'Normal level triggered', pt: 'Nível normal acionado' }, inputs: ['2000'], checks: [{ type: 'contains', value: 'NORMAL' }], points: 25 },
      { id: 'tc6_4', description: { en: 'Low level triggered', pt: 'Nível baixo acionado' }, inputs: ['500'], checks: [{ type: 'contains', value: 'LOW' }], points: 25 }
    ]
  }
}

// ============================================================================
// PHASE 7 — While Loop
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase7: Phase = {
  id: 7,
  title: { en: 'While Loops', pt: 'Loops While' },
  description: {
    en: 'Repeat actions automatically until a condition changes.',
    pt: 'Repita ações automaticamente até uma condição mudar.'
  },
  icon: '🔄',
  libraries: [],

  lesson: {
    title: { en: 'Automate Repetition', pt: 'Automatize a Repetição' },
    blocks: [

      { type: 'heading', content: { en: '🌍 While loops never sleep', pt: '🌍 While loops nunca dormem' } },
      {
        type: 'text',
        content: {
          en: 'Instagram\'s notification system is a while loop that has run 24/7 since 2010:\n\n"WHILE server is running:\n   check for new likes\n   send notifications\n   repeat"\n\nSame concept — endlessly repeated.',
          pt: 'O sistema de notificações do Instagram é um while loop que roda 24/7 desde 2010:\n\n"ENQUANTO servidor estiver rodando:\n   verificar novos likes\n   enviar notificações\n   repetir"\n\nMesmo conceito — repetido sem fim.'
        }
      },

      { type: 'heading', content: { en: '🧩 A factory assembly line', pt: '🧩 Uma linha de montagem' } },
      {
        type: 'text',
        content: {
          en: 'A car factory assembly line:\n🏭 WHILE cars remain on the line → paint one → move to next\n🏭 STOP when the last car is done\n\nWhile loop = repeat as long as condition is True.\nThe moment it becomes False → stop.',
          pt: 'Uma linha de montagem de carros:\n🏭 ENQUANTO houver carros na linha → pinte um → mova para o próximo\n🏭 PARE quando o último carro estiver pronto\n\nLoop while = repete enquanto a condição é True.\nNo momento em que se torna False → pare.'
        }
      },

      { type: 'heading', content: { en: '🐍 While loop syntax', pt: '🐍 Sintaxe do while loop' } },
      {
        type: 'code',
        code: `# Process 5 claims, one at a time
count = 1                      # start the counter

while count <= 5:              # condition: keep going while True
    print("Processing claim #", count)
    count = count + 1          # CRITICAL: move counter forward!

print("All claims processed!")  # runs after the loop`
      },
      {
        type: 'warning',
        content: {
          en: '⚠️ Infinite loop trap!\nIf you forget count = count + 1, the condition is always True → loop runs forever.\nAlways make sure something inside the loop brings you closer to False.',
          pt: '⚠️ Armadilha do loop infinito!\nSe esquecer count = count + 1, a condição é sempre True → loop roda para sempre.\nSempre garanta que algo dentro do loop te aproxima de False.'
        }
      },
      {
        type: 'code',
        code: `# Shorthand operators
count = 0

count += 1   # same as: count = count + 1
count -= 1   # same as: count = count - 1
count *= 2   # same as: count = count * 2`
      }
    ]
  },

  exercises: [
    {
      id: 'ex7_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'The while loop below processes 3 claims but is missing the counter update.\nFill it in to prevent an infinite loop.',
        pt: 'O while loop abaixo processa 3 sinistros mas está faltando a atualização do contador.\nPreencha para evitar um loop infinito.'
      },
      starterCode: `count = 1

while count <= 3:
    print("Processing claim #", count)
    ___               # increment count here!

print("Done!")`,
      hints: [
        { en: 'Use: count += 1', pt: 'Use: count += 1' }
      ],
      sampleOutput: { en: 'Processing claim # 1\nProcessing claim # 2\nProcessing claim # 3\nDone!', pt: 'Processing claim # 1\nProcessing claim # 2\nProcessing claim # 3\nDone!' }
    },
    {
      id: 'ex7_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build a claim batch processor:\n• Ask for 4 damage amounts (loop 4 times)\n• Subtract $250 deductible from each\n• Add payout to a running total\n• Print the grand total at the end',
        pt: 'Construa um processador em lote:\n• Pergunte 4 valores de dano (loop 4 vezes)\n• Subtraia R$250 de franquia de cada\n• Adicione o pagamento a um total acumulado\n• Imprima o total geral no final'
      },
      starterCode: `total_payout = 0
count = 1

# Write your while loop here:`,
      hints: [
        { en: 'while count <= 4: → get input → calculate payout → add to total → count += 1', pt: 'while count <= 4: → pegar input → calcular pagamento → adicionar ao total → count += 1' },
        { en: 'total_payout += payout adds each payout to the running total', pt: 'total_payout += payout adiciona cada pagamento ao total acumulado' }
      ],
      sampleOutput: { en: 'Total payout: $ 13750', pt: 'Total payout: $ 13750' }
    }
  ],

  quiz: [
    {
      id: 'q7_1',
      question: { en: 'What causes an infinite loop?', pt: 'O que causa um loop infinito?' },
      options: [
        { en: 'The condition never becomes False', pt: 'A condição nunca se torna False' },
        { en: 'Too many iterations', pt: 'Iterações demais' },
        { en: 'Missing print() statement', pt: 'Faltando print()' },
        { en: 'Using while instead of for', pt: 'Usar while em vez de for' }
      ],
      correctIndex: 0,
      explanation: { en: 'If the condition stays True forever (e.g., forgot to increment counter), the loop never stops. Always verify you\'re moving toward False.', pt: 'Se a condição fica True para sempre (ex: esqueceu de incrementar o contador), o loop nunca para. Sempre verifique que você está avançando em direção ao False.' }
    },
    {
      id: 'q7_2',
      question: { en: 'What does count += 1 mean?', pt: 'O que count += 1 significa?' },
      options: [
        { en: 'count = count + 1', pt: 'count = count + 1' },
        { en: 'count = 1', pt: 'count = 1' },
        { en: 'Check if count equals 1', pt: 'Verificar se count é 1' },
        { en: 'Reset count to zero', pt: 'Reiniciar count para zero' }
      ],
      correctIndex: 0,
      explanation: { en: '+= is shorthand for "add to itself". count += 1 means count = count + 1. Saves keystrokes!', pt: '+= é atalho para "adicione a si mesmo". count += 1 significa count = count + 1. Economiza digitação!' }
    },
    {
      id: 'q7_3',
      question: { en: 'count = 1\nwhile count < 4:\n   count += 1\nprint(count) → result?', pt: 'count = 1\nwhile count < 4:\n   count += 1\nprint(count) → resultado?' },
      options: [
        { en: '4', pt: '4' },
        { en: '3', pt: '3' },
        { en: '1', pt: '1' },
        { en: 'Infinite loop', pt: 'Loop infinito' }
      ],
      correctIndex: 0,
      explanation: { en: 'count goes 1→2→3→4. When count=4, 4<4 is False, loop stops. print(4).', pt: 'count vai 1→2→3→4. Quando count=4, 4<4 é False, loop para. print(4).' }
    },
    {
      id: 'q7_4',
      question: { en: 'When does a while loop STOP?', pt: 'Quando um loop while PARA?' },
      options: [
        { en: 'When its condition becomes False', pt: 'Quando sua condição se torna False' },
        { en: 'After exactly 10 iterations', pt: 'Após exatamente 10 iterações' },
        { en: 'When print() is called', pt: 'Quando print() é chamado' },
        { en: 'At the end of the file', pt: 'No final do arquivo' }
      ],
      correctIndex: 0,
      explanation: { en: 'A while loop runs as long as its condition is True. The moment the condition becomes False, execution continues after the loop.', pt: 'Um loop while roda enquanto sua condição é True. No momento em que a condição se torna False, a execução continua após o loop.' }
    }
  ],

  exam: {
    title: { en: 'Monthly Batch Processor', pt: 'Processador Mensal em Lote' },
    scenario: {
      en: 'End of month. Process exactly 5 claims, apply the $300 deductible to each, and report the total company payout.',
      pt: 'Fim do mês. Processe exatamente 5 sinistros, aplique a franquia de R$300 em cada, e reporte o pagamento total da empresa.'
    },
    requirements: {
      en: ['Loop exactly 5 times', 'Ask for damage each iteration', 'Subtract $300 deductible', 'Accumulate total payout', 'Print final total'],
      pt: ['Loop exatamente 5 vezes', 'Pergunte o dano em cada iteração', 'Subtraia R$300 de franquia', 'Acumule o pagamento total', 'Imprima o total final']
    },
    starterCode: `total_payout = 0
count = 1
deductible = 300

while count <= 5:
    damage = int(input("Claim #" + str(count) + " damage: $"))
    payout = damage - deductible
    total_payout += payout
    count += 1

print("Total payout: $", total_payout)`,
    testCases: [
      { id: 'tc7_1', description: { en: 'Processes 5 claims correctly', pt: 'Processa 5 sinistros corretamente' }, inputs: ['1000','2000','3000','4000','5000'], checks: [{ type: 'contains', value: '13500' }], points: 50 },
      { id: 'tc7_2', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['100','200','300','400','500'], checks: [{ type: 'no_error', value: '' }], points: 30 },
      { id: 'tc7_3', description: { en: 'Shows total', pt: 'Mostra total' }, inputs: ['600','600','600','600','600'], checks: [{ type: 'contains', value: '1500' }], points: 20 }
    ]
  }
}

// ============================================================================
// PHASE 8 — For Loops + Listas
// TEMPLATE B: Conceito Composto (for + lists interdependent)
// ============================================================================

export const phase8: Phase = {
  id: 8,
  title: { en: 'For Loops & Lists', pt: 'For Loops e Listas' },
  description: {
    en: 'Store collections of data and process them all automatically.',
    pt: 'Armazene coleções de dados e processe todas automaticamente.'
  },
  icon: '📋',
  libraries: [],

  lesson: {
    title: { en: 'Collections + Automation', pt: 'Coleções + Automação' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Spotify loops through 600M users every morning', pt: '🌍 O Spotify percorre 600M usuários toda manhã' } },
      {
        type: 'text',
        content: {
          en: 'Every morning, Spotify\'s system loops through a list of every user:\n"for user in all_users: generate their Daily Mix playlist"\n\nLists hold the data. For loops do the work.\nTogether, they power every bulk operation on the internet.',
          pt: 'Toda manhã, o sistema do Spotify percorre uma lista de todos os usuários:\n"for usuario in todos_usuarios: gerar playlist Daily Mix"\n\nListas guardam os dados. For loops fazem o trabalho.\nJuntos, alimentam toda operação em massa na internet.'
        }
      },

      // ── ANALOGIA MÃE ──────────────────────────────────────────────────────
      { type: 'heading', content: { en: '🧩 A shopping list + automatic checkout', pt: '🧩 Uma lista de compras + caixa automático' } },
      {
        type: 'text',
        content: {
          en: 'List = your grocery list: [milk, eggs, bread, coffee]\nFor loop = automatic checkout scanner:\n  → scans milk → processes it\n  → scans eggs → processes it\n  → ... until list is empty\n\nThe scanner doesn\'t care how many items. It just goes through all of them.',
          pt: 'Lista = sua lista de compras: [leite, ovos, pão, café]\nFor loop = caixa automático de escaneamento:\n  → escaneia leite → processa\n  → escaneia ovos → processa\n  → ... até a lista acabar\n\nO caixa não se importa com quantos itens. Ele percorre todos.'
        }
      },

      // ── CÓDIGO PROGRESSIVO (Template B) ───────────────────────────────────
      { type: 'heading', content: { en: '🐍 Step 1 — create a list', pt: '🐍 Passo 1 — crie uma lista' } },
      {
        type: 'code',
        code: `# Lists use square brackets [ ]
clients = ["Alice", "Bob", "Carlos"]
damages = [1200, 4500, 8000, 250]

# Access by position (starts at 0!)
print(clients[0])   # Alice
print(clients[2])   # Carlos
print(damages[1])   # 4500`
      },

      { type: 'heading', content: { en: '🐍 Step 2 — loop through a list', pt: '🐍 Passo 2 — percorra uma lista' } },
      {
        type: 'code',
        code: `clients = ["Alice", "Bob", "Carlos"]

for name in clients:
    print("Hello,", name)

# Output:
# Hello, Alice
# Hello, Bob
# Hello, Carlos`
      },

      { type: 'heading', content: { en: '🐍 Step 3 — loop + calculate', pt: '🐍 Passo 3 — loop + calcular' } },
      {
        type: 'code',
        code: `damages = [1200, 4500, 8000, 250]
total = 0

for damage in damages:
    payout = damage - 250        # apply deductible
    total += payout              # add to running total
    print("Payout:", payout)

print("Grand total:", total)`
      },
      {
        type: 'tip',
        content: {
          en: '📍 Lists start at index 0 — always!\nFirst item = [0], second = [1], third = [2]\nTrying to access [4] on a 4-item list → IndexError.',
          pt: '📍 Listas começam no índice 0 — sempre!\nPrimeiro item = [0], segundo = [1], terceiro = [2]\nTentar acessar [4] em lista de 4 itens → IndexError.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex8_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Complete the for loop to greet each client.',
        pt: 'Complete o for loop para cumprimentar cada cliente.'
      },
      starterCode: `clients = ["Alice", "Bob", "Diana", "Carlos"]

for ___ in clients:             # fill in the loop variable
    print("Hello,", ___)       # use it here`,
      hints: [
        { en: 'Choose any name for the loop variable: for name in clients', pt: 'Escolha qualquer nome para a variável do loop: for nome in clients' },
        { en: 'Use the same variable in the print()', pt: 'Use a mesma variável no print()' }
      ],
      sampleOutput: { en: 'Hello, Alice\nHello, Bob\nHello, Diana\nHello, Carlos', pt: 'Hello, Alice\nHello, Bob\nHello, Diana\nHello, Carlos' }
    },
    {
      id: 'ex8_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Create a list of 4 damage amounts.\nLoop through them, apply a $200 deductible to each, and print individual payouts + grand total.',
        pt: 'Crie uma lista com 4 valores de dano.\nPercorra-os, aplique R$200 de franquia em cada um, e imprima os pagamentos individuais + total geral.'
      },
      starterCode: `damages = [___,___,___,___]   # fill in 4 damage amounts
total = 0

# Write your for loop here:`,
      hints: [
        { en: 'for damage in damages: → calculate payout → print → add to total', pt: 'for dano in damages: → calcular pagamento → imprimir → adicionar ao total' },
        { en: 'Print total AFTER the loop (not inside it)', pt: 'Imprima o total APÓS o loop (não dentro dele)' }
      ],
      sampleOutput: { en: 'Payout: 1000\nPayout: 2800\nPayout: 3800\nPayout: 1050\nGrand total: 8650', pt: 'Payout: 1000\nPayout: 2800\nPayout: 3800\nPayout: 1050\nGrand total: 8650' }
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
        { en: 'list(item1, item2, item3)', pt: 'list(item1, item2, item3)' }
      ],
      correctIndex: 0,
      explanation: { en: 'Lists use square brackets [ ]. Parentheses = tuple. Curly braces = set or dict.', pt: 'Listas usam colchetes [ ]. Parênteses = tupla. Chaves = set ou dict.' }
    },
    {
      id: 'q8_2',
      question: { en: 'items = ["a","b","c"]\nWhat is items[1]?', pt: 'items = ["a","b","c"]\nQual é items[1]?' },
      options: [
        { en: '"b"', pt: '"b"' },
        { en: '"a"', pt: '"a"' },
        { en: '"c"', pt: '"c"' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 0,
      explanation: { en: 'Lists start at 0. items[0]="a", items[1]="b", items[2]="c".', pt: 'Listas começam em 0. items[0]="a", items[1]="b", items[2]="c".' }
    },
    {
      id: 'q8_3',
      question: { en: 'nums = [10, 20, 30]\nfor n in nums: print(n)\nHow many lines print?', pt: 'nums = [10, 20, 30]\nfor n in nums: print(n)\nQuantas linhas imprimem?' },
      options: [
        { en: '3', pt: '3' },
        { en: '1', pt: '1' },
        { en: '30', pt: '30' },
        { en: '0', pt: '0' }
      ],
      correctIndex: 0,
      explanation: { en: 'The for loop runs once per item. 3 items in the list = 3 print() calls = 3 lines.', pt: 'O for loop roda uma vez por item. 3 itens na lista = 3 chamadas print() = 3 linhas.' }
    },
    {
      id: 'q8_4',
      question: { en: 'How to add "Diana" to: names = ["Alice"]?', pt: 'Como adicionar "Diana" a: nomes = ["Alice"]?' },
      options: [
        { en: 'names.append("Diana")', pt: 'nomes.append("Diana")' },
        { en: 'names.add("Diana")', pt: 'nomes.add("Diana")' },
        { en: 'names + "Diana"', pt: 'nomes + "Diana"' },
        { en: 'names.push("Diana")', pt: 'nomes.push("Diana")' }
      ],
      correctIndex: 0,
      explanation: { en: '.append() adds one item to the END of a list. That\'s the standard way in Python.', pt: '.append() adiciona um item no FINAL da lista. Esse é o jeito padrão em Python.' }
    }
  ],

  exam: {
    title: { en: 'Automated Client Report', pt: 'Relatório Automatizado de Clientes' },
    scenario: {
      en: 'Month-end report time. Loop through 5 clients, greet each one, show their damage and payout, then display the total payout.',
      pt: 'Hora do relatório de fim de mês. Percorra 5 clientes, cumprimente cada um, mostre o dano e o pagamento, depois exiba o total.'
    },
    requirements: {
      en: ['Create list of 5 client names', 'Create list of 5 matching damage amounts', 'Loop through both', 'Print greeting + payout per client ($250 deductible)', 'Print grand total after loop'],
      pt: ['Crie lista com 5 nomes de clientes', 'Crie lista com 5 valores de dano correspondentes', 'Percorra as duas', 'Imprima saudação + pagamento por cliente (R$250 de franquia)', 'Imprima total geral após o loop']
    },
    starterCode: `clients = ["Alice", "Bob", "Carlos", "Diana", "Eduardo"]
damages = [1200, 4500, 8000, 650, 3100]
total = 0

for i in range(len(clients)):
    payout = damages[i] - 250
    total += payout
    print("Hello,", clients[i], "— payout: $", payout)

print("Grand total: $", total)`,
    testCases: [
      { id: 'tc8_1', description: { en: 'Greets Alice', pt: 'Cumprimenta Alice' }, inputs: [], checks: [{ type: 'contains', value: 'Alice' }], points: 20 },
      { id: 'tc8_2', description: { en: 'Shows a payout value', pt: 'Mostra um valor de pagamento' }, inputs: [], checks: [{ type: 'contains', value: '950' }], points: 20 },
      { id: 'tc8_3', description: { en: 'Grand total = 16000', pt: 'Total geral = 16000' }, inputs: [], checks: [{ type: 'contains', value: '16000' }], points: 40 },
      { id: 'tc8_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}
