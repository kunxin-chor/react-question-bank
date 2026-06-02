---
title: Random Emoji Picker
---

## Requirements

A `Picker` component is partially built: it renders a `<span data-testid="emoji">` displaying the currently selected emoji, plus a **Pick** button.

Your job:

1. Add a state variable named `emoji` that holds the current selection. Start it at the string `'🙂'`.
2. Wire the **Pick** button so that clicking it sets `emoji` to a random element of the locked `emojis` array.
3. Display `emoji` inside the `<span data-testid="emoji">`.

> **Hint:** for a random index, use `Math.floor(Math.random() * emojis.length)`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export function Picker() {
  // declare your state here

  // @lock
  const emojis = ['🙂', '😎', '🥳', '🤔', '🚀', '🎉'];
  // @endlock

  return (
    <div>
      <span data-testid="emoji">{/* display emoji here */}</span>
      <button>Pick</button>
    </div>
  );
}

export default function App() {
  return <Picker />;
}
```

## Tests

```js
import App, { Picker } from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

const EMOJIS = ['🙂', '😎', '🥳', '🤔', '🚀', '🎉'];

test('picker starts showing 🙂', () => {
  render(<Picker />);
  expect(screen.getByTestId('emoji')).toHaveTextContent('🙂');
});

test('clicking Pick selects one of the locked emojis', () => {
  render(<Picker />);
  for (let i = 0; i < 20; i++) {
    fireEvent.click(screen.getByRole('button', { name: 'Pick' }));
    const text = screen.getByTestId('emoji').textContent.trim();
    expect(EMOJIS.indexOf(text) !== -1).toBeTruthy();
  }
});

test('clicking Pick can produce any emoji in the array', () => {
  const orig = Math.random;
  try {
    render(<Picker />);
    const btn = screen.getByRole('button', { name: 'Pick' });

    // Force the last index.
    Math.random = () => (EMOJIS.length - 1) / EMOJIS.length;
    fireEvent.click(btn);
    expect(screen.getByTestId('emoji')).toHaveTextContent(EMOJIS[EMOJIS.length - 1]);

    // Force the first index.
    Math.random = () => 0;
    fireEvent.click(btn);
    expect(screen.getByTestId('emoji')).toHaveTextContent(EMOJIS[0]);
  } finally {
    Math.random = orig;
  }
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export function Picker() {
  const [emoji, setEmoji] = useState('🙂');

  // @lock
  const emojis = ['🙂', '😎', '🥳', '🤔', '🚀', '🎉'];
  // @endlock

  const pick = () => {
    const next = emojis[Math.floor(Math.random() * emojis.length)];
    setEmoji(next);
  };

  return (
    <div>
      <span data-testid="emoji">{emoji}</span>
      <button onClick={pick}>Pick</button>
    </div>
  );
}

export default function App() {
  return <Picker />;
}
```

## Walkthrough

1. The state holds the *current* emoji; clicking Pick replaces it with a fresh random choice.
2. `Math.random() * emojis.length` gives a number in `[0, length)`; `Math.floor` turns it into a valid integer index.
3. Defining the array inside the component keeps the data co-located with the UI that uses it. Marking it `@lock` makes sure the tests can rely on the exact contents.
