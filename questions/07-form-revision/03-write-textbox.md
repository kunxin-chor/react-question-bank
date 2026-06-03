---
title: Write a Bound Textbox From Scratch
---

## Requirements

The state variable `nickname` and a `<div>` that displays its current value are already provided and **locked**.

Add an `<input>` textbox of type `text` (with `data-testid="nickname-input"`) so that:

1. Its `value` is bound to the `nickname` state.
2. Typing into it updates the `nickname` state, which is reflected in the `<div data-testid="display">`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [nickname, setNickname] = useState('');
  // @endlock

  return (
    <div>
      {/* add your <input> here */}
      {/* @lock */}
      <div data-testid="display">{nickname}</div>
      {/* @endlock */}
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
  expect(screen.getByTestId('nickname-input').value).toBe('');
  expect(screen.getByTestId('display').textContent).toBe('');
});

test('typing updates both the input and the display', () => {
  render(<App />);
  const input = screen.getByTestId('nickname-input');
  fireEvent.change(input, { target: { value: 'Ace' } });
  expect(input.value).toBe('Ace');
  expect(screen.getByTestId('display')).toHaveTextContent('Ace');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [nickname, setNickname] = useState('');
  // @endlock

  return (
    <div>
      <input
        data-testid="nickname-input"
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <div data-testid="display">{nickname}</div>
    </div>
  );
}
```

## Walkthrough

1. A *controlled* input has both `value` (from state) and `onChange` (to update state) — that's the standard pattern.
2. `e.target.value` is always a string.
3. Because the display `<div>` interpolates the same `nickname` state, it stays in sync automatically.
