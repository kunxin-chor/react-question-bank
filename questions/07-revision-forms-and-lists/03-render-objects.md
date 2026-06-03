---
title: Render an Array of Objects
---

## Requirements

The `App` component has a locked array `books` already defined for you. Each book is an object with a `title` and an `author`.

For each book, render a `<div>` with the class `book-row` containing exactly two children, in this order:

- A `<span>` with the class `book-title` showing the book's `title`.
- A `<span>` with the class `book-author` showing the book's `author`.

Give each row a stable `key`.

## Files

```jsx file=App.jsx default
export default function App() {
  // @lock
  const books = [
    { id: 1, title: 'Dune', author: 'Herbert' },
    { id: 2, title: '1984', author: 'Orwell' },
    { id: 3, title: 'Hyperion', author: 'Simmons' },
  ];
  // @endlock

  return (
    <div>
      <h2>Books</h2>
      {/* render one .book-row per book */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders one .book-row per book', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('.book-row').length).toBe(3);
});

test('each row has a .book-title and .book-author with correct text', () => {
  const { container } = render(<App />);
  const rows = container.querySelectorAll('.book-row');
  const expected = [
    { title: 'Dune', author: 'Herbert' },
    { title: '1984', author: 'Orwell' },
    { title: 'Hyperion', author: 'Simmons' },
  ];
  expected.forEach((b, i) => {
    expect(rows[i].querySelector('.book-title')).toHaveTextContent(b.title);
    expect(rows[i].querySelector('.book-author')).toHaveTextContent(b.author);
  });
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  // @lock
  const books = [
    { id: 1, title: 'Dune', author: 'Herbert' },
    { id: 2, title: '1984', author: 'Orwell' },
    { id: 3, title: 'Hyperion', author: 'Simmons' },
  ];
  // @endlock

  return (
    <div>
      <h2>Books</h2>
      {books.map((book) => (
        <div key={book.id} className="book-row">
          <span className="book-title">{book.title}</span>
          <span className="book-author">{book.author}</span>
        </div>
      ))}
    </div>
  );
}
```

## Walkthrough

1. Mapping over objects works like mapping over strings — the callback just receives an object.
2. Read fields with dot access (`book.title`).
3. Each object's unique `id` is a stable `key` — prefer it over the array index.
