---
title: Share an Atom Across Files
---

## Requirements

An atom does not need to live in the same file as the components that use it. In real apps, atoms are usually declared in their own file and imported wherever they're needed.

Follow the walkthrough tab step by step, typing each piece of code into the file it names. After each step, the walkthrough explains what you just typed. `App.jsx` is already wired up for you — your job is `atoms.js`, `CountDisplay.jsx`, and `CountControls.jsx`.

## Files

```jsx file=atoms.js
// Step 1: import atom from 'jotai', then create and export countAtom here, starting at 0.
```

```jsx file=CountDisplay.jsx
// Step 2: import useAtomValue from 'jotai', and countAtom from './atoms.js'.

export default function CountDisplay(props) {
  // Step 2 (continued): read countAtom's value and render it below.
  return <p data-testid="count-display"></p>;
}
```

```jsx file=CountControls.jsx
// Step 3: import useSetAtom from 'jotai', and countAtom from './atoms.js'.

export default function CountControls(props) {
  // Step 3 (continued): get a setter for countAtom, then increment it on click.
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

```jsx file=CountDisplay.jsx
import { useAtomValue } from 'jotai';
import { countAtom } from './atoms.js';

export default function CountDisplay(props) {
  const count = useAtomValue(countAtom);
  return <p data-testid="count-display">{count}</p>;
}
```

```jsx file=CountControls.jsx
import { useSetAtom } from 'jotai';
import { countAtom } from './atoms.js';

export default function CountControls(props) {
  const setCount = useSetAtom(countAtom);
  return (
    <button data-testid="increment" onClick={() => setCount((c) => c + 1)}>
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

Note the `export` — this is what lets any other file `import { countAtom } from './atoms.js'`. Moving the atom out of any component file means it is no longer tied to a particular component; any file that imports it gets access to the exact same shared state.

**Step 2 — read the atom in `CountDisplay.jsx`.** Type:

```jsx
import { useAtomValue } from 'jotai';
import { countAtom } from './atoms.js';

export default function CountDisplay(props) {
  const count = useAtomValue(countAtom);
  return <p data-testid="count-display">{count}</p>;
}
```

`CountDisplay.jsx` only imports `useAtomValue` and the atom — it has no idea how or where the atom gets updated.

**Step 3 — write to the atom in `CountControls.jsx`.** Type:

```jsx
import { useSetAtom } from 'jotai';
import { countAtom } from './atoms.js';

export default function CountControls(props) {
  const setCount = useSetAtom(countAtom);
  return (
    <button data-testid="increment" onClick={() => setCount((c) => c + 1)}>
      +1
    </button>
  );
}
```

`CountControls.jsx` only imports `useSetAtom` — it has no idea what the current value even is.

**Step 4 — check `App.jsx`.** It's already written for you, and notice it never imports anything from `jotai` at all — it just renders the two components, because it doesn't need to touch the atom directly.

**Step 5 — run the tests.** The behavior should be identical to the previous example, but now the atom and the two components each live in their own file, making the separation of concerns explicit: one file owns the state, one component reads it, one component writes to it.
