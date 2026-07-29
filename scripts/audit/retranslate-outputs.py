"""
Rewrites the Portuguese `sampleOutput` and the output quoted in Portuguese descriptions
from what the program actually prints.

`described-output.py` REPORTS the mismatch. This fixes it, and it exists because the fix
is not a translation job — it is a re-derivation. Adding one entry to `literalPt` changes
what every program containing that string prints, so the task text quoting that output is
stale from that moment on. Doing it by hand is how "Queue size: 3" survived in phase 8's
task while the code printed "Tamanho da fila: 3".

    python3 scripts/audit/dump-references.py
    npx tsx scripts/audit/localize-references.ts
    npx tsx scripts/audit/dump-exercises.ts > /tmp/ex0_20.json
    python3 scripts/audit/retranslate-outputs.py            # --dry-run to preview

Nothing here invents Portuguese. Every replacement is a line one run printed, substituted
for the line the other run printed at the same position. If a string has no `literalPt`
entry the two runs agree, there is no pair, and nothing is touched — so an untranslated
exercise is left visibly untranslated rather than quietly half-fixed.
"""

import glob
import json
import re
import subprocess
import sys

DRY_RUN = "--dry-run" in sys.argv

EXERCISES = json.load(open("/tmp/ex0_20.json", encoding="utf-8"))
REFERENCES_EN = json.load(open("/tmp/references.json", encoding="utf-8"))
REFERENCES_PT = json.load(open("/tmp/references.pt.json", encoding="utf-8"))

LEADING_DECORATION = re.compile(r"^[^\w]+")
PROMPT = re.compile(r"input\(\s*f?([\"'])(.*?)\1\s*\)", re.S)


def run(code, stdin):
    if not code or "___" in code:
        return None
    if "input(" in code and stdin is None:
        return None
    try:
        done = subprocess.run(
            [sys.executable, "-c", code],
            input="".join(f"{value}\n" for value in (stdin or [])),
            capture_output=True, text=True, timeout=15,
        )
    except subprocess.SubprocessError:
        return None
    if done.returncode:
        return None
    return [line for line in done.stdout.split("\n") if line.strip()]


def without_prompts(lines, code):
    """Each prompt is echoed once, so remove it once — see described-output.py."""
    joined = "\n".join(lines)
    for _, prompt in PROMPT.findall(code or ""):
        if prompt:
            joined = joined.replace(prompt, "", 1)
    return [line for line in joined.split("\n") if line.strip()]


def first(tests, key):
    for test in tests or []:
        if test.get(key):
            return test[key]
    return None


def readable(line):
    """Leading emoji and punctuation are decoration; str.strip takes a SET of characters,
    not a range, so spelling one out silently matched almost nothing."""
    return LEADING_DECORATION.sub("", line).strip()


pairs = {}
for exercise in EXERCISES:
    stdin, driver = first(exercise.get("tests"), "inputs"), first(exercise.get("tests"), "afterCode")
    english = run(exercise.get("starter"), stdin)
    portuguese = run(exercise.get("starterPt"), stdin)
    code_en = exercise.get("starter")
    code_pt = exercise.get("starterPt")
    if not english or not portuguese:
        code_en, code_pt = REFERENCES_EN.get(exercise["id"]), REFERENCES_PT.get(exercise["id"])
        english = run(code_en, stdin) or english
        portuguese = run(code_pt, stdin) or portuguese
    if not english and driver and REFERENCES_EN.get(exercise["id"]):
        code_en = REFERENCES_EN[exercise["id"]] + "\n" + driver
        code_pt = REFERENCES_PT[exercise["id"]] + "\n" + driver
        english, portuguese = run(code_en, stdin), run(code_pt, stdin)
    if not english or not portuguese:
        continue

    english = without_prompts(english, code_en)
    portuguese = without_prompts(portuguese, code_pt)
    changed = [(a, b) for a, b in zip(english, portuguese) if a != b]
    if changed:
        pairs[exercise["id"]] = changed

edits = 0
for path in glob.glob("src/data/phases/**/*.ts", recursive=True):
    with open(path, encoding="utf-8", newline="") as file:
        source = file.read()
    original = source

    for exercise_id, lines in pairs.items():
        at = source.find(f"id: '{exercise_id}'")
        if at < 0:
            continue
        following = source.find("id: '", at + 10)
        end = following if following > 0 else len(source)
        block = source[at:end]

        # Only the Portuguese half of `description` and of `sampleOutput` is rewritten.
        # The English is the source of truth for both; touching it would be inventing.
        for field in ("description:", "sampleOutput:"):
            field_at = block.find(field)
            if field_at < 0:
                continue
            segment = block[field_at:]
            match = re.search(r"pt:\s*'((?:[^'\\]|\\.)*)'", segment)
            if not match:
                match = re.search(r"b\('(?:[^'\\]|\\.)*',\s*'((?:[^'\\]|\\.)*)'", segment)
            if not match:
                continue
            literal = segment[match.start(1):match.end(1)]
            rewritten = literal
            for en_line, pt_line in lines:
                for a, b in ((en_line, pt_line), (readable(en_line), readable(pt_line))):
                    if a and a != b:
                        rewritten = rewritten.replace(a.replace("'", "\\'"), b.replace("'", "\\'"))
            if rewritten != literal:
                block = block[:field_at] + segment[:match.start(1)] + rewritten + segment[match.end(1):]
                edits += 1

        source = source[:at] + block + (source[end:] if following > 0 else "")

    if source != original and not DRY_RUN:
        with open(path, "w", encoding="utf-8", newline="") as file:
            file.write(source)
        print(f"patched {path}")

print(f"{edits} Portuguese output blocks re-derived from execution"
      + (" (dry run — nothing written)" if DRY_RUN else ""))
