import type { Bilingual, Lang } from '../data/types'

export type LocalizedText = string | Bilingual

export function resolveLocalizedText(value: LocalizedText | undefined, lang: Lang): string {
  if (!value) return ''
  return typeof value === 'string' ? value : value[lang] || value.en || value.pt || ''
}

const exactPt: Record<string, string> = {
  // Phases 52-68 lesson comments — authored 2026-07-30.
  "pyproject.toml defines package metadata and tools":
    "pyproject.toml define os metadados e as ferramentas do pacote",
  "CI runs from a clean checkout:":
    "O CI roda a partir de um checkout limpo:",
  "install the wheel and run smoke tests":
    "instale o wheel e rode os testes de fumaça",
  "Time-dependent deployment usually needs a chronological split.":
    "Implantação dependente do tempo geralmente exige uma divisão cronológica.",
  "choose threshold from decision costs, not convenience":
    "escolha o limiar pelos custos da decisão, não pela conveniência",
  "Save model.state_dict(), optimizer.state_dict(), epoch and configuration.":
    "Salve os estados com model.state_dict() e optimizer.state_dict(), junto da época e da configuração.",
  "In real LLMs, subword tokenizers avoid treating every unseen word as unknown.":
    "Em LLMs reais, tokenizadores de subpalavras evitam tratar toda palavra nova como desconhecida.",
  "2. Every factual answer carries source IDs.":
    "2. Toda resposta factual carrega IDs de fonte.",
  "4. Evaluation dataset tracks retrieval recall and answer faithfulness.":
    "4. O conjunto de avaliação acompanha o recall da busca e a fidelidade das respostas.",
  "5. Tool calls are allowlisted and destructive actions require confirmation.":
    "5. Chamadas de ferramenta passam por lista de permissão e ações destrutivas exigem confirmação.",
  "6. LoRA adapter, if used, is versioned separately from the base model.":
    "6. O adaptador LoRA, se usado, é versionado separadamente do modelo base.",
  // Comments the word-level fallback left in two languages at once. A learner reading
  // "# Construa the laço:" is worse off than one reading "# Build the loop:", because the
  // second can be looked up and the first looks like a broken app. Found by
  // `npm run audit:portunol`, which now fails the build if the list grows.
  'Build the loop:': 'Construa o laço:',
  'the user types 30': 'o usuário digita 30',
  'the user types 5': 'o usuário digita 5',
  'Client profile with calculations.': 'Perfil do cliente com cálculos.',
  'any age — number, no quotes': 'qualquer idade — número, sem aspas',
  // The key is the WHOLE comment, from the first '#' to the end of the line. These two
  // start with commented-out code, so an entry for the readable half never matched and
  // the fallback translated around it — `# ❌ TypeError! texto + número = crash`.
  'print(age + 5)                  # ❌ TypeError! text + number = crash':
    'print(age + 5)                  # ❌ TypeError! texto + número = erro',
  '4  — tie goes to the even number': '4  — empate vai para o número par',
  'Wrap each in try/except with the correct exception:':
    'Envolva cada um em try/except com a exceção correta:',
  'Shared mutation: redesign first, lock only the smallest critical section':
    'Mutação compartilhada: redesenhe primeiro, trave apenas a menor seção crítica',
  'str(x)    → back to text     str(42) → "42"': 'str(x)    → de volta para texto     str(42) → "42"',
  '✅ FIX: use float() when decimals are possible': '✅ CORREÇÃO: use float() quando houver casas decimais',
  'checked ONLY if first was False': 'verificado SOMENTE se o primeiro for False',
  'loop by INDEX to pair two lists': 'laço por ÍNDICE para parear duas listas',
  'fill: bigger than': 'preencha: maior que',
  'same number every single run': 'o mesmo número em toda execução',
  'fill: which key to update?': 'preencha: qual chave atualizar?',
  'fill: compare which key?': 'preencha: comparar qual chave?',
  'fill: middle index': 'preencha: índice do meio',
  'A dump: correct, and useless to a reader': 'Um despejo: correto, e inútil para quem lê',
  '1. Works after model and index are downloaded, with network disconnected.':
    '1. Funciona depois que o modelo e o índice forem baixados, com a rede desconectada.',
  // Found once the English-marker list was widened. Every one of these had been reaching a
  // Portuguese learner as English or, worse, as half-Portuguese: "5 (// gives inteiro
  // numbers)", "4 — how many itens", "Weekly Verifique: review every course module".
  '5    (// gives whole numbers)': '5    (// dá números inteiros)',
  'When is % (modulo) useful? Checking even/odd, splitting evenly:':
    'Quando o % (módulo) é útil? Verificar par/ímpar, dividir em partes iguais:',
  '❌ 40.0 — only 30 was divided!': '❌ 40.0 — só o 30 foi dividido!',
  'Problem: real business has MORE than 2 categories!':
    'Problema: um negócio real tem MAIS de 2 categorias!',
  '4 — how many items': '4 — quantos itens',
  'Weekly check: review every course module': 'Verificação semanal: revise cada módulo do curso',
  // Phases 21-27 comments.
  '8% each year': '8% ao ano',
  'An answer: the same data, described': 'Uma resposta: os mesmos dados, descritos',
  'Named: each operation has one place to live': 'Nomeado: cada operação tem um lugar só',
  'Separated: the maths knows nothing about input or printing':
    'Separado: a conta não sabe nada sobre entrada nem impressão',
  'ValueError if they type "abc"': 'ValueError se digitarem "abc"',
  'and again, identical': 'e de novo, idêntico',
  'how many were removed': 'quantos foram removidos',
  'reorders songs itself': 'reordena as próprias músicas',
  'Without a net: the program stops here': 'Sem rede de proteção: o programa para aqui',
  'only when nothing failed': 'somente quando nada falhou',
  'the person types: abc, then 7': 'a pessoa digita: abc, depois 7',
  'two different songs': 'duas músicas diferentes',
  '✅ SYSTEM: structured, persistent, robust': '✅ SISTEMA: estruturado, persistente, robusto',
  'The model never executes arbitrary Python directly.':
    'O modelo nunca executa Python arbitrário diretamente.',
  'Application code validates tool name, argument schema, user permission and activity logging.':
    'O código da aplicação valida o nome da ferramenta, o esquema dos argumentos, a permissão do usuário e o registro de atividade.',

  // phases 9-20
  'Write the complete solution.': 'Escreva a solução completa.',
  'Returns the area': 'Retorna a área',
  'the file contains: abc': 'o arquivo contém: abc',
  'Validate and append the normalized record.': 'Valide e adicione o registro normalizado.',
  'Validate the root type and serialize deterministically.': 'Valide o tipo raiz e serialize de forma determinística.',
  'Parse, validate, add a duration and format.': 'Interprete, valide, some uma duração e formate.',
  // Added after a Portuguese learner reported English in the app. The word-level
  // fallback below turns an unlisted comment into Portunhol — "Build the 4-tier
  // waterfall (highest primeiro!)" — which is worse than leaving it in English,
  // so every one of these is an exact entry.
  'Age: 28': 'Idade: 28',
  'Name: Alice | Age: 28': 'Nome: Alice | Idade: 28',
  'Floor division  → 3  (drops the decimal)': 'Divisão inteira  → 3  (descarta a parte decimal)',
  'Modulo          → 1  (only the remainder)': 'Módulo           → 1  (apenas o resto)',
  'Power           → 1024  (2 to the 10th)': 'Potência         → 1024  (2 elevado a 10)',
  '20  (parentheses force order)': '20  (os parênteses forçam a ordem)',
  '✅ 20.0 — correct average': '✅ 20.0 — média correta',
  'How many $50 chairs fit in the equipment budget?': 'Quantas cadeiras de $50 cabem no orçamento de equipamentos?',
  'Split into 4 categories and print all 5 lines:': 'Divida em 4 categorias e imprima as 5 linhas:',
  'Calculate: total, average, reserve (10%), remaining': 'Calcule: total, média, reserva (10%), restante',
  'shorthand: same as score = score + 5 → 15': 'forma curta: o mesmo que score = score + 5 → 15',
  'Ana Souza is 32 years old': 'Ana Souza tem 32 anos',
  'In 10 years: 42': 'Daqui a 10 anos: 42',
  'New subscription client registration': 'Cadastro de novo cliente de assinatura',
  'any name — text needs quotes!': 'qualquer nome — texto precisa de aspas!',
  'fill the operator': 'preencha o operador',
  'Choose your own name, age and monthly fee — the grader checks the maths, not the values.': 'Escolha seu próprio nome, idade e mensalidade — a correção verifica a conta, não os valores.',
  'phone = int(input("Phone: "))  → "555-1234" crashes int()!': 'telefone = int(input("Telefone: "))  → "555-1234" quebra o int()!',
  'Phone, ZIP code, ID numbers → keep as text!': 'Telefone, CEP, números de documento → mantenha como texto!',
  'Interactive order intake:': 'Recebimento interativo de pedidos:',
  'fill: >, and, <': 'preencha: >, and, <',
  'Cinema age gate:': 'Controle de idade do cinema:',
  'Cinema ticket price by age': 'Preço do ingresso de cinema por idade',
  'Device check: grade a phone battery by health percentage': 'Verificação do aparelho: classifique a bateria pela porcentagem de saúde',
  'Movie rating classifier:': 'Classificador de avaliação de filmes:',
  'Build the 4-tier waterfall (highest first!):': 'Monte a cascata de 4 faixas (da maior para a menor!):',
  'fill: keep going while stock >= 15': 'preencha: continue enquanto stock >= 15',
  'fill: consume 15 cups': 'preencha: consuma 15 copos',
  'fill: next order': 'preencha: próximo pedido',
  'Diana   (negative = from the end!)': 'Diana   (negativo = a partir do fim!)',
  '% complete, same order!': '% concluído, na mesma ordem!',
  'Analyze the playlist:': 'Analise a playlist:',
  'Build your dashboard:': 'Monte seu painel:',
  'condition + colon': 'condição + dois-pontos',
  'indented = inside the if': 'indentado = dentro do if',
  'still inside': 'ainda dentro do bloco',
  'runs only if condition is False': 'executa somente se a condição for False',
  'NOT indented = always runs': 'SEM indentação = sempre executa',
  'THE 6 COMPARISON OPERATORS:': 'OS 6 OPERADORES DE COMPARAÇÃO:',
  'True   greater than': 'True   maior que',
  'False  less than': 'False  menor que',
  'True   greater OR equal': 'True   maior OU igual',
  'False  less OR equal': 'False  menor OU igual',
  'True   equal (TWO equals signs!)': 'True   igual (DOIS sinais de igual!)',
  'True   NOT equal': 'True   diferente',
  'AND — both must be True': 'AND — as duas condições devem ser True',
  'OR — at least one must be True': 'OR — pelo menos uma condição deve ser True',
  'NOT — inverts the condition': 'NOT — inverte a condição',
  'Comparing TEXT works too (case-sensitive!)': 'Comparar TEXTO também funciona (diferencia maiúsculas e minúsculas!)',
  '"Approved" != "approved" — capital letters matter!': '"Approved" != "approved" — letras maiúsculas fazem diferença!',
  'Site safety gate: wind speed and crane operations': 'Regra de segurança da obra: velocidade do vento e operação do guindaste',
  '❌ MISTAKE 1: single = in condition': '❌ ERRO 1: usar apenas = na condição',
  'if x = 10:          → SyntaxError! = assigns, == compares': 'if x = 10:          → SyntaxError! = atribui, == compara',
  '✅ FIX:': '✅ CORREÇÃO:',
  '❌ MISTAKE 2: forgetting the colon': '❌ ERRO 2: esquecer os dois-pontos',
  "if x > 5            → SyntaxError: expected ':'": "if x > 5            → SyntaxError: era esperado ':'",
  '❌ MISTAKE 3: wrong indentation': '❌ ERRO 3: indentação incorreta',
  'print("big")        → IndentationError!': 'print("big")        → IndentationError!',
  '✅ FIX: indent 4 spaces inside the if': '✅ CORREÇÃO: indente 4 espaços dentro do if',
  '❌ MISTAKE 4: comparing number with text': '❌ ERRO 4: comparar número com texto',
  'returns "10" (text!)': 'retorna "10" (texto!)',
  'if guess == 10:            → always False! "10" != 10': 'if guess == 10:            → sempre False! "10" != 10',
  '✅ FIX: convert first': '✅ CORREÇÃO: converta primeiro',
  'print() shows things on the screen': 'print() mostra informações na tela',
  'text needs quotes': 'texto precisa de aspas',
  "numbers don't": 'números não precisam',
  'math is calculated first → 15': 'a conta é calculada primeiro → 15',
  'Print multiple things at once (separated by commas)': 'Mostre várias informações de uma vez (separadas por vírgulas)',
  'The comma adds a space automatically!': 'A vírgula adiciona um espaço automaticamente!',
  'Single or double quotes — both work': 'Aspas simples ou duplas — ambas funcionam',
  'But be careful when text CONTAINS a quote:': 'Mas tenha cuidado quando o texto CONTÉM uma aspa:',
  '✅ double outside, single inside': '✅ aspas duplas por fora, simples por dentro',
  '✅ single outside, double inside': '✅ aspas simples por fora, duplas por dentro',
  'Comments: everything after # is IGNORED by Python': 'Comentários: tudo depois de # é IGNORADO pelo Python',
  'this note is ignored': 'esta observação é ignorada',
  'Empty print() creates a blank line': 'print() vazio cria uma linha em branco',
  'blank line here': 'linha em branco aqui',
  'Order of operations: * and / BEFORE + and -': 'Ordem das operações: * e / ANTES de + e -',
  'Real trap: calculating average': 'Armadilha real: cálculo da média',
  'only 30 was divided!': 'apenas 30 foi dividido!',
  'correct average': 'média correta',
  'Step-by-step insurance total': 'Cálculo do pagamento do seguro passo a passo',
  'Step 1: subtract discount': 'Etapa 1: subtraia a desconto',
  'Step 2: apply 80% coverage': 'Etapa 2: aplique 80% de cobertura',
  'Step 3: subtract 2% processing fee': 'Etapa 3: subtraia a taxa de processamento de 2%',
  'Sanity check: percentages must total 100%': 'Verificação: as porcentagens devem somar 100%',
  'floor division!': 'divisão inteira!',
  'remainder!': 'resto!',
  'label = value': 'rótulo = valor',
  'str  (text, needs quotes)': 'str  (texto, precisa de aspas)',
  'int  (whole number)': 'int  (número inteiro)',
  'float (decimal number)': 'float (número decimal)',
  'bool (True or False, capital first letter!)': 'bool (True ou False, primeira letra maiúscula!)',
  'Use them by name': 'Use as variáveis pelo nome',
  'Combine in calculations': 'Combine em cálculos',
  "Check any variable's type": 'Consulte o tipo de qualquer variável',
  'Variables can be UPDATED anytime': 'Variáveis podem ser ATUALIZADAS a qualquer momento',
  'Building text with + (concatenation)': 'Criando texto com + (concatenação)',
  "don't forget the space!": 'não esqueça o espaço!',
  'Building text with f-strings (the modern way)': 'Criando texto com f-strings (a forma moderna)',
  'f-strings can even do math inside the braces:': 'f-strings também podem fazer contas dentro das chaves:',
  'New insurance client registration': 'Cadastro de novo cliente de seguros',
  'Derived values (calculated FROM other variables)': 'Valores derivados (calculados A PARTIR de outras variáveis)',
  'start the accumulator at zero': 'inicie o acumulador em zero',
  'The variable REMEMBERS between operations.': 'A variável GUARDA o valor entre as operações.',
  "That's the superpower a calculator doesn't have.": 'Esse é o poder que uma calculadora comum não possui.',
  'input() shows a message and waits for typing': 'input() mostra uma mensagem e aguarda a digitação',
  'The message is the PROMPT — always end with ": " or "? "': 'A mensagem é o PROMPT — termine com ": " ou "? "',
  "so the user knows it's their turn to type": 'para que o usuário saiba que é sua vez de digitar',
  '⚠️ input() ALWAYS returns a string — even numbers!': '⚠️ input() SEMPRE retorna uma string — até para números!',
  '✅ THE FIX: convert with int() or float()': '✅ A CORREÇÃO: converta com int() ou float()',
  'CONVERSION CHEAT SHEET:': 'RESUMO DE CONVERSÕES:',
  'text, no conversion': 'texto, sem conversão',
  'phone is TEXT (has dashes!)': 'telefone é TEXTO (possui hífens!)',
  'number for math': 'número para cálculos',
  'float — meters have decimals!': 'float — metros podem ter casas decimais!',
  'no conversion needed — remove ___ and parens or use str': 'não precisa converter — remova ___ e os parênteses ou use str',
  'whole number math': 'cálculo com número inteiro',
  'decimal math': 'cálculo com número decimal',
  'already correct — no math on phones!': 'já está correto — não fazemos cálculos com telefone!',
  'Build your decision logic:': 'Construa sua lógica de decisão:',
  'everything else lands here': 'todos os outros casos chegam aqui',
  'Python reads TOP to BOTTOM and stops at the FIRST True.': 'O Python lê de CIMA PARA BAIXO e para no PRIMEIRO True.',
  'young drivers: highest risk': 'motoristas jovens: maior risco',
  'prime bracket: base rate': 'faixa principal: tarifa-base',
  'The 3-piece anatomy': 'A estrutura em 3 partes',
  '1️⃣ starting state': '1️⃣ estado inicial',
  '2️⃣ keep-going condition': '2️⃣ condição para continuar',
  '3️⃣ progress! (CRITICAL)': '3️⃣ progresso! (CRÍTICO)',
  'runs after loop ends': 'executa depois que o laço termina',
  'PATTERN 1: accumulator inside a loop': 'PADRÃO 1: acumulador dentro de um laço',
  'PATTERN 2: break — emergency exit': 'PADRÃO 2: break — saída de emergência',
  'PATTERN 3: validation loop (ask until valid)': 'PADRÃO 3: laço de validação (pergunte até ser válido)',
  'infinite on purpose!': 'infinito de propósito!',
  'jumps out immediately': 'sai imediatamente',
  'Square brackets create a list': 'Colchetes criam uma lista',
  'Access by POSITION — starts at 0!': 'Acesse pela POSIÇÃO — começa em 0!',
  'Useful list tools': 'Ferramentas úteis para listas',
  'add to the end': 'adicione ao final',
  'sum all numbers': 'soma todos os números',
  'biggest': 'maior valor',
  'list ends → loop ends. No counter needed!': 'a lista termina → o laço termina. Não precisa de contador!',
  'range() generates number sequences to loop over:': 'range() gera sequências numéricas para percorrer:',
  'filter inside the loop!': 'filtre dentro do laço!',
}

