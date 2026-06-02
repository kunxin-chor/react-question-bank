---
title: Pass State Through Props
---

## Requirements

The `Box` component is already defined and **locked** — it accepts a `background` prop and renders a 100×100 square with that background color.

In `App`:

1. Create a state variable named `color` that starts as `"white"`.
2. Render three buttons labelled **Red**, **Blue**, and **White**. Each one should set `color` to its corresponding lowercase string when clicked.
3. Render a single `<Box />`, passing the current `color` value to its `background` prop, so the box's background updates in response to the buttons.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

// @lock
export function Box(props) {
  return (
    <div
      data-testid="box"
      style={{ width: 100, height: 100, background: props.background }}
    />
  );
}
// @endlock

export default function App() {
  // your code here

  return (
    <div>
      {/* buttons and <Box /> go here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('box starts white', () => {
  render(<App />);
  const box = screen.getByTestId('box');
  expect(box.style.background || box.style.backgroundColor).toBe('white');
});

test('clicking Red turns the box red', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Red' }));
  const box = screen.getByTestId('box');
  expect(box.style.background || box.style.backgroundColor).toBe('red');
});

test('clicking Blue turns the box blue', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Blue' }));
  const box = screen.getByTestId('box');
  expect(box.style.background || box.style.backgroundColor).toBe('blue');
});

test('clicking White after Red turns the box white again', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Red' }));
  fireEvent.click(screen.getByRole('button', { name: 'White' }));
  const box = screen.getByTestId('box');
  expect(box.style.background || box.style.backgroundColor).toBe('white');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

// @lock
export function Box(props) {
  return (
    <div
      data-testid="box"
      style={{ width: 100, height: 100, background: props.background }}
    />
  );
}
// @endlock

export default function App() {
  const [color, setColor] = useState('white');

  return (
    <div>
      <button onClick={() => setColor('red')}>Red</button>
      <button onClick={() => setColor('blue')}>Blue</button>
      <button onClick={() => setColor('white')}>White</button>
      <Box background={color} />
    </div>
  );
}
```

## Walkthrough

1. State lives in `App`, but the visual change happens inside `<Box />` — we bridge them with a prop.
2. Each button's `onClick` updates the parent's state; React re-renders `App`, which passes the new value down to `Box`.
3. This is the classic React data flow: **state up, props down.**
