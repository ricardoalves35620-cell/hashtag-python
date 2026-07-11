import type { Bilingual } from './types'

export type CurriculumStatus = 'available' | 'next' | 'planned'
export type CurriculumPathId = 'core' | 'ai-local'

export interface CurriculumStage {
  id: string
  order: number
  path: CurriculumPathId
  title: Bilingual
  description: Bilingual
  outcomes: { en: string[]; pt: string[] }
  status: CurriculumStatus
  phaseRange?: [number, number]
  prerequisites?: string[]
  estimatedHours?: number
}

export interface CurriculumPath {
  id: CurriculumPathId
  title: Bilingual
  subtitle: Bilingual
  description: Bilingual
  required: boolean
  stages: CurriculumStage[]
}

const coreStages: CurriculumStage[] = [
  {
    id: 'digital-foundation', order: 0, path: 'core', status: 'available', phaseRange: [0, 0], estimatedHours: 3,
    title: { en: 'Digital foundations', pt: 'Fundamentos digitais' },
    description: {
      en: 'Files, folders, installations, terminal basics and the difference between local, cloud and internet.',
      pt: 'Arquivos, pastas, instalações, noções de terminal e a diferença entre local, nuvem e internet.'
    },
    outcomes: {
      en: ['Use files and folders safely', 'Install and open development tools', 'Understand where code runs'],
      pt: ['Usar arquivos e pastas com segurança', 'Instalar e abrir ferramentas de desenvolvimento', 'Entender onde o código é executado']
    }
  },
  {
    id: 'python-foundations', order: 1, path: 'core', status: 'available', phaseRange: [1, 23], estimatedHours: 70,
    title: { en: 'Python foundations', pt: 'Fundamentos de Python' },
    description: {
      en: 'Syntax, variables, decisions, loops, collections, functions, files, JSON, libraries and error handling.',
      pt: 'Sintaxe, variáveis, decisões, loops, coleções, funções, arquivos, JSON, bibliotecas e tratamento de erros.'
    },
    outcomes: {
      en: ['Read and write Python programs', 'Break problems into functions', 'Work with files and structured data'],
      pt: ['Ler e escrever programas Python', 'Dividir problemas em funções', 'Trabalhar com arquivos e dados estruturados']
    }
  },
  {
    id: 'foundation-projects', order: 2, path: 'core', status: 'available', phaseRange: [24, 27], estimatedHours: 25,
    title: { en: 'Foundation projects', pt: 'Projetos de consolidação' },
    description: {
      en: 'Projects that combine the current foundation. Completing them means foundation mastery, not expert-level Python yet.',
      pt: 'Projetos que combinam a base atual. Concluí-los significa dominar os fundamentos, não ser especialista em Python ainda.'
    },
    outcomes: {
      en: ['Combine multiple concepts', 'Validate input and handle failures', 'Explain a complete program'],
      pt: ['Combinar vários conceitos', 'Validar entradas e tratar falhas', 'Explicar um programa completo']
    }
  },
  {
    id: 'professional-python', order: 3, path: 'core', status: 'next', estimatedHours: 90,
    title: { en: 'Professional Python', pt: 'Python profissional' },
    description: {
      en: 'Virtual environments, packages, project structure, Git, testing, typing, logging, debugging and object-oriented design.',
      pt: 'Ambientes virtuais, pacotes, estrutura de projetos, Git, testes, tipagem, logs, depuração e orientação a objetos.'
    },
    outcomes: {
      en: ['Build maintainable multi-file projects', 'Write automated tests', 'Use Git and professional tooling'],
      pt: ['Criar projetos organizados em vários arquivos', 'Escrever testes automatizados', 'Usar Git e ferramentas profissionais']
    }
  },
  {
    id: 'advanced-python', order: 4, path: 'core', status: 'planned', estimatedHours: 100,
    title: { en: 'Advanced Python', pt: 'Python avançado' },
    description: {
      en: 'Data model, iterators, generators, decorators, context managers, descriptors, concurrency, async, performance and internals.',
      pt: 'Modelo de dados, iteradores, generators, decorators, context managers, descriptors, concorrência, async, desempenho e internals.'
    },
    outcomes: {
      en: ['Understand Python beyond syntax', 'Choose correct concurrency models', 'Profile and optimize programs'],
      pt: ['Entender Python além da sintaxe', 'Escolher modelos corretos de concorrência', 'Medir e otimizar programas']
    }
  },
  {
    id: 'software-engineering', order: 5, path: 'core', status: 'planned', estimatedHours: 120,
    title: { en: 'Software engineering with Python', pt: 'Engenharia de software com Python' },
    description: {
      en: 'Architecture, APIs, databases, security, automation, data pipelines, deployment and observability.',
      pt: 'Arquitetura, APIs, bancos de dados, segurança, automação, pipelines de dados, deploy e observabilidade.'
    },
    outcomes: {
      en: ['Design production applications', 'Use SQL and build APIs', 'Deploy, monitor and maintain systems'],
      pt: ['Projetar aplicações de produção', 'Usar SQL e construir APIs', 'Publicar, monitorar e manter sistemas']
    }
  },
  {
    id: 'python-mastery', order: 6, path: 'core', status: 'planned', estimatedHours: 150,
    title: { en: 'Python mastery capstones', pt: 'Capstones de domínio em Python' },
    description: {
      en: 'Large projects, code review, architecture trade-offs, open-source reading and a portfolio that proves independent ability.',
      pt: 'Projetos grandes, revisão de código, decisões de arquitetura, leitura de open source e portfólio que comprova autonomia.'
    },
    outcomes: {
      en: ['Lead a Python project end to end', 'Review and improve unfamiliar code', 'Defend technical decisions'],
      pt: ['Conduzir um projeto Python do início ao fim', 'Revisar e melhorar código desconhecido', 'Defender decisões técnicas']
    }
  }
]

