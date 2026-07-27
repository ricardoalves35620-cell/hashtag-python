/**
 * Names the LEARNER chooses may be written in their own language.
 *
 * Python's own vocabulary — if, for, def, print, import names — is part of the
 * language and stays English. But a variable the learner invents is theirs, and
 * failing a Brazilian beginner for writing `armazenamento` instead of `storage`
 * teaches vocabulary, not programming.
 *
 * This table is consulted only for `assignment` and `function` requirements. It is
 * deliberately a static table rather than machine translation: the app must work
 * offline, cost nothing to run, and behave identically every time.
 *
 * Adding a language later means adding entries here — nothing else changes.
 */

/** English identifier -> other spellings accepted for it. */
export const IDENTIFIER_ALIASES: Record<string, string[]> = {
  // Base Zero
  storage: ['armazenamento', 'armazenagem', 'disco'],
  long_term_files: ['arquivos_permanentes', 'arquivos_longo_prazo', 'armazenamento_permanente'],
  python_extension: ['extensao_python', 'extensao', 'extensao_do_python'],
  file_name: ['nome_arquivo', 'nome_do_arquivo', 'arquivo'],

  // Common beginner variables
  name: ['nome'],
  age: ['idade'],
  total: ['soma'],
  price: ['preco', 'valor'],
  count: ['contador', 'contagem'],
  result: ['resultado'],
  average: ['media'],
  average_score: ['media_notas', 'media_das_notas', 'nota_media'],
  order_total: ['total_pedido', 'total_do_pedido'],
  net_hours: ['horas_liquidas', 'horas_uteis'],
  service_fee: ['taxa_servico', 'taxa_de_servico'],
  inventory_value: ['valor_estoque', 'valor_do_estoque'],
  deadline_status: ['status_prazo', 'situacao_prazo'],
  reading_status: ['status_leitura', 'situacao_leitura'],
  local_status: ['status_local', 'situacao_local'],
  workload_label: ['rotulo_carga', 'rotulo_de_carga'],
  product_label: ['rotulo_produto', 'rotulo_do_produto'],
  due_date: ['data_vencimento', 'data_de_vencimento', 'vencimento'],

  // Common function names a learner may write from scratch
  greet: ['saudacao', 'cumprimentar', 'saudar'],
  calculate: ['calcular'],
  calculate_total: ['calcular_total'],
  circle_area: ['area_circulo', 'area_do_circulo'],
  rectangle_area: ['area_retangulo', 'area_do_retangulo'],
  clean_label: ['limpar_rotulo'],
  clean_names: ['limpar_nomes'],
  format_report: ['formatar_relatorio'],
  format_distance: ['formatar_distancia'],
  safe_payout: ['pagamento_seguro'],
  register_claim: ['registrar_sinistro', 'registrar_reclamacao'],
}

/** Accents, case and separator style should never decide whether an answer is right. */
function normalizeIdentifier(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // camelCase and snake_case describe the same name; style is taught elsewhere,
    // it should not decide whether an answer is counted as correct.
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * True when `candidate` is an acceptable spelling of the required identifier —
 * the English name itself, a listed translation, or either with different accents
 * or capitalisation.
 */
export function identifierMatches(required: string, candidate: string): boolean {
  const target = normalizeIdentifier(required)
  const actual = normalizeIdentifier(candidate)
  if (target === actual) return true
  return (IDENTIFIER_ALIASES[required] || []).some(alias => normalizeIdentifier(alias) === actual)
}

/** True when the learner passed using a translation rather than the English name. */
export function usedAlias(required: string, candidate: string): boolean {
  return identifierMatches(required, candidate) && normalizeIdentifier(required) !== normalizeIdentifier(candidate)
}
