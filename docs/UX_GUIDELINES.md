# Hashtag Python UX Guidelines

## Motion

Motion must communicate state, hierarchy or completion. It must never delay learning.

- Route transitions: 120–220 ms.
- Button feedback: immediate and subtle.
- Success celebrations: non-blocking and under two seconds.
- Loading indicators must include accessible status text.
- Every animation must respect `prefers-reduced-motion`.

## Scrolling

- Each screen should expose one primary vertical scroll container.
- Mouse wheel and trackpad gestures should work from any non-modal area of the application.
- Nested scroll regions are reserved for editors, consoles, tables and horizontal tab rows.
- Nested scroll regions must release scrolling to the page at their boundaries.
- Navigation and headers must not capture or disable wheel input.

## Feedback

- Use inline feedback for learning decisions.
- Use toasts for short system status messages only.
- Success motion must reinforce an achievement, not replace explanatory text.
- Errors must remain visible until the learner acts or dismisses them.
