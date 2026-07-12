/**
 * Utilities that remove predictable answer-position and answer-length patterns
 * without changing the underlying curriculum data.
 */

export interface OrderedOption {
  originalIndex: number
  displayIndex: number
}

export function createAssessmentSeed(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const value = new Uint32Array(1)
    crypto.getRandomValues(value)
    return value[0]
  }
  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
}

export function hashAssessmentKey(seed: number, key: string): number {
  let hash = (2166136261 ^ seed) >>> 0
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffledIndices(length: number, seed: number, key: string): number[] {
  const values = Array.from({ length }, (_, index) => index)
  const random = mulberry32(hashAssessmentKey(seed, key))

  for (let index = values.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1))
    ;[values[index], values[other]] = [values[other], values[index]]
  }

  // Avoid preserving a completely predictable authored order by chance.
  if (length > 1 && values.every((value, index) => value === index)) {
    values.push(values.shift() as number)
  }

  return values
}

export function shuffledCopy<T>(items: readonly T[], seed: number, key: string): T[] {
  return shuffledIndices(items.length, seed, key).map(index => items[index])
}

/**
 * Quiz choices historically embedded the teaching explanation in the correct
 * option (for example, "14 — multiplication runs first"). That makes the
 * longest choice an unintended hint. The explanation already exists below the
 * question, so choices are shown in a concise form before grading.
 */
export function conciseAssessmentOption(text: string): string {
  const trimmed = text.trim()

  const dashMatch = trimmed.match(/^(.{1,60}?)\s+[—–]\s+(.{8,})$/u)
  if (dashMatch) return dashMatch[1].trim()

  const parentheticalMatch = trimmed.match(/^([^()]{1,40}?)\s+\(([^()]{8,})\)$/u)
  if (parentheticalMatch && !/[=\[\]{}]/.test(parentheticalMatch[1])) {
    return parentheticalMatch[1].trim()
  }

  return trimmed
}

export function correctDisplayPosition(order: readonly number[], correctIndex: number): number {
  return order.indexOf(correctIndex)
}
