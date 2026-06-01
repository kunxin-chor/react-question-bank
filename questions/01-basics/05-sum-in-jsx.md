---
title: Compute Inside JSX
---

## Requirements

The `App` component has two locked numeric constants, `n1` and `n2`. Using a `{}` expression inside JSX, display the **sum** of the two numbers inside the `<p>` element.

## Files

```jsx file=App.jsx default
export default function App() {
  // @lock
  const n1 = 12;
  const n2 = 30;
  // @endlock
  return <p></p>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the sum of n1 and n2 inside the <p>', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p).toBeTruthy();
  expect(p).toHaveTextContent('42');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  // @lock
  const n1 = 12;
  const n2 = 30;
  // @endlock
  return <p>{n1 + n2}</p>;
}
```

## Walkthrough

1. `{}` in JSX accepts *any* JavaScript expression, including arithmetic.
2. `n1 + n2` evaluates to a number, which React renders as text.
3. This is the same `{}` rule you've seen for variables and function calls — there's no separate "math mode".
