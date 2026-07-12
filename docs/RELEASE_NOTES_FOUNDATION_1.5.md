# Foundation Sprint 1.5

## Editor and resolution experience

- Code drafts persist locally and, after running `supabase/code-drafts.sql`, across signed-in devices.
- Autosave status is visible beside each exercise.
- Editor height adapts to phone and desktop viewports.
- Run, reset, loading, validation progress and console states use the shared design system.
- The latest five attempts are visible during the current study session.
- Validation feedback is divided into what worked, why a check failed and how to correct it.
- Runtime errors continue to use the detailed Python error explainer.
- Placeholders in Python comments, strings and docstrings are ignored. Only executable placeholders block validation.
- `package-project.ps1` creates a clean source ZIP from the project root.

## Database

Run `supabase/code-drafts.sql` once to sync unfinished exercise code between devices. Local autosave works without this migration.
