import type { Bilingual, CodeRequirement, Exercise, LessonBlock, Phase, TestCase } from '../types'

const b = (en: string, pt: string): Bilingual => ({ en, pt })
const heading = (en: string, pt: string): LessonBlock => ({ type: 'heading', content: b(en, pt) })
const text = (en: string, pt: string): LessonBlock => ({ type: 'text', content: b(en, pt) })
const code = (en: string, pt: string): LessonBlock => ({ type: 'code', code: b(en, pt), language: 'python' })
const warning = (en: string, pt: string): LessonBlock => ({ type: 'warning', content: b(en, pt) })
const tip = (en: string, pt: string): LessonBlock => ({ type: 'tip', content: b(en, pt) })

function exactTest(
  id: string,
  description: Bilingual,
  afterCode: string,
  expected: Bilingual,
  points: number,
  requirements: CodeRequirement[],
  hidden = false,
): TestCase {
  return {
    id,
    description,
    expectedOutput: expected,
    inputs: [],
    afterCode,
    checks: [
      { type: 'no_error' },
      { type: 'equals_any', value: Array.from(new Set([expected.en, expected.pt])), target: 'test_output', textMode: 'normalized' },
    ],
    points,
    hidden,
    codeRequirements: requirements,
  }
}

function makeExercise(config: {
  id: string
  title: Bilingual
  description: Bilingual
  starterCode: string
  sampleOutput: Bilingual
  hints: Bilingual[]
  requirements: CodeRequirement[]
  tests: [TestCase, TestCase]
  difficulty: Exercise['difficulty']
  objective: Bilingual
  workplaceContext: Bilingual
  successCriteria: { en: string[]; pt: string[] }
  commonMistakes: { en: string[]; pt: string[] }
}): Exercise {
  return {
    id: config.id,
    title: config.title,
    description: config.description,
    starterCode: config.starterCode,
    hints: config.hints,
    sampleOutput: config.sampleOutput,
    grading: { tests: config.tests, codeRequirements: config.requirements, timeoutMs: 4000 },
    objective: config.objective,
    difficulty: config.difficulty,
    estimatedMinutes: config.difficulty === 'guided' ? 14 : config.difficulty === 'challenge' ? 32 : 22,
    skillIds: [],
    successCriteria: config.successCriteria,
    commonMistakes: config.commonMistakes,
    workplaceContext: config.workplaceContext,
  }
}

const success = {
  en: [
    'Return the requested value instead of printing inside the required function.',
    'Pass both the visible case and a hidden case from a different input class.',
    'Validate malformed, empty, negative or accented external data as required.',
    'Use the requested Python construct so the solution generalizes beyond the sample.',
  ],
  pt: [
    'Retorne o valor solicitado em vez de imprimir dentro da função exigida.',
    'Passe o caso visível e um caso oculto de outra classe de entrada.',
    'Valide dados externos malformados, vazios, negativos ou acentuados conforme exigido.',
    'Use a construção Python solicitada para a solução generalizar além do exemplo.',
  ],
}

const phase17Blocks: LessonBlock[] = [
  heading('🌍 World hook — production data often arrives as files', '🌍 Gancho do mundo real — dados de produção frequentemente chegam como arquivos'),
  text(
    'A restaurant receives a supplier inventory file before opening. A school exports attendance records at the end of the day. A laboratory stores sensor measurements in text logs, and an online store receives shipment manifests from partners. In every case, the program must open an external file, understand its structure and convert text into trustworthy Python values. Reading a file is not just obtaining characters; it is the first step of a data pipeline that can influence stock, schedules, reports and customer decisions.',
    'Um restaurante recebe um arquivo de estoque do fornecedor antes de abrir. Uma escola exporta registros de presença no fim do dia. Um laboratório armazena medições de sensores em logs de texto e uma loja virtual recebe manifestos de remessa de parceiros. Em todos os casos, o programa precisa abrir um arquivo externo, entender sua estrutura e converter texto em valores Python confiáveis. Ler um arquivo não é apenas obter caracteres; é a primeira etapa de um pipeline que pode influenciar estoque, agendas, relatórios e decisões para clientes.',
  ),
  text(
    'Files are persistent boundaries. Variables disappear when the program stops, but a file remains on disk and may have been created by another system, person or operating system. That means your code cannot assume every line is perfect. Blank lines, unexpected separators, accents, large files and malformed records are normal production conditions. Professional file reading combines resource safety, explicit encoding, validation and useful error messages instead of hoping the input resembles the happy-path example.',
    'Arquivos são fronteiras persistentes. Variáveis desaparecem quando o programa termina, mas um arquivo permanece no disco e pode ter sido criado por outro sistema, pessoa ou sistema operacional. Isso significa que seu código não pode presumir que toda linha está perfeita. Linhas vazias, separadores inesperados, acentos, arquivos grandes e registros malformados são condições normais de produção. Leitura profissional combina segurança de recurso, codificação explícita, validação e mensagens úteis em vez de esperar que a entrada se pareça com o exemplo ideal.',
  ),
  heading('🧩 Physical analogy — checking out a folder from an archive', '🧩 Analogia física — retirar uma pasta de um arquivo físico'),
  text(
    'Imagine an archive room where each folder has a path on a shelf. You identify the folder, sign it out, read what you need and return it before leaving. open() locates and opens the folder. The with block is the sign-out procedure that guarantees the folder is returned even if you discover a damaged page and stop early. The file object is your temporary handle, while read(), readline() and iteration are different ways to inspect its contents.',
    'Imagine uma sala de arquivos em que cada pasta possui um caminho na estante. Você identifica a pasta, registra a retirada, lê o necessário e devolve antes de sair. open() localiza e abre a pasta. O bloco with é o procedimento que garante a devolução mesmo se você encontrar uma página danificada e parar cedo. O objeto de arquivo é sua alça temporária, enquanto read(), readline() e iteração são formas diferentes de examinar o conteúdo.',
  ),
  text(
    'The analogy also explains why a path is not the file content. A label such as reports/july.txt tells Python where to look; it does not contain the report itself. Relative paths start from the program current working directory, while absolute paths start from the root of the file system. Many beginner bugs come from running the same script from another folder and unintentionally changing what a relative path means. A clear program either constructs paths deliberately or documents where it expects to run.',
    'A analogia também explica por que um caminho não é o conteúdo. Um rótulo como relatorios/julho.txt informa onde procurar; ele não contém o relatório. Caminhos relativos começam no diretório de trabalho atual, enquanto caminhos absolutos começam na raiz do sistema. Muitos erros de iniciantes surgem ao executar o mesmo script de outra pasta e alterar sem perceber o significado do caminho relativo. Um programa claro constrói caminhos conscientemente ou documenta de onde espera ser executado.',
  ),
  heading('🐍 Fundamentals 1 — open safely and choose an encoding', '🐍 Fundamentos 1 — abra com segurança e escolha a codificação'),
  code(
    'from pathlib import Path\n\npath = Path("/tmp/menu.txt")\npath.write_text("coffee\\ntea\\ncafé\\n", encoding="utf-8")\n\nwith path.open("r", encoding="utf-8") as file:\n    content = file.read()\n\nprint(content)',
    'from pathlib import Path\n\ncaminho = Path("/tmp/cardapio.txt")\ncaminho.write_text("café\\nchá\\nsuco\\n", encoding="utf-8")\n\nwith caminho.open("r", encoding="utf-8") as arquivo:\n    conteudo = arquivo.read()\n\nprint(conteudo)',
  ),
  text(
    'Mode r means read. If the path does not exist, Python raises FileNotFoundError instead of silently creating an empty file. encoding="utf-8" makes character interpretation explicit and protects names such as João, café and ação. The with statement calls the file cleanup logic automatically. Even when parsing raises an exception, the operating-system resource is released correctly. This is why with open(...) is the default pattern rather than manually remembering file.close().',
    'O modo r significa leitura. Se o caminho não existir, Python gera FileNotFoundError em vez de criar silenciosamente um arquivo vazio. encoding="utf-8" torna explícita a interpretação dos caracteres e protege nomes como João, café e ação. O with chama automaticamente a limpeza do arquivo. Mesmo quando o parser gera exceção, o recurso do sistema operacional é liberado corretamente. Por isso with open(...) é o padrão, em vez de depender da memória para chamar file.close().',
  ),
  heading('🐍 Fundamentals 2 — read all content or stream line by line', '🐍 Fundamentos 2 — leia tudo ou processe linha por linha'),
  code(
    'with open("/tmp/menu.txt", "r", encoding="utf-8") as file:\n    for line_number, raw_line in enumerate(file, start=1):\n        line = raw_line.strip()\n        if not line:\n            continue\n        print(line_number, line)',
    'with open("/tmp/cardapio.txt", "r", encoding="utf-8") as arquivo:\n    for numero_linha, linha_bruta in enumerate(arquivo, start=1):\n        linha = linha_bruta.strip()\n        if not linha:\n            continue\n        print(numero_linha, linha)',
  ),
  text(
    'read() loads the entire remaining file into one string and is convenient for small configuration files or JSON documents. Iterating over the file streams one line at a time and uses bounded memory, which is safer for logs containing millions of rows. strip() removes surrounding whitespace, including the newline. Do not call strip() blindly when leading or trailing spaces are meaningful data; choose rstrip("\\n") when you only intend to remove line endings.',
    'read() carrega todo o restante do arquivo em uma string e é conveniente para configurações pequenas ou documentos JSON. Iterar sobre o arquivo transmite uma linha por vez e usa memória limitada, o que é mais seguro para logs com milhões de registros. strip() remove espaços ao redor, inclusive a quebra. Não use strip() automaticamente quando espaços iniciais ou finais forem dados importantes; prefira rstrip("\\n") quando quiser remover apenas a quebra de linha.',
  ),
  heading('🐍 Fundamentals 3 — separate loading from parsing', '🐍 Fundamentos 3 — separe carregamento de interpretação'),
  code(
    'def read_text(path):\n    with open(path, "r", encoding="utf-8") as file:\n        return file.read()\n\n\ndef parse_stock(text):\n    records = []\n    for number, raw_line in enumerate(text.splitlines(), start=1):\n        if not raw_line.strip():\n            continue\n        parts = [part.strip() for part in raw_line.split("|")]\n        if len(parts) != 3:\n            raise ValueError(f"invalid stock line {number}")\n        sku, name, quantity_text = parts\n        records.append({"sku": sku, "name": name, "quantity": int(quantity_text)})\n    return records',
    'def ler_texto(caminho):\n    with open(caminho, "r", encoding="utf-8") as arquivo:\n        return arquivo.read()\n\n\ndef interpretar_estoque(texto):\n    registros = []\n    for numero, linha_bruta in enumerate(texto.splitlines(), start=1):\n        if not linha_bruta.strip():\n            continue\n        partes = [parte.strip() for parte in linha_bruta.split("|")]\n        if len(partes) != 3:\n            raise ValueError(f"invalid stock line {numero}")\n        sku, nome, quantidade_texto = partes\n        registros.append({"sku": sku, "name": nome, "quantity": int(quantidade_texto)})\n    return registros',
  ),
  text(
    'Separating input/output from parsing creates two smaller contracts. read_text is responsible only for obtaining Unicode text. parse_stock can be tested with an ordinary string, so most tests do not need to create files. This pattern makes failures easier to locate: FileNotFoundError belongs to loading, while a ValueError naming a line belongs to parsing. It also lets the same parser consume text downloaded from an API, received from an upload or pasted by a user later.',
    'Separar entrada e saída do parsing cria dois contratos menores. ler_texto cuida apenas de obter texto Unicode. interpretar_estoque pode ser testada com string comum, então a maioria dos testes não precisa criar arquivos. Isso facilita localizar falhas: FileNotFoundError pertence ao carregamento, enquanto ValueError citando linha pertence à interpretação. O mesmo parser também poderá consumir texto baixado de API, recebido por upload ou colado por usuário.',
  ),
  heading('🐍 Fundamentals 4 — validate fields, types and boundaries', '🐍 Fundamentos 4 — valide campos, tipos e limites'),
  code(
    'def parse_quantity(value, line_number):\n    try:\n        quantity = int(value)\n    except ValueError as error:\n        raise ValueError(f"line {line_number}: quantity must be an integer") from error\n    if quantity < 0:\n        raise ValueError(f"line {line_number}: negative quantity")\n    return quantity',
    'def interpretar_quantidade(valor, numero_linha):\n    try:\n        quantidade = int(valor)\n    except ValueError as erro:\n        raise ValueError(f"line {numero_linha}: quantity must be an integer") from erro\n    if quantidade < 0:\n        raise ValueError(f"line {numero_linha}: negative quantity")\n    return quantidade',
  ),
  text(
    'int() already detects invalid numeric text, but its raw message may not identify which record failed. Catch the conversion error only where you can add useful context, then chain the original exception with from error. Validate domain rules separately: -2 is a valid integer but an invalid stock quantity. Avoid one broad except Exception block because it can hide programming mistakes such as a misspelled variable and make corrupt imports appear successful.',
    'int() já detecta texto numérico inválido, mas a mensagem bruta pode não identificar o registro. Capture o erro de conversão apenas onde puder acrescentar contexto útil e encadeie a exceção original com from erro. Valide regras de domínio separadamente: -2 é inteiro válido, mas estoque inválido. Evite except Exception amplo, pois ele pode esconder erros como variável digitada errado e fazer importações corrompidas parecerem bem-sucedidas.',
  ),
  heading('🏗️ Real scenario 1 — restaurant receiving manifest', '🏗️ Cenário real 1 — manifesto de recebimento de restaurante'),
  code(
    'def load_ingredients(path):\n    ingredients = []\n    with open(path, "r", encoding="utf-8") as file:\n        for line_number, raw_line in enumerate(file, start=1):\n            line = raw_line.strip()\n            if not line:\n                continue\n            parts = [part.strip() for part in line.split(";")]\n            if len(parts) != 3:\n                raise ValueError(f"invalid ingredient line {line_number}")\n            name, unit, amount_text = parts\n            amount = float(amount_text)\n            if amount < 0:\n                raise ValueError(f"negative amount on line {line_number}")\n            ingredients.append({"name": name, "unit": unit, "amount": amount})\n    return ingredients',
    'def carregar_ingredientes(caminho):\n    ingredientes = []\n    with open(caminho, "r", encoding="utf-8") as arquivo:\n        for numero_linha, linha_bruta in enumerate(arquivo, start=1):\n            linha = linha_bruta.strip()\n            if not linha:\n                continue\n            partes = [parte.strip() for parte in linha.split(";")]\n            if len(partes) != 3:\n                raise ValueError(f"invalid ingredient line {numero_linha}")\n            nome, unidade, quantidade_texto = partes\n            quantidade = float(quantidade_texto)\n            if quantidade < 0:\n                raise ValueError(f"negative amount on line {numero_linha}")\n            ingredientes.append({"name": nome, "unit": unidade, "amount": quantidade})\n    return ingredientes',
  ),
  text(
    'The receiving file is external evidence, not trusted Python data. The loader skips harmless blank lines but rejects records with the wrong number of columns or impossible negative amounts. It preserves accented ingredient names by using UTF-8 and returns structured dictionaries that later functions can total, compare or store. Notice that the function does not print; callers decide whether to show a table, update inventory, create a purchase request or produce an alert.',
    'O arquivo de recebimento é evidência externa, não dado Python confiável. O carregador ignora linhas vazias inofensivas, mas rejeita registros com número errado de colunas ou quantidades negativas impossíveis. Ele preserva nomes acentuados com UTF-8 e retorna dicionários estruturados que outras funções podem somar, comparar ou armazenar. A função não imprime; quem chama decide mostrar tabela, atualizar estoque, criar compra ou gerar alerta.',
  ),
  heading('🏗️ Real scenario 2 — scientific sensor log', '🏗️ Cenário real 2 — log de sensores científicos'),
  code(
    'def load_temperatures(path):\n    readings = []\n    with open(path, "r", encoding="utf-8") as file:\n        for line_number, raw_line in enumerate(file, start=1):\n            line = raw_line.strip()\n            if not line or line.startswith("#"):\n                continue\n            timestamp, value_text = [part.strip() for part in line.split(",", maxsplit=1)]\n            value = float(value_text)\n            if not -100 <= value <= 100:\n                raise ValueError(f"temperature out of range on line {line_number}")\n            readings.append((timestamp, value))\n    return readings',
    'def carregar_temperaturas(caminho):\n    leituras = []\n    with open(caminho, "r", encoding="utf-8") as arquivo:\n        for numero_linha, linha_bruta in enumerate(arquivo, start=1):\n            linha = linha_bruta.strip()\n            if not linha or linha.startswith("#"):\n                continue\n            instante, valor_texto = [parte.strip() for parte in linha.split(",", maxsplit=1)]\n            valor = float(valor_texto)\n            if not -100 <= valor <= 100:\n                raise ValueError(f"temperature out of range on line {numero_linha}")\n            leituras.append((instante, valor))\n    return leituras',
  ),
  text(
    'Logs often include comments or metadata lines. Here a line beginning with # is intentionally ignored, while every data row must have a timestamp and numeric value. maxsplit=1 avoids splitting more fields than the contract defines. The range check detects a sensor or format problem early. A robust reader defines what is ignored, what is accepted and what stops processing; ambiguity is the enemy of reliable ingestion and reproducible science.',
    'Logs frequentemente incluem comentários ou metadados. Aqui uma linha iniciada por # é ignorada de propósito, enquanto cada dado precisa de instante e valor numérico. maxsplit=1 evita dividir mais campos que o contrato define. A verificação de faixa detecta cedo problema de sensor ou formato. Um leitor robusto define o que ignora, aceita e interrompe; ambiguidade é inimiga de ingestão confiável e ciência reproduzível.',
  ),
  heading('⚠️ Common errors and the real Python messages', '⚠️ Erros comuns e as mensagens reais do Python'),
  warning(
    'FileNotFoundError means the resolved path does not exist. UnicodeDecodeError means the selected encoding cannot decode the bytes. ValueError commonly appears when int(), float() or your parser rejects malformed content. IndexError from parts[3] means you accessed a column before verifying the number of fields. PermissionError means the process cannot read that location. Fix the cause; do not replace these errors with an empty except that pretends the file was valid.',
    'FileNotFoundError significa que o caminho resolvido não existe. UnicodeDecodeError indica que a codificação não decodifica os bytes. ValueError aparece quando int(), float() ou seu parser rejeita conteúdo malformado. IndexError em parts[3] significa acesso antes de verificar campos. PermissionError indica falta de acesso ao local. Corrija a causa; não substitua esses erros por except vazio que finge que o arquivo era válido.',
  ),
  text(
    'Another common mistake is calling read() and then attempting to iterate over the same file object. After read(), the cursor is at the end, so the loop sees no lines. Either choose one strategy or call seek(0) deliberately. Also avoid using an open file as a global variable. Open the resource near the operation that needs it and return ordinary Python data so the rest of the program remains independent of the handle and easy to test.',
    'Outro erro comum é chamar read() e depois tentar iterar no mesmo objeto. Após read(), o cursor está no fim e o loop não encontra linhas. Escolha uma estratégia ou use seek(0) conscientemente. Evite também arquivo aberto como variável global. Abra o recurso perto da operação que precisa dele e retorne dados Python comuns para que o restante fique independente da alça e fácil de testar.',
  ),
  tip(
    '💡 Pro tip — treat every file format as an explicit contract. Document the separator, encoding, header policy, blank-line policy, required fields and error behavior. Keep loading, parsing and business calculation in separate functions. This makes tests fast, errors precise and future migrations to CSV, JSON or a database much easier.',
    '💡 Dica pro — trate todo formato como contrato explícito. Documente separador, codificação, cabeçalho, política de linhas vazias, campos obrigatórios e comportamento de erro. Separe carregamento, parsing e cálculo de negócio. Isso torna testes rápidos, erros precisos e futuras migrações para CSV, JSON ou banco muito mais fáceis.',
  ),
  heading('📋 Recap and bridge to the next phase', '📋 Resumo e ponte para a próxima fase'),
  text(
    'You can now open UTF-8 files safely, choose between whole-file and streamed reading, remove only the whitespace you intend to remove, validate external records and separate input/output from parsing. The next phase reverses the direction: your program will create durable reports and exports. Reading protects the boundary coming into your program; writing must protect the data leaving it.',
    'Agora você sabe abrir arquivos UTF-8 com segurança, escolher leitura integral ou por fluxo, remover apenas os espaços desejados, validar registros externos e separar entrada e saída do parsing. A próxima fase inverte a direção: o programa criará relatórios e exportações duráveis. A leitura protege a fronteira de entrada; a escrita deverá proteger os dados de saída.',
  ),
]

