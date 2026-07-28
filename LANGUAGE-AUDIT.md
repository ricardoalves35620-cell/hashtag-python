# Task 1 — Strict language isolation audit

Hashtag Python · 28 July 2026

## Method

Two passes, because either alone lies.

**Static.** A scanner (`scan-language.ts`) walks every learner-facing string reachable
from `ALL_PHASES` — phase titles, lesson blocks, checkpoints, exercise titles,
descriptions, hints, sample outputs, exam cases, and the `#` comments of every code
block — and runs each through `resolveLocalizedCode(…, lang)` first, so it sees what the
app renders rather than what the author typed. Detection is evidence-based: a hit needs
an unambiguous marker word. Code references (`greet(name, language="en")`, backticked
spans, quoted literals) are stripped before the Portuguese pass, so API names never
count as English.

**Dynamic.** A crawler drives the built app in `pt` across 30 routes and reports every
on-screen line carrying the other language — the only way to catch a hardcoded string
that never went through a bilingual object.

---

## Verdict

| Mode | Result |
|---|---|
| **English (`en`)** | **Clean.** Zero real violations. |
| **Portuguese (`pt`)** | **Fails.** 53% of code comments, plus scattered UI and content leaks. |

The asymmetry has a single cause, and it is structural rather than a list of typos.

---

## English mode: clean, and here is why the 20 raw hits are not violations

The scanner flagged 20 strings. Every one is a false positive, and the pattern is worth
recording so nobody "fixes" them later:

- **17 are accented characters in data**, not prose — `['Ana', 'João']`, `['A:Mouse',
  'C:Café']`, `'ação'`. These live in phases 11, 12, 17 and 18, where the exercise is
  *about* UTF-8 handling. Removing the accents would delete the point of the exercise.
- **1 is `pasta`** in a phase 14 restaurant analogy about keyword arguments. Italian
  food, not the Portuguese for "folder".
- **2 are the accented names inside those same sample outputs.**

There is also a structural reason English mode cannot drift: `localizePythonComments`
returns early for `lang === 'en'`, so English is the canonical source and the pipeline
never touches it. Nothing can corrupt it. Rule 1 holds.

---

## Portuguese mode: the systemic failure

### The mechanism

`src/lib/localization.ts` translates code comments at render time with a **176-entry
exact-match dictionary plus 77 word-level regex rules**. Anything the dictionary does
not cover stays in English. Anything the regex rules half-cover becomes a hybrid.

```
code blocks containing # comments        108
  fully Portuguese in pt mode             51   (47%)
  left entirely in English                14   (13%)
  half-translated — English + Portuguese  43   (40%)
```

**53% fail. The 40% that are half-translated are worse than the 13% left alone**, because
a beginner reading *"Crie the four variáveis below, using exactly these names"* cannot
tell which words are instructions, which are Python, and which are a bug.

Breakdown by surface:

| Surface | Leaking |
|---|---|
| Lesson code blocks | 28 / 59 |
| Exercise `starterCode` | 22 / 36 |
| Exam `starterCode` | 7 / 13 |

Confirmed on screen, not just in the data — `LessonBlock.tsx:152` and
`Exercises.tsx:394` both render through `resolveLocalizedCode`, and the crawler read
these two verbatim off the page in `pt`:

```
# primeiro select the row, then select the column.        /phase/9/exercises
# Wrap each in try/except com the CORRETO exception:      /phase/23/exercises
```

---

### 🔴 Two that are worse than language violations

**1. `can't` → `pode't`** — `src/data/phases/phases_2_to_8.ts:738`

The rule `[/\bcan\b/gi, 'pode']` fires inside the contraction, because `'` is a
non-word character and so `\b` matches between `can` and `'t`. A Brazilian learner in
phase 4 reads:

```python
# print(x + 5)            → TypeError: pode't add str + int
```

`pode't` is not a word in any language. It is also sitting next to a real Python error
name the learner is being taught to recognise.

**Correction — `phases_2_to_8.ts:738`:**
```diff
-# print(x + 5)            → TypeError: can't add str + int
+# print(x + 5)            → TypeError: não dá para somar str + int
```
…and the underlying rule must not fire inside contractions:
```diff
-[/\bcan\b/gi, 'pode'],
+[/\bcan\b(?!')/gi, 'pode'],
```

**2. `python -m build` → `python -m Construa`** — `advanced_40_to_53.ts:1340`

