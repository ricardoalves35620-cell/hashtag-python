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

print(f"Total: \${total} across {approved_count} claims")`
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
      description: { en: 'Complete the CSV parser.', pt: 'Complete o parser CSV.' },
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
      description: { en: 'Parse 4 CSV lines:\n• Split each by comma\n• Print only "approved" ones\n• Show client + payout ($250 deductible)\n• Print total', pt: 'Parse 4 linhas CSV:\n• Divida cada uma por vírgula\n• Imprima apenas "approved"\n• Mostre cliente + payout (R$250 franquia)\n• Imprima total' },
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
      description: { en: 'Complete the file writer.', pt: 'Complete o escritor de arquivo.' },
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
      description: { en: 'Generate a CSV:\n• Header: client,damage,payout\n• 3 claim rows with calculated payout ($250 ded)\n• Print "Report saved!" when done', pt: 'Gere um CSV:\n• Header: client,damage,payout\n• 3 linhas com payout calculado (R$250 franquia)\n• Imprima "Report saved!" ao terminar' },
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
      description: { en: 'Complete the JSON round-trip.', pt: 'Complete o ciclo completo JSON.' },
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
      description: { en: 'Parse JSON string from API, calculate payouts, save results to file.', pt: 'Parse string JSON de API, calcule payouts, salve resultados em arquivo.' },
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
      description: { en: 'Complete the SLA deadline calculator.', pt: 'Complete o calculador de prazo SLA.' },
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
      description: { en: 'Build a claim age tracker:\n• 3 claims with open dates\n• Calculate days open\n• Flag OVERDUE if > 7 days', pt: 'Construa um rastreador de idade:\n• 3 sinistros com datas de abertura\n• Calcule dias abertos\n• Sinalize ATRASADO se > 7 dias' },
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
      description: { en: 'Complete the random claim selector.', pt: 'Complete o seletor aleatório.' },
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
      description: { en: 'Simulate 5 random claims:\n• Damage $500–$12000\n• $250 deductible\n• Flag HIGH if damage > $5000\n• Print all + count high-risk', pt: 'Simule 5 sinistros aleatórios:\n• Dano R$500–R$12000\n• R$250 franquia\n• Sinalizar HIGH se dano > R$5000\n• Imprimir todos + contagem alto risco' },
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
      description: { en: 'Complete the circular area calculator.', pt: 'Complete a calculadora de área circular.' },
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
      description: { en: 'Build compound interest calculator:\n• $10,000 at 8% for 5 years\n• A = P * (1+r)^t\n• Round UP to next dollar', pt: 'Construa calculadora de juros compostos:\n• R$10.000 a 8% por 5 anos\n• A = P * (1+r)^t\n• Arredonde PARA CIMA' },
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
      description: { en: 'Add try/except around each crash-prone line.', pt: 'Adicione try/except em cada linha propensa a crash.' },
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
      description: { en: 'Build robust claim intake:\n• Loop until valid number entered\n• Reject negatives\n• Print confirmed payout', pt: 'Construa entrada robusta:\n• Loop até número válido\n• Rejeitar negativos\n• Imprimir payout confirmado' },
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
      description: { en: 'The calculate() below is missing validation. Add the missing checks.', pt: 'O calculate() abaixo está sem validação. Adicione as verificações faltantes.' },
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
      description: { en: 'Build calculator with:\n• calculate() function\n• history list\n• error handling\n• Test with 3 calculations', pt: 'Construa calculadora com:\n• Função calculate()\n• Lista de histórico\n• Tratamento de erros\n• Teste com 3 cálculos' },
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
      { type: 'code', code: `# ❌ MESSY: scattered data manipulation
