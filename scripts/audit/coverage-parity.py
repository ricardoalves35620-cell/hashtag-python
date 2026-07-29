"""
Measures whether phases 0-20 are held to the same standard, per exercise.

"Phases 0-8 are fine, bring 9-20 up to their level" is the natural assumption and it is
wrong in both directions. The two ranges use different grading architectures and were
hardened on different axes, so this reports the axes instead of a verdict.

Four properties, each either true or false for an exercise, no partial credit:

  GRADED     something pins the output. An exercise with only no_error and structure
             checks passes for any program that runs without crashing.
  VERIFIED   every pinned expectation has been produced by EXECUTING a correct solution.
             Unverified means a human typed the answer and nothing ever checked it.
  MULTI      graded on more than one scenario. One case cannot distinguish `<` from
             `<=`, and boundary confusion is the most common beginner error there is.
  DISCLOSED  every structural requirement the grader enforces is mentioned in the task.
             A hidden `JoinedStr` requirement fails a learner for not using an f-string
             they were never asked for.

    npm run audit:content:parity
"""

import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from reference_solutions import REFERENCES

EXERCISES = json.load(open('/tmp/ex0_20.json'))

PINS_OUTPUT = {'equals', 'equals_any', 'matches', 'numeric_equals', 'contains', 'contains_any'}

# What a learner would have to have been told for the requirement to be fair. A
# requirement is disclosed when the task names the concept in either language.
# Structural nodes that any correct solution contains whatever it does. Requiring a
# BinOp is requiring arithmetic; requiring a Subscript is requiring indexing. Nobody
# writes "use a subscript" in a task, and nobody could fail for not doing it. Listing
# them here is what separates the requirements worth disclosing from the noise — the
# first run flagged 19 exercises and 15 were this.
IMPLIED = {'BinOp', 'Subscript', 'Assign', 'AugAssign', 'Dict', 'List', 'Tuple', 'Expr',
           'arguments', 'Compare', 'Call', 'Name', 'Attribute', 'Constant', 'Module',
           'comprehension', 'keyword', 'Index', 'Slice', 'BoolOp', 'UnaryOp'}

DISCLOSURE = {
    'JoinedStr': [r'f-string', r'f string', r'formatted string', r'interpolat'],
    'ListComp': [r'comprehension', r'compreens'],
    'DictComp': [r'comprehension', r'compreens'],
    'SetComp': [r'comprehension', r'compreens'],
    'GeneratorExp': [r'generator', r'gerador', r'comprehension', r'compreens'],
    'Raise': [r'raise', r'ValueError', r'gere ', r'levante', r'reject', r'rejeit'],
    'Try': [r'try', r'except', r'handle', r'trate'],
    'While': [r'while', r'enquanto', r'loop', r'repeat'],
    'For': [r'for ', r'each', r'cada', r'loop', r'iterate', r'itere'],
    'If': [r'\bif\b', r'\bwhen\b', r'\bquando\b', r'\bse\b', r'decid', r'classif', r'return "',
           r'\bonly\b', r'\bapenas\b', r'\bsomente\b', r'\botherwise\b', r'\bcaso contr'],
    'FunctionDef': [r'function', r'função', r'funcao', r'def '],
    'Return': [r'return', r'retorn'],
    'ClassDef': [r'class', r'classe'],
    'Lambda': [r'lambda'],
    'With': [r'with ', r'open', r'file', r'arquivo'],
    'Global': [r'global'],
    'Nonlocal': [r'nonlocal'],
    'Assert': [r'assert'],
}


def graded(ex):
    return any(check['type'] in PINS_OUTPUT
               for test in ex['tests'] for check in test['checks'])


def verified(ex):
    """Produced by execution: either a behaviour spec, or a reference in this repo."""
    return ex['behaviourCases'] > 0 or ex['id'] in REFERENCES


def scenarios(ex):
    """Distinct graded situations. Behaviour cases count; so do separate tests."""
    if ex['behaviourCases']:
        return ex['behaviourCases']
    return sum(1 for test in ex['tests']
               if any(check['type'] in PINS_OUTPUT for check in test['checks']))


