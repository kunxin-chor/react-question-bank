---
title: Compute an Average Inside a Component
---

## Requirements

1. Define an `Average` component that accepts three number props named `a`, `b`, and `c`, and renders the arithmetic mean of the three values inside a `<p>`.
2. In `App`, render an instance of `Average` with `a={10}`, `b={20}`, and `c={30}`. The output should display `20`.

> **Hint:** the mean of three numbers is `(a + b + c) / 3`.

## Files

```jsx file=App.jsx default
export function Average(/* props */) {
  // build me
}

export default function App() {
  return (
    <div>
      {/* render <Average a={10} b={20} c={30} /> here */}
    </div>
  );
}
```

## Tests

```js
import App, { Average } from './App.jsx';
import { render } from './__rtl__.js';

test('Average renders the mean of three numbers', () => {
  const { container } = render(<Average a={2} b={4} c={6} />);
  const p = container.querySelector('p');
  expect(p).toBeTruthy();
  expect(p).toHaveTextContent('4');
});

test('Average handles another set of numbers', () => {
  const { container } = render(<Average a={1} b={1} c={1} />);
  const p = container.querySelector('p');
  expect(p).toHaveTextContent('1');
});

test('App renders the mean of 10, 20, 30 (which is 20)', () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent('20');
});
```

## Solution

```jsx file=App.jsx
export function Average(props) {
  return <p>{(props.a + props.b + props.c) / 3}</p>;
}

export default function App() {
  return (
    <div>
      <Average a={10} b={20} c={30} />
    </div>
  );
}
```

## Walkthrough

1. Number props must be passed with curly braces: `a={10}`.
2. Access each value via `props.a`, `props.b`, `props.c` (no destructuring).
3. Any JS expression — including arithmetic — works inside JSX's `{}`.
