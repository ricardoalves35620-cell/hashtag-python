import { createConceptPhases, type ConceptPhaseSpec } from './phaseFactory'

const specs: ConceptPhaseSpec[] = [
  {
    "id": 40,
    "title": {
      "en": "Iteration protocol",
      "pt": "Protocolo de iteração"
    },
    "description": {
      "en": "Understand how for loops consume iterable objects and build custom iteration behavior.",
      "pt": "Entenda como loops for consomem objetos iteráveis e crie comportamento de iteração."
    },
    "icon": "🔁",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "the iteration protocol",
      "pt": "o protocolo de iteração"
    },
    "why": {
      "en": "Iteration is a protocol, not a special property of lists. Understanding iter and next lets you stream, compose and build domain-specific collections.",
      "pt": "Iteração é protocolo, não propriedade especial de listas. Entender iter e next permite streaming, composição e coleções de domínio."
    },
    "mentalModel": {
      "en": "An iterable can create an iterator. An iterator remembers position and raises StopIteration when exhausted. A for loop performs this protocol for you.",
      "pt": "Um iterável cria um iterador. O iterador lembra a posição e levanta StopIteration ao acabar. O for executa esse protocolo."
    },
    "workflow": {
      "en": "Start with built-in iteration, write a custom iterator only when stateful traversal is part of the domain, and ensure exhaustion is predictable.",
      "pt": "Comece com iteração nativa, crie iterador customizado só quando travessia com estado fizer parte do domínio e garanta término previsível."
    },
    "exampleCode": "values = iter([10, 20, 30])\nprint(next(values))\nprint(next(values))\nprint(list(values))",
    "exampleOutput": {
      "en": "10\n20\n[30]",
      "pt": "10\n20\n[30]"
    },
    "professionalCode": "def take(iterable, count):\n    iterator = iter(iterable)\n    result = []\n    for _ in range(count):\n        try:\n            result.append(next(iterator))\n        except StopIteration:\n            break\n    return result",
    "commonMistake": {
      "en": "Reusing an exhausted iterator returns no items, while recreating an iterable may start again. Confusing the two causes silent empty results.",
      "pt": "Reutilizar iterador esgotado não retorna itens, enquanto recriar iterável pode reiniciar. Confundir causa resultados vazios silenciosos."
    },
    "bestPractice": {
      "en": "Document whether an API accepts an iterable once or stores data for repeated traversal.",
      "pt": "Documente se a API aceita iterável de uso único ou armazena dados para múltiplas travessias."
    },
    "outcomes": {
      "en": [
        "Explain iterable versus iterator",
        "Use iter and next safely",
        "Build bounded traversal without materializing everything"
      ],
      "pt": [
        "Explicar iterável versus iterador",
        "Usar iter e next com segurança",
        "Criar travessia limitada sem materializar tudo"
      ]
    },
    "practice": {
      "functionName": "take",
      "starterCode": "def take(iterable, count):\n    \"\"\"Return at most count items from any iterable.\"\"\"\n    pass",
      "publicAfterCode": "print(take(iter([1, 2, 3]), 2))",
      "publicExpected": "[1, 2]",
      "hiddenAfterCode": "print(take((x for x in range(3)), 10))",
      "hiddenExpected": "[0, 1, 2]",
      "requirements": [
        {
          "kind": "function",
          "value": "take"
        },
        {
          "kind": "call",
          "value": "iter"
        },
        {
          "kind": "call",
          "value": "next"
        }
      ]
    },
    "exam": {
      "functionName": "take",
      "starterCode": "def take(iterable, count):\n    \"\"\"Return no items for non-positive count and never over-consume.\"\"\"\n    pass",
      "publicAfterCode": "print(take([4, 5, 6], 1))",
      "publicExpected": "[4]",
      "hiddenAfterCode": "print(take([1, 2], 0))",
      "hiddenExpected": "[]",
      "requirements": [
        {
          "kind": "function",
          "value": "take"
        },
        {
          "kind": "call",
          "value": "iter"
        }
      ]
    },
    "quizPurpose": {
      "en": "Expose a common traversal protocol across many data sources.",
      "pt": "Expor um protocolo comum de travessia para várias fontes."
    },
    "quizBestPractice": {
      "en": "Treat exhaustion and single-use iterators explicitly.",
      "pt": "Tratar esgotamento e iteradores de uso único explicitamente."
    },
    "quizAvoid": {
      "en": "Assuming every iterable can be restarted or indexed.",
      "pt": "Assumir que todo iterável pode reiniciar ou ser indexado."
    }
  },
  {
    "id": 41,
    "title": {
      "en": "Generators and lazy pipelines",
      "pt": "Generators e pipelines lazy"
    },
    "description": {
      "en": "Process large or unbounded data incrementally with yield.",
      "pt": "Processe dados grandes ou ilimitados incrementalmente com yield."
    },
    "icon": "🌊",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "generators and laziness",
      "pt": "generators e avaliação lazy"
    },
    "why": {
      "en": "Generators separate production from consumption and avoid storing an entire dataset when one item at a time is enough.",
      "pt": "Generators separam produção de consumo e evitam armazenar dataset inteiro quando um item por vez basta."
    },
    "mentalModel": {
      "en": "A generator pauses at yield, preserves local state and resumes when next value is requested. Nothing runs until it is consumed.",
      "pt": "Generator pausa em yield, preserva estado local e continua quando o próximo valor é pedido. Nada roda até ser consumido."
    },
    "workflow": {
      "en": "Compose small generators, keep side effects at the edges and measure memory before replacing clear lists with lazy pipelines.",
      "pt": "Componha generators pequenos, mantenha efeitos nas bordas e meça memória antes de substituir listas claras por pipelines lazy."
    },
    "exampleCode": "def even_numbers(limit):\n    for value in range(limit):\n        if value % 2 == 0:\n            yield value\n\nprint(list(even_numbers(7)))",
    "exampleOutput": {
      "en": "[0, 2, 4, 6]",
      "pt": "[0, 2, 4, 6]"
    },
    "professionalCode": "def batched(items, size):\n    if size <= 0:\n        raise ValueError(\"size\")\n    batch = []\n    for item in items:\n        batch.append(item)\n        if len(batch) == size:\n            yield batch\n            batch = []\n    if batch:\n        yield batch",
    "commonMistake": {
      "en": "A generator can be consumed only once. Hiding network or file side effects inside a lazy pipeline can delay failures far from the call site.",
      "pt": "Generator só pode ser consumido uma vez. Esconder rede ou arquivo em pipeline lazy pode atrasar falhas para longe da chamada."
    },
    "bestPractice": {
      "en": "Keep generator contracts explicit: order, termination, side effects and whether partial consumption is safe.",
      "pt": "Mantenha contrato explícito: ordem, término, efeitos e segurança de consumo parcial."
    },
    "outcomes": {
      "en": [
        "Write generators with yield",
        "Compose streaming transformations",
        "Reason about one-pass consumption"
      ],
      "pt": [
        "Escrever generators com yield",
        "Compor transformações em streaming",
        "Raciocinar sobre consumo de uma passagem"
      ]
    },
    "practice": {
      "functionName": "batched",
      "starterCode": "def batched(items, size):\n    \"\"\"Yield lists of at most size items.\"\"\"\n    pass",
      "publicAfterCode": "print(list(batched([1, 2, 3, 4, 5], 2)))",
      "publicExpected": "[[1, 2], [3, 4], [5]]",
      "hiddenAfterCode": "print(list(batched([], 3)))",
      "hiddenExpected": "[]",
      "requirements": [
        {
          "kind": "function",
          "value": "batched"
        },
        {
          "kind": "node",
          "value": "Yield"
        }
      ]
    },
    "exam": {
      "functionName": "batched",
      "starterCode": "def batched(items, size):\n    \"\"\"Raise ValueError for non-positive size and yield final partial batch.\"\"\"\n    pass",
      "publicAfterCode": "print(list(batched(range(4), 3)))",
      "publicExpected": "[[0, 1, 2], [3]]",
      "hiddenAfterCode": "try:\n    list(batched([1], 0))\nexcept ValueError:\n    print(\"invalid-size\")",
      "hiddenExpected": "invalid-size",
      "requirements": [
        {
          "kind": "function",
          "value": "batched"
        },
        {
          "kind": "node",
          "value": "Yield"
        }
      ]
    },
    "quizPurpose": {
      "en": "Produce values incrementally without materializing the whole source.",
      "pt": "Produzir valores incrementalmente sem materializar toda a fonte."
    },
    "quizBestPractice": {
      "en": "Use lazy evaluation where memory or unbounded input requires it.",
      "pt": "Usar avaliação lazy quando memória ou entrada ilimitada exige."
    },
    "quizAvoid": {
      "en": "Consuming the same generator twice and expecting repeated data.",
      "pt": "Consumir o mesmo generator duas vezes esperando repetir dados."
    }
  },
  {
    "id": 42,
    "title": {
      "en": "Closures and decorators",
      "pt": "Closures e decorators"
    },
    "description": {
      "en": "Wrap behavior while preserving a small explicit contract.",
      "pt": "Envolva comportamento preservando contrato pequeno e explícito."
    },
    "icon": "🎁",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "closures and decorators",
      "pt": "closures e decorators"
    },
    "why": {
      "en": "Closures retain configuration without global state. Decorators apply cross-cutting behavior consistently to functions or classes.",
      "pt": "Closures retêm configuração sem estado global. Decorators aplicam comportamento transversal consistentemente."
    },
    "mentalModel": {
      "en": "A closure is a function carrying remembered values. A decorator accepts a callable and returns a callable with compatible behavior.",
      "pt": "Closure é função carregando valores lembrados. Decorator recebe callable e devolve callable compatível."
    },
    "workflow": {
      "en": "Use wrappers for logging, authorization or retries only when the behavior is truly reusable; preserve metadata and avoid surprising argument changes.",
      "pt": "Use wrappers para logging, autorização ou retry só quando comportamento for reutilizável; preserve metadados e evite mudar argumentos."
    },
    "exampleCode": "def make_multiplier(factor):\n    def multiply(value):\n        return value * factor\n    return multiply\n\ndouble = make_multiplier(2)\nprint(double(7))",
    "exampleOutput": {
      "en": "14",
      "pt": "14"
    },
    "professionalCode": "from functools import wraps\n\ndef require_positive(function):\n    @wraps(function)\n    def wrapper(value):\n        if value <= 0:\n            raise ValueError(\"positive value required\")\n        return function(value)\n    return wrapper",
    "commonMistake": {
      "en": "Decorators that swallow exceptions, change return types or hide expensive behavior make the decorated function dishonest.",
      "pt": "Decorators que engolem exceções, mudam retorno ou escondem custo tornam a função desonesta."
    },
    "bestPractice": {
      "en": "Preserve metadata with functools.wraps and keep wrapper behavior observable and documented.",
      "pt": "Preserve metadados com functools.wraps e mantenha comportamento observável e documentado."
    },
    "outcomes": {
      "en": [
        "Create closures with isolated configuration",
        "Implement transparent decorators",
        "Recognize when explicit composition is clearer"
      ],
      "pt": [
        "Criar closures com configuração isolada",
        "Implementar decorators transparentes",
        "Reconhecer quando composição explícita é mais clara"
      ]
    },
    "practice": {
      "functionName": "make_multiplier",
      "starterCode": "def make_multiplier(factor):\n    \"\"\"Return a function that multiplies by factor.\"\"\"\n    pass",
      "publicAfterCode": "triple = make_multiplier(3)\nprint(triple(5))",
      "publicExpected": "15",
      "hiddenAfterCode": "zero = make_multiplier(0)\nprint(zero(99))",
      "hiddenExpected": "0",
      "requirements": [
        {
          "kind": "function",
          "value": "make_multiplier"
        },
        {
          "kind": "node",
          "value": "FunctionDef",
          "minCount": 2
        }
      ]
    },
    "exam": {
      "functionName": "make_multiplier",
      "starterCode": "def make_multiplier(factor):\n    \"\"\"Capture factor without using a global variable.\"\"\"\n    pass",
      "publicAfterCode": "half = make_multiplier(0.5)\nprint(half(8))",
      "publicExpected": "4.0",
      "hiddenAfterCode": "negative = make_multiplier(-2)\nprint(negative(3))",
      "hiddenExpected": "-6",
      "requirements": [
        {
          "kind": "function",
          "value": "make_multiplier"
        },
        {
          "kind": "node",
          "value": "FunctionDef",
          "minCount": 2
        }
      ]
    },
    "quizPurpose": {
      "en": "Add reusable behavior around callables without global state.",
      "pt": "Adicionar comportamento reutilizável em callables sem estado global."
    },
    "quizBestPractice": {
      "en": "Preserve signatures, metadata and failure semantics.",
      "pt": "Preservar assinaturas, metadados e semântica de falha."
    },
    "quizAvoid": {
      "en": "Using decorators to hide core business behavior.",
      "pt": "Usar decorators para esconder regra principal."
    }
  },
  {
    "id": 43,
    "title": {
      "en": "Context managers",
      "pt": "Context managers"
    },
    "description": {
      "en": "Guarantee acquisition and cleanup around files, locks and transactions.",
      "pt": "Garanta aquisição e limpeza em arquivos, locks e transações."
    },
    "icon": "🚪",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "context management",
      "pt": "gerenciamento de contexto"
    },
    "why": {
      "en": "Resources must be released even when code fails. Context managers make the lifecycle visible and exception-safe.",
      "pt": "Recursos devem ser liberados mesmo quando código falha. Context managers tornam ciclo visível e seguro a exceções."
    },
    "mentalModel": {
      "en": "Entering acquires or prepares; the body uses the resource; exiting always cleans up and decides whether exceptions propagate.",
      "pt": "Entrar adquire ou prepara; corpo usa recurso; sair limpa sempre e decide propagação de exceções."
    },
    "workflow": {
      "en": "Prefer with for every bounded resource, keep cleanup idempotent and suppress exceptions only when the context explicitly owns recovery.",
      "pt": "Prefira with para todo recurso limitado, mantenha limpeza idempotente e suprima exceções só quando contexto assume recuperação."
    },
    "exampleCode": "from contextlib import contextmanager\n\n@contextmanager\ndef managed_flag(events):\n    events.append(\"enter\")\n    try:\n        yield \"ready\"\n    finally:\n        events.append(\"exit\")\n\nevents = []\nwith managed_flag(events) as value:\n    print(value)\nprint(events)",
    "exampleOutput": {
      "en": "ready\n['enter', 'exit']",
      "pt": "ready\n['enter', 'exit']"
    },
    "professionalCode": "class Timer:\n    def __enter__(self):\n        self.started = True\n        return self\n    def __exit__(self, exc_type, exc, traceback):\n        self.started = False\n        return False",
    "commonMistake": {
      "en": "Returning True from __exit__ accidentally suppresses failures. Cleanup code that can fail may hide the original exception.",
      "pt": "Retornar True em __exit__ suprime falhas acidentalmente. Limpeza que falha pode esconder exceção original."
    },
    "bestPractice": {
      "en": "Propagate exceptions by default and make cleanup safe to call after partial acquisition.",
      "pt": "Propague exceções por padrão e torne limpeza segura após aquisição parcial."
    },
    "outcomes": {
      "en": [
        "Use with for resource lifecycles",
        "Build generator-based context managers",
        "Preserve original exceptions during cleanup"
      ],
      "pt": [
        "Usar with para ciclo de recursos",
        "Criar context managers com generator",
        "Preservar exceção original na limpeza"
      ]
    },
    "practice": {
      "functionName": "managed_flag",
      "starterCode": "from contextlib import contextmanager\n\n@contextmanager\ndef managed_flag(events):\n    \"\"\"Append enter before yield and exit in a finally block.\"\"\"\n    pass",
      "publicAfterCode": "events = []\nwith managed_flag(events) as value:\n    print(value)\nprint(events)",
      "publicExpected": "enter",
      "hiddenAfterCode": "events = []\ntry:\n    with managed_flag(events):\n        raise RuntimeError(\"boom\")\nexcept RuntimeError:\n    print(events)",
      "hiddenExpected": "exit",
      "requirements": [
        {
          "kind": "import",
          "value": "contextlib"
        },
        {
          "kind": "node",
          "value": "With"
        },
        {
          "kind": "node",
          "value": "Yield"
        }
      ]
    },
    "exam": {
      "functionName": "managed_flag",
      "starterCode": "from contextlib import contextmanager\n\n@contextmanager\ndef managed_flag(events):\n    \"\"\"Yield ready and always record cleanup.\"\"\"\n    pass",
      "publicAfterCode": "events=[]\nwith managed_flag(events) as value:\n    print(value, events)",
      "publicExpected": "ready",
      "hiddenAfterCode": "events=[]\nwith managed_flag(events):\n    pass\nprint(events)",
      "hiddenExpected": "['enter', 'exit']",
      "requirements": [
        {
          "kind": "import",
          "value": "contextlib"
        },
        {
          "kind": "node",
          "value": "Yield"
        }
      ]
    },
    "quizPurpose": {
      "en": "Express resource lifetime and guaranteed cleanup.",
      "pt": "Expressar vida útil do recurso e limpeza garantida."
    },
    "quizBestPractice": {
      "en": "Use finally and propagate exceptions unless recovery is intentional.",
      "pt": "Usar finally e propagar exceções salvo recuperação intencional."
    },
    "quizAvoid": {
      "en": "Suppressing errors unintentionally during cleanup.",
      "pt": "Suprimir erros sem intenção durante limpeza."
    }
  },
  {
    "id": 44,
    "title": {
      "en": "Python data model and dunder methods",
      "pt": "Modelo de dados e métodos dunder"
    },
    "description": {
      "en": "Make domain objects cooperate with Python protocols deliberately.",
      "pt": "Faça objetos de domínio cooperarem com protocolos Python deliberadamente."
    },
    "icon": "🪄",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "the Python data model",
      "pt": "o modelo de dados do Python"
    },
    "why": {
      "en": "Operators, len, iteration and repr look for specific method names on your objects. Implementing those methods makes your object work naturally with Python's built-in syntax — no special-case utility code needed.",
      "pt": "Operadores, len, iteração e repr procuram nomes de métodos específicos no seu objeto. Implementar esses métodos faz o objeto funcionar naturalmente com a sintaxe do Python — sem utilitários especiais."
    },
    "mentalModel": {
      "en": "Python syntax delegates to methods: a + b calls __add__, repr calls __repr__, equality calls __eq__. The object should keep itself in a valid, consistent state — for example, a Money object should never mix currencies when adding.",
      "pt": "Sintaxe delega a métodos: a + b chama __add__, repr chama __repr__, igualdade chama __eq__. O objeto deve se manter em um estado válido e consistente — por exemplo, um objeto Money não deve misturar moedas ao somar."
    },
    "workflow": {
      "en": "Implement only meaningful protocols, return NotImplemented for unsupported peers and keep repr unambiguous enough for debugging.",
      "pt": "Implemente apenas protocolos significativos, retorne NotImplemented para pares não suportados e mantenha repr claro."
    },
    "exampleCode": "class Money:\n    def __init__(self, amount, currency=\"CAD\"):\n        self.amount = amount\n        self.currency = currency\n    def __repr__(self):\n        return f\"Money({self.amount!r}, {self.currency!r})\"\n    def __add__(self, other):\n        if not isinstance(other, Money) or other.currency != self.currency:\n            return NotImplemented\n        return Money(self.amount + other.amount, self.currency)\n\nprint(Money(10) + Money(5))",
    "exampleOutput": {
      "en": "Money(15, 'CAD')",
      "pt": "Money(15, 'CAD')"
    },
    "professionalCode": "def combine_money(values):\n    if not values:\n        return Money(0)\n    total = values[0]\n    for value in values[1:]:\n        total = total + value\n    return total",
    "commonMistake": {
      "en": "Implementing every operator because it is possible creates misleading semantics. Raising arbitrary errors instead of returning NotImplemented breaks reflected operations.",
      "pt": "Implementar todo operador só porque é possível cria semântica enganosa. Levantar erros arbitrários em vez de NotImplemented quebra operações refletidas."
    },
    "bestPractice": {
      "en": "Add a protocol only when users can predict its meaning from the domain.",
      "pt": "Adicione protocolo apenas quando usuários puderem prever significado pelo domínio."
    },
    "outcomes": {
      "en": [
        "Connect syntax to data-model protocols",
        "Implement value equality and representation",
        "Use NotImplemented for unsupported operations"
      ],
      "pt": [
        "Conectar sintaxe a protocolos",
        "Implementar igualdade e representação",
        "Usar NotImplemented em operações incompatíveis"
      ]
    },
    "practice": {
      "functionName": "combine_money",
      "starterCode": "class Money:\n    def __init__(self, amount, currency=\"CAD\"):\n        self.amount = amount\n        self.currency = currency\n    def __repr__(self):\n        return f\"Money({self.amount!r}, {self.currency!r})\"\n    def __add__(self, other):\n        if not isinstance(other, Money) or other.currency != self.currency:\n            return NotImplemented\n        return Money(self.amount + other.amount, self.currency)\n\ndef combine_money(values):\n    pass",
      "publicAfterCode": "print(combine_money([Money(10), Money(5)]))",
      "publicExpected": "Money(15, 'CAD')",
      "hiddenAfterCode": "print(combine_money([]))",
      "hiddenExpected": "Money(0, 'CAD')",
      "requirements": [
        {
          "kind": "node",
          "value": "ClassDef"
        },
        {
          "kind": "function",
          "value": "combine_money"
        },
        {
          "kind": "function",
          "value": "__add__"
        }
      ]
    },
    "exam": {
      "functionName": "combine_money",
      "starterCode": "class Money:\n    def __init__(self, amount, currency=\"CAD\"):\n        self.amount = amount\n        self.currency = currency\n    def __repr__(self):\n        return f\"Money({self.amount!r}, {self.currency!r})\"\n    def __add__(self, other):\n        if not isinstance(other, Money) or other.currency != self.currency:\n            return NotImplemented\n        return Money(self.amount + other.amount, self.currency)\n\ndef combine_money(values):\n    pass",
      "publicAfterCode": "print(combine_money([Money(2, \"USD\"), Money(3, \"USD\")]))",
      "publicExpected": "Money(5, 'USD')",
      "hiddenAfterCode": "try:\n    print(Money(1, \"CAD\") + Money(1, \"USD\"))\nexcept TypeError:\n    print(\"currency-mismatch\")",
      "hiddenExpected": "currency-mismatch",
      "requirements": [
        {
          "kind": "node",
          "value": "ClassDef"
        },
        {
          "kind": "function",
          "value": "__add__"
        }
      ]
    },
    "quizPurpose": {
      "en": "Integrate domain objects with predictable Python protocols.",
      "pt": "Integrar objetos de domínio com protocolos previsíveis."
    },
    "quizBestPractice": {
      "en": "Implement only semantics that are natural and invariant-safe.",
      "pt": "Implementar apenas semântica natural e segura."
    },
    "quizAvoid": {
      "en": "Adding clever dunder methods with surprising meaning.",
      "pt": "Adicionar dunders inteligentes com significado surpreendente."
    }
  },
  {
    "id": 45,
    "title": {
      "en": "Protocols and advanced typing",
      "pt": "Protocols e tipagem avançada"
    },
    "description": {
      "en": "Describe behavior-based interfaces and reusable generic contracts.",
      "pt": "Descreva interfaces por comportamento e contratos genéricos reutilizáveis."
    },
    "icon": "📐",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "typing protocols and generics",
      "pt": "protocolos de tipagem e genéricos"
    },
    "why": {
      "en": "Structural typing lets code depend on capability rather than a concrete class. Generics preserve relationships between input and output types.",
      "pt": "Tipagem estrutural permite depender de capacidade em vez de classe concreta. Genéricos preservam relações entre entrada e saída."
    },
    "mentalModel": {
      "en": "A Protocol states required methods. Any object satisfying them can be accepted without inheritance. TypeVar connects compatible types across a function.",
      "pt": "Protocol declara métodos exigidos. Qualquer objeto compatível é aceito sem herança. TypeVar conecta tipos em uma função."
    },
    "workflow": {
      "en": "Define small protocols at consumer boundaries, keep runtime validation separate and avoid abstractions used by only one concrete implementation.",
      "pt": "Defina protocolos pequenos nas fronteiras consumidoras, mantenha validação separada e evite abstração com uma implementação."
    },
    "exampleCode": "from typing import Protocol\n\nclass Formatter(Protocol):\n    def format(self, value: object) -> str: ...\n\nclass UpperFormatter:\n    def format(self, value):\n        return str(value).upper()\n\ndef render(values, formatter: Formatter):\n    return [formatter.format(value) for value in values]\n\nprint(render([\"a\", \"b\"], UpperFormatter()))",
    "exampleOutput": {
      "en": "['A', 'B']",
      "pt": "['A', 'B']"
    },
    "professionalCode": "from typing import TypeVar, Iterable\nT = TypeVar(\"T\")\n\ndef first_or(items: Iterable[T], default: T) -> T:\n    return next(iter(items), default)",
    "commonMistake": {
      "en": "A protocol with many unrelated methods is an implicit giant base class. Overusing casts tells the type checker to trust code without evidence.",
      "pt": "Protocolo com métodos não relacionados é classe base gigante implícita. Excesso de casts pede confiança sem evidência."
    },
    "bestPractice": {
      "en": "Prefer the smallest behavior the consumer truly needs and let implementations remain independent.",
      "pt": "Prefira o menor comportamento que o consumidor realmente precisa e deixe implementações independentes."
    },
    "outcomes": {
      "en": [
        "Define structural interfaces with Protocol",
        "Express type relationships with TypeVar",
        "Recognize when typing complexity exceeds value"
      ],
      "pt": [
        "Definir interfaces estruturais com Protocol",
        "Expressar relações com TypeVar",
        "Reconhecer quando complexidade de tipos excede valor"
      ]
    },
    "practice": {
      "functionName": "render",
      "starterCode": "from typing import Protocol\n\nclass Formatter(Protocol):\n    def format(self, value: object) -> str: ...\n\ndef render(values, formatter: Formatter):\n    \"\"\"Return each value formatted by the supplied collaborator.\"\"\"\n    pass",
      "publicAfterCode": "class Upper:\n    def format(self, value): return str(value).upper()\nprint(render([\"a\", \"b\"], Upper()))",
      "publicExpected": "['A', 'B']",
      "hiddenAfterCode": "class Brackets:\n    def format(self, value): return f\"[{value}]\"\nprint(render([1, 2], Brackets()))",
      "hiddenExpected": "['[1]', '[2]']",
      "requirements": [
        {
          "kind": "import",
          "value": "typing"
        },
        {
          "kind": "node",
          "value": "ClassDef"
        },
        {
          "kind": "function",
          "value": "render"
        }
      ]
    },
    "exam": {
      "functionName": "render",
      "starterCode": "from typing import Protocol\nclass Formatter(Protocol):\n    def format(self, value: object) -> str: ...\ndef render(values, formatter: Formatter):\n    pass",
      "publicAfterCode": "class Prefix:\n    def format(self, value): return \"id=\" + str(value)\nprint(render([3], Prefix()))",
      "publicExpected": "['id=3']",
      "hiddenAfterCode": "class Empty:\n    def format(self, value): return \"\"\nprint(render([], Empty()))",
      "hiddenExpected": "[]",
      "requirements": [
        {
          "kind": "import",
          "value": "typing"
        },
        {
          "kind": "node",
          "value": "ClassDef"
        }
      ]
    },
    "quizPurpose": {
      "en": "Depend on small capabilities instead of concrete inheritance trees.",
      "pt": "Depender de pequenas capacidades em vez de árvores de herança."
    },
    "quizBestPractice": {
      "en": "Define protocols at the point of use and preserve type relationships.",
      "pt": "Definir protocolos no uso e preservar relações de tipos."
    },
    "quizAvoid": {
      "en": "Creating giant interfaces or silencing errors with casts.",
      "pt": "Criar interfaces gigantes ou silenciar erros com casts."
    }
  },
  {
    "id": 46,
    "title": {
      "en": "Asyncio and cooperative concurrency",
      "pt": "Asyncio e concorrência cooperativa"
    },
    "description": {
      "en": "Coordinate many waiting operations without blocking a thread per task.",
      "pt": "Coordene muitas operações em espera sem bloquear uma thread por tarefa."
    },
    "icon": "⏱️",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": true,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "asyncio",
      "pt": "asyncio"
    },
    "why": {
      "en": "Asyncio is valuable when tasks spend most time waiting for network, timers or queues. It is not automatic CPU acceleration.",
      "pt": "Asyncio é valioso quando tarefas passam tempo esperando rede, timers ou filas. Não acelera CPU automaticamente."
    },
    "mentalModel": {
      "en": "An event loop advances coroutines when they await. Cooperative tasks must yield control; blocking work freezes the loop.",
      "pt": "Event loop avança coroutines quando fazem await. Tarefas cooperativas precisam ceder controle; trabalho bloqueante congela o loop."
    },
    "workflow": {
      "en": "Keep async boundaries end-to-end, use gather for independent work, set timeouts and move blocking CPU or legacy I/O off the loop.",
      "pt": "Mantenha fronteiras async ponta a ponta, use gather em trabalhos independentes, defina timeouts e retire bloqueios do loop."
    },
    "exampleCode": "import asyncio\n\nasync def fetch(value):\n    await asyncio.sleep(0)\n    return value * 2\n\nasync def main():\n    print(await asyncio.gather(fetch(2), fetch(3)))\n\nasyncio.run(main())",
    "exampleOutput": {
      "en": "[4, 6]",
      "pt": "[4, 6]"
    },
    "professionalCode": "import asyncio\n\nasync def gather_results(functions):\n    tasks = [asyncio.create_task(function()) for function in functions]\n    return await asyncio.gather(*tasks)",
    "commonMistake": {
      "en": "Calling time.sleep or blocking file/network code inside async functions freezes every coroutine sharing the event loop. Fire-and-forget tasks can lose exceptions.",
      "pt": "Chamar time.sleep ou I/O bloqueante em async congela todas as coroutines. Tarefas soltas podem perder exceções."
    },
    "bestPractice": {
      "en": "Own every task, apply timeouts and cancellation, and use async only where waiting concurrency exists.",
      "pt": "Assuma responsabilidade por toda tarefa, aplique timeout/cancelamento e use async onde há espera concorrente."
    },
    "outcomes": {
      "en": [
        "Explain event-loop scheduling",
        "Compose coroutines with gather",
        "Handle timeout and cancellation boundaries"
      ],
      "pt": [
        "Explicar agendamento do event loop",
        "Compor coroutines com gather",
        "Tratar timeout e cancelamento"
      ]
    },
    "practice": {
      "functionName": "gather_values",
      "starterCode": "import asyncio\n\nasync def gather_values(values):\n    \"\"\"Double values concurrently and preserve input order.\"\"\"\n    pass",
      "publicAfterCode": "print(asyncio.run(gather_values([1, 2, 3])))",
      "publicExpected": "[2, 4, 6]",
      "hiddenAfterCode": "print(asyncio.run(gather_values([])))",
      "hiddenExpected": "[]",
      "requirements": [
        {
          "kind": "import",
          "value": "asyncio"
        },
        {
          "kind": "node",
          "value": "AsyncFunctionDef"
        },
        {
          "kind": "node",
          "value": "Await"
        }
      ],
      "timeoutMs": 10000
    },
    "exam": {
      "functionName": "gather_values",
      "starterCode": "import asyncio\n\nasync def gather_values(values):\n    \"\"\"Create one coroutine per value and gather results.\"\"\"\n    pass",
      "publicAfterCode": "print(asyncio.run(gather_values([5])))",
      "publicExpected": "[10]",
      "hiddenAfterCode": "print(asyncio.run(gather_values([-1, 0])))",
      "hiddenExpected": "[-2, 0]",
      "requirements": [
        {
          "kind": "import",
          "value": "asyncio"
        },
        {
          "kind": "node",
          "value": "AsyncFunctionDef"
        }
      ],
      "timeoutMs": 10000
    },
    "quizPurpose": {
      "en": "Coordinate waiting tasks through an event loop.",
      "pt": "Coordenar tarefas em espera por event loop."
    },
    "quizBestPractice": {
      "en": "Keep blocking work off the loop and own cancellation.",
      "pt": "Manter bloqueios fora do loop e controlar cancelamento."
    },
    "quizAvoid": {
      "en": "Assuming async makes CPU-heavy work parallel.",
      "pt": "Assumir que async paraleliza trabalho de CPU."
    }
  },
  {
    "id": 47,
    "title": {
      "en": "Threads, processes and shared state",
      "pt": "Threads, processos e estado compartilhado"
    },
    "description": {
      "en": "Choose the correct concurrency model and protect shared state.",
      "pt": "Escolha o modelo de concorrência correto e proteja estado compartilhado."
    },
    "icon": "🧵",
    "libraries": [],
    "track": "core",
    "stage": "advanced",
    "estimatedHours": 7,
    "desktopRequired": true,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "threads and processes",
      "pt": "threads e processos"
    },
    "why": {
      "en": "Threads help with blocking I/O; processes can use multiple CPU cores. Both add coordination, failure and shutdown complexity.",
      "pt": "Threads ajudam em I/O bloqueante; processos usam múltiplos núcleos. Ambos adicionam coordenação, falhas e desligamento."
    },
    "mentalModel": {
      "en": "Concurrency interleaves tasks; parallelism executes simultaneously. Shared mutable state requires synchronization or redesign into isolated messages.",
      "pt": "Concorrência intercala tarefas; paralelismo executa simultaneamente. Estado mutável compartilhado exige sincronização ou isolamento por mensagens."
    },
    "workflow": {
      "en": "Classify the workload, minimize shared state, bound worker counts, propagate errors and design graceful shutdown before adding concurrency.",
      "pt": "Classifique a carga, minimize estado compartilhado, limite workers, propague erros e projete desligamento antes de adicionar concorrência."
    },
    "exampleCode": "def partition_work(items, workers):\n    if workers <= 0:\n        raise ValueError(\"workers\")\n    buckets = [[] for _ in range(workers)]\n    for index, item in enumerate(items):\n        buckets[index % workers].append(item)\n    return buckets\n\nprint(partition_work(range(7), 3))",
    "exampleOutput": {
      "en": "[[0, 3, 6], [1, 4], [2, 5]]",
      "pt": "[[0, 3, 6], [1, 4], [2, 5]]"
    },
    "professionalCode": "# I/O-bound: ThreadPoolExecutor\n# CPU-bound: ProcessPoolExecutor\n# High-volume async I/O: asyncio\n# Shared mutation: redesign first, lock only the smallest critical section",
    "commonMistake": {
      "en": "Adding more workers can reduce performance through contention, serialization and memory pressure. A lock around too much code removes concurrency.",
      "pt": "Adicionar workers pode reduzir desempenho por contenção, serialização e memória. Lock em código demais remove concorrência."
    },
    "bestPractice": {
      "en": "Measure the workload and prefer isolated inputs and returned results over shared mutable objects.",
      "pt": "Meça a carga e prefira entradas isoladas e resultados retornados a objetos mutáveis compartilhados."
    },
    "outcomes": {
      "en": [
        "Distinguish concurrency from parallelism",
        "Choose threads, processes or asyncio",
        "Partition work and avoid shared mutation"
      ],
      "pt": [
        "Distinguir concorrência de paralelismo",
        "Escolher threads, processos ou asyncio",
        "Particionar trabalho e evitar mutação compartilhada"
      ]
    },
    "practice": {
      "functionName": "partition_work",
      "starterCode": "def partition_work(items, workers):\n    \"\"\"Distribute items round-robin into worker buckets.\"\"\"\n    pass",
      "publicAfterCode": "print(partition_work(list(range(7)), 3))",
      "publicExpected": "[[0, 3, 6], [1, 4], [2, 5]]",
      "hiddenAfterCode": "print(partition_work([], 2))",
      "hiddenExpected": "[[], []]",
      "requirements": [
        {
          "kind": "function",
          "value": "partition_work"
        }
      ]
    },
    "exam": {
      "functionName": "partition_work",
      "starterCode": "def partition_work(items, workers):\n    \"\"\"Raise ValueError for non-positive workers.\"\"\"\n    pass",
      "publicAfterCode": "print(partition_work([\"a\", \"b\"], 1))",
      "publicExpected": "[['a', 'b']]",
      "hiddenAfterCode": "try:\n    partition_work([1], 0)\nexcept ValueError:\n    print(\"invalid-workers\")",
      "hiddenExpected": "invalid-workers",
      "requirements": [
        {
          "kind": "function",
          "value": "partition_work"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Match concurrency mechanism to waiting, CPU and isolation needs.",
      "pt": "Combinar mecanismo de concorrência com espera, CPU e isolamento."
    },
    "quizBestPractice": {
      "en": "Bound workers and isolate state before adding synchronization.",
      "pt": "Limitar workers e isolar estado antes de sincronizar."
    },
    "quizAvoid": {
      "en": "Adding unbounded workers around shared mutable data.",
      "pt": "Adicionar workers ilimitados em estado mutável compartilhado."
    }
  },
  {
    "id": 48,
    "title": {
      "en": "Performance, profiling and caching",
      "pt": "Desempenho, profiling e cache"
    },
    "description": {
      "en": "Measure real bottlenecks and optimize with evidence.",
      "pt": "Meça gargalos reais e otimize com evidência."
    },
    "icon": "🚀",
    "libraries": [],
    "track": "core",
    "stage": "engineering",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "profiling and caching",
      "pt": "profiling e cache"
    },
    "why": {
      "en": "Performance work without measurement often complicates code while missing the true bottleneck. Profilers identify where time and memory are spent.",
      "pt": "Trabalho de performance sem medida complica código e erra gargalo. Profilers identificam tempo e memória."
    },
    "mentalModel": {
      "en": "Latency is elapsed time, throughput is work per period, memory is retained data. Caching trades memory and invalidation complexity for repeated computation.",
      "pt": "Latência é tempo, throughput é trabalho por período, memória é dado retido. Cache troca memória e invalidação por computação repetida."
    },
    "workflow": {
      "en": "Set a target, reproduce a workload, profile, optimize the dominant cost, verify correctness and measure again.",
      "pt": "Defina alvo, reproduza carga, faça profile, otimize custo dominante, valide e meça novamente."
    },
    "exampleCode": "from functools import lru_cache\n\ncalls = 0\n@lru_cache(maxsize=None)\ndef square(value):\n    global calls\n    calls += 1\n    return value * value\n\nprint([square(v) for v in [2, 2, 3, 2]])\nprint(calls)",
    "exampleOutput": {
      "en": "[4, 4, 9, 4]\n2",
      "pt": "[4, 4, 9, 4]\n2"
    },
    "professionalCode": "def unique_expensive_calls(values):\n    cache = {}\n    results = []\n    for value in values:\n        if value not in cache:\n            cache[value] = value * value\n        results.append(cache[value])\n    return results, len(cache)",
    "commonMistake": {
      "en": "Caching mutable or user-specific results under incomplete keys returns wrong data. Micro-optimizing syntax while I/O dominates wastes effort.",
      "pt": "Cachear resultado mutável ou específico com chave incompleta retorna dado errado. Micro-otimizar sintaxe quando I/O domina desperdiça esforço."
    },
    "bestPractice": {
      "en": "Cache only deterministic results with explicit lifetime and an invalidation strategy.",
      "pt": "Cacheie apenas resultados determinísticos com vida e invalidação explícitas."
    },
    "outcomes": {
      "en": [
        "Measure before optimizing",
        "Interpret time and memory profiles",
        "Design safe cache keys and lifetimes"
      ],
      "pt": [
        "Medir antes de otimizar",
        "Interpretar perfis de tempo e memória",
        "Projetar chaves e vida de cache seguras"
      ]
    },
    "practice": {
      "functionName": "unique_expensive_calls",
      "starterCode": "def unique_expensive_calls(values):\n    \"\"\"Return squared results and number of unique computations.\"\"\"\n    pass",
      "publicAfterCode": "print(unique_expensive_calls([2, 2, 3, 2]))",
      "publicExpected": "2",
      "hiddenAfterCode": "print(unique_expensive_calls([]))",
      "hiddenExpected": "0",
      "requirements": [
        {
          "kind": "function",
          "value": "unique_expensive_calls"
        },
        {
          "kind": "node",
          "value": "Dict"
        }
      ]
    },
    "exam": {
      "functionName": "unique_expensive_calls",
      "starterCode": "def unique_expensive_calls(values):\n    \"\"\"Compute each distinct value once while preserving result order.\"\"\"\n    pass",
      "publicAfterCode": "print(unique_expensive_calls([4, 1, 4]))",
      "publicExpected": "[16, 1, 16]",
      "hiddenAfterCode": "print(unique_expensive_calls([-2, -2]))",
      "hiddenExpected": "1",
      "requirements": [
        {
          "kind": "function",
          "value": "unique_expensive_calls"
        }
      ]
    },
    "quizPurpose": {
      "en": "Improve measured bottlenecks while preserving correctness.",
      "pt": "Melhorar gargalos medidos preservando correção."
    },
    "quizBestPractice": {
      "en": "Set a metric, profile, change one bottleneck and measure again.",
      "pt": "Definir métrica, medir, mudar um gargalo e medir novamente."
    },
    "quizAvoid": {
      "en": "Caching without complete keys or invalidation.",
      "pt": "Cachear sem chaves completas ou invalidação."
    }
  },
  {
    "id": 49,
    "title": {
      "en": "SQL, SQLite and transactions",
      "pt": "SQL, SQLite e transações"
    },
    "description": {
      "en": "Persist structured data with parameterized queries and atomic changes.",
      "pt": "Persista dados estruturados com queries parametrizadas e mudanças atômicas."
    },
    "icon": "🗄️",
    "libraries": [
      "sqlite3"
    ],
    "track": "core",
    "stage": "engineering",
    "estimatedHours": 7,
    "desktopRequired": true,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "relational data and transactions",
      "pt": "dados relacionais e transações"
    },
    "why": {
      "en": "A relational database enforces durable structure, relationships and atomic updates that JSON files cannot safely provide under concurrent use.",
      "pt": "Banco relacional impõe estrutura durável, relações e atualizações atômicas que JSON não fornece com concorrência."
    },
    "mentalModel": {
      "en": "Tables store groups of related rows, keys identify each row, constraints make sure data stays valid (like requiring a non-empty title), and a transaction makes a group of changes succeed or fail together.",
      "pt": "Tabelas armazenam grupos de linhas relacionadas, chaves identificam cada linha, constraints garantem que os dados fiquem válidos (como exigir título não vazio), e uma transação faz um grupo de mudanças ter sucesso ou falhar junto."
    },
    "workflow": {
      "en": "Design schema from your data rules (what fields are required, what values are valid), use placeholders for values, wrap related writes in a transaction and add indexes only for measured query patterns.",
      "pt": "Projete schema pelas regras dos dados (quais campos são obrigatórios, quais valores são válidos), use placeholders, agrupe escritas em transação e adicione índices por consultas medidas."
    },
    "exampleCode": "def build_claim_query(status, limit):\n    sql = \"SELECT id, title FROM tasks WHERE status = ? ORDER BY id LIMIT ?\"\n    return sql, (status, limit)\n\nprint(build_claim_query(\"open\", 10))",
    "exampleOutput": {
      "en": "('SELECT id, title FROM tasks WHERE status = ? ORDER BY id LIMIT ?', ('open', 10))",
      "pt": "('SELECT id, title FROM tasks WHERE status = ? ORDER BY id LIMIT ?', ('open', 10))"
    },
    "professionalCode": "import sqlite3\n\nwith sqlite3.connect(\":memory:\") as connection:\n    connection.execute(\"CREATE TABLE tasks(id INTEGER PRIMARY KEY, status TEXT NOT NULL)\")\n    connection.execute(\"INSERT INTO tasks(status) VALUES (?)\", (\"open\",))\n    rows = connection.execute(\"SELECT id, status FROM tasks\").fetchall()\n    print(rows)",
    "commonMistake": {
      "en": "Building SQL with f-strings from user input enables injection. Committing each related write separately leaves partial data after failure.",
      "pt": "Construir SQL com f-string de entrada permite injection. Commitar cada escrita relacionada deixa dados parciais após falha."
    },
    "bestPractice": {
      "en": "Parameterize every value and let the transaction boundary match one business operation.",
      "pt": "Parametrize todo valor e faça a transação corresponder a uma operação de negócio."
    },
    "outcomes": {
      "en": [
        "Design normalized tables and constraints",
        "Use parameterized SQL",
        "Define atomic transaction boundaries"
      ],
      "pt": [
        "Projetar tabelas e constraints",
        "Usar SQL parametrizado",
        "Definir transações atômicas"
      ]
    },
    "practice": {
      "functionName": "build_claim_query",
      "starterCode": "def build_claim_query(status, limit):\n    \"\"\"Return parameterized SQL and a parameter tuple.\"\"\"\n    pass",
      "publicAfterCode": "print(build_claim_query(\"open\", 10))",
      "publicExpected": "WHERE status = ?",
      "hiddenAfterCode": "print(build_claim_query(\"closed\", 5)[1])",
      "hiddenExpected": "('closed', 5)",
      "requirements": [
        {
          "kind": "function",
          "value": "build_claim_query"
        }
      ]
    },
    "exam": {
      "functionName": "build_claim_query",
      "starterCode": "def build_claim_query(status, limit):\n    \"\"\"Never interpolate status into SQL text.\"\"\"\n    pass",
      "publicAfterCode": "sql, params = build_claim_query(\"open\", 3)\nprint(sql)\nprint(params)",
      "publicExpected": "LIMIT ?",
      "hiddenAfterCode": "sql, params = build_claim_query(\"x' OR 1=1 --\", 2)\nprint(\"OR 1=1\" in sql, params)",
      "hiddenExpected": "False",
      "requirements": [
        {
          "kind": "function",
          "value": "build_claim_query"
        }
      ]
    },
    "quizPurpose": {
      "en": "Provide durable structured persistence and atomic business changes.",
      "pt": "Fornecer persistência estruturada e mudanças atômicas."
    },
    "quizBestPractice": {
      "en": "Use constraints, placeholders and business-sized transactions.",
      "pt": "Usar constraints, placeholders e transações do tamanho da operação."
    },
    "quizAvoid": {
      "en": "Interpolating user input into SQL strings.",
      "pt": "Interpolar entrada do usuário em strings SQL."
    }
  },
  {
    "id": 50,
    "title": {
      "en": "HTTP clients and API contracts",
      "pt": "Clientes HTTP e contratos de API"
    },
    "description": {
      "en": "Communicate across processes with explicit requests, status codes and validated payloads.",
      "pt": "Comunique processos com requests, status e payloads validados."
    },
    "icon": "🌐",
    "libraries": [],
    "track": "core",
    "stage": "engineering",
    "estimatedHours": 7,
    "desktopRequired": true,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "HTTP and API contracts",
      "pt": "HTTP e contratos de API"
    },
    "why": {
      "en": "An API is a versioned boundary between independent systems. Network calls can fail, duplicate or arrive late, so contracts and resilience matter.",
      "pt": "API é fronteira versionada entre sistemas. Rede pode falhar, duplicar ou atrasar, então contratos e resiliência importam."
    },
    "mentalModel": {
      "en": "A request has method, URL, headers and body. A response has status, headers and body. Success at transport level does not guarantee valid business data.",
      "pt": "Request tem método, URL, headers e corpo. Response tem status, headers e corpo. Sucesso de transporte não garante dado válido."
    },
    "workflow": {
      "en": "Set timeouts, distinguish retryable failures, validate JSON at the boundary, use idempotency for repeated writes and never log authorization tokens.",
      "pt": "Defina timeouts, distinga falhas repetíveis, valide JSON na fronteira, use idempotência em escritas e nunca registre tokens."
    },
    "exampleCode": "def normalize_response(status, payload):\n    if 200 <= status < 300:\n        return {\"ok\": True, \"data\": payload, \"error\": None}\n    return {\"ok\": False, \"data\": None, \"error\": payload.get(\"error\", \"unknown\")}\n\nprint(normalize_response(200, {\"id\": 7}))",
    "exampleOutput": {
      "en": "{'ok': True, 'data': {'id': 7}, 'error': None}",
      "pt": "{'ok': True, 'data': {'id': 7}, 'error': None}"
    },
    "professionalCode": "import json\nfrom urllib.request import Request\n\nbody = json.dumps({\"title\": \"buy groceries\"}).encode()\nrequest = Request(\"https://example.invalid/tasks\", data=body, method=\"POST\", headers={\"Content-Type\": \"application/json\"})",
    "commonMistake": {
      "en": "Retrying every failure can duplicate non-idempotent writes. Trusting response shape without validation moves network errors deep into business logic.",
      "pt": "Repetir toda falha pode duplicar escritas. Confiar no payload sem validar move erro de rede para regras internas."
    },
    "bestPractice": {
      "en": "Treat remote data as untrusted, set deadlines and design explicit retry and idempotency rules.",
      "pt": "Trate dados remotos como não confiáveis, defina prazos e regras explícitas de retry e idempotência."
    },
    "outcomes": {
      "en": [
        "Model request and response contracts",
        "Classify status and network failures",
        "Validate payloads before domain use"
      ],
      "pt": [
        "Modelar contratos request/response",
        "Classificar falhas de status e rede",
        "Validar payloads antes do domínio"
      ]
    },
    "practice": {
      "functionName": "normalize_response",
      "starterCode": "def normalize_response(status, payload):\n    \"\"\"Normalize success and error responses into one stable shape.\"\"\"\n    pass",
      "publicAfterCode": "print(normalize_response(201, {\"id\": 7}))",
      "publicExpected": "'ok': True",
      "hiddenAfterCode": "print(normalize_response(404, {\"error\": \"missing\"}))",
      "hiddenExpected": "'error': 'missing'",
      "requirements": [
        {
          "kind": "function",
          "value": "normalize_response"
        },
        {
          "kind": "node",
          "value": "If"
        }
      ]
    },
    "exam": {
      "functionName": "normalize_response",
      "starterCode": "def normalize_response(status, payload):\n    \"\"\"Treat only 2xx as success and use unknown for missing error text.\"\"\"\n    pass",
      "publicAfterCode": "print(normalize_response(204, {}))",
      "publicExpected": "'ok': True",
      "hiddenAfterCode": "print(normalize_response(500, {}))",
      "hiddenExpected": "'error': 'unknown'",
      "requirements": [
        {
          "kind": "function",
          "value": "normalize_response"
        }
      ]
    },
    "quizPurpose": {
      "en": "Create stable boundaries for unreliable remote communication.",
      "pt": "Criar fronteiras estáveis para comunicação remota não confiável."
    },
    "quizBestPractice": {
      "en": "Validate, time out and retry only safe operations.",
      "pt": "Validar, definir timeout e repetir apenas operações seguras."
    },
    "quizAvoid": {
      "en": "Blind retries and trusting arbitrary JSON payloads.",
      "pt": "Retries cegos e confiança em JSON arbitrário."
    }
  },
  {
    "id": 51,
    "title": {
      "en": "Architecture and secure boundaries",
      "pt": "Arquitetura e fronteiras seguras"
    },
    "description": {
      "en": "Separate policy from infrastructure and minimize exposure of sensitive data.",
      "pt": "Separe política de infraestrutura e minimize exposição de dados sensíveis."
    },
    "icon": "🛡️",
    "libraries": [],
    "track": "core",
    "stage": "engineering",
    "estimatedHours": 7,
    "desktopRequired": false,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "architecture and security boundaries",
      "pt": "arquitetura e fronteiras de segurança"
    },
    "why": {
      "en": "Architecture controls the cost of change. Security is strongest when boundaries validate input, restrict authority and avoid storing unnecessary sensitive data.",
      "pt": "Arquitetura controla custo da mudança. Segurança é mais forte quando fronteiras validam entrada, limitam autoridade e evitam dados desnecessários."
    },
    "mentalModel": {
      "en": "Domain policy should not know database or web details. Adapters translate external data. Least privilege gives each component only the authority it needs.",
      "pt": "Política de domínio não deve conhecer banco ou web. Adaptadores traduzem dados externos. Menor privilégio dá só autoridade necessária."
    },
    "workflow": {
      "en": "Define trust boundaries, validate at entry, inject infrastructure interfaces, redact outputs and record security-relevant events without secrets.",
      "pt": "Defina fronteiras de confiança, valide na entrada, injete infraestrutura, oculte saída e registre eventos sem segredos."
    },
    "exampleCode": "def redact_record(record, secret_keys):\n    return {key: (\"***\" if key in secret_keys else value) for key, value in record.items()}\n\nprint(redact_record({\"name\": \"Ana\", \"token\": \"abc\"}, {\"token\"}))",
    "exampleOutput": {
      "en": "{'name': 'Ana', 'token': '***'}",
      "pt": "{'name': 'Ana', 'token': '***'}"
    },
    "professionalCode": "def process_order(order, repository):\n    if order[\"quantity\"] < 0:\n        raise ValueError(\"quantity\")\n    saved_id = repository.save({\"quantity\": order[\"quantity\"], \"status\": \"open\"})\n    return {\"id\": saved_id, \"status\": \"open\"}",
    "commonMistake": {
      "en": "Passing framework request objects through every layer couples policy to infrastructure. Redaction after logging is too late.",
      "pt": "Passar request do framework por todas camadas acopla política à infraestrutura. Redação depois do log é tarde."
    },
    "bestPractice": {
      "en": "Convert external data into explicit domain values at the boundary and never collect or expose data without a clear need.",
      "pt": "Converta dados externos em valores de domínio na fronteira e nunca colete ou exponha sem necessidade."
    },
    "outcomes": {
      "en": [
        "Separate domain policy from adapters",
        "Apply least privilege and redaction",
        "Validate untrusted data at boundaries"
      ],
      "pt": [
        "Separar política de adaptadores",
        "Aplicar menor privilégio e redação",
        "Validar dados não confiáveis nas fronteiras"
      ]
    },
    "practice": {
      "functionName": "redact_record",
      "starterCode": "def redact_record(record, secret_keys):\n    \"\"\"Return a new dictionary with secret values replaced by ***.\"\"\"\n    pass",
      "publicAfterCode": "print(redact_record({\"name\": \"Ana\", \"token\": \"abc\"}, {\"token\"}))",
      "publicExpected": "'token': '***'",
      "hiddenAfterCode": "original = {\"password\": \"p\", \"id\": 3}\nprint(redact_record(original, {\"password\"}))\nprint(original[\"password\"])",
      "hiddenExpected": "p",
      "requirements": [
        {
          "kind": "function",
          "value": "redact_record"
        },
        {
          "kind": "node",
          "value": "DictComp"
        }
      ]
    },
    "exam": {
      "functionName": "redact_record",
      "starterCode": "def redact_record(record, secret_keys):\n    \"\"\"Do not mutate the source and support multiple secret fields.\"\"\"\n    pass",
      "publicAfterCode": "print(redact_record({\"a\": 1, \"secret\": 2}, {\"secret\"}))",
      "publicExpected": "'secret': '***'",
      "hiddenAfterCode": "print(redact_record({\"token\": \"x\", \"password\": \"y\"}, {\"token\", \"password\"}))",
      "hiddenExpected": "'password': '***'",
      "requirements": [
        {
          "kind": "function",
          "value": "redact_record"
        }
      ]
    },
    "quizPurpose": {
      "en": "Keep policy independent and reduce authority and data exposure.",
      "pt": "Manter política independente e reduzir autoridade e exposição."
    },
    "quizBestPractice": {
      "en": "Validate and redact before data crosses a trust boundary.",
      "pt": "Validar e ocultar antes de cruzar fronteira de confiança."
    },
    "quizAvoid": {
      "en": "Letting framework objects and secrets flow through all layers.",
      "pt": "Deixar objetos de framework e segredos fluírem por todas camadas."
    }
  },
  {
    "id": 52,
    "title": {
      "en": "Packaging, CI and releases",
      "pt": "Empacotamento, CI e releases"
    },
    "description": {
      "en": "Turn a repository into a repeatable artifact with automated quality gates.",
      "pt": "Transforme repositório em artefato repetível com gates automatizados."
    },
    "icon": "📦",
    "libraries": [],
    "track": "core",
    "stage": "engineering",
    "estimatedHours": 7,
    "desktopRequired": true,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "packaging and continuous integration",
      "pt": "empacotamento e integração contínua"
    },
    "why": {
      "en": "A release should be reconstructable from source and versioned dependencies. CI gives every change the same automated verification before deployment.",
      "pt": "Release deve ser reconstruível do fonte e dependências versionadas. CI dá verificação igual a toda mudança antes do deploy."
    },
    "mentalModel": {
      "en": "Source is transformed into a build artifact. A pipeline checks format, types, tests, security and build, then publishes only if every required gate passes.",
      "pt": "Fonte vira artefato de build. Pipeline verifica formato, tipos, testes, segurança e build, publicando só com gates verdes."
    },
    "workflow": {
      "en": "Keep builds deterministic, pin tool versions, test the artifact rather than only source and separate build credentials from runtime credentials.",
      "pt": "Mantenha builds determinísticos, fixe ferramentas, teste artefato e separe credenciais de build e runtime."
    },
    "exampleCode": "def release_ready(checks):\n    required = [\"types\", \"tests\", \"security\", \"build\"]\n    failures = [name for name in required if checks.get(name) is not True]\n    return {\"ready\": not failures, \"failures\": failures}\n\nprint(release_ready({\"types\": True, \"tests\": True, \"security\": True, \"build\": True}))",
    "exampleOutput": {
      "en": "{'ready': True, 'failures': []}",
      "pt": "{'ready': True, 'failures': []}"
    },
    "professionalCode": "# pyproject.toml defines package metadata and tools\n# CI runs from a clean checkout:\n# python -m pip install -e .[dev]\n# python -m pytest\n# python -m build\n# install the wheel and run smoke tests",
    "commonMistake": {
      "en": "A pipeline that depends on undeclared global tools or cached files can pass in CI and fail for users. Publishing directly from a developer machine bypasses evidence.",
      "pt": "Pipeline dependente de ferramentas globais ou cache pode passar no CI e falhar para usuários. Publicar da máquina local ignora evidência."
    },
    "bestPractice": {
      "en": "Build from a clean checkout, verify the produced wheel or image and make versioning and rollback explicit.",
      "pt": "Faça build de checkout limpo, valide wheel ou imagem e torne versionamento e rollback explícitos."
    },
    "outcomes": {
      "en": [
        "Define package metadata and entry points",
        "Create deterministic CI gates",
        "Verify and version release artifacts"
      ],
      "pt": [
        "Definir metadados e entry points",
        "Criar gates determinísticos de CI",
        "Validar e versionar artefatos"
      ]
    },
    "practice": {
      "functionName": "release_ready",
      "starterCode": "def release_ready(checks):\n    \"\"\"Require types, tests, security and build to be exactly True.\"\"\"\n    pass",
      "publicAfterCode": "print(release_ready({\"types\": True, \"tests\": True, \"security\": True, \"build\": True}))",
      "publicExpected": "'ready': True",
      "hiddenAfterCode": "print(release_ready({\"types\": True, \"tests\": False, \"security\": True, \"build\": True}))",
      "hiddenExpected": "'failures': ['tests']",
      "requirements": [
        {
          "kind": "function",
          "value": "release_ready"
        }
      ]
    },
    "exam": {
      "functionName": "release_ready",
      "starterCode": "def release_ready(checks):\n    \"\"\"Report every missing or failed required gate in stable order.\"\"\"\n    pass",
      "publicAfterCode": "print(release_ready({}))",
      "publicExpected": "'types'",
      "hiddenAfterCode": "print(release_ready({\"types\": True, \"tests\": True, \"security\": False, \"build\": False}))",
      "hiddenExpected": "['security', 'build']",
      "requirements": [
        {
          "kind": "function",
          "value": "release_ready"
        }
      ]
    },
    "quizPurpose": {
      "en": "Produce repeatable artifacts only after automated evidence passes.",
      "pt": "Produzir artefatos repetíveis somente após evidência automatizada."
    },
    "quizBestPractice": {
      "en": "Build and test from clean environments and verify the artifact.",
      "pt": "Fazer build e teste em ambiente limpo e validar artefato."
    },
    "quizAvoid": {
      "en": "Relying on developer-machine state or unverified artifacts.",
      "pt": "Depender do estado da máquina do desenvolvedor ou artefato não validado."
    }
  },
  {
    "id": 53,
    "title": {
      "en": "Python mastery capstone",
      "pt": "Capstone de domínio em Python"
    },
    "description": {
      "en": "Design a production-style service core with explicit contracts, persistence boundary, tests and failure behavior.",
      "pt": "Projete núcleo de serviço com contratos, persistência, testes e comportamento de falha."
    },
    "icon": "🏅",
    "libraries": [],
    "track": "core",
    "stage": "engineering",
    "estimatedHours": 16,
    "desktopRequired": true,
    "labPath": "/engineering-lab",
    "concept": {
      "en": "end-to-end Python engineering",
      "pt": "engenharia Python ponta a ponta"
    },
    "why": {
      "en": "Mastery means choosing simple mechanisms for real constraints, explaining trade-offs and producing evidence that the system behaves correctly under change.",
      "pt": "Domínio significa escolher mecanismos simples para restrições reais, explicar decisões e produzir evidência sob mudança."
    },
    "mentalModel": {
      "en": "A production system is a set of contracts: input, domain, persistence, external services and operations. Each contract owns validation and failure semantics.",
      "pt": "Sistema de produção é conjunto de contratos: entrada, domínio, persistência, serviços externos e operação. Cada contrato assume validação e falha."
    },
    "workflow": {
      "en": "Write acceptance examples, model the domain, isolate effects behind collaborators, test failures, profile critical paths and package a reproducible release.",
      "pt": "Escreva exemplos de aceitação, modele domínio, isole efeitos, teste falhas, faça profile e empacote release reproduzível."
    },
    "exampleCode": "def process_orders(orders, tax_rate):\n    if tax_rate < 0:\n        raise ValueError(\"tax_rate\")\n    subtotal = sum(order[\"quantity\"] * order[\"unit_price\"] for order in orders)\n    tax = round(subtotal * tax_rate, 2)\n    return {\"subtotal\": subtotal, \"tax\": tax, \"total\": round(subtotal + tax, 2)}\n\nprint(process_orders([{\"quantity\": 2, \"unit_price\": 10}], 0.13))",
    "exampleOutput": {
      "en": "{'subtotal': 20, 'tax': 2.6, 'total': 22.6}",
      "pt": "{'subtotal': 20, 'tax': 2.6, 'total': 22.6}"
    },
    "professionalCode": "class OrderService:\n    def __init__(self, repository, logger):\n        self.repository = repository\n        self.logger = logger\n    def complete(self, orders, tax_rate):\n        summary = process_orders(orders, tax_rate)\n        order_id = self.repository.save(summary)\n        self.logger.info(\"order completed\", {\"order_id\": order_id})\n        return {\"id\": order_id, **summary}",
    "commonMistake": {
      "en": "Adding frameworks, queues and abstractions before the domain contract is clear produces a complex system that still gives wrong answers.",
      "pt": "Adicionar frameworks, filas e abstrações antes do contrato de domínio cria sistema complexo que ainda responde errado."
    },
    "bestPractice": {
      "en": "Prove the pure core first, then add one replaceable adapter at a time with integration tests at each boundary.",
      "pt": "Comprove o núcleo puro primeiro e adicione um adaptador substituível por vez com testes de integração."
    },
    "outcomes": {
      "en": [
        "Design explicit system contracts",
        "Integrate persistence and operational boundaries",
        "Defend architecture with tests and measurements"
      ],
      "pt": [
        "Projetar contratos explícitos",
        "Integrar persistência e operação",
        "Defender arquitetura com testes e medidas"
      ]
    },
    "practice": {
      "functionName": "process_orders",
      "starterCode": "def process_orders(orders, tax_rate):\n    \"\"\"Validate orders and return subtotal, tax and total.\"\"\"\n    pass",
      "publicAfterCode": "print(process_orders([{\"quantity\": 2, \"unit_price\": 10}], 0.13))",
      "publicExpected": "'total': 22.6",
      "hiddenAfterCode": "print(process_orders([], 0.2))",
      "hiddenExpected": "'total': 0.0",
      "requirements": [
        {
          "kind": "function",
          "value": "process_orders"
        }
      ]
    },
    "exam": {
      "functionName": "process_orders",
      "starterCode": "def process_orders(orders, tax_rate):\n    \"\"\"Reject negative rates, quantities or prices and round money to 2 decimals.\"\"\"\n    pass",
      "publicAfterCode": "print(process_orders([{\"quantity\": 3, \"unit_price\": 2.5}], 0.1))",
      "publicExpected": "'total': 8.25",
      "hiddenAfterCode": "try:\n    process_orders([{\"quantity\": -1, \"unit_price\": 10}], 0.1)\nexcept ValueError:\n    print(\"invalid-order\")",
      "hiddenExpected": "invalid-order",
      "requirements": [
        {
          "kind": "function",
          "value": "process_orders"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Integrate advanced Python and engineering into a defensible system.",
      "pt": "Integrar Python avançado e engenharia em sistema defensável."
    },
    "quizBestPractice": {
      "en": "Start from contracts and evidence, then add infrastructure deliberately.",
      "pt": "Começar por contratos e evidência, depois adicionar infraestrutura."
    },
    "quizAvoid": {
      "en": "Using architecture complexity to hide unclear business rules.",
      "pt": "Usar complexidade arquitetural para esconder regras confusas."
    }
  }
]

export const ADVANCED_ENGINEERING_PHASES = createConceptPhases(specs)

export const phase40 = ADVANCED_ENGINEERING_PHASES[0]
export const phase41 = ADVANCED_ENGINEERING_PHASES[1]
export const phase42 = ADVANCED_ENGINEERING_PHASES[2]
export const phase43 = ADVANCED_ENGINEERING_PHASES[3]
export const phase44 = ADVANCED_ENGINEERING_PHASES[4]
export const phase45 = ADVANCED_ENGINEERING_PHASES[5]
export const phase46 = ADVANCED_ENGINEERING_PHASES[6]
export const phase47 = ADVANCED_ENGINEERING_PHASES[7]
export const phase48 = ADVANCED_ENGINEERING_PHASES[8]
export const phase49 = ADVANCED_ENGINEERING_PHASES[9]
export const phase50 = ADVANCED_ENGINEERING_PHASES[10]
export const phase51 = ADVANCED_ENGINEERING_PHASES[11]
export const phase52 = ADVANCED_ENGINEERING_PHASES[12]
export const phase53 = ADVANCED_ENGINEERING_PHASES[13]
