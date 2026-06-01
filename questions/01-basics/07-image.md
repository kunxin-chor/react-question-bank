---
title: Display an Image
---

## Requirements

Render an `<img>` element that loads a 300×200 photo from Lorem Picsum.

Use this exact `src`:

```
https://picsum.photos/300/200
```

Also include an `alt` attribute set to `Random photo`.

## Files

```jsx file=App.jsx default
export default function App() {
  return (
    <div>
      {/* add the <img> here */}
    </div>
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
  expect(img.getAttribute('src')).toBe('https://picsum.photos/300/200');
});

test('image has the alt text "Random photo"', () => {
  const { container } = render(<App />);
  const img = container.querySelector('img');
  expect(img.getAttribute('alt')).toBe('Random photo');
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  return (
    <div>
      <img src="https://picsum.photos/300/200" alt="Random photo" />
    </div>
  );
}
```

## Walkthrough

1. In JSX, `<img>` is a self-closing tag — note the trailing `/>`.
2. Attributes like `src` and `alt` are written exactly as they would be in HTML when their values are string literals.
3. Always provide an `alt` attribute for accessibility; screen readers use it to describe the image.
