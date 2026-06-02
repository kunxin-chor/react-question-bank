---
title: Hide a Visible Message
---

## Requirements

A `<div data-testid="message">` containing the text `Click hide to dismiss` is already on the page and is **visible**. There is also a **Hide** button.

Wire up the page so that clicking the **Hide** button hides the message (but keeps the element in the DOM and keeps its layout space).

You'll need to:

1. Track the visible/hidden status with a piece of state (a boolean works well).
2. Drive the message's `style.visibility` from that state.
3. Update the state when the button is clicked.

> **Hint — what CSS property?** The CSS [`visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility) property accepts `'visible'` and `'hidden'`. Unlike `display: none`, an element with `visibility: hidden` still occupies space. In a JSX style object the property is written as `visibility` (no camelCase change).

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <div>
      <div data-testid="message" style={{ visibility: 'visible' }}>
        Click hide to dismiss
      </div>
      <button>Hide</button>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('the message is visible before the button is clicked', () => {
  render(<App />);
  expect(screen.getByTestId('message').style.visibility).toBe('visible');
});

test('clicking Hide hides the message', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
  expect(screen.getByTestId('message').style.visibility).toBe('hidden');
});

test('the message text stays the same', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
  expect(screen.getByTestId('message')).toHaveTextContent('Click hide to dismiss');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <div
        data-testid="message"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      >
        Click hide to dismiss
      </div>
      <button onClick={() => setVisible(false)}>Hide</button>
    </div>
  );
}
```

## Walkthrough

1. State (`visible`) is the source of truth; the style is **derived** from it on every render.
2. The button doesn't touch the DOM directly — it flips `visible` to `false`, and React re-renders the message with the updated style.
3. Because we use `visibility` and not `display: none`, the message still occupies its row — clicking Hide doesn't cause the layout below to jump up.
