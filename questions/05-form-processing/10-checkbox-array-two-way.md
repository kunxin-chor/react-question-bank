---
title: Checkboxes to an Array (Two-Way)
---

## Requirements

This builds on the previous exercise. The `selected` array state, a `toggle(value)` helper, three **Toggle** buttons, and the `<div data-testid="selected">` display are all **locked** and already working — each button adds the value if it's missing from `selected`, or removes it if it's present.

Your job is to make each checkbox do **two-way** binding with the `selected` state:

1. **State → checkbox:** each checkbox's `checked` attribute must reflect whether its `value` is in `selected`. So when a locked **Toggle** button changes the state, the matching checkbox must visibly check/uncheck itself.
2. **Checkbox → state:** clicking a checkbox must call the locked `toggle` helper with its `value`, adding or removing it from `selected`.

Use the locked **Toggle** buttons to confirm both directions work: pressing a button should flip its checkbox, and clicking a checkbox should change what the buttons toggle.

> **Hint:** `selected.includes('red')` tells you whether a value is currently selected.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [selected, setSelected] = useState([]);

  const toggle = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  // @endlock

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
      <div>
        <button data-testid="btn-red" onClick={() => toggle('red')}>Toggle Red</button>
        <button data-testid="btn-green" onClick={() => toggle('green')}>Toggle Green</button>
        <button data-testid="btn-blue" onClick={() => toggle('blue')}>Toggle Blue</button>
      </div>
      <div data-testid="selected">{selected.join(',')}</div>
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
  expect(screen.getByTestId('cb-red').checked).toBe(false);
  expect(screen.getByTestId('cb-green').checked).toBe(false);
  expect(screen.getByTestId('cb-blue').checked).toBe(false);
});

test('checkbox -> state: clicking a checkbox updates the array', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-green'));
  expect(screen.getByTestId('selected')).toHaveTextContent('green');
  expect(screen.getByTestId('cb-green').checked).toBe(true);
});

test('state -> checkbox: a locked button checks the matching box', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('btn-red'));
  expect(screen.getByTestId('cb-red').checked).toBe(true);
  expect(screen.getByTestId('selected')).toHaveTextContent('red');
});

test('state -> checkbox: a locked button unchecks a box that was checked via the checkbox', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-blue'));
  expect(screen.getByTestId('cb-blue').checked).toBe(true);
  fireEvent.click(screen.getByTestId('btn-blue'));
  expect(screen.getByTestId('cb-blue').checked).toBe(false);
  expect(screen.getByTestId('selected').textContent).toBe('');
});

test('both directions stay in sync across several actions', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('btn-red'));    // state: red
  fireEvent.click(screen.getByTestId('cb-blue'));    // state: red, blue
  expect(screen.getByTestId('selected').textContent).toBe('red,blue');
  expect(screen.getByTestId('cb-red').checked).toBe(true);
  expect(screen.getByTestId('cb-blue').checked).toBe(true);

  fireEvent.click(screen.getByTestId('btn-red'));    // state: blue
  expect(screen.getByTestId('cb-red').checked).toBe(false);
  expect(screen.getByTestId('selected').textContent).toBe('blue');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [selected, setSelected] = useState([]);

  const toggle = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };
  // @endlock

  return (
    <div>
      <label>
        <input
          data-testid="cb-red"
          type="checkbox"
          value="red"
          checked={selected.includes('red')}
          onChange={() => toggle('red')}
        />
        Red
      </label>
      <label>
        <input
          data-testid="cb-green"
          type="checkbox"
          value="green"
          checked={selected.includes('green')}
          onChange={() => toggle('green')}
        />
        Green
      </label>
      <label>
        <input
          data-testid="cb-blue"
          type="checkbox"
          value="blue"
          checked={selected.includes('blue')}
          onChange={() => toggle('blue')}
        />
        Blue
      </label>

      <div>
        <button data-testid="btn-red" onClick={() => toggle('red')}>Toggle Red</button>
        <button data-testid="btn-green" onClick={() => toggle('green')}>Toggle Green</button>
        <button data-testid="btn-blue" onClick={() => toggle('blue')}>Toggle Blue</button>
      </div>
      <div data-testid="selected">{selected.join(',')}</div>
    </div>
  );
}
```

## Walkthrough

1. **Two-way binding** means data flows in both directions: state drives what's shown (`checked={selected.includes(value)}`), and user actions drive the state (`onChange={() => toggle(value)}`).
2. Because the locked **Toggle** buttons call the same `toggle` helper, pressing a button changes `selected` — and since each checkbox reads its `checked` from `selected`, the box visibly updates. That's the *state → view* direction proving itself.
3. Clicking a checkbox runs `toggle(value)`, mutating the array the same way. That's the *view → state* direction.
4. Reading `checked` from state (rather than letting the browser own it) is what makes the checkbox a **controlled** component — the single source of truth is `selected`.
