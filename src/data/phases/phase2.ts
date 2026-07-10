import type { Phase } from '../types'

export const phase2: Phase = {
  id: 2,
  title: { en: 'Conditionals', pt: 'Condicionais' },
  description: {
    en: 'Teach your program to make decisions using if, elif, and else.',
    pt: 'Ensine seu programa a tomar decisões usando if, elif e else.'
  },
  icon: '🔀',
  libraries: [],

  lesson: {
    title: { en: 'Making Decisions with Conditionals', pt: 'Tomando Decisões com Condicionais' },
    blocks: [
      {
        type: 'heading',
        content: { en: 'What is a Conditional?', pt: 'O que é um Condicional?' }
      },
      {
        type: 'text',
        content: {
          en: 'A conditional lets your program choose what to do based on a condition. Think of it as a crossroad: <strong>if</strong> something is true, go left. <strong>else</strong>, go right. This is how programs "think".',
          pt: 'Um condicional permite que seu programa escolha o que fazer com base em uma condição. Pense como uma encruzilhada: <strong>if</strong> algo é verdadeiro, vá à esquerda. <strong>else</strong>, vá à direita. É assim que programas "pensam".'
        }
      },
      {
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=AWek49wXGkI',
        videoTitle: { en: 'If statements in Python', pt: 'Declarações If no Python' },
        videoDuration: '0:58'
      },
      {
        type: 'heading',
        content: { en: 'Basic if / else', pt: 'if / else Básico' }
      },
      {
        type: 'code',
        code: `age = int(input("How old are you? "))

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")`
      },
      {
        type: 'tip',
        content: {
          en: 'The colon (:) at the end of if/else is required. The code inside must be indented (4 spaces or 1 tab). Python uses indentation to know what belongs inside the if block.',
          pt: 'Os dois pontos (:) no final do if/else são obrigatórios. O código interno deve ser indentado (4 espaços ou 1 tab). Python usa indentação para saber o que pertence ao bloco if.'
        }
      },
      {
        type: 'heading',
        content: { en: 'Multiple Conditions with elif', pt: 'Múltiplas Condições com elif' }
      },
      {
        type: 'text',
        content: {
          en: '<code>elif</code> means "else if" — it lets you check more conditions if the first one wasn\'t true. Python checks them in order and stops at the first one that is true.',
          pt: '<code>elif</code> significa "else if" — permite verificar mais condições se a primeira não for verdadeira. Python as verifica em ordem e para na primeira que for verdadeira.'
        }
      },
      {
        type: 'code',
        code: `score = int(input("Enter your score (0-100): "))

if score >= 90:
    print("Grade: A — Excellent!")
elif score >= 80:
    print("Grade: B — Great job!")
elif score >= 70:
    print("Grade: C — Good")
elif score >= 60:
    print("Grade: D — Needs improvement")
else:
    print("Grade: F — Please study more")`
      },
      {
        type: 'heading',
        content: { en: 'Comparison Operators', pt: 'Operadores de Comparação' }
      },
      {
        type: 'code',
        code: `x = 10

print(x == 10)  # Equal to: True
print(x != 5)   # Not equal: True
print(x > 5)    # Greater than: True
print(x < 5)    # Less than: False
print(x >= 10)  # Greater or equal: True
print(x <= 9)   # Less or equal: False`
      },
      {
        type: 'heading',
        content: { en: 'Combining Conditions: and / or', pt: 'Combinando Condições: and / or' }
      },
      {
        type: 'code',
        code: `age = 20
has_id = True

# and — both must be true
if age >= 18 and has_id:
    print("You can enter the club")

# or — at least one must be true
temperature = 25
if temperature > 30 or temperature < 0:
    print("Extreme weather!")
else:
    print("Weather is fine")`
      },
      {
        type: 'warning',
        content: {
          en: 'Common mistake: using = instead of == to compare. Use = only for assigning values. Use == to check if two values are equal.',
          pt: 'Erro comum: usar = em vez de == para comparar. Use = somente para atribuir valores. Use == para verificar se dois valores são iguais.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex2_1',
      title: { en: 'Temperature Classifier', pt: 'Classificador de Temperatura' },
      description: {
        en: 'Ask for a temperature. Print "Hot" if above 30, "Warm" if 20-30, "Cool" if 10-19, or "Cold" if below 10.',
        pt: 'Pergunte uma temperatura. Imprima "Hot" se acima de 30, "Warm" se 20-30, "Cool" se 10-19, ou "Cold" se abaixo de 10.'
      },
      starterCode: `temp = float(input("Enter temperature (°C): "))

if temp > 30:
    print("Hot")
elif temp >= 20:
    # Add more cases...
`,
      hints: [
        { en: 'You need 3 elif blocks and one else', pt: 'Você precisa de 3 blocos elif e um else' },
        { en: 'elif temp >= 20: handles 20 to 30', pt: 'elif temp >= 20: trata de 20 a 30' }
      ]
    },
    {
      id: 'ex2_2',
      title: { en: 'Login System', pt: 'Sistema de Login' },
      description: {
        en: 'Create a simple login. The correct username is "admin" and password is "python123". Print "Access granted" or "Access denied".',
        pt: 'Crie um login simples. O usuário correto é "admin" e a senha é "python123". Imprima "Access granted" ou "Access denied".'
      },
      starterCode: `username = input("Username: ")
password = input("Password: ")

if username == "admin" and password == "python123":
    # What to print?
else:
    # What to print?
`,
      hints: [
        { en: 'Use and to check both conditions at once', pt: 'Use and para verificar as duas condições de uma vez' }
      ]
    },
    {
      id: 'ex2_3',
      title: { en: 'Menu Pricing', pt: 'Preço do Menu' },
      description: {
        en: 'Ask what item the user wants (pizza, burger, or salad). Print the price. If the item is not on the menu, print an error.',
        pt: 'Pergunte qual item o usuário quer (pizza, burger ou salad). Imprima o preço. Se o item não estiver no menu, imprima um erro.'
      },
      starterCode: `item = input("What do you want? ").lower()

# pizza = $12.99, burger = $9.99, salad = $7.99
if item == "pizza":
    print("Price: $12.99")
# Add more items...
`,
      hints: [
        { en: '.lower() converts input to lowercase so "Pizza" and "pizza" both work', pt: '.lower() converte para minúsculas para que "Pizza" e "pizza" funcionem' }
      ]
    }
  ],

  quiz: [
    {
      id: 'q2_1',
      question: { en: 'What keyword do you use when there are multiple conditions to check?', pt: 'Qual palavra-chave usar quando há múltiplas condições?' },
      options: [
        { en: 'else', pt: 'else' },
        { en: 'elif', pt: 'elif' },
        { en: 'then', pt: 'then' },
        { en: 'ifelse', pt: 'ifelse' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'elif stands for "else if". It lets you add more conditions between if and else.',
        pt: 'elif significa "else if". Permite adicionar mais condições entre if e else.'
      }
    },
    {
      id: 'q2_2',
      question: { en: 'What is wrong with this code?\n\nif x = 5:\n    print("five")', pt: 'O que está errado neste código?\n\nif x = 5:\n    print("five")' },
      options: [
        { en: 'Nothing, it\'s correct', pt: 'Nada, está correto' },
        { en: 'Should use == not =', pt: 'Deveria usar == em vez de =' },
        { en: 'Missing else block', pt: 'Faltando bloco else' },
        { en: 'print should be outside if', pt: 'print deveria estar fora do if' }
      ],
      correctIndex: 1,
      explanation: {
        en: '= assigns a value. == compares two values. In an if statement you always need == to compare.',
        pt: '= atribui um valor. == compara dois valores. Em um if você sempre precisa de == para comparar.'
      }
    },
    {
      id: 'q2_3',
      question: { en: 'What does "and" do in a condition?', pt: 'O que "and" faz em uma condição?' },
      options: [
        { en: 'At least one side must be true', pt: 'Pelo menos um lado deve ser verdadeiro' },
        { en: 'Both sides must be true', pt: 'Ambos os lados devem ser verdadeiros' },
        { en: 'Neither side can be true', pt: 'Nenhum dos lados pode ser verdadeiro' },
        { en: 'It adds two numbers', pt: 'Ele soma dois números' }
      ],
      correctIndex: 1,
      explanation: {
        en: '"and" requires ALL conditions to be True. If even one is False, the whole thing is False. Use "or" when only one needs to be True.',
        pt: '"and" exige que TODAS as condições sejam True. Se mesmo uma for False, tudo é False. Use "or" quando apenas uma precisa ser True.'
      }
    },
    {
      id: 'q2_4',
      question: { en: 'What gets printed?\n\nx = 15\nif x > 20:\n    print("A")\nelif x > 10:\n    print("B")\nelse:\n    print("C")', pt: 'O que é impresso?\n\nx = 15\nif x > 20:\n    print("A")\nelif x > 10:\n    print("B")\nelse:\n    print("C")' },
      options: [
        { en: 'A', pt: 'A' },
        { en: 'B', pt: 'B' },
        { en: 'C', pt: 'C' },
        { en: 'B and C', pt: 'B e C' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'x=15 is NOT > 20, so we skip A. x=15 IS > 10, so we print B and stop. C is never reached.',
        pt: 'x=15 NÃO é > 20, então pulamos A. x=15 É > 10, então imprimimos B e paramos. C nunca é alcançado.'
      }
    },
    {
      id: 'q2_5',
      question: { en: 'Which is the correct syntax for an if statement?', pt: 'Qual é a sintaxe correta para um if?' },
      options: [
        { en: 'if (x > 5) { print("yes") }', pt: 'if (x > 5) { print("yes") }' },
        { en: 'if x > 5 then print("yes")', pt: 'if x > 5 then print("yes")' },
        { en: 'if x > 5:\n    print("yes")', pt: 'if x > 5:\n    print("yes")' },
        { en: 'if x > 5 => print("yes")', pt: 'if x > 5 => print("yes")' }
      ],
      correctIndex: 2,
      explanation: {
        en: 'Python if statements end with a colon (:) and the body is indented. No curly braces, no "then".',
        pt: 'Declarações if no Python terminam com dois pontos (:) e o corpo é indentado. Sem chaves, sem "then".'
      }
    }
  ],

  exam: {
    title: { en: 'Restaurant Order System', pt: 'Sistema de Pedido de Restaurante' },
    scenario: {
      en: `Build a Restaurant Order System.

Menu:
- pizza: $12.99
- burger: $9.99
- salad: $7.99
- pasta: $11.50
- soup: $5.99

Your program must:
1. Ask the user what they want to order
2. Ask how many they want
3. If the item is on the menu: show the item, quantity, unit price, and total price
4. If the item is NOT on the menu: print an error message
5. Convert input to lowercase so "Pizza" and "pizza" both work

Example (pizza, 2):
You ordered: 2x pizza
Unit price: $12.99
Total: $25.98

Example (unknown item):
Sorry, "xyz" is not on our menu.`,
      pt: `Construa um Sistema de Pedido de Restaurante.

Cardápio:
- pizza: $12.99
- burger: $9.99
- salad: $7.99
- pasta: $11.50
- soup: $5.99

Seu programa deve:
1. Perguntar ao usuário o que quer pedir
2. Perguntar a quantidade
3. Se o item estiver no menu: mostrar item, quantidade, preço unitário e preço total
4. Se o item NÃO estiver no menu: imprimir mensagem de erro
5. Converter entrada para minúsculas para que "Pizza" e "pizza" funcionem`
    },
    requirements: {
      en: [
        'Use input() to get the item and quantity',
        'Use .lower() on the item input',
        'Use if/elif/else to check all 5 menu items',
        'Calculate total price (quantity × unit price)',
        'Handle unknown items with an error message',
        'Show quantity and total in the output'
      ],
      pt: [
        'Use input() para obter o item e a quantidade',
        'Use .lower() na entrada do item',
        'Use if/elif/else para verificar os 5 itens do menu',
        'Calcule o preço total (quantidade × preço unitário)',
        'Trate itens desconhecidos com mensagem de erro',
        'Mostre quantidade e total na saída'
      ]
    },
    starterCode: `# Phase 2 Exam — Restaurant Order System

item = input("What would you like to order? ").lower()
quantity = int(input("How many? "))

if item == "pizza":
    price = 12.99
    # Print the order details...
elif item == "burger":
    # Complete this...
    pass
# Add more items...
else:
    # Handle unknown items...
    pass
`,
    testCases: [
      {
        id: 'tc2_1',
        description: { en: 'Pizza order shows correct total (2x = $25.98)', pt: 'Pedido de pizza mostra total correto (2x = $25.98)' },
        inputs: ['pizza', '2'],
        checks: [{ type: 'contains', value: '25.98' }],
        points: 10
      },
      {
        id: 'tc2_2',
        description: { en: 'Pizza order shows quantity (2)', pt: 'Pedido de pizza mostra quantidade (2)' },
        inputs: ['pizza', '2'],
        checks: [{ type: 'contains', value: '2' }],
        points: 10
      },
      {
        id: 'tc2_3',
        description: { en: 'Burger recognized and priced', pt: 'Burger reconhecido e precificado' },
        inputs: ['burger', '1'],
        checks: [{ type: 'contains', value: '9.99' }],
        points: 10
      },
      {
        id: 'tc2_4',
        description: { en: 'Salad recognized', pt: 'Salad reconhecida' },
        inputs: ['salad', '1'],
        checks: [{ type: 'contains', value: '7.99' }],
        points: 10
      },
      {
        id: 'tc2_5',
        description: { en: 'Pasta recognized', pt: 'Pasta reconhecida' },
        inputs: ['pasta', '1'],
        checks: [{ type: 'contains', value: '11.50' }, { type: 'contains', value: '11.5' }],
        points: 10
      },
      {
        id: 'tc2_6',
        description: { en: 'Soup recognized', pt: 'Soup reconhecida' },
        inputs: ['soup', '3'],
        checks: [{ type: 'contains', value: '17.97' }],
        points: 10
      },
      {
        id: 'tc2_7',
        description: { en: 'Unknown item shows error', pt: 'Item desconhecido mostra erro' },
        inputs: ['xyz', '1'],
        checks: [{ type: 'contains_any', value: ['not', 'menu', 'sorry', 'invalid', 'found'] }],
        points: 10
      },
      {
        id: 'tc2_8',
        description: { en: 'Works with uppercase (PIZZA)', pt: 'Funciona com maiúsculas (PIZZA)' },
        inputs: ['PIZZA', '1'],
        checks: [{ type: 'contains', value: '12.99' }],
        points: 10
      },
      {
        id: 'tc2_9',
        description: { en: 'Calculates correct total for 3x soup', pt: 'Calcula total correto para 3x soup' },
        inputs: ['soup', '3'],
        checks: [{ type: 'contains', value: '17.97' }],
        points: 10
      },
      {
        id: 'tc2_10',
        description: { en: 'Runs without errors', pt: 'Roda sem erros' },
        inputs: ['burger', '2'],
        checks: [{ type: 'no_error', value: '' }],
        points: 10
      }
    ]
  }
}
