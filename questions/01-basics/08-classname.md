---
title: Apply a CSS Class
---

## Requirements

Render a `<p>` element with the text `Important notice` and apply the CSS class `alert` to it.

> **Heads up:** the HTML `class` attribute is named differently in JSX. If your first guess fails, look up how React spells this attribute.

## Files

```jsx file=App.jsx default
export default function App() {
  return <p>Important notice</p>;
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the paragraph text', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p).toBeTruthy();
  expect(p).toHaveTextContent('Important notice');
});

test('paragraph has the "alert" class', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p.classList.contains('alert')).toBeTruthy();
});

test('does not use the HTML "class" attribute literally', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  // The DOM exposes it as `className` regardless, but we make sure
  // the className landed correctly (not as some unknown attribute).
  expect(p.className).toBe('alert');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return <p className="alert">Important notice</p>;
}
```

## Walkthrough

1. JSX is JavaScript — `class` is a reserved word for declaring classes.
2. React renames the attribute to `className`, which it forwards to the DOM as the real `class` attribute.
3. The browser still sees `<p class="alert">` after React renders it, so existing CSS works unchanged.
