---
title: Bind a Field's Value to State
---

## Requirements

The state variable `country` and an `<input>` are already provided. You may not change the state declaration, but you must add the `value` attribute to the textbox so its displayed text always equals the current value of `country`.

When the component first renders, the textbox should already show the string `Japan` (the initial value of `country`).

> **Note:** you do *not* need to add an `onChange` handler in this question — just bind the value.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [country, setCountry] = useState('Japan');
  // @endlock

  return (
    <div>
      <input data-testid="country-input" />
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen } from './__rtl__.js';

test('the textbox initially displays the state value', () => {
  render(<App />);
  expect(screen.getByTestId('country-input').value).toBe('Japan');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [country, setCountry] = useState('Japan');
  // @endlock

  return (
    <div>
      <input data-testid="country-input" value={country} onChange={() => {}} />
    </div>
  );
}
```

## Walkthrough

1. Setting `value={country}` makes this a *controlled* input — its displayed text is driven entirely by React state.
2. React warns if you set `value` without `onChange`, so we pass an empty handler `() => {}` to silence the warning. The next question wires up a real handler.
3. Because `country` starts as `'Japan'`, the textbox renders with that text already in it.
