import type { Phase } from '../types'

export const phase6: Phase = {
  id: 6,
  title: { en: 'Strings & Files', pt: 'Strings e Arquivos' },
  description: {
    en: 'Master text manipulation and read/write files — essential for every real-world Python program.',
    pt: 'Domine manipulação de texto e leitura/escrita de arquivos — essencial para todo programa Python real.'
  },
  icon: '📂',
  libraries: ['pathlib', 'os', 'csv', 're'],

  lesson: {
    title: { en: 'Strings & Files', pt: 'Strings e Arquivos' },
    blocks: [
      { type: 'heading', content: { en: 'String methods — your text toolkit', pt: 'Métodos de string — seu kit de ferramentas de texto' } },
      {
        type: 'text',
        content: {
          en: 'Strings in Python come with dozens of built-in methods. These let you transform, search, split, and format text without writing any extra code.',
          pt: 'Strings em Python vêm com dezenas de métodos embutidos. Eles permitem transformar, buscar, dividir e formatar texto sem escrever código extra.'
        }
      },
      {
        type: 'code',
        code: `text = "  Hello, World!  "

# Case
print(text.upper())          # "  HELLO, WORLD!  "
print(text.lower())          # "  hello, world!  "
print(text.title())          # "  Hello, World!  "

# Whitespace
print(text.strip())          # "Hello, World!"
print(text.lstrip())         # "Hello, World!  "

# Search
print("World" in text)       # True
print(text.find("World"))    # 9 (index)
print(text.count("l"))       # 3

# Replace & split
print(text.replace("World", "Python"))
words = "apple,banana,cherry".split(",")
print(words)                 # ['apple', 'banana', 'cherry']
print(", ".join(words))      # "apple, banana, cherry"

# Check content
print("123".isdigit())       # True
print("hello".isalpha())     # True
print("  ".isspace())        # True`
      },
      { type: 'heading', content: { en: 'F-strings — advanced formatting', pt: 'F-strings — formatação avançada' } },
      {
        type: 'code',
        code: `name = "Ricardo"
price = 9.99
pi = 3.14159

# Basic
print(f"Hello, {name}!")

# Number formatting
print(f"Price: \${price:.2f}")    # $9.99
print(f"Pi: {pi:.4f}")            # 3.1416
print(f"Big: {1000000:,}")        # 1,000,000
print(f"Percent: {0.856:.1%}")    # 85.6%

# Alignment
print(f"{'Left':<10}|{'Right':>10}")
print(f"{'Center':^20}")

# Expressions inside
print(f"2 + 2 = {2 + 2}")
items = ['a', 'b', 'c']
print(f"Count: {len(items)}")`
      },
      { type: 'heading', content: { en: 'Regular expressions basics', pt: 'Expressões regulares básicas' } },
      {
        type: 'code',
        code: `import re

text = "Call us at 555-1234 or 800-555-9876"

# Find all phone numbers
phones = re.findall(r'\\d{3}-\\d{4}', text)
print(phones)  # ['555-1234', '555-9876']

# Common patterns
email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
emails = re.findall(email_pattern, "Contact: user@email.com or admin@site.org")
print(emails)

# Replace
clean = re.sub(r'\\s+', ' ', "too   many    spaces")
print(clean)  # "too many spaces"`
      },
      { type: 'video', videoUrl: 'https://www.youtube.com/watch?v=K8L6KVGG-7o', videoTitle: { en: 'Python file handling', pt: 'Manipulação de arquivos Python' }, videoDuration: '0:58' },
      { type: 'heading', content: { en: 'Reading and writing files', pt: 'Lendo e escrevendo arquivos' } },
      {
        type: 'code',
        code: `# Write a file
with open("notes.txt", "w") as f:
    f.write("First line\\n")
    f.write("Second line\\n")

# Read entire file
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())

# Append to existing file
with open("notes.txt", "a") as f:
    f.write("Third line\\n")

# Read all lines into a list
with open("notes.txt", "r") as f:
    lines = f.readlines()
print(lines)  # ['First line\\n', 'Second line\\n', ...]`
      },
      {
        type: 'tip',
        content: {
          en: 'Always use <code>with open(...)</code> — it automatically closes the file even if an error occurs. Never use <code>f = open(...)</code> without a matching <code>f.close()</code>.',
          pt: 'Sempre use <code>with open(...)</code> — ele fecha o arquivo automaticamente mesmo se ocorrer um erro. Nunca use <code>f = open(...)</code> sem um <code>f.close()</code> correspondente.'
        }
      },
      { type: 'heading', content: { en: 'CSV files', pt: 'Arquivos CSV' } },
      {
        type: 'code',
        code: `import csv

# Write CSV
with open("students.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Grade", "City"])
    writer.writerow(["Alice", 92, "Toronto"])
    writer.writerow(["Bob", 85, "Vancouver"])

# Read CSV as dictionaries
with open("students.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['Name']}: {row['Grade']}")`
      },
      { type: 'heading', content: { en: 'pathlib — modern file paths', pt: 'pathlib — caminhos de arquivo modernos' } },
      {
        type: 'code',
        code: `from pathlib import Path

# Create path objects
home = Path.home()
docs = Path("documents")
file = docs / "report.txt"   # join paths with /

# Check existence
print(file.exists())
print(file.is_file())
print(file.is_dir())

# File info
print(file.name)        # "report.txt"
print(file.stem)        # "report"
print(file.suffix)      # ".txt"
print(file.parent)      # documents/

# List files in a directory
for f in Path(".").glob("*.py"):
    print(f.name)

# Create directories
Path("new_folder/sub").mkdir(parents=True, exist_ok=True)`
      }
    ]
  },

  exercises: [
    {
      id: 'ex6_1',
      title: { en: 'Text Analyzer', pt: 'Analisador de Texto' },
      description: {
        en: 'Ask user for a sentence. Count words, characters (no spaces), vowels, and find the longest word.',
        pt: 'Peça ao usuário uma frase. Conte palavras, caracteres (sem espaços), vogais e encontre a palavra mais longa.'
      },
      starterCode: `sentence = input("Enter a sentence: ")
words = sentence.split()
chars_no_spaces = sentence.replace(" ", "")
vowels = sum(1 for c in sentence.lower() if c in "aeiou")
longest = max(words, key=len)

print(f"Words: {len(words)}")
print(f"Characters (no spaces): {len(chars_no_spaces)}")
print(f"Vowels: {vowels}")
print(f"Longest word: {longest}")`,
      hints: [{ en: 'max(words, key=len) finds the longest word', pt: 'max(words, key=len) encontra a palavra mais longa' }]
    },
    {
      id: 'ex6_2',
      title: { en: 'Note Saver', pt: 'Salvador de Notas' },
      description: {
        en: 'Build a simple note-taking program. User can add notes (saved to notes.txt) and view all notes.',
        pt: 'Construa um programa simples de notas. Usuário pode adicionar notas (salvas em notes.txt) e ver todas as notas.'
      },
      starterCode: `from pathlib import Path

notes_file = Path("notes.txt")

while True:
    choice = input("\\n1. Add note  2. View notes  3. Quit\\nChoose: ")
    
    if choice == "1":
        note = input("Note: ")
        with open(notes_file, "a") as f:
            f.write(note + "\\n")
        print("Saved!")
    
    elif choice == "2":
        if notes_file.exists():
            with open(notes_file, "r") as f:
                lines = f.readlines()
            for i, line in enumerate(lines, 1):
                print(f"{i}. {line.strip()}")
        else:
            print("No notes yet")
    
    elif choice == "3":
        break`,
      hints: [{ en: 'Use "a" mode to append without overwriting', pt: 'Use o modo "a" para adicionar sem sobrescrever' }]
    },
    {
      id: 'ex6_3',
      title: { en: 'CSV Report', pt: 'Relatório CSV' },
      description: {
        en: 'Write a list of products with name, price, and quantity to a CSV file. Then read it back and calculate the total inventory value.',
        pt: 'Escreva uma lista de produtos com nome, preço e quantidade em um arquivo CSV. Depois leia e calcule o valor total do inventário.'
      },
      starterCode: `import csv

products = [
    ["Laptop", 999.99, 5],
    ["Mouse", 29.99, 20],
    ["Keyboard", 79.99, 15],
    ["Monitor", 399.99, 8],
]

# Write to CSV
with open("inventory.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Product", "Price", "Quantity"])
    writer.writerows(products)

# Read and calculate total value
total = 0
with open("inventory.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        value = float(row["Price"]) * int(row["Quantity"])
        total += value
        print(f"{row['Product']}: \${value:.2f}")

print(f"\\nTotal inventory value: \${total:.2f}")`,
      hints: [{ en: 'writer.writerows(products) writes all rows at once', pt: 'writer.writerows(products) escreve todas as linhas de uma vez' }]
    }
  ],

  quiz: [
    {
      id: 'q6_1',
      question: { en: 'What does "Hello World".split() return?', pt: 'O que "Hello World".split() retorna?' },
      options: [
        { en: '"Hello World"', pt: '"Hello World"' },
        { en: '["Hello", "World"]', pt: '["Hello", "World"]' },
        { en: '("Hello", "World")', pt: '("Hello", "World")' },
        { en: 'H-e-l-l-o-W-o-r-l-d', pt: 'H-e-l-l-o-W-o-r-l-d' }
      ],
      correctIndex: 1,
      explanation: { en: 'split() without arguments splits on whitespace and returns a list of words.', pt: 'split() sem argumentos divide por espaços em branco e retorna uma lista de palavras.' }
    },
    {
      id: 'q6_2',
      question: { en: 'Which file mode appends without overwriting?', pt: 'Qual modo de arquivo adiciona sem sobrescrever?' },
      options: [
        { en: '"w"', pt: '"w"' },
        { en: '"r"', pt: '"r"' },
        { en: '"a"', pt: '"a"' },
        { en: '"x"', pt: '"x"' }
      ],
      correctIndex: 2,
      explanation: { en: '"a" (append) adds to the end of the file. "w" overwrites. "r" reads only. "x" creates new file (fails if exists).', pt: '"a" (append) adiciona ao final do arquivo. "w" sobrescreve. "r" lê apenas. "x" cria novo arquivo (falha se existe).' }
    },
    {
      id: 'q6_3',
      question: { en: 'What does f"{3.14159:.2f}" produce?', pt: 'O que f"{3.14159:.2f}" produz?' },
      options: [
        { en: '3.14159', pt: '3.14159' },
        { en: '3.14', pt: '3.14' },
        { en: '3.1', pt: '3.1' },
        { en: '3', pt: '3' }
      ],
      correctIndex: 1,
      explanation: { en: ':.2f formats as a float with exactly 2 decimal places. 3.14159 rounded to 2 decimals = 3.14.', pt: ':.2f formata como float com exatamente 2 casas decimais. 3.14159 arredondado para 2 decimais = 3.14.' }
    },
    {
      id: 'q6_4',
      question: { en: 'Why use "with open(...) as f:" instead of just "f = open(...)"?', pt: 'Por que usar "with open(...) as f:" em vez de apenas "f = open(...)"?' },
      options: [
        { en: 'It is faster', pt: 'É mais rápido' },
        { en: 'It automatically closes the file even if an error occurs', pt: 'Fecha automaticamente o arquivo mesmo se ocorrer um erro' },
        { en: 'It can read more file types', pt: 'Pode ler mais tipos de arquivo' },
        { en: 'It is required by Python 3', pt: 'É obrigatório no Python 3' }
      ],
      correctIndex: 1,
      explanation: { en: 'The "with" statement is a context manager that guarantees the file is closed when the block exits, even if an exception occurs.', pt: 'O "with" é um gerenciador de contexto que garante o fechamento do arquivo quando o bloco termina, mesmo se ocorrer uma exceção.' }
    },
    {
      id: 'q6_5',
      question: { en: 'What does Path("docs") / "report.txt" create?', pt: 'O que Path("docs") / "report.txt" cria?' },
      options: [
        { en: 'A division operation', pt: 'Uma operação de divisão' },
        { en: 'A new file called report.txt', pt: 'Um novo arquivo chamado report.txt' },
        { en: 'A Path object for docs/report.txt', pt: 'Um objeto Path para docs/report.txt' },
        { en: 'An error', pt: 'Um erro' }
      ],
      correctIndex: 2,
      explanation: { en: 'pathlib overloads the / operator to join paths. Path("docs") / "report.txt" creates a Path object representing docs/report.txt (or docs\\report.txt on Windows).', pt: 'pathlib sobrecarrega o operador / para unir caminhos. Path("docs") / "report.txt" cria um objeto Path representando docs/report.txt.' }
    }
  ],

  exam: {
    title: { en: 'File Organizer', pt: 'Organizador de Arquivos' },
    scenario: {
      en: `Build a File Report Generator.

Your program must:
1. Create a file called "report.txt" with at least 5 student records
   Each line: "Name,Grade,City" (like a CSV)
2. Read the file back
3. Calculate and print:
   - Total number of students
   - Average grade
   - Highest grade student name
   - Students who passed (grade >= 70)
4. Write a summary to "summary.txt"

Example report.txt content:
Alice,92,Toronto
Bob,65,Vancouver
Carol,88,Montreal
David,72,Calgary
Eva,95,Ottawa

Example output:
Total students: 5
Average grade: 82.4
Top student: Eva (95)
Passed: Alice, Carol, David, Eva`,
      pt: `Construa um Gerador de Relatório de Arquivos.

Seu programa deve:
1. Criar um arquivo "report.txt" com pelo menos 5 registros de alunos
   Cada linha: "Nome,Nota,Cidade"
2. Ler o arquivo de volta
3. Calcular e imprimir: total de alunos, nota média, nome do melhor aluno, alunos aprovados (nota >= 70)
4. Escrever um resumo em "summary.txt"`
    },
    requirements: {
      en: ['Write a file with student data', 'Read the file back', 'Calculate total, average, top student', 'Find students who passed (>= 70)', 'Write summary to a second file', 'Program runs without errors'],
      pt: ['Escreva arquivo com dados de alunos', 'Leia o arquivo de volta', 'Calcule total, média, melhor aluno', 'Encontre alunos aprovados (>= 70)', 'Escreva resumo em segundo arquivo', 'Programa roda sem erros']
    },
    starterCode: `# Phase 6 Exam — File Report Generator

# Step 1: Write student data to report.txt
with open("report.txt", "w") as f:
    f.write("Alice,92,Toronto\\n")
    f.write("Bob,65,Vancouver\\n")
    f.write("Carol,88,Montreal\\n")
    f.write("David,72,Calgary\\n")
    f.write("Eva,95,Ottawa\\n")

# Step 2: Read and process
students = []
with open("report.txt", "r") as f:
    for line in f:
        name, grade, city = line.strip().split(",")
        students.append({"name": name, "grade": int(grade), "city": city})

# Step 3: Calculate stats
total = len(students)
average = sum(s["grade"] for s in students) / total
top = max(students, key=lambda s: s["grade"])
passed = [s["name"] for s in students if s["grade"] >= 70]

print(f"Total students: {total}")
print(f"Average grade: {average:.1f}")
print(f"Top student: {top['name']} ({top['grade']})")
print(f"Passed: {', '.join(passed)}")

# Step 4: Write summary
with open("summary.txt", "w") as f:
    f.write(f"Total: {total}\\n")
    f.write(f"Average: {average:.1f}\\n")
`,
    testCases: [
      { id: 'tc6_1', description: { en: 'Prints total students', pt: 'Imprime total de alunos' }, inputs: [], checks: [{ type: 'contains', value: '5' }], points: 10 },
      { id: 'tc6_2', description: { en: 'Prints average grade', pt: 'Imprime nota média' }, inputs: [], checks: [{ type: 'contains_any', value: ['82.4', '82.'] }], points: 10 },
      { id: 'tc6_3', description: { en: 'Identifies top student Eva', pt: 'Identifica melhor aluno Eva' }, inputs: [], checks: [{ type: 'contains', value: 'Eva' }], points: 10 },
      { id: 'tc6_4', description: { en: 'Shows grade 95 for top student', pt: 'Mostra nota 95 para melhor aluno' }, inputs: [], checks: [{ type: 'contains', value: '95' }], points: 10 },
      { id: 'tc6_5', description: { en: 'Alice passed', pt: 'Alice passou' }, inputs: [], checks: [{ type: 'contains', value: 'Alice' }], points: 10 },
      { id: 'tc6_6', description: { en: 'Carol passed', pt: 'Carol passou' }, inputs: [], checks: [{ type: 'contains', value: 'Carol' }], points: 10 },
      { id: 'tc6_7', description: { en: 'David passed', pt: 'David passou' }, inputs: [], checks: [{ type: 'contains', value: 'David' }], points: 10 },
      { id: 'tc6_8', description: { en: 'Shows passed students list', pt: 'Mostra lista de aprovados' }, inputs: [], checks: [{ type: 'contains_any', value: ['Passed', 'passed'] }], points: 10 },
      { id: 'tc6_9', description: { en: 'Runs without errors', pt: 'Roda sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 },
      { id: 'tc6_10', description: { en: 'Total shows 5', pt: 'Total mostra 5' }, inputs: [], checks: [{ type: 'contains_any', value: ['Total', 'total'] }], points: 10 },
    ]
  }
}