The rule `[/\bBuild\b/gi, 'Construa']` carries the `i` flag, so it matches lowercase
`build` in a shell command inside a comment. The instruction a Portuguese learner is
given no longer runs:

```
# python -m pip install -e .[dev]
# python -m pytest
# python -m Construa          ← this command does not exist
# install the wheel and run smoke tests
```

This is a broken instruction, not a translation defect. A learner who follows it gets
`No module named Construa`.

**Correction — `advanced_40_to_53.ts:1340`:**
```diff
-"# pyproject.toml defines package metadata and tools\n# CI runs from a clean checkout:\n# python -m pip install -e .[dev]\n# python -m pytest\n# python -m build\n# install the wheel and run smoke tests"
+"# pyproject.toml define os metadados e as ferramentas do pacote\n# A CI executa a partir de um checkout limpo:\n# python -m pip install -e .[dev]\n# python -m pytest\n# python -m build\n# instale o wheel e rode os testes de fumaça"
```

The translator must also never rewrite a line that is a command. Minimum guard:

```ts
// A comment line that is a runnable command is documentation of syntax, not prose.
const COMMAND_LINE = /^\s*(python|pip|npm|npx|git|node|curl|cd|ls|\$|>)\b/
function translateCommentToPt(comment: string): string {
  if (COMMAND_LINE.test(comment)) return comment
  // …existing logic
}
```

---

### The highest-traffic violations, with corrections

These are ordered by how early a beginner meets them.

| # | Location | Rendered in `pt` | Correction |
|---|---|---|---|
| 1 | `phase0.ts:67` | `# Crie the four variáveis below, using exactly these names:` `# Print a linha for each resource` | `# Crie as quatro variáveis abaixo, usando exatamente estes nomes:` `# Imprima uma linha para cada componente` |
| 2 | `phase1.ts:213` | `# Write your 5 print() linhas below:` | `# Escreva suas 5 linhas de print() abaixo:` |
| 3 | `phase1.ts` (`ex1_fill`) | `# preencha: "MusicBox" (com quotes — it's texto!)` | `# preencha: "MusicBox" (com aspas — é texto!)` |
| 4 | `phases_2_to_8.ts` (`ex3_fill`) | `# any name — texto needs quotes!` | `# qualquer nome — texto precisa de aspas!` |
| 5 | `phases_2_to_8.ts` (`ex2_zero`) | `# Split into 4 categories and print all 5 linhas:` | `# Divida em 4 categorias e imprima as 5 linhas:` |
| 6 | `phases_2_to_8.ts` lesson (p2) | `# Floor division → 3 (drops the decimal)` `# Modulo → 1 (somente the remainder)` | `# Divisão inteira → 3 (descarta a parte decimal)` `# Módulo → 1 (somente o resto)` |
| 7 | `phases_2_to_8.ts` lesson (p8) | `# Diana (fourth)` `# Diana (negative = from the fim!)` `# 4 — how many itens` | `# Diana (quarto)` `# Diana (negativo = a partir do fim!)` `# 4 — quantos itens` |
| 8 | `phases_2_to_8.ts` (`ex7_fill`) | `# preencha: keep going while stock >= 15` | `# preencha: continue enquanto stock >= 15` |
| 9 | `phases_2_to_8.ts` (`ex8_zero`) | `# Analyze the playlist:` | `# Analise a playlist:` |
| 10 | `phases_9_to_12_v11.ts:306` | `# primeiro select the row, then select the column.` | `# primeiro selecione a linha, depois selecione a coluna.` |
| 11 | `phases_9_to_12_v11.ts:330` | `# Add the selected cell from this row.` | `# Some a célula selecionada desta linha.` |
| 12 | `phases_9_to_12_v11.ts` (`p9-zero`) | `# Write the complete solution.` | `# Escreva a solução completa.` |
| 13 | `phases_9_to_12_v11.ts` (`p9-transfer`) | `# Validate the shape, then Construa a new nested lista.` | `# Valide o formato e construa uma nova lista aninhada.` |
| 14 | `phases_9_to_27.ts:117` | `# same número every single run` | `# o mesmo número em toda execução` |
| 15 | `phases_9_to_27.ts:537` | `# somente reached when the linha above worked` | `# só é alcançado quando a linha acima funciona` |
| 16 | `phases_9_to_27.ts` (p22) | `# 4 — tie goes to the even número` `# 6 — even again` | `# 4 — empate vai para o número par` `# 6 — par de novo` |
| 17 | `phases_9_to_27.ts` (`ex23_recog`) | `# Wrap each in try/except com the CORRETO exception:` | `# Envolva cada um em try/except com a exceção CORRETA:` |
| 18 | `phases_9_to_27.ts` (p23 lesson) | `# sem a net: the program stops here` | `# sem a rede de proteção: o programa para aqui` |
| 19 | `phases_9_to_27.ts` (p24 lesson) | `# Separated: the maths knows nothing about input or printing` | `# Separado: o cálculo não sabe nada sobre entrada nem impressão` |
| 20 | `phases_17_to_20_v11.ts` (`p17-complete`) | `# Validate and append the normalized record.` | `# Valide e adicione o registro normalizado.` |
| 21 | `phases_17_to_20_v11.ts` (`p19-complete`) | `# Validate the root type and serialize deterministically.` | `# Valide o tipo da raiz e serialize de forma determinística.` |
| 22 | `ai_54_to_68.ts` (p68 lesson) | `# 1. funciona depois model and index are downloaded, com network disconnected.` | `# 1. funciona depois que o modelo e o índice são baixados, com a rede desconectada.` |

