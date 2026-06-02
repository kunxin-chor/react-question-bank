---
title: Sum Two Numbers — Wire the Inputs
---

## Requirements

Two `<input>` elements (with `data-testid="a"` and `data-testid="b"`) and a `<div data-testid="sum">` are already created. They're **not** locked, but you should leave their tags in place and only add what's needed.

You must:

1. Define two state variables to hold the value of each textbox. Initial value is up to you (use `''` or `0`).
2. Bind each textbox's `value` to its corresponding state.
3. Add `onChange` handlers so that typing updates the state.
4. Display the **numeric sum** of the two values inside the `<div data-testid="sum">`.

When either textbox is empty or non-numeric, treat it as `0` so the sum is still a valid number.

> **Hint:** the value coming back from `e.target.value` is always a *string*. Convert it with `Number(...)` before adding.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <div>
      <input data-testid="a" type="number" />
      <input data-testid="b" type="number" />
      <div data-testid="sum">{/* show the sum here */}</div>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts with a sum of 0', () => {
  render(<App />);
  expect(screen.getByTestId('sum')).toHaveTextContent('0');
});

test('updating a alone updates the sum', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('a'), { target: { value: '5' } });
  expect(screen.getByTestId('sum')).toHaveTextContent('5');
});

test('updating both inputs shows their sum', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('a'), { target: { value: '7' } });
  fireEvent.change(screen.getByTestId('b'), { target: { value: '3' } });
  expect(screen.getByTestId('sum')).toHaveTextContent('10');
});

test('changing a value recalculates the sum', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('a'), { target: { value: '7' } });
  fireEvent.change(screen.getByTestId('b'), { target: { value: '3' } });
  fireEvent.change(screen.getByTestId('a'), { target: { value: '20' } });
  expect(screen.getByTestId('sum')).toHaveTextContent('23');
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

1. Each textbox needs its **own** state — they hold independent values.
2. Storing the raw string from `e.target.value` lets you keep the input controlled even when the user temporarily clears it. Convert to a number only when computing the sum.
3. `Number('abc')` is `NaN`, so we guard with `|| 0` to keep the displayed sum sensible when the input is non-numeric.
