/**
 * Requirements described in words a learner understands.
 *
 * A failing structural check used to read "Missing required structure: node: BinOp",
 * with the equally unhelpful advice "use node BinOp in the solution". A beginner has
 * no way to act on that — BinOp is an internal name from Python's syntax tree, not
 * something anyone types.
 *
 * These entries say what is missing and, crucially, what to do about it.
 */

export interface RequirementLanguage {
  /** What the check is looking for. */
  what: { en: string; pt: string }
  /** A concrete action, with an example where one helps. */
  how: { en: string; pt: string }
}

const REQUIREMENTS: Record<string, RequirementLanguage> = {
  'node:BinOp': {
    what: {
      en: 'a real calculation, rather than an answer typed in directly',
      pt: 'um cálculo de verdade, em vez da resposta digitada direto',
    },
    how: {
      en: 'Let Python do the arithmetic. Instead of print("Total:", 59), write print("Total:", 47 + 12).',
      pt: 'Deixe o Python fazer a conta. Em vez de print("Total:", 59), escreva print("Total:", 47 + 12).',
    },
  },
  'node:Assign': {
    what: { en: 'a value stored in a variable', pt: 'um valor guardado em uma variável' },
    how: { en: 'Give the value a name first, such as total = 59, then use that name.', pt: 'Dê um nome ao valor primeiro, como total = 59, e depois use esse nome.' },
  },
  'node:If': {
    what: { en: 'a decision made with if', pt: 'uma decisão tomada com if' },
    how: { en: 'Add an if statement that chooses between the possible answers.', pt: 'Adicione um if que escolha entre as respostas possíveis.' },
  },
  'node:While': {
    what: { en: 'a while loop', pt: 'um loop while' },
    how: { en: 'Repeat the work with while, and make sure something changes so it can stop.', pt: 'Repita o trabalho com while, e garanta que algo mude para ele poder parar.' },
  },
  'node:For': {
    what: { en: 'a for loop', pt: 'um loop for' },
    how: { en: 'Go through the items with for instead of writing each one by hand.', pt: 'Percorra os itens com for em vez de escrever cada um à mão.' },
  },
  'node:List': {
    what: { en: 'a list', pt: 'uma lista' },
    how: { en: 'Collect the values inside square brackets, such as items = [1, 2, 3].', pt: 'Junte os valores entre colchetes, como itens = [1, 2, 3].' },
  },
  'node:Dict': {
    what: { en: 'a dictionary', pt: 'um dicionário' },
    how: { en: 'Pair each name with its value inside braces, such as {"name": "Ana"}.', pt: 'Associe cada nome ao seu valor entre chaves, como {"nome": "Ana"}.' },
  },
  'node:ListComp': {
    what: { en: 'a list comprehension', pt: 'uma compreensão de lista' },
    how: { en: 'Build the new list in one expression, such as [n * 2 for n in numbers].', pt: 'Construa a nova lista em uma expressão, como [n * 2 for n in numeros].' },
  },
  'node:FunctionDef': {
    what: { en: 'a function definition', pt: 'a definição de uma função' },
    how: { en: 'Wrap the logic in def name(...): so it can be called with different values.', pt: 'Coloque a lógica dentro de def nome(...): para poder chamá-la com valores diferentes.' },
  },
  'node:Return': {
    what: { en: 'a returned value', pt: 'um valor retornado' },
    how: { en: 'End the function with return, so the caller receives the result instead of only seeing it printed.', pt: 'Termine a função com return, para quem chamou receber o resultado em vez de apenas vê-lo impresso.' },
  },
  'node:Try': {
    what: { en: 'error handling with try/except', pt: 'tratamento de erros com try/except' },
    how: { en: 'Put the risky line inside try: and handle the failure in except.', pt: 'Coloque a linha arriscada dentro de try: e trate a falha no except.' },
  },
  'node:With': {
    what: { en: 'a with block', pt: 'um bloco with' },
    how: { en: 'Open the file using with open(...) as f: so it closes even if something fails.', pt: 'Abra o arquivo com with open(...) as f: para ele fechar mesmo se algo falhar.' },
  },
  'node:Compare': {
    what: { en: 'a comparison', pt: 'uma comparação' },
    how: { en: 'Compare the values with an operator such as >, < or ==.', pt: 'Compare os valores com um operador como >, < ou ==.' },
  },
}

/** Falls back to a readable sentence for requirements without a specific entry. */
export function describeRequirement(kind: string, value: string): RequirementLanguage {
  const entry = REQUIREMENTS[`${kind}:${value}`]
  if (entry) return entry

  if (kind === 'call') {
    return {
      // "a call to print()" is how a programmer says it. On phase 0 this line is read
      // by someone who has never seen the word "call" used this way.
      what: { en: `that you use ${value}()`, pt: `que você use ${value}()` },
      how: { en: `Use ${value}() somewhere in your solution.`, pt: `Use ${value}() em algum ponto da sua solução.` },
    }
  }
  if (kind === 'import') {
    return {
      what: { en: `the ${value} module`, pt: `o módulo ${value}` },
      how: { en: `Add import ${value} at the top of your code.`, pt: `Adicione import ${value} no topo do seu código.` },
    }
  }
  if (kind === 'function') {
    return {
      what: { en: `a function named ${value}`, pt: `uma função chamada ${value}` },
      how: { en: `Define it with def ${value}(...):`, pt: `Defina-a com def ${value}(...):` },
    }
  }
  if (kind === 'assignment') {
    return {
      what: { en: `a variable named ${value}`, pt: `uma variável chamada ${value}` },
      how: { en: `Create it with ${value} = ...`, pt: `Crie-a com ${value} = ...` },
    }
  }
  return {
    what: { en: `the structure ${value}`, pt: `a estrutura ${value}` },
    how: { en: `Review the phase example and use ${value} in your solution.`, pt: `Revise o exemplo da fase e use ${value} na sua solução.` },
  }
}
