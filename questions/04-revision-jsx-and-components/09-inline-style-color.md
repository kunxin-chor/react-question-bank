---
title: Inline Style — Text Color
---

## Requirements

Render a `<p>` with the text `Warning!` and apply an inline style that sets its `color` to `red` and `font-weight` to `bold`.

> **Heads up:** the `style` attribute in JSX takes an *object*, not a CSS string. Multi-word property names use camelCase.

## Files

```jsx file=App.jsx default
export default function App() {
  return <p>Warning!</p>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the paragraph text', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p).toHaveTextContent('Warning!');
});

test('paragraph has inline color: red and font-weight: bold', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p.style.color).toBe('red');
  expect(p.style.fontWeight).toBe('bold');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return <p style={{ color: 'red', fontWeight: 'bold' }}>Warning!</p>;
}
```

## Walkthrough

1. `style={...}` — the outer `{}` is the JSX expression slot.
2. The inner `{...}` is a JavaScript object literal of CSS properties.
3. `font-weight` becomes `fontWeight` in camelCase.
