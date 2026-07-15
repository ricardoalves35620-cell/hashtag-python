# Hashtag Python 10.19.0 — Auditor inteligente e estabilização

## Auditor V8.5

- Modos `Smoke`, `Smart` e `Full`.
- O modo Smart reduz a matriz de 828 execuções profundas para 114 ciclos planejados com 324 visitas de fase.
- Todas as 69 fases são percorridas em três ambientes centrais.
- Fases sentinela cobrem os 12 ambientes de idioma, tema e dispositivo.
- Novos erros visuais recebem uma execução profunda de confirmação.
- Auditoria de conteúdo roda uma vez por execução, não uma vez por ciclo.
- Retomada preserva o ciclo em andamento e a posição real do plano.
- Estado final diferencia conclusão, limite de tempo e interrupção segura.
- Relatório slim remove screenshots repetidos e caminhos locais não portáveis.

## Fluxo pedagógico

- O auditor percorre todas as unidades da aula antes de concluir.
- Exercícios preenchem previsão e plano de mudança antes da execução.
- CodeMirror usa uma ponte determinística, sem inserir linhas vazias.
- O botão desabilitado explica quais pré-requisitos ainda faltam.

## Responsividade

- Ações fixas respeitam navegação inferior e safe area.
- Espaço do teclado virtual não é duplicado.
- Títulos mobile podem usar duas linhas.
- Barra lateral desktop ganhou largura para evitar rótulos cortados.

## Currículo

- Checkpoint de múltiplos testes recebeu instruções numeradas, entradas, resultados esperados e caminho de recuperação.
- Personalização de contexto passa a alternar domínios, reduzindo repetição de seguros e construção.

## Comando recomendado

```powershell
.\run-auditor-night.ps1 -Hours 8
```

Para continuar uma execução interrompida:

```powershell
.\run-auditor-night.ps1 -Hours 8 -Continue
```
