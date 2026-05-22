---
title: Counter
---

## Requirements

Build a counter UI with three buttons and a display:

- A button with text `+` that increments the count by 1.
- A button with text `-` that decrements the count by 1.
- A button with text `Reset` that sets the count back to 0.
- A `<p>` element with `data-testid="count"` showing the current count, starting at `0`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <p data-testid="count">0</p>
      <button>-</button>
      <button>Reset</button>
      <button>+</button>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

function setup() {
  render(<App />);
  return {
    count: () => screen.getByTestId('count').textContent,
    inc:   () => fireEvent.click(screen.getByRole('button', { name: '+' })),
    dec:   () => fireEvent.click(screen.getByRole('button', { name: '-' })),
    reset: () => fireEvent.click(screen.getByRole('button', { name: 'Reset' })),
  };
}

test('starts at 0', () => {
  const u = setup();
  expect(u.count()).toBe('0');
});

test('+ increments', () => {
  const u = setup();
  u.inc(); u.inc();
  expect(u.count()).toBe('2');
});

test('- decrements', () => {
  const u = setup();
  u.dec();
  expect(u.count()).toBe('-1');
});

test('Reset returns to 0', () => {
  const u = setup();
  u.inc(); u.inc(); u.inc();
  u.reset();
  expect(u.count()).toBe('0');
});
```

## Solution

```jsx file=App.jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'inc':   return state + 1;
    case 'dec':   return state - 1;
    case 'reset': return 0;
    default:      return state;
  }
}

export default function App() {
  const [count, dispatch] = useReducer(reducer, 0);
  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={() => dispatch({ type: 'dec' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
    </div>
  );
}
```

## Walkthrough

1. Three transitions on a single number — perfect for `useReducer`.
2. The reducer is a pure function: `(state, action) => nextState`.
3. Each button dispatches an action by `type`.
4. `data-testid="count"` lets the test target the display without coupling to layout.
