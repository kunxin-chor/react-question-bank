---
title: Reusing a Component With Different Props
---

## Requirements

1. Define a `HelloName` component that takes a `name` prop and renders `Hello, <name>` inside a `<div>`.
2. In `App`, render **two** instances of `HelloName`: one for `"Alice"` and one for `"Bob"`.

## Files

```jsx file=App.jsx default
export function HelloName(/* props */) {
  // build me
}

export default function App() {
  return (
    <section>
      {/* render two <HelloName /> instances here */}
    </section>
  );
}
```

## Tests

```js
import App, { HelloName } from './App.jsx';
import { render } from './__rtl__.js';

test('HelloName renders "Hello, <name>" in a <div>', () => {
  const { container } = render(<HelloName name="Carol" />);
  const div = container.querySelector('div');
  expect(div).toBeTruthy();
  expect(div).toHaveTextContent('Hello, Carol');
});

test('App renders one greeting for Alice and one for Bob', () => {
  const { container } = render(<App />);
  const text = container.textContent || '';
  expect(text.indexOf('Hello, Alice') !== -1).toBeTruthy();
  expect(text.indexOf('Hello, Bob') !== -1).toBeTruthy();
});

test('App contains two <div> greetings', () => {
  const { container } = render(<App />);
  const divs = container.querySelectorAll('div');
  expect(divs.length >= 2).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
export function HelloName({ name }) {
  return <div>Hello, {name}</div>;
}

export default function App() {
  return (
    <section>
      <HelloName name="Alice" />
      <HelloName name="Bob" />
    </section>
  );
}
```

## Walkthrough

1. Once a component takes props, the same definition can render any number of variations.
2. Each `<HelloName name="..." />` is its own instance with its own props.
3. This is the heart of React: small, reusable building blocks composed by passing data through props.
