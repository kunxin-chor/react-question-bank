---
title: Render a Bootstrap List Group
---

## Requirements

The `App` component has a locked array `cities` already defined for you.

Render the cities as a Bootstrap **list group**. The outer element should be a `<ul>` with the class `list-group`, and each city should appear as an `<li>` with the class `list-group-item`.

Bootstrap 5.3 is already imported for you.

The end result should look and be structured like this:

```html-preview height=300
<div class="container py-3">
  <h2>Cities</h2>
  <ul class="list-group">
    <li class="list-group-item">Singapore</li>
    <li class="list-group-item">Tokyo</li>
    <li class="list-group-item">Paris</li>
    <li class="list-group-item">New York</li>
    <li class="list-group-item">Sydney</li>
  </ul>
</div>
```

## Files

```jsx file=App.jsx default
// @lock
import 'bootstrap/dist/css/bootstrap.min.css';
// @endlock

export default function App() {
  // @lock
  const cities = ['Singapore', 'Tokyo', 'Paris', 'New York', 'Sydney'];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Cities</h2>
      {/* render the list group here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders a <ul> with class list-group', () => {
  const { container } = render(<App />);
  const ul = container.querySelector('ul.list-group');
  expect(ul).toBeTruthy();
});

test('renders one list-group-item per city', () => {
  const { container } = render(<App />);
  const items = container.querySelectorAll('ul.list-group > li.list-group-item');
  expect(items.length).toBe(5);
});

test('each item contains the matching city name', () => {
  const { container } = render(<App />);
  const items = container.querySelectorAll('ul.list-group > li.list-group-item');
  const expected = ['Singapore', 'Tokyo', 'Paris', 'New York', 'Sydney'];
  expected.forEach((name, i) => {
    expect(items[i]).toHaveTextContent(name);
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
  const cities = ['Singapore', 'Tokyo', 'Paris', 'New York', 'Sydney'];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Cities</h2>
      <ul className="list-group">
        {cities.map((city) => (
          <li key={city} className="list-group-item">
            {city}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Walkthrough

1. The structure is identical to a plain `<ul>` of `<li>`s — Bootstrap styling is purely a matter of class names.
2. `list-group` on the parent and `list-group-item` on each child give you the boxed, divided look.
3. As before, `.map()` lets you generate one `<li>` per array entry.
