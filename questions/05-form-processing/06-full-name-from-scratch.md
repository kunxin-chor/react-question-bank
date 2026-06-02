---
title: Full Name Builder — Build It All
---

## Requirements

Build the entire UI from scratch:

1. Two state variables, one for the user's first name and one for their last name.
2. Two `<input type="text">` elements with `data-testid="first"` and `data-testid="last"` — each one fully controlled (`value` + `onChange`).
3. A `<div data-testid="full-name">` that displays the full name as `<first> <last>` (a single space between them). When both inputs are empty, the `<div>` should show a single space — i.e. its trimmed text content should be empty.

> **Hint:** strings concatenate with `+`, or you can interpolate them inside JSX using `{first} {last}`.

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

test('renders both inputs and the full-name element', () => {
  render(<App />);
  expect(screen.getByTestId('first')).toBeTruthy();
  expect(screen.getByTestId('last')).toBeTruthy();
  expect(screen.getByTestId('full-name')).toBeTruthy();
});

test('starts empty', () => {
  render(<App />);
  expect(screen.getByTestId('first').value).toBe('');
  expect(screen.getByTestId('last').value).toBe('');
  expect((screen.getByTestId('full-name').textContent || '').trim()).toBe('');
});

test('typing in both inputs joins them with a space', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('first'), { target: { value: 'Ada' } });
  fireEvent.change(screen.getByTestId('last'), { target: { value: 'Lovelace' } });
  expect(screen.getByTestId('full-name')).toHaveTextContent('Ada Lovelace');
});

test('inputs are controlled (their value reflects state)', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('first'), { target: { value: 'Grace' } });
  expect(screen.getByTestId('first').value).toBe('Grace');
});

test('changing only one input updates the full name', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('first'), { target: { value: 'Ada' } });
  fireEvent.change(screen.getByTestId('last'), { target: { value: 'Lovelace' } });
  fireEvent.change(screen.getByTestId('first'), { target: { value: 'Alan' } });
  expect(screen.getByTestId('full-name')).toHaveTextContent('Alan Lovelace');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');

  return (
    <div>
      <input
        data-testid="first"
        type="text"
        value={first}
        onChange={(e) => setFirst(e.target.value)}
      />
      <input
        data-testid="last"
        type="text"
        value={last}
        onChange={(e) => setLast(e.target.value)}
      />
      <div data-testid="full-name">{first} {last}</div>
    </div>
  );
}
```

## Walkthrough

1. You own the whole UI now — but the controlled-input pattern is identical to the previous questions: `value` from state, `onChange` writes back to state.
2. Each field needs its **own** state — they hold independent values.
3. The full name is derived during render (`{first} {last}`), so it's always in sync with the latest input — no extra state or effect needed for the combined value.
