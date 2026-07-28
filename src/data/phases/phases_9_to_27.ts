import type { Phase } from '../types'

// ============================================================================
// PHASE 9 — Listas Aninhadas
// TEMPLATE B: Conceito Composto
// ============================================================================

// Phases 9–20 previously had duplicate definitions in this file. They were never
// imported — index.ts takes 9–12 from phases_9_to_12_v11, 13–16 from
// phases_13_to_16_v11 and 17–20 from phases_17_to_20_v11 — so edits made here
// silently did nothing. Removed. This file supplies phases 21–27 only.

export const phase21: Phase = {
  id: 21,
  title: { en: 'Random Module', pt: 'Módulo Random' },
  description: { en: 'Generate random values — for simulations, sampling, and testing.', pt: 'Gere valores aleatórios — para simulações, amostragem e testes.' },
  icon: '🎲',
  libraries: [],
  lesson: {
    title: { en: 'Controlled Randomness', pt: 'Aleatoriedade Controlada' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Every shuffle you have ever pressed', pt: '🌍 Todo "aleatório" que você já apertou' } },
      { type: 'text', content: {
        en: 'Shuffle on a music app. The daily word in a puzzle game. Which of two checkout designs a shop shows you. A lottery draw.\n\nNone of those are truly random — a computer cannot be. They use a random NUMBER GENERATOR: a formula that produces numbers so evenly spread that, for any practical purpose, nobody can predict the next one.\n\nThat matters more than it sounds. The same tool that shuffles a playlist also decides which half of a website sees a new button, and picks the sample of parcels a warehouse checks by hand.',
        pt: 'O embaralhar de um app de música. A palavra do dia num jogo. Qual de dois layouts de checkout uma loja te mostra. Um sorteio.\n\nNada disso é realmente aleatório — um computador não consegue ser. Tudo usa um GERADOR DE NÚMEROS aleatórios: uma fórmula que produz números tão bem distribuídos que, na prática, ninguém prevê o próximo.\n\nIsso importa mais do que parece. A mesma ferramenta que embaralha uma playlist também decide qual metade de um site vê um botão novo, e escolhe a amostra de encomendas que um armazém confere à mão.'
      }},
      { type: 'heading', content: { en: '🧩 A die is random, but only from 1 to 6', pt: '🧩 Um dado é aleatório, mas só de 1 a 6' } },
      { type: 'text', content: {
        en: 'Randomness in programming is always FENCED. You never ask for "a random number" — you ask for a random number inside limits you choose.\n\nA die is the everyday version: unpredictable, yet never 7 and never 0.5. Your job is to set the fence, and random fills it.',
        pt: 'Aleatoriedade em programação é sempre CERCADA. Você nunca pede "um número aleatório" — pede um número aleatório dentro de limites que você escolhe.\n\nUm dado é a versão do dia a dia: imprevisível, mas nunca 7 e nunca 0,5. Seu trabalho é montar a cerca, e o random preenche.'
      }},

      { type: 'heading', content: { en: '🐍 Fundamentals 1 — whole numbers in a range', pt: '🐍 Fundamentos 1 — números inteiros num intervalo' } },
      { type: 'text', content: {
        en: 'randint(a, b) gives a whole number from a to b, and BOTH ends can come up. That last part catches people out: randint(1, 6) can return 6.',
        pt: 'randint(a, b) devolve um número inteiro de a até b, e os DOIS extremos podem sair. Essa última parte pega muita gente: randint(1, 6) pode devolver 6.'
      }},
      { type: 'code', code: `import random

print(random.randint(1, 6))      # a die roll: 1, 2, 3, 4, 5 or 6
print(random.randint(0, 1))      # a coin: 0 or 1` },
      { type: 'checkpoint', checkpoint: {
        code: 'import random\n\nvalue = random.randint(1, 6)\nprint(value == 7)',
        options: [
          { en: 'False, always', pt: 'False, sempre' },
          { en: 'True, sometimes', pt: 'True, às vezes' },
          { en: 'An error', pt: 'Um erro' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'randint(1, 6) never leaves its fence, so 7 is impossible and the comparison is always False. Random does not mean unlimited — it means unpredictable inside limits you set.',
          pt: 'randint(1, 6) nunca sai da cerca, então 7 é impossível e a comparação é sempre False. Aleatório não quer dizer ilimitado — quer dizer imprevisível dentro dos limites que você define.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 2 — picking from a list', pt: '🐍 Fundamentos 2 — escolher de uma lista' } },
      { type: 'text', content: {
        en: 'choice() takes one item. sample() takes several WITHOUT repeating. shuffle() reorders the list in place — it changes the original and returns None.',
        pt: 'choice() pega um item. sample() pega vários SEM repetir. shuffle() reordena a lista no lugar — altera a original e devolve None.'
      }},
      { type: 'code', code: `import random

songs = ["Aurora", "Bailar", "Cinza", "Dunas"]

print(random.choice(songs))      # one song
print(random.sample(songs, 2))   # two different songs
random.shuffle(songs)            # reorders songs itself
print(songs)` },
      { type: 'checkpoint', checkpoint: {
        code: 'import random\n\nsongs = ["Aurora", "Bailar", "Cinza"]\nresult = random.shuffle(songs)\nprint(result)',
        options: [
          { en: 'None', pt: 'None' },
          { en: 'The shuffled list', pt: 'A lista embaralhada' },
          { en: 'The original list', pt: 'A lista original' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'shuffle() rearranges the list you gave it and returns nothing, so result is None. Print songs itself, not the return value. random.sample(songs, len(songs)) is the version that hands back a new list.',
          pt: 'shuffle() reorganiza a lista que você passou e não devolve nada, então result é None. Imprima songs, não o retorno. random.sample(songs, len(songs)) é a versão que devolve uma lista nova.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 3 — decimals and probability', pt: '🐍 Fundamentos 3 — decimais e probabilidade' } },
      { type: 'text', content: {
        en: 'random() gives a decimal from 0.0 up to (but never reaching) 1.0. Compare it against a threshold and you have a probability: "happens 30% of the time" is simply random() < 0.3.',
        pt: 'random() devolve um decimal de 0.0 até (mas nunca alcançando) 1.0. Compare com um limite e você tem probabilidade: "acontece 30% das vezes" é simplesmente random() < 0.3.'
      }},
      { type: 'code', code: `import random

print(random.random())           # e.g. 0.6841...

if random.random() < 0.3:
    print("This runs about 30% of the time")
else:
    print("This runs about 70% of the time")` },

      { type: 'heading', content: { en: '🏗️ Real scenario 1 — quality sampling in a warehouse', pt: '🏗️ Cenário real 1 — amostragem de qualidade num armazém' } },
      { type: 'text', content: {
        en: 'Checking every parcel is too slow, so a warehouse checks a random handful each morning. Random selection is what makes the sample fair: nobody can arrange to have their parcels skipped.',
        pt: 'Conferir toda encomenda é lento demais, então um armazém confere um punhado aleatório a cada manhã. A escolha aleatória é o que torna a amostra justa: ninguém consegue combinar para que suas encomendas fiquem de fora.'
      }},
      { type: 'code', code: `import random

parcels = ["P-101", "P-102", "P-103", "P-104", "P-105", "P-106"]

to_check = random.sample(parcels, 3)
print("Check today:", to_check)` },

      { type: 'heading', content: { en: '🏗️ Real scenario 2 — a repeatable test run', pt: '🏗️ Cenário real 2 — um teste que se repete' } },
      { type: 'text', content: {
        en: 'Random data is a problem for testing: a test that passes today and fails tomorrow tells you nothing. seed() fixes the starting point, so the same "random" values come out every run — unpredictable to a user, perfectly repeatable for you.',
        pt: 'Dados aleatórios são um problema para testes: um teste que passa hoje e falha amanhã não diz nada. seed() fixa o ponto de partida, então os mesmos valores "aleatórios" saem a cada execução — imprevisíveis para o usuário, perfeitamente repetíveis para você.'
      }},
      { type: 'code', code: `import random

random.seed(42)
print(random.randint(1, 100))    # same number every single run

random.seed(42)
print(random.randint(1, 100))    # and again, identical` },

      { type: 'heading', content: { en: '⚠️ Common errors', pt: '⚠️ Erros comuns' } },
      { type: 'text', content: {
        en: '• Forgetting import random — every function here lives in that module.\n• Expecting randint(1, 6) to exclude 6. It does not; both ends are included.\n• Printing the result of shuffle(). It returns None.\n• Asking sample() for more items than the list holds — that raises ValueError.\n• Treating a small run as proof. Ten rolls of a die may show no 4 at all; that is randomness, not a bug.',
        pt: '• Esquecer import random — todas essas funções vivem nesse módulo.\n• Esperar que randint(1, 6) exclua o 6. Não exclui; os dois extremos entram.\n• Imprimir o retorno de shuffle(). Ele devolve None.\n• Pedir a sample() mais itens do que a lista tem — isso gera ValueError.\n• Achar que poucas execuções provam algo. Dez jogadas podem não trazer nenhum 4; isso é aleatoriedade, não bug.'
      }},
      { type: 'warning', content: {
        en: '⚠️ Never use random for passwords, tokens or anything security-related. It is predictable to anyone who knows the algorithm. Python has secrets for that job.',
        pt: '⚠️ Nunca use random para senhas, tokens ou qualquer coisa de segurança. É previsível para quem conhece o algoritmo. O Python tem o módulo secrets para isso.'
      }},
      { type: 'tip', content: {
        en: '💡 random.seed(42) makes results reproducible. Same seed, same sequence, every run — ideal while you are testing.',
        pt: '💡 random.seed(42) torna os resultados reproduzíveis. Mesma seed, mesma sequência, sempre — ideal enquanto você testa.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recapitulando' } },
      { type: 'text', content: {
        en: 'randint(a, b) — a whole number, both ends included.\nchoice(list) — one item.\nsample(list, n) — n different items.\nshuffle(list) — reorders in place, returns None.\nrandom() — a decimal from 0.0 to just under 1.0, the basis of probability.\nseed(n) — makes the sequence repeat, so tests stay honest.',
        pt: 'randint(a, b) — um inteiro, com os dois extremos incluídos.\nchoice(lista) — um item.\nsample(lista, n) — n itens diferentes.\nshuffle(lista) — reordena no lugar e devolve None.\nrandom() — um decimal de 0.0 até quase 1.0, a base da probabilidade.\nseed(n) — faz a sequência se repetir, para os testes serem honestos.'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex21_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Goal:\nThis exercise teaches how to use random.choice() to pick one item from a list and random.randint() to generate a random integer in a range.\n\nThe starter code has 2 blanks for you to fill.\n\nBlank 1 — use the name of the function from the random module that picks one item from a list\nBlank 2 — use the name of the function from the random module that generates a random integer between two bounds, inclusive\n\nThe program picks a random client name from a list and generates a random repair value between 500 and 10000.\n\nExample output (values vary because the selection is random):\nAudit: Carlos\nSimulated repair value: $ 4782',
        pt: 'Objetivo:\nEste exercício ensina como usar random.choice() para escolher um item de uma lista e random.randint() para gerar um inteiro aleatório dentro de um intervalo.\n\nO código inicial tem 2 lacunas para você preencher.\n\nLacuna 1 — use o nome da função do módulo random que escolhe um item de uma lista\nLacuna 2 — use o nome da função do módulo random que gera um inteiro aleatório entre dois limites, incluindo ambos\n\nO programa escolhe um nome de cliente aleatório de uma lista e gera um valor de reparo aleatório entre 500 e 10000.\n\nExemplo de saída (os valores variam porque a seleção é aleatória):\nAudit: Carlos\nSimulated repair value: $ 4782'
      },
      starterCode: `import random

clients = ["Alice", "Bob", "Carlos", "Diana", "Eduardo"]

audited = random.___(clients)          # fill: pick one
print("Audit:", audited)

repair_value = random.___(500, 10000)        # fill: random int
print("Simulated repair value: $", repair_value)`,
      hints: [
        { en: 'random.choice() picks one item', pt: 'random.choice() escolhe um item' },
        { en: 'random.randint(min, max) picks a random int', pt: 'random.randint(min, max) gera inteiro aleatório' }
      ],
      sampleOutput: { en: 'Audit: Carlos\nSimulated repair value: $ 4782', pt: 'Audit: Carlos\nSimulated repair value: $ 4782' }
    },
    {
      id: 'ex21_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Goal:\nBuild a repair-quote simulation that runs 5 rounds. Use a fixed seed of 42 so every run produces the same results.\n\nProgram requirements\n\n1. Simulate\n- For each round, generate a random repair value between 500 and 12000\n- Apply a 250 credit to get the quote amount\n- Classify the repair as "HIGH" when the value exceeds 5000, otherwise "normal"\n- Count how many repairs are classified as high risk\n\n2. Display\n- For each round, show the quote number, the repair value, the quote amount after credit and the risk level\n- At the end, show how many repairs were high risk\n\nExample output:\nQuote 1: $4634 → $4384 [normal]\nHigh risk: 2',
        pt: 'Objetivo:\nConstrua uma simulação de orçamentos de reparo que executa 5 rodadas. Use uma seed fixa de 42 para que toda execução produza os mesmos resultados.\n\nRequisitos do programa\n\n1. Simular\n- Para cada rodada, gere um valor de reparo aleatório entre 500 e 12000\n- Aplique um crédito de 250 para obter o valor do orçamento\n- Classifique o reparo como "HIGH" quando o valor ultrapassa 5000, senão "normal"\n- Conte quantos reparos são classificados como alto risco\n\n2. Mostrar\n- Para cada rodada, exiba o número do orçamento, o valor do reparo, o valor do orçamento após o crédito e o nível de risco\n- Ao final, exiba quantos reparos foram de alto risco\n\nExemplo de saída:\nQuote 1: $4634 → $4384 [normal]\nHigh risk: 2'
      },
      starterCode: `import random
random.seed(42)

high_risk = 0
for i in range(5):
    repair_value = random.randint(500, 12000)
    quote = repair_value - 250
    risk = "HIGH" if repair_value > 5000 else "normal"
    if repair_value > 5000: high_risk += 1
    print(f"Quote {i+1}: \${repair_value} → \${quote} [{risk}]")

print("High risk:", high_risk)`,
      hints: [{ en: 'random.randint(500, 12000) generates the repair_value', pt: 'random.randint(500, 12000) gera o dano' }],
      sampleOutput: { en: 'Quote 1: $4634 → $4384 [normal]\nHigh risk: 2', pt: 'Quote 1: $4634 → $4384 [normal]\nHigh risk: 2' }
    }
  ],
  quiz: [
    { id: 'q21_1', question: { en: 'random.randint(1, 6) can return:', pt: 'random.randint(1, 6) pode retornar:' }, options: [{ en: '1, 2, 3, 4, 5, or 6 (inclusive)', pt: '1, 2, 3, 4, 5 ou 6 (incluso)' }, { en: '1 to 5 only', pt: 'Apenas 1 a 5' }, { en: '0 to 6', pt: '0 a 6' }, { en: 'A float', pt: 'Um float' }], correctIndex: 0, explanation: { en: 'randint is inclusive on BOTH ends. randint(1, 6) can return 1, 2, 3, 4, 5, or 6.', pt: 'randint é inclusivo em AMBOS os extremos. Pode retornar 1, 2, 3, 4, 5 ou 6.' } },
    { id: 'q21_2', question: { en: 'random.choice(["a","b","c"]) does:', pt: 'random.choice(["a","b","c"]) faz:' }, options: [{ en: 'Returns one random item', pt: 'Retorna um item aleatório' }, { en: 'Returns all shuffled', pt: 'Retorna todos embaralhados' }, { en: 'Returns random index', pt: 'Retorna índice aleatório' }, { en: 'Returns first item', pt: 'Retorna primeiro item' }], correctIndex: 0, explanation: { en: 'random.choice() picks and returns ONE item randomly from the sequence.', pt: 'random.choice() escolhe e retorna UM item aleatoriamente da sequência.' } },
    { id: 'q21_3', question: { en: 'What does random.seed(42) do?', pt: 'O que random.seed(42) faz?' }, options: [{ en: 'Makes random results reproducible', pt: 'Torna resultados reproduzíveis' }, { en: 'Sets max value to 42', pt: 'Define valor máximo como 42' }, { en: 'Generates 42 numbers', pt: 'Gera 42 números' }, { en: 'Required to use random', pt: 'Obrigatório para usar random' }], correctIndex: 0, explanation: { en: 'Same seed = same sequence every run. Perfect for reproducible tests.', pt: 'Mesma seed = mesma sequência a cada execução. Perfeito para testes reproduzíveis.' } },
    { id: 'q21_4', question: { en: 'random.sample(list, 2) returns:', pt: 'random.sample(lista, 2) retorna:' }, options: [{ en: '2 unique random items', pt: '2 itens únicos aleatórios' }, { en: '2 items that may repeat', pt: '2 itens que podem repetir' }, { en: 'First 2 items', pt: 'Primeiros 2 itens' }, { en: '2 random integers', pt: '2 inteiros aleatórios' }], correctIndex: 0, explanation: { en: 'random.sample() picks k unique elements — no repetition.', pt: 'random.sample() escolhe k elementos únicos — sem repetição.' } }
  ],
  exam: {
    title: { en: 'Risk Simulation', pt: 'Simulação de Risco' },
    scenario: { en: 'Simulate 10 repair quotes and produce a workload report.', pt: 'Simule 10 orçamentos de reparo e produza um relatório de carga.' },
    requirements: { en: ['10 random repair_values $200–$15000', '$250 parts credit', 'Critical>8k, Urgent 3k-8k, Normal<3k', 'Print each + totals'], pt: ['10 danos aleatórios R$200–R$15000', 'R$250 de crédito de peças', 'Crítico>8k, Urgente 3k-8k, Normal<3k', 'Imprima cada + totais'] },
    starterCode: `import random
random.seed(99)

critical = urgent = normal_c = 0
total = 0

for i in range(10):
    repair_value = random.randint(200, 15000)
    quote = repair_value - 250
    total += quote
    if repair_value > 8000:   level = "CRITICAL"; critical += 1
    elif repair_value >= 3000: level = "URGENT";  urgent += 1
    else:                level = "normal";  normal_c += 1
    print(f"#{i+1}: \${repair_value} → \${quote} [{level}]")

print(f"Critical:{critical} Urgent:{urgent} Normal:{normal_c}")
print("Total: $", total)`,
    testCases: [
      { id: 'tc21_1', description: { en: 'Shows CRITICAL', pt: 'Mostra CRITICAL' }, inputs: [], checks: [{ type: 'matches', value: '(critical|cr[ií]tico)' }], points: 25 },
      { id: 'tc21_2', description: { en: 'Count summary shown', pt: 'Resumo de contagem' }, inputs: [], checks: [{ type: 'matches', value: '(critical|cr[ií]tico)' }], points: 25 },
      { id: 'tc21_3', description: { en: 'Total shown', pt: 'Total mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Total' }], points: 25 },
      { id: 'tc21_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 25 }
    ]
  }
}

export const phase22: Phase = {
  id: 22,
  title: { en: 'Math Library', pt: 'Biblioteca Math' },
  description: { en: 'Square roots, rounding, powers — the scientific calculator add-on.', pt: 'Raiz quadrada, arredondamento, potências — o complemento científico.' },
  icon: '📐',
  libraries: [],
  lesson: {
    title: { en: 'Beyond Basic Arithmetic', pt: 'Além da Aritmética Básica' },
    blocks: [
      { type: 'heading', content: { en: '🌍 The buttons your calculator has and Python does not', pt: '🌍 Os botões que sua calculadora tem e o Python não' } },
      { type: 'text', content: {
        en: 'Python arrives with +, -, * and /. That is a pocket calculator.\n\nA square root, a logarithm, π, rounding that always goes up — none of that is built in. It lives in a module called math, and you switch it on with one line.\n\nThis is not academic. Working out how many boxes you need for 47 items in packs of 6 is a ceiling. Working out the distance between two points on a map is a square root. Charging by area is π when the shape is round.',
        pt: 'O Python chega com +, -, * e /. Isso é uma calculadora de bolso.\n\nRaiz quadrada, logaritmo, π, arredondamento que sempre sobe — nada disso vem embutido. Tudo mora num módulo chamado math, que você liga com uma linha.\n\nIsso não é acadêmico. Descobrir quantas caixas você precisa para 47 itens em pacotes de 6 é um teto. Calcular a distância entre dois pontos num mapa é raiz quadrada. Cprojetor por área é π quando a forma é redonda.'
      }},
      { type: 'heading', content: { en: '🧩 A second row of keys', pt: '🧩 Uma segunda fileira de teclas' } },
      { type: 'text', content: {
        en: 'Think of import math as flipping your calculator over to reveal the scientific keys. The four you already know keep working exactly the same; you simply gain more.',
        pt: 'Pense em import math como virar a calculadora e revelar as teclas científicas. As quatro que você já conhece continuam iguais; você apenas ganha mais.'
      }},

      { type: 'heading', content: { en: '🐍 Fundamentals 1 — roots, powers and π', pt: '🐍 Fundamentos 1 — raízes, potências e π' } },
      { type: 'text', content: {
        en: 'Note what comes back: math.sqrt(144) is 12.0, not 12. Almost everything in math returns a decimal, because the answer usually is one.',
        pt: 'Repare no que volta: math.sqrt(144) é 12.0, não 12. Quase tudo em math devolve um decimal, porque a resposta normalmente é decimal.'
      }},
      { type: 'code', code: `import math

print(math.sqrt(144))    # 12.0  — a decimal, not 12
print(math.pow(2, 10))   # 1024.0
print(2 ** 10)           # 1024  — Python's own operator, stays whole
print(math.pi)           # 3.141592653589793` },
      { type: 'checkpoint', checkpoint: {
        code: 'import math\n\nprint(math.sqrt(144) == 12)',
        options: [
          { en: 'True', pt: 'True' },
          { en: 'False', pt: 'False' },
          { en: 'An error', pt: 'Um erro' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'It prints True. sqrt returns 12.0 and Python treats 12.0 and 12 as equal in value, even though one is a float and the other an int. type() would tell them apart; == compares the number, not the kind.',
          pt: 'Imprime True. sqrt devolve 12.0 e o Python considera 12.0 e 12 iguais em valor, mesmo um sendo float e o outro int. type() os distingue; == compara o número, não o tipo.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 2 — rounding on purpose', pt: '🐍 Fundamentos 2 — arredondar de propósito' } },
      { type: 'text', content: {
        en: 'There are three different rounding tools and they are not interchangeable. Choosing the wrong one is how a delivery ends up one box short.\n\n• ceil() always goes UP — use it for containers, vehicles, staff, anything you cannot have a fraction of.\n• floor() always goes DOWN — use it for how many whole items fit in a budget.\n• round() goes to the NEAREST, and settles a .5 tie by moving to the even number.',
        pt: 'Existem três ferramentas de arredondamento e elas não são intercambiáveis. Escolher a errada é como uma entrega acabar com uma caixa a menos.\n\n• ceil() sempre PARA CIMA — use para caixas, veículos, pessoas, qualquer coisa que não exista pela metade.\n• floor() sempre PARA BAIXO — use para quantos itens inteiros cabem num orçamento.\n• round() vai para o MAIS PRÓXIMO, e resolve o empate .5 indo para o número par.'
      }},
      { type: 'code', code: `import math

print(math.ceil(4.1))    # 5  — always up
print(math.floor(4.9))   # 4  — always down
print(round(4.4))        # 4  — nearest
print(round(4.5))        # 4  — tie goes to the even number
print(round(5.5))        # 6  — even again` },
      { type: 'checkpoint', checkpoint: {
        code: 'import math\n\nitems = 47\nper_box = 6\nprint(math.floor(items / per_box), "boxes")',
        options: [
          { en: '7 boxes — and 5 items are left with no box', pt: '7 caixas — e sprojetom 5 itens sem caixa' },
          { en: '8 boxes — everything fits', pt: '8 caixas — tudo cabe' },
          { en: '7.83 boxes', pt: '7,83 caixas' }
        ],
        correctIndex: 0,
        explanation: {
          en: '47 / 6 is 7.83, and floor cuts it down to 7 — leaving 5 items with nowhere to go. Whenever the leftover still needs a container, you want ceil, which gives 8. This choice is the whole point of having three rounding functions.',
          pt: '47 / 6 é 7,83, e floor corta para 7 — deixando 5 itens sem lugar. Sempre que a sprojeto ainda precisa de um recipiente, você quer ceil, que dá 8. Essa escolha é o motivo de existirem três funções de arredondamento.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 3 — growth over time', pt: '🐍 Fundamentos 3 — crescimento ao longo do tempo' } },
      { type: 'text', content: {
        en: 'Anything that grows by a percentage each period follows the same shape: start × (1 + rate) ** periods. Savings, a subscriber count, a population. math.pow does it, and so does Python\'s ** operator.',
        pt: 'Tudo que cresce uma porcentagem por período segue a mesma forma: inicial × (1 + taxa) ** períodos. Poupança, número de assinantes, população. math.pow faz isso, e o operador ** do Python também.'
      }},
      { type: 'code', code: `import math

start = 10000
rate = 0.08          # 8% each year
years = 5

total = start * math.pow(1 + rate, years)
print(f"After {years} years: {total:.2f}")   # 14693.28` },

      { type: 'heading', content: { en: '🏗️ Real scenario 1 — how many vans for the round', pt: '🏗️ Cenário real 1 — quantas vans para a rota' } },
      { type: 'text', content: {
        en: 'A courier has 138 parcels and each van holds 40. Divide and you get 3.45 vans, which does not exist. The remainder still has to travel, so this is ceil every time.',
        pt: 'Um entregador tem 138 encomendas e cada van leva 40. Dividindo dá 3,45 vans, que não existe. A sprojeto também precisa viajar, então aqui é ceil sempre.'
      }},
      { type: 'code', code: `import math

parcels = 138
per_van = 40

vans = math.ceil(parcels / per_van)
print(vans, "vans needed")     # 4, not 3` },

      { type: 'heading', content: { en: '🏗️ Real scenario 2 — the area of a round table top', pt: '🏗️ Cenário real 2 — a área de um tampo de mesa redondo' } },
      { type: 'text', content: {
        en: 'A workshop charges by surface area. For a circular top the area is π × r², and the price follows from it. Rounding up at the end means the shop is never short.',
        pt: 'Uma oficina cprojeto por área de superfície. Para um tampo circular a área é π × r², e o preço sai dela. Arredondar para cima no fim garante que a oficina nunca fique no prejuízo.'
      }},
      { type: 'code', code: `import math

radius = 0.6                 # metres
price_per_m2 = 150

area = math.pi * radius ** 2
price = math.ceil(area * price_per_m2)

print(f"Area: {area:.2f} m2")
print(f"Price: {price}")` },

      { type: 'heading', content: { en: '⚠️ Common errors', pt: '⚠️ Erros comuns' } },
      { type: 'text', content: {
        en: '• Forgetting import math. Every name here needs the module.\n• Writing sqrt(9) instead of math.sqrt(9) — the module name is not optional.\n• Reaching for ceil when floor is meant, or the reverse. Ask: does the leftover still need a place?\n• Expecting round(4.5) to give 5. Python moves a .5 tie to the even number, so it gives 4.\n• math.sqrt() of a negative number raises ValueError — there is no real answer to give you.',
        pt: '• Esquecer import math. Todo nome daqui precisa do módulo.\n• Escrever sqrt(9) em vez de math.sqrt(9) — o nome do módulo não é opcional.\n• Usar ceil quando queria floor, ou o contrário. Pergunte: a sprojeto ainda precisa de lugar?\n• Esperar que round(4.5) dê 5. O Python leva o empate .5 para o número par, então dá 4.\n• math.sqrt() de um número negativo gera ValueError — não existe resposta real para dar.'
      }},
      { type: 'tip', content: {
        en: '💡 Quick rule: containers and vehicles round UP, whole items you can afford round DOWN, measurements round to NEAREST.',
        pt: '💡 Regra rápida: recipientes e veículos arredondam PARA CIMA, itens inteiros que cabem no orçamento PARA BAIXO, medidas para o MAIS PRÓXIMO.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recapitulando' } },
      { type: 'text', content: {
        en: 'import math unlocks the scientific keys.\nsqrt, pow and pi return decimals.\nceil goes up, floor goes down, round goes to the nearest with ties to the even number.\nGrowth over time is start * (1 + rate) ** periods.\nPicking the right rounding is a decision about the real world, not about maths.',
        pt: 'import math libera as teclas científicas.\nsqrt, pow e pi devolvem decimais.\nceil sobe, floor desce, round vai ao mais próximo com empate para o par.\nCrescimento ao longo do tempo é inicial * (1 + taxa) ** períodos.\nEscolher o arredondamento certo é uma decisão sobre o mundo real, não sobre matemática.'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex22_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Goal:\nThis exercise teaches how to use math.pi (the mathematical constant pi) and math.sqrt() (square root function) from the math library.\n\nThe starter code has 2 blanks for you to fill.\n\nBlank 1 — use the name of the pi constant from the math module to compute the area of a circle with radius 5\nBlank 2 — use the name of the function from the math module that computes the square root of the area\n\nThe program calculates the area of a circle and then finds the side length of a square with the same area. Both results are shown with two decimal places.\n\nExample output:\nArea: 78.54\nSide: 8.86',
        pt: 'Objetivo:\nEste exercício ensina como usar math.pi (a constante matemática pi) e math.sqrt() (função de raiz quadrada) da biblioteca math.\n\nO código inicial tem 2 lacunas para você preencher.\n\nLacuna 1 — use o nome da constante pi do módulo math para calcular a área de um círculo com raio 5\nLacuna 2 — use o nome da função do módulo math que calcula a raiz quadrada da área\n\nO programa calcula a área de um círculo e depois encontra o lado de um quadrado com a mesma área. Ambos os resultados são exibidos com duas casas decimais.\n\nExemplo de saída:\nArea: 78.54\nSide: 8.86'
      },
      starterCode: `import math

radius = 5
area = math.___ * radius ** 2    # fill: pi constant
side = math.___(area)            # fill: square root
print(f"Area: {area:.2f}")
print(f"Side: {side:.2f}")`,
      hints: [
        { en: 'math.pi is the pi constant', pt: 'math.pi é a constante pi' },
        { en: 'math.sqrt() calculates square root', pt: 'math.sqrt() calcula raiz quadrada' }
      ],
      sampleOutput: { en: 'Area: 78.54\nSide: 8.86', pt: 'Area: 78.54\nSide: 8.86' }
    },
    {
      id: 'ex22_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Goal:\nBuild a compound interest calculator that shows the final amount after a number of years and also rounds it up to the next whole dollar.\n\nProgram requirements\n\n1. Calculate\n- Start with a principal of 10000\n- Apply an annual rate of 8% for 5 years using the compound interest formula\n- Round the result up to the next whole dollar\n\n2. Display\n- The exact amount with two decimal places\n- The rounded-up value\n\nExample output:\nAfter 5 years: $14693.28\nRounded up: $14694',
        pt: 'Objetivo:\nConstrua uma calculadora de juros compostos que mostra o valor final após alguns anos e também arredonda para o próximo dólar inteiro.\n\nRequisitos do programa\n\n1. Calcular\n- Comece com um principal de 10000\n- Aplique uma taxa anual de 8% durante 5 anos usando a fórmula de juros compostos\n- Arredonde o resultado para cima para o próximo dólar inteiro\n\n2. Mostrar\n- O valor exato com duas casas decimais\n- O valor arredondado para cima\n\nExemplo de saída:\nAfter 5 years: $14693.28\nRounded up: $14694'
      },
      starterCode: `import math

principal = 10000
rate = 0.08
years = 5

amount = principal * math.pow(1 + rate, years)
rounded = math.ceil(amount)

print(f"After {years} years: \${amount:.2f}")
print(f"Rounded up: \${rounded}")`,
      hints: [{ en: 'math.pow(base, exp) raises base to power', pt: 'math.pow(base, exp) eleva base à potência' }],
      sampleOutput: { en: 'After 5 years: $14693.28\nRounded up: $14694', pt: 'After 5 years: $14693.28\nRounded up: $14694' }
    }
  ],
  quiz: [
    { id: 'q22_1', question: { en: 'math.sqrt(64) returns:', pt: 'math.sqrt(64) retorna:' }, options: [{ en: '8.0', pt: '8.0' }, { en: '8', pt: '8' }, { en: '32.0', pt: '32.0' }, { en: '4096.0', pt: '4096.0' }], correctIndex: 0, explanation: { en: 'math.sqrt() always returns float. √64 = 8.0.', pt: 'math.sqrt() sempre retorna float. √64 = 8.0.' } },
    { id: 'q22_2', question: { en: 'math.ceil(3.1) returns:', pt: 'math.ceil(3.1) retorna:' }, options: [{ en: '4', pt: '4' }, { en: '3', pt: '3' }, { en: '3.1', pt: '3.1' }, { en: '3.0', pt: '3.0' }], correctIndex: 0, explanation: { en: 'ceil always rounds UP. Even 3.001 → 4.', pt: 'ceil sempre arredonda PARA CIMA. Até 3.001 → 4.' } },
    { id: 'q22_3', question: { en: 'math.floor(7.9) returns:', pt: 'math.floor(7.9) retorna:' }, options: [{ en: '7', pt: '7' }, { en: '8', pt: '8' }, { en: '7.9', pt: '7.9' }, { en: '7.0', pt: '7.0' }], correctIndex: 0, explanation: { en: 'floor always rounds DOWN. 7.9 → 7.', pt: 'floor sempre arredonda PARA BAIXO. 7.9 → 7.' } },
    { id: 'q22_4', question: { en: 'math.pow(3, 4) returns:', pt: 'math.pow(3, 4) retorna:' }, options: [{ en: '81.0', pt: '81.0' }, { en: '12.0', pt: '12.0' }, { en: '7.0', pt: '7.0' }, { en: '64.0', pt: '64.0' }], correctIndex: 0, explanation: { en: '3^4 = 3×3×3×3 = 81.0. Always float.', pt: '3^4 = 3×3×3×3 = 81.0. Sempre float.' } }
  ],
  exam: {
    title: { en: 'Flooring Quote Report', pt: 'Relatório de Orçamento de Piso' },
    scenario: { en: 'Calculate floor areas and costs for 3 rooms.', pt: 'Calcule áreas de piso e custos para 3 ambientes.' },
    requirements: { en: ['Rectangular: length×width', 'Circular: π×r²', 'Cost = area×$150, rounded UP', 'Print area + cost per room'], pt: ['Retangular: comprimento×largura', 'Circular: π×r²', 'Custo = área×R$150, arredondado CIMA', 'Imprima área + custo por ambiente'] },
    starterCode: `import math

rooms = [
    {"name": "Studio",  "type": "rect",   "a": 40, "b": 25},
    {"name": "Lounge",  "type": "circle", "a": 8,  "b": 0},
    {"name": "Kitchen", "type": "rect",   "a": 30, "b": 15}
]

for s in rooms:
    area = s["a"] * s["b"] if s["type"] == "rect" else math.pi * s["a"]**2
    cost = math.ceil(area * 150)
    print(f"{s['name']}: {area:.1f} m² → \${cost}")`,
    testCases: [
      { id: 'tc22_1', description: { en: 'Studio area cost 150000', pt: 'Custo da área do Studio 150000' }, inputs: [], checks: [{ type: 'contains', value: '150000' }], points: 30 },
      { id: 'tc22_2', description: { en: 'Lounge shown', pt: 'Lounge mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Lounge' }], points: 30 },
      { id: 'tc22_3', description: { en: 'Kitchen shown', pt: 'Kitchen mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Kitchen' }], points: 20 },
      { id: 'tc22_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

export const phase23: Phase = {
  id: 23,
  title: { en: 'Error Handling', pt: 'Tratamento de Erros' },
  description: { en: 'Build programs that survive bad input — the mark of professional code.', pt: 'Construa programas que sobrevivem a entradas ruins — a marca do código profissional.' },
  icon: '🛡️',
  libraries: [],
  lesson: {
    title: { en: 'Don\'t Crash. Handle It.', pt: 'Não Quebre. Trate.' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Red text is not failure', pt: '🌍 Texto vermelho não é fracasso' } },
      { type: 'text', content: {
        en: 'Every program you use hits errors constantly. A form gets a phone number where a date belongs. A file is missing. The wifi drops halfway through a save.\n\nThe difference between an app you trust and one you do not is never that errors stopped happening. It is that someone decided in advance what should happen when they do.\n\nUp to now, an error has ended your program. From here it becomes something you catch and answer.',
        pt: 'Todo programa que você usa encontra erros o tempo todo. Um formulário recebe um telefone onde devia ir uma data. Um arquivo some. O wifi cai no meio de um salvamento.\n\nA diferença entre um app confiável e um que não é nunca foi os erros pararem de acontecer. É alguém ter decidido antes o que deve acontecer quando eles acontecem.\n\nAté agora, um erro encerrava seu programa. A partir daqui ele vira algo que você captura e responde.'
      }},
      { type: 'heading', content: { en: '🧩 A safety net, not a blindfold', pt: '🧩 Uma rede de segurança, não uma venda' } },
      { type: 'text', content: {
        en: 'try/except is a net under a trapeze. The acrobat still falls sometimes; the net decides what the fall costs.\n\nWhat it must never become is a blindfold — catching an error and saying nothing leaves you with a program that fails silently, which is worse than one that stops loudly.',
        pt: 'try/except é uma rede embaixo do trapézio. O acrobata ainda cai às vezes; a rede decide quanto custa a queda.\n\nO que ela nunca pode virar é uma venda nos olhos — capturar um erro e não dizer nada deixa um programa que falha em silêncio, o que é pior do que um que para fazendo barulho.'
      }},

      { type: 'heading', content: { en: '🐍 Fundamentals 1 — the shape of try / except', pt: '🐍 Fundamentos 1 — a forma do try / except' } },
      { type: 'text', content: {
        en: 'Put the risky line inside try. Put your answer to the failure inside except. If nothing goes wrong, the except block is skipped entirely.',
        pt: 'Coloque a linha arriscada dentro do try. Coloque sua resposta à falha dentro do except. Se nada der errado, o bloco except é ignorado por completo.'
      }},
      { type: 'code', code: `# Without a net: the program stops here
age = int(input("Age: "))          # ValueError if they type "abc"

# With a net
try:
    age = int(input("Age: "))
    print("Next year you will be", age + 1)
except ValueError:
    print("Please type a whole number, like 30.")` },
      { type: 'checkpoint', checkpoint: {
        code: 'try:\n    total = 10 / 2\n    print("A")\nexcept ZeroDivisionError:\n    print("B")\nprint("C")',
        options: [
          { en: 'A then C', pt: 'A depois C' },
          { en: 'A then B then C', pt: 'A depois B depois C' },
          { en: 'B then C', pt: 'B depois C' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'Nothing went wrong, so except never runs — it is not a step in the sequence, it is a response that only happens on failure. The code after the block runs either way.',
          pt: 'Nada deu errado, então o except não roda — ele não é um passo da sequência, é uma resposta que só acontece em caso de falha. O código depois do bloco roda de qualquer jeito.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 2 — catch the error you expect', pt: '🐍 Fundamentos 2 — capture o erro que você espera' } },
      { type: 'text', content: {
        en: 'Python has a different error type for each kind of problem, and naming the one you expect is what keeps the net honest. Catching everything hides the bugs you did not predict.\n\n• ValueError — the right kind of thing, an impossible value: int("abc")\n• ZeroDivisionError — dividing by zero\n• KeyError — a dictionary key that is not there\n• IndexError — a list position past the end\n• FileNotFoundError — the file is not where you said',
        pt: 'O Python tem um tipo de erro diferente para cada tipo de problema, e nomear o que você espera é o que mantém a rede honesta. Capturar tudo esconde os bugs que você não previu.\n\n• ValueError — o tipo certo de coisa, com valor impossível: int("abc")\n• ZeroDivisionError — divisão por zero\n• KeyError — uma chave de dicionário que não existe\n• IndexError — uma posição de lista além do fim\n• FileNotFoundError — o arquivo não está onde você disse'
      }},
      { type: 'code', code: `scores = {"ana": 9}

try:
    print(scores["bruno"])
except KeyError:
    print("No score recorded for that name yet.")

try:
    print(10 / 0)
except ZeroDivisionError:
    print("Cannot divide by zero.")` },
      { type: 'checkpoint', checkpoint: {
        code: 'try:\n    value = int("abc")\nexcept ZeroDivisionError:\n    print("caught it")',
        options: [
          { en: 'The program still crashes with ValueError', pt: 'O programa quebra mesmo assim com ValueError' },
          { en: 'It prints "caught it"', pt: 'Imprime "caught it"' },
          { en: 'It prints nothing and continues', pt: 'Não imprime nada e continua' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'The net was hung in the wrong place. int("abc") raises ValueError, and an except that names ZeroDivisionError does not catch it — so the program stops exactly as if there were no try at all. The error type has to match the error you actually get.',
          pt: 'A rede foi pendurada no lugar errado. int("abc") gera ValueError, e um except que nomeia ZeroDivisionError não o captura — então o programa para exatamente como se não houvesse try nenhum. O tipo do erro precisa combinar com o erro que realmente acontece.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 3 — else and finally', pt: '🐍 Fundamentos 3 — else e finally' } },
      { type: 'text', content: {
        en: 'else runs only when the try succeeded. finally runs either way — it is where you close what you opened, whatever happened.',
        pt: 'else roda só quando o try deu certo. finally roda de qualquer forma — é onde você fecha o que abriu, tenha acontecido o que tiver acontecido.'
      }},
      { type: 'code', code: `try:
    amount = int(input("Amount: "))
    if amount < 0:
        raise ValueError("Amount cannot be negative")

except ValueError as error:
    print("Invalid:", error)

else:
    print("Accepted:", amount)      # only when nothing failed

finally:
    print("Done checking.")         # always` },

      { type: 'heading', content: { en: '🏗️ Real scenario 1 — a form that keeps asking', pt: '🏗️ Cenário real 1 — um formulário que continua perguntando' } },
      { type: 'text', content: {
        en: 'A crash on bad input is unacceptable in anything a person uses. Combine a loop with try/except and a wrong answer simply asks again.',
        pt: 'Quebrar por causa de uma entrada errada é inaceitável em qualquer coisa que uma pessoa use. Combine um laço com try/except e uma resposta errada apenas pergunta de novo.'
      }},
      { type: 'code', code: `while True:
    try:
        quantity = int(input("How many? "))
        break                       # only reached when the line above worked
    except ValueError:
        print("Whole numbers only — try again.")

print("Ordering", quantity)` },

      { type: 'heading', content: { en: '🏗️ Real scenario 2 — refusing bad data on purpose', pt: '🏗️ Cenário real 2 — recusar dados ruins de propósito' } },
      { type: 'text', content: {
        en: 'raise is you creating an error deliberately. A negative quantity is not a Python error — it is perfectly valid Python and completely wrong for your program. Saying so early stops it travelling further in.',
        pt: 'raise é você criando um erro de propósito. Uma quantidade negativa não é um erro do Python — é Python perfeitamente válido e completamente errado para o seu programa. Dizer isso cedo impede que ele viaje mais para dentro.'
      }},
      { type: 'code', code: `def confirm(quantity):
    if quantity <= 0:
        raise ValueError("Quantity must be greater than zero")
    return quantity * 2

try:
    print(confirm(-5))
except ValueError as error:
    print("Rejected:", error)` },

      { type: 'heading', content: { en: '⚠️ Common errors', pt: '⚠️ Erros comuns' } },
      { type: 'text', content: {
        en: '• Wrapping the whole program in one try. When it fails you have no idea which line did it.\n• A bare except: that swallows everything, including typos in your own code.\n• An except block that prints nothing — the program limps on with wrong data and no clue why.\n• Catching the wrong type, so the net misses entirely.\n• Using try/except where an if would do. Checking a list is not empty is a question, not an emergency.',
        pt: '• Envolver o programa inteiro num único try. Quando falha, você não sabe qual linha causou.\n• Um except: pelado que engole tudo, inclusive erros de digitação no seu próprio código.\n• Um except que não imprime nada — o programa segue mancando com dados errados e sem pista do motivo.\n• Capturar o tipo errado, e a rede não pegar nada.\n• Usar try/except onde um if bastaria. Verificar se uma lista não está vazia é uma pergunta, não uma emergência.'
      }},
      { type: 'warning', content: {
        en: '⚠️ except: on its own catches everything — including your own mistakes and the Ctrl+C you press to stop the program. Always name the error you expect.',
        pt: '⚠️ except: sozinho captura tudo — inclusive seus próprios erros e o Ctrl+C que você aperta para parar o programa. Sempre nomeie o erro que você espera.'
      }},
      { type: 'tip', content: {
        en: '💡 Read the last line of a traceback first. It names the error type and the message, which is exactly what you need for the except.',
        pt: '💡 Leia a última linha de um traceback primeiro. Ela nomeia o tipo do erro e a mensagem, que é exatamente o que você precisa para o except.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recapitulando' } },
      { type: 'text', content: {
        en: 'try holds the risky line; except holds your answer.\nName the error type you expect — ValueError, KeyError, ZeroDivisionError, FileNotFoundError.\nelse runs only on success; finally runs either way.\nraise lets you reject data that Python would happily accept.\nA net that hides the fall is worse than no net.',
        pt: 'try guarda a linha arriscada; except guarda sua resposta.\nNomeie o tipo de erro que você espera — ValueError, KeyError, ZeroDivisionError, FileNotFoundError.\nelse roda só no sucesso; finally roda de qualquer jeito.\nraise permite recusar dados que o Python aceitaria numa boa.\nUma rede que esconde a queda é pior do que rede nenhuma.'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex23_recog',
      title: { en: '🟡 Recognize the Problem', pt: '🟡 Reconheça o Problema' },
      description: {
        en: 'Goal:\nObserve three separate try/except blocks, each designed to catch a different type of error.\n\nProgram requirements\n\n1. What to observe\n- The first block catches the error raised when trying to convert non-numeric text to an integer\n- The second block catches the error raised when dividing by zero\n- The third block catches the error raised when accessing a dictionary key that does not exist\n\nRun the code as-is and notice which exception name is used in each except clause.\n\nExample output:\nValueError caught\nZeroDivisionError caught\nKeyError caught',
        pt: 'Objetivo:\nObserve três blocos try/except separados, cada um projetado para capturar um tipo diferente de erro.\n\nRequisitos do programa\n\n1. O que observar\n- O primeiro bloco captura o erro levantado ao tentar converter texto não numérico em inteiro\n- O segundo bloco captura o erro levantado ao dividir por zero\n- O terceiro bloco captura o erro levantado ao acessar uma chave de dicionário que não existe\n\nExecute o código como está e observe qual nome de exceção é usado em cada cláusula except.\n\nExemplo de saída:\nValueError caught\nZeroDivisionError caught\nKeyError caught'
      },
      starterCode: `# Wrap each in try/except with the correct exception:

try:
    result = int("not_a_number")
except ValueError:
    print("ValueError caught")

try:
    value = 100 / 0
except ZeroDivisionError:
    print("ZeroDivisionError caught")

try:
    d = {"name": "Alice"}
    print(d["amount"])
except KeyError:
    print("KeyError caught")`,
      hints: [{ en: 'Each block uses a specific exception name', pt: 'Cada bloco usa um nome específico de exceção' }],
      sampleOutput: { en: 'ValueError caught\nZeroDivisionError caught\nKeyError caught', pt: 'ValueError caught\nZeroDivisionError caught\nKeyError caught' }
    },
    {
      id: 'ex23_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Goal:\nBuild a program that repeatedly asks for an order amount until the user enters a valid positive integer. The program must handle all types of invalid input gracefully.\n\nProgram requirements\n\n1. Gather input\n- Ask for the order amount in dollars\n\n2. Validate\n- Convert the input to an integer\n- Reject the value if it is not a positive number — this should not crash the program\n- On any invalid input, show an error message and ask again\n\n3. Display\n- Once a valid amount is received, subtract a 250 credit and show the confirmed total\n\nExample output:\nInvalid: ... — try again\nConfirmed total: $ 4750',
        pt: 'Objetivo:\nConstrua um programa que pergunta repetidamente o valor do pedido até o usuário digitar um inteiro positivo válido. O programa deve tratar todos os tipos de entrada inválida com elegância.\n\nRequisitos do programa\n\n1. Receber os dados\n- Pergunte o valor do pedido em dólares\n\n2. Validar\n- Converta a entrada para inteiro\n- Rejeite o valor se não for um número positivo — isso não deve travar o programa\n- Em caso de entrada inválida, exiba uma mensagem de erro e pergunte novamente\n\n3. Mostrar\n- Quando um valor válido for recebido, subtraia um crédito de 250 e exiba o total confirmado\n\nExemplo de saída:\nInvalid: ... — try again\nConfirmed total: $ 4750'
      },
      starterCode: `amount = None

while amount is None:
    try:
        raw = input("Order amount: $")
        amount = int(raw)
        if amount <= 0:
            raise ValueError("Must be positive")
    except ValueError as e:
        print("Invalid:", e, "— try again")
        amount = None

print("Confirmed total: $", amount - 250)`,
      hints: [{ en: 'Set amount = None before loop; reset to None on error', pt: 'Defina amount = None antes do loop; redefina como None no erro' }],
      sampleOutput: { en: 'Invalid: ... — try again\nConfirmed total: $ 4750', pt: 'Inválido: ... — tente novamente\nTotal confirmado: $ 4750' }
    }
  ],
  quiz: [
    { id: 'q23_1', question: { en: 'What does try/except prevent?', pt: 'O que try/except previne?' }, options: [{ en: 'Program crash on runtime errors', pt: 'Crash do programa em erros de runtime' }, { en: 'All errors from happening', pt: 'Todos os erros de acontecer' }, { en: 'Syntax errors', pt: 'Erros de sintaxe' }, { en: 'Logic errors', pt: 'Erros de lógica' }], correctIndex: 0, explanation: { en: 'try/except catches runtime errors and lets you handle gracefully. Syntax errors still stop execution.', pt: 'try/except captura erros de runtime. Erros de sintaxe ainda impedem execução.' } },
    { id: 'q23_2', question: { en: 'When does "else" run in try/except/else?', pt: 'Quando "else" roda em try/except/else?' }, options: [{ en: 'When NO exception occurred', pt: 'Quando NENHUMA exceção ocorreu' }, { en: 'When exception occurred', pt: 'Quando exceção ocorreu' }, { en: 'Always', pt: 'Sempre' }, { en: 'After finally', pt: 'Depois do finally' }], correctIndex: 0, explanation: { en: 'else runs ONLY when try completed with no exception. If except runs, else is skipped.', pt: 'else roda SOMENTE quando try completou sem exceção. Se except roda, else é pulado.' } },
    { id: 'q23_3', question: { en: 'When does "finally" run?', pt: 'Quando "finally" roda?' }, options: [{ en: 'Always — error or not', pt: 'Sempre — com ou sem erro' }, { en: 'Only on success', pt: 'Apenas no sucesso' }, { en: 'Only on error', pt: 'Apenas no erro' }, { en: 'Never', pt: 'Nunca' }], correctIndex: 0, explanation: { en: 'finally ALWAYS runs. Use for cleanup: close files, release connections, etc.', pt: 'finally SEMPRE roda. Use para limpeza: fechar arquivos, liberar conexões, etc.' } },
    { id: 'q23_4', question: { en: 'int("hello") raises:', pt: 'int("hello") lança:' }, options: [{ en: 'ValueError', pt: 'ValueError' }, { en: 'TypeError', pt: 'TypeError' }, { en: 'NameError', pt: 'NameError' }, { en: 'SyntaxError', pt: 'SyntaxError' }], correctIndex: 0, explanation: { en: 'ValueError = right type, wrong value. "hello" is a string but can\'t be read as an integer.', pt: 'ValueError = tipo certo, valor errado. "hello" é string mas não pode ser lido como inteiro.' } }
  ],
  exam: {
    title: { en: 'Bulletproof Processor', pt: 'Processador À Prova de Falhas' },
    scenario: { en: 'Process mixed order data — some entries invalid. Handle all errors.', pt: 'Processe dados mistos — algumas entradas inválidas. Trate todos os erros.' },
    requirements: { en: ['5 data entries', 'Try/except per entry', 'Handle non-numeric amount', 'Handle negative amount', 'Print success or error per entry'], pt: ['5 entradas de dados', 'Try/except por entrada', 'Tratar dano não-numérico', 'Tratar dano negativo', 'Imprimir sucesso ou erro por entrada'] },
    starterCode: `entries = [("Alice","5230"),("Bob","abc"),("Carlos","8000"),("Diana","-500"),("Eduardo","1200")]

for name, raw in entries:
    try:
        amount = int(raw)
        if amount <= 0: raise ValueError("Must be positive")
        print(f"✅ {name}: \${amount - 250}")
    except ValueError as e:
        print(f"❌ {name}: {e}")`,
    testCases: [
      { id: 'tc23_1', description: { en: 'Alice 4980', pt: 'Alice 4980' }, inputs: [], checks: [{ type: 'contains', value: '4980' }], points: 20 },
      { id: 'tc23_2', description: { en: 'Bob error', pt: 'Erro Bob' }, inputs: [], checks: [{ type: 'contains', value: 'Bob' }], points: 20 },
      { id: 'tc23_3', description: { en: 'Diana error', pt: 'Erro Diana' }, inputs: [], checks: [{ type: 'contains', value: 'Diana' }], points: 20 },
      { id: 'tc23_4', description: { en: 'Eduardo 950', pt: 'Eduardo 950' }, inputs: [], checks: [{ type: 'contains', value: '950' }], points: 20 },
      { id: 'tc23_5', description: { en: 'No crash', pt: 'Sem crash' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}



export const phase24: Phase = {
  id: 24,
  title: { en: 'Project: Calculator', pt: 'Projeto: Calculadora' },
  description: { en: 'Build a complete calculator combining everything learned.', pt: 'Construa uma calculadora completa combinando tudo que foi aprendido.' },
  icon: '🏗️',
  libraries: [],
  lesson: {
    title: { en: 'Your First Complete Program', pt: 'Seu Primeiro Programa Completo' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Real software is small pieces, arranged', pt: '🌍 Software real é peças pequenas, arranjadas' } },
      { type: 'text', content: {
        en: 'Everything you have learned so far arrived one piece at a time: a variable, a condition, a loop, a function, a try block. Each was small enough to hold in your head.\n\nA finished program is not a bigger idea. It is those same pieces in an order: take input, check it, do the work, keep a record, show the result.\n\nThis phase is the first time you build the whole shape instead of one piece of it. Nothing new is being introduced — that is deliberate. The difficulty here is arrangement, not knowledge.',
        pt: 'Tudo que você aprendeu até aqui chegou uma peça por vez: uma variável, uma condição, um laço, uma função, um bloco try. Cada uma pequena o bastante para caber na cabeça.\n\nUm programa pronto não é uma ideia maior. São essas mesmas peças numa ordem: receber a entrada, conferir, fazer o trabalho, guardar um registro, mostrar o resultado.\n\nEsta fase é a primeira vez que você monta a forma inteira em vez de uma peça dela. Nada novo é introduzido — isso é de propósito. A dificuldade aqui é arranjo, não conhecimento.'
      }},
      { type: 'heading', content: { en: '🧩 A kitchen, not a single recipe', pt: '🧩 Uma cozinha, não uma receita só' } },
      { type: 'text', content: {
        en: 'One recipe is a function: given these ingredients, produce this dish. A kitchen is a program: orders arrive in an unpredictable order, some are wrong, someone has to keep track of what was served.\n\nThe recipes do not get harder. The kitchen is what you are learning to run.',
        pt: 'Uma receita é uma função: dados estes ingredientes, produza este prato. Uma cozinha é um programa: pedidos chegam em ordem imprevisível, alguns vêm errados, e alguém precisa registrar o que foi servido.\n\nAs receitas não ficam mais difíceis. A cozinha é o que você está aprendendo a operar.'
      }},

      { type: 'heading', content: { en: '🆚 One block versus separated parts', pt: '🆚 Um bloco só versus partes separadas' } },
      { type: 'text', content: {
        en: 'Both versions below add two numbers. The first cannot be tested, reused or fixed without reading all of it. The second can be checked one piece at a time — and that is the entire difference between code that survives and code that gets rewritten.',
        pt: 'As duas versões abaixo somam dois números. A primeira não dá para testar, reaproveitar nem corrigir sem ler tudo. A segunda dá para conferir uma peça por vez — e essa é toda a diferença entre um código que sobrevive e um que é reescrito.'
      }},
      { type: 'code', code: `# One block: works, but everything is tangled together
x = int(input("x: "))
y = int(input("y: "))
op = input("op: ")
if op == "+": print(x + y)
elif op == "-": print(x - y)` },
      { type: 'code', code: `# Separated: the maths knows nothing about input or printing
def calculate(x, op, y):
    """Return the result of one arithmetic operation."""
    if op == "+":
        return x + y
    if op == "-":
        return x - y
    if op == "*":
        return x * y
    if op == "/":
        if y == 0:
            raise ValueError("Cannot divide by zero")
        return x / y
    raise ValueError(f"Unknown operator: {op}")

print(calculate(4, "+", 6))     # 10 — testable without typing anything` },
      { type: 'checkpoint', checkpoint: {
        code: 'def calculate(x, op, y):\n    if op == "+":\n        return x + y\n    print("unknown operator")\n\nprint(calculate(4, "*", 6))',
        options: [
          { en: 'unknown operator, then None', pt: 'unknown operator, depois None' },
          { en: 'unknown operator only', pt: 'apenas unknown operator' },
          { en: '24', pt: '24' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'The function prints its complaint and then falls off the end, so it hands back None — and the outer print shows it. Printing a problem is not the same as reporting one. raise ValueError(...) stops the function and lets the caller decide what to do.',
          pt: 'A função imprime a reclamação e chega ao fim, então devolve None — e o print de fora mostra isso. Imprimir um problema não é o mesmo que reportá-lo. raise ValueError(...) interrompe a função e deixa quem chamou decidir o que fazer.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Part 1 — the work, with no input and no printing', pt: '🐍 Parte 1 — o trabalho, sem entrada e sem impressão' } },
      { type: 'text', content: {
        en: 'Write the calculating function first and keep input() out of it. A function that only takes values and returns a value can be tested in one line, a hundred times, without you typing anything.',
        pt: 'Escreva primeiro a função que calcula e mantenha input() fora dela. Uma função que só recebe valores e devolve um valor pode ser testada em uma linha, cem vezes, sem você digitar nada.'
      }},
      { type: 'code', code: `print(calculate(10, "/", 4))     # 2.5
print(calculate(10, "*", 0))     # 0
try:
    calculate(10, "/", 0)
except ValueError as error:
    print("refused:", error)     # refused: Cannot divide by zero` },

      { type: 'heading', content: { en: '🐍 Part 2 — the conversation with the person', pt: '🐍 Parte 2 — a conversa com a pessoa' } },
      { type: 'text', content: {
        en: 'Only now add the part that talks to a human. It reads, it validates, it calls the function, it shows the answer. Notice that a bad number no longer ends the program — it asks again.',
        pt: 'Só agora adicione a parte que fala com uma pessoa. Ela lê, valida, chama a função e mostra a resposta. Repare que um número inválido não encerra mais o programa — ele pergunta de novo.'
      }},
      { type: 'code', code: `def ask_number(label):
    while True:
        try:
            return float(input(label))
        except ValueError:
            print("Numbers only — try again.")

x = ask_number("First number: ")
op = input("Operator (+ - * /): ")
y = ask_number("Second number: ")

try:
    print("=", calculate(x, op, y))
except ValueError as error:
    print("Cannot do that:", error)` },
      { type: 'checkpoint', checkpoint: {
        code: 'def ask_number(label):\n    while True:\n        try:\n            return float(input(label))\n        except ValueError:\n            print("Numbers only")\n\nvalue = ask_number("n: ")   # the person types: abc, then 7',
        options: [
          { en: 'It prints "Numbers only" once, then value is 7.0', pt: 'Imprime "Numbers only" uma vez, e value fica 7.0' },
          { en: 'It stops at the first wrong answer', pt: 'Para na primeira resposta errada' },
          { en: 'value ends up as the text "7"', pt: 'value acaba sendo o texto "7"' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'return only happens when float() succeeded, so a bad answer falls to except, prints, and the while sends it round again. The loop is what turns a crash into a second chance — and float() means the result is a number, not text.',
          pt: 'O return só acontece quando o float() deu certo, então uma resposta ruim cai no except, imprime, e o while manda de volta. O laço é o que transforma uma quebra em uma segunda chance — e o float() garante que o resultado é número, não texto.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Part 3 — remembering what happened', pt: '🐍 Parte 3 — lembrar o que aconteceu' } },
      { type: 'text', content: {
        en: 'A list of what the program did is worth more than it looks. It is how you check your own work, and it is the first step towards saving anything to a file.',
        pt: 'Uma lista do que o programa fez vale mais do que parece. É como você confere seu próprio trabalho, e é o primeiro passo para salvar qualquer coisa num arquivo.'
      }},
      { type: 'code', code: `history = []

result = calculate(4, "+", 6)
history.append(f"4 + 6 = {result}")

result = calculate(9, "/", 3)
history.append(f"9 / 3 = {result}")

print("History:")
for line in history:
    print(" ", line)` },

      { type: 'heading', content: { en: '🏗️ Putting it together', pt: '🏗️ Juntando tudo' } },
      { type: 'text', content: {
        en: 'Five parts, each one already familiar:\n1. calculate() — the work, pure and testable\n2. ask_number() — input that survives a typo\n3. a loop — keep going until the person stops\n4. try/except — refuse impossible operations without crashing\n5. history — a record of what was done\n\nBuild them in that order and test each before adding the next. If you write all five and only then run it, you will be debugging five things at once.',
        pt: 'Cinco partes, cada uma já conhecida:\n1. calculate() — o trabalho, puro e testável\n2. ask_number() — entrada que sobrevive a um erro de digitação\n3. um laço — continuar até a pessoa parar\n4. try/except — recusar operações impossíveis sem quebrar\n5. history — um registro do que foi feito\n\nConstrua nessa ordem e teste cada uma antes de somar a próxima. Se você escrever as cinco e só então rodar, vai depurar cinco coisas ao mesmo tempo.'
      }},

      { type: 'heading', content: { en: '⚠️ Common errors', pt: '⚠️ Erros comuns' } },
      { type: 'text', content: {
        en: '• Putting input() inside the calculating function. It can then never be tested without a person typing.\n• A bare except: around the whole loop, which swallows your own mistakes along with the user\'s.\n• Printing an error instead of raising one, so the caller receives None and carries on regardless.\n• Forgetting that float() accepts "7" but not "seven".\n• Writing all five parts before running any of them.',
        pt: '• Colocar input() dentro da função que calcula. Aí ela nunca pode ser testada sem alguém digitando.\n• Um except: pelado em volta do laço inteiro, que engole seus próprios erros junto com os do usuário.\n• Imprimir um erro em vez de levantá-lo, e quem chamou recebe None e segue mesmo assim.\n• Esquecer que float() aceita "7" mas não "sete".\n• Escrever as cinco partes antes de rodar qualquer uma.'
      }},
      { type: 'tip', content: {
        en: '💡 Run after every part you add. A program that worked one minute ago tells you exactly where the new problem is.',
        pt: '💡 Rode depois de cada parte que adicionar. Um programa que funcionava há um minuto diz exatamente onde está o problema novo.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recapitulando' } },
      { type: 'text', content: {
        en: 'Separate the work from the conversation: calculating functions take values and return values.\nValidate at the edge, where input arrives, not deep inside.\nraise to report a refusal; return to report an answer.\nKeep a record of what happened.\nBuild in parts and run after each one.',
        pt: 'Separe o trabalho da conversa: funções que calculam recebem valores e devolvem valores.\nValide na borda, onde a entrada chega, não lá no fundo.\nUse raise para reportar uma recusa; return para reportar uma resposta.\nGuarde um registro do que aconteceu.\nConstrua em partes e rode depois de cada uma.'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex24_recog',
      title: { en: '🟡 Identify the Gap', pt: '🟡 Identifique a Lacuna' },
      description: {
        en: 'Goal:\nThe calculator function handles addition, subtraction, multiplication and division but is missing two important validations. Read the code first, then add the missing checks.\n\nProgram requirements\n\n1. What to add\n- Inside the division branch, check for division by zero and raise ValueError with the message "Cannot divide by zero"\n- After all the operator branches, add a default branch that raises ValueError for any unknown operator\n\nThe test code already has try/except blocks that will catch the ValueError and display the error message.\n\nExample output:\nError: Cannot divide by zero\nError: Unknown: %',
        pt: 'Objetivo:\nA função calculadora trata adição, subtração, multiplicação e divisão, mas falta duas validações importantes. Leia o código primeiro e depois adicione as verificações que faltam.\n\nRequisitos do programa\n\n1. O que adicionar\n- Dentro do ramo de divisão, verifique se há divisão por zero e gere ValueError com a mensagem "Cannot divide by zero"\n- Após todos os ramos de operador, adicione um ramo padrão que gere ValueError para qualquer operador desconhecido\n\nO código de teste já tem blocos try/except que capturarão o ValueError e exibirão a mensagem de erro.\n\nExemplo de saída:\nError: Cannot divide by zero\nError: Unknown: %'
      },
      starterCode: `def calculate(x, op, y):
    if op == "+": return x + y
    elif op == "-": return x - y
    elif op == "*": return x * y
    elif op == "/":
        # ADD: check for division by zero
        return x / y
    # ADD: handle unknown operators

try:
    print(calculate(10, "/", 0))
except ValueError as e:
    print("Error:", e)

try:
    print(calculate(10, "%", 5))
except ValueError as e:
    print("Error:", e)`,
      hints: [
        { en: 'Add: if y == 0: raise ValueError("Cannot divide by zero")', pt: 'Adicione: if y == 0: raise ValueError("Não pode dividir por zero")' },
        { en: 'Add else clause: raise ValueError(f"Unknown: {op}")', pt: 'Adicione else: raise ValueError(f"Desconhecido: {op}")' }
      ],
      sampleOutput: { en: 'Error: Cannot divide by zero\nError: Unknown: %', pt: 'Error: Cannot divide by zero\nError: Unknown: %' }
    },
    {
      id: 'ex24_zero',
      title: { en: '🔴 Build the Full Calculator', pt: '🔴 Construa a Calculadora Completa' },
      description: {
        en: 'Goal:\nBuild a calculator that performs arithmetic on pairs of numbers and keeps a history of successful operations.\n\nProgram requirements\n\n1. Calculate\n- Perform the requested operation on the two operands\n- Support addition, subtraction, multiplication and division\n- Reject division by zero by raising ValueError\n- Reject unknown operators by raising ValueError\n\n2. Process test cases\n- Run each of the three test cases inside a try/except block\n- On success, record the operation in the history list and display the result\n- On error, display the error message\n\n3. Display history\n- After all test cases, show the label "History:" followed by every successful operation\n\nExample output:\n= 15.0\n= 5.0\nError: Cannot divide by zero\n\nHistory:\n  10 + 5 = 15.0',
        pt: 'Objetivo:\nConstrua uma calculadora que realiza operações aritméticas em pares de números e mantém um histórico das operações bem-sucedidas.\n\nRequisitos do programa\n\n1. Calcular\n- Execute a operação solicitada nos dois operandos\n- Suporte adição, subtração, multiplicação e divisão\n- Rejeite divisão por zero gerando ValueError\n- Rejeite operadores desconhecidos gerando ValueError\n\n2. Processar casos de teste\n- Execute cada um dos três casos de teste dentro de um bloco try/except\n- Em caso de sucesso, registre a operação na lista de histórico e exiba o resultado\n- Em caso de erro, exiba a mensagem de erro\n\n3. Mostrar histórico\n- Após todos os casos de teste, exiba o rótulo "History:" seguido de cada operação bem-sucedida\n\nExemplo de saída:\n= 15.0\n= 5.0\nError: Cannot divide by zero\n\nHistory:\n  10 + 5 = 15.0'
      },
      starterCode: `def calculate(x, op, y):
    """Perform arithmetic. Raises ValueError on invalid input."""
    if op == "+": return x + y
    elif op == "-": return x - y
    elif op == "*": return x * y
    elif op == "/":
        if y == 0: raise ValueError("Cannot divide by zero")
        return x / y
    else:
        raise ValueError(f"Unknown operator: {op}")

history = []
tests = [(10, "+", 5), (20, "/", 4), (8, "/", 0)]

for x, op, y in tests:
    try:
        result = calculate(x, op, y)
        entry = f"{x} {op} {y} = {result}"
        history.append(entry)
        print("=", result)
    except ValueError as e:
        print("Error:", e)

print("\\nHistory:")
for h in history: print(" ", h)`,
      hints: [{ en: 'Use try/except inside the loop to catch errors per calculation', pt: 'Use try/except dentro do loop para capturar erros por cálculo' }],
      sampleOutput: { en: '= 15.0\n= 5.0\nError: Cannot divide by zero\n\nHistory:\n  10 + 5 = 15.0', pt: '= 15.0\n= 5.0\nError: Cannot divide by zero\n\nHistórico:\n  10 + 5 = 15.0' }
    }
  ],
  quiz: [
    { id: 'q24_1', question: { en: 'Why put calculation logic in a function?', pt: 'Por que colocar lógica de cálculo numa função?' }, options: [{ en: 'Reusable, testable, isolated', pt: 'Reutilizável, testável, isolado' }, { en: 'Makes code longer', pt: 'Deixa código mais longo' }, { en: 'Required by Python', pt: 'Exigido pelo Python' }, { en: 'No reason', pt: 'Sem razão' }], correctIndex: 0, explanation: { en: 'Functions encapsulate logic. Test calculate() independently, reuse it, modify without breaking the rest.', pt: 'Funções encapsulam lógica. Teste calculate() independentemente, reutilize, modifique sem quebrar o resto.' } },
    { id: 'q24_2', question: { en: 'A history list lets you:', pt: 'Uma lista de histórico permite:' }, options: [{ en: 'Review all past calculations', pt: 'Revisar todos os cálculos anteriores' }, { en: 'Undo operations', pt: 'Desfazer operações' }, { en: 'Speed up calculations', pt: 'Acelerar cálculos' }, { en: 'Auto-save to file', pt: 'Auto-salvar em arquivo' }], correctIndex: 0, explanation: { en: 'A list accumulates entries. At the end, loop through to print the session history.', pt: 'Uma lista acumula entradas. No final, percorra para imprimir o histórico da sessão.' } },
    { id: 'q24_3', question: { en: 'Why raise ValueError instead of just print?', pt: 'Por que raise ValueError em vez de só print?' }, options: [{ en: 'Lets the caller catch and handle it', pt: 'Deixa o chamador capturar e tratar' }, { en: 'Print is broken', pt: 'Print está quebrado' }, { en: 'ValueError is faster', pt: 'ValueError é mais rápido' }, { en: 'No difference', pt: 'Sem diferença' }], correctIndex: 0, explanation: { en: 'raise lets caller use try/except. print just shows text — function continues as if nothing happened.', pt: 'raise permite ao chamador usar try/except. print só exibe texto — a função continua.' } },
    { id: 'q24_4', question: { en: 'while True loop runs until:', pt: 'Loop while True roda até:' }, options: [{ en: 'A break statement or unhandled exception', pt: 'Um break ou exceção não tratada' }, { en: '100 iterations', pt: '100 iterações' }, { en: 'Memory runs out', pt: 'Memória acabar' }, { en: 'User closes terminal', pt: 'Usuário fecha o terminal' }], correctIndex: 0, explanation: { en: 'while True runs forever. Use break to exit cleanly, or let an unhandled exception stop it.', pt: 'while True roda para sempre. Use break para sair, ou deixe exceção não tratada pará-lo.' } }
  ],
  exam: {
    title: { en: 'Equipment Hire Calculator', pt: 'Calculadora de Aluguel de Equipamento' },
    scenario: { en: 'Build an error-safe hire-cost calculator with history.', pt: 'Construa uma calculadora de custo de aluguel resistente a erros, com histórico.' },
    requirements: { en: ['calc_hire(base, rate, years)', 'cost = base * rate * years', 'Validate all > 0', '3 bookings with loop', 'Error handling', 'Print history'], pt: ['calc_hire(base, rate, years)', 'cost = base * rate * years', 'Valide todos > 0', '3 clientes com loop', 'Tratamento de erros', 'Imprima histórico'] },
    starterCode: `def calc_hire(base, rate, years):
    """Calculate the hire cost. All values must be positive."""
    if base <= 0 or rate <= 0 or years <= 0:
        raise ValueError("All values must be positive")
    return base * rate * years

bookings = [("Alice",10000,0.08,3),("Bob",-5000,0.05,2),("Carlos",15000,0.12,5)]
history = []

for name, base, rate, years in bookings:
    try:
        cost = calc_hire(base, rate, years)
        entry = f"{name}: \${cost:.2f}"
        history.append(entry)
        print("✅", entry)
    except ValueError as e:
        print(f"❌ {name}: {e}")

print("\\nHistory:")
for h in history: print(" ", h)`,
    testCases: [
      { id: 'tc24_1', description: { en: 'Alice 2400.00', pt: 'Alice 2400.00' }, inputs: [], checks: [{ type: 'contains', value: '2400' }], points: 25 },
      { id: 'tc24_2', description: { en: 'Bob error caught', pt: 'Erro de Bob capturado' }, inputs: [], checks: [{ type: 'contains', value: 'Bob' }], points: 25 },
      { id: 'tc24_3', description: { en: 'Carlos 9000.00', pt: 'Carlos 9000.00' }, inputs: [], checks: [{ type: 'contains', value: '9000' }], points: 25 },
      { id: 'tc24_4', description: { en: 'No crash', pt: 'Sem crash' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 25 }
    ]
  }
}

export const phase25: Phase = {
  id: 25,
  title: { en: 'Project: CRUD System', pt: 'Projeto: Sistema CRUD' },
  description: { en: 'Create, Read, Update, Delete — the backbone of every database app.', pt: 'Create, Read, Update, Delete — a espinha dorsal de todo app com banco de dados.' },
  icon: '🗄️',
  libraries: [],
  lesson: {
    title: { en: 'CRUD: How All Apps Manage Data', pt: 'CRUD: Como Todo App Gerencia Dados' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Four verbs, and almost nothing else', pt: '🌍 Quatro verbos, e quase nada mais' } },
      { type: 'text', content: {
        en: 'Send a message, read the chat, edit what you sent, delete it. Add a song to a playlist, look at the playlist, rename it, remove a track.\n\nStrip away the design and nearly every app you use does the same four things to stored data: create, read, update, delete. The four together are called CRUD, and they are the shape of most software written in the world.\n\nYou already know the pieces — a list, a dictionary, a loop, a function. What changes here is that they stop being exercises and start being a system.',
        pt: 'Enviar uma mensagem, ler a conversa, editar o que você mandou, apagar. Adicionar uma música a uma playlist, ver a playlist, renomear, remover uma faixa.\n\nTire o design e quase todo app que você usa faz as mesmas quatro coisas com dados guardados: criar, ler, atualizar, apagar. As quatro juntas se chamam CRUD, e são a forma da maior parte do software escrito no mundo.\n\nVocê já conhece as peças — lista, dicionário, laço, função. O que muda aqui é que elas deixam de ser exercícios e viram um sistema.'
      }},
      { type: 'heading', content: { en: '🧩 A filing cabinet with four actions', pt: '🧩 Um arquivo com quatro ações' } },
      { type: 'text', content: {
        en: 'A drawer of numbered folders. You can add a folder, look one up, change what is inside, or take one out. There is no fifth thing you can do to a filing cabinet, and there is no fifth thing most programs do to data.\n\nThe id on each folder is what makes the other three actions possible. Without it you can only ever say "the third one", and that changes the moment somebody removes a folder.',
        pt: 'Uma gaveta de pastas numeradas. Você pode adicionar uma pasta, procurar uma, mudar o que tem dentro, ou tirar uma fora. Não existe uma quinta coisa a fazer com um arquivo, e não existe uma quinta coisa que a maioria dos programas faz com dados.\n\nO id em cada pasta é o que torna as outras três ações possíveis. Sem ele você só consegue dizer "a terceira", e isso muda no instante em que alguém tira uma pasta.'
      }},

      { type: 'heading', content: { en: '🆚 Scattered versus named', pt: '🆚 Espalhado versus nomeado' } },
      { type: 'text', content: {
        en: 'Both versions do the same four operations. The first spreads them through the program, so changing how a record is stored means hunting every line that touches it. The second gives each operation a name and one home.',
        pt: 'As duas versões fazem as mesmas quatro operações. A primeira as espalha pelo programa, então mudar como um registro é guardado significa caçar cada linha que mexe nele. A segunda dá a cada operação um nome e um lugar só.'
      }},
      { type: 'code', code: `# Scattered: works today, painful tomorrow
books = []
books.append({"id": 1, "title": "Dune"})   # create
print(books[0])                            # read
books[0]["title"] = "Dune (1965)"          # update
books.pop(0)                               # delete` },
      { type: 'code', code: `# Named: each operation has one place to live
def create(db, title):
    db.append({"id": len(db) + 1, "title": title})

def read_all(db):
    for row in db:
        print(f"#{row['id']} {row['title']}")

def update(db, row_id, title):
    for row in db:
        if row["id"] == row_id:
            row["title"] = title
            return True
    return False            # nothing matched — say so

def delete(db, row_id):
    db[:] = [row for row in db if row["id"] != row_id]

db = []
create(db, "Dune")
create(db, "Solaris")
update(db, 1, "Dune (1965)")
delete(db, 2)
read_all(db)                # #1 Dune (1965)` },
      { type: 'checkpoint', checkpoint: {
        code: 'def delete(db, row_id):\n    db = [row for row in db if row["id"] != row_id]\n\nbooks = [{"id": 1}, {"id": 2}]\ndelete(books, 1)\nprint(len(books))',
        options: [
          { en: '2 — nothing was deleted', pt: '2 — nada foi apagado' },
          { en: '1 — the row was deleted', pt: '1 — a linha foi apagada' },
          { en: '0 — everything was deleted', pt: '0 — tudo foi apagado' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'db = [...] builds a NEW list and points the local name at it. The caller\'s list is untouched, so the delete silently does nothing. db[:] = [...] replaces the contents of the existing list, which is what the caller can see.',
          pt: 'db = [...] cria uma lista NOVA e aponta o nome local para ela. A lista de quem chamou não muda, então o delete não faz nada em silêncio. db[:] = [...] substitui o conteúdo da lista existente, que é o que quem chamou enxerga.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Create — and where the id comes from', pt: '🐍 Create — e de onde vem o id' } },
      { type: 'text', content: {
        en: 'Using len(db) + 1 as the next id is fine while nothing is ever deleted, and wrong the moment something is. Delete row 2 of three and the next create hands out id 3 again — now two rows share it.\n\nA counter that only ever goes up avoids that.',
        pt: 'Usar len(db) + 1 como próximo id funciona enquanto nada é apagado, e quebra no instante em que algo é. Apague a linha 2 de três e o próximo create devolve o id 3 de novo — agora duas linhas têm o mesmo.\n\nUm contador que só cresce evita isso.'
      }},
      { type: 'code', code: `next_id = 1

def create(db, title):
    global next_id
    db.append({"id": next_id, "title": title})
    next_id += 1
    return next_id - 1` },

      { type: 'heading', content: { en: '🐍 Read — one, or many', pt: '🐍 Read — um, ou vários' } },
      { type: 'text', content: {
        en: 'Reading everything is a loop. Reading one is a search, and a search can fail — so decide now what "not found" looks like. Returning None is the usual answer, and the caller has to check it.',
        pt: 'Ler tudo é um laço. Ler um é uma busca, e uma busca pode falhar — então decida agora como é o "não encontrado". Devolver None é a resposta usual, e quem chamou precisa verificar.'
      }},
      { type: 'code', code: `def find(db, row_id):
    for row in db:
        if row["id"] == row_id:
            return row
    return None              # explicit: nothing matched

row = find(db, 99)
if row is None:
    print("No record with that id.")
else:
    print(row["title"])` },
      { type: 'checkpoint', checkpoint: {
        code: 'def find(db, row_id):\n    for row in db:\n        if row["id"] == row_id:\n            return row\n    return None\n\nbooks = [{"id": 1, "title": "Dune"}]\nprint(find(books, 99)["title"])',
        options: [
          { en: 'TypeError', pt: 'TypeError' },
          { en: 'None', pt: 'None' },
          { en: 'An empty line', pt: 'Uma linha vazia' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'find returns None, and None has no ["title"] — so Python raises TypeError. Returning None is correct; using the result without checking it is the mistake. Check first: if row is None.',
          pt: 'find devolve None, e None não tem ["title"] — então o Python gera TypeError. Devolver None está certo; usar o resultado sem verificar é o erro. Verifique antes: if row is None.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Update and Delete — report what happened', pt: '🐍 Update e Delete — relate o que aconteceu' } },
      { type: 'text', content: {
        en: 'Both can be asked to act on something that is not there. Silence is the worst answer: the caller believes it worked. Return True or False, or a count, so the program above can react.',
        pt: 'Os dois podem ser chamados para agir sobre algo que não existe. O silêncio é a pior resposta: quem chamou acredita que funcionou. Devolva True ou False, ou uma contagem, para o programa acima poder reagir.'
      }},
      { type: 'code', code: `def update(db, row_id, title):
    row = find(db, row_id)
    if row is None:
        return False
    row["title"] = title
    return True

def delete(db, row_id):
    before = len(db)
    db[:] = [row for row in db if row["id"] != row_id]
    return before - len(db)      # how many were removed

if not update(db, 99, "New title"):
    print("Nothing to update.")
print(delete(db, 99), "rows removed")` },

      { type: 'heading', content: { en: '🏗️ Putting it together', pt: '🏗️ Juntando tudo' } },
      { type: 'text', content: {
        en: 'A working CRUD module is five short functions and one list:\n1. create — add a record and give it a stable id\n2. find — one record, or None\n3. read_all — every record\n4. update — change one, report whether it existed\n5. delete — remove one, report how many went\n\nWrite find first. Update and delete both use it, and a search you trust makes the other two three lines each.',
        pt: 'Um módulo CRUD funcionando são cinco funções curtas e uma lista:\n1. create — adiciona um registro e dá a ele um id estável\n2. find — um registro, ou None\n3. read_all — todos os registros\n4. update — altera um e relata se ele existia\n5. delete — remove um e relata quantos saíram\n\nEscreva find primeiro. Update e delete usam ele, e uma busca confiável deixa os outros dois com três linhas cada.'
      }},

      { type: 'heading', content: { en: '⚠️ Common errors', pt: '⚠️ Erros comuns' } },
      { type: 'text', content: {
        en: '• Rebinding inside a function: db = [...] changes nothing for the caller. Use db[:] = [...].\n• len(db) + 1 as an id, after anything has been deleted.\n• Using a find() result without checking for None.\n• update and delete that stay silent when nothing matched.\n• Removing items from a list while looping over it — build a new list instead.',
        pt: '• Reatribuir dentro da função: db = [...] não muda nada para quem chamou. Use db[:] = [...].\n• len(db) + 1 como id, depois que algo já foi apagado.\n• Usar o resultado de find() sem verificar None.\n• update e delete que ficam em silêncio quando nada foi encontrado.\n• Remover itens de uma lista enquanto percorre ela — construa uma lista nova.'
      }},
      { type: 'tip', content: {
        en: '💡 Test in this order: create then read_all, create then find, update then find, delete then find. Each step checks the one before it.',
        pt: '💡 Teste nesta ordem: create e read_all, create e find, update e find, delete e find. Cada passo confere o anterior.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recapitulando' } },
      { type: 'text', content: {
        en: 'CRUD is create, read, update, delete — the shape of most software.\nEvery record needs a stable id, from a counter that only grows.\nfind returns the record or None, and callers must check.\nupdate and delete report what happened instead of failing quietly.\ndb[:] = [...] changes the caller\'s list; db = [...] does not.',
        pt: 'CRUD é criar, ler, atualizar, apagar — a forma da maior parte do software.\nTodo registro precisa de um id estável, vindo de um contador que só cresce.\nfind devolve o registro ou None, e quem chama precisa verificar.\nupdate e delete relatam o que aconteceu em vez de falhar em silêncio.\ndb[:] = [...] muda a lista de quem chamou; db = [...] não.'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex25_recog',
      title: { en: '🟡 Complete the CRUD', pt: '🟡 Complete o CRUD' },
      description: {
        en: 'Goal:\nThe starter code implements a CRUD system for client records with four functions. create() and read_all() are already complete. update() has one blank for the dictionary key whose value is being changed. delete() has one blank for the dictionary key used to compare and filter out a record.\n\nFill in each blank, then run the code. Alice’s record should show 7000 pages, and Bob’s record should be removed.\n\nExample:\n1 Alice $7000',
        pt: 'Objetivo:\nO código inicial implementa um sistema CRUD para registros de clientes com quatro funções. create() e read_all() já estão completas. update() tem uma lacuna para a chave do dicionário cujo valor está sendo alterado. delete() tem uma lacuna para a chave do dicionário usada para comparar e filtrar um registro.\n\nPreencha cada lacuna e execute o código. O registro de Alice deve mostrar 7000 páginas, e o registro de Bob deve ser removido.\n\nExemplo:\n1 Alice $7000'
      },
      starterCode: `def create(db, client, pages):
    db.append({"id": len(db)+1, "client": client, "pages": pages})

def read_all(db):
    for c in db: print(c["id"], c["client"], "$"+str(c["pages"]))

def update(db, cid, new_pages):
    for c in db:
        if c["id"] == cid:
            c["___"] = new_pages   # fill: which key to update?
            return True
    return False

def delete(db, cid):
    db[:] = [c for c in db if c["___"] != cid]  # fill: compare which key?

db = []
create(db, "Alice", 5230)
create(db, "Bob",   1200)
update(db, 1, 7000)
delete(db, 2)
read_all(db)`,
      hints: [
        { en: 'Update the "pages" key', pt: 'Atualize a chave "pages"' },
        { en: 'Compare by "id" key in delete', pt: 'Compare pela chave "id" no delete' }
      ],
      sampleOutput: { en: '1 Alice $7000', pt: '1 Alice $7000' }
    },
    {
      id: 'ex25_zero',
      title: { en: '🔴 Full CRUD Demo', pt: '🔴 Demo CRUD Completo' },
      description: {
        en: 'Goal:\nRun the provided CRUD demo as-is. The program creates four client records, displays them all, updates one record’s pages value, deletes another record, and displays the remaining records.\n\nProgram requirements\n\n1. Create records for Alice (5230 pages), Bob (1200), Carlos (8000) and Diana (900)\n2. Display all four records\n3. Update Bob’s pages to 9000\n4. Remove Diana’s record\n5. Display the three remaining records\n\nExample:\nInitial:\n#1 Alice $5230\n#2 Bob $1200\n#3 Carlos $8000\n#4 Diana $900\nFinal:\n#1 Alice $5230\n#2 Bob $9000\n#3 Carlos $8000',
        pt: 'Objetivo:\nExecute o demo CRUD fornecido como está. O programa cria quatro registros de clientes, exibe todos, atualiza o valor de páginas de um registro, exclui outro e exibe os registros restantes.\n\nRequisitos do programa\n\n1. Crie registros para Alice (5230 páginas), Bob (1200), Carlos (8000) e Diana (900)\n2. Exiba todos os quatro registros\n3. Atualize as páginas de Bob para 9000\n4. Remova o registro de Diana\n5. Exiba os três registros restantes\n\nExemplo:\nInitial:\n#1 Alice $5230\n#2 Bob $1200\n#3 Carlos $8000\n#4 Diana $900\nFinal:\n#1 Alice $5230\n#2 Bob $9000\n#3 Carlos $8000'
      },
      starterCode: `def create(db, client, pages):
    db.append({"id": len(db)+1, "client": client, "pages": pages})

def read_all(db):
    for c in db: print(f"#{c['id']} {c['client']} \${c['pages']}")

def update(db, cid, new_pages):
    for c in db:
        if c["id"] == cid: c["pages"] = new_pages; return True
    return False

def delete(db, cid):
    db[:] = [c for c in db if c["id"] != cid]

db = []
create(db, "Alice",  5230)
create(db, "Bob",    1200)
create(db, "Carlos", 8000)
create(db, "Diana",   900)

print("Initial:"); read_all(db)
update(db, 2, 9000)
delete(db, 4)
print("Final:"); read_all(db)`,
      hints: [{ en: 'Run in sequence: create × 4, read_all, update, delete, read_all', pt: 'Execute em sequência: create × 4, read_all, update, delete, read_all' }],
      sampleOutput: { en: 'Initial:\n#1 Alice $5230\n...\nFinal:\n#1 Alice $5230\n#2 Bob $9000\n#3 Carlos $8000', pt: 'Inicial:\n#1 Alice $5230\n...\nFinal:\n#1 Alice $5230\n#2 Bob $9000\n#3 Carlos $8000' }
    }
  ],
  quiz: [
    { id: 'q25_1', question: { en: 'What does CRUD stand for?', pt: 'O que significa CRUD?' }, options: [{ en: 'Create, Read, Update, Delete', pt: 'Create, Read, Update, Delete' }, { en: 'Copy, Run, Upload, Download', pt: 'Copy, Run, Upload, Download' }, { en: 'Connect, Retrieve, Use, Disconnect', pt: 'Connect, Retrieve, Use, Disconnect' }, { en: 'Calculate, Render, Update, Deploy', pt: 'Calculate, Render, Update, Deploy' }], correctIndex: 0, explanation: { en: 'CRUD = Create, Read, Update, Delete. Every data-driven app needs all four.', pt: 'CRUD = Create, Read, Update, Delete. Todo app com dados precisa dos quatro.' } },
    { id: 'q25_2', question: { en: 'Why use functions for CRUD?', pt: 'Por que usar funções para CRUD?' }, options: [{ en: 'Clear intent, reusable, easy to test', pt: 'Intenção clara, reutilizável, fácil de testar' }, { en: 'Functions are faster', pt: 'Funções são mais rápidas' }, { en: 'Python requires it', pt: 'Python exige' }, { en: 'No reason', pt: 'Sem razão' }], correctIndex: 0, explanation: { en: 'create(db,"Alice") is clearer than db.append({"id":...}). Functions give operations meaningful names.', pt: 'create(db,"Alice") é mais claro que db.append({"id":...}). Funções dão nomes significativos.' } },
    { id: 'q25_3', question: { en: 'db[:] = [c for c in db if c["id"] != cid] does:', pt: 'db[:] = [c for c in db if c["id"] != cid] faz:' }, options: [{ en: 'Removes item with cid in-place', pt: 'Remove item com cid no lugar' }, { en: 'Creates a new list', pt: 'Cria uma nova lista' }, { en: 'Clears entire db', pt: 'Limpa todo o db' }, { en: 'Nothing', pt: 'Nada' }], correctIndex: 0, explanation: { en: 'db[:] = modifies existing list in-place. Comprehension filters out the target item.', pt: 'db[:] = modifica a lista existente no lugar. Comprehension filtra o item alvo.' } },
    { id: 'q25_4', question: { en: 'Auto-increment ID: id = len(db) + 1 gives:', pt: 'ID auto-incremental: id = len(db) + 1 dá:' }, options: [{ en: 'Next sequential ID', pt: 'Próximo ID sequencial' }, { en: 'Random ID', pt: 'ID aleatório' }, { en: 'Last ID', pt: 'Último ID' }, { en: 'First ID always', pt: 'Sempre o primeiro ID' }], correctIndex: 0, explanation: { en: 'len(db) = current count. +1 = next ID. Simple and works for sequential lists.', pt: 'len(db) = contagem atual. +1 = próximo ID. Simples e funciona para listas sequenciais.' } }
  ],
  exam: {
    title: { en: 'Records Management System', pt: 'Sistema de Gestão de Registros' },
    scenario: { en: 'Build a full CRUD records system and run a demo.', pt: 'Construa um sistema CRUD completo de registros e execute um demo.' },
    requirements: { en: ['create/read_all/update/delete functions', 'Create 4 records', 'Update #2 to 9000', 'Delete #4', 'Read final state'], pt: ['Funções create/read_all/update/delete', 'Criar 4 registros', 'Atualizar #2 para 9000', 'Deletar #4', 'Ler estado final'] },
    starterCode: `def create(db, client, pages):
    db.append({"id": len(db)+1, "client": client, "pages": pages})

def read_all(db):
    for c in db: print(f"#{c['id']} {c['client']} \${c['pages']}")

def update(db, cid, new_pages):
    for c in db:
        if c["id"] == cid: c["pages"] = new_pages; return True

def delete(db, cid):
    db[:] = [c for c in db if c["id"] != cid]

db = []
create(db, "Alice",5230); create(db, "Bob",1200)
create(db, "Carlos",8000); create(db, "Diana",900)
print("Initial:"); read_all(db)
update(db, 2, 9000); delete(db, 4)
print("Final:"); read_all(db)`,
    testCases: [
      { id: 'tc25_1', description: { en: 'Alice in output', pt: 'Alice no output' }, inputs: [], checks: [{ type: 'contains', value: 'Alice' }], points: 20 },
      { id: 'tc25_2', description: { en: 'Bob updated to 9000', pt: 'Bob atualizado para 9000' }, inputs: [], checks: [{ type: 'contains', value: '9000' }], points: 30 },
      { id: 'tc25_3', description: { en: 'Final state shown', pt: 'Estado final mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Final' }], points: 25 },
      { id: 'tc25_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 25 }
    ]
  }
}

export const phase26: Phase = {
  id: 26,
  title: { en: 'Project: Data Analysis', pt: 'Projeto: Análise de Dados' },
  description: { en: 'Analyze a dataset to find patterns, totals, and insights.', pt: 'Analise um conjunto de dados para encontrar padrões, totais e insights.' },
  icon: '📊',
  libraries: [],
  lesson: {
    title: { en: 'Turning Raw Data into Decisions', pt: 'Transformando Dados Brutos em Decisões' },
    blocks: [
      { type: 'heading', content: { en: '🌍 A list of numbers answers nothing', pt: '🌍 Uma lista de números não responde nada' } },
      { type: 'text', content: {
        en: 'A shop has last month\'s sales. A teacher has the class\'s grades. A council has journey times for every bus. In each case the data is already there — and by itself it tells nobody anything.\n\nAnalysis is the step that turns a column of numbers into a sentence someone can act on: "half the class is below 60", "three routes are slower than they were", "we sold more on Saturdays".\n\nEverything in this phase you already have: a list, sum, a loop, a comprehension. What is new is asking the right question of them.',
        pt: 'Uma loja tem as vendas do mês passado. Um professor tem as notas da turma. Uma prefeitura tem o tempo de viagem de cada ônibus. Em todos os casos o dado já existe — e sozinho não diz nada a ninguém.\n\nAnálise é o passo que transforma uma coluna de números numa frase sobre a qual alguém pode agir: "metade da turma está abaixo de 60", "três rotas ficaram mais lentas", "vendemos mais aos sábados".\n\nTudo nesta fase você já tem: lista, sum, laço, compreensão. O novo é fazer a pergunta certa a eles.'
      }},
      { type: 'heading', content: { en: '🧩 The shape of the crowd, not the faces', pt: '🧩 A forma da multidão, não os rostos' } },
      { type: 'text', content: {
        en: 'You cannot look at two thousand numbers. You can look at five: how many, how much in total, the typical one, the largest, the smallest.\n\nThose five describe the shape of the whole set. Every analysis you will ever write starts there, and only then asks something more specific.',
        pt: 'Você não consegue olhar dois mil números. Consegue olhar cinco: quantos, quanto no total, o típico, o maior, o menor.\n\nEsses cinco descrevem a forma do conjunto inteiro. Toda análise que você escrever começa aí, e só depois pergunta algo mais específico.'
      }},

      { type: 'heading', content: { en: '🆚 A dump versus an answer', pt: '🆚 Um despejo versus uma resposta' } },
      { type: 'text', content: {
        en: 'Both programs have the same data. Only one of them says something.',
        pt: 'Os dois programas têm os mesmos dados. Só um deles diz alguma coisa.'
      }},
      { type: 'code', code: `# A dump: correct, and useless to a reader
sales = [5230, 1200, 8000, 450, 3100, 9200]
print(sales)` },
      { type: 'code', code: `# An answer: the same data, described
sales = [5230, 1200, 8000, 450, 3100, 9200]

total = sum(sales)
average = total / len(sales)
biggest = max(sales)
smallest = min(sales)
big_days = len([value for value in sales if value > 5000])

print(f"Days:     {len(sales)}")
print(f"Total:    {total}")
print(f"Average:  {average:.0f}")
print(f"Range:    {smallest} to {biggest}")
print(f"Over 5000: {big_days} days")` },
      { type: 'checkpoint', checkpoint: {
        code: 'sales = []\nprint(sum(sales) / len(sales))',
        options: [
          { en: 'ZeroDivisionError', pt: 'ZeroDivisionError' },
          { en: '0', pt: '0' },
          { en: 'None', pt: 'None' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'An empty list has length zero, and dividing by zero stops the program. Real data is empty more often than you expect — a shop with no sales yet, a filter that matched nothing. Check `if sales:` before averaging.',
          pt: 'Uma lista vazia tem comprimento zero, e dividir por zero para o programa. Dados reais vêm vazios com mais frequência do que se espera — uma loja sem vendas ainda, um filtro que não encontrou nada. Verifique `if sales:` antes de calcular a média.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 1 — the five that describe any set', pt: '🐍 Fundamentos 1 — os cinco que descrevem qualquer conjunto' } },
      { type: 'text', content: {
        en: 'len, sum, max, min and the average. Four are built in; the average is sum divided by len, and it is the one that can crash.',
        pt: 'len, sum, max, min e a média. Quatro são embutidos; a média é sum dividido por len, e é a única que pode quebrar.'
      }},
      { type: 'code', code: `grades = [72, 55, 91, 48, 66]

print(len(grades))              # 5
print(sum(grades))              # 332
print(max(grades), min(grades)) # 91 48

if grades:
    print(sum(grades) / len(grades))   # 66.4
else:
    print("No grades yet")` },

      { type: 'heading', content: { en: '🐍 Fundamentals 2 — average versus middle', pt: '🐍 Fundamentos 2 — média versus meio' } },
      { type: 'text', content: {
        en: 'The average is pulled by extremes. One enormous value drags it away from anything typical, and then it describes nobody.\n\nThe median — sort the values and take the middle one — ignores how extreme the extremes are. When the two disagree, that disagreement is itself the finding.',
        pt: 'A média é puxada pelos extremos. Um valor enorme a arrasta para longe de qualquer coisa típica, e aí ela não descreve ninguém.\n\nA mediana — ordene os valores e pegue o do meio — ignora o quão extremos são os extremos. Quando as duas discordam, essa discordância já é a descoberta.'
      }},
      { type: 'code', code: `values = [30, 32, 35, 31, 2000]

average = sum(values) / len(values)
middle = sorted(values)[len(values) // 2]

print(f"Average: {average:.0f}")   # 425 — describes nobody
print(f"Median:  {middle}")        # 32  — describes almost everybody` },
      { type: 'checkpoint', checkpoint: {
        code: 'values = [10, 20, 30, 40]\nprint(sorted(values)[len(values) // 2])',
        options: [
          { en: '30', pt: '30' },
          { en: '25', pt: '25' },
          { en: '20', pt: '20' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'With an even count there is no single middle. 4 // 2 is 2, so this takes position 2 — the value 30 — rather than the true median of 25, which is the average of 20 and 30. The shortcut is fine for odd counts and slightly wrong for even ones; worth knowing which you have.',
          pt: 'Com uma quantidade par não existe um único meio. 4 // 2 é 2, então isso pega a posição 2 — o valor 30 — em vez da mediana real de 25, que é a média entre 20 e 30. O atalho serve para quantidades ímpares e fica levemente errado nas pares; vale saber qual você tem.'
        }
      } },

      { type: 'heading', content: { en: '🐍 Fundamentals 3 — counting and filtering', pt: '🐍 Fundamentos 3 — contar e filtrar' } },
      { type: 'text', content: {
        en: 'Most real questions are a filter followed by a count or a sum. "How many failed?" is a count with a condition. "How much came from big orders?" is a sum with a condition.',
        pt: 'A maioria das perguntas reais é um filtro seguido de uma contagem ou soma. "Quantos reprovaram?" é uma contagem com condição. "Quanto veio de pedidos grandes?" é uma soma com condição.'
      }},
      { type: 'code', code: `grades = [72, 55, 91, 48, 66]

failed = len([g for g in grades if g < 60])
top_total = sum(g for g in grades if g >= 70)
share = failed / len(grades) * 100

print(f"Failed: {failed} ({share:.0f}%)")
print(f"Points from 70+: {top_total}")` },

      { type: 'heading', content: { en: '🏗️ Real scenario 1 — the three busiest days', pt: '🏗️ Cenário real 1 — os três dias mais movimentados' } },
      { type: 'text', content: {
        en: 'Sorting descending and slicing the first few is how every "top N" list is built, whether it is best-selling products or slowest routes.',
        pt: 'Ordenar em ordem decrescente e fatiar os primeiros é como toda lista de "top N" é feita, sejam produtos mais vendidos ou rotas mais lentas.'
      }},
      { type: 'code', code: `sales = [5230, 1200, 8000, 450, 3100, 9200]

top_three = sorted(sales, reverse=True)[:3]
print("Top 3:", top_three)          # [9200, 8000, 5230]
print("They are", sum(top_three) / sum(sales) * 100, "% of the total")` },

      { type: 'heading', content: { en: '🏗️ Real scenario 2 — grouping before counting', pt: '🏗️ Cenário real 2 — agrupar antes de contar' } },
      { type: 'text', content: {
        en: 'Records usually carry a label as well as a number. Grouping by that label turns one long list into a small table — and a small table is something a person can read.',
        pt: 'Registros normalmente trazem um rótulo além do número. Agrupar por esse rótulo transforma uma lista longa numa tabela pequena — e uma tabela pequena é algo que uma pessoa consegue ler.'
      }},
      { type: 'code', code: `orders = [
    {"category": "books", "value": 40},
    {"category": "toys",  "value": 90},
    {"category": "books", "value": 25},
]

totals = {}
for order in orders:
    category = order["category"]
    totals[category] = totals.get(category, 0) + order["value"]

for category, value in totals.items():
    print(f"{category}: {value}")     # books: 65 / toys: 90` },

      { type: 'heading', content: { en: '⚠️ Common errors', pt: '⚠️ Erros comuns' } },
      { type: 'text', content: {
        en: '• Dividing by len() without checking the list is not empty.\n• Reporting an average when one extreme value has made it meaningless.\n• Using sorted(values)[len(values) // 2] on an even count and calling it the median.\n• Counting a percentage against the wrong total — filtered instead of overall, or the reverse.\n• Printing raw numbers with no label, so the reader has to guess what each one is.',
        pt: '• Dividir por len() sem verificar se a lista não está vazia.\n• Reportar uma média quando um valor extremo já a tornou sem sentido.\n• Usar sorted(values)[len(values) // 2] numa quantidade par e chamar isso de mediana.\n• Calcular porcentagem sobre o total errado — o filtrado em vez do geral, ou o contrário.\n• Imprimir números sem rótulo, e o leitor ter que adivinhar o que é cada um.'
      }},
      { type: 'tip', content: {
        en: '💡 Write the sentence you want first — "X of Y were above Z" — then write the code that fills it in. It stops you calculating things nobody asked about.',
        pt: '💡 Escreva primeiro a frase que você quer — "X de Y ficaram acima de Z" — e depois o código que a preenche. Isso evita calcular coisas que ninguém perguntou.'
      }},

      { type: 'heading', content: { en: '📋 Recap', pt: '📋 Recapitulando' } },
      { type: 'text', content: {
        en: 'Five numbers describe any set: count, total, average, largest, smallest.\nGuard the average — an empty list divides by zero.\nAverage and median disagree when extremes exist, and the disagreement is the finding.\nMost questions are a filter plus a count or a sum.\nSort descending and slice for a top N; group into a dictionary for a table.',
        pt: 'Cinco números descrevem qualquer conjunto: quantidade, total, média, maior, menor.\nProteja a média — uma lista vazia divide por zero.\nMédia e mediana discordam quando há extremos, e a discordância é a descoberta.\nA maioria das perguntas é um filtro mais uma contagem ou soma.\nOrdene decrescente e fatie para um top N; agrupe num dicionário para uma tabela.'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex26_recog',
      title: { en: '🟡 Add Missing Statistics', pt: '🟡 Adicione Estatísticas Faltantes' },
      description: {
        en: 'Goal:\nThe starter code calculates statistics from a sales list. The total and average are already done. There are two blanks left: one for the expression that gives the middle index of the sorted list to find the median, and one for the comparison operator that counts sales above 5000 as critical.\n\nFill in each blank, then run the code.\n\nExample:\nAverage: $4038\nMedian: $3100\nCritical: 3',
        pt: 'Objetivo:\nO código inicial calcula estatísticas a partir de uma lista de vendas. O total e a média já estão prontos. Faltam duas lacunas: uma para a expressão que dá o índice do meio da lista ordenada para encontrar a mediana, e outra para o operador de comparação que conta vendas acima de 5000 como críticas.\n\nPreencha cada lacuna e execute o código.\n\nExemplo:\nAverage: $4038\nMedian: $3100\nCritical: 3'
      },
      starterCode: `sales = [5230, 1200, 8000, 450, 3100, 9200, 620, 4500]

total   = sum(sales)
average = total / len(sales)

sorted_c = sorted(sales)
median   = sorted_c[___]              # fill: middle index

critical = len([c for c in sales if c ___ 5000])  # fill: operator

print(f"Average: \${average:.0f}")
print(f"Median:  \${median}")
print(f"Critical: {critical}")`,
      hints: [
        { en: 'Middle index = len(list) // 2', pt: 'Índice do meio = len(lista) // 2' },
        { en: 'Condition: c > 5000', pt: 'Condição: c > 5000' }
      ],
      sampleOutput: { en: 'Average: $4038\nMedian: $3100\nCritical: 3', pt: 'Average: $4038\nMedian: $3100\nCritical: 3' }
    },
    {
      id: 'ex26_zero',
      title: { en: '🔴 Full Data Report', pt: '🔴 Relatório Completo' },
      description: {
        en: 'Goal:\nRun the provided data report as-is. The program takes a list of daily sales and produces a full statistical summary.\n\nProgram requirements\n\n1. Calculate the total and average of all sales\n2. Find the minimum, maximum and median values\n3. Calculate the net total after a 250 deduction per sale\n4. Count sales in three ranges: critical (above 8000), urgent (3000 to 8000) and normal (below 3000)\n5. Identify the three largest sales\n\nExample, for 10 daily sales:\n=== REPORT ===\nTotal: $42,400 | Avg: $4,240\nMin: $450 | Max: $9200 | Median: $4500\nNet total: $39,900\nCritical:1 Urgent:5 Normal:4\nTop 3: [9200, 8000, 7800]',
        pt: 'Objetivo:\nExecute o relatório de dados fornecido como está. O programa recebe uma lista de vendas diárias e produz um resumo estatístico completo.\n\nRequisitos do programa\n\n1. Calcule o total e a média de todas as vendas\n2. Encontre o valor mínimo, máximo e a mediana\n3. Calcule o total líquido após dedução de 250 por venda\n4. Conte vendas em três faixas: critical (acima de 8000), urgent (3000 a 8000) e normal (abaixo de 3000)\n5. Identifique as três maiores vendas\n\nExemplo, para 10 vendas diárias:\n=== REPORT ===\nTotal: $42,400 | Avg: $4,240\nMin: $450 | Max: $9200 | Median: $4500\nNet total: $39,900\nCritical:1 Urgent:5 Normal:4\nTop 3: [9200, 8000, 7800]'
      },
      starterCode: `sales = [5230,1200,8000,450,3100,9200,620,4500,7800,2300]

total    = sum(sales)
average  = total / len(sales)
minimum  = min(sales)
maximum  = max(sales)
median   = sorted(sales)[len(sales)//2]
net_total   = sum(c - 250 for c in sales)
critical = len([c for c in sales if c > 8000])
urgent   = len([c for c in sales if 3000 <= c <= 8000])
normal   = len([c for c in sales if c < 3000])
top3     = sorted(sales, reverse=True)[:3]

print(f"=== REPORT ===")
print(f"Total: \${total:,} | Avg: \${average:,.0f}")
print(f"Min: \${minimum} | Max: \${maximum} | Median: \${median}")
print(f"Net total: \${net_total:,}")
print(f"Critical:{critical} Urgent:{urgent} Normal:{normal}")
print(f"Top 3: {top3}")`,
      hints: [{ en: 'sorted(sales, reverse=True)[:3] gets top 3', pt: 'sorted(sales, reverse=True)[:3] pega top 3' }],
      sampleOutput: { en: '=== REPORT ===\nTotal: $42,400', pt: '=== RELATÓRIO ===\nTotal: $42.400' }
    }
  ],
  quiz: [
    { id: 'q26_1', question: { en: 'How to get highest value in a list?', pt: 'Como obter o maior valor de uma lista?' }, options: [{ en: 'max(list)', pt: 'max(lista)' }, { en: 'list.highest()', pt: 'lista.highest()' }, { en: 'list.max()', pt: 'lista.max()' }, { en: 'highest(list)', pt: 'highest(lista)' }], correctIndex: 0, explanation: { en: 'max() is a Python built-in. Also works: sorted(list)[-1].', pt: 'max() é embutido do Python. Também funciona: sorted(lista)[-1].' } },
    { id: 'q26_2', question: { en: 'Average of a list?', pt: 'Média de uma lista?' }, options: [{ en: 'sum(list) / len(list)', pt: 'sum(lista) / len(lista)' }, { en: 'average(list)', pt: 'average(lista)' }, { en: 'list.mean()', pt: 'lista.mean()' }, { en: 'mean(list)', pt: 'mean(lista)' }], correctIndex: 0, explanation: { en: 'No built-in average. Use sum()/len() or import statistics.', pt: 'Sem average embutido. Use sum()/len() ou importe statistics.' } },
    { id: 'q26_3', question: { en: 'sorted(data, reverse=True)[:3] gives:', pt: 'sorted(data, reverse=True)[:3] dá:' }, options: [{ en: 'Top 3 highest values', pt: 'Top 3 maiores valores' }, { en: 'Bottom 3', pt: 'Os 3 menores' }, { en: 'First 3 items', pt: 'Primeiros 3 itens' }, { en: 'Reversed list', pt: 'Lista invertida' }], correctIndex: 0, explanation: { en: 'reverse=True → descending. [:3] → first 3 of that = top 3 highest.', pt: 'reverse=True → decrescente. [:3] → primeiros 3 = top 3 maiores.' } },
    { id: 'q26_4', question: { en: 'Median of [1,3,5,7,9]?', pt: 'Mediana de [1,3,5,7,9]?' }, options: [{ en: '5', pt: '5' }, { en: '4', pt: '4' }, { en: '25', pt: '25' }, { en: '3', pt: '3' }], correctIndex: 0, explanation: { en: 'Median = middle value when sorted. 5 items → index 2 → value 5.', pt: 'Mediana = valor do meio quando ordenado. 5 itens → índice 2 → valor 5.' } }
  ],
  exam: {
    title: { en: 'Monthly Sales Analysis', pt: 'Análise Mensal de Vendas' },
    scenario: { en: 'Produce a full statistical report from monthly data.', pt: 'Produza um relatório estatístico completo dos dados mensais.' },
    requirements: { en: ['total, avg, min, max, median', 'Critical/Urgent/Normal counts', 'Total net_total ($250 ded)', 'Top 3 sales', 'Formatted output'], pt: ['total, média, mín, máx, mediana', 'Contagens Crítico/Urgente/Normal', 'Total net_total (R$250 crédito)', 'Top 3 vendas', 'Output formatado'] },
    starterCode: `sales = [5230,1200,8000,450,3100,9200,620,4500,7800,2300,6500,890,11000,3800,720]

total    = sum(sales)
average  = total / len(sales)
minimum  = min(sales)
maximum  = max(sales)
median   = sorted(sales)[len(sales)//2]
net_total   = sum(c - 250 for c in sales)
critical = len([c for c in sales if c > 8000])
urgent   = len([c for c in sales if 3000 <= c <= 8000])
normal   = len([c for c in sales if c < 3000])
top3     = sorted(sales, reverse=True)[:3]

print(f"Sales: {len(sales)} | Total: \${total:,}")
print(f"Avg: \${average:,.0f} | Median: \${median:,}")
print(f"Min: \${minimum:,} | Max: \${maximum:,}")
print(f"Net total: \${net_total:,}")
print(f"Critical:{critical} Urgent:{urgent} Normal:{normal}")
print(f"Top 3: {top3}")`,
    testCases: [
      { id: 'tc26_1', description: { en: 'Total shown', pt: 'Total mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Total' }], points: 20 },
      { id: 'tc26_2', description: { en: 'Critical count', pt: 'Contagem crítica' }, inputs: [], checks: [{ type: 'matches', value: '(critical|cr[ií]tico)' }], points: 20 },
      { id: 'tc26_3', description: { en: 'Top 3 shown', pt: 'Top 3 mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Top 3' }], points: 20 },
      { id: 'tc26_4', description: { en: 'Net total shown', pt: 'Total líquido mostrado' }, inputs: [], checks: [{ type: 'matches', value: '(net_total|pagamento)' }], points: 20 },
      { id: 'tc26_5', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

export const phase27: Phase = {
  id: 27,
  title: { en: 'Foundation Capstone: Orders System', pt: 'Capstone da Base: Sistema de Pedidos' },
  description: { en: 'Combine the published Python foundations in a structured terminal project.', pt: 'Combine os fundamentos publicados de Python em um projeto estruturado de terminal.' },
  icon: '🏆',
  libraries: [],
  lesson: {
    title: { en: 'Everything Together', pt: 'Tudo Junto' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Consolidating the published foundation', pt: '🌍 Consolidando a base publicada' } },
      { type: 'text', content: {
        en: 'Across the published foundation phases you covered:\n• Variables, types and input\n• Decisions and loops\n• Data structures\n• Functions and scope\n• Files, JSON and standard libraries\n• Error handling\n• Applied terminal projects\n\nThis capstone combines that foundation. Professional and advanced Python continue in the roadmap.',
        pt: 'Ao longo das fases de base publicadas você cobriu:\n• Variáveis, tipos e input\n• Decisões e loops\n• Estruturas de dados\n• Funções e escopo\n• Arquivos, JSON e bibliotecas padrão\n• Tratamento de erros\n• Projetos aplicados de terminal\n\nEste capstone combina essa base. Python profissional e avançado continuam no mapa.'
      }},
      { type: 'heading', content: { en: '🆚 Script vs Production System', pt: '🆚 Script vs Sistema de Produção' } },
      { type: 'code', code: `# ❌ SCRIPT: works once, brittle
amount = 5230
print(amount - 250)` },
      { type: 'code', code: `# ✅ SYSTEM: structured, persistent, robust
from datetime import datetime

def create_order(db, client, amount, ded=250):
    """Create order with full metadata."""
    if amount <= 0: raise ValueError("Must be positive")
    priority = ("Critical" if amount > 10000
                else "Urgent" if amount > 5000
                else "Normal")
    db.append({
        "id":       len(db) + 1,
        "client":   client,
        "amount":   amount,
        "ded":      ded,
        "total":   amount - ded,
        "priority": priority,
        "status":   "open",
        "date":     datetime.now().strftime("%Y-%m-%d")
    })

def read_all(db):
    for c in db:
        print(f"#{c['id']} {c['client']} \${c['amount']} [{c['priority']}] {c['status']}")

def update_status(db, cid, status):
    for c in db:
        if c["id"] == cid: c["status"] = status; return True

def analyze(db):
    if not db: return
    total  = sum(c["amount"] for c in db)
    total = sum(c["total"] for c in db)
    print(f"Total: \${total:,} | Net total: \${total:,} | Orders: {len(db)}")` }
    ]
  },
  exercises: [
    {
      id: 'ex27_recog',
      title: { en: '🟡 Complete the System Functions', pt: '🟡 Complete as Funções do Sistema' },
      description: {
        en: 'Goal:\nThe starter code implements a orders system with three functions. create_order() is already complete. update_status() has two blanks -- the dictionary key used to find a order by id, and the dictionary key being updated with the new status. delete_order() has one blank -- the dictionary key used to filter out the order with the matching id.\n\nFill in the three blanks, then run the code. Alice’s order should have its status changed to approved, and Bob’s order should be removed.\n\nExample:\n{"id": 1, "client": "Alice", "amount": 5230, "status": "approved"}',
        pt: 'Objetivo:\nO código inicial implementa um sistema de pedidos com três funções. create_order() já está completa. update_status() tem duas lacunas -- a chave do dicionário usada para encontrar um pedido por id, e a chave do dicionário sendo atualizada com o novo status. delete_order() tem uma lacuna -- a chave do dicionário usada para filtrar o pedido com o id correspondente.\n\nPreencha as três lacunas e execute o código. O pedido de Alice deve ter seu status alterado para approved, e o pedido de Bob deve ser removido.\n\nExemplo:\n{"id": 1, "client": "Alice", "amount": 5230, "status": "approved"}'
      },
      starterCode: `from datetime import datetime

def create_order(db, client, amount):
    db.append({"id": len(db)+1, "client": client, "amount": amount, "status": "open"})

def update_status(db, cid, new_status):
    for c in db:
        if c["___"] == cid:       # fill: compare by id
            c["___"] = new_status  # fill: update status
            return True
    return False

def delete_order(db, cid):
    db[:] = [c for c in db if c["___"] != cid]  # fill: filter by id

db = []
create_order(db, "Alice", 5230)
create_order(db, "Bob",   1200)
update_status(db, 1, "approved")
delete_order(db, 2)
for c in db: print(c)`,
      hints: [
        { en: 'All three blanks use the "id" key', pt: 'Os três espaços usam a chave "id"' },
        { en: 'The status blank uses the "status" key', pt: 'O espaço de status usa a chave "status"' }
      ],
      sampleOutput: { en: '{"id": 1, "client": "Alice", "amount": 5230, "status": "approved"}', pt: '{"id": 1, "client": "Alice", "amount": 5230, "status": "approved"}' }
    },
    {
      id: 'ex27_zero',
      title: { en: '🔴 Build the Full System', pt: '🔴 Construa o Sistema Completo' },
      description: {
        en: 'Goal:\nRun the provided orders system as-is. The program creates orders, updates statuses, deletes records and displays statistics.\n\nProgram requirements\n\n1. Create five orders for Alice (12000 amount), Bob (3500), Carlos (7800), Diana (900) and Eduardo (-1)\n2. The negative amount for Eduardo should trigger an error message\n3. Approve Alice’s and Carlos’s orders\n4. Remove Diana’s order\n5. Display the remaining three orders with their priority and status\n6. Display total orders, total amount and total total\n\nExample:\nError: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved\n#2 Bob $3500 [Normal] open\n#3 Carlos $7800 [Urgent] approved\n=== STATS ===\nOrders:3 | Amount:$23,300 | Total:$22,550',
        pt: 'Objetivo:\nExecute o sistema de pedidos fornecido como está. O programa cria pedidos, atualiza status, exclui registros e exibe estatísticas.\n\nRequisitos do programa\n\n1. Crie cinco pedidos para Alice (dano 12000), Bob (3500), Carlos (7800), Diana (900) e Eduardo (-1)\n2. O dano negativo de Eduardo deve acionar uma mensagem de erro\n3. Aprove os pedidos de Alice e Carlos\n4. Remova o pedido de Diana\n5. Exiba os três pedidos restantes com prioridade e status\n6. Exiba o total de pedidos, o dano total e o total total\n\nExemplo:\nError: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved\n#2 Bob $3500 [Normal] open\n#3 Carlos $7800 [Urgent] approved\n=== STATS ===\nOrders:3 | Amount:$23,300 | Total:$22,550'
      },
      starterCode: `from datetime import datetime

def create_order(db, client, amount, ded=250):
    if amount <= 0: raise ValueError("Must be positive")
    priority = "Critical" if amount > 10000 else "Urgent" if amount > 5000 else "Normal"
    db.append({"id": len(db)+1, "client": client, "amount": amount,
               "total": amount-ded, "priority": priority, "status": "open",
               "date": datetime.now().strftime("%Y-%m-%d")})

def read_all(db):
    for c in db:
        print(f"#{c['id']} {c['client']} \${c['amount']} [{c['priority']}] {c['status']}")

def update_status(db, cid, status):
    for c in db:
        if c["id"] == cid: c["status"] = status; return True

def delete_order(db, cid):
    db[:] = [c for c in db if c["id"] != cid]

def analyze(db):
    total = sum(c["amount"] for c in db)
    total = sum(c["total"] for c in db)
    print(f"Orders:{len(db)} | Amount:\${total:,} | Total:\${total:,}")

db = []
try:
    create_order(db, "Alice",  12000)
    create_order(db, "Bob",     3500)
    create_order(db, "Carlos",  7800)
    create_order(db, "Diana",    900)
    create_order(db, "Eduardo",   -1)  # should error
except ValueError as e:
    print(f"Error: {e}")

update_status(db, 1, "approved")
update_status(db, 3, "approved")
delete_order(db, 4)

print("=== SYSTEM ==="); read_all(db)
print("=== STATS ==="); analyze(db)`,
      hints: [{ en: 'Eduardo with -1 should trigger the ValueError', pt: 'Eduardo com -1 deve acionar o ValueError' }],
      sampleOutput: { en: 'Error: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved', pt: 'Error: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved' }
    }
  ],
  quiz: [
    { id: 'q27_1', question: { en: 'What handles "Must be positive" validation cleanly?', pt: 'O que trata "Must be positive" de forma limpa?' }, options: [{ en: 'raise ValueError inside function', pt: 'raise ValueError dentro da função' }, { en: 'if/else with print', pt: 'if/else com print' }, { en: 'return False', pt: 'return False' }, { en: 'assert statement', pt: 'instrução assert' }], correctIndex: 0, explanation: { en: 'raise ValueError lets the caller catch it with try/except. The function signals bad input and stops.', pt: 'raise ValueError deixa o chamador capturar com try/except. A função sinaliza entrada ruim e para.' } },
    { id: 'q27_2', question: { en: 'Why store date as string in the order dict?', pt: 'Por que armazenar data como string no dict?' }, options: [{ en: 'Strings are JSON-serializable; datetime objects are not', pt: 'Strings são serializáveis em JSON; objetos datetime não são' }, { en: 'Strings are faster', pt: 'Strings são mais rápidas' }, { en: 'Datetime can\'t be in dicts', pt: 'Datetime não pode estar em dicts' }, { en: 'No reason', pt: 'Sem razão' }], correctIndex: 0, explanation: { en: 'json.dump() can\'t serialize datetime. Convert first: datetime.now().strftime("%Y-%m-%d").', pt: 'json.dump() não serializa datetime. Converta antes: datetime.now().strftime("%Y-%m-%d").' } },
    { id: 'q27_3', question: { en: 'What makes this a "system" vs a "script"?', pt: 'O que faz isso ser "sistema" vs "script"?' }, options: [{ en: 'Functions, validation, error handling, reusability', pt: 'Funções, validação, tratamento de erros, reusabilidade' }, { en: 'More lines of code', pt: 'Mais linhas de código' }, { en: 'Using import statements', pt: 'Usar instruções import' }, { en: 'Running in terminal', pt: 'Rodar em terminal' }], correctIndex: 0, explanation: { en: 'A system has clear structure, handles errors, validates data, and can be extended. A script solves one problem once.', pt: 'Um sistema tem estrutura clara, trata erros, valida dados e pode ser expandido. Um script resolve um problema uma vez.' } },
    { id: 'q27_4', question: { en: 'What does completing this capstone prove?', pt: 'O que concluir este capstone comprova?' }, options: [{ en: 'Strong command of the current foundations and readiness for professional Python', pt: 'Bom domínio da base atual e preparo para Python profissional' }, { en: 'Mastery of every Python domain', pt: 'Domínio de todas as áreas de Python' }, { en: 'Ability to train a large language model from scratch', pt: 'Capacidade de treinar um grande modelo de linguagem do zero' }, { en: 'No need for further study', pt: 'Não precisar estudar mais' }], correctIndex: 0, explanation: { en: 'This project proves foundation mastery. Testing, architecture, databases, advanced Python and specializations come next.', pt: 'Este projeto comprova domínio da base. Testes, arquitetura, bancos, Python avançado e especializações vêm depois.' } }
  ],
  exam: {
    title: { en: 'Final Capstone: Complete Orders System', pt: 'Capstone Final: Sistema Completo' },
    scenario: { en: 'Build and demonstrate a structured orders system combining the published foundation phases.', pt: 'Construa e demonstre um sistema estruturado de pedidos combinando as fases de base publicadas.' },
    requirements: { en: ['Full CRUD', 'Priority classification', 'Error handling', 'Statistical analysis', '5+ orders in demo', 'No crashes'], pt: ['CRUD completo', 'Classificação de prioridade', 'Tratamento de erros', 'Análise estatística', '5+ pedidos no demo', 'Sem crashes'] },
    starterCode: `from datetime import datetime

def create_order(db, client, amount, ded=250):
    if amount <= 0: raise ValueError("Must be positive")
    priority = "Critical" if amount > 10000 else "Urgent" if amount > 5000 else "Normal"
    db.append({"id": len(db)+1, "client": client, "amount": amount,
               "total": amount-ded, "priority": priority, "status": "open",
               "date": datetime.now().strftime("%Y-%m-%d")})

def read_all(db):
    for c in db:
        print(f"#{c['id']} {c['client']} \${c['amount']} [{c['priority']}] {c['status']}")

def update_status(db, cid, status):
    for c in db:
        if c["id"] == cid: c["status"] = status; return True

def delete_order(db, cid):
    db[:] = [c for c in db if c["id"] != cid]

def analyze(db):
    total = sum(c["amount"] for c in db)
    total = sum(c["total"] for c in db)
    print(f"Orders:{len(db)} | Total:\${total:,} | Total:\${total:,}")

db = []
try:
    create_order(db, "Alice",  12000)
    create_order(db, "Bob",     3500)
    create_order(db, "Carlos",  7800)
    create_order(db, "Diana",    900)
    create_order(db, "Eduardo", 5500)
except ValueError as e:
    print("Error:", e)

update_status(db, 1, "approved")
update_status(db, 3, "approved")
delete_order(db, 4)

print("=== FINAL ==="); read_all(db)
print("=== STATS ==="); analyze(db)`,
    testCases: [
      { id: 'tc27_1', description: { en: 'Alice Critical approved', pt: 'Alice Critical aprovada' }, inputs: [], checks: [{ type: 'matches', value: '(critical|cr[ií]tico)' }], points: 20 },
      { id: 'tc27_2', description: { en: 'Alice status approved', pt: 'Status Alice approved' }, inputs: [], checks: [{ type: 'matches', value: '(approved|aprovado)' }], points: 20 },
      { id: 'tc27_3', description: { en: 'Stats total shown', pt: 'Total de stats mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Total' }], points: 20 },
      { id: 'tc27_4', description: { en: 'Total shown', pt: 'Total mostrado' }, inputs: [], checks: [{ type: 'matches', value: '(total|pagamento)' }], points: 20 },
      { id: 'tc27_5', description: { en: 'No crash', pt: 'Sem crash' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