claims = []
claims.append({"id": 1, "client": "Alice"})   # create
print(claims[0])                                # read
claims[0]["client"] = "Alicia"                  # update
claims.pop(0)                                   # delete` },
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
      description: { en: 'create() and read_all() are done. Complete update() and delete().', pt: 'create() e read_all() estão prontas. Complete update() e delete().' },
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
      description: { en: 'Build and run a full CRUD demo:\n• Create 4 claims\n• Read all\n• Update claim #2\n• Delete claim #4\n• Read final state', pt: 'Construa e execute um demo CRUD completo:\n• Criar 4 sinistros\n• Ler todos\n• Atualizar sinistro #2\n• Deletar sinistro #4\n• Ler estado final' },
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
      description: { en: 'Basic stats done. Add median and critical count.', pt: 'Estatísticas básicas prontas. Adicione mediana e contagem crítica.' },
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
      description: { en: 'Analyze 10 claims:\n• total, average, min, max, median\n• Count Critical/Urgent/Normal\n• Top 3 highest\n• Total payout ($250 deductible)', pt: 'Analise 10 sinistros:\n• total, média, mín, máx, mediana\n• Contagem Crítico/Urgente/Normal\n• Top 3 maiores\n• Total payout (R$250 franquia)' },
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
  title: { en: 'Capstone: Claims System', pt: 'Capstone: Sistema de Sinistros' },
  description: { en: 'Build a complete, production-ready claims management system.', pt: 'Construa um sistema completo de gestão de sinistros pronto para produção.' },
  icon: '🏆',
  libraries: [],
  lesson: {
    title: { en: 'Everything Together', pt: 'Tudo Junto' },
    blocks: [
      { type: 'heading', content: { en: '🌍 You\'ve learned what professionals use daily', pt: '🌍 Você aprendeu o que profissionais usam diariamente' } },
      { type: 'text', content: {
        en: 'Across 27 phases you covered:\n• Variables, types, input (1–4)\n• Decisions and loops (5–8)\n• Data structures (9–12)\n• Functions and scope (13–16)\n• Files, JSON, libraries (17–22)\n• Error handling (23)\n• Full projects (24–26)\n\nThis capstone combines ALL of it.',
        pt: 'Ao longo de 27 fases você cobriu:\n• Variáveis, tipos, input (1–4)\n• Decisões e loops (5–8)\n• Estruturas de dados (9–12)\n• Funções e escopo (13–16)\n• Arquivos, JSON, bibliotecas (17–22)\n• Tratamento de erros (23)\n• Projetos completos (24–26)\n\nEste capstone combina TUDO isso.'
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
      description: { en: 'create_claim() is done. Complete update_status() and delete_claim().', pt: 'create_claim() está pronta. Complete update_status() e delete_claim().' },
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
      description: { en: 'Build complete claims system:\n• CRUD + priority + error handling + analysis\n• 5 claims demo\n• Update 2, delete 1\n• Print final state + stats', pt: 'Construa sistema completo:\n• CRUD + prioridade + erros + análise\n• Demo com 5 sinistros\n• Atualizar 2, deletar 1\n• Imprimir estado final + estatísticas' },
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
    { id: 'q27_4', question: { en: 'You completed 27 phases. What can you build now?', pt: 'Você completou 27 fases. O que pode construir agora?' }, options: [{ en: 'Backend systems, data pipelines, automation tools', pt: 'Sistemas backend, pipelines de dados, ferramentas de automação' }, { en: 'Only calculators', pt: 'Apenas calculadoras' }, { en: 'Only web apps', pt: 'Apenas apps web' }, { en: 'Only scripts', pt: 'Apenas scripts' }], correctIndex: 0, explanation: { en: 'You have the foundation for backend APIs, data analysis, automation, ETL pipelines, and more.', pt: 'Você tem a base para APIs backend, análise de dados, automação, pipelines ETL e muito mais.' } }
  ],
  exam: {
    title: { en: 'Final Capstone: Complete Claims System', pt: 'Capstone Final: Sistema Completo' },
    scenario: { en: 'Build and demo the complete insurance claims system combining all 27 phases.', pt: 'Construa e demonstre o sistema completo combinando todas as 27 fases.' },
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

