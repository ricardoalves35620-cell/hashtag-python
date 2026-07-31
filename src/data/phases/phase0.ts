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
      description: {
        en: 'Goal:\nRun the code and observe how a variable appears inside a print statement. A text label is combined with the value stored in the variable file_name.\n\nThen change the text stored in file_name, run again, and notice which part of the output changes.\n\nOutput:\nRunning: meu_primeiro.py\nPython is ready',
        pt: 'Objetivo:\nExecute o código e observe como uma variável aparece dentro de um print. Um rótulo de texto é combinado com o valor guardado na variável file_name.\n\nDepois mude o texto guardado em file_name, execute novamente e perceba qual parte da saída muda.\n\nSaída:\nExecutando: meu_primeiro.py\nO Python está pronto'
      },
      starterCode: 'file_name = "meu_primeiro.py"  # name the file we are pretending to run\nprint("Running:", file_name)  # announce which file is starting\nprint("Python is ready")  # confirm the environment is ready',
      hints: [
        { en: 'Before running, predict the two lines you expect to see. This turns execution into a test of your reasoning.', pt: 'Antes de executar, preveja as duas linhas que espera ver. Isso transforma a execução em um teste do seu raciocínio.' },
        { en: 'The variable file_name stores text. The first print combines a label with that stored value.', pt: 'A variável file_name guarda um texto. O primeiro print combina um rótulo com esse valor guardado.' },
        { en: 'After the first run, change only the filename text, run again, and confirm which part of the output changed.', pt: 'Depois da primeira execução, altere somente o texto do nome do arquivo, execute novamente e confirme qual parte da saída mudou.' },
      ],
      sampleOutput: { en: 'Running: {{file}}\nPython is ready', pt: 'Executando: {{file}}\nO Python está pronto' },
      grading: {
        codeRequirements: [{ kind: 'assignment', value: 'file_name' }, { kind: 'call', value: 'print', minCount: 2 }],
        tests: [{ id: 'output', description: { en: 'Shows the Python filename and ready message', pt: 'Mostra o arquivo Python e a mensagem de pronto' }, inputs: [], checks: [{ type: 'matches', value: '[A-Za-z0-9_-]+[.]py' }, { type: 'contains_any', value: ['ready', 'pronto'] }], points: 100 }],
      },
    },
    {
      id: 'base0-fill-extension',
      title: { en: 'Complete the digital vocabulary', pt: 'Complete o vocabulário digital' },
      description: {
        en: 'Goal:\nFill in the two blanks with the correct text values.\n\nBlank 1 — python_extension: the file extension used by Python programs\n\nBlank 2 — long_term_files: the name of the long-term location where files are kept\n\nBoth values are text and need quotes.\n\nExample output:\n.py\nstorage',
        pt: 'Objetivo:\nPreencha as duas lacunas com os valores de texto corretos.\n\nBlank 1 — python_extension: a extensão de arquivo usada por programas Python\n\nBlank 2 — long_term_files: o nome do local de armazenamento onde os arquivos ficam\n\nAmbos os valores são texto e precisam de aspas.\n\nExemplo de saída:\n.py\narmazenamento'
      },
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
      description: {
        en: 'Goal:\nCreate four variables named cpu, ram, storage and gpu, each storing a short text description of what that computer component does. Then print each variable with a label.\n\nThe output must show four lines, one per component, with the component name and its role.\n\nProgram requirements\n\n1. Create\n- cpu: what the CPU does\n- ram: what RAM does\n- storage: what storage does\n- gpu: what the GPU does\n\n2. Display\n- One line per component, showing its name and its role\n\nExample:\nCPU: executes instructions\nRAM: temporary working data\nStorage: keeps files\nGPU: processes graphics',
        pt: 'Objetivo:\nCrie quatro variáveis chamadas cpu, ram, storage e gpu, cada uma guardando uma breve descrição do que aquele componente do computador faz. Depois imprima cada variável com um rótulo.\n\nA saída deve mostrar quatro linhas, uma por componente, com o nome do componente e sua função.\n\nRequisitos do programa\n\n1. Criar\n- cpu: o que a CPU faz\n- ram: o que a RAM faz\n- storage: o que o armazenamento faz\n- gpu: o que a GPU faz\n\n2. Mostrar\n- Uma linha por componente, com seu nome e sua função\n\nExemplo:\nCPU: executa instruções\nRAM: guarda dados temporários\nArmazenamento: mantém arquivos\nGPU: processa gráficos'
      },
      starterCode: { en: '# Create the four variables below, using exactly these names:\n# cpu, ram, storage, gpu\n\n# Print a line for each resource\n', pt: '# Crie as quatro variáveis abaixo, usando exatamente estes nomes:\n# cpu, ram, storage, gpu\n\n# Imprima uma linha para cada componente\n' },
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
    scenario: { en: 'Create a digital readiness report that verifies system components and file configuration.', pt: 'Crie um relatório de preparo digital que verifique os componentes do sistema e a configuração de arquivos.' },
    requirements: { en: ['Store a Python filename ending in .py in a variable', 'Store description text for CPU, RAM, storage, and GPU resources', 'A five-line summary showing the filename and each hardware component status'], pt: ['Guarde um nome de arquivo Python terminado em .py em uma variável', 'Guarde o texto descritivo para os recursos de CPU, RAM, armazenamento e GPU', 'Um resumo de cinco linhas mostrando o nome do arquivo e o status de cada componente de hardware'] },
    starterCode: { en: '# Base Zero final report\nfile_name = ""\ncpu = ""\nram = ""\nstorage = ""\ngpu = ""\n\n# Print five informative lines below\n', pt: '# Relatório final do Base Zero\nfile_name = ""\ncpu = ""\nram = ""\nstorage = ""\ngpu = ""\n\n# Imprima cinco linhas informativas abaixo\n' },
    testCases: [
      { id: 'structure', description: { en: 'Defines the required variables', pt: 'Define as variáveis obrigatórias' }, inputs: [], checks: [{ type: 'no_error' }], codeRequirements: [{ kind: 'assignment', value: 'file_name' }, { kind: 'assignment', value: 'cpu' }, { kind: 'assignment', value: 'ram' }, { kind: 'assignment', value: 'storage' }, { kind: 'assignment', value: 'gpu' }], points: 40 },
      { id: 'extension', description: { en: 'Uses a Python filename', pt: 'Usa um nome de arquivo Python' }, inputs: [], checks: [{ type: 'contains', value: '.py' }], points: 20, hidden: true },
      { id: 'report', description: { en: 'Prints all five lines', pt: 'Imprime as cinco linhas' }, inputs: [], checks: [{ type: 'line_count', value: 5 }], codeRequirements: [{ kind: 'call', value: 'print', minCount: 5 }], points: 40, hidden: true },
    ],
  },
}
