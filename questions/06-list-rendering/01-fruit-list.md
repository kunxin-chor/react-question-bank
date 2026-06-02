---
title: Render an Array as a List
---

## Requirements

The `App` component has a locked array `fruits` already defined for you.

Render the contents of `fruits` as an unordered list (`<ul>`) where each fruit appears as its own `<li>`. You can solve this by either:

- Building an array of list items with a function and embedding it inside the `<ul>`, or
- Calling `.map()` directly inside the JSX.

Style the page with Bootstrap 5.3 — Bootstrap's CSS is already imported for you.

The end result should look and be structured like this:

```html-preview height=260
<div class="container py-3">
  <h2>Fruits</h2>
  <ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
    <li>Date</li>
  </ul>
</div>
```

## Files

```jsx file=App.jsx default
// @lock
import 'bootstrap/dist/css/bootstrap.min.css';
// @endlock

export default function App() {
  // @lock
  const fruits = ['Apple', 'Banana', 'Cherry', 'Date'];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Fruits</h2>
      {/* render the unordered list here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders a single <ul>', () => {
  const { container } = render(<App />);
  const uls = container.querySelectorAll('ul');
  expect(uls.length).toBe(1);
});

test('renders one <li> per fruit', () => {
  const { container } = render(<App />);
  const items = container.querySelectorAll('ul > li');
  expect(items.length).toBe(4);
});

test('each <li> contains the matching fruit name', () => {
  const { container } = render(<App />);
  const items = container.querySelectorAll('ul > li');
  const expected = ['Apple', 'Banana', 'Cherry', 'Date'];
  expected.forEach((name, i) => {
    expect(items[i]).toHaveTextContent(name);
  });
});
```

## Solution

```jsx file=App.jsx
// @lock
import 'bootstrap/dist/css/bootstrap.min.css';
// @endlock

export default function App() {
  // @lock
  const fruits = ['Apple', 'Banana', 'Cherry', 'Date'];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Fruits</h2>
      <ul>
        {fruits.map((fruit) => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Walkthrough

1. `.map()` transforms each string into a `<li>` element, returning a new array of JSX nodes.
2. React happily renders an array of elements inline — you just embed it with `{...}`.
3. The `key` prop helps React identify each item across re-renders. For a static list of unique strings, the string itself is a fine key.
4. The same result can be produced by writing a helper function that loops with `for` or `forEach` and pushes into an array — `.map()` is just the idiomatic shortcut.
