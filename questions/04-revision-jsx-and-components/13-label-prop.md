---
title: A Button Component With a Label Prop
---

## Requirements

Define a `Label` component that accepts a single prop named `caption` and renders it inside a `<button>`.

The `App` component is **read-only** and already passes a value to the `caption` prop.

## Files

```jsx file=App.jsx default
export function Label(/* props go here */) {
  // build me
}

// @lock
export default function App() {
  return <Label caption="Save changes" />;
}
// @endlock
```

## Tests

```js
import App, { Label } from './App.jsx';
import { render } from './__rtl__.js';

test('Label renders its caption prop inside a <button>', () => {
  const { container } = render(<Label caption="Click me" />);
  const b = container.querySelector('button');
  expect(b).toBeTruthy();
  expect(b).toHaveTextContent('Click me');
});

test('App passes "Save changes" through the prop', () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent('Save changes');
});
```

## Solution

```jsx file=App.jsx
export function Label(props) {
  return <button>{props.caption}</button>;
}

export default function App() {
  return <Label caption="Save changes" />;
}
```

## Walkthrough

1. Props arrive as a single object — the first argument to the component function.
2. Read `props.caption` to access the prop value directly (no destructuring).
3. `{props.caption}` inside JSX inserts the prop's value as text.
