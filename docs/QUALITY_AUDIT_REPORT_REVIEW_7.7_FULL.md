# Full overnight audit review — Auditor 7.7

## Run scope

- Target: `https://www.hashtagpython.com`
- Auditor: 7.7.0
- Cycles: 828
- Duration: approximately 9 hours and 14 minutes
- Curriculum phases: 0 through 68
- Languages: Portuguese and English
- Devices exercised: iPhone, tablet and desktop Chromium profiles
- Themes exercised by the old rotation: dark on iPhone/desktop and light on tablet

## Important coverage limitation found

The 7.7 rotation produced only six unique device/language/theme combinations and repeated them twice. It did not cover the full 12-combination matrix. Sprint 7.8 fixes the rotation so each complete curriculum pass uses one stable environment and 828 cycles cover all 3 devices × 2 languages × 2 themes.

## Main findings

### 1. Exercise draft persistence race

The dominant failure was `Exercise draft did not survive reload`.

- 488 step failures across the run
- 343 in the first 414 cycles
- 145 in the second 414 cycles
- 179 environment/phase pairs failed on the first pass and passed on the second

This pattern indicates a hydration/save race rather than random visual instability. A late remote draft could overwrite a recent edit, and local persistence waited for a debounce before writing. Sprint 7.8 saves locally immediately and prevents late cloud responses from replacing user input.

### 2. Quiz identification depended on localized text

The auditor could not identify questions in phases 5, 13, 14 and 16.

- 48 failures
- caused by code-heavy question text, localization and formatting differences

Sprint 7.8 adds stable question and option identifiers to the UI and the auditor selects the correct answer by original option index rather than text matching.

### 3. Localization findings

The static auditor found 15 unique Portuguese localization warnings. Definite issues included English comments in code blocks in phases 10, 13 and 25. The remaining warnings mixed technical Python terms with prose and exposed weaknesses in the heuristic.

Sprint 7.8:

- rewrites the confirmed English comments in Portuguese;
- improves Portuguese explanations in phases 6 and 7;
- keeps Python keywords and code identifiers valid;
- removes technical identifiers from the generic mixed-language heuristic;
- returns zero static localization findings across all 69 phases.

### 4. Temporary network failures

Seven cycles were affected by DNS or connection timeouts. These were environmental connectivity failures rather than evidence that a specific phase was broken.

### 5. Report packaging memory failure

`Compress-Archive` exhausted memory after the large run. Sprint 7.8 uses Windows `tar.exe` to stream the report into a ZIP without loading the entire report into memory.

## Result interpretation

The 522 Playwright-failing cycles must not be interpreted as 522 independent app defects. Most were repeated manifestations of two root causes: draft persistence and text-based quiz identification. Sprint 7.8 fixes both the app-side draft race and the auditor-side quiz selection weakness.
