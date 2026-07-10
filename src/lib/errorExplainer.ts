export interface ErrorExplanation {
  type: string
  line: number | null
  badCode: string | null
  title: { en: string; pt: string }
  where: { en: string; pt: string }
  why: { en: string; pt: string }
  fix: { en: string; pt: string }
  tip: { en: string; pt: string }
}

// ── Parse raw Pyodide error traceback ──
// User code starts at wrapper line 27 → offset = 26
const PYODIDE_LINE_OFFSET = 26

function parseError(raw: string, userCode: string): {
  type: string; line: number | null; message: string; badCode: string | null
} {
  const lines = raw.split('\n')
  const lastLine = lines[lines.length - 1].trim()
  const errorMatch = lastLine.match(/^(\w+(?:Error|Warning|Exception)):\s*(.+)$/)
  const type = errorMatch?.[1] || 'Error'
  const message = errorMatch?.[2] || lastLine

  let rawLine: number | null = null
  let badCode: string | null = null

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/File "<exec>", line (\d+)/)
    if (m) {
      rawLine = parseInt(m[1])
      if (lines[i + 1] && !lines[i + 1].trim().startsWith('^')) {
        badCode = lines[i + 1].trim()
      }
    }
  }

  // Adjust for wrapper offset — cap to actual code length
  const codeLines = userCode.split('\n')
  let line: number | null = null
  if (rawLine !== null) {
    const adjusted = rawLine - PYODIDE_LINE_OFFSET
    line = (adjusted >= 1 && adjusted <= codeLines.length) ? adjusted : null
  }

  // If badCode isn't from traceback, get it from the adjusted line
  if (!badCode && line !== null) {
    badCode = codeLines[line - 1]?.trim() || null
  }

  return { type, line, message, badCode }
}

// ── Helper: find similar names in code (typo detection) ──
function findSimilar(name: string, code: string): string[] {
  const words = code.match(/\b[a-zA-Z_]\w*\b/g) || []
  const unique = [...new Set(words)].filter(w => w !== name)
  return unique.filter(w => {
    // Simple edit distance ≤ 2
    if (Math.abs(w.length - name.length) > 2) return false
    let diff = 0
    const a = name.toLowerCase(), b = w.toLowerCase()
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) diff++
    }
    return diff <= 2 && diff > 0
  }).slice(0, 2)
}

