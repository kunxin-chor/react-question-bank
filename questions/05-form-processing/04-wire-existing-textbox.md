---
title: Wire Up an Existing Textbox
---

## Requirements

The state variable `query`, a `<div>` that displays its value, and a **Clear** button (already wired to reset the state) are all provided and **locked**.

Your only task is to configure the existing `<input data-testid="search-input">`:

1. Bind its `value` to the `query` state.
2. Add an `onChange` handler so that typing updates the `query` state.

After your changes, typing into the textbox should update the `<div data-testid="display">`, and clicking **Clear** should empty both the input and the display.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [query, setQuery] = useState('');
  // @endlock

  return (
    <div>
      <input data-testid="search-input" type="text" />
      {/* @lock */}
      <button onClick={() => setQuery('')}>Clear</button>
      <div data-testid="display">{query}</div>
      {/* @endlock */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('typing updates the display', () => {
  render(<App />);
  const input = screen.getByTestId('search-input');
  fireEvent.change(input, { target: { value: 'react' } });
  expect(input.value).toBe('react');
  expect(screen.getByTestId('display')).toHaveTextContent('react');
});

test('the Clear button empties the input and the display', () => {
  render(<App />);
  const input = screen.getByTestId('search-input');
  fireEvent.change(input, { target: { value: 'forms' } });
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(input.value).toBe('');
  expect(screen.getByTestId('display').textContent).toBe('');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [query, setQuery] = useState('');
  // @endlock

  return (
    <div>
      <input
        data-testid="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={() => setQuery('')}>Clear</button>
      <div data-testid="display">{query}</div>
    </div>
  );
}
```

## Walkthrough

1. Binding `value={query}` makes the input *controlled* — its text always equals the state.
2. The `onChange` handler propagates user keystrokes back into state via `setQuery`.
3. The locked **Clear** button calls `setQuery('')`. Because the input reads its value from state, the input also empties — the same data flow in reverse.
