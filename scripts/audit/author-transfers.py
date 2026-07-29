"""
Authors the transfer challenges for phases 29-39 and derives their expected outputs by
RUNNING them.

Phases 29-68 each lost their transfer exercise at some point before 15 July: the phase
factory only emits one when the spec carries a `transfer` block, and exactly one spec
still does (phase 28). That single gap is 240 of the 240 remaining v11 gate issues —
one content change, counted six ways, across forty phases.

The rule this file exists to enforce: an expected value is never typed by a human. Every
`publicExpected` and `hiddenExpected` below is captured from a real run of the reference
solution against the real after-code. Hand-authored expectations are how `{{file}}` and
`Queue size: 3` reached learners, and how ex6_zero told them to call int() on 9.2.

A transfer exercise has one job — apply the phase's idea to an unfamiliar problem — so
each is deliberately a different shape from that phase's `practice`, not a reskin.

    python3 scripts/audit/author-transfers.py > /tmp/transfers.json
"""

import io
import json
import contextlib

# Each entry: the learner-facing starter (docstring + pass), a reference solution used
# ONLY to derive expectations, and the two after-code snippets the grader runs.
TRANSFERS = {
29: dict(
    fn="unpinned_packages",
    doc='''Return the package names that have no exact version pin, sorted.

    A requirement line pins a version when it uses "==".
    "requests==2.31.0" is pinned; "requests" and "requests>=2.0" are not.
    ''',
    ref='''def unpinned_packages(lines):
    loose = []
    for line in lines:
        text = line.strip()
        if not text or text.startswith("#"):
            continue
        if "==" in text:
            continue
        name = text.split(">")[0].split("<")[0].split("~")[0].strip()
        loose.append(name)
    return sorted(loose)''',
    public='print(unpinned_packages(["requests==2.31.0", "flask", "pytest>=7.0"]))',
    hidden='print(unpinned_packages(["# comment", "numpy==1.26.0", "  ", "rich~=13.0"]))',
),
30: dict(
    fn="import_cycle",
    doc='''Return the two module names that import each other, sorted, or [] if none do.

    `imports` maps a module name to the list of modules it imports.
    A cycle here means A imports B and B imports A.
    ''',
    ref='''def import_cycle(imports):
    for name in sorted(imports):
        for target in imports[name]:
            if name in imports.get(target, []):
                return sorted([name, target])
    return []''',
    public='print(import_cycle({"api": ["models"], "models": ["api"], "utils": []}))',
    hidden='print(import_cycle({"a": ["b"], "b": ["c"], "c": []}))',
),
31: dict(
    fn="missing_init",
    doc='''Return the package directories that have no __init__.py, sorted.

    Every directory that contains a .py file is a package and needs an
    __init__.py beside it. "src/api/routes.py" puts "src/api" in that position.
    ''',
    ref='''def missing_init(paths):
    directories = set()
    initialised = set()
    for path in paths:
        if "/" not in path:
            continue
        directory, name = path.rsplit("/", 1)
        if not name.endswith(".py"):
            continue
        directories.add(directory)
        if name == "__init__.py":
            initialised.add(directory)
    return sorted(directories - initialised)''',
    public='print(missing_init(["src/api/routes.py", "src/api/__init__.py", "src/core/engine.py"]))',
    hidden='print(missing_init(["pkg/__init__.py", "pkg/tool.py", "README.md"]))',
),
32: dict(
    fn="usage_error",
    doc='''Return the usage error for a command line, or "" when it is valid.

    The only valid commands are "add <name>" and "list".
    Report exactly one problem, in this order:
      - no arguments at all          -> "missing command"
      - a command that is not known  -> "unknown command: <name>"
      - add without a name           -> "add needs a name"
    ''',
    ref='''def usage_error(args):
    if not args:
        return "missing command"
    command = args[0]
    if command not in ("add", "list"):
        return "unknown command: " + command
    if command == "add" and len(args) < 2:
        return "add needs a name"
    return ""''',
    public='print([usage_error([]), usage_error(["remove", "x"]), usage_error(["add"]), usage_error(["add", "todo"])])',
    hidden='print([usage_error(["list"]), usage_error(["list", "extra"]), usage_error(["Add"])])',
),
33: dict(
    fn="subject_problems",
    doc='''Return the commit subjects that break the rules, each with its reason.

    Each result is "<subject> -> <reason>", in the order the subjects arrive.
    The rules, checked in this order:
      - longer than 50 characters   -> "too long"
      - does not start with a capital -> "not capitalised"
      - ends with a full stop        -> "ends with a period"
    ''',
    ref='''def subject_problems(subjects):
    problems = []
    for subject in subjects:
        if len(subject) > 50:
            reason = "too long"
        elif not subject[:1].isupper():
            reason = "not capitalised"
        elif subject.endswith("."):
            reason = "ends with a period"
        else:
            continue
        problems.append(subject + " -> " + reason)
    return problems''',
    public='print(subject_problems(["Add login form", "fix bug", "Update docs."]))',
    hidden='print(subject_problems(["Rewrite the whole authentication and session handling layer", "Refactor the parser"]))',
),
34: dict(
    fn="untested_cases",
    doc='''Return the required cases that no test name mentions, sorted.

    A case is covered when its name appears anywhere in a test name,
    ignoring capitalisation. "test_empty_list" covers "empty".
    ''',
    ref='''def untested_cases(required, test_names):
    joined = " ".join(test_names).lower()
    return sorted(case for case in required if case.lower() not in joined)''',
    public='print(untested_cases(["empty", "negative", "zero"], ["test_empty_list", "test_zero_division"]))',
    hidden='print(untested_cases(["Unicode", "large"], ["test_unicode_names", "test_large_input"]))',
),
35: dict(
    fn="last_own_frame",
    doc='''Return the last traceback line that points at the learner's own file.

    Their file is the one whose path contains "student_code.py".
    Return "" when the traceback never reaches it.
    ''',
    ref='''def last_own_frame(lines):
    own = [line.strip() for line in lines if "student_code.py" in line]
    return own[-1] if own else ""''',
    public='print(repr(last_own_frame(["Traceback (most recent call last):", \'  File "student_code.py", line 3, in <module>\', \'  File "/lib/json.py", line 90, in loads\'])))',
    hidden='print(repr(last_own_frame(["Traceback (most recent call last):", \'  File "/lib/csv.py", line 12, in reader\'])))',
),
36: dict(
    fn="resolved_settings",
    doc='''Merge configuration and report anything unrecognised.

    Return a tuple: the resolved settings, then the rejected keys sorted.
    An environment value overrides a default. A key that is not in the
    defaults is not a setting, so it is rejected rather than merged.
    ''',
    ref='''def resolved_settings(defaults, environment):
    resolved = dict(defaults)
    rejected = []
    for key, value in environment.items():
        if key in defaults:
            resolved[key] = value
        else:
            rejected.append(key)
    return resolved, sorted(rejected)''',
    public='print(resolved_settings({"level": "info", "retries": "3"}, {"level": "debug", "colour": "always"}))',
    hidden='print(resolved_settings({"level": "info"}, {}))',
),
37: dict(
    fn="invalid_records",
    doc='''Return "<index>: <field>" for each record whose field has the wrong type.

    `schema` maps a field name to the type it must have. Report the first
    wrong field of each record, in the order the schema lists them.
    A missing field counts as wrong.
    ''',
    ref='''def invalid_records(records, schema):
    problems = []
    for index, record in enumerate(records):
        for field, expected in schema.items():
            value = record.get(field)
            if not isinstance(value, expected) or isinstance(value, bool) != (expected is bool):
                problems.append(str(index) + ": " + field)
                break
    return problems''',
    public='print(invalid_records([{"name": "Ana", "age": 30}, {"name": "Beto", "age": "31"}], {"name": str, "age": int}))',
    hidden='print(invalid_records([{"name": "Caio"}], {"name": str, "age": int}))',
),
38: dict(
    fn="shelf_report",
    doc='''Build a one-line report per shelf, in the order the shelves arrive.

    Each line reads "<shelf> count=<count> total=<total>".
    A shelf with no items still gets a line, with a total of 0.
    ''',
    ref='''def shelf_report(shelves, items):
    lines = []
    for shelf in shelves:
        owned = [item for item in items if item["shelf"] == shelf]
        total = sum(item["price"] for item in owned)
        lines.append(shelf + " count=" + str(len(owned)) + " total=" + str(total))
    return lines''',
    public='print(shelf_report(["A", "B"], [{"shelf": "A", "price": 10}, {"shelf": "A", "price": 5}, {"shelf": "B", "price": 7}]))',
    hidden='print(shelf_report(["A", "Z"], [{"shelf": "A", "price": 3}]))',
),
39: dict(
    fn="top_categories",
    doc='''Return the highest-spending categories as "<category>=<total>", best first.

    Ties are broken alphabetically. Return at most `limit` of them.
    ''',
    ref='''def top_categories(entries, limit):
    totals = {}
    for entry in entries:
        totals[entry["category"]] = totals.get(entry["category"], 0) + entry["amount"]
    ranked = sorted(totals.items(), key=lambda pair: (-pair[1], pair[0]))
    return [name + "=" + str(total) for name, total in ranked[:limit]]''',
    public='print(top_categories([{"category": "rent", "amount": 1200}, {"category": "food", "amount": 300}, {"category": "food", "amount": 250}], 2))',
    hidden='print(top_categories([{"category": "b", "amount": 5}, {"category": "a", "amount": 5}], 5))',
),
}


def run(reference: str, after: str) -> str:
    """Executes the reference and the grader's after-code exactly as the worker does."""
    scope: dict = {}
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        exec(compile(reference, "reference.py", "exec"), scope, scope)
        exec(compile(after, "grader_test.py", "exec"), scope, scope)
    return buffer.getvalue().strip()


out = {}
for phase, spec in TRANSFERS.items():
    starter = f'def {spec["fn"]}({", ".join(_p for _p in [])}):'  # placeholder, rebuilt below
    signature = spec["ref"].split("\n", 1)[0][4:-1]  # e.g. unpinned_packages(lines)
    starter = f'def {signature}:\n    """{spec["doc"].rstrip()}\n    """\n    pass'
    out[phase] = {
        "functionName": spec["fn"],
        "starterCode": starter,
        "publicAfterCode": spec["public"],
        "publicExpected": run(spec["ref"], spec["public"]),
        "hiddenAfterCode": spec["hidden"],
        "hiddenExpected": run(spec["ref"], spec["hidden"]),
        "requirements": [{"kind": "function", "value": spec["fn"]}],
    }

print(json.dumps(out, indent=2, ensure_ascii=False))
