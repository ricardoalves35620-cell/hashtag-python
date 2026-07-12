# Hashtag Python Component Guide

Foundation Sprint 1.2 introduces the canonical UI primitives in `src/components/ui`.

## Rules

1. New product UI must use these primitives before creating page-specific styles.
2. Variants describe meaning, not a raw colour: `success`, `warning`, `danger`, `info`.
3. Interactive controls must keep a 44px minimum touch target.
4. Every state must remain legible in light and dark themes.
5. Do not place raw hexadecimal colours in product pages.

## Primitives

### Button

Variants: `primary`, `secondary`, `ghost`, `danger`, `success`.
Sizes: `sm`, `md`, `lg`, `icon`.
Supports loading, icons and full width.

### Card

Variants: `default`, `raised`, `interactive`, `subtle`, plus semantic feedback variants.
Padding: `none`, `sm`, `md`, `lg`.

### Alert

Variants: `info`, `success`, `warning`, `danger`.
Alerts use accessible contrast and semantic `role` values.

### Input, Textarea and Select

Provide a consistent label, helper text, validation error and focus state. Inputs use 16px text to avoid iOS zoom.

### Badge

Use for short metadata and states. Avoid using badges as buttons.

### Progress

Includes accessible `progressbar` semantics, label and percentage support.

### Tabs

Use for switching between related views. Tabs are horizontally scrollable on small screens.

### Skeleton and EmptyState

Use these for loading and empty content instead of blank screens.

## Migrated in Sprint 1.2

- Global app header and language selector
- Bottom navigation
- Phase cards and progress bars
- Authentication screen and form states
- Configuration screen
- App error boundary
- Python error explanation cards

Screen-specific learning interactions will be migrated in Foundation Sprint 1.4, after the shell and navigation sprint.
