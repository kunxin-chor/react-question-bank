---
title: Rectangle Area — Wire the Inputs
---

## Requirements

Two `<input>` elements (with `data-testid="width"` and `data-testid="height"`) and a `<div data-testid="area">` are already created. Leave their tags in place and only add what's needed.

You must:

1. Define two state variables to hold the value of each textbox (use `''` or `0` as the initial value).
2. Bind each textbox's `value` to its corresponding state.
3. Add `onChange` handlers so that typing updates the state.
4. Display the **product** (`width × height`) inside the `<div data-testid="area">`.

When either textbox is empty or non-numeric, treat it as `0` so the area is still a valid number.

> **Hint:** `e.target.value` is always a *string*. Convert it with `Number(...)` before multiplying.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <div>
      <input data-testid="width" type="number" />
      <input data-testid="height" type="number" />
      <div data-testid="area">{/* show the area here */}</div>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts with an area of 0', () => {
  render(<App />);
  expect(screen.getByTestId('area')).toHaveTextContent('0');
});

test('one dimension alone keeps the area at 0', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('width'), { target: { value: '5' } });
  expect(screen.getByTestId('area')).toHaveTextContent('0');
});

test('both dimensions show their product', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('width'), { target: { value: '4' } });
  fireEvent.change(screen.getByTestId('height'), { target: { value: '3' } });
  expect(screen.getByTestId('area')).toHaveTextContent('12');
});

test('changing a dimension recalculates the area', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('width'), { target: { value: '4' } });
  fireEvent.change(screen.getByTestId('height'), { target: { value: '3' } });
  fireEvent.change(screen.getByTestId('width'), { target: { value: '10' } });
  expect(screen.getByTestId('area')).toHaveTextContent('30');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const area = (Number(width) || 0) * (Number(height) || 0);

  return (
    <div>
      <input
        data-testid="width"
        type="number"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      <input
        data-testid="height"
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <div data-testid="area">{area}</div>
    </div>
  );
}
```

## Walkthrough

1. Each textbox needs its **own** state — they hold independent values.
2. Storing the raw string lets the input stay controlled even when temporarily cleared. Convert to a number only when computing the area.
3. `Number('abc')` is `NaN`, so we guard with `|| 0` to keep the displayed area sensible.
