---
title: A Configurable Circle
---

## Requirements

1. Define a `Circle` component that accepts three props named `size`, `color`, and `border`, and renders a `<div>` whose inline style:
   - sets `width` and `height` to the `size` prop
   - sets `background-color` to the `color` prop
   - sets `border` to the `border` prop
   - sets `border-radius` to `'50%'` (so the box appears as a circle)
   - sets `display` to `'inline-block'`
2. In `App`, render **two** `Circle` instances inside a `<div>`:
   - The first: size `60`, color `gold`, border `2px dashed black`.
   - The second: size `100`, color `seagreen`, border `4px solid navy`.

> **Hint:** numeric length values can be passed straight to a style object — React appends `px` for you.

## Files

```jsx file=App.jsx default
export function Circle(/* props */) {
  // build me
}

export default function App() {
  return (
    <div>
      {/* render two <Circle /> instances here */}
    </div>
  );
}
```

## Tests

```js
import App, { Circle } from './App.jsx';
import { render } from './__rtl__.js';

test('Circle applies size, color, border, border-radius and display', () => {
  const { container } = render(
    <Circle size={40} color="red" border="1px solid black" />,
  );
  const div = container.querySelector('div');
  expect(div).toBeTruthy();
  expect(div.style.width).toBe('40px');
  expect(div.style.height).toBe('40px');
  expect(div.style.backgroundColor).toBe('red');
  expect(div.style.border).toBe('1px solid black');
  expect(div.style.borderRadius).toBe('50%');
  expect(div.style.display).toBe('inline-block');
});

test('App renders two circles with the specified styles', () => {
  const { container } = render(<App />);
  const circles = container.querySelectorAll('div > div');
  expect(circles.length >= 2).toBeTruthy();

  const [first, second] = circles;
  expect(first.style.width).toBe('60px');
  expect(first.style.height).toBe('60px');
  expect(first.style.backgroundColor).toBe('gold');
  expect(first.style.border).toBe('2px dashed black');

  expect(second.style.width).toBe('100px');
  expect(second.style.height).toBe('100px');
  expect(second.style.backgroundColor).toBe('seagreen');
  expect(second.style.border).toBe('4px solid navy');
});
```

## Solution

```jsx file=App.jsx
export function Circle(props) {
  return (
    <div
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: props.color,
        border: props.border,
        borderRadius: '50%',
        display: 'inline-block',
      }}
    />
  );
}

export default function App() {
  return (
    <div>
      <Circle size={60} color="gold" border="2px dashed black" />
      <Circle size={100} color="seagreen" border="4px solid navy" />
    </div>
  );
}
```

## Walkthrough

1. The same `props.size` value powers both `width` and `height` to keep the shape square.
2. `borderRadius: '50%'` turns a square `<div>` into a circle.
3. `display: 'inline-block'` lets the two circles sit side by side.
4. Access each prop via the `props` object (e.g. `props.color`) without destructuring.
