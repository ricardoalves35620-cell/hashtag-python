export function normalizeAuditText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function stripAssessmentChoiceLabel(value: string): string {
  return normalizeAuditText(value).replace(/^[A-Z]\s*[.)-]\s*/i, '').trim()
}

export function auditTextsMatch(actual: string, expected: string): boolean {
  return stripAssessmentChoiceLabel(actual) === normalizeAuditText(expected)
}
