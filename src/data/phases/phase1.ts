import type { Phase } from '../types'

export const phase1: Phase = {
  id: 1,
  title: { en: 'Hello, Python!', pt: 'Olá, Python!' },
  description: {
    en: 'Learn your first Python command: print(). Display messages and take your first step as a programmer.',
    pt: 'Aprenda seu primeiro comando Python: print(). Exiba mensagens e dê seus primeiros passos como programador.'
  },
  icon: '👋',
  libraries: [],

  lesson: {
    title: { en: 'Your First Program', pt: 'Seu Primeiro Programa' },
    blocks: [
      {
        type: 'heading',
        content: { en: 'What is Programming?', pt: 'O que é Programação?' }
      },
      {
        type: 'text',
        content: {
          en: 'Programming is giving instructions to a computer. You write code (instructions in a language it understands), and the computer follows them exactly, line by line, from top to bottom.\n\nPython is one of the easiest languages to learn because it reads almost like English. No confusing symbols — just clear instructions.',
          pt: 'Programação é dar instruções a um computador. Você escreve código (instruções em uma linguagem que ele entende), e o computador as segue exatamente, linha por linha, de cima para baixo.\n\nPython é uma das linguagens mais fáceis de aprender porque parece quase inglês. Sem símbolos confusos — apenas instruções claras.'
        }
      },
      {
        type: 'heading',
        content: { en: 'Your First Command: print()', pt: 'Seu Primeiro Comando: print()' }
      },
      {
        type: 'text',
        content: {
          en: 'The print() function displays text on the screen. It\'s the first thing every programmer learns.\n\nWhy "print()"? Because historically, computers displayed output on paper (printers). Today it still shows on your screen.',
          pt: 'A função print() exibe texto na tela. É a primeira coisa que todo programador aprende.\n\nPor que "print()"? Historicamente, computadores exibiam a saída em papel (impressoras). Hoje ainda mostra na sua tela.'
        }
      },
      {
        type: 'code',
        code: 'print("Hello, World!")'
      },
      {
        type: 'text',
        content: {
          en: 'This simple line does one thing: it tells Python to show the text "Hello, World!" on the screen.\n\nNotice:\n• print is the command\n• (parentheses) hold what you want to print\n• "quotes" tell Python this is text, not a command',
          pt: 'Esta linha simples faz uma coisa: diz ao Python para mostrar o texto "Hello, World!" na tela.\n\nNote:\n• print é o comando\n• (parênteses) guardam o que você quer imprimir\n• "aspas" dizem ao Python que é texto, não um comando'
        }
      },
      {
        type: 'heading',
        content: { en: 'Real-World Example: Insurance Report', pt: 'Exemplo Real: Relatório de Sinistro' }
      },
      {
        type: 'text',
        content: {
          en: 'Imagine you\'re an insurance adjuster. A claim just arrived. You could write it manually, or write a Python program that displays the report in seconds:',
          pt: 'Imagine que você é um ajustador de seguros. Um sinistro acabou de chegar. Você poderia escrever manualmente, ou escrever um programa Python que exibe o relatório em segundos:'
        }
      },
      {
        type: 'code',
        code: `print("=== INSURANCE CLAIM ===")
print("Claim #: 2501")
print("Type: Collision")
print("Date: July 13, 2026")
print("Status: OPEN")
print("=======================")
print("Damage amount: $5,230")
print("Processing time: 24 hours")`
      },
      {
        type: 'text',
        content: {
          en: 'Each line with print() displays one line of output. Run this code and you\'ll see a formatted report instantly.\n\nOrder matters. Python runs top to bottom. The first print() runs first, then the second, then the third — always in order.',
          pt: 'Cada linha com print() exibe uma linha de saída. Execute este código e você verá um relatório formatado instantaneamente.\n\nA ordem importa. Python roda de cima para baixo. O primeiro print() roda primeiro, depois o segundo, depois o terceiro — sempre em ordem.'
        }
      },
      {
        type: 'tip',
        content: {
          en: 'You can print anything: text, numbers, symbols. Just remember:\n• Text goes in quotes: print("Hello")\n• Numbers don\'t: print(42)\n• Empty print() just shows a blank line',
          pt: 'Você pode imprimir qualquer coisa: texto, números, símbolos. Apenas lembre-se:\n• Texto vai entre aspas: print("Olá")\n• Números não: print(42)\n• print() vazio mostra só uma linha em branco'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex1_1',
      title: { en: 'Print a Welcome Message', pt: 'Imprima uma Mensagem de Boas-vindas' },
      description: {
        en: '🎯 Write a program that prints exactly 3 lines:\n1. "Welcome to Hashtag Python!"\n2. A blank line\n3. Your name\n\nExample output:\nWelcome to Hashtag Python!\n\nAlice',
        pt: '🎯 Escreva um programa que imprima exatamente 3 linhas:\n1. "Bem-vindo ao Hashtag Python!"\n2. Uma linha em branco\n3. Seu nome\n\nExemplo:\nBem-vindo ao Hashtag Python!\n\nAlice'
      },
      starterCode: `# Step 1: Print the welcome message
print("Welcome to Hashtag Python!")

# Step 2: Print a blank line
print()

# Step 3: Print your name (change to your name)
print("Alice")`,
      hints: [
        {
          en: 'Use print("text") to display text',
          pt: 'Use print("texto") para exibir texto'
        },
        {
          en: 'To print a blank line, use print() with nothing inside',
          pt: 'Para imprimir uma linha em branco, use print() sem nada dentro'
        }
      ],
      sampleOutput: {
        en: 'Welcome to Hashtag Python!\n\nAlice',
        pt: 'Welcome to Hashtag Python!\n\nAlice'
      }
    },
    {
      id: 'ex1_2',
      title: { en: 'Insurance Claim Header', pt: 'Cabeçalho de Sinistro' },
      description: {
        en: '🎯 Real-world task: Print a professional claim header.\n\nYour program should print:\n1. A separator line: "====================="\n2. Your name\n3. Your role\n4. Another separator line: "====================="\n\nExample:\n=====================\nAlice Smith\nClaim Adjuster\n=====================',
        pt: '🎯 Tarefa real: Imprima um cabeçalho profissional de sinistro.\n\nSeu programa deve imprimir:\n1. Uma linha separadora: "====================="\n2. Seu nome\n3. Seu cargo\n4. Outra linha separadora: "====================="\n\nExemplo:\n=====================\nAlice Smith\nClaim Adjuster\n====================='
      },
      starterCode: `print("=====================")
print("Name: Alex")
print("Role: Claim Adjuster")
print("=====================")`,
      hints: [
        {
          en: 'Each print() makes a new line',
          pt: 'Cada print() faz uma nova linha'
        }
      ]
    },
    {
      id: 'ex1_3',
      title: { en: 'Your Info Display', pt: 'Seu Visor de Informações' },
      description: {
        en: '🎯 Print your personal details in a formatted way.\n\nPrint these 5 lines:\n1. "--- PERSONAL INFO ---"\n2. Name: (your name)\n3. Age: (your age)\n4. City: (your city)\n5. "-------------------"\n\nExample:\n--- PERSONAL INFO ---\nName: Diana\nAge: 28\nCity: Toronto\n-------------------',
        pt: '🎯 Imprima seus dados pessoais de forma formatada.\n\nImprima estas 5 linhas:\n1. "--- INFORMAÇÕES PESSOAIS ---"\n2. Nome: (seu nome)\n3. Idade: (sua idade)\n4. Cidade: (sua cidade)\n5. "-----------------------------"\n\nExemplo:\n--- INFORMAÇÕES PESSOAIS ---\nNome: Diana\nIdade: 28\nCidade: Toronto\n-----------------------------'
      },
      starterCode: `# Print header
print("--- PERSONAL INFO ---")

# Print your details (one per line)
print("Name: Diana")
print("Age: 28")
print("City: Toronto")

# Print footer
print("-------------------")`,
      hints: [
        {
          en: 'You need 5 print() calls total',
          pt: 'Você precisa de 5 chamadas print() no total'
        }
      ]
    }
  ],

  quiz: [
    {
      id: 'q1_1',
      question: {
        en: 'What does this code do?\n\nprint("Python")',
        pt: 'O que este código faz?\n\nprint("Python")'
      },
      options: [
        { en: 'Shows the word Python on the screen', pt: 'Mostra a palavra Python na tela' },
        { en: 'Stores Python in memory', pt: 'Armazena Python na memória' },
        { en: 'Creates a file named Python', pt: 'Cria um arquivo chamado Python' },
        { en: 'Prints it on paper', pt: 'Imprime em papel' }
      ],
      correctIndex: 0,
      explanation: {
        en: 'print() displays output to the screen. That\'s its only job.',
        pt: 'print() exibe a saída na tela. Esse é seu único trabalho.'
      }
    },
    {
      id: 'q1_2',
      question: {
        en: 'What\'s wrong with this code?\n\nprint(Hello)',
        pt: 'O que está errado neste código?\n\nprint(Hello)'
      },
      options: [
        { en: 'Nothing, it\'s correct', pt: 'Nada, está correto' },
        { en: 'Hello needs quotes around it', pt: 'Hello precisa de aspas ao redor' },
        { en: 'print is misspelled', pt: 'print está com grafia errada' },
        { en: 'Missing parentheses', pt: 'Parênteses faltando' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'Text must be in quotes. Without quotes, Python thinks "Hello" is a command, not text. The correct line is: print("Hello")',
        pt: 'Texto deve estar entre aspas. Sem aspas, Python acha que "Hello" é um comando, não texto. A linha correta é: print("Hello")'
      }
    },
    {
      id: 'q1_3',
      question: {
        en: 'How many lines does this code print?\n\nprint("Line 1")\nprint("Line 2")\nprint()\nprint("Line 3")',
        pt: 'Quantas linhas este código imprime?\n\nprint("Line 1")\nprint("Line 2")\nprint()\nprint("Line 3")'
      },
      options: [
        { en: '2 lines', pt: '2 linhas' },
        { en: '3 lines', pt: '3 linhas' },
        { en: '4 lines', pt: '4 linhas' },
        { en: '5 lines', pt: '5 linhas' }
      ],
      correctIndex: 3,
      explanation: {
        en: 'Each print() creates one line of output. Even print() with nothing inside creates a blank line. So: "Line 1", "Line 2", blank line, "Line 3" = 4 lines total.',
        pt: 'Cada print() cria uma linha de saída. Mesmo print() sem nada dentro cria uma linha em branco. Então: "Line 1", "Line 2", linha em branco, "Line 3" = 4 linhas no total.'
      }
    },
    {
      id: 'q1_4',
      question: {
        en: 'In Python, does order matter?\n\nprint("First")\nprint("Second")',
        pt: 'Em Python, a ordem importa?\n\nprint("First")\nprint("Second")'
      },
      options: [
        { en: 'No, order doesn\'t matter', pt: 'Não, a ordem não importa' },
        { en: 'Yes, Python runs top to bottom', pt: 'Sim, Python roda de cima para baixo' },
        { en: 'Only if you use numbers', pt: 'Apenas se você usar números' },
        { en: 'Depends on your computer', pt: 'Depende do seu computador' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'Python always reads code top to bottom. The first line executes first, then the second, then the third. Order absolutely matters.',
        pt: 'Python sempre lê o código de cima para baixo. A primeira linha executa primeiro, depois a segunda, depois a terceira. A ordem importa absolutamente.'
      }
    }
  ],

  exam: {
    title: { en: 'Claims Report', pt: 'Relatório de Sinistros' },
    scenario: {
      en: `You work at an insurance company. A new claim just arrived and you need to create a program that displays a professional report.\n\nYour program must print exactly these lines (in order):\n1. "=== INSURANCE CLAIM REPORT ==="\n2. "Claim Number: 2501"\n3. "Type: Motor Vehicle - Collision"\n4. "Date Reported: July 13, 2026"\n5. A blank line\n6. "Damage Assessment:"\n7. "Front bumper: $1,200"\n8. "Hood: $2,000"\n9. "Headlight (left): $800"\n10. A blank line\n11. "Total Damage: $4,000"\n12. "Deductible: $250"\n13. "Amount to Pay: $3,750"\n14. "=============================="\n\nNote: Your program must display all lines in this exact order. Do NOT ask for user input in this exam.`,
      pt: `Você trabalha em uma companhia de seguros. Um novo sinistro acabou de chegar e você precisa criar um programa que exibe um relatório profissional.\n\nSeu programa deve imprimir exatamente estas linhas (em ordem):\n1. "=== RELATÓRIO DE SINISTRO ==="\n2. "Número do Sinistro: 2501"\n3. "Tipo: Veículo Motor - Colisão"\n4. "Data Reportado: 13 de Julho de 2026"\n5. Uma linha em branco\n6. "Avaliação de Danos:"\n7. "Para-choque dianteiro: R$ 1.200"\n8. "Capô: R$ 2.000"\n9. "Farol (esquerdo): R$ 800"\n10. Uma linha em branco\n11. "Dano Total: R$ 4.000"\n12. "Franquia: R$ 250"\n13. "Valor a Pagar: R$ 3.750"\n14. "=============================="\n\nNota: Seu programa deve exibir todas as linhas nesta ordem exata. NÃO peça entrada do usuário neste exame.`
    },
    requirements: {
      en: [
        'Use print() commands to display the report',
        'Print the header line with equals signs',
        'Print all claim information exactly as shown',
        'Print damage details on separate lines',
        'Include blank lines where shown',
        'Print the footer with equals signs',
        'All text must match (case-sensitive for key words)',
        'Program must run without errors'
      ],
      pt: [
        'Use comandos print() para exibir o relatório',
        'Imprima a linha de cabeçalho com sinais de igualdade',
        'Imprima todas as informações do sinistro exatamente como mostrado',
        'Imprima detalhes de danos em linhas separadas',
        'Inclua linhas em branco onde mostrado',
        'Imprima o rodapé com sinais de igualdade',
        'Todo texto deve corresponder (sensível a maiúsculas)',
        'O programa deve rodar sem erros'
      ]
    },
    starterCode: `# Insurance Claim Report Program
# Print each line of the report using print()

print("=== INSURANCE CLAIM REPORT ===")
print("Claim Number: 2501")

# Add the rest of the report here...
`,
    testCases: [
      {
        id: 'tc1_1',
        description: { en: 'Contains claim header', pt: 'Contém cabeçalho de sinistro' },
        inputs: [],
        checks: [{ type: 'contains', value: 'INSURANCE CLAIM' }],
        points: 10
      },
      {
        id: 'tc1_2',
        description: { en: 'Shows claim number 2501', pt: 'Mostra número de sinistro 2501' },
        inputs: [],
        checks: [{ type: 'contains', value: '2501' }],
        points: 10
      },
      {
        id: 'tc1_3',
        description: { en: 'Shows collision type', pt: 'Mostra tipo colisão' },
        inputs: [],
        checks: [{ type: 'contains', value: 'Collision' }],
        points: 10
      },
      {
        id: 'tc1_4',
        description: { en: 'Shows bumper damage', pt: 'Mostra dano para-choque' },
        inputs: [],
        checks: [{ type: 'contains', value: 'bumper' }],
        points: 10
      },
      {
        id: 'tc1_5',
        description: { en: 'Shows hood damage', pt: 'Mostra dano capô' },
        inputs: [],
        checks: [{ type: 'contains', value: 'Hood' }],
        points: 10
      },
      {
        id: 'tc1_6',
        description: { en: 'Shows headlight damage', pt: 'Mostra dano farol' },
        inputs: [],
        checks: [{ type: 'contains', value: 'Headlight' }],
        points: 10
      },
      {
        id: 'tc1_7',
        description: { en: 'Shows total damage', pt: 'Mostra dano total' },
        inputs: [],
        checks: [{ type: 'contains', value: 'Total' }],
        points: 10
      },
      {
        id: 'tc1_8',
        description: { en: 'Shows deductible', pt: 'Mostra franquia' },
        inputs: [],
        checks: [{ type: 'contains', value: 'Deductible' }],
        points: 10
      },
      {
        id: 'tc1_9',
        description: { en: 'Shows amount to pay', pt: 'Mostra valor a pagar' },
        inputs: [],
        checks: [{ type: 'contains', value: 'Pay' }],
        points: 10
      },
      {
        id: 'tc1_10',
        description: { en: 'Contains footer separator', pt: 'Contém separador rodapé' },
        inputs: [],
        checks: [{ type: 'contains', value: '======' }],
        points: 10
      }
    ]
  }
}
