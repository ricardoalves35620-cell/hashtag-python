"""
Writes the reference solutions to the audit cache for the JS-side checkers.

This file exists because of a defect in the checkers themselves. `learner-agent.ts`,
`pt-grading.mjs` and `learner-walkthrough.mjs` all read that file, and NOTHING
in the repository wrote it — it happened to exist on one machine because a one-off command
had produced it there. learner-agent.ts treated a missing file as "no references", so on
any other machine it degraded silently to render-only checks and reported that every
graded exercise was fine, having submitted nothing.

That is the exact failure the standard's second rule names: a checker reporting 0 is
worthless until it has been shown to report 1. So the file is now produced by the same
command that consumes it, and the consumers fail loudly when it is absent.

    python3 scripts/audit/dump-references.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cache import REFERENCES_JSON  # noqa: E402  (path set above)
import json

import reference_solutions  # noqa: E402  (path set above)

DESTINATION = os.environ.get("HP_REFERENCES", REFERENCES_JSON)

references = reference_solutions.REFERENCES
if not references:
    print("reference_solutions.py exported nothing — the @solution decorator is broken")
    raise SystemExit(1)

with open(DESTINATION, "w", encoding="utf-8") as file:
    json.dump(references, file, ensure_ascii=False, indent=1)

print(f"{len(references)} reference solutions -> {DESTINATION}")
