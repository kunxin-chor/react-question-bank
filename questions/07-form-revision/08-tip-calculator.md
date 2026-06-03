---
title: Tip Calculator
---

## Requirements

Build a tip calculator. From scratch, write:

1. One `<input type="number">` with `data-testid="bill"` for the bill amount, fully controlled.
2. Three `<input type="radio" name="pct">` radio buttons with `data-testid` values `pct-10`, `pct-15`, `pct-20`, whose `value` attributes are exactly `10`, `15`, and `20`. Default the selection to `15`.
3. A `<button data-testid="calc">` labelled **Calculate**.
4. A `<div data-testid="tip">` that displays the calculated tip.

Behaviour:

- The tip `<div>` is **empty** until the **Calculate** button is pressed for the first time.
- Each time **Calculate** is pressed, compute `bill × (pct / 100)` and display it as a number.
- Treat an empty / non-numeric bill as `0`.

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

function setup(billVal, pctTestId) {
  render(<App />);
  fireEvent.change(screen.getByTestId('bill'), { target: { value: billVal } });
  if (pctTestId) fireEvent.click(screen.getByTestId(pctTestId));
  fireEvent.click(screen.getByTestId('calc'));
}

test('tip is empty before Calculate is pressed', () => {
  render(<App />);
  expect(screen.getByTestId('tip').textContent).toBe('');
});

test('15% is the default rate', () => {
  setup('100');
  expect(screen.getByTestId('tip')).toHaveTextContent('15');
});

test('10% works', () => {
  setup('80', 'pct-10');
  expect(screen.getByTestId('tip')).toHaveTextContent('8');
});

test('20% works', () => {
  setup('50', 'pct-20');
  expect(screen.getByTestId('tip')).toHaveTextContent('10');
});

test('tip updates when Calculate is pressed again with new inputs', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('bill'), { target: { value: '100' } });
  fireEvent.click(screen.getByTestId('calc'));
  expect(screen.getByTestId('tip')).toHaveTextContent('15');

  fireEvent.click(screen.getByTestId('pct-20'));
  fireEvent.change(screen.getByTestId('bill'), { target: { value: '200' } });
  fireEvent.click(screen.getByTestId('calc'));
  expect(screen.getByTestId('tip')).toHaveTextContent('40');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [bill, setBill] = useState('');
  const [pct, setPct] = useState('15');
  const [tip, setTip] = useState('');

  function calculate() {
    const amount = Number(bill) || 0;
    const rate = Number(pct) || 0;
    setTip(String(amount * (rate / 100)));
  }

  return (
    <div>
      <input
        data-testid="bill"
        type="number"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>
        <input
          data-testid="pct-10"
          type="radio"
          name="pct"
          value="10"
          checked={pct === '10'}
          onChange={(e) => setPct(e.target.value)}
        />
        10%
      </label>
      <label>
        <input
          data-testid="pct-15"
          type="radio"
          name="pct"
          value="15"
          checked={pct === '15'}
          onChange={(e) => setPct(e.target.value)}
        />
        15%
      </label>
      <label>
        <input
          data-testid="pct-20"
          type="radio"
          name="pct"
          value="20"
          checked={pct === '20'}
          onChange={(e) => setPct(e.target.value)}
        />
        20%
      </label>

      <button data-testid="calc" onClick={calculate}>
        Calculate
      </button>

      <div data-testid="tip">{tip}</div>
    </div>
  );
}
```

## Walkthrough

1. Three pieces of state model the form: the bill amount, the chosen rate, and the latest result.
2. Each control is *controlled* — its `value`/`checked` mirrors state, and its `onChange` writes back.
3. The calculation only runs when the user clicks **Calculate**, so we store the outcome in `tip` rather than recomputing on every render.
4. Storing the percentage as a string (`'10'`, `'15'`, `'20'`) lines the radio's `value` attribute up directly with the state.
