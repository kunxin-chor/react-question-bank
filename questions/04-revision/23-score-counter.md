---
title: A Self-Contained Score Counter
---

## Requirements

Build a `Score` component that owns its own state:

1. Internally, hold a state variable named `score` that starts at `0`.
2. Render a `<p data-testid="score">` displaying the current score.
3. Render a button labelled **+5** that increases `score` by 5.
4. Render a button labelled **+10** that increases `score` by 10.
5. Render a button labelled **Reset** that sets `score` back to `0`.

`App` should render an instance of `<Score />`.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export function Score() {
  // build me
}

export default function App() {
  return <Score />;
}
```

## Tests

```js
import App, { Score } from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('score starts at 0', () => {
  render(<Score />);
  expect(screen.getByTestId('score')).toHaveTextContent('0');
});

test('+5 adds 5 to the score', () => {
  render(<Score />);
  fireEvent.click(screen.getByRole('button', { name: '+5' }));
  fireEvent.click(screen.getByRole('button', { name: '+5' }));
  expect(screen.getByTestId('score')).toHaveTextContent('10');
});

test('+10 adds 10 to the score', () => {
  render(<Score />);
  fireEvent.click(screen.getByRole('button', { name: '+10' }));
  expect(screen.getByTestId('score')).toHaveTextContent('10');
});

test('Reset returns the score to 0', () => {
  render(<Score />);
  fireEvent.click(screen.getByRole('button', { name: '+10' }));
  fireEvent.click(screen.getByRole('button', { name: '+5' }));
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByTestId('score')).toHaveTextContent('0');
});

test('App renders a Score', () => {
  render(<App />);
  expect(screen.getByTestId('score')).toHaveTextContent('0');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export function Score() {
  const [score, setScore] = useState(0);

  return (
    <div>
      <p data-testid="score">{score}</p>
      <button onClick={() => setScore(score + 5)}>+5</button>
      <button onClick={() => setScore(score + 10)}>+10</button>
      <button onClick={() => setScore(0)}>Reset</button>
    </div>
  );
}

export default function App() {
  return <Score />;
}
```

## Walkthrough

1. State and the buttons that change it can live entirely inside a child component — `App` doesn't need to know about `score`.
2. Each button calls `setScore` with a different value (current + 5, current + 10, or `0`).
3. Each instance of `<Score />` would get its own independent state, even if you rendered several side by side.
