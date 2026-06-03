---
title: Checkboxes to an Array (One-Way)
---

## Requirements

Three `<input type="checkbox">` elements are already in place, each with a `value` of `red`, `green`, or `blue`. A locked `<div data-testid="selected">` displays the current selection.

Your job is to record which boxes are checked **in an array state** — this is *one-way* binding (checkbox → state only; you do **not** need to bind each checkbox's `checked` attribute back to the state):

1. Declare an array state variable named `selected` that starts **empty**.
2. Add an `onChange` handler to each checkbox so that:
   - when it becomes **checked**, its `value` is **added** to `selected`;
   - when it becomes **unchecked**, its `value` is **removed** from `selected`.
3. Keep the order: a newly checked value is appended to the end of the array.

The locked `<div data-testid="selected">` shows `selected.join(',')`, so you can watch the array update as you toggle boxes.

> **Hint:** read `e.target.checked` to know the new state, and `e.target.value` for the box's value. Build a **new** array with the spread operator (`[...selected, value]`) or `.filter()` rather than mutating `selected` in place.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your array state here

  return (
    <div>
      <label>
        <input data-testid="cb-red" type="checkbox" value="red" />
        Red
      </label>
      <label>
        <input data-testid="cb-green" type="checkbox" value="green" />
        Green
      </label>
      <label>
        <input data-testid="cb-blue" type="checkbox" value="blue" />
        Blue
      </label>

      {/* @lock */}
      <div data-testid="selected">{/* shows the array */}</div>
      {/* @endlock */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('selection starts empty', () => {
  render(<App />);
  expect(screen.getByTestId('selected').textContent).toBe('');
});

test('checking a box adds its value to the array', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-green'));
  expect(screen.getByTestId('selected')).toHaveTextContent('green');
});

test('checking multiple boxes appends in order', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-red'));
  fireEvent.click(screen.getByTestId('cb-blue'));
  expect(screen.getByTestId('selected').textContent).toBe('red,blue');
});

test('unchecking a box removes only that value', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-red'));
  fireEvent.click(screen.getByTestId('cb-green'));
  fireEvent.click(screen.getByTestId('cb-blue'));
  expect(screen.getByTestId('selected').textContent).toBe('red,green,blue');

  fireEvent.click(screen.getByTestId('cb-green'));
  expect(screen.getByTestId('selected').textContent).toBe('red,blue');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [selected, setSelected] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter((v) => v !== value));
    }
  };

  return (
    <div>
      <label>
        <input data-testid="cb-red" type="checkbox" value="red" onChange={handleChange} />
        Red
      </label>
      <label>
        <input data-testid="cb-green" type="checkbox" value="green" onChange={handleChange} />
        Green
      </label>
      <label>
        <input data-testid="cb-blue" type="checkbox" value="blue" onChange={handleChange} />
        Blue
      </label>

      <div data-testid="selected">{selected.join(',')}</div>
    </div>
  );
}
```

## Walkthrough

1. One state variable — an **array** — holds every checked value, instead of a separate boolean per box.
2. The shared `handleChange` reads `e.target.value` (which box) and `e.target.checked` (the new state) to decide whether to add or remove.
3. Adding uses the spread `[...selected, value]` (append to the end); removing uses `.filter()` to drop the matching value. Both produce a **new** array so React notices the change.
4. This is *one-way* binding: the checkboxes drive the state, but the state isn't pushed back into the `checked` attribute. The next exercise adds that second direction.