const p17MeaningfulRequirements: CodeRequirement[] = [
  { kind: 'function', value: 'meaningful_lines' },
  { kind: 'call', value: 'splitlines' },
  { kind: 'node', value: 'Return' },
]
const p17ParseRequirements: CodeRequirement[] = [
  { kind: 'function', value: 'parse_stock' },
  { kind: 'call', value: 'split' },
  { kind: 'call', value: 'int' },
  { kind: 'node', value: 'Return' },
]
const p17ReadRequirements: CodeRequirement[] = [
  { kind: 'function', value: 'read_nonempty' },
  { kind: 'call', value: 'open' },
  { kind: 'node', value: 'With' },
  { kind: 'node', value: 'Return' },
]
const p17TaskRequirements: CodeRequirement[] = [
  { kind: 'function', value: 'load_tasks' },
  { kind: 'call', value: 'open' },
  { kind: 'call', value: 'split' },
  { kind: 'node', value: 'Raise' },
  { kind: 'node', value: 'Return' },
]

export const phase17: Phase = {
  id: 17,
  title: b('Reading Files', 'Lendo Arquivos'),
  description: b('Read UTF-8 files safely, stream large inputs and validate external records.', 'Leia arquivos UTF-8 com segurança, processe entradas grandes e valide registros externos.'),
  icon: '📂',
  libraries: [],
  track: 'core',
  stage: 'base',
  estimatedHours: 8,
  lesson: { title: b('Reading files: safe boundaries for real data', 'Leitura de arquivos: fronteiras seguras para dados reais'), blocks: phase17Blocks },
  exercises: [
    makeExercise({
      id: 'p17-guided',
      title: b('Guided — clean meaningful lines', 'Guiado — limpe linhas significativas'),
      description: b('Implement meaningful_lines(text). Return stripped, non-empty lines in their original order.', 'Implemente meaningful_lines(text). Retorne linhas sem espaços externos e não vazias na ordem original.'),
      starterCode: 'def meaningful_lines(text):\n    # Use splitlines(), strip() and a list comprehension.\n    pass',
      sampleOutput: b("['rice', 'beans', 'café']", "['rice', 'beans', 'café']"),
      hints: [b('splitlines() understands different line endings.', 'splitlines() entende diferentes quebras de linha.'), b('Keep a line only when line.strip() is not empty.', 'Mantenha a linha apenas quando line.strip() não estiver vazio.')],
      requirements: p17MeaningfulRequirements,
      tests: [
        exactTest('p17-guided-public', b('Cleans ordinary and accented lines', 'Limpa linhas comuns e acentuadas'), 'print(meaningful_lines(" rice \\n\\nbeans\\ncafé "))', b("['rice', 'beans', 'café']", "['rice', 'beans', 'café']"), 60, p17MeaningfulRequirements),
        exactTest('p17-guided-hidden', b('Handles an empty document', 'Trata documento vazio'), 'print(meaningful_lines(""))', b('[]', '[]'), 40, p17MeaningfulRequirements, true),
      ],
      difficulty: 'guided',
      objective: b('Transform raw multiline text into a clean list before parsing records.', 'Transforme texto bruto em lista limpa antes de interpretar registros.'),
      workplaceContext: b('Import tools routinely remove harmless blank rows before validating business fields.', 'Ferramentas de importação removem linhas vazias inofensivas antes de validar campos.'),
      successCriteria: success,
      commonMistakes: { en: ['Returning raw newline characters.', 'Removing internal spaces that belong to data.', 'Printing the list instead of returning it.'], pt: ['Retornar quebras brutas.', 'Remover espaços internos que pertencem aos dados.', 'Imprimir a lista em vez de retornar.'] },
    }),
    makeExercise({
      id: 'p17-complete',
      title: b('Complete — parse a stock document', 'Complete — interprete um documento de estoque'),
      description: b('Complete parse_stock(text). Each non-empty row is sku|name|quantity. Return dictionaries and reject negative quantities.', 'Complete parse_stock(text). Cada linha não vazia é sku|name|quantity. Retorne dicionários e rejeite quantidades negativas.'),
      starterCode: 'def parse_stock(text):\n    records = []\n    for raw_line in text.splitlines():\n        if not raw_line.strip():\n            continue\n        sku, name, quantity_text = [part.strip() for part in raw_line.split("|")]\n        quantity = int(quantity_text)\n        # Validate and append the normalized record.\n    return records',
      sampleOutput: b("[{'sku': 'A1', 'name': 'Café', 'quantity': 3}]", "[{'sku': 'A1', 'name': 'Café', 'quantity': 3}]"),
      hints: [b('Build a dictionary with sku, name and quantity.', 'Monte dicionário com sku, name e quantity.'), b("Raise ValueError('negative quantity') when quantity < 0.", "Gere ValueError('negative quantity') quando quantity < 0.")],
      requirements: p17ParseRequirements,
      tests: [
        exactTest('p17-complete-public', b('Parses two valid records', 'Interpreta dois registros válidos'), 'print(parse_stock("A1|Café|3\\nB2|Rice|10"))', b("[{'sku': 'A1', 'name': 'Café', 'quantity': 3}, {'sku': 'B2', 'name': 'Rice', 'quantity': 10}]", "[{'sku': 'A1', 'name': 'Café', 'quantity': 3}, {'sku': 'B2', 'name': 'Rice', 'quantity': 10}]"), 60, p17ParseRequirements),
        exactTest('p17-complete-hidden', b('Rejects a negative quantity', 'Rejeita quantidade negativa'), 'try:\n    parse_stock("N1|Item|-2")\nexcept ValueError as error:\n    print(error)', b('negative quantity', 'negative quantity'), 40, [...p17ParseRequirements, { kind: 'node', value: 'Raise' }], true),
      ],
      difficulty: 'independent',
      objective: b('Convert a delimited text contract into typed Python records.', 'Converta contrato textual delimitado em registros Python tipados.'),
      workplaceContext: b('Inventory imports must reject impossible quantities before updating stock.', 'Importações precisam rejeitar quantidades impossíveis antes de atualizar estoque.'),
      successCriteria: success,
      commonMistakes: { en: ['Leaving quantity as text.', 'Accessing columns before validating the line.', 'Accepting negative inventory.'], pt: ['Deixar quantidade como texto.', 'Acessar colunas antes de validar a linha.', 'Aceitar estoque negativo.'] },
    }),
    makeExercise({
      id: 'p17-zero',
      title: b('From scratch — read non-empty lines from a path', 'Do zero — leia linhas não vazias de um caminho'),
      description: b('Create read_nonempty(path). Open the UTF-8 file with with, return stripped non-empty lines and do not print inside the function.', 'Crie read_nonempty(path). Abra o arquivo UTF-8 com with, retorne linhas limpas não vazias e não imprima dentro da função.'),
      starterCode: 'def read_nonempty(path):\n    pass',
      sampleOutput: b("['alpha', 'ação', 'omega']", "['alpha', 'ação', 'omega']"),
      hints: [b('Use open(path, "r", encoding="utf-8").', 'Use open(path, "r", encoding="utf-8").'), b('Iterate over the file object instead of assuming a small file.', 'Itere sobre o objeto em vez de presumir arquivo pequeno.')],
      requirements: p17ReadRequirements,
      tests: [
        exactTest('p17-zero-public', b('Reads a real virtual file', 'Lê arquivo virtual real'), 'path = "/tmp/p17-lines.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("alpha\\n\\nação\\nomega\\n")\nprint(read_nonempty(path))', b("['alpha', 'ação', 'omega']", "['alpha', 'ação', 'omega']"), 60, p17ReadRequirements),
        exactTest('p17-zero-hidden', b('Handles whitespace-only file', 'Trata arquivo somente com espaços'), 'path = "/tmp/p17-empty.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("  \\n\\t\\n")\nprint(read_nonempty(path))', b('[]', '[]'), 40, p17ReadRequirements, true),
      ],
      difficulty: 'independent',
      objective: b('Use the Pyodide virtual file system with the same open/with contract as desktop Python.', 'Use o sistema virtual do Pyodide com o mesmo contrato open/with do Python desktop.'),
      workplaceContext: b('The browser runtime provides a real virtual file system, so this skill transfers to desktop scripts.', 'O runtime do navegador oferece sistema virtual real, então a habilidade transfere para desktop.'),
      successCriteria: success,
      commonMistakes: { en: ['Forgetting UTF-8.', 'Returning after the first line.', 'Using a global file handle.'], pt: ['Esquecer UTF-8.', 'Retornar após a primeira linha.', 'Usar alça global.'] },
    }),
    makeExercise({
      id: 'p17-transfer',
      title: b('Challenge — load and validate prioritized tasks', 'Desafio — carregue e valide tarefas prioritárias'),
      description: b('Create load_tasks(path). Each non-empty line is title;priority. Priority must be an integer from 1 to 5. Return dictionaries sorted by priority then title.', 'Crie load_tasks(path). Cada linha não vazia é title;priority. Prioridade deve ser inteiro de 1 a 5. Retorne dicionários ordenados por prioridade e título.'),
      starterCode: 'def load_tasks(path):\n    pass',
      sampleOutput: b("[{'title': 'Deploy', 'priority': 1}, {'title': 'Revisão', 'priority': 2}]", "[{'title': 'Deploy', 'priority': 1}, {'title': 'Revisão', 'priority': 2}]"),
      hints: [b("Use split(';') and require exactly two fields.", "Use split(';') e exija exatamente dois campos."), b("Sort with key=lambda task: (task['priority'], task['title']).", "Ordene com key=lambda task: (task['priority'], task['title']).")],
      requirements: p17TaskRequirements,
      tests: [
        exactTest('p17-transfer-public', b('Loads, validates and sorts tasks', 'Carrega, valida e ordena tarefas'), 'path = "/tmp/p17-tasks.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("Revisão;2\\nDeploy;1\\n")\nprint(load_tasks(path))', b("[{'title': 'Deploy', 'priority': 1}, {'title': 'Revisão', 'priority': 2}]", "[{'title': 'Deploy', 'priority': 1}, {'title': 'Revisão', 'priority': 2}]"), 60, [...p17TaskRequirements, { kind: 'call', value: 'sorted' }]),
        exactTest('p17-transfer-hidden', b('Rejects malformed task rows', 'Rejeita linhas de tarefa malformadas'), 'path = "/tmp/p17-bad-task.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("missing-priority\\n")\ntry:\n    load_tasks(path)\nexcept ValueError as error:\n    print(error)', b('invalid task line', 'invalid task line'), 40, p17TaskRequirements, true),
      ],
      difficulty: 'challenge',
      objective: b('Build a resilient line-oriented importer with ordering and domain validation.', 'Construa importador resiliente por linhas com ordenação e validação de domínio.'),
      workplaceContext: b('Task migration tools must stop on malformed evidence instead of silently dropping work.', 'Ferramentas de migração devem parar em evidência malformada em vez de descartar trabalho.'),
      successCriteria: success,
      commonMistakes: { en: ['Silently skipping malformed records.', 'Sorting priority as text.', 'Using print as returned data.'], pt: ['Ignorar registros malformados.', 'Ordenar prioridade como texto.', 'Usar print como dado retornado.'] },
    }),
  ],
  quiz: [
    { id: 'q17-1', question: b('Why is with open(...) preferred?', 'Por que with open(...) é preferível?'), options: [b('It guarantees cleanup even when parsing fails.', 'Garante limpeza mesmo quando o parsing falha.'), b('It makes every file small.', 'Torna todo arquivo pequeno.'), b('It converts text to JSON.', 'Converte texto em JSON.'), b('It prevents validation errors.', 'Impede erros de validação.')], correctIndex: 0, explanation: b('The context manager closes the resource on normal exit and exceptions.', 'O gerenciador fecha o recurso na saída normal e em exceções.') },
    { id: 'q17-2', question: b('Which strategy uses bounded memory for a huge log?', 'Qual estratégia usa memória limitada num log enorme?'), options: [b('Call read() twice.', 'Chamar read() duas vezes.'), b('Iterate over the file object line by line.', 'Iterar no objeto linha por linha.'), b('Convert the path to a list.', 'Converter caminho em lista.'), b('Use append mode.', 'Usar modo append.')], correctIndex: 1, explanation: b('File iteration streams one line at a time.', 'A iteração transmite uma linha por vez.') },
    { id: 'q17-3', question: b('What should a parser do before accessing parts[2]?', 'O que um parser deve fazer antes de acessar parts[2]?'), options: [b('Print the raw file.', 'Imprimir arquivo bruto.'), b('Close the terminal.', 'Fechar terminal.'), b('Validate the expected number of fields.', 'Validar a quantidade esperada de campos.'), b('Change encoding to ASCII.', 'Mudar para ASCII.')], correctIndex: 2, explanation: b('Field-count validation prevents accidental IndexError and gives a clearer contract error.', 'Validar campos evita IndexError acidental e gera erro de contrato mais claro.') },
    { id: 'q17-4', question: b('Which error means a read path does not exist?', 'Qual erro significa que o caminho de leitura não existe?'), options: [b('TypeError', 'TypeError'), b('IndexError', 'IndexError'), b('UnicodeEncodeError', 'UnicodeEncodeError'), b('FileNotFoundError', 'FileNotFoundError')], correctIndex: 3, explanation: b('Read mode requires an existing path.', 'Modo de leitura exige caminho existente.') },
  ],
  exam: {
    title: b('Exam — shipment file loader', 'Exame — carregador de arquivo de remessas'),
    scenario: b('A logistics partner sends code|weight|status rows. Build load_shipments(path) that validates rows, rejects negative weight and returns a summary for active shipments.', 'Um parceiro envia linhas code|weight|status. Construa load_shipments(path), valide linhas, rejeite peso negativo e retorne resumo de remessas active.'),
    requirements: { en: ['Open the UTF-8 path with with.', 'Skip blank rows.', 'Require exactly three fields.', 'Count active rows and sum active weight.', "Return {'active': N, 'weight': total}."], pt: ['Abra caminho UTF-8 com with.', 'Ignore linhas vazias.', 'Exija três campos.', 'Conte active e some peso active.', "Retorne {'active': N, 'weight': total}."] },
    starterCode: 'def load_shipments(path):\n    pass',
    expectedOutput: b("{'active': 2, 'weight': 13.5}", "{'active': 2, 'weight': 13.5}"),
    testCases: [
      exactTest('p17-exam-visible', b('Summarizes active shipments', 'Resume remessas ativas'), 'path = "/tmp/p17-shipments.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("S1|10.5|active\\nS2|4|cancelled\\nS3|3|active\\n")\nprint(load_shipments(path))', b("{'active': 2, 'weight': 13.5}", "{'active': 2, 'weight': 13.5}"), 60, [{ kind: 'function', value: 'load_shipments' }, { kind: 'call', value: 'open' }, { kind: 'call', value: 'float' }, { kind: 'node', value: 'Return' }]),
      exactTest('p17-exam-empty', b('Handles an empty manifest', 'Trata manifesto vazio'), 'path = "/tmp/p17-no-shipments.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("")\nprint(load_shipments(path))', b("{'active': 0, 'weight': 0}", "{'active': 0, 'weight': 0}"), 20, [{ kind: 'function', value: 'load_shipments' }, { kind: 'call', value: 'open' }, { kind: 'node', value: 'Return' }], true),
      exactTest('p17-exam-hidden-hardening', b('Rejects a negative shipment weight', 'Rejeita peso negativo'), 'path = "/tmp/p17-negative.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("X|-1|active\\n")\ntry:\n    load_shipments(path)\nexcept ValueError as error:\n    print(error)', b('negative weight', 'negative weight'), 20, [{ kind: 'function', value: 'load_shipments' }, { kind: 'node', value: 'Raise' }], true),
    ],
  },
}

