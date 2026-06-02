---
title: Render a Pre-Defined Component
---

## Requirements

A `Logo` component is already defined for you and is **read-only**. Your job is to render an instance of it from `App` so the page shows the text `MyApp`.

## Files

```jsx file=App.jsx default
// @lock
function Logo() {
  return <strong>MyApp</strong>;
}
// @endlock

export default function App() {
  return (
    <header>
      {/* render <Logo /> here */}
    </header>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the Logo component', () => {
  const { container } = render(<App />);
  const s = container.querySelector('strong');
  expect(s).toBeTruthy();
  expect(s).toHaveTextContent('MyApp');
});

test('Logo is inside the <header>', () => {
  const { container } = render(<App />);
  const header = container.querySelector('header');
  expect(header.querySelector('strong')).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
// @lock
function Logo() {
  return <strong>MyApp</strong>;
}
// @endlock

export default function App() {
  return (
    <header>
      <Logo />
    </header>
  );
}
```

## Walkthrough

1. A React component is just a function that returns JSX.
2. Use it like a custom HTML tag: `<Logo />`.
3. Component names must start with a capital letter — lowercase names are treated as DOM tags.
