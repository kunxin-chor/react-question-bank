---
title: Mini Calculator
---

## Requirements

Build a small calculator. The JSX scaffolding is already in place — including all `data-testid` attributes, the input types, the radio `name`/`value` attributes, and the result div. Your job is to make it work:

1. Add state for the two operands, the chosen operator, and the latest result.
2. Make every form control *controlled* — wire `value`/`checked` to state and add the right `onChange` handlers. Default the operation to `+`.
3. When **Calculate** is pressed, compute `a <op> b` and put the result into the `result` div.

Behaviour:

- The result `<div>` is **empty** until the **Calculate** button is pressed for the first time.
- Each time **Calculate** is pressed, compute the result of `a <op> b` and display it as a number.
- Treat empty / non-numeric inputs as `0`.
- Division by zero should display the string `Infinity` (the natural JavaScript result of `n / 0`) — no special handling required.

## Files

```jsx file=App.jsx default
import { useState } from 'react';

export default function App() {
  // declare your state here

  // implement the calculate handler here

  return (
    <div>
      <input data-testid="a" type="number" />
      <input data-testid="b" type="number" />

      <label>
        <input data-testid="op-add" type="radio" name="op" value="+" />
        +
      </label>
      <label>
        <input data-testid="op-sub" type="radio" name="op" value="-" />
        -
      </label>
      <label>
        <input data-testid="op-mul" type="radio" name="op" value="*" />
        *
      </label>
      <label>
        <input data-testid="op-div" type="radio" name="op" value="/" />
        /
      </label>

      <button data-testid="calc">Calculate</button>

      <div data-testid="result"></div>
    </div>
  );
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

function setup(aVal, bVal, opTestId) {
  render(<App />);
  fireEvent.change(screen.getByTestId('a'), { target: { value: aVal } });
  fireEvent.change(screen.getByTestId('b'), { target: { value: bVal } });
  if (opTestId) fireEvent.click(screen.getByTestId(opTestId));
  fireEvent.click(screen.getByTestId('calc'));
}

test('result is empty before Calculate is pressed', () => {
  render(<App />);
  expect(screen.getByTestId('result').textContent).toBe('');
});

test('addition is the default operation', () => {
  setup('4', '6');
  expect(screen.getByTestId('result')).toHaveTextContent('10');
});

test('subtraction works', () => {
  setup('10', '3', 'op-sub');
  expect(screen.getByTestId('result')).toHaveTextContent('7');
});

test('multiplication works', () => {
  setup('4', '5', 'op-mul');
  expect(screen.getByTestId('result')).toHaveTextContent('20');
});

test('division works', () => {
  setup('20', '4', 'op-div');
  expect(screen.getByTestId('result')).toHaveTextContent('5');
});

test('division by zero shows Infinity', () => {
  setup('5', '0', 'op-div');
  expect(screen.getByTestId('result')).toHaveTextContent('Infinity');
});

test('result updates when Calculate is pressed again with new inputs', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('a'), { target: { value: '2' } });
  fireEvent.change(screen.getByTestId('b'), { target: { value: '3' } });
  fireEvent.click(screen.getByTestId('calc'));
  expect(screen.getByTestId('result')).toHaveTextContent('5');

  fireEvent.click(screen.getByTestId('op-mul'));
  fireEvent.change(screen.getByTestId('a'), { target: { value: '7' } });
  fireEvent.click(screen.getByTestId('calc'));
  expect(screen.getByTestId('result')).toHaveTextContent('21');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const [result, setResult] = useState('');

  function calculate() {
    const x = Number(a) || 0;
    const y = Number(b) || 0;
    let r;
    if (op === '+') r = x + y;
    else if (op === '-') r = x - y;
    else if (op === '*') r = x * y;
    else r = x / y;
    setResult(String(r));
  }

  return (
    <div>
      <input
        data-testid="a"
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />
      <input
        data-testid="b"
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />

      <label>
        <input
          data-testid="op-add"
          type="radio"
          name="op"
          value="+"
          checked={op === '+'}
          onChange={(e) => setOp(e.target.value)}
        />
        +
      </label>
      <label>
        <input
          data-testid="op-sub"
          type="radio"
          name="op"
          value="-"
          checked={op === '-'}
          onChange={(e) => setOp(e.target.value)}
        />
        -
      </label>
      <label>
        <input
          data-testid="op-mul"
          type="radio"
          name="op"
          value="*"
          checked={op === '*'}
          onChange={(e) => setOp(e.target.value)}
        />
        *
      </label>
      <label>
        <input
          data-testid="op-div"
          type="radio"
          name="op"
          value="/"
          checked={op === '/'}
          onChange={(e) => setOp(e.target.value)}
        />
        /
      </label>

      <button data-testid="calc" onClick={calculate}>
        Calculate
      </button>

      <div data-testid="result">{result}</div>
    </div>
  );
}
```

## Walkthrough

1. Four pieces of state model the form: two operands, the chosen operator, and the latest result.
2. Each control is *controlled* — its `value`/`checked` mirrors state, and its `onChange` writes back.
3. The calculation only runs when the user clicks **Calculate**, so we store the outcome in `result` rather than recomputing on every render.
4. Storing `op` as the literal symbol (`'+'`, `'-'`, `'*'`, `'/'`) makes the radio's `value` attribute and the calculator's logic line up directly.
