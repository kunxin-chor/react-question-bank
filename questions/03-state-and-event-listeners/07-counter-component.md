---
title: A Self-Contained Counter Component
---

## Requirements

Build a `Counter` component that owns its own state:

1. Internally, hold a state variable named `count` that starts at `0`.
2. Render a `<p data-testid="count">` displaying the current count.
3. Render a `+` button that increases `count` by 1.
4. Render a `-` button that decreases `count` by 1.

`App` should render an instance of `<Counter />`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export function Counter() {
  // build me
}

export default function App() {
  return <Counter />;
}
```

## Tests

```js
import App, { Counter } from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('counter starts at 0', () => {
  render(<Counter />);
  expect(screen.getByTestId('count')).toHaveTextContent('0');
});

test('+ increments the count', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByTestId('count')).toHaveTextContent('2');
});

test('- decrements the count', () => {
  render(<Counter />);
  fireEvent.click(screen.getByRole('button', { name: '-' }));
  expect(screen.getByTestId('count')).toHaveTextContent('-1');
});

test('App renders a Counter', () => {
  render(<App />);
  expect(screen.getByTestId('count')).toHaveTextContent('0');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

export default function App() {
  return <Counter />;
}
```

## Walkthrough

1. State and the elements that use it can live entirely inside a child component — `App` doesn't need to know about `count`.
2. Each instance of `<Counter />` gets its own independent state, even if you render several.
3. This **encapsulation** is the foundation of reusable components: the parent provides where it lives in the tree, the component provides the behaviour.
