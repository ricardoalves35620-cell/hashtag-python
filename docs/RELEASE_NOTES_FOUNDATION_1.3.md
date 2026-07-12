# Foundation Sprint 1.3 — Navigation and responsive layouts

## Goal
Create one reliable application shell across phone, tablet and desktop without changing curriculum content.

## Changes
- Rebuilt the shared app shell and page geometry.
- Added route-based scroll restoration.
- Added a keyboard-accessible skip link.
- Improved header title truncation, back navigation and language controls.
- Added safe-area handling for notches and home indicators.
- Normalized page width and responsive gutters across existing routes.
- Improved overscroll and touch scrolling.
- Corrected active navigation matching for nested course routes.
- Added compact landscape behavior.
- Converted the desktop bottom bar into a left navigation rail at wide breakpoints.
- Increased usable content width on tablet and desktop.

## Acceptance checks
- Header content remains visible at 320 px width.
- Bottom navigation does not cover page actions on iPhone.
- Nested lesson, exercise, quiz and exam routes keep Course active.
- Desktop content no longer looks like a narrow mobile column.
- Language controls remain reachable in every viewport.
- Changing route resets the content scroll position.
