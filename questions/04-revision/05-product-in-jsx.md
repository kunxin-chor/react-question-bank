---
title: Multiply Inside JSX
---

## Requirements

The `App` component has two locked numeric constants, `price` and `quantity`. Using a `{}` expression inside JSX, display the **product** of the two numbers inside the `<strong>` element.

## Files

```jsx file=App.jsx default
export default function App() {
  // @lock
  const price = 9;
  const quantity = 4;
  // @endlock
  return <strong></strong>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders price * quantity inside the <strong>', () => {
  const { container } = render(<App />);
  const s = container.querySelector('strong');
  expect(s).toBeTruthy();
  expect(s).toHaveTextContent('36');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  // @lock
  const price = 9;
  const quantity = 4;
  // @endlock
  return <strong>{price * quantity}</strong>;
}
```

## Walkthrough

1. `{}` in JSX accepts any JavaScript expression, including arithmetic.
2. `price * quantity` evaluates to a number, which React renders as text.
3. The same `{}` rule handles variables, function calls, and math.
