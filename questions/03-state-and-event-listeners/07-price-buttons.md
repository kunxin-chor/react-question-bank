---
title: Increment by Different Amounts
---

## Requirements

Build a small "price" UI from scratch in `App`:

1. Create a state variable named `price` that starts at `0`.
2. Render three buttons labelled `+0.5`, `+1`, and `+2`.
3. Clicking each button should add its labelled amount to `price`.
4. Display the current `price` inside a `<p data-testid="price">`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // build me
  return <div></div>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('price starts at 0', () => {
  render(<App />);
  expect(screen.getByTestId('price')).toHaveTextContent('0');
});

test('clicking +1 increases price by 1', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '+1' }));
  expect(screen.getByTestId('price')).toHaveTextContent('1');
});

test('clicking +2 twice increases price to 4', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '+2' }));
  fireEvent.click(screen.getByRole('button', { name: '+2' }));
  expect(screen.getByTestId('price')).toHaveTextContent('4');
});

test('mixed clicks add up: +0.5, +1, +2 -> 3.5', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '+0.5' }));
  fireEvent.click(screen.getByRole('button', { name: '+1' }));
  fireEvent.click(screen.getByRole('button', { name: '+2' }));
  expect(screen.getByTestId('price')).toHaveTextContent('3.5');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [price, setPrice] = useState(0);

  return (
    <div>
      <p data-testid="price">{price}</p>
      <button onClick={() => setPrice(price + 0.5)}>+0.5</button>
      <button onClick={() => setPrice(price + 1)}>+1</button>
      <button onClick={() => setPrice(price + 2)}>+2</button>
    </div>
  );
}
```

## Walkthrough

1. To compute the next state from the current state, read the current value (`price`) and pass the new value to the setter.
2. Each button has its own handler with its own constant amount, but they all share the same setter.
3. For more robust updates that depend on the previous state, you can pass a function: `setPrice(prev => prev + 1)`.
