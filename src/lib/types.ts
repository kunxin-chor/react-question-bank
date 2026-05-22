export interface Question {
  id: string;
  aliases: string[];
  title: string;
  order: number;
  requirements: string;
  walkthrough: string;
  files: Record<string, string>;
  entry: string;
  tests: string;
  solution: Record<string, string>;
}

export interface Category {
  name: string;
  order: number;
  questions: Question[];
}

export interface QuestionsData {
  categories: Category[];
}

export type TabKey = 'question' | 'tests' | 'solution' | 'walkthrough';

export interface SolutionState {
  files: Record<string, string>;
  attempted: boolean;
  lastRun?: { passed: number; failed: number; at: number };
  updatedAt: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}
