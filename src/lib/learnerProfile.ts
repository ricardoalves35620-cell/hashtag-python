/**
 * Personalisation for the whole curriculum.
 *
 * The learner names their own folder and file in Base Zero. From then on every
 * lesson, exercise, hint and checkpoint refers to THEIR names instead of a
 * stranger's. Substitution happens at render time, so the stored phase data stays
 * generic and the curriculum audits keep seeing the canonical text.
 *
 * Two ways a phase can opt in:
 *   1. Placeholders — {{name}}, {{folder}}, {{file}}
 *   2. Nothing at all — any text that already mentions the canonical defaults
 *      (ProjetosPython, meu_primeiro.py) is rewritten automatically.
 *
 * The second rule is what makes this app-wide without editing 69 files.
 */

const STORAGE_KEY = 'hp_learner_profile'

export interface LearnerProfile {
  name: string
  folder: string
  file: string
}

/** Canonical values used in authored content, and the fallback when nothing is set. */
export const DEFAULT_PROFILE: LearnerProfile = {
  name: '',
  folder: 'ProjetosPython',
  file: 'meu_primeiro.py',
}

/**
 * Learner input reaches Python code blocks, prose and regular expressions, so it is
 * restricted to characters that are safe in all three. Anything else is dropped
 * rather than escaped — a name is not worth a broken lesson.
 */
function sanitize(value: string, maxLength = 40): string {
  return value
    .normalize('NFC')
    .replace(/[^A-Za-z0-9 ._-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function sanitizeProfile(input: Partial<LearnerProfile>): LearnerProfile {
  const name = sanitize(input.name || '', 24)
  const folder = sanitize(input.folder || '', 40).replace(/[./]/g, '')
  const file = sanitize(input.file || '', 40)
  return {
    name,
    folder: folder || DEFAULT_PROFILE.folder,
    file: /^[A-Za-z0-9 _-]+[.]py$/.test(file) ? file : DEFAULT_PROFILE.file,
  }
}

let cached: LearnerProfile | null = null

export function loadLearnerProfile(): LearnerProfile {
  if (cached) return cached
  if (typeof localStorage === 'undefined') return DEFAULT_PROFILE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    cached = raw ? sanitizeProfile(JSON.parse(raw)) : DEFAULT_PROFILE
  } catch {
    cached = DEFAULT_PROFILE
  }
  return cached
}

export function saveLearnerProfile(patch: Partial<LearnerProfile>): LearnerProfile {
  const next = sanitizeProfile({ ...loadLearnerProfile(), ...patch })
  cached = next
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage full or blocked. Personalisation is cosmetic, so carry on.
    }
  }
  return next
}

/** Called by resetLearningProgress so a reset really does start over. */
export function clearLearnerProfile() {
  cached = null
  if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY)
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, match => '\\' + match)
}

/**
 * Rewrites a single string for the current learner. Safe to call on any text:
 * with nothing stored it returns the canonical wording unchanged, so guests and
 * fresh devices see exactly what the author wrote.
 */
export function personalize(text: string, profile: LearnerProfile = loadLearnerProfile()): string {
  if (!text) return text

  let out = text
    .replace(/\{\{\s*folder\s*\}\}/g, profile.folder)
    .replace(/\{\{\s*file\s*\}\}/g, profile.file)

  // {{name}} has no sensible generic fallback, so drop a trailing comma with it
  // rather than rendering "Nice work, ." for someone who never gave a name.
  out = profile.name
    ? out.replace(/\{\{\s*name\s*\}\}/g, profile.name)
    : out.replace(/,?\s*\{\{\s*name\s*\}\}/g, '')

  if (profile.folder !== DEFAULT_PROFILE.folder) {
    out = out.replace(new RegExp(escapeForRegex(DEFAULT_PROFILE.folder), 'g'), profile.folder)
  }
  if (profile.file !== DEFAULT_PROFILE.file) {
    out = out.replace(new RegExp(escapeForRegex(DEFAULT_PROFILE.file), 'g'), profile.file)
  }

  return out
}

/** Convenience for the many places that hold bilingual content. */
export function personalizeBilingual<T extends { en: string; pt: string }>(value: T): T {
  const profile = loadLearnerProfile()
  return { ...value, en: personalize(value.en, profile), pt: personalize(value.pt, profile) }
}
