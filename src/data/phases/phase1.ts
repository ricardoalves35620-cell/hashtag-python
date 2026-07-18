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

      { type: 'heading', content: { en: '🎵 Real Scenario 1: Music app startup', pt: '🎵 Cenário Real 1: Inicialização de app de música' } },
      { type: 'text', content: {
        en: 'You just joined MusicBox, a music streaming startup, as a dev intern.\nEvery morning the server starts and prints a status report so the team knows everything is running.\n\nThis is a REAL pattern — every server in production prints startup logs exactly like this:',
        pt: 'Você acabou de entrar na MusicBox, uma startup de streaming de música, como dev trainee.\nToda manhã o servidor inicia e imprime um relatório de status para que o time saiba que está tudo funcionando.\n\nEste é um padrão REAL — todo servidor em produção imprime logs de inicialização exatamente assim:'
      }},
      { type: 'code', code: `# MusicBox startup report
print("=====================================")
print("     MUSICBOX - SYSTEM START")
print("=====================================")
print()
print("Date:", "2026-07-11")
print("New songs today:", 47)
print("New playlists:", 12)
print("Total updates:", 47 + 12)      # Python calculates: 59
print()
print("System ready. Good morning, team!")` },

      { type: 'heading', content: { en: '☕ Real Scenario 2: Coffee shop daily report', pt: '☕ Cenário Real 2: Relatório diário de cafeteria' } },
      { type: 'text', content: {
        en: 'Now imagine you work at a coffee shop.\nEvery evening you print a sales summary so the owner knows the day\'s revenue.\nSame function, different business:',
        pt: 'Agora imagine que você trabalha numa cafeteria.\nToda tarde você imprime um resumo de vendas para que o dono saiba a receita do dia.\nMesma função, negócio diferente:'
      }},
      { type: 'code', code: `# Coffee shop daily report
print("--- DAILY SALES REPORT ---")
print("Coffees sold:", 120)
print("Pastries sold:", 85)
print("Juices sold:", 32)
print()
print("Coffee revenue: $", 120 * 5)    # 120 coffees × $5 = $600
print("Pastry revenue: $", 85 * 4)     # 85 pastries × $4 = $340
print("Total revenue: $", 120 * 5 + 85 * 4 + 32 * 6)` },

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
        en: '✅ print() displays things on screen\n✅ Text needs quotes: print("hi") — numbers don\'t: print(42)\n✅ Math inside print is calculated first: print(2+3) → 5\n✅ Commas print multiple values with spaces: print("Age:", 30)\n✅ # starts a comment — Python ignores it\n✅ Python is case-sensitive: only lowercase print works\n\nNext phase: making Python do real math with variables and numbers. 🚀',
        pt: '✅ print() exibe coisas na tela\n✅ Texto precisa de aspas: print("oi") — números não: print(42)\n✅ Matemática dentro do print é calculada antes: print(2+3) → 5\n✅ Vírgulas imprimem múltiplos valores com espaços: print("Idade:", 30)\n✅ # inicia um comentário — Python o ignora\n✅ Python diferencia maiúsculas: só print minúsculo funciona\n\nPróxima fase: fazendo Python calcular de verdade com variáveis e números. 🚀'
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
        en: 'The MusicBox startup report is almost done.\nFill in the 3 blanks marked with ___:\n• Line 2: the app name as text (needs quotes)\n• Line 3: the number of new songs (no quotes!)\n• Line 5: the same number of new songs again (for the sum)\n\nLook at the expected output below to know exactly what to fill in.',
        pt: 'O relatório de inicialização do MusicBox está quase pronto.\nPreencha as 3 lacunas marcadas com ___:\n• Linha 2: o nome do app como texto (precisa de aspas)\n• Linha 3: o número de novas músicas (sem aspas!)\n• Linha 5: o mesmo número de novas músicas de novo (para a soma)\n\nVeja a saída esperada abaixo para saber exatamente o que preencher.'
      },
      starterCode: `print("=== SYSTEM START ===")
print("App:", ___)              # fill: "MusicBox" (with quotes — it's text!)
print("New songs:", ___)        # fill: 47 (no quotes — it's a number!)
print("New playlists:", 12)
print("Total:", ___ + 12)       # fill: 47 again (same number as line 3)`,
      hints: [
        { en: 'App name is text → needs quotes: "MusicBox"', pt: 'Nome do app é texto → precisa de aspas: "MusicBox"' },
        { en: 'Numbers never use quotes: 47', pt: 'Números nunca usam aspas: 47' }
      ],
      sampleOutput: { en: '=== SYSTEM START ===\nApp: MusicBox\nNew songs: 47\nNew playlists: 12\nTotal: 59', pt: '=== SYSTEM START ===\nApp: MusicBox\nNew songs: 47\nNew playlists: 12\nTotal: 59' }
    },
    {
      id: 'ex1_zero',
      title: { en: '🔴 From Scratch: Coffee Shop Report', pt: '🔴 Do Zero: Relatório de Cafeteria' },
      description: {
        en: 'Write a coffee shop report from scratch. Your code must print exactly these 5 lines in order:\n\n1. --- COFFEE SHOP REPORT ---\n2. Coffees sold: 80\n3. Price per coffee: 5\n4. Total revenue: 400     ← Python must calculate 80 * 5 for you\n5. Report complete!\n\nSteps to follow:\n1. Click inside the code area.\n2. Type each print() line one by one — start with the title.\n3. For line 4, write  print("Total revenue:", 80 * 5)  so Python does the math.\n4. Click Run and check that your output matches the 5 lines above exactly.\n5. If any line is wrong, find it and fix the typo before submitting.',
        pt: 'Escreva um relatório de cafeteria do zero. Seu código deve imprimir exatamente estas 5 linhas em ordem:\n\n1. --- RELATÓRIO DE CAFETERIA ---\n2. Coffees sold: 80\n3. Price per coffee: 5\n4. Total revenue: 400     ← Python deve calcular 80 * 5 por você\n5. Report complete!\n\nPassos a seguir:\n1. Clique dentro da área de código.\n2. Digite cada linha print() uma por uma — comece pelo título.\n3. Na linha 4, escreva  print("Total revenue:", 80 * 5)  para Python fazer a conta.\n4. Clique em Executar e verifique se sua saída corresponde às 5 linhas acima exatamente.\n5. Se alguma linha estiver errada, encontre-a e corrija o erro antes de enviar.'
      },
      starterCode: `# Write your 5 print() lines below:`,
      hints: [
        { en: 'Use * for multiplication: print("Total revenue:", 80 * 5)', pt: 'Use * para multiplicação: print("Total revenue:", 80 * 5)' },
        { en: 'Mix text and numbers with commas: print("Coffees sold:", 80)', pt: 'Misture texto e números com vírgulas: print("Coffees sold:", 80)' }
      ],
      sampleOutput: { en: '--- COFFEE SHOP REPORT ---\nCoffees sold: 80\nPrice per coffee: 5\nTotal revenue: 400\nReport complete!', pt: '--- COFFEE SHOP REPORT ---\nCoffees sold: 80\nPrice per coffee: 5\nTotal revenue: 400\nReport complete!' }
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
    title: { en: 'Phase 1 Exam: App Startup Screen', pt: 'Exame Fase 1: Tela de Inicialização do App' },
    expectedOutput: {
      en: 'MusicBox\nTop Charts\nNew songs today: 47\nNew playlists: 12\nTotal: 59',
      pt: 'MusicBox\nTop Charts\nNew songs today: 47\nNew playlists: 12\nTotal: 59',
    },
    scenario: {
      en: 'Your first task at MusicBox: build the startup screen that the team sees every morning. It must show the app name, the section name, and today\'s music numbers.',
      pt: 'Sua primeira tarefa no MusicBox: criar a tela de inicialização que o time vê toda manhã. Deve mostrar o nome do app, o nome da seção e os números de música de hoje.'
    },
    requirements: {
      en: [
        'Print the app name: "MusicBox"',
        'Print the section: "Top Charts"',
        'Print new songs today: 47',
        'Print new playlists: 12',
        'Print the total (47 + 12, calculated by Python)'
      ],
      pt: [
        'Imprima o nome do app: "MusicBox"',
        'Imprima a seção: "Top Charts"',
        'Imprima novas músicas hoje: 47',
        'Imprima novas playlists: 12',
        'Imprima o total (47 + 12, calculado pelo Python)'
      ]
    },
    starterCode: `# MusicBox startup screen
# Write your print() lines below:`,
    testCases: [
      { id: 'tc1_1', description: { en: 'Shows app name', pt: 'Mostra nome do app' }, inputs: [], checks: [{ type: 'contains', value: 'MusicBox', textMode: 'compact' }], points: 20 },
      { id: 'tc1_2', description: { en: 'Shows section name', pt: 'Mostra nome da seção' }, inputs: [], checks: [{ type: 'contains', value: 'Top Charts', textMode: 'compact' }], points: 20 },
      { id: 'tc1_3', description: { en: 'Shows 47', pt: 'Mostra 47' }, inputs: [], checks: [{ type: 'contains', value: '47' }], points: 20 },
      { id: 'tc1_4', description: { en: 'Shows 12', pt: 'Mostra 12' }, inputs: [], checks: [{ type: 'contains', value: '12' }], points: 20 },
      { id: 'tc1_5', description: { en: 'Shows total 59', pt: 'Mostra total 59' }, inputs: [], checks: [{ type: 'contains', value: '59' }], points: 20 }
    ]
  }
}
