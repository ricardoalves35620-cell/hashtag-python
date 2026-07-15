import fs from 'node:fs'
import path from 'node:path'

const source = path.resolve(process.argv[2] || 'playwright-report/autopilot')
const destination = path.resolve(process.argv[3] || 'playwright-report/slim')

if (!fs.existsSync(source)) throw new Error(`Audit report not found: ${source}`)

const readJson = file => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
}

const state = readJson(path.join(source, 'state.json')) || {}
const cycles = Array.isArray(state.cycles) ? state.cycles : []
const cycleNumbers = cycles.map(cycle => Number(cycle.number)).filter(Number.isInteger)
const representative = new Set()

if (cycleNumbers.length > 0) {
  representative.add(cycleNumbers[0])
  representative.add(cycleNumbers.at(-1))
}

for (const issue of Object.values(state.issues || {})) {
  const firstCycle = Number(issue?.details?.firstCycle || issue?.cycle)
  const lastCycle = Number(issue?.details?.lastCycle)
  if (Number.isInteger(firstCycle)) representative.add(firstCycle)
  if (Number.isInteger(lastCycle)) representative.add(lastCycle)
}

const latestByEnvironment = new Map()
for (const cycle of cycles) {
  const key = `${cycle.device}|${cycle.lang}|${cycle.theme}`
  latestByEnvironment.set(key, Number(cycle.number))
}
for (const number of latestByEnvironment.values()) representative.add(number)

function sanitize(value, keepImages) {
  if (Array.isArray(value)) return value.map(item => sanitize(item, keepImages))
  if (!value || typeof value !== 'object') return value

  const copy = {}
  for (const [key, item] of Object.entries(value)) {
    if (key === 'attachments' && Array.isArray(item)) {
      copy[key] = item.map(attachment => {
        const next = { ...attachment }
        if ('path' in next) {
          next.originalPath = next.path
          delete next.path
          next.omitted = 'Local artifact path is not portable in the slim report.'
        }
        if (typeof next.contentType === 'string' && next.contentType.startsWith('image/') && !keepImages) {
          delete next.body
          next.omitted = 'Screenshot body removed from non-representative cycle.'
        }
        return sanitize(next, keepImages)
      })
    } else {
      copy[key] = sanitize(item, keepImages)
    }
  }
  return copy
}

fs.rmSync(destination, { recursive: true, force: true })
fs.mkdirSync(destination, { recursive: true })

for (const name of ['index.html', 'state.json', 'content.json', 'v11-readiness.json', 'live-status.txt', 'last-run.txt']) {
  const from = path.join(source, name)
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(destination, name))
}

const cyclesRoot = path.join(source, 'cycles')
if (fs.existsSync(cyclesRoot)) {
  for (const entry of fs.readdirSync(cyclesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const cycleNumber = Number(entry.name.replace(/\D+/g, ''))
    const fromCycle = path.join(cyclesRoot, entry.name)
    const toCycle = path.join(destination, 'cycles', entry.name)
    fs.mkdirSync(toCycle, { recursive: true })

    const contentFile = path.join(fromCycle, 'content.json')
    if (fs.existsSync(contentFile)) {
      const content = readJson(contentFile)
      fs.writeFileSync(path.join(toCycle, 'content.json'), content ? JSON.stringify(content) : fs.readFileSync(contentFile))
    }

    const resultsFile = path.join(fromCycle, 'results.json')
    if (fs.existsSync(resultsFile)) {
      const results = readJson(resultsFile)
      if (results) {
        const compact = sanitize(results, representative.has(cycleNumber))
        fs.writeFileSync(path.join(toCycle, 'results.json'), JSON.stringify(compact))
      } else {
        fs.copyFileSync(resultsFile, path.join(toCycle, 'results.json'))
      }
    }
  }
}

const curriculumRoot = path.join(source, 'curriculum-audit')
if (fs.existsSync(curriculumRoot)) {
  fs.cpSync(curriculumRoot, path.join(destination, 'curriculum-audit'), { recursive: true })
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source,
  totalCycles: cycles.length,
  representativeCycles: [...representative].sort((a, b) => a - b),
  policy: {
    rootKeeps: ['content.json (single source-level scan)', 'v11-readiness.json (migration diagnostic)', 'state.json', 'index.html', 'last-run.txt'],
    allCyclesKeep: ['results.json metadata', 'deep-audit-summary'],
    representativeCyclesAlsoKeep: ['embedded screenshots'],
    removed: ['non-portable artifact paths', 'embedded screenshots from repeated cycles'],
  },
}
fs.writeFileSync(path.join(destination, 'slim-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

function directorySize(directory) {
  let total = 0
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    total += entry.isDirectory() ? directorySize(target) : fs.statSync(target).size
  }
  return total
}

const sizeMb = directorySize(destination) / 1024 / 1024
console.log(`Slim audit report created at ${destination}`)
console.log(`Representative cycles: ${manifest.representativeCycles.join(', ') || 'none'}`)
console.log(`Uncompressed size: ${sizeMb.toFixed(2)} MB`)
