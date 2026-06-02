---
title: Apply a CSS Class to a Button
---

## Requirements

Render a `<button>` element with the text `Subscribe` and apply two CSS classes to it: `btn` and `btn-primary` (separated by a space).

> **Heads up:** the HTML `class` attribute is spelled differently in JSX.

## Files

```jsx file=App.jsx default
export default function App() {
  return <button>Subscribe</button>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the button text', () => {
  const { container } = render(<App />);
  const b = container.querySelector('button');
  expect(b).toBeTruthy();
  expect(b).toHaveTextContent('Subscribe');
});

test('button has both classes applied', () => {
  const { container } = render(<App />);
  const b = container.querySelector('button');
  expect(b.classList.contains('btn')).toBeTruthy();
  expect(b.classList.contains('btn-primary')).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return <button className="btn btn-primary">Subscribe</button>;
}
```

## Walkthrough

1. Since `class` is a reserved word in JavaScript, JSX uses `className`.
2. Multiple classes go into a single space-separated string, just like HTML.
3. React forwards `className` to the DOM as the actual `class` attribute.
