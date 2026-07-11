# Hashtag Python 1.3 — Aprendizagem adaptativa

## O que entrou

- Catálogo explícito de habilidades cobrindo todas as fases publicadas.
- Registro local de tentativas de exercícios, quizzes, exames, diagnóstico e revisões.
- Cálculo de domínio por habilidade com penalidade leve pelo uso de dicas.
- Agendamento de revisão espaçada em 1, 3, 7, 14, 30 e 60 dias.
- Diagnóstico inicial de dez conceitos sem bloquear o curso.
- Fila de revisão baseada em habilidades vencidas ou mais fracas.
- Dicas progressivas: uma dica por vez, sem revelar toda a solução imediatamente.
- Painel de progresso com domínio médio, lacunas prioritárias, histórico e todas as habilidades.
- Home com recomendação diária de diagnóstico ou revisão.
- Testes automatizados do motor de aprendizagem.

## Persistência

A v1.3 salva o estado adaptativo no navegador por usuário autenticado. O progresso formal das fases continua no Supabase. A sincronização multi-dispositivo do estado adaptativo fica como próxima migração de dados, para não exigir SQL novo durante este deploy.

## Importante

A pontuação de domínio não substitui a aprovação do exame. Ela serve para recomendar revisão e mostrar lacunas. O desbloqueio das fases continua exigindo o exame com a nota mínima definida pelo curso.
