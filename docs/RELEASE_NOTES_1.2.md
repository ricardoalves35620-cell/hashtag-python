# Release 1.2 — execução isolada e avaliação verificável

## Segurança e estabilidade da execução

- O Python saiu da thread principal e agora roda em `public/python.worker.js`.
- Cada execução possui limite padrão de 6 segundos.
- Ao exceder o limite, o Worker é encerrado e recriado na próxima tentativa.
- Loops infinitos deixam de congelar a interface inteira.
- Cada execução usa um namespace Python separado, reduzindo vazamento de variáveis entre tentativas.
- Erros retornam o número da linha do código do aluno quando disponível.
- A primeira carga do Pyodide continua vindo do CDN, mas o PWA armazena o runtime em cache por até 30 dias.

## Avaliação

- O avaliador analisa a AST real do Python, não palavras presentes em comentários ou strings.
- Exercícios verificam execução, resultado e estruturas exigidas pela fase.
- O formato de conteúdo agora aceita testes adicionais com `setupCode`, `afterCode`, entradas ocultas e verificações no resultado do teste.
- A Fase 13 inclui os primeiros testes ocultos de comportamento para funções com valores não mostrados ao aluno.
- Nos exames, o primeiro caso permanece público e os casos seguintes são tratados como ocultos por padrão.
- Foram adicionadas verificações de igualdade, regex, quantidade de linhas e valor numérico.

## Recuperação de falhas

- Variáveis ausentes do Supabase mostram uma página de configuração bilíngue em vez de tela branca.
- Erros React não tratados mostram uma tela de recuperação com opção de recarregar.
- O cliente Supabase só é criado depois que a configuração foi validada.

## Qualidade

- Adicionado Vitest.
- 21 testes automatizados cobrem progressão, integridade curricular, validação e requisitos estruturais.
- Novo comando `npm run check` executa typecheck, testes e build.
- `.npmrc` fixa o registro público do npm.
- O `package-lock.json` não contém referências a registros internos.

## Limites conhecidos

- Pyodide ainda exige internet na primeira carga em um novo dispositivo.
- O Worker impede travamento da interface, mas não deve ser tratado como sandbox para código hostil.
- A maior parte dos exercícios existentes usa avaliação genérica por comportamento e AST. Testes de comportamento específicos ainda precisam ser escritos gradualmente para todo o currículo.
- Testes “ocultos” em uma aplicação cliente são ocultos na interface, não criptograficamente secretos contra inspeção do bundle.
