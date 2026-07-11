import type { TestCase, Check } from '../data/types'

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInstance>
    _pyodideInstance?: PyodideInstance
  }
}

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>
  globals: { get: (key: string) => unknown }
}

let pyodideReady: Promise<PyodideInstance> | null = null

export function getPyodide(): Promise<PyodideInstance> {
  if (pyodideReady) return pyodideReady
  pyodideReady = new Promise((resolve, reject) => {
    if (window._pyodideInstance) { resolve(window._pyodideInstance); return }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
    script.onload = async () => {
      try {
        const pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/' })
        window._pyodideInstance = pyodide
        resolve(pyodide)
      } catch (e) { reject(e) }
    }
    script.onerror = () => reject(new Error('Failed to load Pyodide'))
    document.head.appendChild(script)
  })
  return pyodideReady
}

export async function runCode(
  pyodide: PyodideInstance,
  code: string,
  inputs: string[] = [],
  inputMap?: Record<string, string>
): Promise<{ output: string; error: string | null }> {

  const inputsJson = JSON.stringify(inputs.map(String))
  const inputMapJson = JSON.stringify(inputMap || {})

  // IMPORTANT: User code starts at line 27 (offset = 26)
  const wrapper = `
import sys
import builtins
from io import StringIO

_hp_inputs = ${inputsJson}
_hp_map = ${inputMapJson}
_hp_idx = [0]
_hp_buf = StringIO()
_hp_err = None

_orig_input = builtins.input
_orig_stdout = sys.stdout

def _hp_input(prompt=''):
    _hp_buf.write(str(prompt))
    p = str(prompt).lower()

    # Smart keyword matching — order-independent
    if _hp_map:
        # Sort by key length descending (longer = more specific)
        for key in sorted(_hp_map.keys(), key=len, reverse=True):
            if key.lower() in p:
                val = _hp_map[key]
                _hp_buf.write(val + '\\n')
                return val

    # Fall back to positional
    if _hp_idx[0] < len(_hp_inputs):
        val = str(_hp_inputs[_hp_idx[0]])
        _hp_idx[0] += 1
        _hp_buf.write(val + '\\n')
        return val
    else:
        raise EOFError("No more test inputs. Add more lines to the test inputs box.")

builtins.input = _hp_input
sys.stdout = _hp_buf

try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except SystemExit:
    pass
except EOFError as _e:
    _hp_err = f"EOFError: {_e}"
except MemoryError:
    _hp_err = "MemoryError: Your code ran into an infinite loop. Check your while loop's exit condition."
except Exception as _e:
    _hp_err = f"{type(_e).__name__}: {_e}"

sys.stdout = _orig_stdout
builtins.input = _orig_input
_hp_output = _hp_buf.getvalue()
`

  try {
    await pyodide.runPythonAsync(wrapper)
    const output = String(pyodide.globals.get('_hp_output') || '')
    const error = pyodide.globals.get('_hp_err')
    return { output, error: error ? String(error) : null }
  } catch (e) {
    return { output: '', error: String(e) }
  }
}

function checkOutput(output: string, check: Check): boolean {
  const o = check.caseSensitive ? output : output.toLowerCase()
  if (check.type === 'no_error') return true
  if (check.type === 'contains') {
    const v = check.caseSensitive ? String(check.value) : String(check.value).toLowerCase()
    return o.includes(v)
  }
  if (check.type === 'contains_any') {
    const values = Array.isArray(check.value) ? check.value : [check.value as string]
    return values.some(v => o.includes(check.caseSensitive ? v : v.toLowerCase()))
  }
  if (check.type === 'not_contains') {
    const v = check.caseSensitive ? String(check.value) : String(check.value).toLowerCase()
    return !o.includes(v)
  }
  return false
}

export interface TestResult {
  id: string
  description: { en: string; pt: string }
  passed: boolean
  points: number
  output: string
  error: string | null
}

export async function runExam(
  pyodide: PyodideInstance,
  code: string,
  testCases: TestCase[]
): Promise<{ results: TestResult[]; score: number }> {
  const results: TestResult[] = []

  for (const tc of testCases) {
    const { output, error } = await runCode(pyodide, code, tc.inputs, tc.inputMap)

    let passed = true
    if (error && tc.checks.some(c => c.type !== 'no_error')) {
      passed = false
    } else {
      for (const check of tc.checks) {
        if (check.type === 'no_error') {
          if (error) { passed = false; break }
        } else {
          if (!checkOutput(output, check)) { passed = false; break }
        }
      }
    }

    results.push({ id: tc.id, description: tc.description, passed, points: passed ? tc.points : 0, output, error })
  }

  const totalPoints = testCases.reduce((s, tc) => s + tc.points, 0)
  const earnedPoints = results.reduce((s, r) => s + r.points, 0)
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  return { results, score }
}
