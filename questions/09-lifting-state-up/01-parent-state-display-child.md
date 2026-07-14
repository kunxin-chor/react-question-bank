---
title: Parent State, Display Child
---

## Requirements

Build a small app where the parent component controls the data, and the child component only displays it.

The app should start by showing the word **Hello** in two places:

- in a textbox inside `App`
- in the `Display` component below it

When the user types something new into the textbox, the text shown by `Display` should change immediately.

For example:

- At first, the textbox contains `Hello`, and `Display` shows `Hello`.
- If the user changes the textbox to `React state`, then `Display` should show `React state`.

> **Hint:** the state stays in `App`; `Display` only receives and renders the value through props.

## Files

```jsx file=App.jsx default
import { useState } from 'react';
import Display from './Display.jsx';

export default function App() {
  // declare message state here

  return (
    <div>
      <input data-testid="message-input" type="text" />
      <Display />
    </div>
  );
}
```

```jsx file=Display.jsx
export default function Display(props) {
  return <p data-testid="display">{/* show the message here */}</p>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows the initial message in the display component', () => {
  render(<App />);
  expect(screen.getByTestId('display')).toHaveTextContent('Hello');
});

test('typing in the App textbox updates the Display component', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('message-input'), { target: { value: 'React state' } });
  expect(screen.getByTestId('message-input').value).toBe('React state');
  expect(screen.getByTestId('display')).toHaveTextContent('React state');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';
import Display from './Display.jsx';

export default function App() {
  const [message, setMessage] = useState('Hello');

  return (
    <div>
      <input
        data-testid="message-input"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Display message={message} />
    </div>
  );
}
```

```jsx file=Display.jsx
export default function Display(props) {
  return <p data-testid="display">{props.message}</p>;
}
```

## Walkthrough

1. Create a state variable named `message` in `App`, starting with `"Hello"`. The `message` state lives in `App`, so `App` is the source of truth.
2. Make the textbox (`data-testid="message-input"`) controlled by `message`.
3. Update `message` whenever the user types with `onChange={(e) => setMessage(e.target.value)}`.
4. Pass `message` from `App` into `Display` as a prop.
5. In `Display`, render that prop inside an element with `data-testid="display"`.
6. When `message` changes, `App` re-renders and `Display` receives the latest value.
