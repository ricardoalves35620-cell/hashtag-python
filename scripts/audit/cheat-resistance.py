"""
Asks the only question that decides whether single-case grading matters here.

A single graded scenario cannot reject correct work — that failure mode belongs to
over-strict matching. What it can do is ACCEPT work that is wrong: a learner who types
the expected output as a literal, learns nothing, and is told they passed. For someone
teaching themselves with no one to check them, a false pass is the expensive kind of
wrong, because it is invisible.

So this does not theorise. For every graded exercise it builds the laziest possible
cheat — print the expected output, verbatim, computing nothing — and runs it through
the exercise's real checks AND its real structural requirements.

An exercise is cheat-resistant when that fails. The result is the evidence for whether
phases 0-8 need more cases or already have enough guard rails.

    python3 scripts/audit/cheat-resistance.py
"""

import ast
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from reference_solutions import REFERENCES

PINS_OUTPUT = {'equals', 'equals_any', 'matches', 'numeric_equals', 'contains', 'contains_any'}
EXERCISES = json.load(open('/tmp/ex0_20.json'))


def normalise(text):
    return '\n'.join(line.rstrip() for line in (text or '').replace('\r', '').split('\n') if line.strip()).strip()


def run(code, inputs):
    proc = subprocess.run([sys.executable, '-c', code], input='\n'.join(inputs) + '\n',
                          capture_output=True, text=True, timeout=15)
    if proc.returncode:
        return None, proc.stderr.strip().split('\n')[-1]
    return proc.stdout, None


def values_of(check):
    value = check['value']
    return [str(item) for item in value] if isinstance(value, list) else [str(value)]


def passes(check, output):
    kind, raw, tidy = check['type'], output, normalise(output)
    if kind == 'no_error':
        return True
    if kind in ('equals', 'equals_any', 'numeric_equals'):
        return tidy in [normalise(v) for v in values_of(check)]
    if kind == 'matches':
        return bool(re.search(values_of(check)[0], raw))
    if kind in ('contains', 'contains_any'):
        return any(v in raw for v in values_of(check))
    return True


def meets_requirements(code, requirements):
    """Mirrors meetsCodeRequirement in learningValidation.ts for the kinds used here."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return False
    for requirement in requirements:
        kind, value = requirement['kind'], requirement['value']
        if kind == 'node':
            count = sum(1 for node in ast.walk(tree) if type(node).__name__ == value)
            if count < 1:
                return False
        elif kind == 'function':
            names = {node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)}
            if value not in names:
                return False
        elif kind == 'assignment':
            # base0-fill-extension requires the learner to BIND two names. A cheat that
            # prints the answers has no assignment at all, so this requirement already
            # stops it — the checker just could not see that.
            assigned = set()
            for node in ast.walk(tree):
                if isinstance(node, ast.Assign):
                    assigned |= {t.id for t in node.targets if isinstance(t, ast.Name)}
                elif isinstance(node, (ast.AnnAssign, ast.AugAssign)) and isinstance(node.target, ast.Name):
                    assigned.add(node.target.id)
            if value not in assigned:
                return False
        elif kind == 'call':
            calls = set()
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    target = node.func
                    calls.add(target.id if isinstance(target, ast.Name)
                              else getattr(target, 'attr', ''))
            if value not in calls:
                return False
    return True


def cheat_for(exercise, test):
    """The laziest wrong answer: print the expected text, compute nothing.

    For a function exercise the afterCode calls the learner's function, so the cheat is
    a function that returns the expected value whatever it is given.
    """
    wanted = None
    for check in test['checks']:
        if check['type'] in ('equals', 'equals_any', 'numeric_equals'):
            wanted = values_of(check)[0]
            break
    if wanted is None:
        wanted = normalise(exercise['sample'] or '')

    if test['afterCode']:
        starter = exercise['starter'] or ''
        match = re.search(r'def\s+(\w+)\s*\(([^)]*)\)', starter)
        if not match:
            return None
        name, params = match.group(1), match.group(2)
        try:
            literal = repr(ast.literal_eval(wanted))
        except (ValueError, SyntaxError):
            literal = repr(wanted)
        return f'def {name}({params}):\n    return {literal}\n'

    lines = [line for line in (wanted or '').split('\n') if line.strip()]
    return '\n'.join(f'print({line!r})' for line in lines) + '\n'


rows = []
for exercise in EXERCISES:
    tests = [t for t in exercise['tests'] if any(c['type'] in PINS_OUTPUT for c in t['checks'])]
    if not tests:
        continue

    cheat = cheat_for(exercise, tests[0])
    if not cheat:
        continue

    requirements = list(exercise['codeRequirements'])
    for test in tests:
        requirements += test.get('codeRequirements', [])
    structural_ok = meets_requirements(cheat, requirements)

    output_ok = True
    for test in tests:
        code = cheat + ('\n' + test['afterCode'] if test['afterCode'] else '')
        output, error = run(code, test['inputs'])
        if error or not all(passes(check, output) for check in test['checks'] if check['type'] in PINS_OUTPUT):
            output_ok = False
            break

    rows.append(dict(phase=exercise['phase'], id=exercise['id'],
                     cases=len(tests), behaviour=exercise['behaviourCases'],
                     accepted=output_ok and structural_ok,
                     stopped_by=('structure' if output_ok and not structural_ok
                                 else 'a second case' if not output_ok else None)))

print(f"{'':22} {'graded':>7} {'cheat accepted':>15} {'stopped by structure':>21} {'stopped by a case':>19}")
for label, low, high in [('phases 0-8', 0, 8), ('phases 9-20', 9, 20)]:
    band = [r for r in rows if low <= r['phase'] <= high]
    print(f"{label:22} {len(band):>7} "
          f"{sum(1 for r in band if r['accepted']):>15} "
          f"{sum(1 for r in band if r['stopped_by'] == 'structure'):>21} "
          f"{sum(1 for r in band if r['stopped_by'] == 'a second case'):>19}")

print('\nEXERCISES THAT ACCEPT A HARD-CODED ANSWER')
for r in [r for r in rows if r['accepted']]:
    print(f"   p{r['phase']:<3} {r['id']:<24} {r['cases']} graded case(s)"
          + (f", {r['behaviour']} behaviour case(s)" if r['behaviour'] else ''))
print(f"   {sum(1 for r in rows if r['accepted'])} of {len(rows)}")

accepted = [r for r in rows if r['accepted']]
sys.exit(1 if accepted else 0)
