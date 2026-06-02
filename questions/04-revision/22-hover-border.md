---
title: Hover to Change a Border
---

## Requirements

A 60×60 `<div>` is already in place. Make its **border colour** respond to the cursor:

- When the mouse moves **onto** the div, the border colour should be `purple`.
- When the mouse moves **off** the div, the border colour should be `gray`.

Use a single state variable to track the current border colour.

> **Hint:** React provides event props for when the cursor enters or leaves an element (`onMouseOver`/`onMouseOut`, or `onMouseEnter`/`onMouseLeave`).

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // track the border colour in state

  return (
    <div
      data-testid="hoverbox"
      style={{
        width: 60,
        height: 60,
        background: 'white',
        border: '4px solid gray',
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

test('starts with a gray border', () => {
  render(<App />);
  const box = screen.getByTestId('hoverbox');
  expect(box.style.border).toBe('4px solid gray');
});

test('border turns purple when the mouse enters', () => {
  render(<App />);
  const box = screen.getByTestId('hoverbox');
  dispatch(box, 'mouseover');
  expect(box.style.border).toBe('4px solid purple');
});

test('border returns to gray when the mouse leaves', () => {
  render(<App />);
  const box = screen.getByTestId('hoverbox');
  dispatch(box, 'mouseover');
  dispatch(box, 'mouseout');
  expect(box.style.border).toBe('4px solid gray');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [borderColor, setBorderColor] = useState('gray');

  return (
    <div
      data-testid="hoverbox"
      onMouseOver={() => setBorderColor('purple')}
      onMouseOut={() => setBorderColor('gray')}
      style={{
        width: 60,
        height: 60,
        background: 'white',
        border: `4px solid ${borderColor}`,
      }}
    />
  );
}
```

## Walkthrough

1. `onMouseOver` fires when the cursor enters the element, `onMouseOut` when it leaves.
2. Both handlers update the same state variable, and the style template-string reads from it — so the border tracks the cursor.
3. The shorthand `border: \`4px solid ${borderColor}\`` keeps the width and style fixed and only varies the colour.
