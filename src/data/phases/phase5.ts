import type { Phase } from '../types'

export const phase5: Phase = {
  id: 5,
  title: { en: 'Data Structures', pt: 'Estruturas de Dados' },
  description: {
    en: 'Master lists, dictionaries, tuples and sets — the containers that hold and organize all your data.',
    pt: 'Domine listas, dicionários, tuplas e conjuntos — os containers que guardam e organizam todos os seus dados.'
  },
  icon: '📦',
  libraries: [],

  lesson: {
    title: { en: 'Data Structures — Organizing Your Data', pt: 'Estruturas de Dados — Organizando Seus Dados' },
    blocks: [
      {
        type: 'heading',
        content: { en: 'Lists — ordered, changeable collections', pt: 'Listas — coleções ordenadas e mutáveis' }
      },
      {
        type: 'text',
        content: {
          en: 'A list stores multiple items in a single variable. Items are ordered (they have an index), changeable (you can add/remove), and allow duplicates.',
          pt: 'Uma lista armazena múltiplos itens em uma única variável. Os itens são ordenados (têm um índice), mutáveis (você pode adicionar/remover) e permitem duplicatas.'
        }
      },
      {
        type: 'code',
        code: `# Create a list
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]

# Access by index (starts at 0)
print(fruits[0])    # apple
print(fruits[-1])   # cherry (last item)

# Slicing
print(fruits[0:2])  # ['apple', 'banana']
print(numbers[::2]) # [1, 3, 5] (every 2nd)

# Modify
fruits[1] = "mango"
fruits.append("grape")     # add to end
fruits.insert(0, "kiwi")   # add at index
fruits.remove("cherry")    # remove by value
popped = fruits.pop()      # remove and return last

# Info
print(len(fruits))         # length
print("apple" in fruits)   # check membership`
      },
      {
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=W8KRzm-HUcc',
        videoTitle: { en: 'Python lists explained', pt: 'Listas Python explicadas' },
        videoDuration: '0:55'
      },
      {
        type: 'heading',
        content: { en: 'List comprehensions', pt: 'Compreensões de lista' }
      },
      {
        type: 'text',
        content: {
          en: 'List comprehensions are a concise way to create lists from existing sequences. They replace many for loops in professional Python code.',
          pt: 'Compreensões de lista são uma forma concisa de criar listas a partir de sequências existentes. Elas substituem muitos loops for no código Python profissional.'
        }
      },
      {
        type: 'code',
        code: `# Traditional way
squares = []
for i in range(1, 6):
    squares.append(i ** 2)

# List comprehension — same result, one line
squares = [i ** 2 for i in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

# With condition
evens = [i for i in range(20) if i % 2 == 0]

# Transform strings
names = ["alice", "bob", "carol"]
upper = [name.upper() for name in names]`
      },
      {
        type: 'heading',
        content: { en: 'Dictionaries — key-value pairs', pt: 'Dicionários — pares chave-valor' }
      },
      {
        type: 'text',
        content: {
          en: 'A dictionary stores data as <strong>key: value</strong> pairs. Instead of using a number index like lists, you use a meaningful key. Perfect for storing structured data like user profiles.',
          pt: 'Um dicionário armazena dados como pares <strong>chave: valor</strong>. Em vez de usar um índice numérico como listas, você usa uma chave significativa. Perfeito para armazenar dados estruturados como perfis de usuário.'
        }
      },
      {
        type: 'code',
        code: `# Create a dictionary
person = {
    "name": "Alex",
    "age": 28,
    "city": "Toronto",
    "languages": ["Python", "English", "Portuguese"]
}

# Access values
print(person["name"])           # Alex
print(person.get("age"))        # 28
print(person.get("email", "N/A"))  # N/A (default if missing)

# Modify
person["age"] = 33
person["email"] = "r@email.com"  # add new key
del person["city"]               # remove key

# Iterate
for key, value in person.items():
    print(f"{key}: {value}")

# Check membership
print("name" in person)   # True
print("phone" in person)  # False`
      },
      {
        type: 'heading',
        content: { en: 'Tuples — ordered, unchangeable', pt: 'Tuplas — ordenadas e imutáveis' }
      },
      {
        type: 'code',
        code: `# Tuples use parentheses — can't be modified after creation
coordinates = (40.7128, -74.0060)  # lat, lng of NYC
rgb = (255, 128, 0)                 # orange color

# Access same as list
print(coordinates[0])  # 40.7128

# Why use tuples?
# - Faster than lists
# - Protect data from accidental changes
# - Can be used as dictionary keys

# Unpack tuple values
lat, lng = coordinates
print(f"Latitude: {lat}, Longitude: {lng}")`
      },
      {
        type: 'heading',
        content: { en: 'Sets — unique values only', pt: 'Conjuntos — apenas valores únicos' }
      },
      {
        type: 'code',
        code: `# Sets automatically remove duplicates
numbers = {1, 2, 3, 2, 1, 4}
print(numbers)  # {1, 2, 3, 4}

# Great for removing duplicates from a list
emails = ["a@x.com", "b@x.com", "a@x.com", "c@x.com"]
unique_emails = list(set(emails))

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a & b)   # intersection: {3, 4}
print(a | b)   # union: {1, 2, 3, 4, 5, 6}
print(a - b)   # difference: {1, 2}`
      },
      {
        type: 'tip',
        content: {
          en: 'Quick guide: Use a <strong>list</strong> for ordered items you\'ll change. Use a <strong>dict</strong> for labeled data. Use a <strong>tuple</strong> for fixed data you won\'t change. Use a <strong>set</strong> when you need unique values.',
          pt: 'Guia rápido: Use uma <strong>lista</strong> para itens ordenados que você vai mudar. Use um <strong>dict</strong> para dados com rótulos. Use uma <strong>tupla</strong> para dados fixos que não vai mudar. Use um <strong>set</strong> quando precisar de valores únicos.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex5_1',
      title: { en: 'Shopping Cart', pt: 'Carrinho de Compras' },
      description: {
        en: 'Build a shopping cart using a list. Let the user add items, view the cart, and remove items. Use a while loop with a menu.',
        pt: 'Construa um carrinho de compras usando uma lista. Deixe o usuário adicionar itens, ver o carrinho e remover itens. Use um loop while com menu.'
      },
      starterCode: `cart = []

while True:
    print("\\n1. Add item  2. View cart  3. Remove item  4. Quit")
    choice = input("Choose: ")
    
    if choice == "1":
        item = input("Item name: ")
        cart.append(item)
        print(f"Added {item}")
    elif choice == "2":
        if cart:
            for i, item in enumerate(cart, 1):
                print(f"{i}. {item}")
        else:
            print("Cart is empty")
    elif choice == "3":
        # Remove an item by name
        pass
    elif choice == "4":
        break`,
      hints: [
        { en: 'Use cart.remove(item_name) to remove by name', pt: 'Use cart.remove(nome_item) para remover pelo nome' }
      ]
    },
    {
      id: 'ex5_2',
      title: { en: 'Word Counter', pt: 'Contador de Palavras' },
      description: {
        en: 'Ask the user to type a sentence. Count how many times each word appears using a dictionary. Print the results sorted by count.',
        pt: 'Peça ao usuário que digite uma frase. Conte quantas vezes cada palavra aparece usando um dicionário. Imprima os resultados ordenados por contagem.'
      },
      starterCode: `sentence = input("Enter a sentence: ").lower()
words = sentence.split()
word_count = {}

for word in words:
    if word in word_count:
        word_count[word] += 1
    else:
        word_count[word] = 1

# Sort by count (descending) and print
sorted_words = sorted(word_count.items(), key=lambda x: x[1], reverse=True)
for word, count in sorted_words:
    print(f"{word}: {count}")`,
      hints: [
        { en: 'sentence.split() splits by spaces into a list of words', pt: 'sentence.split() divide por espaços em uma lista de palavras' }
      ]
    },
    {
      id: 'ex5_3',
      title: { en: 'Student Grades', pt: 'Notas dos Alunos' },
      description: {
        en: 'Store student names and grades in a dictionary. Calculate average, find highest and lowest grade, and print a report.',
        pt: 'Armazene nomes e notas de alunos em um dicionário. Calcule a média, encontre a nota mais alta e mais baixa, e imprima um relatório.'
      },
      starterCode: `students = {
    "Alice": 92,
    "Bob": 85,
    "Carol": 78,
    "David": 95,
    "Eva": 88
}

# Calculate average
average = sum(students.values()) / len(students)

# Find best and worst student
best = max(students, key=students.get)
worst = min(students, key=students.get)

print(f"Average grade: {average:.1f}")
print(f"Best student: {best} ({students[best]})")
print(f"Needs improvement: {worst} ({students[worst]})")
print()

# Print all students with pass/fail
for name, grade in students.items():
    status = "Pass" if grade >= 80 else "Fail"
    print(f"{name}: {grade} — {status}")`,
      hints: [
        { en: 'max(students, key=students.get) finds the key with the highest value', pt: 'max(students, key=students.get) encontra a chave com o valor mais alto' }
      ]
    }
  ],

  quiz: [
    {
      id: 'q5_1',
      question: { en: 'What is the index of the first element in a Python list?', pt: 'Qual é o índice do primeiro elemento em uma lista Python?' },
      options: [
        { en: '1', pt: '1' },
        { en: '0', pt: '0' },
        { en: '-1', pt: '-1' },
        { en: 'It has no index', pt: 'Não tem índice' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'Python lists are zero-indexed — the first element is at index 0, the second at index 1, etc. Index -1 refers to the last element.',
        pt: 'Listas Python usam índice zero — o primeiro elemento está no índice 0, o segundo no índice 1, etc. O índice -1 refere-se ao último elemento.'
      }
    },
    {
      id: 'q5_2',
      question: { en: 'Which method adds an item to the end of a list?', pt: 'Qual método adiciona um item ao final de uma lista?' },
      options: [
        { en: 'list.add()', pt: 'list.add()' },
        { en: 'list.push()', pt: 'list.push()' },
        { en: 'list.append()', pt: 'list.append()' },
        { en: 'list.insert()', pt: 'list.insert()' }
      ],
      correctIndex: 2,
      explanation: {
        en: 'append() adds to the end. insert(index, value) adds at a specific position. There is no add() or push() in Python lists.',
        pt: 'append() adiciona ao final. insert(índice, valor) adiciona em uma posição específica. Não existe add() ou push() em listas Python.'
      }
    },
    {
      id: 'q5_3',
      question: {
        en: 'What is the output?\n\nd = {"a": 1, "b": 2}\nprint(d.get("c", 99))',
        pt: 'Qual é a saída?\n\nd = {"a": 1, "b": 2}\nprint(d.get("c", 99))'
      },
      options: [
        { en: 'KeyError', pt: 'KeyError' },
        { en: 'None', pt: 'None' },
        { en: '99', pt: '99' },
        { en: '"c"', pt: '"c"' }
      ],
      correctIndex: 2,
      explanation: {
        en: 'dict.get(key, default) returns the default value if the key doesn\'t exist. Since "c" is not in d, it returns 99.',
        pt: 'dict.get(chave, padrão) retorna o valor padrão se a chave não existir. Como "c" não está em d, retorna 99.'
      }
    },
    {
      id: 'q5_4',
      question: { en: 'What makes sets different from lists?', pt: 'O que diferencia sets de listas?' },
      options: [
        { en: 'Sets are faster to create', pt: 'Sets são mais rápidos de criar' },
        { en: 'Sets only store numbers', pt: 'Sets armazenam apenas números' },
        { en: 'Sets automatically remove duplicates and are unordered', pt: 'Sets removem automaticamente duplicatas e são não ordenados' },
        { en: 'Sets can only have 10 items', pt: 'Sets podem ter apenas 10 itens' }
      ],
      correctIndex: 2,
      explanation: {
        en: 'Sets store only unique values and have no guaranteed order. They are perfect for removing duplicates or checking membership quickly.',
        pt: 'Sets armazenam apenas valores únicos e não têm ordem garantida. São perfeitos para remover duplicatas ou verificar pertencimento rapidamente.'
      }
    },
    {
      id: 'q5_5',
      question: { en: 'What does this list comprehension create?\n\n[x**2 for x in range(4)]', pt: 'O que essa compreensão de lista cria?\n\n[x**2 for x in range(4)]' },
      options: [
        { en: '[1, 4, 9, 16]', pt: '[1, 4, 9, 16]' },
        { en: '[0, 1, 4, 9]', pt: '[0, 1, 4, 9]' },
        { en: '[0, 2, 4, 6]', pt: '[0, 2, 4, 6]' },
        { en: '[1, 2, 3, 4]', pt: '[1, 2, 3, 4]' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'range(4) gives 0, 1, 2, 3. Squaring each: 0²=0, 1²=1, 2²=4, 3²=9. Result: [0, 1, 4, 9].',
        pt: 'range(4) dá 0, 1, 2, 3. Elevando ao quadrado: 0²=0, 1²=1, 2²=4, 3²=9. Resultado: [0, 1, 4, 9].'
      }
    }
  ],

  exam: {
    title: { en: 'Contact Book CLI', pt: 'Agenda de Contatos CLI' },
    scenario: {
      en: `Build a Contact Book command-line program.

Store contacts as a dictionary where the key is the name and the value is a dictionary with "phone" and "email".

Your program must support these commands:
- add — add a new contact (ask for name, phone, email)
- list — show all contacts
- search — find a contact by name
- delete — remove a contact
- quit — exit

Example:
Command: add
Name: Alice
Phone: 555-1234
Email: alice@email.com
Contact saved!

Command: list
1. Alice — 555-1234 — alice@email.com

Command: search
Name to search: Alice
Found: Alice — 555-1234 — alice@email.com`,
      pt: `Construa um programa de Agenda de Contatos por linha de comando.

Armazene contatos como dicionário onde a chave é o nome e o valor é um dicionário com "phone" e "email".

Seu programa deve suportar estes comandos:
- add — adicionar novo contato
- list — mostrar todos os contatos
- search — encontrar contato por nome
- delete — remover contato
- quit — sair`
    },
    requirements: {
      en: [
        'Use a dictionary to store contacts',
        'Support "add" command — saves name, phone, email',
        'Support "list" command — shows all contacts',
        'Support "search" command — finds by name',
        'Support "delete" command — removes a contact',
        'Support "quit" to exit the loop'
      ],
      pt: [
        'Use um dicionário para armazenar contatos',
        'Suporte o comando "add" — salva nome, telefone, email',
        'Suporte o comando "list" — mostra todos os contatos',
        'Suporte o comando "search" — busca pelo nome',
        'Suporte o comando "delete" — remove um contato',
        'Suporte "quit" para sair do loop'
      ]
    },
    starterCode: `# Phase 5 Exam — Contact Book
contacts = {}

while True:
    command = input("Command (add/list/search/delete/quit): ").lower()
    
    if command == "add":
        name = input("Name: ")
        phone = input("Phone: ")
        email = input("Email: ")
        contacts[name] = {"phone": phone, "email": email}
        print("Contact saved!")
    
    elif command == "list":
        if contacts:
            for i, (name, info) in enumerate(contacts.items(), 1):
                print(f"{i}. {name} — {info['phone']} — {info['email']}")
        else:
            print("No contacts yet")
    
    elif command == "search":
        # Ask for name and find it
        pass
    
    elif command == "delete":
        # Ask for name and remove it
        pass
    
    elif command == "quit":
        break`,
    testCases: [
      {
        id: 'tc5_1',
        description: { en: 'Add command saves contact', pt: 'Comando add salva contato' },
        inputs: ['add', 'Alice', '555-1234', 'alice@test.com', 'quit'],
        checks: [{ type: 'contains_any', value: ['saved', 'added', 'Added', 'Saved'] }],
        points: 10
      },
      {
        id: 'tc5_2',
        description: { en: 'List shows added contact', pt: 'List mostra contato adicionado' },
        inputs: ['add', 'Bob', '555-5678', 'bob@test.com', 'list', 'quit'],
        checks: [{ type: 'contains', value: 'Bob' }],
        points: 10
      },
      {
        id: 'tc5_3',
        description: { en: 'List shows phone number', pt: 'List mostra número de telefone' },
        inputs: ['add', 'Bob', '555-5678', 'bob@test.com', 'list', 'quit'],
        checks: [{ type: 'contains', value: '555-5678' }],
        points: 10
      },
      {
        id: 'tc5_4',
        description: { en: 'List shows email', pt: 'List mostra email' },
        inputs: ['add', 'Bob', '555-5678', 'bob@test.com', 'list', 'quit'],
        checks: [{ type: 'contains', value: 'bob@test.com' }],
        points: 10
      },
      {
        id: 'tc5_5',
        description: { en: 'Search finds existing contact', pt: 'Search encontra contato existente' },
        inputs: ['add', 'Carol', '555-9999', 'carol@test.com', 'search', 'Carol', 'quit'],
        checks: [{ type: 'contains', value: 'Carol' }],
        points: 10
      },
      {
        id: 'tc5_6',
        description: { en: 'Search shows phone of found contact', pt: 'Search mostra telefone do contato encontrado' },
        inputs: ['add', 'Carol', '555-9999', 'carol@test.com', 'search', 'Carol', 'quit'],
        checks: [{ type: 'contains', value: '555-9999' }],
        points: 10
      },
      {
        id: 'tc5_7',
        description: { en: 'Delete removes contact', pt: 'Delete remove contato' },
        inputs: ['add', 'Dave', '555-0000', 'dave@test.com', 'delete', 'Dave', 'list', 'quit'],
        checks: [{ type: 'contains_any', value: ['deleted', 'removed', 'Deleted', 'Removed', 'No contacts'] }],
        points: 10
      },
      {
        id: 'tc5_8',
        description: { en: 'Empty list shows message', pt: 'Lista vazia mostra mensagem' },
        inputs: ['list', 'quit'],
        checks: [{ type: 'contains_any', value: ['empty', 'no contact', 'No contact', 'yet', 'none'] }],
        points: 10
      },
      {
        id: 'tc5_9',
        description: { en: 'Multiple contacts work', pt: 'Múltiplos contatos funcionam' },
        inputs: ['add', 'Alice', '111', 'a@a.com', 'add', 'Bob', '222', 'b@b.com', 'list', 'quit'],
        checks: [{ type: 'contains', value: 'Alice' }, { type: 'contains', value: 'Bob' }],
        points: 10
      },
      {
        id: 'tc5_10',
        description: { en: 'Runs without errors', pt: 'Roda sem erros' },
        inputs: ['quit'],
        checks: [{ type: 'no_error', value: '' }],
        points: 10
      }
    ]
  }
}
