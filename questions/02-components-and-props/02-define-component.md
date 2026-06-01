---
title: Define a Component
---

## Requirements

The `App` component is **read-only** and already renders `<HelloWorld />`. Define and export a `HelloWorld` component that returns a `<p>` with the text `Hello, world`.

## Files

```jsx file=App.jsx default
export function HelloWorld() {
  // build me
}

// @lock
export default function App() {
  return (
    <main>
      <HelloWorld />
    </main>
  );
}
// @endlock
```

## Tests

```js
import App, { HelloWorld } from './App.jsx';
import { render } from './__rtl__.js';

test('HelloWorld renders "Hello, world" in a <p>', () => {
  const { container } = render(<HelloWorld />);
  const p = container.querySelector('p');
  expect(p).toBeTruthy();
  expect(p).toHaveTextContent('Hello, world');
});

test('App renders HelloWorld', () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent('Hello, world');
});
```

## Solution

```jsx file=App.jsx
export function HelloWorld() {
  return <p>Hello, world</p>;
}

export default function App() {
  return (
    <main>
      <HelloWorld />
    </main>
  );
}
```

## Walkthrough

1. A component is a function that **returns JSX**.
2. We `export` it (named export) so the test can import it directly.
3. `App` is locked: it imports `HelloWorld` from the same file and renders it.
