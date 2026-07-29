"""
Checks that every pinned expectation in the factory-built phases is actually PRODUCIBLE.

Phases 9-20 grade by running the learner's function against an `afterCode` snippet and
comparing stdout to a literal in the spec file. Those literals are hand-typed. Nothing
has ever run a correct solution and confirmed the literal is what Python prints.

That is the exact defect that put `Running: {{file}}` and a stale `Queue size: 3` in
front of a learner, and the one that made the phase 27 capstone promise $23,300 while
printing $22,550. Here it is worse, because the learner never sees the afterCode: a
wrong literal is an exercise that cannot be passed, with no way to tell.

So: a reference solution per exercise, written from the task's stated rules, executed
against the real afterCode, compared to the real expectation. A mismatch is either a
bad literal or a bad reference, and both need a human to look.

    npm run audit:content:expectations
"""

import json
import os
import subprocess
import sys
import textwrap

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from reference_solutions import REFERENCES


def normalise(text):
    return '\n'.join(line.rstrip() for line in (text or '').replace('\r', '').split('\n') if line.strip()).strip()


def run(reference, after):
    proc = subprocess.run([sys.executable, '-c', reference + '\n' + after],
                          capture_output=True, text=True, timeout=10)
    if proc.returncode:
        return None, proc.stderr.strip().split('\n')[-1]
    return proc.stdout, None


exercises = json.load(open('/tmp/v11.json'))
checked = mismatched = skipped = 0

for exercise in exercises:
    reference = REFERENCES.get(exercise['id'])
    if not reference:
        skipped += 1
        continue
    for test in exercise['tests']:
        expectations = [normalise(value) for value in test['expected']]
        actual, error = run(reference, test['afterCode'])
        checked += 1
        if error:
            print(f"{exercise['id']} [{'hidden' if test['hidden'] else 'public'}]  reference RAISED {error}")
            mismatched += 1
            continue
        if normalise(actual) not in expectations:
            print(f"{exercise['id']} [{'hidden' if test['hidden'] else 'public'}]")
            print(f"    after    : {textwrap.shorten(test['afterCode'], 100)}")
            print(f"    pinned   : {expectations[0]!r}")
            print(f"    produced : {normalise(actual)!r}")
            mismatched += 1

print(f"\n{checked} expectations checked against a real run, {mismatched} do not match")
print(f"{skipped} exercises have no reference yet")
sys.exit(1 if mismatched else 0)