const aiStages: CurriculumStage[] = [
  {
    id: 'ai-data-math', order: 0, path: 'ai-local', status: 'planned', estimatedHours: 90,
    prerequisites: ['professional-python'],
    title: { en: 'Math and data for AI', pt: 'Matemática e dados para IA' },
    description: {
      en: 'NumPy, Pandas, SQL, statistics, probability, vectors, matrices and gradients taught visually and through Python.',
      pt: 'NumPy, Pandas, SQL, estatística, probabilidade, vetores, matrizes e gradientes ensinados visualmente e com Python.'
    },
    outcomes: {
      en: ['Prepare reliable datasets', 'Understand the math used by models', 'Measure data quality'],
      pt: ['Preparar datasets confiáveis', 'Entender a matemática usada pelos modelos', 'Medir a qualidade dos dados']
    }
  },
  {
    id: 'machine-learning', order: 1, path: 'ai-local', status: 'planned', estimatedHours: 100,
    prerequisites: ['ai-data-math'],
    title: { en: 'Machine learning', pt: 'Machine Learning' },
    description: {
      en: 'Regression, classification, clustering, feature engineering, validation, metrics, bias and reproducible pipelines.',
      pt: 'Regressão, classificação, clustering, engenharia de atributos, validação, métricas, viés e pipelines reproduzíveis.'
    },
    outcomes: {
      en: ['Train and evaluate classical models', 'Detect overfitting', 'Package a local predictive model'],
      pt: ['Treinar e avaliar modelos clássicos', 'Detectar overfitting', 'Empacotar um modelo preditivo local']
    }
  },
  {
    id: 'deep-learning', order: 2, path: 'ai-local', status: 'planned', estimatedHours: 120,
    prerequisites: ['machine-learning', 'advanced-python'],
    title: { en: 'Neural networks and PyTorch', pt: 'Redes neurais e PyTorch' },
    description: {
      en: 'Build a neural network with NumPy, then use tensors, backpropagation, optimizers, datasets, CPU and GPU with PyTorch.',
      pt: 'Construir uma rede neural com NumPy e depois usar tensors, backpropagation, otimizadores, datasets, CPU e GPU com PyTorch.'
    },
    outcomes: {
      en: ['Explain forward and backward passes', 'Train neural networks', 'Diagnose training failures'],
      pt: ['Explicar forward e backward pass', 'Treinar redes neurais', 'Diagnosticar falhas de treinamento']
    }
  },
  {
    id: 'transformers', order: 3, path: 'ai-local', status: 'planned', estimatedHours: 120,
    prerequisites: ['deep-learning'],
    title: { en: 'Language models and transformers', pt: 'Modelos de linguagem e Transformers' },
    description: {
      en: 'Tokenization, embeddings, attention, transformers and training a small educational language model locally.',
      pt: 'Tokenização, embeddings, attention, Transformers e treinamento local de um pequeno modelo educacional de linguagem.'
    },
    outcomes: {
      en: ['Understand next-token prediction', 'Implement attention concepts', 'Train a small language model'],
      pt: ['Entender previsão do próximo token', 'Implementar conceitos de attention', 'Treinar um pequeno modelo de linguagem']
    }
  },
  {
    id: 'local-ai-engineering', order: 4, path: 'ai-local', status: 'planned', estimatedHours: 120,
    prerequisites: ['transformers', 'software-engineering'],
    title: { en: 'Local AI engineering', pt: 'Engenharia de IA local' },
    description: {
      en: 'Open models, licenses, quantization, GGUF, local inference, embeddings, RAG, evaluation, privacy and lightweight fine-tuning.',
      pt: 'Modelos abertos, licenças, quantização, GGUF, inferência local, embeddings, RAG, avaliação, privacidade e fine-tuning leve.'
    },
    outcomes: {
      en: ['Run models without external APIs', 'Build local RAG with citations', 'Evaluate privacy, quality and hardware trade-offs'],
      pt: ['Executar modelos sem APIs externas', 'Construir RAG local com fontes', 'Avaliar privacidade, qualidade e limites do hardware']
    }
  },
  {
    id: 'local-ai-capstone', order: 5, path: 'ai-local', status: 'planned', estimatedHours: 160,
    prerequisites: ['local-ai-engineering'],
    title: { en: 'Capstone: your local AI', pt: 'Capstone: sua IA local' },
    description: {
      en: 'A private desktop application that indexes documents, answers with sources, uses a local model and works offline after setup.',
      pt: 'Um aplicativo desktop privado que indexa documentos, responde com fontes, usa modelo local e funciona offline após a instalação.'
    },
    outcomes: {
      en: ['Deliver a complete local AI product', 'Test answer quality and safety', 'Package the app for another person'],
      pt: ['Entregar um produto completo de IA local', 'Testar qualidade e segurança das respostas', 'Empacotar o app para outra pessoa']
    }
  }
]

