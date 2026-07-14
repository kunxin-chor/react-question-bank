---
title: Shared Array State and Total
---

## Requirements

Build an app with four components: `App`, `NumberInput`, `NumberList`, and `NumberTotal`.

1. `App` owns an array state variable named `numbers` that starts as `[2, 4, 6]`.
2. `App` also owns a textbox state variable named `draft` that starts as an empty string.
3. `NumberInput` renders a controlled textbox (`data-testid="number-input"`) and an **Add** button (`data-testid="add-number"`).
4. Typing in `NumberInput` updates `draft` in `App`.
5. Clicking **Add** converts `draft` to a number, appends it to `numbers`, and clears the textbox. Ignore empty input and non-numeric input.
6. `NumberList` displays the current numbers in a `<ul data-testid="number-list">`, one `<li>` per number.
7. `NumberTotal` displays the total of all numbers in an element with `data-testid="number-total"`.

> **Hint:** `NumberList` and `NumberTotal` both receive the same `numbers` array from `App`, but they render different derived views of it.

## Files

```jsx file=App.jsx default
import { useState } from 'react';
import NumberInput from './NumberInput.jsx';
import NumberList from './NumberList.jsx';
import NumberTotal from './NumberTotal.jsx';

export default function App() {
  // declare numbers and draft state here

  const addNumber = () => {
    // validate draft, append the number, and clear draft
  };

  return (
    <div>
      <NumberInput />
      <NumberList />
      <NumberTotal />
    </div>
  );
}
```

```jsx file=NumberInput.jsx
export default function NumberInput(props) {
  return (
    <div>
      <input data-testid="number-input" type="text" />
      <button data-testid="add-number">Add</button>
    </div>
  );
}
```

```jsx file=NumberList.jsx
export default function NumberList(props) {
  return <ul data-testid="number-list">{/* render numbers here */}</ul>;
}
```

```jsx file=NumberTotal.jsx
export default function NumberTotal(props) {
  return <p data-testid="number-total">{/* render total here */}</p>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows the initial numbers and total', () => {
  const { container } = render(<App />);
  const items = container.querySelectorAll('ul[data-testid="number-list"] > li');
  expect(items.length).toBe(3);
  expect(items[0]).toHaveTextContent('2');
  expect(items[1]).toHaveTextContent('4');
  expect(items[2]).toHaveTextContent('6');
  expect(screen.getByTestId('number-total')).toHaveTextContent('12');
});

test('typing in the input updates the controlled textbox', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('number-input'), { target: { value: '8' } });
  expect(screen.getByTestId('number-input').value).toBe('8');
});

test('adding a number updates both list and total', () => {
  const { container } = render(<App />);
  fireEvent.change(screen.getByTestId('number-input'), { target: { value: '8' } });
  fireEvent.click(screen.getByTestId('add-number'));
  const items = container.querySelectorAll('ul[data-testid="number-list"] > li');
  expect(items.length).toBe(4);
  expect(items[3]).toHaveTextContent('8');
  expect(screen.getByTestId('number-total')).toHaveTextContent('20');
  expect(screen.getByTestId('number-input').value).toBe('');
});

test('ignores empty and non-numeric input', () => {
  const { container } = render(<App />);
  fireEvent.change(screen.getByTestId('number-input'), { target: { value: '' } });
  fireEvent.click(screen.getByTestId('add-number'));
  fireEvent.change(screen.getByTestId('number-input'), { target: { value: 'abc' } });
  fireEvent.click(screen.getByTestId('add-number'));
  expect(container.querySelectorAll('ul[data-testid="number-list"] > li').length).toBe(3);
  expect(screen.getByTestId('number-total')).toHaveTextContent('12');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';
import NumberInput from './NumberInput.jsx';
import NumberList from './NumberList.jsx';
import NumberTotal from './NumberTotal.jsx';

export default function App() {
  const [numbers, setNumbers] = useState([2, 4, 6]);
  const [draft, setDraft] = useState('');

  const addNumber = () => {
    if (draft.trim() === '') return;
    const nextNumber = Number(draft);
    if (Number.isNaN(nextNumber)) return;
    setNumbers([...numbers, nextNumber]);
    setDraft('');
  };

  return (
    <div>
      <NumberInput
        draft={draft}
        onDraftChange={setDraft}
        onAddNumber={addNumber}
      />
      <NumberList numbers={numbers} />
      <NumberTotal numbers={numbers} />
    </div>
  );
}
```

```jsx file=NumberInput.jsx
export default function NumberInput(props) {
  return (
    <div>
      <input
        data-testid="number-input"
        type="text"
        value={props.draft}
        onChange={(e) => props.onDraftChange(e.target.value)}
      />
      <button data-testid="add-number" onClick={props.onAddNumber}>
        Add
      </button>
    </div>
  );
}
```

```jsx file=NumberList.jsx
export default function NumberList(props) {
  return (
    <ul data-testid="number-list">
      {props.numbers.map((number, index) => (
        <li key={index}>{number}</li>
      ))}
    </ul>
  );
}
```

```jsx file=NumberTotal.jsx
export default function NumberTotal(props) {
  const total = props.numbers.reduce((sum, number) => sum + number, 0);
  return <p data-testid="number-total">{total}</p>;
}
```

## Walkthrough

1. `numbers` and `draft` both live in `App`, because multiple child components need to coordinate around them.
2. `NumberInput` receives `draft`, `onDraftChange`, and `onAddNumber`. It displays the current draft and asks `App` to update or add numbers.
3. `addNumber` validates the text, converts it with `Number(draft)`, appends using `[...numbers, nextNumber]`, and clears the textbox.
4. `NumberList` receives the shared `numbers` array and maps it into list items.
5. `NumberTotal` receives the same `numbers` array but derives a total with `.reduce()`.
6. When a number is added, `App` state changes once, then both display components re-render from the same updated array.
