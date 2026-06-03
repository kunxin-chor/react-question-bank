import type { Question } from './types';

export function buildAIPrompt(q: Question, studentFiles: Record<string, string>): string {
  const blob = (files: Record<string, string>) =>
    Object.entries(files)
      .map(([name, code]) => `\n\`\`\`jsx file=${name}\n${code}\n\`\`\``)
      .join('\n');

  return `You are grading a student's React solution **strictly against the MODEL SOLUTION below**. The MODEL SOLUTION is the single source of truth for what is correct, idiomatic, and in-scope for this exercise.

# Grading rules — read carefully before responding

1. **Validate strictly against the MODEL SOLUTION.** A submission is correct if and only if it satisfies every requirement listed under "## Requirements" *in the same way the MODEL SOLUTION demonstrates*. Differences that produce the same observable behaviour as the MODEL SOLUTION are acceptable; differences that change behaviour are not.
2. **Do NOT suggest improvements that are outside the scope of the MODEL SOLUTION.** Specifically, do not recommend:
   - features, props, state, components, hooks, libraries, or files that the MODEL SOLUTION does not use;
   - refactors to patterns (e.g. custom hooks, context, memoisation, TypeScript, CSS-in-JS frameworks) that the MODEL SOLUTION does not use;
   - additional accessibility, performance, error-handling, validation, styling, or "nice-to-have" concerns that the MODEL SOLUTION does not address;
   - alternative code style choices (naming conventions, destructuring vs. property access, arrow vs. function declarations, etc.) when the student's choice already matches what the MODEL SOLUTION does.
3. **Only flag a student's code as wrong when it fails a requirement or diverges in behaviour from the MODEL SOLUTION.** If the student's submission is behaviourally equivalent to the MODEL SOLUTION for every requirement, treat it as correct, even if it is written differently.
4. Be concise and specific. Quote the exact requirement and the exact line(s) from the student's code when pointing something out.

# Question
${q.title}

## Requirements
${q.requirements}

## MODEL SOLUTION (the single source of truth)
${blob(q.solution)}

## Student's submission
${blob(studentFiles)}

## Tests (for context only — do not run)
\`\`\`js
${q.tests}
\`\`\`

Please reply with:
1. A pass/fail verdict per requirement, citing the requirement text and the relevant line(s) in the student's code.
2. A list of **only** the divergences from the MODEL SOLUTION that change observable behaviour or fail a requirement. If there are none, write "No divergences." Do not include suggestions that go beyond the MODEL SOLUTION's scope.
3. A score 0–10 with a one-line justification grounded in the requirements and the MODEL SOLUTION.
`;
}
