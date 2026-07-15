---
title: Create and Read an Atom
---

## Requirements

An **atom** is Jotai's smallest unit of state. It is created once, outside of any component, with `atom(initialValue)`. Any component can then read that atom's current value with the `useAtomValue` hook.

Follow the walkthrough tab step by step, typing each piece of code into `App.jsx` yourself. After each step, the walkthrough explains what you just typed and why. Once you're done, both `Display` and `DisplayAgain` should show the same text, `"Hello from Jotai"`, purely because they both read the same atom.

## Files

```jsx file=App.jsx default
// Step 1: import atom and useAtomValue from 'jotai' here.

// Step 2: create messageAtom here, starting with the string 'Hello from Jotai'.

function Display(props) {
  // Step 3: read messageAtom's value and render it below.
  return <p data-testid="display-1"></p>;
}

function DisplayAgain(props) {
  // Step 4: do the same thing here, reading the same atom.
  return <p data-testid="display-2"></p>;
}

export default function App() {
  return (
    <div>
      <Display />
      <DisplayAgain />
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('both components read the same atom value', () => {
  render(<App />);
  expect(screen.getByTestId('display-1')).toHaveTextContent('Hello from Jotai');
  expect(screen.getByTestId('display-2')).toHaveTextContent('Hello from Jotai');
});
```

## Solution

```jsx file=App.jsx
import { atom, useAtomValue } from 'jotai';

const messageAtom = atom('Hello from Jotai');

function Display(props) {
  const message = useAtomValue(messageAtom);
  return <p data-testid="display-1">{message}</p>;
}

function DisplayAgain(props) {
  const message = useAtomValue(messageAtom);
  return <p data-testid="display-2">{message}</p>;
}

export default function App() {
  return (
    <div>
      <Display />
      <DisplayAgain />
    </div>
  );
}
```

## Walkthrough

**Step 1 — import Jotai's helpers.** At the very top of `App.jsx`, type:

```jsx
import { atom, useAtomValue } from 'jotai';
```

`atom` is the function that creates a piece of shared state. `useAtomValue` is a hook that lets a component read an atom's current value.

**Step 2 — create the atom.** Below the import, type:

```jsx
const messageAtom = atom('Hello from Jotai');
```

This creates a single atom, starting with the string `"Hello from Jotai"`. It lives outside of any component — think of it as a box sitting off to the side that any component can look inside. Unlike `useState`, it is not owned by `App`, `Display`, or anyone else.

**Step 3 — read the atom inside `Display`.** Inside the `Display` function, type:

```jsx
const message = useAtomValue(messageAtom);
return <p data-testid="display-1">{message}</p>;
```

`useAtomValue(messageAtom)` subscribes `Display` to that atom and returns its current value. It is **read-only** — it does not give you a way to change the value, only to see it.

**Step 4 — repeat inside `DisplayAgain`.** Type the same two lines inside `DisplayAgain`, but keep its own `data-testid="display-2"`:

```jsx
const message = useAtomValue(messageAtom);
return <p data-testid="display-2">{message}</p>;
```

Because both components call `useAtomValue(messageAtom)` on the *same* atom, they will always show the same text. There is no need to pass `message` down as a prop from anywhere — both components go straight to the source.

**Step 5 — run the tests.** Both `display-1` and `display-2` should now show `Hello from Jotai`.
