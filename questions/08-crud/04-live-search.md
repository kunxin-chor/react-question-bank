---
title: Live Search Filter
---

## Requirements

The `App` component has a locked array `cities` already defined. Build a search box that filters the list as the user types:

1. A state variable named `query` that starts empty.
2. An `<input type="text" data-testid="search">` bound to `query` (controlled).
3. A `<ul>` showing one `<li>` per city whose name **contains** the typed text, **case-insensitively**. With an empty query, every city is shown.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const cities = ['London', 'Paris', 'Lisbon', 'Berlin', 'Madrid', 'Lyon'];
  // @endlock

  // declare your state here

  return (
    <div>
      <input data-testid="search" type="text" />
      <ul>
        {/* render the filtered cities here */}
      </ul>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows all cities initially', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('ul > li').length).toBe(6);
});

test('filters as the user types (case-insensitive)', () => {
  const { container } = render(<App />);
  fireEvent.change(screen.getByTestId('search'), { target: { value: 'l' } });
  const text = container.textContent || '';
  // Cities containing "l" (case-insensitive): London, Lisbon, Berlin, Lyon
  expect(container.querySelectorAll('ul > li').length).toBe(4);
  expect(text.indexOf('Paris')).toBe(-1);
  expect(text.indexOf('Madrid')).toBe(-1);
});

test('narrows further with more specific queries', () => {
  const { container } = render(<App />);
  fireEvent.change(screen.getByTestId('search'), { target: { value: 'LIS' } });
  const items = container.querySelectorAll('ul > li');
  expect(items.length).toBe(1);
  expect(items[0]).toHaveTextContent('Lisbon');
});

test('no matches renders an empty list', () => {
  const { container } = render(<App />);
  fireEvent.change(screen.getByTestId('search'), { target: { value: 'zzz' } });
  expect(container.querySelectorAll('ul > li').length).toBe(0);
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const cities = ['London', 'Paris', 'Lisbon', 'Berlin', 'Madrid', 'Lyon'];
  // @endlock

  const [query, setQuery] = useState('');

  const visible = cities.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <input
        data-testid="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {visible.map((city) => (
          <li key={city}>{city}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Walkthrough

1. The search box is a controlled input — its text lives in `query` state.
2. Deriving `visible` during render keeps the displayed list in sync with the query — no separate "filtered" state is needed.
3. Lowercasing both sides makes the match case-insensitive; `.includes()` does a substring test.
4. Mapping the filtered array (not the original) renders only the matching `<li>` elements.
