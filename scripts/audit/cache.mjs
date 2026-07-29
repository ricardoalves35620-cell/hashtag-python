import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Where the audit scripts keep the files they hand to each other.
 *
 * This used to be `/tmp`, hardcoded, in eleven scripts and six npm scripts. On the
 * machine this project is actually developed on — Windows — `/tmp/ex0_20.json` resolves
 * to `C:\tmp\...` if it resolves at all, so half the audit suite could not run there at
 * all. The owner of the repository could not verify his own build.
 *
 * A folder inside the repository instead: identical on every platform, inspectable when a
 * checker disagrees with you, and git-ignored so it never ends up in a commit.
 */
export const CACHE_DIR = process.env.HP_AUDIT_CACHE || '.audit-cache'

mkdirSync(CACHE_DIR, { recursive: true })

export const cachePath = name => join(CACHE_DIR, name)

export const EXERCISES_JSON = cachePath('exercises.json')
export const REFERENCES_JSON = cachePath('references.json')
export const REFERENCES_PT_JSON = cachePath('references.pt.json')
