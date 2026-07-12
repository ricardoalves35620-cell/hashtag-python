# Hashtag Python Design System

## Foundation Sprint 1.1

This document is the source of truth for visual decisions. New UI must use semantic tokens from `src/index.css` or their Tailwind mappings from `tailwind.config.js`.

## Principles

1. **Clarity before decoration.** Learning content must always win the visual hierarchy.
2. **Both themes are products.** Light and dark modes are designed independently and must both meet WCAG AA contrast targets.
3. **Semantic styling.** Use `surface`, `ink`, `line`, `primary`, `success`, `warning`, `danger`, or `info`; do not choose colors by hue.
4. **Mobile first.** Minimum tap target is 44 × 44 px. Inputs remain 16 px to prevent iOS zoom.
5. **Consistent rhythm.** Use the spacing, radius, typography, elevation, and motion scales defined below.

## Semantic color tokens

| Purpose | CSS token | Tailwind |
|---|---|---|
| App background | `--color-bg-canvas` | `bg-canvas` |
| Default surface | `--color-bg-surface` | `bg-surface` |
| Raised surface | `--color-bg-surface-raised` | `bg-raised` |
| Primary text | `--color-text-primary` | `text-ink` |
| Secondary text | `--color-text-secondary` | `text-ink-secondary` |
| Muted text | `--color-text-muted` | `text-ink-muted` |
| Default border | `--color-border-default` | `border-line` |
| Primary action | `--color-primary` | `bg-primary` |
| Primary soft surface | `--color-primary-soft` | `bg-primary-soft` |
| Success surface | `--color-success-surface` | `bg-success-surface` |
| Warning surface | `--color-warning-surface` | `bg-warning-surface` |
| Danger surface | `--color-danger-surface` | `bg-danger-surface` |
| Info surface | `--color-info-surface` | `bg-info-surface` |

Legacy `--c-*` tokens remain aliases during the migration and must not be used in newly written components.

## Typography

| Role | Token / Tailwind |
|---|---|
| Display | `--text-display` / `text-display` |
| Page heading | `--text-h1` / `text-h1` |
| Section heading | `--text-h2` / `text-h2` |
| Card heading | `--text-h3` / `text-h3` |
| Title | `--text-title` / `text-title` |
| Body | `--text-body` / `text-body` |
| Caption | `--text-caption` / `text-caption` |

Use `var(--font-sans)` for UI and `var(--font-mono)` for code only.

## Spacing

Use only the base rhythm: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80` px. CSS variables are `--space-1` through `--space-20`.

## Radius

- Small controls: `--radius-sm`
- Inputs and buttons: `--radius-md`
- Cards: `--radius-lg`
- Feature panels: `--radius-xl` or `--radius-2xl`
- Pills: `--radius-full`

## Elevation

Use `--shadow-xs` for cards, `--shadow-sm` for interactive hover, `--shadow-md` for floating panels, and `--shadow-lg` only for modals.

## Motion

- Fast feedback: `120ms`
- Standard transitions: `200ms`
- Larger transitions: `320ms`

All motion respects `prefers-reduced-motion`.

## Accessibility rules

- Do not communicate status by color alone.
- Keep body text at 16 px or larger.
- Use 44 px minimum touch targets.
- Use `:focus-visible`; never remove focus without replacement.
- Validate every component in both themes and at 390 px, 768 px, and 1280 px widths.

## Canonical components — Foundation 1.2

Product code should import from `src/components/ui`. Page-specific controls must not duplicate button, form, alert, progress, tab or card state styles. See `COMPONENT_GUIDE.md`.
