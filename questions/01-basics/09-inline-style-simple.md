---
title: Inline Style — Font Size
---

## Requirements

Render an `<h1>` with the text `Big heading` and apply an inline style that sets its `font-size` to `48px`.

> **Heads up:** the `style` attribute in JSX behaves differently than in plain HTML. It does **not** take a string of CSS — read the React docs (or experiment) to find the correct shape.

## Files

```jsx file=App.jsx default
export default function App() {
  return <h1>Big heading</h1>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders the heading text', () => {
  render(<App />);
  const h = screen.getByRole('heading');
  expect(h).toHaveTextContent('Big heading');
});

test('heading has inline font-size of 48px', () => {
  const { container } = render(<App />);
  const h = container.querySelector('h1');
  expect(h.style.fontSize).toBe('48px');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return <h1 style={{ fontSize: '48px' }}>Big heading</h1>;
}
```

## Walkthrough

1. `style={...}` is a JSX expression — the outer braces escape into JavaScript.
2. The inner braces `{ ... }` are an object literal of CSS properties.
3. CSS property names are written in `camelCase` (`fontSize`, not `font-size`).
4. Either `fontSize: 48` or `fontSize: '48px'` works — React appends `px` to bare numbers for length properties.
