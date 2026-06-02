---
title: Pass State Through Props — Size Picker
---

## Requirements

A `Label` component is already defined and **locked** — it accepts a `size` prop (a number) and renders a `<span>` whose inline `font-size` is that many pixels.

In `App`:

1. Create a state variable named `size` that starts as `16`.
2. Render three buttons labelled **S**, **M**, and **L**. Each one should set `size` to `12`, `18`, or `28` respectively.
3. Render a single `<Label text="Hello" />`-style instance, passing the current `size` value to its `size` prop, so the label's font size updates in response to the buttons.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

// @lock
export function Label(props) {
  return (
    <span data-testid="label" style={{ fontSize: props.size }}>
      Hello
    </span>
  );
}
// @endlock

export default function App() {
  // your code here

  return (
    <div>
      {/* buttons and <Label /> go here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('label starts at 16px', () => {
  render(<App />);
  expect(screen.getByTestId('label').style.fontSize).toBe('16px');
});

test('clicking S sets font size to 12px', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'S' }));
  expect(screen.getByTestId('label').style.fontSize).toBe('12px');
});

test('clicking M sets font size to 18px', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'M' }));
  expect(screen.getByTestId('label').style.fontSize).toBe('18px');
});

test('clicking L sets font size to 28px', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'L' }));
  expect(screen.getByTestId('label').style.fontSize).toBe('28px');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

// @lock
export function Label(props) {
  return (
    <span data-testid="label" style={{ fontSize: props.size }}>
      Hello
    </span>
  );
}
// @endlock

export default function App() {
  const [size, setSize] = useState(16);

  return (
    <div>
      <button onClick={() => setSize(12)}>S</button>
      <button onClick={() => setSize(18)}>M</button>
      <button onClick={() => setSize(28)}>L</button>
      <Label size={size} />
    </div>
  );
}
```

## Walkthrough

1. State lives in `App`, but the visual change happens inside `<Label />` — a prop bridges the two.
2. Each button's `onClick` updates the parent's state; React re-renders `App`, which passes the new `size` down to `Label`.
3. This is the classic React data flow: **state up, props down.**
