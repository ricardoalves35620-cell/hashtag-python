# Foundation Sprint 1.2 — Component System

## Purpose

Turn the design tokens from Sprint 1.1 into reusable, accessible product components.

## Added

- Canonical Button, Card, Alert, Badge, Input, Textarea, Select, Progress, Tabs, Skeleton and EmptyState components.
- Loading and disabled states for buttons.
- Standard focus, hover, pressed and validation states.
- Responsive floating bottom navigation with consistent SVG icons.
- Standard header and language segmented control.
- Component authoring guide.

## Migrated

- Authentication and password recovery
- Guest entry card
- Phase cards
- Main navigation and header
- Configuration failure screen
- React error boundary
- Python error explanation

## Expected differences

- Controls use consistent height, radius and weight.
- Light mode no longer inherits white text from legacy screens in migrated areas.
- Dark mode has clearer borders and hover states.
- Bottom navigation occupies less visual space and has a stronger active state.
- Loading buttons show a spinner instead of changing text to `...`.

## Deferred

Learning exercises, quiz, exam and results receive their full component migration in Foundation Sprint 1.4. Home, progress and profile receive their page-level redesign in Sprint 1.5.
