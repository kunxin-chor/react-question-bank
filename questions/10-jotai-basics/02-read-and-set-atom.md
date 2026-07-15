---
title: Read and Set an Atom
---

## Requirements

Besides `useAtomValue`, Jotai provides `useSetAtom`, a hook that lets a component **change** an atom's value without needing to read it.

Follow the walkthrough tab step by step, typing each piece of code into `App.jsx` yourself. After each step, the walkthrough explains what you just typed. Once you're done, `CountDisplay` should read the atom and `CountControls` should be able to change it — the two components will never pass each other any props.

## Files

```jsx file=App.jsx default
// Step 1: import atom, useAtomValue, and useSetAtom from 'jotai' here.

// Step 2: create countAtom here, starting at 0.

function CountDisplay(props) {
  // Step 3: read countAtom's value and render it below.
  return <p data-testid="count-display"></p>;
}

function CountControls(props) {
  // Step 4: get a setter for countAtom, then increment it on click.
  return (
    <button data-testid="increment">+1</button>
  );
}

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

```jsx file=App.jsx
import { atom, useAtomValue, useSetAtom } from 'jotai';

const countAtom = atom(0);

function CountDisplay(props) {
  const count = useAtomValue(countAtom);
  return <p data-testid="count-display">{count}</p>;
}

function CountControls(props) {
  const setCount = useSetAtom(countAtom);
  return (
    <button data-testid="increment" onClick={() => setCount((c) => c + 1)}>
      +1
    </button>
  );
}

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

**Step 1 — import Jotai's helpers.** At the top of `App.jsx`, type:

```jsx
import { atom, useAtomValue, useSetAtom } from 'jotai';
```

You now have all three pieces you need: `atom` to create state, `useAtomValue` to read it, `useSetAtom` to change it.

**Step 2 — create the atom.** Below the import, type:

```jsx
const countAtom = atom(0);
```

This creates a single atom starting at `0`, sitting outside of both `CountDisplay` and `CountControls`.

**Step 3 — read the atom inside `CountDisplay`.** Type:

```jsx
const count = useAtomValue(countAtom);
return <p data-testid="count-display">{count}</p>;
```

`CountDisplay` only ever calls `useAtomValue` — it has no way to change `countAtom`, only to display it.

**Step 4 — write to the atom inside `CountControls`.** Type:

```jsx
const setCount = useSetAtom(countAtom);
return (
  <button data-testid="increment" onClick={() => setCount((c) => c + 1)}>
    +1
  </button>
);
```

`useSetAtom(countAtom)` returns a setter function without subscribing to the value. `setCount((c) => c + 1)` works exactly like the updater form of a `useState` setter — it receives the atom's previous value and returns the next one.

**Step 5 — run the tests.** `count-display` should start at `0`. Clicking the `+1` button should update it to `1`, then `2`, and so on — even though `CountDisplay` and `CountControls` never pass each other any props. They're only connected through `countAtom`.
