import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  questionsAtom,
  themeAtom,
  currentQuestionAtom,
  allQuestionsAtom,
  navigateAtom,
} from '@/state/atoms';
import type { QuestionsData } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Workspace from '@/components/Workspace';

export default function App() {
  const [questions, setQuestions] = useAtom(questionsAtom);
  const theme = useAtomValue(themeAtom);
  const current = useAtomValue(currentQuestionAtom);
  const all = useAtomValue(allQuestionsAtom);
  const navigate = useSetAtom(navigateAtom);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load questions.json once
  useEffect(() => {
    let cancelled = false;
    fetch('/questions.json')
      .then((r) => r.json())
      .then((data: QuestionsData) => {
        if (!cancelled) setQuestions(data);
      })
      .catch((e) => console.error('Failed to load questions.json', e));
    return () => {
      cancelled = true;
    };
  }, [setQuestions]);

  // If no question selected and we have some, redirect to first.
  useEffect(() => {
    if (!current && all.length > 0) {
      navigate({ questionId: all[0].id });
    }
  }, [current, all, navigate]);

  if (questions.categories.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        Loading questions…
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Topbar />
      <div className="flex-1 min-h-0 flex">
        <Sidebar />
        <Workspace />
      </div>
    </div>
  );
}
