# Hashtag Python v11 — plano de execução protegido por qualidade

## Objetivo

Elevar a formação de Python a um padrão empregável sem destruir o motor de execução, a progressão pedagógica ou a estabilidade já alcançada.

## Decisões de arquitetura

1. O currículo será reescrito por mundos e fases, nunca por uma alteração automática em massa.
2. `phaseFactory.ts` poderá manter metadados, mas não será considerado autoria suficiente para uma aula.
3. A métrica de densidade não será usada sozinha. Tamanho mínimo, estrutura didática, código executável, exercícios e testes precisam passar juntos.
4. Cada fase terá dois cenários reais, mas os domínios serão alternados entre varejo, logística, educação, jogos, restaurantes, produtividade, finanças pessoais, ciência, mídia, e-commerce, atendimento, esportes, seguros e construção. Não haverá concentração obrigatória em seguros e construção.
5. Checks `contains` serão inventariados e migrados de forma controlada. O CI não será quebrado antes de existir substituição correta para o conteúdo legado.
6. O Desktop Bridge não receberá um segredo HMAC reutilizável exposto ao aluno. A prova usará desafio de curta duração emitido pelo servidor, identidade do dispositivo e validação no backend.
7. Publicação no PyPI, integração GitHub e páginas públicas exigem revisão de segurança, RLS e privacidade antes da ativação em produção.

## Estado da migração

- Fundação do auditor inteligente: concluída na versão 10.19.0.
- Grading exato, antifraude AST e quality gate: concluídos na versão 10.20.0.
- Fases com grading v11 protegido: 28–68 (41 fases).
- Próximo lote autoral: fases 9–12.

## Ordem de entrega

### Fundação v11

- Auditor V8.5 adaptativo e rápido.
- Relatório slim real.
- Inventário de densidade, exercícios e grading.
- Novas regras adicionadas inicialmente em modo de diagnóstico.
- Grading exato e anti-fraude implementados com testes antes da migração dos dados.

### Currículo 9–27

- Reescrita autoral por fase.
- Quatro exercícios por fase.
- Testes públicos e ocultos com classes de entrada diferentes.
- Contextos diversificados.

### Currículo 28–53

- Conteúdo profissional e avançado autoral.
- Cinco ou seis exercícios conforme o estágio.
- Projetos com evidência verificável.

### Desktop Bridge

- Pacote Python separado.
- Verificação real de Git, ambiente virtual, pytest e estrutura.
- Provas assinadas de curta duração.
- Modo simulado claramente identificado e sem equivalência ao modo verificado.

### Portfólio e entrevista

- Repositórios reais vinculados ao perfil.
- Verificação de README, testes e histórico.
- Fases 69–74.
- Certificado com critérios duros e página pública controlada pelo aluno.

### IA local

- NumPy, Pandas e ML clássico no Pyodide quando tecnicamente viável.
- PyTorch e modelos locais verificados pelo Desktop Bridge.
- Progresso teórico separado de progresso prático verificado.

## Regra de merge

Nenhum mundo será marcado como concluído por quantidade de texto. Para passar, precisa ter:

- conteúdo EN/PT-BR;
- estrutura didática completa;
- exemplos executáveis;
- volume mínimo de exercícios;
- saídas esperadas visíveis;
- testes públicos e ocultos;
- feedback pedagógico;
- auditoria de conteúdo;
- testes automatizados;
- registro de teste com usuário leigo.
