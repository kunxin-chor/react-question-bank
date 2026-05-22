import { useState, type ReactNode } from 'react';


interface Props {
  /** Label on the reveal button, e.g. "Show solution". */
  label: string;
  /** Explanatory caption rendered next to the button before reveal. */
  caption?: string;
  children: ReactNode;
}

// Generic gate: hides children behind a button. Stays revealed per-mount only,
// so navigating away resets it (intended — discourages peeking by default).
export default function Reveal({ label, caption, children }: Props) {
  const [shown, setShown] = useState(false);
  if (shown) return <>{children}</>;
  return (
    <div className="p-6 flex flex-col items-start gap-3">
      {caption && (
        <p className="text-sm text-slate-500 max-w-prose">{caption}</p>
      )}
      <button className="btn" onClick={() => setShown(true)}>
        {label}
      </button>
    </div>
  );
}
