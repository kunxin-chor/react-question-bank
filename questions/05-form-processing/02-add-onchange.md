---
title: Add an onChange Handler
---

## Requirements

The state variable `name` and the `<input>` are already wired up: the input's `value` is bound to `name`. However, typing into the textbox currently does nothing because there's no `onChange` handler.

Add an `onChange` handler to the `<input>` that updates `name` to whatever the user just typed.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <input data-testid="name-input" value={name} />
      <p data-testid="display">Hello, {name}</p>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('typing into the textbox updates the displayed name', () => {
  render(<App />);
  const input = screen.getByTestId('name-input');
  fireEvent.change(input, { target: { value: 'Bob' } });
  expect(input.value).toBe('Bob');
  expect(screen.getByTestId('display')).toHaveTextContent('Hello, Bob');
});

test('clearing the textbox clears the name', () => {
  render(<App />);
  const input = screen.getByTestId('name-input');
  fireEvent.change(input, { target: { value: 'Carol' } });
  fireEvent.change(input, { target: { value: '' } });
  expect(screen.getByTestId('display')).toHaveTextContent('Hello,');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        data-testid="name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p data-testid="display">Hello, {name}</p>
    </div>
  );
}
```

## Walkthrough

1. The `onChange` event fires every time the input's value changes — typing one character fires it once.
2. The event object `e` exposes the new value at `e.target.value`.
3. Calling `setName(e.target.value)` updates state, which triggers a re-render where `value={name}` shows the new text.
