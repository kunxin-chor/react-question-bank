---
title: Shopping Cart Total
---

## Requirements

The `App` component has a locked array `products` already defined (each has `id`, `name`, and `price`). Build a checkbox cart:

1. A state value tracking which product ids are currently selected (start with none selected).
2. For each product, render a row containing a `<input type="checkbox">` (`data-testid="cb-<id>"`) and the product's name and price.
3. A `<div data-testid="total">` showing the **sum of the prices of the checked products**. With nothing checked the total is `0`.
4. Toggling a checkbox updates the total immediately.

> **Hint:** an object or array of selected ids works well. To toggle, build a *new* collection rather than mutating state in place.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const products = [
    { id: 'a', name: 'Pen', price: 2 },
    { id: 'b', name: 'Notebook', price: 5 },
    { id: 'c', name: 'Backpack', price: 30 },
  ];
  // @endlock

  // declare your state here

  return (
    <div>
      {/* render one row per product */}
      <div data-testid="total">{/* show the total here */}</div>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('total starts at 0', () => {
  render(<App />);
  expect(screen.getByTestId('total')).toHaveTextContent('0');
});

test('checking a product adds its price', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-b'));
  expect(screen.getByTestId('total')).toHaveTextContent('5');
});

test('checking several products sums their prices', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-a'));
  fireEvent.click(screen.getByTestId('cb-c'));
  expect(screen.getByTestId('total')).toHaveTextContent('32');
});

test('unchecking subtracts the price again', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('cb-c'));
  fireEvent.click(screen.getByTestId('cb-b'));
  expect(screen.getByTestId('total')).toHaveTextContent('35');
  fireEvent.click(screen.getByTestId('cb-c'));
  expect(screen.getByTestId('total')).toHaveTextContent('5');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const products = [
    { id: 'a', name: 'Pen', price: 2 },
    { id: 'b', name: 'Notebook', price: 5 },
    { id: 'c', name: 'Backpack', price: 30 },
  ];
  // @endlock

  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const total = products
    .filter((product) => selected.includes(product.id))
    .reduce((sum, product) => sum + product.price, 0);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <input
            data-testid={`cb-${product.id}`}
            type="checkbox"
            checked={selected.includes(product.id)}
            onChange={() => toggle(product.id)}
          />
          {product.name} - ${product.price}
        </div>
      ))}
      <div data-testid="total">{total}</div>
    </div>
  );
}
```

## Walkthrough

1. `selected` holds the ids of checked products — a compact way to represent "which rows are on".
2. `toggle` builds a **new** array each time (adding with the spread, removing with `.filter`) so React sees a changed reference and re-renders.
3. A controlled checkbox derives `checked` from state (`selected.includes(id)`) and writes back in `onChange`.
4. The total is **derived** during render with `.filter` + `.reduce`, so it's always consistent with the current selection — no separate total state needed.
