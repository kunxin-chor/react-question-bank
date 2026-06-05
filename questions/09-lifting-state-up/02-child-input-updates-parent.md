---
title: Child Input Updates Parent State
---

## Requirements

Build a small app with two components: `App` and `NameInput`.

1. `App` owns a state variable named `name` that starts as `"Ada"`.
2. `App` displays the current `name` in an element with `data-testid="app-display"`.
3. `App` renders a `NameInput` component.
4. `NameInput` renders a controlled textbox (`data-testid="name-input"`) whose value comes from `App`.
5. Typing in the textbox inside `NameInput` updates the state in `App`.

> **Hint:** pass both the value and a callback/setter from `App` to `NameInput`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

function NameInput(props) {
  return <input data-testid="name-input" type="text" />;
}

export default function App() {
  // declare name state here

  return (
    <div>
      <p data-testid="app-display">{/* show the name here */}</p>
      <NameInput />
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows the initial state in App and in the child input', () => {
  render(<App />);
  expect(screen.getByTestId('app-display')).toHaveTextContent('Ada');
  expect(screen.getByTestId('name-input').value).toBe('Ada');
});

test('typing in the child input updates App state', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Grace' } });
  expect(screen.getByTestId('name-input').value).toBe('Grace');
  expect(screen.getByTestId('app-display')).toHaveTextContent('Grace');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

function NameInput(props) {
  return (
    <input
      data-testid="name-input"
      type="text"
      value={props.name}
      onChange={(e) => props.onNameChange(e.target.value)}
    />
  );
}

export default function App() {
  const [name, setName] = useState('Ada');

  return (
    <div>
      <p data-testid="app-display">{name}</p>
      <NameInput name={name} onNameChange={setName} />
    </div>
  );
}
```

## Walkthrough

1. The `name` state is still owned by `App`, even though the textbox lives in `NameInput`.
2. `App` passes the current `name` down as `props.name` so the child can display it.
3. `App` also passes `setName` down as `props.onNameChange` so the child can request a state update.
4. When the child input changes, it calls `props.onNameChange(e.target.value)`, updating `App` state and re-rendering both places.
