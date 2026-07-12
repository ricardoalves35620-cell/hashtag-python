# Sprint 5 — Mobile viewport and code editor

## Fixed

- The accessibility skip link no longer stays visible or overlaps the iPhone status area.
- The bottom navigation hides while the mobile virtual keyboard is open and returns when it closes.
- The main content no longer keeps bottom-navigation spacing while the keyboard is open.
- Code editors never expand beyond the viewport width.
- Editable code can grow vertically to reveal the full program instead of hiding lines in an internal scroll area.

## Editor preferences

The Profile page now includes preferences for:

- automatic or compact editor height;
- wrapped lines or horizontal scrolling;
- editor text size from 14px to 22px.

Preferences are stored locally for all learners and synchronized through Supabase user metadata for signed-in accounts.

## Editor controls

Editable code blocks include text-size controls in the title bar. The editor toolbar remains horizontally scrollable without forcing the page wider than the screen.

## Mobile behavior

Virtual keyboard detection uses `visualViewport` only on narrow screens and only while an editable field is focused. Desktop window resizing does not hide navigation.
