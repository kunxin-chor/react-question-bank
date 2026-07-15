---
title: Toggle a Boolean Atom
---

## Requirements

An atom named `isOnAtom` has already been created for you in `atoms.js`, starting as `false`. `Display.jsx` and `App.jsx` are already implemented and locked — `Display` shows `"On"` when the atom is `true`, and `"Off"` when it's `false`.

Your job is to finish `ToggleButton.jsx` so that clicking the button flips the atom's boolean value.

For example:

- At first, `Display` shows `Off`.
- After one click on the button, `Display` shows `On`.
- After a second click, `Display` shows `Off` again.

To do this:

1. Import `useSetAtom` from `jotai`.
2. Import `isOnAtom` from `./atoms.js`.
3. Use `useSetAtom` to get a setter function for `isOnAtom`.
4. When the button is clicked, flip the atom's value using the updater form, e.g. `(value) => !value`.

## Files

```jsx file=atoms.js
import { atom } from 'jotai';

export const isOnAtom = atom(false);
```

```jsx file=ToggleButton.jsx
export default function ToggleButton(props) {
  // TODO: use useSetAtom to flip isOnAtom's boolean value on click.
  return <button data-testid="toggle">Toggle</button>;
}
```

```jsx file=Display.jsx
// @lock
import { useAtomValue } from 'jotai';
import { isOnAtom } from './atoms.js';

export default function Display(props) {
  const isOn = useAtomValue(isOnAtom);
  return <p data-testid="status-display">{isOn ? 'On' : 'Off'}</p>;
}
// @endlock
```

```jsx file=App.jsx default
import Display from './Display.jsx';
import ToggleButton from './ToggleButton.jsx';

// @lock
export default function App() {
  return (
    <div>
      <Display />
      <ToggleButton />
    </div>
  );
}
// @endlock
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts off', () => {
  render(<App />);
  expect(screen.getByTestId('status-display')).toHaveTextContent('Off');
});

test('clicking toggle flips the atom value', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('toggle'));
  expect(screen.getByTestId('status-display')).toHaveTextContent('On');
  fireEvent.click(screen.getByTestId('toggle'));
  expect(screen.getByTestId('status-display')).toHaveTextContent('Off');
});
```

## Solution

```jsx file=atoms.js
import { atom } from 'jotai';

export const isOnAtom = atom(false);
```

```jsx file=ToggleButton.jsx
import { useSetAtom } from 'jotai';
import { isOnAtom } from './atoms.js';

export default function ToggleButton(props) {
  const setIsOn = useSetAtom(isOnAtom);
  return (
    <button data-testid="toggle" onClick={() => setIsOn((value) => !value)}>
      Toggle
    </button>
  );
}
```

```jsx file=Display.jsx
import { useAtomValue } from 'jotai';
import { isOnAtom } from './atoms.js';

export default function Display(props) {
  const isOn = useAtomValue(isOnAtom);
  return <p data-testid="status-display">{isOn ? 'On' : 'Off'}</p>;
}
```

```jsx file=App.jsx
import Display from './Display.jsx';
import ToggleButton from './ToggleButton.jsx';

export default function App() {
  return (
    <div>
      <Display />
      <ToggleButton />
    </div>
  );
}
```

## Walkthrough

1. `useSetAtom(isOnAtom)` returns a setter function without subscribing the component to the atom's value — `ToggleButton` never re-renders just because `isOnAtom` changed.
2. The updater form `setIsOn((value) => !value)` receives the atom's current value and returns the flipped value, exactly like the updater form of a `useState` setter.
3. `Display` is completely unaware of `ToggleButton`. It only knows about `isOnAtom`, and re-renders automatically whenever that atom's value changes.
