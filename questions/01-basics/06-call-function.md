---
title: Call a Function That Returns JSX
---

## Requirements

Call the `renderBadge` function inside the JSX expression so the component displays the badge it returns.

The function is provided for you and is **read-only** — just invoke it inside the `{}` of the root `<div>`.

## Files

```jsx file=App.jsx default
// @lock
function renderBadge() {
  return <span className="badge">New!</span>;
}
// @endlock

export default function App() {
  return (
    <div>
      Status: {}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders the badge returned by renderBadge()', () => {
  const { container } = render(<App />);
  const badge = container.querySelector('span.badge');
  expect(badge).toBeTruthy();
  expect(badge).toHaveTextContent('New!');
});

test('badge sits next to the "Status:" label', () => {
  const { container } = render(<App />);
  const text = (container.textContent || '').trim();
  expect(text.indexOf('Status:') !== -1).toBeTruthy();
  expect(text.indexOf('New!') !== -1).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
// @lock
function renderBadge() {
  return <span className="badge">New!</span>;
}
// @endlock

export default function App() {
  return (
    <div>
      Status: {renderBadge()}
    </div>
  );
}
```

## Walkthrough

1. JSX expressions inside `{}` can be *anything that evaluates to a React node* — including the return value of a function.
2. `renderBadge()` returns a `<span>` element, which React renders just like inline JSX.
3. This pattern is the seed of *components*: every React component is really just a function that returns JSX.
