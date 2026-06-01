---
title: Two Buttons, One State
---

## Requirements

Define a state variable named `color` that starts as an empty string.

Wire the two existing buttons so that:

- Clicking **Red** sets `color` to `"red"`.
- Clicking **Blue** sets `color` to `"blue"`.

The current value of `color` should be displayed inside the `<p data-testid="color">` element.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare the color state here

  return (
    <div>
      <p data-testid="color"></p>
      <button>Red</button>
      <button>Blue</button>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('color starts empty', () => {
  render(<App />);
  expect(screen.getByTestId('color')).toHaveTextContent('');
});

test('clicking Red sets the color to "red"', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Red' }));
  expect(screen.getByTestId('color')).toHaveTextContent('red');
});

test('clicking Blue sets the color to "blue"', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Blue' }));
  expect(screen.getByTestId('color')).toHaveTextContent('blue');
});

test('clicking Red then Blue ends with "blue"', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Red' }));
  fireEvent.click(screen.getByRole('button', { name: 'Blue' }));
  expect(screen.getByTestId('color')).toHaveTextContent('blue');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [color, setColor] = useState('');

  return (
    <div>
      <p data-testid="color">{color}</p>
      <button onClick={() => setColor('red')}>Red</button>
      <button onClick={() => setColor('blue')}>Blue</button>
    </div>
  );
}
```

## Walkthrough

1. Two handlers, one state: each button calls `setColor` with a different literal.
2. React re-renders the whole component when state changes, so the `<p>` always reflects the latest value.
3. This pattern scales: any number of buttons can write to the same piece of state.
