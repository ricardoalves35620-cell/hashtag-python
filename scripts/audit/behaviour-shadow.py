"""
Reads the disagreements between the two graders before behavioural grading is widened.

The pilot ships behind `hidden: true` on exactly one exercise (ex6_fill) and does not
decide whether anyone passes. That was the right way to start, but a shadow that nobody
reads is just dead code. This produces the comparison the pilot was meant to generate:
a set of candidate solutions, each run through BOTH graders, with a human verdict of
what should happen.

Two kinds of disagreement matter, and they are not symmetric:

  legacy PASS / behaviour FAIL on wrong code   -> the reason to widen
  legacy PASS / behaviour FAIL on RIGHT code   -> the reason not to, yet

The second is the one to hunt. A grader that rejects correct work is worse than the
string matching it replaces, because the learner cannot tell which of them is wrong.

    npx tsx --eval "..." > /tmp/ex6.json      # spec is exported from the TS data
    python3 scripts/audit/behaviour-shadow.py
"""

import ast
import json
import re
import subprocess
import sys

SPEC = json.load(open('/tmp/ex6.json'))
BEHAVIOUR = SPEC['behaviour']
GRADING = SPEC['grading']

REFERENCE = BEHAVIOUR['reference']
if isinstance(REFERENCE, dict):
    REFERENCE = REFERENCE['en']


# Suppressing the prompt is the whole of proposal (a). The prompt is what the program
# ASKS, not what it produces, and the reference has no authority over how a learner
# words a question. Pyodide's worker owns input(), so this is a runCode option, not a
# string hack on the output.
QUIET_INPUT = """import builtins as _b
_real = _b.input
_b.input = lambda prompt='': _real()
"""


def run(code: str, inputs: list, quiet_prompts: bool = False) -> tuple:
    """Executes like the worker does: prompts land in stdout, inputs arrive on stdin."""
    proc = subprocess.run(
        [sys.executable, '-c', (QUIET_INPUT + code) if quiet_prompts else code],
        input='\n'.join(inputs) + '\n',
        capture_output=True, text=True, timeout=10,
    )
    return proc.stdout, (proc.stderr.strip().split('\n')[-1] if proc.returncode else None)


def lines_of(text: str) -> list:
    return [line.rstrip() for line in text.replace('\r', '').split('\n') if line.strip()]


def is_subsequence(expected: list, actual: list) -> bool:
    """Proposal (b): everything the reference printed must appear, in order.

    A debug print the learner left in is extra, not wrong. Requiring exact equality
    fails them for it, which is the first failure mode behaviourGrading.ts was written
    to remove and currently reproduces.
    """
    it = iter(actual)
    return all(any(line == candidate for candidate in it) for line in expected)


def proposed_verdict(code: str) -> tuple:
    """Subsequence matching, plus one rule to close the hole it opens.

    Allowing extra lines lets a learner print every possible answer and satisfy the
    reference by accident. But a program that prints the SAME thing for every input,
    while the reference prints something different, is not reading its input at all —
    and that is true no matter which lines it printed. The rule cannot fail correct
    work, because correct work varies exactly where the reference varies.
    """
    failures = []
    expectations, actuals = [], []

    for item in BEHAVIOUR['cases']:
        inputs = item.get('inputs', [])
        expected, reference_error = run(REFERENCE, inputs, quiet_prompts=True)
        if reference_error:
            continue
        actual, error = run(code, inputs, quiet_prompts=True)
        expectations.append(normalise(expected))
        actuals.append(error or normalise(actual))
        if error or not is_subsequence(lines_of(expected), lines_of(actual)):
            failures.append((item['label']['en'], normalise(expected), normalise(actual) if not error else error))

    if len(set(expectations)) > 1 and len(set(actuals)) == 1:
        failures.append(('every case', 'output that changes with the input', 'the same output every time'))

    return len(failures) == 0, failures


def normalise(text: str) -> str:
    return '\n'.join(line.rstrip() for line in text.replace('\r', '').split('\n') if line.strip()).strip()


def legacy_verdict(code: str) -> bool:
    """The checks the exercise ships with today: one regex on one input, plus If count."""
    for test in GRADING.get('tests', []):
        output, error = run(code, test.get('inputs', []))
        for check in test.get('checks', []):
            if check['type'] == 'no_error' and error:
                return False
            if check['type'] == 'matches' and not re.search(check['value'], output):
                return False
    for requirement in GRADING.get('codeRequirements', []):
        if requirement['kind'] == 'node':
            try:
                tree = ast.parse(code)
            except SyntaxError:
                return False
            count = sum(1 for node in ast.walk(tree) if type(node).__name__ == requirement['value'])
            if count < requirement.get('minCount', 1):
                return False
    return True


