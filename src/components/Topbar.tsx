import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { themeAtom, currentQuestionAtom, solutionAtomFamily } from '@/state/atoms';
import { buildAIPrompt } from '@/lib/ai';

// Stable no-op family entry used when no question is selected so hook order
// stays consistent on every render.
const NOOP_ID = '__noop__';

export default function Topbar() {
  const [theme, setTheme] = useAtom(themeAtom);
  const q = useAtomValue(currentQuestionAtom);
  const activeId = q?.id ?? NOOP_ID;

  const sol = useAtomValue(solutionAtomFamily(activeId));
  const setSol = useSetAtom(solutionAtomFamily(activeId));

  const handleReset = () => {
    if (!q) return;
    if (!confirm('Reset your code for this question back to the starter files?')) return;
    setSol({ files: { ...q.files }, attempted: false, updatedAt: Date.now() });
  };

  const handleExport = () => {
    if (!q) return;
    const files = Object.keys(sol.files).length ? sol.files : q.files;
    const payload = JSON.stringify(
      { questionId: q.id, title: q.title, files, exportedAt: new Date().toISOString() },
      null,
      2,
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${q.title.replace(/\s+/g, '-').toLowerCase()}.solution.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleCopyForAI = async () => {
    if (!q) return;
    const files = Object.keys(sol.files).length ? sol.files : q.files;
    await navigator.clipboard.writeText(buildAIPrompt(q, files));
  };

  return (
    <header className="h-11 shrink-0 px-3 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-semibold">React Question Bank</span>
        {q && (
          <>
            <span className="text-slate-400">/</span>
            <span className="truncate text-sm">{q.title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="btn" onClick={handleReset} disabled={!q}>
          Reset
        </button>
        <button className="btn" onClick={handleExport} disabled={!q}>
          Export
        </button>
        <button className="btn" onClick={handleCopyForAI} disabled={!q}>
          Copy for AI
        </button>
        <button
          className="btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  );
}
