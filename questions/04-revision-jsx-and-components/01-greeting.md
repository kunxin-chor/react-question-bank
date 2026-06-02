---
title: Render a Greeting
---

## Requirements

Render an `<h2>` element whose text is exactly `Good morning!`.

## Files

```jsx file=App.jsx default
export default function App() {
  return <h2></h2>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders an <h2> saying "Good morning!"', () => {
  render(<App />);
  const h = screen.getByRole('heading');
  expect(h).toHaveTextContent('Good morning!');
  expect(h.tagName).toBe('H2');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return <h2>Good morning!</h2>;
}
```

## Walkthrough

1. JSX tags map to DOM elements — `<h2>` produces an `<h2>` node.
2. Text between the opening and closing tags becomes the element's text content.
3. `App` is the default export so the test harness can import it.
