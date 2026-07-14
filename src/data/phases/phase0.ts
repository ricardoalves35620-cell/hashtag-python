import type { Phase } from '../types'

export const phase0: Phase = {
  id: 0,
  title: { en: 'Base Zero: Computer + First Python', pt: 'Base Zero: Computador + Primeiro Python' },
  description: {
    en: 'Files, folders, downloads, local versus cloud, terminal, hardware and your first safe Python execution.',
    pt: 'Arquivos, pastas, downloads, local versus nuvem, terminal, hardware e sua primeira execução segura de Python.',
  },
  icon: '🌱',
  libraries: [],
  lesson: {
    title: { en: 'Digital foundations before syntax', pt: 'Fundamentos digitais antes da sintaxe' },
    blocks: [
      { type: 'heading', content: { en: 'Start with the computer, not with memorization', pt: 'Comece pelo computador, não pela memorização' } },
      { type: 'text', content: { en: 'A Python project is made of files stored inside folders. The .py extension identifies Python code. The path tells the computer where the file is. The interactive Base Zero laboratory teaches these ideas through simulations.', pt: 'Um projeto Python é formado por arquivos guardados dentro de pastas. A extensão .py identifica código Python. O caminho informa ao computador onde o arquivo está. O laboratório interativo Base Zero ensina essas ideias por simulações.' }, alternate: { en: 'Before writing a recipe, you need a kitchen, labeled drawers and a place to keep the recipe. Files and folders provide that organization for code.', pt: 'Antes de escrever uma receita, você precisa de cozinha, gavetas identificadas e um lugar para guardar a receita. Arquivos e pastas fazem essa organização no código.' } },
      { type: 'heading', content: { en: 'Local, cloud and hardware', pt: 'Local, nuvem e hardware' } },
      { type: 'text', content: { en: 'Local work runs on your device. Cloud services run on computers reached through the internet. CPU, RAM, storage and GPU have different jobs, and understanding them will later help you choose what kind of AI can run locally.', pt: 'Trabalho local executa no seu dispositivo. Serviços de nuvem executam em computadores acessados pela internet. CPU, RAM, armazenamento e GPU têm funções diferentes, e entender isso ajudará depois a escolher que tipo de IA pode rodar localmente.' }, alternate: { en: 'Your computer is a workshop. Cloud computing is borrowing another workshop through the internet.', pt: 'Seu computador é uma oficina. Computação em nuvem é pegar outra oficina emprestada pela internet.' } },
      { type: 'heading', content: { en: 'The terminal is a precise conversation', pt: 'O terminal é uma conversa precisa' } },
      { type: 'code', code: 'python --version\npython meu_primeiro.py' },
      { type: 'text', content: { en: 'The first command asks which Python version is installed. The second asks Python to execute a specific file. Commands are not magic: each word has a precise role.', pt: 'O primeiro comando pergunta qual versão do Python está instalada. O segundo pede ao Python que execute um arquivo específico. Comandos não são mágicos: cada palavra tem uma função precisa.' }, alternate: { en: 'The terminal works like a form without buttons. You type the action and its details, then press Enter.', pt: 'O terminal funciona como um formulário sem botões. Você digita a ação e os detalhes e pressiona Enter.' } },
      { type: 'tip', content: { en: 'Use the interactive Base Zero route for the complete guided practice and the Visual Python Lab to see variables, conditions and loops execute step by step.', pt: 'Use a rota interativa Base Zero para a prática guiada completa e o Laboratório Visual para ver variáveis, condições e laços executarem passo a passo.' } },
    ],
  },
  exercises: [
    {
      id: 'base0-first-output',
      title: { en: 'Guided: your first output', pt: 'Guiado: sua primeira saída' },
      description: { en: 'Run the code and connect the program file to the output it produces.', pt: 'Execute o código e conecte o arquivo do programa à saída que ele produz.' },
      starterCode: 'file_name = "meu_primeiro.py"\nprint("Running:", file_name)\nprint("Python is ready")',
      hints: [
        { en: 'Before running, predict the two lines you expect to see. This turns execution into a test of your reasoning.', pt: 'Antes de executar, preveja as duas linhas que espera ver. Isso transforma a execução em um teste do seu raciocínio.' },
        { en: 'The variable file_name stores text. The first print combines a label with that stored value.', pt: 'A variável file_name guarda um texto. O primeiro print combina um rótulo com esse valor guardado.' },
        { en: 'After the first run, change only the filename text, run again, and confirm which part of the output changed.', pt: 'Depois da primeira execução, altere somente o texto do nome do arquivo, execute novamente e confirme qual parte da saída mudou.' },
      ],
      sampleOutput: { en: 'Running: meu_primeiro.py\nPython is ready', pt: 'Running: meu_primeiro.py\nPython is ready' },
      grading: {
        codeRequirements: [{ kind: 'assignment', value: 'file_name' }, { kind: 'call', value: 'print', minCount: 2 }],
        tests: [{ id: 'output', description: { en: 'Shows the Python filename and ready message', pt: 'Mostra o arquivo Python e a mensagem de pronto' }, inputs: [], checks: [{ type: 'contains', value: 'meu_primeiro.py' }, { type: 'contains', value: 'Python is ready' }], points: 100 }],
      },
    },
    {
      id: 'base0-fill-extension',
      title: { en: 'Complete the digital vocabulary', pt: 'Complete o vocabulário digital' },
      description: { en: 'Replace the blanks with the correct extension and storage location.', pt: 'Substitua as lacunas pela extensão e pelo local de armazenamento corretos.' },
      starterCode: 'python_extension = ___\nlong_term_files = ___\nprint(python_extension)\nprint(long_term_files)',
      hints: [{ en: 'Both answers are text and need quotes.', pt: 'As duas respostas são textos e precisam de aspas.' }, { en: 'Python files end in .py. Files remain in storage.', pt: 'Arquivos Python terminam em .py. Arquivos permanecem no armazenamento.' }],
      sampleOutput: { en: '.py\nstorage', pt: '.py\narmazenamento' },
      grading: {
        codeRequirements: [{ kind: 'assignment', value: 'python_extension' }, { kind: 'assignment', value: 'long_term_files' }],
        tests: [{ id: 'terms', description: { en: 'Uses the Python extension and long-term storage', pt: 'Usa a extensão Python e o armazenamento permanente' }, inputs: [], checks: [{ type: 'contains', value: '.py' }, { type: 'contains_any', value: ['storage', 'armazenamento', 'SSD'] }], points: 100 }],
      },
    },
    {
      id: 'base0-hardware-report',
      title: { en: 'Build a tiny hardware report', pt: 'Monte um pequeno relatório de hardware' },
      description: { en: 'Create four variables named cpu, ram, storage and gpu, then print each one.', pt: 'Crie quatro variáveis chamadas cpu, ram, storage e gpu e depois imprima cada uma.' },
      starterCode: '# Create the four variables below\n\n# Print a line for each resource\n',
      hints: [{ en: 'Example: cpu = "executes instructions"', pt: 'Exemplo: cpu = "executa instruções"' }, { en: 'Use four print calls.', pt: 'Use quatro chamadas de print.' }],
      sampleOutput: {
        en: 'CPU: executes instructions\nRAM: temporary working data\nStorage: keeps files\nGPU: processes graphics',
        pt: 'CPU: executa instruções\nRAM: guarda dados temporários\nArmazenamento: mantém arquivos\nGPU: processa gráficos',
      },
      grading: {
        codeRequirements: [
          { kind: 'assignment', value: 'cpu' }, { kind: 'assignment', value: 'ram' },
          { kind: 'assignment', value: 'storage' }, { kind: 'assignment', value: 'gpu' }, { kind: 'call', value: 'print', minCount: 4 },
        ],
        tests: [{ id: 'hardware', description: { en: 'Defines and prints all four resources', pt: 'Define e imprime os quatro recursos' }, inputs: [], checks: [{ type: 'no_error' }, { type: 'line_count', value: 4 }], points: 100 }],
      },
    },
  ],
  quiz: [
    { id: 'q0-1', question: { en: 'Which filename identifies Python code?', pt: 'Qual nome identifica código Python?' }, options: [{ en: 'app.txt', pt: 'app.txt' }, { en: 'app.py', pt: 'app.py' }, { en: 'app.zip', pt: 'app.zip' }], correctIndex: 1, explanation: { en: '.py is the agreed extension that tells people and tools the file contains Python source code; .txt is plain text and .zip is an archive, so neither describes an executable Python source file.', pt: '.py é a extensão combinada que informa às pessoas e ferramentas que o arquivo contém código-fonte Python; .txt representa texto comum e .zip representa um arquivo compactado, por isso não identificam um programa Python.' } },
    { id: 'q0-2', question: { en: 'What is a folder for?', pt: 'Para que serve uma pasta?' }, options: [{ en: 'Organizing files and other folders', pt: 'Organizar arquivos e outras pastas' }, { en: 'Increasing internet speed', pt: 'Aumentar a velocidade da internet' }, { en: 'Replacing RAM', pt: 'Substituir a RAM' }], correctIndex: 0, explanation: { en: 'Folders group related files and other folders, so both people and programs can locate a project through a predictable path; they do not change internet speed or replace memory.', pt: 'Pastas agrupam arquivos e outras pastas relacionados, permitindo que pessoas e programas localizem um projeto por um caminho previsível; elas não aumentam a internet nem substituem a memória.' } },
    { id: 'q0-3', question: { en: 'Which resource stores temporary working data?', pt: 'Qual recurso guarda dados temporários de trabalho?' }, options: [{ en: 'RAM', pt: 'RAM' }, { en: 'Storage', pt: 'Armazenamento' }, { en: 'Folder', pt: 'Pasta' }], correctIndex: 0, explanation: { en: 'RAM holds the temporary working data that open programs need quickly. Storage keeps files after shutdown, while a folder is only an organizational location inside storage.', pt: 'A RAM mantém temporariamente os dados de trabalho que os programas abertos precisam acessar com rapidez. O armazenamento preserva arquivos após desligar, enquanto uma pasta é apenas uma forma de organização dentro dele.' } },
    { id: 'q0-4', question: { en: 'What does local execution mean?', pt: 'O que significa execução local?' }, options: [{ en: 'The work runs on your device', pt: 'O trabalho executa no seu dispositivo' }, { en: 'The work always needs a paid API', pt: 'O trabalho sempre precisa de API paga' }, { en: 'The file has no location', pt: 'O arquivo não tem localização' }], correctIndex: 0, explanation: { en: 'Local execution means the CPU, memory, and storage of your own device perform the work. A remote cloud service may be useful later, but it is not required for the program to be local.', pt: 'Execução local significa que processador, memória e armazenamento do seu próprio dispositivo realizam o trabalho. Um serviço remoto de nuvem pode ser útil depois, mas não é necessário para o programa ser local.' } },
    { id: 'q0-5', question: { en: 'What does python --version do?', pt: 'O que python --version faz?' }, options: [{ en: 'Shows the installed Python version', pt: 'Mostra a versão instalada do Python' }, { en: 'Deletes Python', pt: 'Apaga o Python' }, { en: 'Creates a cloud account', pt: 'Cria uma conta na nuvem' }], correctIndex: 0, explanation: { en: 'python --version asks the selected Python executable to report its installed version. It does not create, delete, or modify a project, so it is a safe diagnostic command.', pt: 'python --version pede ao executável Python selecionado que informe sua versão instalada. Ele não cria, apaga nem modifica um projeto, por isso é um comando seguro de diagnóstico.' } },
  ],
  exam: {
    title: { en: 'Digital readiness report', pt: 'Relatório de preparo digital' },
    scenario: { en: 'Create a small Python program proving that you understand files and computer resources.', pt: 'Crie um pequeno programa Python provando que entende arquivos e recursos do computador.' },
    requirements: {
      en: ['Create variables file_name, cpu, ram, storage and gpu.', 'file_name must end in .py.', 'Print a five-line report using the variables.'],
      pt: ['Crie as variáveis file_name, cpu, ram, storage e gpu.', 'file_name deve terminar em .py.', 'Imprima um relatório de cinco linhas usando as variáveis.'],
    },
    starterCode: '# Base Zero final report\nfile_name = ""\ncpu = ""\nram = ""\nstorage = ""\ngpu = ""\n\n# Print five informative lines below\n',
    testCases: [
      { id: 'structure', description: { en: 'Defines the required variables', pt: 'Define as variáveis obrigatórias' }, inputs: [], checks: [{ type: 'no_error' }], codeRequirements: [{ kind: 'assignment', value: 'file_name' }, { kind: 'assignment', value: 'cpu' }, { kind: 'assignment', value: 'ram' }, { kind: 'assignment', value: 'storage' }, { kind: 'assignment', value: 'gpu' }], points: 40 },
      { id: 'extension', description: { en: 'Uses a Python filename', pt: 'Usa um nome de arquivo Python' }, inputs: [], checks: [{ type: 'contains', value: '.py' }], points: 20, hidden: true },
      { id: 'report', description: { en: 'Prints all five lines', pt: 'Imprime as cinco linhas' }, inputs: [], checks: [{ type: 'line_count', value: 5 }], codeRequirements: [{ kind: 'call', value: 'print', minCount: 5 }], points: 40, hidden: true },
    ],
  },
}
