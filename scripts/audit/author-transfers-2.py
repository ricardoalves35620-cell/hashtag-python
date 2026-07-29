"""
Transfer challenges for phases 40-68, expectations derived by running them.

Same rule as author-transfers.py: no expected value is ever typed by a human. Each one
below is captured from a real execution of the reference against the real after-code.

Each transfer applies the phase's idea to a problem the practice exercise does not
touch, because a transfer that reskins the practice tests recall, not transfer.

    python3 scripts/audit/author-transfers-2.py > /tmp/transfers2.json
"""

import io
import json
import contextlib

TRANSFERS = {
40: dict(fn="every_other", doc='''Return every second item of an iterable, starting with the first.

    Works on anything you can loop over, not just lists.
    ''', ref='''def every_other(items):
    return [value for index, value in enumerate(items) if index % 2 == 0]''',
    public='print(every_other(["a", "b", "c", "d", "e"]))',
    hidden='print(every_other(range(6)))'),

41: dict(fn="running_totals", doc='''Yield the running total after each number.

    Produce values one at a time rather than building the whole list first.
    ''', ref='''def running_totals(numbers):
    total = 0
    for number in numbers:
        total += number
        yield total''',
    # Yield is not a style preference here: "produce values one at a time rather than
    # building the whole list" cannot be satisfied without it.
    extra_requirements=[{"kind": "node", "value": "Yield"}],
    public='print(list(running_totals([10, 5, 20])))',
    hidden='print(list(running_totals([])))'),

42: dict(fn="count_calls", doc='''Wrap a function so it counts how many times it was called.

    Return the wrapper. It must expose the tally as wrapper.calls and still
    return whatever the original function returned.
    ''', ref='''def count_calls(function):
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return function(*args, **kwargs)
    wrapper.calls = 0
    return wrapper''',
    public='f = count_calls(lambda x: x * 2)\nprint([f(3), f(4), f.calls])',
    hidden='g = count_calls(lambda: None)\nprint(g.calls)'),

43: dict(fn="collecting", doc='''A context manager that collects everything appended inside it.

    Entering gives a fresh list. On exit the list must be left untouched so the
    caller can still read what was collected.
    ''', ref='''from contextlib import contextmanager

@contextmanager
def collecting():
    gathered = []
    try:
        yield gathered
    finally:
        pass''',
    public='with collecting() as bucket:\n    bucket.append("a")\n    bucket.append("b")\nprint(bucket)',
    hidden='with collecting() as bucket:\n    pass\nprint(bucket)'),

44: dict(fn="Duration", doc='''A Duration in minutes that adds with + and prints as "<n>min".

    Give it __add__ so two Durations added together make a longer one, and
    __str__ so printing one reads as minutes.
    ''', ref='''class Duration:
    def __init__(self, minutes):
        self.minutes = minutes
    def __add__(self, other):
        return Duration(self.minutes + other.minutes)
    def __str__(self):
        return str(self.minutes) + "min"''',
    public='print(str(Duration(30) + Duration(45)))',
    hidden='print(str(Duration(0) + Duration(0)))',
    # A class, so the structural requirement is the ClassDef node — "class" is not
    # one of the CodeRequirement kinds, and the type system caught that.
    # No __add__ requirement. The factory generates the description from a template
    # that can only name the class, so requiring a dunder means requiring something the
    # task text cannot mention — which is what audit-task-drift flags. ClassDef plus the
    # behaviour tests already prove + works; __add__ is the how, not the what.
    requirement_kind="node", requirement_value="ClassDef"),

45: dict(fn="describe_all", doc='''Return the description of every item that can describe itself.

    An item can when it has a callable `describe`. Skip the ones that cannot
    rather than failing on them.
    ''', ref='''def describe_all(items):
    out = []
    for item in items:
        describe = getattr(item, "describe", None)
        if callable(describe):
            out.append(describe())
    return out''',
    public='class A:\n    def describe(self):\n        return "an A"\nprint(describe_all([A(), "plain", 42]))',
    hidden='print(describe_all([]))'),

46: dict(fn="ordered_results", doc='''Return results in the order they were requested, not the order they finished.

    `finished` maps a task name to its result. `requested` is the order to
    report them in. A task with no result yet reports None.
    ''', ref='''def ordered_results(requested, finished):
    return [finished.get(name) for name in requested]''',
    public='print(ordered_results(["a", "b", "c"], {"c": 3, "a": 1}))',
    hidden='print(ordered_results([], {"a": 1}))'),

47: dict(fn="balance_load", doc='''Split work across workers so the totals are as close as possible.

    Give each next item to whichever worker currently has the least. Return the
    total each worker ends up with.
    ''', ref='''def balance_load(sizes, workers):
    totals = [0] * workers
    for size in sorted(sizes, reverse=True):
        index = totals.index(min(totals))
        totals[index] += size
    return totals''',
    public='print(balance_load([5, 3, 2, 8], 2))',
    hidden='print(balance_load([], 3))'),

48: dict(fn="memoized_calls", doc='''Count how many times the underlying work actually runs.

    Repeated arguments must reuse the earlier answer. Return the results and
    the number of real computations.
    ''', ref='''def memoized_calls(arguments):
    seen = {}
    results = []
    for value in arguments:
        if value not in seen:
            seen[value] = value * value
        results.append(seen[value])
    return results, len(seen)''',
    public='print(memoized_calls([2, 3, 2, 2, 3]))',
    hidden='print(memoized_calls([]))'),

49: dict(fn="where_clause", doc='''Build a WHERE clause and its parameters from a filter mapping.

    Return the clause and a list of values, with the columns in sorted order.
    An empty filter produces an empty clause and no values.
    ''', ref='''def where_clause(filters):
    columns = sorted(filters)
    if not columns:
        return "", []
    clause = " AND ".join(column + " = ?" for column in columns)
    return clause, [filters[column] for column in columns]''',
    public='print(where_clause({"status": "open", "city": "Recife"}))',
    hidden='print(where_clause({}))'),

50: dict(fn="retryable", doc='''Return the status codes worth retrying, in the order given.

    A request is worth retrying when the server failed (500 and above) or asked
    you to slow down (429). A client mistake is not worth retrying.
    ''', ref='''def retryable(codes):
    return [code for code in codes if code >= 500 or code == 429]''',
    public='print(retryable([200, 404, 429, 500, 503]))',
    hidden='print(retryable([400, 401, 403]))'),

51: dict(fn="unsafe_fields", doc='''Return the field names that must never cross a public boundary, sorted.

    A field is unsafe when its name contains any of: password, token, secret.
    The match ignores capitalisation.
    ''', ref='''def unsafe_fields(names):
    markers = ("password", "token", "secret")
    return sorted(name for name in names if any(m in name.lower() for m in markers))''',
    public='print(unsafe_fields(["email", "api_token", "Password_hash", "city"]))',
    hidden='print(unsafe_fields(["id", "name"]))'),

52: dict(fn="version_bump", doc='''Return the next version for a kind of change.

    "major" resets minor and patch, "minor" resets patch, "patch" adds one.
    Anything else returns the version unchanged.
    ''', ref='''def version_bump(version, kind):
    major, minor, patch = (int(part) for part in version.split("."))
    if kind == "major":
        return str(major + 1) + ".0.0"
    if kind == "minor":
        return str(major) + "." + str(minor + 1) + ".0"
    if kind == "patch":
        return str(major) + "." + str(minor) + "." + str(patch + 1)
    return version''',
    public='print([version_bump("1.4.2", "major"), version_bump("1.4.2", "minor"), version_bump("1.4.2", "patch")])',
    hidden='print(version_bump("0.9.9", "unknown"))'),

53: dict(fn="reconcile", doc='''Compare two ledgers and report what differs.

    Return three sorted lists: ids only on the left, only on the right, and ids
    present in both whose amounts disagree.
    ''', ref='''def reconcile(left, right):
    only_left = sorted(set(left) - set(right))
    only_right = sorted(set(right) - set(left))
    mismatched = sorted(k for k in set(left) & set(right) if left[k] != right[k])
    return only_left, only_right, mismatched''',
    public='print(reconcile({"a": 10, "b": 20}, {"b": 25, "c": 30}))',
    hidden='print(reconcile({}, {}))'),

54: dict(fn="magnitude", doc='''Return the length of a vector, rounded to two decimal places.

    The length is the square root of the sum of the squared components.
    ''', ref='''def magnitude(vector):
    return round(sum(value * value for value in vector) ** 0.5, 2)''',
    public='print(magnitude([3, 4]))',
    hidden='print(magnitude([0, 0, 0]))'),

55: dict(fn="scale_rows", doc='''Divide every row by its own largest absolute value.

    A row of all zeros is left as it is rather than dividing by zero. Round each
    result to two decimal places.
    ''', ref='''def scale_rows(rows):
    scaled = []
    for row in rows:
        peak = max((abs(value) for value in row), default=0)
        scaled.append([round(value / peak, 2) if peak else value for value in row])
    return scaled''',
    public='print(scale_rows([[2, 4], [-6, 3]]))',
    hidden='print(scale_rows([[0, 0]]))'),

56: dict(fn="column_gaps", doc='''Report how many values each column is missing.

    A value is missing when it is None or an empty string. Report every column
    that appears in any record, sorted, even when nothing is missing.
    ''', ref='''def column_gaps(records):
    columns = sorted({key for record in records for key in record})
    gaps = {}
    for column in columns:
        missing = 0
        for record in records:
            value = record.get(column)
            if value is None or value == "":
                missing += 1
        gaps[column] = missing
    return gaps''',
    public='print(column_gaps([{"name": "Ana", "city": ""}, {"name": None, "city": "Recife"}]))',
    hidden='print(column_gaps([{"a": 1}]))'),

57: dict(fn="confusion_counts", doc='''Count true positives, false positives, true negatives and false negatives.

    Return them in that order. Labels are 1 for positive and 0 for negative.
    ''', ref='''def confusion_counts(actual, predicted):
    tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)
    fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)
    tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)
    fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)
    return tp, fp, tn, fn''',
    public='print(confusion_counts([1, 0, 1, 0], [1, 1, 0, 0]))',
    hidden='print(confusion_counts([], []))'),

58: dict(fn="fold_indices", doc='''Split a dataset into k folds of consecutive indices.

    Earlier folds take the extra item when the size does not divide evenly.
    ''', ref='''def fold_indices(size, folds):
    base, extra = divmod(size, folds)
    result = []
    start = 0
    for index in range(folds):
        length = base + (1 if index < extra else 0)
        result.append(list(range(start, start + length)))
        start += length
    return result''',
    public='print(fold_indices(7, 3))',
    hidden='print(fold_indices(4, 4))'),

59: dict(fn="mean_absolute_error", doc='''Return the mean absolute error, rounded to three decimal places.

    An empty pair of lists has an error of 0.0.
    ''', ref='''def mean_absolute_error(actual, predicted):
    if not actual:
        return 0.0
    total = sum(abs(a - p) for a, p in zip(actual, predicted))
    return round(total / len(actual), 3)''',
    public='print(mean_absolute_error([3, -0.5, 2], [2.5, 0.0, 2]))',
    hidden='print(mean_absolute_error([], []))'),

60: dict(fn="label_counts", doc='''Count how many times each label appears, most common first.

    Ties are broken alphabetically by label.
    ''', ref='''def label_counts(labels):
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))''',
    public='print(label_counts(["spam", "ham", "spam", "ham", "spam"]))',
    hidden='print(label_counts([]))'),

61: dict(fn="relu_forward", doc='''Apply ReLU to every value: keep positives, replace anything else with 0.
    ''', ref='''def relu_forward(values):
    return [value if value > 0 else 0 for value in values]''',
    public='print(relu_forward([-2, 0, 3.5, 1]))',
    hidden='print(relu_forward([]))'),

62: dict(fn="epoch_losses", doc='''Return the average loss for each epoch, rounded to three decimals.

    `batches` maps an epoch number to its list of batch losses. Report epochs in
    increasing order.
    ''', ref='''def epoch_losses(batches):
    return [round(sum(v) / len(v), 3) for _, v in sorted(batches.items()) if v]''',
    public='print(epoch_losses({2: [0.4, 0.2], 1: [1.0, 0.8, 0.6]}))',
    hidden='print(epoch_losses({}))'),

63: dict(fn="rare_tokens", doc='''Return the tokens that appear fewer than `minimum` times, sorted.
    ''', ref='''def rare_tokens(tokens, minimum):
    counts = {}
    for token in tokens:
        counts[token] = counts.get(token, 0) + 1
    return sorted(token for token, count in counts.items() if count < minimum)''',
    public='print(rare_tokens(["a", "b", "a", "c", "a", "b"], 2))',
    hidden='print(rare_tokens([], 3))'),

64: dict(fn="attention_mask", doc='''Build a causal mask: position i may attend to positions up to and including i.

    Return a square grid of 1 for allowed and 0 for blocked.
    ''', ref='''def attention_mask(length):
    return [[1 if column <= row else 0 for column in range(length)] for row in range(length)]''',
    public='print(attention_mask(3))',
    hidden='print(attention_mask(1))'),

65: dict(fn="fits_in_memory", doc='''Return the quantisations whose weights fit in the memory available.

    `sizes` maps a quantisation name to its size in GB. Report the ones that fit
    in `available_gb`, largest first.
    ''', ref='''def fits_in_memory(sizes, available_gb):
    fitting = [(name, size) for name, size in sizes.items() if size <= available_gb]
    return [name for name, _ in sorted(fitting, key=lambda pair: -pair[1])]''',
    public='print(fits_in_memory({"Q4": 4.1, "Q8": 7.9, "F16": 15.2}, 8))',
    hidden='print(fits_in_memory({"Q8": 7.9}, 4))'),

66: dict(fn="tool_allowed", doc='''Decide whether a tool call may run.

    Return "" when it is allowed, otherwise the reason:
      - the tool is not on the allow list -> "tool not allowed: <name>"
      - the tool is allowed but the path leaves the sandbox -> "path escapes sandbox"
    A path escapes when it contains "..".
    ''', ref='''def tool_allowed(name, path, allowed):
    if name not in allowed:
        return "tool not allowed: " + name
    if ".." in path:
        return "path escapes sandbox"
    return ""''',
    public='print([tool_allowed("read", "docs/a.txt", ["read"]), tool_allowed("write", "a", ["read"]), tool_allowed("read", "../etc", ["read"])])',
    hidden='print(tool_allowed("read", "notes/../notes/a.txt", ["read"]))'),

67: dict(fn="overlapping_chunks", doc='''Split words into chunks of `size` that overlap by `overlap` words.

    The last chunk may be shorter. An overlap that is not smaller than the size
    would never advance, so return [] for that.
    ''', ref='''def overlapping_chunks(words, size, overlap):
    if overlap >= size or size <= 0:
        return []
    chunks = []
    start = 0
    while start < len(words):
        chunks.append(words[start:start + size])
        start += size - overlap
    return chunks''',
    public='print(overlapping_chunks(["a", "b", "c", "d", "e"], 3, 1))',
    hidden='print(overlapping_chunks(["a", "b"], 2, 2))'),

68: dict(fn="answer_confidence", doc='''Report how well the retrieved sources support an answer.

    Return "supported" when at least two sources score 0.7 or higher,
    "weak" when exactly one does, and "insufficient" when none do.
    ''', ref='''def answer_confidence(scores):
    strong = sum(1 for score in scores if score >= 0.7)
    if strong >= 2:
        return "supported"
    return "weak" if strong == 1 else "insufficient"''',
    public='print([answer_confidence([0.9, 0.8, 0.2]), answer_confidence([0.9, 0.1]), answer_confidence([0.3])])',
    hidden='print(answer_confidence([]))'),
}


