"""
Authors behaviour specs for the input()-taking exercises in phases 0-8 and PROVES each
one before it is emitted.

Three gates every case must pass, because a bad spec fails correct learners on an
exercise they cannot see the grader for:

  1. AGREEMENT   Several genuinely different correct implementations must produce
                 identical output for the case. This is not pedantry: 299.7 * 0.9 and
                 299.7 - 299.7 * 0.1 differ in the last bit, so a float case can reject
                 a learner whose arithmetic is correct but ordered differently. Cases
                 that fail this gate are dropped, not patched.

  2. CONSISTENCY The reference must also satisfy the check the exercise already ships
                 with. If the two disagree, one of them is wrong and it is not the
                 learner's problem.

  3. DISCRIMINATION At least one deliberately wrong implementation must FAIL. A spec
                 whose cases every implementation passes tests nothing.

    python3 scripts/audit/author-behaviour.py
"""

import json
import subprocess
import sys

TIMEOUT = 10


def run(code, inputs, quiet=True):
    prelude = "import builtins as _b\n_real = _b.input\n_b.input = lambda prompt='': _real()\n" if quiet else ''
    proc = subprocess.run([sys.executable, '-c', prelude + code],
                          input='\n'.join(inputs) + '\n', capture_output=True, text=True, timeout=TIMEOUT)
    if proc.returncode:
        return None, proc.stderr.strip().split('\n')[-1]
    return proc.stdout, None


def lines(text):
    return [line.rstrip() for line in (text or '').replace('\r', '').split('\n') if line.strip()]


def produces_expected(expected, actual):
    """Mirrors producesExpected() in behaviourGrading.ts: in-order, extra lines allowed."""
    got, at = lines(actual), 0
    for line in lines(expected):
        try:
            at = got.index(line, at) + 1
        except ValueError:
            return False
    return True


# ─────────────────────────────────────────────────────────────────────────────
# ex4_fill — every printed string lives in the starter, so the learner invents no
# text. Only the three type conversions vary, which is exactly what the cases probe.
# ─────────────────────────────────────────────────────────────────────────────
EX4_FILL_REF = '''name   = input("Name: ")
age    = int(input("Age: "))
height = float(input("Height (m): "))
phone  = input("Phone: ")

print(f"{name}, {age} years, {height}m")
print(f"Next year: {age + 1}")
print(f"Phone: {phone}")'''

EX4_FILL_ALT = '''name = str(input("Name: "))
age = int(input("Age: "))
height = float(input("Height (m): "))
phone = input("Phone: ")
print("{}, {} years, {}m".format(name, age, height))
print("Next year: " + str(age + 1))
print("Phone: " + phone)'''

EX4_FILL_WRONG = '''name   = input("Name: ")
age    = int(input("Age: "))
height = int(float(input("Height (m): ")))
phone  = int(input("Phone: ").replace("-", ""))

print(f"{name}, {age} years, {height}m")
print(f"Next year: {age + 1}")
print(f"Phone: {phone}")'''

# ─────────────────────────────────────────────────────────────────────────────
# ex5_fill — the blanks ARE the operators, so boundary inputs are the entire point.
# `>` vs `>=` and `and` vs `or` produce identical output on every value except the
# boundary itself, which is precisely where one authored string cannot see.
# ─────────────────────────────────────────────────────────────────────────────
EX5_FILL_REF = '''amount = int(input("Amount: $"))
days = int(input("Days since plan start: "))

if amount > 5000 and days < 30:
    print("\\U0001f6a8 FLAGGED for investigation")
else:
    print("\\u2705 Passed fraud check")'''

EX5_FILL_ALT = '''amount = int(input("Amount: $"))
days = int(input("Days since plan start: "))
flagged = (amount >= 5001) and (days <= 29)
if flagged:
    print("\\U0001f6a8 FLAGGED for investigation")
else:
    print("\\u2705 Passed fraud check")'''

EX5_FILL_WRONG = '''amount = int(input("Amount: $"))
days = int(input("Days since plan start: "))

if amount >= 5000 or days < 30:
    print("\\U0001f6a8 FLAGGED for investigation")
else:
    print("\\u2705 Passed fraud check")'''

# ─────────────────────────────────────────────────────────────────────────────
# ex4_zero — written from scratch, but the task's Example specifies every label and
# every number, so there is nothing left for the learner to invent.
# ─────────────────────────────────────────────────────────────────────────────
EX4_ZERO_REF_EN = '''name = input("Name: ")
fee = float(input("Monthly fee: "))
months = int(input("Months: "))

full = fee * months
saved = full * 0.10
pay = full - saved

print(f"Member: {name}")
print(f"Full price: {full}")
print(f"10% off saves: {saved}")
print(f"You pay: {pay}")'''

