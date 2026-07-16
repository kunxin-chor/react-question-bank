---
title: Shared Text Input State
---

## Requirements

An atom named `textAtom` has already been created for you in `atoms.js`, starting as an empty string. `Display.jsx` and `App.jsx` are already implemented — `Display` renders whatever `textAtom` currently holds.

Your job is to finish `TextInput.jsx` so that it is a controlled textbox bound to `textAtom`, using `useAtom` to both read and write the atom in the same component.

For example:

- At first, the textbox is empty and `Display` shows nothing.
- If the user types `Hello Jotai`, the textbox shows `Hello Jotai` and `Display` shows `Hello Jotai` too.

To do this:

1. Import `useAtom` from `jotai`.
2. Import `textAtom` from `./atoms.js`.
3. Call `useAtom(textAtom)` to get both the current value and a setter, similar to `useState`.
4. Bind the textbox's `value` to the atom's value, and update the atom in the textbox's `onChange`.

## Files

```jsx file=atoms.js
import { atom } from 'jotai';

export const textAtom = atom('');
```

```jsx file=TextInput.jsx
export default function TextInput(props) {
  // TODO: use useAtom(textAtom) to bind this textbox to the shared atom.
  return <input data-testid="text-input" type="text" />;
}
```

```jsx file=Display.jsx
import { useAtomValue } from 'jotai';
import { textAtom } from './atoms.js';

export default function Display(props) {
  const text = useAtomValue(textAtom);
  return <p data-testid="text-display">{text}</p>;
}
```

```jsx file=App.jsx default
import TextInput from './TextInput.jsx';
import Display from './Display.jsx';

export default function App() {
  return (
    <div>
      <TextInput />
      <Display />
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts empty', () => {
  render(<App />);
  expect(screen.getByTestId('text-input').value).toBe('');
  expect(screen.getByTestId('text-display')).toHaveTextContent('');
});

test('typing updates both the textbox and the display', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'Hello Jotai' } });
  expect(screen.getByTestId('text-input').value).toBe('Hello Jotai');
  expect(screen.getByTestId('text-display')).toHaveTextContent('Hello Jotai');
});
```

## Solution

```jsx file=atoms.js
import { atom } from 'jotai';

export const textAtom = atom('');
```

```jsx file=TextInput.jsx
import { useAtom } from 'jotai';
import { textAtom } from './atoms.js';

export default function TextInput(props) {
  const [text, setText] = useAtom(textAtom);
  return (
    <input
      data-testid="text-input"
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
```

```jsx file=Display.jsx
import { useAtomValue } from 'jotai';
import { textAtom } from './atoms.js';

export default function Display(props) {
  const text = useAtomValue(textAtom);
  return <p data-testid="text-display">{text}</p>;
}
```

```jsx file=App.jsx
import TextInput from './TextInput.jsx';
import Display from './Display.jsx';

export default function App() {
  return (
    <div>
      <TextInput />
      <Display />
    </div>
  );
}
```

## Walkthrough

1. `useAtom(textAtom)` returns a `[value, setValue]` pair, just like `useState`, except the value is stored in the atom instead of the component.
2. Binding `value={text}` and `onChange={(e) => setText(e.target.value)}` makes the textbox a controlled input, the same pattern used for `useState`-backed forms.
3. `TextInput` and `Display` share state purely through `textAtom` — there is no parent component passing props between them.
4. Every keystroke updates the atom, which causes `Display` to re-render with the latest text.
