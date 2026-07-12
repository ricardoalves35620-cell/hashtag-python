# Sprint 4 — Integridade das avaliações

## Objetivo

Remover pistas involuntárias das questões de múltipla escolha e avaliar compreensão em vez de memorização da posição das respostas.

## Mudanças

- Perguntas do quiz são embaralhadas a cada tentativa.
- Alternativas são embaralhadas de forma independente para cada questão.
- A resposta correta continua vinculada ao índice original, portanto a correção permanece precisa.
- Uma nova tentativa recebe outra ordem.
- Diagnóstico, revisão espaçada, teste de preparo digital e Laboratório de Engenharia usam a mesma proteção.
- Alternativas que continham a explicação completa após travessão ou parênteses passam a mostrar apenas a resposta concisa; a explicação continua no feedback após a escolha.
- O sistema evita manter toda a ordem original por coincidência.
- Testes automatizados verificam estabilidade por tentativa, variação entre tentativas e preservação da resposta correta.

## Regra editorial

A alternativa correta não deve ser identificável por:

- posição;
- comprimento;
- nível de detalhe;
- vocabulário mais técnico;
- presença de justificativa que as demais alternativas não possuem.

A justificativa pertence ao campo `explanation`, exibido depois da resposta.
