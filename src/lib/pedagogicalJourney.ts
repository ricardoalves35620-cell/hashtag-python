import type { Bilingual, LessonBlock, Phase } from '../data/types'
import { getMiniProjectForPhase } from '../data/miniProjects'

export type LessonUnitKind =
  | 'challenge'
  | 'intuition'
  | 'decomposition'
  | 'flow'
  | 'pseudocode'
  | 'python'
  | 'walkthrough'
  | 'debug'
  | 'practice'
  | 'transfer'

export interface LessonUnit {
  id: string
  kind: LessonUnitKind
  icon: string
  title: Bilingual
  purpose: Bilingual
  blocks: LessonBlock[]
  checkpoint: Bilingual
  checkpointPlaceholder: Bilingual
}

interface PhaseBlueprint {
  situation: Bilingual
  humanReasoning: Bilingual
  decomposition: Bilingual
  flow: Bilingual
  pseudocode: Bilingual
  expertLens: Bilingual
  likelyFailure: Bilingual
  transferPrompt: Bilingual
}

const text = (en: string, pt: string): LessonBlock => ({ type: 'text', content: { en, pt } })
const heading = (en: string, pt: string): LessonBlock => ({ type: 'heading', content: { en, pt } })
const tip = (en: string, pt: string): LessonBlock => ({ type: 'tip', content: { en, pt } })
const warning = (en: string, pt: string): LessonBlock => ({ type: 'warning', content: { en, pt } })

