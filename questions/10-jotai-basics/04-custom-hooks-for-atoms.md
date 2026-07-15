---
title: Custom Hooks for Atoms
---

## Requirements

Jotai's hooks (`useAtomValue`, `useSetAtom`, `useAtom`) can be wrapped inside your own custom hooks. This hides Jotai as an implementation detail, so components only ever call your own hook, not Jotai's hooks directly.

Follow the walkthrough tab step by step, typing each piece of code into the file it names. After each step, the walkthrough explains what you just typed. `App.jsx` is already wired up for you — your job is `atoms.js`, `useCountValue.js`, `useIncrementCount.js`, `CountDisplay.jsx`, and `CountControls.jsx`.

## Files

```jsx file=atoms.js
// Step 1: import atom from 'jotai', then create and export countAtom here, starting at 0.
```

```jsx file=useCountValue.js
// Step 2: import useAtomValue from 'jotai', and countAtom from './atoms.js'.

// Step 2 (continued): write a useCountValue() function that returns useAtomValue(countAtom).
```

```jsx file=useIncrementCount.js
// Step 3: import useSetAtom from 'jotai', and countAtom from './atoms.js'.

// Step 3 (continued): write a useIncrementCount() function that returns a function
// which increments countAtom.
```

```jsx file=CountDisplay.jsx
// Step 4: import useCountValue from './useCountValue.js'.

export default function CountDisplay(props) {
  // Step 4 (continued): call useCountValue() and render the result below.
  return <p data-testid="count-display"></p>;
}
```

```jsx file=CountControls.jsx
// Step 5: import useIncrementCount from './useIncrementCount.js'.

export default function CountControls(props) {
  // Step 5 (continued): call useIncrementCount() and use the result as the button's onClick.
  return <button data-testid="increment">+1</button>;
}
```

```jsx file=App.jsx default
import CountDisplay from './CountDisplay.jsx';
import CountControls from './CountControls.jsx';

export default function App() {
  return (
    <div>
      <CountDisplay />
      <CountControls />
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts at 0', () => {
  render(<App />);
  expect(screen.getByTestId('count-display')).toHaveTextContent('0');
});

test('clicking +1 updates the display component', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('increment'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('1');
  fireEvent.click(screen.getByTestId('increment'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('2');
});
```

## Solution

```jsx file=atoms.js
import { atom } from 'jotai';

export const countAtom = atom(0);
```

```jsx file=useCountValue.js
import { useAtomValue } from 'jotai';
import { countAtom } from './atoms.js';

export function useCountValue() {
  return useAtomValue(countAtom);
}
```

```jsx file=useIncrementCount.js
import { useSetAtom } from 'jotai';
import { countAtom } from './atoms.js';

export function useIncrementCount() {
  const setCount = useSetAtom(countAtom);
  return () => setCount((c) => c + 1);
}
```

```jsx file=CountDisplay.jsx
import { useCountValue } from './useCountValue.js';

export default function CountDisplay(props) {
  const count = useCountValue();
  return <p data-testid="count-display">{count}</p>;
}
```

```jsx file=CountControls.jsx
import { useIncrementCount } from './useIncrementCount.js';

export default function CountControls(props) {
  const increment = useIncrementCount();
  return (
    <button data-testid="increment" onClick={increment}>
      +1
    </button>
  );
}
```

```jsx file=App.jsx
import CountDisplay from './CountDisplay.jsx';
import CountControls from './CountControls.jsx';

export default function App() {
  return (
    <div>
      <CountDisplay />
      <CountControls />
    </div>
  );
}
```

## Walkthrough

**Step 1 — create the atom in `atoms.js`.** Type:

```jsx
import { atom } from 'jotai';

export const countAtom = atom(0);
```

Same as before — a single exported atom, starting at `0`.

**Step 2 — wrap the read in `useCountValue.js`.** Type:

```jsx
import { useAtomValue } from 'jotai';
import { countAtom } from './atoms.js';

export function useCountValue() {
  return useAtomValue(countAtom);
}
```

`useCountValue` is a **custom hook** — an ordinary function whose name starts with `use` that calls another hook (`useAtomValue`) inside it. Anything that calls `useCountValue()` gets the current count, without ever importing `jotai` itself.

**Step 3 — wrap the write in `useIncrementCount.js`.** Type:

```jsx
import { useSetAtom } from 'jotai';
import { countAtom } from './atoms.js';

export function useIncrementCount() {
  const setCount = useSetAtom(countAtom);
  return () => setCount((c) => c + 1);
}
```

`useIncrementCount` calls `useSetAtom` internally and returns a ready-to-use function. The caller doesn't even need to know the updater-function pattern — that's all encapsulated here.

**Step 4 — use the hook in `CountDisplay.jsx`.** Type:

```jsx
import { useCountValue } from './useCountValue.js';

export default function CountDisplay(props) {
  const count = useCountValue();
  return <p data-testid="count-display">{count}</p>;
}
```

Notice there is no import from `jotai` in this file at all — only from `useCountValue.js`.

**Step 5 — use the hook in `CountControls.jsx`.** Type:

```jsx
import { useIncrementCount } from './useIncrementCount.js';

export default function CountControls(props) {
  const increment = useIncrementCount();
  return (
    <button data-testid="increment" onClick={increment}>
      +1
    </button>
  );
}
```

Again, no `jotai` import here either — just the custom hook.

**Step 6 — run the tests.** The behavior is identical to the previous example: clicking the button still updates the shared count. But now `CountDisplay` and `CountControls` are decoupled from *how* that state is stored — if you ever swapped Jotai for something else, only `useCountValue.js` and `useIncrementCount.js` would need to change.
