---
title: Roll a Die
---

## Requirements

A `Dice` component is partially built: it renders a 80×80 `<div>` with the dice face inside, plus a **Roll** button. The styling is locked.

Your job:

1. Add a state variable named `value` that holds the current dice face. Start it at `1`.
2. Wire the **Roll** button so that clicking it sets `value` to a random integer from `1` to `6` (inclusive).
3. Display `value` inside the dice div.
4. Color the displayed number based on the current value:
   - If the value is `1`, the text color must be `red`.
   - If the value is `6`, the text color must be `green`.
   - For any other value, leave the color at the default (`black`).

> **Hint:** `Math.floor(Math.random() * 6) + 1` gives you a random integer from 1 to 6.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export function Dice() {
  // declare your state here

  // @lock
  const wrapperStyle = {
    width: 80,
    height: 80,
    border: '2px solid black',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  };
  // @endlock

  return (
    <div>
      <div data-testid="face" style={{ ...wrapperStyle, color: /* derive from value */ undefined }}>
        {/* display value here */}
      </div>
      <button>Roll</button>
    </div>
  );
}

export default function App() {
  return <Dice />;
}
```

## Tests

```js
import App, { Dice } from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('dice starts showing 1 in red', () => {
  render(<Dice />);
  const face = screen.getByTestId('face');
  expect(face).toHaveTextContent('1');
  expect(face.style.color).toBe('red');
});

test('clicking Roll keeps the value within 1..6 inclusive', () => {
  render(<Dice />);
  for (let i = 0; i < 20; i++) {
    fireEvent.click(screen.getByRole('button', { name: 'Roll' }));
    const text = screen.getByTestId('face').textContent.trim();
    const n = Number(text);
    expect(Number.isInteger(n)).toBeTruthy();
    expect(n >= 1 && n <= 6).toBeTruthy();
  }
});

test('color is green when value is 6, red when 1, black otherwise', () => {
  // Stub Math.random so we control the roll.
  const orig = Math.random;
  try {
    render(<Dice />);
    const face = screen.getByTestId('face');
    const btn = screen.getByRole('button', { name: 'Roll' });

    Math.random = () => 5 / 6; // floor(5) + 1 = 6
    fireEvent.click(btn);
    expect(face).toHaveTextContent('6');
    expect(face.style.color).toBe('green');

    Math.random = () => 0;     // floor(0) + 1 = 1
    fireEvent.click(btn);
    expect(face).toHaveTextContent('1');
    expect(face.style.color).toBe('red');

    Math.random = () => 2.5 / 6; // floor(2.5) + 1 = 3
    fireEvent.click(btn);
    expect(face).toHaveTextContent('3');
    expect(face.style.color).toBe('black');
  } finally {
    Math.random = orig;
  }
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export function Dice() {
  const [value, setValue] = useState(1);

  // @lock
  const wrapperStyle = {
    width: 80,
    height: 80,
    border: '2px solid black',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  };
  // @endlock

  const color = value === 1 ? 'red' : value === 6 ? 'green' : 'black';
  const roll = () => setValue(Math.floor(Math.random() * 6) + 1);

  return (
    <div>
      <div data-testid="face" style={{ ...wrapperStyle, color }}>
        {value}
      </div>
      <button onClick={roll}>Roll</button>
    </div>
  );
}

export default function App() {
  return <Dice />;
}
```

## Walkthrough

1. The state holds the *data* (the current face); the JSX *derives* the color from that data each render.
2. A ternary chain is a tidy way to map a value to one of three outputs.
3. `Math.floor(Math.random() * 6) + 1` rolls a fair die: `Math.random()` returns `[0, 1)`, multiplied by 6 gives `[0, 6)`, the floor gives `0..5`, and `+ 1` shifts to `1..6`.
