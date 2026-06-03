---
title: Filter a List by Category
---

## Requirements

The `App` component has a locked array `dishes` already defined (each has `name` and `category`). Build category filter buttons:

1. A state variable named `filter` that starts as the string `all`.
2. Three filter buttons labelled **All**, **Veg**, and **Meat**. Clicking one sets `filter` to `'all'`, `'veg'`, or `'meat'` respectively.
3. A `<ul>` showing one `<li>` per dish whose `category` matches the current `filter`. When `filter` is `'all'`, show every dish.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const dishes = [
    { name: 'Salad', category: 'veg' },
    { name: 'Steak', category: 'meat' },
    { name: 'Soup', category: 'veg' },
    { name: 'Burger', category: 'meat' },
    { name: 'Fries', category: 'veg' },
  ];
  // @endlock

  // declare your state here

  return (
    <div>
      <button>All</button>
      <button>Veg</button>
      <button>Meat</button>
      <ul>
        {/* render the filtered dishes here */}
      </ul>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows all dishes initially', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('ul > li').length).toBe(5);
});

test('clicking Veg shows only vegetarian dishes', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Veg' }));
  const items = container.querySelectorAll('ul > li');
  expect(items.length).toBe(3);
  const text = container.textContent || '';
  expect(text.indexOf('Steak')).toBe(-1);
  expect(text.indexOf('Burger')).toBe(-1);
});

test('clicking Meat shows only meat dishes', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Meat' }));
  const items = container.querySelectorAll('ul > li');
  expect(items.length).toBe(2);
  expect(items[0]).toHaveTextContent('Steak');
  expect(items[1]).toHaveTextContent('Burger');
});

test('clicking All again restores the full list', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Meat' }));
  fireEvent.click(screen.getByRole('button', { name: 'All' }));
  expect(container.querySelectorAll('ul > li').length).toBe(5);
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const dishes = [
    { name: 'Salad', category: 'veg' },
    { name: 'Steak', category: 'meat' },
    { name: 'Soup', category: 'veg' },
    { name: 'Burger', category: 'meat' },
    { name: 'Fries', category: 'veg' },
  ];
  // @endlock

  const [filter, setFilter] = useState('all');

  const visible = dishes.filter(
    (dish) => filter === 'all' || dish.category === filter,
  );

  return (
    <div>
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('veg')}>Veg</button>
      <button onClick={() => setFilter('meat')}>Meat</button>
      <ul>
        {visible.map((dish) => (
          <li key={dish.name}>{dish.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Walkthrough

1. A single `filter` state value records the active category; the buttons just set it to different strings.
2. The visible list is **derived** by filtering during render — when `filter` is `'all'` the predicate is always true, so nothing is excluded.
3. Mapping the filtered array renders only the matching dishes; React re-runs this whenever `filter` changes.
