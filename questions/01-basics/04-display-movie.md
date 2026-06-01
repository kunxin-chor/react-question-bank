---
title: Embed a Variable in JSX
---

## Requirements

The `App` component has a locked `const movie` already defined for you. Display the value of `movie` inside the `<h2>` element using JSX interpolation.

## Files

```jsx file=App.jsx default
export default function App() {
  // @lock
  const movie = 'The Matrix';
  // @endlock
  return <h2></h2>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the value of the movie variable inside the <h2>', () => {
  const { container } = render(<App />);
  const h = container.querySelector('h2');
  expect(h).toBeTruthy();
  expect(h).toHaveTextContent('The Matrix');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  // @lock
  const movie = 'The Matrix';
  // @endlock
  return <h2>{movie}</h2>;
}
```

## Walkthrough

1. Anywhere inside JSX, `{}` lets you escape into a JavaScript expression.
2. A bare variable name like `movie` is a valid expression — its current value is dropped in as text.
3. If `movie` were changed later, the rendered output would automatically reflect the new value.
