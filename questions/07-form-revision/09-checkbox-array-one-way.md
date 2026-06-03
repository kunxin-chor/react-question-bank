---
title: Toppings to an Array (One-Way)
---

## Requirements

Three `<input type="checkbox">` elements are already in place, each with a `value` of `cheese`, `mushroom`, or `olive`. A locked `<div data-testid="selected">` displays the current selection.

Record which boxes are checked **in an array state** — this is *one-way* binding (checkbox → state only; you do **not** need to bind each checkbox's `checked` attribute back to the state):

1. Declare an array state variable named `toppings` that starts **empty**.
2. Add an `onChange` handler to each checkbox so that:
   - when it becomes **checked**, its `value` is **added** to `toppings`;
   - when it becomes **unchecked**, its `value` is **removed** from `toppings`.
3. Keep the order: a newly checked value is appended to the end of the array.

The locked `<div data-testid="selected">` shows `toppings.join(',')`.

> **Hint:** read `e.target.checked` to know the new state, and `e.target.value` for the box's value. Build a **new** array with the spread operator or `.filter()` rather than mutating in place.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your array state here

  return (
    <div>
      <label>
        <input data-testid="cb-cheese" type="checkbox" value="cheese" />
        Cheese
      </label>
      <label>
        <input data-testid="cb-mushroom" type="checkbox" value="mushroom" />
        Mushroom
      </label>
      <label>
        <input data-testid="cb-olive" type="checkbox" value="olive" />
        Olive
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
  fireEvent.click(screen.getByTestId('cb-mushroom'));
  expect(screen.getByTestId('selected')).toHaveTextContent('mushroom');
});

test('checking multiple boxes appends in order', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-cheese'));
  fireEvent.click(screen.getByTestId('cb-olive'));
  expect(screen.getByTestId('selected').textContent).toBe('cheese,olive');
});

test('unchecking a box removes only that value', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-cheese'));
  fireEvent.click(screen.getByTestId('cb-mushroom'));
  fireEvent.click(screen.getByTestId('cb-olive'));
  expect(screen.getByTestId('selected').textContent).toBe('cheese,mushroom,olive');

  fireEvent.click(screen.getByTestId('cb-mushroom'));
  expect(screen.getByTestId('selected').textContent).toBe('cheese,olive');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [toppings, setToppings] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setToppings([...toppings, value]);
    } else {
      setToppings(toppings.filter((v) => v !== value));
    }
  };

  return (
    <div>
      <label>
        <input data-testid="cb-cheese" type="checkbox" value="cheese" onChange={handleChange} />
        Cheese
      </label>
      <label>
        <input data-testid="cb-mushroom" type="checkbox" value="mushroom" onChange={handleChange} />
        Mushroom
      </label>
      <label>
        <input data-testid="cb-olive" type="checkbox" value="olive" onChange={handleChange} />
        Olive
      </label>

      <div data-testid="selected">{toppings.join(',')}</div>
    </div>
  );
}
```

## Walkthrough

1. One state variable — an **array** — holds every checked value, instead of a separate boolean per box.
2. The shared `handleChange` reads `e.target.value` (which box) and `e.target.checked` (the new state) to decide whether to add or remove.
3. Adding uses the spread `[...toppings, value]`; removing uses `.filter()`. Both produce a **new** array so React notices the change.
4. This is *one-way* binding: the checkboxes drive the state, but the state isn't pushed back into the `checked` attribute. The next exercise adds that second direction.
