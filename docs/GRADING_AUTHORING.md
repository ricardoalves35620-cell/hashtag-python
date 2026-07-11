# Como escrever avaliações confiáveis

## Objetivo

Uma avaliação deve verificar o comportamento do programa com valores diferentes dos exemplos e, quando necessário, confirmar a estrutura do código. Não use apenas `contains` para palavras que o aluno pode imprimir de forma fixa.

## Requisitos estruturais

Um exercício pode declarar requisitos analisados pela AST:

```ts
grading: {
  codeRequirements: [
    { kind: 'function', value: 'calculate_total' },
    { kind: 'node', value: 'Return' },
    { kind: 'call', value: 'input' }
  ]
}
```

Tipos disponíveis:

- `node`: nome de um nó da AST, como `For`, `While`, `If`, `FunctionDef`, `Return` ou `Try`.
- `call`: função chamada, como `input`, `open` ou `sqrt`.
- `function`: nome exato de uma função definida.
- `import`: módulo importado.
- `assignment`: variável criada.
- `main_guard`: presença de `if __name__ == "__main__"`.

## Teste oculto de função

`afterCode` roda depois do código do aluno no mesmo namespace, mas sua saída fica separada em `test_output`:

```ts
grading: {
  tests: [
    {
      id: 'hidden_new_values',
      description: {
        en: 'Works with unseen values',
        pt: 'Funciona com valores não vistos'
      },
      inputs: [],
      afterCode: 'print(calculate_total([7, 11, 19]))',
      checks: [
        { type: 'equals', value: '37', target: 'test_output' }
      ],
      points: 1,
      hidden: true
    }
  ]
}
```

## Fixtures com setupCode

Use `setupCode` para disponibilizar dados antes do código do aluno:

```ts
{
  setupCode: 'records = [{"value": 10}, {"value": 20}]',
  afterCode: 'print(summarize(records))',
  checks: [{ type: 'equals', value: '30', target: 'test_output' }]
}
```

## Tipos de verificação

- `no_error`: execução sem erro.
- `contains`: contém o texto.
- `contains_any`: contém pelo menos uma alternativa.
- `not_contains`: não contém o texto.
- `equals`: igualdade após remover espaços externos.
- `matches`: expressão regular.
- `line_count`: número exato de linhas.
- `numeric_equals`: compara o primeiro número encontrado, aceitando `tolerance`.

## Regras editoriais

1. Use ao menos um valor não mostrado na aula para funções e algoritmos.
2. Teste caso normal, limite e entrada vazia quando aplicável.
3. Não dependa da ordem de prompts se ela não fizer parte do objetivo.
4. Não exija uma estrutura específica quando mais de uma solução correta é aceitável.
5. Mensagens públicas devem explicar o objetivo; dados ocultos não devem entregar a resposta.
6. Todo novo exercício precisa passar por `npm run check`.
