# Mini-project plain-language standard

This standard applies to every published mini-project in English and Brazilian Portuguese.

## Reader

Write as if the learner were ten years old and had never completed a programming project before. The technical challenge may grow, but the instructions must remain concrete.

## Every project must explain

1. **The story:** who needs the program and why.
2. **The finished result:** what the program will do when it works.
3. **The exact job:** a numbered list of small actions.
4. **Inputs:** what each typed value means and one example.
5. **Outputs:** what each printed line means and one example.
6. **A complete worked example:** input, what happens, and output.
7. **The names in the code:** every important variable, function, class, or command in simple words.
8. **A build order:** which TODO to solve first, second, and next.
9. **The purpose of each test:** what promise that example checks.
10. **The final improvement:** the exact change, an example, why it helps, and what must not change.

## Writing rules

- Use short sentences.
- Give one action per sentence.
- Prefer “read”, “save”, “add”, “repeat”, and “show” over abstract verbs.
- Never use an unexplained technical term.
- Do not say only “implement”, “validate”, “refactor”, “orchestrate”, or “provide evidence”.
- Show the exact order in which values enter `input()`.
- Show the expected visible output.
- Explain why multiple examples are needed.
- State clearly which button completes the step.
- A learner must not need another website or AI to discover what the project is asking for.

## Final-step rule

The final step is not a vague request to “improve the code”. Each option must say:

- what line or idea to change;
- a small code example;
- why the change is better;
- what behavior and output must remain unchanged;
- that every example must be run again.

## Verification

`src/miniProjectPlainLanguage.test.ts` protects the presence and completeness of these guides for all published mini-projects. A real beginner user test is still required before declaring the wording perfect.