const phraseRules: Array<[RegExp, string]> = [
  [/\bMISTAKE\b/gi, 'ERRO'],
  [/\bFIX\b/gi, 'CORREÇÃO'],
  [/\bWRONG\b/gi, 'ERRADO'],
  [/\bCORRECT\b/gi, 'CORRETO'],
  [/\bOutput\b/gi, 'Saída'],
  [/\bStep\b/gi, 'Etapa'],
  [/\bPrint\b/gi, 'Mostre'],
  [/\bprints\b/gi, 'mostra'],
  [/\bfill\b/gi, 'preencha'],
  [/\bBuild\b/gi, 'Construa'],
  [/\bCalculate\b/gi, 'Calcule'],
  [/\bchecking\b/gi, 'verificando'],
  [/\bCheck\b/gi, 'Verifique'],
  [/\bCreate\b/gi, 'Crie'],
  [/\breturns\b/gi, 'retorna'],
  [/\breturn\b/gi, 'retorne'],
  [/\btext\b/gi, 'texto'],
  [/\bnumber\b/gi, 'número'],
  [/\bwhole\b/gi, 'inteiro'],
  [/\bdecimal\b/gi, 'decimal'],
  [/\bvariable\b/gi, 'variável'],
  [/\bvariables\b/gi, 'variáveis'],
  [/\bcondition\b/gi, 'condição'],
  [/\bconditions\b/gi, 'condições'],
  [/\binside\b/gi, 'dentro'],
  [/\boutside\b/gi, 'fora'],
  [/\balways\b/gi, 'sempre'],
  [/\bnever\b/gi, 'nunca'],
  [/\bfirst\b/gi, 'primeiro'],
  [/\blast\b/gi, 'último'],
  [/\bstart\b/gi, 'início'],
  [/\bend\b/gi, 'fim'],
  [/\btrue\b/gi, 'True'],
  [/\bfalse\b/gi, 'False'],
  [/\bgreater than\b/gi, 'maior que'],
  [/\bless than\b/gi, 'menor que'],
  [/\bequal to\b/gi, 'igual a'],
  [/\bnot equal\b/gi, 'diferente'],
  [/\bcase-sensitive\b/gi, 'diferencia maiúsculas e minúsculas'],
  [/\blowercase\b/gi, 'minúsculas'],
  [/\buppercase\b/gi, 'maiúsculas'],
  [/\bspaces\b/gi, 'espaços'],
  [/\bspace\b/gi, 'espaço'],
  [/\bline\b/gi, 'linha'],
  [/\blines\b/gi, 'linhas'],
  [/\bloop\b/gi, 'laço'],
  [/\blist\b/gi, 'lista'],
  [/\bitem\b/gi, 'item'],
  [/\bitems\b/gi, 'itens'],
  [/\bvalue\b/gi, 'valor'],
  [/\bvalues\b/gi, 'valores'],
  [/\bresult\b/gi, 'resultado'],
  [/\bresults\b/gi, 'resultados'],
  [/\berror\b/gi, 'erro'],
  [/\buser\b/gi, 'usuário'],
  [/\binput\b/gi, 'entrada'],
  [/\bcomparison\b/gi, 'comparação'],
  [/\boperators\b/gi, 'operadores'],
  [/\boperator\b/gi, 'operador'],
  [/\bmath\b/gi, 'cálculo'],
  [/\bcalculation\b/gi, 'cálculo'],
  [/\bcalculated\b/gi, 'calculado'],
  [/\bconvert\b/gi, 'converta'],
  [/\bconverted\b/gi, 'convertido'],
  [/\bwithout\b/gi, 'sem'],
  [/\bwith\b/gi, 'com'],
  [/\bbefore\b/gi, 'antes'],
  [/\bafter\b/gi, 'depois'],
  [/\bonly\b/gi, 'somente'],
  [/\bmust\b/gi, 'deve'],
  [/\bcan\b(?![’'])/gi, 'pode'],
  [/\bworks\b/gi, 'funciona'],
  [/\bwork\b/gi, 'funcionar'],
  [/\bwrong\b/gi, 'errado'],
  [/\bright\b/gi, 'correto'],
]

/**
 * A comment line that is a runnable command documents syntax, not prose.
 *
 * Without this, [/\bBuild\b/gi, 'Construa'] rewrote `python -m build` to
 * `python -m Construa` in phase 52 — an instruction that no longer runs.
 *
 * The first version was just the command word, and it read
 * `# Python reads TOP to BOTTOM and stops at the FIRST True.` as a shell command, so
 * phase 6 showed that sentence in English to every Portuguese learner even though the
 * translation was sitting in `exactPt` two hundred lines below. A sentence is not a
 * command: the arguments of a real one are flags, paths and identifiers, never prose.
 */
const COMMAND_ARGUMENTS = /^[\s]*(?:-{1,2}[\w-]+|[\w./@:=<>\[\]"'*-]+)*(?:\s+(?:-{1,2}[\w-]+|[\w./@:=<>\[\]"'*-]+))*[\s]*$/
const COMMAND_WORD = /^\s*[$>]?\s*(python|python3|py|pip|pip3|npm|npx|pnpm|yarn|node|git|curl|wget|cd|ls|mkdir|export|source|docker|make|pytest|uvicorn|streamlit)\b/i

function isCommandLine(core: string): boolean {
  const match = COMMAND_WORD.exec(core)
  if (!match) return false
  return COMMAND_ARGUMENTS.test(core.slice(match[0].length))
}

function translateCommentToPt(comment: string): string {
  const leading = comment.match(/^\s*/)?.[0] || ''
  const trailing = comment.match(/\s*$/)?.[0] || ''
  const core = comment.trim()
  if (!core) return comment
  // The dictionary outranks every heuristic below it. An author who wrote a translation
  // for this exact line has already decided the question.
  const exact = exactPt[core]
  if (exact) return `${leading}${exact}${trailing}`
  if (isCommandLine(core)) return comment

  const protectedTokens: string[] = []
  const protectPattern = /\b(?:print|input|int|float|str|bool|if|elif|else|for|while|return|break|continue|range|len|sum|min|max|append|True|False)\b(?:\(\))?/gi
  let translated = core.replace(protectPattern, token => {
    protectedTokens.push(token)
    return `__PY_TOKEN_${protectedTokens.length - 1}__`
  })
  for (const [pattern, replacement] of phraseRules) translated = translated.replace(pattern, replacement)
  translated = translated.replace(/__PY_TOKEN_(\d+)__/g, (_, index) => protectedTokens[Number(index)] || '')
  return `${leading}${translated}${trailing}`
}

function findCommentStart(line: string): number {
  let quote: '"' | "'" | null = null
  let triple = false
  let escaped = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (escaped) { escaped = false; continue }
    if (char === '\\') { escaped = true; continue }

    if (quote) {
      if (triple) {
        if (line.slice(index, index + 3) === quote.repeat(3)) {
          quote = null
          triple = false
          index += 2
        }
      } else if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      triple = line.slice(index, index + 3) === char.repeat(3)
      if (triple) index += 2
      continue
    }

    if (char === '#') return index
  }
  return -1
}

/**
 * Printed text, translated the same way comments are.
 *
 * localizePythonComments only ever touched `#` comments, so a Portuguese learner ran
 * phase 8 and the console answered "Queue size: 3 / Processing: Alice / Queue
 * complete!". The code was right; the language was not theirs. Someone who does not
 * read English cannot tell whether that output means they succeeded.
 *
 * Exact-match only, and that is the whole safety argument: a literal is translated when
 * it appears in this table and never otherwise, so dictionary keys, identifiers, format
 * placeholders and API strings cannot be touched by accident.
 *
 * The graders accept both languages already — exerciseChecks() builds its pattern from
 * sampleOutput.en AND sampleOutput.pt — so a translated program still passes, provided
 * the two agree. scripts/audit/language-isolation.ts checks that they do.
 */
const literalPt: Record<string, string> = {
  // Phases 40-68 starter docstrings, exam starters and lesson example strings —
  // authored 2026-07-30. None is a graded contract value (checked against
  // pinnedValues before entry): the quoted contracts in p32/p33/p66 transfers
  // live in bilingual starterCode instead, with the English values kept.
  "Return no items for non-positive count and never over-consume.":
    "Retorne nenhum item para count não positivo e nunca consuma além do necessário.",
  "Yield lists of at most size items.":
    "Produza (yield) listas de no máximo size itens.",
  "Raise ValueError for non-positive size and yield final partial batch.":
    "Gere ValueError para size não positivo e produza (yield) o lote parcial final.",
  "Return a function that multiplies by factor.":
    "Retorne uma função que multiplica por factor.",
  "Capture factor without using a global variable.":
    "Capture factor sem usar uma variável global.",
  "Append enter before yield and exit in a finally block.":
    "Adicione enter antes do yield e exit em um bloco finally.",
  "Yield ready and always record cleanup.":
    "Produza (yield) ready e sempre registre cleanup.",
  "Return each value formatted by the supplied collaborator.":
    "Retorne cada valor formatado pelo colaborador fornecido.",
  "Create one coroutine per value and gather results.":
    "Crie uma corrotina por valor e reúna os resultados com gather.",
  "Distribute items round-robin into worker buckets.":
    "Distribua os itens em rodízio (round-robin) entre os baldes dos workers.",
  "Return squared results and number of unique computations.":
    "Retorne os resultados ao quadrado e o número de cálculos únicos.",
  "Compute each distinct value once while preserving result order.":
    "Calcule cada valor distinto uma única vez preservando a ordem dos resultados.",
  "Return parameterized SQL and a parameter tuple.":
    "Retorne SQL parametrizado e uma tupla de parâmetros.",
  "Never interpolate status into SQL text.":
    "Nunca interpole status no texto SQL.",
  "Treat only 2xx as success and use unknown for missing error text.":
    "Trate apenas 2xx como sucesso e use unknown quando faltar o texto de erro.",
  "Report every missing or failed required gate in stable order.":
    "Reporte todo gate obrigatório ausente ou reprovado, em ordem estável.",
  "Reject negative rates, quantities or prices and round money to 2 decimals.":
    "Rejeite taxas, quantidades ou preços negativos e arredonde dinheiro para 2 casas.",
  "Return a float NumPy vector with L2 norm 1; preserve zero vector.":
    "Retorne um vetor NumPy de floats com norma L2 igual a 1; preserve o vetor zero.",
  "Normalize without mutating the caller input.":
    "Normalize sem modificar a entrada de quem chamou.",
  "Return a list of cleaned records without changing the source list.":
    "Retorne uma lista de registros limpos sem alterar a lista original.",
  "Return precision, recall and F1, using 0 for undefined divisions.":
    "Retorne precisão, recall e F1, usando 0 para divisões indefinidas.",
  "Reject negative counts and return three metrics.":
    "Rejeite contagens negativas e retorne as três métricas.",
  "Return train, validation and test slices without overlap.":
    "Retorne as fatias de treino, validação e teste sem sobreposição.",
  "Return one prediction for each x.":
    "Retorne uma previsão para cada x.",
  "Return updated weight and pre-update MSE loss.":
    "Retorne o peso atualizado e a perda MSE anterior à atualização.",
  "Use deterministic IDs independent of input order.":
    "Use IDs determinísticos independentes da ordem de entrada.",
  "Return numerically stable probabilities summing to 1.":
    "Retorne probabilidades numericamente estáveis que somam 1.",
  "Reject an empty sequence and remain stable for large scores.":
    "Rejeite uma sequência vazia e permaneça estável para valores grandes.",
  "Estimate raw weight storage in decimal GB.":
    "Estime o armazenamento bruto dos pesos em GB decimais.",
  "Reject non-positive model sizes or bit widths and round to 2 decimals.":
    "Rejeite tamanhos de modelo ou larguras de bits não positivos e arredonde para 2 casas.",
  "Return a safe llama-server command bound to localhost.":
    "Retorne um comando llama-server seguro vinculado ao localhost.",
  "Reject empty paths and non-positive context sizes.":
    "Rejeite caminhos vazios e tamanhos de contexto não positivos.",
  "Preserve word order and validate progress-producing overlap.":
    "Preserve a ordem das palavras e valide uma sobreposição que gere progresso.",
  "Rank by token overlap, preserve source IDs and refuse without evidence.":
    "Classifique por sobreposição de tokens, preserve os IDs das fontes e recuse sem evidência.",
  "minimize the failing case":
    "reduza ao mínimo o caso que falha",
  "inspect types":
    "inspecione os tipos",
  "inspect available keys":
    "inspecione as chaves disponíveis",
  "validate denominator":
    "valide o denominador",
  "up to 30B at 4-bit, benchmark first":
    "até 30B em 4 bits, faça benchmark primeiro",
  "sub-1B model or upgrade memory":
    "modelo abaixo de 1B ou aumente a memória",
  "order completed":
    "pedido concluído",
  // Printed strings whose Portuguese existed only in `sampleOutput.pt`. The task promised
  // "Tempo total: 1710 segundos" and the same exercise's code printed "Total time: 1710
  // seconds" — nothing was comparing the two until `npm run audit:content:described`.
  'Welcome to Python!': 'Bem-vindo ao Python!',
  'storage': 'armazenamento',
  'After cartons:': 'Após caixas:',
  'After steel:': 'Após aço:',
  'After paint:': 'Após tinta:',
  'After Monday:': 'Após segunda:',
  'After Tuesday:': 'Após terça:',
  'After Wednesday:': 'Após quarta:',
  '3-day total: $': 'Total 3 dias: R$',
  '👍 Highly Recommended': '👍 Muito Recomendado',
  'Total time:': 'Tempo total:',
  'seconds': 'segundos',
  'Long songs (>4 min):': 'Músicas longas (>4 min):',
  'Average:': 'Média:',
  'Fee:': 'Taxa:',
  'Stock': 'Estoque',
  // Everything a phase 0-8 exercise prints. These existed in neither `literalPt` nor
  // `sampleOutput.pt`, so the Portuguese task promised English and the Portuguese program
  // delivered it — consistent, and unreadable.
  'Running:': 'Executando:',
  'Python is ready': 'O Python está pronto',
  '=== SYSTEM START ===': '=== INÍCIO DO SISTEMA ===',
  'App:': 'App:',
  'New songs:': 'Músicas novas:',
  'New playlists:': 'Playlists novas:',
  '--- COFFEE SHOP REPORT ---': '--- RELATÓRIO DA CAFETERIA ---',
  'Coffees sold:': 'Cafés vendidos:',
  'Price per coffee:': 'Preço por café:',
  'Total revenue:': 'Receita total:',
  'Report complete!': 'Relatório concluído!',
  'Materials:': 'Materiais:',
  'Teachers:': 'Professores:',
  'Equipment:': 'Equipamentos:',
  'Admin:': 'Administrativo:',
  'Total check:': 'Conferência do total:',
  'Math now works:': 'A conta agora funciona:',
  // Phases 28-39 docstrings — the one line a learner reads above `pass`.
  // The contract values quoted INSIDE the longer docstrings are left in English on
  // purpose: the grader compares against them exactly, so translating "missing command"
  // or "too long" would fail the learner who followed the translated instruction.
  'Return the essential project paths.': 'Retorne os caminhos essenciais do projeto.',
  'Normalize, deduplicate and sort package specifications.':
    'Normalize, remova duplicatas e ordene as especificações de pacote.',
  'Return normalized unique non-empty package specs.':
    'Retorne as especificações de pacote normalizadas, únicas e não vazias.',
  'Return explicit import statements for public unique names.':
    'Retorne comandos de import explícitos para os nomes públicos únicos.',
  'Ignore private names, deduplicate, sort, and build imports.':
    'Ignore nomes privados, remova duplicatas, ordene e monte os imports.',
  'Create package and matching test paths.':
    'Crie os caminhos do pacote e os caminhos de teste correspondentes.',
  'Return deterministic package and test paths without duplicates.':
    'Retorne caminhos determinísticos de pacote e de teste, sem duplicatas.',
  'Return command and optional value; empty args means help.':
    'Retorne o comando e um valor opcional; sem argumentos significa ajuda.',
  'Normalize the command to lowercase and preserve one optional value.':
    'Normalize o comando para minúsculas e preserve um valor opcional.',
  'Return the safest next inspection or workflow command.':
    'Retorne o próximo comando de inspeção ou de fluxo mais seguro.',
  'Map workflow state to the next deliberate Git command.':
    'Mapeie o estado do fluxo para o próximo comando Git deliberado.',
  'Return PASS or FAIL for each (input, expected) case.':
    'Retorne PASS ou FAIL para cada caso (entrada, esperado).',
  'Evaluate all independent cases without stopping at first failure.':
    'Avalie todos os casos independentes sem parar na primeira falha.',
  'Return total/count, using 0.0 when count is zero.':
    'Retorne total/count, usando 0.0 quando count for zero.',
  'Validate numeric inputs and avoid division by zero.':
    'Valide as entradas numéricas e evite divisão por zero.',
  'Return a stable structured log line with sorted context keys.':
    'Retorne uma linha de log estruturada e estável, com as chaves de contexto ordenadas.',
  'Uppercase level and omit the context separator when empty.':
    'Deixe o nível em maiúsculas e omita o separador de contexto quando vazio.',
  'Income adds; expense subtracts.': 'Receita soma; despesa subtrai.',
  'Reject unknown kinds with ValueError.': 'Rejeite tipos desconhecidos com ValueError.',
  'Return the sum of all product prices.': 'Retorne a soma dos preços de todos os produtos.',
  'Return income, expense and balance totals.':
    'Retorne os totais de receita, despesa e saldo.',
  'Validate kind and non-negative amount, then return totals.':
    'Valide o tipo e o valor não negativo, depois retorne os totais.',
  'Return at most count items from any iterable.':
    'Retorne no máximo count itens de qualquer iterável.',
  // Phases 21-27 printed output.
  '% of the total': '% do total',
  '=== SYSTEM ===': '=== SISTEMA ===',
  'After {years} years: ${amount:.2f}': 'Depois de {years} anos: ${amount:.2f}',
  'After {years} years: {total:.2f}': 'Depois de {years} anos: {total:.2f}',
  'Average:  {average:.0f}': 'Média:    {average:.0f}',
  'Average: ${average:.0f}': 'Média: ${average:.0f}',
  'Average: {average:.0f}': 'Média: {average:.0f}',
  'Calculate the hire cost. All values must be positive.':
    'Calcule o custo da contratação. Todos os valores devem ser positivos.',
  'Check today:': 'Verificação de hoje:',
  'Create order with full metadata.': 'Cria o pedido com os metadados completos.',
  'How many?': 'Quantos?',
  'New title': 'Novo título',
  'Next year you will be': 'Ano que vem você terá',
  'No record with that id.': 'Nenhum registro com esse id.',
  'No score recorded for that name yet.': 'Ainda não há nota registrada para esse nome.',
  'Nothing to update.': 'Nada para atualizar.',
  'Numbers only — try again.': 'Somente números — tente de novo.',
  'Numbers only': 'Somente números',
  'Order amount: $': 'Valor do pedido: $',
  'Orders:{len(db)} | Amount:${gross:,} | Total:${net:,}':
    'Pedidos:{len(db)} | Valor:${gross:,} | Total:${net:,}',
  'Please type a whole number, like 30.': 'Digite um número inteiro, como 30.',
  'Points from 70+: {top_total}': 'Pontos de 70+: {top_total}',
  'Price: {price}': 'Preço: {price}',
  'Range:    {smallest} to {biggest}': 'Faixa:    {smallest} a {biggest}',
  'Return src package files, one test file per module and README.md.':
    'Retorne os arquivos do pacote src, um arquivo de teste por módulo e README.md.',
  'Return the result of one arithmetic operation.':
    'Retorne o resultado de uma operação aritmética.',
  'Simulated repair value: $': 'Valor simulado do reparo: $',
  'They are': 'Eles são',
  'This runs about 30% of the time': 'Isso executa cerca de 30% das vezes',
  'This runs about 70% of the time': 'Isso executa cerca de 70% das vezes',
  'Whole numbers only — try again.': 'Somente números inteiros — tente de novo.',
  'vans needed': 'vans necessárias',
  // Phases 21-27. Each of these existed only in `sampleOutput.pt`, so the task promised
  // Portuguese and the program printed English — the same mismatch audit:content:described
  // was built to catch in phase 8.
  'Quote {i+1}: ${repair_value} → ${quote} [{risk}]': 'Cotação {i+1}: ${repair_value} → ${quote} [{risk}]',
  'Quote {index + 1}: ${repair_value} → ${quote} [{risk}]': 'Cotação {index + 1}: ${repair_value} → ${quote} [{risk}]',
  'HIGH': 'ALTO',
  'normal': 'normal',
  'High risk:': 'Alto risco:',
  'Confirmed total: $': 'Total confirmado: $',
  'Invalid:': 'Inválido:',
  '— try again': '— tente novamente',
  'Error:': 'Erro:',
  'History:': 'Histórico:',
  // The starter writes print("\\nHistory:") — the escape is part of the literal, so a
  // key without it never matches. This is why LITERAL had to stop skipping backslashes.
  '\\nHistory:': '\\nHistórico:',
  'Initial:': 'Inicial:',
  'Final:': 'Final:',
  '=== REPORT ===': '=== RELATÓRIO ===',
  '🔴 HIGH PRIORITY': '🔴 PRIORIDADE ALTA',
  'Expert reviewer assigned': 'Analista especialista designado',
  '🚨 FLAGGED: large order submitted soon after plan start': '🚨 MARCADO: pedido grande enviado logo após o início do plano',
  'Assigned to: {team}': 'Encaminhado para: {team}',
  'Grade: C20 — foundations only ⚠️': 'Classe: C20 — apenas fundação ⚠️',
  'Batch must be discarded': 'O lote deve ser descartado',
  'Command (quit to exit): ': 'Comando (quit para sair): ',
  // An f-string is ONE literal, placeholders and all, so the key has to carry them.
  '3-day total: ${total}': 'Total 3 dias: R${total}',
  'Order {counter} value: ': 'Pedido {counter} valor: ',
  'Total:': 'Total:',
  // The curriculum writes emoji as escape sequences in some files and as characters in
  // others. The localizer matches the literal as WRITTEN, so both spellings need an entry
  // or the escaped one silently stays English.
  '\\U0001f44d Highly Recommended': '\\U0001f44d Muito Recomendado',
  'Worth Watching': 'Vale Assistir',
  'Average': 'Média',
  'Not Recommended': 'Não Recomendado',

  'Age:': 'Idade:',
  'Name:': 'Nome:',
  '| Age:': '| Idade:',
  'Songs:': 'Músicas:',
  'My name is': 'Meu nome é',
  'My age is': 'Minha idade é',
  'In 10 years I\'ll be': 'Daqui a 10 anos eu terei',
  'This is my first program!': 'Este é o meu primeiro programa!',
  'Amount ordered:  $': 'Valor do pedido:  $',
  'Processing fee:  $': 'Taxa de processamento:  $',
  'Check:': 'Verificação:',
  'Money left over: $': 'Dinheiro restante: $',
  '{full} is {age} years old': '{full} tem {age} anos',
  'In 10 years: {age + 10}': 'Daqui a 10 anos: {age + 10}',
  '=== CLIENT FILE ===': '=== FICHA DO CLIENTE ===',
  'Name:    {client_name}': 'Nome:    {client_name}',
  'Age:     {client_age}': 'Idade:   {client_age}',
  'Total spent this week: $': 'Total gasto nesta semana: $',
  'Start:': 'Início:',
  'Client: {client_name}, age {client_age}': 'Cliente: {client_name}, idade {client_age}',
  'Annual: {annual_fee}': 'Anual: {annual_fee}',
  'Active: {plan_active}': 'Ativo: {plan_active}',
  'What is your name?': 'Qual é o seu nome?',
  'Your city:': 'Sua cidade:',
  'Your age:': 'Sua idade:',
  'Room name:': 'Nome da sala:',
  'Phone:': 'Telefone:',
  'Raw value:': 'Valor original:',
  'New type:': 'Novo tipo:',
  '{name}, {age} years, {height}m': '{name}, {age} anos, {height}m',
  'Next year: {age + 1}': 'Ano que vem: {age + 1}',
  'Phone: {phone}': 'Telefone: {phone}',
  'Amount: $': 'Valor: $',
  '🟢 Standard processing': '🟢 Processamento padrão',
  'Auto-queue assigned': 'Fila automática atribuída',
  '--- check complete ---': '--- verificação concluída ---',
  'Days since plan start:': 'Dias desde o início do plano:',
  '🚨 FLAGGED for investigation': '🚨 MARCADO para investigação',
  '✅ Passed fraud check': '✅ Passou na verificação de fraude',
  'Auto-queue': 'Fila automática',
  'Ticket holder age:': 'Idade de quem vai assistir:',
  'Young driver': 'Motorista jovem',
  'Grade: C30 — beams and slabs ✅': 'Classe: C30 — vigas e lajes ✅',
  'Amount:': 'Valor:',
  'You typed:': 'Você digitou:',
  'Age (0-120):': 'Idade (0-120):',
  'Valid age:': 'Idade válida:',
  'Order #': 'Pedido nº',
  // `print("Order #", count, "processed")` is THREE arguments, so translating the first
  // literal left the learner reading "Pedido nº 1 processed". A single-word literal is
  // usually a dictionary key, which is why audit:language skips them — but here it is a
  // word the learner reads on the console.
  'processed': 'processado',
  'Final count value:': 'Valor final do contador:',
  'Order {order}: {stock} cups left': 'Pedido {order}: {stock} copos restantes',
  'Restock needed!': 'Precisa repor o estoque!',
  '⚠️ Big order: ${amount}': '⚠️ Pedido grande: ${amount}',
  'Big orders: {big_orders} of {len(amounts)}': 'Pedidos grandes: {big_orders} de {len(amounts)}',
  'Files': 'Arquivos',
  'Queue size:': 'Tamanho da fila:',
  'Processing:': 'Processando:',
  'Queue complete!': 'Fila concluída!',
  'Big order:': 'Pedido grande:',
}

/** Exposed so the audit can assert the table and the sample outputs agree. */
export function translateLiteralToPt(text: string): string {
  return literalPt[text] ?? literalPt[text.trim()] ?? text
}

// The f in f"..." is a string PREFIX, not an identifier. Excluding any preceding
// letter skipped every f-string — which is most of the printed output in this
// curriculum, so the translation silently did nothing where it mattered most.
// Escape sequences are part of the literal. Excluding backslashes meant any string with
// one in it — `"\U0001f44d Highly Recommended"`, `"line\tvalue"` — was skipped entirely,
// so phase 6 kept printing "👍 Highly Recommended" to a Portuguese learner while the task
// promised "👍 Muito Recomendado" and nothing reported a leak.
const LITERAL = /(?<![A-Za-z_0-9])([fFrRbB]{0,2})(['"])((?:\\.|(?!\2)[^\\\n])*)\2/g

export function localizePythonStrings(code: string, lang: Lang): string {
  if (!code || lang === 'en') return code
  return code.split('\n').map(line => {
    const commentAt = findCommentStart(line)
    const codePart = commentAt < 0 ? line : line.slice(0, commentAt)
    const rest = commentAt < 0 ? '' : line.slice(commentAt)
    const translated = codePart.replace(LITERAL, (whole, prefix: string, quote: string, inner: string) => {
      const next = translateLiteralToPt(inner)
      return next === inner ? whole : `${prefix}${quote}${next}${quote}`
    })
    return translated + rest
  }).join('\n')
}

export function localizePythonComments(code: string, lang: Lang): string {
  if (!code || lang === 'en') return code
  return code.split('\n').map(line => {
    const index = findCommentStart(line)
    if (index < 0) return line
    const before = line.slice(0, index + 1)
    const comment = line.slice(index + 1)
    return before + translateCommentToPt(comment)
  }).join('\n')
}

export function resolveLocalizedCode(code: string | Bilingual | undefined, lang: Lang): string {
  if (!code) return ''
  if (typeof code !== 'string') return code[lang] || code.en || code.pt || ''
  return localizePythonStrings(localizePythonComments(code, lang), lang)
}
