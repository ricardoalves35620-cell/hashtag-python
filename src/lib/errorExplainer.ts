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

// ── Parse raw error text from Pyodide ──
// Pyodide wraps user code with 26 lines before user code starts (line 27 = user line 1)
// Offset = 26: user_line = pyodide_line - 26
const PYODIDE_LINE_OFFSET = 26

function parseError(raw: string): { type: string; line: number | null; message: string; badCode: string | null } {
  const lines = raw.split('\n')

  // Extract error type and message from last line
  const lastLine = lines[lines.length - 1].trim()
  const errorMatch = lastLine.match(/^(\w+(?:Error|Warning|Exception)):\s*(.+)$/)
  const type = errorMatch?.[1] || 'Error'
  const message = errorMatch?.[2] || lastLine

  // Extract line number from traceback — adjust for Pyodide wrapper offset
  let line: number | null = null
  let badCode: string | null = null
  for (let i = 0; i < lines.length; i++) {
    const lineMatch = lines[i].match(/File "<exec>", line (\d+)/)
    if (lineMatch) {
      const rawLine = parseInt(lineMatch[1])
      // Subtract wrapper offset — minimum 1
      line = Math.max(1, rawLine - PYODIDE_LINE_OFFSET)
      // Next non-caret line is the problematic code
      if (lines[i + 1] && !lines[i + 1].trim().startsWith('^')) {
        badCode = lines[i + 1].trim()
      }
    }
  }

  return { type, line, message, badCode }
}

