import { createConceptPhases, type ConceptPhaseSpec } from './phaseFactory'

const specs: ConceptPhaseSpec[] = [
  {
    "id": 28,
    "title": {
      "en": "Project anatomy",
      "pt": "Anatomia de projetos"
    },
    "description": {
      "en": "Move from one large script to a project whose files have clear responsibilities.",
      "pt": "Saia de um script gigante para um projeto cujos arquivos têm responsabilidades claras."
    },
    "icon": "🗂️",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "project structure",
      "pt": "estrutura de projetos"
    },
    "why": {
      "en": "Project structure reduces accidental coupling. A new developer should be able to find the entry point, business rules, tests and documentation without reading every file.",
      "pt": "A estrutura reduz acoplamento acidental. Uma pessoa nova deve encontrar entrada, regras, testes e documentação sem ler todos os arquivos."
    },
    "mentalModel": {
      "en": "Think of a project as a workshop: src contains the product, tests inspect it, README explains it, and configuration controls the tools.",
      "pt": "Pense no projeto como uma oficina: src contém o produto, tests inspeciona, README explica e configuração controla ferramentas."
    },
    "workflow": {
      "en": "Start with responsibilities, then create the minimum folders. Do not create layers merely because a diagram looks professional.",
      "pt": "Comece pelas responsabilidades e crie apenas as pastas necessárias. Não crie camadas só porque o diagrama parece profissional."
    },
    "exampleCode": "project = {\"src\": [\"app.py\", \"service.py\"], \"tests\": [\"test_service.py\"]}\nfor folder, files in project.items():\n    for file in files:\n        print(f\"{folder}/{file}\")",
    "exampleOutput": {
      "en": "src/app.py\nsrc/service.py\ntests/test_service.py",
      "pt": "src/app.py\nsrc/service.py\ntests/test_service.py"
    },
    "professionalCode": "from pathlib import PurePosixPath\n\ndef build_paths(package, modules):\n    root = PurePosixPath(\"src\") / package\n    return [str(root / \"__init__.py\"), *[str(root / f\"{name}.py\") for name in modules]]\n\nprint(build_paths(\"claims\", [\"models\", \"service\"]))",
    "commonMistake": {
      "en": "Putting every responsibility in app.py creates a file that is difficult to test, review and change safely.",
      "pt": "Colocar tudo em app.py cria um arquivo difícil de testar, revisar e alterar com segurança."
    },
    "bestPractice": {
      "en": "Create a folder or module when it protects a clear responsibility, not to imitate a large company.",
      "pt": "Crie pasta ou módulo quando isso protege uma responsabilidade clara, não para imitar empresa grande."
    },
    "outcomes": {
      "en": [
        "Design a small src/tests layout",
        "Separate entry point from business rules",
        "Explain every file in a code review"
      ],
      "pt": [
        "Projetar layout pequeno com src/tests",
        "Separar entrada das regras de negócio",
        "Explicar cada arquivo em revisão"
      ]
    },
    "practice": {
      "functionName": "project_manifest",
      "starterCode": "def project_manifest(package, modules):\n    \"\"\"Return the essential project paths.\"\"\"\n    pass",
      "publicAfterCode": "print(project_manifest(\"claims\", [\"models\", \"service\"]))",
      "publicExpected": "src/claims/__init__.py",
      "hiddenAfterCode": "print(project_manifest(\"billing\", [\"invoice\"]))",
      "hiddenExpected": "tests/test_billing.py",
      "requirements": [
        {
          "kind": "function",
          "value": "project_manifest"
        }
      ]
    },
    "exam": {
      "functionName": "project_manifest",
      "starterCode": "def project_manifest(package, modules):\n    \"\"\"Return src package files, one test file per module and README.md.\"\"\"\n    pass",
      "publicAfterCode": "print(project_manifest(\"claims\", [\"models\", \"service\"]))",
      "publicExpected": "tests/test_service.py",
      "hiddenAfterCode": "print(project_manifest(\"audit\", []))",
      "hiddenExpected": "README.md",
      "requirements": [
        {
          "kind": "function",
          "value": "project_manifest"
        }
      ]
    },
    "quizPurpose": {
      "en": "Give each file one discoverable responsibility.",
      "pt": "Dar a cada arquivo uma responsabilidade identificável."
    },
    "quizBestPractice": {
      "en": "Start from responsibilities and keep the first structure small.",
      "pt": "Começar pelas responsabilidades e manter a primeira estrutura pequena."
    },
    "quizAvoid": {
      "en": "Creating folders with no clear purpose.",
      "pt": "Criar pastas sem propósito claro."
    }
  },
  {
    "id": 29,
    "title": {
      "en": "Virtual environments and dependencies",
      "pt": "Ambientes virtuais e dependências"
    },
    "description": {
      "en": "Isolate project packages and make installations reproducible.",
      "pt": "Isole bibliotecas por projeto e torne instalações reproduzíveis."
    },
    "icon": "📦",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "virtual environments and pip",
      "pt": "ambientes virtuais e pip"
    },
    "why": {
      "en": "Without isolation, one project can break another by upgrading a shared package. Reproducible dependency files let another machine rebuild the same environment.",
      "pt": "Sem isolamento, um projeto pode quebrar outro ao atualizar pacote compartilhado. Arquivos de dependência permitem reconstruir o mesmo ambiente."
    },
    "mentalModel": {
      "en": "A virtual environment is a private toolbox. pip puts tools in that toolbox; requirements records exactly which tools the project expects.",
      "pt": "Um ambiente virtual é uma caixa de ferramentas privada. pip coloca ferramentas nela; requirements registra o que o projeto espera."
    },
    "workflow": {
      "en": "Create .venv, activate it, install only what is required, pin direct dependencies and verify from a clean environment.",
      "pt": "Crie .venv, ative, instale só o necessário, fixe dependências diretas e verifique em ambiente limpo."
    },
    "exampleCode": "packages = [\"requests==2.32\", \"pytest==8.3\", \"requests==2.32\"]\nclean = sorted(set(packages))\nprint(\"\\n\".join(clean))",
    "exampleOutput": {
      "en": "pytest==8.3\nrequests==2.32",
      "pt": "pytest==8.3\nrequests==2.32"
    },
    "professionalCode": "def dependency_plan(packages):\n    normalized = {item.strip().lower() for item in packages if item.strip()}\n    return sorted(normalized)\n\nprint(dependency_plan([\" Requests==2.32 \", \"pytest==8.3\", \"requests==2.32\"]))",
    "commonMistake": {
      "en": "Installing globally and relying on whatever versions happen to exist makes bugs difficult to reproduce.",
      "pt": "Instalar globalmente e depender das versões existentes torna bugs difíceis de reproduzir."
    },
    "bestPractice": {
      "en": "Rebuild the project from an empty environment before calling dependency setup complete.",
      "pt": "Reconstrua o projeto em ambiente vazio antes de considerar dependências prontas."
    },
    "outcomes": {
      "en": [
        "Create and activate .venv",
        "Record deterministic direct dependencies",
        "Diagnose which Python and pip are active"
      ],
      "pt": [
        "Criar e ativar .venv",
        "Registrar dependências diretas determinísticas",
        "Diagnosticar qual Python e pip estão ativos"
      ]
    },
    "practice": {
      "functionName": "dependency_plan",
      "starterCode": "def dependency_plan(packages):\n    \"\"\"Normalize, deduplicate and sort package specifications.\"\"\"\n    pass",
      "publicAfterCode": "print(dependency_plan([\"requests==2.32\", \"pytest==8.3\", \"requests==2.32\"]))",
      "publicExpected": "['pytest==8.3', 'requests==2.32']",
      "hiddenAfterCode": "print(dependency_plan([\" RUFF==0.6 \", \"mypy==1.11\", \"ruff==0.6\"]))",
      "hiddenExpected": "['mypy==1.11', 'ruff==0.6']"
    },
    "exam": {
      "functionName": "dependency_plan",
      "starterCode": "def dependency_plan(packages):\n    \"\"\"Return normalized unique non-empty package specs.\"\"\"\n    pass",
      "publicAfterCode": "print(dependency_plan([\"requests==2.32\", \"\", \"pytest==8.3\"]))",
      "publicExpected": "['pytest==8.3', 'requests==2.32']",
      "hiddenAfterCode": "print(dependency_plan([\"A==1\", \" a==1 \", \"B==2\"]))",
      "hiddenExpected": "['a==1', 'b==2']"
    },
    "quizPurpose": {
      "en": "Keep each project dependency set isolated and reproducible.",
      "pt": "Manter dependências de cada projeto isoladas e reproduzíveis."
    },
    "quizBestPractice": {
      "en": "Use python -m pip inside an activated environment and verify a clean install.",
      "pt": "Usar python -m pip no ambiente ativado e validar instalação limpa."
    },
    "quizAvoid": {
      "en": "Using global packages as undocumented dependencies.",
      "pt": "Usar pacotes globais como dependências não documentadas."
    }
  },
  {
    "id": 30,
    "title": {
      "en": "Modules and imports",
      "pt": "Módulos e imports"
    },
    "description": {
      "en": "Split behavior into importable modules without circular dependencies or hidden side effects.",
      "pt": "Divida comportamento em módulos importáveis sem dependências circulares ou efeitos ocultos."
    },
    "icon": "🧩",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "modules and imports",
      "pt": "módulos e imports"
    },
    "why": {
      "en": "Modules create boundaries. They let tests import business logic without running the user interface and let teams change one area with less risk.",
      "pt": "Módulos criam fronteiras. Testes importam regras sem executar interface e equipes alteram uma área com menos risco."
    },
    "mentalModel": {
      "en": "Importing is connecting named components. A module should expose a small public surface and avoid doing expensive work merely because it was imported.",
      "pt": "Importar é conectar componentes nomeados. Um módulo deve expor superfície pequena e evitar trabalho caro só por ser importado."
    },
    "workflow": {
      "en": "Move pure rules first, import explicit names, keep direction one-way and run the module both directly and through tests.",
      "pt": "Mova regras puras primeiro, importe nomes explícitos, mantenha direção única e execute módulo direto e pelos testes."
    },
    "exampleCode": "from math import ceil\n\ndef boxes_needed(items, capacity):\n    return ceil(items / capacity)\n\nprint(boxes_needed(23, 10))",
    "exampleOutput": {
      "en": "3",
      "pt": "3"
    },
    "professionalCode": "def public_api(module, names):\n    clean = sorted({name for name in names if not name.startswith(\"_\")})\n    return [f\"from {module} import {name}\" for name in clean]\n\nprint(public_api(\"billing.service\", [\"total\", \"_cache\", \"invoice\"]))",
    "commonMistake": {
      "en": "Using from module import * hides where names came from and increases collisions. Circular imports usually reveal confused responsibility boundaries.",
      "pt": "Usar import * esconde a origem dos nomes e aumenta colisões. Imports circulares normalmente revelam responsabilidades confusas."
    },
    "bestPractice": {
      "en": "Prefer explicit imports and modules that can be imported without printing, connecting to a database or starting the application.",
      "pt": "Prefira imports explícitos e módulos importáveis sem imprimir, conectar ao banco ou iniciar o app."
    },
    "outcomes": {
      "en": [
        "Create importable business modules",
        "Recognize and prevent circular imports",
        "Design a small public API"
      ],
      "pt": [
        "Criar módulos de negócio importáveis",
        "Reconhecer e evitar imports circulares",
        "Projetar API pública pequena"
      ]
    },
    "practice": {
      "functionName": "public_api",
      "starterCode": "def public_api(module, names):\n    \"\"\"Return explicit import statements for public unique names.\"\"\"\n    pass",
      "publicAfterCode": "print(public_api(\"billing.service\", [\"total\", \"_cache\", \"invoice\"]))",
      "publicExpected": "from billing.service import invoice",
      "hiddenAfterCode": "print(public_api(\"claims\", [\"open_claim\", \"open_claim\", \"_debug\"]))",
      "hiddenExpected": "from claims import open_claim"
    },
    "exam": {
      "functionName": "public_api",
      "starterCode": "def public_api(module, names):\n    \"\"\"Ignore private names, deduplicate, sort, and build imports.\"\"\"\n    pass",
      "publicAfterCode": "print(public_api(\"billing\", [\"total\", \"invoice\"]))",
      "publicExpected": "from billing import total",
      "hiddenAfterCode": "print(public_api(\"audit.events\", [\"record\", \"_buffer\"]))",
      "hiddenExpected": "from audit.events import record"
    },
    "quizPurpose": {
      "en": "Create explicit, one-directional boundaries between files.",
      "pt": "Criar fronteiras explícitas e unidirecionais entre arquivos."
    },
    "quizBestPractice": {
      "en": "Keep imports explicit and import-time behavior quiet.",
      "pt": "Manter imports explícitos e comportamento de importação silencioso."
    },
    "quizAvoid": {
      "en": "Wildcard imports and circular module dependencies.",
      "pt": "Imports coringa e dependências circulares."
    }
  },
  {
    "id": 31,
    "title": {
      "en": "Packages and src layout",
      "pt": "Pacotes e layout src"
    },
    "description": {
      "en": "Organize related modules into packages and prevent accidental imports from the working directory.",
      "pt": "Organize módulos relacionados em pacotes e evite imports acidentais do diretório atual."
    },
    "icon": "🏗️",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "packages and src layout",
      "pt": "pacotes e layout src"
    },
    "why": {
      "en": "Packages express ownership and provide stable import paths. A src layout exposes missing installation steps instead of silently importing the wrong local file.",
      "pt": "Pacotes expressam propriedade e fornecem caminhos estáveis. O layout src revela falta de instalação em vez de importar arquivo local errado."
    },
    "mentalModel": {
      "en": "A package is a named neighborhood of modules. __init__.py marks the boundary and can expose a deliberate public API.",
      "pt": "Um pacote é um bairro nomeado de módulos. __init__.py marca a fronteira e pode expor uma API pública deliberada."
    },
    "workflow": {
      "en": "Group by domain, keep __init__ lightweight, use absolute imports across domains and relative imports only inside a cohesive package.",
      "pt": "Agrupe por domínio, mantenha __init__ leve, use imports absolutos entre domínios e relativos dentro de pacote coeso."
    },
    "exampleCode": "def package_paths(name, modules):\n    base = f\"src/{name}\"\n    return [f\"{base}/__init__.py\"] + [f\"{base}/{m}.py\" for m in modules]\n\nprint(package_paths(\"claims\", [\"models\", \"service\"]))",
    "exampleOutput": {
      "en": "['src/claims/__init__.py', 'src/claims/models.py', 'src/claims/service.py']",
      "pt": "['src/claims/__init__.py', 'src/claims/models.py', 'src/claims/service.py']"
    },
    "professionalCode": "def package_tree(name, modules):\n    module_paths = [f\"src/{name}/{module}.py\" for module in sorted(set(modules))]\n    test_paths = [f\"tests/test_{module}.py\" for module in sorted(set(modules))]\n    return [f\"src/{name}/__init__.py\", *module_paths, *test_paths]",
    "commonMistake": {
      "en": "Putting substantial logic in __init__.py causes surprising side effects and makes circular imports more likely.",
      "pt": "Colocar lógica grande em __init__.py causa efeitos inesperados e aumenta imports circulares."
    },
    "bestPractice": {
      "en": "Expose only stable names from __init__.py and keep implementation in focused modules.",
      "pt": "Exponha apenas nomes estáveis em __init__.py e mantenha implementação em módulos focados."
    },
    "outcomes": {
      "en": [
        "Build a src package layout",
        "Choose package boundaries by domain",
        "Control the package public surface"
      ],
      "pt": [
        "Construir layout de pacote src",
        "Escolher fronteiras por domínio",
        "Controlar superfície pública do pacote"
      ]
    },
    "practice": {
      "functionName": "package_tree",
      "starterCode": "def package_tree(name, modules):\n    \"\"\"Create package and matching test paths.\"\"\"\n    pass",
      "publicAfterCode": "print(package_tree(\"claims\", [\"service\", \"models\"]))",
      "publicExpected": "src/claims/__init__.py",
      "hiddenAfterCode": "print(package_tree(\"billing\", [\"invoice\"]))",
      "hiddenExpected": "tests/test_invoice.py"
    },
    "exam": {
      "functionName": "package_tree",
      "starterCode": "def package_tree(name, modules):\n    \"\"\"Return deterministic package and test paths without duplicates.\"\"\"\n    pass",
      "publicAfterCode": "print(package_tree(\"claims\", [\"service\", \"service\"]))",
      "publicExpected": "tests/test_service.py",
      "hiddenAfterCode": "print(package_tree(\"audit\", []))",
      "hiddenExpected": "src/audit/__init__.py"
    },
    "quizPurpose": {
      "en": "Create stable import paths around cohesive domains.",
      "pt": "Criar caminhos de importação estáveis em domínios coesos."
    },
    "quizBestPractice": {
      "en": "Keep package initializers small and deterministic.",
      "pt": "Manter inicializadores pequenos e determinísticos."
    },
    "quizAvoid": {
      "en": "Turning __init__.py into a second application entry point.",
      "pt": "Transformar __init__.py em outro ponto de entrada."
    }
  },
  {
    "id": 32,
    "title": {
      "en": "Command-line applications",
      "pt": "Aplicações de linha de comando"
    },
    "description": {
      "en": "Create predictable command interfaces with a main function, arguments and exit behavior.",
      "pt": "Crie interfaces de comando previsíveis com função main, argumentos e comportamento de saída."
    },
    "icon": "⌨️",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "CLI design and the main guard",
      "pt": "design de CLI e main guard"
    },
    "why": {
      "en": "A CLI turns Python logic into a reusable tool for people and automation. A main guard prevents the program from executing when tests import it.",
      "pt": "Uma CLI transforma lógica Python em ferramenta reutilizável para pessoas e automações. O main guard evita execução quando testes importam."
    },
    "mentalModel": {
      "en": "Treat the command line as an API: arguments are inputs, stdout is normal output, stderr is diagnostic output and exit codes communicate success.",
      "pt": "Trate a linha de comando como API: argumentos são entradas, stdout é saída normal, stderr é diagnóstico e códigos comunicam sucesso."
    },
    "workflow": {
      "en": "Put parsing in a thin main function, call pure business functions and return an exit code. Test parsing separately from logic.",
      "pt": "Coloque parsing em main fina, chame funções puras e retorne código de saída. Teste parsing separado da lógica."
    },
    "exampleCode": "def parse_command(args):\n    if not args:\n        return {\"command\": \"help\", \"value\": None}\n    return {\"command\": args[0], \"value\": args[1] if len(args) > 1 else None}\n\nprint(parse_command([\"report\", \"july\"]))",
    "exampleOutput": {
      "en": "{'command': 'report', 'value': 'july'}",
      "pt": "{'command': 'report', 'value': 'july'}"
    },
    "professionalCode": "import sys\n\ndef main(args=None):\n    args = sys.argv[1:] if args is None else args\n    command = parse_command(args)\n    print(command)\n    return 0\n\nif __name__ == \"__main__\":\n    raise SystemExit(main())",
    "commonMistake": {
      "en": "Reading sys.argv throughout business code makes functions hard to test and ties them to one interface.",
      "pt": "Ler sys.argv por todo o código de negócio dificulta testes e prende funções a uma interface."
    },
    "bestPractice": {
      "en": "Parse once at the boundary, validate, then pass ordinary Python values into pure functions.",
      "pt": "Faça parsing uma vez na fronteira, valide e passe valores Python comuns para funções puras."
    },
    "outcomes": {
      "en": [
        "Design a stable command contract",
        "Use a main guard correctly",
        "Separate parsing from business logic"
      ],
      "pt": [
        "Projetar contrato estável de comando",
        "Usar main guard corretamente",
        "Separar parsing das regras"
      ]
    },
    "practice": {
      "functionName": "parse_command",
      "starterCode": "def parse_command(args):\n    \"\"\"Return command and optional value; empty args means help.\"\"\"\n    pass\n\nif __name__ == \"__main__\":\n    print(parse_command([]))",
      "publicAfterCode": "print(parse_command([\"report\", \"july\"]))",
      "publicExpected": "'command': 'report'",
      "hiddenAfterCode": "print(parse_command([]))",
      "hiddenExpected": "'command': 'help'",
      "requirements": [
        {
          "kind": "function",
          "value": "parse_command"
        },
        {
          "kind": "main_guard",
          "value": "__name__"
        }
      ]
    },
    "exam": {
      "functionName": "parse_command",
      "starterCode": "def parse_command(args):\n    \"\"\"Normalize the command to lowercase and preserve one optional value.\"\"\"\n    pass\n\nif __name__ == \"__main__\":\n    print(parse_command([]))",
      "publicAfterCode": "print(parse_command([\"REPORT\", \"july\"]))",
      "publicExpected": "'command': 'report'",
      "hiddenAfterCode": "print(parse_command([\"sync\"]))",
      "hiddenExpected": "'value': None",
      "requirements": [
        {
          "kind": "function",
          "value": "parse_command"
        },
        {
          "kind": "main_guard",
          "value": "__name__"
        }
      ]
    },
    "quizPurpose": {
      "en": "Treat CLI arguments as a versioned public contract.",
      "pt": "Tratar argumentos da CLI como contrato público versionado."
    },
    "quizBestPractice": {
      "en": "Keep main thin and return explicit exit codes.",
      "pt": "Manter main fina e retornar códigos explícitos."
    },
    "quizAvoid": {
      "en": "Mixing argument parsing into every business function.",
      "pt": "Misturar parsing de argumentos em todas as funções."
    }
  },
  {
    "id": 33,
    "title": {
      "en": "Git and change history",
      "pt": "Git e histórico de mudanças"
    },
    "description": {
      "en": "Use small commits and branches to make changes reviewable, reversible and collaborative.",
      "pt": "Use commits pequenos e branches para tornar mudanças revisáveis, reversíveis e colaborativas."
    },
    "icon": "🌿",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "Git workflow",
      "pt": "fluxo Git"
    },
    "why": {
      "en": "Git is not merely backup. It records intent, enables review and gives you a safe way to compare or reverse changes.",
      "pt": "Git não é apenas backup. Ele registra intenção, permite revisão e oferece forma segura de comparar ou reverter mudanças."
    },
    "mentalModel": {
      "en": "A commit is a checkpoint with a reason. The working tree is your desk, staging is the box of changes selected for the checkpoint, and the repository is history.",
      "pt": "Um commit é um checkpoint com motivo. Working tree é a mesa, staging é a caixa de mudanças selecionadas e repositório é o histórico."
    },
    "workflow": {
      "en": "Inspect status, review diff, stage intentionally, run tests, commit one coherent change and push only after the local history is sound.",
      "pt": "Inspecione status, revise diff, selecione intencionalmente, rode testes, faça commit coerente e envie após validar histórico."
    },
    "exampleCode": "states = [\"modified\", \"staged\", \"committed\"]\ncommands = {\"modified\": \"git diff\", \"staged\": \"git diff --staged\", \"committed\": \"git show\"}\nfor state in states:\n    print(state, \"->\", commands[state])",
    "exampleOutput": {
      "en": "modified -> git diff\nstaged -> git diff --staged\ncommitted -> git show",
      "pt": "modified -> git diff\nstaged -> git diff --staged\ncommitted -> git show"
    },
    "professionalCode": "def next_git_command(state):\n    workflow = {\n        \"untracked\": \"git add <file>\",\n        \"modified\": \"git diff\",\n        \"staged\": \"git diff --staged\",\n        \"tested\": \"git commit\",\n        \"committed\": \"git push\",\n    }\n    return workflow.get(state, \"git status\")",
    "commonMistake": {
      "en": "Running git add . and committing without reading the diff can publish secrets, generated files or unrelated work.",
      "pt": "Executar git add . e commitar sem ler diff pode publicar segredos, gerados ou trabalho não relacionado."
    },
    "bestPractice": {
      "en": "Every commit should pass tests and be explainable in one sentence that describes the change, not the activity.",
      "pt": "Cada commit deve passar testes e ser explicável em uma frase que descreve a mudança, não a atividade."
    },
    "outcomes": {
      "en": [
        "Read status and diffs confidently",
        "Create coherent commits",
        "Recover without destroying useful work"
      ],
      "pt": [
        "Ler status e diffs com confiança",
        "Criar commits coerentes",
        "Recuperar sem destruir trabalho útil"
      ]
    },
    "practice": {
      "functionName": "next_git_command",
      "starterCode": "def next_git_command(state):\n    \"\"\"Return the safest next inspection or workflow command.\"\"\"\n    pass",
      "publicAfterCode": "print(next_git_command(\"modified\"))",
      "publicExpected": "git diff",
      "hiddenAfterCode": "print(next_git_command(\"unknown\"))",
      "hiddenExpected": "git status"
    },
    "exam": {
      "functionName": "next_git_command",
      "starterCode": "def next_git_command(state):\n    \"\"\"Map workflow state to the next deliberate Git command.\"\"\"\n    pass",
      "publicAfterCode": "print(next_git_command(\"staged\"))",
      "publicExpected": "git diff --staged",
      "hiddenAfterCode": "print(next_git_command(\"committed\"))",
      "hiddenExpected": "git push"
    },
    "quizPurpose": {
      "en": "Make changes reviewable and reversible through coherent history.",
      "pt": "Tornar mudanças revisáveis e reversíveis com histórico coerente."
    },
    "quizBestPractice": {
      "en": "Review the exact diff before every commit.",
      "pt": "Revisar o diff exato antes de cada commit."
    },
    "quizAvoid": {
      "en": "Blindly staging every file and committing unrelated changes.",
      "pt": "Selecionar tudo cegamente e commitar mudanças não relacionadas."
    }
  },
  {
    "id": 34,
    "title": {
      "en": "Automated tests with pytest",
      "pt": "Testes automatizados com pytest"
    },
    "description": {
      "en": "Turn requirements and edge cases into repeatable evidence.",
      "pt": "Transforme requisitos e casos extremos em evidência repetível."
    },
    "icon": "🧪",
    "libraries": [
      "pytest"
    ],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "automated testing",
      "pt": "testes automatizados"
    },
    "why": {
      "en": "Tests reduce fear by detecting changed behavior quickly. They are executable examples of what the system promises.",
      "pt": "Testes reduzem medo ao detectar comportamento alterado rapidamente. São exemplos executáveis do que o sistema promete."
    },
    "mentalModel": {
      "en": "A test arranges data, acts on one behavior and asserts the observable result. A useful suite checks normal, boundary and failure cases.",
      "pt": "Um teste prepara dados, executa um comportamento e afirma o resultado observável. Uma suíte útil testa normal, limite e falha."
    },
    "workflow": {
      "en": "Write a failing test for the requirement, implement the smallest correct behavior, refactor while green and keep tests deterministic.",
      "pt": "Escreva teste falhando para o requisito, implemente o mínimo correto, refatore com testes verdes e mantenha determinismo."
    },
    "exampleCode": "def calculate_fee(amount):\n    return round(amount * 0.02, 2)\n\ncases = [(100, 2.0), (0, 0.0), (55.5, 1.11)]\nfor value, expected in cases:\n    print(calculate_fee(value) == expected)",
    "exampleOutput": {
      "en": "True\nTrue\nTrue",
      "pt": "True\nTrue\nTrue"
    },
    "professionalCode": "def evaluate_cases(function, cases):\n    return [\"PASS\" if function(value) == expected else \"FAIL\" for value, expected in cases]\n\nprint(evaluate_cases(calculate_fee, [(100, 2.0), (50, 1.0)]))",
    "commonMistake": {
      "en": "Tests that depend on time, network order or shared state fail unpredictably and train teams to ignore red builds.",
      "pt": "Testes dependentes de hora, ordem de rede ou estado compartilhado falham imprevisivelmente e fazem equipes ignorarem falhas."
    },
    "bestPractice": {
      "en": "Test public behavior, give failures clear messages and keep each test independent.",
      "pt": "Teste comportamento público, dê mensagens claras e mantenha cada teste independente."
    },
    "outcomes": {
      "en": [
        "Write arrange-act-assert tests",
        "Cover boundaries and failures",
        "Use fixtures and parametrization appropriately"
      ],
      "pt": [
        "Escrever testes arrange-act-assert",
        "Cobrir limites e falhas",
        "Usar fixtures e parametrização adequadamente"
      ]
    },
    "practice": {
      "functionName": "evaluate_cases",
      "starterCode": "def evaluate_cases(function, cases):\n    \"\"\"Return PASS or FAIL for each (input, expected) case.\"\"\"\n    pass",
      "publicAfterCode": "print(evaluate_cases(lambda x: x * 2, [(2, 4), (3, 6)]))",
      "publicExpected": "['PASS', 'PASS']",
      "hiddenAfterCode": "print(evaluate_cases(lambda x: x + 1, [(0, 1), (4, 9)]))",
      "hiddenExpected": "['PASS', 'FAIL']"
    },
    "exam": {
      "functionName": "evaluate_cases",
      "starterCode": "def evaluate_cases(function, cases):\n    \"\"\"Evaluate all independent cases without stopping at first failure.\"\"\"\n    pass",
      "publicAfterCode": "print(evaluate_cases(str.upper, [(\"a\", \"A\"), (\"b\", \"B\")]))",
      "publicExpected": "['PASS', 'PASS']",
      "hiddenAfterCode": "print(evaluate_cases(abs, [(-2, 2), (-3, 4)]))",
      "hiddenExpected": "['PASS', 'FAIL']"
    },
    "quizPurpose": {
      "en": "Convert requirements into deterministic, repeatable checks.",
      "pt": "Converter requisitos em verificações determinísticas e repetíveis."
    },
    "quizBestPractice": {
      "en": "Test behavior and edge cases before refactoring.",
      "pt": "Testar comportamento e limites antes de refatorar."
    },
    "quizAvoid": {
      "en": "Writing tests that share hidden mutable state.",
      "pt": "Escrever testes que compartilham estado mutável oculto."
    }
  },
  {
    "id": 35,
    "title": {
      "en": "Debugging and tracebacks",
      "pt": "Depuração e tracebacks"
    },
    "description": {
      "en": "Investigate failures systematically instead of guessing.",
      "pt": "Investigue falhas sistematicamente em vez de adivinhar."
    },
    "icon": "🔎",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "concept": {
      "en": "debugging and tracebacks",
      "pt": "depuração e tracebacks"
    },
    "why": {
      "en": "A traceback is a map of the call path and the exact failure. Reading it from the final exception upward is faster than random edits.",
      "pt": "Um traceback é mapa do caminho de chamadas e da falha exata. Ler da exceção final para cima é mais rápido que editar ao acaso."
    },
    "mentalModel": {
      "en": "Debugging is hypothesis testing: reproduce, isolate, inspect state, explain the cause, make the smallest repair and add a regression test.",
      "pt": "Depuração é teste de hipótese: reproduza, isole, inspecione estado, explique causa, faça menor correção e adicione teste."
    },
    "workflow": {
      "en": "Capture the smallest failing input, read exception type and line, inspect values at boundaries and verify the fix against the original failure.",
      "pt": "Capture a menor entrada que falha, leia tipo e linha, inspecione valores nas fronteiras e valide a correção contra a falha original."
    },
    "exampleCode": "def safe_ratio(total, count):\n    if count == 0:\n        return 0.0\n    return total / count\n\nprint(safe_ratio(10, 2))\nprint(safe_ratio(10, 0))",
    "exampleOutput": {
      "en": "5.0\n0.0",
      "pt": "5.0\n0.0"
    },
    "professionalCode": "def diagnose(error_type):\n    clues = {\"TypeError\": \"inspect types\", \"KeyError\": \"inspect available keys\", \"ZeroDivisionError\": \"validate denominator\"}\n    return clues.get(error_type, \"minimize the failing case\")\n\nprint(diagnose(\"KeyError\"))",
    "commonMistake": {
      "en": "Catching Exception around an entire program and printing \"something failed\" removes the evidence needed to diagnose the real cause.",
      "pt": "Capturar Exception no programa inteiro e imprimir \"algo falhou\" remove evidência para diagnosticar a causa."
    },
    "bestPractice": {
      "en": "Catch only errors you can handle, preserve context and add a test reproducing every important bug.",
      "pt": "Capture apenas erros tratáveis, preserve contexto e adicione teste para cada bug importante."
    },
    "outcomes": {
      "en": [
        "Read tracebacks from exception to caller",
        "Build and test debugging hypotheses",
        "Create regression tests for repaired bugs"
      ],
      "pt": [
        "Ler tracebacks da exceção ao chamador",
        "Criar e testar hipóteses",
        "Criar testes de regressão para bugs corrigidos"
      ]
    },
    "practice": {
      "functionName": "safe_ratio",
      "starterCode": "def safe_ratio(total, count):\n    \"\"\"Return total/count, using 0.0 when count is zero.\"\"\"\n    pass",
      "publicAfterCode": "print(safe_ratio(10, 2))",
      "publicExpected": "5.0",
      "hiddenAfterCode": "print(safe_ratio(7, 0))",
      "hiddenExpected": "0.0"
    },
    "exam": {
      "functionName": "safe_ratio",
      "starterCode": "def safe_ratio(total, count):\n    \"\"\"Validate numeric inputs and avoid division by zero.\"\"\"\n    pass",
      "publicAfterCode": "print(safe_ratio(9, 3))",
      "publicExpected": "3.0",
      "hiddenAfterCode": "print(safe_ratio(0, 0))",
      "hiddenExpected": "0.0"
    },
    "quizPurpose": {
      "en": "Find root causes through evidence and controlled experiments.",
      "pt": "Encontrar causas raiz por evidência e experimentos controlados."
    },
    "quizBestPractice": {
      "en": "Reproduce first and preserve traceback context.",
      "pt": "Reproduzir primeiro e preservar contexto do traceback."
    },
    "quizAvoid": {
      "en": "Hiding every exception with a broad catch.",
      "pt": "Esconder toda exceção com captura ampla."
    }
  },
  {
    "id": 36,
    "title": {
      "en": "Logging and configuration",
      "pt": "Logging e configuração"
    },
    "description": {
      "en": "Produce useful operational evidence without mixing settings or secrets into code.",
      "pt": "Produza evidência operacional útil sem misturar configurações ou segredos no código."
    },
    "icon": "📋",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "concept": {
      "en": "logging and configuration",
      "pt": "logging e configuração"
    },
    "why": {
      "en": "Applications need a durable explanation of what happened. Structured logs make failures searchable, while external configuration lets the same code run safely in different environments.",
      "pt": "Aplicações precisam explicar o que aconteceu. Logs estruturados tornam falhas pesquisáveis e configuração externa permite rodar o mesmo código em ambientes diferentes."
    },
    "mentalModel": {
      "en": "A log event is a fact with level, message and context. Configuration is input to the application, not a constant scattered through business rules.",
      "pt": "Evento de log é um fato com nível, mensagem e contexto. Configuração é entrada do app, não constante espalhada pelas regras."
    },
    "workflow": {
      "en": "Choose levels consistently, include identifiers rather than personal data, load configuration once, validate it and never log secrets.",
      "pt": "Escolha níveis consistentemente, inclua identificadores em vez de dados pessoais, carregue configuração uma vez, valide e nunca registre segredos."
    },
    "exampleCode": "def log_event(level, message, context=None):\n    context = context or {}\n    fields = \" \".join(f\"{key}={context[key]}\" for key in sorted(context))\n    return f\"{level.upper()} | {message}\" + (f\" | {fields}\" if fields else \"\")\n\nprint(log_event(\"info\", \"claim saved\", {\"claim_id\": 42}))",
    "exampleOutput": {
      "en": "INFO | claim saved | claim_id=42",
      "pt": "INFO | claim saved | claim_id=42"
    },
    "professionalCode": "import os\n\ndef load_settings(env):\n    mode = env.get(\"APP_ENV\", \"development\")\n    debug = env.get(\"DEBUG\", \"false\").lower() == \"true\"\n    return {\"mode\": mode, \"debug\": debug}\n\nprint(load_settings({\"APP_ENV\": \"test\", \"DEBUG\": \"true\"}))",
    "commonMistake": {
      "en": "Logging passwords, tokens or full personal records creates a security incident and often violates privacy obligations.",
      "pt": "Registrar senhas, tokens ou registros pessoais completos cria incidente de segurança e pode violar privacidade."
    },
    "bestPractice": {
      "en": "Log enough context to correlate an event, but redact secrets and keep messages stable for searching.",
      "pt": "Registre contexto para correlacionar evento, mas oculte segredos e mantenha mensagens estáveis para busca."
    },
    "outcomes": {
      "en": [
        "Choose useful log levels",
        "Create structured contextual events",
        "Load and validate environment configuration"
      ],
      "pt": [
        "Escolher níveis úteis de log",
        "Criar eventos estruturados com contexto",
        "Carregar e validar configuração de ambiente"
      ]
    },
    "practice": {
      "functionName": "log_event",
      "starterCode": "def log_event(level, message, context=None):\n    \"\"\"Return a stable structured log line with sorted context keys.\"\"\"\n    pass",
      "publicAfterCode": "print(log_event(\"info\", \"saved\", {\"id\": 7}))",
      "publicExpected": "INFO | saved | id=7",
      "hiddenAfterCode": "print(log_event(\"warning\", \"slow\", {\"ms\": 950, \"job\": \"sync\"}))",
      "hiddenExpected": "job=sync ms=950"
    },
    "exam": {
      "functionName": "log_event",
      "starterCode": "def log_event(level, message, context=None):\n    \"\"\"Uppercase level and omit the context separator when empty.\"\"\"\n    pass",
      "publicAfterCode": "print(log_event(\"error\", \"failed\"))",
      "publicExpected": "ERROR | failed",
      "hiddenAfterCode": "print(log_event(\"info\", \"ok\", {\"b\": 2, \"a\": 1}))",
      "hiddenExpected": "a=1 b=2"
    },
    "quizPurpose": {
      "en": "Create searchable operational evidence without exposing secrets.",
      "pt": "Criar evidência operacional pesquisável sem expor segredos."
    },
    "quizBestPractice": {
      "en": "Use stable messages and structured non-sensitive context.",
      "pt": "Usar mensagens estáveis e contexto estruturado não sensível."
    },
    "quizAvoid": {
      "en": "Printing secrets or relying on print as production logging.",
      "pt": "Imprimir segredos ou usar print como logging de produção."
    }
  },
  {
    "id": 37,
    "title": {
      "en": "Type hints and dataclasses",
      "pt": "Type hints e dataclasses"
    },
    "description": {
      "en": "Make data contracts visible and model records with less repetitive code.",
      "pt": "Torne contratos visíveis e modele registros com menos repetição."
    },
    "icon": "🏷️",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "type hints and dataclasses",
      "pt": "type hints e dataclasses"
    },
    "why": {
      "en": "Type hints let editors and reviewers detect mismatched assumptions before runtime. Dataclasses make value-oriented records explicit without hiding business behavior.",
      "pt": "Tipos permitem detectar suposições incompatíveis antes da execução. Dataclasses tornam registros de valor explícitos sem esconder comportamento."
    },
    "mentalModel": {
      "en": "A type hint is a promise for tools and humans, not a runtime cage. A dataclass describes fields, defaults and value semantics.",
      "pt": "Um type hint é promessa para ferramentas e pessoas, não uma prisão em runtime. Dataclass descreve campos, padrões e semântica de valor."
    },
    "workflow": {
      "en": "Type public boundaries first, use precise collections, model cohesive records with dataclasses and validate invariants at construction or service boundaries.",
      "pt": "Tipe fronteiras públicas primeiro, use coleções precisas, modele registros coesos com dataclasses e valide invariantes na construção ou serviços."
    },
    "exampleCode": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Transaction:\n    amount: float\n    kind: str\n\nitems = [Transaction(100, \"income\"), Transaction(40, \"expense\")]\nprint(items[0])",
    "exampleOutput": {
      "en": "Transaction(amount=100, kind='income')",
      "pt": "Transaction(amount=100, kind='income')"
    },
    "professionalCode": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Transaction:\n    amount: float\n    kind: str\n\ndef net_total(items: list[Transaction]) -> float:\n    return sum(item.amount if item.kind == \"income\" else -item.amount for item in items)",
    "commonMistake": {
      "en": "Adding Any everywhere silences tools without clarifying the contract. A dataclass with unrelated fields is still a poor model.",
      "pt": "Adicionar Any em tudo silencia ferramentas sem esclarecer contrato. Dataclass com campos não relacionados continua sendo modelo ruim."
    },
    "bestPractice": {
      "en": "Use types to express meaningful constraints and keep runtime validation where untrusted data enters.",
      "pt": "Use tipos para expressar restrições e mantenha validação runtime onde dados não confiáveis entram."
    },
    "outcomes": {
      "en": [
        "Write useful function annotations",
        "Model immutable records with dataclasses",
        "Distinguish static hints from runtime validation"
      ],
      "pt": [
        "Escrever anotações úteis",
        "Modelar registros imutáveis com dataclasses",
        "Distinguir tipos estáticos de validação runtime"
      ]
    },
    "practice": {
      "functionName": "net_total",
      "starterCode": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Transaction:\n    amount: float\n    kind: str\n\ndef net_total(items: list[Transaction]) -> float:\n    \"\"\"Income adds; expense subtracts.\"\"\"\n    pass",
      "publicAfterCode": "print(net_total([Transaction(100, \"income\"), Transaction(40, \"expense\")]))",
      "publicExpected": "60",
      "hiddenAfterCode": "print(net_total([Transaction(15, \"expense\"), Transaction(5, \"income\")]))",
      "hiddenExpected": "-10",
      "requirements": [
        {
          "kind": "import",
          "value": "dataclasses"
        },
        {
          "kind": "node",
          "value": "ClassDef"
        },
        {
          "kind": "function",
          "value": "net_total"
        }
      ]
    },
    "exam": {
      "functionName": "net_total",
      "starterCode": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Transaction:\n    amount: float\n    kind: str\n\ndef net_total(items: list[Transaction]) -> float:\n    \"\"\"Reject unknown kinds with ValueError.\"\"\"\n    pass",
      "publicAfterCode": "print(net_total([Transaction(50, \"income\"), Transaction(20, \"expense\")]))",
      "publicExpected": "30",
      "hiddenAfterCode": "\ntry:\n    net_total([Transaction(10, \"other\")])\nexcept ValueError:\n    print(\"invalid-kind\")",
      "hiddenExpected": "invalid-kind",
      "requirements": [
        {
          "kind": "import",
          "value": "dataclasses"
        },
        {
          "kind": "node",
          "value": "ClassDef"
        },
        {
          "kind": "function",
          "value": "net_total"
        }
      ]
    },
    "quizPurpose": {
      "en": "Make contracts explicit for tools, reviewers and future changes.",
      "pt": "Tornar contratos explícitos para ferramentas, revisores e mudanças futuras."
    },
    "quizBestPractice": {
      "en": "Type public boundaries and validate untrusted runtime data.",
      "pt": "Tipar fronteiras públicas e validar dados não confiáveis em runtime."
    },
    "quizAvoid": {
      "en": "Using Any or a giant dataclass to avoid modeling decisions.",
      "pt": "Usar Any ou dataclass gigante para evitar decisões de modelagem."
    }
  },
  {
    "id": 38,
    "title": {
      "en": "Object-oriented design and composition",
      "pt": "Design orientado a objetos e composição"
    },
    "description": {
      "en": "Model stateful behavior with focused objects and prefer composition over fragile inheritance.",
      "pt": "Modele comportamento com estado usando objetos focados e prefira composição a herança frágil."
    },
    "icon": "🧱",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 6,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "object-oriented design",
      "pt": "design orientado a objetos"
    },
    "why": {
      "en": "Objects are useful when data and behavior must protect an invariant over time. Composition lets small objects collaborate without inheriting unrelated behavior.",
      "pt": "Objetos são úteis quando dados e comportamento protegem invariantes ao longo do tempo. Composição permite colaboração sem herdar comportamento não relacionado."
    },
    "mentalModel": {
      "en": "A class is a factory and contract for instances. Encapsulation keeps valid state together; composition says one object uses another.",
      "pt": "Classe é fábrica e contrato para instâncias. Encapsulamento mantém estado válido junto; composição diz que um objeto usa outro."
    },
    "workflow": {
      "en": "Identify invariants, give the object focused methods, inject collaborators and choose inheritance only for a genuine substitutable relationship.",
      "pt": "Identifique invariantes, dê métodos focados, injete colaboradores e use herança apenas em relação realmente substituível."
    },
    "exampleCode": "class Wallet:\n    def __init__(self, balance=0):\n        self._balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"amount must be positive\")\n        self._balance += amount\n\n    @property\n    def balance(self):\n        return self._balance\n\nwallet = Wallet(10)\nwallet.deposit(5)\nprint(wallet.balance)",
    "exampleOutput": {
      "en": "15",
      "pt": "15"
    },
    "professionalCode": "class Policy:\n    def __init__(self, number, premium):\n        if premium < 0:\n            raise ValueError(\"premium\")\n        self.number = number\n        self.premium = premium\n\ndef portfolio_total(policies):\n    return sum(policy.premium for policy in policies)",
    "commonMistake": {
      "en": "Creating a class for every noun produces ceremony. Deep inheritance makes behavior depend on distant parent classes and becomes hard to reason about.",
      "pt": "Criar classe para todo substantivo produz cerimônia. Herança profunda faz comportamento depender de pais distantes."
    },
    "bestPractice": {
      "en": "Use a class when it protects state or offers a meaningful protocol; otherwise a function or dataclass may be clearer.",
      "pt": "Use classe quando protege estado ou oferece protocolo; caso contrário função ou dataclass pode ser mais clara."
    },
    "outcomes": {
      "en": [
        "Create classes that protect invariants",
        "Use composition between collaborators",
        "Recognize when a function is simpler"
      ],
      "pt": [
        "Criar classes que protegem invariantes",
        "Usar composição entre colaboradores",
        "Reconhecer quando função é mais simples"
      ]
    },
    "practice": {
      "functionName": "portfolio_total",
      "starterCode": "class Policy:\n    def __init__(self, number, premium):\n        self.number = number\n        self.premium = premium\n\ndef portfolio_total(policies):\n    \"\"\"Return the sum of all policy premiums.\"\"\"\n    pass",
      "publicAfterCode": "print(portfolio_total([Policy(\"A\", 100), Policy(\"B\", 50)]))",
      "publicExpected": "150",
      "hiddenAfterCode": "print(portfolio_total([]))",
      "hiddenExpected": "0",
      "requirements": [
        {
          "kind": "node",
          "value": "ClassDef"
        },
        {
          "kind": "function",
          "value": "portfolio_total"
        }
      ]
    },
    "exam": {
      "functionName": "portfolio_total",
      "starterCode": "class Policy:\n    def __init__(self, number, premium):\n        if premium < 0:\n            raise ValueError(\"premium cannot be negative\")\n        self.number = number\n        self.premium = premium\n\ndef portfolio_total(policies):\n    pass",
      "publicAfterCode": "print(portfolio_total([Policy(\"A\", 125.5), Policy(\"B\", 24.5)]))",
      "publicExpected": "150.0",
      "hiddenAfterCode": "\ntry:\n    Policy(\"X\", -1)\nexcept ValueError:\n    print(\"invalid-premium\")",
      "hiddenExpected": "invalid-premium",
      "requirements": [
        {
          "kind": "node",
          "value": "ClassDef"
        },
        {
          "kind": "function",
          "value": "portfolio_total"
        }
      ]
    },
    "quizPurpose": {
      "en": "Protect meaningful state and collaboration boundaries.",
      "pt": "Proteger estado significativo e fronteiras de colaboração."
    },
    "quizBestPractice": {
      "en": "Prefer focused composition and explicit invariants.",
      "pt": "Preferir composição focada e invariantes explícitos."
    },
    "quizAvoid": {
      "en": "Using inheritance merely to reuse a few lines.",
      "pt": "Usar herança apenas para reutilizar poucas linhas."
    }
  },
  {
    "id": 39,
    "title": {
      "en": "Professional Python capstone",
      "pt": "Capstone de Python profissional"
    },
    "description": {
      "en": "Combine project structure, tests, typing, logging and objects into a maintainable financial CLI core.",
      "pt": "Combine estrutura, testes, tipos, logging e objetos no núcleo de uma CLI financeira sustentável."
    },
    "icon": "🏆",
    "libraries": [],
    "track": "core",
    "stage": "professional",
    "estimatedHours": 12,
    "desktopRequired": false,
    "labPath": "/project-lab",
    "concept": {
      "en": "professional project integration",
      "pt": "integração de projeto profissional"
    },
    "why": {
      "en": "A capstone proves that isolated concepts work together. The goal is not maximum code; it is a system whose rules can be tested and changed safely.",
      "pt": "Capstone comprova que conceitos isolados funcionam juntos. O objetivo não é máximo código; é sistema com regras testáveis e alteráveis com segurança."
    },
    "mentalModel": {
      "en": "Think in boundaries: input adapter, domain model, application service, persistence adapter and tests. Each boundary converts data and protects assumptions.",
      "pt": "Pense em fronteiras: adaptador de entrada, modelo de domínio, serviço, persistência e testes. Cada fronteira converte dados e protege suposições."
    },
    "workflow": {
      "en": "Define the transaction contract, implement pure summary logic, test edge cases, add persistence separately and expose it through a thin CLI.",
      "pt": "Defina contrato de transação, implemente resumo puro, teste limites, adicione persistência separada e exponha por CLI fina."
    },
    "exampleCode": "def monthly_summary(transactions):\n    income = sum(t[\"amount\"] for t in transactions if t[\"kind\"] == \"income\")\n    expense = sum(t[\"amount\"] for t in transactions if t[\"kind\"] == \"expense\")\n    return {\"income\": income, \"expense\": expense, \"balance\": income - expense}\n\nprint(monthly_summary([{\"kind\": \"income\", \"amount\": 100}, {\"kind\": \"expense\", \"amount\": 35}]))",
    "exampleOutput": {
      "en": "{'income': 100, 'expense': 35, 'balance': 65}",
      "pt": "{'income': 100, 'expense': 35, 'balance': 65}"
    },
    "professionalCode": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Transaction:\n    kind: str\n    amount: float\n\ndef monthly_summary(transactions):\n    totals = {\"income\": 0.0, \"expense\": 0.0}\n    for transaction in transactions:\n        if transaction.kind not in totals or transaction.amount < 0:\n            raise ValueError(\"invalid transaction\")\n        totals[transaction.kind] += transaction.amount\n    return {**totals, \"balance\": totals[\"income\"] - totals[\"expense\"]}",
    "commonMistake": {
      "en": "A capstone that only works for the demonstration data is a presentation, not a reliable project. Mixing file I/O into every rule makes tests slow and brittle.",
      "pt": "Capstone que só funciona com dados demonstrados é apresentação, não projeto confiável. Misturar I/O em toda regra torna testes frágeis."
    },
    "bestPractice": {
      "en": "Keep the domain core pure, verify hidden cases and make external effects replaceable at boundaries.",
      "pt": "Mantenha núcleo de domínio puro, verifique casos ocultos e torne efeitos externos substituíveis nas fronteiras."
    },
    "outcomes": {
      "en": [
        "Integrate a multi-file architecture",
        "Test business rules independently",
        "Explain trade-offs and extension points"
      ],
      "pt": [
        "Integrar arquitetura multi-arquivo",
        "Testar regras independentemente",
        "Explicar decisões e pontos de extensão"
      ]
    },
    "practice": {
      "functionName": "monthly_summary",
      "starterCode": "def monthly_summary(transactions):\n    \"\"\"Return income, expense and balance totals.\"\"\"\n    pass",
      "publicAfterCode": "print(monthly_summary([{\"kind\": \"income\", \"amount\": 100}, {\"kind\": \"expense\", \"amount\": 35}]))",
      "publicExpected": "'balance': 65",
      "hiddenAfterCode": "print(monthly_summary([]))",
      "hiddenExpected": "'balance': 0",
      "requirements": [
        {
          "kind": "function",
          "value": "monthly_summary"
        }
      ]
    },
    "exam": {
      "functionName": "monthly_summary",
      "starterCode": "def monthly_summary(transactions):\n    \"\"\"Validate kind and non-negative amount, then return totals.\"\"\"\n    pass",
      "publicAfterCode": "print(monthly_summary([{\"kind\": \"income\", \"amount\": 200}, {\"kind\": \"expense\", \"amount\": 50}]))",
      "publicExpected": "'balance': 150",
      "hiddenAfterCode": "try:\n    monthly_summary([{\"kind\": \"other\", \"amount\": 10}])\nexcept ValueError:\n    print(\"invalid-transaction\")",
      "hiddenExpected": "invalid-transaction",
      "requirements": [
        {
          "kind": "function",
          "value": "monthly_summary"
        },
        {
          "kind": "node",
          "value": "Raise"
        }
      ]
    },
    "quizPurpose": {
      "en": "Prove maintainability by integrating structure, contracts and tests.",
      "pt": "Comprovar sustentabilidade integrando estrutura, contratos e testes."
    },
    "quizBestPractice": {
      "en": "Keep domain logic pure and effects at replaceable boundaries.",
      "pt": "Manter regras puras e efeitos em fronteiras substituíveis."
    },
    "quizAvoid": {
      "en": "Building a demo that cannot survive different data.",
      "pt": "Construir demonstração que não suporta dados diferentes."
    }
  }
]

export const PROFESSIONAL_PHASES = createConceptPhases(specs)

export const phase28 = PROFESSIONAL_PHASES[0]
export const phase29 = PROFESSIONAL_PHASES[1]
export const phase30 = PROFESSIONAL_PHASES[2]
export const phase31 = PROFESSIONAL_PHASES[3]
export const phase32 = PROFESSIONAL_PHASES[4]
export const phase33 = PROFESSIONAL_PHASES[5]
export const phase34 = PROFESSIONAL_PHASES[6]
export const phase35 = PROFESSIONAL_PHASES[7]
export const phase36 = PROFESSIONAL_PHASES[8]
export const phase37 = PROFESSIONAL_PHASES[9]
export const phase38 = PROFESSIONAL_PHASES[10]
export const phase39 = PROFESSIONAL_PHASES[11]
