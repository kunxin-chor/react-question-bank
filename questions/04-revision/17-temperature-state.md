---
title: A First State Variable — Temperature
---

## Requirements

Define a state variable named `temperature` with an initial value of `25`, and display it inside the `<span>` element.

> **Hint:** `useState` is already imported.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <p>
      Current: <span data-testid="temp"></span>°C
    </p>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('renders the initial temperature of 25', () => {
  render(<App />);
  expect(screen.getByTestId('temp')).toHaveTextContent('25');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [temperature] = useState(25);

  return (
    <p>
      Current: <span data-testid="temp">{temperature}</span>°C
    </p>
  );
}
```

## Walkthrough

1. `useState(25)` returns a pair: the current value and a setter. We only read the value here.
2. Array destructuring `const [temperature]` keeps just the first slot.
3. Inside JSX, `{temperature}` interpolates the state value as text.