const phase18Blocks: LessonBlock[] = [
  heading('🌍 World hook — useful programs create durable evidence', '🌍 Gancho do mundo real — programas úteis criam evidência durável'),
  text(
    'A retail system exports a reorder report, a game stores a save file, a support platform appends an audit event and a finance tool creates a monthly summary. Console output disappears when the terminal closes, but files can be reviewed, transferred and processed later. Writing files is how a program turns an in-memory result into a durable artifact for people and other systems. The exact bytes, line endings and ordering become part of a contract that another process may depend on.',
    'Um sistema de varejo exporta reposição, um jogo salva progresso, uma plataforma de atendimento acrescenta evento de auditoria e uma ferramenta financeira cria resumo mensal. A saída do console desaparece quando o terminal fecha, mas arquivos podem ser revisados, transferidos e processados depois. Escrever arquivos transforma resultado em memória em artefato durável para pessoas e sistemas. Os bytes, quebras e ordem passam a fazer parte de um contrato do qual outro processo pode depender.',
  ),
  text(
    'Writing is more dangerous than reading because the wrong mode or path can destroy existing data. A professional writer chooses whether to replace or append, formats records deterministically, uses UTF-8, checks invalid values and, when a partially written file would be harmful, writes to a temporary path before replacing the destination atomically. The output format is an API even when the consumer is another script in the same folder.',
    'Escrever é mais perigoso que ler porque o modo ou caminho errado pode destruir dados existentes. Uma escrita profissional escolhe substituir ou acrescentar, formata registros de modo determinístico, usa UTF-8, verifica valores inválidos e, quando arquivo parcial seria prejudicial, escreve em caminho temporário antes de substituir o destino atomicamente. O formato de saída é uma API mesmo quando o consumidor é outro script na mesma pasta.',
  ),
  heading('🧩 Physical analogy — a receipt printer and a bound ledger', '🧩 Analogia física — impressora de recibo e livro encadernado'),
  text(
    'Mode w is like loading a clean sheet into a printer: previous content at that path is replaced. Mode a is like writing the next line in a bound ledger: existing entries remain and the new text goes at the end. Neither mode decides what line breaks or separators you want. file.write() writes exactly the characters you provide, so forgetting a newline is like printing every receipt on the same physical line.',
    'O modo w é como colocar folha limpa na impressora: o conteúdo anterior naquele caminho é substituído. O modo a é como escrever a próxima linha num livro encadernado: entradas existentes permanecem e o novo texto vai ao fim. Nenhum modo decide quebras ou separadores. file.write() grava exatamente os caracteres fornecidos, então esquecer a quebra é como imprimir todos os recibos na mesma linha física.',
  ),
  text(
    'Atomic replacement is like preparing a complete new page beside the official ledger, checking it and swapping it into the binder in one action. If the program crashes while preparing the temporary page, the official version remains untouched. os.replace() provides this important all-or-nothing transition on the same file system. It cannot make invalid content valid, so validation must still happen before publication.',
    'Substituição atômica é como preparar uma página nova ao lado do livro oficial, conferir e trocar em uma única ação. Se o programa falhar durante o preparo, a versão oficial permanece intacta. os.replace() fornece essa transição tudo-ou-nada no mesmo sistema de arquivos. Ele não torna conteúdo inválido válido, então a validação ainda precisa acontecer antes da publicação.',
  ),
  heading('🐍 Fundamentals 1 — write text explicitly', '🐍 Fundamentos 1 — escreva texto explicitamente'),
  code(
    'lines = ["SKU-01;coffee;12", "SKU-02;tea;8"]\n\nwith open("/tmp/reorder.txt", "w", encoding="utf-8", newline="") as file:\n    file.write("sku;item;quantity\\n")\n    for line in lines:\n        file.write(line + "\\n")',
    'linhas = ["SKU-01;café;12", "SKU-02;chá;8"]\n\nwith open("/tmp/reposicao.txt", "w", encoding="utf-8", newline="") as arquivo:\n    arquivo.write("sku;item;quantity\\n")\n    for linha in linhas:\n        arquivo.write(linha + "\\n")',
  ),
  text(
    'write() requires a string. Passing an integer raises TypeError: write() argument must be str, not int. Convert values deliberately, preferably by formatting a complete row before writing it. newline="" is especially useful with the csv module because it prevents the text layer from adding extra platform-specific blank lines. A final newline keeps line-oriented tools and future appends predictable. The function should only report success after the with block closes.',
    'write() exige string. Passar inteiro gera TypeError: write() argument must be str, not int. Converta valores conscientemente, de preferência formatando a linha completa antes de gravar. newline="" é especialmente útil com csv porque evita linhas extras específicas da plataforma. Uma quebra final mantém ferramentas orientadas a linhas e futuros appends previsíveis. A função só deve informar sucesso depois que o with fechar.',
  ),
  heading('🐍 Fundamentals 2 — replace versus append', '🐍 Fundamentos 2 — substituir versus acrescentar'),
  code(
    'def write_snapshot(path, message):\n    with open(path, "w", encoding="utf-8") as file:\n        file.write(message.rstrip("\\n") + "\\n")\n\n\ndef append_event(path, event):\n    with open(path, "a", encoding="utf-8") as file:\n        file.write(event.rstrip("\\n") + "\\n")',
    'def escrever_retrato(caminho, mensagem):\n    with open(caminho, "w", encoding="utf-8") as arquivo:\n        arquivo.write(mensagem.rstrip("\\n") + "\\n")\n\n\ndef acrescentar_evento(caminho, evento):\n    with open(caminho, "a", encoding="utf-8") as arquivo:\n        arquivo.write(evento.rstrip("\\n") + "\\n")',
  ),
  text(
    'A snapshot represents current truth, so replacement is usually correct. An audit journal represents history, so append is usually correct. Using append for a snapshot creates duplicate old state; using write for a journal erases evidence. The mode is a business decision, not just syntax. Name functions to expose that decision and test the second call, because many mode bugs only appear when a destination already exists.',
    'Um retrato representa a verdade atual, então substituir costuma ser correto. Um diário de auditoria representa histórico, então acrescentar costuma ser correto. Append em retrato duplica estado antigo; write em diário apaga evidência. O modo é decisão de negócio, não apenas sintaxe. Nomeie funções para expor a decisão e teste a segunda chamada, pois muitos bugs só aparecem quando o destino já existe.',
  ),
  heading('🐍 Fundamentals 3 — use csv.writer for tabular exports', '🐍 Fundamentos 3 — use csv.writer para exportações tabulares'),
  code(
    'import csv\n\nproducts = [\n    {"sku": "A1", "name": "Special coffee", "quantity": 5},\n    {"sku": "B2", "name": "Rice, premium", "quantity": 12},\n]\n\nwith open("/tmp/products.csv", "w", encoding="utf-8", newline="") as file:\n    writer = csv.writer(file)\n    writer.writerow(["sku", "name", "quantity"])\n    for product in products:\n        writer.writerow([product["sku"], product["name"], product["quantity"]])',
    'import csv\n\nprodutos = [\n    {"sku": "A1", "name": "Café especial", "quantity": 5},\n    {"sku": "B2", "name": "Arroz, premium", "quantity": 12},\n]\n\nwith open("/tmp/produtos.csv", "w", encoding="utf-8", newline="") as arquivo:\n    escritor = csv.writer(arquivo)\n    escritor.writerow(["sku", "name", "quantity"])\n    for produto in produtos:\n        escritor.writerow([produto["sku"], produto["name"], produto["quantity"]])',
  ),
  text(
    'Manual string joining fails when a value itself contains a comma, quote or newline. csv.writer applies quoting rules consistently, so “Rice, premium” remains one column. The file extension does not create CSV correctness; the writer and the agreed dialect do. For stable output, define header order explicitly and sort records by a stable key when source order is not part of the contract. Stable output produces meaningful diffs and repeatable tests.',
    'Concatenar strings manualmente falha quando um valor contém vírgula, aspas ou quebra. csv.writer aplica regras de citação, então “Arroz, premium” continua numa coluna. A extensão não cria CSV correto; o writer e o dialeto acordado criam. Para saída estável, defina ordem do cabeçalho e ordene registros por chave estável quando a ordem da fonte não fizer parte do contrato. Saída estável produz diferenças úteis e testes repetíveis.',
  ),
  heading('🐍 Fundamentals 4 — write atomically', '🐍 Fundamentos 4 — escreva atomicamente'),
  code(
    'from pathlib import Path\nimport os\n\n\ndef atomic_write_text(path, content):\n    destination = Path(path)\n    temporary = destination.with_suffix(destination.suffix + ".tmp")\n    temporary.write_text(content, encoding="utf-8")\n    os.replace(temporary, destination)',
    'from pathlib import Path\nimport os\n\n\ndef escrever_texto_atomico(caminho, conteudo):\n    destino = Path(caminho)\n    temporario = destino.with_suffix(destino.suffix + ".tmp")\n    temporario.write_text(conteudo, encoding="utf-8")\n    os.replace(temporario, destino)',
  ),
  text(
    'The temporary file must be on the same file system for replacement to be atomic. Build and validate the complete content before the swap. In a larger system you may also flush buffers, synchronize to disk, preserve permissions and coordinate concurrent writers, but the core idea remains: readers should observe either the previous complete version or the next complete version, never half of each. This pattern is essential for settings and save-state files.',
    'O temporário precisa estar no mesmo sistema de arquivos para a troca ser atômica. Construa e valide o conteúdo completo antes da substituição. Em sistema maior você pode descarregar buffers, sincronizar disco, preservar permissões e coordenar escritores concorrentes, mas a ideia central permanece: leitores devem observar a versão anterior completa ou a próxima completa, nunca metade de cada. Esse padrão é essencial para configurações e saves.',
  ),
  heading('🏗️ Real scenario 1 — e-commerce reorder export', '🏗️ Cenário real 1 — exportação de reposição do e-commerce'),
  code(
    'import csv\n\n\ndef export_reorder(path, products, threshold):\n    rows = []\n    for product in products:\n        quantity = product["quantity"]\n        if isinstance(quantity, bool) or not isinstance(quantity, int) or quantity < 0:\n            raise ValueError("invalid inventory")\n        if quantity <= threshold:\n            rows.append((product["sku"], product["name"], quantity))\n    rows.sort(key=lambda row: row[0])\n    with open(path, "w", encoding="utf-8", newline="") as file:\n        writer = csv.writer(file)\n        writer.writerow(["sku", "name", "quantity"])\n        writer.writerows(rows)\n    return len(rows)',
    'import csv\n\n\ndef exportar_reposicao(caminho, produtos, limite):\n    linhas = []\n    for produto in produtos:\n        quantidade = produto["quantity"]\n        if isinstance(quantidade, bool) or not isinstance(quantidade, int) or quantidade < 0:\n            raise ValueError("invalid inventory")\n        if quantidade <= limite:\n            linhas.append((produto["sku"], produto["name"], quantidade))\n    linhas.sort(key=lambda linha: linha[0])\n    with open(caminho, "w", encoding="utf-8", newline="") as arquivo:\n        escritor = csv.writer(arquivo)\n        escritor.writerow(["sku", "name", "quantity"])\n        escritor.writerows(linhas)\n    return len(linhas)',
  ),
  text(
    'The function validates every inventory value before publishing, selects only products requiring action, sorts by SKU for deterministic review and returns the number of exported rows. The caller can display that count or store it in an audit event. A downstream procurement system receives valid CSV even when a product name contains punctuation. Empty results still create a header, which is an explicit and useful contract rather than an ambiguous missing file.',
    'A função valida cada valor antes de publicar, seleciona somente produtos que exigem ação, ordena por SKU para revisão determinística e retorna a quantidade exportada. Quem chama pode mostrar ou registrar essa contagem. Um sistema de compras recebe CSV válido mesmo com pontuação no nome. Resultado vazio ainda cria cabeçalho, contrato explícito e útil em vez de arquivo ausente ambíguo.',
  ),
  heading('🏗️ Real scenario 2 — customer-support audit journal', '🏗️ Cenário real 2 — diário de auditoria de atendimento'),
  code(
    'def append_audit_event(path, timestamp, agent, action):\n    clean_agent = agent.strip()\n    clean_action = action.replace("\\n", " ").strip()\n    if not clean_agent or not clean_action:\n        raise ValueError("agent and action are required")\n    line = f"{timestamp}|{clean_agent}|{clean_action}\\n"\n    with open(path, "a", encoding="utf-8") as file:\n        file.write(line)',
    'def acrescentar_evento_auditoria(caminho, instante, agente, acao):\n    agente_limpo = agente.strip()\n    acao_limpa = acao.replace("\\n", " ").strip()\n    if not agente_limpo or not acao_limpa:\n        raise ValueError("agent and action are required")\n    linha = f"{instante}|{agente_limpo}|{acao_limpa}\\n"\n    with open(caminho, "a", encoding="utf-8") as arquivo:\n        arquivo.write(linha)',
  ),
  text(
    'Newlines are removed from the action so one event cannot impersonate several log rows. The timestamp is supplied by the caller, making the function deterministic and testable instead of hiding the current clock inside it. Appending preserves history, while UTF-8 preserves names. In security-sensitive systems an append-only file alone is not tamper-proof, but this design teaches the difference between a current-state export and a chronological event stream.',
    'Quebras são removidas da ação para um evento não fingir várias linhas. O instante é fornecido por quem chama, tornando a função determinística e testável em vez de esconder o relógio atual. Append preserva histórico e UTF-8 preserva nomes. Em sistemas sensíveis, arquivo append-only não é inviolável, mas o desenho ensina a diferença entre exportação de estado atual e fluxo cronológico.',
  ),
  heading('⚠️ Common errors and the real Python messages', '⚠️ Erros comuns e as mensagens reais do Python'),
  warning(
    'Using mode w on the wrong path permanently truncates the existing file. FileNotFoundError can occur when the parent directory does not exist. PermissionError means the process cannot write there. TypeError: write() argument must be str appears when you pass a number directly. ValueError: I/O operation on closed file appears when code writes after leaving the with block. With csv, forgetting newline="" can create extra blank rows on some systems.',
    'Usar modo w no caminho errado trunca permanentemente o arquivo existente. FileNotFoundError pode ocorrer quando a pasta pai não existe. PermissionError significa falta de escrita. TypeError: write() argument must be str aparece ao passar número diretamente. ValueError: I/O operation on closed file surge ao escrever depois do with. Com csv, esquecer newline="" pode criar linhas extras em alguns sistemas.',
  ),
  text(
    'Do not claim success before the write finishes. Return a count or destination only after the with block closes successfully. Avoid swallowing OSError and continuing as though an export exists. When writing user-provided text to a line-oriented format, normalize embedded line breaks. When writing CSV or JSON, use the standard serializer rather than inventing quoting rules. A writer owns the quality of the published artifact.',
    'Não declare sucesso antes de a escrita terminar. Retorne contagem ou destino apenas depois de o with fechar com sucesso. Não esconda OSError e continue fingindo que a exportação existe. Ao gravar texto do usuário em formato por linhas, normalize quebras internas. Para CSV ou JSON, use o serializador padrão em vez de inventar regras. Quem escreve é responsável pela qualidade do artefato publicado.',
  ),
  tip(
    '💡 Pro tip — define whether output is a snapshot, journal or transaction. Snapshots replace, journals append and transactional files use temporary output plus atomic replacement. Make output deterministic by controlling encoding, newline style, headers, field order, record order and numeric formatting. Determinism makes diffs meaningful and automated tests reliable.',
    '💡 Dica pro — defina se a saída é retrato, diário ou transação. Retratos substituem, diários acrescentam e arquivos transacionais usam temporário mais troca atômica. Torne a saída determinística controlando codificação, quebras, cabeçalhos, campos, ordem dos registros e números. Determinismo torna diferenças úteis e testes confiáveis.',
  ),
  heading('📋 Recap and bridge to the next phase', '📋 Resumo e ponte para a próxima fase'),
  text(
    'You can now choose write or append deliberately, create exact text lines, export tabular records with csv.writer and protect important snapshots with atomic replacement. In the next phase, JSON will preserve nested lists, dictionaries, booleans and numbers instead of flattening everything into lines. File writing remains the transport; serialization will define how Python structures become portable text.',
    'Agora você sabe escolher write ou append conscientemente, criar linhas exatas, exportar tabelas com csv.writer e proteger retratos importantes com troca atômica. Na próxima fase, JSON preservará listas, dicionários, booleanos e números aninhados em vez de achatar tudo em linhas. A escrita continua sendo o transporte; serialização definirá como estruturas Python viram texto portátil.',
  ),
]

