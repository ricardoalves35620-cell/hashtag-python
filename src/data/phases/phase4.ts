import type { Phase } from '../types'

export const phase4: Phase = {
  id: 4,
  title: { en: 'Functions', pt: 'Funções' },
  description: {
    en: 'Write reusable, organized code with functions — the foundation of every professional codebase.',
    pt: 'Escreva código reutilizável e organizado com funções — a base de todo código profissional.'
  },
  icon: '🧩',
  libraries: [],

  lesson: {
    title: { en: 'Functions — Write Once, Use Everywhere', pt: 'Funções — Escreva Uma Vez, Use Em Todo Lugar' },
    blocks: [
      {
        type: 'heading',
        content: { en: 'What is a function?', pt: 'O que é uma função?' }
      },
      {
        type: 'text',
        content: {
          en: 'A function is a named block of code that does one specific job. Instead of writing the same code over and over, you write it once inside a function and call it whenever you need it. This is one of the most important concepts in all of programming.',
          pt: 'Uma função é um bloco de código nomeado que faz um trabalho específico. Em vez de escrever o mesmo código repetidamente, você escreve uma vez dentro de uma função e a chama sempre que precisar. Este é um dos conceitos mais importantes em toda a programação.'
        }
      },
      {
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=9Os0o3wzS_I',
        videoTitle: { en: 'Python functions explained', pt: 'Funções Python explicadas' },
        videoDuration: '0:58'
      },
      {
        type: 'heading',
        content: { en: 'Defining and calling a function', pt: 'Definindo e chamando uma função' }
      },
      {
        type: 'code',
        code: `# Define a function with "def"
def greet():
    print("Hello! Welcome to Python.")
    print("Let's learn together!")

# Call the function — runs the code inside
greet()
greet()   # call it as many times as you want`
      },
      {
        type: 'heading',
        content: { en: 'Parameters and arguments', pt: 'Parâmetros e argumentos' }
      },
      {
        type: 'text',
        content: {
          en: '<strong>Parameters</strong> are the variables in the function definition. <strong>Arguments</strong> are the actual values you pass when calling. Think of parameters as empty boxes that get filled when you call the function.',
          pt: '<strong>Parâmetros</strong> são as variáveis na definição da função. <strong>Argumentos</strong> são os valores reais que você passa ao chamar. Pense nos parâmetros como caixas vazias que são preenchidas quando você chama a função.'
        }
      },
      {
        type: 'code',
        code: `def greet(name):              # 'name' is the parameter
    print(f"Hello, {name}!")

greet("Alex")              # "Alex" is the argument
greet("Alice")

# Multiple parameters
def add(a, b):
    print(f"{a} + {b} = {a + b}")

add(10, 5)
add(100, 200)`
      },
      {
        type: 'heading',
        content: { en: 'return — sending values back', pt: 'return — devolvendo valores' }
      },
      {
        type: 'text',
        content: {
          en: 'A function can <strong>return</strong> a value back to wherever it was called. This is what makes functions truly powerful — they can compute something and give you the result to use.',
          pt: 'Uma função pode <strong>retornar</strong> um valor de volta para onde foi chamada. É isso que torna as funções realmente poderosas — elas podem calcular algo e te dar o resultado para usar.'
        }
      },
      {
        type: 'code',
        code: `def add(a, b):
    return a + b       # sends the result back

result = add(10, 5)   # result = 15
print(result)

# Use the return value directly
print(add(3, 4) * 2)  # 14

# Return multiple values
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 8, 2, 5])
print(f"Min: {low}, Max: {high}")`
      },
      {
        type: 'heading',
        content: { en: 'Default parameters', pt: 'Parâmetros padrão' }
      },
      {
        type: 'code',
        code: `# Default value used if argument not provided
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alex")              # Hello, Alex!
greet("Alice", "Good morning")  # Good morning, Alice!

# Common use case: optional settings
def calculate_tax(price, rate=0.13):
    return price * rate

print(calculate_tax(100))       # 13.0 (13% tax)
print(calculate_tax(100, 0.05)) # 5.0 (5% tax)`
      },
      {
        type: 'heading',
        content: { en: '*args and **kwargs', pt: '*args e **kwargs' }
      },
      {
        type: 'code',
        code: `# *args — accept any number of arguments
def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3))       # 6
print(total(10, 20, 30, 40)) # 100

# **kwargs — accept named arguments
def profile(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

profile(name="Alex", age=28, city="Toronto")`
      },
      {
        type: 'heading',
        content: { en: 'Scope — where variables live', pt: 'Escopo — onde as variáveis vivem' }
      },
      {
        type: 'code',
        code: `x = 10  # global variable

def my_func():
    y = 20  # local variable — only exists inside this function
    print(x)  # can read global
    print(y)  # can read local

my_func()
print(x)   # works
# print(y)  # ERROR — y doesn't exist outside the function`
      },
      {
        type: 'heading',
        content: { en: 'Docstrings — documenting your code', pt: 'Docstrings — documentando seu código' }
      },
      {
        type: 'code',
        code: `def calculate_bmi(weight_kg, height_m):
    """
    Calculate Body Mass Index (BMI).
    
    Args:
        weight_kg: Weight in kilograms
        height_m: Height in meters
    
    Returns:
        float: The BMI value
    """
    return weight_kg / (height_m ** 2)

# Access the docstring
print(calculate_bmi.__doc__)`
      },
      {
        type: 'tip',
        content: {
          en: 'Good functions do ONE thing and have a clear name that describes what they do. If you struggle to name a function, it probably does too much. Split it.',
          pt: 'Boas funções fazem UMA coisa e têm um nome claro que descreve o que fazem. Se você tem dificuldade em nomear uma função, ela provavelmente faz coisas demais. Divida-a.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex4_1',
      title: { en: 'Temperature Converter', pt: 'Conversor de Temperatura' },
      description: {
        en: 'Write two functions: celsius_to_fahrenheit(c) and fahrenheit_to_celsius(f). Then ask the user what to convert and show the result.',
        pt: 'Escreva duas funções: celsius_to_fahrenheit(c) e fahrenheit_to_celsius(f). Depois pergunte ao usuário o que converter e mostre o resultado.'
      },
      starterCode: `def celsius_to_fahrenheit(c):
    # Formula: (c * 9/5) + 32
    return 

def fahrenheit_to_celsius(f):
    # Formula: (f - 32) * 5/9
    return 

choice = input("Convert C to F or F to C? (c/f): ").lower()
temp = float(input("Enter temperature: "))

if choice == "c":
    result = celsius_to_fahrenheit(temp)
    print(f"{temp}°C = {result:.1f}°F")
else:
    result = fahrenheit_to_celsius(temp)
    print(f"{temp}°F = {result:.1f}°C")`,
      hints: [
        { en: 'celsius_to_fahrenheit: return (c * 9/5) + 32', pt: 'celsius_to_fahrenheit: return (c * 9/5) + 32' },
        { en: 'fahrenheit_to_celsius: return (f - 32) * 5/9', pt: 'fahrenheit_to_celsius: return (f - 32) * 5/9' }
      ]
    },
    {
      id: 'ex4_2',
      title: { en: 'Password Validator', pt: 'Validador de Senha' },
      description: {
        en: 'Write a function is_valid_password(password) that returns True if the password has at least 8 characters, contains a number, and contains an uppercase letter.',
        pt: 'Escreva uma função is_valid_password(password) que retorna True se a senha tiver pelo menos 8 caracteres, contiver um número e uma letra maiúscula.'
      },
      starterCode: `def is_valid_password(password):
    if len(password) < 8:
        return False
    # Check for at least one digit
    has_digit = any(char.isdigit() for char in password)
    # Check for at least one uppercase
    has_upper = 
    return has_digit and has_upper

# Test it
passwords = ["abc", "password", "Password1", "SHORT1A"]
for pwd in passwords:
    valid = is_valid_password(pwd)
    print(f"{pwd}: {'Valid' if valid else 'Invalid'}")`,
      hints: [
        { en: 'has_upper = any(char.isupper() for char in password)', pt: 'has_upper = any(char.isupper() for char in password)' }
      ]
    },
    {
      id: 'ex4_3',
      title: { en: 'Statistics Calculator', pt: 'Calculadora de Estatísticas' },
      description: {
        en: 'Write three functions: calculate_mean(numbers), calculate_max(numbers), calculate_min(numbers). Then use them to analyze a list of scores.',
        pt: 'Escreva três funções: calculate_mean(numbers), calculate_max(numbers), calculate_min(numbers). Depois use-as para analisar uma lista de notas.'
      },
      starterCode: `def calculate_mean(numbers):
    return sum(numbers) / len(numbers)

def calculate_max(numbers):
    # Return the highest number
    return 

def calculate_min(numbers):
    # Return the lowest number
    return 

scores = [85, 92, 78, 95, 88, 72, 96, 83]

print(f"Mean: {calculate_mean(scores):.1f}")
print(f"Max: {calculate_max(scores)}")
print(f"Min: {calculate_min(scores)}")`,
      hints: [
        { en: 'Use the built-in max() and min() functions, or loop through the list', pt: 'Use as funções embutidas max() e min(), ou percorra a lista' }
      ]
    }
  ],

  quiz: [
    {
      id: 'q4_1',
      question: { en: 'What keyword is used to define a function in Python?', pt: 'Qual palavra-chave é usada para definir uma função em Python?' },
      options: [
        { en: 'function', pt: 'function' },
        { en: 'define', pt: 'define' },
        { en: 'def', pt: 'def' },
        { en: 'func', pt: 'func' }
      ],
      correctIndex: 2,
      explanation: {
        en: 'In Python, functions are defined with "def". Example: def my_function():',
        pt: 'Em Python, funções são definidas com "def". Exemplo: def minha_funcao():'
      }
    },
    {
      id: 'q4_2',
      question: { en: 'What does "return" do in a function?', pt: 'O que "return" faz em uma função?' },
      options: [
        { en: 'Prints a value to the screen', pt: 'Imprime um valor na tela' },
        { en: 'Sends a value back to the caller and exits the function', pt: 'Envia um valor de volta ao chamador e sai da função' },
        { en: 'Restarts the function', pt: 'Reinicia a função' },
        { en: 'Creates a new variable', pt: 'Cria uma nova variável' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'return sends a value back to wherever the function was called, and immediately exits the function. Without return, the function returns None.',
        pt: 'return envia um valor de volta para onde a função foi chamada, e sai imediatamente da função. Sem return, a função retorna None.'
      }
    },
    {
      id: 'q4_3',
      question: {
        en: 'What is printed?\n\ndef double(x):\n    return x * 2\n\nprint(double(5))',
        pt: 'O que é impresso?\n\ndef double(x):\n    return x * 2\n\nprint(double(5))'
      },
      options: [
        { en: 'x * 2', pt: 'x * 2' },
        { en: '5', pt: '5' },
        { en: '10', pt: '10' },
        { en: 'double(5)', pt: 'double(5)' }
      ],
      correctIndex: 2,
      explanation: {
        en: 'double(5) calls the function with x=5, which returns 5*2=10. print() then displays 10.',
        pt: 'double(5) chama a função com x=5, que retorna 5*2=10. print() então exibe 10.'
      }
    },
    {
      id: 'q4_4',
      question: { en: 'What is a default parameter?', pt: 'O que é um parâmetro padrão?' },
      options: [
        { en: 'A parameter that is always required', pt: 'Um parâmetro que é sempre obrigatório' },
        { en: 'A parameter with a preset value used when no argument is given', pt: 'Um parâmetro com valor predefinido usado quando nenhum argumento é fornecido' },
        { en: 'The first parameter of every function', pt: 'O primeiro parâmetro de toda função' },
        { en: 'A parameter that returns None', pt: 'Um parâmetro que retorna None' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'Default parameters have a value set in the function definition. Example: def greet(name, greeting="Hello") — greeting defaults to "Hello" if not provided.',
        pt: 'Parâmetros padrão têm um valor definido na definição da função. Exemplo: def greet(name, greeting="Hello") — greeting usa "Hello" por padrão se não fornecido.'
      }
    },
    {
      id: 'q4_5',
      question: { en: 'What is the scope of a variable defined inside a function?', pt: 'Qual é o escopo de uma variável definida dentro de uma função?' },
      options: [
        { en: 'Global — accessible everywhere', pt: 'Global — acessível em todo lugar' },
        { en: 'Local — only accessible inside that function', pt: 'Local — acessível apenas dentro dessa função' },
        { en: 'Module — accessible in the current file only', pt: 'Módulo — acessível apenas no arquivo atual' },
        { en: 'It depends on the variable name', pt: 'Depende do nome da variável' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'Variables defined inside a function are local — they only exist while the function runs. Trying to access them outside the function causes a NameError.',
        pt: 'Variáveis definidas dentro de uma função são locais — existem apenas enquanto a função roda. Tentar acessá-las fora da função causa um NameError.'
      }
    }
  ],

  exam: {
    title: { en: 'Unit Converter', pt: 'Conversor de Unidades' },
    scenario: {
      en: `Build a Unit Converter program using functions.

Your program must have these functions:
- km_to_miles(km) — converts kilometers to miles (1 km = 0.621371 miles)
- miles_to_km(miles) — converts miles to kilometers
- kg_to_lbs(kg) — converts kilograms to pounds (1 kg = 2.20462 lbs)
- lbs_to_kg(lbs) — converts pounds to kilograms

Then:
1. Show a menu with all 4 options
2. Ask the user to choose (1-4)
3. Ask for the value to convert
4. Call the correct function and print the result with 2 decimal places

Example:
1. km to miles
2. miles to km
3. kg to lbs
4. lbs to kg
Choose (1-4): 1
Enter km: 10
10.0 km = 6.21 miles`,
      pt: `Construa um programa Conversor de Unidades usando funções.

Seu programa deve ter estas funções:
- km_to_miles(km) — converte km para milhas (1 km = 0.621371 milhas)
- miles_to_km(miles) — converte milhas para km
- kg_to_lbs(kg) — converte kg para libras (1 kg = 2.20462 lbs)
- lbs_to_kg(lbs) — converte libras para kg

Depois:
1. Mostre um menu com as 4 opções
2. Peça ao usuário que escolha (1-4)
3. Peça o valor a converter
4. Chame a função correta e imprima o resultado com 2 casas decimais`
    },
    requirements: {
      en: [
        'Define all 4 conversion functions using def',
        'Each function must use return (not print)',
        'Show a menu with numbered options',
        'Use if/elif to call the correct function',
        'Print result with 2 decimal places',
        'Program runs without errors'
      ],
      pt: [
        'Defina as 4 funções de conversão usando def',
        'Cada função deve usar return (não print)',
        'Mostre um menu com opções numeradas',
        'Use if/elif para chamar a função correta',
        'Imprima o resultado com 2 casas decimais',
        'Programa roda sem erros'
      ]
    },
    starterCode: `# Phase 4 Exam — Unit Converter

def km_to_miles(km):
    return km * 0.621371

def miles_to_km(miles):
    # 1 mile = 1.60934 km
    return 

def kg_to_lbs(kg):
    return 

def lbs_to_kg(lbs):
    return 

print("1. km to miles")
print("2. miles to km")
print("3. kg to lbs")
print("4. lbs to kg")

choice = input("Choose (1-4): ")
value = float(input("Enter value: "))

if choice == "1":
    result = km_to_miles(value)
    print(f"{value} km = {result:.2f} miles")
elif choice == "2":
    # Complete this...
    pass
`,
    testCases: [
      {
        id: 'tc4_1',
        description: { en: 'km to miles: 10 km = 6.21 miles', pt: 'km para milhas: 10 km = 6.21 milhas' },
        inputs: ['1', '10'],
        checks: [{ type: 'contains', value: '6.21' }],
        points: 10
      },
      {
        id: 'tc4_2',
        description: { en: 'miles to km: 10 miles ≈ 16.09 km', pt: 'milhas para km: 10 milhas ≈ 16.09 km' },
        inputs: ['2', '10'],
        checks: [{ type: 'contains', value: '16.09' }],
        points: 10
      },
      {
        id: 'tc4_3',
        description: { en: 'kg to lbs: 10 kg = 22.05 lbs', pt: 'kg para lbs: 10 kg = 22.05 lbs' },
        inputs: ['3', '10'],
        checks: [{ type: 'contains', value: '22.05' }],
        points: 10
      },
      {
        id: 'tc4_4',
        description: { en: 'lbs to kg: 10 lbs ≈ 4.54 kg', pt: 'lbs para kg: 10 lbs ≈ 4.54 kg' },
        inputs: ['4', '10'],
        checks: [{ type: 'contains', value: '4.54' }],
        points: 10
      },
      {
        id: 'tc4_5',
        description: { en: 'Menu shows 4 options', pt: 'Menu mostra 4 opções' },
        inputs: ['1', '1'],
        checks: [{ type: 'contains', value: '4' }],
        points: 10
      },
      {
        id: 'tc4_6',
        description: { en: '1 km = 0.62 miles', pt: '1 km = 0.62 milhas' },
        inputs: ['1', '1'],
        checks: [{ type: 'contains', value: '0.62' }],
        points: 10
      },
      {
        id: 'tc4_7',
        description: { en: '100 km = 62.14 miles', pt: '100 km = 62.14 milhas' },
        inputs: ['1', '100'],
        checks: [{ type: 'contains', value: '62.14' }],
        points: 10
      },
      {
        id: 'tc4_8',
        description: { en: '50 kg = 110.23 lbs', pt: '50 kg = 110.23 lbs' },
        inputs: ['3', '50'],
        checks: [{ type: 'contains', value: '110.23' }],
        points: 10
      },
      {
        id: 'tc4_9',
        description: { en: 'Result has 2 decimal places', pt: 'Resultado tem 2 casas decimais' },
        inputs: ['1', '10'],
        checks: [{ type: 'contains', value: '6.21' }],
        points: 10
      },
      {
        id: 'tc4_10',
        description: { en: 'Runs without errors', pt: 'Roda sem erros' },
        inputs: ['1', '5'],
        checks: [{ type: 'no_error', value: '' }],
        points: 10
      }
    ]
  }
}
