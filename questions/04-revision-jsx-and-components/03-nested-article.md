---
title: Build a Nested Article
---

## Requirements

Render a root `<article>` containing three nested children, in this order:

- An `<h3>` with the text `Breaking News`
- A `<p>` with the text `Something happened today.`
- A `<footer>` with the text `Posted just now`

## Files

```jsx file=App.jsx default
export default function App() {
  return (
    <article>
      {/* add the three children here */}
    </article>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('root element is an <article>', () => {
  const { container } = render(<App />);
  expect(container.firstChild.tagName).toBe('ARTICLE');
});

test('renders an <h3> with "Breaking News"', () => {
  const { container } = render(<App />);
  const h = container.querySelector('h3');
  expect(h).toBeTruthy();
  expect(h).toHaveTextContent('Breaking News');
});

test('renders a <p> with the body text', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p).toBeTruthy();
  expect(p).toHaveTextContent('Something happened today.');
});

test('renders a <footer> with the posted text', () => {
  const { container } = render(<App />);
  const f = container.querySelector('footer');
  expect(f).toBeTruthy();
  expect(f).toHaveTextContent('Posted just now');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return (
    <article>
      <h3>Breaking News</h3>
      <p>Something happened today.</p>
      <footer>Posted just now</footer>
    </article>
  );
}
```

## Walkthrough

1. A JSX expression must return a single root element — here `<article>`.
2. Children are placed between the parent's opening and closing tags.
3. Order matters: siblings render in the order they appear in source.
