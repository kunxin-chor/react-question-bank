import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  questionsAtom,
  sidebarStateAtom,
  routeAtom,
  navigateAtom,
  solutionAtomFamily,
} from '@/state/atoms';
import type { Question } from '@/lib/types';

function AttemptedDot({ id }: { id: string }) {
  const sol = useAtomValue(solutionAtomFamily(id));
  if (!sol.attempted) return null;
  const passing = sol.lastRun && sol.lastRun.failed === 0 && sol.lastRun.passed > 0;
  return (
    <span
      title={passing ? 'All tests passing' : 'Attempted'}
      className={`inline-block w-2 h-2 rounded-full ${
        passing ? 'bg-emerald-500' : 'bg-amber-500'
      }`}
    />
  );
}

export default function Sidebar() {
  const { categories } = useAtomValue(questionsAtom);
  const [sb, setSb] = useAtom(sidebarStateAtom);
  const { questionId } = useAtomValue(routeAtom);
  const navigate = useSetAtom(navigateAtom);

  if (sb.collapsed) {
    return (
      <aside className="h-full w-8 shrink-0 border-r border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex items-start justify-center pt-2">
        <button
          aria-label="Expand sidebar"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => setSb({ ...sb, collapsed: false })}
        >
          »
        </button>
      </aside>
    );
  }

  return (
    <aside className="h-full w-72 shrink-0 border-r border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-light dark:border-border-dark">
        <span className="text-xs font-semibold tracking-wide uppercase text-slate-500">
          Questions
        </span>
        <button
          aria-label="Collapse sidebar"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => setSb({ ...sb, collapsed: true })}
        >
          «
        </button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {categories.map((cat) => {
          const open = sb.openCategories[cat.name] !== false; // default open
          return (
            <div key={cat.name} className="mb-1">
              <button
                className="w-full flex items-center justify-between px-3 py-1.5 text-sm font-medium hover:bg-slate-200/60 dark:hover:bg-slate-700/40"
                onClick={() =>
                  setSb({
                    ...sb,
                    openCategories: { ...sb.openCategories, [cat.name]: !open },
                  })
                }
              >
                <span>{cat.name}</span>
                <span className="text-slate-400 text-xs">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <ul>
                  {cat.questions.map((q: Question) => {
                    const active = q.id === questionId;
                    return (
                      <li key={q.id}>
                        <button
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left ${
                            active
                              ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300'
                              : 'hover:bg-slate-200/60 dark:hover:bg-slate-700/40'
                          }`}
                          onClick={() => navigate({ questionId: q.id, tab: 'question' })}
                        >
                          <span className="w-5 text-xs text-slate-400">{q.order}.</span>
                          <span className="flex-1 truncate">{q.title}</span>
                          <AttemptedDot id={q.id} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