const p18FormatRequirements: CodeRequirement[] = [{ kind: 'function', value: 'format_report' }, { kind: 'call', value: 'join' }, { kind: 'node', value: 'Return' }]
const p18SaveRequirements: CodeRequirement[] = [{ kind: 'function', value: 'save_lines' }, { kind: 'call', value: 'open' }, { kind: 'node', value: 'With' }, { kind: 'node', value: 'Return' }]
const p18CsvRequirements: CodeRequirement[] = [{ kind: 'function', value: 'export_products' }, { kind: 'import', value: 'csv' }, { kind: 'call', value: 'open' }, { kind: 'node', value: 'Return' }]
const p18AtomicRequirements: CodeRequirement[] = [{ kind: 'function', value: 'atomic_save' }, { kind: 'import', value: 'os' }, { kind: 'call', value: 'replace' }, { kind: 'node', value: 'Return' }]

export const phase18: Phase = {
  id: 18,
  title: b('Writing Files', 'Escrevendo Arquivos'),
  description: b('Create deterministic exports, append journals and replace important files atomically.', 'Crie exportações determinísticas, acrescente diários e substitua arquivos importantes atomicamente.'),
  icon: '💾', libraries: [], track: 'core', stage: 'base', estimatedHours: 8,
  lesson: { title: b('Writing files: durable output without data loss', 'Escrita de arquivos: saída durável sem perda de dados'), blocks: phase18Blocks },
  exercises: [
    makeExercise({
      id: 'p18-guided', title: b('Guided — format a deterministic text report', 'Guiado — formate relatório textual determinístico'),
      description: b("Implement format_report(title, rows). Trim the title, add it first and add every row as 'key=value'. Return one string ending with a newline.", "Implemente format_report(title, rows). Limpe o título, coloque primeiro e adicione cada linha como 'chave=valor'. Retorne string terminando em quebra."),
      starterCode: 'def format_report(title, rows):\n    pass', sampleOutput: b('Stock\ncoffee=3\ntea=8', 'Estoque\ncafé=3\nchá=8'),
      hints: [b("Collect lines, then join with '\\n'.", "Colete linhas e use join com '\\n'."), b('Add one final newline after joining.', 'Adicione uma quebra final depois do join.')],
      requirements: p18FormatRequirements,
      tests: [
        exactTest('p18-guided-public', b('Formats a normal report', 'Formata relatório normal'), 'print(format_report(" Stock ", [("coffee", 3), ("tea", 8)]), end="")', b('Stock\ncoffee=3\ntea=8', 'Stock\ncoffee=3\ntea=8'), 60, p18FormatRequirements),
        exactTest('p18-guided-hidden', b('Formats an empty report', 'Formata relatório vazio'), 'print(format_report("Empty", []), end="")', b('Empty', 'Empty'), 40, p18FormatRequirements, true),
      ], difficulty: 'guided', objective: b('Separate deterministic formatting from the side effect of writing.', 'Separe formatação determinística do efeito de escrever.'),
      workplaceContext: b('Formatting can be tested without disk and reused by file or email exporters.', 'Formatação pode ser testada sem disco e reutilizada por arquivo ou e-mail.'), successCriteria: success,
      commonMistakes: { en: ['Forgetting the final newline contract.', 'Printing instead of returning.', 'Adding unstable ordering.'], pt: ['Esquecer o contrato de quebra final.', 'Imprimir em vez de retornar.', 'Adicionar ordem instável.'] },
    }),
    makeExercise({
      id: 'p18-complete', title: b('Complete — save one line per item', 'Complete — salve uma linha por item'),
      description: b('Complete save_lines(path, lines). Replace the destination, write each item as text followed by one newline and return the number written.', 'Complete save_lines(path, lines). Substitua o destino, escreva cada item como texto seguido de uma quebra e retorne a quantidade.'),
      starterCode: 'def save_lines(path, lines):\n    count = 0\n    with open(path, "w", encoding="utf-8") as file:\n        for item in lines:\n            # Write exactly one line and increment count.\n            pass\n    return count', sampleOutput: b('3\nalpha\nação\n99', '3\nalpha\nação\n99'),
      hints: [b("Use str(item).rstrip('\\n') before adding one newline.", "Use str(item).rstrip('\\n') antes de adicionar uma quebra."), b('Increment only after a successful write.', 'Incremente apenas após escrita bem-sucedida.')], requirements: p18SaveRequirements,
      tests: [
        exactTest('p18-complete-public', b('Writes Unicode and numeric items', 'Escreve itens Unicode e numéricos'), 'path = "/tmp/p18-lines.txt"\nprint(save_lines(path, ["alpha", "ação", 99]))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read(), end="")', b('3\nalpha\nação\n99', '3\nalpha\nação\n99'), 60, p18SaveRequirements),
        exactTest('p18-complete-hidden', b('Creates an empty file from an empty list', 'Cria arquivo vazio a partir de lista vazia'), 'path = "/tmp/p18-empty.txt"\nprint(save_lines(path, []))\nwith open(path, "r", encoding="utf-8") as file:\n    print(repr(file.read()))', b("0\n''", "0\n''"), 40, p18SaveRequirements, true),
      ], difficulty: 'independent', objective: b('Write predictable line-oriented output and report the completed count.', 'Escreva saída por linhas previsível e informe a contagem concluída.'),
      workplaceContext: b('Batch exports need a count returned only after all rows are written.', 'Exportações em lote precisam de contagem apenas após todas as linhas.'), successCriteria: success,
      commonMistakes: { en: ['Using append when replacement is required.', 'Writing non-string values directly.', 'Forgetting line endings.'], pt: ['Usar append quando deve substituir.', 'Escrever valores não string diretamente.', 'Esquecer quebras.'] },
    }),
    makeExercise({
      id: 'p18-zero', title: b('From scratch — export products with csv.writer', 'Do zero — exporte produtos com csv.writer'),
      description: b('Create export_products(path, products). Write a header and products sorted by sku. Reject negative quantity and return the number of data rows.', 'Crie export_products(path, products). Escreva cabeçalho e produtos ordenados por sku. Rejeite quantidade negativa e retorne o número de dados.'),
      starterCode: 'def export_products(path, products):\n    pass', sampleOutput: b('2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10', '2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10'),
      hints: [b("Import csv and open with newline=''.", "Importe csv e abra com newline=''."), b('Use writer.writerow for the header and each row.', 'Use writer.writerow para cabeçalho e linhas.')], requirements: p18CsvRequirements,
      tests: [
        exactTest('p18-zero-public', b('Exports sorted CSV with quoting', 'Exporta CSV ordenado com citação'), 'path = "/tmp/p18-products.csv"\nproducts = [{"sku":"B2","name":"Tea","quantity":10},{"sku":"A1","name":"Café, premium","quantity":4}]\nprint(export_products(path, products))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read().replace("\\r\\n", "\\n"), end="")', b('2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10', '2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10'), 60, p18CsvRequirements),
        exactTest('p18-zero-hidden', b('Rejects negative stock', 'Rejeita estoque negativo'), 'try:\n    export_products("/tmp/p18-bad.csv", [{"sku":"X","name":"Bad","quantity":-1}])\nexcept ValueError as error:\n    print(error)', b('negative inventory', 'negative inventory'), 40, [...p18CsvRequirements, { kind: 'node', value: 'Raise' }], true),
      ], difficulty: 'independent', objective: b('Use the standard CSV serializer instead of hand-built comma joining.', 'Use o serializador CSV padrão em vez de concatenar vírgulas manualmente.'),
      workplaceContext: b('Procurement integrations depend on correct quoting and deterministic row order.', 'Integrações de compras dependem de citação correta e ordem determinística.'), successCriteria: success,
      commonMistakes: { en: ['Joining fields manually.', "Forgetting newline=''.", 'Publishing invalid negative data.'], pt: ['Concatenar campos manualmente.', "Esquecer newline=''.", 'Publicar dado negativo inválido.'] },
    }),
    makeExercise({
      id: 'p18-transfer', title: b('Challenge — replace a snapshot atomically', 'Desafio — substitua um retrato atomicamente'),
      description: b("Create atomic_save(path, text). Write UTF-8 text to path + '.tmp', then replace the destination with os.replace. Return the final UTF-8 byte length.", "Crie atomic_save(path, text). Grave texto UTF-8 em path + '.tmp' e substitua destino com os.replace. Retorne tamanho final em bytes UTF-8."),
      starterCode: 'def atomic_save(path, text):\n    pass', sampleOutput: b('9\nnew state\nFalse', '9\nnew state\nFalse'),
      hints: [b("Import os and write to temporary = path + '.tmp'.", "Importe os e grave em temporary = path + '.tmp'."), b("Use len(text.encode('utf-8')) for byte length.", "Use len(text.encode('utf-8')) para bytes.")], requirements: p18AtomicRequirements,
      tests: [
        exactTest('p18-transfer-public', b('Replaces an existing file completely', 'Substitui arquivo existente completamente'), 'path = "/tmp/p18-state.txt"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("old")\nprint(atomic_save(path, "new state"))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read())\nprint(__import__("os").path.exists(path + ".tmp"))', b('9\nnew state\nFalse', '9\nnew state\nFalse'), 60, p18AtomicRequirements),
        exactTest('p18-transfer-hidden', b('Counts accented UTF-8 bytes and removes temporary output', 'Conta bytes UTF-8 acentuados e remove temporário'), 'path = "/tmp/p18-unicode.txt"\nprint(atomic_save(path, "ação"))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read())\nprint(__import__("os").path.exists(path + ".tmp"))', b('6\nação\nFalse', '6\nação\nFalse'), 40, p18AtomicRequirements, true),
      ], difficulty: 'challenge', objective: b('Protect a durable snapshot from partially written content.', 'Proteja retrato durável contra conteúdo parcialmente escrito.'),
      workplaceContext: b('Configuration and save-state files should transition from one complete version to another.', 'Configurações e saves devem passar de uma versão completa para outra.'), successCriteria: success,
      commonMistakes: { en: ['Replacing before the temporary write closes.', 'Using another file system for the temporary file.', 'Returning character count instead of UTF-8 bytes.'], pt: ['Substituir antes de fechar temporário.', 'Usar outro sistema no temporário.', 'Retornar caracteres em vez de bytes UTF-8.'] },
    }),
  ],
  quiz: [
    { id: 'q18-1', question: b('Which mode preserves existing content and adds at the end?', 'Qual modo preserva conteúdo e acrescenta no fim?'), options: [b('a', 'a'), b('r', 'r'), b('w', 'w'), b('x only', 'somente x')], correctIndex: 0, explanation: b('Append mode a writes after existing content.', 'O modo a escreve depois do conteúdo existente.') },
    { id: 'q18-2', question: b('Why use csv.writer instead of joining fields with commas?', 'Por que usar csv.writer em vez de unir campos com vírgulas?'), options: [b('It encrypts the file.', 'Criptografa o arquivo.'), b('It quotes commas, quotes and newlines correctly.', 'Trata vírgulas, aspas e quebras corretamente.'), b('It validates business rules.', 'Valida regras de negócio.'), b('It uploads the file.', 'Envia o arquivo.')], correctIndex: 1, explanation: b('The serializer implements CSV escaping rules.', 'O serializador implementa as regras de escape CSV.') },
    { id: 'q18-3', question: b('What does atomic replacement protect readers from?', 'Do que a substituição atômica protege leitores?'), options: [b('Accented text', 'Texto acentuado'), b('Large values', 'Valores grandes'), b('Observing a partially written snapshot', 'Observar retrato parcialmente escrito'), b('Missing headers only', 'Apenas cabeçalhos ausentes')], correctIndex: 2, explanation: b('Readers see the old complete file or the new complete file.', 'Leitores veem o antigo completo ou o novo completo.') },
    { id: 'q18-4', question: b('What happens when mode w opens an existing file?', 'O que acontece quando modo w abre arquivo existente?'), options: [b('It reads only.', 'Apenas lê.'), b('It appends.', 'Acrescenta.'), b('It raises FileExistsError.', 'Gera FileExistsError.'), b('It truncates and replaces the content.', 'Trunca e substitui o conteúdo.')], correctIndex: 3, explanation: b('Write mode starts new content at that path.', 'Modo de escrita inicia novo conteúdo naquele caminho.') },
  ],
  exam: {
    title: b('Exam — inventory manifest writer', 'Exame — escritor de manifesto de estoque'),
    scenario: b('Create write_manifest(path, items). Validate non-negative integer quantities, write deterministic CSV with sku,name,quantity and return the number of data rows.', 'Crie write_manifest(path, items). Valide quantidades inteiras não negativas, grave CSV determinístico com sku,name,quantity e retorne número de linhas.'),
    requirements: { en: ['Use csv.writer.', "Open UTF-8 with newline=''.", 'Write one header.', 'Sort by sku.', 'Reject invalid quantity.'], pt: ['Use csv.writer.', "Abra UTF-8 com newline=''.", 'Grave um cabeçalho.', 'Ordene por sku.', 'Rejeite quantidade inválida.'] },
    starterCode: 'def write_manifest(path, items):\n    pass',
    expectedOutput: b('2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10', '2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10'),
    testCases: [
      exactTest('p18-exam-visible', b('Writes a deterministic quoted manifest', 'Grava manifesto citado determinístico'), 'path = "/tmp/p18-manifest.csv"\nitems = [{"sku":"B2","name":"Tea","quantity":10},{"sku":"A1","name":"Café, premium","quantity":4}]\nprint(write_manifest(path, items))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read().replace("\\r\\n", "\\n"), end="")', b('2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10', '2\nsku,name,quantity\nA1,"Café, premium",4\nB2,Tea,10'), 60, [{ kind: 'function', value: 'write_manifest' }, { kind: 'import', value: 'csv' }, { kind: 'call', value: 'open' }, { kind: 'node', value: 'Return' }]),
      exactTest('p18-exam-empty', b('Writes only the header for an empty manifest', 'Grava apenas cabeçalho para manifesto vazio'), 'path = "/tmp/p18-empty-manifest.csv"\nprint(write_manifest(path, []))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read().replace("\\r\\n", "\\n"), end="")', b('0\nsku,name,quantity', '0\nsku,name,quantity'), 20, [{ kind: 'function', value: 'write_manifest' }, { kind: 'import', value: 'csv' }, { kind: 'call', value: 'open' }, { kind: 'node', value: 'Return' }], true),
      exactTest('p18-exam-hidden-hardening', b('Rejects a boolean quantity', 'Rejeita quantidade booleana'), 'try:\n    write_manifest("/tmp/p18-invalid.csv", [{"sku":"X","name":"Bad","quantity":True}])\nexcept ValueError as error:\n    print(error)', b('invalid quantity', 'invalid quantity'), 20, [{ kind: 'function', value: 'write_manifest' }, { kind: 'node', value: 'Raise' }], true),
    ],
  },
}

