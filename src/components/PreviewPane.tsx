import { useEffect, useMemo, useState } from 'react';
import {
  SandpackProvider,
  SandpackConsole,
  useSandpackClient,
  useSandpackNavigation,
} from '@codesandbox/sandpack-react';

interface Props {
  files: Record<string, string>;
  entry: string;
  theme: 'light' | 'dark';
}

// A small index entry: imports the user's default export and mounts it.
const indexEntry = (entryFile: string) => `
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './${entryFile}';

createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null, React.createElement(App))
);
`;

export default function PreviewPane({ files, entry, theme }: Props) {
  const sandpackFiles = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [name, code] of Object.entries(files)) {
      out['/' + name] = code;
    }
    out['/index.js'] = indexEntry(entry);
    return out;
  }, [files, entry]);

  const [showConsole, setShowConsole] = useState(true);

  // Use a key based on file content to force SandpackProvider to remount
  // when files change. This ensures the bundler picks up the latest code.
  const sandpackKey = useMemo(() => {
    return Object.values(sandpackFiles).join('|');
  }, [sandpackFiles]);

  // Debounce the key to avoid remounting on every keystroke
  const [debouncedKey, setDebouncedKey] = useState(sandpackKey);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedKey(sandpackKey);
    }, 500);
    return () => clearTimeout(timeout);
  }, [sandpackKey]);

  return (
    <div className="h-full flex flex-col bg-panel-light dark:bg-panel-dark">
      <div className="flex items-center justify-between px-2 py-1 border-b border-border-light dark:border-border-dark text-xs shrink-0">
        <span className="text-slate-500">Preview</span>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-slate-500 select-none">
            <input
              type="checkbox"
              checked={showConsole}
              onChange={(e) => setShowConsole(e.target.checked)}
            />
            Console
          </label>
        </div>
      </div>
      <div className="qb-preview-host flex-1 min-h-0">
        <SandpackProvider
          key={debouncedKey}
          template="react"
          theme={theme === 'dark' ? 'dark' : 'light'}
          files={sandpackFiles}
          options={{ recompileMode: 'delayed', recompileDelay: 300 }}
          customSetup={{
            entry: '/index.js',
            dependencies: {
              react: '18.3.1',
              'react-dom': '18.3.1',
              bootstrap: '5.3.3',
            },
          }}
        >
          <CustomPreviewWithRefresh />
          {showConsole && (
            <div className="qb-console-slot">
              <SandpackConsole style={{ height: '100%' }} />
            </div>
          )}
        </SandpackProvider>
      </div>
    </div>
  );
}

// Custom preview that bypasses SandpackPreview entirely. We render the iframe
// ourselves (Sandpack drives it via useSandpackClient.iframe ref) and use
// position:absolute inside a relative wrapper so the iframe always fills its
// container — sidestepping iframe's quirky intrinsic-sizing in flex layouts.
function CustomPreviewWithRefresh() {
  const { iframe } = useSandpackClient();
  const { refresh } = useSandpackNavigation();

  return (
    <div className="qb-preview-slot relative">
      <button
        onClick={refresh}
        className="absolute top-2 right-2 z-10 p-1.5 rounded bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
        title="Refresh preview"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 4v6h-6"></path>
          <path d="M1 20v-6h6"></path>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </button>
      <iframe
        ref={iframe}
        title="Sandpack Preview"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
          background: 'white',
          display: 'block',
        }}
      />
    </div>
  );
}
