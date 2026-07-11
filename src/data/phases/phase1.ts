import type { Phase } from '../types'

export const phase1: Phase = {
  id: 1,
  title: { en: 'Variables & Data Types', pt: 'Variáveis e Tipos de Dados' },
  description: {
    en: 'Learn variables and data types using real insurance claim calculations',
    pt: 'Aprenda variáveis e tipos de dados com cálculos reais de sinistros'
  },
  icon: '📦',
  libraries: [],

  lesson: {
    title: { en: 'Insurance Claim Variables', pt: 'Variáveis em Sinistros de Seguro' },
    blocks: [
      {
        type: 'heading',
        content: { en: 'Real Scenario: Insurance Adjuster', pt: 'Cenário Real: Ajustador de Seguros' }
      },
      {
        type: 'text',
        content: {
          en: 'You are processing a property damage claim:\n• Claim amount: R$ 5,230.50\n• Deductible: R$ 250.00\n• Coverage limit: R$ 10,000.00\n\nYour job: calculate the actual payout.',
          pt: 'Você está processando uma reclamação de dano à propriedade:\n• Valor do sinistro: R$ 5.230,50\n• Franquia: R$ 250,00\n• Limite de cobertura: R$ 10.000,00\n\nSeu trabalho: calcular o pagamento efetivo.'
        }
      },
      {
        type: 'code',
        code: `# CLAIM DETAILS (from claim form)
claim_amount = 5230.50      # R$ - damage amount claimed
deductible = 250.00         # R$ - customer pays this
coverage_limit = 10000.00   # R$ - policy maximum

# CALCULATIONS
actual_payout = claim_amount - deductible   # = 4980.50
is_valid = actual_payout > 0                # True/False
pct_of_limit = (actual_payout / coverage_limit) * 100  # 49.8%

print("Payout:", actual_payout)
print("Valid:", is_valid)
print("% of limit:", pct_of_limit)`
      },
      {
        type: 'heading',
        content: { en: 'Data Types in Python', pt: 'Tipos de Dados no Python' }
      },
      {
        type: 'text',
        content: {
          en: '• int — whole numbers: 250, 10000\n• float — decimal numbers: 5230.50, 4980.50\n• str — text: "João Silva", "POL-2026-001"\n• bool — True or False: is_valid = True',
          pt: '• int — números inteiros: 250, 10000\n• float — números decimais: 5230.50, 4980.50\n• str — texto: "João Silva", "APO-2026-001"\n• bool — Verdadeiro ou Falso: eh_valido = True'
        }
      },
      {
        type: 'code',
        code: `# TYPE CONVERSION
claim_str = "5230.50"           # string from web form
claim_float = float(claim_str)  # convert to number
claim_int = int(claim_float)    # convert to integer = 5230

# Type checking
print(type(claim_str))   # <class 'str'>
print(type(claim_float)) # <class 'float'>
print(type(claim_int))   # <class 'int'>`
      },
      {
        type: 'tip',
        content: {
          en: 'Use float() when working with money values — they always have decimals. Use int() only for whole counts like number of claims.',
          pt: 'Use float() quando trabalhar com valores monetários — eles sempre têm decimais. Use int() apenas para contagens inteiras como número de sinistros.'
        }
      }
    ]
  },

  exercises: [
    {
      id: 'ex1_1',
      title: { en: 'Create Claim Variables', pt: 'Criar Variáveis de Sinistro' },
      description: {
        en: '🎯 A water damage claim came in:\n• claim_amount = 3500\n• deductible = 300\n• customer_name = "João Silva"\n\nCreate each variable and calculate payout = claim_amount - deductible. Print all four values.',
        pt: '🎯 Um sinistro de dano por água chegou:\n• claim_amount = 3500\n• deductible = 300\n• customer_name = "João Silva"\n\nCrie cada variável e calcule payout = claim_amount - deductible. Exiba os quatro valores.'
      },
      starterCode: `# Insurance Claim Variables
claim_amount = 
deductible = 
customer_name = 

payout = 

print(claim_amount)
print(deductible)
print(customer_name)
print(payout)`,
      hints: [
        { en: 'Set claim_amount = 3500 (no quotes — it is a number)', pt: 'Defina claim_amount = 3500 (sem aspas — é um número)' },
        { en: 'payout = claim_amount - deductible', pt: 'payout = claim_amount - deductible' }
      ],
      sampleOutput: { en: '3500\n300\nJoão Silva\n3200', pt: '3500\n300\nJoão Silva\n3200' }
    },
    {
      id: 'ex1_2',
      title: { en: 'Type Conversion: Currency', pt: 'Conversão de Tipos: Moeda' },
      description: {
        en: '🎯 The claim amount arrives as a string from the web form.\nConvert it to float, then convert to USD.\n• claim_str = "2850.75"\n• rate = 5.15\n\nPrint both the BRL and USD values.',
        pt: '🎯 O valor do sinistro chega como texto do formulário web.\nConverta para float, depois para USD.\n• claim_str = "2850.75"\n• taxa = 5.15\n\nExiba os valores em BRL e USD.'
      },
      starterCode: `# Type Conversion
claim_str = "2850.75"

# Convert to float
claim_brl = float(claim_str)

# Convert to USD (rate = 5.15)
rate = 5.15
claim_usd = claim_brl / rate

print(claim_brl)
print(round(claim_usd, 2))`,
      hints: [
        { en: 'float("2850.75") converts the string to a decimal number', pt: 'float("2850.75") converte o texto para um número decimal' },
        { en: 'Use round(value, 2) to limit to 2 decimal places', pt: 'Use round(valor, 2) para limitar a 2 casas decimais' }
      ],
      sampleOutput: { en: '2850.75\n553.54', pt: '2850.75\n553.54' }
    }
  ],

  quiz: [
    {
      id: 'q1_1',
      question: { en: 'What data type is 5230.50?', pt: 'Qual é o tipo de dado de 5230.50?' },
      options: [
        { en: 'str (text)', pt: 'str (texto)' },
        { en: 'int (whole number)', pt: 'int (inteiro)' },
        { en: 'float (decimal)', pt: 'float (decimal)' },
        { en: 'bool (True/False)', pt: 'bool (Verdadeiro/Falso)' }
      ],
      correctIndex: 2,
      explanation: {
        en: '5230.50 has a decimal point, so it is a float. Integers have no decimal: 5230.',
        pt: '5230.50 tem ponto decimal, então é float. Inteiros não têm decimal: 5230.'
      }
    },
    {
      id: 'q1_2',
      question: {
        en: 'If claim = 1000 and deductible = 250, what is payout = claim - deductible?',
        pt: 'Se sinistro = 1000 e franquia = 250, quanto é payout = sinistro - franquia?'
      },
      options: [
        { en: '1250', pt: '1250' },
        { en: '750', pt: '750' },
        { en: '250', pt: '250' },
        { en: '1000', pt: '1000' }
      ],
      correctIndex: 1,
      explanation: {
        en: '1000 - 250 = 750. The insurance pays the damage minus the deductible.',
        pt: '1000 - 250 = 750. O seguro paga o dano menos a franquia.'
      }
    },
    {
      id: 'q1_3',
      question: {
        en: 'What does float("3500") do?',
        pt: 'O que float("3500") faz?'
      },
      options: [
        { en: 'Creates text "3500"', pt: 'Cria texto "3500"' },
        { en: 'Converts the string "3500" to the number 3500.0', pt: 'Converte o texto "3500" para o número 3500.0' },
        { en: 'Rounds 3500 to zero', pt: 'Arredonda 3500 para zero' },
        { en: 'Causes an error', pt: 'Causa um erro' }
      ],
      correctIndex: 1,
      explanation: {
        en: 'float() converts a string that looks like a number into an actual floating-point number.',
        pt: 'float() converte um texto que parece um número em um número decimal real.'
      }
    }
  ],

  exam: {
    title: { en: 'Phase 1 Exam: Insurance Variables', pt: 'Exame Fase 1: Variáveis de Seguros' },
    scenario: {
      en: 'A roofing contractor submitted a damage claim. Process it using Python variables and type conversion.',
      pt: 'Um empreiteiro de telhados enviou uma reclamação de dano. Processe-a usando variáveis Python e conversão de tipos.'
    },
    requirements: {
      en: [
        'Create claim_amount = 7500 (the damage amount)',
        'Create deductible = 400 (what the owner pays)',
        'Create coverage_pct = 0.85 (85% coverage)',
        'Calculate net = claim_amount - deductible',
        'Calculate payout = net * coverage_pct',
        'Print the final payout'
      ],
      pt: [
        'Crie claim_amount = 7500 (valor do dano)',
        'Crie deductible = 400 (o que o proprietário paga)',
        'Crie coverage_pct = 0.85 (cobertura de 85%)',
        'Calcule net = claim_amount - deductible',
        'Calcule payout = net * coverage_pct',
        'Exiba o pagamento final'
      ]
    },
    starterCode: `# Roofing Damage Claim
# Follow the requirements step by step

claim_amount = 
deductible = 
coverage_pct = 

net = 
payout = 

print(payout)`,
    testCases: [
      {
        id: 'tc1_1',
        description: { en: 'Output contains the correct payout value', pt: 'Saída contém o valor correto do pagamento' },
        inputs: [],
        checks: [{ type: 'contains_any', value: ['6035', '6035.0'] }],
        points: 20
      },
      {
        id: 'tc1_2',
        description: { en: 'Code runs without errors', pt: 'Código executa sem erros' },
        inputs: [],
        checks: [{ type: 'no_error', value: '' }],
        points: 20
      },
      {
        id: 'tc1_3',
        description: { en: 'claim_amount is assigned', pt: 'claim_amount está definido' },
        inputs: [],
        checks: [{ type: 'contains', value: 'claim_amount' }],
        points: 20
      },
      {
        id: 'tc1_4',
        description: { en: 'deductible is used', pt: 'deductible é usado' },
        inputs: [],
        checks: [{ type: 'contains', value: 'deductible' }],
        points: 20
      },
      {
        id: 'tc1_5',
        description: { en: 'coverage_pct is applied', pt: 'coverage_pct é aplicado' },
        inputs: [],
        checks: [{ type: 'contains', value: 'coverage_pct' }],
        points: 20
      }
    ]
  }
}
