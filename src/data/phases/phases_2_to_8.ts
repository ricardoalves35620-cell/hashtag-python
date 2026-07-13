import type { Phase } from '../types'

// ============================================================================
// PHASE 2 — Matemática · EXPANDIDO
// ============================================================================

export const phase2: Phase = {
  id: 2,
  title: { en: 'Math & Operators', pt: 'Matemática e Operadores' },
  description: {
    en: 'Master all Python math operators through real insurance and construction calculations.',
    pt: 'Domine todos os operadores matemáticos com cálculos reais de seguros e construção.'
  },
  icon: '🧮',
  libraries: [],

  lesson: {
    title: { en: 'Python as Your Super Calculator', pt: 'Python como sua Super Calculadora' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Math that lands rovers on Mars', pt: '🌍 Matemática que pousa rovers em Marte' } },
      { type: 'text', content: {
        en: 'NASA used Python math to land the Perseverance rover within 2.4 meters of its target — after traveling 470 MILLION kilometers. 🚀\n\nCloser to home:\n• Uber calculates 20 million ride prices per day with these operators\n• Nubank processes millions of interest calculations per hour\n• Every insurance payout in the world uses subtraction and multiplication\n\nThe 6 operators you learn today power all of it.',
        pt: 'A NASA usou matemática Python para pousar o rover Perseverance com 2,4 metros de precisão — após viajar 470 MILHÕES de quilômetros. 🚀\n\nMais perto de casa:\n• O Uber calcula 20 milhões de preços de corrida por dia com esses operadores\n• O Nubank processa milhões de cálculos de juros por hora\n• Todo pagamento de seguro no mundo usa subtração e multiplicação\n\nOs 6 operadores que você aprende hoje alimentam tudo isso.'
      }},

      { type: 'heading', content: { en: '🧩 A calculator with memory', pt: '🧩 Uma calculadora com memória' } },
      { type: 'text', content: {
        en: 'A pocket calculator gives you the answer, then forgets it.\nPython gives the answer AND remembers it — you can save results and reuse them in the next calculation.\n\nThat one difference is why Python replaced Excel in every serious financial company.',
        pt: 'Uma calculadora de bolso dá a resposta e esquece.\nPython dá a resposta E lembra — você pode salvar resultados e reusá-los no próximo cálculo.\n\nEssa única diferença é o motivo pelo qual Python substituiu o Excel em toda empresa financeira séria.'
      }},

      { type: 'heading', content: { en: '🐍 The 6 operators', pt: '🐍 Os 6 operadores' } },
      { type: 'code', code: `print(10 + 3)    # Addition        → 13
print(10 - 3)    # Subtraction     → 7
print(10 * 3)    # Multiplication  → 30
print(10 / 3)    # Division        → 3.3333... (always decimal!)
print(10 // 3)   # Floor division  → 3  (drops the decimal)
print(10 % 3)    # Modulo          → 1  (only the remainder)
print(2 ** 10)   # Power           → 1024  (2 to the 10th)` },

      { type: 'heading', content: { en: '🐍 Deeper: division types and order of operations', pt: '🐍 Aprofundando: tipos de divisão e ordem das operações' } },
      { type: 'code', code: `# / ALWAYS returns a decimal, even for exact divisions
print(10 / 2)    # 5.0  (not 5!)
print(10 // 2)   # 5    (// gives whole numbers)

# When is % (modulo) useful? Checking even/odd, splitting evenly:
print(10 % 2)    # 0 → 10 is even (remainder zero)
print(11 % 2)    # 1 → 11 is odd
print(100 % 30)  # 10 → splitting $100 in $30 boxes leaves $10

# Order of operations: * and / BEFORE + and -
print(2 + 3 * 4)     # 14  (not 20! multiplication first)
print((2 + 3) * 4)   # 20  (parentheses force order)

# Real trap: calculating average
print(10 + 20 + 30 / 3)     # ❌ 40.0 — only 30 was divided!
print((10 + 20 + 30) / 3)   # ✅ 20.0 — correct average` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Full insurance payout calculation', pt: '🏗️ Cenário Real 1: Cálculo completo de sinistro' } },
      { type: 'text', content: {
        en: 'A real water damage claim, step by step:\n🔸 Damage claimed: $5,230\n🔸 Deductible: $250 (customer pays this part)\n🔸 Coverage: 80% of the remainder\n🔸 Company processing fee: 2% of payout\n\nThis is EXACTLY how adjusters calculate every day:',
        pt: 'Um sinistro real de dano de água, passo a passo:\n🔸 Dano reclamado: R$5.230\n🔸 Franquia: R$250 (cliente paga essa parte)\n🔸 Cobertura: 80% do restante\n🔸 Taxa de processamento: 2% do pagamento\n\nÉ EXATAMENTE assim que ajustadores calculam todo dia:'
      }},
      { type: 'code', code: `# Step-by-step insurance payout
damage     = 5230
deductible = 250

# Step 1: subtract deductible
after_ded = damage - deductible          # 4980

# Step 2: apply 80% coverage
gross_payout = after_ded * 0.80          # 3984.0

# Step 3: subtract 2% processing fee
fee = gross_payout * 0.02                # 79.68
net_payout = gross_payout - fee          # 3904.32

print("Damage claimed:  $", damage)
print("After deductible:$", after_ded)
print("Gross payout:    $", gross_payout)
print("Processing fee:  $", fee)
print("NET PAYOUT:      $", net_payout)` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Construction budget breakdown', pt: '🏗️ Cenário Real 2: Divisão de orçamento de obra' } },
      { type: 'code', code: `# $180,000 renovation budget split by category
budget = 180000

materials = budget * 0.40    # 40% → 72000.0
labor     = budget * 0.35    # 35% → 63000.0
equipment = budget * 0.15    # 15% → 27000.0
admin     = budget * 0.10    # 10% → 18000.0

print("Materials:", materials)
print("Labor:", labor)
print("Equipment:", equipment)
print("Admin:", admin)

# Sanity check: percentages must total 100%
print("Check:", materials + labor + equipment + admin)  # 180000.0 ✅

# How many $50 cement bags fit in the materials budget?
print("Cement bags possible:", materials // 50)   # floor division!
print("Money left over: $", materials % 50)       # remainder!` },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: {
        en: `# ❌ MISTAKE 1: expecting / to return a whole number
result = 10 / 2
print(result)          # 5.0 — division with / always returns a float

# ❌ MISTAKE 2: forgetting operator precedence
average = 10 + 20 / 2
print(average)         # 20.0 — only 20 was divided by 2

# ✅ FIX: use parentheses to control the order
average = (10 + 20) / 2
print(average)         # 15.0

# ❌ MISTAKE 3: using x for multiplication
# print(5 x 3)         → SyntaxError! x is not a Python operator

# ✅ FIX: use *
print(5 * 3)           # 15`,
        pt: `# ❌ ERRO 1: esperar que / retorne um número inteiro
resultado = 10 / 2
print(resultado)       # 5.0 — a divisão com / sempre retorna float

# ❌ ERRO 2: esquecer a precedência dos operadores
media = 10 + 20 / 2
print(media)           # 20.0 — apenas 20 foi dividido por 2

# ✅ CORREÇÃO: use parênteses para controlar a ordem
media = (10 + 20) / 2
print(media)           # 15.0

# ❌ ERRO 3: usar x para multiplicar
# print(5 x 3)         → SyntaxError! x não é um operador do Python

# ✅ CORREÇÃO: use *
print(5 * 3)           # 15`
      } },

      { type: 'tip', content: {
        en: '💡 PRO TIP: percentage cheat sheet\n• 80% of X → X * 0.80\n• X plus 10% → X * 1.10\n• X minus 25% → X * 0.75\nMemorize these three patterns — they appear in EVERY financial calculation.',
        pt: '💡 DICA PRO: cola de percentuais\n• 80% de X → X * 0.80\n• X mais 10% → X * 1.10\n• X menos 25% → X * 0.75\nMemorize esses três padrões — aparecem em TODO cálculo financeiro.'
      }},

      { type: 'heading', content: { en: '📋 Summary', pt: '📋 Resumo' } },
      { type: 'text', content: {
        en: '✅ 7 operators: + - * / // % **\n✅ / always returns decimal; // drops the decimal; % gives remainder\n✅ * and / run BEFORE + and - — use ( ) to control order\n✅ Percentages: multiply by decimal (80% = 0.80)\n✅ Chained calculations: save each step, verify each step\n\nNext: saving values in variables so calculations get reusable. 📦',
        pt: '✅ 7 operadores: + - * / // % **\n✅ / sempre retorna decimal; // descarta o decimal; % dá o resto\n✅ * e / rodam ANTES de + e - — use ( ) para controlar\n✅ Percentuais: multiplique pelo decimal (80% = 0.80)\n✅ Cálculos encadeados: salve cada passo, verifique cada passo\n\nPróxima: salvando valores em variáveis para reusar cálculos. 📦'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex2_guided',
      title: { en: '🟢 Guided: Explore the Operators', pt: '🟢 Guiado: Explore os Operadores' },
      description: {
        en: 'Run this code and study the output.\nThen: change 17 to 20 and predict each result BEFORE running again.',
        pt: 'Execute este código e estude a saída.\nDepois: mude 17 para 20 e preveja cada resultado ANTES de rodar de novo.'
      },
      starterCode: `n = 17
print(n, "+ 5 =", n + 5)
print(n, "- 5 =", n - 5)
print(n, "* 2 =", n * 2)
print(n, "/ 5 =", n / 5)
print(n, "// 5 =", n // 5)
print(n, "% 5 =", n % 5)
print(n, "** 2 =", n ** 2)`,
      hints: [
        { en: '17 // 5 = 3 because 5 fits 3 whole times in 17', pt: '17 // 5 = 3 porque 5 cabe 3 vezes inteiras em 17' },
        { en: '17 % 5 = 2 because 17 = 5×3 + 2', pt: '17 % 5 = 2 porque 17 = 5×3 + 2' }
      ],
      sampleOutput: { en: '17 + 5 = 22\n17 - 5 = 12\n17 * 2 = 34\n17 / 5 = 3.4\n17 // 5 = 3\n17 % 5 = 2\n17 ** 2 = 289', pt: '17 + 5 = 22\n17 - 5 = 12\n17 * 2 = 34\n17 / 5 = 3.4\n17 // 5 = 3\n17 % 5 = 2\n17 ** 2 = 289' }
    },
    {
      id: 'ex2_fill',
      title: { en: '🟡 Fill the Gap: Payout Chain', pt: '🟡 Preencha: Cadeia de Pagamento' },
      description: {
        en: 'Complete the 3-step payout calculation:\ndeductible → coverage → final value.',
        pt: 'Complete o cálculo de pagamento em 3 passos:\nfranquia → cobertura → valor final.'
      },
      starterCode: `damage = 8000
deductible = 300

after_ded = damage ___ deductible     # fill: subtract
payout = after_ded ___ 0.75           # fill: apply 75% coverage

print("After deductible:", after_ded)
print("Final payout:", payout)`,
      hints: [
        { en: 'Subtraction: damage - deductible', pt: 'Subtração: damage - deductible' },
        { en: '75% coverage = multiply by 0.75', pt: '75% de cobertura = multiplicar por 0.75' }
      ],
      sampleOutput: { en: 'After deductible: 7700\nFinal payout: 5775.0', pt: 'After deductible: 7700\nFinal payout: 5775.0' }
    },
    {
      id: 'ex2_zero',
      title: { en: '🔴 From Scratch: Full Budget', pt: '🔴 Do Zero: Orçamento Completo' },
      description: {
        en: 'A $240,000 project budget. Calculate and print:\n• Materials: 45%\n• Labor: 30%\n• Equipment: 15%\n• Admin: 10%\n• A check line proving they sum to 240000',
        pt: 'Um orçamento de R$240.000. Calcule e imprima:\n• Materiais: 45%\n• Mão de obra: 30%\n• Equipamento: 15%\n• Admin: 10%\n• Uma linha de verificação provando que somam 240000'
      },
      starterCode: `budget = 240000

# Calculate each category and print all 5 lines:`,
      hints: [
        { en: '45% = budget * 0.45', pt: '45% = budget * 0.45' },
        { en: 'Check line: print all four added together', pt: 'Linha de verificação: imprima os quatro somados' }
      ],
      sampleOutput: { en: 'Materials: 108000.0\nLabor: 72000.0\nEquipment: 36000.0\nAdmin: 24000.0\nCheck: 240000.0', pt: 'Materials: 108000.0\nLabor: 72000.0\nEquipment: 36000.0\nAdmin: 24000.0\nCheck: 240000.0' }
    }
  ],

  quiz: [
    { id: 'q2_1', question: { en: '10 // 3 returns:', pt: '10 // 3 retorna:' }, options: [{ en: '3', pt: '3' }, { en: '3.33', pt: '3.33' }, { en: '1', pt: '1' }, { en: '4', pt: '4' }], correctIndex: 0, explanation: { en: '// is floor division — drops the decimal. 10÷3 = 3.33 → 3.', pt: '// é divisão inteira — descarta o decimal. 10÷3 = 3,33 → 3.' } },
    { id: 'q2_2', question: { en: '10 % 3 returns:', pt: '10 % 3 retorna:' }, options: [{ en: '1 (the remainder)', pt: '1 (o resto)' }, { en: '3', pt: '3' }, { en: '3.33', pt: '3.33' }, { en: '0.1', pt: '0.1' }], correctIndex: 0, explanation: { en: '% gives only the remainder: 10 = 3×3 + 1.', pt: '% dá apenas o resto: 10 = 3×3 + 1.' } },
    { id: 'q2_3', question: { en: '10 / 2 returns:', pt: '10 / 2 retorna:' }, options: [{ en: '5.0 (division always gives decimal)', pt: '5.0 (divisão sempre dá decimal)' }, { en: '5', pt: '5' }, { en: '5.5', pt: '5.5' }, { en: 'Error', pt: 'Erro' }], correctIndex: 0, explanation: { en: '/ ALWAYS returns a float, even for exact divisions. Use // for whole numbers.', pt: '/ SEMPRE retorna float, mesmo em divisões exatas. Use // para inteiros.' } },
    { id: 'q2_4', question: { en: '2 + 3 * 4 = ?', pt: '2 + 3 * 4 = ?' }, options: [{ en: '14 (multiplication first)', pt: '14 (multiplicação primeiro)' }, { en: '20', pt: '20' }, { en: '24', pt: '24' }, { en: '9', pt: '9' }], correctIndex: 0, explanation: { en: '* runs before +. 3×4=12, then 2+12=14. Use (2+3)*4 to get 20.', pt: '* roda antes de +. 3×4=12, depois 2+12=14. Use (2+3)*4 para obter 20.' } },
    { id: 'q2_5', question: { en: 'To calculate 80% of 5000:', pt: 'Para calcular 80% de 5000:' }, options: [{ en: '5000 * 0.80', pt: '5000 * 0.80' }, { en: '5000 * 80', pt: '5000 * 80' }, { en: '5000 / 80', pt: '5000 / 80' }, { en: '5000 % 80', pt: '5000 % 80' }], correctIndex: 0, explanation: { en: 'Percentage as decimal: 80% = 0.80. 5000 × 0.80 = 4000.', pt: 'Percentual como decimal: 80% = 0,80. 5000 × 0,80 = 4000.' } },
    { id: 'q2_6', question: { en: 'How to check if a number is even?', pt: 'Como verificar se um número é par?' }, options: [{ en: 'number % 2 equals 0', pt: 'number % 2 igual a 0' }, { en: 'number / 2 equals 0', pt: 'number / 2 igual a 0' }, { en: 'number // 2 equals 0', pt: 'number // 2 igual a 0' }, { en: 'number * 2 equals 0', pt: 'number * 2 igual a 0' }], correctIndex: 0, explanation: { en: 'Even numbers divide by 2 with no remainder: 10 % 2 = 0 → even. 11 % 2 = 1 → odd.', pt: 'Números pares dividem por 2 sem resto: 10 % 2 = 0 → par. 11 % 2 = 1 → ímpar.' } }
  ],

  exam: {
    title: { en: 'Multi-Site Budget Report', pt: 'Relatório de Orçamento Multi-Site' },
    scenario: {
      en: 'You manage 4 renovation sites. The CFO needs the complete budget report: individual budgets, total, average, a 10% contingency reserve, and what remains after the reserve.',
      pt: 'Você gerencia 4 obras. O CFO precisa do relatório completo: orçamentos individuais, total, média, reserva de contingência de 10% e o que resta após a reserva.'
    },
    requirements: {
      en: ['Print each of the 4 site budgets', 'Print the total (sum)', 'Print the average per site', 'Print the 10% reserve', 'Print remaining after reserve'],
      pt: ['Imprima cada um dos 4 orçamentos', 'Imprima o total (soma)', 'Imprima a média por site', 'Imprima a reserva de 10%', 'Imprima o restante após reserva']
    },
    starterCode: `site1 = 50000
site2 = 75000
site3 = 60000
site4 = 45000

# Calculate: total, average, reserve (10%), remaining
# Print everything`,
    testCases: [
      { id: 'tc2_1', description: { en: 'Shows 50000', pt: 'Mostra 50000' }, inputs: [], checks: [{ type: 'contains', value: '50000' }], points: 10 },
      { id: 'tc2_2', description: { en: 'Shows 75000', pt: 'Mostra 75000' }, inputs: [], checks: [{ type: 'contains', value: '75000' }], points: 10 },
      { id: 'tc2_3', description: { en: 'Total 230000', pt: 'Total 230000' }, inputs: [], checks: [{ type: 'contains', value: '230000' }], points: 25 },
      { id: 'tc2_4', description: { en: 'Average 57500', pt: 'Média 57500' }, inputs: [], checks: [{ type: 'contains_any', value: ['57500', '57500.0'] }], points: 20 },
      { id: 'tc2_5', description: { en: 'Reserve 23000', pt: 'Reserva 23000' }, inputs: [], checks: [{ type: 'contains_any', value: ['23000', '23000.0'] }], points: 20 },
      { id: 'tc2_6', description: { en: 'Remaining 207000', pt: 'Restante 207000' }, inputs: [], checks: [{ type: 'contains_any', value: ['207000', '207000.0'] }], points: 15 }
    ]
  }
}

// ============================================================================
// PHASE 3 — Variáveis · EXPANDIDO
// ============================================================================

export const phase3: Phase = {
  id: 3,
  title: { en: 'Variables', pt: 'Variáveis' },
  description: {
    en: 'Store, name, and reuse data — the foundation every program is built on.',
    pt: 'Armazene, nomeie e reutilize dados — a fundação de todo programa.'
  },
  icon: '📦',
  libraries: [],

  lesson: {
    title: { en: 'Variables: Labelled Boxes for Data', pt: 'Variáveis: Caixas Etiquetadas para Dados' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Every app is millions of variables', pt: '🌍 Todo app é milhões de variáveis' } },
      { type: 'text', content: {
        en: 'Right now, this very second:\n• WhatsApp holds a variable with your name\n• Instagram holds one with your follower count\n• Your bank holds one with your balance\n• Netflix holds one with the exact second you paused\n\nInstagram alone manages an estimated 500 BILLION variables in memory at peak hours. Every single one created with the same = sign you learn today.',
        pt: 'Agora mesmo, neste segundo:\n• O WhatsApp guarda uma variável com seu nome\n• O Instagram guarda uma com seus seguidores\n• Seu banco guarda uma com seu saldo\n• A Netflix guarda uma com o segundo exato em que você pausou\n\nSó o Instagram gerencia cerca de 500 BILHÕES de variáveis na memória em horários de pico. Cada uma criada com o mesmo sinal de = que você aprende hoje.'
      }},

      { type: 'heading', content: { en: '🧩 The labelled shoe box', pt: '🧩 A caixa de sapato etiquetada' } },
      { type: 'text', content: {
        en: 'Imagine a shelf of shoe boxes, each with a label:\n📦 "client_name" → contains "Alice Costa"\n📦 "claim_amount" → contains 5230\n📦 "is_approved" → contains True\n\nCreating a variable = writing a label and putting something in the box.\nUsing a variable = reading the label and taking out what\'s inside.\nReassigning = swapping the contents (label stays).',
        pt: 'Imagine uma prateleira de caixas de sapato, cada uma com etiqueta:\n📦 "nome_cliente" → contém "Alice Costa"\n📦 "valor_sinistro" → contém 5230\n📦 "aprovado" → contém True\n\nCriar variável = escrever a etiqueta e colocar algo na caixa.\nUsar variável = ler a etiqueta e tirar o que está dentro.\nReatribuir = trocar o conteúdo (etiqueta permanece).'
      }},

      { type: 'heading', content: { en: '🐍 Creating and using variables', pt: '🐍 Criando e usando variáveis' } },
      { type: 'code', code: {
        en: `# label = value
client_name = "Alice Costa"    # str: text needs quotes
claim_amount = 5230             # int: whole number
coverage_rate = 0.80            # float: decimal number
is_approved = True              # bool: True or False, with a capital first letter

# Use variables by name
print(client_name)              # Alice Costa
print(claim_amount)             # 5230

# Combine variables in calculations
payout = claim_amount * coverage_rate
print("Payout:", payout)        # Payout: 4184.0

# Check the type of a variable
print(type(client_name))        # <class 'str'>
print(type(claim_amount))       # <class 'int'>`,
        pt: `# etiqueta = valor
nome_cliente = "Alice Costa"   # str: texto precisa de aspas
valor_sinistro = 5230           # int: número inteiro
taxa_cobertura = 0.80           # float: número decimal
aprovado = True                 # bool: True ou False, com inicial maiúscula

# Use as variáveis pelo nome
print(nome_cliente)             # Alice Costa
print(valor_sinistro)           # 5230

# Combine variáveis em cálculos
indenizacao = valor_sinistro * taxa_cobertura
print("Indenização:", indenizacao)  # Indenização: 4184.0

# Consulte o tipo de uma variável
print(type(nome_cliente))       # <class 'str'>
print(type(valor_sinistro))     # <class 'int'>`
      } },

      { type: 'heading', content: { en: '🐍 Deeper: updating, swapping, and building strings', pt: '🐍 Aprofundando: atualizar, trocar e montar strings' } },
      { type: 'code', code: `# Variables can be UPDATED anytime
score = 0
score = score + 10      # read current (0), add 10, store back → 10
score += 5              # shorthand: same as score = score + 5 → 15
print(score)            # 15

# Building text with + (concatenation)
first = "Ana"
last = "Souza"
full = first + " " + last       # don't forget the space!
print(full)                      # Ana Souza

# Building text with f-strings (the modern way)
age = 32
message = f"{full} is {age} years old"
print(message)                   # Ana Souza is 32 years old

# f-strings can even do math inside the braces:
print(f"In 10 years: {age + 10}")   # In 10 years: 42` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Client onboarding file', pt: '🏗️ Cenário Real 1: Ficha de cadastro de cliente' } },
      { type: 'code', code: `# New insurance client registration
client_name     = "Ricardo Alves"
client_age      = 32
city            = "Oshawa"
monthly_premium = 385
policy_active   = True

# Derived values (calculated FROM other variables)
annual_premium  = monthly_premium * 12
weekly_cost     = annual_premium / 52

print(f"=== CLIENT FILE ===")
print(f"Name:    {client_name}")
print(f"Age:     {client_age}")
print(f"City:    {city}")
print(f"Monthly: {monthly_premium}")
print(f"Annual:  {annual_premium}")
print(f"Per week: {weekly_cost}")
print(f"Active:  {policy_active}")` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Tracking a running total', pt: '🏗️ Cenário Real 2: Rastreando um total acumulado' } },
      { type: 'text', content: {
        en: 'The most important variable pattern in all of programming: the ACCUMULATOR.\nStart at zero, keep adding. Every shopping cart, every payroll system, every claim batch uses this:',
        pt: 'O padrão de variável mais importante de toda a programação: o ACUMULADOR.\nComece em zero, continue somando. Todo carrinho de compras, toda folha de pagamento, todo lote de sinistros usa isso:'
      }},
      { type: 'code', code: `# Construction site: tracking daily material costs
total_spent = 0                    # start the accumulator at zero

# Monday: bought cement
total_spent = total_spent + 960    # 0 + 960 = 960

# Tuesday: bought steel
total_spent += 1275                # shorthand → 2235

# Wednesday: bought paint
total_spent += 800                 # → 3035

print("Total spent this week: $", total_spent)

# The variable REMEMBERS between operations.
# That's the superpower a calculator doesn't have.` },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: {
        en: `# ❌ MISTAKE 1: using a variable before creating it
# print(salary)        → NameError: name 'salary' is not defined

# ✅ FIX: create the variable first, then use it
salary = 5000
print(salary)

# ❌ MISTAKE 2: invalid variable names
# 2client = "Ana"      → SyntaxError: a name cannot start with a number
# client-name = "Ana"  → SyntaxError: hyphens are not allowed
# client name = "Ana"  → SyntaxError: spaces are not allowed

# ✅ FIX: use letters, numbers and underscores; start with a letter
client_name2 = "Ana"

# ❌ MISTAKE 3: confusing = with ==
# = stores a value; == compares two values
x = 5           # store 5 in x
print(x == 5)   # is x equal to 5? → True`,
        pt: `# ❌ ERRO 1: usar uma variável antes de criá-la
# print(salario)       → NameError: name 'salario' is not defined

# ✅ CORREÇÃO: crie a variável antes de usá-la
salario = 5000
print(salario)

# ❌ ERRO 2: nomes de variáveis inválidos
# 2cliente = "Ana"     → SyntaxError: o nome não pode começar com número
# nome-cliente = "Ana" → SyntaxError: hífens não são permitidos
# nome cliente = "Ana" → SyntaxError: espaços não são permitidos

# ✅ CORREÇÃO: use letras, números e sublinhados; comece com uma letra
nome_cliente2 = "Ana"

# ❌ ERRO 3: confundir = com ==
# = armazena um valor; == compara dois valores
x = 5           # armazena 5 em x
print(x == 5)   # x é igual a 5? → True`
      } },

      { type: 'tip', content: {
        en: '💡 PRO TIP: name variables like you\'d explain them to a colleague.\n❌ x, a, temp, data2\n✅ client_name, total_payout, monthly_premium\nGood names make code self-documenting. 6 months from now, "x" tells you nothing.',
        pt: '💡 DICA PRO: nomeie variáveis como explicaria a um colega.\n❌ x, a, temp, data2\n✅ nome_cliente, total_pagamento, premio_mensal\nBons nomes tornam o código auto-documentado. Daqui 6 meses, "x" não te diz nada.'
      }},

      { type: 'heading', content: { en: '📋 Summary', pt: '📋 Resumo' } },
      { type: 'text', content: {
        en: '✅ variable = value creates a labelled box\n✅ 4 basic types: str (text), int (whole), float (decimal), bool (True/False)\n✅ += adds to existing value (accumulator pattern)\n✅ f-strings build text: f"Name: {name}, Age: {age + 1}"\n✅ = stores, == compares\n✅ Names: letters/numbers/underscore, no spaces, don\'t start with a number\n\nNext: making programs interactive with input(). ⌨️',
        pt: '✅ variavel = valor cria uma caixa etiquetada\n✅ 4 tipos básicos: str (texto), int (inteiro), float (decimal), bool (True/False)\n✅ += soma ao valor existente (padrão acumulador)\n✅ f-strings montam texto: f"Nome: {nome}, Idade: {idade + 1}"\n✅ = armazena, == compara\n✅ Nomes: letras/números/underscore, sem espaços, não começar com número\n\nPróxima: tornando programas interativos com input(). ⌨️'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex3_guided',
      title: { en: '🟢 Guided: Watch Variables Change', pt: '🟢 Guiado: Veja Variáveis Mudarem' },
      description: {
        en: 'Run this and follow the accumulator step by step.\nThen add a 4th purchase of 500 and verify the new total.',
        pt: 'Execute e acompanhe o acumulador passo a passo.\nDepois adicione uma 4ª compra de 500 e verifique o novo total.'
      },
      starterCode: `total = 0
print("Start:", total)

total += 960
print("After cement:", total)

total += 1275
print("After steel:", total)

total += 800
print("After paint:", total)`,
      hints: [
        { en: 'Add: total += 500 then another print', pt: 'Adicione: total += 500 e mais um print' },
        { en: 'New total should be 3535', pt: 'Novo total deve ser 3535' }
      ],
      sampleOutput: { en: 'Start: 0\nAfter cement: 960\nAfter steel: 2235\nAfter paint: 3035', pt: 'Start: 0\nAfter cement: 960\nAfter steel: 2235\nAfter paint: 3035' }
    },
    {
      id: 'ex3_fill',
      title: { en: '🟡 Fill the Gap: Client File', pt: '🟡 Preencha: Ficha de Cliente' },
      description: {
        en: 'Complete the client file: fill the values with correct types and calculate the annual premium.',
        pt: 'Complete a ficha: preencha os valores com tipos corretos e calcule o prêmio anual.'
      },
      starterCode: `client_name     = ___          # any name — text needs quotes!
client_age      = ___          # any age — number, no quotes
monthly_premium = 450
policy_active   = ___          # True or False

annual_premium = monthly_premium ___ 12    # fill the operator

print(f"Client: {client_name}, age {client_age}")
print(f"Annual: {annual_premium}")
print(f"Active: {policy_active}")`,
      hints: [
        { en: 'Text: "Maria" | Number: 35 | Bool: True (capital T)', pt: 'Texto: "Maria" | Número: 35 | Bool: True (T maiúsculo)' },
        { en: 'Annual = monthly × 12 → use *', pt: 'Anual = mensal × 12 → use *' }
      ],
      sampleOutput: { en: 'Client: Maria, age 35\nAnnual: 5400\nActive: True', pt: 'Client: Maria, age 35\nAnnual: 5400\nActive: True' }
    },
    {
      id: 'ex3_zero',
      title: { en: '🔴 From Scratch: Weekly Cost Tracker', pt: '🔴 Do Zero: Rastreador Semanal' },
      description: {
        en: 'Build an accumulator that tracks 3 material purchases:\n• Start total at 0\n• Add: 1200 (wood), 850 (tiles), 430 (paint)\n• Print the total after EACH purchase\n• Print a final f-string: "Week total: $X"',
        pt: 'Construa um acumulador que rastreia 3 compras:\n• Comece total em 0\n• Adicione: 1200 (madeira), 850 (azulejos), 430 (tinta)\n• Imprima o total após CADA compra\n• Imprima f-string final: "Total da semana: $X"'
      },
      starterCode: `# Build your accumulator:`,
      hints: [
        { en: 'total = 0, then total += 1200, print, repeat', pt: 'total = 0, depois total += 1200, print, repita' },
        { en: 'Final: print(f"Week total: {total}")', pt: 'Final: print(f"Total da semana: {total}")' }
      ],
      sampleOutput: { en: '1200\n2050\n2480\nWeek total: 2480', pt: '1200\n2050\n2480\nTotal da semana: 2480' }
    }
  ],

  quiz: [
    { id: 'q3_1', question: { en: 'What does x = 10 do?', pt: 'O que x = 10 faz?' }, options: [{ en: 'Stores 10 in a box labelled x', pt: 'Armazena 10 numa caixa chamada x' }, { en: 'Compares x to 10', pt: 'Compara x com 10' }, { en: 'Prints 10', pt: 'Imprime 10' }, { en: 'Creates the number 10', pt: 'Cria o número 10' }], correctIndex: 0, explanation: { en: '= is assignment (store). == is comparison (check equality).', pt: '= é atribuição (armazenar). == é comparação (verificar igualdade).' } },
    { id: 'q3_2', question: { en: 'Which name is VALID?', pt: 'Qual nome é VÁLIDO?' }, options: [{ en: 'total_payout', pt: 'total_pagamento' }, { en: '2total', pt: '2total' }, { en: 'total-payout', pt: 'total-pagamento' }, { en: 'total payout', pt: 'total pagamento' }], correctIndex: 0, explanation: { en: 'Letters, numbers, underscore only. Can\'t start with a number. No hyphens or spaces.', pt: 'Apenas letras, números e underscore. Não pode começar com número. Sem hífens ou espaços.' } },
    { id: 'q3_3', question: { en: 'x = 100\nx += 50\nprint(x) → ?', pt: 'x = 100\nx += 50\nprint(x) → ?' }, options: [{ en: '150', pt: '150' }, { en: '100', pt: '100' }, { en: '50', pt: '50' }, { en: 'Error', pt: 'Erro' }], correctIndex: 0, explanation: { en: '+= means "add to current". 100 + 50 = 150.', pt: '+= significa "adicione ao atual". 100 + 50 = 150.' } },
    { id: 'q3_4', question: { en: 'The 4 basic types are:', pt: 'Os 4 tipos básicos são:' }, options: [{ en: 'str, int, float, bool', pt: 'str, int, float, bool' }, { en: 'text, num, dec, bit', pt: 'text, num, dec, bit' }, { en: 'string, number, real, logic', pt: 'string, number, real, logic' }, { en: 'char, int, double, boolean', pt: 'char, int, double, boolean' }], correctIndex: 0, explanation: { en: 'str (text), int (whole), float (decimal), bool (True/False). These four cover most programs.', pt: 'str (texto), int (inteiro), float (decimal), bool (True/False). Esses quatro cobrem a maioria dos programas.' } },
    { id: 'q3_5', question: { en: 'f"Age: {30 + 5}" produces:', pt: 'f"Idade: {30 + 5}" produz:' }, options: [{ en: 'Age: 35', pt: 'Idade: 35' }, { en: 'Age: {30 + 5}', pt: 'Idade: {30 + 5}' }, { en: 'Age: 30 + 5', pt: 'Idade: 30 + 5' }, { en: 'Error', pt: 'Erro' }], correctIndex: 0, explanation: { en: 'f-strings evaluate expressions inside braces. 30+5 is calculated → 35.', pt: 'f-strings avaliam expressões dentro das chaves. 30+5 é calculado → 35.' } },
    { id: 'q3_6', question: { en: 'True in Python must be written:', pt: 'True em Python deve ser escrito:' }, options: [{ en: 'True (capital T, no quotes)', pt: 'True (T maiúsculo, sem aspas)' }, { en: 'true', pt: 'true' }, { en: '"True"', pt: '"True"' }, { en: 'TRUE', pt: 'TRUE' }], correctIndex: 0, explanation: { en: 'Booleans: True and False, capitalized, no quotes. "True" with quotes is a string, true lowercase is an error.', pt: 'Booleanos: True e False, com maiúscula, sem aspas. "True" com aspas é string, true minúsculo é erro.' } }
  ],

  exam: {
    title: { en: 'Complete Client Profile', pt: 'Perfil Completo de Cliente' },
    scenario: {
      en: 'Create a full client profile with derived calculations: annual premium, weekly cost, and a 5% loyalty discount on the annual value.',
      pt: 'Crie um perfil completo com cálculos derivados: prêmio anual, custo semanal e desconto de fidelidade de 5% sobre o valor anual.'
    },
    requirements: {
      en: [
        'name = "Ricardo Alves", age = 32, monthly_premium = 385',
        'Calculate annual_premium (monthly × 12)',
        'Calculate discounted (annual × 0.95)',
        'Print name, age, annual and discounted values'
      ],
      pt: [
        'nome = "Ricardo Alves", idade = 32, premio_mensal = 385',
        'Calcule premio_anual (mensal × 12)',
        'Calcule com_desconto (anual × 0.95)',
        'Imprima nome, idade, valor anual e com desconto'
      ]
    },
    starterCode: `# Client profile with calculations:`,
    testCases: [
      { id: 'tc3_1', description: { en: 'Shows name', pt: 'Mostra nome' }, inputs: [], checks: [{ type: 'contains', value: 'Ricardo' }], points: 20 },
      { id: 'tc3_2', description: { en: 'Shows age 32', pt: 'Mostra idade 32' }, inputs: [], checks: [{ type: 'contains', value: '32' }], points: 15 },
      { id: 'tc3_3', description: { en: 'Annual = 4620', pt: 'Anual = 4620' }, inputs: [], checks: [{ type: 'contains', value: '4620' }], points: 30 },
      { id: 'tc3_4', description: { en: 'Discounted = 4389', pt: 'Com desconto = 4389' }, inputs: [], checks: [{ type: 'contains', value: '4389' }], points: 25 },
      { id: 'tc3_5', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 }
    ]
  }
}


// ============================================================================
// PHASE 4 — Input · EXPANDIDO
// ============================================================================

export const phase4: Phase = {
  id: 4,
  title: { en: 'Getting User Input', pt: 'Entrada do Usuário' },
  description: {
    en: 'Make programs interactive — ask questions, receive answers, convert types safely.',
    pt: 'Torne programas interativos — faça perguntas, receba respostas, converta tipos com segurança.'
  },
  icon: '⌨️',
  libraries: [],

  lesson: {
    title: { en: 'input() — Your Program Asks Questions', pt: 'input() — Seu Programa Faz Perguntas' },
    blocks: [

      { type: 'heading', content: { en: '🌍 The invisible input() everywhere', pt: '🌍 O input() invisível em todo lugar' } },
      { type: 'text', content: {
        en: 'Every form you\'ve ever filled online is input() in disguise:\n• Google login: 2 inputs (email, password)\n• Bank transfer: 3 inputs (account, amount, description)\n• iFood checkout: 6+ inputs (address, payment, notes...)\n\nGoogle processes 8.5 BILLION searches per day — each one starts with a single input box. The pattern you learn today is the front door of the entire internet.',
        pt: 'Todo formulário que você já preencheu online é input() disfarçado:\n• Login Google: 2 inputs (email, senha)\n• Transferência bancária: 3 inputs (conta, valor, descrição)\n• Checkout iFood: 6+ inputs (endereço, pagamento, observações...)\n\nO Google processa 8,5 BILHÕES de buscas por dia — cada uma começa numa única caixa de input. O padrão que você aprende hoje é a porta de entrada da internet inteira.'
      }},

      { type: 'heading', content: { en: '🧩 The receptionist analogy', pt: '🧩 A analogia da recepcionista' } },
      { type: 'text', content: {
        en: 'A receptionist at an insurance office:\n1. Asks a question: "What\'s your name?"\n2. WAITS for the answer (doesn\'t move until you speak)\n3. Writes it down on the form\n\ninput() works identically:\n1. Shows your question on screen\n2. PAUSES the program, waiting\n3. Stores whatever was typed into a variable\n\n⚠️ Critical detail: the receptionist writes EVERYTHING as text. Even if you say "42", she writes the characters 4-2, not the number.',
        pt: 'Uma recepcionista numa seguradora:\n1. Faz a pergunta: "Qual seu nome?"\n2. ESPERA a resposta (não se move até você falar)\n3. Anota no formulário\n\ninput() funciona identicamente:\n1. Mostra sua pergunta na tela\n2. PAUSA o programa, esperando\n3. Armazena o que foi digitado numa variável\n\n⚠️ Detalhe crítico: a recepcionista anota TUDO como texto. Mesmo se você disser "42", ela escreve os caracteres 4-2, não o número.'
      }},

      { type: 'heading', content: { en: '🐍 The fundamentals', pt: '🐍 Os fundamentos' } },
      { type: 'code', code: `# input() shows a message and waits for typing
name = input("What is your name? ")
print("Hello,", name)

# The message is the PROMPT — always end with ": " or "? "
# so the user knows it's their turn to type

city = input("Your city: ")
print(f"Nice! {city} is a great place.")` },

      { type: 'heading', content: { en: '🐍 Deeper: the conversion problem (and solution)', pt: '🐍 Aprofundando: o problema da conversão (e a solução)' } },
      { type: 'code', code: `# ⚠️ input() ALWAYS returns a string — even numbers!
age = input("Your age: ")        # user types 30
print(type(age))                  # <class 'str'>  ← it's TEXT "30"

# print(age + 5)                  # ❌ TypeError! text + number = crash

# ✅ THE FIX: convert with int() or float()
age = int(input("Your age: "))       # int() converts "30" → 30
print(age + 5)                        # 35 ✅

height = float(input("Height (m): ")) # float() for decimals: "1.75" → 1.75
print(height * 100, "cm")

# CONVERSION CHEAT SHEET:
# int(x)    → whole number    int("42") → 42
# float(x)  → decimal          float("3.14") → 3.14
# str(x)    → back to text     str(42) → "42"` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Claim intake form', pt: '🏗️ Cenário Real 1: Formulário de sinistro' } },
      { type: 'code', code: {
        en: `# Complete claim intake: text and numeric inputs
print("=== NEW CLAIM INTAKE ===")

client = input("Client name: ")                 # text; no conversion needed
phone = input("Phone: ")                        # keep as text because it may contain dashes
damage = int(input("Damage amount: $"))         # number used in calculations
deductible = int(input("Deductible: $"))        # number used in calculations

payout = damage - deductible

print()
print("=== CLAIM SUMMARY ===")
print(f"Client: {client}")
print(f"Phone: {phone}")
print(f"Damage: {damage}")
print(f"Payout: {payout}")`,
        pt: `# Cadastro completo do sinistro: entradas de texto e de número
print("=== NOVO SINISTRO ===")

cliente = input("Nome do cliente: ")             # texto; não precisa de conversão
telefone = input("Telefone: ")                   # mantenha como texto, pois pode conter hífens
dano = int(input("Valor do dano: $"))            # número usado em cálculos
franquia = int(input("Franquia: $"))             # número usado em cálculos

indenizacao = dano - franquia

print()
print("=== RESUMO DO SINISTRO ===")
print(f"Cliente: {cliente}")
print(f"Telefone: {telefone}")
print(f"Dano: {dano}")
print(f"Indenização: {indenizacao}")`
      } },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Construction estimate calculator', pt: '🏗️ Cenário Real 2: Calculadora de orçamento de obra' } },
      { type: 'code', code: `# Interactive area & cost estimator
print("=== RENOVATION ESTIMATE ===")

room    = input("Room name: ")
width   = float(input("Width (m): "))     # float — meters have decimals!
length  = float(input("Length (m): "))
rate    = float(input("Cost per m²: $"))

area = width * length
cost = area * rate

print()
print(f"Room: {room}")
print(f"Area: {area} m²")
print(f"Estimated cost: {cost}")` },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: `# ❌ MISTAKE 1: math on unconverted input
x = input("Number: ")     # user types 5 → x holds "5" (text)
# print(x + 5)            → TypeError: can't add str + int

# ✅ FIX:
x = int(input("Number: "))
print(x + 5)

# ❌ MISTAKE 2: int() on decimal input
# n = int(input("Height: "))   → user types 1.75 → ValueError!
# ✅ FIX: use float() when decimals are possible
n = float(input("Height: "))

# ❌ MISTAKE 3: converting things that AREN'T numbers
# phone = int(input("Phone: "))  → "555-1234" crashes int()!
# ✅ RULE: only convert what you'll do MATH with.
# Phone, ZIP code, ID numbers → keep as text!` },

      { type: 'tip', content: {
        en: '💡 PRO TIP: the "will I do math with it?" test.\n• Damage amount → math → int/float\n• Age → math → int\n• Phone number → NO math → keep str\n• ZIP code → NO math → keep str\nConverting everything blindly is a rookie mistake.',
        pt: '💡 DICA PRO: o teste "vou fazer matemática com isso?".\n• Valor do dano → matemática → int/float\n• Idade → matemática → int\n• Telefone → SEM matemática → mantém str\n• CEP → SEM matemática → mantém str\nConverter tudo cegamente é erro de iniciante.'
      }},

      { type: 'heading', content: { en: '📋 Summary', pt: '📋 Resumo' } },
      { type: 'text', content: {
        en: '✅ input("prompt") pauses and waits for typing\n✅ input() ALWAYS returns str — even for numbers\n✅ int() converts to whole number, float() to decimal\n✅ Combine: age = int(input("Age: "))\n✅ Only convert values you\'ll do math with\n✅ Phone/ZIP/ID = text, keep as str\n\nNext: teaching programs to make decisions with if/else. 🚦',
        pt: '✅ input("pergunta") pausa e espera digitação\n✅ input() SEMPRE retorna str — até para números\n✅ int() converte para inteiro, float() para decimal\n✅ Combine: idade = int(input("Idade: "))\n✅ Só converta valores com os quais fará matemática\n✅ Telefone/CEP/ID = texto, mantenha str\n\nPróxima: ensinando programas a decidir com if/else. 🚦'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex4_guided',
      title: { en: '🟢 Guided: See the Type Problem', pt: '🟢 Guiado: Veja o Problema do Tipo' },
      description: {
        en: 'Run this code, enter 25 when asked, and watch the type() outputs.\nNotice how the SAME typed value becomes different types.',
        pt: 'Execute, digite 25 quando pedido, e observe as saídas do type().\nNote como o MESMO valor digitado vira tipos diferentes.'
      },
      starterCode: `raw = input("Type a number: ")
print("Raw value:", raw)
print("Raw type:", type(raw))

converted = int(raw)
print("Converted:", converted)
print("New type:", type(converted))

print("Math now works:", converted * 2)`,
      hints: [
        { en: 'The raw type is str even though you typed digits', pt: 'O tipo bruto é str mesmo você digitando dígitos' }
      ],
      sampleOutput: { en: 'Raw value: 25\nRaw type: <class \'str\'>\nConverted: 25\nNew type: <class \'int\'>\nMath now works: 50', pt: 'Raw value: 25\nRaw type: <class \'str\'>\nConverted: 25\nNew type: <class \'int\'>\nMath now works: 50' }
    },
    {
      id: 'ex4_fill',
      title: { en: '🟡 Fill the Gap: Convert Correctly', pt: '🟡 Preencha: Converta Corretamente' },
      description: {
        en: 'Fill in the RIGHT conversion for each input.\nThink: math or no math? Decimals or whole?',
        pt: 'Preencha a conversão CERTA para cada input.\nPense: matemática ou não? Decimais ou inteiro?'
      },
      starterCode: `name   = ___(input("Name: "))          # no conversion needed — remove ___ and parens or use str
age    = ___(input("Age: "))            # whole number math
height = ___(input("Height (m): "))     # decimal math
phone  = input("Phone: ")               # already correct — no math on phones!

print(f"{name}, {age} years, {height}m")
print(f"Next year: {age + 1}")
print(f"Phone: {phone}")`,
      hints: [
        { en: 'name: just input(...) — or str() which changes nothing', pt: 'name: apenas input(...) — ou str() que não muda nada' },
        { en: 'age → int() | height → float()', pt: 'idade → int() | altura → float()' }
      ],
      sampleOutput: { en: 'Maria, 35 years, 1.68m\nNext year: 36\nPhone: 555-1234', pt: 'Maria, 35 anos, 1.68m\nAno que vem: 36\nTelefone: 555-1234' }
    },
    {
      id: 'ex4_zero',
      title: { en: '🔴 From Scratch: Estimate Calculator', pt: '🔴 Do Zero: Calculadora de Orçamento' },
      description: {
        en: 'Build the renovation estimator:\n1. Ask room name (text)\n2. Ask width and length in meters (decimals)\n3. Ask cost per m² (decimal)\n4. Calculate area and total cost\n5. Print a summary with f-strings',
        pt: 'Construa o orçamentador de reforma:\n1. Pergunte nome do cômodo (texto)\n2. Pergunte largura e comprimento em metros (decimais)\n3. Pergunte custo por m² (decimal)\n4. Calcule área e custo total\n5. Imprima resumo com f-strings'
      },
      starterCode: `# Renovation estimator:`,
      hints: [
        { en: 'width = float(input("Width (m): "))', pt: 'largura = float(input("Largura (m): "))' },
        { en: 'area = width * length, cost = area * rate', pt: 'area = largura * comprimento, custo = area * taxa' }
      ],
      sampleOutput: { en: 'Room: Kitchen\nArea: 12.0 m²\nTotal: 1800.0', pt: 'Cômodo: Cozinha\nÁrea: 12.0 m²\nTotal: 1800.0' }
    }
  ],

  quiz: [
    { id: 'q4_1', question: { en: 'input() ALWAYS returns:', pt: 'input() SEMPRE retorna:' }, options: [{ en: 'str (text)', pt: 'str (texto)' }, { en: 'int', pt: 'int' }, { en: 'Whatever was typed', pt: 'O que foi digitado' }, { en: 'float', pt: 'float' }], correctIndex: 0, explanation: { en: 'Always str. Even "42" is the TEXT four-two until you convert it.', pt: 'Sempre str. Até "42" é o TEXTO quatro-dois até você converter.' } },
    { id: 'q4_2', question: { en: 'x = input() gets "5". print(x + 5) →', pt: 'x = input() recebe "5". print(x + 5) →' }, options: [{ en: 'TypeError — can\'t add str + int', pt: 'TypeError — não soma str + int' }, { en: '10', pt: '10' }, { en: '"55"', pt: '"55"' }, { en: '5', pt: '5' }], correctIndex: 0, explanation: { en: '"5" is text. Text + number crashes. Convert first: int(x) + 5 = 10.', pt: '"5" é texto. Texto + número quebra. Converta antes: int(x) + 5 = 10.' } },
    { id: 'q4_3', question: { en: 'User will type 1.75. Which conversion?', pt: 'Usuário digitará 1.75. Qual conversão?' }, options: [{ en: 'float(input(...))', pt: 'float(input(...))' }, { en: 'int(input(...))', pt: 'int(input(...))' }, { en: 'str(input(...))', pt: 'str(input(...))' }, { en: 'No conversion', pt: 'Sem conversão' }], correctIndex: 0, explanation: { en: 'int("1.75") crashes with ValueError. Decimals need float().', pt: 'int("1.75") quebra com ValueError. Decimais precisam de float().' } },
    { id: 'q4_4', question: { en: 'Should you convert a phone number input?', pt: 'Deve converter um telefone digitado?' }, options: [{ en: 'No — no math on phones, and dashes crash int()', pt: 'Não — sem matemática em telefones, e traços quebram int()' }, { en: 'Yes, always int()', pt: 'Sim, sempre int()' }, { en: 'Yes, always float()', pt: 'Sim, sempre float()' }, { en: 'Convert to bool', pt: 'Converter para bool' }], correctIndex: 0, explanation: { en: 'Rule: only convert what you\'ll calculate with. "555-1234" would crash int() anyway.', pt: 'Regra: só converta o que vai calcular. "555-1234" quebraria int() de qualquer forma.' } },
    { id: 'q4_5', question: { en: 'The text inside input("...") is:', pt: 'O texto dentro de input("...") é:' }, options: [{ en: 'The prompt shown to the user', pt: 'O prompt mostrado ao usuário' }, { en: 'The default answer', pt: 'A resposta padrão' }, { en: 'A comment', pt: 'Um comentário' }, { en: 'Required syntax', pt: 'Sintaxe obrigatória' }], correctIndex: 0, explanation: { en: 'It\'s the question displayed. Optional but essential — without it, users see a blank cursor.', pt: 'É a pergunta exibida. Opcional mas essencial — sem ela, o usuário vê só um cursor.' } },
    { id: 'q4_6', question: { en: 'int("abc") does what?', pt: 'int("abc") faz o quê?' }, options: [{ en: 'ValueError — "abc" isn\'t a valid number', pt: 'ValueError — "abc" não é número válido' }, { en: 'Returns 0', pt: 'Retorna 0' }, { en: 'Returns None', pt: 'Retorna None' }, { en: 'Converts letters to numbers', pt: 'Converte letras em números' }], correctIndex: 0, explanation: { en: 'int() only accepts text that LOOKS like a whole number. "abc" → crash. (You\'ll handle this with try/except in Phase 23!)', pt: 'int() só aceita texto que PARECE número inteiro. "abc" → crash. (Você tratará isso com try/except na Fase 23!)' } }
  ],

  exam: {
    title: { en: 'Interactive Claim System', pt: 'Sistema Interativo de Sinistros' },
    scenario: {
      en: 'Build the complete claim intake: collect client data with proper types, calculate the payout with an 85% coverage rate, and print a professional summary.',
      pt: 'Construa a entrada completa de sinistro: colete dados com tipos corretos, calcule o pagamento com cobertura de 85% e imprima um resumo profissional.'
    },
    requirements: {
      en: [
        'Ask client name (text)',
        'Ask damage amount (convert to int)',
        'Ask deductible (convert to int)',
        'Calculate: payout = (damage - deductible) * 0.85',
        'Print name and payout in a summary'
      ],
      pt: [
        'Pergunte nome do cliente (texto)',
        'Pergunte valor do dano (converta para int)',
        'Pergunte franquia (converta para int)',
        'Calcule: pagamento = (dano - franquia) * 0.85',
        'Imprima nome e pagamento num resumo'
      ]
    },
    starterCode: `# Interactive claim intake:`,
    testCases: [
      { id: 'tc4_1', description: { en: 'Correct payout (85%)', pt: 'Pagamento correto (85%)' }, inputs: ['Ana Lima', '5000', '250'], checks: [{ type: 'contains_any', value: ['4037.5', '4037'] }], points: 45 },
      { id: 'tc4_2', description: { en: 'Shows client name', pt: 'Mostra nome do cliente' }, inputs: ['Ana Lima', '5000', '250'], checks: [{ type: 'contains', value: 'Ana' }], points: 30 },
      { id: 'tc4_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['Test', '1000', '100'], checks: [{ type: 'no_error', value: '' }], points: 25 }
    ]
  }
}

// ============================================================================
// PHASE 5 — If/Else · EXPANDIDO
// ============================================================================

export const phase5: Phase = {
  id: 5,
  title: { en: 'If/Else Conditions', pt: 'Condições com if/else' },
  description: {
    en: 'Teach programs to make decisions — conditions, comparisons and logical operators.',
    pt: 'Ensine programas a decidir — condições, comparações e operadores lógicos.'
  },
  icon: '🚦',
  libraries: [],

  lesson: {
    title: { en: 'The Decision Maker', pt: 'O Tomador de Decisões' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Billions of decisions per second', pt: '🌍 Bilhões de decisões por segundo' } },
      { type: 'text', content: {
        en: 'Every "smart" behavior in software is if/else:\n• Netflix: IF you watched 3 thrillers → recommend thrillers\n• Gmail: IF message has suspicious links → spam folder\n• Nubank: IF purchase is far from your city → fraud alert\n• Tesla Autopilot: IF obstacle ahead → brake\n\nVisa alone runs ~65,000 transactions per second, each passing through DOZENS of if checks: valid card? enough balance? suspicious pattern? blocked country?\n\nEvery one uses the exact syntax you learn now.',
        pt: 'Todo comportamento "inteligente" em software é if/else:\n• Netflix: SE você viu 3 thrillers → recomende thrillers\n• Gmail: SE mensagem tem links suspeitos → pasta spam\n• Nubank: SE compra é longe da sua cidade → alerta de fraude\n• Tesla Autopilot: SE obstáculo à frente → freie\n\nSó a Visa roda ~65.000 transações por segundo, cada uma passando por DEZENAS de verificações if: cartão válido? saldo suficiente? padrão suspeito? país bloqueado?\n\nTodas usam a sintaxe exata que você aprende agora.'
      }},

      { type: 'heading', content: { en: '🧩 The traffic light', pt: '🧩 O semáforo' } },
      { type: 'text', content: {
        en: 'A traffic light is pure if/else:\n🔴 IF red → STOP\n🟢 ELSE → GO\n\nKey insight: only ONE path executes. Never both.\nThe condition is a yes/no question. Python evaluates it to True or False, then picks the path.',
        pt: 'Um semáforo é if/else puro:\n🔴 SE vermelho → PARE\n🟢 SENÃO → SIGA\n\nInsight chave: apenas UM caminho executa. Nunca os dois.\nA condição é uma pergunta sim/não. Python a avalia como True ou False, e escolhe o caminho.'
      }},

      { type: 'heading', content: { en: '🐍 The fundamentals', pt: '🐍 Os fundamentos' } },
      { type: 'code', code: {
        en: `damage = 8000

if damage > 5000:                  # condition + colon
    print("🔴 HIGH PRIORITY")      # indented = inside the if
    print("Send an experienced adjuster")  # still inside
else:
    print("🟢 Standard claim")     # runs only if the condition is False

print("Done.")                     # not indented = always runs

# THE 6 COMPARISON OPERATORS:
x = 10
print(x > 5)     # True   greater than
print(x < 5)     # False  less than
print(x >= 10)   # True   greater than or equal to
print(x <= 9)    # False  less than or equal to
print(x == 10)   # True   equal (TWO equals signs!)
print(x != 7)    # True   not equal`,
        pt: `dano = 8000

if dano > 5000:                    # condição + dois-pontos
    print("🔴 ALTA PRIORIDADE")    # indentado = dentro do if
    print("Enviar ajustador experiente")  # ainda dentro do bloco
else:
    print("🟢 Sinistro padrão")    # executa somente se a condição for False

print("Concluído.")                # sem indentação = sempre executa

# OS 6 OPERADORES DE COMPARAÇÃO:
x = 10
print(x > 5)     # True   maior que
print(x < 5)     # False  menor que
print(x >= 10)   # True   maior que ou igual a
print(x <= 9)    # False  menor que ou igual a
print(x == 10)   # True   igual (DOIS sinais de igual!)
print(x != 7)    # True   diferente`,
      } },

      { type: 'heading', content: { en: '🐍 Deeper: combining conditions with and / or / not', pt: '🐍 Aprofundando: combinando condições com and / or / not' } },
      { type: 'code', code: {
        en: `damage = 7000
days_since_policy = 15

# AND — both conditions must be True
if damage > 5000 and days_since_policy < 30:
    print("⚠️ Large claim submitted soon after policy start — investigate")

# OR — at least one condition must be True
region = "flood_zone"
if region == "flood_zone" or damage > 10000:
    print("Requires senior review")

# NOT — reverses the condition
is_approved = False
if not is_approved:
    print("Still pending")

# Text comparisons are case-sensitive
status = "approved"
if status == "approved":
    print("✅ Release payment")
# "Approved" != "approved" — capitalization matters`,
        pt: `dano = 7000
dias_desde_apolice = 15

# AND — as duas condições devem ser True
if dano > 5000 and dias_desde_apolice < 30:
    print("⚠️ Sinistro grande logo após o início da apólice — investigar")

# OR — pelo menos uma condição deve ser True
regiao = "zona_de_inundacao"
if regiao == "zona_de_inundacao" or dano > 10000:
    print("Exige revisão de um profissional sênior")

# NOT — inverte a condição
foi_aprovado = False
if not foi_aprovado:
    print("Ainda pendente")

# Comparações de texto diferenciam maiúsculas e minúsculas
status = "aprovado"
if status == "aprovado":
    print("✅ Liberar pagamento")
# "Aprovado" != "aprovado" — maiúsculas fazem diferença`,
      } },

      { type: 'heading', content: { en: '🏗️ Real-world scenario 1: Fraud-screening rule', pt: '🏗️ Cenário real 1: Regra de triagem de fraude' } },
      { type: 'text', content: {
        en: 'Insurance companies flag claims submitted unusually soon after a policy begins. One common screening rule is: a claim submitted within the first 30 days AND exceeding $5,000 → automatic investigation.',
        pt: 'Seguradoras sinalizam sinistros enviados logo após o início da apólice. Uma regra comum de triagem é: sinistro enviado nos primeiros 30 dias E acima de R$5.000 → investigação automática.'
      }},
      { type: 'code', code: {
        en: `print("=== FRAUD SCREENING ===")
damage = int(input("Claim amount: $"))
days = int(input("Days since policy start: "))

if damage > 5000 and days < 30:
    print("🚨 FLAGGED: large claim submitted soon after policy start")
    print("Route to the Special Investigations Unit")
else:
    print("✅ Passed fraud screening")
    print("Route to standard processing")`,
        pt: `print("=== TRIAGEM DE FRAUDE ===")
dano = int(input("Valor do sinistro: R$"))
dias = int(input("Dias desde o início da apólice: "))

if dano > 5000 and dias < 30:
    print("🚨 SINALIZADO: sinistro grande logo após o início da apólice")
    print("Encaminhar para a Unidade de Investigações Especiais")
else:
    print("✅ Aprovado na triagem de fraude")
    print("Encaminhar para o processamento padrão")`,
      } },

      { type: 'heading', content: { en: '🏗️ Real-world scenario 2: Construction safety check', pt: '🏗️ Cenário real 2: Verificação de segurança da obra' } },
      { type: 'code', code: {
        en: `# Construction safety check: wind speed and crane operations
wind_speed = float(input("Wind speed (km/h): "))
crane_active = input("Is the crane operating? (yes/no): ")

if wind_speed > 40 and crane_active == "yes":
    print("🚨 STOP CRANE OPERATIONS IMMEDIATELY")
    print("Wind exceeds the 40 km/h safety limit")
elif wind_speed > 40:
    print("⚠️ High winds — cranes must remain offline")
else:
    print("✅ Conditions are safe for all operations")`,
        pt: `# Verificação de segurança da obra: vento e operação do guindaste
velocidade_vento = float(input("Velocidade do vento (km/h): "))
guindaste_ativo = input("O guindaste está operando? (sim/não): ")

if velocidade_vento > 40 and guindaste_ativo == "sim":
    print("🚨 INTERROMPA A OPERAÇÃO DO GUINDASTE IMEDIATAMENTE")
    print("O vento ultrapassou o limite de segurança de 40 km/h")
elif velocidade_vento > 40:
    print("⚠️ Vento forte — os guindastes devem permanecer parados")
else:
    print("✅ Condições seguras para todas as operações")`,
      } },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: {
        en: `x = 10

# ❌ MISTAKE 1: using a single = in a condition
# if x = 10:          → SyntaxError! = assigns, == compares
# ✅ FIX:
if x == 10:
    print("ten")

# ❌ MISTAKE 2: forgetting the colon
# if x > 5            → SyntaxError: expected ':'
# ✅ FIX:
if x > 5:
    print("large")

# ❌ MISTAKE 3: incorrect indentation
# if x > 5:
# print("large")      → IndentationError!
# ✅ FIX: indent the code inside the if by 4 spaces
if x > 5:
    print("large")

# ❌ MISTAKE 4: comparing a number with text
guess = input("Guess: ")    # returns "10" as text
# if guess == 10:            → always False! "10" != 10
# ✅ FIX: convert the input first
if int(guess) == 10:
    print("Correct!")`,
        pt: `x = 10

# ❌ ERRO 1: usar apenas um = na condição
# if x = 10:          → SyntaxError! = atribui, == compara
# ✅ CORREÇÃO:
if x == 10:
    print("dez")

# ❌ ERRO 2: esquecer os dois-pontos
# if x > 5            → SyntaxError: era esperado ':'
# ✅ CORREÇÃO:
if x > 5:
    print("grande")

# ❌ ERRO 3: indentação incorreta
# if x > 5:
# print("grande")     → IndentationError!
# ✅ CORREÇÃO: indente o código dentro do if com 4 espaços
if x > 5:
    print("grande")

# ❌ ERRO 4: comparar número com texto
palpite = input("Palpite: ")    # retorna "10" como texto
# if palpite == 10:              → sempre False! "10" != 10
# ✅ CORREÇÃO: converta a entrada primeiro
if int(palpite) == 10:
    print("Correto!")`,
      } },

      { type: 'tip', content: {
        en: '💡 PRO TIP: read conditions out loud.\nif damage > 5000 and days < 30 →\n"IF damage is over five thousand AND days is under thirty"\nIf the sentence sounds wrong out loud, the logic is probably wrong too.',
        pt: '💡 DICA PRO: leia condições em voz alta.\nif dano > 5000 and dias < 30 →\n"SE o dano é maior que cinco mil E os dias são menos que trinta"\nSe a frase soa errada em voz alta, a lógica provavelmente está errada também.'
      }},

      { type: 'heading', content: { en: '📋 Summary', pt: '📋 Resumo' } },
      { type: 'text', content: {
        en: '✅ if condition: → runs indented block only when True\n✅ else: → catches everything False\n✅ 6 comparisons: > < >= <= == !=\n✅ == compares (two signs!), = assigns\n✅ and (both), or (at least one), not (invert)\n✅ Colon + 4-space indentation are mandatory\n✅ Text comparisons are case-sensitive\n\nNext: multiple branches with elif. ⚙️',
        pt: '✅ if condição: → roda bloco indentado só quando True\n✅ else: → captura tudo que é False\n✅ 6 comparações: > < >= <= == !=\n✅ == compara (dois sinais!), = atribui\n✅ and (ambos), or (pelo menos um), not (inverte)\n✅ Dois pontos + indentação de 4 espaços são obrigatórios\n✅ Comparações de texto diferenciam maiúsculas\n\nPróxima: múltiplos caminhos com elif. ⚙️'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex5_guided',
      title: { en: '🟢 Guided: Trace the Decision', pt: '🟢 Guiado: Rastreie a Decisão' },
      description: {
        en: 'Run with damage 8000 → see the HIGH path.\nRun again with 2000 → see the standard path.\nNotice: only ONE branch ever prints.',
        pt: 'Execute com dano 8000 → veja o caminho ALTO.\nExecute de novo com 2000 → veja o caminho padrão.\nNote: apenas UM ramo imprime.'
      },
      starterCode: `damage = int(input("Damage: $"))

if damage > 5000:
    print("🔴 HIGH PRIORITY")
    print("Expert adjuster assigned")
else:
    print("🟢 Standard processing")
    print("Auto-queue assigned")

print("--- check complete ---")`,
      hints: [
        { en: 'The last print always runs — it\'s outside the if', pt: 'O último print sempre roda — está fora do if' }
      ],
      sampleOutput: { en: '🔴 HIGH PRIORITY\nExpert adjuster assigned\n--- check complete ---', pt: '🔴 HIGH PRIORITY\nExpert adjuster assigned\n--- check complete ---' }
    },
    {
      id: 'ex5_fill',
      title: { en: '🟡 Fill the Gap: Fraud Gate', pt: '🟡 Preencha: Portão de Fraude' },
      description: {
        en: 'Complete the fraud detection: large claim AND recent policy = flag.',
        pt: 'Complete a detecção de fraude: sinistro grande E apólice recente = sinalizar.'
      },
      starterCode: `damage = int(input("Damage: $"))
days = int(input("Days since policy start: "))

if damage ___ 5000 ___ days ___ 30:    # fill: >, and, <
    print("🚨 FLAGGED for investigation")
else:
    print("✅ Passed fraud check")`,
      hints: [
        { en: 'Large: damage > 5000 | Recent: days < 30', pt: 'Grande: damage > 5000 | Recente: days < 30' },
        { en: 'Both must be true → and', pt: 'Ambos devem ser verdadeiros → and' }
      ],
      sampleOutput: { en: '🚨 FLAGGED for investigation', pt: '🚨 FLAGGED for investigation' }
    },
    {
      id: 'ex5_zero',
      title: { en: '🔴 From Scratch: Safety Gate', pt: '🔴 Do Zero: Portão de Segurança' },
      description: {
        en: 'Build the crane safety check:\n1. Ask wind speed (float)\n2. If wind > 40 → print "STOP OPERATIONS"\n3. Else → print "Safe to operate"\n4. Bonus: also ask hour (int); if wind > 40 OR hour > 18 → stop',
        pt: 'Construa a verificação de segurança do guindaste:\n1. Pergunte velocidade do vento (float)\n2. Se vento > 40 → imprima "PARAR OPERAÇÕES"\n3. Senão → imprima "Seguro operar"\n4. Bônus: pergunte também a hora (int); se vento > 40 OU hora > 18 → parar'
      },
      starterCode: `# Crane safety gate:`,
      hints: [
        { en: 'wind = float(input("Wind: "))', pt: 'vento = float(input("Vento: "))' },
        { en: 'Bonus: if wind > 40 or hour > 18:', pt: 'Bônus: if vento > 40 or hora > 18:' }
      ],
      sampleOutput: { en: 'STOP OPERATIONS', pt: 'PARAR OPERAÇÕES' }
    }
  ],

  quiz: [
    { id: 'q5_1', question: { en: 'The difference between = and ==:', pt: 'A diferença entre = e ==:' }, options: [{ en: '= assigns a value; == compares values', pt: '= atribui um valor; == compara valores' }, { en: 'They\'re identical', pt: 'São idênticos' }, { en: '== assigns; = compares', pt: '== atribui; = compara' }, { en: '== is for text only', pt: '== é só para texto' }], correctIndex: 0, explanation: { en: 'x = 5 stores. x == 5 asks "is x equal to 5?" and returns True/False.', pt: 'x = 5 armazena. x == 5 pergunta "x é igual a 5?" e retorna True/False.' } },
    { id: 'q5_2', question: { en: 'When does else run?', pt: 'Quando o else roda?' }, options: [{ en: 'Only when the if condition is False', pt: 'Somente quando a condição if é False' }, { en: 'Always', pt: 'Sempre' }, { en: 'When the if is True', pt: 'Quando o if é True' }, { en: 'Never automatically', pt: 'Nunca automaticamente' }], correctIndex: 0, explanation: { en: 'if and else are exclusive paths — exactly one runs, never both.', pt: 'if e else são caminhos exclusivos — exatamente um roda, nunca os dois.' } },
    { id: 'q5_3', question: { en: 'A and B is True when:', pt: 'A and B é True quando:' }, options: [{ en: 'BOTH A and B are True', pt: 'AMBOS A e B são True' }, { en: 'At least one is True', pt: 'Pelo menos um é True' }, { en: 'A is True', pt: 'A é True' }, { en: 'Neither is True', pt: 'Nenhum é True' }], correctIndex: 0, explanation: { en: 'and requires both. or requires at least one. not inverts.', pt: 'and exige ambos. or exige pelo menos um. not inverte.' } },
    { id: 'q5_4', question: { en: 'What\'s wrong: if x > 5\\n    print("big")', pt: 'O que está errado: if x > 5\\n    print("big")' }, options: [{ en: 'Missing colon after the condition', pt: 'Faltando dois pontos após a condição' }, { en: 'Wrong indentation', pt: 'Indentação errada' }, { en: 'x undefined', pt: 'x indefinido' }, { en: 'Nothing', pt: 'Nada' }], correctIndex: 0, explanation: { en: 'Every if needs : at the end: if x > 5:', pt: 'Todo if precisa de : no final: if x > 5:' } },
    { id: 'q5_5', question: { en: 'status = "Approved"\nif status == "approved": → runs?', pt: 'status = "Approved"\nif status == "approved": → roda?' }, options: [{ en: 'No — comparisons are case-sensitive', pt: 'Não — comparações diferenciam maiúsculas' }, { en: 'Yes', pt: 'Sim' }, { en: 'Error', pt: 'Erro' }, { en: 'Depends on Python version', pt: 'Depende da versão' }], correctIndex: 0, explanation: { en: '"Approved" != "approved". Capital A makes them different strings.', pt: '"Approved" != "approved". O A maiúsculo as torna strings diferentes.' } },
    { id: 'q5_6', question: { en: 'x = 3\nif x > 5 or x < 4: → runs?', pt: 'x = 3\nif x > 5 or x < 4: → roda?' }, options: [{ en: 'Yes — x < 4 is True, or needs just one', pt: 'Sim — x < 4 é True, or precisa só de um' }, { en: 'No — x > 5 is False', pt: 'Não — x > 5 é False' }, { en: 'Error', pt: 'Erro' }, { en: 'Both branches run', pt: 'Ambos os ramos rodam' }], correctIndex: 0, explanation: { en: 'or is True if AT LEAST ONE side is True. 3 < 4 → True → block runs.', pt: 'or é True se PELO MENOS UM lado é True. 3 < 4 → True → bloco roda.' } }
  ],

  exam: {
    title: { en: 'Smart Claim Gateway', pt: 'Gateway Inteligente de Sinistros' },
    scenario: {
      en: 'Build the claim approval gateway with fraud detection: large claims need approval, and large+recent claims get flagged for investigation.',
      pt: 'Construa o gateway de aprovação com detecção de fraude: sinistros grandes precisam de aprovação, e grandes+recentes são sinalizados para investigação.'
    },
    requirements: {
      en: [
        'Ask damage amount and days since policy start',
        'If damage > 5000 AND days < 30 → print "INVESTIGATE"',
        'Else if damage > 10000 → print "NEEDS APPROVAL"',
        'Else → print "AUTO-APPROVED"'
      ],
      pt: [
        'Pergunte valor do dano e dias desde início da apólice',
        'Se dano > 5000 E dias < 30 → imprima "INVESTIGATE"',
        'Senão se dano > 10000 → imprima "NEEDS APPROVAL"',
        'Senão → imprima "AUTO-APPROVED"'
      ]
    },
    starterCode: `damage = int(input("Damage: $"))
days = int(input("Days since policy: "))

# Build your decision logic:`,
    testCases: [
      { id: 'tc5_1', description: { en: 'Fraud case flagged', pt: 'Caso de fraude sinalizado' }, inputs: ['8000', '10'], checks: [{ type: 'contains', value: 'INVESTIGATE' }], points: 35 },
      { id: 'tc5_2', description: { en: 'Big old claim needs approval', pt: 'Sinistro grande antigo precisa aprovação' }, inputs: ['15000', '200'], checks: [{ type: 'contains', value: 'APPROVAL' }], points: 35 },
      { id: 'tc5_3', description: { en: 'Normal claim auto-approved', pt: 'Sinistro normal auto-aprovado' }, inputs: ['2000', '100'], checks: [{ type: 'contains', value: 'AUTO' }], points: 30 }
    ]
  }
}


// ============================================================================
// PHASE 6 — If/Elif/Else · EXPANDIDO · TEMPLATE B
// ============================================================================

export const phase6: Phase = {
  id: 6,
  title: { en: 'If / Elif / Else', pt: 'If / Elif / Else' },
  description: {
    en: 'Handle multiple outcomes — priority systems, grading, and tiered pricing.',
    pt: 'Lide com múltiplos resultados — sistemas de prioridade, notas e preços em faixas.'
  },
  icon: '⚙️',
  libraries: [],

  lesson: {
    title: { en: 'Multiple Branches', pt: 'Múltiplos Caminhos' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Uber prices 20 million rides a day with elif', pt: '🌍 O Uber precifica 20 milhões de corridas por dia com elif' } },
      { type: 'text', content: {
        en: 'Every Uber price is an elif chain:\n• Under 2km → base fare\n• 2–5km → standard rate\n• 5–15km → medium rate\n• Over 15km → long distance rate\n• Surge active? → multiply everything by 1.5x\n\nInsurance works the same: your premium is calculated through elif chains checking age brackets, claim history tiers, and coverage levels. Tax brackets? Also elif. Shipping costs? Elif. The whole pricing world runs on it.',
        pt: 'Todo preço do Uber é uma cadeia de elif:\n• Menos de 2km → tarifa base\n• 2–5km → tarifa padrão\n• 5–15km → tarifa média\n• Mais de 15km → longa distância\n• Surge ativo? → multiplica tudo por 1,5x\n\nSeguros funcionam igual: seu prêmio é calculado por cadeias elif verificando faixas de idade, histórico de sinistros e níveis de cobertura. Faixas de imposto? Também elif. Custos de frete? Elif. O mundo inteiro da precificação roda nisso.'
      }},

      { type: 'heading', content: { en: '🧩 The sorting conveyor belt', pt: '🧩 A esteira classificadora' } },
      { type: 'text', content: {
        en: 'A factory conveyor belt sorting packages:\n📦 Heavy? → Dock A. Done, next package.\n📦 Not heavy but medium? → Dock B. Done.\n📦 Not medium but light? → Dock C. Done.\n📦 None of the above? → Rejects bin (else).\n\nKey rule: the belt checks IN ORDER and STOPS at the first match.\nA package never visits two docks. Exactly one destination, always.',
        pt: 'Uma esteira de fábrica classificando pacotes:\n📦 Pesado? → Doca A. Pronto, próximo pacote.\n📦 Não pesado mas médio? → Doca B. Pronto.\n📦 Não médio mas leve? → Doca C. Pronto.\n📦 Nenhum dos acima? → Caixa de rejeitados (else).\n\nRegra chave: a esteira verifica EM ORDEM e PARA no primeiro match.\nUm pacote nunca visita duas docas. Exatamente um destino, sempre.'
      }},

      { type: 'heading', content: { en: '🐍 Step 1 — you already know if/else', pt: '🐍 Passo 1 — você já sabe if/else' } },
      { type: 'code', code: `damage = 4500

if damage > 5000:
    print("Urgent")
else:
    print("Normal")   # everything else lands here

# Problem: real business has MORE than 2 categories!` },

      { type: 'heading', content: { en: '🐍 Step 2 — elif adds middle lanes', pt: '🐍 Passo 2 — elif adiciona faixas do meio' } },
      { type: 'code', code: `damage = 4500

if damage > 10000:
    print("Critical")
elif damage > 5000:      # checked ONLY if first was False
    print("Urgent")
else:
    print("Normal")

# Python reads TOP to BOTTOM and stops at the FIRST True.
# 4500: >10000? No. >5000? No. → else → "Normal"` },

      { type: 'heading', content: { en: '🐍 Step 3 — full production system', pt: '🐍 Passo 3 — sistema completo de produção' } },
      { type: 'code', code: `damage = 7200

if damage > 10000:
    priority = "Critical"
    sla_hours = 2
    team = "Senior adjusters"
elif damage > 5000:
    priority = "Urgent"
    sla_hours = 4
    team = "Standard adjusters"
elif damage >= 1000:
    priority = "Normal"
    sla_hours = 24
    team = "Auto-queue"
else:
    priority = "Low"
    sla_hours = 72
    team = "Self-service portal"

print(f"Priority: {priority}")
print(f"Respond within: {sla_hours}h")
print(f"Assigned to: {team}")` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Insurance premium brackets', pt: '🏗️ Cenário Real 1: Faixas de prêmio de seguro' } },
      { type: 'code', code: `# Age-based car insurance premium (real industry pattern)
age = int(input("Driver age: "))
base = 1000

if age < 21:
    premium = base * 2.2      # young drivers: highest risk
    bracket = "Young driver"
elif age < 26:
    premium = base * 1.6
    bracket = "Under 26"
elif age < 60:
    premium = base * 1.0      # prime bracket: base rate
    bracket = "Standard"
elif age < 75:
    premium = base * 1.3
    bracket = "Senior"
else:
    premium = base * 1.8
    bracket = "75+"

print(f"Bracket: {bracket}")
print(f"Annual premium: \${premium}")` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Concrete strength grading', pt: '🏗️ Cenário Real 2: Classificação de resistência de concreto' } },
      { type: 'code', code: `# Construction QC: grade concrete by test strength (MPa)
strength = float(input("Test strength (MPa): "))

if strength >= 40:
    print("Grade: C40 — structural columns ✅")
elif strength >= 30:
    print("Grade: C30 — beams and slabs ✅")
elif strength >= 20:
    print("Grade: C20 — foundations only ⚠️")
else:
    print("REJECTED — below minimum standard 🚫")
    print("Batch must be discarded")` },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: {
        en: `damage = 8000

# ❌ MISTAKE 1: placing a broad condition first
if damage > 1000:            # 8000 > 1000? True → stops here
    print("Normal")           # wrong: it should be Urgent
elif damage > 5000:
    print("Urgent")           # never reached

# ✅ FIX: place the most specific condition first
if damage > 10000:
    print("Critical")
elif damage > 5000:
    print("Urgent")           # 8000 now reaches the correct branch
elif damage > 1000:
    print("Normal")

# ❌ MISTAKE 2: using separate if statements instead of elif
if damage > 5000:
    print("Urgent")           # prints
if damage > 1000:
    print("Normal")           # also prints: separate ifs are independent

# ✅ elif makes the branches exclusive: only one branch runs`,
        pt: `dano = 8000

# ❌ ERRO 1: colocar uma condição ampla primeiro
if dano > 1000:              # 8000 > 1000? True → para aqui
    print("Normal")           # errado: deveria ser Urgente
elif dano > 5000:
    print("Urgente")          # nunca é alcançado

# ✅ CORREÇÃO: coloque a condição mais específica primeiro
if dano > 10000:
    print("Crítico")
elif dano > 5000:
    print("Urgente")          # agora 8000 chega ao ramo correto
elif dano > 1000:
    print("Normal")

# ❌ ERRO 2: usar ifs separados em vez de elif
if dano > 5000:
    print("Urgente")          # imprime
if dano > 1000:
    print("Normal")           # também imprime: ifs separados são independentes

# ✅ elif torna os ramos exclusivos: apenas um ramo é executado`
      } },

      { type: 'tip', content: {
        en: '💡 PRO TIP: elif chains as waterfalls.\nWrite conditions from the TOP floor (highest value) down.\nWater (your value) falls until it lands on the first floor that catches it.\nDesign the waterfall on paper before coding — 30 seconds of sketching saves 30 minutes of debugging.',
        pt: '💡 DICA PRO: cadeias elif como cachoeiras.\nEscreva condições do andar de CIMA (maior valor) para baixo.\nA água (seu valor) cai até pousar no primeiro andar que a captura.\nDesenhe a cachoeira no papel antes de codar — 30 segundos de esboço economizam 30 minutos de debug.'
      }},

      { type: 'heading', content: { en: '📋 Summary', pt: '📋 Resumo' } },
      { type: 'text', content: {
        en: '✅ elif = "else if" — adds middle branches between if and else\n✅ Checked top to bottom — FIRST True wins, rest are skipped\n✅ Order matters: most specific/highest condition first\n✅ Exactly ONE branch runs (else catches leftovers)\n✅ Multiple separate ifs = independent checks (usually a bug!)\n✅ Unlimited elifs allowed\n\nNext: repeating actions with while loops. 🔄',
        pt: '✅ elif = "else if" — adiciona ramos do meio entre if e else\n✅ Verificado de cima para baixo — PRIMEIRO True vence, resto é pulado\n✅ Ordem importa: condição mais específica/alta primeiro\n✅ Exatamente UM ramo roda (else captura sobras)\n✅ Múltiplos ifs separados = verificações independentes (geralmente um bug!)\n✅ Elifs ilimitados permitidos\n\nPróxima: repetindo ações com loops while. 🔄'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex6_guided',
      title: { en: '🟢 Guided: Watch the Waterfall', pt: '🟢 Guiado: Veja a Cachoeira' },
      description: {
        en: 'Run 3 times with: 12000, 7000, 500.\nTrace which branch catches each value. Notice only ONE prints each time.',
        pt: 'Execute 3 vezes com: 12000, 7000, 500.\nRastreie qual ramo captura cada valor. Note que só UM imprime a cada vez.'
      },
      starterCode: `damage = int(input("Damage: $"))

if damage > 10000:
    print("🔴 CRITICAL — 2h SLA")
elif damage > 5000:
    print("🟠 URGENT — 4h SLA")
elif damage >= 1000:
    print("🟡 NORMAL — 24h SLA")
else:
    print("🟢 LOW — 72h SLA")`,
      hints: [
        { en: '12000 stops at the first check; 7000 passes it and stops at the second', pt: '12000 para na primeira verificação; 7000 passa e para na segunda' }
      ],
      sampleOutput: { en: '🔴 CRITICAL — 2h SLA', pt: '🔴 CRITICAL — 2h SLA' }
    },
    {
      id: 'ex6_fill',
      title: { en: '🟡 Fill: Premium Brackets', pt: '🟡 Preencha: Faixas de Prêmio' },
      description: {
        en: 'Complete the age bracket conditions. Remember: order matters!',
        pt: 'Complete as condições de faixa etária. Lembre: a ordem importa!'
      },
      starterCode: `age = int(input("Age: "))
base = 1000

if age ___ 21:              # fill: youngest bracket
    premium = base * 2.2
elif age < ___:             # fill: under 26
    premium = base * 1.6
elif age < 60:
    premium = base * 1.0
___:                        # fill: catches everyone else
    premium = base * 1.5

print("Premium:", premium)`,
      hints: [
        { en: 'Youngest: age < 21', pt: 'Mais jovem: age < 21' },
        { en: 'The catch-all is else:', pt: 'O captura-tudo é else:' }
      ],
      sampleOutput: { en: 'Premium: 1600.0', pt: 'Premium: 1600.0' }
    },
    {
      id: 'ex6_zero',
      title: { en: '🔴 From Scratch: Concrete QC', pt: '🔴 Do Zero: QC de Concreto' },
      description: {
        en: 'Build the concrete grading system:\n• Ask strength in MPa (float)\n• >= 40 → "C40 structural"\n• >= 30 → "C30 beams"\n• >= 20 → "C20 foundations"\n• below → "REJECTED"',
        pt: 'Construa o sistema de classificação de concreto:\n• Pergunte resistência em MPa (float)\n• >= 40 → "C40 estrutural"\n• >= 30 → "C30 vigas"\n• >= 20 → "C20 fundações"\n• abaixo → "REJEITADO"'
      },
      starterCode: `# Concrete quality control:`,
      hints: [
        { en: 'Start from the HIGHEST: if strength >= 40:', pt: 'Comece do MAIS ALTO: if strength >= 40:' },
        { en: '3 branches + else', pt: '3 ramos + else' }
      ],
      sampleOutput: { en: 'C30 beams', pt: 'C30 vigas' }
    }
  ],

  quiz: [
    { id: 'q6_1', question: { en: 'Does elif order matter?', pt: 'A ordem do elif importa?' }, options: [{ en: 'Yes — top to bottom, FIRST True wins', pt: 'Sim — de cima para baixo, PRIMEIRO True vence' }, { en: 'No — all are checked', pt: 'Não — todos são verificados' }, { en: 'Only with numbers', pt: 'Só com números' }, { en: 'Python sorts automatically', pt: 'Python ordena sozinho' }], correctIndex: 0, explanation: { en: 'Python stops at the first True. Broad conditions first = specific ones never reached.', pt: 'Python para no primeiro True. Condições amplas primeiro = específicas nunca alcançadas.' } },
    { id: 'q6_2', question: { en: 'damage = 8000\nif damage > 1000: print("A")\nelif damage > 5000: print("B")\nWhat prints?', pt: 'damage = 8000\nif damage > 1000: print("A")\nelif damage > 5000: print("B")\nO que imprime?' }, options: [{ en: 'A — first condition matched, B is skipped', pt: 'A — primeira condição bateu, B é pulado' }, { en: 'B', pt: 'B' }, { en: 'A and B', pt: 'A e B' }, { en: 'Nothing', pt: 'Nada' }], correctIndex: 0, explanation: { en: '8000 > 1000 is True → "A" prints and the elif is never checked. Classic wrong-order bug!', pt: '8000 > 1000 é True → "A" imprime e o elif nunca é verificado. Clássico bug de ordem errada!' } },
    { id: 'q6_3', question: { en: 'Two separate ifs (not elif) means:', pt: 'Dois ifs separados (não elif) significa:' }, options: [{ en: 'Independent checks — both can run', pt: 'Verificações independentes — ambos podem rodar' }, { en: 'Same as elif', pt: 'Igual ao elif' }, { en: 'Only the first runs', pt: 'Só o primeiro roda' }, { en: 'Syntax error', pt: 'Erro de sintaxe' }], correctIndex: 0, explanation: { en: 'Separate ifs are evaluated independently. elif makes branches EXCLUSIVE — only one runs.', pt: 'Ifs separados são avaliados independentemente. elif torna os ramos EXCLUSIVOS — só um roda.' } },
    { id: 'q6_4', question: { en: 'Is else required after elif?', pt: 'O else é obrigatório após elif?' }, options: [{ en: 'No — optional. Without it, no match = nothing happens', pt: 'Não — opcional. Sem ele, sem match = nada acontece' }, { en: 'Yes, always', pt: 'Sim, sempre' }, { en: 'Only with 3+ elifs', pt: 'Só com 3+ elifs' }, { en: 'Yes, in Python 3', pt: 'Sim, no Python 3' }], correctIndex: 0, explanation: { en: 'else is the optional catch-all. Skipping it is valid — sometimes "do nothing" is the right default.', pt: 'else é o captura-tudo opcional. Pular é válido — às vezes "não fazer nada" é o padrão certo.' } },
    { id: 'q6_5', question: { en: 'score=85: if score>=90:"A" elif score>=80:"B" elif score>=70:"C" →', pt: 'score=85: if score>=90:"A" elif score>=80:"B" elif score>=70:"C" →' }, options: [{ en: 'B — 85 fails >=90, passes >=80, stops', pt: 'B — 85 falha >=90, passa >=80, para' }, { en: 'C', pt: 'C' }, { en: 'B and C', pt: 'B e C' }, { en: 'A', pt: 'A' }], correctIndex: 0, explanation: { en: '85 >= 90? No. 85 >= 80? Yes → B, and the chain stops immediately.', pt: '85 >= 90? Não. 85 >= 80? Sim → B, e a cadeia para imediatamente.' } },
    { id: 'q6_6', question: { en: 'How many elifs can a chain have?', pt: 'Quantos elifs uma cadeia pode ter?' }, options: [{ en: 'Unlimited', pt: 'Ilimitados' }, { en: 'Max 3', pt: 'Máx 3' }, { en: 'Max 10', pt: 'Máx 10' }, { en: 'One per if', pt: 'Um por if' }], correctIndex: 0, explanation: { en: 'No limit. Real pricing systems have dozens of elif branches.', pt: 'Sem limite. Sistemas reais de precificação têm dezenas de ramos elif.' } }
  ],

  exam: {
    title: { en: 'Full Triage + Premium System', pt: 'Sistema Completo de Triagem + Prêmio' },
    scenario: {
      en: 'Build the complete 4-tier triage used by the claims department. Each tier has a different SLA. Order your conditions carefully!',
      pt: 'Construa a triagem completa de 4 níveis usada pelo departamento de sinistros. Cada nível tem SLA diferente. Ordene suas condições com cuidado!'
    },
    requirements: {
      en: ['Ask damage amount', '>10000 → "CRITICAL - 2 hours"', '>5000 → "URGENT - 4 hours"', '>=1000 → "NORMAL - 24 hours"', 'else → "LOW - 72 hours"'],
      pt: ['Pergunte o valor do dano', '>10000 → "CRITICAL - 2 hours"', '>5000 → "URGENT - 4 hours"', '>=1000 → "NORMAL - 24 hours"', 'senão → "LOW - 72 hours"']
    },
    starterCode: `damage = int(input("Damage: $"))

# Build the 4-tier waterfall (highest first!):`,
    testCases: [
      { id: 'tc6_1', description: { en: 'Critical tier', pt: 'Nível crítico' }, inputs: ['15000'], checks: [{ type: 'contains', value: 'CRITICAL' }], points: 25 },
      { id: 'tc6_2', description: { en: 'Urgent tier', pt: 'Nível urgente' }, inputs: ['7000'], checks: [{ type: 'contains', value: 'URGENT' }], points: 25 },
      { id: 'tc6_3', description: { en: 'Normal tier', pt: 'Nível normal' }, inputs: ['2000'], checks: [{ type: 'contains', value: 'NORMAL' }], points: 25 },
      { id: 'tc6_4', description: { en: 'Low tier', pt: 'Nível baixo' }, inputs: ['500'], checks: [{ type: 'contains', value: 'LOW' }], points: 25 }
    ]
  }
}

// ============================================================================
// PHASE 7 — While · EXPANDIDO
// ============================================================================

export const phase7: Phase = {
  id: 7,
  title: { en: 'While Loops', pt: 'Loops While' },
  description: {
    en: 'Automate repetition — counters, accumulators, and input validation loops.',
    pt: 'Automatize repetição — contadores, acumuladores e loops de validação de entrada.'
  },
  icon: '🔄',
  libraries: [],

  lesson: {
    title: { en: 'The Loop That Keeps Going', pt: 'O Loop que Continua' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Loops that never sleep', pt: '🌍 Loops que nunca dormem' } },
      { type: 'text', content: {
        en: 'Instagram\'s notification engine is a while loop running non-stop since 2010:\n"WHILE server is on: check new likes → send notifications → repeat"\n\nYour bank\'s fraud monitor? A while loop checking transactions 24/7.\nEvery game you\'ve played? One giant while loop: "WHILE player is alive: draw frame → read controls → update world" — 60 times per second.\n\nComputers exist to repeat boring things perfectly. while is how you command it.',
        pt: 'O motor de notificações do Instagram é um while loop rodando sem parar desde 2010:\n"ENQUANTO servidor ligado: verificar likes → enviar notificações → repetir"\n\nO monitor de fraude do seu banco? Um while loop verificando transações 24/7.\nTodo jogo que você jogou? Um while loop gigante: "ENQUANTO jogador vivo: desenhar frame → ler controles → atualizar mundo" — 60 vezes por segundo.\n\nComputadores existem para repetir coisas chatas perfeitamente. while é como você comanda isso.'
      }},

      { type: 'heading', content: { en: '🧩 The assembly line', pt: '🧩 A linha de montagem' } },
      { type: 'text', content: {
        en: 'A car painting station:\n🏭 WHILE there are cars in the queue:\n   → paint one\n   → move it forward (queue shrinks by 1)\n🏭 Queue empty? Station stops.\n\nThree pieces every while loop needs:\n1️⃣ A starting state (queue of 5 cars / count = 1)\n2️⃣ A condition to keep going (cars remain / count <= 5)\n3️⃣ Progress toward the end (each car leaves / count += 1)\n\nMiss piece 3 and the line runs FOREVER.',
        pt: 'Uma estação de pintura de carros:\n🏭 ENQUANTO houver carros na fila:\n   → pinte um\n   → mova adiante (fila diminui em 1)\n🏭 Fila vazia? Estação para.\n\nTrês peças que todo while precisa:\n1️⃣ Um estado inicial (fila de 5 carros / count = 1)\n2️⃣ Uma condição para continuar (restam carros / count <= 5)\n3️⃣ Progresso rumo ao fim (cada carro sai / count += 1)\n\nEsqueça a peça 3 e a linha roda PARA SEMPRE.'
      }},

      { type: 'heading', content: { en: '🐍 The fundamentals', pt: '🐍 Os fundamentos' } },
      { type: 'code', code: {
        en: `# The three-part structure of a while loop
count = 1                       # 1️⃣ starting state

while count <= 5:              # 2️⃣ condition for continuing
    print("Processing claim #", count)
    count += 1                 # 3️⃣ progress toward the end

print("All done!")             # runs after the loop ends

# Trace: count changes from 1→2→3→4→5→6.
# When count is 6, 6 <= 5 is False and the loop ends.`,
        pt: `# A estrutura de três partes de um loop while
contador = 1                    # 1️⃣ estado inicial

while contador <= 5:            # 2️⃣ condição para continuar
    print("Processando solicitação #", contador)
    contador += 1               # 3️⃣ progresso em direção ao fim

print("Tudo concluído!")        # executa depois que o loop termina

# Acompanhe: contador muda de 1→2→3→4→5→6.
# Quando contador é 6, 6 <= 5 é False e o loop termina.`
      } },

      { type: 'heading', content: { en: '🐍 Deeper: accumulators, break, and validation loops', pt: '🐍 Aprofundando: acumuladores, break e loops de validação' } },
      { type: 'code', code: `# PATTERN 1: accumulator inside a loop
total = 0
count = 1
while count <= 3:
    value = int(input("Amount: "))
    total += value              # accumulate
    count += 1                  # progress
print("Total:", total)

# PATTERN 2: break — emergency exit
while True:                     # infinite on purpose!
    cmd = input("Command (quit to exit): ")
    if cmd == "quit":
        break                   # jumps out immediately
    print("You typed:", cmd)

# PATTERN 3: validation loop (ask until valid)
age = -1
while age < 0 or age > 120:
    age = int(input("Age (0-120): "))
print("Valid age:", age)` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Batch claim processing', pt: '🏗️ Cenário Real 1: Processamento em lote' } },
      { type: 'code', code: {
        en: `# End of day: process every pending claim
print("=== BATCH PROCESSOR ===")
pending = int(input("How many claims should be processed? "))

count = 1
total_payout = 0

while count <= pending:
    print(f"--- Claim {count} of {pending} ---")
    damage = int(input("Damage amount: $"))
    payout = damage - 250
    total_payout += payout
    print(f"Payout: \${payout}")
    count += 1

print()
print(f"Batch complete: {pending} claims")
print(f"Total payout: \${total_payout}")
print(f"Average payout: \${total_payout / pending}")`,
        pt: `# No fim do dia, processe todas as solicitações pendentes
print("=== PROCESSADOR EM LOTE ===")
pendentes = int(input("Quantas solicitações devem ser processadas? "))

contador = 1
total_indenizacoes = 0

while contador <= pendentes:
    print(f"--- Solicitação {contador} de {pendentes} ---")
    dano = int(input("Valor do dano: $"))
    indenizacao = dano - 250
    total_indenizacoes += indenizacao
    print(f"Indenização: \${indenizacao}")
    contador += 1

print()
print(f"Lote concluído: {pendentes} solicitações")
print(f"Total de indenizações: \${total_indenizacoes}")
print(f"Indenização média: \${total_indenizacoes / pendentes}")`
      } },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Material stock countdown', pt: '🏗️ Cenário Real 2: Contagem regressiva de estoque' } },
      { type: 'code', code: {
        en: `# Site warehouse: use cement until stock runs low
stock = 47                     # bags in the warehouse
day = 1

while stock >= 12:             # 12 bags are used per day
    stock -= 12                # consume one day of material
    print(f"Day {day}: used 12 bags; {stock} remaining")
    day += 1

print(f"⚠️ Day {day}: only {stock} bags remain — REORDER NOW")`,
        pt: `# Almoxarifado da obra: use cimento até o estoque ficar baixo
estoque = 47                   # sacos no almoxarifado
dia = 1

while estoque >= 12:           # são usados 12 sacos por dia
    estoque -= 12              # consome o material de um dia
    print(f"Dia {dia}: 12 sacos usados; restam {estoque}")
    dia += 1

print(f"⚠️ Dia {dia}: restam apenas {estoque} sacos — FAÇA UM NOVO PEDIDO")`
      } },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: {
        en: `# ❌ MISTAKE 1: forgetting to update the counter
# count = 1
# while count <= 5:
#     print(count)          # count never changes → infinite loop

# ✅ FIX: always include a line that makes progress
count = 1
while count <= 5:
    print(count)
    count += 1

# ❌ MISTAKE 2: updating the counter too early
count = 1
while count <= 3:
    count += 1              # updated before it is used
    print(count)            # prints 2, 3, 4 instead of 1, 2, 3

# ✅ FIX: use the value first and update it last
count = 1
while count <= 3:
    print(count)            # prints 1, 2, 3
    count += 1

# ❌ MISTAKE 3: starting with a false condition
count = 10
while count <= 5:           # 10 <= 5 is False, so the loop never runs
    print("This is never printed")`,
        pt: `# ❌ ERRO 1: esquecer de atualizar o contador
# contador = 1
# while contador <= 5:
#     print(contador)       # contador nunca muda → loop infinito

# ✅ CORREÇÃO: sempre inclua uma linha que gere progresso
contador = 1
while contador <= 5:
    print(contador)
    contador += 1

# ❌ ERRO 2: atualizar o contador cedo demais
contador = 1
while contador <= 3:
    contador += 1           # atualizado antes de ser usado
    print(contador)         # imprime 2, 3, 4 em vez de 1, 2, 3

# ✅ CORREÇÃO: use o valor primeiro e atualize por último
contador = 1
while contador <= 3:
    print(contador)         # imprime 1, 2, 3
    contador += 1

# ❌ ERRO 3: começar com uma condição falsa
contador = 10
while contador <= 5:        # 10 <= 5 é False, então o loop nunca executa
    print("Isto nunca é impresso")`
      } },

      { type: 'tip', content: {
        en: '💡 PRO TIP: stuck in an infinite loop while testing?\nThe stop button (⏹) kills the program. In VS Code terminal: Ctrl+C.\nBefore running any while, mentally answer: "what line brings the condition closer to False?" If you can\'t point at it — don\'t run it.',
        pt: '💡 DICA PRO: preso num loop infinito testando?\nO botão de parar (⏹) mata o programa. No terminal do VS Code: Ctrl+C.\nAntes de rodar qualquer while, responda mentalmente: "qual linha aproxima a condição de False?" Se não conseguir apontar — não rode.'
      }},

      { type: 'heading', content: { en: '📋 Summary', pt: '📋 Resumo' } },
      { type: 'text', content: {
        en: '✅ 3 pieces: start state → condition → progress\n✅ Forgetting progress = infinite loop\n✅ += accumulates totals across iterations\n✅ break exits immediately (great with while True)\n✅ Validation loop: repeat until input is acceptable\n✅ Use value first, update counter last\n\nNext: for loops + lists — looping over collections. 📋',
        pt: '✅ 3 peças: estado inicial → condição → progresso\n✅ Esquecer o progresso = loop infinito\n✅ += acumula totais entre iterações\n✅ break sai imediatamente (ótimo com while True)\n✅ Loop de validação: repete até entrada aceitável\n✅ Use o valor primeiro, atualize o contador por último\n\nPróxima: for loops + listas — percorrendo coleções. 📋'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex7_guided',
      title: { en: '🟢 Guided: Trace the Counter', pt: '🟢 Guiado: Rastreie o Contador' },
      description: {
        en: 'Run and follow count changing: 1→2→3→4→5→6 (exits at 6).\nThen change <= 5 to <= 3 and predict the output before running.',
        pt: 'Execute e acompanhe count mudando: 1→2→3→4→5→6 (sai no 6).\nDepois mude <= 5 para <= 3 e preveja a saída antes de rodar.'
      },
      starterCode: `count = 1
while count <= 5:
    print("Claim #", count, "processed")
    count += 1

print("Final count value:", count)`,
      hints: [
        { en: 'After the loop, count is 6 — the first value that failed the condition', pt: 'Após o loop, count é 6 — o primeiro valor que falhou na condição' }
      ],
      sampleOutput: { en: 'Claim # 1 processed\nClaim # 2 processed\nClaim # 3 processed\nClaim # 4 processed\nClaim # 5 processed\nFinal count value: 6', pt: 'Claim # 1 processed\n...\nFinal count value: 6' }
    },
    {
      id: 'ex7_fill',
      title: { en: '🟡 Fill: Stock Countdown', pt: '🟡 Preencha: Contagem de Estoque' },
      description: {
        en: 'Complete the warehouse countdown: consume 10 bags/day while stock lasts.',
        pt: 'Complete a contagem do almoxarifado: consuma 10 sacos/dia enquanto o estoque durar.'
      },
      starterCode: `stock = 45
day = 1

while stock ___ 10:          # fill: keep going while stock is at least 10
    stock ___ 10             # fill: consume 10
    print(f"Day {day}: {stock} bags left")
    day ___ 1                # fill: next day

print("Reorder needed!")`,
      hints: [
        { en: 'Condition: stock >= 10', pt: 'Condição: stock >= 10' },
        { en: 'Consume: stock -= 10 | Next day: day += 1', pt: 'Consumir: stock -= 10 | Próximo dia: day += 1' }
      ],
      sampleOutput: { en: 'Day 1: 35 bags left\nDay 2: 25 bags left\nDay 3: 15 bags left\nDay 4: 5 bags left\nReorder needed!', pt: 'Day 1: 35 bags left\n...\nReorder needed!' }
    },
    {
      id: 'ex7_zero',
      title: { en: '🔴 From Scratch: Batch + Average', pt: '🔴 Do Zero: Lote + Média' },
      description: {
        en: 'Build the batch processor:\n• Loop exactly 4 times\n• Ask damage each time, subtract $200 deductible\n• Accumulate total payout\n• After the loop: print total AND average',
        pt: 'Construa o processador em lote:\n• Loop exatamente 4 vezes\n• Pergunte o dano, subtraia R$200 de franquia\n• Acumule o pagamento total\n• Após o loop: imprima total E média'
      },
      starterCode: `# Batch processor (4 claims):`,
      hints: [
        { en: 'total = 0 and count = 1 before the loop', pt: 'total = 0 e count = 1 antes do loop' },
        { en: 'Average: total / 4 (after the loop)', pt: 'Média: total / 4 (após o loop)' }
      ],
      sampleOutput: { en: 'Total: 10200\nAverage: 2550.0', pt: 'Total: 10200\nAverage: 2550.0' }
    }
  ],

  quiz: [
    { id: 'q7_1', question: { en: 'The 3 pieces of every while loop:', pt: 'As 3 peças de todo while:' }, options: [{ en: 'Start state, condition, progress', pt: 'Estado inicial, condição, progresso' }, { en: 'if, elif, else', pt: 'if, elif, else' }, { en: 'input, print, exit', pt: 'input, print, exit' }, { en: 'try, except, finally', pt: 'try, except, finally' }], correctIndex: 0, explanation: { en: 'Miss the progress piece and the condition never becomes False → infinite loop.', pt: 'Esqueça a peça do progresso e a condição nunca vira False → loop infinito.' } },
    { id: 'q7_2', question: { en: 'What causes an infinite loop?', pt: 'O que causa loop infinito?' }, options: [{ en: 'The condition never becomes False', pt: 'A condição nunca se torna False' }, { en: 'Too many prints', pt: 'Prints demais' }, { en: 'Using while True with break', pt: 'Usar while True com break' }, { en: 'Large numbers', pt: 'Números grandes' }], correctIndex: 0, explanation: { en: 'Usually a forgotten counter update. while True + break is fine — break IS the exit.', pt: 'Geralmente um contador esquecido. while True + break é válido — break É a saída.' } },
    { id: 'q7_3', question: { en: 'count = 1\nwhile count < 4: count += 1\nprint(count) →', pt: 'count = 1\nwhile count < 4: count += 1\nprint(count) →' }, options: [{ en: '4', pt: '4' }, { en: '3', pt: '3' }, { en: '1', pt: '1' }, { en: 'Infinite', pt: 'Infinito' }], correctIndex: 0, explanation: { en: '1→2→3→4. At 4, 4<4 is False → exit. print shows 4.', pt: '1→2→3→4. No 4, 4<4 é False → sai. print mostra 4.' } },
    { id: 'q7_4', question: { en: 'What does break do?', pt: 'O que break faz?' }, options: [{ en: 'Exits the loop immediately', pt: 'Sai do loop imediatamente' }, { en: 'Pauses the loop', pt: 'Pausa o loop' }, { en: 'Skips one iteration', pt: 'Pula uma iteração' }, { en: 'Crashes the program', pt: 'Quebra o programa' }], correctIndex: 0, explanation: { en: 'break jumps straight out of the loop, skipping remaining iterations. (continue skips ONE iteration.)', pt: 'break pula direto para fora do loop. (continue pula UMA iteração.)' } },
    { id: 'q7_5', question: { en: 'count = 10\nwhile count <= 5: print("x")\nWhat happens?', pt: 'count = 10\nwhile count <= 5: print("x")\nO que acontece?' }, options: [{ en: 'Nothing prints — condition is False from the start', pt: 'Nada imprime — condição é False desde o início' }, { en: 'Infinite loop', pt: 'Loop infinito' }, { en: 'Prints x once', pt: 'Imprime x uma vez' }, { en: 'Error', pt: 'Erro' }], correctIndex: 0, explanation: { en: '10 <= 5 is False on the very first check → loop body never runs. Zero iterations is valid!', pt: '10 <= 5 é False já na primeira verificação → corpo nunca roda. Zero iterações é válido!' } },
    { id: 'q7_6', question: { en: 'Best pattern to ask input until valid:', pt: 'Melhor padrão para pedir input até ser válido:' }, options: [{ en: 'while loop that repeats when input is invalid', pt: 'Loop while que repete quando entrada é inválida' }, { en: 'if/else once', pt: 'if/else uma vez' }, { en: '10 copied ifs', pt: '10 ifs copiados' }, { en: 'Impossible in Python', pt: 'Impossível em Python' }], correctIndex: 0, explanation: { en: 'Validation loop: while value_is_invalid: ask again. Standard in every professional form.', pt: 'Loop de validação: while valor_invalido: pergunte de novo. Padrão em todo formulário profissional.' } }
  ],

  exam: {
    title: { en: 'Monthly Batch + Statistics', pt: 'Lote Mensal + Estatísticas' },
    scenario: {
      en: 'Month-end batch: process 5 claims with a $300 deductible each, then report total, average, and how many were above $3000 payout.',
      pt: 'Lote de fim de mês: processe 5 sinistros com R$300 de franquia cada, depois reporte total, média e quantos ficaram acima de R$3000 de pagamento.'
    },
    requirements: {
      en: ['Loop exactly 5 times', 'Ask damage, subtract 300', 'Accumulate total', 'Count payouts above 3000', 'Print total, average and count'],
      pt: ['Loop exatamente 5 vezes', 'Pergunte dano, subtraia 300', 'Acumule total', 'Conte pagamentos acima de 3000', 'Imprima total, média e contagem']
    },
    starterCode: `total = 0
big_count = 0
count = 1

# Build the loop:`,
    testCases: [
      { id: 'tc7_1', description: { en: 'Total correct', pt: 'Total correto' }, inputs: ['1000','2000','3000','4000','5000'], checks: [{ type: 'contains', value: '13500' }], points: 40 },
      { id: 'tc7_2', description: { en: 'Average correct', pt: 'Média correta' }, inputs: ['1000','2000','3000','4000','5000'], checks: [{ type: 'contains', value: '2700' }], points: 30 },
      { id: 'tc7_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: ['500','500','500','500','500'], checks: [{ type: 'no_error', value: '' }], points: 30 }
    ]
  }
}

// ============================================================================
// PHASE 8 — For + Listas · EXPANDIDO · TEMPLATE B
// ============================================================================

export const phase8: Phase = {
  id: 8,
  title: { en: 'For Loops & Lists', pt: 'For Loops e Listas' },
  description: {
    en: 'Store collections and process them automatically — the heart of data work.',
    pt: 'Armazene coleções e processe-as automaticamente — o coração do trabalho com dados.'
  },
  icon: '📋',
  libraries: [],

  lesson: {
    title: { en: 'Collections + Automation', pt: 'Coleções + Automação' },
    blocks: [

      { type: 'heading', content: { en: '🌍 Spotify loops 600 million users every morning', pt: '🌍 O Spotify percorre 600 milhões de usuários toda manhã' } },
      { type: 'text', content: {
        en: 'Every morning Spotify\'s servers run something like:\n"for user in all_600_million_users: generate Daily Mix"\n\nYour bank statement? A list of transactions, looped to calculate your balance.\nAmazon\'s "orders arriving today"? A list, looped for notifications.\nEvery Excel sheet you\'ve ever seen? Rows = a list, formulas = the loop.\n\nLists hold data. For loops do the work. Together = 90% of all data processing on Earth.',
        pt: 'Toda manhã os servidores do Spotify rodam algo como:\n"for usuario in todos_600_milhoes: gerar Daily Mix"\n\nSeu extrato bancário? Uma lista de transações, percorrida para calcular saldo.\nOs "pedidos chegando hoje" da Amazon? Uma lista, percorrida para notificações.\nToda planilha Excel que você já viu? Linhas = uma lista, fórmulas = o loop.\n\nListas guardam dados. For loops fazem o trabalho. Juntos = 90% de todo processamento de dados da Terra.'
      }},

      { type: 'heading', content: { en: '🧩 Shopping list + automatic checkout', pt: '🧩 Lista de compras + caixa automático' } },
      { type: 'text', content: {
        en: 'List = your grocery list: [milk, eggs, bread, coffee]\nFor loop = the checkout scanner:\n→ grabs milk, processes it\n→ grabs eggs, processes it\n→ ...until the basket is empty\n\nThe scanner doesn\'t care if there are 4 items or 4 million.\nSame code. That\'s the superpower.',
        pt: 'Lista = sua lista de compras: [leite, ovos, pão, café]\nFor loop = o scanner do caixa:\n→ pega o leite, processa\n→ pega os ovos, processa\n→ ...até a cesta esvaziar\n\nO scanner não liga se são 4 itens ou 4 milhões.\nMesmo código. Esse é o superpoder.'
      }},

      { type: 'heading', content: { en: '🐍 Step 1 — create and access lists', pt: '🐍 Passo 1 — criar e acessar listas' } },
      { type: 'code', code: `# Square brackets create a list
clients = ["Alice", "Bob", "Carlos", "Diana"]
damages = [1200, 4500, 8000, 250]

# Access by POSITION — starts at 0!
print(clients[0])     # Alice   (first)
print(clients[3])     # Diana   (fourth)
print(clients[-1])    # Diana   (negative = from the end!)

# Useful list tools
print(len(clients))   # 4 — how many items
clients.append("Eva") # add to the end
print(clients)        # [..., 'Eva']
print(sum(damages))   # 13950 — sum all numbers
print(max(damages))   # 8000 — biggest` },

      { type: 'heading', content: { en: '🐍 Step 2 — the for loop', pt: '🐍 Passo 2 — o for loop' } },
      { type: 'code', code: {
        en: `clients = ["Alice", "Bob", "Carlos"]

# "for EACH name IN the list"
for name in clients:
    print("Hello,", name)

# The loop variable (name) holds ONE item per turn:
# turn 1: name = "Alice"
# turn 2: name = "Bob"
# turn 3: name = "Carlos"
# list ends → loop ends. No counter needed!

# range() generates number sequences to loop over:
for i in range(3):        # 0, 1, 2
    print("Attempt", i + 1)`,
        pt: `clientes = ["Alice", "Bob", "Carlos"]

# "para CADA nome NA lista"
for nome in clientes:
    print("Olá,", nome)

# A variável do laço (nome) recebe UM item por vez:
# volta 1: nome = "Alice"
# volta 2: nome = "Bob"
# volta 3: nome = "Carlos"
# a lista termina → o laço termina. Não precisa de contador!

# range() gera sequências numéricas para percorrer:
for i in range(3):        # 0, 1, 2
    print("Tentativa", i + 1)`,
      } },

      { type: 'heading', content: { en: '🐍 Step 3 — loop + filter + accumulate', pt: '🐍 Passo 3 — loop + filtro + acumular' } },
      { type: 'code', code: `damages = [1200, 4500, 8000, 250, 3100]
total = 0
big_claims = 0

for damage in damages:
    payout = damage - 250
    total += payout               # accumulate
    if damage > 3000:             # filter inside the loop!
        big_claims += 1
        print(f"⚠️ Big claim: \${damage}")

print(f"Total payout: \${total}")
print(f"Big claims: {big_claims} of {len(damages)}")` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Claims dashboard', pt: '🏗️ Cenário Real 1: Dashboard de sinistros' } },
      { type: 'code', code: {
        en: `# Morning dashboard: process the overnight claim queue
damages = [5230, 1200, 8000, 450, 3100, 9200]
total = 0
critical = 0

print("=== MORNING QUEUE ===")
for damage in damages:
    payout = damage - 250
    total += payout
    if damage > 8000:
        critical += 1
        print(f"🔴 \${damage} → CRITICAL, escalating")
    else:
        print(f"🟢 \${damage} → payout \${payout}")

print()
print(f"Queue: {len(damages)} claims")
print(f"Critical: {critical}")
print(f"Total payout: \${total}")
print(f"Average: \${total / len(damages):.2f}")`,
        pt: `# Dashboard matinal: processe a fila de sinistros da madrugada
danos = [5230, 1200, 8000, 450, 3100, 9200]
total = 0
criticos = 0

print("=== FILA DA MANHÃ ===")
for dano in danos:
    pagamento = dano - 250
    total += pagamento
    if dano > 8000:
        criticos += 1
        print(f"🔴 R\${dano} → CRÍTICO, encaminhando")
    else:
        print(f"🟢 R\${dano} → pagamento R\${pagamento}")

print()
print(f"Fila: {len(danos)} sinistros")
print(f"Críticos: {criticos}")
print(f"Pagamento total: R\${total}")
print(f"Média: R\${total / len(danos):.2f}")`,
      } },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Multi-site inspection round', pt: '🏗️ Cenário Real 2: Ronda de inspeção multi-obra' } },
      { type: 'code', code: `# Friday inspection: visit every active site
sites = ["Warehouse A", "Tower B", "Mall C", "School D"]
progress = [85, 42, 97, 60]        # % complete, same order!

for i in range(len(sites)):        # loop by INDEX to pair two lists
    site = sites[i]
    pct = progress[i]
    if pct >= 90:
        status = "🏁 Final inspection"
    elif pct >= 50:
        status = "🔨 On track"
    else:
        status = "⚠️ Behind schedule"
    print(f"{site}: {pct}% — {status}")` },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: {
        en: `items = ["a", "b", "c"]

# ❌ MISTAKE 1: forgetting lists start at 0
# print(items[3])       → IndexError! Positions are 0, 1, 2
# ✅ Last item: items[2] or items[-1]
print(items[-1])         # c

# ❌ MISTAKE 2: resetting the accumulator INSIDE the loop
for x in [10, 20, 30]:
    total = 0            # ← resets every turn! Always ends at 30
    total += x
# ✅ FIX: initialize BEFORE the loop
total = 0
for x in [10, 20, 30]:
    total += x
print(total)             # 60 ✅

# ❌ MISTAKE 3: modifying a list while looping over it
# for item in items:
#     items.remove(item)   → skips items unpredictably!
# ✅ FIX: loop over a COPY: for item in items[:]`,
        pt: `itens = ["a", "b", "c"]

# ❌ ERRO 1: esquecer que os índices começam em 0
# print(itens[3])       → IndexError! As posições são 0, 1 e 2
# ✅ Último item: itens[2] ou itens[-1]
print(itens[-1])          # c

# ❌ ERRO 2: reiniciar o acumulador DENTRO do laço
for x in [10, 20, 30]:
    total = 0             # ← reinicia em cada volta! Sempre termina em 30
    total += x
# ✅ CORREÇÃO: inicialize ANTES do laço
total = 0
for x in [10, 20, 30]:
    total += x
print(total)              # 60 ✅

# ❌ ERRO 3: modificar uma lista enquanto a percorre
# for item in itens:
#     itens.remove(item)   → pula itens de forma imprevisível!
# ✅ CORREÇÃO: percorra uma CÓPIA: for item in itens[:]`,
      } },

      { type: 'tip', content: {
        en: '💡 PRO TIP: name the loop variable as the SINGULAR of the list.\nfor client in clients / for damage in damages / for site in sites\nYour code reads like English and bugs become obvious: "for damage in clients" instantly looks wrong.',
        pt: '💡 DICA PRO: nomeie a variável do loop como o SINGULAR da lista.\nfor cliente in clientes / for dano in danos / for obra in obras\nSeu código lê como português e bugs ficam óbvios: "for dano in clientes" parece errado na hora.'
      }},

      { type: 'heading', content: { en: '📋 Summary', pt: '📋 Resumo' } },
      { type: 'text', content: {
        en: '✅ Lists: [a, b, c] — ordered, indexed from 0, negative counts from end\n✅ Tools: len(), append(), sum(), max(), min()\n✅ for item in list: — one item per turn, no counter needed\n✅ range(n) generates 0..n-1 for numeric loops\n✅ Accumulator goes BEFORE the loop\n✅ Pair two lists with for i in range(len(list))\n\nNext: nested lists — spreadsheets in code. 🗂️',
        pt: '✅ Listas: [a, b, c] — ordenadas, índice do 0, negativo conta do fim\n✅ Ferramentas: len(), append(), sum(), max(), min()\n✅ for item in lista: — um item por vez, sem contador\n✅ range(n) gera 0..n-1 para loops numéricos\n✅ Acumulador vai ANTES do loop\n✅ Emparelhe duas listas com for i in range(len(lista))\n\nPróxima: listas aninhadas — planilhas em código. 🗂️'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex8_guided',
      title: { en: '🟢 Guided: One Item Per Turn', pt: '🟢 Guiado: Um Item Por Vez' },
      description: {
        en: 'Run and watch the loop variable take each value.\nThen add "Eva" to the list with append and run again — the loop adapts automatically!',
        pt: 'Execute e veja a variável do loop assumir cada valor.\nDepois adicione "Eva" à lista com append e rode de novo — o loop se adapta sozinho!'
      },
      starterCode: `clients = ["Alice", "Bob", "Carlos"]
print("Queue size:", len(clients))

for name in clients:
    print("Processing:", name)

print("Queue complete!")`,
      hints: [
        { en: 'Add before the loop: clients.append("Eva")', pt: 'Adicione antes do loop: clients.append("Eva")' }
      ],
      sampleOutput: { en: 'Queue size: 3\nProcessing: Alice\nProcessing: Bob\nProcessing: Carlos\nQueue complete!', pt: 'Queue size: 3\nProcessing: Alice\nProcessing: Bob\nProcessing: Carlos\nQueue complete!' }
    },
    {
      id: 'ex8_fill',
      title: { en: '🟡 Fill: Filter + Accumulate', pt: '🟡 Preencha: Filtrar + Acumular' },
      description: {
        en: 'Complete the dashboard: accumulate payouts and count big claims.',
        pt: 'Complete o dashboard: acumule pagamentos e conte sinistros grandes.'
      },
      starterCode: `damages = [1200, 4500, 8000, 650]
total = ___                     # fill: accumulator start

for damage in damages:
    payout = damage - 250
    total ___ payout            # fill: accumulate
    if damage ___ 3000:         # fill: bigger than
        print("Big claim:", damage)

print("Total:", total)`,
      hints: [
        { en: 'Start at 0, accumulate with +=', pt: 'Comece em 0, acumule com +=' },
        { en: 'Bigger than: >', pt: 'Maior que: >' }
      ],
      sampleOutput: { en: 'Big claim: 4500\nBig claim: 8000\nTotal: 13350', pt: 'Big claim: 4500\nBig claim: 8000\nTotal: 13350' }
    },
    {
      id: 'ex8_zero',
      title: { en: '🔴 From Scratch: Inspection Round', pt: '🔴 Do Zero: Ronda de Inspeção' },
      description: {
        en: 'Build the multi-site report:\n• sites = 3 names, progress = 3 percentages\n• Loop by index pairing both lists\n• >= 90 → "Final inspection" | >= 50 → "On track" | else → "Behind"\n• Print each site with status',
        pt: 'Construa o relatório multi-obra:\n• obras = 3 nomes, progresso = 3 percentuais\n• Loop por índice emparelhando as listas\n• >= 90 → "Inspeção final" | >= 50 → "No prazo" | senão → "Atrasado"\n• Imprima cada obra com status'
      },
      starterCode: `sites = ["Tower A", "Mall B", "School C"]
progress = [95, 60, 30]

# Loop by index and print each status:`,
      hints: [
        { en: 'for i in range(len(sites)):', pt: 'for i in range(len(sites)):' },
        { en: 'Access pairs: sites[i] and progress[i]', pt: 'Acesse pares: sites[i] e progress[i]' }
      ],
      sampleOutput: { en: 'Tower A: 95% — Final inspection\nMall B: 60% — On track\nSchool C: 30% — Behind', pt: 'Tower A: 95% — Inspeção final\nMall B: 60% — No prazo\nSchool C: 30% — Atrasado' }
    }
  ],

  quiz: [
    { id: 'q8_1', question: { en: 'items = ["a","b","c"] — items[1] is:', pt: 'items = ["a","b","c"] — items[1] é:' }, options: [{ en: '"b" — indexing starts at 0', pt: '"b" — índice começa no 0' }, { en: '"a"', pt: '"a"' }, { en: '"c"', pt: '"c"' }, { en: 'Error', pt: 'Erro' }], correctIndex: 0, explanation: { en: '[0]="a", [1]="b", [2]="c". First item is always index 0.', pt: '[0]="a", [1]="b", [2]="c". Primeiro item é sempre índice 0.' } },
    { id: 'q8_2', question: { en: 'items[-1] returns:', pt: 'items[-1] retorna:' }, options: [{ en: 'The LAST item', pt: 'O ÚLTIMO item' }, { en: 'The first item', pt: 'O primeiro item' }, { en: 'Error', pt: 'Erro' }, { en: 'An empty item', pt: 'Um item vazio' }], correctIndex: 0, explanation: { en: 'Negative indexes count from the end: -1 last, -2 second-to-last.', pt: 'Índices negativos contam do fim: -1 último, -2 penúltimo.' } },
    { id: 'q8_3', question: { en: 'nums=[10,20,30]\nfor n in nums: print(n)\nHow many lines?', pt: 'nums=[10,20,30]\nfor n in nums: print(n)\nQuantas linhas?' }, options: [{ en: '3 — one per item', pt: '3 — uma por item' }, { en: '1', pt: '1' }, { en: '30', pt: '30' }, { en: '60', pt: '60' }], correctIndex: 0, explanation: { en: 'The loop body runs once per item. 3 items = 3 prints.', pt: 'O corpo do loop roda uma vez por item. 3 itens = 3 prints.' } },
    { id: 'q8_4', question: { en: 'How to add "Eva" to names?', pt: 'Como adicionar "Eva" a names?' }, options: [{ en: 'names.append("Eva")', pt: 'names.append("Eva")' }, { en: 'names.add("Eva")', pt: 'names.add("Eva")' }, { en: 'names + "Eva"', pt: 'names + "Eva"' }, { en: 'names.push("Eva")', pt: 'names.push("Eva")' }], correctIndex: 0, explanation: { en: '.append() adds to the END. (.add is for sets, .push is JavaScript!)', pt: '.append() adiciona ao FINAL. (.add é de sets, .push é JavaScript!)' } },
    { id: 'q8_5', question: { en: 'range(3) generates:', pt: 'range(3) gera:' }, options: [{ en: '0, 1, 2', pt: '0, 1, 2' }, { en: '1, 2, 3', pt: '1, 2, 3' }, { en: '0, 1, 2, 3', pt: '0, 1, 2, 3' }, { en: '3, 3, 3', pt: '3, 3, 3' }], correctIndex: 0, explanation: { en: 'range(n) starts at 0 and STOPS BEFORE n. Three numbers: 0, 1, 2.', pt: 'range(n) começa em 0 e PARA ANTES de n. Três números: 0, 1, 2.' } },
    { id: 'q8_6', question: { en: 'Where does the accumulator (total = 0) go?', pt: 'Onde vai o acumulador (total = 0)?' }, options: [{ en: 'BEFORE the loop — inside resets it every turn', pt: 'ANTES do loop — dentro o reseta a cada volta' }, { en: 'Inside the loop', pt: 'Dentro do loop' }, { en: 'After the loop', pt: 'Depois do loop' }, { en: 'Anywhere', pt: 'Qualquer lugar' }], correctIndex: 0, explanation: { en: 'Inside the loop, total = 0 wipes the sum every iteration — classic bug. Initialize before!', pt: 'Dentro do loop, total = 0 apaga a soma a cada iteração — bug clássico. Inicialize antes!' } }
  ],

  exam: {
    title: { en: 'Full Claims Dashboard', pt: 'Dashboard Completo de Sinistros' },
    scenario: {
      en: 'Build the morning dashboard: process the overnight queue, apply deductibles, flag critical claims, and report full statistics.',
      pt: 'Construa o dashboard matinal: processe a fila da madrugada, aplique franquias, sinalize sinistros críticos e reporte estatísticas completas.'
    },
    requirements: {
      en: ['Use the provided damages list', 'Loop applying $250 deductible', 'Count claims above $5000', 'Print total payout, count of claims, count of big ones'],
      pt: ['Use a lista de danos fornecida', 'Percorra aplicando R$250 de franquia', 'Conte sinistros acima de R$5000', 'Imprima pagamento total, quantidade de sinistros, quantidade de grandes']
    },
    starterCode: `damages = [5230, 1200, 8000, 450, 3100, 9200]

# Build your dashboard:`,
    testCases: [
      { id: 'tc8_1', description: { en: 'Total payout 25680', pt: 'Pagamento total 25680' }, inputs: [], checks: [{ type: 'contains', value: '25680' }], points: 40 },
      { id: 'tc8_2', description: { en: 'Claim count 6', pt: 'Contagem 6' }, inputs: [], checks: [{ type: 'contains', value: '6' }], points: 20 },
      { id: 'tc8_3', description: { en: 'Big claims counted', pt: 'Grandes contados' }, inputs: [], checks: [{ type: 'contains', value: '3' }], points: 20 },
      { id: 'tc8_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

