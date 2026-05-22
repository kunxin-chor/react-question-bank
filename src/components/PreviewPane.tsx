import { useMemo } from 'react';
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

  return (
    <div className="h-full flex flex-col">
      <SandpackProvider
        template="react"
        theme={theme === 'dark' ? 'dark' : 'light'}
        files={sandpackFiles}
        options={{
          recompileMode: 'delayed',
          recompileDelay: 300,
        }}
        customSetup={{
          entry: '/index.js',
          dependencies: {
            react: '18.3.1',
            'react-dom': '18.3.1',
          },
        }}
      >
        <SandpackLayout style={{ height: '100%', border: 0 }}>
          <SandpackPreview
            style={{ height: '60%' }}
            showOpenInCodeSandbox={false}
            showRefreshButton
          />
          <SandpackConsole style={{ height: '40%' }} />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
