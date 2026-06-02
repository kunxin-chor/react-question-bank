---
title: Define and Export a Component
---

## Requirements

The `App` component is **read-only** and already renders `<Footer />`. Define and export a `Footer` component that returns a `<footer>` element with the text `© 2026 Acme Inc.`.

## Files

```jsx file=App.jsx default
export function Footer() {
  // build me
}

// @lock
export default function App() {
  return (
    <div>
      <Footer />
    </div>
  );
}
// @endlock
```

## Tests

```js
import App, { Footer } from './App.jsx';
import { render } from './__rtl__.js';

test('Footer renders the copyright text inside a <footer>', () => {
  const { container } = render(<Footer />);
  const f = container.querySelector('footer');
  expect(f).toBeTruthy();
  expect(f).toHaveTextContent('© 2026 Acme Inc.');
});

test('App renders Footer', () => {
  const { container } = render(<App />);
  expect(container).toHaveTextContent('© 2026 Acme Inc.');
});
```

## Solution

```jsx file=App.jsx
export function Footer() {
  return <footer>© 2026 Acme Inc.</footer>;
}

export default function App() {
  return (
    <div>
      <Footer />
    </div>
  );
}
```

## Walkthrough

1. A component is a function that returns JSX.
2. Use a named `export` so the test (and `App`) can import it.
3. `App` is locked and already calls `<Footer />` — you just need to define what it returns.
