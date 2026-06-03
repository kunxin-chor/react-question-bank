---
title: Remove Items From a List
---

## Requirements

The `App` component starts with a locked initial array `initialTasks`. Build a removable list:

1. A state variable named `tasks` initialised from `initialTasks` (each task has an `id` and a `label`).
2. Render one row per task. Each row shows the task's `label` and a **Remove** button with `data-testid="remove-<id>"`.
3. Clicking a row's **Remove** button deletes only that task from `tasks`.

> **Hint:** use `.filter()` to build a new array that excludes the removed id.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const initialTasks = [
    { id: 1, label: 'Wash dishes' },
    { id: 2, label: 'Walk dog' },
    { id: 3, label: 'Pay bills' },
  ];
  // @endlock

  // declare your state here

  return (
    <ul>
      {/* render one row per task */}
    </ul>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('renders all tasks initially', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('li').length).toBe(3);
});

test('removing a task deletes only that row', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByTestId('remove-2'));
  const items = container.querySelectorAll('li');
  expect(items.length).toBe(2);
  const text = container.textContent || '';
  expect(text.indexOf('Walk dog')).toBe(-1);
  expect(text.indexOf('Wash dishes') !== -1).toBeTruthy();
  expect(text.indexOf('Pay bills') !== -1).toBeTruthy();
});

test('removing all tasks leaves an empty list', () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByTestId('remove-1'));
  fireEvent.click(screen.getByTestId('remove-2'));
  fireEvent.click(screen.getByTestId('remove-3'));
  expect(container.querySelectorAll('li').length).toBe(0);
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const initialTasks = [
    { id: 1, label: 'Wash dishes' },
    { id: 2, label: 'Walk dog' },
    { id: 3, label: 'Pay bills' },
  ];
  // @endlock

  const [tasks, setTasks] = useState(initialTasks);

  const remove = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.label}
          <button data-testid={`remove-${task.id}`} onClick={() => remove(task.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Walkthrough

1. `useState(initialTasks)` seeds the list state from the locked array; from then on `tasks` is the source of truth.
2. `remove(id)` builds a **new** array with `.filter()` that keeps every task except the one whose `id` matches — never mutate the existing array.
3. Wrapping the call in an arrow (`onClick={() => remove(task.id)}`) captures the correct `id` for each row without firing immediately.
4. Stable `key={task.id}` lets React track rows correctly as items are removed.
