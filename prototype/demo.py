"""
Proves the harness on a real exercise from the curriculum, with five submissions that
today's string-matching grader gets wrong in one direction or the other.

Exercise: phase 9, approved_total(orders, discount) — sum the amount of every row whose
status is "approved", subtracting the discount from each.
"""

from behaviour_harness import Case, grade, looks_hardcoded

ENTRY = "approved_total"

REFERENCE = '''
def approved_total(orders, discount):
    total = 0
    for name, amount, status in orders:
        if status == "approved":
            total += amount - discount
    return total
'''

CASES = [
    Case(args=([["Ana", 3200, "approved"], ["Beto", 900, "pending"], ["Caio", 5100, "approved"]], 300),
         label="the worked example", visible=True),
    Case(args=([["Ana", 3200, "pending"], ["Beto", 900, "rejected"]], 300), label="nothing approved"),
    Case(args=([], 300), label="empty list"),
    Case(args=([["Solo", 100, "approved"]], 0), label="no discount"),
    Case(args=([["A", 10, "approved"], ["B", 20, "approved"]], 5), label="discount applies per row"),
    Case(args=([["Neg", 50, "approved"]], 80), label="discount exceeds the amount"),
]

SUBMISSIONS = {
    "canonical — matches the reference exactly": REFERENCE,

    "different shape, same logic (comprehension)": '''
def approved_total(orders, discount):
    return sum(row[1] - discount for row in orders if row[2] == "approved")
''',

    "different names, early continue, still correct": '''
def approved_total(pedidos, desconto):
    acumulado = 0
    for pedido in pedidos:
        if pedido[2] != "approved":
            continue
        acumulado = acumulado + pedido[1] - desconto
    return acumulado
''',

    "subtly wrong — discount applied once, not per row": '''
def approved_total(orders, discount):
    total = 0
    for name, amount, status in orders:
        if status == "approved":
            total += amount
    return total - discount
''',

    "hardcoded to the visible example": '''
def approved_total(orders, discount):
    return 7700
''',

    "lookup table dressed up as logic": '''
def approved_total(orders, discount):
    if len(orders) == 3:
        return 7700
    if len(orders) == 2 and discount == 5:
        return 20
    if len(orders) == 0:
        return 0
    return 0
''',
}

print("=" * 78)
for title, source in SUBMISSIONS.items():
    fraud = looks_hardcoded(source, ENTRY, len(CASES))
    results = grade(source, REFERENCE, ENTRY, CASES, mode="return")
    passed = sum(r.passed for r in results)

    verdict = "PASS" if passed == len(results) and not fraud else "FAIL"
    print(f"\n{verdict}  {title}")
    print(f"      {passed}/{len(results)} behaviours match")
    if fraud:
        print(f"      structure: {fraud}")
    for r in results:
        if r.passed:
            continue
        shown = r.case.label if r.case.visible else "a case you have not seen"
        print(f"      × {shown}: {r.reason}")
print("\n" + "=" * 78)
