---
title: Toppings to an Array (Two-Way)
---

## Requirements

This builds on the previous exercise. The `toppings` array state, a `toggle(value)` helper, three **Toggle** buttons, and the `<div data-testid="selected">` display are all **locked** and already working — each button adds the value if it's missing from `toppings`, or removes it if it's present.

Your job is to make each checkbox do **two-way** binding with the `toppings` state:

1. **State → checkbox:** each checkbox's `checked` attribute must reflect whether its `value` is in `toppings`. So when a locked **Toggle** button changes the state, the matching checkbox must visibly check/uncheck itself.
2. **Checkbox → state:** clicking a checkbox must call the locked `toggle` helper with its `value`.

Use the locked **Toggle** buttons to confirm both directions work.

> **Hint:** `toppings.includes('cheese')` tells you whether a value is currently selected.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [toppings, setToppings] = useState([]);

  const toggle = (value) => {
    setToppings((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  // @endlock

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
      <div>
        <button data-testid="btn-cheese" onClick={() => toggle('cheese')}>Toggle Cheese</button>
        <button data-testid="btn-mushroom" onClick={() => toggle('mushroom')}>Toggle Mushroom</button>
        <button data-testid="btn-olive" onClick={() => toggle('olive')}>Toggle Olive</button>
      </div>
      <div data-testid="selected">{toppings.join(',')}</div>
      {/* @endlock */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('everything starts empty and unchecked', () => {
  render(<App />);
  expect(screen.getByTestId('selected').textContent).toBe('');
  expect(screen.getByTestId('cb-cheese').checked).toBe(false);
  expect(screen.getByTestId('cb-mushroom').checked).toBe(false);
  expect(screen.getByTestId('cb-olive').checked).toBe(false);
});

test('checkbox -> state: clicking a checkbox updates the array', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-mushroom'));
  expect(screen.getByTestId('selected')).toHaveTextContent('mushroom');
  expect(screen.getByTestId('cb-mushroom').checked).toBe(true);
});

test('state -> checkbox: a locked button checks the matching box', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('btn-cheese'));
  expect(screen.getByTestId('cb-cheese').checked).toBe(true);
  expect(screen.getByTestId('selected')).toHaveTextContent('cheese');
});

test('state -> checkbox: a locked button unchecks a box that was checked via the checkbox', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-olive'));
  expect(screen.getByTestId('cb-olive').checked).toBe(true);
  fireEvent.click(screen.getByTestId('btn-olive'));
  expect(screen.getByTestId('cb-olive').checked).toBe(false);
  expect(screen.getByTestId('selected').textContent).toBe('');
});

test('both directions stay in sync across several actions', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('btn-cheese'));   // state: cheese
  fireEvent.click(screen.getByTestId('cb-olive'));     // state: cheese, olive
  expect(screen.getByTestId('selected').textContent).toBe('cheese,olive');
  expect(screen.getByTestId('cb-cheese').checked).toBe(true);
  expect(screen.getByTestId('cb-olive').checked).toBe(true);

  fireEvent.click(screen.getByTestId('btn-cheese'));   // state: olive
  expect(screen.getByTestId('cb-cheese').checked).toBe(false);
  expect(screen.getByTestId('selected').textContent).toBe('olive');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [toppings, setToppings] = useState([]);

  const toggle = (value) => {
    setToppings((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  // @endlock

  return (
    <div>
      <label>
        <input
          data-testid="cb-cheese"
          type="checkbox"
          value="cheese"
          checked={toppings.includes('cheese')}
          onChange={() => toggle('cheese')}
        />
        Cheese
      </label>
      <label>
        <input
          data-testid="cb-mushroom"
          type="checkbox"
          value="mushroom"
          checked={toppings.includes('mushroom')}
          onChange={() => toggle('mushroom')}
        />
        Mushroom
      </label>
      <label>
        <input
          data-testid="cb-olive"
          type="checkbox"
          value="olive"
          checked={toppings.includes('olive')}
          onChange={() => toggle('olive')}
        />
        Olive
      </label>

      <div>
        <button data-testid="btn-cheese" onClick={() => toggle('cheese')}>Toggle Cheese</button>
        <button data-testid="btn-mushroom" onClick={() => toggle('mushroom')}>Toggle Mushroom</button>
        <button data-testid="btn-olive" onClick={() => toggle('olive')}>Toggle Olive</button>
      </div>
      <div data-testid="selected">{toppings.join(',')}</div>
    </div>
  );
}
```

## Walkthrough

1. **Two-way binding** means data flows in both directions: state drives what's shown (`checked={toppings.includes(value)}`), and user actions drive the state (`onChange={() => toggle(value)}`).
2. Because the locked **Toggle** buttons call the same `toggle` helper, pressing a button changes `toppings` — and since each checkbox reads its `checked` from `toppings`, the box visibly updates. That's the *state → view* direction proving itself.
3. Clicking a checkbox runs `toggle(value)`, mutating the array the same way. That's the *view → state* direction.
4. Reading `checked` from state is what makes the checkbox a **controlled** component — the single source of truth is `toppings`.
