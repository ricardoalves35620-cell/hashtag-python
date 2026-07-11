#!/usr/bin/env python3
"""
Hashtag Python — Pre-deployment audit script
Run: python3 audit.py
"""
import re, os, sys

SRC = os.path.join(os.path.dirname(__file__), 'src')

PHASE_FILES = [
    'data/phases/phase1.ts',
    'data/phases/phases_2_to_8.ts',
    'data/phases/phases_9_to_27_stubs.ts',
    'data/phases/index.ts',
]
PAGE_FILES = [
    'App.tsx',
    'pages/Login.tsx',
    'pages/PhaseOverview.tsx',
    'pages/Lesson.tsx',
    'pages/Exercises.tsx',
    'pages/Quiz.tsx',
    'pages/Exam.tsx',
    'components/Layout.tsx',
    'components/BottomNav.tsx',
]

VALID_CHECK_TYPES = {'contains', 'contains_any', 'not_contains', 'no_error'}
VALID_BLOCK_TYPES = {'heading', 'text', 'code', 'tip', 'warning', 'video'}

def audit_file(fpath):
    issues = []
    if not os.path.exists(fpath):
        return [f"FILE NOT FOUND: {fpath}"]

    with open(fpath) as f:
        content = f.read()
        lines = content.split('\n')

    # 1. Duplicate imports
    imports = [l for l in lines if l.startswith('import')]
    seen = set()
    for imp in imports:
        if imp in seen:
            issues.append(f"DUPLICATE IMPORT: {imp.strip()}")
        seen.add(imp)

    # 2. Balanced brackets
    b = content.count('{') - content.count('}')
    s = content.count('[') - content.count(']')
    p = content.count('(') - content.count(')')
    if b != 0: issues.append(f"Unbalanced braces: {b:+}")
    if s != 0: issues.append(f"Unbalanced squares: {s:+}")
    if p != 0: issues.append(f"Unbalanced parens: {p:+}")

    # 3. Bad /home routes (not the redirect)
    for i, line in enumerate(lines):
        stripped = line.strip()
        if ('navigate("/home")' in stripped or "navigate('/home')" in stripped
            or ('to="/home"' in stripped and 'Navigate' not in stripped)
            or ('to=\'/home\'' in stripped and 'Navigate' not in stripped)):
            issues.append(f"Line {i+1}: BAD /home route: {stripped[:80]}")

    # 4. Invalid CheckType in exercise/exam checks arrays
    for m in re.finditer(r'checks:\s*\[.*?type:\s*[\'"]([^\'"]+)[\'"]', content, re.DOTALL):
        t = m.group(1)
        if t not in VALID_CHECK_TYPES:
            issues.append(f"Invalid CheckType in checks[]: '{t}'")

    return issues

def main():
    all_files = PHASE_FILES + PAGE_FILES
    all_ok = True

    print("=" * 60)
    print("HASHTAG PYTHON — PRE-DEPLOY AUDIT")
    print("=" * 60)

    for rel_path in all_files:
        fpath = os.path.join(SRC, rel_path)
        issues = audit_file(fpath)
        name = os.path.basename(fpath)

        if issues:
            all_ok = False
            print(f"\n❌ {name}")
            for issue in issues:
                print(f"   → {issue}")
        else:
            with open(fpath) as f:
                n = len(f.readlines())
            print(f"✅ {name} ({n} lines)")

    print("\n" + "=" * 60)
    if all_ok:
        print("✅ ALL FILES CLEAN — safe to deploy")
        sys.exit(0)
    else:
        print("❌ FIX ISSUES BEFORE DEPLOYING")
        sys.exit(1)
    print("=" * 60)

if __name__ == '__main__':
    main()
