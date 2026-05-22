import { useEffect, useReducer, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';

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

  // When the upstream files change (question switch, reset), replace our buffers.
  // We compare keys+values shallowly to avoid clobbering live edits.
  useEffect(() => {
    const sameKeys =
      Object.keys(files).length === Object.keys(state.buffers).length &&
      Object.keys(files).every((k) => k in state.buffers);
    if (!sameKeys) {
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

  const onMount: OnMount = (editor) => {
    editor.updateOptions({ tabSize: 2, fontSize: 13, minimap: { enabled: false } });
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
