---
title: Nested JSX Elements
---

## Requirements

Render a root `<div>` containing two nested children:

- An `<h1>` with the text `My Page`
- A `<p>` with the text `Welcome to my site.`

## Files

```jsx file=App.jsx default
export default function App() {
  return (
    <div>
      {/* add the two children here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders an <h1> with "My Page"', () => {
  render(<App />);
  const h = screen.getByRole('heading');
  expect(h).toHaveTextContent('My Page');
});

test('renders a <p> with the welcome text', () => {
  const { container } = render(<App />);
  const p = container.querySelector('p');
  expect(p).toBeTruthy();
  expect(p).toHaveTextContent('Welcome to my site.');
});

test('both elements are nested inside a single root <div>', () => {
  const { container } = render(<App />);
  const root = container.firstChild;
  expect(root.tagName).toBe('DIV');
  expect(root.querySelector('h1')).toBeTruthy();
  expect(root.querySelector('p')).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return (
    <div>
      <h1>My Page</h1>
      <p>Welcome to my site.</p>
    </div>
  );
}
```

## Walkthrough

1. A JSX expression must return a *single* root element.
2. Place additional elements between the parent's opening and closing tags to nest them.
3. Indentation has no semantic effect, but it makes the structure readable.
