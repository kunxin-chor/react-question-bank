import { useEffect, useMemo, useReducer } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  currentQuestionAtom,
  routeAtom,
  navigateAtom,
  solutionAtomFamily,
  themeAtom,
} from '@/state/atoms';
import type { Question, TabKey, TestResult } from '@/lib/types';
import EditorPane from '@/components/EditorPane';
import PreviewPane from '@/components/PreviewPane';
import TestRunner from '@/components/TestRunner';
import MarkdownView from '@/components/MarkdownView';
import Reveal from '@/components/Reveal';
import ComponentTree from '@/components/ComponentTree';
import { resetTree } from '@/lib/devtoolsBridge';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'question', label: 'Question' },
  { key: 'components', label: 'Components' },
  { key: 'tests', label: 'Tests' },
  { key: 'solution', label: 'Solution' },
  { key: 'walkthrough', label: 'Walkthrough' },
];

// Workspace owns the per-question session reducer: which tab is active,
// transient test-run results, and the local copy of files used by the editor.
// Files are synced down from the persisted Jotai atom on question change and
// synced up via dispatched actions on each edit (debounced inside EditorPane).
interface WState {
  activeFile: string;
  tests: { status: 'idle' | 'running' | 'done'; results: TestResult[] };
}
type WAction =
  | { type: 'set-active-file'; file: string }
  | { type: 'tests-start' }
  | { type: 'tests-done'; results: TestResult[] }
  | { type: 'hydrate'; activeFile: string };

function reducer(state: WState, a: WAction): WState {
  switch (a.type) {
    case 'set-active-file':
      return { ...state, activeFile: a.file };
    case 'tests-start':
      return { ...state, tests: { status: 'running', results: [] } };
    case 'tests-done':
      return { ...state, tests: { status: 'done', results: a.results } };
    case 'hydrate':
      return { ...state, activeFile: a.activeFile };
    default:
      return state;
  }
}

export default function Workspace() {
  const q = useAtomValue(currentQuestionAtom);
  const { tab } = useAtomValue(routeAtom);
  const navigate = useSetAtom(navigateAtom);
  const theme = useAtomValue(themeAtom);

  if (!q) {
    return (
      <main className="flex-1 flex items-center justify-center text-slate-500">
        Select a question to get started.
      </main>
    );
  }

  return <WorkspaceInner q={q} tab={tab} onTab={(t) => navigate({ tab: t })} theme={theme} />;
}

function WorkspaceInner({
  q,
  tab,
  onTab,
  theme,
}: {
  q: Question;
  tab: TabKey;
  onTab: (t: TabKey) => void;
  theme: 'light' | 'dark';
}) {
  const sol = useAtomValue(solutionAtomFamily(q.id));
  const setSol = useSetAtom(solutionAtomFamily(q.id));

  const files = useMemo<Record<string, string>>(() => {
    // Use saved files if present and overlapping with current starter set,
    // otherwise start from the question's default files. Add any new starter
    // files the author may have added since the user last saved.
    const merged: Record<string, string> = { ...q.files };
    for (const [name, code] of Object.entries(sol.files || {})) {
      if (name in merged) merged[name] = code;
    }
    return merged;
  }, [q, sol.files]);

  const [state, dispatch] = useReducer(reducer, {
    activeFile: q.entry,
    tests: { status: 'idle', results: [] },
  });

  // Re-hydrate active file when the question changes.
  useEffect(() => {
    dispatch({ type: 'hydrate', activeFile: q.entry });
    // Clear the previous question's component tree until the new preview commits.
    resetTree();
  }, [q.id, q.entry]);

  const onFilesChange = (next: Record<string, string>) => {
    setSol({
      ...sol,
      files: next,
      updatedAt: Date.now(),
      attempted: sol.attempted || true,
    });
  };

  const onTestsDone = (results: TestResult[]) => {
    dispatch({ type: 'tests-done', results });
    const passed = results.filter((r) => r.passed).length;
    const failed = results.length - passed;
    setSol({
      ...sol,
      files,
      attempted: true,
      lastRun: { passed, failed, at: Date.now() },
      updatedAt: Date.now(),
    });
  };

  return (
    <main className="flex-1 min-w-0 flex">
      {/* Editor (always visible). Key on q.id forces a full reset of editor
          buffers/Monaco models when switching questions. */}
      <section className="flex-1 min-w-0 flex flex-col border-r border-border-light dark:border-border-dark">
        <EditorPane
          key={q.id}
          files={files}
          activeFile={state.activeFile}
          onActiveFile={(f) => dispatch({ type: 'set-active-file', file: f })}
          onFilesChange={onFilesChange}
          theme={theme}
        />
      </section>

      {/* Right column: always-on Preview at the top (~65%), tabs underneath (~35%). */}
      <section className="w-[44%] min-w-[360px] flex flex-col">
        <div className="basis-[65%] grow-0 shrink-0 min-h-0 border-b border-border-light dark:border-border-dark">
          <PreviewPane key={q.id} files={files} entry={q.entry} theme={theme} />
        </div>
        <div className="basis-[35%] grow shrink min-h-0 flex flex-col">
          <div className="flex items-center border-b border-border-light dark:border-border-dark px-2 shrink-0">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`tab-btn ${tab === t.key ? 'active' : ''}`}
                onClick={() => onTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            {tab === 'question' && (
              <div className="h-full overflow-auto">
                <MarkdownView source={q.requirements} className="p-4" />
              </div>
            )}
            {tab === 'components' && (
              <div className="h-full min-h-0">
                <ComponentTree />
              </div>
            )}
            {tab === 'tests' && (
              <div className="h-full overflow-auto">
                <TestRunner
                  question={q}
                  files={files}
                  status={state.tests.status}
                  results={state.tests.results}
                  onStart={() => dispatch({ type: 'tests-start' })}
                  onDone={onTestsDone}
                  theme={theme}
                />
              </div>
            )}
            {tab === 'solution' && (
              <div className="h-full overflow-auto">
                <Reveal
                  key={q.id}
                  label="Show solution"
                  caption="Try to solve it yourself first. Once revealed, the solution will stay visible while you're on this tab."
                >
                  <MarkdownView
                    source={Object.entries(q.solution)
                      .map(([name, code]) => `\n\`\`\`jsx\n// ${name}\n${code}\n\`\`\``)
                      .join('\n')}
                    className="p-4"
                  />
                </Reveal>
              </div>
            )}
            {tab === 'walkthrough' && (
              <div className="h-full overflow-auto">
                <Reveal
                  key={q.id}
                  label="Show walkthrough"
                  caption="The walkthrough explains the solution step by step. Reveal it once you've made an attempt."
                >
                  <MarkdownView source={q.walkthrough} className="p-4" />
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
