# Hashtag Python 1.4 — Base Zero

## Objetivo

Remover a suposição de que o aluno já sabe usar computador. A versão 1.4 cria uma entrada segura para pessoas que ainda têm dificuldade com arquivos, pastas, downloads, instalação, terminal ou hardware.

## Entregue

- Modo visitante sem cadastro obrigatório.
- Progresso do visitante armazenado no dispositivo.
- Migração do progresso local quando o visitante cria uma conta.
- Onboarding por nível de experiência digital.
- Teste rápido para pular os simuladores quando o aluno já domina a base.
- Base Zero interativa com cinco módulos:
  - arquivos, pastas, caminhos e extensões;
  - downloads e instalação segura;
  - local versus nuvem;
  - terminal sem medo;
  - CPU, RAM, armazenamento e GPU.
- Fase 0 reescrita para refletir a nova Base Zero.
- Glossário clicável nas aulas.
- Botão “Não entendi” com outra explicação.
- Laboratório visual para variáveis, condições e loops.
- Sincronização opcional do estado adaptativo entre dispositivos.
- 35 testes automatizados.

## Supabase opcional

Execute `supabase/learning-states.sql` para sincronizar diagnóstico, domínio por habilidade, tentativas e revisões entre dispositivos.

Sem essa tabela, a aplicação continua funcionando e mantém essa camada localmente no navegador.