def run(reference: str, after: str) -> str:
    scope: dict = {}
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        exec(compile(reference, "reference.py", "exec"), scope, scope)
        exec(compile(after, "grader_test.py", "exec"), scope, scope)
    return buffer.getvalue().strip()


def starter_for(spec: dict) -> str:
    """The learner-facing stub: the real signature, the rules, and nothing solved."""
    head = spec["ref"].split("\n")
    signature = next(line for line in head if line.startswith(("def ", "class ")))
    body = f'    """{spec["doc"].rstrip()}\n    """\n    pass'
    if signature.startswith("class "):
        return f'{signature}\n    """{spec["doc"].rstrip()}\n    """\n    pass'
    return f'{signature}\n{body}'


out = {}
for phase, spec in TRANSFERS.items():
    kind = spec.get("requirement_kind", "function")
    value = spec.get("requirement_value", spec["fn"])
    out[phase] = {
        "functionName": spec["fn"],
        "starterCode": starter_for(spec),
        "publicAfterCode": spec["public"],
        "publicExpected": run(spec["ref"], spec["public"]),
        "hiddenAfterCode": spec["hidden"],
        "hiddenExpected": run(spec["ref"], spec["hidden"]),
        "requirements": [{"kind": kind, "value": value}, *spec.get("extra_requirements", [])],
    }

print(json.dumps(out, indent=2, ensure_ascii=False))
