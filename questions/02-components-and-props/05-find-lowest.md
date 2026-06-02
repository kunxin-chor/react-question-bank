---
title: Compute Inside a Component
---

## Requirements

1. Define a `FindLowest` component that accepts two number props named `n1` and `n2`, and renders the smaller of the two values inside a `<div>`.
2. In `App`, render an instance of `FindLowest`. Pass `7` as the first number and `3` as the second number. The output should display `3`.

> **Hint:** the `Math` global has a built-in method for finding the minimum of several numbers.

## Files

```jsx file=App.jsx default
export function FindLowest(/* props */) {
  // build me
}

export default function App() {
  return (
    <div>
      {/* render <FindLowest n1={7} n2={3} /> here */}
    </div>
  );
}
```

## Tests

```js
import App, { FindLowest } from './App.jsx';
import { render } from './__rtl__.js';

test('FindLowest renders the smaller of two numbers', () => {
  const { container } = render(<FindLowest n1={10} n2={4} />);
  const div = container.querySelector('div');
  expect(div).toBeTruthy();
  expect(div).toHaveTextContent('4');
});

test('FindLowest works when n1 is the smaller value', () => {
  const { container } = render(<FindLowest n1={2} n2={9} />);
  const div = container.querySelector('div');
  expect(div).toHaveTextContent('2');
});

test('App renders the smaller of 7 and 3 (which is 3)', () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent('3');
});
```

## Solution

```jsx file=App.jsx
export function FindLowest(props) {
  return <div>{Math.min(props.n1, props.n2)}</div>;
}

export default function App() {
  return (
    <div>
      <FindLowest n1={7} n2={3} />
    </div>
  );
}
```

## Walkthrough

1. To pass a *number* (or any non-string value) as a prop, wrap it in `{}`: `n1={7}`.
2. Inside the component, props are plain JavaScript values — call `Math.min` on them like any function.
3. The expression inside JSX `{}` is evaluated each render, so the displayed value always matches the latest props.
