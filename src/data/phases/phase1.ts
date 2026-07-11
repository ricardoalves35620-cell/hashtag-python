import type { Phase } from '../types'

// ============================================================================
// PHASE 1 — print() e Primeiro Programa
// TEMPLATE A: Conceito Novo / Isolado
// ============================================================================

export const phase1: Phase = {
  id: 1,
  title: { en: 'Your First Program', pt: 'Seu Primeiro Programa' },
  description: {
    en: 'Write your very first line of Python and make the computer talk.',
    pt: 'Escreva sua primeira linha de Python e faça o computador falar.'
  },
  icon: '🐍',
  libraries: [],

  lesson: {
    title: { en: 'print() — Make the Computer Speak', pt: 'print() — Faça o Computador Falar' },
    blocks: [

      // ── GANCHO DE MERCADO ───────────────────────────────────────────────
      { type: 'heading', content: { en: '🌍 One function, trillions of uses', pt: '🌍 Uma função, trilhões de usos' } },
      {
        type: 'text',
        content: {
          en: 'Every Python program ever written — at Google, NASA, or your bank — starts with the same function you\'re about to learn.\n\nprint() is how programs talk to the world.\nLog files, app notifications, medical reports: all print().',
          pt: 'Todo programa Python já escrito — no Google, na NASA ou no seu banco — começa com a mesma função que você vai aprender agora.\n\nprint() é como programas falam com o mundo.\nLogs, notificações de app, relatórios médicos: todos usam print().'
        }
      },

      // ── A SACADA (ANALOGIA) ────────────────────────────────────────────
      { type: 'heading', content: { en: '🧩 Think of it as a megaphone', pt: '🧩 Pense como um megafone' } },
      {
        type: 'text',
        content: {
          en: 'You write something inside print( ).\nThe computer grabs the megaphone and shouts it on the screen.\n\nSimple rule:\n✅ Text → always inside quotes\n✅ Numbers → no quotes needed',
          pt: 'Você escreve algo dentro de print( ).\nO computador pega o megafone e grita na tela.\n\nRegra simples:\n✅ Texto → sempre dentro de aspas\n✅ Números → sem aspas'
        }
      },

      // ── CÓDIGO CURTO COMENTADO ─────────────────────────────────────────
      { type: 'heading', content: { en: '🐍 Python in action', pt: '🐍 Python em ação' } },
      {
        type: 'code',
        code: `# print() shows text on the screen
print("Hello, World!")        # text in quotes

# You can print numbers too
print(42)                     # no quotes for numbers

# And math results
print(10 + 5)                 # prints 15

# Print multiple values at once
print("Age:", 28)             # Age: 28`
      },
      {
        type: 'tip',
        content: {
          en: '💡 The "#" symbol starts a comment.\nComments are notes for humans — Python ignores them completely.',
          pt: '💡 O símbolo "#" inicia um comentário.\nComentários são notas para humanos — Python os ignora completamente.'
        }
      }
    ]
  },

  exercises: [
    // ── DESAFIO 1: PREENCHER LACUNA ───────────────────────────────────────
    {
      id: 'ex1_fill',
      title: { en: '🟡 Fill the Gap', pt: '🟡 Preencha a Lacuna' },
      description: {
        en: 'The code below is almost complete.\nFill in the blanks to print your name and age.',
        pt: 'O código abaixo está quase completo.\nPreencha as lacunas para imprimir seu nome e idade.'
      },
      starterCode: `# Fill in the blanks:
print("My name is ___")   # replace ___ with your name
print(___)                 # print the number 25`,
      hints: [
        { en: 'Text values need quotes: print("Maria")', pt: 'Valores de texto precisam de aspas: print("Maria")' },
        { en: 'Numbers don\'t need quotes: print(25)', pt: 'Números não precisam de aspas: print(25)' }
      ],
      sampleOutput: { en: 'My name is Maria\n25', pt: 'My name is Maria\n25' }
    },

    // ── DESAFIO 2: DO ZERO ────────────────────────────────────────────────
    {
      id: 'ex1_zero',
      title: { en: '🔴 From Scratch', pt: '🔴 Do Zero' },
      description: {
        en: 'Write a program that prints:\n1. Your full name\n2. Your city\n3. The result of 100 + 50',
        pt: 'Escreva um programa que imprima:\n1. Seu nome completo\n2. Sua cidade\n3. O resultado de 100 + 50'
      },
      starterCode: `# Write your 3 print() calls below:`,
      hints: [
        { en: 'You need exactly 3 print() calls', pt: 'Você precisa de exatamente 3 chamadas print()' },
        { en: 'print(100 + 50) calculates and prints the result', pt: 'print(100 + 50) calcula e imprime o resultado' }
      ],
      sampleOutput: { en: 'João Silva\nSão Paulo\n150', pt: 'João Silva\nSão Paulo\n150' }
    }
  ],

  quiz: [
    {
      id: 'q1_1',
      question: { en: 'To print the text "Hello" on screen, you write:', pt: 'Para imprimir o texto "Olá" na tela, você escreve:' },
      options: [
        { en: 'print("Hello")', pt: 'print("Olá")' },
        { en: 'print(Hello)', pt: 'print(Olá)' },
        { en: 'show("Hello")', pt: 'show("Olá")' },
        { en: 'write "Hello"', pt: 'write "Olá"' }
      ],
      correctIndex: 0,
      explanation: { en: 'Text always goes in quotes inside print(). Without quotes Python thinks it\'s a variable name.', pt: 'Texto sempre vai entre aspas dentro de print(). Sem aspas o Python pensa que é um nome de variável.' }
    },
    {
      id: 'q1_2',
      question: { en: 'What does print(3 + 7) show on screen?', pt: 'O que print(3 + 7) mostra na tela?' },
      options: [
        { en: '10', pt: '10' },
        { en: '"3 + 7"', pt: '"3 + 7"' },
        { en: '3 + 7', pt: '3 + 7' },
        { en: 'Error', pt: 'Erro' }
      ],
      correctIndex: 0,
      explanation: { en: 'Python calculates 3 + 7 = 10 BEFORE printing. No quotes = math operation.', pt: 'Python calcula 3 + 7 = 10 ANTES de imprimir. Sem aspas = operação matemática.' }
    },
    {
      id: 'q1_3',
      question: { en: 'What does # do in Python?', pt: 'O que # faz no Python?' },
      options: [
        { en: 'Creates a comment — Python ignores that line', pt: 'Cria um comentário — Python ignora aquela linha' },
        { en: 'Prints a hashtag symbol', pt: 'Imprime o símbolo hashtag' },
        { en: 'Starts a new section', pt: 'Inicia uma nova seção' },
        { en: 'Causes an error', pt: 'Causa um erro' }
      ],
      correctIndex: 0,
      explanation: { en: '# starts a comment. Everything after # on that line is ignored by Python. Use comments to explain your code.', pt: '# inicia um comentário. Tudo após # naquela linha é ignorado pelo Python. Use comentários para explicar seu código.' }
    },
    {
      id: 'q1_4',
      question: { en: 'Which prints the number 42 (not the text "42")?', pt: 'Qual imprime o número 42 (não o texto "42")?' },
      options: [
        { en: 'print(42)', pt: 'print(42)' },
        { en: 'print("42")', pt: 'print("42")' },
        { en: 'Both are the same', pt: 'Os dois são iguais' },
        { en: 'Neither works', pt: 'Nenhum funciona' }
      ],
      correctIndex: 0,
      explanation: { en: 'print(42) prints the integer 42. print("42") prints the text "42". They look the same but behave differently in math.', pt: 'print(42) imprime o inteiro 42. print("42") imprime o texto "42". Parecem iguais mas se comportam diferente em matemática.' }
    }
  ],

  exam: {
    title: { en: 'Phase 1 Exam: Your First Program', pt: 'Exame Fase 1: Seu Primeiro Programa' },
    scenario: {
      en: 'You just joined an insurance company as a developer intern. Your first task: build a "system welcome screen" that displays the company info and today\'s claim count.',
      pt: 'Você acabou de entrar numa seguradora como desenvolvedor trainee. Primeira tarefa: criar uma "tela de boas-vindas" do sistema com informações da empresa e contagem de sinistros do dia.'
    },
    requirements: {
      en: [
        'Print the company name: "ClaimPro Insurance"',
        'Print the department: "Claims Processing"',
        'Print today\'s open claims: 47',
        'Print the result of: 47 + 12 (new claims arriving)'
      ],
      pt: [
        'Imprima o nome da empresa: "ClaimPro Insurance"',
        'Imprima o departamento: "Claims Processing"',
        'Imprima os sinistros abertos hoje: 47',
        'Imprima o resultado de: 47 + 12 (novos sinistros chegando)'
      ]
    },
    starterCode: `# Company welcome screen
# Write your 4 print() calls below:`,
    testCases: [
      { id: 'tc1_1', description: { en: 'Shows company name', pt: 'Mostra nome da empresa' }, inputs: [], checks: [{ type: 'contains', value: 'ClaimPro' }], points: 25 },
      { id: 'tc1_2', description: { en: 'Shows department', pt: 'Mostra departamento' }, inputs: [], checks: [{ type: 'contains', value: 'Claims' }], points: 25 },
      { id: 'tc1_3', description: { en: 'Shows 47', pt: 'Mostra 47' }, inputs: [], checks: [{ type: 'contains', value: '47' }], points: 25 },
      { id: 'tc1_4', description: { en: 'Shows 59 (47+12)', pt: 'Mostra 59 (47+12)' }, inputs: [], checks: [{ type: 'contains', value: '59' }], points: 25 }
    ]
  }
}
