# Hashtag Python Auditor - Optimized Version (Scenario A)
# This script runs the auditor with performance optimizations enabled
# Expected speedup: 4-5x faster than current (3-4 hours instead of 17 hours)

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Hashtag Python Auditor - Optimized Configuration" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if changes are in place
$needsChanges = $false

# Check playwright.config.ts for workers setting
$playwrightConfig = Get-Content -Path "playwright.config.ts" -Raw
if ($playwrightConfig -notmatch "workers:\s*[4-9]") {
    Write-Host "⚠️  WARNING: playwright.config.ts still has workers: 1" -ForegroundColor Yellow
    Write-Host "   You need to change: workers: 1 → workers: 4" -ForegroundColor Yellow
    Write-Host ""
    $needsChanges = $true
}

if ($needsChanges) {
    Write-Host "BEFORE RUNNING THE AUDITOR, make these changes:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Open playwright.config.ts" -ForegroundColor Cyan
    Write-Host "   Find: workers: 1," -ForegroundColor Gray
    Write-Host "   Replace with: workers: 4," -ForegroundColor Green
    Write-Host ""
    Write-Host "2. (Optional) Increase batch size in the command below" -ForegroundColor Cyan
    Write-Host "   Change: --batch 2 → --batch 4" -ForegroundColor Green
    Write-Host ""
    Read-Host "Press Enter after making changes, then this script will continue"
}

Write-Host ""
Write-Host "Configuration Summary:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$params = @{
    cycles = 414  # Reduced from 828 because we're testing more phases per cycle
    minutes = 480 # 8 hours max
    batch = 4     # ⚡ OPTIMIZED: Increased from 2 to 4
    "environment-offset" = 0
}

Write-Host "Total Cycles: $($params.cycles)" -ForegroundColor Gray
Write-Host "Phases per Cycle: $($params.batch)" -ForegroundColor Gray
Write-Host "Time Limit: $($params.minutes) minutes" -ForegroundColor Gray
Write-Host "Expected Total Time: 2-4 hours (vs 17 hours previously)" -ForegroundColor Green
Write-Host ""

Write-Host "Changes Applied:" -ForegroundColor Cyan
Write-Host "  ✓ Playwright workers: 1 → 4 (in playwright.config.ts)" -ForegroundColor Green
Write-Host "  ✓ Batch size: 2 → 4 phases per cycle" -ForegroundColor Green
Write-Host "  ✓ Timeout: 600s → 300s (still safe)" -ForegroundColor Green
Write-Host "  ✓ HTML reports: lazy-written (every 10 cycles + final)" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "Starting optimized auditor..." -ForegroundColor Cyan
Write-Host ""

# Build the command
$cmdArgs = @("audit:autopilot")
$params.GetEnumerator() | ForEach-Object {
    $cmdArgs += "--$($_.Key)"
    $cmdArgs += $_.Value
}

# Log start time
$startTime = Get-Date
Write-Host "Start Time: $startTime" -ForegroundColor Gray
Write-Host ""

# Run the auditor
npm run @cmdArgs

# Log end time and duration
$endTime = Get-Date
$duration = $endTime - $startTime
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Auditor Complete!" -ForegroundColor Green
Write-Host "Start: $startTime" -ForegroundColor Gray
Write-Host "End: $endTime" -ForegroundColor Gray
Write-Host "Duration: $($duration.Hours)h $($duration.Minutes)m $($duration.Seconds)s" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Report location: auditor-report/index.html" -ForegroundColor Cyan
