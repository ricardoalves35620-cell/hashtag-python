"""
Where the audit scripts keep the files they hand to each other.

The Python half of cache.mjs — same folder, same names. See that file for why this is not
/tmp: on Windows, `/tmp/ex0_20.json` resolves to `C:\\tmp\\...` if it resolves at all, and
six npm scripts were unrunnable on the machine this project is developed on.
"""

import os

CACHE_DIR = os.environ.get("HP_AUDIT_CACHE", ".audit-cache")
os.makedirs(CACHE_DIR, exist_ok=True)


def cache_path(name):
    return os.path.join(CACHE_DIR, name)


EXERCISES_JSON = cache_path("exercises.json")
REFERENCES_JSON = cache_path("references.json")
REFERENCES_PT_JSON = cache_path("references.pt.json")
