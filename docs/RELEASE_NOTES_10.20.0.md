# Hashtag Python 10.20.0 — v11 grading hardening

## Entrega

Esta versão conclui o segundo bloco de fundação do Hashtag Python v11: grading exato, antifraude AST e proteção contínua contra regressões.

## Grading

- Novo check `equals_any`: exige correspondência completa normalizada, mas aceita representações equivalentes autorizadas.
- Fases 28–68 migradas de `contains` para saída exata normalizada.
- 41 das 69 fases agora estão livres de checks parciais.
- O contrato de `contains` agora aceita justificativa bilíngue explícita para exceções futuras.

## Antifraude AST

O worker Python passa a registrar:

- valores impressos diretamente como literais;
- detalhes das funções;
- argumentos declarados;
- argumentos realmente utilizados;
- literais retornados diretamente.

O avaliador rejeita pedagogicamente dois atalhos:

1. imprimir a resposta esperada sem realizar a chamada obrigatória;
2. criar uma função com argumentos, ignorá-los e retornar diretamente a resposta visível.

Funções legítimas que usam os argumentos e retornam rótulos literais em diferentes ramificações continuam aceitas.

## Qualidade contínua

- Baseline versionado por fase em `audit/v11-quality-baseline.json`.
- Novo comando `npm run audit:v11:gate`.
- O gate bloqueia reduções de densidade, exercícios, exercícios avaliados, testes, testes ocultos, checks exatos e requisitos AST.
- O gate bloqueia aumento de `contains` e de `contains` sem justificativa.
- As fases 28–68 bloqueiam qualquer retorno ao grading parcial.
- `npm run quality:gate` agora inclui o gate v11.

## Auditoria de conteúdo

`content-audit.ts` agora registra:

- meta de 14 KB por fase;
- volume mínimo de exercícios por estágio;
- checks `contains` sem justificativa;
- contrato dos oito blocos obrigatórios para fases marcadas como totalmente migradas.

As dívidas legadas continuam como aviso enquanto cada mundo não for reescrito; fases explicitamente migradas falham o CI se regredirem.

## Validação

- TypeScript: aprovado.
- 200 testes: aprovados.
- Build de produção: aprovado.
- Auditoria curricular: 69/69, gate aprovado.
- Gate v11: aprovado, zero regressões.
- npm audit: zero vulnerabilidades.

## Próximo bloco

Reescrever as fases 9–12 como primeiro lote autoral do currículo 9–27, com quatro exercícios por fase, contextos diversificados, três blocos progressivos de código, erros reais do Python e casos ocultos de classes diferentes.
