# Foundation 1.6.1 — Flexible Portuguese text grading

This patch makes human-facing output checks tolerant to Portuguese diacritics, capitalization and repeated whitespace.

Examples treated as equivalent in normalized checks:

- `João está aprovado`
- `joao esta aprovado`
- ` JOÃO   ESTÁ APROVADO `

Strict exercises can opt into `textMode: 'exact'` when punctuation, accents or exact formatting are part of the learning objective. Regex, numeric and structural checks are unchanged.