def behaviour_verdict(code: str) -> tuple:
    """Every case, compared to what the reference actually printed for that same input."""
    failures = []
    for item in BEHAVIOUR['cases']:
        inputs = item.get('inputs', [])
        expected, reference_error = run(REFERENCE, inputs)
        if reference_error:
            continue
        actual, error = run(code, inputs)
        if error or normalise(expected) != normalise(actual):
            failures.append((item['label']['en'], normalise(expected), normalise(actual) if not error else error))
    return len(failures) == 0, failures


# `correct` is the verdict a competent human marker would give, written down before
# running anything so the harness cannot be talked into agreeing with itself.
CANDIDATES = [
    ('the reference itself', True, REFERENCE),

    ('hard-coded output, two decorative ifs', False, '''age = int(input("Age: "))
if age > 0:
    pass
if age > 0:
    pass
print("Fee: 1600.0")'''),

    ('off-by-one: <= at every boundary', False, '''age = int(input("Age: "))
base = 1000

if age <= 21:
    fee = base * 2.2
elif age <= 26:
    fee = base * 1.6
elif age <= 60:
    fee = base * 1.0
else:
    fee = base * 1.5

print("Fee:", fee)'''),

    ('no catch-all: over-60 falls through', False, '''age = int(input("Age: "))
base = 1000
fee = 0

if age < 21:
    fee = base * 2.2
elif age < 26:
    fee = base * 1.6
elif age < 60:
    fee = base * 1.0

print("Fee:", fee)'''),

    ('correct, written with an f-string', True, '''age = int(input("Age: "))
base = 1000

if age < 21:
    fee = base * 2.2
elif age < 26:
    fee = base * 1.6
elif age < 60:
    fee = base * 1.0
else:
    fee = base * 1.5

print(f"Fee: {fee}")'''),

    ('correct, but input() with no prompt', True, '''age = int(input())
base = 1000

if age < 21:
    fee = base * 2.2
elif age < 26:
    fee = base * 1.6
elif age < 60:
    fee = base * 1.0
else:
    fee = base * 1.5

print("Fee:", fee)'''),

    ('correct, with a debug print left in', True, '''age = int(input("Age: "))
base = 1000
print("debug:", age)

if age < 21:
    fee = base * 2.2
elif age < 26:
    fee = base * 1.6
elif age < 60:
    fee = base * 1.0
else:
    fee = base * 1.5

print("Fee:", fee)'''),

    ('cheat: prints every band, one per line', False, '''age = int(input("Age: "))
print("Fee: 2200.0")
print("Fee: 1600.0")
print("Fee: 1000.0")
print("Fee: 1500.0")
if age: pass
if age: pass'''),

    ('correct, different prompt wording', True, '''age = int(input("Your age: "))
base = 1000

if age < 21:
    fee = base * 2.2
elif age < 26:
    fee = base * 1.6
elif age < 60:
    fee = base * 1.0
else:
    fee = base * 1.5

print("Fee:", fee)'''),
]

print(f'{"candidate":42} {"should":7} {"legacy":7} {"behav":7} {"prop":7}  verdict')
print('-' * 104)

false_accepts, false_rejects = [], []
proposed_accepts, proposed_rejects = [], []
for label, correct, code in CANDIDATES:
    legacy = legacy_verdict(code)
    behaviour, failures = behaviour_verdict(code)
    proposed, proposed_failures = proposed_verdict(code)
    if proposed != correct:
        (proposed_accepts if proposed else proposed_rejects).append((label, proposed_failures))

    notes = []
    if legacy != correct:
        notes.append('legacy ' + ('ACCEPTS wrong' if legacy else 'REJECTS right'))
    if behaviour != correct:
        notes.append('behaviour ' + ('ACCEPTS wrong' if behaviour else 'REJECTS RIGHT'))
        (false_accepts if behaviour else false_rejects).append((label, failures))
    if legacy != behaviour and not notes:
        notes.append('disagree, both defensible')

    print(f'{label:42} {str(correct):7} {str(legacy):7} {str(behaviour):7} {str(proposed):7}  {"; ".join(notes) or "agree"}')

print()
for label, failures in false_rejects:
    print(f'FALSE REJECTION — {label}')
    for case, expected, actual in failures[:1]:
        print(f'   case     : {case}')
        print(f'   expected : {expected!r}')
        print(f'   produced : {actual!r}')
    print(f'   ({len(failures)} of {len(BEHAVIOUR["cases"])} cases failed)\n')

print(f'CURRENT  : {len(false_rejects)} correct rejected, {len(false_accepts)} wrong accepted')
print(f'PROPOSED : {len(proposed_rejects)} correct rejected, {len(proposed_accepts)} wrong accepted')
for label, failures in proposed_rejects:
    print(f'   still rejects: {label}')
for label, failures in proposed_accepts:
    print(f'   still accepts: {label}')
