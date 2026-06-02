---
title: Click Handler — Change Mood
---

## Requirements

The state and the button are already provided and **locked**. Wire up the button so that clicking it updates the state to the string `excited`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // @lock
  const [mood, setMood] = useState('neutral');
  // @endlock

  return (
    <div>
      <p data-testid="mood">{mood}</p>
      <button>Cheer me up</button>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts with mood "neutral"', () => {
  render(<App />);
  expect(screen.getByTestId('mood')).toHaveTextContent('neutral');
});

test('clicking the button changes mood to "excited"', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Cheer me up' }));
  expect(screen.getByTestId('mood')).toHaveTextContent('excited');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  // @lock
  const [mood, setMood] = useState('neutral');
  // @endlock

  return (
    <div>
      <p data-testid="mood">{mood}</p>
      <button onClick={() => setMood('excited')}>Cheer me up</button>
    </div>
  );
}
```

## Walkthrough

1. The `onClick` prop expects a *function* — usually an arrow function so it only runs on click.
2. Calling `setMood('excited')` schedules a re-render with the new state value.
3. Because the `<p>` interpolates `{mood}`, React redraws it with the new text after the state update.
