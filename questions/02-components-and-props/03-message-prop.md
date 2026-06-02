---
title: A Component With One Prop
---

## Requirements

Define a `Message` component that accepts a single prop named `text` and renders it inside a `<div>`.

The `App` component is **read-only** and already passes a value to the `text` prop.

## Files

```jsx file=App.jsx default
export function Message(/* props go here */) {
  // build me
}

// @lock
export default function App() {
  return <Message text="Welcome aboard!" />;
}
// @endlock
```

## Tests

```js
import App, { Message } from './App.jsx';
import { render } from './__rtl__.js';

test('Message renders its text prop inside a <div>', () => {
  const { container } = render(<Message text="Hi there" />);
  const div = container.querySelector('div');
  expect(div).toBeTruthy();
  expect(div).toHaveTextContent('Hi there');
});

test('App passes "Welcome aboard!" through the prop', () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent('Welcome aboard!');
});
```

## Solution

```jsx file=App.jsx
export function Message(props) {
  return <div>{props.text}</div>;
}

export default function App() {
  return <Message text="Welcome aboard!" />;
}
```

## Walkthrough

1. Props are passed to a component as the first function argument — a single object.
2. Access individual props via `props.text` (no destructuring).
3. Inside JSX, `{props.text}` evaluates the expression and inserts it as text content.