EX4_ZERO_REF_PT = EX4_ZERO_REF_EN.replace('Member:', 'Aluno:').replace('Full price:', 'Preço cheio:') \
    .replace('10% off saves:', '10% off economiza:').replace('You pay:', 'Você paga:')

# Correct, but computes the final price directly instead of subtracting. This is the
# implementation that exposes float-ordering cases.
EX4_ZERO_ALT_EN = '''name = input("Name: ")
fee = float(input("Monthly fee: "))
months = int(input("Months: "))
full = months * fee
saved = full / 10
pay = full * 0.9
print(f"Member: {name}")
print(f"Full price: {full}")
print(f"10% off saves: {saved}")
print(f"You pay: {pay}")'''

EX4_ZERO_WRONG_EN = EX4_ZERO_REF_EN.replace('saved = full * 0.10', 'saved = fee * 0.10')

# ─────────────────────────────────────────────────────────────────────────────
# ex5_zero — the task specifies the ALLOWED message and leaves the refusal wording to
# the learner. So every case here is an allowed one, including the boundary at exactly
# 18. A learner who wrote `> 18` prints their own refusal text at 18, which will not
# contain the allowed line, and is caught without the grader ever knowing their wording.
#
# The limit, stated rather than hidden: a program that always prints the allowed line
# passes these cases. `ignoresInput` cannot see it either, because every case expects
# the same output. The exercise's existing `node: If` requirement is what covers that,
# and closing it properly needs the task to specify the refusal text.
# ─────────────────────────────────────────────────────────────────────────────
EX5_ZERO_REF_EN = '''age = int(input("Age: "))
if age >= 18:
    print("\\U0001f3ac Enjoy the movie!")
else:
    print("Sorry, you are too young for this film.")'''

EX5_ZERO_REF_PT = '''age = int(input("Age: "))
if age >= 18:
    print("\\U0001f3ac Aproveite o filme!")
else:
    print("Desculpe, você é muito jovem para este filme.")'''

EX5_ZERO_ALT_EN = '''age = int(input("Age: "))
if age < 18:
    print("Sorry, no entry.")
else:
    print("\\U0001f3ac Enjoy the movie!")'''

EX5_ZERO_WRONG_EN = EX5_ZERO_REF_EN.replace('age >= 18', 'age > 18')

SPECS = [
    dict(
        exercise='ex4_fill', bilingual=False,
        reference=EX4_FILL_REF, alternates=[EX4_FILL_ALT], wrong=[EX4_FILL_WRONG],
        legacy=dict(inputs=['Maria', '35', '1.68', '555-1234'],
                    pattern='Maria, 35 years, 1\\.68m\nNext year: 36\nPhone: 555-1234'),
        cases=[
            (['Maria', '35', '1.68', '555-1234'], 'the example in the task', 'o exemplo do enunciado', True),
            (['Ana Paula', '9', '1.05', '111-2222'], 'a name with a space', 'um nome com espaço', False),
            (['Bruno', '0', '2.0', '000-0000'], 'a height with no fractional part', 'uma altura sem parte decimal', False),
            (['Chen', '64', '1.755', '0551234'], 'a phone number that looks like a number', 'um telefone que parece um número', False),
        ],
    ),
    dict(
        exercise='ex5_fill', bilingual=False,
        reference=EX5_FILL_REF, alternates=[EX5_FILL_ALT], wrong=[EX5_FILL_WRONG],
        legacy=dict(inputs=['8000', '10'], pattern='\U0001f6a8 FLAGGED for investigation'),
        cases=[
            (['8000', '10'], 'the example in the task', 'o exemplo do enunciado', True),
            (['5000', '10'], 'exactly 5000 — not more than 5000', 'exatamente 5000 — não é mais que 5000', False),
            (['8000', '30'], 'exactly 30 days — not fewer than 30', 'exatamente 30 dias — não é menos que 30', False),
            (['5001', '29'], 'just past both limits', 'logo além dos dois limites', False),
            (['3000', '10'], 'small amount, recent plan', 'valor pequeno, plano recente', False),
            (['9000', '400'], 'large amount, old plan', 'valor grande, plano antigo', False),
        ],
    ),
    dict(
        exercise='ex4_zero', bilingual=True,
        reference=(EX4_ZERO_REF_EN, EX4_ZERO_REF_PT), alternates=[EX4_ZERO_ALT_EN], wrong=[EX4_ZERO_WRONG_EN],
        legacy=dict(inputs=['Alex', '80.0', '6'],
                    pattern='Member: Alex\nFull price: 480\\.0\n10% off saves: 48\\.0\nYou pay: 432\\.0'),
        cases=[
            (['Alex', '80.0', '6'], 'the example in the task', 'o exemplo do enunciado', True),
            (['Bea', '100.0', '1'], 'a single month', 'um único mês', False),
            (['Caio', '50.0', '12'], 'a full year', 'um ano inteiro', False),
            (['Dara', '250.0', '2'], 'a larger fee', 'uma mensalidade maior', False),
            (['Eli', '99.9', '3'], 'a fee that does not divide evenly', 'uma mensalidade que não divide certo', False),
        ],
    ),
    dict(
        exercise='ex5_zero', bilingual=True,
        reference=(EX5_ZERO_REF_EN, EX5_ZERO_REF_PT), alternates=[EX5_ZERO_ALT_EN], wrong=[EX5_ZERO_WRONG_EN],
        legacy=dict(inputs=['20'], pattern='\U0001f3ac Enjoy the movie!'),
        cases=[
            (['20'], 'the example in the task', 'o exemplo do enunciado', True),
            (['18'], 'exactly 18 — the boundary', 'exatamente 18 — o limite', False),
            (['65'], 'well over the limit', 'bem acima do limite', False),
        ],
    ),
]


