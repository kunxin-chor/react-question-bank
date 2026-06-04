// Parent-side bridge for the in-sandbox component tree.
//
// The injected `__devtools__.js` hook posts the serialized fiber tree to the
// parent window on every commit. This module listens once (at import time),
// caches the latest tree, and lets components subscribe to updates — so the
// Components panel shows the current tree even if it mounts after the preview
// has already rendered.

export interface ComponentNode {
  name: string;
  kind: 'host' | 'component';
  props: Record<string, string | number | boolean>;
  state: Record<string, any>;
  children: ComponentNode[];
}

type Listener = (tree: ComponentNode[] | null) => void;

let latest: ComponentNode[] | null = null;
const listeners = new Set<Listener>();

function handleMessage(event: MessageEvent) {
  const data = event.data;
  if (data && data.source === 'qb-devtools' && data.type === 'commit') {
    latest = Array.isArray(data.tree) ? (data.tree as ComponentNode[]) : [];
    listeners.forEach((fn) => fn(latest));
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', handleMessage);
}

export function getLatestTree(): ComponentNode[] | null {
  return latest;
}

export function subscribeTree(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Called when the active question changes so a stale tree from the previous
// question doesn't linger before the new preview commits.
export function resetTree(): void {
  latest = null;
  listeners.forEach((fn) => fn(null));
}

// Send a state update to the sandbox iframe (not yet implemented for actual state mutation)
export function sendStateUpdate(path: string[], value: any): void {
  // This would send a message to the iframe to update state
  // For now, this is a placeholder for future implementation
  console.log('State update requested:', path, value);
}