// ── Main explainer ──
export function explainError(rawError: string, userCode: string = ''): ErrorExplanation {
  const { type, line, message, badCode } = parseError(rawError, userCode)

  const lineStr = line
    ? { en: `Line ${line}`, pt: `Linha ${line}` }
    : { en: 'in your code', pt: 'no seu código' }

  const codeCtx = badCode ? `\`${badCode}\`` : 'this line'

  // ═══════════════════════════════════════════════
  // SyntaxError
  // ═══════════════════════════════════════════════
  if (type === 'SyntaxError') {

    // Missing colon
    if (message.includes("expected ':'")) {
      const kw = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except', 'finally', 'with']
        .find(k => badCode?.trimStart().startsWith(k)) || ''

      if (kw === 'else' && badCode && badCode.includes('else') && badCode.includes(' ')) {
        const hasCondition = badCode.match(/else\s+\w/)
        return {
          type, line, badCode,
          title: { en: '"else" cannot have a condition', pt: '"else" não pode ter condição' },
          where: lineStr,
          why: {
            en: `You wrote \`${badCode}\`. In Python, \`else\` never has a condition — it's just \`else:\` and it catches everything that didn't match the previous conditions.`,
            pt: `Você escreveu \`${badCode}\`. Em Python, \`else\` nunca tem condição — é apenas \`else:\` e ele captura tudo que não correspondeu às condições anteriores.`
          },
          fix: {
            en: hasCondition
              ? ('Change `' + badCode + '` to `elif ' + badCode.replace(/else\s+/, '') + ':`\nIf you want "everything else", just write:\n  else:')
              : ('Add a colon: `' + badCode + ':`'),
            pt: hasCondition
              ? ('Troque `' + badCode + '` por `elif ' + badCode.replace(/else\s+/, '') + ':`\nSe quer "todo o resto", escreva apenas:\n  else:')
              : ('Adicione dois pontos: `' + badCode + ':`'),
          },
          tip: {
            en: '`else` catches everything left over — no condition needed. Use `elif condition:` if you need another check.',
            pt: '`else` captura o que sobrou — sem condição. Use `elif condição:` se precisar de outra verificação.'
          }
        }
      }

      return {
        type, line, badCode,
        title: { en: `Missing ":" after ${kw || 'statement'}`, pt: `Faltou ":" após ${kw || 'declaração'}` },
        where: lineStr,
        why: {
          en: `${codeCtx} is missing a colon (:) at the end. Every \`${kw || 'block statement'}\` in Python must end with a colon — it tells Python that an indented block follows.`,
          pt: `${codeCtx} está faltando dois pontos (:) no final. Todo \`${kw || 'bloco'}\` em Python deve terminar com dois pontos — isso avisa que um bloco indentado vem a seguir.`
        },
        fix: {
          en: `Add a colon at the end:\n  ${badCode || kw}:`,
          pt: `Adicione dois pontos no final:\n  ${badCode || kw}:`
        },
        tip: {
          en: 'Rule: if, elif, else, for, while, def, class — ALL need ":" at the end.',
          pt: 'Regra: if, elif, else, for, while, def, class — TODOS precisam de ":" no final.'
        }
      }
    }

    // = instead of ==
    if (message.includes('invalid syntax') && badCode?.includes('=') && !badCode.includes('==')) {
      return {
        type, line, badCode,
        title: { en: 'Used "=" instead of "==" in comparison', pt: 'Usou "=" em vez de "==" na comparação' },
        where: lineStr,
        why: {
          en: `In ${codeCtx}, you used a single \`=\` which is for assigning values. To compare if two things are equal, you need double \`==\`.`,
          pt: `Em ${codeCtx}, você usou \`=\` simples que serve para atribuir valores. Para comparar se duas coisas são iguais, use \`==\` duplo.`
        },
        fix: {
          en: `Change \`=\` to \`==\`:\n  ${badCode?.replace(/([^=!<>])=([^=])/, '$1==$2') || ''}`,
          pt: `Troque \`=\` por \`==\`:\n  ${badCode?.replace(/([^=!<>])=([^=])/, '$1==$2') || ''}`
        },
        tip: {
          en: '`=` assigns (creates/sets a value). `==` compares (checks if equal). Never mix them up in conditions.',
          pt: '`=` atribui (cria/define um valor). `==` compara (verifica se é igual). Nunca os misture em condições.'
        }
      }
    }

    // Unclosed string or bracket
    if (message.includes('EOL') || message.includes('EOF') || message.includes('never closed') || message.includes('was never closed')) {
      const open = badCode?.match(/["'\(\[\{]/) ? badCode.match(/["'\(\[\{]/)?.[0] : null
      const closeMap: Record<string, string> = { '"': '"', "'": "'", '(': ')', '[': ']', '{': '}' }
      return {
        type, line, badCode,
        title: { en: `Unclosed ${open ? `"${open}"` : 'quote or bracket'}`, pt: `${open ? `"${open}"` : 'Aspas ou colchete'} não fechado` },
        where: lineStr,
        why: {
          en: `In ${codeCtx}, you opened a \`${open || 'quote/bracket'}\` but never closed it with \`${open ? closeMap[open] : 'the matching closing character'}\`. Python read to the end of the line and couldn't find the closing character.`,
          pt: `Em ${codeCtx}, você abriu \`${open || 'aspas/colchete'}\` mas nunca fechou com \`${open ? closeMap[open] : 'o caractere de fechamento'}\`. Python leu até o final da linha sem encontrar o fechamento.`
        },
        fix: {
          en: `Close every opening character:\n  String: "text" or 'text'\n  List: [item1, item2]\n  Function call: function(arg)\n\nYour line: ${badCode}\nFix: add the missing closing character`,
          pt: `Feche todo caractere de abertura:\n  String: "texto" ou 'texto'\n  Lista: [item1, item2]\n  Chamada: funcao(arg)\n\nSua linha: ${badCode}\nCorreção: adicione o caractere de fechamento`
        },
        tip: {
          en: 'Use the toolbar buttons () [] {} "" — they insert both opening and closing characters at once.',
          pt: 'Use os botões da barra () [] {} "" — eles inserem abertura e fechamento de uma vez.'
        }
      }
    }

    // Generic syntax error
    return {
      type, line, badCode,
      title: { en: 'Python cannot read this line', pt: 'Python não consegue ler esta linha' },
      where: lineStr,
      why: {
        en: `${codeCtx} has a syntax problem. Python stops reading when it finds something it doesn't understand. Common causes: typo in a keyword, missing operator, or wrong punctuation.`,
        pt: `${codeCtx} tem um problema de sintaxe. Python para de ler quando encontra algo que não entende. Causas comuns: erro de digitação em palavra-chave, operador faltando, ou pontuação errada.`
      },
      fix: {
        en: `Check ${codeCtx} for:\n• Typos in keywords (def, if, for, print...)\n• Missing or extra parentheses\n• Wrong operator (= vs ==, / vs //)\n• Unclosed string or bracket`,
        pt: `Verifique ${codeCtx} por:\n• Erros de digitação em palavras-chave (def, if, for, print...)\n• Parênteses faltando ou sobrando\n• Operador errado (= vs ==, / vs //)\n• String ou colchete não fechado`
      },
      tip: {
        en: 'Python tells you WHERE the syntax error is, but the real mistake is often one line BEFORE.',
        pt: 'Python diz ONDE está o erro de sintaxe, mas o engano real frequentemente é uma linha ANTES.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // IndentationError / TabError
  // ═══════════════════════════════════════════════
  if (type === 'IndentationError' || type === 'TabError') {
    const isUnexpected = message.includes('unexpected')
    return {
      type, line, badCode,
      title: {
        en: isUnexpected ? 'Unexpected indentation' : 'Wrong indentation',
        pt: isUnexpected ? 'Indentação inesperada' : 'Indentação errada'
      },
      where: lineStr,
      why: {
        en: isUnexpected
          ? `${codeCtx} is indented (has spaces at the start), but Python wasn't expecting an indented block here. This line shouldn't be inside a block.`
          : `${codeCtx} has the wrong number of spaces. All lines inside the same block (if, for, def, etc.) must align exactly.`,
        pt: isUnexpected
          ? `${codeCtx} está indentado (tem espaços no início), mas Python não esperava um bloco indentado aqui. Esta linha não deveria estar dentro de um bloco.`
          : `${codeCtx} tem número errado de espaços. Todas as linhas dentro do mesmo bloco (if, for, def, etc.) devem estar alinhadas exatamente.`
      },
      fix: {
        en: isUnexpected
          ? `Remove the extra spaces at the start of ${codeCtx}.\nUse ⌫ Untab to reduce indentation.`
          : `Use ⇥ Tab to add 4 spaces of indentation.\nCheck that all lines in the same block have the same indentation.\n\nExample of correct indentation:\nif x > 0:\n    print("positive")  ← 4 spaces\n    x = x - 1          ← same 4 spaces`,
        pt: isUnexpected
          ? `Remova os espaços extras no início de ${codeCtx}.\nUse ⌫ Untab para reduzir a indentação.`
          : `Use ⇥ Tab para adicionar 4 espaços de indentação.\nVerifique que todas as linhas do mesmo bloco têm a mesma indentação.\n\nExemplo de indentação correta:\nif x > 0:\n    print("positivo")  ← 4 espaços\n    x = x - 1          ← mesmos 4 espaços`
      },
      tip: {
        en: 'Python uses indentation to define blocks. Use the Tab button (always 4 spaces). Never mix tabs and spaces.',
        pt: 'Python usa indentação para definir blocos. Use o botão Tab (sempre 4 espaços). Nunca misture tabs e espaços.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // NameError
  // ═══════════════════════════════════════════════
  if (type === 'NameError') {
    const varMatch = message.match(/name '(.+)' is not defined/)
    const varName = varMatch?.[1] || 'the variable'
    const similar = findSimilar(varName, userCode)
    const isBuiltin = ['print', 'input', 'int', 'str', 'float', 'len', 'range', 'list', 'dict'].includes(varName)

    return {
      type, line, badCode,
      title: { en: `"${varName}" doesn't exist`, pt: `"${varName}" não existe` },
      where: lineStr,
      why: {
        en: `You used \`${varName}\` in ${codeCtx}, but Python has no idea what \`${varName}\` is. ${
          isBuiltin ? `Note: \`${varName}\` looks like a built-in function — check if it's spelled exactly right.` :
          similar.length > 0 ? `Did you mean \`${similar[0]}\`? (found a similar name in your code)` :
          'Either it was never assigned a value, or the name is spelled differently where it was created.'
        }`,
        pt: `Você usou \`${varName}\` em ${codeCtx}, mas Python não sabe o que é \`${varName}\`. ${
          isBuiltin ? `Atenção: \`${varName}\` parece uma função embutida — verifique se está escrito exatamente certo.` :
          similar.length > 0 ? `Você quis dizer \`${similar[0]}\`? (encontrei um nome similar no seu código)` :
          'Ou nunca recebeu um valor, ou o nome está escrito diferente de onde foi criado.'
        }`
      },
      fix: {
        en: [
          `Option 1 — Create it before using it:\n  ${varName} = some_value  # add this before line ${line}`,
          similar.length > 0 ? `Option 2 — Fix the typo: replace \`${varName}\` with \`${similar[0]}\`` : null,
          `Option 3 — Check spelling: Python is case-sensitive\n  ("${varName}" ≠ "${varName.charAt(0).toUpperCase() + varName.slice(1)}")`
        ].filter(Boolean).join('\n\n'),
        pt: [
          `Opção 1 — Crie antes de usar:\n  ${varName} = algum_valor  # adicione isso antes da linha ${line}`,
          similar.length > 0 ? `Opção 2 — Corrija o erro de digitação: troque \`${varName}\` por \`${similar[0]}\`` : null,
          `Opção 3 — Verifique a escrita: Python diferencia maiúsculas\n  ("${varName}" ≠ "${varName.charAt(0).toUpperCase() + varName.slice(1)}")`
        ].filter(Boolean).join('\n\n'),
      },
      tip: {
        en: 'Python reads code top-to-bottom. A variable must be assigned (e.g. `x = 5`) BEFORE the line where you use it.',
        pt: 'Python lê de cima para baixo. Uma variável deve ser atribuída (ex: `x = 5`) ANTES da linha onde você a usa.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // TypeError
  // ═══════════════════════════════════════════════
  if (type === 'TypeError') {

    // String + int concatenation
    if (message.includes('can only concatenate str')) {
      const numTypeMatch = message.match(/not "(\w+)"/)
      const numType = numTypeMatch?.[1] || 'int'
      // Try to extract variable names from badCode
      const parts = badCode?.split('+').map(p => p.trim()) || []
      return {
        type, line, badCode,
        title: { en: 'Cannot add text and number together', pt: 'Não pode somar texto e número' },
        where: lineStr,
        why: {
          en: `${codeCtx} is trying to join a string (text) with a ${numType} (number) using \`+\`. Python requires both sides of \`+\` to be the same type — you can't mix text and numbers directly.`,
          pt: `${codeCtx} está tentando juntar uma string (texto) com um ${numType} (número) usando \`+\`. Python exige que os dois lados do \`+\` sejam do mesmo tipo — não dá para misturar texto e números diretamente.`
        },
        fix: {
          en: `Two ways to fix:\n\n1. Use an f-string (recommended):\n   ${badCode?.replace(/["'].*?["']\s*\+\s*(\w+)/, 'f"...{$1}"') || 'print(f"text {variable}")'}\n\n2. Convert the number to text:\n   ${parts.length === 2 ? `${parts[0]} + str(${parts[1]})` : 'str(number)'}`,
          pt: `Duas formas de corrigir:\n\n1. Use uma f-string (recomendado):\n   ${badCode?.replace(/["'].*?["']\s*\+\s*(\w+)/, 'f"...{$1}"') || 'print(f"texto {variavel}")'}\n\n2. Converta o número para texto:\n   ${parts.length === 2 ? `${parts[0]} + str(${parts[1]})` : 'str(numero)'}`
        },
        tip: {
          en: 'f-strings are the Python professional standard: `f"Hello {name}, you are {age} years old"` — no conversion needed!',
          pt: 'F-strings são o padrão profissional Python: `f"Olá {nome}, você tem {idade} anos"` — sem conversão!'
        }
      }
    }

    // Not iterable
    if (message.includes('is not iterable')) {
      const typeMatch = message.match(/'(\w+)' object is not iterable/)
      const objType = typeMatch?.[1] || 'object'
      return {
        type, line, badCode,
        title: { en: `Cannot loop over a ${objType}`, pt: `Não pode iterar sobre ${objType}` },
        where: lineStr,
        why: {
          en: `${codeCtx} tries to loop over something that is a \`${objType}\`, but \`for\` loops only work on sequences (lists, strings, range, etc.). A single ${objType} is not a sequence.`,
          pt: `${codeCtx} tenta iterar sobre algo que é \`${objType}\`, mas loops \`for\` só funcionam em sequências (listas, strings, range, etc.). Um único ${objType} não é uma sequência.`
        },
        fix: {
          en: objType === 'int' || objType === 'float'
            ? `To repeat N times, use range():\n  for i in range(number):  # repeats 'number' times\n      your_code_here`
            : `Wrap the value in a list, or check what you're looping over:\n  for item in [${objType}_value]:  # list with one item\n  for item in range(n):  # numbers 0 to n-1`,
          pt: objType === 'int' || objType === 'float'
            ? `Para repetir N vezes, use range():\n  for i in range(numero):  # repete 'numero' vezes\n      seu_codigo_aqui`
            : `Coloque o valor em uma lista, ou verifique o que está iterando:\n  for item in [valor_${objType}]:  # lista com um item\n  for item in range(n):  # números de 0 a n-1`
        },
        tip: {
          en: 'You can loop over: lists [], strings, range(), dict.keys(), dict.values(), tuples ().',
          pt: 'Você pode iterar sobre: listas [], strings, range(), dict.keys(), dict.values(), tuplas ().'
        }
      }
    }

    // Wrong number of arguments
    if (message.includes('argument') && (message.includes('takes') || message.includes('missing'))) {
      const funcMatch = message.match(/(\w+)\(\) takes/)
      const funcName = funcMatch?.[1] || 'function'
      return {
        type, line, badCode,
        title: { en: `Wrong number of arguments to ${funcName}()`, pt: `Número errado de argumentos para ${funcName}()` },
        where: lineStr,
        why: {
          en: `${codeCtx}: the function \`${funcName}()\` is being called with the wrong number of arguments. ${message}.`,
          pt: `${codeCtx}: a função \`${funcName}()\` está sendo chamada com número errado de argumentos. ${message}.`
        },
        fix: {
          en: `Check the function definition (starts with \`def ${funcName}(...)\`) and count how many parameters it expects. Your call must provide exactly that many arguments.`,
          pt: `Verifique a definição da função (começa com \`def ${funcName}(...)\`) e conte quantos parâmetros ela espera. Sua chamada deve fornecer exatamente esse número de argumentos.`
        },
        tip: {
          en: 'Every parameter in `def func(a, b, c):` needs a matching argument in `func(val1, val2, val3)`.',
          pt: 'Cada parâmetro em `def func(a, b, c):` precisa de um argumento correspondente em `func(val1, val2, val3)`.'
        }
      }
    }

    // Generic TypeError
    return {
      type, line, badCode,
      title: { en: 'Wrong type of value used', pt: 'Tipo de valor errado' },
      where: lineStr,
      why: {
        en: `${codeCtx} caused a TypeError: ${message}. Python is strict about types — you can't use a value where a different type is expected.`,
        pt: `${codeCtx} causou um TypeError: ${message}. Python é estrito sobre tipos — você não pode usar um valor onde outro tipo é esperado.`
      },
      fix: {
        en: `Check what type each value is:\n• int(): converts to integer number\n• float(): converts to decimal number\n• str(): converts to text\n• list(): converts to list\n\nUse print(type(your_variable)) to check.`,
        pt: `Verifique o tipo de cada valor:\n• int(): converte para número inteiro\n• float(): converte para decimal\n• str(): converte para texto\n• list(): converte para lista\n\nUse print(type(sua_variavel)) para verificar.`
      },
      tip: {
        en: 'type() is your debugging friend: `print(type(x))` shows you exactly what type a variable is.',
        pt: 'type() é seu amigo para debug: `print(type(x))` mostra exatamente qual tipo uma variável é.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // ValueError
  // ═══════════════════════════════════════════════
  if (type === 'ValueError') {

    if (message.includes('invalid literal for int()')) {
      const valMatch = message.match(/: '(.+)'$/)
      const badVal = valMatch?.[1] || '?'
      const isFloat = !isNaN(parseFloat(badVal)) && badVal.includes('.')
      return {
        type, line, badCode,
        title: { en: `"${badVal}" cannot be converted to a whole number`, pt: `"${badVal}" não pode ser convertido para número inteiro` },
        where: lineStr,
        why: {
          en: `${codeCtx} calls \`int("${badVal}")\`, but \`"${badVal}"\` ${
            isFloat ? `is a decimal number. int() only accepts whole numbers.` :
            `is not a number at all — it's a word/text.`
          } int() can only convert strings that look like whole numbers (e.g., "25", "-3", "100").`,
          pt: `${codeCtx} chama \`int("${badVal}")\`, mas \`"${badVal}"\` ${
            isFloat ? `é um número decimal. int() só aceita números inteiros.` :
            `não é um número — é uma palavra/texto.`
          } int() só converte strings que parecem números inteiros (ex: "25", "-3", "100").`
        },
        fix: {
          en: isFloat
            ? `Use float() instead of int() for decimal numbers:\n  float("${badVal}") → ${parseFloat(badVal)}`
            : `Check your test inputs. The value "${badVal}" is going to an input() that expects a number.\n\nYour input() calls and their test values must be in the same order:\nif your code is:\n  name = input("Name: ")\n  age = int(input("Age: "))\n\nThen test inputs should be:\n  Alice\n  25`,
          pt: isFloat
            ? `Use float() em vez de int() para números decimais:\n  float("${badVal}") → ${parseFloat(badVal)}`
            : `Verifique suas entradas de teste. O valor "${badVal}" está indo para um input() que espera número.\n\nAs chamadas input() e seus valores de teste devem estar na mesma ordem:\nse seu código é:\n  nome = input("Nome: ")\n  idade = int(input("Idade: "))\n\nEntão as entradas de teste devem ser:\n  Alice\n  25`
        },
        tip: {
          en: 'The test inputs are consumed in order — one line per input() call. If order is wrong, values go to the wrong variables.',
          pt: 'As entradas de teste são consumidas em ordem — uma linha por chamada input(). Se a ordem estiver errada, os valores vão para variáveis erradas.'
        }
      }
    }

    return {
      type, line, badCode,
      title: { en: `Invalid value: ${message.slice(0, 40)}`, pt: `Valor inválido: ${message.slice(0, 40)}` },
      where: lineStr,
      why: {
        en: `${codeCtx} received a value that doesn't make sense for this operation: ${message}`,
        pt: `${codeCtx} recebeu um valor que não faz sentido para esta operação: ${message}`
      },
      fix: {
        en: 'Check the value you are passing — make sure it matches what the function or operation expects.',
        pt: 'Verifique o valor que está passando — certifique-se de que corresponde ao que a função ou operação espera.'
      },
      tip: {
        en: 'Add a print() before the error line to see what value is being used: `print("value:", your_variable)`',
        pt: 'Adicione um print() antes da linha do erro para ver qual valor está sendo usado: `print("valor:", sua_variavel)`'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // ZeroDivisionError
  // ═══════════════════════════════════════════════
  if (type === 'ZeroDivisionError') {
    const divisorMatch = badCode?.match(/\/\s*(\w+)/)
    const divisor = divisorMatch?.[1] || 'the divisor'
    return {
      type, line, badCode,
      title: { en: 'Division by zero', pt: 'Divisão por zero' },
      where: lineStr,
      why: {
        en: `${codeCtx} divides by \`${divisor}\`, but \`${divisor}\` is 0. Division by zero is mathematically impossible — there is no answer.`,
        pt: `${codeCtx} divide por \`${divisor}\`, mas \`${divisor}\` é 0. Divisão por zero é matematicamente impossível — não existe resposta.`
      },
      fix: {
        en: `Add a check before dividing:\n  if ${divisor} != 0:\n      result = numerator / ${divisor}\n  else:\n      print("Error: cannot divide by zero")`,
        pt: `Adicione uma verificação antes de dividir:\n  if ${divisor} != 0:\n      resultado = numerador / ${divisor}\n  else:\n      print("Erro: não pode dividir por zero")`
      },
      tip: {
        en: 'Always validate user input before using it as a divisor. Users can type 0.',
        pt: 'Sempre valide a entrada do usuário antes de usar como divisor. Usuários podem digitar 0.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // IndexError
  // ═══════════════════════════════════════════════
  if (type === 'IndexError') {
    const indexMatch = badCode?.match(/\[(\d+)\]/) || badCode?.match(/\[(-\d+)\]/)
    const indexUsed = indexMatch?.[1]
    const listMatch = badCode?.match(/(\w+)\[/)
    const listName = listMatch?.[1] || 'your list'
    return {
      type, line, badCode,
      title: { en: `Index ${indexUsed ?? ''} is out of range`, pt: `Índice ${indexUsed ?? ''} está fora do intervalo` },
      where: lineStr,
      why: {
        en: `${codeCtx} tries to access \`${listName}[${indexUsed ?? 'n'}]\`, but that position doesn't exist. Python lists start at index 0, so a list with 3 items has indexes 0, 1, 2 — not 3.${indexUsed ? ` You used index ${indexUsed}.` : ''}`,
        pt: `${codeCtx} tenta acessar \`${listName}[${indexUsed ?? 'n'}]\`, mas essa posição não existe. Listas Python começam no índice 0, então uma lista com 3 itens tem índices 0, 1, 2 — não 3.${indexUsed ? ` Você usou o índice ${indexUsed}.` : ''}`
      },
      fix: {
        en: `• Check length first: \`print(len(${listName}))\`\n• Valid indexes for a list of length n: 0 to n-1\n• Last item: \`${listName}[-1]\`\n• Loop safely: \`for item in ${listName}:\``,
        pt: `• Verifique o tamanho: \`print(len(${listName}))\`\n• Índices válidos para lista de tamanho n: 0 a n-1\n• Último item: \`${listName}[-1]\`\n• Percorra com segurança: \`for item in ${listName}:\``
      },
      tip: {
        en: 'For loops are safer than index access — `for item in my_list:` never goes out of range.',
        pt: 'Loops for são mais seguros que acesso por índice — `for item in minha_lista:` nunca sai do intervalo.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // KeyError
  // ═══════════════════════════════════════════════
  if (type === 'KeyError') {
    const keyMatch = message.match(/^'?(.+?)'?$/)
    const key = keyMatch?.[1] || message
    const dictMatch = badCode?.match(/(\w+)\[/)
    const dictName = dictMatch?.[1] || 'your dictionary'
    return {
      type, line, badCode,
      title: { en: `Key "${key}" not found in dictionary`, pt: `Chave "${key}" não encontrada no dicionário` },
      where: lineStr,
      why: {
        en: `${codeCtx} tries to access \`${dictName}["${key}"]\`, but "${key}" doesn't exist as a key in that dictionary. Unlike lists, dictionaries use named keys, and you can only access keys that were actually added.`,
        pt: `${codeCtx} tenta acessar \`${dictName}["${key}"]\`, mas "${key}" não existe como chave nesse dicionário. Diferente de listas, dicionários usam chaves nomeadas, e você só pode acessar chaves que foram realmente adicionadas.`
      },
      fix: {
        en: `Option 1 — Safe access with default:\n  value = ${dictName}.get("${key}", "not found")\n\nOption 2 — Check before accessing:\n  if "${key}" in ${dictName}:\n      value = ${dictName}["${key}"]\n\nOption 3 — See all keys:\n  print(${dictName}.keys())`,
        pt: `Opção 1 — Acesso seguro com padrão:\n  valor = ${dictName}.get("${key}", "não encontrado")\n\nOpção 2 — Verifique antes de acessar:\n  if "${key}" in ${dictName}:\n      valor = ${dictName}["${key}"]\n\nOpção 3 — Veja todas as chaves:\n  print(${dictName}.keys())`
      },
      tip: {
        en: `\`dict.get(key, default)\` never raises KeyError — it returns the default value if the key is missing.`,
        pt: `\`dict.get(chave, padrão)\` nunca gera KeyError — retorna o valor padrão se a chave não existir.`
      }
    }
  }

  // ═══════════════════════════════════════════════
  // EOFError (inputs exhausted)
  // ═══════════════════════════════════════════════
  if (type === 'EOFError') {
    // Count input() calls in user code
    const inputCalls = (userCode.match(/\binput\s*\(/g) || []).length
    const inputsProvided = userCode ? 0 : 0 // can't easily know
    return {
      type, line, badCode,
      title: { en: 'Not enough test inputs', pt: 'Entradas de teste insuficientes' },
      where: lineStr,
      why: {
        en: `Your code has ${inputCalls} \`input()\` call${inputCalls !== 1 ? 's' : ''}, but the test inputs box doesn't have enough values. When inputs run out mid-program, Python raises EOFError.`,
        pt: `Seu código tem ${inputCalls} chamada${inputCalls !== 1 ? 's' : ''} de \`input()\`, mas a caixa de entradas de teste não tem valores suficientes. Quando as entradas acabam no meio do programa, Python lança EOFError.`
      },
      fix: {
        en: `Your code calls input() ${inputCalls} time${inputCalls !== 1 ? 's' : ''} — add ${inputCalls} lines in the test inputs box, one value per line.\n\nEach input() call consumes one line from top to bottom.`,
        pt: `Seu código chama input() ${inputCalls} vez${inputCalls !== 1 ? 'es' : ''} — adicione ${inputCalls} linha${inputCalls !== 1 ? 's' : ''} na caixa de entradas de teste, um valor por linha.\n\nCada chamada input() consome uma linha de cima para baixo.`
      },
      tip: {
        en: 'The labeled inputs box shows exactly which value goes to which input(). Make sure every field has a value.',
        pt: 'A caixa de entradas rotulada mostra exatamente qual valor vai para qual input(). Certifique-se que todo campo tem um valor.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // MemoryError / infinite loop
  // ═══════════════════════════════════════════════
  if (type === 'MemoryError') {
    const hasWhile = userCode.includes('while')
    const hasBreak = userCode.includes('break')
    return {
      type, line, badCode,
      title: { en: 'Infinite loop — code ran forever', pt: 'Loop infinito — código rodou para sempre' },
      where: { en: 'in your loop', pt: 'no seu loop' },
      why: {
        en: `Your code ran until it ran out of memory. ${
          hasWhile && !hasBreak
            ? 'You have a `while` loop but no `break` statement — the loop never stops.'
            : hasWhile
            ? 'Your `while` loop\'s exit condition was never met, so it kept running.'
            : 'A loop in your code never reached its end condition.'
        }`,
        pt: `Seu código rodou até esgotar a memória. ${
          hasWhile && !hasBreak
            ? 'Você tem um loop `while` mas nenhum `break` — o loop nunca para.'
            : hasWhile
            ? 'A condição de saída do seu loop `while` nunca foi satisfeita, então continuou rodando.'
            : 'Um loop no seu código nunca alcançou sua condição de fim.'
        }`
      },
      fix: {
        en: hasWhile && !hasBreak
          ? `Add a \`break\` statement inside your while loop:\n  while True:\n      # your code here\n      if some_condition:\n          break  # ← this exits the loop`
          : `Check your while condition:\n• If using \`while True:\`, make sure there's a \`break\` inside\n• If using \`while x > 0:\`, make sure x eventually becomes 0 or less\n• Add more test inputs if your loop reads multiple values`,
        pt: hasWhile && !hasBreak
          ? `Adicione um \`break\` dentro do seu loop while:\n  while True:\n      # seu código aqui\n      if alguma_condicao:\n          break  # ← isso sai do loop`
          : `Verifique a condição do while:\n• Se usar \`while True:\`, certifique-se de ter um \`break\` dentro\n• Se usar \`while x > 0:\`, certifique-se que x eventualmente fica 0 ou menos\n• Adicione mais entradas de teste se seu loop lê múltiplos valores`
      },
      tip: {
        en: '`while True:` is a powerful pattern — but ALWAYS needs a `break` to exit. Without it, the program runs forever.',
        pt: '`while True:` é um padrão poderoso — mas SEMPRE precisa de um `break` para sair. Sem ele, o programa roda para sempre.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // AttributeError
  // ═══════════════════════════════════════════════
  if (type === 'AttributeError') {
    const attrMatch = message.match(/'(\w+)' object has no attribute '(\w+)'/)
    const objType = attrMatch?.[1] || 'object'
    const attrName = attrMatch?.[2] || 'attribute'
    return {
      type, line, badCode,
      title: { en: `"${attrName}" doesn't exist on ${objType}`, pt: `"${attrName}" não existe em ${objType}` },
      where: lineStr,
      why: {
        en: `${codeCtx} tries to use \`.${attrName}\` on a \`${objType}\`, but \`${objType}\` doesn't have that method or attribute. You might have a typo, or be using the wrong type.`,
        pt: `${codeCtx} tenta usar \`.${attrName}\` em um \`${objType}\`, mas \`${objType}\` não tem esse método ou atributo. Pode ser erro de digitação ou tipo errado.`
      },
      fix: {
        en: {
          'str': `String methods: .upper() .lower() .strip() .split() .replace() .find() .startswith() .endswith() .join()`,
          'list': `List methods: .append() .insert() .remove() .pop() .sort() .reverse() .index() .count()`,
          'dict': `Dictionary methods: .keys() .values() .items() .get() .update() .pop()`,
          'int': `int and float don't have many methods — are you trying to use a string method on a number? Try str(your_number).${attrName}()`,
          'NoneType': `The variable is None — it means a function returned nothing (no return statement). Check if your function has a return value.`
        }[objType] || `Check the correct method name for ${objType}. Use Python docs or print(dir(your_variable)) to see all available methods.`,
        pt: {
          'str': `Métodos de string: .upper() .lower() .strip() .split() .replace() .find() .startswith() .endswith() .join()`,
          'list': `Métodos de lista: .append() .insert() .remove() .pop() .sort() .reverse() .index() .count()`,
          'dict': `Métodos de dicionário: .keys() .values() .items() .get() .update() .pop()`,
          'int': `int e float não têm muitos métodos — você está tentando usar um método de string em um número? Tente str(seu_numero).${attrName}()`,
          'NoneType': `A variável é None — significa que uma função não retornou nada (sem return). Verifique se sua função tem um valor de retorno.`
        }[objType] || `Verifique o nome correto do método para ${objType}. Use print(dir(sua_variavel)) para ver todos os métodos disponíveis.`
      },
      tip: {
        en: 'print(dir(variable)) lists ALL methods available on any Python object.',
        pt: 'print(dir(variavel)) lista TODOS os métodos disponíveis em qualquer objeto Python.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // RecursionError
  // ═══════════════════════════════════════════════
  if (type === 'RecursionError') {
    return {
      type, line, badCode,
      title: { en: 'Function calling itself infinitely', pt: 'Função chamando a si mesma infinitamente' },
      where: lineStr,
      why: {
        en: 'A function called itself (recursion) too many times without a stopping condition. Python has a limit of ~1000 recursive calls to prevent infinite loops.',
        pt: 'Uma função chamou a si mesma (recursão) muitas vezes sem uma condição de parada. Python tem limite de ~1000 chamadas recursivas para evitar loops infinitos.'
      },
      fix: {
        en: 'Every recursive function needs a base case that stops the recursion:\n  def countdown(n):\n      if n <= 0:     # ← base case: STOP here\n          return\n      countdown(n-1) # ← recursive call',
        pt: 'Toda função recursiva precisa de um caso base que para a recursão:\n  def contagem(n):\n      if n <= 0:     # ← caso base: PARA aqui\n          return\n      contagem(n-1) # ← chamada recursiva'
      },
      tip: {
        en: 'For most beginner problems, a while loop is simpler and safer than recursion.',
        pt: 'Para a maioria dos problemas de iniciante, um loop while é mais simples e seguro que recursão.'
      }
    }
  }

  // ═══════════════════════════════════════════════
  // Generic fallback
  // ═══════════════════════════════════════════════
  return {
    type, line, badCode,
    title: { en: `${type}${message ? ': ' + message.slice(0, 50) : ''}`, pt: `${type}${message ? ': ' + message.slice(0, 50) : ''}` },
    where: lineStr,
    why: {
      en: `${codeCtx} caused a ${type}. Full message: ${message}`,
      pt: `${codeCtx} causou um ${type}. Mensagem completa: ${message}`
    },
    fix: {
      en: '• Read the error message — it points to the exact problem\n• Add print() statements before the error line to inspect values\n• Compare your code with the solution',
      pt: '• Leia a mensagem de erro — ela aponta o problema exato\n• Adicione print() antes da linha do erro para inspecionar valores\n• Compare seu código com a solução'
    },
    tip: {
      en: 'Learning to read Python errors is a core skill. The error type + message + line number together tell you exactly what went wrong.',
      pt: 'Aprender a ler erros Python é uma habilidade fundamental. Tipo + mensagem + número de linha juntos dizem exatamente o que deu errado.'
    }
  }
}
