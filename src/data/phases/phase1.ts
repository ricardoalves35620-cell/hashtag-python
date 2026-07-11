// HASHTAG PYTHON - ALL PHASES
export const ALL_PHASES = [
  {
    "id": 1,
    "title": {
      "en": "Variables & Data Types",
      "pt": "Variáveis e Tipos de Dados"
    },
    "description": {
      "en": "Learn variables with insurance claim calculations",
      "pt": "Aprenda variáveis com cálculos reais"
    },
    "category": "Basics",
    "duration": 45,
    "lesson": {
      "title": {
        "en": "Insurance Claim Variables",
        "pt": "Variáveis em Sinistros"
      },
      "content": {
        "en": "Real scenario: Calculate insurance payouts. Claim 5230.50, Deductible 250, Coverage limit 10000. Variables: claim_amount=5230.50, deductible=250, coverage_limit=10000. Calculate: payout = claim_amount - deductible.",
        "pt": "Cenário real: Calcule pagamentos de seguro. Sinistro 5230.50, Franquia 250, Limite 10000. Variáveis: valor_sinistro=5230.50, franquia=250, limite=10000. Calcule: pagamento = valor_sinistro - franquia."
      }
    },
    "exercises": [
      {
        "id": "ex1_1",
        "title": {
          "en": "Create Variables",
          "pt": "Criar Variáveis"
        },
        "description": {
          "en": "Create claim variables",
          "pt": "Crie variáveis de sinistro"
        },
        "steps": [
          {
            "order": 1,
            "instruction": {
              "en": "Create claim_amount = 3500",
              "pt": "Crie claim_amount = 3500"
            }
          },
          {
            "order": 2,
            "instruction": {
              "en": "Create deductible = 300",
              "pt": "Crie deductible = 300"
            }
          },
          {
            "order": 3,
            "instruction": {
              "en": "Create payout = claim_amount - deductible",
              "pt": "Crie payout = claim_amount - deductible"
            }
          },
          {
            "order": 4,
            "instruction": {
              "en": "Print payout",
              "pt": "Exiba payout"
            }
          },
          {
            "order": 5,
            "instruction": {
              "en": "Check result",
              "pt": "Verifique resultado"
            }
          }
        ],
        "starterCode": "claim_amount = \ndeductible = \npayout = \nprint()",
        "expectedOutput": "3200",
        "points": 25
      }
    ],
    "quiz": {
      "questions": [
        {
          "id": "q1_1",
          "question": {
            "en": "What is 5230.50 - 250?",
            "pt": "Quanto é 5230.50 - 250?"
          },
          "options": {
            "en": [
              "4980.50",
              "5480.50",
              "5230.50",
              "250"
            ],
            "pt": [
              "4980.50",
              "5480.50",
              "5230.50",
              "250"
            ]
          },
          "correct": 0,
          "explanation": {
            "en": "Correct: 5230.50 - 250 = 4980.50",
            "pt": "Correto: 5230.50 - 250 = 4980.50"
          }
        }
      ]
    },
    "exam": {
      "testCases": [
        {
          "id": "tc1",
          "description": {
            "en": "Create variables",
            "pt": "Criar variáveis"
          },
          "inputs": [],
          "checks": [
            {
              "type": "variable_exists",
              "value": "claim_amount"
            }
          ],
          "points": 20
        },
        {
          "id": "tc2",
          "description": {
            "en": "Calculate payout",
            "pt": "Calcular payout"
          },
          "inputs": [],
          "checks": [
            {
              "type": "variable_exists",
              "value": "payout"
            }
          ],
          "points": 20
        },
        {
          "id": "tc3",
          "description": {
            "en": "No errors",
            "pt": "Sem erros"
          },
          "inputs": [],
          "checks": [
            {
              "type": "no_error",
              "value": ""
            }
          ],
          "points": 30
        },
        {
          "id": "tc4",
          "description": {
            "en": "Output correct",
            "pt": "Saída correta"
          },
          "inputs": [],
          "checks": [
            {
              "type": "contains_any",
              "value": [
                "3200",
                "payout"
              ]
            }
          ],
          "points": 15
        },
        {
          "id": "tc5",
          "description": {
            "en": "All pass",
            "pt": "Todos passam"
          },
          "inputs": [],
          "checks": [
            {
              "type": "no_error",
              "value": ""
            }
          ],
          "points": 15
        }
      ]
    }
  },
  {
    "id": 2,
    "title": {
      "en": "Operations",
      "pt": "Operações"
    },
    "description": {
      "en": "Math operations",
      "pt": "Operações matemáticas"
    },
    "category": "Basics",
    "duration": 50,
    "lesson": {
      "title": {
        "en": "Math",
        "pt": "Matemática"
      },
      "content": {
        "en": "Learn math operations",
        "pt": "Aprenda operações"
      }
    },
    "exercises": [],
    "quiz": {
      "questions": []
    },
    "exam": {
      "testCases": []
    }
  },
  {
    "id": 3,
    "title": {
      "en": "Lists",
      "pt": "Listas"
    },
    "description": {
      "en": "List operations",
      "pt": "Operações com listas"
    },
    "category": "Intermediate",
    "duration": 50,
    "lesson": {
      "title": {
        "en": "Lists",
        "pt": "Listas"
      },
      "content": {
        "en": "Learn lists",
        "pt": "Aprenda listas"
      }
    },
    "exercises": [],
    "quiz": {
      "questions": []
    },
    "exam": {
      "testCases": []
    }
  },
  {
    "id": 4,
    "title": {
      "en": "Loops",
      "pt": "Loops"
    },
    "description": {
      "en": "Loop operations",
      "pt": "Operações com loops"
    },
    "category": "Intermediate",
    "duration": 50,
    "lesson": {
      "title": {
        "en": "Loops",
        "pt": "Loops"
      },
      "content": {
        "en": "Learn loops",
        "pt": "Aprenda loops"
      }
    },
    "exercises": [],
    "quiz": {
      "questions": []
    },
    "exam": {
      "testCases": []
    }
  },
  {
    "id": 5,
    "title": {
      "en": "Functions",
      "pt": "Funções"
    },
    "description": {
      "en": "Function operations",
      "pt": "Operações com funções"
    },
    "category": "Intermediate",
    "duration": 50,
    "lesson": {
      "title": {
        "en": "Functions",
        "pt": "Funções"
      },
      "content": {
        "en": "Learn functions",
        "pt": "Aprenda funções"
      }
    },
    "exercises": [],
    "quiz": {
      "questions": []
    },
    "exam": {
      "testCases": []
    }
  },
  {
    "id": 6,
    "title": {
      "en": "Strings",
      "pt": "Strings"
    },
    "description": {
      "en": "String operations",
      "pt": "Operações com strings"
    },
    "category": "Intermediate",
    "duration": 50,
    "lesson": {
      "title": {
        "en": "Strings",
        "pt": "Strings"
      },
      "content": {
        "en": "Learn strings",
        "pt": "Aprenda strings"
      }
    },
    "exercises": [],
    "quiz": {
      "questions": []
    },
    "exam": {
      "testCases": []
    }
  },
  {
    "id": 7,
    "title": {
      "en": "Dicts",
      "pt": "Dicionários"
    },
    "description": {
      "en": "Dictionary operations",
      "pt": "Operações com dicionários"
    },
    "category": "Advanced",
    "duration": 50,
    "lesson": {
      "title": {
        "en": "Dicts",
        "pt": "Dicionários"
      },
      "content": {
        "en": "Learn dicts",
        "pt": "Aprenda dicionários"
      }
    },
    "exercises": [],
    "quiz": {
      "questions": []
    },
    "exam": {
      "testCases": []
    }
  },
  {
    "id": 8,
    "title": {
      "en": "Files",
      "pt": "Arquivos"
    },
    "description": {
      "en": "File operations",
      "pt": "Operações com arquivos"
    },
    "category": "Advanced",
    "duration": 50,
    "lesson": {
      "title": {
        "en": "Files",
        "pt": "Arquivos"
      },
      "content": {
        "en": "Learn files",
        "pt": "Aprenda arquivos"
      }
    },
    "exercises": [],
    "quiz": {
      "questions": []
    },
    "exam": {
      "testCases": []
    }
  }
];
