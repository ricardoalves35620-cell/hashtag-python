import type { Bilingual } from './types'
import type { BaseZeroModuleId } from '../lib/baseZero'

export interface BaseZeroModule {
  id: BaseZeroModuleId
  icon: string
  title: Bilingual
  goal: Bilingual
  explanation: Bilingual
  alternate: Bilingual
}

export const BASE_ZERO_MODULES: BaseZeroModule[] = [
  {
    id: 'files', icon: '📁',
    title: { en: 'Files, folders and extensions', pt: 'Arquivos, pastas e extensões' },
    goal: { en: 'Know where your work is and what type of file it is.', pt: 'Saber onde seu trabalho está e qual é o tipo do arquivo.' },
    explanation: { en: 'A folder organizes items. A file stores information. The extension after the dot identifies the file type. Python files end in .py. A path is the complete address to an item.', pt: 'Uma pasta organiza itens. Um arquivo guarda informações. A extensão depois do ponto identifica o tipo do arquivo. Arquivos Python terminam em .py. Um caminho é o endereço completo de um item.' },
    alternate: { en: 'Think of a filing cabinet: the folder is a drawer, the file is a sheet inside it, and .py is the colored label saying “Python”.', pt: 'Pense em um arquivo físico: a pasta é uma gaveta, o arquivo é uma folha dentro dela e .py é a etiqueta colorida dizendo “Python”.' },
  },
  {
    id: 'downloads', icon: '⬇️',
    title: { en: 'Downloads and safe installation', pt: 'Downloads e instalação segura' },
    goal: { en: 'Understand what happens between clicking Download and opening an app.', pt: 'Entender o que acontece entre clicar em Baixar e abrir um aplicativo.' },
    explanation: { en: 'Downloading copies an installer to your device. Opening it starts a guided installation. Read each screen, keep the official source, and verify the app after installation.', pt: 'Fazer download copia um instalador para o seu dispositivo. Abrir o arquivo inicia uma instalação guiada. Leia cada tela, use a fonte oficial e verifique o aplicativo depois da instalação.' },
    alternate: { en: 'A download is a delivery. The installer is the unopened package. Installation is unpacking and putting the tool in the correct place.', pt: 'Um download é uma entrega. O instalador é a caixa fechada. Instalar é abrir a caixa e colocar a ferramenta no lugar correto.' },
  },
  {
    id: 'local-cloud', icon: '☁️',
    title: { en: 'Local computer versus cloud', pt: 'Computador local versus nuvem' },
    goal: { en: 'Know where data lives and whether internet is required.', pt: 'Saber onde os dados estão e se a internet é necessária.' },
    explanation: { en: 'Local means your own device. Cloud means another computer reached through the internet. OneDrive can synchronize a local folder with a cloud copy, so the same item may have both roles.', pt: 'Local significa seu próprio dispositivo. Nuvem significa outro computador acessado pela internet. O OneDrive pode sincronizar uma pasta local com uma cópia na nuvem, então o mesmo item pode ter os dois papéis.' },
    alternate: { en: 'Local is your kitchen. Cloud is a storage unit you reach by road. Synchronization keeps matching boxes in both places.', pt: 'Local é sua cozinha. Nuvem é um depósito que você acessa pela estrada. Sincronização mantém caixas iguais nos dois lugares.' },
  },
  {
    id: 'terminal', icon: '⌨️',
    title: { en: 'The terminal without fear', pt: 'O terminal sem medo' },
    goal: { en: 'Read a prompt, enter one command and understand the response.', pt: 'Ler o prompt, inserir um comando e entender a resposta.' },
    explanation: { en: 'The terminal is a text interface. The prompt shows the current folder. A command asks the computer to perform one precise action. Start with harmless commands that show information.', pt: 'O terminal é uma interface de texto. O prompt mostra a pasta atual. Um comando pede ao computador uma ação precisa. Comece com comandos seguros que apenas exibem informações.' },
    alternate: { en: 'It is a chat with strict grammar: you type an exact request, press Enter, and the computer answers with text.', pt: 'É uma conversa com gramática rígida: você digita um pedido exato, pressiona Enter e o computador responde com texto.' },
  },
  {
    id: 'hardware', icon: '🧠',
    title: { en: 'CPU, RAM, storage and GPU', pt: 'CPU, RAM, armazenamento e GPU' },
    goal: { en: 'Understand the four resources that determine what your computer can run.', pt: 'Entender os quatro recursos que determinam o que seu computador consegue executar.' },
    explanation: { en: 'CPU executes general instructions. RAM holds temporary working data. Storage keeps files long term. GPU performs many parallel calculations and becomes important for larger AI models.', pt: 'A CPU executa instruções gerais. A RAM guarda dados temporários de trabalho. O armazenamento mantém arquivos a longo prazo. A GPU faz muitos cálculos em paralelo e se torna importante para modelos maiores de IA.' },
    alternate: { en: 'CPU is the worker, RAM is the workbench, storage is the warehouse, and GPU is a team of workers doing similar calculations together.', pt: 'CPU é o trabalhador, RAM é a bancada, armazenamento é o depósito e GPU é uma equipe fazendo cálculos parecidos ao mesmo tempo.' },
  },
]

export const BASE_ZERO_READINESS = [
  { question: { en: 'Which filename is a Python program?', pt: 'Qual nome identifica um programa Python?' }, options: ['programa.txt', 'programa.py', 'programa.zip'], correct: 1 },
  { question: { en: 'Where do files stay after the computer turns off?', pt: 'Onde os arquivos permanecem depois que o computador desliga?' }, options: ['RAM', 'Storage / SSD', 'CPU'], correct: 1 },
  { question: { en: 'What does downloading do?', pt: 'O que fazer download significa?' }, options: ['Copies data to your device', 'Deletes a website', 'Turns off the internet'], correct: 0 },
  { question: { en: 'Which one is a cloud service?', pt: 'Qual é um serviço de nuvem?' }, options: ['Google Drive', 'The Downloads folder only', 'RAM'], correct: 0 },
  { question: { en: 'What is the terminal?', pt: 'O que é o terminal?' }, options: ['A text interface for commands', 'A type of image', 'A computer cable'], correct: 0 },
]
