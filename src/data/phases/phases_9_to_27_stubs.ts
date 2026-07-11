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
        code: `# Each inner list = one claim row
claim1 = ["Alice",  5230, "approved"]
claim2 = ["Bob",    1200, "pending"]
claim3 = ["Carlos", 8000, "approved"]

# The outer list holds all claims
claims = [claim1, claim2, claim3]

# Access: claims[row][column]
print(claims[0])       # ['Alice', 5230, 'approved']
print(claims[0][0])    # Alice  (row 0, column 0)
print(claims[0][1])    # 5230   (row 0, column 1)
print(claims[2][2])    # approved`
      },
      { type: 'heading', content: { en: '🐍 Step 2 — loop through nested list', pt: '🐍 Passo 2 — percorra a lista aninhada' } },
      {
        type: 'code',
        code: `claims = [
    ["Alice",  5230, "approved"],
    ["Bob",    1200, "pending"],
    ["Carlos", 8000, "approved"]
]

for claim in claims:
    name   = claim[0]
    amount = claim[1]
    status = claim[2]
    print(name, "→ $", amount, "→", status)`
      },
      { type: 'heading', content: { en: '🐍 Step 3 — calculate from nested data', pt: '🐍 Passo 3 — calcule com dados aninhados' } },
      {
        type: 'code',
        code: `claims = [
    ["Alice",  5230, "approved"],
    ["Bob",    1200, "pending"],
    ["Carlos", 8000, "approved"]
]

total = 0
for claim in claims:
    if claim[2] == "approved":      # only count approved
        total += claim[1]

print("Total approved payout:", total)  # 13230`
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
        en: 'Access specific data from the nested list below.',
        pt: 'Acesse dados específicos da lista aninhada abaixo.'
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
        en: 'Create a nested list with 3 claims:\n[name, damage, status]\nLoop through it and print only the APPROVED ones, calculating total payout ($250 deductible each).',
        pt: 'Crie uma lista aninhada com 3 sinistros:\n[nome, dano, status]\nPercorra-a e imprima apenas os APROVADOS, calculando o pagamento total (R$250 de franquia cada).'
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
        code: `claim = {"id": 2501, "damage": 5230}

# Add a new key
claim["deductible"] = 250

# Update existing key
claim["damage"] = 5500

# Delete a key
del claim["deductible"]

print(claim)   # {"id": 2501, "damage": 5500}`
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
        en: 'Access the right keys to print the client name and calculate payout.',
        pt: 'Acesse as chaves certas para imprimir o nome do cliente e calcular o pagamento.'
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
        en: 'Create a full claim dictionary with: id, client, city, damage, deductible, status.\nCalculate payout. Add "payout" as a new key to the dict.\nPrint the full dictionary.',
        pt: 'Crie um dicionário completo de sinistro com: id, cliente, cidade, dano, franquia, status.\nCalcule o pagamento. Adicione "payout" como nova chave.\nImprima o dicionário completo.'
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

print(f"Total: ${total} across {approved_count} claims")`
      }
    ]
  },

  exercises: [
    {
      id: 'ex11_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'Complete the loop to print each client and damage amount.',
        pt: 'Complete o loop para imprimir cada cliente e valor do dano.'
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
        en: 'Build a list of 4 claim dicts (id, client, damage, status).\nLoop through and:\n• Print pending claims as "⏳ PENDING"\n• Print approved claims with payout ($250 deductible)\n• Print count of each status',
        pt: 'Construa uma lista de 4 dicts de sinistro (id, cliente, dano, status).\nPercorra e:\n• Imprima sinistros pendentes como "⏳ PENDENTE"\n• Imprima sinistros aprovados com pagamento (R$250 de franquia)\n• Imprima contagem de cada status'
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
        en: 'Complete the comprehension to apply a $300 deductible to all damages.',
        pt: 'Complete a comprehension para aplicar R$300 de franquia a todos os danos.'
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
        en: 'Given a list of damages, write TWO comprehensions:\n1. All damages with $200 deductible applied\n2. Only damages above $2,000, with deductible applied',
        pt: 'Dada uma lista de danos, escreva DUAS comprehensions:\n1. Todos os danos com R$200 de franquia aplicada\n2. Apenas danos acima de R$2.000, com franquia aplicada'
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
client_labels = [f"Client #{i+1}: ${damages[i]-250}" for i in range(len(damages))]

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
        code: `def calculate_payout(damage, deductible):
    payout = damage - deductible
    return payout            # sends value back to caller

# Use the returned value:
result = calculate_payout(5230, 250)
print("Payout:", result)     # Payout: 4980

# Or use directly:
print(calculate_payout(8000, 300))   # 7700`
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
        en: 'Complete the function that calculates insurance payout.',
        pt: 'Complete a função que calcula o pagamento do seguro.'
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
      sampleOutput: { en: '4980\n7700\n1050', pt: '4980\n7700\n1050' }
    },
    {
      id: 'ex13_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Write 2 functions:\n1. get_priority(damage) → returns "Critical", "Urgent", or "Normal"\n2. process_claim(name, damage, deductible) → prints summary\nCall each at least twice with different values.',
        pt: 'Escreva 2 funções:\n1. get_priority(damage) → retorna "Critical", "Urgent" ou "Normal"\n2. process_claim(nome, damage, deductible) → imprime resumo\nChame cada uma ao menos duas vezes com valores diferentes.'
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
      sampleOutput: { en: 'Alice | Priority: Critical | Payout: $11700\nBob | Priority: Normal | Payout: $3250', pt: 'Alice | Priority: Critical | Payout: $11700\nBob | Priority: Normal | Payout: $3250' }
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
    print(f"Claim for {client}: ${damage} | {status} | {priority}")

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
        en: 'Add a default deductible of $250 to the function signature.',
        pt: 'Adicione uma franquia padrão de R$250 à assinatura da função.'
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
        en: 'Write a function full_claim_report(client, damage, deductible=250, coverage=0.80) that:\n• Calculates payout (after deductible × coverage)\n• Returns: payout, priority, status\nCall it 3 times with different overrides.',
        pt: 'Escreva a função relatorio_sinistro(client, damage, deductible=250, coverage=0.80) que:\n• Calcula pagamento (após franquia × cobertura)\n• Retorna: pagamento, prioridade, status\nChame 3 vezes com diferentes sobrescritas.'
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
print(f"Alice: ${payout} | {priority} | {status}")

# Test 2: custom deductible
payout, priority, status = full_claim_report("Bob", 12000, deductible=500)
print(f"Bob: ${payout} | {priority} | {status}")

# Test 3: custom coverage
payout, priority, status = full_claim_report("Carlos", 3000, coverage=1.0)
print(f"Carlos: ${payout} | {priority} | {status}")`,
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
        en: 'Complete the docstring for this function.',
        pt: 'Complete a docstring desta função.'
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
        en: 'Write a function apply_deductible(damage, deductible) WITH a complete docstring.\nInclude: what it does, Args, Returns, one Example.',
        pt: 'Escreva a função apply_deductible(damage, deductible) COM uma docstring completa.\nInclua: o que faz, Args, Returns, um Example.'
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
    print(f"{client} | {r} | ${p}")

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
        en: 'This code has a scope bug. Identify what\'s wrong, then fix it using the "parameter + return" approach.',
        pt: 'Este código tem um bug de escopo. Identifique o problema e corrija usando a abordagem "parâmetro + return".'
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
        en: 'Demonstrate scope by writing:\n1. A function that uses a LOCAL counter (starts fresh each call)\n2. A function that accumulates using parameters + return (not global)',
        pt: 'Demonstre escopo escrevendo:\n1. Uma função que usa contador LOCAL (começa do zero a cada chamada)\n2. Uma função que acumula usando parâmetros + return (sem global)'
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
  description: { en: 'Load data from .txt files.', pt: 'Carregue dados de arquivos .txt.' },
  icon: '📄',
  libraries: [],
  lesson: { title: { en: 'File I/O', pt: 'I/O de Arquivo' }, blocks: [{ type: 'code', code: `with open("data.txt", "r") as f:\n  lines = f.readlines()\n  for line in lines:\n    print(line)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Read File', pt: 'Ler Arquivo' }, scenario: { en: `Read and process file lines.`, pt: `Leia e processe linhas de arquivo.` }, requirements: { en: ['Open file', 'Read lines', 'Process'], pt: ['Abra arquivo', 'Leia linhas', 'Processe'] }, starterCode: `with open("claims.txt", "r") as f:\n  for line in f:\n    print(line)`, testCases: [{ id: 'tc17_1', description: { en: 'Reads file', pt: 'Lê arquivo' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase18: Phase = {
  id: 18,
  title: { en: 'Writing Files', pt: 'Escrevendo Arquivos' },
  description: { en: 'Save data to files. Persistence.', pt: 'Salve dados em arquivos. Persistência.' },
  icon: '💾',
  libraries: [],
  lesson: { title: { en: 'File Writing', pt: 'Escrita de Arquivo' }, blocks: [{ type: 'code', code: `with open("report.txt", "w") as f:\n  f.write("Claim #2501\\n")\n  f.write("Damage: $5,000\\n")` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Save Report', pt: 'Salvar Relatório' }, scenario: { en: `Write data to file.`, pt: `Escreva dados em arquivo.` }, requirements: { en: ['Open for writing', 'Write lines', 'Close'], pt: ['Abra para escrita', 'Escreva linhas', 'Feche'] }, starterCode: `with open("output.txt", "w") as f:\n  f.write("Line 1\\n")\n  f.write("Line 2\\n")`, testCases: [{ id: 'tc18_1', description: { en: 'Writes file', pt: 'Escreve arquivo' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase19: Phase = {
  id: 19,
  title: { en: 'JSON Data', pt: 'Dados JSON' },
  description: { en: 'Read/write JSON. Structured data.', pt: 'Leia/escreva JSON. Dados estruturados.' },
  icon: '📊',
  libraries: ['json'],
  lesson: { title: { en: 'JSON Format', pt: 'Formato JSON' }, blocks: [{ type: 'code', code: `import json\n\ndata = {"id": 2501, "damage": 5000}\njson_str = json.dumps(data)\nprint(json_str)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'JSON I/O', pt: 'I/O JSON' }, scenario: { en: `Read/write JSON data.`, pt: `Leia/escreva dados JSON.` }, requirements: { en: ['Import json', 'dumps/loads', 'File ops'], pt: ['Importe json', 'dumps/loads', 'Operações de arquivo'] }, starterCode: `import json\n\ndata = {"id": 1, "name": "Alice"}\nwith open("data.json", "w") as f:\n  json.dump(data, f)`, testCases: [{ id: 'tc19_1', description: { en: 'JSON works', pt: 'JSON funciona' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase20: Phase = {
  id: 20,
  title: { en: 'DateTime', pt: 'DateTime' },
  description: { en: 'Work with dates and times.', pt: 'Trabalhe com datas e horas.' },
  icon: '🕐',
  libraries: ['datetime'],
  lesson: { title: { en: 'Date & Time', pt: 'Data e Hora' }, blocks: [{ type: 'code', code: `from datetime import datetime\n\nnow = datetime.now()\nprint(now)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Date Calc', pt: 'Cálculo de Data' }, scenario: { en: `Calculate days between dates.`, pt: `Calcule dias entre datas.` }, requirements: { en: ['Import datetime', 'Create dates', 'Calculate diff'], pt: ['Importe datetime', 'Crie datas', 'Calcule diff'] }, starterCode: `from datetime import datetime\n\ndate1 = datetime(2026, 1, 1)\ndate2 = datetime(2026, 7, 13)\ndiff = date2 - date1\nprint(diff.days)`, testCases: [{ id: 'tc20_1', description: { en: 'Calculates days', pt: 'Calcula dias' }, inputs: [], checks: [{ type: 'contains', value: '194' }], points: 100 }] }
}

export const phase21: Phase = {
  id: 21,
  title: { en: 'Random', pt: 'Aleatório' },
  description: { en: 'Generate random values. Simulations.', pt: 'Gere valores aleatórios. Simulações.' },
  icon: '🎲',
  libraries: ['random'],
  lesson: { title: { en: 'Random Module', pt: 'Módulo Random' }, blocks: [{ type: 'code', code: `import random\n\nnum = random.randint(1, 100)\nprint(num)` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Random Sim', pt: 'Simulação Aleatória' }, scenario: { en: `Simulate random claim selection.`, pt: `Simule seleção aleatória de sinistro.` }, requirements: { en: ['Import random', 'Generate values', 'Use in logic'], pt: ['Importe random', 'Gere valores', 'Use em lógica'] }, starterCode: `import random\n\nclients = ["Alice", "Bob", "Diana"]\nselected = random.choice(clients)\nprint(selected)`, testCases: [{ id: 'tc21_1', description: { en: 'Chooses randomly', pt: 'Escolhe aleatoriamente' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase22: Phase = {
  id: 22,
  title: { en: 'Math Lib', pt: 'Biblioteca Math' },
  description: { en: 'Advanced math functions.', pt: 'Funções de matemática avançada.' },
  icon: '✖️',
  libraries: ['math'],
  lesson: { title: { en: 'Math Functions', pt: 'Funções Matemáticas' }, blocks: [{ type: 'code', code: `import math\n\nprint(math.sqrt(16))   # 4\nprint(math.ceil(4.2))  # 5\nprint(math.floor(4.8)) # 4` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Math Ops', pt: 'Operações Math' }, scenario: { en: `Use math functions in calculations.`, pt: `Use funções de math em cálculos.` }, requirements: { en: ['Import math', 'Use functions', 'Calculate'], pt: ['Importe math', 'Use funções', 'Calcule'] }, starterCode: `import math\n\narea = math.sqrt(100)\nprint(area)`, testCases: [{ id: 'tc22_1', description: { en: 'Math works', pt: 'Math funciona' }, inputs: [], checks: [{ type: 'contains', value: '10' }], points: 100 }] }
}

export const phase23: Phase = {
  id: 23,
  title: { en: 'Error Handling', pt: 'Tratamento de Erro' },
  description: { en: 'Try-except blocks. Graceful failures.', pt: 'Blocos try-except. Falhas graciosas.' },
  icon: '🛡️',
  libraries: [],
  lesson: { title: { en: 'Exception Handling', pt: 'Tratamento de Exceção' }, blocks: [{ type: 'code', code: `try:\n  num = int(input("Number: "))\nexcept ValueError:\n  print("Invalid input")` }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Safe Input', pt: 'Entrada Segura' }, scenario: { en: `Handle invalid input safely.`, pt: `Trate entrada inválida com segurança.` }, requirements: { en: ['Try-except block', 'Catch errors', 'Recover gracefully'], pt: ['Bloco try-except', 'Capture erros', 'Recupere graciosamente'] }, starterCode: `try:\n  damage = int(input("Damage: "))\n  print("Damage:", damage)\nexcept ValueError:\n  print("Please enter a number")`, testCases: [{ id: 'tc23_1', description: { en: 'Handles errors', pt: 'Trata erros' }, inputs: ['abc'], inputMap: { 'damage': 'abc' }, checks: [{ type: 'contains', value: 'number' }], points: 100 }] }
}

// BLOCK 6: PROJECTS (Phases 24-27)
export const phase24: Phase = {
  id: 24,
  title: { en: 'Project: Calculator', pt: 'Projeto: Calculadora' },
  description: { en: 'Integrated project. Real-world app.', pt: 'Projeto integrado. Aplicação real.' },
  icon: '🧮',
  libraries: [],
  lesson: { title: { en: 'Calculator Project', pt: 'Projeto Calculadora' }, blocks: [{ type: 'text', content: { en: 'Build a damage calculator for insurance claims', pt: 'Crie uma calculadora de dano para sinistros de seguros' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Damage Calculator', pt: 'Calculadora de Dano' }, scenario: { en: `Calculate payout from damages and deductible.`, pt: `Calcule pagamento de danos e franquia.` }, requirements: { en: ['Functions', 'Input/output', 'Math', 'Error handling'], pt: ['Funções', 'Entrada/saída', 'Matemática', 'Tratamento de erro'] }, starterCode: `def calculate_payout(damage, deductible):\n  return damage - deductible\n\nprint("Insurance Calculator")\ndamage = int(input("Damage ($): "))\npayout = calculate_payout(damage, 250)\nprint("Payout: $", payout)`, testCases: [{ id: 'tc24_1', description: { en: 'Full project works', pt: 'Projeto completo funciona' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase25: Phase = {
  id: 25,
  title: { en: 'Project: CRUD', pt: 'Projeto: CRUD' },
  description: { en: 'Create, Read, Update, Delete data.', pt: 'Criar, Ler, Atualizar, Deletar dados.' },
  icon: '📋',
  libraries: [],
  lesson: { title: { en: 'CRUD Operations', pt: 'Operações CRUD' }, blocks: [{ type: 'text', content: { en: 'Build a claims manager', pt: 'Crie um gerenciador de sinistros' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Claims Manager', pt: 'Gerenciador de Sinistros' }, scenario: { en: `Manage list of claims with add, view, update.`, pt: `Gerencie lista de sinistros com adicionar, visualizar, atualizar.` }, requirements: { en: ['List operations', 'Functions', 'User interface'], pt: ['Operações de lista', 'Funções', 'Interface do usuário'] }, starterCode: `claims = []\n\ndef add_claim(claim_id, damage):\n  claims.append({"id": claim_id, "damage": damage})\n\nadd_claim(2501, 5000)\nprint(claims)`, testCases: [{ id: 'tc25_1', description: { en: 'CRUD works', pt: 'CRUD funciona' }, inputs: [], checks: [{ type: 'contains', value: '2501' }], points: 100 }] }
}

export const phase26: Phase = {
  id: 26,
  title: { en: 'Project: Data Analysis', pt: 'Projeto: Análise de Dados' },
  description: { en: 'Read, analyze, report on data.', pt: 'Leia, analise, relate sobre dados.' },
  icon: '📈',
  libraries: [],
  lesson: { title: { en: 'Data Analysis', pt: 'Análise de Dados' }, blocks: [{ type: 'text', content: { en: 'Analyze claims data for insights', pt: 'Analise dados de sinistros para insights' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Analysis Report', pt: 'Relatório de Análise' }, scenario: { en: `Generate statistics from claims data.`, pt: `Gere estatísticas de dados de sinistros.` }, requirements: { en: ['Data loading', 'Calculations', 'Reporting'], pt: ['Carregamento de dados', 'Cálculos', 'Relatório'] }, starterCode: `damages = [1000, 2500, 5000, 3000, 1500]\naverage = sum(damages) / len(damages)\nmax_damage = max(damages)\nmin_damage = min(damages)\nprint("Average:", average, "Max:", max_damage, "Min:", min_damage)`, testCases: [{ id: 'tc26_1', description: { en: 'Analysis works', pt: 'Análise funciona' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

export const phase27: Phase = {
  id: 27,
  title: { en: 'Capstone: Full System', pt: 'Capstone: Sistema Completo' },
  description: { en: 'Integrate everything. Final project.', pt: 'Integre tudo. Projeto final.' },
  icon: '🏆',
  libraries: [],
  lesson: { title: { en: 'System Integration', pt: 'Integração de Sistema' }, blocks: [{ type: 'text', content: { en: 'Build a complete claims processing system', pt: 'Crie um sistema completo de processamento de sinistros' } }] },
  exercises: [],
  quiz: [],
  exam: { title: { en: 'Full System', pt: 'Sistema Completo' }, scenario: { en: `Create interactive menu-driven claims system.`, pt: `Crie sistema de sinistros acionado por menu interativo.` }, requirements: { en: ['Menu loop', 'Full CRUD', 'File I/O', 'Error handling', 'Functions'], pt: ['Loop de menu', 'CRUD completo', 'I/O de arquivo', 'Tratamento de erro', 'Funções'] }, starterCode: `# Claims System\ndef show_menu():\n  print("1. Add Claim")\n  print("2. View Claims")\n  print("3. Exit")\n\nwhile True:\n  show_menu()\n  choice = input("Choice: ")\n  if choice == "3":\n    break`, testCases: [{ id: 'tc27_1', description: { en: 'System runs', pt: 'Sistema roda' }, inputs: ['3'], inputMap: { 'choice': '3' }, checks: [{ type: 'no_error', value: '' }], points: 100 }] }
}

