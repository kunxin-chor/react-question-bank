---
title: Hello World
---

## Requirements

Render an `<h1>` element whose text is exactly `Hello, world!`.

## Files

```jsx file=App.jsx default
export default function App() {
  return <h1></h1>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders a heading saying "Hello, world!"', () => {
  render(<App />);
  const h = screen.getByRole('heading');
  expect(h).toHaveTextContent('Hello, world!');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

## Walkthrough

1. JSX elements are React components; an `<h1>` becomes a `<h1>` DOM node.
2. Whatever you put between the opening and closing tags becomes the text content.
3. We export the component as the default so the test can `import App from './App.jsx'`.
