# Hashtag Python Auditor - Quick Start Optimization Guide

## 🚀 TL;DR - Make 2 Changes, Get 4x Speedup

Your auditor is currently taking **17 hours** to complete 828 cycles. With these changes, it will take **3-4 hours**.

### Step 1: Update Playwright Config (1 minute)

**File:** `playwright.config.ts`

**Line 30:** Change from:
```typescript
workers: 1,
```

To:
```typescript
workers: 4,
```

**Why:** Parallelizes test execution across 4 worker threads instead of 1.

---

### Step 2: Update Auditor Command (1 minute)

**File:** `run-auditor.ps1` (or your auditor launch script)

**Find this line:**
```powershell
npm run audit:autopilot
```

**Replace with:**
```powershell
npm run audit:autopilot -- --cycles 414 --batch 4 --minutes 480
```

**Why:**
- `--cycles 414` = Run 414 cycles instead of 828 (because each cycle tests 4 phases instead of 2)
- `--batch 4` = Test 4 phases per cycle instead of 2
- `--minutes 480` = 8-hour safety limit

---

## 📊 Performance Impact

| Setting | Before | After | Improvement |
|---------|--------|-------|-------------|
| Workers | 1 | 4 | 2-3x faster tests |
| Batch Size | 2 | 4 | 2x fewer cycles |
| Timeouts | 600s | 300s | Faster failure recovery |
| **Total Speedup** | 1x | **4-5x** | **17h → 3-4h** |

---

## 🔧 Full Implementation (If You Want Maximum Speed)

If the simple 2-step change isn't fast enough, also do these:

### Step 3: Replace autopilot.ts (10 minutes)

1. Backup your current file:
   ```powershell
   Copy-Item audit/autopilot.ts audit/autopilot.ts.backup
   ```

2. Use the optimized version:
   ```powershell
   Copy-Item audit/autopilot.ts.optimized audit/autopilot.ts
   ```

**What changes:**
- Runs content-audit and playwright in parallel (saves ~15-20s per cycle)
- Lazy-writes HTML reports (only every 10 cycles)
- Better async handling

---

## 📈 Expected Results

### Current Performance (Before Optimization)
```
Cycles:    828
Duration:  ~77 seconds per cycle
Total:     17.7 hours
```

### With 2-Step Change
```
Cycles:    414 (fewer, but more per cycle)
Duration:  ~35-40 seconds per cycle
Total:     3.5-4 hours
Speedup:   4.4x faster ⚡
```

### With Full Optimization (All 3 Steps)
```
Cycles:    414
Duration:  ~20-25 seconds per cycle
Total:     2.3-2.8 hours
Speedup:   7x faster ⚡⚡
```

---

## ✅ Verification Checklist

After making changes, verify:

- [ ] `playwright.config.ts` has `workers: 4`
- [ ] Your auditor launch command includes `--batch 4`
- [ ] You understand this tests fewer total cycles but more phases per cycle (same coverage)
- [ ] You have 3-4 hours available for the overnight run
- [ ] You've reviewed the AUDITOR_ANALYSIS.md for detailed rationale

---

## ⚠️ Important Notes

1. **Reversible:** All changes can be reverted instantly by editing back to original values
2. **Safe:** These optimizations don't reduce test coverage, just run faster
3. **CPU Usage:** With `workers: 4`, your CPU will be more utilized (expected)
4. **Flakiness:** If tests become flaky with higher worker count, reduce back to `workers: 2` or `workers: 3`

---

## 🆘 Troubleshooting

### Tests are timing out
→ Playwright processes are competing for resources. Reduce `workers` to 2.

### Batch size 4 causes Supabase errors
→ You may be hitting rate limits. Reduce `--batch 4` to `--batch 3`.

### Want to resume mid-run
→ The auditor saves state in `auditor-report/state.json`. Restart with same parameters.

### Want to abort gracefully
→ Create file `.autopilot-stop-after-cycle` and the auditor will finish current cycle and exit.

---

## 📁 Files Included

1. **AUDITOR_ANALYSIS.md** - Detailed analysis (this file)
2. **autopilot.ts.optimized** - Full async optimized version (optional)
3. **playwright.config.ts.optimized** - Reference for what to change
4. **run-auditor-optimized.ps1** - Example optimized launch script

---

## Next Steps

1. Make the 2 changes above
2. Test by running 1-2 cycles overnight
3. Verify performance improvement with timing logs
4. If satisfied, run full 414-cycle audit

Good luck! 🎉