// ── Error explanation database ──
function buildExplanation(
  type: string,
  message: string,
  line: number | null,
  badCode: string | null,
  userCode: string
): ErrorExplanation {

  // Only show line if it's within the code's line count
  const codeLineCount = userCode ? userCode.split('\n').length : 999
  const validLine = line && line >= 1 && line <= codeLineCount ? line : null
  const lineStr = validLine
    ? { en: `Line ${validLine}`, pt: `Linha ${validLine}` }
    : { en: 'in your code', pt: 'no seu código' }

  // ── SyntaxError ──
  if (type === 'SyntaxError') {

    if (message.includes("expected ':'")) {
      const hint = badCode?.trim() || ''
      const keyword = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except', 'finally', 'with']
        .find(k => hint.startsWith(k))

      return {
        type, line, badCode,
        title: { en: 'Missing colon (:)', pt: 'Dois pontos faltando (:)' },
        where: lineStr,
        why: {
          en: `In Python, every ${keyword || 'block'} statement must end with a colon (:). Your line is missing it.`,
          pt: `Em Python, toda declaração de ${keyword || 'bloco'} deve terminar com dois pontos (:). Sua linha está sem ele.`
        },
        fix: {
          en: keyword === 'else'
            ? `"else" never has a condition — write it as:\n  else:\n      # your code`
            : `Add a colon at the end of the line:\n  ${hint}:`,
          pt: keyword === 'else'
            ? `"else" nunca tem condição — escreva assim:\n  else:\n      # seu código`
            : `Adicione dois pontos no final da linha:\n  ${hint}:`
        },
        tip: {
          en: 'Every if, elif, else, for, while, def and class must end with ":"',
          pt: 'Todo if, elif, else, for, while, def e class deve terminar com ":"'
        }
      }
    }

    if (message.includes('invalid syntax') || message.includes('invalid character')) {
      return {
        type, line, badCode,
        title: { en: 'Syntax error', pt: 'Erro de sintaxe' },
        where: lineStr,
        why: {
          en: 'Python cannot understand this line. It may have a typo, mismatched brackets, or wrong operator.',
          pt: 'Python não consegue entender esta linha. Pode ter um erro de digitação, parênteses sem par, ou operador errado.'
        },
        fix: {
          en: `Check line ${line ?? ''} for:\n• Missing or extra parentheses ( )\n• Using = instead of == for comparison\n• A typo in a keyword`,
          pt: `Verifique a linha ${line ?? ''} por:\n• Parênteses faltando ou sobrando ( )\n• Usando = em vez de == para comparação\n• Erro de digitação em palavra-chave`
        },
        tip: {
          en: 'Use the toolbar buttons () [] {} to insert matched brackets automatically.',
          pt: 'Use os botões da barra () [] {} para inserir colchetes corretamente de forma automática.'
        }
      }
    }

    if (message.includes("EOL") || message.includes("EOF") || message.includes("was never closed")) {
      return {
        type, line, badCode,
        title: { en: 'Unclosed string or bracket', pt: 'String ou parêntese não fechado' },
        where: lineStr,
        why: {
          en: 'You opened a quote " or ( but never closed it.',
          pt: 'Você abriu uma aspas " ou ( mas nunca fechou.'
        },
        fix: {
          en: 'Make sure every opening " has a closing ", and every ( has a ).',
          pt: 'Certifique-se de que toda " de abertura tem uma " de fechamento, e todo ( tem um ).'
        },
        tip: {
          en: 'Use the toolbar "" and () buttons — they insert both characters at once.',
          pt: 'Use os botões "" e () da barra — eles inserem os dois caracteres de uma vez.'
        }
      }
    }
  }

  // ── IndentationError ──
  if (type === 'IndentationError' || type === 'TabError') {
    return {
      type, line, badCode,
      title: { en: 'Indentation error', pt: 'Erro de indentação' },
      where: lineStr,
      why: {
        en: 'Python uses spaces to know which code belongs inside a block (if, for, def, etc.). This line has the wrong amount of spaces.',
        pt: 'Python usa espaços para saber qual código pertence dentro de um bloco (if, for, def, etc.). Esta linha tem quantidade errada de espaços.'
      },
      fix: {
        en: `• Use the ⇥ Tab button to indent (adds 4 spaces)\n• Use ⌫ Untab to remove indentation\n• All lines in the same block must have the same indentation`,
        pt: `• Use o botão ⇥ Tab para indentar (adiciona 4 espaços)\n• Use ⌫ Untab para remover indentação\n• Todas as linhas do mesmo bloco devem ter a mesma indentação`
      },
      tip: {
        en: 'Never mix tabs and spaces. Use the Tab button in the toolbar for consistent indentation.',
        pt: 'Nunca misture tabs e espaços. Use o botão Tab da barra para indentação consistente.'
      }
    }
  }

  // ── NameError ──
  if (type === 'NameError') {
    const varMatch = message.match(/name '(.+)' is not defined/)
    const varName = varMatch?.[1] || 'the variable'
    return {
      type, line, badCode,
      title: { en: `"${varName}" is not defined`, pt: `"${varName}" não está definido` },
      where: lineStr,
      why: {
        en: `You're using "${varName}" but Python doesn't know what it is. Either it was never created, or it was misspelled.`,
        pt: `Você está usando "${varName}" mas Python não sabe o que é. Ou nunca foi criado, ou está com erro de digitação.`
      },
      fix: {
        en: `• Create it first: ${varName} = some_value\n• Or check the spelling — Python is case-sensitive ("Name" ≠ "name")\n• Make sure it's defined BEFORE the line where you use it`,
        pt: `• Crie antes: ${varName} = algum_valor\n• Ou verifique o nome — Python diferencia maiúsculas ("Nome" ≠ "nome")\n• Certifique-se de defini-lo ANTES da linha onde usa`
      },
      tip: {
        en: 'Python reads code top to bottom. Variables must be assigned before they are used.',
        pt: 'Python lê o código de cima para baixo. Variáveis devem ser atribuídas antes de serem usadas.'
      }
    }
  }

  // ── TypeError ──
  if (type === 'TypeError') {
    if (message.includes('can only concatenate str')) {
      return {
        type, line, badCode,
        title: { en: 'Cannot mix text and number', pt: 'Não pode misturar texto e número' },
        where: lineStr,
        why: {
          en: 'You tried to join a string with a number using +. Python does not do this automatically.',
          pt: 'Você tentou juntar uma string com um número usando +. Python não faz isso automaticamente.'
        },
        fix: {
          en: `Convert the number to text first:\n  print("Age: " + str(age))\nor use an f-string instead:\n  print(f"Age: {age}")`,
          pt: `Converta o número para texto primeiro:\n  print("Idade: " + str(idade))\nou use uma f-string:\n  print(f"Idade: {idade}")`
        },
        tip: {
          en: 'F-strings are easier: f"Your age is {age}" — no conversion needed!',
          pt: 'F-strings são mais fáceis: f"Sua idade é {age}" — sem precisar converter!'
        }
      }
    }

    if (message.includes("'int' object is not iterable") || message.includes("'float' object is not iterable")) {
      return {
        type, line, badCode,
        title: { en: 'Number used as a list', pt: 'Número usado como lista' },
        where: lineStr,
        why: {
          en: 'You tried to loop over a number with "for x in number". You can only loop over lists, strings, or range().',
          pt: 'Você tentou iterar sobre um número com "for x in número". Só pode iterar sobre listas, strings ou range().'
        },
        fix: {
          en: 'If you want to repeat N times, use range():\n  for i in range(number):',
          pt: 'Se quer repetir N vezes, use range():\n  for i in range(numero):'
        },
        tip: {
          en: 'range(5) gives you 0,1,2,3,4 — perfect for counting loops.',
          pt: 'range(5) dá 0,1,2,3,4 — perfeito para loops de contagem.'
        }
      }
    }

    return {
      type, line, badCode,
      title: { en: 'Wrong type of value', pt: 'Tipo de valor errado' },
      where: lineStr,
      why: {
        en: `Type error: ${message}. You're using a value in a way that doesn't work for its type.`,
        pt: `Erro de tipo: ${message}. Você está usando um valor de uma forma que não funciona para o seu tipo.`
      },
      fix: {
        en: 'Check if you need to convert values:\n• int() for numbers\n• str() for text\n• float() for decimals',
        pt: 'Verifique se precisa converter valores:\n• int() para números\n• str() para texto\n• float() para decimais'
      },
      tip: {
        en: 'Use type() to check what type a value is: print(type(my_variable))',
        pt: 'Use type() para ver o tipo de um valor: print(type(minha_variavel))'
      }
    }
  }

  // ── ValueError ──
  if (type === 'ValueError') {
    if (message.includes("invalid literal for int()")) {
      const valMatch = message.match(/: '(.+)'$/)
      const badVal = valMatch?.[1] || 'the value'
      return {
        type, line, badCode,
        title: { en: `Cannot convert "${badVal}" to a number`, pt: `Não consegue converter "${badVal}" em número` },
        where: lineStr,
        why: {
          en: `int() can only convert strings that look like numbers. "${badVal}" is not a valid number.`,
          pt: `int() só converte strings que parecem números. "${badVal}" não é um número válido.`
        },
        fix: {
          en: `• Make sure the user enters a number (e.g. "25"), not text (e.g. "${badVal}")\n• The test inputs must match what your program asks for`,
          pt: `• Certifique-se que o usuário digita um número (ex: "25"), não texto (ex: "${badVal}")\n• As entradas de teste devem corresponder ao que seu programa pede`
        },
        tip: {
          en: 'Check the "Test inputs" box — the order and values must match your input() calls in order.',
          pt: 'Verifique a caixa "Entradas de teste" — a ordem e valores devem corresponder às chamadas input() na ordem.'
        }
      }
    }
  }

  // ── ZeroDivisionError ──
  if (type === 'ZeroDivisionError') {
    return {
      type, line, badCode,
      title: { en: 'Division by zero', pt: 'Divisão por zero' },
      where: lineStr,
      why: {
        en: 'You divided a number by zero, which is mathematically impossible.',
        pt: 'Você dividiu um número por zero, o que é matematicamente impossível.'
      },
      fix: {
        en: 'Add a check before dividing:\n  if divisor != 0:\n      result = number / divisor\n  else:\n      print("Cannot divide by zero")',
        pt: 'Adicione uma verificação antes de dividir:\n  if divisor != 0:\n      resultado = numero / divisor\n  else:\n      print("Não pode dividir por zero")'
      },
      tip: {
        en: 'Always validate user input that will be used as a divisor.',
        pt: 'Sempre valide entradas do usuário que serão usadas como divisor.'
      }
    }
  }

  // ── IndexError ──
  if (type === 'IndexError') {
    return {
      type, line, badCode,
      title: { en: 'List index out of range', pt: 'Índice da lista fora do intervalo' },
      where: lineStr,
      why: {
        en: 'You tried to access a position in a list that does not exist. Lists start at index 0, so a list with 3 items has indexes 0, 1, 2 — not 3.',
        pt: 'Você tentou acessar uma posição em uma lista que não existe. Listas começam no índice 0, então uma lista com 3 itens tem índices 0, 1, 2 — não 3.'
      },
      fix: {
        en: '• Check the list length: len(my_list)\n• Use a for loop instead: for item in my_list:\n• Last item: my_list[-1]',
        pt: '• Verifique o tamanho: len(minha_lista)\n• Use um loop: for item in minha_lista:\n• Último item: minha_lista[-1]'
      },
      tip: {
        en: 'A list with 5 items has valid indexes 0, 1, 2, 3, 4. Index 5 would be out of range.',
        pt: 'Uma lista com 5 itens tem índices válidos 0, 1, 2, 3, 4. O índice 5 estaria fora do intervalo.'
      }
    }
  }

  // ── KeyError ──
  if (type === 'KeyError') {
    const keyMatch = message.match(/^'?(.+?)'?$/)
    const key = keyMatch?.[1] || message
    return {
      type, line, badCode,
      title: { en: `Key "${key}" not found in dictionary`, pt: `Chave "${key}" não encontrada no dicionário` },
      where: lineStr,
      why: {
        en: `You tried to access dictionary["${key}"] but that key doesn't exist.`,
        pt: `Você tentou acessar dicionario["${key}"] mas essa chave não existe.`
      },
      fix: {
        en: `• Use .get() to avoid the error: my_dict.get("${key}", "default")\n• Check if key exists first: if "${key}" in my_dict:\n• Print dict.keys() to see available keys`,
        pt: `• Use .get() para evitar o erro: meu_dict.get("${key}", "padrão")\n• Verifique primeiro: if "${key}" in meu_dict:\n• Imprima dict.keys() para ver as chaves disponíveis`
      },
      tip: {
        en: 'dict.get(key, default) is safer than dict[key] when the key might not exist.',
        pt: 'dict.get(chave, padrão) é mais seguro que dict[chave] quando a chave pode não existir.'
      }
    }
  }

  // ── MemoryError ── (usually infinite loop)
  if (type === 'MemoryError') {
    return {
      type, line, badCode,
      title: { en: 'Infinite loop detected', pt: 'Loop infinito detectado' },
      where: { en: 'in your loop', pt: 'no seu loop' },
      why: {
        en: 'Your while loop never stopped. Either the exit condition is never met, or all test inputs were consumed and the loop kept running.',
        pt: 'Seu loop while nunca parou. Ou a condição de saída nunca é satisfeita, ou todas as entradas de teste foram consumidas e o loop continuou rodando.'
      },
      fix: {
        en: '• Check your while loop exit condition\n• Make sure "break" or the condition can be reached\n• Add more test inputs if your loop reads multiple values\n• Example: while True: needs a break statement',
        pt: '• Verifique a condição de saída do while\n• Certifique-se que "break" ou a condição pode ser alcançada\n• Adicione mais entradas de teste se seu loop lê múltiplos valores\n• Exemplo: while True: precisa de um break'
      },
      tip: {
        en: 'Every while True loop MUST have a "break" statement, or the loop runs forever.',
        pt: 'Todo loop while True PRECISA ter um "break", ou o loop roda para sempre.'
      }
    }
  }

  // ── EOFError ──
  if (type === 'EOFError') {
    return {
      type, line, badCode,
      title: { en: 'Not enough test inputs', pt: 'Entradas de teste insuficientes' },
      where: lineStr,
      why: {
        en: 'Your code calls input() but there are not enough values in the "Test inputs" box. Each input() call needs one line in the test inputs.',
        pt: 'Seu código chama input() mas não há valores suficientes na caixa "Entradas de teste". Cada chamada input() precisa de uma linha nas entradas de teste.'
      },
      fix: {
        en: 'Count how many input() calls your code has, then add that many lines in the test inputs box.',
        pt: 'Conte quantas chamadas input() seu código tem, depois adicione esse número de linhas na caixa de entradas de teste.'
      },
      tip: {
        en: 'If your code has 3 input() calls, you need exactly 3 lines in the test inputs box.',
        pt: 'Se seu código tem 3 chamadas input(), você precisa de exatamente 3 linhas na caixa de entradas.'
      }
    }
  }

  // ── AttributeError ──
  if (type === 'AttributeError') {
    return {
      type, line, badCode,
      title: { en: 'Method or attribute not found', pt: 'Método ou atributo não encontrado' },
      where: lineStr,
      why: {
        en: `${message}. You called a method that does not exist on this type of value.`,
        pt: `${message}. Você chamou um método que não existe neste tipo de valor.`
      },
      fix: {
        en: '• Check the spelling of the method name\n• Make sure the value is the type you think it is\n• Use type(value) to check',
        pt: '• Verifique o nome do método\n• Certifique-se que o valor é do tipo que você pensa\n• Use type(valor) para verificar'
      },
      tip: {
        en: 'String methods: .upper() .lower() .split() .strip() .replace()\nList methods: .append() .remove() .pop() .sort()',
        pt: 'Métodos de string: .upper() .lower() .split() .strip() .replace()\nMétodos de lista: .append() .remove() .pop() .sort()'
      }
    }
  }

  // ── Generic fallback ──
  return {
    type, line, badCode,
    title: { en: `${type}: ${message.slice(0, 50)}`, pt: `${type}: ${message.slice(0, 50)}` },
    where: lineStr,
    why: {
      en: `Your code produced a ${type}. This usually means there's a logic or syntax problem on or near the indicated line.`,
      pt: `Seu código produziu um ${type}. Isso geralmente indica um problema de lógica ou sintaxe na linha indicada.`
    },
    fix: {
      en: '• Read the error message carefully — it points to the exact problem\n• Check the line number indicated\n• Use "Ver solução" to compare with the correct answer',
      pt: '• Leia a mensagem de erro com atenção — ela aponta o problema exato\n• Verifique o número de linha indicado\n• Use "Ver solução" para comparar com a resposta correta'
    },
    tip: {
      en: 'Every error in Python tells you exactly what went wrong and where. Learning to read errors is a core programming skill.',
      pt: 'Todo erro em Python diz exatamente o que deu errado e onde. Aprender a ler erros é uma habilidade fundamental de programação.'
    }
  }
}

export function explainError(rawError: string, userCode: string = ''): ErrorExplanation {
  const { type, line, message, badCode } = parseError(rawError)
  return buildExplanation(type, message, line, badCode, userCode)
}
