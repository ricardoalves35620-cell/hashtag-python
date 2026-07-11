import type { Bilingual, Lang } from './types'

export interface GlossaryEntry {
  id: string
  term: Bilingual
  aliases: Bilingual
  definition: Bilingual
  example?: Bilingual
}

export const GLOSSARY: GlossaryEntry[] = [
  { id: 'file', term: { en: 'file', pt: 'arquivo' }, aliases: { en: 'file|files', pt: 'arquivo|arquivos' }, definition: { en: 'A named container that stores information, such as text, images or Python code.', pt: 'Um recipiente com nome que guarda informações, como texto, imagens ou código Python.' }, example: { en: 'budget.csv and app.py are files.', pt: 'orcamento.csv e app.py são arquivos.' } },
  { id: 'folder', term: { en: 'folder', pt: 'pasta' }, aliases: { en: 'folder|folders|directory|directories', pt: 'pasta|pastas|diretório|diretórios' }, definition: { en: 'A container used to organize files and other folders.', pt: 'Um recipiente usado para organizar arquivos e outras pastas.' } },
  { id: 'extension', term: { en: 'extension', pt: 'extensão' }, aliases: { en: 'extension|file extension', pt: 'extensão|extensão de arquivo' }, definition: { en: 'The ending after the final dot in a filename. It tells the computer what kind of file it is.', pt: 'A parte depois do último ponto no nome do arquivo. Ela indica ao computador qual é o tipo do arquivo.' }, example: { en: '.py identifies a Python file.', pt: '.py identifica um arquivo Python.' } },
  { id: 'browser', term: { en: 'browser', pt: 'navegador' }, aliases: { en: 'browser|web browser', pt: 'navegador|navegador de internet' }, definition: { en: 'An app used to open websites, such as Chrome, Edge, Firefox or Safari.', pt: 'Um aplicativo usado para abrir sites, como Chrome, Edge, Firefox ou Safari.' } },
  { id: 'application', term: { en: 'application', pt: 'aplicativo' }, aliases: { en: 'application|app|apps', pt: 'aplicativo|aplicativos|programa|programas' }, definition: { en: 'Software installed or opened to perform a task.', pt: 'Software instalado ou aberto para realizar uma tarefa.' } },
  { id: 'cloud', term: { en: 'cloud', pt: 'nuvem' }, aliases: { en: 'cloud|online storage', pt: 'nuvem|armazenamento online' }, definition: { en: 'Computers on the internet that store or process your data for you.', pt: 'Computadores na internet que guardam ou processam seus dados para você.' } },
  { id: 'local', term: { en: 'local', pt: 'local' }, aliases: { en: 'local|locally', pt: 'local|localmente' }, definition: { en: 'Something stored or executed on your own device instead of a remote internet service.', pt: 'Algo armazenado ou executado no seu próprio dispositivo, em vez de um serviço remoto na internet.' } },
  { id: 'download', term: { en: 'download', pt: 'download' }, aliases: { en: 'download|downloads|downloaded', pt: 'download|downloads|baixar|baixado' }, definition: { en: 'Copying data from the internet to your device.', pt: 'Copiar dados da internet para o seu dispositivo.' } },
  { id: 'zip', term: { en: 'ZIP', pt: 'ZIP' }, aliases: { en: 'zip|compressed file', pt: 'zip|arquivo compactado' }, definition: { en: 'A compressed package that can contain many files and folders.', pt: 'Um pacote compactado que pode conter vários arquivos e pastas.' } },
  { id: 'terminal', term: { en: 'terminal', pt: 'terminal' }, aliases: { en: 'terminal|command line|console', pt: 'terminal|linha de comando|console' }, definition: { en: 'A text interface where you give precise commands to the computer.', pt: 'Uma interface de texto onde você fornece comandos precisos ao computador.' } },
  { id: 'path', term: { en: 'path', pt: 'caminho' }, aliases: { en: 'path|file path', pt: 'caminho|caminho do arquivo' }, definition: { en: 'The address that tells the computer where a file or folder is located.', pt: 'O endereço que informa ao computador onde um arquivo ou pasta está localizado.' } },
  { id: 'cpu', term: { en: 'CPU', pt: 'CPU' }, aliases: { en: 'cpu|processor', pt: 'cpu|processador' }, definition: { en: 'The main processor that executes instructions and calculations.', pt: 'O processador principal que executa instruções e cálculos.' } },
  { id: 'ram', term: { en: 'RAM', pt: 'RAM' }, aliases: { en: 'ram|memory', pt: 'ram|memória' }, definition: { en: 'Fast temporary working space used by open programs. It is cleared when the computer turns off.', pt: 'Espaço de trabalho rápido e temporário usado pelos programas abertos. É apagado quando o computador desliga.' } },
  { id: 'storage', term: { en: 'storage', pt: 'armazenamento' }, aliases: { en: 'storage|ssd|hard drive|disk', pt: 'armazenamento|ssd|disco rígido|disco' }, definition: { en: 'Long-term space where files remain after the computer turns off.', pt: 'Espaço de longo prazo onde os arquivos permanecem depois que o computador desliga.' } },
  { id: 'gpu', term: { en: 'GPU', pt: 'GPU' }, aliases: { en: 'gpu|graphics card', pt: 'gpu|placa de vídeo' }, definition: { en: 'A processor specialized in doing many calculations in parallel, useful for graphics and AI.', pt: 'Um processador especializado em fazer muitos cálculos em paralelo, útil para gráficos e IA.' } },
  { id: 'variable', term: { en: 'variable', pt: 'variável' }, aliases: { en: 'variable|variables', pt: 'variável|variáveis' }, definition: { en: 'A name that points to a value your program can use or change.', pt: 'Um nome que aponta para um valor que o programa pode usar ou alterar.' }, example: { en: 'age = 32 stores 32 under the name age.', pt: 'idade = 32 guarda 32 com o nome idade.' } },
  { id: 'string', term: { en: 'string', pt: 'texto' }, aliases: { en: 'string|strings', pt: 'string|strings|texto|textos' }, definition: { en: 'A sequence of characters, usually written between quotes.', pt: 'Uma sequência de caracteres, normalmente escrita entre aspas.' } },
  { id: 'boolean', term: { en: 'boolean', pt: 'booleano' }, aliases: { en: 'boolean|bool', pt: 'booleano|bool' }, definition: { en: 'A value that is either True or False.', pt: 'Um valor que é True ou False.' } },
  { id: 'condition', term: { en: 'condition', pt: 'condição' }, aliases: { en: 'condition|conditional|if statement', pt: 'condição|condicional|estrutura if' }, definition: { en: 'A test that decides which block of code should run.', pt: 'Um teste que decide qual bloco de código deve executar.' } },
  { id: 'loop', term: { en: 'loop', pt: 'laço' }, aliases: { en: 'loop|loops|iteration', pt: 'laço|laços|loop|loops|repetição' }, definition: { en: 'A structure that repeats instructions.', pt: 'Uma estrutura que repete instruções.' } },
  { id: 'function', term: { en: 'function', pt: 'função' }, aliases: { en: 'function|functions', pt: 'função|funções' }, definition: { en: 'A named reusable block of instructions that may receive inputs and return a result.', pt: 'Um bloco reutilizável de instruções que pode receber entradas e devolver um resultado.' } },
  { id: 'python', term: { en: 'Python', pt: 'Python' }, aliases: { en: 'python', pt: 'python' }, definition: { en: 'A programming language designed to be readable and useful in automation, web, data and AI.', pt: 'Uma linguagem de programação criada para ser legível e útil em automação, web, dados e IA.' } },
]

export function getGlossaryEntry(id: string) {
  return GLOSSARY.find(entry => entry.id === id)
}

export function glossaryAliases(lang: Lang) {
  return GLOSSARY.flatMap(entry => entry.aliases[lang].split('|').map(alias => ({ alias, entry })))
    .sort((a, b) => b.alias.length - a.alias.length)
}
