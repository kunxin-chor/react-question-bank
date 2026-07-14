---
title: Shared State Between Siblings
---

## Requirements

Build an app with three components: `App`, `TextInput`, and `Display`.

1. `App` owns a single state variable named `text` that starts as `"Start"`.
2. `TextInput` renders a controlled textbox (`data-testid="text-input"`) that shows `text`.
3. Typing in `TextInput` updates the `text` state in `App`.
4. `Display` renders the current `text` in an element with `data-testid="display"`.
5. `App` passes state and callbacks down so both child components stay in sync.

> **Hint:** this is the classic "lifting state up" pattern: siblings share state by moving it to their common parent.

## Files

```jsx file=App.jsx default
import { useState } from 'react';
import TextInput from './TextInput.jsx';
import Display from './Display.jsx';

export default function App() {
  // declare text state here

  return (
    <div>
      <TextInput />
      <Display />
    </div>
  );
}
```

```jsx file=TextInput.jsx
export default function TextInput(props) {
  return <input data-testid="text-input" type="text" />;
}
```

```jsx file=Display.jsx
export default function Display(props) {
  return <p data-testid="display">{/* show text here */}</p>;
}
```

## Tests

```js
import App from './App.jsx';
import { render, screen, fireEvent } from './__rtl__.js';

test('shows the initial text in both child components', () => {
  render(<App />);
  expect(screen.getByTestId('text-input').value).toBe('Start');
  expect(screen.getByTestId('display')).toHaveTextContent('Start');
});

test('changing the input child updates the display child', () => {
  render(<App />);
  fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'Shared value' } });
  expect(screen.getByTestId('text-input').value).toBe('Shared value');
  expect(screen.getByTestId('display')).toHaveTextContent('Shared value');
});
```

## Solution

```jsx file=App.jsx
import { useState } from 'react';
import TextInput from './TextInput.jsx';
import Display from './Display.jsx';

export default function App() {
  const [text, setText] = useState('Start');

  return (
    <div>
      <TextInput text={text} onTextChange={setText} />
      <Display text={text} />
    </div>
  );
}
```

```jsx file=TextInput.jsx
export default function TextInput(props) {
  return (
    <input
      data-testid="text-input"
      type="text"
      value={props.text}
      onChange={(e) => props.onTextChange(e.target.value)}
    />
  );
}
```

```jsx file=Display.jsx
export default function Display(props) {
  return <p data-testid="display">{props.text}</p>;
}
```

## Walkthrough

1. `TextInput` and `Display` are siblings, so neither should own the shared `text` state.
2. The shared state lives in `App`, their closest common parent.
3. `TextInput` receives both `props.text` and `props.onTextChange`, allowing it to display the value and request updates.
4. `Display` only needs `props.text`, because it displays the value but does not change it.
5. Updating the input changes state in `App`, then React re-renders both children with the new prop value.
