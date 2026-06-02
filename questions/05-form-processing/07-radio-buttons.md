---
title: Radio Buttons — Selected Value
---

## Requirements

The state variable `color` and a `<div data-testid="display">` that displays its current value are already provided and **locked**. Three `<input type="radio">` elements are also provided, with the values `red`, `green`, and `blue` — but they're not yet wired to the state.

For each radio button, configure two things:

1. `checked` — `true` when its `value` equals the current `color` state.
2. `onChange` — when fired, set `color` to that radio's value.

After your changes, clicking a radio button should immediately update the displayed text in the `<div>` to that radio's value.

> **Note:** all three radios must share the same `name="color"` so the browser treats them as a single group.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [color, setColor] = useState('red');
  // @endlock

  return (
    <div>
      <label>
        <input data-testid="r-red" type="radio" name="color" value="red" />
        Red
      </label>
      <label>
        <input data-testid="r-green" type="radio" name="color" value="green" />
        Green
      </label>
      <label>
        <input data-testid="r-blue" type="radio" name="color" value="blue" />
        Blue
      </label>
      {/* @lock */}
      <div data-testid="display">{color}</div>
      {/* @endlock */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('initial display is "red" and the red radio is checked', () => {
  render(<App />);
  expect(screen.getByTestId('display')).toHaveTextContent('red');
  expect(screen.getByTestId('r-red').checked).toBe(true);
  expect(screen.getByTestId('r-green').checked).toBe(false);
  expect(screen.getByTestId('r-blue').checked).toBe(false);
});

test('clicking the green radio updates the display', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('r-green'));
  expect(screen.getByTestId('display')).toHaveTextContent('green');
  expect(screen.getByTestId('r-green').checked).toBe(true);
});

test('clicking the blue radio updates the display', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('r-blue'));
  expect(screen.getByTestId('display')).toHaveTextContent('blue');
  expect(screen.getByTestId('r-blue').checked).toBe(true);
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [color, setColor] = useState('red');
  // @endlock

  return (
    <div>
      <label>
        <input
          data-testid="r-red"
          type="radio"
          name="color"
          value="red"
          checked={color === 'red'}
          onChange={(e) => setColor(e.target.value)}
        />
        Red
      </label>
      <label>
        <input
          data-testid="r-green"
          type="radio"
          name="color"
          value="green"
          checked={color === 'green'}
          onChange={(e) => setColor(e.target.value)}
        />
        Green
      </label>
      <label>
        <input
          data-testid="r-blue"
          type="radio"
          name="color"
          value="blue"
          checked={color === 'blue'}
          onChange={(e) => setColor(e.target.value)}
        />
        Blue
      </label>
      <div data-testid="display">{color}</div>
    </div>
  );
}
```

## Walkthrough

1. A *controlled* radio uses `checked` (boolean) instead of `value` for its bound attribute.
2. Comparing `color === 'red'` produces `true` for exactly one radio at a time, so only that one looks selected.
3. In the `onChange` handler, `e.target.value` is the radio's `value` attribute — that's what we store in state.