const FOUNDATION_BLUEPRINTS: Record<number, PhaseBlueprint> = {
  0: {
    situation: { en: 'You have never programmed before. Your first job is not to memorize commands; it is to understand that a program is a sequence of precise instructions.', pt: 'Você nunca programou antes. Seu primeiro trabalho não é decorar comandos; é entender que um programa é uma sequência de instruções precisas.' },
    humanReasoning: { en: 'When giving directions to another person, vague steps may still work. A computer cannot guess. Every action and value must be explicit.', pt: 'Ao orientar outra pessoa, passos vagos talvez funcionem. Um computador não adivinha. Cada ação e cada valor precisam estar explícitos.' },
    decomposition: { en: 'Choose one tiny result, identify what must happen before it, and order the instructions from first to last.', pt: 'Escolha um resultado pequeno, identifique o que precisa acontecer antes dele e ordene as instruções do primeiro ao último passo.' },
    flow: { en: 'START → instruction → visible result → END', pt: 'INÍCIO → instrução → resultado visível → FIM' },
    pseudocode: { en: 'SHOW a message\nEND', pt: 'MOSTRAR uma mensagem\nFIM' },
    expertLens: { en: 'An experienced developer reduces uncertainty before typing. They ask what the program must do and how they will know it worked.', pt: 'Um desenvolvedor experiente reduz a incerteza antes de digitar. Ele pergunta o que o programa precisa fazer e como saberá que funcionou.' },
    likelyFailure: { en: 'Typing characters without understanding the instruction boundary, then changing several things at once.', pt: 'Digitar caracteres sem entender onde a instrução começa e termina e depois alterar várias coisas ao mesmo tempo.' },
    transferPrompt: { en: 'Describe another daily task that could be written as exact instructions.', pt: 'Descreva outra tarefa diária que poderia ser escrita como instruções exatas.' },
  },
  1: {
    situation: { en: 'A program must remember information such as a name, quantity, price, or status while it runs.', pt: 'Um programa precisa lembrar informações como nome, quantidade, preço ou status enquanto executa.' },
    humanReasoning: { en: 'Humans label information mentally. In a program, a variable is the label attached to a value.', pt: 'Pessoas rotulam informações mentalmente. Em um programa, uma variável é o rótulo ligado a um valor.' },
    decomposition: { en: 'Identify the value, choose a meaningful name, store the value, then use the name instead of repeating the raw value.', pt: 'Identifique o valor, escolha um nome significativo, guarde o valor e use o nome em vez de repetir o valor bruto.' },
    flow: { en: 'value → named variable → operation or display', pt: 'valor → variável com nome → operação ou exibição' },
    pseudocode: { en: 'STORE the value using a meaningful name\nUSE the stored value\nSHOW the result', pt: 'GUARDAR o valor usando um nome significativo\nUSAR o valor guardado\nMOSTRAR o resultado' },
    expertLens: { en: 'A good name explains meaning. It should answer “what does this value represent?” without needing a comment.', pt: 'Um bom nome explica significado. Ele deve responder “o que este valor representa?” sem depender de comentário.' },
    likelyFailure: { en: 'Using a variable before creating it, or replacing its value when the intention was to update it.', pt: 'Usar uma variável antes de criá-la ou substituir o valor quando a intenção era atualizá-lo.' },
    transferPrompt: { en: 'Choose information from a real form and decide which variables would store it.', pt: 'Escolha informações de um formulário real e decida quais variáveis as guardariam.' },
  },
  2: {
    situation: { en: 'A program receives text and numbers from a person and must turn that raw input into useful data.', pt: 'Um programa recebe textos e números de uma pessoa e precisa transformar essa entrada bruta em dados úteis.' },
    humanReasoning: { en: 'A person understands that “25” may mean a number. Python receives input as text, so the program must decide when conversion is necessary.', pt: 'Uma pessoa entende que “25” pode ser um número. Python recebe input como texto, então o programa precisa decidir quando converter.' },
    decomposition: { en: 'Ask for one value, inspect what type is needed, convert only when necessary, then use the converted value.', pt: 'Peça um valor, identifique qual tipo é necessário, converta apenas quando preciso e use o valor convertido.' },
    flow: { en: 'user input → text → optional conversion → calculation → output', pt: 'entrada do usuário → texto → conversão opcional → cálculo → saída' },
    pseudocode: { en: 'ASK for the value\nCONVERT it to the required type\nUSE it\nSHOW the result', pt: 'PEDIR o valor\nCONVERTER para o tipo necessário\nUSAR o valor\nMOSTRAR o resultado' },
    expertLens: { en: 'Never convert by habit. Decide the type from the operation the program must perform.', pt: 'Nunca converta por hábito. Decida o tipo a partir da operação que o programa precisa realizar.' },
    likelyFailure: { en: 'Trying to add text to a number or trusting user input without checking what arrived.', pt: 'Tentar somar texto com número ou confiar na entrada sem verificar o que chegou.' },
    transferPrompt: { en: 'Describe a form field that should remain text and another that must become a number.', pt: 'Descreva um campo de formulário que deve continuar texto e outro que precisa virar número.' },
  },
  3: {
    situation: { en: 'A program often needs to calculate, compare, or combine values to produce a decision or result.', pt: 'Um programa frequentemente precisa calcular, comparar ou combinar valores para produzir uma decisão ou resultado.' },
    humanReasoning: { en: 'Operators express relationships: add, subtract, compare, combine conditions, or update an existing value.', pt: 'Operadores expressam relações: somar, subtrair, comparar, combinar condições ou atualizar um valor existente.' },
    decomposition: { en: 'Write the rule in words, identify the operands, choose the operator that matches the rule, then verify precedence.', pt: 'Escreva a regra em palavras, identifique os operandos, escolha o operador correspondente e verifique a precedência.' },
    flow: { en: 'values → operator → result → validation', pt: 'valores → operador → resultado → validação' },
    pseudocode: { en: 'GET the values\nAPPLY the stated rule\nSTORE the result\nCHECK whether it makes sense', pt: 'OBTER os valores\nAPLICAR a regra informada\nGUARDAR o resultado\nVERIFICAR se faz sentido' },
    expertLens: { en: 'Experienced developers make precedence obvious with small expressions and parentheses when ambiguity is possible.', pt: 'Desenvolvedores experientes deixam a precedência óbvia com expressões pequenas e parênteses quando houver ambiguidade.' },
    likelyFailure: { en: 'Choosing an operator because it looks familiar instead of matching it to the business rule.', pt: 'Escolher um operador por parecer familiar, em vez de relacioná-lo à regra do problema.' },
    transferPrompt: { en: 'Turn a discount or deductible rule into a plain-language expression.', pt: 'Transforme uma regra de desconto ou franquia em uma expressão escrita em linguagem comum.' },
  },
  4: {
    situation: { en: 'The program must choose different actions depending on facts such as age, value, status, or availability.', pt: 'O programa precisa escolher ações diferentes dependendo de fatos como idade, valor, status ou disponibilidade.' },
    humanReasoning: { en: 'A decision has a question, possible answers, and one action for each relevant answer.', pt: 'Uma decisão tem uma pergunta, respostas possíveis e uma ação para cada resposta relevante.' },
    decomposition: { en: 'Write the decision as a yes/no question, define the true path, define the false path, then cover boundary values.', pt: 'Escreva a decisão como uma pergunta de sim/não, defina o caminho verdadeiro, o falso e cubra os valores de limite.' },
    flow: { en: 'condition? → YES: action A | NO: action B → continue', pt: 'condição? → SIM: ação A | NÃO: ação B → continuar' },
    pseudocode: { en: 'IF the condition is true\n  DO the first action\nOTHERWISE\n  DO the alternative action', pt: 'SE a condição for verdadeira\n  FAZER a primeira ação\nSENÃO\n  FAZER a ação alternativa' },
    expertLens: { en: 'The hardest part is usually not writing if. It is defining the condition precisely and testing the boundary.', pt: 'A parte mais difícil normalmente não é escrever if. É definir a condição com precisão e testar o limite.' },
    likelyFailure: { en: 'Using greater-than when the rule includes equality, or leaving a possible path undefined.', pt: 'Usar maior que quando a regra inclui igualdade ou deixar um caminho possível sem definição.' },
    transferPrompt: { en: 'Create a decision rule with one important boundary value and explain both outcomes.', pt: 'Crie uma regra de decisão com um valor de limite importante e explique os dois resultados.' },
  },
  5: {
    situation: { en: 'A program must make a complete two-way decision: one action when a condition is true and another when it is false.', pt: 'Um programa precisa tomar uma decisão completa de dois caminhos: uma ação quando a condição é verdadeira e outra quando é falsa.' },
    humanReasoning: { en: 'People naturally ask “does this meet the rule?” and then choose one of two paths. The program needs the same question, the same boundary, and an explicit action for each answer.', pt: 'Pessoas naturalmente perguntam “isso atende à regra?” e então escolhem um de dois caminhos. O programa precisa da mesma pergunta, do mesmo limite e de uma ação explícita para cada resposta.' },
    decomposition: { en: 'Name the value being checked, write the rule as a true/false question, define the true action, define the false action, and test values immediately below, at, and above the boundary.', pt: 'Nomeie o valor verificado, escreva a regra como pergunta de verdadeiro/falso, defina a ação verdadeira, a ação falsa e teste valores logo abaixo, exatamente no limite e acima dele.' },
    flow: { en: 'input → evaluate one condition → TRUE path or FALSE path → common continuation', pt: 'entrada → avaliar uma condição → caminho VERDADEIRO ou FALSO → continuação comum' },
    pseudocode: { en: 'RECEIVE the value\nIF the rule is true\n  PERFORM action A\nELSE\n  PERFORM action B\nCONTINUE', pt: 'RECEBER o valor\nSE a regra for verdadeira\n  EXECUTAR ação A\nSENÃO\n  EXECUTAR ação B\nCONTINUAR' },
    expertLens: { en: 'An experienced developer tests the boundary before celebrating the happy path. Most conditional bugs live at equality and in forgotten alternatives.', pt: 'Um desenvolvedor experiente testa o limite antes de comemorar o caminho feliz. A maioria dos bugs condicionais vive na igualdade e nas alternativas esquecidas.' },
    likelyFailure: { en: 'Writing the branches before deciding the exact rule, nesting unnecessarily, or printing the same final action inside both branches.', pt: 'Escrever os caminhos antes de decidir a regra exata, aninhar sem necessidade ou repetir a mesma ação final dentro dos dois caminhos.' },
    transferPrompt: { en: 'Create a real rule with exactly two outcomes and identify its most dangerous boundary value.', pt: 'Crie uma regra real com exatamente dois resultados e identifique o valor de limite mais perigoso.' },
  },
  6: {
    situation: { en: 'Some decisions have more than two meaningful outcomes, such as low, medium, and high risk or several pricing bands.', pt: 'Algumas decisões têm mais de dois resultados relevantes, como risco baixo, médio e alto ou várias faixas de preço.' },
    humanReasoning: { en: 'A person checks the first applicable category and stops. The order matters because a broad rule can steal cases from a more specific rule.', pt: 'Uma pessoa verifica a primeira categoria aplicável e para. A ordem importa porque uma regra ampla pode roubar casos de uma regra mais específica.' },
    decomposition: { en: 'List all categories, define non-overlapping boundaries, order checks from most restrictive to fallback, and guarantee that every possible input reaches one path.', pt: 'Liste todas as categorias, defina limites sem sobreposição, ordene as verificações da mais restritiva até a alternativa final e garanta que toda entrada alcance um caminho.' },
    flow: { en: 'input → condition 1? → condition 2? → condition 3? → fallback → one result', pt: 'entrada → condição 1? → condição 2? → condição 3? → alternativa final → um resultado' },
    pseudocode: { en: 'IF first category matches\n  CHOOSE result A\nELSE IF second category matches\n  CHOOSE result B\nELSE\n  CHOOSE fallback result', pt: 'SE a primeira categoria corresponder\n  ESCOLHER resultado A\nSENÃO SE a segunda corresponder\n  ESCOLHER resultado B\nSENÃO\n  ESCOLHER o resultado padrão' },
    expertLens: { en: 'Treat an if/elif/else chain as a classification table. Write the table first, then convert each row into a branch.', pt: 'Trate uma cadeia if/elif/else como uma tabela de classificação. Escreva a tabela primeiro e depois transforme cada linha em um caminho.' },
    likelyFailure: { en: 'Checking a broad condition too early, leaving gaps between ranges, or using several independent if statements when only one result should be selected.', pt: 'Verificar uma condição ampla cedo demais, deixar lacunas entre faixas ou usar vários if independentes quando apenas um resultado deve ser escolhido.' },
    transferPrompt: { en: 'Design a three-level classification and prove with boundary tests that every input belongs to exactly one level.', pt: 'Projete uma classificação de três níveis e prove com testes de limite que cada entrada pertence a exatamente um nível.' },
  },
  7: {
    situation: { en: 'A task must repeat while a condition remains true, but the number of repetitions depends on changing state.', pt: 'Uma tarefa precisa se repetir enquanto uma condição continuar verdadeira, mas a quantidade de repetições depende de um estado que muda.' },
    humanReasoning: { en: 'You keep doing the work, update what remains, and stop when the condition is no longer true. A while loop is that agreement written precisely.', pt: 'Você continua fazendo o trabalho, atualiza o que falta e para quando a condição deixa de ser verdadeira. Um while é esse acordo escrito com precisão.' },
    decomposition: { en: 'Define the initial state, the condition checked before every turn, the work performed, the state update, and the exact stopping state.', pt: 'Defina o estado inicial, a condição verificada antes de cada volta, o trabalho executado, a atualização do estado e o estado exato de parada.' },
    flow: { en: 'initialize → condition? → work → update state → return to condition → stop', pt: 'inicializar → condição? → trabalhar → atualizar estado → voltar à condição → parar' },
    pseudocode: { en: 'INITIALIZE state\nWHILE the stopping condition has not been reached\n  PROCESS one item\n  UPDATE state\nSHOW the final result', pt: 'INICIALIZAR o estado\nENQUANTO a condição de parada não for atingida\n  PROCESSAR um item\n  ATUALIZAR o estado\nMOSTRAR o resultado final' },
    expertLens: { en: 'Before writing while, say out loud what changes on every iteration. If nothing guaranteed changes, you probably created an infinite loop.', pt: 'Antes de escrever while, diga em voz alta o que muda em cada repetição. Se nada mudar de forma garantida, você provavelmente criou um loop infinito.' },
    likelyFailure: { en: 'Forgetting the update, updating the wrong variable, placing the update outside the loop, or using a condition that can never become false.', pt: 'Esquecer a atualização, atualizar a variável errada, colocar a atualização fora do loop ou usar uma condição que nunca pode ficar falsa.' },
    transferPrompt: { en: 'Describe a process whose ending depends on changing state rather than a fixed list, and state how progress is guaranteed.', pt: 'Descreva um processo cujo fim depende de um estado que muda, e não de uma lista fixa, e diga como o progresso é garantido.' },
  },
  8: {
    situation: { en: 'You have a collection of known items and need to perform the same responsibility once for each item.', pt: 'Você tem uma coleção conhecida de itens e precisa executar a mesma responsabilidade uma vez para cada item.' },
    humanReasoning: { en: 'Instead of managing a counter manually, you take the next item, process it, and continue until the collection ends.', pt: 'Em vez de controlar um contador manualmente, você pega o próximo item, processa e continua até a coleção terminar.' },
    decomposition: { en: 'Identify the collection, name one item clearly, define the work for one item, decide whether to filter or accumulate, and define the final result.', pt: 'Identifique a coleção, dê um nome claro a um item, defina o trabalho para um item, decida se haverá filtro ou acúmulo e defina o resultado final.' },
    flow: { en: 'collection → next item → optional decision → process/update → next item → final result', pt: 'coleção → próximo item → decisão opcional → processar/atualizar → próximo item → resultado final' },
    pseudocode: { en: 'PREPARE final state\nFOR each item IN the collection\n  INSPECT the item\n  PROCESS or SKIP it\n  UPDATE the final state\nSHOW the result', pt: 'PREPARAR o estado final\nPARA cada item NA coleção\n  INSPECIONAR o item\n  PROCESSAR ou PULAR\n  ATUALIZAR o estado final\nMOSTRAR o resultado' },
    expertLens: { en: 'Design the body for one item first. A for loop is correct when repeating that body for every item produces the complete answer.', pt: 'Projete primeiro o corpo para um único item. Um for está correto quando repetir esse corpo para cada item produz a resposta completa.' },
    likelyFailure: { en: 'Confusing the whole list with the current item, resetting an accumulator inside the loop, or modifying the collection while iterating over it.', pt: 'Confundir a lista inteira com o item atual, reiniciar o acumulador dentro do loop ou modificar a coleção enquanto percorre seus itens.' },
    transferPrompt: { en: 'Choose a real collection and explain what one iteration means, what remains constant, and what changes.', pt: 'Escolha uma coleção real e explique o que significa uma repetição, o que permanece constante e o que muda.' },
  },
  9: {
    situation: { en: 'Your data has levels: for example, several inspections, each containing several measurements or observations.', pt: 'Seus dados têm níveis: por exemplo, várias inspeções, cada uma contendo várias medições ou observações.' },
    humanReasoning: { en: 'First choose the outer group, then choose an item inside that group. Two levels of structure require two levels of navigation.', pt: 'Primeiro escolha o grupo externo e depois um item dentro desse grupo. Dois níveis de estrutura exigem dois níveis de navegação.' },
    decomposition: { en: 'Define what one outer item represents, what one inner item represents, which level owns each index, and whether the structure should be traversed or accessed directly.', pt: 'Defina o que representa um item externo, o que representa um item interno, a qual nível pertence cada índice e se a estrutura deve ser percorrida ou acessada diretamente.' },
    flow: { en: 'outer list → choose group → inner list → choose value → process', pt: 'lista externa → escolher grupo → lista interna → escolher valor → processar' },
    pseudocode: { en: 'FOR each group IN all groups\n  FOR each value IN the group\n    PROCESS the value', pt: 'PARA cada grupo EM todos os grupos\n  PARA cada valor NO grupo\n    PROCESSAR o valor' },
    expertLens: { en: 'Draw the shape of nested data before indexing it. Most mistakes happen because the developer imagines a flat structure that does not exist.', pt: 'Desenhe o formato dos dados aninhados antes de usar índices. A maioria dos erros acontece porque o desenvolvedor imagina uma estrutura plana que não existe.' },
    likelyFailure: { en: 'Using an index at the wrong level, assuming every inner list has the same size, or losing track of which loop variable represents which layer.', pt: 'Usar um índice no nível errado, supor que todas as listas internas têm o mesmo tamanho ou perder a noção de qual variável representa cada camada.' },
    transferPrompt: { en: 'Model a two-level real structure and explain what the outer and inner positions mean.', pt: 'Modele uma estrutura real de dois níveis e explique o significado das posições externa e interna.' },
  },
  10: {
    situation: { en: 'A record contains named facts, such as a claim number, customer, status, and amount. Position alone is not enough to explain meaning.', pt: 'Um registro contém fatos nomeados, como número do sinistro, cliente, status e valor. Apenas a posição não explica o significado.' },
    humanReasoning: { en: 'People retrieve a fact by its label: “what is the status?” A dictionary represents that relationship between a key and its value.', pt: 'Pessoas recuperam um fato pelo rótulo: “qual é o status?”. Um dicionário representa essa relação entre uma chave e seu valor.' },
    decomposition: { en: 'Define one entity, list its attributes, choose stable keys, decide which values are required, and define how missing data should be handled.', pt: 'Defina uma entidade, liste seus atributos, escolha chaves estáveis, decida quais valores são obrigatórios e como dados ausentes serão tratados.' },
    flow: { en: 'record → key → value → read/update decision', pt: 'registro → chave → valor → decisão de leitura/atualização' },
    pseudocode: { en: 'CREATE a record with named fields\nREAD a value using its key\nUPDATE the value when the fact changes\nHANDLE a missing key intentionally', pt: 'CRIAR um registro com campos nomeados\nLER um valor usando sua chave\nATUALIZAR quando o fato mudar\nTRATAR intencionalmente uma chave ausente' },
    expertLens: { en: 'Keys are part of the data contract. Use names that remain meaningful to every caller, not abbreviations understood only by the author.', pt: 'As chaves fazem parte do contrato dos dados. Use nomes que continuem significativos para qualquer pessoa, não abreviações entendidas apenas pelo autor.' },
    likelyFailure: { en: 'Requesting a key that does not exist, confusing a key with its value, or using a dictionary when order and duplicate positions are the real requirement.', pt: 'Pedir uma chave inexistente, confundir a chave com seu valor ou usar dicionário quando ordem e posições repetidas são o requisito real.' },
    transferPrompt: { en: 'Design a dictionary for one real entity and justify every key name and data type.', pt: 'Projete um dicionário para uma entidade real e justifique o nome e o tipo de cada chave.' },
  },
  11: {
    situation: { en: 'A system contains many records of the same kind, such as many claims, products, users, or inspections.', pt: 'Um sistema contém muitos registros do mesmo tipo, como vários sinistros, produtos, usuários ou inspeções.' },
    humanReasoning: { en: 'A list answers “which records exist?” and each dictionary answers “what do we know about this record?”. Together they model a small table.', pt: 'Uma lista responde “quais registros existem?” e cada dicionário responde “o que sabemos sobre este registro?”. Juntos eles modelam uma pequena tabela.' },
    decomposition: { en: 'Define the record schema, create a collection of records, decide which key identifies a record, and specify how filtering, aggregation, or updates will work.', pt: 'Defina o formato do registro, crie uma coleção de registros, escolha a chave que identifica cada registro e especifique como filtrar, agregar ou atualizar.' },
    flow: { en: 'list of records → one dictionary → inspect keys → filter/aggregate/update → result', pt: 'lista de registros → um dicionário → inspecionar chaves → filtrar/agregar/atualizar → resultado' },
    pseudocode: { en: 'FOR each record IN the collection\n  READ the needed fields\n  IF the record matches the rule\n    PROCESS or UPDATE it\nRETURN the collected result', pt: 'PARA cada registro NA coleção\n  LER os campos necessários\n  SE o registro atender à regra\n    PROCESSAR ou ATUALIZAR\nRETORNAR o resultado reunido' },
    expertLens: { en: 'Separate the record schema from the operation. First know what one record looks like; then write logic that works for every record with that schema.', pt: 'Separe o formato do registro da operação. Primeiro saiba como é um registro; depois escreva uma lógica que funcione para todos os registros desse formato.' },
    likelyFailure: { en: 'Assuming every dictionary has every key, mutating the wrong record, or mixing data cleanup, filtering, and reporting in one unreadable loop.', pt: 'Supor que todo dicionário tem todas as chaves, alterar o registro errado ou misturar limpeza, filtro e relatório em um único loop ilegível.' },
    transferPrompt: { en: 'Model a small table as a list of dictionaries and describe one filter and one aggregation it must support.', pt: 'Modele uma pequena tabela como lista de dicionários e descreva um filtro e uma agregação que ela deve suportar.' },
  },
  12: {
    situation: { en: 'You need to create a new list by transforming or filtering an existing iterable, and the rule is simple enough to state in one clear sentence.', pt: 'Você precisa criar uma nova lista transformando ou filtrando um iterável existente, e a regra é simples o bastante para ser declarada em uma frase clara.' },
    humanReasoning: { en: 'For each source item, decide whether it belongs and, if it does, what value should be placed in the new list.', pt: 'Para cada item de origem, decida se ele pertence ao resultado e, se pertencer, qual valor deve entrar na nova lista.' },
    decomposition: { en: 'Name the source, define the transformation, define the optional filter, verify that the result is a new list, and reject the comprehension if the logic becomes hard to read.', pt: 'Nomeie a origem, defina a transformação, defina o filtro opcional, confirme que o resultado é uma nova lista e rejeite a compreensão se a lógica ficar difícil de ler.' },
    flow: { en: 'source item → optional filter → transformation → append to new list', pt: 'item de origem → filtro opcional → transformação → adicionar à nova lista' },
    pseudocode: { en: 'CREATE an empty result\nFOR each item IN the source\n  IF the item matches the optional rule\n    ADD the transformed item to the result', pt: 'CRIAR um resultado vazio\nPARA cada item NA origem\n  SE o item atender à regra opcional\n    ADICIONAR o item transformado ao resultado' },
    expertLens: { en: 'Write the ordinary loop first when reasoning is uncertain. Convert it to a comprehension only after the input, filter, transformation, and output are obvious.', pt: 'Escreva primeiro o loop comum quando o raciocínio não estiver claro. Converta para compreensão somente quando entrada, filtro, transformação e saída estiverem óbvios.' },
    likelyFailure: { en: 'Using a comprehension to hide several decisions, confusing filtering with transformation, or expecting it to modify the original list.', pt: 'Usar compreensão para esconder várias decisões, confundir filtro com transformação ou esperar que ela modifique a lista original.' },
    transferPrompt: { en: 'Take one clear loop that builds a list, explain its four parts, and decide whether a comprehension improves or harms readability.', pt: 'Pegue um loop claro que constrói uma lista, explique suas quatro partes e decida se uma compreensão melhora ou piora a legibilidade.' },
  },
  13: {
    situation: { en: 'A program repeats the same responsibility in several places. Copying the same lines makes every correction slower and creates inconsistent behavior.', pt: 'Um programa repete a mesma responsabilidade em vários lugares. Copiar as mesmas linhas torna cada correção mais lenta e cria comportamentos diferentes.' },
    humanReasoning: { en: 'People give a recurring task a name: calculate payout, validate claim, format report. A function does the same for a block of instructions.', pt: 'Pessoas dão um nome a uma tarefa recorrente: calcular indenização, validar sinistro, formatar relatório. Uma função faz o mesmo com um bloco de instruções.' },
    decomposition: { en: 'Choose one responsibility, define what information it needs, define the result it must produce, name it with a verb, then call it from the larger workflow.', pt: 'Escolha uma responsabilidade, defina quais informações ela precisa, qual resultado deve produzir, dê a ela um nome com verbo e chame-a no fluxo maior.' },
    flow: { en: 'caller → function inputs → function steps → returned result → caller continues', pt: 'código chamador → entradas da função → passos da função → resultado retornado → fluxo continua' },
    pseudocode: { en: 'DEFINE calculate_payout\n  RECEIVE damage and deductible\n  CALCULATE the net amount\n  RETURN the amount\nCALL calculate_payout when needed', pt: 'DEFINIR calcular_indenizacao\n  RECEBER dano e franquia\n  CALCULAR o valor líquido\n  RETORNAR o valor\nCHAMAR calcular_indenizacao quando necessário' },
    expertLens: { en: 'A function should have one clear reason to change. If its name needs “and”, it may be hiding more than one responsibility.', pt: 'Uma função deve ter um motivo claro para mudar. Se o nome precisar de “e”, talvez ela esteja escondendo mais de uma responsabilidade.' },
    likelyFailure: { en: 'Defining a function but never calling it, printing when the caller needs a value, or moving unrelated work into one oversized function.', pt: 'Definir uma função e nunca chamá-la, imprimir quando o chamador precisa de um valor ou juntar tarefas sem relação em uma função enorme.' },
    transferPrompt: { en: 'Take a repeated task from a real workflow and define the function contract: name, inputs, output, and one responsibility.', pt: 'Pegue uma tarefa repetida de um fluxo real e defina o contrato da função: nome, entradas, saída e uma responsabilidade.' },
  },
  14: {
    situation: { en: 'The same operation must work with different data. A useful function cannot depend on values secretly fixed inside its body.', pt: 'A mesma operação precisa funcionar com dados diferentes. Uma função útil não pode depender de valores escondidos e fixos dentro dela.' },
    humanReasoning: { en: 'A request has blanks to fill: calculate the payout for this damage and this deductible. Parameters name those blanks; arguments provide the actual values.', pt: 'Uma solicitação tem espaços a preencher: calcule a indenização para este dano e esta franquia. Parâmetros nomeiam esses espaços; argumentos fornecem os valores reais.' },
    decomposition: { en: 'Separate required information from optional information, choose sensible defaults only when a real default exists, and decide what the function returns to its caller.', pt: 'Separe informações obrigatórias das opcionais, escolha valores padrão somente quando houver um padrão real e decida o que a função devolve ao chamador.' },
    flow: { en: 'arguments at call site → parameters inside function → calculation → return value → assignment or next operation', pt: 'argumentos na chamada → parâmetros dentro da função → cálculo → valor retornado → variável ou próxima operação' },
    pseudocode: { en: 'DEFINE function(required_value, optional_value = default)\n  PROCESS the parameters\n  RETURN one useful result\nresult = CALL function(argument, named_argument = value)', pt: 'DEFINIR função(valor_obrigatorio, valor_opcional = padrão)\n  PROCESSAR os parâmetros\n  RETORNAR um resultado útil\nresultado = CHAMAR função(argumento, argumento_nomeado = valor)' },
    expertLens: { en: 'Keyword arguments make meaning visible at the call site. Defaults should represent a safe domain rule, not merely save typing.', pt: 'Argumentos nomeados deixam o significado visível na chamada. Valores padrão devem representar uma regra segura do domínio, não apenas economizar digitação.' },
    likelyFailure: { en: 'Confusing parameter names with argument values, forgetting return, placing required parameters after default parameters, or relying on positional order that is hard to read.', pt: 'Confundir nomes de parâmetros com valores dos argumentos, esquecer return, colocar parâmetro obrigatório depois de parâmetro padrão ou depender de uma ordem posicional difícil de ler.' },
    transferPrompt: { en: 'Design one flexible function with required and optional information. Explain why each input is required, optional, positional, or named.', pt: 'Projete uma função flexível com informações obrigatórias e opcionais. Explique por que cada entrada é obrigatória, opcional, posicional ou nomeada.' },
  },
  15: {
    situation: { en: 'Another developer can call a function but cannot safely use it without knowing what it expects, what it returns, and which errors or rules matter.', pt: 'Outro desenvolvedor consegue chamar uma função, mas não consegue usá-la com segurança sem saber o que ela espera, retorna e quais erros ou regras importam.' },
    humanReasoning: { en: 'A tool needs instructions. A docstring is the contract stored beside the function so editors, help(), documentation tools, and future maintainers can read it.', pt: 'Uma ferramenta precisa de instruções. A docstring é o contrato guardado junto da função para que editores, help(), ferramentas de documentação e futuros mantenedores possam lê-lo.' },
    decomposition: { en: 'State the purpose, describe parameters by meaning rather than syntax, describe the return value, record important exceptions, and include an example only when it clarifies use.', pt: 'Declare o propósito, descreva parâmetros pelo significado e não pela sintaxe, descreva o retorno, registre exceções importantes e inclua exemplo somente quando esclarecer o uso.' },
    flow: { en: 'function contract → developer reads documentation → correct call → predictable result', pt: 'contrato da função → desenvolvedor lê a documentação → chamada correta → resultado previsível' },
    pseudocode: { en: 'DOCUMENT what the function does\nDOCUMENT each input and its meaning\nDOCUMENT the returned value\nDOCUMENT important failure conditions\nKEEP documentation synchronized with behavior', pt: 'DOCUMENTAR o que a função faz\nDOCUMENTAR cada entrada e seu significado\nDOCUMENTAR o valor retornado\nDOCUMENTAR falhas importantes\nMANTER a documentação sincronizada com o comportamento' },
    expertLens: { en: 'Good documentation explains the contract and the reason. It does not narrate obvious syntax line by line.', pt: 'Boa documentação explica o contrato e o motivo. Ela não narra sintaxe óbvia linha por linha.' },
    likelyFailure: { en: 'Writing a comment instead of a real docstring, documenting outdated behavior, repeating the function name without adding meaning, or promising a return that does not exist.', pt: 'Escrever comentário em vez de docstring real, documentar comportamento desatualizado, repetir o nome da função sem acrescentar significado ou prometer um retorno inexistente.' },
    transferPrompt: { en: 'Write the documentation contract for a small function before implementing it, then verify that the implementation honors every sentence.', pt: 'Escreva o contrato de documentação de uma função pequena antes de implementá-la e depois confirme que a implementação cumpre cada frase.' },
  },
  16: {
    situation: { en: 'Two parts of a program use variables with similar names. One should be private to a function while another value must move explicitly between calls.', pt: 'Duas partes de um programa usam variáveis com nomes parecidos. Uma deve ser privada da função, enquanto outro valor precisa circular explicitamente entre chamadas.' },
    humanReasoning: { en: 'A variable lives in a room. Code inside the room can see its local objects; code outside cannot reach in unless a value is returned or passed through the door.', pt: 'Uma variável vive em uma sala. O código dentro da sala vê seus objetos locais; o código de fora não alcança esses objetos, a menos que um valor seja retornado ou passado pela porta.' },
    decomposition: { en: 'Identify who owns each value, keep temporary work local, pass required state as parameters, return updated state, and avoid shared global state unless the design truly requires it.', pt: 'Identifique quem é dono de cada valor, mantenha trabalho temporário local, passe estado necessário por parâmetros, retorne estado atualizado e evite estado global compartilhado sem necessidade real.' },
    flow: { en: 'caller state → parameter → local variables → returned new state → caller stores it', pt: 'estado do chamador → parâmetro → variáveis locais → novo estado retornado → chamador guarda o resultado' },
    pseudocode: { en: 'SET total in the caller\nDEFINE add_amount(current_total, amount)\n  CREATE local updated_total\n  RETURN updated_total\ntotal = CALL add_amount(total, amount)', pt: 'DEFINIR total no chamador\nDEFINIR adicionar_valor(total_atual, valor)\n  CRIAR total_atualizado local\n  RETORNAR total_atualizado\ntotal = CHAMAR adicionar_valor(total, valor)' },
    expertLens: { en: 'Explicit data flow is easier to test than hidden global mutation. Prefer parameters and return values when state must cross a function boundary.', pt: 'Fluxo de dados explícito é mais fácil de testar que mutação global escondida. Prefira parâmetros e retornos quando o estado precisar atravessar a fronteira de uma função.' },
    likelyFailure: { en: 'Reading a local variable outside its function, shadowing an outer name without noticing, using global to bypass design, or assuming a local counter remembers a previous call.', pt: 'Ler variável local fora da função, esconder um nome externo sem perceber, usar global para contornar o design ou imaginar que um contador local lembra a chamada anterior.' },
    transferPrompt: { en: 'Draw the ownership of three values in a small program and show which ones are local, passed in, returned, or intentionally shared.', pt: 'Desenhe a propriedade de três valores em um programa pequeno e mostre quais são locais, recebidos, retornados ou compartilhados de propósito.' },
  },
  17: {
    situation: { en: 'Important data already exists outside the program in a text file, report, export, or log. The program must open it safely and turn its contents into usable values.', pt: 'Dados importantes já existem fora do programa em um arquivo de texto, relatório, exportação ou log. O programa precisa abri-lo com segurança e transformar o conteúdo em valores úteis.' },
    humanReasoning: { en: 'Reading a file is like opening a document, choosing how much to read, interpreting each line, and closing it even if something goes wrong.', pt: 'Ler um arquivo é como abrir um documento, escolher quanto ler, interpretar cada linha e fechá-lo mesmo quando algo dá errado.' },
    decomposition: { en: 'Identify the path and encoding, choose whole-file or line-by-line reading, define how text becomes structured data, and decide what should happen when the file is missing or malformed.', pt: 'Identifique caminho e codificação, escolha leitura completa ou linha a linha, defina como o texto vira dado estruturado e decida o que fazer se o arquivo não existir ou estiver inválido.' },
    flow: { en: 'file path → open context → raw text/lines → parse and clean → validated data → close automatically', pt: 'caminho → contexto de abertura → texto/linhas → interpretar e limpar → dados validados → fechamento automático' },
    pseudocode: { en: 'OPEN the file using a context manager\nFOR each required line\n  REMOVE formatting characters\n  CONVERT or SPLIT into fields\n  VALIDATE before using\nRETURN the collected data', pt: 'ABRIR o arquivo com gerenciador de contexto\nPARA cada linha necessária\n  REMOVER caracteres de formatação\n  CONVERTER ou SEPARAR em campos\n  VALIDAR antes de usar\nRETORNAR os dados reunidos' },
    expertLens: { en: 'Choose the reading strategy from file size and processing needs. Line-by-line reading avoids loading an entire large file into memory.', pt: 'Escolha a estratégia de leitura pelo tamanho do arquivo e pela necessidade de processamento. Ler linha a linha evita carregar um arquivo grande inteiro na memória.' },
    likelyFailure: { en: 'Using the wrong relative path, forgetting encoding, keeping newline characters, converting invalid text blindly, or opening without a context manager.', pt: 'Usar caminho relativo errado, esquecer a codificação, manter quebras de linha, converter texto inválido sem verificar ou abrir sem gerenciador de contexto.' },
    transferPrompt: { en: 'Design a reader for a small exported file. Define its format, one malformed line, and how the program should respond.', pt: 'Projete a leitura de um pequeno arquivo exportado. Defina o formato, uma linha inválida e como o programa deve responder.' },
  },
  18: {
    situation: { en: 'A program produces information that must survive after it closes: a report, audit log, export, configuration, or saved state.', pt: 'Um programa produz informações que precisam sobreviver ao fechamento: relatório, log de auditoria, exportação, configuração ou estado salvo.' },
    humanReasoning: { en: 'Saving means choosing a destination, a format, and whether new information replaces the old content or is added to it.', pt: 'Salvar significa escolher destino, formato e se a nova informação substitui o conteúdo anterior ou é acrescentada.' },
    decomposition: { en: 'Define the file purpose, choose overwrite or append deliberately, format each record consistently, write with an explicit encoding, and verify the saved result by reading it back.', pt: 'Defina o propósito do arquivo, escolha sobrescrever ou acrescentar conscientemente, formate cada registro de forma consistente, escreva com codificação explícita e verifique lendo de volta.' },
    flow: { en: 'program data → serialize/format → open correct mode → write → flush/close → read-back verification', pt: 'dados do programa → serializar/formatar → abrir no modo correto → escrever → fechar → verificar lendo novamente' },
    pseudocode: { en: 'FORMAT the data as stable text\nOPEN the destination in the intended mode\nWRITE the content\nCLOSE automatically\nREAD it back and confirm the contract', pt: 'FORMATAR os dados como texto estável\nABRIR o destino no modo pretendido\nESCREVER o conteúdo\nFECHAR automaticamente\nLER novamente e confirmar o contrato' },
    expertLens: { en: 'Treat file output as an interface. Stable formatting and atomic replacement matter when another program or person will consume it.', pt: 'Trate a saída em arquivo como uma interface. Formatação estável e substituição segura importam quando outra pessoa ou programa consumirá o conteúdo.' },
    likelyFailure: { en: 'Using write mode when append was intended, duplicating headers, forgetting line separators, writing non-string objects directly, or assuming success without checking the file.', pt: 'Usar modo de escrita quando queria acrescentar, duplicar cabeçalhos, esquecer separadores de linha, escrever objetos não textuais diretamente ou presumir sucesso sem verificar.' },
    transferPrompt: { en: 'Choose a real report or log and specify its file mode, record format, validation, and read-back test.', pt: 'Escolha um relatório ou log real e especifique modo de arquivo, formato do registro, validação e teste de leitura.' },
  },
  19: {
    situation: { en: 'Structured data must move between programs, files, and APIs without losing lists, objects, numbers, booleans, and null values.', pt: 'Dados estruturados precisam circular entre programas, arquivos e APIs sem perder listas, objetos, números, booleanos e valores nulos.' },
    humanReasoning: { en: 'JSON is a written representation of data, not a Python dictionary itself. Encoding turns Python data into text; decoding rebuilds Python values from that text.', pt: 'JSON é uma representação escrita dos dados, não um dicionário Python em si. Codificar transforma dados Python em texto; decodificar reconstrói valores Python a partir desse texto.' },
    decomposition: { en: 'Define the schema, distinguish Python objects from JSON text, serialize only supported values, decode before accessing fields, validate required keys, and handle invalid documents.', pt: 'Defina o formato, diferencie objetos Python de texto JSON, serialize apenas valores compatíveis, decodifique antes de acessar campos, valide chaves obrigatórias e trate documentos inválidos.' },
    flow: { en: 'Python dict/list → json.dumps or json.dump → JSON text/file → json.loads or json.load → Python values', pt: 'dict/list Python → json.dumps ou json.dump → texto/arquivo JSON → json.loads ou json.load → valores Python' },
    pseudocode: { en: 'CREATE structured Python data\nENCODE it as JSON when sending or saving\nDECODE JSON when receiving or reading\nVALIDATE expected keys and types\nUSE the validated values', pt: 'CRIAR dados estruturados em Python\nCODIFICAR como JSON ao enviar ou salvar\nDECODIFICAR JSON ao receber ou ler\nVALIDAR chaves e tipos esperados\nUSAR os valores validados' },
    expertLens: { en: 'A JSON document has a schema even when no formal schema file exists. Make expected fields, types, and optional values explicit.', pt: 'Um documento JSON possui um esquema mesmo sem arquivo formal. Torne explícitos os campos, tipos e valores opcionais esperados.' },
    likelyFailure: { en: 'Treating JSON text like a dictionary, confusing dump with dumps, using single quotes in hand-written JSON, or trusting missing and wrongly typed fields.', pt: 'Tratar texto JSON como dicionário, confundir dump com dumps, usar aspas simples em JSON escrito manualmente ou confiar em campos ausentes e tipos errados.' },
    transferPrompt: { en: 'Design a small JSON payload for an API or saved configuration and explain its schema, optional fields, and validation.', pt: 'Projete um pequeno JSON para uma API ou configuração salva e explique o formato, campos opcionais e validação.' },
  },
  20: {
    situation: { en: 'A program must calculate deadlines, durations, ordering, or reporting periods. Dates displayed to people are not enough; the program needs actual datetime values.', pt: 'Um programa precisa calcular prazos, durações, ordem ou períodos de relatório. Datas exibidas para pessoas não bastam; o programa precisa de valores datetime reais.' },
    humanReasoning: { en: 'A date is a point on a calendar, a time is a clock reading, a datetime combines both, and a timedelta represents a duration between points.', pt: 'Uma data é um ponto no calendário, um horário é uma leitura do relógio, datetime combina ambos e timedelta representa duração entre pontos.' },
    decomposition: { en: 'Identify the input format and timezone assumptions, parse text into datetime objects, perform arithmetic or comparison with real values, and format only at the display boundary.', pt: 'Identifique formato de entrada e suposições de fuso, converta texto em datetime, faça cálculos ou comparações com valores reais e formate apenas na exibição.' },
    flow: { en: 'date text/source → parse → datetime value → compare/add/subtract → format for user', pt: 'texto/fonte de data → interpretar → valor datetime → comparar/somar/subtrair → formatar para o usuário' },
    pseudocode: { en: 'PARSE the received date using the documented format\nCALCULATE the deadline or duration\nCOMPARE actual datetime values\nFORMAT the final value for display', pt: 'INTERPRETAR a data recebida usando o formato documentado\nCALCULAR prazo ou duração\nCOMPARAR valores datetime reais\nFORMATAR o valor final para exibição' },
    expertLens: { en: 'Store and calculate with datetime objects; format strings belong at input and output boundaries. Record timezone assumptions before production use.', pt: 'Armazene e calcule com objetos datetime; strings formatadas pertencem às fronteiras de entrada e saída. Registre suposições de fuso antes de uso real.' },
    likelyFailure: { en: 'Comparing date strings, mixing day/month order, confusing duration with a calendar date, calling now repeatedly during one calculation, or ignoring timezones.', pt: 'Comparar datas como texto, misturar ordem dia/mês, confundir duração com data, chamar now várias vezes no mesmo cálculo ou ignorar fusos.' },
    transferPrompt: { en: 'Model one deadline rule. Specify input format, timezone assumption, calculation, boundary case, and displayed result.', pt: 'Modele uma regra de prazo. Especifique formato de entrada, suposição de fuso, cálculo, caso limite e resultado exibido.' },
  },
  21: {
    situation: { en: 'A simulation, sample, game, or test needs varied values. The program should generate variation intentionally and reproduce it when debugging.', pt: 'Uma simulação, amostra, jogo ou teste precisa de valores variados. O programa deve gerar variação de forma consciente e conseguir reproduzi-la ao depurar.' },
    humanReasoning: { en: 'Randomness chooses from a defined set or distribution. The developer still controls the allowed range, probabilities, sample size, and reproducibility.', pt: 'Aleatoriedade escolhe dentro de um conjunto ou distribuição definida. O desenvolvedor ainda controla intervalo, probabilidades, tamanho da amostra e reprodução.' },
    decomposition: { en: 'Define the population and distribution, choose with or without replacement, set a seed for repeatable tests when needed, and verify that generated values stay within the contract.', pt: 'Defina população e distribuição, escolha com ou sem reposição, use seed para testes reproduzíveis quando necessário e confirme que os valores respeitam o contrato.' },
    flow: { en: 'population/range + random generator state → selection/sample → validation → simulation result', pt: 'população/intervalo + estado do gerador → escolha/amostra → validação → resultado da simulação' },
    pseudocode: { en: 'DEFINE the allowed outcomes\nOPTIONALLY set a seed for testing\nGENERATE or SAMPLE using the correct rule\nREPEAT enough times for the simulation\nCHECK range and distribution assumptions', pt: 'DEFINIR os resultados permitidos\nOPCIONALMENTE definir seed para teste\nGERAR ou AMOSTRAR com a regra correta\nREPETIR o necessário para a simulação\nVERIFICAR intervalo e suposições de distribuição' },
    expertLens: { en: 'Pseudo-random values are deterministic from a seed. That is a feature for tests, but this module is not appropriate for passwords or security tokens.', pt: 'Valores pseudoaleatórios são determinísticos a partir de uma seed. Isso ajuda em testes, mas este módulo não é apropriado para senhas ou tokens de segurança.' },
    likelyFailure: { en: 'Using randint boundaries incorrectly, sampling more unique items than exist, reseeding inside a loop, expecting one small sample to prove fairness, or using random for security.', pt: 'Errar limites do randint, pedir mais itens únicos do que existem, redefinir seed dentro do loop, achar que uma amostra pequena prova equilíbrio ou usar random para segurança.' },
    transferPrompt: { en: 'Design a reproducible simulation or test-data generator and explain its range, distribution, seed policy, and validation.', pt: 'Projete uma simulação reproduzível ou gerador de dados de teste e explique intervalo, distribuição, política de seed e validação.' },
  },
  22: {
    situation: { en: 'A calculation needs operations beyond basic arithmetic, such as square roots, ceilings, logarithms, distance, or precise mathematical constants.', pt: 'Um cálculo precisa de operações além da aritmética básica, como raízes, arredondamentos, logaritmos, distância ou constantes matemáticas.' },
    humanReasoning: { en: 'The math module is a toolbox. The difficult part is selecting the formula and understanding its domain, units, and rounding rule before calling a function.', pt: 'O módulo math é uma caixa de ferramentas. A parte difícil é escolher a fórmula e entender domínio, unidades e regra de arredondamento antes de chamar uma função.' },
    decomposition: { en: 'Write the mathematical rule, identify units and valid inputs, choose the matching function or constant, calculate with full precision, then round only according to the business requirement.', pt: 'Escreva a regra matemática, identifique unidades e entradas válidas, escolha a função ou constante correspondente, calcule com precisão completa e arredonde somente pela regra do negócio.' },
    flow: { en: 'validated numeric inputs → formula/math function → full-precision result → domain-specific rounding → output', pt: 'entradas numéricas validadas → fórmula/função math → resultado preciso → arredondamento do domínio → saída' },
    pseudocode: { en: 'VALIDATE numeric inputs and units\nAPPLY the documented formula\nCHECK the mathematical domain\nROUND only at the required boundary\nSHOW the value with its unit', pt: 'VALIDAR entradas numéricas e unidades\nAPLICAR a fórmula documentada\nVERIFICAR o domínio matemático\nARREDONDAR somente no ponto exigido\nMOSTRAR o valor com sua unidade' },
    expertLens: { en: 'A correct function call can still produce a wrong business result when the formula, unit conversion, or rounding rule is wrong.', pt: 'Uma chamada correta pode produzir resultado de negócio errado quando fórmula, conversão de unidade ou arredondamento estiverem incorretos.' },
    likelyFailure: { en: 'Rounding intermediate values, passing invalid negative values to square root, mixing degrees and radians, or using floor/ceil without understanding the policy.', pt: 'Arredondar valores intermediários, passar valor negativo inválido para raiz, misturar graus e radianos ou usar floor/ceil sem entender a política.' },
    transferPrompt: { en: 'Choose one real calculation and document its formula, units, valid domain, rounding policy, and independent check.', pt: 'Escolha um cálculo real e documente fórmula, unidades, domínio válido, política de arredondamento e verificação independente.' },
  },
  23: {
    situation: { en: 'Real programs receive missing files, invalid text, unavailable services, impossible values, and user mistakes. A professional program must fail deliberately instead of collapsing unpredictably.', pt: 'Programas reais recebem arquivos ausentes, texto inválido, serviços indisponíveis, valores impossíveis e erros de usuário. Um programa profissional precisa falhar de forma deliberada.' },
    humanReasoning: { en: 'An exception is a signal that the normal path could not continue. Handling means deciding which failures are expected here, what recovery is safe, and which failures must still propagate.', pt: 'Uma exceção é um sinal de que o caminho normal não pôde continuar. Tratar significa decidir quais falhas são esperadas aqui, qual recuperação é segura e quais ainda precisam se propagar.' },
    decomposition: { en: 'Keep the try block small, catch specific exceptions, validate predictable conditions before exceptional work, provide a useful recovery or message, and use finally only for cleanup that must always happen.', pt: 'Mantenha o try pequeno, capture exceções específicas, valide condições previsíveis antes do trabalho excepcional, ofereça recuperação ou mensagem útil e use finally apenas para limpeza obrigatória.' },
    flow: { en: 'normal operation → possible exception → specific handler or propagation → cleanup → continued or safely stopped program', pt: 'operação normal → possível exceção → tratamento específico ou propagação → limpeza → programa continua ou para com segurança' },
    pseudocode: { en: 'TRY the smallest operation that may fail\nEXCEPT the specific expected error\n  EXPLAIN or RECOVER safely\nELSE continue the success path\nFINALLY perform required cleanup', pt: 'TENTAR a menor operação que pode falhar\nEXCETO o erro específico esperado\n  EXPLICAR ou RECUPERAR com segurança\nSENÃO continuar o caminho de sucesso\nFINALMENTE realizar a limpeza obrigatória' },
    expertLens: { en: 'Do not catch Exception merely to silence failures. Preserve context, log what helps investigation, and let unexpected defects remain visible.', pt: 'Não capture Exception apenas para esconder falhas. Preserve contexto, registre o que ajuda na investigação e mantenha defeitos inesperados visíveis.' },
    likelyFailure: { en: 'Using a bare except, wrapping the entire program in one try, continuing with invalid state, confusing validation with exception handling, or hiding the original error.', pt: 'Usar except vazio, envolver o programa inteiro em um try, continuar com estado inválido, confundir validação com tratamento de exceções ou esconder o erro original.' },
    transferPrompt: { en: 'Map the failure policy for a small workflow: expected errors, validation, recovery, message, logging, cleanup, and unexpected-error behavior.', pt: 'Mapeie a política de falhas de um fluxo pequeno: erros esperados, validação, recuperação, mensagem, registro, limpeza e comportamento para erro inesperado.' },
  },
  24: {
    situation: { en: 'You must deliver a calculator that accepts repeated operations, validates input, produces correct results, and remains understandable when a new operation is added.', pt: 'Você precisa entregar uma calculadora que aceite operações repetidas, valide entradas, produza resultados corretos e continue compreensível quando uma nova operação for adicionada.' },
    humanReasoning: { en: 'A complete program is a conversation: show options, receive a choice, collect operands, validate them, calculate through the correct responsibility, display the result, and decide whether to continue.', pt: 'Um programa completo é uma conversa: mostrar opções, receber escolha, coletar operandos, validar, calcular pela responsabilidade correta, exibir e decidir se continua.' },
    decomposition: { en: 'Separate menu, input conversion, operation functions, operation dispatch, error messages, repetition, and tests. Build and verify one path before adding the next.', pt: 'Separe menu, conversão de entrada, funções de operação, seleção da operação, mensagens de erro, repetição e testes. Construa e verifique um caminho antes do próximo.' },
    flow: { en: 'menu → choice → operands → validation → selected function → result/error → continue or exit', pt: 'menu → escolha → operandos → validação → função selecionada → resultado/erro → continuar ou sair' },
    pseudocode: { en: 'DEFINE one function per operation\nWHILE the user has not exited\n  SHOW the menu\n  READ and validate the choice\n  READ and validate operands\n  CALL the selected function\n  SHOW result or a specific error\nTEST normal, boundary, and invalid cases', pt: 'DEFINIR uma função por operação\nENQUANTO o usuário não sair\n  MOSTRAR o menu\n  LER e validar a escolha\n  LER e validar operandos\n  CHAMAR a função selecionada\n  MOSTRAR resultado ou erro específico\nTESTAR casos normais, limites e inválidos' },
    expertLens: { en: 'A project is not “done” when one calculation works. It is done when responsibilities are clear, failure paths are intentional, and tests protect future changes.', pt: 'Um projeto não está “pronto” quando um cálculo funciona. Está pronto quando responsabilidades são claras, falhas são intencionais e testes protegem mudanças futuras.' },
    likelyFailure: { en: 'Writing everything in one loop, duplicating arithmetic, dividing by zero without a policy, accepting invalid choices, or testing only the happy path.', pt: 'Escrever tudo em um único loop, duplicar cálculos, dividir por zero sem política, aceitar escolhas inválidas ou testar somente o caminho feliz.' },
    transferPrompt: { en: 'Explain how the same menu-validation-dispatch structure could become a unit converter or pricing tool.', pt: 'Explique como a mesma estrutura de menu, validação e seleção poderia virar conversor de unidades ou ferramenta de preços.' },
  },
  25: {
    situation: { en: 'A program must maintain a collection of records over time: create new records, find them, change them, and remove them without corrupting the collection.', pt: 'Um programa precisa manter uma coleção de registros ao longo do tempo: criar, localizar, alterar e remover sem corromper a coleção.' },
    humanReasoning: { en: 'CRUD describes four intentions, but every intention depends on identity. Before updating or deleting, the program must know exactly which record is targeted.', pt: 'CRUD descreve quatro intenções, mas todas dependem de identidade. Antes de atualizar ou excluir, o programa precisa saber exatamente qual registro é o alvo.' },
    decomposition: { en: 'Define the record schema and unique identifier, separate one function per operation, validate before mutation, handle not-found and duplicate cases, and keep user interaction outside data logic.', pt: 'Defina formato e identificador único, separe uma função por operação, valide antes de alterar, trate não encontrado e duplicidade e mantenha interação fora da lógica de dados.' },
    flow: { en: 'user request → validate command/data → locate by ID → create/read/update/delete → confirm result → persist or continue', pt: 'solicitação → validar comando/dados → localizar por ID → criar/ler/atualizar/excluir → confirmar resultado → persistir ou continuar' },
    pseudocode: { en: 'DEFINE the record schema and ID rule\nDEFINE create, find, update, and delete functions\nFOR each command\n  VALIDATE the request\n  LOCATE the target when required\n  APPLY exactly one operation\n  REPORT success or a specific failure\nTEST duplicates and missing IDs', pt: 'DEFINIR o formato do registro e regra do ID\nDEFINIR funções criar, buscar, atualizar e excluir\nPARA cada comando\n  VALIDAR a solicitação\n  LOCALIZAR o alvo quando necessário\n  APLICAR exatamente uma operação\n  INFORMAR sucesso ou falha específica\nTESTAR duplicidades e IDs ausentes' },
    expertLens: { en: 'Business rules belong in reusable functions, not inside menu branches. That separation lets a future web interface reuse the same data logic.', pt: 'Regras de negócio pertencem a funções reutilizáveis, não aos ramos do menu. Essa separação permite que uma futura interface web reutilize a mesma lógica.' },
    likelyFailure: { en: 'Using list positions as permanent IDs, editing while searching unpredictably, allowing duplicates, deleting the wrong match, or mixing printing with every data operation.', pt: 'Usar posição da lista como ID permanente, alterar durante busca imprevisível, permitir duplicidades, excluir o resultado errado ou misturar print em toda operação de dados.' },
    transferPrompt: { en: 'Model another CRUD domain and define its schema, identity rule, validation, not-found behavior, and one invariant that must never break.', pt: 'Modele outro domínio CRUD e defina formato, regra de identidade, validação, comportamento para não encontrado e uma regra que nunca pode quebrar.' },
  },
  26: {
    situation: { en: 'A collection of raw records is available, but a decision requires trustworthy totals, groups, rates, outliers, and an explanation of what the numbers do and do not prove.', pt: 'Uma coleção de registros brutos está disponível, mas uma decisão exige totais, grupos, taxas, valores atípicos e uma explicação do que os números provam ou não.' },
    humanReasoning: { en: 'Analysis is a chain: understand the question, inspect the data, clean invalid records, calculate transparent metrics, compare results, and communicate evidence with limitations.', pt: 'Análise é uma cadeia: entender a pergunta, inspecionar dados, limpar registros inválidos, calcular métricas transparentes, comparar resultados e comunicar evidências com limitações.' },
    decomposition: { en: 'Define the decision question, list required fields, establish data-quality rules, separate cleaning from calculation, compute metrics with explicit denominators, and verify results independently.', pt: 'Defina a pergunta de decisão, liste campos necessários, estabeleça regras de qualidade, separe limpeza de cálculo, compute métricas com denominadores explícitos e verifique por outro caminho.' },
    flow: { en: 'raw records → inspect → validate/clean → transform → aggregate → compare → explain limitations and decision', pt: 'registros brutos → inspecionar → validar/limpar → transformar → agregar → comparar → explicar limitações e decisão' },
    pseudocode: { en: 'DEFINE the question and expected evidence\nFOR each record\n  VALIDATE required fields\n  CLEAN or reject according to a rule\n  UPDATE transparent aggregates\nCALCULATE rates using documented denominators\nVERIFY key totals\nREPORT findings and limitations', pt: 'DEFINIR a pergunta e evidência esperada\nPARA cada registro\n  VALIDAR campos obrigatórios\n  LIMPAR ou rejeitar conforme regra\n  ATUALIZAR agregações transparentes\nCALCULAR taxas com denominadores documentados\nVERIFICAR totais principais\nRELATAR achados e limitações' },
    expertLens: { en: 'A polished number is not automatically a trustworthy insight. Keep raw counts, denominators, exclusions, and assumptions visible.', pt: 'Um número bonito não é automaticamente um insight confiável. Mantenha visíveis contagens brutas, denominadores, exclusões e suposições.' },
    likelyFailure: { en: 'Calculating before inspecting data, silently dropping invalid records, dividing by the wrong population, confusing correlation with cause, or reporting a metric without context.', pt: 'Calcular antes de inspecionar, descartar inválidos em silêncio, dividir pela população errada, confundir correlação com causa ou relatar métrica sem contexto.' },
    transferPrompt: { en: 'Create an analysis plan for another dataset: decision question, quality checks, metrics, denominator, validation, and limitations.', pt: 'Crie um plano de análise para outro conjunto: pergunta de decisão, verificações de qualidade, métricas, denominador, validação e limitações.' },
  },
  27: {
    situation: { en: 'You must combine the entire Python foundation into a claims terminal system that another person can understand, test, and extend without rewriting everything.', pt: 'Você precisa combinar toda a base de Python em um sistema de sinistros no terminal que outra pessoa consiga entender, testar e ampliar sem reescrever tudo.' },
    humanReasoning: { en: 'A capstone is not one giant exercise. It is a set of contracts: record data, validate it, calculate outcomes, update status, persist information, produce reports, and recover from expected failures.', pt: 'Um capstone não é um exercício gigante. É um conjunto de contratos: registrar dados, validar, calcular resultados, atualizar status, persistir, gerar relatórios e recuperar de falhas esperadas.' },
    decomposition: { en: 'Define requirements and acceptance tests, design the record schema, divide the system into modules or functions, implement vertical slices, persist safely, test edge cases, refactor, and document decisions.', pt: 'Defina requisitos e testes de aceitação, projete o formato dos registros, divida em módulos ou funções, implemente fluxos completos pequenos, persista com segurança, teste limites, refatore e documente decisões.' },
    flow: { en: 'requirements → data model → architecture → small working slice → tests → persistence → reports → refactor → documented delivery', pt: 'requisitos → modelo de dados → arquitetura → pequeno fluxo funcionando → testes → persistência → relatórios → refatoração → entrega documentada' },
    pseudocode: { en: 'WRITE acceptance criteria\nDESIGN claim records and identity\nDEFINE responsibilities for input, validation, calculations, storage, and reporting\nIMPLEMENT one complete workflow at a time\nTEST normal, boundary, invalid, and persistence cases\nREFACTOR duplicated or unclear code\nDOCUMENT how to run and extend the system', pt: 'ESCREVER critérios de aceitação\nPROJETAR registros e identidade dos sinistros\nDEFINIR responsabilidades de entrada, validação, cálculos, armazenamento e relatórios\nIMPLEMENTAR um fluxo completo por vez\nTESTAR casos normais, limites, inválidos e persistência\nREFATORAR duplicação e falta de clareza\nDOCUMENTAR como executar e ampliar o sistema' },
    expertLens: { en: 'Professional delivery balances correctness, clarity, testability, and scope. A smaller complete system is stronger evidence than many half-finished features.', pt: 'Entrega profissional equilibra correção, clareza, testabilidade e escopo. Um sistema menor e completo é evidência melhor que várias funções pela metade.' },
    likelyFailure: { en: 'Starting with menus instead of requirements, putting everything in one file and function, changing the data model midstream without migration, skipping persistence tests, or adding features before core flows work.', pt: 'Começar pelo menu em vez dos requisitos, colocar tudo em um arquivo e função, mudar o modelo de dados sem adaptação, ignorar testes de persistência ou adicionar recursos antes do fluxo principal funcionar.' },
    transferPrompt: { en: 'Explain how you would adapt the architecture to inventory, inspections, or service tickets while preserving validation, persistence, reporting, and tests.', pt: 'Explique como adaptaria a arquitetura para estoque, inspeções ou chamados preservando validação, persistência, relatórios e testes.' },
  },
}

