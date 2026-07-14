import type { Phase } from '../types'

// ============================================================================
// PHASE 1 — print() · TEMPLATE A EXPANDIDO (aula de 6-8 min)
// ============================================================================

export const phase1: Phase = {
  id: 1,
  title: { en: 'Your First Program', pt: 'Seu Primeiro Programa' },
  description: {
    en: 'Write your first Python code and understand how programs communicate.',
    pt: 'Escreva seu primeiro código Python e entenda como programas se comunicam.'
  },
  icon: '🐍',
  libraries: [],

  lesson: {
    title: { en: 'print() — Make the Computer Speak', pt: 'print() — Faça o Computador Falar' },
    blocks: [

      { type: 'heading', content: { en: '🌍 One function, trillions of uses', pt: '🌍 Uma função, trilhões de usos' } },
      { type: 'text', content: {
        en: 'Every Python program ever written — at Google, NASA, Netflix or your bank — uses the function you\'re about to learn.\n\nWhen Netflix logs "user watched episode 3", that\'s print (to a file).\nWhen your bank\'s system records "transfer approved", that\'s print.\nWhen NASA\'s Mars rover reports "landing successful" — print.\n\nEstimates say print() runs over 1 trillion times per day worldwide. You\'re about to join that club.',
        pt: 'Todo programa Python já escrito — no Google, NASA, Netflix ou no seu banco — usa a função que você vai aprender agora.\n\nQuando a Netflix registra "usuário assistiu episódio 3", isso é print (para um arquivo).\nQuando o sistema do seu banco grava "transferência aprovada", isso é print.\nQuando o rover da NASA em Marte reporta "pouso bem-sucedido" — print.\n\nEstimativas dizem que print() roda mais de 1 trilhão de vezes por dia no mundo. Você está prestes a entrar nesse clube.'
      }},

      { type: 'heading', content: { en: '🧩 The megaphone analogy', pt: '🧩 A analogia do megafone' } },
      { type: 'text', content: {
        en: 'Your program is a person working inside a closed room.\nThe screen is the world outside.\nprint() is the megaphone.\n\nWhatever you put inside print( ), the computer grabs the megaphone and shouts it on the screen.\n\nSimple rules:\n✅ Text → always inside quotes: print("hello")\n✅ Numbers → no quotes: print(42)\n✅ Math → calculated first, then shouted: print(10 + 5) shouts 15',
        pt: 'Seu programa é uma pessoa trabalhando dentro de uma sala fechada.\nA tela é o mundo lá fora.\nprint() é o megafone.\n\nO que você colocar dentro de print( ), o computador pega o megafone e grita na tela.\n\nRegras simples:\n✅ Texto → sempre entre aspas: print("olá")\n✅ Números → sem aspas: print(42)\n✅ Matemática → calculada primeiro, depois gritada: print(10 + 5) grita 15'
      }},

      { type: 'heading', content: { en: '🐍 The fundamentals', pt: '🐍 Os fundamentos' } },
      { type: 'code', code: `# print() shows things on the screen
print("Hello, World!")     # text needs quotes
print(42)                  # numbers don't
print(10 + 5)              # math is calculated first → 15

# Print multiple things at once (separated by commas)
print("Age:", 28)                    # Age: 28
print("Name:", "Alice", "| Age:", 28) # Name: Alice | Age: 28

# The comma adds a space automatically!` },

      { type: 'heading', content: { en: '🐍 Going deeper: quotes, comments, and lines', pt: '🐍 Aprofundando: aspas, comentários e linhas' } },
      { type: 'code', code: `# Single or double quotes — both work
print('single quotes work')
print("double quotes work")

# But be careful when text CONTAINS a quote:
print("It's easy")          # ✅ double outside, single inside
print('She said "hi"')      # ✅ single outside, double inside

# Comments: everything after # is IGNORED by Python
print("this runs")   # this note is ignored
# print("this NEVER runs — the whole line is a comment")

# Empty print() creates a blank line
print("Line 1")
print()                      # blank line here
print("Line 3")` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 1: Insurance system startup', pt: '🏗️ Cenário Real 1: Inicialização de sistema de seguros' } },
      { type: 'text', content: {
        en: 'You just joined an insurance company as a dev intern.\nEvery morning at 6 AM, the claims system starts and prints a status report to the operations team.\n\nThis is a REAL pattern — every server in production prints startup logs exactly like this:',
        pt: 'Você acabou de entrar numa seguradora como dev trainee.\nToda manhã às 6h, o sistema de sinistros inicia e imprime um relatório de status para a equipe de operações.\n\nEste é um padrão REAL — todo servidor em produção imprime logs de inicialização exatamente assim:'
      }},
      { type: 'code', code: `# Claims system startup report
print("=====================================")
print("   CLAIMPRO INSURANCE - SYSTEM START")
print("=====================================")
print()
print("Date:", "2026-07-11")
print("Open claims:", 47)
print("Pending review:", 12)
print("Total in queue:", 47 + 12)      # Python calculates: 59
print()
print("System ready. Good morning, team!")` },

      { type: 'heading', content: { en: '🏗️ Real Scenario 2: Construction site report', pt: '🏗️ Cenário Real 2: Relatório de obra' } },
      { type: 'text', content: {
        en: 'Now imagine you manage 3 renovation sites.\nEvery Friday you print a materials summary for the warehouse team.\nSame function, different business:',
        pt: 'Agora imagine que você gerencia 3 obras.\nToda sexta você imprime um resumo de materiais para a equipe do almoxarifado.\nMesma função, negócio diferente:'
      }},
      { type: 'code', code: `# Weekly materials report
print("--- MATERIALS USED THIS WEEK ---")
print("Cement bags:", 120)
print("Steel bars:", 85)
print("Paint gallons:", 32)
print()
print("Cement cost: $", 120 * 8)      # 120 bags × $8 = $960
print("Steel cost: $", 85 * 15)       # 85 bars × $15 = $1275
print("Total spent: $", 120 * 8 + 85 * 15 + 32 * 25)` },

      { type: 'heading', content: { en: '⚠️ Common mistakes (everyone makes these)', pt: '⚠️ Erros comuns (todo mundo comete)' } },
      { type: 'code', code: {
        en: `# ❌ MISTAKE 1: forgetting quotes around text
# print(Hello)          → NameError! Python treats Hello as a variable name

# ✅ FIX:
print("Hello")

# ❌ MISTAKE 2: putting a calculation inside quotes
print("10 + 5")          # displays the text 10 + 5; it does not calculate

# ✅ FIX: remove the quotes when you want Python to calculate
print(10 + 5)            # displays 15

# ❌ MISTAKE 3: using Print with a capital P
# Print("hi")           → NameError! Python is case-sensitive

# ✅ FIX: use lowercase print
print("hi")`,
        pt: `# ❌ ERRO 1: esquecer as aspas ao redor do texto
# print(Ola)            → NameError! Python interpreta Ola como nome de variável

# ✅ CORREÇÃO:
print("Olá")

# ❌ ERRO 2: colocar um cálculo entre aspas
print("10 + 5")          # exibe o texto 10 + 5; não realiza o cálculo

# ✅ CORREÇÃO: remova as aspas quando quiser que Python calcule
print(10 + 5)            # exibe 15

# ❌ ERRO 3: usar Print com P maiúsculo
# Print("oi")           → NameError! Python diferencia maiúsculas e minúsculas

# ✅ CORREÇÃO: use print em letras minúsculas
print("oi")`
      } },

      { type: 'tip', content: {
        en: '💡 PRO TIP: Python is case-sensitive.\nprint ≠ Print ≠ PRINT. Only lowercase print() exists.\nThis rule applies to EVERYTHING in Python — remember it forever.',
        pt: '💡 DICA PRO: Python diferencia maiúsculas de minúsculas.\nprint ≠ Print ≠ PRINT. Apenas print() minúsculo existe.\nEssa regra vale para TUDO no Python — lembre para sempre.'
      }},

      { type: 'heading', content: { en: '📋 Recap — what you learned', pt: '📋 Recap — o que você aprendeu' } },
      { type: 'text', content: {
        en: '✅ print() displays things on screen\n✅ Text needs quotes: print("hi") — numbers don\'t: print(42)\n✅ Math inside print is calculated first: print(2+3) → 5\n✅ Commas print multiple values with spaces: print("Age:", 30)\n✅ # starts a comment — Python ignores it\n✅ Python is case-sensitive: only lowercase print works\n\nNext phase: making Python do real math for insurance and construction. 🚀',
        pt: '✅ print() exibe coisas na tela\n✅ Texto precisa de aspas: print("oi") — números não: print(42)\n✅ Matemática dentro do print é calculada antes: print(2+3) → 5\n✅ Vírgulas imprimem múltiplos valores com espaços: print("Idade:", 30)\n✅ # inicia um comentário — Python o ignora\n✅ Python diferencia maiúsculas: só print minúsculo funciona\n\nPróxima fase: fazendo Python calcular de verdade para seguros e construção. 🚀'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex1_guided',
      title: { en: '🟢 Guided: Run Your First Code', pt: '🟢 Guiado: Rode Seu Primeiro Código' },
      description: {
        en: 'This code is complete. Just RUN it and observe:\n• How text and numbers print differently\n• How the math is calculated\nThen change "Alice" to YOUR name and run again.',
        pt: 'Este código está completo. Apenas EXECUTE e observe:\n• Como texto e números imprimem diferente\n• Como a matemática é calculada\nDepois troque "Alice" pelo SEU nome e rode de novo.'
      },
      starterCode: `print("Welcome to Python!")
print("My name is", "Alice")
print("My age is", 28)
print("In 10 years I'll be", 28 + 10)
print()
print("This is my first program!")`,
      hints: [
        { en: 'Click Run and watch each line print in order', pt: 'Clique em Executar e veja cada linha imprimir em ordem' },
        { en: 'Change "Alice" (keep the quotes!) and run again', pt: 'Troque "Alice" (mantenha as aspas!) e rode de novo' }
      ],
      sampleOutput: { en: 'Welcome to Python!\nMy name is Alice\nMy age is 28\nIn 10 years I\'ll be 38\n\nThis is my first program!', pt: 'Welcome to Python!\nMy name is Alice\nMy age is 28\nIn 10 years I\'ll be 38\n\nThis is my first program!' }
    },
    {
      id: 'ex1_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'The insurance startup report is almost done.\nFill in the 3 blanks: company name (text), claim count (number), and the sum.',
        pt: 'O relatório de inicialização está quase pronto.\nPreencha as 3 lacunas: nome da empresa (texto), contagem de sinistros (número) e a soma.'
      },
      starterCode: `print("=== SYSTEM START ===")
print("Company:", ___)          # fill: "ClaimPro" (with quotes!)
print("Open claims:", ___)      # fill: 47 (no quotes!)
print("New today:", 12)
print("Total:", ___ + 12)       # fill: 47 again`,
      hints: [
        { en: 'Company name is text → needs quotes: "ClaimPro"', pt: 'Nome da empresa é texto → precisa de aspas: "ClaimPro"' },
        { en: 'Numbers never use quotes: 47', pt: 'Números nunca usam aspas: 47' }
      ],
      sampleOutput: { en: '=== SYSTEM START ===\nCompany: ClaimPro\nOpen claims: 47\nNew today: 12\nTotal: 59', pt: '=== SYSTEM START ===\nCompany: ClaimPro\nOpen claims: 47\nNew today: 12\nTotal: 59' }
    },
    {
      id: 'ex1_zero',
      title: { en: '🔴 From Scratch: Site Report', pt: '🔴 Do Zero: Relatório de Obra' },
      description: {
        en: 'Write a construction materials report that prints:\n1. A title line\n2. Cement bags: 80\n3. Cost per bag: 9\n4. Total cost (80 × 9, calculated by Python)\n5. A closing message',
        pt: 'Escreva um relatório de materiais que imprima:\n1. Uma linha de título\n2. Sacos de cimento: 80\n3. Custo por saco: 9\n4. Custo total (80 × 9, calculado pelo Python)\n5. Uma mensagem de fechamento'
      },
      starterCode: `# Write your 5 print() lines below:`,
      hints: [
        { en: 'Use * for multiplication: print("Total:", 80 * 9)', pt: 'Use * para multiplicação: print("Total:", 80 * 9)' },
        { en: 'Mix text and numbers with commas', pt: 'Misture texto e números com vírgulas' }
      ],
      sampleOutput: { en: '--- MATERIALS REPORT ---\nCement bags: 80\nCost per bag: 9\nTotal cost: 720\nReport complete!', pt: '--- RELATÓRIO DE MATERIAIS ---\nSacos de cimento: 80\nCusto por saco: 9\nCusto total: 720\nRelatório completo!' }
    }
  ],

  quiz: [
    {
      id: 'q1_1',
      question: { en: 'To print the text Hello on screen:', pt: 'Para imprimir o texto Olá na tela:' },
      options: [
        { en: 'print("Hello")', pt: 'print("Olá")' },
        { en: 'print(Hello)', pt: 'print(Olá)' },
        { en: 'Print("Hello")', pt: 'Print("Olá")' },
        { en: 'show "Hello"', pt: 'show "Olá"' }
      ],
      correctIndex: 0,
      explanation: { en: 'Text needs quotes AND print must be lowercase. print(Hello) without quotes = NameError.', pt: 'Texto precisa de aspas E print deve ser minúsculo. print(Olá) sem aspas = NameError.' }
    },
    {
      id: 'q1_2',
      question: { en: 'What does print(3 + 7) show?', pt: 'O que print(3 + 7) mostra?' },
      options: [
        { en: '10', pt: '10' },
        { en: '3 + 7', pt: '3 + 7' },
        { en: '"10"', pt: '"10"' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 0,
      explanation: { en: 'No quotes = Python calculates first. 3 + 7 = 10 is printed.', pt: 'Sem aspas = Python calcula primeiro. 3 + 7 = 10 é impresso.' }
    },
    {
      id: 'q1_3',
      question: { en: 'What does print("3 + 7") show?', pt: 'O que print("3 + 7") mostra?' },
      options: [
        { en: '3 + 7  (literally, as text)', pt: '3 + 7  (literalmente, como texto)' },
        { en: '10', pt: '10' },
        { en: 'Error', pt: 'Erro' },
        { en: 'Nothing', pt: 'Nada' }
      ],
      correctIndex: 0,
      explanation: { en: 'WITH quotes it\'s text — Python prints it exactly as written, no math.', pt: 'COM aspas é texto — Python imprime exatamente como escrito, sem matemática.' }
    },
    {
      id: 'q1_4',
      question: { en: 'What does # do in Python?', pt: 'O que # faz no Python?' },
      options: [
        { en: 'Starts a comment — Python ignores the rest of the line', pt: 'Inicia um comentário — Python ignora o resto da linha' },
        { en: 'Prints a hashtag', pt: 'Imprime uma hashtag' },
        { en: 'Marks important code', pt: 'Marca código importante' },
        { en: 'Causes an error', pt: 'Causa um erro' }
      ],
      correctIndex: 0,
      explanation: { en: 'Comments are notes for humans. Python skips everything after # on that line.', pt: 'Comentários são notas para humanos. Python pula tudo após # naquela linha.' }
    },
    {
      id: 'q1_5',
      question: { en: 'print("Age:", 30) prints:', pt: 'print("Idade:", 30) imprime:' },
      options: [
        { en: 'Age: 30  (comma adds a space)', pt: 'Idade: 30  (vírgula adiciona espaço)' },
        { en: 'Age:30', pt: 'Idade:30' },
        { en: 'Age:,30', pt: 'Idade:,30' },
        { en: 'Error — can\'t mix text and numbers', pt: 'Erro — não pode misturar texto e números' }
      ],
      correctIndex: 0,
      explanation: { en: 'The comma in print() automatically adds a space between values. Mixing text and numbers this way is totally fine.', pt: 'A vírgula no print() adiciona espaço automaticamente entre valores. Misturar texto e números assim é totalmente válido.' }
    },
    {
      id: 'q1_6',
      question: { en: 'Why does Print("hi") fail?', pt: 'Por que Print("oi") falha?' },
      options: [
        { en: 'Python is case-sensitive — only lowercase print exists', pt: 'Python diferencia maiúsculas — só print minúsculo existe' },
        { en: 'Missing semicolon', pt: 'Faltando ponto e vírgula' },
        { en: '"hi" is too short', pt: '"oi" é muito curto' },
        { en: 'It doesn\'t fail', pt: 'Não falha' }
      ],
      correctIndex: 0,
      explanation: { en: 'NameError: name \'Print\' is not defined. Case matters for EVERYTHING in Python.', pt: 'NameError: name \'Print\' is not defined. Maiúsculas importam para TUDO no Python.' }
    }
  ],

  exam: {
    title: { en: 'Phase 1 Exam: System Welcome Screen', pt: 'Exame Fase 1: Tela de Boas-Vindas' },
    expectedOutput: {
      en: 'ClaimPro Insurance\nClaims Processing\nOpen claims: 47\nNew claims today: 12\nTotal: 59',
      pt: 'ClaimPro Insurance\nClaims Processing\nSinistros abertos: 47\nNovos sinistros: 12\nTotal de sinistros: 59',
    },
    scenario: {
      en: 'First task at ClaimPro Insurance: build the morning startup screen that operations sees every day at 6 AM. It must show company info and today\'s claim numbers.',
      pt: 'Primeira tarefa na ClaimPro Insurance: criar a tela de inicialização matinal que operações vê todo dia às 6h. Deve mostrar informações da empresa e números de sinistros de hoje.'
    },
    requirements: {
      en: [
        'Print the company name: "ClaimPro Insurance"',
        'Print the department: "Claims Processing"',
        'Print open claims: 47',
        'Print new claims arriving: 12',
        'Print the total (47 + 12, calculated by Python)'
      ],
      pt: [
        'Imprima o nome da empresa: "ClaimPro Insurance"',
        'Imprima o departamento: "Claims Processing"',
        'Imprima sinistros abertos: 47',
        'Imprima novos sinistros chegando: 12',
        'Imprima o total (47 + 12, calculado pelo Python)'
      ]
    },
    starterCode: `# Morning startup screen
# Write your print() lines below:`,
    testCases: [
      { id: 'tc1_1', description: { en: 'Shows company name', pt: 'Mostra nome da empresa' }, inputs: [], checks: [{ type: 'contains', value: 'ClaimPro Insurance', textMode: 'compact' }], points: 20 },
      { id: 'tc1_2', description: { en: 'Shows department', pt: 'Mostra departamento' }, inputs: [], checks: [{ type: 'contains', value: 'Claims Processing', textMode: 'compact' }], points: 20 },
      { id: 'tc1_3', description: { en: 'Shows 47', pt: 'Mostra 47' }, inputs: [], checks: [{ type: 'contains', value: '47' }], points: 20 },
      { id: 'tc1_4', description: { en: 'Shows 12', pt: 'Mostra 12' }, inputs: [], checks: [{ type: 'contains', value: '12' }], points: 20 },
      { id: 'tc1_5', description: { en: 'Shows total 59', pt: 'Mostra total 59' }, inputs: [], checks: [{ type: 'contains', value: '59' }], points: 20 }
    ]
  }
}
