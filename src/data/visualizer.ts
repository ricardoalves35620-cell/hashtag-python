import type { Bilingual } from './types'

export interface VisualStep {
  line: number
  explanation: Bilingual
  memory: Record<string, string>
  output: string[]
}

export interface VisualScenario {
  id: 'variables' | 'condition' | 'loop'
  icon: string
  title: Bilingual
  code: string[]
  steps: VisualStep[]
}

export const VISUAL_SCENARIOS: VisualScenario[] = [
  {
    id: 'variables', icon: '📦', title: { en: 'Variables are labeled boxes', pt: 'Variáveis são caixas com etiquetas' },
    code: ['name = "Ana"', 'age = 20', 'age = age + 1', 'print(name, age)'],
    steps: [
      { line: 0, explanation: { en: 'Python creates the name box and stores the text Ana.', pt: 'Python cria a caixa name e guarda o texto Ana.' }, memory: { name: '"Ana"' }, output: [] },
      { line: 1, explanation: { en: 'A second box named age stores 20.', pt: 'Uma segunda caixa chamada age guarda 20.' }, memory: { name: '"Ana"', age: '20' }, output: [] },
      { line: 2, explanation: { en: 'Python reads the old age, adds 1 and replaces the value.', pt: 'Python lê o valor antigo de age, soma 1 e substitui o valor.' }, memory: { name: '"Ana"', age: '21' }, output: [] },
      { line: 3, explanation: { en: 'print reads both boxes and sends their values to the output.', pt: 'print lê as duas caixas e envia os valores para a saída.' }, memory: { name: '"Ana"', age: '21' }, output: ['Ana 21'] },
    ],
  },
  {
    id: 'condition', icon: '🚦', title: { en: 'A condition chooses a path', pt: 'Uma condição escolhe um caminho' },
    code: ['temperature = 8', 'if temperature < 10:', '    print("Coat")', 'else:', '    print("T-shirt")'],
    steps: [
      { line: 0, explanation: { en: 'The temperature value is stored.', pt: 'O valor da temperatura é armazenado.' }, memory: { temperature: '8' }, output: [] },
      { line: 1, explanation: { en: 'Python asks: is 8 smaller than 10? The answer is True.', pt: 'Python pergunta: 8 é menor que 10? A resposta é True.' }, memory: { temperature: '8', condition: 'True' }, output: [] },
      { line: 2, explanation: { en: 'Because the condition is True, this indented line runs.', pt: 'Como a condição é True, esta linha indentada executa.' }, memory: { temperature: '8', condition: 'True' }, output: ['Coat'] },
    ],
  },
  {
    id: 'loop', icon: '🔁', title: { en: 'A loop repeats with a changing value', pt: 'Um laço repete com um valor que muda' },
    code: ['for number in [1, 2, 3]:', '    print(number)', 'print("Done")'],
    steps: [
      { line: 0, explanation: { en: 'The loop takes the first item: number becomes 1.', pt: 'O laço pega o primeiro item: number vira 1.' }, memory: { number: '1' }, output: [] },
      { line: 1, explanation: { en: 'The body prints the current value.', pt: 'O corpo imprime o valor atual.' }, memory: { number: '1' }, output: ['1'] },
      { line: 0, explanation: { en: 'The loop returns and number becomes 2.', pt: 'O laço volta e number vira 2.' }, memory: { number: '2' }, output: ['1'] },
      { line: 1, explanation: { en: 'The body runs again.', pt: 'O corpo executa novamente.' }, memory: { number: '2' }, output: ['1', '2'] },
      { line: 0, explanation: { en: 'The last item makes number equal 3.', pt: 'O último item faz number ser igual a 3.' }, memory: { number: '3' }, output: ['1', '2'] },
      { line: 1, explanation: { en: 'The body prints 3.', pt: 'O corpo imprime 3.' }, memory: { number: '3' }, output: ['1', '2', '3'] },
      { line: 2, explanation: { en: 'The list ended, so Python leaves the loop and continues.', pt: 'A lista terminou, então Python sai do laço e continua.' }, memory: { number: '3' }, output: ['1', '2', '3', 'Done'] },
    ],
  },
]
