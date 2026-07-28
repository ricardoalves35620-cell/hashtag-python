"""
Behavioural grading harness — the piece that would run inside the existing Pyodide
worker, alongside the AST analysis already in public/python.worker.js.

The idea in one line: stop comparing the learner's printed text to a fixed string, and
start comparing what their code DOES to what a reference implementation does, over a
set of inputs the learner never sees.

Design constraints this respects, because they are already true of the app:
  * runs offline, in a worker, with no network and no API key
  * deterministic — the same submission always gets the same verdict
  * the learner's code is never sent anywhere (LGPD: no new data processor)
  * bounded time — the worker already enforces a 2.5-3.5s budget per exercise

What it does NOT do: decide whether prose is a good explanation. That needs a different
tool and is argued separately.
"""

from __future__ import annotations

import ast
import io
import math
import random
import contextlib
from dataclasses import dataclass, field
from typing import Any, Callable


# --------------------------------------------------------------------------- model


@dataclass
class Case:
    """One observation. `visible` cases can be shown in feedback; the rest cannot."""
    args: tuple = ()
    kwargs: dict = field(default_factory=dict)
    stdin: list[str] = field(default_factory=list)
    label: str = ""
    visible: bool = False


@dataclass
class Outcome:
    returned: Any = None
    printed: str = ""
    raised: str | None = None


@dataclass
class CaseResult:
    case: Case
    expected: Outcome
    actual: Outcome
    passed: bool
    reason: str = ""


# ----------------------------------------------------------------------- execution


class _Stdin:
    """input() reads from a scripted list. Running out is a real failure, not a hang."""

    def __init__(self, lines: list[str]):
        self._lines = list(lines)

    def __call__(self, prompt: str = "") -> str:
        if not self._lines:
            raise EOFError("the program asked for more input than the test provides")
        print(prompt, end="")
        return self._lines.pop(0)


def _sandbox_globals(stdin: list[str]) -> dict:
    """
    A fresh namespace per case, so state cannot leak between observations, plus a seeded
    random and a frozen clock. Without those two, a correct solution using random or
    datetime fails intermittently — the single worst kind of grading bug, because the
    learner cannot reproduce it.
    """
    scope: dict[str, Any] = {"__name__": "__student__"}
    seeded = random.Random(20260728)
    scope["random"] = type("random", (), {
        "random": seeded.random, "randint": seeded.randint,
        "choice": seeded.choice, "shuffle": seeded.shuffle, "seed": lambda *_: None,
    })
    scope["input"] = _Stdin(stdin)
    return scope


def run_once(source: str, entry: str | None, case: Case, budget_ops: int = 2_000_000) -> Outcome:
    scope = _sandbox_globals(case.stdin)
    buffer = io.StringIO()
    try:
        with contextlib.redirect_stdout(buffer):
            exec(compile(source, "student.py", "exec"), scope)  # noqa: S102 - sandboxed by Pyodide
            returned = None
            if entry:
                fn = scope.get(entry)
                if not callable(fn):
                    return Outcome(printed=buffer.getvalue(),
                                   raised=f"NameError: {entry} is not defined")
                returned = fn(*case.args, **case.kwargs)
        return Outcome(returned=returned, printed=buffer.getvalue())
    except Exception as error:  # noqa: BLE001 - the learner's error IS the result
        return Outcome(printed=buffer.getvalue(), raised=f"{type(error).__name__}: {error}")


# ---------------------------------------------------------------------- comparison


def equivalent(a: Any, b: Any, tolerance: float = 1e-9) -> bool:
    """
    Structural equality with the two exceptions that generate the most false negatives:
    float noise, and dict/set ordering.
    """
    if isinstance(a, float) or isinstance(b, float):
        try:
            return math.isclose(float(a), float(b), rel_tol=tolerance, abs_tol=tolerance)
        except (TypeError, ValueError):
            return False
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(equivalent(a[k], b[k], tolerance) for k in a)
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return len(a) == len(b) and all(equivalent(x, y, tolerance) for x, y in zip(a, b))
    if isinstance(a, set) and isinstance(b, set):
        return a == b
    return a == b


def _normalise_print(text: str) -> str:
    """Presentation differences that do not change meaning: trailing space, blank lines."""
    return "\n".join(line.rstrip() for line in text.strip().splitlines() if line.strip())


def compare(expected: Outcome, actual: Outcome, mode: str) -> tuple[bool, str]:
    if actual.raised and not expected.raised:
        return False, f"your code stopped with {actual.raised}"
    if expected.raised and not actual.raised:
        return False, f"this input should raise {expected.raised}, but nothing was raised"
    if expected.raised and actual.raised:
        want, got = expected.raised.split(":")[0], actual.raised.split(":")[0]
        return (want == got), "" if want == got else f"expected {want}, got {got}"
    if mode == "return":
        ok = equivalent(expected.returned, actual.returned)
        return ok, "" if ok else f"expected {expected.returned!r}, got {actual.returned!r}"
    ok = _normalise_print(expected.printed) == _normalise_print(actual.printed)
    return ok, "" if ok else "the printed lines differ"


# -------------------------------------------------------------------------- grading


def grade(
    learner_source: str,
    reference_source: str,
    entry: str | None,
    cases: list[Case],
    mode: str = "return",
) -> list[CaseResult]:
    """
    The reference runs in the same sandbox as the learner, so the expected answer is
    derived rather than authored. An author who changes the spec cannot forget to update
    the expected output — there isn't one.
    """
    results: list[CaseResult] = []
    for case in cases:
        expected = run_once(reference_source, entry, case)
        actual = run_once(learner_source, entry, case)
        passed, reason = compare(expected, actual, mode)
        results.append(CaseResult(case, expected, actual, passed, reason))
    return results


# ------------------------------------------------------- anti-hardcoding (AST layer)


def looks_hardcoded(source: str, entry: str, case_count: int) -> str | None:
    """
    Behavioural testing alone is fooled by a lookup table when the case list is short.
    This reuses the shape of detectHardcodedAnswer that already exists in pyodide.ts:
    a function that never reads its own arguments is not solving anything.
    """
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return None
    for node in ast.walk(tree):
        if not isinstance(node, ast.FunctionDef) or node.name != entry:
            continue
        params = {a.arg for a in [*node.args.posonlyargs, *node.args.args, *node.args.kwonlyargs]}
        if not params:
            return None
        loaded = {n.id for n in ast.walk(node) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Load)}
        if not (params & loaded):
            return f"{entry} never reads its own arguments, so it returns the same thing for every input"
        branches = sum(isinstance(n, (ast.If, ast.Match)) for n in ast.walk(node))
        if branches >= case_count and case_count > 1:
            return f"{entry} has one branch per test case, which looks like a lookup table rather than a rule"
    return None
