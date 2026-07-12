# Estratégia curricular do Hashtag Python

## Princípio central

O app não deve prometer “do zero ao especialista” apenas porque o aluno percorreu telas. Cada avanço precisa provar aprendizagem por execução, testes, explicação e projetos.

A formação possui duas partes:

1. **Trilha Python Profundo**, obrigatória.
2. **Trilha IA Local**, opcional e liberada depois dos pré-requisitos.

## Trilha Python Profundo

### 0. Fundamentos digitais

Arquivos, pastas, ZIP, instalação, navegador, aplicativo, terminal, armazenamento, memória, CPU, GPU, internet, nuvem e execução local.

### 1. Fundamentos de Python

Sintaxe, tipos, operadores, input, decisões, loops, coleções, funções, arquivos, JSON, biblioteca padrão e tratamento de erros.

### 2. Projetos de consolidação

Projetos de terminal que combinam os fundamentos. A conclusão desta etapa significa domínio da base publicada, não domínio avançado.

### 3. Python profissional — publicado nas fases 28–39

- Terminal e ambientes virtuais.
- `pip`, dependências e empacotamento.
- Módulos, pacotes e estrutura de projetos.
- Git e GitHub.
- Testes com `pytest`.
- Tipagem e ferramentas estáticas.
- Logging e debugging.
- Classes, composição, herança e protocolos.
- Refatoração e princípios de design.

### 4. Python avançado — publicado nas fases 40–47

Modelo de dados, iteradores, generators, decorators, context managers, descriptors, metaclasses com propósito, concorrência, multiprocessing, async, profiling, memória e internals.

### 5. Engenharia de software com Python — publicado nas fases 48–52

SQL, bancos, APIs, arquitetura, segurança, automação, data pipelines, deploy, observabilidade e manutenção.

### 6. Capstones de domínio — publicado na fase 53

Projetos grandes, revisão de código desconhecido, decisões de arquitetura e portfólio independente.

## Trilha opcional de IA local — publicada nas fases 54–68

### Pré-requisitos

O aluno deve dominar Python profissional, testes, estruturas de dados, SQL e fundamentos matemáticos. A trilha não deve ensinar apenas a chamar uma biblioteca.

### Etapas

1. NumPy, Pandas, estatística, probabilidade, vetores, matrizes e gradientes.
2. Machine Learning clássico e avaliação.
3. Redes neurais do zero e PyTorch.
4. Tokenização, embeddings, attention e Transformers.
5. Modelos abertos, licenças, quantização, GGUF e inferência local.
6. Embeddings locais, RAG, citações, avaliação, privacidade e LoRA.
7. Capstone: aplicativo desktop privado, local e instalável.

## Modelo de cada microaula

1. Ver um exemplo.
2. Prever o resultado.
3. Modificar o exemplo.
4. Depurar um erro proposital.
5. Construir sem solução pronta.
6. Explicar o raciocínio.
7. Revisar dias depois.

## Avaliação

- Exercícios com testes públicos e ocultos.
- Quiz com domínio mínimo.
- Exames que validam comportamento e estrutura.
- Projetos com rubrica: funcionamento, validação, organização, testes e explicação.
- Domínio por habilidade, não apenas porcentagem de telas visitadas.

## Próxima entrega recomendada

Construir o **Desktop Runner** como complemento do app web. A formação e os laboratórios já estão publicados, mas práticas que exigem sistema de arquivos real, `venv`, Git, SQLite, servidores HTTP, PyTorch, GPU e modelos GGUF precisam de um ambiente nativo controlado.

O runner deve:

- reaproveitar a interface React, preferencialmente com Tauri;
- detectar e instalar uma distribuição Python suportada;
- criar ambientes por projeto;
- executar comandos com confirmação e logs;
- validar missões com testes locais;
- detectar CPU, RAM e GPU;
- baixar modelos apenas de fontes escolhidas pelo aluno;
- manter documentos e índices localmente;
- exportar um relatório de evidências para o app web.

Ele não deve esconder para sempre como o ambiente funciona. Primeiro automatiza com segurança; depois revela e ensina cada comando.
