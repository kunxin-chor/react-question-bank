---
title: Reuse a Component With Different Props
---

## Requirements

1. Define a `Product` component that takes a `name` prop and a `price` prop, and renders `<li>{name} - ${price}</li>`.
2. In `App`, render **three** instances of `Product` inside the `<ul>`:
   - `"Apple"` for `1`
   - `"Bread"` for `3`
   - `"Cheese"` for `5`

## Files

```jsx file=App.jsx default
export function Product(/* props */) {
  // build me
}

export default function App() {
  return (
    <ul>
      {/* render three <Product /> instances here */}
    </ul>
  );
}
```

## Tests

```js
import App, { Product } from './App.jsx';
import { render } from './__rtl__.js';

test('Product renders "<name> - $<price>" in a <li>', () => {
  const { container } = render(<Product name="Milk" price={2} />);
  const li = container.querySelector('li');
  expect(li).toBeTruthy();
  expect(li).toHaveTextContent('Milk - $2');
});

test('App renders all three products', () => {
  const { container } = render(<App />);
  const text = container.textContent || '';
  expect(text.indexOf('Apple - $1') !== -1).toBeTruthy();
  expect(text.indexOf('Bread - $3') !== -1).toBeTruthy();
  expect(text.indexOf('Cheese - $5') !== -1).toBeTruthy();
});

test('App contains three <li> items inside a <ul>', () => {
  const { container } = render(<App />);
  const ul = container.querySelector('ul');
  expect(ul).toBeTruthy();
  expect(ul.querySelectorAll('li').length).toBe(3);
});
```

## Solution

```jsx file=App.jsx
export function Product(props) {
  return <li>{props.name} - ${props.price}</li>;
}

export default function App() {
  return (
    <ul>
      <Product name="Apple" price={1} />
      <Product name="Bread" price={3} />
      <Product name="Cheese" price={5} />
    </ul>
  );
}
```

## Walkthrough

1. A component with multiple props can be reused for many similar items.
2. Numeric props are wrapped in `{}`: `price={1}`, not `price="1"`.
3. Inside JSX, you can freely mix expressions and plain text — `{props.name} - ${props.price}` renders both.
