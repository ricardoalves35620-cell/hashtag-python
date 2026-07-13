import type { Bilingual, LessonBlock, Phase } from '../data/types'

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

/** Learning Engine V2.1: every phase follows the same reasoning-first contract.
 * Foundation phases 0–12 have hand-authored blueprints; later phases use the
 * same engine with their existing authored content until their dedicated migration.
 */
export function getPedagogicalJourney(phase: Phase): LessonUnit[] {
  const blueprint = FOUNDATION_BLUEPRINTS[phase.id] || genericBlueprint(phase)
  const blocks = phase.lesson.blocks
  const sourceText = authoredText(blocks)
  const sourceCode = authoredCode(blocks)
  const warnings = authoredWarnings(blocks)
  const concept = phase.title

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

export function isFoundationV2Migrated(phaseId: number) {
  return Object.prototype.hasOwnProperty.call(FOUNDATION_BLUEPRINTS, phaseId)
}
