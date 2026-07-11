// ============================================================================
// HASHTAG PYTHON — PHASE 1: Variables & Data Types
// Real-world: Insurance Adjuster System
// ============================================================================

export const ALL_PHASES = [
  {
    id: 1,
    title: {
      en: 'Variables & Data Types',
      pt: 'Variáveis e Tipos de Dados',
    },
    description: {
      en: 'Learn variables using real insurance claim calculations',
      pt: 'Aprenda variáveis com cálculos reais de sinistros',
    },
    category: 'Basics',
    duration: 45,

    lesson: {
      title: {
        en: 'Insurance Claim Variables',
        pt: 'Variáveis em Sinistros',
      },
      content: {
        en: `
REAL-WORLD SCENARIO: Insurance Adjuster System

You are processing a property damage claim:
- Claim amount: R$ 5,230.50
- Deductible: R$ 250.00
- Coverage limit: R$ 10,000.00

VARIABLES YOU'LL CREATE:

claim_amount = 5230.50      # Float: decimal number
deductible = 250.00         # Float: insurance deductible
coverage_limit = 10000.00   # Float: maximum payout

CALCULATIONS:

actual_payout = claim_amount - deductible    # = 4980.50
is_valid = actual_payout > 0                 # = True (boolean)
percentage_of_limit = (actual_payout / coverage_limit) * 100  # = 49.8%

TYPE CONVERSION:

claim_str = "5230.50"           # String from form
claim_float = float(claim_str)  # Convert to number
claim_int = int(claim_float)    # Convert to whole number = 5230

KEY CONCEPTS:

- Variables: containers that store data
- Data types: int (whole numbers), float (decimals), str (text), bool (True/False)
- Type conversion: changing one type to another
- Operators: + - * / (math), = (assignment), > < == (comparison)
`,
        pt: `
CENÁRIO REAL: Sistema de Ajustador de Seguros

Você está processando uma reclamação de dano à propriedade:
- Valor do sinistro: R$ 5.230,50
- Franquia: R$ 250,00
- Limite de cobertura: R$ 10.000,00

VARIÁVEIS QUE VOCÊ VAI CRIAR:

valor_sinistro = 5230.50       # Float: número decimal
franquia = 250.00              # Float: franquia do seguro
limite_cobertura = 10000.00    # Float: pagamento máximo

CÁLCULOS:

pagamento_efetivo = valor_sinistro - franquia    # = 4980.50
eh_valido = pagamento_efetivo > 0                # = Verdadeiro (boolean)
percentual_limite = (pagamento_efetivo / limite_cobertura) * 100  # = 49.8%

CONVERSÃO DE TIPOS:

valor_str = "5230.50"          # String do formulário
valor_float = float(valor_str)  # Converter para número
valor_int = int(valor_float)    # Converter para inteiro = 5230

CONCEITOS PRINCIPAIS:

- Variáveis: contêineres que armazenam dados
- Tipos de dados: int (inteiros), float (decimais), str (texto), bool (V/F)
- Conversão de tipos: transformar um tipo em outro
- Operadores: + - * / (matemática), = (atribuição), > < == (comparação)
`,
      },
    },

    exercises: [
      {
        id: 'ex1_1',
        title: {
          en: 'Create Insurance Variables',
          pt: 'Criar Variáveis de Seguro',
        },
        description: {
          en: 'Create variables for a claim',
          pt: 'Crie variáveis para um sinistro',
        },
        steps: [
          {
            order: 1,
            instruction: {
              en: 'Create variable: claim_amount = 3500',
              pt: 'Crie variável: claim_amount = 3500',
            },
          },
          {
            order: 2,
            instruction: {
              en: 'Create variable: deductible = 300',
              pt: 'Crie variável: deductible = 300',
            },
          },
          {
            order: 3,
            instruction: {
              en: 'Create variable: customer_name = "João Silva"',
              pt: 'Crie variável: customer_name = "João Silva"',
            },
          },
          {
            order: 4,
            instruction: {
              en: 'Calculate: payout = claim_amount - deductible',
              pt: 'Calcule: payout = claim_amount - deductible',
            },
          },
          {
            order: 5,
            instruction: {
              en: 'Print all: print(claim_amount, deductible, customer_name, payout)',
              pt: 'Exiba todos: print(claim_amount, deductible, customer_name, payout)',
            },
          },
        ],
        starterCode: `# Insurance Claim Variables
claim_amount = 
deductible = 
customer_name = 

payout = 

print()`,
        expectedOutput: `3500
300
João Silva
3200`,
        points: 25,
      },
      {
        id: 'ex1_2',
        title: {
          en: 'Type Conversion',
          pt: 'Conversão de Tipos',
        },
        description: {
          en: 'Convert string to number',
          pt: 'Converta texto para número',
        },
        steps: [
          {
            order: 1,
            instruction: {
              en: 'Create: claim_str = "2850.75"',
              pt: 'Crie: claim_str = "2850.75"',
            },
          },
          {
            order: 2,
            instruction: {
              en: 'Convert to float: claim_brl = float(claim_str)',
              pt: 'Converta para float: claim_brl = float(claim_str)',
            },
          },
          {
            order: 3,
            instruction: {
              en: 'Convert to USD: claim_usd = claim_brl / 5.15',
              pt: 'Converta para USD: claim_usd = claim_brl / 5.15',
            },
          },
          {
            order: 4,
            instruction: {
              en: 'Print both values with 2 decimals',
              pt: 'Exiba ambos com 2 casas decimais',
            },
          },
          {
            order: 5,
            instruction: {
              en: 'Use format: print(f"{claim_brl:.2f}")',
              pt: 'Use format: print(f"{claim_brl:.2f}")',
            },
          },
        ],
        starterCode: `# Type Conversion
claim_str = "2850.75"

claim_brl = 

claim_usd = 

print()`,
        expectedOutput: `2850.75
553.40`,
        points: 25,
      },
    ],

    quiz: {
      questions: [
        {
          id: 'q1_1',
          question: {
            en: 'What type is 5230.50?',
            pt: 'Qual é o tipo de 5230.50?',
          },
          options: {
            en: ['String', 'Integer', 'Float', 'Boolean'],
            pt: ['Texto', 'Inteiro', 'Decimal', 'Booleano'],
          },
          correct: 2,
          explanation: {
            en: 'Numbers with decimals are float type',
            pt: 'Números com casas decimais são do tipo float',
          },
        },
        {
          id: 'q1_2',
          question: {
            en: 'If claim = 1000 and deductible = 250, payout = ?',
            pt: 'Se sinistro = 1000 e franquia = 250, pagamento = ?',
          },
          options: {
            en: ['1250', '750', '250', '1000'],
            pt: ['1250', '750', '250', '1000'],
          },
          correct: 1,
          explanation: {
            en: 'payout = 1000 - 250 = 750',
            pt: 'pagamento = 1000 - 250 = 750',
          },
        },
      ],
    },

    exam: {
      testCases: [
        {
          id: 'tc1_1',
          description: {
            en: 'Create claim_amount variable',
            pt: 'Criar variável claim_amount',
          },
          inputs: [],
          checks: [{ type: 'variable_exists', value: 'claim_amount' }],
          points: 10,
        },
        {
          id: 'tc1_2',
          description: {
            en: 'Create deductible variable',
            pt: 'Criar variável deductible',
          },
          inputs: [],
          checks: [{ type: 'variable_exists', value: 'deductible' }],
          points: 10,
        },
        {
          id: 'tc1_3',
          description: {
            en: 'Calculate payout correctly',
            pt: 'Calcular pagamento correto',
          },
          inputs: [],
          checks: [{ type: 'variable_exists', value: 'payout' }],
          points: 10,
        },
        {
          id: 'tc1_4',
          description: {
            en: 'No syntax errors',
            pt: 'Sem erros de sintaxe',
          },
          inputs: [],
          checks: [{ type: 'no_error', value: '' }],
          points: 10,
        },
        {
          id: 'tc1_5',
          description: {
            en: 'Output shows results',
            pt: 'Saída exibe resultados',
          },
          inputs: [],
          checks: [{ type: 'contains_any', value: ['claim_amount', 'payout'] }],
          points: 10,
        },
      ],
    },
  },
];
