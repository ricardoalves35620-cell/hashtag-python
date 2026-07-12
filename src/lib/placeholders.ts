export interface PlaceholderLocation {
  line: number
  column: number
  token: string
}

/**
 * Finds exercise placeholders in executable Python code while ignoring
 * comments and string literals. This prevents comments such as
 * "remove ___" from blocking a correct solution.
 */
export function findPythonPlaceholders(code: string): PlaceholderLocation[] {
  const results: PlaceholderLocation[] = []
  const lines = code.replace(/\r/g, '').split('\n')
  let triple: "'''" | '\"\"\"' | null = null

  lines.forEach((line, lineIndex) => {
    let i = 0
    let quote: "'" | '\"' | null = null
    let escaped = false

    while (i < line.length) {
      if (triple) {
        const end = line.indexOf(triple, i)
        if (end === -1) return
        i = end + 3
        triple = null
        continue
      }

      if (!quote && (line.startsWith("'''", i) || line.startsWith('\"\"\"', i))) {
        triple = line.startsWith("'''", i) ? "'''" : '"""'
        i += 3
        continue
      }

      const char = line[i]
      if (quote) {
        if (escaped) escaped = false
        else if (char === '\\') escaped = true
        else if (char === quote) quote = null
        i += 1
        continue
      }

      if (char === '#') break
      if (char === "'" || char === '\"') {
        quote = char
        i += 1
        continue
      }

      const rest = line.slice(i)
      const match = rest.match(/^(?:___|\bTODO\b|YOUR CODE HERE)/i)
      if (match) {
        results.push({ line: lineIndex + 1, column: i + 1, token: match[0] })
        i += match[0].length
        continue
      }
      i += 1
    }
  })

  return results
}
