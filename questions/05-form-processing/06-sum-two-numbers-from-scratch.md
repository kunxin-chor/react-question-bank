---
title: Sum Two Numbers — Build It All
---

## Requirements

Build the entire UI from scratch:

1. Two state variables, one for each number.
2. Two `<input>` elements with `data-testid="a"` and `data-testid="b"` — each one fully controlled (`value` + `onChange`).
3. A `<div data-testid="sum">` that displays the **numeric sum** of the two inputs.

When an input is empty or non-numeric, treat it as `0` so the sum is always a valid number.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // build everything here
  return null;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders two inputs and a sum element', () => {
  render(<App />);
  expect(screen.getByTestId('a')).toBeTruthy();
  expect(screen.getByTestId('b')).toBeTruthy();
  expect(screen.getByTestId('sum')).toBeTruthy();
});

test('starts with a sum of 0', () => {
  render(<App />);
  expect(screen.getByTestId('sum')).toHaveTextContent('0');
});

test('typing into both inputs displays their sum', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('a'), { target: { value: '4' } });
  fireEvent.change(screen.getByTestId('b'), { target: { value: '6' } });
  expect(screen.getByTestId('sum')).toHaveTextContent('10');
});

test('inputs are controlled (their value reflects state)', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('a'), { target: { value: '12' } });
  expect(screen.getByTestId('a').value).toBe('12');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const sum = (Number(a) || 0) + (Number(b) || 0);

  return (
    <div>
      <input
        data-testid="a"
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <input
        data-testid="b"
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />
      <div data-testid="sum">{sum}</div>
    </div>
  );
}
```

## Walkthrough

1. Compared to the previous question, you now own the markup as well — but the controlled-input pattern is identical.
2. State, `value`, and `onChange` form a tight loop: state drives the displayed value; the user's keystrokes drive state.
3. Computing `sum` during render means it's automatically up to date — no extra "recalculate" step required.
