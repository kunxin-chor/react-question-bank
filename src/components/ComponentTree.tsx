import { useEffect, useState } from 'react';
import {
  getLatestTree,
  subscribeTree,
  sendStateUpdate,
  type ComponentNode,
} from '@/lib/devtoolsBridge';

// Renders a React DevTools-style component tree for the live preview.
// Data arrives via the devtoolsBridge (postMessage from the sandbox iframe).
export default function ComponentTree() {
  const [tree, setTree] = useState<ComponentNode[] | null>(getLatestTree());
  const [hostsVisible, setHostsVisible] = useState(true);

  useEffect(() => subscribeTree(setTree), []);

  if (!tree || tree.length === 0) {
    return (
      <div className="p-4 text-sm text-slate-500">
        No components captured yet. Edit your code or interact with the preview
        above to see the live component tree.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-end px-2 py-1 border-b border-border-light dark:border-border-dark text-xs shrink-0">
        <label className="flex items-center gap-1.5 text-slate-500 select-none">
          <input
            type="checkbox"
            checked={hostsVisible}
            onChange={(e) => setHostsVisible(e.target.checked)}
          />
          Show DOM elements
        </label>
      </div>
      <div className="flex-1 overflow-auto p-2 font-mono text-[13px] leading-relaxed">
        {tree.map((node, i) => (
          <TreeNode key={i} node={node} depth={0} hostsVisible={hostsVisible} />
        ))}
      </div>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  hostsVisible,
}: {
  node: ComponentNode;
  depth: number;
  hostsVisible: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [editingState, setEditingState] = useState<{ key: string; value: string } | null>(null);

  if (node.kind === 'host' && !hostsVisible) {
    // Skip this host node but still render its (possibly component) children.
    return (
      <>
        {node.children.map((c, i) => (
          <TreeNode key={i} node={c} depth={depth} hostsVisible={hostsVisible} />
        ))}
      </>
    );
  }

  const hasChildren = node.children && node.children.length > 0;
  const propEntries = Object.entries(node.props || {});
  const stateEntries = Object.entries(node.state || {});
  const isHost = node.kind === 'host';

  const handleStateEdit = (key: string, value: string) => {
    setEditingState({ key, value });
  };

  const handleStateSave = () => {
    if (editingState) {
      sendStateUpdate([node.name, editingState.key], editingState.value);
      setEditingState(null);
    }
  };

  return (
    <div>
      <div
        className="flex items-start gap-1 rounded px-1 hover:bg-slate-100 dark:hover:bg-slate-800"
        style={{ paddingLeft: depth * 14 }}
      >
        {hasChildren ? (
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-4 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        <span className="whitespace-pre-wrap break-words">
          <span
            className={
              isHost
                ? 'text-slate-500 dark:text-slate-400'
                : 'text-sky-600 dark:text-sky-400 font-semibold'
            }
          >
            {isHost ? node.name : `<${node.name}>`}
          </span>
          {propEntries.map(([k, v]) => (
            <span key={k} className="ml-1.5 text-xs text-amber-600 dark:text-amber-400">
              {k}={formatValue(v)}
            </span>
          ))}
          {stateEntries.length > 0 && !isHost && (
            <span className="ml-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              state={stateEntries.length}
            </span>
          )}
        </span>
      </div>

      {open && (
        <>
          {stateEntries.length > 0 && !isHost && (
            <div
              className="pl-4 pr-1 py-1 text-xs border-l border-slate-200 dark:border-slate-700 ml-2"
              style={{ paddingLeft: (depth + 1) * 14 }}
            >
              <span className="text-slate-400 font-medium">state:</span>
              {stateEntries.map(([k, v]) => (
                <div key={k} className="ml-2 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>{k}:</span>
                  {editingState?.key === k ? (
                    <>
                      <input
                        type="text"
                        value={editingState.value}
                        onChange={(e) => setEditingState({ ...editingState, value: e.target.value })}
                        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5 text-xs w-24"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleStateSave();
                          if (e.key === 'Escape') setEditingState(null);
                        }}
                        onBlur={handleStateSave}
                      />
                    </>
                  ) : (
                    <>
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => handleStateEdit(k, String(v))}
                      >
                        {formatValue(v)}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {hasChildren &&
            node.children.map((c, i) => (
              <TreeNode key={i} node={c} depth={depth + 1} hostsVisible={hostsVisible} />
            ))}
        </>
      )}
    </div>
  );
}

function formatValue(v: string | number | boolean): string {
  if (typeof v === 'string') {
    if (v === 'function') return 'ƒ';
    if (v === 'object' || v.startsWith('Array(')) return `{${v}}`;
    return `"${v}"`;
  }
  return `{${String(v)}}`;
}
