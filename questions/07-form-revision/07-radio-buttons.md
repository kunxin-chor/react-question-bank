---
title: Radio Buttons — Pick a Size
---

## Requirements

The state variable `size` and a `<div data-testid="display">` that displays its current value are already provided and **locked**. Three `<input type="radio">` elements are also provided, with the values `small`, `medium`, and `large` — but they're not yet wired to the state.

For each radio button, configure two things:

1. `checked` — `true` when its `value` equals the current `size` state.
2. `onChange` — when fired, set `size` to that radio's value.

After your changes, clicking a radio button should immediately update the displayed text in the `<div>` to that radio's value.

> **Note:** all three radios must share the same `name="size"` so the browser treats them as a single group.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [size, setSize] = useState('small');
  // @endlock

  return (
    <div>
      <label>
        <input data-testid="r-small" type="radio" name="size" value="small" />
        Small
      </label>
      <label>
        <input data-testid="r-medium" type="radio" name="size" value="medium" />
        Medium
      </label>
      <label>
        <input data-testid="r-large" type="radio" name="size" value="large" />
        Large
      </label>
      {/* @lock */}
      <div data-testid="display">{size}</div>
      {/* @endlock */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('initial display is "small" and the small radio is checked', () => {
  render(<App />);
  expect(screen.getByTestId('display')).toHaveTextContent('small');
  expect(screen.getByTestId('r-small').checked).toBe(true);
  expect(screen.getByTestId('r-medium').checked).toBe(false);
  expect(screen.getByTestId('r-large').checked).toBe(false);
});

test('clicking the medium radio updates the display', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('r-medium'));
  expect(screen.getByTestId('display')).toHaveTextContent('medium');
  expect(screen.getByTestId('r-medium').checked).toBe(true);
});

test('clicking the large radio updates the display', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('r-large'));
  expect(screen.getByTestId('display')).toHaveTextContent('large');
  expect(screen.getByTestId('r-large').checked).toBe(true);
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [size, setSize] = useState('small');
  // @endlock

  return (
    <div>
      <label>
        <input
          data-testid="r-small"
          type="radio"
          name="size"
          value="small"
          checked={size === 'small'}
          onChange={(e) => setSize(e.target.value)}
        />
        Small
      </label>
      <label>
        <input
          data-testid="r-medium"
          type="radio"
          name="size"
          value="medium"
          checked={size === 'medium'}
          onChange={(e) => setSize(e.target.value)}
        />
        Medium
      </label>
      <label>
        <input
          data-testid="r-large"
          type="radio"
          name="size"
          value="large"
          checked={size === 'large'}
          onChange={(e) => setSize(e.target.value)}
        />
        Large
      </label>
      <div data-testid="display">{size}</div>
    </div>
  );
}
```

## Walkthrough

1. A *controlled* radio uses `checked` (boolean) instead of `value` for its bound attribute.
2. Comparing `size === 'small'` produces `true` for exactly one radio at a time, so only that one looks selected.
3. In the `onChange` handler, `e.target.value` is the radio's `value` attribute — that's what we store in state.
