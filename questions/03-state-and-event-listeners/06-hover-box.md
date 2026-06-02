---
title: React to Mouse Events
---

## Requirements

A 50×50 `<div>` with a border is already in place. Make it change color in response to the cursor:

- When the mouse moves **onto** the div, its background should turn `red`.
- When the mouse moves **off** the div, its background should turn `blue`.

Use a single state variable to track the current color.

> **Hint:** React provides event props for when the cursor enters or leaves an element.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // track the background color in state

  return (
    <div
      data-testid="hoverbox"
      style={{
        width: 50,
        height: 50,
        border: '1px solid black',
        background: 'blue',
      }}
    />
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

function dispatch(el, type) {
  el.dispatchEvent(new MouseEvent(type, { bubbles: true }));
}

test('starts blue', () => {
  render(<App />);
  const box = screen.getByTestId('hoverbox');
  expect(box.style.background || box.style.backgroundColor).toBe('blue');
});

test('turns red when the mouse enters', () => {
  render(<App />);
  const box = screen.getByTestId('hoverbox');
  dispatch(box, 'mouseover');
  expect(box.style.background || box.style.backgroundColor).toBe('red');
});

test('returns to blue when the mouse leaves', () => {
  render(<App />);
  const box = screen.getByTestId('hoverbox');
  dispatch(box, 'mouseover');
  dispatch(box, 'mouseout');
  expect(box.style.background || box.style.backgroundColor).toBe('blue');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [color, setColor] = useState('blue');

  return (
    <div
      data-testid="hoverbox"
      onMouseOver={() => setColor('red')}
      onMouseOut={() => setColor('blue')}
      style={{
        width: 50,
        height: 50,
        border: '1px solid black',
        background: color,
      }}
    />
  );
}
```

## Walkthrough

1. `onMouseOver` fires when the cursor enters the element.
2. `onMouseOut` fires when it leaves.
3. Both handlers update the same state variable, and the style object reads from it — so the visual stays in sync with the cursor.
4. (`onMouseEnter` / `onMouseLeave` are close cousins that don't fire on child elements; for a leaf div like ours, either pair works.)
