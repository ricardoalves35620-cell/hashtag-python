#!/usr/bin/env python3
"""
Hashtag Python — Pre-deployment audit
Run: python3 audit.py
Catches: duplicate imports, unbalanced brackets, bad routes,
invalid CheckTypes, and UNESCAPED ${ in template literals (breaks tsc).
"""
import re, os, sys, glob

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')
VALID_CHECK = {'contains', 'contains_any', 'not_contains', 'no_error'}

def audit_file(fpath):
    issues = []
    with open(fpath, encoding='utf-8') as f:
        content = f.read()
    lines = content.split('\n')

    # 1. Duplicate imports
    seen = set()
    for line in lines:
        if line.startswith('import'):
            if line in seen:
                issues.append(f"DUPLICATE IMPORT: {line.strip()[:70]}")
            seen.add(line)

    # 2. Balanced brackets — hard error only in data files.
    #    Components may have brackets inside strings (false positives);
    #    the definitive check for those is `npm run build`.
    is_data_file = '/data/phases/' in fpath.replace('\\', '/')
    if is_data_file:
        for c, d in [('{','}'), ('[',']'), ('(',')')]:
            diff = content.count(c) - content.count(d)
            if diff:
                issues.append(f"Unbalanced {c}{d}: {diff:+}")

    # 3. Bad /home routes
    for i, line in enumerate(lines, 1):
        s = line.strip()
        if ('navigate("/home")' in s or "navigate('/home')" in s
            or ('to="/home"' in s and 'Navigate' not in s)):
            issues.append(f"Line {i}: bad /home route")

    # 4. Invalid CheckType in checks[]
    for m in re.finditer(r'checks:\s*\[([^\]]+)\]', content, re.DOTALL):
        for t in re.findall(r"type:\s*['\"]([^'\"]+)['\"]", m.group(1)):
            if t not in VALID_CHECK:
                issues.append(f"Invalid CheckType: '{t}'")

    # 5. CRITICAL: unescaped ${ inside template literals in DATA files
    #    (Python f-strings like f"${amount:.2f}" break the TS parser)
    if '/data/phases/' in fpath.replace('\\', '/'):
        for i, line in enumerate(lines, 1):
            for m in re.finditer(r'(?<!\\)\$\{', line):
                issues.append(f"Line {i}: UNESCAPED ${{ in template literal (use \\${{): {line.strip()[:60]}")

    return issues

def main():
    files = sorted(
        glob.glob(os.path.join(SRC, 'data', 'phases', '*.ts'))
        + glob.glob(os.path.join(SRC, '*.tsx'))
        + glob.glob(os.path.join(SRC, 'pages', '*.tsx'))
        + glob.glob(os.path.join(SRC, 'components', '*.tsx'))
    )

    print("=" * 60)
    print("HASHTAG PYTHON — PRE-DEPLOY AUDIT")
    print("=" * 60)

    all_ok = True
    for fpath in files:
        issues = audit_file(fpath)
        name = os.path.basename(fpath)
        if issues:
            all_ok = False
            print(f"\n❌ {name}")
            for issue in issues:
                print(f"   → {issue}")
        else:
            with open(fpath, encoding='utf-8') as f:
                n = sum(1 for _ in f)
            print(f"✅ {name} ({n} lines)")

    print("\n" + "=" * 60)
    if all_ok:
        print("✅ AUDIT PASSED")
        print("   Recommended final check: npm run build")
        sys.exit(0)
    else:
        print("❌ FIX ISSUES BEFORE DEPLOYING")
        sys.exit(1)

if __name__ == '__main__':
    main()
