import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Catches the damage a bulk rename does to prose.
 *
 * Replacing a word can collide with the word already next to it — "Ask damage amount"
 * became "Ask amount amount", "coverage rate" became "cover rate rate". It can also
 * splice identifiers together, producing invalid Python inside a lesson.
 *
 * Both are invisible to every other audit, because the content is still structurally
 * valid. Run this after ANY bulk text replacement.
 */
const IGNORE_DUPES = new Set(['border', 'flex', 'grid', 'const', 'checkpoint', 'token', 'open'])
const files: string[] = []
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.tsx?$/.test(name) && !name.includes('.test.')) files.push(path)
  }
}
walk('src')

let issues = 0
for (const path of files) {
  const text = readFileSync(path, 'utf8')
  const short = path.split('/').pop()

  for (const m of text.matchAll(/\b([A-Za-zÀ-ÿ]{3,}) \1(?![A-Za-zÀ-ÿ])/gi)) {
    if (IGNORE_DUPES.has(m[1].toLowerCase())) continue
    console.log(`${short}: duplicated word — "${m[0]}"`)
    issues++
  }
  // an identifier with a space in it, produced by overlapping replacements
  for (const m of text.matchAll(/\{([a-z_]+ [a-z_]+)[:}]/g)) {
    if (/^(your|seu|sua)\b/.test(m[1])) continue
    console.log(`${short}: identifier contains a space — "{${m[1]}}"`)
    issues++
  }
  for (const m of text.matchAll(/\b([a-z]{2,})_\1\b/g)) {
    console.log(`${short}: doubled identifier part — "${m[0]}"`)
    issues++
  }
}
console.log(`\n${issues} text-quality issues`)
