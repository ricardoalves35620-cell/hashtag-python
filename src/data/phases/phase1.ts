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

      { type: 'heading', content: { en: '☕ Real Scenario 3: Café daily summary', pt: '☕ Cenário Real 3: Resumo diário do café' } },
      { type: 'text', content: {
        en: 'You work part-time at a local café.\nAt the end of every day, the owner wants a quick sales summary.\nInstead of writing it by hand, you write a Python script that prints it in seconds.\n\nSame function, totally different industry — that\'s the power of print():',
        pt: 'Você trabalha meio período num café do bairro.\nNo final de cada dia, o dono quer um resumo rápido das vendas.\nEm vez de anotar à mão, você escreve um script Python que imprime em segundos.\n\nMesma função, setor totalmente diferente — esse é o poder do print():'
      }},
      { type: 'code', code: `# End-of-day café summary
print("===== CAFÉ AROMA — END OF DAY =====")
print()
print("Coffees sold:", 87)
print("Price per coffee: $", 4)
print("Coffee revenue: $", 87 * 4)      # Python calculates: 348
print()
print("Pastries sold:", 54)
print("Price per pastry: $", 3)
print("Pastry revenue: $", 54 * 3)      # Python calculates: 162
print()
print("TOTAL REVENUE: $", 87 * 4 + 54 * 3)   # 348 + 162 = 510
print("Great day! See you tomorrow.")` },

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
        en: '✅ print() displays things on screen\n✅ Text needs quotes: print("hi") — numbers don\'t: print(42)\n✅ Math inside print is calculated first: print(2+3) → 5\n✅ Commas print multiple values with spaces: print("Age:", 30)\n✅ # starts a comment — Python ignores it\n✅ Python is case-sensitive: only lowercase print works\n\nNext phase: making Python store and reuse values — no more typing 47 twice. 🚀',
        pt: '✅ print() exibe coisas na tela\n✅ Texto precisa de aspas: print("oi") — números não: print(42)\n✅ Matemática dentro do print é calculada antes: print(2+3) → 5\n✅ Vírgulas imprimem múltiplos valores com espaços: print("Idade:", 30)\n✅ # inicia um comentário — Python o ignora\n✅ Python diferencia maiúsculas: só print minúsculo funciona\n\nPróxima fase: fazendo Python guardar e reutilizar valores — sem precisar digitar 47 duas vezes. 🚀'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex1_guided',
      title: { en: '🟢 Guided: Run Your First Code', pt: '🟢 Guiado: Rode Seu Primeiro Código' },
      description: {
        en: 'The code is already written for you — your job right now is only to run it and observe what happens.\n\nStep by step:\n\n1. Read the 6 lines of code above slowly. Do not type anything yet.\n2. Find the ▶ Run button (usually top-right of the code area) and click it once.\n3. Look at the output panel that appears. You will see 5 lines of text.\n   Count them: there should be exactly 5 lines (one blank line between the fourth and fifth).\n4. Now look at the code and match each line to its output:\n   • print("Welcome to Python!") → the first line you see is text in quotes\n   • print("My name is", "Alice") → two pieces of text, comma adds a space between them\n   • print("My age is", 28) → text mixed with a number — no quotes around 28\n   • print("In 10 years I\'ll be", 28 + 10) → Python calculated 28 + 10 = 38 for you!\n   • print() with nothing inside → that blank gap in the output\n5. Now find the word Alice in the code (line 2).\n   Click right before the A in "Alice" and select the whole word Alice (just the word, not the quotes).\n6. Type your own first name to replace it.\n   ⚠️ Important: keep the quotation marks! They must stay around your name.\n   ✅ Correct:  print("My name is", "Ricardo")\n   ❌ Wrong:    print("My name is", Ricardo)   ← this will cause a NameError\n7. Click ▶ Run again.\n8. Your name now appears in the output. You just personalized your first Python program.',
        pt: 'O código já está escrito para você — seu trabalho agora é só executar e observar o que acontece.\n\nPasso a passo:\n\n1. Leia as 6 linhas de código acima com calma. Não digite nada ainda.\n2. Encontre o botão ▶ Executar (normalmente no canto superior direito da área de código) e clique nele uma vez.\n3. Olhe o painel de saída que aparece. Você verá 5 linhas de texto.\n   Conte: devem ser exatamente 5 linhas (com uma linha em branco entre a quarta e a quinta).\n4. Agora olhe o código e relacione cada linha com sua saída:\n   • print("Welcome to Python!") → a primeira linha que você vê é texto entre aspas\n   • print("My name is", "Alice") → dois pedaços de texto, vírgula adiciona espaço entre eles\n   • print("My age is", 28) → texto misturado com número — sem aspas em volta do 28\n   • print("In 10 years I\'ll be", 28 + 10) → Python calculou 28 + 10 = 38 pra você!\n   • print() sem nada dentro → aquela lacuna em branco na saída\n5. Agora encontre a palavra Alice no código (linha 2).\n   Clique antes do A em "Alice" e selecione toda a palavra Alice (só a palavra, não as aspas).\n6. Digite seu próprio primeiro nome para substituir.\n   ⚠️ Importante: mantenha as aspas! Elas devem continuar em volta do seu nome.\n   ✅ Certo:   print("My name is", "Ricardo")\n   ❌ Errado:  print("My name is", Ricardo)   ← isso vai causar um NameError\n7. Clique em ▶ Executar de novo.\n8. Seu nome agora aparece na saída. Você acabou de personalizar seu primeiro programa Python.'
      },
      starterCode: `print("Welcome to Python!")
print("My name is", "Alice")
print("My age is", 28)
print("In 10 years I'll be", 28 + 10)
print()
print("This is my first program!")`,
      hints: [
        { en: 'Click the ▶ Run button — it is usually in the top-right corner of the code area. The output appears in a panel below or to the right.', pt: 'Clique no botão ▶ Executar — ele fica normalmente no canto superior direito da área de código. A saída aparece em um painel abaixo ou à direita.' },
        { en: 'To replace Alice: click right before the letter A, hold Shift and press the End key (or double-click the word) to select it, then type your name. Keep the quote marks on both sides.', pt: 'Para substituir Alice: clique antes da letra A, segure Shift e pressione End (ou dê duplo clique na palavra) para selecioná-la, depois digite seu nome. Mantenha as aspas dos dois lados.' }
      ]
    },
    {
      id: 'ex1_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: The startup report below is almost complete. Three blanks marked ___ need to be filled in. Your only job is to replace each ___ with the right value.\n\nHere is what to put in each blank:\n\nBlank 1 — print("Company:", ___)\n  → The company\'s name is ClaimPro.\n  → A name is TEXT, so it needs quotation marks.\n  → Replace ___ with "ClaimPro"  (include the quotes)\n  → Result: print("Company:", "ClaimPro")\n\nBlank 2 — print("Open claims:", ___)\n  → There are 47 open claims.\n  → 47 is a NUMBER, so no quotation marks.\n  → Replace ___ with 47\n  → Result: print("Open claims:", 47)\n\nBlank 3 — print("Total:", ___ + 12)\n  → This line adds two numbers: open claims + new claims today.\n  → Open claims = 47, new today = 12, so total = 59.\n  → Replace ___ with 47  (Python will calculate 47 + 12 = 59 for you)\n  → Result: print("Total:", 47 + 12)\n\nAfter filling all three blanks, click ▶ Run and confirm the output matches exactly.',
        pt: 'Antes de começar: O relatório de inicialização abaixo está quase completo. Três lacunas marcadas com ___ precisam ser preenchidas. Seu único trabalho é substituir cada ___ pelo valor correto.\n\nO que colocar em cada lacuna:\n\nLacuna 1 — print("Company:", ___)\n  → O nome da empresa é ClaimPro.\n  → Nome é TEXTO, então precisa de aspas.\n  → Substitua ___ por "ClaimPro"  (inclua as aspas)\n  → Resultado: print("Company:", "ClaimPro")\n\nLacuna 2 — print("Open claims:", ___)\n  → Há 47 sinistros abertos.\n  → 47 é um NÚMERO, então sem aspas.\n  → Substitua ___ por 47\n  → Resultado: print("Open claims:", 47)\n\nLacuna 3 — print("Total:", ___ + 12)\n  → Esta linha soma dois números: sinistros abertos + novos sinistros de hoje.\n  → Abertos = 47, novos hoje = 12, total = 59.\n  → Substitua ___ por 47  (Python calculará 47 + 12 = 59 para você)\n  → Resultado: print("Total:", 47 + 12)\n\nDepois de preencher as três lacunas, clique em ▶ Executar e confirme que a saída corresponde ao esperado.'
      },
      starterCode: `print("=== SYSTEM START ===")
print("Company:", ___)          # fill: "ClaimPro" (with quotes!)
print("Open claims:", ___)      # fill: 47 (no quotes!)
print("New today:", 12)
print("Total:", ___ + 12)       # fill: 47 again`,
      hints: [
        { en: 'Blank 1: company name is text — write it with double quotes: "ClaimPro". The quotes tell Python this is text, not a variable.', pt: 'Lacuna 1: nome da empresa é texto — escreva com aspas duplas: "ClaimPro". As aspas dizem ao Python que é texto, não uma variável.' },
        { en: 'Blanks 2 and 3 both use the number 47 — no quotes around it. Python will calculate 47 + 12 and print 59 automatically.', pt: 'Lacunas 2 e 3 usam o número 47 — sem aspas. Python calculará 47 + 12 e imprimirá 59 automaticamente.' }
      ],
      sampleOutput: { en: '=== SYSTEM START ===\nCompany: ClaimPro\nOpen claims: 47\nNew today: 12\nTotal: 59', pt: '=== SYSTEM START ===\nCompany: ClaimPro\nOpen claims: 47\nNew today: 12\nTotal: 59' }
    },
    {
      id: 'ex1_zero',
      title: { en: '🔴 From Scratch: Café End-of-Day Report', pt: '🔴 Do Zero: Relatório Final do Dia do Café' },
      description: {
        en: 'You work at a small café. At the end of each day you print a sales summary so the owner can check the numbers quickly.\n\nWrite exactly 5 print() lines, one per line, in the order below. Each line is explained individually so you know exactly what to type:\n\nLine 1 — A title for the report.\n  You choose any title text you like. Wrap it in quotes.\n  Example: print("--- CAFÉ DAILY REPORT ---")\n  Tip: the dashes are just decoration — you can use === or anything else.\n\nLine 2 — Number of coffees sold today: 35\n  You need to print a label AND the number.\n  Example: print("Coffees sold:", 35)\n  Note: "Coffees sold:" is text (needs quotes), 35 is a number (no quotes).\n\nLine 3 — Price of each coffee: 4\n  Same pattern as line 2.\n  Example: print("Price per coffee: $", 4)\n\nLine 4 — Total coffee revenue, calculated by Python.\n  Do NOT type 140 yourself — let Python multiply for you.\n  Formula: 35 coffees × $4 each = 35 * 4\n  Example: print("Total revenue: $", 35 * 4)\n  Python will calculate 35 * 4 and print 140 automatically.\n\nLine 5 — A closing message.\n  Any short sentence works.\n  Example: print("Day complete. See you tomorrow!")\n\nWhen all 5 lines are written, click ▶ Run.\nYou should see 5 lines of output appear. If you see an error, read the first line of the error message — it tells you exactly which line has the problem.',
        pt: 'Você trabalha num café pequeno. No final de cada dia você imprime um resumo de vendas para o dono verificar os números rapidamente.\n\nEscreva exatamente 5 linhas de print(), uma por linha, na ordem abaixo. Cada linha é explicada individualmente para você saber exatamente o que digitar:\n\nLinha 1 — Um título para o relatório.\n  Você escolhe qualquer texto de título. Coloque entre aspas.\n  Exemplo: print("--- RELATÓRIO DIÁRIO DO CAFÉ ---")\n  Dica: os traços são só decoração — pode usar === ou qualquer outra coisa.\n\nLinha 2 — Número de cafés vendidos hoje: 35\n  Você precisa imprimir um rótulo E o número.\n  Exemplo: print("Cafés vendidos:", 35)\n  Nota: "Cafés vendidos:" é texto (precisa de aspas), 35 é número (sem aspas).\n\nLinha 3 — Preço de cada café: 4\n  Mesmo padrão da linha 2.\n  Exemplo: print("Preço por café: R$", 4)\n\nLinha 4 — Receita total de cafés, calculada pelo Python.\n  NÃO digite 140 você mesmo — deixe o Python multiplicar por você.\n  Fórmula: 35 cafés × R$4 cada = 35 * 4\n  Exemplo: print("Receita total: R$", 35 * 4)\n  Python calculará 35 * 4 e imprimirá 140 automaticamente.\n\nLinha 5 — Uma mensagem de encerramento.\n  Qualquer frase curta serve.\n  Exemplo: print("Dia concluído. Até amanhã!")\n\nQuando as 5 linhas estiverem escritas, clique em ▶ Executar.\nVocê deve ver 5 linhas de saída aparecerem. Se aparecer um erro, leia a primeira linha da mensagem de erro — ela diz exatamente qual linha tem o problema.'
      },
      starterCode: `# Write your 5 print() lines below:
# Line 1: title
# Line 2: coffees sold (35)
# Line 3: price per coffee (4)
# Line 4: total revenue (35 * 4, let Python calculate)
# Line 5: closing message`,
      hints: [
        { en: 'Every print() needs parentheses: print(...). If you forget them, Python will not understand the command.', pt: 'Todo print() precisa de parênteses: print(...). Se você esquecer, Python não vai entender o comando.' },
        { en: 'For the total on line 4, use the * symbol for multiplication: print("Total revenue: $", 35 * 4) — Python calculates it and prints 140.', pt: 'Para o total na linha 4, use o símbolo * para multiplicação: print("Receita total: R$", 35 * 4) — Python calcula e imprime 140.' }
      ],
      sampleOutput: {
        en: '--- CAFÉ DAILY REPORT ---\nCoffees sold: 35\nPrice per coffee: $ 4\nTotal revenue: $ 140\nDay complete. See you tomorrow!',
        pt: '--- RELATÓRIO DIÁRIO DO CAFÉ ---\nCafés vendidos: 35\nPreço por café: R$ 4\nReceita total: R$ 140\nDia concluído. Até amanhã!'
      }
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
