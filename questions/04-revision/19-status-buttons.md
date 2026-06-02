---
title: Three Buttons, One Status
---

## Requirements

Build a small status display with three buttons:

1. A state variable named `status` that starts as the string `idle`.
2. A `<p data-testid="status">` that shows the current value of `status`.
3. Three buttons labelled **Play**, **Pause**, and **Stop**. Clicking each one must set `status` to its corresponding lowercase verb (`'play'`, `'pause'`, `'stop'`).

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  return (
    <div>
      {/* render the status display and three buttons here */}
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts in the idle state', () => {
  render(<App />);
  expect(screen.getByTestId('status')).toHaveTextContent('idle');
});

test('clicking Play sets status to "play"', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  expect(screen.getByTestId('status')).toHaveTextContent('play');
});

test('clicking Pause sets status to "pause"', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  expect(screen.getByTestId('status')).toHaveTextContent('pause');
});

test('clicking Stop after Play sets status to "stop"', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
  expect(screen.getByTestId('status')).toHaveTextContent('stop');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('idle');

  return (
    <div>
      <p data-testid="status">{status}</p>
      <button onClick={() => setStatus('play')}>Play</button>
      <button onClick={() => setStatus('pause')}>Pause</button>
      <button onClick={() => setStatus('stop')}>Stop</button>
    </div>
  );
}
```

## Walkthrough

1. Multiple buttons can all update the **same** state variable, each one setting it to a different value.
2. Each `onClick` is an independent function — the buttons don't know about each other; they just call the setter with their own argument.
3. React re-renders the `<p>` whenever `status` changes, so the display always reflects the latest click.
