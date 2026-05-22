import { useMemo, useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole,
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

  // Use SandpackLayout (which Sandpack sizes correctly) but override its
  // default CSS grid with a vertical flex so the preview iframe fills the
  // remaining height and the optional console docks below.
  return (
    <div className="h-full flex flex-col bg-panel-light dark:bg-panel-dark">
      <div className="flex items-center justify-end px-2 py-1 border-b border-border-light dark:border-border-dark text-xs shrink-0">
        <label className="flex items-center gap-1.5 text-slate-500 select-none">
          <input
            type="checkbox"
            checked={showConsole}
            onChange={(e) => setShowConsole(e.target.checked)}
          />
          Show console
        </label>
      </div>
      {/* SandpackLayout is required for SandpackPreview to render its iframe
          correctly. Its default styles (.sp-stack { flex-basis: 350px }) are
          overridden in src/index.css under .qb-preview so the preview fills
          the remaining height. */}
      <div className="qb-preview flex-1 min-h-0 flex flex-col">
        <SandpackProvider
          template="react"
          theme={theme === 'dark' ? 'dark' : 'light'}
          files={sandpackFiles}
          options={{ recompileMode: 'delayed', recompileDelay: 300 }}
          customSetup={{
            entry: '/index.js',
            dependencies: {
              react: '18.3.1',
              'react-dom': '18.3.1',
            },
          }}
        >
          <SandpackLayout>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
            {showConsole && <SandpackConsole />}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}
