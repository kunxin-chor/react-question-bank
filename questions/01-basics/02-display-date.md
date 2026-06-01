---
title: Display Current Date
---

## Requirements

Render a `<p>` element that displays today's date as a readable string.

The exact format doesn't matter, as long as the value comes from JavaScript's built-in `Date` object and at minimum contains the current year.

> **Hint:** look up the `Date` constructor and the methods it provides for turning a date into a string.

## Files

```jsx file=App.jsx default
export default function App() {
  return <p></p>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders today\'s date inside a <p>', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p).toBeTruthy();

  const expected = new Date().toDateString();
  const text = (p.textContent || '').trim();
  // Accept any format that contains today's year, month name or numeric date.
  const year = String(new Date().getFullYear());
  expect(text.length > 0).toBeTruthy();
  expect(text.indexOf(year) !== -1 || text === expected).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  const today = new Date().toDateString();
  return <p>{today}</p>;
}
```

## Walkthrough

1. `new Date()` returns a `Date` object representing the current moment.
2. `.toDateString()` formats it as a readable string like `"Wed May 29 2026"`.
3. Inside JSX, wrap the expression in `{}` to embed its result as text.