function genericBlueprint(phase: Phase): PhaseBlueprint {
  const concept = phase.title
  return {
    situation: {
      en: `${phase.description.en} Treat this as a problem to reason about, not a code shape to memorize.`,
      pt: `${phase.description.pt} Trate isso como um problema para raciocinar, não como um formato de código para decorar.`,
    },
    humanReasoning: {
      en: `Before Python, describe what a person would need to know and do to solve a problem involving ${concept.en}.`,
      pt: `Antes do Python, descreva o que uma pessoa precisaria saber e fazer para resolver um problema envolvendo ${concept.pt}.`,
    },
    decomposition: {
      en: 'Separate the problem into inputs, state to store, rules, decisions or repetitions, output, and stopping condition.',
      pt: 'Separe o problema em entradas, estado a guardar, regras, decisões ou repetições, saída e condição de parada.',
    },
    flow: { en: 'INPUT → STORE → PROCESS → DECIDE/REPEAT → OUTPUT', pt: 'ENTRADA → GUARDAR → PROCESSAR → DECIDIR/REPETIR → SAÍDA' },
    pseudocode: { en: 'RECEIVE the required data\nAPPLY one rule at a time\nVERIFY the result\nRETURN or SHOW the result', pt: 'RECEBER os dados necessários\nAPLICAR uma regra por vez\nVERIFICAR o resultado\nRETORNAR ou MOSTRAR o resultado' },
    expertLens: {
      en: 'An experienced developer makes the data flow and contract clear before choosing syntax or libraries.',
      pt: 'Um desenvolvedor experiente deixa claros o fluxo de dados e o contrato antes de escolher sintaxe ou bibliotecas.',
    },
    likelyFailure: {
      en: 'Starting with syntax before the problem, then patching the code until one example happens to work.',
      pt: 'Começar pela sintaxe antes do problema e remendar o código até que um exemplo funcione por acaso.',
    },
    transferPrompt: {
      en: `Invent a different problem where ${concept.en} would be useful and explain why.`,
      pt: `Invente outro problema em que ${concept.pt} seria útil e explique por quê.`,
    },
  }
}

