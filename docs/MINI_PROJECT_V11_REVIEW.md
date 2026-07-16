# Revisão V11 dos mini projetos

Versão: 10.24.0

Todos os nove mini projetos usam o mesmo fluxo verificável:

1. Entender: definir entrada, saída, regras e caso-limite.
2. Planejar: escrever ao menos três passos de pseudocódigo.
3. Implementar: editar o código e executá-lo com campos de entrada reais.
4. Testar: executar no mínimo três cenários com entradas e resultados esperados visíveis.
5. Melhorar e comprovar: escolher uma melhoria, alterar o código, explicar o motivo e executar novamente todos os cenários.

O último checkpoint não é concluído por marcar uma caixa. A conclusão exige simultaneamente:

- uma única melhoria escolhida;
- código diferente da versão aprovada no checkpoint de testes;
- explicação com pelo menos 20 caracteres;
- todos os cenários novamente aprovados com a versão modificada.

## Projetos revisados

| Fase | Projeto | Cenários | Evidência final específica |
|---:|---|---:|---|
| 4 | Saldo do Orçamento de Evento | 3 | Clareza do cálculo sem alterar resultados |
| 7 | Processador de Fila de Remessas | 3 | Loop legível, término garantido e fila vazia |
| 12 | Relatório de Pedidos do E-commerce | 3 | Transformação e relatório mais claros |
| 27 | Central de Sinistros CLI | 3 | Fronteiras de validação, comandos e relatório |
| 39 | Serviço de Triagem de Sinistros | 3 | Domínio, validação, logging ou separação da CLI |
| 53 | Núcleo de Serviço de Pedidos | 3 | Arquitetura, idempotência, persistência ou testes |
| 60 | Pipeline de Classificação de Risco de Sinistros | 4 | Preparação, métricas, limiar ou reprodutibilidade |
| 64 | Inspetor de Atenção de Transformers | 3 | Validação, normalização, ranking ou explicabilidade |
| 68 | Copiloto Privado de Documentos Locais | 4 | Recuperação, citações, abstinência ou rastreabilidade |

## Correções responsivas compartilhadas

- O editor não aumenta mais a largura da página; linhas longas rolam dentro do CodeMirror.
- Contêineres, cartões, entradas e áreas de código usam `min-width: 0` e largura máxima de 100%.
- Ações de checkpoint ficam no fluxo normal em todos os tamanhos e não cobrem editor, campos ou navegação inferior.
- Botões podem quebrar o texto em mais de uma linha.
- No tablet e celular, a prova final usa uma coluna e respeita a área segura inferior.
- A área principal do projeto usa até 920 px sem ultrapassar a janela.

## Compatibilidade de progresso

Progresso salvo antes da versão 10.24.0 continua válido. Quando o aluno já chegou ao último checkpoint, a última versão testada é recuperada como linha de base para a melhoria, evitando perda do trabalho anterior.
