---
title: Custom Hook for a Counter
---

## Requirements

An atom named `counterAtom` has already been created for you in `atoms.js`, starting at `0`. `App.jsx` is already implemented and locked — it calls a custom hook named `useCounter` and expects it to return `[count, increment, decrement]`.

Your job is to finish `useCounter.js` so that it wraps `useAtom(counterAtom)` and returns:

1. `count` — the current number.
2. `increment` — a function that adds `1` to the counter.
3. `decrement` — a function that subtracts `1` from the counter.

For example:

- At first, the page shows `0`.
- After clicking **+1** once, it shows `1`.
- After clicking **-1** once, it shows `0` again.

To do this:

1. Import `useAtom` from `jotai`.
2. Import `counterAtom` from `./atoms.js`.
3. Inside `useCounter`, call `useAtom(counterAtom)` to get `count` and `setCount`.
4. Return `[count, increment, decrement]`, where `increment` and `decrement` call `setCount` with the updater form.

## Files

```jsx file=atoms.js
import { atom } from 'jotai';

export const counterAtom = atom(0);
```

```jsx file=useCounter.js
export function useCounter() {
  // TODO: use useAtom(counterAtom) and return [count, increment, decrement].
}
```

```jsx file=App.jsx default
import { useCounter } from './useCounter.js';

// @lock
export default function App() {
  const [count, increment, decrement] = useCounter();

  return (
    <div>
      <p data-testid="count-display">{count}</p>
      <button data-testid="increment" onClick={increment}>
        +1
      </button>
      <button data-testid="decrement" onClick={decrement}>
        -1
      </button>
    </div>
  );
}
// @endlock
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('starts at 0', () => {
  render(<App />);
  expect(screen.getByTestId('count-display')).toHaveTextContent('0');
});

test('increment and decrement update the count', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('increment'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('1');
  fireEvent.click(screen.getByTestId('increment'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('2');
  fireEvent.click(screen.getByTestId('decrement'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('1');
});
```

## Solution

```jsx file=atoms.js
import { atom } from 'jotai';

export const counterAtom = atom(0);
```

```jsx file=useCounter.js
import { useAtom } from 'jotai';
import { counterAtom } from './atoms.js';

export function useCounter() {
  const [count, setCount] = useAtom(counterAtom);
  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  return [count, increment, decrement];
}
```

```jsx file=App.jsx
import { useCounter } from './useCounter.js';

export default function App() {
  const [count, increment, decrement] = useCounter();

  return (
    <div>
      <p data-testid="count-display">{count}</p>
      <button data-testid="increment" onClick={increment}>
        +1
      </button>
      <button data-testid="decrement" onClick={decrement}>
        -1
      </button>
    </div>
  );
}
```

## Walkthrough

1. `useCounter` is a custom hook that internally calls `useAtom(counterAtom)`, exactly the same as any other custom hook that wraps `useState`.
2. `increment` and `decrement` both use the updater form of `setCount`, so they always act on the latest value instead of a possibly-stale closure value.
3. `App.jsx` never imports anything from `jotai` — it only knows about `useCounter`, which fully hides how the state is stored.
4. Because `counterAtom` lives outside the hook, in `atoms.js`, any other component elsewhere in the app could also read or write the same counter, either directly with Jotai's hooks or through `useCounter`.