const phase19Blocks: LessonBlock[] = [
  heading('🌍 World hook — JSON is a common language between systems', '🌍 Gancho do mundo real — JSON é uma linguagem comum entre sistemas'),
  text(
    'A mobile app receives a user profile, a game loads settings, an e-commerce service returns an order and a data pipeline stores configuration. These systems may use different programming languages, but they can exchange JSON text. JSON represents objects, arrays, strings, numbers, booleans and null with a small standardized grammar. Python json converts between that text and ordinary dictionaries, lists and primitive values, making JSON one of the most important boundaries in modern software.',
    'Um app móvel recebe perfil, um jogo carrega configurações, um e-commerce devolve pedido e um pipeline armazena configuração. Esses sistemas podem usar linguagens diferentes, mas trocam texto JSON. JSON representa objetos, arrays, strings, números, booleanos e null com gramática pequena e padronizada. O módulo json converte entre esse texto e dicionários, listas e valores primitivos, tornando JSON uma das fronteiras mais importantes do software moderno.',
  ),
  text(
    'Parsing JSON proves only that the text follows JSON syntax; it does not prove the data matches your application contract. A syntactically valid object may omit a required key, contain a negative quantity or use a string where a number is required. Production code therefore has two layers: deserialize the text, then validate shape and domain rules. Treat incoming JSON as untrusted evidence even when it came from your own previous version, because files can be edited and schemas evolve.',
    'Interpretar JSON prova apenas que o texto segue a sintaxe; não prova que os dados atendem ao contrato do aplicativo. Um objeto válido pode omitir chave obrigatória, ter quantidade negativa ou string onde deveria haver número. Código de produção possui duas camadas: desserializar e depois validar formato e regras de domínio. Trate JSON recebido como evidência não confiável mesmo vindo de versão anterior, pois arquivos podem ser editados e schemas evoluem.',
  ),
  heading('🧩 Physical analogy — packing and unpacking a labeled moving box', '🧩 Analogia física — embalar e desembalar uma caixa etiquetada'),
  text(
    'json.dumps is packing Python values into a standardized text box. json.loads is opening that box and rebuilding Python values. The box label describes the structure, but you still inspect whether the expected items are inside. A dictionary becomes a JSON object, a list becomes an array, True and False become true and false, and None becomes null. Custom objects and datetime values need an explicit conversion because JSON does not know their application-specific meaning.',
    'json.dumps embala valores Python numa caixa de texto padronizada. json.loads abre essa caixa e reconstrói valores Python. A etiqueta descreve a estrutura, mas você ainda verifica se os itens esperados estão presentes. Dicionário vira objeto, lista vira array, True e False viram true e false, e None vira null. Objetos personalizados e datetime exigem conversão explícita porque JSON não conhece o significado específico do aplicativo.',
  ),
  text(
    'Serialization is not encryption and not validation. Anyone who can read the file can read its JSON, and anyone who can edit it can change values. Do not put secrets in a public JSON file. Do not trust a field merely because your serializer created it yesterday. The format makes data portable; authentication, authorization, privacy and business correctness require separate controls. A clear mental model prevents JSON from becoming a false guarantee of safety.',
    'Serialização não é criptografia nem validação. Quem lê o arquivo lê o JSON e quem edita pode mudar valores. Não coloque segredos em JSON público. Não confie em campo apenas porque seu serializador o criou ontem. O formato torna dados portáveis; autenticação, autorização, privacidade e correção de negócio exigem controles separados. Um modelo mental claro impede que JSON vire falsa garantia de segurança.',
  ),
  heading('🐍 Fundamentals 1 — loads and dumps work with strings', '🐍 Fundamentos 1 — loads e dumps trabalham com strings'),
  code(
    'import json\n\npayload = \'{"name":"Lia","level":3,"active":true,"tags":["python","data"]}\'\nprofile = json.loads(payload)\nprint(profile["name"])\nprint(profile["tags"][0])\n\ntext_value = json.dumps(profile, ensure_ascii=False, sort_keys=True)\nprint(text_value)',
    'import json\n\nconteudo = \'{"name":"Lia","level":3,"active":true,"tags":["python","dados"]}\'\nperfil = json.loads(conteudo)\nprint(perfil["name"])\nprint(perfil["tags"][0])\n\ntexto = json.dumps(perfil, ensure_ascii=False, sort_keys=True)\nprint(texto)',
  ),
  text(
    'loads means load string; dumps means dump string. JSON uses double quotes around names and text, lowercase true, false and null, and no trailing commas. json.loads raises json.JSONDecodeError with line and column information when syntax is invalid. ensure_ascii=False keeps accented characters readable rather than escaping them as Unicode codes. sort_keys=True creates deterministic object key order for tests, caching and source-control diffs.',
    'loads significa carregar string; dumps significa despejar string. JSON usa aspas duplas em nomes e textos, true, false e null minúsculos e não aceita vírgula final. json.loads gera json.JSONDecodeError com linha e coluna quando a sintaxe é inválida. ensure_ascii=False mantém acentos legíveis em vez de escapar códigos Unicode. sort_keys=True cria ordem determinística das chaves para testes, cache e controle de versão.',
  ),
  heading('🐍 Fundamentals 2 — load and dump work with files', '🐍 Fundamentos 2 — load e dump trabalham com arquivos'),
  code(
    'import json\n\nsettings = {"language": "pt-BR", "theme": "dark", "font_size": 18}\nwith open("/tmp/settings.json", "w", encoding="utf-8") as file:\n    json.dump(settings, file, ensure_ascii=False, indent=2, sort_keys=True)\n\nwith open("/tmp/settings.json", "r", encoding="utf-8") as file:\n    restored = json.load(file)\n\nprint(restored["theme"])',
    'import json\n\nconfiguracoes = {"language": "pt-BR", "theme": "dark", "font_size": 18}\nwith open("/tmp/configuracoes.json", "w", encoding="utf-8") as arquivo:\n    json.dump(configuracoes, arquivo, ensure_ascii=False, indent=2, sort_keys=True)\n\nwith open("/tmp/configuracoes.json", "r", encoding="utf-8") as arquivo:\n    restaurado = json.load(arquivo)\n\nprint(restaurado["theme"])',
  ),
  text(
    'load and dump receive file objects. indent improves human readability but increases size; compact JSON is common for network responses. Key order does not carry business meaning in JSON objects, so code should access by key rather than position. Arrays do preserve order. Writing with a stable key order is still useful for version control because the same logical content produces the same text and reviewers can identify real changes without noise.',
    'load e dump recebem objetos de arquivo. indent melhora leitura humana, mas aumenta tamanho; JSON compacto é comum em rede. Ordem de chaves não possui significado de negócio em objetos JSON, então o código deve acessar por chave, não posição. Arrays preservam ordem. Gravar chaves em ordem estável ainda ajuda no controle de versão porque o mesmo conteúdo lógico produz o mesmo texto e revisores identificam mudanças reais sem ruído.',
  ),
  heading('🐍 Fundamentals 3 — validate shape before using fields', '🐍 Fundamentos 3 — valide o formato antes de usar campos'),
  code(
    'def validate_order(value):\n    if not isinstance(value, dict):\n        raise ValueError("order must be an object")\n    if not isinstance(value.get("items"), list):\n        raise ValueError("items must be a list")\n    for index, item in enumerate(value["items"]):\n        if not isinstance(item, dict):\n            raise ValueError(f"item {index} must be an object")\n        price = item.get("price")\n        quantity = item.get("quantity")\n        if isinstance(price, bool) or not isinstance(price, (int, float)):\n            raise ValueError(f"item {index} price must be numeric")\n        if isinstance(quantity, bool) or not isinstance(quantity, int) or quantity < 0:\n            raise ValueError(f"item {index} quantity must be a non-negative integer")',
    'def validar_pedido(valor):\n    if not isinstance(valor, dict):\n        raise ValueError("order must be an object")\n    if not isinstance(valor.get("items"), list):\n        raise ValueError("items must be a list")\n    for indice, item in enumerate(valor["items"]):\n        if not isinstance(item, dict):\n            raise ValueError(f"item {indice} must be an object")\n        preco = item.get("price")\n        quantidade = item.get("quantity")\n        if isinstance(preco, bool) or not isinstance(preco, (int, float)):\n            raise ValueError(f"item {indice} price must be numeric")\n        if isinstance(quantidade, bool) or not isinstance(quantidade, int) or quantidade < 0:\n            raise ValueError(f"item {indice} quantity must be a non-negative integer")',
  ),
  text(
    'Use isinstance carefully because bool is a subclass of int in Python. If True must not count as quantity 1, reject booleans explicitly. Validate required keys, container types and domain ranges before calculation. Error messages should identify the field or item index. A KeyError may be acceptable inside trusted internal code, but at an external boundary a deliberate ValueError usually creates clearer feedback and lets the caller decide whether to reject the request or ask for correction.',
    'Use isinstance com cuidado porque bool é subclasse de int em Python. Se True não puder contar como quantidade 1, rejeite booleanos explicitamente. Valide chaves obrigatórias, tipos de contêiner e faixas antes de calcular. Mensagens devem identificar campo ou índice. KeyError pode ser aceitável em código interno confiável, mas numa fronteira externa ValueError deliberado costuma gerar feedback mais claro e permite decidir entre rejeitar ou pedir correção.',
  ),
  heading('🐍 Fundamentals 4 — normalize into a stable internal model', '🐍 Fundamentos 4 — normalize para um modelo interno estável'),
  code(
    'def normalize_profile(data):\n    if not isinstance(data, dict):\n        raise ValueError("profile must be an object")\n    name = data.get("name")\n    if not isinstance(name, str) or not name.strip():\n        raise ValueError("name is required")\n    tags = data.get("tags", [])\n    if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):\n        raise ValueError("tags must be a list of strings")\n    return {\n        "name": name.strip(),\n        "active": data.get("active", False) is True,\n        "tags": sorted({tag.strip().lower() for tag in tags if tag.strip()}),\n    }',
    'def normalizar_perfil(dados):\n    if not isinstance(dados, dict):\n        raise ValueError("profile must be an object")\n    nome = dados.get("name")\n    if not isinstance(nome, str) or not nome.strip():\n        raise ValueError("name is required")\n    tags = dados.get("tags", [])\n    if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):\n        raise ValueError("tags must be a list of strings")\n    return {\n        "name": nome.strip(),\n        "active": dados.get("active", False) is True,\n        "tags": sorted({tag.strip().lower() for tag in tags if tag.strip()}),\n    }',
  ),
  text(
    'Normalization converts several accepted external representations into one internal representation. Trimming names, applying safe defaults and deduplicating tags means downstream code handles fewer cases. Do not coerce every invalid value silently: bool("false") is True because the string is non-empty. Decide which conversions are safe and which should fail. A stable internal model reduces repeated validation and prevents every component from inventing a different interpretation of the same payload.',
    'Normalização converte várias representações externas aceitas numa representação interna. Remover espaços, aplicar padrões seguros e eliminar tags duplicadas significa que o restante lida com menos casos. Não converta todo valor inválido silenciosamente: bool("false") é True porque a string não está vazia. Decida quais conversões são seguras e quais devem falhar. Um modelo interno estável reduz validações repetidas e impede cada componente de inventar interpretação diferente do mesmo payload.',
  ),
  heading('🏗️ Real scenario 1 — game save profile', '🏗️ Cenário real 1 — perfil salvo de jogo'),
  code(
    'import json\n\n\ndef load_game_save(text_value):\n    data = json.loads(text_value)\n    if not isinstance(data, dict):\n        raise ValueError("save must be an object")\n    player = data.get("player")\n    level = data.get("level")\n    inventory = data.get("inventory", [])\n    if not isinstance(player, str) or not player.strip():\n        raise ValueError("player is required")\n    if isinstance(level, bool) or not isinstance(level, int) or level < 1:\n        raise ValueError("level must be a positive integer")\n    if not isinstance(inventory, list) or not all(isinstance(item, str) for item in inventory):\n        raise ValueError("inventory must be a list of strings")\n    return {"player": player.strip(), "level": level, "inventory": inventory}',
    'import json\n\n\ndef carregar_jogo_salvo(texto):\n    dados = json.loads(texto)\n    if not isinstance(dados, dict):\n        raise ValueError("save must be an object")\n    jogador = dados.get("player")\n    nivel = dados.get("level")\n    inventario = dados.get("inventory", [])\n    if not isinstance(jogador, str) or not jogador.strip():\n        raise ValueError("player is required")\n    if isinstance(nivel, bool) or not isinstance(nivel, int) or nivel < 1:\n        raise ValueError("level must be a positive integer")\n    if not isinstance(inventario, list) or not all(isinstance(item, str) for item in inventario):\n        raise ValueError("inventory must be a list of strings")\n    return {"player": jogador.strip(), "level": nivel, "inventory": inventario}',
  ),
  text(
    'A save file may be edited or come from an older version. The loader validates every field before the game trusts it. Missing inventory receives a safe empty default, but missing player or invalid level stops loading because those fields define the save. The function returns a new normalized dictionary instead of exposing every unknown key, which prevents accidental dependence on unsupported data and creates a controlled point for future schema migration.',
    'Um save pode ser editado ou vir de versão antiga. O carregador valida cada campo antes de o jogo confiar nele. Inventário ausente recebe lista vazia segura, mas jogador ou nível inválido interrompem porque definem o save. A função retorna novo dicionário normalizado em vez de expor toda chave desconhecida, evitando dependência em dados não suportados e criando ponto controlado para futura migração de schema.',
  ),
  heading('🏗️ Real scenario 2 — administrative appointment payload', '🏗️ Cenário real 2 — payload administrativo de agendamento'),
  code(
    'import json\n\n\ndef appointment_summary(text_value):\n    data = json.loads(text_value)\n    if not isinstance(data, dict):\n        raise ValueError("appointment must be an object")\n    required = ["reference", "department", "scheduled_at"]\n    missing = [key for key in required if not isinstance(data.get(key), str) or not data[key].strip()]\n    if missing:\n        raise ValueError("missing fields: " + ",".join(missing))\n    notes = data.get("notes")\n    if notes is not None and not isinstance(notes, str):\n        raise ValueError("notes must be text or null")\n    return f"{data[\'reference\'].strip()}|{data[\'department\'].strip()}|{data[\'scheduled_at\'].strip()}"',
    'import json\n\n\ndef resumo_agendamento(texto):\n    dados = json.loads(texto)\n    if not isinstance(dados, dict):\n        raise ValueError("appointment must be an object")\n    obrigatorios = ["reference", "department", "scheduled_at"]\n    ausentes = [chave for chave in obrigatorios if not isinstance(dados.get(chave), str) or not dados[chave].strip()]\n    if ausentes:\n        raise ValueError("missing fields: " + ",".join(ausentes))\n    observacoes = dados.get("notes")\n    if observacoes is not None and not isinstance(observacoes, str):\n        raise ValueError("notes must be text or null")\n    return f"{dados[\'reference\'].strip()}|{dados[\'department\'].strip()}|{dados[\'scheduled_at\'].strip()}"',
  ),
  text(
    'The appointment payload contains administrative scheduling data rather than sensitive clinical detail. Required fields are checked together so the error reports every missing name. notes explicitly accepts either text or null, matching JSON null to Python None. The summary uses only validated values. A real API would add schema versioning, authentication and privacy controls, but the same parse–validate–normalize sequence remains the reliable core.',
    'O payload contém dados administrativos de agendamento, não detalhes clínicos sensíveis. Campos obrigatórios são verificados juntos para o erro listar todos os nomes ausentes. notes aceita explicitamente texto ou null, que vira None. O resumo usa apenas valores validados. Uma API real acrescentaria versão de schema, autenticação e privacidade, mas a sequência interpretar–validar–normalizar permanece como núcleo confiável.',
  ),
  heading('⚠️ Common errors and the real Python messages', '⚠️ Erros comuns e as mensagens reais do Python'),
  warning(
    'json.JSONDecodeError means invalid JSON syntax, often single quotes, a trailing comma or an unquoted key. TypeError: Object of type datetime is not JSON serializable means you must convert the value, commonly with isoformat(). KeyError means a required key was accessed before validation. TypeError while totaling usually means a numeric field arrived as text, boolean or null. Never repair malformed data with global string replacement; parse and validate deliberately.',
    'json.JSONDecodeError significa sintaxe inválida, geralmente aspas simples, vírgula final ou chave sem aspas. TypeError: Object of type datetime is not JSON serializable exige converter o valor, normalmente com isoformat(). KeyError indica acesso antes da validação. TypeError em soma costuma significar número recebido como texto, booleano ou null. Nunca conserte dados com substituição global de strings; interprete e valide conscientemente.',
  ),
  text(
    'Another common confusion is using json.load on a string or json.loads on a file object. The s suffix means string. Also remember that dictionary keys written to JSON become strings. A Python dictionary with integer keys will not return with the same key types. If exact round-trip type preservation matters, define an explicit schema and conversion rules rather than assume JSON can represent every Python object without loss.',
    'Outra confusão é usar json.load em string ou json.loads em arquivo. O sufixo s significa string. Lembre também que chaves de dicionário viram strings em JSON. Dicionário Python com chaves inteiras não volta com os mesmos tipos. Se preservar tipos exatamente for importante, defina schema e regras de conversão em vez de presumir que JSON representa todo objeto Python sem perdas.',
  ),
  tip(
    '💡 Pro tip — separate decoding, validation, normalization and serialization. Add a schema_version field to long-lived files and write migration functions when the format changes. Use sort_keys and controlled separators for deterministic machine output, ensure_ascii=False for readable Unicode, and atomic file replacement for important saved state.',
    '💡 Dica pro — separe decodificação, validação, normalização e serialização. Acrescente schema_version em arquivos duradouros e crie migrações quando o formato mudar. Use sort_keys e separadores controlados para saída determinística, ensure_ascii=False para Unicode legível e substituição atômica em estado importante.',
  ),
  heading('📋 Recap and bridge to the next phase', '📋 Resumo e ponte para a próxima fase'),
  text(
    'You can now deserialize JSON strings and files, serialize deterministic Unicode JSON, validate nested structures and normalize external data into a stable model. JSON often carries dates as strings because it has no native datetime type. The next phase teaches how to parse those date strings, calculate durations and format timestamps without depending on the computer clock inside business functions.',
    'Agora você sabe desserializar strings e arquivos JSON, serializar JSON Unicode determinístico, validar estruturas aninhadas e normalizar dados externos. JSON frequentemente transporta datas como strings porque não possui tipo datetime. A próxima fase ensina interpretar essas datas, calcular durações e formatar instantes sem depender do relógio do computador dentro das funções de negócio.',
  ),
]

