---
title: Read a Value from an Atom
---

## Requirements

An atom named `themeAtom` has already been created for you in `atoms.js`, starting with the value `"light"`. `App.jsx` is already wired up.

Your job is to finish `Display.jsx` so that it reads `themeAtom`'s current value and renders it.

For example:

- The atom starts as `"light"`, so the page should show `light`.

To do this:

1. Import `useAtomValue` from `jotai`.
2. Import `themeAtom` from `./atoms.js`.
3. Use `useAtomValue` to read the atom's current value inside `Display`.
4. Render that value inside the element with `data-testid="theme-display"`.

## Files

```jsx file=atoms.js
import { atom } from 'jotai';

export const themeAtom = atom('light');
```

```jsx file=Display.jsx
export default function Display(props) {
  // TODO: read themeAtom's value with useAtomValue and render it below.
  return <p data-testid="theme-display"></p>;
}
```

```jsx file=App.jsx default
import Display from './Display.jsx';

export default function App() {
  return (
    <div>
      <Display />
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('shows the atom initial value', () => {
  render(<App />);
  expect(screen.getByTestId('theme-display')).toHaveTextContent('light');
});
```

## Solution

```jsx file=atoms.js
import { atom } from 'jotai';

export const themeAtom = atom('light');
```

```jsx file=Display.jsx
import { useAtomValue } from 'jotai';
import { themeAtom } from './atoms.js';

export default function Display(props) {
  const theme = useAtomValue(themeAtom);
  return <p data-testid="theme-display">{theme}</p>;
}
```

```jsx file=App.jsx
import Display from './Display.jsx';

export default function App() {
  return (
    <div>
      <Display />
    </div>
  );
}
```

## Walkthrough

1. `useAtomValue(themeAtom)` reads the atom's current value — it's the read-only counterpart to `useAtom`.
2. `themeAtom` lives in `atoms.js`, completely separate from the component that reads it.
3. Once the value is read, it renders like any other variable inside JSX: `{theme}`.
