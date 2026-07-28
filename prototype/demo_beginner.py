"""
The same harness on a beginner exercise, where there is no function to call — the
learner writes top-level code that prints. That is phases 0-8, i.e. most of the course.

Exercise: phase 6, print a priority band for an amount typed by the user.
"""

from behaviour_harness import Case, grade

REFERENCE = '''
amount = int(input("Amount: $"))
if amount > 10000:
    print("🔴 CRITICAL — 2h SLA")
elif amount > 5000:
    print("🟠 URGENT — 4h SLA")
elif amount >= 1000:
    print("🟡 NORMAL — 24h SLA")
else:
    print("🟢 LOW — 72h SLA")
'''

# Boundaries are where beginners actually get this wrong, so that is what gets tested.
CASES = [
    Case(stdin=["15000"], label="well above the top band", visible=True),
    Case(stdin=["10000"], label="exactly the top boundary"),
    Case(stdin=["10001"], label="one above the top boundary"),
    Case(stdin=["5000"], label="exactly the middle boundary"),
    Case(stdin=["1000"], label="exactly the lowest band"),
    Case(stdin=["999"], label="one below the lowest band"),
    Case(stdin=["0"], label="zero"),
]

SUBMISSIONS = {
    "correct": REFERENCE,

    "correct, written with a different but equivalent structure": '''
valor = int(input("Amount: $"))
if valor >= 10001:
    print("🔴 CRITICAL — 2h SLA")
else:
    if valor >= 5001:
        print("🟠 URGENT — 4h SLA")
    elif valor >= 1000:
        print("🟡 NORMAL — 24h SLA")
    else:
        print("🟢 LOW — 72h SLA")
''',

    "off-by-one: uses >= where the spec says >": '''
amount = int(input("Amount: $"))
if amount >= 10000:
    print("🔴 CRITICAL — 2h SLA")
elif amount >= 5000:
    print("🟠 URGENT — 4h SLA")
elif amount >= 1000:
    print("🟡 NORMAL — 24h SLA")
else:
    print("🟢 LOW — 72h SLA")
''',
}

print("=" * 78)
for title, source in SUBMISSIONS.items():
    results = grade(source, REFERENCE, entry=None, cases=CASES, mode="print")
    passed = sum(r.passed for r in results)
    print(f"\n{'PASS' if passed == len(results) else 'FAIL'}  {title}   {passed}/{len(results)}")
    for r in results:
        if r.passed:
            continue
        print(f"      × input {r.case.stdin[0]} ({r.case.label})")
        print(f"          expected: {r.expected.printed.strip().splitlines()[-1]}")
        print(f"          you got : {r.actual.printed.strip().splitlines()[-1]}")
print("\n" + "=" * 78)
print("\nNote what the second submission proves: it renames the variable, inverts the")
print("structure and changes every threshold expression, and still passes — because the")
print("behaviour is identical. No string check could tell that apart from the third one,")
print("which differs from the reference by two characters and is wrong.")
