---
title: Function Call in JSX
---

## Requirements

Call the `getMessage` function inside the JSX `{}` expression so the component displays the returned string.

## Files

```jsx file=App.jsx default
// @lock
function getMessage() {
  return 'Hello from a function!';
}
// @endlock

export default function App() {
  return <h1>{}</h1>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders the message from getMessage()', () => {
  render(<App />);
  const h = screen.getByRole('heading');
  expect(h).toHaveTextContent('Hello from a function!');
});
```

## Solution

```jsx file=App.jsx
// @lock
function getMessage() {
  return 'Hello from a function!';
}
// @endlock

export default function App() {
  return <h1>{getMessage()}</h1>;
}
```

## Walkthrough

1. In JSX, curly braces `{}` let you embed JavaScript expressions.
2. Anything inside `{}` is evaluated and the result is rendered.
3. Here we call `getMessage()` which returns a string, and that string becomes the text content of the `<h1>`.
4. The function definition is locked — you can't modify it, but you can call it as many times as you need.
