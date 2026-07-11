// ============================================================================
// HASHTAG PYTHON — PHASES 1-8
// Real-world scenarios: Insurance & Construction
// ============================================================================

export const ALL_PHASES = [
  {
    id: 1,
    title: { en: 'Variables & Data Types', pt: 'Variáveis e Tipos de Dados' },
    description: {
      en: 'Learn variables using real insurance claim calculations',
      pt: 'Aprenda variáveis com cálculos reais de sinistros'
    },
    category: 'Basics',
    duration: 45,

    lesson: {
      title: { en: 'Insurance Claim Variables', pt: 'Variáveis em Sinistros' },
      content: {
        en: 'Real-World: Insurance Adjuster System\n\nYou process a property damage claim:\n- Claim amount: R\$ 5.230,50\n- Deductible: R\$ 250,00\n- Coverage limit: R\$ 10.000,00\n\nVariables:\nclaim_amount = 5230.50\ndeductible = 250.00\ncoverage_limit = 10000.00\n\nCalculations:\nactual_payout = claim_amount - deductible  # R\$ 4.980,50\nis_valid = actual_payout > 0  # True\npercentage = (actual_payout / coverage_limit) * 100  # 49.8%',
        pt: 'Cenário Real: Sistema de Ajustador de Seguros\n\nVocê processa uma reclamação de dano à propriedade:\n- Valor do sinistro: R\$ 5.230,50\n- Franquia: R\$ 250,00\n- Limite de cobertura: R\$ 10.000,00\n\nVariáveis:\nvalor_sinistro = 5230.50\nfranquia = 250.00\nlimite_cobertura = 10000.00\n\nCálculos:\npagamento_efetivo = valor_sinistro - franquia  # R\$ 4.980,50\neh_valido = pagamento_efetivo > 0  # Verdadeiro\npercentual = (pagamento_efetivo / limite_cobertura) * 100  # 49.8%'
      }
    },

    exercises: [
      {
        id: 'ex1_1',
        title: { en: 'Create Insurance Variables', pt: 'Criar Variáveis' },
        description: { en: 'Create variables for a claim', pt: 'Crie variáveis de sinistro' },
        steps: [
          { order: 1, instruction: { en: 'Create claim_amount = 3500', pt: 'Crie claim_amount = 3500' } },
          { order: 2, instruction: { en: 'Create deductible = 300', pt: 'Crie deductible = 300' } },
          { order: 3, instruction: { en: 'Create customer_name = "João Silva"', pt: 'Crie customer_name = "João Silva"' } },
          { order: 4, instruction: { en: 'Calculate payout = claim_amount - deductible', pt: 'Calcule payout' } },
          { order: 5, instruction: { en: 'Print all variables', pt: 'Exiba todas as variáveis' } }
        ],
        starterCode: 'claim_amount = \ndeductible = \ncustomer_name = \npayout = \nprint()',
        expectedOutput: '3500\n300\nJoão Silva\n3200',
        points: 25
      }
    ],

    quiz: { questions: [] },
    exam: { testCases: [] }
  },

  {
    id: 2,
    title: { en: 'Basic Operations & Math', pt: 'Operações Básicas' },
    description: { en: 'Insurance math: deductibles & coverage', pt: 'Matemática de seguros' },
    category: 'Basics',
    duration: 50,
    lesson: {
      title: { en: 'Calculating Payouts', pt: 'Calculando Pagamentos' },
      content: {
        en: 'Claim: R\$ 8.500 | Deductible: R\$ 500 | Coverage: 75%\nStep 1: 8500 - 500 = 8000\nStep 2: 8000 * 0.75 = 6000\nFinal payout: R\$ 6.000',
        pt: 'Sinistro: R\$ 8.500 | Franquia: R\$ 500 | Cobertura: 75%\nPasso 1: 8500 - 500 = 8000\nPasso 2: 8000 * 0,75 = 6000\nPagamento final: R\$ 6.000'
      }
    },
    exercises: [],
    quiz: { questions: [] },
    exam: { testCases: [] }
  },

  {
    id: 3,
    title: { en: 'Lists & Collections', pt: 'Listas' },
    description: { en: 'Manage multiple insurance claims', pt: 'Gerenciar múltiplos sinistros' },
    category: 'Intermediate',
    duration: 50,
    lesson: {
      title: { en: 'List of Claims', pt: 'Lista de Sinistros' },
      content: {
        en: 'Store claims in a list: claims = [5230.50, 8500, 1200.75]',
        pt: 'Armazene sinistros: claims = [5230.50, 8500, 1200.75]'
      }
    },
    exercises: [],
    quiz: { questions: [] },
    exam: { testCases: [] }
  },

  {
    id: 4,
    title: { en: 'Loops & Iteration', pt: 'Loops' },
    description: { en: 'Process batches of claims', pt: 'Processar lotes' },
    category: 'Intermediate',
    duration: 50,
    lesson: {
      title: { en: 'Batch Processing', pt: 'Processamento em Lote' },
      content: {
        en: 'Process claims with a loop',
        pt: 'Processe sinistros com um loop'
      }
    },
    exercises: [],
    quiz: { questions: [] },
    exam: { testCases: [] }
  },

  {
    id: 5,
    title: { en: 'Functions & Modularity', pt: 'Funções' },
    description: { en: 'Reusable claim calculations', pt: 'Cálculos reutilizáveis' },
    category: 'Intermediate',
    duration: 50,
    lesson: {
      title: { en: 'Calculation Functions', pt: 'Funções de Cálculo' },
      content: {
        en: 'def calculate_payout(claim, deductible, coverage): return (claim - deductible) * coverage',
        pt: 'def calcular_pagamento(sinistro, franquia, cobertura): return (sinistro - franquia) * cobertura'
      }
    },
    exercises: [],
    quiz: { questions: [] },
    exam: { testCases: [] }
  },

  {
    id: 6,
    title: { en: 'Strings & Formatting', pt: 'Strings' },
    description: { en: 'Generate formatted reports', pt: 'Gerar relatórios' },
    category: 'Intermediate',
    duration: 50,
    lesson: {
      title: { en: 'Report Generation', pt: 'Geração de Relatórios' },
      content: {
        en: 'f-strings: report = f"Payout: R\$ {amount:.2f}"',
        pt: 'f-strings: relatorio = f"Pagamento: R\$ {valor:.2f}"'
      }
    },
    exercises: [],
    quiz: { questions: [] },
    exam: { testCases: [] }
  },

  {
    id: 7,
    title: { en: 'Dictionaries', pt: 'Dicionários' },
    description: { en: 'Structure claim data', pt: 'Estruturar dados' },
    category: 'Advanced',
    duration: 50,
    lesson: {
      title: { en: 'Claim Structure', pt: 'Estrutura' },
      content: {
        en: 'claim = {"id": "CLM-001", "amount": 5230.50, "status": "approved"}',
        pt: 'sinistro = {"id": "SIN-001", "valor": 5230.50, "status": "aprovado"}'
      }
    },
    exercises: [],
    quiz: { questions: [] },
    exam: { testCases: [] }
  },

  {
    id: 8,
    title: { en: 'File I/O', pt: 'Arquivos' },
    description: { en: 'Export claims to CSV', pt: 'Exportar para CSV' },
    category: 'Advanced',
    duration: 50,
    lesson: {
      title: { en: 'Data Export', pt: 'Exportação' },
      content: {
        en: 'with open("claims.csv", "w") as f: f.write(data)',
        pt: 'with open("sinistros.csv", "w") as f: f.write(dados)'
      }
    },
    exercises: [],
    quiz: { questions: [] },
    exam: { testCases: [] }
  }
];
