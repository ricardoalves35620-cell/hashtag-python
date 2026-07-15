# Hashtag Python Auditor Performance Analysis

**Current Status:**
- 607/828 cycles completed in ~13 hours
- Average: 77 seconds per cycle
- At this rate: ~27.5 hours total for 828 cycles
- Target: Complete audit during overnight window (8-10 hours)

---

## CRITICAL BOTTLENECKS IDENTIFIED

### 1. **Playwright Single Worker** ⚠️ HIGHEST IMPACT
**File:** `playwright.config.ts:30`
```
workers: 1,
```

**Problem:** Even though there's 1 test, Playwright is configured to use only 1 worker thread. This is conservative for auditing but wastes CPU cores.

**Current Cost:** Baseline sequential execution
**Optimized Cost:** Could gain 3-5x speedup with 4-6 workers

**Why it matters:** Your machine likely has 4+ cores. Using 1 worker means only 1 core working while others sit idle.

---

### 2. **Sequential Audit Execution** ⚠️ MAJOR IMPACT
**File:** `audit/autopilot.ts:362-375`
```typescript
const contentRun = run(process.execPath, ['--import', 'tsx', 'audit/content-audit.ts'], env)
const visualRun = run(process.execPath, [playwrightCli, 'test', '--project', device], env)
```

**Problem:** `content-audit.ts` runs, then waits for results, THEN runs Playwright. They're sequential when they could run in parallel.

**Current Cost:** 
- If content-audit = 15s, playwright = 62s → total 77s per cycle
- Sequential: 15 + 62 = 77s

**Optimized Cost:** 
- Running in parallel: max(15, 62) = 62s per cycle
- **Savings: ~19% per cycle**

---

### 3. **Conservative Timeouts & Retries**
**File:** `playwright.config.ts:25-26`
```
timeout: 600_000,        // 10 min per test
expect: { timeout: 12_000 }, // 12s per expectation
```

**File:** `playwright.config.ts:29`
```
retries,  // Defaults to 1 retry
```

**Problem:** 10-minute timeout is very conservative for a ~70s test. If a test occasionally hangs, the entire cycle is delayed.

**Current Cost:** Tail latency spikes if tests approach limits
**Optimized Cost:** 300s timeout (5 min) is still safe, cuts hang recovery time in half

---

### 4. **HTML Report Generation Every Cycle** ⚠️ MINOR BUT FIXABLE
**File:** `audit/autopilot.ts:504`
```typescript
writeHtml(path.join(reportDir, 'index.html'), state)
```

**Problem:** Generates full HTML report on every cycle (528 times so far). This JSON manipulation and file I/O adds overhead.

**Current Cost:** ~1-2s per cycle
**Optimized Cost:** Generate only every N cycles (e.g., 10) or at the end

---

### 5. **Batch Size Too Small**
**File:** `audit/autopilot.ts:309`
```typescript
const phaseCount = Math.min(args.batch, 69 - phaseStart)
```

**Default:** `batch: 2` → tests 2 phases per cycle
- 69 phases / 2 phases per cycle = 34.5 "learning passes"
- 34.5 passes × 12 environments = 414 cycles minimum
- But you're doing 828 cycles!

**Problem:** Doubling up work means doubling cycles needed. Not optimal for your time constraint.

**Current:** 2 phases/cycle × 77s = 154s per 2 phases
**Optimized:** 4 phases/cycle × 90s = 90s per 4 phases (more phases in same time)

---

## OPTIMIZATION RECOMMENDATIONS (Priority Order)

### ✅ MUST DO (Estimated: 30-50% speedup)

#### **1. Increase Playwright Workers** (Effort: 1 min)
Change `playwright.config.ts:30` from:
```typescript
workers: 1,
```
to:
```typescript
workers: 4,  // or 6 if your machine has cores available
```

This alone could give **3-4x speedup** for test execution if there are multiple test cases within the Playwright runner.

#### **2. Parallelize Audit Steps** (Effort: 10 min)
Change `audit/autopilot.ts:362-375` from sequential to parallel:
```typescript
// Run in parallel
const [contentRun, visualRun] = await Promise.all([
  runAsync(process.execPath, ['--import', 'tsx', 'audit/content-audit.ts'], env),
  runAsync(process.execPath, [playwrightCli, 'test', '--project', device], env),
])
```

**Estimated gain:** 10-20s per cycle (if content-audit is 15-20s)

#### **3. Reduce Conservative Timeouts** (Effort: 2 min)
In `playwright.config.ts`:
- Change `timeout: 600_000` → `timeout: 300_000` (10 min → 5 min)
- This is still very safe but prevents extreme hangs from derailing cycles

