---
title: Display the Current Year
---

## Requirements

Render a `<span>` element that displays the current year as a number, obtained from JavaScript's built-in `Date` object.

> **Hint:** `Date` instances have a method that returns just the four-digit year.

## Files

```jsx file=App.jsx default
export default function App() {
  return <span></span>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the current year inside a <span>', () => {
  const { container } = render(<App />);
  const span = container.querySelector('span');
  expect(span).toBeTruthy();
  const year = String(new Date().getFullYear());
  expect((span.textContent || '').trim()).toBe(year);
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  const year = new Date().getFullYear();
  return <span>{year}</span>;
}
```

## Walkthrough

1. `new Date()` creates a `Date` object for the current moment.
2. `.getFullYear()` returns the year as a number.
3. `{year}` inside JSX evaluates the variable and inserts it as text.
