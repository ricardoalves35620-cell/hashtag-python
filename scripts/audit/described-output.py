"""
Does the task description promise the output the learner's program actually prints?

The learner agent found thirty "English shown to a Portuguese learner" hits in phases 0-8
and every one of them was worse than a language problem. Phase 8 reads:

    Saída antes da sua alteração:
    Queue size: 3
    Processing: Alice

and the starter it hands that same learner is

    print("Tamanho da fila:", len(clients))
    print("Processando:", name)

The printed strings ARE translated — `literalPt` covers them, and `audit:language`
correctly reports zero. What nobody was checking is that the description quotes the output
verbatim and was never re-derived after the translation. So the Portuguese learner runs the
code, reads "Tamanho da fila: 3" on the console, reads "Queue size: 3" in the task, and has
no way to tell which of the two is the app being wrong.

The rule enforced here is the standard's third one, applied to prose: an expected output
written by hand is a claim, and a claim has to be produced by running something.

Method — no string matching between languages, no guessing:

  1. run the EN starter, run the PT starter
  2. any line where the two differ is a line translation changed
  3. if the PT description contains the ENGLISH form of such a line, it is stale

    python3 scripts/audit/described-output.py
"""

import json
import re
import subprocess
import sys

EXERCISES = json.load(open("/tmp/ex0_20.json", encoding="utf-8"))


def load(path):
    try:
        with open(path, encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}


# A fill-in-the-blank starter cannot be run — it still contains `___`. Its reference
# solution can, and it is the same program the learner is meant to end up with. Without
# this, every `_fill` exercise was silently skipped, which is where the phase 7 and 8
# mismatches were hiding.
REFERENCES_EN = load("/tmp/references.json")
REFERENCES_PT = load("/tmp/references.pt.json")


def run(code, stdin=None):
    """Run a program and return its stdout lines, or None if it cannot run unattended."""
    if code is None or "___" in code:
        return None                                   # a blank still to fill
    if "input(" in code and stdin is None:
        return None                                   # it would block waiting for a person
    try:
        done = subprocess.run(
            [sys.executable, "-c", code],
            input="".join(f"{value}\n" for value in (stdin or [])),
            capture_output=True, text=True, timeout=15,
        )
    except subprocess.TimeoutExpired:
        return None
    if done.returncode != 0:
        return None
    return [line for line in done.stdout.split("\n") if line.strip()]


def without_prompts(lines, code):
    """
    Remove the text input() printed, so a promise can be compared with an answer.

    The app echoes prompts into the same stream the program prints to, so a real run of
    phase 5 reads "Valor: $Dias desde o início do plano:🚨 MARCADO para investigação" as
    ONE line. Comparing that against the task's "FLAGGED for investigation" finds nothing
    in common and reports success — on the exercise a learner had already complained about.

    Each prompt is removed ONCE, in source order, because that is how many times it was
    printed. Removing every occurrence deleted the "Telefone: " from phase 4's own output
    line and turned a correct sample into a reported mismatch.
    """
    joined = "\n".join(lines)
    for _, prompt in re.findall(r"input\(\s*f?([\"\'])(.*?)\1\s*\)", code or "", re.S):
        if prompt:
            joined = joined.replace(prompt, "", 1)
    return [line for line in joined.split("\n") if line.strip()]


def inputs_for(exercise):
    """The values the exercise's own first test feeds it — the author's chosen run."""
    for test in exercise.get("tests") or []:
        if test.get("inputs"):
            return test["inputs"]
    return None


def after_code(exercise):
    """The grader's own driver, for exercises whose deliverable is a function."""
    for test in exercise.get("tests") or []:
        if test.get("afterCode"):
            return test["afterCode"]
    return None


problems = []
samples = []
checked = 0

skipped = []
unread = []

