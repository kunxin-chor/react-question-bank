---
title: Add-on Price Total
---

## Requirements

Build a form with three independent `<input type="checkbox">` elements representing paid add-ons, and a `<div>` showing the **total price of the checked add-ons**.

Specifications:

1. The three checkboxes have `data-testid` values `addon-1`, `addon-2`, `addon-3` and represent the prices `3`, `5`, and `8` respectively. Set each checkbox's `value` attribute to the corresponding number.
2. Each checkbox starts **unchecked**.
3. A `<div data-testid="total">` displays the running total of all checked prices. With nothing checked the total is `0`.
4. Toggling a checkbox immediately updates the total.

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

test('total starts at 0 with nothing checked', () => {
  render(<App />);
  expect(screen.getByTestId('total')).toHaveTextContent('0');
  expect(screen.getByTestId('addon-1').checked).toBe(false);
  expect(screen.getByTestId('addon-2').checked).toBe(false);
  expect(screen.getByTestId('addon-3').checked).toBe(false);
});

test('checking a single add-on adds its price', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('addon-2'));
  expect(screen.getByTestId('total')).toHaveTextContent('5');
});

test('checking multiple add-ons sums their prices', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('addon-1'));
  fireEvent.click(screen.getByTestId('addon-3'));
  expect(screen.getByTestId('total')).toHaveTextContent('11');
});

test('checking all three totals 16', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('addon-1'));
  fireEvent.click(screen.getByTestId('addon-2'));
  fireEvent.click(screen.getByTestId('addon-3'));
  expect(screen.getByTestId('total')).toHaveTextContent('16');
});

test('unchecking an add-on subtracts its price', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('addon-1'));
  fireEvent.click(screen.getByTestId('addon-2'));
  expect(screen.getByTestId('total')).toHaveTextContent('8');
  fireEvent.click(screen.getByTestId('addon-1'));
  expect(screen.getByTestId('total')).toHaveTextContent('5');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [a1, setA1] = useState(false);
  const [a2, setA2] = useState(false);
  const [a3, setA3] = useState(false);

  const total = (a1 ? 3 : 0) + (a2 ? 5 : 0) + (a3 ? 8 : 0);

  return (
    <div>
      <label>
        <input
          data-testid="addon-1"
          type="checkbox"
          value="3"
          checked={a1}
          onChange={(e) => setA1(e.target.checked)}
        />
        Add-on 1 ($3)
      </label>
      <label>
        <input
          data-testid="addon-2"
          type="checkbox"
          value="5"
          checked={a2}
          onChange={(e) => setA2(e.target.checked)}
        />
        Add-on 2 ($5)
      </label>
      <label>
        <input
          data-testid="addon-3"
          type="checkbox"
          value="8"
          checked={a3}
          onChange={(e) => setA3(e.target.checked)}
        />
        Add-on 3 ($8)
      </label>

      <div data-testid="total">{total}</div>
    </div>
  );
}
```

## Walkthrough

1. A controlled checkbox uses `checked` (boolean) for its bound attribute, not `value`.
2. The change handler reads `e.target.checked`, which is `true` when the box becomes checked and `false` when unchecked.
3. Each checkbox keeps its own boolean state. The `total` is computed during render — no extra effect needed because React re-renders whenever any of the three states changes.
