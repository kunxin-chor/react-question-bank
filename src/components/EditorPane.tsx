import { useEffect, useReducer, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

interface Props {
  files: Record<string, string>;
  activeFile: string;
  onActiveFile: (f: string) => void;
  onFilesChange: (next: Record<string, string>) => void;
  theme: 'light' | 'dark';
}

// Local reducer captures non-trivial editor state: which file is open, the
// in-memory buffer, and a "dirty since last save" flag for the debounce.
interface EState {
  buffers: Record<string, string>;
  dirty: boolean;
}
type EAction =
  | { type: 'set'; file: string; value: string }
  | { type: 'replace-all'; buffers: Record<string, string> }
  | { type: 'mark-clean' };

function reducer(state: EState, a: EAction): EState {
  switch (a.type) {
    case 'set':
      if (state.buffers[a.file] === a.value) return state;
      return { buffers: { ...state.buffers, [a.file]: a.value }, dirty: true };
    case 'replace-all':
      return { buffers: a.buffers, dirty: false };
    case 'mark-clean':
      return { ...state, dirty: false };
    default:
      return state;
  }
}

function languageOf(name: string): string {
  if (name.endsWith('.tsx') || name.endsWith('.jsx')) return 'javascript';
  if (name.endsWith('.ts')) return 'typescript';
  if (name.endsWith('.js')) return 'javascript';
  if (name.endsWith('.css')) return 'css';
  if (name.endsWith('.html')) return 'html';
  if (name.endsWith('.json')) return 'json';
  return 'plaintext';
}

export default function EditorPane({
  files,
  activeFile,
  onActiveFile,
  onFilesChange,
  theme,
}: Props) {
  const [state, dispatch] = useReducer(reducer, { buffers: files, dirty: false });
  const saveTimer = useRef<number | null>(null);

  // When the upstream files change (question switch, reset, or atomWithStorage
  // hydration arriving late), replace our buffers. We replace if either:
  //   - the file key set differs, OR
  //   - any value differs AND we have no unsaved edits (state.dirty is false).
  // The dirty check protects live typing: while the user has unsaved changes,
  // we never overwrite their buffer with stale upstream values.
  useEffect(() => {
    const upstreamKeys = Object.keys(files);
    const bufferKeys = Object.keys(state.buffers);
    const sameKeys =
      upstreamKeys.length === bufferKeys.length &&
      upstreamKeys.every((k) => k in state.buffers);
    const sameValues =
      sameKeys && upstreamKeys.every((k) => files[k] === state.buffers[k]);
    if (!sameKeys || (!sameValues && !state.dirty)) {
      dispatch({ type: 'replace-all', buffers: files });
    }
  }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced sync up to parent / persistence.
  useEffect(() => {
    if (!state.dirty) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      onFilesChange(state.buffers);
      dispatch({ type: 'mark-clean' });
    }, 300);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state.buffers, state.dirty, onFilesChange]);

  const fileNames = Object.keys(state.buffers);
  const activeValue = state.buffers[activeFile] ?? '';

  // Read-only region support. Lines wrapped between `// @lock` and
  // `// @endlock` (also `/* @lock */` for CSS, `<!-- @lock -->` for HTML)
  // become uneditable. Implementation:
  //   1. Scan the active model for marker lines.
  //   2. Add a decoration over each protected range (visual cue + sticky
  //      tracking that auto-adjusts as surrounding text changes).
  //   3. On every content change, if any change.range intersects a protected
  //      decoration's range, fire `undo` to revert the edit immediately.
  //   4. Suppress recursion via a flag while undo is in-flight.
  const lockDecorationsRef = useRef<string[]>([]);
  const revertingRef = useRef(false);

  const onMount: OnMount = (editor, monaco) => {
    editor.updateOptions({ tabSize: 2, fontSize: 13, minimap: { enabled: false } });

    const isLockStart = (line: string) =>
      /(\/\/|\/\*|<!--)\s*@lock\b/.test(line);
    const isLockEnd = (line: string) =>
      /(\/\/|\/\*|<!--)\s*@endlock\b/.test(line);

    const computeRanges = (model: Monaco.editor.ITextModel) => {
      const ranges: Monaco.IRange[] = [];
      const total = model.getLineCount();
      let start = -1;
      for (let i = 1; i <= total; i++) {
        const line = model.getLineContent(i);
        if (start === -1 && isLockStart(line)) {
          start = i;
        } else if (start !== -1 && isLockEnd(line)) {
          ranges.push({
            startLineNumber: start,
            startColumn: 1,
            endLineNumber: i,
            endColumn: model.getLineMaxColumn(i),
          });
          start = -1;
        }
      }
      return ranges;
    };

    const refreshDecorations = () => {
      const model = editor.getModel();
      if (!model) return;
      const ranges = computeRanges(model);
      lockDecorationsRef.current = editor.deltaDecorations(
        lockDecorationsRef.current,
        ranges.map((r) => ({
          range: r,
          options: {
            isWholeLine: true,
            className: 'qb-lock-region',
            marginClassName: 'qb-lock-margin',
            hoverMessage: { value: 'This block is read-only.' },
            stickiness:
              monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        })),
      );
    };

    const rangesIntersect = (a: Monaco.IRange, b: Monaco.IRange) => {
      if (a.endLineNumber < b.startLineNumber) return false;
      if (a.startLineNumber > b.endLineNumber) return false;
      if (
        a.endLineNumber === b.startLineNumber &&
        a.endColumn <= b.startColumn
      )
        return false;
      if (
        a.startLineNumber === b.endLineNumber &&
        a.startColumn >= b.endColumn
      )
        return false;
      return true;
    };

    const attachContentListener = (model: Monaco.editor.ITextModel) => {
      refreshDecorations();
      return model.onDidChangeContent((e) => {
        if (revertingRef.current) return;
        const lockedRanges = (editor.getModel()?.getAllDecorations() ?? [])
          .filter((d) => d.options.className === 'qb-lock-region')
          .map((d) => d.range);
        const violated = e.changes.some((c) =>
          lockedRanges.some((lr) => rangesIntersect(c.range, lr)),
        );
        if (violated) {
          revertingRef.current = true;
          editor.trigger('lock-violation', 'undo', null);
          // Release on next tick so the undo's own change event is ignored.
          queueMicrotask(() => {
            revertingRef.current = false;
          });
          return;
        }
        refreshDecorations();
      });
    };

    let contentSub: Monaco.IDisposable | null = null;
    const initial = editor.getModel();
    if (initial) contentSub = attachContentListener(initial);

    // Re-bind when the active file (and thus the model) changes.
    editor.onDidChangeModel(() => {
      contentSub?.dispose();
      const model = editor.getModel();
      if (model) contentSub = attachContentListener(model);
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center border-b border-border-light dark:border-border-dark text-sm bg-panel-light dark:bg-panel-dark overflow-x-auto">
        {fileNames.map((name) => (
          <button
            key={name}
            className={`px-3 py-1.5 border-r border-border-light dark:border-border-dark whitespace-nowrap ${
              name === activeFile
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300'
                : 'hover:bg-slate-200/60 dark:hover:bg-slate-700/40'
            }`}
            onClick={() => onActiveFile(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          path={activeFile}
          language={languageOf(activeFile)}
          value={activeValue}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          onChange={(v) => dispatch({ type: 'set', file: activeFile, value: v ?? '' })}
          onMount={onMount}
          options={{
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
