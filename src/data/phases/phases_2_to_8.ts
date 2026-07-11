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
      { type: 'code', code: `# ❌ MISTAKE 1: expecting / to give whole numbers
result = 10 / 2
print(result)          # 5.0 — surprise! Division always gives float

# ❌ MISTAKE 2: forgetting operator precedence
average = 10 + 20 / 2
print(average)         # 20.0 — WRONG! Only 20 was divided
# ✅ FIX:
average = (10 + 20) / 2
print(average)         # 15.0 — correct

# ❌ MISTAKE 3: using x for multiplication
# print(5 x 3)         → SyntaxError! x is not an operator
# ✅ FIX: always use *
print(5 * 3)           # 15` },

      { type: 'tip', content: {
        en: '💡 PRO TIP: percentage cheat sheet\n• 80% of X → X * 0.80\n• X plus 10% → X * 1.10\n• X minus 25% → X * 0.75\nMemorize these three patterns — they appear in EVERY financial calculation.',
        pt: '💡 DICA PRO: cola de percentuais\n• 80% de X → X * 0.80\n• X mais 10% → X * 1.10\n• X menos 25% → X * 0.75\nMemorize esses três padrões — aparecem em TODO cálculo financeiro.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recap' } },
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
      { type: 'code', code: `# label = value
client_name = "Alice Costa"    # str  (text, needs quotes)
claim_amount = 5230             # int  (whole number)
coverage_rate = 0.80            # float (decimal number)
is_approved = True              # bool (True or False, capital first letter!)

# Use them by name
print(client_name)              # Alice Costa
print(claim_amount)             # 5230

# Combine in calculations
payout = claim_amount * coverage_rate
print("Payout:", payout)        # Payout: 4184.0

# Check any variable's type
print(type(client_name))        # <class 'str'>
print(type(claim_amount))       # <class 'int'>` },

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
      { type: 'code', code: `# ❌ MISTAKE 1: using a variable before creating it
# print(salary)        → NameError: name 'salary' is not defined
# ✅ FIX: create first, use after
salary = 5000
print(salary)

# ❌ MISTAKE 2: invalid variable names
# 2client = "Ana"      → SyntaxError (can't start with number)
# client-name = "Ana"  → SyntaxError (no hyphens)
# client name = "Ana"  → SyntaxError (no spaces)
# ✅ FIX: letters, numbers, underscore — start with letter
client_name2 = "Ana"

# ❌ MISTAKE 3: confusing = with ==
# = STORES a value.  == COMPARES two values.
x = 5           # store 5 in x
print(x == 5)   # compare: is x equal to 5? → True` },

      { type: 'tip', content: {
        en: '💡 PRO TIP: name variables like you\'d explain them to a colleague.\n❌ x, a, temp, data2\n✅ client_name, total_payout, monthly_premium\nGood names make code self-documenting. 6 months from now, "x" tells you nothing.',
        pt: '💡 DICA PRO: nomeie variáveis como explicaria a um colega.\n❌ x, a, temp, data2\n✅ nome_cliente, total_pagamento, premio_mensal\nBons nomes tornam o código auto-documentado. Daqui 6 meses, "x" não te diz nada.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recap' } },
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
      { type: 'code', code: `# Complete claim intake — mixing text and number inputs
print("=== NEW CLAIM INTAKE ===")

client   = input("Client name: ")               # text, no conversion
phone    = input("Phone: ")                     # phone is TEXT (has dashes!)
damage   = int(input("Damage amount: $"))       # number for math
ded      = int(input("Deductible: $"))          # number for math

payout = damage - ded

print()
print(f"=== CLAIM SUMMARY ===")
print(f"Client: {client}")
print(f"Phone:  {phone}")
print(f"Damage: {damage}")
print(f"Payout: {payout}")` },

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

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recap' } },
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
  title: { en: 'If / Else', pt: 'If / Else' },
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
      { type: 'code', code: `damage = 8000

if damage > 5000:                  # condition + colon
    print("🔴 HIGH PRIORITY")      # indented = inside the if
    print("Send expert adjuster")  # still inside
else:
    print("🟢 Standard claim")     # runs only if condition is False

print("Done.")                      # NOT indented = always runs

# THE 6 COMPARISON OPERATORS:
x = 10
print(x > 5)     # True   greater than
print(x < 5)     # False  less than
print(x >= 10)   # True   greater OR equal
print(x <= 9)    # False  less OR equal
print(x == 10)   # True   equal (TWO equals signs!)
print(x != 7)    # True   NOT equal` },

      { type: 'heading', content: { en: '🐍 Deeper: combining conditions with and / or / not', pt: '🐍 Aprofundando: combinando condições com and / or / not' } },
      { type: 'code', code: `damage = 7000
days_since_policy = 15

# AND — both must be True
if damage > 5000 and days_since_policy < 30:
    print("⚠️ Large claim soon after policy — investigate")

# OR — at least one must be True
region = "flood_zone"
if region == "flood_zone" or damage > 10000:
    print("Requires senior review")

# NOT — inverts the condition
is_approved = False
if not is_approved:
    print("Still pending")

# Comparing TEXT works too (case-sensitive!)
status = "approved"
if status == "approved":
    print("✅ Release payment")
# "Approved" != "approved" — capital letters matter!` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Fraud detection gate', pt: '🏗️ Cenário Real 1: Portão de detecção de fraude' } },
      { type: 'text', content: {
        en: 'Insurance companies flag claims filed suspiciously soon after a policy starts. A real rule used in the industry: claim within 30 days of policy start AND above $5,000 → automatic investigation.',
        pt: 'Seguradoras sinalizam sinistros abertos suspeitosamente cedo após o início da apólice. Uma regra real usada no setor: sinistro em até 30 dias do início E acima de R$5.000 → investigação automática.'
      }},
      { type: 'code', code: `print("=== FRAUD CHECK ===")
damage = int(input("Damage amount: $"))
days = int(input("Days since policy start: "))

if damage > 5000 and days < 30:
    print("🚨 FLAGGED: large claim soon after policy start")
    print("Routing to Special Investigations Unit")
else:
    print("✅ Passed fraud check")
    print("Routing to standard processing")` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Construction safety check', pt: '🏗️ Cenário Real 2: Verificação de segurança de obra' } },
      { type: 'code', code: `# Site safety gate: wind speed and crane operations
wind_speed = float(input("Wind speed (km/h): "))
crane_active = input("Crane operating? (yes/no): ")

if wind_speed > 40 and crane_active == "yes":
    print("🚨 STOP CRANE OPERATIONS IMMEDIATELY")
    print("Wind exceeds 40 km/h safety limit")
elif wind_speed > 40:
    print("⚠️ High wind — cranes must stay offline")
else:
    print("✅ Conditions safe for all operations")` },

      { type: 'heading', content: { en: '⚠️ Common mistakes', pt: '⚠️ Erros comuns' } },
      { type: 'code', code: `x = 10

# ❌ MISTAKE 1: single = in condition
# if x = 10:          → SyntaxError! = assigns, == compares
# ✅ FIX:
if x == 10:
    print("ten")

# ❌ MISTAKE 2: forgetting the colon
# if x > 5            → SyntaxError: expected ':'
# ✅ FIX:
if x > 5:
    print("big")

# ❌ MISTAKE 3: wrong indentation
# if x > 5:
# print("big")        → IndentationError!
# ✅ FIX: indent 4 spaces inside the if
if x > 5:
    print("big")

# ❌ MISTAKE 4: comparing number with text
guess = input("Guess: ")    # returns "10" (text!)
# if guess == 10:            → always False! "10" != 10
# ✅ FIX: convert first
if int(guess) == 10:
    print("Correct!")` },

      { type: 'tip', content: {
        en: '💡 PRO TIP: read conditions out loud.\nif damage > 5000 and days < 30 →\n"IF damage is over five thousand AND days is under thirty"\nIf the sentence sounds wrong out loud, the logic is probably wrong too.',
        pt: '💡 DICA PRO: leia condições em voz alta.\nif dano > 5000 and dias < 30 →\n"SE o dano é maior que cinco mil E os dias são menos que trinta"\nSe a frase soa errada em voz alta, a lógica provavelmente está errada também.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recap' } },
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
