import fs from 'node:fs'
import path from 'node:path'

const source = path.resolve(process.argv[2] || 'playwright-report/autopilot')
const destination = path.resolve(process.argv[3] || 'playwright-report/slim')

if (!fs.existsSync(source)) {
  throw new Error(`Audit report not found: ${source}`)
}

fs.rmSync(destination, { recursive: true, force: true })
fs.mkdirSync(destination, { recursive: true })

for (const name of ['index.html', 'state.json', 'live-status.txt', 'last-run.txt']) {
  const from = path.join(source, name)
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(destination, name))
}

const cyclesRoot = path.join(source, 'cycles')
if (fs.existsSync(cyclesRoot)) {
  for (const entry of fs.readdirSync(cyclesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const fromCycle = path.join(cyclesRoot, entry.name)
    const toCycle = path.join(destination, 'cycles', entry.name)
    fs.mkdirSync(toCycle, { recursive: true })

    for (const name of ['content.json', 'results.json']) {
      const from = path.join(fromCycle, name)
      if (fs.existsSync(from)) fs.copyFileSync(from, path.join(toCycle, name))
    }
  }
}

console.log(`Slim audit report created at ${destination}`)
