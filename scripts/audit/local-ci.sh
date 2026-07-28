#!/usr/bin/env bash
# Runs the whole Quality Gate locally, including the tests that normally skip.
#
# Three CI failures in a row were in credential-gated tests. They skip without
# AUDIT_USER_*, so they had never run anywhere — each one cost a full round-trip to
# discover. This makes them runnable without touching the real backend.
#
#   scripts/audit/local-ci.sh              # everything
#   scripts/audit/local-ci.sh --smoke-only # just the browser suite, both stub modes
#
# What it does NOT cover: real RLS, real cascades, real network timing, and Safari.
# Those still need a networked run against Supabase.
set -uo pipefail
cd "$(dirname "$0")/../.."

PORT_STUB=54321
PORT_APP=4173
PYODIDE_SRC="${PYODIDE_SRC:-node_modules/pyodide}"
fail=0

cleanup() { pkill -f 'audit/supabase-stub' 2>/dev/null || true; pkill -f 'vite preview' 2>/dev/null || true; }
trap cleanup EXIT

step() { printf '\n=== %s\n' "$1"; shift; if "$@" >/tmp/local-ci.log 2>&1; then echo PASS; else echo "FAIL"; tail -15 /tmp/local-ci.log; fail=1; fi; }

if [ "${1:-}" != "--smoke-only" ]; then
  step "typecheck"        npm run typecheck
  step "unit tests"       npm run test
  step "content audit"    npm run audit:content
  step "curriculum audit" npm run audit:curriculum
  step "npm audit (shipped code)" npm audit --omit=dev --audit-level=high
fi

echo
echo "=== building against the local stub"
# config.ts permits http:// on localhost, so the app needs no test-only branch.
VITE_SUPABASE_URL="http://127.0.0.1:${PORT_STUB}" \
VITE_SUPABASE_ANON_KEY="stub-anon-key-at-least-twenty-chars" \
  npm run build >/tmp/local-ci-build.log 2>&1 || { echo "build FAILED"; tail -15 /tmp/local-ci-build.log; exit 1; }

step "first-paint budget" npm run audit:budget

# Serve Pyodide locally so the exercise tests can actually execute Python. Without this
# they wait out a CDN download that a sandboxed or offline machine will never finish.
if [ -d "$PYODIDE_SRC" ]; then
  mkdir -p dist/pyodide/v0.25.1/full
  cp "$PYODIDE_SRC"/{pyodide.js,pyodide.asm.js,pyodide.asm.wasm,pyodide-lock.json,python_stdlib.zip} dist/pyodide/v0.25.1/full/
  node -e '
    const fs = require("fs"), p = "dist/python.worker.js";
    const s = fs.readFileSync(p, "utf8");
    fs.writeFileSync(p, s.replace(/https:\/\/cdn\.jsdelivr\.net\/pyodide\/v\$\{PYODIDE_VERSION\}\/full\//, "/pyodide/v${PYODIDE_VERSION}/full/"));
  '
  echo "pyodide served locally"
else
  echo "note: $PYODIDE_SRC not found — exercise tests will wait on the CDN"
fi

nohup npx vite preview --port "$PORT_APP" --strictPort --host 127.0.0.1 >/tmp/local-ci-preview.log 2>&1 &
sleep 6

export HP_AUDIT_BASE_URL="http://127.0.0.1:${PORT_APP}"
export HP_AUDIT_SERVICE_WORKERS=allow
export HP_AUDIT_DEPTH=smoke
export HP_AUDIT_RETRIES=0
export AUDIT_USER_EMAIL="${AUDIT_USER_EMAIL:-teste@hashtagpython.com}"
export AUDIT_USER_PASSWORD="${AUDIT_USER_PASSWORD:-testehashtagpython}"

# Two backend shapes, because they exercise different code paths on reload:
#   remembers  — a learner whose notes and progress synced
#   forgetful  — a learner whose did not. This is the harsher one, and closer to a
#                fresh account, which is what CI signs in as.
for mode in "" "--forgetful"; do
  pkill -f 'audit/supabase-stub' 2>/dev/null || true
  sleep 1
  nohup node scripts/audit/supabase-stub.mjs --port "$PORT_STUB" $mode >/tmp/local-ci-stub.log 2>&1 &
  sleep 2
  printf '\n=== store-readiness smoke — backend %s\n' "${mode:-remembers writes}"
  if npx playwright test tests/audit/store-readiness.smoke.spec.ts --project=desktop-chromium --reporter=line 2>&1 | tail -4; then :; else fail=1; fi
done

echo
echo "=== v11 gate (reporting only)"
npm run audit:v11:gate >/tmp/local-ci-v11.log 2>&1 || true
grep -oE '[0-9]+ issue\(s\)' /tmp/local-ci-v11.log | head -1

echo
if [ "$fail" -eq 0 ]; then echo "ALL BLOCKING STEPS PASSED"; else echo "SOMETHING FAILED — see above"; fi
exit "$fail"
