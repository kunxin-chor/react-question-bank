---
title: Bind a Textbox's Value to State
---

## Requirements

The state variable `name` and an `<input>` textbox are already provided and **locked-ish**: you may not change the state declaration, but you must add the `value` attribute to the textbox so its displayed text always equals the current value of `name`.

When the component first renders, the textbox should already show the string `Alice` (the initial value of `name`).

> **Note:** you do *not* need to add an `onChange` handler in this question — just bind the value.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [name, setName] = useState('Alice');
  // @endlock

  return (
    <div>
      <input data-testid="name-input" />
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
  const input = screen.getByTestId('name-input');
  expect(input.value).toBe('Alice');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [name, setName] = useState('Alice');
  // @endlock

  return (
    <div>
      <input data-testid="name-input" value={name} onChange={() => {}} />
    </div>
  );
}
```

## Walkthrough

1. Setting `value={name}` makes this a *controlled* input — its displayed text is driven entirely by React state.
2. React warns if you set `value` without `onChange`, so we pass an empty handler `() => {}` to silence the warning. The next question wires up a real handler.
3. Because `name` starts as `'Alice'`, the textbox renders with that text already in it.
