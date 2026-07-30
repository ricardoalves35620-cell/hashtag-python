"""
Checks that every pinned expectation in phases 0-20 is actually PRODUCIBLE.

Two grading architectures, one question. Phases 0-8 run the learner's whole script and
match its output; phases 9-20 run the learner's function against an `afterCode` snippet
and compare stdout to a literal. In both, the expected value is something a human typed,
and until this existed nothing had ever run a correct solution to confirm it.

That is the defect that put `Running: {{file}}` and a stale `Queue size: 3` in front of a
learner, and that made the phase 27 capstone promise $23,300 while printing $22,550. In
phases 9-20 it is worse still, because the learner never sees the afterCode: a wrong
literal is an exercise that cannot be passed, with no way to tell which side is lying.

So: one reference solution per exercise, in reference_solutions.py, each written from
the task's STATED rules rather than from the expectation it is checked against. If a
solution that follows the description fails, the exercise is wrong — not the learner.

    npm run audit:content:expectations
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cache import EXERCISES_JSON  # noqa: E402  (path set above)
import json
import os
import re
import subprocess
import sys
import textwrap

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from reference_solutions import REFERENCES

PINS_OUTPUT = {'equals', 'equals_any', 'matches', 'numeric_equals', 'contains', 'contains_any'}


def normalise(text):
    return '\n'.join(line.rstrip() for line in (text or '').replace('\r', '').split('\n') if line.strip()).strip()


# Mirrors the worker: the whole program is compiled with top-level await allowed
# (Pyodide's runPythonAsync does exactly this), so an afterCode may `await` a
# coroutine directly. asyncio.run drives it here because CPython has no already-
# running loop — the one place the two runtimes legitimately differ.
_DRIVER = (
    "import ast, asyncio, sys\n"
    "src = sys.argv[1]\n"
    "code = compile(src, '<learner>', 'exec', flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)\n"
    "g = {'__name__': '__main__'}\n"
    "coro = eval(code, g, g)\n"
    "if coro is not None:\n"
    "    asyncio.run(coro)\n"
)


def run(code, inputs):
    proc = subprocess.run([sys.executable, '-c', _DRIVER, code], input='\n'.join(inputs) + '\n',
                          capture_output=True, text=True, timeout=15)
    if proc.returncode:
        return None, proc.stderr.strip().split('\n')[-1]
    return proc.stdout, None


def values_of(check):
    value = check['value']
    return [str(item) for item in value] if isinstance(value, list) else [str(value)]


def check_fails(check, output):
    """Mirrors the check semantics in src/lib/pyodide.ts."""
    kind = check['type']
    raw, tidy = output, normalise(output)
    if kind == 'no_error':
        return None
    if kind in ('equals', 'equals_any'):
        return None if tidy in [normalise(v) for v in values_of(check)] else f'output is not {values_of(check)[0]!r}'
    if kind == 'numeric_equals':
        return None if tidy in [normalise(v) for v in values_of(check)] else f'output is not {values_of(check)[0]!r}'
    if kind == 'matches':
        return None if re.search(values_of(check)[0], raw) else f'output does not match /{values_of(check)[0]}/'
    if kind in ('contains', 'contains_any'):
        return None if any(v in raw for v in values_of(check)) else f'output does not contain {values_of(check)!r}'
    return None


exercises = json.load(open(EXERCISES_JSON, encoding='utf-8'))
checked = failed = skipped = 0

for exercise in exercises:
    reference = REFERENCES.get(exercise['id'])
    if not reference:
        # An exercise with a behaviour spec is already verified by execution — the spec's
        # reference IS run, on every case, by behaviourGrading.ts. Counting those as
        # "no reference" would report a gap that does not exist.
        graded = any(check['type'] in PINS_OUTPUT for test in exercise['tests'] for check in test['checks'])
        if graded and not exercise['behaviourCases']:
            skipped += 1
            print(f"p{exercise['phase']} {exercise['id']}  graded, but nothing has ever run a correct solution")
        continue

    for index, test in enumerate(exercise['tests']):
        pins = [check for check in test['checks'] if check['type'] in PINS_OUTPUT]
        if not pins:
            continue
        checked += 1
        code = reference + ('\n' + test['afterCode'] if test['afterCode'] else '')
        output, error = run(code, test['inputs'])
        if error:
            print(f"p{exercise['phase']} {exercise['id']} [test {index}]  reference RAISED {error}")
            failed += 1
            continue
        problems = [problem for problem in (check_fails(check, output) for check in pins) if problem]
        if problems:
            print(f"p{exercise['phase']} {exercise['id']} [test {index}]")
            if test['afterCode']:
                print(f"    after    : {textwrap.shorten(test['afterCode'], 90)}")
            if test['inputs']:
                print(f"    inputs   : {test['inputs']}")
            print(f"    problem  : {problems[0]}")
            print(f"    produced : {normalise(output)!r}")
            failed += 1

print(f"\n{checked} graded tests checked against a real run, {failed} do not match")
print(f"{skipped} graded exercises still have no reference")
sys.exit(1 if failed else 0)
