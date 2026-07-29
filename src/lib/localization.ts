import type { Bilingual, Lang } from '../data/types'

export type LocalizedText = string | Bilingual

export function resolveLocalizedText(value: LocalizedText | undefined, lang: Lang): string {
  if (!value) return ''
  return typeof value === 'string' ? value : value[lang] || value.en || value.pt || ''
}

const exactPt: Record<string, string> = {
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
  'phone = int(input("Phone: "))  → "555-1234" crashes int()!': 'phone = int(input("Telefone: "))  → "555-1234" quebra o int()!',
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
 */
const COMMAND_LINE = /^\s*[$>]?\s*(python|python3|py|pip|pip3|npm|npx|pnpm|yarn|node|git|curl|wget|cd|ls|mkdir|export|source|docker|make|pytest|uvicorn|streamlit)\b/i

function translateCommentToPt(comment: string): string {
  const leading = comment.match(/^\s*/)?.[0] || ''
  const trailing = comment.match(/\s*$/)?.[0] || ''
  const core = comment.trim()
  if (!core) return comment
  if (COMMAND_LINE.test(core)) return comment
  const exact = exactPt[core]
  if (exact) return `${leading}${exact}${trailing}`

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
const LITERAL = /(?<![A-Za-z_0-9])([fFrRbB]{0,2})(['"])((?:(?!\2)[^\\\n])*)\2/g

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
