# Sprint 7.2 — Interactive overnight auditor

## Changes

- `run-auditor.ps1` asks how many cycles to execute when no `-Cycles` value is supplied.
- The simple interactive mode starts a fresh audit automatically.
- `-Continue` resumes the existing audit state.
- `Minutes = 0` means no time limit; the run ends after the requested cycle count.
- The report is always compressed at the end, including when the auditor encounters an unexpected error.
- The report ZIP always uses the same path and overwrites the previous file:
  `Desktop/hashtag-python-audit-report.zip`.
- A `last-run.txt` summary is included in the report package.

## Simple usage

```powershell
Set-Location "C:\Projetos\hashtag-python"
.\run-auditor.ps1
```

The script asks only for the cycle count. It uses the configured audit URL and account automatically.

## Resume a previous run

```powershell
.\run-auditor.ps1 -Cycles 40 -Continue -NoOpen
```
