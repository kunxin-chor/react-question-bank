---
title: Interpolate a Variable
---

## Requirements

The `App` component has a locked `const city` already defined for you. Display the value of `city` inside the `<h3>` element using JSX interpolation.

> **What does "interpolation" mean?** In general, *interpolation* means inserting a value into the middle of something else — like dropping a variable's value into a piece of text. In JSX you interpolate by wrapping a JavaScript expression in curly braces `{}` inside your markup; at render time React evaluates the expression and substitutes its value into the output. It's the same idea as template-literal interpolation in plain JavaScript (`` `Hello, ${name}` ``), but the delimiter is `{ ... }` instead of `${ ... }`.

## Files

```jsx file=App.jsx default
export default function App() {
  // @lock
  const city = 'Singapore';
  // @endlock
  return <h3></h3>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the value of the city variable inside the <h3>', () => {
  const { container } = render(<App />);
  const h = container.querySelector('h3');
  expect(h).toBeTruthy();
  expect(h).toHaveTextContent('Singapore');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  // @lock
  const city = 'Singapore';
  // @endlock
  return <h3>{city}</h3>;
}
```

## Walkthrough

1. `{}` inside JSX opens a JavaScript expression slot.
2. A bare variable name is a valid expression — its value is inserted as text.
3. If `city` changed, the JSX would automatically reflect the new value on next render.
