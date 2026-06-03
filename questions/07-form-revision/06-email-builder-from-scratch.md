---
title: Email Builder — Build It All
---

## Requirements

Build the entire UI from scratch:

1. Two state variables, one for a `user` part and one for a `domain` part of an email address.
2. Two `<input type="text">` elements with `data-testid="user"` and `data-testid="domain"` — each one fully controlled (`value` + `onChange`).
3. A `<div data-testid="email">` that displays the combined address as `<user>@<domain>` (joined with a single `@`). When both inputs are empty the `<div>` should show just `@`.

> **Hint:** strings concatenate with `+`, or interpolate them inside JSX using `{user}@{domain}`.

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

test('renders both inputs and the email element', () => {
  render(<App />);
  expect(screen.getByTestId('user')).toBeTruthy();
  expect(screen.getByTestId('domain')).toBeTruthy();
  expect(screen.getByTestId('email')).toBeTruthy();
});

test('starts showing just @', () => {
  render(<App />);
  expect(screen.getByTestId('email').textContent).toBe('@');
});

test('typing in both inputs joins them with an @', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('user'), { target: { value: 'ada' } });
  fireEvent.change(screen.getByTestId('domain'), { target: { value: 'example.com' } });
  expect(screen.getByTestId('email')).toHaveTextContent('ada@example.com');
});

test('inputs are controlled (their value reflects state)', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('user'), { target: { value: 'grace' } });
  expect(screen.getByTestId('user').value).toBe('grace');
});

test('changing only one input updates the email', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('user'), { target: { value: 'ada' } });
  fireEvent.change(screen.getByTestId('domain'), { target: { value: 'example.com' } });
  fireEvent.change(screen.getByTestId('user'), { target: { value: 'alan' } });
  expect(screen.getByTestId('email')).toHaveTextContent('alan@example.com');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [user, setUser] = useState('');
  const [domain, setDomain] = useState('');

  return (
    <div>
      <input
        data-testid="user"
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <input
        data-testid="domain"
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <div data-testid="email">{user}@{domain}</div>
    </div>
  );
}
```

## Walkthrough

1. You own the whole UI now — but the controlled-input pattern is identical: `value` from state, `onChange` writes back to state.
2. Each field needs its **own** state.
3. The email is derived during render (`{user}@{domain}`), so it's always in sync with the latest input — no extra state needed for the combined value.
