---
title: Your First Click Handler
---

## Requirements

The state and the button are already provided and **locked**. Wire up the button so that clicking it updates the state to the string `I'm clicked!`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [message, setMessage] = useState('Click the button');
  // @endlock

  return (
    <div>
      <p data-testid="message">{message}</p>
      <button>Click me</button>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows the initial message before clicking', () => {
  render(<App />);
  expect(screen.getByTestId('message')).toHaveTextContent('Click the button');
});

test('clicking the button updates the message', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Click me' }));
  expect(screen.getByTestId('message')).toHaveTextContent("I'm clicked!");
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [message, setMessage] = useState('Click the button');
  // @endlock

  return (
    <div>
      <p data-testid="message">{message}</p>
      <button onClick={() => setMessage("I'm clicked!")}>Click me</button>
    </div>
  );
}
```

## Walkthrough

1. React event handlers are passed as props that start with `on`, e.g. `onClick`.
2. The value must be a *function* — usually an arrow function so it doesn't run until clicked.
3. Calling the setter (`setMessage`) tells React to re-render with the new state.
