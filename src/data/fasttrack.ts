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
    steps: Array<{ en: string; pt: string }>
    starterCode: string
    solution: string
    inputHint?: string
  }
}

export const FASTTRACK_DAYS: FTDay[] = [

// ════════════════════════════════════════════════════════
// DAY 1 — Variables, types, print, input, f-strings
// ════════════════════════════════════════════════════════
{
  id: 1,
  title: { en: 'Your First Python Program', pt: 'Seu Primeiro Programa Python' },
  subtitle: { en: 'Variables · types · print() · input() · f-strings', pt: 'Variáveis · tipos · print() · input() · f-strings' },
  color: '#1a1030', textColor: '#c4b5fd', duration: 20,
  outcome: {
    en: 'You can write a program that asks for information, stores it, does a calculation, and shows a result. You understand what every line does.',
    pt: 'Você consegue escrever um programa que pede informação, armazena, faz cálculo e mostra resultado. Você entende o que cada linha faz.'
  },
  blocks: [
    { type: 'heading', content: { en: 'What is a program?', pt: 'O que é um programa?' } },
    { type: 'text', content: {
      en: 'A program is a list of instructions you give to the computer. The computer reads them <strong>one line at a time, from top to bottom</strong>, and executes each one exactly as written. If you make a typo, it stops and tells you. If you write it right, it runs perfectly every time — even a million times in a row.',
      pt: 'Um programa é uma lista de instruções que você dá ao computador. O computador as lê <strong>uma linha de cada vez, de cima para baixo</strong>, e executa cada uma exatamente como escrita. Se você errar a digitação, ele para e avisa. Se você escrever certo, roda perfeitamente toda vez — mesmo um milhão de vezes seguidas.'
    }},
    { type: 'tip', content: {
      en: 'Python is used by NASA, Netflix, Instagram, Google and thousands of companies. The reason: it reads almost like English, which makes it easier to write, read and fix.',
      pt: 'Python é usado pela NASA, Netflix, Instagram, Google e milhares de empresas. O motivo: parece quase inglês, o que o torna mais fácil de escrever, ler e corrigir.'
    }},
    { type: 'heading', content: { en: 'Variables — boxes with names', pt: 'Variáveis — caixas com nomes' } },
    { type: 'text', content: {
      en: 'Imagine a shelf of labeled boxes. You can put a value inside a box and use that label to get it back later. In Python, these boxes are called <strong>variables</strong>. You create one with a single <code>=</code> sign. Read it as <em>"receives"</em>, not "equals".',
      pt: 'Imagine uma prateleira de caixas com etiquetas. Você coloca um valor dentro de uma caixa e usa a etiqueta para buscá-lo depois. Em Python, essas caixas se chamam <strong>variáveis</strong>. Você cria uma com um único sinal <code>=</code>. Leia como <em>"recebe"</em>, não "é igual".'
    }},
    { type: 'code', code:
`# Lines starting with # are COMMENTS — Python ignores them
# They are notes for YOU to explain what the code does

name = "Alex"     # The box called 'name' receives the value "Alex"
age = 28          # The box called 'age' receives the number 28
height = 1.75     # Decimal numbers use a DOT, never a comma
active = True     # True or False (always capital T or F)

# Now READ the values back
print(name)       # Python looks inside the 'name' box → shows: Alex
print(age)        # Looks inside 'age' → shows: 28
print(active)     # Looks inside 'active' → shows: True`
    },
    { type: 'text', content: {
      en: 'Did you notice the difference? <code>"Alex"</code> has quotes — that means it\'s <strong>text</strong>. <code>28</code> has no quotes — that means it\'s a <strong>number</strong>. This matters a lot: you can do math with <code>28</code>, but not with <code>"28"</code>.',
      pt: 'Percebeu a diferença? <code>"Alex"</code> tem aspas — significa que é <strong>texto</strong>. <code>28</code> não tem aspas — significa que é <strong>número</strong>. Isso importa muito: você pode fazer contas com <code>28</code>, mas não com <code>"28"</code>.'
    }},
    { type: 'heading', content: { en: 'The 4 types of values in Python', pt: 'Os 4 tipos de valores em Python' } },
    { type: 'code', code:
`# TYPE 1: str (string) — text, always between quotes
city = "Toronto"
message = 'Hello!'         # single or double quotes, both work

# TYPE 2: int (integer) — whole numbers, no decimal point
year = 2024
score = 100
temperature = -5           # negative numbers work fine

# TYPE 3: float (floating point) — numbers WITH decimal
price = 9.99
pi = 3.14159

# TYPE 4: bool (boolean) — only two possible values
is_logged_in = True
has_error = False

# Python can tell you the type of any variable
print(type(city))          # <class 'str'>
print(type(year))          # <class 'int'>
print(type(price))         # <class 'float'>
print(type(is_logged_in))  # <class 'bool'>`
    },
    { type: 'heading', content: { en: 'print() — showing things on screen', pt: 'print() — mostrando coisas na tela' } },
    { type: 'text', content: {
      en: '<code>print()</code> is a command (called a <strong>function</strong>) that displays whatever you put inside its parentheses. You can print text, numbers, variables, or a mix. The <strong>f-string</strong> is the cleanest way to mix text with variables — put <code>f</code> before the quote and <code>{variable}</code> wherever you want its value.',
      pt: '<code>print()</code> é um comando (chamado <strong>função</strong>) que mostra na tela o que você colocar dentro dos seus parênteses. Você pode imprimir texto, números, variáveis ou uma mistura. A <strong>f-string</strong> é a forma mais limpa de misturar texto com variáveis — coloque <code>f</code> antes das aspas e <code>{variavel}</code> onde quiser o valor.'
    }},
    { type: 'code', code:
`name = "Alex"
age = 28
city = "Toronto"

# Basic: separate with commas (adds spaces between)
print("Name:", name, "Age:", age)
# Output: Name: Alex Age: 28

# F-string: put f before the quote, {variable} inside
print(f"Hello, {name}!")
# Output: Hello, Alex!

print(f"{name} is {age} years old and lives in {city}.")
# Output: Alex is 28 years old and lives in Toronto.

# You can do MATH inside the curly braces
print(f"In 5 years, {name} will be {age + 5}.")
# Output: In 5 years, Alex will be 33.

# Format numbers
price = 9.99
print(f"Total: \${price:.2f}")   # .2f = 2 decimal places
# Output: Total: $9.99`
    },
    { type: 'heading', content: { en: 'input() — asking the user to type', pt: 'input() — pedindo ao usuário que digite' } },
    { type: 'text', content: {
      en: '<code>input()</code> pauses the program and waits for the user to type something and press Enter. The text they type becomes the value stored in your variable. <strong>Critical rule:</strong> input() always returns TEXT (str), even if the user types a number. If you need to do math with it, convert with <code>int()</code> or <code>float()</code>.',
      pt: '<code>input()</code> pausa o programa e aguarda o usuário digitar algo e pressionar Enter. O texto digitado se torna o valor armazenado na variável. <strong>Regra crítica:</strong> input() sempre retorna TEXTO (str), mesmo que o usuário digite um número. Se precisar fazer contas, converta com <code>int()</code> ou <code>float()</code>.'
    }},
    { type: 'code', code:
`# input() always returns str (text)
name = input("What is your name? ")
# → User types: Alex
# → name is now "Alex"

# To store as a NUMBER, wrap with int()
birth_year = int(input("What year were you born? "))
# → User types: 1996
# → Without int(): birth_year would be "1996" (text, can't do math)
# → With int():    birth_year is 1996 (number, can do math!)

# Now we can calculate
age = 2024 - birth_year    # math works because birth_year is int

# Show the result using f-string
print(f"Hello, {name}! You are approximately {age} years old.")`
    },
    { type: 'warning', content: {
      en: '<strong>The most common beginner mistake:</strong> trying to do math with input() without converting. <code>2024 - input("Year: ")</code> crashes with TypeError. Always ask yourself: "Is this a number I will use in math?" If yes → <code>int(input(...))</code>.',
      pt: '<strong>O erro mais comum de iniciante:</strong> tentar fazer contas com input() sem converter. <code>2024 - input("Ano: ")</code> trava com TypeError. Sempre se pergunte: "Esse é um número que vou usar em contas?" Se sim → <code>int(input(...))</code>.'
    }}
  ],
  exercise: {
    title: { en: 'Personal Profile Card', pt: 'Cartão de Perfil Pessoal' },
    description: {
      en: 'Build a program that asks for a person\'s first name, last name, and birth year. Calculate their age. Print a formatted profile card.',
      pt: 'Construa um programa que pede o primeiro nome, sobrenome e ano de nascimento de uma pessoa. Calcule a idade. Imprima um cartão de perfil formatado.'
    },
    steps: [
      {
        en: '🤔 Think first: what information does this program need to collect? Write it down before touching the keyboard. (Answer: first name, last name, birth year)',
        pt: '🤔 Pense primeiro: que informações esse programa precisa coletar? Escreva antes de tocar no teclado. (Resposta: primeiro nome, sobrenome, ano de nascimento)'
      },
      {
        en: '📥 Step 1 — Ask for the first name. Use input() with a clear prompt. Example: input("First name: "). Store the result in a variable called first_name.',
        pt: '📥 Passo 1 — Pergunte o primeiro nome. Use input() com um prompt claro. Exemplo: input("Primeiro nome: "). Guarde o resultado em uma variável chamada first_name.'
      },
      {
        en: '📥 Step 2 — Ask for the last name the same way. Then ask for birth year — but this one will be used in a subtraction, so you need int(input(...)).',
        pt: '📥 Passo 2 — Pergunte o sobrenome da mesma forma. Depois pergunte o ano de nascimento — mas esse será usado em subtração, então precisa de int(input(...)).'
      },
      {
        en: '🔢 Step 3 — Calculate the age. Age = 2024 minus birth year. Store in a variable called age.',
        pt: '🔢 Passo 3 — Calcule a idade. Idade = 2024 menos o ano de nascimento. Guarde em uma variável chamada age.'
      },
      {
        en: '🖨️ Step 4 — Print the profile card. Use f-strings. Include: full name (first + last), age, and a nice header like "=== PROFILE CARD ===".',
        pt: '🖨️ Passo 4 — Imprima o cartão. Use f-strings. Inclua: nome completo (primeiro + último), idade, e um cabeçalho como "=== CARTÃO DE PERFIL ===".'
      }
    ],
    starterCode:
`# Step 1: Ask for first name
first_name = 

# Step 2: Ask for last name and birth year
last_name = 
birth_year = 

# Step 3: Calculate age
age = 

# Step 4: Print the profile card
print("=== PROFILE CARD ===")
print(f"Name: ")
print(f"Age: ")
print("====================")`,
    solution:
`first_name = input("First name: ")
last_name = input("Last name: ")
birth_year = int(input("Birth year: "))

age = 2024 - birth_year

print("=== PROFILE CARD ===")
print(f"Name: {first_name} {last_name}")
print(f"Age: {age} years old")
print("====================")`,
    inputHint: 'Alex\nSmith\n1996'
  }
},

// ════════════════════════════════════════════════════════
// DAY 2 — Conditionals
// ════════════════════════════════════════════════════════
{
  id: 2,
  title: { en: 'Making Decisions', pt: 'Tomando Decisões' },
  subtitle: { en: 'if · elif · else · comparisons · and · or', pt: 'if · elif · else · comparações · and · or' },
  color: '#0f1f1a', textColor: '#6ee7b7', duration: 20,
  outcome: {
    en: 'You can make your programs react differently based on conditions. You understand how computers make decisions.',
    pt: 'Você consegue fazer seus programas reagirem diferente com base em condições. Você entende como computadores tomam decisões.'
  },
  blocks: [
    { type: 'heading', content: { en: 'How computers make decisions', pt: 'Como computadores tomam decisões' } },
    { type: 'text', content: {
      en: 'Until now, your programs ran the same way every time. But real programs need to react to different situations: "if the user is an admin, show the dashboard; otherwise, show an error." This is done with <strong>conditionals</strong> — code that only runs when a condition is true.',
      pt: 'Até agora, seus programas rodavam da mesma forma toda vez. Mas programas reais precisam reagir a situações diferentes: "se o usuário for admin, mostre o painel; caso contrário, mostre erro." Isso é feito com <strong>condicionais</strong> — código que só roda quando uma condição é verdadeira.'
    }},
    { type: 'heading', content: { en: 'if / elif / else — the decision structure', pt: 'if / elif / else — a estrutura de decisão' } },
    { type: 'text', content: {
      en: 'The structure works like this: Python checks the <code>if</code> condition. If it\'s True, it runs that block and skips the rest. If it\'s False, it tries <code>elif</code> (else if). If nothing matched, it runs <code>else</code>. <strong>Only one block ever runs.</strong>',
      pt: 'A estrutura funciona assim: Python verifica a condição do <code>if</code>. Se for True, executa aquele bloco e pula o resto. Se for False, tenta o <code>elif</code> (else if). Se nada correspondeu, executa o <code>else</code>. <strong>Apenas um bloco é executado.</strong>'
    }},
    { type: 'code', code:
`score = int(input("Enter your score (0-100): "))

# Python checks conditions from top to bottom
# and STOPS at the first one that is True

if score >= 90:           # Is score 90 or more?
    print("Grade: A")     # This runs ONLY if the condition above is True
    print("Excellent!")   # All indented lines belong to the same block

elif score >= 80:         # Only checked if the first condition was False
    print("Grade: B")
    print("Great job!")

elif score >= 70:         # Only checked if the two above were False
    print("Grade: C")
    print("Good work!")

elif score >= 60:
    print("Grade: D")
    print("Just passed.")

else:                     # Runs if ALL conditions above were False
    print("Grade: F")
    print("Please study more.")`
    },
    { type: 'warning', content: {
      en: '<strong>Indentation is not optional in Python.</strong> The 4 spaces before <code>print()</code> tell Python "this line belongs inside the if block." If you forget the indentation, Python gives an IndentationError. Use the ⇥ Tab button.',
      pt: '<strong>Indentação não é opcional em Python.</strong> Os 4 espaços antes do <code>print()</code> dizem ao Python "essa linha pertence ao bloco if." Se você esquecer a indentação, Python dá IndentationError. Use o botão ⇥ Tab.'
    }},
    { type: 'heading', content: { en: 'Comparison operators — how to ask questions', pt: 'Operadores de comparação — como fazer perguntas' } },
    { type: 'code', code:
`x = 10

# Each of these produces True or False
print(x == 10)    # True  — is x EQUAL TO 10? (double == for comparison)
print(x != 10)    # False — is x NOT EQUAL TO 10?
print(x > 5)      # True  — is x GREATER THAN 5?
print(x < 5)      # False — is x LESS THAN 5?
print(x >= 10)    # True  — is x GREATER THAN OR EQUAL TO 10?
print(x <= 9)     # False — is x LESS THAN OR EQUAL TO 9?

# THE MOST IMPORTANT RULE IN PYTHON:
# = means ASSIGN (put a value in a box)
# == means COMPARE (ask "are these equal?")

x = 10    # ← CORRECT: assign 10 to x
if x == 10:   # ← CORRECT: compare x with 10
    print("x is ten")

# if x = 10:  ← WRONG: this is a syntax error!`
    },
    { type: 'heading', content: { en: 'and / or / not — combining conditions', pt: 'and / or / not — combinando condições' } },
    { type: 'code', code:
`age = 25
has_id = True
day = "Saturday"

# AND: BOTH conditions must be True
if age >= 18 and has_id:
    print("Welcome to the venue!")
    # Only runs if age is 18+ AND has_id is True
    # If either is False → doesn't run

# OR: AT LEAST ONE condition must be True
if day == "Saturday" or day == "Sunday":
    print("It's the weekend!")
    # Runs if day is Saturday OR if day is Sunday (or both)

# NOT: reverses True to False and False to True
if not has_id:
    print("Sorry, no ID no entry")
    # This only runs if has_id is False

# Combining multiple conditions
temperature = 22
is_raining = False

if temperature > 20 and not is_raining:
    print("Perfect weather for a walk!")`
    },
    { type: 'tip', content: {
      en: 'When combining conditions, Python evaluates <code>not</code> first, then <code>and</code>, then <code>or</code>. When in doubt, use parentheses: <code>(age >= 18 and has_id) or is_vip</code>.',
      pt: 'Ao combinar condições, Python avalia <code>not</code> primeiro, depois <code>and</code>, depois <code>or</code>. Na dúvida, use parênteses: <code>(age >= 18 and has_id) or is_vip</code>.'
    }},
    { type: 'heading', content: { en: 'Conditionals with strings', pt: 'Condicionais com strings' } },
    { type: 'code', code:
`answer = input("Do you want to continue? (yes/no): ")

# .lower() converts to lowercase so "YES", "Yes", "yes" all match
if answer.lower() == "yes":
    print("Great, continuing!")
elif answer.lower() == "no":
    print("Okay, stopping.")
else:
    print(f"I don't understand '{answer}'. Please type yes or no.")

# Check if something is IN a collection
fruit = input("Enter a fruit: ")
if fruit in ["apple", "banana", "cherry"]:
    print(f"Yes, {fruit} is in our list!")
else:
    print(f"{fruit} is not in our list.")`
    }
  ],
  exercise: {
    title: { en: 'Grade Classifier', pt: 'Classificador de Notas' },
    description: {
      en: 'Ask for a score (0-100). Determine the letter grade AND a personalized message. Also say PASS or FAIL (passing is 60+).',
      pt: 'Pergunte uma nota (0-100). Determine o conceito E uma mensagem personalizada. Também diga APROVADO ou REPROVADO (aprovação é 60+).'
    },
    steps: [
      {
        en: '🤔 Think first: this program receives ONE number (the score) and needs to produce TWO things: a letter grade and a status. Before coding, list the grade ranges: A=90+, B=80-89, C=70-79, D=60-69, F=below 60.',
        pt: '🤔 Pense primeiro: esse programa recebe UM número (a nota) e precisa produzir DUAS coisas: um conceito e um status. Antes de codificar, liste os intervalos: A=90+, B=80-89, C=70-79, D=60-69, F=abaixo de 60.'
      },
      {
        en: '📥 Step 1 — Ask for the score. It will be used in comparisons (>=), so you need int(input(...)). Store it in a variable called score.',
        pt: '📥 Passo 1 — Peça a nota. Ela será usada em comparações (>=), então precisa de int(input(...)). Guarde em uma variável chamada score.'
      },
      {
        en: '🔀 Step 2 — Write the if/elif/else chain. ALWAYS check the HIGHEST value first (>= 90), then work downward. Why? Because if score is 95, it passes ALL checks below 90 too — checking highest first stops it at the right one.',
        pt: '🔀 Passo 2 — Escreva a cadeia if/elif/else. SEMPRE verifique o valor MAIS ALTO primeiro (>= 90), depois vá descendo. Por quê? Porque se a nota é 95, ela passa TODAS as verificações abaixo de 90 também — verificar o mais alto primeiro para no lugar certo.'
      },
      {
        en: '📋 Step 3 — Inside EACH if/elif block, set TWO variables: grade (the letter) and message (a personalized comment). Then AFTER the entire chain, print them with an f-string.',
        pt: '📋 Passo 3 — Dentro de CADA bloco if/elif, defina DUAS variáveis: grade (a letra) e message (um comentário personalizado). Depois de toda a cadeia, imprima-as com f-string.'
      },
      {
        en: '✅ Step 4 — Add a separate if/else at the END (outside the grade chain) to print PASS (score >= 60) or FAIL. This is a separate decision from the grade.',
        pt: '✅ Passo 4 — Adicione um if/else separado no FINAL (fora da cadeia de conceitos) para imprimir APROVADO (nota >= 60) ou REPROVADO. Essa é uma decisão separada do conceito.'
      }
    ],
    starterCode:
`score = int(input("Enter your score (0-100): "))

# Check grades from highest to lowest
if score >= 90:
    grade = "A"
    message = "Outstanding work!"
elif score >= 80:
    grade = 
    message = 
elif score >= 70:
    grade = 
    message = 
elif score >= 60:
    grade = 
    message = 
else:
    grade = 
    message = 

# Print the grade and message
print(f"Grade: {grade}")
print(message)

# Separate pass/fail check
if score >= 60:
    print("Result: PASS")
else:
    print("Result: FAIL")`,
    solution:
`score = int(input("Enter your score (0-100): "))

if score >= 90:
    grade = "A"
    message = "Outstanding work! You nailed it."
elif score >= 80:
    grade = "B"
    message = "Great job! Above average."
elif score >= 70:
    grade = "C"
    message = "Good work. Room to improve."
elif score >= 60:
    grade = "D"
    message = "You passed, but study harder next time."
else:
    grade = "F"
    message = "Don't give up — review the material and try again."

print(f"Score: {score}/100")
print(f"Grade: {grade}")
print(message)

if score >= 60:
    print("Result: PASS ✓")
else:
    print("Result: FAIL ✗")`,
    inputHint: '85'
  }
},

// ════════════════════════════════════════════════════════
// DAY 3 — Loops
// ════════════════════════════════════════════════════════
{
  id: 3,
  title: { en: 'Repetition & Automation', pt: 'Repetição e Automação' },
  subtitle: { en: 'for · while · range() · break · continue', pt: 'for · while · range() · break · continue' },
  color: '#0f1525', textColor: '#7dd3fc', duration: 20,
  outcome: {
    en: 'You understand why loops are Python\'s superpower for automation. You can repeat actions without copying code.',
    pt: 'Você entende por que loops são o superpoder do Python para automação. Você consegue repetir ações sem copiar código.'
  },
  blocks: [
    { type: 'heading', content: { en: 'Why loops exist', pt: 'Por que loops existem' } },
    { type: 'text', content: {
      en: 'Without loops, to print "Hello" 100 times you would write 100 print() lines. With a loop, you write it once and tell Python how many times to repeat it. This is the foundation of automation — the computer does the repetitive work.',
      pt: 'Sem loops, para imprimir "Olá" 100 vezes você escreveria 100 linhas de print(). Com um loop, você escreve uma vez e diz ao Python quantas vezes repetir. Essa é a base da automação — o computador faz o trabalho repetitivo.'
    }},
    { type: 'heading', content: { en: 'The for loop — repeat for each item', pt: 'O loop for — repetir para cada item' } },
    { type: 'text', content: {
      en: 'A <code>for</code> loop repeats a block of code <strong>once for each item in a sequence</strong>. The most common sequence is <code>range()</code>, which generates numbers. The variable <code>i</code> (or any name you choose) holds the current item each iteration.',
      pt: 'Um loop <code>for</code> repete um bloco de código <strong>uma vez para cada item em uma sequência</strong>. A sequência mais comum é <code>range()</code>, que gera números. A variável <code>i</code> (ou qualquer nome que você escolher) guarda o item atual a cada iteração.'
    }},
    { type: 'code', code:
`# range(5) generates: 0, 1, 2, 3, 4
# It starts at 0 and STOPS BEFORE 5 (not including 5)
for i in range(5):
    print(i)         # Runs 5 times, i is 0, then 1, then 2, then 3, then 4
# Output: 0  1  2  3  4

# range(start, stop) — start included, stop NOT included
for i in range(1, 6):
    print(i)         # i goes: 1, 2, 3, 4, 5
# Output: 1  2  3  4  5

# range(start, stop, step) — step controls how much to add each time
for i in range(0, 10, 2):
    print(i)         # i goes: 0, 2, 4, 6, 8
# Output: 0  2  4  6  8

# Loop over a list of items directly
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:              # fruit takes each value in the list
    print(f"I like {fruit}")
# Output: I like apple
#         I like banana
#         I like cherry`
    },
    { type: 'heading', content: { en: 'The while loop — repeat until something changes', pt: 'O loop while — repetir até algo mudar' } },
    { type: 'text', content: {
      en: 'A <code>while</code> loop keeps running as long as its condition is <code>True</code>. Use it when you don\'t know in advance how many times to repeat — for example, keep asking until the user gives a valid answer. <strong>Always make sure the condition can become False</strong>, or the loop runs forever (infinite loop).',
      pt: 'Um loop <code>while</code> continua rodando enquanto sua condição for <code>True</code>. Use-o quando não sabe com antecedência quantas vezes repetir — por exemplo, continue perguntando até o usuário dar uma resposta válida. <strong>Sempre garanta que a condição pode se tornar False</strong>, ou o loop roda para sempre (loop infinito).'
    }},
    { type: 'code', code:
`# Count down from 5 to 1
count = 5                    # We START with count = 5
while count > 0:             # Keep looping WHILE count is greater than 0
    print(f"T-minus {count}")
    count = count - 1        # CRITICAL: without this, count stays 5 forever!
print("Liftoff! 🚀")
# Output: T-minus 5 → T-minus 4 → T-minus 3 → T-minus 2 → T-minus 1 → Liftoff!

# Keep asking until valid input
while True:                  # while True = loop forever (until we break)
    age = int(input("Enter your age: "))
    if age > 0 and age < 150:
        break                # break EXITS the loop immediately
    print("That doesn't look like a valid age. Try again.")

print(f"Got it! You are {age} years old.")`
    },
    { type: 'warning', content: {
      en: '<strong>Infinite loop danger:</strong> If your while condition never becomes False and you have no <code>break</code>, the program runs forever and freezes. Always ask yourself: "What makes this loop stop?"',
      pt: '<strong>Perigo de loop infinito:</strong> Se a condição do while nunca se torna False e não tem <code>break</code>, o programa roda para sempre e trava. Sempre se pergunte: "O que faz esse loop parar?"'
    }},
    { type: 'heading', content: { en: 'break and continue', pt: 'break e continue' } },
    { type: 'code', code:
`# break — EXIT the loop immediately, don't finish current iteration
for i in range(10):
    if i == 5:
        break            # Stop the loop entirely when i reaches 5
    print(i)             # Prints: 0 1 2 3 4 (never reaches 5)

# continue — SKIP the rest of this iteration, go to the next one
for i in range(10):
    if i % 2 == 0:       # i % 2 gives remainder of division by 2
        continue         # Skip even numbers
    print(i)             # Prints: 1 3 5 7 9 (only odd numbers)`
    },
    { type: 'tip', content: {
      en: '<strong>Which loop to use?</strong> Use <code>for</code> when you know how many times to loop (loop through a list, repeat N times). Use <code>while</code> when you loop until something happens (user gives valid input, condition changes).',
      pt: '<strong>Qual loop usar?</strong> Use <code>for</code> quando sabe quantas vezes iterar (percorrer uma lista, repetir N vezes). Use <code>while</code> quando itera até algo acontecer (usuário dá entrada válida, condição muda).'
    }}
  ],
  exercise: {
    title: { en: 'Times Table Generator', pt: 'Gerador de Tabuada' },
    description: {
      en: 'Ask the user for a number. Print its full times table from 1×1 to n×10. Then ask if they want another table and loop back.',
      pt: 'Pergunte ao usuário um número. Imprima a tabuada completa de 1×1 até n×10. Depois pergunte se quer outra tabuada e volte ao início.'
    },
    steps: [
      {
        en: '🤔 Think first: the outer structure is a while loop (keep going until user says "no"). Inside, we need a for loop to go from 1 to 10. Nested loops = a loop inside a loop.',
        pt: '🤔 Pense primeiro: a estrutura externa é um while loop (continua até usuário dizer "não"). Dentro, precisamos de um for loop de 1 a 10. Loops aninhados = um loop dentro de outro.'
      },
      {
        en: '🔁 Step 1 — Create the outer while True loop. This keeps asking for numbers indefinitely.',
        pt: '🔁 Passo 1 — Crie o loop while True externo. Isso continua pedindo números indefinidamente.'
      },
      {
        en: '📥 Step 2 — Inside the while loop, ask for the number with int(input(...)). Store in a variable called number.',
        pt: '📥 Passo 2 — Dentro do while loop, peça o número com int(input(...)). Guarde em uma variável chamada number.'
      },
      {
        en: '🔢 Step 3 — Print a header like "=== 5 Times Table ===". Then use a for loop with range(1, 11) — this gives 1 through 10. Inside, calculate result = number * i and print it.',
        pt: '🔢 Passo 3 — Imprima um cabeçalho como "=== Tabuada do 5 ===". Depois use for loop com range(1, 11) — isso dá de 1 a 10. Dentro, calcule result = number * i e imprima.'
      },
      {
        en: '🔚 Step 4 — After the for loop (but still inside the while), ask "Another table? (yes/no)". If the answer is NOT "yes", use break to exit the while loop.',
        pt: '🔚 Passo 4 — Após o for loop (mas ainda dentro do while), pergunte "Outra tabuada? (sim/não)". Se a resposta NÃO for "sim", use break para sair do while loop.'
      }
    ],
    starterCode:
`while True:
    number = int(input("\\nEnter a number for its times table: "))

    print(f"\\n=== {number} Times Table ===")
    for i in range(1, 11):
        result = 
        print(f"{number} x {i} = {result}")

    again = input("\\nAnother table? (yes/no): ")
    if again.lower() != "yes":
        break

print("Goodbye!")`,
    solution:
`while True:
    number = int(input("\\nEnter a number for its times table: "))

    print(f"\\n=== {number} Times Table ===")
    for i in range(1, 11):
        result = number * i
        print(f"{number} x {i:2} = {result}")

    again = input("\\nAnother table? (yes/no): ")
    if again.lower() != "yes":
        break

print("Goodbye! 👋")`,
    inputHint: '7\nno'
  }
},

// ════════════════════════════════════════════════════════
// DAY 4 — Functions
// ════════════════════════════════════════════════════════
{
  id: 4,
  title: { en: 'Functions — Reusable Code', pt: 'Funções — Código Reutilizável' },
  subtitle: { en: 'def · parameters · return · scope · default values', pt: 'def · parâmetros · return · escopo · valores padrão' },
  color: '#1a1200', textColor: '#e2c97e', duration: 20,
  outcome: {
    en: 'You understand why professional code uses functions and can break any problem into reusable pieces.',
    pt: 'Você entende por que código profissional usa funções e consegue dividir qualquer problema em partes reutilizáveis.'
  },
  blocks: [
    { type: 'heading', content: { en: 'Why functions?', pt: 'Por que funções?' } },
    { type: 'text', content: {
      en: 'Imagine you need to calculate tax in 5 different places in your program. Without functions, you copy-paste that calculation 5 times. When tax rates change, you have to fix 5 places and will probably miss one. With a function, you write it once and call it everywhere. Fix it once, fixed everywhere.',
      pt: 'Imagine que você precisa calcular imposto em 5 lugares diferentes no programa. Sem funções, você copia e cola esse cálculo 5 vezes. Quando a alíquota muda, você tem que corrigir 5 lugares e provavelmente vai perder um. Com uma função, você escreve uma vez e chama em qualquer lugar. Corrija uma vez, corrigido em todo lugar.'
    }},
    { type: 'heading', content: { en: 'Defining and calling a function', pt: 'Definindo e chamando uma função' } },
    { type: 'code', code:
`# DEFINE a function with the 'def' keyword
# Think of it as: "create a recipe called 'greet'"
def greet():               # 'greet' is the function name, () means no input needed
    print("Hello!")        # This code doesn't run yet — it's stored for later
    print("Welcome!")

# CALL the function — this is where the code actually runs
greet()                    # Output: Hello! / Welcome!
greet()                    # Call it again — same result
greet()                    # And again!

# The function runs each time you call it
# Write once, use many times`
    },
    { type: 'heading', content: { en: 'Parameters — giving information to a function', pt: 'Parâmetros — dando informações a uma função' } },
    { type: 'text', content: {
      en: '<strong>Parameters</strong> are variables that receive values when the function is called. They go inside the parentheses in the definition. When you call the function, the values you pass (called <strong>arguments</strong>) fill the parameters.',
      pt: '<strong>Parâmetros</strong> são variáveis que recebem valores quando a função é chamada. Eles ficam dentro dos parênteses na definição. Quando você chama a função, os valores que você passa (chamados <strong>argumentos</strong>) preenchem os parâmetros.'
    }},
    { type: 'code', code:
`# 'name' is a PARAMETER — a variable that gets its value at call time
def greet(name):
    print(f"Hello, {name}! Welcome to Python.")
    print(f"Great to have you here, {name}!")

greet("Alex")     # "Alex" is the ARGUMENT — it fills the 'name' parameter
greet("Maria")    # "Maria" fills 'name' this time
greet("Bob")      # "Bob" fills 'name' this time

# Multiple parameters — one value per parameter, in order
def introduce(first_name, last_name, age):
    print(f"My name is {first_name} {last_name} and I am {age} years old.")

introduce("Alex", "Smith", 28)
# Output: My name is Alex Smith and I am 28 years old.`
    },
    { type: 'heading', content: { en: 'return — getting a value back from a function', pt: 'return — obtendo um valor de volta da função' } },
    { type: 'text', content: {
      en: 'A function can <strong>calculate something and send the result back</strong> to wherever it was called. This is done with <code>return</code>. When Python hits <code>return</code>, it exits the function immediately and sends the value back. Functions without <code>return</code> are for doing things (printing); functions with <code>return</code> are for calculating things.',
      pt: 'Uma função pode <strong>calcular algo e enviar o resultado de volta</strong> para onde foi chamada. Isso é feito com <code>return</code>. Quando Python encontra <code>return</code>, sai da função imediatamente e devolve o valor. Funções sem <code>return</code> são para fazer coisas (imprimir); funções com <code>return</code> são para calcular coisas.'
    }},
    { type: 'code', code:
`# This function CALCULATES and RETURNS a value
def add(a, b):
    result = a + b
    return result       # Send the result back to whoever called the function

# The returned value can be stored in a variable
total = add(10, 5)      # add(10, 5) runs and returns 15, stored in 'total'
print(total)            # 15

# Or used directly
print(add(3, 4) * 2)   # add(3,4) returns 7, then 7 * 2 = 14

# Real example
def calculate_tax(price, rate=0.13):   # rate has a DEFAULT value of 0.13
    return price * rate

tax1 = calculate_tax(100)        # Uses default: 100 * 0.13 = 13.0
tax2 = calculate_tax(100, 0.05)  # Overrides default: 100 * 0.05 = 5.0

print(f"13% tax on $100: \${tax1:.2f}")
print(f"5% tax on $100: \${tax2:.2f}")`
    },
    { type: 'tip', content: {
      en: '<strong>The golden rule of functions:</strong> a good function does ONE thing and has a clear name describing what it does. If you struggle to name it, it probably does too many things — split it.',
      pt: '<strong>A regra de ouro das funções:</strong> uma boa função faz UMA coisa e tem um nome claro descrevendo o que faz. Se você tem dificuldade em nomeá-la, ela provavelmente faz coisas demais — divida-a.'
    }},
    { type: 'heading', content: { en: 'Scope — where variables live', pt: 'Escopo — onde as variáveis vivem' } },
    { type: 'code', code:
`x = 10   # This is a GLOBAL variable — lives outside any function

def my_function():
    y = 20   # This is a LOCAL variable — only exists INSIDE this function
    print(x)  # Can READ the global variable from inside a function
    print(y)  # Can use the local variable

my_function()
print(x)     # Works — x is global
# print(y)   # ERROR! y doesn't exist outside the function
# NameError: name 'y' is not defined`
    }
  ],
  exercise: {
    title: { en: 'Mini Calculator', pt: 'Mini Calculadora' },
    description: {
      en: 'Write 4 functions: add(), subtract(), multiply(), divide(). Then build a menu-driven calculator that uses them.',
      pt: 'Escreva 4 funções: add(), subtract(), multiply(), divide(). Depois construa uma calculadora com menu que as usa.'
    },
    steps: [
      {
        en: '🤔 Think first: each function receives TWO numbers and returns ONE result. The divide() function needs special care: what happens if someone divides by zero? Plan for that.',
        pt: '🤔 Pense primeiro: cada função recebe DOIS números e retorna UM resultado. A função divide() precisa de cuidado especial: o que acontece se alguém divide por zero? Planeje para isso.'
      },
      {
        en: '📝 Step 1 — Write the 4 math functions. Each takes parameters a and b, does the math, and returns the result. For divide(), use an if inside: if b == 0, return an error message string instead of crashing.',
        pt: '📝 Passo 1 — Escreva as 4 funções matemáticas. Cada uma recebe parâmetros a e b, faz a conta e retorna o resultado. Para divide(), use um if dentro: se b == 0, retorne uma string de erro em vez de travar.'
      },
      {
        en: '📋 Step 2 — Print the menu. Just 4 print() lines: "1. Add", "2. Subtract", "3. Multiply", "4. Divide".',
        pt: '📋 Passo 2 — Imprima o menu. Apenas 4 linhas print(): "1. Somar", "2. Subtrair", "3. Multiplicar", "4. Dividir".'
      },
      {
        en: '📥 Step 3 — Ask for the choice (input, no int() needed — we compare as string). Then ask for number a and number b. These need float(input(...)) because we want decimals.',
        pt: '📥 Passo 3 — Peça a escolha (input, sem int() — comparamos como string). Depois peça o número a e o número b. Esses precisam de float(input(...)) porque queremos decimais.'
      },
      {
        en: '🔀 Step 4 — Use if/elif to call the right function based on choice. Print the result with an f-string. Use :.2f to show 2 decimal places.',
        pt: '🔀 Passo 4 — Use if/elif para chamar a função certa baseada na escolha. Imprima o resultado com f-string. Use :.2f para mostrar 2 casas decimais.'
      }
    ],
    starterCode:
`def add(a, b):
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
    print(f"Result: {add(a, b):.2f}")
elif choice == "2":
    print(f"Result: {subtract(a, b):.2f}")
elif choice == "3":
    
elif choice == "4":
    `,
    solution:
`def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: cannot divide by zero"
    return a / b

print("1. Add  2. Subtract  3. Multiply  4. Divide")
choice = input("Choose (1-4): ")
a = float(input("First number: "))
b = float(input("Second number: "))

if choice == "1":
    print(f"Result: {add(a, b):.2f}")
elif choice == "2":
    print(f"Result: {subtract(a, b):.2f}")
elif choice == "3":
    print(f"Result: {multiply(a, b):.2f}")
elif choice == "4":
    result = divide(a, b)
    if isinstance(result, str):
        print(result)
    else:
        print(f"Result: {result:.2f}")`,
    inputHint: '2\n10\n5'
  }
},

// ════════════════════════════════════════════════════════
// DAY 5 — Lists and Dictionaries
// ════════════════════════════════════════════════════════
{
  id: 5,
  title: { en: 'Organizing Data', pt: 'Organizando Dados' },
  subtitle: { en: 'lists · dictionaries · index · keys · when to use each', pt: 'listas · dicionários · índice · chaves · quando usar cada' },
  color: '#1a0010', textColor: '#f0abca', duration: 20,
  outcome: {
    en: 'You can store and access collections of data. You understand the difference between lists and dictionaries and know when to use each.',
    pt: 'Você consegue armazenar e acessar coleções de dados. Você entende a diferença entre listas e dicionários e sabe quando usar cada um.'
  },
  blocks: [
    { type: 'heading', content: { en: 'The problem with single variables', pt: 'O problema com variáveis individuais' } },
    { type: 'text', content: {
      en: 'If you have 5 students, you could create student1, student2, student3... But what about 1000 students? You need a way to group related data together. Python gives you two main tools: <strong>lists</strong> (ordered collections, accessed by position) and <strong>dictionaries</strong> (labeled collections, accessed by name).',
      pt: 'Se você tem 5 alunos, poderia criar aluno1, aluno2, aluno3... Mas e 1000 alunos? Você precisa de uma forma de agrupar dados relacionados. Python fornece duas ferramentas principais: <strong>listas</strong> (coleções ordenadas, acessadas por posição) e <strong>dicionários</strong> (coleções rotuladas, acessadas por nome).'
    }},
    { type: 'heading', content: { en: 'Lists — ordered collections', pt: 'Listas — coleções ordenadas' } },
    { type: 'code', code:
`# A list stores multiple items in ONE variable
# Square brackets [], items separated by commas
fruits = ["apple", "banana", "cherry", "mango"]

# Access items by INDEX (position number)
# IMPORTANT: Python counts from 0, not from 1!
print(fruits[0])   # "apple"   ← first item is index 0
print(fruits[1])   # "banana"  ← second item is index 1
print(fruits[3])   # "mango"   ← fourth item is index 3
print(fruits[-1])  # "mango"   ← -1 always means the LAST item

# Modify a list
fruits.append("kiwi")         # Add to the END
fruits.insert(0, "lemon")     # Add at position 0 (beginning)
fruits.remove("banana")       # Remove by VALUE
popped = fruits.pop()         # Remove and RETURN the last item

print(len(fruits))            # Number of items
print("apple" in fruits)      # True — check if item exists

# Loop over a list
for fruit in fruits:
    print(f"I have {fruit}")`
    },
    { type: 'tip', content: {
      en: 'Why start at 0? It\'s a computer science convention used in almost every language. A list of 5 items has indexes 0, 1, 2, 3, 4. The last valid index is always <code>len(list) - 1</code>.',
      pt: 'Por que começa no 0? É uma convenção da ciência da computação usada em quase toda linguagem. Uma lista de 5 itens tem índices 0, 1, 2, 3, 4. O último índice válido é sempre <code>len(lista) - 1</code>.'
    }},
    { type: 'heading', content: { en: 'Dictionaries — labeled data', pt: 'Dicionários — dados com rótulos' } },
    { type: 'text', content: {
      en: 'A dictionary stores data as <strong>key: value pairs</strong>. Instead of accessing by position number (like lists), you access by a meaningful label. This is exactly how real-world data is structured — a person has a name, an age, a city — not just "item 0, item 1, item 2".',
      pt: 'Um dicionário armazena dados como <strong>pares chave: valor</strong>. Em vez de acessar por número de posição (como listas), você acessa por um rótulo significativo. É exatamente como dados do mundo real são estruturados — uma pessoa tem nome, idade, cidade — não apenas "item 0, item 1, item 2".'
    }},
    { type: 'code', code:
`# Curly braces {}, key: value pairs
person = {
    "name": "Alex",        # key is "name", value is "Alex"
    "age": 28,             # key is "age", value is 28
    "city": "Toronto",
    "skills": ["Python", "Excel"]   # values can be any type, even lists!
}

# Access values by KEY (the label)
print(person["name"])           # "Alex"
print(person["age"])            # 28

# Safe access — returns default if key doesn't exist
print(person.get("email", "no email"))  # "no email" (key doesn't exist)

# Add or update
person["email"] = "alex@email.com"   # Adds new key
person["age"] = 29                   # Updates existing key

# Remove
del person["city"]                   # Removes key and value

# Loop over all key-value pairs
for key, value in person.items():
    print(f"{key}: {value}")

# Check if key exists
if "name" in person:
    print("We have a name!")`
    },
    { type: 'heading', content: { en: 'When to use list vs dictionary', pt: 'Quando usar lista vs dicionário' } },
    { type: 'code', code:
`# LIST: use when order matters or items don't have distinct labels
daily_tasks = ["wake up", "exercise", "work", "sleep"]
scores = [92, 85, 78, 95, 88]   # order matters

# DICTIONARY: use when each item has a meaningful name
student = {
    "name": "Alex",
    "grade": 92,
    "passed": True
}

# List of dictionaries: the most common real-world pattern
students = [
    {"name": "Alice", "grade": 92},
    {"name": "Bob", "grade": 85},
    {"name": "Carol", "grade": 78}
]

# Access: students[0] gets first student, ["name"] gets their name
print(students[0]["name"])   # "Alice"

for student in students:
    print(f"{student['name']}: {student['grade']}")`
    }
  ],
  exercise: {
    title: { en: 'Contact Book', pt: 'Agenda de Contatos' },
    description: {
      en: 'Build a contact book using a dictionary. Ask for a name to search, show their phone number, or say "not found". Keep looping until the user types "quit".',
      pt: 'Construa uma agenda de contatos usando um dicionário. Pergunte um nome para buscar, mostre o telefone, ou diga "not found". Continue em loop até o usuário digitar "quit".'
    },
    steps: [
      {
        en: '🤔 Think first: a contact book is a perfect dictionary use case — each person\'s NAME is the key, their PHONE NUMBER is the value. The structure looks like: {"Alice": "555-1234", "Bob": "555-5678"}',
        pt: '🤔 Pense primeiro: uma agenda é um caso perfeito para dicionário — o NOME de cada pessoa é a chave, o NÚMERO DE TELEFONE é o valor. A estrutura fica: {"Alice": "555-1234", "Bob": "555-5678"}'
      },
      {
        en: '📝 Step 1 — Create the contacts dictionary with at least 4 contacts already in it. This is your "database".',
        pt: '📝 Passo 1 — Crie o dicionário contacts com pelo menos 4 contatos já dentro. Esse é seu "banco de dados".'
      },
      {
        en: '🔁 Step 2 — Create a while True loop. This keeps the search running until the user quits.',
        pt: '🔁 Passo 2 — Crie um loop while True. Isso mantém a busca rodando até o usuário sair.'
      },
      {
        en: '📥 Step 3 — Inside the loop, ask for input: "Search contact (or \'quit\'): ". If the user types "quit", use break to exit.',
        pt: '📥 Passo 3 — Dentro do loop, peça input: "Buscar contato (ou \'sair\'): ". Se o usuário digitar "quit", use break para sair.'
      },
      {
        en: '🔍 Step 4 — Check if the typed name is IN the contacts dictionary. If yes, print their phone. If no, print "not found". Use contacts.get(name, "not found") — the cleanest way.',
        pt: '🔍 Passo 4 — Verifique se o nome digitado está NO dicionário contacts. Se sim, imprima o telefone. Se não, imprima "not found". Use contacts.get(nome, "not found") — a forma mais limpa.'
      }
    ],
    starterCode:
`contacts = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Carol": "555-9012",
    "David": "555-3456"
}

while True:
    name = input("\\nSearch contact (or 'quit'): ")

    if name.lower() == "quit":
        break

    # Look up the contact
    phone = contacts.get(name, None)

    if phone:
        print(f"Phone: {phone}")
    else:
        print(f"'{name}' not found in contacts.")

print("Goodbye!")`,
    solution:
`contacts = {
    "Alice": "555-1234",
    "Bob": "555-5678",
    "Carol": "555-9012",
    "David": "555-3456"
}

print(f"Contact book loaded — {len(contacts)} contacts available.")

while True:
    name = input("\\nSearch contact (or 'quit'): ").strip()

    if name.lower() == "quit":
        print("Closing contact book.")
        break

    if name in contacts:
        print(f"✓ {name}: {contacts[name]}")
    else:
        print(f"✗ '{name}' not found.")
        # Suggest similar names
        similar = [k for k in contacts if name.lower() in k.lower()]
        if similar:
            print(f"  Did you mean: {', '.join(similar)}?")`,
    inputHint: 'Alice\nquit'
  }
},

// ════════════════════════════════════════════════════════
// DAY 6 — Files and JSON
// ════════════════════════════════════════════════════════
{
  id: 6,
  title: { en: 'Real World Python', pt: 'Python no Mundo Real' },
  subtitle: { en: 'files · JSON · imports · how systems talk to each other', pt: 'arquivos · JSON · imports · como sistemas se comunicam' },
  color: '#001a14', textColor: '#5eead4', duration: 20,
  outcome: {
    en: 'You understand how Python reads/writes files and exchanges data with other systems through JSON. This is how all real applications work.',
    pt: 'Você entende como Python lê/escreve arquivos e troca dados com outros sistemas através de JSON. É assim que todas as aplicações reais funcionam.'
  },
  blocks: [
    { type: 'heading', content: { en: 'Why files matter', pt: 'Por que arquivos importam' } },
    { type: 'text', content: {
      en: 'Everything you\'ve built so far lives in memory — when the program stops, everything is lost. Files let you <strong>save data permanently</strong>. A program that tracks expenses, stores contacts, or generates reports needs to write to files. Reading files lets you process data that already exists — spreadsheets, logs, configuration.',
      pt: 'Tudo que você construiu até agora vive na memória — quando o programa para, tudo se perde. Arquivos permitem <strong>salvar dados permanentemente</strong>. Um programa que rastreia despesas, armazena contatos ou gera relatórios precisa escrever em arquivos. Ler arquivos permite processar dados que já existem — planilhas, logs, configurações.'
    }},
    { type: 'heading', content: { en: 'Reading and writing files', pt: 'Lendo e escrevendo arquivos' } },
    { type: 'code', code:
`# WRITE a file — mode "w" creates the file (or overwrites if it exists)
with open("notes.txt", "w") as f:
    f.write("First line\\n")      # \\n means "new line"
    f.write("Second line\\n")
    f.write("Third line\\n")
# The file is automatically closed when the 'with' block ends

# READ the whole file at once
with open("notes.txt", "r") as f:   # "r" = read mode
    content = f.read()               # Returns the entire file as one string
    print(content)

# READ line by line — better for large files
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())   # .strip() removes the \\n at the end of each line

# APPEND to an existing file — mode "a" adds without deleting
with open("notes.txt", "a") as f:
    f.write("Fourth line (added later)\\n")`
    },
    { type: 'tip', content: {
      en: 'Always use <code>with open(...) as f:</code> — not just <code>f = open(...)</code>. The <code>with</code> statement guarantees the file is properly closed even if an error occurs. Unclosed files can cause data loss.',
      pt: 'Sempre use <code>with open(...) as f:</code> — não apenas <code>f = open(...)</code>. O <code>with</code> garante que o arquivo seja fechado corretamente mesmo se ocorrer um erro. Arquivos não fechados podem causar perda de dados.'
    }},
    { type: 'heading', content: { en: 'JSON — the language the internet speaks', pt: 'JSON — a linguagem que a internet fala' } },
    { type: 'text', content: {
      en: 'JSON (JavaScript Object Notation) is a text format for exchanging data. When you use a weather app, a map, a social network — they are all sending and receiving JSON. It looks exactly like Python dictionaries and lists, which makes it very easy to work with in Python.',
      pt: 'JSON (JavaScript Object Notation) é um formato de texto para trocar dados. Quando você usa um app de clima, mapa, rede social — todos estão enviando e recebendo JSON. Parece exatamente com dicionários e listas Python, o que torna muito fácil trabalhar com ele em Python.'
    }},
    { type: 'code', code:
`import json   # 'import' loads a module — a collection of extra functions

# PYTHON DICT → JSON STRING (for sending/saving)
person = {
    "name": "Alex",
    "age": 28,
    "skills": ["Python", "Excel"],
    "active": True
}

json_text = json.dumps(person, indent=2)   # indent=2 makes it readable
print(json_text)
# {
#   "name": "Alex",
#   "age": 28,
#   ...
# }

# JSON STRING → PYTHON DICT (for receiving/loading)
received = '{"city": "Toronto", "temp": 22, "rain": false}'
data = json.loads(received)   # loads = load from string
print(data["city"])           # Toronto
print(data["temp"] + 5)       # 27 (it's a real number, not text)

# SAVE to file / LOAD from file
with open("person.json", "w") as f:
    json.dump(person, f, indent=2)   # dump = save to file

with open("person.json", "r") as f:
    loaded = json.load(f)            # load = read from file
print(loaded["name"])                # Alex`
    },
    { type: 'heading', content: { en: 'Importing modules — using Python\'s library', pt: 'Importando módulos — usando a biblioteca Python' } },
    { type: 'code', code:
`# Python comes with hundreds of built-in modules
# 'import' makes their functions available

import math
print(math.sqrt(144))     # 12.0 — square root
print(math.pi)            # 3.14159...
print(math.ceil(4.2))     # 5 — round up

import random
print(random.randint(1, 6))   # random number 1-6 (dice roll)
print(random.choice(["rock", "paper", "scissors"]))

import datetime
today = datetime.date.today()
print(today)                  # 2024-07-10
print(today.year)             # 2024

# You can also import specific functions (saves typing)
from math import sqrt, pi
print(sqrt(25))   # 5.0 — no need to write math.sqrt`
    }
  ],
  exercise: {
    title: { en: 'JSON Data Analyzer', pt: 'Analisador de Dados JSON' },
    description: {
      en: 'Parse a JSON string with student data. Calculate class average, find top student, show pass/fail for each. Save summary to a file.',
      pt: 'Analise uma string JSON com dados de alunos. Calcule a média da turma, encontre o melhor aluno, mostre aprovação de cada um. Salve resumo em arquivo.'
    },
    steps: [
      {
        en: '🤔 Think first: the data arrives as a JSON string. Step 1 is to convert it to a Python dict/list using json.loads(). After that, you work with it like any normal dictionary.',
        pt: '🤔 Pense primeiro: os dados chegam como string JSON. Passo 1 é converter para dict/lista Python usando json.loads(). Depois disso, você trabalha como qualquer dicionário normal.'
      },
      {
        en: '📥 Step 1 — Import json at the top. Parse the api_response string using json.loads(). Store the result and access the "students" key to get the list.',
        pt: '📥 Passo 1 — Importe json no topo. Parse a string api_response usando json.loads(). Guarde o resultado e acesse a chave "students" para obter a lista.'
      },
      {
        en: '🔢 Step 2 — Calculate the average: sum all grades and divide by count. Use a for loop to add up grades, or use sum() with a list comprehension.',
        pt: '🔢 Passo 2 — Calcule a média: some todas as notas e divida pela quantidade. Use um for loop para somar as notas, ou use sum() com uma compreensão de lista.'
      },
      {
        en: '🏆 Step 3 — Find the top student. Loop through all students keeping track of the highest grade seen and the name of who has it.',
        pt: '🏆 Passo 3 — Encontre o melhor aluno. Percorra todos os alunos mantendo o controle da nota mais alta vista e o nome de quem a tem.'
      },
      {
        en: '💾 Step 4 — Save the summary to "summary.txt" using open("summary.txt", "w"). Write the average and top student name.',
        pt: '💾 Passo 4 — Salve o resumo em "summary.txt" usando open("summary.txt", "w"). Escreva a média e o nome do melhor aluno.'
      }
    ],
    starterCode:
`import json

api_response = """
{
  "class": "Python 101",
  "students": [
    {"name": "Alice", "grade": 92},
    {"name": "Bob", "grade": 65},
    {"name": "Carol", "grade": 88},
    {"name": "David", "grade": 72},
    {"name": "Eva", "grade": 95}
  ]
}
"""

# Step 1: Parse the JSON
data = json.loads(api_response)
students = data["students"]

# Step 2: Calculate average
total = 0
for student in students:
    total += student["grade"]
average = total / len(students)

# Step 3: Find top student
best_name = ""
best_grade = 0
for student in students:
    if student["grade"] > best_grade:
        best_grade = 
        best_name = 

# Print results
print(f"Class: {data['class']}")
print(f"Students: {len(students)}")
print(f"Average grade: {average:.1f}")
print(f"Top student: {best_name} ({best_grade})")
print()
for student in students:
    status = "PASS" if student["grade"] >= 70 else "FAIL"
    print(f"{student['name']}: {student['grade']} — {status}")`,
    solution:
`import json

api_response = """
{
  "class": "Python 101",
  "students": [
    {"name": "Alice", "grade": 92},
    {"name": "Bob", "grade": 65},
    {"name": "Carol", "grade": 88},
    {"name": "David", "grade": 72},
    {"name": "Eva", "grade": 95}
  ]
}
"""

data = json.loads(api_response)
students = data["students"]

total = sum(s["grade"] for s in students)
average = total / len(students)

best = max(students, key=lambda s: s["grade"])

print(f"Class: {data['class']}")
print(f"Students: {len(students)}")
print(f"Average: {average:.1f}")
print(f"Top student: {best['name']} ({best['grade']})")
print()

passed = 0
for student in students:
    status = "✓ PASS" if student["grade"] >= 70 else "✗ FAIL"
    if student["grade"] >= 70: passed += 1
    print(f"{student['name']}: {student['grade']} — {status}")

print(f"\\nPassed: {passed}/{len(students)}")

with open("summary.txt", "w") as f:
    f.write(f"Class: {data['class']}\\n")
    f.write(f"Average: {average:.1f}\\n")
    f.write(f"Top: {best['name']} ({best['grade']})\\n")
print("Summary saved to summary.txt")`,
    inputHint: ''
  }
},

// ════════════════════════════════════════════════════════
// DAY 7 — Final Project
// ════════════════════════════════════════════════════════
{
  id: 7,
  title: { en: 'Putting It All Together', pt: 'Juntando Tudo' },
  subtitle: { en: 'Full project combining all 6 days', pt: 'Projeto completo combinando os 6 dias' },
  color: '#2d1060', textColor: '#e9d5ff', duration: 20,
  outcome: {
    en: 'You built a complete Python program from scratch. You can walk into any meeting about Python, follow the conversation, and explain what any basic code does.',
    pt: 'Você construiu um programa Python completo do zero. Você consegue entrar em qualquer reunião sobre Python, acompanhar a conversa e explicar o que qualquer código básico faz.'
  },
  blocks: [
    { type: 'heading', content: { en: 'What you now know', pt: 'O que você agora sabe' } },
    { type: 'text', content: {
      en: 'In 6 days you learned the core of Python: <strong>Day 1</strong> — variables, types, input/output. <strong>Day 2</strong> — making decisions with if/elif/else. <strong>Day 3</strong> — automating repetition with loops. <strong>Day 4</strong> — organizing code into reusable functions. <strong>Day 5</strong> — storing collections with lists and dictionaries. <strong>Day 6</strong> — reading/writing files and exchanging data as JSON. Today we combine all of it.',
      pt: 'Em 6 dias você aprendeu o núcleo do Python: <strong>Dia 1</strong> — variáveis, tipos, entrada/saída. <strong>Dia 2</strong> — decisões com if/elif/else. <strong>Dia 3</strong> — automação com loops. <strong>Dia 4</strong> — organização em funções reutilizáveis. <strong>Dia 5</strong> — coleções com listas e dicionários. <strong>Dia 6</strong> — arquivos e JSON. Hoje combinamos tudo.'
    }},
    { type: 'heading', content: { en: 'How real programs are structured', pt: 'Como programas reais são estruturados' } },
    { type: 'code', code:
`# A well-structured program has:
# 1. Functions defined at the top
# 2. A main section at the bottom that uses those functions
# 3. Clear variable names
# 4. Comments explaining WHY, not just WHAT

# === FUNCTIONS (the building blocks) ===

def get_valid_grade(name):
    """Ask for a grade and validate it's between 0-100."""
    while True:
        try:
            grade = float(input(f"Grade for {name}: "))
            if 0 <= grade <= 100:
                return grade      # valid — exit the loop
            print("Grade must be between 0 and 100.")
        except ValueError:
            print("Please enter a number.")

def calculate_stats(students):
    """Return average, highest, lowest from a list of student dicts."""
    grades = [s["grade"] for s in students]   # list comprehension!
    return {
        "average": sum(grades) / len(grades),
        "highest": max(grades),
        "lowest": min(grades)
    }

def print_report(students, stats):
    """Print a formatted report."""
    print("\\n" + "=" * 30)
    print("   CLASS REPORT")
    print("=" * 30)
    for student in sorted(students, key=lambda s: s["grade"], reverse=True):
        status = "PASS" if student["grade"] >= 60 else "FAIL"
        print(f"{student['name']:<15} {student['grade']:>5.1f}  {status}")
    print("-" * 30)
    print(f"Average: {stats['average']:.1f}")
    print(f"Highest: {stats['highest']:.1f}")
    print(f"Lowest:  {stats['lowest']:.1f}")

# === MAIN PROGRAM ===
print("=== Student Grade Manager ===")
students = []

while True:
    name = input("\\nStudent name (or 'done'): ").strip()
    if name.lower() == "done":
        break
    grade = get_valid_grade(name)
    students.append({"name": name, "grade": grade})
    print(f"✓ Added {name}")

if students:
    stats = calculate_stats(students)
    print_report(students, stats)
else:
    print("No students entered.")`
    },
    { type: 'tip', content: {
      en: 'Notice how the functions are defined at the top, and the "main" code is at the bottom. Each function does ONE thing. This structure makes code easy to test, fix, and expand. Professional code always looks like this.',
      pt: 'Veja como as funções são definidas no topo e o código "principal" fica na parte de baixo. Cada função faz UMA coisa. Essa estrutura facilita testar, corrigir e expandir. Código profissional sempre se parece com isso.'
    }},
    { type: 'heading', content: { en: 'What comes next — the full course', pt: 'O que vem a seguir — o curso completo' } },
    { type: 'text', content: {
      en: 'This week you learned Python fundamentals. The full course goes much deeper: <strong>Object-Oriented Programming</strong> (classes, inheritance), <strong>Data Science</strong> (NumPy, Pandas, visualization), <strong>Web APIs</strong> (FastAPI, Django), <strong>Automation</strong> (browser control, Excel, scheduling), <strong>Machine Learning</strong>, and <strong>AI Integration</strong>. You now have the foundation to tackle all of it.',
      pt: 'Essa semana você aprendeu os fundamentos de Python. O curso completo vai muito mais fundo: <strong>Programação Orientada a Objetos</strong> (classes, herança), <strong>Ciência de Dados</strong> (NumPy, Pandas, visualização), <strong>APIs Web</strong> (FastAPI, Django), <strong>Automação</strong> (controle de browser, Excel, agendamento), <strong>Machine Learning</strong> e <strong>Integração com IA</strong>. Você agora tem a base para tudo isso.'
    }}
  ],
  exercise: {
    title: { en: 'Student Grade Manager', pt: 'Gerenciador de Notas de Alunos' },
    description: {
      en: 'Build a complete grade manager: add students in a loop, store in a dictionary, calculate stats, print formatted report, save to file. Uses EVERYTHING from days 1-6.',
      pt: 'Construa um gerenciador de notas completo: adicione alunos em loop, armazene em dicionário, calcule estatísticas, imprima relatório formatado, salve em arquivo. Usa TUDO dos dias 1-6.'
    },
    steps: [
      {
        en: '🤔 Think first: you are combining loops (Day 3), dictionaries (Day 5), functions (Day 4), f-strings (Day 1), conditionals (Day 2) and file writing (Day 6). Before coding, draw the flow: collect data → process → display → save.',
        pt: '🤔 Pense primeiro: você está combinando loops (Dia 3), dicionários (Dia 5), funções (Dia 4), f-strings (Dia 1), condicionais (Dia 2) e escrita de arquivos (Dia 6). Antes de codificar, desenhe o fluxo: coletar dados → processar → exibir → salvar.'
      },
      {
        en: '📝 Step 1 — Create a students dictionary (name → grade). Use a while True loop that asks for a name, then asks for a grade, stores them, and repeats until "done".',
        pt: '📝 Passo 1 — Crie um dicionário students (nome → nota). Use um loop while True que pede um nome, pede uma nota, armazena e repete até "done".'
      },
      {
        en: '🔢 Step 2 — Calculate: average (sum/count), best student (name with highest grade), count of passed (grade >= 60).',
        pt: '🔢 Passo 2 — Calcule: média (soma/contagem), melhor aluno (nome com nota mais alta), contagem de aprovados (nota >= 60).'
      },
      {
        en: '🖨️ Step 3 — Print the report. Loop through the dictionary, print each student with pass/fail. Then print the stats (average, best, passed count).',
        pt: '🖨️ Passo 3 — Imprima o relatório. Percorra o dicionário, imprima cada aluno com aprovado/reprovado. Depois imprima as estatísticas (média, melhor, contagem aprovados).'
      },
      {
        en: '💾 Step 4 — Save the report to "grades.txt". Open in "w" mode, write each student and the stats.',
        pt: '💾 Passo 4 — Salve o relatório em "grades.txt". Abra no modo "w", escreva cada aluno e as estatísticas.'
      }
    ],
    starterCode:
`students = {}

print("=== Student Grade Manager ===")
while True:
    name = input("\\nStudent name (or 'done'): ")
    if name.lower() == "done":
        break
    grade = float(input(f"Grade for {name}: "))
    students[name] = grade
    print(f"Added {name}")

if not students:
    print("No students entered!")
else:
    # Calculate stats
    average = sum(students.values()) / len(students)
    best = max(students, key=students.get)
    passed = [n for n, g in students.items() if g >= 60]

    # Print report
    print("\\n=== CLASS REPORT ===")
    for name, grade in students.items():
        status = "PASS" if grade >= 60 else "FAIL"
        print(f"{name}: {grade} — {status}")

    print(f"\\nAverage: {average:.1f}")
    print(f"Top student: {best} ({students[best]})")
    print(f"Passed: {len(passed)}/{len(students)}")

    # Save to file
    with open("grades.txt", "w") as f:
        f.write("CLASS REPORT\\n")
        f.write(f"Average: {average:.1f}\\n")
        for name, grade in students.items():
            f.write(f"{name}: {grade}\\n")
    print("\\nSaved to grades.txt!")`,
    solution:
`students = {}

print("=== Student Grade Manager ===")
while True:
    name = input("\\nStudent name (or 'done'): ").strip()
    if name.lower() == "done":
        break
    if not name:
        continue
    try:
        grade = float(input(f"Grade for {name} (0-100): "))
        if 0 <= grade <= 100:
            students[name] = grade
            print(f"✓ Added {name}")
        else:
            print("Grade must be 0-100.")
    except ValueError:
        print("Please enter a number.")

if not students:
    print("No students entered!")
else:
    average = sum(students.values()) / len(students)
    best = max(students, key=students.get)
    passed = [n for n, g in students.items() if g >= 60]

    print("\\n" + "=" * 30)
    for name, grade in sorted(students.items(), key=lambda x: x[1], reverse=True):
        status = "✓" if grade >= 60 else "✗"
        print(f"{status} {name}: {grade:.1f}")
    print("=" * 30)
    print(f"Average:  {average:.1f}")
    print(f"Top: {best} ({students[best]:.1f})")
    print(f"Passed: {len(passed)}/{len(students)}")

    with open("grades.txt", "w") as f:
        f.write("CLASS REPORT\\n" + "="*30 + "\\n")
        for n, g in students.items():
            f.write(f"{n}: {g:.1f}\\n")
        f.write(f"Average: {average:.1f}\\n")
    print("\\n✓ Saved to grades.txt")`,
    inputHint: 'Alice\n92\nBob\n78\ndone'
  }
}

] // end FASTTRACK_DAYS
