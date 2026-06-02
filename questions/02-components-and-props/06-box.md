---
title: A Configurable Box
---

## Requirements

1. Define a `Box` component that accepts three props named `width`, `height`, and `background`, and renders a `<div>` whose inline style applies all three. The box must also be displayed as an inline block so two boxes can sit side by side.
2. In `App`, render **two** `Box` instances:
   - The first: width `80`, height `80`, background `tomato`.
   - The second: width `120`, height `60`, background `steelblue`.

> **Hint:** numeric length values can be passed straight to a style object — React appends `px` for you.

## Files

```jsx file=App.jsx default
export function Box(/* props */) {
  // build me
}

export default function App() {
  return (
    <div>
      {/* render two <Box /> instances here */}
    </div>
  );
}
```

## Tests

```js
import App, { Box } from './App.jsx';
import { render } from './__rtl__.js';

test('Box applies width, height, background, and inline-block', () => {
  const { container } = render(
    <Box width={50} height={40} background="red" />,
  );
  const div = container.querySelector('div');
  expect(div).toBeTruthy();
  expect(div.style.width).toBe('50px');
  expect(div.style.height).toBe('40px');
  expect(div.style.background || div.style.backgroundColor).toBe('red');
  expect(div.style.display).toBe('inline-block');
});

test('App renders two boxes with the specified styles', () => {
  const { container } = render(<App />);
  const boxes = container.querySelectorAll('div > div');
  expect(boxes.length >= 2).toBeTruthy();

  const [first, second] = boxes;
  expect(first.style.width).toBe('80px');
  expect(first.style.height).toBe('80px');
  expect(first.style.background || first.style.backgroundColor).toBe('tomato');

  expect(second.style.width).toBe('120px');
  expect(second.style.height).toBe('60px');
  expect(second.style.background || second.style.backgroundColor).toBe(
    'steelblue',
  );
});
```

## Solution

```jsx file=App.jsx
export function Box(props) {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        background: props.background,
        display: 'inline-block',
      }}
    />
  );
}

export default function App() {
  return (
    <div>
      <Box width={80} height={80} background="tomato" />
      <Box width={120} height={60} background="steelblue" />
    </div>
  );
}
```

## Walkthrough

1. Access each prop directly off the `props` object: `props.width`, `props.height`, `props.background`.
2. `display: 'inline-block'` lets the boxes sit on the same line; `display: 'block'` would stack them.
3. Reusing the same `Box` component with different prop values is the same idea as `<HelloName />` from the previous lesson — props let one component cover many variations.
