import { createConceptPhases, type ConceptPhaseSpec } from './phaseFactory'

const specs: ConceptPhaseSpec[] = [
  {
    "id": 54,
    "title": {
      "en": "Vectors and math for AI",
      "pt": "Vetores e matemática para IA"
    },
    "description": {
      "en": "Build the numerical intuition behind similarity, predictions and gradients.",
      "pt": "Construa a intuição numérica por trás de similaridade, previsões e gradientes."
    },
    "icon": "📐",
    "libraries": [],
    "track": "ai-local",
    "stage": "ai-data",
    "estimatedHours": 8,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "vectors, matrices and gradients",
      "pt": "vetores, matrizes e gradientes"
    },
    "why": {
      "en": "AI systems represent examples, parameters and intermediate states as numbers. Vector operations are the language used to compare and transform them.",
      "pt": "Sistemas de IA representam exemplos, parâmetros e estados como números. Operações vetoriais são a linguagem para comparar e transformar."
    },
    "mentalModel": {
      "en": "A vector is an ordered set of features. A dot product combines aligned features into one score. A gradient points toward the fastest local increase of a function.",
      "pt": "Vetor é conjunto ordenado de atributos. Produto escalar combina atributos alinhados em um score. Gradiente aponta maior aumento local."
    },
    "workflow": {
      "en": "Compute small examples by hand, implement them in Python, verify dimensions and only then delegate the same operations to numerical libraries.",
      "pt": "Calcule exemplos pequenos à mão, implemente em Python, valide dimensões e só depois use bibliotecas numéricas."
    },
    "exampleCode": "def dot(a, b):\n    if len(a) != len(b):\n        raise ValueError(\"dimension mismatch\")\n    return sum(x * y for x, y in zip(a, b))\n\nprint(dot([1, 2, 3], [4, 5, 6]))",
    "exampleOutput": {
      "en": "32",
      "pt": "32"
    },
    "professionalCode": "def cosine_similarity(a, b):\n    numerator = dot(a, b)\n    norm_a = sum(x * x for x in a) ** 0.5\n    norm_b = sum(y * y for y in b) ** 0.5\n    if norm_a == 0 or norm_b == 0:\n        return 0.0\n    return numerator / (norm_a * norm_b)",
    "commonMistake": {
      "en": "Applying formulas without checking dimensions or zero norms creates plausible-looking but meaningless numbers.",
      "pt": "Aplicar fórmulas sem verificar dimensões ou normas zero cria números plausíveis mas sem significado."
    },
    "bestPractice": {
      "en": "Write the shape and units beside every vector before coding an operation.",
      "pt": "Escreva forma e unidade de cada vetor antes de programar a operação."
    },
    "outcomes": {
      "en": [
        "Compute dot products and norms",
        "Explain cosine similarity",
        "Relate gradients to parameter updates"
      ],
      "pt": [
        "Calcular produtos escalares e normas",
        "Explicar similaridade cosseno",
        "Relacionar gradientes a atualizações"
      ]
    },
    "practice": {
      "functionName": "dot_product",
      "starterCode": "def dot_product(a, b):\n    \"\"\"Return the dot product and reject different lengths.\"\"\"\n    pass",
      "publicAfterCode": "print(dot_product([1, 2, 3], [4, 5, 6]))",
      "publicExpected": "32",
      "hiddenAfterCode": "try:\n    dot_product([1], [1, 2])\nexcept ValueError:\n    print(\"dimension-mismatch\")",
      "hiddenExpected": "dimension-mismatch",
      "requirements": [
        {
          "kind": "function",
          "value": "dot_product"
        },
        {
          "kind": "call",
          "value": "zip"
        }
      ]
    },
    "exam": {
      "functionName": "dot_product",
      "starterCode": "def dot_product(a, b):\n    \"\"\"Compute a numeric dot product for equal-length vectors.\"\"\"\n    pass",
      "publicAfterCode": "print(dot_product([0.5, 2], [2, 3]))",
      "publicExpected": "7.0",
      "hiddenAfterCode": "print(dot_product([], []))",
      "hiddenExpected": "0",
      "requirements": [
        {
          "kind": "function",
          "value": "dot_product"
        }
      ]
    },
    "quizPurpose": {
      "en": "Express feature interactions and similarity with vector operations.",
      "pt": "Expressar interações e similaridade com operações vetoriais."
    },
    "quizBestPractice": {
      "en": "Verify dimensions and edge cases before trusting a numeric result.",
      "pt": "Validar dimensões e limites antes de confiar no resultado."
    },
    "quizAvoid": {
      "en": "Using a formula on incompatible shapes.",
      "pt": "Usar fórmula em formas incompatíveis."
    }
  },
  {
    "id": 55,
    "title": {
      "en": "NumPy and vectorization",
      "pt": "NumPy e vetorização"
    },
    "description": {
      "en": "Use arrays, shapes and broadcasting to compute reliably at scale.",
      "pt": "Use arrays, formas e broadcasting para computar com eficiência e segurança."
    },
    "icon": "🔢",
    "libraries": [
      "numpy"
    ],
    "track": "ai-local",
    "stage": "ai-data",
    "estimatedHours": 10,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "NumPy arrays and vectorization",
      "pt": "arrays NumPy e vetorização"
    },
    "why": {
      "en": "NumPy moves numerical loops into optimized native code and gives arrays explicit shapes and dtypes. It is the foundation for most Python ML tools.",
      "pt": "NumPy move loops numéricos para código nativo otimizado e dá forma e dtype explícitos. É base da maioria das ferramentas de ML."
    },
    "mentalModel": {
      "en": "An ndarray is a typed block of memory with dimensions. Vectorization applies one operation to many values; broadcasting aligns compatible shapes without copying everything.",
      "pt": "ndarray é bloco tipado com dimensões. Vetorização aplica operação a muitos valores; broadcasting alinha formas compatíveis."
    },
    "workflow": {
      "en": "Inspect shape and dtype, normalize axes deliberately, avoid hidden copies and compare vectorized results against a tiny hand-calculated example.",
      "pt": "Inspecione shape e dtype, normalize eixos deliberadamente, evite cópias ocultas e compare com exemplo manual pequeno."
    },
    "exampleCode": "import numpy as np\nvalues = np.array([2.0, 4.0, 6.0])\nnormalized = (values - values.mean()) / values.std()\nprint(np.round(normalized, 3).tolist())",
    "exampleOutput": {
      "en": "[-1.225, 0.0, 1.225]",
      "pt": "[-1.225, 0.0, 1.225]"
    },
    "professionalCode": "import numpy as np\n\ndef normalize_vector(values):\n    array = np.asarray(values, dtype=float)\n    norm = np.linalg.norm(array)\n    return array if norm == 0 else array / norm",
    "commonMistake": {
      "en": "Broadcasting incompatible axes can silently produce a larger array than intended. Integer arrays can also truncate values in in-place operations.",
      "pt": "Broadcasting de eixos incompatíveis pode gerar array maior que esperado. Arrays inteiros podem truncar valores em operações in-place."
    },
    "bestPractice": {
      "en": "Assert expected shapes at model boundaries and choose dtypes deliberately.",
      "pt": "Afirme formas esperadas nas fronteiras do modelo e escolha dtypes deliberadamente."
    },
    "outcomes": {
      "en": [
        "Create and inspect arrays",
        "Vectorize numerical transforms",
        "Reason about shape, axis and dtype"
      ],
      "pt": [
        "Criar e inspecionar arrays",
        "Vetorizar transformações",
        "Raciocinar sobre shape, eixo e dtype"
      ]
    },
    "practice": {
      "functionName": "normalize_vector",
      "starterCode": "import numpy as np\n\ndef normalize_vector(values):\n    \"\"\"Return a float NumPy vector with L2 norm 1; preserve zero vector.\"\"\"\n    pass",
      "publicAfterCode": "print(np.round(normalize_vector([3, 4]), 3).tolist())",
      "publicExpected": "[0.6, 0.8]",
      "hiddenAfterCode": "print(normalize_vector([0, 0]).tolist())",
      "hiddenExpected": "[0.0, 0.0]",
      "requirements": [
        {
          "kind": "import",
          "value": "numpy"
        },
        {
          "kind": "function",
          "value": "normalize_vector"
        }
      ],
      "timeoutMs": 90000
    },
    "exam": {
      "functionName": "normalize_vector",
      "starterCode": "import numpy as np\n\ndef normalize_vector(values):\n    \"\"\"Normalize without mutating the caller input.\"\"\"\n    pass",
      "publicAfterCode": "source = [1, 0]\nprint(normalize_vector(source).tolist(), source)",
      "publicExpected": "[1, 0]",
      "hiddenAfterCode": "print(np.round(normalize_vector([-2, 0]), 3).tolist())",
      "hiddenExpected": "[-1.0, 0.0]",
      "requirements": [
        {
          "kind": "import",
          "value": "numpy"
        },
        {
          "kind": "function",
          "value": "normalize_vector"
        }
      ],
      "timeoutMs": 90000
    },
    "quizPurpose": {
      "en": "Perform clear numerical operations over typed multidimensional arrays.",
      "pt": "Executar operações numéricas claras sobre arrays tipados."
    },
    "quizBestPractice": {
      "en": "Check shape and dtype at every important boundary.",
      "pt": "Verificar shape e dtype em cada fronteira importante."
    },
    "quizAvoid": {
      "en": "Relying on accidental broadcasting or dtype conversion.",
      "pt": "Depender de broadcasting ou conversão acidental."
    }
  },
  {
    "id": 56,
    "title": {
      "en": "Pandas and data quality",
      "pt": "Pandas e qualidade de dados"
    },
    "description": {
      "en": "Load, clean and validate tabular data without hiding bad assumptions.",
      "pt": "Carregue, limpe e valide dados tabulares sem esconder suposições ruins."
    },
    "icon": "🧹",
    "libraries": [
      "pandas"
    ],
    "track": "ai-local",
    "stage": "ai-data",
    "estimatedHours": 12,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "tabular data preparation",
      "pt": "preparação de dados tabulares"
    },
    "why": {
      "en": "Models learn the patterns present in their data, including mistakes and leakage. Data preparation often matters more than choosing a sophisticated algorithm.",
      "pt": "Modelos aprendem padrões dos dados, incluindo erros e leakage. Preparação costuma importar mais que algoritmo sofisticado."
    },
    "mentalModel": {
      "en": "A DataFrame is a labeled table. Each column has meaning, type, missingness and allowed values. Cleaning is a documented transformation from raw to trusted data.",
      "pt": "DataFrame é tabela rotulada. Cada coluna tem significado, tipo, ausência e valores permitidos. Limpeza é transformação documentada."
    },
    "workflow": {
      "en": "Profile first, define a schema, preserve raw data, transform with explicit steps, record rejected rows and test leakage before training.",
      "pt": "Faça profile, defina schema, preserve bruto, transforme explicitamente, registre rejeições e teste leakage."
    },
    "exampleCode": "import pandas as pd\nframe = pd.DataFrame({\"amount\": [10, None, 30], \"status\": [\" Open \", \"closed\", \"OPEN\"]})\nframe[\"amount\"] = frame[\"amount\"].fillna(frame[\"amount\"].median())\nframe[\"status\"] = frame[\"status\"].str.strip().str.lower()\nprint(frame.to_dict(\"records\"))",
    "exampleOutput": {
      "en": "[{'amount': 10.0, 'status': 'open'}, {'amount': 20.0, 'status': 'closed'}, {'amount': 30.0, 'status': 'open'}]",
      "pt": "[{'amount': 10.0, 'status': 'open'}, {'amount': 20.0, 'status': 'closed'}, {'amount': 30.0, 'status': 'open'}]"
    },
    "professionalCode": "import pandas as pd\n\ndef clean_records(records):\n    frame = pd.DataFrame(records).copy()\n    frame = frame.drop_duplicates()\n    frame[\"status\"] = frame[\"status\"].astype(str).str.strip().str.lower()\n    frame[\"amount\"] = pd.to_numeric(frame[\"amount\"], errors=\"coerce\")\n    frame = frame.dropna(subset=[\"amount\"])\n    return frame.sort_values(\"amount\").to_dict(\"records\")",
    "commonMistake": {
      "en": "Dropping every missing row can remove an entire population. Filling values before splitting can leak information from validation data into training.",
      "pt": "Remover toda linha ausente pode excluir uma população. Preencher antes do split pode vazar informação da validação."
    },
    "bestPractice": {
      "en": "Every cleaning step should state which assumption it enforces and how many rows it changes.",
      "pt": "Cada etapa deve declarar qual suposição impõe e quantas linhas altera."
    },
    "outcomes": {
      "en": [
        "Profile tabular data",
        "Apply reproducible cleaning steps",
        "Detect missingness, duplicates and leakage"
      ],
      "pt": [
        "Fazer profile de dados tabulares",
        "Aplicar limpeza reproduzível",
        "Detectar ausência, duplicatas e leakage"
      ]
    },
    "practice": {
      "functionName": "clean_records",
      "starterCode": "import pandas as pd\n\ndef clean_records(records):\n    \"\"\"Normalize status, coerce amount, remove invalid and duplicate rows, sort by amount.\"\"\"\n    pass",
      "publicAfterCode": "print(clean_records([{\"amount\": \"10\", \"status\": \" Open \"}, {\"amount\": \"bad\", \"status\": \"x\"}]))",
      "publicExpected": "'status': 'open'",
      "hiddenAfterCode": "print(clean_records([{\"amount\": 2, \"status\": \"A\"}, {\"amount\": 1, \"status\": \"B\"}, {\"amount\": 2, \"status\": \"A\"}]))",
      "hiddenExpected": "[{'amount': 1",
      "requirements": [
        {
          "kind": "import",
          "value": "pandas"
        },
        {
          "kind": "function",
          "value": "clean_records"
        }
      ],
      "timeoutMs": 90000
    },
    "exam": {
      "functionName": "clean_records",
      "starterCode": "import pandas as pd\n\ndef clean_records(records):\n    \"\"\"Return a list of cleaned records without changing the source list.\"\"\"\n    pass",
      "publicAfterCode": "source=[{\"amount\": \"5\", \"status\": \" OPEN \"}]\nprint(clean_records(source), source)",
      "publicExpected": "'status': 'open'",
      "hiddenAfterCode": "print(clean_records([]))",
      "hiddenExpected": "[]",
      "requirements": [
        {
          "kind": "import",
          "value": "pandas"
        },
        {
          "kind": "function",
          "value": "clean_records"
        }
      ],
      "timeoutMs": 90000
    },
    "quizPurpose": {
      "en": "Turn raw tables into validated, traceable model inputs.",
      "pt": "Transformar tabelas brutas em entradas validadas e rastreáveis."
    },
    "quizBestPractice": {
      "en": "Preserve raw data and measure every cleaning decision.",
      "pt": "Preservar dados brutos e medir cada decisão de limpeza."
    },
    "quizAvoid": {
      "en": "Deleting or filling data without studying bias and leakage.",
      "pt": "Excluir ou preencher dados sem estudar viés e leakage."
    }
  },
  {
    "id": 57,
    "title": {
      "en": "Statistics, probability and metrics",
      "pt": "Estatística, probabilidade e métricas"
    },
    "description": {
      "en": "Quantify uncertainty and choose metrics that match the real cost of errors.",
      "pt": "Quantifique incerteza e escolha métricas alinhadas ao custo real dos erros."
    },
    "icon": "🎲",
    "libraries": [],
    "track": "ai-local",
    "stage": "ai-data",
    "estimatedHours": 8,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "statistics and model metrics",
      "pt": "estatística e métricas de modelo"
    },
    "why": {
      "en": "A single average or accuracy score can hide rare but costly failures. Statistics describes variation; probability expresses uncertainty; metrics encode what matters.",
      "pt": "Uma média ou accuracy pode esconder falhas raras e caras. Estatística descreve variação; probabilidade expressa incerteza; métricas codificam prioridade."
    },
    "mentalModel": {
      "en": "A metric summarizes a confusion matrix or prediction error. Precision asks how many predicted positives were right; recall asks how many real positives were found.",
      "pt": "Métrica resume matriz de confusão ou erro. Precisão pergunta quantos positivos previstos estavam certos; recall quantos reais foram encontrados."
    },
    "workflow": {
      "en": "Define the decision and cost first, establish a baseline, report uncertainty and inspect metrics by relevant groups instead of only a global score.",
      "pt": "Defina decisão e custo primeiro, estabeleça baseline, reporte incerteza e inspecione métricas por grupos."
    },
    "exampleCode": "def classification_metrics(tp, fp, fn):\n    precision = tp / (tp + fp) if tp + fp else 0.0\n    recall = tp / (tp + fn) if tp + fn else 0.0\n    return round(precision, 3), round(recall, 3)\n\nprint(classification_metrics(8, 2, 4))",
    "exampleOutput": {
      "en": "(0.8, 0.667)",
      "pt": "(0.8, 0.667)"
    },
    "professionalCode": "def f1_score(precision, recall):\n    if precision + recall == 0:\n        return 0.0\n    return 2 * precision * recall / (precision + recall)",
    "commonMistake": {
      "en": "Choosing a metric after seeing results encourages cherry-picking. Accuracy on highly imbalanced data can reward a useless model.",
      "pt": "Escolher métrica após ver resultados incentiva seleção conveniente. Accuracy em dados desbalanceados pode premiar modelo inútil."
    },
    "bestPractice": {
      "en": "Write the failure cost and metric before training, then keep a simple baseline for comparison.",
      "pt": "Escreva custo da falha e métrica antes do treino e mantenha baseline simples."
    },
    "outcomes": {
      "en": [
        "Compute precision, recall and F1",
        "Describe uncertainty and distributions",
        "Select metrics from decision costs"
      ],
      "pt": [
        "Calcular precisão, recall e F1",
        "Descrever incerteza e distribuições",
        "Selecionar métricas pelo custo"
      ]
    },
    "practice": {
      "functionName": "classification_metrics",
      "starterCode": "def classification_metrics(tp, fp, fn):\n    \"\"\"Return precision, recall and F1, using 0 for undefined divisions.\"\"\"\n    pass",
      "publicAfterCode": "print(tuple(round(x, 3) for x in classification_metrics(8, 2, 4)))",
      "publicExpected": "(0.8, 0.667, 0.727)",
      "hiddenAfterCode": "print(classification_metrics(0, 0, 0))",
      "hiddenExpected": "(0.0, 0.0, 0.0)",
      "requirements": [
        {
          "kind": "function",
          "value": "classification_metrics"
        }
      ]
    },
    "exam": {
      "functionName": "classification_metrics",
      "starterCode": "def classification_metrics(tp, fp, fn):\n    \"\"\"Reject negative counts and return three metrics.\"\"\"\n    pass",
      "publicAfterCode": "print(tuple(round(x, 2) for x in classification_metrics(5, 5, 0)))",
      "publicExpected": "(0.5, 1.0, 0.67)",
      "hiddenAfterCode": "try:\n    classification_metrics(-1, 0, 0)\nexcept ValueError:\n    print(\"invalid-count\")",
      "hiddenExpected": "invalid-count",
      "requirements": [
        {
          "kind": "function",
          "value": "classification_metrics"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Measure model behavior in terms of uncertainty and error costs.",
      "pt": "Medir comportamento do modelo em termos de incerteza e custos."
    },
    "quizBestPractice": {
      "en": "Choose metrics before training and inspect groups and baselines.",
      "pt": "Escolher métricas antes do treino e inspecionar grupos e baselines."
    },
    "quizAvoid": {
      "en": "Using one convenient aggregate metric for every decision.",
      "pt": "Usar uma métrica agregada conveniente para toda decisão."
    }
  },
  {
    "id": 58,
    "title": {
      "en": "Machine learning workflow",
      "pt": "Fluxo de Machine Learning"
    },
    "description": {
      "en": "Separate train, validation and test evidence and prevent leakage.",
      "pt": "Separe evidência de treino, validação e teste e evite leakage."
    },
    "icon": "🧭",
    "libraries": [],
    "track": "ai-local",
    "stage": "ai-data",
    "estimatedHours": 8,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "the ML experiment lifecycle",
      "pt": "o ciclo de experimento de ML"
    },
    "why": {
      "en": "A model is only useful if it generalizes to future data. Honest evaluation requires data the model and tuning process have not seen.",
      "pt": "Modelo só é útil se generaliza para dados futuros. Avaliação honesta exige dados não vistos pelo modelo nem pelo tuning."
    },
    "mentalModel": {
      "en": "Training fits parameters, validation chooses decisions, and the test set estimates final generalization once. A pipeline applies learned transformations consistently.",
      "pt": "Treino ajusta parâmetros, validação escolhe decisões e teste estima generalização uma vez. Pipeline aplica transformações consistentemente."
    },
    "workflow": {
      "en": "Freeze the problem and metric, split by the real deployment boundary, fit preprocessing only on training data, track experiments and compare against a baseline.",
      "pt": "Congele problema e métrica, divida pela fronteira real, ajuste preprocessing só no treino, rastreie experimentos e compare baseline."
    },
    "exampleCode": "def split_dataset(items, train_ratio=0.6, validation_ratio=0.2):\n    n = len(items)\n    train_end = int(n * train_ratio)\n    validation_end = train_end + int(n * validation_ratio)\n    return items[:train_end], items[train_end:validation_end], items[validation_end:]\n\nprint(split_dataset(list(range(10))))",
    "exampleOutput": {
      "en": "([0, 1, 2, 3, 4, 5], [6, 7], [8, 9])",
      "pt": "([0, 1, 2, 3, 4, 5], [6, 7], [8, 9])"
    },
    "professionalCode": "# Time-dependent deployment usually needs a chronological split.\n# Group-dependent deployment may require keeping one customer entirely in one split.\n# Random splitting is not automatically honest.",
    "commonMistake": {
      "en": "Tuning repeatedly on the test set turns it into another validation set. Randomly splitting rows from the same person across sets creates leakage.",
      "pt": "Ajustar repetidamente no teste transforma-o em validação. Dividir linhas da mesma pessoa entre conjuntos cria leakage."
    },
    "bestPractice": {
      "en": "Match the split strategy to how future data will arrive and keep the test set sealed until the final decision.",
      "pt": "Alinhe split à chegada futura dos dados e mantenha teste fechado até decisão final."
    },
    "outcomes": {
      "en": [
        "Design honest train/validation/test splits",
        "Prevent preprocessing leakage",
        "Track baselines and experiment decisions"
      ],
      "pt": [
        "Projetar splits honestos",
        "Evitar leakage de preprocessing",
        "Rastrear baselines e decisões"
      ]
    },
    "practice": {
      "functionName": "split_dataset",
      "starterCode": "def split_dataset(items, train_ratio=0.6, validation_ratio=0.2):\n    \"\"\"Return train, validation and test slices without overlap.\"\"\"\n    pass",
      "publicAfterCode": "print(split_dataset(list(range(10))))",
      "publicExpected": "[8, 9]",
      "hiddenAfterCode": "print(split_dataset(list(range(5)), 0.6, 0.2))",
      "hiddenExpected": "[4]",
      "requirements": [
        {
          "kind": "function",
          "value": "split_dataset"
        }
      ]
    },
    "exam": {
      "functionName": "split_dataset",
      "starterCode": "def split_dataset(items, train_ratio=0.6, validation_ratio=0.2):\n    \"\"\"Reject negative ratios or a train+validation ratio above 1.\"\"\"\n    pass",
      "publicAfterCode": "print([len(x) for x in split_dataset(list(range(20)), 0.5, 0.25)])",
      "publicExpected": "[10, 5, 5]",
      "hiddenAfterCode": "try:\n    split_dataset([1, 2], 0.8, 0.4)\nexcept ValueError:\n    print(\"invalid-ratios\")",
      "hiddenExpected": "invalid-ratios",
      "requirements": [
        {
          "kind": "function",
          "value": "split_dataset"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Create honest evidence that predicts future model behavior.",
      "pt": "Criar evidência honesta que prevê comportamento futuro."
    },
    "quizBestPractice": {
      "en": "Make splits reflect deployment and seal final test data.",
      "pt": "Fazer split refletir deploy e fechar dados de teste."
    },
    "quizAvoid": {
      "en": "Tuning on test data or leaking identities across splits.",
      "pt": "Ajustar no teste ou vazar identidades entre splits."
    }
  },
  {
    "id": 59,
    "title": {
      "en": "Linear regression from scratch",
      "pt": "Regressão linear do zero"
    },
    "description": {
      "en": "Understand prediction, loss and gradient descent by implementing a tiny model.",
      "pt": "Entenda previsão, loss e gradient descent implementando modelo pequeno."
    },
    "icon": "📈",
    "libraries": [],
    "track": "ai-local",
    "stage": "ai-data",
    "estimatedHours": 8,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "regression and gradient descent",
      "pt": "regressão e gradient descent"
    },
    "why": {
      "en": "Implementing a simple model exposes what libraries automate: parameters produce predictions, loss measures error and gradients update parameters.",
      "pt": "Implementar modelo simples revela o que bibliotecas automatizam: parâmetros geram previsões, loss mede erro e gradientes atualizam."
    },
    "mentalModel": {
      "en": "A line predicts y = wx + b. Mean squared error penalizes distance. Gradient descent changes w and b in the direction that reduces loss.",
      "pt": "Uma linha prevê y = wx + b. Erro quadrático penaliza distância. Gradient descent muda w e b para reduzir loss."
    },
    "workflow": {
      "en": "Standardize scales when needed, inspect a loss curve, compare with a mean baseline and verify learned parameters on held-out examples.",
      "pt": "Padronize escalas quando necessário, inspecione curva de loss, compare com baseline de média e valide em dados separados."
    },
    "exampleCode": "def predict(x, weight, bias):\n    return weight * x + bias\n\nprint(predict(4, 2.5, 1))",
    "exampleOutput": {
      "en": "11.0",
      "pt": "11.0"
    },
    "professionalCode": "def train_step(xs, ys, weight, bias, learning_rate):\n    predictions = [weight * x + bias for x in xs]\n    n = len(xs)\n    grad_w = (2 / n) * sum((p - y) * x for p, y, x in zip(predictions, ys, xs))\n    grad_b = (2 / n) * sum(p - y for p, y in zip(predictions, ys))\n    return weight - learning_rate * grad_w, bias - learning_rate * grad_b",
    "commonMistake": {
      "en": "A learning rate that is too large makes loss diverge; evaluating only training loss hides overfitting and data problems.",
      "pt": "Learning rate grande faz loss divergir; avaliar só treino esconde overfitting e problemas de dados."
    },
    "bestPractice": {
      "en": "Plot or record both training and validation loss and compare with a trivial baseline.",
      "pt": "Registre loss de treino e validação e compare com baseline trivial."
    },
    "outcomes": {
      "en": [
        "Compute predictions and MSE",
        "Explain gradient updates",
        "Diagnose learning-rate behavior"
      ],
      "pt": [
        "Calcular previsões e MSE",
        "Explicar atualizações de gradiente",
        "Diagnosticar learning rate"
      ]
    },
    "practice": {
      "functionName": "linear_predict",
      "starterCode": "def linear_predict(xs, weight, bias):\n    \"\"\"Return one prediction for each x.\"\"\"\n    pass",
      "publicAfterCode": "print(linear_predict([0, 1, 2], 2, 1))",
      "publicExpected": "[1, 3, 5]",
      "hiddenAfterCode": "print(linear_predict([], 5, -1))",
      "hiddenExpected": "[]",
      "requirements": [
        {
          "kind": "function",
          "value": "linear_predict"
        }
      ]
    },
    "exam": {
      "functionName": "linear_predict",
      "starterCode": "def linear_predict(xs, weight, bias):\n    \"\"\"Preserve floating-point predictions.\"\"\"\n    pass",
      "publicAfterCode": "print(linear_predict([0.5, 1.5], 2.0, 0.5))",
      "publicExpected": "[1.5, 3.5]",
      "hiddenAfterCode": "print(linear_predict([-1], 3, 2))",
      "hiddenExpected": "[-1]",
      "requirements": [
        {
          "kind": "function",
          "value": "linear_predict"
        }
      ]
    },
    "quizPurpose": {
      "en": "Connect parameters, predictions, loss and gradient updates.",
      "pt": "Conectar parâmetros, previsões, loss e gradientes."
    },
    "quizBestPractice": {
      "en": "Compare training dynamics and held-out performance to a baseline.",
      "pt": "Comparar dinâmica e desempenho separado com baseline."
    },
    "quizAvoid": {
      "en": "Changing parameters without monitoring loss and validation.",
      "pt": "Mudar parâmetros sem monitorar loss e validação."
    }
  },
  {
    "id": 60,
    "title": {
      "en": "Classification and reproducible pipelines",
      "pt": "Classificação e pipelines reproduzíveis"
    },
    "description": {
      "en": "Train and evaluate classification systems with consistent preprocessing.",
      "pt": "Treine e avalie sistemas de classificação com preprocessing consistente."
    },
    "icon": "🎯",
    "libraries": [
      "scikit-learn"
    ],
    "track": "ai-local",
    "stage": "ai-data",
    "estimatedHours": 12,
    "desktopRequired": true,
    "labPath": "/ai-lab",
    "concept": {
      "en": "classification pipelines",
      "pt": "pipelines de classificação"
    },
    "why": {
      "en": "Classification converts features into categories or probabilities. A pipeline prevents training and inference from applying different transformations.",
      "pt": "Classificação converte atributos em categorias ou probabilidades. Pipeline evita transformações diferentes em treino e inferência."
    },
    "mentalModel": {
      "en": "A classifier produces scores or labels. A decision threshold converts probability into action. Preprocessing, model and threshold are one versioned system.",
      "pt": "Classificador produz scores ou rótulos. Threshold converte probabilidade em ação. Preprocessing, modelo e threshold são um sistema versionado."
    },
    "workflow": {
      "en": "Fit transformations on training data, evaluate probability calibration and threshold costs, serialize the whole pipeline and validate input schema at inference.",
      "pt": "Ajuste transformações no treino, avalie calibração e custos de threshold, serialize pipeline inteiro e valide schema na inferência."
    },
    "exampleCode": "def classify_scores(scores, threshold=0.5):\n    return [1 if score >= threshold else 0 for score in scores]\n\nprint(classify_scores([0.2, 0.5, 0.9]))",
    "exampleOutput": {
      "en": "[0, 1, 1]",
      "pt": "[0, 1, 1]"
    },
    "professionalCode": "# scikit-learn concept:\n# Pipeline([(\"scale\", StandardScaler()), (\"model\", LogisticRegression())])\n# pipeline.fit(X_train, y_train)\n# probabilities = pipeline.predict_proba(X_valid)[:, 1]\n# choose threshold from decision costs, not convenience",
    "commonMistake": {
      "en": "Fitting a scaler on all data leaks validation information. Saving only the classifier and forgetting preprocessing makes production predictions inconsistent.",
      "pt": "Ajustar scaler em todos dados vaza validação. Salvar só classificador e esquecer preprocessing torna produção inconsistente."
    },
    "bestPractice": {
      "en": "Version preprocessing, model, threshold, schema and metrics as one deployable unit.",
      "pt": "Versione preprocessing, modelo, threshold, schema e métricas como uma unidade."
    },
    "outcomes": {
      "en": [
        "Convert probabilities to decisions",
        "Evaluate threshold trade-offs",
        "Package preprocessing and model together"
      ],
      "pt": [
        "Converter probabilidades em decisões",
        "Avaliar trade-offs de threshold",
        "Empacotar preprocessing e modelo juntos"
      ]
    },
    "practice": {
      "functionName": "classify_scores",
      "starterCode": "def classify_scores(scores, threshold=0.5):\n    \"\"\"Return 1 for scores at or above threshold, else 0.\"\"\"\n    pass",
      "publicAfterCode": "print(classify_scores([0.2, 0.5, 0.9]))",
      "publicExpected": "[0, 1, 1]",
      "hiddenAfterCode": "print(classify_scores([], 0.7))",
      "hiddenExpected": "[]",
      "requirements": [
        {
          "kind": "function",
          "value": "classify_scores"
        }
      ]
    },
    "exam": {
      "functionName": "classify_scores",
      "starterCode": "def classify_scores(scores, threshold=0.5):\n    \"\"\"Reject thresholds outside 0..1.\"\"\"\n    pass",
      "publicAfterCode": "print(classify_scores([0.49, 0.5], 0.5))",
      "publicExpected": "[0, 1]",
      "hiddenAfterCode": "try:\n    classify_scores([0.2], 1.5)\nexcept ValueError:\n    print(\"invalid-threshold\")",
      "hiddenExpected": "invalid-threshold",
      "requirements": [
        {
          "kind": "function",
          "value": "classify_scores"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Turn calibrated scores into reproducible decisions.",
      "pt": "Transformar scores calibrados em decisões reproduzíveis."
    },
    "quizBestPractice": {
      "en": "Deploy preprocessing, model and threshold together.",
      "pt": "Publicar preprocessing, modelo e threshold juntos."
    },
    "quizAvoid": {
      "en": "Leaking validation data or separating model from preprocessing.",
      "pt": "Vazar validação ou separar modelo do preprocessing."
    }
  },
  {
    "id": 61,
    "title": {
      "en": "Neural networks from first principles",
      "pt": "Redes neurais desde os princípios"
    },
    "description": {
      "en": "Implement forward computation and parameter updates with small arrays.",
      "pt": "Implemente cálculo forward e atualização de parâmetros com arrays pequenos."
    },
    "icon": "🕸️",
    "libraries": [
      "numpy"
    ],
    "track": "ai-local",
    "stage": "ai-deep",
    "estimatedHours": 12,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "neural network computation",
      "pt": "cálculo de rede neural"
    },
    "why": {
      "en": "A neural network composes linear transformations and nonlinear activations. Understanding a tiny network makes frameworks less magical and failures easier to diagnose.",
      "pt": "Rede neural compõe transformações lineares e ativações não lineares. Entender rede pequena reduz magia e facilita diagnóstico."
    },
    "mentalModel": {
      "en": "Each layer computes weighted inputs plus bias, then activation. Loss compares output to target; backpropagation applies the chain rule to every parameter.",
      "pt": "Cada camada calcula pesos mais bias e ativação. Loss compara saída ao alvo; backprop aplica regra da cadeia aos parâmetros."
    },
    "workflow": {
      "en": "Check shapes, initialize small weights, verify gradients numerically on a toy case and monitor train and validation curves.",
      "pt": "Verifique shapes, inicialize pesos pequenos, valide gradientes numericamente e monitore curvas de treino e validação."
    },
    "exampleCode": "import math\n\ndef sigmoid(value):\n    return 1 / (1 + math.exp(-value))\n\ndef neuron(inputs, weights, bias):\n    return sigmoid(sum(x * w for x, w in zip(inputs, weights)) + bias)\n\nprint(round(neuron([1, 2], [0.5, -0.25], 0.1), 4))",
    "exampleOutput": {
      "en": "0.525",
      "pt": "0.525"
    },
    "professionalCode": "def gradient_step(weight, x, target, learning_rate):\n    prediction = weight * x\n    gradient = 2 * (prediction - target) * x\n    return weight - learning_rate * gradient",
    "commonMistake": {
      "en": "Deep networks can appear to train while gradients vanish, explode or data shapes are wrong. Accuracy alone does not reveal unstable loss.",
      "pt": "Redes profundas podem parecer treinar enquanto gradientes somem, explodem ou shapes estão errados. Accuracy não revela loss instável."
    },
    "bestPractice": {
      "en": "Begin with a model that can overfit a tiny batch; if it cannot, debug the pipeline before scaling.",
      "pt": "Comece com modelo que consegue overfit um lote minúsculo; se não consegue, depure antes de escalar."
    },
    "outcomes": {
      "en": [
        "Compute neuron forward passes",
        "Explain loss and backpropagation",
        "Run gradient checks on toy data"
      ],
      "pt": [
        "Calcular forward de neurônio",
        "Explicar loss e backpropagation",
        "Verificar gradientes em dados pequenos"
      ]
    },
    "practice": {
      "functionName": "gradient_step",
      "starterCode": "def gradient_step(weight, x, target, learning_rate):\n    \"\"\"Apply one MSE gradient step for prediction weight*x.\"\"\"\n    pass",
      "publicAfterCode": "print(round(gradient_step(0.0, 2.0, 4.0, 0.1), 3))",
      "publicExpected": "1.6",
      "hiddenAfterCode": "print(round(gradient_step(2.0, 0.0, 5.0, 0.1), 3))",
      "hiddenExpected": "2.0",
      "requirements": [
        {
          "kind": "function",
          "value": "gradient_step"
        }
      ]
    },
    "exam": {
      "functionName": "gradient_step",
      "starterCode": "def gradient_step(weight, x, target, learning_rate):\n    \"\"\"Reject negative learning rates.\"\"\"\n    pass",
      "publicAfterCode": "print(round(gradient_step(1.0, 1.0, 2.0, 0.5), 3))",
      "publicExpected": "2.0",
      "hiddenAfterCode": "try:\n    gradient_step(1, 1, 1, -0.1)\nexcept ValueError:\n    print(\"invalid-rate\")",
      "hiddenExpected": "invalid-rate",
      "requirements": [
        {
          "kind": "function",
          "value": "gradient_step"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Understand how parameters produce predictions and receive gradients.",
      "pt": "Entender como parâmetros produzem previsões e recebem gradientes."
    },
    "quizBestPractice": {
      "en": "Verify tiny batches, shapes and gradients before scaling.",
      "pt": "Validar lotes pequenos, shapes e gradientes antes de escalar."
    },
    "quizAvoid": {
      "en": "Scaling a broken training loop to more data or hardware.",
      "pt": "Escalar loop quebrado para mais dados ou hardware."
    }
  },
  {
    "id": 62,
    "title": {
      "en": "PyTorch training systems",
      "pt": "Sistemas de treino com PyTorch"
    },
    "description": {
      "en": "Translate neural network concepts into tensors, modules, datasets and checkpoints.",
      "pt": "Traduza redes neurais em tensors, módulos, datasets e checkpoints."
    },
    "icon": "🔥",
    "libraries": [
      "torch"
    ],
    "track": "ai-local",
    "stage": "ai-deep",
    "estimatedHours": 14,
    "desktopRequired": true,
    "labPath": "/ai-lab",
    "concept": {
      "en": "PyTorch training loops",
      "pt": "loops de treino PyTorch"
    },
    "why": {
      "en": "PyTorch provides automatic differentiation and hardware-aware tensors, but you still own data quality, shapes, loss, evaluation and reproducibility.",
      "pt": "PyTorch fornece autodiff e tensors com hardware, mas você ainda responde por dados, shapes, loss, avaliação e reprodutibilidade."
    },
    "mentalModel": {
      "en": "A tensor has shape, dtype and device. A Module owns parameters. Autograd records operations, backward computes gradients and the optimizer updates parameters.",
      "pt": "Tensor tem shape, dtype e device. Module possui parâmetros. Autograd registra operações, backward calcula gradientes e optimizer atualiza."
    },
    "workflow": {
      "en": "Seed experiments, move every tensor and model to one device, zero gradients, checkpoint model plus optimizer and evaluate under no_grad mode.",
      "pt": "Defina seed, mova tensors e modelo ao mesmo device, zere gradientes, salve modelo e optimizer e avalie com no_grad."
    },
    "exampleCode": "def training_step(weight, x, target, learning_rate):\n    prediction = weight * x\n    loss = (prediction - target) ** 2\n    gradient = 2 * (prediction - target) * x\n    return weight - learning_rate * gradient, loss\n\nprint(training_step(0.0, 2.0, 4.0, 0.1))",
    "exampleOutput": {
      "en": "(1.6, 16.0)",
      "pt": "(1.6, 16.0)"
    },
    "professionalCode": "# Desktop PyTorch pattern:\n# optimizer.zero_grad()\n# predictions = model(features)\n# loss = loss_fn(predictions, targets)\n# loss.backward()\n# optimizer.step()\n# Save model.state_dict(), optimizer.state_dict(), epoch and configuration.",
    "commonMistake": {
      "en": "Forgetting optimizer.zero_grad accumulates gradients. Mixing CPU and GPU tensors causes runtime errors. Saving only weights loses optimizer and training context.",
      "pt": "Esquecer zero_grad acumula gradientes. Misturar CPU e GPU causa erro. Salvar só pesos perde optimizer e contexto."
    },
    "bestPractice": {
      "en": "Log shapes, device, loss and learning rate, and make one tiny batch overfit before starting a long run.",
      "pt": "Registre shapes, device, loss e learning rate e faça um lote minúsculo overfit antes de treino longo."
    },
    "outcomes": {
      "en": [
        "Explain tensors, modules and autograd",
        "Write a correct training loop",
        "Checkpoint and resume reproducibly"
      ],
      "pt": [
        "Explicar tensors, modules e autograd",
        "Escrever loop de treino correto",
        "Salvar e retomar de forma reproduzível"
      ]
    },
    "practice": {
      "functionName": "training_step",
      "starterCode": "def training_step(weight, x, target, learning_rate):\n    \"\"\"Return updated weight and pre-update MSE loss.\"\"\"\n    pass",
      "publicAfterCode": "print(training_step(0.0, 2.0, 4.0, 0.1))",
      "publicExpected": "(1.6, 16.0)",
      "hiddenAfterCode": "print(training_step(2.0, 0.0, 5.0, 0.1))",
      "hiddenExpected": "(2.0, 25.0)",
      "requirements": [
        {
          "kind": "function",
          "value": "training_step"
        }
      ]
    },
    "exam": {
      "functionName": "training_step",
      "starterCode": "def training_step(weight, x, target, learning_rate):\n    \"\"\"Apply one deterministic scalar training step.\"\"\"\n    pass",
      "publicAfterCode": "weight, loss = training_step(1.0, 1.0, 2.0, 0.5)\nprint(weight, loss)",
      "publicExpected": "2.0 1.0",
      "hiddenAfterCode": "print(training_step(3.0, 1.0, 3.0, 0.1))",
      "hiddenExpected": "(3.0, 0.0)",
      "requirements": [
        {
          "kind": "function",
          "value": "training_step"
        }
      ]
    },
    "quizPurpose": {
      "en": "Build reproducible tensor training and checkpoint workflows.",
      "pt": "Construir treino e checkpoint reproduzíveis com tensors."
    },
    "quizBestPractice": {
      "en": "Verify device, shapes, gradients and tiny-batch learning first.",
      "pt": "Validar device, shapes, gradientes e lote pequeno primeiro."
    },
    "quizAvoid": {
      "en": "Starting long GPU training before proving the loop on tiny data.",
      "pt": "Iniciar treino longo em GPU antes de provar o loop."
    }
  },
  {
    "id": 63,
    "title": {
      "en": "Tokenization and embeddings",
      "pt": "Tokenização e embeddings"
    },
    "description": {
      "en": "Convert language into IDs and vectors while understanding vocabulary trade-offs.",
      "pt": "Converta linguagem em IDs e vetores entendendo trade-offs de vocabulário."
    },
    "icon": "🔤",
    "libraries": [],
    "track": "ai-local",
    "stage": "ai-deep",
    "estimatedHours": 8,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "tokens and embeddings",
      "pt": "tokens e embeddings"
    },
    "why": {
      "en": "Language models operate on token IDs, not words. Tokenization controls sequence length and how text fragments are represented; embeddings map IDs into learned vectors.",
      "pt": "Modelos operam em IDs de tokens, não palavras. Tokenização controla comprimento e fragmentos; embeddings mapeiam IDs em vetores."
    },
    "mentalModel": {
      "en": "A tokenizer maps text to a deterministic sequence of IDs and back. An embedding table selects one vector per ID; nearby vectors can encode related usage.",
      "pt": "Tokenizer mapeia texto para IDs determinísticos e volta. Tabela de embedding seleciona vetor por ID; vetores próximos podem codificar uso relacionado."
    },
    "workflow": {
      "en": "Normalize only what the model contract expects, reserve special tokens, version tokenizer with the model and measure unknown or fragmented tokens on target data.",
      "pt": "Normalize só o esperado pelo contrato, reserve tokens especiais, versione tokenizer com modelo e meça desconhecidos ou fragmentados."
    },
    "exampleCode": "def build_vocabulary(texts):\n    tokens = sorted({token.lower() for text in texts for token in text.split()})\n    return {\"<unk>\": 0, **{token: index + 1 for index, token in enumerate(tokens)}}\n\nprint(build_vocabulary([\"Python local\", \"IA local\"]))",
    "exampleOutput": {
      "en": "{'<unk>': 0, 'ia': 1, 'local': 2, 'python': 3}",
      "pt": "{'<unk>': 0, 'ia': 1, 'local': 2, 'python': 3}"
    },
    "professionalCode": "def encode(text, vocabulary):\n    return [vocabulary.get(token.lower(), vocabulary[\"<unk>\"]) for token in text.split()]\n\n# In real LLMs, subword tokenizers avoid treating every unseen word as unknown.",
    "commonMistake": {
      "en": "Changing tokenizer after training changes the meaning of every ID. Character counts are not token counts, so context estimates can be badly wrong.",
      "pt": "Mudar tokenizer após treino muda significado de todo ID. Caracteres não são tokens, então estimativa de contexto pode errar."
    },
    "bestPractice": {
      "en": "Package tokenizer and model together and test round trips and token counts on real domain text.",
      "pt": "Empacote tokenizer e modelo juntos e teste ida/volta e contagem em texto real."
    },
    "outcomes": {
      "en": [
        "Build deterministic vocabularies",
        "Encode unknown tokens safely",
        "Explain embedding lookup and token budgets"
      ],
      "pt": [
        "Criar vocabulários determinísticos",
        "Codificar desconhecidos com segurança",
        "Explicar embeddings e orçamento de tokens"
      ]
    },
    "practice": {
      "functionName": "build_vocabulary",
      "starterCode": "def build_vocabulary(texts):\n    \"\"\"Return <unk>:0 plus sorted unique lowercase whitespace tokens.\"\"\"\n    pass",
      "publicAfterCode": "print(build_vocabulary([\"Python local\", \"IA local\"]))",
      "publicExpected": "'local': 2",
      "hiddenAfterCode": "print(build_vocabulary([]))",
      "hiddenExpected": "{'<unk>': 0}",
      "requirements": [
        {
          "kind": "function",
          "value": "build_vocabulary"
        },
        {
          "kind": "node",
          "value": "Dict"
        }
      ]
    },
    "exam": {
      "functionName": "build_vocabulary",
      "starterCode": "def build_vocabulary(texts):\n    \"\"\"Use deterministic IDs independent of input order.\"\"\"\n    pass",
      "publicAfterCode": "print(build_vocabulary([\"b a\", \"a c\"]))",
      "publicExpected": "'a': 1",
      "hiddenAfterCode": "print(build_vocabulary([\"C\", \"c\"]))",
      "hiddenExpected": "'c': 1",
      "requirements": [
        {
          "kind": "function",
          "value": "build_vocabulary"
        }
      ]
    },
    "quizPurpose": {
      "en": "Create stable numerical representations of text.",
      "pt": "Criar representações numéricas estáveis de texto."
    },
    "quizBestPractice": {
      "en": "Version tokenizer with the model and measure domain fragmentation.",
      "pt": "Versionar tokenizer com modelo e medir fragmentação."
    },
    "quizAvoid": {
      "en": "Changing vocabulary or assuming characters equal tokens.",
      "pt": "Mudar vocabulário ou assumir caracteres iguais a tokens."
    }
  },
  {
    "id": 64,
    "title": {
      "en": "Attention and transformers",
      "pt": "Attention e Transformers"
    },
    "description": {
      "en": "Understand how tokens exchange information and why context has quadratic cost.",
      "pt": "Entenda como tokens trocam informação e por que contexto tem custo quadrático."
    },
    "icon": "👁️",
    "libraries": [],
    "track": "ai-local",
    "stage": "ai-deep",
    "estimatedHours": 12,
    "desktopRequired": false,
    "labPath": "/ai-lab",
    "concept": {
      "en": "self-attention and transformers",
      "pt": "self-attention e Transformers"
    },
    "why": {
      "en": "Attention lets each token compute a weighted combination of other token representations. Transformers stack attention and feed-forward blocks with residual connections.",
      "pt": "Attention permite que cada token combine representações de outros tokens com pesos. Transformers empilham attention e feed-forward com residuais."
    },
    "mentalModel": {
      "en": "Queries ask what a token seeks, keys describe what each token offers and values contain information to combine. Dot products become scores, softmax becomes weights.",
      "pt": "Queries expressam o que token busca, keys o que oferece e values a informação. Produtos escalares viram scores e softmax vira peso."
    },
    "workflow": {
      "en": "Implement one tiny attention head, inspect weights, apply masking correctly and estimate memory cost before increasing context length.",
      "pt": "Implemente uma cabeça pequena, inspecione pesos, aplique máscara e estime memória antes de aumentar contexto."
    },
    "exampleCode": "import math\n\ndef softmax(values):\n    maximum = max(values)\n    exps = [math.exp(value - maximum) for value in values]\n    total = sum(exps)\n    return [value / total for value in exps]\n\nprint([round(x, 3) for x in softmax([1, 2, 3])])",
    "exampleOutput": {
      "en": "[0.09, 0.245, 0.665]",
      "pt": "[0.09, 0.245, 0.665]"
    },
    "professionalCode": "def attention_weights(query, keys):\n    scores = [sum(q * k for q, k in zip(query, key)) for key in keys]\n    return softmax(scores)\n\n# Causal language models mask future positions before softmax.",
    "commonMistake": {
      "en": "Forgetting a causal mask lets training see future tokens. Very long context increases attention memory rapidly and can reduce useful focus.",
      "pt": "Esquecer máscara causal deixa treino ver futuro. Contexto longo aumenta memória rapidamente e pode reduzir foco útil."
    },
    "bestPractice": {
      "en": "Validate masks and shapes on a three-token example and inspect attention distributions instead of treating the layer as magic.",
      "pt": "Valide máscaras e shapes em três tokens e inspecione distribuições em vez de tratar como magia."
    },
    "outcomes": {
      "en": [
        "Compute stable softmax",
        "Explain query-key-value attention",
        "Estimate context and masking costs"
      ],
      "pt": [
        "Calcular softmax estável",
        "Explicar query-key-value",
        "Estimar custos de contexto e máscara"
      ]
    },
    "practice": {
      "functionName": "softmax",
      "starterCode": "import math\n\ndef softmax(values):\n    \"\"\"Return numerically stable probabilities summing to 1.\"\"\"\n    pass",
      "publicAfterCode": "print([round(x, 3) for x in softmax([1, 2, 3])])",
      "publicExpected": "[0.09, 0.245, 0.665]",
      "hiddenAfterCode": "print([round(x, 3) for x in softmax([1000, 1000])])",
      "hiddenExpected": "[0.5, 0.5]",
      "requirements": [
        {
          "kind": "import",
          "value": "math"
        },
        {
          "kind": "function",
          "value": "softmax"
        }
      ]
    },
    "exam": {
      "functionName": "softmax",
      "starterCode": "import math\n\ndef softmax(values):\n    \"\"\"Reject an empty sequence and remain stable for large scores.\"\"\"\n    pass",
      "publicAfterCode": "print(round(sum(softmax([-1, 0, 1])), 6))",
      "publicExpected": "1.0",
      "hiddenAfterCode": "try:\n    softmax([])\nexcept ValueError:\n    print(\"empty-scores\")",
      "hiddenExpected": "empty-scores",
      "requirements": [
        {
          "kind": "import",
          "value": "math"
        },
        {
          "kind": "function",
          "value": "softmax"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Compute contextual token mixtures through normalized similarity.",
      "pt": "Calcular misturas contextuais por similaridade normalizada."
    },
    "quizBestPractice": {
      "en": "Validate masks, shapes and context cost on tiny examples.",
      "pt": "Validar máscaras, shapes e custo em exemplos pequenos."
    },
    "quizAvoid": {
      "en": "Training without causal masking or ignoring context memory growth.",
      "pt": "Treinar sem máscara causal ou ignorar crescimento de memória."
    }
  },
  {
    "id": 65,
    "title": {
      "en": "Local models, GGUF and quantization",
      "pt": "Modelos locais, GGUF e quantização"
    },
    "description": {
      "en": "Choose a model that fits the computer and understand the quality-memory trade-off.",
      "pt": "Escolha modelo compatível com o computador e entenda trade-off qualidade-memória."
    },
    "icon": "💾",
    "libraries": [
      "llama.cpp",
      "GGUF"
    ],
    "track": "ai-local",
    "stage": "ai-local",
    "estimatedHours": 10,
    "desktopRequired": true,
    "labPath": "/ai-lab",
    "concept": {
      "en": "local model formats and quantization",
      "pt": "formatos locais e quantização"
    },
    "why": {
      "en": "Running locally protects data and removes per-request API dependence, but the model must fit RAM or VRAM and its license must allow the intended use.",
      "pt": "Rodar local protege dados e remove dependência de API por requisição, mas modelo precisa caber em RAM/VRAM e licença permitir uso."
    },
    "mentalModel": {
      "en": "Model parameters consume memory. Quantization stores each weight with fewer bits. GGUF packages quantized weights and metadata for efficient local runtimes such as llama.cpp.",
      "pt": "Parâmetros consomem memória. Quantização usa menos bits por peso. GGUF empacota pesos e metadados para runtimes como llama.cpp."
    },
    "workflow": {
      "en": "Check license, parameter count, quantization, context memory and measured tokens per second. Keep enough free memory for the OS and application.",
      "pt": "Verifique licença, parâmetros, quantização, memória de contexto e tokens por segundo. Deixe memória livre para sistema e app."
    },
    "exampleCode": "def estimated_weight_gb(parameters_billions, bits_per_weight):\n    return round(parameters_billions * bits_per_weight / 8, 2)\n\nprint(estimated_weight_gb(7, 4))",
    "exampleOutput": {
      "en": "3.5",
      "pt": "3.5"
    },
    "professionalCode": "def recommend_model(ram_gb, vram_gb=0):\n    available = max(vram_gb, ram_gb * 0.65)\n    if available >= 20:\n        return \"up to 30B at 4-bit, benchmark first\"\n    if available >= 8:\n        return \"7B–13B at 4-bit\"\n    if available >= 4:\n        return \"1B–7B at 4-bit\"\n    return \"sub-1B model or upgrade memory\"",
    "commonMistake": {
      "en": "Comparing only parameter count ignores quantization, context cache and runtime overhead. Downloading a model without checking its license can block distribution.",
      "pt": "Comparar só parâmetros ignora quantização, cache de contexto e overhead. Baixar sem verificar licença pode impedir distribuição."
    },
    "bestPractice": {
      "en": "Benchmark the exact model, quantization, context and runtime on the target machine before designing the product around it.",
      "pt": "Faça benchmark do modelo, quantização, contexto e runtime exatos na máquina alvo antes de projetar produto."
    },
    "outcomes": {
      "en": [
        "Estimate weight memory",
        "Compare quantization levels",
        "Select models by hardware, license and measured speed"
      ],
      "pt": [
        "Estimar memória dos pesos",
        "Comparar quantizações",
        "Selecionar por hardware, licença e velocidade"
      ]
    },
    "practice": {
      "functionName": "estimated_weight_gb",
      "starterCode": "def estimated_weight_gb(parameters_billions, bits_per_weight):\n    \"\"\"Estimate raw weight storage in decimal GB.\"\"\"\n    pass",
      "publicAfterCode": "print(estimated_weight_gb(7, 4))",
      "publicExpected": "3.5",
      "hiddenAfterCode": "print(estimated_weight_gb(3, 8))",
      "hiddenExpected": "3.0",
      "requirements": [
        {
          "kind": "function",
          "value": "estimated_weight_gb"
        }
      ]
    },
    "exam": {
      "functionName": "estimated_weight_gb",
      "starterCode": "def estimated_weight_gb(parameters_billions, bits_per_weight):\n    \"\"\"Reject non-positive model sizes or bit widths and round to 2 decimals.\"\"\"\n    pass",
      "publicAfterCode": "print(estimated_weight_gb(13, 4))",
      "publicExpected": "6.5",
      "hiddenAfterCode": "try:\n    estimated_weight_gb(0, 4)\nexcept ValueError:\n    print(\"invalid-model\")",
      "hiddenExpected": "invalid-model",
      "requirements": [
        {
          "kind": "function",
          "value": "estimated_weight_gb"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Fit licensed model weights and runtime overhead to real hardware.",
      "pt": "Ajustar pesos licenciados e overhead ao hardware real."
    },
    "quizBestPractice": {
      "en": "Benchmark exact artifacts and retain operating-system headroom.",
      "pt": "Testar artefatos exatos e preservar memória do sistema."
    },
    "quizAvoid": {
      "en": "Choosing from parameter count alone or ignoring the license.",
      "pt": "Escolher só por parâmetros ou ignorar licença."
    }
  },
  {
    "id": 66,
    "title": {
      "en": "Local inference and tool boundaries",
      "pt": "Inferência local e fronteiras de ferramentas"
    },
    "description": {
      "en": "Run models through a local process and connect tools without giving the model unrestricted authority.",
      "pt": "Execute modelos em processo local e conecte ferramentas sem dar autoridade irrestrita."
    },
    "icon": "🖥️",
    "libraries": [
      "llama.cpp",
      "Ollama"
    ],
    "track": "ai-local",
    "stage": "ai-local",
    "estimatedHours": 12,
    "desktopRequired": true,
    "labPath": "/ai-lab",
    "concept": {
      "en": "local inference runtimes",
      "pt": "runtimes de inferência local"
    },
    "why": {
      "en": "A local runtime can expose an HTTP interface on the same machine without sending data to an external AI provider. Tools still need validation and explicit permission.",
      "pt": "Runtime local pode expor HTTP na mesma máquina sem enviar dados a provedor externo. Ferramentas ainda exigem validação e permissão."
    },
    "mentalModel": {
      "en": "The application sends messages to a local model server. The model proposes text or a structured tool call; deterministic code validates and executes only allowed actions.",
      "pt": "Aplicação envia mensagens ao servidor local. Modelo propõe texto ou chamada estruturada; código determinístico valida e executa ações permitidas."
    },
    "workflow": {
      "en": "Bind to localhost by default, pin the model artifact, constrain structured output, allowlist tools and require confirmation for destructive or external actions.",
      "pt": "Use localhost por padrão, fixe artefato, restrinja saída estruturada, permita ferramentas específicas e confirme ações destrutivas."
    },
    "exampleCode": "def local_runtime_command(model_path, context_size=4096):\n    return [\"llama-server\", \"-m\", model_path, \"-c\", str(context_size), \"--host\", \"127.0.0.1\"]\n\nprint(local_runtime_command(\"models/assistant.gguf\", 8192))",
    "exampleOutput": {
      "en": "['llama-server', '-m', 'models/assistant.gguf', '-c', '8192', '--host', '127.0.0.1']",
      "pt": "['llama-server', '-m', 'models/assistant.gguf', '-c', '8192', '--host', '127.0.0.1']"
    },
    "professionalCode": "# The model never executes arbitrary Python directly.\n# It can request: {\"tool\": \"search_documents\", \"arguments\": {\"query\": \"...\"}}\n# Application code validates tool name, argument schema, user permission and audit logging.",
    "commonMistake": {
      "en": "Binding a local model server to all network interfaces can expose private prompts. Executing model-generated shell code turns text prediction into arbitrary code execution.",
      "pt": "Expor servidor em todas interfaces pode revelar prompts privados. Executar shell gerado transforma previsão em execução arbitrária."
    },
    "bestPractice": {
      "en": "Treat model output as untrusted input and keep tool authority narrower than the user account.",
      "pt": "Trate saída do modelo como entrada não confiável e dê ferramentas com autoridade menor que a conta do usuário."
    },
    "outcomes": {
      "en": [
        "Launch a localhost model runtime",
        "Design structured tool calls",
        "Apply allowlists and confirmation boundaries"
      ],
      "pt": [
        "Iniciar runtime em localhost",
        "Projetar chamadas estruturadas",
        "Aplicar allowlists e confirmação"
      ]
    },
    "practice": {
      "functionName": "local_runtime_command",
      "starterCode": "def local_runtime_command(model_path, context_size=4096):\n    \"\"\"Return a safe llama-server command bound to localhost.\"\"\"\n    pass",
      "publicAfterCode": "print(local_runtime_command(\"models/a.gguf\", 8192))",
      "publicExpected": "127.0.0.1",
      "hiddenAfterCode": "print(local_runtime_command(\"model.gguf\"))",
      "hiddenExpected": "4096",
      "requirements": [
        {
          "kind": "function",
          "value": "local_runtime_command"
        },
        {
          "kind": "node",
          "value": "List"
        }
      ]
    },
    "exam": {
      "functionName": "local_runtime_command",
      "starterCode": "def local_runtime_command(model_path, context_size=4096):\n    \"\"\"Reject empty paths and non-positive context sizes.\"\"\"\n    pass",
      "publicAfterCode": "print(local_runtime_command(\"m.gguf\", 2048))",
      "publicExpected": "llama-server",
      "hiddenAfterCode": "try:\n    local_runtime_command(\"\", 0)\nexcept ValueError:\n    print(\"invalid-runtime\")",
      "hiddenExpected": "invalid-runtime",
      "requirements": [
        {
          "kind": "function",
          "value": "local_runtime_command"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Run a model locally while keeping deterministic control of tools.",
      "pt": "Executar modelo local mantendo controle determinístico de ferramentas."
    },
    "quizBestPractice": {
      "en": "Bind locally, validate outputs and require confirmation for authority.",
      "pt": "Vincular localmente, validar saídas e confirmar ações com autoridade."
    },
    "quizAvoid": {
      "en": "Executing arbitrary model-generated code or exposing the server publicly.",
      "pt": "Executar código arbitrário do modelo ou expor servidor publicamente."
    }
  },
  {
    "id": 67,
    "title": {
      "en": "Local embeddings, retrieval and RAG",
      "pt": "Embeddings locais, recuperação e RAG"
    },
    "description": {
      "en": "Ground answers in local documents and return traceable sources.",
      "pt": "Fundamente respostas em documentos locais e devolva fontes rastreáveis."
    },
    "icon": "📚",
    "libraries": [
      "sentence-transformers",
      "FAISS"
    ],
    "track": "ai-local",
    "stage": "ai-local",
    "estimatedHours": 14,
    "desktopRequired": true,
    "labPath": "/ai-lab",
    "concept": {
      "en": "retrieval-augmented generation",
      "pt": "geração aumentada por recuperação"
    },
    "why": {
      "en": "RAG retrieves relevant passages and gives them to the model, allowing private or current knowledge without retraining the language model.",
      "pt": "RAG recupera trechos relevantes e entrega ao modelo, usando conhecimento privado ou atual sem retreinar o modelo."
    },
    "mentalModel": {
      "en": "Documents are parsed, chunked, embedded and indexed. A query embedding retrieves candidates; the prompt includes only relevant passages and source metadata.",
      "pt": "Documentos são lidos, divididos, embedados e indexados. Embedding da consulta recupera candidatos; prompt inclui trechos e fontes."
    },
    "workflow": {
      "en": "Evaluate parsing, chunk boundaries, retrieval recall and citation faithfulness separately. Refuse or state uncertainty when evidence is insufficient.",
      "pt": "Avalie parsing, chunks, recall da busca e fidelidade das citações separadamente. Recuse ou declare incerteza sem evidência."
    },
    "exampleCode": "def chunk_words(text, size, overlap=0):\n    words = text.split()\n    step = size - overlap\n    return [\" \".join(words[index:index + size]) for index in range(0, len(words), step)]\n\nprint(chunk_words(\"a b c d e\", 3, 1))",
    "exampleOutput": {
      "en": "['a b c', 'c d e', 'e']",
      "pt": "['a b c', 'c d e', 'e']"
    },
    "professionalCode": "def lexical_retrieve(query, chunks, limit=2):\n    terms = set(query.lower().split())\n    scored = []\n    for index, chunk in enumerate(chunks):\n        score = len(terms & set(chunk.lower().split()))\n        scored.append((score, index, chunk))\n    return [chunk for score, _, chunk in sorted(scored, reverse=True) if score > 0][:limit]",
    "commonMistake": {
      "en": "Large arbitrary chunks dilute relevant facts; tiny chunks lose context. Giving the model retrieved text without source IDs makes citations impossible to verify.",
      "pt": "Chunks grandes diluem fatos; pequenos perdem contexto. Entregar texto sem IDs torna citações impossíveis de verificar."
    },
    "bestPractice": {
      "en": "Test retrieval with known questions before judging generation, and preserve document, page and chunk identifiers through the pipeline.",
      "pt": "Teste recuperação com perguntas conhecidas antes da geração e preserve IDs de documento, página e chunk."
    },
    "outcomes": {
      "en": [
        "Chunk documents with overlap deliberately",
        "Retrieve and rank local evidence",
        "Generate answers with verifiable citations"
      ],
      "pt": [
        "Dividir documentos com overlap deliberado",
        "Recuperar e ranquear evidência local",
        "Gerar respostas com citações verificáveis"
      ]
    },
    "practice": {
      "functionName": "chunk_words",
      "starterCode": "def chunk_words(text, size, overlap=0):\n    \"\"\"Return word chunks; require size>0 and 0<=overlap<size.\"\"\"\n    pass",
      "publicAfterCode": "print(chunk_words(\"a b c d e\", 3, 1))",
      "publicExpected": "['a b c', 'c d e', 'e']",
      "hiddenAfterCode": "print(chunk_words(\"one two\", 5, 0))",
      "hiddenExpected": "['one two']",
      "requirements": [
        {
          "kind": "function",
          "value": "chunk_words"
        }
      ]
    },
    "exam": {
      "functionName": "chunk_words",
      "starterCode": "def chunk_words(text, size, overlap=0):\n    \"\"\"Preserve word order and validate progress-producing overlap.\"\"\"\n    pass",
      "publicAfterCode": "print(chunk_words(\"1 2 3 4\", 2, 0))",
      "publicExpected": "['1 2', '3 4']",
      "hiddenAfterCode": "try:\n    chunk_words(\"x\", 2, 2)\nexcept ValueError:\n    print(\"invalid-overlap\")",
      "hiddenExpected": "invalid-overlap",
      "requirements": [
        {
          "kind": "function",
          "value": "chunk_words"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Ground model output in indexed local evidence and citations.",
      "pt": "Fundamentar saída do modelo em evidência local indexada e citações."
    },
    "quizBestPractice": {
      "en": "Evaluate retrieval first and preserve source metadata end to end.",
      "pt": "Avaliar recuperação primeiro e preservar metadados de fonte."
    },
    "quizAvoid": {
      "en": "Judging only fluent answers without checking retrieved evidence.",
      "pt": "Julgar só fluência sem verificar evidência recuperada."
    }
  },
  {
    "id": 68,
    "title": {
      "en": "Local AI capstone: private document copilot",
      "pt": "Capstone de IA local: copiloto privado de documentos"
    },
    "description": {
      "en": "Integrate a local model, retrieval, evaluation and safety into an offline-capable product.",
      "pt": "Integre modelo local, recuperação, avaliação e segurança em produto capaz de funcionar offline."
    },
    "icon": "🏆",
    "libraries": [
      "llama.cpp",
      "sentence-transformers",
      "FAISS",
      "LoRA"
    ],
    "track": "ai-local",
    "stage": "ai-local",
    "estimatedHours": 24,
    "desktopRequired": true,
    "labPath": "/ai-lab",
    "concept": {
      "en": "end-to-end local AI engineering",
      "pt": "engenharia de IA local ponta a ponta"
    },
    "why": {
      "en": "The capstone proves that Python, data, ML and local model engineering work together. Success is measured by grounded usefulness, privacy and repeatability, not chatbot appearance.",
      "pt": "O capstone comprova Python, dados, ML e modelo local juntos. Sucesso é utilidade fundamentada, privacidade e repetibilidade, não aparência de chatbot."
    },
    "mentalModel": {
      "en": "The product has deterministic ingestion, versioned index, local inference, cited answers, evaluation cases, audit events and explicit boundaries for tools and personal data.",
      "pt": "Produto tem ingestão determinística, índice versionado, inferência local, respostas citadas, casos de avaliação, auditoria e fronteiras de ferramentas e dados."
    },
    "workflow": {
      "en": "Build a baseline without fine-tuning, create a fixed evaluation set, improve retrieval, then consider LoRA only for a measured behavioral gap that prompting and RAG cannot solve.",
      "pt": "Construa baseline sem fine-tuning, crie avaliação fixa, melhore retrieval e considere LoRA só para lacuna medida não resolvida por prompt e RAG."
    },
    "exampleCode": "def answer_with_sources(question, passages):\n    terms = set(question.lower().split())\n    ranked = sorted(passages, key=lambda p: len(terms & set(p[\"text\"].lower().split())), reverse=True)\n    evidence = [item for item in ranked if terms & set(item[\"text\"].lower().split())][:2]\n    if not evidence:\n        return {\"answer\": \"insufficient evidence\", \"sources\": []}\n    return {\"answer\": \" | \".join(item[\"text\"] for item in evidence), \"sources\": [item[\"source\"] for item in evidence]}\n\nprint(answer_with_sources(\"policy limit\", [{\"text\": \"policy limit is 5000\", \"source\": \"p1\"}]))",
    "exampleOutput": {
      "en": "{'answer': 'policy limit is 5000', 'sources': ['p1']}",
      "pt": "{'answer': 'policy limit is 5000', 'sources': ['p1']}"
    },
    "professionalCode": "# Capstone acceptance evidence:\n# 1. Works after model and index are downloaded, with network disconnected.\n# 2. Every factual answer carries source IDs.\n# 3. Insufficient evidence produces uncertainty, not invention.\n# 4. Evaluation dataset tracks retrieval recall and answer faithfulness.\n# 5. Tool calls are allowlisted and destructive actions require confirmation.\n# 6. LoRA adapter, if used, is versioned separately from the base model.",
    "commonMistake": {
      "en": "Fine-tuning before establishing a baseline can memorize private data and make failures harder to attribute. A polished UI cannot compensate for weak citations or unsafe tools.",
      "pt": "Fine-tuning antes do baseline pode memorizar dados privados e dificultar diagnóstico. UI bonita não compensa citações fracas ou ferramentas inseguras."
    },
    "bestPractice": {
      "en": "Ship only after offline, privacy, citation, failure and regression tests pass on the exact target hardware.",
      "pt": "Publique apenas após testes offline, privacidade, citações, falhas e regressão passarem no hardware alvo."
    },
    "outcomes": {
      "en": [
        "Design a private offline architecture",
        "Evaluate retrieval and answer faithfulness",
        "Decide responsibly whether LoRA is justified"
      ],
      "pt": [
        "Projetar arquitetura privada offline",
        "Avaliar recuperação e fidelidade",
        "Decidir responsavelmente se LoRA é necessário"
      ]
    },
    "practice": {
      "functionName": "answer_with_sources",
      "starterCode": "def answer_with_sources(question, passages):\n    \"\"\"Return up to two overlapping passages and their source IDs, or insufficient evidence.\"\"\"\n    pass",
      "publicAfterCode": "print(answer_with_sources(\"policy limit\", [{\"text\": \"policy limit is 5000\", \"source\": \"p1\"}]))",
      "publicExpected": "'sources': ['p1']",
      "hiddenAfterCode": "print(answer_with_sources(\"unrelated\", [{\"text\": \"policy limit\", \"source\": \"p1\"}]))",
      "hiddenExpected": "'sources': []",
      "requirements": [
        {
          "kind": "function",
          "value": "answer_with_sources"
        }
      ]
    },
    "exam": {
      "functionName": "answer_with_sources",
      "starterCode": "def answer_with_sources(question, passages):\n    \"\"\"Rank by token overlap, preserve source IDs and refuse without evidence.\"\"\"\n    pass",
      "publicAfterCode": "items=[{\"text\":\"claim status open\", \"source\":\"a\"},{\"text\":\"claim amount 50\", \"source\":\"b\"}]\nprint(answer_with_sources(\"claim amount\", items))",
      "publicExpected": "'b'",
      "hiddenAfterCode": "print(answer_with_sources(\"missing fact\", []))",
      "hiddenExpected": "insufficient evidence",
      "requirements": [
        {
          "kind": "function",
          "value": "answer_with_sources"
        },
        {
          "kind": "node",
          "value": "If"
        }
      ]
    },
    "quizPurpose": {
      "en": "Integrate local inference, evidence, evaluation and safety into one product.",
      "pt": "Integrar inferência local, evidência, avaliação e segurança em um produto."
    },
    "quizBestPractice": {
      "en": "Prove offline privacy and grounded behavior before considering fine-tuning.",
      "pt": "Comprovar privacidade offline e respostas fundamentadas antes de fine-tuning."
    },
    "quizAvoid": {
      "en": "Fine-tuning or polishing UI before measuring retrieval and safety.",
      "pt": "Fazer fine-tuning ou polir UI antes de medir retrieval e segurança."
    }
  }
]

export const AI_LOCAL_PHASES = createConceptPhases(specs)

export const phase54 = AI_LOCAL_PHASES[0]
export const phase55 = AI_LOCAL_PHASES[1]
export const phase56 = AI_LOCAL_PHASES[2]
export const phase57 = AI_LOCAL_PHASES[3]
export const phase58 = AI_LOCAL_PHASES[4]
export const phase59 = AI_LOCAL_PHASES[5]
export const phase60 = AI_LOCAL_PHASES[6]
export const phase61 = AI_LOCAL_PHASES[7]
export const phase62 = AI_LOCAL_PHASES[8]
export const phase63 = AI_LOCAL_PHASES[9]
export const phase64 = AI_LOCAL_PHASES[10]
export const phase65 = AI_LOCAL_PHASES[11]
export const phase66 = AI_LOCAL_PHASES[12]
export const phase67 = AI_LOCAL_PHASES[13]
export const phase68 = AI_LOCAL_PHASES[14]