def all_requirements(ex):
    """Requirements live at the exercise level AND on individual tests.

    Reading only the exercise level reported 0 undisclosed while four exercises in
    phases 10-12 demanded `.copy()` or an f-string from a test. Working through the
    phases in a browser is what surfaced them; this is the checker catching up.
    """
    out = list(ex['codeRequirements'])
    for test in ex['tests']:
        out += test.get('codeRequirements', [])
    return out


def undisclosed(ex):
    """Requirements the grader enforces that the task never mentions."""
    text = (ex['desc'] + ' ' + ex['descPt'] + ' ' + ' '.join(ex['hints']) + ' ' + (ex['starter'] or '')).lower()
    missing = []
    seen = set()
    for requirement in all_requirements(ex):
        key = (requirement['kind'], requirement['value'])
        if key in seen:
            continue
        seen.add(key)
        if requirement['kind'] in ('function', 'assignment'):
            continue                      # the starter names these; they cannot surprise
        if requirement['kind'] in ('call', 'import'):
            # A method or module the learner must reach for. Naming it in the task is the
            # bar — "use json" is disclosure, "serialise it" is not.
            if requirement['value'].lower() not in text:
                missing.append(f"{requirement['kind']}:{requirement['value']}")
            continue
        if requirement['kind'] != 'node':
            continue
        if requirement['value'] in IMPLIED:
            continue
        patterns = DISCLOSURE.get(requirement['value'])
        if patterns is None:
            missing.append(requirement['value'] + ' (no disclosure rule)')
            continue
        if not any(re.search(pattern, text, re.I) for pattern in patterns):
            missing.append(requirement['value'])
    return missing


rows = []
for ex in EXERCISES:
    rows.append(dict(
        phase=ex['phase'], id=ex['id'],
        graded=graded(ex), verified=verified(ex),
        scenarios=scenarios(ex), undisclosed=undisclosed(ex),
    ))


def band(rows, low, high):
    return [r for r in rows if low <= r['phase'] <= high]


print(f"{'':22} {'exercises':>9} {'graded':>7} {'verified':>9} {'multi-case':>11} {'undisclosed':>12}")
for label, low, high in [('phases 0-8', 0, 8), ('phases 9-20', 9, 20), ('phases 0-20', 0, 20)]:
    band_rows = band(rows, low, high)
    g = [r for r in band_rows if r['graded']]
    print(f"{label:22} {len(band_rows):>9} {len(g):>7} "
          f"{sum(1 for r in g if r['verified']):>9} "
          f"{sum(1 for r in g if r['scenarios'] > 1):>11} "
          f"{sum(1 for r in band_rows if r['undisclosed']):>12}")

print('\nGRADED BUT NEVER VERIFIED BY EXECUTION')
gaps = [r for r in rows if r['graded'] and not r['verified']]
for r in gaps:
    print(f"   p{r['phase']:<3} {r['id']:<24} {r['scenarios']} scenario(s)")
print(f"   {len(gaps)} exercises")

print('\nNOT GRADED AT ALL — any program that runs passes')
ungraded = [r for r in rows if not r['graded']]
for r in ungraded:
    print(f"   p{r['phase']:<3} {r['id']}")
print(f"   {len(ungraded)} exercises")

print('\nREQUIREMENTS THE GRADER ENFORCES BUT THE TASK NEVER MENTIONS')
hidden = [r for r in rows if r['undisclosed']]
for r in hidden:
    print(f"   p{r['phase']:<3} {r['id']:<24} {', '.join(r['undisclosed'])}")
print(f"   {len(hidden)} exercises")

# Two of the four properties are gates; the third is reported and not enforced.
#
# Multi-case cannot be reached for a phase 0-8 exercise that takes no input. "Store a
# rating score" means the learner picks the value, so there is exactly one behaviour and
# it is theirs — the same limit behaviourGrading.ts documents. Making that a gate would
# mean either failing honest exercises or redesigning them, so it is a number to watch
# rather than a wall.
structural = [r for r in hidden if any(not item.startswith(('call:', 'import:')) for item in r['undisclosed'])]
blocking = len(gaps) + len(structural)
if blocking:
    print(f"\nBLOCKING: {len(gaps)} unverified, {len(structural)} undisclosed structure")
sys.exit(1 if blocking else 0)