const p19DecodeRequirements: CodeRequirement[] = [{ kind: 'function', value: 'decode_profile' }, { kind: 'import', value: 'json' }, { kind: 'call', value: 'loads' }, { kind: 'node', value: 'Return' }]
const p19EncodeRequirements: CodeRequirement[] = [{ kind: 'function', value: 'encode_settings' }, { kind: 'import', value: 'json' }, { kind: 'call', value: 'dumps' }, { kind: 'node', value: 'Return' }]
const p19OrderRequirements: CodeRequirement[] = [{ kind: 'function', value: 'order_total' }, { kind: 'import', value: 'json' }, { kind: 'call', value: 'loads' }, { kind: 'node', value: 'Return' }]
const p19FileRequirements: CodeRequirement[] = [{ kind: 'function', value: 'update_json_file' }, { kind: 'import', value: 'json' }, { kind: 'call', value: 'load' }, { kind: 'call', value: 'dump' }, { kind: 'node', value: 'Return' }]

export const phase19: Phase = {
  id: 19,
  title: b('JSON Data', 'Dados JSON'),
  description: b('Serialize, deserialize, validate and normalize portable nested data.', 'Serialize, desserialize, valide e normalize dados aninhados portáveis.'),
  icon: '🧾', libraries: [], track: 'core', stage: 'base', estimatedHours: 8,
  lesson: { title: b('JSON: portable structure with explicit validation', 'JSON: estrutura portável com validação explícita'), blocks: phase19Blocks },
  exercises: [
    makeExercise({
      id: 'p19-guided', title: b('Guided — decode and normalize a profile', 'Guiado — decodifique e normalize um perfil'),
      description: b('Implement decode_profile(text). Parse a JSON object, require a non-empty string name, default tags to [], normalize tags to sorted unique lowercase strings and return a new dictionary.', 'Implemente decode_profile(text). Interprete objeto JSON, exija name não vazio, use [] como padrão de tags, normalize tags para strings minúsculas únicas e ordenadas e retorne novo dicionário.'),
      starterCode: 'def decode_profile(text):\n    pass', sampleOutput: b("{'name': 'Lia', 'tags': ['dados', 'python']}", "{'name': 'Lia', 'tags': ['dados', 'python']}"),
      hints: [b('Use json.loads(text), then validate isinstance(data, dict).', 'Use json.loads(text) e valide isinstance(data, dict).'), b('A set comprehension can deduplicate normalized tags.', 'Uma compreensão de set pode eliminar tags duplicadas.')], requirements: p19DecodeRequirements,
      tests: [
        exactTest('p19-guided-public', b('Normalizes Unicode profile data', 'Normaliza perfil Unicode'), 'print(decode_profile(\'{"name":" Lia ","tags":["Python","dados","python"]}\'))', b("{'name': 'Lia', 'tags': ['dados', 'python']}", "{'name': 'Lia', 'tags': ['dados', 'python']}"), 60, p19DecodeRequirements),
        exactTest('p19-guided-hidden', b('Rejects a missing name', 'Rejeita nome ausente'), 'try:\n    decode_profile(\'{"tags":[]}\')\nexcept ValueError as error:\n    print(error)', b('name is required', 'name is required'), 40, [...p19DecodeRequirements, { kind: 'node', value: 'Raise' }], true),
      ], difficulty: 'guided', objective: b('Deserialize, validate and normalize an external JSON object.', 'Desserialize, valide e normalize objeto JSON externo.'),
      workplaceContext: b('Profile APIs must not pass malformed external shape directly into UI code.', 'APIs de perfil não devem enviar formato externo malformado direto à interface.'), successCriteria: success,
      commonMistakes: { en: ['Trusting json.loads as full validation.', 'Using bool on arbitrary strings.', 'Returning unknown keys unchanged.'], pt: ['Confiar em json.loads como validação completa.', 'Usar bool em strings arbitrárias.', 'Retornar chaves desconhecidas.'] },
    }),
    makeExercise({
      id: 'p19-complete', title: b('Complete — encode stable settings JSON', 'Complete — codifique JSON estável de configurações'),
      description: b("Complete encode_settings(settings). Require a dictionary and return compact JSON with ensure_ascii=False, sort_keys=True and separators=(',', ':').", "Complete encode_settings(settings). Exija dicionário e retorne JSON compacto com ensure_ascii=False, sort_keys=True e separators=(',', ':')."),
      starterCode: 'def encode_settings(settings):\n    # Validate the root type and serialize deterministically.\n    pass', sampleOutput: b('{"language":"pt-BR","theme":"escuro"}', '{"language":"pt-BR","theme":"escuro"}'),
      hints: [b('Import json inside or above the function.', 'Importe json dentro ou acima da função.'), b('json.dumps accepts ensure_ascii, sort_keys and separators.', 'json.dumps aceita ensure_ascii, sort_keys e separators.')], requirements: p19EncodeRequirements,
      tests: [
        exactTest('p19-complete-public', b('Produces stable key order and readable accents', 'Produz ordem estável e acentos legíveis'), 'print(encode_settings({"theme":"escuro","language":"pt-BR"}))', b('{"language":"pt-BR","theme":"escuro"}', '{"language":"pt-BR","theme":"escuro"}'), 60, p19EncodeRequirements),
        exactTest('p19-complete-hidden', b('Rejects a non-object root', 'Rejeita raiz que não é objeto'), 'try:\n    encode_settings([])\nexcept ValueError as error:\n    print(error)', b('settings must be an object', 'settings must be an object'), 40, [...p19EncodeRequirements, { kind: 'node', value: 'Raise' }], true),
      ], difficulty: 'independent', objective: b('Create deterministic JSON that is easy to compare, cache and version.', 'Crie JSON determinístico fácil de comparar, armazenar e versionar.'),
      workplaceContext: b('Stable configuration serialization prevents noisy diffs and inconsistent cache keys.', 'Serialização estável evita diferenças ruidosas e chaves de cache inconsistentes.'), successCriteria: success,
      commonMistakes: { en: ['Leaving ensure_ascii at its default.', 'Depending on insertion order.', 'Serializing unsupported objects.'], pt: ['Deixar ensure_ascii padrão.', 'Depender da ordem de inserção.', 'Serializar objetos não suportados.'] },
    }),
    makeExercise({
      id: 'p19-zero', title: b('From scratch — calculate a validated JSON order total', 'Do zero — calcule total validado de pedido JSON'),
      description: b('Create order_total(text). Parse a JSON array of items with numeric price and non-negative integer quantity. Return the rounded total and reject invalid items.', 'Crie order_total(text). Interprete array JSON de itens com price numérico e quantity inteiro não negativo. Retorne total arredondado e rejeite itens inválidos.'),
      starterCode: 'def order_total(text):\n    pass', sampleOutput: b('25.5', '25.5'),
      hints: [b('Reject bool explicitly when checking numeric or integer values.', 'Rejeite bool explicitamente ao verificar números ou inteiros.'), b('Sum price * quantity and round(total, 2).', 'Some price * quantity e use round(total, 2).')], requirements: p19OrderRequirements,
      tests: [
        exactTest('p19-zero-public', b('Calculates mixed integer and decimal prices', 'Calcula preços inteiros e decimais'), 'print(order_total(\'[{"price":10,"quantity":2},{"price":5.5,"quantity":1},{"price":1000000,"quantity":0}]\'))', b('25.5', '25.5'), 60, p19OrderRequirements),
        exactTest('p19-zero-hidden', b('Rejects a negative quantity', 'Rejeita quantidade negativa'), 'try:\n    order_total(\'[{"price":10,"quantity":-1}]\')\nexcept ValueError as error:\n    print(error)', b('invalid item', 'invalid item'), 40, [...p19OrderRequirements, { kind: 'node', value: 'Raise' }], true),
      ], difficulty: 'independent', objective: b('Validate nested JSON values before a financial calculation.', 'Valide valores JSON aninhados antes de cálculo financeiro.'),
      workplaceContext: b('Checkout services must reject malformed quantities instead of producing a plausible wrong total.', 'Checkouts devem rejeitar quantidades malformadas em vez de total errado plausível.'), successCriteria: success,
      commonMistakes: { en: ['Accepting booleans as numbers.', 'Ignoring missing keys.', 'Rounding each item instead of the agreed final total.'], pt: ['Aceitar booleanos como números.', 'Ignorar chaves ausentes.', 'Arredondar cada item em vez do total acordado.'] },
    }),
    makeExercise({
      id: 'p19-transfer', title: b('Challenge — update a JSON file', 'Desafio — atualize um arquivo JSON'),
      description: b('Create update_json_file(path, key, value). Load a JSON object, set the key, write deterministic UTF-8 JSON back and return the number of keys.', 'Crie update_json_file(path, key, value). Carregue objeto JSON, defina a chave, grave JSON UTF-8 determinístico e retorne número de chaves.'),
      starterCode: 'def update_json_file(path, key, value):\n    pass', sampleOutput: b('2\n{"language":"pt-BR","theme":"dark"}', '2\n{"language":"pt-BR","theme":"dark"}'),
      hints: [b('Use json.load(file) and require a dictionary.', 'Use json.load(file) e exija dicionário.'), b("Write with ensure_ascii=False, sort_keys=True and separators=(',', ':').", "Grave com ensure_ascii=False, sort_keys=True e separators=(',', ':').")], requirements: p19FileRequirements,
      tests: [
        exactTest('p19-transfer-public', b('Updates and rewrites a settings object', 'Atualiza e regrava configurações'), 'path = "/tmp/p19-settings.json"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write(\'{"theme":"dark"}\')\nprint(update_json_file(path, "language", "pt-BR"))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read())', b('2\n{"language":"pt-BR","theme":"dark"}', '2\n{"language":"pt-BR","theme":"dark"}'), 60, p19FileRequirements),
        exactTest('p19-transfer-hidden', b('Preserves accented Unicode values', 'Preserva valores Unicode acentuados'), 'path = "/tmp/p19-unicode.json"\nwith open(path, "w", encoding="utf-8") as file:\n    file.write("{}")\nprint(update_json_file(path, "city", "São Paulo"))\nwith open(path, "r", encoding="utf-8") as file:\n    print(file.read())', b('1\n{"city":"São Paulo"}', '1\n{"city":"São Paulo"}'), 40, p19FileRequirements, true),
      ], difficulty: 'challenge', objective: b('Round-trip a validated JSON object through a real virtual file.', 'Faça ida e volta de objeto JSON validado por arquivo virtual real.'),
      workplaceContext: b('Settings editors must preserve Unicode and produce stable output after every update.', 'Editores de configuração devem preservar Unicode e produzir saída estável.'), successCriteria: success,
      commonMistakes: { en: ['Using loads with a file object.', 'Writing Python repr instead of JSON.', 'Accepting a list root.'], pt: ['Usar loads com objeto de arquivo.', 'Gravar repr Python em vez de JSON.', 'Aceitar raiz lista.'] },
    }),
  ],
  quiz: [
    { id: 'q19-1', question: b('Which function parses JSON text stored in a string?', 'Qual função interpreta JSON armazenado em string?'), options: [b('json.loads', 'json.loads'), b('json.load', 'json.load'), b('json.dumps', 'json.dumps'), b('str.json', 'str.json')], correctIndex: 0, explanation: b('The s in loads indicates a string input.', 'O s em loads indica entrada string.') },
    { id: 'q19-2', question: b('What does valid JSON syntax prove?', 'O que uma sintaxe JSON válida prova?'), options: [b('All business fields are correct.', 'Todos os campos estão corretos.'), b('Only that the text follows JSON grammar.', 'Apenas que o texto segue a gramática JSON.'), b('The file is encrypted.', 'O arquivo está criptografado.'), b('Every number is positive.', 'Todo número é positivo.')], correctIndex: 1, explanation: b('Shape and domain validation still need application code.', 'Formato e domínio ainda precisam de validação do aplicativo.') },
    { id: 'q19-3', question: b('Which option keeps café readable rather than escaped?', 'Qual opção mantém café legível em vez de escapado?'), options: [b('indent=False', 'indent=False'), b('sort_keys=False', 'sort_keys=False'), b('ensure_ascii=False', 'ensure_ascii=False'), b('allow_nan=True', 'allow_nan=True')], correctIndex: 2, explanation: b('ensure_ascii=False writes Unicode characters directly.', 'ensure_ascii=False grava caracteres Unicode diretamente.') },
    { id: 'q19-4', question: b('What exception usually reports malformed JSON syntax?', 'Qual exceção geralmente informa sintaxe JSON malformada?'), options: [b('PermissionError', 'PermissionError'), b('IndexError', 'IndexError'), b('StopIteration', 'StopIteration'), b('json.JSONDecodeError', 'json.JSONDecodeError')], correctIndex: 3, explanation: b('JSONDecodeError includes location details.', 'JSONDecodeError inclui detalhes de localização.') },
  ],
  exam: {
    title: b('Exam — normalize a catalog payload', 'Exame — normalize um payload de catálogo'),
    scenario: b('Create normalize_catalog(text). Parse a JSON array, validate name and non-negative numeric price, sort by name and return compact deterministic JSON.', 'Crie normalize_catalog(text). Interprete array JSON, valide name e preço numérico não negativo, ordene por nome e retorne JSON compacto determinístico.'),
    requirements: { en: ['Use json.loads and json.dumps.', 'Require a list root.', 'Validate each item.', 'Sort by name.', 'Preserve Unicode.'], pt: ['Use json.loads e json.dumps.', 'Exija raiz lista.', 'Valide cada item.', 'Ordene por nome.', 'Preserve Unicode.'] },
    starterCode: 'def normalize_catalog(text):\n    pass',
    expectedOutput: b('[{"name":"Café","price":8.5},{"name":"Tea","price":4}]', '[{"name":"Café","price":8.5},{"name":"Tea","price":4}]'),
    testCases: [
      exactTest('p19-exam-visible', b('Normalizes, sorts and preserves accents', 'Normaliza, ordena e preserva acentos'), 'print(normalize_catalog(\'[{"name":"Tea","price":4},{"name":" Café ","price":8.5}]\'))', b('[{"name":"Café","price":8.5},{"name":"Tea","price":4}]', '[{"name":"Café","price":8.5},{"name":"Tea","price":4}]'), 60, [{ kind: 'function', value: 'normalize_catalog' }, { kind: 'import', value: 'json' }, { kind: 'call', value: 'loads' }, { kind: 'call', value: 'dumps' }, { kind: 'node', value: 'Return' }]),
      exactTest('p19-exam-empty', b('Handles an empty catalog', 'Trata catálogo vazio'), 'print(normalize_catalog(\'[]\'))', b('[]', '[]'), 20, [{ kind: 'function', value: 'normalize_catalog' }, { kind: 'import', value: 'json' }, { kind: 'node', value: 'Return' }], true),
      exactTest('p19-exam-hidden-hardening', b('Rejects a negative price', 'Rejeita preço negativo'), 'try:\n    normalize_catalog(\'[{"name":"Bad","price":-1}]\')\nexcept ValueError as error:\n    print(error)', b('invalid catalog item', 'invalid catalog item'), 20, [{ kind: 'function', value: 'normalize_catalog' }, { kind: 'node', value: 'Raise' }], true),
    ],
  },
}