function authoredText(blocks: LessonBlock[]) {
  return blocks.filter(block => block.type !== 'code')
}

function authoredCode(blocks: LessonBlock[]) {
  return blocks.filter(block => block.type === 'code')
}

function authoredWarnings(blocks: LessonBlock[]) {
  return blocks.filter(block => block.type === 'warning' || block.type === 'tip')
}

/** Learning Engine V2: every phase follows the same reasoning-first contract.
 * Foundation phases 0–27 have hand-authored blueprints; later phases use the
 * same engine with their existing authored content until their dedicated migration.
 */
export function getPedagogicalJourney(phase: Phase): LessonUnit[] {
  const blueprint = FOUNDATION_BLUEPRINTS[phase.id] || genericBlueprint(phase)
  const blocks = phase.lesson.blocks
  const sourceText = authoredText(blocks)
  const sourceCode = authoredCode(blocks)
  const warnings = authoredWarnings(blocks)
  const concept = phase.title
  const miniProject = getMiniProjectForPhase(phase.id)

  return [
    {
      id: 'challenge', kind: 'challenge', icon: '🎯',
      title: { en: '1. The challenge', pt: '1. O desafio' },
      purpose: { en: 'Know what must be solved before seeing a solution.', pt: 'Entenda o que precisa ser resolvido antes de ver uma solução.' },
      blocks: [
        heading('Do not start with code', 'Não comece pelo código'),
        text(blueprint.situation.en, blueprint.situation.pt),
        tip('Your first answer may be incomplete. The goal is to expose your current model before the lesson changes it.', 'Sua primeira resposta pode estar incompleta. O objetivo é revelar seu modelo atual antes que a aula o transforme.'),
      ],
      checkpoint: { en: 'What exactly must the program accomplish? State the result without mentioning Python commands.', pt: 'O que exatamente o programa precisa realizar? Declare o resultado sem mencionar comandos de Python.' },
      checkpointPlaceholder: { en: 'The program must receive..., apply..., and produce...', pt: 'O programa precisa receber..., aplicar... e produzir...' },
    },
    {
      id: 'intuition', kind: 'intuition', icon: '🌎',
      title: { en: '2. Human intuition', pt: '2. Intuição humana' },
      purpose: { en: 'Solve the idea as a person before asking a computer to do it.', pt: 'Resolva a ideia como pessoa antes de pedir que o computador faça.' },
      blocks: [
        heading('How would a person solve it?', 'Como uma pessoa resolveria?'),
        text(blueprint.humanReasoning.en, blueprint.humanReasoning.pt),
        ...sourceText.slice(0, Math.max(1, Math.ceil(sourceText.length / 4))),
      ],
      checkpoint: { en: 'Explain how you would solve one example using paper, speech, or a calculator—without code.', pt: 'Explique como resolveria um exemplo usando papel, fala ou calculadora — sem código.' },
      checkpointPlaceholder: { en: 'First I would... Then... I would know I am done when...', pt: 'Primeiro eu... Depois... Eu saberia que terminei quando...' },
    },
    {
      id: 'decomposition', kind: 'decomposition', icon: '🧩',
      title: { en: '3. Break the problem down', pt: '3. Divida o problema' },
      purpose: { en: 'Turn a vague task into small, testable responsibilities.', pt: 'Transforme uma tarefa vaga em responsabilidades pequenas e testáveis.' },
      blocks: [
        heading('A program is built from responsibilities', 'Um programa é construído com responsabilidades'),
        text(blueprint.decomposition.en, blueprint.decomposition.pt),
        text('Ask: What enters? What must be remembered? What rule changes the data? What leaves? What can go wrong?', 'Pergunte: O que entra? O que precisa ser lembrado? Qual regra altera os dados? O que sai? O que pode dar errado?'),
        tip(blueprint.expertLens.en, blueprint.expertLens.pt),
      ],
      checkpoint: { en: 'List the inputs, stored state, rules, output, and one edge case for this problem.', pt: 'Liste as entradas, o estado guardado, as regras, a saída e um caso limite deste problema.' },
      checkpointPlaceholder: { en: 'Inputs: ...\nState: ...\nRules: ...\nOutput: ...\nEdge case: ...', pt: 'Entradas: ...\nEstado: ...\nRegras: ...\nSaída: ...\nCaso limite: ...' },
    },
    {
      id: 'flow', kind: 'flow', icon: '🗺️',
      title: { en: '4. See the data flow', pt: '4. Veja o fluxo dos dados' },
      purpose: { en: 'Follow information through the solution before writing syntax.', pt: 'Acompanhe a informação pela solução antes de escrever sintaxe.' },
      blocks: [
        heading('The route taken by the data', 'O caminho percorrido pelos dados'),
        text(blueprint.flow.en, blueprint.flow.pt),
        text('At each arrow, ask what changed. If nothing changed, ask why that step exists. If something changed, name the old and new state.', 'Em cada seta, pergunte o que mudou. Se nada mudou, pergunte por que o passo existe. Se algo mudou, nomeie o estado anterior e o novo.'),
      ],
      checkpoint: { en: 'Rewrite the flow and describe what changes at each arrow.', pt: 'Reescreva o fluxo e descreva o que muda em cada seta.' },
      checkpointPlaceholder: { en: 'Input → ... because ... → output', pt: 'Entrada → ... porque ... → saída' },
    },
    {
      id: 'pseudocode', kind: 'pseudocode', icon: '✍️',
      title: { en: '5. Write pseudocode', pt: '5. Escreva pseudocódigo' },
      purpose: { en: 'Express the solution precisely without being blocked by Python syntax.', pt: 'Expresse a solução com precisão sem ficar bloqueado pela sintaxe do Python.' },
      blocks: [
        heading('Logic before syntax', 'Lógica antes da sintaxe'),
        text(blueprint.pseudocode.en, blueprint.pseudocode.pt),
        tip('Pseudocode is not fake code to memorize. It is a promise: every step must later have a clear implementation and a way to verify it.', 'Pseudocódigo não é código falso para decorar. É um compromisso: cada passo precisa ter uma implementação clara e uma forma de verificação.'),
      ],
      checkpoint: { en: 'Write your own pseudocode in 3–8 ordered steps. Include decisions or repetition only when the problem requires them.', pt: 'Escreva seu pseudocódigo em 3–8 passos ordenados. Inclua decisões ou repetição somente quando o problema exigir.' },
      checkpointPlaceholder: { en: 'RECEIVE...\nSTORE...\nIF/WHILE...\nSHOW...', pt: 'RECEBER...\nGUARDAR...\nSE/ENQUANTO...\nMOSTRAR...' },
    },
    {
      id: 'python', kind: 'python', icon: '🐍',
      title: { en: '6. Translate into Python', pt: '6. Traduza para Python' },
      purpose: { en: 'Map each reasoning step to Python deliberately.', pt: 'Relacione cada passo do raciocínio ao Python de forma deliberada.' },
      blocks: [
        heading('Now syntax has a reason to exist', 'Agora a sintaxe tem motivo para existir'),
        text('Read the code from top to bottom. For every important line, identify the pseudocode step it implements and the program state before and after it runs.', 'Leia o código de cima para baixo. Para cada linha importante, identifique o passo do pseudocódigo que ela implementa e o estado do programa antes e depois da execução.'),
        ...sourceCode,
        ...sourceText.slice(Math.max(1, Math.ceil(sourceText.length / 4)), Math.max(2, Math.ceil(sourceText.length / 2))),
      ],
      checkpoint: { en: 'Select one line and explain which pseudocode step it implements, what it reads, and what it changes.', pt: 'Escolha uma linha e explique qual passo do pseudocódigo ela implementa, o que lê e o que altera.' },
      checkpointPlaceholder: { en: 'This line implements... It reads... It changes...', pt: 'Esta linha implementa... Ela lê... Ela altera...' },
    },
    {
      id: 'walkthrough', kind: 'walkthrough', icon: '🔍',
      title: { en: '7. Trace it line by line', pt: '7. Acompanhe linha por linha' },
      purpose: { en: 'Build a mental model of execution instead of recognizing code by appearance.', pt: 'Construa um modelo mental da execução, em vez de reconhecer código pela aparência.' },
      blocks: [
        heading('Freeze the program after each step', 'Congele o programa depois de cada passo'),
        text('Create a small trace table. Record the current line, relevant variable values, decision result, and visible output. This is how you turn invisible execution into evidence.', 'Crie uma pequena tabela de rastreamento. Registre a linha atual, os valores relevantes, o resultado da decisão e a saída visível. Assim você transforma execução invisível em evidência.'),
        ...sourceText.slice(Math.max(2, Math.ceil(sourceText.length / 2)), Math.max(3, Math.ceil((sourceText.length * 3) / 4))),
        tip(blueprint.expertLens.en, blueprint.expertLens.pt),
      ],
      checkpoint: { en: 'Trace one example for at least three execution steps. Show how one value changes.', pt: 'Rastreie um exemplo por pelo menos três passos de execução. Mostre como um valor muda.' },
      checkpointPlaceholder: { en: 'Step 1: ...\nStep 2: ...\nStep 3: ...', pt: 'Passo 1: ...\nPasso 2: ...\nPasso 3: ...' },
    },
    {
      id: 'debug', kind: 'debug', icon: '🐞',
      title: { en: '8. Break and debug it', pt: '8. Quebre e depure' },
      purpose: { en: 'Use failures to test and correct the mental model.', pt: 'Use falhas para testar e corrigir o modelo mental.' },
      blocks: [
        heading('A bug is a mismatch between expectation and reality', 'Um bug é a diferença entre expectativa e realidade'),
        text(blueprint.likelyFailure.en, blueprint.likelyFailure.pt),
        ...warnings,
        warning('Change one thing at a time. Predict what the change should affect before running again.', 'Mude uma coisa por vez. Preveja o que a alteração deve afetar antes de executar novamente.'),
      ],
      checkpoint: { en: 'Describe one bug, the observable symptom, your hypothesis, and the smallest test that could confirm it.', pt: 'Descreva um bug, o sintoma observável, sua hipótese e o menor teste capaz de confirmá-la.' },
      checkpointPlaceholder: { en: 'Symptom... Hypothesis... Small test...', pt: 'Sintoma... Hipótese... Teste pequeno...' },
    },
    {
      id: 'practice', kind: 'practice', icon: '🛠️',
      title: { en: '9. Plan deliberate practice', pt: '9. Planeje a prática deliberada' },
      purpose: { en: 'Enter the editor with a plan, not with guesses.', pt: 'Entre no editor com um plano, não com adivinhações.' },
      blocks: [
        heading('The editor is where you test reasoning', 'O editor é onde você testa o raciocínio'),
        text(`This phase has ${phase.exercises.length} exercises. Before each one, restate its contract: inputs, output, rules, edge cases, and evidence of correctness.`, `Esta fase tem ${phase.exercises.length} exercícios. Antes de cada um, reformule o contrato: entradas, saída, regras, casos limite e evidência de correção.`),
        tip('Use a hint only after writing exactly where your reasoning stopped. Copying removes the evidence needed to learn.', 'Use uma dica somente depois de escrever exatamente onde seu raciocínio parou. Copiar remove a evidência necessária para aprender.'),
        ...(miniProject ? [tip(
          `This block ends with the mini-project “${miniProject.title.en}”. You will have to understand, plan, implement, test, and refactor—not merely reproduce an example.`,
          `Este bloco termina com o mini projeto “${miniProject.title.pt}”. Você terá que entender, planejar, implementar, testar e refatorar — não apenas reproduzir um exemplo.`,
        )] : []),
      ],
      checkpoint: { en: 'Plan the first exercise: contract, approach, first test, and expected result.', pt: 'Planeje o primeiro exercício: contrato, abordagem, primeiro teste e resultado esperado.' },
      checkpointPlaceholder: { en: 'Contract...\nApproach...\nFirst test...\nExpected result...', pt: 'Contrato...\nAbordagem...\nPrimeiro teste...\nResultado esperado...' },
    },
    {
      id: 'transfer', kind: 'transfer', icon: '🚀',
      title: { en: '10. Explain and transfer', pt: '10. Explique e transfira' },
      purpose: { en: 'Prove that the idea can leave the lesson example.', pt: 'Comprove que a ideia consegue sair do exemplo da aula.' },
      blocks: [
        heading('Passing is not mastery', 'Passar não é dominar'),
        text('Mastery means you can rebuild the reasoning without looking, explain why the solution works, reject an unsuitable approach, and adapt the idea to new data or rules.', 'Domínio significa reconstruir o raciocínio sem olhar, explicar por que a solução funciona, rejeitar uma abordagem inadequada e adaptar a ideia a novos dados ou regras.'),
        ...sourceText.slice(Math.max(3, Math.ceil((sourceText.length * 3) / 4))),
        text(blueprint.transferPrompt.en, blueprint.transferPrompt.pt),
      ],
      checkpoint: { en: `Create a different problem involving ${concept.en}. Explain the shared reasoning and what must change.`, pt: `Crie outro problema envolvendo ${concept.pt}. Explique o raciocínio compartilhado e o que precisa mudar.` },
      checkpointPlaceholder: { en: 'New problem...\nSame reasoning...\nWhat changes...', pt: 'Novo problema...\nMesmo raciocínio...\nO que muda...' },
    },
  ]
}

export function lessonReflectionKey(learnerId: string, phaseId: number, unitId: string) {
  return `hp_lesson_reflection_v2_${learnerId}_${phaseId}_${unitId}`
}

export function loadLessonReflection(learnerId: string, phaseId: number, unitId: string) {
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(lessonReflectionKey(learnerId, phaseId, unitId)) || ''
}

export function saveLessonReflection(learnerId: string, phaseId: number, unitId: string, value: string) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(lessonReflectionKey(learnerId, phaseId, unitId), value)
}

export function completedLessonUnits(learnerId: string, phase: Phase) {
  return getPedagogicalJourney(phase).filter(unit => loadLessonReflection(learnerId, phase.id, unit.id).trim().length >= 12).length
}

export function isLearningEngineV2Migrated(phaseId: number) {
  return Object.prototype.hasOwnProperty.call(FOUNDATION_BLUEPRINTS, phaseId)
}

/** Backward-compatible name used by the first Learning Engine integrity tests. */
export const isFoundationV2Migrated = isLearningEngineV2Migrated
