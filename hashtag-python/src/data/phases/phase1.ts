import type { Phase } from '../types'

export const phase1: Phase = {
  id: 1,
  title: { en: 'Fundamentals', pt: 'Fundamentos' },
  description: {
    en: 'Variables, data types, print, and input — the building blocks of every Python program.',
    pt: 'Variáveis, tipos de dados, print e input — os blocos de construção de todo programa Python.'
  },
  icon: '🧱',
  libraries: [],

  lesson: {
    title: { en: 'Python Fundamentals', pt: 'Fundamentos do Python' },
    blocks: [
      {
        type: 'heading',
        content: { en: 'What is Python?', pt: 'O que é Python?' }
      },
      {
        type: 'text',
        content: {
          en: 'Python is a programming language that reads almost like English. You write instructions, and the computer follows them — one line at a time. It\'s one of the most popular languages in the world, used for websites, data science, automation, and more.',
          pt: 'Python é uma linguagem de programação que parece quase inglês. Você escreve instruções e o computador as segue — uma linha por vez. É uma das linguagens mais populares do mundo, usada para sites, ciência de dados, automação e muito mais.'
        }
      },
      {
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=x7X9w_GIm1s',
        videoTitle: { en: 'Python in 100 Seconds', pt: 'Python em 100 Segundos' },
        videoDuration: '1:40'
      },
      {
        type: 'heading',
        content: { en: 'Your First Program: print()', pt: 'Seu Primeiro Programa: print()' }
      },
      {
        type: 'text',
        content: {
          en: 'The <code>print()</code> function shows text on the screen. It\'s the first thing every programmer learns. Put whatever you want to display inside the parentheses, between quotes.',
          pt: 'A função <code>print()</code> mostra texto na tela. É a primeira coisa que todo programador aprende. Coloque o que quiser exibir dentro dos parênteses, entre aspas.'
        }
      },
      {
        type: 'code',
        code: `print("Hello, World!")
print("Welcome to Hashtag Python!")
print("My name is Ricardo")`
      },
      {
        type: 'tip',
        content: {
          en: 'Try it yourself! Every line with print() shows one line on the screen. Order matters — Python runs top to bottom.',
          pt: 'Tente você mesmo! Cada linha com print() mostra uma linha na tela. A ordem importa — Python roda de cima para baixo.'
        }
      },
      {
        type: 'heading',
        content: { en: 'Variables — Storing Information', pt: 'Variáveis — Guardando Informações' }
      },
      {
        type: 'text',
        content: {
          en: 'A variable is like a labeled box that stores information. You give it a name, and put a value inside. Use <code>=</code> to assign a value. Later, you can use the name to get the value back.',
          pt: 'Uma variável é como uma caixa com etiqueta que guarda informações. Você dá um nome a ela e coloca um valor dentro. Use <code>=</code> para atribuir um valor. Depois, você pode usar o nome para recuperar o valor.'
        }
      },
      {
        type: 'code',
        code: `name = "Ricardo"
age = 32
city = "Oshawa"

print(name)
print(age)
print(city)`
      },
      {
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=cQT33yu9pY8',
        videoTitle: { en: 'Variables explained in 60 seconds', pt: 'Variáveis explicadas em 60 segundos' },
        videoDuration: '0:58'
      },
      {
        type: 'heading',
        content: { en: 'Data Types', pt: 'Tipos de Dados' }
      },
      {
        type: 'text',
        content: {
          en: 'Python has different types of data. The most common ones are: <strong>str</strong> (text, always in quotes), <strong>int</strong> (whole numbers), <strong>float</strong> (decimal numbers), and <strong>bool</strong> (True or False).',
          pt: 'Python tem diferentes tipos de dados. Os mais comuns são: <strong>str</strong> (texto, sempre entre aspas), <strong>int</strong> (números inteiros), <strong>float</strong> (números decimais) e <strong>bool</strong> (True ou False).'
        }
      },
      {
        type: 'code',
        code: `# str — text
first_name = "Alice"
last_name = 'Smith'

# int — whole number
age = 25
year = 2024

# float — decimal number
height = 1.75
price = 9.99

# bool — true or false
is_student = True
has_job = False

print(type(first_name))  # <class 'str'>
print(type(age))         # <class 'int'>
print(type(height))      # <class 'float'>
print(type(is_student))  # <class 'bool'>`
      },
      {
        type: 'heading',
        content: { en: 'Getting Input from the User', pt: 'Recebendo Entrada do Usuário' }
      },
      {
        type: 'text',
        content: {
          en: 'The <code>input()</code> function pauses the program and waits for the user to type something. Whatever they type gets stored as a string. If you need a number, wrap it with <code>int()</code> or <code>float()</code>.',
          pt: 'A função <code>input()</code> pausa o programa e espera o usuário digitar algo. O que for digitado é armazenado como string. Se precisar de número, envolva com <code>int()</code> ou <code>float()</code>.'
        }
      },
      {
        type: 'code',
        code: `name = input("What is your name? ")
age = int(input("How old are you? "))

print("Hello,", name)
print("You are", age, "years old")`
      },
      {
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=I9h1c-121Uk',
        videoTitle: { en: 'Python input() function', pt: 'Função input() no Python' },
        videoDuration: '0:55'
      },
      {
        type: 'heading',
        content: { en: 'F-Strings — Easy Text Formatting', pt: 'F-Strings — Formatação de Texto Fácil' }
      },
      {
        type: 'text',
        content: {
          en: 'An f-string lets you put variables directly inside a string. Put an <code>f</code> before the quotes, then use <code>{variable_name}</code> wherever you want the value to appear. This is the cleanest way to format output.',
          pt: 'Uma f-string permite colocar variáveis diretamente dentro de uma string. Coloque um <code>f</code> antes das aspas, depois use <code>{nome_da_variavel}</code> onde quiser que o valor apareça. É a forma mais limpa de formatar saída.'
        }
      },
      {
        type: 'code',
        code: `name = "Ricardo"
age = 32
city = "Oshawa"

# Without f-string (harder to read)
print("My name is " + name + " and I am " + str(age) + " years old.")

# With f-string (clean and easy)
print(f"My name is {name} and I am {age} years old.")
print(f"I live in {city}, Canada.")

# You can even do math inside {}
birth_year = 2024 - age
print(f"I was born in {birth_year}.")`
      },
      {
        type: 'heading',
        content: { en: 'Basic Math Operations', pt: 'Operações Matemáticas Básicas' }
      },
      {
        type: 'code',
        code: `a = 10
b = 3

print(a + b)   # Addition: 13
print(a - b)   # Subtraction: 7
print(a * b)   # Multiplication: 30
print(a / b)   # Division: 3.333...
print(a // b)  # Integer division: 3
print(a % b)   # Remainder: 1
print(a ** b)  # Power: 1000`
      },
      {
        type: 'tip',
        content: {
          en: 'You can do math directly inside f-strings! Example: <code>f"You were born in {2024 - age}"</code> — Python calculates it automatically.',
          pt: 'Você pode fazer cálculos diretamente dentro de f-strings! Exemplo: <code>f"Você nasceu em {2024 - age}"</code> — Python calcula automaticamente.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex1_1',
      title: { en: 'Print Your Info', pt: 'Imprima Suas Informações' },
      description: {
        en: 'Create three variables: your name, your age, and your city. Then print each one on a separate line using print().',
        pt: 'Crie três variáveis: seu nome, sua idade e sua cidade. Depois imprima cada uma em uma linha separada usando print().'
      },
      starterCode: `# Create your variables here
name = 
age = 
city = 

# Print them
`,
      hints: [
        {
          en: 'Text values need quotes: name = "Your Name"',
          pt: 'Valores de texto precisam de aspas: name = "Seu Nome"'
        },
        {
          en: 'Numbers don\'t need quotes: age = 25',
          pt: 'Números não precisam de aspas: age = 25'
        }
      ],
      sampleOutput: {
        en: 'Alice\n30\nToronto',
        pt: 'Alice\n30\nToronto'
      }
    },
    {
      id: 'ex1_2',
      title: { en: 'Greeting Card', pt: 'Cartão de Saudação' },
      description: {
        en: 'Ask the user for their name and age. Then print a friendly greeting using an f-string. Example output: "Hello Alice! You are 25 years old. Welcome!"',
        pt: 'Pergunte ao usuário seu nome e idade. Depois imprima uma saudação amigável usando uma f-string. Exemplo: "Olá Alice! Você tem 25 anos. Seja bem-vindo!"'
      },
      starterCode: `# Ask for name and age
name = input("What is your name? ")
age = 

# Print the greeting using an f-string
print(f"")
`,
      hints: [
        {
          en: 'Use int() to convert age: age = int(input(...))',
          pt: 'Use int() para converter a idade: age = int(input(...))'
        },
        {
          en: 'F-string example: f"Hello {name}!"',
          pt: 'Exemplo de f-string: f"Olá {name}!"'
        }
      ]
    },
    {
      id: 'ex1_3',
      title: { en: 'Rectangle Calculator', pt: 'Calculadora de Retângulo' },
      description: {
        en: 'Ask for the width and height of a rectangle. Calculate and print the area (width × height) and perimeter (2 × (width + height)).',
        pt: 'Pergunte a largura e altura de um retângulo. Calcule e imprima a área (largura × altura) e o perímetro (2 × (largura + altura)).'
      },
      starterCode: `# Get dimensions from user
width = float(input("Enter width: "))
height = 

# Calculate
area = 
perimeter = 

# Print results
print(f"Area: {area}")
print(f"Perimeter: {perimeter}")
`,
      hints: [
        {
          en: 'Area = width * height',
          pt: 'Área = largura * altura'
        },
        {
          en: 'Perimeter = 2 * (width + height)',
          pt: 'Perímetro = 2 * (largura + altura)'
        }
      ]
    }
  ],

  quiz: [
    {
      id: 'q1_1',
      question: {
        en: 'What does this code print?\n\nname = "Python"\nprint(name)',
        pt: 'O que esse código imprime?\n\nname = "Python"\nprint(name)'
      },
      options: [
        { en: '"Python" (with quotes)', pt: '"Python" (com aspas)' },
        { en: 'Python (without quotes)', pt: 'Python (sem aspas)' },
        { en: 'name', pt: 'name' },
        { en: 'An error', pt: 'Um erro' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'print() displays the value of the variable, not the variable name or the quotes. So it prints: Python',
        pt: 'print() exibe o valor da variável, não o nome da variável nem as aspas. Então imprime: Python'
      }
    },
    {
      id: 'q1_2',
      question: {
        en: 'Which line correctly gets a number from the user?',
        pt: 'Qual linha coleta corretamente um número do usuário?'
      },
      options: [
        { en: 'age = input("Age: ")', pt: 'age = input("Idade: ")' },
        { en: 'age = int(input("Age: "))', pt: 'age = int(input("Idade: "))' },
        { en: 'age = print("Age: ")', pt: 'age = print("Idade: ")' },
        { en: 'int = age(input("Age: "))', pt: 'int = age(input("Idade: "))' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'input() always returns a string. You need int() to convert it to a number so you can do math with it.',
        pt: 'input() sempre retorna uma string. Você precisa do int() para convertê-la em número para poder fazer cálculos.'
      }
    },
    {
      id: 'q1_3',
      question: {
        en: 'What type is the value 3.14?',
        pt: 'Qual é o tipo do valor 3.14?'
      },
      options: [
        { en: 'int', pt: 'int' },
        { en: 'str', pt: 'str' },
        { en: 'float', pt: 'float' },
        { en: 'bool', pt: 'bool' }
      ],
      correctIndex: 2,
      explanation: {
        en: '3.14 is a float — a decimal number. int is for whole numbers only (like 3 or 14).',
        pt: '3.14 é um float — um número decimal. int é somente para números inteiros (como 3 ou 14).'
      }
    },
    {
      id: 'q1_4',
      question: {
        en: 'What does this f-string print?\n\nage = 25\nprint(f"I am {age} years old")',
        pt: 'O que essa f-string imprime?\n\nage = 25\nprint(f"I am {age} years old")'
      },
      options: [
        { en: 'I am {age} years old', pt: 'I am {age} years old' },
        { en: 'I am 25 years old', pt: 'I am 25 years old' },
        { en: 'f"I am 25 years old"', pt: 'f"I am 25 years old"' },
        { en: 'Error — missing quotes', pt: 'Erro — aspas faltando' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'The f before the string activates f-string mode. {age} is replaced by the value of age, which is 25.',
        pt: 'O f antes da string ativa o modo f-string. {age} é substituído pelo valor de age, que é 25.'
      }
    },
    {
      id: 'q1_5',
      question: {
        en: 'What does 10 % 3 return?',
        pt: 'O que 10 % 3 retorna?'
      },
      options: [
        { en: '3', pt: '3' },
        { en: '3.33', pt: '3.33' },
        { en: '1', pt: '1' },
        { en: '0', pt: '0' }
      ],
      correctIndex: 2,
      explanation: {
        en: '% is the modulo operator — it returns the remainder after division. 10 ÷ 3 = 3 remainder 1, so 10 % 3 = 1.',
        pt: '% é o operador módulo — retorna o resto da divisão. 10 ÷ 3 = 3 com resto 1, então 10 % 3 = 1.'
      }
    }
  ],

  exam: {
    title: { en: 'Personal Profile Card', pt: 'Cartão de Perfil Pessoal' },
    scenario: {
      en: `Build a Personal Profile Card program.

Your program must:
1. Ask the user for their first name
2. Ask for their last name
3. Ask for their birth year
4. Ask for their favorite programming language
5. Calculate their age using: age = 2024 - birth_year
6. Print a formatted profile card showing ALL of the above information including the calculated age

Example output (with inputs: Alice, Smith, 1990, Python):
=== PROFILE CARD ===
Name: Alice Smith
Age: 34
Birth Year: 1990
Favorite Language: Python
====================`,
      pt: `Construa um programa de Cartão de Perfil Pessoal.

Seu programa deve:
1. Perguntar o primeiro nome do usuário
2. Perguntar o sobrenome
3. Perguntar o ano de nascimento
4. Perguntar a linguagem de programação favorita
5. Calcular a idade usando: age = 2024 - birth_year
6. Imprimir um cartão de perfil formatado mostrando TODAS as informações acima incluindo a idade calculada

Exemplo de saída (com entradas: Alice, Smith, 1990, Python):
=== PROFILE CARD ===
Name: Alice Smith
Age: 34
Birth Year: 1990
Favorite Language: Python
====================`
    },
    requirements: {
      en: [
        'Use input() to collect first name, last name, birth year, and favorite language',
        'Calculate age as 2024 minus birth year',
        'Print the full name (first + last)',
        'Print the calculated age',
        'Print the birth year',
        'Print the favorite language',
        'Program must run without errors for any valid input'
      ],
      pt: [
        'Use input() para coletar primeiro nome, sobrenome, ano de nascimento e linguagem favorita',
        'Calcule a idade como 2024 menos o ano de nascimento',
        'Imprima o nome completo (primeiro + sobrenome)',
        'Imprima a idade calculada',
        'Imprima o ano de nascimento',
        'Imprima a linguagem favorita',
        'O programa deve rodar sem erros para qualquer entrada válida'
      ]
    },
    starterCode: `# Phase 1 Exam — Personal Profile Card
# Complete this program step by step

# Step 1: Collect information from the user
first_name = input("Enter your first name: ")
# Add more inputs here...

# Step 2: Calculate age
current_year = 2024
# age = ?

# Step 3: Print the profile card
print("=== PROFILE CARD ===")
# Print all information here...
print("====================")
`,
    testCases: [
      {
        id: 'tc1_1',
        description: { en: 'Shows first name (Alice)', pt: 'Mostra primeiro nome (Alice)' },
        inputs: ['Alice', 'Smith', '1990', 'Python'],
        checks: [{ type: 'contains', value: 'Alice' }],
        points: 10
      },
      {
        id: 'tc1_2',
        description: { en: 'Shows last name (Smith)', pt: 'Mostra sobrenome (Smith)' },
        inputs: ['Alice', 'Smith', '1990', 'Python'],
        checks: [{ type: 'contains', value: 'Smith' }],
        points: 10
      },
      {
        id: 'tc1_3',
        description: { en: 'Calculates correct age (1990 → 34)', pt: 'Calcula idade correta (1990 → 34)' },
        inputs: ['Alice', 'Smith', '1990', 'Python'],
        checks: [{ type: 'contains', value: '34' }],
        points: 10
      },
      {
        id: 'tc1_4',
        description: { en: 'Shows birth year (1990)', pt: 'Mostra ano de nascimento (1990)' },
        inputs: ['Alice', 'Smith', '1990', 'Python'],
        checks: [{ type: 'contains', value: '1990' }],
        points: 10
      },
      {
        id: 'tc1_5',
        description: { en: 'Shows favorite language (Python)', pt: 'Mostra linguagem favorita (Python)' },
        inputs: ['Alice', 'Smith', '1990', 'Python'],
        checks: [{ type: 'contains', value: 'Python' }],
        points: 10
      },
      {
        id: 'tc1_6',
        description: { en: 'Works with different name (Bob Jones)', pt: 'Funciona com outro nome (Bob Jones)' },
        inputs: ['Bob', 'Jones', '2000', 'JavaScript'],
        checks: [{ type: 'contains', value: 'Bob' }],
        points: 10
      },
      {
        id: 'tc1_7',
        description: { en: 'Calculates different age (2000 → 24)', pt: 'Calcula outra idade (2000 → 24)' },
        inputs: ['Bob', 'Jones', '2000', 'JavaScript'],
        checks: [{ type: 'contains', value: '24' }],
        points: 10
      },
      {
        id: 'tc1_8',
        description: { en: 'Shows different language (JavaScript)', pt: 'Mostra outra linguagem (JavaScript)' },
        inputs: ['Bob', 'Jones', '2000', 'JavaScript'],
        checks: [{ type: 'contains', value: 'JavaScript' }],
        points: 10
      },
      {
        id: 'tc1_9',
        description: { en: 'Works with third test set (Maria)', pt: 'Funciona com terceiro conjunto (Maria)' },
        inputs: ['Maria', 'Silva', '1985', 'Ruby'],
        checks: [{ type: 'contains', value: 'Maria' }, { type: 'contains', value: '39' }],
        points: 10
      },
      {
        id: 'tc1_10',
        description: { en: 'Runs without errors', pt: 'Roda sem erros' },
        inputs: ['Test', 'User', '2001', 'Python'],
        checks: [{ type: 'no_error', value: '' }],
        points: 10
      }
    ]
  }
}
