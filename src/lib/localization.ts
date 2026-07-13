import type { Bilingual, Lang } from '../data/types'

export type LocalizedText = string | Bilingual

export function resolveLocalizedText(value: LocalizedText | undefined, lang: Lang): string {
  if (!value) return ''
  return typeof value === 'string' ? value : value[lang] || value.en || value.pt || ''
}

const exactPt: Record<string, string> = {
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
  'Step-by-step insurance payout': 'Cálculo do pagamento do seguro passo a passo',
  'Step 1: subtract deductible': 'Etapa 1: subtraia a franquia',
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
  [/\bcan\b/gi, 'pode'],
  [/\bworks\b/gi, 'funciona'],
  [/\bwork\b/gi, 'funcionar'],
  [/\bwrong\b/gi, 'errado'],
  [/\bright\b/gi, 'correto'],
]

function translateCommentToPt(comment: string): string {
  const leading = comment.match(/^\s*/)?.[0] || ''
  const trailing = comment.match(/\s*$/)?.[0] || ''
  const core = comment.trim()
  if (!core) return comment
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
  return localizePythonComments(code, lang)
}