export const CURRICULUM_PATHS: CurriculumPath[] = [
  {
    id: 'core', required: true,
    title: { en: 'Deep Python path', pt: 'Trilha Python profundo' },
    subtitle: { en: 'The mandatory spine', pt: 'A espinha dorsal obrigatória' },
    description: {
      en: 'From zero computer knowledge to independent, advanced Python engineering. Specializations come after this foundation.',
      pt: 'Do zero em computador até autonomia e nível avançado em engenharia Python. As especializações vêm depois dessa base.'
    },
    stages: coreStages
  },
  {
    id: 'ai-local', required: false,
    title: { en: 'Optional local AI path', pt: 'Trilha opcional de IA local' },
    subtitle: { en: 'For students who choose AI', pt: 'Para quem decidir seguir IA' },
    description: {
      en: 'Uses the deep Python foundation to build realistic local AI systems without depending on paid external APIs.',
      pt: 'Usa a formação profunda em Python para construir sistemas realistas de IA local sem depender de APIs externas pagas.'
    },
    stages: aiStages
  }
]

export function getAvailablePhaseCount() {
  return coreStages.reduce((total, stage) => {
    if (stage.status !== 'available' || !stage.phaseRange) return total
    return total + stage.phaseRange[1] - stage.phaseRange[0] + 1
  }, 0)
}