### Checkpoint options — quiz answers shown in English

`phase.lesson.blocks[].checkpoint.options` are not translated in several phases. These
are multiple-choice answers, so an untranslated option is not cosmetic: it signals
"this is the odd one out" and gives away the answer by formatting alone.

| Location | `pt` shows | Correction |
|---|---|---|
| phase 1, phase 13 | `Error` / `An error` | `Erro` / `Um erro` |
| phase 14 (×3) | `['a'] then ['a', 'b']` | `['a'] depois ['a', 'b']` |
| phase 15 | `Returns the area` | `Retorna a área` |
| phase 15 | `An empty line` | `Uma linha vazia` |
| phase 17 (×3) | `3 then 0`, `3 then 3`, `3 then an error` | `3 depois 0`, `3 depois 3`, `3 depois um erro` |
| phase 18 | `first` | `primeira` |

### One hint with a real translation error

`phases_13_to_16_v11.ts`, `p15-complete-contract`:

> `Os títulos ausentes são Args e Returns.`

`Args` and `Returns` are **docstring section headers required verbatim by the
exercise**, so they must stay in English — this one is correct as written and is
listed here only so it is not "fixed" by mistake.

---

## The category that needs your decision, not my fix

**Sample outputs and string literals inside exercises.** In `pt`, phase 1 still expects
the learner's program to print `This is my first program!`, phase 3 expects
`After cartons: 960`, phase 24 expects `Error: Cannot divide by zero`.

Strictly, rule 2 says these should be Portuguese. But they are not UI text — they are
the *specification of what the learner's program must output*, and changing them means:

- rewriting `sampleOutput` for both languages,
- rewriting every `expectedOutput` and `matches` check that references them,
- and accepting that a learner switching language mid-course sees their previously
  passing exercises start failing.

There are three defensible positions:

1. **Leave them.** Program output is data, and English identifiers are the professional
   norm. Cheapest; technically violates your rule 2.
2. **Translate them per language**, and make the grader compare against
   `sampleOutput[lang]`. Correct by your rule; roughly 40 exercises to re-author and a
   grading change to accompany it.
3. **Make the sample output language-neutral** where the exercise allows — numbers and
   symbols rather than English words. Best pedagogy, most authoring work.

I did not act because option 2 is a grading change and you have already been bitten
once this week by a grading change made on inference rather than evidence.

---

## Root cause, and what I would actually build

The 22 corrections above fix today's leaks. They do not stop tomorrow's, because the
architecture guarantees recurrence: **a dictionary that silently passes through anything
it does not know.** Every new exercise an author writes adds untranslated comments, and
nothing fails.

Three changes, in order of value:

**1. Make the gap loud instead of silent.** Add a test that fails the build when a
rendered `pt` comment still contains English. This is the single highest-value change,
and it is about ten lines — the scanner already exists.

**2. Author comments bilingually.** `starterCode` already accepts a `Bilingual` object
(`resolveLocalizedCode` handles `code[lang]`), and 4 exercises already use it. The
dictionary exists only because the other 104 blocks are plain strings. Converting them
removes the translator from the critical path entirely — no dictionary, no regex, no
`pode't`.

**3. Until then, harden the two rules that corrupt.** Contraction guard and command-line
guard, shown above.

I would not extend the dictionary. It is at 176 entries and covers 47%; the curve is
flat, and each new entry adds a new chance of a `pode't`.
