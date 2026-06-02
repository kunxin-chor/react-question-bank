---
title: Call a Helper Function in JSX
---

## Requirements

Call the read-only `formatPrice` function inside the JSX expression so the component displays the formatted price next to the `Total:` label.

The function is provided for you — just invoke it with the argument `42` inside the `{}` of the `<p>`.

## Files

```jsx file=App.jsx default
// @lock
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}
// @endlock

export default function App() {
  return (
    <p>
      Total: {}
    </p>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the formatted price next to "Total:"', () => {
  const { container } = render(<App />);
  const text = (container.textContent || '').trim();
  expect(text.indexOf('Total:') !== -1).toBeTruthy();
  expect(text.indexOf('$42.00') !== -1).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
// @lock
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}
// @endlock

export default function App() {
  return (
    <p>
      Total: {formatPrice(42)}
    </p>
  );
}
```

## Walkthrough

1. JSX `{}` expressions can call any function and embed its return value.
2. `formatPrice(42)` returns the string `"$42.00"`, which React renders as text.
3. This idea — functions returning values for JSX — generalizes to components that return JSX nodes.
