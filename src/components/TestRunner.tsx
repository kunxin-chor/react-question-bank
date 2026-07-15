import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react';
import type { Question, TestResult } from '@/lib/types';
import { RTL_SHIM_SOURCE } from '@/sandbox/rtlShim';
import { TEST_ENTRY_SOURCE, TEST_GLOBALS_SOURCE } from '@/sandbox/testHarness';

interface Props {
  question: Question;
  files: Record<string, string>;
  status: 'idle' | 'running' | 'done';
  results: TestResult[];
  onStart: () => void;
  onDone: (results: TestResult[]) => void;
  theme: 'light' | 'dark';
}

// To run tests, we mount a fresh hidden Sandpack with the user's source files
// plus our test harness. The harness posts results back via window.postMessage,
// which we listen for on the parent. Re-keying the SandpackProvider forces a
// clean recompile per run.
export default function TestRunner({
  question,
  files,
  status,
  results,
  onStart,
  onDone,
  theme,
}: Props) {
  const [runId, setRunId] = useState(0);
  const [diag, setDiag] = useState<string>('');
  const [showSandbox, setShowSandbox] = useState(false);
  const watchdogRef = useRef<number | null>(null);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data;
      if (data && data.type === 'qb:test-results' && Array.isArray(data.results)) {
        if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
        setDiag('');
        onDone(data.results as TestResult[]);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onDone]);

  useEffect(() => {
    if (status !== 'running') return;
    setDiag('Compiling test bundle…');
    if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
    watchdogRef.current = window.setTimeout(() => {
      setDiag(
        'Still no results after 30s. Check the iframe / console below for compile errors.',
      );
    }, 30_000);
    return () => {
      if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
    };
  }, [status, runId]);

  const sandpackFiles = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [name, code] of Object.entries(files)) out['/' + name] = code;
    out['/__rtl__.js'] = RTL_SHIM_SOURCE;
    out['/__test_globals__.js'] = TEST_GLOBALS_SOURCE;
    out['/__user_tests__.js'] = question.tests;
    out['/index.js'] = TEST_ENTRY_SOURCE;
    return out;
  }, [files, question.tests]);

  const run = () => {
    onStart();
    setRunId((n) => n + 1);
  };

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <button className="btn" onClick={run} disabled={status === 'running'}>
          {status === 'running' ? 'Running…' : 'Run Tests'}
        </button>
        {status === 'done' && (
          <span className="text-sm">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {passed} passed
            </span>
            {failed > 0 && (
              <>
                {' · '}
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  {failed} failed
                </span>
              </>
            )}
            {' · '}
            <span className="text-slate-500">{results.length} total</span>
          </span>
        )}
        <label className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 select-none">
          <input
            type="checkbox"
            checked={showSandbox}
            onChange={(e) => setShowSandbox(e.target.checked)}
          />
          Show sandbox
        </label>
      </div>

      {results.length > 0 && (
        <ul className="space-y-1 text-sm">
          {results.map((r, i) => (
            <li
              key={i}
              className={`p-2 rounded border ${
                r.passed
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-rose-500/40 bg-rose-500/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{r.passed ? '✓' : '✗'}</span>
                <span>{r.name}</span>
              </div>
              {!r.passed && r.error && (
                <pre className="mt-1 text-xs whitespace-pre-wrap text-rose-700 dark:text-rose-300">
                  {r.error}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}

      <details className="mt-3">
        <summary className="text-xs text-slate-500 cursor-pointer">Test source</summary>
        <pre className="mt-2 p-2 rounded bg-slate-900 text-slate-100 text-xs overflow-auto">
          <code>{question.tests}</code>
        </pre>
      </details>

      {diag && status === 'running' && (
        <div className="text-xs text-slate-500">{diag}</div>
      )}

      {/* Sandpack instance — re-mounts on each run via the key.
          Hidden by default to avoid distracting the student; toggle with
          "Show sandbox" above to surface bundler/runtime errors. */}
      {runId > 0 && (
        <div
          className={
            showSandbox
              ? 'mt-3 border border-border-light dark:border-border-dark rounded overflow-hidden'
              : 'sr-only-sandbox'
          }
          style={
            showSandbox
              ? undefined
              : {
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                  clipPath: 'inset(50%)',
                  whiteSpace: 'nowrap',
                }
          }
          aria-hidden={!showSandbox}
        >
          {showSandbox && (
            <div className="px-2 py-1 text-xs text-slate-500 bg-panel-light dark:bg-panel-dark border-b border-border-light dark:border-border-dark">
              Test sandbox (run #{runId})
            </div>
          )}
          <SandpackProvider
            key={runId}
            template="react"
            theme={theme === 'dark' ? 'dark' : 'light'}
            files={sandpackFiles}
            options={{ recompileMode: 'immediate' }}
            customSetup={{
              entry: '/index.js',
              dependencies: {
                react: '18.3.1',
                'react-dom': '18.3.1',
                bootstrap: '5.3.3',
                jotai: '2.10.3',
                formik: '2.4.6',
              },
            }}
          >
            <SandpackStatusBridge onStatus={(s) => setDiag(s)} />
            {showSandbox ? (
              <SandpackLayout style={{ height: 320, border: 0 }}>
                <SandpackPreview
                  style={{ height: 320 }}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={false}
                />
                <SandpackConsole style={{ height: 320 }} />
              </SandpackLayout>
            ) : (
              // Bundler still needs a preview mounted to compile and execute.
              // Mount it but constrain to 1px so it doesn't paint anything visible.
              <SandpackLayout style={{ height: 1, border: 0 }}>
                <SandpackPreview
                  style={{ height: 1 }}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={false}
                />
              </SandpackLayout>
            )}
          </SandpackProvider>
        </div>
      )}
    </div>
  );
}

// Surfaces compile errors from the Sandpack client so they aren't invisible.
function SandpackStatusBridge({ onStatus }: { onStatus: (s: string) => void }) {
  const { sandpack, listen } = useSandpack();
  useEffect(() => {
    const unsub = listen((msg: any) => {
      if (msg.type === 'start') onStatus('Compiling test bundle…');
      else if (msg.type === 'done') onStatus('Compiled — running tests…');
      else if (msg.type === 'action' && msg.action === 'show-error') {
        onStatus('Compile error: ' + (msg.title || msg.message || 'see iframe'));
      } else if (msg.type === 'compile-error') {
        onStatus('Compile error: ' + (msg.title || ''));
      }
    });
    return () => {
      // listen returns an unsubscribe function in sandpack v2
      if (typeof unsub === 'function') unsub();
    };
  }, [listen, sandpack]);
  return null;
}
