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

1. JSX elements compile to React elements; an `<h1>` becomes an `<h1>` DOM node.
2. Whatever you place between the opening and closing tags becomes the text content.
3. The component is the default export so the test can `import App from './App.jsx'`.