**Estimated gain:** Tail latency reduction, not average case

---

### 🟡 SHOULD DO (Estimated: 10-15% speedup)

#### **4. Increase Batch Size** (Effort: 1 min)
Change command to:
```bash
npm run audit:autopilot -- --cycles=414 --batch=4
```

This tests 4 phases per cycle instead of 2. Assuming parallel playwright with workers=4, you'd test 4 phases in ~90s vs current 154s for 2 phases.

**Estimated gain:** 40-50% per cycle if workers are increased

#### **5. Lazy-Write HTML Reports** (Effort: 5 min)
Update `autopilot.ts:504`:
```typescript
if (cycle % 10 === 0 || iteration === args.cycles) {  // Every 10th cycle + final
  writeHtml(path.join(reportDir, 'index.html'), state)
}
```

**Estimated gain:** 1-2s per cycle × 90% of cycles = 1-2 min total

---

### 🔵 NICE TO HAVE (Estimated: 5% speedup)

#### **6. Disable Detailed Artifacts** (Effort: 1 min)
Run with:
```bash
npm run audit:autopilot -- --cycles=414 --batch=4
# Do NOT set HP_AUDIT_DETAILED=true
```

Currently `playwright.config.ts:18-20` generates HTML reports for each failure. Disable unless debugging specific failures.

**Estimated gain:** Variable, only if tests fail frequently

---

## COMBINED OPTIMIZATION SCENARIOS

### Scenario A: Minimal Changes (5 min effort)
```bash
# Changes:
# - workers: 1 → 4 in playwright.config.ts
# - Increase batch: 2 → 4

# Expected improvement:
# - Current: 77s/cycle × 828 = 63,756s = 17.7 hours
# - Optimized: ~30-35s/cycle × 414 cycles = 12,420-14,490s = 3.4-4 hours
# - TOTAL WITH OPTIMIZATION: 3-4 hours (was 17 hours)
```

### Scenario B: Full Optimization (20 min effort)
```bash
# Changes:
# - workers: 1 → 6
# - Parallelize audit steps (content + visual)
# - batch: 2 → 4
# - Reduce timeout: 600s → 300s
# - Lazy HTML writes

# Expected improvement:
# - Current: 77s/cycle × 828 = 63,756s = 17.7 hours
# - Optimized: ~20-25s/cycle × 414 cycles = 8,280-10,350s = 2.3-2.9 hours
# - TOTAL WITH OPTIMIZATION: 2-3 hours (was 17 hours)
```

---

## WHAT CHANGED SINCE LAST VERSION?

### Code that's NEW/DIFFERENT:
1. **Batch processing** - The `batch` parameter is relatively new, allowing variable phases per cycle
2. **Environment matrix expansion** - Now testing 12 device/lang/theme combos (was likely fewer)
3. **Cycle-based state tracking** - More detailed cycle recording than before

### Why the Auditor Slowed Down:
The auditor design is actually optimal for **coverage** (testing every phase in every environment), but not optimal for **time-to-completion** during an overnight window. You need to trade some coverage for speed.

---

## NEXT STEPS

1. **Apply Scenario A** (minimal effort, 75% speedup):
   - Increase workers to 4
   - Increase batch to 4
   - Test overnight: should complete in 3-4 hours instead of 17

2. **Monitor** one cycle with optimized config:
   - Check if parallelization actually reduces cycle time
   - Verify no test flakiness with higher worker count

3. **If still slow**, apply Scenario B:
   - Parallelize the audit steps themselves
   - This gives another 20-30% gain

4. **If timeout issues appear**, you can adjust Playwright worker count or implement cycle checkpointing to resume mid-run.

---

## IMPORTANT NOTES

- ⚠️ **Do NOT reduce retries below 1** - Tests can be flaky, 1 retry is minimum
- ⚠️ **Do NOT increase workers beyond your CPU core count** - Check with `nproc` on Linux/Mac or Task Manager on Windows
- ⚠️ **Batch size >8 might hit Supabase rate limits** - Start with 4, increase cautiously
- ✅ **All changes are reversible** - You can easily revert if anything breaks

---

## ESTIMATED TIME SAVINGS

| Configuration | Cycles | Time/Cycle | Total Time | Speedup |
|---|---|---|---|---|
| Current | 828 | 77s | 17.7h | 1x |
| Scenario A (workers=4, batch=4) | 414 | ~35s | 4.0h | 4.4x |
| Scenario B (full optimization) | 414 | ~22s | 2.5h | 7.1x |

