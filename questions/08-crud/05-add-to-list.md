---
title: Add Items to a List
---

## Requirements

Build a simple "to-do" entry form backed by a list:

1. A state variable named `items` that starts as an **empty array**.
2. A state variable named `text` for the controlled `<input data-testid="new-item">`.
3. An **Add** button (`data-testid="add"`). When clicked, it appends the current `text` to `items` **and** clears the textbox. Do **not** add empty/whitespace-only text.
4. A `<ul>` rendering one `<li>` per item, in the order they were added.

> **Hint:** create a new array with `[...items, text]` rather than mutating the old one.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <div>
      <input data-testid="new-item" type="text" />
      <button data-testid="add">Add</button>
      <ul>
        {/* render the items here */}
      </ul>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

function addItem(value) {
  fireEvent.change(screen.getByTestId('new-item'), { target: { value } });
  fireEvent.click(screen.getByTestId('add'));
}

test('starts with an empty list', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('ul > li').length).toBe(0);
});

test('adding an item appends it and clears the input', () => {
  const { container } = render(<App />);
  addItem('Milk');
  const items = container.querySelectorAll('ul > li');
  expect(items.length).toBe(1);
  expect(items[0]).toHaveTextContent('Milk');
  expect(screen.getByTestId('new-item').value).toBe('');
});

test('adds multiple items in order', () => {
  const { container } = render(<App />);
  addItem('Milk');
  addItem('Bread');
  addItem('Eggs');
  const items = container.querySelectorAll('ul > li');
  expect(items.length).toBe(3);
  expect(items[0]).toHaveTextContent('Milk');
  expect(items[1]).toHaveTextContent('Bread');
  expect(items[2]).toHaveTextContent('Eggs');
});

test('ignores empty or whitespace-only input', () => {
  const { container } = render(<App />);
  addItem('');
  addItem('   ');
  expect(container.querySelectorAll('ul > li').length).toBe(0);
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  const add = () => {
    const trimmed = text.trim();
    if (trimmed === '') return;
    setItems([...items, trimmed]);
    setText('');
  };

  return (
    <div>
      <input
        data-testid="new-item"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button data-testid="add" onClick={add}>
        Add
      </button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Walkthrough

1. Two pieces of state cooperate: `text` holds the in-progress entry, `items` holds the committed list.
2. The **Add** handler validates, then builds a **new** array with `[...items, trimmed]` — React detects the change because it's a new reference.
3. Clearing `text` after adding resets the controlled input for the next entry.
4. Because the items are appended and never reordered, the array index is an acceptable `key` here.
