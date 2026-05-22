import { useMemo, useState } from 'react';
import {
  SandpackProvider,
  SandpackConsole,
  useSandpackClient,
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
      <div className="qb-preview-host flex-1 min-h-0">
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
          <CustomPreview />
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
function CustomPreview() {
  const { iframe } = useSandpackClient();
  return (
    <div className="qb-preview-slot">
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
