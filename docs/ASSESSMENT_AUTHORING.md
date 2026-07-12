# Guia de autoria de avaliações

## Alternativas

Escreva alternativas curtas, paralelas e plausíveis. Não coloque a justificativa apenas na alternativa correta.

Evite:

- resposta correta sempre na primeira posição;
- correta muito maior que as demais;
- uma única alternativa gramaticalmente completa;
- distratores absurdos ou cômicos;
- palavras absolutas como “sempre” somente nos distratores.

Prefira:

- tamanho semelhante;
- mesma estrutura gramatical;
- erros baseados em equívocos reais;
- explicação completa no campo `explanation`.

## Runtime

A interface embaralha perguntas e alternativas por tentativa. O campo `correctIndex` continua apontando para a alternativa no conteúdo original; nunca altere esse índice para refletir a posição visual.
