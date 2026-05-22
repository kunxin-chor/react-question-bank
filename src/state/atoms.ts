import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { atomWithLocation } from 'jotai-location';
import type { Category, Question, QuestionsData, SolutionState, TabKey } from '@/lib/types';

// --- Static data: questions.json loaded once at app boot ----------------------

export const questionsAtom = atom<QuestionsData>({ categories: [] });

export const allQuestionsAtom = atom((get) => {
  const { categories } = get(questionsAtom);
  return categories.flatMap((c) => c.questions);
});

// Index by id AND by alias so reordered/renamed questions still resolve.
export const questionIndexAtom = atom((get) => {
  const map = new Map<string, Question>();
  for (const q of get(allQuestionsAtom)) {
    map.set(q.id, q);
    for (const a of q.aliases) map.set(a, q);
  }
  return map;
});

export const categoryOfAtom = atom((get) => {
  const map = new Map<string, Category>();
  for (const c of get(questionsAtom).categories) {
    for (const q of c.questions) map.set(q.id, c);
  }
  return map;
});

// --- Routing via jotai-location ----------------------------------------------

export const locationAtom = atomWithLocation();

// Parse the pathname into { questionId, tab }
export const routeAtom = atom((get) => {
  const loc = get(locationAtom);
  const pathname = loc.pathname || '/';
  const parts = pathname.split('/').filter(Boolean); // ['q', ':id', ':tab?']
  let questionId: string | null = null;
  let tab: TabKey = 'question';
  if (parts[0] === 'q' && parts[1]) {
    questionId = parts[1];
    const t = parts[2] as TabKey | undefined;
    if (t && ['question', 'tests', 'solution', 'walkthrough', 'preview'].includes(t)) {
      tab = t;
    }
  }
  return { questionId, tab };
});

// Setters for navigation. Components can `useSetAtom(navigateAtom)` and call.
export const navigateAtom = atom(
  null,
  (_get, set, target: { questionId?: string | null; tab?: TabKey }) => {
    set(locationAtom, (prev) => {
      const route = parseRoute(prev.pathname || '/');
      const questionId = target.questionId !== undefined ? target.questionId : route.questionId;
      const tab = target.tab ?? route.tab;
      const pathname = questionId
        ? `/q/${questionId}${tab && tab !== 'question' ? `/${tab}` : ''}`
        : '/';
      return { ...prev, pathname };
    });
  },
);

function parseRoute(pathname: string): { questionId: string | null; tab: TabKey } {
  const parts = pathname.split('/').filter(Boolean);
  let questionId: string | null = null;
  let tab: TabKey = 'question';
  if (parts[0] === 'q' && parts[1]) {
    questionId = parts[1];
    const t = parts[2] as TabKey | undefined;
    if (t && ['question', 'tests', 'solution', 'walkthrough', 'preview'].includes(t)) tab = t;
  }
  return { questionId, tab };
}

// Resolve the current Question object (handles alias ids).
export const currentQuestionAtom = atom((get) => {
  const { questionId } = get(routeAtom);
  if (!questionId) return null;
  return get(questionIndexAtom).get(questionId) ?? null;
});

// --- UI state -----------------------------------------------------------------

export const themeAtom = atomWithStorage<'light' | 'dark'>('qb:v1:theme', 'dark');

export interface SidebarState {
  collapsed: boolean;
  openCategories: Record<string, boolean>;
}
export const sidebarStateAtom = atomWithStorage<SidebarState>('qb:v1:sidebar', {
  collapsed: false,
  openCategories: {},
});

// --- Per-question saved solutions --------------------------------------------

const emptySolution = (): SolutionState => ({
  files: {},
  attempted: false,
  updatedAt: 0,
});

export const solutionAtomFamily = atomFamily((id: string) =>
  atomWithStorage<SolutionState>(`qb:v1:solution:${id}`, emptySolution()),
);

// Active file per question (transient session state — not persisted by default,
// but stored to survive question switches in one session).
export const activeFileAtomFamily = atomFamily((id: string) => atom<string | null>(null));
