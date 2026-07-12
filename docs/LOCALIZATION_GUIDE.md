# Localization Guide

Hashtag Python treats Portuguese and English as complete learning experiences, not as a primary language plus a partial translation.

## Rules

1. Every user-facing sentence must have natural `en` and `pt` versions.
2. Portuguese learners must not need English to understand explanations or code comments.
3. Python keywords, API names, library names and commands stay in their original technical form.
4. Comments in lesson examples and starter code are localized.
5. Strings that are part of the programming exercise stay unchanged when the exercise evaluates that exact output.
6. Glossary matching uses complete words. An alias such as `file` must never split the word `filed`.
7. English copy should sound natural to an English-speaking developer, not like a literal translation.

## Localized code

Use bilingual code when a translation changes more than comments:

```ts
code: {
  en: `# Read the user's age\nage = int(input("Age: "))`,
  pt: `# Leia a idade do usuário\nage = int(input("Idade: "))`,
}
```

Existing single-string examples are supported. In Portuguese, the runtime localizes comments while preserving executable Python.

## Terms that remain in English

- Python keywords: `if`, `else`, `for`, `while`, `return`
- Function and library names: `print`, `input`, `pandas`, `pytest`
- Commands: `python --version`, `pip install`
- Error class names: `TypeError`, `ValueError`, `SyntaxError`

Always explain these terms in the selected language.
