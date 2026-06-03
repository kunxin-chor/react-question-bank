---
title: A Controlled Input
---

## Requirements

Build a single controlled textbox from scratch:

1. A state variable named `title` that starts as an empty string.
2. An `<input type="text" data-testid="title-input">` whose `value` is bound to `title` and whose `onChange` updates `title`.
3. A `<p data-testid="preview">` that shows `Preview: <title>`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // build everything here
  return null;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts empty', () => {
  render(<App />);
  expect(screen.getByTestId('title-input').value).toBe('');
  expect(screen.getByTestId('preview')).toHaveTextContent('Preview:');
});

test('typing updates the input and the preview', () => {
  render(<App />);
  const input = screen.getByTestId('title-input');
  fireEvent.change(input, { target: { value: 'Hello' } });
  expect(input.value).toBe('Hello');
  expect(screen.getByTestId('preview')).toHaveTextContent('Preview: Hello');
});

test('input is controlled (value reflects state)', () => {
  render(<App />);
  const input = screen.getByTestId('title-input');
  fireEvent.change(input, { target: { value: 'Draft' } });
  expect(input.value).toBe('Draft');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [title, setTitle] = useState('');

  return (
    <div>
      <input
        data-testid="title-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <p data-testid="preview">Preview: {title}</p>
    </div>
  );
}
```

## Walkthrough

1. A controlled input ties `value` to state and writes back through `onChange`.
2. `e.target.value` is always the input's current text — pass it straight to the setter.
3. The preview re-renders automatically because it interpolates the same `title` state.
