---
title: Nested Lists — Categories and Items
---

## Requirements

The `App` component has a locked array `menu` already defined for you. Each entry is a category object with:

- A `name` (string)
- An `items` array, where each item is an object with a `name` and `price`.

For each category, render a Bootstrap **card** with the following structure:

- An outer `<div>` with the class `card category-card`.
- A `<div>` with the class `card-header` showing the category's `name`.
- A `<ul>` with the classes `list-group list-group-flush`. Inside it, one `<li>` per item with the class `list-group-item`. Each `<li>` should contain:
  - A `<span>` with the class `item-name` showing the item's `name`.
  - A `<span>` with the class `item-price` showing the item's price as `$<price>`.

Bootstrap 5.3 is already imported.

The end result should look and be structured like this:

```html-preview height=520
<div class="container py-3">
  <h2>Menu</h2>
  <div class="d-flex flex-column gap-3">
    <div class="card category-card">
      <div class="card-header">Drinks</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between">
          <span class="item-name">Espresso</span>
          <span class="item-price">$3</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span class="item-name">Latte</span>
          <span class="item-price">$4.5</span>
        </li>
      </ul>
    </div>
    <div class="card category-card">
      <div class="card-header">Pastries</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between">
          <span class="item-name">Croissant</span>
          <span class="item-price">$3.25</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span class="item-name">Muffin</span>
          <span class="item-price">$2.75</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span class="item-name">Scone</span>
          <span class="item-price">$3</span>
        </li>
      </ul>
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
  const menu = [
    {
      name: 'Drinks',
      items: [
        { name: 'Espresso', price: 3 },
        { name: 'Latte', price: 4.5 },
      ],
    },
    {
      name: 'Pastries',
      items: [
        { name: 'Croissant', price: 3.25 },
        { name: 'Muffin', price: 2.75 },
        { name: 'Scone', price: 3 },
      ],
    },
  ];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Menu</h2>
      {/* render one .category-card per category */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders one .category-card per category', () => {
  const { container } = render(<App />);
  const cards = container.querySelectorAll('.category-card');
  expect(cards.length).toBe(2);
});

test('each card header shows the category name', () => {
  const { container } = render(<App />);
  const cards = container.querySelectorAll('.category-card');
  expect(cards[0].querySelector('.card-header')).toHaveTextContent('Drinks');
  expect(cards[1].querySelector('.card-header')).toHaveTextContent('Pastries');
});

test('each card lists its items with name and price', () => {
  const { container } = render(<App />);
  const cards = container.querySelectorAll('.category-card');

  const drinks = cards[0].querySelectorAll('ul.list-group > li.list-group-item');
  expect(drinks.length).toBe(2);
  expect(drinks[0].querySelector('.item-name')).toHaveTextContent('Espresso');
  expect(drinks[0].querySelector('.item-price')).toHaveTextContent('$3');
  expect(drinks[1].querySelector('.item-name')).toHaveTextContent('Latte');
  expect(drinks[1].querySelector('.item-price')).toHaveTextContent('$4.5');

  const pastries = cards[1].querySelectorAll('ul.list-group > li.list-group-item');
  expect(pastries.length).toBe(3);
  expect(pastries[0].querySelector('.item-name')).toHaveTextContent('Croissant');
  expect(pastries[2].querySelector('.item-price')).toHaveTextContent('$3');
});
```

## Solution

```jsx file=App.jsx
// @lock
import 'bootstrap/dist/css/bootstrap.min.css';
// @endlock

export default function App() {
  // @lock
  const menu = [
    {
      name: 'Drinks',
      items: [
        { name: 'Espresso', price: 3 },
        { name: 'Latte', price: 4.5 },
      ],
    },
    {
      name: 'Pastries',
      items: [
        { name: 'Croissant', price: 3.25 },
        { name: 'Muffin', price: 2.75 },
        { name: 'Scone', price: 3 },
      ],
    },
  ];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Menu</h2>
      <div className="d-flex flex-column gap-3">
        {menu.map((category) => (
          <div key={category.name} className="card category-card">
            <div className="card-header">{category.name}</div>
            <ul className="list-group list-group-flush">
              {category.items.map((item) => (
                <li
                  key={item.name}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Walkthrough

1. Nested lists are just nested `.map()` calls — the outer one walks the categories, the inner one walks each category's items.
2. Each level needs its own `key`. The category's `name` and the item's `name` are unique within their level, so they work well.
3. Bootstrap's `list-group-flush` removes the outer borders so the list sits cleanly inside the card.
4. `d-flex justify-content-between` pushes the price to the right edge of each row.
