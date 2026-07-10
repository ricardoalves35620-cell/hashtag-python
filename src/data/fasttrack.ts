export interface FTBlock {
  type: 'heading' | 'text' | 'code' | 'tip' | 'warning'
  content?: { en: string; pt: string }
  code?: string
}

export interface FTDay {
  id: number
  title: { en: string; pt: string }
  subtitle: { en: string; pt: string }
  color: string
  textColor: string
  duration: number
  outcome: { en: string; pt: string }
  blocks: FTBlock[]
  exercise: {
    title: { en: string; pt: string }
    description: { en: string; pt: string }
    starterCode: string
    solution: string
  }
}

export const FASTTRACK_DAYS: FTDay[] = [
  {
    id: 1,
    title: { en: 'Your First Python Program', pt: 'Seu Primeiro Programa Python' },
    subtitle: { en: 'Variables · types · print · input · f-strings', pt: 'Variáveis · tipos · print · input · f-strings' },
    color: '#2d1b69', textColor: '#a78bfa', duration: 20,
    outcome: {
      en: 'You can read any basic Python script and understand what every line does.',
      pt: 'Você consegue ler qualquer script Python básico e entender o que cada linha faz.'
    },
    blocks: [
      { type: 'heading', content: { en: 'What is Python?', pt: 'O que é Python?' } },
      { type: 'text', content: { en: 'Python is a programming language that reads like English. You write instructions, the computer follows them. Used by NASA, Netflix, Instagram and thousands of companies worldwide.', pt: 'Python é uma linguagem de programação que parece inglês. Você escreve instruções, o computador as segue. Usada pela NASA, Netflix, Instagram e milhares de empresas no mundo.' } },
      { type: 'heading', content: { en: 'Variables — storing information', pt: 'Variáveis — guardando informações' } },
      { type: 'text', content: { en: 'A variable is a labeled box that stores a value. Use <code>=</code> to put something in the box. Python has 4 main types: <strong>str</strong> (text), <strong>int</strong> (whole number), <strong>float</strong> (decimal), <strong>bool</strong> (True/False).', pt: 'Uma variável é uma caixa rotulada que guarda um valor. Use <code>=</code> para colocar algo na caixa. Python tem 4 tipos principais: <strong>str</strong> (texto), <strong>int</strong> (inteiro), <strong>float</strong> (decimal), <strong>bool</strong> (True/False).' } },
      { type: 'code', code: `name = "Alex"    # str — text, always in quotes
age = 28            # int — whole number
height = 1.78       # float — decimal number
is_student = True   # bool — True or False

print(name)   # Alex
print(age)    # 28` },
      { type: 'heading', content: { en: 'input() and print()', pt: 'input() e print()' } },
      { type: 'text', content: { en: '<code>print()</code> shows text on screen. <code>input()</code> asks the user to type something — always returns a string. Wrap with <code>int()</code> if you need a number.', pt: '<code>print()</code> mostra texto na tela. <code>input()</code> pede ao usuário que digite algo — sempre retorna string. Envolva com <code>int()</code> se precisar de número.' } },
      { type: 'code', code: `name = input("What is your name? ")
age = int(input("How old are you? "))
print("Hello,", name)
print("Next year you will be", age + 1)` },
      { type: 'heading', content: { en: 'F-strings — the clean way to format text', pt: 'F-strings — a forma limpa de formatar texto' } },
      { type: 'code', code: `name = "Alex"
age = 28
city = "Toronto"

# Old way (messy)
print("My name is " + name + " and I am " + str(age))

# F-string (clean) — put f before the quotes
print(f"My name is {name} and I am {age} years old")
print(f"I live in {city}, Canada")
print(f"In 10 years I will be {age + 10}")` },
      { type: 'tip', content: { en: 'F-strings are the professional standard. Always use them when combining text and variables.', pt: 'F-strings são o padrão profissional. Use-as sempre ao combinar texto e variáveis.' } }
    ],
    exercise: {
      title: { en: 'Personal Profile Card', pt: 'Cartão de Perfil Pessoal' },
      description: { en: 'Ask for first name, last name, and birth year. Calculate age (2024 - birth year). Print a formatted profile card.', pt: 'Pergunte primeiro nome, sobrenome e ano de nascimento. Calcule a idade (2024 - ano). Imprima um cartão de perfil formatado.' },
      starterCode: `# Ask for information
first_name = input("First name: ")
last_name = 
birth_year = int(input("Birth year: "))

# Calculate age
age = 

# Print profile card
print("=== PROFILE CARD ===")
print(f"Name: {first_name} {last_name}")
print(f"Age: {age}")
print("====================")`,
      solution: `first_name = input("First name: ")
last_name = input("Last name: ")
birth_year = int(input("Birth year: "))

age = 2024 - birth_year

print("=== PROFILE CARD ===")
print(f"Name: {first_name} {last_name}")
print(f"Age: {age}")
print("====================")`
    }
  },
  {
    id: 2,
    title: { en: 'Making Decisions', pt: 'Tomando Decisões' },
    subtitle: { en: 'if · elif · else · and · or · comparison operators', pt: 'if · elif · else · and · or · operadores de comparação' },
    color: '#1a3a1a', textColor: '#86efac', duration: 20,
    outcome: {
      en: 'You understand how any program makes decisions and can trace through if/else logic in code reviews.',
      pt: 'Você entende como qualquer programa toma decisões e consegue acompanhar lógica if/else em revisões de código.'
    },
    blocks: [
      { type: 'heading', content: { en: 'if / elif / else', pt: 'if / elif / else' } },
      { type: 'text', content: { en: 'Conditionals let your program choose what to do. Python checks conditions top to bottom and stops at the first one that is <code>True</code>.', pt: 'Condicionais permitem que seu programa escolha o que fazer. Python verifica condições de cima para baixo e para na primeira que for <code>True</code>.' } },
      { type: 'code', code: `score = int(input("Enter score: "))

if score >= 90:
    print("A — Excellent!")
elif score >= 80:
    print("B — Great job!")
elif score >= 70:
    print("C — Good")
elif score >= 60:
    print("D — Needs work")
else:
    print("F — Please study more")` },
      { type: 'heading', content: { en: 'Comparison operators', pt: 'Operadores de comparação' } },
      { type: 'code', code: `x = 10

print(x == 10)   # True  — equal to
print(x != 5)    # True  — not equal
print(x > 5)     # True  — greater than
print(x < 5)     # False — less than
print(x >= 10)   # True  — greater or equal
print(x <= 9)    # False — less or equal

# COMMON MISTAKE: = assigns, == compares
# if x = 10:  ← ERROR
# if x == 10: ← CORRECT` },
      { type: 'heading', content: { en: 'Combining conditions: and / or', pt: 'Combinando condições: and / or' } },
      { type: 'code', code: `age = 20
has_id = True

# and — BOTH must be true
if age >= 18 and has_id:
    print("Welcome!")

# or — AT LEAST ONE must be true
day = "Saturday"
if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")

# not — reverses True/False
if not has_id:
    print("No ID, no entry")` },
      { type: 'warning', content: { en: 'Use <code>==</code> to compare (is it equal?). Use <code>=</code> to assign (set the value). Mixing them up is the #1 beginner mistake.', pt: 'Use <code>==</code> para comparar (é igual?). Use <code>=</code> para atribuir (definir o valor). Misturá-los é o erro #1 de iniciantes.' } }
    ],
    exercise: {
      title: { en: 'Grade Classifier', pt: 'Classificador de Notas' },
      description: { en: 'Ask for a score (0-100). Print the letter grade AND a personalized message. Also check if the student passes (>= 60).', pt: 'Pergunte uma nota (0-100). Imprima o conceito E uma mensagem personalizada. Verifique também se o aluno passou (>= 60).' },
      starterCode: `score = int(input("Enter your score (0-100): "))

# Determine letter grade
if score >= 90:
    grade = "A"
    message = "Outstanding!"
elif score >= 80:
    grade = 
    message = 
# Complete the rest...

print(f"Grade: {grade}")
print(f"{message}")
if score >= 60:
    print("Result: PASS")
else:
    print("Result: FAIL")`,
      solution: `score = int(input("Enter your score (0-100): "))

if score >= 90:
    grade = "A"
    message = "Outstanding!"
elif score >= 80:
    grade = "B"
    message = "Great job!"
elif score >= 70:
    grade = "C"
    message = "Good work!"
elif score >= 60:
    grade = "D"
    message = "You passed, but try harder."
else:
    grade = "F"
    message = "Don't give up — keep studying!"

print(f"Grade: {grade}")
print(message)
if score >= 60:
    print("Result: PASS")
else:
    print("Result: FAIL")`
    }
  },
  {
    id: 3,
    title: { en: 'Repetition & Automation', pt: 'Repetição e Automação' },
    subtitle: { en: 'for · while · range · break · enumerate', pt: 'for · while · range · break · enumerate' },
    color: '#1a1a3a', textColor: '#93c5fd', duration: 20,
    outcome: {
      en: 'You understand why automation is Python\'s superpower and can explain loops to anyone.',
      pt: 'Você entende por que automação é o superpoder do Python e consegue explicar loops para qualquer pessoa.'
    },
    blocks: [
      { type: 'heading', content: { en: 'for loops — repeat for each item', pt: 'loops for — repetir para cada item' } },
      { type: 'text', content: { en: 'A <code>for</code> loop repeats code for each item in a sequence. <code>range()</code> generates numbers. Without loops, printing 1-100 takes 100 lines. With a loop, it takes 2.', pt: 'Um loop <code>for</code> repete código para cada item em uma sequência. <code>range()</code> gera números. Sem loops, imprimir 1-100 leva 100 linhas. Com loop, leva 2.' } },
      { type: 'code', code: `# Print 1 to 5
for i in range(1, 6):
    print(i)

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# With index using enumerate
for i, fruit in enumerate(fruits, 1):
    print(f"{i}. {fruit}")
# 1. apple  2. banana  3. cherry` },
      { type: 'heading', content: { en: 'while loops — repeat until condition', pt: 'loops while — repetir até condição' } },
      { type: 'code', code: `# Keep asking until correct answer
secret = "python"
while True:
    guess = input("Guess the password: ")
    if guess == secret:
        print("Correct! Welcome!")
        break   # exit the loop
    print("Wrong, try again!")

# Count down
count = 5
while count > 0:
    print(f"T-minus {count}")
    count -= 1
print("Liftoff! 🚀")` },
      { type: 'tip', content: { en: 'Use <code>for</code> when you know how many times to repeat. Use <code>while</code> when you repeat until something happens. Always make sure <code>while</code> loops have a way to exit!', pt: 'Use <code>for</code> quando sabe quantas vezes repetir. Use <code>while</code> quando repete até algo acontecer. Sempre garanta que loops <code>while</code> tenham como sair!' } }
    ],
    exercise: {
      title: { en: 'Times Table Generator', pt: 'Gerador de Tabuada' },
      description: { en: 'Ask for a number. Print its complete multiplication table from 1 to 10. Then ask if the user wants another table.', pt: 'Pergunte um número. Imprima a tabuada completa de 1 a 10. Depois pergunte se o usuário quer outra.' },
      starterCode: `while True:
    number = int(input("\\nEnter a number for its times table: "))
    
    print(f"\\n=== {number} Times Table ===")
    for i in range(1, 11):
        result = 
        print(f"{number} x {i} = {result}")
    
    again = input("\\nAnother table? (yes/no): ")
    if again.lower() != "yes":
        break

print("Goodbye!")`,
      solution: `while True:
    number = int(input("\\nEnter a number for its times table: "))
    
    print(f"\\n=== {number} Times Table ===")
    for i in range(1, 11):
        result = number * i
        print(f"{number} x {i} = {result}")
    
    again = input("\\nAnother table? (yes/no): ")
    if again.lower() != "yes":
        break

print("Goodbye!")`
    }
  },
  {
    id: 4,
    title: { en: 'Functions — Reusable Code', pt: 'Funções — Código Reutilizável' },
    subtitle: { en: 'def · parameters · return · scope · default values', pt: 'def · parâmetros · return · escopo · valores padrão' },
    color: '#3a1a00', textColor: '#fbbf24', duration: 20,
    outcome: {
      en: 'You understand why professional code uses functions and can read any well-structured Python file.',
      pt: 'Você entende por que código profissional usa funções e consegue ler qualquer arquivo Python bem estruturado.'
    },
    blocks: [
      { type: 'heading', content: { en: 'What is a function?', pt: 'O que é uma função?' } },
      { type: 'text', content: { en: 'A function is a named block of code that does one specific job. Write it once, use it many times. Every professional codebase is made of functions.', pt: 'Uma função é um bloco de código nomeado que faz um trabalho específico. Escreva uma vez, use muitas vezes. Todo código profissional é feito de funções.' } },
      { type: 'code', code: `# Define a function
def greet(name):
    print(f"Hello, {name}! Welcome to Python.")

# Call it as many times as needed
greet("Alex")
greet("Alice")
greet("Bob")` },
      { type: 'heading', content: { en: 'return — sending results back', pt: 'return — devolvendo resultados' } },
      { type: 'code', code: `def add(a, b):
    return a + b     # sends the result back

def calculate_tax(price, rate=0.13):   # default value
    return price * rate

result = add(10, 5)
print(result)         # 15

tax = calculate_tax(100)       # uses 13% default
tax2 = calculate_tax(100, 0.05)  # uses 5%

print(f"Tax: \${tax:.2f}")    # Tax: $13.00
print(f"Tax: \${tax2:.2f}")   # Tax: $5.00` },
      { type: 'heading', content: { en: 'Real-world example — BMI calculator', pt: 'Exemplo real — calculadora de IMC' } },
      { type: 'code', code: `def calculate_bmi(weight_kg, height_m):
    """Calculate Body Mass Index."""
    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 1)

def bmi_category(bmi):
    if bmi < 18.5: return "Underweight"
    elif bmi < 25: return "Normal"
    elif bmi < 30: return "Overweight"
    else: return "Obese"

weight = float(input("Weight (kg): "))
height = float(input("Height (m): "))

bmi = calculate_bmi(weight, height)
category = bmi_category(bmi)
print(f"BMI: {bmi} — {category}")` }
    ],
    exercise: {
      title: { en: 'Mini Calculator', pt: 'Mini Calculadora' },
      description: { en: 'Write 4 functions: add(), subtract(), multiply(), divide(). Then build a menu that asks the user to choose an operation and enters two numbers.', pt: 'Escreva 4 funções: add(), subtract(), multiply(), divide(). Depois faça um menu que pede ao usuário escolher uma operação e inserir dois números.' },
      starterCode: `def add(a, b):
    return a + b

def subtract(a, b):
    return 

def multiply(a, b):
    return 

def divide(a, b):
    if b == 0:
        return "Error: cannot divide by zero"
    return 

print("1. Add  2. Subtract  3. Multiply  4. Divide")
choice = input("Choose (1-4): ")
a = float(input("First number: "))
b = float(input("Second number: "))

if choice == "1":
    print(f"Result: {add(a, b)}")
elif choice == "2":
    print(f"Result: {subtract(a, b)}")
# Complete options 3 and 4...`,
      solution: `def add(a, b): return a + b
def subtract(a, b): return a - b
def multiply(a, b): return a * b
def divide(a, b):
    if b == 0: return "Error: cannot divide by zero"
    return a / b

print("1. Add  2. Subtract  3. Multiply  4. Divide")
choice = input("Choose (1-4): ")
a = float(input("First number: "))
b = float(input("Second number: "))

if choice == "1": print(f"Result: {add(a, b)}")
elif choice == "2": print(f"Result: {subtract(a, b)}")
elif choice == "3": print(f"Result: {multiply(a, b)}")
elif choice == "4": print(f"Result: {divide(a, b)}")`
    }
  },
  {
    id: 5,
    title: { en: 'Organizing Data', pt: 'Organizando Dados' },
    subtitle: { en: 'lists · dictionaries · tuples · sets · when to use each', pt: 'listas · dicionários · tuplas · sets · quando usar cada' },
    color: '#3a001a', textColor: '#f9a8d4', duration: 20,
    outcome: {
      en: 'You can look at any JSON or API response and immediately understand the data structure.',
      pt: 'Você consegue olhar para qualquer JSON ou resposta de API e entender imediatamente a estrutura de dados.'
    },
    blocks: [
      { type: 'heading', content: { en: 'Lists — ordered collections', pt: 'Listas — coleções ordenadas' } },
      { type: 'code', code: `# Create and access
fruits = ["apple", "banana", "cherry"]
print(fruits[0])    # apple (first)
print(fruits[-1])   # cherry (last)

# Modify
fruits.append("mango")        # add to end
fruits.insert(0, "kiwi")      # add at position
fruits.remove("banana")       # remove by value

# Loop
for fruit in fruits:
    print(fruit)

# Useful functions
print(len(fruits))            # count
print("apple" in fruits)      # check membership
print(sorted(fruits))         # alphabetical copy` },
      { type: 'heading', content: { en: 'Dictionaries — labeled data', pt: 'Dicionários — dados com rótulos' } },
      { type: 'text', content: { en: 'Dictionaries store <strong>key: value</strong> pairs. Instead of remembering index numbers, you use meaningful labels. This is how most real-world data (JSON, databases, APIs) is structured.', pt: 'Dicionários armazenam pares <strong>chave: valor</strong>. Em vez de lembrar números de índice, você usa rótulos significativos. É assim que a maioria dos dados do mundo real (JSON, bancos, APIs) é estruturada.' } },
      { type: 'code', code: `person = {
    "name": "Alex",
    "age": 28,
    "city": "Toronto",
    "skills": ["Python", "Construction"]
}

print(person["name"])              # Alex
print(person.get("email", "N/A"))  # N/A (default)

person["email"] = "r@email.com"    # add new key
person["age"] = 33                 # update value

# Loop
for key, value in person.items():
    print(f"{key}: {value}")` },
      { type: 'heading', content: { en: 'Quick guide: which one to use?', pt: 'Guia rápido: qual usar?' } },
      { type: 'code', code: `# LIST — ordered items, index-based
scores = [92, 85, 78, 95]

# DICT — labeled data, key-based
user = {"name": "Alice", "age": 25}

# TUPLE — fixed data, won't change
coordinates = (43.6532, -79.3832)   # Toronto

# SET — unique values only
tags = {"python", "code", "python"}  # {"python", "code"}` }
    ],
    exercise: {
      title: { en: 'Contact Lookup', pt: 'Busca de Contatos' },
      description: { en: 'Store 4 contacts in a dictionary (name → phone). Build a search: ask for name, show phone or "not found". Loop until user types "quit".', pt: 'Armazene 4 contatos em um dicionário (nome → telefone). Faça busca: pergunte nome, mostre telefone ou "not found". Loop até usuário digitar "quit".' },
      starterCode: `contacts = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Carol": "555-9012",
    "David": "555-3456"
}

while True:
    name = input("\\nSearch contact (or 'quit'): ")
    if name.lower() == "quit":
        break
    
    # Search for the contact
    if name in contacts:
        print(f"Phone: {contacts[name]}")
    else:
        print(f"'{name}' not found")`,
      solution: `contacts = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Carol": "555-9012",
    "David": "555-3456"
}

while True:
    name = input("\\nSearch contact (or 'quit'): ")
    if name.lower() == "quit":
        break
    
    if name in contacts:
        print(f"Phone: {contacts[name]}")
    else:
        print(f"'{name}' not found in contacts")
        similar = [k for k in contacts if name.lower() in k.lower()]
        if similar:
            print(f"Did you mean: {', '.join(similar)}?")`
    }
  },
  {
    id: 6,
    title: { en: 'Real World Python', pt: 'Python no Mundo Real' },
    subtitle: { en: 'files · JSON · imports · libraries · how systems talk', pt: 'arquivos · JSON · imports · bibliotecas · como sistemas se comunicam' },
    color: '#003a2a', textColor: '#6ee7b7', duration: 20,
    outcome: {
      en: 'You understand how Python talks to files, APIs and other systems — the foundation of every real application.',
      pt: 'Você entende como Python se comunica com arquivos, APIs e outros sistemas — a base de toda aplicação real.'
    },
    blocks: [
      { type: 'heading', content: { en: 'Reading and writing files', pt: 'Lendo e escrevendo arquivos' } },
      { type: 'code', code: `# Write to a file
with open("notes.txt", "w") as f:
    f.write("First note\\n")
    f.write("Second note\\n")

# Read from a file
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)

# Append without overwriting
with open("notes.txt", "a") as f:
    f.write("Third note\\n")

# Read line by line
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())` },
      { type: 'heading', content: { en: 'JSON — how systems share data', pt: 'JSON — como sistemas compartilham dados' } },
      { type: 'text', content: { en: 'JSON is the universal language of the internet. APIs, databases, config files — everything uses JSON. It looks exactly like Python dictionaries, which makes it easy to work with.', pt: 'JSON é a linguagem universal da internet. APIs, bancos de dados, arquivos de configuração — tudo usa JSON. Parece exatamente com dicionários Python, o que facilita muito.' } },
      { type: 'code', code: `import json

# Python dict → JSON string
data = {"name": "Alice", "age": 25, "scores": [90, 85, 92]}
json_string = json.dumps(data, indent=2)
print(json_string)

# JSON string → Python dict
received = '{"city": "Toronto", "temp": 22}'
parsed = json.loads(received)
print(parsed["city"])   # Toronto
print(parsed["temp"])   # 22

# Save to file / read from file
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

with open("data.json", "r") as f:
    loaded = json.load(f)` },
      { type: 'heading', content: { en: 'Importing libraries', pt: 'Importando bibliotecas' } },
      { type: 'code', code: `# Built-in libraries (no install needed)
import math
import random
import datetime

print(math.sqrt(144))       # 12.0
print(math.pi)              # 3.14159...
print(random.randint(1, 6)) # dice roll
print(datetime.date.today())

# External libraries (install with pip)
# pip install requests
# import requests
# response = requests.get("https://api.github.com")
# data = response.json()` },
      { type: 'tip', content: { en: 'When you see code like <code>import something</code> or <code>from x import y</code>, that\'s pulling in a library. Python has thousands of libraries that do almost anything you need.', pt: 'Quando você vê código como <code>import something</code> ou <code>from x import y</code>, está puxando uma biblioteca. Python tem milhares de bibliotecas que fazem quase qualquer coisa que você precisar.' } }
    ],
    exercise: {
      title: { en: 'JSON Data Reader', pt: 'Leitor de Dados JSON' },
      description: { en: 'Parse a JSON string with student data, calculate the class average, find the top student, and save a summary to a file.', pt: 'Analise uma string JSON com dados de alunos, calcule a média da turma, encontre o melhor aluno e salve um resumo em arquivo.' },
      starterCode: `import json

# Simulating data received from an API
api_response = """
{
  "class": "Python 101",
  "students": [
    {"name": "Alice", "grade": 92},
    {"name": "Bob", "grade": 78},
    {"name": "Carol", "grade": 95},
    {"name": "David", "grade": 85}
  ]
}
"""

data = json.loads(api_response)
students = data["students"]

# Calculate average
total = sum(s["grade"] for s in students)
average = total / len(students)

# Find top student
top = max(students, key=lambda s: s["grade"])

print(f"Class: {data['class']}")
print(f"Average: {average:.1f}")
print(f"Top student: {top['name']} ({top['grade']})")

# Save summary to file
summary = {"average": average, "top_student": top["name"]}
with open("summary.json", "w") as f:
    json.dump(summary, f, indent=2)
print("Saved to summary.json")`,
      solution: `import json

api_response = """
{
  "class": "Python 101",
  "students": [
    {"name": "Alice", "grade": 92},
    {"name": "Bob", "grade": 78},
    {"name": "Carol", "grade": 95},
    {"name": "David", "grade": 85}
  ]
}
"""

data = json.loads(api_response)
students = data["students"]
total = sum(s["grade"] for s in students)
average = total / len(students)
top = max(students, key=lambda s: s["grade"])

print(f"Class: {data['class']}")
print(f"Students: {len(students)}")
print(f"Average: {average:.1f}")
print(f"Top student: {top['name']} ({top['grade']})")

with open("summary.json", "w") as f:
    json.dump({"average": average, "top_student": top["name"]}, f, indent=2)
print("Saved to summary.json")`
    }
  },
  {
    id: 7,
    title: { en: 'Putting It All Together', pt: 'Juntando Tudo' },
    subtitle: { en: 'Final mini-project using days 1–6', pt: 'Mini-projeto final usando os dias 1–6' },
    color: '#5b21b6', textColor: '#ffffff', duration: 20,
    outcome: {
      en: 'You have a working Python program you built yourself. You can walk into any meeting about Python and follow — and contribute.',
      pt: 'Você tem um programa Python funcionando que construiu. Você consegue entrar em qualquer reunião sobre Python e acompanhar — e contribuir.'
    },
    blocks: [
      { type: 'heading', content: { en: 'Quick recap — what you learned', pt: 'Revisão rápida — o que você aprendeu' } },
      { type: 'code', code: `# Day 1: Variables and f-strings
name = "Alex"
print(f"Hello, {name}!")

# Day 2: Conditionals
if name == "Alex":
    print("Welcome back!")

# Day 3: Loops
for i in range(3):
    print(f"Loop {i}")

# Day 4: Functions
def greet(person):
    return f"Hi, {person}!"

# Day 5: Data structures
contacts = {"Alice": "555-1234"}

# Day 6: Files and JSON
import json
data = json.loads('{"score": 95}')` },
      { type: 'heading', content: { en: 'How it all connects', pt: 'Como tudo se conecta' } },
      { type: 'text', content: { en: 'Every real Python program combines all of these: functions organize the code, dictionaries and lists store the data, loops process it, conditionals make decisions, and files save the results.', pt: 'Todo programa Python real combina todos esses elementos: funções organizam o código, dicionários e listas armazenam os dados, loops os processam, condicionais tomam decisões e arquivos salvam os resultados.' } },
      { type: 'heading', content: { en: 'Your final project: Student Grade Manager', pt: 'Seu projeto final: Gerenciador de Notas' } },
      { type: 'text', content: { en: 'Build a complete program that: uses a loop to add multiple students, stores data in a dictionary, calculates statistics with functions, applies conditionals for pass/fail, and saves a report to a file. This uses everything from days 1-6.', pt: 'Construa um programa completo que: usa loop para adicionar vários alunos, armazena dados em dicionário, calcula estatísticas com funções, aplica condicionais para aprovação, e salva relatório em arquivo. Usa tudo dos dias 1-6.' } }
    ],
    exercise: {
      title: { en: 'Student Grade Manager', pt: 'Gerenciador de Notas de Alunos' },
      description: { en: 'Full program: add students in a loop, store in dict, calculate average, find best student, print report, save to file. Uses EVERYTHING from days 1-6.', pt: 'Programa completo: adicionar alunos em loop, armazenar em dict, calcular média, encontrar melhor aluno, imprimir relatório, salvar em arquivo. Usa TUDO dos dias 1-6.' },
      starterCode: `# FINAL PROJECT: Student Grade Manager
# This uses EVERYTHING you learned this week!

students = {}  # {name: grade}

# 1. Add students (loop + input + dict)
print("=== Student Grade Manager ===")
while True:
    name = input("Student name (or 'done'): ")
    if name.lower() == "done":
        break
    grade = float(input(f"Grade for {name}: "))
    students[name] = grade

if not students:
    print("No students entered!")
else:
    # 2. Calculate stats (functions + math)
    average = sum(students.values()) / len(students)
    best = max(students, key=students.get)
    
    # 3. Print report (f-strings + conditionals)
    print("\\n=== CLASS REPORT ===")
    for name, grade in students.items():
        status = "PASS" if grade >= 60 else "FAIL"
        print(f"{name}: {grade} — {status}")
    
    print(f"\\nClass average: {average:.1f}")
    print(f"Top student: {best} ({students[best]})")
    
    # 4. Save to file (files + f-strings)
    with open("grades.txt", "w") as f:
        f.write("CLASS REPORT\\n")
        f.write(f"Average: {average:.1f}\\n")
        for name, grade in students.items():
            f.write(f"{name}: {grade}\\n")
    print("\\nSaved to grades.txt!")`,
      solution: `students = {}

print("=== Student Grade Manager ===")
while True:
    name = input("Student name (or 'done'): ")
    if name.lower() == "done":
        break
    grade = float(input(f"Grade for {name}: "))
    students[name] = grade

if not students:
    print("No students entered!")
else:
    average = sum(students.values()) / len(students)
    best = max(students, key=students.get)
    worst = min(students, key=students.get)
    passed = [n for n, g in students.items() if g >= 60]
    
    print("\\n=== CLASS REPORT ===")
    for name, grade in sorted(students.items(), key=lambda x: x[1], reverse=True):
        status = "✅ PASS" if grade >= 60 else "❌ FAIL"
        print(f"{name}: {grade:.1f} — {status}")
    
    print(f"\\nClass average: {average:.1f}")
    print(f"Top student: {best} ({students[best]:.1f})")
    print(f"Passed: {len(passed)}/{len(students)} students")
    
    with open("grades.txt", "w") as f:
        f.write("CLASS REPORT\\n")
        f.write(f"Average: {average:.1f}\\n")
        for n, g in students.items():
            f.write(f"{n}: {g}\\n")
    print("\\nSaved to grades.txt! ✅")`
    }
  }
]