const phase20Blocks: LessonBlock[] = [
  heading('🌍 World hook — deadlines are business rules expressed with time', '🌍 Gancho do mundo real — prazos são regras de negócio expressas com tempo'),
  text(
    'A logistics platform estimates delivery dates, a school portal closes an assignment window, a restaurant schedules reservations and a support team measures response time. These decisions depend on dates, durations and time zones. Strings such as 2026-07-15 are useful for transport, but calculations require date or datetime objects. Professional time code parses at boundaries, calculates with timedelta and formats only when presenting or serializing the result.',
    'Uma plataforma de logística estima entregas, um portal escolar fecha atividade, um restaurante agenda reservas e um atendimento mede resposta. Essas decisões dependem de datas, durações e fusos. Strings como 2026-07-15 servem para transporte, mas cálculos exigem objetos date ou datetime. Código profissional interpreta nas fronteiras, calcula com timedelta e formata apenas ao apresentar ou serializar o resultado.',
  ),
  text(
    'Time bugs are expensive because programs can appear correct until a month boundary, leap year, daylight-saving transition or user in another zone. The solution is not memorizing every calendar rule; Python datetime already knows them. Your responsibility is to choose the correct type, reject ambiguous input, inject the reference time for tests and distinguish a calendar date from an exact instant. Every deadline rule must also state whether its boundary is inclusive or exclusive.',
    'Bugs de tempo são caros porque o programa pode parecer correto até mudar mês, ano bissexto, horário de verão ou usuário em outro fuso. A solução não é memorizar todas as regras; datetime já conhece. Sua responsabilidade é escolher o tipo correto, rejeitar entrada ambígua, injetar a referência nos testes e distinguir data de calendário de instante exato. Toda regra de prazo também deve dizer se o limite é inclusivo ou exclusivo.',
  ),
  heading('🧩 Physical analogy — calendar pages, stopwatch durations and world clocks', '🧩 Analogia física — páginas de calendário, duração de cronômetro e relógios mundiais'),
  text(
    'A date is a page on a calendar: year, month and day without a clock. A datetime combines the calendar page with a time of day. A timedelta is the measured distance between two points in time, like a stopwatch duration. Adding a duration to a date moves to another page; subtracting dates produces a duration. strptime reads a printed label into an object, while strftime prints an object using a chosen label format.',
    'Uma date é página de calendário: ano, mês e dia sem relógio. Um datetime combina página e hora. Um timedelta é a distância entre dois pontos, como duração de cronômetro. Somar duração move para outra página; subtrair datas produz duração. strptime lê um rótulo impresso e cria objeto, enquanto strftime imprime o objeto no formato escolhido.',
  ),
  text(
    'A time zone is like selecting which world clock an instant should be displayed on. A naive datetime has no zone information, while an aware datetime has tzinfo. Comparing naive and aware datetimes raises TypeError because Python refuses to guess. For global systems, store exact instants in UTC and convert for display. For date-only rules such as a due date, use date when time of day does not matter.',
    'Fuso é como escolher em qual relógio mundial exibir um instante. Um datetime ingênuo não possui zona; um consciente possui tzinfo. Comparar os dois gera TypeError porque Python se recusa a adivinhar. Em sistemas globais, armazene instantes em UTC e converta para exibição. Para regras apenas de data, como vencimento, use date quando a hora não importa.',
  ),
  heading('🐍 Fundamentals 1 — parse and format explicit dates', '🐍 Fundamentos 1 — interprete e formate datas explícitas'),
  code(
    'from datetime import datetime\n\nopened = datetime.strptime("2026-07-15", "%Y-%m-%d").date()\nprint(opened.year)\nprint(opened.strftime("%d/%m/%Y"))',
    'from datetime import datetime\n\nabertura = datetime.strptime("2026-07-15", "%Y-%m-%d").date()\nprint(abertura.year)\nprint(abertura.strftime("%d/%m/%Y"))',
  ),
  text(
    'strptime means string parse time. The format must match the input exactly: %Y is a four-digit year, %m is month and %d is day. Invalid calendar values raise ValueError, so 2026-02-30 is rejected. ISO format YYYY-MM-DD is sortable and unambiguous across languages; use localized display formats only at presentation boundaries. date.fromisoformat is an even clearer choice when ISO input is guaranteed by the contract.',
    'strptime significa interpretar tempo a partir de string. O formato precisa corresponder: %Y é ano de quatro dígitos, %m mês e %d dia. Valores impossíveis geram ValueError, então 2026-02-30 é rejeitada. ISO YYYY-MM-DD é ordenável e sem ambiguidade; use formato local apenas na apresentação. date.fromisoformat é opção ainda mais clara quando a entrada ISO é garantida pelo contrato.',
  ),
  heading('🐍 Fundamentals 2 — calculate durations with timedelta', '🐍 Fundamentos 2 — calcule durações com timedelta'),
  code(
    'from datetime import date, timedelta\n\nordered = date.fromisoformat("2026-07-15")\nestimated = ordered + timedelta(days=4)\nelapsed = estimated - ordered\n\nprint(estimated.isoformat())\nprint(elapsed.days)',
    'from datetime import date, timedelta\n\npedido = date.fromisoformat("2026-07-15")\nestimada = pedido + timedelta(days=4)\ndecorrido = estimada - pedido\n\nprint(estimada.isoformat())\nprint(decorrido.days)',
  ),
  text(
    'timedelta(days=4) represents a duration, not a calendar date. Date arithmetic automatically crosses month and year boundaries and accounts for leap days. Subtracting dates yields a timedelta whose .days is an integer. With datetimes, total_seconds() captures days, seconds and microseconds; using only .seconds would ignore whole days. Choose the property that matches the business unit instead of relying on a convenient-looking attribute.',
    'timedelta(days=4) representa duração, não data. A aritmética cruza meses e anos e considera dias bissextos. Subtrair datas gera timedelta cujo .days é inteiro. Com datetimes, total_seconds() inclui dias, segundos e microssegundos; usar apenas .seconds ignora dias completos. Escolha a propriedade que corresponde à unidade de negócio em vez de confiar num atributo que apenas parece conveniente.',
  ),
  heading('🐍 Fundamentals 3 — inject the reference date', '🐍 Fundamentos 3 — injete a data de referência'),
  code(
    'from datetime import date\n\n\ndef deadline_status(opened_text, today, limit_days):\n    opened = date.fromisoformat(opened_text)\n    age = (today - opened).days\n    if age < 0:\n        raise ValueError("opened date is in the future")\n    return "overdue" if age > limit_days else "on-time"\n\nprint(deadline_status("2026-07-10", date(2026, 7, 20), 5))',
    'from datetime import date\n\n\ndef status_prazo(abertura_texto, hoje, limite_dias):\n    abertura = date.fromisoformat(abertura_texto)\n    idade = (hoje - abertura).days\n    if idade < 0:\n        raise ValueError("opened date is in the future")\n    return "overdue" if idade > limite_dias else "on-time"\n\nprint(status_prazo("2026-07-10", date(2026, 7, 20), 5))',
  ),
  text(
    'Calling date.today() inside every business function makes tests depend on the real day. Pass today or now as an argument at the rule boundary. The application entry point can obtain the current time once and inject it. This makes historical reprocessing and future simulations possible. The function also rejects a future opened date rather than silently producing a negative age. Deterministic time is a design decision, not only a testing trick.',
    'Chamar date.today() em toda função de negócio faz testes dependerem do dia real. Passe hoje ou agora como argumento na fronteira da regra. A entrada do aplicativo obtém o tempo atual uma vez e injeta. Isso permite reprocessamento histórico e simulação futura. A função também rejeita abertura futura em vez de produzir idade negativa silenciosamente. Tempo determinístico é decisão de desenho, não apenas truque de teste.',
  ),
  heading('🐍 Fundamentals 4 — aware datetimes for exact instants', '🐍 Fundamentos 4 — datetimes conscientes para instantes exatos'),
  code(
    'from datetime import datetime, timezone\n\nstarted = datetime.fromisoformat("2026-07-15T13:00:00+00:00")\nfinished = datetime.fromisoformat("2026-07-15T14:45:00+00:00")\nminutes = int((finished - started).total_seconds() / 60)\n\nprint(minutes)\nprint(finished.astimezone(timezone.utc).isoformat())',
    'from datetime import datetime, timezone\n\ninicio = datetime.fromisoformat("2026-07-15T13:00:00+00:00")\nfim = datetime.fromisoformat("2026-07-15T14:45:00+00:00")\nminutos = int((fim - inicio).total_seconds() / 60)\n\nprint(minutos)\nprint(fim.astimezone(timezone.utc).isoformat())',
  ),
  text(
    'An offset such as +00:00 makes the datetime aware. Subtraction between aware values represents elapsed real time. ISO 8601 carries date, time and an optional offset. timezone.utc is the standard UTC zone in the built-in library. Full regional daylight-saving rules require zoneinfo, which you will encounter later; the essential rule now is never mix naive and aware values silently or remove tzinfo just to make an error disappear.',
    'Um offset como +00:00 torna o datetime consciente. Subtrair valores conscientes representa tempo real decorrido. ISO 8601 transporta data, hora e offset opcional. timezone.utc é a zona UTC padrão. Regras regionais completas de horário de verão exigem zoneinfo, visto depois; a regra essencial agora é nunca misturar valores ingênuos e conscientes silenciosamente nem remover tzinfo só para o erro desaparecer.',
  ),
  heading('🏗️ Real scenario 1 — logistics delivery commitment', '🏗️ Cenário real 1 — compromisso de entrega logística'),
  code(
    'from datetime import date, timedelta\n\n\ndef estimated_delivery(order_date_text, handling_days, transit_days):\n    if handling_days < 0 or transit_days < 0:\n        raise ValueError("days must be non-negative")\n    order_date = date.fromisoformat(order_date_text)\n    estimate = order_date + timedelta(days=handling_days + transit_days)\n    return estimate.isoformat()\n\nprint(estimated_delivery("2026-07-30", 1, 4))',
    'from datetime import date, timedelta\n\n\ndef entrega_estimada(data_pedido_texto, dias_preparo, dias_transporte):\n    if dias_preparo < 0 or dias_transporte < 0:\n        raise ValueError("days must be non-negative")\n    data_pedido = date.fromisoformat(data_pedido_texto)\n    estimativa = data_pedido + timedelta(days=dias_preparo + dias_transporte)\n    return estimativa.isoformat()\n\nprint(entrega_estimada("2026-07-30", 1, 4))',
  ),
  text(
    'The rule uses calendar days because that is its stated contract. If the business later excludes weekends and holidays, adding ordinary days would be wrong and the contract must change. The function rejects negative durations and lets date.fromisoformat reject impossible dates. Crossing from July into August requires no manual month logic. Good temporal code states what kind of day or duration it means and avoids hiding policy in a generic variable named days.',
    'A regra usa dias corridos porque esse é o contrato declarado. Se o negócio passar a excluir fins de semana e feriados, somar dias comuns estará errado e o contrato deverá mudar. A função rejeita durações negativas e date.fromisoformat rejeita datas impossíveis. Cruzar julho para agosto não exige lógica manual. Bom código temporal declara qual tipo de dia ou duração significa e evita esconder política numa variável genérica chamada dias.',
  ),
  heading('🏗️ Real scenario 2 — education assignment window', '🏗️ Cenário real 2 — janela de atividade educacional'),
  code(
    'from datetime import datetime\n\n\ndef submission_state(opens_text, closes_text, submitted_text):\n    opens = datetime.fromisoformat(opens_text)\n    closes = datetime.fromisoformat(closes_text)\n    submitted = datetime.fromisoformat(submitted_text)\n    if not (opens.tzinfo and closes.tzinfo and submitted.tzinfo):\n        raise ValueError("all timestamps must include an offset")\n    if closes < opens:\n        raise ValueError("close time precedes open time")\n    if submitted < opens:\n        return "not-open"\n    if submitted <= closes:\n        return "accepted"\n    return "late"',
    'from datetime import datetime\n\n\ndef estado_envio(abre_texto, fecha_texto, envio_texto):\n    abre = datetime.fromisoformat(abre_texto)\n    fecha = datetime.fromisoformat(fecha_texto)\n    envio = datetime.fromisoformat(envio_texto)\n    if not (abre.tzinfo and fecha.tzinfo and envio.tzinfo):\n        raise ValueError("all timestamps must include an offset")\n    if fecha < abre:\n        raise ValueError("close time precedes open time")\n    if envio < abre:\n        return "not-open"\n    if envio <= fecha:\n        return "accepted"\n    return "late"',
  ),
  text(
    'The window uses exact instants with offsets, not date-only values. An assignment submitted at the closing instant is accepted because the contract uses <=. All timestamps must be aware so comparison has defined meaning. The function validates that the window itself is possible. Boundary decisions such as inclusive closing time should be explicit in code and covered by tests, not left to assumptions or copied from an unrelated system.',
    'A janela usa instantes exatos com offsets, não apenas datas. Uma atividade enviada exatamente no fechamento é aceita porque o contrato usa <=. Todos os instantes precisam de fuso para a comparação ter significado definido. A função valida que a janela é possível. Decisões como fechamento inclusivo devem estar explícitas e testadas, não deixadas em suposições ou copiadas de sistema sem relação.',
  ),
  heading('⚠️ Common errors and the real Python messages', '⚠️ Erros comuns e as mensagens reais do Python'),
  warning(
    "ValueError: day is out of range for month indicates an impossible date. ValueError from strptime often means the text does not match the format. TypeError: can't compare offset-naive and offset-aware datetimes means one value has tzinfo and another does not. AttributeError occurs when code tries .days on a date instead of on the timedelta produced by subtraction. Using timedelta.seconds instead of total_seconds() can lose whole days.",
    "ValueError: day is out of range for month indica data impossível. ValueError de strptime costuma indicar formato incompatível. TypeError: can't compare offset-naive and offset-aware datetimes significa que um valor possui tzinfo e outro não. AttributeError surge ao usar .days numa date em vez do timedelta da subtração. Usar timedelta.seconds no lugar de total_seconds() pode perder dias inteiros.",
  ),
  text(
    'Avoid manual date arithmetic such as adding one to the day field; it breaks at month boundaries. Avoid ambiguous inputs such as 03/04/2026 without a declared locale. Avoid calling now() repeatedly inside one report because records near a boundary can receive different reference times. Capture or inject one reference instant, then apply every rule against it. Tests should cover exact limits, leap days, month changes, future values and empty collections.',
    'Evite aritmética manual como somar um ao campo day; ela quebra na mudança de mês. Evite entradas ambíguas como 03/04/2026 sem localidade declarada. Evite chamar now() repetidamente num relatório, pois registros próximos à fronteira podem receber referências diferentes. Capture ou injete um instante e aplique todas as regras contra ele. Testes devem cobrir limites exatos, anos bissextos, mudança de mês, futuro e coleções vazias.',
  ),
  tip(
    '💡 Pro tip — choose date for calendar rules and aware datetime for exact global instants. Use ISO 8601 at system boundaries, UTC for storage, localized formats for display, timedelta for durations and an injected clock for deterministic business logic. Name the unit in variables and functions: calendar_days, business_days and elapsed_minutes are safer than a generic value.',
    '💡 Dica pro — escolha date para regras de calendário e datetime consciente para instantes globais. Use ISO 8601 nas fronteiras, UTC no armazenamento, formatos locais na exibição, timedelta para durações e relógio injetado para lógica determinística. Nomeie a unidade: dias_corridos, dias_uteis e minutos_decorridos são mais seguros que valor genérico.',
  ),
  heading('📋 Recap and bridge to the next phase', '📋 Resumo e ponte para a próxima fase'),
  text(
    'You can now parse and format ISO dates, add and subtract timedeltas, inject a reference date, calculate elapsed time and distinguish naive from aware datetimes. Files, JSON and dates now form a complete boundary toolkit: read text, deserialize structure, validate values and calculate time-based decisions. The next phase will use exceptions deliberately so failures can travel through these layers without becoming vague or being silently ignored.',
    'Agora você sabe interpretar e formatar datas ISO, somar e subtrair timedelta, injetar data de referência, calcular tempo decorrido e distinguir datetime ingênuo de consciente. Arquivos, JSON e datas formam um conjunto completo de fronteira: ler texto, desserializar estrutura, validar valores e decidir com tempo. A próxima fase usará exceções deliberadamente para falhas atravessarem essas camadas sem se tornarem vagas ou silenciosas.',
  ),
]

