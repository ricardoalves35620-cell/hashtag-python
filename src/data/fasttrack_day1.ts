// FastTrack Day 1 — rich content blocks
// Profile: knows basic tech concepts but has never written Python

import type { FTBlock } from './fasttrack'

export const day1Blocks: FTBlock[] = [
  {
    type: 'heading',
    content: {
      en: 'What is Python — and why does it matter?',
      pt: 'O que é Python — e por que importa?'
    }
  },
  {
    type: 'text',
    content: {
      en: 'Python is a programming language that reads almost like English. You write instructions, the computer follows them — exactly in order, line by line. It is the most popular language in the world right now, used by <strong>NASA, Netflix, Instagram, Google, and thousands of companies</strong> for everything from websites to AI.',
      pt: 'Python é uma linguagem de programação que parece quase inglês. Você escreve instruções, o computador as executa — exatamente na ordem, linha por linha. É a linguagem mais popular do mundo agora, usada pela <strong>NASA, Netflix, Instagram, Google e milhares de empresas</strong> para tudo: desde sites até IA.'
    }
  },
  {
    type: 'tip',
    content: {
      en: 'Why Python specifically? Because the syntax (how you write it) is minimal and clean. <code>print("Hello")</code> just works — no boilerplate, no semicolons, no curly braces required.',
      pt: 'Por que Python especificamente? Porque a sintaxe (como você escreve) é mínima e limpa. <code>print("Hello")</code> simplesmente funciona — sem código extra, sem ponto e vírgula, sem chaves obrigatórias.'
    }
  },
  {
    type: 'heading',
    content: {
      en: 'Variables — giving names to values',
      pt: 'Variáveis — dando nomes a valores'
    }
  },
  {
    type: 'text',
    content: {
      en: 'A variable is a <strong>named box in memory</strong>. You give it a name, put a value inside, and use that name anywhere in your code. In Python, you create a variable with a single <code>=</code> sign — read it as "is set to", not "equals".',
      pt: 'Uma variável é uma <strong>caixa nomeada na memória</strong>. Você dá um nome, coloca um valor dentro, e usa esse nome em qualquer lugar do código. Em Python, você cria uma variável com um único sinal <code>=</code> — leia como "recebe o valor de", não "é igual a".'
    }
  },
  {
    type: 'code',
    code: `# The # symbol starts a comment — Python ignores everything after it
# Comments are notes for YOU, not for the computer

name = "Alex"       # Create a variable called 'name', put the text "Alex" in it
age = 28            # Create a variable called 'age', put the number 28 in it
height = 1.78       # Decimal numbers use a dot (not comma)
is_student = True   # True or False — always capitalized in Python

# Now USE the variables
print(name)         # Output: Alex
print(age)          # Output: 28
print(is_student)   # Output: True`
  },
  {
    type: 'text',
    content: {
      en: 'Notice: text values go inside quotes (<code>"Alex"</code> or <code>\'Alex\'</code>). Numbers go without quotes (<code>28</code>). This matters — <code>"28"</code> is text, <code>28</code> is a number. You can do math with <code>28</code> but not with <code>"28"</code>.',
      pt: 'Atenção: valores de texto ficam entre aspas (<code>"Alex"</code> ou <code>\'Alex\'</code>). Números ficam sem aspas (<code>28</code>). Isso importa — <code>"28"</code> é texto, <code>28</code> é número. Você pode fazer contas com <code>28</code> mas não com <code>"28"</code>.'
    }
  },
  {
    type: 'heading',
    content: {
      en: 'The 4 main data types',
      pt: 'Os 4 tipos de dados principais'
    }
  },
  {
    type: 'code',
    code: `# str (string) — text, always in quotes
city = "Toronto"
greeting = 'Hello, World!'   # single or double quotes, your choice

# int (integer) — whole numbers, no decimal
year = 2024
count = 0
temperature = -5   # negatives work fine

# float (floating point) — decimal numbers
price = 9.99
pi = 3.14159

# bool (boolean) — only two possible values
logged_in = True
is_admin = False

# Check the type of any variable
print(type(city))         # Output: <class 'str'>
print(type(year))         # Output: <class 'int'>
print(type(price))        # Output: <class 'float'>
print(type(logged_in))    # Output: <class 'bool'>`
  },
  {
    type: 'heading',
    content: {
      en: 'print() — showing information on screen',
      pt: 'print() — mostrando informações na tela'
    }
  },
  {
    type: 'text',
    content: {
      en: '<code>print()</code> is a <strong>function</strong> — a built-in command that does something. You call it by writing its name followed by parentheses. Whatever you put inside the parentheses gets displayed on screen.',
      pt: '<code>print()</code> é uma <strong>função</strong> — um comando embutido que faz algo. Você chama escrevendo o nome seguido de parênteses. O que você colocar dentro dos parênteses aparece na tela.'
    }
  },
  {
    type: 'code',
    code: `name = "Alex"
age = 28

# Option 1: print multiple things, separated by commas
print("Name:", name, "Age:", age)
# Output: Name: Alex Age: 28

# Option 2: f-string — the professional way (recommended)
# Put f before the quote, then {variable} anywhere inside
print(f"Name: {name}")
# Output: Name: Alex

print(f"In 10 years, {name} will be {age + 10} years old.")
# Output: In 10 years, Alex will be 38 years old.
# Notice: you can do math INSIDE the curly braces!`
  },
  {
    type: 'tip',
    content: {
      en: '<strong>Always use f-strings</strong> when mixing text and variables. They are cleaner, easier to read, and the professional standard in Python. Just remember: <code>f"</code> at the start, <code>{variable}</code> for values inside.',
      pt: '<strong>Use sempre f-strings</strong> ao misturar texto e variáveis. São mais limpas, fáceis de ler e o padrão profissional em Python. Lembre: <code>f"</code> no início, <code>{variavel}</code> para valores dentro.'
    }
  },
  {
    type: 'heading',
    content: {
      en: 'input() — asking the user to type something',
      pt: 'input() — pedindo ao usuário que digite algo'
    }
  },
  {
    type: 'text',
    content: {
      en: '<code>input()</code> pauses the program and waits for the user to type something and press Enter. The text they type becomes the value. <strong>Important:</strong> input() always returns text (str), even if the user types a number. To use it as a number, wrap it with <code>int()</code> or <code>float()</code>.',
      pt: '<code>input()</code> pausa o programa e aguarda o usuário digitar algo e pressionar Enter. O texto digitado vira o valor. <strong>Importante:</strong> input() sempre retorna texto (str), mesmo que o usuário digite um número. Para usar como número, envolva com <code>int()</code> ou <code>float()</code>.'
    }
  },
  {
    type: 'code',
    code: `# Basic input — always returns a string
name = input("What is your name? ")
# → User types: Alex
# → name is now "Alex" (str)

# To get a number, convert it
birth_year = int(input("What year were you born? "))
# → User types: 1996
# → birth_year is now 1996 (int), not "1996" (str)

# Now you can do math with it
age = 2024 - birth_year

# Show the result
print(f"Hello, {name}!")
print(f"You are approximately {age} years old.")`
  },
  {
    type: 'warning',
    content: {
      en: 'If you forget <code>int()</code> and try to do math with the input directly, Python will give you a <strong>TypeError</strong>. For example: <code>age = 2024 - input("Year: ")</code> fails because you cannot subtract text from a number.',
      pt: 'Se você esquecer o <code>int()</code> e tentar fazer contas diretamente com o input, Python vai dar <strong>TypeError</strong>. Por exemplo: <code>age = 2024 - input("Ano: ")</code> falha porque não dá para subtrair texto de número.'
    }
  }
]
