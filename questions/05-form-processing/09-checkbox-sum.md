---
title: Checkbox Sum
---

## Requirements

Build a small form with three independent `<input type="checkbox">` elements and a `<div>` showing the **sum of the values of the checked boxes**.

Specifications:

1. The three checkboxes have `data-testid` values `cb-1`, `cb-2`, `cb-3` and represent the numbers `1`, `2`, and `4` respectively. Set each checkbox's `value` attribute to the corresponding number.
2. Each checkbox starts **unchecked**.
3. A `<div data-testid="sum">` displays the running total of all checked values. With nothing checked the sum is `0`.
4. Toggling a checkbox immediately updates the sum.

> **Hint:** the `checked` boolean of a checkbox lives at `e.target.checked` in the change event.

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

test('sum starts at 0 with nothing checked', () => {
  render(<App />);
  expect(screen.getByTestId('sum')).toHaveTextContent('0');
  expect(screen.getByTestId('cb-1').checked).toBe(false);
  expect(screen.getByTestId('cb-2').checked).toBe(false);
  expect(screen.getByTestId('cb-3').checked).toBe(false);
});

test('checking a single box adds its value', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-2'));
  expect(screen.getByTestId('sum')).toHaveTextContent('2');
});

test('checking multiple boxes sums their values', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-1'));
  fireEvent.click(screen.getByTestId('cb-3'));
  expect(screen.getByTestId('sum')).toHaveTextContent('5');
});

test('checking all three sums to 7', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-1'));
  fireEvent.click(screen.getByTestId('cb-2'));
  fireEvent.click(screen.getByTestId('cb-3'));
  expect(screen.getByTestId('sum')).toHaveTextContent('7');
});

test('unchecking a box subtracts its value', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-1'));
  fireEvent.click(screen.getByTestId('cb-2'));
  expect(screen.getByTestId('sum')).toHaveTextContent('3');
  fireEvent.click(screen.getByTestId('cb-1'));
  expect(screen.getByTestId('sum')).toHaveTextContent('2');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(false);

  const sum = (c1 ? 1 : 0) + (c2 ? 2 : 0) + (c3 ? 4 : 0);

  return (
    <div>
      <label>
        <input
          data-testid="cb-1"
          type="checkbox"
          value="1"
          checked={c1}
          onChange={(e) => setC1(e.target.checked)}
        />
        1
      </label>
      <label>
        <input
          data-testid="cb-2"
          type="checkbox"
          value="2"
          checked={c2}
          onChange={(e) => setC2(e.target.checked)}
        />
        2
      </label>
      <label>
        <input
          data-testid="cb-3"
          type="checkbox"
          value="4"
          checked={c3}
          onChange={(e) => setC3(e.target.checked)}
        />
        4
      </label>

      <div data-testid="sum">{sum}</div>
    </div>
  );
}
```

## Walkthrough

1. A controlled checkbox uses `checked` (boolean) for its bound attribute, not `value`.
2. The change handler reads `e.target.checked`, which is `true` when the box becomes checked and `false` when it becomes unchecked.
3. Each checkbox keeps its own boolean state. The `sum` is computed during render — no extra effect needed because React re-renders whenever any of the three states changes.
