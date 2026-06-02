---
title: Render an Avatar Image
---

## Requirements

Render an `<img>` element inside the `<figure>` that loads a 200×200 avatar from Lorem Picsum.

Use this exact `src`:

```
https://picsum.photos/200/200
```

Also include an `alt` attribute set to `User avatar`.

## Files

```jsx file=App.jsx default
export default function App() {
  return (
    <figure>
      {/* add the <img> here */}
    </figure>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders an <img> with the correct src', () => {
  const { container } = render(<App />);
  const img = container.querySelector('img');
  expect(img).toBeTruthy();
  expect(img.getAttribute('src')).toBe('https://picsum.photos/200/200');
});

test('image has the alt text "User avatar"', () => {
  const { container } = render(<App />);
  const img = container.querySelector('img');
  expect(img.getAttribute('alt')).toBe('User avatar');
});

test('image is wrapped in a <figure>', () => {
  const { container } = render(<App />);
  const fig = container.querySelector('figure');
  expect(fig).toBeTruthy();
  expect(fig.querySelector('img')).toBeTruthy();
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return (
    <figure>
      <img src="https://picsum.photos/200/200" alt="User avatar" />
    </figure>
  );
}
```

## Walkthrough

1. `<img>` is self-closing in JSX — note the trailing `/>`.
2. String literal attributes are written exactly as in HTML.
3. The `alt` attribute is essential for screen-reader accessibility.
