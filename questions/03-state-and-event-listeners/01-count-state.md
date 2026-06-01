---
title: Your First State Variable
---

## Requirements

Define a state variable named `count` with an initial value of `10`, and display it inside the `<p>` element.

> **Hint:** React's `useState` hook is already imported for you.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <p data-testid="count"></p>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders the initial count of 10', () => {
  render(<App />);
  const p = screen.getByTestId('count');
  expect(p).toHaveTextContent('10');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [count] = useState(10);
  return <p data-testid="count">{count}</p>;
}
```

## Walkthrough

1. `useState(initial)` returns a pair: the current value, and a setter function.
2. We only need the value here, so we destructure just the first slot: `const [count]`.
3. The initial value `10` is used on the first render and then ignored on subsequent renders.
