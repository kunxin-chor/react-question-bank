---
title: Greet By Name
---

## Requirements

Build a `Greeting` component that accepts a `name` prop and renders `Hello, <name>!` inside a `<p>` element.

If `name` is missing or empty, render `Hello, stranger!` instead.

The default export of `App.jsx` should render `<Greeting name="Ada" />`.

## Files

```jsx file=App.jsx default
export function Greeting({ name }) {
  return <p></p>;
}

export default function App() {
  return <Greeting />;
}
```

## Tests

```js
import App, { Greeting } from './App.jsx';
import { render, screen } from './__rtl__.js';

test('App renders "Hello, Ada!"', () => {
  render(<App />);
  expect(screen.getByText('Hello, Ada!')).toBeTruthy();
});

test('Greeting falls back to "stranger" when name missing', () => {
  render(<Greeting />);
  expect(screen.getByText('Hello, stranger!')).toBeTruthy();
});

test('Greeting falls back when name is empty string', () => {
  render(<Greeting name="" />);
  expect(screen.getByText('Hello, stranger!')).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
export function Greeting({ name }) {
  const who = name && name.length > 0 ? name : 'stranger';
  return <p>Hello, {who}!</p>;
}

export default function App() {
  return <Greeting name="Ada" />;
}
```

## Walkthrough

1. Destructure the `name` prop in the function signature.
2. Pick a display value: `name` if truthy and non-empty, otherwise `'stranger'`.
3. Embed it in JSX with `{}` interpolation.
4. `App` simply forwards a literal `name="Ada"` to `Greeting`.
