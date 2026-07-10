import type { Phase } from '../types'

export const phase3: Phase = {
  id: 3,
  title: { en: 'Loops & Iteration', pt: 'Loops e Iteração' },
  description: {
    en: 'Automate repetitive tasks with for and while loops — the engine of every real program.',
    pt: 'Automatize tarefas repetitivas com loops for e while — o motor de todo programa real.'
  },
  icon: '🔁',
  libraries: [],

  lesson: {
    title: { en: 'Loops & Iteration', pt: 'Loops e Iteração' },
    blocks: [
      {
        type: 'heading',
        content: { en: 'Why do we need loops?', pt: 'Por que precisamos de loops?' }
      },
      {
        type: 'text',
        content: {
          en: 'Imagine printing numbers 1 to 100. Without loops, you\'d need 100 lines of code. With a loop, you need 2. Loops let your program repeat an action automatically — for a fixed number of times, or until a condition is met.',
          pt: 'Imagine imprimir os números de 1 a 100. Sem loops, você precisaria de 100 linhas de código. Com um loop, precisa de 2. Loops permitem que seu programa repita uma ação automaticamente — por um número fixo de vezes, ou até que uma condição seja satisfeita.'
        }
      },
      {
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=OnDr4J2UXSA',
        videoTitle: { en: 'Python loops explained simply', pt: 'Loops em Python explicados' },
        videoDuration: '1:00'
      },
      {
        type: 'heading',
        content: { en: 'The for loop', pt: 'O loop for' }
      },
      {
        type: 'text',
        content: {
          en: 'A <code>for</code> loop repeats a block of code <strong>for each item</strong> in a sequence. The most common sequence is <code>range()</code>, which generates numbers.',
          pt: 'Um loop <code>for</code> repete um bloco de código <strong>para cada item</strong> em uma sequência. A sequência mais comum é <code>range()</code>, que gera números.'
        }
      },
      {
        type: 'code',
        code: `# Print numbers 1 to 5
for i in range(1, 6):
    print(i)

# range(start, stop, step)
for i in range(0, 10, 2):   # 0, 2, 4, 6, 8
    print(i)

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")`
      },
      {
        type: 'tip',
        content: {
          en: '<code>range(5)</code> gives 0, 1, 2, 3, 4 — it starts at 0 by default and stops BEFORE the number you give it. <code>range(1, 6)</code> gives 1, 2, 3, 4, 5.',
          pt: '<code>range(5)</code> gera 0, 1, 2, 3, 4 — começa em 0 por padrão e para ANTES do número que você dá. <code>range(1, 6)</code> gera 1, 2, 3, 4, 5.'
        }
      },
      {
        type: 'heading',
        content: { en: 'enumerate() and zip()', pt: 'enumerate() e zip()' }
      },
      {
        type: 'text',
        content: {
          en: '<code>enumerate()</code> gives you both the index and the value when looping. <code>zip()</code> lets you loop through two lists at the same time.',
          pt: '<code>enumerate()</code> te dá tanto o índice quanto o valor ao iterar. <code>zip()</code> permite iterar por duas listas ao mesmo tempo.'
        }
      },
      {
        type: 'code',
        code: `# enumerate — index + value
names = ["Alice", "Bob", "Carol"]
for i, name in enumerate(names):
    print(f"{i + 1}. {name}")
# 1. Alice  2. Bob  3. Carol

# zip — two lists together
scores = [95, 87, 92]
for name, score in zip(names, scores):
    print(f"{name}: {score}")`
      },
      {
        type: 'heading',
        content: { en: 'The while loop', pt: 'O loop while' }
      },
      {
        type: 'text',
        content: {
          en: 'A <code>while</code> loop keeps running as long as a condition is <code>True</code>. Use it when you don\'t know in advance how many times to repeat — like waiting for valid user input.',
          pt: 'Um loop <code>while</code> continua rodando enquanto uma condição for <code>True</code>. Use quando não sabe de antemão quantas vezes repetir — como aguardar entrada válida do usuário.'
        }
      },
      {
        type: 'code',
        code: `# Count down
count = 5
while count > 0:
    print(f"T-minus {count}")
    count -= 1
print("Liftoff!")

# Keep asking until valid input
while True:
    age = int(input("Enter your age: "))
    if age > 0:
        break    # exit the loop
    print("Age must be positive. Try again.")`
      },
      {
        type: 'warning',
        content: {
          en: 'Be careful with <code>while True</code> — if you forget the <code>break</code>, the loop runs forever and crashes your program. Always have an exit condition.',
          pt: 'Cuidado com <code>while True</code> — se esquecer o <code>break</code>, o loop roda para sempre e trava seu programa. Sempre tenha uma condição de saída.'
        }
      },
      {
        type: 'heading',
        content: { en: 'break, continue and else', pt: 'break, continue e else' }
      },
      {
        type: 'code',
        code: `# break — exit the loop immediately
for i in range(10):
    if i == 5:
        break
    print(i)   # prints 0 1 2 3 4

# continue — skip this iteration, go to next
for i in range(10):
    if i % 2 == 0:
        continue   # skip even numbers
    print(i)   # prints 1 3 5 7 9

# else on a loop — runs if loop wasn't broken
for i in range(5):
    print(i)
else:
    print("Loop finished normally")`
      },
      {
        type: 'heading',
        content: { en: 'Nested loops', pt: 'Loops aninhados' }
      },
      {
        type: 'code',
        code: `# Multiplication table
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i*j}")
    print("---")

# Flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = []
for row in matrix:
    for num in row:
        flat.append(num)
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]`
      }
    ]
  },

  exercises: [
    {
      id: 'ex3_1',
      title: { en: 'Multiplication Table', pt: 'Tabuada' },
      description: {
        en: 'Ask the user for a number and print its full multiplication table from 1 to 10.',
        pt: 'Pergunte um número ao usuário e imprima a tabuada completa de 1 a 10.'
      },
      starterCode: `number = int(input("Enter a number: "))

for i in range(1, 11):
    result = 
    print(f"{number} x {i} = {result}")`,
      hints: [
        { en: 'result = number * i', pt: 'result = number * i' }
      ],
      sampleOutput: { en: '5 x 1 = 5\n5 x 2 = 10\n...\n5 x 10 = 50', pt: '5 x 1 = 5\n5 x 2 = 10\n...\n5 x 10 = 50' }
    },
    {
      id: 'ex3_2',
      title: { en: 'Sum Calculator', pt: 'Calculadora de Soma' },
      description: {
        en: 'Ask the user to enter numbers one by one. Stop when they type "done". Print the total sum and count.',
        pt: 'Peça ao usuário que insira números um a um. Pare quando digitar "done". Imprima a soma total e a quantidade.'
      },
      starterCode: `total = 0
count = 0

while True:
    entry = input("Enter a number (or 'done' to stop): ")
    if entry == "done":
        break
    # Add the number to total
    # Increment count

print(f"Count: {count}")
print(f"Sum: {total}")`,
      hints: [
        { en: 'Convert entry to float: total += float(entry)', pt: 'Converta entry para float: total += float(entry)' },
        { en: 'count += 1 after adding the number', pt: 'count += 1 depois de adicionar o número' }
      ]
    },
    {
      id: 'ex3_3',
      title: { en: 'FizzBuzz', pt: 'FizzBuzz' },
      description: {
        en: 'Print numbers 1 to 30. But: print "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for multiples of both.',
        pt: 'Imprima os números de 1 a 30. Mas: imprima "Fizz" para múltiplos de 3, "Buzz" para múltiplos de 5 e "FizzBuzz" para múltiplos de ambos.'
      },
      starterCode: `for i in range(1, 31):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        # print Fizz
        pass
    elif i % 5 == 0:
        # print Buzz
        pass
    else:
        print(i)`,
      hints: [
        { en: 'Check FizzBuzz FIRST (both divisible) before checking Fizz or Buzz separately', pt: 'Verifique FizzBuzz PRIMEIRO (ambos divisíveis) antes de verificar Fizz ou Buzz separadamente' }
      ]
    }
  ],

  quiz: [
    {
      id: 'q3_1',
      question: { en: 'What does range(3) produce?', pt: 'O que range(3) produz?' },
      options: [
        { en: '1, 2, 3', pt: '1, 2, 3' },
        { en: '0, 1, 2', pt: '0, 1, 2' },
        { en: '0, 1, 2, 3', pt: '0, 1, 2, 3' },
        { en: '1, 2', pt: '1, 2' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'range(3) starts at 0 by default and stops BEFORE 3, producing 0, 1, 2.',
        pt: 'range(3) começa em 0 por padrão e para ANTES de 3, produzindo 0, 1, 2.'
      }
    },
    {
      id: 'q3_2',
      question: { en: 'What does "break" do inside a loop?', pt: 'O que "break" faz dentro de um loop?' },
      options: [
        { en: 'Skips the current iteration', pt: 'Pula a iteração atual' },
        { en: 'Exits the loop immediately', pt: 'Sai do loop imediatamente' },
        { en: 'Restarts the loop from the beginning', pt: 'Reinicia o loop do começo' },
        { en: 'Pauses the loop', pt: 'Pausa o loop' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'break exits the loop immediately. continue skips to the next iteration. There is no pause in Python loops.',
        pt: 'break sai do loop imediatamente. continue pula para a próxima iteração. Não existe pause em loops Python.'
      }
    },
    {
      id: 'q3_3',
      question: { en: 'What does enumerate() give you?', pt: 'O que enumerate() te dá?' },
      options: [
        { en: 'Only the index', pt: 'Somente o índice' },
        { en: 'Only the value', pt: 'Somente o valor' },
        { en: 'Both the index and the value', pt: 'Tanto o índice quanto o valor' },
        { en: 'The length of the list', pt: 'O comprimento da lista' }
      ],
      correctIndex: 2,
      explanation: {
        en: 'enumerate() returns (index, value) pairs for each item. Used as: for i, item in enumerate(list)',
        pt: 'enumerate() retorna pares (índice, valor) para cada item. Usado como: for i, item in enumerate(lista)'
      }
    },
    {
      id: 'q3_4',
      question: {
        en: 'How many times does this loop run?\n\nfor i in range(2, 8, 2):\n    print(i)',
        pt: 'Quantas vezes esse loop roda?\n\nfor i in range(2, 8, 2):\n    print(i)'
      },
      options: [
        { en: '2', pt: '2' },
        { en: '3', pt: '3' },
        { en: '4', pt: '4' },
        { en: '6', pt: '6' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'range(2, 8, 2) gives 2, 4, 6 — starting at 2, stopping before 8, stepping by 2. That\'s 3 iterations.',
        pt: 'range(2, 8, 2) dá 2, 4, 6 — começa em 2, para antes de 8, passo de 2. São 3 iterações.'
      }
    },
    {
      id: 'q3_5',
      question: { en: 'Which loop is best when you don\'t know how many times to repeat?', pt: 'Qual loop é melhor quando não sabe quantas vezes repetir?' },
      options: [
        { en: 'for loop with range()', pt: 'loop for com range()' },
        { en: 'while loop', pt: 'loop while' },
        { en: 'for loop with enumerate()', pt: 'loop for com enumerate()' },
        { en: 'nested for loop', pt: 'loop for aninhado' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'while loops are ideal when you repeat until a condition changes — like waiting for valid user input or reading data until a file ends.',
        pt: 'Loops while são ideais quando você repete até uma condição mudar — como aguardar entrada válida do usuário ou ler dados até o fim de um arquivo.'
      }
    }
  ],

  exam: {
    title: { en: 'Number Guessing Game', pt: 'Jogo de Adivinha o Número' },
    scenario: {
      en: `Build a Number Guessing Game.

The secret number is 42 (hardcoded — no random needed).

Your program must:
1. Tell the player the range (1 to 100)
2. Keep asking for guesses using a while loop
3. For each wrong guess, print "Too high!" or "Too low!"
4. Count how many attempts the player took
5. When correct, print a congratulations message with the attempt count

Example output:
Guess a number between 1 and 100
Enter your guess: 50
Too high!
Enter your guess: 25
Too low!
Enter your guess: 42
Correct! You got it in 3 attempts!`,
      pt: `Construa um Jogo de Adivinha o Número.

O número secreto é 42 (fixo no código — sem random necessário).

Seu programa deve:
1. Informar ao jogador o intervalo (1 a 100)
2. Continuar pedindo palpites usando um loop while
3. Para cada palpite errado, imprimir "Too high!" ou "Too low!"
4. Contar quantas tentativas o jogador fez
5. Quando correto, imprimir uma mensagem de parabéns com o número de tentativas`
    },
    requirements: {
      en: [
        'Use a while loop to keep asking for guesses',
        'Print "Too high!" when guess > 42',
        'Print "Too low!" when guess < 42',
        'Count the number of attempts',
        'Print congratulations with the attempt count when correct',
        'Program must exit after correct guess'
      ],
      pt: [
        'Use um loop while para continuar pedindo palpites',
        'Imprima "Too high!" quando palpite > 42',
        'Imprima "Too low!" quando palpite < 42',
        'Conte o número de tentativas',
        'Imprima parabéns com o número de tentativas quando correto',
        'O programa deve encerrar após o palpite correto'
      ]
    },
    starterCode: `# Phase 3 Exam — Number Guessing Game
secret = 42
attempts = 0

print("Guess a number between 1 and 100")

while True:
    guess = int(input("Enter your guess: "))
    attempts += 1
    
    if guess == secret:
        # Print congratulations with attempt count
        break
    elif guess > secret:
        # Print too high
        pass
    else:
        # Print too low
        pass`,
    testCases: [
      {
        id: 'tc3_1',
        description: { en: 'Prints "Too high!" for guess above 42', pt: 'Imprime "Too high!" para palpite acima de 42' },
        inputs: ['50', '42'],
        checks: [{ type: 'contains', value: 'Too high' }],
        points: 10
      },
      {
        id: 'tc3_2',
        description: { en: 'Prints "Too low!" for guess below 42', pt: 'Imprime "Too low!" para palpite abaixo de 42' },
        inputs: ['10', '42'],
        checks: [{ type: 'contains', value: 'Too low' }],
        points: 10
      },
      {
        id: 'tc3_3',
        description: { en: 'Prints congratulations on correct guess', pt: 'Imprime parabéns no palpite correto' },
        inputs: ['42'],
        checks: [{ type: 'contains_any', value: ['correct', 'Correct', 'congratul', 'got it', 'Got it'] }],
        points: 10
      },
      {
        id: 'tc3_4',
        description: { en: 'Shows attempt count = 1 for first try', pt: 'Mostra contagem de tentativas = 1 na primeira' },
        inputs: ['42'],
        checks: [{ type: 'contains', value: '1' }],
        points: 10
      },
      {
        id: 'tc3_5',
        description: { en: 'Shows correct attempt count after 3 guesses', pt: 'Mostra contagem correta após 3 palpites' },
        inputs: ['50', '25', '42'],
        checks: [{ type: 'contains', value: '3' }],
        points: 10
      },
      {
        id: 'tc3_6',
        description: { en: 'Shows range info at start', pt: 'Mostra informação de intervalo no início' },
        inputs: ['42'],
        checks: [{ type: 'contains_any', value: ['100', '1 to 100', '1 and 100'] }],
        points: 10
      },
      {
        id: 'tc3_7',
        description: { en: 'Multiple Too high messages work', pt: 'Múltiplas mensagens Too high funcionam' },
        inputs: ['90', '80', '42'],
        checks: [{ type: 'contains', value: 'Too high' }],
        points: 10
      },
      {
        id: 'tc3_8',
        description: { en: 'Multiple Too low messages work', pt: 'Múltiplas mensagens Too low funcionam' },
        inputs: ['5', '15', '42'],
        checks: [{ type: 'contains', value: 'Too low' }],
        points: 10
      },
      {
        id: 'tc3_9',
        description: { en: 'Runs without errors', pt: 'Roda sem erros' },
        inputs: ['42'],
        checks: [{ type: 'no_error', value: '' }],
        points: 10
      },
      {
        id: 'tc3_10',
        description: { en: 'Attempt count = 2 after two guesses', pt: 'Contagem = 2 após dois palpites' },
        inputs: ['50', '42'],
        checks: [{ type: 'contains', value: '2' }],
        points: 10
      }
    ]
  }
}