const p20BetweenRequirements: CodeRequirement[] = [{ kind: 'function', value: 'days_between' }, { kind: 'import', value: 'datetime' }, { kind: 'call', value: 'fromisoformat' }, { kind: 'node', value: 'Return' }]
const p20DueRequirements: CodeRequirement[] = [{ kind: 'function', value: 'due_date' }, { kind: 'import', value: 'datetime' }, { kind: 'call', value: 'fromisoformat' }, { kind: 'call', value: 'timedelta' }, { kind: 'node', value: 'Return' }]
const p20StatusRequirements: CodeRequirement[] = [{ kind: 'function', value: 'deadline_status' }, { kind: 'import', value: 'datetime' }, { kind: 'call', value: 'fromisoformat' }, { kind: 'node', value: 'Raise' }, { kind: 'node', value: 'Return' }]
const p20ScheduleRequirements: CodeRequirement[] = [{ kind: 'function', value: 'schedule_dates' }, { kind: 'import', value: 'datetime' }, { kind: 'call', value: 'fromisoformat' }, { kind: 'call', value: 'timedelta' }, { kind: 'node', value: 'Return' }]

export const phase20: Phase = {
  id: 20,
  title: b('Date and Time', 'Data e Hora'),
  description: b('Parse dates, calculate durations and design deterministic deadline rules.', 'Interprete datas, calcule durações e projete regras de prazo determinísticas.'),
  icon: '📅', libraries: [], track: 'core', stage: 'base', estimatedHours: 8,
  lesson: { title: b('Date and time: deterministic calendar and instant calculations', 'Data e hora: cálculos determinísticos de calendário e instantes'), blocks: phase20Blocks },
  exercises: [
    makeExercise({
      id: 'p20-guided', title: b('Guided — calculate days between ISO dates', 'Guiado — calcule dias entre datas ISO'),
      description: b('Implement days_between(start, end). Parse both YYYY-MM-DD values with date.fromisoformat and return end - start in whole days.', 'Implemente days_between(start, end). Interprete os dois valores YYYY-MM-DD com date.fromisoformat e retorne end - start em dias inteiros.'),
      starterCode: 'def days_between(start, end):\n    pass', sampleOutput: b('10', '10'),
      hints: [b('Import date from datetime.', 'Importe date de datetime.'), b('Subtract the date objects, then use .days.', 'Subtraia os objetos e use .days.')], requirements: p20BetweenRequirements,
      tests: [
        exactTest('p20-guided-public', b('Crosses a month boundary', 'Cruza uma mudança de mês'), 'print(days_between("2026-07-25", "2026-08-04"))', b('10', '10'), 60, p20BetweenRequirements),
        exactTest('p20-guided-hidden', b('Handles a leap day', 'Trata dia bissexto'), 'print(days_between("2028-02-28", "2028-03-01"))', b('2', '2'), 40, p20BetweenRequirements, true),
      ], difficulty: 'guided', objective: b('Convert transport strings to date objects before calendar arithmetic.', 'Converta strings de transporte em objetos date antes da aritmética.'),
      workplaceContext: b('Reports often measure age across month and year boundaries.', 'Relatórios medem idade atravessando meses e anos.'), successCriteria: success,
      commonMistakes: { en: ['Subtracting strings.', 'Manually counting month lengths.', 'Using timedelta.seconds.'], pt: ['Subtrair strings.', 'Contar dias do mês manualmente.', 'Usar timedelta.seconds.'] },
    }),
    makeExercise({
      id: 'p20-complete', title: b('Complete — calculate a due date', 'Complete — calcule uma data de vencimento'),
      description: b('Complete due_date(start, days). Reject negative days, add timedelta(days=days) and return ISO text.', 'Complete due_date(start, days). Rejeite dias negativos, some timedelta(days=days) e retorne texto ISO.'),
      starterCode: 'def due_date(start, days):\n    # Parse, validate, add a duration and format.\n    pass', sampleOutput: b('2027-01-03', '2027-01-03'),
      hints: [b('Use date.fromisoformat(start).', 'Use date.fromisoformat(start).'), b('Return result.isoformat().', 'Retorne result.isoformat().')], requirements: p20DueRequirements,
      tests: [
        exactTest('p20-complete-public', b('Crosses a year boundary', 'Cruza mudança de ano'), 'print(due_date("2026-12-30", 4))', b('2027-01-03', '2027-01-03'), 60, p20DueRequirements),
        exactTest('p20-complete-hidden', b('Rejects a negative duration', 'Rejeita duração negativa'), 'try:\n    due_date("2026-01-01", -1)\nexcept ValueError as error:\n    print(error)', b('days must be non-negative', 'days must be non-negative'), 40, [...p20DueRequirements, { kind: 'node', value: 'Raise' }], true),
      ], difficulty: 'independent', objective: b('Represent a duration with timedelta instead of manual date arithmetic.', 'Represente duração com timedelta em vez de aritmética manual.'),
      workplaceContext: b('Delivery and payment commitments often cross months or years.', 'Compromissos de entrega e pagamento atravessam meses ou anos.'), successCriteria: success,
      commonMistakes: { en: ['Adding to the day field manually.', 'Allowing negative duration without a contract.', 'Returning a date object when ISO text is required.'], pt: ['Somar manualmente ao campo day.', 'Aceitar duração negativa sem contrato.', 'Retornar date quando texto ISO é exigido.'] },
    }),
    makeExercise({
      id: 'p20-zero', title: b('From scratch — classify a deadline', 'Do zero — classifique um prazo'),
      description: b("Create deadline_status(opened, today, limit). Return 'overdue:N' when age > limit, otherwise 'on-time:N'. Reject future opened dates.", "Crie deadline_status(opened, today, limit). Retorne 'overdue:N' quando idade > limite, senão 'on-time:N'. Rejeite abertura futura."),
      starterCode: 'def deadline_status(opened, today, limit):\n    pass', sampleOutput: b('overdue:10', 'overdue:10'),
      hints: [b('Parse both values with date.fromisoformat.', 'Interprete os dois valores com date.fromisoformat.'), b('Age is (today_date - opened_date).days.', 'Idade é (data_hoje - data_abertura).days.')], requirements: p20StatusRequirements,
      tests: [
        exactTest('p20-zero-public', b('Classifies an overdue record', 'Classifica registro atrasado'), 'print(deadline_status("2026-07-01", "2026-07-11", 5))', b('overdue:10', 'overdue:10'), 60, p20StatusRequirements),
        exactTest('p20-zero-hidden', b('Rejects a future opened date', 'Rejeita abertura futura'), 'try:\n    deadline_status("2026-07-12", "2026-07-11", 5)\nexcept ValueError as error:\n    print(error)', b('opened date is in the future', 'opened date is in the future'), 40, p20StatusRequirements, true),
      ], difficulty: 'independent', objective: b('Apply an explicit deadline rule to parsed dates.', 'Aplique regra explícita de prazo a datas interpretadas.'),
      workplaceContext: b('Operational dashboards need reproducible status at a supplied reference date.', 'Painéis operacionais precisam de status reproduzível numa data fornecida.'), successCriteria: success,
      commonMistakes: { en: ['Calling date.today inside the function.', 'Treating age equal to limit as overdue.', 'Accepting negative age.'], pt: ['Chamar date.today dentro da função.', 'Tratar idade igual ao limite como atraso.', 'Aceitar idade negativa.'] },
    }),
    makeExercise({
      id: 'p20-transfer', title: b('Challenge — generate a schedule from offsets', 'Desafio — gere cronograma a partir de deslocamentos'),
      description: b('Create schedule_dates(start, offsets). Return ISO dates for every non-negative integer offset in original order. Reject booleans, negative or non-integer offsets.', 'Crie schedule_dates(start, offsets). Retorne datas ISO para cada deslocamento inteiro não negativo na ordem original. Rejeite booleanos, negativos ou não inteiros.'),
      starterCode: 'def schedule_dates(start, offsets):\n    pass', sampleOutput: b("['2026-07-15', '2026-07-16', '2026-08-14']", "['2026-07-15', '2026-07-16', '2026-08-14']"),
      hints: [b('Parse start once, then add timedelta for each offset.', 'Interprete start uma vez e some timedelta para cada deslocamento.'), b('bool is a subclass of int, so reject it explicitly.', 'bool é subclasse de int, então rejeite explicitamente.')], requirements: p20ScheduleRequirements,
      tests: [
        exactTest('p20-transfer-public', b('Creates short and large-offset dates', 'Cria datas com deslocamentos curtos e grandes'), 'print(schedule_dates("2026-07-15", [0, 1, 30]))', b("['2026-07-15', '2026-07-16', '2026-08-14']", "['2026-07-15', '2026-07-16', '2026-08-14']"), 60, p20ScheduleRequirements),
        exactTest('p20-transfer-hidden', b('Rejects a negative offset', 'Rejeita deslocamento negativo'), 'try:\n    schedule_dates("2026-07-15", [0, -1])\nexcept ValueError as error:\n    print(error)', b('invalid offset', 'invalid offset'), 40, [...p20ScheduleRequirements, { kind: 'node', value: 'Raise' }], true),
      ], difficulty: 'challenge', objective: b('Generalize date arithmetic across a collection while validating type boundaries.', 'Generalize aritmética de datas em coleção validando tipos.'),
      workplaceContext: b('Campaigns, maintenance plans and study schedules generate milestones from one anchor date.', 'Campanhas, manutenção e estudos geram marcos a partir de uma data base.'), successCriteria: success,
      commonMistakes: { en: ['Parsing the start repeatedly.', 'Sorting offsets when order is meaningful.', 'Accepting True as one day.'], pt: ['Interpretar início repetidamente.', 'Ordenar deslocamentos quando ordem importa.', 'Aceitar True como um dia.'] },
    }),
  ],
  quiz: [
    { id: 'q20-1', question: b('Which type represents a duration?', 'Qual tipo representa uma duração?'), options: [b('timedelta', 'timedelta'), b('date', 'date'), b('timezone only', 'somente timezone'), b('strptime', 'strptime')], correctIndex: 0, explanation: b('timedelta stores elapsed days, seconds and microseconds.', 'timedelta armazena dias, segundos e microssegundos decorridos.') },
    { id: 'q20-2', question: b('Why inject today into a business function?', 'Por que injetar hoje numa função de negócio?'), options: [b('To use more memory.', 'Para usar mais memória.'), b('To make results deterministic and testable.', 'Para tornar resultados determinísticos e testáveis.'), b('To avoid parsing.', 'Para evitar parsing.'), b('To change time zone automatically.', 'Para mudar fuso automaticamente.')], correctIndex: 1, explanation: b('A supplied reference date supports repeatable tests and reprocessing.', 'Uma referência fornecida permite testes repetíveis e reprocessamento.') },
    { id: 'q20-3', question: b('What happens when naive and aware datetimes are compared?', 'O que ocorre ao comparar datetimes ingênuo e consciente?'), options: [b('Python guesses UTC.', 'Python presume UTC.'), b('They are always equal.', 'São sempre iguais.'), b('Python raises TypeError.', 'Python gera TypeError.'), b('Both become dates.', 'Ambos viram dates.')], correctIndex: 2, explanation: b('Python refuses an ambiguous comparison.', 'Python recusa comparação ambígua.') },
    { id: 'q20-4', question: b('Which format is an unambiguous date boundary contract?', 'Qual formato é um contrato de data sem ambiguidade?'), options: [b('03/04/26', '03/04/26'), b('July-ish', 'Por volta de julho'), b('4-3', '4-3'), b('YYYY-MM-DD ISO 8601', 'YYYY-MM-DD ISO 8601')], correctIndex: 3, explanation: b('ISO year-month-day is language-independent and sortable.', 'ISO ano-mês-dia independe de idioma e é ordenável.') },
  ],
  exam: {
    title: b('Exam — deadline report', 'Exame — relatório de prazos'),
    scenario: b('Create deadline_report(records, today, limit=5). Validate ISO opened dates, reject future dates and return one sorted line per record as name|age|status.', 'Crie deadline_report(records, today, limit=5). Valide datas ISO, rejeite datas futuras e retorne uma linha ordenada por registro como name|age|status.'),
    requirements: { en: ['Parse today and every opened date.', 'Reject future opened dates.', 'Use overdue only when age > limit.', 'Sort by name.', 'Return a newline-joined string.'], pt: ['Interprete hoje e cada abertura.', 'Rejeite aberturas futuras.', 'Use overdue somente quando idade > limite.', 'Ordene por nome.', 'Retorne string unida por quebras.'] },
    starterCode: 'def deadline_report(records, today, limit=5):\n    pass',
    expectedOutput: b('Ana|10|overdue\nBeto|2|on-time', 'Ana|10|overdue\nBeto|2|on-time'),
    testCases: [
      exactTest('p20-exam-visible', b('Builds a deterministic mixed-status report', 'Cria relatório determinístico com status mistos'), 'records = [{"name":"Beto","opened":"2026-07-09"},{"name":"Ana","opened":"2026-07-01"}]\nprint(deadline_report(records, "2026-07-11", 5))', b('Ana|10|overdue\nBeto|2|on-time', 'Ana|10|overdue\nBeto|2|on-time'), 60, [{ kind: 'function', value: 'deadline_report' }, { kind: 'import', value: 'datetime' }, { kind: 'call', value: 'fromisoformat' }, { kind: 'call', value: 'join' }, { kind: 'node', value: 'Return' }]),
      exactTest('p20-exam-empty', b('Handles an empty report', 'Trata relatório vazio'), 'print(repr(deadline_report([], "2026-07-11", 5)))', b("''", "''"), 20, [{ kind: 'function', value: 'deadline_report' }, { kind: 'import', value: 'datetime' }, { kind: 'node', value: 'Return' }], true),
      exactTest('p20-exam-hidden-hardening', b('Rejects a future record', 'Rejeita registro futuro'), 'try:\n    deadline_report([{"name":"Future","opened":"2026-07-12"}], "2026-07-11", 5)\nexcept ValueError as error:\n    print(error)', b('opened date is in the future', 'opened date is in the future'), 20, [{ kind: 'function', value: 'deadline_report' }, { kind: 'node', value: 'Raise' }], true),
    ],
  },
}
