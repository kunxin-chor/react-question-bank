---
title: Render an Array of Objects as Bootstrap Cards
---

## Requirements

The `App` component has a locked array `products` already defined for you. Each product has a `title`, `description`, and `price`.

For each product, render a Bootstrap **card** with this structure:

- An outer `<div>` with the class `card`.
- Inside it, a `<div>` with the class `card-body` containing:
  - An `<h5>` with the class `card-title` showing the `title`.
  - A `<p>` with the class `card-text` showing the `description`.
  - A `<p>` with the class `card-price` showing the `price` formatted as `$<price>` (for example `$9.99`).

Bootstrap 5.3 is already imported.

The end result should look and be structured like this:

```html-preview height=420
<div class="container py-3">
  <h2>Products</h2>
  <div class="d-flex flex-column gap-3">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Notebook</h5>
        <p class="card-text">A5, dotted, 120 pages.</p>
        <p class="card-price">$9.99</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Pen</h5>
        <p class="card-text">Smooth black gel ink.</p>
        <p class="card-price">$2.5</p>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Stapler</h5>
        <p class="card-text">Standard desktop stapler.</p>
        <p class="card-price">$6</p>
      </div>
    </div>
  </div>
</div>
```

## Files

```jsx file=App.jsx default
// @lock
import 'bootstrap/dist/css/bootstrap.min.css';
// @endlock

export default function App() {
  // @lock
  const products = [
    { title: 'Notebook', description: 'A5, dotted, 120 pages.', price: 9.99 },
    { title: 'Pen', description: 'Smooth black gel ink.', price: 2.5 },
    { title: 'Stapler', description: 'Standard desktop stapler.', price: 6 },
  ];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Products</h2>
      {/* render one .card per product */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders one .card per product', () => {
  const { container } = render(<App />);
  const cards = container.querySelectorAll('.card');
  expect(cards.length).toBe(3);
});

test('each card has the expected inner structure and content', () => {
  const { container } = render(<App />);
  const cards = container.querySelectorAll('.card');
  const expected = [
    { title: 'Notebook', description: 'A5, dotted, 120 pages.', price: '$9.99' },
    { title: 'Pen', description: 'Smooth black gel ink.', price: '$2.5' },
    { title: 'Stapler', description: 'Standard desktop stapler.', price: '$6' },
  ];
  expected.forEach((p, i) => {
    const body = cards[i].querySelector('.card-body');
    expect(body).toBeTruthy();
    const title = body.querySelector('.card-title');
    const text = body.querySelector('.card-text');
    const price = body.querySelector('.card-price');
    expect(title).toHaveTextContent(p.title);
    expect(text).toHaveTextContent(p.description);
    expect(price).toHaveTextContent(p.price);
  });
});
```

## Solution

```jsx file=App.jsx
// @lock
import 'bootstrap/dist/css/bootstrap.min.css';
// @endlock

export default function App() {
  // @lock
  const products = [
    { title: 'Notebook', description: 'A5, dotted, 120 pages.', price: 9.99 },
    { title: 'Pen', description: 'Smooth black gel ink.', price: 2.5 },
    { title: 'Stapler', description: 'Standard desktop stapler.', price: 6 },
  ];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Products</h2>
      <div className="d-flex flex-column gap-3">
        {products.map((product) => (
          <div key={product.title} className="card">
            <div className="card-body">
              <h5 className="card-title">{product.title}</h5>
              <p className="card-text">{product.description}</p>
              <p className="card-price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Walkthrough

1. Each card is a small block of fixed JSX — the only thing that changes per iteration is the data being interpolated.
2. The `card` / `card-body` / `card-title` / `card-text` classes are Bootstrap's standard card recipe.
3. The price is rendered with a leading `$` by combining a string and an expression: `${'$'}{product.price}`. In JSX you can write the dollar sign as plain text and the value inside braces.
4. Wrapping the cards in a flex column with `gap-3` gives them consistent vertical spacing.
