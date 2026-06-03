---
title: Render an Array as a List
---

## Requirements

The `App` component has a locked array `languages` already defined for you.

Render the contents of `languages` as an unordered list (`<ul>`) where each language appears as its own `<li>`. Use `.map()` and give each item a stable `key`.

## Files

```jsx file=App.jsx default
export default function App() {
  // @lock
  const languages = ['JavaScript', 'Python', 'Rust', 'Go'];
  // @endlock

  return (
    <div>
      <h2>Languages</h2>
      {/* render the unordered list here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render } from './__rtl__.js';

test('renders a single <ul>', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('ul').length).toBe(1);
});

test('renders one <li> per language', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('ul > li').length).toBe(4);
});

test('each <li> contains the matching language name', () => {
  const { container } = render(<App />);
  const items = container.querySelectorAll('ul > li');
  ['JavaScript', 'Python', 'Rust', 'Go'].forEach((name, i) => {
    expect(items[i]).toHaveTextContent(name);
  });
});
```

## Solution

```jsx file=App.jsx
export default function App() {
  // @lock
  const languages = ['JavaScript', 'Python', 'Rust', 'Go'];
  // @endlock

  return (
    <div>
      <h2>Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Walkthrough

1. `.map()` turns each string into a `<li>`, producing a new array of JSX nodes.
2. React renders an array of elements inline when you embed it with `{...}`.
3. For a static list of unique strings, the string itself is a fine `key`.
