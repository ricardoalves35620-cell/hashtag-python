import type { Phase } from '../types'

// ============================================================================
// PHASE 0 — Seu Computador Pronto pro Combate · TEMPLATE B
// Setup do ambiente real: Python + VS Code
// ============================================================================

export const phase0: Phase = {
  id: 0,
  title: { en: 'Battle-Ready Computer', pt: 'Seu Computador Pronto pro Combate' },
  description: {
    en: 'Set up your real dev environment: Python + VS Code, from absolute zero.',
    pt: 'Configure seu ambiente real de desenvolvimento: Python + VS Code, do zero absoluto.'
  },
  icon: '⚙️',
  libraries: [],

  lesson: {
    title: { en: 'From Zero to First Program on YOUR Machine', pt: 'Do Zero ao Primeiro Programa na SUA Máquina' },
    blocks: [

      // ── TELA 1: O CANTEIRO DE OBRAS ──────────────────────────────────────
      { type: 'heading', content: { en: '🏗️ Screen 1: The construction site (what is VS Code?)', pt: '🏗️ Tela 1: O canteiro de obras (o que é o VS Code?)' } },
      { type: 'text', content: {
        en: 'A construction site has everything in one place:\n🔨 tools within reach\n📋 the blueprint on the wall\n🚧 safety warnings when something\'s wrong\n\nVS Code is your construction site for code.\nIt\'s a Code Editor: a super-powered notepad where you write, organize and RUN your programs.\n\n🌍 Why VS Code?\nIt\'s the #1 editor in the world — used by devs at Google, Netflix, Microsoft and 73% of all programmers (Stack Overflow Survey). Free, light, and everything you learn here applies to real jobs.',
        pt: 'Um canteiro de obras tem tudo em um só lugar:\n🔨 ferramentas ao alcance da mão\n📋 a planta na parede\n🚧 avisos de segurança quando algo está errado\n\nO VS Code é o seu canteiro de obras do código.\nEle é um Editor de Código: um bloco de notas superpoderoso onde você escreve, organiza e EXECUTA seus programas.\n\n🌍 Por que o VS Code?\nÉ o editor nº 1 do mundo — usado por devs no Google, Netflix, Microsoft e por 73% de todos os programadores (Stack Overflow Survey). Grátis, leve, e tudo que você aprende aqui vale para empregos reais.'
      }},

      // ── TELA 2: OS DOWNLOADS ESSENCIAIS ──────────────────────────────────
      { type: 'heading', content: { en: '⬇️ Screen 2: The essential downloads', pt: '⬇️ Tela 2: Os downloads essenciais' } },
      { type: 'text', content: {
        en: 'Two downloads. Ten minutes. Let\'s go:\n\n1️⃣ PYTHON (the engine)\n→ Go to python.org/downloads\n→ Click the big yellow "Download Python" button\n→ Open the installer\n\n2️⃣ VS CODE (the construction site)\n→ Go to code.visualstudio.com\n→ Click "Download" (it detects Windows/Mac automatically)\n→ Install with all default options — just keep clicking Next ✅',
        pt: 'Dois downloads. Dez minutos. Vamos lá:\n\n1️⃣ PYTHON (o motor)\n→ Acesse python.org/downloads\n→ Clique no botão amarelo "Download Python"\n→ Abra o instalador\n\n2️⃣ VS CODE (o canteiro de obras)\n→ Acesse code.visualstudio.com\n→ Clique em "Download" (detecta Windows/Mac sozinho)\n→ Instale com as opções padrão — só ir clicando em Avançar ✅'
      }},
      { type: 'warning', content: {
        en: '🚨 CRUCIAL ALERT — READ TWICE! 🚨\n\nOn the FIRST Python installer screen, CHECK THE BOX:\n☑️ "Add Python to PATH"\n\n🧩 What is PATH? Think of it as your computer\'s phone book.\nWhen you type "python" in a terminal, the computer looks up the phone book to find where Python lives.\nIf you skip this box, Python gets installed but has NO phone number — the computer will say "python is not recognized" and nothing will work.\n\nForgot to check it? Uninstall and reinstall. Takes 2 minutes and saves hours of headache.',
        pt: '🚨 ALERTA CRUCIAL — LEIA DUAS VEZES! 🚨\n\nNa PRIMEIRA tela do instalador do Python, MARQUE A CAIXINHA:\n☑️ "Add Python to PATH"\n\n🧩 O que é PATH? Pense nele como a agenda telefônica do seu computador.\nQuando você digita "python" num terminal, o computador consulta a agenda para descobrir onde o Python mora.\nSe pular essa caixinha, o Python é instalado mas fica SEM telefone — o computador dirá "python não é reconhecido" e nada funcionará.\n\nEsqueceu de marcar? Desinstale e reinstale. Leva 2 minutos e economiza horas de dor de cabeça.'
      }},

      // ── TELA 3: CRIANDO O PRIMEIRO ARQUIVO ───────────────────────────────
      { type: 'heading', content: { en: '📄 Screen 3: Creating your first .py file', pt: '📄 Tela 3: Criando o primeiro arquivo .py' } },
      { type: 'text', content: {
        en: 'Time to create your first real file:\n\n1️⃣ Open VS Code\n2️⃣ Menu: File → New File (or Ctrl+N)\n3️⃣ Menu: File → Save As (or Ctrl+S)\n4️⃣ Name it: meu_primeiro.py\n5️⃣ Save it in a folder you\'ll remember (create "PythonProjects" on your Desktop)\n\n🧩 Why ".py" matters:\nThe extension is the file\'s ID badge.\n📄 .txt says "I\'m plain text"\n🐍 .py says "I\'m a Python script — run me!"\n\nWithout .py, VS Code treats your code as boring text: no colors, no play button, no magic.',
        pt: 'Hora de criar seu primeiro arquivo de verdade:\n\n1️⃣ Abra o VS Code\n2️⃣ Menu: File → New File (ou Ctrl+N)\n3️⃣ Menu: File → Save As (ou Ctrl+S)\n4️⃣ Nomeie: meu_primeiro.py\n5️⃣ Salve numa pasta que você vai lembrar (crie "ProjetosPython" na Área de Trabalho)\n\n🧩 Por que o ".py" importa:\nA extensão é o crachá do arquivo.\n📄 .txt diz "sou texto comum"\n🐍 .py diz "sou um script Python — me execute!"\n\nSem o .py, o VS Code trata seu código como texto sem graça: sem cores, sem botão de play, sem mágica.'
      }},

      // ── TELA 4: A EXTENSÃO MÁGICA ────────────────────────────────────────
      { type: 'heading', content: { en: '🧩 Screen 4: The magic extension', pt: '🧩 Tela 4: A extensão mágica' } },
      { type: 'text', content: {
        en: 'VS Code speaks many languages — but needs a translator for each one.\nThe Python extension is that translator. 🗣️\n\nInstall it in 30 seconds:\n1️⃣ Look at the LEFT sidebar in VS Code\n2️⃣ Click the Extensions icon (4 little squares 🔲)\n3️⃣ Search: Python\n4️⃣ The first result (by Microsoft, ~100M downloads) → click Install\n\n✨ What you unlock:\n• Colored code (syntax highlighting)\n• Error underlining BEFORE you run\n• Auto-complete as you type\n• The ▶️ Play button to run with one click',
        pt: 'O VS Code fala várias línguas — mas precisa de um tradutor para cada uma.\nA extensão Python é esse tradutor. 🗣️\n\nInstale em 30 segundos:\n1️⃣ Olhe a barra lateral ESQUERDA do VS Code\n2️⃣ Clique no ícone de Extensões (4 quadradinhos 🔲)\n3️⃣ Pesquise: Python\n4️⃣ O primeiro resultado (da Microsoft, ~100M downloads) → clique Install\n\n✨ O que você desbloqueia:\n• Código colorido (syntax highlighting)\n• Erros sublinhados ANTES de executar\n• Auto-completar enquanto digita\n• O botão ▶️ Play para rodar com um clique'
      }},

      // ── TELA 5: O BOTÃO PLAY ─────────────────────────────────────────────
      { type: 'heading', content: { en: '▶️ Screen 5: The Play button and your first Hello World', pt: '▶️ Tela 5: O botão Play e o primeiro Olá Mundo' } },
      { type: 'code', code: `# Type this in your meu_primeiro.py file:
print("Olá Mundo!")` },
      { type: 'text', content: {
        en: 'Now the historic moment: 🎬\n\n1️⃣ Look at the TOP-RIGHT corner of VS Code\n2️⃣ Find the ▶️ triangle (Play button)\n3️⃣ Click it!\n\n👀 Where the result is born:\nA panel opens at the BOTTOM of the screen — the TERMINAL.\nThat\'s where your program talks back:\n\nOlá Mundo!\n\n🎉 CONGRATULATIONS! You just ran real Python code on your own machine — the exact same way professional devs do it every day. Every program you write in this course can now run there too.',
        pt: 'Agora o momento histórico: 🎬\n\n1️⃣ Olhe o canto SUPERIOR DIREITO do VS Code\n2️⃣ Encontre o triângulo ▶️ (botão Play)\n3️⃣ Clique!\n\n👀 Onde o resultado nasce:\nUm painel abre EMBAIXO da tela — o TERMINAL.\nÉ lá que seu programa responde:\n\nOlá Mundo!\n\n🎉 PARABÉNS! Você acabou de rodar código Python de verdade na sua própria máquina — exatamente como devs profissionais fazem todo dia. Todo programa que você escrever neste curso pode rodar lá também.'
      }},

      { type: 'tip', content: {
        en: '💡 PRO TIP: keep both worlds!\n📱 Use this app to LEARN on the go (bus, lunch break, sofa)\n💻 Use VS Code to PRACTICE for real at home\nThe combo mobile-learning + desktop-practice is how you go from student to developer.',
        pt: '💡 DICA PRO: mantenha os dois mundos!\n📱 Use este app para APRENDER em qualquer lugar (ônibus, almoço, sofá)\n💻 Use o VS Code para PRATICAR de verdade em casa\nO combo aprender-no-celular + praticar-no-PC é como você vai de aluno a desenvolvedor.'
      }}
    ]
  },

  exercises: [
    {
      id: 'ex0_guided',
      title: { en: '🟢 Guided: Your Hello World (here in the app)', pt: '🟢 Guiado: Seu Olá Mundo (aqui no app)' },
      description: {
        en: 'While your PC downloads, practice here! Run this code — it\'s the exact same one you\'ll run in VS Code.',
        pt: 'Enquanto seu PC baixa, pratique aqui! Execute este código — é exatamente o mesmo que você rodará no VS Code.'
      },
      starterCode: `print("Olá Mundo!")
print("Meu computador está pronto pro combate! ⚔️")`,
      hints: [
        { en: 'Just hit Run and see both lines appear', pt: 'Apenas execute e veja as duas linhas aparecerem' }
      ],
      sampleOutput: { en: 'Olá Mundo!\nMeu computador está pronto pro combate! ⚔️', pt: 'Olá Mundo!\nMeu computador está pronto pro combate! ⚔️' }
    },
    {
      id: 'ex0_fill',
      title: { en: '🟡 Fill: Complete the Setup Checklist', pt: '🟡 Preencha: Complete o Checklist de Setup' },
      description: {
        en: 'Fill the blanks with the setup vocabulary you just learned.',
        pt: 'Preencha as lacunas com o vocabulário de setup que acabou de aprender.'
      },
      starterCode: `# Fill in the blanks (as text in quotes):
editor    = ___        # the code editor we use: "VS Code"
extension = ___        # Python file extension: ".py"
button    = ___        # what you click to run: "Play"

print("Editor:", editor)
print("Extension:", extension)
print("Run with:", button)`,
      hints: [
        { en: 'All three are text — remember the quotes!', pt: 'Os três são texto — lembre das aspas!' }
      ],
      sampleOutput: { en: 'Editor: VS Code\nExtension: .py\nRun with: Play', pt: 'Editor: VS Code\nExtension: .py\nRun with: Play' }
    }
  ],

  quiz: [
    {
      id: 'q0_1',
      question: { en: 'What is VS Code?', pt: 'O que é o VS Code?' },
      options: [
        { en: 'A code editor — your construction site for programs', pt: 'Um editor de código — seu canteiro de obras de programas' },
        { en: 'A programming language', pt: 'Uma linguagem de programação' },
        { en: 'An operating system', pt: 'Um sistema operacional' },
        { en: 'A web browser', pt: 'Um navegador' }
      ],
      correctIndex: 0,
      explanation: { en: 'VS Code is the EDITOR (where you write). Python is the LANGUAGE (what you write). Two different things working together!', pt: 'VS Code é o EDITOR (onde você escreve). Python é a LINGUAGEM (o que você escreve). Duas coisas diferentes trabalhando juntas!' }
    },
    {
      id: 'q0_2',
      question: { en: 'Why must you check "Add Python to PATH"?', pt: 'Por que marcar "Add Python to PATH"?' },
      options: [
        { en: 'So the computer knows WHERE Python lives — like a phone book entry', pt: 'Para o computador saber ONDE o Python mora — como um contato na agenda' },
        { en: 'To make Python faster', pt: 'Para o Python ficar mais rápido' },
        { en: 'It\'s optional decoration', pt: 'É decoração opcional' },
        { en: 'To install VS Code together', pt: 'Para instalar o VS Code junto' }
      ],
      correctIndex: 0,
      explanation: { en: 'PATH is the computer\'s address book. Without it, typing "python" returns "not recognized" — the computer can\'t find it.', pt: 'PATH é a agenda de endereços do computador. Sem ele, digitar "python" retorna "não reconhecido" — o computador não o encontra.' }
    },
    {
      id: 'q0_3',
      question: { en: 'What does the .py extension do?', pt: 'O que a extensão .py faz?' },
      options: [
        { en: 'Tells the computer "this is a Python script, not plain text"', pt: 'Avisa o computador "isto é um script Python, não texto comum"' },
        { en: 'Makes the file smaller', pt: 'Deixa o arquivo menor' },
        { en: 'Protects the file with a password', pt: 'Protege o arquivo com senha' },
        { en: 'Nothing — it\'s just style', pt: 'Nada — é só estilo' }
      ],
      correctIndex: 0,
      explanation: { en: 'The extension is the file\'s ID badge. .py unlocks colors, error checking and the Play button in VS Code.', pt: 'A extensão é o crachá do arquivo. .py desbloqueia cores, verificação de erros e o botão Play no VS Code.' }
    },
    {
      id: 'q0_4',
      question: { en: 'Where does the result appear when you click Play?', pt: 'Onde o resultado aparece quando você clica em Play?' },
      options: [
        { en: 'In the Terminal, at the bottom of VS Code', pt: 'No Terminal, na parte de baixo do VS Code' },
        { en: 'In a new browser tab', pt: 'Numa nova aba do navegador' },
        { en: 'In an email', pt: 'Num e-mail' },
        { en: 'Inside the code file itself', pt: 'Dentro do próprio arquivo de código' }
      ],
      correctIndex: 0,
      explanation: { en: 'The Terminal panel opens at the bottom — that\'s where your program prints its output.', pt: 'O painel do Terminal abre embaixo — é lá que seu programa imprime a saída.' }
    },
    {
      id: 'q0_5',
      question: { en: 'What does the Python EXTENSION in VS Code do?', pt: 'O que a EXTENSÃO Python do VS Code faz?' },
      options: [
        { en: 'Acts as translator: colors, error hints, auto-complete, Play button', pt: 'Age como tradutor: cores, dicas de erro, auto-completar, botão Play' },
        { en: 'Installs Python itself', pt: 'Instala o Python em si' },
        { en: 'Creates .py files automatically', pt: 'Cria arquivos .py automaticamente' },
        { en: 'Connects to the internet', pt: 'Conecta à internet' }
      ],
      correctIndex: 0,
      explanation: { en: 'The extension teaches VS Code to "speak Python". Python itself is installed separately from python.org.', pt: 'A extensão ensina o VS Code a "falar Python". O Python em si é instalado separadamente do python.org.' }
    }
  ],

  exam: {
    title: { en: 'Setup Certification', pt: 'Certificação de Setup' },
    scenario: {
      en: 'Prove your environment knowledge: write the classic first program with a personal touch — exactly what you\'ll run in VS Code after setup.',
      pt: 'Prove seu conhecimento de ambiente: escreva o clássico primeiro programa com um toque pessoal — exatamente o que você rodará no VS Code após o setup.'
    },
    requirements: {
      en: [
        'Print "Olá Mundo!"',
        'Print your setup status: "VS Code: ready"',
        'Print "Python: ready"',
        'Print a final message with the word "combate"'
      ],
      pt: [
        'Imprima "Olá Mundo!"',
        'Imprima seu status de setup: "VS Code: ready"',
        'Imprima "Python: ready"',
        'Imprima uma mensagem final com a palavra "combate"'
      ]
    },
    starterCode: `# Your setup certification program:`,
    testCases: [
      { id: 'tc0_1', description: { en: 'Prints Olá Mundo', pt: 'Imprime Olá Mundo' }, inputs: [], checks: [{ type: 'contains', value: 'Olá Mundo' }], points: 30 },
      { id: 'tc0_2', description: { en: 'VS Code ready', pt: 'VS Code pronto' }, inputs: [], checks: [{ type: 'contains', value: 'VS Code' }], points: 25 },
      { id: 'tc0_3', description: { en: 'Python ready', pt: 'Python pronto' }, inputs: [], checks: [{ type: 'contains', value: 'Python' }], points: 25 },
      { id: 'tc0_4', description: { en: 'Battle message', pt: 'Mensagem de combate' }, inputs: [], checks: [{ type: 'contains', value: 'combate' }], points: 20 }
    ]
  }
}
