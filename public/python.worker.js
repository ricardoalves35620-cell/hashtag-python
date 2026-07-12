/* Hashtag Python isolated runtime worker.
 * The worker can be terminated by the UI when student code exceeds its time limit.
 */
const PYODIDE_VERSION = '0.25.1'
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
let pyodidePromise = null

function loadEngine() {
  if (pyodidePromise) return pyodidePromise
  pyodidePromise = (async () => {
    self.importScripts(`${PYODIDE_BASE}pyodide.js`)
    return self.loadPyodide({ indexURL: PYODIDE_BASE })
  })()
  return pyodidePromise
}

function pythonLiteral(value) {
  return JSON.stringify(value)
}

function buildProgram(payload, execute) {
  const code = pythonLiteral(String(payload.code || ''))
  const inputs = pythonLiteral((payload.inputs || []).map(String))
  const inputMap = pythonLiteral(payload.inputMap || {})
  const setupCode = pythonLiteral(String(payload.setupCode || ''))
  const afterCode = pythonLiteral(String(payload.afterCode || ''))

  return `
import ast
import builtins
import json
import sys
import traceback
from io import StringIO

_hp_code = ${code}
_hp_inputs = ${inputs}
_hp_map = ${inputMap}
_hp_setup_code = ${setupCode}
_hp_after_code = ${afterCode}
_hp_execute = ${execute ? 'True' : 'False'}
_hp_input_index = [0]
_hp_student_buffer = StringIO()
_hp_test_buffer = StringIO()
_hp_error = None
_hp_test_error = None
_hp_analysis = None
_hp_student_output = ''
_hp_test_output = ''


def _hp_call_name(node):
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        parent = _hp_call_name(node.value)
        return f"{parent}.{node.attr}" if parent else node.attr
    return ''


def _hp_analyze(tree):
    node_counts = {}
    calls = []
    functions = []
    imports = []
    assigned_names = []
    literal_print_calls = 0
    docstring_functions = []

    for node in ast.walk(tree):
        name = type(node).__name__
        node_counts[name] = node_counts.get(name, 0) + 1
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            functions.append(node.name)
            if ast.get_docstring(node):
                docstring_functions.append(node.name)
        elif isinstance(node, (ast.Import, ast.ImportFrom)):
            if isinstance(node, ast.Import):
                imports.extend(alias.name for alias in node.names)
            else:
                imports.append(node.module or '')
        elif isinstance(node, ast.Call):
            call_name = _hp_call_name(node.func)
            if call_name:
                calls.append(call_name)
            if call_name == 'print' and node.args and all(isinstance(arg, ast.Constant) for arg in node.args):
                literal_print_calls += 1
        elif isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            assigned_names.append(node.id)

    has_main_guard = any(
        isinstance(node, ast.If)
        and isinstance(node.test, ast.Compare)
        and isinstance(node.test.left, ast.Name)
        and node.test.left.id == '__name__'
        for node in tree.body
    )

    return {
        'nodeCounts': node_counts,
        'calls': sorted(set(calls)),
        'functionNames': sorted(set(functions)),
        'imports': sorted(set(imports)),
        'assignedNames': sorted(set(assigned_names)),
        'literalPrintCalls': literal_print_calls,
        'docstringFunctions': sorted(set(docstring_functions)),
        'hasMainGuard': has_main_guard,
    }


def _hp_input(prompt=''):
    _hp_student_buffer.write(str(prompt))
    prompt_lower = str(prompt).lower()

    if _hp_map:
        for key in sorted(_hp_map.keys(), key=len, reverse=True):
            if key.lower() in prompt_lower:
                value = str(_hp_map[key])
                _hp_student_buffer.write(value + '\\n')
                return value

    if _hp_input_index[0] < len(_hp_inputs):
        value = str(_hp_inputs[_hp_input_index[0]])
        _hp_input_index[0] += 1
        _hp_student_buffer.write(value + '\\n')
        return value

    raise EOFError('No more test inputs. Add one value per line in the test inputs box.')


try:
    _hp_tree = ast.parse(_hp_code, filename='student_code.py', mode='exec')
    _hp_analysis = _hp_analyze(_hp_tree)
except SyntaxError as exc:
    _hp_error = f"SyntaxError: {exc.msg} (line {exc.lineno})"

if _hp_error is None and _hp_execute:
    _hp_original_input = builtins.input
    _hp_original_stdout = sys.stdout
    _hp_original_stderr = sys.stderr
    _hp_globals = {'__name__': '__main__', '__builtins__': builtins.__dict__}

    try:
        builtins.input = _hp_input
        sys.stdout = _hp_student_buffer
        sys.stderr = _hp_student_buffer

        if _hp_setup_code:
            exec(compile(_hp_setup_code, 'grader_setup.py', 'exec'), _hp_globals, _hp_globals)

        exec(compile(_hp_code, 'student_code.py', 'exec'), _hp_globals, _hp_globals)
    except SystemExit:
        pass
    except EOFError as exc:
        _hp_error = f"EOFError: {exc}"
    except MemoryError:
        _hp_error = 'MemoryError: the program used too much memory.'
    except BaseException as exc:
        _hp_trace = traceback.extract_tb(exc.__traceback__)
        _hp_student_frames = [frame for frame in _hp_trace if frame.filename == 'student_code.py']
        _hp_line = _hp_student_frames[-1].lineno if _hp_student_frames else None
        _hp_error = f"{type(exc).__name__}: {exc}" + (f" (line {_hp_line})" if _hp_line else '')
    finally:
        _hp_student_output = _hp_student_buffer.getvalue()
        builtins.input = _hp_original_input
        sys.stdout = _hp_original_stdout
        sys.stderr = _hp_original_stderr

    if _hp_error is None and _hp_after_code:
        try:
            sys.stdout = _hp_test_buffer
            sys.stderr = _hp_test_buffer
            exec(compile(_hp_after_code, 'grader_test.py', 'exec'), _hp_globals, _hp_globals)
        except BaseException as exc:
            _hp_test_error = f"{type(exc).__name__}: {exc}"
        finally:
            _hp_test_output = _hp_test_buffer.getvalue()
            sys.stdout = _hp_original_stdout
            sys.stderr = _hp_original_stderr

_hp_result_json = json.dumps({
    'output': _hp_student_output,
    'testOutput': _hp_test_output,
    'error': _hp_error,
    'testError': _hp_test_error,
    'analysis': _hp_analysis,
})
`
}

self.onmessage = async event => {
  const message = event.data || {}
  const requestId = message.requestId

  try {
    if (message.type === 'init') {
      self.postMessage({ type: 'status', requestId, status: 'loading' })
      await loadEngine()
      self.postMessage({ type: 'ready', requestId })
      return
    }

    if (message.type === 'analyze' || message.type === 'run') {
      const pyodide = await loadEngine()
      const payload = message.payload || {}

      // Pyodide ships scientific packages separately. Detect imports in every
      // executable fragment so lessons using NumPy/Pandas work without asking a
      // complete beginner to manage browser packages manually.
      if (message.type === 'run') {
        const importSource = [payload.setupCode, payload.code, payload.afterCode]
          .filter(Boolean)
          .join('\n')
        if (importSource.trim()) await pyodide.loadPackagesFromImports(importSource)
      }

      const program = buildProgram(payload, message.type === 'run')
      await pyodide.runPythonAsync(program)
      const raw = pyodide.globals.get('_hp_result_json')
      const result = JSON.parse(String(raw || '{}'))
      self.postMessage({ type: 'result', requestId, result })
      return
    }

    throw new Error(`Unknown worker message: ${message.type}`)
  } catch (error) {
    self.postMessage({
      type: 'failure',
      requestId,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
