---
title: Reveal a Hidden Message
---

## Requirements

A `<div data-testid="message">` containing the text `Surprise!` is already on the page, but its inline style sets `visibility: 'hidden'` so the user can't see it. There is also a **Show** button.

Wire up the page so that clicking the **Show** button makes the message visible.

You'll need to:

1. Track the hidden/visible status with a piece of state (a boolean works well).
2. Write the message's `style.visibility` based on that state.
3. Update the state when the button is clicked.

> **Hint — what CSS property?** The CSS [`visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility) property accepts the values `'hidden'` and `'visible'`. Unlike `display: none`, an element with `visibility: hidden` still occupies space — it's just not rendered.
>
> In a JSX style object the property is written as `visibility` (no camelCase change needed) and its value is a string, e.g. `style={{ visibility: 'hidden' }}`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <div>
      <div data-testid="message" style={{ visibility: 'hidden' }}>
        Surprise!
      </div>
      <button>Show</button>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('the message is hidden before the button is clicked', () => {
  render(<App />);
  const msg = screen.getByTestId('message');
  expect(msg.style.visibility).toBe('hidden');
});

test('clicking Show makes the message visible', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Show' }));
  const msg = screen.getByTestId('message');
  expect(msg.style.visibility).toBe('visible');
});

test('the message text is always "Surprise!"', () => {
  render(<App />);
  expect(screen.getByTestId('message')).toHaveTextContent('Surprise!');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [shown, setShown] = useState(false);

  return (
    <div>
      <div
        data-testid="message"
        style={{ visibility: shown ? 'visible' : 'hidden' }}
      >
        Surprise!
      </div>
      <button onClick={() => setShown(true)}>Show</button>
    </div>
  );
}
```

## Walkthrough

1. State (`shown`) models *whether* the message is visible — that's the source of truth React re-renders from.
2. The style object reads from state via a ternary: `shown ? 'visible' : 'hidden'`. Each time `shown` changes, React re-renders with the new style.
3. The button's `onClick` calls `setShown(true)`, which schedules a re-render where the message becomes visible.
4. Using `visibility` (rather than removing the element) means the layout doesn't shift when the message appears — the space was already reserved.
