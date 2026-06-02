---
title: Write a Bound Textbox From Scratch
---

## Requirements

The state variable `text` and a `<div>` that displays its current value are already provided and **locked**.

Add an `<input>` textbox of type `text` (with `data-testid="text-input"`) inside the locked `<div>`'s parent so that:

1. Its `value` is bound to the `text` state.
2. Typing into it updates the `text` state, which is reflected in the `<div data-testid="display">`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [text, setText] = useState('');
  // @endlock

  return (
    <div>
      {/* add your <input> here */}
      {/* @lock */}
      <div data-testid="display">{text}</div>
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
  expect(screen.getByTestId('text-input').value).toBe('');
  expect(screen.getByTestId('display').textContent).toBe('');
});

test('typing updates both the input and the display', () => {
  render(<App />);
  const input = screen.getByTestId('text-input');
  fireEvent.change(input, { target: { value: 'hello world' } });
  expect(input.value).toBe('hello world');
  expect(screen.getByTestId('display')).toHaveTextContent('hello world');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [text, setText] = useState('');
  // @endlock

  return (
    <div>
      <input
        data-testid="text-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div data-testid="display">{text}</div>
    </div>
  );
}
```

## Walkthrough

1. A *controlled* input has both `value` (from state) and `onChange` (to update state) — that's the standard pattern.
2. `e.target.value` is always a string, even for `<input type="number">`.
3. Because the display `<div>` interpolates the same `text` state, it stays in sync automatically.
