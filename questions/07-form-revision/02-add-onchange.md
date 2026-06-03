---
title: Add an onChange Handler
---

## Requirements

The state variable `city` and the `<input>` are already wired up: the input's `value` is bound to `city`. However, typing into the textbox currently does nothing because there's no `onChange` handler.

Add an `onChange` handler to the `<input>` that updates `city` to whatever the user just typed.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  const [city, setCity] = useState('');

  return (
    <div>
      <input data-testid="city-input" value={city} />
      <p data-testid="display">Welcome to {city}</p>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('typing into the textbox updates the display', () => {
  render(<App />);
  const input = screen.getByTestId('city-input');
  fireEvent.change(input, { target: { value: 'Osaka' } });
  expect(input.value).toBe('Osaka');
  expect(screen.getByTestId('display')).toHaveTextContent('Welcome to Osaka');
});

test('clearing the textbox clears the city', () => {
  render(<App />);
  const input = screen.getByTestId('city-input');
  fireEvent.change(input, { target: { value: 'Kyoto' } });
  fireEvent.change(input, { target: { value: '' } });
  expect(screen.getByTestId('display')).toHaveTextContent('Welcome to');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [city, setCity] = useState('');

  return (
    <div>
      <input
        data-testid="city-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <p data-testid="display">Welcome to {city}</p>
    </div>
  );
}
```

## Walkthrough

1. The `onChange` event fires every time the input's value changes — typing one character fires it once.
2. The event object `e` exposes the new value at `e.target.value`.
3. Calling `setCity(e.target.value)` updates state, which triggers a re-render where `value={city}` shows the new text.
