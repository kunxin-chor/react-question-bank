---
title: Instantiate a Component
---

## Requirements

A `FooBar` component is already defined for you and is **read-only**. Your job is to render an instance of it from `App` so the page shows the text `foobar`.

## Files

```jsx file=App.jsx default
// @lock
function FooBar() {
  return <span>foobar</span>;
}
// @endlock

export default function App() {
  return (
    <div>
      {/* render <FooBar /> here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders the FooBar component', () => {
  const { container } = render(<App />);
  const span = container.querySelector('span');
  expect(span).toBeTruthy();
  expect(span).toHaveTextContent('foobar');
});
```

## Solution

```jsx file=App.jsx
// @lock
function FooBar() {
  return <span>foobar</span>;
}
// @endlock

export default function App() {
  return (
    <div>
      <FooBar />
    </div>
  );
}
```

## Walkthrough

1. A React component is just a function that returns JSX.
2. To *use* a component you write it like an HTML tag: `<FooBar />`.
3. Component names must start with a capital letter so JSX treats them as components and not as built-in tags.
