---
title: Render an Array of Objects
---

## Requirements

The `App` component has a locked array `users` already defined for you. Each user is an object with a `name` and `email`.

For each user, render a `<div>` with the class `user-row` containing exactly two children, in this order:

- A `<span>` with the class `user-name` showing the user's `name`.
- A `<span>` with the class `user-email` showing the user's `email`.

Bootstrap 5.3 is already imported — feel free to use it for layout, but the structure above is what the tests check for.

The end result should look and be structured like this:

```html-preview height=260
<div class="container py-3">
  <h2>Users</h2>
  <div class="user-row d-flex gap-3 py-2 border-bottom">
    <span class="user-name fw-bold">Alice</span>
    <span class="user-email text-muted">alice@example.com</span>
  </div>
  <div class="user-row d-flex gap-3 py-2 border-bottom">
    <span class="user-name fw-bold">Bob</span>
    <span class="user-email text-muted">bob@example.com</span>
  </div>
  <div class="user-row d-flex gap-3 py-2 border-bottom">
    <span class="user-name fw-bold">Carol</span>
    <span class="user-email text-muted">carol@example.com</span>
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
  const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Carol', email: 'carol@example.com' },
  ];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Users</h2>
      {/* render one .user-row per user */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders one .user-row per user', () => {
  const { container } = render(<App />);
  const rows = container.querySelectorAll('.user-row');
  expect(rows.length).toBe(3);
});

test('each row has a .user-name and .user-email with correct text', () => {
  const { container } = render(<App />);
  const rows = container.querySelectorAll('.user-row');
  const expected = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Carol', email: 'carol@example.com' },
  ];
  expected.forEach((u, i) => {
    const name = rows[i].querySelector('.user-name');
    const email = rows[i].querySelector('.user-email');
    expect(name).toHaveTextContent(u.name);
    expect(email).toHaveTextContent(u.email);
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
  const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Carol', email: 'carol@example.com' },
  ];
  // @endlock

  return (
    <div className="container py-3">
      <h2>Users</h2>
      {users.map((user) => (
        <div key={user.email} className="user-row d-flex gap-3 py-2 border-bottom">
          <span className="user-name fw-bold">{user.name}</span>
          <span className="user-email text-muted">{user.email}</span>
        </div>
      ))}
    </div>
  );
}
```

## Walkthrough

1. Mapping over an array of objects works the same way as mapping over strings — the callback just receives an object.
2. You can pull fields off the object using dot access (`user.name`) or destructuring in the callback parameter list.
3. Because each object has a unique `email`, that's a stable choice for `key`. Avoid using the array index when items can be reordered.
4. Bootstrap utility classes like `d-flex`, `gap-3`, and `border-bottom` style the row without any custom CSS.
