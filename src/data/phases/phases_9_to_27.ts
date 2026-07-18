import type { Phase } from '../types'

// ============================================================================
// PHASE 9 — Listas Aninhadas
// TEMPLATE B: Conceito Composto
// ============================================================================

export const phase9: Phase = {
  id: 9,
  title: { en: 'Nested Lists', pt: 'Listas Aninhadas' },
  description: {
    en: 'Store structured data — lists inside lists, like a spreadsheet.',
    pt: 'Armazene dados estruturados — listas dentro de listas, como uma planilha.'
  },
  icon: '🗂️',
  libraries: [],

  lesson: {
    title: { en: 'Lists Inside Lists', pt: 'Listas Dentro de Listas' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Excel is a nested list', pt: '🌍 O Excel é uma lista aninhada' } },
      {
        type: 'text',
        content: {
          en: 'Every spreadsheet you\'ve ever seen is a nested list in disguise.\nRow 1: ["Alice", 5230, "approved"]\nRow 2: ["Bob", 1200, "pending"]\n\nExcel, Google Sheets, databases — they all store data this way under the hood.',
          pt: 'Toda planilha que você já viu é uma lista aninhada disfarçada.\nLinha 1: ["Alice", 5230, "aprovado"]\nLinha 2: ["Bob", 1200, "pendente"]\n\nExcel, Google Sheets, bancos de dados — todos armazenam dados assim por baixo dos panos.'
        }
      },
      { type: 'heading', content: { en: '🧩 A filing cabinet', pt: '🧩 Um arquivo de pastas' } },
      {
        type: 'text',
        content: {
          en: 'A filing cabinet has drawers (rows).\nEach drawer has folders (columns).\n\nNested list = cabinet\nInner list = one drawer with its folders\nYou access a specific folder by: cabinet[drawer][folder]',
          pt: 'Um arquivo tem gavetas (linhas).\nCada gaveta tem pastas (colunas).\n\nLista aninhada = arquivo\nLista interna = uma gaveta com suas pastas\nVocê acessa uma pasta específica por: arquivo[gaveta][pasta]'
        }
      },
      { type: 'heading', content: { en: '🐍 Step 1 — a list inside a list', pt: '🐍 Passo 1 — uma lista dentro de uma lista' } },
      {
        type: 'code',
        code: {
          en: `# Each inner list represents one claim row
claim1 = ["Alice",  5230, "approved"]
claim2 = ["Bob",    1200, "pending"]
claim3 = ["Carlos", 8000, "approved"]

# The outer list stores all claims
claims = [claim1, claim2, claim3]

# Access: claims[row][column]
print(claims[0])       # ['Alice', 5230, 'approved']
print(claims[0][0])    # Alice  (row 0, column 0)
print(claims[0][1])    # 5230   (row 0, column 1)
print(claims[2][2])    # approved`,
          pt: `# Cada lista interna representa uma linha de sinistro
sinistro1 = ["Alice",  5230, "aprovado"]
sinistro2 = ["Bob",    1200, "pendente"]
sinistro3 = ["Carlos", 8000, "aprovado"]

# A lista externa armazena todos os sinistros
sinistros = [sinistro1, sinistro2, sinistro3]

# Acesso: sinistros[linha][coluna]
print(sinistros[0])       # ['Alice', 5230, 'aprovado']
print(sinistros[0][0])    # Alice  (linha 0, coluna 0)
print(sinistros[0][1])    # 5230   (linha 0, coluna 1)
print(sinistros[2][2])    # aprovado`,
        }
      },
      { type: 'heading', content: { en: '🐍 Step 2 — loop through nested list', pt: '🐍 Passo 2 — percorra a lista aninhada' } },
      {
        type: 'code',
        code: {
          en: `claims = [
    ["Alice",  5230, "approved"],
    ["Bob",    1200, "pending"],
    ["Carlos", 8000, "approved"]
]

for claim in claims:
    name   = claim[0]
    amount = claim[1]
    status = claim[2]
    print(name, "→ $", amount, "→", status)`,
          pt: `sinistros = [
    ["Alice",  5230, "aprovado"],
    ["Bob",    1200, "pendente"],
    ["Carlos", 8000, "aprovado"]
]

for sinistro in sinistros:
    nome   = sinistro[0]
    valor  = sinistro[1]
    status = sinistro[2]
    print(nome, "→ R$", valor, "→", status)`,
        }
      },
      { type: 'heading', content: { en: '🐍 Step 3 — calculate from nested data', pt: '🐍 Passo 3 — calcule com dados aninhados' } },
      {
        type: 'code',
        code: {
          en: `claims = [
    ["Alice",  5230, "approved"],
    ["Bob",    1200, "pending"],
    ["Carlos", 8000, "approved"]
]

total = 0
for claim in claims:
    if claim[2] == "approved":      # count approved claims only
        total += claim[1]

print("Total approved payout:", total)  # 13230`,
          pt: `sinistros = [
    ["Alice",  5230, "aprovado"],
    ["Bob",    1200, "pendente"],
    ["Carlos", 8000, "aprovado"]
]

total = 0
for sinistro in sinistros:
    if sinistro[2] == "aprovado":      # some apenas os sinistros aprovados
        total += sinistro[1]

print("Total de pagamentos aprovados:", total)  # 13230`,
        }
      },
      {
        type: 'tip',
        content: {
          en: '💡 Shorthand: instead of claim = claims[0] → unpacking!\nclaim_data = ["Alice", 5230, "approved"]\nname, amount, status = claim_data   # assigns all 3 at once',
          pt: '💡 Atalho: ao invés de claim = claims[0] → desempacotamento!\ndados = ["Alice", 5230, "aprovado"]\nnome, valor, status = dados   # atribui os 3 de uma vez'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex9_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to access items in a 2D (nested) list using row and column indexes.\nThe code has 8 lines ready for you. You only need to fill in 3 blanks — marked with ___.\n\nBlank 1 (line 8): Type 1 — "hood" is the second row in the list, so its row index is 1\nBlank 2 (line 9): Type 1 — same row as "hood"\nBlank 3 (line 9): Type 1 — each inner list has [name, value]; the value sits at column index 1\n\nExpected output:\nhood\n2000',
        pt: 'Antes de começar: este exercício ensina como acessar itens em uma lista 2D (aninhada) usando índices de linha e coluna.\nO código tem 8 linhas prontas. Você só precisa preencher 3 lacunas — marcadas com ___.\n\nLacuna 1 (linha 8): Digite 1 — "hood" é a segunda linha da lista, então seu índice de linha é 1\nLacuna 2 (linha 9): Digite 1 — mesma linha que "hood"\nLacuna 3 (linha 9): Digite 1 — cada lista interna tem [nome, valor]; o valor está no índice de coluna 1\n\nSaída esperada:\nhood\n2000'
      },
      starterCode: `damages = [
    ["bumper",  1200],
    ["hood",    2000],
    ["headlight", 800]
]

# Fill in to print: hood and its value 2000
print(damages[___][0])    # row index for "hood"
print(damages[___][___])  # value 2000`,
      hints: [
        { en: 'hood is at index 1 (second row)', pt: 'hood está no índice 1 (segunda linha)' },
        { en: 'The value is in column index 1', pt: 'O valor está na coluna de índice 1' }
      ],
      sampleOutput: { en: 'hood\n2000', pt: 'hood\n2000' }
    },
    {
      id: 'ex9_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe loop, condition, and print logic are already written — your only job is to fill in the 3 inner lists inside claims = [].\n\nEach list must follow the pattern [name, damage, status].\n\nTo match the expected output, use these 3 inner lists:\n["Alice", 5230, "approved"]\n["Bob", 1000, "pending"]  ← Bob should be pending (any damage amount)\n["Carlos", 8000, "approved"]\n\nExpected output:\nAlice → $ 4980\nCarlos → $ 7750\nTotal: 12730\n\nTest your program:\nOnly "approved" rows should print — Bob must be skipped\nTotal must equal 12730 (Alice\'s 4980 + Carlos\'s 7750)',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO loop, a condição e o print já estão escritos — seu único trabalho é preencher as 3 listas internas dentro de claims = [].\n\nCada lista deve seguir o padrão [nome, dano, status].\n\nPara corresponder à saída esperada, use estas 3 listas internas:\n["Alice", 5230, "approved"]\n["Bob", 1000, "pending"]  ← Bob deve ser pending (qualquer valor de dano)\n["Carlos", 8000, "approved"]\n\nSaída esperada:\nAlice → $ 4980\nCarlos → $ 7750\nTotal: 12730\n\nTeste seu programa:\nApenas linhas com status "approved" devem imprimir — Bob deve ser ignorado\nO total deve ser 12730 (4980 de Alice + 7750 de Carlos)'
      },
      starterCode: `# Your nested list here:
claims = [
    # [name, damage, status]
]

total = 0
for claim in claims:
    if claim[2] == "approved":
        payout = claim[1] - 250
        total += payout
        print(claim[0], "→ $", payout)

print("Total:", total)`,
      hints: [
        { en: 'Add 3 inner lists: ["Name", amount, "approved" or "pending"]', pt: 'Adicione 3 listas internas: ["Nome", valor, "approved" ou "pending"]' }
      ],
      sampleOutput: { en: 'Alice → $ 4980\nCarlos → $ 7750\nTotal: 12730', pt: 'Alice → $ 4980\nCarlos → $ 7750\nTotal: 12730' }
    }
  ],

  quiz: [
    {
      id: 'q9_1',
      question: { en: 'data = [["a", 1], ["b", 2]]\nWhat is data[1][0]?', pt: 'data = [["a", 1], ["b", 2]]\nQual é data[1][0]?' },
      options: [
        { en: '"b"', pt: '"b"' },
        { en: '"a"', pt: '"a"' },
        { en: '1', pt: '1' },
        { en: '2', pt: '2' }
      ],
      correctIndex: 0,
      explanation: { en: 'data[1] gets the second inner list ["b", 2]. Then [0] gets the first element: "b".', pt: 'data[1] pega a segunda lista interna ["b", 2]. Depois [0] pega o primeiro elemento: "b".' }
    },
    {
      id: 'q9_2',
      question: { en: 'How many dimensions does a nested list have?', pt: 'Quantas dimensões uma lista aninhada tem?' },
      options: [
        { en: '2 — rows and columns', pt: '2 — linhas e colunas' },
        { en: '1 — just rows', pt: '1 — apenas linhas' },
        { en: '3 — always', pt: '3 — sempre' },
        { en: 'Unlimited', pt: 'Ilimitadas' }
      ],
      correctIndex: 0,
      explanation: { en: 'A list of lists has 2 dimensions: row [i] and column [j]. You can nest deeper but 2D is most common.', pt: 'Uma lista de listas tem 2 dimensões: linha [i] e coluna [j]. Você pode aninhar mais fundo mas 2D é mais comum.' }
    },
    {
      id: 'q9_3',
      question: { en: 'rows = [[1,2],[3,4],[5,6]]\nfor row in rows: print(row[0])\nWhat prints?', pt: 'rows = [[1,2],[3,4],[5,6]]\nfor row in rows: print(row[0])\nO que imprime?' },
      options: [
        { en: '1\n3\n5', pt: '1\n3\n5' },
        { en: '1\n2\n3', pt: '1\n2\n3' },
        { en: '[1,2]\n[3,4]\n[5,6]', pt: '[1,2]\n[3,4]\n[5,6]' },
        { en: '2\n4\n6', pt: '2\n4\n6' }
      ],
      correctIndex: 0,
      explanation: { en: 'Each iteration, row holds one inner list. row[0] always gets the first element of that inner list: 1, 3, 5.', pt: 'Em cada iteração, row guarda uma lista interna. row[0] sempre pega o primeiro elemento daquela lista: 1, 3, 5.' }
    },
    {
      id: 'q9_4',
      question: { en: 'Why use nested lists over simple lists?', pt: 'Por que usar listas aninhadas em vez de simples?' },
      options: [
        { en: 'To store related data grouped together', pt: 'Para armazenar dados relacionados agrupados' },
        { en: 'To save memory', pt: 'Para economizar memória' },
        { en: 'Because Python requires it', pt: 'Porque Python exige' },
        { en: 'No reason — simple lists are always better', pt: 'Sem razão — listas simples são sempre melhores' }
      ],
      correctIndex: 0,
      explanation: { en: 'Nested lists keep related data together. Instead of 3 separate lists for names, amounts, statuses — one nested list holds it all structured.', pt: 'Listas aninhadas mantêm dados relacionados juntos. Em vez de 3 listas separadas para nomes, valores, status — uma lista aninhada guarda tudo estruturado.' }
    }
  ],

  exam: {
    title: { en: 'Claim Spreadsheet', pt: 'Planilha de Sinistros' },
    scenario: {
      en: 'You received a batch of 4 claims as a nested list. Filter only "approved" ones, apply $300 deductible, and report the total payout.',
      pt: 'Você recebeu um lote de 4 sinistros como lista aninhada. Filtre apenas os "approved", aplique R$300 de franquia, e reporte o pagamento total.'
    },
    requirements: {
      en: ['Use the provided nested list', 'Loop through all claims', 'Filter: status == "approved" only', 'Subtract $300 from each approved claim', 'Print each approved client name + payout', 'Print total'],
      pt: ['Use a lista aninhada fornecida', 'Percorra todos os sinistros', 'Filtre: apenas status == "approved"', 'Subtraia R$300 de cada sinistro aprovado', 'Imprima nome + pagamento de cada aprovado', 'Imprima o total']
    },
    starterCode: `claims = [
    ["Alice",  5230, "approved"],
    ["Bob",    1200, "pending"],
    ["Carlos", 8000, "approved"],
    ["Diana",   450, "rejected"]
]

total = 0
for claim in claims:
    if claim[2] == "approved":
        payout = claim[1] - 300
        total += payout
        print(claim[0], "→ $", payout)

print("Total payout: $", total)`,
    testCases: [
      { id: 'tc9_1', description: { en: 'Alice payout = 4930', pt: 'Alice payout = 4930' }, inputs: [], checks: [{ type: 'contains', value: '4930' }], points: 25 },
      { id: 'tc9_2', description: { en: 'Carlos payout = 7700', pt: 'Carlos payout = 7700' }, inputs: [], checks: [{ type: 'contains', value: '7700' }], points: 25 },
      { id: 'tc9_3', description: { en: 'Total = 12630', pt: 'Total = 12630' }, inputs: [], checks: [{ type: 'contains', value: '12630' }], points: 30 },
      { id: 'tc9_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

// ============================================================================
// PHASE 10 — Dicionários
// TEMPLATE B: Conceito Composto
// ============================================================================

export const phase10: Phase = {
  id: 10,
  title: { en: 'Dictionaries', pt: 'Dicionários' },
  description: {
    en: 'Store data with named labels — much clearer than numbered positions.',
    pt: 'Armazene dados com etiquetas nomeadas — muito mais claro que posições numeradas.'
  },
  icon: '📖',
  libraries: [],

  lesson: {
    title: { en: 'Key → Value: The Most Useful Structure', pt: 'Chave → Valor: A Estrutura Mais Útil' },
    blocks: [
      { type: 'heading', content: { en: '🌍 JSON powers the entire internet', pt: '🌍 JSON alimenta toda a internet' } },
      {
        type: 'text',
        content: {
          en: 'When WhatsApp sends you a message, it travels as a dictionary:\n{"sender": "Mom", "text": "dinner ready", "time": "19:32"}\n\nEvery API response, every database record, every config file — dictionaries. The whole web runs on them.',
          pt: 'Quando o WhatsApp te manda uma mensagem, ela viaja como dicionário:\n{"remetente": "Mãe", "texto": "jantar pronto", "hora": "19:32"}\n\nToda resposta de API, todo registro de banco de dados, todo arquivo de config — dicionários. A web inteira roda com eles.'
        }
      },
      { type: 'heading', content: { en: '🧩 A physical dictionary', pt: '🧩 Um dicionário físico' } },
      {
        type: 'text',
        content: {
          en: 'In a real dictionary:\nWord "apple" → Definition "a round fruit"\n\nIn Python dict:\nKey "name" → Value "Alice"\nKey "damage" → Value 5230\n\nInstead of asking "what\'s at position 0?", you ask "what\'s the damage?" Much more readable.',
          pt: 'Num dicionário físico:\nPalavra "maçã" → Definição "fruta redonda"\n\nEm dict Python:\nChave "nome" → Valor "Alice"\nChave "dano" → Valor 5230\n\nEm vez de perguntar "o que está na posição 0?", você pergunta "qual é o dano?". Muito mais legível.'
        }
      },
      { type: 'heading', content: { en: '🐍 Step 1 — create a dictionary', pt: '🐍 Passo 1 — crie um dicionário' } },
      {
        type: 'code',
        code: `# Dictionaries use curly braces { }
# Format: {"key": value, "key": value}
claim = {
    "id":     2501,
    "client": "Alice Costa",
    "damage": 5230,
    "status": "approved"
}

# Access by KEY (not position!)
print(claim["client"])   # Alice Costa
print(claim["damage"])   # 5230
print(claim["status"])   # approved`
      },
      { type: 'heading', content: { en: '🐍 Step 2 — add, update, delete', pt: '🐍 Passo 2 — adicionar, atualizar, deletar' } },
      {
        type: 'code',
        code: {
          en: `claim = {"id": 2501, "damage": 5230}

# Add a new key
claim["deductible"] = 250

# Update an existing key
claim["damage"] = 5500

# Delete a key
del claim["deductible"]

print(claim)   # {"id": 2501, "damage": 5500}`,
          pt: `sinistro = {"id": 2501, "dano": 5230}

# Adicione uma nova chave
sinistro["franquia"] = 250

# Atualize uma chave existente
sinistro["dano"] = 5500

# Exclua uma chave
del sinistro["franquia"]

print(sinistro)   # {"id": 2501, "dano": 5500}`
        }
      },
      { type: 'heading', content: { en: '🐍 Step 3 — loop through a dictionary', pt: '🐍 Passo 3 — percorra um dicionário' } },
      {
        type: 'code',
        code: `claim = {"id": 2501, "client": "Alice", "damage": 5230}

# Loop through keys
for key in claim:
    print(key, ":", claim[key])

# Or use .items() for key+value together
for key, value in claim.items():
    print(key, "→", value)`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Use .get() to safely access a key that might not exist:\nclaim.get("notes", "no notes")  → returns "no notes" if key missing\nWithout .get(), a missing key causes a KeyError crash.',
          pt: '💡 Use .get() para acessar com segurança uma chave que pode não existir:\nclaim.get("notas", "sem notas")  → retorna "sem notas" se chave faltar\nSem .get(), uma chave ausente causa crash KeyError.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex10_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to access dictionary values using exact key names.\nThe code has 8 lines ready for you. You only need to fill in 3 blanks — marked with ___.\n\nBlank 1 (line 7): Type client — that is the exact key name used in the dictionary\nBlank 2 (line 8): Type damage — to read the damage amount\nBlank 3 (line 8): Type deductible — to subtract the deductible from damage\n\nExpected output:\nMaria Lima\nPayout: $ 4500',
        pt: 'Antes de começar: este exercício ensina como acessar valores de dicionário usando nomes de chave exatos.\nO código tem 8 linhas prontas. Você só precisa preencher 3 lacunas — marcadas com ___.\n\nLacuna 1 (linha 7): Digite client — esse é o nome exato da chave usada no dicionário\nLacuna 2 (linha 8): Digite damage — para ler o valor do dano\nLacuna 3 (linha 8): Digite deductible — para subtrair a franquia do dano\n\nSaída esperada:\nMaria Lima\nPayout: $ 4500'
      },
      starterCode: `claim = {
    "client":     "Maria Lima",
    "damage":     4800,
    "deductible": 300
}

# Fill in the key names:
print(claim["___"])                         # print client name
payout = claim["___"] - claim["___"]        # damage - deductible
print("Payout: $", payout)`,
      hints: [
        { en: 'Key names are exactly as written in the dict', pt: 'Nomes de chave são exatamente como escritos no dict' }
      ],
      sampleOutput: { en: 'Maria Lima\nPayout: $ 4500', pt: 'Maria Lima\nPayout: $ 4500' }
    },
    {
      id: 'ex10_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe print loop is already provided. You need to fill in two parts:\n\nPart 1 — Fill the claim dictionary with 6 key-value pairs:\n    "id": 3001\n    "client": "João"\n    "city": "Recife"\n    "damage": 6000\n    "deductible": 400\n    "status": "approved"\n\nPart 2 — Complete the payout line:\n    claim["payout"] = claim["damage"] - claim["deductible"]\n\nExpected output:\nid : 3001\nclient : João\ncity : Recife\ndamage : 6000\ndeductible : 400\nstatus : approved\npayout : 5600\n\nTest your program:\nChanging damage to 7000 and deductible to 500 should print payout : 6500',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO loop de impressão já está fornecido. Você precisa preencher duas partes:\n\nParte 1 — Preencha o dicionário claim com 6 pares chave-valor:\n    "id": 3001\n    "client": "João"\n    "city": "Recife"\n    "damage": 6000\n    "deductible": 400\n    "status": "approved"\n\nParte 2 — Complete a linha de payout:\n    claim["payout"] = claim["damage"] - claim["deductible"]\n\nSaída esperada:\nid : 3001\nclient : João\ncity : Recife\ndamage : 6000\ndeductible : 400\nstatus : approved\npayout : 5600\n\nTeste seu programa:\nAlterar damage para 7000 e deductible para 500 deve imprimir payout : 6500'
      },
      starterCode: `# Build your complete claim dict:
claim = {

}

# Calculate and add payout:
claim["payout"] = 

# Print everything:
for key, value in claim.items():
    print(key, ":", value)`,
      hints: [
        { en: 'Start with: claim = {"id": 3001, "client": "...", ...}', pt: 'Comece com: claim = {"id": 3001, "client": "...", ...}' },
        { en: 'claim["payout"] = claim["damage"] - claim["deductible"]', pt: 'claim["payout"] = claim["damage"] - claim["deductible"]' }
      ],
      sampleOutput: { en: 'id : 3001\nclient : João\ncity : Recife\ndamage : 6000\ndeductible : 400\nstatus : approved\npayout : 5600', pt: 'id : 3001\nclient : João\ncity : Recife\ndamage : 6000\ndeductible : 400\nstatus : approved\npayout : 5600' }
    }
  ],

  quiz: [
    {
      id: 'q10_1',
      question: { en: 'd = {"name": "Alice", "age": 30}\nHow to get "Alice"?', pt: 'd = {"name": "Alice", "age": 30}\nComo obter "Alice"?' },
      options: [
        { en: 'd["name"]', pt: 'd["name"]' },
        { en: 'd[0]', pt: 'd[0]' },
        { en: 'd.name', pt: 'd.name' },
        { en: 'd(name)', pt: 'd(name)' }
      ],
      correctIndex: 0,
      explanation: { en: 'Dict values are accessed by KEY in square brackets: d["name"]. Not by position — that\'s what makes dicts special.', pt: 'Valores do dict são acessados pela CHAVE em colchetes: d["name"]. Não por posição — é isso que torna dicts especiais.' }
    },
    {
      id: 'q10_2',
      question: { en: 'How to add a new key "city" = "Toronto" to dict d?', pt: 'Como adicionar nova chave "city" = "Toronto" ao dict d?' },
      options: [
        { en: 'd["city"] = "Toronto"', pt: 'd["city"] = "Toronto"' },
        { en: 'd.add("city", "Toronto")', pt: 'd.add("city", "Toronto")' },
        { en: 'd.city = "Toronto"', pt: 'd.city = "Toronto"' },
        { en: 'append(d, "city", "Toronto")', pt: 'append(d, "city", "Toronto")' }
      ],
      correctIndex: 0,
      explanation: { en: 'Assigning to a new key creates it: d["city"] = "Toronto". Same syntax as updating an existing key.', pt: 'Atribuir a uma nova chave a cria: d["city"] = "Toronto". Mesma sintaxe de atualizar uma chave existente.' }
    },
    {
      id: 'q10_3',
      question: { en: 'What does .get("key", default) do?', pt: 'O que .get("chave", padrão) faz?' },
      options: [
        { en: 'Returns value or default if key missing', pt: 'Retorna o valor ou padrão se chave faltar' },
        { en: 'Creates the key if missing', pt: 'Cria a chave se faltar' },
        { en: 'Same as d["key"] exactly', pt: 'Igual a d["chave"] exatamente' },
        { en: 'Deletes the key', pt: 'Deleta a chave' }
      ],
      correctIndex: 0,
      explanation: { en: '.get() is safe: if the key exists, return its value. If not, return the default instead of crashing.', pt: '.get() é seguro: se a chave existe, retorna o valor. Se não, retorna o padrão em vez de quebrar.' }
    },
    {
      id: 'q10_4',
      question: { en: 'Can a dictionary have duplicate keys?', pt: 'Um dicionário pode ter chaves duplicadas?' },
      options: [
        { en: 'No — last assignment wins', pt: 'Não — a última atribuição vence' },
        { en: 'Yes — both values are kept', pt: 'Sim — ambos os valores são mantidos' },
        { en: 'Yes — Python stores them both', pt: 'Sim — Python armazena os dois' },
        { en: 'Causes an error', pt: 'Causa um erro' }
      ],
      correctIndex: 0,
      explanation: { en: 'Keys must be unique. If you assign the same key twice, the second value overwrites the first silently.', pt: 'Chaves devem ser únicas. Se atribuir a mesma chave duas vezes, o segundo valor sobrescreve o primeiro silenciosamente.' }
    }
  ],

  exam: {
    title: { en: 'Complete Claim Record', pt: 'Registro Completo de Sinistro' },
    scenario: {
      en: 'Build a full claim record as a dictionary, calculate the payout, add it to the dict, and print a formatted summary.',
      pt: 'Construa um registro completo de sinistro como dicionário, calcule o pagamento, adicione-o ao dict e imprima um resumo formatado.'
    },
    requirements: {
      en: ['Create dict with: id, client, damage, deductible, status', 'Calculate payout = damage - deductible', 'Add payout to dict', 'Print: client, damage, deductible, payout using dict access'],
      pt: ['Crie dict com: id, cliente, dano, franquia, status', 'Calcule pagamento = dano - franquia', 'Adicione pagamento ao dict', 'Imprima: cliente, dano, franquia, pagamento usando acesso ao dict']
    },
    starterCode: `claim = {
    "id":         4001,
    "client":     "Fernanda Souza",
    "damage":     7500,
    "deductible": 400,
    "status":     "approved"
}

claim["payout"] = claim["damage"] - claim["deductible"]

print("Client:",     claim["client"])
print("Damage: $",   claim["damage"])
print("Deductible: $", claim["deductible"])
print("Payout: $",   claim["payout"])`,
    testCases: [
      { id: 'tc10_1', description: { en: 'Shows client name', pt: 'Mostra nome do cliente' }, inputs: [], checks: [{ type: 'contains', value: 'Fernanda' }], points: 20 },
      { id: 'tc10_2', description: { en: 'Payout = 7100', pt: 'Pagamento = 7100' }, inputs: [], checks: [{ type: 'contains', value: '7100' }], points: 40 },
      { id: 'tc10_3', description: { en: 'Shows deductible', pt: 'Mostra franquia' }, inputs: [], checks: [{ type: 'contains', value: '400' }], points: 20 },
      { id: 'tc10_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

// ============================================================================
// PHASE 11 — Lista de Dicionários
// TEMPLATE B: Conceito Composto
// ============================================================================

export const phase11: Phase = {
  id: 11,
  title: { en: 'List of Dictionaries', pt: 'Lista de Dicionários' },
  description: {
    en: 'The structure behind every database table, API response, and app backend.',
    pt: 'A estrutura por trás de toda tabela de banco de dados, resposta de API e backend de app.'
  },
  icon: '🗃️',
  libraries: [],

  lesson: {
    title: { en: 'Real-World Data Structure', pt: 'Estrutura de Dados do Mundo Real' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Every API response is a list of dicts', pt: '🌍 Toda resposta de API é lista de dicts' } },
      {
        type: 'text',
        content: {
          en: 'When an app calls an API (iFood, nubank, Mercado Livre), the response always looks like this:\n[\n  {"id": 1, "product": "pizza", "price": 45.90},\n  {"id": 2, "product": "sushi", "price": 62.00}\n]\n\nList of dicts = the universal format for structured data.',
          pt: 'Quando um app faz uma chamada de API (iFood, nubank, Mercado Livre), a resposta sempre parece assim:\n[\n  {"id": 1, "produto": "pizza", "preco": 45.90},\n  {"id": 2, "produto": "sushi", "preco": 62.00}\n]\n\nLista de dicts = o formato universal de dados estruturados.'
        }
      },
      { type: 'heading', content: { en: '🧩 A stack of filled-in forms', pt: '🧩 Uma pilha de formulários preenchidos' } },
      {
        type: 'text',
        content: {
          en: 'Imagine a stack of claim forms on a desk.\nEach form (dict) has the same fields: name, damage, status.\nThe stack (list) holds all the forms together.\n\nYou can flip through them, filter only approved ones, or add a new form on top.',
          pt: 'Imagine uma pilha de formulários de sinistros na mesa.\nCada formulário (dict) tem os mesmos campos: nome, dano, status.\nA pilha (lista) mantém todos os formulários juntos.\n\nVocê pode folheá-los, filtrar apenas os aprovados, ou adicionar um novo formulário no topo.'
        }
      },
      { type: 'heading', content: { en: '🐍 Step 1 — build the structure', pt: '🐍 Passo 1 — construa a estrutura' } },
      {
        type: 'code',
        code: `claims = [
    {"id": 1, "client": "Alice",  "damage": 5230, "status": "approved"},
    {"id": 2, "client": "Bob",    "damage": 1200, "status": "pending"},
    {"id": 3, "client": "Carlos", "damage": 8000, "status": "approved"}
]

# Access one record
print(claims[0])                   # full first dict
print(claims[0]["client"])         # Alice`
      },
      { type: 'heading', content: { en: '🐍 Step 2 — loop and read', pt: '🐍 Passo 2 — percorra e leia' } },
      {
        type: 'code',
        code: `for claim in claims:
    print(claim["client"], "→ $", claim["damage"])`
      },
      { type: 'heading', content: { en: '🐍 Step 3 — filter and calculate', pt: '🐍 Passo 3 — filtre e calcule' } },
      {
        type: 'code',
        code: `total = 0
approved_count = 0

for claim in claims:
    if claim["status"] == "approved":
        payout = claim["damage"] - 250
        total += payout
        approved_count += 1
        print("✅", claim["client"], "→ $", payout)

print(f"Total: \${total} across {approved_count} claims")`
      }
    ]
  },

  exercises: [
    {
      id: 'ex11_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to loop through a list of dictionaries and access values by key.\nThe code has 7 lines ready for you. You only need to fill in 2 blanks — marked with ___.\n\nBlank 1 (line 7): Type client — that is the exact key name used in each dictionary\nBlank 2 (line 7): Type damage — to print the damage amount\n\nExpected output:\nAlice → $ 5230\nBob → $ 1200\nCarlos → $ 8000',
        pt: 'Antes de começar: este exercício ensina como percorrer uma lista de dicionários e acessar valores por chave.\nO código tem 7 linhas prontas. Você só precisa preencher 2 lacunas — marcadas com ___.\n\nLacuna 1 (linha 7): Digite client — esse é o nome exato da chave em cada dicionário\nLacuna 2 (linha 7): Digite damage — para imprimir o valor do dano\n\nSaída esperada:\nAlice → $ 5230\nBob → $ 1200\nCarlos → $ 8000'
      },
      starterCode: `claims = [
    {"client": "Alice",  "damage": 5230},
    {"client": "Bob",    "damage": 1200},
    {"client": "Carlos", "damage": 8000}
]

for claim in claims:
    print(claim["___"], "→ $", claim["___"])`,
      hints: [
        { en: 'Use the exact key names from the dictionaries', pt: 'Use os nomes de chave exatos dos dicionários' }
      ],
      sampleOutput: { en: 'Alice → $ 5230\nBob → $ 1200\nCarlos → $ 8000', pt: 'Alice → $ 5230\nBob → $ 1200\nCarlos → $ 8000' }
    },
    {
      id: 'ex11_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe loop and output logic are already written — your only job is to add 4 claim dictionaries inside claims = [].\n\nEach dictionary must have these 4 keys: id, client, damage, status\n\nTo match the expected output, use:\n    {"id": 1, "client": "Alice",  "damage": 5230, "status": "approved"}\n    {"id": 2, "client": "Bob",    "damage": 1000, "status": "pending"}\n    {"id": 3, "client": "Carlos", "damage": 8000, "status": "approved"}\n    {"id": 4, "client": "Diana",  "damage": 500,  "status": "pending"}\n\nExpected output:\n✅ Alice → $ 4980\n⏳ Bob → PENDING\n✅ Carlos → $ 7750\n⏳ Diana → PENDING\nApproved: 2 | Pending: 2\n\nTest your program:\nIf you change Bob\'s status to "approved" with damage 1000, it should print ✅ Bob → $ 750',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO loop e a lógica de saída já estão escritos — seu único trabalho é adicionar 4 dicionários de sinistro dentro de claims = [].\n\nCada dicionário deve ter estas 4 chaves: id, client, damage, status\n\nPara corresponder à saída esperada, use:\n    {"id": 1, "client": "Alice",  "damage": 5230, "status": "approved"}\n    {"id": 2, "client": "Bob",    "damage": 1000, "status": "pending"}\n    {"id": 3, "client": "Carlos", "damage": 8000, "status": "approved"}\n    {"id": 4, "client": "Diana",  "damage": 500,  "status": "pending"}\n\nSaída esperada:\n✅ Alice → $ 4980\n⏳ Bob → PENDING\n✅ Carlos → $ 7750\n⏳ Diana → PENDING\nApproved: 2 | Pending: 2\n\nTeste seu programa:\nSe você mudar o status do Bob para "approved" com damage 1000, deve imprimir ✅ Bob → $ 750'
      },
      starterCode: `claims = [
    # Add 4 dicts here
]

approved = 0
pending = 0

for claim in claims:
    if claim["status"] == "approved":
        payout = claim["damage"] - 250
        print("✅", claim["client"], "→ $", payout)
        approved += 1
    else:
        print("⏳", claim["client"], "→ PENDING")
        pending += 1

print("Approved:", approved, "| Pending:", pending)`,
      hints: [
        { en: 'Each dict needs: {"id": 1, "client": "Name", "damage": 1000, "status": "approved"}', pt: 'Cada dict precisa: {"id": 1, "client": "Nome", "damage": 1000, "status": "approved"}' }
      ],
      sampleOutput: { en: '✅ Alice → $ 4980\n⏳ Bob → PENDING\n✅ Carlos → $ 7750\n⏳ Diana → PENDING\nApproved: 2 | Pending: 2', pt: '✅ Alice → $ 4980\n⏳ Bob → PENDENTE\n✅ Carlos → $ 7750\n⏳ Diana → PENDENTE\nApproved: 2 | Pending: 2' }
    }
  ],

  quiz: [
    {
      id: 'q11_1',
      question: { en: 'What is a list of dictionaries?', pt: 'O que é uma lista de dicionários?' },
      options: [
        { en: 'A list where each item is a dict', pt: 'Uma lista onde cada item é um dict' },
        { en: 'A dictionary with list values', pt: 'Um dicionário com valores de lista' },
        { en: 'A nested list with strings', pt: 'Uma lista aninhada com strings' },
        { en: 'Two separate structures', pt: 'Duas estruturas separadas' }
      ],
      correctIndex: 0,
      explanation: { en: '[{"a": 1}, {"b": 2}] — a list [] containing dicts {} as its items. The universal data format.', pt: '[{"a": 1}, {"b": 2}] — uma lista [] contendo dicts {} como itens. O formato universal de dados.' }
    },
    {
      id: 'q11_2',
      question: { en: 'data = [{"x": 10}, {"x": 20}]\nTo get 20?', pt: 'data = [{"x": 10}, {"x": 20}]\nPara obter 20?' },
      options: [
        { en: 'data[1]["x"]', pt: 'data[1]["x"]' },
        { en: 'data["x"][1]', pt: 'data["x"][1]' },
        { en: 'data[1][0]', pt: 'data[1][0]' },
        { en: 'data.x[1]', pt: 'data.x[1]' }
      ],
      correctIndex: 0,
      explanation: { en: 'data[1] gets the second dict {"x": 20}. Then ["x"] gets the value 20.', pt: 'data[1] pega o segundo dict {"x": 20}. Depois ["x"] pega o valor 20.' }
    },
    {
      id: 'q11_3',
      question: { en: 'How to add a new record to a list of dicts?', pt: 'Como adicionar um novo registro a lista de dicts?' },
      options: [
        { en: 'list.append({"key": "value"})', pt: 'lista.append({"chave": "valor"})' },
        { en: 'list.add({"key": "value"})', pt: 'lista.add({"chave": "valor"})' },
        { en: 'list + {"key": "value"}', pt: 'lista + {"chave": "valor"}' },
        { en: 'list.insert({"key": "value"})', pt: 'lista.insert({"chave": "valor"})' }
      ],
      correctIndex: 0,
      explanation: { en: '.append() adds any item — including a dict — to the end of a list.', pt: '.append() adiciona qualquer item — incluindo um dict — ao final de uma lista.' }
    },
    {
      id: 'q11_4',
      question: { en: 'Why use list of dicts instead of nested lists?', pt: 'Por que usar lista de dicts em vez de listas aninhadas?' },
      options: [
        { en: 'Named keys are clearer than numbered indexes', pt: 'Chaves nomeadas são mais claras que índices numerados' },
        { en: 'Dicts use less memory', pt: 'Dicts usam menos memória' },
        { en: 'Python requires it for APIs', pt: 'Python exige para APIs' },
        { en: 'No difference', pt: 'Sem diferença' }
      ],
      correctIndex: 0,
      explanation: { en: 'claim["damage"] is much clearer than claim[1]. Named keys make code readable and self-documenting.', pt: 'claim["damage"] é muito mais claro que claim[1]. Chaves nomeadas tornam o código legível e auto-documentado.' }
    }
  ],

  exam: {
    title: { en: 'Claims Dashboard', pt: 'Dashboard de Sinistros' },
    scenario: {
      en: 'Process a full claims batch. Calculate payouts for approved claims, skip others, and report total and count.',
      pt: 'Processe um lote completo de sinistros. Calcule pagamentos dos aprovados, pule os outros, e reporte total e contagem.'
    },
    requirements: {
      en: ['Loop through all 5 claims', 'Process only "approved" ones', 'Apply $250 deductible', 'Print each approved claim summary', 'Print total payout and count'],
      pt: ['Percorra todos os 5 sinistros', 'Processe apenas os "approved"', 'Aplique R$250 de franquia', 'Imprima resumo de cada aprovado', 'Imprima total e contagem']
    },
    starterCode: `claims = [
    {"id": 1, "client": "Alice",   "damage": 5230, "status": "approved"},
    {"id": 2, "client": "Bob",     "damage": 1200, "status": "pending"},
    {"id": 3, "client": "Carlos",  "damage": 8000, "status": "approved"},
    {"id": 4, "client": "Diana",   "damage":  450, "status": "rejected"},
    {"id": 5, "client": "Eduardo", "damage": 3100, "status": "approved"}
]

total = 0
count = 0

for claim in claims:
    if claim["status"] == "approved":
        payout = claim["damage"] - 250
        total += payout
        count += 1
        print("✅", claim["client"], "→ $", payout)

print("Total: $", total, "| Claims:", count)`,
    testCases: [
      { id: 'tc11_1', description: { en: 'Alice payout 4980', pt: 'Alice pagamento 4980' }, inputs: [], checks: [{ type: 'contains', value: '4980' }], points: 20 },
      { id: 'tc11_2', description: { en: 'Carlos payout 7750', pt: 'Carlos pagamento 7750' }, inputs: [], checks: [{ type: 'contains', value: '7750' }], points: 20 },
      { id: 'tc11_3', description: { en: 'Eduardo payout 2850', pt: 'Eduardo pagamento 2850' }, inputs: [], checks: [{ type: 'contains', value: '2850' }], points: 20 },
      { id: 'tc11_4', description: { en: 'Total = 15580', pt: 'Total = 15580' }, inputs: [], checks: [{ type: 'contains', value: '15580' }], points: 25 },
      { id: 'tc11_5', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 15 }
    ]
  }
}

// ============================================================================
// PHASE 12 — List Comprehension
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase12: Phase = {
  id: 12,
  title: { en: 'List Comprehension', pt: 'Compreensão de Listas' },
  description: {
    en: 'Transform or filter a list in a single, readable line.',
    pt: 'Transforme ou filtre uma lista em uma única linha legível.'
  },
  icon: '⚡',
  libraries: [],

  lesson: {
    title: { en: 'One Line Instead of Five', pt: 'Uma Linha em Vez de Cinco' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Data scientists use it constantly', pt: '🌍 Cientistas de dados usam isso constantemente' } },
      {
        type: 'text',
        content: {
          en: 'Data scientists at Google and Netflix transform millions of records using list comprehension:\n"Give me all claims over $5k, with deductible applied, as a new list"\n— One line. Instant. No loop required.',
          pt: 'Cientistas de dados no Google e Netflix transformam milhões de registros com list comprehension:\n"Me dê todos os sinistros acima de R$5k, com franquia aplicada, como nova lista"\n— Uma linha. Instantâneo. Sem loop necessário.'
        }
      },
      { type: 'heading', content: { en: '🧩 An automatic filter on a conveyor belt', pt: '🧩 Um filtro automático na esteira' } },
      {
        type: 'text',
        content: {
          en: 'Normal loop = worker that picks each item, checks it, puts it in a new box.\nList comprehension = automated machine that does the same in one step.\n\nSame result, much shorter code.',
          pt: 'Loop normal = trabalhador que pega cada item, verifica, coloca numa nova caixa.\nList comprehension = máquina automatizada que faz o mesmo em um passo.\n\nMesmo resultado, código muito mais curto.'
        }
      },
      { type: 'heading', content: { en: '🐍 Before vs After', pt: '🐍 Antes vs Depois' } },
      {
        type: 'code',
        code: `damages = [1200, 4500, 8000, 250, 3100]

# BEFORE: 4 lines with a loop
payouts = []
for d in damages:
    payouts.append(d - 250)

# AFTER: 1 line with comprehension
payouts = [d - 250 for d in damages]

print(payouts)  # [950, 4250, 7750, 0, 2850]`
      },
      { type: 'heading', content: { en: '🐍 Add a filter with IF', pt: '🐍 Adicione filtro com IF' } },
      {
        type: 'code',
        code: `damages = [1200, 4500, 8000, 250, 3100]

# Only claims over $1000
big_claims = [d for d in damages if d > 1000]
print(big_claims)   # [1200, 4500, 8000, 3100]

# Apply deductible to big claims only
payouts = [d - 250 for d in damages if d > 1000]
print(payouts)      # [950, 4250, 7750, 2850]`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Anatomy: [EXPRESSION for ITEM in LIST if CONDITION]\n• EXPRESSION = what to do with each item\n• ITEM = loop variable\n• LIST = source list\n• if CONDITION = optional filter',
          pt: '💡 Anatomia: [EXPRESSÃO for ITEM in LISTA if CONDIÇÃO]\n• EXPRESSÃO = o que fazer com cada item\n• ITEM = variável do loop\n• LISTA = lista de origem\n• if CONDIÇÃO = filtro opcional'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex12_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to write a list comprehension to transform every item in a list.\nThe code has 5 lines ready for you. You only need to fill in 1 blank — marked with ___.\n\nBlank 1 (line 5): Type d - 300 — this is the expression applied to each element d in damages\n\nExpected output:\n[1700, 5200, 900, 7700, 600]',
        pt: 'Antes de começar: este exercício ensina como escrever uma list comprehension para transformar cada item de uma lista.\nO código tem 5 linhas prontas. Você só precisa preencher 1 lacuna — marcada com ___.\n\nLacuna 1 (linha 5): Digite d - 300 — essa é a expressão aplicada a cada elemento d em damages\n\nSaída esperada:\n[1700, 5200, 900, 7700, 600]'
      },
      starterCode: `damages = [2000, 5500, 1200, 8000, 900]

# Apply $300 deductible to ALL damages:
payouts = [___ for d in damages]

print(payouts)`,
      hints: [
        { en: 'The expression should be: d - 300', pt: 'A expressão deve ser: d - 300' }
      ],
      sampleOutput: { en: '[1700, 5200, 900, 7700, 600]', pt: '[1700, 5200, 900, 7700, 600]' }
    },
    {
      id: 'ex12_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe damages list and print statements are already provided. You need to fill in two comprehension lines.\n\nLine for all_payouts: all_payouts = [d - 200 for d in damages]\nLine for big_payouts: big_payouts = [d - 200 for d in damages if d > 2000]\n\nExpected output:\nAll: [1300, 4000, 600, 5800, 2300, 150]\nBig only: [4000, 5800, 2300]\n\nTest your program:\nThe "if d > 2000" filter should exclude values 1500, 800, and 350 from big_payouts',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nA lista de danos e os prints já estão fornecidos. Você precisa preencher duas linhas de comprehension.\n\nLinha para all_payouts: all_payouts = [d - 200 for d in damages]\nLinha para big_payouts: big_payouts = [d - 200 for d in damages if d > 2000]\n\nSaída esperada:\nAll: [1300, 4000, 600, 5800, 2300, 150]\nBig only: [4000, 5800, 2300]\n\nTeste seu programa:\nO filtro "if d > 2000" deve excluir os valores 1500, 800 e 350 de big_payouts'
      },
      starterCode: `damages = [1500, 4200, 800, 6000, 2500, 350]

# 1. All with deductible:
all_payouts = 

# 2. Only > $2000 with deductible:
big_payouts = 

print("All:", all_payouts)
print("Big only:", big_payouts)`,
      hints: [
        { en: 'Comprehension 1: [d - 200 for d in damages]', pt: 'Comprehension 1: [d - 200 for d in damages]' },
        { en: 'Comprehension 2: [d - 200 for d in damages if d > 2000]', pt: 'Comprehension 2: [d - 200 for d in damages if d > 2000]' }
      ],
      sampleOutput: { en: 'All: [1300, 4000, 600, 5800, 2300, 150]\nBig only: [4000, 5800, 2300]', pt: 'All: [1300, 4000, 600, 5800, 2300, 150]\nBig only: [4000, 5800, 2300]' }
    }
  ],

  quiz: [
    {
      id: 'q12_1',
      question: { en: '[x * 2 for x in [1,2,3]] → result?', pt: '[x * 2 for x in [1,2,3]] → resultado?' },
      options: [
        { en: '[2, 4, 6]', pt: '[2, 4, 6]' },
        { en: '[1, 2, 3]', pt: '[1, 2, 3]' },
        { en: '6', pt: '6' },
        { en: '[2,2,2]', pt: '[2,2,2]' }
      ],
      correctIndex: 0,
      explanation: { en: 'For each x in [1,2,3]: 1*2=2, 2*2=4, 3*2=6. Result: [2, 4, 6].', pt: 'Para cada x em [1,2,3]: 1*2=2, 2*2=4, 3*2=6. Resultado: [2, 4, 6].' }
    },
    {
      id: 'q12_2',
      question: { en: '[x for x in [1,2,3,4] if x > 2] → result?', pt: '[x for x in [1,2,3,4] if x > 2] → resultado?' },
      options: [
        { en: '[3, 4]', pt: '[3, 4]' },
        { en: '[1, 2]', pt: '[1, 2]' },
        { en: '[1, 2, 3, 4]', pt: '[1, 2, 3, 4]' },
        { en: '2', pt: '2' }
      ],
      correctIndex: 0,
      explanation: { en: 'The if filters items. Only 3 and 4 pass the x > 2 condition.', pt: 'O if filtra os itens. Apenas 3 e 4 passam na condição x > 2.' }
    },
    {
      id: 'q12_3',
      question: { en: 'What does list comprehension ALWAYS produce?', pt: 'O que list comprehension SEMPRE produz?' },
      options: [
        { en: 'A new list', pt: 'Uma nova lista' },
        { en: 'Modifies the original list', pt: 'Modifica a lista original' },
        { en: 'A single value', pt: 'Um único valor' },
        { en: 'A dictionary', pt: 'Um dicionário' }
      ],
      correctIndex: 0,
      explanation: { en: 'List comprehension always creates and returns a NEW list. The original list is never modified.', pt: 'List comprehension sempre cria e retorna uma NOVA lista. A lista original nunca é modificada.' }
    },
    {
      id: 'q12_4',
      question: { en: 'When should you prefer comprehension over a regular loop?', pt: 'Quando preferir comprehension sobre loop normal?' },
      options: [
        { en: 'When transforming or filtering a list in one step', pt: 'Quando transformar ou filtrar uma lista em um passo' },
        { en: 'Always — comprehension is always better', pt: 'Sempre — comprehension é sempre melhor' },
        { en: 'Never — loops are clearer', pt: 'Nunca — loops são mais claros' },
        { en: 'Only for numbers', pt: 'Apenas para números' }
      ],
      correctIndex: 0,
      explanation: { en: 'Comprehension shines for transform/filter. For complex logic with multiple steps, a regular for loop is clearer.', pt: 'Comprehension brilha para transformar/filtrar. Para lógica complexa com múltiplos passos, um for loop normal é mais claro.' }
    }
  ],

  exam: {
    title: { en: 'Bulk Claim Transformer', pt: 'Transformador em Massa' },
    scenario: {
      en: 'Apply business rules to a batch of damages using comprehensions. Fast, clean, one line each.',
      pt: 'Aplique regras de negócio a um lote de danos usando comprehensions. Rápido, limpo, uma linha cada.'
    },
    requirements: {
      en: ['all_payouts: apply $250 deductible to ALL', 'big_payouts: only damages > $3000, with deductible', 'client_labels: list of strings like "Client #1: $4980"', 'Print all 3 results'],
      pt: ['all_payouts: aplique R$250 a TODOS', 'big_payouts: apenas danos > R$3000, com franquia', 'client_labels: lista de strings como "Cliente #1: R$4980"', 'Imprima os 3 resultados']
    },
    starterCode: `damages = [1200, 4500, 8000, 650, 3100, 9200]

all_payouts   = [d - 250 for d in damages]
big_payouts   = [d - 250 for d in damages if d > 3000]
client_labels = [f"Client #{i+1}: \${damages[i]-250}" for i in range(len(damages))]

print(all_payouts)
print(big_payouts)
print(client_labels)`,
    testCases: [
      { id: 'tc12_1', description: { en: 'all_payouts has 950', pt: 'all_payouts tem 950' }, inputs: [], checks: [{ type: 'contains', value: '950' }], points: 25 },
      { id: 'tc12_2', description: { en: 'big_payouts has 4250', pt: 'big_payouts tem 4250' }, inputs: [], checks: [{ type: 'contains', value: '4250' }], points: 25 },
      { id: 'tc12_3', description: { en: 'client_labels produced', pt: 'client_labels produzido' }, inputs: [], checks: [{ type: 'contains', value: 'Client' }], points: 25 },
      { id: 'tc12_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 25 }
    ]
  }
}

// ============================================================================
// PHASE 13 — Criando Funções
// TEMPLATE B: Conceito Composto
// ============================================================================

export const phase13: Phase = {
  id: 13,
  title: { en: 'Creating Functions', pt: 'Criando Funções' },
  description: {
    en: 'Write code once, reuse it everywhere — the core of all software.',
    pt: 'Escreva código uma vez, reutilize em qualquer lugar — o núcleo de todo software.'
  },
  icon: '🔧',
  libraries: [],

  lesson: {
    title: { en: 'Functions: Your Reusable Tools', pt: 'Funções: Suas Ferramentas Reutilizáveis' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Functions are why software scales', pt: '🌍 Funções são o motivo pelo qual software escala' } },
      {
        type: 'text',
        content: {
          en: 'The payment function at Nubank is called millions of times a day.\nThey wrote it ONCE. Then call it for every single transaction.\n\nWithout functions, they\'d have to copy-paste the same code millions of times. Functions = the most important concept in all of programming.',
          pt: 'A função de pagamento do Nubank é chamada milhões de vezes por dia.\nEles a escreveram UMA VEZ. Depois chamam para cada transação.\n\nSem funções, teriam que copiar e colar o mesmo código milhões de vezes. Funções = o conceito mais importante de toda a programação.'
        }
      },
      { type: 'heading', content: { en: '🧩 A recipe card', pt: '🧩 Uma ficha de receita' } },
      {
        type: 'text',
        content: {
          en: 'A recipe card for chocolate cake:\n1. You write it ONCE\n2. You use it whenever you want to make a cake\n3. You can make it with different ingredients each time\n\nA function = a recipe card for your code.\nWrite once. Call whenever you need. Change the ingredients (parameters) each time.',
          pt: 'Uma ficha de receita de bolo de chocolate:\n1. Você escreve UMA VEZ\n2. Usa quando quiser fazer um bolo\n3. Pode fazer com ingredientes diferentes cada vez\n\nUma função = ficha de receita para seu código.\nEscreva uma vez. Chame quando precisar. Mude os ingredientes (parâmetros) cada vez.'
        }
      },
      { type: 'heading', content: { en: '🐍 Step 1 — define a function', pt: '🐍 Passo 1 — defina uma função' } },
      {
        type: 'code',
        code: `# def = "define"
# function_name = what you'll call it
# () = inputs (ingredients)
def greet():
    print("Hello, client!")
    print("Welcome to ClaimPro")

# Call it (use the recipe):
greet()   # Hello, client!
greet()   # Hello, client! (again, same code)`
      },
      { type: 'heading', content: { en: '🐍 Step 2 — add parameters (inputs)', pt: '🐍 Passo 2 — adicione parâmetros (entradas)' } },
      {
        type: 'code',
        code: `def greet(name):             # name = ingredient
    print("Hello,", name)

greet("Alice")    # Hello, Alice
greet("Bob")      # Hello, Bob
greet("Carlos")   # Hello, Carlos`
      },
      { type: 'heading', content: { en: '🐍 Step 3 — return a value', pt: '🐍 Passo 3 — retorne um valor' } },
      {
        type: 'code',
        code: {
          en: `def calculate_payout(damage, deductible):
    payout = damage - deductible
    return payout            # sends the value back to the caller

# Store and use the returned value:
result = calculate_payout(5230, 250)
print("Payout:", result)     # Payout: 4980

# Or use the returned value directly:
print(calculate_payout(8000, 300))   # 7700`,
          pt: `def calcular_pagamento(dano, franquia):
    pagamento = dano - franquia
    return pagamento         # devolve o valor para quem chamou a função

# Armazene e use o valor retornado:
resultado = calcular_pagamento(5230, 250)
print("Pagamento:", resultado)     # Pagamento: 4980

# Ou use diretamente o valor retornado:
print(calcular_pagamento(8000, 300))   # 7700`
        }
      },
      {
        type: 'tip',
        content: {
          en: '💡 No return = function returns None.\nAlways return when you need the result for further calculations.',
          pt: '💡 Sem return = função retorna None.\nSempre retorne quando precisar do resultado para cálculos posteriores.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex13_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to write a function body that calculates a value and returns it.\nThe code has 7 lines ready for you. You only need to fill in 3 blanks — marked with ___.\n\nBlank 1 (line 2): Type damage — the first parameter, representing the claim amount\nBlank 2 (line 2): Type deductible — subtract this from damage to get the payout\nBlank 3 (line 3): Type payout — return the variable you just calculated\n\nExpected output:\n4980\n7700\n1050',
        pt: 'Antes de começar: este exercício ensina como escrever o corpo de uma função que calcula um valor e o retorna.\nO código tem 7 linhas prontas. Você só precisa preencher 3 lacunas — marcadas com ___.\n\nLacuna 1 (linha 2): Digite damage — o primeiro parâmetro, representando o valor do sinistro\nLacuna 2 (linha 2): Digite deductible — subtraia isso de damage para obter o payout\nLacuna 3 (linha 3): Digite payout — retorne a variável que você acabou de calcular\n\nSaída esperada:\n4980\n7700\n1050'
      },
      starterCode: `def calculate_payout(damage, deductible):
    payout = ___ - ___    # damage minus deductible
    return ___             # return the result

# Call it 3 times:
print(calculate_payout(5230, 250))
print(calculate_payout(8000, 300))
print(calculate_payout(1200, 150))`,
      hints: [
        { en: 'payout = damage - deductible', pt: 'payout = damage - deductible' },
        { en: 'return payout', pt: 'return payout' }
      ],
      sampleOutput: { en: '4980\n7700\n1050', pt: '4980\n7700\n1050' },
      grading: {
        codeRequirements: [
          { kind: 'node', value: 'FunctionDef' },
          { kind: 'node', value: 'Return' }
        ],
        tests: [
          {
            id: 'hidden_payout_1',
            description: { en: 'Calculates a new payout value', pt: 'Calcula um novo valor de pagamento' },
            inputs: [],
            afterCode: 'print(calculate_payout(1000, 125))',
            checks: [{ type: 'equals', value: '875', target: 'test_output' }],
            points: 1,
            hidden: true
          },
          {
            id: 'hidden_payout_2',
            description: { en: 'Works when the deductible is larger', pt: 'Funciona quando a franquia é maior' },
            inputs: [],
            afterCode: 'print(calculate_payout(250, 300))',
            checks: [{ type: 'equals', value: '-50', target: 'test_output' }],
            points: 1,
            hidden: true
          }
        ]
      }
    },
    {
      id: 'ex13_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nReplace the two pass statements with working code.\n\nInside get_priority(damage):\n    if damage > 10000: return "Critical"\n    elif damage > 5000: return "Urgent"\n    else: return "Normal"\n\nInside process_claim(name, damage, deductible):\n    payout = damage - deductible\n    priority = get_priority(damage)\n    print(name, "| Priority:", priority, "| Payout: $" + str(payout))\n\nExpected output:\nAlice | Priority: Critical | Payout: $11700\nBob | Priority: Normal | Payout: $3250\n\nTest your program:\nCalling process_claim("Eve", 9000, 400) should print Priority: Urgent and Payout: $8600',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nSubstitua os dois pass por código funcional.\n\nDentro de get_priority(damage):\n    if damage > 10000: return "Critical"\n    elif damage > 5000: return "Urgent"\n    else: return "Normal"\n\nDentro de process_claim(name, damage, deductible):\n    payout = damage - deductible\n    priority = get_priority(damage)\n    print(name, "| Priority:", priority, "| Payout: $" + str(payout))\n\nSaída esperada:\nAlice | Priority: Critical | Payout: $11700\nBob | Priority: Normal | Payout: $3250\n\nTeste seu programa:\nChamar process_claim("Eve", 9000, 400) deve imprimir Priority: Urgent e Payout: $8600'
      },
      starterCode: `def get_priority(damage):
    # Return "Critical" if > 10000
    # Return "Urgent" if > 5000
    # Return "Normal" otherwise
    pass

def process_claim(name, damage, deductible):
    # Calculate payout, get priority, print summary
    pass

# Test both:
process_claim("Alice", 12000, 300)
process_claim("Bob", 3500, 250)`,
      hints: [
        { en: 'Use if/elif/else inside get_priority to return the right string', pt: 'Use if/elif/else dentro de get_priority para retornar a string certa' },
        { en: 'Inside process_claim: payout = damage - deductible, priority = get_priority(damage)', pt: 'Dentro de process_claim: payout = damage - deductible, priority = get_priority(damage)' }
      ],
      sampleOutput: { en: 'Alice | Priority: Critical | Payout: $11700\nBob | Priority: Normal | Payout: $3250', pt: 'Alice | Priority: Critical | Payout: $11700\nBob | Priority: Normal | Payout: $3250' },
      grading: {
        codeRequirements: [
          { kind: 'function', value: 'get_priority' },
          { kind: 'function', value: 'process_claim' },
          { kind: 'node', value: 'Return' },
          { kind: 'node', value: 'If' }
        ],
        tests: [
          {
            id: 'hidden_priorities',
            description: { en: 'Classifies unseen damage values', pt: 'Classifica valores de dano não vistos' },
            inputs: [],
            afterCode: 'print(get_priority(15000))\nprint(get_priority(7000))\nprint(get_priority(100))',
            checks: [{ type: 'equals', value: 'Critical\nUrgent\nNormal', target: 'test_output' }],
            points: 2,
            hidden: true
          },
          {
            id: 'hidden_claim',
            description: { en: 'Processes a new claim', pt: 'Processa um novo sinistro' },
            inputs: [],
            afterCode: 'process_claim("Eve", 9000, 400)',
            checks: [
              { type: 'contains', value: 'Eve', target: 'test_output' },
              { type: 'contains', value: 'Urgent', target: 'test_output' },
              { type: 'contains', value: '8600', target: 'test_output' }
            ],
            points: 2,
            hidden: true
          }
        ]
      }
    }
  ],

  quiz: [
    {
      id: 'q13_1',
      question: { en: 'What does "def" do?', pt: 'O que "def" faz?' },
      options: [
        { en: 'Defines (creates) a function', pt: 'Define (cria) uma função' },
        { en: 'Calls a function', pt: 'Chama uma função' },
        { en: 'Returns a value', pt: 'Retorna um valor' },
        { en: 'Imports a module', pt: 'Importa um módulo' }
      ],
      correctIndex: 0,
      explanation: { en: 'def is short for "define". It creates a reusable block of code with a name. You call it later by that name.', pt: 'def é abreviação de "define". Cria um bloco de código reutilizável com um nome. Você o chama depois por esse nome.' }
    },
    {
      id: 'q13_2',
      question: { en: 'What does "return" do?', pt: 'O que "return" faz?' },
      options: [
        { en: 'Sends a value back to whoever called the function', pt: 'Envia um valor de volta para quem chamou a função' },
        { en: 'Prints the value', pt: 'Imprime o valor' },
        { en: 'Ends the program', pt: 'Termina o programa' },
        { en: 'Jumps to the next function', pt: 'Pula para a próxima função' }
      ],
      correctIndex: 0,
      explanation: { en: 'return gives a value back so the caller can use it: result = my_function(). Without return, the caller gets None.', pt: 'return devolve um valor para o chamador poder usá-lo: resultado = minha_funcao(). Sem return, o chamador recebe None.' }
    },
    {
      id: 'q13_3',
      question: { en: 'def add(a, b):\n   return a + b\nresult = add(3, 4)\nprint(result) → ?', pt: 'def soma(a, b):\n   return a + b\nresult = soma(3, 4)\nprint(result) → ?' },
      options: [
        { en: '7', pt: '7' },
        { en: 'a + b', pt: 'a + b' },
        { en: '34', pt: '34' },
        { en: 'None', pt: 'None' }
      ],
      correctIndex: 0,
      explanation: { en: 'add(3, 4) calculates 3+4=7 and returns it. result = 7. print(7).', pt: 'soma(3, 4) calcula 3+4=7 e retorna. result = 7. print(7).' }
    },
    {
      id: 'q13_4',
      question: { en: 'Can you call the same function multiple times?', pt: 'Você pode chamar a mesma função múltiplas vezes?' },
      options: [
        { en: 'Yes — as many times as you need', pt: 'Sim — quantas vezes precisar' },
        { en: 'No — only once per program', pt: 'Não — apenas uma vez por programa' },
        { en: 'Max 10 times', pt: 'Máximo 10 vezes' },
        { en: 'Only inside loops', pt: 'Apenas dentro de loops' }
      ],
      correctIndex: 0,
      explanation: { en: 'That\'s exactly why functions exist — write once, call thousands of times. Each call can use different arguments.', pt: 'É exatamente para isso que funções existem — escreva uma vez, chame milhares de vezes. Cada chamada pode usar argumentos diferentes.' }
    }
  ],

  exam: {
    title: { en: 'Claims Processing Engine', pt: 'Motor de Processamento de Sinistros' },
    scenario: {
      en: 'Build a reusable claims engine using functions. Then process a list of 4 claims through it.',
      pt: 'Construa um motor reutilizável de sinistros com funções. Depois processe uma lista de 4 sinistros por ele.'
    },
    requirements: {
      en: ['def calculate_payout(damage, deductible) → returns payout', 'def get_priority(damage) → returns "Critical"/"Urgent"/"Normal"', 'Loop through 4 claims using both functions', 'Print summary for each'],
      pt: ['def calculate_payout(damage, deductible) → retorna pagamento', 'def get_priority(damage) → retorna "Critical"/"Urgent"/"Normal"', 'Percorra 4 sinistros usando ambas as funções', 'Imprima resumo de cada um']
    },
    starterCode: `def calculate_payout(damage, deductible):
    return damage - deductible

def get_priority(damage):
    if damage > 10000:
        return "Critical"
    elif damage > 5000:
        return "Urgent"
    else:
        return "Normal"

claims = [
    {"client": "Alice",  "damage": 12000, "deductible": 300},
    {"client": "Bob",    "damage":  3500, "deductible": 250},
    {"client": "Carlos", "damage":  7800, "deductible": 400},
    {"client": "Diana",  "damage":    900, "deductible": 150}
]

for claim in claims:
    payout   = calculate_payout(claim["damage"], claim["deductible"])
    priority = get_priority(claim["damage"])
    print(claim["client"], "|", priority, "| $", payout)`,
    testCases: [
      { id: 'tc13_1', description: { en: 'Alice payout 11700', pt: 'Alice pagamento 11700' }, inputs: [], checks: [{ type: 'contains', value: '11700' }], points: 20 },
      { id: 'tc13_2', description: { en: 'Alice is Critical', pt: 'Alice é Critical' }, inputs: [], checks: [{ type: 'contains', value: 'Critical' }], points: 20 },
      { id: 'tc13_3', description: { en: 'Carlos is Urgent', pt: 'Carlos é Urgent' }, inputs: [], checks: [{ type: 'contains', value: 'Urgent' }], points: 20 },
      { id: 'tc13_4', description: { en: 'Bob payout 3250', pt: 'Bob pagamento 3250' }, inputs: [], checks: [{ type: 'contains', value: '3250' }], points: 20 },
      { id: 'tc13_5', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

// ============================================================================
// PHASE 14 — Parâmetros e Valores Padrão
// TEMPLATE B: Conceito Composto
// ============================================================================

export const phase14: Phase = {
  id: 14,
  title: { en: 'Function Parameters', pt: 'Parâmetros de Função' },
  description: {
    en: 'Make functions flexible with defaults, keyword args, and return values.',
    pt: 'Torne funções flexíveis com padrões, argumentos nomeados e valores de retorno.'
  },
  icon: '🎛️',
  libraries: [],

  lesson: {
    title: { en: 'Smarter Function Inputs', pt: 'Entradas de Função Mais Inteligentes' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Default parameters are everywhere', pt: '🌍 Parâmetros padrão estão em todo lugar' } },
      {
        type: 'text',
        content: {
          en: 'When you open WhatsApp and don\'t change any settings, it uses defaults:\nfont_size=14, theme="light", notifications=True\n\nDefault parameters = "if the user doesn\'t say otherwise, use this". Every API, app, and library uses them.',
          pt: 'Quando você abre o WhatsApp e não muda nenhuma configuração, ele usa padrões:\nfonte=14, tema="claro", notificacoes=True\n\nParâmetros padrão = "se o usuário não disser o contrário, use isso". Todo API, app e biblioteca usa isso.'
        }
      },
      { type: 'heading', content: { en: '🧩 A coffee machine with settings', pt: '🧩 Uma máquina de café com configurações' } },
      {
        type: 'text',
        content: {
          en: 'A coffee machine:\n☕ Default: 1 shot, medium size, no sugar\nYou can override any setting individually.\nYou don\'t need to specify them all — just the ones you want to change.\n\nDefault parameters work exactly the same way.',
          pt: 'Uma máquina de café:\n☕ Padrão: 1 dose, tamanho médio, sem açúcar\nVocê pode sobrescrever qualquer configuração individualmente.\nNão precisa especificar todas — apenas as que quer mudar.\n\nParâmetros padrão funcionam exatamente assim.'
        }
      },
      { type: 'heading', content: { en: '🐍 Step 1 — default parameter values', pt: '🐍 Passo 1 — valores padrão de parâmetros' } },
      {
        type: 'code',
        code: `def calculate_payout(damage, deductible=250, coverage=0.80):
    net    = damage - deductible
    payout = net * coverage
    return payout

# All defaults:
print(calculate_payout(5000))           # 3800.0

# Override deductible only:
print(calculate_payout(5000, 100))      # 3920.0

# Override both:
print(calculate_payout(5000, 100, 1.0)) # 4900.0`
      },
      { type: 'heading', content: { en: '🐍 Step 2 — keyword arguments', pt: '🐍 Passo 2 — argumentos nomeados' } },
      {
        type: 'code',
        code: `def register_claim(client, damage, status="pending", priority="normal"):
    print(f"Claim for {client}: \${damage} | {status} | {priority}")

# Positional (in order):
register_claim("Alice", 5000)

# Keyword (by name, any order):
register_claim("Bob", 8000, priority="urgent", status="approved")

# Mix (positional first, then keyword):
register_claim("Carlos", 1200, status="approved")`
      },
      { type: 'heading', content: { en: '🐍 Step 3 — return multiple values', pt: '🐍 Passo 3 — retorne múltiplos valores' } },
      {
        type: 'code',
        code: `def analyze_claim(damage, deductible=250):
    payout   = damage - deductible
    if damage > 10000:  priority = "Critical"
    elif damage > 5000: priority = "Urgent"
    else:               priority = "Normal"
    return payout, priority    # return two values!

payout, priority = analyze_claim(8000)
print(payout, priority)   # 7750 Urgent`
      }
    ]
  },

  exercises: [
    {
      id: 'ex14_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to set a default value for a function parameter.\nThe code has 8 lines ready for you. You only need to fill in 1 blank — marked with ___.\n\nBlank 1 (line 1): Type 250 — this is the default deductible used when no second argument is passed\n\nExpected output:\n4750\n4900',
        pt: 'Antes de começar: este exercício ensina como definir um valor padrão para um parâmetro de função.\nO código tem 8 linhas prontas. Você só precisa preencher 1 lacuna — marcada com ___.\n\nLacuna 1 (linha 1): Digite 250 — essa é a franquia padrão usada quando nenhum segundo argumento é passado\n\nSaída esperada:\n4750\n4900'
      },
      starterCode: `def payout(damage, deductible=___):   # fill in default value
    return damage - deductible

# Should use default (250):
print(payout(5000))      # 4750

# Override with 100:
print(payout(5000, 100)) # 4900`,
      hints: [
        { en: 'Default value goes after = in the parameter: deductible=250', pt: 'Valor padrão vai após = no parâmetro: deductible=250' }
      ],
      sampleOutput: { en: '4750\n4900', pt: '4750\n4900' }
    },
    {
      id: 'ex14_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete function full_claim_report() is already provided in the starter — read it carefully, then run it as-is.\n\nWhat the code does:\nTest 1 — full_claim_report("Alice", 6000): uses default deductible=250 and coverage=0.80 → payout = (6000-250)*0.80 = $4600.0\nTest 2 — full_claim_report("Bob", 12000, deductible=500): overrides deductible only → payout = (12000-500)*0.80 = $9200.0\nTest 3 — full_claim_report("Carlos", 3000, coverage=1.0): overrides coverage only → payout = (3000-250)*1.0 = $2750\n\nExpected output:\nAlice: $4600.0 | Urgent | approved\nBob: $9200.0 | Critical | approved\nCarlos: $2750 | Normal | approved\n\nTest your program:\nTry calling full_claim_report("Diana", 4000) — it should print Normal and a payout of $3000.0',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nA função full_claim_report() completa já está fornecida no starter — leia com atenção e execute como está.\n\nO que o código faz:\nTeste 1 — full_claim_report("Alice", 6000): usa deductible=250 e coverage=0.80 padrão → payout = (6000-250)*0.80 = $4600.0\nTeste 2 — full_claim_report("Bob", 12000, deductible=500): substitui apenas deductible → payout = (12000-500)*0.80 = $9200.0\nTeste 3 — full_claim_report("Carlos", 3000, coverage=1.0): substitui apenas coverage → payout = (3000-250)*1.0 = $2750\n\nSaída esperada:\nAlice: $4600.0 | Urgent | approved\nBob: $9200.0 | Critical | approved\nCarlos: $2750 | Normal | approved\n\nTeste seu programa:\nTente chamar full_claim_report("Diana", 4000) — deve imprimir Normal e payout de $3000.0'
      },
      starterCode: `def full_claim_report(client, damage, deductible=250, coverage=0.80):
    payout = (damage - deductible) * coverage
    if damage > 10000:
        priority = "Critical"
    elif damage > 5000:
        priority = "Urgent"
    else:
        priority = "Normal"
    status = "approved" if payout > 0 else "rejected"
    return payout, priority, status

# Test 1: all defaults
payout, priority, status = full_claim_report("Alice", 6000)
print(f"Alice: \${payout} | {priority} | {status}")

# Test 2: custom deductible
payout, priority, status = full_claim_report("Bob", 12000, deductible=500)
print(f"Bob: \${payout} | {priority} | {status}")

# Test 3: custom coverage
payout, priority, status = full_claim_report("Carlos", 3000, coverage=1.0)
print(f"Carlos: \${payout} | {priority} | {status}")`,
      hints: [
        { en: 'Return multiple values: return payout, priority, status', pt: 'Retorne múltiplos valores: return payout, priority, status' },
        { en: 'Unpack: payout, priority, status = function_call()', pt: 'Desempacote: payout, priority, status = chamada_funcao()' }
      ],
      sampleOutput: { en: 'Alice: $4600.0 | Urgent | approved\nBob: $9200.0 | Critical | approved\nCarlos: $2750 | Normal | approved', pt: 'Alice: $4600.0 | Urgent | approved\nBob: $9200.0 | Critical | approved\nCarlos: $2750 | Normal | approved' }
    }
  ],

  quiz: [
    {
      id: 'q14_1',
      question: { en: 'def f(x, y=10):\n   return x + y\nf(5) → result?', pt: 'def f(x, y=10):\n   return x + y\nf(5) → resultado?' },
      options: [
        { en: '15', pt: '15' },
        { en: '5', pt: '5' },
        { en: 'Error', pt: 'Erro' },
        { en: '10', pt: '10' }
      ],
      correctIndex: 0,
      explanation: { en: 'y defaults to 10. f(5) → x=5, y=10 → 5+10=15.', pt: 'y usa padrão 10. f(5) → x=5, y=10 → 5+10=15.' }
    },
    {
      id: 'q14_2',
      question: { en: 'What are keyword arguments?', pt: 'O que são argumentos nomeados?' },
      options: [
        { en: 'Passing args by name: func(y=2, x=1)', pt: 'Passar args por nome: func(y=2, x=1)' },
        { en: 'Arguments with default values', pt: 'Argumentos com valores padrão' },
        { en: 'Required arguments', pt: 'Argumentos obrigatórios' },
        { en: 'Arguments inside dicts', pt: 'Argumentos dentro de dicts' }
      ],
      correctIndex: 0,
      explanation: { en: 'Keyword args let you pass values by name in any order: func(y=2, x=1) is valid even if x is defined first.', pt: 'Args nomeados permitem passar valores por nome em qualquer ordem: func(y=2, x=1) é válido mesmo que x seja definido primeiro.' }
    },
    {
      id: 'q14_3',
      question: { en: 'Can a function return more than one value?', pt: 'Uma função pode retornar mais de um valor?' },
      options: [
        { en: 'Yes — return val1, val2', pt: 'Sim — return val1, val2' },
        { en: 'No — only one value allowed', pt: 'Não — apenas um valor permitido' },
        { en: 'Yes, but only as a list', pt: 'Sim, mas apenas como lista' },
        { en: 'Only if using global variables', pt: 'Apenas se usar variáveis globais' }
      ],
      correctIndex: 0,
      explanation: { en: 'Python packs multiple return values into a tuple automatically. Unpack with: a, b = my_func().', pt: 'Python empacota múltiplos valores de retorno em tupla automaticamente. Desempacote com: a, b = minha_func().' }
    },
    {
      id: 'q14_4',
      question: { en: 'Where do default parameter values go in a signature?', pt: 'Onde vão valores padrão de parâmetros na assinatura?' },
      options: [
        { en: 'After the parameter name: def f(x, y=10)', pt: 'Após o nome do parâmetro: def f(x, y=10)' },
        { en: 'Before the parameter name: def f(10=y, x)', pt: 'Antes do nome: def f(10=y, x)' },
        { en: 'Inside the function body only', pt: 'Apenas dentro do corpo da função' },
        { en: 'In a separate defaults() call', pt: 'Em uma chamada defaults() separada' }
      ],
      correctIndex: 0,
      explanation: { en: 'Default values go right after the parameter name with =: def func(name, age=25). Always put defaults after required params.', pt: 'Valores padrão vão logo após o nome do parâmetro com =: def func(nome, idade=25). Sempre coloque padrões após params obrigatórios.' }
    }
  ],

  exam: {
    title: { en: 'Flexible Claim Calculator', pt: 'Calculadora Flexível de Sinistros' },
    scenario: {
      en: 'The company just updated policies: different departments have different default deductibles and coverage rates. Build a flexible calculator.',
      pt: 'A empresa atualizou as apólices: diferentes departamentos têm franquias e coberturas padrão diferentes. Construa uma calculadora flexível.'
    },
    requirements: {
      en: [
        'def process(client, damage, deductible=300, coverage=0.80)',
        'Returns: payout (damage - deductible) * coverage',
        'Call 1: all defaults → Alice, $6000',
        'Call 2: custom deductible → Bob, $8000, ded=500',
        'Call 3: keyword args → Carlos, $3000, coverage=1.0, deductible=0'
      ],
      pt: [
        'def process(client, damage, deductible=300, coverage=0.80)',
        'Retorna: payout (damage - deductible) * coverage',
        'Chamada 1: padrões → Alice, R$6000',
        'Chamada 2: franquia customizada → Bob, R$8000, ded=500',
        'Chamada 3: args nomeados → Carlos, R$3000, coverage=1.0, deductible=0'
      ]
    },
    starterCode: `def process(client, damage, deductible=300, coverage=0.80):
    payout = (damage - deductible) * coverage
    return payout

print(process("Alice", 6000))
print(process("Bob", 8000, 500))
print(process("Carlos", 3000, coverage=1.0, deductible=0))`,
    testCases: [
      { id: 'tc14_1', description: { en: 'Alice = 4560', pt: 'Alice = 4560' }, inputs: [], checks: [{ type: 'contains', value: '4560' }], points: 30 },
      { id: 'tc14_2', description: { en: 'Bob = 6000', pt: 'Bob = 6000' }, inputs: [], checks: [{ type: 'contains', value: '6000' }], points: 30 },
      { id: 'tc14_3', description: { en: 'Carlos = 3000', pt: 'Carlos = 3000' }, inputs: [], checks: [{ type: 'contains', value: '3000' }], points: 30 },
      { id: 'tc14_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 }
    ]
  }
}

// ============================================================================
// PHASE 15 — Docstrings
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase15: Phase = {
  id: 15,
  title: { en: 'Docstrings', pt: 'Docstrings' },
  description: {
    en: 'Document your functions — so others (and future you) understand them instantly.',
    pt: 'Documente suas funções — para que outros (e você do futuro) as entendam instantaneamente.'
  },
  icon: '📝',
  libraries: [],

  lesson: {
    title: { en: 'Write Code Others Can Use', pt: 'Escreva Código que Outros Podem Usar' },
    blocks: [
      { type: 'heading', content: { en: '🌍 The Python standard library has docstrings for everything', pt: '🌍 A biblioteca padrão Python tem docstrings para tudo' } },
      {
        type: 'text',
        content: {
          en: 'When you type help(print) in Python, you see documentation.\nThat documentation IS a docstring — written by the Python team.\n\nEvery professional function at Google, Microsoft, and open-source projects includes one. It\'s not optional — it\'s professional standard.',
          pt: 'Quando você digita help(print) no Python, vê a documentação.\nEssa documentação É uma docstring — escrita pelo time Python.\n\nToda função profissional no Google, Microsoft e projetos open-source inclui uma. Não é opcional — é padrão profissional.'
        }
      },
      { type: 'heading', content: { en: '🧩 The label on a medicine bottle', pt: '🧩 O rótulo de um frasco de remédio' } },
      {
        type: 'text',
        content: {
          en: 'A medicine bottle has a label:\n• What it does\n• How to use it\n• What to expect\n\nA docstring is the label for your function.\nWithout it, nobody (including you in 3 months) will know what it does or how to use it.',
          pt: 'Um frasco de remédio tem um rótulo:\n• O que faz\n• Como usar\n• O que esperar\n\nUma docstring é o rótulo da sua função.\nSem ela, ninguém (incluindo você em 3 meses) saberá o que ela faz ou como usar.'
        }
      },
      { type: 'heading', content: { en: '🐍 How to write a docstring', pt: '🐍 Como escrever uma docstring' } },
      {
        type: 'code',
        code: `def calculate_payout(damage, deductible=250, coverage=0.80):
    """Calculate insurance payout after deductible and coverage.

    Args:
        damage (float): Total damage amount claimed
        deductible (float): Amount customer pays. Default: 250
        coverage (float): Coverage percentage 0-1. Default: 0.80

    Returns:
        float: Final payout amount the company pays

    Example:
        >>> calculate_payout(5000)
        3800.0
    """
    return (damage - deductible) * coverage

# Access the docstring:
help(calculate_payout)`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Triple quotes """ start and end the docstring.\nFirst line: what it does (short)\nThen: Args, Returns, Examples.\nMinimum: always write the first line at least.',
          pt: '💡 Aspas triplas """ iniciam e encerram a docstring.\nPrimeira linha: o que faz (curta)\nDepois: Args, Returns, Examples.\nMínimo: sempre escreva ao menos a primeira linha.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex15_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to complete a docstring that documents a function.\nThe code has 11 lines ready for you. You only need to fill in 3 blanks — marked with ___.\n\nBlank 1 (line 2): Type Classify — the first word of the summary sentence\nBlank 2 (line 2): Type damage — the second blank completes "based on damage amount"\nBlank 3 (line 5): Type Total damage amount — a short description of the damage parameter\n\nExpected output:\nUrgent',
        pt: 'Antes de começar: este exercício ensina como completar uma docstring que documenta uma função.\nO código tem 11 linhas prontas. Você só precisa preencher 3 lacunas — marcadas com ___.\n\nLacuna 1 (linha 2): Digite Classify — a primeira palavra da frase resumo\nLacuna 2 (linha 2): Digite damage — completa "based on damage amount"\nLacuna 3 (linha 5): Digite Total damage amount — uma breve descrição do parâmetro damage\n\nSaída esperada:\nUrgent'
      },
      starterCode: `def get_priority(damage):
    """___ insurance claim based on ___ amount.

    Args:
        damage (float): ___

    Returns:
        str: "Critical", "Urgent", or "Normal"
    """
    if damage > 10000: return "Critical"
    elif damage > 5000: return "Urgent"
    else: return "Normal"

print(get_priority(8000))`,
      hints: [
        { en: 'First blank: "Classify" | Second blank: "damage" | Third blank: "Total damage amount"', pt: 'Primeiro espaço: "Classify" | Segundo: "damage" | Terceiro: "Total do dano"' }
      ],
      sampleOutput: { en: 'Urgent', pt: 'Urgent' }
    },
    {
      id: 'ex15_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe function body and test calls are already provided. Your only job is to replace "Write your docstring here." with a complete docstring.\n\nA complete docstring for this function should include:\nLine 1: A short summary — for example: "Return the payout after subtracting the deductible from damage."\nThen: an Args section listing damage (float) and deductible (float)\nThen: a Returns section saying the function returns a float\nThen: an Example showing apply_deductible(5000, 250) → 4750\n\nExpected output:\n4750\n\nTest your program:\nhelp(apply_deductible) should print your docstring above the result',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO corpo da função e as chamadas de teste já estão fornecidos. Seu único trabalho é substituir "Write your docstring here." por uma docstring completa.\n\nUma docstring completa para esta função deve incluir:\nLinha 1: Um resumo curto — por exemplo: "Retorna o payout após subtrair a franquia do dano."\nDepois: uma seção Args listando damage (float) e deductible (float)\nDepois: uma seção Returns dizendo que a função retorna um float\nDepois: um Example mostrando apply_deductible(5000, 250) → 4750\n\nSaída esperada:\n4750\n\nTeste seu programa:\nhelp(apply_deductible) deve imprimir sua docstring acima do resultado'
      },
      starterCode: `def apply_deductible(damage, deductible):
    """Write your docstring here."""
    return damage - deductible

help(apply_deductible)
print(apply_deductible(5000, 250))`,
      hints: [
        { en: 'First line: one sentence describing what it does', pt: 'Primeira linha: uma frase descrevendo o que faz' },
        { en: 'Args: damage (float): ..., deductible (float): ...', pt: 'Args: damage (float): ..., deductible (float): ...' }
      ],
      sampleOutput: { en: '4750', pt: '4750' }
    }
  ],

  quiz: [
    {
      id: 'q15_1',
      question: { en: 'Where does a docstring go?', pt: 'Onde vai uma docstring?' },
      options: [
        { en: 'First line inside the function, in triple quotes', pt: 'Primeira linha dentro da função, em aspas triplas' },
        { en: 'Before the def keyword', pt: 'Antes da palavra def' },
        { en: 'After the function closes', pt: 'Depois de a função fechar' },
        { en: 'In a separate file', pt: 'Em um arquivo separado' }
      ],
      correctIndex: 0,
      explanation: { en: 'Docstring goes right after the def line, as the very first thing inside the function, in triple quotes."""', pt: 'Docstring vai logo após a linha def, como a primeira coisa dentro da função, em aspas triplas."""' }
    },
    {
      id: 'q15_2',
      question: { en: 'How do you read a function\'s docstring?', pt: 'Como você lê a docstring de uma função?' },
      options: [
        { en: 'help(function_name)', pt: 'help(nome_funcao)' },
        { en: 'print(function_name)', pt: 'print(nome_funcao)' },
        { en: 'docstring(function_name)', pt: 'docstring(nome_funcao)' },
        { en: 'read(function_name.__doc__)', pt: 'read(nome_funcao.__doc__)' }
      ],
      correctIndex: 0,
      explanation: { en: 'help(func) shows the docstring formatted nicely. You can also access it raw with func.__doc__.', pt: 'help(func) mostra a docstring formatada. Você também pode acessá-la com func.__doc__.' }
    },
    {
      id: 'q15_3',
      question: { en: 'Is a docstring required for code to run?', pt: 'Uma docstring é obrigatória para o código rodar?' },
      options: [
        { en: 'No — but it\'s professional standard', pt: 'Não — mas é padrão profissional' },
        { en: 'Yes — Python requires it', pt: 'Sim — Python exige' },
        { en: 'Only for functions with arguments', pt: 'Apenas para funções com argumentos' },
        { en: 'Only in production code', pt: 'Apenas em código de produção' }
      ],
      correctIndex: 0,
      explanation: { en: 'Docstrings are optional for Python to run, but required by professional standards. All serious codebases have them.', pt: 'Docstrings são opcionais para Python rodar, mas obrigatórias pelo padrão profissional. Todas as bases de código sérias as têm.' }
    },
    {
      id: 'q15_4',
      question: { en: 'What should the FIRST LINE of a docstring say?', pt: 'O que a PRIMEIRA LINHA de uma docstring deve dizer?' },
      options: [
        { en: 'A brief summary of what the function does', pt: 'Um breve resumo do que a função faz' },
        { en: 'The author\'s name', pt: 'O nome do autor' },
        { en: 'All the arguments', pt: 'Todos os argumentos' },
        { en: 'The return type only', pt: 'Apenas o tipo de retorno' }
      ],
      correctIndex: 0,
      explanation: { en: 'First line = one sentence summary. It appears in quick help and autocomplete tooltips. Make it clear and action-oriented.', pt: 'Primeira linha = resumo em uma frase. Aparece na ajuda rápida e tooltips de autocomplete. Seja claro e orientado à ação.' }
    }
  ],

  exam: {
    title: { en: 'Documented Claims Module', pt: 'Módulo de Sinistros Documentado' },
    scenario: {
      en: 'Write 3 functions, each with a complete docstring. Then call them in a claims processing loop.',
      pt: 'Escreva 3 funções, cada uma com docstring completa. Depois chame-as num loop de processamento.'
    },
    requirements: {
      en: ['payout(damage, ded): full docstring + returns damage-ded', 'priority(damage): full docstring + returns Critical/Urgent/Normal', 'summary(client, damage, ded): full docstring + prints report', 'Loop through 3 claims calling all 3 functions'],
      pt: ['payout(damage, ded): docstring completa + retorna damage-ded', 'priority(damage): docstring completa + retorna Critical/Urgent/Normal', 'summary(client, damage, ded): docstring completa + imprime relatório', 'Percorra 3 sinistros chamando as 3 funções']
    },
    starterCode: `def payout(damage, ded):
    """Calculate net payout after deductible.
    Args: damage (float), ded (float)
    Returns: float
    """
    return damage - ded

def priority(damage):
    """Classify claim priority by damage amount.
    Args: damage (float)
    Returns: str — "Critical", "Urgent", or "Normal"
    """
    if damage > 10000: return "Critical"
    elif damage > 5000: return "Urgent"
    else: return "Normal"

def summary(client, damage, ded):
    """Print a formatted claim summary.
    Args: client (str), damage (float), ded (float)
    """
    p = payout(damage, ded)
    r = priority(damage)
    print(f"{client} | {r} | \${p}")

claims = [("Alice", 12000, 300), ("Bob", 4500, 250), ("Carlos", 7800, 400)]
for name, dmg, ded in claims:
    summary(name, dmg, ded)`,
    testCases: [
      { id: 'tc15_1', description: { en: 'Alice | Critical | $11700', pt: 'Alice | Critical | $11700' }, inputs: [], checks: [{ type: 'contains', value: '11700' }], points: 25 },
      { id: 'tc15_2', description: { en: 'Bob | Normal | $4250', pt: 'Bob | Normal | $4250' }, inputs: [], checks: [{ type: 'contains', value: '4250' }], points: 25 },
      { id: 'tc15_3', description: { en: 'Carlos | Urgent', pt: 'Carlos | Urgent' }, inputs: [], checks: [{ type: 'contains', value: 'Urgent' }], points: 25 },
      { id: 'tc15_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 25 }
    ]
  }
}

// ============================================================================
// PHASE 16 — Escopo de Variáveis
// TEMPLATE C: Conceito Abstrato/Complexo
// ============================================================================

export const phase16: Phase = {
  id: 16,
  title: { en: 'Variable Scope', pt: 'Escopo de Variáveis' },
  description: {
    en: 'Understand where variables live and why they can\'t be seen from everywhere.',
    pt: 'Entenda onde as variáveis vivem e por que não podem ser vistas de qualquer lugar.'
  },
  icon: '🔭',
  libraries: [],

  lesson: {
    title: { en: 'Where Variables Are Visible', pt: 'Onde Variáveis São Visíveis' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Scope prevents bugs in every major app', pt: '🌍 Escopo previne bugs em todo grande app' } },
      {
        type: 'text',
        content: {
          en: 'At Facebook, thousands of developers work on the same codebase.\nIf every variable was global, a variable named "count" in one file would clash with "count" in 1,000 other files.\n\nScope = each function has its own private space. That\'s what keeps massive codebases from collapsing.',
          pt: 'No Facebook, milhares de desenvolvedores trabalham no mesmo codebase.\nSe toda variável fosse global, uma variável "count" em um arquivo colidira com "count" em 1.000 outros arquivos.\n\nEscopo = cada função tem seu próprio espaço privado. É o que mantém codebases massivos de desmoronar.'
        }
      },

      // ── CENÁRIOS CONTRASTANTES (Template C) ───────────────────────────────
      { type: 'heading', content: { en: '🆚 Scenario 1: WITHOUT scope awareness (problem)', pt: '🆚 Cenário 1: SEM consciência de escopo (problema)' } },
      {
        type: 'code',
        code: `total = 0   # global variable

def add_claim(amount):
    total = total + amount   # ❌ ERROR: can't read global inside function
    # Python sees "total =" and treats it as LOCAL
    # But then tries to read it before it's assigned → crash!

add_claim(5000)  # UnboundLocalError!`
      },

      { type: 'heading', content: { en: '🆚 Scenario 2: WITH scope awareness (solution)', pt: '🆚 Cenário 2: COM consciência de escopo (solução)' } },
      {
        type: 'code',
        code: `total = 0   # global variable

def add_claim(amount):
    global total             # ✅ Tell Python: I want the GLOBAL one
    total = total + amount

add_claim(5000)
add_claim(3000)
print(total)   # 8000  ← works!`
      },

      { type: 'heading', content: { en: '🐍 The clean way: use parameters + return', pt: '🐍 O jeito limpo: use parâmetros + return' } },
      {
        type: 'code',
        code: `# ✅ BEST PRACTICE: avoid global, pass data in/out
def add_claim(total, amount):
    return total + amount    # return the new total

total = 0
total = add_claim(total, 5000)   # 5000
total = add_claim(total, 3000)   # 8000
print(total)                      # 8000`
      },

      { type: 'heading', content: { en: '🐍 Local vs Global — the full picture', pt: '🐍 Local vs Global — o quadro completo' } },
      {
        type: 'code',
        code: `x = "GLOBAL"   # global scope

def my_func():
    x = "LOCAL"    # local scope — different variable!
    print(x)       # LOCAL (sees its own x)

my_func()          # LOCAL
print(x)           # GLOBAL (unchanged!)`
      },
      {
        type: 'tip',
        content: {
          en: '💡 Rule of thumb:\n✅ Pass data IN via parameters\n✅ Get data OUT via return\n❌ Avoid global when possible\n\nThis keeps functions independent and testable.',
          pt: '💡 Regra prática:\n✅ Passe dados para DENTRO via parâmetros\n✅ Obtenha dados para FORA via return\n❌ Evite global quando possível\n\nIsso mantém funções independentes e testáveis.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex16_recog',
      title: { en: '🟡 Recognize the Pattern', pt: '🟡 Reconheça o Padrão' },
      description: {
        en: 'The code already has some parts done. Your job is to fill in the blanks or fix the bug.\n\nStep 1: Read ALL the code first — notice that process() tries to read claims_total inside itself, but claims_total is defined outside — this causes an UnboundLocalError.\nStep 2: The fix is to pass the running total as a parameter instead of relying on the outer variable.\nStep 3: Change the function signature from def process(amount): to def process(total, amount):\nStep 4: Change the body to return total + amount — no reference to claims_total at all\nStep 5: Update both calls: claims_total = process(claims_total, 5000) and claims_total = process(claims_total, 3000)\nStep 6: Run the code — you should see:\n8000',
        pt: 'O código já tem algumas partes prontas. Seu trabalho é preencher as lacunas ou corrigir o bug.\n\nPasso 1: Leia TODO o código primeiro — note que process() tenta ler claims_total dentro de si mesma, mas claims_total está definida fora — isso causa UnboundLocalError.\nPasso 2: A correção é passar o total acumulado como parâmetro em vez de depender da variável externa.\nPasso 3: Mude a assinatura de def process(amount): para def process(total, amount):\nPasso 4: Mude o corpo para return total + amount — sem referência a claims_total\nPasso 5: Atualize as duas chamadas: claims_total = process(claims_total, 5000) e claims_total = process(claims_total, 3000)\nPasso 6: Execute o código — você deve ver:\n8000'
      },
      starterCode: `# ❌ BUGGY CODE — fix it:
claims_total = 0

def process(amount):
    claims_total = claims_total + amount   # what's wrong here?
    return claims_total

claims_total = process(5000)
claims_total = process(3000)
print(claims_total)

# HINT: rewrite process() to take total as a parameter`,
      hints: [
        { en: 'Change def process(amount) to def process(total, amount)', pt: 'Mude def process(amount) para def process(total, amount)' },
        { en: 'Remove the global — just do: return total + amount', pt: 'Remova o global — apenas faça: return total + amount' }
      ],
      sampleOutput: { en: '8000', pt: '8000' }
    },
    {
      id: 'ex16_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete code is already provided in the starter — read every line carefully, then run it as-is.\n\nWhat the code shows:\ncount_items() uses a LOCAL variable "count" that resets to 0 on every call — that is why the second call prints 2, not 5.\naccumulate() takes the running total as a parameter and returns the new total — no global variable needed.\n\nLine 1: count_items([1,2,3]) → count starts at 0, increments 3 times → prints 3\nLine 2: count_items([4,5]) → count starts fresh at 0, increments 2 times → prints 2\nLine 3: total accumulates 5000 + 3000 + 1200 across three calls → Final total: 9200\n\nExpected output:\n3\n2\nFinal total: 9200',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO código completo já está fornecido no starter — leia cada linha com atenção e execute como está.\n\nO que o código mostra:\ncount_items() usa uma variável LOCAL "count" que reinicia em 0 a cada chamada — por isso a segunda chamada imprime 2, não 5.\naccumulate() recebe o total acumulado como parâmetro e retorna o novo total — sem variável global.\n\nLinha 1: count_items([1,2,3]) → count começa em 0, incrementa 3 vezes → imprime 3\nLinha 2: count_items([4,5]) → count começa do zero, incrementa 2 vezes → imprime 2\nLinha 3: total acumula 5000 + 3000 + 1200 em três chamadas → Final total: 9200\n\nSaída esperada:\n3\n2\nFinal total: 9200'
      },
      starterCode: `# 1. Local counter — resets each call
def count_items(items):
    count = 0              # LOCAL — created fresh each call
    for item in items:
        count += 1
    return count

print(count_items([1, 2, 3]))     # 3
print(count_items([4, 5]))        # 2 (fresh count!)

# 2. Accumulate WITHOUT global
def accumulate(running_total, new_value):
    return running_total + new_value

total = 0
total = accumulate(total, 5000)
total = accumulate(total, 3000)
total = accumulate(total, 1200)
print("Final total:", total)       # 9200`,
      hints: [
        { en: 'Local variables only exist while the function runs — perfect for temporary counters', pt: 'Variáveis locais só existem enquanto a função roda — perfeitas para contadores temporários' }
      ],
      sampleOutput: { en: '3\n2\nFinal total: 9200', pt: '3\n2\nFinal total: 9200' }
    }
  ],

  quiz: [
    {
      id: 'q16_1',
      question: { en: 'A LOCAL variable inside a function is visible:', pt: 'Uma variável LOCAL dentro de uma função é visível:' },
      options: [
        { en: 'Only inside that function', pt: 'Apenas dentro dessa função' },
        { en: 'Everywhere in the program', pt: 'Em todo o programa' },
        { en: 'In functions that call this function', pt: 'Em funções que chamam esta função' },
        { en: 'Depends on the variable name', pt: 'Depende do nome da variável' }
      ],
      correctIndex: 0,
      explanation: { en: 'Local variables die when the function ends. They exist only while the function is running. That\'s scope.', pt: 'Variáveis locais morrem quando a função termina. Existem apenas enquanto a função está rodando. Isso é escopo.' }
    },
    {
      id: 'q16_2',
      question: { en: 'x = 10\ndef f():\n    x = 99\nf()\nprint(x) → result?', pt: 'x = 10\ndef f():\n    x = 99\nf()\nprint(x) → resultado?' },
      options: [
        { en: '10', pt: '10' },
        { en: '99', pt: '99' },
        { en: 'Error', pt: 'Erro' },
        { en: 'None', pt: 'None' }
      ],
      correctIndex: 0,
      explanation: { en: 'x inside f() is LOCAL — a different variable. The global x = 10 is unchanged. Local and global are separate.', pt: 'x dentro de f() é LOCAL — uma variável diferente. O global x = 10 não é alterado. Local e global são separados.' }
    },
    {
      id: 'q16_3',
      question: { en: 'What does "global x" inside a function do?', pt: 'O que "global x" dentro de uma função faz?' },
      options: [
        { en: 'Tells Python to use the global variable x, not create a local one', pt: 'Diz ao Python para usar a variável global x, não criar uma local' },
        { en: 'Creates a new global variable', pt: 'Cria uma nova variável global' },
        { en: 'Makes x visible to all functions', pt: 'Torna x visível para todas as funções' },
        { en: 'Deletes the local x', pt: 'Deleta o x local' }
      ],
      correctIndex: 0,
      explanation: { en: '"global x" declares that any use of x in this function refers to the global x, not a new local one.', pt: '"global x" declara que qualquer uso de x nesta função se refere ao x global, não a um novo local.' }
    },
    {
      id: 'q16_4',
      question: { en: 'What\'s the BEST way to share data between functions?', pt: 'Qual é a MELHOR forma de compartilhar dados entre funções?' },
      options: [
        { en: 'Parameters (in) and return values (out)', pt: 'Parâmetros (entrada) e valores de retorno (saída)' },
        { en: 'Global variables', pt: 'Variáveis globais' },
        { en: 'Print then read', pt: 'Imprimir e depois ler' },
        { en: 'Store in a file', pt: 'Armazenar em arquivo' }
      ],
      correctIndex: 0,
      explanation: { en: 'Pass data IN with parameters, get data OUT with return. This keeps functions independent, testable, and safe. Global should be a last resort.', pt: 'Passe dados PARA DENTRO com parâmetros, obtenha dados PARA FORA com return. Isso mantém funções independentes, testáveis e seguras. Global deve ser último recurso.' }
    }
  ],

  exam: {
    title: { en: 'Scope-Safe Calculator', pt: 'Calculadora Segura de Escopo' },
    scenario: {
      en: 'Rewrite a buggy global-dependent claims calculator using the proper scope pattern: parameters in, return values out.',
      pt: 'Reescreva uma calculadora de sinistros com bugs de global usando o padrão correto de escopo: parâmetros de entrada, retorno de saída.'
    },
    requirements: {
      en: [
        'def add_to_total(current_total, amount) → returns new total',
        'def process_claim(damage, deductible) → returns payout',
        'NO global variables',
        'Loop 3 claims, accumulate total using return values',
        'Print final total'
      ],
      pt: [
        'def add_to_total(total_atual, valor) → retorna novo total',
        'def process_claim(damage, deductible) → retorna pagamento',
        'SEM variáveis globais',
        'Percorra 3 sinistros, acumule total usando valores de retorno',
        'Imprima total final'
      ]
    },
    starterCode: `def add_to_total(current_total, amount):
    return current_total + amount

def process_claim(damage, deductible):
    return damage - deductible

claims = [(5230, 250), (8000, 300), (1200, 150)]

running_total = 0
for damage, ded in claims:
    payout = process_claim(damage, ded)
    running_total = add_to_total(running_total, payout)
    print("Claim payout:", payout)

print("Total:", running_total)`,
    testCases: [
      { id: 'tc16_1', description: { en: 'First payout = 4980', pt: 'Primeiro pagamento = 4980' }, inputs: [], checks: [{ type: 'contains', value: '4980' }], points: 20 },
      { id: 'tc16_2', description: { en: 'Second payout = 7700', pt: 'Segundo pagamento = 7700' }, inputs: [], checks: [{ type: 'contains', value: '7700' }], points: 20 },
      { id: 'tc16_3', description: { en: 'Third payout = 1050', pt: 'Terceiro pagamento = 1050' }, inputs: [], checks: [{ type: 'contains', value: '1050' }], points: 20 },
      { id: 'tc16_4', description: { en: 'Total = 13730', pt: 'Total = 13730' }, inputs: [], checks: [{ type: 'contains', value: '13730' }], points: 30 },
      { id: 'tc16_5', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 }
    ]
  }
}


export const phase17: Phase = {
  id: 17,
  title: { en: 'Reading Files', pt: 'Lendo Arquivos' },
  description: { en: 'Read data from files — the foundation of data pipelines.', pt: 'Leia dados de arquivos — a base dos pipelines de dados.' },
  icon: '📂',
  libraries: [],
  lesson: {
    title: { en: 'Opening and Reading Files', pt: 'Abrindo e Lendo Arquivos' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Every data pipeline starts with a file', pt: '🌍 Todo pipeline de dados começa com um arquivo' } },
      { type: 'text', content: {
        en: 'Netflix ingests billions of viewing logs daily from text files.\nYour bank exports your statement as a CSV.\nEvery ETL pipeline starts with open().\n\nFile I/O is the door between your program and the real world.',
        pt: 'A Netflix ingere bilhões de logs diariamente de arquivos de texto.\nSeu banco exporta seu extrato como CSV.\nTodo pipeline ETL começa com open().\n\nFile I/O é a porta entre seu programa e o mundo real.'
      }},
      { type: 'heading', content: { en: '🧩 A filing cabinet with a key', pt: '🧩 Um arquivo com uma chave' } },
      { type: 'text', content: {
        en: 'You need a key to open a filing cabinet (open()), read the document, then close it.\n\nPython\'s "with" block = automatic key that locks when you\'re done.\nNo need to remember to close — Python handles it.',
        pt: 'Você precisa de uma chave para abrir um arquivo (open()), ler o documento, depois fechar.\n\nO bloco "with" do Python = chave automática que trava quando você termina.\nNão precisa lembrar de fechar — Python cuida.'
      }},
      { type: 'code', code: `# Safe way to read a file
with open("claims.txt", "r") as f:   # "r" = read mode
    content = f.read()               # reads entire file
    print(content)

# Read line by line (better for large files)
with open("claims.txt", "r") as f:
    for line in f:
        print(line.strip())          # .strip() removes \\n` },
      { type: 'code', code: `# Simulate file data (for practice without a real file)
lines = [
    "CLM-001,Alice,5230,approved",
    "CLM-002,Bob,1200,pending",
    "CLM-003,Carlos,8000,approved"
]
for line in lines:
    parts = line.split(",")
    print("Client:", parts[1], "| Status:", parts[3])` },
      { type: 'tip', content: {
        en: '💡 Always use "with open()" — it closes the file automatically even if an error occurs.',
        pt: '💡 Sempre use "with open()" — fecha o arquivo automaticamente mesmo se ocorrer um erro.'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex17_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to use the split() method to break a CSV string into parts.\nThe code has 7 lines ready for you. You only need to fill in 1 blank — marked with ___.\n\nBlank 1 (line 5): Type split — this is the string method that splits "CLM-001,Alice,5230,approved" into ["CLM-001", "Alice", "5230", "approved"]\n\nExpected output:\nAlice → $ 5230',
        pt: 'Antes de começar: este exercício ensina como usar o método split() para dividir uma string CSV em partes.\nO código tem 7 linhas prontas. Você só precisa preencher 1 lacuna — marcada com ___.\n\nLacuna 1 (linha 5): Digite split — este é o método de string que divide "CLM-001,Alice,5230,approved" em ["CLM-001", "Alice", "5230", "approved"]\n\nSaída esperada:\nAlice → $ 5230'
      },
      starterCode: `data = [
    "CLM-001,Alice,5230,approved",
    "CLM-002,Bob,1200,pending"
]

for line in data:
    parts = line.___(","  )   # fill: method to split string
    if parts[3] == "approved":
        print(parts[1], "→ $", parts[2])`,
      hints: [
        { en: '.split(",") breaks the string at each comma', pt: '.split(",") quebra a string em cada vírgula' }
      ],
      sampleOutput: { en: 'Alice → $ 5230', pt: 'Alice → $ 5230' }
    },
    {
      id: 'ex17_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete code is already provided in the starter — read each line carefully, then run it as-is.\n\nWhat each line does:\ndata = [...] — a list of 4 CSV strings, each formatted as "id,name,damage,status"\nfor line in data: — loops through each string\n    parts = line.split(",") — splits "CLM-001,Alice,5230,approved" into ["CLM-001","Alice","5230","approved"]\n    if parts[3] == "approved": — checks the status at index 3\n        payout = int(parts[2]) - 250 — converts damage to integer, subtracts deductible\n        print(parts[1], "→ $", payout) — prints name and payout\nprint("Total: $", total) — prints the sum\n\nExpected output:\nAlice → $ 4980\nCarlos → $ 7750\nTotal: $ 12730',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO código completo já está fornecido no starter — leia cada linha com atenção e execute como está.\n\nO que cada linha faz:\ndata = [...] — uma lista de 4 strings CSV, cada uma no formato "id,nome,dano,status"\nfor line in data: — percorre cada string\n    parts = line.split(",") — divide "CLM-001,Alice,5230,approved" em ["CLM-001","Alice","5230","approved"]\n    if parts[3] == "approved": — verifica o status no índice 3\n        payout = int(parts[2]) - 250 — converte dano para inteiro, subtrai franquia\n        print(parts[1], "→ $", payout) — imprime nome e payout\nprint("Total: $", total) — imprime a soma\n\nSaída esperada:\nAlice → $ 4980\nCarlos → $ 7750\nTotal: $ 12730'
      },
      starterCode: `data = [
    "CLM-001,Alice,5230,approved",
    "CLM-002,Bob,1200,pending",
    "CLM-003,Carlos,8000,approved",
    "CLM-004,Diana,450,rejected"
]

total = 0
for line in data:
    parts = line.split(",")
    if parts[3] == "approved":
        payout = int(parts[2]) - 250
        total += payout
        print(parts[1], "→ $", payout)

print("Total: $", total)`,
      hints: [
        { en: 'parts[2] is the damage — convert with int()', pt: 'parts[2] é o dano — converta com int()' }
      ],
      sampleOutput: { en: 'Alice → $ 4980\nCarlos → $ 7750\nTotal: $ 12730', pt: 'Alice → $ 4980\nCarlos → $ 7750\nTotal: $ 12730' }
    }
  ],
  quiz: [
    { id: 'q17_1', question: { en: 'What does "r" mean in open("f.txt","r")?', pt: 'O que "r" significa em open("f.txt","r")?' }, options: [{ en: 'Read mode', pt: 'Modo leitura' }, { en: 'Run mode', pt: 'Modo execução' }, { en: 'Replace mode', pt: 'Modo substituição' }, { en: 'Random mode', pt: 'Modo aleatório' }], correctIndex: 0, explanation: { en: '"r" opens file for reading. File must exist or you get FileNotFoundError.', pt: '"r" abre arquivo para leitura. O arquivo deve existir ou você recebe FileNotFoundError.' } },
    { id: 'q17_2', question: { en: 'Why use "with open()" vs plain open()?', pt: 'Por que usar "with open()" vs open() simples?' }, options: [{ en: 'Auto-closes file even on error', pt: 'Fecha automaticamente mesmo com erro' }, { en: 'Reads faster', pt: 'Lê mais rápido' }, { en: 'Required in Python 3', pt: 'Obrigatório no Python 3' }, { en: 'No difference', pt: 'Sem diferença' }], correctIndex: 0, explanation: { en: '"with" guarantees closure even if code crashes inside. Always prefer it.', pt: '"with" garante fechamento mesmo se código travar. Sempre prefira.' } },
    { id: 'q17_3', question: { en: 'What does .strip() do to a line?', pt: 'O que .strip() faz numa linha?' }, options: [{ en: 'Removes whitespace and newlines from both ends', pt: 'Remove espaços e quebras de linha de ambos os lados' }, { en: 'Splits the line into parts', pt: 'Divide a linha em partes' }, { en: 'Converts to uppercase', pt: 'Converte para maiúsculas' }, { en: 'Removes all spaces', pt: 'Remove todos os espaços' }], correctIndex: 0, explanation: { en: '.strip() removes \\n and spaces from both ends. Essential when reading file lines.', pt: '.strip() remove \\n e espaços de ambos os lados. Essencial ao ler linhas de arquivo.' } },
    { id: 'q17_4', question: { en: '"hello,world".split(",") returns:', pt: '"hello,world".split(",") retorna:' }, options: [{ en: '["hello", "world"]', pt: '["hello", "world"]' }, { en: '"hello" and "world"', pt: '"hello" e "world"' }, { en: '("hello", "world")', pt: '("hello", "world")' }, { en: '{"hello": "world"}', pt: '{"hello": "world"}' }], correctIndex: 0, explanation: { en: '.split() returns a LIST of strings. "a,b,c".split(",") → ["a","b","c"].', pt: '.split() retorna uma LISTA de strings. "a,b,c".split(",") → ["a","b","c"].' } }
  ],
  exam: {
    title: { en: 'CSV Claims Parser', pt: 'Parser CSV de Sinistros' },
    scenario: { en: 'Parse CSV claim data and produce a summary.', pt: 'Parse dados CSV de sinistros e produza um resumo.' },
    requirements: { en: ['Loop 4 CSV lines', 'Split by comma', 'Process approved only', 'Subtract $250 deductible', 'Print approved claims + total'], pt: ['Percorra 4 linhas CSV', 'Divida por vírgula', 'Processe apenas aprovados', 'Subtraia R$250', 'Imprima aprovados + total'] },
    starterCode: `data = [
    "CLM-001,Alice,5230,approved",
    "CLM-002,Bob,1200,pending",
    "CLM-003,Carlos,8000,approved",
    "CLM-004,Diana,450,rejected"
]
total = 0
for line in data:
    parts = line.split(",")
    if parts[3] == "approved":
        payout = int(parts[2]) - 250
        total += payout
        print(parts[1], "→ $", payout)
print("Total: $", total)`,
    testCases: [
      { id: 'tc17_1', description: { en: 'Alice payout 4980', pt: 'Alice payout 4980' }, inputs: [], checks: [{ type: 'contains', value: '4980' }], points: 30 },
      { id: 'tc17_2', description: { en: 'Carlos payout 7750', pt: 'Carlos payout 7750' }, inputs: [], checks: [{ type: 'contains', value: '7750' }], points: 30 },
      { id: 'tc17_3', description: { en: 'Total 12730', pt: 'Total 12730' }, inputs: [], checks: [{ type: 'contains', value: '12730' }], points: 30 },
      { id: 'tc17_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 }
    ]
  }
}

export const phase18: Phase = {
  id: 18,
  title: { en: 'Writing Files', pt: 'Escrevendo Arquivos' },
  description: { en: 'Save program output to files — reports, logs, exports.', pt: 'Salve a saída do programa em arquivos — relatórios, logs, exportações.' },
  icon: '💾',
  libraries: [],
  lesson: {
    title: { en: 'Saving Data That Lasts', pt: 'Salvando Dados que Persistem' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Every log you\'ve seen was written by code', pt: '🌍 Todo log que você viu foi escrito por código' } },
      { type: 'text', content: {
        en: 'WhatsApp stores every message in files before syncing to the cloud.\nAWS writes millions of log lines per second.\nYour app error logs, export reports — all use f.write().\n\nNow you learn how.',
        pt: 'O WhatsApp armazena cada mensagem em arquivos antes de sincronizar.\nA AWS escreve milhões de linhas de log por segundo.\nOs logs de erro do app, relatórios de exportação — todos usam f.write().\n\nAgora você aprende como.'
      }},
      { type: 'heading', content: { en: '🧩 A receipt printer', pt: '🧩 Uma impressora de cupom' } },
      { type: 'text', content: {
        en: '🖨️ Open paper roll → open("w")\n🖨️ Print each line → f.write()\n🖨️ Cut and close → with block ends\n\n"w" = create/overwrite.\n"a" = append without erasing.',
        pt: '🖨️ Abrir rolo de papel → open("w")\n🖨️ Imprimir cada linha → f.write()\n🖨️ Cortar e fechar → bloco with termina\n\n"w" = criar/sobrescrever.\n"a" = acrescentar sem apagar.'
      }},
      { type: 'code', code: `# Write mode "w" — creates or overwrites
with open("report.txt", "w") as f:
    f.write("=== Claims Report ===\\n")
    f.write("Total claims: 3\\n")

# Append mode "a" — adds to end
with open("report.txt", "a") as f:
    f.write("New entry added.\\n")` },
      { type: 'code', code: `# Write CSV from a list
claims = [("Alice",5230,4980), ("Bob",1200,950), ("Carlos",8000,7750)]

with open("payouts.csv", "w") as f:
    f.write("client,damage,payout\\n")
    for name, damage, payout in claims:
        f.write(f"{name},{damage},{payout}\\n")

print("Saved to payouts.csv")` },
      { type: 'warning', content: {
        en: '⚠️ f.write() does NOT add newlines automatically.\nAlways add \\n at the end of each line, or everything runs together.',
        pt: '⚠️ f.write() NÃO adiciona quebras de linha automaticamente.\nSempre adicione \\n no final de cada linha, ou tudo fica junto.'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex18_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to open a file for writing and use the write() method.\nThe code has 3 lines ready for you. You only need to fill in 2 blanks — marked with ___.\n\nBlank 1 (line 1): Type w — this is the write mode that creates a new file (or overwrites if it exists)\nBlank 2 (lines 2 and 3): Type write — this is the file method that writes a string to the file\n\nExpected output:\nlog.txt created',
        pt: 'Antes de começar: este exercício ensina como abrir um arquivo para escrita e usar o método write().\nO código tem 3 linhas prontas. Você só precisa preencher 2 lacunas — marcadas com ___.\n\nLacuna 1 (linha 1): Digite w — este é o modo de escrita que cria um novo arquivo (ou sobrescreve se já existir)\nLacuna 2 (linhas 2 e 3): Digite write — este é o método de arquivo que escreve uma string no arquivo\n\nSaída esperada:\nlog.txt created'
      },
      starterCode: `with open("log.txt", "___") as f:   # fill: write mode
    f.___("Claim #1 processed.\\n")    # fill: write method
    f.___("Status: approved.\\n")`,
      hints: [
        { en: '"w" for write mode', pt: '"w" para modo escrita' },
        { en: '.write() writes to the file', pt: '.write() escreve no arquivo' }
      ],
      sampleOutput: { en: 'log.txt created', pt: 'log.txt criado' }
    },
    {
      id: 'ex18_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete code is already provided in the starter — read each line carefully, then run it as-is.\n\nWhat each line does:\nclaims = [("Alice",5230), ("Bob",1200), ("Carlos",8000)] — 3 name-damage tuples\nwith open("claims.csv", "w") as f: — creates claims.csv in write mode\n    f.write("client,damage,payout\\n") — writes the header row\n    for name, damage in claims: — loops through each tuple\n        payout = damage - 250 — applies the deductible\n        f.write(f"{name},{damage},{payout}\\n") — writes one CSV row per claim\nprint("Report saved!") — confirms the file was written\n\nExpected output:\nReport saved!',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO código completo já está fornecido no starter — leia cada linha com atenção e execute como está.\n\nO que cada linha faz:\nclaims = [("Alice",5230), ("Bob",1200), ("Carlos",8000)] — 3 tuplas nome-dano\nwith open("claims.csv", "w") as f: — cria claims.csv no modo de escrita\n    f.write("client,damage,payout\\n") — escreve a linha de cabeçalho\n    for name, damage in claims: — percorre cada tupla\n        payout = damage - 250 — aplica a franquia\n        f.write(f"{name},{damage},{payout}\\n") — escreve uma linha CSV por sinistro\nprint("Report saved!") — confirma que o arquivo foi escrito\n\nSaída esperada:\nReport saved!'
      },
      starterCode: `claims = [("Alice",5230), ("Bob",1200), ("Carlos",8000)]

with open("claims.csv", "w") as f:
    f.write("client,damage,payout\\n")
    for name, damage in claims:
        payout = damage - 250
        f.write(f"{name},{damage},{payout}\\n")

print("Report saved!")`,
      hints: [{ en: 'Calculate payout inside the loop', pt: 'Calcule payout dentro do loop' }],
      sampleOutput: { en: 'Report saved!', pt: 'Report saved!' }
    }
  ],
  quiz: [
    { id: 'q18_1', question: { en: 'Mode "w" does what?', pt: 'Modo "w" faz o quê?' }, options: [{ en: 'Creates or overwrites the file', pt: 'Cria ou sobrescreve o arquivo' }, { en: 'Appends to existing', pt: 'Acrescenta ao existente' }, { en: 'Read only', pt: 'Somente leitura' }, { en: 'Write and read', pt: 'Escrita e leitura' }], correctIndex: 0, explanation: { en: '"w" creates a new file. If it already exists, it ERASES content and starts fresh.', pt: '"w" cria um novo arquivo. Se já existe, APAGA o conteúdo e começa do zero.' } },
    { id: 'q18_2', question: { en: 'Mode "a" does what?', pt: 'Modo "a" faz o quê?' }, options: [{ en: 'Appends — adds to end without erasing', pt: 'Acrescenta — adiciona ao final sem apagar' }, { en: 'Same as "w"', pt: 'Igual ao "w"' }, { en: 'Creates only if new', pt: 'Cria apenas se novo' }, { en: 'Auto mode', pt: 'Modo automático' }], correctIndex: 0, explanation: { en: '"a" = append. Adds to the END. Existing content is preserved.', pt: '"a" = acrescentar. Adiciona ao FINAL. Conteúdo existente é preservado.' } },
    { id: 'q18_3', question: { en: 'f.write("hello") — what is missing?', pt: 'f.write("hello") — o que falta?' }, options: [{ en: 'A newline: f.write("hello\\n")', pt: 'Uma quebra: f.write("hello\\n")' }, { en: 'Nothing', pt: 'Nada' }, { en: 'A print() after', pt: 'Um print() depois' }, { en: 'Quotes around hello', pt: 'Aspas em volta de hello' }], correctIndex: 0, explanation: { en: 'write() never adds \\n automatically. Add it yourself for separate lines.', pt: 'write() nunca adiciona \\n. Adicione você mesmo para linhas separadas.' } },
    { id: 'q18_4', question: { en: 'To write number 42 to file:', pt: 'Para escrever o número 42 no arquivo:' }, options: [{ en: 'f.write(str(42)) or f.write(f"{42}")', pt: 'f.write(str(42)) ou f.write(f"{42}")' }, { en: 'f.write(42)', pt: 'f.write(42)' }, { en: 'print(42, file=f)', pt: 'print(42, file=f)' }, { en: 'Impossible', pt: 'Impossível' }], correctIndex: 0, explanation: { en: 'write() only accepts strings. Convert numbers with str() or use f-strings.', pt: 'write() aceita apenas strings. Converta números com str() ou use f-strings.' } }
  ],
  exam: {
    title: { en: 'Generate CSV Report', pt: 'Gerar Relatório CSV' },
    scenario: { en: 'Write a complete CSV claims report.', pt: 'Escreva um relatório completo de sinistros em CSV.' },
    requirements: { en: ['CSV header: id,client,damage,payout', '4 claim rows with calculated payout', 'Print total', 'No errors'], pt: ['Header CSV: id,client,damage,payout', '4 linhas com payout calculado', 'Imprima total', 'Sem erros'] },
    starterCode: `claims = [(1,"Alice",5230,250),(2,"Bob",1200,250),(3,"Carlos",8000,300),(4,"Diana",900,150)]
total = 0
with open("report.csv", "w") as f:
    f.write("id,client,damage,payout\\n")
    for cid, name, damage, ded in claims:
        payout = damage - ded
        total += payout
        f.write(f"{cid},{name},{damage},{payout}\\n")
print("Total payout: $", total)
print("Saved to report.csv")`,
    testCases: [
      { id: 'tc18_1', description: { en: 'Shows total', pt: 'Mostra total' }, inputs: [], checks: [{ type: 'contains', value: 'Total' }], points: 30 },
      { id: 'tc18_2', description: { en: 'Total = 14230', pt: 'Total = 14230' }, inputs: [], checks: [{ type: 'contains', value: '14230' }], points: 40 },
      { id: 'tc18_3', description: { en: 'Shows saved', pt: 'Mostra salvo' }, inputs: [], checks: [{ type: 'contains', value: 'Saved' }], points: 20 },
      { id: 'tc18_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 }
    ]
  }
}

export const phase19: Phase = {
  id: 19,
  title: { en: 'JSON Data', pt: 'Dados JSON' },
  description: { en: 'The universal language of APIs — read and write structured data.', pt: 'A linguagem universal das APIs — leia e escreva dados estruturados.' },
  icon: '🌐',
  libraries: [],
  lesson: {
    title: { en: 'JSON: The Internet\'s Language', pt: 'JSON: A Língua da Internet' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Every API speaks JSON', pt: '🌍 Toda API fala JSON' } },
      { type: 'text', content: {
        en: 'iFood, Nubank, Mercado Livre — they all exchange data in JSON.\nJSON = Python dict, but as plain text that any language can read.',
        pt: 'iFood, Nubank, Mercado Livre — todos trocam dados em JSON.\nJSON = dict Python, mas como texto simples que qualquer linguagem lê.'
      }},
      { type: 'heading', content: { en: '🧩 A universal shipping label', pt: '🧩 Uma etiqueta universal' } },
      { type: 'text', content: {
        en: 'JSON = a data label every system understands.\nPython reads it. JavaScript reads it. Java reads it.\nThe "s" in dumps/loads means String.',
        pt: 'JSON = etiqueta de dados que todo sistema entende.\nPython lê. JavaScript lê. Java lê.\nO "s" em dumps/loads significa String.'
      }},
      { type: 'heading', content: { en: '🐍 Step 1 — dict ↔ JSON string', pt: '🐍 Passo 1 — dict ↔ string JSON' } },
      { type: 'code', code: `import json

claim = {"id": 2501, "client": "Alice", "damage": 5230}

# Dict → JSON string (for sending/saving)
json_str = json.dumps(claim)
print(json_str)   # {"id": 2501, "client": "Alice", "damage": 5230}

# JSON string → dict (from API/file)
restored = json.loads(json_str)
print(restored["client"])   # Alice` },
      { type: 'heading', content: { en: '🐍 Step 2 — save/load JSON files', pt: '🐍 Passo 2 — salvar/carregar arquivos JSON' } },
      { type: 'code', code: `import json

claims = [{"id": 1, "client": "Alice"}, {"id": 2, "client": "Bob"}]

# Save to file (no "s")
with open("claims.json", "w") as f:
    json.dump(claims, f, indent=2)

# Load from file (no "s")
with open("claims.json", "r") as f:
    loaded = json.load(f)

print(loaded[0]["client"])   # Alice` },
      { type: 'tip', content: {
        en: '💡 Memory: dumps/loads → Strings (has "s")\n       dump/load   → Files  (no "s")',
        pt: '💡 Memória: dumps/loads → Strings (tem "s")\n           dump/load   → Arquivos (sem "s")'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex19_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches the difference between json.dumps() (dict to string) and json.loads() (string to dict).\nThe code has 8 lines ready for you. You only need to fill in 2 blanks — marked with ___.\n\nBlank 1 (line 5): Type dumps — converts the Python dict claim into a JSON string\nBlank 2 (line 8): Type loads — parses the JSON string back into a Python dict\n\nExpected output:\n{"id": 1, "client": "Maria", "damage": 4500}\nMaria',
        pt: 'Antes de começar: este exercício ensina a diferença entre json.dumps() (dict para string) e json.loads() (string para dict).\nO código tem 8 linhas prontas. Você só precisa preencher 2 lacunas — marcadas com ___.\n\nLacuna 1 (linha 5): Digite dumps — converte o dict Python claim em uma string JSON\nLacuna 2 (linha 8): Digite loads — converte a string JSON de volta em um dict Python\n\nSaída esperada:\n{"id": 1, "client": "Maria", "damage": 4500}\nMaria'
      },
      starterCode: `import json

claim = {"id": 1, "client": "Maria", "damage": 4500}

json_str = json.___(claim)        # fill: dict → string
print(json_str)

restored = json.___(json_str)     # fill: string → dict
print(restored["client"])`,
      hints: [
        { en: 'dict → string: json.dumps()', pt: 'dict → string: json.dumps()' },
        { en: 'string → dict: json.loads()', pt: 'string → dict: json.loads()' }
      ],
      sampleOutput: { en: '{"id": 1, "client": "Maria", "damage": 4500}\nMaria', pt: '{"id": 1, "client": "Maria", "damage": 4500}\nMaria' }
    },
    {
      id: 'ex19_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete pipeline is already provided in the starter — read each section carefully, then run it as-is.\n\nWhat each section does:\napi_data = \'[...]\' — a JSON string simulating an API response with 3 claims\nclaims = json.loads(api_data) — parses the JSON string into a Python list of dicts\nfor c in claims: — loops through each claim dict\n    payout = c["damage"] - c["ded"] — calculates payout for this claim\n    results.append({...}) — builds a new dict with id, client, and payout\nwith open("output.json", "w") as f: json.dump(results, f, indent=2) — saves results to file\nprint("Total: $", total) — prints the sum of all payouts\n\nExpected output:\nTotal: $ 13430',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO pipeline completo já está fornecido no starter — leia cada seção com atenção e execute como está.\n\nO que cada seção faz:\napi_data = \'[...]\' — uma string JSON simulando resposta de API com 3 sinistros\nclaims = json.loads(api_data) — converte a string JSON em uma lista Python de dicts\nfor c in claims: — percorre cada dict de sinistro\n    payout = c["damage"] - c["ded"] — calcula o payout deste sinistro\n    results.append({...}) — constrói um novo dict com id, client e payout\nwith open("output.json", "w") as f: json.dump(results, f, indent=2) — salva resultados em arquivo\nprint("Total: $", total) — imprime a soma de todos os payouts\n\nSaída esperada:\nTotal: $ 13430'
      },
      starterCode: `import json

api_data = '[{"id":1,"client":"Alice","damage":5230,"ded":250},{"id":2,"client":"Bob","damage":1200,"ded":250},{"id":3,"client":"Carlos","damage":8000,"ded":300}]'

claims = json.loads(api_data)
results = []
total = 0

for c in claims:
    payout = c["damage"] - c["ded"]
    total += payout
    results.append({"id": c["id"], "client": c["client"], "payout": payout})

with open("output.json", "w") as f:
    json.dump(results, f, indent=2)

print("Total: $", total)`,
      hints: [{ en: 'json.loads() parses the string; json.dump() saves to file', pt: 'json.loads() parseia a string; json.dump() salva no arquivo' }],
      sampleOutput: { en: 'Total: $ 13430', pt: 'Total: $ 13430' }
    }
  ],
  quiz: [
    { id: 'q19_1', question: { en: 'json.dumps(data) converts:', pt: 'json.dumps(data) converte:' }, options: [{ en: 'Python dict → JSON string', pt: 'Dict Python → string JSON' }, { en: 'JSON string → Python dict', pt: 'String JSON → dict Python' }, { en: 'Dict → file', pt: 'Dict → arquivo' }, { en: 'File → dict', pt: 'Arquivo → dict' }], correctIndex: 0, explanation: { en: 'dumps() = dump to String. The "s" = string.', pt: 'dumps() = dump para String. O "s" = string.' } },
    { id: 'q19_2', question: { en: 'json.loads(text) converts:', pt: 'json.loads(texto) converte:' }, options: [{ en: 'JSON string → Python dict', pt: 'String JSON → dict Python' }, { en: 'Python dict → string', pt: 'Dict Python → string' }, { en: 'File → dict', pt: 'Arquivo → dict' }, { en: 'Dict → list', pt: 'Dict → lista' }], correctIndex: 0, explanation: { en: 'loads() = load from String. JSON text → Python dict.', pt: 'loads() = carregar de String. Texto JSON → dict Python.' } },
    { id: 'q19_3', question: { en: 'Difference: json.dump() vs json.dumps()?', pt: 'Diferença: json.dump() vs json.dumps()?' }, options: [{ en: 'dump() → file; dumps() → string', pt: 'dump() → arquivo; dumps() → string' }, { en: 'dumps() → file; dump() → string', pt: 'dumps() → arquivo; dump() → string' }, { en: 'No difference', pt: 'Sem diferença' }, { en: 'dump() is faster', pt: 'dump() é mais rápido' }], correctIndex: 0, explanation: { en: 'dump() writes to a file object. dumps() writes to a string in memory.', pt: 'dump() escreve num arquivo. dumps() escreve numa string na memória.' } },
    { id: 'q19_4', question: { en: 'What does indent=2 do?', pt: 'O que indent=2 faz?' }, options: [{ en: 'Formats JSON for human readability', pt: 'Formata JSON para leitura humana' }, { en: 'Limits to 2 keys', pt: 'Limita a 2 chaves' }, { en: 'Adds 2 items', pt: 'Adiciona 2 itens' }, { en: 'Required for valid JSON', pt: 'Obrigatório para JSON válido' }], correctIndex: 0, explanation: { en: 'indent adds whitespace for readability. Without it, everything is on one line.', pt: 'indent adiciona espaço para legibilidade. Sem ele, tudo fica em uma linha.' } }
  ],
  exam: {
    title: { en: 'JSON Claims Pipeline', pt: 'Pipeline JSON de Sinistros' },
    scenario: { en: 'Parse JSON from API, process claims, save results.', pt: 'Parse JSON de API, processe sinistros, salve resultados.' },
    requirements: { en: ['Parse JSON string of 4 claims', 'Calculate payout each', 'Save results to output.json', 'Print total'], pt: ['Parse string JSON de 4 sinistros', 'Calcule payout de cada', 'Salve em output.json', 'Imprima total'] },
    starterCode: `import json

api = '[{"id":1,"client":"Alice","damage":5230,"ded":250},{"id":2,"client":"Bob","damage":1200,"ded":250},{"id":3,"client":"Carlos","damage":8000,"ded":300},{"id":4,"client":"Diana","damage":900,"ded":150}]'

claims = json.loads(api)
results = []
total = 0

for c in claims:
    payout = c["damage"] - c["ded"]
    total += payout
    results.append({"client": c["client"], "payout": payout})

with open("output.json", "w") as f:
    json.dump(results, f, indent=2)

print("Total: $", total)`,
    testCases: [
      { id: 'tc19_1', description: { en: 'Total correct', pt: 'Total correto' }, inputs: [], checks: [{ type: 'contains', value: '14430' }], points: 40 },
      { id: 'tc19_2', description: { en: 'Shows total', pt: 'Mostra total' }, inputs: [], checks: [{ type: 'contains', value: 'Total' }], points: 20 },
      { id: 'tc19_3', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 40 }
    ]
  }
}



export const phase20: Phase = {
  id: 20,
  title: { en: 'DateTime', pt: 'Data e Hora' },
  description: { en: 'Work with dates and times — for SLAs, deadlines and reports.', pt: 'Trabalhe com datas e horas — para SLAs, prazos e relatórios.' },
  icon: '📅',
  libraries: [],
  lesson: {
    title: { en: 'Time is Data Too', pt: 'Tempo Também é Dado' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Every SLA and deadline is a datetime calculation', pt: '🌍 Todo SLA e prazo é um cálculo de datetime' } },
      { type: 'text', content: {
        en: 'When a claim arrives → system logs a timestamp.\nWhen it must be resolved → timestamp + SLA days.\nWhen adjuster calls → another timestamp.\n\ndatetime is how software tracks everything in time.',
        pt: 'Quando um sinistro chega → sistema registra timestamp.\nQuando deve ser resolvido → timestamp + dias de SLA.\nQuando o ajustador liga → outro timestamp.\n\ndatetime é como software rastreia tudo no tempo.'
      }},
      { type: 'heading', content: { en: '🧩 Calendar + stopwatch merged into one object', pt: '🧩 Calendário + cronômetro fundidos num objeto' } },
      { type: 'text', content: {
        en: 'datetime = calendar page + clock face.\nYou can:\n• Read today\'s date/time\n• Add or subtract days\n• Calculate how many days between two dates',
        pt: 'datetime = página de calendário + mostrador de relógio.\nVocê pode:\n• Ler a data/hora de hoje\n• Adicionar ou subtrair dias\n• Calcular quantos dias entre duas datas'
      }},
      { type: 'code', code: `from datetime import datetime, timedelta

now = datetime.now()
print(now.year)                     # 2026
print(now.strftime("%Y-%m-%d"))     # 2026-07-11

# Add 5 days (SLA deadline)
deadline = now + timedelta(days=5)
print("Deadline:", deadline.strftime("%Y-%m-%d"))

# Days between two dates
opened = datetime(2026, 7, 1)
today  = datetime(2026, 7, 11)
open_days = (today - opened).days
print("Open for:", open_days, "days")  # 10` },
      { type: 'tip', content: {
        en: '💡 strftime() format codes:\n%Y = 4-digit year  %m = month  %d = day\n%H = hour  %M = minute\nExample: now.strftime("%d/%m/%Y") → "11/07/2026"',
        pt: '💡 Códigos do strftime():\n%Y = ano 4 dígitos  %m = mês  %d = dia\n%H = hora  %M = minuto\nExemplo: now.strftime("%d/%m/%Y") → "11/07/2026"'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex20_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to import timedelta and use it to calculate a future date.\nThe code has 4 lines ready for you. You only need to fill in 3 blanks — marked with ___.\n\nBlank 1 (line 1): Type timedelta — this is the class to import alongside datetime\nBlank 2 (line 4): Type timedelta — this creates a duration of sla_days days to add to the date\nBlank 3 (line 5): Type %Y-%m-%d — this format pattern produces "2026-07-16"\n\nExpected output:\nDeadline: 2026-07-16',
        pt: 'Antes de começar: este exercício ensina como importar timedelta e usá-lo para calcular uma data futura.\nO código tem 4 linhas prontas. Você só precisa preencher 3 lacunas — marcadas com ___.\n\nLacuna 1 (linha 1): Digite timedelta — essa é a classe a importar junto com datetime\nLacuna 2 (linha 4): Digite timedelta — cria uma duração de sla_days dias para adicionar à data\nLacuna 3 (linha 5): Digite %Y-%m-%d — esse padrão de formato produz "2026-07-16"\n\nSaída esperada:\nDeadline: 2026-07-16'
      },
      starterCode: `from datetime import datetime, ___   # fill: timedelta

claim_date = datetime(2026, 7, 11)
sla_days = 5
deadline = claim_date + ___(days=sla_days)  # fill
print("Deadline:", deadline.strftime("___")) # fill: YYYY-MM-DD`,
      hints: [
        { en: 'Import timedelta alongside datetime', pt: 'Importe timedelta junto com datetime' },
        { en: 'Format string: "%Y-%m-%d"', pt: 'String de formato: "%Y-%m-%d"' }
      ],
      sampleOutput: { en: 'Deadline: 2026-07-16', pt: 'Deadline: 2026-07-16' }
    },
    {
      id: 'ex20_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete code is already provided in the starter — read each line carefully, then run it as-is.\n\nWhat each line does:\ntoday = datetime(2026, 7, 11) — sets a fixed reference date\nclaims = [...] — 3 claim dicts, each with "client" and "opened" date\nfor c in claims: — loops through each claim\n    days = (today - c["opened"]).days — subtracts dates to get elapsed days as an integer\n    status = "OVERDUE" if days > 7 else "On time" — flags if past 7-day threshold\n    print(...) — shows client, days elapsed, and status\n\nExpected output:\nAlice → 10 days → OVERDUE\nBob → 3 days → On time\nCarlos → 1 days → On time',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO código completo já está fornecido no starter — leia cada linha com atenção e execute como está.\n\nO que cada linha faz:\ntoday = datetime(2026, 7, 11) — define uma data de referência fixa\nclaims = [...] — 3 dicts de sinistro, cada um com "client" e data "opened"\nfor c in claims: — percorre cada sinistro\n    days = (today - c["opened"]).days — subtrai datas para obter dias decorridos como inteiro\n    status = "OVERDUE" if days > 7 else "On time" — sinaliza se passou do limite de 7 dias\n    print(...) — exibe cliente, dias decorridos e status\n\nSaída esperada:\nAlice → 10 days → OVERDUE\nBob → 3 days → On time\nCarlos → 1 days → On time'
      },
      starterCode: `from datetime import datetime

today = datetime(2026, 7, 11)
claims = [
    {"client": "Alice",  "opened": datetime(2026, 7,  1)},
    {"client": "Bob",    "opened": datetime(2026, 7,  8)},
    {"client": "Carlos", "opened": datetime(2026, 7, 10)}
]

for c in claims:
    days = (today - c["opened"]).days
    status = "OVERDUE" if days > 7 else "On time"
    print(c["client"], "→", days, "days →", status)`,
      hints: [{ en: '(today - opened).days gives integer days', pt: '(hoje - abertura).days dá dias inteiros' }],
      sampleOutput: { en: 'Alice → 10 days → OVERDUE\nBob → 3 days → On time\nCarlos → 1 days → On time', pt: 'Alice → 10 days → OVERDUE\nBob → 3 days → On time\nCarlos → 1 days → On time' }
    }
  ],
  quiz: [
    { id: 'q20_1', question: { en: 'How to get today\'s date and time?', pt: 'Como obter data e hora de hoje?' }, options: [{ en: 'datetime.now()', pt: 'datetime.now()' }, { en: 'datetime.today', pt: 'datetime.today' }, { en: 'today()', pt: 'today()' }, { en: 'date.now()', pt: 'date.now()' }], correctIndex: 0, explanation: { en: 'datetime.now() returns a datetime object with current date and time.', pt: 'datetime.now() retorna um objeto datetime com data e hora atuais.' } },
    { id: 'q20_2', question: { en: 'How to add 7 days to a datetime?', pt: 'Como adicionar 7 dias a um datetime?' }, options: [{ en: 'date + timedelta(days=7)', pt: 'date + timedelta(days=7)' }, { en: 'date + 7', pt: 'date + 7' }, { en: 'date.add(7)', pt: 'date.add(7)' }, { en: 'date.days += 7', pt: 'date.days += 7' }], correctIndex: 0, explanation: { en: 'timedelta represents a duration. Add it to a datetime to get a new date.', pt: 'timedelta representa uma duração. Adicione a um datetime para obter nova data.' } },
    { id: 'q20_3', question: { en: 'How to get days between two dates?', pt: 'Como obter dias entre duas datas?' }, options: [{ en: '(date2 - date1).days', pt: '(date2 - date1).days' }, { en: 'date2 - date1', pt: 'date2 - date1' }, { en: 'timedelta(date2, date1)', pt: 'timedelta(date2, date1)' }, { en: 'days(date2, date1)', pt: 'days(date2, date1)' }], correctIndex: 0, explanation: { en: 'Subtracting datetimes returns a timedelta. .days gives the integer count.', pt: 'Subtrair datetimes retorna timedelta. .days dá a contagem inteira.' } },
    { id: 'q20_4', question: { en: 'strftime("%d/%m/%Y") on 2026-07-11 gives:', pt: 'strftime("%d/%m/%Y") em 2026-07-11 dá:' }, options: [{ en: '"11/07/2026"', pt: '"11/07/2026"' }, { en: '"2026/07/11"', pt: '"2026/07/11"' }, { en: '"07-11-2026"', pt: '"07-11-2026"' }, { en: '"11-07-2026"', pt: '"11-07-2026"' }], correctIndex: 0, explanation: { en: '%d = day, %m = month, %Y = 4-digit year. Separator is what you put between.', pt: '%d = dia, %m = mês, %Y = ano 4 dígitos. Separador é o que você coloca entre eles.' } }
  ],
  exam: {
    title: { en: 'SLA Compliance Report', pt: 'Relatório de Conformidade SLA' },
    scenario: { en: 'Check which claims missed SLA (must resolve within 5 days).', pt: 'Verifique quais sinistros perderam o SLA (5 dias para resolver).' },
    requirements: { en: ['4 claims with open dates', 'Calculate days open', 'Flag OVERDUE if > 5 days', 'Count overdue', 'Print each + count'], pt: ['4 sinistros com datas', 'Calcule dias abertos', 'OVERDUE se > 5 dias', 'Contagem de atrasados', 'Imprima cada + contagem'] },
    starterCode: `from datetime import datetime

today = datetime(2026, 7, 11)
claims = [
    {"client": "Alice",  "opened": datetime(2026, 7,  1)},
    {"client": "Bob",    "opened": datetime(2026, 7,  9)},
    {"client": "Carlos", "opened": datetime(2026, 7, 10)},
    {"client": "Diana",  "opened": datetime(2026, 7,  4)}
]

overdue = 0
for c in claims:
    days = (today - c["opened"]).days
    status = "OVERDUE" if days > 5 else "On time"
    if days > 5: overdue += 1
    print(c["client"], "→", days, "days →", status)

print("Overdue:", overdue)`,
    testCases: [
      { id: 'tc20_1', description: { en: 'Alice OVERDUE', pt: 'Alice OVERDUE' }, inputs: [], checks: [{ type: 'contains', value: 'OVERDUE' }], points: 25 },
      { id: 'tc20_2', description: { en: 'Carlos On time', pt: 'Carlos On time' }, inputs: [], checks: [{ type: 'contains', value: 'On time' }], points: 25 },
      { id: 'tc20_3', description: { en: 'Overdue count', pt: 'Contagem overdue' }, inputs: [], checks: [{ type: 'contains', value: 'Overdue' }], points: 25 },
      { id: 'tc20_4', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 25 }
    ]
  }
}

export const phase21: Phase = {
  id: 21,
  title: { en: 'Random Module', pt: 'Módulo Random' },
  description: { en: 'Generate random values — for simulations, sampling, and testing.', pt: 'Gere valores aleatórios — para simulações, amostragem e testes.' },
  icon: '🎲',
  libraries: [],
  lesson: {
    title: { en: 'Controlled Randomness', pt: 'Aleatoriedade Controlada' },
    blocks: [
      { type: 'heading', content: { en: '🌍 Insurance companies simulate risk with random', pt: '🌍 Seguradoras simulam risco com random' } },
      { type: 'text', content: {
        en: 'Insurance uses Monte Carlo simulations:\n"If we insure 10,000 homes, how many will claim in a storm?"\n\nRun the simulation 1 million times with random values → predict real costs.\nSame concept: Python random module.',
        pt: 'Seguradoras usam simulações Monte Carlo:\n"Se assegurarmos 10.000 casas, quantas reclamarão numa tempestade?"\n\nRodam a simulação 1 milhão de vezes com valores aleatórios → preveem custos reais.\nMesmo conceito: módulo random do Python.'
      }},
      { type: 'heading', content: { en: '🧩 Dice with rules', pt: '🧩 Dados com regras' } },
      { type: 'text', content: {
        en: 'A die roll is random — but constrained to 1–6.\nrandom lets you roll any "die":\n• randint(1,6) = dice roll\n• choice(list) = pick from options\n• random() = float 0.0–1.0',
        pt: 'Um dado é aleatório — mas limitado a 1–6.\nrandom permite jogar qualquer "dado":\n• randint(1,6) = jogar dado\n• choice(lista) = escolher opção\n• random() = float 0.0–1.0'
      }},
      { type: 'code', code: `import random

print(random.randint(1, 100))        # random int 1–100

clients = ["Alice", "Bob", "Carlos", "Diana"]
print(random.choice(clients))        # pick one

print(random.sample(clients, 2))     # pick 2, no repeats

random.shuffle(clients)
print(clients)                       # shuffled list

print(random.random())               # float 0.0–1.0` },
      { type: 'tip', content: {
        en: '💡 random.seed(42) makes results reproducible.\nSame seed = same results every run. Great for testing.',
        pt: '💡 random.seed(42) torna resultados reproduzíveis.\nMesma seed = mesmos resultados. Ótimo para testes.'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex21_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to use random.choice() to pick from a list and random.randint() to generate a random integer.\nThe code has 7 lines ready for you. You only need to fill in 2 blanks — marked with ___.\n\nBlank 1 (line 5): Type choice — random.choice(clients) picks one name at random from the list\nBlank 2 (line 8): Type randint — random.randint(500, 10000) generates a random integer between 500 and 10000 inclusive\n\nExpected output:\nAudit: Carlos\nSimulated damage: $ 4782',
        pt: 'Antes de começar: este exercício ensina como usar random.choice() para escolher de uma lista e random.randint() para gerar um inteiro aleatório.\nO código tem 7 linhas prontas. Você só precisa preencher 2 lacunas — marcadas com ___.\n\nLacuna 1 (linha 5): Digite choice — random.choice(clients) escolhe um nome aleatório da lista\nLacuna 2 (linha 8): Digite randint — random.randint(500, 10000) gera um inteiro aleatório entre 500 e 10000 inclusive\n\nSaída esperada:\nAudit: Carlos\nSimulated damage: $ 4782'
      },
      starterCode: `import random

clients = ["Alice", "Bob", "Carlos", "Diana", "Eduardo"]

audited = random.___(clients)          # fill: pick one
print("Audit:", audited)

damage = random.___(500, 10000)        # fill: random int
print("Simulated damage: $", damage)`,
      hints: [
        { en: 'random.choice() picks one item', pt: 'random.choice() escolhe um item' },
        { en: 'random.randint(min, max) picks a random int', pt: 'random.randint(min, max) gera inteiro aleatório' }
      ],
      sampleOutput: { en: 'Audit: Carlos\nSimulated damage: $ 4782', pt: 'Audit: Carlos\nSimulated damage: $ 4782' }
    },
    {
      id: 'ex21_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete simulation is already provided in the starter — read it carefully, then run it as-is.\n\nWhat each part does:\nrandom.seed(42) — fixes the random sequence so every run gives the same numbers\nfor i in range(5): — simulates 5 claims\n    damage = random.randint(500, 12000) — generates a random damage value\n    payout = damage - 250 — applies the deductible\n    risk = "HIGH" if damage > 5000 else "normal" — classifies each claim\n    if damage > 5000: high_risk += 1 — counts high-risk claims\n    print(...) — shows each simulated claim\nprint("High risk:", high_risk) — prints the total count\n\nExpected output:\nClaim 1: $4634 → $4384 [normal]\nHigh risk: 2',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nA simulação completa já está fornecida no starter — leia com atenção e execute como está.\n\nO que cada parte faz:\nrandom.seed(42) — fixa a sequência aleatória para que cada execução dê os mesmos números\nfor i in range(5): — simula 5 sinistros\n    damage = random.randint(500, 12000) — gera um valor de dano aleatório\n    payout = damage - 250 — aplica a franquia\n    risk = "HIGH" if damage > 5000 else "normal" — classifica cada sinistro\n    if damage > 5000: high_risk += 1 — conta sinistros de alto risco\n    print(...) — exibe cada sinistro simulado\nprint("High risk:", high_risk) — imprime o total\n\nSaída esperada:\nClaim 1: $4634 → $4384 [normal]\nHigh risk: 2'
      },
      starterCode: `import random
random.seed(42)

high_risk = 0
for i in range(5):
    damage = random.randint(500, 12000)
    payout = damage - 250
    risk = "HIGH" if damage > 5000 else "normal"
    if damage > 5000: high_risk += 1
    print(f"Claim {i+1}: \${damage} → \${payout} [{risk}]")

print("High risk:", high_risk)`,
      hints: [{ en: 'random.randint(500, 12000) generates the damage', pt: 'random.randint(500, 12000) gera o dano' }],
      sampleOutput: { en: 'Claim 1: $4634 → $4384 [normal]\nHigh risk: 2', pt: 'Claim 1: $4634 → $4384 [normal]\nHigh risk: 2' }
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
    scenario: { en: 'Simulate 10 claims and produce a risk report.', pt: 'Simule 10 sinistros e produza um relatório de risco.' },
    requirements: { en: ['10 random damages $200–$15000', '$250 deductible', 'Critical>8k, Urgent 3k-8k, Normal<3k', 'Print each + totals'], pt: ['10 danos aleatórios R$200–R$15000', 'R$250 franquia', 'Crítico>8k, Urgente 3k-8k, Normal<3k', 'Imprima cada + totais'] },
    starterCode: `import random
random.seed(99)

critical = urgent = normal_c = 0
total = 0

for i in range(10):
    damage = random.randint(200, 15000)
    payout = damage - 250
    total += payout
    if damage > 8000:   level = "CRITICAL"; critical += 1
    elif damage >= 3000: level = "URGENT";  urgent += 1
    else:                level = "normal";  normal_c += 1
    print(f"#{i+1}: \${damage} → \${payout} [{level}]")

print(f"Critical:{critical} Urgent:{urgent} Normal:{normal_c}")
print("Total: $", total)`,
    testCases: [
      { id: 'tc21_1', description: { en: 'Shows CRITICAL', pt: 'Mostra CRITICAL' }, inputs: [], checks: [{ type: 'contains', value: 'CRITICAL' }], points: 25 },
      { id: 'tc21_2', description: { en: 'Count summary shown', pt: 'Resumo de contagem' }, inputs: [], checks: [{ type: 'contains', value: 'Critical' }], points: 25 },
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
      { type: 'heading', content: { en: '🌍 Engineers and actuaries use math daily', pt: '🌍 Engenheiros e atuários usam math diariamente' } },
      { type: 'text', content: {
        en: 'Civil engineers calculate beam stress with math.sqrt().\nInsurance actuaries use math.log() for mortality tables.\nData scientists use math.pi for circular calculations.\n\nmath module = Python\'s scientific calculator.',
        pt: 'Engenheiros civis calculam tensão de vigas com math.sqrt().\nAtuários usam math.log() para tabelas de mortalidade.\nCientistas de dados usam math.pi para cálculos circulares.\n\nmódulo math = calculadora científica do Python.'
      }},
      { type: 'heading', content: { en: '🧩 Extra buttons on a scientific calculator', pt: '🧩 Botões extras de calculadora científica' } },
      { type: 'text', content: {
        en: 'Basic Python = pocket calculator (+, -, *, /)\nmath module = the √, log, π, ceil, floor buttons\n\nimport math to unlock them.',
        pt: 'Python básico = calculadora de bolso (+, -, *, /)\nmódulo math = os botões √, log, π, ceil, floor\n\nimport math para desbloqueá-los.'
      }},
      { type: 'code', code: `import math

print(math.pi)          # 3.14159...
print(math.sqrt(144))   # 12.0
print(math.pow(2, 10))  # 1024.0

# Rounding
print(math.ceil(4.1))   # 5 — always UP
print(math.floor(4.9))  # 4 — always DOWN

# Compound interest formula: A = P * (1+r)^t
principal = 10000
amount = principal * math.pow(1.08, 5)
print(f"After 5 years: \${amount:.2f}")` },
      { type: 'tip', content: {
        en: '💡 ceil vs floor vs round:\n• ceil(4.1) = 5  (always UP)\n• floor(4.9) = 4  (always DOWN)\n• round(4.5) = 4  (banker\'s rounding)',
        pt: '💡 ceil vs floor vs round:\n• ceil(4.1) = 5  (sempre PARA CIMA)\n• floor(4.9) = 4  (sempre PARA BAIXO)\n• round(4.5) = 4  (arredondamento bancário)'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex22_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Before you begin: This exercise teaches how to use math.pi (the pi constant) and math.sqrt() (square root).\nThe code has 5 lines ready for you. You only need to fill in 2 blanks — marked with ___.\n\nBlank 1 (line 4): Type pi — math.pi is the constant 3.14159... used to compute a circle\'s area\nBlank 2 (line 5): Type sqrt — math.sqrt(area) computes the square root of the area\n\nExpected output:\nArea: 78.54\nSide: 8.86',
        pt: 'Antes de começar: este exercício ensina como usar math.pi (a constante pi) e math.sqrt() (raiz quadrada).\nO código tem 5 linhas prontas. Você só precisa preencher 2 lacunas — marcadas com ___.\n\nLacuna 1 (linha 4): Digite pi — math.pi é a constante 3.14159... usada para calcular a área de um círculo\nLacuna 2 (linha 5): Digite sqrt — math.sqrt(area) calcula a raiz quadrada da área\n\nSaída esperada:\nArea: 78.54\nSide: 8.86'
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
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete compound interest calculator is already provided in the starter — read each line carefully, then run it as-is.\n\nWhat each line does:\nprincipal = 10000 — starting amount\nrate = 0.08 — annual interest rate (8%)\nyears = 5 — investment period\namount = principal * math.pow(1 + rate, years) — applies the formula A = P * (1 + r)^t\nrounded = math.ceil(amount) — rounds UP to the next whole dollar\nprint(f"After {years} years: ${amount:.2f}") — formatted with 2 decimal places\nprint(f"Rounded up: ${rounded}") — the ceiling value\n\nExpected output:\nAfter 5 years: $14693.28\nRounded up: $14694',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nA calculadora de juros compostos completa já está fornecida no starter — leia cada linha com atenção e execute como está.\n\nO que cada linha faz:\nprincipal = 10000 — valor inicial\nrate = 0.08 — taxa de juros anual (8%)\nyears = 5 — período de investimento\namount = principal * math.pow(1 + rate, years) — aplica a fórmula A = P * (1 + r)^t\nrounded = math.ceil(amount) — arredonda PARA CIMA para o próximo dólar inteiro\nprint(f"After {years} years: ${amount:.2f}") — formatado com 2 casas decimais\nprint(f"Rounded up: ${rounded}") — o valor do teto\n\nSaída esperada:\nAfter 5 years: $14693.28\nRounded up: $14694'
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
    title: { en: 'Construction Math Report', pt: 'Relatório de Matemática de Construção' },
    scenario: { en: 'Calculate areas and costs for 3 sites.', pt: 'Calcule áreas e custos para 3 obras.' },
    requirements: { en: ['Rectangular: length×width', 'Circular: π×r²', 'Cost = area×$150, rounded UP', 'Print area + cost per site'], pt: ['Retangular: comprimento×largura', 'Circular: π×r²', 'Custo = área×R$150, arredondado CIMA', 'Imprima área + custo por obra'] },
    starterCode: `import math

sites = [
    {"name": "Warehouse", "type": "rect",   "a": 40, "b": 25},
    {"name": "Tank",      "type": "circle", "a": 8,  "b": 0},
    {"name": "Office",    "type": "rect",   "a": 30, "b": 15}
]

for s in sites:
    area = s["a"] * s["b"] if s["type"] == "rect" else math.pi * s["a"]**2
    cost = math.ceil(area * 150)
    print(f"{s['name']}: {area:.1f} m² → \${cost}")`,
    testCases: [
      { id: 'tc22_1', description: { en: 'Warehouse 150000', pt: 'Warehouse 150000' }, inputs: [], checks: [{ type: 'contains', value: '150000' }], points: 30 },
      { id: 'tc22_2', description: { en: 'Tank shown', pt: 'Tank mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Tank' }], points: 30 },
      { id: 'tc22_3', description: { en: 'Office shown', pt: 'Office mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Office' }], points: 20 },
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
      { type: 'heading', content: { en: '🌍 Unhandled errors cost millions', pt: '🌍 Erros não tratados custam milhões' } },
      { type: 'text', content: {
        en: 'In 2012, Knight Capital lost $440 million in 45 minutes due to unhandled exceptions.\nIn 2016, one CDN bug took down half the internet for 1 hour.\n\nProper error handling = the difference between a crash and a graceful recovery.',
        pt: 'Em 2012, Knight Capital perdeu US$440 milhões em 45 minutos por exceções não tratadas.\nEm 2016, um bug de CDN derrubou metade da internet por 1 hora.\n\nTratamento adequado = diferença entre crash e recuperação graciosa.'
      }},
      { type: 'heading', content: { en: '🆚 WITHOUT error handling', pt: '🆚 SEM tratamento de erros' } },
      { type: 'code', code: `# User types "abc" — program CRASHES
damage = int(input("Damage: "))
# ValueError: invalid literal for int() with base 10: 'abc'` },
      { type: 'heading', content: { en: '🆚 WITH error handling', pt: '🆚 COM tratamento de erros' } },
      { type: 'code', code: `# Same situation — handled gracefully
try:
    damage = int(input("Damage: "))
    print("Payout:", damage - 250)
except ValueError:
    print("⚠️  Please enter a valid number.")` },
      { type: 'code', code: `# Full pattern: try / except / else / finally
try:
    damage = int(input("Damage: $"))
    if damage < 0: raise ValueError("Must be positive")
    payout = damage - 250

except ValueError as e:
    print("Input error:", e)

else:
    # Runs ONLY if no exception occurred
    print("Payout: $", payout)

finally:
    # ALWAYS runs — error or not
    print("Processing complete.")` },
      { type: 'tip', content: {
        en: '💡 Common exceptions:\n• ValueError — wrong type/value (int("abc"))\n• ZeroDivisionError — dividing by zero\n• FileNotFoundError — file missing\n• KeyError — dict key missing\n• IndexError — list index out of range',
        pt: '💡 Exceções comuns:\n• ValueError — tipo/valor errado (int("abc"))\n• ZeroDivisionError — dividir por zero\n• FileNotFoundError — arquivo faltando\n• KeyError — chave de dict faltando\n• IndexError — índice de lista fora do intervalo'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex23_recog',
      title: { en: '🟡 Recognize the Problem', pt: '🟡 Reconheça o Problema' },
      description: {
        en: 'The code already has some parts done. Your job is to fill in the blanks or fix the bug.\n\nStep 1: Read ALL the code first — three separate try/except blocks are already written with the correct exception names.\nStep 2: Notice what triggers each exception: int("not_a_number") → ValueError; 100 / 0 → ZeroDivisionError; d["damage"] when "damage" key is missing → KeyError.\nStep 3: The code is complete — run it as-is to confirm all three exceptions are caught.\nStep 4: If you want to explore: try changing "not_a_number" to a real number in the first block and see if ValueError is still triggered.\nStep 5: Run the code — you should see:\nValueError caught\nZeroDivisionError caught\nKeyError caught',
        pt: 'O código já tem algumas partes prontas. Seu trabalho é preencher as lacunas ou corrigir o bug.\n\nPasso 1: Leia TODO o código primeiro — três blocos try/except separados já estão escritos com os nomes corretos de exceção.\nPasso 2: Observe o que dispara cada exceção: int("not_a_number") → ValueError; 100 / 0 → ZeroDivisionError; d["damage"] quando a chave "damage" está faltando → KeyError.\nPasso 3: O código está completo — execute como está para confirmar que as três exceções são capturadas.\nPasso 4: Se quiser explorar: tente mudar "not_a_number" para um número real no primeiro bloco e veja se ValueError ainda é disparado.\nPasso 5: Execute o código — você deve ver:\nValueError caught\nZeroDivisionError caught\nKeyError caught'
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
    print(d["damage"])
except KeyError:
    print("KeyError caught")`,
      hints: [{ en: 'Each block uses a specific exception name', pt: 'Cada bloco usa um nome específico de exceção' }],
      sampleOutput: { en: 'ValueError caught\nZeroDivisionError caught\nKeyError caught', pt: 'ValueError caught\nZeroDivisionError caught\nKeyError caught' }
    },
    {
      id: 'ex23_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete robust input loop is already provided in the starter — read each line carefully, then run it as-is.\n\nWhat each part does:\ndamage = None — signals "no valid input yet"\nwhile damage is None: — keeps looping until valid input is received\n    raw = input("Damage amount: $") — reads user input as a string\n    damage = int(raw) — attempts to convert to integer; raises ValueError if invalid\n    if damage <= 0: raise ValueError("Must be positive") — rejects negative or zero values\nexcept ValueError as e: print("Invalid:", e, "— try again") — catches any ValueError and shows the message\n    damage = None — resets so the loop continues\nprint("Confirmed payout: $", damage - 250) — runs only after valid positive input\n\nExpected output:\nInvalid: ... — try again\nConfirmed payout: $ 4750',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO loop de entrada robusto completo já está fornecido no starter — leia cada linha com atenção e execute como está.\n\nO que cada parte faz:\ndamage = None — sinaliza "ainda sem entrada válida"\nwhile damage is None: — continua no loop até receber entrada válida\n    raw = input("Damage amount: $") — lê a entrada do usuário como string\n    damage = int(raw) — tenta converter para inteiro; levanta ValueError se inválido\n    if damage <= 0: raise ValueError("Must be positive") — rejeita valores negativos ou zero\nexcept ValueError as e: print("Invalid:", e, "— try again") — captura qualquer ValueError e exibe a mensagem\n    damage = None — redefine para que o loop continue\nprint("Confirmed payout: $", damage - 250) — roda apenas após entrada positiva válida\n\nSaída esperada:\nInvalid: ... — try again\nConfirmed payout: $ 4750'
      },
      starterCode: `damage = None

while damage is None:
    try:
        raw = input("Damage amount: $")
        damage = int(raw)
        if damage <= 0:
            raise ValueError("Must be positive")
    except ValueError as e:
        print("Invalid:", e, "— try again")
        damage = None

print("Confirmed payout: $", damage - 250)`,
      hints: [{ en: 'Set damage = None before loop; reset to None on error', pt: 'Defina damage = None antes do loop; redefina como None no erro' }],
      sampleOutput: { en: 'Invalid: ... — try again\nConfirmed payout: $ 4750', pt: 'Inválido: ... — tente novamente\nPayout confirmado: $ 4750' }
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
    scenario: { en: 'Process mixed claim data — some entries invalid. Handle all errors.', pt: 'Processe dados mistos — algumas entradas inválidas. Trate todos os erros.' },
    requirements: { en: ['5 data entries', 'Try/except per entry', 'Handle non-numeric damage', 'Handle negative damage', 'Print success or error per entry'], pt: ['5 entradas de dados', 'Try/except por entrada', 'Tratar dano não-numérico', 'Tratar dano negativo', 'Imprimir sucesso ou erro por entrada'] },
    starterCode: `entries = [("Alice","5230"),("Bob","abc"),("Carlos","8000"),("Diana","-500"),("Eduardo","1200")]

for name, raw in entries:
    try:
        damage = int(raw)
        if damage <= 0: raise ValueError("Must be positive")
        print(f"✅ {name}: \${damage - 250}")
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
      { type: 'heading', content: { en: '🌍 Real software = simple concepts combined', pt: '🌍 Software real = conceitos simples combinados' } },
      { type: 'text', content: {
        en: 'Nubank\'s core engine is essentially:\n• Input → Validate → Calculate → Route → Store → Report\n\nYou already know ALL of these. Now combine them.',
        pt: 'O motor central do Nubank é essencialmente:\n• Input → Validar → Calcular → Rotear → Armazenar → Reportar\n\nVocê já sabe TODOS esses. Agora combine-os.'
      }},
      { type: 'heading', content: { en: '🆚 Beginner vs Professional', pt: '🆚 Iniciante vs Profissional' } },
      { type: 'code', code: `# ❌ BEGINNER: one big block, no structure
x = int(input("x: "))
y = int(input("y: "))
op = input("op: ")
if op == "+": print(x + y)
elif op == "-": print(x - y)` },
      { type: 'code', code: `# ✅ PROFESSIONAL: functions + validation + history
def calculate(x, op, y):
    """Perform arithmetic operation."""
    if op == "+": return x + y
    elif op == "-": return x - y
    elif op == "*": return x * y
    elif op == "/":
        if y == 0: raise ValueError("Cannot divide by zero")
        return x / y
    else:
        raise ValueError(f"Unknown operator: {op}")

history = []

def run():
    while True:
        try:
            x  = float(input("First number (q=quit): "))
            op = input("Operator (+,-,*,/): ")
            y  = float(input("Second number: "))
            result = calculate(x, op, y)
            history.append(f"{x} {op} {y} = {result}")
            print("=", result)
        except ValueError as e:
            print("Error:", e)
        except:
            break

run()
print("\\nHistory:")
for h in history: print(" ", h)` }
    ]
  },
  exercises: [
    {
      id: 'ex24_recog',
      title: { en: '🟡 Identify the Gap', pt: '🟡 Identifique a Lacuna' },
      description: {
        en: 'The code already has some parts done. Your job is to fill in the blanks or fix the bug.\n\nStep 1: Read ALL the code first — calculate() handles +, -, *, / but is missing two validations.\nStep 2: Inside the "/" branch, add a division-by-zero check: if y == 0: raise ValueError("Cannot divide by zero")\nStep 3: After all elif branches, add a default: else: raise ValueError(f"Unknown: {op}")\nStep 4: Both try/except blocks in the test code will now catch ValueError and print "Error: ..."\nStep 5: Run the code — you should see:\nError: Cannot divide by zero\nError: Unknown: %',
        pt: 'O código já tem algumas partes prontas. Seu trabalho é preencher as lacunas ou corrigir o bug.\n\nPasso 1: Leia TODO o código primeiro — calculate() trata +, -, *, / mas faltam duas validações.\nPasso 2: Dentro do ramo "/", adicione verificação de divisão por zero: if y == 0: raise ValueError("Cannot divide by zero")\nPasso 3: Após todos os ramos elif, adicione um padrão: else: raise ValueError(f"Unknown: {op}")\nPasso 4: Os dois blocos try/except no código de teste agora capturarão ValueError e imprimirão "Error: ..."\nPasso 5: Execute o código — você deve ver:\nError: Cannot divide by zero\nError: Unknown: %'
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
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete calculator with history is already provided in the starter — read each part carefully, then run it as-is.\n\nWhat each part does:\ncalculate(x, op, y) — validates operator and division by zero, then returns the result; raises ValueError on error\nhistory = [] — an empty list to accumulate successful calculations\ntests = [(10,"+",5),(20,"/",4),(8,"/",0)] — 3 test cases, the third intentionally invalid\nfor x, op, y in tests: — runs each test inside a try/except\n    result = calculate(x, op, y) — computes the result; raises ValueError if invalid\n    history.append(entry) — stores successful results as strings\nprint("\\nHistory:") — prints only the successful entries\n\nExpected output:\n= 15.0\n= 5.0\nError: Cannot divide by zero\n\nHistory:\n  10 + 5 = 15.0',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nA calculadora completa com histórico já está fornecida no starter — leia cada parte com atenção e execute como está.\n\nO que cada parte faz:\ncalculate(x, op, y) — valida operador e divisão por zero, retorna o resultado; levanta ValueError em erro\nhistory = [] — lista vazia para acumular cálculos bem-sucedidos\ntests = [(10,"+",5),(20,"/",4),(8,"/",0)] — 3 casos de teste, o terceiro intencionalmente inválido\nfor x, op, y in tests: — executa cada teste dentro de um try/except\n    result = calculate(x, op, y) — calcula o resultado; levanta ValueError se inválido\n    history.append(entry) — armazena resultados bem-sucedidos como strings\nprint("\\nHistory:") — imprime apenas as entradas bem-sucedidas\n\nSaída esperada:\n= 15.0\n= 5.0\nError: Cannot divide by zero\n\nHistory:\n  10 + 5 = 15.0'
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
    title: { en: 'Insurance Fee Calculator', pt: 'Calculadora de Taxas de Seguro' },
    scenario: { en: 'Build an error-safe fee calculator with history.', pt: 'Construa uma calculadora de taxas resistente a erros, com histórico.' },
    requirements: { en: ['calc_premium(base, risk, years)', 'premium = base * risk * years', 'Validate all > 0', '3 clients with loop', 'Error handling', 'Print history'], pt: ['calc_premium(base, risk, years)', 'premium = base * risk * years', 'Valide todos > 0', '3 clientes com loop', 'Tratamento de erros', 'Imprima histórico'] },
    starterCode: `def calc_premium(base, risk, years):
    """Calculate insurance premium. All args must be positive."""
    if base <= 0 or risk <= 0 or years <= 0:
        raise ValueError("All values must be positive")
    return base * risk * years

clients = [("Alice",10000,0.08,3),("Bob",-5000,0.05,2),("Carlos",15000,0.12,5)]
history = []

for name, base, risk, years in clients:
    try:
        premium = calc_premium(base, risk, years)
        entry = f"{name}: \${premium:.2f}"
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
      { type: 'heading', content: { en: '🌍 Every app you use is a CRUD system', pt: '🌍 Todo app que você usa é um sistema CRUD' } },
      { type: 'text', content: {
        en: 'WhatsApp: Create message, Read chat, Update status, Delete message.\nNetflix: Create account, Read library, Update watchlist, Delete history.\n\nCRUD = the 4 operations behind every app ever built.',
        pt: 'WhatsApp: Criar mensagem, Ler chat, Atualizar status, Deletar mensagem.\nNetflix: Criar conta, Ler biblioteca, Atualizar lista, Deletar histórico.\n\nCRUD = as 4 operações por trás de todo app já construído.'
      }},
      { type: 'heading', content: { en: '🆚 Messy vs Structured', pt: '🆚 Bagunçado vs Estruturado' } },
      { type: 'code', code: {
        en: `# ❌ MESSY: scattered data manipulation
claims = []
claims.append({"id": 1, "client": "Alice"})   # create
print(claims[0])                                # read
claims[0]["client"] = "Alicia"                  # update
claims.pop(0)                                   # delete`,
        pt: `# ❌ BAGUNÇADO: manipulação de dados espalhada
sinistros = []
sinistros.append({"id": 1, "cliente": "Alice"})   # criar
print(sinistros[0])                                # ler
sinistros[0]["cliente"] = "Alicia"                  # atualizar
sinistros.pop(0)                                     # excluir`
      } },
      { type: 'code', code: `# ✅ CLEAN: named CRUD functions
def create(db, client, damage):
    db.append({"id": len(db)+1, "client": client, "damage": damage})

def read_all(db):
    for c in db: print(f"#{c['id']} {c['client']} \${c['damage']}")

def update(db, cid, new_damage):
    for c in db:
        if c["id"] == cid: c["damage"] = new_damage; return True
    return False

def delete(db, cid):
    db[:] = [c for c in db if c["id"] != cid]

db = []
create(db, "Alice", 5230)
create(db, "Bob",   1200)
update(db, 1, 6000)
delete(db, 2)
read_all(db)` }
    ]
  },
  exercises: [
    {
      id: 'ex25_recog',
      title: { en: '🟡 Complete the CRUD', pt: '🟡 Complete o CRUD' },
      description: {
        en: 'The code already has some parts done. Your job is to fill in the blanks or fix the bug.\n\nStep 1: Read ALL the code first — create() and read_all() are complete; update() and delete() have one blank each.\nStep 2: In update(), the blank is inside c["___"] = new_damage — type damage, because you are updating the damage field\nStep 3: In delete(), the blank is inside if c["___"] != cid — type id, because you filter out the claim whose id matches cid\nStep 4: Run the code — Alice should have her damage updated to 7000 and Bob should be deleted\nStep 5: Run the code — you should see:\n1 Alice $7000',
        pt: 'O código já tem algumas partes prontas. Seu trabalho é preencher as lacunas ou corrigir o bug.\n\nPasso 1: Leia TODO o código primeiro — create() e read_all() estão completas; update() e delete() têm uma lacuna cada.\nPasso 2: Em update(), a lacuna está em c["___"] = new_damage — digite damage, pois você está atualizando o campo damage\nPasso 3: Em delete(), a lacuna está em if c["___"] != cid — digite id, pois você filtra o sinistro cujo id corresponde a cid\nPasso 4: Execute o código — Alice deve ter seu damage atualizado para 7000 e Bob deve ser removido\nPasso 5: Execute o código — você deve ver:\n1 Alice $7000'
      },
      starterCode: `def create(db, client, damage):
    db.append({"id": len(db)+1, "client": client, "damage": damage})

def read_all(db):
    for c in db: print(c["id"], c["client"], "$"+str(c["damage"]))

def update(db, cid, new_damage):
    for c in db:
        if c["id"] == cid:
            c["___"] = new_damage   # fill: which key to update?
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
        { en: 'Update the "damage" key', pt: 'Atualize a chave "damage"' },
        { en: 'Compare by "id" key in delete', pt: 'Compare pela chave "id" no delete' }
      ],
      sampleOutput: { en: '1 Alice $7000', pt: '1 Alice $7000' }
    },
    {
      id: 'ex25_zero',
      title: { en: '🔴 Full CRUD Demo', pt: '🔴 Demo CRUD Completo' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete CRUD demo is already provided in the starter — read each part carefully, then run it as-is.\n\nWhat each function does:\ncreate(db, client, damage) — appends a new dict with auto-incremented id\nread_all(db) — prints every claim in the format "#id client $damage"\nupdate(db, cid, new_damage) — finds the claim with matching id and changes its damage\ndelete(db, cid) — removes the claim with matching id using list comprehension\n\nDemo sequence:\n1. Four claims are created: Alice $5230, Bob $1200, Carlos $8000, Diana $900\n2. print("Initial:"); read_all(db) — shows all 4\n3. update(db, 2, 9000) — Bob\'s damage becomes $9000\n4. delete(db, 4) — Diana is removed\n5. print("Final:"); read_all(db) — shows 3 remaining claims\n\nExpected output:\nInitial:\n#1 Alice $5230\n...\nFinal:\n#1 Alice $5230\n#2 Bob $9000\n#3 Carlos $8000',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO demo CRUD completo já está fornecido no starter — leia cada parte com atenção e execute como está.\n\nO que cada função faz:\ncreate(db, client, damage) — adiciona um novo dict com id auto-incremental\nread_all(db) — imprime cada sinistro no formato "#id client $damage"\nupdate(db, cid, new_damage) — encontra o sinistro com id correspondente e altera seu damage\ndelete(db, cid) — remove o sinistro com id correspondente usando list comprehension\n\nSequência do demo:\n1. Quatro sinistros são criados: Alice $5230, Bob $1200, Carlos $8000, Diana $900\n2. print("Initial:"); read_all(db) — exibe todos os 4\n3. update(db, 2, 9000) — damage do Bob passa a $9000\n4. delete(db, 4) — Diana é removida\n5. print("Final:"); read_all(db) — exibe os 3 sinistros restantes\n\nSaída esperada:\nInitial:\n#1 Alice $5230\n...\nFinal:\n#1 Alice $5230\n#2 Bob $9000\n#3 Carlos $8000'
      },
      starterCode: `def create(db, client, damage):
    db.append({"id": len(db)+1, "client": client, "damage": damage})

def read_all(db):
    for c in db: print(f"#{c['id']} {c['client']} \${c['damage']}")

def update(db, cid, new_damage):
    for c in db:
        if c["id"] == cid: c["damage"] = new_damage; return True
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
    title: { en: 'Claims Management System', pt: 'Sistema de Gestão de Sinistros' },
    scenario: { en: 'Build a full CRUD claims system and run a demo.', pt: 'Construa um sistema CRUD completo de sinistros e execute um demo.' },
    requirements: { en: ['create/read_all/update/delete functions', 'Create 4 claims', 'Update #2 to 9000', 'Delete #4', 'Read final state'], pt: ['Funções create/read_all/update/delete', 'Criar 4 sinistros', 'Atualizar #2 para 9000', 'Deletar #4', 'Ler estado final'] },
    starterCode: `def create(db, client, damage):
    db.append({"id": len(db)+1, "client": client, "damage": damage})

def read_all(db):
    for c in db: print(f"#{c['id']} {c['client']} \${c['damage']}")

def update(db, cid, new_damage):
    for c in db:
        if c["id"] == cid: c["damage"] = new_damage; return True

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
      { type: 'heading', content: { en: '🌍 Data analysis is the highest-paid Python skill', pt: '🌍 Análise de dados é a habilidade Python mais bem paga' } },
      { type: 'text', content: {
        en: 'Junior data analysts average $85,000/year.\nThey load raw data → clean → calculate stats → find patterns → report.\n\nYou\'re learning to do exactly that.',
        pt: 'Analistas de dados júnior ganham em média US$85.000/ano.\nEles carregam dados → limpam → calculam estatísticas → encontram padrões → reportam.\n\nVocê está aprendendo a fazer exatamente isso.'
      }},
      { type: 'heading', content: { en: '🆚 Raw dump vs Real insight', pt: '🆚 Despejo bruto vs Insight real' } },
      { type: 'code', code: `# ❌ RAW: meaningless dump
data = [5230, 1200, 8000, 450, 3100, 9200]
print(data)` },
      { type: 'code', code: `# ✅ ANALYZED: real insights extracted
data = [5230, 1200, 8000, 450, 3100, 9200]

total   = sum(data)
average = total / len(data)
maximum = max(data)
minimum = min(data)
median  = sorted(data)[len(data) // 2]
critical = len([d for d in data if d > 5000])

print(f"Total:    \${total:,}")
print(f"Average:  \${average:,.0f}")
print(f"Max/Min:  \${maximum} / \${minimum}")
print(f"Median:   \${median}")
print(f"Critical: {critical} claims")` },
      { type: 'tip', content: {
        en: '💡 sorted(data, reverse=True)[:3] → top 3 highest\n   sorted(data)[:3] → bottom 3\n   sum(x for x in data if x > 5000) → sum with filter',
        pt: '💡 sorted(data, reverse=True)[:3] → top 3 maiores\n   sorted(data)[:3] → 3 menores\n   sum(x for x in data if x > 5000) → soma com filtro'
      }}
    ]
  },
  exercises: [
    {
      id: 'ex26_recog',
      title: { en: '🟡 Add Missing Statistics', pt: '🟡 Adicione Estatísticas Faltantes' },
      description: {
        en: 'The code already has some parts done. Your job is to fill in the blanks or fix the bug.\n\nStep 1: Read ALL the code first — total and average are already calculated; median and critical count need blanks filled.\nStep 2: For the median blank: type len(sorted_c) // 2 — this gives the middle index of the sorted list\nStep 3: For the operator blank: type > — this counts claims above $5000 as critical\nStep 4: Check: the claims list has 8 items; sorted, the middle element gives the median value\nStep 5: Run the code — you should see:\nAverage: $4038\nMedian: $3100\nCritical: 3',
        pt: 'O código já tem algumas partes prontas. Seu trabalho é preencher as lacunas ou corrigir o bug.\n\nPasso 1: Leia TODO o código primeiro — total e average já estão calculados; median e contagem de críticos precisam de lacunas preenchidas.\nPasso 2: Para a lacuna de mediana: digite len(sorted_c) // 2 — isso dá o índice do meio da lista ordenada\nPasso 3: Para a lacuna do operador: digite > — isso conta sinistros acima de $5000 como críticos\nPasso 4: Verifique: a lista de sinistros tem 8 itens; ordenada, o elemento do meio dá o valor da mediana\nPasso 5: Execute o código — você deve ver:\nAverage: $4038\nMedian: $3100\nCritical: 3'
      },
      starterCode: `claims = [5230, 1200, 8000, 450, 3100, 9200, 620, 4500]

total   = sum(claims)
average = total / len(claims)

sorted_c = sorted(claims)
median   = sorted_c[___]              # fill: middle index

critical = len([c for c in claims if c ___ 5000])  # fill: operator

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
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete analysis is already provided in the starter — read each line carefully, then run it as-is.\n\nWhat each statistic means:\ntotal = sum(claims) — adds all damage values\naverage = total / len(claims) — divides total by number of claims\nminimum = min(claims) and maximum = max(claims) — smallest and largest values\nmedian = sorted(claims)[len(claims)//2] — the middle value after sorting\npayout = sum(c - 250 for c in claims) — total payout after $250 deductible per claim\ncritical = len([c for c in claims if c > 8000]) — count of claims above $8000\nurgent = len([c for c in claims if 3000 <= c <= 8000]) — count in the $3000–$8000 range\nnormal = len([c for c in claims if c < 3000]) — count below $3000\ntop3 = sorted(claims, reverse=True)[:3] — the 3 largest values\n\nExpected output:\n=== REPORT ===\nTotal: $42,400',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nA análise completa já está fornecida no starter — leia cada linha com atenção e execute como está.\n\nO que cada estatística significa:\ntotal = sum(claims) — soma todos os valores de dano\naverage = total / len(claims) — divide o total pelo número de sinistros\nminimum = min(claims) e maximum = max(claims) — menor e maior valores\nmedian = sorted(claims)[len(claims)//2] — o valor do meio após ordenação\npayout = sum(c - 250 for c in claims) — payout total após franquia de $250 por sinistro\ncritical = len([c for c in claims if c > 8000]) — contagem de sinistros acima de $8000\nurgent = len([c for c in claims if 3000 <= c <= 8000]) — contagem na faixa $3000–$8000\nnormal = len([c for c in claims if c < 3000]) — contagem abaixo de $3000\ntop3 = sorted(claims, reverse=True)[:3] — os 3 maiores valores\n\nSaída esperada:\n=== REPORT ===\nTotal: $42,400'
      },
      starterCode: `claims = [5230,1200,8000,450,3100,9200,620,4500,7800,2300]

total    = sum(claims)
average  = total / len(claims)
minimum  = min(claims)
maximum  = max(claims)
median   = sorted(claims)[len(claims)//2]
payout   = sum(c - 250 for c in claims)
critical = len([c for c in claims if c > 8000])
urgent   = len([c for c in claims if 3000 <= c <= 8000])
normal   = len([c for c in claims if c < 3000])
top3     = sorted(claims, reverse=True)[:3]

print(f"=== REPORT ===")
print(f"Total: \${total:,} | Avg: \${average:,.0f}")
print(f"Min: \${minimum} | Max: \${maximum} | Median: \${median}")
print(f"Payout: \${payout:,}")
print(f"Critical:{critical} Urgent:{urgent} Normal:{normal}")
print(f"Top 3: {top3}")`,
      hints: [{ en: 'sorted(claims, reverse=True)[:3] gets top 3', pt: 'sorted(claims, reverse=True)[:3] pega top 3' }],
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
    title: { en: 'Monthly Claims Analysis', pt: 'Análise Mensal de Sinistros' },
    scenario: { en: 'Produce a full statistical report from monthly data.', pt: 'Produza um relatório estatístico completo dos dados mensais.' },
    requirements: { en: ['total, avg, min, max, median', 'Critical/Urgent/Normal counts', 'Total payout ($250 ded)', 'Top 3 claims', 'Formatted output'], pt: ['total, média, mín, máx, mediana', 'Contagens Crítico/Urgente/Normal', 'Total payout (R$250 franquia)', 'Top 3 sinistros', 'Output formatado'] },
    starterCode: `claims = [5230,1200,8000,450,3100,9200,620,4500,7800,2300,6500,890,11000,3800,720]

total    = sum(claims)
average  = total / len(claims)
minimum  = min(claims)
maximum  = max(claims)
median   = sorted(claims)[len(claims)//2]
payout   = sum(c - 250 for c in claims)
critical = len([c for c in claims if c > 8000])
urgent   = len([c for c in claims if 3000 <= c <= 8000])
normal   = len([c for c in claims if c < 3000])
top3     = sorted(claims, reverse=True)[:3]

print(f"Claims: {len(claims)} | Total: \${total:,}")
print(f"Avg: \${average:,.0f} | Median: \${median:,}")
print(f"Min: \${minimum:,} | Max: \${maximum:,}")
print(f"Payout: \${payout:,}")
print(f"Critical:{critical} Urgent:{urgent} Normal:{normal}")
print(f"Top 3: {top3}")`,
    testCases: [
      { id: 'tc26_1', description: { en: 'Total shown', pt: 'Total mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Total' }], points: 20 },
      { id: 'tc26_2', description: { en: 'Critical count', pt: 'Contagem crítica' }, inputs: [], checks: [{ type: 'contains', value: 'Critical' }], points: 20 },
      { id: 'tc26_3', description: { en: 'Top 3 shown', pt: 'Top 3 mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Top 3' }], points: 20 },
      { id: 'tc26_4', description: { en: 'Payout shown', pt: 'Payout mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Payout' }], points: 20 },
      { id: 'tc26_5', description: { en: 'No errors', pt: 'Sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

export const phase27: Phase = {
  id: 27,
  title: { en: 'Foundation Capstone: Claims System', pt: 'Capstone da Base: Sistema de Sinistros' },
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
damage = 5230
print(damage - 250)` },
      { type: 'code', code: `# ✅ SYSTEM: structured, persistent, robust
from datetime import datetime

def create_claim(db, client, damage, ded=250):
    """Create claim with full metadata."""
    if damage <= 0: raise ValueError("Must be positive")
    priority = ("Critical" if damage > 10000
                else "Urgent" if damage > 5000
                else "Normal")
    db.append({
        "id":       len(db) + 1,
        "client":   client,
        "damage":   damage,
        "ded":      ded,
        "payout":   damage - ded,
        "priority": priority,
        "status":   "open",
        "date":     datetime.now().strftime("%Y-%m-%d")
    })

def read_all(db):
    for c in db:
        print(f"#{c['id']} {c['client']} \${c['damage']} [{c['priority']}] {c['status']}")

def update_status(db, cid, status):
    for c in db:
        if c["id"] == cid: c["status"] = status; return True

def analyze(db):
    if not db: return
    total  = sum(c["damage"] for c in db)
    payout = sum(c["payout"] for c in db)
    print(f"Total: \${total:,} | Payout: \${payout:,} | Claims: {len(db)}")` }
    ]
  },
  exercises: [
    {
      id: 'ex27_recog',
      title: { en: '🟡 Complete the System Functions', pt: '🟡 Complete as Funções do Sistema' },
      description: {
        en: 'The code already has some parts done. Your job is to fill in the blanks or fix the bug.\n\nStep 1: Read ALL the code first — create_claim() is complete; update_status() and delete_claim() have 3 blanks total.\nStep 2: In update_status(), line "if c[\\"id\\"] == cid" blank: type id — you are looking up the claim by its id field\nStep 3: In update_status(), line "c[\\"status\\"] = new_status" blank: type status — you are updating the status field\nStep 4: In delete_claim(), line "if c[\\"id\\"] != cid" blank: type id — you are filtering out the claim with matching id\nStep 5: Run the code — you should see:\n{"id": 1, "client": "Alice", "damage": 5230, "status": "approved"}',
        pt: 'O código já tem algumas partes prontas. Seu trabalho é preencher as lacunas ou corrigir o bug.\n\nPasso 1: Leia TODO o código primeiro — create_claim() está completa; update_status() e delete_claim() têm 3 lacunas no total.\nPasso 2: Em update_status(), na linha "if c[\\"id\\"] == cid": digite id — você está buscando o sinistro pelo campo id\nPasso 3: Em update_status(), na linha "c[\\"status\\"] = new_status": digite status — você está atualizando o campo status\nPasso 4: Em delete_claim(), na linha "if c[\\"id\\"] != cid": digite id — você está filtrando o sinistro com id correspondente\nPasso 5: Execute o código — você deve ver:\n{"id": 1, "client": "Alice", "damage": 5230, "status": "approved"}'
      },
      starterCode: `from datetime import datetime

def create_claim(db, client, damage):
    db.append({"id": len(db)+1, "client": client, "damage": damage, "status": "open"})

def update_status(db, cid, new_status):
    for c in db:
        if c["___"] == cid:       # fill: compare by id
            c["___"] = new_status  # fill: update status
            return True
    return False

def delete_claim(db, cid):
    db[:] = [c for c in db if c["___"] != cid]  # fill: filter by id

db = []
create_claim(db, "Alice", 5230)
create_claim(db, "Bob",   1200)
update_status(db, 1, "approved")
delete_claim(db, 2)
for c in db: print(c)`,
      hints: [
        { en: 'All three blanks use the "id" key', pt: 'Os três espaços usam a chave "id"' },
        { en: 'The status blank uses the "status" key', pt: 'O espaço de status usa a chave "status"' }
      ],
      sampleOutput: { en: '{"id": 1, "client": "Alice", "damage": 5230, "status": "approved"}', pt: '{"id": 1, "client": "Alice", "damage": 5230, "status": "approved"}' }
    },
    {
      id: 'ex27_zero',
      title: { en: '🔴 Build the Full System', pt: '🔴 Construa o Sistema Completo' },
      description: {
        en: 'Build this program from scratch. Every line goes into the blue editor.\n\nThe complete claims system is already provided in the starter — read each function carefully, then run it as-is.\n\nWhat each function does:\ncreate_claim(db, client, damage, ded=250) — validates damage > 0, calculates payout and priority ("Critical" >10000, "Urgent" >5000, "Normal" otherwise), appends a full claim dict with today\'s date\nread_all(db) — prints each claim as "#id client $damage [priority] status"\nupdate_status(db, cid, status) — finds the claim by id and changes its status field\ndelete_claim(db, cid) — removes the claim with matching id from the list\nanalyze(db) — prints count, total damage, and total payout\n\nDemo sequence:\n1. Five claims are created — Eduardo\'s damage is -1, which raises ValueError\n2. update_status(db, 1, "approved") and update_status(db, 3, "approved") — approve Alice and Carlos\n3. delete_claim(db, 4) — removes Diana\n4. read_all(db) shows the 3 remaining claims\n5. analyze(db) prints totals\n\nExpected output:\nError: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved',
        pt: 'Construa este programa do zero. Cada linha vai no editor azul.\n\nO sistema completo de sinistros já está fornecido no starter — leia cada função com atenção e execute como está.\n\nO que cada função faz:\ncreate_claim(db, client, damage, ded=250) — valida damage > 0, calcula payout e prioridade ("Critical" >10000, "Urgent" >5000, "Normal" caso contrário), adiciona dict completo com data atual\nread_all(db) — imprime cada sinistro como "#id client $damage [priority] status"\nupdate_status(db, cid, status) — encontra o sinistro por id e altera seu campo status\ndelete_claim(db, cid) — remove o sinistro com id correspondente da lista\nanalyze(db) — imprime contagem, dano total e payout total\n\nSequência do demo:\n1. Cinco sinistros são criados — damage de Eduardo é -1, o que levanta ValueError\n2. update_status(db, 1, "approved") e update_status(db, 3, "approved") — aprovam Alice e Carlos\n3. delete_claim(db, 4) — remove Diana\n4. read_all(db) exibe os 3 sinistros restantes\n5. analyze(db) imprime os totais\n\nSaída esperada:\nError: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved'
      },
      starterCode: `from datetime import datetime

def create_claim(db, client, damage, ded=250):
    if damage <= 0: raise ValueError("Must be positive")
    priority = "Critical" if damage > 10000 else "Urgent" if damage > 5000 else "Normal"
    db.append({"id": len(db)+1, "client": client, "damage": damage,
               "payout": damage-ded, "priority": priority, "status": "open",
               "date": datetime.now().strftime("%Y-%m-%d")})

def read_all(db):
    for c in db:
        print(f"#{c['id']} {c['client']} \${c['damage']} [{c['priority']}] {c['status']}")

def update_status(db, cid, status):
    for c in db:
        if c["id"] == cid: c["status"] = status; return True

def delete_claim(db, cid):
    db[:] = [c for c in db if c["id"] != cid]

def analyze(db):
    total = sum(c["damage"] for c in db)
    payout = sum(c["payout"] for c in db)
    print(f"Claims:{len(db)} | Damage:\${total:,} | Payout:\${payout:,}")

db = []
try:
    create_claim(db, "Alice",  12000)
    create_claim(db, "Bob",     3500)
    create_claim(db, "Carlos",  7800)
    create_claim(db, "Diana",    900)
    create_claim(db, "Eduardo",   -1)  # should error
except ValueError as e:
    print(f"Error: {e}")

update_status(db, 1, "approved")
update_status(db, 3, "approved")
delete_claim(db, 4)

print("=== SYSTEM ==="); read_all(db)
print("=== STATS ==="); analyze(db)`,
      hints: [{ en: 'Eduardo with -1 should trigger the ValueError', pt: 'Eduardo com -1 deve acionar o ValueError' }],
      sampleOutput: { en: 'Error: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved', pt: 'Error: Must be positive\n=== SYSTEM ===\n#1 Alice $12000 [Critical] approved' }
    }
  ],
  quiz: [
    { id: 'q27_1', question: { en: 'What handles "Must be positive" validation cleanly?', pt: 'O que trata "Must be positive" de forma limpa?' }, options: [{ en: 'raise ValueError inside function', pt: 'raise ValueError dentro da função' }, { en: 'if/else with print', pt: 'if/else com print' }, { en: 'return False', pt: 'return False' }, { en: 'assert statement', pt: 'instrução assert' }], correctIndex: 0, explanation: { en: 'raise ValueError lets the caller catch it with try/except. The function signals bad input and stops.', pt: 'raise ValueError deixa o chamador capturar com try/except. A função sinaliza entrada ruim e para.' } },
    { id: 'q27_2', question: { en: 'Why store date as string in the claim dict?', pt: 'Por que armazenar data como string no dict?' }, options: [{ en: 'Strings are JSON-serializable; datetime objects are not', pt: 'Strings são serializáveis em JSON; objetos datetime não são' }, { en: 'Strings are faster', pt: 'Strings são mais rápidas' }, { en: 'Datetime can\'t be in dicts', pt: 'Datetime não pode estar em dicts' }, { en: 'No reason', pt: 'Sem razão' }], correctIndex: 0, explanation: { en: 'json.dump() can\'t serialize datetime. Convert first: datetime.now().strftime("%Y-%m-%d").', pt: 'json.dump() não serializa datetime. Converta antes: datetime.now().strftime("%Y-%m-%d").' } },
    { id: 'q27_3', question: { en: 'What makes this a "system" vs a "script"?', pt: 'O que faz isso ser "sistema" vs "script"?' }, options: [{ en: 'Functions, validation, error handling, reusability', pt: 'Funções, validação, tratamento de erros, reusabilidade' }, { en: 'More lines of code', pt: 'Mais linhas de código' }, { en: 'Using import statements', pt: 'Usar instruções import' }, { en: 'Running in terminal', pt: 'Rodar em terminal' }], correctIndex: 0, explanation: { en: 'A system has clear structure, handles errors, validates data, and can be extended. A script solves one problem once.', pt: 'Um sistema tem estrutura clara, trata erros, valida dados e pode ser expandido. Um script resolve um problema uma vez.' } },
    { id: 'q27_4', question: { en: 'What does completing this capstone prove?', pt: 'O que concluir este capstone comprova?' }, options: [{ en: 'Strong command of the current foundations and readiness for professional Python', pt: 'Bom domínio da base atual e preparo para Python profissional' }, { en: 'Mastery of every Python domain', pt: 'Domínio de todas as áreas de Python' }, { en: 'Ability to train a large language model from scratch', pt: 'Capacidade de treinar um grande modelo de linguagem do zero' }, { en: 'No need for further study', pt: 'Não precisar estudar mais' }], correctIndex: 0, explanation: { en: 'This project proves foundation mastery. Testing, architecture, databases, advanced Python and specializations come next.', pt: 'Este projeto comprova domínio da base. Testes, arquitetura, bancos, Python avançado e especializações vêm depois.' } }
  ],
  exam: {
    title: { en: 'Final Capstone: Complete Claims System', pt: 'Capstone Final: Sistema Completo' },
    scenario: { en: 'Build and demonstrate a structured claims system combining the published foundation phases.', pt: 'Construa e demonstre um sistema estruturado de sinistros combinando as fases de base publicadas.' },
    requirements: { en: ['Full CRUD', 'Priority classification', 'Error handling', 'Statistical analysis', '5+ claims in demo', 'No crashes'], pt: ['CRUD completo', 'Classificação de prioridade', 'Tratamento de erros', 'Análise estatística', '5+ sinistros no demo', 'Sem crashes'] },
    starterCode: `from datetime import datetime

def create_claim(db, client, damage, ded=250):
    if damage <= 0: raise ValueError("Must be positive")
    priority = "Critical" if damage > 10000 else "Urgent" if damage > 5000 else "Normal"
    db.append({"id": len(db)+1, "client": client, "damage": damage,
               "payout": damage-ded, "priority": priority, "status": "open",
               "date": datetime.now().strftime("%Y-%m-%d")})

def read_all(db):
    for c in db:
        print(f"#{c['id']} {c['client']} \${c['damage']} [{c['priority']}] {c['status']}")

def update_status(db, cid, status):
    for c in db:
        if c["id"] == cid: c["status"] = status; return True

def delete_claim(db, cid):
    db[:] = [c for c in db if c["id"] != cid]

def analyze(db):
    total = sum(c["damage"] for c in db)
    payout = sum(c["payout"] for c in db)
    print(f"Claims:{len(db)} | Total:\${total:,} | Payout:\${payout:,}")

db = []
try:
    create_claim(db, "Alice",  12000)
    create_claim(db, "Bob",     3500)
    create_claim(db, "Carlos",  7800)
    create_claim(db, "Diana",    900)
    create_claim(db, "Eduardo", 5500)
except ValueError as e:
    print("Error:", e)

update_status(db, 1, "approved")
update_status(db, 3, "approved")
delete_claim(db, 4)

print("=== FINAL ==="); read_all(db)
print("=== STATS ==="); analyze(db)`,
    testCases: [
      { id: 'tc27_1', description: { en: 'Alice Critical approved', pt: 'Alice Critical aprovada' }, inputs: [], checks: [{ type: 'contains', value: 'Critical' }], points: 20 },
      { id: 'tc27_2', description: { en: 'Alice status approved', pt: 'Status Alice approved' }, inputs: [], checks: [{ type: 'contains', value: 'approved' }], points: 20 },
      { id: 'tc27_3', description: { en: 'Stats total shown', pt: 'Total de stats mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Total' }], points: 20 },
      { id: 'tc27_4', description: { en: 'Payout shown', pt: 'Payout mostrado' }, inputs: [], checks: [{ type: 'contains', value: 'Payout' }], points: 20 },
      { id: 'tc27_5', description: { en: 'No crash', pt: 'Sem crash' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 20 }
    ]
  }
}