import re

emitted = {}
for spec in SPECS:
    name = spec['exercise']
    reference_en = spec['reference'][0] if spec['bilingual'] else spec['reference']
    print(f'\n=== {name}')

    # gate 2: the reference must satisfy the check the exercise already ships with
    legacy_output, legacy_error = run(reference_en, spec['legacy']['inputs'], quiet=False)
    consistent = not legacy_error and re.search(spec['legacy']['pattern'], legacy_output or '')
    print(f'  consistency with the existing check : {"PASS" if consistent else "FAIL"}')
    if not consistent:
        print(f'    reference produced {legacy_output!r}')
        continue

    kept, dropped = [], []
    for inputs, label_en, label_pt, visible in spec['cases']:
        expected, error = run(reference_en, inputs)
        if error:
            dropped.append((label_en, f'reference raised {error}'))
            continue
        # gate 1: every alternate correct implementation must agree
        disagreement = None
        for alternate in spec['alternates']:
            other, other_error = run(alternate, inputs)
            if other_error or not produces_expected(expected, other):
                disagreement = f'{lines(expected)} vs {lines(other) if not other_error else other_error}'
                break
        if disagreement:
            dropped.append((label_en, f'correct implementations disagree: {disagreement}'))
            continue
        kept.append(dict(inputs=inputs, label={'en': label_en, 'pt': label_pt}, visible=visible))

    # gate 3: a deliberately wrong implementation must fail at least one kept case
    caught = []
    for wrong in spec['wrong']:
        failing = []
        for case in kept:
            expected, _ = run(reference_en, case['inputs'])
            actual, error = run(wrong, case['inputs'])
            if error or not produces_expected(expected, actual):
                failing.append(case['label']['en'])
        caught.append(failing)

    # gate 4: presentation immunity. A learner who words the prompt differently, or
    # leaves a debug print behind, is not wrong about the task.
    noisy = reference_en.replace('input("', 'input("Please give me your ')
    noisy = 'print("debug: starting")\n' + noisy + '\nprint("debug: done")'
    presentation = [case['label']['en'] for case in kept
                    if not produces_expected(run(reference_en, case['inputs'])[0], run(noisy, case['inputs'])[0])]

    # gate 5: a bilingual reference has TWO references, and only one of them was checked
    # above. A Portuguese learner is graded against the Portuguese one.
    pt_broken = []
    if spec['bilingual']:
        for case in kept:
            output, error = run(spec['reference'][1], case['inputs'])
            if error or len(lines(output)) != len(lines(run(reference_en, case['inputs'])[0])):
                pt_broken.append(case['label']['en'])

    print(f'  cases kept                          : {len(kept)} of {len(spec["cases"])}')
    print(f'  rejects a reworded prompt / debug    : {presentation or "no"}')
    if spec['bilingual']:
        print(f'  pt reference broken on               : {pt_broken or "no case"}')
    for label, why in dropped:
        print(f'    DROPPED  {label}: {why}')
    for failing in caught:
        print(f'  wrong implementation caught by      : {failing or "NOTHING — spec tests nothing"}')

    if kept and all(caught) and not presentation and not pt_broken:
        emitted[name] = dict(bilingual=spec['bilingual'], reference=spec['reference'], cases=kept)

print(f'\n{len(emitted)} of {len(SPECS)} specs passed all three gates')
json.dump(emitted, open('/tmp/behaviour-specs.json', 'w'), indent=1, ensure_ascii=False)