for exercise in EXERCISES:
    stdin = inputs_for(exercise)
    english = run(exercise.get("starter"), stdin)
    portuguese = run(exercise.get("starterPt"), stdin)
    # Fall back on EMPTY as well as on None. A "from scratch" starter is a comment block:
    # it runs cleanly and prints nothing, so the first version of this check read eighteen
    # exercises as unreadable when their reference solutions were sitting right there.
    if not english or not portuguese:
        english = run(REFERENCES_EN.get(exercise["id"]), stdin) or english
        portuguese = run(REFERENCES_PT.get(exercise["id"]), stdin) or portuguese
    if english is None or portuguese is None:
        skipped.append(exercise["id"])
        continue
    checked += 1

    english = without_prompts(english, REFERENCES_EN.get(exercise["id"]) or exercise.get("starter"))
    portuguese = without_prompts(portuguese, REFERENCES_PT.get(exercise["id"]) or exercise.get("starterPt"))

    description = exercise.get("descPt") or ""
    # Pair the two runs line by line. Only lines the translation CHANGED can be stale.
    def readable(line):
        """
        Drop leading emoji and symbols — a task usually quotes the words, not the icon.

        The first version passed a RANGE to str.lstrip, which takes a set of characters,
        so "\U0001F000-\U0001FAFF" stripped exactly three characters and 🚨 was not one of
        them. The check then reported zero on the exercise it was written for.
        """
        return re.sub(r"^[^\w]+", "", line).strip()

    for en_line, pt_line in zip(english, portuguese):
        if en_line == pt_line:
            continue
        # Compare on the readable part. Phase 5's task says "FLAGGED for investigation"
        # while the program prints "🚨 FLAGGED for investigation", so whole-line matching
        # saw no overlap and reported nothing — for the one exercise a learner had already
        # complained about.
        en_words, pt_words = readable(en_line), readable(pt_line)
        if en_words and en_words in description and pt_words not in description:
            problems.append((exercise["phase"], exercise["id"], en_line, pt_line))

    # `sampleOutput` is held to the same rule. It is shown to the learner as "what your
    # program should print" AND the graders in phases 1-27 build their patterns from it,
    # so a hand-typed line here is both a broken promise and a wrong grade. ex3_guided
    # advertised a fifth line, "After tiles: 3535", that the code has never printed.
    # Phases 9-20 deliver a FUNCTION. Running the reference alone prints nothing, and the
    # sampleOutput is what the grader's afterCode prints when it calls that function — so
    # the program to run is reference + afterCode. Reporting an empty run as 202
    # mismatches, which the first version of this check did, is the same mistake as reading
    # `target: 'test_output'` as the learner's own stdout.
    driver = after_code(exercise)
    if not english and driver:
        english = run((REFERENCES_EN.get(exercise["id"]) or "") + "\n" + driver, stdin)
        portuguese = run((REFERENCES_PT.get(exercise["id"]) or "") + "\n" + driver, stdin)
    if english is None or portuguese is None:
        unread.append(exercise["id"])
        continue

    for language, sample, actual in (
        ("en", exercise.get("sample"), english),
        ("pt", exercise.get("samplePt"), portuguese),
    ):
        if not sample or "{{" in sample:            # a placeholder: the learner picks it
            continue
        if not actual:
            unread.append(f"{exercise['id']}.{language}")
            continue
        # Substring, not equality: the app echoes input() prompts into the same stream, so
        # a real run of an input-driven exercise reads "Nome:Idade:Maria, 35 anos" on one
        # line. Demanding whole-line equality reported that as three wrong values.
        for line in (l.strip() for l in sample.split("\n") if l.strip()):
            if not any(line in actual_line for actual_line in actual):
                samples.append((exercise["phase"], exercise["id"], language, line, actual))

for phase, exercise_id, language, line, actual in samples:
    print(f"  p{phase} {exercise_id}  sampleOutput.{language}")
    print(f"      promises  {line!r}")
    print(f"      but the program prints  {[a.strip() for a in actual]}")

for phase, exercise_id, en_line, pt_line in problems:
    print(f"  p{phase} {exercise_id}")
    print(f"      description promises  {en_line!r}")
    print(f"      the program prints    {pt_line!r}")

# Say what was NOT read. A coverage number that hides its own gaps is how phases 7 and 8
# passed this check while promising the wrong output in both.
if skipped:
    print(f"\nnot runnable, so not checked ({len(skipped)}): {', '.join(sorted(skipped))}")
if unread:
    print(f"\nsampleOutput not produced by any runnable program ({len(unread)}): "
          f"{', '.join(sorted(set(unread)))}")

total = len(problems) + len(samples)
print(
    f"\n{len(problems)} description lines and {len(samples)} sampleOutput lines do not match "
    f"what the program prints ({checked} of {len(EXERCISES)} exercises read)"
    if total
    else f"every description and sampleOutput matches what the program prints "
         f"({checked} of {len(EXERCISES)} exercises read)"
)
sys.exit(1 if total else 0)
