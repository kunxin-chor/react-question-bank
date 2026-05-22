import type { Question } from './types';

export function buildAIPrompt(q: Question, studentFiles: Record<string, string>): string {
  const blob = (files: Record<string, string>) =>
    Object.entries(files)
      .map(([name, code]) => `\n\`\`\`jsx file=${name}\n${code}\n\`\`\``)
      .join('\n');

  return `You are reviewing a student's React solution. Grade correctness, idiomatic style, edge cases, and accessibility. Be concise and specific.

# Question
${q.title}

## Requirements
${q.requirements}

## Reference solution
${blob(q.solution)}

## Student's submission
${blob(studentFiles)}

## Tests (for context only — do not run)
\`\`\`js
${q.tests}
\`\`\`

Please reply with:
1. A pass/fail verdict per requirement.
2. Specific suggestions for improvement.
3. A score 0–10 with one-line justification.
`;
}
